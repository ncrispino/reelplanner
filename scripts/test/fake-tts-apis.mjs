// The fake hosted narration APIs the narration specs talk to (narrate-api.spec.mjs, narration-check.spec.mjs): one
// HTTP server in the spec's process that answers as each API does, so no real key and no network.
//
// Each "voiced" wav is silence whose length is 0.3 s a word, with the start of its text written into its first
// bytes, and the server remembers which text each wav was, so the transcriber answers as whisper-1 does: lower
// case, no punctuation, "it's" as "its". OpenRouter's speech answers mp3 (as it is asked), which loses those
// bytes: its transcriber then takes the text said last (narrate it one line at a time).
//
//   /openai/v1/audio/speech, /own/v1/audio/speech (MY_TTS_KEY)     OpenAI's speech: a streamed wav
//   /deepinfra/v1/inference/hexgrad/Kokoro-82M                       DeepInfra's inference API, with word timings
//   /elevenlabs/v1/text-to-speech/{voice}/with-timestamps           raw PCM and character alignment
//   /openrouter/api/v1/audio/speech                                  mp3 (or raw PCM for response_format pcm); a
//                                                                    refused key's answer quotes the key, as some do
//   …/audio/transcriptions                                           under /groq (GROQ_API_KEY), /openrouter
//                                                                    (OPENROUTER_API_KEY), else OPENAI_API_KEY
//
// `fail.speech` / `fail.transcribe`: statuses to answer with first, one per request. Every request is in `log`.
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { parseWav, pcmToWav } from "../lib/tts-api.mjs";

export const KEYS = { OPENAI_API_KEY: "sk-test-openai-7f3a", GROQ_API_KEY: "gsk-test-groq-91c2", DEEPINFRA_API_KEY: "di-test-5521", ELEVENLABS_API_KEY: "el-test-0c8d", OPENROUTER_API_KEY: "sk-or-test-4e77", MY_TTS_KEY: "own-test-k3y" };
const RATE = 24000;
const pcmFor = (text) => { const n = text.split(/\s+/).length, b = Buffer.alloc(Math.round(n * 0.3 * RATE) * 2); b.write(text.slice(0, 64), 0, "latin1"); return b; };
const wordsFor = (text, spell = (t) => t) => text.split(/\s+/).map((t, i) => ({ text: spell(t), start: +(i * 0.3).toFixed(2), end: +(i * 0.3 + 0.25).toFixed(2) }));
const heard = (t) => t.toLowerCase().replace(/[^a-z0-9'-]/g, "").replace(/'/g, "");
const mp3 = (pcm) => spawnSync("ffmpeg", ["-v", "error", "-f", "s16le", "-ar", String(RATE), "-ac", "1", "-i", "pipe:0", "-f", "mp3", "pipe:1"], { input: pcm, maxBuffer: 64 * 1024 * 1024 }).stdout;

/** Start the fake APIs on 127.0.0.1:`port`. → { BASE, PORT, log, fail, maxInflight (a getter), delay and gather (settable), close() } */
export async function fakeTtsApis(port) {
  const st = { log: [], fail: { speech: [], transcribe: [] }, inflight: 0, maxInflight: 0, delay: 120, gather: 0 };
  // `gather` = n: hold each request until n are in flight at once, then let them all go; a batch smaller than n goes
  // after 3 s with no new arrival. So maxInflight is what the code sends at once, however loaded the machine is (a
  // fixed delay measured whether the machine let the requests overlap within it).
  let waiting = [], quiet = null;
  const gathered = () => new Promise((go) => {
    waiting.push(go);
    const release = () => { clearTimeout(quiet); quiet = null; const w = waiting; waiting = []; w.forEach((f) => f()); };
    if (st.inflight >= st.gather) return release();
    clearTimeout(quiet); quiet = setTimeout(release, 3000);
  });
  const said = new Map();
  let lastSaid = null;
  const server = createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks), url = new URL(req.url, "http://x");
    const entry = { method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers };
    st.log.push(entry);
    const send = (status, obj, headers = {}) => { res.writeHead(status, { "Content-Type": "application/json", ...headers }); res.end(typeof obj === "string" ? obj : JSON.stringify(obj)); };
    const kind = url.pathname.endsWith("/audio/transcriptions") ? "transcribe" : "speech";
    st.inflight++; st.maxInflight = Math.max(st.maxInflight, st.inflight);
    if (st.gather) await gathered(); else await new Promise((r) => setTimeout(r, st.delay));
    st.inflight--;
    const f = st.fail[kind].shift();
    if (f) return send(f, { error: { message: `fake ${f}` } }, f === 429 ? { "Retry-After": "0" } : {});
    if (kind === "transcribe") {
      const form = await new Response(body, { headers: { "content-type": req.headers["content-type"] } }).formData();
      const file = form.get("file"), wav = Buffer.from(await file.arrayBuffer());
      entry.form = { model: form.get("model"), response_format: form.get("response_format"), granularity: form.getAll("timestamp_granularities[]"), language: form.get("language"), file: file.name, riff: wav.toString("ascii", 0, 4) };
      const text = said.get(parseWav(wav)?.data.toString("latin1", 0, 64).replace(/\0+$/, "")) ?? (url.pathname.startsWith("/openrouter") ? lastSaid : undefined);
      const key = url.pathname.startsWith("/groq") ? KEYS.GROQ_API_KEY : url.pathname.startsWith("/openrouter") ? KEYS.OPENROUTER_API_KEY : KEYS.OPENAI_API_KEY;
      if (req.headers.authorization !== `Bearer ${key}`) return send(401, { error: "bad key" });
      return send(200, { task: "transcribe", text, words: text ? wordsFor(text, heard).map((w) => ({ word: w.text, start: w.start, end: w.end })) : [] });
    }
    const j = JSON.parse(body.toString() || "{}");
    entry.json = j;
    if (url.pathname === "/openai/v1/audio/speech" || url.pathname === "/own/v1/audio/speech") {
      const key = url.pathname.startsWith("/own") ? KEYS.MY_TTS_KEY : KEYS.OPENAI_API_KEY;
      if (req.headers.authorization !== `Bearer ${key}`) return send(401, { error: { message: "Incorrect API key provided" } });
      const pcm = pcmFor(j.input); said.set(j.input.slice(0, 64), j.input);
      const wav = pcmToWav(pcm, { sampleRate: RATE }); wav.writeUInt32LE(0xffffffff, 4); wav.writeUInt32LE(0xffffffff, 40);   // streamed, as OpenAI's is
      res.writeHead(200, { "Content-Type": "audio/wav" }); return res.end(wav);
    }
    if (url.pathname === "/openrouter/api/v1/audio/speech") {
      if (req.headers.authorization !== `Bearer ${KEYS.OPENROUTER_API_KEY}`) return send(401, { error: { message: `Invalid key: ${String(req.headers.authorization).replace(/^Bearer /, "")}`, code: 401 } });
      if (!["hexgrad/kokoro-82m", "openai/gpt-4o-mini-tts-2025-12-15"].includes(j.model)) return send(404, { error: { message: `Model ${j.model} not found`, code: 404 } });
      lastSaid = j.input;
      const pcm = pcmFor(j.input);
      if (j.response_format === "mp3") { res.writeHead(200, { "Content-Type": "audio/mpeg" }); return res.end(mp3(pcm)); }
      res.writeHead(200, { "Content-Type": "audio/pcm" }); return res.end(pcm);
    }
    if (url.pathname.startsWith("/deepinfra/v1/inference/")) {
      if (url.pathname !== "/deepinfra/v1/inference/hexgrad/Kokoro-82M") return send(404, { detail: { error: "Model is not available" } });
      if (req.headers.authorization !== `bearer ${KEYS.DEEPINFRA_API_KEY}`) return send(401, { detail: "unauthorized" });
      const wav = pcmToWav(pcmFor(j.text), { sampleRate: RATE });
      return send(200, { audio: `data:audio/wav;base64,${wav.toString("base64")}`, output_format: "wav", words: wordsFor(j.text, (t) => t.replace(/[.,!?]$/, "")), inference_status: { status: "succeeded" } });
    }
    const el = url.pathname.match(/^\/elevenlabs\/v1\/text-to-speech\/([^/]+)\/with-timestamps$/);
    if (el) {
      entry.voice = decodeURIComponent(el[1]);
      if (req.headers["xi-api-key"] !== KEYS.ELEVENLABS_API_KEY) return send(401, { detail: { status: "invalid_api_key" } });
      const chars = [...j.text], s0 = chars.map((_, i) => +(i * 0.05).toFixed(3));
      return send(200, { audio_base64: pcmFor(j.text).toString("base64"), alignment: { characters: chars, character_start_times_seconds: s0, character_end_times_seconds: s0.map((x) => +(x + 0.05).toFixed(3)) }, normalized_alignment: null });
    }
    send(404, { error: `no such fake endpoint ${url.pathname}` });
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  return {
    BASE: `http://127.0.0.1:${port}`, PORT: port, log: st.log, fail: st.fail,
    get maxInflight() { return st.maxInflight; },
    set delay(ms) { st.delay = ms; },
    set gather(n) { st.gather = n; },
    close: () => server.close(),
  };
}
