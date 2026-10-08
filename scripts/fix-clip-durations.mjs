#!/usr/bin/env node
// Run after assemble-index and transitions inject. After narration changes, sync-durations updates
// STORYBOARD.md and the assembler re-stamps each frame's root data-duration, but the frame's own
// full-length `class="clip"` layers keep their old data-duration and the runtime hides them once that
// window ends: the frame goes blank for its last seconds. This re-stamps every full-length clip
// (data-start="0", duration ≥ 60 % of the root window) to the root's data-duration, the frame's padded
// window. Running it again changes nothing.
// usage: reelplanning fix-clip-durations <project-dir>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const dir = process.argv[2]; if (!dir) { console.error("usage: reelplanning fix-clip-durations <project-dir>"); process.exit(1); }
const sb = readFileSync(join(dir, "STORYBOARD.md"), "utf8");
const srcs = [...sb.matchAll(/^- src:\s*(\S+)/gm)].map((m) => m[1]);
// each frame's slot in index.html, the window it plays in: a frame whose root still says an older length (its voice
// line re-voiced longer, a hold changed) is restamped to it first, or it goes blank for the rest of its slot (the
// system video's fresh eyes found two such scenes, videos-that-make-sense step 5)
const slots = {};
try { const idx = readFileSync(join(dir, "index.html"), "utf8");
  for (const m of idx.matchAll(/<div\b[^>]*>/g)) { const t = m[0], src = (t.match(/data-composition-src="([^"]+)"/) || [])[1], du = (t.match(/data-duration="([\d.]+)"/) || [])[1]; if (src && du) slots[src] = du; } } catch { /* no index yet */ }
let roots = 0;
let touched = 0, clips = 0; const noRoot = [], noWindow = [];
for (const src of srcs) {
  const p = join(dir, src); let s = readFileSync(p, "utf8"); const before = s;
  const root = s.match(/<[a-z]+[^>]*data-composition-id="[^"]+"[^>]*>/); if (!root) { noRoot.push(src); continue; }
  // no data-duration: no window to measure a clip against. Said below, since the frames it hits are
  // the held closers, where a stale clip window blanks the frame
  let rd = root[0].match(/data-duration="([\d.]+)"/); if (!rd) { noWindow.push(src); continue; }
  if (slots[src] && Math.abs(parseFloat(slots[src]) - parseFloat(rd[1])) > 0.001) {
    const was = rd[1], to = slots[src];
    s = s.replace(root[0], root[0].replace(/data-duration="[\d.]+"/, `data-duration="${to}"`));
    // its full-length layers go with it, longer or shorter
    s = s.replace(new RegExp(`(<[a-z]+[^>]*class="[^"]*\\bclip\\b[^"]*"[^>]*data-start="0"[^>]*data-duration=")${was.replace(".", "\\.")}(")`, "g"), `$1${to}$2`)
         .replace(new RegExp(`(<[a-z]+[^>]*data-start="0"[^>]*data-duration=")${was.replace(".", "\\.")}("[^>]*class="[^"]*\\bclip\\b)`, "g"), `$1${to}$2`);
    rd = [null, to]; roots++;
  }
  const win = parseFloat(rd[1]);
  s = s.replace(/<([a-z]+)([^>]*class="[^"]*\bclip\b[^"]*"[^>]*)>/g, (tag, name, attrs) => {
    const st = attrs.match(/data-start="([\d.]+)"/), du = attrs.match(/data-duration="([\d.]+)"/);
    if (!st || !du || parseFloat(st[1]) !== 0) return tag;
    const d = parseFloat(du[1]); if (d >= win - 0.001 || d < 0.6 * win) return tag;
    clips++; return `<${name}${attrs.replace(/data-duration="[\d.]+"/, `data-duration="${win}"`)}>`;
  });
  if (s !== before) { writeFileSync(p, s); touched++; }
}
console.log(`✓ fix-clip-durations: ${clips} clip(s) in ${touched}/${srcs.length} frame(s) extended to their frame window${roots ? `; ${roots} frame root(s) restamped to their slot in index.html` : ""}`);
// said, not fatal: a frame with no window is not always wrong, and failing here would stop the whole assembly
if (noWindow.length) console.log(`△ ${noWindow.length} frame(s) skipped, no data-duration on the root to measure against: ${noWindow.join(", ")}`);
if (noRoot.length) console.log(`△ ${noRoot.length} frame(s) skipped, no data-composition-id root: ${noRoot.join(", ")}`);
