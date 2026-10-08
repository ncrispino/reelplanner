#!/usr/bin/env node
// The plan guide, prototype v5 (after the owner's notes on v4): the guide lives inside the review player. Each
// kind of change the videos-that-make-sense plan made is a part of its guide, a page the player opens over the
// paused frame from the thing it explains (the walkthrough video's `- detail:` beats); the full guide page is every
// part in one flow, with "Watch this moment" back to the player. Both are made from one renderer (guide.js, guide.css)
// and one set of data: prototype v4's (git, the saved runs, the fresh-eyes rounds, walkthrough.md, the glossary),
// with every diff read again from git with ten lines of context, and each file whole at the plan's last commit that
// touched it, its changed lines marked by `git blame`. Nothing typed in.
//
//   <walkthrough-video>/details/<part>.html   the parts (committed: the build's details check opens them)
//   <walkthrough-video>/guide/index.html      the full guide page (built, not committed; bundle-player publishes
//                                             it as <slug>/guide/index.html beside the video)
//
// usage: node .reelplanning/plans/2026-09-28-plan-guide/guide-v5/build.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { deflateSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../../..");
const PLAN = join(ROOT, ".reelplanning/plans/2026-09-28-videos-that-make-sense");
const WT = join(PLAN, "walkthrough-video");
const SLUG = "2026-09-28-videos-that-make-sense--walkthrough";
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
const { readPlanMd } = await import(join(ROOT, "scripts/lib/plan-md.mjs"));

// prototype v4's data: the categories and their (commit, file) diffs, the runs, the findings, the glossary …
const v4 = readFileSync(join(HERE, "../guide-v4-videos-that-make-sense.html"), "utf8");
const D = JSON.parse(v4.match(/<script type="application\/json" id="d">([\s\S]*?)<\/script>/)[1]);
const map = JSON.parse(readFileSync(join(WT, "plan-map.json"), "utf8"));
const plan = readPlanMd(join(PLAN, "plan.md"));

// the plan's commits, in order (walkthrough.md), and what each is
const SHAS = { "4dc6bfc": "step 1", df9c961: "step 2", c430c58: "step 3", b474ec6: "step 4", cc0dde0: "step 5", be0cbcd: "code check", d82e9cc: "walkthrough" };
const ORDER_SHA = Object.keys(SHAS);
// v4's categories, as parts of the guide: each has its scene (where its thing is marked in the frame), its step,
// its summary lines, its runs, its data and its thing to do
const KINDS = {
  command: { v4: "command", scene: 2, step: 1, specs: ["scripts/test/fresh-eyes.spec.mjs"], runs: ["fe-run", "fe-prompt", "brief", "shot13"], data: null, do: "command",
    sum: ["`reelplanning fresh-eyes <video-dir>` takes each scene's picture at rest through the review page and writes two briefs; `--prompt newcomer|designer` prints the one message that starts each agent.", "The pictures stay out of git; briefs, stamp and findings are committed."] },
  "build-gate": { v4: "gate", scene: 3, step: 2, specs: ["scripts/test/fresh-eyes.spec.mjs", "packages/player/test/access.spec.mjs"], runs: ["build-stops", "check-fail", "build-passes"], data: null, do: "gate",
    sum: ["`verify` runs `fresh-eyes --check` as its step 4 of 6. No answer, `kept` with no reason, or a `meaning` the glossary doesn't have: the build stops. No run yet, or scenes changed since: a △ line.", "What round 3 left kept goes in the plan map, on Before you watch (three shown, the rest one click down) and in the notification."] },
  ask: { v4: "ask", scene: 7, step: 3, specs: ["packages/player/test/ask.spec.mjs", "scripts/test/loop.spec.mjs"], runs: [], data: "glossary", do: "ask",
    sum: ["Q, the Ask button or a caption word opens Ask in the side panel, the video paused.", "Hosted: one `sample` call per click. Your machine: `POST /api/ask` to the session on `review --wait`, answered with `inbox answer`; nobody waiting, it goes with the review. Every question is kept in the review's `questions`."] },
  "frame-rules": { v4: "frames", scene: 9, step: 4, specs: ["scripts/test/visuals.spec.mjs"], runs: ["lint-step6", "lint-redrawn", "lint-scene2"], data: "lint", do: "frames",
    sum: ["Style guide §5 gets seven rules. `frame-lint` checks the two a program can see: rule 1, empty bars where words go; rule 5, 40 px clear above a `data-detail` mark. The designer checks all seven on the picture.", "That day, over every video here: LINTSUM"] },
  "system-video": { v4: "system", scene: 10, step: 5, specs: ["scripts/test/fresh-eyes.spec.mjs"], runs: ["check-pass"], data: "findings", do: "system",
    sum: ["Three rounds of two fresh agents: 93 findings, 17 fixed, 3 given a meaning, 73 kept with a reason. 15 frames and 3 voice lines rebuilt, scene ids kept.", "Two fixes reached the tooling: `fix-clip-durations` restamps a frame to its slot (a scene went blank at its end, twice), and the pictures moved to 0.4 s before a scene's end."] },
  skill: { v4: "skill", scene: 1, step: null, specs: [], runs: [], data: null, do: null,
    sum: ["Build a video, step 5: fresh eyes between `build` and opening the page, for every build and every rebuild, at most three rounds. §11's checklist gets the seven rules; the glossary four Other words."] },
  tests: { v4: "tests", scene: 11, step: null, specs: [], runs: ["npm-test", "npm-aof", "codecheck"], data: "specs", do: null,
    sum: ["New: `fresh-eyes.spec` and `ask.spec`. Changed: `loop`, `visuals`, `access`. The fresh code check: steps 5 of 5, decisions 43 of 43, 1 unexplained (answered, no code changed).", "TESTSUM"] },
};
const ORDER = ["command", "build-gate", "ask", "frame-rules", "system-video", "skill", "tests"];
// the part a kind lives in (the skill has no scene of its own: it is the map's last row, so it sits in the map's part)
const PART_OF = { skill: "what-changed" };
const STEP_KIND = { 1: "command", 2: "build-gate", 3: "ask", 4: "frame-rules", 5: "system-video" };
// each moment of the video, and the section it opens (prototype v4's MOMENTS)
const MOMENTS = ["what-changed", "command", "build-gate", "build-gate", "build-gate", "ask", "ask", "ask", "frame-rules", "system-video", "tests", "choices", "choices"];

// ── the diff again, with ten lines of context; each file whole after the change, its changed lines marked ──
const CUT = 2000;
const cut = (s) => s.length > CUT ? `${s.slice(0, 400)}\u0000${s.length - 400}` : s;
function hunksOf(sha, path) {
  let out; try { out = git("show", "-U10", "--format=", "--no-color", "--no-ext-diff", sha, "--", path); } catch { return []; }
  const hunks = []; let cur = null;
  for (const line of out.split("\n")) {
    if (line.startsWith("@@")) { cur = { h: line.replace(/^(@@ [^@]+ @@).*$/, "$1"), l: [] }; hunks.push(cur); continue; }
    if (!cur || /^\\ No newline/.test(line)) continue;
    if (/^(diff --git|index |--- |\+\+\+ |new file|deleted file|similarity|rename )/.test(line) && !cur.l.length) continue;
    if (line === "" ) { cur.l.push(" "); continue; }
    if (!"+- ".includes(line[0])) continue;
    cur.l.push(line[0] + cut(line.slice(1)));
  }
  for (const hk of hunks) while (hk.l.length && hk.l.at(-1) === " ") hk.l.pop();   // the split's last empty line
  return hunks;
}
function wholeOf(path, shas) {
  const at = [...shas].sort((a, b) => ORDER_SHA.indexOf(a) - ORDER_SHA.indexOf(b)).at(-1);
  let text; try { text = git("show", `${at}:${path}`); } catch { return null; }
  if (text.length > 1.5e6) return null;
  const lines = text.replace(/\n$/, "").split("\n");
  const mark = [];
  try {
    const b = git("blame", "-s", "-l", at, "--", path).split("\n");
    b.forEach((l) => { const m = l.match(/^\^?([0-9a-f]{7,40})\s+(\d+)\)/); if (m && shas.some((s) => m[1].startsWith(s))) mark.push(+m[2]); });
  } catch {}
  return { at, lines: lines.map(cut), mark };
}
const specOf = (p) => ({ path: p, name: p.split("/").pop().replace(".spec.mjs", ".spec"), ...(D.specs[p] ? { ok: D.specs[p].ok, checks: D.specs[p].checks } : {}) });
const byV4 = Object.fromEntries(D.cats.map((c) => [c.id, c]));
const kinds = {};
let tot = { files: new Set(), add: 0, del: 0, gadd: 0, gdel: 0 };
for (const id of ORDER) {
  const K = KINDS[id], c = byV4[K.v4];
  const byPath = new Map();
  for (const f of c.files) {
    const e = byPath.get(f.path) || { path: f.path, generated: !!f.generated, isNew: !!f.isNew, add: 0, del: 0, commits: [] };
    e.add += f.add; e.del += f.del; e.isNew ||= !!f.isNew; e.generated ||= !!f.generated;
    e.commits.push({ sha: f.sha, label: SHAS[f.sha] || f.sha, hunks: f.generated ? [] : hunksOf(f.sha, f.path) });
    byPath.set(f.path, e); tot.files.add(f.path);
    if (f.generated) { tot.gadd += f.add; tot.gdel += f.del; } else { tot.add += f.add; tot.del += f.del; }
  }
  const files = [...byPath.values()].map((e) => { e.commits.sort((a, b) => ORDER_SHA.indexOf(a.sha) - ORDER_SHA.indexOf(b.sha)); if (!e.generated) e.whole = wholeOf(e.path, e.commits.map((x) => x.sha)); return e; });
  const code = files.filter((f) => !f.generated);
  const shas = [...new Set(c.files.map((f) => f.sha))].sort((a, b) => ORDER_SHA.indexOf(a) - ORDER_SHA.indexOf(b));
  const s = D.scenes[K.scene - 1], step = K.step ? plan.steps.find((x) => x.n === K.step) : null;
  kinds[id] = { id, name: c.name, short: c.short, scene: { n: K.scene, start: s.start, title: s.title }, step: K.step, stepTitle: step?.title || null, stepText: step?.text || null,
    sum: K.sum.map((l) => l.replace("LINTSUM", D.lintSum).replace("TESTSUM", D.testSum)),
    counts: { files: files.length, add: code.reduce((a, f) => a + f.add, 0), del: code.reduce((a, f) => a + f.del, 0), gen: files.length - code.length },
    add: code.reduce((a, f) => a + f.add, 0), del: code.reduce((a, f) => a + f.del, 0), gen: files.length - code.length,
    commits: shas.map((x) => ({ sha: x, label: SHAS[x] })), specs: id === "tests" ? [{ name: `${D.testTotals.ok} of ${D.testTotals.n} specs`, ok: null }] : K.specs.map(specOf),
    files, runs: K.runs, data: K.data, do: K.do, choices: K.step ? D.choices.filter((x) => x.step === K.step) : [] };
}
const totals = { files: tot.files.size, add: tot.add, del: tot.del, gadd: tot.gadd, gdel: tot.gdel };
const sources = [
  `Diffs: \`git show -U10\` of the plan's commits \`${ORDER_SHA.slice(0, 5).join(" ")}\`, the code check's \`be0cbcd\` and the walkthrough's \`d82e9cc\`, per file, grouped by kind of change; each file whole at the plan's last commit that touched it, the lines \`git blame\` gives to this kind's commits marked.`,
  "Runs: made on 2026-09-28 in a scratch clone of this branch (at `b09aa31`) with the checkout's own tooling; `npm test` in the checkout itself. The two unanswered findings in the build run were made for it, in the scratch copy only.",
  "Findings, choices, the scene times and the meanings: `fresh-eyes/` (every round), `walkthrough.md`, the walkthrough video's `plan-map.json`, `glossary.md` and the storyboards' `terms:`.",
  "The step 6 frame is drawn from its own source, `walkthroughs-that-help/video/compositions/frames/30-step-5-did-it-work.html`.",
];

// ── the pages ──
const tpl = readFileSync(join(ROOT, "templates/details/fresh.html"), "utf8");
const THEME = tpl.match(/<script>\n\/\* rp-theme:[\s\S]*?<\/script>\n/)[0];
const BRIDGE = tpl.match(/<script>\n\/\* rp-bridge v\d:[\s\S]*?<\/script>\n/)[0];
const BASE = tpl.match(/<style>\n([\s\S]*?)<\/style>/)[1];
const CSS = readFileSync(join(HERE, "guide.css"), "utf8"), JS = readFileSync(join(HERE, "guide.js"), "utf8");
const REVIEW = readFileSync(join(ROOT, "packages/player/guide-review.js"), "utf8");
const PAKO = readFileSync(join(ROOT, "node_modules/pako/dist/pako_inflate.min.js"), "utf8").replace(/<\/script/gi, "<\\/script");
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const FACES = JSON.parse(readFileSync(join(ROOT, "packages/player/fonts/faces.json"), "utf8"));
// the faces, from the checkout (the local review page serves the repo root); bundle-player points them at the bundle's fonts/
const facesCss = (base) => FACES.faces.map((f) => `@font-face{font-family:"${f.family}";src:url("${base}${f.file}") format("woff2");font-weight:${f.weight};font-style:${f.style};font-display:swap;unicode-range:${FACES.ranges[f.unicodeRange] || f.unicodeRange}}`).join("\n");
const page = ({ title, data, full }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- A part of the guide (plan 2026-09-28-plan-guide, prototype v5). Built by
     .reelplanning/plans/2026-09-28-plan-guide/guide-v5/build.mjs from git, the saved runs and the walkthrough's data:
     rebuild it there, never edit it here. -->
<title>${title}</title>
${THEME}${full ? `<script>(function(){var r=document.documentElement;if(!/[?&#]theme=/.test(location.search+location.hash)&&matchMedia("(prefers-color-scheme: dark)").matches)r.setAttribute("data-theme","dark");})();</script>\n<style data-rp-faces data-base="../../../../../packages/player/fonts/">\n${facesCss("../../../../../packages/player/fonts/")}\n</style>\n` : ""}<style>
${BASE}
${CSS}
</style>
</head>
<body>
<div id="app"></div>
${full ? `<script type="application/json" id="guide-data">${json(data)}</script>` : `<!-- the part's data, deflated (a part is committed with its video, so it is kept small), and pako's inflate (MIT) to read it -->
<script type="application/octet-stream" id="guide-data-z">${deflateSync(Buffer.from(JSON.stringify(data)), { level: 9 }).toString("base64")}</script>
<script>
${PAKO}
</script>`}
<script>
${JS}
</script>
${full ? `<script>\n${REVIEW}\n</script>\n<script>RPGuideReview.init({ slug: ${json(SLUG)}, map: "../plan-map.json", root: document.getElementById("app"), partOf: ${json(Object.fromEntries(ORDER.map((id) => [id, PART_OF[id] || id])))} });</script>\n` : BRIDGE}</body>
</html>
`;
const common = { title: map.title, slug: SLUG, order: ORDER, partOf: PART_OF, totals, stepKind: STEP_KIND };
const lite = (k) => ({ ...k, files: [], stepText: null, choices: [] });
const needs = (ids) => {
  const ks = ids.map((i) => kinds[i]), want = new Set(ks.flatMap((k) => [k.data, k.do]));
  const runs = new Set(ks.flatMap((k) => k.runs)); if (want.has("command")) runs.add("brief"); if (want.has("gate")) runs.add("build-stops"); if (want.has("frames")) ["lint-step6", "lint-redrawn"].forEach((r) => runs.add(r));
  return { runs: Object.fromEntries([...runs].map((r) => [r, D.runs[r]])),
    findings: want.has("findings") || want.has("ask") || want.has("system") ? D.findings : [], glossary: want.has("glossary") || want.has("ask") ? D.glossary : [],
    lint: want.has("lint") ? D.lint : [], specs: want.has("specs") ? D.specs : {}, testTotals: D.testTotals, img: { redrawn: want.has("frames") ? D.img.redrawn : "" } };
};
mkdirSync(join(WT, "details"), { recursive: true });
const parts = { "what-changed": ["skill"], command: ["command"], "build-gate": ["build-gate"], ask: ["ask"], "frame-rules": ["frame-rules"], "system-video": ["system-video"], tests: ["tests"] };
const sizes = [];
for (const [name, ids] of Object.entries(parts)) {
  const ks = Object.fromEntries(ORDER.map((id) => [id, ids.includes(id) ? kinds[id] : lite(kinds[id])]));
  const t = name === "what-changed" ? "What changed, in full" : kinds[ids[0]].name;
  const html = page({ title: t, data: { ...common, mode: "part", part: name, kinds: ks, ...needs(ids) } });
  writeFileSync(join(WT, "details", `${name}.html`), html); sizes.push(`${name} ${Math.round(html.length / 1024)} KB`);
}
mkdirSync(join(WT, "guide"), { recursive: true });
const full = page({ full: true, title: `Guide · ${map.title}`, data: { ...common, mode: "full", kinds, scenes: D.scenes, thumbs: D.img.th, moments: MOMENTS, choices: D.choices, sources, ...needs(ORDER), runs: D.runs, findings: D.findings, glossary: D.glossary, lint: D.lint, specs: D.specs, img: { redrawn: D.img.redrawn } } });
writeFileSync(join(WT, "guide", "index.html"), full);
console.log(`✓ ${Object.keys(parts).length} parts in ${WT.replace(ROOT + "/", "")}/details/: ${sizes.join(", ")}`);
console.log(`✓ the full guide: ${WT.replace(ROOT + "/", "")}/guide/index.html, ${Math.round(full.length / 1024)} KB (not committed; bundle-player publishes it beside the video)`);
