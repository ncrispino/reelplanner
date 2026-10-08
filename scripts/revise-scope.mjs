#!/usr/bin/env node
// Which plan steps a review asks a revise to change, and why, as JSON on stdout; and each suggested edit with the
// scenes it rebuilds (only those whose own words or frame show the words it changes; the guide is always rebuilt). The same sort
// `reel record` writes into the review's reviews/<id>.md (lib/review-scope.mjs); this prints it for a
// tool, or a person, that wants the data. Nothing is written.
//
// usage: reelplanning revise-scope <plan-dir> [review.json]     (default: the newest review in reviews/)
import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { listReviews, reviewOf, reviewKind } from "./lib/reviews.mjs";
import { reviseScope, mapFor, editsOf, scenesSaying } from "./lib/review-scope.mjs";

const [planDirArg, annArg] = process.argv.slice(2);
if (!planDirArg) { console.error("usage: reelplanning revise-scope <plan-dir> [review.json]"); process.exit(1); }
const planDir = resolve(planDirArg);
const path = annArg ? resolve(annArg) : listReviews(planDir).at(-1)?.path;
if (!path || !existsSync(path)) { console.error(`✗ ${path || `no review in ${planDirArg}/reviews/`} (record one first: reel record <plan-dir> <annotations.json>)`); process.exit(1); }
const ann = reviewOf(JSON.parse(readFileSync(path, "utf8"))), kind = reviewKind(ann);
// a suggested edit (the plan guide, step 4) with the scenes whose words or frame show its `before`: the only ones rebuilt for it
const map = mapFor(planDir, kind), videoDir = join(planDir, kind === "walkthrough" ? "walkthrough-video" : "video");
const edits = kind === "walkthrough" ? [] : editsOf(ann).map((e) => ({ ...e, scenes: scenesSaying(e.before, { map, videoDir }) }));
console.log(JSON.stringify({ of: kind, review: path, ...reviseScope(ann, { map }), edits }, null, 2));
