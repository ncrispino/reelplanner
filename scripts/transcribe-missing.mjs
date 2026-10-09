#!/usr/bin/env node
// Re-transcribe voice lines whose whisper pass returned no words.
//
// Why they go missing: the audio engine runs Kokoro TTS and whisper at a bounded concurrency
// (HYPERFRAMES_TTS_CONCURRENCY), each subprocess loading its own model. On a constrained machine the
// longest lines lose that race and land with `words: []`. Run alone, the same line transcribes in
// seconds, so this re-runs just the transcription, one line at a time, and patches the words back in.
// captions-sentences stops on a frame with no words and points here.
//
// Both meta files are patched. audio_meta.json is what the caption builder reads, but `audio.mjs
// fetch-sfx` rebuilds it wholesale from audio_engine_meta.json — so a repair written only to the
// former is thrown away by the next fetch-sfx.
//
// What transcribes them is what times lines here (scripts/lib/narrator.mjs): with a hosted engine whose word timings
// come from a transcription API, that API (no local whisper needed); with a hosted engine that times its own speech
// (DeepInfra, ElevenLabs), a transcription API whose key is set, else local whisper; otherwise local whisper, at the
// model the settings name (small.en, HyperFrames' engine's).
//
// usage: reelplanner transcribe-missing <project-dir>
import { readFileSync, writeFileSync, mkdtempSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { hyperframesBin, RP_COMMAND } from "./lib/env.mjs";
import { loadEnvFile, narrationSettings, DEFAULT_WHISPER } from "./lib/narrator.mjs";
import { transcribe, alignWords, toWav } from "./lib/tts-api.mjs";
import { recordPath, pad2 } from "./lib/narration.mjs";
import { whisperPath } from "./lib/local-speed.mjs";

const dir = process.argv[2];
if (!dir) { console.error("usage: reelplanner transcribe-missing <project-dir>"); process.exit(1); }
const projectDir = resolve(dir);
const metaPath = join(projectDir, "audio_meta.json");
const enginePath = join(projectDir, "audio_engine_meta.json");
if (!existsSync(metaPath)) { console.error(`✗ no audio_meta.json in ${dir}`); process.exit(1); }
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const engine = existsSync(enginePath) ? JSON.parse(readFileSync(enginePath, "utf8")) : null;

// Timings come off each wav in its own timebase: narration is synthesised at its final speed
// (patch-tts-speed.mjs), never stretched afterwards. A project narrated by the old ffmpeg speed pass
// carries `speed_applied`, and patching unscaled words into its scaled ones would mix two timebases.
if (meta.speed_applied) {
  console.error(`✗ ${dir} carries speed_applied ×${meta.speed_applied} (built by the retired ffmpeg speed pass).`);
  console.error("  Re-generate its narration so the wavs and their timings share one timebase.");
  process.exit(1);
}

const missing = (meta.voices || []).filter((v) => !v.words?.length);
if (!missing.length) { console.log(`✓ ${dir}: all ${(meta.voices || []).length} voices have word timings`); process.exit(0); }

// what transcribes: a hosted transcriber when narration here is timed by one (or times its own speech and one has
// its key set), else local whisper (see the top of this file)
loadEnvFile(projectDir);
const S = narrationSettings(projectDir);
let api = null, model = DEFAULT_WHISPER;
if (S.engine === "reelplanner" && !S.error) {
  if (S.timings === "api") api = S.timingsApi;
  else if (S.timings === "local") model = S.whisperModel;
  else {
    const t = narrationSettings(projectDir, process.env, { timings: "api" }).timingsApi;
    if (t && process.env[t.keyEnv]) api = t;
    else if (!whisperPath()) {
      console.error(`✗ ${dir}: frame(s) ${missing.map((v) => v.frame).join(", ")} have no word timings, and nothing here can transcribe them: narration is ${S.tts}, which times its own speech, no transcription API key is set and whisper.cpp is not installed.`);
      console.error(`  Put OPENROUTER_API_KEY (or GROQ_API_KEY, or OPENAI_API_KEY) in ~/.reelplanner/.env, or run \`${RP_COMMAND} setup --local-voice\`, then run this again.`);
      process.exit(1);
    }
  }
  if (api && !process.env[api.keyEnv]) { console.error(`✗ ${dir}: ${api.keyEnv} is not set: the word timings come from ${api.name} ${api.model}, which needs it (in ~/.reelplanner/.env, or the shell)`); process.exit(1); }
}
// the words each line was voiced with (as said), for lining a transcriber's words up with them
const said = Object.fromEntries(Object.entries((() => { try { return JSON.parse(readFileSync(recordPath(projectDir), "utf8")).lines || {}; } catch { return {}; } })()).map(([id, e]) => [id, e.said || e.text]));

console.log(`${missing.length} voice(s) with no word timings: ${missing.map((v) => v.frame).join(", ")} — transcribing serially with ${api ? `${api.name} ${api.model}` : `local whisper ${model}`}`);
const failed = [];
for (const v of missing) {
  const wav = join(projectDir, v.path);
  if (!existsSync(wav)) { console.log(`✗ frame ${v.frame}: ${v.path} is missing`); failed.push(v.frame); continue; }
  const td = mkdtempSync(join(tmpdir(), "hf-retx-"));
  try {
    let raw;
    if (api) {
      const audio = toWav(readFileSync(wav))?.wav;   // a wav, or an mp3 project's line made one (D-305)
      if (!audio) throw new Error(`${v.path} is not audio ffmpeg can read`);
      const heard = await transcribe(api, audio, { retries: S.retries, retryMs: S.retryMs });
      const text = said[pad2(v.frame)];
      raw = text ? alignWords(text, heard, v.duration_s) : heard;
    } else {
      execFileSync(process.execPath, [hyperframesBin(), "transcribe", v.path, "--model", model, "--dir", td, "--timeout", "600000"],
        { cwd: projectDir, stdio: ["ignore", "ignore", "pipe"], env: { ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS: "600000" } });
      const src = join(td, "transcript.json");
      raw = existsSync(src) ? JSON.parse(readFileSync(src, "utf8")) : null;
    }
    if (Array.isArray(raw) && raw.length) {
      const words = raw.map((w, i) => ({ id: w.id ?? `w${i}`, text: w.text, start: w.start, end: w.end }));
      v.words = words;
      const ev = engine?.voices?.find((x) => x.id === String(v.frame).padStart(2, "0") || x.path === v.path);
      if (ev) ev.words = words;
      console.log(`✓ frame ${v.frame}: ${words.length} words${ev ? "" : " (no sidecar entry — fetch-sfx may drop this)"}`);
    } else { console.log(`✗ frame ${v.frame}: transcribed but produced no words`); failed.push(v.frame); }
  } catch (e) {
    console.log(`✗ frame ${v.frame}: ${String(e.message || e).split("\n")[0]}`);
    failed.push(v.frame);
  } finally { rmSync(td, { recursive: true, force: true }); }
}

writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
if (engine) writeFileSync(enginePath, JSON.stringify(engine, null, 2) + "\n");

const fixed = missing.length - failed.length;
console.log(`${failed.length ? "✗" : "✓"} ${dir}: ${fixed} of ${missing.length} repaired${failed.length ? `, still missing: ${failed.join(", ")}` : ""}`);
process.exit(failed.length ? 1 : 0);
