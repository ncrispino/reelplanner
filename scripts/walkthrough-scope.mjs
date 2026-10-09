#!/usr/bin/env node
// What a walkthrough review asks the agent to do next, as JSON on stdout: the calls accepted (they
// join the ledger), the fixes (a call flagged or answered in the reviewer's own words, a quick check
// they disagreed with, each with those words; `escalate` when the words reach an active decision)
// and the calls never judged. The same sort `reel record` writes into the review's reviews/<id>.md
// (lib/review-scope.mjs); nothing is written.
//
// usage: reelplanner walkthrough-scope <plan-dir> [review.json]   (default: the newest walkthrough review in reviews/)
import { existsSync, readFileSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { listReviews, reviewOf, ledgerFor } from "./lib/reviews.mjs";
import { walkthroughScope, mapFor } from "./lib/review-scope.mjs";

const [planDirArg, annArg] = process.argv.slice(2);
if (!planDirArg) { console.error("usage: reelplanner walkthrough-scope <plan-dir> [review.json]"); process.exit(1); }
const planDir = resolve(planDirArg);
const path = annArg ? resolve(annArg) : listReviews(planDir).filter((r) => r.kind === "walkthrough").at(-1)?.path;
if (!path || !existsSync(path)) { console.error(`✗ ${path || `no walkthrough review in ${planDirArg}/reviews/`} (record one first: reel record <plan-dir> <annotations.json>)`); process.exit(1); }
const wtPath = join(planDir, "walkthrough.md");
if (!existsSync(wtPath)) { console.error(`✗ ${wtPath} not found — a walkthrough review needs the report it judged`); process.exit(1); }
const ann = reviewOf(JSON.parse(readFileSync(path, "utf8")));
// the plan's other walkthrough reviews: a call one of them judged is not "never judged"
const earlier = listReviews(planDir).filter((r) => r.kind === "walkthrough" && resolve(r.path) !== path).map((r) => r.review);
console.log(JSON.stringify({ review: path, ...walkthroughScope(ann, { wt: readFileSync(wtPath, "utf8"), ledger: ledgerFor(planDir), map: mapFor(planDir, "walkthrough"), earlier, planName: basename(planDir) }) }, null, 2));
