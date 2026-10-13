// Presentation only: open the existing review URL. Review storage and session delivery
// belong to the server/inbox; an opener cannot claim that a review was received.
import { execFile } from "node:child_process";
import { platform } from "node:os";

export const REVIEW_WORKSPACES = Object.freeze(["browser", "terminal-browser", "cmux"]);

function run(command, args, env, timeout = 30000) {
  return new Promise((resolve) => {
    execFile(command, args, { env, timeout, maxBuffer: 256 * 1024, windowsHide: true }, (error, stdout, stderr) => {
      if (!error) return resolve({ status: "opened", output: stdout });
      const missing = error.code === "ENOENT";
      // Do not echo a command's output: it may contain URLs, workspace contents or
      // authentication details. The exit/timeout is enough to explain the fallback.
      resolve({ status: missing ? "unavailable" : "error", reason: missing ? `${command} is not installed` : error.killed ? `${command} did not finish within ${timeout / 1000}s` : `${command} failed (${error.code || error.signal || "unknown error"})` });
    });
  });
}

/** Opens the same HTML player in an explicitly selected workspace. `opened` means
 * the launcher accepted the request, not that playback, sound or Send was verified.
 * Callers may fall back to workspace:"browser" after reporting an optional failure.
 */
export async function openReview({ url, workspace = "browser", env = process.env }) {
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
  const help = await run("terminal-browser", ["open", "--help"], env, 5000);
  if (help.status !== "opened") return { status: help.status, reason: help.reason };
  if (!/--split\b/.test(help.output)) return { status: "unavailable", reason: "installed terminal-browser has no --split option" };
  return result("terminal-browser", ["open", "--split", "right", url]);
}
