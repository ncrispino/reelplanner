# Walkthrough: Details in the frame: click the thing a detail explains

**Status:** implemented on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (the approval folded
into step 2, `bedf28d`) · **Started from:** `1e5f6c1` · **Question 1:** a tab on the thing the whole time
(D-194) · **Question 2:** the page opens over the frame, grown from the thing (D-195, superseding D-021) ·
**Question 3:** the corner chip goes where a thing is marked, and stays on older videos and on things too
small to tap on a phone (D-196)

## What was done, per step

### Step 1 — The frame marks the thing a detail explains, and the checks hold it ✅

- **The mark** is `data-detail="<name>"` on the one thing the page explains, the storyboard's `- detail:`
  staying the source of which details a scene has. The skill's tag table and its Build-a-video step 3
  (`skills/plan-to-video/SKILL.md`), the style guide's §10 and its checklist (§11), and the theme's
  `frame.md` in both copies (a `detail-mark` component and a line under "Answering in the frame") say so,
  with the plan's three examples (deep-dives call A11's eight-line block, a row or line, the pinned word
  "said too early: a warning"). Every new storyboard carries `details_check: strict` beside
  `terms_check: strict`.
- **`frame-lint`** (`scripts/frame-lint.mjs`) fails a marked thing whose bottom reaches y 945, one under
  120 × 44 px (padding counted unless `border-box`), and one still moving in its scene's last 3 s, itself or
  a camera it sits in, or resting at a scale other than 1. It fails two things marked with one name (A2),
  and notes one that overlaps a `data-option` card. It measures from the frame's CSS, as its other geometry
  rules do; a mark whose size or place its CSS does not say is a note (A1). The measuring is
  `hboxOf` and `ownSize` in `scripts/lib/frame-html.mjs`, beside `boxOf`.
- **The details check** (`scripts/check-details.mjs`, run by `finish-project` and `verify`) reads each
  scene's frame (its `- src:`, else the frame file numbered as the scene), and fails a frame that marks a
  name its scene's tags do not give (a mark inside an HTML comment does not count). A scene whose detail
  (the last `- detail:`, the one that opens) is marked nowhere is a `!` warning, and a failure on a
  storyboard with `details_check: strict`. Every video in `.reelplanning/` passes as it is: the three with
  details only warn.
- **Fixed after the build, found by this plan's walkthrough video:** the details check read a mark from the
  frame's text with a pattern, so a real `frame-lint` run on screen whose output shows
  `data-detail="data-block-and-slots"` counted as a mark its scene did not give, and failed the build. It now
  reads the attribute on an element (`parseHtml`, `elements` from `scripts/lib/frame-html.mjs`), as
  `frame-lint` does: words in a frame's text or script mark nothing. One new check in
  `scripts/test/details.spec.mjs` (it fails on the old check).

### Step 2 — The player makes the marked thing a button ✅

- **Found as the cards are** (`detailMark` in `packages/player/reelplanning-player.js`): the scene's
  detail (`detailAt`), then `[data-detail="<name>"]` inside its own composition (`frameRoot`), its box
  through `boxesOf`, in percent of the picture.
- **The button** (`.dmark .dhit`) is a clear button over that box in the picture's own layer (`.zin`, as
  the cards' `.hits`), so it moves with the picture zoomed past Fit (D-182) and a mark tool that is on
  takes the frame. Coral ring under the pointer or keyboard focus, the cards' own (D-179). Its tab,
  "Open · <title>", sits on the thing's top edge the whole time the button is there (D-194), in ink as a
  card's tag; where that would pass the frame's top or cover the part's name card it goes inside the
  thing's top-left corner, and it never reaches the lowest eighth (`placeDetailTab`). Hovered a moment,
  the detail's why shows beside it in the cards' "More" box, placed by the same `placeMore`
  (`hoverDetail`).
- **When it is there:** from the moment the thing has landed (A3) to the end of its scene, again when
  paused there; while a question's box is up it hides (A5), so a click on the thing opens and answers
  nothing, and O is your own words (D-046); it comes back once the question closes. In plain words: while
  a question's cards are up, the thing behind them is not a button, so clicking it does nothing at all; answer
  first, and the thing opens its page again.
- **Keyboard:** after Play in the tab order (A4); Enter or O opens it.

### Step 3 — A click pauses the video and opens the page ✅

- **Over the frame (D-195, `packages/player/reelplanning-player.js`):** a click, Enter or O pauses and opens the page in the video's box, the panel
  moved into the stage (`homeDetailPanel`), grown out of the thing (a Web Animations transform from its box,
  none under reduced motion; `growDetail`). On close a ghost of the page shrinks back into the thing. Every
  way in opens over the frame (A6); the Terms and the band's long words keep the side panel; a phone keeps
  the page over the whole window.
- **The thing stays marked:** its button keeps an ink ring while its page is open (A8).
- **Closing goes back:** ×, Esc or O closes; the video plays on from where it paused if it was playing, and
  focus goes back to the thing's button (or the chip that opened it). In plain words: closing puts the video
  back as it was before the click. Playing when you clicked, it plays on; already paused, it stays paused,
  with focus on the thing you clicked.
- **The page keeps what it has:** comments inside it and a call's Accept and Flag in its footer are
  unchanged (the existing checks pass over the frame).
- **The record:** each opening in `watch.details` carries `from: "frame" | "chip" | "list"` beside its
  time open (A7); opening is still not a rewind (D-005).
- **The narration names the thing:** the style guide's `detail_why` rule gained the line (§10).

### Step 4 — The corner chip and the plan text's list; older videos and phones ✅

- **The chip is the fallback** (D-196, `syncDetailChip` in `packages/player/reelplanning-player.js`): it shows only where the scene's frame marks
  nothing (an older video, unchanged) or, on a narrow stage (`data-size="narrow"`), where the marked thing
  is under 44 px tall on screen. A scene that marks its thing has no chip at all, before the thing lands
  too (O still opens it).
- **The plan text's "Open:" row** stays as it was; it opens the page over the frame, logged `from: "list"`.

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | `frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding [close] | measuring each frame in a browser, or failing an unmeasured mark | frame-lint is the cheap static check run as each frame lands, as its camera and card rules are; failing every unsized span would fail most pinned words, and the player guards at run time (no button on a thing too small to tap on a phone) | `scripts/frame-lint.mjs`, `scripts/lib/frame-html.mjs` (`hboxOf`, `ownSize`), `scripts/test/visuals.spec.mjs` |
| A2 | 1 | Two things marked with one name in a frame fail `frame-lint` [close] | a note, or the player taking the first | the plan says one marked thing per detail, and the button goes over one box; a second would silently never open | `scripts/frame-lint.mjs`, `scripts/test/visuals.spec.mjs` |
| A3 | 2 | "Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip [visible, close] | the end of its reveal read from the scene's timeline, or the button from the scene's start | the page shows what is on screen whatever the timeline says (a fade, a camera, a later reveal), and a button over a thing still at 72 % would open a page about something not yet there | `detailMark` in `packages/player/reelplanning-player.js`; `packages/player/test/details.spec.mjs` ("before the thing lands") |
| A4 | 2 | The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`) [close] | moving the button after the controls in the page and placing it by script | in the picture's layer it moves with the zoomed picture as the cards' buttons do, with nothing to keep in step; the hop gives the order the plan asks for | `tabHop`; `packages/player/test/details.spec.mjs` (Tab / Shift+Tab) |
| A5 | 2 | The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes [visible] | only while the question is unanswered | while the box is up its cards carry the answer and their whys; one thing at a time on the frame | `syncDetailChip` (`!this._pendingDecision`); spec "answered, the button comes back" |
| A6 | 3 | Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel [visible, close] | over the frame only from the thing, the side panel from the chip and the list | one place for a page whichever way it was opened; D-195 supersedes D-021's side panel, and the Terms and the band's words are not details | `openDetail`, `homeDetailPanel`; spec "D-195: the page takes the video's box" |
| A7 | 3 | O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"` [close] | a fourth value for the key | the record says which way in reviewers use, and O is the key for whichever the scene shows; the plan names three values | `openDetailFrom`, `endDetail`; spec "logged from: frame" and "each says where it was opened from" |
| A8 | 3 | The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed [visible, close] | keeping the ring a few seconds after the page closes | the plan's ring was written for a page beside the frame; with the page over it, the grow, the shrink and the focus back on the thing say what the page was about | `.dhit[data-open]`; spec "while it is open, the thing keeps an ink ring" |
| A9 | own words | Each own-words field grows with its words to a cap and then scrolls inside the same box: 3 lines for the two note fields under an answer (the note on an answer, "Expected something else?"), 4 for the others (your own answer, a call's own words, the comment line, the record's editor); a note field is as wide as its placeholder, never its words [visible] | one cap for every field, or growing with no cap | the two note fields sit under an answer's cards, where more lines would push the cards and the controls; the owner asked to "keep same text box just be able to scroll it" | `fitField` in `packages/player/reelplanning-player.js`; `packages/player/test/own-answer.spec.mjs` (stays within its cap, scrolls inside) |
| A10 | own words | Enter still saves (or keeps a note) and Shift+Enter starts a new line; what is saved keeps its line breaks, runs of spaces folded to one and three or more breaks to two (`keepLines`), and the record's quick-check note no longer folds them away [visible, close] | Enter for a new line with a button to save, or every break folded to a space as before | Enter already saved every field, so a reviewer's habit stays; words in paragraphs say more, and a runaway paste stays readable | `keepLines` and the fields' `keydown` in `packages/player/reelplanning-player.js`; `packages/player/test/own-answer.spec.mjs` ("saved whole with its line break") |

## Also: own words wrap (the owner's ask, outside the plan's steps)

The owner, on the "Expected something else? Say how it should work" field: "need to fix the way this is
handled when we type text, it should probably wrap lines and keep same text box just be able to scroll it".
Every own-words field in the player was a one-line input sized to its words (the band's note fields took
their text's width, so 300 characters made the field about 1970 px wide and the page scrolled sideways).

- **Now each is a text box that wraps** (`packages/player/reelplanning-player.js`): the note on an answer,
  "Expected something else?", your own answer and a call's own words (`.own`), the comment line, and the
  record's own-words editor. Each grows with its words to a cap and then scrolls inside the same box
  (`fitField`, choice A9): 3 lines for the two note fields under an answer, 4 for the others. A note field is as wide as
  its placeholder, never its words, so nothing pushes the controls, the band or the cards past that cap.
- **Keys** (choice A10): Enter saves (or keeps, as before), Shift+Enter starts a new line, Esc as before. What is saved keeps
  its line breaks (`keepLines`: runs of spaces fold to one, three or more breaks to two); the record's
  quick-check note no longer folds them away.
- **Checked** in the band on a phone, in the frame's answer layer at 1440, zoomed to 200%, and in the sheet
  of an older video (screenshots before and after); `packages/player/test/own-answer.spec.mjs` types 300
  characters with a line break into the comment line, your own answer and "Expected something else?": each
  wraps, stays within its cap, scrolls inside, covers no button, and is saved whole with its line break.
  `packages/player/test/revisit.spec.mjs` reads the field as a text box now.

## Tests run

- `node scripts/test/run.mjs` over every player spec and every script spec (42): all pass after the fixes
  below. `packages/player/test/details.spec.mjs` 86 checks (32 new: the button, its tab and ring, the why on
  hover, the tab order, Enter / click / O, the page over the frame, the grow and the shrink, focus back,
  `from`, zoom, a mark tool, a question up, a phone); `scripts/test/visuals.spec.mjs` 36 (11 new, frame-lint's
  mark rules); `scripts/test/details.spec.mjs` 51 (7 new, the details check, one of them for the fix above); `packages/player/test/own-answer.spec.mjs`
  15 (7 new, own words wrap).
- Two existing checks asserted the side panel D-195 supersedes, and were changed to the page over the frame:
  `details.spec.mjs` ("the panel sits beside the stage") and `size.spec.mjs` §8 ("a detail open at 70%").
- `answer-on-frame.spec.mjs` ran its quicker pass unchanged (107 checks); its full pass was not run here.
- **End to end on a real video:** the deep-dives walkthrough, in a scratch copy (not rebuilt, so its records
  are untouched): scene 12 (call A11) marks its eight-line `table.html` block
  `data-detail="data-block-and-slots"`. `frame-lint` passes the frame, the details check stops warning on
  scene 12 (the other six details still warn: nothing marks them), and in the player the block carries
  "Open · The data block and the slots", rings coral on hover with its why beside it, a click grows the page
  over the frame (the video's box, 1049 × 590 at 1440 × 900) with the call's Accept and Flag in its footer, Esc
  brings focus back to the block, and the record logs `from: "frame"`; scene 9, unmarked, keeps its chip.

## Decisions in force

- **D-194** (this plan, question 1: a tab on the thing the whole time) held: the tab "Open · <title>" shows for
  as long as the button is there (`placeDetailTab`, `.dmark` in `packages/player/reelplanning-player.js`;
  `packages/player/test/details.spec.mjs`).
- **D-195** (this plan, question 2: the page opens over the frame, grown from the thing), superseding **D-021**
  (the side panel) held: `openDetail`, `homeDetailPanel`, `growDetail` in `packages/player/reelplanning-player.js`;
  the two checks that asserted the side panel now assert the page over the frame
  (`packages/player/test/details.spec.mjs`, `packages/player/test/size.spec.mjs` §8); the Terms and the band's
  long words keep the side panel (A6).
- **D-196** (this plan, question 3: the chip goes where a thing is marked) held: `syncDetailChip` in
  `packages/player/reelplanning-player.js`; `packages/player/test/details.spec.mjs` (an unmarked scene, a phone).
- **D-024** (a detail page starts from a template) held: untouched (`templates/details/` unchanged; this
  walkthrough's two pages were started with `reelplanning detail new`).
- **D-023** (a walkthrough's detail opens on what judges a choice fastest, not always code) held: untouched;
  this plan's walkthrough video opens a table of rules and, for choices A3 and A5 (when the button shows), the
  lines that decide it (`walkthrough-video/details/`).
- **D-143** (the frame's cards are answered through clear buttons the player lays over them) held: the
  detail's button is built the same way, from its box in percent of the picture (`detailMark`, `boxesOf` in
  `packages/player/reelplanning-player.js`).
- **D-179** (coral on the card under your pointer or focus) held: the marked thing's ring is that ring
  (`.dhit` in `packages/player/reelplanning-player.js`).
- **D-182**, **D-183** (zoom past Fit; a question asked while zoomed keeps the zoom) held: the button sits in
  the picture's layer (`.zin`) and moves with it (A4; `packages/player/test/details.spec.mjs`, zoom); the
  question's zoom is untouched.
- **D-172** (a pinned word is marked `data-gloss`) held: a pinned word's label can carry `data-detail` too
  (style guide §10, `skills/plan-to-video/references/style-guide.md`); `scripts/frame-lint.mjs`'s pinned-word
  note is unchanged.
- **D-166** (the brief picks which scenes show the real thing) held: the mark goes on the real thing where there
  is one (`skills/plan-to-video/SKILL.md`, Build a video step 3); no new brief line.
- **D-046**, **D-060** (the detail's key is O) held: O opens the scene's detail, from the frame or the chip;
  while a question is up O is your own words and the button hides (A5; `onKey`, `syncDetailChip` in
  `packages/player/reelplanning-player.js`).
- **D-052** (a comment inside a detail is a note with where it points) held: unchanged over the frame
  (`onDetailMessage` in `packages/player/reelplanning-player.js`; `packages/player/test/details.spec.mjs`).
- **D-005** (rewinds and slow-downs are sent) held: opening a page is still not a rewind; each opening now
  carries `from` (A7, `endDetail` in `packages/player/reelplanning-player.js`).
- **D-004** (a pick-all answer plays one summary frame) held: untouched (`packages/player/reelplanning-player.js`).
- **D-127** (plain words on screen) held: the tab says "Open", and the style guide says scene and choice
  (`skills/plan-to-video/references/style-guide.md` §10).
- **D-142**, **D-167** (the darker coral; today's look) held: the ring and the tab use the player's own tokens,
  no new colour (`.dhit`, `.dmark` in `packages/player/reelplanning-player.js`).
- **D-083** (a quick check per step) held: this walkthrough's video asks one per step, each after the next
  step's scenes (`walkthrough-video/STORYBOARD.md`).
- **D-085** (less scaffolding) held: one attribute and one front-matter line (`details_check: strict`), no new
  build stage (`skills/plan-to-video/SKILL.md`, `scripts/check-details.mjs`).
- **D-129** (approving is never blocked) held: untouched (`packages/player/reelplanning-player.js`).
- **D-084**, **D-109** (what stops the walkthrough video) held: `scripts/lib/autonomy.mjs` unchanged.
- **D-110** (a step's fifth choice is asked first) held: no step reached five (`walkthrough.md`, this table).
- **D-064**, **D-066**, **D-082** (the loop's background agent, one setting, auto mode in the sandbox) held:
  untouched (`scripts/review.mjs`, `scripts/lib/sandbox.mjs` unchanged).
- **D-106**, **D-107** (your memory's file and the retro) held: `scripts/lib/memory.mjs` unchanged.
- **D-169**, **D-171** (the case study's order; the merge rule for decision numbers) held: untouched
  (`scripts/case-study.mjs`, `scripts/reel.mjs` unchanged by this plan).

## Code check

A fresh agent (`claude -p`, with only the brief's prompt, and write access to `code-check/findings.md` alone)
checked `1e5f6c1..HEAD` over this plan's paths (`packages/player`, `scripts/frame-lint.mjs`,
`scripts/check-details.mjs`, `scripts/lib/frame-html.mjs`, their specs, `skills/plan-to-video`, both
`theme/frame.md`): **steps 4 of 4 ✓, decisions 24 of 24 ✓, unexplained 2 ✗** (`code-check/findings.md`).

- **✗ `packages/player/reelplanning-player.js`, own words become wrapping text boxes** (`fitField`,
  `keepLines`, `6d9c869`): the owner's ask, reported under "Also" above but with no row for the calls it made.
  Now two rows: **A9** (each field grows to a cap, 3 lines under an answer and 4 elsewhere, then scrolls inside)
  and **A10** (Enter saves, Shift+Enter a new line, line breaks kept). No code change.
- **✗ `packages/player/test/answer-on-frame.spec.mjs`, the full pass in four shards** (`a705562`): not this
  plan's. It is its own commit ("answer-on-frame's full pass runs as 4 shards side by side"), landed between
  this plan's approval and its build, and the `packages/player` path swept it into the range. No row.

## Not done

- **Only this plan's walkthrough video marks its things:** its scene 3 marks the real `frame-lint` run
  (`mark-rules`, a table of every rule a mark is held to) and scene 5 the review page's button
  (`when-the-button-shows`, the code for choices A3 and A5); `details_check: strict`, and the review page shows
  each thing's button and tab, opens the page over the frame, and no chip. Every other video gets its marks
  when it is next rebuilt (the plan's "Not in this plan").
- **The system video's words were behind** until this walkthrough was accepted: `glossary.md` said a detail
  opens "beside the paused video" and the side panel is "where a detail opens". Updated after the review
  (below).

## After the walkthrough review

Reviewed 2026-09-27 (`reviews/walkthrough-20260927T042331Z.md`), approved with no new walkthrough video: all
ten choices accepted (A1 to A10, in the ledger), and two of three quick checks missed. No code change: both
answers are how the player already behaves, and the owner accepted A5 and step 3's rows as they are.

- **Step 2's quick check** ("A stop scene's choice cards are up, and the diff they are about is marked behind
  them. You click the diff. What happens?", answered "Its page opens over the frame"; the answer is "Nothing
  happens"): while any question's cards are up, the marked thing is not a button (A5), so the click lands on
  nothing. Step 2's entry now says it in plain words. **Would a reviewer expect otherwise? Yes, reasonably:**
  the page explains the very thing the question asks about, so the moment you are deciding is when you would
  want to open it, and the only way to it is to answer first. Not changed (A5 is accepted); a later plan could
  let the thing open its page during a question, the cards coming back when it closes.
- **Step 3's quick check** ("The video is paused at 1:05 when you click a marked table. Its page opens, and you
  press Esc. What happens?", answered "The video plays on from 1:05"; the answer is "It stays paused; focus on
  the table"): closing puts the video back as it was before the click, so a video you had paused stays
  paused. Step 3's entry now says it in plain words. **Would a reviewer expect otherwise? Not enough to
  change it:** playing on after Esc would start a video you had stopped yourself, which no player does on
  closing a page; the miss reads as step 3 saying "plays on" without "only if it was playing".
- **The system video caught up** (D-003): `glossary.md` and `spec.md` say a detail opens over the paused
  frame, grown from the thing it explains, the Open chip is the way in where nothing is marked, and the side
  panel is where the Terms and the band's long words open. Two system-video scenes rebuilt, their frame ids
  kept: 11 (`21-beside`) now shows this plan's own walkthrough in today's player, its `frame-lint` run marked
  with "Open · Every rule a mark is held to", then that page grown over the paused frame, then an older video's
  Open chip; 10 (`20-before`) now says and pins the side panel, where the Terms open. `spec-diff` also named
  scenes 5–8, 12, 14 and 29, which share spec.md's Parts section but say nothing about details; they are
  unchanged. Built with `reelplanning build`, every stage passing; 7:45 → 7:53. The nine videos that lean on
  the system video (`before: system…`) had their `prerequisites` refreshed to its new chapter times.

