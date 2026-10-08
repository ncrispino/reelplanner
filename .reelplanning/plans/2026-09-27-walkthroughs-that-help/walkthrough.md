# Walkthrough: Walkthroughs that help: see the build run, stop only where you'd notice

**Status:** implemented (steps 1 to 6; step 7 is next: the walkthrough was accepted in conversation on 4 Oct) on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (the approval folded
into step 3, `806f8aa`) · **Started from:** `806f8aa` · **Decided before the build:** D-219 (a short video of
it running), D-220 (no fixed count of pauses), D-221 (a listed choice is not judged), D-222 (a quick check where
there's something to predict), D-223 (a small pull request needs the video only for a choice you'd notice),
D-224 (one row per plan, a Plan | Built switch)

**Commits:** 294a0c4 0fe7672 9637026 c0d438e 34b7a04 bc341a1 300fc10 6faf4e6 f5906b8 e1b8205 (steps 1 to 6, walkthrough.md,
the code check, the walkthrough video and its late fixes; the guide reads its diffs from them)

## Categories of change

What landed, by kind (the plan guide's Built side reads this list: each kind's files, and the commits that are its).

- **About two minutes** {two-minutes} (294a0c4) (step 1): a walkthrough video aims for about two minutes of the change running; `build` warns past three.
- **The calls that pause** {pauses} (0fe7672) (step 2): an off-plan change always pauses; a call you'd notice or can't easily undo pauses on its step's one stop beat; every other call goes on the list at the end.
- **A check where there is something to predict** {checks} (9637026) (step 3): a walkthrough's quick check only just before the scene that runs the change, and one open question at the end.
- **Pull requests** {pull-requests} (c0d438e) (step 4): a pull request over 300 lines, or one making a choice you'd notice, gets the short walkthrough.
- **One row, Plan and Built** {one-row} (34b7a04 e1b8205) (step 5): the review page shows each plan on one row, with a Plan | Built switch.
- **Did it work** {measure} (bc341a1) (step 6): each verdict carries when its pause began; three walkthroughs accepted without a look make the next plan propose dropping the video.

## What was done, per step

### Step 1 — The walkthrough shows the change running ✅

**You can now:** see each change running, before and after, in the walkthrough video.

- **The skill and the style guide say the new shape** (D-219). The style guide's §8
  (`skills/plan-to-video/references/style-guide.md`) is rewritten: each change running, before and after, on
  the real screen when you'd see it, in a real run when it happens behind the page (the saved file before and
  after, a command's real output, a migration on a copy of real data); every change scene named under the
  brief's `- Real things:` (D-166); code only for a choice about an interface or data (D-023); at the end what
  ran, what is not done, and the list. A step with nothing running gets no scene, only a line at the end.
  `skills/plan-to-video/SKILL.md` says the same in **Build a video** and in **Implement**'s step 6.
- **The length:** a walkthrough aims for 1–2 minutes; `build` ends with a △ "long" past 3 and "too long" past
  5 (`scripts/lib/length.mjs`, choice A1), never a stop. The plan video's 3–5 minutes is unchanged. The style
  guide's §1 and §11, `docs/reference.md`, `docs/status.md`, the README's "2. Build" and the template brief
  (`templates/video/BRIEF.md`: its length line, and a walkthrough's `- Real things:` names every change scene)
  say so.
- **Kept as they were:** `walkthrough.md` keeps its per-step record in text and `reel audit` checks it as
  today; the file and folder names (`walkthrough.md`, `walkthrough-video/`) and the word walkthrough stay.

### Step 2 — A choice pauses the video when you'd notice it or can't easily undo it ✅

**You can now:** stop only on the choices you'd notice or can't easily undo, and flag the rest from a list.

- **The rule** (`stopFor` in `scripts/lib/autonomy.mjs`; D-220, no count): an off-plan change always pauses;
  a call labelled `visible` (you'd notice it) or `hard-to-undo` (stored data and formats, permissions, what
  others rely on) pauses, in the scene that shows it running; every other call (`close` alone, or no label)
  goes on the list. D-084's ten-in-a-row rule is gone (`STREAK` and `acceptedRun` removed): accepts no
  longer change what pauses. D-122 is kept: a call sharing a label with a recent late fix pauses; D-109
  too: a late fix with no label pauses nothing.
- **`reel stops`** (`scripts/reel.mjs`) prints each call as "pauses" or "listed" with why, then the pauses by
  step (a step's calls on one `- autonomy:` beat, each off-plan change on its own) and the list as one
  `- autonomy_list: …` line at the end (A2).
- **The list in the player** (`askList`, `listRows` in `packages/player/reelplanning-player.js`, A3): one
  sheet at the end, each choice in one line (what it chose, instead of what) with its own Flag; Go on (A)
  takes the rest as `listed` (A4). A flag there is a note on its step, as on a pause, and can be taken back.
  The record says "Listed, not judged". The plan map carries it as `autonomyGroups[]` with `list: true`
  (`scripts/plan-map.mjs`).
- **Listed, not judged** (D-221): `reel record` logs a listed call with status `listed` (never in force, so
  `reel check` does not warn a later plan by it); on an approved review a listed call the viewer never
  reached is listed too, since Approve takes the rest (A4). `reviews/<id>.md` names them apart from the
  accepted ones (`walkthroughScope`, `actOnMarkdown` in `scripts/lib/review-scope.mjs`). A flag on the list is a
  call to fix like any flag. Memory does not count a listed call as accepted or flagged (`reviewFacts` in
  `scripts/lib/memory.mjs`).
- **Where it is said:** the skill's tag table and **Implement** steps 1, 5 and 7 (what each label means and
  the line: same page, same buttons, same data on disk), the style guide's §1, §8 and §11, both copies of
  `theme/frame.md`, `docs/project-dir.md`, the README, the review page's "needs you" line for a walkthrough
  with a list (`scripts/bundle-player.mjs`), and the notification's line (`waitingLine` in
  `scripts/lib/notify.mjs`: "2 more on a list to flag if you'd change them").

### Step 3 — A quick check where there is something to predict ✅

**You can now:** predict what a change does, just before the video shows it running.

- **Where a walkthrough's check goes** (D-222): the style guide's §7 and §8 and the skill say it: only where the
  built change has something to predict, just before the scene that runs it, on the screen ("You press
  Escape: what happens?") or behind the page ("After the change, what does the saved file look like?", "how
  many are left unread?"). From the approval, in the plan and the guide both: "the page looks the same" is not
  "nothing to predict"; a change to what is saved or to a command's output is predicted and shown by a real
  run (the example: each date in the saved review file moved from one field to two). No fixed number; each
  check keeps its walk-through and its `- explained_at:`.
- **`check-terms`** (`scripts/check-terms.mjs`): in a walkthrough video (`kindOf`, from its folder) a check
  right after the beat that sets it up, and on that beat's own case, is where it belongs, so D-197's and
  D-198's two warnings are for the plan and system videos only; the "answer never shown" warning still
  applies. `scripts/test/terms.spec.mjs` has the case.
- **The open question at the end** (A5): the last beat carries `- open_question: Seeing it run, anything you'd
  change?` (`scripts/plan-map.mjs` → `openQuestion`), and the player asks it first in a walkthrough's Finish
  panel, with a box for the reviewer's words (`openQuestion`, `setOpenWords` in
  `packages/player/reelplanning-player.js`). The words go with the review as one note on no step (`open: true`),
  and `reviews/<id>.md` gives them a heading of their own, "Seeing it run" (`actOnMarkdown` in
  `scripts/lib/review-scope.mjs`). `packages/player/test/list.spec.mjs` and `scripts/test/lifecycle.spec.mjs`
  check both ends.

### Step 4 — Pull requests get the short walkthrough ✅

**You can now:** send a small pull request without a video unless it makes a choice you'd notice or can't easily
undo; its other choices are lines in its text, for a maintainer to accept.

- **Who makes the video stays** (D-200). `CONTRIBUTING.md` and its template (`templates/CONTRIBUTING.md`) say the
  video is "the walkthrough video, which shows the change running and pauses at what you'd notice"; a PR over
  300 lines needs it, a smaller one only for a choice you'd notice or can't easily undo (step 2's test, D-223);
  any other choice is a line in the PR's text that the maintainer accepts. The maintainer's checklist gains
  "the other choices in the PR's text are accepted".
- **The PR template** (`templates/pull_request_template.md`, copied to `.github/pull_request_template.md`): the
  box now reads "makes a choice you'd notice or can't easily undo", a new "## Other choices" section (one line
  each, what it chose instead of what), and the maintainer's "The other choices above are accepted" (A6).
- **`reel pr-check`** (`scripts/pr-check.mjs`): reads the box's new words as before (the old wording still
  reads); lists the other choices, notes one that does not say what it was chosen instead of, and waits until
  a maintainer ticks them accepted (with `--merge`, fails) (A6). Its stale check follows step 2's rule: a row
  labelled `visible` or `hard-to-undo`, or an off-plan change, that the video only lists is stale.
  `scripts/test/contributing.spec.mjs` covers each.
- **Said in** the skill's "Several people", `docs/lifecycle.md` and `docs/project-dir.md`.

### Step 5 — The plan and what was built, in one row ✅

**You can now:** switch between a plan's video and what was built, on one row.

- **One row per plan** (D-224; `scripts/bundle-player.mjs`): the review page's library shows each plan on one
  line, its short name, its date, one word for where it stands, and a **Plan | Built** switch (two links, the
  one open marked; a video that does not exist yet is a greyed segment, "Not built yet"). `library.json` keeps
  both videos' names (`<plan>`, `<plan>--walkthrough`) on the plan's entry, with `status` and, for a plan with
  both, `steps`: where each video's scenes of each plan step start (A7).
- **The switch at the top of the page** (the page's header, beside the title): on a plan video it is "See it
  built", opening the walkthrough at the same step's running scene (`?project=<plan>--walkthrough&t=<start>`,
  from the walkthrough's plan map); on the walkthrough, "See the plan", back to that step in the plan video. It
  follows the step on screen (its link is kept current twice a second), and on a step the walkthrough runs
  nothing for it says "Nothing to run for this step" (A8).
- **The two reviews stay separate records** (`reviews/plan-*.json`, `reviews/walkthrough-*.json`): nothing in
  `reel record` or the player's review changed.
- **Checked** by `packages/player/test/bundle.spec.mjs` over a bundle of details-in-the-frame's two videos and
  the system video with `--reelplanning .reelplanning` (15 plan rows, "Earlier plans (10)", the header switch's
  link to step 1's running scene, and landing there), and over `npm run bundle`'s `dist/review` (no plans, the
  worked examples under "Other videos"); "Nothing to run for this step" checked on a copy with step 1 taken
  out of the walkthrough's table. Looked at in light and dark, at 1440 and at 390 wide.

### Step 6 — Measure whether it worked, and what happens if it didn't ✅

**You can now:** see how long each pause held you, to judge whether the pauses help.

- **When each pause began** (`packages/player/reelplanning-player.js`: `pauseBegins`, `shownAtOf`): every pause
  that holds choices (a choice's own, a step's stop, the list, an older video's grouped beat) notes when it
  began, and each verdict given there carries `shownAt` beside its `judgedAt` (an answer in your own words
  too). Met again, the pause begins again. A verdict changed from the record, with no pause, has no `shownAt`.
  `packages/player/test/list.spec.mjs` checks it.
- **`reel memory`'s `after-build` line** (`afterBuildOf`, `memoryLines` in `scripts/lib/memory.mjs`): per walkthrough
  review, the seconds from each pause to its answer (the middle value), flags, answers in your words, written
  comments (the player's own "Flagged: …" label is not one), and whether it was sent before the video could have
  played through (less than its watched length after the first play, or never played). Today it reads "15
  walkthrough reviews: no pause timed yet; 1 flag, 7 in your words, 14 comments; 9 sent before the video could
  have played through." `reel status` shows at most seven lines now.
- **The bar** (`BAR`, `clearsBar`, `walkthroughBar`): over the first three walkthrough reviews whose pauses are
  timed, a pause holds you at least five seconds (the middle value) and there is at least one flag, answer in
  your words or comment; both halves are needed (A10). When all three miss it, `reel status` ends with
  "△ walkthroughs: still accepted without a look (3 of 3), a plan to drop the walkthrough video is due"
  (`status` in `scripts/reel.mjs`).
- **What happens then** is in the skill (**A new plan**, step 2): the agent's next plan proposes dropping the
  walkthrough video, as a plan reviewed like any other; what would go, what stays, what replaces it; nothing
  changes until it is approved, and asking for changes or never answering keeps walkthrough videos (D-129).
- `scripts/test/memory.spec.mjs` covers `afterBuildOf`, the bar, the line, and `reel status`'s message on three
  scratch reviews (and none once one of them held for 9 s with a comment).

### Step 7 — The system video says the new rule, a bit shorter ⏳

Not done yet, and not this build's: the system video is brought up to date after the walkthrough is accepted
(D-003), which it was in conversation on 4 Oct (`reviews/walkthrough-20261004T163158Z.md`). What that update changes: the scenes "Two videos for every plan", "What stops the walkthrough" and "One
stop per step" (one scene of about 20 s), "Fixing what you flagged", its last quick check, and the glossary rows
for `reel stops`, the walkthrough video and the grouped scene ("accepted in a row" goes). The build already
reports the system video's length as a warning only (`scripts/lib/length.mjs`: aim 5–8 minutes, △ past 10), so
eight minutes is a soft target as the step says; the style guide's §1 says so.

## Also: the videos list (the owner's ask, during step 5)

Two notes from the owner on the same page: switching between a plan's video and its walkthrough should be
clean and obvious, and "toggling to view other videos, it gets kind of long and hard to read, we could prog
disclosure some too". So the switch is one segmented control, in each row and in the header (A8), and the list
shows what needs you first, then the system video and the recent plans, the rest folded (A9). The earlier
two-row "Plan video / Walkthrough" groups and the separate "Needs you" chips are gone (`scripts/bundle-player.mjs`).

## Tests run

- `npm test` (the fast run, 29 specs) after each step: all pass after steps 4 and 6 (each run in this
  checkout). After step 5, `answer-on-frame.spec` failed one hover-timing check ("the pointer over a card rings
  it in coral", the ring at 0.984 alpha mid-transition) and passed when run again alone, the flake
  `scripts/test/run.mjs` already names.
- New and changed specs: `packages/player/test/list.spec.mjs` (new, 20 checks: the list, Go on, the record, the
  export's `listed` and `shownAt`, the frame's cards, the open question in Finish), `scripts/test/lifecycle.spec.mjs`
  (`reel stops` by the new rule; `reel record` of a list; "Seeing it run"), `scripts/test/memory.spec.mjs`
  (`stopFor`, `afterBuildOf`, the bar, `reel status`'s message), `scripts/test/contributing.spec.mjs` (the box,
  other choices, the stale check by step 2's rule), `scripts/test/terms.spec.mjs` (a walkthrough's check),
  `scripts/test/build.spec.mjs` (the walkthrough's length), `scripts/test/loop.spec.mjs` (the notification line),
  `packages/player/test/bundle.spec.mjs` (rows, fold, switch; over a bundle of details-in-the-frame's two videos
  and the system video, and over `npm run bundle`'s `dist/review`).
- The player specs outside the fast run that touch what changed: `stop`, `band`, `finish`, `handoff`,
  `own-answer`, `changes`, `revisit`, `local-review`, `details` pass. `group.spec` fails one check ("on the frame:
  each Flag hangs from its own card", A7's Flag 88 px under its card): it fails the same way at `806f8aa`, before
  this build, so it is not this plan's (see Not done).

## Decisions in force

- **D-219** to **D-224** (this plan's): held, as each step's entry says (steps 1 to 6).
- **D-001** (a second agent checks the code) held: the code check below, by a fresh `claude -p`.
- **D-002** (a flagged call is fixed and the touched scenes rebuilt) held: a flag on the list is a call to fix like
  any flag (`walkthroughScope` in `scripts/lib/review-scope.mjs`; `scripts/test/lifecycle.spec.mjs`).
- **D-003** (the system video brought up to date after an accepted walkthrough) held: step 7 waited for that (accepted 4 Oct).
- **D-023** (code only where it matters) held: the style guide's §8 says code only for a choice about an
  interface or data (`skills/plan-to-video/references/style-guide.md`).
- **D-084** superseded (step 2): `STREAK`, `acceptedRun` gone from `scripts/lib/autonomy.mjs`.
- **D-083** superseded for the walkthrough only (step 3): §7 keeps one check per step for the plan and system videos.
- **D-041** superseded for listed choices (step 2): a `listed` entry is never in force (`status` in `scripts/reel.mjs`).
- **D-214** narrowed (step 4): `scripts/pr-check.mjs`, `templates/CONTRIBUTING.md`.
- **D-133** relaxed (step 7): the system video's length is a warning only, as it already was (`scripts/lib/length.mjs`).
- **D-109** (a late fix with no label pauses nothing) and **D-122** (a late fix of a label pauses a call sharing it)
  held: `stopFor` in `scripts/lib/autonomy.mjs`; `scripts/test/memory.spec.mjs`.
- **D-110** (at a step's fifth call, ask) held: no step reached five (steps 1 to 6 have one, three, one, one, two and
  one; the owner's ask on the videos list has one) (`walkthrough.md`, this table).
- **D-127** (plain words on screen) held: the player says choice, list, "Go on", "Listed, not judged", "Seeing it
  run" (`packages/player/reelplanning-player.js`); the page says Plan, Built, waiting (`scripts/bundle-player.mjs`).
- **D-129** (approving is never blocked) held: a missed bar only says a plan is due (`status` in `scripts/reel.mjs`).
- **D-166** (the brief picks which scenes show the real thing) held: a walkthrough's brief names every change scene
  (`templates/video/BRIEF.md`, the style guide's §8).
- **D-197**, **D-198**, **D-199** (when a quick check comes) held for the plan and system videos; a walkthrough's
  check comes just before its run (`scripts/check-terms.mjs`, `WALKTHROUGH`).
- **D-194**, **D-195**, **D-196** (a detail opens from the thing it explains) held: untouched
  (`packages/player/reelplanning-player.js`, `detailMark`, `openDetail` unchanged).
- **D-142**, **D-167** (the coral and today's look) held: the list, the open question, the rows and the switch use
  the page's tokens (`--ink`, `--paper`, `--accent`, in `scripts/bundle-player.mjs` and the player's `STYLE`).
- **D-200**, **D-202**, **D-213**, **D-215** (who makes a PR's video; the maintainer's code check; the throwaway
  branch) held: `templates/CONTRIBUTING.md` keeps them as they were.
- **D-201** (the log keeps the last answer) held: untouched (`scripts/reel.mjs`, `record`).
- **D-005**, **D-024**, **D-065**, **D-082**, **D-085**, **D-106**, **D-107**, **D-128**, **D-169**, **D-170**,
  **D-171**, **D-216**, **D-217**, **D-218** (rewinds, detail templates, a system-video comment, the sandbox, less
  scaffolding, your memory file and the retro, where "watched" is kept, the case study, decision numbers, the
  labelled words) held: not touched (`scripts/lib/memory.mjs` gains a line and keeps its file; `scripts/review.mjs`,
  `scripts/lib/sandbox.mjs`, `scripts/case-study.mjs`, `scripts/renumber.mjs`, `scripts/lib/jargon.mjs` unchanged).

## Code check

A fresh agent (`claude -p`, with only the brief's prompt, and write access to `code-check/findings.md` alone)
checked `806f8aa..HEAD` over this plan's 37 files (the other plan committed in between, videos-that-make-sense,
left out): **steps 6 of 7 ✓, decisions 42 of 42 ✓, unexplained 1 ✗** (`code-check/findings.md`).

- **✗ Step 7** (the system video): not built, as this report says (D-003: it waits for this walkthrough's
  acceptance). No row: it is the plan's own order, not a choice.
- **✗ `packages/player/test/bundle.spec.mjs:74`**, the "Earlier plans" check keyed on `status === "waiting"`,
  which `library.json` never holds (the page works "waiting" out from what needs you): on a repo with a plan
  waiting and six or seven in all, the check would have expected a fold the page rightly leaves out. Fixed in
  the spec: it now counts the plan rows in the list itself (not those under "Needs you") and expects the fold
  past five. No row: a test's mistake, the page was right.

## Not done

- **Step 7, the system video**, is next: this walkthrough was accepted in conversation on 4 Oct, and D-003 brings the
  system video up to date after that; see its entry.
- **`group.spec`'s failing check** (a grouped beat on side-by-side cards: the third Flag lands under the row, not
  its card) is older than this plan; the list, built on a stop's rows, shows the same placing on side-by-side
  cards, and `list.spec` checks it on stacked cards, as `stop.spec` does.
- **Older walkthroughs** keep their grouped beats and their length; none is rebuilt (the plan's "Not in this plan").

## Also: found by this plan's walkthrough video

- **A tool's name over two words showed its backticks in the captions.** The script writes `` `reel memory` ``;
  the caption layer drew each word's code on its chip but kept the backtick beside it, so the captions read
  "`[reel memory]`". Now the backticks that mark the code are never drawn beside the chip (`__rpShowWord` in
  `scripts/lib/names.mjs`); one new check in `scripts/test/names.spec.mjs` (it fails on the old layer).

## Late fixes, before the review (the lead's look at the screenshots)

- **"Nothing needs you" above rows that said "not reviewed".** The top of the videos list counted only the videos
  on this page; the rows said the plan's own stage. Now one word per row says what waits and on whom: on you, "plan
  to review", "walkthrough to review", "questions to answer"; on the agent, "building", "revising", "fixing"; done,
  "approved" (and "sent" once you sent it from this browser). Every row that waits on you is under "Needs you",
  its video on this page or not, and the Videos button counts them (`STATUS_WORD`, `stateOf` in
  `scripts/bundle-player.mjs`). A9's row says so.
- **Names cut short** ("Videos that make s…"): a plan's name wraps to two lines, never cut, at desk and phone widths.
- **Greyed Plan | Built on rows whose videos are not on this page:** the switch shows only where both videos are
  here; one video is its one link; none is a short "not on this page". The header's switch shows only for a plan
  with both videos here.
- **The caption pill behind "Add a note"** (the designer pass on videos-that-make-sense): on a question met again
  after going back, a caption group stayed visible behind the answer row, because going back undid its own
  `visibility: hidden` and left it inline visible, which the player's hidden on the captions' parent did not reach.
  The player now hides the captions' descendants too, and fades the captions out while a question is up
  (`syncBand` in `packages/player/reelplanning-player.js`). A new check in `packages/player/test/frame-room.spec.mjs`
  meets details-in-the-frame's first question again after going back; it fails on the old player.
- `packages/player/test/bundle.spec.mjs`: one row per plan with what it can open, "Needs you" agreeing with the rows,
  and names never cut. The walkthrough video's scene 9 was rebuilt with the new list (its frame id kept).

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop) | keeping "too long" at 10 minutes, or no "too long" at all | the plan aims for about two minutes and the build warns past 3; a walkthrough past 5 is as long as today's, the thing this plan replaces, so it says so more firmly | `scripts/lib/length.mjs` (`BUDGET.walkthrough`), `scripts/test/build.spec.mjs` ("length: …") |
| A2 | 2 | The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos [close] | reusing `- autonomy_group:` for the list, or no beat at all (the list only in the Finish panel) | the list is judged differently from a grouped beat (Flag or leave, never Accept), so the player and `reel record` must tell them apart; older walkthroughs keep playing as they were | `scripts/plan-map.mjs` (`autonomyList`, `list: true`), `scripts/reel.mjs` (`stops`), `scripts/lib/autonomy.mjs` (`listedOf`) |
| A3 | 2 | The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card [visible] | an Accept and a Flag per row, or the grouped beat's row of Flag buttons with the words only on hover | the plan says each choice in one line with its own Flag, and Approve takes the rest; hover-only words were the thing that made choices hard to judge | `askList`, `listRows` in `packages/player/reelplanning-player.js`; `packages/player/test/list.spec.mjs` |
| A4 | 2 | "Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged" [close] | only at Approve, or listing unreached choices whatever the verdict | Go on is the list's Accept all; "Approve takes the rest" is the plan's words, and a review asking for changes has not taken anything | `acceptGroup` in `packages/player/reelplanning-player.js`; `walkthroughScope` in `scripts/lib/review-scope.mjs`; `scripts/test/lifecycle.spec.mjs` ("reel record, the list") |
| A5 | 3 | The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md` [visible, close] | a pause on the ending frame with its own box, or a new field in the review file | the plan cuts pauses, and Finish is where every review ends anyway; a note needs no new field, reaches the agent like any comment, and counts as your words (so Finish suggests Request changes once you have written some) | `openQuestion`, `setOpenWords`, `showHandoff` in `packages/player/reelplanning-player.js`; `actOnMarkdown` in `scripts/lib/review-scope.mjs`; `packages/player/test/list.spec.mjs` |
| A6 | 4 | A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure [visible, close] | the choices in a comment on the PR, or no tick (reading them is accepting them) | a line in the PR's text is where the plan puts them, and a tick is something `pr-check` can read, so accepting is never forgotten at merge | `templates/pull_request_template.md`, `.github/pull_request_template.md`, `scripts/pr-check.mjs` (`otherChoices`), `scripts/test/contributing.spec.mjs` ("D-223") |
| A7 | 5 | The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`) [close] | a scene the walkthrough marks as the step's running one, or the player fetching the other video's plan map as it plays | every built walkthrough already tags its scenes by step, so older ones jump right too; the page is built from both maps anyway, and a tenth in keeps the seek off the scene before | `stepStarts` in `scripts/bundle-player.mjs`; `packages/player/test/bundle.spec.mjs` ("lands there") |
| A8 | 5 | One control: the header's Plan–Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes [visible, close] | a "See it built" button on each plan scene beside the switch | the owner asked for switching to be clean and obvious, with no competing links; the switch already says where you are, and the same click then lands on the same step | `#pb` in `scripts/bundle-player.mjs` (`LIBRARY_JS`); `packages/player/test/bundle.spec.mjs` ("the header's Plan–Built switch") |
| A9 | videos list | The list's order: what needs you first (a plan waiting on you says what to review and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word; changed before review, the lead's look: the word says what waits and on whom, every row waiting on you is under "Needs you" its video here or not, names wrap to two lines, and a row whose videos are not here says "not on this page" instead of a switch), and on a phone the word under the name [visible] | every plan in date order, two rows each, or a search box | the owner asked for what waits first and the rest folded; five is about the last week of plans here, and one word keeps a row on one line | `LIBRARY_JS`, `STATUS_WORD` in `scripts/bundle-player.mjs`; `packages/player/test/bundle.spec.mjs` ("Earlier plans (N)") |
| A10 | 6 | The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss | pooling the three reviews' pauses into one middle value and one count, or counting reviews from before pauses were timed | "the next three walkthroughs" means reviews made after this change, and "3 of 3" in the status message counts reviews; one review that was looked at is enough to keep the video | `walkthroughBar`, `clearsBar` in `scripts/lib/memory.mjs`; `scripts/test/memory.spec.mjs` ("walkthroughBar") |

## For the guide

*Written after the build, for the guide (D-265): how each step works, drawn; worked examples, each from a run saved in
`runs/`; and what the video leaves out. Nothing above this section was changed. The runs were made on 30 Sep 2026: `reel
stops` and `reel memory` on this repo as it is that day, `reel pr-check` in a scratch repo, and one `grep` of this
plan's own walkthrough video, for what `reel stops` said when the video was built. Added on 30 Sep 2026 after the
guide's first review round, still after the build: the worked examples of steps 1, 3 and 5, each from a run made that
day in this repo (`bundle-player` packing into a folder beside it), with step 5's Limits line, which said no run of
the page was saved, made true again; and the line below saying which runs were made in a scratch repo. Added after the
guide's second review round (30 Sep): `runs/stops.txt` and `runs/stops-plan-guide.txt` saved again once `reel stops`
no longer counted a row changed before any review accepted it as a late fix, `runs/misses.txt`, and what the
`group.spec` line under Not done became since. Above this section, the steps' "You can now" lines were added for the
guide (30 Sep), and one Not done line that named no undone work was taken out (30 Sep): "the quick checks' 'Back to
where this was explained' in a walkthrough goes to the beat that set the change up, as in any video; nothing new."
Changed after the third round (30 Sep): step 4's "You can now" line above, which said "get the same short walkthrough
with a pull request that needs a video", says what changed for a pull request; below, step 4's opening line and who
makes the video, and the `group.spec` line in plain words.*

**Ran in a scratch repo:** `runs/pr-check-other-choices.txt`, `runs/pr-check-other-accepted.txt` — a scratch repo with
an `origin`, holding a 2-line pull request whose text fills in the template's two other choices (each run's own note
says which).

#### In plain words

- **`group.spec`'s failing check**: a failing layout test, the test's own mistake and not the player's

#### Since then

- **`group.spec`'s failing check**: settled on 29 Sep (`911156f`), and it was the test's, not the player's: its fixture
  drew cards over frame 10 and left the frame's own words live under them, which the layout rightly reads as A7's
  card's, so A7's Flag hung 88 px low. The fixture now hides the frame's own drawing, and the check waits for the
  settled layout instead of a fixed 250 ms. Run again on 30 Sep, `group.spec` passes, "each Flag hangs from its own
  card" included.

**In one sentence:** the walkthrough video now shows each change running in about two minutes, and stops only for
the choices you would notice or could not easily undo; the rest wait for you on one list at the end.

```diagram
flow: A choice the agent made, from walkthrough.md to you
walkthrough.md (file) -> reel stops: each row and its labels
reel stops -> a pause: off-plan, visible, hard to undo, or like a recent late fix
reel stops -> the list: close, or no label
a pause -> you (person): accept or flag, in the scene running it
the list -> you: flag any; Go on takes the rest
you -> reel record: accepted, flagged, or listed
reel stops = reel stops | #step-2
the list = the list at the end | #step-2
reel record = reel record | scripts/lib/review-scope.mjs
```

### For step 1 — The walkthrough shows the change running

```diagram
flow: What a walkthrough scene shows for a change
a change -> the real screen: you would see it on a page
a change -> a real run: it happens behind the page
a real run -> before and after: a saved file, a command's output
a change -> a line at the end: nothing runs for it
```

#### Worked examples

##### This plan's own walkthrough, against its length
- **Input:** the length line `reelplanning build` ends with, for this plan's walkthrough video
- **What happens:** the length is the sum of the storyboard's `- duration:` lines, the watched length without the
  pauses where the player waits for you, held against a walkthrough's budget (`BUDGET.walkthrough` in
  `scripts/lib/length.mjs`: aim 1–2 minutes, "long" past 3, "too long" past 5). This video runs 2:55: past the aim,
  under "long", so `build` ends with a ✓ and this line.
- **Predict:** it is past the aim of 1–2 minutes. Does `build` warn?
- **Output:** `runs/length-walkthrough.txt`
- **Edge cases:**
  - Past 3 minutes the line says "long" and `build` marks it △; past 5, "too long". Neither stops the build (A1).
  - A plan video keeps its own budget, 3–5 minutes: the budget is chosen by the video's folder
    (`walkthrough-video/`).

##### Each change scene names the real thing it shows
- **Input:** `grep -n -A4 '^- Real things:' .reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough-video/BRIEF.md`
- **What happens:** the brief this video was built from names, scene by scene, the real thing each change scene
  shows: a command's real output (`reel stops`, `reel pr-check`), the page before and after, the saved review file
  before and after. The two scenes that explain a rule (2 and 10) say so, and show words.
- **Output:** `runs/real-things.txt`
- **Edge cases:**
  - A step with nothing running gets no scene, only a line at the end: step 7 (the system video, still waiting) has
    none in this video, and no scene is named for it here.

#### Why it works this way

A walkthrough that tours the code asks you to judge code you did not write, at the speed of a video. Seeing the change
run asks something you can answer: is this what you wanted? Code is shown only where the choice is about an interface
or data (D-023).

#### Limits

- The length is a warning, never a stop: a walkthrough aims at 1 to 2 minutes, `build` says "long" past 3 and "too long"
  past 5 (`BUDGET` in `scripts/lib/length.mjs`). This plan's own walkthrough video runs 2:55 (its plan map's
  `totalSeconds`, 175.4): over the aim, under the warning.

### For step 2 — A choice pauses when you'd notice it or can't easily undo it

```diagram
flow: Does a choice pause the video?
a choice -> off-plan?: its labels
off-plan? -> p1: yes
off-plan? -> visible, or hard to undo?: no
visible, or hard to undo? -> p2: yes
visible, or hard to undo? -> like a recent late fix?: no
like a recent late fix? -> p3: yes, a label shared
like a recent late fix? -> the list at the end: no
p1 = it pauses | #step-2-examples
p2 = it pauses | #step-2-examples
p3 = it pauses | #step-2-examples
the list at the end = the list at the end | #step-2-examples
```

The rules are checked in that order, and the first that holds decides (`stopFor` in `scripts/lib/autonomy.mjs`). A late
fix is a choice accepted in a review and changed later; it stays "recent" while its plan is one of the last five
(`RECENT_PLANS` in `scripts/lib/memory.mjs`), and while it does, every choice sharing one of its labels pauses.

#### Worked examples

##### This plan's own choices, today
- **Input:** `reel stops .reelplanning/plans/2026-09-27-walkthroughs-that-help`
- **What happens:** each choice with its step, "pauses" or "listed", and why; then the beats a storyboard gives them:
  one pause a step, and one list at the end.
- **Predict:** A2, A4 and A7 are labelled `close` only. When the video was built, they were on the list. Are they still?
- **Output:** `runs/stops.txt`
- **Before:** when the video was built (its scene 4 shows the run): A2, A4 and A7 `listed close: on the list at the end`
  (`runs/stops-in-the-video.txt`)
- **After:** today, the same: A2, A4 and A7 `listed close: on the list at the end`. No recent late fix carries the
  label `close`: the two recent ones with a label are both `visible` (D-133 and D-206, `runs/misses.txt`), so nothing
  makes a `close` choice pause.
- **Edge cases:**
  - A row that says "changed after review" is a late fix only when a review accepted it before the change.
    explain-first's A9 and A13 were left unjudged by its first walkthrough review (29 Sep), changed that evening
    (984b2f3), and accepted as changed on 30 Sep: changed, then accepted, so neither is a late fix (`changedAt` in
    `scripts/lib/memory.mjs` reads from git when the row's note went in).
  - A late fix with no label makes nothing pause (D-109): there is no label to share.
  - Accepting ten choices in a row no longer changes what pauses: that rule was dropped with this plan (D-219).

##### A later plan's choices
- **Input:** `reel stops .reelplanning/plans/2026-09-28-plan-guide`
- **What happens:** 12 of its 16 choices pause: ten labelled `visible` or `hard-to-undo`, and the two changes to the
  plan (D1, D2), each on a beat of its own. The four labelled `close` only (A5, A6, A7, A14) go on the list at the
  end, as they do in its video.
- **Output:** `runs/stops-plan-guide.txt`

#### What else was considered

- A fixed number of pauses a video. D-220 dropped it: the number is whatever the choices you would notice come to.

#### Files and commands

- `stopFor` and `missFor` in `scripts/lib/autonomy.mjs`; `reel stops` in `scripts/reel.mjs`; the list in the player,
  `askList` and `listRows` in `packages/player/reelplanning-player.js`.

### For step 3 — A quick check where there is something to predict

```diagram
sequence: Where a walkthrough's quick check goes
the video -> you (person): the scene that sets it up
the video -> you: the check: what will happen?
you -> the video: your guess
the video -> you: the scene that runs it
note the video: the answer is on screen, from a real run
```

#### Worked examples

##### Which of two choices pauses, predicted on the screen
- **Input:** `grep -n -A9 '^## Frame 3 ' .reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough-video/STORYBOARD.md`
- **What happens:** scene 3 asks it just before scene 4 runs `reel stops` on this plan, so the answer is on screen a
  moment later, from the real run. The question names two of this build's choices: A3, labelled visible, and A2,
  labelled only close.
- **Predict:** which of them pauses the video?
- **Output:** `runs/quick-check-k1.txt`, then `runs/stops-in-the-video.txt` (lines 3-4)
- **Edge cases:**
  - The video shows what `reel stops` said when it was built. Run today it says the same (`runs/stops.txt`, lines
    3-4): A2 on the list, A3 paused. A recent late fix labelled `close` would make A2 pause too, and the answer on
    screen would then be out of date.

##### The page looks the same; the saved file does not
- **Input:** the video's second quick check (scene 11), which asks what one saved answer holds now, when nothing on
  the review page looks any different after this build.
- **What happens:** nothing on the page changed, so what there is to predict is behind it: each answer in a saved
  review now keeps `shownAt`, when its pause began, beside `judgedAt`, when you answered (step 6). Scene 12 shows
  the file before and after. Here, one answer from a real walkthrough review of this repo on each side of the change:
  one filed on 27 Sep, before step 6's commit, and one filed on 28 Sep, after it.
- **Predict:** what does the later answer hold that the earlier one does not?
- **Output:** `runs/saved-answer-before.txt`, then `runs/saved-answer-after.txt`
- **Edge cases:**
  - "The page looks the same" is not "nothing to predict": a change to what is saved, or to a command's output, is
    predicted and then shown by a real run, as the plan's approval asked.

#### Why it works this way

A check before the scene that runs the change makes you picture it first, so the run either confirms what you
expected or surprises you, and a surprise is what a review is for. A check with nothing to predict ("the page looks
the same") is not asked; a change to a saved file or a command's output is predicted and then shown by a real run.

#### What breaks it

- `check-terms` used to warn when a check sat right after the beat that set it up (D-197, D-198). In a walkthrough that
  is where it belongs, so those two warnings are now for plan and system videos only (`kindOf` in
  `scripts/check-terms.mjs`).

### For step 4 — Pull requests get the short walkthrough

**In short:** the pull request template's box now reads "makes a choice you'd notice or can't easily undo": ticked, a
pull request under 300 lines needs the walkthrough video. Any other choice goes under the template's new "Other
choices", a line each, and a maintainer ticks them accepted.

```diagram
flow: A small pull request's choices
a choice -> the box: you'd notice it | ticked, the pull request needs the video
a choice -> Other choices: any other | a line in the PR's text: what it chose, instead of what
Other choices -> a maintainer: ticks accepted | until then reel pr-check waits, and with --merge it fails
the box = the box | templates/pull_request_template.md
```

#### Worked examples

##### Two other choices, not yet accepted
- **Input:** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
- **What happens:** a 2-line change: no video. Its two other choices are read from the PR's text. One does not say what
  it was chosen instead of, and `reel pr-check` asks for that; both wait for a maintainer.
- **Output:** `runs/pr-check-other-choices.txt`

##### Accepted, as CI checks before a merge
- **Input:** `reel pr-check . --base origin/main --body-file ../pr-ok.md --labels "" --merge`
- **Output:** `runs/pr-check-other-accepted.txt`
- **Edge cases:**
  - The note asking for "instead of …" stays, and does not stop the merge.
  - With `--merge`, choices not yet accepted fail.

#### Who makes the video

Unchanged (D-200): the contributor brings it, or a maintainer's agent makes it from the diff. `CONTRIBUTING.md`, its
template and the pull request template keep saying so; the video they name is now the walkthrough video, which shows
the change running and pauses at what you'd notice.

### For step 5 — The plan and what was built, in one row

```diagram
sequence: The Plan | Built switch
you (person) -> plan video: watching step 3
plan video -> walkthrough: See it built: step 3, running
walkthrough -> plan video: See the plan: back to step 3
note walkthrough: a step it runs nothing for says "Nothing to run for this step"
```

The switch knows where each step starts in each video from `library.json`, which keeps, for a plan with both videos,
the time each step's scenes begin in each of them (A7); the link follows the step on screen, updated twice a second
(A8).

#### Worked examples

##### One row for a plan with both videos
- **Input:** `reelplanning bundle-player ../wth-review .reelplanning/plans/2026-09-27-walkthroughs-that-help/video .reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough-video`
- **What happens:** the review page is packed with this plan's two videos, into a folder beside the checkout. Its
  `library.json`, which the page's list and its Plan | Built switch read, holds the plan once: both videos' names on
  the one entry, one word for where it stands, and, since the plan has both, `steps`: the time each plan step's
  scenes begin in each video. Before this step, the plan says, the page listed each plan as two separate rows.
- **Output:** `runs/bundle-one-plan.txt`, then `runs/library-row.txt`
- **Edge cases:**
  - Step 7 has a start in the plan video and none in the walkthrough's (`steps.built` stops at 6): on step 7, the
    switch says "Nothing to run for this step" (A8).
  - A plan with only its plan video gets a greyed "Built" segment, "Not built yet", and no `steps`.

#### Limits

- The review page is built by `bundle-player` from every video it is given; the runs above pack only this plan's two,
  in a folder beside the checkout, not the repo's whole page. The video's scenes 8 and 9 show the whole page.

### For step 6 — Measure whether it worked

```diagram
flow: Does the walkthrough earn its place?
a pause begins -> held: shownAt
you answer -> held: judgedAt | held is judgedAt minus shownAt, for each verdict given at a pause
held -> the bar: 5 s or more, and words | the middle value over a review, and at least one flag, comment or answer in your words
the bar -> reel status: three reviews miss it | it proposes a plan to drop the walkthrough video
```

#### Worked examples

##### This repo's walkthrough reviews
- **Input:** `reel memory . after-build | head -1`
- **What happens:** over every walkthrough review on file: how long a pause held you (the middle value), flags, words,
  and how many were sent before the video could have played through. Only reviews made since the review file keeps
  when each pause began (`shownAt`, step 6) are timed: three of them.
- **Predict:** the bar needs both halves, at least 5 s and some words of yours, in each of the first three timed
  reviews. How many clear it?
- **Output:** `runs/memory-after-build.txt`
- **Edge cases:**
  - When all three miss it, `reel status` ends with "a plan to drop the walkthrough video is due". Nothing changes
    until that plan is reviewed and approved; not answering keeps the videos (D-129).

#### Why it works this way

Approving a walkthrough without looking is the failure this plan is about, and a count of approvals cannot see it. Time
held at a pause and words written can: both are needed, because a long pause with nothing said is as likely to be a
tab left open.

#### Files and commands

- `pauseBegins`, `shownAtOf` in `packages/player/reelplanning-player.js`; `afterBuildOf`, `BAR`, `walkthroughBar` in
  `scripts/lib/memory.mjs`.
