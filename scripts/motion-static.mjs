#!/usr/bin/env node
// "Never a bunch of text on screen with no corresponding movement", measured from the timeline source
// rather than in a browser: every tween carries `duration:` and an absolute position `}, 4.77)`, so the
// question is answered by reading the frames, in milliseconds, for every frame at once.
//
// A tween with a duration is movement, whoever wrote it: a literal tl.to, a helper's pop, a camera's
// push. A .set() is an instantaneous reveal: a visual event, not motion, so it ends a gap but a frame
// built only from sets is still reported. The narration runs for the whole beat, so any stretch with
// neither is text with nothing happening under it.
//
// usage: reelplanning motion-static <project-dir> [--gap 2.5] [--tail 3.0]
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { readTimeline, scriptsOf } from "./lib/timeline.mjs";

const args = process.argv.slice(2);
const num = (n, d) => (args.includes(`--${n}`) ? Number(args[args.indexOf(`--${n}`) + 1]) : d);
const project = args.find((a) => !a.startsWith("--")) || ".";
const GAP = num("gap", 2.5), TAIL = num("tail", 3.0);
const dir = resolve(project);   // relative to the caller, not to wherever reelplanning is installed
const fdir = join(dir, "compositions/frames");
if (!existsSync(fdir)) { console.error(`✗ no frames in ${project}`); process.exit(1); }

// durations are law and live in the storyboard
const sb = existsSync(join(dir, "STORYBOARD.md")) ? readFileSync(join(dir, "STORYBOARD.md"), "utf8") : "";
const durs = {};
for (const m of sb.matchAll(/^## Frame (\d+) —([^\n]*)\n([\s\S]*?)(?=\n## Frame |(?![\s\S]))/gm)) {
  const d = m[3].match(/^- duration:\s*([\d.]+)s/m), src = m[3].match(/^- src:.*frames\/([\w-]+)\.html/m);
  if (d && src) durs[src[1]] = { dur: +d[1], title: m[2].trim(), index: +m[1] };
}

// every tween on the timeline (lib/timeline.mjs): literal and relative positions, and the moves a
// helper makes (`pop(tl, el, 2.63)`). A tween on a plain object that only pads the timeline moves nothing and is
// left out; a gsap.set outside the timeline is an initial state, not a move.
function tweens(js) {
  const t = readTimeline(js);
  const out = t.tweens.filter((x) => !x.hold).map((x) => ({ s: x.start, e: x.end, camera: isCamera(x) }));
  out.skipped = t.skipped;
  return out;
}
// a camera move: a tween on an element named as a camera (*-cam, camera, world, or data-camera in the
// markup) or one that zooms (a scale over 1). Its time is reported on its own, so a frame whose only
// motion is a slow push reads as that and not as a drip of pops.
let cameraIds = new Set();
const isCamera = (t) => (t.targets || []).some((x) => cameraIds.has(x) || /(?:^|[-_#.])(?:cam|camera|world)\b/i.test(x))
  || ["from", "to"].some((k) => t[k] && ["scale", "scaleX", "scaleY"].some((p) => Number(t[k][p]) > 1));

// seconds covered by a set of intervals
const union = (ts) => { let sum = 0, cur = -Infinity; for (const t of [...ts].sort((a, b) => a.s - b.s)) { const s = Math.max(t.s, cur); if (t.e > s) sum += t.e - s; cur = Math.max(cur, t.e); } return sum; };

const rows = [];
for (const f of readdirSync(fdir).filter((x) => x.endsWith(".html")).sort()) {
  const id = f.replace(/\.html$/, "");
  const src = readFileSync(join(fdir, f), "utf8");
  // comments carry the cue word after the position parameter, so strip them before parsing
  const js = scriptsOf(src);
  cameraIds = new Set([...src.matchAll(/<[^>]*\bdata-camera\b[^>]*>/g)].map((m) => (m[0].match(/\bid="([^"]+)"/) || [])[1]).filter(Boolean).map((id) => `#${id}`));
  const all = tweens(js);
  const dur = durs[id]?.dur ?? 0;
  if (!dur || !all.length) { rows.push({ id, title: durs[id]?.title || "", dur, gaps: [], tail: 0, moving: 0, unknown: true, skipped: all.skipped }); continue; }

  const moves = all.filter((t) => t.e > t.s).sort((a, b) => a.s - b.s);
  const sets = all.filter((t) => t.e <= t.s).map((t) => t.s);
  const merged = [];
  for (const t of moves) {
    const last = merged[merged.length - 1];
    if (last && t.s <= last.e + 0.001) last.e = Math.max(last.e, t.e); else merged.push({ ...t });
  }
  const holes = []; let cur = 0;
  for (const t of merged) { if (t.s - cur > 0.001) holes.push([cur, t.s]); cur = Math.max(cur, t.e); }
  // A closing hold is deliberate (style guide §1); a gap that runs to within a beat of the end is that hold,
  // not a stall in the middle, so it is judged against the tail threshold instead.
  const lastEnd = merged.length ? merged[merged.length - 1].e : 0;
  const tail = +(dur - Math.max(cur, holes.length && holes[holes.length - 1][1] >= dur - 0.2 ? holes[holes.length - 1][0] : lastEnd)).toFixed(2);
  if (holes.length && holes[holes.length - 1][1] >= dur - 0.2) holes.pop();
  const split = [];
  for (const [a0, b0] of holes) {
    let a = a0;
    for (const s of sets.filter((s) => s > a0 && s < b0)) { if (s - a > 0.001) split.push([a, s]); a = s; }
    if (b0 - a > 0.001) split.push([a, b0]);
  }
  rows.push({
    id, title: durs[id]?.title || "", dur,
    moving: +merged.reduce((a, t) => a + (t.e - t.s), 0).toFixed(2),
    camera: +union(moves.filter((t) => t.camera)).toFixed(2),
    gaps: split.filter(([a, b]) => b - a >= GAP).map(([a, b]) => ({ from: +a.toFixed(2), to: +b.toFixed(2), len: +(b - a).toFixed(2) })),
    tail,
    // some frames compute a position (a variable, or an array of cue times). Those tweens are
    // invisible here, so a gap in such a frame may be one the parser invented by missing them.
    skipped: all.skipped,
  });
}

console.log(`motion — ${basename(dir)} (a still stretch of ${GAP}s+, or a tail over ${TAIL}s, is reported)`);
let bad = 0, approx = 0; const unreadable = [];
for (const r of rows) {
  if (r.unknown) { unreadable.push(r.id); console.log(`  ? ${r.id.padEnd(18)} ${r.skipped ? `${r.skipped} tween position(s) are computed` : "no timed tweens"}, so this one cannot be read statically`); continue; }
  const notes = r.gaps.map((g) => `still ${g.len}s (${g.from}→${g.to})`);
  if (r.tail > TAIL) notes.push(`tail ${r.tail}s`);

  const pct = r.dur ? Math.round((r.moving / r.dur) * 100) : 0;
  const cam = r.camera ? `, camera ${Math.round((r.camera / r.dur) * 100)}%` : "";
  if (notes.length) {
    const soft = r.skipped ? ` — approximate: ${r.skipped} position(s) computed, so this may be a gap the parser invented` : "";
    if (r.skipped) approx++; else bad++;
    console.log(`  ${r.skipped ? "?" : "✗"} ${r.id.padEnd(18)} ${String(pct).padStart(3)}% moving${cam} of ${r.dur}s — ${notes.join(", ")}${soft}`);
  }
  else console.log(`  ✓ ${r.id.padEnd(18)} ${String(pct).padStart(3)}% moving${cam} of ${r.dur}s`);
}
console.log(`\n${bad} confirmed, ${approx} approximate (frames whose tween positions are computed), ${unreadable.length} unreadable, of ${rows.length} beats.`);
process.exit(bad ? 1 : 0);
