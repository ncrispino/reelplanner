// Which engine narrates a video, from the repo's settings: HyperFrames' own (local Kokoro + whisper, the
// default, unchanged) or reelplanner's (scripts/lib/narrate-engine.mjs), which voices lines through a hosted
// API and gets their word timings without local whisper, several lines at once.
//
// The settings: `.reelplanner/config.json` "narration", and the environment over it.
//
//   "narration": {
//     "tts": "openai" | "openai-compatible" | "deepinfra" | "openrouter" | "elevenlabs" | "kokoro",   (REELPLANNER_TTS)
//     "model": "gpt-4o-mini-tts",            the provider's model (each has a default)
//     "voice": "onyx",                       the voice of a new video (a rebuild keeps the one it was made with)
//     "base_url": "https://…/v1",            openai-compatible: where /audio/speech is   (REELPLANNER_TTS_BASE_URL)
//     "api_key_env": "DEEPINFRA_API_KEY",    openai-compatible: the variable holding its key (else REELPLANNER_TTS_API_KEY)
//     "instructions": "Calm, clear.",        gpt-4o-mini-tts only: how to speak
//     "timings": "provider" | "api" | "local",                                         (REELPLANNER_TIMINGS)
//     "timings_api": "groq" | "openai" | "openrouter" | "openai-compatible",  with timings_base_url, timings_api_key_env, timings_model
//     "whisper_model": "base.en",            timings "local": the whisper model         (REELPLANNER_WHISPER_MODEL)
//     "concurrency": 4                       lines at once (hosted default 4, local 1)  (REELPLANNER_TTS_CONCURRENCY)
//   }
//
// Keys are read from the environment only: the shell's, then the repo's .reelplanner/.env, then a .env next to the
// project (as HyperFrames' engine reads one), then this machine's ~/.reelplanner/.env (every repo's, the simple
// place: REELPLANNER_TTS=openrouter and OPENROUTER_API_KEY there need no config.json); never from config.json, and
// never printed: only the name of the variable that holds one, and the file it came from.
//
// With no "tts" (and no REELPLANNER_TTS), narration is what it has always been: HyperFrames' engine, which
// picks HeyGen (a HeyGen key), then ElevenLabs (a key and its pip package), then local Kokoro + whisper small.en.
//
// usage (setup --dry-run): node scripts/lib/narrator.mjs describe [<dir>]
import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname, basename, relative, sep } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { repoRoot, RP_COMMAND, rpDirOf, machineDir, machineDirShown } from "./env.mjs";
import { newName, oldNameOf } from "./old-names.mjs";

// OpenRouter's speech models take their provider's voices, and refuse a request with none (October 2026)
const OPENROUTER_VOICES = [[/^deepgram\/aura-2/, "aura-2-apollo-en"], [/^elevenlabs\//, "JBFqnCBsd6RMkjVDRZzb"], [/^openai\//, "onyx"]];
export const TTS = ["openai", "openai-compatible", "deepinfra", "openrouter", "elevenlabs", "kokoro"];
export const TIMINGS = ["provider", "api", "local"];

// Each provider's defaults. `timings`: where word timings come from when the settings name none.
export const PROVIDERS = {
  openai: { base: "https://api.openai.com/v1", keyEnv: "OPENAI_API_KEY", model: "gpt-4o-mini-tts", voice: "onyx", timings: "api", family: "openai" },
  "openai-compatible": { base: null, keyEnv: "REELPLANNER_TTS_API_KEY", model: null, voice: null, timings: "api" },
  // DeepInfra's own inference API (not its OpenAI-compatible one) returns each word's timing with the audio
  deepinfra: { base: "https://api.deepinfra.com/v1", keyEnv: "DEEPINFRA_API_KEY", model: "hexgrad/Kokoro-82M", voice: "am_michael", timings: "provider", family: "kokoro" },
  // OpenRouter: one key for the speech and the timings (its /audio/transcriptions, below). Deepgram Aura-2 by default:
  // a line in 1-3 s. Its Kokoro-82M (routed to DeepInfra) keeps a local build's voice but took 47-125 s a line (Oct 2026)
  openrouter: { base: "https://openrouter.ai/api/v1", keyEnv: "OPENROUTER_API_KEY", model: "deepgram/aura-2", voice: null, timings: "api" },
  elevenlabs: { base: "https://api.elevenlabs.io/v1", keyEnv: "ELEVENLABS_API_KEY", model: "eleven_multilingual_v2", voice: "21m00Tcm4TlvDq8ikWAM", timings: "provider", family: "elevenlabs" },
  kokoro: { local: true, voice: "am_michael", timings: "local", family: "kokoro" },
};
// Transcription APIs that return word timestamps (verbose_json + timestamp_granularities[]=word). OpenAI's
// gpt-4o-transcribe models return json or text only, without word timings: whisper-1 is the one that does.
export const TIMINGS_APIS = {
  groq: { base: "https://api.groq.com/openai/v1", keyEnv: "GROQ_API_KEY", model: "whisper-large-v3-turbo" },
  openai: { base: "https://api.openai.com/v1", keyEnv: "OPENAI_API_KEY", model: "whisper-1" },
  openrouter: { base: "https://openrouter.ai/api/v1", keyEnv: "OPENROUTER_API_KEY", model: "openai/whisper-1" },
  "openai-compatible": { base: null, keyEnv: "REELPLANNER_TIMINGS_API_KEY", model: null },
};
const NATIVE_TIMINGS = new Set(["deepinfra", "elevenlabs"]);
export const DEFAULT_WHISPER = "small.en";   // what HyperFrames' engine runs for English (its transcribeWav)

// Where keys are read from, first to last: the shell's environment (it always wins), then the repo's
// `.reelplanner/.env` (per repo, next to config.json, and the .gitignore `reel init` writes there leaves it out),
// then the nearest other .env at or above `startDir` (at most 5 directories up), as HyperFrames' engine reads one,
// then this machine's `~/.reelplanner/.env` ($REELPLANNER_HOME/.env when that is set): one file for every repo.
// A later file fills only the variables an earlier one left unset.
const parseEnv = (text) => {
  const out = [];
  for (const raw of text.split("\n")) {
    let line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("export ")) line = line.slice(7).trim();
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if (v[0] === '"' || v[0] === "'") { const e = v.indexOf(v[0], 1); v = e > 0 ? v.slice(1, e) : v.slice(1); }
    out.push([k, v]);
  }
  return out;
};
/** The repo's `.reelplanner/.env`, for any path in it. */
export const reelplannerEnvPath = (dir = process.cwd()) => join(rpDirOf(repoRoot(dir)), ".env");
/** This machine's `~/.reelplanner/.env`, read for every repo (REELPLANNER_HOME moves it, as it moves your memory). */
export const homeEnvPath = (env = process.env) => join(machineDir(env), ".env");

// the file each variable loadEnvFile set came from (the value it set, and the name the file gave it), so a line can
// say where a setting came from
const SOURCES = new Map();
/** How a line names an env file: ~/.reelplanner/.env, .reelplanner/.env, or another .env's path. */
export function envFileLabel(f, dir = process.cwd()) {
  if (f === homeEnvPath()) { const h = homedir(); return f.startsWith(h + sep) ? `~${f.slice(h.length)}` : f; }
  if (f === reelplannerEnvPath(dir)) return `${basename(dirname(f))}/.env`;
  const r = relative(process.cwd(), f);
  return r && !r.startsWith("..") ? r : f;
}
/** The file a variable came from when loadEnvFile set it and `env` still holds that value; else null (the shell's, or none). */
export function envSource(name, env = process.env) {
  const s = SOURCES.get(name);
  return s && env[name] === s.value ? s.label : null;
}
/**
 * How a line names a variable that is set: as it was set, so "REELPLANNING_TTS (its old name)" where the shell or the
 * file it came from (envSource) gave it its old name; else `name`.
 */
export function setAs(name, env = process.env) {
  const s = SOURCES.get(name), as = s && env[name] === s.value ? s.as : oldNameOf(name, env);
  return as && as !== name ? `${as} (its old name)` : name;
}

/**
 * Load `.reelplanner/.env`, then the nearest other .env at or above `startDir`, then ~/.reelplanner/.env, into
 * process.env (the shell wins, then the first file to set a variable). → the files read
 */
export function loadEnvFile(startDir) {
  const read = [], own = reelplannerEnvPath(startDir), home = homeEnvPath();
  const load = (f) => {
    const label = envFileLabel(f, startDir);
    // a setting under its old name (REELPLANNING_X) sets its new one too, unless something set that already
    for (const [k, v] of parseEnv(readFileSync(f, "utf8"))) for (const n of new Set([k, newName(k)])) if (!(n in process.env)) { process.env[n] = v; SOURCES.set(n, { label, value: v, as: k }); }
    read.push(f);
  };
  if (existsSync(own)) load(own);
  let d = resolve(startDir);
  for (let i = 0; i < 5; i++) {
    const f = join(d, ".env");
    if (existsSync(f)) { if (f !== own && f !== home) load(f); break; }
    const up = dirname(d); if (up === d) break; d = up;
  }
  if (existsSync(home) && !read.includes(home)) load(home);
  return read;
}

/**
 * A line to print when the repo's `.reelplanner/.env` exists and git would commit it (a .gitignore from before
 * `reel init` wrote the `.env` line), or already holds it; null otherwise, and outside a git repo. Names no key.
 */
export function envFileWarning(dir = process.cwd()) {
  const f = reelplannerEnvPath(dir);
  if (!existsSync(f)) return null;
  const at = dirname(f), git = (args) => spawnSync("git", ["-C", at, ...args], { stdio: "ignore" }).status;
  const rpd = basename(at);   // .reelplanner, or a repo's old .reelplanning
  if (git(["rev-parse", "--is-inside-work-tree"]) !== 0) return null;
  if (git(["ls-files", "--error-unmatch", ".env"]) === 0)
    return `△ ${rpd}/.env is committed to git, keys and all: run \`git rm --cached ${rpd}/.env\`, add a line \`.env\` to ${rpd}/.gitignore, and replace the keys in it (they are in the history)`;
  if (git(["check-ignore", "-q", ".env"]) === 1)
    return `△ ${rpd}/.env is not ignored by git, so its keys could be committed: add a line \`.env\` to ${rpd}/.gitignore (one from \`reel init\` has it)`;
  return null;
}

/** HyperFrames' engine voices with HeyGen when a HeyGen credential is set (its own first choice). */
export const heygenSet = (env = process.env) => !!(env.HEYGEN_API_KEY || env.HYPERFRAMES_API_KEY || existsSync(join(env.HEYGEN_CONFIG_DIR || join(homedir(), ".heygen"), "credentials")));

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const hostOf = (u) => { try { return new URL(u).host; } catch { return String(u); } };
const trimUrl = (u) => (u ? String(u).replace(/\/+$/, "") : u);

/**
 * The settings for narrating the project at `dir` (a video folder, or any path in the repo).
 * `over` (narration-check's flags) holds config.json keys that win over both config.json and the environment; an
 * `over.tts` other than the one set there leaves out that provider's model, voice, base URL, key variable,
 * instructions and timings, and an `over.timings_api` other than the set one its URL, key variable and model.
 * Returns { engine: "hyperframes" } for the default, or for reelplanner's engine
 *   { engine: "reelplanner", tts, model, voice, base, keyEnv, instructions, timings, timingsApi: { name, base, keyEnv, model } | null,
 *     whisperModel, concurrency, retries, retryMs, hosted, family, keyModel, from, missing: [env var…], error }
 * `keyModel` is what the line's key calls the model (provider, model, and where the timings come from);
 * `missing` the key variables not set; `error` a setting that cannot work (said plainly, with what to set).
 */
export function narrationSettings(dir = process.cwd(), env = process.env, over = {}) {
  const repo = repoRoot(dir);
  const cfgPath = join(rpDirOf(repo), "config.json");
  let cfg = (existsSync(cfgPath) && readJson(cfgPath)?.narration) || {};
  over = Object.fromEntries(Object.entries(over).filter(([, v]) => v != null && v !== ""));
  const set = (k, envName) => String((envName && env[envName]) || cfg[k] || "").trim().toLowerCase();
  if (over.tts && over.tts !== set("tts", "REELPLANNER_TTS")) {
    cfg = Object.fromEntries(Object.entries(cfg).filter(([k]) => !["model", "voice", "base_url", "api_key_env", "instructions", "timings"].includes(k)));
    env = { ...env, REELPLANNER_TTS_BASE_URL: undefined, REELPLANNER_TIMINGS: undefined };
  }
  if (over.timings_api && over.timings_api !== set("timings_api"))
    cfg = Object.fromEntries(Object.entries(cfg).filter(([k]) => !["timings_base_url", "timings_api_key_env", "timings_model"].includes(k)));
  const from = [];
  if (Object.keys(over).length) from.push("the command line");
  if (Object.keys(cfg).length) from.push(".reelplanner/config.json's narration");
  cfg = { ...cfg, ...over };
  const pick = (envName, key) => {
    if (key in over) return over[key];
    if (env[envName]) { const at = envSource(envName, env), as = setAs(envName, env), said = at ? `${as} in ${at}` : as; from.includes(said) || from.push(said); return env[envName]; }
    return cfg[key];
  };
  const tts = String(pick("REELPLANNER_TTS", "tts") || "").trim().toLowerCase();
  const whisperModel = String(pick("REELPLANNER_WHISPER_MODEL", "whisper_model") || DEFAULT_WHISPER);
  const timingsSet = pick("REELPLANNER_TIMINGS", "timings");
  // nothing chosen, or exactly today's local path: HyperFrames' engine, unchanged
  if (!tts || tts === "auto") {
    if (whisperModel !== DEFAULT_WHISPER || (timingsSet && timingsSet !== "local"))
      return { engine: "hyperframes", from, error: `narration ${whisperModel !== DEFAULT_WHISPER ? `whisper_model "${whisperModel}"` : `timings "${timingsSet}"`} needs a "tts" too: set narration.tts to "kokoro" for the local voice (or a hosted one), in .reelplanner/config.json or REELPLANNER_TTS` };
    return { engine: "hyperframes", from };
  }
  if (!TTS.includes(tts)) return { engine: "reelplanner", tts, from, error: `narration tts "${tts}" is not one of: ${TTS.join(", ")} (or leave it out for the default, local Kokoro + whisper)` };
  const p = PROVIDERS[tts];
  const s = { engine: "reelplanner", tts, from, hosted: !p.local, missing: [] };
  s.model = cfg.model || p.model || null;
  // (an OpenAI-compatible Kokoro host, or OpenRouter's Kokoro, takes Kokoro's voices: am_michael, as locally; on
  // OpenRouter, its default Deepgram Aura-2 a voice of Aura's, an ElevenLabs model George, an OpenAI model OpenAI's)
  s.voice = cfg.voice || p.voice || (/kokoro/i.test(s.model || "") ? "am_michael" : tts === "openrouter" ? OPENROUTER_VOICES.find(([re]) => re.test(s.model || ""))?.[1] || null : null);
  s.voiceSet = !!cfg.voice;
  s.base = trimUrl(pick("REELPLANNER_TTS_BASE_URL", "base_url") || p.base);
  s.keyEnv = p.local ? null : (tts === "openai-compatible" && cfg.api_key_env) || p.keyEnv;
  s.instructions = cfg.instructions || null;
  s.timings = String(timingsSet || p.timings);
  s.whisperModel = whisperModel;
  const n = Number(pick("REELPLANNER_TTS_CONCURRENCY", "concurrency"));
  s.concurrency = Math.min(16, Math.max(1, Math.floor(n) || (s.hosted ? 4 : 1)));
  s.retries = Math.max(0, Math.floor(Number(cfg.retries ?? 4)));
  s.retryMs = Math.max(1, Number(env.REELPLANNER_TTS_RETRY_MS || cfg.retry_ms || 1000));
  if (!TIMINGS.includes(s.timings)) s.error = `narration timings "${s.timings}" is not one of: ${TIMINGS.join(", ")}`;
  else if (s.timings === "provider" && !NATIVE_TIMINGS.has(tts)) s.error = `narration tts "${tts}" returns no word timings of its own: set narration.timings to "api" (a hosted transcriber) or "local" (whisper on this machine)`;
  else if (tts === "openai-compatible" && !s.base) s.error = `narration tts "openai-compatible" needs a base URL: narration.base_url in .reelplanner/config.json, or REELPLANNER_TTS_BASE_URL (e.g. https://api.deepinfra.com/v1/openai)`;
  else if (tts === "openai-compatible" && !s.model) s.error = `narration tts "openai-compatible" needs narration.model in .reelplanner/config.json (e.g. "hexgrad/Kokoro-82M"), and narration.voice unless it is a Kokoro model`;
  else if (tts === "openrouter" && !s.voice) s.error = `narration tts "openrouter" with model "${s.model}" needs narration.voice: one of that model's voices (its page on openrouter.ai lists them)`;
  if (s.timings === "api") {
    // OpenRouter's speech is timed by OpenRouter's transcriber: its one key covers both
    let name = cfg.timings_api || (tts === "openrouter" ? "openrouter" : env.GROQ_API_KEY ? "groq" : env.OPENAI_API_KEY ? "openai" : cfg.timings_base_url ? "openai-compatible" : env.OPENROUTER_API_KEY ? "openrouter" : "groq");
    if (!TIMINGS_APIS[name]) s.error ||= `narration timings_api "${name}" is not one of: ${Object.keys(TIMINGS_APIS).join(", ")}`;
    const t = TIMINGS_APIS[name] || TIMINGS_APIS.groq;
    s.timingsApi = { name, base: trimUrl(cfg.timings_base_url || t.base), keyEnv: cfg.timings_api_key_env || t.keyEnv, model: cfg.timings_model || t.model };
    if (!s.timingsApi.base || !s.timingsApi.model) s.error ||= `narration timings_api "openai-compatible" needs narration.timings_base_url and narration.timings_model`;
  } else s.timingsApi = null;
  for (const k of [s.keyEnv, s.timingsApi?.keyEnv]) if (k && !env[k] && !s.missing.includes(k)) s.missing.push(k);
  s.family = p.family || (/kokoro/i.test(s.model || "") ? "kokoro" : tts === "openai-compatible" ? `${tts} ${hostOf(s.base)}` : tts === "openrouter" ? `openrouter ${String(s.model || "").split("/")[0]}` : tts);
  s.keyModel = keyModel(s);
  return s;
}

/**
 * What a line's key, narration.json and the console call the model: the provider and its model, and where the
 * word timings come from, e.g. "openai gpt-4o-mini-tts + groq whisper-large-v3-turbo",
 * "deepinfra hexgrad/Kokoro-82M + its word timings", "kokoro-v1.0 + whisper base.en". Changing any of them re-voices.
 */
export function keyModel(s, { kokoroModel = "kokoro" } = {}) {
  let tts;
  if (s.tts === "kokoro") tts = kokoroModel;
  else if (s.tts === "openai-compatible") tts = `openai-compatible ${hostOf(s.base)} ${s.model}`;
  else tts = `${s.tts} ${s.model}`;
  // instructions change how gpt-4o-mini-tts speaks: a short hash of them, so new ones re-voice
  if (s.instructions && s.tts !== "kokoro") tts += ` (instructions ${createHash("sha256").update(s.instructions).digest("hex").slice(0, 8)})`;
  const timings = s.timings === "provider" ? "its word timings"
    : s.timings === "api" ? `${s.timingsApi.name === "openai-compatible" ? `transcriber ${hostOf(s.timingsApi.base)}` : s.timingsApi.name} ${s.timingsApi.model}`
    : `whisper ${s.whisperModel}`;
  return `${tts} + ${timings}`;
}

/** The voice family a model string belongs to, so a rebuild keeps a recorded voice only where it still exists. */
export function familyOf(model = "") {
  const m = String(model);
  if (/kokoro/i.test(m)) return "kokoro";
  const first = m.split(" ")[0];
  if (first === "openai-compatible") return `openai-compatible ${m.split(" ")[1] || ""}`;
  // OpenRouter's speech models each take their own vendor's voices: Aura-2's are not ElevenLabs'
  if (first === "openrouter") return `openrouter ${(m.split(" ")[1] || "").split("/")[0]}`;
  return first;
}

/** Where a missing key goes, said the same way by every command: "export it in your shell, or put it in …". */
export const keyPlaces = (it = "it") => `export ${it} in your shell, or put ${it} in ${machineDirShown()}/.env (this machine, every repo) or the repo's .reelplanner/.env (git ignores it; never in config.json)`;

/** One paragraph for `setup --dry-run` and `narrate`: which engine, why, and what is missing. { ok, text } */
export function describe(dir = process.cwd(), env = process.env) {
  loadEnvFile(dir);
  const s = narrationSettings(dir, env);
  const why = s.from.length ? `from ${s.from.join(" and ")}` : "the default: no narration.tts in .reelplanner/config.json, no REELPLANNER_TTS";
  if (s.error) return { ok: false, text: `narration: ${s.error}` };
  if (s.engine === "hyperframes") {
    const heygen = heygenSet(env);
    const which = heygen ? "HeyGen (a HeyGen credential is set; it returns word timings)" : env.ELEVENLABS_API_KEY ? "ElevenLabs if its pip package is installed (then local whisper small.en), else local Kokoro + whisper small.en" : "local Kokoro + whisper small.en, one line at a time";
    return { ok: true, text: `narration: HyperFrames' engine, ${which} (${why}). A hosted engine is much faster on a small machine: put REELPLANNER_TTS=openrouter and OPENROUTER_API_KEY=… in ${machineDirShown()}/.env (this machine, every repo), then run ${RP_COMMAND} narration-check (docs/reference.md, "Narration engines")` };
  }
  const where = s.timings === "provider" ? "the TTS's own word timings" : s.timings === "api" ? `${s.timingsApi.name} ${s.timingsApi.model} (${s.timingsApi.keyEnv})` : `local whisper ${s.whisperModel}`;
  const text = `narration: ${s.tts === "kokoro" ? "local Kokoro" : `${s.tts} ${s.model}${s.keyEnv ? ` (${s.keyEnv})` : ""}`}, voice ${s.voice || "(the video's)"}, word timings from ${where}, ${s.concurrency} line${s.concurrency === 1 ? "" : "s"} at a time (${why})`;
  if (s.missing.length) return { ok: false, text: `${text}\n    not set: ${s.missing.join(", ")} — ${keyPlaces(s.missing.length === 1 ? "it" : "them")}` };
  return { ok: true, text };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [what, d] = process.argv.slice(2);
  if (what !== "describe") { console.error("usage: node scripts/lib/narrator.mjs describe [<dir>]"); process.exit(2); }
  const r = describe(d || process.cwd());
  console.log(r.text);
  const warn = envFileWarning(d || process.cwd());
  if (warn) console.log(warn);
  process.exit(r.ok ? 0 : 1);
}
