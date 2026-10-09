# Code check brief: 2026-09-22-m3-revise-loop

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-22-m3-revise-loop/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-22-m3-revise-loop

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (82b65aa..HEAD)

```
1e72f39 Revise-loop walkthrough: round 2 (steps 6-10), its 14 calls with tags and 2 deviations, and what is not done
2eabf33 Round 2 step 9, the text: the skill and style guide rewritten at half the length; step 7's quick-check rule (D-085, D-083)
1d39e9b Round 2 step 9, the mechanics: one build command, every review kept once, fewer format rules (D-085)
3ebc62b Round 2 step 6: a run nobody is watching runs in auto mode, inside the sandbox (D-082)
a10cace Round 2 step 8: stop only for the calls a reviewer might overturn (D-084)
e81a2b7 Status: the memory plan's aim is the right questions, learned from misses and what the reviewer marks; progressive disclosure; simple first
e75160b Status: the memory plan needs a yardstick outside its own loop (skill version on each review, a fixed benchmark)
780dd31 Status: the revise loop's proof is done and round 2 is being built; note the owner's direction for the memory plan
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-22-m3-revise-loop/plan.md` in full. Its title is "The loop, what's left: an agent that runs it in the background, narration that redoes only what changed, and a system video you can edit the system through", with 10 steps.

## The decisions that apply

- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | The kept narration is the project's own committed `assets/voice/NN.wav` and the words in `audio_meta.json`, indexed by a small committed record, `.hyperframes/narration.json` (frame → key, text, wav sha256) | a per-repo, gitignored store (`.reelplanning/cache/narration/`) | cloud sessions start from a fresh clone, so a gitignored cache is empty exactly when the system video gets rebuilt. The wavs are already committed, so a committed key record makes them the cache, with no second copy | scripts/lib/narration.mjs `recordPath`; scripts/narrate.mjs |
| A2 | 1 | The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (`kokoro-v1.0 + whisper small.en`), read from the pinned HyperFrames CLI | the HyperFrames version as the model | a HyperFrames upgrade that keeps kokoro-v1.0 should not re-narrate every video. Whisper is in the key because the word timings come from it | scripts/lib/narration.mjs `modelId` |
| A3 | 1 | A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote `audio_meta.json`, only when `audio_meta.json` and `assets/voice/` are exactly that commit's. `--adopt` does the same from the working SCRIPT.md, outside git | re-narrating every line once, to create the record | every existing video (the system video included) would pay the 11 minutes once more on its first rebuild. The committed pair is the evidence of what the wavs were made from, and any later touch to the wavs disqualifies it | scripts/lib/narration.mjs `gitNarratedLines`; scripts/test/narrate.spec.mjs "adopted from git" |
| A4 | 1 | The cost is one phrase shared by `spec-diff` ("cost: …") and `reel status` ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make. `spec-diff --json` carries it as `narration` | counting only the named frames' lines | an edit already made to SCRIPT.md is part of the cost too, and the record knows it exactly (D-003: say the cost first) | scripts/lib/narration.mjs `narrationCost`; scripts/spec-diff.mjs; scripts/reel.mjs `status` |
| A5 | 2 | The notification fires from `reelplanning review <video-dir>` once the server is listening (the page is up and its URL known), and from `reelplanning notify <video-dir> --url <artifact-url>`, run by the skill after publishing a hosted page. `review` with no folder (the library) does not notify; `--no-notify` turns it off | firing at the end of `verify.sh` or `finish-project.sh` | verify and finish-project know no URL and run again and again while findings are fixed; "ready" in the plan means verify passed *and* the page is up, and the skill always runs `review` right after verify passes | scripts/review.mjs (the `notify` call after listen); scripts/notify.mjs; skills/plan-to-video/SKILL.md "Running the loop (v9)" |
| A6 | 3 | The inbox is `.reelplanning/inbox/<id>.json`, gitignored with its claims, heartbeats and run logs; `reel-intake` is what turns a row into committed files | committing inbox rows | a row is untrusted and machine-local until intake checks it; committing it would also let a push look like a new review | .reelplanning/.gitignore; templates/reelplanning/gitignore |
| A7 | 3 | "A session is waiting" = a heartbeat file `inbox/.waiters/<pid>.json`, rewritten every 2 s by `review --wait`, and counted when it is under 10 s old and (same host) its pid is alive | a plain pid lock file, or a socket the waiter holds open | a killed session (SIGKILL, the laptop lid) leaves a stale file that ages out by itself; the pid check catches a clean exit sooner; one file per waiter so two sessions never overwrite each other | scripts/lib/inbox.mjs `liveWaiters`, `startHeartbeat` |
| A8 | 3 | With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run | trusting the first look | a waiter that dies between the look and its next poll would otherwise strand the review until someone opens a session | scripts/review.mjs `deliver` |
| A9 | 3 | One handler per review, enforced by an exclusive-create claim file `inbox/<id>.claim` (`open(…, "wx")`): the waiting session, the headless start and the session-start pickup all have to win it | a lock held in the server's memory | it survives the server restarting and settles the race between a waiter and a headless start; the loser simply does nothing | scripts/lib/inbox.mjs `claim`; scripts/test/loop.spec.mjs "only the first taker" |
| A10 | 3 | `POST /api/review` accepts only `content-type: application/json`, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry `review.annotations` | accepting any POST | the endpoint can start an agent run, so a page in another tab must not reach it: a text/plain form post skips the CORS preflight, and the Host check stops DNS rebinding. The plan directory is still checked by `reel-intake`, not here | scripts/review.mjs `handleApi` |
| A11 | 3 | This repo's `config.json` is `"command": "claude -p"`, exactly, with no permission flags; its `//` note says flags can be added (**after review:** you flagged it and asked what else it could be, and whether a run should be fenced and able to start workers. That is a choice, so it is now plan step 6, question 2: as now, auto mode in the sandbox, everything in the sandbox, or a short list) | adding `--permission-mode acceptEdits` or an allowed-tools list | how much a headless run may do unasked is the owner's call, not the implementer's. The cost: a real headless run may stop at its first permission prompt (not yet tried) | .reelplanning/config.json; templates/reelplanning/config.json |
| A12 | 4 | Intake checks a system-video target: inside the repo, directly in a `.reelplanning/`, with a STORYBOARD.md whose front matter says `kind: system` and a plan-map.json, and every mark's `frame.compositionId` one of that video's frames. The review is filed as `system-video/annotations.json` and `system-review` runs with the checked folder, never the row's claim | believing the path once it matches | the same rule as for plans (checked, not believed); the frame check refuses a plan video's review sent to the system video by mistake | scripts/reel-intake.mjs `intakeSystem`; scripts/test/system-review.spec.mjs |
| A13 | 4 | The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small. Each hint prints its reason; the agent decides | no hint, or a model call | the plan asks for a sort the agent overrides; crude and explainable beats clever | scripts/system-review.mjs `hint` |
| A14 | 4 | The "short walkthrough" for a small change is a one-step plan from `reel new-plan`, with its own walkthrough.md and walkthrough video | a walkthrough with no plan directory | walkthroughs, `reel record`, the ledger and the library all hang off a plan directory; a one-step plan is the smallest thing they already accept | skills/plan-to-video/SKILL.md "Reviewing the system video (v9)" |
| A15 | 3 | On a local page, Finish POSTs the row to `/api/review` only when the review server marked the page as its own (a meta tag) and a GET `/api/review` on load answered `{ok:true}`; a failed POST is dropped quietly and the download stays | posting blind from every localhost page | `npm run review` serves the player with python's http.server, which would answer every POST with a 501; the download and commands are still a complete answer | packages/player/reelplanning-player.js `reachLocal`, `postLocal`; scripts/review.mjs (the meta tag) |
| A16 | ask | After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build | on only when a sent round exists, or remembering "whole video" for good | a reviewer who downloaded instead of sending, or opens the revised video in a new browser, has no round on record but still wants the changes; a "whole video" kept from last round would hide the next round's changes | packages/player/reelplanning-player.js `initOnly`, `toggleOnly`; packages/player/test/changes.spec.mjs |
| A17 | 6 | The sandbox settings are inline in the command's `--settings`, not a committed `.claude/settings.json` [visible, close] | a committed `.claude/settings.json` | only the run nobody is watching is fenced, not every session in the repo; `reel init` already writes the one line | `.reelplanning/config.json` |
| A18 | 6 | `failIfUnavailable: true`: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all [visible, hard-to-undo, close] | the default, which runs unsandboxed with a warning | D-082 chose the fence; no run should go unfenced quietly | `.reelplanning/config.json` |
| A19 | 6 | `allowUnsandboxedCommands: false`: nothing runs outside the fence, so a commit signed through a local agent fails [hard-to-undo, close] | letting the classifier approve an unsandboxed retry | otherwise the fence is advice | `.reelplanning/config.json` |
| A20 | 6 | The review server tells the reviewer when the run it started ends (ready, or stopped with its log); `review --detach` inside a run does nothing [visible] | the run notifying through `review --detach` | a sandboxed run cannot see or reach the server: the first real run sent a dead link | `scripts/review.mjs` `afterRun`; `scripts/lib/inbox.mjs` `startAgent` |
| A21 | 8 | Tags go in brackets at the end of the "chose" cell | a seventh column | old tables and every reader keep working | `scripts/lib/autonomy.mjs` `splitTags` |
| A22 | 8 | Flagged and own-words calls enter the ledger with status `flagged`/`own`; a new verdict on a call supersedes its earlier accept [hard-to-undo, close] | keeping only accepted calls | the stop rule needs flags; the old rule left an accept in force after a later flag | `scripts/reel.mjs` `record` |
| A23 | 8 | A tag's run of accepts counts across all plans in the order they were judged; entries without tags count for nothing | per plan, or by date | dates tie within a review; the rule is about the reviewer, not the plan | `scripts/lib/autonomy.mjs` `acceptedRun` |
| A24 | 8 | The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict [visible, close] | own words and a key per call | keeps the sheet short; a comment still works | player `askGroup`, `flagInGroup` |
| A25 | 9 | Reviews are filed as `reviews/plan-<time>.json` / `walkthrough-<time>.json` with an `.md` beside each, and `migrate-reviews` ships as a command that moved all six plans [visible, hard-to-undo] | reading both layouts | one layout to read; other repos get the same path | `scripts/lib/reviews.mjs`; `scripts/migrate-reviews.mjs` |
| A26 | 9 | `resolve-plan` and `resolve-walkthrough` are deleted; `revise-scope` and `walkthrough-scope` stay as JSON printers [visible] | keeping all four | the resolved copies are gone; the sorting is still used | `scripts/*-scope.mjs`, `scripts/lib/review-scope.mjs` |
| A27 | 9 | `build` retimes against the narration the frames were timed to, kept in `.hyperframes/frames-timed-to.json` until retime passes | always against HEAD | a second build before a commit would move a frame twice | `scripts/build.mjs` `retime` |
| A28 | 9 | One on-screen budget: five new words per beat beyond labels | eight | the later rule, from a review | style guide §3 |
| A29 | 9 | `CLAUDE.md` also tells an agent here to run this checkout's tooling rather than the published `$RP` [close] | moving only the autonomous-mode section | a plan here should be built with the code it changes | `CLAUDE.md` |
| A30 | 9 | `detail_kind` is free-form and `detail new --kind <anything>` starts from the blank page; `--step` is gone [visible] | a closed list of seven kinds | the kinds were a starting point, not a rule | `scripts/check-details.mjs`, `scripts/detail.mjs` |
| D2 | 6 | Codex's equivalent is `codex exec --sandbox workspace-write`, not the plan's `codex exec --full-auto` | the plan's flag | `--full-auto` is deprecated and prints a warning | `.reelplanning/config.json` note |
| D3 | 6 | No list of allowed hosts: in auto mode the classifier reviews each host a command names | the plan's "network to named hosts" | a list needs upkeep; untested here, the sandbox had no network in this container | `.reelplanning/config.json` |
| m1 | 1 | Each record entry carries the wav's sha256; a kept line whose file no longer matches is narrated again | trusting the record | a crash half way through, or a hand-run `audio.mjs`, overwrites a wav under an unchanged key | scripts/lib/narration.mjs `planNarration`; narrate.spec "changed behind narrate's back" |
| m2 | 1 | Adopted lines take their voice from `audio_engine_meta.json`'s `voice_id` and assume speed 1.25 | refusing to adopt without a recorded speed | nothing on disk records an old build's speed; every build since patch-tts-speed used 1.25, and another `--speed` re-voices anyway | scripts/lib/narration.mjs `keptLines` |
| m3 | 1 | `narrate` defaults to `--speed 1.25` and to the voice the video was last narrated with (record, then engine sidecar), then the remembered pref, then the engine default | audio.mjs's default of 1.0, and prefs first | a rebuild should sound like the rest of the video; a new voice is a flag, and re-voices everything | scripts/narrate.mjs (voice resolution) |
| m4 | 1 | A test seam, `REELPLANNING_TTS_ENGINE`: a stand-in for media-use's engine, passed to the real audio.mjs | a fake audio.mjs | the test then also proves the real adapter's parsing of the filtered script and its meta conversion | scripts/narrate.mjs header; scripts/test/narrate.spec.mjs |
| m5 | 1 | Kept files are copied aside before audio.mjs runs and put back by key, so lines can change frame numbers; wavs of lines gone from SCRIPT.md are deleted | reusing only same-frame lines | inserting a beat renumbers every later frame; without this an insert re-voices the rest of the video | narrate.spec "an inserted line", "a deleted line" |
| m6 | 1 | sfx carried over from the existing `audio_engine_meta.json`; bgm and provider from this run when audio.mjs ran, else from the old sidecar | dropping them, as rebuild-narration.sh did | the engine's own `--only tts,bgm` keeps sfx as its merge base; fetch-sfx recomputes them next anyway | scripts/narrate.mjs (engine sidecar); narrate.spec "sfx already resolved are kept" |
| m7 | 1 | A line the engine returns no voice for fails the run (exit 1, "run narrate again to retry just those") and is not recorded | audio.mjs's silent omission | a missing line is a missing voice; only unrecorded lines are retried, so a rerun costs just those | scripts/narrate.mjs (`missing`) |
| m8 | 1 | `bin/reelplanning.mjs` left as is: `narrate` is a command by being `scripts/narrate.mjs` | adding it to SPECIAL | SPECIAL is for commands that are not a script of the same name | `node bin/reelplanning.mjs --help` |
| m9 | 1 | `scripts/rebuild-narration.sh` calls `narrate` instead of deleting the voices and running audio.mjs | leaving it re-voicing everything | it is the "re-narrate after a SCRIPT.md change" script, exactly step 1's case; left alone it would also invalidate the record | scripts/rebuild-narration.sh |
| m10 | 1 | The skill's Revise item 3 also names `retime-frames` after re-narrating | only replacing the "re-synthesizes the whole project" sentence | a rewritten line moves its frame's words; the tool existed and Run item 4 named it, the Revise passage did not | skills/plan-to-video/SKILL.md "Revise (v6)" item 3 |
| m11 | 1 | The time estimate is 13 s + 19 s a line, from this build's measurements (35 lines 675 s; 1 line 32 s) | the skill's older "about 16 s a line" | measured on the same machine and project; the older figure left out start-up | scripts/lib/narration.mjs `SECONDS_PER_LINE`, `STARTUP_SECONDS` |
| m12 | 1 | The real 32 s / 675 s runs used a scratch copy of the system video, adopted with `--adopt`, not a `narration.json` written into the repo's own system video | recording the real system video now | worker C was editing the system video at the same time; git adoption already covers it (a dry run there keeps all 35 lines, adopted from `2065e51`) | `reelplanning narrate .reelplanning/system-video --dry-run` |
| m13 | 2 | The waiting line counts plan-map `decisions` as "choices to make", `autonomy` as "calls to accept or flag", `quizzes` as "quick checks", and minutes from `watchedSeconds` (else `totalSeconds`), at least 1; "nothing to decide" when all are zero | counting frames or changes, or minutes from totalSeconds | watchedSeconds is what the reviewer sits through (branches not taken are skipped) | scripts/lib/notify.mjs `waitingLine` |
| m14 | 2 | macOS and Windows notifications read title and body from environment variables | writing them into the script text | no quoting bugs, and no injection from a plan title | scripts/lib/notify.mjs `osCommand` |
| m15 | 2 | `REELPLANNING_NOTIFY_CMD` replaces the OS command (`<cmd> <title> <body>`); `REELPLANNING_NOTIFY=0` silences it; the stdout line always prints | a `notify` key in config.json | tests stub the OS command through the real CLI, and a person can route it to a phone push (ntfy) with no new config | scripts/lib/notify.mjs `notify` |
| m16 | 3 | The same review posted twice is one file: its id is `<project>-<submittedAt>`, as the hosted row's, and an identical second post gets the first answer | writing a second file | a second file would be a second claim and a second run | scripts/lib/inbox.mjs `writeReview`, `reviewId` |
| m17 | 3 | The headless command gets the prompt as its last argument, spawned without a shell (a string split on spaces and quotes, or an argv array), from the repo root, detached, logging to `inbox/runs/<id>.log`; if it cannot start, the claim is released | a `{prompt}` placeholder, or a shell | `claude -p`, `codex exec` and `opencode run` all take the prompt last; with no shell nothing in a row can be interpreted | scripts/lib/inbox.mjs `startAgent` |
| m18 | 3 | The waiting command is `reelplanning review --wait` (also `inbox --wait`): it claims the review before printing its path, prints only the path, exits 0; `--timeout <s>` exits 2 | printing the path without claiming | a claimed review is not also given to a headless run, and a restarted waiter does not get the same review again | scripts/inbox.mjs |
| m19 | 3 | `reelplanning inbox` lists waiting and claimed-not-done reviews; `inbox done <id>` moves a handled one to `inbox/done/` | deleting handled reviews | a local trail of what was handled and when, without committing it | scripts/inbox.mjs; scripts/lib/inbox.mjs `markDone` |
| m20 | 3 | `GET /api/review` answers `{ sessionWaiting, agentCommand, inbox }` next to the POST | POST only | meant to let the player say what Finish will do before it is pressed; the player only uses it to know the server is there (see Deviations) | scripts/review.mjs `handleApi`; docs/hosted-review.md §3 |
| m21 | 3 | On Windows the command is spawned with `shell: true` (for `.cmd` shims such as `claude.cmd`) | resolving the shim by hand | small; the prompt is not re-quoted for cmd.exe, so Windows is untested | scripts/lib/inbox.mjs `startAgent` |
| m22 | 3 | The endpoint's contract is §3 of `docs/hosted-review.md`; `config.json` and `inbox/` are in `docs/project-dir.md` and both READMEs; `scripts/test/loop.spec.mjs` joins `npm test`, with the 15 s re-check shortened by `REELPLANNING_RECHECK_MS` | leaving it to the report; sleeping 15 s in the test | worker C and the next reader need the row shape in one place; the spec stays under ~15 s and still runs the re-check | docs/hosted-review.md; package.json `test` |
| m23 | 4 | plan-map writes each frame's tags as `specSection` (string or null) and `components` (ids, `[]` when none) | the storyboard's snake_case | every other frame field in plan-map.json is camelCase | scripts/plan-map.mjs (frames) |
| m24 | 4 | plan-map lifts the storyboard's `kind:` and, for `kind: system`, adds `reviewDir` (`.reelplanning/system-video`); `planDir` stays `.reelplanning` | changing `planDir` for the system video | `planDir` also locates plan.md and many call sites read it as "the plan"; a separate field names where the review goes | scripts/plan-map.mjs (`kind`, `reviewDir`) |
| m25 | 4 | The sort is written to `system-video/review.md` by `reelplanning system-review <review.json>` (a player export or a hosted row; `--json` prints the items) | a JSON scope file like `revise-scope.json` | a markdown file with an **Answer:** line per item is both the agent's worklist and the committed reply | scripts/system-review.mjs |
| m26 | 4 | Items also include own-words answers to a quick check, marks inside a detail page, and slow-downs | only marks, comments, rewinds and missed checks | they are the same kind of signal; dropping them would lose a comment | scripts/system-review.mjs (items) |
| m27 | 4 | A mark placed on one part of the stage (`plan.component`) is listed as "marked on", and counts as the one part for the size hint | only the frame's parts | a circle on one node is the reviewer naming the part | scripts/system-review.mjs |
| m28 | 4 | Intake accepts two spellings of the target: `planDir: .reelplanning/system-video` (the new player) and `planDir: .reelplanning` with `project: "system-video"` or `kind: "system"` (pages bundled before this change) | only the new spelling | the system video already hosted sends the old one; refusing it would strand reviews made on today's page | scripts/reel-intake.mjs (`sysClaim`) |
| m29 | 4 | Intake does not run `reel record` for a system-video review, and files it under the usual name, `annotations.json` | running record, or a new name like review.json | there is no plan or ledger entry to record against | scripts/reel-intake.mjs `intakeSystem` |
| m30 | 4 | The player finds the system video by `kind: "system"`, or by `project === "system-video"` for an older map; its row carries `kind` and `planDir` = the review folder, and its three commands are `mv … system-video/annotations.json`, `system-review …`, commit | leaving the plan commands, which fail | the three commands must work for the system video too | packages/player/reelplanning-player.js `isSystem`, `reviewTarget`, `handoffSteps` |
| m31 | 4 | "Answered where it was made": the hosted page shows a row's `answer` after its status line; locally, the answer is the **Answer:** line in review.md | a per-comment reply in the player | the smallest thing that puts the reply where the reviewer looks; per-comment replies need a design pass | packages/player/reelplanning-player.js `watchReview`; scripts/system-review.mjs |
| m32 | 4 | The hosted Send wording names the system-video sort (fix the video, small change and walkthrough, or a plan) | "records your calls, resolves the plan" | that text is wrong for a video with no plan | packages/player/reelplanning-player.js `sendBlock` |
| m33 | 3 | The POSTed body is exactly the hosted row (no id); sending again with nothing changed sends nothing; with a changed verdict or marks it sends a new row (**changed after the gap check:** the send is the panel's Send, not Finish, m45) | re-posting on every verdict click, or once ever | the inbox keys a row by project + submittedAt and treats new text as a new review (a new run), so each send must be a deliberate Finish | packages/player/reelplanning-player.js `postLocal`, `postedBlock` |
| m34 | 3 | A successful local POST ends the round like a hosted Send, and "Sent to the repo. <server's message>" with the inbox path replaces the download as the panel's main act; the commands fold under "Do it yourself instead" | leaving the download first | the reviewer should not download a file the repo already has | packages/player/reelplanning-player.js `showHandoff`; packages/player/test/local-review.spec.mjs |
| m35 | ask | One button whose label is the other mode ("Play the whole video" / "Play just the changes"), with the mode in force said beside it ("Plays just the changes", a coral dot) on the Revised line; the record's button mirrors it | a two-part switch, or a pressed-state button | the owner asked for one toggle; a label that names the action and a line that names the state read at a glance | packages/player/reelplanning-player.js `renderChanges`, `.revised .mode` CSS |
| m36 | ask | Clicking the toggle plays in the new mode (to changes: stays on a changed beat, else the next, else the first; to whole: plays on from here) | only flipping the mode | both labels say "Play"; the old button played at once | packages/player/reelplanning-player.js `toggleOnly` |
| m37 | ask | Only playing through an unchanged beat is skipped (the playhead moving no faster than 1.5× the clock + 0.35 s, and not right after `jump()`); a seek to an unchanged beat plays it | skipping on every timeupdate, as before | seeking to an unchanged beat must work; 18 call sites seek, and the clock test covers all of them | packages/player/reelplanning-player.js `skipUnchanged` |
| m38 | ask | Past the last changed beat the video pauses and the mode stays on; play then goes on through the rest | turning the mode off, as before | the mode is the reviewer's setting now, not a one-shot; turning it off would undo their choice silently | packages/player/reelplanning-player.js `skipUnchanged` (`_ranOut`) |
| m39 | ask | With the mode on, play from the poster starts at the first changed beat, and the poster reads "0:40 of changes" | leaving the poster as is | the mode must be obvious before anything plays | packages/player/reelplanning-player.js `onAct` "play", `idle` |
| m40 | ask | The toggle is remembered under `:only`, keyed by the build signature, so the next rebuild defaults to the changes again | remembering it for good | the owner asked for the changes to be the default "when we rebuild" | packages/player/reelplanning-player.js `initOnly`, `toggleOnly` |
| m41 | 4 | The committed `.reelplanning/system-video/plan-map.json` gets the new fields merged in (165 insertions, 0 deletions), not regenerated | leaving it until the next finish-project | rerunning plan-map in place would drop plan-diff's `changes`; merging makes the hosted system video reviewable, with parts, today | `git diff 0eebc70 -- .reelplanning/system-video/plan-map.json` |
| m42 | 4 | The skill's "Reviewing the system video (v9)" sits right after "System video (v8)" | appending at the end | it is the review half of the system video | skills/plan-to-video/SKILL.md |
| m43 | 3 | The page's "served by the review server" mark is a meta tag the server adds to the top page, so the player asks `/api/review` only there | probing every localhost page | a plain static server would log a 404 for the probe | scripts/review.mjs (`reelplanning-review-server` meta) |
| m44 | 4 | The Finish panel's verdict wording for a system video: "The video, and the system it shows, are right as they stand" / "The agent sorts your comments: fixes the video… or changes the system" | the plan wording ("The plan goes ahead…") | the real run showed plan wording on the system video's Finish panel | packages/player/reelplanning-player.js `showHandoff` (verdict block) |
| m45 | 3 | On a page served by the review server, Finish opens the panel and the panel's own **Send** POSTs the review, with an optional note, as on the hosted page; Finish no longer POSTs by itself (this replaces m33's "Finish again" wording: a changed verdict after sending shows "Send the change") | Finish POSTing at once, with the line shown only as it goes | "say what will happen before the reviewer sends" needs a moment before the send; the Finish panel is also where the verdict is picked, so sending on Finish sent a verdict the reviewer had not seen yet | packages/player/reelplanning-player.js `onAct` "finish" / "send-local", `localBlock`, `postedBlock`; local-review.spec |
| m46 | 3 | The line reads `sessionWaiting` first ("Your open session picks this up."), then `agentCommand` ("No session is open: `<command>` starts on it."), else "Saved for your next session."; it is asked again (GET) every time Finish opens the panel, and a failed GET keeps the last answer | asking once at load | a session may start or stop while the reviewer watches; the order is the server's own order in `deliver` | packages/player/reelplanning-player.js `refreshLocal`, `localNext` |
| m47 | 5 | The manual path's line under "Do it yourself" now says "Then tell your agent the review is in: it revises from what you recorded" | "the push is what starts the revise" | with the Action gone, a push starts nothing; the agent acts when told, or at its next session start | packages/player/reelplanning-player.js `showHandoff` |
| m48 | 3 | The skill's "Running the loop" item and `docs/status.md` say the Finish panel's Send posts the review, not Finish itself | leaving "Finish posts the review" | it follows m45 | skills/plan-to-video/SKILL.md "Running the loop (v9)"; docs/status.md |
| m49 | 1 | `scripts/rebuild-narration.sh` passes no `--voice` to `narrate`, so narrate's own order applies (the voice the video was last narrated with, then the remembered one, then the engine's default) | passing the remembered voice (`am_michael` when none) as `--voice` | that override re-voiced, line by line, any video made in another voice; changing voice is `narrate --voice`, on purpose (after the code check) | scripts/rebuild-narration.sh; narrate.spec "rebuild-narration.sh passes no --voice" |
| m50 | 3 | After a local send, anything in the review changed since (a comment, a mark, an answer, the verdict) offers "Send the change", which sends a new row; the send compares what it carries (`reviewSig`: marks, decisions, quick checks, calls, verdict) with the last one | offering it only for a changed verdict | a comment added after sending could not be sent at all; m33 already said "with a changed verdict or marks" (after the code check) | packages/player/reelplanning-player.js `reviewSig`, `postedBlock`; local-review.spec "a comment added after sending" |
| m51 | ask | A question, quick check or call on the boundary of a skipped beat is passed over (`_passed`), not marked asked: it is held back only while just the changes play and the playhead is outside its own beat, so the whole video, or a seek into that beat, asks it when reached | marking it asked for the session (`_askedOnce`) | switching to the whole video must not lose a question the reviewer never saw (after the code check) | packages/player/reelplanning-player.js `jumpToChanged`, `passedOver`; changes.spec "a question at the end of a skipped beat" |
| m52 | 4 | One file per system-video review: `system-video/reviews/<id>.json` (the review) and `reviews/<id>.md` (its items and **Answer:** lines), `<id>` = `system-video-<submittedAt>` as the inbox names it, the next free name when two share it; `system-review` files and sorts it, and sorting the same review again keeps its `.md` and answers (`--force` rewrites). `review.md` becomes the index (newest first, answers counted); intake no longer writes `annotations.json`, which stays only as the manual path's drop spot | one `review.md` and one `annotations.json`, overwritten | reviews now arrive on their own (step 3), so two can land back to back; overwriting lost the first one's answers (after the code check) | scripts/system-review.mjs (`--id`, `writeIndex`); scripts/reel-intake.mjs `intakeSystem`; system-review.spec "a second review arriving right after" |
| m53 | 3 | `reelplanning review --detach` starts the server as its own process (a new process group, no terminal, SIGHUP ignored), logging to `inbox/server.log`, and returns once it has written `inbox/.server.json` (pid, port, url, base, out, videos). A second `--detach` reuses it: it bundles the videos asked for into that server's folder (served from disk, so a rebuild is current) and prints the URL; `--stop` stops only a process that answers as the server | the session keeping `review` as its own background task; one server per video | the "no session is open" case needs a server that outlives the session; one per repo keeps one inbox and one port (after the code check) | scripts/review.mjs (`--detach`, `--stop`, `runningServer`); loop.spec "--detach" |
| m54 | 3 | The skill starts the server with `review <video-dir> --detach` (Run item 5, the quick flow, and "Running the loop (v9)"), and keeps `review --wait` as the session's own background task | leaving "run `review` in the background" | `--wait` must end with the session (that is how the server knows none is waiting); the server must not (after the code check) | skills/plan-to-video/SKILL.md "Running the loop (v9)" |

## The diff

Read it yourself: `git diff 82b65aa..HEAD` (from the repository root). The files it touches:

```
.reelplanning/.gitignore                           |   5 -
 .reelplanning/README.md                            |   2 +-
 .reelplanning/config.json                          |   4 +-
 .../plans/2026-09-22-close-the-lifecycle/README.md |  11 -
 .../plan.resolved.md                               | 152 -----
 .../plan-20260922T220346Z.json}                    |   0
 .../reviews/plan-20260922T220346Z.md               |  22 +
 .../walkthrough-20260923T073957Z.json}             |   0
 .../reviews/walkthrough-20260923T073957Z.md        |  17 +
 .../walkthrough-revise-scope.json                  |  61 --
 .../walkthrough.resolved.md                        | 232 -------
 .../plans/2026-09-22-m3-revise-loop/README.md      |  11 -
 .../2026-09-22-m3-revise-loop/plan.resolved.md     | 300 --------
 .../reviews/plan-20260924T000613Z.json             |  91 +++
 .../reviews/plan-20260924T000613Z.md               |  18 +
 .../reviews/plan-20260924T004706Z.json             |  64 ++
 .../reviews/plan-20260924T004706Z.md               |  11 +
 .../plan-20260924T041342Z.json}                    |   0
 .../reviews/plan-20260924T041342Z.md               |  14 +
 .../walkthrough-20260924T031132Z.json}             |   0
 .../reviews/walkthrough-20260924T031132Z.md        |  22 +
 .../walkthrough-revise-scope.json                  |  39 --
 .../plans/2026-09-22-m3-revise-loop/walkthrough.md | 103 ++-
 .../walkthrough.resolved.md                        | 398 -----------
 .../plans/2026-09-22-richer-review/README.md       |  11 -
 .../2026-09-22-richer-review/plan.resolved.md      | 109 ---
 .../plan-20260923T001927Z.json}                    |   0
 .../reviews/plan-20260923T001927Z.md               |  12 +
 .../walkthrough-20260923T025850Z.json}             |   0
 .../reviews/walkthrough-20260923T025850Z.md        |  18 +
 .../walkthrough-revise-scope.json                  |  23 -
 .../walkthrough.resolved.md                        | 190 ------
 .../plans/2026-09-23-deep-dives/README.md          |  11 -
 .../plans/2026-09-23-deep-dives/plan.resolved.md   | 160 -----
 .../reviews/plan-20260923T033620Z.json             | 188 +++++
 .../reviews/plan-20260923T033620Z.md               |  24 +
 .../reviews/plan-20260923T042829Z.json             |  74 ++
 .../reviews/plan-20260923T042829Z.md               |  14 +
 .../plan-20260923T072904Z.json}                    |   0
 .../reviews/plan-20260923T072904Z.md               |   7 +
 .../reviews/walkthrough-20260923T172723Z.json      | 222 ++++++
 .../reviews/walkthrough-20260923T172723Z.md        |  17 +
 .../walkthrough-20260923T191825Z.json}             |   0
 .../reviews/walkthrough-20260923T191825Z.md        |   9 +
 .../walkthrough-revise-scope.json                  |   9 -
 .../2026-09-23-deep-dives/walkthrough.resolved.md  | 245 -------
 AGENTS.md                                          |   1 +
 CLAUDE.md                                          |  16 +
 README.md                                          |  25 +-
 bin/reel.mjs                                       |   2 +-
 bin/reelplanning.mjs                               |   2 +-
 docs/design-notes.md                               | 165 +++++
 docs/hosted-review.md                              |  35 +-
 docs/lifecycle.md                                  |   8 +-
 docs/project-dir.md                                |  33 +-
 docs/reference.md                                  |   6 +-
 docs/status.md                                     |  24 +-
 .../bob-dylan-site/.reelplanning/README.md         |   2 +-
 .../plans/2026-09-19-bob-dylan-site/README.md      |  11 -
 .../projects/media-service/.reelplanning/README.md |   2 +-
 .../plans/2026-09-12-upload-resume/README.md       |  11 -
 .../2026-09-12-upload-resume/plan.resolved.md      | 143 ----
 .../plan-20260912T151000Z.json}                    |   0
 .../reviews/plan-20260912T151000Z.md               |  14 +
 .../walkthrough-20260922T163945Z.json}             |   0
 .../reviews/walkthrough-20260922T163945Z.md        |  17 +
 .../walkthrough-revise-scope.json                  |  32 -
 .../walkthrough.resolved.md                        | 102 ---
 .../plans/2026-09-20-part-size-and-sweep/README.md |  11 -
 package.json                                       |   2 +-
 packages/player/.reelplanning/README.md            |   2 +-
 .../plans/2026-09-21-review-page/README.md         |  22 -
 .../plans/2026-09-21-review-page/plan.resolved.md  | 116 ----
 .../plan-20260921T200500Z.json}                    |  12 +-
 .../reviews/plan-20260921T200500Z.md               |  14 +
 packages/player/reelplanning-player.js             | 153 +++--
 packages/player/test/finish.spec.mjs               |  17 +-
 .../player/test/fixtures/l2-autonomy-group.json    | 757 +++++++++++++++++++++
 packages/player/test/group.spec.mjs                |  88 +++
 packages/player/test/handoff.spec.mjs              |  13 +-
 packages/player/test/local-review.spec.mjs         |   2 +-
 scripts/build.mjs                                  | 132 ++++
 scripts/bundle-player.mjs                          |  56 +-
 scripts/check-details.mjs                          |  11 +-
 scripts/code-check.mjs                             |   8 +-
 scripts/detail.mjs                                 |  45 +-
 scripts/frame-lint.mjs                             |   6 +-
 scripts/hold-durations.mjs                         |   2 +-
 scripts/lib/autonomy.mjs                           |  55 ++
 scripts/lib/details.mjs                            |   6 +-
 scripts/lib/inbox.mjs                              |  19 +-
 scripts/lib/plan-md.mjs                            |  25 +-
 scripts/lib/review-scope.mjs                       | 193 ++++++
 scripts/lib/reviews.mjs                            | 148 ++++
 scripts/migrate-reviews.mjs                        |  90 +++
 scripts/motion-coverage.mjs                        |   2 +-
 scripts/motion-static.mjs                          |   2 +-
 scripts/numerals.mjs                               |   4 +-
 scripts/plan-map.mjs                               |  20 +-
 scripts/rebuild-narration.sh                       |  67 +-
 scripts/reel-intake.mjs                            |  36 +-
 scripts/reel.mjs                                   | 178 +++--
 scripts/resolve-plan.mjs                           |  99 ---
 scripts/resolve-walkthrough.mjs                    | 109 ---
 scripts/review.mjs                                 |  33 +-
 scripts/revise-scope.mjs                           |  99 +--
 scripts/stage-presence.mjs                         |   4 +-
 scripts/system-review.mjs                          |  24 +-
 scripts/test/build.spec.mjs                        | 108 +++
 scripts/test/bundle-shared.spec.mjs                |   6 +-
 scripts/test/details.spec.mjs                      |  51 +-
 scripts/test/lifecycle.spec.mjs                    | 112 +--
 scripts/test/loop.spec.mjs                         |  37 +-
 scripts/test/review-data.spec.mjs                  |  35 +-
 scripts/test/reviews.spec.mjs                      | 162 +++++
 scripts/walkthrough-scope.mjs                      |  99 +--
 skills/plan-to-video/SKILL.md                      | 317 +++++----
 skills/plan-to-video/references/style-guide.md     | 565 ++++++++-------
 templates/details/fresh.html                       |   4 +-
 templates/details/plan-text.html                   | 202 ------
 templates/reelplanning/README.md                   |   2 +-
 templates/reelplanning/config.json                 |   4 +-
 templates/reelplanning/gitignore                   |   5 -
 templates/reelplanning/plan-README.md              |  11 -
 templates/reelplanning/theme/stages/README.md      |   7 +-
 templates/reelplanning/theme/stages/layout.html    |   4 +-
 templates/reelplanning/theme/stages/pipeline.html  |   2 +-
 127 files changed, 4074 insertions(+), 3912 deletions(-)
```
