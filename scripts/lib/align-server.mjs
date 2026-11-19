// The round on the review page (find-the-gaps, steps 2 and 3): what the review server answers for a round, beside the
// videos. The page (packages/player/align-page.html, served at /round/?r=<name>) asks one card at a time, and every
// answer goes into the same record `align record` writes (lib/align.mjs), so the chat and the page end the same way.
//
//   GET  /api/round?r=<name>                 the round's fronts: words, cards (question, options, kind), no answers
//   POST /api/round/answer {r, card, answer, own?, settled?}   recorded; → the card's back once you have answered
//   POST /api/round/say {r, card, words}     your words, saved as a question for the session waiting on the page
//                                            (never a headless run), which splits them into claims and records them
//   GET  /api/round/say?r=&card=             the claims, once the session has recorded them
//   POST /api/round/transcribe               a recording (audio/*), written down by the local whisper; nothing leaves
//                                            the machine
//   POST /api/round/send {r, skipped?}       the round, filed through the inbox as a review is, for the waiting
//                                            session; with none waiting it stays there; it never starts a headless run
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, basename, relative } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { roundsDir, parseCards, linesOf, recordAnswers, gapOf, validAnswers, SETTLE_WORDS } from "./align.mjs";
import { writeReview, writeQuestion, deliverInbox, liveWaiters } from "./inbox.mjs";
import { whisperPath } from "./local-speed.mjs";
import { findExecutable } from "./review-preferences.mjs";
import { homedir } from "node:os";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/;

/** The round folder a page asks for, by its name, in this repo's rounds; null when there is none. */
export function roundByName(repo, name) {
  if (!NAME.test(String(name || ""))) return null;
  const d = join(roundsDir(repo), name);
  return existsSync(join(d, "align.md")) ? d : null;
}
/** What the page needs to draw a round: never an answer, a why or the lines, until you have answered. */
export function roundFront(dir) {
  const md = readFileSync(join(dir, "align.md"), "utf8"), cards = parseCards(md), rec = readJson(join(dir, "answers.json")) || { cards: {}, skipped: [] };
  const words = ((/\*\*Your words:\*\*\s*(.*)/.exec(md) || [])[1] || "").replace(/^"(.*)"$/, "$1");
  const title = ((/^# Round:\s*(.*)$/m.exec(md) || [])[1] || basename(dir)).trim();
  const order = [...cards.filter((c) => c.kind === "assume"), ...cards.filter((c) => c.kind === "predict"), ...cards.filter((c) => c.kind === "say")];
  return { name: basename(dir), title, words, cards: order.map((c) => ({ id: c.id, kind: c.kind, question: c.question, options: c.options, point: /^(yes|true)$/i.test(c.fields.point || ""),
    answered: rec.cards[c.id] || null, ...(rec.cards[c.id] ? { back: backOf(dir, c, rec.cards[c.id]) } : {}) })), skipped: rec.skipped || [] };
}
/** A card's back: the code's own lines, the answer and why (a predict card), and whether your answer was a gap. */
export function backOf(dir, c, a) {
  const gap = gapOf(c, a);
  // a say card whose claims differ is a gap settled as any (step 3): the four ways, under the claims
  if (c.kind === "say") return { gap, ...(a.claims ? { claims: a.claims } : {}), ...(gap === "gap" ? { settles: ["got-it", "change-plan", "code-wrong", "show-more"] } : {}) };
  if (c.kind !== "predict") return { gap };
  const { text } = linesOf(dir, c);
  return { gap, answer: c.answer, label: c.options.find((o) => o.id === c.answer)?.label || "", source: c.source, lines: text, why: c.why, more: c.more || "",
    settles: a.answer === "not-sure" ? ["got-it", "show-more"] : ["got-it", "change-plan", "code-wrong", "show-more"] };
}

/** Write a recording down with the local whisper: { text } or { error }. Nothing leaves the machine. */
export function transcribe(audio, { env = process.env } = {}) {
  const whisper = whisperPath(env), ffmpeg = findExecutable("ffmpeg") || "ffmpeg";
  const model = [env.REELPLANNER_WHISPER_MODEL, join(homedir(), ".cache", "hyperframes", "whisper", "models", "ggml-small.en.bin")].find((m) => m && existsSync(m));
  if (!whisper || !model) return { error: "whisper is not installed here: type your words instead (reelplanner setup --local-voice installs it)" };
  const t = mkdtempSync(join(tmpdir(), "rp-say-"));
  try {
    writeFileSync(join(t, "in"), audio);
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", join(t, "in"), "-ar", "16000", "-ac", "1", join(t, "in.wav")], { stdio: "ignore", timeout: 60000 });
    const out = execFileSync(whisper, ["-m", model, "-f", join(t, "in.wav"), "-nt", "-np"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 120000 });
    return { text: out.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim() };
  } catch (e) { return { error: `could not write it down (${e.message.split("\n")[0]}): type your words instead` }; }
  finally { rmSync(t, { recursive: true, force: true }); }
}

/**
 * The round's API, for the review server: → true when it answered the request. `ctx`: { repo, box, json, readBody }.
 * The server's host and origin checks run before this.
 */
export async function handleRound(req, res, path, { repo, box, json, readBody }) {
  const q = new URL(req.url, "http://x").searchParams;
  const body = async (limit) => { try { return JSON.parse(await readBody(req, limit)); } catch (e) { json(res, e.status || 400, { ok: false, error: e.status ? "too large" : "body is not JSON" }); return null; } };
  const dirFor = (name) => { const d = roundByName(repo, name); if (!d) json(res, 404, { ok: false, error: `no round ${name}` }); return d; };
  if (path === "api/round" && req.method === "GET") { const d = dirFor(q.get("r")); if (d) json(res, 200, { ok: true, ...roundFront(d), sessionWaiting: liveWaiters(box).length > 0 }); return true; }
  if (path === "api/round/transcribe" && req.method === "POST") {
    if (!/^audio\//i.test(String(req.headers["content-type"] || ""))) { json(res, 415, { ok: false, error: "content-type must be audio/*" }); return true; }
    const chunks = []; let n = 0;
    await new Promise((ok, fail) => { req.on("data", (c) => { n += c.length; if (n > 25e6) { req.destroy(); fail(new Error("too large")); } else chunks.push(c); }); req.on("end", ok); req.on("error", fail); });
    const r = transcribe(Buffer.concat(chunks));
    json(res, r.error ? 200 : 200, { ok: !r.error, ...r }); return true;
  }
  if (path === "api/round/say" && req.method === "GET") {
    const d = dirFor(q.get("r")); if (!d) return true;
    const a = (readJson(join(d, "answers.json")) || { cards: {} }).cards[String(q.get("card") || "").toLowerCase()];
    json(res, 200, { ok: true, checked: !!a?.claims, ...(a?.claims ? { claims: a.claims } : {}) }); return true;
  }
  if (req.method !== "POST") { json(res, 405, { ok: false, error: "GET the round, POST an answer" }); return true; }
  if (!/^application\/json\b/i.test(String(req.headers["content-type"] || ""))) { json(res, 415, { ok: false, error: "content-type must be application/json" }); return true; }
  const b = await body(path === "api/round/say" ? 64e3 : 32e3); if (!b) return true;
  const d = dirFor(b.r); if (!d) return true;
  const cards = parseCards(readFileSync(join(d, "align.md"), "utf8"));
  if (path === "api/round/answer") {
    const input = [{ card: b.card, answer: b.answer, own: b.own, settled: b.settled, via: "page" }];
    const { errors } = validAnswers(cards, input); if (errors.length) { json(res, 400, { ok: false, error: errors.join("; ") }); return true; }
    const r = recordAnswers(d, input);
    if (r.errors.length) { json(res, 400, { ok: false, error: r.errors.join("; ") }); return true; }
    const c = cards.find((x) => x.id === String(b.card).toLowerCase());
    json(res, 200, { ok: true, back: backOf(d, c, r.record.cards[c.id]), routed: r.routed }); return true;
  }
  if (path === "api/round/say") {
    const c = cards.find((x) => x.id === String(b.card || "").toLowerCase());
    const words = typeof b.words === "string" ? b.words.trim() : "";
    if (!c || c.kind !== "say") { json(res, 400, { ok: false, error: "a say card's words" }); return true; }
    if (!words || words.length > 4000) { json(res, 400, { ok: false, error: "your words are 1 to 4000 characters" }); return true; }
    const at = relative(repo, d) || d;
    const w = writeQuestion(box, { id: `say-${basename(d)}-${c.id}-${Date.now().toString(36)}`.slice(0, 80), kind: "say", round: basename(d), card: c.id, title: `round ${basename(d)}`,
      question: `Check card ${c.id} of the round ${basename(d)} (${c.question}). The person said: "${words}". Split their words into claims, each a stretch that says one thing; check each against the round's pinned sources (read them, never guess); mark each match (with the lines), differs (with the lines) or open (a want, not what is). Then: reelplanner align answer ${at} ${c.id} <claims.json>, and reelplanner inbox answer <this id> "checked" --from "the round's sources". The fresh checker then reads each marked claim from its lines alone.`,
      quote: words.slice(0, 400) });
    const r = await deliverInbox(box, w.id, { question: true, repo });
    json(res, 200, { ok: true, id: w.id, handledBy: r.handledBy, message: r.handledBy === "session" ? "a session is checking your words" : "waiting for a session to check your words" }); return true;
  }
  if (path === "api/round/send") {
    const skipped = (Array.isArray(b.skipped) ? b.skipped : []).map(String);
    // the round's Finish (step 4): Done, Plan this (a plan written on what it settled) or Explain the gaps (its one explainer)
    const next = ["done", "plan", "explain"].includes(b.next) ? b.next : "done";
    const r = recordAnswers(d, { answers: [], skipped });
    if (r.errors.length) { json(res, 400, { ok: false, error: r.errors.join("; ") }); return true; }
    const rec = r.record, gaps = cards.filter((c) => rec.cards[c.id] && !["same", "said"].includes(gapOf(c, rec.cards[c.id])));
    const summary = `${Object.keys(rec.cards).length} of ${cards.length} answered, ${gaps.length} gap${gaps.length === 1 ? "" : "s"}${skipped.length ? `, ${skipped.length} skipped` : ""}: ${gaps.map((c) => `${c.id} ${SETTLE_WORDS[rec.cards[c.id].settled] || "not settled"}`).join(", ") || "no gap"}`;
    const row = { project: `round-${basename(d)}`, kind: "align", title: `Round: ${basename(d)}`, round: relative(repo, d) || d, submittedAt: new Date().toISOString(), verdict: "round",
      review: { kind: "align", round: relative(repo, d) || d, summary, next, annotations: [] } };
    const w = writeReview(box, row);
    // a round is for a session: it never starts a headless run, as a question asked on the page never does
    const dl = w.duplicate ? { handledBy: "inbox", message: "already sent" } : await deliverInbox(box, w.id, { repo, start: async () => ({ started: false }) });
    json(res, 200, { ok: true, id: w.id, summary, handledBy: dl.handledBy, message: dl.handledBy === "session" ? "sent to the session waiting on the page" : "saved; waiting for a session to take it (a round never starts a headless run)" }); return true;
  }
  json(res, 404, { ok: false, error: "no such endpoint" }); return true;
}
/** The page itself, and the fonts it names, from the player's package. → a file path, or null. */
export function roundAsset(root, path) {
  const rel = path.replace(/^round\/?/, "");
  if (rel === "" || rel === "index.html") return join(root, "packages", "player", "align-page.html");
  const m = /^fonts\/([a-z0-9-]+\.woff2)$/.exec(rel);
  return m && existsSync(join(root, "packages", "player", "fonts", m[1])) ? join(root, "packages", "player", "fonts", m[1]) : null;
}
