#!/usr/bin/env node
// Transcribe a sketch's voice from its recording, after the fact (docs/sketch.md): for a sketch made with no live
// transcript (Firefox, a blocked recognizer, or no wish to send audio to Google), or to replace the browser's with a
// better one. It writes the transcript into session.json, makes each keyframe's "said" again from it, and writes
// sketch.md again.
//
//   reelplanner sketch-transcribe <sketch-folder> [--api] [--model <whisper model>] [--lang <code>]
//
// By local whisper (whisper.cpp, `reelplanner setup --local-voice`) when it is installed, at small.en (or
// REELPLANNER_WHISPER_MODEL, or --model); else a transcription API whose key is set (GROQ_API_KEY, OPENAI_API_KEY,
// OPENROUTER_API_KEY; ~/.reelplanner/.env or the shell). --api uses the API even with whisper here. --lang is the
// language spoken (default: the browser's, else en). `reelplanner sketch` runs the local one by itself after Send
// when there was no live transcript.
import { existsSync } from "node:fs";
import { resolve, join, relative } from "node:path";
import { sketchTranscriber, transcribeSketch, transcriberName } from "./lib/sketch-transcript.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const VALUED = new Set(["--model", "--lang"]);
const [folder] = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
const die = (m) => { console.error(`✗ sketch-transcribe: ${m}`); process.exit(1); };
if (!folder) die("usage: reelplanner sketch-transcribe <sketch-folder> [--api] [--model <whisper model>] [--lang <code>]");
const dir = resolve(folder);
if (!existsSync(join(dir, "session.json"))) die(`${folder} is not a sketch folder (no session.json in it)`);

const by = sketchTranscriber({ dir, api: args.includes("--api") ? true : undefined, model: flag("model") });
if (!by.kind) die(`nothing here can transcribe it: ${by.why}`);
console.log(`· transcribing ${relative(process.cwd(), dir) || "."} with ${transcriberName(by)}${by.kind === "whisper" ? " (the voice stays on this machine)" : ""} …`);
try {
  const r = await transcribeSketch(dir, by, { lang: flag("lang") });
  console.log(`✓ ${r.words.length} words in ${r.segments.length} sentence${r.segments.length === 1 ? "" : "s"} (${transcriberName(r.by)}) → session.json and sketch.md`);
} catch (e) { die(e.message); }
