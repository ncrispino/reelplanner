# Walkthrough: Richer review

**Status:** implemented on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` · **Decisions taken:** D-004 = one summary frame of the picks · D-005 = automatic rewinds and slow-downs

The script side (plan-map, resolve-plan, the reel CLI, revise-scope, the frame lint and the style guide) and
the player side were built by two agents at once, against one contract for the data between them. The
reviewer also asked for things during this plan's review that the plan did not cover: keys to jump
between parts, letter keys to answer, a note on any answer, a clearer part bar and a sound fix. Those
were built too and are listed under "Not in the plan".

## What was done, per step

### Step 1 — Questions with up to four options ✅

The storyboard takes `option_a` to `option_d`. `scripts/plan-map.mjs` keeps the options that are
present, so a question can have two, three or four. In the player (`packages/player/reelplanning-player.js`,
`.opts[data-n]`), three options sit in one row and four sit 2×2. Four go across only on a stage
1200px or wider, and phones stack them. The text is never shrunk (A7). `scripts/resolve-plan.mjs`
now reads the `A · Label` form real plans use (A1).

### Step 2 — Pick-all-that-apply questions ✅

A `- kind: multi` beat has no branches. It is followed by one summary beat tagged `- summary: q<N>`,
so D-004 holds. `plan-map.json` gives the question `kind: "multi"` and a `summary` frame, and
`resumeAt` is set to the summary's end. The player's options become ticks (the letter square is the
checkbox), and "Confirm N picks" records `option: "multi"` with `options` and `labels`. It then plays the
summary frame and writes the picks into `[data-plan-picks]` (A8). `reel record` stores the picks as one
ledger entry with `chosenIds` (A3), and `resolve-plan` marks every pick in the plan.

### Step 3 — As many questions as the plan needs ✅

`skills/plan-to-video/references/style-guide.md` §19 drops the "about three". The budget is now one
decision per part of about a minute. `reel check` (`scripts/reel.mjs`) warns, and never fails, when a plan
has more than six open questions.

### Step 4 — Type on the mark ✅

When a freehand stroke, arrow or box is finished, a text box opens beside it and the video stays
paused. Enter saves the words as the mark's `comment`, and Escape leaves the mark without words
(`openMarkBox` in the player). Shortcuts do not fire while typing. Clicking away keeps what was typed (A10).
**Changed after the walkthrough review:** Escape keeps the words too; only the box's × discards them.

### Step 5 — Diagrams a newcomer can follow ✅ (one deviation)

`scripts/frame-lint.mjs` rule 4b fails a frame showing more than six parts, unless the frame says
`data-density="full"` (A5). Style guide §19 adds "one new thing per beat, named in the glossary's
words" and the newcomer check to the design critique. **Deviation:** the close-the-lifecycle video,
built before the rule, has four frames that now fail it (7 and 10 parts). They were left as they are.

### Step 6 — Feedback only a video can give ✅

D-005 holds: nothing is asked of the reviewer. The player (`packages/player/reelplanning-player.js`) records `watch.moments`: a rewind of more
than 2 s by scrubbing or a key, and each time the speed is lowered below 1× (A11, A12). They are saved
across reloads. `resolve-plan` writes them under "## Hard to follow here", grouped by step (A4).

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
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
| A16 | 3 | while a question is open, A–D, O and Enter answer it and the letter shortcuts for drawing and copy are off | letters always being tools | a stray letter should never start drawing over a question; to draw on the frame, fold the question first | player `onKey` |

## Not in the plan (asked for in conversation while reviewing, not in the review file)

- **Part bar:** each part has a numbered chip and its title under its bar, and clicking one jumps
  there. The current part is highlighted and takes the room its title needs.
- **Keys:** N / P and Shift+→ / Shift+← jump to the next or previous part's start. A–D answer (and
  toggle on pick-all, with Enter to confirm), and O opens "answer in my own words". While a question is
  open, letters never start drawing.
- **A note on any answer:** "Add a note to this answer", saved as `note`. It can be edited in the record
  and is shown in Copy text.
- **Sound:** see A15.

## Code check

Run 2026-09-23 by a fresh agent from `code-check/brief.md` (`66423a3..0731c20`); findings in
`code-check/findings.md`. Each ✗, answered:

- **Step 3**: right. §19 was added but the old "1–3 open questions" and "prefer 2–3 decisions" lines
  stayed, so the guide contradicted itself. Fixed after the check: those lines in
  `skills/plan-to-video/references/style-guide.md` now defer to §19.
- **Step 5**: right. The lint enforced only the six-part cap, and §7 and §9 still asked for the whole
  diagram at the end. Fixed after the check: `scripts/frame-lint.mjs` rule 4c reads the glossary and
  fails a part labelled with a file name, and notes any label that is not its glossary name; §7 and §9
  now ask for the steps and choices. **Deviation:** "one new thing per beat" is still judged in the
  design critique, not linted: a static lint cannot tell what a beat adds.
- **Step 6**: right, a real gap. Moments reached `plan.resolved.md` but not `revise-scope.json`, so a
  hard-to-follow step was never revised. Fixed after the check: `scripts/revise-scope.mjs` adds a
  `hard-to-follow` reason per step, and the skill's Revise says to say that step more plainly.
- **`packages/player/reelplanning-player.js:1208`** (the part bar, N / P, Shift+arrows): asked for by
  the reviewer in conversation, in their own words ("i dont like how the part differentiator is… i want
  to be able to click keys on the keyboard to go to next section"), not in a review file. It is listed
  under "Not in the plan"; the calls inside it are A11's rows. No new row.
- **`packages/player/reelplanning-player.js:1429`** (A–D, O and Enter answer; letters stop being
  drawing tools while a question is open): asked for in the same message ("answer questions quickly eg
  'a' for answer a"). That letters stop drawing while a question is open is a call, and it was not
  logged: **A16** below.
- **`packages/player/reelplanning-player.js:1460`** (A10 does not match the code): the checker read the
  code at `0731c20`, before the review. A10 was changed after the walkthrough review, in `6efd644`
  (Escape keeps the words; a × discards them). **Deviation:** that change overturns step 4's "Escape
  leaves the mark without words", at the reviewer's request.

## Deviations from the plan or the decisions

- Step 5: the close-the-lifecycle video has four frames over the density limit. It is not rebuilt here.

## Evidence

- `npm test`: every spec passes, including the new `scripts/test/review-data.spec.mjs` (10 checks,
  the script side) and `packages/player/test/review-keys.spec.mjs` (57 checks, the player side).
- The player at 1440 light, 955 dark, 760 and 430 was screenshotted with four options, a pick-all
  question, a mark with words, the part bar and the record.

## Not done / not tested

- No real plan video has a four-option or pick-all question yet. The player was tested on a fixture
  (`packages/player/test/fixtures/l2-richer.json`).
- On a 430px phone, a long part title can still be cut short (the full title is in the tooltip).

## Quiz (for the walkthrough video)

| id | after step | question | options | answer | explain |
|---|---|---|---|---|---|
| K1 | 2 | You tick Web and Slides on a pick-all question. What plays next? | a) both options' branches · b) one frame listing your picks · c) nothing, the video moves on | b | D-004: one summary frame, the same length whatever you pick |
| K2 | 6 | You drag the playhead back 10 s to hear a step again. Where does the agent see it? | a) nowhere · b) as a comment · c) under "Hard to follow here", on that step | c | rewinds are sent automatically (D-005) and read as prompts to explain that step more plainly |
