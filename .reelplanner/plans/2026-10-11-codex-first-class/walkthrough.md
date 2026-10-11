# Codex as a first-class reelplanner agent — implementation

**In one sentence:** let Codex run reelplanner's complete local review workflow through the same shared code as Claude Code.

**Start commit:** `652894a6ddb8cf7303bd0cf709afa27f27b6b399` (plan approval recorded).

Implementation is in progress. The approved scope is local support plus portable remote copies (D-313); no hosted service is being deployed.

## Autonomous choices

| ID | Step | Chose | Instead of | Why | Where to check |
|---|---|---|---|---|---|
| A1 | 1 | Preserve “Decisions in force” in the guide's fold label [visible] | Relaxing the source-coverage check | Preparing the plan exposed an omitted source heading; the existing warning text had hidden the bug in old fixtures. This was fixed before approval. | `templates/guide/guide.js`, `scripts/test/guide.spec.mjs`; `preparation.md` records the passed 52-spec and 111-check runs. |
| A2 | 3 | Keep an explicit session connection in the ignored inbox's `.connection.json` [visible] | Keeping it only in a server process's memory | A reused or restarted local server should retain the connection the user explicitly selected, while validating it before delivery. | `scripts/review.mjs`, `scripts/lib/inbox.mjs`; connection and stale-recipient specs. |
| A3 | 3 | Use a renewable five-minute session ownership lease, with explicit renewal/progress commands [close] | Treating the exited waiter process as the worker's lifetime | A waiter exits as soon as it hands work to the agent; expiry must reflect the real owner's activity and must never override a live headless process. | `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`; live-owner, expiry and renewal specs. |
| A4 | 2 | Keep retry phases and the original Git baseline in one persistent ignored progress record [close] | Recreating progress from the latest claim or treating a changed HEAD alone as proof of completion | Recovery must distinguish edited, committed and completed work after a crash, without repeating edits or accepting an unrelated commit. | `scripts/lib/inbox.mjs`; stopped-run recovery and completion-guard specs. |
| A5 | 4 | Provide `--session-source` for a verified owner copy, and export identity-first JSONL [visible] | Treating an arbitrary transcript path as the active conversation, or exporting an unlabelled conversation | The saved source must identify the requested session and project; JSONL remains readable by the existing sequence-source tools and stays outside Git. | `scripts/explain.mjs`, `scripts/session.mjs`, `scripts/lib/codex-session.mjs`; active-source and export specs. |
| A6 | 5 | List current and ancestor videos with their owning repo, and keep each review page within one owner [visible] | Combining different repos into a page whose single inbox could receive the wrong review | A nested Git repo must retain its own session and inbox even when an ancestor has a library. Explicit video paths route to their owner; mixed-owner bundles fail before opening. | `scripts/lib/review-projects.mjs`, `scripts/lib/env.mjs`, `scripts/review.mjs`; nested-repo discovery and routing checks. |
| A7 | 3 | Bind a connection to a verified running endpoint, with explicit `--session-endpoint` when needed [visible] | Treating saved identity plus a successful bare queue command as live delivery | A real closed-thread queue returned success without acting. Read-only endpoint verification must confirm that exact project thread is loaded; delivery then targets that endpoint. | `scripts/lib/codex-session.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `scripts/review.mjs`; actual App Server turn and endpoint regressions. |
| A8 | 4 | Declare `ws` as a direct dependency for the documented Unix WebSocket transport [close] | Hand-writing WebSocket framing or relying on an undeclared transitive dependency | The daemon socket speaks WebSocket, while the CLI proxy copies raw bytes. A real read-only probe exposed the difference; Node's native WebSocket cannot connect to a Unix socket. | `package.json`, `package-lock.json`, `scripts/lib/codex-session.mjs`; real Unix transport regression and daemon verification. |
| A9 | 5 | Serve single byte ranges and return the complete file for unsupported multipart ranges [close] | Implementing multipart responses for the local review server | Browser media seeking uses single ranges. The shared response helper supplies exact lengths and partial responses without adding a multipart encoder; unsupported requests still get a valid complete representation. | `scripts/lib/http-file.mjs`, `scripts/lib/static-server.mjs`, `scripts/review.mjs`; `scripts/test/media-seek.spec.mjs`. |

## Implementation by step

### Step 1 — Install through Codex's own plugin system

In progress: native packaging, dependency diagnostics and the small shared agent interface.

### Step 2 — Finish headless reviews with Codex's permission model

In progress: agent-specific launch/commit advice and guarded recovery of stopped work.

### Step 3 — Deliver reviews to a live Codex session

In progress: durable delivery, session connection, question replies and shared ownership.

### Step 4 — Explain the correct Codex session

In progress: verified conversation discovery and read-only export with private sources outside Git.

### Step 5 — Match terminal review and the selected remote path

In progress: browser/workspace presentation, direct local Send, occupied-port recovery and portable-file validation.
The owner selected terminal-browser with Ghostty for hands-on testing and asked for a shared section across
supported terminals and agent harnesses. `docs/terminal-review.md` covers that setup; README and the harness
reference link it. The launcher delegates terminal compatibility to terminal-browser rather than keeping
its own terminal-name allowlist. Homebrew installed 0.13.4; the owner's Ghostty 1.3.1 opened the scratch
reference player. The owner reported odd audio after rewinding, pausing and resuming in both the pane
and ordinary browser. That fault was reproduced in the live tab: a fully buffered 5.76-second narration
reported `seekable: [0, 0]`, and assigning its media position to two seconds returned to zero. The review
server had sent chunked audio with no length or byte-range support. `http-file.mjs` now supplies seekable
responses to both local servers. After reloading the audio, the live Ghostty element reported `[0, 5.76]`
and advanced from 3.634 to 4.438 seconds while the video advanced from 68.167 to 68.967. The owner
confirmed: "Audio sounds normal now." The remaining pane review controls and complete lifecycle
are still unverified.

### Step 6 — Prove the whole lifecycle and state support accurately

In progress: real scratch CLI/app trials, required specs, independent code check and walkthrough review.

## Validation

Implementation validation is underway. Before the audio-server fix, the supported task-local Node 22.20.0 fast run passed all 58 specs
after isolating the memory test from the owner's pending-summary file in its scratch copy. Full runs of
presentation (14 checks), review-projects (3), harnesses (11), review-status (46), memory (81) and sound (10)
passed. After the audio-server fix, full runs of media-seek (27 checks), static-server (7), review-status
(46), sound (10) and controls (39) passed. The new media regression includes a five-second keyboard
rewind across narration clips, confirms exactly one voice plays, and checks synchronization after pause
and resume. The final supported-Node fast run passed all 59 specs in 219.8 seconds, without fixture
changes; its captured output is `runs/npm-test-audio.txt`. Live Ghostty timing and the owner's
listening check also passed. The complete scratch lifecycle remains open.
Earlier preparation results are in `preparation.md`; the real headless approval/failure/retry run is saved
in `runs/headless-real.txt`. CLI/app lifecycle, independent code check and walkthrough review remain open.
