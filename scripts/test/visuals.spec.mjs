#!/usr/bin/env node
// Better visuals, steps 1 and 2: the checks that let a scene show the real thing and move, while keeping
// the answer safe. Against scratch frames.
//   - frame-lint: a camera (named, or a zoom that could reach y 900) outside a view clipped at 900 fails;
//     inside one it passes; a pulse on a card up top is not a camera
//   - frame-lint: a question's heading or card inside something still moving at the scene's end, or not
//     at scale 1 then, fails; at rest at scale 1, or outside the camera, passes
//   - frame-lint: the mono floor counts screen pixels under a camera (its smallest scale)
//   - frame-lint: a pinned word (data-gloss) outside any data-artifact is a note
//   - frame-lint: a thing marked data-detail (details in the frame) fails in the lowest eighth, under 120 × 44 px,
//     or moving (it, or its camera) in the last 3 s; two of one name fail; unsized, or over a card, is a note
//   - frame-lint (videos-that-make-sense step 4): empty bars stacked where words go fail (rule 1), one bar or two
//     underlines pass, the theme's stages hold words; anything within 40 px above a data-detail mark fails (rule 5)
//   - the theme's code-diff and terminal-run blocks, pasted into a frame, pass frame-lint
//   - frame-lint: a frames folder, or a video project's folder, lints the frames in it; a folder with none,
//     or a missing path, is a clear error (exit 2)
//   - motion-static: a helper's pops are read (a drip of pops shows its still stretches); a hold on a
//     plain object is not motion; a camera's share is reported
//   - scale-only-zoom: a zoom-through loses its blur, nothing else changes, twice is the same as once
//   - variety: over 70% of scenes on one layout or one transition warns; a BRIEF.md without its medium,
//     layouts and main transition warns; an optional `- Real things:` line is repeated, never warned on
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { videoVariety, varietyLines } from "../lib/variety.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const tmp = mkdtempSync(join(tmpdir(), "rp-visuals-spec-"));
const node = (script, args) => { const r = spawnSync("node", [join(ROOT, "scripts", script), ...args], { cwd: tmp, encoding: "utf8" }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };

// one frame: CSS, body and timeline lines, a 10 s scene
const frame = (name, { css = "", body = "", tl = "", dur = 10 }) => {
  const f = join(tmp, "frames", `${name}.html`);
  mkdirSync(join(tmp, "frames"), { recursive: true });
  writeFileSync(f, `<template>
<style>
  #root { position:relative; width:100%; height:100%; overflow:hidden; }
  .v-view { position:absolute; left:0; top:0; width:1920px; height:900px; overflow:hidden; }
  .v-open { position:absolute; left:0; top:0; width:1920px; height:1080px; }
  .v-cam { position:absolute; left:0; top:0; width:1920px; height:900px; transform-origin:0 0; }
  .v-card { position:absolute; left:200px; top:600px; width:500px; height:100px; }
${css}
</style>
<div id="root" data-composition-id="${name}" data-band="bottom" data-duration="${dur}" data-width="1920" data-height="1080">
${body}
</div>
<script>
(function () {
  var tl = gsap.timeline({ paused: true });
${tl}
  window.__timelines = window.__timelines || {}; window.__timelines["${name}"] = tl;
})();
</script>
</template>
`);
  return f;
};
const lint = (f, ...extra) => node("frame-lint.mjs", [f, ...extra]);

try {
  // ── cameras and the clipped view ─────────────────────────────────────────────────────────────────────
  const move = `  gsap.set("#v-cam", { x: 208, y: 136, scale: 1.6 });\n  tl.to("#v-cam", { x: 0, y: 0, scale: 1, duration: 1.5, ease: "expo.out" }, 0.05);`;
  let r = lint(frame("cam-open", { body: `<div class="v-open" id="v-open"><div class="v-cam" id="v-cam"><div class="v-card">the real thing</div></div></div>`, tl: move }));
  ok("frame-lint: a camera outside a view clipped at 900 fails", r.code === 1 && /camera #v-cam moves outside a view clipped at 900 px/.test(r.out), r.out);
  r = lint(frame("cam-view", { body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-card">the real thing</div></div></div>`, tl: move }));
  ok("…inside one (overflow hidden, bottom at 900) it passes", r.code === 0, r.out);
  r = lint(frame("zoom-open", { css: ".v-big { position:absolute; left:0; top:300px; width:1920px; height:500px; }", body: `<div class="v-big" id="v-big"><div class="v-card">a table</div></div>`, tl: `  tl.to("#v-big", { scale: 1.4, duration: 1, ease: "sine.inOut" }, 2);` }));
  ok("…an unnamed zoom that could reach y 900 is a camera too", r.code === 1 && /camera #v-big moves outside/.test(r.out), r.out);
  r = lint(frame("pulse", { css: ".v-chip { position:absolute; left:100px; top:120px; width:200px; height:60px; }", body: `<div class="v-chip" id="v-chip"><span>chip</span></div>`, tl: `  tl.fromTo("#v-chip", { scale: 1 }, { scale: 1.08, duration: 0.3, ease: "power2.out" }, 2);` }));
  ok("…a pulse on a chip up top cannot reach it, and is not a camera", r.code === 0, r.out);

  // ── the question's heading and cards stay still where the player measures them ───────────────────────
  const cards = `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-card" id="v-q" data-question>Which one?</div><div class="v-card" id="v-a" data-option="a" style="top:720px">A</div></div></div>`;
  r = lint(frame("q-moving", { body: cards, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 2, ease: "sine.inOut" }, 9);` }));
  ok("frame-lint: a card inside a camera still moving at the scene's end fails", r.code === 1 && /option card a \(data-option\) sits inside #v-cam, still moving at the scene's end \(11s of 10s\)/.test(r.out) && /a question's heading \(data-question\) sits inside #v-cam/.test(r.out), r.out);
  r = lint(frame("q-scaled", { body: cards, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 1, ease: "sine.inOut" }, 4);` }));
  ok("…one that rests, but at scale 1.2, fails", r.code === 1 && /which ends at scale 1\.2/.test(r.out), r.out);
  r = lint(frame("q-rest", { body: cards, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 1, ease: "sine.inOut" }, 4);\n  tl.to("#v-cam", { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.inOut" }, 7);` }));
  ok("…at rest at scale 1 by the end, it passes", r.code === 0, r.out);
  r = lint(frame("q-outside", { body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-card">the case</div></div></div><div class="v-card" id="v-q" data-question>Which one?</div>`, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 2, ease: "sine.inOut" }, 9);` }));
  ok("…and cards outside the camera pass whatever it does", r.code === 0, r.out);

  // ── the mono floor in screen pixels ──────────────────────────────────────────────────────────────────
  const monoCam = (px, set, to) => frame(`mono-${px}-${to}`, { css: `.v-lab { position:absolute; left:100px; top:100px; font:500 ${px}px/1 "JetBrains Mono"; }`, body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-lab">A3 · label</div></div></div>`, tl: `  gsap.set("#v-cam", { scale: ${set} });\n  tl.to("#v-cam", { scale: ${to}, duration: 1, ease: "sine.inOut" }, 1);` });
  r = lint(monoCam(20, 1.4, 1.6));
  ok("frame-lint: a 20 px mono label in a camera that never goes below 1.4 shows at 28 px and passes", r.code === 0, r.out);
  r = lint(monoCam(20, 1.6, 1));
  ok("…in a camera that comes to rest at 1 it is 20 px and fails", r.code === 1 && /mono at 20px/.test(r.out), r.out);
  r = lint(monoCam(30, 1, 0.6));
  ok("…and a 30 px label in a camera pulled back to 0.6 shows at 18 px and fails", r.code === 1 && /mono at 30px in \.v-lab shows at 18px under a camera at scale 0\.6/.test(r.out), r.out);

  // ── a pinned word belongs on the real thing ──────────────────────────────────────────────────────────
  r = lint(frame("gloss-out", { body: `<div class="v-card"><em data-gloss="misses">late fixes</em></div>` }), "--notes");
  ok("frame-lint: a pinned word outside any data-artifact is a note", r.code === 0 && /note: a pinned word \(data-gloss="misses"\) sits outside any data-artifact/.test(r.out), r.out);
  r = lint(frame("gloss-in", { body: `<div class="v-card" data-artifact="autonomy.mjs"><span>misses<em data-gloss="misses">late fixes</em></span></div>` }), "--notes");
  ok("…on it, no note", r.code === 0 && !/pinned word/.test(r.out), r.out);

  // ── details in the frame (plan 2026-09-27, step 1): the marked thing is one a click can rely on ───────
  const blockCss = ".v-block { position:absolute; left:640px; top:300px; width:900px; height:320px; }";
  r = lint(frame("mark-ok", { css: blockCss, body: `<div class="v-block" id="v-block" data-artifact="table.html" data-detail="data-block">eight lines</div>`, tl: `  tl.from("#v-block", { y: 24, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.5);` }), "--notes");
  ok("frame-lint: a marked block, above the lowest eighth, large enough, at rest well before the end, passes", r.code === 0 && !/data-detail/.test(r.out), r.out);
  r = lint(frame("mark-low", { css: ".v-block { position:absolute; left:640px; top:800px; width:900px; height:200px; }", body: `<div class="v-block" data-detail="data-block">low</div>` }));
  ok("…one that reaches the lowest eighth fails", r.code === 1 && /data-detail="data-block" reaches the lowest eighth \(its bottom at y 1000/.test(r.out), r.out);
  r = lint(frame("mark-small", { css: ".v-word { position:absolute; left:640px; top:300px; width:100px; height:30px; }", body: `<div class="v-word" data-detail="data-block">tiny</div>` }));
  ok("…one under 120 × 44 px fails (a tap target)", r.code === 1 && /is 100 × 30 px, under 120 × 44/.test(r.out), r.out);
  r = lint(frame("mark-padded", { css: ".v-word { position:absolute; left:640px; top:300px; width:100px; height:30px; padding:8px 12px; }", body: `<div class="v-word" data-detail="data-block">padded</div>` }));
  ok("…its padding counts: 124 × 46 passes", r.code === 0, r.out);
  r = lint(frame("mark-unsized", { body: `<div class="v-card" data-artifact="x"><span data-detail="data-block">a word</span></div>` }), "--notes");
  ok("…one whose size its CSS does not say is a note, not a finding", r.code === 0 && /note: the marked thing data-detail="data-block": its size is not in its CSS/.test(r.out), r.out);
  r = lint(frame("mark-late", { css: blockCss, body: `<div class="v-block" id="v-block" data-detail="data-block">late</div>`, tl: `  tl.from("#v-block", { y: 24, duration: 0.6, ease: "power3.out" }, 7.8);` }));
  ok("…one still moving in the scene's last 3 s fails", r.code === 1 && /still moving in the scene's last 3 s \(until 8\.4s of 10s\) — bring it to rest by 7s/.test(r.out), r.out);
  r = lint(frame("mark-cam", { css: blockCss, body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-block" data-detail="data-block">in a camera</div></div></div>`, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 1, ease: "sine.inOut" }, 4);` }));
  ok("…one in a camera that rests at scale 1.2 fails", r.code === 1 && /sits in #v-cam, which ends at scale 1\.2 — end it at scale 1/.test(r.out), r.out);
  r = lint(frame("mark-cam-late", { css: blockCss, body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-block" data-detail="data-block">in a camera</div></div></div>`, tl: `${move}\n  tl.to("#v-cam", { x: 40, duration: 1, ease: "sine.inOut" }, 7.5);` }));
  ok("…one in a camera still moving in the last 3 s fails", r.code === 1 && /sits in #v-cam, which is still moving in the scene's last 3 s \(until 8\.5s of 10s\)/.test(r.out), r.out);
  r = lint(frame("mark-cam-rest", { css: blockCss, body: `<div class="v-view" id="v-view"><div class="v-cam" id="v-cam"><div class="v-block" data-detail="data-block">in a camera</div></div></div>`, tl: `${move}\n  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 1, ease: "sine.inOut" }, 4);\n  tl.to("#v-cam", { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.inOut" }, 6);` }));
  ok("…and at rest at scale 1 by then, it passes", r.code === 0, r.out);
  r = lint(frame("mark-twice", { css: blockCss, body: `<div class="v-block" data-detail="data-block">one</div><div class="v-block" style="top:100px" data-detail="data-block">two</div>` }));
  ok("…two things marked with one name fail", r.code === 1 && /data-detail="data-block" marks 2 things/.test(r.out), r.out);
  r = lint(frame("mark-card", { css: blockCss, body: `<div class="v-block" data-detail="data-block">block</div><div class="v-card" data-option="a" style="left:700px;top:500px">A</div>` }), "--notes");
  ok("…one overlapping an option card is a note", r.code === 0 && /note: the marked thing data-detail="data-block" overlaps option card a/.test(r.out), r.out);

  // ── a frame a newcomer can read (videos-that-make-sense step 4): rules 1 and 5 ───────────────────────────
  const barCss = ".v-line { position:absolute; height:4px; background:rgba(var(--rp-ink-rgb),0.55); } .v-name { position:absolute; font:400 34px/1.2 \"Inter\"; }";
  r = lint(frame("stand-in", { css: barCss, body: `<div class="v-name" style="left:150px; top:570px">What changed</div><div class="v-line" id="v-l0" style="left:150px; top:640px; width:720px"></div><div class="v-line" id="v-l1" style="left:150px; top:680px; width:720px"></div>` }));
  ok("frame-lint rule 1: two empty bars stacked where lines of words go fail (the step 6 frame's What changed)", r.code === 1 && /2 empty bars \(#v-l0, #v-l1\) stand where words go \(rule 1: show the thing, never a stand-in\)/.test(r.out), r.out);
  r = lint(frame("one-rule", { css: barCss, body: `<div class="v-name" style="left:150px; top:570px">What changed</div><div class="v-line" style="left:150px; top:640px; width:720px"></div>` }));
  ok("…one bar alone (a rule, an underline) passes", r.code === 0, r.out);
  r = lint(frame("underlines", { css: barCss, body: `<div class="v-line" style="left:150px; top:699px; width:450px; height:3px"></div><em>own words</em><div class="v-line" style="left:150px; top:708px; width:900px; height:3px"></div>` }));
  ok("…two underlines 9 px apart are not lines of text, and pass", r.code === 0, r.out);
  r = lint(frame("page-mock", { css: ".v-page { position:absolute; left:100px; top:100px; width:172px; height:250px; } .v-page .bar { height:5px; background:rgba(var(--rp-ink-rgb),0.22); margin-bottom:7px; }", body: `<div class="v-page"><h>Like a Rolling Stone</h><div class="bar" style="width:92%"></div><div class="bar" style="width:86%"></div></div>` }));
  ok("…bars one after another in a page mock's flow fail", r.code === 1 && /2 empty bars \(\.bar\) stand where words go/.test(r.out), r.out);
  for (const st of ["layout", "pipeline"]) { const t = lint(join(ROOT, "templates", "reelplanner", "theme", "stages", `${st}.html`)); ok(`…the theme's ${st} stage holds words, not bars`, !/rule 1/.test(t.out), t.out); }
  const roomCss = `${blockCss} .v-head { position:absolute; left:640px; font:400 44px/1.15 "EB Garamond"; }`;
  r = lint(frame("room-tight", { css: roomCss, body: `<div class="v-head" id="v-head" style="top:210px">plain words, no meaning to click</div><div class="v-block" data-detail="data-block">the list</div>` }));
  ok("frame-lint rule 5: a heading ending within 40 px above a marked thing fails (the player's label goes there)", r.code === 1 && /data-detail="data-block" has #v-head within 40 px above it/.test(r.out), r.out);
  r = lint(frame("room-ok", { css: roomCss, body: `<div class="v-head" style="top:190px">plain words, no meaning to click</div><div class="v-block" data-detail="data-block">the list</div><div class="v-open" style="background:var(--rp-paper)"></div>` }));
  ok("…with 40 px of room it passes, and a background behind the thing is not in the way", r.code === 0, r.out);

  // ── the theme's blocks pass as they ship ─────────────────────────────────────────────────────────────
  for (const b of ["code-diff", "terminal-run"]) {
    const src = readFileSync(join(ROOT, "templates", "reelplanner", "theme", "blocks", `${b}.html`), "utf8").replaceAll("FID", `f01-${b}`);
    const style = (src.match(/<style>([\s\S]*?)<\/style>/) || [])[1], script = (src.match(/<script>([\s\S]*?)<\/script>/) || [])[1];
    const markup = src.replace(/<!--[\s\S]*?-->/g, "").replace(/<style>[\s\S]*?<\/style>/, "").replace(/<script>[\s\S]*?<\/script>/, "");
    r = lint(frame(`block-${b}`, { css: style, body: markup, tl: script }));
    ok(`the theme's ${b} block, pasted into a frame, passes frame-lint (tokens only, camera in a clipped view)`, r.code === 0, r.out);
  }

  // ── a folder stands for the frames in it ─────────────────────────────────────────────────────────────
  {
    const P = join(tmp, "lint-project"), PF = join(P, "compositions", "frames");
    mkdirSync(PF, { recursive: true });
    const a = frame("dir-a", { body: `<div class="v-card">a</div>` }), b = frame("dir-b", { body: `<div class="v-card">b</div>` });
    writeFileSync(join(PF, "01-a.html"), readFileSync(a, "utf8")); writeFileSync(join(PF, "02-b.html"), readFileSync(b, "utf8"));
    writeFileSync(join(P, "index.html"), "<!doctype html><title>not a frame</title>");
    const byFiles = lint(join(PF, "01-a.html"), join(PF, "02-b.html"));
    const byDir = lint(PF), byProject = lint(P);
    ok("frame-lint: a frames folder lints the frames in it, as naming them does (it used to crash on reading a folder)", byDir.code === 0 && byDir.out === byFiles.out && /✓ 01-a\.html\n✓ 02-b\.html/.test(byDir.out), byDir.out);
    ok("…a video project's folder lints its compositions/frames, not its index.html", byProject.code === 0 && byProject.out === byFiles.out && !/index\.html/.test(byProject.out), byProject.out);
    const empty = join(tmp, "no-frames"); mkdirSync(empty, { recursive: true });
    const none = lint(empty), missing = lint(join(tmp, "nowhere"));
    ok("…a folder with no frames, or a path that is not there, is a clear error (exit 2), not a stack trace",
      none.code === 2 && /no frame files \(\*\.html\) in .*no-frames/.test(none.out) && missing.code === 2 && /no such file or folder: .*nowhere/.test(missing.out) && !/at .*frame-lint\.mjs/.test(none.out + missing.out), none.out + missing.out);
  }

  // ── motion-static reads helpers, skips holds, reports the camera ─────────────────────────────────────
  const V = join(tmp, "video"), FR = join(V, "compositions", "frames");
  mkdirSync(FR, { recursive: true });
  writeFileSync(join(V, "STORYBOARD.md"), "# SB\n\n## Frame 1 — pops\n\n- src: compositions/frames/01-pops.html\n- duration: 10s\n\n## Frame 2 — camera\n\n- src: compositions/frames/02-cam.html\n- duration: 10s\n");
  writeFileSync(join(FR, "01-pops.html"), `<script>
  var pop = function (tl, el, at) { tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, at); };
  var $ = function (s) { return document.getElementById("f01-" + s); };
  var tl = gsap.timeline({ paused: true });
  pop(tl, $("a"), 0.1);
  pop(tl, $("b"), 6.0);
  tl.to({ hold: 0 }, { hold: 1, duration: 0.001 }, 9.9);
</script>`);
  writeFileSync(join(FR, "02-cam.html"), `<div class="v-view"><div class="v-cam" id="v-cam"></div></div><script>
  var tl = gsap.timeline({ paused: true });
  gsap.set("#v-cam", { scale: 1.6 });
  tl.to("#v-cam", { x: 0, y: 0, scale: 1, duration: 4, ease: "sine.inOut" }, 0.1);
  tl.to("#v-cam", { x: 40, scale: 1.2, duration: 4, ease: "sine.inOut" }, 4.2);
  tl.to("#v-cam", { x: 0, scale: 1, duration: 1.5, ease: "power2.inOut" }, 8.3);
</script>`);
  r = node("motion-static.mjs", [V]);
  ok("motion-static: a helper's pops are read, so a drip of pops shows its still stretch (it used to read as 0% and pass)", r.code === 1 && /✗ 01-pops\s+10% moving of 10s — still 5\.4s \(0\.6→6\)/.test(r.out), r.out);
  ok("…the hold on a plain object is not motion: the 3.5 s after the last pop is a tail", /tail 3\.5s/.test(r.out), r.out);
  ok("…a camera's moves are motion, and its share is said", /✓ 02-cam\s+95% moving, camera 95% of 10s/.test(r.out), r.out);

  // ── zoom-through, scale only ─────────────────────────────────────────────────────────────────────────
  const Z = join(tmp, "zoom"); mkdirSync(Z, { recursive: true });
  const block = [
    '      // ── frame transitions (injected by transitions.mjs) ──',
    '      (function () { var tl = window.__timelines["main"];',
    '        tl.to("#el-01", { scale: 2.5, opacity: 0, filter: "blur(8px)", duration: 0.4, ease: "power3.in" }, 9.2);',
    '        tl.fromTo("#el-02", { scale: 0.5, opacity: 0, filter: "blur(8px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, 9.2);',
    '        tl.to("#el-02", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 14);',
    '      })();'].join("\n");
  writeFileSync(join(Z, "index.html"), `<script>\n${block}\n</script>`);
  const reg = join(tmp, "transitions.json");
  writeFileSync(reg, JSON.stringify({ transitions: [{ name: "zoom-through", gsap_template: [
    'tl.to(__OLD__, { scale: 2.5, opacity: 0, filter: "blur(8px)", duration: __DUR__, ease: "power3.in" }, __T__);',
    'tl.fromTo(__NEW__, { scale: 0.5, opacity: 0, filter: "blur(8px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: __DUR__, ease: "power3.out" }, __T__);'] }] }));
  const zr = spawnSync("node", [join(ROOT, "scripts", "scale-only-zoom.mjs"), Z], { encoding: "utf8", env: { ...process.env, REELPLANNER_TRANSITIONS: reg } });
  const after = readFileSync(join(Z, "index.html"), "utf8");
  ok("scale-only-zoom: both zoom-through lines lose their blur and keep their scale; the crossfade is untouched", /2 zoom-through line\(s\)/.test(zr.stdout) && !/blur/.test(after) && /\{ scale: 0\.5, opacity: 0 \}, \{ scale: 1, opacity: 1, duration: 0\.4/.test(after) && after.includes('tl.to("#el-02", { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 14);'), zr.stdout + after);
  const z2 = spawnSync("node", [join(ROOT, "scripts", "scale-only-zoom.mjs"), Z], { encoding: "utf8", env: { ...process.env, REELPLANNER_TRANSITIONS: reg } });
  ok("…and a second run changes nothing", /no blurred zoom-through/.test(z2.stdout) && readFileSync(join(Z, "index.html"), "utf8") === after, z2.stdout);

  // ── variety ──────────────────────────────────────────────────────────────────────────────────────────
  const sb = (scenes) => `# SB\n\n${scenes.map(([layout, tr], i) => `## Frame ${i + 1} — s${i + 1}\n\n- src: compositions/frames/s${i + 1}.html\n- duration: 5s\n- blueprint: compose\n${layout ? `- layout: ${layout}\n` : ""}- transition_in: ${tr}\n`).join("\n")}`;
  const VV = join(tmp, "variety"); mkdirSync(VV, { recursive: true });
  writeFileSync(join(VV, "STORYBOARD.md"), sb([["code", "cut"], ["code", "crossfade"], ["code", "crossfade"], ["code", "crossfade"], ["table", "crossfade"], ["code", "crossfade"]]));
  let lines = varietyLines(videoVariety(VV));
  ok("variety: 5 of 6 scenes on one layout and 5 of 5 transitions one kind warn, and a missing BRIEF.md says what it should say", lines.length === 2 && lines.every((l) => l.warn) && /5 of 6 scenes share one layout \(code, 83%\)/.test(lines[0].text) && /5 of 5 transitions are one kind \(crossfade, 100%\)/.test(lines[0].text) && /BRIEF\.md is missing/.test(lines[1].text), JSON.stringify(lines));
  writeFileSync(join(VV, "STORYBOARD.md"), sb([["code", "cut"], ["table", "push-slide LEFT"], ["terminal", "push-slide UP"], ["code", "cut"], ["before-after", "crossfade"], ["wall", "push-slide LEFT"]]));
  writeFileSync(join(VV, "BRIEF.md"), "---\nflow: automation\n---\n\n## Customizations\n\n- Medium: code and a terminal\n- Layouts: a diff, a table, a run, a before and after\n- Main transition: push-slide LEFT, cut for a chapter\n");
  lines = varietyLines(videoVariety(VV));
  ok("…a video that varies, with a brief that says how, passes (push-slide LEFT and UP are one kind: 3 of 5)", lines.length === 1 && !lines[0].warn && /5 layout\(s\), 3 kind\(s\) of transition/.test(lines[0].text), JSON.stringify(lines));
  writeFileSync(join(VV, "STORYBOARD.md"), sb([[null, "cut"], [null, "push-slide LEFT"], [null, "cut"], [null, "crossfade"], [null, "cut"], [null, "push-slide UP"]]));
  lines = varietyLines(videoVariety(VV));
  ok("…blueprint: compose names no layout, so a storyboard without `- layout:` is not judged on layouts", lines.length === 1 && !lines[0].warn && /layouts not judged/.test(lines[0].text), JSON.stringify(lines));
  writeFileSync(join(VV, "BRIEF.md"), readFileSync(join(VV, "BRIEF.md"), "utf8") + "- Real things: scene 3 (the table), scene 8 (the diff); the rest explain with pictures\n");
  lines = varietyLines(videoVariety(VV));
  ok("…a brief's optional `- Real things:` is repeated as a ✓ line, and its absence above warned nothing (D-166)", lines.length === 2 && lines.every((l) => !l.warn) && lines[1].text === "BRIEF.md picks the real things: scene 3 (the table), scene 8 (the diff); the rest explain with pictures", JSON.stringify(lines));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ visuals: cameras stay above the answer, cards stay still, the real thing reads, moves are counted");
process.exit(failed ? 1 : 0);
