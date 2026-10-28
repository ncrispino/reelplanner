#!/usr/bin/env node
// A review page a Claude Code session opened, and the skill's Stop hook (scripts/review-hook.mjs), in a scratch repo:
// no model, no review server (a live process stands in for it).
//   identity    — Claude Code's CLAUDE_CODE_SESSION_ID names the session (Codex's thread first); a new run loses it
//   note        — kept for a Claude Code session only, one per inbox; a review its waiter claims clears it, a question not
//   unwaited    — a page is asked about while its server runs and no waiter of this session beats in its inbox
//   hook        — the CLI says it as guidance, with the page and the waiter's command; quiet when Claude Code is already
//                 continuing for a stop hook, a waiter task is running, it is another session, the server stopped, or
//                 it cannot read its input
//   connection  — a connected session that cannot be verified any more is dropped; one that only failed to queue is kept
//   skill       — the skill declares the hook, and a missing CLI never fails the turn
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { ROOT } from "../lib/env.mjs";
import { activeSession, childAgentEnv, getHarness } from "../lib/agents.mjs";
import { notePage, pagesUnwaited, startHeartbeat, waitForReview, writeReview, writeQuestion, answerQuestion, connectSession, connectionOf, deliverInbox, dropConnection } from "../lib/inbox.mjs";

const scratch = mkdtempSync(join(tmpdir(), "rp-review-hook-"));
// run alone from inside an agent, this spec is still no session's (the runner does the same for every spec)
for (const key of ["CLAUDE_CODE_SESSION_ID", "CLAUDE_SESSION_ID", "CODEX_THREAD_ID", "REELPLANNER_OWNER"]) delete process.env[key];
process.env.REELPLANNER_HOME = join(scratch, "home");
const check = async (name, test) => { await test(); console.log(`✓ ${name}`); };
const ME = "spec-claude-1", session = `claude:${ME}`, url = "http://127.0.0.1:8799/?project=demo";
const notes = () => join(scratch, "home", "pages", `claude-${ME}.json`);
const hook = (input, args = ["stop"]) => spawnSync(process.execPath, [join(ROOT, "bin/reelplanner.mjs"), "review-hook", ...args],
  { input: typeof input === "string" ? input : JSON.stringify(input), encoding: "utf8", env: process.env, timeout: 30000 });
const stopInput = (extra = {}) => ({ session_id: ME, hook_event_name: "Stop", stop_hook_active: false, background_tasks: [], ...extra });
const row = (n) => ({ project: "demo", submittedAt: `2026-01-01T00:00:0${n}Z`, review: { annotations: [] } });
const repo = join(scratch, "repo"), rp = join(repo, ".reelplanner"), serverJson = join(rp, "inbox", ".server.json");
mkdirSync(join(rp, "inbox"), { recursive: true }); writeFileSync(join(rp, "config.json"), "{}");
// the review server: a process that runs until this spec stops it, and one that has ended
const server = spawn(process.execPath, ["-e", "setInterval(() => {}, 1e6)"], { stdio: "ignore" });
const ended = spawnSync(process.execPath, ["-e", "console.log(process.pid)"], { encoding: "utf8" }), deadPid = Number(ended.stdout.trim());
writeFileSync(serverJson, JSON.stringify({ pid: server.pid, base: "http://127.0.0.1:8799/" }) + "\n");
try {
  await check("identity: Claude Code's CLAUDE_CODE_SESSION_ID names the session, Codex's thread first, a new run loses it", () => {
    assert.deepEqual(activeSession({ CLAUDE_CODE_SESSION_ID: ME }), { agent: "claude", id: ME, key: session });
    assert.equal(activeSession({ CLAUDE_SESSION_ID: "older" }).key, "claude:older");
    assert.equal(activeSession({ CODEX_THREAD_ID: "t1", CLAUDE_CODE_SESSION_ID: ME }).key, "codex:t1");
    assert.equal(childAgentEnv({ CLAUDE_CODE_SESSION_ID: ME, PATH: "/bin" }).CLAUDE_CODE_SESSION_ID, undefined);
  });

  await check("note: kept for a Claude Code session only, one per inbox, the latest page", () => {
    assert.equal(notePage(rp, { url, server: server.pid, env: {} }), null);
    assert.equal(notePage(rp, { url, server: server.pid, env: { CODEX_THREAD_ID: "t1" } }), null);
    assert(!existsSync(notes()));
    assert.equal(notePage(rp, { url: `${url}-old`, server: server.pid, env: { CLAUDE_CODE_SESSION_ID: ME } }), session);
    assert.equal(notePage(rp, { url, server: server.pid, wait: "reelplanner review --wait", env: { CLAUDE_CODE_SESSION_ID: ME } }), session);
    const { pages } = JSON.parse(readFileSync(notes(), "utf8"));
    assert.equal(pages.length, 1); assert.equal(pages[0].url, url); assert.equal(pages[0].box, realpathSync(rp)); assert.equal(pages[0].server, server.pid);
  });

  await check("unwaited: while its server runs and no waiter of this session beats in its inbox (another session's does not count)", () => {
    assert.equal(pagesUnwaited(session).length, 1);
    const theirs = startHeartbeat(rp, { session: "claude:someone-else" });
    assert.equal(pagesUnwaited(session).length, 1); theirs();
    const mine = startHeartbeat(rp, { session });
    assert.equal(pagesUnwaited(session).length, 0); mine();
    assert.equal(pagesUnwaited(session).length, 1);
  });

  await check("hook: says it once per stop, as guidance, with the page and the waiter's command", () => {
    const r = hook(stopInput());
    assert.equal(r.status, 0, r.stderr);
    const out = JSON.parse(r.stdout);
    assert.equal(out.decision, undefined); assert.equal(out.hookSpecificOutput.hookEventName, "Stop");
    const said = out.hookSpecificOutput.additionalContext;
    assert(said.includes(url) && said.includes("`reelplanner review --wait`") && /background task/.test(said) && /Send would only be saved/.test(said), said);
    // a waiter that has ended is not waiting
    assert.notEqual(hook(stopInput({ background_tasks: [{ id: "b0", type: "shell", status: "completed", command: "reelplanner review --wait" }] })).stdout, "");
  });

  await check("hook: quiet when already continuing for a stop hook, a waiter task runs, it is another session or none, or it cannot read its input", () => {
    const quiet = { "already continuing": stopInput({ stop_hook_active: true }),
      "a waiter task running": stopInput({ background_tasks: [{ id: "b1", type: "shell", status: "running", command: "node bin/reelplanner.mjs review --wait" }] }),
      "another session": stopInput({ session_id: "someone-else" }), "no session": stopInput({ session_id: undefined }),
      "a session id that is not one": stopInput({ session_id: "../x" }), "not JSON": "not json", "nothing": "" };
    for (const [why, input] of Object.entries(quiet)) { const r = hook(input); assert.equal(r.status, 0, why); assert.equal(r.stdout, "", why); }
    const mine = startHeartbeat(rp, { session });
    const r = hook(stopInput()); mine();
    assert.equal(r.stdout, "", "this session's waiter beating");
    assert.equal(hook("", ["--help"]).status, 0); assert.equal(hook("", ["start"]).status, 1);
  });

  await check("note: a question its waiter takes leaves the page noted; a review it claims clears it", async () => {
    process.env.CLAUDE_CODE_SESSION_ID = ME;
    try {
      const q = writeQuestion(rp, { id: "q-hook", question: "What is this?", video: "demo" });
      assert.equal(await waitForReview(rp, { owner: session, timeoutMs: 3000, pollMs: 20 }), q.path);
      assert(existsSync(notes()), "a question is not the review the page waits for");
      answerQuestion(rp, q.id, "A demo.", "the plan", { owner: session });
      const w = writeReview(rp, row(1));
      assert.equal(await waitForReview(rp, { owner: session, timeoutMs: 3000, pollMs: 20 }), w.path);
      assert(!existsSync(notes()), "a claimed review clears the note");
    } finally { delete process.env.CLAUDE_CODE_SESSION_ID; }
  });

  await check("unwaited: a page whose server stopped, or another server took its place, is dropped, and the hook is quiet", () => {
    notePage(rp, { url, server: deadPid, env: { CLAUDE_CODE_SESSION_ID: ME } });
    assert.equal(pagesUnwaited(session).length, 0); assert(!existsSync(notes()), "another server serves the inbox now");
    writeFileSync(serverJson, JSON.stringify({ pid: deadPid }) + "\n");
    notePage(rp, { url, server: deadPid, env: { CLAUDE_CODE_SESSION_ID: ME } });
    assert.equal(hook(stopInput()).stdout, ""); assert(!existsSync(notes()), "its server stopped");
    writeFileSync(serverJson, JSON.stringify({ pid: server.pid }) + "\n");
  });

  await check("connection: one that cannot be verified any more is dropped; one that only failed to queue is kept", async () => {
    const verify = { verifySession: async () => ({ endpoint: null }) };
    await connectSession(rp, { repo, session: "fake:old", adapter: verify });
    const stayed = await deliverInbox(rp, writeReview(rp, row(2)).id, { adapter: { ...verify, deliver: async () => ({ status: "unavailable", reason: "queue down" }) }, start: async () => ({ started: false }) });
    assert.equal(stayed.handledBy, "inbox"); assert.equal(connectionOf(rp)?.session, "fake:old");
    const gone = await deliverInbox(rp, writeReview(rp, row(3)).id, { adapter: { ...verify, deliver: async () => ({ status: "gone", reason: "not loaded" }) }, start: async () => ({ started: false }) });
    assert.equal(gone.handledBy, "inbox"); assert.equal(connectionOf(rp), null);
    await connectSession(rp, { repo, session: "fake:old", adapter: verify });
    assert.equal(dropConnection(rp, { session: "fake:other" }), null); assert.equal(connectionOf(rp)?.session, "fake:old");
    assert.equal(dropConnection(rp)?.session, "fake:old"); assert.equal(connectionOf(rp), null);
    // Codex: a session that no longer verifies is reported gone, not thrown
    const codex = getHarness("codex");
    const r = await codex.deliver.call({ ...codex, verifySession: async () => { throw new Error("Codex conversation x is not loaded on the selected endpoint"); } },
      { repo, session: "codex:x", inboxPath: join(rp, "inbox", "none.json"), inboxRoot: join(rp, "inbox") });
    assert.equal(r.status, "gone"); assert.match(r.reason, /not loaded/);
  });

  await check("skill: declares the Stop hook, and a shell without reelplanner on its PATH ends the turn as it would", () => {
    const front = readFileSync(join(ROOT, "skills/plan-to-video/SKILL.md"), "utf8").split("\n---\n")[0];
    const command = front.match(/\n {2}Stop:\n {4}- hooks:\n {8}- type: command\n {10}command: "(.+)"\n {10}timeout: \d+$/)?.[1];
    assert.equal(command, "command -v reelplanner >/dev/null 2>&1 && reelplanner review-hook stop || true", front);
    const r = spawnSync("/bin/sh", ["-c", command], { input: JSON.stringify(stopInput()), encoding: "utf8", env: { PATH: "/usr/bin:/bin", HOME: scratch } });
    assert.equal(r.status, 0); assert.equal(r.stdout, "");
  });
} finally {
  server.kill();
  rmSync(scratch, { recursive: true, force: true });
}
