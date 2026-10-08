# Walkthrough: Answer on the video itself, and edit the record in place

**Status:** implemented on branch `claude/clever-knuth-b5gtcf`, not committed · **Plan:** `plan.md` (revised at f98a21d after the owner's review, `reviews/plan-20260924T192050Z.md`) · **Started from:** `823df31`; the rework from `f98a21d` · **Question 1:** answered in the owner's own words (D-108: the principle of A, but bigger, and videos designed for it) · **Question 2:** B, a band in room new videos leave for it, and under the video for older ones (the recommendation, built at the owner's word to "update the walkthrough once the code is updated"; it goes on the record when this walkthrough is reviewed)

Built in three sittings: a first worker made most of the player change and the first two calls below
(A1, A2) before its container restarted; the second checked that work on the real videos, finished the
strip, the record's edits and the specs, and logged the rest. Then the owner reviewed the plan video and
asked for step 2 to be redone (the strip was too small to read, and the video shrank while it was up)
and for step 5; the third sitting built both, extended step 4's spec, and logged calls A13–A22 and m3–m5.
Rows the rework changed say so (**changed after review**). With them the table is past two dozen rows,
well over the dozen at which the plan left too much open: most of the new ones are how the band looks and
where it goes, which question 2 settles only in outline, and how step 5's three rules meet the player's
existing revisit rules.

## What was done, per step

### Step 1 — Click an option on the frame to answer ✅

While a question or quick check waits, the player finds the frame's option cards in the frame's own page
(it already read that page to mark a chosen option, `applyDecisionToStage`) and lays one transparent
button over each (A1), in `packages/player/reelplanning-player.js` (`frameCards`, `renderHits`,
`syncHits`, `answerOnFrame`, `recheckCards`, the `.hits` / `.hit` CSS). Hover and keyboard focus ring the
card in coral; a click is the key for its letter: it answers a choice or a quick check, and on a pick-all
question it ticks the card and waits for Confirm, which then plays the one summary frame (D-004,
unchanged: `confirmMulti`). The A–D keys work as before (`onKey`). Cards are matched by `data-option`,
then by letters older frames already carry, and only then by order (A2); a frame where no rule finds a
card for every option keeps today's sheet. A matched card shows its state (A6). Quick checks are answered
on the frame the same way (D-083). While a mark tool is on, or the question is put aside, the cards take
no clicks (A11).

New frames mark their cards: one sentence each in `skills/plan-to-video/SKILL.md` (Build a video, step 3)
and `skills/plan-to-video/references/style-guide.md` (the decision beat): `data-option="a"` on each option
card, also in a quick check. One attribute, nothing more (D-085); the frame scaffolds carry it too (m1).

Checked once on every video with a question: all 31 question frames in `.reelplanning/`'s videos and the
12 in `videos/` are matched (by `data-option`, `data-plan-option` or an id), none by order alone; the plan's own quick check k2 ("older frames are matched by order") is checked on
the revise-loop video's second choice with its letters taken off (`answer-on-frame.spec.mjs`).

### Step 2 — A band, not a sheet: large enough to read, and the video never resizes ✅ (redone after review)

**First version (question 1, A):** the question moved under the stage as one thin strip (13 px type,
link-like buttons), and the stage gave it its height while it was up, so the video shrank by the strip and
grew back after (A5). The owner's review found it too small to read and the resize unwanted (D-108).

**Redone (question 2, B).** Where the frame's cards take the answer, or on a call, the same element
(`.decision`) becomes a **band** an eighth of the video high (`placeCard`, `homeBand`, `placeBand`,
`detectBand`, `syncBand`, the `.decision.band` CSS in `packages/player/reelplanning-player.js`). It holds, on
two lines: the kicker and the question in its own words (one line, in the serif, the whole question on
hover; after an answer the feedback takes its place), and "Show the frame"; then the hint and the acts:
"Answer in my own words", "Explain this more", a note, Confirm for a pick-all question, a quick check's
"Back to where this was explained" and Continue, and a call's Accept and Flag with A and B (a group: Accept
all and a Flag per call). Type is at reading size and scales with the video: the question 15–22 px, the
buttons clear boxes 30–40 px high (A15).

- **In the frame**, when the video leaves its lowest eighth for it: every frame that asks something carries
  `data-band="bottom"` on its root (or the video's root does), found once the frames are mounted (A13). The
  band then sits over that empty eighth, in the frame's paper with one hairline rule, and the captions step
  aside while it is up (A16). "Show the frame" folds it to a pill in that eighth's corner (m3).
- **Under the video**, for every video built before this (all of those on the review page today): a room an
  eighth of the video's height (never under 72 px) is kept under the frame for the whole video, empty until
  a question waits (`.bandroom`), and the stage's height formula leaves exactly that room (`--band-k`,
  `--band-min`), so the page still fits the window (A14). A video that asks nothing keeps no room (m4).
- **On a phone** the band is under the frame for both kinds, in the page's flow; it grows by a line when
  its acts need one, and the frame, 100% wide there, does not change (A14).
- **Either way the video never changes size** when a question opens or closes: the resize A5 introduced is
  gone (`syncStrip` and `--strip` removed). A frame with no card for every option keeps today's sheet over
  the frame (D-001), which does not resize it either.

New videos reserve the room: `skills/plan-to-video/references/style-guide.md` (§6 the decision beat, §7
quick checks), the theme's frame spec `templates/reelplanning/theme/frame.md` ("The answer band", beside the
safe area) and one clause in `skills/plan-to-video/SKILL.md` (the option-card sentence, Build a video step
3) ask every frame's root for `data-band="bottom"` and its lowest eighth left empty. That eighth is already
inside the caption band frames keep clear, so the ask is one attribute. The stub `reel stage` writes has no
frame root, so `scripts/reel.mjs` was not touched. Checked in light, dark and at 390 px, in both places
(`answer-on-frame.spec.mjs` §1–§4, §7).

### Step 3 — Edit the record where it is listed ✅

In the record (`renderDecisions`, `renderAutonomy`, `renderList`):

- **A choice's answer**: "change" no longer sends you into the video. It opens the question's options
  under the answer, the given one pressed; a pick saves it, a pick-all's ticks save together, own words
  save on Enter (A7, `answerEditor`, `editAnswer`, `changeAnswer`). The record is written as a fresh
  answer would be, note kept, so the video plays that answer's path when it gets there, and met again the
  card of the new answer is the one marked. Own words replaced drop the comment they made (A8).
- **A call's verdict**: "accept instead" / "flag instead" beside it, both ways (A9, `changeVerdict`); the
  flag's note on the step comes and goes with it, as it does on the video (`recordVerdict`).
- **A mark's words**: already an editable line in the mark's row before this plan (the row's text box is
  the mark's `comment`), which the plan did not know; the row now says so ("Words for this mark"), and an
  edit there is sent like any other.
- **A quick check's note**: also already editable under its answer; an edit now also announces itself
  (the `quiz` event) and counts as a change to send.
- Comments' words and removing a comment or a mark: unchanged.
- **After a send**, any of these edits (and a comment's words, which did not count before) is offered as
  "Send the change": at the head of the record and in the Finish panel, as a new comment already was
  (A10, `syncResend`, `postedBlock`). Changing an answer in place seeks nothing, so it is never counted as
  a rewind (D-005, `noteRewind` untouched); a quick check's first answer still stands.

### Step 4 — Check it on the videos already there ✅ (one deviation)

`packages/player/test/answer-on-frame.spec.mjs` (added to `npm test`) plays into every question of four
videos and answers each with clicks only: this plan's video (light, 1440 px; 5 quick checks and the
choice), the revise-loop plan video (dark; 4 choices, one on its older frame matched by order, and a
quick check), the revise-loop walkthrough (light; all 37 calls, the 2 grouped beats and 7 quick checks,
then a call and a group again at 390 px) and the system video (390 px, dark; its 5 quick checks, tapped).
It checks the strip on every stop (under the frame, thin, the question not repeated, paper and coral),
hover and focus on a card, a pick-all ticked by clicks and confirmed, the keys still answering, and the
sheet kept where the frame has no card for every option. Then the record: on this plan's video it sends a
review from the Finish panel, changes the choice's answer, a quick check's note, a comment's words and a
mark's words, removes a comment, and checks the review "Send the change" sends; on the walkthrough it
switches two verdicts and reads the export. "Plays just the changes" (D-081) is switched off by a click
on the walkthrough, which is a rebuilt video, so every question is met.

**Extended after the review.** Every question met in the spec is measured before it (after the seek, before
Play), while it waits, after an answer, and after it closes: the stage's width and height must not change,
and one size must hold for the whole video (`playThrough`). The band's contract is checked on each (`checkBand`):
where it is (in the frame's lowest eighth with the captions hidden, or under the frame in its kept room, an
eighth of the video high, or in the flow on a phone), the question's own words in the serif at 15 px or
more, clear buttons (a 1 px border, 30 px or taller), everything fitting without a scroll, the options not
repeated, Show the frame and, on a quick check, Back to where this was explained. The in-frame placement
is played through on this plan's video served as one built after the band (§7: every frame root given
`data-band="bottom"`, dark, 1440×900; and at 390 px, where it goes under). §8 checks the 10 s wait, the
pointer and the keyboard holding it, Continue at once, and "Back to where this was explained" from the band
(to the first beat of its step) and from the record (to the beat `explained_at` names, through a plan map
fixture); §9 an unanswered question stopping the video again after a seek past it, after Play past it and
after folding (back and forth); §0 `plan-map` lifting `explained_at`.

**Deviation (D1):** the plan says every video on the review page; the spec plays the four named above.

Existing specs that asserted the old sheet now assert the band or the record's editor (after the review:
`controls.spec.mjs` checks the band an eighth high and the frame as tall as before; `group.spec.mjs` the band
with the group's words; `quiz.spec.mjs` and `revisit.spec.mjs` the 10 s wait and "Continues in 10 s", the
pointer moved off the band where they wait on the count). Before the review:
`controls.spec.mjs` (the question is a strip under the frame; folded it stays there),
`group.spec.mjs` (Accept all and a Flag per call in the strip), `revisit.spec.mjs` (the choice met
again is changed on its card), `review-keys.spec.mjs` and `unclear.spec.mjs` ("change" edits in the
record instead of reopening the question).

**Tests, after the review:** the whole `npm test` passes in the working tree (1480 checks, exit 0, about 25
minutes), `sound.spec.mjs` included this time; `answer-on-frame.spec.mjs` alone is 669 checks (about 6 minutes).

**Tests, first version:** the whole `npm test` list was run on a snapshot of this change in a clean worktree
(other workers' uncommitted edits to the system video's sources left out): every spec passes, 680 checks
up to `sound.spec.mjs`, then `revisit` (31), `group` (19) and `answer-on-frame` (394, about 4 minutes),
except `sound.spec.mjs`, which fails the same way at `823df31` (the narration not yet audible 2 s after
Play, headless; 3 of 3 runs at the start commit, 2 of 3 with this change). In the working tree itself,
`system-review.spec.mjs` fails on the system video's storyboard, which another worker is editing; it
passes at `823df31` and on this change's snapshot. The updated specs (`controls`, `review-keys`,
`unclear`, `revisit`, `group`) pass in both.

**Not done:** the walkthrough video (not rebuilt; the beats the rework changes are listed under Step 4's
tests below); a hosted page's second send (A10); clicking a walkthrough's grouped frame's own drawn Flag
buttons (a call has no cards, per the plan); no video on the review page is built with `data-band="bottom"`
yet, so the in-frame band is checked on a tagged copy of this plan's video (m5); the repo's own
`.reelplanning/theme/frame.md` (this project's copy of the theme) is not updated, only the template new
projects start from.

**Outside this plan, in the same files:** at the coordinator's request, the Finish panel's line for
`GET /api/review` now reads `unsandboxed` (renamed from `unattendedOff` in 41fcd7e: the run goes ahead
without Claude Code's sandbox, and the line says so) in `localNext`, `packages/player/reelplanning-player.js`,
with `packages/player/test/local-review.spec.mjs` updated to match.

### Step 5 — Questions keep pace with you ✅ (new after review)

- **A quick check waits longer.** Answered just now, it goes on by itself after 10 s, not 4 (`startWait`,
  `_freshAnswer`); a question met again already answered keeps 4 s (A17). The count waits, and starts again
  from the top, while the pointer is over the band or the keyboard is on one of its controls other than
  Continue, which the player itself focuses after an answer (`bandHeld`, A18); the hint says "Waits while
  you are here". Continue (space, Enter) still goes at once.
- **"Back to where this was explained."** Every quick check has it: a button in the band (and in the sheet),
  and a link on its row in the record (`backToExplained`, `explainedAt`; `data-back`). It plays from the
  beat the storyboard names with `- explained_at: <frame number or composition id>`, which `scripts/plan-map.mjs`
  lifts into the plan map as `explainedAt` (the frame's start) and `explainedFrame`; else from the first beat
  of the check's `plan_step`; else from the start of its part (A19). Reached again, the question waits there,
  answered or not, with no count (A21). The trip back is sent as a rewind (D-005, A20).
- **An unanswered question stops again.** An open question that the video leaves while playing (Play pressed
  with it up, or a seek away and then Play) gives way, and stops the video again whenever the playhead reaches
  it, until it is answered (`tickDecisions`, A22). A seek while paused still leaves it up with the frame
  moving under it, as `review-keys.spec.mjs` expects; a folded question keeps D-001's contract (reaching or
  passing its moment brings it back), which already stopped the video every time. The rule that a question
  asked once and left unanswered is never asked again (`_askedOnce` in `tickDecisions`) is gone. What was
  checked and kept: `_past` (met once per pass, cleared when the playhead goes back before it), `meet()`,
  `route()` (routing past an unchosen branch or a beat outside the level marks its questions as passed, so it
  pops none) and `passedOver` (just the changes: a question at the edge of a skipped beat is held back only
  outside its own beat). Answered questions still come back answered and go on by themselves.

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 1 | The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player [close] | listeners and a hover style injected into the frame's own document | the frame's document is rebuilt by the runtime (a theme switch, a reload) and sits under the HyperFrames player's own click handling; the player's buttons are tabbable, keep the keyboard in the player, and need nothing from the frame but its boxes | packages/player/reelplanning-player.js `frameCards`, `renderHits`, `.hits` CSS |
| A2 | 1 | Cards are matched by `data-option`, then by `data-plan-option` (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending `-opt-a` / `-option-a` / `-choice-a` / `-chip-a`, and only then by the order of the elements whose class ends in `-opt`; a rule counts only when it finds exactly one card per option, each with a box [close] | `data-option` then the order of `-opt` elements only | a survey of every question frame on the review page: order alone matched none of the quick checks in the walkthroughs or the system video, and a letter already written on the card is safer than counting; a frame where no rule finds every option keeps the sheet | packages/player/reelplanning-player.js `frameCards` |
| A3 | 2 | A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (**changed after review:** the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons) [visible, close] | keeping the sheet for calls, or listing those facts in the strip | the plan puts a call's Accept and Flag in the strip; every walkthrough frame for a call already draws what it chose, what it replaced and where to check | packages/player/reelplanning-player.js `openCard` (`kind === "call"`), `askAutonomy` (`about`) |
| A4 | 2 | A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (**changed after review:** in the band, with "N more calls from this part." as its line of words) [visible] | the sheet's list of the calls with a Flag on each row | the grouped frame lists the calls; the list over it is what step 2 removes | packages/player/reelplanning-player.js `groupOpts`, `flagInGroup` |
| A5 | 2 | While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (**changed after review:** removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size) [visible, close] | keeping the frame's size and letting the page scroll under the strip | the page's rule is the biggest frame that fits the window with its chrome; a strip pushing the timeline and Finish below the window breaks it | packages/player/reelplanning-player.js `syncStrip`, `--strip` in `.wrap` CSS |
| A6 | 1 | A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it [visible] | no state on the frame, only words in the strip | the reviewer answered on the card, so the answer is marked there; reading the sheet's buttons (a MutationObserver) keeps both in step with one source | packages/player/reelplanning-player.js `syncHits`, `.hit[data-chosen]`, `.hit[data-right]` CSS |
| A7 | 3 | "change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question [visible] | a select, or reopening the question on the video as before | the options are what the question offered, and the record is written as a fresh answer would be, so the video routes by it; asking for more is the question's own act | packages/player/reelplanning-player.js `answerEditor`, `changeAnswer`, `.redit` CSS |
| A8 | 3 | An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one [close] | leaving the old comment, or rewording it in place | the answer and that comment are the same words; left behind, the export would carry two different answers to one question | packages/player/reelplanning-player.js `changeAnswer` |
| A9 | 3 | A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes [close] | a toggle, or reopening the call on the video | one click makes the same record the strip makes (`recordVerdict`), so the flag's note on its step is added or removed with it | packages/player/reelplanning-player.js `renderAutonomy` (`data-reverdict`), `changeVerdict` |
| A10 | 3 | After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only [visible] | the Finish panel only; or the hosted page too | edits are made in the record, so the offer is where they are made; a hosted page has no second send today (a new comment is not offered there either), and adding one is a change to what the hosted store receives | packages/player/reelplanning-player.js `syncResend`, `.resend` |
| A11 | 1 | "Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (**changed after review:** under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3) [close] | dropping "Show the frame" (the frame is no longer covered), or cards that answer while drawing | the plan lists it; without it a reviewer who wants to draw on a question's frame would answer it by accident | packages/player/reelplanning-player.js `fold`, `placeCard`, `.stage:not([data-tool=""]) .hits` CSS |
| A12 | 2 | On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (**changed after review:** the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high) [visible] | the desktop wording ("Click a card, or press A, B or C.") | there are no keys to press on a phone | packages/player/reelplanning-player.js `openCard` (`touch`), the phone CSS |
| A13 | 2 | A video leaves its lowest eighth for the band by `data-band="bottom"` on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video [visible, close] | a field in the storyboard's front matter lifted into the plan map, or a place decided per question | the attribute is on what actually leaves the room, so a frame built without it cannot claim it; a video mixing places would still have to keep the room under it for its older frames, so it is one place per video | packages/player/reelplanning-player.js `detectBand`, `placeBand` |
| A14 | 2 | The band is an eighth of the video high, never under 72 px. Under the video its room (`.bandroom`) is kept for the whole video and the stage's height formula leaves exactly it (`--band-k` 8/9, `--band-min` 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed [visible, close] | a band that grows with what it holds, or a fixed pixel height | growing would move the transport under it, and a fixed height would be too small on a large screen or too large on a small one; on a phone the frame is the page's width, so a growing band still never resizes it | packages/player/reelplanning-player.js `.bandroom`, `--band-k`, the phone block |
| A15 | 2 | The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (`cqw`): the question 15–22 px, buttons 30–40 px [visible] | the question in full, wrapping; or the strip's one line | an eighth of the video holds two lines of reading-size type; the frame shows the question in full already, so the band's line says which question waits | packages/player/reelplanning-player.js the `.decision.band` CSS |
| A16 | 2 | In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes [visible, close] | leaving the captions | the caption pill sits at y 880–1040, so the band (from y 945) would leave its top edge showing above it; while a question waits the band carries the words | packages/player/reelplanning-player.js `syncBand` |
| A17 | 5 | The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s [visible, close] | 10 s for every answered question met again | the owner's words were about reading a quick check's explanation after answering; a rewatch past a run of answered questions would otherwise stop 10 s at each | packages/player/reelplanning-player.js `startWait`, `_freshAnswer` |
| A18 | 5 | "On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer [close] | Continue counting too; or pausing and resuming the count where it was | the player puts the keyboard on Continue after every answer, so counting it would mean it never goes on; a sheet is answered by clicking on it, so the pointer is always there | packages/player/reelplanning-player.js `bandHeld`, `startWait` |
| A19 | 5 | "Back to where this was explained": `explained_at` is a frame number or a composition id, lifted into the plan map as that frame's start (`explainedAt`, `explainedFrame`; one naming no frame warns and is left out). Without it: the first beat of the check's `plan_step` before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there [close] | a time in seconds in the storyboard; landing paused | a frame survives a retime and a time does not; the reviewer asked for the rewind to be automatic, so it plays | scripts/plan-map.mjs `explainedFrame`; packages/player/reelplanning-player.js `explainedAt`, `backToExplained`, `renderDecisions` (`data-back`) |
| A20 | 5 | The trip back is sent as a rewind (D-005) [close] | not counting it | it is one, and the review's "rewound here" is the same signal: something there wanted saying more plainly | packages/player/reelplanning-player.js `backToExplained` (`noteRewind`) |
| A21 | 5 | Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark [visible] | the usual 4 s for an answered one | the reviewer went back to look at it again; it should be there when they arrive | packages/player/reelplanning-player.js `meet` (`_waitFor`) |
| A22 | 5 | An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped [close] | closing it on any seek, or Play doing nothing while a question waits | `review-keys.spec.mjs` keeps the question up under ← and →, so a reviewer can look back before answering; Play is the reviewer choosing to go on without answering, and the question then comes back where it belongs | packages/player/reelplanning-player.js `tickDecisions` |
| D1 | 4 | The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec [deviation] | every video on the review page in the spec | the four are the kinds there are (plan, walkthrough with calls and groups, system); each more video adds about a minute to `npm test`, and the matching they would test is the same code | packages/player/test/answer-on-frame.spec.mjs |

### Smaller calls (logged, not beaten in the video)

| # | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| m1 | 1 | The decision stub `reel stage` writes and the dataflow stage template carry `data-option="a"` beside `data-plan-option` | the skill's and style guide's sentence only | a frame started from them is right without anyone reading the sentence | scripts/reel.mjs, templates/reelplanning/theme/stages/dataflow.html |
| m2 | 1 | The player notes which rule matched a frame's cards (`_cardsBy`) | nothing | the spec checks that an older frame is matched by order | packages/player/reelplanning-player.js `frameCards` |
| m3 | 2 | In the frame, "Show the frame" folds the band to a pill in the corner of its empty eighth; under the video the band keeps one line | the band folding in place in the frame | folded, the frame is to be seen whole | packages/player/reelplanning-player.js `.stage>.decision.band.folded` |
| m4 | 2 | A video that asks nothing keeps no room under it | the room on every video | an empty eighth under a video with no question costs the frame for nothing | packages/player/reelplanning-player.js `placeBand` |
| m5 | 2 | The spec serves a video as "built after the band" by giving every frame's root `data-band="bottom"` under `/__band/`, rather than adding a tagged video to the repo | building a new tagged video | no video on the review page is tagged yet; this plan's frames already keep their lowest sixth for captions, so the tagged copy is honest | packages/player/test/answer-on-frame.spec.mjs |

## Decisions in force

- **D-004** held: a pick-all card only ticks; Confirm plays the one summary frame (`confirmMulti`, `packages/player/reelplanning-player.js`).
- **D-021** held: a detail still opens in the side panel; the cards' layer sits under its chip (`.hits` z-index, `packages/player/reelplanning-player.js`).
- **D-081** held: "Play just the changes" is still on by default after a rebuild (`initOnly`, `packages/player/reelplanning-player.js`); the spec turns it off by a click.
- **D-005** held: rewinds and slow-downs are still sent; a change in the record seeks nothing, so it adds none (`review-keys.spec.mjs` counts them). "Back to where this was explained" is a trip back, and is sent as one (A20, `backToExplained`, `packages/player/reelplanning-player.js`).
- **D-024** held: detail templates are untouched (`templates/details/`).
- **D-082** held: nothing here changes the headless run (`scripts/`, untouched apart from `scripts/reel.mjs`'s stub in the first version and `scripts/plan-map.mjs`'s `explained_at` in the rework).
- **D-083** held and extended: quick checks are answered on the frame (`answerOnFrame`, `packages/player/reelplanning-player.js`); after the review each waits 10 s once answered and can take the reviewer back to where it was explained (`startWait`, `backToExplained`).
- **D-084** held: a call that stops has its Accept and Flag in the band (the strip, before the review) (`askAutonomy`, `packages/player/reelplanning-player.js`).
- **D-085** held: step 1 asks new frames for one attribute, `data-option` (`skills/plan-to-video/SKILL.md`). Step 2's band adds one more, on the frame's root, `data-band="bottom"`, which the revised plan's question 2 (B) asks for in so many words ("the style guide and the frame template say so"); nothing else is asked of a frame (`skills/plan-to-video/references/style-guide.md` §6, `templates/reelplanning/theme/frame.md`).
- **D-108** held: question 1 answered in the owner's words, the principle of A (not over the video), but bigger, with videos designed for it. The band is at reading size, never over a frame's content: under the video, or in the eighth a new frame leaves empty for it (`placeBand`, `.decision.band` CSS, `packages/player/reelplanning-player.js`).
- **Question 2** built with its recommendation, B (in room new videos leave, A for older ones and on a phone), at the owner's word; it goes on the record when this walkthrough is reviewed (`detectBand`, `packages/player/reelplanning-player.js`).
- **D-106**, **D-107** (memory's home file, the retro's timing) held: untouched here; the memory plan's files (`scripts/lib/memory.mjs`, `scripts/reel.mjs`, `scripts/lib/reviews.mjs`) are another worker's and this change does not edit them.

## Code check

**After the review (this rework).** A fresh headless agent (`claude -p` with exactly the `code-check --prompt`
text, read-only tools: Read, Grep, Glob) read `code-check/brief.md`; it had no tool to write `findings.md`,
so it returned the findings as text, saved as is in `code-check/findings.md`. The change is not committed, so
the brief was made against a snapshot commit of the working tree's own files (`e214c93`, made with a scratch
index, on no branch): `code-check --base f98a21d --head e214c93 -- packages/player scripts/plan-map.mjs
skills/plan-to-video templates/reelplanning/theme`. The scope leaves out the memory plan's commits that landed
on the branch meanwhile; `skills/plan-to-video/SKILL.md` still carries that plan's one sentence in this range.

**Steps 5 ✓ / 0 ✗, Decisions 11 ✓ / 0 ✗, Unexplained 0 ✗.** No ✗ to answer. Notes on its ✓ lines: Step 4
names the narrowing to four videos, which is D1; its D-085 line counts two attributes a new frame now carries,
`data-option` and `data-band`, which the Decisions in force above say; and it looked at the Finish panel's
`unsandboxed` line and left it out, since this walkthrough says it is outside the plan. After the snapshot, one
CSS fix landed (the band shows a call's "Your words become an instruction" beside the own-words box, which
`parts-copy.spec.mjs` asks for, and hides "Answer in my own words" while the box is open); it changes nothing
the findings rest on.

**Before the review (first version).** Against `823df31..bda7a87`: Steps 4 ✓ / 0 ✗, Decisions 8 ✓ / 0 ✗,
Unexplained 0 ✗; that run's findings are in git at 2918435.
