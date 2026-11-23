#!/usr/bin/env node
// How still is the rendered video? The share of its time in which the picture above the captions does not change,
// its longest still stretch, and any jolt (one frame where the whole picture jumps), measured on the MP4 with ffmpeg
// (lib/stillness.mjs says how). motion-static asks the same of the timeline source, before anything is rendered;
// this is the picture as a viewer sees it, transitions, holds and all.
//
// A report, never a failure: past the bar (25% still, or a stretch over 3 s) it says △. `verify --render` runs it
// after the render, and `build --render` prints its line. A still stretch usually means a spoken line the picture
// does not act out: give that phrase a move that shows what it says, not a decoration.
//
// usage: reelplanner stillness <video-dir | video.mp4> [--noise 0.002] [--min 1.5] [--jolt 0.03] [--band 0.1667] [--json] [--strict]
//   <video-dir>   reads its renders/video.mp4
//   --noise       how different a sample must be to count as change (freezedetect's n, 0 to 1)
//   --min         the shortest pause counted as still, in seconds (a shorter one reads as a beat between moves)
//   --jolt        the scene score over which one frame is a jolt
//   --band        the share of the height cropped off the bottom, where the captions are
//   --json        the numbers as JSON
//   --strict      exit 1 past the bar, for a script that wants to stop on it
import { existsSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { DEFAULTS, measure, stillnessLines, hasFfmpeg } from "./lib/stillness.mjs";

const args = process.argv.slice(2);
const VALUED = ["--noise", "--min", "--jolt", "--band"];
const num = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? Number(args[i + 1]) : DEFAULTS[n]; };
const target = args.find((a, i) => !a.startsWith("--") && !VALUED.includes(args[i - 1]));
if (!target) { console.error("usage: reelplanner stillness <video-dir | video.mp4> [--noise 0.002] [--min 1.5] [--jolt 0.03] [--band 0.1667] [--json] [--strict]"); process.exit(1); }
const abs = resolve(target);
const path = existsSync(abs) && statSync(abs).isDirectory() ? join(abs, "renders", "video.mp4") : abs;
if (!existsSync(path)) { console.error(`✗ stillness: no render at ${relative(process.cwd(), path) || path} (reelplanner verify <video-dir> --render)`); process.exit(1); }
if (!hasFfmpeg()) { console.error("✗ stillness: ffmpeg and ffprobe are needed (reelplanner setup)"); process.exit(1); }
for (const n of ["noise", "min", "jolt", "band"]) if (!Number.isFinite(num(n)) || num(n) < 0) { console.error(`✗ stillness: --${n} takes a number`); process.exit(1); }

let r;
try { r = measure(path, { noise: num("noise"), min: num("min"), jolt: num("jolt"), band: num("band") }); }
catch (e) { console.error(`✗ stillness: ${e.message}`); process.exit(1); }
if (args.includes("--json")) console.log(JSON.stringify({ video: path, ...r }));
else for (const l of stillnessLines(r)) console.log(l.detail ? `    ${l.text}` : `${l.warn ? "△" : "✓"} ${l.text}`);
process.exit(args.includes("--strict") && !r.passes ? 1 : 0);
