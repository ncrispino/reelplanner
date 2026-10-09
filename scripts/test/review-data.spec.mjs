#!/usr/bin/env node
// The script side of the richer-review plan, against a scratch project (reel init → new-plan):
//   plan-map    — a 4-option question, a pick-all question and its summary frame
//   reel record — a pick-all answer is recorded as a set, the note travels with it; what to act on
//                 (reviews/<id>.md) has every pick, the note, and rewinds/slow-downs by step
//   revise-scope — a note on an answer sends its step to the revise, like a comment
//   reel check  — more than six open questions warns, never fails
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { asksMore } from "../lib/reviews.mjs";

const tmp = mkdtempSync(join(tmpdir(), "review-data-"));
process.env.REELPLANNER_HOME = join(tmp, "home");   // `reel record` adds a summary to your memory: keep it out of the real home
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

const plan = `# Drafts

## Steps

### Step 1 — Store drafts

Where drafts live.

### Step 2 — Export

Which formats ship.

## Components touched

## Open questions for the reviewer

1. **Where do drafts live?** (step 1)
- **A · Postgres.** one table
- **B · S3.** one object each
- **C · Local storage.** no server
- **D · Git.** history for free
I recommend A.

2. **Which formats ship first?** (step 2)
- **A · Web.** the page
- **B · PDF.** print
- **C · Slides.** talks
Pick all that apply.
`;
const storyboard = `---
plan_dir: x
---
## Frame 1 — Step 1
- src: compositions/frames/01.html
- duration: 5
- plan_step: 1

## Frame 2 — Where do drafts live?
- src: compositions/frames/02.html
- duration: 4
- plan_step: 1
- decision: q1
- question: Where do drafts live?
- option_a: Postgres
- option_b: S3
- option_c: Local storage
- option_d: Git
- recommended: a

## Frame 3 — Which formats ship first?
- src: compositions/frames/03.html
- duration: 4
- plan_step: 2
- decision: q2
- kind: multi
- question: Which formats ship first?
- option_a: Web
- option_b: PDF
- option_c: Slides

## Frame 4 — Your picks
- src: compositions/frames/04.html
- duration: 3
- plan_step: 2
- summary: q2
`;

try {
  run("reel.mjs", "init", tmp, "--name", "drafts", "--kind", "greenfield");
  writeFileSync(join(tmp, "plan.md"), plan);
  run("reel.mjs", "new-plan", tmp, "drafts", "--plan", join(tmp, "plan.md"), "--date", "2026-09-23");
  const pd = join(tmp, ".reelplanner/plans/2026-09-23-drafts");
  const vd = join(pd, "video"); mkdirSync(vd, { recursive: true });
  writeFileSync(join(vd, "STORYBOARD.md"), storyboard);
  run("plan-map.mjs", vd);
  const map = JSON.parse(readFileSync(join(vd, "plan-map.json"), "utf8"));
  const [q1, q2] = map.decisions;
  ok("plan-map: a question can carry four options", q1.options.length === 4 && q1.options.map((o) => o.id).join("") === "abcd" && q1.kind === "one");
  ok("plan-map: a pick-all question and its one summary frame", q2.kind === "multi" && q2.summary?.frameIndex === 4 && q2.resumeAt === q2.summary.end, JSON.stringify(q2.summary));

  const ann = { version: 1, verdict: "changes", exportedAt: "2026-09-23T00:00:00Z",
    watch: { completion: 1, moments: [{ kind: "rewind", t: 1.5, from: 4.8, planStep: 1, frameIndex: 1 }, { kind: "slow", t: 9, rate: 0.75, planStep: 2, frameIndex: 3 }] },
    decisions: [
      { id: "q1", option: "c", label: "Local storage", planStep: 1, t: 8.9, recommended: false, note: "only until accounts exist, then move to Postgres" },
      { id: "q2", option: "multi", options: ["a", "c"], labels: ["Web", "Slides"], label: "Web, Slides", planStep: 2, t: 12.9, recommended: false },
    ], annotations: [] };
  writeFileSync(join(tmp, "annotations.json"), JSON.stringify(ann));
  const r = run("reel.mjs", "record", pd, join(tmp, "annotations.json"));
  const resolved = readFileSync(join(pd, "reviews", "plan-20260923T000000Z.md"), "utf8");
  ok("what to act on: a pick-all answer names every pick, and its ledger entry", /\*\*Q2\*\* \(step 2\)[^\n]*: \*\*Web, Slides\*\* \(picked all that apply\) → D-002/.test(resolved), r.out + resolved);
  ok("what to act on: a note on an answer is kept under it", /\*\*Q1\*\* \(step 1\)[^\n]*: \*\*Local storage\*\* \(not the recommendation\) → D-001\n  - their note: "only until accounts exist/.test(resolved), resolved);
  ok("what to act on: rewinds and slow-downs, by step", /\*\*Step 1\*\*[\s\S]*rewound or slowed down: went back to 1\.5s from 4\.8s/.test(resolved) && /\*\*Step 2\*\*[\s\S]*rewound or slowed down: slowed to 0\.75× at 9s/.test(resolved), resolved);
  const ledger = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions;
  const d1 = ledger.find((d) => d.questionId === "q1"), d2 = ledger.find((d) => d.questionId === "q2");
  ok("reel record: the note travels with the decision", d1?.note === "only until accounts exist, then move to Postgres" && /\*\*Note:\*\* only until/.test(readFileSync(join(tmp, ".reelplanner/decisions.md"), "utf8")));
  ok("reel record: a pick-all answer is recorded as the set of picks", d2?.chosen === "Web, Slides" && (d2?.chosenIds || []).join() === "a,c");
  const scope = JSON.parse(run("revise-scope.mjs", pd).out);
  ok("revise-scope: a step the reviewer rewound or slowed down on goes to the revise, to be said more plainly", scope.steps.some((s) => s.step === 2 && s.reasons.some((r) => r.kind === "hard-to-follow" && /slowed to 0\.75×/.test(r.comment))), JSON.stringify(scope.steps));
  ok("revise-scope: a note on an answer sends its step to the revise", scope.steps.some((s) => s.step === 1 && s.reasons.some((x) => x.kind === "answer-note")), JSON.stringify(scope.steps));

  // "Explain this more": never a decision; the step is revised and the question asked again
  const pdU = join(tmp, ".reelplanner/plans/2026-09-23-unclear");
  run("reel.mjs", "new-plan", tmp, "unclear", "--plan", join(tmp, "plan.md"), "--date", "2026-09-23");
  mkdirSync(join(pdU, "video"), { recursive: true }); writeFileSync(join(pdU, "video", "STORYBOARD.md"), storyboard); run("plan-map.mjs", join(pdU, "video"));
  writeFileSync(join(tmp, "unclear.json"), JSON.stringify({ version: 1, verdict: "changes", exportedAt: "2026-09-23T00:00:00Z", annotations: [],
    decisions: [{ id: "q1", option: "unclear", label: "Explain this more", planStep: 1, t: 8.9, recommended: false, note: "what does S3 cost here?" }] }));
  const before = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions.length;
  const ru = run("reel.mjs", "record", pdU, join(tmp, "unclear.json"));
  const after = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions.length;
  const resU = readFileSync(join(pdU, "reviews", "plan-20260923T000000Z.md"), "utf8"), scopeU = JSON.parse(run("revise-scope.mjs", pdU).out);
  ok("reel record: 'explain this more' adds nothing to the ledger, and says so", after === before && /asked to explain more, not decided: q1/.test(ru.out), ru.out);
  ok("what to act on: it reads as not decided, with what is unclear, and names no ledger entry", /\*\*Q1\*\* \(step 1\)[^\n]*: \*\*asked to explain this more\*\*, not decided[^\n]*What is unclear: "what does S3 cost here\?"/.test(resU) && !/→ D-/.test(resU), resU);
  ok("revise-scope: its step is revised, to explain the question and ask again", scopeU.steps.some((s) => s.step === 1 && s.reasons.some((r) => r.kind === "unclear")) && !scopeU.decidedNoRewrite.length, JSON.stringify(scopeU));
  // own words that only ask for more are "explain this more" too; own words naming an option stay an answer
  ok("asksMore: a question in own words asks for more; one naming an option is an answer",
    asksMore({ option: "own", label: "what is 'the real thing' mean? need mroe first" }) && !asksMore({ option: "own", label: "B, but explain it in the docs" }) && !asksMore({ option: "own", label: "only the plan videos" }) && asksMore({ option: "unclear" }));
  writeFileSync(join(tmp, "unclear-own.json"), JSON.stringify({ version: 1, verdict: "changes", exportedAt: "2026-09-23T01:00:00Z", annotations: [],
    decisions: [{ id: "q1", option: "own", own: true, label: "what does S3 even mean here? need more first", planStep: 1, t: 8.9, recommended: false }] }));
  const ruo = run("reel.mjs", "record", pdU, join(tmp, "unclear-own.json"));
  const afterO = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions.length;
  const resO = readFileSync(join(pdU, "reviews", "plan-20260923T010000Z.md"), "utf8");
  ok("reel record: own words asking for more add nothing to the ledger, and read as not decided with the words", afterO === before && /asked to explain more, not decided: q1/.test(ruo.out) && /asked to explain this more\*\*, not decided[^\n]*What is unclear: "what does S3 even mean here\? need more first"/.test(resO), ruo.out + resO);

  // a revise can ask a NEW question under an old id: it is a new decision, not "already recorded"
  const n0 = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions.length;
  const vm = JSON.parse(readFileSync(join(vd, "plan-map.json"), "utf8"));
  vm.decisions[0].question = "Where do drafts live, now that accounts exist?";
  writeFileSync(join(vd, "plan-map.json"), JSON.stringify(vm));
  writeFileSync(join(tmp, "round2.json"), JSON.stringify({ ...ann, exportedAt: "2026-09-24T00:00:00Z", decisions: [{ id: "q1", option: "a", label: "Postgres", planStep: 1, t: 8.9, recommended: true }] }));
  run("reel.mjs", "record", pd, join(tmp, "round2.json"));
  const n1 = JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions;
  ok("reel record: a reworded question under an old id is recorded as a new decision", n1.length === n0 + 1 && n1.at(-1).question === "Where do drafts live, now that accounts exist?", JSON.stringify(n1.at(-1)));
  ok("reel record: round 2's review is kept beside round 1's, never over it", readdirSync(join(pd, "reviews")).sort().join() === "plan-20260923T000000Z.json,plan-20260923T000000Z.md,plan-20260924T000000Z.json,plan-20260924T000000Z.md", readdirSync(join(pd, "reviews")).join());
  run("reel.mjs", "record", pd);
  ok("reel record: and recording it again (the newest review, by default) adds nothing", JSON.parse(readFileSync(join(tmp, ".reelplanner/decisions.json"), "utf8")).decisions.length === n0 + 1 && readdirSync(join(pd, "reviews")).length === 4);

  // seven open questions: a warning, not a failure
  const seven = plan.replace(/## Open questions for the reviewer[\s\S]*/, "## Open questions for the reviewer\n\n" + Array.from({ length: 7 }, (_, i) => `${i + 1}. **Question number ${i + 1} about topic${i}?** (step 1)\n- **A · yes.**\n- **B · no.**\n`).join("\n"));
  writeFileSync(join(tmp, "seven.md"), seven);
  run("reel.mjs", "new-plan", tmp, "seven", "--plan", join(tmp, "seven.md"), "--date", "2026-09-23");
  const c = run("reel.mjs", "check", join(tmp, ".reelplanner/plans/2026-09-23-seven"));
  ok("reel check: seven open questions warn, and do not fail", c.code === 0 && /△ 7 open questions/.test(c.out), c.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `✗ ${failed} failed` : "✓ review data: all passed");
process.exit(failed ? 1 : 0);
