# Code check brief: 2026-09-22-richer-review

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-22-richer-review/code-check/findings.md`.

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
# Code check: 2026-09-22-richer-review

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

## Commits (66423a3..0731c20)

```
0731c20 Richer review, player side: part bar, answer keys, notes on any answer, sound
4711ac8 Status: richer review, script side built, player side in progress
84dc7d8 Richer review, script side: options a–d, pick-all, notes on answers, watch signals, density
```

## The plan, as approved

# Richer review: more kinds of question, comments on marks, diagrams a newcomer can follow

## The problem

The first real review of a reelplanning video (the close-the-lifecycle plan, 2026-09-22) found
limits in the review format itself, not in that plan:

- **Every question has two options.** Real choices sometimes have three or four, and some are "pick
  all that apply". The player only knows "pick one of two".
- **Every plan seems to have three questions.** Nothing requires it, but the videos so far all
  landed there, so it reads as a rule. The number of questions should follow the plan.
- **A mark has no words.** You draw on the frame, then go to the comment box and type what you
  meant. The drawing and its meaning end up in two places.
- **The diagrams got too dense.** The resolved-plan frame showed the whole pipeline at once, and
  the reviewer could not follow it. A video that the viewer cannot follow is no better than text.
- **The review asks only what text could ask.** A video knows where you paused, rewound or slowed
  down. None of that reaches the agent.

## Steps

### Step 1 — Questions with up to four options

A decision beat can carry two, three or four options: `- option_a:` to `- option_d:` in the
storyboard, each with its `why_`, and one branch beat per option. The player lays the option cards
out in a grid that fits four without shrinking the text. `plan-map.json`, `resolve-plan` and the
ledger already store options as a list; they are checked with four. The style guide says when a
third or fourth option earns its place: when it is a real alternative someone would argue for,
not a variation of another option.

### Step 2 — Pick-all-that-apply questions

A decision beat can be `- kind: multi`: the reviewer ticks any number of options and confirms. The
ledger records the set; `resolve-plan` lists every picked option under its step. How the video
plays after a multi-select answer is the open question below.

### Step 3 — As many questions as the plan needs

The style guide drops its implicit "about three". A plan asks every question it genuinely leaves
open. The budget moves from the whole video to the part: at most one decision per part of about a
minute, so a plan with five open questions becomes five parts, not a crammed three. `reel check`
warns when a plan has more than six open questions, because a plan that open is not ready to review.

### Step 4 — Type on the mark

When you finish a mark (a freehand stroke, an arrow or a box), a small text box opens right beside
it on the video, and the video stays paused. Type and press Enter: the words are saved as that
mark's comment, anchored to the same moment and plan step. Escape leaves the mark without words,
as today. The comment appears in the record under the mark, as now.

### Step 5 — Diagrams a newcomer can follow

The stage gets a density rule, enforced by the frame lint rather than just asked for: at most six
parts on screen at once, one new thing per beat, and every part named in words a newcomer knows (its
glossary line, not its script name). The resolved-plan ending shows the steps and the choices, not
the whole pipeline; the full diagram stays in the system video, where there is time to build it up.
The design critique loop gains a check: can someone new to the repo say what each box on screen
does?

### Step 6 — Feedback only a video can give

The player already records where you paused, rewound and changed speed. The review sends a summary
of that to the agent: the moments you went back to or slowed down on are marked in the resolved plan
as "hard to follow here", attached to their step. Those moments are signals, not comments, and the
agent treats them as prompts to explain a step more plainly.

## Components touched

- **The review player** — option grids, multi-select, the text box on a mark, the watch summary
- **The plan-to-video skill** — the style guide's question rules and density rule
- **resolve-plan** — multi-select answers, "hard to follow here" moments
- **The reel CLI** — `check` warns past six open questions

## Open questions for the reviewer

1. **After a pick-all-that-apply answer, what does the video play?** (step 2)
- **A · Every picked option's branch, one after another.** You see the consequence of each
  pick. Costs watch time that grows with every tick.
- **B · One summary frame of the picks, then on.** ← **chosen** Short and always the same length. Costs seeing
  what each pick means in the plan.
- **C · Multi-select only on questions that have no branches.** Simplest to build and to watch.
  Costs the richer questions that need branches.
I recommend B: a pick-all answer is usually about scope, and a list of what is in scope is what
the reviewer needs to see.

2. **Which video-only feedback comes first?** (step 6)
- **A · The rewind and slow-down moments, sent automatically.** ← **chosen** No extra effort from the reviewer.
  Costs precision: a rewind can mean "interesting" as well as "lost me".
- **B · A one-tap "lost me here" button.** Clear intent. Costs a button the reviewer has to remember
  to press (the old "Wait, what?" button was dropped for being unused).
- **C · Both.** The most signal. Costs the most to build and to read.
I recommend A: it asks nothing of the reviewer, and step 6 already treats the moments as prompts,
not verdicts.

## Not in this plan

Voice notes as comments. Several reviewers on one video. Anything in the close-the-lifecycle plan
(implementing, walkthroughs, the system video).

## Decisions (from the video review)

- **Q1** (step 2): **One summary frame** (the recommended option)
- **Q2** (step 6): **Automatic rewinds** (the recommended option)

## Review annotations

### step 23
- approve at 215.39s (The plan, resolved)

**Status:** approved by the reviewer · watched 100% · exported 2026-09-23T00:19:27.802Z

## The decisions that apply

- **D-004** (step 2) After a pick-all-that-apply answer, what does the video play? → **One summary frame**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | resolve-plan finds an option by its letter within question N's block when the label differs | matching the exact label only | "← chosen" never matched real plans, which write `A · Label` | `scripts/resolve-plan.mjs` |
| A2 | 2 | a pick-all question has no branch beats at all; `plan-map` skips straight to its summary | allowing branches on a pick-all question | D-004 is one summary frame whatever is picked | `scripts/plan-map.mjs` |
| A3 | 2 | a pick-all answer is one ledger entry, with `chosen` as the joined labels and `chosenIds` as the set | one entry per pick | the question was asked once, and `reel check`'s re-ask guard compares questions | `scripts/reel.mjs` `record` |
| A4 | 6 | "hard to follow" moments are listed by step, with times | listed in time order, or merged into the step comments | the revise works step by step; a moment is a signal, not a comment | `scripts/resolve-plan.mjs` |
| A5 | 5 | density is counted statically, as distinct `data-plan-component` values on the frame (not counting "page"), with a `data-density="full"` opt-out | counting what is visible at each moment in the browser | the lint is cheap and runs per frame as it lands; a whole-system beat can say so | `scripts/frame-lint.mjs` rule 4b |
| A6 | — | a note on an answer sends its step to the revise, like a comment | notes as record-only | a note usually qualifies the answer ("only until accounts exist"), which the plan must then say | `scripts/revise-scope.mjs` `answer-note` |
| A7 | 1 | 4 options go 2×2, and 4-across only when the stage is at least 1200px | 4-across at 1440 | four ~240px cards wrap each reason onto 4–5 lines | player `.opts[data-n]` |
| A8 | 2 | `data-plan-picks`: a `<ul>`/`<ol>` gets one `<li>` per pick, and any other element gets the labels joined with ", " | a template convention per item | the simplest rule a frame author can rely on; style guide §19 says it | player `applyPicks()` |
| A9 | 2 | on replay, an answer with no branch of its own (pick-all, own words, a branchless option) skips from the question to its summary or `resumeAt` | routing only pick-one answers with branches | a 4-option question may have options without branches; this also stopped own-words answers replaying every branch | player `tickDecisions` |
| A10 | 4 | clicking away or starting another mark keeps the words typed; only Escape discards (**changed after review:** Escape keeps them too; a × discards) | blur discards | clicking away should not lose words | player `openMarkBox`, `closeMarkBox` |
| A11 | 6 | a rewind is a scrub, P, Shift+← or a part marker going back more than 2 s; jumps from the record (step rows, comment times, "change") are not | every backwards seek | those are navigation, not "lost me here" | player `noteRewind` callers |
| A12 | 6 | speed changes within 3 s merge into one "slow" moment, and only a lower speed below 1× counts | one moment per change below 1× | speeding back up is not a signal | player `noteSlow` |
| A13 | — | a note alone still offers Approve when the review is finished | treating a note like a comment | a note clarifies an answer; it is not a change request | player `hasWords()` |
| A14 | — | notes only on plan questions, not on quick checks or Accept/Flag of the agent's calls | a note on every beat | the review data defines `note` on decisions only | player `askDecision` |
| A15 | — | the old mute setting (`rp:muted`) is ignored, and mute is now stored as `rp:muted:v2` | deleting the old key | a mute saved while typing "m" in a comment (an old bug) kept the sound off | player `MUTE_KEY` |

## The diff

```
.../plans/2026-09-22-richer-review/README.md       |   2 +-
 .../2026-09-22-richer-review/plan.resolved.md      |   4 +-
 .../plans/2026-09-22-richer-review/walkthrough.md  | 108 +++
 docs/status.md                                     |   7 +-
 package.json                                       |   2 +-
 packages/player/reelplanning-player.js             | 399 ++++++++--
 packages/player/test/controls.spec.mjs             |   5 +-
 packages/player/test/fixtures/l2-richer.json       | 877 +++++++++++++++++++++
 packages/player/test/review-keys.spec.mjs          | 267 +++++++
 scripts/frame-lint.mjs                             |   6 +
 scripts/plan-map.mjs                               |  11 +-
 scripts/reel.mjs                                   |   7 +-
 scripts/resolve-plan.mjs                           |  36 +-
 scripts/revise-scope.mjs                           |   6 +
 scripts/test/review-data.spec.mjs                  | 128 +++
 skills/plan-to-video/SKILL.md                      |   2 +-
 skills/plan-to-video/references/style-guide.md     |  13 +
 17 files changed, 1817 insertions(+), 63 deletions(-)
```

```diff
diff --git a/.reelplanning/plans/2026-09-22-richer-review/README.md b/.reelplanning/plans/2026-09-22-richer-review/README.md
index a6a105f..615bbae 100644
--- a/.reelplanning/plans/2026-09-22-richer-review/README.md
+++ b/.reelplanning/plans/2026-09-22-richer-review/README.md
@@ -4,7 +4,7 @@
 |---|---|---|
 | 1 Plan | `plan.md`, `video/` | [x] |
 | 2 Decide | `annotations.json` → `plan.resolved.md` (`reel record`) | [x] |
-| 3 Implement | code, `walkthrough.md` | [ ] |
+| 3 Implement | code, `walkthrough.md` | [x] |
 | 4 Walk through | `walkthrough-video/` | [ ] |
 | 5 Review | `walkthrough.resolved.md` | [ ] |
 
diff --git a/.reelplanning/plans/2026-09-22-richer-review/plan.resolved.md b/.reelplanning/plans/2026-09-22-richer-review/plan.resolved.md
index aa1a5fd..bad03db 100644
--- a/.reelplanning/plans/2026-09-22-richer-review/plan.resolved.md
+++ b/.reelplanning/plans/2026-09-22-richer-review/plan.resolved.md
@@ -75,7 +75,7 @@ agent treats them as prompts to explain a step more plainly.
 1. **After a pick-all-that-apply answer, what does the video play?** (step 2)
 - **A · Every picked option's branch, one after another.** You see the consequence of each
   pick. Costs watch time that grows with every tick.
-- **B · One summary frame of the picks, then on.** Short and always the same length. Costs seeing
+- **B · One summary frame of the picks, then on.** ← **chosen** Short and always the same length. Costs seeing
   what each pick means in the plan.
 - **C · Multi-select only on questions that have no branches.** Simplest to build and to watch.
   Costs the richer questions that need branches.
@@ -83,7 +83,7 @@ I recommend B: a pick-all answer is usually about scope, and a list of what is i
 the reviewer needs to see.
 
 2. **Which video-only feedback comes first?** (step 6)
-- **A · The rewind and slow-down moments, sent automatically.** No extra effort from the reviewer.
+- **A · The rewind and slow-down moments, sent automatically.** ← **chosen** No extra effort from the reviewer.
   Costs precision: a rewind can mean "interesting" as well as "lost me".
 - **B · A one-tap "lost me here" button.** Clear intent. Costs a button the reviewer has to remember
   to press (the old "Wait, what?" button was dropped for being unused).
diff --git a/.reelplanning/plans/2026-09-22-richer-review/walkthrough.md b/.reelplanning/plans/2026-09-22-richer-review/walkthrough.md
new file mode 100644
index 0000000..c5fbbea
--- /dev/null
+++ b/.reelplanning/plans/2026-09-22-richer-review/walkthrough.md
@@ -0,0 +1,108 @@
+# Walkthrough: Richer review
+
+**Status:** implemented on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` · **Decisions taken:** D-004 = one summary frame of the picks · D-005 = automatic rewinds and slow-downs
+
+The script side (plan-map, resolve-plan, the reel CLI, revise-scope, the frame lint and the style guide) and
+the player side were built by two agents at once, against one contract for the data between them. The
+reviewer also asked for things during this plan's review that the plan did not cover: keys to jump
+between parts, letter keys to answer, a note on any answer, a clearer part bar and a sound fix. Those
+were built too and are listed under "Not in the plan".
+
+## What was done, per step
+
+### Step 1 — Questions with up to four options ✅
+
+The storyboard takes `option_a` to `option_d`. `scripts/plan-map.mjs` keeps the options that are
+present, so a question can have two, three or four. In the player (`packages/player/reelplanning-player.js`,
+`.opts[data-n]`), three options sit in one row and four sit 2×2. Four go across only on a stage
+1200px or wider, and phones stack them. The text is never shrunk (A7). `scripts/resolve-plan.mjs`
+now reads the `A · Label` form real plans use (A1).
+
+### Step 2 — Pick-all-that-apply questions ✅
+
+A `- kind: multi` beat has no branches. It is followed by one summary beat tagged `- summary: q<N>`,
+so D-004 holds. `plan-map.json` gives the question `kind: "multi"` and a `summary` frame, and
+`resumeAt` is set to the summary's end. The player's options become ticks (the letter square is the
+checkbox), and "Confirm N picks" records `option: "multi"` with `options` and `labels`. It then plays the
+summary frame and writes the picks into `[data-plan-picks]` (A8). `reel record` stores the picks as one
+ledger entry with `chosenIds` (A3), and `resolve-plan` marks every pick in the plan.
+
+### Step 3 — As many questions as the plan needs ✅
+
+`skills/plan-to-video/references/style-guide.md` §19 drops the "about three". The budget is now one
+decision per part of about a minute. `reel check` (`scripts/reel.mjs`) warns, and never fails, when a plan
+has more than six open questions.
+
+### Step 4 — Type on the mark ✅
+
+When a freehand stroke, arrow or box is finished, a text box opens beside it and the video stays
+paused. Enter saves the words as the mark's `comment`, and Escape leaves the mark without words
+(`openMarkBox` in the player). Shortcuts do not fire while typing. Clicking away keeps what was typed (A10).
+
+### Step 5 — Diagrams a newcomer can follow ✅ (one deviation)
+
+`scripts/frame-lint.mjs` rule 4b fails a frame showing more than six parts, unless the frame says
+`data-density="full"` (A5). Style guide §19 adds "one new thing per beat, named in the glossary's
+words" and the newcomer check to the design critique. **Deviation:** the close-the-lifecycle video,
+built before the rule, has four frames that now fail it (7 and 10 parts). They were left as they are.
+
+### Step 6 — Feedback only a video can give ✅
+
+D-005 holds: nothing is asked of the reviewer. The player (`packages/player/reelplanning-player.js`) records `watch.moments`: a rewind of more
+than 2 s by scrubbing or a key, and each time the speed is lowered below 1× (A11, A12). They are saved
+across reloads. `resolve-plan` writes them under "## Hard to follow here", grouped by step (A4).
+
+## Choices the plan did not specify (autonomy)
+
+| id | Step | Chose | Instead of | Why | Check |
+|---|---|---|---|---|---|
+| A1 | 1 | resolve-plan finds an option by its letter within question N's block when the label differs | matching the exact label only | "← chosen" never matched real plans, which write `A · Label` | `scripts/resolve-plan.mjs` |
+| A2 | 2 | a pick-all question has no branch beats at all; `plan-map` skips straight to its summary | allowing branches on a pick-all question | D-004 is one summary frame whatever is picked | `scripts/plan-map.mjs` |
+| A3 | 2 | a pick-all answer is one ledger entry, with `chosen` as the joined labels and `chosenIds` as the set | one entry per pick | the question was asked once, and `reel check`'s re-ask guard compares questions | `scripts/reel.mjs` `record` |
+| A4 | 6 | "hard to follow" moments are listed by step, with times | listed in time order, or merged into the step comments | the revise works step by step; a moment is a signal, not a comment | `scripts/resolve-plan.mjs` |
+| A5 | 5 | density is counted statically, as distinct `data-plan-component` values on the frame (not counting "page"), with a `data-density="full"` opt-out | counting what is visible at each moment in the browser | the lint is cheap and runs per frame as it lands; a whole-system beat can say so | `scripts/frame-lint.mjs` rule 4b |
+| A6 | — | a note on an answer sends its step to the revise, like a comment | notes as record-only | a note usually qualifies the answer ("only until accounts exist"), which the plan must then say | `scripts/revise-scope.mjs` `answer-note` |
+| A7 | 1 | 4 options go 2×2, and 4-across only when the stage is at least 1200px | 4-across at 1440 | four ~240px cards wrap each reason onto 4–5 lines | player `.opts[data-n]` |
+| A8 | 2 | `data-plan-picks`: a `<ul>`/`<ol>` gets one `<li>` per pick, and any other element gets the labels joined with ", " | a template convention per item | the simplest rule a frame author can rely on; style guide §19 says it | player `applyPicks()` |
+| A9 | 2 | on replay, an answer with no branch of its own (pick-all, own words, a branchless option) skips from the question to its summary or `resumeAt` | routing only pick-one answers with branches | a 4-option question may have options without branches; this also stopped own-words answers replaying every branch | player `tickDecisions` |
+| A10 | 4 | clicking away or starting another mark keeps the words typed; only Escape discards | blur discards | clicking away should not lose words | player `openMarkBox`, `closeMarkBox` |
+| A11 | 6 | a rewind is a scrub, P, Shift+← or a part marker going back more than 2 s; jumps from the record (step rows, comment times, "change") are not | every backwards seek | those are navigation, not "lost me here" | player `noteRewind` callers |
+| A12 | 6 | speed changes within 3 s merge into one "slow" moment, and only a lower speed below 1× counts | one moment per change below 1× | speeding back up is not a signal | player `noteSlow` |
+| A13 | — | a note alone still offers Approve when the review is finished | treating a note like a comment | a note clarifies an answer; it is not a change request | player `hasWords()` |
+| A14 | — | notes only on plan questions, not on quick checks or Accept/Flag of the agent's calls | a note on every beat | the review data defines `note` on decisions only | player `askDecision` |
+| A15 | — | the old mute setting (`rp:muted`) is ignored, and mute is now stored as `rp:muted:v2` | deleting the old key | a mute saved while typing "m" in a comment (an old bug) kept the sound off | player `MUTE_KEY` |
+
+## Not in the plan (asked for during the review)
+
+- **Part bar:** each part has a numbered chip and its title under its bar, and clicking one jumps
+  there. The current part is highlighted and takes the room its title needs.
+- **Keys:** N / P and Shift+→ / Shift+← jump to the next or previous part's start. A–D answer (and
+  toggle on pick-all, with Enter to confirm), and O opens "answer in my own words". While a question is
+  open, letters never start drawing.
+- **A note on any answer:** "Add a note to this answer", saved as `note`. It can be edited in the record
+  and is shown in Copy text.
+- **Sound:** see A15.
+
+## Deviations from the plan or the decisions
+
+- Step 5: the close-the-lifecycle video has four frames over the density limit. It is not rebuilt here.
+
+## Evidence
+
+- `npm test`: every spec passes, including the new `scripts/test/review-data.spec.mjs` (10 checks,
+  the script side) and `packages/player/test/review-keys.spec.mjs` (57 checks, the player side).
+- The player at 1440 light, 955 dark, 760 and 430 was screenshotted with four options, a pick-all
+  question, a mark with words, the part bar and the record.
+
+## Not done / not tested
+
+- No real plan video has a four-option or pick-all question yet. The player was tested on a fixture
+  (`packages/player/test/fixtures/l2-richer.json`).
+- On a 430px phone, a long part title can still be cut short (the full title is in the tooltip).
+
+## Quiz (for the walkthrough video)
+
+| id | after step | question | options | answer | explain |
+|---|---|---|---|---|---|
+| K1 | 2 | You tick Web and Slides on a pick-all question. What plays next? | a) both options' branches · b) one frame listing your picks · c) nothing, the video moves on | b | D-004: one summary frame, the same length whatever you pick |
+| K2 | 6 | You drag the playhead back 10 s to hear a step again. Where does the agent see it? | a) nowhere · b) as a comment · c) under "Hard to follow here", on that step | c | rewinds are sent automatically (D-005) and read as prompts to explain that step more plainly |
diff --git a/docs/status.md b/docs/status.md
index 6eaf0ac..eed6466 100644
--- a/docs/status.md
+++ b/docs/status.md
@@ -8,7 +8,7 @@ The [README](../README.md) describes the whole workflow. This page shows how muc
 | An existing plan → video | ✅ Built. `/plan-to-video path/to/plan.md`. |
 | The review page opens by itself | ✅ `reelplanning review <video-dir>` bundles the player with the video, serves it locally and opens the browser; the skill runs it when a video is ready. |
 | First plan in an existing repo | 🟡 The agent maps the code into `.reelplanning/` and shows you the map as text next to the plan video. Building the system video alongside the plan video waits on the system video itself. |
-| Watch, comment, decide | ✅ Built: local player, hosted player, one-click handoff to Claude from a published Artifact. |
+| Watch, comment, decide | ✅ Built: local player, hosted player, one-click handoff to Claude from a published Artifact. Questions take 2–4 options or "pick all that apply" and can be answered with A–D; any answer can carry a note. N / P jump between parts. Rewinds and slow-downs reach the agent as "hard to follow here" in the resolved plan. |
 | Revise the plan, rebuild the changed scenes | 🟡 Run once, by hand, on [this repo's own review page](../packages/player/.reelplanning/plans/2026-09-21-review-page/). The GitHub Action that does it on push has not run for real yet, and the narration is still regenerated in full. |
 | Implement to the plan | 🟡 The skill tells the agent to treat decisions as constraints and log each of its own calls as it makes it. Not yet run on a real implementation. |
 | Check the code against the plan | 🟡 `reel audit` checks the report covers every step and decision and says where to look. The second-agent review of the diff waits on the plan's review. |
@@ -18,11 +18,14 @@ The [README](../README.md) describes the whole workflow. This page shows how muc
 
 ## The plans that cover the rest
 
-Both are in this repo's own `.reelplanning/`, so they go through the same workflow:
+All are in this repo's own `.reelplanning/`, so they go through the same workflow:
 
 - [**Close the lifecycle**](../.reelplanning/plans/2026-09-22-close-the-lifecycle/plan.md): implement to
   the plan, check the diff against it, walk through real code, act on flags, and build and maintain
   the system video.
+- [**Richer review**](../.reelplanning/plans/2026-09-22-richer-review/plan.md): more kinds of
+  question, notes on answers and marks, a density rule for diagrams, and feedback only a video can
+  give. Built; its [walkthrough](../.reelplanning/plans/2026-09-22-richer-review/walkthrough.md) is written, and its walkthrough video is not made yet.
 - [**The revise loop**](../.reelplanning/plans/2026-09-22-m3-revise-loop/plan.md): the GitHub Action
   that revises on push (not yet run for real), and rebuilding narration only for the changed scenes.
 
diff --git a/package.json b/package.json
index 015d5cf..0ffe591 100644
--- a/package.json
+++ b/package.json
@@ -11,7 +11,7 @@
     "setup": "scripts/setup.sh",
     "skills:update": "node scripts/hyperframes-skills.mjs --force",
     "review": "python3 -m http.server 8787 --bind 127.0.0.1 >/dev/null 2>&1 & echo \"open http://127.0.0.1:8787/packages/player/?project=videos/l1-upload-resume\"",
-    "test": "node scripts/test/numerals.spec.mjs && node scripts/test/hyperframes-skills.spec.mjs && node scripts/test/lifecycle.spec.mjs && node packages/player/test/player.spec.mjs videos/l1-upload-resume && node packages/player/test/decisions.spec.mjs && node packages/player/test/quiz.spec.mjs && node packages/player/test/changes.spec.mjs && node packages/player/test/own-answer.spec.mjs && node packages/player/test/controls.spec.mjs && node packages/player/test/handoff.spec.mjs && node packages/player/test/finish.spec.mjs",
+    "test": "node scripts/test/numerals.spec.mjs && node scripts/test/hyperframes-skills.spec.mjs && node scripts/test/lifecycle.spec.mjs && node scripts/test/review-data.spec.mjs && node packages/player/test/player.spec.mjs videos/l1-upload-resume && node packages/player/test/decisions.spec.mjs && node packages/player/test/quiz.spec.mjs && node packages/player/test/changes.spec.mjs && node packages/player/test/own-answer.spec.mjs && node packages/player/test/controls.spec.mjs && node packages/player/test/handoff.spec.mjs && node packages/player/test/finish.spec.mjs && node packages/player/test/review-keys.spec.mjs",
     "plan-map": "node scripts/plan-map.mjs",
     "bundle": "node scripts/bundle-player.mjs dist/review videos/l2-upload-resume videos/g1-bob-dylan-site videos/w1-upload-resume",
     "bundle:check": "node packages/player/test/bundle.spec.mjs dist/review"
diff --git a/packages/player/reelplanning-player.js b/packages/player/reelplanning-player.js
index 28aa798..1f0c4c2 100644
--- a/packages/player/reelplanning-player.js
+++ b/packages/player/reelplanning-player.js
@@ -24,6 +24,7 @@ const STYLE = `
 :host([theme="dark"]){--paper:#141310;--tile:#232120;--ink:#F2EFE8;--ink-rgb:242,239,232;--accent:#CC785C;--accent-text:#E3A184;--navy:#EFE9DE}
 :host{--ink-72:rgba(var(--ink-rgb),.72);--ink-55:rgba(var(--ink-rgb),.55);--ink-20:rgba(var(--ink-rgb),.2);--ink-12:rgba(var(--ink-rgb),.12)}
 *,*::before,*::after{box-sizing:border-box}
+:host(:focus){outline:none}   /* the host takes focus only so its shortcuts work; a ring round the whole page says nothing */
 /* Step 1 — one column, video first. The stage takes the width the viewport allows and no more height
    than is left under it, so the frame is the biggest thing on the page in every window. The four
    lists are no longer a fixed sibling: they sit below as a record, in as many columns as fit. */
@@ -62,10 +63,23 @@ canvas.overlay{position:absolute;inset:0;width:100%;height:100%;touch-action:non
 .scrub .hover{bottom:calc(100% + 6px);transform:translateX(-50%);padding:5px 9px;border-radius:6px;background:var(--ink);color:var(--paper);font-size:12px;line-height:1.3;white-space:nowrap;pointer-events:none;display:none;z-index:4}
 .scrub .hover.on{display:block}
 .scrub .hover .tm{font-family:var(--mono);opacity:.7;margin-left:6px}
-.labels{position:relative;height:18px}
+.labels{position:relative;height:20px;margin-top:2px}
 .labels:empty{display:none}
-.labels .lbl{display:block;font-size:13px;line-height:18px;color:var(--accent-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
-.labels .lbl .n{color:var(--ink-55)}
+/* The parts, named under their own bars. The owner could not tell how many parts there were, which one
+   they were in, or how to get to another: a hover label names one part at a time, and "Part 2 of 3"
+   under the bar names only the one you are in. Now every part carries its number and its title under
+   its own bar, and is the button that jumps to its start (N / P from the keyboard). The part you are in
+   is the coral chip; when its title does not fit its bar it takes the room it needs and the others
+   close up to their numbers (layoutParts), so the part you are in is named in full wherever the row
+   has room for that at all (on a phone a long name can still end in an ellipsis; its tooltip has it). */
+.labels .part{position:absolute;top:0;display:flex;align-items:center;gap:6px;height:20px;min-height:0;padding:0;border:0;border-radius:4px;background:none;color:var(--ink-55);font-size:12px;line-height:20px;overflow:hidden;cursor:pointer;text-align:left;white-space:nowrap}
+.labels .part .pn{flex:0 0 auto;display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border:1px solid var(--ink-20);border-radius:4px;font:500 11px/1 var(--mono);color:var(--ink-72)}
+.labels .part .pt{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
+.labels .part.tight .pt{display:none}
+.labels .part:hover{color:var(--ink)}
+.labels .part:hover .pn{border-color:var(--ink);color:var(--ink)}
+.labels .part[aria-current="true"]{color:var(--accent-text)}
+.labels .part[aria-current="true"] .pn{background:var(--accent);border-color:var(--accent);color:#141413}  /* coral is the same in both themes, and ink on it reads in both */
 /* The toolbar is the reviewer's three verbs and nothing else: mark it, say something, approve it.
    Everything that is not one of those moved out — the shapes appear only once you are marking, undo
    is the Z key and the × on each mark in the list, export sits with the marks it exports. */
@@ -92,7 +106,7 @@ canvas.overlay{position:absolute;inset:0;width:100%;height:100%;touch-action:non
 .transport .themebtn:hover{color:var(--ink)}
 /* Speed: a drag, because the useful values are not a menu — 1.6x is a real answer. */
 .speed{grid-column:4;grid-row:1/3;align-self:center;display:flex;align-items:center;gap:8px}
-.speed input{width:104px;accent-color:var(--coral);cursor:ew-resize;display:block;margin:0}
+.speed input{width:104px;accent-color:var(--ink);cursor:ew-resize;display:block;margin:0}
 /* Anchors on the drag. The range is 0.5-3, so a value v sits at (v-0.5)/2.5 along the track; the
    marks are drawn there and the 0.25 step lands on them. */
 .speed .track{position:relative;padding-bottom:11px}
@@ -245,6 +259,10 @@ h4 .count{font-weight:400}
 .dec .q{margin:4px 0;font:15px/1.35 var(--serif);color:var(--ink)}
 .dec .a{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
 .dec b,.ann b{font-weight:500}
+.dec textarea.dnote{display:block;width:100%;margin-top:4px;padding:4px 0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font:inherit;font-size:13px;line-height:1.5;color:var(--ink-72);resize:none;overflow:hidden}
+.dec textarea.dnote::placeholder{color:var(--ink-55)}
+.dec textarea.dnote:hover{border-color:var(--ink-12)}
+.dec textarea.dnote:focus{outline:0;border-color:var(--ink);color:var(--ink)}
 .ann .hd{display:flex;align-items:baseline;gap:8px}
 .ann .hd .lnk{margin-left:auto}
 .ann .hd .t{flex:1;min-width:0;margin:0;font-size:13px;color:var(--ink-55)}
@@ -258,7 +276,7 @@ h4 .count{font-weight:400}
 .level .lvl-len{font:12px var(--mono);color:var(--ink-55)}
 /* overlays: decision, quick check, autonomy and chapter end share one sheet docked to the stage's bottom edge. No veil:
    the map stays lit above it; the sheet covers the video's own cards and caption, which sit in the lower third */
-.sheet{position:absolute;left:0;right:0;bottom:0;display:none;min-height:35%;background:var(--paper);border-top:1px solid var(--ink-20);padding:16px 24px;text-align:left}
+.sheet{position:absolute;left:0;right:0;bottom:0;display:none;min-height:35%;max-height:100%;overflow:auto;background:var(--paper);border-top:1px solid var(--ink-20);padding:16px 24px;text-align:left}
 .sheet.on{display:block}
 .sheet .k{display:block;margin-bottom:8px}
 /* D-001: the sheet keeps the frame's full size, and folds out of the way when the frame it asks
@@ -271,14 +289,32 @@ h4 .count{font-weight:400}
 .reopen{display:none}
 /* folded, the question waits in the top-right corner: captions own the bottom of the frame, and a long one reaches the right edge */
 .sheet.folded{left:auto;right:12px;top:12px;bottom:auto;min-height:0;width:auto;max-width:calc(100% - 32px);border:1px solid var(--accent);border-radius:8px;padding:8px 12px}
-.sheet.folded .q,.sheet.folded .opts,.sheet.folded .own,.sheet.folded .feedback,.sheet.folded .foot,.sheet.folded .fold{display:none}
+.sheet.folded .q,.sheet.folded .opts,.sheet.folded .more,.sheet.folded .own,.sheet.folded .feedback,.sheet.folded .foot,.sheet.folded .fold{display:none}
 .sheet.folded .hd{align-items:center;gap:8px}
 .sheet.folded .hd .k{margin:0;color:var(--accent-text)}
 .sheet.folded .reopen{display:inline-block;border:0;background:none;padding:0;font:12px/1.4 var(--mono);color:var(--accent-text);cursor:pointer;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}
 .sheet .q{font:400 24px/1.25 var(--serif);margin:0 0 12px}
 .opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:8px}
-.opts[data-kind="quiz"]{grid-template-columns:repeat(3,1fr)}
-.opt{position:relative;display:block;text-align:left;padding:8px 12px;border-radius:8px;border:1px solid var(--ink-20);background:var(--tile);cursor:pointer;color:var(--ink)}
+/* Two, three or four options (richer review, step 1), laid out by how many there are rather than by
+   how many 240 px columns happen to fit: auto-fit left a 3 + 1 orphan at 955 px. Three sit in a row;
+   four sit 2 x 2 until the frame is wide enough to give each of four a readable line (the stage's
+   data-size, measured in measurePeek), and the text is never made smaller to fit. */
+.opts[data-n="3"]{grid-template-columns:repeat(3,minmax(0,1fr))}
+.opts[data-n="4"]{grid-template-columns:repeat(2,minmax(0,1fr))}
+.stage[data-size="wide"] .opts[data-n="4"]{grid-template-columns:repeat(4,minmax(0,1fr))}
+.stage[data-size="narrow"] .opts[data-n="3"],.stage[data-size="narrow"] .opts[data-n="4"]{grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}
+.opt{position:relative;display:grid;grid-template-columns:18px minmax(0,1fr);column-gap:10px;align-items:start;align-content:start;text-align:left;padding:8px 12px;border-radius:8px;border:1px solid var(--ink-20);background:var(--tile);cursor:pointer;color:var(--ink)}
+.opt>b,.opt>span{grid-column:2}
+/* each option carries the key that picks it: A-D while a question is waiting */
+.opts .opt .key{grid-column:1;grid-row:1/span 2;display:inline-grid;place-items:center;width:18px;height:18px;margin:1px 0 0;font:500 12px/1 var(--mono);color:var(--ink-55)}
+/* pick all that apply: the key is the checkbox — a square, filled in ink once picked, and the card
+   says "picked" in words, the way an answered option says "your answer" */
+.opts[data-kind="multi"] .opt .key{border:1px solid var(--ink-55);border-radius:4px}
+.opts[data-kind="multi"] .opt[aria-pressed="true"]{background:var(--tile);color:var(--ink);border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink);padding-right:108px}
+.opts[data-kind="multi"] .opt[aria-pressed="true"] .key{background:var(--ink);border-color:var(--ink);color:var(--paper)}
+.foot .confirm{white-space:nowrap}
+.foot .confirm[hidden]{display:none}
+.foot .confirm:disabled{opacity:.55;cursor:default}
 .opt:disabled{cursor:default}
 .opt[data-chosen="true"]{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
 .opt[data-rec="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
@@ -288,8 +324,23 @@ h4 .count{font-weight:400}
 .opt b{display:block;font-weight:500;margin-bottom:2px}
 .opt span{display:block;font-size:13px;color:var(--ink-72)}
 .opts[data-kind="quiz"] .opt{display:grid;grid-template-columns:20px minmax(0,1fr);gap:12px;align-items:baseline}
-.opts[data-kind="quiz"] .opt b{font:12px/1 var(--mono);color:var(--ink-55);margin:0}
-.opts[data-kind="quiz"] .opt span{font-size:15px;color:var(--ink)}
+.opts[data-kind="quiz"] .opt b{grid-column:1;font:12px/1 var(--mono);color:var(--ink-55);margin:0}
+.opts[data-kind="quiz"] .opt span{grid-column:2;font-size:15px;color:var(--ink)}
+/* under the options, one row: an answer of your own, and a note on whichever answer you give */
+.more{display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;margin-top:12px}
+.more .own{margin-top:0;flex:0 1 auto}
+.more .own.open{flex:1 1 100%}
+.note{flex:1 1 260px;min-width:0}
+.note[hidden]{display:none}
+.note input{display:block;width:100%;font:inherit;font-size:13px;padding:6px 8px;border:0;border-bottom:1px solid var(--ink-20);border-radius:0;background:none;color:var(--ink)}
+.note input::placeholder{color:var(--ink-55)}
+.note input:focus{outline:0;border-color:var(--ink)}
+/* the words on a mark: a small box beside the mark it names, on the paused frame */
+.markbox{position:absolute;z-index:3;width:min(280px,calc(100% - 16px));padding:4px 4px 6px;background:var(--paper);border:1px solid var(--ink-20);border-radius:6px;box-shadow:0 1px 2px rgba(var(--ink-rgb),.1)}
+.markbox[hidden]{display:none}
+.markbox input{display:block;width:100%;font:inherit;font-size:13px;padding:6px 8px;border:0;background:none;color:var(--ink)}
+.markbox input:focus{outline:0}
+.markbox .k{display:block;padding:0 8px;font:11px/1.3 var(--mono);color:var(--ink-55)}
 .feedback{display:none;margin-top:12px;font-size:13px;color:var(--ink-72)}
 .feedback b{color:var(--ink);font-weight:500}
 .foot{display:flex;gap:12px;align-items:center;margin-top:12px;font-size:13px;color:var(--ink-72)}
@@ -322,9 +373,11 @@ h4 .count{font-weight:400}
   .transport{grid-template-columns:auto auto minmax(0,1fr);column-gap:8px}
   .transport .play{min-width:64px}
   .transport .time{grid-row:1}
-  .transport .nowline{grid-column:2/-1;display:flex;align-items:baseline;gap:12px}
-  .nowline .labels{flex:1 1 auto;min-width:0}
-  .nowline .status{flex:0 1 auto;min-width:0;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
+  /* The parts row has to sit under the bars it names, so it takes the scrub's column; the status
+     line moves down beside the speed drag, where it has more room than it had next to the part name. */
+  .transport .nowline{display:contents}
+  .nowline .labels{grid-column:3;grid-row:2;min-width:0}
+  .nowline .status{grid-column:3;grid-row:3;align-self:center;min-width:0;margin:4px 48px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
   .transport .speed{grid-column:1/3;grid-row:3;justify-self:start;margin-top:4px}
   .transport .themebtn{grid-column:3;grid-row:3;justify-self:end;margin-top:4px}
   .scrub{height:28px}.scrub .seg,.scrub .tick{top:10px}.scrub .seg.hov{top:7px}.scrub .head{top:5px}
@@ -359,12 +412,13 @@ h4 .count{font-weight:400}
   .sheet.on .foot{margin-top:auto;padding-top:12px}
   /* folded, the pill goes back onto the frame's own corner rather than floating in the page */
   .sheet.on.folded{position:absolute;display:block;top:8px;left:auto;right:8px;bottom:auto;width:auto;max-width:calc(100% - 16px);padding:8px 10px;overflow:visible}
-  .sheet .q{font-size:22px}.opts,.opts[data-kind="quiz"]{grid-template-columns:1fr}
+  .sheet .q{font-size:22px}.opts,.opts[data-kind="quiz"],.opts[data-n],.stage[data-size] .opts[data-n]{grid-template-columns:1fr}   /* phones stack every option, however many */
   .idle{top:16px;bottom:auto}
 }
 `;
 
 const KEY = (src) => `reelplanning:annotations:${src}`;
+const MUTE_KEY = "rp:muted:v2";
 const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
 // "wait" is no longer offered; the label stays so an annotation saved before it was removed still reads.
 const KIND = { stroke: "stroke", arrow: "arrow", box: "box", wait: "wait, what?", note: "note", flag: "flag", approve: "approve" };
@@ -388,6 +442,7 @@ export class ReelplanningPlayer extends HTMLElement {
     this.autonomy = {};       // autonomyId -> { verdict: 'accept'|'flag', t }
     this.level = null;        // knowledge level, when the plan map has levels
     this._notice = null;      // a transient message appended to the status line
+    this.moments = [];        // D-005: where the reviewer went back or slowed down — { kind, t, from?, rate?, planStep, frameIndex }
   }
   connectedCallback() { if (!this.shadowRoot.childElementCount) this.render(); this.scheduleLoad(); this.reachClaude(); }
   // Where this page is hosted as an Artifact, it can hand the review straight to Claude instead of
@@ -419,14 +474,15 @@ export class ReelplanningPlayer extends HTMLElement {
           <div class="stage" data-tool="">
             <hyperframes-player></hyperframes-player>
             <canvas class="overlay" width="1920" height="1080"></canvas>
+            <div class="markbox" hidden><input data-markword maxlength="280" placeholder="What this mark means" aria-label="Words for this mark — Enter saves them, Esc leaves the mark without words"><span class="k">Enter saves · Esc skips</span></div>
             <div class="idle">Loading the video…</div>
-            <div class="decision sheet" role="dialog" aria-label="Decision"><div class="hd"><span class="k"></span><button class="fold" data-act="fold" title="Fold the question away so you can see the frame it is about — it stays unanswered">Show the frame</button><button class="reopen" data-act="unfold">Still to answer</button></div><p class="q"></p><div class="opts"></div><div class="own" hidden><button class="ownbtn" data-act="own" title="Type your own answer instead of picking one — Esc cancels">Answer in my own words</button><div class="ownbox"><textarea rows="2" placeholder="Your answer — Enter saves it"></textarea><button data-act="own-save">Save</button></div></div><div class="feedback"></div><div class="foot"><span class="hint"></span></div></div>
-            <div class="chend sheet" role="dialog" aria-label="End of chapter"><div class="hd"><span class="k"></span></div><p class="q"></p><div class="foot"><button data-act="ch-next">Next part</button><button data-act="ch-stay" class="lnk">Stay here</button></div></div>
+            <div class="decision sheet" role="dialog" aria-label="Decision"><div class="hd"><span class="k"></span><button class="fold" data-act="fold" title="Fold the question away so you can see the frame it is about — it stays unanswered">Show the frame</button><button class="reopen" data-act="unfold">Still to answer</button></div><p class="q"></p><div class="opts"></div><div class="more"><div class="own" hidden><button class="ownbtn" data-act="own" title="Type your own answer instead of picking one (O) — Esc cancels">Answer in my own words <kbd>O</kbd></button><div class="ownbox"><textarea rows="2" placeholder="Your answer — Enter saves it"></textarea><button data-act="own-save">Save</button></div></div><div class="note" hidden><input data-note maxlength="400" placeholder="Add a note to this answer (optional)" aria-label="A note to go with your answer (optional)" title="A few words that clarify your answer — they go with it, they are not a second answer"></div></div><div class="feedback"></div><div class="foot"><button data-act="confirm" class="confirm" hidden disabled>Confirm <kbd>&#8629;</kbd></button><span class="hint"></span></div></div>
+            <div class="chend sheet" role="dialog" aria-label="End of chapter"><div class="hd"><span class="k"></span></div><p class="q"></p><div class="foot"><button data-act="ch-next" title="Next part (N)">Next part <kbd>N</kbd></button><button data-act="ch-stay" class="lnk">Stay here</button></div></div>
           </div>
           <div class="transport">
             <div class="playgroup"><button data-act="play" class="play" title="Play or pause (space)">Play</button><button data-act="mute" class="mute" aria-pressed="false" title="Mute (M)" aria-label="Mute (M)"></button></div>
             <span class="time"><span class="now">0:00</span> / <span class="dur">0:00</span></span>
-            <div class="scrub" title="Seek"></div>
+            <div class="scrub" title="Seek — click or drag · N / P or Shift+&rarr; / Shift+&larr; jump a part"></div>
             <div class="nowline"><div class="labels"></div><p class="status"></p></div>
             <div class="speed"><span class="track"><input type="range" min="0.5" max="3" step="0.25" value="1" data-speed list="rp-speeds" aria-label="Playback speed, half speed to three times" title="Playback speed — drag, or [ and ]">
               <i class="tick" style="left:0%"></i><i class="tick" data-major style="left:20%"><span>1&times;</span></i><i class="tick" style="left:30%"></i><i class="tick" data-major style="left:40%"><span>1.5&times;</span></i><i class="tick" style="left:50%"></i><i class="tick" data-major style="left:60%"><span>2&times;</span></i><i class="tick" style="left:80%"></i><i class="tick" data-major style="left:100%"><span>3&times;</span></i>
@@ -478,7 +534,7 @@ export class ReelplanningPlayer extends HTMLElement {
     this.ctx = this.canvas.getContext("2d");
     this.stage = this.$(".stage");
     if (!this._wired) { this._wired = true; this.shadowRoot.addEventListener("click", (e) => this.onClick(e));
-      this.shadowRoot.addEventListener("input", (e) => { if (e.target.matches("[data-speed]")) this.setSpeed(parseFloat(e.target.value)); }); this.tabIndex = 0; this.addEventListener("keydown", (e) => this.onKey(e)); }
+      this.shadowRoot.addEventListener("input", (e) => { if (e.target.matches("[data-speed]")) this.reviewerSpeed(parseFloat(e.target.value)); }); this.tabIndex = 0; this.addEventListener("keydown", (e) => this.onKey(e)); }
     this.canvas.addEventListener("pointerdown", (e) => this.pointerDown(e));
     this.canvas.addEventListener("pointermove", (e) => this.pointerMove(e));
     this.canvas.addEventListener("pointerup", (e) => this.pointerUp(e));
@@ -488,8 +544,21 @@ export class ReelplanningPlayer extends HTMLElement {
     comp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.postComment(); } });
     comp.addEventListener("focus", () => this.player.pause());   // you cannot type about a moment that is running away
     this.$(".own textarea").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.answerOwn(); } });
+    // Enter in the note is "done with the note": a pick-all question it confirms (if anything is
+    // picked); otherwise it hands the keyboard back so a letter picks the option the note is about.
+    this.$("[data-note]").addEventListener("keydown", (e) => { if (e.key !== "Enter") return; e.preventDefault(); const p = this._pendingDecision; if (this.isDec(p) && p.kind === "multi" && this.picked().length) this.confirmMulti(); else { e.target.blur(); this.focus(); this.$(".decision .hint").textContent = "Note kept — now pick your answer; it goes with it."; } });
+    const mw = this.$("[data-markword]");
+    mw.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); this.closeMarkBox(true, true); } });
+    mw.addEventListener("blur", () => this.closeMarkBox(true));   // clicking away keeps what was typed
     this.setTheme(this.theme);   // paints the host and labels the switch before anything loads
-    this.$(".scrub").addEventListener("pointerdown", (e) => { const r = e.currentTarget.getBoundingClientRect(); const dur = this.dur(); if (!dur || !r.width) return; this.start(); this.jump(Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur))); });
+    // Click or drag. One gesture is one move of the playhead, so a drag back is one rewind (D-005),
+    // measured from where the reviewer was when they took hold to where they let go.
+    const scrub = this.$(".scrub");
+    const at = (e) => { const r = scrub.getBoundingClientRect(); const dur = this.dur(); if (!dur || !r.width) return null; return Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur)); };
+    scrub.addEventListener("pointerdown", (e) => { const t = at(e); if (t == null) return; this._scrub = { from: this.watchedT(), to: t }; this.start(); try { scrub.setPointerCapture(e.pointerId); } catch {} this.jump(t); });
+    scrub.addEventListener("pointermove", (e) => { if (!this._scrub) return; const t = at(e); if (t == null || Math.abs(t - this._scrub.to) < 0.1) return; this._scrub.to = t; this.jump(t); });
+    const let_go = () => { const g = this._scrub; if (!g) return; this._scrub = null; this.noteRewind(g.from, g.to); };
+    scrub.addEventListener("pointerup", let_go); scrub.addEventListener("pointercancel", let_go);
     if (!this._peekWired) {
       this._peekWired = true;
       addEventListener("resize", () => this.measurePeek());
@@ -497,6 +566,7 @@ export class ReelplanningPlayer extends HTMLElement {
       // the chrome's height is not fixed — the shape picker wraps under Mark, the composer grows as
       // you type, a chapter label appears — so the peek is re-measured whenever the column resizes
       try { this._ro = new ResizeObserver(() => this.measurePeek()); this._ro.observe(this.$(".main")); } catch {}
+      try { document.fonts?.ready.then(() => this.layoutParts()); } catch {}   // part names are measured, so measure them in the real font
     }
     this.syncPull();
     this.updateStatus();
@@ -514,6 +584,10 @@ export class ReelplanningPlayer extends HTMLElement {
     wrap.style.setProperty("--peek", `${peek}px`);
     // and the frame's own bottom edge, which is as high as a question docked to the viewport may reach
     wrap.style.setProperty("--sheet-top", `${Math.round(Math.max(0, this.stage.getBoundingClientRect().bottom))}px`);
+    // how many option cards fit side by side depends on the frame's width, not the window's
+    const w = this.stage.getBoundingClientRect().width;
+    if (w) this.stage.dataset.size = w >= 1200 ? "wide" : w >= 620 ? "mid" : "narrow";
+    this.layoutParts();
   }
   // the runtime's asset loader (mint logo, "Loading assets") is off-palette and says nothing to a reviewer; its shadow is open
   hideRuntimeLoader() { try { const r = this.player.shadowRoot; if (r && !r.querySelector("style[data-rp]")) { const st = document.createElement("style"); st.dataset.rp = "1"; st.textContent = ".hfp-shader-loader{display:none!important}"; r.appendChild(st); } } catch {} }
@@ -543,10 +617,13 @@ export class ReelplanningPlayer extends HTMLElement {
   // offers 0.5-3 because outside that the voice stops being speech.
   // Mute: per viewer, like the theme and the speed. The underlying player owns the audio; its
   // \`muted\` attribute silences the narration without touching the timeline.
-  get muted() { if (this._muted === undefined) { try { this._muted = localStorage.getItem("rp:muted") === "1"; } catch { this._muted = false; } } return this._muted; }
+  // The key is versioned: an earlier key guard let every "m" typed into a comment toggle mute, and
+  // that state was remembered, so reviewers could be left muted without knowing why. rp:muted is
+  // never read again; everyone starts with sound once, and chooses again from there.
+  get muted() { if (this._muted === undefined) { try { this._muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { this._muted = false; } } return this._muted; }
   setMuted(m) {
     this._muted = !!m;
-    try { localStorage.setItem("rp:muted", m ? "1" : "0"); } catch {}
+    try { localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch {}
     try { this.player.muted = this._muted; } catch {}
     this.syncMute();
   }
@@ -568,7 +645,34 @@ export class ReelplanningPlayer extends HTMLElement {
     const x = this.$(".speed .x"); if (x) { x.textContent = `${v}\u00d7`; x.dataset.off = v === 1 ? "0" : "1"; }
     return v;
   }
-  nudgeSpeed(d) { const v = this.setSpeed(this.speed + d); this.status(`${v}\u00d7 — the narration follows the same rate`); }
+  nudgeSpeed(d) { const v = this.reviewerSpeed(this.speed + d); this.status(`${v}\u00d7 — the narration follows the same rate`); }
+  // the reviewer's own change of speed (the drag, or [ and ]); restoring a saved speed is not one
+  reviewerSpeed(r) { const old = this.speed; const v = this.setSpeed(r); this.noteSlow(old, v); return v; }
+
+  // ---- D-005: the moments only a video can report ------------------------------
+  // Two signals, recorded without asking anything of the reviewer: going back more than 2 s, and
+  // slowing down below 1x. They are prompts to explain a step more plainly, not verdicts. Only what
+  // the reviewer does counts; every seek the player makes itself (routing, a question, a replay of
+  // a decision) goes through jump()/seek() and never through here.
+  watchedT() { return this.stage?.dataset.started ? (this.player?.currentTime ?? this._lastT) : 0; }   // before the first play, the poster's seek is not a position
+  momentAt(t) { const f = this.frameAt(t); return { planStep: f?.planStep ?? null, frameIndex: f?.index ?? null }; }
+  noteRewind(from, to) {
+    if (!(from - to > 2)) return;
+    const now = Date.now(), last = this.moments.at(-1);
+    // P P, or a key held down: one trip back, from where it started to where it ended
+    if (last?.kind === "rewind" && now - (this._rewoundAt || 0) < 1500 && Math.abs(from - last.t) < 0.75) Object.assign(last, { t: +to.toFixed(2), ...this.momentAt(to) });
+    else this.moments.push({ kind: "rewind", t: +to.toFixed(2), from: +from.toFixed(2), ...this.momentAt(to) });
+    this._rewoundAt = now; this.persistMoments();
+  }
+  noteSlow(old, v) {
+    if (!(v < 1 && v < old)) return;   // slowing down into below 1x; speeding back up is not a signal
+    const now = Date.now(), last = this.moments.at(-1), t = this.watchedT();
+    // one drag from 1x to 0.5x passes 0.75x on the way: that is one moment at the rate it came to rest
+    if (last?.kind === "slow" && now - (this._slowedAt || 0) < 3000) last.rate = v;
+    else this.moments.push({ kind: "slow", t: +t.toFixed(2), rate: v, ...this.momentAt(t) });
+    this._slowedAt = now; this.persistMoments();
+  }
+  persistMoments() { try { localStorage.setItem(KEY(this.src) + ":moments", JSON.stringify(this.moments)); } catch {} }
 
   async toggleTheme(to) {
     const t = this.player.currentTime || 0, playing = !this.player.paused;
@@ -602,15 +706,16 @@ export class ReelplanningPlayer extends HTMLElement {
     } else {
       this.player.setAttribute("src", this.src);
     }
-    this.player.addEventListener("timeupdate", (e) => { this._lastT = e.detail?.currentTime ?? this.player.currentTime; if (this._lastT > 0.3 && !this.player.paused) this.stage.dataset.started = "1"; if (this._lastT > this._maxT) this._maxT = this._lastT; this.tickDecisions(this._lastT); this.skipUnchanged(this._lastT); this.syncGallery(); this.redraw(); this.syncScrub(); this.updateStatus(); });
+    this.player.addEventListener("timeupdate", (e) => { this._lastT = e.detail?.currentTime ?? this.player.currentTime; if (this._lastT > 0.3 && !this.player.paused) this.stage.dataset.started = "1"; if (this._lastT > this._maxT) this._maxT = this._lastT; this.tickDecisions(this._lastT); this.skipUnchanged(this._lastT); this.applyPicks(); this.syncGallery(); this.redraw(); this.syncScrub(); this.updateStatus(); });
     this.player.addEventListener("play", () => { if (!this._firstPlayAt) this._firstPlayAt = new Date().toISOString(); this.stage.dataset.started = "1"; this.syncPlay(); });
     this.player.addEventListener("pause", () => this.syncPlay());
     this.player.addEventListener("ended", () => this.syncPlay());
-    this.player.addEventListener("ready", () => { this.stage.dataset.ready = "1"; this.hideRuntimeLoader(); this.$(".idle").textContent = `${this.fmt(this.dur())} · Play, or space`; this.renderScrub(); this.syncPlay(); this.redraw(); this.poster(); }); // fires again after a seek loads a new sub-composition
+    this.player.addEventListener("ready", () => { this.stage.dataset.ready = "1"; this.hideRuntimeLoader(); this.$(".idle").textContent = `${this.fmt(this.dur())} · Play, or space`; this.renderScrub(); this.syncPlay(); this.redraw(); this.poster(); this.applyPicks(); }); // fires again after a seek loads a new sub-composition
     const mapUrl = this.getAttribute("plan-map") || this.src.replace(/index\.html$/, "plan-map.json");
     try { this.planMap = await (await fetch(mapUrl)).json(); } catch { this.planMap = null; this.status("no plan-map.json: marks will be time-anchored only"); }
     try { const saved = localStorage.getItem(KEY(this.src)); if (saved) this.annotations = JSON.parse(saved); const sd = localStorage.getItem(KEY(this.src) + ":decisions"); if (sd) this.decisions = JSON.parse(sd); } catch {}
     try { const sq = localStorage.getItem(KEY(this.src) + ":quiz"); if (sq) this.quizzes = JSON.parse(sq); const sa = localStorage.getItem(KEY(this.src) + ":autonomy"); if (sa) this.autonomy = JSON.parse(sa); const sl = localStorage.getItem(KEY(this.src) + ":level"); if (sl) this.level = sl; } catch {}
+    try { const sm = JSON.parse(localStorage.getItem(KEY(this.src) + ":moments") || "[]"); this.moments = Array.isArray(sm) ? sm : []; } catch { this.moments = []; }
     if (this.planMap?.levels) { this.level = this.level || "new"; const box = this.$(".level"); box.hidden = false; const sel = box.querySelector("select"); sel.value = this.level; sel.onchange = () => { this.level = sel.value; try { localStorage.setItem(KEY(this.src) + ":level", this.level); } catch {} this.renderLevel(); }; this.renderLevel(); }
     this.$(".autosec").hidden = !(this.planMap?.autonomy || []).length;
     this.dispatchEvent(new CustomEvent("plan", { detail: this.planMap }));
@@ -721,6 +826,7 @@ export class ReelplanningPlayer extends HTMLElement {
   pos(e) { const r = this.canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
   pointerDown(e) {
     if (!this.tool) return;
+    this.closeMarkBox(true);   // starting the next mark keeps the words typed on the last one
     this.player.pause();
     this.canvas.setPointerCapture(e.pointerId);
     this._drawing = { kind: this.tool, path: [this.pos(e)] };
@@ -735,7 +841,37 @@ export class ReelplanningPlayer extends HTMLElement {
     if (!this._drawing) return;
     const d = this._drawing; this._drawing = null;
     if (d.path.length < 2) return;
-    this.add({ kind: d.kind, path: d.path });
+    const a = this.add({ kind: d.kind, path: d.path });
+    // after the pointer events that follow this one, so nothing moves focus out of the box
+    setTimeout(() => this.openMarkBox(a), 0);
+  }
+  // Step 4 — type on the mark. A finished mark opens a small box beside it on the (still paused)
+  // frame: Enter makes the words that mark's comment, Escape leaves the mark without words. The
+  // drawing and what it means end up in one place instead of two.
+  openMarkBox(a) {
+    if (!a || !this.annotations.includes(a)) return;
+    const box = this.$(".markbox"), inp = box.querySelector("input"), S = this.stage.getBoundingClientRect();
+    if (!S.width) return;
+    this._markFor = a.id; inp.value = a.comment || ""; box.hidden = false;
+    const xs = a.path.map((p) => p[0]), ys = a.path.map((p) => p[1]);
+    const x0 = Math.min(...xs) * S.width, x1 = Math.max(...xs) * S.width, y0 = Math.min(...ys) * S.height, y1 = Math.max(...ys) * S.height;
+    const bw = box.offsetWidth, bh = box.offsetHeight, clampX = (x) => Math.max(8, Math.min(S.width - bw - 8, x)), clampY = (y) => Math.max(8, Math.min(S.height - bh - 8, y));
+    // beside the mark: to its right if that fits, else its left; on a frame too narrow for either
+    // (a phone), under it, else over it — the words should not cover what they are about
+    let left, top;
+    if (x1 + 12 + bw <= S.width - 8) { left = x1 + 12; top = clampY(y0); }
+    else if (x0 - 12 - bw >= 8) { left = x0 - 12 - bw; top = clampY(y0); }
+    else { left = clampX(x0); top = y1 + 12 + bh <= S.height - 8 ? y1 + 12 : clampY(y0 - 12 - bh); }
+    box.style.left = `${Math.round(left)}px`; box.style.top = `${Math.round(top)}px`;
+    this.player.pause(); inp.focus();
+  }
+  closeMarkBox(save, refocus = false) {
+    const box = this.$?.(".markbox"); if (!box || box.hidden) return false;
+    const inp = box.querySelector("input"), text = inp.value.trim(), a = this.annotations.find((x) => x.id === this._markFor);
+    box.hidden = true; this._markFor = null; inp.value = "";
+    if (save && a && text) { a.comment = text; this.persist(); this.renderList(); this.dispatchEvent(new CustomEvent("annotation", { detail: a })); }
+    if (refocus) this.focus();   // back to the player, so the keys work again; a blur leaves focus where the reviewer put it
+    return true;
   }
   add(partial) {
     // an explicit t wins, and the frame and plan anchors follow it: a question's answer belongs to
@@ -799,16 +935,26 @@ export class ReelplanningPlayer extends HTMLElement {
     for (const d of decs) {
       const made = this.decisions[d.id]; if (!made) continue;
       const chosen = d.options.find((o) => o.id === made.option);
-      if (!chosen?.branch) continue;
+      if (!chosen?.branch) {
+        // no branch of its own (a pick-all answer, an own-words answer, an option the storyboard gave
+        // no beat): everything between the question and where the video goes on is someone else's
+        // path. A pick-all answer goes on at its summary frame (D-004), the rest at resumeAt.
+        const to = made.option === "multi" && d.summary ? d.summary.start : d.resumeAt;
+        if (to - d.at > 0.3 && t >= d.at + 0.1 && t < to - 0.1) { this.jump(to); return; }
+        continue;
+      }
       const others = d.options.filter((o) => o.branch && o.id !== chosen.id);
       for (const o of others) if (t >= o.branch.start - 0.05 && t < o.branch.end - 0.1) { // inside an unchosen branch
         const next = t < chosen.branch.start ? chosen.branch.start : d.resumeAt; this.jump(next); return;
       }
     }
   }
-  openCard(kind, key, question, optsHtml, hint) {
+  openCard(kind, key, question, optsHtml, hint, { note = null, confirm = false } = {}) {
     const box = this.$(".decision"); box.querySelector(".k").textContent = key; box.querySelector(".q").textContent = question;
-    const opts = box.querySelector(".opts"); opts.dataset.kind = kind; opts.innerHTML = optsHtml;
+    const opts = box.querySelector(".opts"); opts.dataset.kind = kind; opts.innerHTML = optsHtml; opts.dataset.n = String(opts.children.length);
+    // A note rides on a decision's answer, whichever kind of answer it is (null: this card takes none).
+    const nb = box.querySelector(".note"); nb.hidden = note == null; nb.querySelector("input").value = note || "";
+    const cb = box.querySelector(".confirm"); cb.hidden = !confirm;
     box.querySelector(".hint").textContent = hint; box.querySelector(".feedback").style.display = "none";
     // Every question the player asks goes through here, so the reviewer's own answer belongs here
     // too: a plan review whose options were all written by the plan's author is not a review. The
@@ -818,6 +964,9 @@ export class ReelplanningPlayer extends HTMLElement {
     own.querySelector("textarea").value = "";
     this._folded = false; box.classList.remove("folded");
     this.closePull();   // a question is not asked underneath the record sheet
+    // its letters answer it, so the keyboard has to be here: when the button that led here has
+    // gone (the record's "change" re-renders its row away), focus has fallen to <body>
+    if (!document.activeElement || document.activeElement === document.body) this.focus({ preventScroll: true });
     box.classList.add("on"); this.updateStatus();
   }
   // D-001 — the sheet overlays the lower third at full size, and folds to a pill so the frame it is
@@ -875,7 +1024,8 @@ export class ReelplanningPlayer extends HTMLElement {
       this.closeCard(); this.renderAutonomy(); this.player.play();
     } else {
       const d = p;
-      this.decisions[d.id] = { option: "own", label: text, own: true, recommended: false, planStep: d.planStep, t: d.at, decidedAt: stamp };
+      this.decisions[d.id] = { option: "own", label: text, own: true, recommended: false, planStep: d.planStep, t: d.at, decidedAt: stamp, ...this.noteField() };
+      delete this._redo?.[d.id];
       try { localStorage.setItem(KEY(this.src) + ":decisions", JSON.stringify(this.decisions)); } catch {}
       this.comment(text, d.at, `Answered in their own words: ${d.question || d.id}`);
       this.closeCard(); this.renderDecisions(); this.syncGallery();
@@ -885,19 +1035,85 @@ export class ReelplanningPlayer extends HTMLElement {
     }
     this.updateStatus();
   }
-  closeCard() { const box = this.$(".decision"); box.classList.remove("on", "folded"); this._folded = false; this._pendingDecision = null; if (this._countdown) { clearInterval(this._countdown); this._countdown = null; } this.updateStatus(); }
+  closeCard() { const box = this.$(".decision"); box.classList.remove("on", "folded"); box.querySelector(".confirm").hidden = true; box.querySelector("[data-note]").value = ""; this._folded = false; this._pendingDecision = null; if (this._countdown) { clearInterval(this._countdown); this._countdown = null; } this.updateStatus(); }
+  // a plan decision, as opposed to the quick check and autonomy wrappers that share its sheet
+  // (plan maps now say kind "one" or "multi" on a decision, so `kind` alone no longer tells them apart)
+  isDec(p) { return !!p && p.kind !== "quiz" && p.kind !== "autonomy"; }
+  // a question is waiting for an answer: its sheet is up, not folded, and not already answered
+  asking() {
+    const p = this._pendingDecision; if (!p || this._folded || !this.$(".decision")?.classList.contains("on")) return false;
+    return p.kind === "quiz" ? !this.quizzes[p.q.id] : true;
+  }
   askDecision(d) {
     this._pendingDecision = d; this._askedOnce = { ...(this._askedOnce || {}), [d.id]: true };
     this.player.pause(); this.player.seek(d.at);
+    const was = this._redo?.[d.id];   // "change" reopens a question with what was said last time
+    const multi = d.kind === "multi", keys = d.options.map((o) => o.id.toUpperCase());
+    const keyList = keys.length > 1 ? `${keys.slice(0, -1).join(", ")} or ${keys.at(-1)}` : keys[0];
     // the key is the video's own kicker (CHOICE n · STEP m) in sentence case: one name for the beat
-    this.openCard("decision", `Choice ${this.choiceNo(d)} · step ${d.planStep ?? "?"}`, d.question || d.id,
-      d.options.map((o) => `<button class="opt" data-choose="${o.id}" data-rec="${!!o.recommended}"><b>${esc(o.label)}</b><span>${esc(o.why || "")}</span><em class="tag">${o.recommended ? "recommended" : ""}</em></button>`).join(""),
-      "Pick one — the video plays only that path.");
+    this.openCard(multi ? "multi" : "decision", `Choice ${this.choiceNo(d)} · step ${d.planStep ?? "?"}${multi ? " · pick all that apply" : ""}`, d.question || d.id,
+      d.options.map((o) => {
+        const on = multi && !!was?.options?.includes(o.id);
+        return `<button class="opt" ${multi ? `data-pick="${o.id}" aria-pressed="${on}"` : `data-choose="${o.id}"`} data-rec="${!!o.recommended}" title="${multi ? "Tick or untick" : "Pick"} this — key ${o.id.toUpperCase()}"><kbd class="key">${o.id.toUpperCase()}</kbd><b>${esc(o.label)}</b><span>${esc(o.why || "")}</span><em class="tag">${on ? "picked" : o.recommended ? "recommended" : ""}</em></button>`;
+      }).join(""),
+      multi ? `Tick all that apply — ${keyList} toggle, Enter confirms. ${d.summary ? "The video then shows your picks together." : "The video then goes on."}`
+        : `Pick one — ${keyList} on the keyboard. The video plays only that path.`,
+      { note: was?.note || "", confirm: multi });
+    if (multi) this.syncConfirm();
+  }
+  // ---- pick all that apply (richer review step 2, D-004) ----
+  picked() { return this.$$('.decision .opt[data-pick][aria-pressed="true"]').map((b) => b.dataset.pick); }
+  togglePick(id) {
+    const d = this._pendingDecision; if (!this.isDec(d) || d.kind !== "multi") return;
+    const b = this.$(`.decision .opt[data-pick="${id}"]`); if (!b) return;
+    const on = b.getAttribute("aria-pressed") !== "true", o = d.options.find((x) => x.id === id);
+    b.setAttribute("aria-pressed", String(on)); b.querySelector(".tag").textContent = on ? "picked" : o?.recommended ? "recommended" : "";
+    this.syncConfirm();
+  }
+  syncConfirm() {
+    const b = this.$(".decision .confirm"); if (!b) return; const n = this.picked().length;
+    b.disabled = !n; b.innerHTML = `${n ? `Confirm ${n} pick${n === 1 ? "" : "s"}` : "Tick at least one"} <kbd>&#8629;</kbd>`;
+    b.title = n ? "Confirm your picks (Enter)" : "Tick at least one option first";
+  }
+  confirmMulti() {
+    const d = this._pendingDecision; if (!this.isDec(d) || d.kind !== "multi") return;
+    const set = new Set(this.picked()); const picks = d.options.filter((o) => set.has(o.id)); if (!picks.length) return;
+    const labels = picks.map((o) => o.label);
+    this.decisions[d.id] = { option: "multi", options: picks.map((o) => o.id), labels, label: labels.join(", "), recommended: false, planStep: d.planStep, t: d.at, decidedAt: new Date().toISOString(), ...this.noteField() };
+    this.saveDecisions(); delete this._redo?.[d.id];
+    this.closeCard();
+    this.renderDecisions(); this.syncGallery(); this.applyDecisionToStage(d, { label: labels.join(", ") }); this.applyPicks();
+    this.dispatchEvent(new CustomEvent("decision", { detail: { id: d.id, ...this.decisions[d.id] } }));
+    // D-004: one summary frame of the picks, then on — never a branch per pick
+    this.player.seek(d.summary ? d.summary.start : d.resumeAt);
+    this.player.play();
   }
+  // The summary frame names the picks: elements carrying data-plan-picks="<decision id>" in its
+  // composition are written with the picked labels (a list gets one item per pick; anything else
+  // the labels joined with ", "), the way the resolved-plan frame's step tags are rewritten. It runs
+  // on every tick because the runtime builds a frame's DOM when the frame is reached, and rebuilds
+  // it on a theme switch; a written element is marked and left alone after.
+  applyPicks() {
+    const decs = this.planMap?.decisions || [];
+    if (!decs.some((d) => this.decisions[d.id]?.option === "multi")) return;
+    let doc; try { doc = this.player.iframeElement?.contentDocument; } catch { return; } if (!doc) return;
+    for (const d of decs) {
+      const m = this.decisions[d.id]; if (m?.option !== "multi") continue;
+      const labels = m.labels || [], stamp = labels.join("\u241f");
+      doc.querySelectorAll(`[data-plan-picks="${String(d.id).replace(/["\\]/g, "")}"]`).forEach((el) => {
+        if (el.dataset.rpPicks === stamp) return; el.dataset.rpPicks = stamp;
+        if (/^(UL|OL)$/.test(el.tagName)) el.replaceChildren(...labels.map((l) => { const li = doc.createElement("li"); li.textContent = l; return li; }));
+        else el.textContent = labels.join(", ");
+      });
+    }
+  }
+  noteField() { const v = this.$(".decision [data-note]")?.value.trim(); return v ? { note: v } : {}; }
+  saveDecisions() { try { localStorage.setItem(KEY(this.src) + ":decisions", JSON.stringify(this.decisions)); } catch {} }
   choose(optionId) {
-    const d = this._pendingDecision; if (!d || d.kind) return;
+    const d = this._pendingDecision; if (!this.isDec(d) || d.kind === "multi") return;
     const o = d.options.find((x) => x.id === optionId) || d.options[0];
-    this.decisions[d.id] = { option: o.id, label: o.label, recommended: !!o.recommended, planStep: d.planStep, t: d.at, decidedAt: new Date().toISOString() };
+    this.decisions[d.id] = { option: o.id, label: o.label, recommended: !!o.recommended, planStep: d.planStep, t: d.at, decidedAt: new Date().toISOString(), ...this.noteField() };
+    delete this._redo?.[d.id];
     try { localStorage.setItem(KEY(this.src) + ":decisions", JSON.stringify(this.decisions)); } catch {}
     this.closeCard();
     this.renderDecisions(); this.syncGallery(); this.applyDecisionToStage(d, o);
@@ -912,7 +1128,7 @@ export class ReelplanningPlayer extends HTMLElement {
     this.player.pause(); this.player.seek(q.at);
     this.openCard("quiz", `Quick check · step ${q.planStep ?? "?"}`, q.question || q.id,
       q.options.map((o) => `<button class="opt" data-quiz="${o.id}"><b>${o.id.toUpperCase()}</b><span>${esc(o.label)}</span><em class="tag"></em></button>`).join(""),
-      "Answer to continue.");
+      `Answer to continue — ${q.options.map((o) => o.id.toUpperCase()).join(", ").replace(/, ([^,]*)$/, " or $1")} on the keyboard.`);
   }
   answerQuiz(optionId) {
     const p = this._pendingDecision; if (!p || p.kind !== "quiz") return; const q = p.q; const correct = optionId === q.answer;
@@ -931,8 +1147,8 @@ export class ReelplanningPlayer extends HTMLElement {
     this._pendingDecision = { kind: "autonomy", a }; this._askedOnce = { ...(this._askedOnce || {}), [a.id]: true };
     this.player.pause(); this.player.seek(a.at);
     this.openCard("decision", `Decided during implementation · step ${a.planStep ?? "?"}`, a.chose || a.id,
-      `<button class="opt" data-verdict="accept" data-rec="true"><b>Accept</b><span>${esc(a.why || "")}</span></button><button class="opt" data-verdict="flag"><b>Flag for discussion</b><span>Instead of: ${esc(a.insteadOf || "—")}${a.check ? ` · Check: ${esc(a.check)}` : ""}</span></button>`,
-      "Accept, or flag it; a flag becomes a note on this step.");
+      `<button class="opt" data-verdict="accept" data-rec="true" title="Accept — key A"><kbd class="key">A</kbd><b>Accept</b><span>${esc(a.why || "")}</span></button><button class="opt" data-verdict="flag" title="Flag for discussion — key B"><kbd class="key">B</kbd><b>Flag for discussion</b><span>Instead of: ${esc(a.insteadOf || "—")}${a.check ? ` · Check: ${esc(a.check)}` : ""}</span></button>`,
+      "Accept (A), or flag it (B); a flag becomes a note on this step.");
   }
   judgeAutonomy(verdict) {
     const p = this._pendingDecision; if (!p || p.kind !== "autonomy") return; const a = p.a;
@@ -987,8 +1203,11 @@ export class ReelplanningPlayer extends HTMLElement {
     const points = [...(this.planMap?.decisions || []).map((d) => ({ at: d.at, kind: "choice", name: `Choice ${this.choiceNo(d)}` })), ...(this.planMap?.quizzes || []).map((q) => ({ at: q.at, kind: "check", name: "Quick check" })), ...(this.planMap?.autonomy || []).map((a) => ({ at: a.at, kind: "call", name: "Decided during implementation" }))];
     s.innerHTML = this._segs.map((c, i) => `<i class="seg" data-ch="${c.id}" style="left:calc(${pct(c.start)} + ${i ? GAP / 2 : 0}px);width:calc(${pct(c.end - c.start)} - ${(i ? GAP / 2 : 0) + (i + 1 < this._segs.length ? GAP / 2 : 0)}px)"><b></b></i>`).join("")
       + points.map((p) => `<i class="tick" data-kind="${p.kind}" style="left:${pct(p.at)}" title="${esc(p.name)} · ${this.fmt(p.at)}"></i>`).join("") + `<i class="head"></i><i class="hover"></i>`;
-    L.innerHTML = chs.length > 1 ? `<span class="lbl"></span>` : "";
-    this._lblFor = null;
+    // every part, numbered and named under its own bar, and each one the way to its start
+    const n = this._segs.length;
+    L.innerHTML = chs.length > 1 ? this._segs.map((c, i) => `<button class="part" data-part="${i}" aria-label="Part ${i + 1} of ${n}: ${esc(c.title || "")}" title="${esc(`Part ${i + 1} of ${n} · ${c.title || ""} — click to jump to its start (N next part, P previous; Shift+→ / Shift+← too)`)}"><span class="pn">${i + 1}</span><span class="pt">${esc(c.title || "")}</span></button>`).join("") : "";
+    L.querySelectorAll(".part").forEach((b) => { const seg = () => s.querySelectorAll(".seg")[Number(b.dataset.part)]; b.onpointerenter = () => seg()?.classList.add("hov"); b.onpointerleave = () => seg()?.classList.remove("hov"); });
+    this._partFor = undefined;
     // hovering names the part under the pointer, and the moment you would jump to
     const hover = s.querySelector(".hover");
     s.onpointermove = (e) => {
@@ -1008,12 +1227,64 @@ export class ReelplanningPlayer extends HTMLElement {
     const cur = this.chapterAt(t);
     // each part fills with its own progress, so a finished part reads as finished
     this.shadowRoot.querySelectorAll(".scrub .seg").forEach((el, i) => { const c = this._segs?.[i]; if (!c) return; const f = Math.max(0, Math.min(1, (t - c.start) / ((c.end - c.start) || 1))); el.firstElementChild.style.width = `${(f * 100).toFixed(2)}%`; el.classList.toggle("cur", !!cur && el.dataset.ch === cur.id); });
-    // under the bar, the part you are in, named in full (the others name themselves on hover)
-    const lbl = this.$(".labels .lbl");
-    if (lbl && cur && this._lblFor !== cur.id) { this._lblFor = cur.id; const chs = this.planMap?.chapters || []; const n = chs.findIndex((c) => c.id === cur.id) + 1; lbl.innerHTML = `<span class="n">Part ${n} of ${chs.length} · </span>${esc(cur.title || "")}`; lbl.title = `Part ${n} of ${chs.length} · ${cur.title || ""}`; }
+    // under the bars, the part you are in is the coral one, and is named in full
+    const parts = this.$$(".labels .part");
+    if (parts.length && this._partFor !== (cur?.id ?? null)) {
+      this._partFor = cur?.id ?? null;
+      parts.forEach((b, i) => { const on = this._segs?.[i]?.id === cur?.id; b.setAttribute("aria-current", String(on)); });
+      this.layoutParts();
+    }
     this.$(".now").textContent = this.fmt(t); this.$(".dur").textContent = this.fmt(this.dur());
   }
 
+  // Each part's name sits under its own bar, as wide as the bar. When the part you are in has a
+  // longer name than its bar, it takes the width it needs (up to what leaves the others their
+  // numbers) and the others share the rest in proportion, so the current part is always readable
+  // and every part is still there to click, in order.
+  layoutParts() {
+    const row = this.$?.(".labels"), items = row ? [...row.querySelectorAll(".part")] : [], segs = this._segs || [];
+    if (!items.length || items.length !== segs.length) return;
+    const W = row.clientWidth; if (!W) return;
+    const dur = this.dur() || 1, G = 6, MIN = 22, n = items.length, len = (c) => Math.max(0, c.end - c.start);
+    let lefts = segs.map((c, i) => (c.start / dur) * W + (i ? G / 2 : 0));
+    let widths = segs.map((c, i) => (len(c) / dur) * W - (i ? G / 2 : 0) - (i + 1 < n ? G / 2 : 0));
+    const k = items.findIndex((el) => el.getAttribute("aria-current") === "true");
+    if (k >= 0) {
+      const el = items[k]; el.classList.remove("tight"); el.style.width = "max-content";
+      const natural = Math.ceil(el.getBoundingClientRect().width) + 2;
+      if (natural > widths[k]) {
+        const wk = Math.min(natural, W - (n - 1) * (MIN + G)), rest = W - wk - (n - 1) * G;
+        const others = segs.reduce((sum, c, i) => sum + (i === k ? 0 : len(c)), 0) || 1;
+        widths = segs.map((c, i) => (i === k ? wk : Math.max(MIN, (rest * len(c)) / others)));
+        let x = 0; lefts = widths.map((w) => { const l = x; x += w + G; return l; });
+      }
+    }
+    items.forEach((el, i) => { el.style.left = `${lefts[i].toFixed(1)}px`; el.style.width = `${Math.max(MIN, widths[i]).toFixed(1)}px`; el.classList.toggle("tight", widths[i] < MIN + 30); });
+  }
+  // N / P, Shift+→ / Shift+←, and the part markers: to the start of a part. Going back more than
+  // 2 s this way is a rewind like any other (D-005); going forward never is.
+  jumpPart(dir) {
+    const chs = this.planMap?.chapters || [];
+    if (chs.length < 2) { this.status("this video is one part"); return; }
+    const cur = this.chapterAt(this.watchedT()), i = Math.max(0, chs.indexOf(cur));
+    const j = Math.max(0, Math.min(chs.length - 1, i + dir));
+    if (dir > 0 && j === i) { this.status("this is the last part"); return; }
+    this.goPart(j);
+  }
+  goPart(j) {
+    const chs = this.planMap?.chapters || [], c = chs[j]; if (!c) return;
+    const from = this.watchedT();
+    // arriving at a part's start is not arriving at the end of the part before it: no end-of-part stop
+    if (j > 0) this._chapterShown = { ...(this._chapterShown || {}), [chs[j - 1].id]: true };
+    this.$(".chend").classList.remove("on");
+    // a waiting question folds away rather than hanging over another part; it comes back when the
+    // video reaches it again, as a folded question always does (D-001)
+    if (this._pendingDecision && !this._folded) this.fold(true);
+    this.start(); this.closePull(); this.jump(c.start);
+    this.noteRewind(from, c.start);
+    this.status(`part ${j + 1} of ${chs.length} · ${c.title || ""}`);
+  }
+
   syncPlay() { const b = this.$('[data-act="play"]'); const playing = !!this.player && !this.player.paused; b.textContent = playing ? "Pause" : "Play"; b.setAttribute("aria-label", playing ? "Pause (space)" : "Play (space)"); this.updateStatus(); }
   // Step 3 — one home per question. A question is asked in exactly one place, the sheet on the video;
   // this is the record of what has been ANSWERED. The ones still to come are a count, not a second
@@ -1022,7 +1293,7 @@ export class ReelplanningPlayer extends HTMLElement {
     const el = this.$(".decisions"); const decs = this.planMap?.decisions || [], qs = this.planMap?.quizzes || [];
     const said = (r, q) => r.answer === "own" ? `<span><b>Answered in their own words</b></span>` : r.correct ? `<span><b>Right</b> (${r.answer.toUpperCase()})</span>` : `<span><b>Not quite</b> — you said ${r.answer.toUpperCase()}, it is ${q.answer.toUpperCase()}</span>`;
     const rows = [
-      ...decs.filter((d) => this.decisions[d.id]).map((d) => { const m = this.decisions[d.id]; return { at: d.at, html: `<div class="dec"><span class="k">Choice ${this.choiceNo(d)} · step ${d.planStep ?? "?"} · ${this.fmt(d.at)}</span><div class="q">${esc(d.question || "")}</div><div class="a"><b>${esc(m.label)}</b><button class="lnk" data-redo="${d.id}">change</button></div></div>` }; }),
+      ...decs.filter((d) => this.decisions[d.id]).map((d) => { const m = this.decisions[d.id]; return { at: d.at, html: `<div class="dec"><span class="k">Choice ${this.choiceNo(d)} · step ${d.planStep ?? "?"} · ${this.fmt(d.at)}</span><div class="q">${esc(d.question || "")}</div><div class="a"><b>${esc(m.label)}</b><button class="lnk" data-redo="${d.id}">change</button></div><textarea class="dnote" rows="1" data-dnote="${d.id}" placeholder="Add a note to this answer" aria-label="Your note on this answer">${esc(m.note || "")}</textarea></div>` }; }),
       ...qs.filter((q) => this.quizzes[q.id]).map((q) => { const r = this.quizzes[q.id]; return { at: q.at, html: `<div class="dec"><span class="k">Quick check · step ${q.planStep ?? "?"} · ${this.fmt(q.at)}</span><div class="q">${esc(q.question || "")}</div><div class="a">${said(r, q)}</div></div>` }; }),
     ].sort((a, b) => a.at - b.at);
     const left = decs.filter((d) => !this.decisions[d.id]).length + qs.filter((q) => !this.quizzes[q.id]).length;
@@ -1031,6 +1302,9 @@ export class ReelplanningPlayer extends HTMLElement {
     el.innerHTML = decs.length || qs.length ? (rows.map((r) => r.html).join("") + waiting) : `<p class="empty">No decisions in this plan.</p>`;
     // the "0 of 3 decided" that used to ride on the status line belongs to the list that owns it
     const c = this.$(".decs .count"); if (c) c.textContent = decs.length ? ` · ${made} of ${decs.length}` : "";
+    // the note on an answer stays editable here, after the question has gone
+    const grow = (ta) => { ta.style.height = "auto"; ta.style.height = `${ta.scrollHeight}px`; };
+    el.querySelectorAll("textarea[data-dnote]").forEach((ta) => { grow(ta); ta.addEventListener("input", () => grow(ta)); ta.addEventListener("change", () => { const m = this.decisions[ta.dataset.dnote]; if (!m) return; const v = ta.value.trim(); if (v) m.note = v; else delete m.note; this.saveDecisions(); }); });
     this.syncPull();   // the peek's live count of decisions moves with what has been answered
   }
   // Step 5 — one fact per line. This line says what is happening NOW and nothing else. Every other
@@ -1093,10 +1367,12 @@ export class ReelplanningPlayer extends HTMLElement {
     const b = e.target.closest("button"); if (!b) return;
     if (b.dataset.review) { this.setVerdict(b.dataset.review); this.showHandoff({ finishing: this._finishing }); return; } // data-verdict is the walkthrough's Accept/Flag
     if (b.dataset.tool) { this.setTool(this.tool === b.dataset.tool ? null : b.dataset.tool); return; }
+    if (b.dataset.part != null) { this.goPart(Number(b.dataset.part)); return; }
+    if (b.dataset.pick) { this.togglePick(b.dataset.pick); return; }
     if (b.dataset.quiz) { this.answerQuiz(b.dataset.quiz); return; }
     if (b.dataset.verdict) { this.judgeAutonomy(b.dataset.verdict); return; }
     if (b.dataset.choose) { this.choose(b.dataset.choose); return; }
-    if (b.dataset.redo) { const d = (this.planMap?.decisions || []).find((x) => x.id === b.dataset.redo); if (d) { delete this.decisions[d.id]; delete this._askedOnce?.[d.id]; try { localStorage.setItem(KEY(this.src) + ":decisions", JSON.stringify(this.decisions)); } catch {} this.renderDecisions(); this.syncGallery(); this.updateStatus(); this.closePull(); this.player.seek(Math.max(0, d.at - 8)); this.player.play(); } return; }
+    if (b.dataset.redo) { const d = (this.planMap?.decisions || []).find((x) => x.id === b.dataset.redo); if (d) { this._redo = { ...(this._redo || {}), [d.id]: this.decisions[d.id] }; delete this.decisions[d.id]; delete this._askedOnce?.[d.id]; try { localStorage.setItem(KEY(this.src) + ":decisions", JSON.stringify(this.decisions)); } catch {} this.renderDecisions(); this.syncGallery(); this.updateStatus(); this.closePull(); this.focus({ preventScroll: true }); this.player.seek(Math.max(0, d.at - 8)); this.player.play(); } return; }
     if (b.dataset.jump) { this.start(); this.closePull(); this.player.seek(Number(b.dataset.jump)); this.player.pause(); return; }
     if (b.dataset.del) { this.annotations = this.annotations.filter((a) => a.id !== b.dataset.del); this.persist(); this.renderList(); this.redraw(); this.syncClear(); this.updateStatus(); return; }
     switch (b.dataset.act) {
@@ -1105,6 +1381,7 @@ export class ReelplanningPlayer extends HTMLElement {
       case "post": this.postComment(); break;
       case "own": this.openOwn(); break;
       case "own-save": this.answerOwn(); break;
+      case "confirm": this.confirmMulti(); break;
       case "only": this.toggleOnly(); break;
       case "fold": this.fold(true); break;
       case "unfold": this.fold(false); break;
@@ -1139,10 +1416,33 @@ export class ReelplanningPlayer extends HTMLElement {
     // the element actually under the keystroke is the first entry of the composed path.
     const el = e.composedPath()[0] || e.target;
     if (/^(TEXTAREA|INPUT|SELECT)$/.test(el.tagName) || el.isContentEditable) return;
+    if (e.ctrlKey || e.metaKey || e.altKey) return;   // the browser's own shortcuts (copy, reload…) are not ours
+    // parts: Shift+arrows as well as N / P, because arrows are where people look for "next"
+    if (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); this.jumpPart(e.key === "ArrowRight" ? 1 : -1); return; }
+    // A question is waiting: its letters answer it. A–D pick an option (tick one, on a pick-all
+    // question, and Enter confirms); on a call the agent made, A accepts and B flags; O opens an
+    // answer in your own words. While it waits, A–D are never the drawing tools and C never copies
+    // — fold the question away first to mark the frame it is about.
+    const p = this._pendingDecision;
+    if (p && !this._folded && this.$(".decision").classList.contains("on")) {
+      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, open = this.asking();
+      if (/^[a-d]$/.test(k)) {
+        e.preventDefault();
+        if (!open) return;   // a quick check already answered, counting down: the letters are still not tools
+        if (p.kind === "quiz") { if (p.q.options.some((o) => o.id === k)) this.answerQuiz(k); }
+        else if (p.kind === "autonomy") { if (k === "a") this.judgeAutonomy("accept"); else if (k === "b") this.judgeAutonomy("flag"); }
+        else if (p.options.some((o) => o.id === k)) { if (p.kind === "multi") this.togglePick(k); else this.choose(k); }
+        return;
+      }
+      if (k === "o" && open) { e.preventDefault(); this.openOwn(); return; }
+      if (e.key === "Enter" && this.isDec(p) && p.kind === "multi") { e.preventDefault(); this.confirmMulti(); return; }
+    }
     // The shapes have no buttons of their own until Mark is on, so the keys drive the tool directly
     // rather than clicking chrome that may not be in the DOM.
     const map = { d: "stroke", a: "arrow", b: "box" };
     if (map[e.key]) { const t = map[e.key]; this.setTool(this.tool === t ? null : t); }
+    else if (e.key === "n" || e.key === "N") this.jumpPart(1);
+    else if (e.key === "p" || e.key === "P") this.jumpPart(-1);
     else if (e.key === "t") this.toggleTheme();
     else if (e.key === "m") this.$('[data-act="mute"]').click();
     else if (e.key === "/") { e.preventDefault(); this.focusComment(); }
@@ -1157,6 +1457,9 @@ export class ReelplanningPlayer extends HTMLElement {
   // One Escape, one step back — the same order a reviewer opened things in, undone in reverse.
   // A question itself does not close this way: fold/unfold are its own explicit act.
   onEscape() {
+    if (this.closeMarkBox(false, true)) return;   // the mark stays, without words
+    const note = this.$(".decision [data-note]");
+    if (this.shadowRoot.activeElement === note) { note.blur(); this.focus(); return; }   // the note is kept
     const own = this.$(".own");
     if (own.classList.contains("open")) { own.classList.remove("open"); own.querySelector("textarea").value = ""; this.focus(); return; }
     const handoff = this.$(".handoff");
@@ -1250,7 +1553,8 @@ export class ReelplanningPlayer extends HTMLElement {
         const q = d?.question || id;
         const step = d?.planStep ? ` · step ${d.planStep}` : "";
         L.push(`**${q}**${step}`);
-        L.push(v.own ? `→ in my own words: ${v.own}` : `→ ${v.label || v.option}`);
+        L.push(v.option === "own" ? `→ in my own words: ${v.label}` : v.option === "multi" ? `→ ${v.label} (all that apply)` : `→ ${v.label || v.option}`);
+        if (v.note) L.push(`  Note: ${v.note}`);
         L.push("");
       }
     }
@@ -1468,7 +1772,8 @@ export class ReelplanningPlayer extends HTMLElement {
   exportPayload() {
     const dur = this.player.duration || this.planMap?.totalSeconds || 0;
     return { version: 1, src: this.src, project: this.planMap?.project || null, exportedAt: new Date().toISOString(),
-      watch: { firstPlayAt: this._firstPlayAt, maxTimeReached: +this._maxT.toFixed(2), durationSeconds: +dur.toFixed(2), completion: dur ? +Math.min(1, this._maxT / dur).toFixed(3) : null, chapters: (this.planMap?.chapters || []).map((c) => ({ id: c.id, completion: +Math.max(0, Math.min(1, (this._maxT - c.start) / (c.end - c.start))).toFixed(3) })) },
+      watch: { firstPlayAt: this._firstPlayAt, maxTimeReached: +this._maxT.toFixed(2), durationSeconds: +dur.toFixed(2), completion: dur ? +Math.min(1, this._maxT / dur).toFixed(3) : null, chapters: (this.planMap?.chapters || []).map((c) => ({ id: c.id, completion: +Math.max(0, Math.min(1, (this._maxT - c.start) / (c.end - c.start))).toFixed(3) })),
+        moments: this.moments.map((m) => ({ ...m })) },
       decisions: Object.entries(this.decisions).map(([id, v]) => ({ id, ...v })),
       quizzes: Object.entries(this.quizzes).map(([id, v]) => ({ id, ...v })),
       autonomy: Object.entries(this.autonomy).map(([id, v]) => ({ id, ...v })),
diff --git a/packages/player/test/controls.spec.mjs b/packages/player/test/controls.spec.mjs
index 804e4ed..955c6df 100644
--- a/packages/player/test/controls.spec.mjs
+++ b/packages/player/test/controls.spec.mjs
@@ -37,7 +37,7 @@ ok((await theme()).pressed === "false", "and clicking again comes back to light"
 // ---- the timeline: one bar per part, clear gaps, each part filling on its own, the current part named in full
 const bar = () => p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, s = r.querySelector(".scrub");
   const segs = [...s.querySelectorAll(".seg")].map((e) => e.getBoundingClientRect());
-  return { n: segs.length, gaps: segs.slice(1).map((g, i) => Math.round(g.left - segs[i].right)), h: Math.round(segs[0]?.height || 0), fills: [...s.querySelectorAll(".seg>b")].map((b) => parseFloat(b.style.width) || 0), label: r.querySelector(".labels").textContent, chapters: (document.querySelector("#rp").planMap.chapters || []).length }; });
+  return { n: segs.length, gaps: segs.slice(1).map((g, i) => Math.round(g.left - segs[i].right)), h: Math.round(segs[0]?.height || 0), fills: [...s.querySelectorAll(".seg>b")].map((b) => parseFloat(b.style.width) || 0), label: (() => { const c = r.querySelector('.labels .part[aria-current="true"]'), pt = c?.querySelector(".pt"); return c ? { i: Number(c.dataset.part), n: c.querySelector(".pn").textContent, text: pt.textContent, full: pt.scrollWidth <= pt.clientWidth + 1 } : null; })(), parts: r.querySelectorAll(".labels .part").length, chapters: (document.querySelector("#rp").planMap.chapters || []).length }; });
 let sb = await bar();
 if (sb.chapters > 1) {
   ok(sb.n === sb.chapters && sb.gaps.every((g) => g >= 4), `one bar per part, with gaps you can see — ${sb.gaps.join(", ")} px`);
@@ -48,7 +48,8 @@ if (sb.chapters > 1) {
   sb = await bar();
   const k = sb.fills.findIndex((f) => f < 100);
   ok(k >= 0 && sb.fills[k] > 0 && sb.fills.slice(0, k).every((f) => f === 100) && sb.fills.slice(k + 1).every((f) => f === 0), `finished parts are full, the current one partly, the rest empty — ${sb.fills.map((f) => Math.round(f)).join(" / ")}`);
-  ok(new RegExp(`^Part ${k + 1} of ${sb.chapters} · .{8,}`).test(sb.label) && !/…$/.test(sb.label), `under the bar, the part you are in, named in full — "${sb.label}"`);
+  // every part is numbered under its bar now; the one you are in is marked and named in full
+  ok(sb.parts === sb.chapters && sb.label?.i === k && sb.label.n === String(k + 1) && sb.label.text.length >= 8 && sb.label.full, `under the bars, every part numbered, and the one you are in named in full — "${sb.label?.n} ${sb.label?.text}"`);
   await p.mouse.move(sc.x + sc.width * 0.95, sc.y + sc.height / 2); await p.waitForTimeout(200);
   const hv = await p.evaluate(() => { const h = document.querySelector("#rp").shadowRoot.querySelector(".scrub .hover"); return { on: h.classList.contains("on"), text: h.textContent, italic: getComputedStyle(h).fontStyle }; });
   ok(hv.on && new RegExp(`^Part ${sb.chapters} · `).test(hv.text) && hv.italic === "normal", `hovering a part names it and its moment — "${hv.text}"`);
diff --git a/packages/player/test/fixtures/l2-richer.json b/packages/player/test/fixtures/l2-richer.json
new file mode 100644
index 0000000..c9d9e1d
--- /dev/null
+++ b/packages/player/test/fixtures/l2-richer.json
@@ -0,0 +1,877 @@
+{
+ "project": "l2-upload-resume",
+ "title": "Richer review fixture: four options, pick all that apply",
+ "planDir": "eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume",
+ "totalSeconds": 216.491,
+ "chapters": [
+  {
+   "id": "ch1",
+   "title": "The problem and step 1",
+   "fromFrame": 1,
+   "toFrame": 7,
+   "start": 0,
+   "end": 70.293,
+   "linearSeconds": 70.293,
+   "watchedSeconds": 64.533,
+   "decisions": [
+    "q1"
+   ]
+  },
+  {
+   "id": "ch2",
+   "title": "Steps 2 to 4",
+   "fromFrame": 8,
+   "toFrame": 13,
+   "start": 70.293,
+   "end": 153.473,
+   "linearSeconds": 83.18,
+   "watchedSeconds": 74.625,
+   "decisions": [
+    "q2"
+   ]
+  },
+  {
+   "id": "ch3",
+   "title": "Steps 5 and 6, and the resolved plan",
+   "fromFrame": 14,
+   "toFrame": 19,
+   "start": 153.473,
+   "end": 216.491,
+   "linearSeconds": 63.018,
+   "watchedSeconds": 57.898,
+   "decisions": [
+    "q3"
+   ]
+  }
+ ],
+ "quizzes": [
+  {
+   "id": "ktest",
+   "frameIndex": 8,
+   "planStep": 2,
+   "question": "Send part one twice. What does the second PUT do?",
+   "options": [
+    {
+     "id": "a",
+     "label": "stores it again"
+    },
+    {
+     "id": "b",
+     "label": "sees the bit and does nothing"
+    },
+    {
+     "id": "c",
+     "label": "fails the upload"
+    }
+   ],
+   "answer": "b",
+   "explain": "the bit is already set; the PUT is idempotent",
+   "at": 81.224
+  }
+ ],
+ "autonomy": [
+  {
+   "id": "atest",
+   "frameIndex": 9,
+   "planStep": 3,
+   "chose": "complete returns 409 when bits are missing",
+   "insteadOf": "400",
+   "why": "409 reads as a state conflict, which it is",
+   "check": "src/upload/complete.ts",
+   "at": 96.367
+  }
+ ],
+ "watchedSeconds": 197.056,
+ "frames": [
+  {
+   "index": 1,
+   "title": "The upload that dies at 90 percent",
+   "compositionId": "01-hook",
+   "type": "hook",
+   "durationSeconds": 8.363,
+   "planStep": null,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": "The problem and step 1",
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 0,
+   "thumb": "snapshots/frame-00-at-4.28s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 1
+   }
+  },
+  {
+   "index": 2,
+   "title": "The fix you'd reach for",
+   "compositionId": "02-tension",
+   "type": "pain_point",
+   "durationSeconds": 9.301,
+   "planStep": null,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 8.363,
+   "thumb": "snapshots/frame-01-at-12.8s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 2
+   }
+  },
+  {
+   "index": 3,
+   "title": "6 pieces",
+   "compositionId": "03-pretrain",
+   "type": "product_intro",
+   "durationSeconds": 7.68,
+   "planStep": null,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": [
+    "new",
+    "familiar"
+   ],
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 17.664,
+   "thumb": "snapshots/frame-02-at-20.92s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 3
+   }
+  },
+  {
+   "index": 4,
+   "title": "Step 1: write the manifest first",
+   "compositionId": "04-step-1",
+   "type": "feature_showcase",
+   "durationSeconds": 15.403,
+   "planStep": 1,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 25.344,
+   "thumb": "snapshots/frame-03-at-31.83s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 4
+   }
+  },
+  {
+   "index": 5,
+   "title": "Where does the manifest live?",
+   "compositionId": "05-decision-1",
+   "type": "cta",
+   "durationSeconds": 17.749,
+   "planStep": 1,
+   "planQuestions": [],
+   "decision": "q1",
+   "branch": null,
+   "question": "Where does the manifest live?",
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [
+    {
+     "id": "a",
+     "label": "Postgres",
+     "why": "parts_done flips in the same transaction as the part write; one more table to migrate",
+     "recommended": true
+    },
+    {
+     "id": "b",
+     "label": "S3 object",
+     "why": "all upload state in one system; every part becomes an ETag-conditional write with retries, about a day more in step 2",
+     "recommended": false
+    }
+   ],
+   "start": 40.747,
+   "thumb": "snapshots/frame-04-at-47.57s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 5
+   }
+  },
+  {
+   "index": 6,
+   "title": "If Postgres",
+   "compositionId": "06-branch-1a",
+   "type": "benefit_highlight",
+   "durationSeconds": 6.037,
+   "planStep": 1,
+   "planQuestions": [],
+   "decision": null,
+   "branch": "q1=a",
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 58.496,
+   "thumb": "snapshots/frame-05-at-58.86s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 6
+   }
+  },
+  {
+   "index": 7,
+   "title": "If S3",
+   "compositionId": "07-branch-1b",
+   "type": "benefit_highlight",
+   "durationSeconds": 5.76,
+   "planStep": 1,
+   "planQuestions": [],
+   "decision": null,
+   "branch": "q1=b",
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 64.533,
+   "thumb": "snapshots/frame-06-at-64.45s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 7
+   }
+  },
+  {
+   "index": 8,
+   "title": "Step 2: chunked, idempotent parts",
+   "compositionId": "08-step-2",
+   "type": "feature_showcase",
+   "durationSeconds": 15.211,
+   "planStep": 2,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": "Steps 2 to 4",
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 70.293,
+   "thumb": "snapshots/frame-07-at-74.37s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 8
+   }
+  },
+  {
+   "index": 9,
+   "title": "Step 3: resume",
+   "compositionId": "09-step-3",
+   "type": "feature_showcase",
+   "durationSeconds": 15.915,
+   "planStep": 3,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 85.504,
+   "thumb": "snapshots/frame-08-at-89.1s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 9
+   }
+  },
+  {
+   "index": 10,
+   "title": "Step 4: bill on completion, once",
+   "compositionId": "10-step-4",
+   "type": "feature_showcase",
+   "durationSeconds": 14.891,
+   "planStep": 4,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 101.419,
+   "thumb": "snapshots/frame-09-at-103.6s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 10
+   }
+  },
+  {
+   "index": 11,
+   "title": "Who owns the idempotency key?",
+   "compositionId": "11-decision-2",
+   "type": "cta",
+   "durationSeconds": 23.232,
+   "planStep": 4,
+   "planQuestions": [],
+   "decision": "q2",
+   "branch": null,
+   "question": "Who owns the idempotency key?",
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [
+    {
+     "id": "a",
+     "label": "Server id",
+     "why": "the manifest id is the key; no SDK change beyond step 6; a client that loses it starts over and pays once per completed file",
+     "recommended": true
+    },
+    {
+     "id": "b",
+     "label": "Client key",
+     "why": "survives a client that retries POST /uploads itself; costs a (customer, key) unique index, a 409 path, and SDK changes in every language",
+     "recommended": false
+    }
+   ],
+   "start": 116.31,
+   "thumb": "snapshots/frame-10-at-121.43s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 11
+   }
+  },
+  {
+   "index": 12,
+   "title": "If server id",
+   "compositionId": "12-branch-2a",
+   "type": "benefit_highlight",
+   "durationSeconds": 5.376,
+   "planStep": 4,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 139.542,
+   "thumb": "snapshots/frame-12-at-141.43s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 12
+   }
+  },
+  {
+   "index": 13,
+   "title": "If client key",
+   "compositionId": "13-branch-2b",
+   "type": "benefit_highlight",
+   "durationSeconds": 8.555,
+   "planStep": 4,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 144.918,
+   "thumb": "snapshots/frame-13-at-153.74s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 13
+   },
+   "summary": "q2"
+  },
+  {
+   "index": 14,
+   "title": "Step 5: the sweeper",
+   "compositionId": "14-step-5",
+   "type": "feature_showcase",
+   "durationSeconds": 17.429,
+   "planStep": 5,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": "Steps 5 and 6, and the resolved plan",
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 153.473,
+   "thumb": "snapshots/frame-13-at-153.74s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 14
+   }
+  },
+  {
+   "index": 15,
+   "title": "How long before an upload is abandoned?",
+   "compositionId": "15-decision-3",
+   "type": "cta",
+   "durationSeconds": 20.949,
+   "planStep": 5,
+   "planQuestions": [],
+   "decision": "q3",
+   "branch": null,
+   "question": "How long before an upload is abandoned?",
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [
+    {
+     "id": "a",
+     "label": "24 hours",
+     "why": "bounds blob storage at one day of interrupted uploads; mobile clients on flaky networks almost always retry within hours",
+     "recommended": true
+    },
+    {
+     "id": "b",
+     "label": "7 days",
+     "why": "safer for very large uploads over bad links; up to a week of orphaned parts per abandoned upload and a sweeper scan that grows with it",
+     "recommended": false
+    }
+   ],
+   "start": 170.902,
+   "thumb": "snapshots/frame-14-at-171.74s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 15
+   }
+  },
+  {
+   "index": 16,
+   "title": "If 24 hours",
+   "compositionId": "16-branch-3a",
+   "type": "benefit_highlight",
+   "durationSeconds": 5.547,
+   "planStep": 5,
+   "planQuestions": [],
+   "decision": null,
+   "branch": "q3=a",
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 191.851,
+   "thumb": "snapshots/frame-17-at-195.6s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 16
+   }
+  },
+  {
+   "index": 17,
+   "title": "If 7 days",
+   "compositionId": "17-branch-3b",
+   "type": "benefit_highlight",
+   "durationSeconds": 5.12,
+   "planStep": 5,
+   "planQuestions": [],
+   "decision": null,
+   "branch": "q3=b",
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 197.398,
+   "thumb": "snapshots/frame-19-at-203.07s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 17
+   }
+  },
+  {
+   "index": 18,
+   "title": "Step 6: the SDK resumes",
+   "compositionId": "18-step-6",
+   "type": "feature_showcase",
+   "durationSeconds": 8.448,
+   "planStep": 6,
+   "planQuestions": [],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 202.518,
+   "thumb": "snapshots/frame-19-at-203.07s.png",
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 18
+   }
+  },
+  {
+   "index": 19,
+   "title": "The plan, resolved",
+   "compositionId": "19-resolved",
+   "type": "cta",
+   "durationSeconds": 5.525,
+   "planStep": null,
+   "planQuestions": [
+    1,
+    2,
+    3
+   ],
+   "decision": null,
+   "branch": null,
+   "question": null,
+   "chapterStart": null,
+   "knowledge": null,
+   "quiz": null,
+   "answer": null,
+   "explain": null,
+   "autonomy": null,
+   "chose": null,
+   "insteadOf": null,
+   "why": null,
+   "check": null,
+   "options": [],
+   "start": 210.966,
+   "change": {
+    "status": "restyled",
+    "said": false,
+    "shown": false,
+    "retimed": true,
+    "wasIndex": 19
+   }
+  }
+ ],
+ "decisions": [
+  {
+   "id": "q1",
+   "frameIndex": 5,
+   "compositionId": "05-decision-1",
+   "planStep": 1,
+   "question": "Where does the manifest live?",
+   "at": 58.446,
+   "resumeAt": 70.293,
+   "options": [
+    {
+     "id": "a",
+     "label": "Postgres",
+     "why": "parts_done flips in the same transaction as the part write; one more table to migrate",
+     "recommended": true,
+     "branch": {
+      "frameIndex": 6,
+      "compositionId": "06-branch-1a",
+      "start": 58.496,
+      "end": 64.533
+     }
+    },
+    {
+     "id": "b",
+     "label": "S3 object",
+     "why": "all upload state in one system; every part becomes an ETag-conditional write with retries, about a day more in step 2",
+     "recommended": false,
+     "branch": {
+      "frameIndex": 7,
+      "compositionId": "07-branch-1b",
+      "start": 64.533,
+      "end": 70.293
+     }
+    },
+    {
+     "id": "c",
+     "label": "Redis with a TTL",
+     "why": "fast writes and expiry for free; the manifest is lost if Redis restarts before the upload completes",
+     "recommended": false,
+     "branch": null
+    },
+    {
+     "id": "d",
+     "label": "A file next to the parts",
+     "why": "no new service at all; listing a million uploads means listing a million prefixes",
+     "recommended": false,
+     "branch": null
+    }
+   ],
+   "kind": "one",
+   "summary": null
+  },
+  {
+   "id": "q2",
+   "frameIndex": 11,
+   "compositionId": "11-decision-2",
+   "planStep": 4,
+   "question": "Which clients get resume first?",
+   "at": 139.492,
+   "resumeAt": 153.473,
+   "options": [
+    {
+     "id": "a",
+     "label": "Web uploader",
+     "why": "most of the failed uploads today; one codebase",
+     "recommended": true,
+     "branch": null
+    },
+    {
+     "id": "b",
+     "label": "iOS app",
+     "why": "flaky networks, the longest uploads; needs a background session",
+     "recommended": false,
+     "branch": null
+    },
+    {
+     "id": "c",
+     "label": "Android app",
+     "why": "same failure mode as iOS; the upload library already retries parts",
+     "recommended": false,
+     "branch": null
+    },
+    {
+     "id": "d",
+     "label": "Public API and SDKs",
+     "why": "customers who script uploads; every SDK needs the manifest id",
+     "recommended": false,
+     "branch": null
+    }
+   ],
+   "kind": "multi",
+   "summary": {
+    "frameIndex": 13,
+    "compositionId": "13-branch-2b",
+    "start": 144.918,
+    "end": 153.473
+   }
+  },
+  {
+   "id": "q3",
+   "frameIndex": 15,
+   "compositionId": "15-decision-3",
+   "planStep": 5,
+   "question": "How long before an upload is abandoned?",
+   "at": 191.801,
+   "resumeAt": 202.518,
+   "options": [
+    {
+     "id": "a",
+     "label": "24 hours",
+     "why": "bounds blob storage at one day of interrupted uploads; mobile clients on flaky networks almost always retry within hours",
+     "recommended": true,
+     "branch": {
+      "frameIndex": 16,
+      "compositionId": "16-branch-3a",
+      "start": 191.851,
+      "end": 197.398
+     }
+    },
+    {
+     "id": "b",
+     "label": "7 days",
+     "why": "safer for very large uploads over bad links; up to a week of orphaned parts per abandoned upload and a sweeper scan that grows with it",
+     "recommended": false,
+     "branch": {
+      "frameIndex": 17,
+      "compositionId": "17-branch-3b",
+      "start": 197.398,
+      "end": 202.518
+     }
+    }
+   ],
+   "kind": "one",
+   "summary": null
+  }
+ ]
+}
\ No newline at end of file
diff --git a/packages/player/test/review-keys.spec.mjs b/packages/player/test/review-keys.spec.mjs
new file mode 100644
index 0000000..a471a62
--- /dev/null
+++ b/packages/player/test/review-keys.spec.mjs
@@ -0,0 +1,267 @@
+#!/usr/bin/env node
+// The review player after the richer-review plan and the owner's requests on it:
+//   parts you can see and jump between (N / P, Shift+arrows, the numbered part markers),
+//   questions answered from the keyboard (A–D, O, Enter), a note on any answer,
+//   sound reset once (rp:muted -> rp:muted:v2), up to four options, pick all that apply with one
+//   summary frame (D-004), words typed on a mark, and the rewind / slow-down moments (D-005).
+// Runs on L2 with a fixture map: q1 has four options (c and d without a branch), q2 is pick-all
+// with a summary frame, plus the quick check and the agent's call from the quiz fixture.
+// usage: node packages/player/test/review-keys.spec.mjs [videos/<project>] [fixture map]
+import { chromium } from "playwright-core"; import { spawn } from "node:child_process";
+import { launchOpts, ROOT } from "../../../scripts/lib/env.mjs";
+const project = process.argv[2] || "videos/l2-upload-resume";
+const map = process.argv[3] || "packages/player/test/fixtures/l2-richer.json";
+const port = 8877;
+const srv = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: ROOT, stdio: "ignore" });
+await new Promise((r) => setTimeout(r, 900));
+const b = await chromium.launch(launchOpts());
+const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
+const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
+const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
+const open = async (w = 1440, h = 1000, before = null) => {
+  const p = await b.newPage({ viewport: { width: w, height: h } });
+  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
+  await p.goto(url);
+  await p.evaluate((before) => { try { localStorage.clear(); if (before) for (const [k, v] of Object.entries(before)) localStorage.setItem(k, v); } catch {} }, before);
+  await p.reload(); await ready(p); await p.waitForTimeout(600);
+  return p;
+};
+const T = (p) => p.evaluate(() => { const pl = document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player"); return { t: pl.currentTime, paused: pl.paused }; });
+const sheetOn = (p) => p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"));
+const seekPause = (p, t) => p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, t);
+// play into a question the way a reviewer does: from a moment before it, with the Play button
+const playInto = async (p, at) => {
+  await seekPause(p, at - 1.2); await p.waitForTimeout(300);
+  await p.locator("#rp").locator('[data-act="play"]').click();
+  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
+  await p.waitForTimeout(250);
+};
+
+// ---- 5. sound: the old remembered mute is ignored once; the new key is the one that sticks
+{
+  const p = await open(1440, 1000, { "rp:muted": "1" });
+  const m = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { muted: r.querySelector("hyperframes-player").muted, pressed: r.querySelector('[data-act="mute"]').getAttribute("aria-pressed") }; });
+  ok(!m.muted && m.pressed === "false", "a viewer muted under the old rp:muted key starts with sound");
+  await p.locator("#rp").locator('[data-act="mute"]').click(); await p.waitForTimeout(200);
+  const keys = await p.evaluate(() => ({ v2: localStorage.getItem("rp:muted:v2"), old: localStorage.getItem("rp:muted") }));
+  ok(keys.v2 === "1" && keys.old === "1", `muting now writes rp:muted:v2 and never touches the old key — ${JSON.stringify(keys)}`);
+  await p.reload(); await ready(p);
+  ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector("hyperframes-player").muted), "and the new key survives a reload");
+  await p.close();
+}
+
+// ---- 2 + 9. parts: numbered markers under the bars, N / P / Shift+arrows, and which jumps are rewinds
+{
+  const p = await open();
+  const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
+  const chs = pm.chapters;
+  const parts = () => p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".labels .part")].map((x) => { const pt = x.querySelector(".pt"); return { n: x.querySelector(".pn").textContent, cur: x.getAttribute("aria-current"), title: x.title, full: pt.scrollWidth <= pt.clientWidth + 1 && getComputedStyle(pt).display !== "none", text: pt.textContent }; }));
+  let ps = await parts();
+  ok(ps.length === chs.length && ps.map((x) => x.n).join() === chs.map((_, i) => i + 1).join(), `one numbered marker per part — ${ps.map((x) => x.n).join(" ")}`);
+  ok(ps.every((x) => /N next part, P previous/.test(x.title) && /Shift\+→/.test(x.title)), "each marker's tooltip names the keys");
+  await seekPause(p, 95); await p.waitForTimeout(500);
+  ps = await parts();
+  ok(ps[1].cur === "true" && ps.filter((x) => x.cur === "true").length === 1 && ps[1].full && ps[1].text === chs[1].title, `the part you are in is marked, and named in full — "${ps[1].text}"`);
+  const chip = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const a = getComputedStyle(r.querySelector('.labels .part[aria-current="true"] .pn')).backgroundColor, o = getComputedStyle(r.querySelector('.labels .part[aria-current="false"] .pn')).backgroundColor; return { a, o }; });
+  ok(chip.a === "rgb(204, 120, 92)" && chip.o !== chip.a, `the current part's number is the coral one — ${chip.a}`);
+  await p.locator("#rp").focus();
+  await p.keyboard.press("n"); await p.waitForTimeout(500);
+  let t = (await T(p)).t;
+  ok(Math.abs(t - chs[2].start) < 0.5, `N goes to the start of the next part — ${t.toFixed(2)} (part 3 starts ${chs[2].start})`);
+  ok(!(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".chend").classList.contains("on"))), "and does not stop there as if the part before had just ended");
+  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === 0, "going forward is not a rewind");
+  await p.keyboard.press("p"); await p.waitForTimeout(400);
+  t = (await T(p)).t;
+  ok(Math.abs(t - chs[1].start) < 0.5, `P goes to the start of the previous part — ${t.toFixed(2)}`);
+  await p.keyboard.press("Shift+ArrowLeft"); await p.waitForTimeout(400);
+  t = (await T(p)).t;
+  ok(t < 0.5, `Shift+← does the same — ${t.toFixed(2)}`);
+  let mo = await p.evaluate(() => document.querySelector("#rp").moments);
+  ok(mo.length === 1 && mo[0].kind === "rewind" && mo[0].t < 0.5 && Math.abs(mo[0].from - chs[2].start) < 0.6, `two quick part jumps back are one rewind, from where it started to where it ended — ${JSON.stringify(mo)}`);
+  await p.waitForTimeout(1600);
+  await p.keyboard.press("Shift+ArrowRight"); await p.waitForTimeout(400);
+  t = (await T(p)).t;
+  ok(Math.abs(t - chs[1].start) < 0.5, `Shift+→ goes to the next part — ${t.toFixed(2)}`);
+  // a marker is a button to its part's start; going back more than 2 s by it is a rewind
+  await p.locator("#rp").locator('.labels .part[data-part="0"]').click(); await p.waitForTimeout(400);
+  t = (await T(p)).t;
+  mo = await p.evaluate(() => document.querySelector("#rp").moments);
+  ok(t < 0.5 && mo.length === 2 && mo[1].kind === "rewind" && mo[1].frameIndex === 1, `clicking part 1's marker jumps to its start, and counts as a rewind — ${JSON.stringify(mo[1])}`);
+  // the scrub: a click back more than 2 s is a rewind; a click back less than that, or forward, is not
+  const sc = await p.locator("#rp").locator(".scrub").boundingBox(); const dur = pm.totalSeconds;
+  const clickAt = async (s) => { await p.locator("#rp").locator(".scrub").click({ position: { x: (s / dur) * sc.width, y: sc.height / 2 } }); await p.waitForTimeout(350); await p.evaluate(() => document.querySelector("#rp").player.pause()); };
+  await clickAt(100); await clickAt(99); await clickAt(80);
+  mo = await p.evaluate(() => document.querySelector("#rp").moments);
+  const f80 = pm.frames.find((f) => 80 >= f.start && 80 < f.start + f.durationSeconds);
+  ok(mo.length === 3 && mo[2].kind === "rewind" && Math.abs(mo[2].t - 80) < 1.5 && Math.abs(mo[2].from - 99) < 1.5 && mo[2].planStep === f80.planStep && mo[2].frameIndex === f80.index,
+    `a scrub click 19 s back is a rewind at its frame and step, the 1 s one is not — ${JSON.stringify(mo.slice(2))}`);
+  // slowing down: below 1x is a moment, one per change (a quick second step down refines it), speeding up is not
+  await p.locator("#rp").focus();
+  await p.keyboard.press("["); await p.keyboard.press("["); await p.waitForTimeout(200); await p.keyboard.press("]"); await p.waitForTimeout(200);
+  mo = await p.evaluate(() => document.querySelector("#rp").moments);
+  const slow = mo.filter((m) => m.kind === "slow");
+  ok(slow.length === 1 && slow[0].rate === 0.5 && slow[0].planStep === f80.planStep && typeof slow[0].t === "number", `slowing to 0.5x is one slow moment — ${JSON.stringify(slow)}`);
+  const ex = await p.evaluate(() => document.querySelector("#rp").exportPayload().watch.moments);
+  ok(ex.length === 4 && ex.every((m) => "planStep" in m && "frameIndex" in m && typeof m.t === "number"), `the review carries them as watch.moments — ${ex.map((m) => m.kind).join(", ")}`);
+  await p.reload(); await ready(p);
+  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === 4, "and they survive a reload");
+  await p.evaluate(() => document.querySelector("#rp").setSpeed(1));
+  await p.close();
+}
+
+// ---- 3 + 4 + 6. a four-option question answered from the keyboard, with a note
+{
+  const p = await open();
+  const rp = p.locator("#rp");
+  const q1 = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[0]);
+  await playInto(p, q1.at);
+  const card = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { keys: [...r.querySelectorAll(".decision .opt .key")].map((k) => k.textContent), own: r.querySelector(".ownbtn").title, note: !r.querySelector(".decision .note").hidden }; });
+  ok(card.keys.join("") === "ABCD", `each option carries its letter — ${card.keys.join(" ")}`);
+  ok(/\(O\)/.test(card.own) && card.note, "the own-words button names O, and the note field is offered");
+  // O opens the own-words box without typing an "o" into it; Esc closes it again
+  await p.keyboard.press("o"); await p.waitForTimeout(150);
+  const own = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return { open: r.querySelector(".own").classList.contains("open"), focused: r.activeElement === r.querySelector(".own textarea"), value: r.querySelector(".own textarea").value }; });
+  ok(own.open && own.focused && own.value === "", "O opens 'answer in my own words', focused and empty");
+  await p.keyboard.press("Escape"); await p.waitForTimeout(150);
+  // the note: typed in the sheet, Enter hands the keys back, the letter picks
+  await rp.locator("[data-note]").click();
+  await p.keyboard.type("only if Redis is already run by the platform team");
+  await p.keyboard.press("Enter"); await p.waitForTimeout(150);
+  ok(await p.evaluate(() => !document.querySelector("#rp").decisions.q1), "typing the note (letters a–d included) answers nothing");
+  await p.keyboard.press("c"); await p.waitForTimeout(700);
+  const rec = await p.evaluate(() => { const el = document.querySelector("#rp"); return { d: el.decisions.q1, tool: el.tool, marking: el.shadowRoot.querySelector(".toolbar").classList.contains("marking"), on: el.shadowRoot.querySelector(".decision").classList.contains("on") }; });
+  ok(rec.d?.option === "c" && rec.d.label === "Redis with a TTL" && !rec.on, `C picks the third option — ${JSON.stringify(rec.d)}`);
+  ok(rec.tool === null && !rec.marking, "and the letters did not turn on a drawing tool");
+  ok(rec.d?.note === "only if Redis is already run by the platform team", "the note is saved on that decision");
+  const t = (await T(p)).t;
+  ok(Math.abs(t - q1.resumeAt) < 1.2, `an option without a branch goes on at resumeAt — ${t.toFixed(2)} (resumeAt ${q1.resumeAt})`);
+  // record, reload, copy, export
+  await p.reload(); await ready(p);
+  const after = await p.evaluate(() => { const el = document.querySelector("#rp"); return { note: el.decisions.q1?.note, field: el.shadowRoot.querySelector('textarea[data-dnote="q1"]')?.value, text: el.reviewText(), ex: el.exportPayload().decisions.find((d) => d.id === "q1") }; });
+  ok(after.note && after.field === after.note, "the note survives a reload and shows under the answer in the record");
+  ok(/Redis with a TTL\n\s+Note: only if Redis/.test(after.text), "Copy text carries it under the answer");
+  ok(after.ex?.note === after.note, "and the review sends it as note on the decision");
+  await rp.locator(".grab").click(); await p.waitForTimeout(350);
+  await rp.locator('textarea[data-dnote="q1"]').fill("only if the platform team runs Redis");
+  await rp.locator('textarea[data-dnote="q1"]').blur(); await p.waitForTimeout(150);
+  const edited = await p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.endsWith(":decisions")))).q1.note);
+  ok(edited === "only if the platform team runs Redis", "and it can be edited there afterwards");
+  await p.close();
+}
+
+// ---- 6. four options at four widths: a grid, never smaller text, nothing clipped; phones stack
+for (const [w, h, cols] of [[1440, 900, 2], [955, 800, 2], [760, 900, 2], [430, 932, 1]]) {
+  const p = await open(w, h);
+  await p.evaluate(() => { const el = document.querySelector("#rp"); el.start(); el.askDecision(el.planMap.decisions[0]); });
+  await p.waitForTimeout(500);
+  const g = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; const os = [...r.querySelectorAll(".decision .opt")];
+    const rs = os.map((o) => o.getBoundingClientRect());
+    const overlap = rs.some((a, i) => rs.some((c, j) => j > i && a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1));
+    return { n: os.length, cols: new Set(rs.map((x) => Math.round(x.left))).size, font: getComputedStyle(os[0].querySelector("b")).fontSize, why: getComputedStyle(os[0].querySelector("span")).fontSize, overlap,
+      clipped: os.filter((o) => o.scrollHeight > o.clientHeight + 1 || o.scrollWidth > o.clientWidth + 1).length, hscroll: document.documentElement.scrollWidth > innerWidth }; });
+  ok(g.n === 4 && g.cols === cols && !g.overlap && g.clipped === 0 && !g.hscroll && g.font === "15px" && g.why === "13px",
+    `${w}px: four options in ${g.cols} column${g.cols === 1 ? "" : "s"}, 15/13 px text, none clipped or overlapping — ${JSON.stringify(g)}`);
+  if (w === 1440) {
+    await p.evaluate(() => { const el = document.querySelector("#rp"); el.closeCard(); const d = el.planMap.decisions[0]; el.askDecision({ ...d, options: d.options.slice(0, 3) }); });
+    await p.waitForTimeout(300);
+    const three = await p.evaluate(() => new Set([...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision .opt")].map((o) => Math.round(o.getBoundingClientRect().top))).size);
+    ok(three === 1, "three options sit in one row");
+  }
+  await p.close();
+}
+
+// ---- 7. pick all that apply: letters toggle, Enter confirms, one summary frame, routed past on replay, "change" reopens
+{
+  const p = await open();
+  const rp = p.locator("#rp");
+  const q2 = await p.evaluate(() => document.querySelector("#rp").planMap.decisions[1]);
+  await playInto(p, q2.at);
+  let s = await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot, c = r.querySelector(".decision .confirm"); return { picks: r.querySelectorAll(".decision .opt[data-pick]").length, confirm: !c.hidden, disabled: c.disabled, k: r.querySelector(".decision .k").textContent }; });
+  ok(s.picks === 4 && s.confirm && s.disabled && /pick all that apply/.test(s.k), `a pick-all question shows ticks and a Confirm that waits for one — ${JSON.stringify(s)}`);
+  await p.keyboard.press("Enter"); await p.waitForTimeout(150);
+  ok(await sheetOn(p), "Enter with nothing ticked confirms nothing");
+  await p.keyboard.press("a"); await p.keyboard.press("d"); await p.keyboard.press("c"); await p.keyboard.press("d"); await p.waitForTimeout(150);
+  s = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { on: [...r.querySelectorAll('.decision .opt[aria-pressed="true"]')].map((x) => x.dataset.pick), tool: el.tool, confirm: r.querySelector(".decision .confirm").textContent }; });
+  ok(s.on.join() === "a,c" && s.tool === null, `letters toggle the ticks (D twice is off again) and never pick a drawing tool — ${s.on.join(",")}`);
+  // the summary frame's composition marks where the picks go
+  await p.evaluate(() => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument; const host = doc.querySelector('[data-composition-id="13-branch-2b"]') || doc.body;
+    const ul = doc.createElement("ul"); ul.setAttribute("data-plan-picks", "q2"); ul.id = "rp-test-picks"; host.appendChild(ul);
+    const span = doc.createElement("span"); span.setAttribute("data-plan-picks", "q2"); span.id = "rp-test-picks-inline"; host.appendChild(span); });
+  await p.keyboard.press("Enter"); await p.waitForTimeout(900);
+  const rec = await p.evaluate(() => document.querySelector("#rp").decisions.q2);
+  ok(rec?.option === "multi" && rec.options.join() === "a,c" && rec.labels.join("|") === "Web uploader|Android app" && rec.label === "Web uploader, Android app" && rec.recommended === false, `recorded as the contract says — ${JSON.stringify(rec)}`);
+  const t = await T(p);
+  ok(!(await sheetOn(p)) && t.t >= q2.summary.start - 0.2 && t.t < q2.summary.start + 2.5, `it plays the one summary frame — ${t.t.toFixed(2)} (summary at ${q2.summary.start})`);
+  const written = await p.evaluate(() => { const doc = document.querySelector("#rp").player.iframeElement.contentDocument; return { li: [...(doc.querySelector("#rp-test-picks")?.querySelectorAll("li") || [])].map((x) => x.textContent), inline: doc.querySelector("#rp-test-picks-inline")?.textContent }; });
+  ok(written.li.join("|") === "Web uploader|Android app" && written.inline === "Web uploader, Android app", `the picks are written into the summary frame's data-plan-picks — ${JSON.stringify(written)}`);
+  ok(/Web uploader, Android app \(all that apply\)/.test(await p.evaluate(() => document.querySelector("#rp").reviewText())), "Copy text lists the picks");
+  const moments = await p.evaluate(() => document.querySelector("#rp").moments.length);
+  // replay: no question, and the frames between the question and its summary are skipped
+  await seekPause(p, q2.at - 1.2); await p.waitForTimeout(300);
+  await rp.locator('[data-act="play"]').click();
+  await p.waitForTimeout(2600);
+  const re = await T(p);
+  ok(!(await sheetOn(p)) && re.t >= q2.summary.start - 0.2, `played again, an answered pick-all routes past its question to the summary — ${re.t.toFixed(2)}`);
+  // change reopens it with the picks and the note as they were
+  await p.evaluate(() => document.querySelector("#rp").player.pause());
+  await rp.locator(".grab").click(); await p.waitForTimeout(350);
+  await rp.locator('[data-redo="q2"]').click();
+  await p.waitForFunction(() => document.querySelector("#rp").shadowRoot.querySelector(".decision").classList.contains("on"), null, { timeout: 20000 });
+  const again = await p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll('.decision .opt[aria-pressed="true"]')].map((x) => x.dataset.pick));
+  ok(again.join() === "a,c", `"change" reopens it with the earlier picks ticked — ${again.join(",")}`);
+  await p.keyboard.press("c"); await rp.locator('[data-act="confirm"]').click(); await p.waitForTimeout(500);
+  ok((await p.evaluate(() => document.querySelector("#rp").decisions.q2?.options?.join())) === "a", "and a new set can be confirmed");
+  ok((await p.evaluate(() => document.querySelector("#rp").moments.length)) === moments, "the player's own seeks (the answer, the replay routing, the change) are not rewinds");
+  await p.close();
+}
+
+// ---- 3. the quick check and the agent's call answer from the keyboard too
+{
+  const p = await open();
+  const pm = await p.evaluate(() => document.querySelector("#rp").planMap);
+  await playInto(p, pm.quizzes[0].at);
+  await p.keyboard.press("d"); await p.waitForTimeout(150);
+  ok(await p.evaluate(() => !document.querySelector("#rp").quizzes.ktest && document.querySelector("#rp").tool === null), "D on a three-option check answers nothing and draws nothing");
+  await p.keyboard.press("b"); await p.waitForTimeout(250);
+  ok(await p.evaluate(() => document.querySelector("#rp").quizzes.ktest?.answer === "b"), "B answers the quick check");
+  await p.keyboard.press("a"); await p.waitForTimeout(150);
+  ok(await p.evaluate(() => document.querySelector("#rp").quizzes.ktest?.answer === "b" && document.querySelector("#rp").tool === null), "a letter after the answer changes nothing and draws nothing");
+  await p.keyboard.press(" "); await p.waitForTimeout(400);
+  await p.evaluate(() => document.querySelector("#rp").player.pause());
+  await playInto(p, pm.autonomy[0].at);
+  const keys = await p.evaluate(() => [...document.querySelector("#rp").shadowRoot.querySelectorAll(".decision .opt .key")].map((k) => k.textContent).join(""));
+  ok(keys === "AB", `the agent's call shows A (accept) and B (flag) — ${keys}`);
+  await p.keyboard.press("b"); await p.waitForTimeout(400);
+  ok(await p.evaluate(() => document.querySelector("#rp").autonomy.atest?.verdict === "flag" && document.querySelector("#rp").tool === null), "B flags it");
+  await p.close();
+}
+
+// ---- 8. type on the mark
+{
+  const p = await open();
+  const rp = p.locator("#rp");
+  await seekPause(p, 30); await p.waitForTimeout(500);
+  await rp.focus(); await p.keyboard.press("b");
+  const draw = async (x0, y0, x1, y1) => { const st = await rp.locator(".stage").boundingBox(); await p.mouse.move(st.x + st.width * x0, st.y + st.height * y0); await p.mouse.down(); await p.mouse.move(st.x + st.width * x1, st.y + st.height * y1, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(250); return st; };
+  const st = await draw(0.2, 0.3, 0.4, 0.5);
+  const box = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, mb = r.querySelector(".markbox"), bb = mb.getBoundingClientRect(), s = r.querySelector(".stage").getBoundingClientRect();
+    return { shown: !mb.hidden, focused: r.activeElement === mb.querySelector("input"), paused: el.player.paused, left: bb.left - s.left, top: bb.top - s.top, right: bb.right - s.left, bottom: bb.bottom - s.top, w: s.width, h: s.height, theme: el.getAttribute("theme"), n: el.annotations.length }; });
+  ok(box.shown && box.focused && box.paused, "a finished mark opens a focused text box, and the video stays paused");
+  ok(box.left >= 0.4 * box.w && box.right <= box.w && box.top >= 0 && box.bottom <= box.h, `the box sits beside the mark, inside the frame — at ${Math.round(box.left)},${Math.round(box.top)}`);
+  await p.keyboard.type("the demo zebra: mark it, then type");
+  const typed = await p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot; return { theme: el.getAttribute("theme"), tool: el.tool, n: el.annotations.length, muted: r.querySelector("hyperframes-player").muted, handoff: !r.querySelector(".handoff").hidden, t: el.player.currentTime }; });
+  ok(typed.theme === box.theme && typed.tool === "box" && typed.n === box.n && !typed.muted && !typed.handoff, "typing in it fires no shortcut — not t, m, d, z, e or the rest");
+  await p.keyboard.press("Enter"); await p.waitForTimeout(200);
+  const saved = await p.evaluate(() => { const el = document.querySelector("#rp"); const a = el.annotations.at(-1); return { kind: a.kind, comment: a.comment, hidden: el.shadowRoot.querySelector(".markbox").hidden, listed: [...el.shadowRoot.querySelectorAll(".list textarea[data-comment]")].some((x) => x.value === a.comment) }; });
+  ok(saved.kind === "box" && saved.comment === "the demo zebra: mark it, then type" && saved.hidden && saved.listed, "Enter saves the words as that mark's comment, and the record shows them under it");
+  await draw(0.6, 0.2, 0.7, 0.35);
+  await p.keyboard.type("never mind"); await p.keyboard.press("Escape"); await p.waitForTimeout(200);
+  const skipped = await p.evaluate(() => { const el = document.querySelector("#rp"); const a = el.annotations.at(-1); return { n: el.annotations.length, comment: a.comment, hidden: el.shadowRoot.querySelector(".markbox").hidden, tool: el.tool }; });
+  ok(skipped.n === box.n + 1 && skipped.comment === "" && skipped.hidden && skipped.tool === "box", "Escape leaves the mark without words, and only closes the box");
+  await p.keyboard.press("Escape"); await p.waitForTimeout(150);
+  ok(await p.evaluate(() => document.querySelector("#rp").tool === null), "a second Escape puts the pen down, as before");
+  await p.close();
+}
+
+console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
+await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
diff --git a/scripts/frame-lint.mjs b/scripts/frame-lint.mjs
index 3a8bf51..353da78 100644
--- a/scripts/frame-lint.mjs
+++ b/scripts/frame-lint.mjs
@@ -64,6 +64,12 @@ for (const f of files) {
     for (const m of r[2].matchAll(/font:[^;]*?(\d+)px[^;]*?(?:JetBrains|Mono)/g)) if (+m[1] < 26) findings.push(`mono at ${m[1]}px in ${r[1].trim().slice(0, 40)}`);
   }
 
+  // 4b. density (richer-review step 5): a newcomer cannot follow a diagram of every part at once.
+  //     At most six distinct parts on one frame. A beat whose job IS the whole system (the system
+  //     video's cast, a resolved map) says so with data-density="full" on its root and is exempt.
+  const parts = new Set([...body.matchAll(/data-plan-component="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== "page"));
+  if (parts.size > 6 && !/data-density="full"/.test(body)) findings.push(`${parts.size} parts on one frame (at most 6; mark a whole-system beat data-density="full")`);
+
   // 5. nothing in the caption band
   for (const m of body.matchAll(/top:\s*(\d{3,4})px/g)) if (+m[1] >= 900) findings.push(`element at y ${m[1]} (caption band starts at 900)`);
 
diff --git a/scripts/plan-map.mjs b/scripts/plan-map.mjs
index b25904e..001c8ed 100644
--- a/scripts/plan-map.mjs
+++ b/scripts/plan-map.mjs
@@ -34,7 +34,9 @@ for (const b of blocks) {
     knowledge: meta.knowledge ? meta.knowledge.split(",").map((x) => x.trim()).filter(Boolean) : null,   // levels that include this frame; null = all
     quiz: meta.quiz || null, answer: meta.answer || null, explain: meta.explain || null,
     autonomy: meta.autonomy || null, chose: meta.chose || null, insteadOf: meta.instead_of || null, why: meta.why || null, check: meta.check || null,
-    options: ["a", "b", "c"].filter((k) => meta[`option_${k}`]).map((k) => ({ id: k, label: meta[`option_${k}`], why: meta[`why_${k}`] || "", recommended: (meta.recommended || "a") === k })),
+    kind: meta.kind || null,                  // "multi": pick all that apply (richer-review step 2)
+    summary: meta.summary || null,            // e.g. "q1": the one frame a multi-select answer plays (D-004)
+    options: ["a", "b", "c", "d"].filter((k) => meta[`option_${k}`]).map((k) => ({ id: k, label: meta[`option_${k}`], why: meta[`why_${k}`] || "", recommended: (meta.recommended || "a") === k })),
   };
   frames.push(f);
 }
@@ -57,8 +59,11 @@ const decisions = frames.filter((f) => f.decision).map((f) => {
     const b = frames.find((x) => x.branch === `${f.decision}=${o.id}`);
     return { ...o, branch: b ? { frameIndex: b.index, compositionId: b.compositionId, start: b.start, end: +(b.start + b.durationSeconds).toFixed(3) } : null };
   });
-  const branchEnds = opts.map((o) => o.branch?.end).filter(Boolean);
-  return { id: f.decision, frameIndex: f.index, compositionId: f.compositionId, planStep: f.planStep, question: f.question, at: +(f.start + f.durationSeconds - 0.05).toFixed(3), resumeAt: branchEnds.length ? Math.max(...branchEnds) : +(f.start + f.durationSeconds).toFixed(3), options: opts };
+  // a pick-all-that-apply question plays one summary frame of the picks, not a branch per pick (D-004)
+  const s = frames.find((x) => x.summary === f.decision);
+  const summary = s ? { frameIndex: s.index, compositionId: s.compositionId, start: s.start, end: +(s.start + s.durationSeconds).toFixed(3) } : null;
+  const branchEnds = [...opts.map((o) => o.branch?.end), summary?.end].filter(Boolean);
+  return { id: f.decision, kind: f.kind === "multi" ? "multi" : "one", frameIndex: f.index, compositionId: f.compositionId, planStep: f.planStep, question: f.question, at: +(f.start + f.durationSeconds - 0.05).toFixed(3), resumeAt: branchEnds.length ? Math.max(...branchEnds) : +(f.start + f.durationSeconds).toFixed(3), options: opts, summary };
 });
 // chapters: each frame tagged chapter_start opens one; a chapter runs to the frame before the next start
 const chapters = [];
diff --git a/scripts/reel.mjs b/scripts/reel.mjs
index 225c602..428e552 100644
--- a/scripts/reel.mjs
+++ b/scripts/reel.mjs
@@ -181,6 +181,9 @@ function check() {
     const o = overlap(words(q), new Set([...words(d.question), ...(label ? words(d.chosen) : [])]));
     if (o >= 2) fails.push(`open question "${q}" re-asks ${d.id} ("${d.question}" → ${d.chosen}); cite it as in force and drop the question, or list it under Supersedes with the reason`);
   }
+  // As many questions as the plan needs, one per part of about a minute (richer-review step 3). Past
+  // six, the plan is probably not ready to review: say so, but do not block it.
+  if (plan.questions.length > 6) warns.push(`${plan.questions.length} open questions: a plan this open may not be ready to review (one question per part means ${plan.questions.length} parts)`);
   for (const f of fails) console.log(`✗ ${f}`); for (const w of warns) console.log(`△ ${w}`);
   console.log(`${fails.length ? "✗" : "✓"} ${basename(pd)}: ${plan.steps.length} steps, touches [${touched.join(", ")}], ${plan.inForce.length} in force, ${plan.supersedes.length} superseded, ${fails.length} failure(s), ${warns.length} warning(s)`);
   process.exit(fails.length ? 1 : 0);
@@ -205,6 +208,8 @@ function record() {
     const entry = { id, date, plan: planName, step: step?.n ?? null, stepTitle: step?.title ?? null, questionId: made.id, question: q?.question || made.id,
       options: (q?.options || []).map((o) => ({ id: o.id, label: o.label, why: o.why, recommended: !!o.recommended })),
       chosen: made.label, chosenId: made.option, recommended: !!made.recommended, why: q?.options?.find((o) => o.id === made.option)?.why || "",
+      ...(made.option === "multi" ? { chosenIds: made.options || [] } : {}),   // pick all that apply: the set, in order
+      ...((made.note || "").trim() ? { note: made.note.trim() } : {}),          // the reviewer's note on the answer
       components: stepComps.length ? stepComps : touched, status: "active", supersedes: plan.supersedes.filter((s) => ledger.decisions.find((x) => x.id === s)?.supersededBy === id) };
     ledger.decisions.push(entry); added.push(entry);
   }
@@ -229,7 +234,7 @@ function record() {
   writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
   // the human-readable ledger: regenerate the table from the data (append-only is enforced on the data)
   const rows = ledger.decisions.map((d) => `| ${d.id} | ${d.date} | ${d.plan} | ${d.step ?? ""} | ${d.question} | **${d.chosen}**${d.recommended ? "" : " (not the recommendation)"} | ${d.status}${d.supersededBy ? ` by ${d.supersededBy}` : ""}${d.supersedes?.length ? `, supersedes ${d.supersedes.join(", ")}` : ""} |`);
-  const details = ledger.decisions.map((d) => `### ${d.id} — ${d.question}\n\n- **Chosen:** ${d.chosen}${d.why ? ` — ${d.why}` : ""}\n- **Not chosen:** ${d.options.filter((o) => o.id !== d.chosenId).map((o) => `${o.label}${o.why ? ` (${o.why})` : ""}`).join("; ") || "—"}\n- **Where:** ${d.plan}, step ${d.step ?? "?"}${d.stepTitle ? ` (${d.stepTitle})` : ""}; components: ${d.components.join(", ") || "—"}\n- **Status:** ${d.status}${d.supersededBy ? `, superseded by ${d.supersededBy} on ${d.supersededOn}` : ""}${d.supersedes?.length ? `; supersedes ${d.supersedes.join(", ")}` : ""}\n`);
+  const details = ledger.decisions.map((d) => `### ${d.id} — ${d.question}\n\n- **Chosen:** ${d.chosen}${d.why ? ` — ${d.why}` : ""}\n- **Not chosen:** ${d.options.filter((o) => o.id !== d.chosenId && !(d.chosenIds || []).includes(o.id)).map((o) => `${o.label}${o.why ? ` (${o.why})` : ""}`).join("; ") || "—"}${d.note ? `\n- **Note:** ${d.note}` : ""}\n- **Where:** ${d.plan}, step ${d.step ?? "?"}${d.stepTitle ? ` (${d.stepTitle})` : ""}; components: ${d.components.join(", ") || "—"}\n- **Status:** ${d.status}${d.supersededBy ? `, superseded by ${d.supersededBy} on ${d.supersededOn}` : ""}${d.supersedes?.length ? `; supersedes ${d.supersedes.join(", ")}` : ""}\n`);
   const head = read(join(TPL, "decisions.md")).trim();
   writeFileSync(join(rp, "decisions.md"), `${head}\n${rows.join("\n")}\n\n${details.join("\n")}`);
   // Which review this is. A plan review answers the plan's open questions; a walkthrough review
diff --git a/scripts/resolve-plan.mjs b/scripts/resolve-plan.mjs
index 77cf799..c5ad3ff 100644
--- a/scripts/resolve-plan.mjs
+++ b/scripts/resolve-plan.mjs
@@ -16,8 +16,21 @@ let out = plan;
 if (map?.decisions?.length) {
   for (const d of map.decisions) {
     const made = byQ[d.id]; if (!made) continue;
-    const label = made.label;
-    out = out.replace(new RegExp(`(- \\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^*]*\\*\\*)`), `$1 ← **chosen**`);
+    // a pick-all answer marks every picked option (richer-review step 2)
+    const picks = made.option === "multi" ? (made.options || []).map((id, i) => ({ id, label: (made.labels || [])[i] })) : [{ id: made.option, label: made.label }];
+    for (const { id, label } of picks) {
+      if (!label) continue;
+      const before = out;
+      // options are written "- **Label.**" or "- **A · Label.**" (the letter the video shows)
+      out = out.replace(new RegExp(`(- \\*\\*(?:[A-D] · )?${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^*]*\\*\\*)`), `$1 ← **chosen**`);
+      // The video often shortens an option's label; fall back to its letter inside question N's block
+      // ("qN" is the plan's Nth open question, "- **B · …**" its option b).
+      const n = Number(String(d.id).replace(/^q/, ""));
+      if (out === before && n && /^[a-d]$/.test(id)) {
+        const block = new RegExp(`(^${n}\\. \\*\\*[\\s\\S]*?)(- \\*\\*${id.toUpperCase()} · [^*]*\\*\\*)`, "m");
+        out = out.replace(block, (m0, head, opt) => /\n\d+\. \*\*|\n## /.test(head.slice(1)) ? m0 : `${head}${opt} ← **chosen**`);
+      }
+    }
   }
 }
 const stepOf = (a) => a.plan?.step ?? a.frame?.index ?? "video";
@@ -25,13 +38,30 @@ const grouped = {};
 for (const a of ann.annotations || []) { const k = `step ${stepOf(a)}`; (grouped[k] ||= []).push(a); }
 const lines = ["", "## Decisions (from the video review)", ""];
 if (!decisions.length) lines.push("_No decisions recorded; the recommended options stand._");
-for (const d of decisions) lines.push(`- **${d.id.toUpperCase()}** (step ${d.planStep ?? "?"}): **${d.label}**${d.recommended ? " (the recommended option)" : " (overrides the recommendation)"}`);
+for (const d of decisions) {
+  const how = d.option === "multi" ? ` (picked ${(d.labels || []).length} of the options)` : d.option === "own" ? " (in the reviewer's own words)" : d.recommended ? " (the recommended option)" : " (overrides the recommendation)";
+  lines.push(`- **${d.id.toUpperCase()}** (step ${d.planStep ?? "?"}): **${d.label}**${how}`);
+  // the reviewer's note on the answer: it clarifies the pick, and the revise reads it like a comment
+  if ((d.note || "").trim()) lines.push(`  - note: ${d.note.trim()}`);
+}
 lines.push("", "## Review annotations", "");
 if (!Object.keys(grouped).length) lines.push("_None._");
 for (const [k, list] of Object.entries(grouped)) {
   lines.push(`### ${k}`);
   for (const a of list) lines.push(`- ${a.kind}${a.plan?.component ? ` on ${a.plan.component}` : ""} at ${a.t}s${a.frame?.title ? ` (${a.frame.title})` : ""}${a.comment ? `: ${a.comment}` : ""}`);
 }
+// Moments the reviewer went back over or slowed down for (D-005): signals, not comments. The agent
+// reads them as places where a step may need saying more plainly.
+const moments = ann.watch?.moments || [];
+if (moments.length) {
+  lines.push("", "## Hard to follow here (from how the video was watched)", "");
+  const byStep = {};
+  for (const m of moments) (byStep[m.planStep ?? "video"] ||= []).push(m);
+  for (const [s, list] of Object.entries(byStep)) {
+    const what = list.map((m) => m.kind === "rewind" ? `went back to ${m.t}s${m.from != null ? ` from ${m.from}s` : ""}` : `slowed to ${m.rate}× at ${m.t}s`).join("; ");
+    lines.push(`- ${s === "video" ? "outside any step" : `step ${s}`}: ${what}`);
+  }
+}
 const approved = ann.verdict ? ann.verdict === "approve" : (ann.annotations || []).some((a) => a.kind === "approve");
 const status = approved ? "approved by the reviewer" : ann.verdict === "changes" ? "changes requested by the reviewer — revise the steps the comments landed on" : "awaiting approval";
 lines.push("", `**Status:** ${status} · watched ${Math.round((ann.watch?.completion ?? 0) * 100)}% · exported ${ann.exportedAt || ""}`);
diff --git a/scripts/revise-scope.mjs b/scripts/revise-scope.mjs
index 56e96c3..125ccd0 100644
--- a/scripts/revise-scope.mjs
+++ b/scripts/revise-scope.mjs
@@ -29,6 +29,12 @@ for (const a of worded) {
   if (!byStep.has(step)) byStep.set(step, []);
   byStep.get(step).push(reason);
 }
+// A note on an answer is words too: it clarifies the pick, and may ask for the step to say more.
+for (const d of ann.decisions || []) {
+  if (!(d.note || "").trim() || d.planStep == null) continue;
+  if (!byStep.has(d.planStep)) byStep.set(d.planStep, []);
+  byStep.get(d.planStep).push({ id: `note-${d.id}`, kind: "answer-note", t: d.t ?? null, comment: d.note.trim(), about: `note on ${d.id}: ${d.label}`, component: null });
+}
 const steps = [...byStep.entries()].sort((a, b) => a[0] - b[0]).map(([step, reasons]) => ({ step, reasons }));
 const wordedSteps = new Set(steps.map((s) => s.step));
 // a decision recorded for the ledger's sake, with nothing said about it — real signal for
diff --git a/scripts/test/review-data.spec.mjs b/scripts/test/review-data.spec.mjs
new file mode 100644
index 0000000..5b8c177
--- /dev/null
+++ b/scripts/test/review-data.spec.mjs
@@ -0,0 +1,128 @@
+#!/usr/bin/env node
+// The script side of the richer-review plan, against a scratch project (reel init → new-plan):
+//   plan-map    — a 4-option question, a pick-all question and its summary frame
+//   resolve-plan — every pick marked, a note on an answer kept, rewinds/slow-downs as "hard to follow"
+//   reel record — a pick-all answer is recorded as a set, the note travels with it
+//   revise-scope — a note on an answer sends its step to the revise, like a comment
+//   reel check  — more than six open questions warns, never fails
+import { execFileSync } from "node:child_process";
+import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
+import { join } from "node:path";
+import { tmpdir } from "node:os";
+import { ROOT } from "../lib/env.mjs";
+
+const tmp = mkdtempSync(join(tmpdir(), "review-data-"));
+const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
+let failed = 0;
+const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };
+
+const plan = `# Drafts
+
+## Steps
+
+### Step 1 — Store drafts
+
+Where drafts live.
+
+### Step 2 — Export
+
+Which formats ship.
+
+## Components touched
+
+## Open questions for the reviewer
+
+1. **Where do drafts live?** (step 1)
+- **A · Postgres.** one table
+- **B · S3.** one object each
+- **C · Local storage.** no server
+- **D · Git.** history for free
+I recommend A.
+
+2. **Which formats ship first?** (step 2)
+- **A · Web.** the page
+- **B · PDF.** print
+- **C · Slides.** talks
+Pick all that apply.
+`;
+const storyboard = `---
+plan_dir: x
+---
+## Frame 1 — Step 1
+- src: compositions/frames/01.html
+- duration: 5
+- plan_step: 1
+
+## Frame 2 — Where do drafts live?
+- src: compositions/frames/02.html
+- duration: 4
+- plan_step: 1
+- decision: q1
+- question: Where do drafts live?
+- option_a: Postgres
+- option_b: S3
+- option_c: Local storage
+- option_d: Git
+- recommended: a
+
+## Frame 3 — Which formats ship first?
+- src: compositions/frames/03.html
+- duration: 4
+- plan_step: 2
+- decision: q2
+- kind: multi
+- question: Which formats ship first?
+- option_a: Web
+- option_b: PDF
+- option_c: Slides
+
+## Frame 4 — Your picks
+- src: compositions/frames/04.html
+- duration: 3
+- plan_step: 2
+- summary: q2
+`;
+
+try {
+  run("reel.mjs", "init", tmp, "--name", "drafts", "--kind", "greenfield");
+  writeFileSync(join(tmp, "plan.md"), plan);
+  run("reel.mjs", "new-plan", tmp, "drafts", "--plan", join(tmp, "plan.md"), "--date", "2026-09-23");
+  const pd = join(tmp, ".reelplanning/plans/2026-09-23-drafts");
+  const vd = join(pd, "video"); mkdirSync(vd, { recursive: true });
+  writeFileSync(join(vd, "STORYBOARD.md"), storyboard);
+  run("plan-map.mjs", vd);
+  const map = JSON.parse(readFileSync(join(vd, "plan-map.json"), "utf8"));
+  const [q1, q2] = map.decisions;
+  ok("plan-map: a question can carry four options", q1.options.length === 4 && q1.options.map((o) => o.id).join("") === "abcd" && q1.kind === "one");
+  ok("plan-map: a pick-all question and its one summary frame", q2.kind === "multi" && q2.summary?.frameIndex === 4 && q2.resumeAt === q2.summary.end, JSON.stringify(q2.summary));
+
+  const ann = { version: 1, verdict: "changes", exportedAt: "2026-09-23T00:00:00Z",
+    watch: { completion: 1, moments: [{ kind: "rewind", t: 1.5, from: 4.8, planStep: 1, frameIndex: 1 }, { kind: "slow", t: 9, rate: 0.75, planStep: 2, frameIndex: 3 }] },
+    decisions: [
+      { id: "q1", option: "c", label: "Local storage", planStep: 1, t: 8.9, recommended: false, note: "only until accounts exist, then move to Postgres" },
+      { id: "q2", option: "multi", options: ["a", "c"], labels: ["Web", "Slides"], label: "Web, Slides", planStep: 2, t: 12.9, recommended: false },
+    ], annotations: [] };
+  writeFileSync(join(pd, "annotations.json"), JSON.stringify(ann));
+  const r = run("reel.mjs", "record", pd);
+  const resolved = readFileSync(join(pd, "plan.resolved.md"), "utf8");
+  ok("resolve-plan: every pick of a pick-all answer is marked chosen", /\*\*A · Web\.\*\* ← \*\*chosen\*\*/.test(resolved) && /\*\*C · Slides\.\*\* ← \*\*chosen\*\*/.test(resolved) && !/\*\*B · PDF\.\*\* ← \*\*chosen\*\*/.test(resolved), r.out);
+  ok("resolve-plan: a note on an answer is kept under it", /\*\*Q1\*\* \(step 1\): \*\*Local storage\*\*.*\n  - note: only until accounts exist/.test(resolved));
+  ok("resolve-plan: rewinds and slow-downs become 'hard to follow here', by step", /## Hard to follow here/.test(resolved) && /step 1: went back to 1\.5s from 4\.8s/.test(resolved) && /step 2: slowed to 0\.75× at 9s/.test(resolved));
+  const ledger = JSON.parse(readFileSync(join(tmp, ".reelplanning/decisions.json"), "utf8")).decisions;
+  const d1 = ledger.find((d) => d.questionId === "q1"), d2 = ledger.find((d) => d.questionId === "q2");
+  ok("reel record: the note travels with the decision", d1?.note === "only until accounts exist, then move to Postgres" && /\*\*Note:\*\* only until/.test(readFileSync(join(tmp, ".reelplanning/decisions.md"), "utf8")));
+  ok("reel record: a pick-all answer is recorded as the set of picks", d2?.chosen === "Web, Slides" && (d2?.chosenIds || []).join() === "a,c");
+  const scope = JSON.parse(readFileSync(join(pd, "revise-scope.json"), "utf8"));
+  ok("revise-scope: a note on an answer sends its step to the revise", scope.steps.some((s) => s.step === 1 && s.reasons.some((x) => x.kind === "answer-note")), JSON.stringify(scope.steps));
+
+  // seven open questions: a warning, not a failure
+  const seven = plan.replace(/## Open questions for the reviewer[\s\S]*/, "## Open questions for the reviewer\n\n" + Array.from({ length: 7 }, (_, i) => `${i + 1}. **Question number ${i + 1} about topic${i}?** (step 1)\n- **A · yes.**\n- **B · no.**\n`).join("\n"));
+  writeFileSync(join(tmp, "seven.md"), seven);
+  run("reel.mjs", "new-plan", tmp, "seven", "--plan", join(tmp, "seven.md"), "--date", "2026-09-23");
+  const c = run("reel.mjs", "check", join(tmp, ".reelplanning/plans/2026-09-23-seven"));
+  ok("reel check: seven open questions warn, and do not fail", c.code === 0 && /△ 7 open questions/.test(c.out), c.out);
+} finally {
+  rmSync(tmp, { recursive: true, force: true });
+}
+console.log(failed ? `✗ ${failed} failed` : "✓ review data: all passed");
+process.exit(failed ? 1 : 0);
diff --git a/skills/plan-to-video/SKILL.md b/skills/plan-to-video/SKILL.md
index a9da154..36de417 100644
--- a/skills/plan-to-video/SKILL.md
+++ b/skills/plan-to-video/SKILL.md
@@ -36,7 +36,7 @@ Most plans start in conversation: someone asks their agent for a plan. With reel
 
 1. Read `references/style-guide.md` in full. It overrides `/faceless-explainer`'s story-design where they disagree on structure.
 2. First run `reelplanning hyperframes-skills` (a no-op when current). It installs HyperFrames' skills at the version this repo pins and re-applies the TTS speed patch. Then run `/faceless-explainer` Step 0–2 as written (init under `videos/<plan-slug>/`, `BRIEF.md`, `capture/extracted/visible-text.txt` = the plan verbatim, a frame preset), with two exceptions. Skip its "keep this skill fresh" `skills update`. Run its init as `HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes init …`. Both of those otherwise refresh every skill from GitHub main. That bypasses the pin, undoes the speed patch and has already once shipped a `media-use` that could not load. Prefer a low-decoration preset; `music: none` always.
-3. Step 3: write `STORYBOARD.md` / `SCRIPT.md` as a series of parts (style guide §16: one part per chapter, 60–75 s each, an opener and a closer per part, `chapter_start` on each opener; a decision about how something looks is a prototype beat, not a card) under the style guide's beat order and seconds budget. Run the style guide's §8 self-check before continuing. Every `feature_showcase` frame carries `- plan_step: <n>`. Every open question in the plan becomes a **decision beat** right after its step (`- decision: q<N>`, `- question:`, `- option_a:`/`- option_b:`, `- why_a:`/`- why_b:`, `- recommended: a`) followed by one **branch beat per option** (`- branch: q<N>=a`), per style guide §9; the ending is the resolved plan (`- plan_questions:`). `reelplanning plan-map videos/<plan-slug>` turns these tags into `plan-map.json`, which the player uses to pause, ask, branch and export the reviewer's calls.
+3. Step 3: write `STORYBOARD.md` / `SCRIPT.md` as a series of parts (style guide §16: one part per chapter, 60–75 s each, an opener and a closer per part, `chapter_start` on each opener; a decision about how something looks is a prototype beat, not a card) under the style guide's beat order and seconds budget. Run the style guide's §8 self-check before continuing. Every `feature_showcase` frame carries `- plan_step: <n>`. Every open question in the plan becomes a **decision beat** right after its step (`- decision: q<N>`, `- question:`, `- option_a:`/`- option_b:`, `- why_a:`/`- why_b:`, `- recommended: a`) followed by one **branch beat per option** (`- branch: q<N>=a`), per style guide §9. A question can have two to four options (`option_a` … `option_d`), and a pick-all-that-apply question is `- kind: multi` with one `- summary: q<N>` beat instead of branches (style guide §19); the ending is the resolved plan (`- plan_questions:`). `reelplanning plan-map videos/<plan-slug>` turns these tags into `plan-map.json`, which the player uses to pause, ask, branch and export the reviewer's calls.
 4. Step 3.1 as written, but pass `--speed 1.25` to `audio.mjs` (Kokoro speaks at ~150 wpm; the guide wants 185+). The speed is **synthesised, not stretched** — `reelplanning patch-tts-speed --check` must pass first, because the Kokoro branch of media-use's `lib/tts.mjs` drops the speed it is handed unless patched, and any skills reinstall reverts that patch (`reelplanning hyperframes-skills` puts it back). Then `audio.mjs fetch-sfx`, then `reelplanning transcribe-missing videos/<plan-slug>` (the longest lines lose the engine's concurrency race and come back with no word timings; a frame with none gets no captions at all), then `sync-durations`, then `reelplanning hold-durations videos/<plan-slug>` — sync-durations sets every frame to its voice length, which flattens the held beats (a branch beat holds 5–8s even on a two-second line); the holds live in `.hyperframes/holds.json` and are a floor, never a cap. Steps 4–5 as written up to the frames. Then, in place of Step 5's captions/assemble and Step 6's transitions, run `reelplanning finish-project videos/<plan-slug>`. It does those same steps plus reelplanning's own: sentence captions, caption fades, theme, clip durations, local GSAP, plan map, plan diff, and a closing `check`. It refuses to start, and says which file is missing and how to fix it, when a HyperFrames skill script cannot load. Before render, run `reelplanning verify videos/<plan-slug>` (lint → check → snapshot); fix findings in the named frame and re-run.
 5. Open the review page: `reelplanning review videos/<plan-slug>` in the background, and give the person the URL it prints. Then report the MP4 path, the contact sheet, the final duration, and the word count vs the 185–254 wpm budget.
 
diff --git a/skills/plan-to-video/references/style-guide.md b/skills/plan-to-video/references/style-guide.md
index 08e426e..faa651d 100644
--- a/skills/plan-to-video/references/style-guide.md
+++ b/skills/plan-to-video/references/style-guide.md
@@ -251,3 +251,16 @@ Full on more than half the beats is a finding. The spine exists because an MP4 h
 watched as a file, position has to come from inside the frame. Inside the review player it is
 doubly redundant — the page has its own Steps list, and "one home per question" applies to
 "where am I" too.
+
+## 19. Richer questions and diagrams a newcomer can follow (v9, from the first real review)
+
+Decided in `.reelplanning/plans/2026-09-22-richer-review` (D-004, D-005).
+
+- **Two to four options.** A decision beat carries `option_a` … `option_d` (each with its `why_`) and one branch beat per option. A third or fourth option earns its place only when it is a real alternative someone would argue for, not a variation of another option. The player shows each option's letter; the reviewer can answer with that key.
+- **Pick all that apply.** When more than one option can be true at once (scope, formats, audiences), tag the decision beat `- kind: multi`. It has no branch beats. Instead, one **summary beat** follows it, tagged `- summary: q<N>`, with an element `data-plan-picks="q<N>"` where the player writes the picks (a `<ul>` or `<ol>` gets one `<li>` per pick; any other element gets the labels joined with ", "); narrate it generically ("these go into the first release"). This is D-004: one summary frame, the same length whatever is picked.
+- **As many questions as the plan needs.** There is no target number. Budget one decision per part of about a minute, so a plan with five open questions is five parts. `reel check` warns past six: a plan that open is not ready to review.
+- **A note on any answer.** Every answer can carry the reviewer's note (the player offers it on every question). Nothing to author, but never phrase an option so that it needs one to make sense.
+- **At most six parts on screen.** `frame-lint` fails a frame with more than six distinct `data-plan-component` parts. Introduce parts a few at a time; a resolved ending lists the steps and choices rather than the whole diagram. A beat whose job is the whole system (the system video's cast, a full map) declares `data-density="full"` on its root and is exempt, and it should be rare.
+- **One new thing per beat, in words a newcomer knows.** A beat adds at most one part or edge to the stage. A node's label is the part's name from `glossary.md`, never its script or file name (`The review player`, not `reelplanning-player.js`).
+- **The newcomer check.** The design critique asks, for every frame: could someone new to the repo say what each box on screen does, from the label and the narration alone? A box that fails is renamed, explained in the narration, or dropped from the frame.
+- **Watch signals.** Where a reviewer rewinds or slows down is sent with the review as "hard to follow here" on that step (D-005). A revise treats those steps as candidates for a plainer explanation, not as comments.

```
