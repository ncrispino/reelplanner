# Agents

reelplanner is a skill plus a command-line tool, so any coding agent that loads skills and runs shell commands
can in principle drive it. Claude Code has the established tested route. Codex now uses the same workflow
through a native plugin and a small agent adapter; the evidence and remaining limits are listed below.
The other agents are untested.

## Support

| Agent | Status | What it needs from you |
|---|---|---|
| Claude Code | **Tested.** Every part of the loop and the hosted review page. The headless review run has handled a system-video review, but not yet a plan review, and its sandbox, as it ships, is untested on a normal macOS or Linux machine (it was proven on a weaker setting: [spec](../.reelplanner/spec.md#pipelines), D-082). | [Install](./reference.md#install), and its commands allowed once, so they run without a prompt each time ([Claude Code](#claude-code)). |
| Codex CLI (0.162.1) | Tested on macOS: native plugin, narrated plan/review/implementation/walkthrough/fix loop, unattended rebuild, failure/retry and read-only conversation export. The terminal review also on Linux (0.164.0). Automatic session wake remains unverified. | Install the executable plus plugin/skill; preserve the configured sandbox, approvals and signing ([Codex](#codex)). |
| Codex app | Uses the shared local player and inbox. Untested and outside the current CLI change; app-specific live delivery and workspace behavior need separate evidence. | A reachable local review server; use saved inbox fallback when live notification is unavailable. |
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
and links it into each agent's own skills folder, for the agents you pick, or every one it knows with `-y`), every `reelplanner` and `reel` command, the local review page, the inbox, and
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

## Claude Code

- **Allow its commands once.** Every step of the skill is a `reelplanner` or `reel` command. Claude Code asks
  before each one; in auto mode its classifier judges each instead, and may stop one that writes into your repo
  (`reel init`, `reel new-plan`, `reel record`). Allow both commands once, for every repo, and they run without
  either: in `/permissions`, add the allow rules `Bash(reelplanner:*)` and `Bash(reel:*)`, or put them in
  `~/.claude/settings.json` yourself (`.claude/settings.local.json` in a repo, for that repo only):

  ```json
  { "permissions": { "allow": ["Bash(reelplanner:*)", "Bash(reel:*)"] } }
  ```

  An allow rule is checked before auto mode's classifier, so the commands it names are not judged again. A
  command that chains another onto them (`reel check … && git add …`) still is, which is why the skill runs each
  one in a call of its own. The skill never edits your settings: when a command is stopped, it names these two
  rules and waits for you. One auto mode stopped can be run again from `/permissions` → Recently denied (`r`).
  `reelplanner setup` reminds you while it finds `claude` and no such rule.
- **One question from Claude Code itself.** The first time the skill reads its own guide (`references/style-guide.md`,
  in `~/.claude/skills`, outside your repo), Claude Code asks once whether reads outside the working directories are
  allowed, in auto mode too. The first answer, Yes and keep allowing them, is the one that lets the skill go on
  without asking again ([seen on a fresh machine](../eval/fresh-machine/2026-10-10-bakery-auto-mode.md), Claude Code 2.1.296).
- **The headless review run** is off until you ask for it: `reel init <repo> --agent claude` (in a repo set up
  already too) writes the command the review server starts on a review sent while no session waits. It runs in
  auto mode inside Claude Code's sandbox (D-082; [project-dir](./project-dir.md): `config.json`).

## Codex

The native Codex plugin packages the same `plan-to-video` skill as Claude Code. Install the executable
and media tools first, then add the installed package or checkout as a marketplace:

```sh
codex plugin marketplace add <package-or-checkout>
codex plugin add reelplanner@reelplanner
```

Codex keeps its own copy of an installed plugin and does not refresh it from the package: after
updating reelplanner, run `codex plugin add reelplanner@reelplanner` again.

On Linux, Codex's sandbox runs commands under bubblewrap. On Ubuntu 24.04 it would not start
(`bwrap: loopback: Failed RTM_NEWADDR`) until unprivileged user namespaces were allowed;
[Codex's sandboxing page](https://developers.openai.com/codex/sandboxing) gives the AppArmor profile
to load, or the `kernel.apparmor_restrict_unprivileged_userns` setting as a fallback.

The existing `npx skills add` route also works. Core installation does not need hooks; optional hooks
require explicit local trust. Codex supports plugins, skills and MCP integrations; these are not proof
of a Claude Mods pane or Artifact bridge. See the [official plugin documentation](https://developers.openai.com/plugins/build/plugins).

The local review page is shared. **Send saves directly to the inbox**, without downloading a file.
`review --wait` claims work and prints its saved path. An explicitly connected session uses
`review <video-dir> --detach --session codex:<id>`; notification is only queued until the correct
session adopts it. Older CLIs and unavailable recipients keep the inbox fallback. Background task
callbacks differ across clients, so check `inbox` at each turn and poll your waiting task.
Connection also verifies the running transport and loaded thread. Use `--session-endpoint
ws://127.0.0.1:<port>` when the active App Server is not reachable through a verified existing daemon.
A bare successful queue command against saved history does not prove that session acted.

Unattended handling remains opt-in: `reel init <repo> --agent codex`. The default for CLI 0.162.1 is
`codex exec --approve-for-me -c 'sandbox_mode="workspace-write"' -c sandbox_workspace_write.network_access=true --color never`.
That version rejects `--approve-for-me` combined with `-s`; the configuration override was tested with a real run.
[Automatic approval review](https://learn.chatgpt.com/docs/sandboxing/auto-review) retains the sandbox
and evaluates eligible requests. It does not grant every request. Git approvals and signing can still
fail; reelplanner retains the work, log and original progress for retry, and never makes a server-side commit.

`explain "What happened in this session?" this-session` selects the actual Codex thread and canonical
project, excluding unrelated checker conversations. Current history uses the supported read-only
[App Server](https://learn.chatgpt.com/docs/app-server) export with pagination; legacy saved history
remains supported. `session export codex:<id> --out <external.jsonl>` writes visible conversation and
tool history outside Git. No thread resume or undocumented database reads are used. When unavailable,
request an owner copy of that exact conversation and pass `explain --session-source <path>`.

Fresh reviewers have no inherited conversation and receive exactly the generated prompt. Detailed
commands, lease renewal, recovery phases and permission advice are in the skill's
[harness reference](../skills/plan-to-video/references/harnesses.md).

The selected remote route is a portable copy: the reviewer exports a file and returns it for
`reel record`. A hosted Codex submission service is outside this plan (D-313). The supplied Claude
`/reel` Mods implementation is a comparison on its own branch, not imported into the shared player.
A terminal/workspace adapter opens the same player URL; support must be tested with actual video,
audio and review controls before claiming parity.
The [terminal review setup](./terminal-review.md) is shared across agent harnesses and terminal-browser's
supported terminals. Ghostty is the current hands-on test target.

### Evidence and limits

The approved implementation plan is
[Codex as a first-class reelplanner agent](../.reelplanner/plans/2026-10-11-codex-first-class/plan.md).
Its [walkthrough](../.reelplanner/plans/2026-10-11-codex-first-class/walkthrough.md) holds validation runs.
The owner narrowed this change to Codex CLI on 2026-10-11. Desktop-app support remains unverified and is outside acceptance. As of this implementation pass:

- A packed plugin installed, enabled and loaded its skill through the actual CLI in an isolated `CODEX_HOME`.
- A real headless review created one intake record and commit. An injected scratch signing failure left
  edits pending despite exit code zero. Restoring the original signing configuration and retrying made
  one recovery commit without repeating the edit or intake.
- The owner-confirmed Codex CLI session in iTerm2 verified its exact loaded daemon thread, adopted a saved API question, answered it, and returned the sourced answer to the page API. It deliberately polled; automatic wake is not claimed.
- Read-only paginated export of a real scratch Codex conversation matched its ID and project; transcript
  contents stayed outside Git.
- The shared terminal player opened in Ghostty 1.3.1 with terminal-browser 0.13.4. Rewind/pause/resume
  regressions and live timing checks passed, and the owner confirmed normal audio. Scratch plan choices, comments, Ask and direct Send passed, followed by walkthrough Accept/Flag, a requested-change rebuild and changed-scenes approval ([terminal review](./terminal-review.md)).
- Disconnected download/intake preserved answers and comments. Provided viewer fixtures survived export; unauthenticated browser intake kept the Git identity fallback. This proves preservation, not hosted authentication.
- A real narrated scratch plan was reviewed, recorded, implemented and independently checked. A walkthrough flag led to a code fix, rebuilt narration and four changed scenes; the subsequent approval was recorded, committed and completed. [Saved lifecycle evidence](../eval/agents/codex-2026-10-11/lifecycle-final.json) distinguishes synthetic trial reviews from owner acceptance.
- A real unattended Codex review rebuilt one narrated scene, preserved six others, and completed with source-only commits. The initial ignored-audio mistake and completion-guard rejection are retained in the [headless trial](../eval/agents/codex-2026-10-11/headless-video.md).
- On Ubuntu 24.04 (a cloud machine with a virtual display), Codex CLI 0.164.0 in Ghostty 1.3.1 with tmux, following
  the skill: it started the review server (one approval), ran the printed opener with no prompt under the saved
  rule, and the player opened in a tmux split. A scripted reviewer answered the questions and pressed Send in that
  split; told it was sent, Codex took the review in with `reel-intake`. In a repo with no `.reelplanner/`, the
  waiter needed an approval too: it registers in `~/.reelplanner`. terminal-browser 0.13.4 splits Ghostty itself
  only on macOS; on Linux it splits tmux. The opener first ran in the sandbox there: reelplanner quoted the
  program's path, and Codex applies a rule only to a command whose first word is unquoted (now fixed).
- Apart from that Linux review, these trials cover Codex CLI 0.162.1 on one macOS machine. Automatic wake, the Codex app, cloud, the rest of the loop on Linux, Windows and WSL remain unverified. This branch’s own walkthrough review is a separate acceptance step.

## Open work

Each item: what to change, where, why, and how to tell it works. Pick one, open a PR, and update the table above.

3. **`reel init --agent` for the other agents.**
   *What:* add `opencode`, `agy` (Antigravity CLI), `cursor` and `copilot` to `AGENTS` and `agentBlock` in `scripts/lib/agents.mjs`, each with
   a headless command checked against that agent's `--help` (opencode: `opencode run --auto`, with `permission`
   rules in `opencode.json`), and their environment variables to `detectAgent`. *Why:* today they get `none`, so a
   review sent while no session waits stays in the inbox. *Verify:* `scripts/test/init.spec.mjs` cases for each, and
   one real headless run each.

5. **Trim `SKILL.md` under 500 lines.**
   *What:* move "Several people" and "Running the loop" into `skills/plan-to-video/references/`, leaving a line and a
   link each. *Why:* the Agent Skills format asks for under 500 lines, and agents with smaller windows load it
   whole. *Verify:* `wc -l skills/plan-to-video/SKILL.md`; a plan run still finds the loop's steps.

6. **The `compatibility:` frontmatter.**
   *What:* add `compatibility:` to `skills/plan-to-video/SKILL.md`'s frontmatter: Node 22.20+, ffmpeg, a headless
   Chrome, network for `setup`, the tested agent/client requirements listed above. *Why:* agents and skill registries read it
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
   2 minutes by default. *Verify:* an opencode run of `reelplanner build` on `videos/l1-upload-resume` finishes.

9. **A path with no display, for cloud agents.**
   *What:* when there is no browser and nobody to ask (Copilot cloud agent, Codex cloud), pack the video with
   `bundle-player` and push it as its own branch (as "Several people" does for a PR), and choose preview at
   faceless-explainer's Step 6. Add a `copilot-setup-steps.yml` template that runs `reelplanner setup`. *Where:*
   `SKILL.md` "Open it", `templates/`. *Why:* a cloud agent cannot open the review page or answer Step 6.
   *Verify:* a Copilot cloud agent run on a test issue ends with a branch the reviewer can open.

11. **Antigravity CLI, checked.**
    *What:* in a scratch repo, install the skill with `npx skills add` and check that `agy` finds it (through the
    link in `~/.gemini/antigravity-cli/skills`, or the repo's `.agents/skills`) and reads this repo's `AGENTS.md`;
    find its headless flags (unverified so far) for item 3. *Why:* it replaced Gemini CLI for most users, and none
    of it is tried here. *Verify:* a short plan run in `agy` loads the skill; write what it needs into the table above.

12. **Publishing.** The package is not on npm yet (`npm view reelplanner` says 404), and the owner decides when it
    is. Until then the docs and `scripts/release/install.sh` install it from GitHub, which downloads the repo's
    files with its example videos (about 64 MB compressed, October 2026).
    *What:* once published, keep the GitHub line as the fallback only; or, before that, attach `npm pack`'s tarball
    to each GitHub release and install from its URL. *Where:* `docs/releasing.md`, `scripts/release/install.sh`,
    `docs/reference.md#install`. *Verify:* `scripts/release/install.sh` on a clean machine takes the npm path.
