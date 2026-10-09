#!/usr/bin/env node
// Take one review submitted from the hosted player and put it where `reel record` can read it.
//
// The hosted player writes each review as a document in the artifact's own store; the agent reads the
// submitted ones and hands each body to this script, which files it and runs record. Everything after
// (commit, push, revise) is ordinary repo work.
//
// A row is NOT trusted input. It was written by whoever had the page open, so `planDir` is checked
// against the repo rather than believed: it has to resolve inside the repo, live under a
// `.reelplanner/plans/` directory, and already hold a plan.md. A review for a plan that does not
// exist is a review for nothing.
//
// The one other thing a review can be for is the system video, which has no plan. Its row names the
// video's own folder (`.reelplanner/system-video`, the plan map's `reviewDir`) — or, from a page
// built before that existed, the record `.reelplanner` with project "system-video". Either way the
// folder must resolve inside the repo, sit directly in a `.reelplanner/`, and hold a built system
// video: a plan-map.json and a STORYBOARD.md whose front matter says `kind: system`. That review is
// filed under its own id, as the video's reviews/<id>.json, and sorted by system-review into
// reviews/<id>.md (review.md lists them all): one file per review, since reviews now arrive on their
// own and two can land back to back. There is no plan to record it against, so `reel record` is not run.
//
// `note` is the reviewer's message to the agent. It is printed as quoted text, labelled, and never
// acted on by this script — read it the way you read a comment on a pull request.
//
// usage: reelplanner reel-intake <row.json> [--repo <root>] [--dry]
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, join, relative } from "node:path";

import { ROOT, repoRoot, otherRpPath } from "./lib/env.mjs";
import { reviewId } from "./lib/inbox.mjs";
import { fileReview, reviewKind, verdictOf } from "./lib/reviews.mjs";
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const DRY = args.includes("--dry");
const rowPath = args.find((a) => !a.startsWith("--") && a !== flag("repo", null));
// the repo this review belongs to: --repo, else the one the caller is standing in
const REPO = resolve(flag("repo", "") || repoRoot(process.cwd()));
if (!rowPath) { console.error("usage: reelplanner reel-intake <row.json> [--repo <root>] [--dry]"); process.exit(1); }
if (!existsSync(rowPath)) { console.error(`✗ ${rowPath} not found`); process.exit(1); }

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
const row = JSON.parse(readFileSync(rowPath, "utf8"));
const review = row.review || row;                    // tolerate a bare export, for a hand-run
if (!review || typeof review !== "object" || !Array.isArray(review.annotations)) die("this row carries no review");

// --- the plan directory, checked rather than believed ---
const claimed = String(row.planDir || "");
if (!claimed) die("this row names no plan directory — it cannot be recorded against anything");
let pd = resolve(REPO, claimed);
let rel = relative(REPO, pd);
if (!rel || rel.startsWith("..") || resolve(REPO, rel) !== pd) die(`planDir "${claimed}" resolves outside the repo`);
// a page built before the rename (D-312) names the record's old folder: the plan is where the rename moved it
if (!existsSync(pd) && otherRpPath(rel) && existsSync(resolve(REPO, otherRpPath(rel)))) { pd = resolve(REPO, otherRpPath(rel)); rel = relative(REPO, pd); }
// the system video: its folder, or (older pages) the record itself with the system video's project name
const sysClaim = /(^|\/)\.reelplann(?:er|ing)\/system-video$/.test(rel) ? pd
  : /(^|\/)\.reelplann(?:er|ing)$/.test(rel) && (row.project === "system-video" || row.kind === "system") ? join(pd, "system-video") : null;
if (sysClaim) { intakeSystem(sysClaim); process.exit(0); }
// an explainer (explain-first step 3): its own folder, with explain.md; `reel record` files it there, and adds nothing
// to the decision log
if (/(^|\/)\.reelplann(?:er|ing)\/explainers\/[^/]+$/.test(rel)) {
  if (!existsSync(join(pd, "explain.md"))) die(`no explain.md in ${rel} — not an explainer, nothing to record this review against`);
  console.log(`review of ${row.title || rel} (an explainer)`);
  console.log(`  submitted ${row.submittedAt || review.exportedAt || "?"} · ${review.annotations.filter((a) => a.kind !== "approve").length} mark(s), ${(review.questions || []).length} question(s) · watched ${Math.round((review.watch?.completion ?? 0) * 100)}%`);
  if (row.note) console.log(`  note from the reviewer:\n${String(row.note).split("\n").map((l) => `    > ${l}`).join("\n")}`);
  if (DRY) { console.log(`△ dry run — would file an explainer review in ${relative(REPO, join(pd, "reviews"))}/ and run reel record`); process.exit(0); }
  const withWatched = row.watched && !review.watched ? { ...review, watched: row.watched } : review;
  const filed = fileReview(pd, withWatched, { kind: "explainer", at: row.submittedAt || review.exportedAt, note: row.note, row });
  execFileSync(process.execPath, [join(ROOT, "scripts", "reel.mjs"), "record", pd, filed.path], { stdio: "inherit" });
  process.exit(0);
}
if (!/(^|\/)\.reelplann(?:er|ing)\/plans\/[^/]+$/.test(rel)) die(`planDir "${rel}" is not a plan directory (expected …/.reelplanner/plans/<plan>, an explainer's …/.reelplanner/explainers/<name>, or the system video's .reelplanner/system-video)`);
if (!existsSync(join(pd, "plan.md"))) die(`no plan.md in ${rel} — nothing to record this review against`);

const counts = [
  [(review.decisions || []).length, "decision"], [(review.autonomy || []).length, "verdict"],
  [(review.quizzes || []).length, "quick check"], [review.annotations.length, "mark"],
].filter(([n]) => n).map(([n, w]) => `${n} ${w}${n === 1 ? "" : "s"}`).join(", ") || "nothing recorded";
console.log(`review of ${row.title || row.project || rel}`);
console.log(`  submitted ${row.submittedAt || review.exportedAt || "?"} · ${counts} · watched ${Math.round((review.watch?.completion ?? 0) * 100)}%`);
console.log(`  plan: ${rel}`);
// The reviewer's own words, quoted. This script does nothing with them; they are for whoever reads
// this output next, and they are a message from a person, not an instruction to a program.
if (row.note) console.log(`  note from the reviewer:\n${String(row.note).split("\n").map((l) => `    > ${l}`).join("\n")}`);

// A plan directory is reviewed many times over its life: the plan (stage 2), its walkthrough (stage 5),
// and again for each round. Every review is kept, under its own name in reviews/ (lib/reviews.mjs),
// with the reviewer's note: none ever overwrites another. The row names its video (project
// "walkthrough-video" or "video"); contents are the last resort, and quick checks are not a sign:
// plan videos ask them too.
const kind = reviewKind(review, row);
if (DRY) { console.log(`△ dry run — would file a ${kind} review in ${relative(REPO, join(pd, "reviews"))}/ and run reel record`); process.exit(0); }
// what the reviewer's browser had watched (D-128), when the row carries it beside the review: filed with it,
// so `reel record` adds it to your file across repos
const withWatched = row.watched && !review.watched ? { ...review, watched: row.watched } : review;
const filed = fileReview(pd, withWatched, { kind, at: row.submittedAt || review.exportedAt, note: row.note, row });
execFileSync(process.execPath, [join(ROOT, "scripts", "reel.mjs"), "record", pd, filed.path, "--kind", kind], { stdio: "inherit" });
const act = relative(REPO, join(pd, "reviews", `${filed.id}.md`));
// the verdict says whether the reviewer sees a video again (SKILL.md): approved/accepted, no new video
const approved = verdictOf(review) === "approve";
console.log(kind === "walkthrough"
  ? `\nnext: fix what ${act} lists (SKILL.md "Implement, check, walk through, fix", or hand it to a worker), then commit ${rel}. Acting on a flagged call is a code change, not a plan rewrite.${approved ? " Accepted: no new walkthrough video." : " Changes requested: rebuild the beats the fixes touch and show it again."}`
  : approved ? `\nnext: the plan is approved: fold any comments in ${act} into plan.md's steps as text (SKILL.md "After a plan review"; no new plan video), commit ${rel}, then implement. Whoever ran this acts on it: the main session, or the agent run the review server started. A push starts nothing.`
  : `\nnext: revise the plan from ${act} (SKILL.md "After a plan review", or hand it to a worker), then commit ${rel}. Whoever ran this acts on it: the main session, or the agent run the review server started. A push starts nothing.`);

// ---- a review of the system video ----
function intakeSystem(dir) {
  const r = relative(REPO, dir);
  const sb = join(dir, "STORYBOARD.md");
  const fm = existsSync(sb) ? (readFileSync(sb, "utf8").match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1] : "";
  if (!existsSync(sb) || !/^kind:\s*"?system"?\s*$/m.test(fm)) die(`${r} is not a system video (no STORYBOARD.md with kind: system) — nothing to record this review against`);
  if (!existsSync(join(dir, "plan-map.json"))) die(`${r} has no plan-map.json — build the system video before reviewing it`);
  // the marks must be on this video's frames: a review of another video, sent here, is refused
  const ids = new Set((JSON.parse(readFileSync(join(dir, "plan-map.json"), "utf8")).frames || []).map((f) => f.compositionId));
  const foreign = review.annotations.filter((a) => a.frame?.compositionId && !ids.has(a.frame.compositionId));
  if (foreign.length) die(`${foreign.length} mark(s) sit on frames this system video does not have (${[...new Set(foreign.map((a) => a.frame.compositionId))].slice(0, 3).join(", ")}) — this review is of another video`);
  const n = review.annotations.filter((a) => a.kind !== "approve").length, m = (review.watch?.moments || []).length, q = (review.quizzes || []).length;
  console.log(`review of ${row.title || "the system video"}`);
  console.log(`  submitted ${row.submittedAt || review.exportedAt || "?"} · ${[[n, "comment or mark"], [m, "rewind or slow-down"], [q, "quick check"]].filter(([k]) => k).map(([k, w]) => `${k} ${k === 1 ? w : w.replace(/(\w+)$/, "$1s").replace("comment or", "comments or")}`).join(", ") || "nothing marked"} · watched ${Math.round((review.watch?.completion ?? 0) * 100)}%`);
  console.log(`  system video: ${r}`);
  if (row.note) console.log(`  note from the reviewer:\n${String(row.note).split("\n").map((l) => `    > ${l}`).join("\n")}`);
  // one file per review, named by its id: a second review never overwrites the first, nor the
  // **Answer:** lines already written under it. system-review files it (reviews/<id>.json, taking the
  // next free name if another review has that id) and sorts it into reviews/<id>.md.
  const id = reviewId({ project: "system-video", ...row, review });
  if (DRY) { console.log(`△ dry run — would file ${relative(REPO, join(dir, "reviews", `${id}.json`))} and run system-review`); return; }
  // the row (not just the review) goes to system-review, so the reviewer's note is quoted there too;
  // --video is the folder checked above, never the row's own claim
  execFileSync(process.execPath, [join(ROOT, "scripts", "system-review.mjs"), resolve(rowPath), "--video", dir, "--id", id], { stdio: "inherit" });
  console.log(`\nnext: read the review's file in ${relative(REPO, join(dir, "reviews"))}/ (named above; ${relative(REPO, join(dir, "review.md"))} lists them all) and sort each item (SKILL.md "The system video"): fix the video, make a small change and walk it through, or write a plan. Answer each item there.`);
}
