#!/usr/bin/env node
// Narrate a project, voicing only the lines that changed.
//
// Each line's wav and word timings depend only on its text, the voice, the speed and the model, so a
// line whose key is unchanged keeps what it has (scripts/lib/narration.mjs says where that is kept).
//
// HyperFrames' narration script (faceless-explainer's audio.mjs) is run as it is, not changed. This
// hands it a SCRIPT.md holding only the lines that need a voice, then puts the kept lines' files back
// and writes what a full run would have left: assets/voice/NN.wav for every line (NN.mp3 in a project that plays
// mp3, as the worked examples under videos/ do: no .wav is committed, D-305), audio_meta.json
// (frame-keyed, what captions / sync-durations / transcribe-missing / hold-durations / retime-frames /
// finish-project read) and audio_engine_meta.json (the engine's id-keyed sidecar, which `audio.mjs
// fetch-sfx` rebuilds audio_meta.json from), plus the record of what each line was made from.
//
// The voice is handed each line as it is said, not as it is written (lib/say.mjs): a script writes
// `claude -p`, `plan.md`, `/work`, and Kokoro is handed "claude dash p", "plan dot md", "slash work". The
// captions show the written form. A line with nothing written that way is handed over as it is, so its
// key, and its audio, are what they were.
//
// A run killed part way is resumed by the next one. audio.mjs hands back a line's word timings only
// when its whole call ends, so it is called for one line at a time (HYPERFRAMES_TTS_CONCURRENCY lines,
// when that is set above 1), and each line is put in the run's progress as soon as its call returns
// (scripts/lib/narration.mjs says where). The engine starts its TTS and transcriber per line anyway,
// so the only cost is starting node twice more a line. The storyboard's music is fetched once, by
// the last call: the others are handed a storyboard that says `music: none`.
//
// usage: reelplanner narrate <video-dir> [--speed 1.25] [--voice <id>] [--dry-run] [--json] [--adopt]
//   --speed    synthesised pace; default the one the project was last narrated at, else 1.25, the style
//              guide's (Kokoro needs patch-tts-speed for it)
//   --voice    the voice; default the one the project was last narrated with, else the remembered one
//   --dry-run  say what would be narrated and kept, and what it would cost, then stop
//   --adopt    a project narrated before this step, outside git: take its current voice files as the
//              narration of its current SCRIPT.md (only when you know they match)
//
// Which engine: HyperFrames' own (local Kokoro + whisper, or HeyGen / ElevenLabs when it finds their keys), unless
// .reelplanner/config.json's `narration.tts` or REELPLANNER_TTS names one (scripts/lib/narrator.mjs): then
// reelplanner's engine (scripts/lib/narrate-engine.mjs), handed to audio.mjs the same way, voices the lines through
// a hosted API (OpenAI, an OpenAI-compatible server, DeepInfra, ElevenLabs) or local Kokoro, with word timings from
// the provider, a transcription API or local whisper at a model of your choosing, several lines per call. The
// provider, its model and where the timings come from make the key's model, so switching any of them re-voices.
//
// Test seam: REELPLANNER_TTS_ENGINE names a stand-in for media-use's audio engine. It is handed to
// audio.mjs as HF_MEDIA_ENGINE (audio.mjs's own override), the Kokoro speed gate is skipped, and the
// model in the key is the engine's file name, so a test runs the real adapter with no Kokoro or whisper.
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, readdirSync, rmSync, renameSync } from "node:fs";
import { join, resolve, basename, delimiter } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { skillsDir } from "./hyperframes-skills.mjs";
import { ROOT, pkgDir, RP_COMMAND } from "./lib/env.mjs";
import { localVoiceNeeds, localToolsMissing, HOSTED_LINES, KEYS_URL } from "./lib/local-speed.mjs";
import { narrationSettings, keyModel, familyOf, loadEnvFile, envFileWarning, keyPlaces } from "./lib/narrator.mjs";
import { parseScript, scriptFor, planNarration, modelId, hyperframesCliPath, recordPath, progressDir, progressPath, PROGRESS, writeAtomic, sha256, costSentence, playsMp3 } from "./lib/narration.mjs";

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`);
const project = argv.find((a, i) => !a.startsWith("--") && !["--speed", "--voice"].includes(argv[i - 1]));
if (!project) { console.error("usage: reelplanner narrate <video-dir> [--speed 1.25] [--voice <id>] [--dry-run] [--json] [--adopt]"); process.exit(1); }
const dir = resolve(project);   // relative to the caller, never to where reelplanner is installed
const die = (m) => { console.error(`✗ narrate: ${m}`); process.exit(1); };
if (!existsSync(join(dir, "SCRIPT.md"))) die(`no SCRIPT.md in ${project}`);
if (!existsSync(join(dir, "STORYBOARD.md"))) die(`no STORYBOARD.md in ${project}`);

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const r3 = (x) => Number(x.toFixed(3));
const SK = skillsDir();
const ADAPTER = join(SK, "faceless-explainer", "scripts", "audio.mjs");
const FAKE = process.env.REELPLANNER_TTS_ENGINE ? resolve(process.env.REELPLANNER_TTS_ENGINE) : null;

// ── what this build asks for: provider, voice, speed, model ──────────────────────────────────────
const record = readJson(recordPath(dir)), prevEngine = readJson(join(dir, "audio_engine_meta.json")) || {};
const prevProgress = readJson(progressPath(dir));
// A rebuild keeps the pace the project was narrated at, as it keeps the voice: a video slowed for its audience (the
// system video, at 1.1) is not re-voiced at the default by the next plain `build`.
const speed = Number(flag("speed", null)) || Number(record?.speed) || Number(prevProgress?.speed) || 1.25;
let provider = "kokoro", tts = null;
// reelplanner's engine, when the settings name a provider (never under the test seam above)
loadEnvFile(dir);
{ const w = envFileWarning(dir); if (w) console.log(w); }
const S = FAKE ? { engine: "hyperframes" } : narrationSettings(dir);
if (S.error) die(S.error);
const OWN = S.engine === "reelplanner";
if (OWN) provider = S.tts;
else if (!FAKE) {
  // the engine's own choice (HeyGen credential → ElevenLabs key → Kokoro), made the way it makes it
  try {
    const lib = join(SK, "media-use", "audio", "scripts", "lib");
    const { loadEnvFromDir } = await import(pathToFileURL(join(lib, "heygen.mjs")).href);
    tts = await import(pathToFileURL(join(lib, "tts.mjs")).href);
    loadEnvFromDir(dir);
    provider = tts.pickProvider(null);
  } catch (e) { die(`cannot load media-use's TTS library from ${SK} (${e.message}) — run \`reelplanner hyperframes-skills\``); }
}
// (Kokoro through reelplanner's engine is named as HyperFrames' engine names it, so a video keeps its lines)
const model = FAKE ? `fake ${basename(FAKE)}`
  : OWN ? process.env.REELPLANNER_TTS_MODEL || keyModel(S, { kokoroModel: modelId("kokoro", { hyperframesCli: hyperframesCliPath() }).split(" + ")[0] })
  : modelId(provider, { hyperframesCli: hyperframesCliPath() });
// A rebuild keeps the voice the project was made with; a new project takes the remembered one, then
// the engine's default. Changing voice is a flag, and re-voices every line (the key holds the voice).
// With reelplanner's engine a recorded voice is kept only where it still exists: a video voiced by Kokoro
// (locally or on DeepInfra) keeps am_michael on either; one switched to OpenAI takes the settings' voice.
const same = (m) => !OWN || (!!m && familyOf(m) === S.family);
let voice = flag("voice", null) || (same(record?.model) && record?.voice) || (same(prevProgress?.model) && prevProgress?.voice)
  || (!OWN && prevEngine.voice_id) || (OWN && (S.voiceSet || S.family !== "kokoro") && S.voice) || null;
if (!voice && !FAKE && (!OWN || S.family === "kokoro")) {
  const r = spawnSync(process.execPath, [join(SK, "media-use", "scripts", "prefs.mjs"), "get", "--hyperframes", dir, "--json"], { encoding: "utf8" });
  try { voice = JSON.parse(r.stdout).voice?.value || null; } catch { /* no remembered voice */ }
}
if (!voice) voice = tts ? await tts.resolveVoiceId({ provider, userVoice: null, lang: "en" }) : OWN ? S.voice : "am_michael";
if (!voice) die(`no voice for narration "${S.tts}": set narration.voice in .reelplanner/config.json (one of the server's voices), or pass --voice`);

const plan = planNarration(dir, { voice, speed, model, adopt: has("adopt") });
const from = { record: "the narration record", git: `the narration committed in ${plan.note}`, adopt: "the current voice files (--adopt)", progress: "a run that did not finish", none: "nothing (no narration record yet)" }[plan.source]
  + (plan.resumed && plan.source !== "progress" ? `, and ${plan.resumed} from a run that did not finish` : "");
const cost = { total: plan.lines.length, lines: plan.narrate.map((l) => l.frame), speech_s: 0, estimate_s: plan.estimate_s, source: plan.source };
if (has("json") && has("dry-run")) {
  console.log(JSON.stringify({ voice, speed, model, source: plan.source, narrate: plan.narrate.map((l) => l.frame), keep: plan.keep.map((l) => l.frame), estimate_s: plan.estimate_s }, null, 2));
  process.exit(0);
}
console.log(`narrate ${project}: ${voice} · ×${speed} · ${model}`);
console.log(`  kept lines from ${from}`);
console.log(`  ${costSentence(cost)}${plan.narrate.length ? `: frame${plan.narrate.length === 1 ? "" : "s"} ${plan.narrate.map((l) => l.frame).join(", ")}` : ""}`);
if (OWN) console.log(`  reelplanner's engine: ${S.hosted ? "hosted" : "local Kokoro"}, ${S.concurrency} line${S.concurrency === 1 ? "" : "s"} at a time (${S.from.join(" and ")})`);
// a missing key stops the run before anything is touched, saying what to set (a dry run only says so)
if (OWN && S.missing.length && plan.narrate.length) {
  const them = S.missing.length === 1 ? "it" : "them";
  const m = `${S.missing.join(" and ")} ${S.missing.length === 1 ? "is" : "are"} not set: narration "${S.tts}"${S.timingsApi ? ` with word timings from ${S.timingsApi.name}` : ""} needs ${them}: ${keyPlaces(them)}`;
  if (has("dry-run")) console.log(`  △ ${m}`); else die(m);
}
// narration here runs the local voice and it is not installed (`setup` skips it when narration is hosted, or with
// --hosted-voice): stop before anything is touched, saying both ways on. (Not under a stand-in HyperFrames CLI.)
if (plan.narrate.length && !FAKE && !process.env.REELPLANNER_HYPERFRAMES_BIN) {
  const need = localVoiceNeeds(OWN ? S : { engine: "hyperframes" }, { provider });
  const gone = localToolsMissing(process.env, need);
  if (gone.length) {
    const why = OWN ? `narration here is ${S.tts === "kokoro" ? "local Kokoro" : `${S.tts}, timed by local whisper`} (from ${S.from.join(" and ")})` : "narration here is the local voice (the default: no hosted voice is set)";
    const m = `${gone.join(" and ")} ${gone.length === 1 ? "is" : "are"} not installed, and ${why}. Either install the local voice: \`${RP_COMMAND} setup --local-voice\` (free; about 840 MB once; needs Python 3.10+), or narrate with the hosted voice: put ${HOSTED_LINES.join(" and ")} in ~/.reelplanner/.env (a key from ${KEYS_URL}), then run \`${RP_COMMAND} narration-check\``;
    if (has("dry-run")) console.log(`  △ ${m}`); else die(m);
  }
}
if (has("dry-run")) process.exit(0);

// ── voice the lines that need it ─────────────────────────────────────────────────────────────────
const t0 = Date.now();
const work = mkdtempSync(join(tmpdir(), "rp-narrate-"));
const voiceDir = join(dir, "assets", "voice");
const PDIR = progressDir(dir);
// a kept line's copy has its file's kind: a project committed as mp3 (the worked examples, D-305) keeps mp3
const extOf = (p) => (/\.mp3$/.test(p) ? ".mp3" : ".wav");
const stashOf = (key, ext = ".wav") => join(PDIR, `${key}${ext}`), stashRel = (key, ext = ".wav") => join(PROGRESS, `${key}${ext}`);
// a project that plays mp3 stays so: each line voiced now is written as mp3 too (48 kbps mono, as the examples' are)
const asMp3 = playsMp3(dir);
const toMp3 = (wav) => {
  const mp3 = wav.replace(/\.wav$/, ".mp3");
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "48k", "-ac", "1", mp3], { stdio: ["ignore", "ignore", "pipe"] });
  if (r.status !== 0) { console.log(`  △ ${basename(wav)} stays a wav: ffmpeg could not make an mp3 of it (${r.error?.message || String(r.stderr).trim()})`); return null; }
  return mp3;
};
// the run's progress (lib/narration.mjs): every line it has in hand, by key, each with its own copy
const progress = { version: 1, voice, speed, model, engine: prevProgress?.engine ?? null, lines: {} };
const saveProgress = () => writeAtomic(progressPath(dir), JSON.stringify(progress, null, 2) + "\n");
// a copy, written whole or not at all: a half-copied file must not sit under a name the progress trusts
const stash = (src, key) => {
  const dst = stashOf(key, extOf(src));
  if (resolve(src) === dst) return;
  const tmp = `${dst}.${process.pid}.tmp`;
  copyFileSync(src, tmp);
  renameSync(tmp, dst);
};
let made = { voices: [] };
try {
  // Keep the files first: audio.mjs writes assets/voice/<frame>.wav, and a kept line may be moving to
  // a frame an edited one is about to be written to (a line inserted in the middle renumbers the rest).
  // The copies are in the project, not in a scratch dir, so a run killed before it finishes loses none.
  mkdirSync(PDIR, { recursive: true });
  writeFileSync(join(PDIR, ".gitignore"), "# reelplanner narrate's progress while it runs (removed when it finishes)\n*\n");
  for (const l of plan.keep) {
    stash(join(dir, l.keep.path), l.key);
    progress.lines[l.key] = { text: l.text, path: stashRel(l.key, extOf(l.keep.path)), sha256: l.keep.sha256, duration_s: l.keep.duration_s, words: l.keep.words };
  }
  saveProgress();
  // put every kept file back where it was, so the record still describes it and a rerun keeps it
  const putBack = () => { for (const l of plan.keep) { const c = stashOf(l.key, extOf(l.keep.path)); if (resolve(join(dir, l.keep.path)) !== c) copyFileSync(c, join(dir, l.keep.path)); } };

  if (plan.narrate.length) {
    if (!existsSync(ADAPTER)) die(`${ADAPTER} not found — run \`reelplanner hyperframes-skills\``);
    const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", HYPERFRAMES_NO_UPDATE_CHECK: "1", HYPERFRAMES_SKIP_SKILLS: "1" };
    // one line at a time: at the engine's default of 4, the whisper runs fight over the cores and time out with no words
    env.HYPERFRAMES_TTS_CONCURRENCY = process.env.HYPERFRAMES_TTS_CONCURRENCY || "1";
    env.HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS = process.env.HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS || "600000";
    if (FAKE) env.HF_MEDIA_ENGINE = FAKE;
    else if (OWN) {
      // reelplanner's engine, under the same adapter; music and sound effects still go to HyperFrames' engine
      env.HF_MEDIA_ENGINE = join(ROOT, "scripts", "lib", "narrate-engine.mjs");
      env.REELPLANNER_MEDIA_ENGINE = process.env.REELPLANNER_MEDIA_ENGINE || join(SK, "media-use", "audio", "scripts", "audio.mjs");
      env.REELPLANNER_NARRATION = JSON.stringify({ ...S, keyModel: model });
      // a hosted line waits on the network, not the CPU: several to a call, the engine runs them at once
      env.HYPERFRAMES_TTS_CONCURRENCY = String(S.concurrency);
    }
    if (!FAKE) {
      const chk = spawnSync(process.execPath, [join(ROOT, "scripts", "hyperframes-skills.mjs"), "--check"], { stdio: ["ignore", "ignore", "inherit"] });
      if (chk.status !== 0) die("not started — the HyperFrames skills above cannot load");
      if (provider === "kokoro" && speed !== 1 && !OWN) {   // reelplanner's engine hands Kokoro --speed itself
        const p = spawnSync(process.execPath, [join(ROOT, "scripts", "patch-tts-speed.mjs"), "--check"], { stdio: "inherit" });
        if (p.status !== 0) die("not started — Kokoro would drop --speed (run `reelplanner patch-tts-speed`)");
      }
      // `hyperframes tts` / `transcribe` are run through npx: put the pinned CLI first on PATH
      const hf = pkgDir("hyperframes");
      const bin = hf && [join(hf, "..", ".bin"), join(hf, "..", "..", ".bin")].find((d) => existsSync(join(d, "hyperframes")));
      if (bin) env.PATH = `${bin}${delimiter}${process.env.PATH || ""}`;
    }
    // Each call voices one line (as many as the engine runs at once, when that is raised) and returns
    // its word timings, so a line is in the progress as soon as its call ends. The storyboard's music
    // is fetched by the last call only; audio.mjs reads nothing else from the storyboard it is handed.
    const per = Math.max(1, Math.floor(Number(env.HYPERFRAMES_TTS_CONCURRENCY)) || 1);
    const calls = [];
    for (let i = 0; i < plan.narrate.length; i += per) calls.push(plan.narrate.slice(i, i + per));
    const quiet = join(work, "STORYBOARD.md");
    writeFileSync(quiet, "---\nmusic: none\n---\n");
    const fail = (m) => { putBack(); rmSync(work, { recursive: true, force: true }); die(m); };
    let last = null;
    for (const [i, lines] of calls.entries()) {
      const final = i === calls.length - 1, cdir = join(work, `call-${i + 1}`);
      mkdirSync(cdir);
      const script = join(cdir, "SCRIPT.md");
      writeFileSync(script, `# SCRIPT — only the lines to narrate (reelplanner narrate)\n\n${scriptFor(lines)}`);
      // the filtered script must read back to exactly the lines and text the keys were made from
      const back = parseScript(readFileSync(script, "utf8"));
      if (JSON.stringify(back) !== JSON.stringify(lines.map((l) => ({ frame: l.frame, text: l.said })))) fail("the filtered SCRIPT.md does not read back to the same lines");
      if (calls.length > 1) console.log(`  · ${i + 1}/${calls.length}: frame${lines.length === 1 ? "" : "s"} ${lines.map((l) => l.frame).join(", ")}`);
      const r = spawnSync(process.execPath, [ADAPTER, "--script", script, "--storyboard", final ? join(dir, "STORYBOARD.md") : quiet, "--hyperframes", dir, "--out", join(cdir, "audio_meta.json"), "--voice", voice, "--speed", String(speed)], { stdio: "inherit", env });
      if (r.status !== 0) fail(`audio.mjs exited ${r.status ?? r.signal}; the kept lines are back as they were, and a rerun voices only the rest`);
      const got = readJson(join(cdir, "audio_engine_meta.json")) || fail("audio.mjs wrote no audio_engine_meta.json; the kept lines are back as they were, and a rerun voices only the rest");
      for (const v of got.voices || []) {
        const l = lines.find((x) => x.id === String(v.id));
        if (!l) continue;
        made.voices.push(v);
        // a line with no word timings is not kept from here: a rerun voices it again
        if (!v.words?.length || !existsSync(join(dir, v.path))) continue;
        stash(join(dir, v.path), l.key);
        progress.lines[l.key] = { text: l.text, path: stashRel(l.key), sha256: sha256(stashOf(l.key)), duration_s: v.duration_s, words: v.words.map((w) => ({ id: w.id, text: w.text, start: w.start, end: w.end })) };
      }
      // what the engine says of the run as a whole (provider, voice, music) is the last call's, as it would be of one call
      last = got;
      if (final) progress.engine = Object.fromEntries(Object.entries(got).filter(([k]) => !["voices", "sfx", "total_duration_s"].includes(k)));
      saveProgress();
    }
    made = { ...last, voices: made.voices };
  }

  // ── put it together: every line, kept or new, in SCRIPT order ──────────────────────────────────
  const fresh = Object.fromEntries((made.voices || []).map((v) => [String(v.id), v]));
  const voices = [], missing = [], entries = {};
  for (const l of plan.lines) {
    const ext = l.keep ? extOf(l.keep.path) : ".wav";
    let rel = `assets/voice/${l.id}${ext}`, abs = join(dir, rel);
    let v;
    if (l.keep) {
      mkdirSync(voiceDir, { recursive: true });
      copyFileSync(stashOf(l.key, ext), abs);
      v = { id: l.id, path: rel, duration_s: l.keep.duration_s, words: l.keep.words.map((w, i) => ({ id: w.id ?? `w${i}`, text: w.text, start: w.start, end: w.end })) };
    } else if (fresh[l.id]) {
      const f = fresh[l.id];
      v = { id: l.id, path: rel, duration_s: f.duration_s, words: (f.words || []).map((w) => ({ id: w.id, text: w.text, start: w.start, end: w.end })) };
    } else { missing.push(l.frame); continue; }
    // a project committed as mp3 gets its new line as mp3
    if (asMp3 && ext === ".wav") { const mp3 = toMp3(abs); if (mp3) { rel = v.path = `assets/voice/${l.id}.mp3`; abs = mp3; } }
    voices.push(v);
    entries[l.id] = { key: l.key, text: l.text, ...(l.said !== l.text ? { said: l.said } : {}), sha256: sha256(abs), duration_s: v.duration_s };
  }
  // voice files of lines that no longer exist would be committed and never played
  const live = new Set(voices.map((v) => basename(v.path)));
  // (in a project that plays mp3, a line's wav beside its mp3 is left: never committed, D-305, and never played)
  const twin = (f) => asMp3 && f.endsWith(".wav") && live.has(f.replace(/\.wav$/, ".mp3"));
  const stale = existsSync(voiceDir) ? readdirSync(voiceDir).filter((f) => /^\d+\.(wav|mp3)$/.test(f) && !live.has(f) && !twin(f)) : [];
  for (const f of stale) rmSync(join(voiceDir, f));

  // The engine's sidecar, as a full run leaves it: this run's provider, voice and bgm when audio.mjs
  // ran (a full run fetches bgm too), the previous build's when nothing needed a voice; sfx carried
  // over, as the engine's own --only tts,bgm merge carries it (fetch-sfx then recomputes it).
  // (a run that voiced nothing but picks up one that did not finish takes that run's)
  const base = plan.narrate.length ? made : (progress.engine || prevEngine);
  const BGM = ["bgm_pending", "bgm_provider", "bgm_pid", "bgm_log", "bgm_mode", "bgm_target_duration_s", "bgm_seed_duration_s", "bgm_loop_count"];
  const engine = {
    tts_provider: made.tts_provider || base.tts_provider || prevEngine.tts_provider || provider,
    voice_id: made.voice_id || voice,
    bgm: base.bgm ?? null,
    ...Object.fromEntries(BGM.map((k) => [k, base[k] ?? (k === "bgm_pending" ? false : null)])),
    voices,
    sfx: prevEngine.sfx ?? made.sfx ?? [],
    total_duration_s: r3(voices.reduce((a, v) => a + (v.duration_s || 0), 0)),
  };
  writeAtomic(join(dir, "audio_engine_meta.json"), JSON.stringify(engine, null, 2));
  writeAtomic(join(dir, "audio_meta.json"), JSON.stringify(toFrameMeta(engine), null, 2));
  writeAtomic(recordPath(dir), JSON.stringify({ version: 1, voice, speed, model, lines: entries }, null, 2) + "\n");
  // the record now holds every line: the progress is done with (a kill before this line leaves it,
  // and the next run keeps every line from it)
  rmSync(PDIR, { recursive: true, force: true });

  const secs = Math.round((Date.now() - t0) / 1000);
  console.log(`${missing.length ? "✗" : "✓"} narrate: ${plan.narrate.length - missing.length} line(s) narrated, ${plan.keep.length} kept byte for byte, in ${secs} s → audio_meta.json`
    + (stale.length ? ` · removed ${stale.length} voice file(s) of lines no longer in SCRIPT.md` : "")
    + (missing.length ? `\n  no voice came back for frame(s) ${missing.join(", ")} (see the anomalies above); run narrate again to retry just those` : ""));
  const noWords = voices.filter((v) => !v.words.length).map((v) => Number(v.id));
  if (noWords.length) console.log(`  △ no word timings for frame(s) ${noWords.join(", ")} — \`reelplanner transcribe-missing ${project}\` repairs them`);
  process.exitCode = missing.length ? 1 : 0;
} finally { rmSync(work, { recursive: true, force: true }); }

// The engine's id-keyed meta → the frame-keyed audio_meta.json, exactly as audio.mjs's
// toProductLaunchMeta shapes it (captions.mjs, assemble-index.mjs and our own scripts read this one).
function toFrameMeta(neutral) {
  const voices = (neutral.voices ?? []).map((v) => ({ frame: Number(v.id), path: v.path, duration_s: v.duration_s, words: (v.words ?? []).map((w) => ({ id: w.id, text: w.text, start: w.start, end: w.end })) }));
  const bgm = neutral.bgm ? { path: neutral.bgm.path, volume: neutral.bgm.volume, query: neutral.bgm.query ?? null, duration_s: neutral.bgm.duration_s ?? null } : null;
  const sfx = (neutral.sfx ?? []).map((s) => ({ frame: Number(s.id), file: s.file, offset_s: s.offset_s ?? 0, duration_s: s.duration_s ?? 1, volume: s.volume ?? 0.35 }));
  return { bgm, bgm_pending: !!neutral.bgm_pending, voices, sfx };
}
