// Presentation only: open the existing review URL. Review storage and session delivery
// belong to the server/inbox; an opener cannot claim that a review was received.
import { spawn } from "node:child_process";
import { closeSync, constants, openSync } from "node:fs";
import { platform } from "node:os";
import { findCodexWindow, underTerminal, withWindowTerminal } from "./codex-window.mjs";
import { openedPane } from "./review-pane.mjs";

export const REVIEW_WORKSPACES = Object.freeze(["browser", "terminal-browser", "cmux"]);

function run(command, args, env, timeout = 30000, { stdin = "ignore", detail = false } = {}) {
  return new Promise((resolve) => {
    let stdout = "", stderr = "", killed = false;
    const child = spawn(command, args, { env, stdio: [stdin, "pipe", "pipe"], windowsHide: true });
    const timer = setTimeout(() => { killed = true; child.kill(); }, timeout);
    child.stdout.on("data", (chunk) => { stdout = (stdout + chunk).slice(-256 * 1024); });
    child.stderr.on("data", (chunk) => { stderr = (stderr + chunk).slice(-4096); });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve(error.code === "ENOENT" ? { status: "unavailable", reason: `${command} is not installed` } : { status: "error", reason: `${command} failed (${error.code || "unknown error"})` });
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      if (code === 0 && !killed) return resolve({ status: "opened", output: stdout });
      // Do not echo a command's output: it may contain URLs, workspace contents or
      // authentication details. The exit/timeout is enough to explain the fallback,
      // except terminal-browser's last error line, which names the pane or terminal it could not use.
      const why = detail && stderr.trim().split("\n").at(-1).trim().slice(0, 300);
      resolve({ status: "error", reason: killed ? `${command} did not finish within ${timeout / 1000}s` : `${command} failed (${code ?? signal ?? "unknown error"})${why ? `: ${why}` : ""}` });
    });
  });
}

/** Opens the same HTML player in an explicitly selected workspace. `opened` means
 * the launcher accepted the request, not that playback, sound or Send was verified.
 * Callers may fall back to workspace:"browser" after reporting an optional failure.
 */
export async function openReview({ url, workspace = "browser", env = process.env, terminalBrowser = "terminal-browser", codexWindow = findCodexWindow }) {
  if (!REVIEW_WORKSPACES.includes(workspace)) return { status: "error", reason: `unknown review workspace: ${workspace}` };
  let parsed;
  try { parsed = new URL(url); } catch { return { status: "error", reason: "review URL must be an HTTP or HTTPS address" }; }
  if (!["http:", "https:"].includes(parsed.protocol)) return { status: "error", reason: "review URL must be an HTTP or HTTPS address" };
  const result = async (command, args, timeout) => {
    const { output, ...r } = await run(command, args, env, timeout);
    return r;
  };
  if (workspace === "browser") {
    const [command, args] = platform() === "darwin" ? ["open", [url]] : platform() === "win32" ? ["cmd", ["/c", "start", "", url]] : ["xdg-open", [url]];
    return result(command, args);
  }
  if (workspace === "cmux") {
    if (platform() !== "darwin") return { status: "unavailable", reason: "cmux browser panes require macOS" };
    // Bind to the invoking terminal's workspace, never the currently focused one
    // in some other window. Do not enable or alter socket access settings.
    if (!env.CMUX_WORKSPACE_ID) return { status: "unavailable", reason: "no invoking cmux workspace (CMUX_WORKSPACE_ID)" };
    const socket = env.CMUX_SOCKET_PATH ? ["--socket", env.CMUX_SOCKET_PATH] : [];
    const help = await run("cmux", ["browser", "--help"], env, 5000);
    if (help.status !== "opened") return { status: help.status, reason: help.reason };
    if (!/\bopen-split\b/.test(help.output)) return { status: "unavailable", reason: "installed cmux has no browser open-split command" };
    return result("cmux", [...socket, "browser", "open-split", url, "--workspace", env.CMUX_WORKSPACE_ID]);
  }
  // The standalone CLI owns terminal and multiplexer detection. Do not keep a
  // shorter terminal allowlist here: new supported terminals should work without
  // reelplanner or an agent-specific integration changing. Only a real open can
  // establish whether this invoking pane supports graphics and split automation.
  const help = await run(terminalBrowser, ["open", "--help"], env, 5000);
  if (help.status !== "opened") return { status: help.status, reason: help.reason };
  if (!/--split\b/.test(help.output)) return { status: "unavailable", reason: "installed terminal-browser has no --split option" };
  const open = ["open", "--split", "right", url];
  // Run by Codex's background server, this command is on no terminal: terminal-browser runs on the Codex window's
  // (its terminal as input, which is how it tells which pane it is in), so the split lands beside that window.
  if (env.CODEX_THREAD_ID && underTerminal(env) === false) {
    const found = codexWindow({ env });
    if (!found.window) return { status: "unavailable", reason: `Codex ran this away from its window, and ${found.reason}: open the review yourself` };
    let input;
    try { input = openSync(found.window.tty, constants.O_RDONLY | constants.O_NOCTTY); }
    catch (error) { return { status: "unavailable", reason: `the Codex window's terminal ${found.window.tty} could not be opened (${error.code})` }; }
    try {
      const { output, ...r } = await run(terminalBrowser, open, withWindowTerminal(env, found.window.env), 30000, { stdin: input, detail: true });
      return { ...r, beside: found.window.tty, pane: r.status === "opened" ? openedPane(output) : null };
    } finally { closeSync(input); }
  }
  const { output, ...r } = await run(terminalBrowser, open, env, 30000, { detail: true });
  // the split it opened (its key and terminal), so the review server can close it after Send
  return { ...r, pane: r.status === "opened" ? openedPane(output) : null };
}
