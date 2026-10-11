# Codex capabilities and reelplanner gaps

Research date: 2026-10-11. Read-only CLI probes used `codex-cli 0.162.1`. This is capability research, not evidence that a complete Codex lifecycle has passed.

## Plugins, skills and hooks

Codex has native `plugin`, `mcp`, `queue`, and agent/session commands. Its help accepts:

```sh
codex plugin marketplace add <local-path-or-repository>
codex plugin add reelplanner@reelplanner
codex queue --thread <session-id> --message <text>
codex exec --approve-for-me --help
```

Only help/parser checks ran; no marketplace was added to the owner's config and no session was sent a message.

OpenAI's [plugin architecture](https://developers.openai.com/plugins/concepts/plugins) packages skills, MCP servers and optional interfaces. [Packaging](https://developers.openai.com/plugins/build/plugins) now recommends a portable root `plugin.json`; `.codex-plugin/plugin.json` remains a compatibility fallback. A root package fits this repository's existing `skills/plan-to-video/` directory. The current Claude marketplace deliberately installs only that skill folder; preserve that path separately. Add release synchronization and package tests for any new manifests.

The packaging documentation limits lifecycle-hook packages to manual Codex desktop installation and excludes them from public-directory submission. [Hooks](https://learn.chatgpt.com/docs/hooks) can run at session start, prompt submission, tool use and turn completion. Non-managed hooks require trust of the exact definition; new definitions need review again. Hooks may provide context and a transcript path, whose format is explicitly unstable. Optional hooks can assist local inbox pickup without becoming a mandatory plugin dependency.

The owner clarified that “mods” means panes/windows inside the terminal session for viewing a plan. Claude has an official [Mods API](https://code.claude.com/docs/en/plugins/mods/overview), with [panes, buttons and text fields](https://code.claude.com/docs/en/plugins/mods/interface) drawn by in-process handlers. This differs from shell lifecycle hooks. No documented Codex-native equivalent to this pane API was found in the official OpenAI extension/CLI documentation checked.

A portable candidate is [terminal-browser](https://github.com/zenbu-labs/terminal-browser): an embedded Chromium pane in Claude's graphics-capable terminal. The owner’s actual reelplanner mod is audited below. Its own README also documents standalone `terminal-browser open <url>` and `terminal-browser --split right`, and HTML plan previews next to an agent. This is the closest portable candidate for Codex; its standalone split mode is separate from the Claude-native mod. Graphics-capable terminal support and actual narration/input behavior need a real trial. [Claude Canvas](https://github.com/dvdsgl/claude-canvas) is another, external TUI/tmux approach, marked an unsupported proof of concept by its author; do not conflate it with Claude's native Mods API.

[cmux](https://github.com/manaflow-ai/cmux) is a macOS terminal workspace supporting Codex, split browser panes and a scriptable local API. Its [CLI reference](https://cmux.com/docs/api) documents the presentation primitives. A browser pane beside Codex can potentially show the existing reelplanner player, preserving narration and interactive choices without changing Codex's internal UI. That is an adjacent workspace integration, not a native Codex Mod. `cmux` and `terminal-browser` are not installed here; tmux is installed. No runtime pane trial has passed. A text-only Markdown pane could show the plan but does not replace the narrated HTML player.

## Artifacts and hosted UI

The [Claude-plugin conversion guide](https://developers.openai.com/plugins/guides/submit-claude-plugin) explicitly says Claude live Artifacts are unsupported: their HTML, persistence, refresh and interactions are not preserved. Today's player uses `window.claude.use("db")`, `"user"` and `"sample"` for durable review rows, reviewer identity and model answers. These are runtime dependencies, not plugin manifest entries.

[Visualizations](https://learn.chatgpt.com/docs/visualizations) provide interactive charts/tools in supported ChatGPT chats. Codex CLI does not render them. [Sites](https://learn.chatgpt.com/docs/sites) provide hosted apps, persistent data and sharing in ChatGPT; there is no standalone Codex CLI management view. Account, workspace and rollout availability vary. Neither establishes a drop-in store and repo handoff for reelplanner.

[MCP Apps UI](https://developers.openai.com/plugins/build/chatgpt-ui) supplies iframe interfaces in compatible hosts through an open bridge. Tools should remain useful where UI is unavailable. A reelplanner UI would still need authenticated durable storage, review transport, question handling and a way to reach the repo. UI alone is not hosted review parity.

[OpenAI MCP Extensions](https://developers.openai.com/plugins/build/extensions) also documents ChatGPT sidebar apps, conversation panels and file viewers. Those are potential in-app presentation surfaces for a future MCP integration. The documentation describes ChatGPT surfaces, not an in-process pane API for the Codex terminal, and does not by itself prove support in every Codex client.

The existing `bundle-player` output is portable. Exported `annotations.json` can already be recorded by the CLI. This gives a browser review with manual transfer; it does not give automatic remote Send or remote model answering. An authenticated hosted service is a separate implementation and deployment choice.

## The owner's existing Claude Mods branch

The owner supplied `ccr-7d2997e8-elkd7p` alongside the official Mods link. Local and origin refs exist; it was inspected read-only at `d09b72d` (last commit: pause, resume and rewind keep sound and picture together). It adds 24 files/changes and about 3,823 lines relative to main. No merge, cherry-pick or worktree change was made.

This is reelplanner's own native `/reel` pane, not merely a generic terminal-browser integration. `skills/plan-to-video/hooks/register.tsx` uses the `claude-code` runtime's atoms, command/tool/session/UI events, `$.ui.open/resolve/blit/focus/toast`, and `$.prompt.submit`. It renders in Kitty/Ghostty with local audio; non-graphics terminals fall back to the browser. Desktop/mobile preview frames are silent. The pane uses `window.claude`/Artifact publishing only for the separate hosted fallback, not local playback.

Its behavior includes ancestor-folder library discovery and correct repo routing; video/captions/sound; pause/seek/replay/speed/stop navigation; single/multi/own/unclear answers and answer notes; walkthrough judgments; timed comments; summary approve/changes; durable inbox submission and native conversation handoff; rebuild/walkthrough readiness; and changed-scenes-only playback with a whole-video toggle. Drawing on the video and guide features use the full browser. The pane does not implement the browser's complete Ask/quiz/glossary experience.

Reusable contracts include `plan-map.json`, `caption_groups.json`, typed review records, `inbox --where`, and `scripts/reel-frames.mjs`, which streams rendered RGB/JPEG frames and audio from a cached terminal render. The Claude UI event module is host-specific. The first portable option is the existing full browser player inside an adjacent graphics browser pane, coupled to explicit Codex session delivery. A separate native TUI adapter is another possible implementation, but would need its own controls and graphics/audio verification.

The [Browser Annotation API](https://learn.chatgpt.com/docs/annotations-extensibility) is a possible app-browser handoff to investigate. It is user-mediated and does not automatically submit a prompt. A durable review should be filed before any annotation; only a small inbox identifier/context should be attached, with feature detection and a fallback. Runtime routing and player shadow-DOM constraints must be verified before claiming app parity.

## Actual integration gaps

| Gap | Evidence | Proposed direction |
|---|---|---|
| Headless commits | `scripts/lib/agents.mjs` chooses workspace-write; `scripts/lib/inbox.mjs` tells all agents a plain commit runs outside the sandbox, a Claude-only template exception | Agent-aware prompts and Codex automatic approval review; verify commit/signing for real |
| No active session wake-up | Skill prescribes polling; installed CLI now has `queue` | Explicit session connection, runtime delivery proof and durable inbox fallback |
| Claude-only session source | `scripts/lib/explainer.mjs` only searches `.claude/projects` | Prefer active Codex thread and repo metadata, support observed storage, exclude checker sessions |
| Native plugin absent | `.claude-plugin/marketplace.json` exists; Codex manifests/catalog absent | Portable plugin package plus Codex marketplace and version/package checks |
| Model-run evidence absent | `docs/agents.md` calls Codex basic and explicitly says no full run | Real scratch lifecycle with installation, videos, review, implementation, code check, walkthrough and fixes |
| Source checkout prerequisites | Setup reported the media tools present, but `node_modules` was absent; `pkgDir` alternated missing HyperFrames packages until a RangeError | Check checkout dependencies, name `npm ci`, and bound transitive package lookup |

This checkout's locked dependencies were installed with `npm ci` to build the plan review. It succeeded with 120 packages; Node 22.19.0 produced the expected engine warning because the package asks for Node 22.20+. No tracked dependency files were changed.

Codex metadata inspection read only session metadata keys, not conversation text: rollout `session_meta` includes identifiers, parent identity, working directory, source and runtime workspace roots. A `thread_history_1.sqlite` is present locally, and `codex migrate-rollouts --help` describes migration to paginated history. Legacy rollout globbing alone must not be called full current-session support. Prefer a supported history adapter or a hook-provided transcript registry; fail clearly when the identified session cannot be located.

The [App Server protocol](https://learn.chatgpt.com/docs/app-server) documents `thread/read` without resuming a session, `thread/list` with repository/source filters, and experimental `thread/turns/list` pagination. This is a possible supported adapter for current history; it still needs runtime and privacy verification. The implementation should not infer a durable database schema from the filename alone.

[Automatic review](https://learn.chatgpt.com/docs/sandboxing/auto-review) retains the sandbox and reviews eligible escalation requests. `approval_policy = "never"` offers nothing to review; supported automatic review needs an eligible approval policy and reviewer configuration. The installed CLI accepts `exec --approve-for-me`; this is a parser result, not proof of a successful headless commit. A harmless no-model sandbox probe reached macOS startup but the enclosing sandbox refused nested seatbelt execution (`sandbox_apply: Operation not permitted`). A real run needs execution outside that nesting constraint.

## Verification before claiming first-class support

1. Clean temporary Codex home: real marketplace discovery and plugin install, with the packaged skill present.
2. Real scratch Git repo: video build, independent checks, submitted review, revision and signed commit where signing is configured.
3. Headless approval and requested-change paths; blocked signing/escalation must leave recoverable work.
4. Live session: queue delivery, a question answered on the page, disconnection, claim/race recovery.
5. Session explainer: active main thread, newer checker, unrelated repo, custom Codex home and observed current history format.
6. Fast suite and full touched specs: likely `version`, `package`, `hyperframes-skills`, `init`, `loop`, `explainer`, `fresh-eyes`, `ask`, `local-review`, `working`, `handoff`; finalize based on actual changes.

Cloud and other OS behavior remain unverified until exercised. The repo currently has no Claude model-driven GitHub Action to match; its CI runs tests and install checks. Avoid adding unrelated model automation as an assumed parity requirement.
