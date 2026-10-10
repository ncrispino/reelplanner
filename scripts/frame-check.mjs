#!/usr/bin/env node
// Check one frame as it lands (plans/2026-10-10-cheaper-videos, steps 1 and 11): the frame rules a program can see
// (frame-lint, on this frame's file); HyperFrames' layout and contrast check on its slot of the assembled video
// (lib/frame-layout.mjs: text overflowing or overlapping, found in seconds rather than a minute into a build); and
// one picture of it at rest, taken near the end of the frame's slot (index.html's data-start and data-duration), at
// .hyperframes/shots/<frame>.png. Every frame worker used to write its own screenshot harness for this; one set of
// them filled a disk.
//
// usage: reelplanner frame-check <video-dir> <frame> [--no-shot] [--no-layout]
//   the frame is its number (4, 04) as the storyboard numbers it. Exit 1 when frame-lint or the layout check finds
//   an error; the picture is taken either way, when the frame is in index.html (else it says how to put it there).
import { existsSync, readFileSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/env.mjs";
import { storyboardFrames } from "./lib/terms.mjs";
import { layoutCheck, findingLine } from "./lib/frame-layout.mjs";

const args = process.argv.slice(2);
const die = (m, code = 1) => { console.error(`✗ frame-check: ${m}`); process.exit(code); };
const [target, which] = args.filter((a) => !a.startsWith("--"));
if (!target || !which) die("usage: reelplanner frame-check <video-dir> <frame> [--no-shot]");
const dir = resolve(target), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const frames = storyboardFrames(read(join(dir, "STORYBOARD.md")));
if (!frames.length) die(`no STORYBOARD.md frames in ${target}`);
const f = frames.find((x) => x.index === Number(which));
if (!f) die(`no frame ${which} in the storyboard (it has ${frames.map((x) => x.index).sort((a, b) => a - b).join(", ")})`);
const src = f.meta.src && join(dir, f.meta.src);
if (!src || !existsSync(src)) die(`frame ${f.index}'s file is not there yet: ${f.meta.src || "(no src: in the storyboard)"}`);
const rel = (p) => relative(process.cwd(), p) || p;

// the rules a program can see, on this frame alone
const lint = spawnSync(process.execPath, [join(ROOT, "scripts", "frame-lint.mjs"), src], { cwd: dir, encoding: "utf8" });
process.stdout.write(lint.stdout || ""); process.stderr.write(lint.stderr || "");

// the layout: HyperFrames' check, on this frame's slot, keeping what it finds in this frame's file
let layoutBad = 0;
if (!args.includes("--no-layout")) {
  const l = layoutCheck(dir, [f]);
  if (!l.ran) console.log(`△ no layout check: ${l.missing.length ? `frame ${f.index} is not in index.html yet (build assembles it)` : l.why}`);
  else {
    const { errors, warnings } = l.byFrame.get(f.index);
    for (const x of errors) console.log(`✗ ${findingLine(x)}`);
    for (const x of warnings) console.log(`△ ${findingLine(x)}`);
    if (!errors.length) console.log(`✓ layout at ${l.at.join(", ")}s${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}`);
    layoutBad = errors.length;
  }
}

// the picture: near the end of the frame's slot in the assembled video
let shot = null;
if (!args.includes("--no-shot")) {
  const html = read(join(dir, "index.html")), file = f.meta.src.replace(/^\.\//, "");
  const el = [...html.matchAll(/<div\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`data-composition-src="${file}"`));
  const num = (k) => Number((new RegExp(`${k}="([\\d.]+)"`).exec(el || "") || [])[1]);
  if (!el || !Number.isFinite(num("data-start")) || !Number.isFinite(num("data-duration"))) {
    console.log(`△ no picture: frame ${f.index} is not in index.html yet (reelplanner build ${rel(dir)} assembles it; or add its scene to index.html)`);
  } else {
    const t = +(num("data-start") + Math.max(0, num("data-duration") - 0.4)).toFixed(3), tmp = mkdtempSync(join(tmpdir(), "rp-frame-check-"));
    const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "snapshot", "-o", tmp, "--at", String(t), "--no-end", "--describe", "false"], { cwd: dir, encoding: "utf8" });
    const png = existsSync(tmp) ? readdirSync(tmp).find((x) => x.endsWith(".png")) : null;
    if (r.status === 0 && png) {
      mkdirSync(join(dir, ".hyperframes", "shots"), { recursive: true });
      shot = join(dir, ".hyperframes", "shots", `${String(f.index).padStart(2, "0")}-${basename(src, ".html")}.png`);
      renameSync(join(tmp, png), shot);
      console.log(`✓ picture at ${t}s (the frame at rest): ${rel(shot)}`);
    } else console.log(`△ no picture: hyperframes snapshot said ${((r.stderr || r.stdout || "").trim().split("\n").at(-1)) || "nothing"}`);
    rmSync(tmp, { recursive: true, force: true });
  }
}
process.exit(lint.status === 0 && !layoutBad ? 0 : 1);
