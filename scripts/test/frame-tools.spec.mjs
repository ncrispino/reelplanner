#!/usr/bin/env node
// The frame worker's two commands (plans/2026-10-10-cheaper-videos, step 1), on a scratch copy of a built video:
//   frame-packet  one file with each asked frame's storyboard block, its line word by word with when each word is
//                 said, its file and id, the marks its beat needs (the bottom band always; a decision's heading and
//                 option cards), the theme by path and one finished sibling frame, and how to check a frame;
//                 "narration not ready" with the line's text before the voice exists; a frame the storyboard lacks
//                 is refused, naming the ones it has
//   frame-check   frame-lint on that frame, and one picture of it at rest from the assembled video; a frame-lint
//                 failure exits 1, the picture is taken all the same; a frame not in index.html yet gets no picture,
//                 and says how to put it there
// usage: node scripts/test/frame-tools.spec.mjs
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, scratchCopy } from "../lib/env.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const tmp = mkdtempSync(join(tmpdir(), "rp-frame-tools-")), V = join(tmp, "v");
scratchCopy(join(ROOT, "videos", "l2-upload-resume"), V, (p) => !/\/(renders|snapshots|node_modules)$/.test(p));
const rp = (...a) => spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), ...a], { cwd: tmp, encoding: "utf8" });

try {
  // ── frame-packet ──
  const r = rp("frame-packet", V, "3", "5"), pk = join(V, ".hyperframes", "packets", "03.md"), text = existsSync(pk) ? readFileSync(pk, "utf8") : "";
  ok("frame-packet writes one file for the frames asked, and says the narration is ready", r.status === 0 && existsSync(pk) && /2 frames, narration ready/.test(r.stdout), r.stdout + r.stderr);
  ok("…each frame's line word by word, with when each word is said", /six \(0\.89–1\.05\)/.test(text) && /## Frame 5/.test(text), text.slice(0, 1200));
  ok("…its storyboard block as written, its file and composition id", text.includes("- blueprint: grid-card-assemble") && text.includes("composition id `03-pretrain`") && text.includes(join(V, "compositions", "frames", "05-decision-1.html")));
  ok("…the marks its beat needs: the bottom band always, a decision's heading and its option cards", /data-band="bottom"/.test(text) && /`data-question` \(decision q1\)/.test(text) && /`data-option="a"`, `data-option="b"`/.test(text), text.split("## Frame 5")[1]?.slice(0, 900));
  ok("…the theme by path, one finished sibling to match (not copy), and how to check a frame", /The frame rules and the look: `.*frame\.md`/.test(text) && /keep consistent with .* not to copy: `.*02-tension\.html` \(frame 2\)/.test(text) && /reelplanner frame-check /.test(text) && /references\/frames\.md/.test(text));
  ok("…and tells the worker not to read reelplanner's source", /Do not read reelplanner's own\s+source/.test(text));
  rmSync(join(V, "audio_meta.json"));
  const r2 = rp("frame-packet", V, "3"), t2 = readFileSync(pk, "utf8");
  ok("before narration: \"narration not ready\", with the line's text", r2.status === 0 && /narration not ready/.test(r2.stdout) && /narration not ready: draw first, cue after\. The line: “The plan has six parts/.test(t2), r2.stdout + t2.slice(0, 600));
  const r3 = rp("frame-packet", V, "99");
  ok("a frame the storyboard lacks is refused, naming the ones it has", r3.status === 1 && /no frame 99 in the storyboard \(it has 1–\d+\)/.test(r3.stderr), r3.stderr);

  // ── frame-check ──
  const c = rp("frame-check", V, "3"), shots = join(V, ".hyperframes", "shots");
  ok("frame-check: frame-lint on that frame, and one picture of it at rest", c.status === 0 && /03-pretrain\.html/.test(c.stdout) && /✓ picture at [\d.]+s/.test(c.stdout) && existsSync(shots) && readdirSync(shots).some((f) => /^03-03-pretrain\.png$/.test(f)), c.stdout + c.stderr);
  const f3 = join(V, "compositions", "frames", "03-pretrain.html");
  // a detail's mark in the bottom band, where the player's chips go: frame-lint stops it
  writeFileSync(f3, readFileSync(f3, "utf8").replace(/(<div id="root"[^>]*>)/, '$1<div data-detail="the-nodes" style="position:absolute;left:200px;top:990px;width:400px;height:60px">the nodes</div>'));
  const c2 = rp("frame-check", V, "3", "--no-shot");
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
