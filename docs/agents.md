# Agents

reelplanner is a skill plus a command-line tool, so any coding agent that loads skills and runs shell commands
can in principle drive it. Claude Code and Codex CLI are tested, on macOS and Linux; the table says what was tried
where, and [Codex](#codex) lists its evidence and limits. The other agents are untested.

## Support

| Agent | Status | What it needs from you |
|---|---|---|
| Claude Code | **Tested.** Every part of the loop and the hosted review page, on macOS; the whole loop again on a fresh Ubuntu 24.04 machine ([fresh machine](../eval/fresh-machine/2026-10-10-bakery-auto-mode.md)); the terminal review on macOS (Ghostty) and Linux (tmux), from opening beside it to the new version. The headless review run has handled a system-video review, but not yet a plan review, and its sandbox, as it ships, is untested on a normal macOS or Linux machine (it was proven on a weaker setting: [spec](../.reelplanner/spec.md#pipelines), D-082). | [Install](./reference.md#install), and its commands allowed once, so they run without a prompt each time ([Claude Code](#claude-code)). |
| Codex CLI (0.162.1; 0.164.0 for the terminal review) | **Tested.** On macOS: the whole loop (a narrated plan, its review, implementing it, the walkthrough and a flagged fix), the native plugin, an unattended rebuild with a failure and a retry, and exporting its own conversation. On macOS (Ghostty) and Linux (tmux): the terminal review, from opening beside Codex to the new version; Send wakes the session (`codex queue`). Not yet tried on Linux: planning, implementing and the walkthrough. | [Install](./reference.md#install), then the native plugin or the skill ([Codex](#codex)). Your sandbox, approval and commit-signing settings stay as they are. |
| Codex app | Untested. It would use the same local review page and inbox; whether a Send reaches an app session, and how it opens the page, are unchecked. | The local review server running; the inbox when a Send cannot reach the session. |
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

The native Codex plugin holds the same `plan-to-video` skill as Claude Code's. Install reelplanner and run
`reelplanner setup` first ([Install](./reference.md#install)), then add the installed package (or a checkout) as a
marketplace:

```sh
codex plugin marketplace add <package-or-checkout>
codex plugin add reelplanner@reelplanner
```

Codex keeps its own copy of an installed plugin and does not refresh it from the package: after
updating reelplanner, run `codex plugin add reelplanner@reelplanner` again. `npx skills add` (the README's third
install line) works in Codex too, in place of the plugin. Neither needs Codex hooks. Codex's
[plugin documentation](https://developers.openai.com/plugins/build/plugins).

On Linux, Codex's sandbox runs commands under bubblewrap, which needs unprivileged user namespaces.
Ubuntu 24.04 restricts those, and the sandbox would not start (`bwrap: loopback: Failed RTM_NEWADDR`).
The narrow fix is an AppArmor profile that lets only the sandbox's program use them; see
[Codex's sandboxing page](https://developers.openai.com/codex/sandboxing). Don't set
`kernel.apparmor_restrict_unprivileged_userns=0` on a machine you use: it turns that protection off
for every program on the machine, not only Codex. (The [Linux trial](./terminal-review.md#ghostty-trial)
sets it only on the throwaway machine it deletes afterwards.)

**How a review gets back to Codex.** Codex uses the same local review page as every agent. Send saves the review to
the inbox, with no file to download, and a waiting `review --wait` claims it and prints where it is. When Codex runs
`review` itself, it connects its own session (`--session codex:<id>`), and Send queues that session a message
(`codex queue`) that starts its next turn. reelplanner first checks that the session is running and has that
conversation loaded; if Codex's App Server cannot be found that way, pass `--session-endpoint ws://127.0.0.1:<port>`.
A queued message shows only that it was queued, not that the session acted on it. Older Codex CLIs, or a session
that is not running, get the inbox only, and not every Codex client wakes when a background command ends: so the
skill checks `reelplanner inbox` at the start of each turn.

**A review sent while no session is open** waits in the inbox, unless you opt in: `reel init <repo> --agent codex`
has the review server start Codex on it. The command it writes, for CLI 0.162.1, is
`codex exec --approve-for-me -c 'sandbox_mode="workspace-write"' -c sandbox_workspace_write.network_access=true --color never`.
That version rejects `--approve-for-me` together with `-s`, so the sandbox is set with `-c`, as tested in a real run.
[Automatic approval review](https://learn.chatgpt.com/docs/sandboxing/auto-review) keeps the sandbox and approves
only the requests it judges eligible, not every one. A git approval or commit signing can still fail: reelplanner
keeps the work, the log and how far it got, for a retry, and the review server never commits for it.

**Explaining a session.** `explain "What happened in this session?" this-session` finds the Codex conversation you
are in and its project, leaving out the conversations of reelplanner's own checkers. It reads the conversation
through Codex's read-only [App Server](https://learn.chatgpt.com/docs/app-server) export (older saved history works
too), and never resumes a thread or reads Codex's database directly. `session export codex:<id> --out <file.jsonl>`
writes the conversation and its tool calls to a file outside Git. When the export is unavailable, ask the owner for
a copy of that conversation and pass `explain --session-source <path>`.

Fresh-eyes reviewers start with no conversation of their own and get only the prompt reelplanner writes for them.
The skill's [harness reference](../skills/plan-to-video/references/harnesses.md) has the detailed commands, lease
renewal, recovery and permission advice.

**What Codex does not have.** The hosted review page is a claude.ai Artifact, so Claude only; to review away from the
machine, the reviewer uses a portable copy of the page, exports a review file and returns it for `reel record`
(D-313). The Claude Code mod (`/reel`) is kept on its own branch for comparison, not in the shared player. The
[terminal review](./terminal-review.md) is the same for every agent and every terminal terminal-browser supports;
it is tested in Ghostty, and in tmux on Linux.

### Evidence and limits

The approved implementation plan is
[Codex as a first-class reelplanner agent](../.reelplanner/plans/2026-10-11-codex-first-class/plan.md).
Its [walkthrough](../.reelplanner/plans/2026-10-11-codex-first-class/walkthrough.md) holds validation runs.
The owner narrowed this change to Codex CLI on 2026-10-11; the Codex app is untested and was not part of it. What
was run:

- The packed plugin installed, was enabled and loaded its skill in the real CLI, with a separate `CODEX_HOME`.
- A real headless review took the review in once and committed once. With commit signing made to fail on purpose
  (in a scratch repo), the edits were left uncommitted although Codex exited 0; with signing restored, a retry made
  one commit, without redoing the edit or taking the review in again.
- A Codex CLI session in iTerm2 (the owner confirmed it) checked that its own conversation was the one loaded, took
  a question asked on the review page, answered it, and sent the sourced answer back to the page. It polled for the
  question; this run did not test waking it.
- Exporting a real scratch Codex conversation (read-only, page by page) matched its ID and project; the transcript
  stayed outside Git.
- The review page opened in a terminal split (Ghostty 1.3.1, terminal-browser 0.13.4). Rewind, pause and resume,
  and the live timing checks, passed, and the owner confirmed the audio played normally. On a scratch plan:
  answering its choices, comments, Ask and Send, then Accept and Flag on the walkthrough, a rebuild for a requested
  change, and approving the changed scenes ([terminal review](./terminal-review.md)).
- A review exported from a page with no server, then taken in, kept its answers and comments, and the viewer's test
  fixtures survived the export. Taken in with no sign-in, it was attributed to the Git user. This shows nothing is
  lost on the way, not that a hosted sign-in works.
- A real narrated scratch plan was reviewed, recorded, implemented and checked by a fresh agent. Flagging part of
  the walkthrough led to a code fix, new narration and four changed scenes; approving them was recorded and
  committed, and the plan completed. The [saved record](../eval/agents/codex-2026-10-11/lifecycle-final.json) tells
  the scripted trial reviews apart from the owner's own acceptance.
- A real unattended Codex review rebuilt one narrated scene, kept the six others, and committed source files only.
  The [headless trial](../eval/agents/codex-2026-10-11/headless-video.md) keeps what went wrong on the way: the
  model first committed an audio file git ignores, and the completion check once refused a commit that did not
  match the files it had checked.
- On Ubuntu 24.04 (a cloud machine with a virtual display), Codex CLI 0.164.0 in Ghostty 1.3.1 with tmux, following
  the skill: it started the review server (one approval), ran the printed opener with no prompt under the saved
  rule, and the player opened in a tmux split. A scripted reviewer answered the questions and pressed Send in that
  split; told it was sent, Codex took the review in with `reel-intake`. In a repo with no `.reelplanner/`, the
  waiter needed an approval too: it registers in `~/.reelplanner`. terminal-browser 0.13.4 splits Ghostty itself
  only on macOS; on Linux it splits tmux. The opener first ran in the sandbox there: reelplanner quoted the
  program's path, and Codex applies a rule only to a command whose first word is unquoted (now fixed). Codex
  runs commands in a background server, and terminal-browser split the tmux pane that server was started from,
  which there was Codex's own; the opener now gives it the Codex window's pane (run again below).
- On macOS (the owner's machine: Ghostty 1.3.1, terminal-browser 0.13.4, Codex CLI 0.164.0's background server), with
  the saved opener rule: the opener ran with no prompt, found the Codex window and opened the review in a split
  beside it. Send queued a message that started the session's next turn with nobody typing; it claimed the review,
  took it in, revised the video and opened the new version beside it. Twice, the split closed a few seconds after
  Send (Ctrl+Q typed into it, then Ghostty closed the emptied split), and other terminal-browser windows stayed. With
  Daybreak Blue (`gpt-daybreak-blue-latest`), which Codex marks as cyber, Codex ignored the saved rule and the
  opener was refused localhost (`EPERM`); with GPT-6.1-Sol it applied.
- The whole loop on that Ubuntu setup, repeated with [`scripts/release/terminal-review.sh`](../scripts/release/terminal-review.sh)
  (a scripted reviewer; nobody typed after Send), passed for Codex CLI 0.164.0 and for Claude Code 2.1.310: the
  review opened in a new tmux pane beside the agent, the split closed after Send, Send woke the agent (Codex through
  `codex queue`, Claude Code when its background waiter ended), it took the review in, rebuilt the frame the comment
  named, committed, and opened the new version in a new split. Codex, on its default approval settings, asked 15
  approvals between Send and the new version, and 9 in a repo set up with `reel init`; Claude Code in auto mode, with
  reelplanner's commands allowed, asked none.
- On macOS (the owner's machine: Ghostty 1.3.1, terminal-browser 0.13.4), Claude Code 2.1.310: the review opened in
  a split beside it, the split closed after Send, Send woke it, it took the review in, revised the plan and the
  video, committed and opened the new version in a new split. The first try opened the review in the browser: a
  server that `review --detach` starts has no terminal, and terminal-browser finds the Ghostty pane to split by the
  terminal, so the command that starts the server now opens the page (on Linux, tmux names the pane in the
  environment, which is why it had worked there).
- **Not yet tried.** Apart from those terminal reviews, these trials cover Codex CLI 0.162.1 on one macOS machine.
  Unverified: waking Codex outside a terminal review, the Codex app, Codex cloud, the rest of the loop on Linux
  (planning, implementing, the walkthrough), Windows and WSL. So are video depth (low, medium, high) and the scenes
  a frame can start from (0.3.0): Codex gets them in the same skill, and the CLI holds a video to its depth, but no
  Codex run has used them yet.

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
