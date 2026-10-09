#!/usr/bin/env node
// The guide after a revision (lib/guide/revised.mjs), against a scratch repo with three versions of a plan and a plan
// review between the second and the third:
//   the baseline      — plan.md as it was when the last plan review was watched (git, at the review's first play), not
//                       the version before it nor HEAD's; with no review, the previous version in git; the page says which
//   the parts         — a step's words, each case, its cases' header, interface, example, other blocks, a question, the
//                       decisions in force, every other section: changed when their words changed (spacing and case
//                       aside, as plan-diff), matched by name first, so a step put in before another marks only itself
//   the page          — a quiet "Changed since your review" on each changed part (and a dot on a fold holding one),
//                       none on the rest; "What changed": the words taken out and put in, and the review's own words
//                       that asked for it; the top's list of changes and "Show only the changes", off until pressed,
//                       folding the sections with no change; a part page (the player's panel) marks the same
//   guide --check     — passes; fails a changed part left unmarked, and a mark on a part whose words are the same
//   the eye           — screenshots light and dark, desktop and phone: no mark on the words beside it, nothing sideways
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, renameSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { ROOT, launchOpts, chromiumEnv } from "../lib/env.mjs";
import { wordDiff, compareParts, dayOf } from "../lib/guide/revised.mjs";
import { guideTarget, buildModel } from "../lib/guide/model.mjs";
import { checkGuide } from "../lib/guide/check.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-guide-revised-"));
const home = join(tmp, "home"); mkdirSync(home, { recursive: true });
const repo = join(tmp, "repo"), rp = join(repo, ".reelplanning");
const env = { ...process.env, HOME: home, REELPLANNING_HOME: join(home, ".reelplanning"), ...chromiumEnv() };   // (Playwright looks for its browser under HOME)
const git = (a, extra = {}) => execFileSync("git", a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...env, ...extra } });
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: repo, env, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const write = (p, text) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, text); };
const commit = (msg, at) => { git(["add", "-A"]); git(["commit", "-q", "-m", msg], { GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at }); return git(["rev-parse", "--short=7", "HEAD"]).trim(); };
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const dataOf = (html) => JSON.parse(html.match(/<script type="application\/json" id="guide-data">([\s\S]*?)<\/script>/)[1]);
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };

const PLAN = ({ prose1 = "The command's `--out` becomes `--to`; `--out` still works, with a warning.", case2 = "| The old flag | `build --out a.html` | writes a.html, and warns |", more = "", answered = "", extra = "", spacing = false } = {}) => `# Rename the flag: --out becomes --to

## The problem

The flag says where, not what.

## Steps

### Step 1 — Rename the flag

*Independent.*

${prose1}

#### Cases

| Case | Example | What happens |
|---|---|---|
| The new flag | \`build --to a.html\` | writes a.html |
${case2}
${more}
#### Interface

\`\`\`
reelplanning build <dir>        # build the page
  --to <file>                   # where the page goes
\`\`\`

#### Example

You run \`build --out a.html\`: it warns once, and writes a.html.

### Step 2 — Say it in the help

*Needs step 1.*

The help text names \`--to\`.${spacing ? "  " : ""}

#### Cases

| Case | Example | What happens |
|---|---|---|
| The help | \`build --help\` | shows --to |

No interface: wording only.
${extra}
## Open questions for the reviewer

1. **Keep --out working?** (step 1)
Say a script of yours runs \`build --out a.html\`.
- **A · Keep it, with a warning.** Your script still runs, and prints one warning line.
- **B · Drop it.** It stops.
I recommend A: nothing breaks.
${answered}
## Decisions in force

- **D-002** Plain words.
`;

try {
  // ── the words that changed, and the parts matched by name ──
  const wd = wordDiff("one two three four", "one two five four");
  ok("words: a word taken out and one put in, the rest kept", JSON.stringify(wd) === JSON.stringify([["=", "one two "], ["-", "three "], ["+", "five "], ["=", "four"]]), JSON.stringify(wd));
  const long = Array.from({ length: 80 }, (_, i) => `w${i}`).join(" ");
  const wl = wordDiff(long, long.replace("w40", "changed"));
  ok("words: a long run that did not change is cut to its ends (…)", wl.filter((x) => x[0] === "…").length === 2 && wl.some((x) => x[0] === "+" && x[1].trim() === "changed"), JSON.stringify(wl));
  const ins = compareParts(PLAN(), PLAN().replace("### Step 1 — Rename the flag", "### Step 1 — Warn first\n\nA warning before the rename.\n\n#### Cases\n\n| Case | Example | What happens |\n|---|---|---|\n| Any | `build` | warns |\n\n### Step 2 — Rename the flag").replace("### Step 2 — Say it in the help", "### Step 3 — Say it in the help"));
  ok("parts: a step put in before another marks only itself (the next ones are matched by their titles, renumbered)", ins.parts.filter((p) => p.status !== "same").map((p) => p.key).join(" ") === "step-1 step-1-cases step-1-case-1", JSON.stringify(ins.parts.filter((p) => p.status !== "same").map((p) => [p.key, p.status])));
  ok("parts: spacing is no change (plan-diff's rule)", compareParts(PLAN(), PLAN({ spacing: true })).parts.every((p) => p.status === "same"));

  // ── a scratch repo: three versions, a review between the second and the third ──
  mkdirSync(repo, { recursive: true });
  git(["init", "-q", "-b", "main"]); git(["config", "user.email", "sam@example.com"]); git(["config", "user.name", "Sam"]); git(["config", "commit.gpgsign", "false"]);
  run("reel.mjs", "init", repo, "--name", "demo", "--kind", "greenfield");
  const pd = join(rp, "plans", "2026-10-01-flag"), vd = join(pd, "video");
  write(join(pd, "plan.md"), PLAN({ prose1: "The flag is renamed." }));
  commit("plan, a first draft", "2026-10-01T09:00:00Z");
  const frames = [
    { index: 1, title: "The flag", compositionId: "01-flag", durationSeconds: 10, start: 0, planStep: null, narration: "A flag." },
    { index: 2, title: "Step 1: the new flag", compositionId: "02-step-1", durationSeconds: 12, start: 10, planStep: 1, narration: "Step one renames it." },
    { index: 3, title: "Step 2: the help", compositionId: "03-step-2", durationSeconds: 8, start: 22, planStep: 2, narration: "Step two says so." },
  ];
  const map = { project: "video", title: "Rename the flag", planDir: ".reelplanning/plans/2026-10-01-flag", totalSeconds: 30, frames, details: [],
    decisions: [{ id: "q1", question: "Keep --out working?", planStep: 1, frameIndex: 2, options: [{ id: "a", label: "Keep it, with a warning", recommended: true }, { id: "b", label: "Drop it" }] }],
    quizzes: [{ id: "k1", question: "What does build --out do now?", planStep: 1, frameIndex: 2, options: [{ id: "a", label: "Warns, and writes" }, { id: "b", label: "Fails" }], answer: "a" }] };
  write(join(vd, "STORYBOARD.md"), `---\nplan_dir: .reelplanning/plans/2026-10-01-flag\n---\n\n## Frame 1 — The flag\n\n## Frame 2 — Step 1: the new flag\n\n- plan_step: 1\n\n## Frame 3 — Step 2: the help\n\n- plan_step: 2\n`);
  write(join(vd, "plan-map.json"), JSON.stringify(map, null, 2));
  write(join(pd, "plan.md"), PLAN());
  const v1 = commit("plan, with its video", "2026-10-02T09:00:00Z");
  // the review: watched on 4 Oct, a note on case 2 from the guide, an answer with a note, a quick check missed
  const review = { version: 1, src: "2026-10-01-flag/index.html", project: "video", exportedAt: "2026-10-04T10:30:00.000Z", verdict: "changes",
    watch: { firstPlayAt: "2026-10-04T10:00:00.000Z", maxTimeReached: 30, durationSeconds: 30, completion: 1, chapters: [], moments: [], details: [] },
    annotations: [{ id: "n1", kind: "note", via: "guide", t: 12, comment: "Warn only once a run, not once a file", plan: { step: 1 }, frame: { index: 2, title: "Step 1: the new flag" }, detail: { name: "step-1", anchor: "step 1 · case 2" } }],
    decisions: [{ id: "q1", option: "a", label: "Keep it, with a warning", note: "for a release, then drop it", planStep: 1, question: "Keep --out working?", t: 14 }],
    quizzes: [{ id: "k1", answer: "b", correct: false, t: 18 }] };
  write(join(pd, "reviews", "plan-20261004T103000Z.json"), JSON.stringify(review, null, 2));
  const v1md = PLAN();
  // the revision: step 1's words and case 2, a case put in, the question answered, a new section; step 2 the same
  write(join(pd, "plan.md"), PLAN({ prose1: "The command's `--out` becomes `--to`; `--out` still works for one release, with one warning a run.", case2: "| The old flag | `build --out a.html` | writes a.html, and warns once a run |",
    more: "| Many files | `build --out a b` | warns once |\n", answered: "**Answered:** A, for one release (the review of 4 Oct).\n", extra: "\n## Not in this plan\n\nDropping `--out`: the next release.\n" }));
  const v2 = commit("plan, revised after the review", "2026-10-04T12:00:00Z");
  map.changes = { against: "HEAD", baseline: true, build: "x", changedFrames: [2], changedSeconds: 12 }; map.frames[1].change = { status: "edited", said: true };
  write(join(vd, "plan-map.json"), JSON.stringify(map, null, 2));

  // ── the guide ──
  const g = run("guide.mjs", vd, "--check", "--no-thumbs");
  ok("guide --check passes on the revised plan, and says what changed", g.code === 0 && /parts of plan\.md changed since your review of 4 Oct \(against [0-9a-f]{7}\), each marked/.test(g.out), g.out);
  const gd = join(vd, "guide"), html = readFileSync(join(gd, "index.html"), "utf8"), data = dataOf(html), R = data.revised;
  ok("baseline: plan.md as the review watched it (the commit before its first play), not the draft before it, nor HEAD", R?.against.kind === "review" && R.against.commit === v1 && R.against.commit !== v2 && R.against.review === "plan-20261004T103000Z" && R.words === "since your review of 4 Oct", JSON.stringify(R?.against));
  const want = ["step-1", "step-1-case-2", "step-1-case-3", "question-1", "plan-not-in-this-plan"];
  ok("parts: the changed ones, and none of step 2, its interface or example, the decisions in force", JSON.stringify(R.order) === JSON.stringify(want), JSON.stringify(R.order));
  ok("parts: a case put in is new; an edited one has its words taken out and put in", R.units["step-1-case-3"].status === "added" && R.units["step-1-case-2"].diff.some(([op, t]) => op === "+" && /once a run/.test(t)) && R.units["step-1-case-2"].diff.some(([op]) => op === "="), JSON.stringify(R.units["step-1-case-2"]));
  const said = (k) => R.units[k].asked.map((a) => `${a.kind}:${a.words || a.chose || ""}`).join(" | ");
  ok("what the review said, with the part it was on: the note on case 2, the answer and its note on the question, the missed check on the step", /comment:Warn only once a run, not once a file/.test(said("step-1-case-2")) && /answer:Keep it, with a warning/.test(said("question-1")) && R.units["question-1"].asked[0].note === "for a release, then drop it" && /^check:/.test(said("step-1")), JSON.stringify(Object.fromEntries(want.map((k) => [k, R.units[k].asked]))));
  ok("the video's own changed scene of the step, to watch from its What changed (plan-diff's changedFrames)", JSON.stringify(R.units["step-1"].scenes?.map((f) => f.n)) === "[2]", JSON.stringify(R.units["step-1"]));
  ok("the page says how it was made: compared with the version at that commit", data.made.some((m) => m.includes(`\`${v1}\``) && /review of 4 Oct/.test(m)));
  const part = readFileSync(join(gd, "step-1.html"), "utf8");
  ok("a part page (the player's panel over the frame) carries the same changes", dataOf(part).revised?.order.length === want.length);

  // ── --check holds the page to it ──
  const model = await buildModel(guideTarget(vd), { thumbs: false });
  const bad1 = join(gd, "bad1.html");
  { // a changed part left unmarked: its mark taken out of the drawing; a mark on an unchanged one: step 2's added
    const js = html.replace("chgLeft(); chgInside();", "chgLeft(); document.querySelectorAll('[data-chg=\"step-1-case-2\"]').forEach((e) => e.remove()); chgInside();");
    writeFileSync(bad1, js);
    const r1 = await checkGuide({ model, outDir: gd, full: bad1 });
    ok("--check fails a changed part left unmarked", r1.fails.some((f) => /step 1, case 2 changed since your review of 4 Oct, and the page does not mark it/.test(f)), r1.fails.join("\n"));
    const bad2 = join(gd, "bad2.html"); writeFileSync(bad2, html.replace('${CHG[s.id] ? ` ${chgMark(s.id)}` : ""}</p>', '${CHG[s.id] ? ` ${chgMark(s.id)}` : s.n === 2 ? `<span class="chg" data-chg="step-2">x</span>` : ""}</p>'));
    const r2 = await checkGuide({ model, outDir: gd, full: bad2 });
    ok("--check fails a mark on a part whose words are the same", r2.fails.some((f) => /marks step 2's words as changed since your review of 4 Oct, and its words are the same as then/.test(f)), r2.fails.join("\n"));
    rmSync(bad1, { force: true }); rmSync(bad2, { force: true });
  }

  // ── the page, by eye and by hand ──
  const { chromium } = await import("playwright-core");
  const b = await chromium.launch(launchOpts());
  const shots = join(tmp, "shots"); mkdirSync(shots, { recursive: true });
  try {
    for (const [w, hgt, theme] of [[1280, 900, "light"], [1280, 900, "dark"], [375, 812, "light"], [375, 812, "dark"]]) {
      const page = await b.newPage({ viewport: { width: w, height: hgt }, colorScheme: theme });
      const errs = []; page.on("pageerror", (e) => errs.push(String(e.message)));
      await page.goto(pathToFileURL(join(gd, "index.html")).href); await page.waitForTimeout(200);
      if (w === 1280 && theme === "light") {
        const s0 = await page.evaluate(() => ({ marks: [...document.querySelectorAll("main [data-chg]")].map((e) => e.dataset.chg), pressed: document.querySelector("[data-only]")?.getAttribute("aria-pressed"), folded: document.querySelectorAll(".unchg").length, top: document.querySelector("#revised")?.innerText || "", inshort: document.querySelector(".inshort")?.innerText || "", dots: document.querySelectorAll(".chg-in").length }));
        ok("the page: each changed part marked once or more, nothing else; the top says since when, and lists them; In short too", JSON.stringify([...new Set(s0.marks)].sort()) === JSON.stringify([...want].sort()) && /Revised since your review of 4 Oct: five parts of the plan changed/.test(s0.top) && /Changed\s+Since your review of 4 Oct: step 1's words, step 1, case 2/.test(s0.inshort), JSON.stringify(s0));
        ok("the page: a closed fold holding a change says so on its summary (the cases, the answered questions, the plan's sections)", s0.dots >= 3, JSON.stringify(s0));
        ok("Show only the changes: off until pressed", s0.pressed === "false" && s0.folded === 0, JSON.stringify(s0));
        // What changed, opened: the words taken out and put in, the review's words quoted
        await page.evaluate(() => window.RPGuide.openAt("step-1-case-2-chg")); await page.waitForTimeout(100);
        const wc = await page.evaluate(() => { const d = document.getElementById("step-1-case-2-chg"); return { open: d?.open, del: [...d.querySelectorAll(".wd del")].map((x) => x.textContent), ins: [...d.querySelectorAll(".wd ins")].map((x) => x.textContent), said: [...d.querySelectorAll("blockquote.said")].map((x) => x.textContent) }; });
        ok("What changed: the words put in underlined, and what the review said, in its own words", wc.open && wc.ins.join("").includes("once a run") && wc.said.includes("“Warn only once a run, not once a file”"), JSON.stringify(wc));
        await page.screenshot({ path: join(shots, "what-changed.png"), fullPage: false });
        await page.click("[data-only]"); await page.waitForTimeout(150);
        const s1 = await page.evaluate(() => { const vis = (el) => !!el && el.getBoundingClientRect().height > 0; const st2 = document.getElementById("step-2");
          return { pressed: document.querySelector("[data-only]").getAttribute("aria-pressed"), step2: st2.classList.contains("unchg"), step2body: vis(st2.querySelector(".say, details")), step2head: vis(st2.querySelector("h3")), step1: document.getElementById("step-1").classList.contains("unchg"), case2: document.getElementById("step-1-case-2").open, tryUnchg: document.getElementById("try")?.classList.contains("unchg") }; });
        ok("Show only the changes: the sections with no change fold to their headings, the changed ones stay, their folds open", s1.pressed === "true" && s1.step2 && !s1.step2body && s1.step2head && !s1.step1 && s1.case2 && s1.tryUnchg, JSON.stringify(s1));
        await page.screenshot({ path: join(shots, "only-changes.png"), fullPage: true });
        await page.click("[data-only]"); await page.waitForTimeout(100);
        ok("Show everything: back as it was", await page.evaluate(() => !document.querySelector(".unchg") && document.querySelector("[data-only]").getAttribute("aria-pressed") === "false"));
      }
      // nothing on the words beside it, nothing sideways
      await page.evaluate(() => window.RPGuide.expandAll(true, { everything: true })); await page.waitForTimeout(150);
      const lay = await page.evaluate(() => {
        const hit = [], hits = (a, c) => a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1;
        for (const m of document.querySelectorAll(".chg, .chg-in")) { const r = m.getBoundingClientRect(), p = m.parentElement;
          for (const n of p.childNodes) { if (n === m || (n.nodeType === 1 && (n.contains(m) || n.classList.contains("vh")))) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width && hits(r, q)) hit.push(`${m.dataset.chg || "dot"} on "${(n.textContent || "").slice(0, 30)}"`); } }
        return { hit, sw: document.documentElement.scrollWidth };
      });
      ok(`the eye (${w} px, ${theme}): no mark on the words beside it, nothing sideways, no error`, !lay.hit.length && lay.sw <= w + 1 && !errs.length, JSON.stringify({ ...lay, errs }));
      const at = (id) => page.evaluate((id) => { const el = document.getElementById(id); el.scrollIntoView({ block: "start", behavior: "instant" }); scrollBy(0, -64); }, id);
      await at("revised"); await page.waitForTimeout(100);
      await page.screenshot({ path: join(shots, `top-${w}-${theme}.png`) });
      await at("step-1"); await page.waitForTimeout(100);
      await page.screenshot({ path: join(shots, `step-${w}-${theme}.png`) });
      await page.close();
    }
  } finally { await b.close(); }
  if (process.env.RP_KEEP_SHOTS) { mkdirSync(process.env.RP_KEEP_SHOTS, { recursive: true }); execFileSync("cp", ["-r", `${shots}/.`, process.env.RP_KEEP_SHOTS]); }

  // ── with no review: the previous version in git, said so ──
  renameSync(join(pd, "reviews"), join(tmp, "reviews-aside"));
  write(join(pd, "plan.md"), readFileSync(join(pd, "plan.md"), "utf8").replace("Dropping `--out`: the next release.", "Dropping `--out`: a later release."));
  const g2 = run("guide.mjs", vd, "--check", "--no-thumbs"), R2 = dataOf(readFileSync(join(gd, "index.html"), "utf8")).revised;
  ok("no review: compared with the previous version in git (HEAD's, plan.md having changed since), said as such", g2.code === 0 && R2?.against.kind === "git" && R2.against.commit === v2 && R2.mark === "Changed since the last version" && JSON.stringify(R2.order) === '["plan-not-in-this-plan"]' && R2.words === `since the version of ${dayOf("2026-10-04T12:00:00Z")}`, `${g2.out}\n${JSON.stringify(R2)}`);
  // and a review that saw this very version: nothing changed, nothing marked
  renameSync(join(tmp, "reviews-aside"), join(pd, "reviews")); write(join(pd, "plan.md"), v1md);
  const g3 = run("guide.mjs", vd, "--check", "--no-thumbs"), d3 = dataOf(readFileSync(join(gd, "index.html"), "utf8"));
  ok("plan.md as the review saw it: nothing marked, no toggle, --check says so", g3.code === 0 && d3.revised?.order.length === 0 && /nothing in plan\.md changed since your review of 4 Oct/.test(g3.out), g3.out);
  ok("a review's .md and git untouched by the guide (nothing written to plan.md or reviews/)", git(["status", "--porcelain", "--", ".reelplanning/plans/2026-10-01-flag/reviews"]).trim() === "");
} catch (e) { console.log(`✗ threw: ${e.stack}`); failed++; }
finally { if (!failed) rmSync(tmp, { recursive: true, force: true }); else console.log(`(kept ${tmp})`); }
console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exit(failed ? 1 : 0);
