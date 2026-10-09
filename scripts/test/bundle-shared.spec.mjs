#!/usr/bin/env node
// bundle-player writes the fonts and gsap every project carries once, under shared/, and points each
// project's HTML at that copy. Two throwaway projects: one whose font matches, one whose font does
// not (it keeps its own), then a one-video bundle. Then a page for one video, which carries the built videos it builds
// on (and says why on a row it cannot carry), and the repo name each page gives the player to keep its state under.
// usage: node scripts/test/bundle-shared.spec.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { ROOT } from "../lib/env.mjs";

const T = mkdtempSync(join(tmpdir(), "rp-bundle-shared-"));
let ok = true; const check = (n, c, x = "") => { console.log(`${c ? "✓" : "✗"} ${n}${x ? " — " + x : ""}`); if (!c) ok = false; };
const put = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
const frame = `<template><style>@font-face { font-family:"Inter"; src:url("assets/fonts/Inter-400.woff2") format("woff2"); }</style>
<div id="root"></div><script src="assets/vendor/gsap.min.js"></script></template>`;
const captions = `<template><style>@font-face { font-family: 'Inter'; src: url('assets/fonts/Inter-400.woff2') format('woff2'); }</style></template>`;
function project(name, font) {
  const d = join(T, name);
  put(join(d, "index.html"), `<!doctype html><script src="assets/vendor/gsap.min.js"></script><div data-composition-src="compositions/frames/01-a.html"></div>`);
  put(join(d, "compositions/frames/01-a.html"), frame);
  put(join(d, "compositions/captions.html"), captions);
  put(join(d, "assets/fonts/Inter-400.woff2"), font);
  put(join(d, "assets/fonts/OFL-inter.txt"), "SIL Open Font License");
  put(join(d, "assets/vendor/gsap.min.js"), "/* gsap */");
  return d;
}
const a = project("a", "FONT-A"), b = project("b", "FONT-A"), c = project("c", "FONT-C (a different build)");
const bundle = (out, ...ps) => execFileSync(process.execPath, [join(ROOT, "scripts/bundle-player.mjs"), out, ...ps], { encoding: "utf8" });
const filesIn = (d) => readdirSync(d, { recursive: true }).map(String).filter((f) => statSync(join(d, f)).isFile());
// what a reference in a bundled file points at: every rewritten path is relative to the file itself
// (the HyperFrames runtime rebases a sub-composition's "../" paths onto the composition's own URL)
const refs = (file) => [...readFileSync(file, "utf8").matchAll(/(?:src="|url\(["']?)([^"')]+)/g)].map((m) => m[1]);
const target = (file, ref) => ref.startsWith("../") ? resolve(dirname(file), ref) : resolve(dirname(file).replace(/\/compositions(\/.*)?$/, ""), ref);

try {
  const out = join(T, "out");
  bundle(out, a, b, c);
  const shared = filesIn(join(out, "shared")).sort();
  check("the fonts, licence and gsap go to shared/ once", JSON.stringify(shared) === JSON.stringify(["fonts/Inter-400.woff2", "fonts/OFL-inter.txt", "vendor/gsap.min.js"]), shared.join(", "));
  check("the videos that match keep no copy of their own", !existsSync(join(out, "a/assets/fonts")) && !existsSync(join(out, "b/assets/fonts")) && !existsSync(join(out, "a/assets/vendor")));
  check("a video whose font differs keeps its own", readFileSync(join(out, "c/assets/fonts/Inter-400.woff2"), "utf8") === "FONT-C (a different build)" && !existsSync(join(out, "c/assets/fonts/OFL-inter.txt")));
  const want = { "a/index.html": "../shared/vendor/gsap.min.js", "a/compositions/frames/01-a.html": "../../../shared/fonts/Inter-400.woff2", "a/compositions/captions.html": "../../shared/fonts/Inter-400.woff2" };
  for (const [f, r] of Object.entries(want)) check(`${f} points at the shared copy`, refs(join(out, f)).includes(r), refs(join(out, f)).join(", "));
  check("c's frames still use its own font, and the shared gsap", refs(join(out, "c/compositions/frames/01-a.html")).join(" ") === "assets/fonts/Inter-400.woff2 ../../../shared/vendor/gsap.min.js");
  const missing = ["a", "b", "c"].flatMap((s) => filesIn(join(out, s)).filter((f) => f.endsWith(".html")).flatMap((f) => refs(join(out, s, f)).map((r) => [join(out, s, f), r])))
    .filter(([f, r]) => !existsSync(target(f, r))).map(([f, r]) => `${f.slice(out.length + 1)} → ${r}`);
  check("every reference resolves to a file in the bundle", missing.length === 0, missing.join(" | "));

  // an image a frame points at (a screenshot under assets/shots/) is copied; one nothing points at is not
  const im = project("im", "FONT-A");
  put(join(im, "assets/shots/strip-l.png"), "PNG"); put(join(im, "assets/shots/unused.png"), "PNG");
  put(join(im, "compositions/frames/01-a.html"), frame.replace("</template>", '<img src="assets/shots/strip-l.png"></template>'));
  const imOut = join(T, "im-out"); bundle(imOut, im);
  check("a referenced image under assets/ goes into the bundle, an unreferenced one does not", existsSync(join(imOut, "im/assets/shots/strip-l.png")) && !existsSync(join(imOut, "im/assets/shots/unused.png")));

  const one = join(T, "one");
  bundle(one, a);
  const f1 = join(one, "a/compositions/frames/01-a.html");
  check("a one-video bundle works the same way", filesIn(join(one, "shared")).length === 3 && refs(f1).every((r) => existsSync(target(f1, r))), refs(f1).join(", "));
  // the page tells the player which videos it carries: a "Before you watch" row for one it does not carry says so
  const top = readFileSync(join(one, "index.html"), "utf8"), named = top.indexOf('rp.setAttribute("videos", BUNDLED.join(" "));');
  check("the page names the videos it carries to the player (its videos attribute), before the plan map is set", named > 0 && named < top.indexOf('rp.setAttribute("plan-map"') && /const BUNDLED = \["a"\];/.test(top));

  // A built plan's plan video is history, unless the plan grew a new round: questions the ledger has no
  // answer for. Matched on the question's words, since the ids (q2…) come round again.
  const rp = join(T, "rp", ".reelplanner"), pd = join(rp, "plans", "2026-01-01-demo");
  const vd = project(join("rp", ".reelplanner", "plans", "2026-01-01-demo", "video"), "FONT-A");
  put(join(pd, "plan.md"), "# Demo: a plan\n"); put(join(pd, "reviews", "plan-20260101T000000Z.json"), JSON.stringify({ exportedAt: "2026-01-01T00:00:00Z", verdict: "approve", annotations: [], decisions: [{ id: "q2", option: "a", label: "Blue" }] })); put(join(pd, "walkthrough.md"), "# built\n");
  // the ledger keeps the agent's calls too, flagged ones included (revise-loop step 8): never a plan question, whatever its words
  put(join(rp, "decisions.json"), JSON.stringify([{ id: "D-001", plan: "2026-01-01-demo", questionId: "q2", question: "Which colour?", status: "active" },
    { id: "D-002", plan: "2026-01-01-demo", questionId: "autonomy-a1", kind: "autonomy", verdict: "flag", tags: ["close"], question: "How many quick checks?", status: "flagged" }]));
  const map = (qs) => put(join(vd, "plan-map.json"), JSON.stringify({ title: "Demo", totalSeconds: 60, decisions: qs.map(([id, question]) => ({ id, question, options: [] })) }));
  const page = (dir) => { const h = readFileSync(join(dir, "index.html"), "utf8"); return { todo: JSON.parse(h.match(/const TO_REVIEW = (\[.*?\]), STATUS/)[1]), lib: JSON.parse(readFileSync(join(dir, "library.json"), "utf8")) }; };
  map([["q2", "Which colour?"]]); bundle(join(T, "r1"), vd, "--reelplanner", rp);
  let pg = page(join(T, "r1"));
  check("a built plan whose questions are all answered does not ask again", !pg.todo.length && pg.lib.plans[0].stages.decided === true, JSON.stringify(pg.todo));
  map([["q2", "What may an unattended run do?"], ["q3", "How many quick checks?"]]); bundle(join(T, "r2"), vd, "--reelplanner", rp);
  pg = page(join(T, "r2"));
  check("a new round's questions put the plan video under Needs you, even with its id reused", pg.todo[0]?.kind === "Plan video, new round" && /2 new questions/.test(pg.todo[0].what) && pg.lib.plans[0].stages.decided === false, JSON.stringify(pg.todo[0] || null));

  // A page opened for one video carries the videos it builds on ("Before you watch") that are built in its repo: the
  // system video (for its chapter 2), not a plan video it does not name; one not built, one this repo has no video
  // of, and one too big for the page (its files would take it past the budget) say why on their rows (`away`)
  const ra = join(T, "ra", ".reelplanner"), at = (...p) => join("ra", ".reelplanner", ...p);
  put(join(ra, "decisions.json"), "[]");
  const sys = project(at("system-video"), "FONT-A"), other = project(at("plans", "p2", "video"), "FONT-A");
  put(join(sys, "plan-map.json"), JSON.stringify({ title: "The system", slug: "system", chapters: [{ title: "One", start: 0, end: 5 }, { title: "Two", start: 5, end: 9 }] }));
  const big = project(at("plans", "big", "video"), "FONT-A"); for (let i = 0; i < 500; i++) put(join(big, "compositions", "many", `${i}.html`), "<template></template>");
  put(join(ra, "plans", "p0", "plan.md"), "# Planned, not built\n");
  const p1 = project(at("plans", "p1", "video"), "FONT-A");
  const pre = [{ video: "system", part: 2, title: "The system", found: true }, { video: "p0", title: "Planned", found: true }, { video: "gone", title: "Gone", found: true },
    { video: "big", title: "Big", found: true }, { video: "typo", title: "Typo", found: false }];
  put(join(p1, "plan-map.json"), JSON.stringify({ title: "P1", slug: "p1", prerequisites: pre }));
  const po = join(T, "pre-out"), said = bundle(po, p1), plib = JSON.parse(readFileSync(join(po, "library.json"), "utf8"));
  const rows = JSON.parse(readFileSync(join(po, "p1", "plan-map.json"), "utf8")).prerequisites.map((q) => `${q.video}:${q.away || "here"}`);
  check("a page for one video carries the built videos it builds on, after it, and no other", plib.slugs.join() === "p1,system" && plib.carried.join() === "system" && existsSync(join(po, "system", "index.html")) && !existsSync(join(po, "p2")), JSON.stringify(plib.slugs));
  check("…a row it cannot carry says why: not built yet (its plan is here), not found (no such video here), too big for the page; one the plan map never found is left as it was",
    rows.join() === "system:here,p0:not-built,gone:not-found,big:too-big,typo:here", rows.join());
  check("…the one too big is taken out again, with nothing of it left on the page", !existsSync(join(po, "big")) && filesIn(po).length < 480 && /big: left off/.test(said), said.split("\n").filter((l) => /big/.test(l)).join(" | "));
  // the page names its repo, and the player keeps the page's state under it: another repo's page on the same port reads
  // none of it (two repos both have a "system" video); the same repo always gets the same name
  const rb = join(T, "rb", ".reelplanner"); put(join(rb, "decisions.json"), "[]");
  const sysB = project(join("rb", ".reelplanner", "system-video"), "FONT-A");
  const repoOf = (out) => JSON.parse(readFileSync(join(out, "library.json"), "utf8")).repo;
  bundle(join(T, "b-out"), sysB); bundle(join(T, "a-again"), sys);
  const topA = readFileSync(join(po, "index.html"), "utf8");
  check("each repo gets a name of its own, the same every time it is bundled", /^ra-[0-9a-f]{8}$/.test(plib.repo) && /^rb-[0-9a-f]{8}$/.test(repoOf(join(T, "b-out"))) && repoOf(join(T, "a-again")) === plib.repo, `${plib.repo} ${repoOf(join(T, "b-out"))} ${repoOf(join(T, "a-again"))}`);
  check("…the page gives it to the player before the plan map and the video, and the list's keys use it", topA.includes(`const REPO = ${JSON.stringify(plib.repo)};`) && topA.indexOf('rp.setAttribute("repo", REPO);') > 0 && topA.indexOf('rp.setAttribute("repo", REPO);') < topA.indexOf('rp.setAttribute("plan-map"')
    && /"reelplanning@" \+ REPO/.test(topA) && /"rp@" \+ REPO/.test(topA) && !/"rp:watched:" \+ slug/.test(topA));
  // a quick video: its repo keeps no decision log (no .reelplanner/, or one of setup files only), as the review server
  // decides it (a review there downloads); the page says so to the player (record="none"), whose Finish then asks for the
  // download and names no `reel record`. A repo with decisions.json says nothing: today's panel.
  const NONE = 'rp.setAttribute("record", "none");';
  const rs = join(T, "rs"); put(join(rs, ".reelplanner", "config.json"), "{}");
  const quickS = project(join("rs", "videos", "q"), "FONT-A"); bundle(join(T, "rs-out"), quickS);
  const rg = join(T, "rg"); mkdirSync(rg, { recursive: true }); execFileSync("git", ["-C", rg, "init", "-q"]);
  const quickG = project(join("rg", "videos", "q"), "FONT-A"); bundle(join(T, "rg-out"), quickG);
  const topOf = (o) => readFileSync(join(T, o, "index.html"), "utf8");
  check("a repo with no decision log (setup files only, or no .reelplanner/ at all): the page tells the player record=\"none\", before the plan map",
    [topOf("rs-out"), topOf("rg-out")].every((t) => t.indexOf(NONE) > 0 && t.indexOf(NONE) < t.indexOf('rp.setAttribute("plan-map"')));
  check("…a repo with one (decisions.json) does not", !topA.includes(NONE) && !topOf("b-out").includes(NONE));
  const sg = join(T, "sg-out"); put(join(sys, "details", "one.html"), "<!doctype html><p>one</p>");
  put(join(sys, "plan-map.json"), JSON.stringify({ title: "The system", slug: "system", chapters: [{ title: "One", start: 0, end: 5 }], details: [{ name: "one", title: "One", src: "details/one.html", start: 0, end: 5 }] }));
  bundle(sg, sys);
  const gp = existsSync(join(sg, "system", "guide", "index.html")) ? readFileSync(join(sg, "system", "guide", "index.html"), "utf8") : "";
  check("…and its guide page names it too (<meta name=\"reelplanning-repo\">), so a note made there lands in the same record", gp.includes(`<meta name="reelplanning-repo" content="${plib.repo}">`), gp.slice(0, 200));
} catch (e) { ok = false; console.error("✗", e.message); }
rmSync(T, { recursive: true, force: true });
process.exit(ok ? 0 : 1);
