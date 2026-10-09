#!/usr/bin/env node
// The second agent's code check (close-the-lifecycle, step 3; D-001). Before a walkthrough video is
// built, an agent that did NOT write the code reads the diff against the plan and the decision
// ledger, and answers three questions:
//   1. Does every plan step have a change that carries it out?
//   2. Does every decision in force hold in the code?
//   3. Is there anything in the diff the autonomy log does not explain?
//
// This script does not do the checking. It writes a short brief, <plan-dir>/code-check/brief.md: the
// three questions, where the plan is, the decisions that apply, the autonomy log, and which commits
// and files to diff. The checker is a fresh agent with no context of the session that wrote the code (the
// launcher's job; lib/agents.mjs freshAgentHow says how, per agent), started in the repository's top folder,
// and it reads the plan and the diff itself (a pointer keeps the brief short; --inline-diff pastes the diff
// in). It writes its answers to <plan-dir>/code-check/findings.md, in the fixed shape below, which `reel audit` reads.
//
// usage: reelplanner code-check <plan-dir> --base <ref> [--head <ref>] [--inline-diff] [-- <path>…]
//        reelplanner code-check <plan-dir> --prompt      print the prompt that starts the checker
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, basename, dirname, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { freshAgentHow } from "./lib/agents.mjs";
import { isRule, specCites } from "./lib/ledger.mjs";
import { callsTouched, callWords } from "./lib/call-lines.mjs";
import { realPath, isRpDirName } from "./lib/env.mjs";

const argv = process.argv.slice(2);
const dd = argv.indexOf("--");
const paths = dd >= 0 ? argv.slice(dd + 1) : [];
const args = dd >= 0 ? argv.slice(0, dd) : argv;
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };
const die = (m) => { console.error(`✗ code-check: ${m}`); process.exit(1); };
const pd = resolve(args[0] && !args[0].startsWith("--") ? args[0] : die("usage: code-check <plan-dir> --base <ref> [--head <ref>] [-- <path>…]"));
if (!existsSync(join(pd, "plan.md"))) die(`${pd} has no plan.md`);
const outDir = join(pd, "code-check"), briefPath = join(outDir, "brief.md"), findingsPath = join(outDir, "findings.md");

const git = (...a) => execFileSync("git", ["-C", pd, ...a], { encoding: "utf8", maxBuffer: 64 << 20 });
const repo = git("rev-parse", "--show-toplevel").trim();
const rel = (p) => relative(repo, realPath(p)) || ".";   // git's top is the real path; `p` may name it through a link

if (args.includes("--prompt")) {
  if (!existsSync(briefPath)) die(`no brief yet: run code-check ${rel(pd)} --base <ref> first`);
  // the launcher's instruction goes to stderr, so the prompt on stdout is exactly what the checker gets
  console.error(`launch the checker as ${freshAgentHow({ repo })}, with exactly the prompt below and nothing else`);
  console.log(`You are the code checker for a reelplanner plan. You did not write this code: judge it from the brief
and the repository alone, not from anything the agent that wrote it said. Everything you need is in one file:

  ${rel(briefPath)}

Read it in full. Read any file in the repository you need to confirm a finding, but do not edit code,
the plan or walkthrough.md. Write your answers to ${rel(findingsPath)}, in exactly the shape the brief gives,
then reply with the counts (✓ and ✗ per section) and the path.`);
  process.exit(0);
}

const base = flag("base") || die("--base <ref> is required: the commit the implementation started from");
const head = flag("head", "HEAD");
const read = (p) => readFileSync(p, "utf8");
// The plan as implemented is plan.md, the one living document (a revise rewrites it in place); the
// decisions below, from the ledger, carry what the reviews chose. The reviews themselves (reviews/)
// are the record of what was asked, not of the plan.
const planText = read(join(pd, "plan.md"));
const planName = basename(pd);

// the ledger: this plan's own decisions, and the ones it cites as in force
let rp = pd; while (rp !== dirname(rp) && !isRpDirName(basename(rp))) rp = dirname(rp);
const ledger = existsSync(join(rp, "decisions.json")) ? JSON.parse(read(join(rp, "decisions.json"))).decisions || [] : [];
const cited = new Set([...(read(join(pd, "plan.md")).split(/^## Decisions in force/m)[1] || "").split(/^## /m)[0].matchAll(/\bD-\d{3}\b/g)].map((m) => m[0]));
// (a rule folded into spec.md applies when the plan cites its section there, D-306)
const citedSpec = new Set(specCites((read(join(pd, "plan.md")).split(/^## Decisions in force/m)[1] || "").split(/^## /m)[0]));
const applies = ledger.filter((d) => isRule(d) && (d.plan === planName || cited.has(d.id) || citedSpec.has(d.foldedInto)));
// the accepted calls of other plans whose lines this diff changes (lib/call-lines.mjs): history, raised by the diff alone
const touched = await callsTouched(rp, ledger, { repo: execFileSync("git", ["-C", pd, "rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim(), base: flag("base") || "HEAD", head: flag("head", "HEAD"), skipPlan: planName }) || [];

// the autonomy log, as the implementer wrote it: the calls it says it made on its own
const wt = existsSync(join(pd, "walkthrough.md")) ? read(join(pd, "walkthrough.md")) : "";
const log = wt.split("\n").filter((l) => /^\|\s*[ADm]\d+\b/.test(l));   // the calls worth judging (A), deviations (D) and the smaller ones (m); tags ride in brackets at the end of "chose"

const range = `${base}..${head}`;
// paths are the caller's (relative to where the command runs); git gets them from the repo root
const gitRoot = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 64 << 20 });
const scoped = paths.map((p) => rel(resolve(p)));
const stat = gitRoot("diff", "--stat", range, "--", ...scoped).trim();
let diff = gitRoot("diff", "--unified=3", range, "--", ...scoped);
const LIMIT = 400_000;   // --inline-diff only: a diff bigger than this is cut; the checker reads the rest from git
const inline = args.includes("--inline-diff");
const cut = inline && diff.length > LIMIT;
if (cut) diff = diff.slice(0, LIMIT);
const diffCmd = `git diff ${range}${scoped.length ? ` -- ${scoped.join(" ")}` : ""}`;
const commits = gitRoot("log", "--oneline", range, "--", ...scoped).trim();

const brief = `# Code check brief: ${planName}

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to \`${rel(findingsPath)}\`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

\`\`\`
# Code check: ${planName}

## Steps
- Step 1 — ✓ carried by \`path/to/file\`, \`other/file\`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is \`file\`

## Decisions
- D-004 — ✓ holds: \`path/file.mjs\` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: \`path/file.js:120\` counts a record jump as a rewind

## Unexplained
- \`path/file.js\` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
\`\`\`

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: \`Step N\`,
a decision id, or a backticked path.

## Commits (${range}${scoped.length ? `, limited to ${scoped.join(" ")}` : ""})

\`\`\`
${commits || "(none)"}
\`\`\`

## The plan, as implemented

Read \`${rel(join(pd, "plan.md"))}\` in full. Its title is "${(planText.match(/^# (.+)$/m) || [])[1] || planName}", with ${(planText.match(/^### Step \d+/gm) || []).length} steps.

## The decisions that apply

${applies.length ? applies.map((d) => `- **${d.id}** (step ${d.step ?? "?"}) ${d.question} → **${d.chosen}**${d.note ? `\n  - note: ${d.note}` : ""}`).join("\n") : "- none"}

## Earlier calls this diff changes

${touched.length ? `Calls an earlier walkthrough accepted, whose lines (written by that plan's commits) this diff changes. They are history, not rules: give each a line under Decisions, ✓ if it still holds, ✗ if the diff undoes it and no step, decision or autonomy row says so.

${touched.map((x) => `- **${x.d.id}** ${callWords(x).replace(/^D-\d{3}, /, "")} (${Object.entries(x.lines).map(([f, n]) => `${n} line(s) in \`${f}\``).join(", ")})`).join("\n")}` : "- none"}

## The autonomy log (the implementer's own calls)

${log.length ? `| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n${log.join("\n")}` : "_No walkthrough.md yet, or no rows in it._"}

## The diff

Read it yourself: \`${diffCmd}\` (from the repository root). The files it touches:

\`\`\`
${stat}
\`\`\`
${inline ? `\n${cut ? `_Cut at ${LIMIT / 1000}k characters; read the rest with the command above._\n\n` : ""}\`\`\`diff\n${diff}\n\`\`\`\n` : ""}`;
mkdirSync(outDir, { recursive: true });
writeFileSync(briefPath, brief);
const files = stat.split("\n").length - 1;
console.log(`✓ ${rel(briefPath)}: ${applies.length} decision(s), ${touched.length} earlier call(s) whose lines it changes, ${log.length} autonomy row(s), ${files} file(s) changed in ${range}${inline ? " (diff inlined)" : ""}`);
console.log(`next: launch ${freshAgentHow({ repo })}; give it exactly the prompt from \`code-check ${rel(pd)} --prompt\` and nothing else; it writes ${rel(findingsPath)}`);
