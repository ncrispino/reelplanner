// The Codex window a command was run from, for a split beside it. Codex 0.164 runs an agent's commands in a shared
// background server (`codex app-server --managed-daemon`) that no terminal is attached to, so terminal-browser, which
// splits beside the pane its caller runs in, walks up from itself and finds no terminal (seen on macOS with Ghostty;
// on Linux under tmux it split the pane the server was started from, whichever that was). The window the person
// answers in is still a Codex process on a terminal, in the folder the command runs in: with exactly one there (or,
// with several, the one in the tmux pane or tmux window a tmux client is showing), terminal-browser runs on that
// window's terminal, with its terminal settings, and the split lands beside it.
// Codex's processes and its server are its own and may change: anything unexpected finds no window, and the caller
// gives the link instead.
import { spawnSync } from "node:child_process";
import { readFileSync, readlinkSync, realpathSync } from "node:fs";
import { basename, sep } from "node:path";
import { platform } from "node:os";

const read = (command, args, env) => {
  const r = spawnSync(command, args, { env, encoding: "utf8", timeout: 5000 });
  return r.status === 0 ? r.stdout : null;
};
const terminalPath = (tty) => tty && !/^\?+$/.test(tty) ? `/dev/${tty}` : null;

/** Whether this process, or one it runs under, is on a terminal; then terminal-browser finds its pane itself.
 * null when ps cannot say. */
export function underTerminal(env, pid = process.pid) {
  for (let hops = 0; hops < 30 && pid > 1; hops++) {
    const out = read("ps", ["-o", "ppid=,tty=", "-p", String(pid)], env)?.trim();
    if (!out) return null;
    const [ppid, tty] = out.split(/\s+/);
    if (terminalPath(tty)) return true;
    pid = Number(ppid);
    if (!Number.isFinite(pid)) return null;
  }
  return false;
}

/** The Codex windows in a `ps -axo pid=,tty=,args=` listing, one per terminal: the codex program, or Node running
 * npm's codex launcher, on a terminal and not one of the subcommands that run without a window. */
export function codexWindows(listing) {
  const windows = new Map();
  for (const line of listing.split("\n")) {
    const m = line.trim().match(/^(\d+)\s+(\S+)\s+(.*)$/);
    const tty = terminalPath(m?.[2]);
    if (!tty) continue;
    const words = m[3].split(/\s+/);
    const at = basename(words[0]) === "codex" ? 1 : basename(words[0]) === "node" && basename(words[1] || "") === "codex" ? 2 : 0;
    if (!at || ["exec", "app-server", "exec-server", "mcp-server", "sandbox"].includes(words[at])) continue;
    windows.set(tty, [...(windows.get(tty) || []), Number(m[1])]);
  }
  return [...windows].map(([tty, pids]) => ({ tty, pids }));
}

/** Of windows with their folders, the one whose folder holds `cwd` most closely: { window } or { reason }, with the
 * windows that tie (`tied`) when there are several. */
export function pickWindow(windows, cwd) {
  const holds = windows.filter((w) => w.cwd && (cwd === w.cwd || cwd.startsWith(w.cwd.endsWith(sep) ? w.cwd : w.cwd + sep)));
  if (!holds.length) return { reason: `no Codex window is open in ${cwd} or a folder above it` };
  const closest = Math.max(...holds.map((w) => w.cwd.length));
  const found = holds.filter((w) => w.cwd.length === closest);
  return found.length === 1 ? { window: found[0] } : { reason: `${found.length} Codex windows are open in ${found[0].cwd}, so which one asked is unclear`, tied: found };
}

/** Of windows tied in one folder, each with its terminal settings (`env`), the one where the person is looking: in
 * the tmux pane a tmux client shows, else in the tmux window it shows (a shell or the last review beside Codex) (seen
 * with four Codex windows in one repo, tmux in Ghostty on macOS). Send reaches the session by its thread, not its
 * pane, so this decides only where the split opens. `viewing(socket)` says what that tmux server's clients show:
 * { panes, windows, windowOf: { pane: window } }. { window } or null when not exactly one is shown. */
export function focusedWindow(windows, viewing) {
  const inTmux = windows.filter((w) => w.env?.TMUX && /^%\d+$/.test(w.env.TMUX_PANE || ""));
  const seen = (w) => viewing(w.env.TMUX.split(",")[0]) || { panes: [], windows: [], windowOf: {} };
  for (const shown of [(w) => seen(w).panes.includes(w.env.TMUX_PANE), (w) => seen(w).windows.includes(seen(w).windowOf[w.env.TMUX_PANE])]) {
    const found = inTmux.filter(shown);
    if (found.length) return found.length === 1 ? { window: found[0] } : null;
  }
  return null;
}

/** `ps eww` prints a process's environment after its arguments, words split on spaces: a word that is not NAME=
 * continues the value before it. Exact for the terminal settings read from it. */
export function parseEnvironment(text) {
  const env = {};
  let name = null;
  for (const word of text.trim().split(" ")) {
    const m = word.match(/^([A-Za-z_]\w*)=(.*)$/s);
    if (m) env[(name = m[1])] = m[2];
    else if (name) env[name] += ` ${word}`;
  }
  return env;
}

// What tells terminal-browser which terminal and pane it is in. This command's own come from wherever Codex's server
// started; the window's say where the person is.
const TERMINAL_SETTING = /^(TERM|TERMINFO|TERM_PROGRAM|TERM_PROGRAM_VERSION|TERM_SESSION_ID|COLORTERM|TMUX|TMUX_PANE|STY|VTE_VERSION|TERMINAL_EMULATOR|(ZELLIJ|LC_TERMINAL)\w*|(GHOSTTY|KITTY|WEZTERM|ITERM|ALACRITTY|KONSOLE|WT|CMUX)_\w+)$/;

/** `env` with its terminal settings replaced by the window's. */
export function withWindowTerminal(env, windowEnv) {
  const out = Object.fromEntries(Object.entries(env).filter(([name]) => !TERMINAL_SETTING.test(name)));
  for (const [name, value] of Object.entries(windowEnv)) if (TERMINAL_SETTING.test(name)) out[name] = value;
  return out;
}

const real = (path) => { try { return realpathSync(path); } catch { return path; } };

function folders(pids, env) {
  if (platform() === "linux") return new Map(pids.map((pid) => { try { return [pid, readlinkSync(`/proc/${pid}/cwd`)]; } catch { return [pid, null]; } }));
  const out = read("lsof", ["-a", "-d", "cwd", "-p", pids.join(","), "-Fpn"], env) || "";
  const found = new Map();
  let pid = null;
  for (const line of out.split("\n")) {
    if (line.startsWith("p")) pid = Number(line.slice(1));
    else if (line.startsWith("n") && pid) found.set(pid, line.slice(1));
  }
  return found;
}

function environment(pid, args, env) {
  if (platform() === "linux") {
    try { return Object.fromEntries(readFileSync(`/proc/${pid}/environ`, "utf8").split("\0").filter(Boolean).map((v) => [v.slice(0, v.indexOf("=")), v.slice(v.indexOf("=") + 1)])); }
    catch { return null; }
  }
  const out = read("ps", ["eww", "-o", "command=", "-p", String(pid)], env)?.trim();
  return out?.startsWith(args) ? parseEnvironment(out.slice(args.length)) : null;
}

/** The Codex window for a command run in `cwd`: { window: { tty, env } } or { reason }. */
export function findCodexWindow({ cwd = process.cwd(), env = process.env } = {}) {
  const listing = read("ps", ["-axo", "pid=,tty=,args="], env);
  if (listing === null) return { reason: "ps could not list processes" };
  const windows = codexWindows(listing);
  const where = folders(windows.flatMap((w) => w.pids), env);
  for (const w of windows) w.cwd = real(w.pids.map((pid) => where.get(pid)).find(Boolean) || "") || null;
  const picked = pickWindow(windows, real(cwd));
  const argsOf = (pid) => listing.split("\n").map((line) => line.trim().match(/^(\d+)\s+\S+\s+(.*)$/)).find((m) => Number(m?.[1]) === pid)?.[2];
  const settingsOf = (w) => environment(w.pids.at(-1), argsOf(w.pids.at(-1)), env);
  if (picked.tied) {
    const servers = new Map();
    const pairs = (args) => (read("tmux", args, env) || "").split("\n").map((line) => line.trim().split(" ")).filter(([pane, win]) => pane && win);
    const viewing = (socket) => {
      if (!servers.has(socket)) {
        const shown = pairs(["-S", socket, "list-clients", "-F", "#{pane_id} #{window_id}"]);
        servers.set(socket, { panes: shown.map(([pane]) => pane), windows: shown.map(([, win]) => win),
          windowOf: Object.fromEntries(pairs(["-S", socket, "list-panes", "-a", "-F", "#{pane_id} #{window_id}"])) });
      }
      return servers.get(socket);
    };
    const shown = focusedWindow(picked.tied.map((w) => ({ ...w, env: settingsOf(w) })), viewing);
    return shown ? { window: { tty: shown.window.tty, env: shown.window.env } } : { reason: picked.reason };
  }
  if (!picked.window) return picked;
  const windowEnv = settingsOf(picked.window);
  if (!windowEnv) return { reason: `the Codex window on ${picked.window.tty} did not show its terminal settings` };
  return { window: { tty: picked.window.tty, env: windowEnv } };
}
