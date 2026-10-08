#!/usr/bin/env node
// Each frame's thumbnail in plan-map.json names a picture that is there (lib/thumbs.mjs, snapshot.sh).
//
// plan-map runs in the build's finish-project, before verify takes the pictures (snapshot, at each frame's
// midpoint, named frame-NN-at-<t>s.png): the map it writes names the last build's pictures, or none on a first
// build. Once verify replaced them, every thumbnail of a frame that moved named a file that was not there, and
// a new frame had none (the walkthrough videos of close-the-lifecycle, richer-review, deep-dives, the plan video
// of walkthroughs-that-help). Against a scratch video and a stand-in for the HyperFrames CLI (`_RP_HF_BIN`,
// scripts/lib/project-dir.sh), which answers `timeline --json` and takes `snapshot --at` as empty files:
//   - plan-map on a rebuild names the last build's pictures (the order the build runs in)
//   - verify (lint, check, details, fresh eyes, snapshot) sets them again: every frame has a thumbnail, each
//     names a picture in snapshots/, the one at its midpoint; the rest of the map (plan-diff's `changes`) kept
//   - `reelplanning snapshot` alone does the same, and `plan-map --thumbs` with no pictures leaves none stale
//   - the choice itself: the picture nearest a frame's midpoint of those inside it (not the first listed, not
//     an end-of-timeline picture), a frame with none inside it takes none further than its length away, and
//     one frame's choice never changes another's
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { attachThumbs } from "../lib/thumbs.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2000)}` : ""}`); if (!cond) failed++; };
const tmp = mkdtempSync(join(tmpdir(), "rp-thumbs-spec-")), P = join(tmp, "video"), HF = join(tmp, "fake-hf.mjs");

// ── the choice ──────────────────────────────────────────────────────────────────────────────────────
{ const fr = () => [{ index: 1, start: 0, durationSeconds: 10 }, { index: 2, start: 10, durationSeconds: 4 }, { index: 3, start: 14, durationSeconds: 6 }];
  const snaps = [{ file: "frame-00-at-1s.png", t: 1 }, { file: "frame-01-at-5s.png", t: 5 }, { file: "frame-02-at-19.5s.png", t: 19.5 }, { file: "frame-03-at-17s.png", t: 17 }];
  const f = fr(), n = attachThumbs(f, snaps);
  ok("nearest the midpoint of the pictures inside the frame, not the first listed", f[0].thumb === "snapshots/frame-01-at-5s.png", f[0].thumb);
  ok("a frame with no picture inside takes none further than its length from its midpoint", !("thumb" in f[1]) && n === 2, JSON.stringify(f[1]));
  ok("an end-of-timeline picture is not taken over the one at the midpoint", f[2].thumb === "snapshots/frame-03-at-17s.png", f[2].thumb);
  ok("the pictures' order is left as it was (one frame's choice never reorders another's)", snaps.map((s) => s.t).join() === "1,5,19.5,17");
  const g = fr(); g[1].thumb = "snapshots/gone.png"; attachThumbs(g, []);
  ok("with no pictures, a thumbnail left from earlier ones is removed", g.every((x) => !("thumb" in x)), JSON.stringify(g)); }

// ── a scratch video: three frames, 4 + 6 + 5 s ───────────────────────────────────────────────────────
const DUR = [4, 6, 5];
mkdirSync(join(P, "compositions", "frames"), { recursive: true });
writeFileSync(join(P, "STORYBOARD.md"), `---\ntitle: "Thumbs"\n---\n\n# Thumbs\n\n${DUR.map((d, i) => `## Frame ${i + 1} — Scene ${i + 1}\n\n- src: compositions/frames/0${i + 1}-scene.html\n- duration: ${d}\n- type: feature_showcase\n`).join("\n")}`);
writeFileSync(join(P, "SCRIPT.md"), `# SCRIPT\n\n---\n\n${DUR.map((_, i) => `## Line ${i + 1} — Scene ${i + 1} (Frame ${i + 1})\n\n**Delivery:** Plain.\n\nScene ${i + 1}.\n`).join("\n")}`);
writeFileSync(join(P, "index.html"), "<!doctype html><html><body></body></html>\n");
for (let i = 0; i < DUR.length; i++) writeFileSync(join(P, "compositions", "frames", `0${i + 1}-scene.html`), "<template></template>\n");
writeFileSync(join(P, "timeline.json"), JSON.stringify({ timeline: { tracks: [{ kind: "graphics", rows: DUR.map((d, i) => ({ src: `compositions/frames/0${i + 1}-scene.html`, start: DUR.slice(0, i).reduce((a, b) => a + b, 0), duration: d })) }] } }));
// the stand-in CLI: timeline from timeline.json; snapshot replaces snapshots/ with one file per --at time (and an
// end-of-timeline one, as the real CLI's --end); everything else passes
writeFileSync(HF, `
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
const a = process.argv.slice(2), at = (a.find((x) => x.startsWith("--at=")) || "").slice(5) || a[a.indexOf("--at") + 1];
if (a[0] === "timeline") process.stdout.write(readFileSync("timeline.json", "utf8"));
else if (a[0] === "snapshot") { rmSync("snapshots", { recursive: true, force: true }); mkdirSync("snapshots");
  const ts = [...String(at || "1,2,3,4,5").split(",").map(Number), 14.2];
  ts.forEach((t, i) => writeFileSync("snapshots/frame-" + String(i).padStart(2, "0") + "-at-" + t + "s.png", ""));
  writeFileSync("snapshots/contact-sheet.jpg", ""); console.log("snapshots: " + ts.length); }
else console.log("fake hf " + a.join(" "));
`);
const env = { ...process.env, _RP_HF_BIN: HF };
const sh = (script, ...args) => spawnSync("bash", [join(ROOT, "scripts", script), ...args], { cwd: tmp, env, encoding: "utf8" });
const node = (...args) => spawnSync(process.execPath, args, { cwd: tmp, env, encoding: "utf8" });
const map = () => JSON.parse(readFileSync(join(P, "plan-map.json"), "utf8"));
const named = () => map().frames.map((f) => f.thumb || null);
const there = () => map().frames.every((f) => f.thumb && existsSync(join(P, f.thumb)));

// the last build's pictures, taken when every frame was 3 s (midpoints 1.5, 4.5, 7.5)
mkdirSync(join(P, "snapshots"));
for (const [i, t] of [1.5, 4.5, 7.5].entries()) writeFileSync(join(P, "snapshots", `frame-0${i}-at-${t}s.png`), "");
let r = node(join(ROOT, "scripts", "plan-map.mjs"), P);
ok("plan-map writes the map", r.status === 0 && existsSync(join(P, "plan-map.json")), r.stdout + r.stderr);
ok("plan-map, run before this build's pictures are taken, names the last build's (the order finish-project → verify runs in)", named()[0] === "snapshots/frame-00-at-1.5s.png" && !named()[2], JSON.stringify(named()));
{ const m = map(); m.changes = { build: "abc123", changedFrames: [2] }; writeFileSync(join(P, "plan-map.json"), JSON.stringify(m, null, 2) + "\n"); }

// verify: its snapshot step takes this build's pictures and sets the thumbnails from them
r = sh("verify.sh", P);
ok("verify passes against the stand-in CLI", r.status === 0, r.stdout + r.stderr);
ok("after verify every frame has a thumbnail, and each names a picture that is there", there(), JSON.stringify(named()) + " · " + (existsSync(join(P, "snapshots")) ? readdirSync(join(P, "snapshots")).join(", ") : "no snapshots/"));
ok("each thumbnail is the picture at its frame's midpoint", JSON.stringify(named()) === JSON.stringify(["snapshots/frame-00-at-2s.png", "snapshots/frame-01-at-7s.png", "snapshots/frame-02-at-12.5s.png"]), JSON.stringify(named()));
ok("the rest of the map is kept (plan-diff's changes)", map().changes?.build === "abc123" && map().frames.length === 3, JSON.stringify(map().changes));
ok("verify says the thumbnails were set", /plan-map\.json thumbnails: 3 of 3 frames/.test(r.stdout), r.stdout.slice(-800));

// `reelplanning snapshot` alone: a fresh clone (snapshots/ is not in git) gets them back
rmSync(join(P, "snapshots"), { recursive: true, force: true });
r = node(join(ROOT, "bin", "reelplanning.mjs"), "plan-map", P, "--thumbs");
ok("plan-map --thumbs with no pictures leaves no thumbnail naming a missing file, and says so", r.status === 0 && named().every((x) => x === null) && /△ plan-map\.json thumbnails: 0 of 3/.test(r.stdout), r.stdout + r.stderr);
r = node(join(ROOT, "bin", "reelplanning.mjs"), "snapshot", P);
ok("reelplanning snapshot takes the pictures and sets the thumbnails again", r.status === 0 && there(), r.stdout + r.stderr);

rmSync(tmp, { recursive: true, force: true });
if (failed) { console.error(`\n✗ ${failed} check(s) failed`); process.exit(1); }
console.log("\n✓ thumbs: every thumbnail names a picture that is there");
