#!/usr/bin/env node
// How much of a video is the same picture? (style guide §5)
//
// The full stage — rail plus diagram — is context. Drawn in every beat it stops being context and
// becomes the video: a reviewer sees one still with a border moving on it. This reports the share
// of beats carrying the full stage, the rail only, and neither.
//
// It also measures the rail itself: a 500x660 rail is 16% of the frame and a third of its width, and
// a rail that never changes fails the same test the diagram is held to.
//
// usage: reelplanning stage-presence <project-dir> [--max 0.5]
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, basename } from "node:path";

const args = process.argv.slice(2);
const project = args.find((a) => !a.startsWith("--")) || ".";
const maxShare = args.includes("--max") ? Number(args[args.indexOf("--max") + 1]) : 0.5;
const dir = resolve(project);   // relative to the caller, not to wherever reelplanning is installed
const fdir = join(dir, "compositions/frames");
if (!existsSync(fdir)) { console.error(`✗ no frames in ${project}`); process.exit(1); }

const rows = [];
for (const f of readdirSync(fdir).filter((f) => f.endsWith(".html")).sort()) {
  const s = readFileSync(join(fdir, f), "utf8");
  // Classify by what the frame DRAWS, not by attributes. A data-plan-component tag on one tile says
  // the tile is a plan component; it says nothing about how much of the stage is on screen.
  const has = (re) => re.test(s);
  const files = has(/class="[^"]*-file\b/), build = has(/class="[^"]*-build\b/), pages = has(/class="[^"]*-page\b/);
  const nodes = has(/class="[^"]*-node\b/), slots = has(/data-plan-step=|class="[^"]*-slot\b/);
  const spineOnly = has(/class="[^"]*-spine\b/) && !has(/class="[^"]*-rail\b/);
  const kind =
    (files && build && pages) || nodes ? "full stage" :
    pages ? "pages only" :
    files || build ? "files only" :
    slots ? (spineOnly ? "ticks only" : "rail only") : "its own";
  // does the rail DO anything here, or is it a still 16% of the frame?
  const tl = s.slice(s.indexOf("gsap.timeline"));
  const railMoves = /tl\.(?:from|fromTo|to)\(\s*(?:\[[^\]]*)?["'`][^"'`]*(?:slot|rail|fill)/i.test(tl);
  // full rail or spine? they cost wildly different amounts, so measure whichever this frame draws.
  // The shared stage stylesheet puts both rules on every frame, so go by the ELEMENT it draws.
  const spine = has(/class="[^"]*-spine\b/);
  const drawnRail = spine ? "spine" : has(/class="[^"]*-rail\b/) ? "rail" : null;
  const g = drawnRail && s.match(new RegExp(`-${drawnRail}\\s*\\{[^}]*?width:\\s*(\\d+)px[^}]*?height:\\s*(\\d+)px`));
  const railArea = g ? (+g[1] * +g[2]) / (1920 * 1080) : 0;
  rows.push({ frame: f.replace(/\.html$/, ""), slots, kind, railMoves, railArea, spine });
}
const full = rows.filter((r) => r.kind === "full stage").length;
const rail = rows.filter((r) => r.kind === "rail only").length;
const pagesOnly = rows.filter((r) => r.kind === "pages only").length;
const filesOnly = rows.filter((r) => r.kind === "files only").length;
const own = rows.filter((r) => r.kind === "its own").length;
const ticksOnly = rows.filter((r) => r.kind === "ticks only").length;
const share = rows.length ? full / rows.length : 0;

console.log(`stage presence — ${basename(dir)}`);
for (const r of rows) console.log(`  ${r.frame.padEnd(22)} ${r.kind}`);
console.log(`\n  full stage ${full}/${rows.length} (${Math.round(share * 100)}%) · pages ${pagesOnly} · files ${filesOnly} · rail only ${rail}${ticksOnly ? ` · ticks only ${ticksOnly}` : ""} · its own ${own}`);
const over = share > maxShare;
console.log(over
  ? `  ✗ over the ${Math.round(maxShare * 100)}% target: the diagram is the video, not its context (style guide §5)`
  : `  ✓ within the ${Math.round(maxShare * 100)}% target`);

// ---- the rail, held to the same test ----
const withRail = rows.filter((r) => r.slots);
const railStill = withRail.filter((r) => !r.railMoves);
const railPct = rows.length ? withRail.length / rows.length : 0;
const stillPct = rows.length ? railStill.length / rows.length : 0;
// the rail has two sizes (a spine is 1.4% of the frame, a full rail 16%), so what the video spends is
// the average across every beat
const railFull = withRail.filter((r) => !r.spine), spines = withRail.filter((r) => r.spine);
const avg = rows.length ? rows.reduce((a, r) => a + r.railArea, 0) / rows.length : 0;
const biggest = Math.max(0, ...rows.map((r) => r.railArea));
console.log(`\n  rail on ${withRail.length}/${rows.length} (${Math.round(railPct * 100)}%) — ${railFull.length} full, ${spines.length} spine · a still picture on ${railStill.length} (${Math.round(stillPct * 100)}%)`);
console.log(`  costs ${(avg * 100).toFixed(1)}% of the average frame (largest ${(biggest * 100).toFixed(1)}%)`);
// Only the full rail can fail the still-picture test: at 16% of the frame, still, it is spending the
// frame. The step ticks (a 44 px spine) are optional: a scene draws them where it has room and a
// reason, and nothing here asks for them or credits them. Still ticks on most scenes are a △.
const stillFull = railStill.filter((r) => !r.spine), stillTicks = railStill.filter((r) => r.spine);
const railOver = rows.length ? stillFull.length / rows.length > maxShare : false;
const ticksOver = rows.length ? stillTicks.length / rows.length > maxShare : false;
console.log(railOver
  ? `  ✗ the rail is a still picture on more than ${Math.round(maxShare * 100)}% of beats — it is spending ${(avg * 100).toFixed(1)}% of the average frame to say nothing (style guide §5)`
  : stillFull.length ? `  ✓ the full rail is still on ${stillFull.length} of ${rows.length} beats, within the ${Math.round(maxShare * 100)}% target` : `  ✓ no still full rail`);
if (ticksOver) console.log(`  △ the step ticks sit still on ${stillTicks.length} of ${rows.length} beats: they are optional, so keep them only where a scene has room and a reason (style guide §5)`);
if (railStill.length) console.log(`    still on: ${railStill.map((r) => r.frame + (r.spine ? " (ticks)" : "")).join(", ")}`);
process.exit(over || railOver ? 1 : 0);
