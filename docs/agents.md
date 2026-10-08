# Agents

reelplanning is a skill plus a command-line tool, so any coding agent that loads skills and runs shell commands
can in principle drive it. In practice it is **tested with Claude Code**, has **basic support for Codex**, and is
**untested** with the others below. This page says what works where, and lists the open work, each item written so
a contributor can pick it up.

## Support

| Agent | Status | What it needs from you |
|---|---|---|
| Claude Code | **Tested.** Every part of the loop and the hosted review page. The headless review run has handled a system-video review, but not yet a plan review, and its sandbox, as it ships, is untested on a normal macOS or Linux machine (it was proven on a weaker setting: [spec](../.reelplanning/spec.md#pipelines), D-082). | Nothing beyond [Install](./reference.md#install). |
| Codex CLI (0.160.0) | **Basic.** The flags and commands below are checked; no full run yet. | A global install of the package, `setup` run outside the agent, and escalation for `review --detach` and `git commit` ([Codex](#codex)). |
| GitHub Copilot: agent mode in VS Code, and Copilot CLI (`copilot`) | Untested. | Gets the skill through `npx skills`' link in `~/.copilot/skills` (it also reads `~/.agents/skills`, and a repo's `.github/skills`). In VS Code, subagents are off by default; it can ask. Copilot CLI's subagents and headless flags are unverified. |
| Copilot cloud agent | Untested. | The skill from the repo (`.github/skills`, `.claude/skills` or `.agents/skills`; unverified for this skill); no subagents, nobody to ask, no display to open the review page on. |
| Cursor (IDE; CLI `agent`, formerly `cursor-agent`) | Untested. | Gets the skill through `npx skills`' link in `~/.cursor/skills`; has subagents and can ask you questions. |
| OpenCode (`opencode`) | Untested. | Gets the skill through `npx skills`' link in `~/.config/opencode/skills` (whether it reads `~/.agents/skills` itself is unverified); has subagents (Task) and can ask. A shell call stops at 2 minutes by default, shorter than a build. `opencode run --auto` has no OS sandbox. |
| Antigravity CLI (`agy`), and the Antigravity IDE | Untested. | Gets the skill through `npx skills`' link in `~/.gemini/antigravity-cli/skills` (the IDE: `~/.gemini/antigravity/skills`), or from a repo's `.agents/skills`; reads `AGENTS.md`. Its headless flags, subagents and how it asks you are unverified. |

**Gemini CLI** is replaced by Antigravity CLI for most users: Google announced on 2026-05-19 that Gemini CLI is
moving into Antigravity CLI (`agy`), and since 2026-06-18 Gemini CLI no longer serves free and Pro/Ultra users
(enterprise and paid API only). It is not listed above; Antigravity CLI is.

`npx skills add` knows other agents too (Factory Droid, Kiro CLI, Amp, Cline, Windsurf, Goose and more): untested.

What every agent gets the same: the skill (`npx skills add` installs one copy in `~/.agents/skills/plan-to-video`
and links it into each agent's own skills folder, for each agent it finds), every `reelplanning` and `reel` command, the local review page, the inbox, and
the review server's notifications. The hosted review page is a claude.ai Artifact, so it is Claude only; other agents
use the local page.

## Starting a plan

Install as [Install](./reference.md#install) says, then in an agent session in the repo you want to plan for, load
the plan-to-video skill:

| Agent | Start |
|---|---|
| Claude Code | `/plan-to-video <plan.md>`, or ask for a plan |
| Codex | `$plan-to-video <plan.md>`, or ask for a plan |
| Others | ask for a plan "with the plan-to-video skill", or point the agent at `~/.agents/skills/plan-to-video/SKILL.md` |

The skill names the other skills it loads the same way: HyperFrames' faceless-explainer skill is
`/faceless-explainer` in Claude Code and `$faceless-explainer` in Codex.

## Codex

What is checked, against codex-cli 0.160.0's own `--help` and a run of its sandbox with no model:

- **Instructions.** Codex reads `AGENTS.md` (from the git root down), not `CLAUDE.md`. This repo keeps its
  instructions in `AGENTS.md`, and `CLAUDE.md` imports it.
- **Skills.** Codex reads `~/.agents/skills`, where `npx skills add` puts the skill, and a skill is called with `$name`.
- **The headless review run.** `reel init` inside Codex (it sets `CODEX_THREAD_ID`), or `reel init --agent codex`,
  writes `codex exec -s workspace-write -c sandbox_workspace_write.network_access=true --color never` into
  `.reelplanning/config.json`; the review server appends the prompt last. `exec` never asks for approval; `-a` and
  `--full-auto` are rejected by this version. The network is on for what the run fetches or pushes; reelplanning itself is installed and needs none.
- **Fresh eyes and the code check.** A second agent must start with no context of the conversation. Codex's
  `spawn_agent` hands the child the whole conversation unless `fork_turns` is `"none"`; `codex exec -C <scratch>
  --skip-git-repo-check -s workspace-write --add-dir <the folder it writes>` starts one from a scratch folder. Both
  are printed by `fresh-eyes` and `code-check` beside their prompts.
- **The sandbox.** `workspace-write` writes only the working folder and the temp folder, has no network, and keeps
  `.git` read-only. So: install the package globally (`npm i -g reelplanning`, or from GitHub while it is not on npm),
  run `reelplanning setup` outside the agent (or start Codex with `-c sandbox_workspace_write.network_access=true`),
  and ask for escalation for `review --detach` and `git commit`.
- **The review loop.** Nothing wakes a Codex session when a background command exits, so the skill tells it to run
  `reelplanning inbox` at the start of each turn, or `reelplanning review --wait --timeout 90` in a loop.

Not yet seen working: everything that needs a model run (the [first open item](#open-work)).

## Open work

Each item: what to change, where, why, and how to tell it works. Pick one, open a PR, and update the table above.

1. **A real Codex run, end to end.**
   *What:* plan a small change in a scratch repo with Codex: `$plan-to-video`, the plan video with fresh eyes,
   `review --detach`, a review sent from the page, the headless `codex exec` run, the walkthrough and its code
   check. *Where:* a scratch repo; findings into this page. *Why:* only flags are checked so far. Unknowns: which of
   HyperFrames' 11 skills Codex picks for a frame; `npx`, Chrome, Kokoro and whisper inside `workspace-write`;
   whether `review --detach` is reachable from the sandbox; children started with `fork_turns: "none"`; parallel
   frame workers; Codex cloud. *Verify:* the run's video opens and its review lands in `reviews/`; move Codex to
   "Tested" with what still needs a hand.

2. **The headless Codex run's commit.**
   *What:* `workspace-write` keeps `.git` read-only, so the run's `git commit` (the prompt in
   `scripts/lib/inbox.mjs`, `agentPrompt`) may be refused. Try `--add-dir .git` in `CODEX_COMMAND`
   (`scripts/lib/agents.mjs`), or let the server commit after a run marked done. *Why:* a review run that cannot
   commit leaves the change uncommitted. *Verify:* in a scratch repo set up with `reel init --agent codex`, send a
   review and check `git log` after the run; extend `scripts/test/init.spec.mjs` for the new flags.

3. **`reel init --agent` for the other agents.**
   *What:* add `opencode`, `agy` (Antigravity CLI), `cursor` and `copilot` to `AGENTS` and `agentBlock` in `scripts/lib/agents.mjs`, each with
   a headless command checked against that agent's `--help` (opencode: `opencode run --auto`, with `permission`
   rules in `opencode.json`), and their environment variables to `detectAgent`. *Why:* today they get `none`, so a
   review sent while no session waits stays in the inbox. *Verify:* `scripts/test/init.spec.mjs` cases for each, and
   one real headless run each.

4. **A harness reference the skill can point to.**
   *What:* `skills/plan-to-video/references/harnesses.md`: per agent, how to start a fresh subagent, the headless
   command, how to ask the person a question, shell time limits, where session transcripts live. Move the Codex lines
   out of `SKILL.md` into it. *Why:* `SKILL.md` should say what to do, not every agent's way of doing it.
   *Verify:* `SKILL.md` links it once per place it applies; `scripts/test/version.spec.mjs` still passes.

5. **Trim `SKILL.md` under 500 lines.**
   *What:* move "Several people" and "Running the loop" into `skills/plan-to-video/references/`, leaving a line and a
   link each. *Why:* the Agent Skills format asks for under 500 lines, and agents with smaller windows load it
   whole. *Verify:* `wc -l skills/plan-to-video/SKILL.md`; a plan run still finds the loop's steps.

6. **The `compatibility:` frontmatter.**
   *What:* add `compatibility:` to `skills/plan-to-video/SKILL.md`'s frontmatter: Node 22.20+, ffmpeg, a headless
   Chrome, network for `setup`, tested with Claude Code, basic Codex. *Why:* agents and skill registries read it
   before loading the skill. *Verify:* the description stays under 1024 characters, the frontmatter still parses as YAML,
   and `npx skills add ./ --skill plan-to-video -g` still installs it.

7. **More skills folders.**
   *What:* add `~/.cursor/skills`, `~/.gemini/antigravity-cli/skills`, `~/.config/opencode/skills` and `~/.copilot/skills` to
   `CANDIDATE_DIRS` in `scripts/hyperframes-skills.mjs` (`build`, `narrate` and, through `hf_skills_dir` in
   `scripts/lib/project-dir.sh`, `finish-project` all read it). *Why:* where `npx skills` copies rather than links, the pipeline
   should still find HyperFrames' scripts. *Verify:* `scripts/test/hyperframes-skills.spec.mjs` with `HOME` set to a
   folder holding only one of them.

8. **Long commands under a short shell limit (opencode).**
   *What:* where the skill runs something long (`narrate`, `build`, `review --wait`), say the fallback: start it with
   `nohup … > <log> 2>&1 &` and read the log, and loop `review --wait --timeout 90`. *Where:* `SKILL.md` "Build a
   video" step 3 and "Running the loop", or the harness reference (item 4). *Why:* opencode stops a shell call after
   2 minutes by default. *Verify:* an opencode run of `reelplanning build` on `videos/l1-upload-resume` finishes.

9. **A path with no display, for cloud agents.**
   *What:* when there is no browser and nobody to ask (Copilot cloud agent, Codex cloud), pack the video with
   `bundle-player` and push it as its own branch (as "Several people" does for a PR), and choose preview at
   faceless-explainer's Step 6. Add a `copilot-setup-steps.yml` template that runs `reelplanning setup`. *Where:*
   `SKILL.md` "Open it", `templates/`. *Why:* a cloud agent cannot open the review page or answer Step 6.
   *Verify:* a Copilot cloud agent run on a test issue ends with a branch the reviewer can open.

10. **"this-session" for other agents.**
    *What:* `thisSession` in `scripts/lib/explainer.mjs` reads only Claude Code's `~/.claude/projects/…`. Add Codex's
    `~/.codex/sessions/**/rollout-*.jsonl` (the one whose start names this repo's folder), and for others an error
    that says to pass the transcript's path. *Why:* "what happened in this session" fails outside Claude Code.
    *Verify:* `scripts/test/explainer.spec.mjs` with a fake `CODEX_HOME` holding one rollout file.

11. **Antigravity CLI, checked.**
    *What:* in a scratch repo, install the skill with `npx skills add` and check that `agy` finds it (through the
    link in `~/.gemini/antigravity-cli/skills`, or the repo's `.agents/skills`) and reads this repo's `AGENTS.md`;
    find its headless flags (unverified so far) for item 3. *Why:* it replaced Gemini CLI for most users, and none
    of it is tried here. *Verify:* a short plan run in `agy` loads the skill; write what it needs into the table above.

12. **Publishing.** The package is not on npm yet (`npm view reelplanning` says 404), and the owner decides when it
    is. Until then the docs and `scripts/release/install.sh` install it from GitHub, which downloads the repo's
    files with its example videos (about 64 MB compressed, October 2026).
    *What:* once published, keep the GitHub line as the fallback only; or, before that, attach `npm pack`'s tarball
    to each GitHub release and install from its URL. *Where:* `docs/releasing.md`, `scripts/release/install.sh`,
    `docs/reference.md#install`. *Verify:* `scripts/release/install.sh` on a clean machine takes the npm path.
