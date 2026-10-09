// A sketch's transcript made from its recording, after the fact, and the sketch.md an agent reads first.
//
// The page's live caption is the browser's own recognizer: in Chrome it sends the audio to Google, Firefox has none,
// and it can be blocked. Whichever way, the voice is in recording.webm, and this reads it there:
//   - local whisper (whisper.cpp through HyperFrames' `transcribe`, as narration's word timings are made): the voice
//     stays on this machine. `reelplanner sketch` runs it after Send when there is no live transcript and whisper.cpp
//     is installed (`reelplanner setup --local-voice`).
//   - a transcription API with word timings (Groq, OpenAI, OpenRouter: the first whose key is set, as narration's
//     timings find one): only when asked for, by `reelplanner sketch-transcribe <folder>` with no whisper here, or
//     with --api.
// The words replace the transcript in session.json, each keyframe's `said` is made again from them (and the typed
// notes) on the recording's clock, and sketch.md is written again.
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { RP_COMMAND } from "./env.mjs";
import { whisperPath } from "./local-speed.mjs";
import { whisper } from "./tts-local.mjs";
import { transcribe } from "./tts-api.mjs";
import { loadEnvFile, DEFAULT_WHISPER, TIMINGS_APIS } from "./narrator.mjs";

const mmss = (s) => s == null ? "–" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** How sketch.md names where the transcript came from. */
function transcriptLine(s, rel) {
  const t = s.transcript || {};
  if (t.source === "browser-speech") return "the browser's live speech recognition (may have errors; the audio is in the recording)";
  if (t.source === "whisper") return `local whisper ${t.model}, from the recording`;
  if (t.source === "api") return `${t.api} ${t.model}, from the recording`;
  return s.recording?.has_audio
    ? `none yet: the voice is in the recording; \`${RP_COMMAND} sketch-transcribe ${rel}\` makes one`
    : "none (recorded without a microphone)";
}

/** What an agent reads first: the question, what was said with a picture at each pause, the drawing, the notes. */
export function sketchMd(s, dir) {
  const rel = relative(process.cwd(), dir) || ".";
  const els = s.final?.elements || [], byId = new Map(els.map((e) => [e.id, e]));
  const name = (id) => { const e = byId.get(id); return e ? `"${(e.label || e.text || e.name || e.kind).replace(/\s+/g, " ")}"` : "(nothing)"; };
  const shapes = els.filter((e) => !["arrow", "line", "freedraw", "text"].includes(e.kind));
  const arrows = els.filter((e) => e.kind === "arrow");
  const texts = els.filter((e) => e.kind === "text");
  const free = els.filter((e) => e.kind === "freedraw").length;
  const lines = [
    `# Sketch: ${s.question || "(no question given)"}`, "",
    `How someone thinks this works, drawn and said on a canvas: their model, not the code's. Compare it with the code; don't treat it as true.`, "",
    `- **When:** ${s.created} · ${mmss(s.duration_s)} recorded${s.recording?.has_audio ? " with voice" : " (no voice)"}`,
    `- **Code it is about:** ${s.context?.repoName || "?"} at \`${(s.context?.commit || "no commit").slice(0, 12)}\`${s.context?.branch ? ` on \`${s.context.branch}\`` : ""}${s.context?.dirty ? " (with uncommitted changes)" : ""}`,
    `- **Files:** \`${s.recording?.file}\` (the canvas with the voice; the pointer is the orange dot), \`keyframes/\`, \`final.png\`, \`final.excalidraw\`, \`session.json\` (everything, timed)`,
    `- **Transcript:** ${transcriptLine(s, rel)}`,
    "",
  ];
  if (s.feedback) lines.push(`## Their note when sending`, "", `> ${s.feedback.replace(/\n/g, "\n> ")}`, "");
  lines.push(`## What they said and drew, in order`, "", `Each picture is the canvas when a thought ended; the text is what they said or typed since the one before.`, "");
  const kfs = s.keyframes || [];
  for (const k of kfs) lines.push(`- **${mmss(k.t)}** ${k.said ? k.said : "_(drawing, nothing said)_"}${k.file ? ` → [picture](${k.file})` : ""}`);
  // what was said after the last picture (a transcript made afterwards has no keyframe at each sentence's end)
  const lastT = kfs.length ? kfs[kfs.length - 1].t : -Infinity;
  const after = (s.transcript?.segments || []).filter((x) => x.t0 >= lastT);
  if (after.length) lines.push(`- **${mmss(after[0].t0)}** ${after.map((x) => x.text).join(" ")} _(said after the last picture)_`);
  if (!kfs.length && !after.length) lines.push("_(no pictures: nothing was drawn or said while recording)_");
  lines.push("", `## The final drawing`, "", s.final?.png ? `![final drawing](final.png)` : "_(empty canvas)_", "");
  if (shapes.length) { lines.push(`**Boxes and shapes**`, ""); for (const e of shapes) lines.push(`- ${e.kind}${e.label ? ` "${e.label.replace(/\s+/g, " ")}"` : " (no label)"}`); lines.push(""); }
  if (arrows.length) { lines.push(`**Arrows**`, ""); for (const a of arrows) lines.push(`- ${name(a.from)} → ${name(a.to)}${a.label ? ` (labeled "${a.label.replace(/\s+/g, " ")}")` : ""}`); lines.push(""); }
  if (texts.length) { lines.push(`**Text on the canvas**`, ""); for (const t of texts) lines.push(`- "${t.text.replace(/\s+/g, " ")}"`); lines.push(""); }
  if (free) lines.push(`Plus ${free} freehand stroke${free === 1 ? "" : "s"}: see the pictures.`, "");
  if ((s.notes || []).length) { lines.push(`## Typed notes`, ""); for (const n of s.notes) lines.push(`- **${mmss(n.t)}** ${n.text}`); lines.push(""); }
  if (s.before_recording) lines.push(`_${s.before_recording} element${s.before_recording === 1 ? " was" : "s were"} drawn before recording started._`, "");
  return lines.join("\n");
}

/**
 * What would transcribe a sketch here. `api: false` (after Send): local whisper or nothing, so the voice never leaves
 * the machine unasked. `api: true` (--api): a transcription API only. Else whisper, then an API whose key is set.
 * → { kind: "whisper", model } | { kind: "api", api } | { kind: null, why }
 */
export function sketchTranscriber({ dir = process.cwd(), api, model } = {}) {
  loadEnvFile(dir);
  const local = { kind: "whisper", model: model || process.env.REELPLANNER_WHISPER_MODEL || DEFAULT_WHISPER };
  if (api !== true && whisperPath()) return local;
  if (api !== false) for (const n of ["groq", "openai", "openrouter"]) if (process.env[TIMINGS_APIS[n].keyEnv]) return { kind: "api", api: { name: n, ...TIMINGS_APIS[n] } };
  return { kind: null, why: api === true
    ? "no transcription API key is set (GROQ_API_KEY, OPENAI_API_KEY or OPENROUTER_API_KEY)"
    : `whisper.cpp is not installed (\`${RP_COMMAND} setup --local-voice\`)${api === false ? "" : ", and no transcription API key is set (GROQ_API_KEY, OPENAI_API_KEY or OPENROUTER_API_KEY)"}` };
}

/** Words in order → sentences: a break after . ? ! or at a pause of a second or more. */
function segmentsOf(words) {
  const out = []; let cur = null;
  for (const w of words) {
    const text = String(w.text || "").trim(); if (!text) continue;
    if (cur && w.start - cur.t1 >= 1) { out.push(cur); cur = null; }
    if (!cur) cur = { t0: +w.start.toFixed(2), t1: +w.end.toFixed(2), text, confidence: null };
    else { cur.text += " " + text; cur.t1 = +w.end.toFixed(2); }
    if (/[.?!]["')\]]?$/.test(text)) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out;
}

/** Each keyframe's `said` again, from the words and the typed notes since the keyframe before it. */
function resaid(s, words) {
  const items = [...words.map((w) => ({ t: (w.start + w.end) / 2, text: String(w.text).trim() })),
    ...(s.notes || []).filter((n) => n.t != null).map((n) => ({ t: n.t, text: `(typed) ${n.text}` }))].filter((x) => x.text).sort((a, b) => a.t - b.t);
  let prev = -Infinity;
  for (const k of s.keyframes || []) { k.said = items.filter((x) => x.t > prev && x.t <= k.t).map((x) => x.text).join(" "); prev = k.t; }
}

/**
 * Transcribe the sketch in `dir` from its recording with `by` (sketchTranscriber()), and write session.json and
 * sketch.md again. → { words, segments, by }
 */
export async function transcribeSketch(dir, by, { lang } = {}) {
  const sPath = join(dir, "session.json");
  const s = JSON.parse(readFileSync(sPath, "utf8"));
  const rec = join(dir, s.recording?.file || "recording.webm");
  if (!existsSync(rec)) throw new Error(`${relative(process.cwd(), rec)} is not here (the recording stays on the machine it was made on)`);
  if (s.recording && !s.recording.has_audio) throw new Error("it was recorded without a microphone: there is no voice to transcribe");
  lang ||= String(s.transcript?.lang || "en").split("-")[0].toLowerCase();
  const td = mkdtempSync(join(tmpdir(), "rp-sketch-tx-"));
  try {
    // the voice alone, as whisper takes it: 16 kHz mono
    const wav = join(td, "voice.wav");
    try { execFileSync("ffmpeg", ["-v", "error", "-y", "-i", rec, "-vn", "-ac", "1", "-ar", "16000", wav], { stdio: ["ignore", "ignore", "pipe"], timeout: 300000 }); }
    catch (e) { throw new Error(`ffmpeg could not take the voice out of the recording: ${String(e.stderr || e.message).trim().split("\n").pop()}`); }
    let words;
    if (by.kind === "whisper") {
      const model = lang !== "en" ? by.model.replace(/\.en$/, "") : by.model;   // an .en model hears English only
      words = await whisper(wav, { model, lang, timeoutMs: 30 * 60000 });
      by = { ...by, model };
    } else if (by.kind === "api") words = await transcribe(by.api, readFileSync(wav), { lang });
    else throw new Error(by.why || "nothing here can transcribe it");
    words = words.filter((w) => Number.isFinite(w.start) && Number.isFinite(w.end));
    const segments = segmentsOf(words), was = s.transcript?.source;
    s.transcript = { source: by.kind, ...(by.kind === "api" ? { api: by.api.name, model: by.api.model } : { model: by.model }), lang,
      made: new Date().toISOString(), ...(was && was !== "none" && was !== by.kind ? { replaced: was } : {}), segments };
    resaid(s, words);
    writeFileSync(sPath, JSON.stringify(s, null, 2) + "\n");
    writeFileSync(join(dir, "sketch.md"), sketchMd(s, dir));
    return { words, segments, by };
  } finally { rmSync(td, { recursive: true, force: true }); }
}

/** How a line names a transcriber: "local whisper small.en", "groq whisper-large-v3-turbo". */
export const transcriberName = (by) => by.kind === "whisper" ? `local whisper ${by.model}` : by.kind === "api" ? `${by.api.name} ${by.api.model}` : "nothing";
