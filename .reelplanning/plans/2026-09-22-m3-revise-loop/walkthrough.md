# Walkthrough: The loop, what's left

**Status:** round 1 (steps 1–5) built and reviewed; round 2 (steps 6–9) built from `82b65aa` (commits a10cace, 3ebc62b, 1d39e9b, 2eabf33); step 10 waits for the next plan · **Plan:** `plan.md` · **Round 2 decisions:** D-082 = a run nobody is watching runs in auto mode, inside the sandbox · D-083 = a quick check per step, plus wherever there is something to predict · D-084 = tagged calls stop, and the reviewer's record decides which tags fade · D-085 = trim the text and the files · **Round 1 decisions:** D-064 = a background agent runs the loop between reviews · D-065 = small, local changes from a system-video comment go straight in, anything with a choice becomes a plan · D-066 = one setting names the agent's headless command, tested with Claude Code only · and D-003 = keeping the system video current must stay cheap, with the cost said first

Built by three agents at once (A: step 1; B: steps 2 and 3; C: step 4, plus a player change the owner
asked for during the review), from commit `0eebc70`. Each logged its own calls as it made them.
Together they made 60, five times the dozen the build rules allow before saying the plan left too much
open: **it did.** The plan said what each step should achieve, but not how: where the kept narration
lives and what it is keyed on; how the review server knows a session is waiting, and who wins when a
waiting session and a fresh run could both take a review; where the "video ready" notification fires;
how the local page hands a review to the server (a contract between B and C that the plan never
named); and what a system-video review is filed as, and how intake checks it. The 16 calls below are
the ones worth judging; the other 44 are listed after them.

## What was done, per step

### Step 1 — Narrate only the lines that changed ✅

A new command, `reelplanning narrate <video-dir>` (`scripts/narrate.mjs`, with the logic in
`scripts/lib/narration.mjs`), keeps each line's wav and word timings under a key made of its text,
voice, speed and model (A2). It hands `audio.mjs` only the lines whose key changed, then puts the kept
ones back byte for byte. The key record is committed with the video, at `.hyperframes/narration.json`
(A1). A video narrated before the record existed is adopted from git, not re-narrated (A3). As the
plan says, the HyperFrames narration script is not changed: `narrate` runs the same `audio.mjs` on a
filtered script. `scripts/rebuild-narration.sh` now calls `narrate`, and the skill
(`skills/plan-to-video/SKILL.md`, Run item 4, Revise item 3, and "Keeping it current") uses it
everywhere it used to re-voice the whole project. D-003 holds: `reel status` (`scripts/reel.mjs`) and
`spec-diff` (`scripts/spec-diff.mjs`) now say what an update costs in lines to narrate, with seconds
of speech and about how long they take, before anything runs (A4). Measured: one edited line of the
system video took 32 s, not 675 s.

### Step 2 — Builds run in the background, and you are told when a video is ready ✅

D-064 holds. The skill's new section "Running the loop (v9)" (`skills/plan-to-video/SKILL.md`) makes
background workers the default: the main session hands off every build, implementation, code check and
fix, and stays free. The notification is reelplanning's own (`scripts/lib/notify.mjs`: `notify-send`,
`osascript` or PowerShell), so it works the same under any agent. It fires when
`reelplanning review <video-dir>` has the page up (`scripts/review.mjs`), and from
`reelplanning notify <video-dir> --url <artifact-url>` (`scripts/notify.mjs`) after a hosted page is
published (A5). It says what is waiting, in the plan's wording: "2 choices to make, 3 min" (m13).

### Step 3 — Pressing Finish reaches the main session, or starts one ✅ (one deviation)

D-064 holds for the local page. The review server (`scripts/review.mjs`) takes
`POST /api/review` from the page (A10, A15), writes the review to `.reelplanning/inbox/<id>.json`
(`scripts/lib/inbox.mjs`; not committed, A6) and hands it on:

- to a main session waiting on `reelplanning review --wait` (`scripts/inbox.mjs`), known by a
  heartbeat file it rewrites every 2 s (A7);
- else to a fresh headless run of the command in `.reelplanning/config.json` (D-066: `claude -p`,
  with `codex exec` and `opencode run` named as the one-line alternatives; A11). If the waiting
  session dies before claiming it, the server looks again 15 s later and starts the run (A8);
- else it waits in the inbox, and `reelplanning inbox`, run at session start, picks it up.

A review is claimed exactly once, by an exclusive-create claim file (A9), so pressing Finish twice
never starts two runs. `reel init` now writes `config.json` too (`scripts/reel.mjs`,
`templates/reelplanning/config.json`), and the endpoint is documented in `docs/hosted-review.md` §3.
**Deviation:** the hosted page's hook is only written down, not built. The plan says the hosted page
tells the session "through a hook the session registered when it published the page". Nothing in the
code registers or calls a hook. The skill tells the agent to register one "where the harness offers
one" and, failing that, to check the page's submitted rows at session start
(`skills/plan-to-video/SKILL.md`, "Running the loop (v9)", the "Hosted page" item). On the hosted page,
Finish reaches a session only if the agent did that by hand.

### Step 4 — Reviewing the system video changes the system ✅

`scripts/plan-map.mjs` now carries each frame's `specSection` and `components`, and marks the system
video with `kind: "system"` and a `reviewDir` (m23, m24). The committed
`.reelplanning/system-video/plan-map.json` has had those fields merged in (m41), so the video already
hosted can be reviewed today. `reel-intake` (`scripts/reel-intake.mjs`) accepts a review of the system
video, checked like a plan's (A12), files it under its own id as `system-video/reviews/<id>.json`, and runs the new
`reelplanning system-review` (`scripts/system-review.mjs`). That writes `system-video/reviews/<id>.md`, one per review, with `review.md` as their index (m52, after the code check): every
comment, mark, rewind and missed quick check, with its frame's spec section and parts, and a first
sort (A13). D-065 holds: `review.md` and the skill's new section "Reviewing the system video (v9)"
(`skills/plan-to-video/SKILL.md`) give the three outcomes. The video is wrong: fix the frame, no plan.
A small change inside one part: make it and show it in a short walkthrough (A14). Anything with a
choice or across parts: a plan first. In the player (`packages/player/reelplanning-player.js`), a
system video sends its review to its own folder with the right commands and wording (m30, m32, m44),
and a hosted row's `answer` is shown where the comment was made (m31). D-005 holds: rewinds and slow-downs are still sent without the reviewer doing anything, and on the system video they land on the frame's parts like a comment (m26, `scripts/system-review.mjs`). D-021 and D-024 are unchanged: a comment made inside a detail page (the side panel, fixed page types first) is listed under its frame with the detail's name.

### Step 5 — Prove it on real reviews 🟡

The GitHub Action is removed: `.github/workflows/reelplanning-revise.yml`, its template
`templates/reelplanning/.github/workflows/reelplanning-revise.yml`, and `reel init`'s install of it
(`scripts/reel.mjs`). `README.md`, `.reelplanning/README.md`, `templates/reelplanning/README.md` and
`docs/project-dir.md` now name `config.json` and `inbox/` instead. **Not done:** the proof. No real
review has gone from Finish through a real `claude -p` run, and Finish → notification has not been
timed, for this plan's walkthrough or for the system video. Some mentions of the old workflow are also
still there (see Deviations). **Since done** (see Code check, "Step 5"): a real system-video review went
from Finish through a headless `claude -p` run to the notification in 9 min 13 s; step 6 re-ran it.

### Step 6 — What a run nobody is watching may do ✅ (D-082)

The headless command in `.reelplanning/config.json` and `templates/reelplanning/config.json` is now
`claude --permission-mode auto --permission-prompts none --settings '{"sandbox":{"enabled":true,"failIfUnavailable":true,"allowUnsandboxedCommands":false}}' -p`:
a classifier approves each action (workers included), anything that would prompt is refused, shell
writes stay inside the repo, and no command runs outside the sandbox. The note names each agent's
equivalent, untested: `codex exec --sandbox workspace-write`; `opencode run --auto` with `permission`
rules (no OS sandbox). The first real run showed a sandboxed run cannot see or reach the review
server, so its closing `review --detach` started a second server and sent a dead link. Now the server
watches the run it started and tells the reviewer itself when it ends: ready, or stopped before it
finished, with the run's log (`scripts/review.mjs` `afterRun`, `scripts/lib/inbox.mjs` `startAgent`);
`review --detach` inside a headless run does nothing. **Evidence:** real runs from the review server in
throwaway worktrees. Auto mode is available on this account; a worker started and wrote a file; shell
writes outside the repo were refused (`Read-only file system`); a second real review went from Finish
to the notification in **12 min 20 s** (54 commands, a commit) with no permission denied.
`scripts/test/loop.spec.mjs` checks the command's parse and both endings. **Limits** (Deviations, Not
done): the sandbox fences the shell, not the file tools (fenced by a hook since the review, below);
strict mode leaves no working shell in this container (root); signed commits fail inside it; its
network was not tested here.

**After round 2's review.** *The file tools (k3):* you expected them kept inside the repo too, so they
are. The command's `--settings` now carries a `PreToolUse` hook on `Write|Edit|MultiEdit|NotebookEdit`:
a few lines of `node -e`, run with no shell, that refuse (exit 2, with the reason) any path outside
`$CLAUDE_PROJECT_DIR`, the repo the run starts in, symlinks resolved. It names no absolute path, so
the committed command works in any clone. A permission rule cannot do this: rules are checked deny,
then ask, then allow, so `Edit(//**)` in `deny` denies the repo too, and a `!` carve-out reaches only
relative rules. **Evidence**, real `claude -p` runs in a scratch git repo (the shipped command plus
`enableWeakerNestedSandbox`, as this container needs): the Write inside the repo and an Edit inside it
succeeded, `echo hi > shell.txt` worked, and the Writes to `/tmp/rp-k3-final-…/outside.txt`, to
`$HOME/rp-k3-final-….txt`, and one a subagent tried to `$HOME`, were refused with `Refused: … is outside
the repo (…)`; nothing was written outside. The same prompt without the hook wrote both outside files;
with `deny: Edit(//**)` plus `allow: Edit(/**)`, all four writes were refused, the repo's included.
`scripts/test/loop.spec.mjs` feeds the hook inside, outside, above-the-repo and symlinked paths and a
call it cannot read (refused). *No sandbox, no run (A18):* now said, in the README and when the server
starts (calls table). *Other agents:* the server probes only a command that turns Claude Code's sandbox
on through `--settings`; a `codex exec` or `opencode run` command starts as it is, never held back
(`loop.spec`, "other agents"); the headless prompt names no Claude-only tool, and its `git commit`
sentence is harmless elsewhere. `docs/reference.md` has a new section, "Other agents": what works for
any agent (the local page, the inbox, the server starting `agent.command`, the notifications, every
`reelplanning` command) and what is Claude Code's alone (the hosted page, auto mode, the sandbox
settings, the probe and the file-tools hook). *Codex's flag (D2):* unchanged, as you said.

### Step 7 — More quick checks, and a wrong answer is a comment ✅ (D-083)

The style guide's quick-check section (`skills/plan-to-video/references/style-guide.md` §7) now asks
for at least one per step or walkthrough part, plus more wherever there is something to predict, each
asking the viewer to predict what the plan or the code will do, its wrong options what a reasonable
reviewer might expect instead. The "Expected something else?" note after an answer (built in round 1's
review, `c22e643`) reaches the agent as a comment on that step: in the review's `reviews/<id>.md`, and
as a fix in a walkthrough. Not yet exercised on a real plan: round 2's own walkthrough video is the
first built under it.

### Step 8 — Stop only for the calls you might overturn ✅ (D-084)

A call row carries tags at the end of its "chose" cell: `[visible, hard-to-undo, deviation, close]`;
`D` rows are deviations (`scripts/lib/autonomy.mjs`). `reel record` now keeps every verdict in the
ledger, a flagged or own-words call with status `flagged`/`own`, its tags and the reviewer's words.
`reel stops <plan-dir>` applies the rule: a deviation always stops, an untagged call never does, a
tagged one stops unless each of its tags has been accepted ten times running across plans, and one
flag resets that. Calls that do not stop share one beat per part (`- autonomy_group:`), which the
player shows as one sheet: each call flaggable on its own, **A** accepts the rest
(`packages/player/reelplanning-player.js` `askGroup`, `acceptGroup`, `flagInGroup`). **Evidence:**
`packages/player/test/group.spec.mjs`; `scripts/test/lifecycle.spec.mjs` (tags parsed, verdicts kept,
the streak flipping at ten and back after a flag). **After round 2's review:** you missed quick check
k6 (on the grouped sheet, a flagged call stays flagged when you press Accept all: **A** accepts only the
calls not flagged). The code is right; the walkthrough video's beats for this step will say it more
plainly.

### Step 9 — Less scaffolding ✅ (D-085)

The mechanics (`1d39e9b`): `reel check` reads `### Step N` with any dash or a colon, stops asking a
plan to cite its own decisions, and drops the heading and phrasing warnings; each plan's hand-ticked
README goes and `reel status` shows the stage; `reelplanning build <video-dir>` runs narration to
`verify` in one command; each review is filed once as `<plan-dir>/reviews/<kind>-<time>.json` with a
short `<id>.md` of what to act on, never overwritten, replacing the resolved copies, `annotations.json`
and the scope files (`migrate-reviews` filed 16 reviews across six plans, the overwritten rounds
recovered from git). This plan's folder went from 13 entries to 6. The text (`2eabf33`): SKILL.md from
4,926 to 2,488 words, the style guide from 7,223 to 3,258; format rules became goals; history moved to
`docs/design-notes.md`; the section that described only this repo moved to `CLAUDE.md` (with an
`AGENTS.md` pointer); detail kinds are free-form and the plan-text template is gone. **Evidence:** the
full `npm test` list passes; new `scripts/test/build.spec.mjs` and `scripts/test/reviews.spec.mjs`.
**After round 2's review:** A29 is answered in the calls table (both work; no change). You missed quick
check k7 (a second review of the same plan goes beside the first, in its own file, never over it); the
code is right, and the walkthrough video's beats for this step will say it more plainly.

### Step 10 — Prove it on the next plan ⏳

Not yet: it is the next plan through the loop (the Bob Dylan site example, redone from scratch).

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
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
| A18 | 6 | `failIfUnavailable: true`: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all (**after review:** kept, and now said where people look: a README note, "Unattended runs need Claude Code's sandbox" (macOS, or Linux with bubblewrap and socat; not native Windows or a root container; otherwise reviews wait for the next session), and one line when `reelplanning review` or `--detach` starts the server, "unattended runs are off on this machine: …", which the local page's Finish panel repeats) (**changed after review:** you answered "auto run, just note that with others we do not have sandbox so less safe; err on the side of doing more". Where the probe fails, the run now starts anyway with the sandbox off in its `--settings` (`{"enabled":false,"failIfUnavailable":false}`), auto mode, `--permission-prompts none` and the file-tool hook kept; the server's start line, one notification and the Finish panel say it ran without the sandbox, that shell commands aren't fenced to the repo and file writes still are; `docs/reference.md` "Other agents" says Codex and opencode get no sandbox here, so are less safe) [visible, hard-to-undo, close] | the default, which runs unsandboxed with a warning | D-082 chose the fence; no run should go unfenced quietly | `.reelplanning/config.json` |
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
| A29 | 9 | `CLAUDE.md` also tells an agent here to run this checkout's tooling rather than the published `$RP` (**after review:** yes, it is local vs npx, and both work. Outside this repo the skill runs the published package (`npx -y reelplanning@<version>`); inside it, an agent runs this checkout's own tools, so a plan here is built with the code it changes. No change) [close] | moving only the autonomous-mode section | a plan here should be built with the code it changes | `CLAUDE.md` |
| A30 | 9 | `detail_kind` is free-form and `detail new --kind <anything>` starts from the blank page; `--step` is gone [visible] | a closed list of seven kinds | the kinds were a starting point, not a rule | `scripts/check-details.mjs`, `scripts/detail.mjs` |
| D2 | 6 | Codex's equivalent is `codex exec --sandbox workspace-write`, not the plan's `codex exec --full-auto` (**after review:** no change. Codex has its own approval and sandbox modes, like auto mode; which one an unattended run uses is left for when a Codex agent works on this, as `docs/reference.md` "Other agents" now says) | the plan's flag | `--full-auto` is deprecated and prints a warning | `.reelplanning/config.json` note |
| D3 | 6 | No list of allowed hosts: in auto mode the classifier reviews each host a command names | the plan's "network to named hosts" | a list needs upkeep; untested here, the sandbox had no network in this container | `.reelplanning/config.json` |
| A31 | 9 | Two details on one beat warn instead of failing the build; the last one opens [visible, close] | failing the build | a second detail is a slip, not a broken page; the warning names it | `scripts/check-details.mjs` |
| A32 | 9 | `detail new` with no `--kind` starts from the blank page (`fresh`) [close] | requiring a template | kinds are free-form now; the guide still says start from a template when one fits (D-024) | `scripts/detail.mjs` |

### Smaller calls (logged, not beaten in the video)

| # | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
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

## Decided by the owner during round 2's build

Step 6's proof found three limits; the owner decided each (2026-09-24):

1. **The file tools outside the repo** stay with the auto-mode classifier; the sandbox fences the shell only.
   **Changed after round 2's review** (your answer to k3): a hook in the command now refuses them
   outside the repo (Step 6).
2. **Signed commits:** `git commit` runs outside the sandbox, so a run's commits stay signed; the
   classifier still reviews it. **Built:** `"excludedCommands": ["git commit *"]` in both config files
   (a bare `"git commit"` matches only a commit with no arguments: a real run's `git commit -m …` failed
   with it and went through with the `*`). A commit leaves the sandbox only as a call of its own (no
   `&&`, `cd`, `$(…)` or heredoc), so the headless prompt now says to commit that way
   (`scripts/lib/inbox.mjs` `agentPrompt`). Everything else stays sandboxed.
3. **A machine where the strict sandbox cannot start** (a root container): the review server checks
   before it starts a run; if the sandbox cannot work, it starts nothing, tells the reviewer why and
   names the weaker setting, and the review waits for the next session. **Built:**
   `scripts/lib/sandbox.mjs` runs `true` under bubblewrap with the flags Claude Code's sandbox uses
   (and `sandbox-exec` on macOS), about 25 ms, no model call, once per server; `startAgent` checks it
   before claiming a review, and the Finish panel then says the review will wait. On this container it
   reports `unshare: write failed /proc/self/uid_map: Operation not permitted`, so here a review now
   waits for a session rather than starting a run with no shell. The probe copies Claude Code's flags,
   which a later version could change. `scripts/test/loop.spec.mjs` covers both.
   (**changed after review:** your answer to A18, "we want to err on the side of doing more instead of
   safety": where the probe fails, the run now goes ahead without the sandbox. `startAgent` runs the
   command through `withoutSandbox` (`scripts/lib/sandbox.mjs`), which sets `sandbox` in its `--settings`
   to `{"enabled":false,"failIfUnavailable":false}` and keeps auto mode, `--permission-prompts none` and
   the file-tool hook; the server says so once when it starts, notifies the reviewer once at the first
   such run ("running without Claude Code's sandbox: this machine can't run it (…); shell commands aren't
   fenced to the repo, file writes still are (the hook)"), and `GET /api/review` carries `unsandboxed`
   for the Finish panel in place of `unattendedOff`. Checked here with a real `claude -p`: the command
   started in this root container and its shell ran. Codex and opencode, which never had our probe, are
   noted in `docs/reference.md` "Other agents" as having no sandbox here, so less safe.)

## Not in the plan (asked for during the review)

**"Play just the changes" is the default after a rebuild, with one toggle for the whole video.** The
owner asked for it while reviewing. The player (`packages/player/reelplanning-player.js`) opens a
revised build in "just the changes" unless the reviewer already sent a review of that same build
(A16). One button switches modes and plays at once, and a line beside it says which mode is in force
(m35, m36). A seek to an unchanged beat plays it, and only playing through one skips it (m37). The
video pauses past the last change without leaving the mode (m38). The poster says how long the
changes run (m39), and the choice is remembered only for the build it was made on (m40).
`packages/player/test/changes.spec.mjs` covers it.

**Approve vs request changes, made explicit** (asked for in round 2's review). Approving a plan with
comments means the comments become instructions for the implementation: they are folded into
`plan.md`'s steps as text, and the plan video is not rebuilt or shown again. Requesting changes means
the plan is revised, the touched beats rebuilt, and the video shown again, where the reviewer can
comment and approve or ask again. The same for a walkthrough: accepted with comments, the fixes are
made and logged with no new video; changes requested, they are made, the touched beats rebuilt, and it
is shown again. `skills/plan-to-video/SKILL.md` ("After a plan review"; "Implement, check, walk through,
fix" item 7) says so; each review's `reviews/<id>.md` opens with one line saying which
(`scripts/lib/review-scope.mjs` `verdictLine`), and so does `reel-intake`'s next step; the player's
Finish panel says it under each verdict in a few words (`packages/player/reelplanning-player.js`
`showHandoff`). Checked by `scripts/test/reviews.spec.mjs` and `packages/player/test/finish.spec.mjs`.

**What to act on, three errors fixed** (visible in round 2's review file). *Never judged:* it listed
A1–A16, which round 1's walkthrough review had judged; a call now counts as judged if any walkthrough
review of the plan judged it (or the ledger holds a verdict), and only calls this video asked are
listed. *Comments on several calls:* every note on step 6 rode with both A18 and D2; now a comment rides
with a call only when it was made on that call's beat (or quotes it, or, with no step, came right after
the verdict), and a comment on the step at large stays under the step. *False "reaches":* A29's "allow
both" matched D-005's option "Both"; words now reach a decision only when they name its id or carry
every distinctive word of one of its options (two at least). `scripts/lib/review-scope.mjs`
`walkthroughScope`, `reaches`; `scripts/test/reviews.spec.mjs` (A29 no longer escalates, "D-005" does).
Round 2's `reviews/walkthrough-20260924T071728Z.md` is rewritten with it.

## Code check

Run 2026-09-24 by a fresh agent from `code-check/brief.md`; findings in `code-check/findings.md`.
Steps 1, 2 and 4 carried; D-003, D-005, D-021, D-024, D-064 and D-065 hold. Each ✗:

- **Step 3**: two gaps. *The hosted page's hook:* right, and a **deviation**, not a bug: the skill
  instructs the agent to register one where the harness offers a hook (a Claude Code cloud session
  can register one), and there is no code, because the hook belongs to the environment, not the repo.
  *The server outliving the session:* right, **fixed**: `reelplanning review --detach` runs the server
  in its own process group, logs to `.reelplanning/inbox/server.log`, records it in
  `.reelplanning/inbox/.server.json` (pid, port, url) and prints the URL; a second `--detach` reuses
  it, and `--stop` stops it (`scripts/review.mjs`, m53). The skill's "Running the loop (v9)", Run
  item 5 and the quick flow now start the server detached and keep `review --wait` as the session's
  own background task (`skills/plan-to-video/SKILL.md`, m54). Checked by `scripts/test/loop.spec.mjs`
  ("--detach": it answers after the command exits, in its own process group; reused; stopped).
- **Step 5**: right, now **half done, half proven**. The system-video review was run for real, in a
  separate worktree with no session open: a review posted to a detached `review` server started
  `claude -p` once (`scripts/lib/inbox.mjs`), which sorted the comment ("the video is unclear"),
  reworded that one line, re-narrated 1 of 35 lines, passed `verify`, answered in the review's
  `reviews/<id>.md`, committed, and notified. **Finish to notification: 9 min 13 s** (narrate 33 s,
  retiming about 3.5 min by hand, finish-project 55 s, verify 77 s). It took two fixes, both made
  and tested (`scripts/test/loop.spec.mjs`): a bare `claude -p` is denied every edit and command, so
  `.reelplanning/config.json` and `templates/reelplanning/config.json` now name
  `claude --permission-mode acceptEdits --allowedTools Bash -p`; and the first run never verified or
  notified, so the prompt in `scripts/lib/inbox.mjs` and SKILL.md's "Started headless" now end with
  both. The second timed review is this walkthrough's own: the reviewer's Finish on it. The stale
  mentions of the removed Action in `.reelplanning/spec.md`, `glossary.md` and `system.json` follow
  after this walkthrough is accepted, per D-003.
- **D-066**: right, and **now held**: the one setting (`.reelplanning/config.json`) was run end to
  end with Claude Code, headless, on a real review (see Step 5). Codex and opencode remain untested,
  as D-066 chose.
- **`docs/hosted-review.md:89`**: right, **fixed**: §3 now says the Finish panel's **Send** POSTs the
  row (Finish itself sends nothing), that GET's answer is shown when Finish opens the panel, asked
  again each time, and that anything changed after a send is a new row (`docs/hosted-review.md` §3).
- **`scripts/rebuild-narration.sh:24`**: right, a bug, **fixed**: the script no longer reads the
  remembered voice or passes `--voice`, so `narrate`'s own order applies and a video keeps the voice
  it was made in (m49). A new check in `scripts/test/narrate.spec.mjs` runs the script with a `node`
  shim that answers the pref lookup with another voice: nothing is re-voiced.
- **`packages/player/reelplanning-player.js:862`**: right, a bug, **fixed**: any change since the last
  send (a comment, a mark, an answer, the verdict) offers "Send the change" and sends a new row
  (`reviewSig`, `postedBlock`; m50). New checks in `packages/player/test/local-review.spec.mjs`: a
  comment added after sending is offered, sent as a second row, and then nothing is offered.
- **`packages/player/reelplanning-player.js:1304`**: right, a bug, **fixed**: a question on the
  boundary of a skipped beat is passed over only while just the changes play and the playhead is
  outside its beat; it is no longer marked asked, so switching to the whole video asks it when reached
  (`jumpToChanged`, `passedOver`; m51). A new check in `packages/player/test/changes.spec.mjs` fails
  on the old code.
- **`scripts/system-review.mjs:142`**: right, a bug, **fixed**: one file per review,
  `system-video/reviews/<id>.json` and `reviews/<id>.md`, named by the review's id; `review.md`, the
  old name, is now the index pointing at each (m52; `scripts/system-review.mjs`,
  `scripts/reel-intake.mjs`, the skill's "Reviewing the system video (v9)"). New checks in
  `scripts/test/system-review.spec.mjs`: a second review right after is filed beside the first, whose
  answers survive; the same review taken in again keeps its answers; a shared id takes the next name.

### Round 2's code check

Run again on round 2 (`82b65aa..2395967`) by a fresh agent; `code-check/findings.md` now holds it.
Steps 1–4 and 7–9 carried, every decision holds (D-003, D-005, D-021, D-024, D-064, D-065, D-066,
D-082, D-083, D-084, D-085). Each ✗:

- **Step 5**: right, one of the two real reviews is still owed. The system video's review went through
  a headless run and was timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's
  walkthrough has not. A deviation, said plainly (Deviations); the next walkthrough review sent from the
  local page will be it. The spec text naming the removed Action is due under D-003 once this
  walkthrough is accepted.
- **Step 6**: right. The proof ran with `enableWeakerNestedSandbox`, which the shipped setting does not
  carry, because this container runs as root and the strict sandbox leaves such a run with no working
  shell. The command that ships is proved only as far as auto mode, the prompts refused and the
  server's notification; its strict sandbox is untested on a normal machine. A deviation (Deviations),
  and one of the three choices put to the owner.
- **Step 10**: right, not done: it is the next plan through the loop (⏳ above).
- **`scripts/check-details.mjs:40`**: a new call, now logged as A31 (two details on one beat warn instead
  of failing).
- **`scripts/detail.mjs:24`**: a new call, now logged as A32 (`detail new` with no kind starts blank).
- **`scripts/migrate-reviews.mjs:27`**: a bug, **fixed after the code check**: it now removes a plan
  folder's `README.md` only when it is the old stage checklist, and keeps one written by hand
  (`scripts/test/reviews.spec.mjs`, "a README written by hand is kept").

## Deviations from the plan or the decisions

- **Step 3: the hosted page's hook is documented, not built.** The plan says the hosted page tells the
  session through a hook registered when the page was published. No code registers or calls one; the
  skill (`skills/plan-to-video/SKILL.md`, "Running the loop (v9)") tells the agent to register one
  where its harness allows, and otherwise to check submitted rows at session start. Only the local
  page's path (review server, inbox, `--wait`, headless run) is built and tested.
  **After review** ("is this possible for others?"): no. The hosted page is a claude.ai artifact, and
  only a Claude session can read its store; Codex and opencode never see it. For them the local page
  is the way, and it works the same under every agent (the review server writes the inbox and starts
  their headless command). Claude Code itself has no inbound hook either (its hooks fire on its own
  events, and can send but not receive), so even for Claude "check the page's reviews at session
  start" is the dependable path; a harness that can watch an artifact (as this cloud session can) is a
  bonus. The deviation stands, and the skill already says so.
- **Step 3: Finish said what happens next only after it was pressed.** **Fixed.** On a page served
  by the review server, Finish now opens the panel with one quiet line from `GET /api/review`, asked
  again each time the panel opens: "Your open session picks this up." / "No session is open:
  `claude -p` starts on it." / "Saved for your next session." The review goes when the reviewer
  presses the panel's Send (m45, m46). The hosted page is unchanged.
  `packages/player/reelplanning-player.js` `refreshLocal`, `localNext`, `localBlock`; checked by
  `packages/player/test/local-review.spec.mjs` ("before sending, the Finish panel says what will
  happen", "reopened, it asks again").
- **Step 5: the old workflow was still mentioned.** **Fixed** where the code and the docs said it:
  `scripts/reel-intake.mjs`'s next steps now say whoever ran intake (the main session, or the run the
  review server started) revises or fixes, and that a push starts nothing; the skill's Revise item 5
  (`skills/plan-to-video/SKILL.md`); the comment in `handoffSteps` and the "Do it yourself" line in
  `showHandoff`, which said "the push is what starts the revise"
  (`packages/player/reelplanning-player.js`); `docs/status.md` (the Action is removed, narration is
  cached per line, the loop runs through the review server and sessions, and the real `claude -p`
  proof is not done). Still due, under D-003, after this walkthrough is accepted:
  `.reelplanning/spec.md`, `system.json` and `glossary.md` list "The push-triggered workflow" as a
  part, and the system video narrates it (frames 9 and 16).
- **Step 4: the system video's plan map was edited by hand** (merged, m41), not rebuilt by
  `finish-project`.
- **The build rules:** 60 calls, far past a dozen; the plan left too much open.
- **Round 2, step 5's second proof:** a plan walkthrough's review has not been through a headless run;
  only the system video's has (code check).
- **Round 2, step 6's proof ran on a weaker sandbox than ships** (`enableWeakerNestedSandbox`, needed
  in this root container); the strict setting that ships is untested on a normal machine.
- **Round 2, D2 and D3** (the Codex flag, no list of allowed hosts): in the calls table.

## Evidence

- One edited line of the system video (a scratch copy, m12): `narrate` voiced 1 line and kept 34
  byte for byte, in 32 s. All 35 lines took 675 s. The kept audio was byte-identical.
- Worker B's real run: a curl POST to a running `reelplanning review` woke a background
  `reelplanning review --wait`, which claimed the review and printed its path; posting it again
  started no second run.
- Worker C's real run: a comment on frame 8 of the system video ("I can't tell what plan-diff does
  here, next to finish-project") went through `reel-intake` into `.reelplanning/system-video/review.md`
  with that frame's spec section (Parts) and its four parts (skill, finish-project, plan-diff, the
  review player), sorted as "video".
- Tests, run again for this walkthrough, all pass: `scripts/test/narrate.spec.mjs` (29 checks: kept
  lines byte-identical, an insert, a delete, a failed TTS run, a wav changed behind its back, a new
  voice or speed, adoption from git), `scripts/test/loop.spec.mjs` (32: the inbox, claims, heartbeats,
  the endpoint's guards, the re-check starting one run), `scripts/test/system-review.spec.mjs` (19:
  the sort, intake's two spellings and its refusals), `packages/player/test/local-review.spec.mjs` and
  `packages/player/test/changes.spec.mjs` (the local POST, and the changes-first default and toggle).
  All are in `npm test` (`package.json`); the full suite was not re-run for this walkthrough.

## Not done / not tested

- `retime-frames` does not recognise the frames' `pop`/`fade` helpers and falls back to scaling the whole
  line when its word count changes; in the proof, retiming took about 3.5 of the 9 minutes, mostly by hand.

- **Step 5's proof** is done (a system-video review, 9 min 13 s), and step 6 re-ran it on the new
  command (12 min 20 s). A plan walkthrough's review has not been through a headless run.
- **The sandbox (step 6).** It fences shell commands, not the file tools: asked to, a run wrote a file
  outside the repo with Write, and wrote into the main checkout instead of its worktree. **Since
  round 2's review** a hook refuses the file tools outside the repo (Step 6); it covers Claude Code's
  own file tools, not an MCP server that writes files. In this container, which runs as root, the strict sandbox leaves the
  run with no working shell (`uid_map: Operation not permitted`) and `failIfUnavailable` does not catch
  it; the proof used `enableWeakerNestedSandbox`, not shipped. The strict setting is untested on a
  normal macOS or Linux machine. Signed commits through a local agent fail inside it. Its network was
  not tested (this container has no IPv6 for its relay).
- **The headless run uses the published CLI** (`npx -y reelplanning@0.1.0`), older than this code,
  until the next publish.
- **Round 2 on real plans:** the new quick-check rule, the stop rule and the grouped beat have their
  specs, not yet a real plan (step 10).
- **The system record (D-003):** `.reelplanning/spec.md`, `system.json` and `glossary.md` still name
  the push-triggered workflow, `plan.resolved.md` and `resolve-plan`/`resolve-walkthrough`; they and
  the system video's frames are updated once this walkthrough is accepted.
- **The review server stops when its session ends.** **Fixed after the code check:** the skill now
  starts it with `review --detach`, a process of its own that outlives the session (m53, m54). Not
  yet tried across a real closed laptop: `loop.spec` shows it answering after the command that
  started it has exited, in its own process group.
- **The hosted page's hook** (see Deviations): not built, not tried.
- **Windows:** the headless command is spawned through `cmd.exe` without re-quoting the prompt (m21),
  and the PowerShell notification has never run. The macOS notification has never run either; only
  Linux's `notify-send` path and the `REELPLANNING_NOTIFY_CMD` stub were exercised.
- **Codex and opencode:** named in `config.json`, not run (as D-066 says). The loop's non-Claude
  paths are checked with a stand-in `codex` command only (`loop.spec`, "other agents");
  `docs/reference.md` "Other agents" says what works for any agent.
- **`retime-frames` after `narrate`:** on the system video, `reelplanning retime-frames` needed
  `--ignore pop` (from worker A). The skill's Revise item 3 now names `retime-frames` but not
  that flag.
- **The repo's own system video has no `narration.json` yet.** Its first `narrate` adopts from git
  (a dry run keeps all 35 lines); that has not been done for real in the repo.
- **Answers on the local page:** a system-video comment made on the local page is answered only in
  `review.md`; the page does not show it (m31).
- **The code check** has not run.
