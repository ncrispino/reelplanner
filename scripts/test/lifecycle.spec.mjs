#!/usr/bin/env node
// The build half of the lifecycle, against a scratch copy of the media-service example (its walkthrough
// was reviewed for real: A1 flagged, A2–A4 accepted). Nothing under eval/ is modified.
//   walkthrough-scope — sorts the verdicts, carries the reviewer's words onto the flag
//   reel record       — every judged call becomes a ledger entry with its tags, once; only accepted ones are in force;
//                       each review is kept in reviews/ with what to act on beside it
//   reel stops        — a call you'd notice or can't easily undo pauses the walkthrough video; the rest are its list
//                       (calls outside the plan's steps: beaten per ask, by the word in their step column or their own id)
//   reel check        — an accepted call is history: a later plan touching its part is not asked for it (D-306)
//   reel audit        — a report that leaves out where a decision lands fails; once the owner has accepted the
//                       walkthrough, its rule breaks are notes, not failures (D-309)
//   spec-diff         — a spec edit names exactly the system-video frames it affects; a glossary row no beat
//                       of the system video defines makes it behind (`reel status`), by name
//   reel prereqs      — the `before:` lines: the system video's chapter on what the plan's steps say, then the
//                       earlier plans whose decisions it builds on (at most two); the `recap:` lines, one for every
//                       earlier video it builds on, the listed ones included; written into the storyboard's front matter
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, scratchCopy } from "../lib/env.mjs";
import { stopFor, parseCalls, beatsByStep } from "../lib/autonomy.mjs";
import { actOnMarkdown } from "../lib/review-scope.mjs";
import { parseGlossary } from "../lib/terms.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-lifecycle-"));
process.env.REELPLANNER_HOME = join(tmp, "home");   // `reel record` adds a summary to your memory: keep it out of the real home
const rp = join(tmp, ".reelplanner");
scratchCopy(join(ROOT, "eval/projects/media-service/.reelplanning"), rp);   // its video folders are links to videos/: copied, never written through
const pd = join(rp, "plans/2026-09-12-upload-resume");
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
// the walkthrough review, as filed in reviews/ (it was walkthrough-annotations.json before step 9)
const WT = join(pd, "reviews", readdirSync(join(pd, "reviews")).find((f) => /^walkthrough-.*\.json$/.test(f)));
// the what-to-act-on file `reel record` said it wrote
const actOn = (out) => { const m = String(out).match(/(\S+\/reviews\/[^/\s]+)\.json/); return m && existsSync(`${m[1]}.md`) ? readFileSync(`${m[1]}.md`, "utf8") : ""; };
const git = (...a) => execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { stdio: "ignore" });
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

try {
  // tags ride at the end of "chose" (step 8): A1 is visible, A2 close; A3 and A4 stay as written, untagged
  const wt0 = readFileSync(join(pd, "walkthrough.md"), "utf8");
  writeFileSync(join(pd, "walkthrough.md"), wt0.replace("| 16 MB default part size |", "| 16 MB default part size [visible] |").replace("| `complete` returns 409 when parts are missing |", "| `complete` returns 409 when parts are missing [Close] |"));
  const rows = parseCalls(readFileSync(join(pd, "walkthrough.md"), "utf8"));
  ok("tags: read from the end of \"chose\", and a row without them is untagged", rows.map((r) => `${r.id}:${r.tags.join("+")}`).join() === "A1:visible,A2:close,A3:,A4:" && rows[0].chose === "16 MB default part size", JSON.stringify(rows.map((r) => [r.id, r.chose, r.tags])));
  ok("tags: a bracket that holds no tag is the call's own text", parseCalls("| A9 | 1 | keep `[a, b]` | x | y | z |")[0].chose === "keep `[a, b]`" && parseCalls("| D1 | 2 | skip the hook | the plan | y | z |")[0].tags.join() === "deviation");
  const s = run("walkthrough-scope.mjs", pd);
  const scope = JSON.parse(s.out);
  ok("walkthrough-scope: A1 flagged, A2–A4 accepted", scope.fixes.map((f) => f.id).join() === "A1" && scope.accepted.map((a) => a.id).join() === "A2,A3,A4", s.out);
  ok("walkthrough-scope: the reviewer's note rides on the flag, the player's own label does not", scope.fixes[0].comments.length === 1 && /mobile/.test(scope.fixes[0].comments[0].comment), JSON.stringify(scope.fixes[0].comments));
  ok("walkthrough-scope: a flag whose words don't reach a decision is a fix, not a new plan", scope.fixes[0].escalate === false);

  const r1 = run("reel.mjs", "record", pd, WT);
  const ledger = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions;
  const auto = ledger.filter((d) => d.kind === "autonomy");
  ok("reel record: the three accepted calls join the ledger, in force", auto.filter((d) => d.status === "active").map((d) => d.questionId).join() === "autonomy-a2,autonomy-a3,autonomy-a4" && auto.filter((d) => d.status === "active").every((d) => d.verdict === "accept"), r1.out);
  const fl = auto.find((d) => d.questionId === "autonomy-a1");
  ok("reel record: the flagged call is kept too, with its verdict and tags, and is not in force", auto.length === 4 && fl?.status === "flagged" && fl.verdict === "flag" && fl.tags.join() === "visible" && auto.find((d) => d.questionId === "autonomy-a2").tags.join() === "close", JSON.stringify(auto.map((d) => [d.questionId, d.status, d.tags])));
  ok("reel record: decisions.md lists it as flagged", /\| 16 MB default part size, or .*\| \*\*16 MB default part size\*\* \[visible\] \| flagged \|/.test(readFileSync(join(rp, "decisions.md"), "utf8")));
  const md1 = readFileSync(WT.replace(/\.json$/, ".md"), "utf8");
  ok("reel record: what to act on lists the flagged call with the reviewer's words, and the accepted ones", /^- \*\*A1\*\* \(step 2\) flagged: 16 MB default part size$/m.test(md1) && /the reviewer's words \(at 1:00\): "16 MB parts change the retry cost on mobile/.test(md1) && /Accepted \(now in the ledger\): A2, A3, A4\./.test(md1) && !/Flagged: 16 MB/.test(md1), md1);
  run("reel.mjs", "record", pd, WT);
  ok("reel record: recording again adds nothing, and files nothing new", JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions.length === ledger.length && readdirSync(join(pd, "reviews")).length === 4);

  // which calls pause (walkthroughs-that-help step 2): a call you'd notice [visible] or can't easily undo
  // [hard-to-undo] pauses; a close call, or one with no label, goes on the list at the end; an off-plan
  // change always pauses. Accepts no longer fade a label out (D-084's ten in a row is gone).
  const sp1 = run("reel.mjs", "stops", pd);
  ok("reel stops: the call you'd notice pauses; the close one and the unlabelled ones are listed", /A1 +step 2 +pauses +you'd notice it/.test(sp1.out) && /A2 +step 3 +listed +close: on the list/.test(sp1.out) && /A3 +step 4 +listed +no label/.test(sp1.out) && /A4 +step 5 +listed +no label/.test(sp1.out) && /^ {2}the end +- autonomy_list: a2, a3, a4 /m.test(sp1.out), sp1.out);
  const past = (tag, verdict, i) => ({ id: `D-9${String(i).padStart(2, "0")}`, plan: "2026-01-01-earlier", kind: "autonomy", questionId: `autonomy-a${i}`, verdict, tags: [tag], status: verdict === "accept" ? "active" : "flagged", components: [], options: [], question: `x${i}, or y?`, chosen: `x${i}` });
  const L = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8"));
  writeFileSync(join(rp, "decisions.json"), JSON.stringify({ ...L, decisions: [...Array.from({ length: 12 }, (_, i) => past("visible", "accept", i + 1)), ...L.decisions] }, null, 2));
  const sp2 = run("reel.mjs", "stops", pd);
  ok("reel stops: twelve accepts of a label in a row change nothing: the call you'd notice still pauses", /A1 +step 2 +pauses +you'd notice it/.test(sp2.out) && !/in a row/.test(sp2.out), sp2.out);
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(L, null, 2));
  ok("stopFor: a pausing label pauses beside close, close alone is listed, an off-plan change pauses", stopFor({ id: "A5", tags: ["close", "visible"] }).stops === true && stopFor({ id: "A5", tags: ["close", "hard-to-undo"] }).stops === true && stopFor({ id: "A5", tags: ["close"] }).stops === false && stopFor({ id: "d1", tags: [] }).stops === true && stopFor({ id: "A6", tags: [] }).stops === false);

  const c = run("reel.mjs", "check", join(rp, "plans/2026-09-20-part-size-and-sweep"));
  // accepted calls are history (D-306): a later plan touching their part is neither failed nor warned by them
  ok("reel check: accepted calls are history, never asked of the follow-up plan by component", c.code === 0 && !/D-00\d/.test(c.out.split("\n").filter((l) => /^[✗△]/.test(l)).join("\n")) && /0 failure\(s\), 0 warning\(s\)/.test(c.out), c.out);
  // how a plan says what changes, and what each step needs, is advice now (step 9, D-085), not a warning
  ok("reel check: no warning about a missing overview or what each step needs", c.code === 0 && !/What changes/.test(c.out) && !/say what (it|they) need/.test(c.out), c.out);

  const a = run("reel.mjs", "audit", pd);
  ok("reel audit: the hand-written report fails — steps 4 and 5 name no file for their decisions", a.code === 1 && /D-002.*step 4/.test(a.out) && /D-003.*step 5/.test(a.out), a.out);
  const wt = readFileSync(join(pd, "walkthrough.md"), "utf8")
    .replace(/(### Step 4[^\n]*\n)/, "$1Keyed on the server id: `src/billing/charge.ts`.\n")
    .replace(/(### Step 5[^\n]*\n)/, "$1The 24 hours is `SWEEP_AFTER` in `src/upload/sweep.ts`.\n");
  writeFileSync(join(pd, "walkthrough.md"), wt);
  const a2 = run("reel.mjs", "audit", pd);
  ok("reel audit: passes once each decision's step names its file", a2.code === 0, a2.out);
  // the second agent's findings: every ✗ must be answered in walkthrough.md's "## Code check"
  mkdirSync(join(pd, "code-check"), { recursive: true });
  writeFileSync(join(pd, "code-check", "findings.md"), "# Code check\n\n## Steps\n- Step 1 — ✓ carried by `migrations/0042.sql`\n- Step 6 — ✗ the Go SDK has no resume\n\n## Decisions\n- none\n\n## Unexplained\n- `src/upload/sweep.ts` — ✗ pauses 200 ms between batches; no row covers it\n");
  const a3 = run("reel.mjs", "audit", pd);
  ok("reel audit: a code-check ✗ that walkthrough.md does not answer fails", a3.code === 1 && /Step 6/.test(a3.out) && /sweep\.ts/.test(a3.out), a3.out);
  writeFileSync(join(pd, "walkthrough.md"), readFileSync(join(pd, "walkthrough.md"), "utf8") + "\n## Code check\n\n- Step 6: already a known gap (Not done).\n- `src/upload/sweep.ts`: the pause is A4's batching; A4's row now says so.\n");
  const a4 = run("reel.mjs", "audit", pd);
  ok("reel audit: passes once each ✗ is answered", a4.code === 0, a4.out);
  ok("reel audit: four calls, no warning about how many", !/ calls; step /.test(a4.out), a4.out);
  // fewer-better-stops step 3: past 12 calls in the whole walkthrough, a warning (not a failure), naming
  // the busiest step, even when no step reaches five; and step 1: `reel stops` prints the beats by step,
  // a step's calls that stop on one beat, a deviation on a beat of its own
  const wt13 = readFileSync(join(pd, "walkthrough.md"), "utf8");
  const extra = Array.from({ length: 9 }, (_, i) => `| A${i + 5} | ${[1, 1, 1, 2, 3, 3, 4, 6, 6][i]} | extra call ${i + 5} [close] | another | why | \`src/x${i}.ts\` |`).join("\n") + "\n| D1 | 2 | left the retry out [deviation] | the plan's retry | later | `src/retry.ts` |";
  writeFileSync(join(pd, "walkthrough.md"), wt13.replace(/(\| A4 \|[^\n]*\n)/, `$1${extra}\n`));
  const a5 = run("reel.mjs", "audit", pd);
  ok("reel audit: 14 calls, none of its steps at five, warns and still passes — \"14 calls; step 1 has 3\" (the lowest step on a tie)", a5.code === 0 && /△ 14 calls; step 1 has 3\. Past 12/.test(a5.out), a5.out);
  const sp4 = run("reel.mjs", "stops", pd);
  ok("reel stops: the pauses by step — an off-plan change keeps its own — then one list at the end, in step order", /^ {2}step 2 +- autonomy: a1$/m.test(sp4.out) && /^ {12}- autonomy: d1 {3}\(an off-plan change: a pause of its own\)$/m.test(sp4.out) && !/^ {2}step 1 /m.test(sp4.out) && /^ {2}the end +- autonomy_list: a5, a6, a7, a8, a2, a9, a10, a3, a11, a4, a12, a13 /m.test(sp4.out) && /The video pauses 2 time\(s\) for what you'd notice or can't easily undo, and once at the end for the list/.test(sp4.out), sp4.out);
  // D-110: a step at five choices with no question about it in plan.md fails; a "(step 1)" question passes it
  const wt5 = readFileSync(join(pd, "walkthrough.md"), "utf8"), plan5 = readFileSync(join(pd, "plan.md"), "utf8");
  const two = [20, 21].map((n) => `| A${n} | 1 | extra call ${n} [close] | another | why | \`src/y${n}.ts\` |`).join("\n");
  writeFileSync(join(pd, "walkthrough.md"), wt5.replace(/(\| A4 \|[^\n]*\n)/, `$1${two}\n`));
  // D-001 is this plan's answered question on step 1; lift it off the step for these checks (put back below)
  const base5 = readFileSync(join(rp, "decisions.json"), "utf8"), off1 = JSON.parse(base5);
  for (const d of off1.decisions) if (d.plan === "2026-09-12-upload-resume" && d.step === 1) d.step = null;
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(off1, null, 2));
  const ledger5 = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")), has110 = ledger5.decisions.some((d) => d.id === "D-110");
  const a6 = run("reel.mjs", "audit", pd);
  ok("reel audit: a step with five choices and no question about it fails, naming them (D-110)", a6.code === 1 && /✗ step 1 has 5 choices \(A5, A6, A7, A20, A21\) and no question about it was asked/.test(a6.out), a6.out);
  // D-309: a walkthrough the owner has accepted is settled history. Its rule breaks are notes (△), never
  // failures; one not yet accepted (here: A1 flagged, fixes to make) is held to every rule, as a6 just was
  ok("reel audit: a walkthrough not yet accepted is held to every rule (fixes to make: no note of acceptance)", a6.code === 1 && !/so not a failure|settled history/.test(a6.out), a6.out);
  const accRev = join(pd, "reviews", "walkthrough-20260930T120000Z.json");
  writeFileSync(accRev, JSON.stringify({ version: 1, project: "walkthrough-video", src: "w1-upload-resume/index.html", source: "conversation", by: "owner", said: "accept it as it is",
    submittedAt: "2026-09-30T12:00:00.000Z", verdict: "approve", annotations: [], autonomy: [{ id: "a1", verdict: "accept", planStep: 2, chose: "16 MB default part size" }], decisions: [], quizzes: [], questions: [] }, null, 2));
  const a6s = run("reel.mjs", "audit", pd);
  ok("reel audit: the same five choices, once the walkthrough is accepted, are a note (△), not a failure, and it passes (D-309)",
    a6s.code === 0 && /^△ \(accepted on 2026-09-30, so not a failure\) step 1 has 5 choices \(A5, A6, A7, A20, A21\)/m.test(a6s.out) && !/^✗/m.test(a6s.out)
    && /✓ 2026-09-12-upload-resume: .* 0 failure\(s\); 1 rule break\(s\) kept as notes: this walkthrough was accepted on 2026-09-30, so it is settled history/.test(a6s.out), a6s.out);
  // a contributor's acceptance settles nothing in a repo that lists its maintainers: held to every rule again
  writeFileSync(join(rp, "config.json"), JSON.stringify({ maintainers: ["id:the-maintainer"] }, null, 2));
  writeFileSync(accRev, readFileSync(accRev, "utf8").replace('"by": "owner"', '"by": "id:a-contributor"'));
  const a6c = run("reel.mjs", "audit", pd);
  ok("reel audit: a walkthrough a contributor accepted is held to every rule, and says why", a6c.code === 1 && /^✗ step 1 has 5 choices/m.test(a6c.out) && /△ accepted by a contributor, not one of config\.json's maintainers/.test(a6c.out), a6c.out);
  rmSync(join(rp, "config.json")); rmSync(accRev);
  const qs = /^## Open questions[^\n]*\n/m.test(plan5) ? plan5.replace(/^(## Open questions[^\n]*\n\n?)/m, "$1") : `${plan5.trimEnd()}\n\n## Open questions for the reviewer\n\n`;
  writeFileSync(join(pd, "plan.md"), qs.replace(/^(## Open questions[^\n]*\n\n?)/m, "$11. **Which retry policy should uploads use?** (step 1)\n- **A · Three tries.** Then fail.\n- **B · Forever.** With backoff.\n\n"));
  const a7 = run("reel.mjs", "audit", pd);
  ok("reel audit: the same five choices pass once plan.md asks a question \"(step 1)\"", a7.code === 0 && !/step 1 has 5 choices/.test(a7.out), a7.out);
  // a question already answered for step 1 (in the decision log, out of plan.md's open questions) counts too
  const led1 = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")), orig1 = JSON.stringify(led1, null, 2);
  led1.decisions.push({ id: "D-999", date: "2026-09-12", plan: "2026-09-12-upload-resume", step: 1, question: "Which retry policy?", chosen: "Three tries", options: [], kind: "decision", status: "active", components: [] });
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led1, null, 2)); writeFileSync(join(pd, "plan.md"), plan5);
  const a7b = run("reel.mjs", "audit", pd);
  ok("reel audit: five choices pass when step 1's question was already answered (in the decision log)", !/step 1 has 5 choices/.test(a7b.out), a7b.out);
  writeFileSync(join(rp, "decisions.json"), orig1);
  // calls outside the plan's steps (the owner's asks during the build, "zoom", "band") are counted per ask,
  // not lumped together as one step "?": four and three pass; an ask at five only warns (asked of the owner)
  const wtAsk = readFileSync(join(pd, "walkthrough.md"), "utf8");
  const askRows = (w, ns) => ns.map((n) => `| A${n} | ${w} | ${w} call ${n} [visible] | another | why | \`src/${w}${n}.ts\` |`).join("\n");
  writeFileSync(join(pd, "plan.md"), qs.replace(/^(## Open questions[^\n]*\n\n?)/m, "$11. **Which retry policy should uploads use?** (step 1)\n- **A · Three tries.** Then fail.\n- **B · Forever.** With backoff.\n\n"));
  writeFileSync(join(pd, "walkthrough.md"), `${wtAsk.trimEnd()}\n\n| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n${askRows("zoom", [30, 31, 32, 33])}\n${askRows("band", [40, 41, 42])}\n`);
  const a7c = run("reel.mjs", "audit", pd);
  ok("reel audit: the owner's asks outside the steps are counted per ask (4 zoom + 3 band pass)", a7c.code === 0 && !/step \? has/.test(a7c.out), a7c.out);
  // `reel stops` beats them the same way: each ask its own line, named by its word; a call whose step
  // column names no ask ("—", "ask") is an ask of its own, named by its id; the steps keep their beats
  writeFileSync(join(pd, "walkthrough.md"), `${readFileSync(join(pd, "walkthrough.md"), "utf8").trimEnd()}\n| A50 | — | dash call [visible] | another | why | \`src/d.ts\` |\n| A51 | ask | ask call | another | why | \`src/e.ts\` |\n`);
  const spa = run("reel.mjs", "stops", pd);
  ok("reel stops: calls outside the steps are beaten per ask, by its word or its own id, never \"step ?\"",
    !/step \?/.test(spa.out) && /^A30 +ask zoom +pauses /m.test(spa.out) && /^A50 +ask A50 +pauses /m.test(spa.out) && /^A51 +ask A51 +listed /m.test(spa.out)
    && /^ {2}ask zoom +- autonomy: a30, a31, a32, a33 {3}\(4 calls share this pause\)$/m.test(spa.out) && /^ {2}ask band +- autonomy: a40, a41, a42 /m.test(spa.out)
    && /^ {2}ask A50 +- autonomy: a50$/m.test(spa.out) && /^ {2}the end +- autonomy_list: [^\n]*\ba51 /m.test(spa.out) && /^ {2}step 2 +- autonomy: a1$/m.test(spa.out)
    && /^ {2}step 2 [^\n]*\n(?: {6,}[^\n]*\n)*? {2}ask zoom /m.test(spa.out.split("The beats")[1]) && /in \d+ stop beat\(s\) \(one per step or ask\)/.test(spa.out), spa.out);
  const bs = beatsByStep(parseCalls("| A1 | 2 | x [close] | y | z | w |\n| A2 | zoom | x [close] | y | z | w |\n| D1 | — | x | y | z | w |\n| A3 | zoom | x | y | z | w |\n| A4 | — | x | y | z | w |\n").map((c) => ({ c, stops: c.tags.length > 0 })));
  ok("beatsByStep: the steps first, then each ask in table order, a dash's calls each on their own", bs.map((b) => `${b.place}:${b.stop.join("+")}/${b.deviations.join("+")}/${b.grouped.join("+")}`).join(" ") === "step 2:a1// ask zoom:a2//a3 ask D1:/d1/ ask A4://a4", JSON.stringify(bs));
  writeFileSync(join(pd, "walkthrough.md"), `${wtAsk.trimEnd()}\n\n| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n${askRows("zoom", [30, 31, 32, 33, 34])}\n`);
  const a7d = run("reel.mjs", "audit", pd);
  ok("reel audit: an ask outside the steps at its fifth call warns, naming it", a7d.code === 0 && /△ "zoom" \(outside the plan's steps\) has 5 choices/.test(a7d.out), a7d.out);
  writeFileSync(join(pd, "walkthrough.md"), wtAsk);
  // a plan dated before D-110 was not bound by it: a warning, not a failure
  writeFileSync(join(pd, "plan.md"), plan5);
  if (!has110) ledger5.decisions.push({ id: "D-110", date: "2026-09-25", plan: "2026-09-25-fewer-better-stops", question: "A step reaches its fifth call", chosen: "Asks before going on", options: [], kind: "decision", status: "active", components: [] });
  else ledger5.decisions.find((d) => d.id === "D-110").date = "2026-09-25";
  const orig5 = readFileSync(join(rp, "decisions.json"), "utf8"); writeFileSync(join(rp, "decisions.json"), JSON.stringify(ledger5, null, 2));
  const a8 = run("reel.mjs", "audit", pd);
  ok("reel audit: a plan dated before D-110 only warns about a step's five choices", a8.code === 0 && /△ \(before D-110, so not a failure\) step 1 has 5 choices/.test(a8.out), a8.out);
  writeFileSync(join(rp, "decisions.json"), base5);
  writeFileSync(join(pd, "walkthrough.md"), wt13);

  // spec-diff: a system video tagged by spec section and part; change one of each
  mkdirSync(join(rp, "system-video"), { recursive: true });
  writeFileSync(join(rp, "system-video/index.html"), "<!-- built -->\n");
  const spec = readFileSync(join(rp, "spec.md"), "utf8");
  const firstHeading = spec.match(/^## (.+)$/m)[1];
  writeFileSync(join(rp, "system-video/STORYBOARD.md"), `---\n---\n## Frame 1 — Why it exists\n- spec_section: ${firstHeading}\n\n## Frame 2 — The sweeper\n- components: sweeper\n\n## Frame 3 — The SDK\n- components: sdk\n`);
  git("init", "-q"); git("add", "-A"); git("commit", "-qm", "base");
  writeFileSync(join(rp, "spec.md"), spec.replace(/^(## .+\n)/m, "$1\nOne more sentence about it.\n"));
  const sys = JSON.parse(readFileSync(join(rp, "system.json"), "utf8"));
  sys.components.find((x) => x.id === "sweeper").files = ["src/upload/sweep.ts", "src/upload/sweep-batch.ts"];
  writeFileSync(join(rp, "system.json"), JSON.stringify(sys, null, 2));
  const d = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("spec-diff: names the spec section and the part that changed, and only those frames", d.frames.map((f) => f.frame).join() === "1,2" && d.sections.changed.includes(firstHeading) && d.components.changed.join() === "sweeper", JSON.stringify(d.frames));
  const st = run("reel.mjs", "status", tmp);
  ok("reel status: says the system video is behind", /behind spec\.md, system\.json/.test(st.out), st.out);
  // rendering the video to MP4 afterwards is not rebuilding it: it must still read as behind, and
  // spec-diff must still compare against the last real build (the dates keep the commits apart)
  const at = (secs) => ({ ...process.env, GIT_AUTHOR_DATE: `@${secs} +0000`, GIT_COMMITTER_DATE: `@${secs} +0000` });
  const base = Number(execFileSync("git", ["-C", tmp, "log", "-1", "--format=%ct"], { encoding: "utf8" }).trim());
  execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qam", "spec"], { stdio: "ignore", env: at(base + 10) });
  mkdirSync(join(rp, "system-video/renders/chapters"), { recursive: true });
  writeFileSync(join(rp, "system-video/renders/chapters/ch1.mp4"), "mp4");
  writeFileSync(join(rp, "system-video/.gitignore"), "renders/*\n!renders/chapters/\n");
  git("add", "-A"); git("add", "-f", join(rp, "system-video/renders/chapters/ch1.mp4"));   // init's .gitignore leaves renders out (D-305): added by hand
  execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "render"], { stdio: "ignore", env: at(base + 20) });
  const st2 = run("reel.mjs", "status", tmp), d2 = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("reel status: a committed render is not a rebuild, so the video is still behind", /behind spec\.md, system\.json/.test(st2.out) && d2.frames.map((f) => f.frame).join() === "1,2", `${st2.out} ${JSON.stringify(d2.frames)}`);

  // videos-you-can-follow step 1: every glossary row is a promise the system video keeps. A row no beat
  // defines makes the video behind, however recent its build, and spec-diff names the row; the beat that
  // defines a row whose meaning changes is a frame to rebuild
  const gl = readFileSync(join(rp, "glossary.md"), "utf8"), rowKeys = parseGlossary(gl).map((g) => g.forms[0]);
  const sb3 = (defs) => `---\nkind: system\n---\n## Frame 1 — Why it exists\n- spec_section: ${firstHeading}\n- defines: ${defs.join(", ")}\n\n## Frame 2 — The sweeper\n- components: sweeper\n\n## Frame 3 — The SDK\n- components: sdk\n`;
  writeFileSync(join(rp, "system-video/STORYBOARD.md"), sb3(rowKeys.filter((k) => k !== "billing")));
  git("add", "-A"); execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "rebuilt"], { stdio: "ignore", env: at(base + 30) });
  const st3 = run("reel.mjs", "status", tmp), d3 = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("reel status: a glossary row no beat of the system video defines makes it behind, by name, though just built", /△ the system video is behind glossary\.md: no beat explains billing/.test(st3.out) && JSON.stringify(d3.undefined) === '["billing"]', `${st3.out.split("\n").filter((l) => /system video/.test(l)).join(" ")} ${JSON.stringify(d3.undefined)}`);
  writeFileSync(join(rp, "system-video/STORYBOARD.md"), sb3(rowKeys));
  git("add", "-A"); execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "billing defined"], { stdio: "ignore", env: at(base + 40) });
  ok("reel status: once a beat defines it, the system video is current", /✓ the system video is current/.test(run("reel.mjs", "status", tmp).out));
  // D-216: the glossary's "Other words" are meanings only; a row added there leaves the system video current
  writeFileSync(join(rp, "glossary.md"), gl + "\n## Other words\n\n| Term | id | Meaning | Also called | On screen |\n|---|---|---|---|---|\n| A repo | — | A project's folder of code and its history | | |\n| A pull request / PR | — | A change someone asks to have merged | | |\n");
  const st6 = run("reel.mjs", "status", tmp), d6 = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("an \"Other words\" row (D-216): the system video stays current; spec-diff lists it apart, as no word the video must explain", /✓ the system video is current/.test(st6.out) && d6.other.added.join() === "repo,pull request" && !d6.glossary.added.length && !d6.undefined.length && !d6.frames.length, `${st6.out.split("\n").filter((l) => /system video/.test(l)).join(" ")} ${JSON.stringify({ o: d6.other, g: d6.glossary, u: d6.undefined })}`);
  writeFileSync(join(rp, "glossary.md"), gl);
  writeFileSync(join(rp, "glossary.md"), gl + "| A sweep | — | deleting the manifests of uploads abandoned for 24 hours | |\n");
  const st4 = run("reel.mjs", "status", tmp), d4 = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("a new glossary row: status says behind and names it; spec-diff lists it as a word no beat explains", /behind glossary\.md: no beat explains sweep/.test(st4.out) && d4.glossary.added.join() === "sweep" && JSON.stringify(d4.undefined) === '["sweep"]', `${st4.out.split("\n").filter((l) => /system video/.test(l)).join(" ")} ${JSON.stringify(d4.undefined)} ${JSON.stringify(d4.glossary)}`);
  writeFileSync(join(rp, "glossary.md"), gl.replace("| the hook that charges a customer once per completed upload |", "| the hook that charges a customer once for each upload that completes |"));
  const d5 = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
  ok("spec-diff: a row whose meaning changed names the beat that defines it", d5.glossary.changed.join() === "billing" && d5.frames.some((f) => f.frame === 1 && f.why.includes("word: billing")), JSON.stringify(d5));
  writeFileSync(join(rp, "glossary.md"), gl);

  // videos-you-can-follow step 2: `reel prereqs` picks what to watch first
  const PS = join(rp, "plans/2026-09-20-part-size-and-sweep");
  writeFileSync(join(rp, "system-video/STORYBOARD.md"), `---\nkind: system\n---\n## Frame 1 — Why\n- chapter_start: Why it exists\n- voiceover: "Uploads fail on phones, and a resume keeps what already landed."\n- components: api\n\n## Frame 2 — Parts\n- chapter_start: Parts and the sweep\n- voiceover: "Every part is written with its part size from the manifest; the sweeper deletes abandoned manifests in batches."\n- components: sweeper, manifest\n`);
  const pq = run("reel.mjs", "prereqs", PS, "--dry-run");
  ok("reel prereqs: the system video's chapter that says what the plan's steps say, then the plan whose decisions it builds on", pq.code === 0 && /^ {2}before: system#part 2 \| parts and the sweep/m.test(pq.out) && !/system#part 1/.test(pq.out) && /^ {2}before: 2026-09-12-upload-resume \| decisions D-001, D-002, D-003: where does the manifest live\?$/m.test(pq.out), pq.out);
  ok("…and with --dry-run, writes nothing (no storyboard yet either)", !existsSync(join(PS, "video", "STORYBOARD.md")), pq.out);
  mkdirSync(join(PS, "video"), { recursive: true });
  writeFileSync(join(PS, "video", "STORYBOARD.md"), `---\ntitle: "Part size"\nbefore: system | a guess\n---\n\n## Frame 1 — x\n- voiceover: "x"\n`);
  const pw = run("reel.mjs", "prereqs", PS), fmw = readFileSync(join(PS, "video", "STORYBOARD.md"), "utf8").split("---")[1];
  ok("reel prereqs: writes the lines into the storyboard's front matter, replacing the ones there", pw.code === 0 && /2 `before:` line\(s\) and 1 `recap:` line\(s\) written/.test(pw.out) && !/a guess/.test(fmw) && /^before: system#part 2 \| /m.test(fmw) && /^before: 2026-09-12-upload-resume \| /m.test(fmw) && /^title: "Part size"$/m.test(fmw), pw.out + fmw);
  ok("reel prereqs: the recap scene sums up the video it builds on too, listed or not — one `recap:` line, with its plan's title", /^ {2}recap: 2026-09-12-upload-resume \| [^|]+: decisions D-001, D-002, D-003: where does the manifest live\?$/m.test(pq.out) && /^recap: 2026-09-12-upload-resume \| /m.test(fmw) && (fmw.match(/^recap:/gm) || []).length === 1, pq.out + fmw);
  // the owner's review of videos-you-can-follow (quick check k2): a plan that builds on five earlier videos lists
  // the two it builds on most, to watch first; the recap scene sums up all five, those two included, one line each
  const extraPlans = ["2026-09-01-alpha", "2026-09-02-beta", "2026-09-03-gamma", "2026-09-04-delta"];
  const led = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")), psPlan = readFileSync(join(PS, "plan.md"), "utf8");
  extraPlans.forEach((pl, i) => {
    mkdirSync(join(rp, "plans", pl, "video"), { recursive: true });
    writeFileSync(join(rp, "plans", pl, "plan.md"), `# Plan ${pl.slice(11)}\n\n## The problem\n\nx\n`);
    writeFileSync(join(rp, "plans", pl, "video", "STORYBOARD.md"), "---\n---\n\n## Frame 1 — x\n- voiceover: \"x\"\n");
    led.decisions.push({ ...led.decisions[0], id: `D-20${i}`, plan: pl, question: `What does ${pl.slice(11)} decide?` });
  });
  writeFileSync(join(rp, "decisions.json"), JSON.stringify(led, null, 2));
  writeFileSync(join(PS, "plan.md"), psPlan.replace("## Supersedes", `${extraPlans.map((pl, i) => `- D-20${i} from ${pl.slice(11)}.`).join("\n")}\n\n## Supersedes`));
  const pm = run("reel.mjs", "prereqs", PS), fmm = readFileSync(join(PS, "video", "STORYBOARD.md"), "utf8").split("---")[1];
  const befores = (fmm.match(/^before: .+$/gm) || []).filter((l) => !/^before: system/.test(l)), recaps = fmm.match(/^recap: .+$/gm) || [];
  ok("reel prereqs: five earlier videos — at most two on the card, and a recap line for each of the five, the two on the card included", pm.code === 0 && befores.length === 2 && recaps.length === 5 && befores.every((b) => recaps.some((r) => r.startsWith(`recap: ${b.slice(8).split(" | ")[0]} | `))) && ["2026-09-12-upload-resume", ...extraPlans].every((v) => recaps.some((r) => r.startsWith(`recap: ${v} | `))) && /sums up all 5 earlier videos it builds on, the 2 listed above included/.test(pm.out) && /^recap: 2026-09-03-gamma \| Plan gamma: decision D-202: what does gamma decide\?$/m.test(fmm), pm.out + fmm);
  writeFileSync(join(rp, "decisions.json"), JSON.stringify({ ...led, decisions: led.decisions.filter((d) => !/^D-20\d$/.test(d.id)) }, null, 2)); writeFileSync(join(PS, "plan.md"), psPlan);
  for (const pl of extraPlans) rmSync(join(rp, "plans", pl), { recursive: true, force: true });

  // a missed quick check sends the step it tests to the revise, with what was answered
  const rsq = JSON.parse(run("revise-scope.mjs", pd, WT).out);
  ok("revise-scope: a missed quick check sends its step to the revise, with the wrong answer", rsq.steps.some((s) => s.step === 4 && s.reasons.some((r) => r.kind === "quiz-missed" && /answered/.test(r.comment))) && !rsq.steps.some((s) => s.reasons.some((r) => r.id === "quiz-k1")), JSON.stringify(rsq.steps));

  // an answer in the reviewer's own words is a change to make, carrying those words, never an accept
  const annOwn = JSON.parse(readFileSync(WT, "utf8"));
  const ownV = annOwn.autonomy.find((v) => String(v.id).toLowerCase() === "a2");
  Object.assign(ownV, { verdict: "own", own: "keep the 409, but say which parts are missing in the body" });
  writeFileSync(join(tmp, "own.json"), JSON.stringify(annOwn));
  const own = JSON.parse(run("walkthrough-scope.mjs", pd, join(tmp, "own.json")).out);
  const f2 = own.fixes.find((f) => f.id === "A2");
  ok("walkthrough-scope: an own-words answer is a fix, with the reviewer's words as its instruction", f2 && f2.verdict === "own" && /which parts are missing/.test(f2.comments[0]?.comment) && !own.accepted.some((a) => a.id === "A2"), JSON.stringify(own.fixes));
  // recorded, an own-words answer on a call accepted before replaces that decision, and is not in force itself
  const ro = run("reel.mjs", "record", pd, join(tmp, "own.json"));
  const a2s = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions.filter((d) => d.questionId === "autonomy-a2");
  ok("reel record: an own-words verdict is kept as \"own\", with the words, and the accept it replaces is superseded", a2s.length === 2 && a2s[0].status === "superseded" && a2s[0].supersededBy === a2s[1].id && a2s[1].status === "own" && /which parts are missing/.test(a2s[1].own) && a2s[1].tags.join() === "close", ro.out + JSON.stringify(a2s));
  const c3 = run("reel.mjs", "check", join(rp, "plans/2026-09-20-part-size-and-sweep"));
  ok("reel check: flagged and own entries are not decisions in force", c3.code === 0 && !/D-\d+ \(16 MB default part size\)/.test(c3.out) && !/409 when parts are missing\) — an accepted/.test(c3.out), c3.out);
  const wr = actOn(ro.out);
  ok("reel record: the same moment, other content, is another review, filed beside the first", /walkthrough-20260922T163945Z-2\.json/.test(ro.out) && existsSync(WT), ro.out);
  ok("what to act on: an own-words answer is a call to fix, with the words, not an accept", /^- \*\*A2\*\* \(step 3\) answered in the reviewer's own words: /m.test(wr) && /the reviewer's words: "keep the 409, but say which parts are missing/.test(wr) && !/Accepted \(now in the ledger\): [^\n]*A2/.test(wr), wr);

  // "Expected something else? Say how it should work" on a quick check: the reviewer's words, counted
  // like a comment on the step it tests, a fix in the walkthrough, and quoted in the resolved report
  const annQ = JSON.parse(readFileSync(WT, "utf8"));
  annQ.quizzes.find((q) => q.id === "k2").note = "a retry after a crash should reuse the manifest, so it is one charge";
  writeFileSync(join(tmp, "disagree.json"), JSON.stringify(annQ));
  const rsd = JSON.parse(run("revise-scope.mjs", pd, join(tmp, "disagree.json")).out);
  const why = rsd.steps.find((s) => s.step === 4)?.reasons || [];
  const dq = why.find((r) => r.kind === "quiz-disagree");
  ok("revise-scope: a quick check with a note puts its step in scope with the reviewer's words, not as a miss", dq && dq.quiz === "k2" && dq.answer === "1" && dq.expected === "2" && /reuse the manifest/.test(dq.text) && /reuse the manifest/.test(dq.comment) && !why.some((r) => r.kind === "quiz-missed"), JSON.stringify(why));
  const wsd = JSON.parse(run("walkthrough-scope.mjs", pd, join(tmp, "disagree.json")).out);
  const fk = wsd.fixes.find((f) => f.kind === "quiz-disagree");
  ok("walkthrough-scope: a disagreed quick check is a fix, its words the instruction", fk && fk.id === "K2" && fk.step === 4 && fk.comments.length === 1 && /reuse the manifest/.test(fk.comments[0].comment) && wsd.fixes.some((f) => f.id === "A1"), JSON.stringify(wsd.fixes));
  const wmap = JSON.parse(readFileSync(join(pd, "walkthrough-video", "plan-map.json"), "utf8")), wtText = readFileSync(join(pd, "walkthrough.md"), "utf8");
  const wrd = actOnMarkdown({ id: "x", kind: "walkthrough", review: annQ, planName: "2026-09-12-upload-resume", map: wmap, wt: wtText });
  ok("what to act on: the reviewer's words on a quick check are quoted, and it is not read as a miss", /## Quick checks disagreed with\n\n- \*\*K2\*\* \(step 4\)[^\n]*\n  - the reviewer's words: "a retry after a crash/.test(wrd) && !/quick check missed: "A client crashes/.test(wrd), wrd);
  const prd = actOnMarkdown({ id: "x", kind: "plan", review: annQ, planName: "2026-09-12-upload-resume", map: wmap });
  ok("what to act on, a plan review: a disagreed quick check is listed with the reviewer's words", /## Quick checks disagreed with[\s\S]*\*\*K2\*\* \(step 4\)[\s\S]*the reviewer's words: "a retry after a crash/.test(prd), prd);
  // a review with no calls at all, only a disagreed quick check, still reaches walkthrough-scope through reel record
  writeFileSync(join(tmp, "only-quiz.json"), JSON.stringify({ ...annQ, autonomy: [], annotations: [] }));
  const rq = run("reel.mjs", "record", pd, join(tmp, "only-quiz.json"));
  const mq = actOn(rq.out);
  ok("reel record: a disagreed quick check alone is filed as a walkthrough review, the check to act on", rq.code === 0 && /a walkthrough review/.test(rq.out) && /## Quick checks disagreed with\n\n- \*\*K2\*\*/.test(mq) && !/## Calls to fix/.test(mq), rq.out + mq);

  // A plan video's review after the plan was built (a new round) is the plan's, even with a quick check
  // in it: plan videos ask them too. It must not land on the walkthrough's record.
  const round = { src: "2026-09-12-upload-resume/index.html", exportedAt: "2026-09-25T10:00:00.000Z", verdict: "approve", annotations: [], decisions: [], quizzes: [{ id: "k1", answer: "b", correct: true, t: 10 }], autonomy: [] };
  writeFileSync(join(tmp, "round2.json"), JSON.stringify(round));
  const n0 = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions.length, files0 = readdirSync(join(pd, "reviews")).length;
  const rr = run("reel.mjs", "record", pd, join(tmp, "round2.json"));
  ok("reel record: a plan video's review with a quick check is filed as a plan review, beside the walkthrough's, which stay", rr.code === 0 && existsSync(join(pd, "reviews", "plan-20260925T100000Z.json")) && existsSync(join(pd, "reviews", "plan-20260925T100000Z.md")) && readdirSync(join(pd, "reviews")).length === files0 + 2 && existsSync(WT) && JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions.length === n0, rr.out);

  // walkthroughs-that-help step 2 (D-221): the list. On a fresh copy: A1 pauses, A2-A4 are the list at the end.
  // A2 left on the list is "listed, not judged" (the player's Go on); A3 flagged there is a fix like any flag; A4,
  // never reached, is listed too, since Approve takes the rest. Listed entries are not in force: a later plan
  // touching them is not warned by them.
  const rp2 = join(tmp, "list", ".reelplanner"); scratchCopy(join(ROOT, "eval/projects/media-service/.reelplanning"), rp2);
  const pd2 = join(rp2, "plans/2026-09-12-upload-resume");
  writeFileSync(join(pd2, "walkthrough.md"), readFileSync(join(pd2, "walkthrough.md"), "utf8").replace("| 16 MB default part size |", "| 16 MB default part size [visible] |"));
  const lmap = JSON.parse(readFileSync(join(pd2, "walkthrough-video", "plan-map.json"), "utf8"));
  const lcalls = parseCalls(readFileSync(join(pd2, "walkthrough.md"), "utf8"));
  lmap.autonomy = (lmap.autonomy || []).filter((a) => String(a.id).toLowerCase() === "a1"); const endAt = lmap.totalSeconds - 1;
  lmap.autonomyGroups = [{ id: "list-99", list: true, frameIndex: lmap.frames.at(-1).index, planStep: null, ids: ["a2", "a3", "a4"], calls: lcalls.filter((c) => ["a2", "a3", "a4"].includes(c.key)).map((c) => ({ id: c.key, planStep: c.step, chose: c.chose, insteadOf: c.insteadOf })), at: endAt }];
  writeFileSync(join(pd2, "walkthrough-video", "plan-map.json"), JSON.stringify(lmap));
  const lrev = { src: "w/index.html", exportedAt: "2026-09-28T10:00:00.000Z", verdict: "approve", annotations: [{ id: "f1", kind: "flag", t: endAt, comment: `Flagged: ${lcalls[2].chose}`, plan: { step: lcalls[2].step } },
      { id: "o1", kind: "note", open: true, about: "Seeing it run, anything you'd change?", t: endAt, comment: "retry the upload once more before failing", plan: { step: null } }], decisions: [], quizzes: [],
    autonomy: [{ id: "a1", verdict: "accept", t: 50, planStep: 2, chose: lcalls[0].chose }, { id: "a2", verdict: "listed", t: endAt, planStep: lcalls[1].step, chose: lcalls[1].chose }, { id: "a3", verdict: "flag", t: endAt, planStep: lcalls[2].step, chose: lcalls[2].chose }] };
  writeFileSync(join(tmp, "list", "walkthrough-annotations.json"), JSON.stringify(lrev));
  const lr = run("reel.mjs", "record", pd2, join(tmp, "list", "walkthrough-annotations.json"));
  const lled = JSON.parse(readFileSync(join(rp2, "decisions.json"), "utf8")).decisions.filter((d) => d.kind === "autonomy" && d.date === "2026-09-28");
  const lst = Object.fromEntries(lled.map((d) => [d.questionId, d.status]));
  ok("reel record, the list: left on it is listed, not judged; flagged there is a fix; never reached, Approve lists it", lst["autonomy-a1"] === "active" && lst["autonomy-a2"] === "listed" && lst["autonomy-a3"] === "flagged" && lst["autonomy-a4"] === "listed" && lled.find((d) => d.questionId === "autonomy-a2").verdict === "listed", `${JSON.stringify(lst)}\n${lr.out}`);
  const lmd = actOn(lr.out);
  ok("what to act on, the list: the flag is a call to fix; the listed ones are named, and not as accepted", /^- \*\*A3\*\* \(step \d\) flagged:/m.test(lmd) && /Accepted \(now in the ledger\): A1\. Listed, not judged[^:]*: A2, A4\./.test(lmd) && !/Never judged/.test(lmd), lmd);
  ok("what to act on: the walkthrough's open question, answered in the reviewer's words, under its own heading (step 3)", /## Seeing it run\n\n- their answer to "Seeing it run, anything you'd change\?": "retry the upload once more before failing": act on it/.test(lmd) && !/Not on a step/.test(lmd), lmd);
  ok("decisions.md: a listed entry says so, and is not in force", /\| listed \|/.test(readFileSync(join(rp2, "decisions.md"), "utf8")) && /listed, not judged, not in force/.test(lr.out), lr.out);
  const lscope = actOnMarkdown({ id: "y", kind: "walkthrough", review: { ...lrev, verdict: "changes" }, planName: "2026-09-12-upload-resume", map: lmap, wt: readFileSync(join(pd2, "walkthrough.md"), "utf8") });
  ok("what to act on, changes requested: a listed call never reached is never judged, not listed", /Listed, not judged[^:]*: A2\./.test(lscope) && /Never judged \(not accepted\): A4\./.test(lscope), lscope);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `✗ ${failed} failed` : "✓ lifecycle: all passed");
process.exit(failed ? 1 : 0);
