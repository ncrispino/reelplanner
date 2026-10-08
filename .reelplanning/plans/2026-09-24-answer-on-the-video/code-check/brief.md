# Code check brief: 2026-09-24-answer-on-the-video

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-24-answer-on-the-video/code-check/findings.md`.

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
# Code check: 2026-09-24-answer-on-the-video

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

## Commits (f98a21d..e214c9364f7fe79fb1d4cb48bc7fecf6be0ae76a, limited to packages/player scripts/plan-map.mjs skills/plan-to-video templates/reelplanning/theme)

```
e214c93 snapshot: answer-on-the-video rework (not on any branch)
32a3efd Memory: reviewer and version on every review, memory lines, your memory across repos, misses stop, retro
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-24-answer-on-the-video/plan.md` in full. Its title is "Answer on the video itself, and edit the record in place", with 5 steps.

## The decisions that apply

- **D-004** (step 2) After a pick-all-that-apply answer, what does the video play? → **One summary frame**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-108** (step 2) Where do the answers the frame can't take go? → **i like the pricnicple of A, not messing w video, but we probably need it to be bigger. if we can design videos in a way where this bar is larger and more graceful in the video that might be best?**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
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
| m1 | 1 | The decision stub `reel stage` writes and the dataflow stage template carry `data-option="a"` beside `data-plan-option` | the skill's and style guide's sentence only | a frame started from them is right without anyone reading the sentence | scripts/reel.mjs, templates/reelplanning/theme/stages/dataflow.html |
| m2 | 1 | The player notes which rule matched a frame's cards (`_cardsBy`) | nothing | the spec checks that an older frame is matched by order | packages/player/reelplanning-player.js `frameCards` |
| m3 | 2 | In the frame, "Show the frame" folds the band to a pill in the corner of its empty eighth; under the video the band keeps one line | the band folding in place in the frame | folded, the frame is to be seen whole | packages/player/reelplanning-player.js `.stage>.decision.band.folded` |
| m4 | 2 | A video that asks nothing keeps no room under it | the room on every video | an empty eighth under a video with no question costs the frame for nothing | packages/player/reelplanning-player.js `placeBand` |
| m5 | 2 | The spec serves a video as "built after the band" by giving every frame's root `data-band="bottom"` under `/__band/`, rather than adding a tagged video to the repo | building a new tagged video | no video on the review page is tagged yet; this plan's frames already keep their lowest sixth for captions, so the tagged copy is honest | packages/player/test/answer-on-frame.spec.mjs |

## The diff

Read it yourself: `git diff f98a21d..e214c9364f7fe79fb1d4cb48bc7fecf6be0ae76a -- packages/player scripts/plan-map.mjs skills/plan-to-video templates/reelplanning/theme` (from the repository root). The files it touches:

```
packages/player/reelplanning-player.js         | 300 ++++++++++++++++++-------
 packages/player/test/answer-on-frame.spec.mjs  | 248 ++++++++++++++++----
 packages/player/test/controls.spec.mjs         |  11 +-
 packages/player/test/group.spec.mjs            |  14 +-
 packages/player/test/local-review.spec.mjs     |   8 +-
 packages/player/test/quiz.spec.mjs             |   8 +-
 packages/player/test/revisit.spec.mjs          |  14 +-
 scripts/plan-map.mjs                           |  12 +-
 skills/plan-to-video/SKILL.md                  |  11 +-
 skills/plan-to-video/references/style-guide.md |  15 +-
 templates/reelplanning/theme/frame.md          |   5 +
 11 files changed, 480 insertions(+), 166 deletions(-)
```
