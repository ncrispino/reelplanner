// Hosted narration, over plain HTTP (Node's fetch; no SDK, no pip package): one line's speech and its word
// timings, for scripts/lib/narrate-engine.mjs. The settings come from scripts/lib/narrator.mjs.
//
//   openai, openai-compatible   POST {base}/audio/speech  { model, input, voice, response_format: "wav", speed?, instructions? }
//                               → wav bytes; no timings (a transcriber, below, or local whisper gives them)
//   openrouter                  POST {base}/audio/speech  { model, input, voice, response_format: "mp3", speed? } → mp3 (or raw
//                               24 kHz 16-bit mono PCM, audio/pcm), made a wav by ffmpeg; no timings (its transcriber gives them)
//   deepinfra                   POST {base}/inference/{model}  { text, preset_voice: [voice], speed, output_format: "wav",
//                               return_timestamps: true } → { audio: base64 or a data URL, words: [{ text, start, end }] }
//   elevenlabs                  POST {base}/text-to-speech/{voice}/with-timestamps?output_format=pcm_24000
//                               { text, model_id, voice_settings: { speed } } (xi-api-key)
//                               → { audio_base64: raw 24 kHz 16-bit mono PCM, alignment: { characters, character_start_times_seconds, … } }
//   transcriber (groq, openai,  POST {base}/audio/transcriptions, multipart: file, model, response_format=verbose_json,
//    openrouter)                timestamp_granularities[]=word, language → { words: [{ word, start, end }] }
//
// Every call is retried on 429, 5xx and a dropped connection, with backoff (Retry-After when the API sends one);
// a refused key (401/403) stops the run, saying which variable holds it. Keys go in headers only, never in a
// message: an error quotes the status and the start of the API's own answer.
//
// Word timings are always mapped onto the line's own words (alignWords): a transcriber writes "its" where the
// line says "it's.", and the captions want the line's words, punctuation and all, as local whisper gives them.

import { spawnSync } from "node:child_process";

export class FatalApiError extends Error {}
// an error that carries the API's HTTP status (`status`), when there was one
const httpError = (Cls, msg, status) => Object.assign(new Cls(msg), status ? { status } : {});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (x) => Math.round(x * 1000) / 1000;

/** fetch with retries: 429, 5xx, a network error or a timeout are tried again `retries` times, waiting retryMs·2ⁿ (or Retry-After, up to 30 s). */
export async function fetchRetry(url, init, { label, keyEnv, retries = 4, retryMs = 1000, timeoutMs = 180000, onRetry = () => {} } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res, why;
    try {
      res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (res.ok) return res;
      const body = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 300);
      if (res.status === 401 || res.status === 403)
        throw httpError(FatalApiError, `${label} refused the key${keyEnv ? ` in ${keyEnv}` : ""} (HTTP ${res.status}${body ? `: ${body}` : ""}) — check that it is right and has access to this model`, res.status);
      why = `HTTP ${res.status}${body ? `: ${body}` : ""}`;
      if (res.status !== 429 && res.status < 500) throw httpError(Error, `${label}: ${why}`, res.status);
    } catch (e) {
      if (e instanceof FatalApiError || (res && !res.ok && res.status !== 429 && res.status < 500)) throw e;
      why ||= e.name === "TimeoutError" ? `no answer in ${timeoutMs / 1000} s` : `${e.cause?.code || e.message}`;
    }
    if (attempt >= retries) throw httpError(Error, `${label}: ${why} (after ${attempt + 1} tries)`, res && !res.ok ? res.status : 0);
    const after = Number(res?.headers?.get("retry-after"));
    const wait = Number.isFinite(after) && after >= 0 ? Math.min(after * 1000, 30000) : retryMs * 2 ** attempt * (1 + Math.random() * 0.25);
    onRetry({ attempt: attempt + 1, why, wait });
    await sleep(wait);
  }
}

// ── wav ───────────────────────────────────────────────────────────────────────────────────────────
/** A RIFF/WAVE file → { sampleRate, channels, bits, data }, or null. A streamed wav (sizes 0xFFFFFFFF or 0) takes the rest of the file as its data. */
export function parseWav(buf) {
  if (buf.length < 12 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") return null;
  let off = 12, fmt = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    let size = buf.readUInt32LE(off + 4);
    if (id === "fmt ") fmt = { format: buf.readUInt16LE(off + 8), channels: buf.readUInt16LE(off + 10), sampleRate: buf.readUInt32LE(off + 12), bits: buf.readUInt16LE(off + 22) };
    if (id === "data") {
      if (!fmt) return null;
      if (size === 0 || size === 0xffffffff || off + 8 + size > buf.length) size = buf.length - off - 8;
      const bytes = fmt.bits / 8 * fmt.channels;
      size -= size % bytes;
      return { ...fmt, data: buf.subarray(off + 8, off + 8 + size) };
    }
    off += 8 + size + (size % 2);
  }
  return null;
}

/** Raw little-endian PCM → a wav file's bytes. */
export function pcmToWav(pcm, { sampleRate = 24000, channels = 1, bits = 16 } = {}) {
  const h = Buffer.alloc(44), block = channels * bits / 8;
  h.write("RIFF", 0, "ascii"); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8, "ascii");
  h.write("fmt ", 12, "ascii"); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(sampleRate, 24); h.writeUInt32LE(sampleRate * block, 28); h.writeUInt16LE(block, 32); h.writeUInt16LE(bits, 34);
  h.write("data", 36, "ascii"); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

/** A wav as the API sent it → a clean one (exact sizes in its header) and its length in seconds; null when it is not a PCM wav. */
export function cleanWav(buf) {
  const w = parseWav(buf);
  if (!w || w.format !== 1 || !w.sampleRate || !w.channels || !w.bits) return null;
  return { wav: pcmToWav(w.data, w), duration_s: r3(w.data.length / (w.sampleRate * w.channels * w.bits / 8)) };
}

/** Any audio → a clean wav: as it is when it is a PCM wav, else through ffmpeg (24 kHz mono 16-bit, `converted` set); null when neither works. */
export function toWav(buf) {
  const got = cleanWav(buf);
  if (got) return got;
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", "pipe:0", "-f", "wav", "-ar", "24000", "-ac", "1", "-acodec", "pcm_s16le", "pipe:1"], { input: buf, maxBuffer: 512 * 1024 * 1024 });
  const conv = r.status === 0 && r.stdout?.length ? cleanWav(r.stdout) : null;
  return conv && { ...conv, converted: true };
}

const fromBase64 = (s) => Buffer.from(String(s).replace(/^data:[^,]*,/, ""), "base64");

// ── the line's own words ──────────────────────────────────────────────────────────────────────────
const norm = (t) => String(t).toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "");

/**
 * Timed words from an API ([{ text, start, end }], its own spelling) → the line's words (`text` split on spaces)
 * with times. Matching words (lower case, letters and digits only) take the API's times (a longest common
 * subsequence); a run of the line's words with no match shares the time between its neighbours, by length.
 * Returns [] when the API gave no timed word.
 */
export function alignWords(text, timed, duration_s = null) {
  const toks = String(text).split(/\s+/).filter(Boolean);
  const api = (timed || []).filter((w) => w && Number.isFinite(+w.start) && Number.isFinite(+w.end) && norm(w.text)).map((w) => ({ n: norm(w.text), start: +w.start, end: Math.max(+w.start, +w.end) }));
  if (!toks.length || !api.length) return [];
  const a = toks.map(norm), n = a.length, m = api.length;
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] && a[i] === api[j].n ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const match = new Array(n).fill(-1);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] && a[i] === api[j].n) { match[i] = j; i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  const out = toks.map((t, i) => (match[i] >= 0 ? { text: t, start: api[match[i]].start, end: api[match[i]].end } : null));
  const lastEnd = Math.max(...api.map((w) => w.end), duration_s ?? 0);
  for (let i = 0; i < n;) {
    if (out[i]) { i++; continue; }
    let k = i; while (k < n && !out[k]) k++;
    // the API words between the neighbours' matches, if any, say where this run was said
    const jPrev = i > 0 ? match[i - 1] : -1, jNext = k < n ? match[k] : m;
    const between = api.slice(jPrev + 1, jNext);
    let from = between.length ? between[0].start : i > 0 ? out[i - 1].end : 0;
    let to = between.length ? between[between.length - 1].end : k < n ? out[k].start : lastEnd;
    if (i > 0) from = Math.max(from, out[i - 1].end);
    if (k < n) to = Math.min(to, out[k].start);
    if (to < from) to = from;
    const lens = toks.slice(i, k).map((t) => Math.max(1, norm(t).length)), total = lens.reduce((x, y) => x + y, 0);
    let t = from;
    for (let q = i; q < k; q++) { const d = (to - from) * lens[q - i] / total; out[q] = { text: toks[q], start: t, end: t + d }; t += d; }
    i = k;
  }
  return out.map((w) => ({ text: w.text, start: r3(w.start), end: r3(w.end) }));
}

/** ElevenLabs' character alignment → words (split where the text has white space). */
export function wordsFromCharacters(al) {
  const chars = al?.characters || [], st = al?.character_start_times_seconds || [], en = al?.character_end_times_seconds || [];
  const words = [];
  let cur = null;
  chars.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) words.push(cur); cur = null; return; }
    if (!cur) cur = { text: "", start: +st[i], end: +en[i] };
    cur.text += c; cur.end = +en[i];
  });
  if (cur) words.push(cur);
  return words;
}

// ── one line's speech ────────────────────────────────────────────────────────────────────────────
/**
 * Voice `text` with the hosted provider in `s` (narrator.mjs's settings). → { wav, duration_s, words|null, sent, note? }
 * `words` (the provider's own timings) only from deepinfra and elevenlabs; null means a transcriber is needed.
 * `sent` says what audio the API answered with, e.g. "audio/wav", "audio/mpeg, made a wav by ffmpeg".
 */
export async function synthesize(s, { text, voice, speed }, opts = {}) {
  const key = process.env[s.keyEnv];
  const http = { ...opts, keyEnv: s.keyEnv, retries: s.retries, retryMs: s.retryMs };
  if (s.tts === "openai" || s.tts === "openai-compatible") {
    const body = { model: s.model, input: text, voice, response_format: "wav" };
    if (speed && speed !== 1) body.speed = speed;
    let instructions = s.instructions;
    // gpt-4o-mini-tts is reported to ignore `speed`: ask for the pace in words as well (instructions, its own knob)
    if (/gpt-4o.*tts/.test(s.model) && speed && speed > 1.05 && !instructions) instructions = `Speak briskly, at about ${speed} times your usual pace.`;
    if (instructions && /gpt-4o.*tts/.test(s.model)) body.instructions = instructions;
    const res = await fetchRetry(`${s.base}/audio/speech`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) }, { ...http, label: `${s.tts} /audio/speech` });
    const type = (res.headers.get("content-type") || "audio of no stated type").split(";")[0];
    const got = toWav(Buffer.from(await res.arrayBuffer()));
    if (!got) throw new Error(`${s.tts} /audio/speech answered with audio neither read as a wav nor converted by ffmpeg (${type}; asked for response_format "wav")`);
    return { ...got, words: null, sent: got.converted ? `${type}, made a wav by ffmpeg` : type };
  }
  if (s.tts === "openrouter") {
    // OpenRouter's speech answers mp3 or raw PCM, no wav: mp3, which ffmpeg reads whatever its rate
    const body = { model: s.model, input: text, voice, response_format: "mp3" };
    // its ElevenLabs models refuse a speed outside 0.7–1.2 (as ElevenLabs' own API: 1.25 is said at 1.2)
    if (speed && speed !== 1) body.speed = /^elevenlabs\//.test(s.model) ? Math.min(1.2, Math.max(0.7, speed)) : speed;
    const res = await fetchRetry(`${s.base}/audio/speech`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) }, { ...http, label: `openrouter ${s.model} /audio/speech` });
    const type = (res.headers.get("content-type") || "audio of no stated type").split(";")[0];
    const buf = Buffer.from(await res.arrayBuffer());
    const got = type === "audio/pcm" ? cleanWav(pcmToWav(buf, { sampleRate: 24000 })) : toWav(buf);
    if (!got) throw new Error(`openrouter ${s.model} /audio/speech answered with audio ffmpeg could not read (${type}, ${buf.length} bytes)`);
    return { ...got, words: null, sent: type === "audio/pcm" ? "audio/pcm (24 kHz), made a wav" : got.converted ? `${type}, made a wav by ffmpeg` : type };
  }
  if (s.tts === "deepinfra") {
    const body = { text, preset_voice: [voice], output_format: "wav", return_timestamps: true };
    if (speed && speed !== 1) body.speed = speed;
    const res = await fetchRetry(`${s.base}/inference/${s.model}`, { method: "POST", headers: { Authorization: `bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) }, { ...http, label: `deepinfra ${s.model}` });
    const j = await res.json();
    const got = j?.audio && toWav(fromBase64(j.audio));
    if (!got) throw new Error(`deepinfra ${s.model} answered with no wav audio${j?.inference_status?.status ? ` (status ${j.inference_status.status})` : ""}`);
    const words = Array.isArray(j.words) ? j.words.map((w) => ({ text: w.text ?? w.word, start: w.start, end: w.end })) : [];
    return { ...got, words, sent: `base64 ${got.converted ? "audio, made a wav by ffmpeg" : "wav"} in JSON` };
  }
  if (s.tts === "elevenlabs") {
    // ElevenLabs takes a speed from 0.7 to 1.2
    const sp = Math.min(1.2, Math.max(0.7, Number(speed) || 1));
    const body = { text, model_id: s.model, ...(sp !== 1 ? { voice_settings: { speed: sp } } : {}) };
    const res = await fetchRetry(`${s.base}/text-to-speech/${encodeURIComponent(voice)}/with-timestamps?output_format=pcm_24000`, { method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify(body) }, { ...http, label: "elevenlabs with-timestamps" });
    const j = await res.json();
    if (!j?.audio_base64) throw new Error("elevenlabs with-timestamps answered with no audio_base64");
    const wav = pcmToWav(fromBase64(j.audio_base64), { sampleRate: 24000 });
    return { ...cleanWav(wav), words: wordsFromCharacters(j.alignment || j.normalized_alignment), sent: "base64 pcm_24000 in JSON", note: sp !== Number(speed) ? `elevenlabs speaks at ${sp}× at most (asked ${speed}×)` : null };
  }
  throw new Error(`no hosted TTS called "${s.tts}"`);
}

/** Word timings for a wav from a transcription API (verbose_json, word granularity). → [{ text, start, end }] */
export async function transcribe(t, wav, { lang = "en", ...opts } = {}) {
  const form = new FormData();
  form.append("file", new Blob([wav], { type: "audio/wav" }), "line.wav");
  form.append("model", t.model);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  if (lang) form.append("language", lang);
  const res = await fetchRetry(`${t.base}/audio/transcriptions`, { method: "POST", headers: { Authorization: `Bearer ${process.env[t.keyEnv]}` }, body: form },
    { ...opts, keyEnv: t.keyEnv, label: `${t.name} ${t.model} /audio/transcriptions` });
  const j = await res.json();
  if (!Array.isArray(j?.words)) throw new Error(`${t.name} ${t.model} returned no word timestamps (does this model support timestamp_granularities[]=word?)`);
  return j.words.map((w) => ({ text: w.word ?? w.text, start: w.start, end: w.end }));
}
