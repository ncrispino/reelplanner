#!/usr/bin/env node
// Check a frame as it lands (plans/2026-10-10-cheaper-videos, steps 1 and 11): the frame rules a program can see
// (frame-lint, and HyperFrames' own lint, on this frame's file); HyperFrames' layout and contrast check on its slot of the assembled video, as
// advice (lib/frame-layout.mjs layoutCheck: text overflowing or overlapping, in seconds; looked at three times in one
// frame it is stricter than verify, so it never fails the frame: build's first stage runs verify's own check); and
// one picture of it at rest, taken near the end of the frame's slot (index.html's data-start and data-duration), at
// .hyperframes/shots/<frame>.png. Every frame worker used to write its own screenshot harness for this; one set of
// them filled a disk. Several frames are checked in one go, each check run once for them all: in a bench run, eight
// frames checked one by one took two minutes, most of it starting a browser sixteen times.
//
// usage: reelplanner frame-check <video-dir> <frame>… [--no-shot] [--no-layout]
//   a frame is its number (4, 04) as the storyboard numbers it; `all` is every frame. Exit 1 when frame-lint fails or
//   HyperFrames' lint finds an error in a frame's file; the layout's findings
//   are △ lines; the picture is taken either way, when the frame is in index.html (else it says how to put it there).
import { existsSync, readFileSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve, relative, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { ROOT } from "./lib/env.mjs";
import { storyboardFrames } from "./lib/terms.mjs";
import { layoutCheck, hfLint, findingLine, slotOf } from "./lib/frame-layout.mjs";

const args = process.argv.slice(2);
const die = (m, code = 1) => { console.error(`✗ frame-check: ${m}`); process.exit(code); };
const [target, ...which] = args.filter((a) => !a.startsWith("--"));
if (!target || !which.length) die("usage: reelplanner frame-check <video-dir> <frame>… (or all) [--no-shot] [--no-layout]");
const dir = resolve(target), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const frames = storyboardFrames(read(join(dir, "STORYBOARD.md"))).sort((a, b) => a.index - b.index);
if (!frames.length) die(`no STORYBOARD.md frames in ${target}`);
const asked = which.includes("all") ? frames : [...new Set(which.map((w) => frames.find((x) => x.index === Number(w))
  || die(`no frame ${w} in the storyboard (it has ${frames.map((x) => x.index).join(", ")})`)))];
for (const f of asked) if (!f.meta.src || !existsSync(join(dir, f.meta.src))) die(`frame ${f.index}'s file is not there yet: ${f.meta.src || "(no src: in the storyboard)"}`);
const fileOf = (f) => f.meta.src.replace(/^\.\//, ""), rel = (p) => relative(process.cwd(), p) || ".";

// the rules a program can see, on these frames alone
const lint = spawnSync(process.execPath, [join(ROOT, "scripts", "frame-lint.mjs"), ...asked.map((f) => join(dir, f.meta.src))], { cwd: dir, encoding: "utf8" });
process.stdout.write(lint.stdout || ""); process.stderr.write(lint.stderr || "");
// HyperFrames' own lint, what these frames' files hold of it: an error there stops the build (finish-project's and
// verify's `check` run it), so it fails the frame now. A second, nothing assembled needed. (A bench run's workers
// styled each frame's root by its class, frame-check passed every frame, and the build stopped on all seven.)
const hl = hfLint(dir, asked);
if (!hl.ran) console.log(`△ no HyperFrames lint: ${hl.why}`);
const failedLint = lint.status !== 0 || (hl.ran && [...hl.byFrame.values()].some((x) => x.errors.length > 0));

// the layout: HyperFrames' check, on these frames' slots, keeping what it finds in their files
const layout = args.includes("--no-layout") ? null : layoutCheck(dir, asked);
if (layout && !layout.ran && layout.missing.length < asked.length) console.log(`△ no layout check: ${layout.why}`);

// the pictures: near the end of each frame's slot in the assembled video, all in one snapshot
const shots = new Map(), noShot = new Map();
if (!args.includes("--no-shot")) {
  const at = asked.map((f) => ({ f, slot: slotOf(dir, fileOf(f)) })).filter((x) => x.slot)
    .map(({ f, slot }) => ({ f, t: +(slot.start + Math.max(0, slot.duration - 0.4)).toFixed(3) }));
  if (at.length) {
    const tmp = mkdtempSync(join(tmpdir(), "rp-frame-check-"));
    const r = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "snapshot", "-o", tmp, "--at", at.map((x) => x.t).join(","), "--no-end", "--describe", "false"], { cwd: dir, encoding: "utf8" });
    // its files are frame-<n>-at-<t>s.png, n counting the times as given
    const pngs = existsSync(tmp) ? readdirSync(tmp).filter((x) => /^frame-\d+-at-.*\.png$/.test(x)) : [];
    const said = ((r.stderr || r.stdout || "").trim().split("\n").at(-1)) || "nothing";
    for (const [i, { f, t }] of at.entries()) {
      const png = r.status === 0 && pngs.find((x) => Number(/^frame-(\d+)-/.exec(x)[1]) === i);
      if (!png) { noShot.set(f.index, `hyperframes snapshot said ${said}`); continue; }
      mkdirSync(join(dir, ".hyperframes", "shots"), { recursive: true });
      const shot = join(dir, ".hyperframes", "shots", `${String(f.index).padStart(2, "0")}-${basename(f.meta.src, ".html")}.png`);
      renameSync(join(tmp, png), shot);
      shots.set(f.index, { shot, t });
    }
    rmSync(tmp, { recursive: true, force: true });
  }
}

// what each frame got, under its name when there are several (a frame with nothing to say is left out; none assembled
// yet, as before a first build, is said once)
const noneAssembled = asked.length > 1 && asked.every((f) => !slotOf(dir, fileOf(f)));
if (noneAssembled && !(args.includes("--no-layout") && args.includes("--no-shot")))
  console.log(`△ no layout check or pictures: these frames are not in index.html yet (reelplanner build ${rel(dir)} assembles them)`);
for (const f of asked) {
  const out = [], say = (l) => out.push(l);
  const mine = hl.ran ? hl.byFrame.get(f.index) : null;
  for (const x of mine ? [...mine.errors, ...mine.warnings] : []) say(`${x.severity === "error" ? "✗" : "△"} ${findingLine(x)}`);
  if (layout && !noneAssembled) {
    if (!layout.ran || layout.missing.includes(f.index)) {
      if (layout.missing.includes(f.index)) say(`△ no layout check: frame ${f.index} is not in index.html yet (build assembles it)`);
    } else {
      // its lint is said above
      const [errors, warnings] = ["errors", "warnings"].map((k) => layout.byFrame.get(f.index)[k].filter((x) => x.part !== "lint"));
      for (const x of [...errors, ...warnings]) say(`△ ${findingLine(x)}`);
      say(`${errors.length + warnings.length ? "△" : "✓"} layout at ${layout.atOf.get(f.index).join(", ")}s${errors.length + warnings.length ? `: ${errors.length + warnings.length} to look at (advice: verify judges the whole video at its own moments)` : ""}`);
    }
  }
  if (!args.includes("--no-shot") && !noneAssembled) {
    if (shots.has(f.index)) say(`✓ picture at ${shots.get(f.index).t}s (the frame at rest): ${rel(shots.get(f.index).shot)}`);
    else if (noShot.has(f.index)) say(`△ no picture: ${noShot.get(f.index)}`);
    else say(`△ no picture: frame ${f.index} is not in index.html yet (reelplanner build ${rel(dir)} assembles it; or add its scene to index.html)`);
  }
  if (out.length) console.log((asked.length > 1 ? `\nframe ${f.index} (${basename(f.meta.src)})\n` : "") + out.join("\n"));
}
process.exit(failedLint ? 1 : 0);
