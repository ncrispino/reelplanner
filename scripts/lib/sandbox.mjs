// Can Claude Code's sandbox run on this machine? Asked by the review server before it starts a
// headless run whose command turns the sandbox on (D-082).
//
// `failIfUnavailable` only catches a missing dependency. Where bubblewrap starts but refuses the
// nested user namespace the sandbox's seccomp step makes (a container running as root:
// `apply-seccomp: write /proc/self/uid_map: Operation not permitted`), every shell command in the
// run fails and the run starts anyway, with no working shell. So the server tries that step once,
// with `true`, no model involved: bubblewrap called as Claude Code's Linux sandbox calls it (new
// session, network, pid and user namespaces, every capability dropped, a fresh /proc), and inside it
// a nested user namespace that maps its uid, then new pid and mount namespaces and /proc (what
// apply-seccomp does). On macOS, `sandbox-exec` with an allow-all profile. Elsewhere there is nothing
// to try (native Windows has no sandbox, and failIfUnavailable stops the run). The answer is kept for
// the server's lifetime.
//
// Where the probe fails, the run still goes ahead, without the sandbox (the owner's call on A18:
// "err on the side of doing more instead of safety"): `withoutSandbox` rewrites the command's
// `--settings` so the sandbox is off and cannot stop the start, keeping everything else in them
// (auto mode and --permission-prompts are flags, untouched; the PreToolUse hook that keeps the file
// tools in the repo stays). The server says so to the reviewer.
//
// Only a command that turns Claude Code's sandbox on through its `--settings` is probed. Another agent's
// command (`codex exec …`, `opencode run …`) has no `--settings`: it is never probed or changed, and
// its own sandbox or approval modes are its own (docs/reference.md, "Other agents").
//
//   REELPLANNER_SANDBOX_PROBE_CMD="…"   run this instead; exit 0 = the sandbox works (tests)
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { splitCommand } from "./notify.mjs";

// Where the command's `--settings` is and what it says: { i, inline, settings } or null (none, or it does not parse).
function settingsOf(argv, { cwd = process.cwd() } = {}) {
  const i = argv.findIndex((a) => a === "--settings" || a.startsWith("--settings="));
  if (i < 0) return null;
  const inline = argv[i] === "--settings";
  const v = inline ? argv[i + 1] : argv[i].slice("--settings=".length);
  try { return { i, inline, settings: JSON.parse(v) }; } catch { /* a file */ }
  try { return { i, inline, settings: JSON.parse(readFileSync(resolve(cwd, v), "utf8")) }; } catch { return null; }
}

/** The `sandbox` settings a command's `--settings` (inline JSON or a file) turns on, or null. */
export function sandboxOf(argv, opts = {}) {
  const s = settingsOf(argv, opts)?.settings;
  return s?.sandbox?.enabled === true ? s.sandbox : null;
}

/**
 * The same command with Claude Code's sandbox off: its `--settings` (a file's read and passed
 * inline) with `sandbox` set to { enabled: false, failIfUnavailable: false }, so neither this
 * command nor a sandbox turned on in the user's own settings stops the start. Everything else is
 * kept: the hooks, the permission flags, the order of the arguments.
 */
export function withoutSandbox(argv, opts = {}) {
  const at = settingsOf(argv, opts);
  if (!at) return [...argv];
  const json = JSON.stringify({ ...at.settings, sandbox: { enabled: false, failIfUnavailable: false } });
  const out = [...argv];
  if (at.inline) out[at.i + 1] = json; else out[at.i] = `--settings=${json}`;
  return out;
}

/** Whether the command's `--settings` has a PreToolUse hook on Write and Edit (the one that keeps them in the repo). */
export function fencesFileTools(argv, opts = {}) {
  const pre = settingsOf(argv, opts)?.settings?.hooks?.PreToolUse;
  return Array.isArray(pre) && pre.some((h) => { try { const re = new RegExp(`^(${h.matcher})$`); return re.test("Write") && re.test("Edit"); } catch { return false; } });
}

const NESTED = "command -v unshare >/dev/null || exit 0; exec unshare --user --map-root-user --pid --fork --mount --mount-proc true";

/** The probe's argv on this platform, or null when there is nothing to try. */
export function probeCommand({ platform = process.platform, env = process.env, bwrap = "bwrap" } = {}) {
  if (env.REELPLANNER_SANDBOX_PROBE_CMD) return splitCommand(env.REELPLANNER_SANDBOX_PROBE_CMD);
  if (platform === "linux") return [bwrap, "--new-session", "--die-with-parent", "--ro-bind", "/", "/", "--dev", "/dev", "--unshare-net",
    "--unshare-pid", "--unshare-user", "--cap-drop", "ALL", "--proc", "/proc", "--", "sh", "-c", NESTED];
  if (platform === "darwin") return ["sandbox-exec", "-p", "(version 1)(allow default)", "/usr/bin/true"];
  return null;
}

/** Run the probe: { ok, detail } (detail: the last line it printed, or why it did not run). Never rejects. */
export function probeSandbox(opts = {}, { timeoutMs = 10000 } = {}) {
  const argv = probeCommand(opts);
  if (!argv) return Promise.resolve({ ok: true, detail: "nothing to probe on this platform" });
  return new Promise((ok) => {
    let err = "";
    const done = (r) => { clearTimeout(t); ok(r); };
    const t = setTimeout(() => { try { child.kill("SIGKILL"); } catch {} done({ ok: false, detail: `${argv[0]} did not finish in ${timeoutMs / 1000} s` }); }, timeoutMs);
    const child = spawn(argv[0], argv.slice(1), { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => done({ ok: false, detail: e.code === "ENOENT" ? `${argv[0]} not found` : e.message }));
    child.on("exit", (code, signal) => done(code === 0 ? { ok: true, detail: "" }
      : { ok: false, detail: err.trim().split("\n").at(-1) || `${argv[0]} exited ${code ?? signal}` }));
  });
}

let cached = null;
/**
 * Why this command's run would have no working sandbox here, or null when it would (or the command
 * does not turn the sandbox on, or already asks for the weaker nested one). Probes once per process.
 * The caller then runs the command `withoutSandbox`, and says so.
 */
export async function sandboxProblem(argv, { cwd } = {}) {
  const sb = sandboxOf(argv, { cwd });
  if (!sb || sb.enableWeakerNestedSandbox === true) return null;
  const r = await (cached ??= probeSandbox({ bwrap: sb.bwrapPath || "bwrap" }));
  return r.ok ? null : { detail: r.detail, reason: `Claude Code's sandbox can't run on this machine (${r.detail})`, filesFenced: fencesFileTools(argv, { cwd }) };
}

/** What a run without the sandbox means, said once to the reviewer: "…this machine can't run it (<detail>); …". */
export const unsandboxedNote = (p) => `this machine can't run it (${p.detail}); shell commands aren't fenced to the repo, ` +
  (p.filesFenced ? "file writes still are (the hook)" : "and nothing in the command fences file writes either");
