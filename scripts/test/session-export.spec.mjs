#!/usr/bin/env node
// Read-only session discovery/export against fake homes and a fake documented JSON-RPC server.
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, symlinkSync, utimesSync, rmSync, existsSync, realpathSync, statSync } from "node:fs";
import { join, delimiter } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { codexSessionMetadata, codexSessionSource, codexFileMetadata, exportCodexSession, verifyCodexSessionEndpoint, discoverCodexSessionEndpoint } from "../lib/codex-session.mjs";
import { pinSource } from "../lib/explainer.mjs";
import { ROOT } from "../lib/env.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-session-spec-")), repo = join(tmp, "repo"), other = join(tmp, "other"), home = join(tmp, "home"), bin = join(tmp, "bin"), codexHome = join(tmp, "custom-codex");
for (const p of [repo, other, home, bin, codexHome]) mkdirSync(p, { recursive: true });
const trace = join(tmp, "rpc.jsonl");
const socketPath = join("/tmp", `rp-session-${process.pid}-${Date.now()}.sock`), endpoint = `unix://${socketPath}`;
const env = { ...process.env, HOME: home, CODEX_HOME: codexHome, CODEX_THREAD_ID: "active", CODEX_SANDBOX: "1", CLAUDECODE: "", CLAUDE_CODE_ENTRYPOINT: "", PATH: `${bin}${delimiter}${process.env.PATH}`, MOCK_REPO: repo, MOCK_OTHER: other, MOCK_TRACE: trace, MOCK_SOCKET: socketPath };
const fake = join(bin, "codex");
writeFileSync(fake, `#!${process.execPath}
const fs = require('node:fs'); const readline = require('node:readline');
const mode = process.env.MOCK_MODE || ''; const repo = process.env.MOCK_REPO;
const listed = process.env.MOCK_THREADS ? JSON.parse(process.env.MOCK_THREADS) : null, readable = JSON.parse(process.env.MOCK_READ_THREADS || '[]');
if (process.argv.includes('version')) { console.log(JSON.stringify({status:mode === 'daemon-stopped' ? 'stopped' : 'running',socketPath:process.env.MOCK_SOCKET})); process.exit(0); }
const thread = (id, extra = {}) => ({ id, cwd: repo, source: mode === 'endpoint-checker' ? 'subAgent' : 'cli', status:{type:mode === 'endpoint-unloaded' ? 'notLoaded' : 'active'}, updatedAt: id === 'new-main' ? 500 : 100, historyMode: mode === 'legacy-api' ? 'legacy' : 'paginated', ...[...(listed || []), ...readable].find(t => t.id === id), ...extra });
const turns = (n) => [{id:'turn-'+n,status:'completed',itemsView:'full',items:[{id:'user-'+n,type:'userMessage',content:[{type:'text',text:'visible user '+n}]},{id:'agent-'+n,type:'agentMessage',text:'visible answer '+n},{id:'tool-'+n,type:'commandExecution',command:'npm test',aggregatedOutput:'tests passed',status:'completed'},{id:'private-'+n,type:'reasoning',content:['private reasoning'],summary:[]}]}];
readline.createInterface({ input: process.stdin }).on('line', line => {
 const m = JSON.parse(line); fs.appendFileSync(process.env.MOCK_TRACE, JSON.stringify({method:m.method,params:m.params})+'\\n');
 if (m.id == null) return;
 if (mode === 'exit') process.exit(1);
 if (mode === 'malformed') { process.stdout.write('not JSON\\n'); return; }
 let result;
 if (m.method === 'initialize') result = {};
 else if (m.method === 'thread/read') {
   if (mode === 'missing') { process.stdout.write(JSON.stringify({id:m.id,error:{code:-32000,message:'sensitive contents must not appear'}})+'\\n'); return; }
   result = { thread:{...thread(mode === 'wrong-id' ? 'unrelated' : m.params.threadId,{ cwd:mode === 'wrong-repo' ? process.env.MOCK_OTHER : mode === 'missing-repo' ? undefined : repo, ...(mode === 'missing-id' ? {id:undefined} : {}), ...(m.params.includeTurns ? {turns:turns(1)} : {}) }), ...JSON.parse(process.env.MOCK_READ_OVERRIDES || '{}')} };
 } else if (m.method === 'thread/list') result = listed ? {data:listed,nextCursor:null} : {data:m.params.cursor ? [thread('new-main')] : [thread('checker',{source:{subAgent:'review'},parentThreadId:'active',updatedAt:900}),thread('other',{cwd:process.env.MOCK_OTHER,updatedAt:999})],nextCursor:m.params.cursor ? null : 'next-list'};
 else if (m.method === 'thread/turns/list') {
   if (mode === 'unsupported' || mode === 'legacy-api') { process.stdout.write(JSON.stringify({id:m.id,error:{code:-32601,message:'unsupported method'}})+'\\n'); return; }
   if (mode === 'page-failure' && m.params.cursor) { process.stdout.write(JSON.stringify({id:m.id,error:{code:-32000,message:'sensitive page error'}})+'\\n'); return; }
   result = {data: turns(m.params.cursor ? 2 : 1),nextCursor:mode === 'repeat-cursor' ? 'repeat' : m.params.cursor ? null : 'next-turns'};
   if (mode === 'summary') result.data[0].itemsView='summary';
 } else { process.stdout.write(JSON.stringify({id:m.id,error:{code:-32601,message:'mutation or unknown method'}})+'\\n'); return; }
 process.stdout.write(JSON.stringify({id:m.id,result})+'\\n');
});
`);
chmodSync(fake, 0o755);
const calls = () => existsSync(trace) ? readFileSync(trace, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : [];
const clear = () => writeFileSync(trace, "");
const rollout = (name, id, cwd, source = "cli", date = 100) => {
  const path = join(codexHome, "sessions", "2026", "10", "11", name); mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify({ type: "session_meta", payload: { id, cwd, source } }) + "\n" + JSON.stringify({ type: "response_item", payload: { role: "user", content: "legacy visible" } }) + "\n");
  utimesSync(path, date, date); return realpathSync(path);
};
let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.log(`✗ ${name}: ${e.message}`); } };
const testAsync = async (name, fn) => { try { await fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.log(`✗ ${name}: ${e.message}`); } };
const http = createServer(), sockets = new WebSocketServer({ server: http }); let endpointMode = "", upgradeSeen = false;
http.on("upgrade", () => upgradeSeen = true);
sockets.on("connection", (socket) => socket.on("message", (data) => {
  const m = JSON.parse(String(data)); const rows=calls(); rows.push({method:m.method,params:m.params}); writeFileSync(trace,rows.map(JSON.stringify).join("\n")+"\n"); if(m.id==null)return;
  if(endpointMode==="malformed"){socket.send("broken JSON");return;}
  if(endpointMode==="missing"){socket.send(JSON.stringify({id:m.id,error:{code:-32000,message:"sensitive error body"}}));return;}
  const result = m.method === "initialize" ? {} : {thread:{id:endpointMode==="wrong-id"?"other":m.params.threadId,cwd:endpointMode==="wrong-repo"?other:endpointMode==="missing-repo"?undefined:repo,source:endpointMode==="endpoint-checker"?{subAgent:"review"}:"cli",status:{type:endpointMode==="endpoint-unloaded"?"notLoaded":"active"}}};
  socket.send(JSON.stringify({id:m.id,result}));
}));
try {
  await new Promise((resolve,reject)=>{http.once("error",reject);http.listen(socketPath,resolve);});
  execFileSync("git", ["init", "-q", "-b", "main", repo]);
  const main = rollout("main.jsonl", "active", repo);
  rollout("newer-checker.jsonl", "checker", repo, { subagent: { thread_spawn: { parent_thread_id: "active" } } }, 500);
  rollout("newer-other.jsonl", "elsewhere", other, "cli", 900);
  rollout("newer-main.jsonl", "legacy-main", repo, "cli", 300);
  writeFileSync(join(codexHome, "sessions", "malformed.jsonl"), "{broken\n");
  test("active identity beats newer main, checker and other repo; custom CODEX_HOME", () => { clear(); const s = codexSessionMetadata({ repo, env }); assert.equal(s.path, main); assert.equal(s.id, "active"); assert.equal(s.main, true); assert.equal(calls().length, 0); });
  test("canonical repo symlinks match exact metadata", () => { const link = join(tmp, "repo-link"); symlinkSync(repo, link); assert.equal(codexSessionMetadata({ repo: link, env }).repo, realpathSync(repo)); });
  test("no active ID selects current paginated main; excludes newer checker and other repo across pages", () => { clear(); const s = codexSessionMetadata({ repo, env: { ...env, CODEX_THREAD_ID: "" } }); assert.equal(s.id, "new-main"); assert.equal(s.main, true); const listing = calls().filter(c => c.method === "thread/list"); assert.equal(listing.length, 2); assert.equal(listing[0].params.useStateDbOnly, true); });
  test("unsupported store with no active identity preserves newest eligible legacy main fallback", () => { const s = codexSessionMetadata({ repo, env: { ...env, CODEX_THREAD_ID: "", MOCK_MODE: "exit" } }); assert.equal(s.id, "legacy-main"); });
  const rankingHome = join(tmp, "ranking-home"); mkdirSync(rankingHome);
  const candidate = (id, updatedAt, extra = {}) => ({ id, cwd: repo, source: "cli", historyMode: "paginated", updatedAt, ...extra });
  const rankFile = (id, date, cwd = repo, source = "cli") => {
    const path = join(rankingHome, "sessions", `${id}.jsonl`); mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, JSON.stringify({ type: "session_meta", payload: { id, cwd, source } }) + "\n" + JSON.stringify({ type: "response_item", payload: { role: "user", content: "synthetic ranking history" } }) + "\n");
    utimesSync(path, date, date); return realpathSync(path);
  };
  const rankEnv = (threads, extra = {}) => ({ ...env, CODEX_HOME: rankingHome, CODEX_THREAD_ID: "", MOCK_MODE: "", MOCK_THREADS: JSON.stringify(threads), ...extra });
  const rankTest = (name, fn) => test(name, () => { rmSync(join(rankingHome, "sessions"), { recursive: true, force: true }); clear(); fn(); });
  rankTest("newer eligible legacy main beats available older API main; discovery reads metadata only", () => {
    const path = rankFile("rank-legacy", 2000); const selected = codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", 1000)]) });
    assert.equal(selected.id, "rank-legacy"); assert.equal(selected.path, path); assert.equal(selected.updatedAt, 2000);
    assert(calls().every(c => ["initialize", "initialized", "thread/list"].includes(c.method)));
  });
  rankTest("newer API main beats older legacy main using the same seconds scale", () => {
    rankFile("rank-legacy", 1000); const selected = codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", 2000)]) });
    assert.equal(selected.id, "rank-api"); assert.equal(selected.updatedAt, 2000); assert.equal(selected.path, null);
    assert(calls().filter(c => c.method === "thread/read").every(c => c.params.threadId === "rank-api" && c.params.includeTurns === false));
  });
  rankTest("equal valid timestamps retain API preference, including the Unix epoch", () => {
    for (const date of [0, 2000]) {
      rankFile("rank-legacy", date); assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", date)]) }).id, "rank-api");
    }
  });
  rankTest("missing or invalid competing API time requires explicit ID without silent legacy fallback", () => {
    rankFile("rank-legacy", 2000);
    for (const date of [undefined, null, "not-a-time", -1]) {
      assert.throws(() => codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", date)]) }), /timestamps.*explicit --thread/);
    }
  });
  rankTest("a sole API identity or the same identity in both stores needs no relative timestamp", () => {
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", null)]) }).id, "rank-api");
    rankFile("rank-api", 2000); assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", null)]) }).id, "rank-api");
  });
  rankTest("newer child/checker/other-repo records in either store cannot displace an eligible legacy main", () => {
    rankFile("rank-legacy", 2000); rankFile("rank-child", 9999, repo, { subAgent: "review" }); rankFile("rank-other", 99999, other);
    const threads = [candidate("rank-api", 1000), candidate("api-child", 99999, { parentThreadId: "rank-api" }), candidate("api-checker", 999999, { source: { subAgent: "review" } }), candidate("api-other", 9999999, { cwd: other })];
    assert.equal(codexSessionMetadata({ repo, env: rankEnv(threads) }).id, "rank-legacy");
  });
  rankTest("API-only, legacy-only, unavailable API and neither-source cases retain explicit outcomes", () => {
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", 2000)]) }).id, "rank-api");
    assert.throws(() => codexSessionMetadata({ repo, env: rankEnv([]) }), /no eligible main/);
    rankFile("rank-legacy", 2000);
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([]) }).id, "rank-legacy");
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([], { MOCK_MODE: "exit" }) }).id, "rank-legacy");
  });
  rankTest("explicit legacy/API IDs dominate newer competing sources and never fall back to another ID", () => {
    rankFile("requested-legacy", 1000); rankFile("newer-legacy", 9999);
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", 99999)], { CODEX_THREAD_ID: "requested-legacy" }) }).id, "requested-legacy"); assert.equal(calls().length, 0);
    assert.equal(codexSessionMetadata({ repo, env: rankEnv([candidate("requested-api", 1000)], { CODEX_THREAD_ID: "requested-api" }) }).id, "requested-api");
    assert.throws(() => codexSessionSource({ repo, env: rankEnv([candidate("rank-api", 99999)], { CODEX_THREAD_ID: "absent", MOCK_MODE: "missing" }) }), /Codex conversation absent/);
  });
  rankTest("implicitly selected API metadata must still be main and match the canonical repo", () => {
    rankFile("rank-legacy", 1000);
    for (const override of [{ parentThreadId: "another-main" }, { source: { subAgent: "review" } }, { cwd: other }, { id: "different-thread" }]) {
      assert.throws(() => codexSessionMetadata({ repo, env: rankEnv([candidate("rank-api", 2000)], { MOCK_READ_OVERRIDES: JSON.stringify(override) }) }), /Codex conversation/);
    }
  });
  rankTest("no-ID export uses the globally newest identity; unavailable winner never becomes an older source", () => {
    rankFile("rank-legacy", 2000);
    const settings = rankEnv([candidate("rank-api", 1000)], { MOCK_READ_THREADS: JSON.stringify([candidate("rank-legacy", 2000)]) });
    const output = join(tmp, "rank-export.jsonl"), selected = exportCodexSession({ repo, env: settings, output });
    assert.equal(selected.id, "rank-legacy"); assert.equal(JSON.parse(readFileSync(output, "utf8").split("\n")[0]).payload.id, "rank-legacy");
    assert(calls().filter(c => c.method === "thread/read" || c.method === "thread/turns/list").every(c => c.params.threadId === "rank-legacy"));
    assert.throws(() => exportCodexSession({ repo, env: { ...settings, MOCK_MODE: "missing" }, output: join(tmp, "rank-missing.jsonl") }), /Codex conversation rank-legacy/);
    assert(!existsSync(join(tmp, "rank-missing.jsonl")));
  });
  test("requested absent thread never substitutes another saved main", () => { assert.throws(() => codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "absent", MOCK_MODE: "missing" } }), /Codex conversation absent.*external copy/); });
  test("unreadable active rollout and failed export never use another readable main", () => {
    const unreadable = rollout("unreadable.jsonl", "unreadable-thread", repo); chmodSync(unreadable, 0o000);
    try { assert.throws(() => codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "unreadable-thread", MOCK_MODE: "missing" } }), /Codex conversation unreadable-thread/); }
    finally { chmodSync(unreadable, 0o600); }
  });
  test("identity-only or migrated rollout triggers same-thread automatic export", () => {
    const stub = rollout("stub.jsonl", "stub-thread", repo); writeFileSync(stub, JSON.stringify({ type: "session_meta", payload: { id: "stub-thread", cwd: repo, source: "cli", history_mode: "paginated" } }) + "\n");
    clear(); const selected = codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "stub-thread" } }); assert.equal(selected.id, "stub-thread"); assert.ok(selected.exported); assert.notEqual(selected.path, stub); assert.ok(calls().some(c => c.method === "thread/turns/list" && c.params.threadId === "stub-thread")); rmSync(join(selected.path, ".."), { recursive: true });
  });
  for (const mode of ["wrong-id", "wrong-repo", "missing-id", "missing-repo", "malformed", "exit"]) test(`current metadata ${mode} is a clear error without transcript contents`, () => {
    assert.throws(() => codexSessionMetadata({ repo, env: { ...env, CODEX_THREAD_ID: "db-thread", MOCK_MODE: mode } }), e => /Codex conversation db-thread/.test(e.message) && !/sensitive/.test(e.message));
  });
  test("legacy owner copy verifies active ID and real repo; generic path stays generic", () => {
    const pin = pinSource(main, { repo, env }); assert.equal(pin.id, main); assert.equal(pin.form, "outside");
    const selected = pinSource("this-session", { repo, env, sessionSource: main }); assert.equal(selected.id, "this-session"); assert.equal(selected.path, main); assert.ok(!JSON.stringify(selected).includes("legacy visible"));
    assert.throws(() => codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "absent" }, source: main }), /mismatched thread/);
    assert.throws(() => codexSessionSource({ repo: other, env, source: main }), /mismatched repository/);
    assert.throws(() => codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "" }, source: main }), /requires the requested thread ID/);
  });
  test("unreadable owner path errors with requested identity; path symlink pins external real file", () => {
    assert.throws(() => codexFileMetadata(join(tmp, "missing"), { repo, env }), /Codex conversation active/);
    const link = join(repo, "external-session.jsonl"); symlinkSync(main, link);
    assert.equal(pinSource("this-session", { repo, env, sessionSource: link }).path, main);
  });
  test("automatic paginated export preserves all visible history, omits private reasoning, and uses only read calls", () => {
    clear(); const s = codexSessionSource({ repo, env: { ...env, CODEX_THREAD_ID: "db-thread" } }); const text = readFileSync(s.path, "utf8"), rows = text.trim().split("\n").map(JSON.parse);
    assert.equal(rows[0].type, "session_meta"); assert.equal(rows[0].payload.id, "db-thread"); assert.equal(rows[0].payload.cwd, realpathSync(repo)); assert.ok(text.includes("visible answer 1") && text.includes("visible answer 2") && text.includes("tests passed")); assert.ok(!text.includes("private reasoning")); assert.ok(!s.path.startsWith(realpathSync(repo))); assert.equal(statSync(s.path).mode & 0o777, 0o600);
    assert.ok(calls().every(c => ["initialize", "initialized", "thread/read", "thread/turns/list"].includes(c.method))); assert.ok(calls().filter(c => c.method === "thread/turns/list").every(c => c.params.itemsView === "full" && c.params.sortDirection === "asc"));
    const pin = pinSource("this-session", { repo, env: { ...env, CODEX_THREAD_ID: "db-thread" }, sessionSource: s.path }); assert.equal(pin.form, "outside"); assert.ok(!JSON.stringify(pin).includes("visible answer")); rmSync(join(s.path, ".."), { recursive: true });
  });
  for (const mode of ["unsupported", "page-failure", "repeat-cursor", "summary"]) test(`pagination ${mode} never exports a partial or unrelated transcript`, () => {
    const output = join(tmp, `failed-${mode}.jsonl`); assert.throws(() => exportCodexSession({ repo, env: { ...env, CODEX_THREAD_ID: "db-thread", MOCK_MODE: mode }, output }), /Codex conversation db-thread/); assert.equal(existsSync(output), false);
  });
  test("legacy API without pagination uses documented full read and never resumes", () => {
    clear(); const output = join(tmp, "legacy-export.jsonl"); exportCodexSession({ repo, env: { ...env, CODEX_THREAD_ID: "db-thread", MOCK_MODE: "legacy-api" }, output }); assert.ok(readFileSync(output, "utf8").includes("visible answer 1")); assert.ok(calls().some(c => c.method === "thread/read" && c.params.includeTurns === true)); assert.ok(!calls().some(c => /resume/.test(c.method)));
  });
  test("output inside repo or a symlink to repo rejected; existing output preserved", () => {
    assert.throws(() => exportCodexSession({ repo, env, output: join(repo, "private.jsonl") }), /outside the repository/);
    const dirLink = join(tmp, "inside-link"); symlinkSync(repo, dirLink); assert.throws(() => exportCodexSession({ repo, env, output: join(dirLink, "private.jsonl") }), /outside the repository/);
    const keep = join(tmp, "keep.jsonl"); writeFileSync(keep, "keep"); assert.throws(() => exportCodexSession({ repo, env, output: keep }), /EEXIST/); assert.equal(readFileSync(keep, "utf8"), "keep");
  });
  test("CLI prints only external export path and respects selected identity", () => {
    const output = join(tmp, "cli-export.jsonl"); const p = spawnSync(process.execPath, [join(ROOT, "scripts", "session.mjs"), "export", "--repo", repo, "--thread", "db-thread", "--output", output], { env, encoding: "utf8" }); assert.equal(p.status, 0, p.stderr); assert.equal(p.stdout.trim(), realpathSync(output)); assert.equal(p.stderr, ""); assert.equal(JSON.parse(readFileSync(output, "utf8").split("\n")[0]).payload.id, "db-thread");
    const bad = spawnSync(process.execPath, [join(ROOT, "scripts", "session.mjs"), "export", "--repo", repo, "--thread", "bad"], { env: { ...env, MOCK_MODE: "missing" }, encoding: "utf8" }); assert.equal(bad.status, 1); assert.match(bad.stderr, /Codex conversation bad/); assert.ok(!bad.stderr.includes("sensitive"));
  });
  test("documented codex:id and --out aliases select the same verified conversation", () => {
    const output = join(tmp, "alias-export.jsonl"); const p = spawnSync(process.execPath, [join(ROOT, "scripts", "session.mjs"), "export", "codex:db-thread", "--repo", repo, "--out", output], { env, encoding: "utf8" }); assert.equal(p.status, 0, p.stderr); assert.equal(p.stdout.trim(), realpathSync(output)); assert.equal(JSON.parse(readFileSync(output, "utf8").split("\n")[0]).payload.id, "db-thread");
    const bad = spawnSync(process.execPath, [join(ROOT, "scripts", "session.mjs"), "export", "codex:chosen", "--thread", "other", "--repo", repo], { env, encoding: "utf8" }); assert.equal(bad.status, 1); assert.match(bad.stderr, /conflicting conversation/);
  });
  await testAsync("running Unix endpoint uses an actual HTTP Upgrade and read-only WebSocket RPC", async () => {
    endpointMode="";clear(); const meta = await verifyCodexSessionEndpoint({repo, env, session:"endpoint-main", endpoint}); assert.ok(upgradeSeen);assert.equal(meta.id,"endpoint-main"); assert.equal(meta.loaded,true); assert.equal(meta.main,true); assert.equal(meta.status.type,"active"); assert.ok(calls().every(c => ["initialize","initialized","thread/read"].includes(c.method))); assert.ok(calls().filter(c => c.method === "thread/read").every(c => c.params.includeTurns === false));
  });
  for (const mode of ["endpoint-unloaded","endpoint-checker","wrong-id","wrong-repo","missing-repo","malformed","missing"]) await testAsync(`endpoint ${mode} cannot claim a live recipient`, async () => {
    endpointMode=mode;await assert.rejects(verifyCodexSessionEndpoint({repo,env,session:"endpoint-main",endpoint}));
  });
  await testAsync("daemon discovery uses running socket and exact live thread; never starts daemon or model", async () => {
    endpointMode="";clear(); const meta=await discoverCodexSessionEndpoint({repo,env,session:"endpoint-main"}); assert.equal(meta.endpoint,endpoint); assert.ok(meta.loaded);
    await assert.rejects(discoverCodexSessionEndpoint({repo,env:{...env,MOCK_MODE:"daemon-stopped"},session:"endpoint-main"}),/No verified running/);
    endpointMode="endpoint-unloaded";await assert.rejects(discoverCodexSessionEndpoint({repo,env,session:"endpoint-main"}),/not loaded/);
    assert.ok(calls().every(c => ["initialize","initialized","thread/read"].includes(c.method)));
  });
  await testAsync("endpoint credentials and URL fragments never reach a transport or leak into errors", async () => {
    for(const endpoint of ["ws://user:secret@127.0.0.1:1234","wss://localhost/path#fragment","ws://localhost/path?token=secret","unix://relative.sock","https://localhost"]){ await assert.rejects(verifyCodexSessionEndpoint({repo,env,session:"endpoint-main",endpoint}),e=>!e.message.includes("secret")); }
  });
} finally { for(const socket of sockets.clients)socket.terminate();sockets.close();await new Promise(resolve=>http.close(resolve));rmSync(socketPath,{force:true});if (!failed) rmSync(tmp, { recursive: true, force: true }); else console.log(`kept: ${tmp}`); }
console.log(failed ? `✗ ${failed} failed` : "✓ all passed"); process.exitCode = failed ? 1 : 0;
