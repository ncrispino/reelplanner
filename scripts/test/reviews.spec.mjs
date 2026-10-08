#!/usr/bin/env node
// Less scaffolding (revise-loop step 9, D-085), against scratch repos:
//   reel check    — reads "### Step N" with —, –, - or :, like plan-map (one parser); skips this plan's own
//                   decisions in its must-cite and re-ask gates (another plan still has to cite them);
//                   (an approved plan: against the ledger as it stood at its approval, later decisions left out;
//                   one approved in conversation and built: the ledger of the commit its build started from);
//                   a part retired later (system.json "retired") may be named by a plan approved before it went,
//                   or by the plan that retired it, and is checked by its old id; a later plan is told what replaced it
//                   no format warnings about "## What changes" or "*Needs step N*"
//   reel new-plan — writes the plan and no checklist README
//   reel status   — each plan's stage, from its files, reviews/ and the ledger
//   reel record / reel-intake — every review kept once, in reviews/<kind>-<time>.json, never over another,
//                   with reviews/<id>.md (what to act on) beside it and the reviewer's note kept
//   what to act on — its first line says what the verdict means for the work; a call judged in any
//                   walkthrough review of the plan is not "never judged"; a comment rides with a call
//                   only from that call's beat; words "reach" a decision only when they name it
//   migrate-reviews — old plan folders: every version of annotations.json in git history filed, the
//                   resolved copies, scope files and README removed; running it again changes nothing
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { parseSteps } from "../lib/plan-md.mjs";
import { walkthroughScope, actOnMarkdown, reaches } from "../lib/review-scope.mjs";
import { approvedAt, ledgerAsOf, startedFrom, planStage } from "../lib/reviews.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-reviews-"));
process.env.REELPLANNING_HOME = join(tmp, "home");   // `reel record` adds a summary to your memory: keep it out of the real home
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => run("reel.mjs", ...a);
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const files = (d) => (existsSync(d) ? readdirSync(d).sort() : []);

const plan = (steps, questions = "") => `# Drafts

## The problem

Drafts are lost.

${steps}

## Components touched

- **Draft store** — where drafts live

## Open questions for the reviewer
${questions || `
1. **Where do drafts live?** (step 1)
- **A · Postgres.** One more table.
- **B · Local storage.** Nothing on the server.
I recommend A.
`}`;
const steps = (sep) => `### Step 1 ${sep} Store drafts\n\nWhere drafts live.\n\n### Step 2 ${sep} Export\n\nWhich formats ship.\n`;
const review = (at, extra = {}) => ({ version: 1, src: "2026-09-23-drafts/index.html", project: "video", exportedAt: at, verdict: "approve", watch: { completion: 1 },
  decisions: [{ id: "q1", option: "a", label: "Postgres", planStep: 1, t: 8, recommended: true }], quizzes: [], autonomy: [], annotations: [], ...extra });
const map = { project: "video", decisions: [{ id: "q1", question: "Where do drafts live?", planStep: 1, options: [{ id: "a", label: "Postgres" }, { id: "b", label: "Local storage" }] }] };

try {
  const repo = join(tmp, "repo"), rp = join(repo, ".reelplanning");
  mkdirSync(repo, { recursive: true });
  reel("init", repo, "--name", "drafts", "--kind", "greenfield");
  const sys = JSON.parse(readFileSync(join(rp, "system.json"), "utf8"));
  sys.components = [{ id: "store", name: "Draft store", kind: "store" }];
  writeFileSync(join(rp, "system.json"), JSON.stringify(sys, null, 2));

  // ---- one step parser ----
  const seps = ["—", "–", "-", ":"];
  ok("parseSteps: a step heading with —, –, - or : reads the same", seps.every((s) => parseSteps(steps(s)).map((x) => `${x.n}:${x.title}`).join() === "1:Store drafts,2:Export"), JSON.stringify(seps.map((s) => parseSteps(steps(s)))));
  seps.forEach((sep, i) => {
    writeFileSync(join(tmp, `p${i}.md`), plan(steps(sep)));
    reel("new-plan", repo, `sep${i}`, "--plan", join(tmp, `p${i}.md`), "--date", "2026-09-20");
  });
  const checks = seps.map((_, i) => reel("check", join(rp, "plans", `2026-09-20-sep${i}`)));
  ok("reel check: finds both steps whatever the dash or colon", checks.every((c) => c.code === 0 && /: 2 steps, touches \[store\]/.test(c.out)), checks.map((c) => c.out).join("\n"));
  const st = reel("stage", join(rp, "plans", "2026-09-20-sep3"));
  ok("reel stage: a colon plan gets a slot per step", st.code === 0 && /2 slots/.test(st.out), st.out);
  ok("reel check: no warning demands a \"## What changes\" section or a *Needs step N* line", checks.every((c) => !/What changes|Needs step|Independent/.test(c.out)), checks[0].out);
  ok("reel new-plan: writes the plan and no checklist README", files(join(rp, "plans", "2026-09-20-sep0")).join() === "plan.md" && !existsSync(join(ROOT, "templates/reelplanning/plan-README.md")));
  rmSync(join(rp, "plans"), { recursive: true }); mkdirSync(join(rp, "plans"));

  // ---- a plan at each stage ----
  writeFileSync(join(tmp, "plan.md"), plan(steps("—")));
  reel("new-plan", repo, "drafts", "--plan", join(tmp, "plan.md"), "--date", "2026-09-23");
  const pd = join(rp, "plans", "2026-09-23-drafts");
  const status = () => reel("status", repo).out;
  ok("reel status: a plan with no video is planned", /\| 2026-09-23-drafts \| planned: no video yet \| · \| · \|/.test(status()), status());
  mkdirSync(join(pd, "video"), { recursive: true }); writeFileSync(join(pd, "video", "index.html"), "<!-- built -->"); writeFileSync(join(pd, "video", "plan-map.json"), JSON.stringify(map));
  ok("reel status: a built plan video waits for its review", /\| plan video to review \|/.test(status()), status());

  // round 1: changes requested, with a comment and the reviewer's note (through intake, as a Finish sends it)
  const r1 = review("2026-09-23T10:00:00.000Z", { verdict: "changes", annotations: [{ id: "n1", kind: "note", t: 12, comment: "say which formats", plan: { step: 2 }, frame: { title: "Export" } }] });
  writeFileSync(join(tmp, "row1.json"), JSON.stringify({ status: "submitted", submittedAt: r1.exportedAt, project: "video", planDir: ".reelplanning/plans/2026-09-23-drafts", title: "Drafts", note: "start with step 2", review: r1 }));
  const i1 = run("reel-intake.mjs", join(tmp, "row1.json"), "--repo", repo);
  const id1 = "plan-20260923T100000Z";
  ok("reel-intake: files the review in reviews/ and writes what to act on beside it, no annotations.json", i1.code === 0 && files(join(pd, "reviews")).join() === `${id1}.json,${id1}.md` && !existsSync(join(pd, "annotations.json")) && !existsSync(join(pd, "plan.resolved.md")), i1.out);
  const kept = JSON.parse(readFileSync(join(pd, "reviews", `${id1}.json`), "utf8"));
  ok("…the review as sent, with the reviewer's note kept in it", kept.note === "start with step 2" && kept.annotations[0].comment === "say which formats" && kept.decisions[0].label === "Postgres");
  const md1 = readFileSync(join(pd, "reviews", `${id1}.md`), "utf8");
  ok("…what to act on: the decision with its ledger entry, the step to revise with the words, the note quoted",
    /^# Plan review · 2026-09-23 10:00 UTC · changes requested$/m.test(md1) && /\*\*Q1\*\* \(step 1\) Where do drafts live\?: \*\*Postgres\*\* \(the recommendation\) → D-001/.test(md1)
    && /- \*\*Step 2\*\*\n  - comment at 0:12 \(Export\): "say which formats"/.test(md1) && /^> start with step 2$/m.test(md1) && md1.split("\n").length < 25, md1);
  ok("…and intake says to revise from it", new RegExp(`next: revise the plan from \\.reelplanning/plans/2026-09-23-drafts/reviews/${id1}\\.md`).test(i1.out), i1.out);
  ok("reel status: changes requested", /\| changes requested: revise \| 1 plan \| D-001 \|/.test(status()), status());

  // the revise keeps the question under "Open questions for the reviewer" and cites nothing: its own decision is not asked for
  const c1 = reel("check", pd);
  ok("reel check: a revised plan need not rename its questions' heading nor cite its own just-recorded decision", c1.code === 0 && !/D-001/.test(c1.out), c1.out);
  writeFileSync(join(tmp, "other.md"), plan(steps("—")).replace("# Drafts", "# Drafts, again"));
  reel("new-plan", repo, "other", "--plan", join(tmp, "other.md"), "--date", "2026-09-24");
  const c2 = reel("check", join(rp, "plans", "2026-09-24-other"));
  ok("reel check: another plan touching the same part still has to cite it, and may not re-ask it", c2.code === 1 && /D-001 \(Where do drafts live\? → Postgres\) is on a component this plan touches/.test(c2.out) && /re-asks D-001/.test(c2.out), c2.out);
  rmSync(join(rp, "plans", "2026-09-24-other"), { recursive: true });

  // round 2, same moment to the second but other content: its own file; the first is untouched
  writeFileSync(join(tmp, "r2.json"), JSON.stringify(review("2026-09-23T10:00:00.900Z")));
  const rec2 = reel("record", pd, join(tmp, "r2.json"));
  ok("reel record: a second review in the same second takes the next free name; the first is not touched", rec2.code === 0 && files(join(pd, "reviews")).join() === `${id1}-2.json,${id1}-2.md,${id1}.json,${id1}.md` && readFileSync(join(pd, "reviews", `${id1}.md`), "utf8") === md1, rec2.out);
  const again = reel("record", pd, join(tmp, "r2.json"));
  ok("reel record: the same review again is the same file, and its what-to-act-on file is kept", again.code === 0 && files(join(pd, "reviews")).length === 4 && /filed before/.test(again.out) && /kept as it is/.test(again.out), again.out);
  ok("reel status: approved", /\| approved: build it \| 2 plan \|/.test(status()), status());

  // an approved plan is checked against the ledger as it stood when it was approved: a decision made
  // later (a later day, or later the same day, after its approving review's answers) is left out
  const L0 = readFileSync(join(rp, "decisions.json"), "utf8"), led = JSON.parse(L0);
  const entry = (id, date, question, chosen, more = {}) => ({ id, date, plan: "2026-09-23-elsewhere", step: 1, question, chosen, options: [], status: "active", components: ["store"], ...more });
  led.decisions.push(entry("D-090", "2026-09-23", "How are drafts compressed?", "Gzip"), entry("D-091", "2026-09-25", "Which drafts expire?", "The old ones"));
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  const ca = reel("check", pd);
  ok("reel check: an approved plan is not failed for decisions made after its approval (later that day, or later on)", ca.code === 0 && !/D-09[01]/.test(ca.out.replace(/^✓.*$/m, "")) && /approved 2026-09-23, so against the ledger as it stood then: 1 decision\(s\), 2 later one\(s\) left out/.test(ca.out), ca.out);
  writeFileSync(join(tmp, "unapproved.md"), plan(steps("—")).replace("# Drafts", "# Drafts, unapproved"));
  reel("new-plan", repo, "unapproved", "--plan", join(tmp, "unapproved.md"), "--date", "2026-09-26");
  const cu = reel("check", join(rp, "plans", "2026-09-26-unapproved"));
  ok("reel check: a plan with no approval answers to the whole ledger, as today", cu.code === 1 && /D-090 \(How are drafts compressed\?/.test(cu.out) && /D-091 \(Which drafts expire\?/.test(cu.out) && !/; approved /.test(cu.out), cu.out);
  rmSync(join(rp, "plans", "2026-09-26-unapproved"), { recursive: true });
  // a decision in force on the approval day, superseded only later, was in force for it: still asked for
  led.decisions.unshift(entry("D-089", "2026-09-20", "How are drafts named?", "By title", { status: "superseded", supersededBy: "D-091", supersededOn: "2026-09-25" }));
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  const cs = reel("check", pd);
  ok("reel check: a decision superseded after the approval counts as it stood then, active", cs.code === 1 && /D-089 \(How are drafts named\? → By title\) is on a component this plan touches/.test(cs.out) && !/D-09[01] \(/.test(cs.out), cs.out);
  // a plan listing D-089 under Supersedes: superseded by another plan's decision fails; by its own (as its
  // review records it) is what it asked for
  writeFileSync(join(tmp, "sup.md"), `${plan(steps("—")).replace("# Drafts", "# Drafts, renamed")}\n## Supersedes\n\n- **D-089** names come from the first line now\n`);
  reel("new-plan", repo, "renamed", "--plan", join(tmp, "sup.md"), "--date", "2026-09-26");
  const sup1 = reel("check", join(rp, "plans", "2026-09-26-renamed"));
  led.decisions.push(entry("D-092", "2026-09-26", "Where do names come from?", "The first line", { plan: "2026-09-26-renamed" }));
  Object.assign(led.decisions[0], { supersededBy: "D-092", supersededOn: "2026-09-26" });
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  const sup2 = reel("check", join(rp, "plans", "2026-09-26-renamed"));
  ok("reel check: a decision superseded by this plan's own is not \"already superseded\"; by another plan's it is", /D-089 is already superseded by D-091/.test(sup1.out) && !/already superseded/.test(sup2.out), sup1.out + sup2.out);
  rmSync(join(rp, "plans", "2026-09-26-renamed"), { recursive: true });
  Object.assign(led.decisions[0], { supersededBy: "D-091", supersededOn: "2026-09-25" }); led.decisions.pop();
  const asOf = ledgerAsOf(led.decisions, "2026-09-23", { plan: "2026-09-23-drafts" });
  ok("ledgerAsOf: the day's entries up to the plan's own answers, each with the status it had then", asOf.map((d) => `${d.id}:${d.status}`).join() === "D-089:active,D-001:active" && ledgerAsOf(led.decisions, null) === led.decisions && approvedAt(pd)?.startsWith("2026-09-23"), JSON.stringify(asOf.map((d) => [d.id, d.status])));
  writeFileSync(join(rp, "decisions.json"), L0);

  // a part taken out of the system later (system.json "retired"): a plan approved before it went, or the
  // plan that retired it, named it rightly and is checked with it, by its old id; any later plan is told
  // what does its work now
  {
    const S0 = readFileSync(join(rp, "system.json"), "utf8"), P0 = readFileSync(join(pd, "plan.md"), "utf8");
    writeFileSync(join(rp, "system.json"), JSON.stringify({ ...JSON.parse(S0), retired: [{ id: "queue", name: "Draft queue", on: "2026-09-24", plan: "2026-09-24-queue", decision: "D-050", now: ["store"] }] }, null, 2));
    writeFileSync(join(rp, "decisions.json"), JSON.stringify({ decisions: [...JSON.parse(L0).decisions, entry("D-050", "2026-09-20", "How are drafts queued?", "In order", { components: ["queue"] })] }, null, 2));
    const withQueue = (md) => md.replace("- **Draft store** — where drafts live", "- **Draft store** — where drafts live\n- **Draft queue** — what waits to be saved");
    writeFileSync(join(pd, "plan.md"), withQueue(P0));
    const old = reel("check", pd);
    writeFileSync(join(pd, "plan.md"), withQueue(P0).replace("## Open questions", "## Decisions in force\n\n- **D-050** in order\n\n## Open questions"));
    const oldCited = reel("check", pd);
    for (const [slug, date] of [["queue", "2026-09-24"], ["later", "2026-09-26"]]) { writeFileSync(join(tmp, `${slug}.md`), withQueue(plan(steps("—"))).replace("# Drafts", `# Drafts, ${slug}`)); reel("new-plan", repo, slug, "--plan", join(tmp, `${slug}.md`), "--date", date); }
    const own = reel("check", join(rp, "plans", "2026-09-24-queue")), later = reel("check", join(rp, "plans", "2026-09-26-later"));
    ok("reel check: a plan approved before a part was retired may name it, and answers to the decisions on its old id",
      old.code === 1 && /D-050 \(How are drafts queued\? → In order\) is on a component this plan touches \[queue\]/.test(old.out) && !/not in system\.json|was retired/.test(old.out)
      && oldCited.code === 0 && /touches \[store, queue\].*names Draft queue \(retired 2026-09-24, D-050\), as the system stood then/.test(oldCited.out), old.out + oldCited.out);
    ok("…so may the plan that retired it; a later plan fails, told what does its work now",
      !/Draft queue" (is not in|was retired)/.test(own.out) && later.code === 1 && /component "Draft queue" was retired on 2026-09-24 \(D-050\); its work is now in Draft store: name that instead/.test(later.out), own.out + later.out);
    for (const slug of ["2026-09-24-queue", "2026-09-26-later"]) rmSync(join(rp, "plans", slug), { recursive: true });
    writeFileSync(join(rp, "system.json"), S0); writeFileSync(join(pd, "plan.md"), P0); writeFileSync(join(rp, "decisions.json"), L0);
  }

  // a plan approved in conversation (no approving plan review) and built: the ledger in the commit its
  // walkthrough.md says the build started from. In a repo of its own, under git
  {
    const repo2 = join(tmp, "repo2"), rp2 = join(repo2, ".reelplanning"), g = (...a) => execFileSync("git", ["-C", repo2, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    mkdirSync(repo2, { recursive: true }); reel("init", repo2, "--name", "drafts", "--kind", "greenfield");
    writeFileSync(join(rp2, "system.json"), JSON.stringify({ ...JSON.parse(readFileSync(join(rp2, "system.json"), "utf8")), components: [{ id: "store", name: "Draft store", kind: "store" }] }, null, 2));
    const L2 = { decisions: [entry("D-001", "2026-09-20", "How are drafts compressed?", "Gzip")] };
    writeFileSync(join(rp2, "decisions.json"), JSON.stringify(L2, null, 2));
    g("init", "-q"); g("add", "-A"); g("commit", "-q", "-m", "start"); const sha = g("rev-parse", "--short", "HEAD").trim();
    writeFileSync(join(rp2, "decisions.json"), JSON.stringify({ decisions: [...L2.decisions, entry("D-002", "2026-09-21", "Which drafts expire?", "The old ones")] }, null, 2));
    g("commit", "-q", "-am", "later");
    writeFileSync(join(tmp, "conv.md"), `${plan(steps("—"), "\n1. **Where do drafts live?** (step 1)\n- **A · Postgres.** One table.\n- **B · Local storage.** None.\n")}\n## Decisions in force\n\n- **D-001** gzip\n`);
    reel("new-plan", repo2, "conv", "--plan", join(tmp, "conv.md"), "--date", "2026-09-20");
    const pc = join(rp2, "plans", "2026-09-20-conv"), wt = (s) => writeFileSync(join(pc, "walkthrough.md"), `# Built\n\n**Status:** built · **Started from:** \`${s}\` · **Plan:** plan.md\n`);
    const unbuilt = reel("check", pc);
    wt(sha); const built = reel("check", pc);
    wt("0123abc"); const unknown = reel("check", pc);
    ok("reel check: a plan approved in conversation and built answers to the ledger of the commit it started from; unbuilt, or that commit unknown, to the whole ledger",
      unbuilt.code === 1 && /D-002 \(Which drafts expire\?/.test(unbuilt.out) && built.code === 0 && new RegExp(`built from ${sha} \\(\\d{4}-\\d{2}-\\d{2}\\), approved in conversation, so against the ledger as it stood then: 1 decision\\(s\\), 1 later one\\(s\\) left out`).test(built.out)
      && unknown.code === 1 && /D-002 \(/.test(unknown.out) && !/built from/.test(unknown.out), [unbuilt.out, built.out, unknown.out].join("\n---\n"));
    ok("startedFrom: the commit walkthrough.md names", startedFrom(pc) === "0123abc" && startedFrom(pd) === null);
  }

  // built, walked through, reviewed
  writeFileSync(join(pd, "walkthrough.md"), "# Built\n\n### Step 1 — Store drafts\n\nIn `src/store.ts`.\n\n### Step 2 — Export\n\nIn `src/export.ts`.\n\n| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n| A1 | 1 | JSONB column [visible] | a table per draft | one query | src/store.ts |\n| A2 | 2 | PDF only | every format | small | src/export.ts |\n");
  ok("reel status: built", /\| built: walkthrough video next \|/.test(status()), status());
  // the reviewer said no walkthrough video for this plan (SKILL.md, Skipping the walkthrough): walkthrough.md says so
  const wtText = readFileSync(join(pd, "walkthrough.md"), "utf8");
  writeFileSync(join(pd, "walkthrough.md"), wtText.replace("# Built\n", "# Built\n\n**Walkthrough video:** skipped (the reviewer asked for none)\n"));
  ok("reel status: built with the walkthrough video skipped is done, not waiting on a video", /\| built: walkthrough video skipped \|/.test(status()) && planStage(pd).stage === "done", status());
  writeFileSync(join(pd, "walkthrough.md"), wtText);
  mkdirSync(join(pd, "walkthrough-video"), { recursive: true }); writeFileSync(join(pd, "walkthrough-video", "index.html"), "<!-- built -->");
  ok("reel status: walkthrough to review", /\| walkthrough to review \|/.test(status()), status());
  const w1 = { version: 1, src: "2026-09-23-drafts--walkthrough/index.html", project: "walkthrough-video", exportedAt: "2026-09-24T09:00:00.000Z", verdict: "changes", watch: { completion: 1 },
    decisions: [], quizzes: [], autonomy: [{ id: "a1", verdict: "flag", chose: "JSONB column", planStep: 1, t: 20 }, { id: "a2", verdict: "accept", chose: "PDF only", planStep: 2, t: 40 }],
    annotations: [{ id: "f1", kind: "flag", t: 20, comment: "Flagged: JSONB column", plan: { step: 1 } }, { id: "n2", kind: "note", t: 22, comment: "a table is easier to query", plan: { step: 1 } }] };
  writeFileSync(join(tmp, "w1.json"), JSON.stringify(w1));
  const rw = reel("record", pd, join(tmp, "w1.json"));
  const mdw = readFileSync(join(pd, "reviews", "walkthrough-20260924T090000Z.md"), "utf8");
  ok("reel record: a walkthrough review is kept beside the plan's, with the flag to fix and the reviewer's words", rw.code === 0 && /a walkthrough review/.test(rw.out) && /- \*\*A1\*\* \(step 1\) flagged: JSONB column\n  - instead of: a table per draft\n  - where to check: `src\/store.ts`\n  - the reviewer's words \(at 0:22\): "a table is easier to query"/.test(mdw) && /Accepted \(now in the ledger\): A2\./.test(mdw) && !/Flagged: JSONB/.test(mdw), mdw);
  ok("reel status: fixes to make, and every review counted", /\| 1 fix to make \| 2 plan, 1 walkthrough \|/.test(status()), status());
  writeFileSync(join(tmp, "w2.json"), JSON.stringify({ ...w1, exportedAt: "2026-09-24T11:00:00.000Z", verdict: "approve", autonomy: [{ id: "a1", verdict: "accept", chose: "a table per draft", planStep: 1, t: 20 }], annotations: [] }));
  reel("record", pd, join(tmp, "w2.json"));
  ok("reel status: accepted once the last walkthrough review asks for nothing", /\| accepted \| 2 plan, 2 walkthrough \|/.test(status()), status());
  ok("every round is kept: two plan reviews, two walkthrough reviews, each with what to act on", files(join(pd, "reviews")).length === 8, files(join(pd, "reviews")).join());
  // the verdict says, first, what it means for the work (SKILL.md): accepted with comments is no new video
  const mdOf = (f) => readFileSync(join(pd, "reviews", f), "utf8").split("\n")[2];
  ok("what to act on: a plan review asking for changes says revise, rebuild the touched beats, show it again", /^\*\*Changes requested:\*\* revise the steps below, rebuild the beats they touch, and show the plan video again\.$/.test(mdOf(`${id1}.md`)), mdOf(`${id1}.md`));
  ok("what to act on: an approved plan review says fold the comments into plan.md, no new plan video", /^\*\*Approved:\*\* fold the comments below into `plan\.md`'s steps as text, then implement; no new plan video\.$/.test(mdOf(`${id1}-2.md`)), mdOf(`${id1}-2.md`));
  ok("what to act on: a walkthrough asking for changes says fix, rebuild the touched beats, show it again", /^\*\*Changes requested:\*\* make the fixes below, rebuild the beats they touch, and show the walkthrough again\.$/.test(mdOf("walkthrough-20260924T090000Z.md")), mdOf("walkthrough-20260924T090000Z.md"));
  ok("what to act on: an accepted walkthrough says fix and log, no new video", /^\*\*Accepted:\*\* make the fixes below and log them in `walkthrough\.md`; no new walkthrough video\.$/.test(mdOf("walkthrough-20260924T110000Z.md")), mdOf("walkthrough-20260924T110000Z.md"));
  // round 2 judged only A1 again: A2, judged (accepted) in round 1, is not "never judged"
  const mdw2 = readFileSync(join(pd, "reviews", "walkthrough-20260924T110000Z.md"), "utf8");
  ok("what to act on: a call judged in an earlier walkthrough review of the plan is not listed as never judged", !/Never judged/.test(mdw2) && /Accepted \(now in the ledger\): A1\./.test(mdw2), mdw2);

  // ---- a walkthrough accepted in conversation, not in the player: said so, with the words, no watch data, never an email ----
  {
    const talk = { version: 1, project: "walkthrough-video", source: "conversation", by: "id:u_owner", said: "Ok can you just accept all these as is?",
      submittedAt: "2026-09-24T12:00:00.000Z", verdict: "approve", decisions: [], quizzes: [], annotations: [],
      autonomy: [{ id: "a1", verdict: "accept", chose: "a table per draft", planStep: 1 }, { id: "a2", verdict: "accept", chose: "PDF only", planStep: 2 }] };
    writeFileSync(join(tmp, "talk.json"), JSON.stringify(talk));
    const rt = reel("record", pd, join(tmp, "talk.json"));
    const filed = JSON.parse(readFileSync(join(pd, "reviews", "walkthrough-20260924T120000Z.json"), "utf8"));
    const mdt = readFileSync(join(pd, "reviews", "walkthrough-20260924T120000Z.md"), "utf8");
    ok("reel record: a review given in conversation is stamped by the id it names, via conversation, never git's email",
      rt.code === 0 && filed.recorded?.reviewer === "id:u_owner" && filed.recorded?.id === "id:u_owner" && filed.recorded?.via === "conversation" && !/@/.test(JSON.stringify(filed.recorded)) && /, by id:u_owner \(reelplanning /.test(rt.out), `${rt.out}\n${JSON.stringify(filed.recorded)}`);
    ok("what to act on: it says accepted in conversation on its day, not in the player, with the words, and no watched %",
      /: 2 calls judged; accepted in conversation on 2026-09-24, not in the player \(nothing watched or timed\): "Ok can you just accept all these as is\?"$/m.test(mdt) && !/watched \d+%/.test(mdt) && /Accepted \(now in the ledger\): A1, A2\./.test(mdt), mdt);
    ok("reel status: still accepted, three walkthrough reviews", /\| accepted \| 2 plan, 3 walkthrough \|/.test(status()), status());
    const { afterBuildOf } = await import("../lib/memory.mjs");
    const ab = afterBuildOf(filed);
    ok("memory: a review given in conversation is not early and not timed", ab.conversation === true && ab.early === false && ab.timed === 0, JSON.stringify(ab));
  }

  // ---- a comment rides with a call only when it was made on that call's beat ----
  // (round 2 of the revise-loop plan: three notes on step 6, one on the step's opening beat and one on
  // each of two calls' beats; the old sort gave all three to both calls)
  const wmap = { project: "walkthrough-video", frames: [{ index: 46, start: 445, durationSeconds: 17 }, { index: 49, start: 487, durationSeconds: 10 }, { index: 52, start: 525, durationSeconds: 11 }, { index: 63, start: 630, durationSeconds: 12 }],
    autonomy: [{ id: "a18", frameIndex: 49, planStep: 6, chose: "failIfUnavailable: true", at: 497 }, { id: "d2", frameIndex: 52, planStep: 6, chose: "codex exec --sandbox workspace-write", at: 535 }, { id: "a17", frameIndex: 50, planStep: 6, chose: "inline settings", at: 505 }],
    autonomyGroups: [{ frameIndex: 63, ids: ["a21", "a23"], at: 641 }] };
  const wr = { project: "walkthrough-video", verdict: "changes", exportedAt: "2026-09-24T07:17:28Z", quizzes: [], decisions: [],
    autonomy: [{ id: "a18", verdict: "own", own: "note it in the README", planStep: 6, t: 497, chose: "failIfUnavailable: true" }, { id: "d2", verdict: "own", own: "codex has an auto mode too; later", planStep: 6, t: 535, chose: "codex exec --sandbox workspace-write" }, { id: "a21", verdict: "flag", planStep: 8, t: 641, chose: "tags in brackets" }],
    annotations: [{ id: "n1", kind: "note", t: 453, comment: "what happens with a non-Claude harness?", frame: { index: 46 }, plan: { step: 6 } },
      { id: "n2", kind: "note", t: 497, comment: "note it in the README", about: "On what the agent decided: failIfUnavailable: true", frame: { index: 49 }, plan: { step: 6 } },
      { id: "n3", kind: "note", t: 535, comment: "codex has an auto mode too; later", frame: { index: 52 }, plan: { step: 6 } },
      { id: "n4", kind: "note", t: 536, comment: "and name the flag", frame: { index: 52 }, plan: { step: 6 } },
      { id: "n5", kind: "note", t: 640, comment: "brackets read oddly", plan: { step: 8 } }] };
  const sc = walkthroughScope(wr, { map: wmap, earlier: [{ autonomy: [{ id: "a17", verdict: "accept" }] }] });
  const said = (id) => sc.fixes.find((f) => f.id === id)?.comments.map((c) => c.comment) || [];
  ok("calls: a comment on the step at large rides with no call", !sc.fixes.some((f) => f.comments.some((c) => c.id === "n1")), JSON.stringify(sc.fixes.map((f) => [f.id, f.comments.map((c) => c.id)])));
  ok("calls: each call keeps only the words said on its own beat, own words said once", said("A18").join("|") === "note it in the README" && said("D2").join("|") === "codex has an auto mode too; later|and name the flag", JSON.stringify([said("A18"), said("D2")]));
  ok("calls: a grouped call takes a comment made in its group's beat's time", said("A21").join("|") === "brackets read oddly", JSON.stringify(said("A21")));
  ok("calls: never judged lists only calls this video asked that no review judged (a17 was, earlier; a23 was not)", sc.unjudged.map((u) => u.id).join() === "A23", JSON.stringify(sc.unjudged));
  const wmd = actOnMarkdown({ id: "walkthrough-x", kind: "walkthrough", review: wr, planName: "p", map: wmap, earlier: [{ autonomy: [{ id: "a17", verdict: "accept" }] }] });
  ok("calls: the step-wide comment is listed under its step, the call's own words are not repeated there", /- \*\*Step 6\*\*\n  - comment at 7:33: "what happens with a non-Claude harness\?"/.test(wmd) && (wmd.match(/note it in the README/g) || []).length === 1, wmd);

  // ---- "reaches" a decision only when the words name it, not on one loose word ----
  const D5 = { id: "D-005", status: "active", question: "Which video-only feedback comes first?", chosen: "Automatic rewinds", options: [{ id: "a", label: "Automatic rewinds" }, { id: "b", label: "A lost-me button" }, { id: "c", label: "Both" }] };
  const a29 = "confused here, i guess this is about doing a local vs npx one? its fine to allow both, and ofc local used when we are editing";
  ok("reaches: A29's words (\"allow both\") do not reach D-005", reaches(a29, [D5]).length === 0);
  ok("reaches: a comment naming D-005 does", reaches("this undoes D-005, I think", [D5]).length === 1 && reaches("see d005", [D5]).length === 1 && reaches("see D-0050", [D5]).length === 0);
  ok("reaches: so do all the distinctive words of one of its options", reaches("drop the automatic rewind, it misfires", [D5]).length === 1 && reaches("we need a lost-me button after all", [D5]).length === 1 && reaches("rewinds are fine", [D5]).length === 0);
  const esc = walkthroughScope({ ...wr, autonomy: [{ id: "a29", verdict: "own", own: a29, planStep: 9, t: 706 }], annotations: [] }, { ledger: [D5] });
  const esc2 = walkthroughScope({ ...wr, autonomy: [{ id: "a29", verdict: "own", own: "this is D-005 again", planStep: 9, t: 706 }], annotations: [] }, { ledger: [D5] });
  ok("reaches: A29 is a fix in place, not a plan that supersedes; naming D-005 escalates", esc.fixes[0]?.escalate === false && esc2.fixes[0]?.escalate === true && /D-005/.test(esc2.fixes[0].reaches[0]), JSON.stringify([esc.fixes[0], esc2.fixes[0]]));
  // the handoff an older page shows moves the download into the plan folder, then runs `reel record <plan-dir>`
  writeFileSync(join(pd, "annotations.json"), JSON.stringify(review("2026-09-25T08:00:00.000Z")));
  const lo = reel("record", pd);
  ok("reel record: a review left loose in the plan folder (the old handoff) is filed in reviews/, and the loose copy goes", lo.code === 0 && existsSync(join(pd, "reviews", "plan-20260925T080000Z.json")) && !existsSync(join(pd, "annotations.json")) && /moved from annotations\.json/.test(lo.out), lo.out);

  // ---- migrating an old plan folder, round 1 recovered from git history ----
  const old = join(tmp, "old"), orp = join(old, ".reelplanning"), opd = join(orp, "plans", "2026-09-01-drafts");
  mkdirSync(old, { recursive: true });
  reel("init", old, "--name", "old", "--kind", "greenfield");
  mkdirSync(join(opd, "video"), { recursive: true });
  writeFileSync(join(opd, "plan.md"), plan(steps("—"))); writeFileSync(join(opd, "video", "plan-map.json"), JSON.stringify(map));
  const g = (...a) => execFileSync("git", ["-C", old, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { stdio: "ignore" });
  writeFileSync(join(opd, "annotations.json"), JSON.stringify(review("2026-09-01T10:00:00.000Z", { verdict: "changes" })));
  writeFileSync(join(opd, "README.md"), "# drafts\n\n| Stage | Artefact | Done |\n|---|---|---|\n"); writeFileSync(join(opd, "plan.resolved.md"), "# resolved\n");
  g("init", "-q"); g("add", "-A"); g("commit", "-qm", "round 1");
  writeFileSync(join(opd, "annotations.json"), JSON.stringify(review("2026-09-02T10:00:00.000Z")));   // round 2 overwrote round 1
  writeFileSync(join(opd, "walkthrough-annotations.json"), JSON.stringify({ ...w1, exportedAt: "2026-09-03T10:00:00.000Z" }));
  writeFileSync(join(opd, "walkthrough-scope.json"), "{}"); writeFileSync(join(opd, "walkthrough.resolved.md"), "# resolved\n");
  g("add", "-A"); g("commit", "-qm", "round 2");
  const m1 = run("migrate-reviews.mjs", old);
  ok("migrate-reviews: every version in git history is filed, round 1 included, each with what to act on", m1.code === 0
    && files(join(opd, "reviews")).join() === "plan-20260901T100000Z.json,plan-20260901T100000Z.md,plan-20260902T100000Z.json,plan-20260902T100000Z.md,walkthrough-20260903T100000Z.json,walkthrough-20260903T100000Z.md", m1.out + files(join(opd, "reviews")).join());
  ok("migrate-reviews: the old files are gone; plan.md and the video stay", files(opd).join() === "plan.md,reviews,video", files(opd).join());
  ok("migrate-reviews: round 1's review says what it said", /changes requested/.test(readFileSync(join(opd, "reviews", "plan-20260901T100000Z.md"), "utf8")) && /approved/.test(readFileSync(join(opd, "reviews", "plan-20260902T100000Z.md"), "utf8")));
  const before = files(join(opd, "reviews")).map((f) => readFileSync(join(opd, "reviews", f), "utf8")).join("\0");
  const m2 = run("migrate-reviews.mjs", old);
  ok("migrate-reviews: running it again changes nothing", m2.code === 0 && /0 review\(s\) filed in reviews\/, 0 old file/.test(m2.out) && files(join(opd, "reviews")).map((f) => readFileSync(join(opd, "reviews", f), "utf8")).join("\0") === before, m2.out);
  // a README someone wrote by hand is not the old checklist: it stays
  writeFileSync(join(opd, "README.md"), "# Notes on this plan\n\nWhy we split the upload.\n");
  const m3 = run("migrate-reviews.mjs", old);
  ok("migrate-reviews: a README written by hand is kept", m3.code === 0 && existsSync(join(opd, "README.md")) && /kept README\.md/.test(m3.out), m3.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `✗ ${failed} failed` : "✓ reviews: all passed");
process.exit(failed ? 1 : 0);
