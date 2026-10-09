#!/usr/bin/env node
// Several people, one repo (the contributing plan), against a scratch repo with a bare `origin`:
//   reel pr-check  — the line (D-214): the ticked box, `needs-video`, or over 300 lines outside tests, docs,
//                    videos and generated files; `no-video` waives it; a new flag (Omar's `--quiet`), command or
//                    dependency is only named. Over the line with no video is waiting, not a failure, except
//                    with --merge. No media under a plan folder (D-213), no .wav or render anywhere (D-305); each video's plan map against plan.md
//                    by hash, each row of walkthrough.md against its stop (D-202); ids against the base (D-171);
//                    "not tidy" while a maintainer-accepted PR carries a contributor's reviews, and --tidy
//   reel record    — a contributor's walkthrough review adds nothing to the log; a maintainer's does; a
//                    plan review's answers join it whoever gave them (D-201). A maintainer is listed by the
//                    viewer id the hosted page sends (kept for the page's owner too); "owner" still matches,
//                    with a warning, since it names whoever published the page
//   reel renumber  — at the rebase's conflict: the base's log, then the branch's own after its last, and
//                    their mentions rewritten in the branch's plan folder
//   memory         — a line waiting in you.pending.jsonl moves only into the file of the reviewer it names
//   review         — a folder bundle-player packed is served as it is, and each video's plan map is
//                    compared with the checkout's
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";
import { readPlanMd } from "../lib/plan-md.mjs";
import { movePending, pendingPath, readYou } from "../lib/memory.mjs";
import { recordedBy } from "../lib/reviews.mjs";
import { maintainerOf, roleOf } from "../lib/contributing.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-contributing-"));
process.env.REELPLANNER_HOME = join(tmp, "home");   // `reel record` adds a summary to your memory: keep it out of the real home
const repo = join(tmp, "repo"), rp = join(repo, ".reelplanner");
const sh = (cmd, ...a) => execFileSync(cmd, a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, GIT_EDITOR: "true" } });
const git = (...a) => sh("git", ...a);
const tryGit = (...a) => { try { return { code: 0, out: git(...a) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: repo, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => run("reel.mjs", ...a);
const body = join(tmp, "body.md");
const check = (text = "", labels = "", ...more) => { writeFileSync(body, text); const r = reel("pr-check", repo, "--base", "origin/main", "--body-file", body, "--labels", labels, ...more); return r; };
const checkJson = (text, labels, ...more) => { const r = check(text, labels, "--json", ...more); try { return { ...JSON.parse(r.out), code: r.code }; } catch { return { code: r.code, raw: r.out, fails: [], waits: [], seen: [] }; } };
const write = (rel, text) => { mkdirSync(join(repo, rel, ".."), { recursive: true }); writeFileSync(join(repo, rel), text); };
const commit = (msg, ...paths) => { git("add", "--", ...(paths.length ? paths : ["."])); git("commit", "-q", "-m", msg); };
const lines = (n, f = (i) => `export const x${i} = ${i};`) => Array.from({ length: n }, (_, i) => f(i)).join("\n") + "\n";
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2000)}` : ""}`); if (!cond) failed++; };

const TICKED = "## What this PR does\n\nServes on 8790.\n\n- [x] This PR makes a choice a reviewer could make the other way: the port by default, 8790\n- [ ] This PR brings a video\n";
const plan = (name, q) => `# ${name}\n\n## The problem\n\nIt is needed.\n\n### Step 1 — Do it\n\nThe ${name} step.\n\n## Components touched\n\n- **CLI** — the command\n\n## Open questions for the reviewer\n\n1. **${q}** (step 1)\n- **A · One.** First.\n- **B · Two.** Second.\n`;
const planReview = (at, label, viewer) => ({ version: 1, project: "video", exportedAt: at, verdict: "approve", watch: { completion: 1 }, viewer,
  decisions: [{ id: "q1", option: "a", label, planStep: 1, t: 5, recommended: true }], quizzes: [], autonomy: [], annotations: [] });
const walkReview = (at, viewer) => ({ version: 1, project: "walkthrough-video", exportedAt: at, verdict: "approve", watch: { completion: 1 }, viewer,
  decisions: [], quizzes: [], autonomy: [{ id: "a1", verdict: "accept", chose: "Fail with a message", planStep: 1, t: 3 }], annotations: [] });
const ledger = () => JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions;

try {
  // ---- a repo, its origin, and main ----
  execFileSync("git", ["init", "-q", "--bare", "-b", "main", join(tmp, "origin.git")]);
  mkdirSync(repo, { recursive: true });
  git("init", "-q", "-b", "main"); git("config", "user.email", "sam@example.com"); git("config", "user.name", "Sam"); git("config", "commit.gpgsign", "false");
  git("remote", "add", "origin", join(tmp, "origin.git"));
  reel("init", repo, "--name", "demo", "--kind", "greenfield");
  const sys = JSON.parse(readFileSync(join(rp, "system.json"), "utf8")); sys.components = [{ id: "cli", name: "CLI", kind: "service" }];
  writeFileSync(join(rp, "system.json"), JSON.stringify(sys, null, 2));
  const cfg = JSON.parse(readFileSync(join(rp, "config.json"), "utf8")); cfg.maintainers = ["owner"]; writeFileSync(join(rp, "config.json"), JSON.stringify(cfg, null, 2));
  write("package.json", JSON.stringify({ name: "demo", dependencies: { left: "1.0.0" } }, null, 2) + "\n");
  write("bin/tool.mjs", `// usage: tool [--verbose]\nconst verbose = process.argv.includes("--verbose");\n`);
  commit("start"); git("push", "-q", "origin", "main"); git("fetch", "-q", "origin");

  // ---- the line (D-214) ----
  git("checkout", "-q", "-b", "quiet");
  write("bin/tool.mjs", `// usage: tool [--verbose] [--quiet]\nconst verbose = process.argv.includes("--verbose");\nconst quiet = process.argv.includes("--quiet");\n${lines(22)}`);
  commit("--quiet");
  let r = checkJson("", "");
  ok("pr-check: Omar's 25-line PR adding --quiet, box unticked, is under the line: a normal code review", r.code === 0 && r.crosses === false && r.size === 25 && !r.waits.length, JSON.stringify(r));
  ok("pr-check: the new flag is named, never counted", r.seen.includes("a new flag: `--quiet`") && !r.reasons.length, JSON.stringify(r.seen));
  r = checkJson(TICKED, "");
  ok("pr-check: the ticked box crosses the line, naming the choice", r.crosses && r.reasons.some((x) => /ticked: a choice \(the port by default, 8790\)/.test(x)), JSON.stringify(r.reasons));
  ok("pr-check: over the line with no video is waiting (needs a video), not a failure", r.code === 0 && r.waits.some((w) => /^needs a video/.test(w)) && !r.fails.length, JSON.stringify(r));
  r = checkJson(TICKED, "", "--merge");
  ok("pr-check --merge: still waiting for a video fails", r.code === 1 && r.fails.some((w) => /^needs a video/.test(w)), JSON.stringify(r));
  // walkthroughs-that-help step 4 (D-223): the box as the template says it now, and the other choices as lines
  const TPL = readFileSync(join(ROOT, "templates", "pull_request_template.md"), "utf8");
  r = checkJson(TPL.replace("- [ ] This PR makes a choice you'd notice or can't easily undo: <!--", "- [x] This PR makes a choice you'd notice or can't easily undo: old reviews deleted after a month <!--"), "");
  ok("pr-check (D-223): the template's box, ticked, crosses the line, naming the choice", r.crosses && r.reasons.some((x) => /ticked: a choice \(old reviews deleted after a month\)/.test(x)), JSON.stringify(r.reasons));
  const OTHER = TPL.replace(/(## Other choices\n\n<!--[\s\S]*?-->\n)/, "$1\n- the helper is named `portFor`, instead of `pickPort`\n- the tests sit in one file\n");
  r = checkJson(OTHER, "");
  ok("pr-check (D-223): a small PR's other choices are lines in its text: named, and waiting for a maintainer to accept them, not a video", !r.crosses && r.say.line.some((l) => /other choices, a line each in the PR's text \(2\): "the helper is named `portFor`, instead of `pickPort`"; "the tests sit in one file"/.test(l)) && r.waits.some((w) => /waiting for a maintainer to accept the 2 other choices/.test(w)) && r.notes.some((n) => /say what each other choice was chosen instead of[^\n]*"the tests sit in one file"/.test(n)), JSON.stringify(r));
  ok("…with --merge, not yet accepted fails", checkJson(OTHER, "", "--merge").fails.some((f) => /accept the 2 other choices/.test(f)));
  r = checkJson(OTHER.replace("- [ ] The other choices above are accepted", "- [x] The other choices above are accepted"), "");
  ok("…ticked \"The other choices above are accepted\", nothing waits", !r.waits.length && r.code === 0, JSON.stringify(r));
  ok("…and the template's empty section is no choice at all", !checkJson(TPL, "").waits.length);
  r = checkJson("", "needs-video");
  ok("pr-check: a maintainer's `needs-video` crosses the line", r.crosses && r.reasons.includes("`needs-video`"), JSON.stringify(r.reasons));
  r = checkJson(TICKED, "no-video", "--merge");
  ok("pr-check: `no-video` waives it, even at --merge", r.code === 0 && r.crosses && r.waived && !r.waits.length && !r.fails.length, JSON.stringify(r));
  const said = check(TICKED, "");
  ok("pr-check: says why it crosses and what the diff shows, one line each", /over the line \(ticked: a choice/.test(said.out) && /seen in the diff, not a reason by itself: a new flag: `--quiet`/.test(said.out) && /△ needs a video/.test(said.out), said.out);
  git("checkout", "-q", "main");

  git("checkout", "-q", "-b", "big");
  write("src/big.mjs", lines(301)); write("scripts/test/big.spec.mjs", lines(500)); write("docs/big.md", lines(200, (i) => `line ${i}`)); write("package-lock.json", lines(400, (i) => `"x${i}": 1,`));
  write("package.json", JSON.stringify({ name: "demo", dependencies: { left: "1.0.0", right: "2.0.0" } }, null, 2) + "\n");
  commit("big");
  r = checkJson("", "");
  ok("pr-check: 301 lines of code (and 3 of package.json) cross the line; tests, docs and generated files are not counted", r.crosses && r.reasons.includes("304 lines") && r.size === 304, JSON.stringify({ size: r.size, reasons: r.reasons }));
  ok("pr-check: a new dependency is named, not counted", r.seen.includes("a new dependency: `right`"), JSON.stringify(r.seen));
  git("checkout", "-q", "main");
  r = checkJson("", "");
  ok("pr-check: no change, nothing to say", r.code === 0 && !r.crosses && r.size === 0, JSON.stringify(r));

  // ---- the issue: config.json's `pr.issue` (off by default; required in reelplanner's own repo) ----
  git("checkout", "-q", "-b", "issue-base");
  const setIssue = (v) => { const c = JSON.parse(readFileSync(join(rp, "config.json"), "utf8")); c.pr = { issue: v }; writeFileSync(join(rp, "config.json"), JSON.stringify(c, null, 2)); };
  ok("pr-check: off by default, a PR that links no issue is fine", (() => { const x = checkJson("Fixes a typo.", ""); return x.code === 0 && x.issueRequired === false && !x.fails.length; })());
  setIssue("required"); commit("every PR links an issue");
  git("checkout", "-q", "-b", "issue-pr");
  write("src/typo.mjs", "export const word = \"receive\";\n"); commit("typo");
  const linked = (text) => { writeFileSync(body, text); const x = reel("pr-check", repo, "--base", "issue-base", "--body-file", body, "--json"); try { return { ...JSON.parse(x.out), code: x.code }; } catch { return { code: x.code, raw: x.out, fails: [], issues: [], say: { issue: [] } }; } };
  r = linked("Fixes a typo.");
  ok("pr-check (pr.issue required): a PR that links no issue fails, saying how to fix it", r.code === 1 && r.issueRequired && r.fails.some((f) => /^links no issue: .*"Closes #<number>"/.test(f)), JSON.stringify(r));
  const OURS = readFileSync(join(ROOT, ".github", "pull_request_template.md"), "utf8");
  ok("…the PR template left as it is (\"Issue: Closes #\", the hints in comments) links none", linked(OURS).fails.some((f) => /^links no issue/.test(f)));
  for (const [text, want] of [[OURS.replace("Closes #", "Closes #12"), "#12"], ["Refs #7", "#7"], ["Part of ncrispino/reelplanner#31.", "ncrispino/reelplanner#31"], ["See https://github.com/ncrispino/reelplanner/issues/40", "https://github.com/ncrispino/reelplanner/issues/40"], ["#5 is why", "#5"]]) {
    r = linked(text);
    ok(`…links ${want}: passes, and says so`, r.code === 0 && !r.fails.length && r.issues.includes(want) && r.say.issue.some((l) => l.includes(want)), JSON.stringify({ text, r }));
  }
  ok("…a number in code or a comment, or an HTML entity, is no link", linked("Uses `#12` in code, &#38; <!-- Closes #3 -->\n```\nCloses #4\n```\n").fails.some((f) => /^links no issue/.test(f)));
  setIssue("off"); commit("the branch switches it off");
  r = linked("Fixes a typo.");
  ok("…a branch cannot switch it off for itself: the base's config counts too", r.fails.some((f) => /^links no issue/.test(f)), JSON.stringify(r));
  r = (() => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "reel.mjs"), "pr-check", repo, "--base", "issue-base", "--json"], { encoding: "utf8", cwd: repo, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, GITHUB_EVENT_NAME: "", GITHUB_EVENT_PATH: "", PATH: process.env.PATH } }) }; } catch (e) { return { code: e.status, out: `${e.stdout}` }; } })();
  r = { ...JSON.parse(r.out), code: r.code };
  ok("…no PR text read: waiting (it fails only with --merge), with how to pass it", r.code === 0 && r.waits.some((w) => /no PR text read, so no linked issue seen \(pass --body-file/.test(w)), JSON.stringify(r));
  git("checkout", "-q", "main");

  // ---- two branches, one plan each: the records ----
  git("checkout", "-q", "-b", "port");
  git("checkout", "-q", "main");
  writeFileSync(join(tmp, "cache.md"), plan("Cache", "Where does the cache live?"));
  reel("new-plan", repo, "cache", "--plan", join(tmp, "cache.md"), "--date", "2026-09-27");
  writeFileSync(join(tmp, "rc.json"), JSON.stringify(planReview("2026-09-27T10:00:00.000Z", "In the repo", { owner: true })));
  reel("record", join(rp, "plans", "2026-09-27-cache"), join(tmp, "rc.json"));
  commit("cache plan"); git("push", "-q", "origin", "main"); git("fetch", "-q", "origin");
  ok("main: the cache plan's answer is D-001", ledger().map((d) => `${d.id} ${d.chosen}`).join() === "D-001 In the repo", JSON.stringify(ledger()));

  git("checkout", "-q", "port");
  writeFileSync(join(tmp, "port.md"), plan("Port", "Which port by default?"));
  reel("new-plan", repo, "port", "--plan", join(tmp, "port.md"), "--date", "2026-09-27");
  const pd = join(rp, "plans", "2026-09-27-port");
  writeFileSync(join(tmp, "rp.json"), JSON.stringify(planReview("2026-09-27T11:00:00.000Z", "8790", { id: "sam" })));
  const rec = reel("record", pd, join(tmp, "rp.json"));
  ok("reel record: a contributor's plan review joins the log (the plan's decisions, D-201)", rec.code === 0 && ledger().map((d) => `${d.id} ${d.chosen}`).join() === "D-001 8790", rec.out);
  writeFileSync(join(pd, "walkthrough.md"), "# Built\n\n### Step 1 — Do it\n\nThe port is 8790 (D-001), in `bin/tool.mjs`.\n\n| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n| A1 | 1 | Fail with a message [visible] | try the next port | clearer | bin/tool.mjs |\n");
  mkdirSync(join(pd, "walkthrough-video"), { recursive: true });
  const wmap = { project: "walkthrough-video", planDir: ".reelplanner/plans/2026-09-27-port", plan: readPlanMd(join(pd, "plan.md")),
    autonomy: [{ id: "a1", chose: "Fail with a message", insteadOf: "try the next port", why: "clearer", check: "bin/tool.mjs" }] };
  writeFileSync(join(pd, "walkthrough-video", "plan-map.json"), JSON.stringify(wmap, null, 2) + "\n");
  writeFileSync(join(pd, "walkthrough-video", "STORYBOARD.md"), "---\nplan_dir: .reelplanner/plans/2026-09-27-port\n---\n\n## Frame 1 — The port\n\nThe port is D-001.\n");
  write("bin/tool.mjs", `// usage: tool [--verbose] [--port <n>]\nconst verbose = process.argv.includes("--verbose");\nconst port = 8790;\n`);
  commit("port plan");

  r = checkJson(TICKED, "");
  ok("pr-check (D-171): the branch's D-001 names a different entry than main's", r.code === 1 && r.fails.some((f) => /an id names a different entry than on origin\/main: D-001 \(here 2026-09-27-port: 8790; on origin\/main 2026-09-27-cache: In the repo\)/.test(f)), JSON.stringify(r.fails));
  ok("pr-check: a video brought, waiting for a maintainer to accept its walkthrough", r.waits.some((w) => /waiting for a maintainer to accept the walkthrough of 2026-09-27-port/.test(w)), JSON.stringify(r.waits));
  ok("pr-check (D-202): the walkthrough's plan map matches plan.md, and its row its stop", r.say.fresh.some((l) => /walkthrough-video: its plan map matches plan\.md/.test(l)) && r.say.fresh.some((l) => /its 1 row\(s\) match their stops/.test(l)), JSON.stringify(r.say.fresh));

  // ---- reel renumber, at the rebase's conflict ----
  const reb = tryGit("rebase", "origin/main");
  ok("the rebase stops at the conflict in decisions.json", reb.code !== 0 && /decisions\.json/.test(reb.out), reb.out);
  const rn = reel("renumber", repo, "--base", "origin/main");
  ok("reel renumber: main's log as it is, the branch's D-001 after its last, as D-002", rn.code === 0 && /D-001 → D-002/.test(rn.out) && ledger().map((d) => `${d.id} ${d.plan} ${d.chosen}`).join(" | ") === "D-001 2026-09-27-cache In the repo | D-002 2026-09-27-port 8790", `${rn.out}\n${JSON.stringify(ledger())}`);
  ok("reel renumber: its mentions rewritten in the plan folder; the frames that still say it are listed", /The port is 8790 \(D-002\)/.test(readFileSync(join(pd, "walkthrough.md"), "utf8")) && /STORYBOARD\.md:\d+ says D-001/.test(rn.out), rn.out);
  ok("reel renumber: decisions.md written from the log, no conflict left", !/<<<<<<<|>>>>>>>/.test(readFileSync(join(rp, "decisions.md"), "utf8")) && /\| D-002 \| 2026-09-27 \| 2026-09-27-port \|/.test(readFileSync(join(rp, "decisions.md"), "utf8")));
  git("add", "-A", ".reelplanner"); const cont = tryGit("rebase", "--continue");
  ok("the rebase goes on", cont.code === 0 && !existsSync(join(repo, ".git", "rebase-merge")), cont.out);
  r = checkJson(TICKED, "");
  ok("pr-check: after renumber, no id names another entry", !r.fails.some((f) => /different entry/.test(f)) && r.say.ids.some((l) => /1 new, after origin\/main's last/.test(l)), JSON.stringify(r));

  // ---- no media under a plan folder (D-213) ----
  write(".reelplanner/plans/2026-09-27-port/walkthrough-video/assets/voice/f01.wav", "RIFF");
  // init's .gitignore leaves the voice out (D-305): a contributor who adds it anyway (`git add -f`) is what pr-check catches
  git("add", "-f", "--", ".reelplanner/plans/2026-09-27-port/walkthrough-video/assets/voice/f01.wav"); git("commit", "-q", "-m", "a voice file");
  r = checkJson(TICKED, "");
  ok("pr-check: a voice file added under a plan folder fails", r.code === 1 && r.fails.some((f) => /adds \.reelplanner\/plans\/2026-09-27-port\/walkthrough-video\/assets\/voice\/f01\.wav/.test(f)), JSON.stringify(r.fails));
  git("rm", "-q", "-r", ".reelplanner/plans/2026-09-27-port/walkthrough-video/assets"); git("commit", "-q", "-m", "no voice");
  // …nor a voice file or render anywhere else (D-305): a worked example under videos/ keeps its narration as .mp3
  for (const f of ["videos/x1/assets/voice/01.wav", "videos/x1/renders/chapters/ch1.mp4", "videos/x1/assets/voice/01.mp3"]) write(f, "x");
  git("add", "-f", "--", "videos/x1"); git("commit", "-q", "-m", "an example with its wav and a render");
  r = checkJson(TICKED, "");
  ok("pr-check: a .wav or a render added outside a plan folder fails (D-305); the example's .mp3 does not",
    r.code === 1 && ["videos/x1/assets/voice/01.wav", "videos/x1/renders/chapters/ch1.mp4"].every((f) => r.fails.some((l) => l.startsWith(`adds ${f}: no voice file or render`))) && !r.fails.some((l) => /01\.mp3/.test(l)), JSON.stringify(r.fails));
  git("rm", "-q", "-r", "videos/x1"); git("commit", "-q", "-m", "no example");

  // ---- each video against its text (D-202) ----
  const planPath = join(pd, "plan.md"), planText = readFileSync(planPath, "utf8");
  writeFileSync(planPath, planText.replace("The Port step.", "The Port step, changed.")); commit("plan changed");
  r = checkJson(TICKED, "");
  ok("pr-check: a walkthrough built before the last change to plan.md fails", r.code === 1 && r.fails.some((f) => /walkthrough-video: built from another version of plan\.md/.test(f)), JSON.stringify(r.fails));
  writeFileSync(planPath, planText); commit("plan back");
  const wtPath = join(pd, "walkthrough.md"), wtText = readFileSync(wtPath, "utf8");
  writeFileSync(wtPath, wtText.replace("| clearer |", "| clearer to the user |")); commit("row changed");
  r = checkJson(TICKED, "");
  ok("pr-check: a row of walkthrough.md that reads otherwise than its stop fails", r.code === 1 && r.fails.some((f) => /built before the last change to walkthrough\.md \(A1 reads otherwise than its stop\)/.test(f)), JSON.stringify(r.fails));
  writeFileSync(wtPath, wtText); commit("row back");
  r = checkJson(TICKED, "");
  ok("pr-check: back as built, nothing fails", r.code === 0 && !r.fails.length, JSON.stringify(r));
  // walkthroughs-that-help step 4: the stale check follows step 2's rule: A1 is labelled visible, so a video that
  // only lists it was built before its label said it pauses
  const wm0 = readFileSync(join(pd, "walkthrough-video", "plan-map.json"), "utf8"), wm = JSON.parse(wm0);
  wm.autonomyGroups = [{ id: "list-9", list: true, ids: ["a1"], calls: wm.autonomy.map((a) => ({ ...a })) }]; wm.autonomy = [];
  writeFileSync(join(pd, "walkthrough-video", "plan-map.json"), JSON.stringify(wm, null, 2) + "\n"); commit("A1 listed");
  r = checkJson(TICKED, "");
  ok("pr-check (step 2's rule): a call labelled visible that the video only lists is stale", r.code === 1 && r.fails.some((f) => /A1 is on the video's list, but labelled visible it pauses/.test(f)), JSON.stringify(r.fails));
  writeFileSync(join(pd, "walkthrough-video", "plan-map.json"), wm0); commit("A1 pauses again");

  // ---- reviews: a contributor's and a maintainer's (step 2) ----
  writeFileSync(join(tmp, "ws.json"), JSON.stringify(walkReview("2026-09-27T12:00:00.000Z", { id: "sam" })));
  const n0 = ledger().length, rs = reel("record", pd, join(tmp, "ws.json"));
  ok("reel record: a contributor's walkthrough review adds nothing to the log, and says so", rs.code === 0 && ledger().length === n0 && /a contributor's walkthrough review \(id:sam is not in config\.json's maintainers: owner\)/.test(rs.out) && existsSync(join(pd, "reviews", "walkthrough-20260927T120000Z.md")), `${rs.out}\n${JSON.stringify(ledger())}`);
  commit("sam's walkthrough review");
  writeFileSync(join(tmp, "wo.json"), JSON.stringify(walkReview("2026-09-27T13:00:00.000Z", { owner: true })));
  const ro = reel("record", pd, join(tmp, "wo.json"));
  ok("reel record: a maintainer's accepted call joins the log", ro.code === 0 && ledger().length === n0 + 1 && ledger().at(-1).kind === "autonomy" && ledger().at(-1).chosen === "Fail with a message", ro.out);
  ok("reel record: counted by \"owner\" alone, it warns that \"owner\" is whoever published the page, and says the id comes with the next hosted review", /△ owner's review: counted as a maintainer's because config\.json's maintainers lists "owner", which names whoever published the review page, on anyone's page: this review carries no viewer id/.test(ro.out), ro.out);
  commit("the owner's walkthrough review");
  r = checkJson(TICKED, "");
  ok("pr-check: accepted by a maintainer, still carrying a contributor's reviews: not tidy", r.code === 1 && r.fails.some((f) => /^not tidy: a maintainer accepted the walkthrough, and the branch still carries 2 contributor's review\(s\)/.test(f)) && !r.waits.length, JSON.stringify(r));
  ok("pr-check: the two columns, what lands and what stays", r.say.lands.some((l) => /^lands on main: .*2026-09-27-port\/reviews\/walkthrough-20260927T130000Z \(owner\)/.test(l)) && r.say.lands.some((l) => /^stays in the PR: .*plan-20260927T110000Z \(id:sam\).*walkthrough-20260927T120000Z \(id:sam\)/.test(l)), JSON.stringify(r.say.lands));
  ok("pr-check: a review counted by \"owner\" alone is noted", r.notes.some((x) => /2026-09-27-port\/reviews\/walkthrough-20260927T130000Z: counted as a maintainer's because config\.json's maintainers lists "owner"/.test(x)), JSON.stringify(r.notes));
  const td = check(TICKED, "", "--tidy");
  ok("pr-check --tidy: the contributor's reviews removed, in one commit", td.code === 0 && /removed 2 contributor's review\(s\) in one commit/.test(td.out) && !existsSync(join(pd, "reviews", "walkthrough-20260927T120000Z.json")) && !existsSync(join(pd, "reviews", "plan-20260927T110000Z.md")) && existsSync(join(pd, "reviews", "walkthrough-20260927T130000Z.json")) && /^tidy: the contributor's reviews stay in the PR's history/.test(git("log", "-1", "--format=%B")), td.out);
  ok("the tidy commit leaves the log as it was: the plan's decisions stay", ledger().some((d) => d.chosen === "8790"));
  r = checkJson(TICKED, "", "--merge");
  ok("pr-check --merge: tidy, accepted by a maintainer, fresh: ready", r.code === 0 && !r.fails.length && !r.waits.length, JSON.stringify(r));

  // ---- who a maintainer is: the viewer id the hosted page sends, the owner's included ----
  // "owner" is whoever published the page: Ana reviewing on a page of her own is its owner too. The id tells them apart.
  const cfgBefore = readFileSync(join(rp, "config.json"), "utf8"), ledgerBefore = readFileSync(join(rp, "decisions.json"), "utf8");
  const so = recordedBy(repo, { row: { viewer: { id: "u_owner", owner: true } } }), sa = recordedBy(repo, { row: { viewer: { id: "u_ana", owner: false } } });
  ok("recordedBy: the page's owner is still \"owner\", and their viewer id is kept beside it", so.reviewer === "owner" && so.id === "id:u_owner" && sa.reviewer === "id:u_ana" && sa.id === "id:u_ana", JSON.stringify([so, sa]));
  const older = { recorded: { reviewer: "owner" } }, ownerAna = { recorded: { reviewer: "owner", id: "id:u_ana" } }, ownerMe = { recorded: { reviewer: "owner", id: "id:u_owner" } };
  const m1 = maintainerOf(ownerMe, ["id:u_owner"]), m2 = maintainerOf(ownerAna, ["id:u_owner"]), m3 = maintainerOf(older, ["id:u_owner"]), m4 = maintainerOf(ownerAna, ["owner"]);
  ok("maintainerOf: listed by id, the owner is a maintainer on any page; a second person's own page (\"owner\" too) is not", m1.is && m1.by === "id" && !m1.warn && !m2.is && !m3.is && roleOf(ownerAna, ["id:u_owner"]) === "contributor", JSON.stringify([m1, m2, m3]));
  ok("maintainerOf: \"owner\" still matches, with a warning naming the id to list in its place", m4.is && m4.by === "owner" && /list this reviewer as "id:u_ana" in its place/.test(m4.warn) && maintainerOf({ recorded: { reviewer: "Sam@Example.com" } }, ["sam@example.com"]).by === "email", JSON.stringify(m4));
  const both = ["id:u_owner", "owner"], b1 = maintainerOf(older, both), b2 = maintainerOf(ownerAna, both), b3 = maintainerOf(ownerMe, both);
  ok("maintainerOf: \"owner\" beside an id covers only reviews from before ids, quietly; one with another id is not a maintainer's", b1.is && b1.by === "owner" && !b1.warn && !b2.is && b3.is && b3.by === "id", JSON.stringify([b1, b2, b3]));
  writeFileSync(join(rp, "config.json"), JSON.stringify({ ...JSON.parse(cfgBefore), maintainers: ["id:u_owner"] }, null, 2));
  writeFileSync(join(tmp, "wa.json"), JSON.stringify(walkReview("2026-09-27T14:00:00.000Z", { id: "u_ana", owner: true })));
  const ra = reel("record", pd, join(tmp, "wa.json"));
  ok("reel record: a second person reviewing on their own page (\"owner\" there) is a contributor when maintainers lists the owner's id", ra.code === 0 && /a contributor's walkthrough review \(owner, id:u_ana is not in config\.json's maintainers: id:u_owner\)/.test(ra.out) && /add "id:u_ana" to `maintainers`/.test(ra.out) && JSON.parse(readFileSync(join(pd, "reviews", "walkthrough-20260927T140000Z.json"), "utf8")).recorded.id === "id:u_ana", ra.out);
  writeFileSync(join(tmp, "wm.json"), JSON.stringify(walkReview("2026-09-27T15:00:00.000Z", { id: "u_owner", owner: true })));
  const rm = reel("record", pd, join(tmp, "wm.json"));
  ok("reel record: the owner, listed by id, is a maintainer, with no warning, and the record names the id", rm.code === 0 && !/contributor's|△ owner's review/.test(rm.out) && /, by owner \(id:u_owner\)/.test(rm.out), rm.out);
  for (const t of ["140000Z", "150000Z"]) for (const x of ["json", "md"]) rmSync(join(pd, "reviews", `walkthrough-20260927T${t}.${x}`), { force: true });
  writeFileSync(join(rp, "config.json"), cfgBefore); writeFileSync(join(rp, "decisions.json"), ledgerBefore);

  // ---- review: a packed folder, served as it is ----
  const pack = join(tmp, "pr-video"), slugW = "2026-09-27-port--walkthrough", slugP = "2026-09-27-port";
  mkdirSync(join(pack, slugW), { recursive: true }); mkdirSync(join(pack, slugP), { recursive: true });
  writeFileSync(join(pack, "index.html"), "<!doctype html><html><head></head><body>player</body></html>");
  writeFileSync(join(pack, "reelplanner-player.js"), "");
  writeFileSync(join(pack, "library.json"), JSON.stringify({ slugs: [slugW, slugP] }));
  writeFileSync(join(pack, slugW, "plan-map.json"), readFileSync(join(pd, "walkthrough-video", "plan-map.json")));
  mkdirSync(join(pd, "video"), { recursive: true });
  writeFileSync(join(pd, "video", "plan-map.json"), JSON.stringify({ project: "video", totalSeconds: 60 }));
  writeFileSync(join(pack, slugP, "plan-map.json"), JSON.stringify({ project: "video", totalSeconds: 58 }));
  const port = testPort(18950);
  const served = await new Promise((done) => {
    const child = spawn(process.execPath, [join(ROOT, "scripts", "review.mjs"), pack, "--no-open", "--no-notify", "--port", String(port)], { cwd: repo, env: process.env });
    let out = ""; const end = () => { child.kill("SIGKILL"); done(out); };
    const t = setTimeout(end, 30000);
    child.stdout.on("data", async (c) => { out += c; const m = out.match(/review page: (\S+)/); if (m) { clearTimeout(t);
      try { const res = await fetch(m[1]); out += `\nGET ${res.status} ${/player/.test(await res.text()) ? "the packed page" : "something else"}`; } catch (e) { out += `\nGET failed ${e.message}`; }
      end(); } });
    child.stderr.on("data", (c) => (out += c));
  });
  ok("review: a packed folder is served as it is, nothing packed again", /packed already \(2 videos\), served as it is/.test(served) && /GET 200 the packed page/.test(served) && !existsSync(join(pack, "vendor")), served);
  ok("review: a packed video whose plan map is the checkout's says so", new RegExp(`✓ ${slugW}: its plan map is the checkout's`).test(served), served);
  ok("review: one built from another version of the plan says so", new RegExp(`△ ${slugP}: its plan map is not the checkout's .*built from another version of the plan`).test(served), served);

  // ---- memory waiting in the repo, with several reviewers (step 4) ----
  const line = (reviewer, review) => JSON.stringify({ repo: "repo", plan: "2026-09-27-port", review, reviewer });
  writeFileSync(pendingPath(rp), [line("ana@example.com", "r1"), line("Sam@Example.com", "r2"), line("owner", "r3")].join("\n") + "\n");
  const you = join(tmp, "you.jsonl"), mv = movePending(rp, you);
  ok("memory: a pending line moves only into the file of the reviewer it names; another's waits", mv.moved === 2 && readYou(you).map((f) => f.review).join() === "r2,r3" && readYou(pendingPath(rp)).map((f) => f.review).join() === "r1", JSON.stringify({ mv, you: readYou(you), left: readYou(pendingPath(rp)) }));
  ok(".gitattributes keeps both sides' lines of you.pending.jsonl", /^\.reelplanner\/you\.pending\.jsonl\s+merge=union$/m.test(readFileSync(join(ROOT, ".gitattributes"), "utf8")) && /you\.pending\.jsonl\s+merge=union/.test(readFileSync(join(ROOT, "templates", "gitignore"), "utf8")));
} catch (e) {
  console.log(`✗ the spec stopped: ${e.stack || e.message}${e.stdout ? `\n${e.stdout}${e.stderr}` : ""}`); failed++;
} finally {
  if (!failed) rmSync(tmp, { recursive: true, force: true });
  else console.log(`(kept: ${tmp})`);
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ all passed");
process.exit(failed ? 1 : 0);
