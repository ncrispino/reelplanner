// Codex saved conversations: legacy rollout metadata or documented read-only App Server calls.
// Never open the private history SQLite schema, resume a thread, or print transcript/API error bodies.
import { readFileSync, readdirSync, realpathSync, statSync, openSync, readSync, closeSync, mkdtempSync, writeFileSync } from "node:fs";
import { resolve, join, relative, sep, dirname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { connect } from "node:net";
import UnixWebSocket from "ws";

const MODULE = fileURLToPath(import.meta.url);
const MAX_BYTES = 64 << 20, MAX_PAGES = 1000, TIMEOUT = 30000;
const mainSources = new Set(["cli", "vscode", "exec", "appServer", "app_server"]);
const canonical = (p) => { try { return realpathSync(p); } catch { return null; } };
const requestedId = (session, env) => typeof session === "string" ? session : session?.id || env.CODEX_THREAD_ID || null;
const homeOf = (env) => resolve(env.CODEX_HOME || join(env.HOME || homedir(), ".codex"));
const inside = (repo, path) => { const rel = relative(repo, path); return !rel || (!rel.startsWith(`..${sep}`) && rel !== ".." && !rel.startsWith(sep)); };
const fallback = (id) => `Codex conversation ${id || "for this repo"} could not be read; run reelplanner session export --thread <requested-id> --repo <repo>, or provide an external copy for that conversation with explain --session-source <path> this-session`;

function verified(meta, repo, id = null) {
  if (!meta || typeof meta.id !== "string" || !meta.id || (id && meta.id !== id)) throw new Error("missing or mismatched thread identity");
  if (typeof meta.cwd !== "string" || !canonical(meta.cwd) || canonical(meta.cwd) !== canonical(repo)) throw new Error("missing or mismatched repository metadata");
  // The documented API uses Unix seconds; absent/invalid time is not evidence of age.
  const time = typeof meta.updatedAt === "number" ? meta.updatedAt : meta.updatedAt == null && typeof meta.timestamp === "string" ? Date.parse(meta.timestamp) / 1000 : null;
  return { agent: "codex", id: meta.id, repo: canonical(repo), path: null, source: meta.source ?? null,
    parentThreadId: meta.parentThreadId || meta.parent_thread_id || null,
    main: !meta.parentThreadId && !meta.parent_thread_id && mainSources.has(meta.source),
    historyMode: meta.historyMode || meta.history_mode || "legacy", updatedAt: Number.isFinite(time) && time >= 0 ? time : null };
}

function newestMain(candidates) {
  if (!candidates.length) throw new Error("no eligible main conversation has matching repository metadata");
  const ids = new Set(candidates.map((c) => c.id));
  if (ids.size > 1 && candidates.some((c) => !Number.isFinite(c.updatedAt) || c.updatedAt < 0))
    throw new Error("conversation timestamps are unavailable or invalid; select an explicit --thread ID");
  return [...candidates].sort((a, b) => {
    const before = Number.isFinite(a.updatedAt) ? a.updatedAt : -Infinity, after = Number.isFinite(b.updatedAt) ? b.updatedAt : -Infinity;
    if (before !== after) return after - before;
    return Number(Boolean(a.path)) - Number(Boolean(b.path)); // equal valid times retain API preference
  })[0];
}
const apiMetadata = (meta) => ({ id: meta.id, cwd: meta.repo, source: meta.source, historyMode: meta.historyMode, updatedAt: meta.updatedAt, parentThreadId: meta.parentThreadId });

/** Read only the bounded identity header. Conversation bodies never participate in discovery. */
export function codexFileMetadata(path, { repo, session = null, env = process.env } = {}) {
  let fd;
  try {
    const p = canonical(path); if (!p || !statSync(p).isFile()) throw new Error("unreadable source path");
    fd = openSync(p, "r"); const buf = Buffer.alloc(65536); const n = readSync(fd, buf, 0, buf.length, 0);
    const header = buf.subarray(0, n).toString("utf8").split("\n")[0];
    const row = JSON.parse(header);
    if (row.type !== "session_meta") throw new Error("source has no session metadata");
    const meta = verified({ ...row.payload, timestamp: row.payload?.timestamp || row.timestamp }, repo, requestedId(session, env));
    // Real paths keep a symlinked outside transcript outside the repo in the pin as well.
    return { ...meta, path: p, exported: Boolean(row.payload?.exported_at), updatedAt: statSync(p).mtimeMs / 1000 };
  } catch (e) { throw new Error(`${fallback(requestedId(session, env))}: ${e instanceof SyntaxError ? "malformed session metadata" : e.code ? "unreadable source path" : e.message}`); }
  finally { if (fd != null) closeSync(fd); }
}

function legacySources(repo, env, id) {
  const all = [];
  const walk = (dir, depth = 0) => {
    if (depth > 5) return;
    let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path, depth + 1);
      else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        try { const meta = codexFileMetadata(path, { repo, env: { ...env, CODEX_THREAD_ID: "" }, session: id }); if (id || meta.main) all.push(meta); } catch { /* malformed, unreadable, or unrelated metadata */ }
      }
    }
  };
  walk(join(homeOf(env), "sessions")); walk(join(homeOf(env), "archived_sessions"));
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

// Some migrated stores leave an identity-only rollout. It verifies a thread, but cannot explain one.
function usableTranscript(meta) {
  if (!meta.path) return false;
  if (meta.historyMode === "paginated" && !meta.exported) return false;
  try {
    if (statSync(meta.path).size > MAX_BYTES) return false;
    const rows = readFileSync(meta.path, "utf8").split("\n").slice(1);
    return rows.some((line) => {
      let row; try { row = JSON.parse(line); } catch { return false; }
      if (row.type === "item") return row.item?.type && row.item.type !== "reasoning";
      if (row.type === "response_item") return row.payload?.role === "user" || row.payload?.role === "assistant" || ["function_call", "function_call_output", "custom_tool_call", "custom_tool_call_output"].includes(row.payload?.type);
      return row.type === "event_msg" && ["user_message", "agent_message", "exec_command_begin", "exec_command_end", "mcp_tool_call_begin", "mcp_tool_call_end"].includes(row.payload?.type);
    });
  } catch { return false; }
}

// A bounded helper process keeps pinSource's public synchronous contract. Its stdout is data, never logs.
function appHistory({ repo, env, session, history = false }) {
  const p = spawnSync(process.execPath, [MODULE, "--read-history"], { input: JSON.stringify({ repo, session, history }), env,
    encoding: "utf8", timeout: TIMEOUT + 2000, maxBuffer: MAX_BYTES, stdio: ["pipe", "pipe", "pipe"] });
  let result; try { result = JSON.parse(p.stdout || ""); } catch { throw new Error("read-only App Server unavailable or timed out"); }
  if (p.status !== 0 || !result.ok) throw new Error(result.reason || "read-only App Server history unavailable");
  return result;
}

/** Verify the exact active/selected identity. No active identity: newest eligible main for this repo. */
export function codexSessionMetadata({ repo, env = process.env, session = null } = {}) {
  const id = requestedId(session, env), files = legacySources(repo, env, id);
  if (id && files.length) return files[0];
  if (id) {
    try { const result = appHistory({ repo, env, session: id }); return verified(result.thread, repo, id); }
    catch (e) { throw new Error(`${fallback(id)}: ${e.message}`); }
  }
  let current = [], unavailable;
  try {
    const result = appHistory({ repo, env, session: null });
    if (!Array.isArray(result.threads)) throw new Error("malformed App Server conversation listing");
    current = result.threads.map((thread) => verified(thread, repo)).filter((meta) => meta.main);
  } catch (e) { unavailable = e; }
  try {
    // Rank metadata from both stores before reading any selected conversation history.
    const selected = newestMain([...current, ...files]);
    if (selected.path) return selected;
    const result = appHistory({ repo, env, session: selected.id });
    const meta = verified(result.thread, repo, selected.id);
    if (!meta.main) throw new Error("selected conversation is no longer an eligible main session");
    return meta;
  } catch (e) { throw new Error(`${fallback(null)}: ${!current.length && !files.length && unavailable ? unavailable.message : e.message}`); }
}

/** Find a usable saved file, otherwise automatically export that same verified thread read-only. */
export function codexSessionSource({ repo, env = process.env, session = null, source = null } = {}) {
  if (source) {
    const id = requestedId(session, env); if (!id) throw new Error(`${fallback(null)}: an owner copy requires the requested thread ID`);
    const meta = codexFileMetadata(source, { repo, env, session: id });
    if (!usableTranscript(meta)) throw new Error(`${fallback(id)}: provided source has no readable visible history`);
    return meta;
  }
  const meta = codexSessionMetadata({ repo, env, session });
  if (usableTranscript(meta)) return meta;
  const files = legacySources(repo, env, meta.id); const usable = files.find(usableTranscript); if (usable) return usable;
  return exportCodexSession({ repo, env, session: meta.id });
}

/** Writes visible history and identity to a private external JSONL; returns its path, never its contents. */
export function exportCodexSession({ repo, env = process.env, session = null, output = null } = {}) {
  const id = requestedId(session, env) || codexSessionMetadata({ repo, env }).id;
  let result; try { result = appHistory({ repo, env, session: id, history: true }); } catch (e) { throw new Error(`${fallback(id)}: ${e.message}`); }
  const meta = verified(result.thread, repo, id);
  if (!result.rows.some((row) => row.type === "item")) throw new Error(`${fallback(meta.id)}: no saved visible conversation or tool history`);
  let path;
  if (output) {
    path = resolve(output); const parent = canonical(dirname(path));
    if (!parent) throw new Error("session export output folder must exist");
    path = join(parent, path.split(sep).at(-1));
    if (inside(meta.repo, path)) throw new Error("session export must stay outside the repository and Git; choose an external --output path");
  } else {
    // A unique private temp folder is portable and avoids writing anything into CODEX_HOME.
    const temp = canonical(tmpdir());
    if (!temp || inside(meta.repo, temp)) throw new Error("default temp folder is inside the repository; choose an external --output path");
    path = join(mkdtempSync(join(temp, "reelplanner-session-")), "conversation.jsonl");
  }
  const rows = [{ type: "session_meta", payload: { id: meta.id, cwd: meta.repo, source: meta.source,
    parent_thread_id: meta.parentThreadId,
    history_mode: meta.historyMode, exported_at: new Date().toISOString() } }, ...result.rows];
  const text = rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
  if (Buffer.byteLength(text) > MAX_BYTES) throw new Error("session export exceeds the supported size limit; provide a bounded external source copy");
  writeFileSync(path, text, { flag: "wx", mode: 0o600 });
  return { ...meta, path, exported: true };
}

/** Verify a live notification target on its running transport, distinct from saved-history identity. */
export async function verifyCodexSessionEndpoint({ repo, env = process.env, session, endpoint, requireLoaded = true } = {}) {
  const id = requestedId(session, env); if (!id) throw new Error("Choose an exact Codex conversation ID for the running endpoint");
  const address = String(endpoint || ""); let socketPath = null;
  if (address.startsWith("unix://")) {
    socketPath = address.slice(7);
    if (socketPath && (!socketPath.startsWith("/") || /[?#\r\n]/.test(socketPath))) throw new Error("Invalid Codex Unix endpoint; use unix:///absolute/path.sock");
  } else {
    let url; try { url = new URL(address); } catch { throw new Error("Invalid Codex endpoint; use ws://, wss:// or unix://"); }
    if (!["ws:", "wss:"].includes(url.protocol) || url.username || url.password || url.hash || url.search)
      throw new Error("Codex endpoint must use ws://, wss:// or unix:// without credentials, query or fragment");
  }
  let transport, nextId = 0, bytes = 0; const pending = new Map();
  const fail = (reason) => { for (const p of pending.values()) p.reject(new Error(reason)); pending.clear(); };
  const receive = (line) => {
    bytes += Buffer.byteLength(line); if (bytes > 1 << 20) { fail("Codex endpoint metadata exceeds the supported limit"); return; }
    let message; try { message = JSON.parse(line); } catch { fail("Malformed Codex endpoint reply"); return; }
    if (!pending.has(message.id)) return;
    const p = pending.get(message.id); pending.delete(message.id);
    if (message.error) p.reject(new Error(`Codex endpoint history read unavailable (RPC ${Number(message.error.code) || "error"})`));
    else p.resolve(message.result);
  };
  const timer = setTimeout(() => { fail("Codex endpoint verification timed out"); transport?.close(); }, 5000);
  try {
    let socket;
    if (address.startsWith("unix://")) {
      if (!socketPath) {
        const daemon = spawnSync("codex", ["app-server", "daemon", "version"], { env, cwd: repo, encoding: "utf8", timeout: 5000, maxBuffer: 1 << 20, stdio: ["ignore", "pipe", "ignore"] });
        let state; try { state = JSON.parse(daemon.stdout || ""); } catch { /* no supported running daemon */ }
        if (daemon.status !== 0 || state?.status !== "running" || typeof state.socketPath !== "string" || !state.socketPath.startsWith("/")) throw new Error("No verified running Codex Unix endpoint");
        socketPath = state.socketPath;
      }
      // The control socket requires an HTTP Upgrade and masked WebSocket frames, not JSONL bytes.
      socket = new UnixWebSocket("ws://localhost/", { createConnection: () => connect({ path: socketPath }), maxPayload: 1 << 20, handshakeTimeout: 5000 });
    } else {
      socket = new WebSocket(address);
    }
    transport = socket;
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Codex endpoint connection timed out")), 5000);
      socket.addEventListener("open", () => { clearTimeout(timeout); resolve(); }, { once: true });
      socket.addEventListener("error", () => { clearTimeout(timeout); reject(new Error("Codex endpoint connection unavailable")); }, { once: true });
    });
    socket.addEventListener("message", (event) => receive(String(event.data)));
    socket.addEventListener("error", () => fail("Codex endpoint connection unavailable")); socket.addEventListener("close", () => fail("Codex endpoint connection closed"));
    const call = (method, params) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); transport.send(JSON.stringify({ id, method, params })); });
    await call("initialize", { clientInfo: { name: "reelplanner_session_verify", title: "reelplanner session verification", version: "1.0.0" }, capabilities: { experimentalApi: true } });
    transport.send(JSON.stringify({ method: "initialized", params: {} }));
    const result = await call("thread/read", { threadId: id, includeTurns: false }); const meta = verified(result?.thread, repo, id);
    if (!meta.main) throw new Error("Choose the main Codex conversation, not a checker or subagent");
    const status = result.thread.status;
    const loaded = ["idle", "active"].includes(status?.type);
    if (requireLoaded && !loaded) throw new Error(`Codex conversation ${id} is not loaded on the selected endpoint; open that session there or use the inbox`);
    return { ...meta, endpoint: address, status, loaded };
  } finally { clearTimeout(timer); transport?.close(); }
}

/** Discover only an already-running daemon, then verify the exact live conversation on its socket. */
export async function discoverCodexSessionEndpoint({ repo, env = process.env, session } = {}) {
  const daemon = spawnSync("codex", ["app-server", "daemon", "version"], { env, cwd: repo, encoding: "utf8", timeout: 5000, maxBuffer: 1 << 20, stdio: ["ignore", "pipe", "ignore"] });
  let state; try { state = JSON.parse(daemon.stdout || ""); } catch { throw new Error("No verified running Codex daemon endpoint; provide --session-endpoint or use the inbox"); }
  if (daemon.status !== 0 || state.status !== "running" || typeof state.socketPath !== "string" || !state.socketPath.startsWith("/"))
    throw new Error("No verified running Codex daemon endpoint; provide --session-endpoint or use the inbox");
  return verifyCodexSessionEndpoint({ repo, env, session, endpoint: `unix://${state.socketPath}` });
}

async function readAppHistory({ repo, session, history }) {
  const child = spawn("codex", ["app-server", "--listen", "stdio://"], { env: process.env, cwd: repo, stdio: ["pipe", "pipe", "ignore"] });
  let nextId = 0, buffer = "", bytes = 0; const pending = new Map();
  const fail = (reason) => { for (const p of pending.values()) p.reject(new Error(reason)); pending.clear(); };
  child.on("error", () => fail("Codex executable unavailable"));
  child.on("exit", () => fail("read-only App Server exited before replying"));
  child.stdin.on("error", () => fail("read-only App Server input unavailable"));
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    bytes += Buffer.byteLength(chunk); if (bytes > MAX_BYTES) { fail("read-only history exceeds the supported size limit"); child.kill(); return; }
    buffer += chunk; let n;
    while ((n = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, n); buffer = buffer.slice(n + 1);
      let message; try { message = JSON.parse(line); } catch { fail("malformed App Server response"); child.kill(); return; }
      if (!pending.has(message.id)) continue;
      const p = pending.get(message.id); pending.delete(message.id);
      if (message.error) { const e = new Error(`${p.method} unavailable (RPC ${Number(message.error.code) || "error"})`); e.unsupported = message.error.code === -32601 || /unsupported|not supported|unknown method/i.test(message.error.message || ""); p.reject(e); }
      else p.resolve(message.result);
    }
  });
  const call = (method, params) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject, method }); child.stdin.write(JSON.stringify({ id, method, params }) + "\n"); });
  const timer = setTimeout(() => { fail("read-only App Server timed out"); child.kill(); }, TIMEOUT);
  const pages = async (method, params) => {
    const data = [], seen = new Set(); let cursor = null;
    for (let n = 0; n < MAX_PAGES; n++) {
      const page = await call(method, { ...params, ...(cursor ? { cursor } : {}) });
      if (!Array.isArray(page?.data) || !(page.nextCursor == null || typeof page.nextCursor === "string")) throw new Error(`malformed ${method} pagination`);
      data.push(...page.data); cursor = page.nextCursor; if (cursor == null) return data;
      if (!cursor || seen.has(cursor)) throw new Error(`repeated ${method} pagination cursor`); seen.add(cursor);
    }
    throw new Error("read-only history exceeds the supported page limit");
  };
  try {
    await call("initialize", { clientInfo: { name: "reelplanner_session_export", title: "reelplanner session export", version: "1.0.0" }, capabilities: { experimentalApi: true } });
    child.stdin.write(JSON.stringify({ method: "initialized", params: {} }) + "\n");
    let id = session;
    if (!id) {
      const candidates = await pages("thread/list", { limit: 100, sortKey: "updated_at", sortDirection: "desc", sourceKinds: ["cli", "vscode", "exec", "appServer"], useStateDbOnly: true });
      const eligible = candidates.flatMap((t) => { try { const meta = verified(t, repo); return meta.main ? [meta] : []; } catch { return []; } });
      if (!history) return { ok: true, threads: eligible.map(apiMetadata) };
      id = newestMain(eligible).id;
    }
    const response = await call("thread/read", { threadId: id, includeTurns: false });
    const thread = response?.thread; const meta = verified(thread, repo, id);
    if (!history) return { ok: true, thread: apiMetadata(meta) };
    let turns;
    try { turns = await pages("thread/turns/list", { threadId: id, limit: 50, sortDirection: "asc", itemsView: "full" }); }
    catch (e) {
      if (!e.unsupported || meta.historyMode === "paginated") throw e;
      const full = await call("thread/read", { threadId: id, includeTurns: true }); verified(full?.thread, repo, id); turns = full.thread.turns;
    }
    if (!Array.isArray(turns)) throw new Error("malformed turn history");
    const rows = [];
    for (const turn of turns) {
      if (!turn || typeof turn.id !== "string" || !Array.isArray(turn.items) || (turn.itemsView && turn.itemsView !== "full")) throw new Error("turn history did not contain full items");
      rows.push({ type: "turn", id: turn.id, status: turn.status, startedAt: turn.startedAt, completedAt: turn.completedAt });
      for (const item of turn.items) {
        if (!item || typeof item.type !== "string") throw new Error("malformed visible history item");
        // Raw reasoning is private model state, not visible conversation or tool history.
        if (item.type === "reasoning") continue;
        rows.push({ type: "item", turnId: turn.id, item });
      }
    }
    return { ok: true, thread: { id: meta.id, cwd: meta.repo, source: meta.source, historyMode: meta.historyMode, parentThreadId: meta.parentThreadId }, rows };
  } finally { clearTimeout(timer); child.kill(); }
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE && process.argv[2] === "--read-history") {
  let input = ""; for await (const chunk of process.stdin) input += chunk;
  try { process.stdout.write(JSON.stringify(await readAppHistory(JSON.parse(input)))); }
  catch (e) { process.stdout.write(JSON.stringify({ ok: false, reason: e.message })); process.exitCode = 1; }
}
