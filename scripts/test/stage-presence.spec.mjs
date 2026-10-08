#!/usr/bin/env node
// `reelplanning stage-presence` on the two shapes of rail a frame can draw. Every frame carries the
// shared stage stylesheet, so the CSS for both the 500x640 rail and the 44x640 spine is on every
// frame; which one the frame costs is decided by the element it draws, not by the rules it carries.
//   - a video whose spine (the step ticks) is still on every beat reports and exits 0 with a △: the ticks
//     are optional (better-visuals step 1), so they neither fail the check nor pass it as "the rail earns
//     its place" (they used to be its cheapest pass); a spine-only beat counts as "ticks only", not "rail only"
//   - a video whose full rail is still on every beat reports the ✗ with its cost and exits 1
//   - neither run throws (a stale `foot` variable used to crash the ✗ line)
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const tmp = mkdtempSync(join(tmpdir(), "rp-stage-presence-"));

// one beat: the shared stage CSS, then either the spine (ticks) or the full rail (slots), and a
// timeline that moves neither, so the rail or spine is a still picture on this beat
const frame = (id, draws) => {
  const p = `f${id}`;
  const body = draws === "spine"
    ? `<div class="${p}-spine" id="${p}-spine">${[1, 2, 3].map((n) => `<div class="${p}-tick" id="${p}-tick-${n}" data-plan-step="${n}" style="top:${(n - 1) * 110}px"></div>`).join("")}</div>`
    : `<div class="${p}-rail" id="${p}-rail">${[1, 2, 3].map((n) => `<div class="${p}-slot" id="${p}-slot-${n}" data-plan-step="${n}" style="top:${(n - 1) * 110}px"></div>`).join("")}</div>`;
  return `<style>
  .${p}-rail { position:absolute; left:80px; top:150px; width:500px; height:640px; }
  .${p}-slot { position:absolute; left:0; width:500px; height:90px; }
  .${p}-spine { position:absolute; left:80px; top:150px; width:44px; height:640px; }
  .${p}-tick { position:absolute; left:0; width:44px; height:20px; }
  .${p}-hero { position:absolute; left:700px; top:400px; }
</style>
<div id="root">
  ${body}
  <div class="${p}-hero" id="${p}-hero">What this beat is about</div>
</div>
<script>
  var tl = gsap.timeline({ paused: true });
  tl.fromTo("#${p}-hero", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.1);
  tl.fromTo("#${p}-tick-2", { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "#f60", duration: 0.4 }, 1);
</script>
`;
};
const project = (name, draws) => {
  const dir = join(tmp, name), frames = join(dir, "compositions", "frames");
  mkdirSync(frames, { recursive: true });
  for (const id of ["01-open", "02-step-1", "03-step-2", "04-close"]) writeFileSync(join(frames, `${id}.html`), frame(id.slice(0, 2), draws));
  return dir;
};
const run = (dir) => {
  const r = spawnSync("node", [join(ROOT, "scripts", "stage-presence.mjs"), dir], { cwd: tmp, encoding: "utf8" });
  return { code: r.status, out: r.stdout, err: r.stderr };
};

// a spine on every beat, still on every beat: 44x640 is 1.4% of the frame
const spine = run(project("spine-video", "spine"));
ok(!/Error/.test(spine.err), `the spine video runs without throwing${spine.err ? ` — ${spine.err.split("\n").find((l) => /Error/.test(l))}` : ""}`);
ok(/4 spine/.test(spine.out) && /0 full/.test(spine.out), `each beat counts as the spine it draws — ${spine.out.match(/rail on .*/)?.[0]}`);
ok(/costs 1\.4% of the average frame/.test(spine.out), `the spine costs 1.4% of the frame — ${spine.out.match(/costs .*/)?.[0]}`);
ok(!/earns its place/.test(spine.out) && /△ the step ticks sit still on 4 of 4 beats: they are optional/.test(spine.out), `still ticks are said as a △, not credited — ${spine.out.match(/.*ticks sit still.*/)?.[0] || spine.out.match(/.*earns.*/)?.[0]}`);
ok(/ticks only 4/.test(spine.out) && /rail only 0/.test(spine.out), `a beat that draws only the ticks counts as ticks only — ${spine.out.match(/full stage .*/)?.[0]}`);
ok(spine.code === 0, `the spine video exits 0 (got ${spine.code})`);

// the full rail on every beat, still on every beat: 500x640 is 15.4% of the frame
const rail = run(project("rail-video", "rail"));
ok(!/Error/.test(rail.err), `the full-rail video runs without throwing${rail.err ? ` — ${rail.err.split("\n").find((l) => /Error/.test(l))}` : ""}`);
ok(/4 full/.test(rail.out) && /0 spine/.test(rail.out), `a beat that draws the full rail counts as full, though the spine's CSS is on it — ${rail.out.match(/rail on .*/)?.[0]}`);
ok(/✗ the rail is a still picture on more than 50% of beats — it is spending 15\.4% of the average frame/.test(rail.out), `a still full rail gets the ✗ with its cost — ${rail.out.match(/✗ the rail.*/)?.[0]}`);
ok(rail.code === 1, `the full-rail video exits 1 (got ${rail.code})`);
ok(!/△ the step ticks/.test(rail.out), "the full rail is not reported as ticks");

rmSync(tmp, { recursive: true, force: true });
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
