#!/usr/bin/env node
// reelplanner's narration engine: a stand-in for HyperFrames' media-use audio engine (its audio.mjs), with the
// same command line and the same output, used when .reelplanner/config.json's `narration.tts` (or
// REELPLANNER_TTS) names a provider (scripts/lib/narrator.mjs). `reelplanner narrate` hands it to
// faceless-explainer's audio.mjs as HF_MEDIA_ENGINE, audio.mjs's own override, so nothing of HyperFrames' is changed.
//
//   node narrate-engine.mjs --request ./audio_request.json --hyperframes <dir> --out ./audio_engine_meta.json --only tts,bgm
//
// In: the request audio.mjs writes ({ speed, voice?, lines: [{ id, text }], bgm }). Out, as the engine writes it:
// assets/voice/<id>.wav for each line, and { tts_provider, voice_id, bgm…, voices: [{ id, path, duration_s,
// words: [{ id, text, start, end }] }], sfx, total_duration_s }.
//
// Speech comes from the provider (scripts/lib/tts-api.mjs), or from local Kokoro (`hyperframes tts`, tts-local.mjs); word
// timings from the provider itself, a transcription API, or local whisper at the model the settings name
// (`hyperframes transcribe --model`, which HyperFrames' engine fixes at small.en). Lines run `concurrency` at a
// time. Music and sound effects are not this engine's: for --only bgm/sfx it runs HyperFrames' engine
// (REELPLANNER_MEDIA_ENGINE) on the same files after the voices are written, which merges into them.
//
// The settings arrive as JSON in REELPLANNER_NARRATION (narrate resolves them); the keys from the environment.
// A line that fails after its retries is left out and named (narrate voices it again next run); a refused key
// stops the run.
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { loadEnvFile } from "./narrator.mjs";
import { synthesize, transcribe, alignWords, FatalApiError } from "./tts-api.mjs";
import { kokoro, whisper } from "./tts-local.mjs";

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const die = (m, code = 1) => { console.error(`✗ narrate engine: ${m}`); process.exit(code); };
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const r3 = (x) => Number(x.toFixed(3));

const dir = resolve(flag("hyperframes", "."));
const reqPath = resolve(flag("request", join(dir, "audio_request.json")));
const outPath = resolve(flag("out", join(dir, "audio_meta.json")));
const only = new Set(flag("only", "tts,bgm,sfx").split(",").map((x) => x.trim()).filter(Boolean));
const request = readJson(reqPath) || die(`cannot read ${reqPath}`);
let s;
try { s = JSON.parse(process.env.REELPLANNER_NARRATION || ""); } catch { die("REELPLANNER_NARRATION holds no settings (run it through `reelplanner narrate`)"); }
loadEnvFile(dir);
const lines = Array.isArray(request.lines) ? request.lines : [];
const lang = request.lang || "en";
const speed = Number(request.speed) || 1;
const voice = request.voice || s.voice;
const prev = readJson(outPath) || {};
const anomalies = [];

// ── one line ──────────────────────────────────────────────────────────────────────────────────────
async function voiceLine(line) {
  const id = String(line.id), text = String(line.text ?? "").trim();
  if (!text) { anomalies.push(`line ${id}: empty text — skipped`); return null; }
  const rel = `assets/voice/${id}.wav`, abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  const onRetry = ({ attempt, why, wait }) => console.error(`  · line ${id}: ${why} — trying again in ${(wait / 1000).toFixed(1)} s (${attempt}/${s.retries})`);
  try {
    let got;
    if (s.tts === "kokoro") got = await kokoro(text, abs, { voice, speed, cwd: dir });
    else {
      got = await synthesize(s, { text, voice, speed }, { onRetry });
      const tmp = `${abs}.${process.pid}.tmp`;
      writeFileSync(tmp, got.wav); renameSync(tmp, abs);
    }
    if (got.note) anomalies.push(`line ${id}: ${got.note}`);
    let words;
    if (s.timings === "provider") words = alignWords(text, got.words, got.duration_s);
    else if (s.timings === "api") words = alignWords(text, await transcribe({ ...s.timingsApi, retries: s.retries, retryMs: s.retryMs }, got.wav ?? readFileSync(abs), { lang, onRetry }), got.duration_s);
    else words = await whisper(abs, { model: s.whisperModel, lang, cwd: dir });   // local whisper's own words, as HyperFrames' engine keeps them
    if (!words.length) anomalies.push(`line ${id}: no word timings came back`);
    const v = { id, path: rel, duration_s: r3(got.duration_s), words: words.map((w, i) => ({ id: `w${i}`, text: w.text, start: w.start, end: w.end })) };
    console.error(`  voice ${id}: ${rel} (${v.duration_s}s, ${v.words.length} words)`);
    return v;
  } catch (e) {
    if (e instanceof FatalApiError) die(e.message, 2);
    anomalies.push(`line ${id}: ${e.message} — omitted`);
    return null;
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]); } }));
  return out;
}

// ── tts ──────────────────────────────────────────────────────────────────────────────────────────
let voices = prev.voices ?? [];
if (only.has("tts") && lines.length) {
  console.error(`· tts: ${s.keyModel} · voice ${voice} · ${lines.length} line(s), ${Math.min(s.concurrency, lines.length)} at a time`);
  voices = (await mapLimit(lines, s.concurrency, voiceLine)).filter(Boolean);
}
const BGM_FIELDS = ["bgm_pending", "bgm_provider", "bgm_pid", "bgm_log", "bgm_mode", "bgm_target_duration_s", "bgm_seed_duration_s", "bgm_loop_count"];
const meta = {
  tts_provider: only.has("tts") && lines.length ? s.tts : prev.tts_provider ?? null,
  voice_id: only.has("tts") && lines.length ? voice : prev.voice_id ?? null,
  bgm: only.has("bgm") ? null : prev.bgm ?? null,
  ...Object.fromEntries(BGM_FIELDS.map((k) => [k, only.has("bgm") ? (k === "bgm_pending" ? false : null) : prev[k] ?? (k === "bgm_pending" ? false : null)])),
  voices,
  sfx: prev.sfx ?? [],
  total_duration_s: r3(voices.reduce((a, v) => a + (v.duration_s || 0), 0)),
};
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(meta, null, 2));

// ── music and sound effects: HyperFrames' engine, merging into what is written ──────────────────
const rest = [...only].filter((x) => x === "sfx" || (x === "bgm" && request.bgm?.mode && request.bgm.mode !== "none"));
if (rest.length) {
  const media = process.env.REELPLANNER_MEDIA_ENGINE;
  if (!media || !existsSync(media)) anomalies.push(`${rest.join(", ")}: HyperFrames' audio engine not found (${media || "REELPLANNER_MEDIA_ENGINE unset"}) — skipped`);
  else {
    const r = spawnSync(process.execPath, [media, "--request", reqPath, "--hyperframes", dir, "--out", outPath, "--only", rest.join(",")], { stdio: ["ignore", "inherit", "inherit"] });
    if (r.status !== 0) anomalies.push(`${rest.join(", ")}: HyperFrames' audio engine exited ${r.status ?? r.signal} — skipped`);
  }
}

console.log(`✓ narrate engine → ${outPath}`);
console.log(`  voices: ${voices.length}  ·  total voice duration: ${meta.total_duration_s}s`);
if (anomalies.length) {
  console.log(`\nanomalies (non-fatal):`);
  for (const a of anomalies) console.log(`  - ${a}`);
}
