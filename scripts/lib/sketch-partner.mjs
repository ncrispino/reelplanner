// The sketch partner: a model that watches someone sketch and asks one short question when something in their picture
// is unclear (an arrow to nowhere, a box never explained, "I'm not sure" said aloud). It sees what the sketch already
// records, at each picture: the canvas as an image, the boxes and arrows exactly as typed, and the words said and
// typed so far. It never says how the code works: the sketch is their picture, and where it differs from the code is
// what the explainer is about. Its questions are shown beside the canvas, never drawn on it, and kept in session.json.
//
// Where it runs (one OpenAI-style /chat/completions call either way):
//   openrouter  recommended: anthropic/claude-haiku-5.5 (vision, fast, $0.10/$0.50 per million tokens, Oct 2026),
//               OPENROUTER_API_KEY, the key narration's hosted voice already uses
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

export const RECOMMENDED = "anthropic/claude-haiku-5.5";
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

Ask ONE short question (under 20 words) only when something in their picture or words is unclear or left open, so that answering it makes their own picture more complete. Good reasons: an arrow that points at nothing or has no meaning, a box that was never explained, a step that starts but never ends, something they said they are unsure of, two names that may be the same thing. Ask about their picture, in their words. Never ask something they already answered, and never repeat a question.

If nothing is worth asking right now, answer exactly NONE. Answer with the question alone, no preamble.`;

/** The picture as text: boxes, arrows between them by label, words on the canvas. */
export function describeDrawing(els = []) {
  const byId = new Map(els.map((e) => [e.id, e]));
  const name = (id) => { const e = byId.get(id); return e ? `"${String(e.label || e.text || e.kind).replace(/\s+/g, " ")}"` : "(nothing)"; };
  const out = [];
  for (const e of els) {
    if (e.kind === "arrow") out.push(`- arrow ${name(e.from)} → ${name(e.to)}${e.label ? ` (labeled "${e.label.replace(/\s+/g, " ")}")` : ""}`);
    else if (e.kind === "text") out.push(`- text "${String(e.text).replace(/\s+/g, " ")}"`);
    else if (e.kind !== "freedraw" && e.kind !== "line") out.push(`- ${e.kind}${e.label ? ` "${e.label.replace(/\s+/g, " ")}"` : " (no label)"}`);
  }
  const free = els.filter((e) => e.kind === "freedraw" || e.kind === "line").length;
  if (free) out.push(`- ${free} freehand stroke${free === 1 ? "" : "s"} or line${free === 1 ? "" : "s"} (see the picture)`);
  return out.join("\n") || "(nothing yet)";
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** The request, as both servers take it. */
export function partnerMessages({ question, elements, said = [], asked = [], png }) {
  const text = [
    `What they are explaining: ${question || "(not given)"}`, "",
    "What is on the canvas now, as typed:", describeDrawing(elements), "",
    "What they have said and typed so far, oldest first:",
    said.length ? said.slice(-40).map((x) => `[${mmss(x.t)}] ${x.text}`).join("\n") : "(nothing yet)", "",
    asked.length ? `Questions you already asked (do not repeat): ${asked.map((q) => `"${q}"`).join("; ")}` : "You have asked nothing yet.", "",
    "The picture is the canvas now. One question, or NONE.",
  ].join("\n");
  return [{ role: "system", content: SYSTEM },
    { role: "user", content: [{ type: "text", text }, ...(png ? [{ type: "image_url", image_url: { url: png } }] : [])] }];
}

/** Ask the partner. → the question, or null when it has none. */
export async function askPartner(p, input, { timeoutMs = 25000 } = {}) {
  const body = { model: p.model, messages: partnerMessages(input), max_tokens: 1024, stream: false };
  const headers = { "content-type": "application/json" };
  if (p.keyEnv) headers.authorization = `Bearer ${process.env[p.keyEnv]}`;
  if (p.provider === "openrouter") Object.assign(headers, { "x-title": "reelplanner sketch", "http-referer": "https://github.com/ncrispino/reelplanner" });
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  let res;
  try { res = await fetch(`${p.base}/chat/completions`, { method: "POST", headers, body: JSON.stringify(body), signal: ctl.signal }); }
  catch (e) { throw new Error(e.name === "AbortError" ? `${p.model} did not answer in ${timeoutMs / 1000} s` : `${p.where}: ${e.message}`); }
  finally { clearTimeout(timer); }
  const j = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${p.where} ${p.model}: ${res.status} ${j?.error?.message || res.statusText}`);
  let out = j?.choices?.[0]?.message?.content;
  if (Array.isArray(out)) out = out.map((c) => c.text || "").join("");
  out = String(out || "").replace(/<think>[\s\S]*?<\/think>/g, "").trim().split(/\n\s*\n/)[0].trim().replace(/^["“]|["”]$/g, "");
  if (!out || /^none\b/i.test(out)) return null;
  return out.length > 240 ? out.slice(0, 237) + "…" : out;
}

/** How the page and the log name it: "claude-haiku-5.5 via OpenRouter", "gemma3:4b on this machine". */
export const partnerLabel = (p) => p.off ? `off (${p.why})` : `${p.model.split("/").pop()} ${p.provider === "openrouter" ? "via OpenRouter" : "on this machine"}`;
