# Code check brief: 2026-09-25-fewer-better-stops

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-25-fewer-better-stops/code-check/findings.md`.

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
# Code check: 2026-09-25-fewer-better-stops

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

## Commits (c2f7fd2..ce41f97acefa3c7b5724e6b3ec136ccae792a653, limited to .reelplanning/plans/2026-09-25-fewer-better-stops/plan.md .reelplanning/plans/2026-09-25-fewer-better-stops/walkthrough.md scripts/lib/autonomy.mjs scripts/reel.mjs scripts/plan-map.mjs scripts/bundle-player.mjs scripts/lib/notify.mjs packages/player/reelplanning-player.js packages/player/test/band.spec.mjs packages/player/test/stop.spec.mjs packages/player/test/answer-on-frame.spec.mjs packages/player/test/fixtures/l2-autonomy-stop.json scripts/test/lifecycle.spec.mjs scripts/test/memory.spec.mjs scripts/test/loop.spec.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md docs/project-dir.md package.json)

```
ce41f97 snapshot of the working tree for the fewer-better-stops code check (no branch)
7e5bd45 Memory A15 after review: an unwritable home keeps the summary in the repo until it can move in
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-25-fewer-better-stops/plan.md` in full. Its title is "The right calls stop, and the walkthrough stays short", with 3 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-108** (step 2) Where do the answers the frame can't take go? → **i like the pricnicple of A, not messing w video, but we probably need it to be bigger. if we can design videos in a way where this bar is larger and more graceful in the video that might be best?**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | `reel stops` prints the beats as the storyboard lines to write, by step (`- autonomy: a5, a6, a8`, then each deviation's `- autonomy: d1`, then the step's grouped calls), and counts the pauses for what stops as stop beats plus deviations, leaving the grouped beats out because they fall once per part, not per step | a table of calls per beat; or a count that adds the grouped beats | the storyboard writer copies the line as it is; counted this way the plan's own numbers come out (23 pauses become 5, 14 become 6) | scripts/reel.mjs `stops`, scripts/lib/autonomy.mjs `beatsByStep` |
| A2 | 1 | A stop beat of several calls is carried in `plan-map.json` as an `autonomyGroups` entry with `stop: true` (id `stop-<frame>`); a beat with one id stays an `autonomy` entry, as before [close] | a new `autonomyStops` list | the record, the timeline, the review's export, `walkthrough-scope` and the review page's count already read a group's calls one by one; a new list would have to be taught to each | scripts/plan-map.mjs, scripts/lib/review-scope.mjs (unchanged) |
| A3 | 2 | `reel stops` names the rule in its words, as before: "a deviation always stops", "tag close: 3 of 10 accepted in a row" (a streak short of ten), "a miss: … (tag close)", "no tag"; `stopFor` also returns it as `rule` [close] | a column naming the rule by a label | the words already tell the rules apart, and the specs and the skill read them | scripts/lib/autonomy.mjs `stopFor`, scripts/reel.mjs `stops` |
| A4 | 1 | On a stop beat each call's row has "Own words" beside its Accept and Flag, as a call's own beat has "Answer in my own words": the band's own box opens for that call, and the words are its verdict, a change the agent makes [visible, close] | Accept and Flag only, as the plan's words say ("each with its own Accept and Flag") | a call on its own beat offers own words today, and 7 calls so far were answered that way; a shared beat without it would take that away | packages/player/reelplanning-player.js `stopRows`, `openOwnFor`, `answerOwn` |
| A5 | 1 | The keys on a stop beat: A accepts and B flags the first call still waiting, O opens own words for it; that row carries the key caps. The video goes on at the last verdict, at once | A and B acting on a call picked first with the arrow keys; or a countdown after the last verdict | the reviewer can go down the list with A and B alone; a call's own beat goes on at once after its verdict too | packages/player/reelplanning-player.js `onKey`, `stopWaiting`, `judgeInStop` |
| D1 | 2 | Memory's call A12 is not rewritten: its row stays as it is, and its ledger entry (D-122, "a miss with no tags stops calls on its component") stays active though D-109 now says otherwise [deviation] | changing A12's row before its review, as the plan says | memory's walkthrough has been reviewed since this plan was written (A12 accepted, as D-122), and its `walkthrough.md` is another worker's; D-122 is superseded by D-109 when the owner says so (by hand in the ledger, or a `## Supersedes` line in a plan) | .reelplanning/decisions.json (D-122, D-109) |
| A6 | band | The words stay on the kicker's line while they fit it unwrapped, and the band keeps the reserved eighth; when they do not fit, they take a line of their own under the kicker and "Show the frame", wrapping, and the band grows up over the frame; a stop beat's list and a phone always take the second layout [visible] | the words always on a line of their own (the band then always taller than the eighth) | the owner asked to keep the eighth for the short case; whether the words fit is measured, not guessed from their length | packages/player/reelplanning-player.js `fitBand`, `.decision.band.tall` |
| A7 | band | The cap is 40% of the frame's height, in the frame and under it (under it, 22.5% of the room's width, the frame being 16:9); on a phone, where the band is in the page's flow under the frame, 45% of the screen's height. Past it the band keeps an answered check's verdict ("Right.", "Not quite — it is B.") and says "… too long to show here. Read it in full"; the side panel shows the words, the band stays up beside it, and an answered one's countdown stops while it is open [visible, close] | the words opening in the panel by themselves; the question folding while the panel is open, as for a detail | the owner named about 40%; on a phone the frame is 219 px high, so 40% of it would hold two lines; a panel that opens by itself takes the page from under the reviewer, and folding an answered question drops it | packages/player/reelplanning-player.js `fitBand`, `readBand`, `detailUrl`, `openDetail` |
| A8 | band | A stop beat's list: one row per call, its id in mono, what it chose then "— instead of …" in grey, its Accept, Flag and Own words at the right (under the words when the band is under 760 px wide). Past the cap the rows close up to each call's id and its buttons, several to a line; on a phone, one row per call, all shown, the page scrolling (8 calls: 670 px) [visible, close] | a list of ids with the words in each button's tooltip, as the grouped beat has | the plan says the band lists what each chose and instead of what; a tooltip is what the owner asked to be rid of; on a phone 24 buttons 44 px high do not fit 45% of the screen | packages/player/reelplanning-player.js `stopRows`, `.decision.band .crow` |
| A9 | band | A note field (a choice's note, a quick check's "Expected something else?") is as wide as its words, measured, so it moves to a line of its own rather than cutting them; in use (focused, or holding words) it takes a full row after the controls. Own words take a full row too, and their box grows with the words [visible] | a fixed width that shrinks with the line (what cut "Say how it should work — Ent") | the owner's screenshot; a row of its own only while in use keeps the short case within the eighth | packages/player/reelplanning-player.js `fitBand`, `.decision.band :is(.note,.disagree.on)` |
| m1 | 1 | A beat with one id takes what it does not say (`- chose:`, `- instead_of:`, `- why:`, `- check:`) from its row in `walkthrough.md` | only the beat's own lines | the skill's tag table now says a call's words are its row | scripts/plan-map.mjs |
| m2 | 3 | The count takes calls and deviations (not the smaller `m` rows); on a tie the busiest step is the lowest-numbered | counting the smaller rows too | the owner's quick check counts memory's 16 (15 calls and D1) | scripts/lib/autonomy.mjs `callLoad` |
| m3 | 1 | A stop beat met again with every verdict given shows what was given ("You accepted 2, flagged 1."); each can still be changed there, and Continue goes on, as the grouped beat does | closing it at once | the same as the grouped beat met again | packages/player/reelplanning-player.js `askStop`, `stopDone` |
| m4 | 1 | The review page's to-do line for a walkthrough with stop beats says "a step's calls together: accept or flag each" | the old line, "at each of the n calls … the video stops" | it is no longer true of such a video | scripts/bundle-player.mjs |
| m5 | band | In the band the note's placeholder is "Add a note" (was "A note on your answer"), the sheet's is unchanged | the longer words | measured to its words, the field fits the controls' line at 1024 px with the shorter ones | packages/player/reelplanning-player.js `placeCard` |
| m6 | band | Reading the band's words in full is not logged as a detail opened | logging it as one | it is the band's own words, not a page the video points to (D-005 sends what the reviewer opened) | packages/player/reelplanning-player.js `endDetail`, `detailsLog` |
| m7 | 1 | The notification's line ("5 calls to accept or flag") counts a stop beat's calls and a grouped beat's one by one | counting the beats with one id only, as it did (it already missed grouped calls) | most calls are on stop beats now; the line would have said "1 call" for memory's walkthrough | scripts/lib/notify.mjs `waitingLine` |

## The diff

Read it yourself: `git diff c2f7fd2..ce41f97acefa3c7b5724e6b3ec136ccae792a653 -- .reelplanning/plans/2026-09-25-fewer-better-stops/plan.md .reelplanning/plans/2026-09-25-fewer-better-stops/walkthrough.md scripts/lib/autonomy.mjs scripts/reel.mjs scripts/plan-map.mjs scripts/bundle-player.mjs scripts/lib/notify.mjs packages/player/reelplanning-player.js packages/player/test/band.spec.mjs packages/player/test/stop.spec.mjs packages/player/test/answer-on-frame.spec.mjs packages/player/test/fixtures/l2-autonomy-stop.json scripts/test/lifecycle.spec.mjs scripts/test/memory.spec.mjs scripts/test/loop.spec.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md docs/project-dir.md package.json` (from the repository root). The files it touches:

```
.../plans/2026-09-25-fewer-better-stops/plan.md    |  55 +-
 .../2026-09-25-fewer-better-stops/walkthrough.md   | 133 ++++
 docs/project-dir.md                                |   8 +-
 package.json                                       |   2 +-
 packages/player/reelplanning-player.js             | 573 ++++++++++++++--
 packages/player/test/answer-on-frame.spec.mjs      |   9 +-
 packages/player/test/band.spec.mjs                 | 234 +++++++
 .../player/test/fixtures/l2-autonomy-stop.json     | 758 +++++++++++++++++++++
 packages/player/test/stop.spec.mjs                 |  99 +++
 scripts/bundle-player.mjs                          |  11 +-
 scripts/lib/autonomy.mjs                           |  53 +-
 scripts/lib/notify.mjs                             |   4 +-
 scripts/plan-map.mjs                               |  28 +-
 scripts/reel.mjs                                   |  66 +-
 scripts/test/lifecycle.spec.mjs                    |  12 +
 scripts/test/loop.spec.mjs                         |   1 +
 scripts/test/memory.spec.mjs                       |  40 +-
 skills/plan-to-video/SKILL.md                      |  30 +-
 skills/plan-to-video/references/style-guide.md     |  58 +-
 19 files changed, 2025 insertions(+), 149 deletions(-)
```
