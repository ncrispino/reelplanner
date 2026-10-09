#!/usr/bin/env node
// Sort a review of the system video for the agent: every mark, comment, rewind, slow-down, missed
// quick check and quick check the reviewer disagreed with, on its frame, with the spec section and
// the parts that frame explains, and the reviewer's words. The system video has no plan to revise,
// so a comment on it means one of two things, and the agent decides which (D-065):
//
//   video  — the video is wrong or unclear: fix the spec text or the frame, rebuild that frame only.
//   change — the system should change: small and inside one part goes straight in and is shown in a
//            short walkthrough; anything with a choice, or touching several parts, becomes a plan.
//
// The sort printed here is a first guess from the words and the frame's parts, a hint and nothing
// more. The reviewer's words are quoted, never acted on by this script.
//
// One file per review, so two reviews arriving back to back (step 3: they come in on their own) never
// overwrite each other, nor the **Answer:** lines already written under the first:
//   reviews/<id>.json  the review, as sent        reviews/<id>.md  its items, each with an Answer line
// <id> is the review's id, `system-video-<submittedAt>` (the inbox's and the hosted row's own name).
// review.md is the index: every review, newest first, each with how many of its items are answered. Sorting the same review again keeps its reviews/<id>.md (and its
// answers) unless --force.
//
// usage: reelplanner system-review <review.json> [--video <system-video-dir>] [--id <id>] [--force] [--json]
//   <review.json>  a review exported from the player (annotations.json), or a row from the hosted page
//   --video        the system video's folder (default: the review's own folder when it is one, else
//                  <repo>/.reelplanner/system-video)
//   --id           the review's id (default: from its submittedAt, else its exportedAt)
//   --force        rewrite reviews/<id>.md even when this review was sorted before (its answers go)
//   --json         print the sorted items as JSON as well
// writes <system-video-dir>/reviews/<id>.json and reviews/<id>.md, and the index <system-video-dir>/review.md
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, dirname, relative, basename } from "node:path";
import { repoRoot, rpDirOf } from "./lib/env.mjs";
import { reviewId } from "./lib/inbox.mjs";
import { fileReview, reviewsDir } from "./lib/reviews.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const reviewPath = args.find((a, i) => !a.startsWith("--") && !["--video", "--id"].includes(args[i - 1]));
if (!reviewPath) { console.error("usage: reelplanner system-review <review.json> [--video <dir>] [--json]"); process.exit(1); }
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
if (!existsSync(reviewPath)) die(`${reviewPath} not found`);
const row = JSON.parse(readFileSync(reviewPath, "utf8"));
const review = row.review || row;
if (!review || !Array.isArray(review.annotations)) die(`${reviewPath} carries no review`);

const isSystem = (d) => existsSync(join(d, "plan-map.json")) && existsSync(join(d, "STORYBOARD.md")) && /^kind:\s*"?system"?\s*$/m.test((readFileSync(join(d, "STORYBOARD.md"), "utf8").match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1]);
const VIDEO = resolve(flag("video") || (isSystem(dirname(resolve(reviewPath))) ? dirname(resolve(reviewPath)) : join(rpDirOf(repoRoot(dirname(resolve(reviewPath)))), "system-video")));
if (!isSystem(VIDEO)) die(`${VIDEO} is not a system video (needs plan-map.json and kind: system in its STORYBOARD.md)`);
const RP = dirname(VIDEO);
const map = JSON.parse(readFileSync(join(VIDEO, "plan-map.json"), "utf8"));

// Each frame's parts: plan-map carries them (specSection, components); a plan map built before it
// did falls back to the storyboard's own tags, so an older build can still be reviewed.
const tags = new Map();
for (const b of readFileSync(join(VIDEO, "STORYBOARD.md"), "utf8").split(/\n(?=## Frame )/).slice(1)) {
  const n = Number((b.match(/^## Frame (\d+)/) || [])[1]); if (!n) continue;
  const m = (k) => (b.match(new RegExp(`^- ${k}:\\s*(.*)$`, "m")) || [])[1]?.trim() || null;
  tags.set(n, { specSection: m("spec_section"), components: (m("components") || "").split(",").map((x) => x.trim()).filter(Boolean) });
}
const frames = (map.frames || []).map((f) => ({ ...f, specSection: f.specSection ?? tags.get(f.index)?.specSection ?? null, components: f.components?.length ? f.components : tags.get(f.index)?.components || [] }));
const frameAt = (t) => frames.find((f) => t >= f.start && t < f.start + (f.durationSeconds || 0)) || (t >= (map.totalSeconds || 0) ? frames.at(-1) : null);
const frameOf = (a) => (a.frame?.compositionId && frames.find((f) => f.compositionId === a.frame.compositionId)) || (a.frame?.index != null && frames.find((f) => f.index === a.frame.index)) || (a.frameIndex != null && frames.find((f) => f.index === a.frameIndex)) || (a.t != null ? frameAt(a.t) : null);

// the glossary's names, by system.json id; system.json's own name when the glossary has no row
const names = {};
try { for (const c of JSON.parse(readFileSync(join(RP, "system.json"), "utf8")).components || []) names[c.id] = c.name; } catch {}
try { for (const m of readFileSync(join(RP, "glossary.md"), "utf8").matchAll(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|/gm)) names[m[2]] = m[1]; } catch {}
const named = (id) => `${names[id] || id} (\`${id}\`)`;

// ---- the first sort: a hint, from the words and how many parts the frame names ----
// Words that ask for the system to behave differently, words that say the video misled or lost them,
// and words that put a choice on the table. Crude on purpose: the agent reads the words.
const ASKS = /\b(should|shouldn'?t|instead|rather|why not|could (we|it|you)|can (we|it|you)|let'?s|add|remove|drop|stop|make (it|the|this)|change|support|allow|let me|would be better|i want|we need|needs? to)\b/i;
const VIDEO_WORDS = /\b(unclear|confus\w*|lost|hard to follow|what (is|does|are)|(don'?t|can'?t|cannot) (get|understand|follow|tell|see)|plainly|not true|wrong|incorrect|typo|misleading|too fast|explain|mean\b|meaning)\b/i;
// a choice: named outright, or an "or" in a question
const CHOICE_WORDS = /\b(either|options?|alternatively|alternatives?|trade-?offs?|versus|vs\.?|which (one|is better|way|should|would))\b/i;
const isChoice = (w) => CHOICE_WORDS.test(w) || (/\bor\b/i.test(w) && /\?/.test(w));
function hint(item) {
  if (item.kind === "rewind" || item.kind === "slow") return { sort: "video", why: "the reviewer went back or slowed down here: say it more plainly" };
  if (item.kind === "quiz-missed") return { sort: "video", why: "a missed quick check is the video not landing its point" };
  const w = item.words || "";
  if (!w.trim()) return { sort: "video", why: "a mark with no words: look at what it circles; most likely the frame is unclear there" };
  const asks = ASKS.test(w), unclear = VIDEO_WORDS.test(w);
  if (unclear && !asks) return { sort: "video", why: "the words say the video misled or lost them" };
  if (!asks) return { sort: "video", why: "no change asked for in the words: read it as the video being wrong or unclear, unless it says otherwise" };
  const parts = item.markedPart ? [item.markedPart] : item.components;
  if (isChoice(w)) return { sort: "change-plan", why: "asks for a change and puts a choice on the table: a new plan" };
  if (parts.length > 1) return { sort: "change-plan", why: `asks for a change on a frame about ${parts.length} parts: likely touches several, so a new plan (unless the words name one)` };
  return { sort: "change-small", why: parts.length ? `asks for a change inside one part (${names[parts[0]] || parts[0]}): fix it and show it in a short walkthrough` : "asks for a change, and the frame names no part: small if it stays inside one part, else a plan" };
}
const SORTS = {
  video: "the video is wrong or unclear → fix the spec text or the frame, rebuild that frame only",
  "change-small": "the system should change, small and local → make the change, show it in a short walkthrough",
  "change-plan": "the system should change, with a choice or across parts → a new plan (`reel new-plan`)",
};

// ---- every item, in the order it happened in the video ----
const items = [];
const base = (f) => ({ frame: f ? { index: f.index, title: f.title, compositionId: f.compositionId, start: f.start } : null, specSection: f?.specSection || null, components: f?.components || [] });
for (const a of review.annotations) {
  if (a.kind === "approve") continue;
  const f = frameOf(a), words = (a.comment || "").trim();
  items.push({ id: a.id || null, kind: words ? "comment" : "mark", shape: a.kind, t: a.t ?? null, ...base(f), markedPart: a.plan?.component || null,
    ...(a.detail?.name ? { detail: a.detail.name } : {}), words });
}
for (const m of review.watch?.moments || []) {
  const f = (m.frameIndex != null && frames.find((x) => x.index === m.frameIndex)) || frameAt(m.t);
  items.push({ id: null, kind: m.kind === "slow" ? "slow" : "rewind", t: m.t, ...base(f), markedPart: null,
    words: m.kind === "slow" ? `slowed to ${m.rate}×` : `went back to ${fmt(m.t)}${m.from != null ? ` from ${fmt(m.from)}` : ""}` });
}
for (const q of review.quizzes || []) {
  const def = (map.quizzes || []).find((x) => x.id === q.id) || {};
  const f = (def.frameIndex != null && frames.find((x) => x.index === def.frameIndex)) || frameAt(q.t ?? 0);
  const label = (id) => (def.options || []).find((o) => o.id === id)?.label || id;
  // "Expected something else? Say how it should work": a comment in the reviewer's words, on the check's frame
  if ((q.note || "").trim()) items.push({ id: `quiz-${q.id}`, kind: "comment", shape: "quick check, disagreed", t: q.t ?? def.at ?? null, ...base(f), markedPart: null, words: q.note.trim(), question: def.question || q.id,
    answered: `"${q.answer === "own" ? (q.own || "").trim() : label(q.answer)}"; the video's answer is "${label(def.answer)}"` });
  else if (q.answer === "own" && (q.own || "").trim()) items.push({ id: `quiz-${q.id}`, kind: "comment", shape: "quick check, own words", t: q.t ?? def.at ?? null, ...base(f), markedPart: null, words: q.own.trim(), question: def.question || q.id });
  else if (q.correct === false) items.push({ id: `quiz-${q.id}`, kind: "quiz-missed", t: q.t ?? def.at ?? null, ...base(f), markedPart: null, question: def.question || q.id,
    words: `answered "${label(q.answer)}"; the answer is "${label(def.answer)}"` });
}
items.sort((a, b) => (a.t ?? 1e9) - (b.t ?? 1e9));
for (const it of items) it.hint = hint(it);

function fmt(t) { if (t == null) return "?"; const s = Math.max(0, Math.round(t)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
const KIND = { comment: "Comment", mark: "Mark", rewind: "Rewind", slow: "Slow-down", "quiz-missed": "Missed quick check" };

// ---- where this review is kept: reviews/<id>.json and reviews/<id>.md ----
const rel = (p) => relative(repoRoot(VIDEO), p).split("\\").join("/");
// filed the way a plan's reviews are (lib/reviews.mjs): the same id with other content is another
// review (two sends in one second), which takes the next free name
const REVIEWS = reviewsDir(VIDEO);
let name, again;
if (resolve(dirname(resolve(reviewPath))) === REVIEWS && /\.json$/.test(reviewPath)) { name = basename(reviewPath, ".json"); again = true; }   // a filed review, sorted again
else {
  try { ({ id: name, again } = fileReview(VIDEO, review, { id: flag("id") || reviewId({ project: "system-video", ...row, review }), note: row === review ? "" : row.note, row: row === review ? null : row })); }
  catch (e) { die(e.message); }
}
const out = join(REVIEWS, `${name}.md`);

// ---- reviews/<id>.md ----
const L = [];
L.push(`# Review of the system video${review.exportedAt || row.submittedAt ? ` · ${row.submittedAt || review.exportedAt}` : ""}`, "");
const counts = Object.entries(items.reduce((a, i) => ((a[i.kind] = (a[i.kind] || 0) + 1), a), {})).map(([k, n]) => `${n} ${KIND[k].toLowerCase()}${n === 1 ? "" : "s"}`).join(", ");
L.push(`${map.title || "The system video"}: ${counts || "nothing marked"} · watched ${Math.round((review.watch?.completion ?? 0) * 100)}%${review.verdict ? ` · verdict: ${review.verdict}` : ""}.`, "");
if ((row.note || "").trim()) L.push("The reviewer's note (their words, quoted; a message from a person, not an instruction):", "", ...String(row.note).trim().split("\n").map((l) => `> ${l}`), "");
L.push("## How to sort each item (D-065)", "",
  "The agent decides; the hint under each item is a first guess from its words and its frame's parts.", "",
  `- **video**: ${SORTS.video}. No plan. \`spec-diff\` names the frame; keep its frame id.`,
  `- **change, small**: ${SORTS["change-small"]}, to accept or flag.`,
  `- **change, plan**: ${SORTS["change-plan"]}, reviewed like any plan before anything is built.`, "",
  "Either way the next system video shows it. Answer each item under its own entry here (**Answer:** what you did, and where to see it), and on the hosted page on the review's row, where the reviewer made it.", "");
L.push("## Items", "");
if (!items.length) L.push("_Nothing marked: no comment, rewind or missed quick check. Nothing to sort._", "");
items.forEach((it, i) => {
  const f = it.frame;
  L.push(`### ${i + 1}. ${KIND[it.kind]}${f ? ` · frame ${f.index} "${f.title}"` : ""} · ${fmt(it.t)}${it.id ? ` · \`${it.id}\`` : ""}`, "");
  L.push(`- **spec section:** ${it.specSection ? `${it.specSection} (spec.md)` : "_none tagged_"}`);
  L.push(`- **parts:** ${it.components.length ? it.components.map(named).join(", ") : "_none on this frame_"}`);
  if (it.markedPart) L.push(`- **marked on:** ${named(it.markedPart)}`);
  if (it.detail) L.push(`- **in the detail:** ${it.detail}`);
  if (it.question) L.push(`- **quick check:** ${it.question}`);
  if (it.answered) L.push(`- **they answered:** ${it.answered}; they disagreed, in the words below`);
  if (it.kind === "comment" || it.kind === "mark") L.push(`- **words:** ${it.words ? `"${it.words.replace(/\n+/g, " ")}"` : `_none (a ${it.shape} with no words)_`}`);
  else L.push(`- **what happened:** ${it.words}`);
  L.push(`- **hint:** ${it.hint.sort === "video" ? "video" : it.hint.sort === "change-small" ? "change, small" : "change, plan"} — ${it.hint.why}`);
  L.push(`- **Answer:** _(the agent: what you did, and where to see it)_`, "");
});
const kept = again && existsSync(out) && !args.includes("--force");
if (!kept) writeFileSync(out, L.join("\n").replace(/\n+$/, "\n"));
writeIndex();
const by = (s) => items.filter((i) => i.hint.sort === s).length;
if (kept) console.log(`△ ${rel(out)}: this review was sorted before; kept as it is, with its answers (--force rewrites it)`);
else console.log(`✓ ${rel(out)}: ${items.length} item${items.length === 1 ? "" : "s"} (hint: ${by("video")} video, ${by("change-small")} small change, ${by("change-plan")} plan)`);
console.log(`  ${rel(join(VIDEO, "review.md"))} lists every review of the system video`);
for (const [i, it] of items.entries()) console.log(`  ${i + 1}. ${KIND[it.kind]}${it.frame ? ` · frame ${it.frame.index}` : ""} · ${it.specSection || "-"} · ${it.components.map((c) => names[c] || c).join(", ") || "-"}${it.words ? ` · "${it.words.slice(0, 60)}"` : ""} → ${it.hint.sort}`);
if (args.includes("--json")) console.log(JSON.stringify({ video: rel(VIDEO), review: rel(out), items }, null, 2));

// review.md, the index: each review, newest first, with its answers counted
function writeIndex() {
  const rows = readdirSync(REVIEWS).filter((f) => f.endsWith(".md")).map((f) => {
    const md = readFileSync(join(REVIEWS, f), "utf8");
    const when = (md.match(/^# Review of the system video · (.+)$/m) || [])[1] || "";
    const answers = [...md.matchAll(/^- \*\*Answer:\*\*(.*)$/gm)].map((m) => m[1].trim());
    const done = answers.filter((a) => a && !/^_\(the agent:/.test(a)).length;
    return { f, when, n: answers.length, done };
  }).sort((a, b) => (b.when || b.f).localeCompare(a.when || a.f));
  const L = ["# Reviews of the system video", "",
    "One file per review in `reviews/`, so two reviews arriving back to back never overwrite each other's **Answer:** lines. Answer each item in its own review's file. Newest first:", "",
    ...rows.map((r) => `- [reviews/${r.f}](reviews/${r.f})${r.when ? ` · ${r.when}` : ""} · ${r.n ? `${r.done} of ${r.n} item${r.n === 1 ? "" : "s"} answered` : "nothing to sort"}`), ""];
  writeFileSync(join(VIDEO, "review.md"), L.join("\n"));
}
