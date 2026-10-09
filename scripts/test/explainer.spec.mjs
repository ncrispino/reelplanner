#!/usr/bin/env node
// Explain first (the explain-first plan), against a scratch repo:
//   explain        — any source pinned by its form, described by its shape (a sequence, files, a table, text), the
//                    guide rule by size (over 200 lines), never by a kind; a file outside the repo by its ~/ path,
//                    hash and lines, never its text; a second ask a new folder (a snapshot); an unknown source refused
//   check-sources  — a quoted line word for word in its source, read at the pinned commit; "…" cuts and data-label
//                    chrome; an unpinned source; a key, an email, a home path stop it (masked passes); a number with
//                    no source (a warning; strict fails); a decision beat in an explainer
//   reel record    — an explainer's review: reviews/explainer-<time>.json and .md, by scene; nothing in the ledger;
//                    your memory gets it. reel-intake files one sent from the page
//   new-plan --from and prereqs — "Explained first", the review quoted in the problem; the explainer first under
//                    Before you watch, with a recap line (D-248)
//   the review page — the Explainer row: the commit it explains, commits since, what came of it
//   fresh eyes     — the fact check (the checker) only for an explainer with a source that needs a guide part
//   Finish's next  — what Explain more and Plan this would mean for this video, made at build time into the plan map
//                    (scene tags, long sources, explain.md's open threads); what was picked filed with the review, and
//                    new-plan --from and Explain more start from it; the packed map says the commits since
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { videoDirFor, slugOf } from "../lib/terms.mjs";
import { videoLength, lengthLine } from "../lib/length.mjs";
import { rolesFor, parseFindings, freshEyesState } from "../lib/fresh-eyes.mjs";
import { privateIn, resolveRefs, nextSuggestions, asPlan } from "../lib/explainer.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-explainer-"));
const home = join(tmp, "home"); mkdirSync(home, { recursive: true });
process.env.REELPLANNER_HOME = join(home, ".reelplanner");   // `reel record` adds to your memory: keep it out of the real one
const repo = join(tmp, "repo"), rp = join(repo, ".reelplanner");
const env = { ...process.env, HOME: home, REELPLANNER_HOME: join(home, ".reelplanner") };
const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: repo, env, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => run("reel.mjs", ...a);
const write = (p, text) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, text); };
const commit = (msg) => { git("add", "-A"); git("commit", "-q", "-m", msg); };
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };

try {
  mkdirSync(repo, { recursive: true });
  git("init", "-q", "-b", "main"); git("config", "user.email", "sam@example.com"); git("config", "user.name", "Sam"); git("config", "commit.gpgsign", "false");
  reel("init", repo, "--name", "demo", "--kind", "greenfield");
  const led = json(join(rp, "decisions.json")); led.decisions.push({ id: "D-001", date: "2026-09-20", question: "Where do reviews go?", chosen: "The inbox", why: "one place", status: "active", components: [] }); writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  write(join(repo, "src/app.mjs"), "// the app\nexport function claim(rp, id, by, extra = {}) {\n  return { rp, id, by, ...extra };\n}\n");
  write(join(repo, "src/big.mjs"), Array.from({ length: 240 }, (_, i) => `export const v${i} = ${i};`).join("\n") + "\n");
  write(join(repo, "README.md"), "# demo\n");
  commit("start");
  const first = git("rev-parse", "--short=12", "HEAD").trim();
  write(join(repo, "README.md"), "# demo\n\nA demo.\n");
  commit("say what it is");
  // files outside the repo: a transcript in your home, a table of results
  const tr = join(home, ".claude", "session.jsonl");
  write(tr, [{ turn: 1, text: "run the tests" }, { turn: 2, text: "the tests passed on the \"second\" run" }].map((x) => JSON.stringify(x)).join("\n") + "\n" + Array.from({ length: 230 }, (_, i) => JSON.stringify({ turn: i + 3, text: `step ${i}` })).join("\n") + "\n");
  const csv = join(tmp, "runs", "results.csv"); write(csv, "run,loss\na,0.83\nb,0.61\n");

  // ---- explain: sources pinned by form, described by shape; the guide by size ----
  const ex = run("explain.mjs", "what did the experiment show?", csv, "src", `${first}..HEAD`, "D-001", tr, "--date", "2026-09-29", "--slug", "experiment");
  const ed = join(rp, "explainers", "2026-09-29-experiment");
  ok("explain: makes the explainer's folder, its sources and its video's start", ex.code === 0 && ["explain.md", "sources.json", "video/BRIEF.md", "video/STORYBOARD.md"].every((f) => existsSync(join(ed, f))), ex.out);
  ok("explain: video/ is a HyperFrames project already (init refuses a folder with files in it, so explain runs it first)",
    ["hyperframes.json", "index.html"].every((f) => existsSync(join(ed, "video", f))) && /video\/: a HyperFrames project/.test(ex.out), ex.out);
  const S = json(join(ed, "sources.json")), by = (id) => S.sources.find((s) => s.id === id);
  ok("explain: the question in your words, and the commit it starts from", S.question === "what did the experiment show?" && S.commit === git("rev-parse", "--short=12", "HEAD").trim(), JSON.stringify(S).slice(0, 300));
  ok("explain: a CSV outside the repo is a table, by its path and hash, never its text", by(csv)?.shape === "table" && by(csv).form === "outside" && by(csv).hash && !JSON.stringify(S).includes("0.83"), JSON.stringify(by(csv)));
  ok("explain: a folder is files, and a file over 200 lines gets a guide part (by size, never kind)", by("src")?.shape === "files" && by("src").files.length === 2 && by("src").guide === true && JSON.stringify(by("src").parts) === JSON.stringify(["src/big.mjs"]), JSON.stringify(by("src")));
  ok("explain: a range of commits is the change to files", by(`${first}..HEAD`)?.form === "git" && by(`${first}..HEAD`).shape === "files" && by(`${first}..HEAD`).size.commits === 1, JSON.stringify(by(`${first}..HEAD`)));
  ok("explain: a decision is text", by("D-001")?.shape === "text", JSON.stringify(by("D-001")));
  const trPin = S.sources.find((s) => s.form === "outside" && s.shape === "sequence");
  ok("explain: a transcript in your home is a sequence, shown as ~/…, and long enough for a guide part", trPin?.path === "~/.claude/session.jsonl" && trPin.guide === true && trPin.size.lines === 232 && !readFileSync(join(ed, "sources.json"), "utf8").includes(home), JSON.stringify(trPin));
  const sb0 = readFileSync(join(ed, "video", "STORYBOARD.md"), "utf8");
  ok("explain: the storyboard is an explainer's, strict on its sources, filed to its folder", /^kind: explainer$/m.test(sb0) && /^sources_check: strict$/m.test(sb0) && /^plan_dir: \.reelplanner\/explainers\/2026-09-29-experiment$/m.test(sb0), sb0.slice(0, 400));
  ok("explain: explain.md says what you asked and lists each source", /\*\*You asked:\*\* "what did the experiment show\?"/.test(readFileSync(join(ed, "explain.md"), "utf8")) && /`src` · files · 2 files/.test(readFileSync(join(ed, "explain.md"), "utf8")));
  ok("explain: explain.md asks for its open threads, which Finish offers under Plan this", /^## Open threads$/m.test(readFileSync(join(ed, "explain.md"), "utf8")) && /next_plan/.test(sb0), readFileSync(join(ed, "explain.md"), "utf8"));
  write(join(tmp, "runs", "config.yaml"), "lr: 0.001\nsteps: 400\n");
  const folder = run("explain.mjs", "what did the runs show?", join(tmp, "runs"), "--date", "2026-09-29", "--slug", "runs");
  const F = existsSync(join(rp, "explainers", "2026-09-29-runs", "sources.json")) ? json(join(rp, "explainers", "2026-09-29-runs", "sources.json")) : { sources: [] };
  ok("explain: a folder outside the repo is pinned file by file, each with its own shape", folder.code === 0 && F.sources.map((x) => `${x.shape}:${x.id.split("/").pop()}`).join() === "text:config.yaml,table:results.csv", `${folder.out}\n${JSON.stringify(F.sources)}`);
  const again = run("explain.mjs", "what did the experiment show?", csv, "--date", "2026-09-29", "--slug", "experiment");
  ok("explain: asked again, a new folder beside the first (a snapshot)", again.code === 0 && existsSync(join(rp, "explainers", "2026-09-29-experiment-2", "sources.json")), again.out);
  // a repo with no commit yet: said plainly, never a git stack trace
  const bare = join(tmp, "bare"); mkdirSync(join(bare, ".reelplanner"), { recursive: true }); writeFileSync(join(bare, "notes.md"), "# notes\n");
  writeFileSync(join(bare, ".reelplanner", "decisions.json"), JSON.stringify({ decisions: [] }));   // set up: `reel init` ran here
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: bare });
  const none = (() => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "explain.mjs"), "what are these notes?", "notes.md"], { encoding: "utf8", cwd: bare, env, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } })();
  ok("explain: a repo with no commit yet says to commit once first", none.code === 1 && /has no commit yet: .*commit once first/.test(none.out) && !/at checkExecSyncError/.test(none.out), none.out);
  const bad = run("explain.mjs", "x", "no-such-thing");
  ok("explain: a source it cannot pin is refused, saying what a source can be", bad.code === 1 && /none of: a path, a commit or a range/.test(bad.out), bad.out);

  // ---- check-sources ----
  // the explained file changes after it was pinned: its quoted lines are still read as they were
  write(join(repo, "src/app.mjs"), "// the app, changed\nexport function claim(rp, id) {\n  return { rp, id };\n}\n");
  commit("change claim");
  const vd = join(ed, "video");
  const frame = (n, inner) => write(join(vd, "compositions", "frames", `${String(n).padStart(2, "0")}.html`), `<template><style>.x{}</style><div id="root" data-band="bottom">${inner}</div><script>var tl=1;</script></template>`);
  const board = (fm, frames) => writeFileSync(join(vd, "STORYBOARD.md"), `---\ntitle: "What did the experiment show"\nkind: explainer\nplan_dir: .reelplanner/explainers/2026-09-29-experiment\n${fm}---\n\n${frames.map((f, i) => `## Frame ${i + 1} — ${f.title || `scene ${i + 1}`}\n\n${f.source ? `- source: ${f.source}\n` : ""}${f.extra || ""}- src: compositions/frames/${String(i + 1).padStart(2, "0")}.html\n- voiceover: "${f.say || "Plain words."}"\n`).join("\n")}`);
  const script = (lines) => writeFileSync(join(vd, "SCRIPT.md"), `# SCRIPT\n\n${lines.map((l, i) => `## Line ${i + 1} (Frame ${i + 1})\n\n    ${l}\n`).join("\n")}`);
  const check = () => run("check-sources.mjs", vd);
  // the good case: the line as it was at the pinned commit (it changed since), a label that is not a quote, a cut
  frame(1, `<div data-artifact="src/app.mjs"><div data-label="1">src/app.mjs · ${first.slice(0, 7)}</div><div class="ln">export function claim(rp, id, by, extra = {}) {</div><div class="ln">  return { rp, id, <span>by</span>, …extra };</div></div>`);
  frame(2, `<div data-artifact="the results"><div>run</div><div>loss</div><div>0.83</div></div><p>Two numbers moved.</p>`);
  frame(3, `<div data-artifact="the transcript"><div>the tests passed on the "second" run</div></div>`);
  board("sources_check: strict\n", [{ source: "src/app.mjs:1-4" }, { source: csv }, { source: "~/.claude/session.jsonl" }]);
  script(["claim takes four things.", "The loss fell to 0.61.", "The tests passed on the second run."]);
  let c = check();
  ok("check-sources: quoted lines its sources hold pass, read at the pinned commit (the file changed since), with a label and a cut", c.code === 0 && /^✓ check-sources: 3 scenes/m.test(c.out), c.out);
  frame(1, `<div data-artifact="src/app.mjs"><div class="ln">export function claim(rp, id, extra = {}) {</div></div>`);
  c = check();
  ok("check-sources: a line retyped with a word missing fails: not in its source", c.code === 1 && /scene 1 · quoted line not in src\/app\.mjs:1-4: "export function claim\(rp, id, extra = \{\}\) \{"/.test(c.out), c.out);
  frame(1, `<div data-artifact="src/app.mjs"><div class="ln">export function claim(rp, id, by, extra = {}) {</div></div>`);
  board("sources_check: strict\n", [{ source: "src/nope.mjs" }, { source: csv }, { source: "~/.claude/session.jsonl" }]);
  c = check();
  ok("check-sources: a source not pinned in sources.json fails", c.code === 1 && /scene 1 · `- source: src\/nope\.mjs` is not pinned/.test(c.out), c.out);
  board("sources_check: strict\n", [{ source: "src/app.mjs" }, { source: csv }, { source: "~/.claude/session.jsonl" }]);
  // made-up keys, put together at run time so no key-shaped string sits in the repo (a push's secret scan would stop it)
  const fakeKey = ["sk", "proj", "abcdefghijklmnop1234"].join("-"), fakeToken = ["ghp", "abcdefghijklmnopqrstuvwx1234"].join("_");
  frame(3, `<div data-artifact="the transcript"><div>OPENAI_API_KEY=${fakeKey} in turn 212</div></div>`);
  c = check();
  ok("check-sources: a key in a quoted line stops it until masked, and the check never repeats the key", c.code === 1 && /scene 3 · an OpenAI or Anthropic key in its text \(sk-proj-…\): the build stops until the text itself is cut or masked \(sk-proj-…REDACTED\)/.test(c.out) && !c.out.includes("abcdef"), c.out);
  ok("check-sources: masked (sk-…REDACTED), a key is no longer found", !privateIn("OPENAI_API_KEY=sk-…REDACTED").length && !privateIn("ghp_…REDACTED").length);
  // the key in the transcript itself, masked on the frame: the pieces around the mask are its source's, word for word
  writeFileSync(tr, readFileSync(tr, "utf8") + JSON.stringify({ turn: 400, text: `export GITHUB_TOKEN=${fakeToken} and rerun` }) + "\n");
  frame(3, `<div data-artifact="the transcript"><div>export GITHUB_TOKEN=ghp_…REDACTED and rerun</div></div>`);
  c = check();
  ok("check-sources: a masked key passes, the words around the mask checked against the source", c.code === 0 && !/scene 3/.test(c.out), c.out);
  frame(3, `<div data-artifact="the transcript"><div>the tests passed on the "second" run</div></div><p>ask sam.lee@acme.io, in /home/sam/runs/</p>`);
  c = check();
  ok("check-sources: an email address and a path in a home folder stop it too", c.code === 1 && /scene 3 · an email address/.test(c.out) && /scene 3 · a path in a home folder \(show it as ~\/…\)/.test(c.out), c.out);
  frame(3, `<div data-artifact="the transcript"><div>the tests passed on the "second" run</div></div>`);
  board("", [{ source: "src/app.mjs" }, { source: csv }, {}]);
  c = check();
  ok("check-sources: a scene that states a number with no source is a warning", c.code === 0 && /△ scene 3 · quotes a thing with no `- source:`/.test(c.out), c.out);
  script(["claim takes four things.", "The loss fell to 0.61.", "The server retried 3 times."]);
  frame(3, `<p>It retried.</p>`);
  board("sources_check: strict\n", [{ source: "src/app.mjs" }, { source: csv }, {}]);
  c = check();
  ok("check-sources: under sources_check: strict, a number with no source fails", c.code === 1 && /✗ scene 3 · says "3" with no `- source:` \(sources_check: strict\)/.test(c.out), c.out);
  script(["claim takes four things, in step 2.", "The loss fell to 0.61.", "Nothing more."]);
  board("sources_check: strict\n", [{ source: "src/app.mjs" }, { source: csv }, { extra: "- decision: q1\n- question: Which?\n" }]);
  c = check();
  ok("check-sources: a decision beat in an explainer fails (it asks nothing to decide)", c.code === 1 && /scene 3 · a `- decision:` beat: an explainer asks nothing to decide/.test(c.out), c.out);
  ok("check-sources: a ref with lines resolves to its source and range; a file in a pinned folder to that folder", (() => { const r = resolveRefs("src/app.mjs:2-3, src/big.mjs", S.sources); return r[0].source?.id === "src" && r[0].path === "src/app.mjs" && r[0].from === 2 && r[1].path === "src/big.mjs"; })());
  const plain = join(tmp, "plain-video"); write(join(plain, "STORYBOARD.md"), "---\ntitle: x\n---\n\n## Frame 1 — a\n\n- voiceover: \"hi\"\n");
  const pc = run("check-sources.mjs", plain);
  ok("check-sources: a video that is no explainer and names no source has nothing to check", pc.code === 0 && /^· check-sources: nothing to check/.test(pc.out), pc.out);

  // ---- length: an explainer's budget, longer when a source needs a guide part ----
  writeFileSync(join(vd, "STORYBOARD.md"), `---\nkind: explainer\n---\n\n## Frame 1 — a\n\n- duration: 270s\n`);
  const L = videoLength(vd);
  ok("length: an explainer with a long source aims at 2–5 minutes", L.kind === "explainer-long" && L.verdict === "ok" && /an explainer with a long source: aim 2–5 min/.test(lengthLine(L)), lengthLine(L));

  // ---- fresh eyes: the fact check where the video sums up more than it quotes ----
  ok("fresh eyes: an explainer with a source that needs a guide part gets the checker too", Object.keys(rolesFor(vd)).join() === "newcomer,designer,checker");
  const ed2 = join(rp, "explainers", "2026-09-29-experiment-2");
  write(join(ed2, "video", "STORYBOARD.md"), "---\nkind: explainer\n---\n");
  ok("fresh eyes: one whose sources are all short gets the newcomer and the designer only", Object.keys(rolesFor(join(ed2, "video"))).join() === "newcomer,designer");
  ok("fresh eyes: a fact check's finding reads as F1", parseFindings("- F1 · scene 3 · \"passed first time\": the transcript shows two runs\n  - Answer: fixed: scene 3 says the second run\n")[0]?.id === "F1");
  write(join(vd, "fresh-eyes", "stamp.json"), JSON.stringify({ id: "abc123abc123", round: 1, build: "first", scenes: [] }));
  for (const r of ["newcomer", "designer"]) write(join(vd, "fresh-eyes", `${r}.md`), `# Fresh eyes: ${r} · round 1 · stamp abc123abc123\n\n- none\n`);
  const st = freshEyesState(vd);
  ok("fresh eyes: with the checker's file missing, the round is waiting on it", st.state === "waiting" && st.lines.some((l) => /no checker\.md yet/.test(l.text)), JSON.stringify(st.lines));

  // ---- names on the review page ----
  ok("review page: an explainer's video is <name>--explainer, both ways", slugOf(join(ed, "video")) === "2026-09-29-experiment--explainer" && videoDirFor(rp, "2026-09-29-experiment--explainer") === join(ed, "video"));

  // ---- Finish's next: what Explain more and Plan this would mean for this video, made at build time ----
  const em = readFileSync(join(ed, "explain.md"), "utf8").replace(/## What it leaves out\n[\s\S]*?(?=## Open threads)/, "## What it leaves out\n\n- the third run, which crashed (scene 2)\n\n")
    .replace(/## Open threads\n[\s\S]*?(?=## Sources)/, "## Open threads\n\n<!-- kept out -->\n- compare the loss across runs in one table (scene 2)\n- Nobody knows why run b was faster\n\n");
  writeFileSync(join(ed, "explain.md"), em);
  board("", [{ title: "What you asked", source: "src/app.mjs:1-4", extra: "- chapter_start: What you asked\n" }, { title: "The loss", source: csv, extra: "- next_more: how the loss is computed, line by line\n" }, { title: "The big file", source: "src/big.mjs", extra: "- next_plan: split big.mjs by what each part does\n" }]);
  script(["claim takes four things.", "The loss fell.", "A big file."]);
  const pmRun = run("plan-map.mjs", vd), pm = existsSync(join(vd, "plan-map.json")) ? json(join(vd, "plan-map.json")) : {};
  const nm = pm.explainer?.next?.more?.map((x) => x.text) || [], np0 = pm.explainer?.next?.plan?.map((x) => x.text) || [];
  ok("next: the plan map carries Explain more's suggestions for this video: a scene's own, the long source it quotes, what it left out", pmRun.code === 0 && nm[0] === "How the loss is computed, line by line" && nm.includes("Go deeper on `src/big.mjs`, past the lines scene 3 quotes") && nm.includes("Explain what it left out: the third run, which crashed"), `${pmRun.out}\n${JSON.stringify(pm.explainer?.next)}`);
  ok("next: and Plan this's: a scene's own, and each open thread, read as what a plan would do", JSON.stringify(np0) === JSON.stringify(["A plan to split big.mjs by what each part does", "A plan to compare the loss across runs in one table", "A plan for what is open: nobody knows why run b was faster"]), JSON.stringify(np0));
  ok("next: each says where it comes from, and the scene it is on", pm.explainer.next.plan[1].scene === 2 && /explain\.md, open threads · scene 2, "The loss"/.test(pm.explainer.next.plan[1].why) && pm.explainer.next.more.find((x) => /big\.mjs/.test(x.text))?.scene === 3, JSON.stringify(pm.explainer.next));
  ok("next: the scene tags stay out of the frames", !(pm.frames || []).some((f) => "nextMore" in f || "nextPlan" in f));
  ok("next: with nothing of its own to go deeper on, each chapter", nextSuggestions({ frames: [{ index: 1, title: "a", chapterStart: "The inbox" }] }).more[0]?.text === 'Go deeper on "The inbox"');
  ok("next: a thing to do reads as a plan to do it", asPlan("make the sweeper run on a timer") === "A plan to make the sweeper run on a timer" && asPlan("A plan for the cache") === "A plan for the cache");

  // ---- reel record: filed by scene, nothing in the ledger, your memory updated ----
  const n0 = json(join(rp, "decisions.json")).decisions.length;
  const review = { version: 1, project: "video", src: "2026-09-29-experiment--explainer/index.html", exportedAt: "2026-09-29T10:00:00.000Z", verdict: "plan", watch: { completion: 1 }, decisions: [], quizzes: [], autonomy: [],
    questions: [{ question: "why did the loss fall?", frame: { index: 2 }, t: 40, answer: "the second run used more data", from: "results.csv" }],
    annotations: [{ id: "a1", kind: "note", comment: "this looks wrong", t: 20, frame: { index: 1, title: "What you asked", compositionId: "01" } }, { id: "a2", kind: "note", open: true, comment: "make the loss easy to compare", t: 90 }],
    // picked at Finish from this video's suggestions, then put in their own words
    next: { end: "plan", pick: { id: "p2", text: "A plan to compare the loss across runs in one table", why: "explain.md, open threads · scene 2, \"The loss\"", scene: 2 }, words: "make the loss easy to compare", edited: true, offered: 3 } };
  writeFileSync(join(tmp, "ex-review.json"), JSON.stringify(review));
  const rec = reel("record", ed, join(tmp, "ex-review.json"));
  const filed = existsSync(join(ed, "reviews")) ? readdirSync(join(ed, "reviews")) : [];
  const md = filed.find((f) => f.endsWith(".md")) ? readFileSync(join(ed, "reviews", filed.find((f) => f.endsWith(".md"))), "utf8") : "";
  ok("record: an explainer's review is filed as explainer-<time>, with its .md", rec.code === 0 && filed.some((f) => /^explainer-.*\.json$/.test(f)) && filed.some((f) => /^explainer-.*\.md$/.test(f)), `${rec.out}\n${filed}`);
  const filedJson = json(join(ed, "reviews", filed.find((f) => f.endsWith(".json"))));
  ok("record: the filed review says its kind and its end", filedJson.kind === "explainer" && filedJson.end === "plan", JSON.stringify({ kind: filedJson.kind, end: filedJson.end }));
  ok("record: the .md has your comments by scene, your questions and what you want next", /## Comments by scene[\s\S]*\*\*Scene 1\*\* \(What you asked\), at 0:20: "this looks wrong"/.test(md) && /## Questions you asked[\s\S]*scene 2, at 0:40: "why did the loss fall\?"[\s\S]*answered from results\.csv/.test(md) && /## What you want next\n\n(?:- \*\*Picked\*\*.*\n\n)?> make the loss easy to compare/.test(md) && /Plan this/.test(md), md);
  ok("record: the .md says what was picked at Finish, where it came from, and that it was edited", /## What you want next\n\n- \*\*Picked\*\* from what Finish suggested for Plan this: "A plan to compare the loss across runs in one table" \(explain\.md, open threads · scene 2, "The loss"\); then edited, your words below/.test(md) && filedJson.next?.pick?.id === "p2", md);
  ok("record: it says what you want next, and from where", /what you want next, picked from Finish's suggestions and edited: "make the loss easy to compare" \(scene 2\)/.test(rec.out) && /the draft is titled by what you picked/.test(rec.out), rec.out);
  ok("record: \"this looks wrong\" and Plan this put nothing in the decision log", json(join(rp, "decisions.json")).decisions.length === n0 && /ledger: nothing added \(an explainer asks no questions/.test(rec.out), rec.out);
  const you = existsSync(join(home, ".reelplanner", "you.jsonl")) ? readFileSync(join(home, ".reelplanner", "you.jsonl"), "utf8") : "";
  ok("record: your memory gets what you watched", /"kind":"explainer"/.test(you) && /2026-09-29-experiment--explainer/.test(you), you.slice(0, 500));
  // reel-intake: a row the page sent, naming the explainer's folder
  const row = { status: "submitted", submittedAt: "2026-09-29T11:00:00.000Z", project: "video", planDir: ".reelplanner/explainers/2026-09-29-experiment-2", kind: "explainer", title: "x", note: "", review: { ...review, verdict: "done", exportedAt: "2026-09-29T11:00:00.000Z" } };
  writeFileSync(join(tmp, "row.json"), JSON.stringify(row));
  const intake = run("reel-intake.mjs", join(tmp, "row.json"), "--repo", repo);
  const moreReview = { ...review, verdict: "more", exportedAt: "2026-09-29T12:00:00.000Z", questions: [], annotations: [review.annotations[0]],
    next: { end: "more", pick: { id: "m1", text: "How the loss is computed, line by line", why: "scene 2, \"The loss\"", scene: 2 }, words: "How the loss is computed, line by line", edited: false } };
  writeFileSync(join(tmp, "ex-more.json"), JSON.stringify(moreReview));
  const recMore = reel("record", ed2, join(tmp, "ex-more.json"));
  const moreMd = readdirSync(join(ed2, "reviews")).filter((f) => f.endsWith(".md")).map((f) => readFileSync(join(ed2, "reviews", f), "utf8")).find((t) => /Explain more/.test(t)) || "";
  ok("record: Explain more starts from the pick: its scene rebuilt, with the scenes the comments are on", /\*\*For the next version:\*\* rebuild scenes 1, 2, keeping frame ids/.test(moreMd) && /- \*\*Picked\*\* from what Finish suggested for Explain more: "How the loss is computed, line by line"/.test(moreMd) && !/> How the loss/.test(moreMd) && /start from what you picked, rebuilding scene 2/.test(recMore.out), `${recMore.out}\n${moreMd}`);
  ok("reel-intake: a review sent from an explainer's page is filed in its folder, Done", intake.code === 0 && readdirSync(join(ed2, "reviews")).some((f) => /^explainer-.*\.json$/.test(f)) && /Done/.test(intake.out), intake.out);

  // ---- Plan this: new-plan --from, and the plan video leans on the explainer (D-248) ----
  const np = reel("new-plan", repo, "loss", "--from", ed, "--date", "2026-09-30");
  const planMd = readFileSync(join(rp, "plans", "2026-09-30-loss", "plan.md"), "utf8");
  ok("new-plan --from: plan.md opens with the explainer, and its problem quotes your review", np.code === 0 && /^Explained first: `2026-09-29-experiment` \(its review: `reviews\/explainer-/m.test(planMd) && /## The problem\n\nWhat you said on the explainer[\s\S]*\*\*Scene 1\*\* \(What you asked\): "this looks wrong"[\s\S]*\*\*You asked\*\* on scene 2: "why did the loss fall\?"[\s\S]*\*\*What you want next:\*\* "make the loss easy to compare"/.test(planMd), `${np.out}\n${planMd}`);
  ok("new-plan --from: the draft is titled by what you picked at Finish, and quotes the pick and your words", /^# Make the loss easy to compare\n\nExplained first/.test(planMd) && /- \*\*Picked at Finish:\*\* "A plan to compare the loss across runs in one table" \(suggested from explain\.md, open threads · scene 2, "The loss"\), then put in your words:\n- \*\*What you want next:\*\* "make the loss easy to compare"/.test(planMd) && /### Step 1 — <from what you said: make the loss easy to compare>/.test(planMd), planMd);
  writeFileSync(join(tmp, "p.md"), "# Loss, compared\n\n## The problem\n\nIt is hard to compare.\n\n### Step 1 — Compare\n\nA table.\n");
  const np2 = reel("new-plan", repo, "loss-2", "--from", ed, "--plan", join(tmp, "p.md"), "--date", "2026-09-30");
  const planMd2 = readFileSync(join(rp, "plans", "2026-09-30-loss-2", "plan.md"), "utf8");
  ok("new-plan --from --plan: the line after the title, the quotes at the top of the problem, the rest kept", np2.code === 0 && /^# Loss, compared\n\nExplained first: `2026-09-29-experiment`/.test(planMd2) && /## The problem\n\nWhat you said on the explainer[\s\S]*It is hard to compare\./.test(planMd2) && /### Step 1 — Compare/.test(planMd2), planMd2);
  const pq = reel("prereqs", join(rp, "plans", "2026-09-30-loss"), "--dry-run");
  const lines = pq.out.split("\n").filter((l) => /^\s+before:/.test(l));
  ok("prereqs: the explainer first under Before you watch, then the system video", /before: 2026-09-29-experiment--explainer \| the explainer this plan starts from/.test(lines[0] || "") && /before: system/.test(lines[1] || ""), pq.out);
  ok("prereqs: a recap line says it for new viewers", /recap: 2026-09-29-experiment--explainer \| What did the experiment show: the explainer you watched first/.test(pq.out), pq.out);

  // ---- the review page's library: the Explainer row ----
  write(join(vd, "index.html"), "<!doctype html><html><body></body></html>");
  mkdirSync(join(vd, "compositions"), { recursive: true });
  writeFileSync(join(vd, "plan-map.json"), JSON.stringify({ project: "video", title: "What did the experiment show", kind: "explainer", planDir: ".reelplanner/explainers/2026-09-29-experiment", explainer: { question: S.question, commit: S.commit, next: { more: [], plan: [] } }, totalSeconds: 150, watchedSeconds: 150, frames: [], decisions: [], quizzes: [], autonomy: [], chapters: [] }));
  write(join(repo, "later.txt"), "later\n"); commit("a later commit");   // two since: this, and the change to claim
  const out = join(tmp, "bundle"), b = run("bundle-player.mjs", out, vd, "--reelplanner", rp);
  const lib = existsSync(join(out, "library.json")) ? json(join(out, "library.json")) : {};
  const xr = (lib.explainers || [])[0] || {};
  ok("review page: an Explainer row of its own, with the commit it explains and the commits since", b.code === 0 && xr.slug === "2026-09-29-experiment--explainer" && xr.at === S.commit.slice(0, 7) && xr.since === 2 && !(lib.other || []).some((o) => o.slug === xr.slug), `${b.out}\n${JSON.stringify(lib).slice(0, 800)}`);
  ok("review page: what came of it, the plans it started", xr.end === "Plan this" && JSON.stringify(xr.planned) === JSON.stringify(["2026-09-30-loss", "2026-09-30-loss-2"]), JSON.stringify(xr));
  const page = existsSync(join(out, "index.html")) ? readFileSync(join(out, "index.html"), "utf8") : "";
  const lp = lib.plans.find((x) => x.plan === "2026-09-30-loss");
  ok("review page: a plan that starts from an explainer links back to it", lp?.explainedFirst?.name === "2026-09-29-experiment" && lp.explainedFirst.slug === "2026-09-29-experiment--explainer" && readFileSync(join(out, "index.html"), "utf8").includes("Explained first: ${esc(p.explainedFirst.name)}, the explainer this plan starts from"), JSON.stringify(lp));
  const packed = existsSync(join(out, xr.slug || "-", "plan-map.json")) ? json(join(out, xr.slug, "plan-map.json")) : {};
  ok("review page: the packed map says the commits since, for Finish to offer them with no server", packed.explainer?.since === 2 && packed.explainer.sinceSubjects?.[0] === "a later commit" && json(join(vd, "plan-map.json")).explainer.since === undefined, JSON.stringify(packed.explainer));
  ok("review page: the row says the explainer's length", readFileSync(join(out, "index.html"), "utf8").includes("const r = Math.round(e.seconds || 0)") && xr.seconds === 150);
  ok("review page: the library draws the row, and says what to do on an explainer", /const xrow = /.test(page) && /<h2>Explainers<\/h2>/.test(page) && /m\.kind === "explainer" \? "Nothing to decide/.test(page));
} finally {
  if (!failed) rmSync(tmp, { recursive: true, force: true });
  else console.log(`(kept: ${tmp})`);
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ all passed");
process.exit(failed ? 1 : 0);
