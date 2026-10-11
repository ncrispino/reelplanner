# Codex as a first-class reelplanner agent

**In one sentence:** install reelplanner as a native Codex plugin, use the whole plan-and-review loop from Codex, and prove the same outcomes that work in Claude Code.

## The problem

The owner asked: "Pls create a branch. Our goal is to get codex fully working, fully featured on reelplanner as an alternative so it is first-class like claude code". They added: "oh i am not sure about the claude artifact euqivalent i ahven used in codex. do look into that and codex if it has something similar to claude plugisn and mods though too".

The branch `feat/codex-first-class` has been created. The Codex implementation below is proposed. Preparing its review exposed one guide-heading bug, fixed and tracked separately in `preparation.md`; the native plugin and lifecycle changes have not landed yet. Current Codex support checks flags, without a complete model-driven run. A headless review gets Claude-specific commit instructions, its default sandbox cannot write Git metadata, and `this-session` finds only Claude transcripts. The skill's polling advice predates Codex's current queue and hooks. The repo offers a Claude plugin marketplace, but no Codex package.

The owner also supplied `ccr-7d2997e8-elkd7p`, inspected at `d09b72d`, as the Claude Mods implementation. It has a real `/reel` pane with video and sound, branching questions, comments, walkthrough judgments, Send into the session and changed-scenes playback. It is a separate branch, not merged into this one. That pane's user-visible behavior is part of the comparison below; its Claude-specific runtime is not assumed portable.

Four changes make the local experience first-class: a native install; reliable review delivery and headless follow-up; explainers of the right Codex session; and a real installation-to-walkthrough proof. Remote hosting needs its own explicit choice. OpenAI supports plugins, skills, MCP tools and trusted hooks, but does not preserve Claude live Artifacts or their database. ChatGPT Sites and MCP Apps UI are candidates, not evidence that Codex CLI has an Artifact runtime. The current browser player already works across agents. Research and exact sources live in `research.md` beside this plan.

| reelplanner capability | Claude Code today | Codex today | Acceptance in this plan |
|---|---|---|---|
| Install and invoke the skill | Native marketplace and skill install | Skill install; no native package | Native plugin and existing skill route both work |
| Narration, frames, player, guide and media tools | Shared pipeline exercised | Same commands, no full model run | Real narrated plan and walkthrough builds, with guide and real tool setup |
| Decisions, records, memory, revise/fix and system updates | Shared CLI exercised | Same CLI, unproven complete workflow | Real reviews preserve decisions, comments and memory; fixes and system record agree |
| Fresh eyes and independent code check | Fresh agents used | Instructions exist, execution not proven | Fresh Codex reviewers write and satisfy the actual finding contracts |
| Local Send, questions and status | Waiter/headless routes exercised | Generic routes, no proven Codex handoff | Active-session questions, reviews, status and failure recovery tested |
| Unattended review and commit | Claude command and commit exception | Wrong shared commit advice; strict sandbox | Supported automatic review, real commits and recoverable denials |
| Explain this session | Claude transcript discovery | Claude-only lookup | Correct Codex main thread, including supported current history |
| Review within a terminal workspace | Supplied branch has a full native `/reel` pane | No documented native pane API found | Delivered optional terminal-browser/workspace integration must preserve the pane's review outcomes |
| Remote automatic Send and model answers | Claude Artifact database/identity/model runtime | No direct equivalent established | Option A remains manual export; option B proves a hosted bridge before service implementation |

Option A therefore makes the core local workflow first-class; it does not claim complete automatic hosted parity. Neither Claude nor Codex has a model-driven GitHub workflow in this checkout. Cloud execution and other operating systems require their own evidence before support claims expand.

### What your review changed

You chose **A** in the review, recorded as **D-313**. On this machine, **Send delivers the review to the project; you do not download a file**. That is how this review reached the waiting Codex session. Step 3 makes the direct notification work with a connected Codex session too. A download is needed only when someone reviews a portable copy elsewhere, with no connection to the project. That separate remote case is the limit of A, not the normal local workflow.

You also asked for clear interfaces, less repeated code and simpler language. The shared workflow will own reviews, saved answers, ownership, retries and status. Small agent-specific modules will handle only what Codex or Claude must do differently. The video explains what you do and what you see; exact flags and storage details stay in the guide and research. An unfinished Git commit is shown plainly as unfinished work, even if the edited files already exist.

### Step 1 — Install through Codex's own plugin system

**It lets you:** add reelplanner as a Codex plugin and invoke its plan-to-video skill.

This step stands alone. Add a portable root plugin manifest and a Codex marketplace entry referencing the package root, where `skills/plan-to-video/SKILL.md` lives. Preserve the existing Claude marketplace's lightweight skill install. Keep package versions together through `scripts/release/sync-version.mjs`; include manifests in the npm package. Use a clean temporary Codex home to verify the actual CLI discovers and installs the plugin. A plugin install makes the skill available; the CLI and video dependencies still need setup.

A fresh user's supported sequence is `npm i -g github:ncrispino/reelplanner` for the executable, `reelplanner setup --dry-run` then `reelplanner setup` for the media tools, and the Codex marketplace/plugin commands for the skill. The source checkout instead uses `npm ci` and `node bin/reelplanner.mjs`. Run machine setup outside a restricted agent sandbox as the current AGENTS.md says; do not tell someone to run an executable they have not installed. Optional local hooks are supplied separately with explicit installation/trust instructions; the core public-compatible plugin must work without them.

Create a harness reference for Codex and Claude: invocation, fresh agents without conversation history, permissions, background jobs, inbox handling, supported surfaces, and transcripts. Link it at the relevant skill steps. Setup diagnostics must explain the selected agent's needs and distinguish available tools from model runs that have passed. For a source checkout, report missing npm dependencies and `npm ci`; dependency lookup must return a useful missing-package error rather than recursively alternating absent packages. This happened while building this plan's own video, after setup reported the media tools ready. Do not edit the user's global config or enable headless follow-up implicitly. Hooks are optional local integration, since bundled hooks currently require manual installation and trust and are not eligible for the public directory.

**Keep the coding-agent interface small.** Extend the existing agent-selection code instead of building a second review system for Codex. A shared caller selects a Claude, Codex or generic-command adapter once. Agent differences belong behind the contract below: checking available features; producing the launch command and permission/commit instructions; notifying a verified session; and finding that session's saved conversation. These operations receive an explicit repo and environment rather than reading unrelated global state. Use ordinary functions and small modules; no registration framework, dependency injection container or repeated copies of the lifecycle scripts.

The shared code owns input validation, saving reviews and questions, claims and their renewal, retries, recording decisions, progress/status, builds and completion. An adapter cannot mark a review done, modify its answers, or claim that a queued message was acted on. A presentation adapter opens a URL in a browser or terminal workspace; it does not implement a second player or review format. Existing custom agent commands keep a generic path, with unsupported features stated explicitly. Add another coding agent by implementing its small adapter and contract checks, not by copying the review server, inbox or player. The independent code check must look for agent-name branches escaping this boundary and for duplicate workflow code.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Native install | `codex plugin marketplace add <checkout>` then `codex plugin add reelplanner@reelplanner` | Codex discovers the packaged skill | you run: add marketplace; found: package; installed: skill; you invoke: `$plan-to-video` |
| Skill-only install | `npx skills add <checkout> --skill plan-to-video -g -y` | Existing path still works | you run: install; linked: skill; you invoke: plan |
| Dependencies absent | `reelplanner setup --dry-run` | Names missing tools and the way to install them | you run: check; inspected: tools; you see: missing and commands |
| Older Codex | CLI lacks automatic review or queue | Reports the capability limit and supported fallback | you run: check; inspected: help; you see: update or manual inbox |

#### Interface

```text
plugin.json                                   # portable identity and packaged skills
.agents/plugins/marketplace.json               # Codex discovery of the package root
codex plugin marketplace add <checkout>        # register this source
codex plugin add reelplanner@reelplanner        # install its skill
skills/plan-to-video/references/harnesses.md    # execution instructions by harness
reelplanner setup --dry-run                    # read-only prerequisites and capability checks
```

The proposed internal contract, with exact names settled during implementation, is:

```text
getHarness(id) -> supported agent or generic command  # choose the agent-specific functions once
probe({ repo, env, executable }) -> capabilities     # check the installed version and usable features
headless({ repo, env, reviewPath }) -> launchSpec    # command arguments, environment and commit advice
deliver({ repo, session, inboxPath }) -> result      # delivered, unavailable or failed; never finished
sessionSource({ repo, env, session }) -> source      # verified conversation source or an explicit limit
openReview({ url, workspace }) -> opened | unavailable | error  # separate presentation adapter
```

Delivery means the message reached the agent's supported interface; it does not mean the work finished. The shared workflow decides the fallback and eventual status. Contract checks exercise the same result shapes for both agents, and require useful unsupported results for generic commands. A tiny fake adapter proves shared delivery/retry logic can be used without adding another agent-name branch. Test behavior and recovery, not merely that an object has these method names.

#### Example

In a temporary Codex home, register this checkout, install `reelplanner@reelplanner`, and inspect the installed skill and its references. Then plan a tiny change in a scratch repo, using that skill and this checkout's CLI. Save commands and their actual results for the walkthrough.

```diagram
flow: Native install
Codex marketplace -> plugin package: find
plugin package -> plan-to-video skill: install
plan-to-video skill -> reelplanner CLI: run the loop
```

### Step 2 — Finish headless reviews with Codex's permission model

**It lets you:** send a review with no session open and get a committed result from Codex.

Depends on step 1's capability checks. For explicit `reel init --agent codex`, use the installed CLI's supported automatic review mode within workspace-write, with the existing network setting stated plainly. The installed `0.162.1` accepts `codex exec --approve-for-me`; official docs say automatic review judges eligible escalations without enlarging the sandbox. Verify the minimum supported version rather than assuming old CLIs accept this flag.

Make `agentPrompt` aware of the configured harness. Claude's commit exclusion applies only to Claude. Codex must request an eligible escalation for Git operations when its sandbox blocks them; it must not be told commits automatically escape the sandbox. Preserve signing and existing user configuration. A failed or denied commit leaves the review unfinished with its log, rather than reporting success or committing from the server. Remove stale parent-agent identity when launching a different headless harness so session discovery and nested execution see the correct agent.

The reviewer sees the stopped state and log link on the review page; `reelplanner inbox` also names the same item and run log. Provide a deliberate retry operation for a stopped run, after checking that no live owner still holds it. Record progress phases in the ignored inbox run state, so retry first inspects existing intake records, the worktree and any commit before applying anything. A failure after edits but before commit resumes from those edits; an already committed result needs completion, not another edit or commit. Intake remains deduplicated. Do not describe arbitrary agent edits as transactional exactly-once execution.

**What “finished” means:** the required edits are checked, the Git commit succeeds, and only then is the review marked done. If the files were edited but the signing key is unavailable, the work is **still unfinished**. Keep those edits and show “Stopped before commit” with the log; fix the signing setup and retry from the saved work. The server must not commit on the agent's behalf or report “ready” merely because the files changed. The video shows this concrete example before the prediction question, using the same plain words.

For that signing failure, the review page shows the stopped state and log. The owner restores their signing key or corrects its configuration; reelplanner preserves that configuration. The agent then runs the guarded `inbox retry` operation, which checks for a live worker and already-completed work before resuming. Do not suggest that the person must repeat the edits or turn off signing to finish.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Approved plan | Send an approval with a comment | Intake, fold comment, commit, mark done; no video rebuild | you send: approval; filed: review; changed: plan; committed: result; you see: ready |
| Changes requested | Send a correction | Rebuild affected beats, verify, commit, mark done | you send: change; changed: beats; checked: video; committed: result; you see: ready |
| Commit blocked | Automatic review denies escalation, or the signing key is unavailable | Keep edits and show “Stopped before commit”; retry after the cause is fixed | agent edits: files; commit fails: reason logged; kept: unfinished review; you see: stopped |
| No configured headless agent | Send while nobody waits | Review waits for next session | you send: review; saved: inbox; you see: waiting |

#### Interface

```text
reel init <repo> --agent codex             # explicitly configure future headless reviews
agent.command                            # supported sandboxed Codex command
agentPrompt(path, id, harness)            # correct harness-specific follow-up instructions
reelplanner inbox retry <id>              # proposed recovery of a stopped run, with live-owner guard
reelplanner inbox done <id>               # only after required work and commit succeed
```

#### Example

Initialize a scratch Git repo, configure Codex, send an approval through the review page, and inspect `git log`, the recorded review and the inbox status. Repeat with a signing failure: the page must show stopped, with the pending work discoverable. Run Claude regression cases as well.

```diagram
flow: Headless follow-up
review sent -> Codex run: start once
Codex run -> automatic reviewer: request commit escalation
automatic reviewer -> commit: approved
commit -> inbox done: success
automatic reviewer --> stopped review: denied
```

### Step 3 — Deliver reviews to a live Codex session

**It lets you:** press Send or Ask about this and have your active Codex session handle it.

Depends on steps 1 and 2. Add an explicit connection between the review server and a Codex session, using the CLI's queue capability where available. Verify delivery in the installed CLI daemon; an accepted queue command alone is not proof the session acted. A trusted optional session hook may advertise its session identity; provide a documented explicit connection for installations without hooks. Do not make the core plugin depend on trust changes.

Keep the current inbox as the durable record and preserve delivery priority: a waiting session, then the connected live session, then an explicitly configured headless run, then the inbox. Use claims to prevent two agents processing a review. A failed queue releases its delivery claim and uses the documented fallback. Questions still go to a live session only, without starting headless runs. Save an accepted question before attempting delivery. A failed or stale connection leaves it unanswered and available to the next session and in the submitted review, with a clear waiting indication; a queue acknowledgement is not an answer and does not consume it. Disconnection and stale session identity must not silently consume a review. The exact connection command is proposed below; its behavior is tested before it is advertised.

“Exactly once” here means one stored/intaken review and at most one live handler, with explicit crash recovery; it is not a guarantee that an arbitrary edit can never need reconciliation. Associate ownership with the session/run and a renewable lease instead of treating an exited waiter process as proof that the agent died. A worker that dies after editing leaves its phase record and files intact; a retry checks them before proceeding. Connection obtains the current `CODEX_THREAD_ID` when invoked from that session, or a user-selected ID from Codex's session listing; verify both repository and active-session identity before registering, and reject a mismatched recipient.

On reconnect or at session start, the skill runs `inbox` and claims the oldest unanswered question through the bounded waiter, reads its plan/scene context and runs `inbox answer <id> "<answer>" --from "<source>"`. The page's existing question-status polling displays the answer and its source. A pending question is retained until answered, even when it is also included in a submitted review; deduplicate by its ID.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Live session connected | Send review | Queue only its inbox path to that session | you send: review; saved: inbox; queued: path; agent reads: file |
| Waiting CLI task | `review --wait` already running | Existing waiter wins; no duplicate queued work | you send: review; claimed: waiter; handled: once |
| Page question | Ask about this | Live session answers from plan/scene; no headless job | you ask: question; queued: path; agent answers: evidence; you see: answer |
| Session gone | Queue fails or connection is stale | Retain inbox entry and fall back safely | you send: review; failed: delivery; kept: inbox; you see: waiting or headless status |

#### Interface

```text
reelplanner review <video-dir> --detach --session codex:<id>  # proposed explicit connection
codex queue --thread <id> --message <inbox-path message>     # notify, without embedding review prose
reelplanner review --wait --timeout 90                      # fallback bounded waiter
reelplanner inbox                                          # durable pending items
```

#### Example

Connect a scratch review server to a real Codex session. Submit one review and one question. Verify each is handled once and the page shows the answer. Stop the session, submit again, and verify the review stays available rather than disappearing into an unreachable session.

```diagram
flow: Review delivery
Send -> inbox file: save first
inbox file -> waiting session: first choice
inbox file --> connected Codex session: notify
connected Codex session --> headless run: delivery unavailable
headless run --> next session inbox: not configured
```

### Step 4 — Explain the correct Codex session

**It lets you:** ask what happened in this Codex session and get an explainer pinned to its transcript.

This step stands alone. Extend `thisSession` to support Codex's session storage under `CODEX_HOME`, including the formats actually present on the supported CLI. Prefer the active `CODEX_THREAD_ID` and matching repository metadata; never substitute an unrelated or fresh checker session simply because it is newer. When no active identity exists, use the newest eligible main session for this repo in the detected harness. Keep Claude behavior working; use real paths for repo matching, handle malformed/unreadable records, and give an explicit-source fallback when storage is unsupported or the identified session is absent.

Pin external transcripts by path, hash and size only. The source privacy checks still apply and the transcript's contents do not enter Git. Test multiple repos, both harnesses, subagents, a non-default Codex home, legacy rollout files and any current paginated history observed in the runtime probe.

Provide a supported `session export` adapter for current history when no usable transcript file exists. It reads the selected thread through Codex's documented read-only App Server history methods without resuming it, writes visible conversation/tool history plus session/repo metadata to an external local file, and prints its path. Its default output is outside the repo and Git; never commit it. `CODEX_THREAD_ID` comes from Codex, `CODEX_HOME` is the user's optional storage setting, and `sources.json` is the explainer's repo record containing only the pin. A this-session export must match the requested ID and canonical repository metadata; missing or mismatched identity is an error. An explicitly chosen generic source path remains the source the person chose, without silently being relabelled this session.

If the active thread is verified but no file is readable, first try that supported read-only export. If it cannot recover the source, explain which conversation could not be read and ask the owner for an export or file path for that conversation. Verify its session and project before using it. Neither the agent nor the owner should have to guess which newer conversation happens to contain the right work.

If the active source, supported export and owner-provided copy are all unavailable or unreadable, stop the explainer with a clear missing-source error naming the requested conversation. It remains unfinished until its source can be read; never substitute another conversation or fabricate an account of this one.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Active Codex session | `this-session`, matching thread ID | Pins that thread's source | you ask: session; matched: ID and repo; pinned: source; video uses: evidence |
| Different repo newer | Another repo's transcript has newest timestamp | Excludes it | searched: metadata; rejected: wrong repo; pinned: this repo |
| Independent checker newer | Subagent transcript written most recently | Main session remains the source | searched: sessions; rejected: checker; pinned: main |
| Unsupported storage | No eligible readable source | Error names explicit transcript path fallback | you ask: session; absent: source; you see: pass a path |

#### Interface

```text
reelplanner explain "What happened in this session?" this-session  # discover and pin
CODEX_HOME                                                        # Codex storage root
CODEX_THREAD_ID                                                   # prefer this session
reelplanner explain "What happened?" <transcript-path>              # explicit fallback
reelplanner session export codex:<id> --out <external-path>         # proposed supported current-history export
```

#### Example

A fake Codex home holds the current main thread, a newer checker and a different repo's newer thread. `this-session` selects the current main thread. Inspect `sources.json`: it names the source and hash and does not copy transcript contents. Repeat against a real supported Codex session.

```diagram
flow: Find this session
active thread ID -> repo metadata: match
repo metadata -> transcript: pin exact session
missing active session -> explicit source error: no silent substitution
```

### Step 5 — Match terminal review and choose the remote path

**It lets you:** watch the plan beside Codex, send a local review directly, and share a portable copy when someone is elsewhere.

Your review selected **A (D-313)**. The usual local workflow is watch → answer → Send → Codex handles the saved review. **No download is needed locally.** The portable-copy workflow is for a reviewer elsewhere with no connection to the project: watch → answer → download → transfer the file to the agent. It has no automatic remote answers. Keep those two cases visibly separate in the video, docs and player messages; never describe all browser reviews as manual exports. A hosted service that connects remote Send to the project is a later, separately reviewed change.

Document the extension choices using concrete outcomes. Codex plugins install agent instructions and tools. Trusted hooks run small commands at chosen moments. Compatible MCP interfaces can show an app, and ChatGPT Sites can host one. These do not automatically provide the stored reviews, signed-in reviewer or model answers that today's Claude-hosted page uses. The research keeps the exact technical names and limits. The main explanation should say what each choice lets the reviewer do.

The owner clarified "mods": "oh there is a claude mod that lets you add windows and stuff within claude so we can view the plan in a terminal". Claude has an official in-process Mods API that draws panes and widgets, distinct from shell lifecycle hooks. The `terminal-browser` mod embeds Chromium in a supported graphics terminal; its standalone CLI also offers split panes independently of Claude. No documented Codex-native equivalent to that pane API was found. Research and trial a portable presentation adapter: Codex in a terminal pane with reelplanner's existing HTML player in an adjacent browser pane, using standalone terminal-browser in a compatible graphics terminal or cmux on macOS. Preserve the player's narration, choices and Send behavior, and confirm audio, keyboard/mouse and session handoff. Offer it only as an explicit optional integration after a real trial; ordinary browser review remains available when the terminal workspace is absent or unsupported. Do not require a Codex fork or claim that a text-only tmux pane renders the video. cmux and terminal-browser are not installed on this machine; plain tmux is present. Record that platform limitation until the trial can run.

Use the supplied pane branch as an explicit behavior checklist: find videos in the current and ancestor folders; route a video from another repo's library back to its owning repo; play sharp video with synchronized sound and captions; pause, seek, replay, change speed and move between unanswered or answered stops; answer single/multiple choices, ask for clarification, write own words and notes; accept/flag a walkthrough choice; leave timestamped comments; finish with Approve or Changes needed; deliver into the owning session exactly once; show rebuild/walkthrough readiness; and watch only changed scenes with a whole-video toggle. The browser player supplies most of these controls already. Fill the discovery and delivery gaps rather than copying the 1,845-line Claude UI into Codex. Inspect reusable `reel-frames`/review contracts from the branch where needed; importing the whole branch is not part of this plan. A terminal integration is optional for users to install, but its parity evidence is required before we claim that aspect complete.

The plan review shows a proposed layout with Codex on one side and the player on the other: watch, answer, Send, then see the updated video. It is labelled as a proposal. The implementation walkthrough must show that sequence working, including sound, the right project's library and one agent receiving each review. `review <video-dir> --detach` starts the local server and prints the browser address. A portable bundle is a copy of the player files; opening that copy elsewhere does not connect it to the project. The printed address must name the server's actual listening port, including when the first port is occupied; verify the served plan and active-session status before presenting the link. The first review here exposed that wrong-port failure, which was worked around using a free port.

Desktop-app browser and annotation handoff are outside this CLI change (owner clarification below). A future app trial would investigate its existing in-app browser and supported annotation handoff as well as the portable player. A platform annotation is user-mediated, not an automatic prompt-submission API; preserve durable review intake and explicit sending. Feature-detect the capability and keep the ordinary browser path working. The Claude pane itself delegates drawing/guide features to the browser, so Codex should keep the full player available too.

Validate the selected portable route: the transferred file must retain the reviewer's identity, answers and comments when recorded through the existing CLI. Explain how to return a question to the agent when the copy is remote. Test the ordinary local Send separately: it needs no file transfer and must show whether Codex has started, stopped or finished. Remote automatic delivery remains a named follow-up under D-313. The unselected hosted investigation is kept in the original scope question and research; it is not included in this implementation.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Normal local review | Open the server address on this machine and press Send | Save the review and notify the waiting/connected Codex session; no download | you open: local page; answer: questions; send: review; Codex receives: saved review |
| Portable static player | Reviewer opens a packed video | Downloads answers for the existing record command | you open: bundle; answer: questions; download: review; agent records: decisions |
| Terminal workspace | Codex beside a compatible browser pane | Match the supplied native pane's library, playback, comments, choices, Send and rebuild outcomes | you open: pane; watch: player; answer: choice; agent receives: review |
| Claimed Artifact equivalent | Candidate supplies UI only | Mark it as missing durable review handoff | found: UI; checked: storage and intake; you see: limitations |
| First port occupied | Start the local review while another server uses the default port | Print the actual free port and serve the correct plan there | you open: printed address; checked: correct title and session status; Send reaches: this project's inbox |
| CLI-only environment | No inline UI or display | Give bundle location and supported browser path | agent builds: player; you open: browser; answers return: review file |

#### Interface

```text
reelplanner review <video-dir> --detach        # normal local page: Send goes directly to the project
reelplanner bundle-player <out> <video-dir>    # portable copy for a reviewer elsewhere
annotations.json                              # transfer only for a disconnected portable copy
reelplanner reel record <plan-dir> <file>      # local intake of exported answers
research.md                                   # official sources, evidence and hosted limits
optional terminal presentation adapter        # explicit opt-in; available only after runtime trial
ccr-7d2997e8-elkd7p at d09b72d                  # read-only Claude pane feature baseline
```

#### Example

First open the local server address in a scratch project, answer a choice and press Send. Codex must receive it without a downloaded file. Then open a separate portable copy with no server connection, export its answers and record the file through the CLI. Confirm the chosen answer and reviewer identity survive both routes. Start another server on the first port and repeat the local test using the printed free port.

```diagram
compare: Two ways to review
before: local player -> project inbox -> Codex: Send directly
after: portable copy elsewhere -> review file -> Codex: transfer manually
```

### Step 6 — Prove the whole lifecycle and publish honest support claims

**It lets you:** choose Codex with evidence that the complete supported workflow works.

Depends on steps 1–5. Run a small real scratch project with Codex: native plugin install and discovery, new plan, narrated video, fresh script and frame checks, local review submission, revision, implementation, independent code check, walkthrough with one accepted and one flagged choice, fix and final commit. Exercise headless approval and requested changes, a live-session question, failure recovery, a session explainer, and the terminal-pane checklist from the supplied Claude branch. Test the Codex CLI and shared terminal viewer; desktop-app testing is outside this change under the owner clarification below. A CLI result does not establish app support. Save commands, versions, durations and results in `eval/agents/`, without credentials or copied private transcripts. The walkthrough shows real commands and outcomes. A blocked account feature or platform remains explicitly unverified; do not change the support table to fully tested from mocked commands.

Update `docs/agents.md`, README, AGENTS.md, relevant reference docs, and the system spec/map to match what landed. Run `npm test` and full versions of each touched spec, with a fresh independent code check before the walkthrough. Test Claude regressions to protect existing behavior. Public plugin directory submission, real remote deployment and enabling headless automation in this owner's repo are separate explicit actions.

The acceptance environment is the installed Codex CLI 0.162.1 on this macOS machine, using a scratch Git repo and a real supported graphics/browser pane for the terminal workflow. Verify capability checks against this version; document the actual minimum supported version after testing. The CLI must complete its required live handoff. The owner excluded the separate desktop-app handoff from this change. If account policy, sandboxing, signing, session delivery or terminal support blocks a required path, finish unaffected work and report the missing evidence; the support claim and goal remain incomplete until that blocker is resolved. Linux/Windows/cloud claims remain separate and unverified unless independently exercised.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Full scratch run | Installed supported Codex | Complete all advertised lifecycle outcomes | installed: plugin; built: plan; reviewed: choices; built: code; checked: diff; reviewed: walkthrough |
| Real denial | Blocked operation or signing failure | Pending review remains recoverable with log | run: stopped; saved: evidence; corrected: prerequisite; retried: once |
| Automated regression suite | Mocked edge and race cases | Proves contracts, separately from model evidence | run: specs; checked: cases; you see: actual counts |
| Platform unavailable | Cloud or another OS not exercised | Support docs say unverified | inspected: availability; absent: evidence; you see: limit |

#### Interface

```text
eval/agents/<date>-codex-lifecycle.md          # real runtime evidence, commands and versions
npm test                                      # required fast suite
node scripts/test/run.mjs --full <names>        # exhaustive touched specs
reelplanner code-check <plan-dir> --base <ref>  # independent implementation review
reelplanner reel audit <plan-dir>              # walkthrough coverage and answered findings
```

#### Example

The scratch task adds a visible setting to a tiny app. The reviewer changes its default in the plan video, flags one implementation choice in the walkthrough, and sees the corrected app. The repo records both reviews and the final commits. Only after that evidence passes does the support table say the local lifecycle is tested.

```diagram
flow: Proof before support claim
native install -> plan video: build
plan video -> review -> implementation: decide
implementation -> independent code check -> walkthrough: verify
walkthrough -> flagged choice fix -> evidence: finish
evidence -> support table: state what passed
```

## Components touched

- **The plan-to-video skill** — native plugin packaging and harness reference.
- **The headless run** — supported Codex command and accurate commit instructions.
- **The review server** — durable live-session delivery and fallbacks.
- **The reel CLI** — installation diagnostics, session connection and headless configuration.
- **The explainer** — Codex session source discovery.
- **The implement step** — real lifecycle evidence and independent validation.

## Open questions for the reviewer

**Q1 is answered: A, recorded as D-313.** The options below preserve the scope choice you reviewed. This revision clarifies that A includes direct local Send; its download requirement applies only to a disconnected remote copy. The question is not reopened.

1. **How far should remote hosted reviews go in this change?** (step 5)
   - **A · Complete the local Codex workflow and validate portable remote exports.** Example: a remote reviewer downloads `annotations.json`; Codex records it locally. Native plugins and the full local loop land together; remote automatic submission and answering remain a clearly named follow-up.
   - **B · Prove an authenticated hosted review bridge now, then review its service plan.** Example: a remote reviewer presses Send on scratch content and a Codex run receives it without a downloaded file. Budget two working days for the initial investigation; it needs a host, durable storage, reviewer authentication and repo transport. No paid hosting or public deployment is authorized by this option; those get a separate concrete approval. A ChatGPT-only UI is not assumed to work in Codex CLI. The service implementation gets its own review after the spike's evidence.
   Recommendation: **A** for the first implementation. Plugin and local lifecycle gaps are concrete and immediately testable; the research has not established a drop-in Artifact runtime. Choose B if automatic remote handoff is part of the first acceptance bar.

## Decisions in force

- **D-082** Automatic review inside a sandbox: apply the same policy intent using Codex's supported mode; do not broadly grant Git writes or commit blindly from the server (steps 2, 3).
- **D-249**, **D-250** Explainers pin their sources without committing external transcript text, and follow general story principles (step 4).
- **D-225**, **D-227**, **D-245** Fresh findings are answered before showing, with fresh eyes on new videos and only new kept findings on the page (step 6).
- **D-230**, **D-244** The guide stays built from the plan and walkthrough's text (all steps).
- **D-303** Installation changes are shown through real commands that work (steps 1, 6).
- **D-313** Complete the local workflow and validate portable remote exports; automatic remote delivery is outside this change (step 5).
- **D-106**, **D-107**, **D-109**, **D-110**, **D-306** Memory and decision rules remain binding; stop before a fifth off-plan choice in a step, and log implementation choices as they occur (all steps).
- **D-023**, **D-024**, **D-085**, **D-129**, **D-168**, **D-169**, **D-170**, **D-171**, **D-195**, **D-197**, **D-198**, **D-199**, **D-200**, **D-201**, **D-213**, **D-215**, **D-216**, **D-217**, **D-218**, **D-219**, **D-220**, **D-221**, **D-222**, **D-223**, **D-247**, **D-248**, **D-304**, **D-305**, **D-309**, **D-310**, **D-311**, **D-312** retain the existing authoring, review, contributions and naming behavior; this plan changes agent integration, not those rules (all steps).

## Acceptance bar

Every promised local operation has a passing real Codex example; race and failure cases have appropriate specs; Claude remains working. The research names the hosted and extension equivalents with precise supported surfaces. The chosen remote option is delivered and its remaining limitations are prominent. No model-free parser check or UI mockup is described as an end-to-end proof.

## Owner scope clarification — 2026-10-11

The owner confirmed this conversation is Codex CLI in iTerm2 and said: "I only want CLI support in this change". This narrows the earlier app-specific requirements in steps 3, 5 and 6: acceptance requires the Codex CLI lifecycle and shared terminal viewer, without a desktop-app handoff. Desktop-app support remains unverified and outside this change. D-313's local plus portable-copy choice is unchanged. All other checks, narrated lifecycle proofs and walkthrough review remain required.

## Implementation validation clarifications — 2026-10-11

These clarify evidence and recovery without reopening the approved choices.

- **Step 1, executable and media setup:** the plugin installs the skill, while the executable and media tools use the README's separate install/setup commands. The actual isolated packed-plugin install enabled version 0.2.0. On this machine, a real setup dry run with Node 22.20 on PATH found ffmpeg, headless Chrome, Kokoro, whisper.cpp and pinned HyperFrames 0.8.52 available. This checks prerequisites; it does not claim a fresh-machine installation or a model-driven lifecycle by itself.
- **Step 2, stopped signing and generated media:** a signing failure leaves edits and saved progress pending. The page and inbox expose the run log; inspect that failure and restore the required signing/approval prerequisite before deliberate retry. The synthetic trial injected a broken signing prerequisite, restored its original scratch configuration and recovered without duplicate intake. The agent never disables the owner's signing policy. Commit video source and narration metadata; generated voice files, renders and player bundles stay ignored. A real trial exposed conflicting skill wording, which has been corrected.
- **Step 3, ownership expiry:** renew while working, at least every two minutes within the five-minute lease. Failure to renew or loss of ownership stops further mutation/completion rather than allowing a second handler to race it. A live headless PID stays protected; expired session ownership can be atomically recovered with its original baseline/progress, including already checked or committed work.
- **Step 3, live receipt:** the tested current CLI recipient deliberately polled, claimed and answered a saved question; automatic wake is not established. Keep a review waiter running and check the inbox at turn boundaries. Exact-endpoint queue acknowledgement means waiting until the real session takes responsibility and acts; durable fallback keeps the review/question available when notification is absent.
- **Step 4, export bounds:** exceeding 64 MiB, 1,000 history batches or 30 seconds fails explicitly rather than writing a partial export. If supported read-only export cannot recover the exact conversation, ask the owner for that conversation's external copy. Verify session ID and canonical project before pinning its path/hash/count; unrelated or unlabelled copies are refused. An explainer's source-scope review is resolved in its actual explain.md document, with unchanged/missing-source checks retained.
- **Step 5, terminals and harnesses:** terminal-browser opens the shared player independently of the agent harness. It supports whichever terminals/panes terminal-browser itself supports; live notification and unattended execution separately depend on the harness integration. Codex CLI is being used in iTerm2, and the actual Ghostty 1.3.1 viewer trial uses terminal-browser 0.13.4. Separate repos must use separate bundles as well as inboxes; the corrected default output uses their canonical repo keys, preserving explicit output and same-repo reuse.
- **Step 6, concrete lifecycle evidence:** the scratch task must show its genuinely narrated plan, actual choice/comment/Ask/Send, recorded revision, implemented app, independent code check, actual Accept/Flag, requested fix, rebuilt changed scenes, matching checked commit and final review. Two real headless requested-change narration runs now have saved build/commit/server proofs. Their initial generated-file mistake and subsequent checked-tree rejection/reconciliation remain explicit. The live scratch walkthrough flag/fix/final-approval cycle completed; `eval/agents/codex-2026-10-11/lifecycle-final.json` contains the public-safe actual review/commit/duration evidence. Its synthetic approval is separate from owner acceptance of this branch.
- **Step 6, capability boundary:** the required CLI loop comprises native skill installation, planning/narration, direct local review/decisions, implementation/code check, walkthrough/fix, live questions, recoverable headless follow-up and exact private session explainers. The terminal viewer and disconnected portable review are shared across harnesses. Desktop-app support is outside this change at the owner's request. An authenticated hosted Codex bridge, other OSes and cloud execution remain unverified; D-313 selected local support plus a portable copy, not those services.


## Frame-review validation clarifications — 2026-10-11

These clarify the existing approved contracts using completed trial evidence; they add no new reviewer choice.

- **N11, signing recovery:** inspect the retained log and existing edits/commits, restore the failed signing or permission prerequisite, then deliberately retry. Preserve the configured signing and approval policies; never disable either to finish. The real scratch signing-failure/retry proof retains the original work and avoids repeated intake or edits.
- **N14, ownership loss:** renew at least every two minutes within the five-minute session lease. If ownership is lost, stop mutation and inspect the new claim before continuing. Expired adoption retains the original baseline and progress, and never overrides a live headless process. Question answers lock and verify the current owner before saving or removing a claim.
- **N18, bounded export fallback:** exceeding the export bounds fails without a partial output file. The fallback is an external owner-provided copy of the exact conversation, verified against its session ID and canonical project; it is not an arbitrary transcript or a different checker thread.
- **N23/G2, the actual trial app:** the synthetic Reading app has Normal (20px) and Large (24px) story text, resetting to the reviewed starting choice on reload and Back. The actual walkthrough flag removed its outlined setting panel while keeping the native selector and label. The fix/rebuild commit is `b068bb4`; final actual changed-scenes approval was recorded separately in `7d01269`. These are synthetic acceptance inputs, separate from this branch’s owner review. CLI trial evidence is eval/agents/codex-2026-10-11/lifecycle-final.json.
