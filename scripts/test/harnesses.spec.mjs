// The coding-agent boundary: literal commands, feature checks, identity and saved-path notification.
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, realpathSync } from "node:fs";
import { join, delimiter } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { getHarness, harnessForCommand, activeSession, detectAgent, CODEX_COMMAND } from "../lib/agents.mjs";
import { splitCommand } from "../lib/notify.mjs";
import { shellQuote } from "../lib/env.mjs";

const scratch = mkdtempSync(join(tmpdir(), "rp-harnesses-"));
const check = (name, test) => { test(); console.log(`✓ ${name}`); };
const id = "11111111-1111-4111-8111-111111111111";
let server, websocket, checker = false;
try {
  const home = join(scratch, "codex-home"), repo = join(scratch, "project"), inbox = join(scratch, "machine-inbox");
  for (const dir of [home, repo, inbox, join(home, "sessions")]) mkdirSync(dir, { recursive: true });
  const legacy = join(home, "sessions", "active.jsonl");
  writeFileSync(legacy, JSON.stringify({ type: "session_meta", payload: { id, cwd: repo, source: "cli" } }) + "\n");
  const log = join(scratch, "queue.json"), binary = join(scratch, "codex");
  const socketPath = join(scratch, "live.sock");
  server = createServer(); websocket = new WebSocketServer({ server });
  websocket.on("connection", (socket) => socket.on("message", (line) => {
    const request = JSON.parse(String(line)); if (!request.id) return;
    assert.ok(["initialize", "thread/read"].includes(request.method));
    if (request.method === "thread/read") assert.equal(request.params.includeTurns, false);
    socket.send(JSON.stringify({ id: request.id, result: request.method === "initialize" ? {} : { thread: {
      id, cwd: realpathSync(repo), source: checker ? { subAgent: "review" } : "cli", status: { type: "idle" },
    } } }));
  }));
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(socketPath, resolve); });
  writeFileSync(binary, `#!${process.execPath}\nimport fs from 'node:fs';
const args=process.argv.slice(2);
if(args.includes('--version')) console.log('codex-cli 0.162.1');
else if(args.includes('--help')) {
  fs.writeFileSync(process.env.CODEX_HOME+'/probe.marker','temporary');
  console.log(process.env.RP_OLD_HELP==='1'?'Usage: codex exec':'Usage: codex exec --approve-for-me --thread --message marketplace add MCP app-server');
} else if(args[0]==='queue') { fs.writeFileSync(process.env.RP_QUEUE_LOG,JSON.stringify({args,cwd:process.cwd()})); console.log('queued'); }
else if(args[0]==='app-server' && args[1]==='daemon') console.log(JSON.stringify({status:'running',socketPath:process.env.RP_RPC_SOCKET}));
`, { mode: 0o755 });
  const env = { ...process.env, PATH: scratch + delimiter + process.env.PATH, CODEX_HOME: home, CODEX_THREAD_ID: id, RP_QUEUE_LOG: log, RP_RPC_SOCKET: socketPath };
  const modern = await getHarness("codex").probe({ repo, env, executable: binary });
  check("capability checks isolate Codex's writable helper state from the user's selected home", () => {
    assert.equal(modern.available, true); assert.equal(modern.version, "0.162.1"); assert.equal(modern.capabilities.queue, true);
    assert.equal(modern.capabilities.automaticReview, true); assert.equal(existsSync(join(home, "probe.marker")), false);
  });
  const old = await getHarness("codex").probe({ repo, env: { ...env, RP_OLD_HELP: "1" }, executable: binary });
  check("older capabilities report the inbox fallback rather than claiming current notifications", () => {
    assert.equal(old.capabilities.queue, false); assert.equal(old.capabilities.automaticReview, false);
    assert.match(old.limitations.join(" "), /inbox/);
  });
  const none = await getHarness("none").probe({ repo, env });
  check("no selected coding agent gives a useful explanation without trying a fictitious command", () => {
    assert.equal(none.available, false); assert.match(none.limitations.join(" "), /No coding agent/);
  });
  const argv = splitCommand(CODEX_COMMAND);
  check("the default uses the real CLI-compatible automatic-review configuration", () => {
    assert.equal(argv.includes("--approve-for-me"), true); assert.equal(argv.includes("-s"), false);
    assert.equal(argv.includes('sandbox_mode="workspace-write"'), true);
    assert.equal(argv.includes("--dangerously-bypass-approvals-and-sandbox"), false);
  });
  const launched = await getHarness("codex").headless({ repo, argv, env: { ...env, CLAUDECODE: "stale", CLAUDE_SESSION_ID: "stale",
    CODEX_SANDBOX: "parent", REELPLANNER_OWNER: "previous", CLAUDE_CODE_USE_BEDROCK: "1" } });
  check("a new run loses parent identities while preserving storage and provider settings", () => {
    assert.deepEqual(launched.argv, argv); assert.equal(launched.env.CODEX_THREAD_ID, undefined);
    assert.equal(launched.env.CLAUDE_SESSION_ID, undefined); assert.equal(launched.env.REELPLANNER_OWNER, undefined);
    assert.equal(launched.env.CODEX_HOME, home); assert.equal(launched.env.CLAUDE_CODE_USE_BEDROCK, "1");
    assert.match(launched.commitAdvice, /does not automatically escape/);
  });
  check("active thread identity takes precedence over an inherited ambient agent marker", () => {
    assert.equal(activeSession({ CODEX_THREAD_ID: id, CLAUDECODE: "stale" }).key, `codex:${id}`);
    assert.equal(detectAgent({ CODEX_THREAD_ID: id, CLAUDECODE: "stale" }).agent, "codex");
  });
  check("an unknown configured command stays generic and keeps its permission advice", () => {
    assert.equal(harnessForCommand(["custom-coder", "--task"]).id, "command");
    assert.match(getHarness("command").commitAdvice, /configured coding agent/);
  });
  const item = join(inbox, "saved review's.json");
  writeFileSync(item, JSON.stringify({ annotations: [{ comment: "do not include this annotation in the queued prompt" }] }));
  const sent = await getHarness("codex").deliver({ repo, env, session: `codex:${id}`, inboxPath: item, inboxRoot: inbox, executable: binary });
  check("a machine-local inbox uses the same verified session notification and literal arguments", () => {
    assert.equal(sent.status, "delivered"); const queued = JSON.parse(readFileSync(log, "utf8"));
    assert.equal(queued.cwd, realpathSync(repo)); assert.deepEqual(queued.args.slice(0, 5), ["queue", "--remote", `unix://${socketPath}`, "--thread", id]);
    const message = queued.args[queued.args.indexOf("--message") + 1];
    assert.equal(message.includes(realpathSync(item)), true); assert.equal(message.includes("do not include this annotation"), false);
    assert.match(message, /older item first/);
    assert.ok(message.includes(`inbox --wait --timeout 1 --repo ${shellQuote(realpathSync(repo))}`));
    assert.ok(message.includes(`keep --repo ${shellQuote(realpathSync(repo))} on every inbox command`));
    assert.match(message, /run reel-intake from that repository folder/);
  });
  const foreign = join(scratch, "not-in-inbox.json"); writeFileSync(foreign, "{}");
  const rejected = await getHarness("codex").deliver({ repo, env, session: `codex:${id}`, inboxPath: foreign, inboxRoot: inbox, executable: binary });
  check("notification rejects an item outside the validated inbox root", () => assert.equal(rejected.status, "error"));
  writeFileSync(legacy, JSON.stringify({ type: "session_meta", payload: { id, cwd: repo, source: "cli", parent_thread_id: "parent" } }) + "\n");
  checker = true;
  await assert.rejects(getHarness("codex").verifySession({ repo, env, session: `codex:${id}` }), /main Codex conversation/);
  console.log("✓ connection rejects a checker even when its thread ID and project match");
  check("quoted procedural commands preserve special characters as literal path text", () => {
    const text = "path's $PATH $(printf wrong) `printf wrong` with spaces";
    assert.equal(execFileSync("/bin/sh", ["-c", `printf '%s' ${shellQuote(text)}`], { encoding: "utf8" }), text);
  });
} finally {
  for (const socket of websocket?.clients || []) socket.terminate();
  websocket?.close();
  if (server?.listening) await new Promise((done) => server.close(done));
  rmSync(scratch, { recursive: true, force: true });
}
