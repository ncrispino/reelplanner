#!/usr/bin/env node
// Hosted narration (scripts/lib/narrator.mjs, narrate-engine.mjs, tts-api.mjs): `reelplanner narrate` with
// .reelplanner/config.json's `narration.tts` set, under the REAL faceless-explainer audio.mjs, against a fake
// HTTP server in this process that answers as each API does. No real key, no network, no Kokoro, no whisper.
//   - openai + groq timings: the speech and transcription requests' shapes, the key only in its header, the
//     wavs (a streamed wav's header made exact), word timings mapped onto the line's own words, the record's model
//   - lines in parallel up to `concurrency`, several to a call; a second run sends nothing
//   - the local voice: hosted narration needs no Kokoro; transcribe-missing re-times a line with the hosted transcriber;
//     local narration (config.json's kokoro, or the default) with Kokoro missing stops, saying what to run either way
//   - 429 and 503 are retried (Retry-After honoured) and the run ends clean; a refused key stops it, kept lines back
//   - a missing key stops the run before any request, naming the variable; a dry run only says so; no key in any output;
//     a key in a .env beside the project is read, and one in the repo's .reelplanner/.env over it
//   - deepinfra (its own word timings), elevenlabs (character alignment, speed held to 1.2), openai-compatible with
//     whisper-1 timings, openrouter (mp3 made a wav, its own transcriber, one key for both): each switch re-voices
//     (the key's model), and a Kokoro voice is kept across Kokoro hosts
//   - music still comes from HyperFrames' engine, merged under the voices
//   - the settings' errors, and what `setup --dry-run` says
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, testPort, machineDirShown } from "../lib/env.mjs";
import { skillsDir } from "../hyperframes-skills.mjs";
import { alignWords, parseWav, toWav } from "../lib/tts-api.mjs";
import { narrationSettings, describe, familyOf, heygenSet } from "../lib/narrator.mjs";
import { fakeTtsApis, KEYS } from "./fake-tts-apis.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
if (!existsSync(join(skillsDir(), "faceless-explainer", "scripts", "audio.mjs"))) { console.error("✗ narrate-api.spec needs HyperFrames' faceless-explainer skill — run `reelplanner hyperframes-skills`"); process.exit(1); }

const tmp = mkdtempSync(join(tmpdir(), "rp-narrate-api-"));
const P = join(tmp, "video"), CFG = join(tmp, ".reelplanner", "config.json");
// this machine's .env (~/.reelplanner/.env) is read by every narration command: a scratch one, never the real one
const RPHOME = join(tmp, "rp-home"), HOME_ENV = join(RPHOME, ".env");
process.env.REELPLANNER_HOME = RPHOME;
// a line saying where a key goes names the machine's folder in use: this scratch one
const HINT_ENV = `${machineDirShown()}/.env`;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── the fake APIs (fake-tts-apis.mjs) ────────────────────────────────────────────────────────────
const api = await fakeTtsApis(testPort(28640));
const { BASE, PORT, log, fail } = api;

// ── a small project ───────────────────────────────────────────────────────────────────────────────
const LINES = [
  "An agent hands you its plan, and you approve it.",
  "It's turned into a short narrated video.",
  "Each plan gets two videos, one before the code and one after.",
  "You watch it the way you would read a review.",
  "Then you approve it, or you ask for changes.",
];
const script = (lines) => `# SCRIPT\n\n${lines.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n    ${t}\n`).join("\n")}`;
const storyboard = (n, music = "none") => `---\ntitle: test\nmusic: ${music}\n---\n\n${Array.from({ length: n }, (_, i) => `## Frame ${i + 1} — beat ${i + 1}\n\n- duration: 5s\n`).join("\n")}`;
const setLines = (lines) => writeFileSync(join(P, "SCRIPT.md"), script(lines));
const config = (narration) => { mkdirSync(join(tmp, ".reelplanner"), { recursive: true }); writeFileSync(CFG, JSON.stringify({ narration }, null, 2)); };
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(REELPLANNER_|HYPERFRAMES_TTS|HF_MEDIA)/.test(k) && !/_API_KEY$/.test(k)));
const narrate = (args = [], env = {}) => new Promise((done) => {
  const before = log.length;
  // (a null in `env` leaves that variable out altogether)
  const all = Object.fromEntries(Object.entries({ ...baseEnv, ...KEYS, REELPLANNER_TTS_RETRY_MS: "20", REELPLANNER_HOME: RPHOME, ...env }).filter(([, v]) => v != null));
  const c = spawn(process.execPath, [join(ROOT, "scripts", "narrate.mjs"), P, ...args], { env: all, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { out += d; });
  c.on("close", (code) => done({ code, out, reqs: log.slice(before) }));
});
// another of reelplanner's scripts on the project, with the same environment as narrate
const tool = (name, env = {}) => new Promise((done) => {
  const before = log.length;
  const all = Object.fromEntries(Object.entries({ ...baseEnv, ...KEYS, REELPLANNER_TTS_RETRY_MS: "20", REELPLANNER_HOME: RPHOME, ...env }).filter(([, v]) => v != null));
  const c = spawn(process.execPath, [join(ROOT, "scripts", name), P], { env: all, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { out += d; });
  c.on("close", (code) => done({ code, out, reqs: log.slice(before) }));
});
const json = (f) => JSON.parse(readFileSync(join(P, f), "utf8"));
const wavs = () => Object.fromEntries(readdirSync(join(P, "assets", "voice")).sort().map((f) => [f, readFileSync(join(P, "assets", "voice", f)).toString("base64")]));
const speechReqs = (r) => r.reqs.filter((q) => !q.path.endsWith("/transcriptions"));
const transReqs = (r) => r.reqs.filter((q) => q.path.endsWith("/transcriptions"));
const noKeyIn = (text) => !Object.values(KEYS).some((k) => text.includes(k));

try {
  mkdirSync(P, { recursive: true });
  setLines(LINES);
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(LINES.length));

  // ── openai + groq ──
  config({ tts: "openai", base_url: `${BASE}/openai/v1`, timings: "api", timings_api: "groq", timings_base_url: `${BASE}/groq/openai/v1`, concurrency: 3 });
  api.gather = 3;   // the fake APIs hold requests until three are in flight: what is sent at once, whatever the load
  const r1 = await narrate();
  api.gather = 0;
  const sp = speechReqs(r1), tr = transReqs(r1);
  ok("openai: every line voiced and timed, one request each", r1.code === 0 && sp.length === 5 && tr.length === 5, r1.out);
  ok("…speech requests as /v1/audio/speech takes them: model, input (the line), voice, wav, speed, the pace in instructions for gpt-4o-mini-tts",
    sp.every((q) => q.method === "POST" && q.path === "/openai/v1/audio/speech" && q.headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && q.json.model === "gpt-4o-mini-tts" && q.json.voice === "onyx" && q.json.response_format === "wav" && q.json.speed === 1.25 && /1\.25/.test(q.json.instructions))
    && sp.map((q) => q.json.input).sort().join("|") === [...LINES].sort().join("|"), JSON.stringify(sp[0]?.json));
  ok("…transcriptions as groq's /openai/v1/audio/transcriptions takes them: multipart wav, whisper-large-v3-turbo, verbose_json, word granularity, en",
    tr.every((q) => q.form.model === "whisper-large-v3-turbo" && q.form.response_format === "verbose_json" && q.form.granularity.join() === "word" && q.form.language === "en" && q.form.riff === "RIFF" && q.headers.authorization === `Bearer ${KEYS.GROQ_API_KEY}`), JSON.stringify(tr[0]?.form));
  const meta = json("audio_meta.json"), eng = json("audio_engine_meta.json"), rec = json(".hyperframes/narration.json");
  ok("audio_meta.json has the shape audio.mjs writes, a voice per frame",
    JSON.stringify(Object.keys(meta)) === JSON.stringify(["bgm", "bgm_pending", "voices", "sfx"]) && meta.voices.map((v) => v.frame).join() === "1,2,3,4,5"
    && meta.voices.every((v) => JSON.stringify(Object.keys(v)) === '["frame","path","duration_s","words"]' && v.words.every((w) => JSON.stringify(Object.keys(w)) === '["id","text","start","end"]')), JSON.stringify(meta).slice(0, 400));
  ok("…word timings are the line's own words, punctuation and all, though the transcriber heard \"its\" and no commas",
    meta.voices[1].words.map((w) => w.text).join(" ") === LINES[1] && meta.voices[0].words.map((w) => w.text).join(" ") === LINES[0]
    && meta.voices[1].words[0].start === 0 && meta.voices[1].words[1].start === 0.3 && meta.voices.every((v) => v.words.every((w, i, a) => w.end >= w.start && (!i || w.start >= a[i - 1].start))), JSON.stringify(meta.voices[1].words));
  const w0 = parseWav(readFileSync(join(P, "assets", "voice", "01.wav")));
  ok("…each wav is a clean PCM wav (the streamed header made exact), its duration the audio's",
    w0 && w0.sampleRate === 24000 && readFileSync(join(P, "assets", "voice", "01.wav")).readUInt32LE(40) === w0.data.length && meta.voices[0].duration_s === +(LINES[0].split(" ").length * 0.3).toFixed(3), JSON.stringify(meta.voices[0]).slice(0, 200));
  ok("…the record and the sidecar name the provider, model and timings, and the voice",
    rec.model === "openai gpt-4o-mini-tts + groq whisper-large-v3-turbo" && rec.voice === "onyx" && rec.speed === 1.25 && eng.tts_provider === "openai" && eng.voice_id === "onyx", JSON.stringify({ model: rec.model, voice: rec.voice, eng: eng.tts_provider }));
  ok("lines run in parallel, up to the concurrency (3), in calls of three", api.maxInflight === 3 && /· 1\/2: frames 1, 2, 3/.test(r1.out) && /· 2\/2: frames 4, 5/.test(r1.out), `max ${api.maxInflight}\n${r1.out}`);
  ok("no key appears in any output, the record or the config", noKeyIn(r1.out) && noKeyIn(readFileSync(join(P, ".hyperframes/narration.json"), "utf8")) && noKeyIn(readFileSync(CFG, "utf8")) && noKeyIn(readFileSync(join(P, "audio_engine_meta.json"), "utf8")));
  const r2 = await narrate();
  ok("again, unchanged: no request at all", r2.code === 0 && r2.reqs.length === 0 && /0 line\(s\) narrated, 5 kept/.test(r2.out), r2.out);

  // ── the local voice: hosted narration needs none of it; transcribe-missing asks the hosted transcriber; local
  //    narration without it stops before anything is touched, saying both ways on ──
  const NOPY = join(tmp, "python-without-kokoro");
  writeFileSync(NOPY, "#!/bin/sh\nexit 1\n"); chmodSync(NOPY, 0o755);
  // a whisper.cpp that is there (narrate only looks for it), so Kokoro alone is what is missing, whatever this machine has
  const WHISPER = join(tmp, "whisper-cli");
  writeFileSync(WHISPER, "#!/bin/sh\nexit 0\n"); chmodSync(WHISPER, 0o755);
  const NO_KOKORO = { HYPERFRAMES_PYTHON: NOPY, HYPERFRAMES_WHISPER_PATH: WHISPER };
  setLines([LINES[0], "A line voiced with no local voice installed.", ...LINES.slice(2)]);
  const lv1 = await narrate([], { HYPERFRAMES_PYTHON: NOPY });
  ok("hosted narration with no Kokoro here: voiced as ever", lv1.code === 0 && speechReqs(lv1).length === 1 && transReqs(lv1).length === 1, lv1.out);
  for (const f of ["audio_meta.json", "audio_engine_meta.json"]) {
    const m = json(f); m.voices[1].words = [];
    writeFileSync(join(P, f), JSON.stringify(m, null, 2));
  }
  const tm = await tool("transcribe-missing.mjs", { HYPERFRAMES_PYTHON: NOPY });
  ok("transcribe-missing, hosted narration: the line's words from the hosted transcriber (groq), lined up with the line's own words, in both meta files",
    tm.code === 0 && transReqs(tm).length === 1 && speechReqs(tm).length === 0 && /transcribing serially with groq whisper-large-v3-turbo/.test(tm.out)
      && json("audio_meta.json").voices[1].words.map((w) => w.text).join(" ") === "A line voiced with no local voice installed." && json("audio_engine_meta.json").voices[1].words.length === 8 && noKeyIn(tm.out), tm.out);
  const LOCAL_HINT = `Either install the local voice: \`reelplanner setup --local-voice\` (free; about 840 MB once; needs Python 3.10+), or narrate with the hosted voice: put REELPLANNER_TTS=openrouter and OPENROUTER_API_KEY=… in ${HINT_ENV} (a key from https://openrouter.ai/settings/keys), then run \`reelplanner narration-check\``;
  config({ tts: "kokoro" });
  const w0s = wavs();
  setLines([LINES[0], "A line for a voice that is not installed.", ...LINES.slice(2)]);
  const lv2 = await narrate([], NO_KOKORO);
  ok("local Kokoro named (config.json) and not installed: stops before anything is touched, saying exactly what to run either way",
    lv2.code === 1 && lv2.reqs.length === 0 && lv2.out.includes(`✗ narrate: Kokoro TTS is not installed, and narration here is local Kokoro (from .reelplanner/config.json's narration). ${LOCAL_HINT}`) && JSON.stringify(wavs()) === JSON.stringify(w0s), lv2.out);
  const lv3 = await narrate(["--dry-run"], NO_KOKORO);
  ok("…a dry run only says so", lv3.code === 0 && lv3.out.includes(`△ Kokoro TTS is not installed, and narration here is local Kokoro`), lv3.out);
  config({});
  const lv4 = await narrate([], { ...NO_KOKORO, ELEVENLABS_API_KEY: null });
  ok("the default (HyperFrames' engine, local Kokoro) and Kokoro not installed: the same, said as the default",
    heygenSet() || (lv4.code === 1 && lv4.out.includes(`✗ narrate: Kokoro TTS is not installed, and narration here is the local voice (the default: no hosted voice is set). ${LOCAL_HINT}`)), lv4.out);
  config({ tts: "openai", base_url: `${BASE}/openai/v1`, timings: "api", timings_api: "groq", timings_base_url: `${BASE}/groq/openai/v1`, concurrency: 3 });
  setLines(LINES);
  const lv5 = await narrate();
  ok("…and back on the hosted voice, the lines are voiced again", lv5.code === 0, lv5.out);

  // ── retries ──
  const w1 = wavs();
  setLines([LINES[0], "It's turned into a short video you review by watching.", ...LINES.slice(2)]);
  fail.speech.push(429, 503); fail.transcribe.push(502);
  const r3 = await narrate();
  ok("429 and 5xx are tried again (Retry-After honoured) and the edited line comes through", r3.code === 0 && speechReqs(r3).length === 3 && transReqs(r3).length === 2 && /HTTP 429.*trying again/.test(r3.out) && /HTTP 503/.test(r3.out) && /1 line\(s\) narrated, 4 kept/.test(r3.out), r3.out);
  ok("…the kept lines byte for byte", ["01.wav", "03.wav", "04.wav", "05.wav"].every((f) => wavs()[f] === w1[f]) && wavs()["02.wav"] !== w1["02.wav"]);
  fail.speech.push(500, 500, 500, 500, 500);
  setLines([LINES[0], "It's made into a short video.", ...LINES.slice(2)]);
  const r3b = await narrate([], { REELPLANNER_TTS_RETRY_MS: "1" });
  ok("…and after its retries (4) a line that still fails is named and left for the next run", r3b.code === 1 && speechReqs(r3b).length === 5 && /HTTP 500.*after 5 tries/.test(r3b.out) && /no voice came back for frame\(s\) 2/.test(r3b.out), r3b.out);
  const r3c = await narrate();
  ok("…which voices only it", r3c.code === 0 && speechReqs(r3c).length === 1, r3c.out);

  // ── a refused key, a missing key ──
  const w2 = wavs();
  setLines([LINES[0], "A line no key will voice.", ...LINES.slice(2)]);
  const r4 = await narrate([], { OPENAI_API_KEY: "sk-wrong" });
  ok("a refused key (401) stops the run, naming the variable; the kept lines are back as they were",
    r4.code === 1 && /refused the key in OPENAI_API_KEY \(HTTP 401/.test(r4.out) && /kept lines are back as they were/.test(r4.out) && ["01.wav", "03.wav"].every((f) => wavs()[f] === w2[f]) && !r4.out.includes("sk-wrong"), r4.out);
  const r5 = await narrate([], { OPENAI_API_KEY: "" });
  ok("a missing key stops the run before any request, and says what to set and where: this machine's ~/.reelplanner/.env or the repo's",
    r5.code === 1 && r5.reqs.length === 0 && new RegExp(`OPENAI_API_KEY is not set: narration "openai" with word timings from groq needs it: export it in your shell, or put it in ${esc(HINT_ENV)} \\(this machine, every repo\\) or the repo's \\.reelplanner\\/\\.env`).test(r5.out), r5.out);
  const r5d = await narrate(["--dry-run"], { OPENAI_API_KEY: "", GROQ_API_KEY: "" });
  ok("…a dry run only says so, both of them", r5d.code === 0 && r5d.reqs.length === 0 && /△ OPENAI_API_KEY and GROQ_API_KEY are not set/.test(r5d.out), r5d.out);
  writeFileSync(join(tmp, ".env"), `OPENAI_API_KEY=${KEYS.OPENAI_API_KEY}\n`);
  const r5e = await narrate([], { OPENAI_API_KEY: null });
  ok("…and a key in a .env beside the project is read", r5e.code === 0 && speechReqs(r5e).length === 1 && noKeyIn(r5e.out), r5e.out);
  // the repo's .reelplanner/.env, which walking up from the video folder never reaches here, and over that .env
  writeFileSync(join(tmp, ".reelplanner", ".env"), `# narration keys\nOPENAI_API_KEY=${KEYS.OPENAI_API_KEY}\n`);
  writeFileSync(join(tmp, ".env"), "OPENAI_API_KEY=sk-a-stale-one-beside\n");
  setLines([LINES[0], "A line voiced with the key kept in the record's folder.", ...LINES.slice(2)]);
  const r5f = await narrate([], { OPENAI_API_KEY: null });
  ok("…and a key in the repo's .reelplanner/.env is read for a video, over a .env beside it", r5f.code === 0 && speechReqs(r5f).length === 1
    && speechReqs(r5f)[0].headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && noKeyIn(r5f.out) && !r5f.out.includes("sk-a-stale-one-beside"), r5f.out);
  rmSync(join(tmp, ".env")); rmSync(join(tmp, ".reelplanner", ".env"));

  // ── this machine's ~/.reelplanner/.env (REELPLANNER_HOME's, here): read last; its REELPLANNER_TTS picks the engine
  //    with no narration.tts in config.json; the repo's .reelplanner/.env and the shell win over it ──
  mkdirSync(RPHOME, { recursive: true });
  const homeEnv = (lines) => writeFileSync(HOME_ENV, lines.join("\n") + "\n");
  config({ timings_base_url: `${BASE}/groq/openai/v1` });   // no tts: the engine comes from the machine's .env
  homeEnv([`REELPLANNER_TTS=openai`, `REELPLANNER_TTS_BASE_URL=${BASE}/openai/v1`, `OPENAI_API_KEY=${KEYS.OPENAI_API_KEY}`]);
  setLines([LINES[0], "A line voiced with the machine's own settings.", ...LINES.slice(2)]);
  const h1 = await narrate([], { OPENAI_API_KEY: null });
  ok("~/.reelplanner/.env: its REELPLANNER_TTS picks the engine (no narration.tts in config.json) and its key is used",
    h1.code === 0 && speechReqs(h1).length === 1 && speechReqs(h1)[0].path === "/openai/v1/audio/speech" && speechReqs(h1)[0].headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && noKeyIn(h1.out), h1.out);
  ok("…and narrate says the setting came from that file", h1.out.includes(`REELPLANNER_TTS in ${HOME_ENV}`), h1.out);
  const STALE_HOME = "sk-a-stale-one-on-the-machine";
  homeEnv([`REELPLANNER_TTS=openai`, `REELPLANNER_TTS_BASE_URL=${BASE}/openai/v1`, `OPENAI_API_KEY=${STALE_HOME}`]);
  writeFileSync(join(tmp, ".reelplanner", ".env"), `OPENAI_API_KEY=${KEYS.OPENAI_API_KEY}\n`);
  setLines([LINES[0], "A line voiced with the repo's key over the machine's.", ...LINES.slice(2)]);
  const h2 = await narrate([], { OPENAI_API_KEY: null });
  ok("…the repo's .reelplanner/.env wins over it", h2.code === 0 && speechReqs(h2)[0]?.headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && !h2.out.includes(STALE_HOME), h2.out);
  rmSync(join(tmp, ".reelplanner", ".env"));
  setLines([LINES[0], "A line voiced with the shell's key over the machine's.", ...LINES.slice(2)]);
  const h3 = await narrate([], {});
  ok("…and so does the shell", h3.code === 0 && speechReqs(h3)[0]?.headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && !h3.out.includes(STALE_HOME), h3.out);
  const h4 = await narrate(["--dry-run"], { REELPLANNER_HOME: join(tmp, "rp-home-none"), OPENAI_API_KEY: null });
  ok("…another REELPLANNER_HOME, with no .env: no engine from it (HyperFrames' own)", h4.code === 0 && !/reelplanner's engine/.test(h4.out) && !h4.out.includes(HOME_ENV), h4.out);
  rmSync(HOME_ENV);

  // ── deepinfra: its own word timings, same Kokoro voice as local ──
  config({ tts: "deepinfra", base_url: `${BASE}/deepinfra/v1` });
  // onyx is OpenAI's: a Kokoro host takes the remembered Kokoro voice (media-use's prefs), else am_michael
  let KV = "am_michael";
  try { KV = JSON.parse(execFileSync(process.execPath, [join(skillsDir(), "media-use", "scripts", "prefs.mjs"), "get", "--hyperframes", P, "--json"], { encoding: "utf8" })).voice?.value || KV; } catch { /* none remembered */ }
  const r6 = await narrate();
  const di = speechReqs(r6);
  ok("deepinfra: switching provider re-voices every line, with no transcription", r6.code === 0 && di.length === 5 && transReqs(r6).length === 0, r6.out);
  ok("…requests as its inference API takes them: text, preset_voice [the Kokoro voice] (onyx is OpenAI's), wav, speed, return_timestamps",
    di.every((q) => q.path === "/deepinfra/v1/inference/hexgrad/Kokoro-82M" && q.headers.authorization === `bearer ${KEYS.DEEPINFRA_API_KEY}` && JSON.stringify(q.json.preset_voice) === JSON.stringify([KV]) && q.json.output_format === "wav" && q.json.return_timestamps === true && q.json.speed === 1.25), JSON.stringify(di[0]?.json));
  ok("…its words become the line's, and the record says where they came from", json("audio_meta.json").voices[0].words.map((w) => w.text).join(" ") === LINES[0] && json(".hyperframes/narration.json").model === "deepinfra hexgrad/Kokoro-82M + its word timings" && json(".hyperframes/narration.json").voice === KV, JSON.stringify(json(".hyperframes/narration.json")).slice(0, 200));

  // ── openai-compatible (another Kokoro host), whisper-1 timings: the Kokoro voice carries over ──
  config({ tts: "openai-compatible", base_url: `${BASE}/own/v1`, api_key_env: "MY_TTS_KEY", model: "hexgrad/Kokoro-82M", timings_api: "openai", timings_base_url: `${BASE}/openai/v1`, concurrency: 5 });
  api.gather = 5;
  const r7 = await narrate();
  api.gather = 0;
  ok("openai-compatible: its base URL, its own key variable, the model and the Kokoro voice the video already had",
    r7.code === 0 && speechReqs(r7).length === 5 && speechReqs(r7).every((q) => q.path === "/own/v1/audio/speech" && q.headers.authorization === `Bearer ${KEYS.MY_TTS_KEY}` && q.json.model === "hexgrad/Kokoro-82M" && q.json.voice === KV && !("instructions" in q.json)), r7.out);
  ok("…timed by whisper-1 at OpenAI's transcriptions, all five lines at once", transReqs(r7).every((q) => q.path === "/openai/v1/audio/transcriptions" && q.form.model === "whisper-1") && api.maxInflight === 5 && json(".hyperframes/narration.json").model === `openai-compatible 127.0.0.1:${PORT} hexgrad/Kokoro-82M + openai whisper-1`, json(".hyperframes/narration.json").model);

  // ── elevenlabs: with-timestamps, characters to words ──
  config({ tts: "elevenlabs", base_url: `${BASE}/elevenlabs/v1` });
  const r8 = await narrate();
  const el = speechReqs(r8);
  ok("elevenlabs: with-timestamps, xi-api-key, pcm_24000, its default model and voice, speed held to its 1.2",
    r8.code === 0 && el.length === 5 && el.every((q) => q.headers["xi-api-key"] === KEYS.ELEVENLABS_API_KEY && !q.headers.authorization && q.query.output_format === "pcm_24000" && q.voice === "21m00Tcm4TlvDq8ikWAM" && q.json.model_id === "eleven_multilingual_v2" && q.json.voice_settings?.speed === 1.2) && /elevenlabs speaks at 1\.2× at most/.test(r8.out), `${JSON.stringify(el[0]?.json)}\n${r8.out}`);
  const v8 = json("audio_meta.json").voices[0];
  ok("…its character alignment becomes the line's words; the raw PCM a wav", v8.words.map((w) => w.text).join(" ") === LINES[0] && v8.words[1].start === 0.15 && parseWav(readFileSync(join(P, "assets", "voice", "01.wav")))?.sampleRate === 24000, JSON.stringify(v8.words.slice(0, 3)));

  // ── openrouter: one key for the speech and the timings; its mp3 made a wav by ffmpeg ──
  // (the fake API makes its mp3 with ffmpeg, and narrate makes it a wav with it: with no ffmpeg here, not checked)
  const ffmpeg = (() => { try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } })();
  if (!ffmpeg) ok("openrouter: its mp3 made a wav (skipped: ffmpeg is not on PATH)", true);
  else {
    config({ tts: "openrouter", model: "hexgrad/kokoro-82m", base_url: `${BASE}/openrouter/api/v1`, timings_base_url: `${BASE}/openrouter/api/v1`, concurrency: 1 });
    const r10 = await narrate([], { GROQ_API_KEY: null, OPENAI_API_KEY: null });
    const or = speechReqs(r10), ort = transReqs(r10);
    ok("openrouter: every line voiced at its /audio/speech, its Kokoro with the video's Kokoro voice, mp3 asked for, the one key",
      r10.code === 0 && or.length === 5 && or.every((q) => q.path === "/openrouter/api/v1/audio/speech" && q.headers.authorization === `Bearer ${KEYS.OPENROUTER_API_KEY}` && q.json.model === "hexgrad/kokoro-82m" && q.json.voice === KV && q.json.response_format === "mp3" && q.json.speed === 1.25 && !("instructions" in q.json)), `${JSON.stringify(or[0]?.json)}\n${r10.out}`);
    ok("…timed by its own transcriber, openai/whisper-1, with the same key (no Groq or OpenAI key set)",
      ort.length === 5 && ort.every((q) => q.path === "/openrouter/api/v1/audio/transcriptions" && q.form.model === "openai/whisper-1" && q.form.response_format === "verbose_json" && q.form.granularity.join() === "word" && q.form.riff === "RIFF" && q.headers.authorization === `Bearer ${KEYS.OPENROUTER_API_KEY}`)
      && json(".hyperframes/narration.json").model === "openrouter hexgrad/kokoro-82m + openrouter openai/whisper-1", JSON.stringify(ort[0]?.form));
    const v10 = json("audio_meta.json").voices[0], w10 = parseWav(readFileSync(join(P, "assets", "voice", "01.wav")));
    ok("…the mp3 a 24 kHz wav about as long as what was said, the line's own words timed", w10?.sampleRate === 24000 && Math.abs(v10.duration_s - LINES[0].split(" ").length * 0.3) < 0.15 && v10.words.map((w) => w.text).join(" ") === LINES[0], JSON.stringify(v10).slice(0, 300));
  }

  // ── music: HyperFrames' engine, merged under the voices ──
  const MEDIA = join(tmp, "fake-media-engine.mjs");
  writeFileSync(MEDIA, `import { readFileSync, writeFileSync } from "node:fs";
const a = process.argv.slice(2), f = (n) => a[a.indexOf("--" + n) + 1];
const req = JSON.parse(readFileSync(f("request"), "utf8")), m = JSON.parse(readFileSync(f("out"), "utf8"));
if (f("only") !== "bgm" || req.bgm.mode !== "retrieve") process.exit(4);
writeFileSync(f("out"), JSON.stringify({ ...m, bgm: { path: "assets/bgm.mp3", volume: 0.2, mode: "retrieve", query: req.bgm.query }, bgm_provider: "fake" }));`);
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(LINES.length, "calm piano"));
  setLines([...LINES.slice(0, 4), "Then you approve it, or ask for a change."]);
  const r9 = await narrate([], { REELPLANNER_MEDIA_ENGINE: MEDIA });
  const m9 = json("audio_meta.json");
  ok("music comes from HyperFrames' engine on the last call, merged under the voices", r9.code === 0 && m9.bgm?.path === "assets/bgm.mp3" && m9.bgm.query === "calm piano" && m9.voices.length === 5 && json("audio_engine_meta.json").bgm_provider === "fake", `${JSON.stringify(m9.bgm)}\n${r9.out}`);

  // ── the settings ──
  const S = (narration, env = {}) => { config(narration); return narrationSettings(P, { ...env }); };
  ok("settings: no tts is HyperFrames' engine, unchanged", S({}).engine === "hyperframes" && !S({}).error);
  ok("…an unknown provider names the ones there are", /"espeak" is not one of: openai, openai-compatible, deepinfra, openrouter, elevenlabs, kokoro/.test(S({ tts: "espeak" }).error));
  ok("…openai has no timings of its own: says to pick api or local", /returns no word timings of its own: set narration.timings to "api"/.test(S({ tts: "openai", timings: "provider" }).error));
  ok("…openai-compatible needs a base URL", /needs a base URL: narration.base_url/.test(S({ tts: "openai-compatible", model: "m", voice: "v" }).error));
  ok("…a whisper model alone asks for tts kokoro", /needs a "tts" too/.test(S({ whisper_model: "base.en" }).error));
  const env1 = S({ tts: "openai" }, { REELPLANNER_TTS: "elevenlabs" });
  ok("…the environment wins over config.json", env1.tts === "elevenlabs" && env1.from.includes("REELPLANNER_TTS"));
  const loc = S({ tts: "kokoro", whisper_model: "base.en" });
  ok("…local Kokoro with a smaller whisper: one line at a time, whisper base.en in the key", loc.engine === "reelplanner" && !loc.hosted && loc.concurrency === 1 && loc.keyModel === "kokoro + whisper base.en" && !loc.missing.length);
  const orr = S({ tts: "openrouter" }, { GROQ_API_KEY: "x" });
  ok("…openrouter: Deepgram Aura-2 and aura-2-apollo-en by default (its Kokoro route is slow), timed by openrouter openai/whisper-1 even with a Groq key, one key missing once",
    orr.model === "deepgram/aura-2" && orr.voice === "aura-2-apollo-en" && orr.family === "openrouter deepgram" && orr.timingsApi.name === "openrouter" && orr.timingsApi.model === "openai/whisper-1" && orr.missing.join() === "OPENROUTER_API_KEY", JSON.stringify(orr));
  ok("…each OpenRouter vendor its own voices: a video voiced by Aura-2, switched to ElevenLabs, does not keep Aura's voice",
    familyOf("openrouter deepgram/aura-2 + openrouter openai/whisper-1") === "openrouter deepgram" && familyOf("openrouter elevenlabs/eleven-flash-v2.5 + openrouter openai/whisper-1") === "openrouter elevenlabs"
    && familyOf("openrouter hexgrad/kokoro-82m + openrouter openai/whisper-1") === "kokoro" && S({ tts: "openrouter", model: "elevenlabs/eleven-flash-v2.5" }).family === "openrouter elevenlabs");
  ok("…an OpenAI model on openrouter takes onyx, an ElevenLabs one George, its Kokoro am_michael; another model asks for a voice",
    S({ tts: "openrouter", model: "openai/gpt-4o-mini-tts-2025-12-15" }).voice === "onyx" && S({ tts: "openrouter", model: "elevenlabs/eleven-flash-v2.5" }).voice === "JBFqnCBsd6RMkjVDRZzb"
    && S({ tts: "openrouter", model: "hexgrad/kokoro-82m" }).voice === "am_michael" && S({ tts: "openrouter", model: "hexgrad/kokoro-82m" }).family === "kokoro" && /"openrouter" with model "mistralai\/voxtral-mini-tts-2603" needs narration.voice/.test(S({ tts: "openrouter", model: "mistralai/voxtral-mini-tts-2603" }).error));
  const ovr = S({ tts: "openai", model: "tts-1", voice: "nova", timings_api: "openai", timings_model: "whisper-x" }, {});
  const ov2 = (() => { config({ tts: "openai", model: "tts-1", voice: "nova", timings_api: "openai", timings_model: "whisper-x" }); return narrationSettings(P, {}, { tts: "deepinfra", timings_api: "groq" }); })();
  ok("…flags (narration-check's) win, and another provider leaves config.json's model, voice and transcriber settings out",
    ovr.model === "tts-1" && ov2.tts === "deepinfra" && ov2.model === "hexgrad/Kokoro-82M" && ov2.voice === "am_michael" && ov2.from[0] === "the command line", JSON.stringify(ov2));
  const grq = S({ tts: "kokoro", timings: "api" }, {});
  ok("…local Kokoro timed by groq: GROQ_API_KEY is what is missing", grq.timingsApi.name === "groq" && grq.missing.join() === "GROQ_API_KEY");
  config({ tts: "openai" });
  const d1 = describe(P, {});
  ok("setup --dry-run's line: the engine, the key variable, and what is not set", !d1.ok && /narration: openai gpt-4o-mini-tts \(OPENAI_API_KEY\), voice onyx, word timings from groq whisper-large-v3-turbo/.test(d1.text) && /not set: OPENAI_API_KEY, GROQ_API_KEY/.test(d1.text), d1.text);
  rmSync(CFG);
  const d2 = describe(P, {});
  ok("…and the default, said as the default", d2.ok && /HyperFrames' engine, local Kokoro \+ whisper small\.en.*the default/.test(d2.text), d2.text);

  // ── the mapping on its own ──
  ok("alignWords: a run the transcriber split differently shares the time of what it heard there, by length",
    JSON.stringify(alignWords("Run claude dash p now.", [{ text: "run", start: 0, end: 0.2 }, { text: "cloud", start: 0.2, end: 0.5 }, { text: "dash-p", start: 0.5, end: 0.8 }, { text: "now", start: 0.9, end: 1.1 }]).map((w) => [w.text, w.start, w.end]))
      === JSON.stringify([["Run", 0, 0.2], ["claude", 0.2, 0.527], ["dash", 0.527, 0.745], ["p", 0.745, 0.8], ["now.", 0.9, 1.1]]));
  ok("…and nothing heard is no timings, not made-up ones", alignWords("Hello there.", []).length === 0);
  // a server that answers mp3 whatever it was asked for: ffmpeg (which reelplanner needs anyway) makes it a wav
  if (!ffmpeg) ok("toWav: audio that is not a wav goes through ffmpeg (skipped: ffmpeg is not on PATH)", true);
  else {
    const mp3 = join(tmp, "t.mp3");
    execFileSync("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", "sine=frequency=440:duration=1", "-f", "mp3", mp3]);
    const fromMp3 = toWav(readFileSync(mp3));
    ok("toWav: audio that is not a wav goes through ffmpeg", fromMp3 && parseWav(fromMp3.wav)?.sampleRate === 24000 && Math.abs(fromMp3.duration_s - 1) < 0.1, JSON.stringify(fromMp3?.duration_s));
  }
} finally {
  api.close();
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ narrate-api: hosted narration, through fake APIs");
process.exit(failed ? 1 : 0);
