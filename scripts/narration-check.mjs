#!/usr/bin/env node
// Voice one sentence with the narration engine you picked, and say whether it works: a minute's test of a
// hosted provider with a real key, before a whole video is narrated with it (docs/reference.md, "Narration engines").
//
// It resolves the settings as `narrate` does (scripts/lib/narrator.mjs: .reelplanner/config.json's narration
// here, then the environment: the shell's, then .reelplanner/.env, then a .env beside it, then this machine's
// ~/.reelplanner/.env), with any flag below over
// them; voices the sentence in a
// scratch folder of its own; gets its word timings; and prints, a line each: the engine and why; the speech
// request (seconds taken, audio length, format); the word timings (count, the first few, whether they cover
// the audio); the cost of a minute of narration where docs/reference.md gives a figure; and on a failure the
// API's status and answer and what to set or change. It writes nothing in the repo and prints no key.
//
// usage: reelplanner narration-check [--tts <provider>] [--model <id>] [--voice <id>] [--base-url <url>]
//          [--timings local|api|provider] [--timings-api groq|openai|openrouter] [--whisper-model <name>]
//          [--text "<sentence>"] [--speed <x>] [--keep <dir>]
//        reelplanner narration-check --local           is local narration fast enough here?
//   --tts            openai, openai-compatible, deepinfra, openrouter, elevenlabs or kokoro (local); with no flag
//                    at all, what narrate would use here (the default, HyperFrames' engine, is checked as kokoro)
//   --timings        where word timings come from: the provider's own, a transcription API, or local whisper
//   --timings-api    the transcription API (implies --timings api); --whisper-model implies --timings local
//   --text           the sentence (default one with a name and a number, which transcribers get wrong first)
//   --speed          the pace asked for (default 1.25, narrate's)
//   --keep <dir>     keep narration-check.wav and narration-check.json (the word timings) in <dir>
//   --local          local Kokoro + whisper small.en whatever the settings say, a line as long as a plan video's,
//                    stopped after 30 s, and a verdict: about N s a line, M minutes for a plan video, fine or slow;
//                    slow (over 20 s a line) says how to switch to the hosted voice (scripts/lib/local-speed.mjs).
//                    Every check of local Kokoro + local whisper ends with that verdict.
// Keys go in ~/.reelplanner/.env (this machine, every repo), the repo's .reelplanner/.env (git ignores it), or
// the shell's environment; the engine line says which file a setting or key came from. A .reelplanner/.env git would
// commit is warned about. Exits 1 when the speech or the timings fail (or --local finds Kokoro or whisper missing),
// 2 on a usage error; slow is not a failure.
//
//   reelplanner narration-check --tts openrouter                 # one key, OPENROUTER_API_KEY, for both (recommended)
//   reelplanner narration-check --tts openai --timings-api groq
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { narrationSettings, loadEnvFile, envFileWarning, envSource, setAs, keyPlaces, TTS, TIMINGS, TIMINGS_APIS, DEFAULT_WHISPER } from "./lib/narrator.mjs";
import { synthesize, transcribe, alignWords, parseWav } from "./lib/tts-api.mjs";
import { kokoro, whisper } from "./lib/tts-local.mjs";
import { SPEED_TEXT, timeoutS, speedVerdict, localToolsMissing, modelsMissing, fetchModels } from "./lib/local-speed.mjs";
import { RP_COMMAND } from "./lib/env.mjs";

const VALUE_FLAGS = ["tts", "model", "voice", "base-url", "timings", "timings-api", "whisper-model", "text", "speed", "keep"], BOOL_FLAGS = ["local"];
const USAGE = "usage: reelplanner narration-check [--tts <provider>] [--model <id>] [--voice <id>] [--base-url <url>] [--timings local|api|provider] [--timings-api groq|openai|openrouter] [--whisper-model <name>] [--text \"<sentence>\"] [--speed <x>] [--keep <dir>] | --local";
const argv = process.argv.slice(2), opt = {};
for (let i = 0; i < argv.length; i++) {
  const n = argv[i].replace(/^--/, "");
  if (argv[i].startsWith("--") && BOOL_FLAGS.includes(n)) { opt[n] = true; continue; }
  if (!argv[i].startsWith("--") || !VALUE_FLAGS.includes(n) || i + 1 >= argv.length) { console.error(`✗ narration-check: ${argv[i].startsWith("--") && VALUE_FLAGS.includes(n) ? `${argv[i]} needs a value` : `unknown argument ${argv[i]}`}\n${USAGE}`); process.exit(2); }
  opt[n] = argv[++i];
}
const usage = (m) => { console.error(`✗ narration-check: ${m}\n${USAGE}`); process.exit(2); };
if (opt.tts && !TTS.includes(opt.tts.toLowerCase())) usage(`--tts "${opt.tts}" is not one of: ${TTS.join(", ")}`);
if (opt.timings && !TIMINGS.includes(opt.timings)) usage(`--timings "${opt.timings}" is not one of: ${TIMINGS.join(", ")}`);
if (opt["timings-api"] && !TIMINGS_APIS[opt["timings-api"]]) usage(`--timings-api "${opt["timings-api"]}" is not one of: ${Object.keys(TIMINGS_APIS).filter((k) => k !== "openai-compatible").join(", ")}`);
const LOCAL = !!opt.local;
if (LOCAL) { const other = ["tts", "model", "base-url", "timings", "timings-api", "whisper-model"].find((k) => opt[k]); if (other) usage(`--local times local Kokoro + whisper ${DEFAULT_WHISPER}, what narrate runs here by default: leave out --${other}`); }
const speed = opt.speed ? Number(opt.speed) : 1.25;
if (!(speed > 0)) usage(`--speed "${opt.speed}" is not a number above 0`);
const text = (opt.text ?? (LOCAL ? SPEED_TEXT : "Bob Dylan released Blood on the Tracks in 1975.")).trim();
if (!text) usage("--text is empty");

// ── no key in any line printed: every value of a variable that holds one is blanked ────────────────
const here = process.cwd();
loadEnvFile(here);
{ const w = envFileWarning(here); if (w) console.log(w); }
const secrets = () => Object.entries(process.env).filter(([k, v]) => /(KEY|TOKEN|SECRET)/i.test(k) && v && v.length >= 6).map(([, v]) => v);
const redact = (line) => secrets().reduce((t, v) => t.split(v).join("…"), String(line));
const say = (line) => console.log(redact(line));

// ── the engine: narrate's settings, the flags over them ──────────────────────────────────────────────
const over = LOCAL ? { tts: "kokoro", voice: opt.voice, timings: "local", whisper_model: DEFAULT_WHISPER } : { tts: opt.tts?.toLowerCase(), model: opt.model, voice: opt.voice, base_url: opt["base-url"], timings: opt.timings, timings_api: opt["timings-api"], whisper_model: opt["whisper-model"] };
if (over.timings_api && !over.timings) over.timings = "api";
if (over.whisper_model && !over.timings && !over.timings_api) over.timings = "local";
const flagged = Object.values(over).some((v) => v);
let s = narrationSettings(here, process.env, over);
let why = s.from.length ? `from ${s.from.join(" and ")}` : "";
if (LOCAL) why = "from --local: what narrate runs here with no hosted engine";
else if (s.engine === "hyperframes" && (!s.error || flagged)) {
  // HyperFrames' own engine voices with local Kokoro and times with whisper small.en (unless a HeyGen or
  // ElevenLabs key steers it, which `setup --dry-run` says): the same calls as tts "kokoro"
  s = narrationSettings(here, process.env, { ...over, tts: "kokoro" });
  why = flagged ? `from the command line, with no --tts: local Kokoro` : "the default: no narration.tts in .reelplanner/config.json, no REELPLANNER_TTS, so HyperFrames' engine, whose local Kokoro + whisper small.en are checked here";
}
const hostOf = (u) => { try { return new URL(u).host; } catch { return String(u); } };
const KEY_PAGES = { OPENAI_API_KEY: "https://platform.openai.com/api-keys", DEEPINFRA_API_KEY: "https://deepinfra.com/dash/api_keys", OPENROUTER_API_KEY: "https://openrouter.ai/settings/keys", ELEVENLABS_API_KEY: "https://elevenlabs.io/app/settings/api-keys", GROQ_API_KEY: "https://console.groq.com/keys" };
const keyHint = (k) => `${keyPlaces(`${k}=…`)}${KEY_PAGES[k] ? `; a key comes from ${KEY_PAGES[k]}` : ""}`;
// where a key that is set came from: a file loadEnvFile read (never the key itself), or nothing for the shell's; and
// the name it was set under when that is its old one (REELPLANNING_TTS_API_KEY)
const keyFrom = (k) => { const at = envSource(k), as = setAs(k); return as !== k ? ` from ${at ? `${at}'s` : "the shell's"} ${as}` : at ? ` from ${at}` : ""; };
let failed = false, late = null;
const fail = (line, hint) => { failed = true; say(`✗ ${line}`); if (hint) say(`  → ${hint}`); };
const finish = () => {
  say(failed ? `✗ narration-check: ${s.keyModel || s.tts || "narration"} does not work yet`
    : late ? `△ narration-check: ${s.keyModel} did not finish one sentence in ${late} s here: slow (it still works, just slower)`
    : `✓ narration-check: ${s.keyModel} works`);
  process.exit(failed ? 1 : 0);
};

if (s.error) { fail(`engine: ${s.error}`, opt.tts ? "change the flags above" : "change .reelplanner/config.json's narration, or try one with --tts"); finish(); }
const speech = s.tts === "kokoro" ? "local Kokoro (hyperframes tts)" : `${s.tts} ${s.model} at ${hostOf(s.base)} (key ${s.keyEnv}${process.env[s.keyEnv] ? keyFrom(s.keyEnv) : ", not set"})`;
const timedBy = s.timings === "provider" ? "the provider's own"
  : s.timings === "api" ? `${s.timingsApi.name} ${s.timingsApi.model} at ${hostOf(s.timingsApi.base)} (key ${s.timingsApi.keyEnv}${s.timingsApi.keyEnv === s.keyEnv ? ", the same" : process.env[s.timingsApi.keyEnv] ? keyFrom(s.timingsApi.keyEnv) : ", not set"})`
  : `local whisper ${s.whisperModel}`;
say(`engine: ${speech}, voice ${s.voice}, ×${speed}, word timings from ${timedBy} — ${why}`);

// ── what went wrong, and what to set or change ──────────────────────────────────────────────────────
function hint(e, what) {
  const st = e.status, model = what === "speech" ? s.model : s.timingsApi?.model, keyEnv = what === "speech" ? s.keyEnv : s.timingsApi?.keyEnv, base = what === "speech" ? s.base : s.timingsApi?.base;
  const modelFlag = what === "speech" ? "--model or narration.model" : "narration.timings_model";
  if (what === "speech" && s.tts === "kokoro" || what === "timings" && s.timings === "local") return `run \`${RP_COMMAND} setup --local-voice\` (it installs Kokoro and whisper, even when narration here is hosted), or \`${RP_COMMAND} setup --dry-run\` to see what is missing`;
  if (st === 401 || st === 403) return `check ${keyEnv}: it is set but refused${KEY_PAGES[keyEnv] ? `; make a new one at ${KEY_PAGES[keyEnv]}` : ""}`;
  if (st === 402) return "the account has no credit left: add some on the provider's site";
  if (st === 404) return `check the model "${model}" (${modelFlag}) and the base URL ${base}${what === "speech" ? " (--base-url or narration.base_url)" : ""}`;
  if (st === 400 || st === 422) return what === "speech" ? `check the voice "${s.voice}" (--voice or narration.voice) is one of ${model}'s, and the model (${modelFlag})` : `check that ${model} gives word timestamps (verbose_json, timestamp_granularities[]=word)`;
  if (st === 429) return "rate limited or out of quota: wait a minute, or check the plan's limits";
  if (st >= 500) return "the provider's own trouble: try again in a while";
  if (!st && /fetch failed|ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|no answer in/.test(e.message)) return `could not reach ${hostOf(base)}: check the base URL and the network (or an HTTPS proxy)`;
  return null;
}

// ── keys: a missing one stops before anything is sent ───────────────────────────────────────────────
if (s.keyEnv && !process.env[s.keyEnv]) { fail(`speech: not sent: ${s.keyEnv} is not set`, keyHint(s.keyEnv)); finish(); }

// ── --local: the tools first, and their models fetched once, untimed (narrate's first line would fetch them) ─
const LIMIT = LOCAL ? timeoutS() : null;
if (LOCAL) {
  const missing = localToolsMissing();
  if (missing.length) { fail(`local narration: not timed: ${missing.join(" and ")} ${missing.length === 1 ? "is" : "are"} not installed`, `run \`${RP_COMMAND} setup --local-voice\` (it installs Kokoro and whisper, even when narration here is hosted), or \`${RP_COMMAND} setup --dry-run\` to see what is missing`); finish(); }
  if (modelsMissing().length) {
    say("▶ fetching Kokoro's and whisper's models (about 840 MB, once; not timed)");
    const err = await fetchModels();
    if (err) { fail(`local narration: fetching the models failed: ${err}`, "check the network (or an HTTPS proxy), then try again"); finish(); }
  }
}
// a verdict on the machine's speed, for a check of fully local narration
const LOCAL_LINE = s.tts === "kokoro" && s.timings === "local" && s.whisperModel === DEFAULT_WHISPER;

const work = mkdtempSync(join(tmpdir(), "rp-narration-check-"));
const wavPath = join(work, "narration-check.wav");
const onRetry = (what) => ({ attempt, why: w, wait }) => say(`  · ${what}: ${w} — trying again in ${(wait / 1000).toFixed(1)} s (${attempt})`);
const secs = (t0) => ((performance.now() - t0) / 1000).toFixed(1);
const f2 = (x) => Number(x).toFixed(2);
let got = null, words = null, speechS = 0, timingsS = 0;
try {
  // ── the speech ──
  let t0 = performance.now();
  try {
    if (s.tts === "kokoro") got = await kokoro(text, wavPath, { voice: s.voice, speed, cwd: work, timeoutMs: LIMIT ? LIMIT * 1000 : undefined });
    else { got = await synthesize({ ...s, retries: Math.min(s.retries, 2) }, { text, voice: s.voice, speed }, { onRetry: onRetry("speech") }); writeFileSync(wavPath, got.wav); }
    speechS = (performance.now() - t0) / 1000;
    const w = parseWav(got.wav);
    say(`✓ speech: ${secs(t0)} s for ${f2(got.duration_s)} s of audio, wav ${w.sampleRate} Hz ${w.channels === 1 ? "mono" : `${w.channels} channels`} ${w.bits}-bit${got.sent ? ` (sent as ${got.sent})` : ""}${got.note ? `; ${got.note}` : ""}`);
  } catch (e) {
    if (e.timedOut) { late = LIMIT; say(`△ speech: ${e.message}`); }
    else fail(`speech: ${e.message}`, hint(e, "speech"));
  }

  // ── the word timings ──
  if (got) {
    t0 = performance.now();
    const tk = s.timingsApi?.keyEnv;
    try {
      if (s.timings === "api" && !process.env[tk]) fail(`word timings: not asked for: ${tk} is not set`, keyHint(tk));
      else {
        if (s.timings === "provider") words = alignWords(text, got.words, got.duration_s);
        else if (s.timings === "api") words = alignWords(text, await transcribe({ ...s.timingsApi, retries: Math.min(s.retries, 2), retryMs: s.retryMs }, got.wav, { onRetry: onRetry("word timings") }), got.duration_s);
        else words = await whisper(wavPath, { model: s.whisperModel, cwd: work, timeoutMs: LIMIT ? Math.max(1, LIMIT * 1000 - speechS * 1000) : undefined });
        timingsS = (performance.now() - t0) / 1000;
        const n = text.split(/\s+/).filter(Boolean).length;
        if (!words.length) fail(`word timings: none came back (${timedBy})`, s.timings === "provider" ? "try --timings api (a transcriber) or --timings local" : hint({}, "timings"));
        else {
          const first = words[0].start, last = words[words.length - 1].end, dur = got.duration_s;
          const covers = first <= Math.min(1, dur * 0.3) && last >= dur * 0.75 && last <= dur + 0.3;
          const shown = words.slice(0, 4).map((w) => `${w.text} ${f2(w.start)}–${f2(w.end)}`).join(", ");
          const line = `word timings: ${words.length} word${words.length === 1 ? "" : "s"}${words.length !== n ? ` (the sentence has ${n})` : ""} in ${secs(t0)} s: ${shown}${words.length > 4 ? ", …" : ""}; ${f2(first)}–${f2(last)} s of ${f2(dur)} s, ${covers ? "covering the audio" : "NOT covering the audio"}`;
          if (covers) say(`✓ ${line}`); else fail(line, "the timings and the audio disagree: try another transcriber (--timings-api) or --timings local");
        }
      }
    } catch (e) {
      if (e.timedOut) { late = LIMIT; say(`△ word timings: ${e.message}`); }
      else fail(`word timings: ${e.message}`, hint(e, "timings"));
    }
  }

  // ── what a minute of narration costs, where docs/reference.md gives a figure ──
  say(cost());

  // ── is local narration fast enough here? (scripts/lib/local-speed.mjs) ──
  if (LOCAL_LINE && !failed && (late || words?.length)) for (const l of speedVerdict(speechS + timingsS, { timedOut: !!late, limitS: LIMIT || undefined }).lines) say(l);

  if (opt.keep && got) {
    const keep = resolve(opt.keep);
    mkdirSync(keep, { recursive: true });
    copyFileSync(wavPath, join(keep, "narration-check.wav"));
    writeFileSync(join(keep, "narration-check.json"), JSON.stringify({ model: s.keyModel, voice: s.voice, speed, text, duration_s: got.duration_s, words: words || [] }, null, 2) + "\n");
    say(`kept: ${join(keep, "narration-check.wav")} and narration-check.json`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
finish();

// ── cost ─────────────────────────────────────────────────────────────────────────────────────────────
// The figures docs/reference.md gives (October 2026): per minute of audio, or per 1M characters (then a minute
// is this sentence's characters a second × 60).
function cost() {
  const SPEECH = {
    "openai gpt-4o-mini-tts": { perMin: 0.015, src: "about $0.015 a minute" },
    "openai tts-1": { perMChars: 15, src: "$15 per 1M characters" },
    "deepinfra hexgrad/Kokoro-82M": { perMChars: 0.62, src: "$0.62 per 1M characters" },
    "openrouter hexgrad/kokoro-82m": { perMChars: 0.62, src: "from $0.62 per 1M characters, its DeepInfra route" },
    "openrouter deepgram/aura-2": { perMChars: 30, src: "$30 per 1M characters" },
    "openrouter elevenlabs/eleven-flash-v2.5": { perMChars: 20, src: "$20 per 1M characters" },
  };
  const TIMED = {
    "groq whisper-large-v3-turbo": { perMin: 0.04 / 60, src: "$0.04 an hour" },
    "openai whisper-1": { perMin: 0.006, src: "$0.006 a minute" },
    "openrouter openai/whisper-1": { perMin: 0.006, src: "$0.006 a minute" },
  };
  const cps = got?.duration_s ? text.length / got.duration_s : 15;
  const sp = s.tts === "kokoro" ? { perMin: 0, src: "free (local)" } : SPEECH[`${s.tts} ${s.model}`];
  const tm = s.timings === "api" ? TIMED[`${s.timingsApi.name} ${s.timingsApi.model}`] : { perMin: 0, src: s.timings === "local" ? "free (local)" : "with the speech" };
  if (!sp || !tm) {
    const what = !sp ? `${s.tts} ${s.model}` : `${s.timingsApi.name} ${s.timingsApi.model}`;
    return `cost: not estimated: docs/reference.md gives no figure for ${what}${s.tts === "elevenlabs" && !sp ? " (it is per character, from your plan's credits)" : " (see the provider's pricing page)"}`;
  }
  const perMin = (x) => x.perMin ?? x.perMChars / 1e6 * cps * 60;
  const total = perMin(sp) + perMin(tm);
  if (total === 0) return `cost: none: speech ${sp.src}, timings ${tm.src}`;
  const money = (x) => (x === 0 ? "$0" : x < 0.01 ? `$${x.toFixed(4)}` : `$${x.toFixed(3)}`);
  return `cost: about ${money(total)} a minute of narration: speech ${sp.src}${sp.perMChars ? ` (this sentence came at ${Math.round(cps)} characters a second)` : ""}, timings ${tm.src}`;
}
