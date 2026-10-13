#!/usr/bin/env node
// Check one frame or a batch as it lands (plans/2026-10-10-cheaper-videos, steps 1 and 11): the frame rules a program can see
// (frame-lint, on this frame's file); HyperFrames' layout and contrast check on its slot of the assembled video, as
// advice (lib/frame-layout.mjs layoutCheck: text overflowing or overlapping, in seconds; looked at three times in one
// frame it is stricter than verify, so it never fails the frame: build's first stage runs verify's own check); and
// one picture of it at rest, taken near the end of the frame's slot (index.html's data-start and data-duration), at
// .hyperframes/shots/<frame>.png. Every frame worker used to write its own screenshot harness for this; one set of
// them filled a disk.
//
// usage: reelplanner frame-check <video-dir> <frame> [<frame>…] [--no-shot] [--no-layout]
//   a frame is its number (4, 04) as the storyboard numbers it. A batch shares one layout check and one snapshot
//   browser, retaining each frame's three layout moments and plain at-rest PNG. Exit 1 for frame-lint, framework
//   lint/runtime errors, incomplete browser checks or failed pictures. Layout/motion/contrast findings are advice;
//   verify judges the assembled video. Unassembled frames get static checks and an explanation.
import { existsSync, readFileSync, mkdirSync, mkdtempSync, readdirSync, copyFileSync, rmSync } from "node:fs";
import { join, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/env.mjs";
import { storyboardFrames } from "./lib/terms.mjs";
import { layoutCheck, findingLine, slotOf } from "./lib/frame-layout.mjs";

const args = process.argv.slice(2);
const die = (m, code = 1) => { console.error(`✗ frame-check: ${m}`); process.exit(code); };
const usage = "usage: reelplanner frame-check <video-dir> <frame> [<frame>…] [--no-shot] [--no-layout]";
for (const a of args) if (a.startsWith("-") && !["--no-shot", "--no-layout"].includes(a)) die(`unknown option ${a}\n${usage}`);
const [target, ...asked] = args.filter((a) => !a.startsWith("--"));
if (!target || !asked.length) die(usage);
const dir = resolve(target), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const frames = storyboardFrames(read(join(dir, "STORYBOARD.md")));
if (!frames.length) die(`no STORYBOARD.md frames in ${target}`);
const selected = [...new Set(asked.map((which) => {
  const f = /^\d+$/.test(which) && frames.find((x) => x.index === Number(which));
  if (!f) die(`no frame ${which} in the storyboard (it has ${frames.map((x) => x.index).sort((a, b) => a - b).join(", ")})`);
  const src = f.meta.src && join(dir, f.meta.src);
  if (!src || !existsSync(src)) die(`frame ${f.index}'s file is not there yet: ${f.meta.src || "(no src: in the storyboard)"}`);
  return f;
}))];
const rel = (p) => relative(process.cwd(), p) || p;

// the rules a program can see, on this frame alone
const lint = spawnSync(process.execPath, [join(ROOT, "scripts", "frame-lint.mjs"), ...selected.map((f) => join(dir, f.meta.src))], { cwd: dir, encoding: "utf8" });
process.stdout.write(lint.stdout || ""); process.stderr.write(lint.stderr || "");
let failed = lint.status !== 0;

// the layout: HyperFrames' check, on this frame's slot, keeping what it finds in this frame's file
if (!args.includes("--no-layout")) {
  const l = layoutCheck(dir, selected);
  for (const n of l.missing || []) console.log(`△ no layout check: frame ${n} is not in index.html yet (build assembles it)`);
  for (const x of [...(l.global?.errors || []), ...(l.global?.warnings || [])]) console.log(`${(l.blockers || []).includes(x) ? "✗" : "△"} the video: ${x.sourceFile ? `${x.sourceFile}: ` : ""}${findingLine(x)}`);
  for (const f of selected) {
    if (!l.byFrame?.has(f.index)) continue;
    const { errors, warnings } = l.byFrame.get(f.index);
    for (const x of [...errors, ...warnings]) console.log(`${(l.blockers || []).includes(x) ? "✗" : "△"} ${findingLine(x)}`);
    if (l.ran && !(l.blockers || []).length) {
      const s = slotOf(dir, String(f.meta.src).replace(/^\.\//, ""));
      const at = [s.start + s.duration * 0.25, s.start + s.duration * 0.6, s.start + Math.max(0, s.duration - 0.4)].map((t) => +t.toFixed(3));
      console.log(`${errors.length + warnings.length ? "△" : "✓"} layout at ${at.join(", ")}s${selected.length > 1 ? ` (frame ${f.index})` : ""}${errors.length + warnings.length ? `: ${errors.length + warnings.length} to look at (advice: verify judges the whole video at its own moments)` : ""}`);
    }
  }
  if ((l.blockers || []).length) failed = true;
  if (!l.ran && (l.byFrame?.size || !l.missing?.length)) { console.log(`✗ no layout check: ${l.why}`); failed = true; }
}

// the picture: near the end of the frame's slot in the assembled video
if (!args.includes("--no-shot")) {
  const placed = selected.flatMap((f) => {
    const s = slotOf(dir, String(f.meta.src).replace(/^\.\//, ""));
    if (!s) { console.log(`△ no picture: frame ${f.index} is not in index.html yet (reelplanner build ${rel(dir)} assembles it; or add its scene to index.html)`); return []; }
    return [{ f, t: +(s.start + Math.max(0, s.duration - 0.4)).toFixed(3) }];
  });
  if (placed.length) {
    const at = [...new Set(placed.map((p) => p.t))].sort((a, b) => a - b), tmp = mkdtempSync(join(tmpdir(), "rp-frame-check-"));
    try {
      const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "snapshot", "-o", tmp, "--at", at.join(","), "--no-end", "--describe", "false"], { cwd: dir, encoding: "utf8" });
      const pngs = readdirSync(tmp).filter((x) => /^frame-\d+-at-.*\.png$/.test(x));
      for (const { f, t } of placed) {
        const png = pngs.find((x) => Number(/^frame-\d+-at-(.*)s\.png$/.exec(x)?.[1]) === t);
        if (r.status === 0 && png) {
          mkdirSync(join(dir, ".hyperframes", "shots"), { recursive: true });
          const shot = join(dir, ".hyperframes", "shots", `${String(f.index).padStart(2, "0")}-${basename(f.meta.src, ".html")}.png`);
          // Copy: two unusually short/overlapping slots can request the same timestamp.
          copyFileSync(join(tmp, png), shot);
          console.log(`✓ picture at ${t}s (the frame at rest): ${rel(shot)}`);
        } else { console.log(`✗ no picture: frame ${f.index}: hyperframes snapshot said ${((r.stderr || r.stdout || "").trim().split("\n").at(-1)) || "no PNG for its requested moment"}`); failed = true; }
      }
    } finally { rmSync(tmp, { recursive: true, force: true }); }
  }
}
process.exit(failed ? 1 : 0);
