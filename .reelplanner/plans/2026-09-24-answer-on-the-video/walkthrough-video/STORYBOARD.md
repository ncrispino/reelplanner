---
title: "Answer on the video itself: what was built, second version"
format: 1920x1080
duration: 300s
message: "The answer-on-the-video plan as built after its review (commit 59c479f): question 1 is on the record in the owner's words (D-108), and question 2 was built as B, the band inside the frame in the lowest eighth new videos leave empty; all five steps landed; twenty-two calls the plan did not make and one deviation, all twenty-three stopping for accept or flag; four quick checks; the whole test suite passes and a fresh agent's code check found nothing to answer"
arc: walkthrough with autonomy beats, in four parts: the answers and step 1; step 2, the band; step 5, questions keep pace; steps 3 and 4, the record and the check
audience: the repo owner who reviewed the plan video and asked for step 2 to be redone and for step 5, deciding whether to accept what was built, including someone new to the repo
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-24-answer-on-the-video
---

## Video direction

- A WALKTHROUGH (style guide §8), the second version: rebuilt for what is built now (commit 59c479f), not the first version with beats added. The owner never reviewed the first walkthrough; they reviewed the plan video, asked for changes, and said "we will just update walkthrough once code is updated accordingly".
- SHORT (style guide §1, "Length"): aim five minutes. `reel stops` makes all twenty-three calls stop (every tag's accepted streak is 0; D1 is a deviation), so each call is one beat of one or two sentences: what it chose, instead of what. The why and where to check are in the band (the call's tags) and, for steps 2 and 5, in a detail (§10). One beat per step. No closers: each part's opener shows the rail as resolved so far.
- SAID FIRST (frames 1–2): question 2's answer (B, the band inside the frame, from the owner's words on question 1, D-108), question 1's status, what landed, and the call count: twenty-two, well past the dozen at which the skill says the plan left too much open.
- THE FIRST VIDEO BUILT FOR THE BAND: every frame's root carries `data-band="bottom"` and keeps its lowest eighth (y ≥ 945) empty, so the player lays its band inside the frame. Nothing in any frame sits below y 900 but the captions.
- THE REAL THING: the change is visual, so beats about the player show Playwright captures of the review page (`packages/player/index.html?project=<video-dir>`), in light and dark; the frame shows the one matching the video's theme. The band captures are of THIS video in the player (its own call A1 and quick check k1); `under` is this plan's first video, built before the band; `group` is the revise-loop walkthrough's grouped beat; the record captures are kept from the first version (step 3 did not change).
- A SERIES OF FOUR PARTS: `chapter_start` on frames 1, 9, 20 and 29. Part 1: the answers, what landed, step 1 and its four calls, k1. Part 2: step 2 and its eight calls (A5 removed), k2. Part 3: step 5 and its six calls, k3. Part 4: step 3 and its four calls, step 4 and D1, k4, what ran, the end.
- QUICK CHECKS (§7): one per part, each a prediction, each with `- explained_at:` naming the beat that explains it; option cards carry `data-option`.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still.

## Frame 1 — Question 2 is B, from your words

- chapter_start: The answers, and step 1
- scene: NO SPINE: kicker 'Question 1 · Question 2'; left, on 'own words', the label 'Question 1 · your words · D-108' and the owner's words in Garamond italic ('not messing w video, but … bigger'); right, on 'B', a 16:9 frame outline with its lowest eighth marked (dashed), and on 'eighth' that eighth takes the coral outline (the one coral) and the label 'the band'; the chip 'Question 2 · B · inside the frame' lands on 'B'; the grey chip 'on the record · when you review' on 'record'
- voiceover: "Question one is on the record in your own words: not over the video, but bigger, with videos designed for it. So question two was built as B: the band sits in the lowest eighth of the frame, which new videos leave empty. It goes on the record when you review this."
- duration: 14.443s
- transition_in: cut
- status: animated
- src: compositions/frames/01-answers.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: question 2 as B: the band in the frame's lowest eighth
- sfx: none

narrativeRole: Question 2 is B, from your words.
keyMessage: Question one is on the record in your own words:

## Frame 2 — Five steps, twenty-two calls

- scene: RAIL: kicker 'What landed · 5 steps'; the five-slot rail, each slot's 'done' on 'landed'; the mono chip '59c479f' on 'commit'; right, the figure '22' with the mono unit 'calls' on 'twenty-two', and '+ D1 deviation' on 'deviation'; on 'dozen' the chip 'past a dozen: too open' outlined coral (the one coral); on 'stop' the chip 'all 23 stop'
- voiceover: "All five steps landed, in one commit. The agent made twenty-two calls the plan did not, and one deviation: well past the dozen at which the skill says a plan has left too much open. Most are how the band looks, and how step five meets the player's older rules."
- duration: 15.061s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-landed.html
- type: product_intro
- beat: Focus
- blueprint: compose
- focal: 22 calls, past the dozen
- sfx: none

narrativeRole: Five steps, twenty-two calls.
keyMessage: All five steps landed, in one commit.

## Frame 3 — Step 1: the frame's cards answer

- scene: SPINE + REAL SCREENSHOT: this video's own quick check k1 in the review player, card B under the pointer and ringed coral by the player, the band in the frame's lowest eighth; chips right on their words
- voiceover: "Step one. While a question waits, the frame's own cards answer it: point at one and it rings in coral; a click is its letter's key. All forty-three question frames on the review page are matched."
- duration: 10.837s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the real player, card B ringed, the band in the frame
- sfx: none

narrativeRole: Step 1: the frame's cards answer.
keyMessage: Step one.

## Frame 4 — Call A1: buttons over the cards

- scene: SPINE + CALL CARDS: kicker 'Call A1 · Step 1'; left, 'Chose · Buttons laid over the cards' (2 px ink border) on 'buttons', 'Instead of · Listeners inside the frame' at ink 55 % on 'listeners', the check chip 'player.js · frameCards'; right, a prototype (hits); one coral
- voiceover: "Call A1. The player lays its own buttons over the cards, instead of listeners inside the frame's page, which is rebuilt on every theme switch."
- duration: 8.107s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-call-a1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a1
- chose: The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player
- instead_of: listeners and a hover style injected into the frame's own document
- why: the frame's document is rebuilt by the runtime (a theme switch, a reload) and sits under the HyperFrames player's own click handling; the player's buttons are tabbable, keep the keyboard in the player, and need nothing from the frame but its boxes
- check: packages/player/reelplanning-player.js frameCards, renderHits, .hits CSS
- focal: what A1 chose
- sfx: none

narrativeRole: Call A1: buttons over the cards.
keyMessage: Call A1.

## Frame 5 — Call A2: letters first, order last

- scene: SPINE + CALL CARDS: kicker 'Call A2 · Step 1'; left, 'Chose · Letters first, order last' (2 px ink border) on 'letter', 'Instead of · Letter, then order' at ink 55 % on 'order', the check chip 'player.js · frameCards'; right, rows: data-option="b" / data-plan-option="b" / id ends -opt-b / order of the cards; one coral
- voiceover: "Call A2. A card is matched by the letter on it, and by the order of the cards only last: order alone matched none of the walkthroughs' checks."
- duration: 7.893s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-call-a2.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a2
- chose: Cards are matched by data-option, then by data-plan-option (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending -opt-a / -option-a / -choice-a / -chip-a, and only then by the order of the elements whose class ends in -opt; a rule counts only when it finds exactly one card per option, each with a box
- instead_of: data-option then the order of -opt elements only
- why: a survey of every question frame on the review page: order alone matched none of the quick checks in the walkthroughs or the system video, and a letter already written on the card is safer than counting; a frame where no rule finds every option keeps the sheet
- check: packages/player/reelplanning-player.js frameCards
- focal: what A2 chose
- sfx: none

narrativeRole: Call A2: letters first, order last.
keyMessage: Call A2.

## Frame 6 — Call A6: a card shows its state

- scene: SPINE + CALL CARDS: kicker 'Call A6 · Step 1'; left, 'Chose · The card shows your answer' (2 px ink border) on 'state', 'Instead of · Only words in the band' at ink 55 % on 'instead', the check chip 'player.js · syncHits'; right, the real capture 'answered'; one coral
- voiceover: "Call A6. A card shows its state on the frame: your answer ringed in ink, the right one in coral, instead of only words in the band."
- duration: 7.765s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-call-a6.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a6
- chose: A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it
- instead_of: no state on the frame, only words in the strip
- why: the reviewer answered on the card, so the answer is marked there; reading the sheet's buttons (a MutationObserver) keeps both in step with one source
- check: packages/player/reelplanning-player.js syncHits, .hit[data-chosen], .hit[data-right] CSS
- focal: what A6 chose
- sfx: none

narrativeRole: Call A6: a card shows its state.
keyMessage: Call A6.

## Frame 7 — Call A11: Show the frame puts it aside

- scene: SPINE + CALL CARDS: kicker 'Call A11 · Step 1'; left, 'Chose · Show the frame puts it aside' (2 px ink border) on 'aside', 'Instead of · Cards that answer while drawing' at ink 55 % on 'stop', the check chip 'player.js · fold'; right, the real capture 'folded'; one coral
- voiceover: "Call A11. Show the frame puts the question aside, so the cards stop taking clicks while you draw. The band folds to a pill in its corner."
- duration: 8.064s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-call-a11.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a11
- chose: "Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (changed after review: under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3)
- instead_of: dropping "Show the frame" (the frame is no longer covered), or cards that answer while drawing
- why: the plan lists it; without it a reviewer who wants to draw on a question's frame would answer it by accident
- check: packages/player/reelplanning-player.js fold, placeCard, .stage:not([data-tool=""]) .hits CSS
- focal: what A11 chose
- sfx: none

narrativeRole: Call A11: Show the frame puts it aside.
keyMessage: Call A11.

## Frame 8 — Quick check: three cards, four options

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Three cards, four options: you see?'; three option cards (data-option a–c): A 'Three cards answer; D in the band', B 'Today's sheet, as before', C 'Cards answer; D by key only'; nothing marked
- voiceover: "Quick check. A frame draws three option cards, but its question has four options. What do you see?"
- duration: 5.44s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 1
- quiz: k1
- question: A frame draws three option cards, but its question has four options. What do you see?
- option_a: The three cards answer; D in the band
- option_b: Today's sheet, as before
- option_c: The cards answer; D by its key only
- answer: b
- explain: A rule counts only when it finds one card for every option, so a frame with three cards for four options keeps today's sheet (A2).
- explained_at: 5
- focal: the three predictions
- sfx: none

narrativeRole: Quick check: three cards, four options.
keyMessage: Quick check.

## Frame 9 — Part 2 of 4

- chapter_start: Step 2: the answer band
- scene: RAIL: kicker 'Part 2 of 4'; the five-slot rail, steps 1 done, 2 outlined coral; hero 'The answer band'
- voiceover: "Part two of four: step two, the band, and its eight calls."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-opener-2.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: step 2
- sfx: none

narrativeRole: Part 2 of 4.
keyMessage: Part two of four:

## Frame 10 — Step 2: the answer band

- scene: SPINE + REAL SCREENSHOT: this video stopped on its own call A1 in the review player, the band in the frame's lowest eighth (the question's line in the serif, Accept and Flag as clear buttons); chips right on their words; the detail chip
- voiceover: "Step two. The band holds only what the cards can't take: your own words, Explain this more, a note, and a call's Accept and Flag. It is an eighth of the video high, at reading size, and the video never changes size. The detail lists where it goes on each kind of video."
- duration: 15.573s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 2
- detail: band-places
- detail_title: Where the band goes, and how big it is
- detail_why: The detail lists where it goes on each kind of video.
- detail_kind: table
- focal: the band in this video's own frame
- sfx: none

narrativeRole: Step 2: the answer band.
keyMessage: Step two.

## Frame 11 — Call A13: the frame claims the room

- scene: SPINE + CALL CARDS: kicker 'Call A13 · Step 2'; left, 'Chose · An attribute on each frame' (2 px ink border) on 'claims', 'Instead of · A line in the storyboard' at ink 55 % on 'instead', the check chip 'player.js · detectBand'; right, a prototype (eighth); one coral
- voiceover: "Call A13. A video claims that room with data band bottom on each frame's root, instead of a line in the storyboard."
- duration: 7.083s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-call-a13.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a13
- chose: A video leaves its lowest eighth for the band by data-band="bottom" on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video
- instead_of: a field in the storyboard's front matter lifted into the plan map, or a place decided per question
- why: the attribute is on what actually leaves the room, so a frame built without it cannot claim it; a video mixing places would still have to keep the room under it for its older frames, so it is one place per video
- check: packages/player/reelplanning-player.js detectBand, placeBand
- focal: what A13 chose
- sfx: none

narrativeRole: Call A13: the frame claims the room.
keyMessage: Call A13.

## Frame 12 — Call A14: older videos keep room under

- scene: SPINE + CALL CARDS: kicker 'Call A14 · Step 2'; left, 'Chose · Room kept under the frame' (2 px ink border) on 'keeps', 'Instead of · A band that grows' at ink 55 % on 'grows', the check chip 'player.js · .bandroom'; right, the real capture 'under'; one coral
- voiceover: "Call A14. An older video keeps the band's room under the frame for the whole video, instead of a band that grows."
- duration: 6.464s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-call-a14.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a14
- chose: The band is an eighth of the video high, never under 72 px. Under the video its room (.bandroom) is kept for the whole video and the stage's height formula leaves exactly it (--band-k 8/9, --band-min 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed
- instead_of: a band that grows with what it holds, or a fixed pixel height
- why: growing would move the transport under it, and a fixed height would be too small on a large screen or too large on a small one; on a phone the frame is the page's width, so a growing band still never resizes it
- check: packages/player/reelplanning-player.js .bandroom, --band-k, the phone block
- focal: what A14 chose
- sfx: none

narrativeRole: Call A14: older videos keep room under.
keyMessage: Call A14.

## Frame 13 — Call A15: two lines

- scene: SPINE + CALL CARDS: kicker 'Call A15 · Step 2'; left, 'Chose · Two lines, clear buttons' (2 px ink border) on 'two', 'Instead of · The whole question, wrapping' at ink 55 % on 'whole', the check chip 'player.js · .decision.band'; right, the real capture 'band'; one coral
- voiceover: "Call A15. The band is two lines: the question's own words in the serif, then clear buttons, instead of the whole question wrapping."
- duration: 7.424s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-call-a15.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a15
- chose: The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (cqw): the question 15–22 px, buttons 30–40 px
- instead_of: the question in full, wrapping; or the strip's one line
- why: an eighth of the video holds two lines of reading-size type; the frame shows the question in full already, so the band's line says which question waits
- check: packages/player/reelplanning-player.js the .decision.band CSS
- focal: what A15 chose
- sfx: none

narrativeRole: Call A15: two lines.
keyMessage: Call A15.

## Frame 14 — Call A16: the captions step aside

- scene: SPINE + CALL CARDS: kicker 'Call A16 · Step 2'; left, 'Chose · Captions hidden while it is up' (2 px ink border) on 'captions', 'Instead of · Captions left in place' at ink 55 % on 'otherwise', the check chip 'player.js · syncBand'; right, rows: captions / band; one coral
- voiceover: "Call A16. In the frame, the captions step aside while the band is up; otherwise their top edge would show above it."
- duration: 6.656s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-call-a16.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a16
- chose: In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes
- instead_of: leaving the captions
- why: the caption pill sits at y 880–1040, so the band (from y 945) would leave its top edge showing above it; while a question waits the band carries the words
- check: packages/player/reelplanning-player.js syncBand
- focal: what A16 chose
- sfx: none

narrativeRole: Call A16: the captions step aside.
keyMessage: Call A16.

## Frame 15 — Call A3: a call gets the band

- scene: SPINE + CALL CARDS: kicker 'Call A3 · Step 2'; left, 'Chose · A call gets the band' (2 px ink border) on 'band', 'Instead of · The sheet for calls' at ink 55 % on 'accept', the check chip 'player.js · askAutonomy'; right, the real capture 'call'; one coral
- voiceover: "Call A3. A call like this one has no cards, so it gets the band: what it chose, in one line, and Accept and Flag."
- duration: 6.677s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-call-a3.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a3
- chose: A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (changed after review: the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons)
- instead_of: keeping the sheet for calls, or listing those facts in the strip
- why: the plan puts a call's Accept and Flag in the strip; every walkthrough frame for a call already draws what it chose, what it replaced and where to check
- check: packages/player/reelplanning-player.js openCard (kind === "call"), askAutonomy (about)
- focal: what A3 chose
- sfx: none

narrativeRole: Call A3: a call gets the band.
keyMessage: Call A3.

## Frame 16 — Call A4: a group in the band

- scene: SPINE + CALL CARDS: kicker 'Call A4 · Step 2'; left, 'Chose · Accept all, a Flag per call' (2 px ink border) on 'accept', 'Instead of · A list over the frame' at ink 55 % on 'instead', the check chip 'player.js · groupOpts'; right, the real capture 'group'; one coral
- voiceover: "Call A4. A group of calls gets Accept all, and one Flag per call, instead of the old list over the frame."
- duration: 6.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-call-a4.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a4
- chose: A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (changed after review: in the band, with "N more calls from this part." as its line of words)
- instead_of: the sheet's list of the calls with a Flag on each row
- why: the grouped frame lists the calls; the list over it is what step 2 removes
- check: packages/player/reelplanning-player.js groupOpts, flagInGroup
- focal: what A4 chose
- sfx: none

narrativeRole: Call A4: a group in the band.
keyMessage: Call A4.

## Frame 17 — Call A12: tap a card

- scene: SPINE + CALL CARDS: kicker 'Call A12 · Step 2'; left, 'Chose · Tap a card, no key caps' (2 px ink border) on 'phone', 'Instead of · The desktop wording' at ink 55 % on 'drops', the check chip 'player.js · the phone CSS'; right, the real capture 'phone'; one coral
- voiceover: "Call A12. On a phone the band sits under the frame, says tap a card, and drops the key caps."
- duration: 5.291s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-call-a12.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a12
- chose: On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (changed after review: the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high)
- instead_of: the desktop wording ("Click a card, or press A, B or C.")
- why: there are no keys to press on a phone
- check: packages/player/reelplanning-player.js openCard (touch), the phone CSS
- focal: what A12 chose
- sfx: none

narrativeRole: Call A12: tap a card.
keyMessage: Call A12.

## Frame 18 — Call A5: removed

- scene: SPINE + CALL CARDS: kicker 'Call A5 · Step 2'; left, 'Chose · Removed: the video never resizes' (2 px ink border) on 'removed', 'Instead of · Shrinking the video' at ink 55 % on 'shrank', the check chip 'player.js · syncStrip, gone'; right, the figure '0 px'; one coral
- voiceover: "Call A5 is removed: the first version shrank the video to fit the strip. Now the room is kept, and nothing resizes."
- duration: 6.912s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-call-a5.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a5
- chose: While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (changed after review: removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size)
- instead_of: keeping the frame's size and letting the page scroll under the strip
- why: the page's rule is the biggest frame that fits the window with its chrome; a strip pushing the timeline and Finish below the window breaks it
- check: packages/player/reelplanning-player.js syncStrip, --strip in .wrap CSS
- focal: what A5 chose
- sfx: none

narrativeRole: Call A5: removed.
keyMessage: Call A5 is removed:

## Frame 19 — Quick check: an older video

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'An older video stops: the band?'; three option cards (data-option a–c): A 'Over the frame's lowest eighth', B 'Under, in room kept all along', C 'Under; the video shrinks'; nothing marked
- voiceover: "Quick check. A video built before the band stops at a question. Where does the band go?"
- duration: 4.523s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 2
- quiz: k2
- question: A video built before the band stops at a question. Where does the band go?
- option_a: Over the frame's lowest eighth
- option_b: Under the video, in room kept all along
- option_c: Under the video, which shrinks while it is up
- answer: b
- explain: Its frames don't carry data-band="bottom", so the band goes under the video, in room kept for the whole video, and nothing resizes (A13, A14).
- explained_at: 12
- focal: the three predictions
- sfx: none

narrativeRole: Quick check: an older video.
keyMessage: Quick check.

## Frame 20 — Part 3 of 4

- chapter_start: Step 5: questions keep pace
- scene: RAIL: kicker 'Part 3 of 4'; the five-slot rail, steps 1, 2 done, 5 outlined coral; hero 'Questions keep pace'
- voiceover: "Part three of four: step five, new since your review, and six calls."
- duration: 4.08s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-opener-3.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: step 5
- sfx: none

narrativeRole: Part 3 of 4.
keyMessage: Part three of four:

## Frame 21 — Step 5: questions keep pace

- scene: SPINE + REAL SCREENSHOT: this video's quick check k1 answered in the review player, the band showing the explanation, 'Back to where this was explained', Continue and the count; three chips right, one per rule, on their words; the detail chip
- voiceover: "Step five, from your comments. A quick check you just answered waits ten seconds, not four. Back to where this was explained replays the beat that explains it. And an unanswered question stops the video again. The detail shows how these meet the older rules."
- duration: 14.144s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-step-5.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 5
- detail: step-5-rules
- detail_title: Step 5's rules, and the player's older ones
- detail_why: The detail shows how these meet the older rules.
- detail_kind: table
- focal: the answered quick check's band: the count and Back to where this was explained
- sfx: none

narrativeRole: Step 5: questions keep pace.
keyMessage: Step five, from your comments.

## Frame 22 — Call A17: ten seconds just after

- scene: SPINE + CALL CARDS: kicker 'Call A17 · Step 5'; left, 'Chose · 10 s just after answering' (2 px ink border) on 'ten', 'Instead of · 10 s every time' at ink 55 % on 'met', the check chip 'player.js · startWait'; right, the figure '10 s'; one coral
- voiceover: "Call A17. The ten seconds are for a quick check answered just now; one met again, already answered, keeps four."
- duration: 6.848s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-call-a17.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a17
- chose: The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s
- instead_of: 10 s for every answered question met again
- why: the owner's words were about reading a quick check's explanation after answering; a rewatch past a run of answered questions would otherwise stop 10 s at each
- check: packages/player/reelplanning-player.js startWait, _freshAnswer
- focal: what A17 chose
- sfx: none

narrativeRole: Call A17: ten seconds just after.
keyMessage: Call A17.

## Frame 23 — Call A18: the count waits on the band

- scene: SPINE + CALL CARDS: kicker 'Call A18 · Step 5'; left, 'Chose · Waits while you are on it' (2 px ink border) on 'waits', 'Instead of · Counting on regardless' at ink 55 % on 'again', the check chip 'player.js · bandHeld'; right, the real capture 'held'; one coral
- voiceover: "Call A18. The count waits while your pointer or keyboard is on the band, and starts again when you leave it."
- duration: 5.973s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-call-a18.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a18
- chose: "On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer
- instead_of: Continue counting too; or pausing and resuming the count where it was
- why: the player puts the keyboard on Continue after every answer, so counting it would mean it never goes on; a sheet is answered by clicking on it, so the pointer is always there
- check: packages/player/reelplanning-player.js bandHeld, startWait
- focal: what A18 chose
- sfx: none

narrativeRole: Call A18: the count waits on the band.
keyMessage: Call A18.

## Frame 24 — Call A19: a frame, not a time

- scene: SPINE + CALL CARDS: kicker 'Call A19 · Step 5'; left, 'Chose · A frame, not a time' (2 px ink border) on 'frame', 'Instead of · A time in seconds' at ink 55 % on 'time', the check chip 'plan-map.mjs · explainedFrame'; right, rows: explained_at: 12 / first beat of its step / start of its part; one coral
- voiceover: "Call A19. Explained at names a frame, not a time, so it survives a retime; without it, the step's first beat."
- duration: 6.571s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-call-a19.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a19
- chose: "Back to where this was explained": explained_at is a frame number or a composition id, lifted into the plan map as that frame's start (explainedAt, explainedFrame; one naming no frame warns and is left out). Without it: the first beat of the check's plan_step before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there
- instead_of: a time in seconds in the storyboard; landing paused
- why: a frame survives a retime and a time does not; the reviewer asked for the rewind to be automatic, so it plays
- check: scripts/plan-map.mjs explainedFrame; packages/player/reelplanning-player.js explainedAt, backToExplained, renderDecisions (data-back)
- focal: what A19 chose
- sfx: none

narrativeRole: Call A19: a frame, not a time.
keyMessage: Call A19.

## Frame 25 — Call A20: sent as a rewind

- scene: SPINE + CALL CARDS: kicker 'Call A20 · Step 5'; left, 'Chose · Sent as a rewind' (2 px ink border) on 'rewind', 'Instead of · Not counted' at ink 55 % on 'one', the check chip 'player.js · backToExplained'; right, the figure '1 rewind'; one coral
- voiceover: "Call A20. The trip back is sent as a rewind, because it is one."
- duration: 3.797s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-call-a20.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a20
- chose: The trip back is sent as a rewind (D-005)
- instead_of: not counting it
- why: it is one, and the review's "rewound here" is the same signal: something there wanted saying more plainly
- check: packages/player/reelplanning-player.js backToExplained (noteRewind)
- focal: what A20 chose
- sfx: none

narrativeRole: Call A20: sent as a rewind.
keyMessage: Call A20.

## Frame 26 — Call A21: it waits there

- scene: SPINE + CALL CARDS: kicker 'Call A21 · Step 5'; left, 'Chose · Waits, with no count' (2 px ink border) on 'count', 'Instead of · The usual 4 s' at ink 55 % on 'answered', the check chip 'player.js · meet'; right, rows: met in playback / after the trip back; one coral
- voiceover: "Call A21. Reached again after that trip back, the question waits with no count, even when it was answered."
- duration: 6.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-call-a21.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a21
- chose: Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark
- instead_of: the usual 4 s for an answered one
- why: the reviewer went back to look at it again; it should be there when they arrive
- check: packages/player/reelplanning-player.js meet (_waitFor)
- focal: what A21 chose
- sfx: none

narrativeRole: Call A21: it waits there.
keyMessage: Call A21.

## Frame 27 — Call A22: it stops again

- scene: SPINE + CALL CARDS: kicker 'Call A22 · Step 5'; left, 'Chose · Play lets it go; it stops again' (2 px ink border) on 'lets', 'Instead of · Asked once, never again' at ink 55 % on 'rule', the check chip 'player.js · tickDecisions'; right, a prototype (timeline); one coral
- voiceover: "Call A22. Play, with a question up, lets it go, and it stops again when reached. The old rule, asked once and never again, is gone."
- duration: 7.893s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-call-a22.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 5
- autonomy: a22
- chose: An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped
- instead_of: closing it on any seek, or Play doing nothing while a question waits
- why: review-keys.spec.mjs keeps the question up under ← and →, so a reviewer can look back before answering; Play is the reviewer choosing to go on without answering, and the question then comes back where it belongs
- check: packages/player/reelplanning-player.js tickDecisions
- focal: what A22 chose
- sfx: none

narrativeRole: Call A22: it stops again.
keyMessage: Call A22.

## Frame 28 — Quick check: the pointer on the band

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 5'; the question 'Pointer on the band: when on?'; three option cards (data-option a–c): A 'After 10 s', B 'After 4 s', C '10 s after you leave it, or on Continue'; nothing marked
- voiceover: "Quick check. You answered a quick check, and your pointer rests on the band. When does the video go on?"
- duration: 4.928s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 5
- quiz: k3
- question: You answered a quick check, and your pointer rests on the band. When does the video go on?
- option_a: After ten seconds
- option_b: After four seconds
- option_c: Ten seconds after you leave the band, or on Continue
- answer: c
- explain: The count waits while the pointer or the keyboard is on the band, and starts again from the top when you leave; Continue goes at once (A18).
- explained_at: 23
- focal: the three predictions
- sfx: none

narrativeRole: Quick check: the pointer on the band.
keyMessage: Quick check.

## Frame 29 — Part 4 of 4

- chapter_start: Steps 3 and 4: the record, and the check
- scene: RAIL: kicker 'Part 4 of 4'; the five-slot rail, steps 1, 2, 5 done, 3 and 4 outlined coral; hero 'The record, and the check'
- voiceover: "Part four of four: the record, and the check."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-opener-4.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: steps 3 and 4
- sfx: none

narrativeRole: Part 4 of 4.
keyMessage: Part four of four:

## Frame 30 — Step 3: the record edits in place

- scene: SPINE + REAL SCREENSHOT: the record after a send, a choice's 'change' open with its options under the answer; four chips right, one per thing now edited, on their words
- voiceover: "Step three. In the record, an answer, a call's verdict, a mark's words and a quick check's note are now edited where they are listed."
- duration: 6.955s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the record's editor under an answer
- sfx: none

narrativeRole: Step 3: the record edits in place.
keyMessage: Step three.

## Frame 31 — Call A7: change opens the options

- scene: SPINE + CALL CARDS: kicker 'Call A7 · Step 3'; left, 'Chose · The options, under the answer' (2 px ink border) on 'opens', 'Instead of · Back into the video' at ink 55 % on 'sending', the check chip 'player.js · answerEditor'; right, the real capture 'record-edit'; one coral
- voiceover: "Call A7. Change opens the question's options under the answer, instead of sending you back into the video."
- duration: 5.931s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-call-a7.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a7
- chose: "change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question
- instead_of: a select, or reopening the question on the video as before
- why: the options are what the question offered, and the record is written as a fresh answer would be, so the video routes by it; asking for more is the question's own act
- check: packages/player/reelplanning-player.js answerEditor, changeAnswer, .redit CSS
- focal: what A7 chose
- sfx: none

narrativeRole: Call A7: change opens the options.
keyMessage: Call A7.

## Frame 32 — Call A8: own words replaced

- scene: SPINE + CALL CARDS: kicker 'Call A8 · Step 3'; left, 'Chose · Its comment goes too' (2 px ink border) on 'drop', 'Instead of · The old comment left' at ink 55 % on 'two', the check chip 'player.js · changeAnswer'; right, rows: own words / answer changed; one coral
- voiceover: "Call A8. Own words replaced in the record drop the comment they made, so the export never carries two answers."
- duration: 6.443s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-call-a8.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a8
- chose: An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one
- instead_of: leaving the old comment, or rewording it in place
- why: the answer and that comment are the same words; left behind, the export would carry two different answers to one question
- check: packages/player/reelplanning-player.js changeAnswer
- focal: what A8 chose
- sfx: none

narrativeRole: Call A8: own words replaced.
keyMessage: Call A8.

## Frame 33 — Call A9: switch a verdict

- scene: SPINE + CALL CARDS: kicker 'Call A9 · Step 3'; left, 'Chose · One link to switch it' (2 px ink border) on 'link', 'Instead of · Reopening the call' at ink 55 % on 'flag', the check chip 'player.js · changeVerdict'; right, the real capture 'verdict'; one coral
- voiceover: "Call A9. A call's verdict switches with one link: accept instead, or flag instead."
- duration: 5.163s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-call-a9.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a9
- chose: A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes
- instead_of: a toggle, or reopening the call on the video
- why: one click makes the same record the strip makes (recordVerdict), so the flag's note on its step is added or removed with it
- check: packages/player/reelplanning-player.js renderAutonomy (data-reverdict), changeVerdict
- focal: what A9 chose
- sfx: none

narrativeRole: Call A9: switch a verdict.
keyMessage: Call A9.

## Frame 34 — Call A10: Send the change

- scene: SPINE + CALL CARDS: kicker 'Call A10 · Step 3'; left, 'Chose · At the record's head too' (2 px ink border) on 'head', 'Instead of · The Finish panel only' at ink 55 % on 'local', the check chip 'player.js · syncResend'; right, the real capture 'resend'; one coral
- voiceover: "Call A10. After a send, Send the change is offered at the head of the record too, on the local page only."
- duration: 6.016s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-call-a10.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a10
- chose: After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only
- instead_of: the Finish panel only; or the hosted page too
- why: edits are made in the record, so the offer is where they are made; a hosted page has no second send today (a new comment is not offered there either), and adding one is a change to what the hosted store receives
- check: packages/player/reelplanning-player.js syncResend, .resend
- focal: what A10 chose
- sfx: none

narrativeRole: Call A10: Send the change.
keyMessage: Call A10.

## Frame 35 — Step 4: four videos, by clicks

- scene: SPINE + FOUR TILES: this plan's video, the revise-loop plan video, its walkthrough and the system video, each with its questions' count, landing on 'four'; chips right on their words
- voiceover: "Step four. A new spec answers every question of four videos by clicks, in light, dark and at phone width, and since your review it measures the video around each question: it never changes size."
- duration: 11.371s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-step-4.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: four videos played through by clicks
- sfx: none

narrativeRole: Step 4: four videos, by clicks.
keyMessage: Step four.

## Frame 36 — Deviation D1: four videos, not every one

- scene: SPINE + CALL CARDS: kicker 'Deviation D1 · Step 4'; left, 'Chose · Four videos, one of each kind' (2 px ink border) on 'four', 'Instead of · Every video on the page' at ink 55 % on 'every', the check chip 'answer-on-frame.spec.mjs'; right, rows: in the spec / checked once, by a script; one coral
- voiceover: "The deviation, D1. The plan said every video on the review page; the spec plays four, one of each kind, and a script checked the rest once."
- duration: 7.936s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-deviation-d1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 4
- autonomy: d1
- chose: The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec
- instead_of: every video on the review page in the spec
- why: the four are the kinds there are (plan, walkthrough with calls and groups, system); each more video adds about a minute to npm test, and the matching they would test is the same code
- check: packages/player/test/answer-on-frame.spec.mjs
- focal: what D1 chose
- sfx: none

narrativeRole: Deviation D1: four videos, not every one.
keyMessage: The deviation, D1.

## Frame 37 — Quick check: a verdict switched after the send

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Sent, then a verdict switched?'; three option cards (data-option a–c): A 'Saved for your next review', B 'Offered as Send the change', C 'Sent at once'; nothing marked
- voiceover: "Quick check. You have sent your review, and now switch a call's verdict in the record. What happens?"
- duration: 4.736s
- transition_in: crossfade
- status: animated
- src: compositions/frames/37-quiz-k4.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 3
- quiz: k4
- question: You have sent your review, and now switch a call's verdict in the record. What happens?
- option_a: It is saved, and goes with your next review
- option_b: It is offered as Send the change
- option_c: It is sent at once
- answer: b
- explain: After a send, any edit in the record is offered as Send the change, at the head of the record and in the Finish panel; nothing is sent until you press it (A10).
- explained_at: 34
- focal: the three predictions
- sfx: none

narrativeRole: Quick check: a verdict switched after the send.
keyMessage: Quick check.

## Frame 38 — What ran, and what is not done

- scene: SPINE + THREE TALLIES: '1480 checks · npm test' on 'fourteen', 'code check · 0 ✗' on 'nothing' (outlined coral, the one coral), and 'not done · hosted second send' on 'not'
- voiceover: "The whole test suite passes, fourteen hundred and eighty checks, and a fresh agent's code check found nothing to answer. Not done: a second send from a hosted page."
- duration: 9.216s
- transition_in: crossfade
- status: animated
- src: compositions/frames/38-ran.html
- type: benefit_highlight
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: 1480 checks pass; the code check found nothing
- sfx: none

narrativeRole: What ran, and what is not done.
keyMessage: The whole test suite passes, fourteen hundred and eighty checks, and a fresh agent's code check found nothing to answer.

## Frame 39 — Flag a step, or accept

- scene: STEPS: kicker 'As built · 5 steps · 22 calls'; the five steps at reading size, each 'done' with its calls tally; step 2 carries 'q2: B · on accept' in coral (the one coral); on 'flag' the ask 'Flag a step, or accept' lands right; 'AI-generated narration and visuals' bottom right; holds still
- voiceover: "That is what was built: five steps, twenty-two calls and one deviation. Flag a step or a call, or accept, which puts question two on the record as B. The narration and visuals are AI-generated."
- duration: 14.82s
- transition_in: crossfade
- status: animated
- src: compositions/frames/39-end.html
- type: cta
- beat: Focus
- blueprint: compose
- focal: the five steps, and question 2 as B
- sfx: none

narrativeRole: Flag a step, or accept.
keyMessage: That is what was built:

