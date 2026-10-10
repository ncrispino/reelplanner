// The sketch partner: a model that watches someone sketch and asks one short question when something in their picture
// is unclear (an arrow to nowhere, a box never explained, "I'm not sure" said aloud). It sees what the sketch already
// records, at each picture: the canvas as an image, the boxes and arrows exactly as typed, and the words said and
// typed so far. It never says how the code works: the sketch is their picture, and where it differs from the code is
// what the explainer is about. Its questions are shown beside the canvas, never drawn on it, and kept in session.json.
// It answers in two lines, streamed to the page as they come: LOOKING (what it is checking, shown while it decides,
// so the person sees what it noticed even when it holds back) and then ASK (the question, typed out as it arrives) or
// NONE. A model that shows its reasoning (a local thinking model's <think>, a reasoning field) streams that too.
//
// Where it runs (one OpenAI-style /chat/completions call either way):
//   openrouter  recommended: anthropic/claude-sonnet-5.5, OPENROUTER_API_KEY (the key narration's hosted voice uses).
//               Chosen by trying the candidates on the same pictures and words (Oct 2026): it asked about what the
//               person was unsure of every time, held back (NONE) when nothing was open or it had asked already, and
//               when it did ask again it found a new thread; 1.5-6 s and ~$0.002-0.003 a question. openai/gpt-6-luna
//               is the budget pick (~2.5 s, ~$0.0001, a little weaker at holding back); claude-haiku-5.5 asked
//               about the same thing again; qwen3.8-flash and glm-5.3-flash ran out of tokens thinking
//   local       an OpenAI-compatible server on this machine (Ollama on :11434, LM Studio on :1234) and a vision
//               model already pulled there (the first one it lists, or the one named); nothing leaves the machine
//   off
// Chosen by `sketch --partner <openrouter|local|off>`, REELPLANNER_SKETCH_PARTNER, or .reelplanner/config.json's
// sketch.partner; "auto" (the default) takes OpenRouter when its key is set, else a local server with a vision model,
// else off. The model: --partner-model, REELPLANNER_SKETCH_MODEL, sketch.model. The server: REELPLANNER_SKETCH_BASE_URL,
// sketch.base_url. The page shows which one is on, with a switch to turn it off.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { rpDirOf } from "./env.mjs";
import { loadEnvFile } from "./narrator.mjs";
import { repoTop } from "./explainer.mjs";
import { describeScene } from "./sketch-scene.mjs";

export const RECOMMENDED = "anthropic/claude-sonnet-5.5";
export const OPENROUTER = "https://openrouter.ai/api/v1";
const LOCAL_BASES = ["http://127.0.0.1:11434/v1", "http://127.0.0.1:1234/v1"];
// model names that take images, as local servers list them
const VISION = /(-?vl\b|vl:|vision|llava|bakllava|gemma-?3|gemma-?4|minicpm-v|moondream|pixtral|omni|llama-?4|mistral-small-3)/i;
export const LOCAL_SUGGEST = "ollama pull gemma3:4b";
const trim = (u) => String(u || "").replace(/\/+$/, "");

async function getJson(url, { timeoutMs = 1500, ...init } = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  try { const r = await fetch(url, { ...init, signal: ctl.signal }); return r.ok ? await r.json() : null; }
  catch { return null; } finally { clearTimeout(timer); }
}

/**
 * Which partner runs here. → { provider, base, model, keyEnv, where } or { off: true, why }; throws when one is named
 * that cannot run (no key, no server, no vision model), so `sketch --partner local` says why instead of going quiet.
 */
export async function resolvePartner({ dir = process.cwd(), choice, model, env = process.env } = {}) {
  loadEnvFile(dir);
  let cfg = {};
  try { const repo = repoTop(dir); const p = repo && join(rpDirOf(repo), "config.json"); if (p && existsSync(p)) cfg = JSON.parse(readFileSync(p, "utf8")).sketch || {}; } catch { /* no settings */ }
  const asked = String(choice || env.REELPLANNER_SKETCH_PARTNER || cfg.partner || "auto").toLowerCase();
  const named = asked !== "auto";
  model ||= env.REELPLANNER_SKETCH_MODEL || cfg.model || null;
  const base = trim(env.REELPLANNER_SKETCH_BASE_URL || cfg.base_url);
  if (!["auto", "openrouter", "local", "off"].includes(asked)) throw new Error(`partner "${asked}" is not one of: openrouter, local, off (or auto)`);
  if (asked === "off") return { off: true, why: "turned off" };
  if (asked === "openrouter" || (asked === "auto" && env.OPENROUTER_API_KEY)) {
    if (!env.OPENROUTER_API_KEY) throw new Error("partner openrouter needs OPENROUTER_API_KEY (in ~/.reelplanner/.env, or the shell)");
    return { provider: "openrouter", base: base || OPENROUTER, model: model || RECOMMENDED, keyEnv: "OPENROUTER_API_KEY", where: "OpenRouter" };
  }
  // local: the server named, else the usual ports; the model named, else the first vision model it lists
  let heard = null;
  for (const b of base ? [base] : LOCAL_BASES) {
    const j = await getJson(`${b}/models`);
    if (!j) continue;
    const ids = (j.data || j.models || []).map((m) => m.id || m.name).filter(Boolean);
    heard = { b, ids };
    const pick = model || ids.find((id) => VISION.test(id));
    if (pick) return { provider: "local", base: b, model: pick, keyEnv: null, where: "this machine" };
  }
  const why = heard ? `the local server at ${heard.b} has no vision model (${heard.ids.join(", ") || "none"}): \`${LOCAL_SUGGEST}\``
    : `no OPENROUTER_API_KEY, and no local model server answered (${(base ? [base] : LOCAL_BASES).join(", ")})`;
  if (named) throw new Error(`partner ${asked}: ${why}`);
  return { off: true, why };
}

const SYSTEM = `You are watching someone sketch, on a whiteboard, how they think part of a software system works, while they talk. Their picture is theirs: you are not there to correct it, explain the code, or suggest how it should work, and you do not know the code.

You may ask ONE short question (under 20 words) that helps them finish their own picture. Look for, in this order:
1. a line marked (they sound unsure): ask a concrete question about that very thing (where, which, when, what happens if), not "what are you unsure about";
2. a step that starts but never ends, or an arrow that leads nowhere or has no meaning;
3. a box or word in the picture they never explained.
Ask about their picture, in their words. You can read every label in the list above: never ask what a label says. Never ask about something you already asked about, even in other words: if it is still open, wait. Never ask what they already said.

Answer in exactly two lines, nothing before or after:
LOOKING: what you are checking, under 12 words, in their words (they see this line while you decide)
then either ASK: the question, or NONE.
Answer NONE when what is open was already asked about, when they explained it, or when the picture is complete enough for now: a question they did not need is worse than none.`;

/** The picture as text, as sketch.md says it: frames, shapes and their looks, arrows, text and what it sits by, marks. */
export const describeDrawing = (els = []) => describeScene(els).join("\n").trim() || "(nothing yet)";

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// words that say "I'm guessing": a small model finds the open question far more often when the line is marked for it
const HEDGE = /\b(i think|i guess|i believe|i'm not sure|not sure|not totally sure|unsure|maybe|probably|somehow|i don't know|no idea|i forget|might be|could be|kind of)\b/i;

/** The request, as both servers take it. */
export function partnerMessages({ question, elements, said = [], asked = [], png }) {
  // earlier questions, as the page sends them ({ t, text }; a bare string has no time). A line said before the last
  // question was there to be asked about already: only what came after it is marked unsure again
  asked = asked.map((q) => typeof q === "string" ? { t: null, text: q } : q);
  const since = Math.max(-Infinity, ...asked.map((q) => q.t ?? -Infinity));
  const text = [
    `What they are explaining: ${question || "(not given)"}`, "",
    "What is on the canvas now, as typed:", describeDrawing(elements), "",
    "What they have said and typed so far, oldest first:",
    said.length ? said.slice(-40).map((x) => `[${mmss(x.t)}] ${x.text}${x.t > since && HEDGE.test(x.text) ? "   (they sound unsure)" : ""}`).join("\n") : "(nothing yet)", "",
    asked.length ? `You already asked about these; do not ask about them again, in any words:\n${asked.map((q) => `- ${q.text}`).join("\n")}` : "You have asked nothing yet.", "",
    "The picture is the canvas now. One question, or NONE.",
  ].join("\n");
  return [{ role: "system", content: SYSTEM },
    { role: "user", content: [{ type: "text", text }, ...(png ? [{ type: "image_url", image_url: { url: png } }] : [])] }];
}

// the question in what a model wrote: the last sentence that asks something (a model sometimes thinks aloud first, "The
// unsure line is …. I'll ask about that."), or null when it asks nothing
function questionIn(out) {
  out = String(out || "").trim().split(/\n\s*\n/)[0].trim().replace(/^["“]|["”]$/g, "");
  if (!out || /^none\b/i.test(out)) return null;
  const asks = out.replace(/\s+/g, " ").match(/[^.?!]*\?/g);
  if (!asks) return null;
  return clip(asks[asks.length - 1].trim().replace(/^["“(]+/, ""));
}
const clip = (q) => q.length > 240 ? q.slice(0, 237) + "…" : q;

/**
 * What the partner has written so far, read as the page shows it: its thinking (a reasoning model's, in <think> or
 * the reasoning field), the LOOKING line (what it is weighing), and the question (ASK) as far as it has come; with
 * `done`, the question as kept (null for NONE). A model that skips the two-line form is read as before.
 */
export function readAnswer(content = "", reasoning = "", done = false) {
  let thinking = reasoning || "";
  const open = content.lastIndexOf("<think>"), close = content.lastIndexOf("</think>");
  if (open >= 0 && close < open) { thinking += content.slice(open + 7); content = content.slice(0, open); }
  content = content.replace(/<think>([\s\S]*?)<\/think>/g, (_, t) => { thinking += t; return ""; }).trim();
  const look = content.match(/^\s*LOOKING:[ \t]*([^\n]*)/im), ask = content.match(/^\s*ASK:\s*([\s\S]*)/im);
  const looking = look ? look[1].trim() : "";
  const none = /^\s*NONE\b/im.test(look ? content.slice(look.index + look[0].length) : content);
  // while it streams, only what follows ASK: is the question; at the end, an answer without the two-line form is read
  // whole, as before
  let text = ask ? ask[1].trim() : "";
  // an ASK line that asks is kept whole (a label it quotes may hold a "?" of its own)
  if (done) text = none && !ask ? null : ask && /\?\s*$/.test(text.split("\n")[0]) ? clip(text.split("\n")[0].trim()) : questionIn(ask || look ? text : content);
  return { thinking: thinking.trim(), looking, text, none, done };
}

/**
 * Ask the partner. → the question, or null when it has none. With onDelta, the answer streams: onDelta gets
 * readAnswer() of what has come so far, as it comes, and once more at the end (done).
 */
export async function askPartner(p, input, { timeoutMs = p.provider === "local" ? 120000 : 30000, messages, onDelta } = {}) {
  const body = { model: p.model, messages: messages || partnerMessages(input), max_tokens: 2048, stream: !!onDelta };   // room for a model that thinks first
  const headers = { "content-type": "application/json" };
  if (p.keyEnv) headers.authorization = `Bearer ${process.env[p.keyEnv]}`;
  if (p.provider === "openrouter") Object.assign(headers, { "x-title": "reelplanner sketch", "http-referer": "https://github.com/ncrispino/reelplanner" });
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  const fail = (e) => new Error(e.name === "AbortError" ? `${p.model} did not answer in ${timeoutMs / 1000} s` : `${p.where}: ${e.message}`);
  let res, content = "", reasoning = "";
  try {
    res = await fetch(`${p.base}/chat/completions`, { method: "POST", headers, body: JSON.stringify(body), signal: ctl.signal });
    if (res.ok && /event-stream/.test(res.headers.get("content-type") || "")) {
      // server-sent events: each data line a chunk of the answer (and of its reasoning, where the model shows it)
      const dec = new TextDecoder(); let buf = "";
      for await (const chunk of res.body) {
        buf += dec.decode(chunk, { stream: true }); let i, grew = false;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith("data:") || line === "data: [DONE]") continue;
          let d; try { d = JSON.parse(line.slice(5)).choices?.[0]?.delta || {}; } catch { continue; }
          const r = d.reasoning ?? d.reasoning_content ?? "";
          if (d.content || r) { content += d.content || ""; reasoning += r; grew = true; }
        }
        if (grew) onDelta(readAnswer(content, reasoning));
      }
    } else {
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(`${p.where} ${p.model}: ${res.status} ${j?.error?.message || res.statusText}`);
      const m = j?.choices?.[0]?.message || {};
      content = Array.isArray(m.content) ? m.content.map((c) => c.text || "").join("") : String(m.content || "");
      reasoning = m.reasoning || m.reasoning_content || "";
    }
  } catch (e) { throw e.message.startsWith(`${p.where} `) ? e : fail(e); }
  finally { clearTimeout(timer); }
  const a = readAnswer(content, reasoning, true);
  onDelta?.(a);
  return a.text;
}

/** Load a local model before the first question (on a CPU the first one takes many seconds); errors are ignored. */
export function warmPartner(p) {
  if (p.provider !== "local") return Promise.resolve();
  return askPartner(p, null, { messages: [{ role: "user", content: "Answer NONE." }] }).catch(() => {});
}

/** How the page and the log name it: "claude-sonnet-5.5 via OpenRouter", "gemma3:4b on this machine". */
export const partnerLabel = (p) => p.off ? `off (${p.why})` : `${p.model.split("/").pop()} ${p.provider === "openrouter" ? "via OpenRouter" : "on this machine"}`;

// ---------- drawing what they said ----------
// "Draw what I said" (the page's button, or saying "draw that"): the same model turns what was said since the last
// time into a Mermaid flowchart, which the page opens in Excalidraw's Mermaid dialog for them to look at, change and
// insert, or not. Only what they said, in their words: the picture stays theirs, the model only saves the drawing.
const DRAW = `You turn what someone said aloud, while explaining how part of a software system works, into a Mermaid flowchart, so they need not draw it by hand.

Draw ONLY what they said, in their words: no box, step, arrow or label they did not say, and nothing you know about how such systems usually work. Each arrow is one thing they said, from the thing that does it to the thing it is done to; never the same thing twice. Where they sound unsure ("I think", "maybe", "not sure"), make that edge dotted (-.->) and keep their hedge in its label. When they name something already on their canvas (listed below), use exactly that name.

Answer with the Mermaid source alone: flowchart LR (or TD for a sequence of steps going down), no fences, no comments.`;

/** The request for "Draw what I said". */
export function drawMessages({ question, said = [], elements = [] }) {
  const names = [...new Set(elements.map((e) => e.label || e.text).filter(Boolean).map((s) => String(s).replace(/\s+/g, " ").trim()))];
  const text = [`What they are explaining: ${question || "(not given)"}`, "",
    `Already on their canvas: ${names.length ? names.map((n) => `"${n}"`).join(", ") : "(nothing yet)"}`, "",
    "What they said, oldest first:", ...said.map((x) => `- ${x.text}`)].join("\n");
  return [{ role: "system", content: DRAW }, { role: "user", content: text }];
}

/** Mermaid in what a model wrote: the flowchart, fences and any preamble off; null when there is none. */
export function mermaidIn(out) {
  const s = String(out || "").replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```(?:mermaid)?/g, "").trim();
  const at = s.search(/^\s*(flowchart|graph)\s+(LR|RL|TD|TB|BT)\b/m);
  return at < 0 ? null : s.slice(at).trim();
}

/** Ask the partner's model for a flowchart of what was said. → Mermaid source, or null. */
export async function drawFromSaid(p, input, { timeoutMs = p.provider === "local" ? 120000 : 45000 } = {}) {
  const headers = { "content-type": "application/json" };
  if (p.keyEnv) headers.authorization = `Bearer ${process.env[p.keyEnv]}`;
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${p.base}/chat/completions`, { method: "POST", headers, signal: ctl.signal,
      body: JSON.stringify({ model: p.model, messages: drawMessages(input), max_tokens: 2048, stream: false }) });
    const j = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`${p.where} ${p.model}: ${res.status} ${j?.error?.message || res.statusText}`);
    const m = j?.choices?.[0]?.message?.content;
    return mermaidIn(Array.isArray(m) ? m.map((c) => c.text || "").join("") : m);
  } catch (e) { throw e.name === "AbortError" ? new Error(`${p.model} did not answer in ${timeoutMs / 1000} s`) : e; }
  finally { clearTimeout(timer); }
}
