#!/usr/bin/env node
// `reelplanner stillness`: how much of a rendered video sits still (lib/stillness.mjs).
//   - freezedetect's and the scene score's lines are read into stretches, a still share, the longest stretch and jolts;
//     a stretch still at the end of the video ends at its duration
//   - the bar is under 25% still and no stretch over 3 s; past it the line is a △ and the command still exits 0
//     (--strict exits 1)
//   - a folder with no render says so and exits 1
//   - with ffmpeg here, on made-up MP4s: a picture that keeps moving passes; one that stops for 5 s does not; a
//     picture still above the caption band, with only the band changing, counts as still
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { parseFreezes, parseJolts, summarize, stillnessLines, hasFfmpeg } from "../lib/stillness.mjs";

const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const tmp = mkdtempSync(join(tmpdir(), "rp-stillness-"));
const cli = (...a) => { const r = spawnSync("node", [join(ROOT, "scripts", "stillness.mjs"), ...a], { cwd: tmp, encoding: "utf8" }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };

// ── reading ffmpeg's lines ──
const fd = `[freezedetect @ 0x1] lavfi.freezedetect.freeze_start: 2.5
[freezedetect @ 0x1] lavfi.freezedetect.freeze_duration: 1.6
[freezedetect @ 0x1] lavfi.freezedetect.freeze_end: 4.1
[freezedetect @ 0x1] lavfi.freezedetect.freeze_start: 17
`;
const runs = parseFreezes(fd, 20);
ok(JSON.stringify(runs) === "[[2.5,4.1],[17,20]]", `stretches read, the last one ending at the video's end — ${JSON.stringify(runs)}`);
const s = summarize(runs, 20);
ok(s.stillSeconds === 4.6 && s.stillShare === 0.23 && s.longest === 3 && s.longestAt.join() === "17,20", `the share and the longest stretch — ${JSON.stringify(s)}`);
ok(s.passes, "23% still with a 3 s stretch is inside the bar (under 25%, none over 3 s)");
ok(JSON.stringify(s.stretches) === "[[17,20]]", "only stretches of 2 s or more are listed");
ok(!summarize([[0, 3.2]], 20).passes, "a 3.2 s stretch is past the bar, though only 16% of the video");
ok(!summarize([[0, 2], [5, 7], [10, 12]], 20).passes, "30% still is past the bar, though no stretch is over 3 s");

const sc = [0.001, 0.002, 0.09, 0.003, 0.002, 0.05, 0.04, 0.001].map((v, i) => `frame:${i} pts:${i} pts_time:${(i / 30).toFixed(4)}\nlavfi.scene_score=${v}\n`).join("");
const j = parseJolts(sc, 0.03);
ok(j.length === 1 && j[0][1] === 0.09, `a jolt is one frame over the bar with quiet neighbours; a change over two frames is a move — ${JSON.stringify(j)}`);

const lines = stillnessLines({ ...summarize([[1, 6]], 10), jolts: [[3, 0.08]] });
ok(lines[0].warn && /^stillness {2}50% still \(5 s of 10 s\), longest 5 s at 1–6 s, 1 jolt/.test(lines[0].text), `past the bar the head line is a warning — ${lines[0].text}`);
ok(lines.some((l) => l.detail && /^still 1–6 s/.test(l.text)) && lines.some((l) => l.detail && /^jolt at 3 s/.test(l.text)), "the stretches and jolts are listed under it");

// ── the command ──
mkdirSync(join(tmp, "no-render"));
const none = cli("no-render");
ok(none.code === 1 && /no render at .*renders\/video\.mp4/.test(none.out), `a video with no render says so — ${none.out.trim()}`);

if (!hasFfmpeg()) ok(true, "the made-up renders (skipped: ffmpeg is not on PATH)");
else {
  // a 640 × 360 paper with one box laid over it at x(t), y (overlay evaluates its position every frame)
  const make = (name, x, y, w = 80, h = 80, secs = 10) => {
    const p = join(tmp, `${name}.mp4`);
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", `color=c=0xFAF9F5:s=640x360:r=30:d=${secs}`,
      "-f", "lavfi", "-i", `color=c=0x3355AA:s=${w}x${h}:r=30:d=${secs}`,
      "-filter_complex", `[0][1]overlay=x='${x}':y=${y}:shortest=1`, "-pix_fmt", "yuv420p", p], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(r.stderr);
    return p;
  };
  // a box that moves across the stage all the time
  const moving = cli(make("moving", "mod(t*120,560)", 80));
  ok(moving.code === 0 && /^✓ stillness {2}0% still/m.test(moving.out), `a picture that keeps moving passes — ${moving.out.split("\n")[0]}`);
  // the box moves for 2 s, then the stage sits for 5 s, then it moves again
  const paused = make("paused", "if(lt(t,2),t*120,if(lt(t,7),240,240+(t-7)*120))", 80);
  const p = cli(paused);
  ok(p.code === 0 && /^△ stillness {2}\d+% still .*longest [45]\.\d+ s at 2(\.\d)?–7/m.test(p.out), `a 5 s stop is past the bar, said as a △ with where it is, and exits 0 — ${p.out.split("\n")[0]}`);
  ok(cli(paused, "--strict").code === 1, "--strict exits 1 past the bar");
  const js = JSON.parse(cli(paused, "--json").out);
  ok(js.passes === false && js.longest >= 4.5 && js.longest <= 5.2, `--json gives the numbers — longest ${js.longest}`);
  // the stage sits still above; only a box in the bottom sixth (the caption band) moves
  const band = cli(make("band", "mod(t*120,560)", 320, 80, 30));
  ok(/^△ stillness {2}100% still/m.test(band.out), `a change only in the caption band is not motion — ${band.out.split("\n")[0]}`);
}

rmSync(tmp, { recursive: true, force: true });
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
