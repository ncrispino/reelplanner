#!/usr/bin/env node
// The decision log at scale (D-306), in a scratch git repo (no browser; a few seconds).
//   rules and history  — reel check asks a plan for each rule (an owner's answer) on a part it touches, never for an
//                        accepted call; a question re-asking a rule still fails, one sharing words with a call does not
//   relevance by code  — with --base, reel check warns about an accepted call only when the diff changes lines its
//                        commits wrote, inside the code its row names; pr-check and code-check's brief say the same
//   outlived           — a call none of whose lines is left in HEAD is named by reel status and reel memory; the log is not edited
//   fold               — reel fold drafts a part's rules as a section of spec.md (--dry-run writes nothing); --apply puts it
//                        there and marks them folded; a plan then cites the section, and reel check holds it to that
//   readers            — ledgerAsOf takes a rule folded after the day as active then; decisions.md says where it was folded
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { ledgerAsOf } from "../lib/reviews.mjs";
import { isRule, isHistory, inForce, specCites, specHas } from "../lib/ledger.mjs";
import { callsTouched, stepsNamed } from "../lib/call-lines.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-ledger-"));
process.env.REELPLANNER_HOME = join(tmp, "home");
const rp = join(tmp, ".reelplanner");
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const node = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { cwd: tmp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: process.env }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => node("reel.mjs", ...a);
const git = (...a) => execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const commit = (msg) => { git("add", "-A"); git("commit", "-q", "-m", msg); return git("rev-parse", "HEAD"); };
const log = () => json(join(rp, "decisions.json")).decisions, byId = (id) => log().find((d) => d.id === id);
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };
const lines = (out) => String(out).split("\n").filter((l) => /^[✗△]/.test(l)).join("\n");

const X0 = "// the module\nexport const top = 1;\n";
const X1 = `// the module
export const top = 1;
// a note the earlier plan left
export function keep(n) {
  const a = n + 1;
  const b = a * 2;
  return b;
}

export function gone() {
  return "soon removed";
}
`;
const plan = (name, { cites = "D-001", question = null, supersedes = null } = {}) => write(join(rp, "plans", name, "plan.md"), `# ${name}

## Steps

### Step 1 — Do the thing

x

## Components touched

- **Alpha** — the part

## Decisions in force

${cites ? `- ${cites} (all steps)` : "- none"}
${supersedes ? `\n## Supersedes\n\n- ${supersedes} — replaced (step 1)\n` : ""}${question ? `\n## Open questions for the reviewer\n\n1. **${question}** (step 1)\n` : ""}`);

try {
  git("init", "-q");
  write(join(rp, "system.json"), JSON.stringify({ components: [{ id: "alpha", name: "Alpha" }, { id: "beta", name: "Beta" }] }, null, 2));
  write(join(rp, "spec.md"), "# Spec\n\n## Parts\n\nAlpha and Beta.\n");
  write(join(tmp, "src", "x.mjs"), X0);
  commit("start");
  write(join(tmp, "src", "x.mjs"), X1);
  const c1 = commit("earlier: keep and gone");
  write(join(rp, "plans", "2026-01-01-earlier", "plan.md"), "# Earlier: keep and gone\n\n## Steps\n\n### Step 1 — Keep\n\nx\n\n## Components touched\n\n- **Alpha** — x\n");
  write(join(rp, "plans", "2026-01-01-earlier", "walkthrough.md"), `# Walkthrough

**Commits:** ${c1.slice(0, 7)}

### Step 1 — Keep ✅

\`src/x.mjs\`

| id | step | chose | instead of | why | where to check |
|---|---|---|---|---|---|
| A1 | 1 | keep doubles one more than n | adding two | the sum is what a reader expects | \`keep\` in \`src/x.mjs\` |
| A2 | 1 | gone says it is soon removed | an empty function | it is temporary | \`gone\` in \`src/x.mjs\` |
`);
  const entry = (id, more) => ({ id, date: "2026-01-01", plan: "2026-01-01-earlier", step: 1, stepTitle: "Keep", options: [], status: "active", supersedes: [], components: ["alpha"], ...more });
  write(join(rp, "decisions.json"), JSON.stringify({ decisions: [
    entry("D-001", { questionId: "q1", question: "Which number does keep start from?", chosen: "One more than n", chosenId: "a", recommended: true, why: "the reader counts from one" }),
    entry("D-002", { questionId: "autonomy-a1", kind: "autonomy", verdict: "accept", question: "keep doubles one more than n, or adding two? (the agent's own call A1, accepted in the walkthrough)", chosen: "keep doubles one more than n", chosenId: "chose", recommended: true }),
    entry("D-003", { questionId: "autonomy-a2", kind: "autonomy", verdict: "accept", question: "gone says it is soon removed, or an empty function? (the agent's own call A2, accepted in the walkthrough)", chosen: "gone says it is soon removed", chosenId: "chose", recommended: true }),
    entry("D-004", { components: ["beta"], questionId: "q2", question: "What colour is Beta?", chosen: "Blue", chosenId: "a", recommended: true }),
  ] }, null, 2));
  commit("earlier: its record");

  // ---------- rules and history ----------
  ok("isRule / isHistory / inForce: an answer is a rule, an accepted call history, folded still in force",
    isRule({ status: "active" }) && !isRule({ status: "active", kind: "autonomy" }) && isHistory({ status: "active", kind: "autonomy" }) && !isHistory({ status: "listed", kind: "autonomy" }) && inForce({ status: "folded" }) && isRule({ status: "folded" }) && !inForce({ status: "superseded" }));
  plan("2026-02-01-next");
  let c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a plan citing the rule on its part passes, not asked for the accepted calls there", c.code === 0 && /0 failure\(s\), 0 warning\(s\)/.test(c.out) && !/D-00[23]/.test(lines(c.out)), c.out);
  plan("2026-02-01-next", { cites: null });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: the rule uncited fails, as before; the calls still are not asked for", c.code === 1 && /✗ D-001 \(Which number/.test(c.out) && !/D-00[23]/.test(lines(c.out)), c.out);
  plan("2026-02-01-next", { question: "Is adding two better than doubling?" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a question sharing words with an accepted call is neither a failure nor a warning", c.code === 0 && !/re-ask/.test(c.out), c.out);
  plan("2026-02-01-next", { cites: null, question: "Which number does keep start from now?" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a question re-asking a rule still fails", c.code === 1 && /re-asks D-001/.test(c.out), c.out);

  // ---------- outlived: gone() is removed ----------
  write(join(tmp, "src", "x.mjs"), X1.replace(/\nexport function gone\(\) \{\n[\s\S]*?\}\n/, "\n"));
  plan("2026-02-01-next");
  const c2 = commit("other: remove gone");
  const st = reel("status", tmp);
  ok("reel status: the call whose lines are all gone is outlived; the log is not edited", /1 still on lines their commits wrote, 1 outlived/.test(st.out) && byId("D-003").status === "active", st.out);
  const mem = reel("memory", tmp, "outlived");
  ok("reel memory outlived: names it, in its own words, with its file", /D-003, the earlier plan's call A2: “gone says it is soon removed”, instead of “an empty function” \(src\/x\.mjs\)/.test(mem.out) && !/D-002/.test(mem.out), mem.out);
  ok("…and the blame is cached outside git's view (.reelplanner/.cache/)", existsSync(join(rp, ".cache", "blame.json")));

  // ---------- relevance by code ----------
  write(join(tmp, "src", "x.mjs"), readFileSync(join(tmp, "src", "x.mjs"), "utf8").replace("// a note the earlier plan left", "// a note, reworded"));
  const c3 = commit("other: reword the note");
  c = reel("check", join(rp, "plans", "2026-02-01-next"), "--base", c2);
  ok("reel check --base: a change to the earlier plan's lines outside the code a call names warns about nothing", c.code === 0 && /0 warning\(s\); 0 accepted call/.test(c.out), c.out);
  write(join(tmp, "src", "x.mjs"), readFileSync(join(tmp, "src", "x.mjs"), "utf8").replace("const b = a * 2;", "const b = a * 3;"));
  commit("other: triple it");
  c = reel("check", join(rp, "plans", "2026-02-01-next"), "--base", c3);
  ok("reel check --base: a change inside keep() warns about D-002, in its words, with the lines", c.code === 0 && /△ the diff from \S+ changes lines of D-002, the earlier plan's call A1: “keep doubles one more than n”, instead of “adding two” \(1 in src\/x\.mjs\)/.test(c.out) && /1 accepted call\(s\) whose lines/.test(c.out), c.out);
  plan("2026-02-01-next", { cites: "D-001, D-002" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"), "--base", c3);
  ok("…cited in Decisions in force, it is not warned about", c.code === 0 && !/△/.test(c.out), c.out);
  plan("2026-02-01-next");
  const pr = node("pr-check.mjs", tmp, "--base", c3);
  ok("pr-check: names the call whose lines the branch changes, and does not fail for it", /△ changes lines of D-002, the earlier plan's call A1/.test(pr.out) && !/✗ .*D-002/.test(pr.out), pr.out);
  const cc = node("code-check.mjs", join(rp, "plans", "2026-02-01-next"), "--base", c3);
  const brief = existsSync(join(rp, "plans", "2026-02-01-next", "code-check", "brief.md")) ? readFileSync(join(rp, "plans", "2026-02-01-next", "code-check", "brief.md"), "utf8") : "";
  ok("code-check: its brief lists the earlier call this diff changes, for the checker to judge", cc.code === 0 && /## Earlier calls this diff changes\n\n[^\n]+\n\n- \*\*D-002\*\* the earlier plan's call A1: “keep doubles one more than n”/.test(brief) && /1 earlier call\(s\)/.test(cc.out), cc.out + brief.slice(0, 400));

  // ---------- fold ----------
  const before = readFileSync(join(rp, "decisions.json"), "utf8"), specBefore = readFileSync(join(rp, "spec.md"), "utf8");
  const dry = reel("fold", tmp, "alpha", "--dry-run");
  ok("reel fold --dry-run: the section from the part's rules, and what it folds; nothing written",
    /<a id="rules-alpha"><\/a>\n### Alpha\n\n- \*\*Which number does keep start from\?\*\* One more than n: the reader counts from one\. \(D-001\)/.test(dry.out) && /## Folds\n\n- D-001 — /.test(dry.out) && !/D-00[234]/.test(dry.out.split("## Folds")[1] || "")
    && !existsSync(join(rp, "folds")) && readFileSync(join(rp, "decisions.json"), "utf8") === before && readFileSync(join(rp, "spec.md"), "utf8") === specBefore, dry.out);
  const draft = reel("fold", tmp, "alpha");
  ok("reel fold: drafts folds/alpha.md for the owner's approval; the log and spec.md wait", /folds\/alpha\.md/.test(draft.out) && existsSync(join(rp, "folds", "alpha.md")) && byId("D-001").status === "active" && readFileSync(join(rp, "spec.md"), "utf8") === specBefore, draft.out);
  // the owner tightens the words before approving it
  write(join(rp, "folds", "alpha.md"), readFileSync(join(rp, "folds", "alpha.md"), "utf8").replace(/- \*\*Which number[^\n]+/, "- keep starts from one more than n. (D-001)"));
  const ap = reel("fold", tmp, "alpha", "--apply", "--date", "2026-03-01");
  const spec = readFileSync(join(rp, "spec.md"), "utf8"), d1 = byId("D-001");
  ok("reel fold --apply: the approved section goes into spec.md under Rules in force; D-001 is folded into it",
    ap.code === 0 && /## Rules in force[\s\S]*<!-- rules:alpha -->\n<a id="rules-alpha"><\/a>\n### Alpha\n\n- keep starts from one more than n\. \(D-001\)\n<!-- \/rules:alpha -->/.test(spec)
    && d1.status === "folded" && d1.foldedInto === "spec.md#rules-alpha" && d1.foldedOn === "2026-03-01" && byId("D-004").status === "active" && byId("D-002").status === "active", ap.out + spec);
  ok("decisions.md: says where it was folded", /\| folded into spec\.md#rules-alpha \|/.test(readFileSync(join(rp, "decisions.md"), "utf8")) && /\*\*Status:\*\* folded, folded into spec\.md#rules-alpha on 2026-03-01/.test(readFileSync(join(rp, "decisions.md"), "utf8")));
  const again = reel("fold", tmp, "alpha", "--apply");
  ok("reel fold --apply again: refused, the decision is folded already", again.code === 1 && /D-001: not a rule in force/.test(again.out), again.out);
  plan("2026-02-01-next", { cites: null });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a plan citing neither the section nor the id fails, naming the section once", c.code === 1 && /✗ spec\.md#rules-alpha holds the rules on a component this plan touches \(folded there: D-001\)/.test(c.out), c.out);
  plan("2026-02-01-next", { cites: "spec.md#rules-alpha" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: citing spec.md#rules-alpha in place of the id passes", c.code === 0 && /\(and spec\.md#rules-alpha\)/.test(c.out), c.out);
  plan("2026-02-01-next", { cites: "D-001" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: citing the folded id itself still passes", c.code === 0, c.out);
  plan("2026-02-01-next", { cites: "spec.md#rules-alpha, spec.md#rules-nowhere" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a section spec.md does not have fails", c.code === 1 && /spec\.md#rules-nowhere is cited, but spec\.md has no such section/.test(c.out), c.out);
  plan("2026-02-01-next", { cites: null, supersedes: "D-001" });
  c = reel("check", join(rp, "plans", "2026-02-01-next"));
  ok("reel check: a folded rule can be superseded (not \"already superseded\")", c.code === 0 && !/already superseded/.test(c.out), c.out);
  ok("specCites / specHas: the sections a plan names, found by anchor or heading", specCites("- spec.md#Rules-Alpha (all); spec.md#rules-beta").join() === "spec.md#rules-alpha,spec.md#rules-beta" && specHas(spec, "spec.md#rules-alpha") && specHas("## Rules in force\n", "spec.md#rules-in-force") && !specHas(spec, "spec.md#rules-beta"));
  const asOf = (day) => ledgerAsOf(log(), day).find((d) => d.id === "D-001");
  ok("ledgerAsOf: folded after the day, it was active then; on or after, folded", asOf("2026-02-15").status === "active" && !asOf("2026-02-15").foldedInto && asOf("2026-03-01").status === "folded", JSON.stringify([asOf("2026-02-15"), asOf("2026-03-01")]));

  // ---------- a comment or spacing touches no call; a call's own commits' lines come first ----------
  // (a one-line comment edit in .github/workflows/ci.yml warned about three of the contributing plan's calls whose rows
  // name only the file: every line the plan wrote there was theirs)
  const Y0 = "# the workflow\n# runs the tests\nname: ci\njobs:\n  fast:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n";
  write(join(tmp, "ci.yml"), Y0);
  const y1 = commit("ci: the fast job (step 1)");
  write(join(tmp, "ci.yml"), `${Y0}  full:\n    runs-on: ubuntu-latest\n    timeout-minutes: 30\n    steps:\n      - run: npm run test:full   # every spec\n`);
  const y2 = commit("ci: the full job (step 2, its call A2)");
  write(join(rp, "plans", "2026-01-05-ci", "plan.md"), "# CI: the workflow\n\n## Steps\n\n### Step 1 — Fast\n\nx\n\n### Step 2 — Full\n\nx\n");
  write(join(rp, "plans", "2026-01-05-ci", "walkthrough.md"), `# Walkthrough

**Commits:** ${y1.slice(0, 7)} ${y2.slice(0, 7)}

### Step 1 — Fast ✅

### Step 2 — Full ✅

| id | step | chose | instead of | why | where to check |
|---|---|---|---|---|---|
| A1 | 1 | The workflow is ci.yml | test.yml | it runs more than the tests | \`ci.yml\` |
| A2 | 2 | The full job runs on every PR | skip it without the label | a skipped check counts as passed | \`ci.yml\` |
`);
  let at = commit("ci: its record");
  const ciCall = (id, step, chosen) => entry(id, { plan: "2026-01-05-ci", step, questionId: `autonomy-a${step}`, kind: "autonomy", verdict: "accept", chosen, chosenId: "chose" });
  const CI = [ciCall("D-010", 1, "The workflow is ci.yml"), ciCall("D-011", 2, "The full job runs on every PR")];
  const edit = async (from, to, msg) => { write(join(tmp, "ci.yml"), readFileSync(join(tmp, "ci.yml"), "utf8").replace(from, to)); const base = at; at = commit(msg);
    return (await callsTouched(rp, CI, { repo: tmp, base })).map((x) => `${x.d.id}:${x.lines["ci.yml"]}`).join(" "); };
  let t = await edit("# runs the tests\n", "# runs the tests, on every push\n", "other: reword a comment");
  ok("callsTouched: a comment reworded touches no call, though the plan wrote that line and the rows name only the file", t === "", t);
  t = await edit("# every spec", "# every spec, exhaustive", "other: reword a comment after code");
  ok("…nor a comment after code on its line", t === "", t);
  t = await edit("      - run: npm test\n", "      - run:  npm test\n\n", "other: spacing");
  ok("…nor spacing: a doubled space and a blank line", t === "", t);
  // (code on lines the edits above left alone: a line a comment edit rewrote is that commit's in git blame)
  t = await edit("timeout-minutes: 30", "timeout-minutes: 45", "other: the full job's timeout");
  ok("callsTouched: the full job's code changed: the call whose own commit wrote it (step 2, A2), not step 1's", t === "D-011:1", t);
  t = await edit("    runs-on: ubuntu-latest\n", "    runs-on: ubuntu-24.04\n", "other: the fast job's runner");
  ok("…the fast job's: step 1's call, whose own commit wrote that line", t === "D-010:1", t);
  ok("stepsNamed: a commit's message names steps as \"step 3\", \"steps 1 to 4\", \"steps 2, 3 and 5\"", [...stepsNamed("Contributing, steps 1 to 3 in code; step 7; steps 5 and 9")].sort((a, b) => a - b).join() === "1,2,3,5,7,9");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `✗ ${failed} failed` : "✓ all passed");
process.exit(failed ? 1 : 0);
