#!/usr/bin/env node
// Does a video vary its layouts and its transitions, and does its BRIEF.md say how? (lib/variety.mjs)
// A warning, never a failure; `build` prints the same lines after the length.
//
// usage: reelplanning variety <video-dir>
import { resolve } from "node:path";
import { videoVariety, varietyLines } from "./lib/variety.mjs";

const dir = process.argv[2];
if (!dir) { console.error("usage: reelplanning variety <video-dir>"); process.exit(1); }
const v = videoVariety(resolve(dir));
if (!v) { console.error(`✗ variety: no STORYBOARD.md in ${dir}`); process.exit(1); }
for (const l of varietyLines(v)) console.log(`${l.warn ? "△" : "✓"} ${l.text}`);
console.log(`  layouts: ${v.layout.kinds} over ${v.layout.of} scenes (most: ${v.layout.name ?? "none"}) · transitions: ${v.transition.kinds} over ${v.transition.of} (most: ${v.transition.name ?? "none"})`);
