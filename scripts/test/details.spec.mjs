#!/usr/bin/env node
// The pipeline side of deep dives, against a scratch plan (plan.md + a video's STORYBOARD.md):
//   plan-map      — `detail*` tags → frames[i].detail and details[]; the plan's own text → plan
//   detail new    — every template copied in; a kind with no template starts from fresh
//   check-details — every template passes; a network URL, a missing page, a page with no bridge fail;
//                   a video with no details passes without opening anything; detail_kind is optional
//                   and free (D-085), and two details on one beat are a warning; a frame marking (data-detail)
//                   a name its scene lacks fails, a scene whose detail is marked nowhere warns (fails when strict)
//   what to act on — a comment inside a detail is listed under its step with where it points (reviews/<id>.md)
//   revise-scope  — the reason carries the detail and its anchor
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { actOnMarkdown } from "../lib/review-scope.mjs";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const tmp = mkdtempSync(join(tmpdir(), "details-"));
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], cwd: tmp }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

const planDir = join(tmp, ".reelplanner", "plans", "2026-01-01-uploads"), video = join(planDir, "video");
mkdirSync(video, { recursive: true });
writeFileSync(join(planDir, "plan.md"), `# Resumable uploads

## The problem

Uploads fail at **90 %** and start again.

- one
- two

## Steps

### Step 1 — Cut the file into parts

Parts of 16 MB, each with a checksum.

### Step 2 — Resume from the manifest

The browser asks what is done, then sends the rest.

## Components touched

- **Upload API**
`);
const KINDS = ["explore", "try", "evidence", "table", "code", "fresh"];
const frame = (n, extra = "") => `## Frame ${n} — Frame ${n}\n- src: compositions/frames/${String(n).padStart(2, "0")}.html\n- duration: 4\n- plan_step: ${n <= 4 ? 1 : 2}\n${extra}`;
const storyboard = `---\ntitle: "Uploads"\nplan_dir: .reelplanner/plans/2026-01-01-uploads\n---\n\n` +
  KINDS.map((k, i) => frame(i + 1, `- detail: d-${k}\n- detail_kind: ${k}\n- detail_title: The ${k} page\n- detail_why: What the ${k} page holds that the video cannot.\n${k === "evidence" ? "- autonomy: a1\n" : ""}`)).join("\n") +
  "\n" + frame(7, "- detail: d-benchmark\n- detail_kind: benchmark\n- detail_title: A kind with no template\n- detail_why: Any word is a kind.\n") +
  "\n" + frame(8, "- detail: d-nokind\n- detail_title: No kind at all\n- detail_why: The kind is optional.\n") +
  "\n" + frame(9);
writeFileSync(join(video, "STORYBOARD.md"), storyboard);

// ---- plan-map ----
let r = run("plan-map.mjs", video);
ok("plan-map runs", r.code === 0, r.out);
const map = JSON.parse(readFileSync(join(video, "plan-map.json"), "utf8"));
const NAMES = [...KINDS.map((k) => `d-${k}`), "d-benchmark", "d-nokind"];
ok("details[]: one per tagged beat, in order", map.details.map((d) => d.name).join(",") === NAMES.join(","), JSON.stringify(map.details.map((d) => d.name)));
ok("a free kind is carried as written; no kind is null", map.details[6].kind === "benchmark" && map.details[7].kind === null, JSON.stringify(map.details.slice(6)));
const ev = map.details.find((d) => d.kind === "evidence");
ok("a detail carries src, title, kind, why, frame, step, start/end", ev.src === "details/d-evidence.html" && ev.title === "The evidence page" && ev.why.startsWith("What the evidence") && ev.frameIndex === 3 && ev.compositionId === "03" && ev.planStep === 1 && ev.start === 8 && ev.end === 12, JSON.stringify(ev));
ok("autonomy: the call on its beat, else null", ev.autonomy === "a1" && map.details.find((d) => d.kind === "table").autonomy === null);
ok("frames[i].detail: the name, absent on a beat without one", map.frames[0].detail === "d-explore" && !("detail" in map.frames[8]));
ok("no detail_* tags left on frames", map.frames.every((f) => !("detailTitle" in f) && !("detailKind" in f) && !("detailWhy" in f)));
ok("plan: title and problem from plan.md", map.plan?.title === "Resumable uploads" && map.plan.problem.startsWith("Uploads fail at **90 %**") && map.plan.problem.includes("- two"), JSON.stringify(map.plan));
ok("plan: each step's number, title and Markdown body", map.plan.steps.length === 2 && map.plan.steps[1].n === 2 && map.plan.steps[1].title === "Resume from the manifest" && map.plan.steps[1].text === "The browser asks what is done, then sends the rest.", JSON.stringify(map.plan.steps));

// ---- a video with no details passes untouched ----
const bare = join(tmp, "bare"); mkdirSync(bare);
writeFileSync(join(bare, "STORYBOARD.md"), `---\ntitle: "Bare"\n---\n\n${frame(1)}`);
r = run("check-details.mjs", bare);
ok("no details: passes, no browser", r.code === 0 && /no details/.test(r.out), r.out);
run("plan-map.mjs", bare);
const bareMap = JSON.parse(readFileSync(join(bare, "plan-map.json"), "utf8"));
ok("no plan_dir: no plan, empty details", !("plan" in bareMap) && Array.isArray(bareMap.details) && !bareMap.details.length);

// ---- a missing page fails ----
r = run("check-details.mjs", video);
ok("a missing page fails the check, naming it and the command to start it", r.code === 1 && /details\/d-table\.html is missing/.test(r.out) && /detail new .* d-table --kind table/.test(r.out), r.out);

// ---- every template, copied in by `detail new`, passes ----
for (const k of KINDS) {
  r = run("detail.mjs", "new", video, `d-${k}`, "--kind", k);
  ok(`detail new --kind ${k}`, r.code === 0 && existsSync(join(video, "details", `d-${k}.html`)), r.out);
}
const fresh = readFileSync(join(ROOT, "templates/details/fresh.html"), "utf8");
r = run("detail.mjs", "new", video, "d-benchmark", "--kind", "benchmark");
ok("a kind with no template starts from fresh, and says so", r.code === 0 && readFileSync(join(video, "details", "d-benchmark.html"), "utf8") === fresh && /from the fresh template/.test(r.out) && /detail_kind: benchmark/.test(r.out), r.out);
r = run("detail.mjs", "new", video, "d-nokind");
ok("no --kind: starts from fresh", r.code === 0 && readFileSync(join(video, "details", "d-nokind.html"), "utf8") === fresh, r.out);
r = run("detail.mjs", "new", video, "d-table", "--kind", "table");
ok("detail new will not overwrite a page", r.code === 1 && /exists/.test(r.out));
writeFileSync(join(tmp, "rows.json"), JSON.stringify({ title: "Rows", columns: [{ key: "a", label: "A" }], rows: [{ a: "has </script> in it" }, { a: "2" }] }));
r = run("detail.mjs", "new", video, "d-table", "--kind", "table", "--force", "--data", join(tmp, "rows.json"));
ok("--data writes the JSON block, a </script> in a string escaped", r.code === 0 && readFileSync(join(video, "details", "d-table.html"), "utf8").includes("has \\u003c/script> in it"), r.out);
r = run("check-details.mjs", video);
ok("every template passes the check (static and, when available, in Chromium)", r.code === 0 && /8 page\(s\) ok/.test(r.out), r.out);
ok("a free kind, or none, is not a finding", !/^\s*! /m.test(r.out) && !/detail_kind/.test(r.out), r.out);
r = run("check-details.mjs", "--page", ...readdirSync(join(ROOT, "templates/details")).map((f) => join(ROOT, "templates/details", f)));
ok("the templates themselves pass", r.code === 0, r.out);

// every template carries the same bridge
const bridge = (f) => (readFileSync(join(ROOT, "templates/details", f), "utf8").match(/<script>\n\/\* rp-bridge v\d[\s\S]*?<\/script>/) || [])[0];
const bridges = readdirSync(join(ROOT, "templates/details")).map(bridge);
ok("one bridge, byte for byte, in every template", bridges.length === 6 && bridges.every((b) => b && b === bridges[0]));

// the review page's look (D-167): the darker coral (D-142), three solid inks, the faces from the player; one theme
// script and one token block, byte for byte, in every template
const THEME_RE = /<script>\n\/\* rp-theme:[\s\S]*?<\/script>\n/, TOKENS_RE = /\/\* the player's tokens[\s\S]*?\n(?=\/\* one calm page)/;
const tpls = readdirSync(join(ROOT, "templates/details")).map((f) => readFileSync(join(ROOT, "templates/details", f), "utf8"));
const themes = tpls.map((h) => (h.match(THEME_RE) || [])[0]), tokens = tpls.map((h) => (h.match(TOKENS_RE) || [])[0]);
ok("one theme script and one token block, byte for byte, in every template", themes.every((t) => t && t === themes[0]) && tokens.every((t) => t && t === tokens[0]));
ok("the darker coral in both themes, at text size too, and no old coral anywhere",
  /:root\{[^}]*--accent:#B8552E;--accent-text:#9C4524;/.test(tokens[0]) && /:root\[data-theme="dark"\]\{[^}]*--accent:#D2693F;--accent-text:#E3A184;/.test(tokens[0]) && tpls.every((h) => !/#CC785C|#A5614A/i.test(h)), tokens[0]);
ok("text in the player's three solid inks (the old alpha names are aliases of them)",
  /--ink-2:#3D3B37;--ink-3:#5C5953;/.test(tokens[0]) && /--ink-2:#CFCAC1;--ink-3:#A6A196;/.test(tokens[0]) && /--ink-72:var\(--ink-2\);--ink-55:var\(--ink-3\)/.test(tokens[0]), tokens[0]);
ok("the page takes the faces the player posts (in its panel), and only from the player", /"rp-player"/.test(themes[0]) && /event !== "faces"/.test(themes[0]) && /e\.source !== window\.parent/.test(themes[0]) && /new FontFace/.test(themes[0]));
ok("coral stays off what is current or a state (A24): explore's step in ink, try's lost upload hatched",
  /\.part\[data-hot\] rect\{stroke:var\(--ink\)/.test(readFileSync(join(ROOT, "templates/details/explore.html"), "utf8")) && tpls.every((h) => !/data-hot\][^{]*\{[^}]*--accent|data-state="lost"\][^{]*\{[^}]*--accent/.test(h)));

// ---- detail restyle: a page built from an older template takes today's theme script and tokens, and keeps its own content ----
const old = join(video, "details", "d-old.html"), fresh0 = readFileSync(join(ROOT, "templates/details/fresh.html"), "utf8");
const oldTokens = ":root{--paper:#FAF9F5;--tile:#EFE9DE;--ink:#141413;--ink-rgb:20,20,19;--accent:#CC785C;--accent-text:#A5614A;--hair:.12;--dim:.2;--tint:9%;color-scheme:light}\n:root{--ink-72:rgba(var(--ink-rgb),.72);--ink-55:rgba(var(--ink-rgb),.55)}\n";
const oldTheme = "<script>\n/* rp-theme: an older one */\n(function () {})();\n</script>\n";
writeFileSync(old, fresh0.replace(TOKENS_RE, `/* the player's tokens (old) */\n${oldTokens}`).replace(THEME_RE, oldTheme).replace("<!-- build the page here", "<p>kept</p>\n  <!-- build the page here"));
writeFileSync(join(video, "details", "d-loose.html"), "<!doctype html><title>Hand-made</title><p>no template</p>");
r = run("detail.mjs", "restyle", video);
const after = readFileSync(old, "utf8");
ok("detail restyle: the older page takes today's theme script and tokens, its own content kept", r.code === 0 && after === fresh0.replace("<!-- build the page here", "<p>kept</p>\n  <!-- build the page here") && /restyled +details\/d-old\.html/.test(r.out), r.out);
ok("detail restyle: a page from no template is left as it is, and said", /! details\/d-loose\.html: no rp-theme script/.test(r.out) && readFileSync(join(video, "details", "d-loose.html"), "utf8").includes("no template"), r.out);
r = run("detail.mjs", "restyle", video, "d-old");
ok("detail restyle again: nothing to change", r.code === 0 && /0 of 1 page\(s\) restyled/.test(r.out) && /unchanged details\/d-old\.html/.test(r.out), r.out);
rmSync(old); rmSync(join(video, "details", "d-loose.html"));

// ---- a page that loads from the network fails ----
const tbl = join(video, "details", "d-table.html"), good = readFileSync(tbl, "utf8");
writeFileSync(tbl, good.replace("</style>", "</style>\n<img src=\"https://example.com/pixel.gif\" alt=\"\">"));
r = run("check-details.mjs", video);
ok("a network URL fails the check", r.code === 1 && /d-table\.html: an attribute points at a network URL/.test(r.out), r.out);
writeFileSync(tbl, good.replace("const cols = D.columns", "const im = new Image(); im.src = 'ht' + 'tps://example.com/p.gif';\nconst cols = D.columns"));
r = run("check-details.mjs", video);
const browser = !/not opened in a browser/.test(r.out);
if (browser) ok("a network load built at run time fails in the browser", r.code === 1 && /asked for https:\/\/example\.com\/p\.gif/.test(r.out), r.out);
else console.log("· skipped the in-browser checks: playwright-core or Chromium is not available here");
writeFileSync(tbl, good.replace(/<script>\n\/\* rp-bridge v\d[\s\S]*?<\/script>/, ""));
r = run("check-details.mjs", video);
ok("a page without the bridge fails", r.code === 1 && /d-table\.html: no bridge/.test(r.out), r.out);
if (browser) {
  writeFileSync(tbl, good.replace("const cols = D.columns", "undefinedThing();\nconst cols = D.columns"));
  r = run("check-details.mjs", video);
  ok("a page error fails", r.code === 1 && /page error: .*undefinedThing/.test(r.out), r.out);
  // an anchor that starts with a control (A9: the control acts, it does not comment) is clicked elsewhere
  writeFileSync(tbl, good.replace(/<body([^>]*)>/, '<body$1>\n<div data-anchor="first line" style="padding:6px 0"><button type="button">Copy</button> the words of the first line</div>'));
  r = run("check-details.mjs", video);
  ok("an anchor that starts with a button is still clicked fairly", r.code === 0, r.out);
}
writeFileSync(tbl, good);
writeFileSync(join(video, "STORYBOARD.md"), storyboard.replace("- detail: d-try\n", "- detail: d-try\n- detail: d-table\n"));
r = run("check-details.mjs", video, "--no-browser");
ok("two details on one beat: a warning, not a failure", r.code === 0 && /! frame 2 .*2 detail tags: only the last \(d-table\) opens/.test(r.out), r.out);
writeFileSync(join(video, "STORYBOARD.md"), storyboard);

// ---- details in the frame (plan 2026-09-27, step 1): the frame marks the thing, the storyboard names it ----
const FR = join(video, "compositions", "frames"); mkdirSync(FR, { recursive: true });
const frameFile = (n, body) => writeFileSync(join(FR, `${String(n).padStart(2, "0")}.html`), `<template><div data-composition-id="${String(n).padStart(2, "0")}" data-band="bottom">${body}</div></template>\n`);
for (let n = 1; n <= 9; n++) frameFile(n, "<p>nothing marked</p>");
r = run("check-details.mjs", video, "--no-browser");
ok("a scene whose detail its frame marks nowhere is a warning, and the check passes", r.code === 0 && /! frame 1 \(Frame 1\): detail d-explore: nothing in its frame is marked data-detail="d-explore"/.test(r.out) && (r.out.match(/nothing in its frame is marked/g) || []).length === 8, r.out);
frameFile(1, `<div data-artifact="the map" data-detail="d-explore">the map</div>`);
r = run("check-details.mjs", video, "--no-browser");
ok("…a frame that marks its scene's detail is not warned on", r.code === 0 && !/frame 1 \(Frame 1\): detail d-explore/.test(r.out), r.out);
frameFile(9, `<!-- data-detail="d-commented" --><div data-detail="d-try">the try page, marked on the wrong scene</div>`);
r = run("check-details.mjs", video, "--no-browser");
ok("a frame that marks a name the storyboard does not give its scene fails", r.code === 1 && /✗ frame 9 \(Frame 9\): its frame marks data-detail="d-try", a detail the storyboard does not give this scene/.test(r.out) && !/d-commented/.test(r.out), r.out);
frameFile(9, `<div data-artifact="a frame-lint run"><div class="row">    data-detail="d-try" reaches the lowest eighth</div></div><script>var s = " data-detail='d-try'";</script>`);
r = run("check-details.mjs", video, "--no-browser");
ok("…the words data-detail=\"…\" in a frame's text or script mark nothing (a real run on screen shows them)", r.code === 0 && !/frame 9 \(Frame 9\): its frame marks/.test(r.out), r.out);
frameFile(9, `<div data-detail="d-explore">another scene's name</div>`);
frameFile(2, `<div data-detail="d-table">not this scene's</div>`);
r = run("check-details.mjs", video, "--no-browser");
ok("…naming what the scene does give, when it gives one", r.code === 1 && /frame 2 \(Frame 2\): its frame marks data-detail="d-table", a detail the storyboard does not give this scene \(it gives d-try\)/.test(r.out) && /frame 9 \(Frame 9\): its frame marks data-detail="d-explore"/.test(r.out), r.out);
frameFile(9, "<p>nothing marked</p>"); frameFile(2, "<p>nothing marked</p>");
writeFileSync(join(video, "STORYBOARD.md"), storyboard.replace("plan_dir:", "details_check: strict\nplan_dir:"));
r = run("check-details.mjs", video, "--no-browser");
ok("under `details_check: strict`, a scene whose detail is marked nowhere fails", r.code === 1 && /✗ frame 2 \(Frame 2\): detail d-try: nothing in its frame is marked data-detail="d-try".*\(details_check: strict\)/.test(r.out) && !/frame 1 \(Frame 1\): detail d-explore/.test(r.out), r.out);
for (let n = 2; n <= 8; n++) frameFile(n, `<div data-detail="${NAMES[n - 1]}">marked</div>`);
r = run("check-details.mjs", video, "--no-browser");
ok("…and passes once every scene marks its thing", r.code === 0 && !/nothing in its frame is marked/.test(r.out), r.out);
writeFileSync(join(video, "STORYBOARD.md"), storyboard);
rmSync(join(video, "compositions"), { recursive: true, force: true });

// ---- what to act on, and revise-scope: a comment inside a detail says where it points ----
const ann = {
  exportedAt: "2026-01-02T00:00:00Z", verdict: "changes", decisions: [],
  annotations: [
    { id: "n1", kind: "note", t: 9.5, comment: "Is 32 MB really slower on a good network?", plan: { step: 1 }, frame: { index: 3, title: "Frame 3" }, detail: { name: "d-evidence", anchor: "run: 32 MB", text: "32 MB 45 5:25 58" } },
    { id: "n2", kind: "note", t: 12, comment: "Say this plainer", plan: { step: 2 }, frame: { index: 5, title: "Frame 5" } },
  ],
};
writeFileSync(join(tmp, "review.json"), JSON.stringify(ann));
const resolved = actOnMarkdown({ id: "plan-x", kind: "plan", review: ann, planName: "2026-01-01-uploads", map: JSON.parse(readFileSync(join(video, "plan-map.json"), "utf8")) });
ok("what to act on lists the detail comment under its step, with where it points", /- \*\*Step 1\*\*\n  - comment in detail `d-evidence` at `run: 32 MB`: "Is 32 MB really slower on a good network\?" \(pointing at "32 MB 45 5:25 58"\)/.test(resolved), resolved);
ok("what to act on keeps ordinary comments, with their moment and frame", /- \*\*Step 2\*\*\n  - comment at 0:12 \(Frame 5\): "Say this plainer"/.test(resolved), resolved);
r = run("revise-scope.mjs", planDir, join(tmp, "review.json"));
const scope = JSON.parse(r.out);
const reason = scope.steps.find((s) => s.step === 1)?.reasons[0];
ok("revise-scope carries the detail and its anchor in the reason", r.code === 0 && reason?.detail?.name === "d-evidence" && reason.detail.anchor === "run: 32 MB" && reason.about === "detail d-evidence at run: 32 MB", JSON.stringify(reason));

rmSync(tmp, { recursive: true, force: true });
if (failed) { console.error(`\n✗ ${failed} failed`); process.exit(1); }
console.log("\n✓ details: all passed");
