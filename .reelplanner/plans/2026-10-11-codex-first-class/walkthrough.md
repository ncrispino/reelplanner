# Codex as a first-class reelplanner agent — implementation

**In one sentence:** install reelplanner in Codex, review plans beside your agent, and keep reviews available until the work is checked and committed.

**Started from:** `652894a6ddb8cf7303bd0cf709afa27f27b6b399` (plan approval recorded).

**Commits:** `0d051e7` — native integration and terminal review; `0fef69b` — checked-work completion, expired-handler recovery and portable identity. Final lifecycle validation and acceptance are pending.

The approved scope is local support plus portable remote copies (D-313). Focused runtime trials and the fast suite have passed; complete Codex CLI/app lifecycle proof and final walkthrough review remain open. This is implementation text for the Built side, not a declaration of acceptance.

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

| A10 | 4 | Bound a history export to 64 MiB, 1,000 pages and 30 seconds, with an external-copy fallback [close] | Reading an unbounded conversation through the running service | History can contain large tool output. The limits bound memory, pagination and service waits; an oversized or unavailable history fails explicitly and can use a verified owner copy outside Git. The independent code check identified that these existing implementation limits needed to be recorded. | `scripts/lib/codex-session.mjs`; `scripts/test/session-export.spec.mjs`; `explain --session-source` verifies the exact session and project. |
| A11 | 5 | Preserve a provided viewer in downloaded reviews, with the same bounded 1.5-second identity wait as hosted Send [visible] | Keeping a known identity only on hosted submissions | The portable path must retain the provided reviewer together with answers and comments. A delayed identity may resolve before download, while an absent or hanging capability still permits export with the existing Git fallback at intake. No new anonymous identity is invented. | `packages/player/reelplanner-player.js`; `packages/player/test/handoff.spec.mjs`; disconnected download/intake trial. |

## Implementation by step

### Step 1 — Install through Codex's own plugin system

**You can now:** install the same plan-to-video skill through Codex's native plugin system and check the tools it needs.

**Commits:** `0d051e7`.

`plugin.json` supplies the portable identity; `.agents/plugins/marketplace.json` points Codex at the package root. `package.json` ships both, and `scripts/release/sync-version.mjs` updates their version with the package. The existing Claude package stays intact. `scripts/lib/agents.mjs` supplies ordinary Claude, Codex and custom-command adapters; shared inbox code keeps ownership, recovery and completion. `scripts/lib/setup-check.mjs` reports CLI features separately from model proof. The bounded dependency lookup in `scripts/lib/env.mjs` reports `npm ci` for missing checkout dependencies instead of recursing between absent packages. `skills/plan-to-video/references/harnesses.md` documents invocation and permissions.

**Tests:** the saved fast suite passed `codex-install` (5 checks), `harnesses` (11), `package` (9), `version` (10) and `init` (46). The current docs report a real isolated plugin install; its raw command transcript is not in this plan's saved runs. A1 retains the preparation fix recorded in `preparation.md`, before the approved start commit.

```diagram
flow: Install the skill
marketplace entry -> packaged root: discover
packaged root -> plan-to-video skill: install
skill -> setup diagnostics: check tools
setup diagnostics -> workflow: capabilities only | Actual model runs have separate evidence.
```

#### Worked examples

##### Missing checkout dependencies

- **Input:** `npm test`; `scripts/test/codex-install.spec.mjs` makes a scratch checkout without `node_modules` and runs its real setup dry-run.
- **What happens:** the spec requires exit 1, each missing package and `npm ci`; it checks that setup installs nothing and never reaches media setup. A second case requires the missing HyperFrames path without a recursion error.
- **Output:** `runs/npm-test-audio.txt`, the saved passing spec result, rather than the underlying setup stdout.
- **Edge cases:** an older simulated Codex CLI keeps the inbox fallback; a dependency nested under HyperFrames remains discoverable.
- **Predict:** does a green dependency check prove a plan video was built? No; diagnostics explicitly separate those claims.

#### Why it works this way

The plugin installs the skill; the executable and media dependencies remain a separate setup. Agent adapters translate launches, notification and conversation access without duplicating the player or workflow.

#### What else was considered

A separate Codex review implementation and mandatory trusted hooks were excluded by the approved plan. The plugin needs neither.

#### What breaks it

Missing CLI or package dependencies prevent the corresponding operation. Older CLIs may lack plugins, queue or automatic review.

#### Limits

CLI 0.162.1 is the tested target; a lower minimum is not established. Native install proof needs its exact saved command output for the final video. No public directory submission occurred.

#### Files and commands

`plugin.json`, `.agents/plugins/marketplace.json`, `scripts/lib/agents.mjs`, `scripts/lib/setup-check.mjs`, `scripts/lib/env.mjs`, `scripts/setup.sh`; `codex plugin marketplace add <package-or-checkout>`, `codex plugin add reelplanner@reelplanner`, `node bin/reelplanner.mjs setup --dry-run`.

**Not done:** installation-to-model lifecycle proof and its real install scene remain open.

### Step 2 — Finish headless reviews with Codex's permission model

**You can now:** retain a stopped review's edits and recover it through a guarded retry after its commit prerequisite is restored.

**Commits:** `0d051e7`.

The Codex adapter in `scripts/lib/agents.mjs` builds the tested automatic-review command and gives Codex-specific Git advice. It clears stale parent-agent identity. `scripts/lib/inbox.mjs` saves the original Git baseline and progress, checks ownership before retry, and freezes the checked review tree before commit. Completion requires that exact committed tree and preserves original staged, unstaged and untracked owner work. `scripts/inbox.mjs` exposes retry, renewal and progress. The shared server and player show stopped work and its log. A zero process exit or unrelated descendant commit is insufficient to mark a review done. Private owner patch evidence is ignored and mode 0600; the temporary check index leaves the real index unchanged. A4 records the persistent recovery shape.

**Tests:** saved fast-suite results cover `delivery` (9), `review-status` (46), `harnesses` (11), `init` (46) and `loop` (96). `runs/headless-real.txt` and `eval/agents/codex-2026-10-11/headless-summary.json` record three real Codex processes: an approval/commit, a scratch signing failure, and recovery. They took 81, 84 and 80 seconds.

```diagram
flow: Finish only after commit
saved review -> headless Codex: launch
headless Codex -> edits and checks: apply
edits and checks -> signed commit: request under policy
signed commit -> inbox done: finish
edits and checks --> stopped review: commit failed | Keep the edits, log and original baseline.
stopped review -> guarded retry: prerequisite restored
```

#### Interface as built

```text
reel init <repo> --agent codex            # explicit unattended opt-in
codex exec --approve-for-me -c 'sandbox_mode="workspace-write"' -c sandbox_workspace_write.network_access=true --color never
                                         # CLI 0.162.1 launch; approval and signing still apply
reelplanner inbox retry <id>              # reject live owner; retain original recovery state
reelplanner inbox renew <id>              # renew the current owner's lease
reelplanner inbox progress <id> <phase>   # handling|intake|editing|checked|committed
reelplanner inbox done <id>               # require eligible completion evidence
```

#### Worked examples

##### Signing fails after the edits

- **Input:** `node /private/tmp/reelplanner-codex-headless-proof/run.mjs`, a synthetic scratch Git repo with real configured Codex; second approval `video-20261011T230200Z` injects a local signing failure.
- **What happens:** the worker reaches checked, exits zero, and leaves the review unfinished. After restoring the fixture's original signing configuration, retry creates recovery commit `636f198`; the original approval commit is `cab1061`. There are two unique intake records and one edit per comment.
- **Output:** `runs/headless-real.txt` (lines 11-27); structured runtime details are in `eval/agents/codex-2026-10-11/headless-summary.json`.
- **Edge cases:** a live owner blocks retry; existing unrelated staged/unstaged owner changes are preserved by the contract specs; committed-but-unfinished work must be reconciled before repeating edits.
- **Predict:** if Codex exits zero after signing fails, is the video ready? The saved run shows `done=false`.

#### Why it works this way

Completion belongs to the shared workflow and requires actual progress plus commit evidence. The server cannot commit on the worker's behalf.

#### What else was considered

Treating changed HEAD as enough evidence or recreating the baseline at retry would hide unrelated commits and prior edits; A4 keeps the original baseline.

#### What breaks it

Denied escalation, unavailable signing, malformed Git configuration, a live lease or residual tracked review edits can prevent completion.

#### Limits

The real trial was a wording-only approval fixture. It exercised no server/player, narration, rebuild or implementation. Its pre-existing missing Cases/Interface caused `reel check` failures; those were transparently reported and do not count as passed plan validation.

#### Files and commands

`scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`, `scripts/review.mjs`, `packages/player/reelplanner-player.js`; `reel init --agent codex`, `inbox progress`, `inbox retry`, `inbox done`.

**Not done:** a real requested-changes headless video rebuild and the complete lifecycle remain open.

### Step 3 — Deliver reviews to a live Codex session

**You can now:** explicitly connect a verified running Codex thread while preserving unanswered questions and reviews when notification fails.

**Commits:** `0d051e7`.

`review --session` verifies exact thread, canonical repo and running endpoint through the Codex adapter. `scripts/lib/codex-session.mjs` uses read-only endpoint verification; queue delivery targets that endpoint. `scripts/lib/inbox.mjs` owns the durable connection, claims and five-minute renewable lease, and prioritizes waiter, connected session, configured headless run, then inbox. Questions are saved first and never start headless workers. Player and guide question polling survive the old two-minute cutoff and reloads. A2, A3 and A7 capture the integration choices.

**Tests:** the saved fast suite passed `delivery` (9), `session-export` (35), `review-status` (46), player `ask` (21), `guide-notes` (51) and `access` (91). `eval/agents/codex-2026-10-11/queue-active-summary.json` records a real owned loopback App Server turn that started, completed and wrote its proof. It proves acting on a queued message; it does not prove Send/Ask from the shared player reached a CLI or app session.

```diagram
flow: Durable live handoff
Send or Ask -> saved inbox item: persist
saved inbox item -> waiting session: first priority
saved inbox item --> verified connected endpoint: queue
verified connected endpoint -> owner adoption: claim and renew
failed queue --> configured headless: review only
failed queue --> unanswered question: retain
owner adoption -> answer or checked commit: complete under shared rules
```

#### Interface as built

```text
reelplanner review <video-dir> --detach --session codex:<id>
                                         # connect exact verified thread in this repo
--session-endpoint ws://127.0.0.1:<port>   # select running App Server when discovery cannot reach it
reelplanner inbox --wait --timeout 1      # adopt queued/oldest pending work
reelplanner inbox answer <id> "<answer>" --from "<source>"
                                         # save evidence-based answer; player polls its status
```

#### Worked examples

##### Notification fails before the answer

- **Input:** `npm test`; `scripts/test/delivery.spec.mjs` writes scratch question `ask-pending` and uses its fake harness to return a stale-session error.
- **What happens:** no headless job starts, the unanswered question stays pending, repeated ID is deduplicated, the next waiter adopts it, and an expired lease permits guarded recovery. A separate queue-failure-after-adoption case preserves the existing handler.
- **Output:** `runs/npm-test-audio.txt`, the saved passing contract result.
- **Edge cases:** wrong repo/thread, unloaded thread, checker thread and failed transport cannot claim a live recipient; a live headless PID defeats expiry.
- **Predict:** does a successful queue acknowledgement mean the review is finished? No; adoption and eventual answer or commit remain separate phases.

#### Why it works this way

A real queue to a closed thread returned success without acting. A7 requires a reachable endpoint and loaded main thread; the shared claim protects against a second handler.

#### What else was considered

An in-memory connection and waiter-PID ownership were rejected in A2/A3 because a restart or exited waiter does not establish that the real worker is gone.

#### What breaks it

An unreachable endpoint, stale identity or unavailable queue leaves durable work pending. Ownership must be renewed during long work.

#### Limits

The real owned App Server result is focused transport proof. Required live CLI and Codex app Send, Ask, answer display and state changes remain unverified.

#### Files and commands

`scripts/review.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/codex-session.mjs`, `scripts/lib/inbox.mjs`, `packages/player/reelplanner-player.js`, `packages/player/guide-review.js`; `review --session`, `inbox --wait`, `inbox renew`, `inbox answer`.

**Progress:** the real scratch Ghostty Ask reached the Codex worker, its sourced answer appeared in the player, and a synthetic Large-choice approval reached the waiting scratch inbox as `video-20261011T212129Z`. The worker verified the saved choice and note, recorded its scratch-only decision, revised the plan and committed it after freezing checked work. The current Codex CLI session in iTerm2 also verified its exact loaded thread, adopted the API-queued synthetic question through the inbox, answered it from the documentation, and confirmed GET /api/ask returned the answer/source. Automatic wake is unproved because the recipient deliberately polled. The daemon source field says vscode despite the owner-confirmed CLI client, so it is not used as a UI classification.

**Not done:** complete client lifecycle/notification evidence and final walkthrough handling.

### Step 4 — Explain the correct Codex session

**You can now:** select Codex's verified conversation and export its visible history to a private file outside Git.

**Commits:** `0d051e7`.

`scripts/lib/explainer.mjs` delegates `this-session` to the detected harness. `scripts/lib/codex-session.mjs` prefers the requested active identity, verifies canonical project metadata and excludes checker threads from automatic main-thread selection. Legacy JSONL remains readable; current history uses documented read-only App Server RPC with full ascending turn pagination. `scripts/session.mjs` prints only the external export path. `scripts/explain.mjs --session-source` checks an owner-provided copy of the exact requested conversation. External pins keep path, hash and line count rather than transcript text. A5 and A8 record the source and transport choices.

**Tests:** the saved fast suite passed `session-export` (35) and `explainer` (64). Docs describe real paginated scratch export; the checkpoint's committed evidence folder does not contain that trial's raw command/output.

```diagram
flow: Select private conversation
active or selected ID -> exact repo verification: choose
verified ID -> usable legacy JSONL: read
verified ID --> read-only App Server: full history
full history -> external JSONL: export
external JSONL -> sources.json: path hash and lines | Private transcript text stays outside Git.
unavailable source --> owner copy: verify same identity
```

#### Worked examples

##### History crosses a page boundary

- **Input:** `npm test`; `scripts/test/session-export.spec.mjs` exports mock current-history thread `db-thread` from its scratch repo and pins `this-session`.
- **What happens:** the case requires full ascending pages, identity-first JSONL, read-only method calls and an outside-source pin without visible transcript text. Repeated cursor, page failure and summary-only history must leave no partial export.
- **Output:** `runs/npm-test-audio.txt`, the saved passing contract results.
- **Edge cases:** wrong repo/ID, unrelated newer checker, a symlink into the repo, existing output and unreadable metadata are refused rather than selecting another conversation.
- **Predict:** may a newer checker conversation replace the active main thread? Identity and main-thread checks prevent that selection.

#### Why it works this way

The requested conversation must remain the source even when history storage changes. Pinning outside metadata preserves D-249 without requiring SQLite schema access or resuming a thread.

#### What else was considered

An arbitrary transcript path or unlabelled export was rejected in A5. A8 declares `ws` directly for Unix WebSocket transport instead of writing framing or depending on a transitive package.

#### What breaks it

Missing identity/project metadata, incomplete pagination, unavailable RPC or inaccessible owner copy stops the export with a useful fallback.

#### Limits

History reads are bounded to 64 MiB, 1,000 pages and a 30-second RPC timeout. A supported source export is not a narrated session explainer proof.

#### Files and commands

`scripts/lib/codex-session.mjs`, `scripts/lib/explainer.mjs`, `scripts/explain.mjs`, `scripts/session.mjs`, `package.json`; `node bin/reelplanner.mjs session export codex:<id> --out <external.jsonl>`, `explain "What happened in this session?" this-session --session-source <external.jsonl>`.

**Not done:** saved real export command evidence and a real Codex session explainer build/review.

### Step 5 — Match terminal review and the selected remote path

**You can now:** open the shared player beside the terminal session and seek its narration correctly after rewind, pause and resume.

**Commits:** `0d051e7`.

`scripts/lib/presentation.mjs` opens the existing URL through browser, terminal-browser or cmux; it owns no review storage. `scripts/review.mjs` prints the actual chosen port. `scripts/lib/review-projects.mjs` discovers current/ancestor videos with their owner and rejects mixed-owner pages; `scripts/lib/env.mjs` recognizes nested Git repositories. `docs/terminal-review.md` covers the shared terminal setup chosen by the owner. `scripts/lib/http-file.mjs` supplies Content-Length and single byte ranges to both review and preview servers. A6/A9 retain ownership and range behavior.

**Tests:** saved fast-suite results cover `presentation` (14), `review-projects` (3), `media-seek` (27), `static-server` (7), `controls` (39), `sound` (10) and `review-status` (46). The live Ghostty 1.3.1 / terminal-browser 0.13.4 trial is summarized in `eval/agents/codex-2026-10-11/ghostty-trial.json`; the owner confirmed, “Audio sounds normal now.” The trial used scratch copies of the upload-resume reference videos, not this plan's walkthrough.

```diagram
flow: One player across presentations
review server -> actual free port: serve owning repo
player URL -> browser or terminal pane: open
player -> ranged media response: seek
local Send -> project inbox: direct
portable copy elsewhere -> exported file: manual return
exported file -> reel record: existing intake
```

#### Worked examples

##### Rewind narration in the Ghostty pane

- **Input:** the saved terminal-browser eval on browser `50952-1`, tab `1`, reads the live player and narration element `#el-07-branch-1b-voice` after the response fix.
- **What happens:** the narration reports seekable `[0, 5.76]`, audio position 4.438066 and video position 68.96666666666667. The trial summary records the prior `[0, 0]` failure and owner listening check. The media spec separately rewinds five seconds across clips, requires one playing voice, and checks pause/resume synchronization.
- **Output:** `runs/ghostty-audio-position.txt` (lines 1-3); regression results are in `runs/npm-test-audio.txt`.
- **Edge cases:** suffix/open-ended ranges work; unsatisfiable ranges return 416; malformed/multipart ranges get the full representation; HEAD has exact length and no body.
- **Before:** fully buffered narration was unseekable because the server sent chunked audio without length/range support; this observation is retained in the trial summary, not as a saved before-eval run.
- **After:** the saved live eval shows the clip's full seekable duration; owner confirmed normal playback.

#### Why it works this way

Opening the same player preserves choices, comments, guide and Send behavior across presentations. Range handling belongs in one shared response helper rather than each server.

#### What else was considered

A terminal-name allowlist would lag terminal-browser's supported terminals; detection is delegated to that CLI. A6 refuses mixed ownership; A9 avoids a multipart encoder for ordinary single-range media seeking.

#### What breaks it

Missing pane support or launcher falls back to the browser. Routing different repo videos into one inbox would corrupt review ownership and is refused.

#### Limits

A launcher success does not prove review parity. Local Send is direct; D-313's disconnected remote copy still needs manual export. Hosted automatic submission/answering remains outside scope.

#### Files and commands

`scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/lib/http-file.mjs`, `scripts/lib/static-server.mjs`, `scripts/review.mjs`, `docs/terminal-review.md`; `review <video-dir> --detach --workspace terminal-browser`, `bundle-player <out> <video-dir>`, `reel record <plan-dir> <returned-file>`.

**Progress:** actual Ghostty controls selected Large with a synthetic accessibility note; Ask displayed a sourced reply; Finish and Send produced a visible receipt and saved scratch inbox ID. Source and notes are in `runs/terminal-lifecycle.txt`.

**Portable trial:** the actual disconnected bundle downloaded a review and checkout `reel record` preserved its answers and comments. Explicit host-capability fixtures proved provided owner/non-owner identity survives; a genuine unauthenticated browser retained the Git fallback. These tests prove preservation, not authentication or a hosted bridge. Full handoff passed 60 checks. Runs: `runs/portable-review.txt`.

**Occupied port:** the real scratch CLI requested 8964, skipped the running servers on 8964/8965, reported 8966, and that URL returned its intended library. Only the newly created scratch server was stopped. Runs: `runs/occupied-port.txt`.

**Not done:** walkthrough judgments and changed-scenes.

### Step 6 — Prove the whole lifecycle and state support accurately

**You can now:** distinguish working focused Codex trials from the lifecycle and app behavior still awaiting proof.

**Commits:** `0d051e7`.

README, AGENTS.md, `docs/agents.md`, `docs/reference.md`, the skill and harness reference describe the native plugin, direct local inbox, explicit automation and recovery without claiming full parity. `eval/agents/codex-2026-10-11/` keeps credential-free structured headless, queue and terminal evidence. The checkpoint fast run passed all 59 specs in 219.8 seconds. After the recovery/export fixes, another supported-Node fast run passed all 59 in 222.8 seconds, including the unchanged-fixture guard; its complete captured command/output/exit is `runs/npm-test-post-review.txt`. A10 records the existing bounded-export choice identified by the independent code check.

**Tests:** `runs/npm-test-audio.txt` is the whole saved fast stdout. `ghostty-trial.json` additionally reports completed full presentation (14), review-projects (3), harnesses (11), review-status (46), memory (81), sound (10), media-seek (27), static-server (7) and controls (39) runs; those full command transcripts are not in this plan's runs folder. The corrected full touched-spec run passed all 21 in 47.9 seconds, including actual native plugin installation, downloaded reviews, queued delivery, recovery, player controls and source export. Its complete captured command/output/exit is `runs/full-touched.txt`; full handoff also passed 60 checks in `runs/full-handoff.txt`. Fresh final code-check completion is a separate gate.

```diagram
flow: Evidence before parity
checkpoint -> focused runtime trials: record
checkpoint -> fast and touched full specs: validate
implementation -> fresh independent code check: answer findings
scratch lifecycle -> CLI and app handoffs: demonstrate
walkthrough -> owner review and flagged fix: finish
passing evidence -> support table and system map: update
```

#### Worked examples

##### Check the checkpoint's regression result

- **Input:** `npm test`, using the supported task-local Node 22.20.0 noted in the trial record.
- **What happens:** 59 specs run four at a time, including shared Claude regression paths and the new Codex, ownership, session and seek contracts. The owner-record fixture guard passed according to the checkpoint record.
- **Output:** `runs/npm-test-audio.txt`, the complete saved stdout and final result.
- **Edge cases:** a fast run deliberately skips the real native plugin-install branch; model-backed acceptance is separate. A green mock transport case is not an app trial.
- **Predict:** can the support table say fully tested after these 59 specs? The plan requires a real narrated scratch lifecycle plus both live client handoffs and walkthrough fixes.

#### Why it works this way

Focused runtime proof and regression contracts answer different questions. Keeping their scope explicit prevents a parser/mock success from becoming a support claim.

#### What else was considered

The approved plan excludes public plugin submission, real hosted deployment and implicitly enabling unattended work in this owner's repo.

#### What breaks it

An unresolved code-check finding, missing runtime prerequisite or incomplete required live handoff prevents final acceptance even if unrelated tests pass.

#### Limits

Codex app, complete local lifecycle, Linux, Windows, WSL and cloud remain unverified. The existing full-suite summaries are evidence summaries, not new quoted command output.

#### Files and commands

`docs/agents.md`, `README.md`, `AGENTS.md`, `docs/reference.md`, `skills/plan-to-video/SKILL.md`, `eval/agents/codex-2026-10-11/`; `npm test`, `node scripts/test/run.mjs --full <name>`, `code-check <plan-dir> --base 652894a6ddb8cf7303bd0cf709afa27f27b6b399`, `reel audit <plan-dir>`.

**Progress:** the actual scratch plan is narrated, built, independently reviewed, approved through Ghostty, recorded and revised. The system spec, component file map and glossary now describe the implemented shared behavior.

**Not done:** finish the scratch implementation, code check, accepted/flagged walkthrough and final fix; app proof, final owner walkthrough review and post-acceptance system video refresh.

## Categories of change

- **Native installation and diagnostics** {codex-install} (`plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `package-lock.json`, `scripts/release/sync-version.mjs`, `scripts/lib/setup-check.mjs`, `scripts/lib/env.mjs`, `scripts/setup.sh`, `scripts/test/codex-install.spec.mjs`, `scripts/test/package.spec.mjs`, `scripts/test/version.spec.mjs`) (step 1): package the skill for Codex and diagnose missing prerequisites without implying a model lifecycle passed.
  Runs: `runs/npm-test-audio.txt`.
- **Agent adapter and guarded recovery** {codex-recovery} (`scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`, `scripts/test/harnesses.spec.mjs`, `scripts/test/init.spec.mjs`, `scripts/test/loop.spec.mjs`, `scripts/test/delivery.spec.mjs`) (step 2): select harness-specific launch and commit advice while shared code retains original work and requires commit evidence.
  Runs: `runs/headless-real.txt`, `runs/npm-test-audio.txt`.
- **Durable live delivery and questions** {codex-delivery} (`scripts/review.mjs`, `scripts/lib/codex-session.mjs`, `scripts/lib/inbox.mjs`, `packages/player/reelplanner-player.js`, `packages/player/guide-review.js`, `packages/player/test/ask.spec.mjs`, `packages/player/test/guide-notes.spec.mjs`, `packages/player/test/working.spec.mjs`, `scripts/test/review-status.spec.mjs`, `scripts/test/delivery.spec.mjs`) (step 3): bind explicit connections to live endpoints, preserve lease ownership and retain questions until answered.
  Runs: `runs/npm-test-audio.txt`.
- **Private session sources** {codex-session} (`scripts/session.mjs`, `scripts/explain.mjs`, `scripts/lib/explainer.mjs`, `scripts/lib/codex-session.mjs`, `scripts/test/session-export.spec.mjs`, `scripts/test/explainer.spec.mjs`) (step 4): select the right main conversation and export complete read-only history outside Git.
  Runs: `runs/npm-test-audio.txt`.
- **Shared terminal player and seekable media** {terminal-review} (`scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/lib/env.mjs`, `scripts/lib/http-file.mjs`, `scripts/lib/static-server.mjs`, `scripts/review.mjs`, `scripts/test/presentation.spec.mjs`, `scripts/test/review-projects.spec.mjs`, `scripts/test/media-seek.spec.mjs`, `docs/terminal-review.md`) (step 5): present one owning repo's player through a compatible pane and fix narration seeking in both local servers.
  Runs: `runs/ghostty-audio-position.txt`, `runs/npm-test-audio.txt`.
- **Support documentation and evidence** {codex-evidence} (`README.md`, `AGENTS.md`, `docs/agents.md`, `docs/reference.md`, `skills/plan-to-video/SKILL.md`, `skills/plan-to-video/references/harnesses.md`, `scripts/test/memory.spec.mjs`, `scripts/test/run.mjs`, `eval/agents/codex-2026-10-11/`) (step 6): distinguish focused proofs from pending lifecycle/client work; isolate memory scratch fixtures from the owner's pending-summary file.
  Runs: `runs/headless-real.txt`, `runs/ghostty-audio-position.txt`, `runs/npm-test-audio.txt`.

## Decisions in force

All 47 IDs cited in the approved plan remain accounted for below. “Unchanged” identifies the retained rule/source; it is not a claim that this plan reran its historical experiment or completed a future video. Source: `.reelplanner/decisions.json`, including the later notes that narrow older choices.

| ID | Rule kept or remaining obligation | Where to check |
|---|---|---|
| D-023 | Show relevant real behavior and useful depth; no mandatory full-code display. Final video pending. | This walkthrough's examples; `skills/plan-to-video/SKILL.md`, `skills/plan-to-video/references/style-guide.md`. |
| D-024 | Existing detail types first; no second Codex detail engine. | `scripts/lib/guide/model.mjs`, `templates/guide/`; unchanged. |
| D-082 | Automatic review inside workspace-write; approval/signing failure stays unfinished. | `scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `runs/headless-real.txt` (step 2). |
| D-085 | Keep one build path and the saved review plus concise action record. | `scripts/build.mjs`, `scripts/reel-intake.mjs`, `scripts/reel.mjs`; shared workflow unchanged. |
| D-106 | Agent-neutral personal memory file; D-312 supplies current name. | `scripts/lib/memory.mjs` (`youPath`), `scripts/lib/old-names.mjs`; unchanged. |
| D-107 | Retro suggested after five plans or three repeated signals. | `scripts/lib/memory.mjs` (`RETRO_PLANS=5`, `RETRO_REPEAT=3`); unchanged. |
| D-109 | An untagged miss stops no call directly. | `scripts/lib/autonomy.mjs` (`missFor`); unchanged. |
| D-110 | Stop before a step's fifth call and ask its biggest open choice. A1–A11 have at most three per step. | Autonomy table; `scripts/lib/autonomy.mjs` (`STEP_CALLS=5`), skill implementation step 1. |
| D-129 | Wrong quick checks do not block Approve; results remain recorded. | `packages/player/reelplanner-player.js`, `scripts/lib/memory.mjs`; unchanged. |
| D-168 | Historical comparison arms run through finished sites and fixes; no new three-arm experiment claimed here. | `scripts/case-study.mjs` (`STAGES`, `ARMS`); unchanged. |
| D-169 | Owner reviews the reelplanner arm first, one day between comparison arms; not a Codex trial ordering rule. | `eval/case-studies/REPLICATE.md`, historical case-study plan; unchanged. |
| D-170 | Comparison uses rubric, blind judge and owner's prior ranking, plus process observations. No new ranking claimed. | `scripts/case-study.mjs`, `eval/case-studies/TEMPLATE.md`; unchanged. |
| D-171 | Sequential decision IDs and rebase/renumber at merges; no hand edits to owner ledger. | `scripts/reel.mjs` (`renumber`), skill “Several people”; unchanged. |
| D-195 | Detail opens over the frame from the clicked block. Same player in panes. | `packages/player/reelplanner-player.js`; unchanged presentation contract (step 5). |
| D-197 | Quick checks come later on a new case. Final walkthrough must follow it. | Skill system-video instructions, `skills/plan-to-video/references/style-guide.md`; unchanged authoring rule. |
| D-198 | Warn on checks asked too soon or reusing the shown case. | `scripts/check-terms.mjs`; unchanged. |
| D-199 | New/revised videos take updated check rules; historical system rewrite is not this plan's proof. | Skill “The system video”, `scripts/check-terms.mjs`; final builds pending. |
| D-200 | Maintainers can supply missing over-threshold PR videos; smaller contributors are not excluded. | `.github/CONTRIBUTING.md`, skill “Several people”; unchanged. |
| D-201 | Maintainer disagreement changes code and keeps last answer on the branch; original review remains. | `scripts/reel.mjs`, skill “Several people”; unchanged. |
| D-213 | Built video stays off the PR code branch/main history. Its obsolete hand-attached zip route was delivered by D-215. | `.gitignore`, `.github/CONTRIBUTING.md`, D-213 ledger note; no zip claim. |
| D-215 | PR bundles travel on throwaway `video/pr-<n>` branches, never merged. No PR bundle pushed in this plan. | `.github/workflows/pr.yml`, skill “Several people”; unchanged. |
| D-216 | Build detects jargon needing meanings; agent name adds no exemption. | `scripts/check-terms.mjs`, glossary; final video pending. |
| D-217 | Missing likely jargon warns or fails with strict terms checking. | `scripts/check-terms.mjs`; unchanged. |
| D-218 | Known/looked-up/defined words stop underlining while staying in Terms. | `packages/player/reelplanner-player.js` (`syncKnown`); unchanged. |
| D-219 | Short walkthrough shows changes running, about two minutes. | Skill implementation step 6; final walkthrough pending. |
| D-220 | Pause based on notice, reversibility, deviations and miss tags; no fixed/capped number. | `scripts/lib/autonomy.mjs` (`stopFor`, `beatsOf`); unchanged. |
| D-221 | Approve leaves unpaused calls listed, not judged; flags still require fixes. | `scripts/lib/autonomy.mjs`, `scripts/reel.mjs`, `scripts/lib/memory.mjs`; final review pending. |
| D-222 | Walkthrough checks only where there is something to predict. | Skill implementation step 6, this walkthrough's Predict cases; final video pending. |
| D-223 | Small PR needs a video for visible/hard-to-undo choices; other choices live in PR text. | `scripts/reel.mjs` (`pr-check`), `.github/pull_request_template.md`; unchanged. |
| D-225 | Every fresh-eyes finding answered before showing the video. | `scripts/lib/fresh-eyes.mjs`, skill build step 5; final video checks pending. |
| D-227 | Fresh eyes for every new video; not replaced by self-checking. | Skill build step 5; final lifecycle/video gate pending. |
| D-230 | Every plan has a guide with a Built side. | `scripts/lib/guide/built.mjs`, this walkthrough; guide rebuild/verification pending. |
| D-244 | Plan and walkthrough text are source; guide generated once from them. | `scripts/lib/guide/model.mjs`, `scripts/lib/guide/built.mjs`; no generated-guide hand edits. |
| D-245 | Before you watch lists only new kept findings; repeated reasons fold. | `scripts/lib/fresh-eyes.mjs`; final fresh-eyes pass pending. |
| D-247 | Historical case-study sites are plain files plus verified `site.bundle`. No new comparison/site bundle claimed. | `scripts/case-study.mjs` (`keep`); unchanged. |
| D-248 | Plan this leans on its explainer instead of re-explaining everything. | `scripts/reel.mjs` (`new-plan --from`), skill explainer workflow; unchanged. |
| D-249 | Commit explainer text and pins, never external transcript text. | `scripts/lib/explainer.mjs`, `scripts/lib/codex-session.mjs`, `scripts/session.mjs` (step 4). |
| D-250 | Explain arbitrary sources using story/guide principles rather than a fixed source-kind story. | Skill “An explainer”, `scripts/lib/explainer.mjs`; Codex changes source discovery only. |
| D-303 | Installation changes require real working commands on-screen. | `scripts/test/codex-install.spec.mjs` full install case, skill implementation step 6; saved final scene pending. |
| D-304 | Historical “real planning” explanation refers to old name; D-312 renamed the product. Do not silently restore the old name or call its old pun freshly proved. | README, `.reelplanner/decisions.json` D-304/D-312; unchanged naming history. |
| D-305 | No voice files/renders committed. Its slimmed-history publication proposal was replaced in part by D-310. | `.gitignore`, `scripts/release/make-public.mjs`, D-310 ledger note; no publication/history rewrite here. |
| D-306 | Owner answers bind; accepted calls are history raised when their lines change; folding needs owner approval. | `scripts/lib/ledger.mjs`, `scripts/lib/call-lines.mjs`, `scripts/reel.mjs` (`fold`); unchanged. |
| D-309 | Only already accepted walkthroughs are settled history. This unfinished one still faces every rule. | `scripts/reel.mjs` (`audit`); audit/final acceptance pending. |
| D-310 | Public tree export is one initial commit, then ordinary work; D-312 updates its name. No new export/publication claimed. | `scripts/release/make-public.mjs`, `.reelplanner/README.md`, D-312 ledger note; unchanged. |
| D-311 | Full suite on every PR push, separate PR checks, maintainer merge check and required review. No PR CI success claimed here. | `.github/workflows/ci.yml`, `.github/workflows/pr.yml`, PR template; unchanged. |
| D-312 | Lowercase reelplanner and new project/env names; preserve old saved marks/legacy reads and historical wording. | `plugin.json`, `scripts/lib/old-names.mjs`, `scripts/lib/env.mjs`, player storage keys (steps 1–6). |
| D-313 | Local loop plus portable remote exports; hosted automatic handoff excluded. Disconnected export/intake preserves answers, comments and provided identity; genuine unauthenticated intake uses the Git fallback. | Approved `plan.md`, `docs/agents.md`, `scripts/bundle-player.mjs` (step 5). |

## Tests run

`runs/npm-test-audio.txt` saves the checkpoint's complete stdout: all 59 fast specs passed in 219.8 seconds. Its actual command and observed exit 0 wrap the captured full output. The final completion-guard run passed all 59 in 247.2 seconds; `runs/npm-test-final-guard.txt` retains its exact command, complete output and exit 0, including 13 delivery checks.

The real headless proof and Ghostty position run retain command/output/exit. Terminal and portable traces retain every output line with trailing whitespace normalized for Git; their byte-exact originals remain in the named private scratch evidence folders. `headless-summary.json` gives runtime/version, scratch commit IDs, limits, 244565 ms total model duration and 92453 reported tokens. `ghostty-trial.json` reports the full checks listed under steps 5/6; final raw full-run evidence remains to be saved.

**Ran in a scratch repo:** `runs/headless-real.txt`, `runs/ghostty-audio-position.txt` — the former used a synthetic Git wording-only plan and injected/restored signing failure; the latter inspected the scratch upload-resume reference player's live Ghostty pane. `runs/npm-test-audio.txt` ran the repo suite, whose specs use scratch copies; it was not the acceptance project's narrated lifecycle.

## Code check

The fresh independent checker reviewed the checkpoint diff and wrote `code-check/findings.md`: two steps passed, four had findings; all 47 cited decisions held, and one implementation choice needed an autonomy row. Each finding is answered here; unfinished evidence remains explicit.

- **Step 2:** Fixed the unrelated-commit acceptance bug and the second check's unclaimed-review bypass. Git completion now requires a claim and instrumented baseline/check/commit evidence even when no progress was present. Legacy missing evidence fails closed; a new baseline plus newly checked work is explicit recovery. Full delivery/loop passed 13 + 96 checks. Runs: `runs/unclaimed-completion.txt`. `scripts/lib/inbox.mjs` freezes an expected review tree at checked before commit, verifies that exact tree at committed/done, and preserves original owner staging/content. Full delivery/loop regressions reject unrelated empty and nonempty commits and prove legitimate commit/crash recovery. Runs: `runs/completion-recovery.txt`.
- **Step 3:** Fixed stranded expired handlers. A new session atomically adopts expired ownership at every saved phase, preserving baseline and progress; live leases and headless processes stay protected. Full delivery regressions cover default no-headless recovery and concurrent adoption. Runs: `runs/completion-recovery.txt`.
- **Step 5:** The real Ghostty Ask, answer display, choice, comment and Send now have saved proof. The disconnected download/intake trial now also passes with answers, comments and any provided identity preserved. Walkthrough controls and changed-scenes are still being exercised, so this finding remains open.
- **Step 6:** System spec/map/glossary have been updated. The real scratch lifecycle has reached approved plan revision; complete implementation, walkthrough/fix and app evidence are still pending, so this finding remains open.
- **`scripts/lib/codex-session.mjs`:** A10 records the existing export ceilings and verified external-copy fallback. No private source text is added to Git.

A fresh final check must review the corrected committed diff and remaining runtime evidence before acceptance.

## Not done

- **Complete local acceptance:** the real small project has not yet demonstrated native skill invocation, narrated plan/revision, fresh checks, implementation, independent code check, accepted and flagged walkthrough choices, fix and final commit.
- **Live clients:** the owner-confirmed Codex CLI in iTerm2 adopted and answered a saved question through its verified active thread; it deliberately polled, so automatic wake is not claimed. Scratch Ghostty plan Send was adopted and recorded. A separate Codex app handoff remains unverified.
- **Presentation and remote scope:** Ghostty plan choices, comments, Ask and Send, occupied-port recovery, and disconnected export/intake are proved. Finish walkthrough Accept/Flag and changed-scenes. Hosted automatic service remains outside D-313's scope.
- **Evidence closure:** save exact native install and private-export command outcomes without transcript text. Full touched-spec and final fast output are saved; the last guard change additionally passed full delivery/loop (13 + 96 checks).
- **Final check and walkthrough:** fresh code-check findings, their answers, `reel check --base`, `reel audit`, stops, guide validation, fresh script/frame/video checks, walkthrough build and owner review are pending. Checkpoint commit `0d051e7` is an implementation checkpoint, not acceptance.
- **System record:** spec/map/glossary now describe the implementation; affected system video scenes await post-acceptance refresh.
- **Other surfaces:** Linux, Windows, WSL and cloud are unverified. Public plugin submission, deployment and owner-repo unattended enablement remain separate explicit actions.

## The walkthrough video

Pending. Build from the real installation, stopped-commit/retry, durable live question, private source export and corrected seek behavior. Keep the story about two minutes; group pauses by the A1–A11 table and actual `reel stops` report, and show one saved real result for each claimed change. End with the tests, unfinished gates and the list. The final accepted/flagged review is part of acceptance, not assumed from this checkpoint.
