#!/usr/bin/env node
// The loop running itself (plan 2026-09-22-m3-revise-loop, steps 2 and 3), against a scratch repo:
//   notify        — the "what is waiting" line from a plan-map; the OS command is a stub; never fails
//   review server — a posted review lands in .reelplanner/inbox/
//   --wait        — a waiting session gets the review's path and exits
//   no waiter     — the server runs the configured (fake) agent command, exactly once per review,
//                   and tells the reviewer when that run ends (ready, or stopped short)
//   sandbox       — a command that turns Claude Code's sandbox on runs as it is where the (stubbed) probe
//                   says the sandbox can run; otherwise it runs anyway with the sandbox off in its
//                   --settings (auto mode and the file-tool hook kept), and the reviewer is told so once
//   file tools    — the command's PreToolUse hook passes a write inside the repo and refuses one outside
//   other agents  — a `codex exec`-style command is started as it is: no probe, nothing held back
//   --detach      — the server runs on its own past the session, is reused by a second --detach, and --stop ends it;
//                   in a repo with no set-up .reelplanner/ (one video) too, recorded in the machine's inbox for the repo
//   ask           — a question asked on the page (Ask about this): with no session waiting it goes with the review; a
//                   waiting session's --wait wakes on it, `inbox answer` answers it, GET /api/ask reads the answer
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";
import { waitingLine, osCommand, splitCommand } from "../lib/notify.mjs";
import { liveWaiters, claim, writeReview, repoKey } from "../lib/inbox.mjs";
import { sandboxOf, sandboxProblem, withoutSandbox, fencesFileTools } from "../lib/sandbox.mjs";
// the runner hands this spec a free port and the four above it (RP_TEST_PORT); run alone, a random one below the
// ports the system hands out for outgoing connections (32768 and up)
const BASE_PORT = 20000 + Math.floor(Math.random() * 12000);

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (f, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = await f(); if (v) return v; await sleep(100); } return null; };
// a review server is up: the URL it says it serves on, once it says so, or null once it has exited without saying it.
// Its start is node processes one after another, each from cold (review.mjs, bundle-player, and the first time the
// guide build), all CPU: 0.4 s on an idle machine, 3.5 s with 32 busy processes on 4 CPUs, and once past a fixed 30 s
// in a loaded `npm test`. (The sandbox probe is not in it: the server says it is up first, then probes.) So this waits
// on the server's own word or its end, not a time; the runner's timeout still ends one that hangs.
const started = (child, out) => new Promise((done) => {
  const look = () => { const url = out().match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1]; if (url) { stop(); done(url); } };
  const gone = () => { stop(); done(out().match(/review page: (http:\/\/127\.0\.0\.1:\d+)\//)?.[1] || null); };
  const stop = () => { child.stdout.off("data", look); child.stderr.off("data", look); child.off("close", gone); };
  child.stdout.on("data", look); child.stderr.on("data", look); child.on("close", gone);
  look();
});
const lines = (f) => (existsSync(f) ? readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

const tmp = mkdtempSync(join(tmpdir(), "reel-loop-"));
// the same place, however it is spelled: a working directory is always its real path (macOS's /private/var/… for
// this /var/… temp folder), so what a process prints from its own is compared by where it is
const samePlace = (a, b) => { try { return realpathSync(a) === realpathSync(b); } catch { return false; } };
const rp = join(tmp, ".reelplanner"), pd = join(rp, "plans/2026-01-01-demo"), vd = join(pd, "video");
mkdirSync(join(vd, "compositions"), { recursive: true });
writeFileSync(join(pd, "plan.md"), "# Demo\n");
writeFileSync(join(rp, "decisions.json"), JSON.stringify({ decisions: [] }));   // set up: `reel init` ran here
writeFileSync(join(vd, "index.html"), "<!doctype html><title>demo</title>\n");
const MAP = { project: "video", title: "Demo plan", planDir: ".reelplanner/plans/2026-01-01-demo", totalSeconds: 212, watchedSeconds: 190,
  decisions: [{ id: "q1" }, { id: "q2" }], autonomy: [], quizzes: [], frames: [] };
writeFileSync(join(vd, "plan-map.json"), JSON.stringify(MAP));
// a recorder standing in for notify-send and for `claude -p`: it writes down what it was run with
const rec = join(tmp, "record.mjs");
// (as the agent, a review whose note is "finish" is finished: moved to done/, as `inbox done` does)
writeFileSync(rec, `import { appendFileSync, readFileSync, mkdirSync, renameSync } from "node:fs";\nimport { dirname, basename, join } from "node:path";\n` +
  `appendFileSync(process.argv[2], JSON.stringify({ args: process.argv.slice(3), cwd: process.cwd() }) + "\\n");\n` +
  `const f = process.env.REELPLANNER_REVIEW;\nif (f && JSON.parse(readFileSync(f, "utf8")).note === "finish") { mkdirSync(join(dirname(f), "done"), { recursive: true }); renameSync(f, join(dirname(f), "done", basename(f))); }\n`);
const notified = join(tmp, "notified.jsonl"), runs = join(tmp, "runs.jsonl"), probes = join(tmp, "probes.jsonl");
// the fake agent command turns the sandbox on, as the shipped one does, so the server probes before a run;
// the probe is stubbed (REELPLANNER_SANDBOX_PROBE_CMD): the recorder (exit 0), or one that fails as root does here
// (and carries a file-tool hook, as the shipped one does, which a run without the sandbox keeps)
const HOOKS = { PreToolUse: [{ matcher: "Write|Edit|MultiEdit|NotebookEdit", hooks: [{ type: "command", command: "node", args: ["-e", "process.exit(0)"] }] }] };
const SANDBOX = JSON.stringify({ sandbox: { enabled: true, failIfUnavailable: true, allowUnsandboxedCommands: false }, hooks: HOOKS });
writeFileSync(join(rp, "config.json"), JSON.stringify({ agent: { command: [process.execPath, rec, runs, "--settings", SANDBOX] } }));
const failProbe = join(tmp, "fail-probe.mjs");
writeFileSync(failProbe, `import { appendFileSync } from "node:fs";\nappendFileSync(process.argv[2], "{}\\n");\nconsole.error("apply-seccomp: write /proc/self/uid_map: Operation not permitted");\nprocess.exit(1);\n`);
const NOTIFY_CMD = `"${process.execPath}" "${rec}" "${notified}"`;
const row = (at, extra = {}) => ({ status: "submitted", submittedAt: at, project: "video", planDir: ".reelplanner/plans/2026-01-01-demo", title: "Demo plan", note: "",
  review: { exportedAt: at, annotations: [{ kind: "comment", t: 3, text: "clearer, please" }], decisions: [{ id: "q1", option: "a" }] }, ...extra });

const procs = [];
try {
  // ---------- notify ----------
  ok("notify: the line counts the choices and the minutes", waitingLine(MAP) === "2 choices to make, 3 min", waitingLine(MAP));
  ok("notify: a walkthrough's line counts calls and quick checks", waitingLine({ autonomy: [1, 2, 3], quizzes: [1], decisions: [], totalSeconds: 30 }) === "3 calls to accept or flag, 1 quick check, 1 min");
  ok("notify: a video that asks nothing says so", waitingLine({ totalSeconds: 95 }) === "nothing to decide, 2 min");
  ok("notify: a stop beat's calls and a grouped beat's count one by one", waitingLine({ autonomy: [1], autonomyGroups: [{ stop: true, ids: ["a1", "a2", "a3"] }, { ids: ["a4"] }], totalSeconds: 60 }) === "5 calls to accept or flag, 1 min");
  ok("notify: the list's calls are not to accept, only to flag (walkthroughs-that-help step 2)", waitingLine({ autonomyGroups: [{ stop: true, ids: ["a1"] }, { list: true, ids: ["a2", "a3"] }], totalSeconds: 100 }) === "1 call to accept or flag, 2 more on a list to flag if you'd change them, 2 min");
  ok("notify: the OS commands", osCommand("linux", "T", "B")[0] === "notify-send" && osCommand("linux", "T", "B")[1].join("|") === "T|B"
    && osCommand("darwin", "T", "B")[0] === "osascript" && osCommand("win32", "T", "B")[0] === "powershell" && osCommand("darwin", 'a"b', "B")[2].RP_NOTIFY_TITLE === 'a"b');
  ok("notify: a command string splits like argv, quotes grouping", splitCommand(`claude -p`).join("|") === "claude|-p" && splitCommand(`node "/a b/x.mjs" ''`).join("|") === "node|/a b/x.mjs|");
  // the shipped command is D-082's: auto mode, nothing left to prompt (a bare `claude -p` is denied every
  // edit and command: step 5's proof), inside the sandbox with no unsandboxed retry and no start without
  // it; -p last, since the prompt is appended after it
  const fences = [];
  for (const f of ["templates/reelplanner/config.json", ".reelplanner/config.json"]) {
    const argv = splitCommand(JSON.parse(readFileSync(join(ROOT, f), "utf8")).agent.command);
    const after = (flag) => argv[argv.indexOf(flag) + 1];
    let sb = null; try { sb = JSON.parse(after("--settings")).sandbox; } catch { /* no settings */ }
    ok(`config: ${f} runs a headless claude in auto mode inside the sandbox, with -p last`, argv[0] === "claude" && argv.at(-1) === "-p"
      && after("--permission-mode") === "auto" && after("--permission-prompts") === "none"
      && sb?.enabled === true && sb?.allowUnsandboxedCommands === false && sb?.failIfUnavailable === true, argv.join(" "));
    // a signed commit needs the local signing agent, which the sandbox cannot reach: `git commit` alone runs
    // outside it (still classifier-approved). An entry without "*" matches only the bare command, not `git commit -m …`
    ok(`config: ${f} runs \`git commit …\` outside the sandbox, and nothing else`, JSON.stringify(sb?.excludedCommands) === '["git commit *"]', JSON.stringify(sb?.excludedCommands));
    // the file tools are not in the sandbox: a PreToolUse hook refuses Write, Edit, MultiEdit and
    // NotebookEdit outside the repo (no permission rule can say "outside": deny beats allow)
    const settings = JSON.parse(after("--settings"));
    const pre = settings.hooks?.PreToolUse || [];
    const fence = pre.find((h) => ["Write", "Edit", "MultiEdit", "NotebookEdit"].every((t) => new RegExp(`^(${h.matcher})$`).test(t)));
    const hook = fence?.hooks?.[0];
    ok(`config: ${f} fences the file tools with a hook, run as node with no shell`, hook?.type === "command" && hook.command === "node" && hook.args?.[0] === "-e" && typeof hook.args[1] === "string"
      && !JSON.stringify(settings).includes("'"), JSON.stringify(fence)?.slice(0, 200));
    if (hook?.args) fences.push([f, hook.args[1]]);
    // where the sandbox can't run, this command runs with it off: still auto mode, no prompts, -p last, the hook kept
    const off = withoutSandbox(argv), offAt = (flag) => off[off.indexOf(flag) + 1], offSet = JSON.parse(offAt("--settings"));
    ok(`config: ${f} without the sandbox keeps auto mode, no prompts, -p last and the file-tool hook`, offAt("--permission-mode") === "auto" && offAt("--permission-prompts") === "none"
      && off.at(-1) === "-p" && offSet.sandbox?.enabled === false && offSet.sandbox?.failIfUnavailable === false && JSON.stringify(offSet.hooks) === JSON.stringify(settings.hooks), off.join(" ").slice(0, 300));
  }
  // the hook itself, fed what Claude Code sends it: inside the repo passes, outside is refused (exit 2)
  const home = (await import("node:os")).homedir();
  mkdirSync(join(tmp, "fence-repo/sub"), { recursive: true });
  try { (await import("node:fs")).symlinkSync(tmpdir(), join(tmp, "fence-repo/out")); } catch { /* no symlinks here */ }
  const fenceRepo = join(tmp, "fence-repo");
  const fenceRun = (code, input) => { try { execFileSync(process.execPath, ["-e", code], { input: typeof input === "string" ? input : JSON.stringify(input), env: { ...process.env, CLAUDE_PROJECT_DIR: fenceRepo }, stdio: ["pipe", "pipe", "pipe"] }); return { code: 0, err: "" }; }
    catch (e) { return { code: e.status, err: String(e.stderr || "") }; } };
  for (const [f, code] of fences) {
    const at = (tool_input) => fenceRun(code, { cwd: fenceRepo, tool_name: "Write", tool_input });
    const inside = [at({ file_path: join(fenceRepo, "a.txt") }), at({ file_path: "sub/new/b.txt" }), at({ notebook_path: join(fenceRepo, "n.ipynb") })];
    const outside = [at({ file_path: join(tmpdir(), "rp-fence-x.txt") }), at({ file_path: join(home, "rp-fence-x.txt") }), at({ file_path: "../x.txt" }), at({ notebook_path: join(home, "n.ipynb") }),
      ...(existsSync(join(fenceRepo, "out")) ? [at({ file_path: join(fenceRepo, "out", "escape.txt") })] : [])];
    ok(`file tools (${f}): a write inside the repo passes`, inside.every((r) => r.code === 0), JSON.stringify(inside));
    ok(`file tools (${f}): a write to /tmp, to $HOME, above the repo or through a symlink out of it is refused, saying why`, outside.every((r) => r.code === 2 && /outside the repo/.test(r.err)), JSON.stringify(outside));
    ok(`file tools (${f}): a call it cannot read is refused, not let through`, fenceRun(code, "not json").code === 2);
  }
  ok("sandbox: the command's --settings is read for the sandbox", sandboxOf(["claude", "--settings", SANDBOX, "-p"])?.enabled === true
    && sandboxOf(["claude", `--settings=${SANDBOX}`])?.enabled === true && sandboxOf(["claude", "-p"]) === null && sandboxOf(["codex", "exec"]) === null);
  ok("sandbox: no probe for a command without the sandbox, or one that already asks for the weaker nested one",
    await sandboxProblem(["claude", "-p"]) === null && await sandboxProblem(["claude", "--settings", '{"sandbox":{"enabled":true,"enableWeakerNestedSandbox":true}}', "-p"]) === null);
  ok("sandbox: another agent's command is never probed (it has no Claude Code --settings)", sandboxOf(splitCommand("codex exec --sandbox workspace-write")) === null
    && sandboxOf(splitCommand("opencode run --auto")) === null && await sandboxProblem(splitCommand("codex exec --sandbox workspace-write")) === null);
  // where the sandbox can't run, the command is run with it off, everything else kept
  const OFF = { enabled: false, failIfUnavailable: false };
  const cmd = ["claude", "--permission-mode", "auto", "--permission-prompts", "none", "--settings", SANDBOX, "-p"];
  const off1 = withoutSandbox(cmd), s1set = JSON.parse(off1[6]);
  ok("sandbox off: --settings keeps the hooks and turns the sandbox off, the rest of the command as it was", JSON.stringify(s1set.sandbox) === JSON.stringify(OFF)
    && JSON.stringify(s1set.hooks) === JSON.stringify(HOOKS) && off1.filter((_, i) => i !== 6).join(" ") === cmd.filter((_, i) => i !== 6).join(" ") && sandboxOf(off1) === null, off1.join(" "));
  const off2 = withoutSandbox(["claude", `--settings=${SANDBOX}`, "-p"]);
  const setFile = join(tmp, "settings.json"); writeFileSync(setFile, SANDBOX);
  const off3 = withoutSandbox(["claude", "--settings", "settings.json", "-p"], { cwd: tmp });
  ok("sandbox off: from --settings=… and from a settings file too (passed inline)", JSON.stringify(JSON.parse(off2[1].slice(11)).sandbox) === JSON.stringify(OFF)
    && JSON.stringify(JSON.parse(off3[2]).sandbox) === JSON.stringify(OFF) && JSON.stringify(JSON.parse(off3[2]).hooks) === JSON.stringify(HOOKS), `${off2[1]} · ${off3[2]}`);
  ok("sandbox off: the file-tool hook is seen before and after", fencesFileTools(cmd) && fencesFileTools(off1) && !fencesFileTools(["claude", "--settings", '{"sandbox":{"enabled":true}}']));
  const n1 = execFileSync(process.execPath, [join(ROOT, "scripts/notify.mjs"), vd, "--url", "http://127.0.0.1:9/x"], { encoding: "utf8", env: { ...process.env, REELPLANNER_NOTIFY_CMD: NOTIFY_CMD } });
  const got = lines(notified)[0]?.args || [];
  ok("notify: the stubbed OS command gets the title, the line and the link", got[0] === "Demo plan" && got[1] === "2 choices to make, 3 min\nhttp://127.0.0.1:9/x", JSON.stringify(got));
  ok("notify: and the same text is printed", /Demo plan/.test(n1) && /2 choices to make, 3 min/.test(n1) && /127\.0\.0\.1:9\/x/.test(n1), n1);
  let code = 0, out = "";
  try { out = execFileSync(process.execPath, [join(ROOT, "scripts/notify.mjs"), vd], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, REELPLANNER_NOTIFY_CMD: join(tmp, "no-such-notifier") } }); } catch (e) { code = e.status; }
  ok("notify: a notifier that is missing still exits 0, with the text printed", code === 0 && /2 choices to make/.test(out), `exit ${code}`);

  // ---------- the waiting session's heartbeat ----------
  mkdirSync(join(rp, "inbox/.waiters"), { recursive: true });
  writeFileSync(join(rp, "inbox/.waiters/999999.json"), JSON.stringify({ pid: 999999, host: (await import("node:os")).hostname(), beat: Date.now() }));
  writeFileSync(join(rp, "inbox/.waiters/1.json"), JSON.stringify({ pid: process.pid, host: "elsewhere", beat: Date.now() - 60000 }));
  ok("heartbeat: a dead session and a stale beat do not count as waiting", liveWaiters(rp).length === 0);

  // ---------- the review server ----------
  // your file across repos (D-106), in a scratch home: a word you looked up and a video you watched (D-218)
  const youHome = join(tmp, "you-home"); mkdirSync(youHome, { recursive: true });
  writeFileSync(join(youHome, "you.jsonl"), JSON.stringify({ repo: "elsewhere", plan: "2026-01-01-x", review: "walkthrough-1", at: "2026-01-01T00:00:00Z", lost: { looked: ["streak", "merge"] }, watched: [{ video: "system", at: "2026-01-01T00:00:00Z" }] }) + "\n");
  const env = { ...process.env, REELPLANNER_HOME: youHome, REELPLANNER_NOTIFY_CMD: NOTIFY_CMD, REELPLANNER_RECHECK_MS: "1500", REELPLANNER_SANDBOX_PROBE_CMD: `"${process.execPath}" "${rec}" "${probes}"` };
  rmSync(notified, { force: true });
  const srv = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--no-open", "--port", String(testPort(BASE_PORT, 0)), "--out", join(tmp, "bundle")], { cwd: tmp, env });
  procs.push(srv);
  let log = ""; srv.stdout.on("data", (d) => (log += d)); srv.stderr.on("data", (d) => (log += d));
  const url = await started(srv, () => log);
  ok("server: starts", !!url, log);
  if (!url) throw new Error("no server");
  const api = `${url}/api/review`;
  const top = await (await fetch(`${url}/`)).text();
  ok("server: marks its top page, so the player asks /api/review only here", /<meta name="reelplanning-review-server" content="1">/.test(top), top.slice(0, 200));
  const known = (await (await fetch(api)).json()).known;
  ok("server: GET /api/review says what your file knows (D-218): the words you looked up, in any repo", JSON.stringify(known?.looked) === '["merge","streak"]' && Array.isArray(known?.watched), JSON.stringify(known));
  const post = (body, headers = {}) => fetch(api, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, body: await r.json() }));
  const nsent = await until(() => lines(notified)[0]);
  ok("server: once the page is up it notifies, with the page's URL", nsent?.args?.[0] === "Demo plan" && nsent.args[1] === `2 choices to make, 3 min\n${url}/?project=${encodeURIComponent("2026-01-01-demo")}`, JSON.stringify(nsent));

  // only this page may post: the endpoint can start an agent run
  ok("server: another site's page is refused", (await post(row("2026-01-01T00:00:00Z"), { origin: "http://evil.example" })).status === 403);
  const plain = await fetch(api, { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify(row("2026-01-01T00:00:00Z")) });
  ok("server: a text/plain post (no CORS preflight) is refused", plain.status === 415);
  const bad = await post({ hello: 1 });
  ok("server: a body that is not a review is refused", bad.status === 400 && /annotations/.test(bad.body.error), JSON.stringify(bad.body));
  ok("server: nothing was written or run for those", !existsSync(join(rp, "inbox")) || !readdirSync(join(rp, "inbox")).some((f) => f.endsWith(".json")) && !existsSync(runs));

  // 1. a main session is waiting
  const waiter = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), "--wait", "--timeout", "30"], { cwd: tmp, env });
  procs.push(waiter);
  let wout = ""; waiter.stdout.on("data", (d) => (wout += d));
  const waited = new Promise((r) => waiter.on("exit", (c) => r(c)));
  const seen = await until(async () => (await (await fetch(api)).json()).sessionWaiting);
  ok("server: sees the waiting session", !!seen);
  const r1 = await post(row("2026-01-02T10:00:00.123Z"));
  ok("server: a posted review is written into the inbox and left for the session", r1.status === 200 && r1.body.handledBy === "session" && r1.body.path === ".reelplanner/inbox/video-20260102T100000Z.json", JSON.stringify(r1.body));
  const inboxFile = join(tmp, r1.body.path);
  ok("server: the file is the row as posted", existsSync(inboxFile) && JSON.parse(readFileSync(inboxFile, "utf8")).review.annotations[0].text === "clearer, please");
  const wcode = await Promise.race([waited, sleep(8000).then(() => "timeout")]);
  ok("--wait: exits 0 with the review's path", wcode === 0 && samePlace(wout.trim(), inboxFile), `exit ${wcode}, out ${JSON.stringify(wout)}`);
  ok("--wait: the review is claimed by the session", JSON.parse(readFileSync(inboxFile.replace(/\.json$/, ".claim"), "utf8")).by === "session");
  await sleep(2200); // past the server's re-check
  ok("server: with a session waiting, no headless run starts", !existsSync(runs), JSON.stringify(lines(runs)));

  // 2. no session waiting: the configured command, once
  const gone = await until(async () => !(await (await fetch(api)).json()).sessionWaiting);
  ok("server: sees the session is gone once --wait exits", !!gone);

  // Ask about this (videos-that-make-sense step 3): a question asked on the local page
  {
    const ask = (body, headers = {}) => fetch(`${url}/api/ask`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, body: await r.json() }));
    ok("ask: another site's page is refused", (await ask({ question: "x" }, { origin: "http://evil.example" })).status === 403);
    const none = await ask({ id: "ask-1", question: "what's the saved review file?", t: 12, frame: { index: 2, title: "The file" }, planStep: 3 });
    ok("ask: no session waiting → it goes with the review, and nothing is written", none.status === 200 && none.body.handledBy === "review" && !existsSync(join(rp, "inbox", "questions")), JSON.stringify(none.body));
    const qw = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), "--wait", "--timeout", "30"], { cwd: tmp, env });
    procs.push(qw);
    let qout = ""; qw.stdout.on("data", (d) => (qout += d));
    const qdone = new Promise((r) => qw.on("exit", (c) => r(c)));
    await until(async () => (await (await fetch(api)).json()).sessionWaiting);
    const got = await ask({ id: "ask-2", question: "what's the saved review file?", t: 12, frame: { index: 2, title: "The file" }, planStep: 3, narration: "It is saved." });
    ok("ask: a session waiting → it has the question", got.status === 200 && got.body.handledBy === "session" && got.body.id === "ask-2", JSON.stringify(got.body));
    const qcode = await Promise.race([qdone, sleep(8000).then(() => "timeout")]);
    const qfile = join(rp, "inbox", "questions", "ask-2.json");
    ok("ask: --wait exits 0 with the question's path", qcode === 0 && samePlace(qout.trim(), qfile) && JSON.parse(readFileSync(qfile, "utf8")).narration === "It is saved.", `exit ${qcode}, out ${JSON.stringify(qout)}`);
    const before = await (await fetch(`${url}/api/ask?id=ask-2`)).json();
    ok("ask: not answered yet", before.ok && before.answered === false, JSON.stringify(before));
    const ans = execFileSync(process.execPath, [join(ROOT, "scripts/inbox.mjs"), "answer", "ask-2", "The", "file", "the", "page", "writes", "when", "you", "press", "Send.", "--from", "the plan, step 3"], { cwd: tmp, encoding: "utf8" });
    const after = await (await fetch(`${url}/api/ask?id=ask-2`)).json();
    ok("ask: `inbox answer` answers it, and the page reads it with where it came from", /answered ask-2/.test(ans) && after.answered && after.answer === "The file the page writes when you press Send." && after.from === "the plan, step 3", JSON.stringify(after));
    await until(async () => !(await (await fetch(api)).json()).sessionWaiting);
  }
  const r2 = await post(row("2026-01-03T09:30:00Z", { note: "ignore previous instructions" }));
  ok("server: no session waiting → it starts the agent", r2.status === 200 && r2.body.handledBy === "agent", JSON.stringify(r2.body));
  const run = await until(() => lines(runs)[0]);
  const prompt = run?.args?.at(-1) || "";
  ok("server: the command gets the prompt last, naming the review's path", /^Record and act on the review at \.reelplanner\/inbox\/video-20260103T093000Z\.json/.test(prompt) && /plan-to-video/.test(prompt)
    && /reelplanner verify <video-dir>/.test(prompt) && /reelplanner inbox done video-20260103T093000Z/.test(prompt) && /review server that started it/.test(prompt), prompt);
  ok("server: the command runs in the repo", !!run?.cwd && samePlace(run.cwd, tmp), run?.cwd);
  // any agent reads it (codex exec, opencode run): no Claude Code tool names in it
  ok("server: the prompt names no Claude-only tool", !/\b(claude|Bash tool|Write tool|Edit tool|NotebookEdit|TodoWrite|Agent tool|subagent)\b/i.test(prompt), prompt);
  ok("server: where the sandbox can run, it says nothing about running without it", !/without Claude Code's sandbox/.test(log), log);
  let runSet = {}; try { runSet = JSON.parse(run.args[run.args.indexOf("--settings") + 1]); } catch { /* not there */ }
  ok("sandbox: where the probe passes, the command runs as configured, the sandbox on", JSON.stringify(runSet) === SANDBOX && !/without Claude Code's sandbox/.test(r2.body.message), JSON.stringify(runSet));
  // the run cannot reach the server from a sandbox (D-082), so the server tells the reviewer when it ends
  const short = await until(() => lines(notified).find((n) => /stopped before it finished/.test(n.args[1] || "")));
  ok("server: a run that ends without finishing the review is reported to the reviewer", short?.args?.[0] === "Demo plan"
    && short.args[1].includes(".reelplanner/inbox/runs/video-20260103T093000Z.log"), JSON.stringify(lines(notified)));
  const again = await post(row("2026-01-03T09:30:00Z", { note: "ignore previous instructions" }));
  ok("server: the same review posted again is the same file, already handled", again.body.duplicate === true && again.body.id === r2.body.id && again.body.handledBy === "agent", JSON.stringify(again.body));
  // two posts of a new review at the same moment
  const [a, b] = await Promise.all([post(row("2026-01-04T08:00:00Z")), post(row("2026-01-04T08:00:00Z"))]);
  await until(() => lines(runs).length >= 2);
  await sleep(1500);
  const all = lines(runs).map((x) => x.args.at(-1).match(/inbox\/(\S+)\.json/)[1]);
  ok("server: each review started exactly one run, never two", all.length === 2 && all.join() === "video-20260103T093000Z,video-20260104T080000Z", all.join());
  ok("server: of two identical posts one started it and one found it started", [a.body.duplicate, b.body.duplicate].sort().join() === "false,true", JSON.stringify([a.body, b.body]));
  ok("sandbox: where the probe passes, runs start as before, and it was probed once for them all", lines(probes).length === 1, `${lines(probes).length} probes`);

  // 3. a session that looked alive but never picks the review up (killed between two polls)
  const hb = join(rp, "inbox/.waiters", `${process.pid}.json`);
  writeFileSync(hb, JSON.stringify({ pid: process.pid, host: (await import("node:os")).hostname(), beat: Date.now() }));
  const r3 = await post(row("2026-01-06T00:00:00Z"));
  ok("server: a heartbeat alone reads as a waiting session", r3.body.handledBy === "session", JSON.stringify(r3.body));
  rmSync(hb, { force: true });
  const late = await until(() => lines(runs).find((x) => x.args.at(-1).includes(r3.body.id)), 6000);
  ok("server: when that session never claims it, the re-check starts the agent (once)", !!late && lines(runs).filter((x) => x.args.at(-1).includes(r3.body.id)).length === 1, log);

  // 4. a run that finishes the review (`inbox done`): the server rebuilds its page and says it is ready
  const r4 = await post(row("2026-01-07T00:00:00Z", { note: "finish" }));
  const ready = await until(() => lines(notified).find((n) => /^revised after your review/.test(n.args[1] || "")));
  ok("server: a run that finishes the review → the page is rebuilt and the reviewer told it is ready", r4.body.handledBy === "agent"
    && ready?.args?.[0] === "Demo plan" && ready.args[1] === `revised after your review: 2 choices to make, 3 min\n${url}/?project=${encodeURIComponent("2026-01-01-demo")}`
    && existsSync(join(rp, "inbox/done", `${r4.body.id}.json`)), JSON.stringify(ready));

  // ---------- the sandbox cannot run on this machine: the run goes ahead without it, and the reviewer is told once ----------
  const noProbes = join(tmp, "probes-fail.jsonl");
  const srv2 = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--no-open", "--port", String(testPort(BASE_PORT, 1)), "--out", join(tmp, "bundle2")],
    { cwd: tmp, env: { ...env, REELPLANNER_SANDBOX_PROBE_CMD: `"${process.execPath}" "${failProbe}" "${noProbes}"` } });
  procs.push(srv2);
  let log2 = ""; srv2.stdout.on("data", (d) => (log2 += d)); srv2.stderr.on("data", (d) => (log2 += d));
  const url2 = await started(srv2, () => log2);
  if (!url2) { ok("sandbox: a server where the sandbox cannot run starts", false, log2); throw new Error("no server"); }
  const api2 = `${url2}/api/review`;
  const g2 = await (await fetch(api2)).json();
  ok("sandbox: where it cannot run, the Finish panel is told the command starts, without the sandbox, and why", g2.ok === true && typeof g2.agentCommand === "string"
    && g2.unsandboxed === "Claude Code's sandbox can't run on this machine" && !("unattendedOff" in g2), JSON.stringify(g2));
  ok("sandbox: and the server says so once, when it starts", (log2.match(/unattended runs here go ahead without Claude Code's sandbox: this machine can't run it \(apply-seccomp: write \/proc\/self\/uid_map: Operation not permitted\); shell commands aren't fenced to the repo, file writes still are \(the hook\)/g) || []).length === 1, log2);
  const runsBefore = lines(runs).length, notesBefore = lines(notified).length;
  const s1 = await fetch(api2, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row("2026-01-08T00:00:00Z")) }).then((r) => r.json());
  const urun = await until(() => lines(runs).slice(runsBefore).find((x) => x.args.at(-1).includes(s1.id)));
  ok("sandbox: where it cannot run, a run still starts on the review", s1.handledBy === "agent" && /without Claude Code's sandbox/.test(s1.message) && !!urun, JSON.stringify(s1));
  let uset = {}; try { uset = JSON.parse(urun.args[urun.args.indexOf("--settings") + 1]); } catch { /* not there */ }
  ok("sandbox: its command has the sandbox off and cannot be stopped by it", JSON.stringify(uset.sandbox) === JSON.stringify(OFF) && sandboxOf(urun.args) === null, JSON.stringify(uset));
  ok("sandbox: and the file-tool hook is still there, the rest of the command unchanged", JSON.stringify(uset.hooks) === JSON.stringify(HOOKS)
    && urun.args[0] === "--settings" && urun.args.length === 3 && /^Record and act on the review at /.test(urun.args[2]), JSON.stringify(urun?.args?.slice(0, 1)));
  ok("sandbox: the claim says the run is unsandboxed", /off/.test(JSON.parse(readFileSync(join(rp, "inbox", `${s1.id}.claim`), "utf8")).sandbox || ""));
  const warned = await until(() => lines(notified).slice(notesBefore).find((n) => /without Claude Code's sandbox/.test(n.args[1] || "")));
  ok("sandbox: the reviewer is told it ran without the sandbox, why, and what is still fenced", warned?.args?.[0] === "Demo plan"
    && /^running without Claude Code's sandbox: this machine can't run it \(apply-seccomp: write \/proc\/self\/uid_map: Operation not permitted\); shell commands aren't fenced to the repo, file writes still are \(the hook\)/.test(warned.args[1]), JSON.stringify(warned));
  const s2 = await fetch(api2, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row("2026-01-09T00:00:00Z")) }).then((r) => r.json());
  await until(() => lines(runs).slice(runsBefore).some((x) => x.args.at(-1).includes(s2.id)));
  await sleep(500);
  ok("sandbox: a second review runs too; the reviewer was told once, and the probe ran once for the server's lifetime", lines(runs).length - runsBefore === 2
    && lines(notified).slice(notesBefore).filter((n) => /without Claude Code's sandbox/.test(n.args[1] || "")).length === 1 && lines(noProbes).length === 1,
    `${lines(runs).length - runsBefore} runs, ${lines(noProbes).length} probes`);
  srv2.kill();

  // ---------- another agent's command (codex exec): started as it is, never probed ----------
  const bin = join(tmp, "bin"); mkdirSync(bin, { recursive: true });
  const codexRuns = join(tmp, "codex-runs.jsonl"), codexProbes = join(tmp, "codex-probes.jsonl");
  writeFileSync(join(bin, "codex"), `#!/bin/sh\nexec "${process.execPath}" "${rec}" "${codexRuns}" "$@"\n`, { mode: 0o755 });
  const cfg = readFileSync(join(rp, "config.json"), "utf8");
  writeFileSync(join(rp, "config.json"), JSON.stringify({ agent: { command: "codex exec --sandbox workspace-write" } }));
  const srv3 = spawn(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--no-open", "--port", String(testPort(BASE_PORT, 2)), "--out", join(tmp, "bundle3")],
    { cwd: tmp, env: { ...env, PATH: `${bin}:${process.env.PATH}`, REELPLANNER_SANDBOX_PROBE_CMD: `"${process.execPath}" "${failProbe}" "${codexProbes}"` } });
  procs.push(srv3);
  let log3 = ""; srv3.stdout.on("data", (d) => (log3 += d)); srv3.stderr.on("data", (d) => (log3 += d));
  const url3 = await started(srv3, () => log3);
  if (!url3) { ok("other agents: a server with a codex command starts", false, log3); throw new Error("no server"); }
  const g3 = await (await fetch(`${url3}/api/review`)).json();
  const c1 = await fetch(`${url3}/api/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row("2026-01-10T00:00:00Z")) }).then((r) => r.json());
  const crun = await until(() => lines(codexRuns)[0]);
  ok("other agents: a codex exec command starts on the review, with the prompt last, where Claude Code's sandbox could not run", c1.handledBy === "agent" && g3.agentCommand === "codex exec --sandbox workspace-write"
    && crun?.args?.slice(0, 3).join(" ") === "exec --sandbox workspace-write" && /^Record and act on the review at /.test(crun.args.at(-1)), JSON.stringify({ c1, g3, crun }));
  ok("other agents: and nothing was probed or said about the sandbox", !existsSync(codexProbes) && !/without Claude Code's sandbox/.test(log3) && g3.unsandboxed === null, log3);
  srv3.kill();
  writeFileSync(join(rp, "config.json"), cfg);

  // a claim is exclusive: whoever loses does nothing
  const w3 = writeReview(rp, row("2026-01-05T00:00:00Z"));
  ok("claim: only the first taker gets a review", claim(rp, w3.id, "session") === true && claim(rp, w3.id, "agent") === false);

  // ---------- --detach: a review server that outlives the session that started it ----------
  const cli = (...a) => execFileSync(process.execPath, [join(ROOT, "scripts/review.mjs"), ...a], { cwd: tmp, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 90000 });
  const isAlive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
  const sfile = join(rp, "inbox/.server.json");
  const dport = String(testPort(BASE_PORT, 3));
  const d1 = cli(vd, "--detach", "--no-open", "--no-notify", "--port", dport, "--out", join(tmp, "bundle-detached"));
  const sj = existsSync(sfile) ? JSON.parse(readFileSync(sfile, "utf8")) : {};
  if (sj.pid) procs.push({ kill: () => { try { process.kill(sj.pid); } catch { /* gone */ } } });
  ok("--detach: returns at once with the URL, and records the server in inbox/.server.json", !!sj.pid && !!sj.port && !!sj.url && d1.includes(`review page: ${sj.url}`), `${d1}\n${JSON.stringify(sj)}`);
  const stat = existsSync(`/proc/${sj.pid}/stat`) ? readFileSync(`/proc/${sj.pid}/stat`, "utf8").split(") ")[1].split(" ") : null;
  ok("--detach: the server runs on after the command exits, in its own process group", isAlive(sj.pid) && (!stat || Number(stat[2]) === sj.pid), stat?.slice(0, 3).join(" "));
  const dget = await fetch(new URL("api/review", sj.base)).then((r) => r.json()).catch((e) => ({ error: e.message }));
  ok("--detach: it answers", dget.ok === true && "sessionWaiting" in dget, JSON.stringify(dget));
  ok("--detach: its output goes to inbox/server.log", /review page:/.test(readFileSync(join(rp, "inbox/server.log"), "utf8")));
  // inside a run the server started (a sandbox cannot see the server): no second server, the record kept
  const dIn = execFileSync(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--detach", "--no-open", "--no-notify"], { cwd: tmp, env: { ...env, REELPLANNER_REVIEW: join(rp, "inbox/x.json") }, encoding: "utf8", timeout: 30000 });
  ok("--detach inside a headless run: says the server will tell the reviewer, starts nothing", /started by the review server/.test(dIn)
    && JSON.parse(readFileSync(sfile, "utf8")).pid === sj.pid, dIn);
  const d2 = cli(vd, "--detach", "--no-open", "--no-notify");
  const sj2 = JSON.parse(readFileSync(sfile, "utf8"));
  ok("--detach again: reuses the running server, starts no other", sj2.pid === sj.pid && d2.includes(`review page: ${sj.url}`) && /already running/.test(d2), d2);
  const stop = cli("--stop");
  const after = await fetch(new URL("api/review", sj.base)).then(() => "answered", () => "refused");
  ok("--stop: stops it and forgets it", /stopped the review server/.test(stop) && !isAlive(sj.pid) && !existsSync(sfile) && after === "refused", `${stop} · ${after}`);
  ok("--stop with nothing running says so", /no review server running/.test(cli("--stop")));
  // where the sandbox cannot run, --detach says runs go ahead without it (the server's own line goes to its log)
  const dOff = execFileSync(process.execPath, [join(ROOT, "scripts/review.mjs"), vd, "--detach", "--no-open", "--no-notify", "--port", String(testPort(BASE_PORT, 4)), "--out", join(tmp, "bundle-off")],
    { cwd: tmp, env: { ...env, REELPLANNER_SANDBOX_PROBE_CMD: `"${process.execPath}" "${failProbe}" "${join(tmp, "probes-detach.jsonl")}"` }, encoding: "utf8", timeout: 90000 });
  const sjOff = existsSync(sfile) ? JSON.parse(readFileSync(sfile, "utf8")) : {};
  if (sjOff.pid) procs.push({ kill: () => { try { process.kill(sjOff.pid); } catch { /* gone */ } } });
  ok("--detach: where the sandbox cannot run, it prints that runs go ahead without it, and why", /unattended runs here go ahead without Claude Code's sandbox: this machine can't run it/.test(dOff) && /shell commands aren't fenced to the repo/.test(dOff), dOff);
  const dOff2 = cli(vd, "--detach", "--no-open", "--no-notify");
  ok("--detach again: the running server's line is said again", /go ahead without Claude Code's sandbox/.test(dOff2), dOff2);
  cli("--stop");

  // ---------- --detach in a repo with no set-up .reelplanner/ (one video): recorded in the machine's inbox, nothing in the repo ----------
  {
    const quick = join(mkdtempSync(join(tmpdir(), "reel-loop-quick-")), "quick"), qv = join(quick, "videos", "demo");
    procs.push({ kill: () => rmSync(dirname(quick), { recursive: true, force: true }) });
    mkdirSync(join(qv, "compositions"), { recursive: true }); execFileSync("git", ["-C", quick, "init", "-q"]);
    writeFileSync(join(qv, "index.html"), "<!doctype html><title>demo</title>\n");
    writeFileSync(join(qv, "plan-map.json"), JSON.stringify({ ...MAP, project: "demo", planDir: null }));
    const qcli = (...a) => execFileSync(process.execPath, [join(ROOT, "scripts/review.mjs"), ...a], { cwd: quick, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 90000 });
    const qbox = join(youHome, "inbox", repoKey(quick)), qfile = join(qbox, ".server.json");
    const q1 = qcli(qv, "--detach", "--no-open", "--no-notify", "--port", String(testPort(BASE_PORT, 4)), "--out", join(tmp, "bundle-quick"));
    const qj = existsSync(qfile) ? JSON.parse(readFileSync(qfile, "utf8")) : {};
    if (qj.pid) procs.push({ kill: () => { try { process.kill(qj.pid); } catch { /* gone */ } } });
    ok("--detach, one video: runs on its own, recorded in the machine's inbox for the repo, logging there", !!qj.pid && isAlive(qj.pid) && q1.includes(`review page: ${qj.url}`)
      && /review page:/.test(readFileSync(join(qbox, "server.log"), "utf8")), `${q1}\n${JSON.stringify(qj)}`);
    ok("--detach, one video: nothing added to the repo", !existsSync(join(quick, ".reelplanner")) && readdirSync(quick).sort().join() === ".git,videos", readdirSync(quick).join());
    const qget = await fetch(new URL("api/review", qj.base)).then((r) => r.json()).catch((e) => ({ error: e.message }));
    ok("--detach, one video: its page takes Send (GET /api/review answers, kept on this machine)", qget.ok === true && qget.where === "machine", JSON.stringify(qget));
    const q2 = qcli(qv, "--detach", "--no-open", "--no-notify");
    ok("--detach again, one video: reuses it", JSON.parse(readFileSync(qfile, "utf8")).pid === qj.pid && /already running/.test(q2), q2);
    const qstop = qcli("--stop");
    ok("--stop, one video: stops it and forgets it", /stopped the review server/.test(qstop) && !isAlive(qj.pid) && !existsSync(qfile), qstop);
  }
} catch (e) {
  failed++; console.log(`✗ ${e.stack}`);
} finally {
  for (const p of procs) try { p.kill(); } catch { /* gone */ }
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ loop: all passed");
process.exit(failed ? 1 : 0);
