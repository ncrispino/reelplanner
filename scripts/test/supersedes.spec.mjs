#!/usr/bin/env node
// What a plan supersedes, as `reel record` files it in the decision log (a scratch repo, no browser; a second or two).
// The two faults it was written for, both in the real log: walkthroughs-that-help's round-2 review filed D-214 ("Narrowed
// for small pull requests (step 4)") and D-133 ("Step 7 makes eight minutes a soft target") under its first answer, D-221
// (step 2), and its round-1 answer D-219 came out superseding [D-084, D-083, D-083, D-041], one id twice (the D-083 line
// names D-083 again). Round 1 also superseded D-083 and D-041 though the questions their lines named were not answered
// until round 2, and round 2 superseded D-220, an answer of the plan's own that the D-084 line only names.
//   supersedesOf — a line's lead id is what it replaces, once; the step, question and ids it names are how
//   reel record  — each is linked to the decision of the question or step its line names (or an answer of the plan's
//                  it names by id), to the plan as a whole when none matches, never twice; a line naming a question still
//                  open waits for its answer
//   reel check   — a decision the plan superseded as a whole is its own, not "already superseded"
//   ledgerAsOf   — a decision superseded by a plan as a whole is active in the ledger as it stood before that day
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { supersedesOf } from "../lib/plan-md.mjs";
import { ledgerAsOf } from "../lib/reviews.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-supersedes-"));
process.env.REELPLANNER_HOME = join(tmp, "home");   // `reel record` adds a summary to your memory: keep it out of the real home
const rp = join(tmp, ".reelplanner"), plan = "2026-09-27-later", pd = join(rp, "plans", plan);
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const run = (...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "reel.mjs"), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: process.env }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const log = () => json(join(rp, "decisions.json")).decisions, byId = (id) => log().find((d) => d.id === id);
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

const earlier = (id, question, chosen) => ({ id, date: "2026-09-20", plan: "2026-09-20-earlier", step: 1, stepTitle: "Earlier", questionId: `q${id.slice(-1)}`, question, options: [], chosen, chosenId: "a", recommended: true, components: ["cli"], status: "active", supersedes: [] });
const STEPS = "## Steps\n\n### Step 1 — Show it running\n\nx\n\n### Step 2 — Pause when you'd notice\n\nx\n\n### Step 3 — A check where there is something to predict\n\nx\n\n### Step 4 — Small pull requests\n\nx\n\n### Step 5 — A soft target\n\nx\n";
const review = (at, decisions) => ({ exportedAt: at, project: "video", annotations: [], decisions });
// the plan video's map: which question each answer is to (a revise asks a new question under an old id)
const map = (qs) => write(join(pd, "video", "plan-map.json"), JSON.stringify({ decisions: qs.map(([id, question, planStep]) => ({ id, question, planStep, options: [{ id: "a", label: "A", why: "", recommended: true }] })) }, null, 2));

try {
  write(join(rp, "system.json"), JSON.stringify({ components: [{ id: "cli", name: "CLI" }] }, null, 2));
  write(join(rp, "decisions.json"), JSON.stringify({ decisions: [
    earlier("D-001", "Does your own record decide what stops?", "The tags, and your record"),
    earlier("D-002", "How many quick checks does a video ask?", "One per step"),
    earlier("D-003", "When does a PR need a video?", "Choices or size only"),
    earlier("D-004", "How long is the system video?", "Under eight minutes"),
  ] }, null, 2));

  // round 1: three questions; the D-002 line names D-002 twice, and names question 3, which the review asks to explain more
  write(join(pd, "plan.md"), `# Later\n\n## Components touched\n\n- **CLI**\n\n## Supersedes\n\n- **D-001** "Does your own record decide what stops?" Question 2 asks it again.\n- **D-002** "How many quick checks?" Question 3 asks it again. The plan video and the system video keep D-002.\n- **D-003** "When does a PR need a video?" Narrowed for small pull requests (step 4).\n- **D-004** The system video was cut to stay under eight minutes. Step 5 makes it a soft target.\n\n${STEPS}\n## Open questions for the reviewer\n\n1. **What replaces the walkthrough?** (step 1)\n2. **Which choices make it pause?** (step 2)\n3. **Does the walkthrough test you?** (step 3)\n`);
  const lines = supersedesOf("- **D-001** \"x\" Replaced by D-009: step 2's judgment.\n- **D-002** \"y\" For the walkthrough only, question 2 asks it again. The system video keeps\n  D-002.\n- **D-002** again\n");
  ok("supersedesOf: a line's lead id, once; the ids after it are what it names, with its step and question", lines.map((l) => l.id).join() === "D-001,D-002" && lines[0].refs.join() === "D-009" && lines[0].step === 2 && lines[1].question === 2 && lines[1].refs.length === 0, JSON.stringify(lines));

  map([["q1", "What replaces the walkthrough?", 1], ["q2", "Which choices make it pause?", 2], ["q3", "Does the walkthrough test you?", 3]]);
  const r1 = join(tmp, "round1.json");
  write(r1, JSON.stringify(review("2026-09-27T10:00:00Z", [
    { id: "q1", option: "a", label: "A short video of it running", planStep: 1, recommended: true },
    { id: "q2", option: "own", label: "no fixed count: it depends on the plan", planStep: 2, recommended: false },
    { id: "q3", option: "unclear", label: "Explain this more", planStep: 3 },
  ])));
  const o1 = run("record", pd, r1);
  const q1 = log().find((d) => d.plan === plan && d.questionId === "q1"), q2 = log().find((d) => d.plan === plan && d.questionId === "q2");
  ok("record, round 1: two answers join the log", o1.code === 0 && q1?.id === "D-005" && q2?.id === "D-006", o1.out);
  ok("record, round 1: a line naming question 2 is linked to question 2's answer, not the review's first", byId("D-001").supersededBy === q2?.id && q2?.supersedes.join() === "D-001" && q1?.supersedes.length === 0, JSON.stringify([byId("D-001"), q1?.supersedes, q2?.supersedes]));
  ok("record, round 1: no answer supersedes an id twice", log().every((d) => new Set(d.supersedes || []).size === (d.supersedes || []).length), JSON.stringify(log().map((d) => [d.id, d.supersedes])));
  ok("record, round 1: a line naming a question still open waits: the decision stays in force", byId("D-002").status === "active" && !byId("D-002").supersededBy && /D-002 waits for question 3/.test(o1.out), o1.out);
  ok("record, round 1: a line naming a step with no decision is linked to the plan as a whole", ["D-003", "D-004"].every((id) => byId(id).status === "superseded" && !byId(id).supersededBy && byId(id).supersededByPlan === plan && byId(id).supersededOn === "2026-09-27"), JSON.stringify([byId("D-003"), byId("D-004")]));
  ok("record, round 1: decisions.md says who superseded each", /\| superseded by D-006 \|/.test(readFileSync(join(rp, "decisions.md"), "utf8")) && /\| superseded by the plan 2026-09-27-later \|/.test(readFileSync(join(rp, "decisions.md"), "utf8")));

  // round 2: the plan revised, one question left; the D-001 line now names the plan's own round-1 answer by id, and the
  // D-002 line names the new question 1
  write(join(pd, "plan.md"), `# Later\n\n## Components touched\n\n- **CLI**\n\n## Supersedes\n\n- **D-001** "Does your own record decide what stops?" Replaced by ${q2.id}: step 2's judgment, in your words.\n- **D-002** "How many quick checks?" For the walkthrough only, question 1 asks it again. The system video keeps D-002.\n- **D-003** "When does a PR need a video?" Narrowed for small pull requests (step 4).\n- **D-004** The system video was cut to stay under eight minutes. Step 5 makes it a soft target.\n\n${STEPS}\n## Open questions for the reviewer\n\n1. **Does the walkthrough test you?** (step 3)\n`);
  map([["q1", "Does the walkthrough test you?", 3]]);
  const r2 = join(tmp, "round2.json");
  write(r2, JSON.stringify(review("2026-09-27T19:00:00Z", [{ id: "q1", option: "a", label: "Where there's something to predict", planStep: 3, recommended: true }])));
  const o2 = run("record", pd, r2);
  const q3 = log().find((d) => d.plan === plan && d.question === "Does the walkthrough test you?" && d.chosen === "Where there's something to predict");
  ok("record, round 2: the waiting line is linked to its question's answer now", o2.code === 0 && q3 && byId("D-002").supersededBy === q3.id && q3.supersedes.join() === "D-002", `${o2.out}\n${JSON.stringify(byId("D-002"))}`);
  ok("record, round 2: an answer of the plan's own that a line only names stays in force", byId(q2.id).status === "active" && !byId(q2.id).supersededBy, JSON.stringify(byId(q2.id)));
  ok("record, round 2: what round 1 linked is left as it was, and nothing is linked twice", byId("D-001").supersededBy === q2.id && byId(q2.id).supersedes.join() === "D-001" && byId("D-003").supersededByPlan === plan && log().every((d) => new Set(d.supersedes || []).size === (d.supersededBy ? d.supersedes : d.supersedes || []).length), JSON.stringify(log().map((d) => [d.id, d.supersedes, d.supersededBy, d.supersededByPlan])));
  const o3 = run("record", pd, r2);
  ok("record, again: the same review adds nothing and links nothing again", JSON.stringify(log().map((d) => [d.id, d.status, d.supersedes, d.supersededBy])) === JSON.stringify(json(join(rp, "decisions.json")).decisions.map((d) => [d.id, d.status, d.supersedes, d.supersededBy])) && /\+0/.test(o3.out) && !/✓ supersedes/.test(o3.out), o3.out);

  const c = run("check", pd);
  ok("reel check: a decision this plan superseded as a whole is its own, not \"already superseded\"", !/already superseded/.test(c.out), c.out);
  const asOf = (day) => ledgerAsOf(log(), day).find((d) => d.id === "D-003");
  ok("ledgerAsOf: superseded by the plan as a whole on its day, active before it", asOf("2026-09-26").status === "active" && !asOf("2026-09-26").supersededByPlan && asOf("2026-09-27").status === "superseded", JSON.stringify([asOf("2026-09-26"), asOf("2026-09-27")]));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ supersedes: all passed");
process.exit(failed ? 1 : 0);
