// Which coding agent a repo's headless review run uses (`reel init --agent claude|codex|none`), and the
// `agent` block of .reelplanner/config.json each one writes. docs/agents.md says what each agent is tested for.
//
//   claude   Claude Code (tested): the template's command, auto mode inside its sandbox (D-082)
//   codex    Codex CLI (basic support, its headless run not yet tried end to end): `codex exec` in its own
//            workspace-write sandbox, network on for what the run fetches or pushes
//   none     no command: a review sent while no session waits stays in .reelplanner/inbox/ for the next one
//
// Without --agent, init picks one: the agent it is running inside (Claude Code sets CLAUDECODE; Codex sets
// CODEX_THREAD_ID, and CODEX_SANDBOX or CODEX_SANDBOX_NETWORK_DISABLED in its sandboxed shells), else the
// first of `claude` and `codex` found on PATH, else none.
import { existsSync, statSync } from "node:fs";
import { join, delimiter } from "node:path";
import { RP_INSTALL } from "./env.mjs";

export const AGENTS = ["claude", "codex", "none"];

// codex-cli 0.160.0's `codex exec` (checked against its --help): `-s workspace-write` lets the run write
// the repo and the temp folder; approval is already `never` for exec (a command that needs more is refused,
// not asked); `-a` and `--full-auto` are rejected. The prompt is appended last, as `codex exec [OPTIONS] [PROMPT]`.
export const CODEX_COMMAND = "codex exec -s workspace-write -c sandbox_workspace_write.network_access=true --color never";

const CODEX_NOTE = "Started headless when a review is sent from the local page and no session is waiting, with the prompt appended last. Codex (basic support, docs/agents.md): `codex exec` in its workspace-write sandbox, which writes only inside the repo and the temp folder, never asks (a command that needs more is refused), and here has the network on, for what the run fetches or pushes; reelplanner itself is installed (`" + RP_INSTALL + "`) and needs none: drop `-c sandbox_workspace_write.network_access=true` to run with the network off (the run then cannot push). Not yet tried end to end: the sandbox keeps .git read-only, so the run's `git commit` may be refused (check `git status` after a run). reelplanner adds no fence of its own to it (no file-tools hook). Empty: reviews wait in .reelplanner/inbox/ for the next session.";
const NONE_NOTE = "No headless run: a review sent from the local page while no session is waiting stays in .reelplanner/inbox/ until the next session runs `reelplanner inbox`. Set `command` to start one (docs/agents.md: `reel init --agent claude` or `--agent codex` writes it).";

/** Is `name` an executable on PATH? (`which`, without a shell; on Windows, its .cmd and .exe too) */
export function onPath(name, env = process.env) {
  const exts = process.platform === "win32" ? ["", ...(env.PATHEXT || ".EXE;.CMD;.BAT").split(";").map((e) => e.toLowerCase())] : [""];
  for (const dir of (env.PATH || "").split(delimiter).filter(Boolean)) for (const ext of exts) {
    try { const p = join(dir, name + ext); if (existsSync(p) && statSync(p).isFile()) return p; } catch { /* unreadable dir */ }
  }
  return null;
}

/** → { agent, why }: the agent this run is inside, else one on PATH, else none. */
export function detectAgent(env = process.env) {
  if (env.CLAUDECODE || env.CLAUDE_CODE_ENTRYPOINT) return { agent: "claude", why: "running inside Claude Code" };
  if (env.CODEX_THREAD_ID || env.CODEX_SANDBOX || env.CODEX_SANDBOX_NETWORK_DISABLED) return { agent: "codex", why: "running inside Codex" };
  for (const a of ["claude", "codex"]) { const p = onPath(a, env); if (p) return { agent: a, why: `\`${a}\` is on PATH (${p})` }; }
  return { agent: "none", why: "neither `claude` nor `codex` is on PATH" };
}

/** The config's `agent` block for one agent, from the template's (Claude Code's). */
export function agentBlock(agent, template) {
  if (agent === "claude") return template;
  if (agent === "codex") return { "//": CODEX_NOTE, command: CODEX_COMMAND };
  if (agent === "none") return { "//": NONE_NOTE, command: "" };
  throw new Error(`unknown agent "${agent}": ${AGENTS.join(", ")}`);
}

/**
 * How to start a second agent that knows nothing of the session that made the work, per agent: the line
 * fresh-eyes and code-check print beside their prompts. Fresh eyes run from a scratch folder outside the
 * repository and write one folder, `writes` (Codex's sandbox needs it named); the code check runs in the
 * repository's top folder, `repo`, where it reads the diff.
 */
export const freshAgentHow = ({ writes = null, repo = null } = {}) => {
  const where = repo ? "started in the repository's top folder" : "from a scratch folder of its own outside the repository";
  const claude = repo ? "a subagent (or `claude -p` run there)" : "a subagent (or `claude -p` with the scratch folder as its working directory)";
  const codex = repo ? `\`codex exec -C ${repo} -s workspace-write "<the prompt>"\``
    : `\`codex exec -C <scratch> --skip-git-repo-check -s workspace-write --add-dir ${writes || "<the folder it writes>"} "<the prompt>"\``;
  return `a fresh agent with no context of this conversation, ${where}: in Claude Code, ${claude}; ` +
    `in Codex, \`spawn_agent\` with \`fork_turns: "none"\` (its default, "all", hands it the whole conversation), or ${codex}`;
};
