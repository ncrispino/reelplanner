# Review in your terminal

Keep your coding agent in one pane and reelplanner's video in another. This is an optional way to
open the same review player: narration, captions, questions, comments and Send use the existing
player and inbox. It works independently of the agent harness; Claude Code, Codex and custom commands
share this presentation path. Live notification and unattended handling still depend on that agent's
supported integration.

## Install and open

Install [terminal-browser](https://github.com/zenbu-labs/terminal-browser), then run the review command
from the terminal pane where you want the video beside your agent. On macOS with Homebrew:

```sh
brew install --cask terminal-browser
reelplanner review <video-dir> --detach --workspace terminal-browser
```

In a reelplanner source checkout, use `node bin/reelplanner.mjs` instead of `reelplanner`.
The launcher asks terminal-browser to open the review URL in a right split. Terminal-browser handles
terminal and multiplexer detection; reelplanner does not restrict it to a list of terminal names.
Rendering graphics and opening a split are separate capabilities, so a graphics-capable terminal
may still require opening a pane manually. Other operating systems and installation methods are
covered by [terminal-browser's installation instructions](https://github.com/zenbu-labs/terminal-browser#installation).

If your agent runs somewhere without access to your actual terminal pane, start the review server
there with `--no-open`, then run this yourself in your local terminal using its printed reachable URL:

```sh
terminal-browser open --split right "<review URL>"
```

The opener never enables a headless agent, changes an approval policy, or chooses another session.
Use `review --wait` / `inbox` in the owning repo to pick up reviews. **Send on the local player saves
directly; no download is needed.** A disconnected portable copy still exports a file to return to
the agent. Agent-specific connection and recovery commands are in the
[harness reference](../skills/plan-to-video/references/harnesses.md).

## Remember the workspace and allow automatic opening

Run this once in your local terminal to remember terminal-browser for future reviews:

```sh
reelplanner review-setup --workspace terminal-browser
```

For Codex, explicitly authorize the opener once so opening each ready review needs no new prompt:

```sh
reelplanner review-setup --workspace terminal-browser --codex-allow-open --dry-run
reelplanner review-setup --workspace terminal-browser --codex-allow-open
reelplanner review-setup --check
```

Restart Codex afterward. The first command previews the exact rule; the second saves it under
`$CODEX_HOME/rules/reelplanner-review.rules` (normally `~/.codex/rules/`) and records the choice in
the machine's reelplanner folder (`~/.reelplanner/review.json`, or `REELPLANNER_HOME`). No other
Codex rules or approval settings change. Plain setup and plugin installation never grant this access.

The skill starts the review with `--no-open`, then runs the separate absolute `review-open` command
printed by the server launcher. This lets Codex match the permission to the opener itself. The
opener accepts only local review-page URLs, checks the server, and asks terminal-browser to split
right. It never starts a server, controls the page, sends a review, or falls back to another browser.
This explicit command uses `terminal-browser` from the invoking shell's `PATH`; it does not need
the launcher's `REELPLANNER_HOME` or saved workspace preference to survive into the agent shell.
Changing the default workspace to `browser` does not revoke this command's permission; use
`--codex-disable-open` for that. If opening fails, report the failure before waiting for a review.
Server startup can still require approval; when policy prohibits it, run the review command yourself
from a local shell. Opener permission does not override a managed prohibition or the screen-capture
permissions of your recording tools.

`--check` checks the installed executable, terminal-browser's split option, and the saved rule with
Codex's rule parser. It does not open a pane or prove the current session loaded the rule; other
rules and managed restrictions can take precedence. After moving/upgrading Node or reelplanner,
run setup again if the check reports a stale path.

Use `reelplanner review-setup --codex-disable-open` to remove just this rule, then restart Codex.
Use `reelplanner review-setup --workspace browser` to restore the ordinary browser preference.
`review --workspace …` overrides the preference for one invocation; `--no-open` opens nothing.

## Ghostty trial

On macOS, terminal-browser's Ghostty split support requires Ghostty 1.3.0 or newer, according to its
[Ghostty integration](https://github.com/zenbu-labs/terminal-browser/blob/main/terminals/src/terminals/ghostty.ts).
Start from a normal Ghostty shell so it can identify the invoking pane. An agent's background shell
or an unrecognized multiplexer may not expose that pane even when Ghostty itself supports graphics.

For the trial, check:

1. The intended video appears in the adjacent pane, with readable text and captions.
2. Play, pause, seek, replay, speed and audible narration work together.
3. Choices, your own answer, clarification, comments and walkthrough Accept/Flag work where offered.
4. Finish and Send reach the video's owning inbox; the answer and reviewer identity survive intake.
5. A rebuilt video shows its new version and offers the changed-scenes view.

Launcher contract tests establish command routing and error handling. They do not establish visual
or audio parity. In the current hands-on trial, Ghostty 1.3.1 opened the player with terminal-browser
0.13.4. A reported rewind/pause/resume audio fault also occurred in ordinary browsers: the local server
had not supplied seekable media responses. The server now supplies file lengths and byte ranges;
the regression and live Ghostty timing checks pass, and the owner confirmed the audio sounds normal
after the fix. A separate synthetic plan trial then exercised a choice, comment, sourced Ask answer,
Finish and direct Send through the Ghostty pane. The saved review was adopted, recorded and used
to revise the scratch plan. The same pane then exercised walkthrough Accept/Flag and requested changes. After the agent
removed the flagged panel and rebuilt four of five scenes, the changed-scenes view skipped the
unchanged scene. A second review accepted both choices; its verified note survived Send, intake,
commit and completion. These were synthetic acceptance trials, separate from the owner’s review of
this change. See the [saved lifecycle evidence](../eval/agents/codex-2026-10-11/lifecycle-final.json).

After updating reelplanner, restart an older review server with `review --stop`, then open it again.
Refresh an existing page so its audio loads from the updated server. That matters because an already
buffered audio element can retain the earlier unseekable response until it reloads.

## Other review workspaces

| Workspace | What opens | What you need |
|---|---|---|
| `browser` (default) | The review in your ordinary browser | A reachable review URL |
| `terminal-browser` | That URL in a terminal-browser pane | Its CLI and a supported terminal/pane |
| `cmux` | That URL in cmux's browser pane | macOS, cmux, and the invoking cmux workspace |

cmux is optional; terminal-browser can use your existing supported terminal. The cmux adapter binds
to the invoking workspace rather than a different focused window. If an optional opener is missing
or fails, reelplanner explains the failure and opens the ordinary browser. `--no-open` opens nothing.
It always prints the actual listening URL, including a free port when the requested port is occupied.

Run `reelplanner review --list` to find built videos in the current and ancestor folders. Each entry
names its owning repo. Open a selected source path to send reviews to that owner; keep videos from
different owners on separate pages.
