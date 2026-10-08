// A plan's reviews, each kept once and every round kept (D-085).
//
//   <plan-dir>/reviews/<kind>-<time>.json   the review as the player exported it, plus the reviewer's
//                                            note when it came with one. Never overwritten.
//   <plan-dir>/reviews/<kind>-<time>.md     what to act on (lib/review-scope.mjs writes it; `reel record`
//                                            runs it): short, and the only thing a revise or a fix reads
//
// <kind> is `plan` or `walkthrough` (or `explainer`, in an explainer's folder: explain-first step 3); <time> is when the reviewer finished (the row's submittedAt, else
// the export's exportedAt), in the inbox's own id form (lib/inbox.mjs `reviewId`). The same review filed
// again is the same file; another review under the same name takes the next free one (-2, -3 …). The
// system video's reviews/ is filed the same way (system-review).
//
// plan.md and walkthrough.md stay the living documents; the plan's chosen options are in the ledger
// (decisions.md shows them). An annotations.json an older handoff left in the plan folder is filed here by
// `reel record`.
//
// `planStage` is the one check of where a plan stands (reel status, the review page's library and its
// "needs you" list). It reads the plan's files, reviews/ and the ledger, never a resolved copy.
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, basename, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";
import { reviewId } from "./inbox.mjs";
import { VERSION } from "./env.mjs";

export const reviewsDir = (dir) => join(dir, "reviews");
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

/** The review inside a hosted or inbox row, or a bare export as it is. */
export const reviewOf = (row) => (row && typeof row === "object" && row.review && typeof row.review === "object" ? row.review : row);

/** "plan" or "walkthrough". The video it came from says so: the export's `project` or the row's, else its
 *  src (a walkthrough's slug ends "--walkthrough" and its folder is walkthrough-video/; a plan video is its
 *  plan's slug, or a video/ folder). Plan videos ask quick checks too, so contents decide only for a src that
 *  says neither (a one-off videos/<name>/): calls on the agent's choices mean a walkthrough, and so do quick
 *  checks with no plan question beside them. */
export function reviewKind(review, row = null) {
  const p = row?.project ?? review?.project;
  if (p === "walkthrough-video") return "walkthrough";
  if (p === "video") return "plan";
  const src = String(review?.src || "");
  if (/--walkthrough(?:\/|$)|(?:^|\/)walkthrough-video(?:\/|$)/.test(src)) return "walkthrough";
  if (/^[^/.][^/]*\/index\.html$|(?:^|\/)video\/index\.html$/.test(src)) return "plan";
  return (review?.autonomy || []).length > 0 || ((review?.quizzes || []).length > 0 && !(review?.decisions || []).length) ? "walkthrough" : "plan";
}

/** When the reviewer finished: an ISO time, or null. */
export const reviewTime = (review, row = null) => row?.submittedAt || review?.submittedAt || review?.exportedAt || null;

// An answer in the reviewer's own words that only asks for more ("what does it mean? need more first")
// is "Explain this more", not a decision: nothing enters the ledger, and the question is asked again.
// Words that also name an option ("B, but explain it in the docs") stay an answer.
export const ASKS_MORE = /confus|more info|need more|what (?:is|are|does|do)\b|explain|not sure|don'?t (?:get|understand)|unclear/i;
export const NAMES_OPTION = /\b(?:[Oo]ption|of|with|pick|choose|take|like)\s+[A-D]\b|^\s*[A-D]\b[,.:)]/;
export const asksMore = (d) => d?.option === "unclear" || (d?.option === "own" && ASKS_MORE.test(String(d.label || "")) && !NAMES_OPTION.test(String(d.label || "")));
export const askedWords = (d) => String(d?.note || "").trim() || (d?.option === "own" ? String(d.label || "").trim() : "");
/** "approve", "changes" or null (not finished), as the player's Finish sets it. */
export const verdictOf = (review) => review?.verdict || ((review?.annotations || []).some((a) => a.kind === "approve") ? "approve" : null);

// the stamp (who, which version) is not part of what the review says: the same review filed again,
// by another person's intake or after an upgrade, is still the same review
const bare = (o) => { const { recorded, ...rest } = o || {}; return rest; };
const same = (a, b) => { try { return JSON.stringify(bare(JSON.parse(a))) === JSON.stringify(bare(JSON.parse(b))); } catch { return a === b; } };

/**
 * Who reviewed, and which reelplanning recorded it (memory, step 1): { reviewer, via, reelplanning }.
 * The reviewer is the page's viewer when the row (or the export) names one, else git's user.email where
 * the review is recorded; reelplanning is this package's version. A field it cannot tell is left out.
 * The hosted page sends `viewer: { id, owner }` (the Artifact's `user` capability): the page's owner
 * is "owner", the repo's owner reviewing their own page (the "you" of ~/.reelplanning/you.jsonl); anyone
 * else is `id:<opaque id>`, an id only, never a name. A plain string (an older row) is kept as it is.
 * The id is kept as `id` too ("id:<id>"), the owner's included: "owner" is whoever published the page, on
 * anyone's page, where the id is one person in the organization, which config.json's `maintainers` lists.
 * A review given in conversation is recorded `via: "conversation"`, by the `by` it names.
 */
export function recordedBy(dir, { row = null, review = null } = {}) {
  // A review given in conversation (`source: "conversation"`: the person's words to an agent, not the player): the agent
  // names who in `by`, as config.json's maintainers lists them ("id:<id>"). No page sent it, and no git email stands in.
  if ((row?.source ?? review?.source) === "conversation") {
    const by = String(row?.by ?? review?.by ?? "").trim();
    return { ...(by ? { reviewer: by, ...(by.startsWith("id:") ? { id: by } : {}) } : {}), via: "conversation", reelplanning: VERSION };
  }
  const v = row?.viewer ?? review?.viewer, viewer = viewerOf(v), id = viewerId(v);
  let email = "";
  if (!viewer) try { email = execFileSync("git", ["-C", existsSync(dir) ? dir : dirname(dir), "config", "user.email"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { /* no git, or no email set */ }
  const who = viewer || email;
  return { ...(who ? { reviewer: who, ...(id ? { id } : {}), via: viewer ? "the page's viewer" : "git user.email" } : {}), reelplanning: VERSION };
}
// the row's viewer id, as "id:<id>", or ""
const viewerId = (v) => (v && typeof v === "object" && typeof v.id === "string" && v.id.trim() ? `id:${v.id.trim()}` : "");
// the row's `viewer`, as the reviewer to record: "owner", "id:<id>", an older row's string (or email), else ""
function viewerOf(v) {
  if (typeof v === "string") return v.trim();
  if (!v || typeof v !== "object") return "";
  if (v.owner === true) return "owner";
  const id = typeof v.id === "string" ? v.id.trim() : "";
  return id ? `id:${id}` : String(v.email || "").trim();
}

/**
 * File a review under <dir>/reviews/ as <id>.json, never over another one. `id` is the name to use (the
 * system video's), else `<kind>-<time>`. → { id, path, again }: `again` when this very review was filed
 * before (the same content under that name, whoever recorded it), in which case nothing is written. The
 * filed copy carries `recorded` (recordedBy): the reviewer and the reelplanning version. `row` is the
 * hosted or inbox row it came in, for the page's viewer; `stamp: false` files an old review as it was
 * (migrate-reviews: who recorded it then is not known).
 */
export function fileReview(dir, review, { kind = "review", id = null, at = null, note = "", row = null, stamp = true } = {}) {
  const d = reviewsDir(dir);
  // every review filed from now on says who and which version (a review already filed stays as it is)
  const body = { ...review, ...(String(note || "").trim() && !review.note ? { note: String(note).trim() } : {}), ...(stamp || review.recorded ? { recorded: review.recorded || recordedBy(dir, { row, review }) } : {}) };
  const text = JSON.stringify(body, null, 2) + "\n";
  const base = String(id || reviewId({ project: kind, submittedAt: at || review.submittedAt || review.exportedAt }))
    .replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[.-]+/, "") || "review";
  for (let i = 1; i < 1000; i++) {
    const name = i === 1 ? base : `${base}-${i}`, path = join(d, `${name}.json`);
    if (!existsSync(path)) { mkdirSync(d, { recursive: true }); writeFileSync(path, text); return { id: name, path, again: false }; }
    if (same(readFileSync(path, "utf8"), text)) return { id: name, path, again: true };
  }
  throw new Error(`too many reviews named ${base}`);
}

/** Every review filed in <dir>/reviews/, oldest first: { id, kind, at, path, md, review }. */
export function listReviews(dir) {
  const d = reviewsDir(dir);
  if (!existsSync(d)) return [];
  return readdirSync(d).filter((f) => f.endsWith(".json")).map((f) => {
    const id = f.slice(0, -5), path = join(d, f), review = readJson(path) || {};
    // an explainer's review (explain-first step 3) is filed as explainer-<time>: its own kind, never a plan's
    const kind = /^walkthrough-/.test(id) ? "walkthrough" : /^plan-/.test(id) ? "plan" : /^explainer-/.test(id) ? "explainer" : reviewKind(review);
    return { id, kind, at: reviewTime(review), path, md: join(d, `${id}.md`), review };
  }).sort((a, b) => String(a.at || "").localeCompare(String(b.at || "")) || a.id.localeCompare(b.id));
}

/** The ledger a plan directory records into (<.reelplanning>/decisions.json), as a list. */
export function ledgerFor(planDir) {
  const L = readJson(join(dirname(dirname(planDir)), "decisions.json"));
  return Array.isArray(L) ? L : L?.decisions || [];
}

/** When a plan was approved: the time (ISO) of its last plan review, when that review approved it; else
 *  null — never reviewed, or its last plan review asked for changes or gave no verdict (the plan is
 *  being made again, and answers to the ledger as it is now). */
export function approvedAt(planDir) {
  const last = listReviews(planDir).filter((r) => r.kind === "plan").at(-1);
  return last && verdictOf(last.review) === "approve" ? last.at || null : null;
}

/** The ledger as it stood on `day` (YYYY-MM-DD, a plan's approval): the decisions dated on or before it,
 *  each with the status it had then (one superseded by a decision left out was still active). No day: as
 *  it is. A decision carries its day only, so with `plan` (the approved plan's folder name) that day is
 *  cut where its approving review wrote the plan's answers into the ledger: `reel record` appends, so an
 *  entry after the plan's last answer of that day came later that day (another plan's review, say). */
export function ledgerAsOf(ledger, day, { plan = null } = {}) {
  if (!day) return ledger;
  const lastOwn = plan ? ledger.findLastIndex((d) => d.plan === plan && d.kind !== "autonomy" && String(d.date) === day) : -1;
  const kept = ledger.filter((d, i) => !d.date || String(d.date) < day || (String(d.date) === day && (lastOwn < 0 || i <= lastOwn)));
  const ids = new Set(kept.map((d) => d.id));
  // superseded by a plan as a whole (no one decision of it: `supersededByPlan`): before `day`; or on it, where the whole
  // day is kept, where `plan` is that plan, or once that plan's last entry of the day is kept (its review recorded the
  // supersede with its answers). A plan with no entry that day (a review that added none) is taken to have come first.
  const wholeThen = (d) => { const on = String(d.supersededOn || ""); if (on !== day) return on < day;
    if (lastOwn < 0 || d.supersededByPlan === plan) return true;
    const last = ledger.findLast((x) => x.plan === d.supersededByPlan && String(x.date) === on);
    return last ? ids.has(last.id) : true; };
  return kept.map((d) => {
    // folded into spec.md after `day` (D-306): then it was a rule cited by its id
    if (d.status === "folded" && String(d.foldedOn || "") > day) { const { foldedInto, foldedOn, ...then } = d; return { ...then, status: "active" }; }
    if (d.status !== "superseded" ||(d.supersededBy ? ids.has(d.supersededBy) : !d.supersededByPlan || wholeThen(d))) return d;
    const { supersededBy, supersededByPlan, supersededOn, ...then } = d;
    return { ...then, status: "active" };
  });
}

/** The commit walkthrough.md says the build started from ("**Started from:** `823df31`"), or null. */
export function startedFrom(planDir) {
  const p = join(planDir, "walkthrough.md");
  if (!existsSync(p)) return null;
  return (readFileSync(p, "utf8").match(/\*\*Started from:\*\*\s*`([0-9a-f]{7,40})`/i) || [])[1] || null;
}

/**
 * The ledger a plan answers to (`reel check`), and why: { ledger, by, day, sha }.
 *   by "review"   its last plan review approved it: the ledger as it stood that day (ledgerAsOf)
 *   by "started"  no approving plan review (approved in conversation), but built: walkthrough.md's
 *                 "Started from" commit, and decisions.json as it was in that commit
 *   by null       neither, or no git to read the commit with: the ledger as it is
 */
export function approvalOf(planDir, ledger) {
  const at = approvedAt(planDir);
  if (at) { const day = String(at).slice(0, 10); return { ledger: ledgerAsOf(ledger, day, { plan: basename(planDir) }), by: "review", day, sha: null }; }
  const sha = startedFrom(planDir);
  if (sha) try {
    const git = (...a) => execFileSync("git", ["-C", planDir, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 });
    const top = git("rev-parse", "--show-toplevel").trim();
    const rel = relative(top, join(dirname(dirname(planDir)), "decisions.json")).split(sep).join("/");
    const then = JSON.parse(git("show", `${sha}:${rel}`)), day = git("show", "-s", "--format=%cI", sha).trim().slice(0, 10);
    const old = Array.isArray(then) ? then : then?.decisions;
    if (Array.isArray(old)) return { ledger: old, by: "started", day, sha };
  } catch { /* no git, an unknown commit, or no decisions.json in it: the ledger as it is */ }
  return { ledger, by: null, day: null, sha: null };
}

// A plan's questions still open: its plan video asks them and the ledger has no answer. Matched on the
// question's words, not its id: ids are the plan's question numbers and come round again when a plan
// is revised (the revise loop's first q2 was answered as D-065; its round 2 asks a new q2).
const norm = (q) => String(q || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
export function openQuestions(planDir, map, ledger = ledgerFor(planDir)) {
  // the agent's calls are in the ledger too, flagged ones included (step 8); none of them is a plan question
  const asked = new Set(ledger.filter((x) => basename(String(x.plan || "")) === basename(planDir) && x.status !== "superseded" && x.kind !== "autonomy").map((x) => norm(x.question)));
  return (map?.decisions || []).filter((q) => !asked.has(norm(q.question)));
}

/** What a walkthrough review asks to be changed: calls flagged or answered in the reviewer's own words,
 *  and quick checks they disagreed with. */
export const fixesIn = (review) => (review?.autonomy || []).filter((v) => v.verdict === "flag" || v.verdict === "own").length
  + (review?.quizzes || []).filter((q) => String(q.note || "").trim()).length;

/** When a file or folder last changed, in seconds: its last commit, or now when it has uncommitted changes.
 *  `skip`: paths inside a folder that do not count (its renders/, say). */
export function lastChanged(p, skip = []) {
  if (!existsSync(p)) return 0;
  const spec = ["--", p, ...skip.map((x) => `:(exclude)${join(p, x)}`)], git = (...a) => execFileSync("git", ["-C", dirname(p), ...a, ...spec], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    if (git("status", "--porcelain")) return Date.now() / 1000;
    return Number(git("log", "-1", "--format=%ct")) || statSync(p).mtimeMs / 1000;
  } catch { return statSync(p).mtimeMs / 1000; }
}
const secs = (iso) => (iso ? Date.parse(iso) / 1000 || 0 : 0);

/**
 * Where a plan stands. { stage, label, decided, approved, open, fixes, newRound, reviews: { plan, walkthrough }, lastPlan, lastWalk }
 *
 *   planned              plan.md, no plan video yet
 *   plan video to review the plan video is built and nobody has reviewed it
 *   questions open       reviewed, but the plan video asks a question the ledger has no answer to
 *   changes requested    the last plan review asked for changes: revise
 *   reviewed             the last plan review ended with no verdict (neither approved nor changes asked)
 *   approved             the last plan review approved and every question is answered: build it
 *   built                walkthrough.md written, no walkthrough video yet
 *   walkthrough to review
 *   fixes to make        the last walkthrough review flagged calls or disagreed with a check
 *   fixed                …and the walkthrough video was rebuilt after it (the reviewer may rewatch)
 *   accepted             the last walkthrough review asked for no change
 *
 * A plan reviewed again after its walkthrough was (a new round of steps) stands where that plan review
 * leaves it, until its own walkthrough is reviewed.
 */
/**
 * Whether the reviewer chose no walkthrough video for this plan: a line in walkthrough.md that says
 * `**Walkthrough video:** skipped` (the reason after it is theirs). The code check and walkthrough.md stay.
 */
export function walkthroughSkipped(planDir) {
  try { return /^\*\*Walkthrough video:\*\*\s*skipped\b/im.test(readFileSync(join(planDir, "walkthrough.md"), "utf8")); } catch { return false; }
}

export function planStage(planDir, { ledger = ledgerFor(planDir) } = {}) {
  const has = (f) => existsSync(join(planDir, f));
  const all = listReviews(planDir), plans = all.filter((r) => r.kind === "plan"), walks = all.filter((r) => r.kind === "walkthrough");
  const lastPlan = plans.at(-1) || null, lastWalk = walks.at(-1) || null;
  const open = openQuestions(planDir, readJson(join(planDir, "video", "plan-map.json")), ledger);
  const newRound = !!(lastPlan && lastWalk && String(lastPlan.at || "") > String(lastWalk.at || ""));
  const decided = !!lastPlan && !open.length, approved = decided && verdictOf(lastPlan.review) === "approve";
  const fixes = lastWalk ? fixesIn(lastWalk.review) : 0;
  let stage, label;
  if (has("walkthrough.md") && !newRound) {
    if (!lastWalk) [stage, label] = has("walkthrough-video/index.html") ? ["walkthrough to review", "walkthrough to review"]
      // the reviewer said no walkthrough video for this plan: walkthrough.md says so, and the plan is done once built
      : walkthroughSkipped(planDir) ? ["done", "built: walkthrough video skipped"] : ["built", "built: walkthrough video next"];
    else if (!fixes) [stage, label] = ["accepted", "accepted"];
    else if (lastChanged(join(planDir, "walkthrough-video", "plan-map.json")) > secs(lastWalk.at) + 60) [stage, label] = ["fixed", `fixed after review (${fixes} change${fixes > 1 ? "s" : ""})`];
    else [stage, label] = ["fixes to make", `${fixes} fix${fixes > 1 ? "es" : ""} to make`];
  } else if (lastPlan) {
    if (open.length) [stage, label] = ["questions open", `${open.length} question${open.length > 1 ? "s" : ""} open`];
    else if (approved) [stage, label] = ["approved", newRound ? "approved: the new round to build" : "approved: build it"];
    else if (verdictOf(lastPlan.review) === "changes") [stage, label] = ["changes requested", "changes requested: revise"];
    else [stage, label] = ["reviewed", "reviewed, not approved"];
  } else [stage, label] = has("video/index.html") ? ["plan video to review", "plan video to review"] : ["planned", "planned: no video yet"];
  return { stage, label, decided, approved, open, fixes, newRound, reviews: { plan: plans.length, walkthrough: walks.length }, lastPlan, lastWalk };
}
