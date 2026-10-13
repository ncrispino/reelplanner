#!/usr/bin/env node
// The frame worker's two commands (plans/2026-10-10-cheaper-videos, step 1), on a scratch copy of a built video:
//   frame-packet  one file with each asked frame's storyboard block, its line word by word with when each word is
//                 said, its file and id, the marks its beat needs (the bottom band always; a decision's heading and
//                 option cards), the theme by path and one finished sibling frame, and how to check a frame;
//                 "narration not ready" with the line's text before the voice exists; a frame the storyboard lacks
//                 is refused, naming the ones it has
//   frame-check   frame-lint on that frame, HyperFrames' layout check on its slot as advice (step 11: text overflowing
//                 its box is said in seconds, with HyperFrames' fix, and never fails it: verify judges the whole
//                 video), and one picture of it at rest from the assembled video; a frame-lint failure exits 1, the
//                 picture is taken all the same; a frame not in index.html yet gets no picture, and says how to put it
//                 there
//   the packet names fonts by family, which HyperFrames loads, and this video's font files (step 13)
// usage: node scripts/test/frame-tools.spec.mjs
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { ROOT, scratchCopy } from "../lib/env.mjs";
import { layoutCheck, slotOf, videoCheck, collapsedLayout } from "../lib/frame-layout.mjs";
import { storyboardFrames } from "../lib/terms.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const tmp = mkdtempSync(join(tmpdir(), "rp-frame-tools-")), V = join(tmp, "v");
scratchCopy(join(ROOT, "videos", "l2-upload-resume"), V, (p) => !/\/(renders|snapshots|node_modules)$/.test(p));
const rp = (...a) => spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), ...a], { cwd: tmp, encoding: "utf8" });

try {
  // Three fractional timestamps can round to one in a very short slot. HyperFrames
  // cannot call a finding transient when that slot supplied only one observation.
  const singleMoment = { code: "text_box_overflow", severity: "warning", sourceFile: "tiny.html", selector: ".label", text: "required label", time: 0 };
  ok("a slot with one distinct sample preserves a real warning", collapsedLayout([singleMoment], new Map([["tiny.html", 1]]), 6)[0].severity === "warning");
  // ── frame-packet ──
  const r = rp("frame-packet", V, "3", "5"), pk = join(V, ".hyperframes", "packets", "03.md"), text = existsSync(pk) ? readFileSync(pk, "utf8") : "";
  ok("frame-packet writes one file for the frames asked, and says the narration is ready", r.status === 0 && existsSync(pk) && /2 frames, narration ready/.test(r.stdout), r.stdout + r.stderr);
  ok("…each frame's line word by word, with when each word is said", /six \(0\.89–1\.05\)/.test(text) && /## Frame 5/.test(text), text.slice(0, 1200));
  ok("…its storyboard block as written, its file and composition id", text.includes("- blueprint: grid-card-assemble") && text.includes("composition id `03-pretrain`") && text.includes(join(V, "compositions", "frames", "05-decision-1.html")));
  ok("…the marks its beat needs: the bottom band always, a decision's heading and its option cards", /data-band="bottom"/.test(text) && /`data-question` \(decision q1\)/.test(text) && /`data-option="a"`, `data-option="b"`/.test(text), text.split("## Frame 5")[1]?.slice(0, 900));
  ok("…the theme by path, one finished sibling to match (not copy), and how to check a frame", /The frame rules and the look: `.*frame\.md`/.test(text) && /keep consistent with .* not to copy: `.*02-tension\.html` \(frame 2\)/.test(text) && /reelplanner frame-check /.test(text) && /references\/frames\.md/.test(text));
  ok("…fonts by family name, and this video's files: no font to look for", /Fonts: by family name/.test(text) && /Don't look for font files; this video's are in `.*assets\/fonts`: .*Inter-400\.woff2/.test(text), text.slice(0, 1500));
  ok("…and tells the worker not to read reelplanner's source", /Do not read reelplanner's own\s+source/.test(text));
  ok("…the shared shell contract and pinned lint before copying a batch", /references\/frame-shell\.md/.test(text) && /pinned HyperFrames lint on the first batch/.test(text), text.slice(0, 2500));
  rmSync(join(V, "audio_meta.json"));
  const r2 = rp("frame-packet", V, "3"), t2 = readFileSync(pk, "utf8");
  ok("before narration: \"narration not ready\", with the line's text", r2.status === 0 && /narration not ready/.test(r2.stdout) && /narration not ready: draw first, cue after\. The line: “The plan has six parts/.test(t2), r2.stdout + t2.slice(0, 600));
  const r3 = rp("frame-packet", V, "99");
  ok("a frame the storyboard lacks is refused, naming the ones it has", r3.status === 1 && /no frame 99 in the storyboard \(it has 1–\d+\)/.test(r3.stderr), r3.stderr);

  // ── frame-check ──
  const c = rp("frame-check", V, "3"), shots = join(V, ".hyperframes", "shots");
  ok("frame-check: frame-lint on that frame, its layout on its slot, and one picture of it at rest", c.status === 0 && /03-pretrain\.html/.test(c.stdout) && /✓ layout at [\d.]+, [\d.]+, [\d.]+s/.test(c.stdout) && /✓ picture at [\d.]+s/.test(c.stdout) && existsSync(shots) && readdirSync(shots).some((f) => /^03-03-pretrain\.png$/.test(f)), c.stdout + c.stderr);
  const singleShot = existsSync(join(shots, "03-03-pretrain.png")) ? createHash("sha256").update(readFileSync(join(shots, "03-03-pretrain.png"))).digest("hex") : null;
  const batch = rp("frame-check", V, "4", "03", "3");
  const batchShot = existsSync(join(shots, "03-03-pretrain.png")) ? createHash("sha256").update(readFileSync(join(shots, "03-03-pretrain.png"))).digest("hex") : null;
  ok("a batch checks every requested frame once, preserving its plain at-rest PNG", batch.status === 0 && (batch.stdout.match(/✓ picture at/g) || []).length === 2 && /\(frame 3\)/.test(batch.stdout) && /\(frame 4\)/.test(batch.stdout) && singleShot && singleShot === batchShot && existsSync(join(shots, "04-04-step-1.png")), batch.stdout + batch.stderr);
  for (const tail of [["99"], ["3e0"], ["--ignore-errors"], ["--no-shot=false"]]) {
    const invalid = rp("frame-check", V, "3", ...tail);
    ok(`an invalid later argument (${tail[0]}) is refused before checks`, invalid.status === 1 && !/all frames clean|✓ layout|picture at/.test(invalid.stdout), invalid.stdout + invalid.stderr);
  }
  const f3 = join(V, "compositions", "frames", "03-pretrain.html"), f3was = readFileSync(f3, "utf8");
  // a title too long for its box: HyperFrames' layout check finds it in this frame, in seconds
  writeFileSync(f3, f3was.replace(/(<div id="root"[^>]*>)/, '$1<div class="ovf" style="position:absolute;left:300px;top:400px;width:260px;height:60px;border:2px solid #333;font:500 40px/1.2 Inter;white-space:nowrap">This title is far too long for its box</div>'));
  const t0 = Date.now(), co = rp("frame-check", V, "3", "--no-shot"), took = (Date.now() - t0) / 1000;
  ok("…text overflowing its box: HyperFrames' finding in this frame with its fix, in seconds, as advice (exit 0)", co.status === 0 && /△ layout: .*text_box_overflow, `div\.ovf`, “This title is far too long/.test(co.stdout) && /widen the container/.test(co.stdout) && took < 60, `${took}s\n${co.stdout}${co.stderr}`);
  writeFileSync(f3, f3was);
  // Differential: two sources deliberately reuse selector + text. A whole-video collapsed
  // HyperFrames batch can merge those findings and discard the second source. Preserve each
  // separate check's severity, including a held overlap (error), not only clean-scene samples.
  const f4 = join(V, "compositions", "frames", "04-step-1.html"), f4was = readFileSync(f4, "utf8");
  const defect = '<div class="parity-box" style="position:absolute;left:300px;top:500px;width:260px;height:60px;border:2px solid #333;font:500 40px/1.2 Inter;white-space:nowrap">A label deliberately too long for its box</div><div class="parity-overlap" style="position:absolute;left:300px;top:500px;width:500px;height:60px;font:500 40px/1.2 Inter">Held overlapping label</div>';
  for (const [file, was] of [[f3, f3was], [f4, f4was]]) writeFileSync(file, was.replace(/(<div id="root"[^>]*>)/, `$1${defect}`));
  const selected = storyboardFrames(readFileSync(join(V, "STORYBOARD.md"), "utf8")).filter((f) => [3, 4].includes(f.index));
  const transient = '<div class="f03-transient" style="position:absolute;left:300px;top:350px;width:260px;height:60px;border:2px solid #333;font:500 40px/1.2 Inter;white-space:nowrap;opacity:0;z-index:50">Transient label too long for its box</div>';
  const f3slot = slotOf(V, selected[0].meta.src), quarter = f3slot.duration * .25;
  writeFileSync(f3, readFileSync(f3, "utf8").replace(/(<div id="root"[^>]*>)/, `$1${transient}`).replace('window.__timelines[ID] = tl;', `window.__timelines[ID] = tl; tl.set(q(".f03-transient"), { opacity: 1 }, ${quarter - .01}); tl.set(q(".f03-transient"), { opacity: 0 }, ${quarter + .01});`));
  const combined = layoutCheck(V, selected), rank = { error: 0, warning: 1, info: 2 };
  for (const f of selected) {
    const s = slotOf(V, f.meta.src), at = [s.start + s.duration * .25, s.start + s.duration * .6, s.start + s.duration - .4].map((t) => +t.toFixed(3));
    const reference = spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "hyperframes", "check", "--at", at.join(","), "--json"], { cwd: V, encoding: "utf8", maxBuffer: 64 << 20 });
    let j; try { j = JSON.parse(reference.stdout.slice(reference.stdout.indexOf("{"))); } catch { j = null; }
    const expected = ["lint", "runtime", "layout", "motion", "contrast"].flatMap((part) => (j?.[part]?.findings || []).filter((x) => x.sourceFile === f.meta.src && ["warning", "error"].includes(x.severity)).map((x) => ({ part, ...x })));
    const actual = combined.byFrame?.get(f.index), findings = [...(actual?.errors || []), ...(actual?.warnings || [])];
    const matched = expected.every((x) => findings.some((y) => y.part === x.part && y.code === x.code && y.selector === x.selector && y.text === x.text && rank[y.severity] <= rank[x.severity]));
    const brief = (xs) => xs.map(({ part, code, severity, selector, text }) => ({ part, code, severity, selector, text }));
    ok(`batch frame ${f.index}: preserves separate pinned findings and severities, including held overlap${f.index === 3 ? " and overflow" : ""}`, combined.ran && j?.layout?.samples?.length === 3 && (f.index !== 3 || expected.some((x) => x.code === "text_box_overflow")) && expected.some((x) => x.code === "content_overlap" && x.severity === "error") && matched, JSON.stringify({ expected: brief(expected), actual: brief(findings) }).slice(0, 1400));
    if (f.index === 3) ok("an overflow seen at one own-frame sample retains the pinned transient exemption", j?.layout?.findings?.some((x) => x.code === "text_box_overflow" && x.severity === "info" && /Transient label/.test(x.text)) && !findings.some((x) => x.code === "text_box_overflow" && /Transient label/.test(x.text)), JSON.stringify(brief(j?.layout?.findings || [])).slice(0, 1200));
  }
  const advisory = rp("frame-check", V, "3", "4", "--no-shot");
  ok("batch layout errors remain advice, with both affected frames named", advisory.status === 0 && /text_box_overflow/.test(advisory.stdout) && /\(frame 3\)/.test(advisory.stdout) && /\(frame 4\)/.test(advisory.stdout), advisory.stdout + advisory.stderr);
  writeFileSync(f4, f4was);
  // A global runtime error must survive requested-source filtering; a valid JSON failure
  // envelope is not proof the browser checked the requested layout moments.
  writeFileSync(f3, f3was.replace(/<script>/, '<script>\nconsole.error("frame-tools runtime sentinel");'));
  const runtime = rp("frame-check", V, "4", "--no-shot");
  ok("a runtime error outside the requested source fails and never claims clean layout", runtime.status === 1 && /runtime.*frame-tools runtime sentinel/.test(runtime.stdout) && !/✓ layout/.test(runtime.stdout), runtime.stdout + runtime.stderr);
  const earlyBuild = videoCheck(V);
  ok("build's whole-video check retains global runtime failures", earlyBuild.ran && earlyBuild.errors.some((x) => /frame-tools runtime sentinel/.test(x.message)), JSON.stringify(earlyBuild.errors).slice(0, 1000));
  writeFileSync(f3, f3was.replace(/<div id="root"/, '<div class="broken-root" id="root"').replace(/<style>/, '<style>\n.broken-root { position:relative; }'));
  const skipped = rp("frame-check", V, "4", "--no-shot");
  ok("framework lint that skips the browser fails, retaining its source and reason", skipped.status === 1 && /subcomposition_root_styled_by_class/.test(skipped.stdout) && /did not check every requested/.test(skipped.stdout) && !/✓ layout/.test(skipped.stdout), skipped.stdout + skipped.stderr);
  writeFileSync(f3, f3was);
  // a detail's mark in the bottom band, where the player's chips go: frame-lint stops it
  writeFileSync(f3, readFileSync(f3, "utf8").replace(/(<div id="root"[^>]*>)/, '$1<div data-detail="the-nodes" style="position:absolute;left:200px;top:990px;width:400px;height:60px">the nodes</div>'));
  const c2 = rp("frame-check", V, "3", "--no-shot", "--no-layout");
  ok("…a frame-lint failure exits 1", c2.status === 1, c2.stdout + c2.stderr);
  const html = join(V, "index.html");
  writeFileSync(html, readFileSync(html, "utf8").replace('data-composition-src="compositions/frames/04-step-1.html"', 'data-composition-src="compositions/frames/04-elsewhere.html"'));
  const c3 = rp("frame-check", V, "4");
  ok("…a frame not in index.html yet: no picture, and how to put it there", /no picture: frame 4 is not in index\.html yet/.test(c3.stdout), c3.stdout + c3.stderr);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ frame-tools: frame-packet and frame-check");
process.exit(failed ? 1 : 0);
