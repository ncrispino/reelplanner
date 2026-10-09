// Memory (the memory plan, steps 2–5; D-085, D-106, D-107): what reviews already record, worked out
// each time from the ledger and every plan's reviews/, never kept by hand.
//
//   reviewFacts   one review, boiled down: questions answered from the options and whether the
//                 recommendation was taken, own-words answers and why, rewinds, quick checks answered
//                 wrong, the agent's calls and their verdicts; where the reviewer got lost (checks
//                 missed, explanations opened, words looked up, an approval with checks missed, D-129)
//                 and the videos watched (this one, and what the browser marked watched, D-128). `reel
//                 record` appends the same facts, one line per review, to your own file (~/.reelplanner/you.jsonl, D-106); where that
//                 cannot be written (a run fenced to the repo), to the repo's .reelplanner/you.pending.jsonl,
//                 moved into your file by the next run that can write it (recordYou, movePending).
//   memoryLines   at most seven lines from a list of facts, each with an id (`reel memory <id>` prints
//                 its evidence): recommended, own-words, rewinds, checks, lost (where you got lost, per
//                 plan: checks missed, explanations opened, words looked up, approvals given with checks
//                 missed), misses (or, across repos, the kinds of call flagged), and after-build (how the
//                 walkthroughs were looked at: the seconds a pause held you, flags, words, sent early;
//                 walkthroughs-that-help step 6).
//   findMisses    something a later plan, fix or walkthrough changed that an earlier review let through,
//                 traced to the question or call that passed it and its kind (a call's tags, a
//                 question's components). A recent one makes a call of that kind stop (autonomy.mjs).
//   retroDue      D-107: five plans since the last retro, or one signal repeated three times.
import { existsSync, readFileSync, readdirSync, appendFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { listReviews, ledgerFor, verdictOf, ASKS_MORE } from "./reviews.mjs";
import { mapFor, distinctive } from "./review-scope.mjs";
import { parseCalls } from "./autonomy.mjs";
import { parseSteps } from "./plan-md.mjs";
import { machineDir, RP_DIR, OLD_RP_DIR } from "./env.mjs";

// D-115: the ids are words, so `reel memory <id>` says what it prints; `lost` is videos-you-can-follow's
export const LINES = ["recommended", "own-words", "rewinds", "checks", "lost", "misses", "after-build"];
// walkthroughs-that-help step 6: the bar the new walkthrough must clear, over the first three walkthrough
// reviews whose pauses are timed (`shownAt`): a pause holds you at least five seconds (the middle value), and
// at least one flag, answer in your words or comment. Both halves are needed; three of three missing it
// makes `reel status` say a plan to drop the walkthrough video is due.
export const BAR = { held: 5, reviews: 3 };
/** Watched: 80% of a video seen (the player's own rule for its "Watched" mark), or a review of it sent. */
export const WATCHED = 0.8;
export const RETRO_PLANS = 5;     // D-107: a retro every five plans…
export const RETRO_REPEAT = 3;    // …or when one signal repeats three times
export const RECENT_PLANS = 5;    // a miss is recent while the plan that showed it is one of the last five (retros not counted)

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const short = (plan) => String(plan || "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
const mmss = (t) => (t == null ? "" : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`);
const plural = (n, w, ws = `${w}s`) => `${n} ${n === 1 ? w : ws}`;

/** Where your own memory lives (D-106): REELPLANNER_HOME, else ~/.reelplanner (an old ~/.reelplanning while there is no new one). */
export const homeDir = () => machineDir();
export const youPath = () => join(homeDir(), "you.jsonl");
/** Where a review's summary waits when your file cannot be written: in the repo's .reelplanner, committed
 *  with the review, so it reaches the machine you next run on (the memory plan's A15, after review). */
export const PENDING = "you.pending.jsonl";
export const pendingPath = (rp) => join(rp, PENDING);

/** Which components (system.json ids) a text names: name, id or alias, whole words, any case. */
export function componentsIn(text, sys) {
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (sys?.components || []).filter((c) => [c.name, c.id, ...(c.aliases || [])].some((n) => new RegExp(`\\b${esc(n)}\\b`, "i").test(text))).map((c) => c.id);
}
/** A plan's steps → the components each names, else the plan's "Components touched" (as `reel record`
 *  places a decision): { n: [ids] }. */
export function stepComponents(planDir, sys) {
  const md = read(join(planDir, "plan.md")), touched = componentsIn((md.match(/^## Components(?: touched)?\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m) || [])[1] || "", sys);
  return Object.fromEntries(parseSteps(md).map((s) => { const c = componentsIn(`${s.title}\n${s.text}`, sys); return [s.n, c.length ? c : touched]; }));
}

// Why a question was answered in the reviewer's own words, read from the words and the options offered.
export const REASONS = { unclear: "unclear, asked for more", condition: "an option, with a condition", framing: "the question framed otherwise" };
export function ownReason(words, options = [], option = "own") {
  if (option === "unclear" || ASKS_MORE.test(words) || /example/i.test(words)) return "unclear";
  if (/\b(?:[Oo]ption|of|with|pick|choose|take|like)\s+[A-D]\b/.test(words)) return "condition";   // "the principle of A, but…" (a capital letter: "of a" is English)
  const w = distinctive(words);
  if (options.some((o) => { const k = distinctive(o.label); return k.size > 0 && [...k].every((x) => w.has(x)); })) return "condition";
  return "framing";
}

/**
 * The quick checks a review counts. A review sent with quick checks off (the player's switch, `checks: "off"`) was not
 * asked them: a check on it with no answer (one only opened, or walked through) is neither wrong nor missed, and is left
 * out; one the reviewer answered anyway counts as any other.
 */
export const checksOf = (rv = {}) => (rv.quizzes || []).filter((q) => rv.checks !== "off" || (q.answer != null && q.answer !== ""));

/**
 * One review, boiled down. `r` is a listReviews entry ({ id, kind, at, review }); `map` the video's
 * plan map (question and check texts); `calls` walkthrough.md's rows (tags); `ledger` for question
 * texts and options older exports do not carry; `steps` the plan's step → components.
 */
export function reviewFacts(r, { plan, map = null, calls = [], ledger = [], steps = {}, repo = null, video = null } = {}) {
  const rv = r.review || {}, rows = Object.fromEntries(calls.map((c) => [c.key, c]));
  const facts = { v: 1, ...(repo ? { repo } : {}), plan, review: r.id, kind: r.kind, at: r.at || null,
    reviewer: rv.recorded?.reviewer || null, version: rv.recorded?.reelplanner || rv.recorded?.reelplanning || null, verdict: rv.verdict || null,
    questions: { taken: 0, of: 0 }, notTaken: [], own: [], rewinds: [], checks: checksOf(rv).length, wrongChecks: [], calls: {}, flagged: [],
    lost: lostOf(rv), watched: watchedOf(rv, { video, at: r.at }), ...(rv.checks === "off" ? { checksOff: true } : {}), ...(r.kind === "walkthrough" ? { afterBuild: afterBuildOf(rv, map) } : {}) };
  for (const d of rv.decisions || []) {
    const def = (map?.decisions || []).find((x) => x.id === d.id && (!d.question || x.question === d.question));
    const led = ledger.find((x) => x.plan === plan && x.questionId === d.id && (x.chosen === d.label || x.question === d.question));
    const question = d.question || def?.question || led?.question || d.id;
    const options = def?.options || led?.options || [];
    const at = { q: d.id, step: d.planStep ?? def?.planStep ?? null, t: d.t ?? null, question, ...(led ? { id: led.id } : {}) };
    if (d.option === "own" || d.option === "unclear") {
      const words = d.option === "own" ? String(d.label || "") : String(d.note || "explain this more");
      facts.own.push({ ...at, words, why: ownReason(words, options, d.option) });
    } else {
      facts.questions.of++;
      if (d.recommended) facts.questions.taken++;
      else facts.notTaken.push({ ...at, chose: d.label });
    }
  }
  for (const m of rv.watch?.moments || []) if (m.planStep != null)
    facts.rewinds.push({ step: m.planStep, kind: m.kind, t: m.t, ...(m.from != null ? { from: m.from } : {}), ...(m.rate != null ? { rate: m.rate } : {}) });
  for (const q of checksOf(rv)) {
    const note = String(q.note || "").trim();
    if (q.correct !== false && !note) continue;
    const def = (map?.quizzes || []).find((x) => String(x.id).toLowerCase() === String(q.id).toLowerCase()) || {};
    const label = (id) => (def.options || []).find((o) => o.id === id)?.label || id || "";
    const step = def.planStep ?? q.planStep ?? null;
    facts.wrongChecks.push({ k: q.id, step, t: q.t ?? null, question: def.question || q.id, answered: q.answer === "own" ? String(q.own || "") : label(q.answer),
      answer: label(def.answer), correct: q.correct !== false, ...(note ? { note } : {}), components: steps[step] || [] });
  }
  for (const v of rv.autonomy || []) {
    // a call on the list the reviewer left (D-221) was not judged: it counts as neither an accept nor a flag
    if (v.verdict === "listed") { facts.listed = (facts.listed || 0) + 1; continue; }
    const id = String(v.id).toLowerCase(); facts.calls[id] = v.verdict;
    if (v.verdict !== "accept") facts.flagged.push({ id, step: v.planStep ?? rows[id]?.step ?? null, verdict: v.verdict, tags: rows[id]?.tags || [], ...(String(v.own || "").trim() ? { words: v.own.trim() } : {}) });
  }
  return facts;
}

const median = (xs) => { if (!xs.length) return null; const a = [...xs].sort((x, y) => x - y), m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
/**
 * What a walkthrough review shows about looking (walkthroughs-that-help step 6): the seconds from each pause
 * to its answer (`shownAt` → `judgedAt`; the middle value), the flags and answers in your own words, the
 * written comments (the player's own "Flagged: …" labels aside), and whether it was sent before the video
 * could have played through (sent less than its watched length after the first play, or never played).
 * A review given in conversation carries `conversation: true` and is never early.
 * → { timed, held, flags, own, comments, early, sentAfter, conversation? }
 */
export function afterBuildOf(rv = {}, map = null) {
  const vs = rv.autonomy || [];
  const secs = vs.filter((v) => v.shownAt && v.judgedAt).map((v) => (Date.parse(v.judgedAt) - Date.parse(v.shownAt)) / 1000).filter((x) => Number.isFinite(x) && x >= 0);
  const comments = (rv.annotations || []).filter((a) => a.kind !== "approve" && String(a.comment || "").trim() && !(a.kind === "flag" && /^Flagged: /.test(String(a.comment).trim()))).length;
  const sent = Date.parse(rv.submittedAt || rv.exportedAt || ""), first = Date.parse(rv.watch?.firstPlayAt || "");
  const length = Number(map?.watchedSeconds ?? map?.totalSeconds ?? rv.watch?.durationSeconds) || 0;
  const sentAfter = Number.isFinite(sent) && Number.isFinite(first) ? +((sent - first) / 1000).toFixed(1) : null;
  // given in conversation (lib/reviews.mjs recordedBy): never in the player, so never "sent before it could play through"
  const talk = rv.source === "conversation";
  const early = !talk && Number.isFinite(sent) ? (sentAfter == null ? true : length > 0 && sentAfter < length) : false;
  const held = median(secs);
  return { timed: secs.length, held: held == null ? null : +held.toFixed(1), flags: vs.filter((v) => v.verdict === "flag").length, own: vs.filter((v) => v.verdict === "own").length, comments, early, sentAfter, ...(talk ? { conversation: true } : {}) };
}
/** Does one walkthrough review clear the bar? A pause held at least BAR.held s (middle value), and some words: a flag, your own words or a comment. */
export const clearsBar = (a) => !!a && a.held != null && a.held >= BAR.held && a.flags + a.own + a.comments > 0;
/**
 * The bar over the first BAR.reviews walkthrough reviews whose pauses are timed (walkthroughs-that-help step 6).
 * → { reviews: [facts], missed, due } — due when all BAR.reviews of them miss it
 */
export function walkthroughBar(facts) {
  const timed = facts.filter((f) => f.kind === "walkthrough" && f.afterBuild?.timed > 0).slice(0, BAR.reviews);
  const missed = timed.filter((f) => !clearsBar(f.afterBuild)).length;
  return { reviews: timed, missed, due: timed.length === BAR.reviews && missed === BAR.reviews };
}

/**
 * Where a review shows the reviewer got lost (videos-you-can-follow, step 3): the quick checks answered
 * wrong, the explanations opened ("Walk me through it"), the words looked up (the review's
 * `confusion.termsLookedUp`, the glossary keys whose meaning was opened; `confusion.termsOpened` counts
 * them where only a count was kept), and an approval given with checks missed (D-129: recorded, never blocked).
 */
export function lostOf(rv = {}) {
  const qs = checksOf(rv), cf = rv.confusion || {};
  const wrong = qs.filter((q) => q.correct === false).map((q) => q.id);
  const looked = [...new Set((Array.isArray(cf.termsLookedUp) ? cf.termsLookedUp : []).map((k) => String(k).trim().toLowerCase()).filter(Boolean))];
  // a question asked on the page (Ask about this, videos-that-make-sense step 3) counts like a word looked up
  const asked = (Array.isArray(rv.questions) ? rv.questions : []).map((q) => String(q?.question || "").trim()).filter(Boolean);
  return { wrong, of: qs.length, walked: cf.walked ?? qs.filter((q) => q.walked).length, looked, termsOpened: Math.max(Number(cf.termsOpened) || 0, looked.length),
    ...(asked.length ? { asked } : {}), approvedMissed: verdictOf(rv) === "approve" && wrong.length > 0 };   // the verdict as actOnMarkdown reads it
}

/** An answer or comment that says the viewer did not follow: the words the memory already reads as asking for more,
 *  and "wdym" or "what do you mean" (videos-that-make-sense: "wdym dropps the video"). */
export const LOST_WORDS = new RegExp(`${ASKS_MORE.source}|\\bwdym\\b|what do you mean|\\bhuh\\b|lost me`, "i");
/**
 * What viewers of this repo's videos were lost on before (videos-that-make-sense step 1), for the next video's
 * newcomer: the words looked up, every "Explain this more" and answer in their own words that asks for more
 * ("wdym"), a comment that says so, each quick check missed (its question), and every question asked on the
 * page (Ask about this). Newest first, once each. → [{ what, words, where }]
 */
export function lostBefore(rp, { limit = 40 } = {}) {
  const out = [], seen = new Set();
  const add = (what, words, where, at) => { words = String(words || "").replace(/\s+/g, " ").trim(); const k = `${what}|${words.toLowerCase()}`; if (!words || seen.has(k)) return; seen.add(k); out.push({ what, words: words.length > 220 ? `${words.slice(0, 219)}…` : words, where, at: at || "" }); };
  const dirs = [...planNames(rp).map((p) => [short(p), join(rp, "plans", p)]), ["the system video", join(rp, "system-video")]];
  for (const [name, dir] of dirs) for (const r of listReviews(dir)) {
    const rv = r.review || {}, where = `${name}, ${r.kind} review`, map = mapFor(dir, r.kind);
    for (const k of lostOf(rv).looked) add("a word looked up", k, where, r.at);
    for (const q of lostOf(rv).asked || []) add("a question asked on the page", q, where, r.at);
    for (const d of rv.decisions || []) {
      if (d.option === "unclear") add("\"Explain this more\" on a question", `${d.question || d.id}${d.note ? ` — "${d.note}"` : ""}`, where, r.at);
      else if (d.option === "own" && LOST_WORDS.test(String(d.label || ""))) add("an answer that asks what it means", `${d.question || d.id} — "${d.label}"`, where, r.at);
    }
    for (const a of rv.annotations || []) if (a.kind !== "approve" && LOST_WORDS.test(String(a.comment || "")) && !/^Flagged: /.test(String(a.comment))) add("a comment", `"${a.comment}"${a.frame?.title ? ` (on "${a.frame.title}")` : ""}`, where, r.at);
    for (const q of checksOf(rv)) {
      const def = (map?.quizzes || []).find((x) => String(x.id).toLowerCase() === String(q.id).toLowerCase()), note = String(q.note || "").trim();
      if (note && LOST_WORDS.test(note)) add("a note on a quick check", `${def?.question ? `${def.question} — ` : ""}"${note}"`, where, r.at);
      else if (q.correct === false && def?.question) add("a quick check missed", def.question, where, r.at);
    }
  }
  return out.sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, limit).map(({ at, ...x }) => x);
}
/**
 * The videos a review shows watched (D-128): the reviewed video, when 80% of it was seen, and each video the
 * reviewer's browser had marked watched, sent with the review as `watched` ([{ video, seen?, sent? }], or
 * the review page's names alone). A video only some chapters of which were played through (`{ video, parts: [5] }`)
 * is not watched, its chapters are: `<video>#part 5`, as a `before:` line names one. → [{ video, at }], once each.
 */
export function watchedOf(rv = {}, { video = null, at = null } = {}) {
  const out = new Map();
  const add = (v, when) => { v = String(v || "").trim(); if (v && !out.has(v)) out.set(v, when || at || null); };
  if (video && (rv.watch?.completion ?? 0) >= WATCHED) add(video, rv.exportedAt || at);
  const list = Array.isArray(rv.watched) ? rv.watched : rv.watched && typeof rv.watched === "object" ? Object.entries(rv.watched).map(([v, w]) => ({ video: v, ...(w || {}) })) : [];
  for (const w of list) {
    if (typeof w === "string") { add(w); continue; }
    const parts = !w?.seen && !w?.sent && Array.isArray(w?.parts) ? w.parts.filter((n) => Number(n) > 0) : [];
    if (parts.length) { if (String(w.video || "").trim()) for (const n of parts) add(`${String(w.video).trim()}#part ${Number(n)}`); }
    else add(w?.video, w?.seen || w?.sent);
  }
  return [...out].map(([v, when]) => ({ video: v, at: when }));
}
/** What your file says you know (D-106, D-128): the videos you watched and the words you looked up, in any repo. */
export function youKnows(facts) {
  const watched = new Map(), looked = new Map();
  for (const f of facts) {
    for (const w of f.watched || []) if (!watched.has(`${f.repo || ""}|${w.video}`)) watched.set(`${f.repo || ""}|${w.video}`, { repo: f.repo || null, video: w.video, at: w.at });
    for (const k of f.lost?.looked || []) looked.set(k, (looked.get(k) || 0) + 1);
  }
  return { watched: [...watched.values()], looked };
}

/** Every plan folder in a .reelplanner, in order (their names start with the date). */
export const planNames = (rp) => (existsSync(join(rp, "plans")) ? readdirSync(join(rp, "plans")).filter((p) => existsSync(join(rp, "plans", p, "plan.md"))).sort() : []);
export const isRetro = (plan) => /^retro/.test(short(plan));

/** The facts of every review in a .reelplanner's plans, oldest first. */
export function repoFacts(rp, { ledger = null, sys = null } = {}) {
  sys ||= readJson(join(rp, "system.json")) || {};
  const out = [];
  for (const p of planNames(rp)) {
    const pd = join(rp, "plans", p);
    ledger ||= ledgerFor(pd);
    const calls = parseCalls(read(join(pd, "walkthrough.md"))), steps = stepComponents(pd, sys);
    for (const r of listReviews(pd)) out.push(reviewFacts(r, { plan: p, map: mapFor(pd, r.kind), calls, ledger, steps }));
  }
  return out.sort((a, b) => String(a.at || "").localeCompare(String(b.at || "")));
}

// The first verdict on each call (a later round re-judges calls; the first is what the agent made).
function firstVerdicts(facts) {
  const seen = new Map();
  for (const f of facts) for (const [id, v] of Object.entries(f.calls || {})) {
    const key = `${f.repo || ""}|${f.plan}|${id}`;
    if (!seen.has(key)) seen.set(key, { plan: f.plan, repo: f.repo, review: f.review, at: f.at, id, verdict: v, ...(f.flagged.find((x) => x.id === id) || {}) });
  }
  return [...seen.values()];
}

// A step rewound (or slowed) in one review of a plan's video, and again in a later review of it: the
// revision between them did not make it plain.
function rewoundAgain(facts) {
  const by = new Map();
  for (const f of facts) for (const s of new Set(f.rewinds.map((m) => m.step))) {
    const key = `${f.repo || ""}|${f.plan}|${f.kind}|${s}`;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(f);
  }
  return [...by.entries()].filter(([, fs]) => new Set(fs.map((f) => f.review)).size > 1)
    .map(([key, fs]) => ({ plan: fs[0].plan, repo: fs[0].repo, kind: fs[0].kind, step: Number(key.split("|").at(-1)), reviews: fs.map((f) => f.review) }));
}

const AFTER_REVIEW = /(?<!["“'])\(\**changed after review/i;
/**
 * When a row's "(changed after review: …)" note first went into the plan's walkthrough.md: the author
 * time (ISO) of the earliest commit that added its words (`git log -S`). null when git does not know it
 * (no repository, or the change not committed yet): then it is newer than every review filed.
 */
export function changedAt(rp, plan, chose) {
  const note = (String(chose).match(new RegExp(`${AFTER_REVIEW.source}:?\\**\\s*([^)]*)`, "i")) || [])[1] || "";
  const needle = note.replace(/\s+/g, " ").trim().slice(0, 60);
  if (!needle) return null;
  try {
    // the walkthrough at either of the record's names (D-312): with -M, the commit that renamed the folder adds no line
    const wt = join("plans", plan, "walkthrough.md"), other = join("..", basename(rp) === RP_DIR ? OLD_RP_DIR : RP_DIR, wt);
    const out = execFileSync("git", ["-C", rp, "log", "-M", "--format=%aI", "--reverse", `-S${needle}`, "--", wt, other], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.split("\n").find(Boolean) || null;
  } catch { return null; }
}
const where = (x) => `${x.repo ? `${x.repo}: ` : ""}${short(x.plan)}`;

/**
 * The memory lines from a list of facts (and, for a repo, its misses). → [{ id, text, evidence: [string] }]
 * The fifth line is the misses for a repo; across repos (`you`), the kinds of call flagged.
 */
export function memoryLines(facts, { misses = null, you = false } = {}) {
  const lines = [];
  const reviewer = (f) => (f.reviewer ? ` · ${f.reviewer}` : "");
  const head = (f, t) => `${where(f)} · ${f.review}${f.at ? ` (${String(f.at).slice(0, 16).replace("T", " ")})` : ""}${reviewer(f)}${t != null ? ` · at ${mmss(t)}` : ""}`;
  // 1. how often a recommendation was taken
  const q = facts.reduce((a, f) => ({ taken: a.taken + f.questions.taken, of: a.of + f.questions.of }), { taken: 0, of: 0 });
  const own = facts.flatMap((f) => f.own.map((o) => ({ f, o })));
  const calls = firstVerdicts(facts), accepted = calls.filter((c) => c.verdict === "accept").length;
  if (q.of || own.length || calls.length) lines.push({ id: "recommended",
    text: `The recommendation taken on ${q.taken} of ${plural(q.of, "question")} answered from the options${own.length ? ` (${own.length} more in your own words)` : ""}; ${accepted} of ${plural(calls.length, "call")} accepted the first time they were judged.`,
    evidence: [
      ...facts.flatMap((f) => f.notTaken.map((n) => `${head(f, n.t)} · ${n.q}${n.id ? ` (${n.id})` : ""} "${n.question}": took "${n.chose}", not the recommendation`)),
      ...calls.filter((c) => c.verdict !== "accept").map((c) => `${where(c)} · ${c.review} · call ${c.id.toUpperCase()} ${c.verdict === "flag" ? "flagged" : "answered in your own words"}${c.tags?.length ? ` [${c.tags.join(", ")}]` : ""}${c.words ? `: "${c.words}"` : ""}`),
      ...facts.filter((f) => f.questions.of || Object.keys(f.calls).length).map((f) => `${head(f)}: ${[f.questions.of ? `${f.questions.taken}/${f.questions.of} recommendations taken` : "", Object.keys(f.calls).length ? `${Object.values(f.calls).filter((v) => v === "accept").length}/${Object.keys(f.calls).length} calls accepted` : ""].filter(Boolean).join(", ")}`),
    ] });
  // 2. the questions answered in the reviewer's own words, and why
  if (own.length) {
    const by = Object.entries(own.reduce((a, { o }) => ({ ...a, [o.why]: (a[o.why] || 0) + 1 }), {}));
    const asked = own.filter(({ o }) => o.words.includes("?")).length, ownCalls = calls.filter((c) => c.verdict === "own").length;
    lines.push({ id: "own-words",
      text: `${plural(own.length, "question")} answered in your own words: ${by.map(([k, n]) => `${REASONS[k] || k} (${n})`).join(", ")}${asked ? `; ${asked} of them ${asked === 1 ? "asks" : "ask"} a question back` : ""}${ownCalls ? `; and ${plural(ownCalls, "call")}` : ""}.`,
      evidence: own.map(({ f, o }) => `${head(f, o.t)} · ${o.q}${o.id ? ` (${o.id})` : ""}, step ${o.step ?? "?"}: "${o.question}" → ${REASONS[o.why]}\n    "${o.words}"`) });
  }
  // 3. steps rewound, and those rewound again after a revision
  const rew = facts.filter((f) => f.rewinds.length), again = rewoundAgain(facts);
  if (rew.length) {
    const steps = new Set(rew.flatMap((f) => f.rewinds.map((m) => `${f.repo}|${f.plan}|${f.kind}|${m.step}`))).size;
    lines.push({ id: "rewinds",
      text: `Rewound or slowed on ${plural(steps, "step")} in ${plural(rew.length, "review")}${again.length ? `; ${again.length} rewound again after a revision: ${again.map((a) => `${where(a)} ${a.kind === "walkthrough" ? "walkthrough " : ""}step ${a.step}`).join(", ")}` : ""}.`,
      evidence: [...again.map((a) => `again: ${where(a)} ${a.kind} step ${a.step}, in ${a.reviews.join(" and ")}`),
        ...rew.flatMap((f) => f.rewinds.map((m) => `${head(f, m.t)} · step ${m.step}: ${m.kind === "slow" ? `slowed to ${m.rate}×` : `went back to ${mmss(m.t)}${m.from != null ? ` from ${mmss(m.from)}` : ""}`}`))] });
  }
  // 4. quick checks answered wrong
  const total = facts.reduce((a, f) => a + (f.checks || 0), 0), wrong = facts.flatMap((f) => f.wrongChecks.map((w) => ({ f, w })));
  if (total) {
    const missed = wrong.filter(({ w }) => !w.correct), noted = wrong.filter(({ w }) => w.note).length;
    lines.push({ id: "checks",
      text: `${missed.length} of ${plural(total, "quick check")} answered wrong${noted ? `, ${noted} with your words` : ""}${missed.length ? `: ${missed.slice(-5).map(({ f, w }) => `${short(f.plan)} ${w.k}`).join(", ")}${missed.length > 5 ? " and earlier" : ""}` : ""}.`,
      evidence: wrong.map(({ f, w }) => `${head(f, w.t)} · ${w.k}, step ${w.step ?? "?"}: "${w.question}" — answered "${w.answered}", the answer is "${w.answer}"${w.note ? `\n    your words: "${w.note}"` : ""}`) });
  }
  // 5. where you got lost, per plan (videos-you-can-follow, step 3; D-129): the checks missed, the explanations
  // opened, the words looked up, and the approvals given with checks missed
  const lostIn = facts.filter((f) => f.lost && (f.lost.wrong.length || f.lost.walked || f.lost.termsOpened || f.lost.asked?.length));
  if (lostIn.length) {
    const walked = lostIn.reduce((a, f) => a + f.lost.walked, 0), opened = lostIn.reduce((a, f) => a + f.lost.termsOpened, 0);
    const words = Object.entries(lostIn.flatMap((f) => f.lost.looked).reduce((a, k) => ({ ...a, [k]: (a[k] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
    const approved = facts.filter((f) => f.lost?.approvedMissed);
    const perPlan = new Map();
    for (const f of lostIn) { const k = where(f); const e = perPlan.get(k) || { wrong: 0, of: 0, approved: false }; e.wrong += f.lost.wrong.length; e.of += f.lost.of; e.approved ||= f.lost.approvedMissed; perPlan.set(k, e); }
    const worst = [...perPlan].filter(([, e]) => e.wrong).sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 3);
    const askedN = lostIn.reduce((a, f) => a + (f.lost.asked?.length || 0), 0);
    const extras = [walked && `${plural(walked, "explanation")} opened`, opened && `${plural(opened, "word")} looked up${words.length ? ` (${words.slice(0, 4).map(([k, n]) => (n > 1 ? `${k} ×${n}` : k)).join(", ")}${words.length > 4 ? ", …" : ""})` : ""}`,
      askedN && `${plural(askedN, "question")} asked on the page`,
      approved.length && `${plural(approved.length, "approval")} with checks missed`].filter(Boolean);
    lines.push({ id: "lost",
      text: `Lost${worst.length ? ` most in ${worst.map(([k, e]) => `${k} (${e.wrong} of ${e.of} checks wrong${e.approved ? ", approved anyway" : ""})`).join(", ")}` : ""}${extras.length ? `${worst.length ? "; " : ": "}${extras.join(", ")}` : ""}.`,
      evidence: lostIn.map((f) => `${head(f)}: ${[f.lost.of ? `${f.lost.wrong.length} of ${f.lost.of} checks wrong${f.lost.wrong.length ? ` (${f.lost.wrong.join(", ")})` : ""}` : "", f.lost.walked ? `${plural(f.lost.walked, "explanation")} opened` : "", f.lost.termsOpened ? `${plural(f.lost.termsOpened, "word")} looked up${f.lost.looked.length ? `: ${f.lost.looked.join(", ")}` : ""}` : "", f.lost.asked?.length ? `${plural(f.lost.asked.length, "question")} asked: ${f.lost.asked.map((x) => `"${x}"`).join(", ")}` : "", f.lost.approvedMissed ? `approved with ${f.lost.wrong.length} of ${f.lost.of} checks missed` : ""].filter(Boolean).join("; ")}`) });
  }
  // 6. misses (a repo), or the kinds of call flagged (you, across repos: the misses need a repo's history)
  if (!you && misses?.length) {
    const recent = misses.filter((m) => m.recent).length;
    lines.push({ id: "misses",
      text: `${plural(misses.length, "miss", "misses")}, let through by a review and changed later${recent ? ` (${recent} recent: a call sharing a label with one pauses)` : ""}: ${misses.map((m) => m.brief).join("; ")}.`,
      evidence: misses.map((m) => `${m.recent ? "recent" : "older"} · ${m.what}\n    let through by: ${m.through}\n    kind: ${m.tags.length ? `tags ${m.tags.join(", ")}` : "no tags"}${m.components.length ? `; components ${m.components.join(", ")}` : ""}\n    shown by: ${short(m.shownIn)}${m.date ? ` (${m.date})` : ""}`) });
  }
  if (you) {
    // every call flagged or answered in own words, in any round (a call accepted first and flagged later counts)
    const seen = new Set(), flagged = facts.flatMap((f) => f.flagged.map((c) => ({ ...c, plan: f.plan, repo: f.repo, review: f.review })))
      .filter((c) => { const k = `${c.repo}|${c.plan}|${c.id}|${c.verdict}`; if (seen.has(k)) return false; seen.add(k); return true; });
    if (flagged.length) {
      const tags = Object.entries(flagged.flatMap((c) => (c.tags?.length ? c.tags : ["untagged"])).reduce((a, t) => ({ ...a, [t]: (a[t] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
      lines.push({ id: "flagged", text: `${plural(flagged.length, "call")} flagged or answered in your own words, by kind: ${tags.map(([t, n]) => `${t} (${n})`).join(", ")}.`,
        evidence: flagged.map((c) => `${where(c)} · ${c.review} · call ${c.id.toUpperCase()} ${c.verdict === "flag" ? "flagged" : "answered in your own words"}${c.tags?.length ? ` [${c.tags.join(", ")}]` : ""}${c.words ? `: "${c.words}"` : ""}`) });
    }
  }
  // 7. after the build (walkthroughs-that-help step 6): how the walkthrough reviews were looked at
  const wf = facts.filter((f) => f.kind === "walkthrough" && f.afterBuild);
  if (wf.length) {
    const a = wf.map((f) => f.afterBuild), timed = wf.filter((f) => f.afterBuild.timed), mids = timed.map((f) => f.afterBuild.held);
    const sum = (k) => a.reduce((n, x) => n + (x[k] || 0), 0), early = a.filter((x) => x.early).length, bar = walkthroughBar(wf);
    lines.push({ id: "after-build",
      text: `${plural(wf.length, "walkthrough review")}: ${timed.length ? `a pause held you ${median(mids).toFixed(1)} s (the middle value, ${plural(timed.length, "review")} timed)` : "no pause timed yet"}; ${plural(sum("flags"), "flag")}, ${sum("own")} in your words, ${plural(sum("comments"), "comment")}; ${early} sent before the video could have played through${a.some((x) => x.conversation) ? `, ${a.filter((x) => x.conversation).length} given in conversation, not in the player` : ""}.${bar.reviews.length ? ` The bar (${BAR.held} s and some words): ${bar.reviews.length - bar.missed} of ${bar.reviews.length} cleared${bar.reviews.length < BAR.reviews ? `, ${BAR.reviews - bar.reviews.length} to go` : ""}.` : ""}`,
      evidence: wf.map((f) => { const x = f.afterBuild; return `${head(f)}: ${x.timed ? `a pause held ${x.held} s (middle of ${x.timed})` : "pauses not timed"}; ${x.flags} flag(s), ${x.own} in your words, ${x.comments} comment(s); ${x.conversation ? "given in conversation, not in the player" : x.sentAfter == null ? "never played" : `sent ${x.sentAfter} s after the first play`}${x.early ? ", before it could have played through" : ""}${x.timed ? `; the bar ${clearsBar(x) ? "cleared" : "missed"}` : ""}`; }) });
  }
  return lines.slice(0, 7);
}

/**
 * What a review let through that was changed later, traced to the question or call that passed it.
 *   superseded  a decision a later decision replaced (the ledger's supersedes / supersededBy)
 *   flagged     an accepted call judged again and flagged or answered in own words (the ledger keeps
 *               every verdict), or a call accepted in review whose row was then changed after review
 *   reworked    a step the walkthrough's quick check showed working otherwise than the reviewer
 *               expected from the plan they approved (they disagreed, in their words), and so reworked:
 *               traced to that step's plan questions
 * → [{ type, what, brief, through, tags, components, shownIn, date, recent }]
 */
export function findMisses(rp, { ledger = null, sys = null, facts = null } = {}) {
  sys ||= readJson(join(rp, "system.json")) || {};
  ledger ||= readJson(join(rp, "decisions.json"))?.decisions || [];
  facts ||= repoFacts(rp, { ledger, sys });
  const plans = planNames(rp), recentPlans = new Set(plans.filter((p) => !isRetro(p)).slice(-RECENT_PLANS));
  const rowsOf = {}, rows = (plan) => (rowsOf[plan] ||= Object.fromEntries(parseCalls(read(join(rp, "plans", plan, "walkthrough.md"))).map((c) => [c.key, c])));
  const callId = (d) => String(d.questionId || "").replace(/^autonomy-/, "");
  const tagsOf = (d) => (d.tags?.length ? d.tags : rows(d.plan)[callId(d)]?.tags || []);
  const out = [];
  for (const d of ledger.filter((x) => x.status === "superseded" && (x.supersededBy || x.supersededByPlan))) {
    const s = d.supersededBy ? ledger.find((x) => x.id === d.supersededBy) : null, by = d.supersededBy || `the plan ${short(d.supersededByPlan)}`;
    const call = d.kind === "autonomy";
    const through = call ? `call ${callId(d).toUpperCase()} of ${short(d.plan)} (${d.id}, accepted: "${d.chosen}")` : `question ${d.questionId} of ${short(d.plan)} (${d.id}: "${d.question}" → ${d.chosen})`;
    if (call && s && s.plan === d.plan && s.questionId === d.questionId) {
      if (s.verdict !== "flag" && s.verdict !== "own") continue;
      out.push({ type: "flagged", what: `${d.id} accepted, then ${s.verdict === "flag" ? "flagged" : "answered in your own words"} as ${s.id}`, brief: `${callId(d).toUpperCase()} of ${short(d.plan)} accepted, then ${s.verdict === "flag" ? "flagged" : "questioned"}`,
        through, tags: tagsOf(d), components: d.components || [], shownIn: s.plan, date: s.date || d.supersededOn || null });
    } else out.push({ type: "superseded", what: `${d.id} superseded by ${by}${s ? ` (${short(s.plan)}: "${s.chosen}")` : ""}`, brief: `${d.id} superseded by ${by}`,
      through, tags: call ? tagsOf(d) : [], components: d.components || [], shownIn: s?.plan || d.supersededByPlan || d.plan, date: d.supersededOn || null });
  }
  // a call the walkthrough review accepted, whose row was then changed after review (the note itself, not
  // a row that quotes it: memory's D1 describes the rule in "(changed after review: …)"). Only an accept
  // made before the change counts: a row changed while its first review left it unjudged, and accepted by
  // a later review as changed, was never let through (explain-first's A9 and A13: listed on 29 Sep,
  // changed that evening in 984b2f3, accepted on 30 Sep)
  const first = firstVerdicts(facts.filter((f) => f.kind === "walkthrough"));
  for (const plan of plans) for (const c of Object.values(rows(plan)).filter((x) => x.kind !== "small" && AFTER_REVIEW.test(x.chose))) {
    const v = first.find((x) => x.plan === plan && x.id === c.key);
    const led = ledger.find((x) => x.plan === plan && x.questionId === `autonomy-${c.key}`);
    if ((v?.verdict ?? (led ? led.verdict || "accept" : null)) !== "accept") continue;   // flagged first: a fix, not a miss
    const changed = changedAt(rp, plan, c.chose);
    if (changed && !(v ? Date.parse(v.at || "") < Date.parse(changed) : String(led?.date || "9") < changed.slice(0, 10))) continue;   // changed before any accept
    if (out.some((m) => m.through.startsWith(`call ${c.id.toUpperCase()} of ${short(plan)} `))) continue;
    const sc = stepComponents(join(rp, "plans", plan), sys)[c.step] || [];
    out.push({ type: "flagged", what: `${c.id} of ${short(plan)} accepted${v ? ` in ${v.review}` : ""}, then changed after review: ${(c.chose.match(new RegExp(`${AFTER_REVIEW.source}:\\**\\s*([^)]*)`, "i")) || [])[1]?.trim() || ""}`,
      brief: `${c.id} of ${short(plan)} accepted, then changed`, through: `call ${c.id.toUpperCase()} of ${short(plan)}${led ? ` (${led.id})` : ""}`, tags: c.tags.filter((t) => t !== "deviation"), components: led?.components || sc, shownIn: plan, date: led?.date || (v?.at || "").slice(0, 10) || null });
  }
  // a walkthrough quick check the reviewer disagreed with: the step the plan review approved worked otherwise
  for (const f of facts.filter((x) => x.kind === "walkthrough")) for (const w of f.wrongChecks.filter((x) => x.note)) {
    const qs = ledger.filter((x) => x.plan === f.plan && x.kind !== "autonomy" && x.step === w.step);
    const comps = [...new Set(qs.flatMap((x) => x.components || []))];
    out.push({ type: "reworked", what: `step ${w.step} of ${short(f.plan)} reworked after the walkthrough's quick check ${w.k} ("${w.question}"): "${w.note}"`, brief: `step ${w.step} of ${short(f.plan)} reworked (${w.k})`,
      through: qs.length ? qs.map((x) => `question ${x.questionId} of ${short(x.plan)} (${x.id}: "${x.question}" → ${x.chosen})`).join("; ") : `step ${w.step} of ${short(f.plan)}, as the plan review approved it`,
      tags: [], components: comps.length ? comps : w.components || [], shownIn: f.plan, date: (f.at || "").slice(0, 10) || null });
  }
  return out.map((m) => ({ ...m, recent: recentPlans.has(m.shownIn) }));
}

/** The last retro (a plan whose slug starts `retro`), and the plans since it. */
export function sinceRetro(rp) {
  const plans = planNames(rp), last = plans.filter(isRetro).at(-1) || null;
  return { last, plans: plans.filter((p) => !isRetro(p) && (!last || p > last)) };
}

/**
 * The signals that can repeat: an own-words reason, a step rewound again, a wrong quick check on a
 * component, a miss of one kind, a call flagged with one tag. Counted over the plans since the last retro.
 */
export function signals(facts, misses, { since = null } = {}) {
  const keep = (plan) => !since || since.includes(plan);
  const f = facts.filter((x) => keep(x.plan)), n = new Map();
  const add = (key, label) => { const e = n.get(key) || { key, label, count: 0 }; e.count++; n.set(key, e); };
  for (const x of f) for (const o of x.own) add(`own-words:${o.why}`, `own words, ${REASONS[o.why]}`);
  for (const a of rewoundAgain(f)) add("rewinds:again", "a step rewound again after a revision");
  for (const x of f) for (const w of x.wrongChecks.filter((y) => !y.correct)) for (const c of w.components) add(`checks:${c}`, `a quick check answered wrong on ${c}`);
  for (const m of misses.filter((y) => keep(y.shownIn))) for (const k of m.tags.length ? m.tags : m.components) add(`misses:${k}`, `a miss of kind ${k}`);
  for (const c of firstVerdicts(f).filter((y) => y.verdict !== "accept")) for (const t of c.tags?.length ? c.tags : []) add(`recommended:${t}`, `a call tagged ${t} flagged or answered in own words`);
  // the same word looked up in a review: three reviews (D-124) and its explanation is not working, so the
  // retro rewrites its scene in the system video, or its glossary row
  for (const x of f) for (const k of x.lost?.looked || []) add(`lost:word:${k}`, `the word "${k}" looked up: its scene in the system video, or its glossary row, needs rewriting`);
  return [...n.values()].sort((a, b) => b.count - a.count);
}

/** The words looked up in three reviews or more since the last retro: [{ word, count }] (step 3's signal). */
export function lostWords(facts, { since = null } = {}) {
  return signals(facts, [], { since }).filter((s) => s.key.startsWith("lost:word:") && s.count >= RETRO_REPEAT).map((s) => ({ word: s.key.slice("lost:word:".length), count: s.count }));
}

/** D-107: is a retro due? → { due, why, last, plans } */
export function retroDue(rp, facts, misses) {
  const { last, plans } = sinceRetro(rp);
  const top = signals(facts, misses, { since: plans }).find((s) => s.count >= RETRO_REPEAT);
  const why = [plans.length >= RETRO_PLANS ? `${plural(plans.length, "plan")} since ${last ? `the last retro (${last})` : "the start (no retro yet)"}` : null,
    top ? `one signal repeated ${top.count} times: ${top.label}` : null].filter(Boolean);
  return { due: why.length > 0, why, last, plans };
}

/** A repo's memory: its lines, its misses and whether a retro is due. */
export function repoMemory(rp) {
  const sys = readJson(join(rp, "system.json")) || {}, ledger = readJson(join(rp, "decisions.json"))?.decisions || [];
  const facts = repoFacts(rp, { ledger, sys }), misses = findMisses(rp, { ledger, sys, facts });
  return { facts, misses, lines: memoryLines(facts, { misses }), retro: retroDue(rp, facts, misses) };
}

// ---- your memory, across repos (D-106) ----

/** Your memory's lines: every review summarised in you.jsonl. */
export function readYou(path = youPath()) {
  return read(path).split("\n").filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
// one review's summary, whichever file holds it: the key appendYou dedups by
const sameReview = (a, b) => a.repo === b.repo && a.plan === b.plan && a.review === b.review;
/** Your memory: your file, plus the summaries still pending in a repo (`pending`, a file path) not yet
 *  in it. */
export const youMemory = (path = youPath(), pending = null) => {
  const facts = readYou(path), more = (pending ? readYou(pending) : []).filter((p) => !facts.some((f) => sameReview(f, p)));
  if (more.length) facts.push(...more), facts.sort((a, b) => String(a.at || "").localeCompare(String(b.at || "")));
  return { facts, lines: memoryLines(facts, { you: true }) };
};
/** The repo a plan folder is in, by its git top level; null outside git (nothing to name it by). */
export function repoName(dir) {
  try { return basename(execFileSync("git", ["-C", dir, "rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()) || null; } catch { return null; }
}

/** Append a review's facts to your file, once. → "added" | "again" | "no-repo"; throws where the file
 *  cannot be written. */
export function appendYou(facts, path = youPath()) {
  if (!facts.repo) return "no-repo";
  if (readYou(path).some((x) => sameReview(x, facts))) return "again";
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, JSON.stringify(facts) + "\n");
  return "added";
}

/** This machine's reviewer, as `reel record` names one by email (git's user.email in the repo), lower case; "" when unset. */
export function gitEmail(dir) {
  try { return execFileSync("git", ["-C", dir, "config", "user.email"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().toLowerCase(); } catch { return ""; }
}
/** Several reviewers (the contributing plan, step 4): a pending line moves only into the file of the reviewer it
 *  names. A reviewer named by an email is you only when it is `me`; a line naming "owner", an id, or nobody moves
 *  as before (one reviewer per repo, where they all are you). */
export const mineToMove = (f, me) => !/@/.test(String(f?.reviewer || "")) || !me || String(f.reviewer).trim().toLowerCase() === me;

/**
 * Move a repo's pending summaries into your file, each once (by appendYou's key), and take them out of
 * the pending file (removed when nothing is left in it). Your file is written before the pending file is
 * touched, so a run that cannot write it throws and leaves the pending file as it was; a pending file
 * that cannot be removed only leaves lines the next move finds already there. → { moved, already }
 */
export function movePending(rp, path = youPath(), me = gitEmail(dirname(rp || "."))) {
  if (!rp || !existsSync(pendingPath(rp))) return { moved: 0, already: 0 };
  const pp = pendingPath(rp);
  const lines = read(pp).split("\n").filter((l) => l.trim()), have = readYou(path), add = [], kept = [];
  let already = 0;
  for (const l of lines) {
    let f; try { f = JSON.parse(l); } catch { kept.push(l); continue; }   // not a summary: left where it is
    if (!mineToMove(f, me)) { kept.push(l); continue; }                     // another reviewer's: it waits for them
    if (have.some((x) => sameReview(x, f)) || add.some((x) => sameReview(x, f))) already++; else add.push(f);
  }
  if (add.length) { mkdirSync(dirname(path), { recursive: true }); appendFileSync(path, add.map((f) => JSON.stringify(f) + "\n").join("")); }
  if (kept.length) writeFileSync(pp, kept.join("\n") + "\n"); else rmSync(pp, { force: true });
  return { moved: add.length, already };
}

/**
 * What `reel record` does with a review's facts (D-106; A15 as the owner answered it): first move any
 * pending summaries of this repo into your file, then add this one. Where your file cannot be written
 * (a run fenced to the repo by D-082's sandbox, a read-only home), the summary goes to the repo's
 * pending file instead, once, to be moved in by the next run that can.
 * → { status: "added" | "again" | "no-repo" | "pending" | "pending-again" | "lost", moved, error }
 */
export function recordYou(facts, rp, path = youPath()) {
  if (!facts.repo) return { status: "no-repo", moved: 0 };
  let moved = 0;
  try {
    ({ moved } = movePending(rp, path));
    return { status: appendYou(facts, path), moved };
  } catch (error) {
    let there = false; try { there = readYou(path).some((x) => sameReview(x, facts)); } catch { /* unreadable too */ }
    if (there) return { status: "again", moved, error };
    if (!rp) return { status: "lost", moved, error };
    const pp = pendingPath(rp);
    if (readYou(pp).some((x) => sameReview(x, facts))) return { status: "pending-again", moved, error };
    try { appendFileSync(pp, JSON.stringify(facts) + "\n"); } catch (e2) { return { status: "lost", moved, error: e2 }; }
    return { status: "pending", moved, error };
  }
}
