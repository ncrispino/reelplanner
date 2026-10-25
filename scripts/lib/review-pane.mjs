// The terminal-browser split a review was opened in, closed after Send. The opener knows the split it opened
// (terminal-browser prints its key and terminal) and tells the review server; after a Send that a session took, the
// server closes that split, once the page has said so, and the session opens the new version when it is built.
// Only that split, and only while terminal-browser still shows this server's page in it. It closes the way you would:
// the browser is asked where its split is (its `where`, the query terminal-browser's own `ls` makes), its quit key
// (Ctrl+Q) is typed into that split, and once the browser has quit, the terminal closes the emptied split (Ghostty
// keeps a split whose program exited, with "Process exited"). Seen with terminal-browser 0.13.4 and Ghostty 1.3.1.
// Not used: its quit link (pixel://quit) ends every terminal-browser window, and a killed browser leaves a dead split.
import { spawnSync } from "node:child_process";
import { connect } from "node:net";

const TERMINAL = /^\/dev\/(ttys\d{1,4}|pts\/\d{1,4})$/;
const KEY = /^[\w.-]{1,64}$/;

/** The split in `terminal-browser open`'s output: { key, tty }, or null. */
export function openedPane(output) {
  let opened; try { opened = JSON.parse(output); } catch { return null; }
  return KEY.test(opened?.key || "") && TERMINAL.test(opened?.tty || "") ? { key: opened.key, tty: opened.tty } : null;
}

/** A pane as posted to the server, checked: { key, tty, project } or null. */
export function paneOf(body) {
  if (!KEY.test(body?.key || "") || !TERMINAL.test(body?.tty || "")) return null;
  const project = typeof body.project === "string" && body.project.length <= 160 ? body.project : null;
  return { key: body.key, tty: body.tty, project };
}

/** Tell the review server at `url` which split shows its page. */
export async function registerPane(url, pane) {
  const page = new URL(url);
  const res = await fetch(new URL("/api/pane", page), { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...pane, project: page.searchParams.get("project") }), redirect: "error", signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`the review server did not take the pane (HTTP ${res.status})`);
}

/** The browser in a `terminal-browser ls --all --json` listing that is still the split, on its terminal, with a tab of
 * this server's page; null when none is. */
export function shownBrowser(listing, pane, base) {
  let all; try { all = JSON.parse(listing).browsers || []; } catch { return null; }
  return all.find((b) => b.key === pane.key && b.tty === pane.tty && (b.tabs || []).some((t) => String(t.url || "").startsWith(base))) || null;
}

/** How to type the quit key into a split and close it, for the terminal `where` names: { quit, close } (argv lists),
 * or null for a terminal this cannot drive. Ghostty's "text:" action types, where "input text" would paste. */
export function closeCommands(where) {
  const id = String(where?.pane || "");
  if (where?.terminal === "ghostty" && /^[\w-]{1,64}$/.test(id)) {
    const on = `terminal id "${id}"`;
    return { quit: ["osascript", "-e", `tell application "Ghostty" to perform action "text:\\\\x11" on ${on}`],
      close: ["osascript", "-e", `tell application "Ghostty" to close ${on}`] };
  }
  if (where?.terminal === "tmux" && /^%\d{1,6}$/.test(id)) return { quit: ["tmux", "send-keys", "-t", id, "C-q"], close: ["tmux", "kill-pane", "-t", id] };
  return null;
}

function ask(socket, request, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const c = connect(socket);
    let buffer = "";
    const done = (value) => { clearTimeout(timer); c.destroy(); resolve(value); };
    const timer = setTimeout(() => done(null), timeoutMs);
    c.setEncoding("utf8");
    c.on("error", () => done(null));
    c.on("data", (chunk) => {
      buffer += chunk;
      if (!buffer.includes("\n")) return;
      try { const reply = JSON.parse(buffer.slice(0, buffer.indexOf("\n"))); done(reply.ok ? reply.data : null); } catch { done(null); }
    });
    c.write(`${JSON.stringify({ id: "reelplanner", ...request })}\n`);
  });
}

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

/** Close the split if it still shows this server's page: { closed: true } or { reason }. */
export async function closePane(pane, base, { env = process.env, terminalBrowser = "terminal-browser" } = {}) {
  const list = () => { const r = spawnSync(terminalBrowser, ["ls", "--all", "--json"], { env, encoding: "utf8", timeout: 10000 }); return r.status === 0 ? r.stdout : null; };
  const listing = list();
  if (listing === null) return { reason: "terminal-browser could not list its windows" };
  const browser = shownBrowser(listing, pane, base);
  if (!browser) return { reason: "the split no longer shows this review" };
  const commands = closeCommands(browser.socket ? await ask(browser.socket, { cmd: "where" }) : null);
  if (!commands) return { reason: "its terminal cannot be asked to close the split" };
  const run = ([command, ...args]) => spawnSync(command, args, { env, encoding: "utf8", timeout: 10000 }).status === 0;
  if (!run(commands.quit)) return { reason: "its terminal did not take the quit key" };
  for (let i = 0; i < 25; i++) {
    await sleep(200);
    const now = list();
    if (now !== null && !shownBrowser(now, pane, base)) { await sleep(300); run(commands.close); return { closed: true }; }
  }
  return { reason: "the browser did not quit (is its quit key still Ctrl+Q?)" };
}
