// Which narration lines a rebuild has to voice again, and which it can keep (M3 revise loop, step 1).
//
// A line's voice and its word timings depend on four things only: its text, the voice, the speed and
// the model (the TTS model, and the whisper model its word timings come from). Put together they are
// the line's key. A line whose key is unchanged since the last build keeps its wav and its words
// byte for byte; only a new or edited line goes to the TTS and the transcriber.
//
// Where the kept lines live: in the project itself. Its `assets/voice/NN.wav` and the words in
// `audio_meta.json` are committed already, so the only thing missing was a record of what each file
// was made from. That record is `.hyperframes/narration.json` (committed, a few KB):
//
//   { "version": 1, "voice": "am_michael", "speed": 1.25, "model": "kokoro-v1.0 + whisper small.en",
//     "lines": { "01": { "key": "…", "text": "…", "sha256": "<of assets/voice/01.wav>", "duration_s": 8.469 } } }
//
// A gitignored cache would be empty on every fresh clone, which is exactly when a system video gets
// rebuilt (a cloud session starts from one). The sha256 guards the other way: a wav rewritten by
// anything but `narrate` (a hand-run audio.mjs, a crash half way through) no longer matches its
// entry, so that line is voiced again rather than reused under a key it no longer belongs to.
//
// A project whose voice is committed as mp3 (the worked examples under videos/: no .wav is committed, D-305)
// keeps its lines from the file audio_meta.json points at, `assets/voice/NN.mp3`, as it would from the wav;
// narrate then writes each newly voiced line as mp3 too (48 kbps mono), so the project stays playable from a
// clone. A line's file is the one the page plays: the mp3 audio_meta.json names, else NN.wav.
//
// A project narrated before the record existed has no narration.json. Its lines are adopted from git
// when the voice files and audio_meta.json are exactly as committed: the SCRIPT.md committed in that
// same commit is what they were made from. `narrate --adopt` does the same from the working SCRIPT.md,
// for a project outside git whose voice is known to match its script.
//
// A run killed part way (a container restart, a timeout) is picked up where it stopped. The record
// above is written only when a run finishes, so while one runs it keeps its progress next to it, in
// `.hyperframes/narration-progress/` (ignored by git through its own .gitignore, removed when the run
// finishes): a copy of every wav it has in hand, kept or just voiced, named by the line's key, and
// `progress.json`, rewritten atomically as each line's wav and word timings come back:
//
//   { "version": 1, "voice": …, "speed": …, "model": …, "engine": null | { tts_provider, voice_id, bgm… },
//     "lines": { "<key>": { "text": "…", "path": ".hyperframes/narration-progress/<key>.wav", "sha256": "…",
//                           "duration_s": 8.469, "words": [{ id, text, start, end }] } } }
//
// The next run keeps those lines like recorded ones (a copy whose sha256 no longer matches is not
// kept). A line whose wav was written but whose word timings never came back has no entry, so it is
// voiced again. The copies are what make a kept line survive a kill: a new line may already have
// overwritten its old assets/voice file (a line inserted at the top renumbers every one after it).
import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { pkgDir } from "./env.mjs";
import { say } from "./say.mjs";

export const RECORD = join(".hyperframes", "narration.json");
export const recordPath = (dir) => join(dir, RECORD);
export const PROGRESS = join(".hyperframes", "narration-progress");
export const progressDir = (dir) => join(dir, PROGRESS);
export const progressPath = (dir) => join(dir, PROGRESS, "progress.json");
export const pad2 = (n) => String(n).padStart(2, "0");
// Measured on this repo's system video (Kokoro, whisper small.en, one line at a time, --speed 1.25, 4
// cores): all 35 lines in 675 s, one edited line in 32 s. So about 19 s a line plus 13 s to start.
// Used only for the estimates the cost lines print before anything runs.
export const SECONDS_PER_LINE = 19;
export const STARTUP_SECONDS = 13;
// A hosted voice with hosted word timings (scripts/lib/narrator.mjs's model names: no local Kokoro, no local
// whisper) waits on the network, several lines at once: a guess of a few seconds a line, not yet measured.
const hostedModel = (model = "") => !/^(kokoro|fake |heygen)/.test(model) && !/\+ whisper /.test(model);
export const estimateSeconds = (n, model) => !n ? 0 : hostedModel(model) ? 3 + n * 3 : STARTUP_SECONDS + n * SECONDS_PER_LINE;

// SCRIPT.md → [{ frame, text }], exactly as faceless-explainer's audio.mjs reads it (parseScript there):
// `## … (Frame N)` opens a line, `**key:**` rows are metadata, the indented block is the spoken text.
// The text must match to the character, since it is what the key is made of and what the TTS says.
export function parseScript(md) {
  const out = [];
  let cur = null;
  const flush = () => { if (cur && cur.text.trim()) out.push({ frame: cur.frame, text: cur.text.trim() }); cur = null; };
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^#{2,3}\s+.*?\(frame\s+(\d+)\)/i);
    if (h) { flush(); cur = { frame: Number(h[1]), text: "" }; continue; }
    if (!cur) continue;
    if (/^\s*\*\*/.test(line)) continue;
    const m = line.match(/^(?: {4,}|\t)(.+)$/);
    if (m) cur.text += (cur.text ? " " : "") + m[1].trim();
  }
  flush();
  return out;
}

/** The filtered SCRIPT.md handed to audio.mjs: only these lines, each as the voice says it (`said`, else its text), in a form parseScript reads back identically. */
export const scriptFor = (lines) => lines.map((l) => `## Line ${l.frame} (Frame ${l.frame})\n\n    ${l.said ?? l.text}\n`).join("\n");

export const lineKey = ({ text, voice, speed, model }) =>
  createHash("sha256").update(JSON.stringify({ text, voice, speed: Number(speed), model })).digest("hex").slice(0, 20);

// A line's key is made of what the voice is handed: its text as said (lib/say.mjs: `claude -p` is said
// "claude dash p"). A line with nothing written that way is said as it is, so its key is what it always
// was. A line that was voiced as written, before narrate said it (a file name like `site.json` handed to
// the TTS as it stood), is still kept under that old key (`keyAsWritten`), so its audio is not made again.
const keysOf = (text, opts) => {
  const said = say(text), key = lineKey({ ...opts, text: said });
  return { said, key, asWritten: said === text ? null : lineKey({ ...opts, text }) };
};

export const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

/** The voice file a line plays from, relative to the project: the mp3 audio_meta.json names for it (a project
 *  committed as mp3, D-305), else assets/voice/NN.wav; null when it is not on disk. */
export function voiceFileOf(dir, id, v) {
  const named = typeof v?.path === "string" ? v.path : "";
  if (/^assets\/voice\/[^/]+\.mp3$/.test(named) && existsSync(join(dir, named))) return named;
  const wav = `assets/voice/${id}.wav`;
  return existsSync(join(dir, wav)) ? wav : null;
}

/** Whether a project plays its narration as mp3 (its audio_meta.json points at .mp3 files): narrate keeps it so. */
export const playsMp3 = (dir) => (readJson(join(dir, "audio_meta.json"))?.voices || []).some((v) => /\.mp3$/.test(v.path || ""));

/** Write a file whole or not at all: a kill mid-write leaves the old file, never half a new one. */
export function writeAtomic(file, text) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}

/**
 * What the key calls the model. The TTS model and the transcriber both change the output, so both are
 * named: `kokoro-v1.0 + whisper small.en`. Kokoro's model file is read off the pinned HyperFrames CLI
 * (`hyperframes tts` downloads it by that name), so a HyperFrames upgrade that keeps kokoro-v1.0 keeps
 * every line, and one that moves to a new model re-voices them all.
 */
export function modelId(provider, { hyperframesCli } = {}) {
  if (process.env.REELPLANNING_TTS_MODEL) return process.env.REELPLANNING_TTS_MODEL;
  if (provider === "heygen") return "heygen starfish";           // word timings come with the audio: no whisper
  const whisper = " + whisper small.en";                          // what the engine's transcribeWav runs for English
  if (provider === "elevenlabs") return `elevenlabs eleven_multilingual_v2${whisper}`;
  let tts = "kokoro";
  try {
    const src = hyperframesCli && existsSync(hyperframesCli) ? readFileSync(hyperframesCli, "utf8") : "";
    const m = src.match(/DEFAULT_MODEL\d*\s*=\s*"(kokoro-[^"]+)"/);
    if (m) tts = m[1];
  } catch { /* the plain provider name still keys the lines; only an upgrade is missed */ }
  return `${tts}${whisper}`;
}

const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

/**
 * A project narrated before narration.json existed: its lines as of the commit that last wrote its
 * narration, provided the voice files and audio_meta.json are still exactly that commit's. Returns
 * { rev, lines } or null.
 */
export function gitNarratedLines(dir) {
  try {
    const top = git(dir, "rev-parse", "--show-toplevel").trim();
    const rel = relative(top, dir) || ".";
    const rev = git(top, "log", "-1", "--format=%H", "--", join(rel, "audio_meta.json")).trim();
    if (!rev) return null;
    // the files on disk must be the ones that commit made, not a later hand edit: audio_meta.json and the voice
    // files it plays (only those: a clone holds no .wav beside a project committed as mp3, D-305)
    const played = (readJson(join(dir, "audio_meta.json"))?.voices || []).map((v) => v.path).filter((p) => typeof p === "string" && p.startsWith("assets/voice/"));
    const paths = [join(rel, "audio_meta.json"), ...(played.length ? played.map((p) => join(rel, p)) : [join(rel, "assets", "voice")])];
    if (git(top, "status", "--porcelain", "--", ...paths).trim()) return null;
    if (git(top, "diff", "--name-only", rev, "--", ...paths).trim()) return null;
    const script = git(top, "show", `${rev}:${join(rel, "SCRIPT.md")}`);
    return { rev, lines: parseScript(script) };
  } catch { return null; }
}

/**
 * The kept lines available to this build, by key: { key → { frame, path, sha256, duration_s, words, text } }.
 * `voice`, `speed`, `model` are what this build asks for; an entry made with anything else never matches.
 */
export function keptLines(dir, { voice, speed, model, adopt = false } = {}) {
  const meta = readJson(join(dir, "audio_meta.json")) || {};
  const voiceOf = Object.fromEntries((meta.voices || []).map((v) => [pad2(v.frame), v]));
  const kept = new Map();
  const take = (id, key, text, sha) => {
    const v = voiceOf[id], file = v && voiceFileOf(dir, id, v);
    if (!file) return false;
    const abs = join(dir, file);
    if (sha && sha256(abs) !== sha) return false;
    if (!kept.has(key)) kept.set(key, { frame: Number(id), path: file, sha256: sha || sha256(abs), duration_s: v.duration_s, words: v.words || [], text });
    return true;
  };
  const record = readJson(recordPath(dir));
  let source = "none", note = "";
  if (record?.lines) {
    source = "record";
    for (const [id, e] of Object.entries(record.lines)) take(id, e.key, e.text, e.sha256);
  } else if (adopt) {
    source = "adopt";
    for (const l of parseScript(existsSync(join(dir, "SCRIPT.md")) ? readFileSync(join(dir, "SCRIPT.md"), "utf8") : "")) take(pad2(l.frame), keysOf(l.text, { voice, speed, model }).key, l.text);
  } else if (Object.keys(voiceOf).length) {
    const g = gitNarratedLines(dir);
    if (g) {
      source = "git";
      note = g.rev.slice(0, 7);
      // the voice those files were made with is on record in the engine sidecar; the speed is not, so
      // the speed asked for now is assumed (reelplanning has synthesised at 1.25 since patch-tts-speed)
      const eng = readJson(join(dir, "audio_engine_meta.json"));
      const madeWith = eng?.voice_id || voice;
      // (whether they were voiced as written or as said is not on record: both keys lead to them)
      for (const l of g.lines) { const k = keysOf(l.text, { voice: madeWith, speed, model }); for (const key of [k.key, k.asWritten].filter(Boolean)) take(pad2(l.frame), key, l.text); }
    }
  }
  // what a run that did not finish had in hand (see the top of this file)
  let resumed = 0;
  for (const [key, e] of Object.entries(readJson(progressPath(dir))?.lines || {})) {
    if (kept.has(key) || !e?.path || !e.sha256 || !Array.isArray(e.words)) continue;
    const wav = join(dir, e.path);
    if (!existsSync(wav) || sha256(wav) !== e.sha256) continue;
    kept.set(key, { frame: null, path: e.path, sha256: e.sha256, duration_s: e.duration_s, words: e.words, text: e.text, resumed: true });
    resumed++;
  }
  if (source === "none" && resumed) source = "progress";
  return { kept, source, note };
}

/**
 * The plan for one build: every SCRIPT.md line, whether it is kept (and from which file) or narrated.
 * { lines: [{ frame, id, text, said, key, keep|null }], narrate, keep, resumed (kept from an unfinished run), source, estimate_s }
 * (`said` is what the voice is handed; `key` the one the line is kept under: its said key, or its
 * as-written key when that is the one on record)
 */
export function planNarration(dir, { voice, speed, model, adopt = false } = {}) {
  const scriptPath = join(dir, "SCRIPT.md");
  const script = existsSync(scriptPath) ? parseScript(readFileSync(scriptPath, "utf8")) : [];
  const { kept, source, note } = keptLines(dir, { voice, speed, model, adopt });
  const lines = script.map((l) => {
    const { said, key, asWritten } = keysOf(l.text, { voice, speed, model });
    const hit = kept.has(key) ? key : asWritten && kept.has(asWritten) ? asWritten : null;
    return { frame: l.frame, id: pad2(l.frame), text: l.text, said, key: hit || key, keep: hit ? kept.get(hit) : null };
  });
  const narrate = lines.filter((l) => !l.keep), keep = lines.filter((l) => l.keep);
  const resumed = keep.filter((l) => l.keep.resumed).length;
  return { lines, narrate, keep, resumed, source, note, estimate_s: estimateSeconds(narrate.length, model) };
}

/**
 * For the cost lines in `reel status` and `spec-diff`, before anything runs: with the voice, speed and
 * model the project was last narrated with, which lines are already edited and not yet voiced, plus the
 * lines of `frames` (the frames an update will rewrite). Seconds are of speech, from audio_meta.json.
 * Returns null for a project with no narration.
 */
export function narrationCost(dir, frames = []) {
  if (!existsSync(join(dir, "SCRIPT.md"))) return null;
  // an unfinished first run has no record yet, but its progress says what it was made with
  const record = readJson(recordPath(dir)) || readJson(progressPath(dir)), eng = readJson(join(dir, "audio_engine_meta.json")) || {};
  const meta = readJson(join(dir, "audio_meta.json")) || {};
  const voice = record?.voice || eng.voice_id || "am_michael", speed = record?.speed ?? 1.25;
  const model = record?.model || modelId(eng.tts_provider || "kokoro", { hyperframesCli: hyperframesCliPath() });
  const p = planNarration(dir, { voice, speed, model });
  const want = new Set(frames.map(Number));
  const lines = p.lines.filter((l) => !l.keep || want.has(l.frame));
  const dur = Object.fromEntries((meta.voices || []).map((v) => [v.frame, v.duration_s || 0]));
  const speech = lines.reduce((n, l) => n + (dur[l.frame] || 0), 0);
  return {
    total: p.lines.length, lines: lines.map((l) => l.frame), edited: p.narrate.map((l) => l.frame),
    speech_s: Math.round(speech), estimate_s: estimateSeconds(lines.length, model), source: p.source,
  };
}

/** The cost in a phrase: "2 of 35 lines to narrate (about 19 s of speech, ~37 s to make); the other 33 are kept". */
export function costSentence(c) {
  if (!c) return "";
  const n = c.lines.length;
  if (!n) return `no line to narrate (all ${c.total} are kept)`;
  return `${n} of ${c.total} line${c.total === 1 ? "" : "s"} to narrate (${c.speech_s ? `about ${c.speech_s} s of speech, ` : ""}~${c.estimate_s} s to make)${n < c.total ? `; the other ${c.total - n} are kept` : ""}`
    + (c.source === "none" ? " — no narration record yet, so every line counts" : "");
}

// the pinned HyperFrames CLI's bundled source, for modelId; null when it cannot be found
export function hyperframesCliPath() {
  const d = pkgDir("hyperframes");
  return d && existsSync(join(d, "dist", "cli.js")) ? join(d, "dist", "cli.js") : null;
}
