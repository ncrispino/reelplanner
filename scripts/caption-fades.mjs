#!/usr/bin/env node
// Stop two captions being on screen at once.
//
// The generated caption layer fades a group OUT over 0.12 s from its end while the next group is
// already fading IN from its start. Sentence groups nearly abut (most gaps are under 0.12 s), so on
// nearly every boundary two captions are drawn over each other for the length of the fade.
//
// Fading out early would clip the last word's highlight. Instead the fade-out is sized to the real
// gap: the caption stays lit until its own end, then clears in whatever time there is before the
// next one. With gaps this tight that is effectively a cut, which is what subtitles do anyway.
//
// usage: reelplanning caption-fades <project-dir>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("usage: reelplanning caption-fades <project-dir>"); process.exit(1); }
const p = join(dir, "compositions", "captions.html");
let s = readFileSync(p, "utf8");

const OLD = 'GROUPS.forEach(function (g) {';
const NEW = 'GROUPS.forEach(function (g, gi) {';
const OLD_OUT = 'tl.to(el, { opacity: 0, duration: 0.12, overwrite: "auto" }, g.end);\n        tl.set(el, { opacity: 0, visibility: "hidden" }, g.end + 0.12);';
const NEW_OUT = 'var nxt = GROUPS[gi + 1];\n        var out = nxt ? Math.max(0.02, Math.min(0.12, nxt.start - g.end)) : 0.12;\n        tl.to(el, { opacity: 0, duration: out, overwrite: "auto" }, g.end);\n        tl.set(el, { opacity: 0, visibility: "hidden" }, g.end + out);';

if (s.includes("var out = nxt ?")) { console.log(`· ${dir}: already fixed`); process.exit(0); }
// The older generator hard-cuts each group at min(next.start, end + 0.3), so it cannot overlap.
// Only the newer one, which fades out at `end` while the next fades in at `start`, has the bug.
if (/tl\.set\(groupEl, \{ opacity: 0 \}, end\)/.test(s)) { console.log(`· ${dir}: older caption layer — hard cut clamped to the next group, cannot overlap`); process.exit(0); }
if (!s.includes(OLD) || !s.includes(OLD_OUT)) { console.error(`✗ ${p}: caption layer is not the shape this expects`); process.exit(1); }
s = s.replace(OLD, NEW).replace(OLD_OUT, NEW_OUT);
writeFileSync(p, s);

const G = JSON.parse(s.match(/GROUPS\s*=\s*(\[[\s\S]*?\]);/)[1]);
let tight = 0;
for (let i = 1; i < G.length; i++) if (G[i].start - G[i - 1].end < 0.12) tight++;
console.log(`✓ ${dir}: ${G.length} groups, ${tight} boundary(s) tighter than the old 0.12s fade — no longer overlap`);
