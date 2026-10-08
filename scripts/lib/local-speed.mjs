// Is local narration fast enough on this machine? One sentence through local Kokoro + whisper small.en (what
// HyperFrames' engine runs for each line, one at a time), timed, and one plain line: fine, or slow with what to do
// instead (the hosted voice, OpenRouter's). Local narration always works; on a small machine it is slow (2–3 minutes
// a line on a 2-CPU droplet), and a new user should hear that before the first video, not after an hour of it.
//
// `reelplanning setup` runs it (and `setup --dry-run` says it would), only when Kokoro and whisper.cpp are installed
// and no hosted engine is set; `reelplanning narration-check --local` runs it on its own, with each step's lines.
// It writes nothing in the repo; the first time, it fetches Kokoro's and whisper's models (about 840 MB, once,
// untimed: narrate would fetch them on the first line anyway).
//
// It also says whether setup installs the local voice at all (localVoicePlan): not when narration here is hosted
// (the settings narrate reads: the shell, the repo's .reelplanning/.env, ~/.reelplanning/.env, config.json), or when
// `setup --hosted-voice` asks it not to; `setup --local-voice` installs it whatever narration uses.
//
// usage (setup): node scripts/lib/local-speed.mjs [--dry-run] [<dir>]       always exits 0: a slow machine is advice, not a failure
//        node scripts/lib/local-speed.mjs --plan [--hosted-voice|--local-voice] [<dir>]
//              → a first line `kokoro=0|1 whisper=0|1 pending=0|1` (what to install; the hosted voice asked for, not set
//                yet), then the lines setup prints
//
// Test seams: REELPLANNING_HYPERFRAMES_BIN (scripts/lib/tts-local.mjs) stands in for the HyperFrames CLI;
// REELPLANNING_LOCAL_SPEED_TIMEOUT_S sets the time limit (default 30).
import { existsSync, mkdtempSync, rmSync, statSync, accessSync, constants } from "node:fs";
import { join, resolve, delimiter } from "node:path";
import { tmpdir, homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { kokoro, whisper } from "./tts-local.mjs";
import { loadEnvFile, narrationSettings, heygenSet, envSource, envFileLabel, homeEnvPath, DEFAULT_WHISPER } from "./narrator.mjs";
import { RP_COMMAND } from "./env.mjs";

// A plan video has 40–100 lines; 60 is a typical one.
export const LINES = 60;
// Over 20 s a line, a 60-line plan video takes over 20 minutes to narrate, and a rebuild after a review re-voices
// the changed lines at the same pace: the review loop then waits on the voice. The hosted voice narrates the same
// video in under a minute (a 12-line video in 19 s, measured), for about $0.03 a minute of narration. Under 20 s a
// line, local narration finishes while the frames are being built (narrate runs in the background), so it is fine.
export const SLOW_S = 20;
// The check stops after this long: past it the machine is slow anyway, and setup should not hang on it.
export const timeoutS = (env = process.env) => Math.max(0.1, Number(env.REELPLANNING_LOCAL_SPEED_TIMEOUT_S) || 30);
// One line as long as a plan video's usual one (19 words), with a pause in it.
export const SPEED_TEXT = "The review page stops at each open choice, and your answer goes into the decision log beside the plan.";
export const VOICE = "am_michael", SPEED = 1.25;

const isExec = (p) => { try { accessSync(p, constants.X_OK); return statSync(p).isFile(); } catch { return false; } };
/** whisper.cpp where HyperFrames looks for it: PATH, $HYPERFRAMES_WHISPER_PATH, its own build cache, Homebrew. */
export function whisperPath(env = process.env) {
  for (const d of String(env.PATH || "").split(delimiter)) if (d && isExec(join(d, "whisper-cli"))) return join(d, "whisper-cli");
  if (env.HYPERFRAMES_WHISPER_PATH && isExec(env.HYPERFRAMES_WHISPER_PATH)) return env.HYPERFRAMES_WHISPER_PATH;
  const w = join(homedir(), ".cache", "hyperframes", "whisper", "whisper.cpp");
  return [join(w, "build", "bin", "whisper-cli"), join(w, "build", "whisper-cli"), "/opt/homebrew/bin/whisper-cli"].find(isExec) || null;
}
/** What local narration needs that is not here: "Kokoro TTS" (kokoro-onnx in HyperFrames' python), "whisper.cpp". */
export function localToolsMissing(env = process.env, { kokoro = true, whisper = true } = {}) {
  const missing = [];
  if (kokoro && spawnSync(env.HYPERFRAMES_PYTHON || "python3", ["-c", "import kokoro_onnx, soundfile"], { stdio: "ignore", env, timeout: 60000 }).status !== 0) missing.push("Kokoro TTS");
  if (whisper && !whisperPath(env)) missing.push("whisper.cpp");
  return missing;
}

// The hosted voice: the two lines in ~/.reelplanning/.env that choose it (README, "The voice"; docs/reference.md,
// "Narration engines"), and where its key comes from
export const HOSTED_LINES = ["REELPLANNING_TTS=openrouter", "OPENROUTER_API_KEY=…"];
export const KEYS_URL = "https://openrouter.ai/settings/keys";

/**
 * What of the local voice narration here runs on this machine: { kokoro, whisper }, from the settings narrate reads
 * (`s`, narrationSettings) and, when HyperFrames' engine narrates, the provider it picks (`provider`; else HeyGen when
 * its credential is set). HeyGen, and a hosted engine with hosted word timings, need neither; a hosted voice timed by
 * local whisper needs whisper.cpp alone. Settings that cannot work are taken as the default: both.
 */
export function localVoiceNeeds(s, { env = process.env, provider = null } = {}) {
  if (s.error) return { kokoro: true, whisper: true };
  if (s.engine === "reelplanning") return { kokoro: s.tts === "kokoro", whisper: s.timings === "local" };
  const p = provider || (heygenSet(env) ? "heygen" : "kokoro");
  if (p === "heygen") return { kokoro: false, whisper: false };
  if (p === "elevenlabs" && provider) return { kokoro: false, whisper: true };   // as picked: its pip package is there
  return { kokoro: true, whisper: true };   // Kokoro + whisper (and for setup, an ElevenLabs key alone: its package may be missing)
}

/**
 * Setup's choice about the local voice (Kokoro, its models and whisper.cpp), from the settings narrate reads.
 * → { kokoro, whisper, pending, lines }: what to install, whether the hosted voice was asked for (`hostedVoice`) but is
 * not set yet, and the lines setup prints before its Kokoro step. `localVoice`: install it whatever narration uses.
 */
export function localVoicePlan(dir, { hostedVoice = false, localVoice = false, env = process.env, rp = RP_COMMAND } = {}) {
  if (localVoice) return { kokoro: true, whisper: true, pending: false, lines: [] };
  loadEnvFile(dir);
  const s = narrationSettings(dir, env), need = localVoiceNeeds(s, { env });
  if (!need.kokoro) {
    const what = s.engine === "reelplanning" ? s.tts : "HeyGen";
    const from = s.engine !== "reelplanning" ? "a HeyGen credential is set"
      : `from ${envSource("REELPLANNING_TTS", env) || (env.REELPLANNING_TTS ? "the shell's REELPLANNING_TTS" : ".reelplanning/config.json")}`;
    return { ...need, pending: false, lines: [need.whisper
      ? `✓ local voice: Kokoro skipped — speech is hosted (${what}, ${from}), but its word timings are local, so whisper.cpp is still installed; \`${rp} setup --local-voice\` installs Kokoro anyway`
      : `✓ local voice: skipped — narration is hosted (${what}, ${from}); \`${rp} setup --local-voice\` installs it anyway`] };
  }
  if (hostedVoice) return { kokoro: false, whisper: false, pending: true, lines: [
    `✓ local voice: skipped (--hosted-voice). Narration uses the hosted voice once these two lines are in ${envFileLabel(homeEnvPath(env), dir)}:`,
    ...HOSTED_LINES.map((l) => `    ${l}`),
    `  (a key from ${KEYS_URL}; about $0.03 a minute of narration)`,
  ] };
  // the default: the local voice, installed. Said first when some of it is not here yet, with how to skip it.
  const todo = localToolsMissing(env).length || modelsMissing().length;
  return { ...need, pending: false, lines: todo ? [`· local voice: installing it (Kokoro and whisper.cpp, free; about 840 MB of models, once; needs Python 3.10+). \`${rp} setup --hosted-voice\` skips it and narrates with the hosted voice instead`] : [] };
}
/** The model files HyperFrames fetches on first use (its cache, ~/.cache/hyperframes), that are not there yet. */
export function modelsMissing() {
  const c = join(homedir(), ".cache", "hyperframes");
  return [join(c, "tts", "models", "kokoro-v1.0.onnx"), join(c, "tts", "voices", "voices-v1.0.bin"), join(c, "whisper", "models", `ggml-${DEFAULT_WHISPER}.bin`)].filter((f) => !existsSync(f));
}

/** Fetch the models with one untimed run (a word through Kokoro and whisper). → null, or what went wrong */
export async function fetchModels() {
  const work = mkdtempSync(join(tmpdir(), "rp-local-speed-"));
  try {
    const wav = join(work, "fetch.wav"), cap = 20 * 60 * 1000;
    await kokoro("Hello.", wav, { voice: VOICE, cwd: work, timeoutMs: cap });
    await whisper(wav, { model: DEFAULT_WHISPER, cwd: work, timeoutMs: cap });
    return null;
  } catch (e) { return e.message; } finally { rmSync(work, { recursive: true, force: true }); }
}

/** Time `text` through local Kokoro + whisper, stopped at the limit. → { seconds, speech_s, timings_s } | { timedOut: true } | { error } */
export async function timeLocal({ text = SPEED_TEXT, limitS = timeoutS() } = {}) {
  const work = mkdtempSync(join(tmpdir(), "rp-local-speed-")), wav = join(work, "line.wav"), limit = limitS * 1000;
  const t0 = performance.now(), took = () => (performance.now() - t0) / 1000;
  try {
    await kokoro(text, wav, { voice: VOICE, speed: SPEED, cwd: work, timeoutMs: limit });
    const speech_s = took(), left = limit - speech_s * 1000;
    if (left <= 0) return { timedOut: true };
    await whisper(wav, { model: DEFAULT_WHISPER, cwd: work, timeoutMs: left });
    return { seconds: took(), speech_s, timings_s: took() - speech_s };
  } catch (e) { return e.timedOut ? { timedOut: true } : { error: e.message }; } finally { rmSync(work, { recursive: true, force: true }); }
}

/** The verdict, from the seconds one line took (or that it did not finish in `limitS`). → { fast, lines: [...] } */
export function speedVerdict(seconds, { timedOut = false, limitS = timeoutS(), rp = RP_COMMAND } = {}) {
  const lim = Math.round(limitS), mins = (timedOut ? limitS : seconds) * LINES / 60;
  const per = timedOut ? `over ${lim} s a line here (one sentence did not finish in ${lim} s)`
    : seconds < 1 ? "under 1 s a line here" : `about ${Math.round(seconds)} s a line here`;
  const video = mins < 1 ? (timedOut ? "over" : "under") + " a minute" : `${timedOut ? "over" : "about"} ${Math.round(mins)} min`;
  const head = `local narration: ${per}, ${video} for a plan video (${LINES} lines)`;
  if (!timedOut && seconds <= SLOW_S) return { fast: true, lines: [`✓ ${head}: fine`] };
  return { fast: false, lines: [
    `△ ${head}: slow`,
    "  the hosted voice is much faster: a line in 1–3 s, about $0.03 a minute of narration (Deepgram Aura-2 on OpenRouter). To use it:",
    "    put REELPLANNING_TTS=openrouter and OPENROUTER_API_KEY=… in ~/.reelplanning/.env (this machine, every repo; a key from https://openrouter.ai/settings/keys)",
    `    then run: ${rp} narration-check`,
    "  local narration still works here, just slower",
  ] };
}

// ── setup's step ─────────────────────────────────────────────────────────────────────────────────────
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), dry = args.includes("--dry-run"), dir = resolve(args.find((a) => !a.startsWith("--")) || process.cwd());
  const say = (l) => console.log(l);
  if (args.includes("--plan")) {
    const p = localVoicePlan(dir, { hostedVoice: args.includes("--hosted-voice"), localVoice: args.includes("--local-voice") });
    say(`kokoro=${+p.kokoro} whisper=${+p.whisper} pending=${+p.pending}`);
    for (const l of p.lines) say(l);
    process.exit(0);
  }
  loadEnvFile(dir);
  const s = narrationSettings(dir);
  const limit = timeoutS();
  if (s.error) { say("△ local narration: not timed: the narration settings need fixing first (above)"); process.exit(0); }
  if (s.engine === "reelplanning" ? s.hosted : heygenSet()) { say(`✓ local narration: not timed: narration here is hosted (${s.keyModel || "HeyGen, a HeyGen credential is set"})`); process.exit(0); }
  const missing = localToolsMissing(), models = modelsMissing();
  const what = `one sentence through local Kokoro + whisper ${DEFAULT_WHISPER}`;
  if (dry) {
    say(missing.length ? `· would time ${what} once ${missing.join(" and ")} ${missing.length === 1 ? "is" : "are"} installed, and say whether local narration is fast enough here`
      : `· would time ${what} (at most ${limit} s${models.length ? ", after fetching their models once, about 840 MB" : ""}) and say whether local narration is fast enough here`);
    process.exit(0);
  }
  if (missing.length) { say(`△ local narration: not timed: ${missing.join(" and ")} ${missing.length === 1 ? "is" : "are"} missing (above); once installed, \`${RP_COMMAND} narration-check --local\` times it`); process.exit(0); }
  if (models.length) {
    say("▶ fetching Kokoro's and whisper's models (about 840 MB, once)");
    const err = await fetchModels();
    if (err) { say(`△ local narration: not timed: fetching the models failed: ${err}`); process.exit(0); }
  }
  say(`▶ timing ${what} (at most ${limit} s)`);
  const r = await timeLocal({ limitS: limit });
  if (r.error) say(`△ local narration: not timed: ${r.error}; \`${RP_COMMAND} narration-check --local\` says more`);
  else for (const l of speedVerdict(r.seconds, { timedOut: r.timedOut, limitS: limit }).lines) say(l);
  process.exit(0);
}
