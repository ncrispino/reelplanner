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
import { execFileSync, spawnSync } from "node:child_process";
import { RP_COMMAND } from "./env.mjs";
import { whisperPath } from "./local-speed.mjs";
import { whisper } from "./tts-local.mjs";
import { transcribe } from "./tts-api.mjs";
import { loadEnvFile, DEFAULT_WHISPER, TIMINGS_APIS } from "./narrator.mjs";
import { describeScene, sceneChanges } from "./sketch-scene.mjs";

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
  const els = s.final?.elements || [];
  const lines = [
    `# Sketch: ${s.question || "(no question given)"}`, "",
    `How someone thinks this works, drawn and said on a canvas: their model, not the code's. Compare it with the code; don't treat it as true.`, "",
    `- **When:** ${s.created} · ${mmss(s.duration_s)} recorded${s.recording?.has_audio ? " with voice" : " (no voice)"}`,
    `- **Code it is about:** ${s.context?.repoName || "?"} at \`${(s.context?.commit || "no commit").slice(0, 12)}\`${s.context?.branch ? ` on \`${s.context.branch}\`` : ""}${s.context?.dirty ? " (with uncommitted changes)" : ""}`,
    `- **Files:** \`${s.recording?.file}\` (the canvas with the voice; the pointer is the orange dot), \`keyframes/\`, \`final.png\`, \`final.excalidraw\`, \`session.json\` (everything, timed)`,
    `- **Transcript:** ${transcriptLine(s, rel)}`,
  ];
  const asked = s.partner?.questions || [];
  if (asked.length) lines.push(`- **Questions while sketching:** ${asked.length} from ${s.partner.model}${s.partner.provider === "openrouter" ? " via OpenRouter" : " on their machine"}, marked _asked_ below. It was told to ask about their picture, never to explain the code; what they said next is their answer.`);
  lines.push("");
  if (s.feedback) lines.push(`## Their note when sending`, "", `> ${s.feedback.replace(/\n/g, "\n> ")}`, "");
  lines.push(`## What they said and drew, in order`, "", `Each picture is the canvas when a thought ended; the text is what they said or typed since the one before. _changed:_ lines are edits to the picture (renamed, rerouted, erased, moved, restyled): their changes of mind.`, "");
  const kfs = s.keyframes || [];
  // what the pointer rested on since the picture before: "this one" said with the pointer on a box
  const named = new Map(); for (const ev of s.events || []) { if (ev.in && ev.text) named.set(ev.in, ev.text); else if (ev.text || ev.name) named.set(ev.id, ev.text || ev.name); }
  for (const e of els) if (e.label || e.text || e.name) named.set(e.id, e.label || e.text || e.name);
  const pointing = (from, to) => {
    const ids = []; for (const p of s.pointer || []) if (p.t1 > from && p.t0 <= to && ids[ids.length - 1] !== p.id && named.has(p.id)) ids.push(p.id);
    const q = (id) => `"${String(named.get(id)).replace(/\s+/g, " ").trim()}"`;
    return !ids.length ? "" : ids.length >= 3 ? ` _(traced with the pointer: ${ids.map(q).join(" → ")})_` : ` _(pointing at ${ids.map(q).join(", ")})_`;
  };
  const timeline = [...kfs.map((k, i) => ({ t: k.t, line: `- **${mmss(k.t)}** ${k.said ? k.said : "_(drawing, nothing said)_"}${pointing(i ? kfs[i - 1].t : -Infinity, k.t)}${k.file ? ` → [picture](${k.file})` : ""}` })),
    ...asked.map((q) => ({ t: q.t, line: `- **${mmss(q.t)}** _asked:_ ${q.text}` })),
    ...sceneChanges(s).map((c) => ({ t: c.t, line: `- **${mmss(c.t)}** _changed:_ ${c.text}` })),
    ...(s.pauses || []).filter((p) => p.seconds >= 2).map((p) => ({ t: p.t, line: `- **${mmss(p.t)}** _paused for ${Math.round(p.seconds)} s_ (they stopped the recording here; the clock stood still)` }))];
  // what was said after the last picture (a transcript made afterwards has no keyframe at each sentence's end)
  const lastT = kfs.length ? kfs[kfs.length - 1].t : -Infinity;
  const after = (s.transcript?.segments || []).filter((x) => (x.t0 + x.t1) / 2 > lastT);
  if (after.length) timeline.push({ t: after[0].t0, line: `- **${mmss(after[0].t0)}** ${after.map((x) => x.text).join(" ")} _(said after the last picture)_` });
  for (const x of timeline.sort((a, b) => a.t - b.t)) lines.push(x.line);
  if (!kfs.length && !after.length) lines.push("_(no pictures: nothing was drawn or said while recording)_");
  lines.push("", `## The final drawing`, "", s.final?.png ? `![final drawing](final.png)` : "_(empty canvas)_", "");
  lines.push(...describeScene(els));
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

/** Words in order → sentences: a break after . ? ! or at a pause of a second or more. (`words`: each one's words) */
function segmentsOf(words) {
  const out = []; let cur = null;
  for (const w of words) {
    const text = String(w.text || "").trim(); if (!text) continue;
    if (cur && w.start - cur.t1 >= 1) { out.push(cur); cur = null; }
    if (!cur) cur = { t0: +w.start.toFixed(2), t1: +w.end.toFixed(2), text, confidence: null, words: [w] };
    else { cur.text += " " + text; cur.t1 = +w.end.toFixed(2); cur.words.push(w); }
    if (/[.?!]["')\]]?$/.test(text)) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * The stretches of the voice track with nothing in it (a second or more under -45 dB): whisper is known to make up
 * words there ("I'm going to go ahead and do that", over and over, while someone draws in silence).
 */
function silences(wav) {
  // silencedetect reports on stderr, and ffmpeg exits 0
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", wav, "-af", "silencedetect=noise=-45dB:d=1", "-f", "null", "-"], { encoding: "utf8", timeout: 120000 });
  return String(r.stderr || "");
}
function silenceSpans(log) {
  const spans = []; let start = null;
  for (const m of String(log).matchAll(/silence_(start|end): (-?[\d.]+)/g)) {
    if (m[1] === "start") start = Math.max(0, Number(m[2])); else if (start != null) { spans.push([start, Number(m[2])]); start = null; }
  }
  if (start != null) spans.push([start, Infinity]);
  return spans;
}
// how much of [t0, t1] lies in silence, 0..1 (a made-up sentence lies wholly in it; a real one's last word is often
// stretched into the pause after it, so words are not judged one by one)
const silentShare = (t0, t1, spans) => t1 <= t0 ? 1 : spans.reduce((n, [a, b]) => n + Math.max(0, Math.min(t1, b) - Math.max(t0, a)), 0) / (t1 - t0);

/**
 * Each keyframe's `said` again: whole sentences, never split, each with the first picture taken after its middle
 * (whisper.cpp stretches a sentence's end to where the next begins, so its middle is the steadier mark; a picture
 * taken while it was being said is the drawing it was about), and the typed notes at their time.
 */
const mid = (x) => (x.t0 + x.t1) / 2;
function resaid(s, segments) {
  const items = [...segments.map((x) => ({ t: mid(x), text: x.text })),
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
    const spans = silenceSpans(silences(wav)), heard = words.length;
    const kept = segmentsOf(words).filter((x) => silentShare(x.t0, x.t1, spans) < 0.8);
    words = kept.flatMap((x) => x.words);
    const segments = kept.map(({ words: _, ...x }) => x), was = s.transcript?.source;
    s.transcript = { source: by.kind, ...(by.kind === "api" ? { api: by.api.name, model: by.api.model } : { model: by.model }), lang,
      made: new Date().toISOString(), ...(was && was !== "none" && was !== by.kind ? { replaced: was } : {}),
      ...(heard > words.length ? { dropped_in_silence: heard - words.length } : {}), segments };
    resaid(s, segments);
    writeFileSync(sPath, JSON.stringify(s, null, 2) + "\n");
    writeFileSync(join(dir, "sketch.md"), sketchMd(s, dir));
    return { words, segments, by };
  } finally { rmSync(td, { recursive: true, force: true }); }
}

/** How a line names a transcriber: "local whisper small.en", "groq whisper-large-v3-turbo". */
export const transcriberName = (by) => by.kind === "whisper" ? `local whisper ${by.model}` : by.kind === "api" ? `${by.api.name} ${by.api.model}` : "nothing";
