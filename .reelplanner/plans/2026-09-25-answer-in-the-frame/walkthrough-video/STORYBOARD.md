---
title: "Answer in the frame: what was built"
format: 1920x1080
duration: 296s
message: "What was built for the owner's direct ask, in their words: 'on the cards … click somewhere on them or hover over them to see more details … same with the question' and 'why we have a bar below the main video screen … cant we … embed in the video itself'. Three steps: the question is answered on the frame, by its cards, with no answer bar wherever a frame has its cards (a phone keeps it: the one off-plan change); More on each card and the full question; plain words on screen and a caption word you can click. Twenty choices, past the dozen the skill warns about: seventeen labelled ones stop in three pauses, one a step; the off-plan change pauses on its own; two unlabelled wait in one list. Decision D-108 (a strip below the video, bigger and more graceful) is replaced by this plan once its review is recorded."
arc: the owner's words and what was built for them; the words (chapter, answer bar, choice, label, accepted in a row, off-plan change, scene) each said plainly where first used, with a quick check on the pauses; then each step with real before and after screenshots, the older decision it replaces, its one pause, the off-plan change on its own, and a quick check on the case just shown; what ran, and the ask
audience: the repo owner, who asked for this directly (no plan video) and asked for plain words (D-127); assumes the system video's first chapter
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-25-answer-in-the-frame
before: system#part 1 | why a video, with the review player
before: 2026-09-22-m3-revise-loop | decisions D-083, D-085, D-064, D-066, D-082, D-084: how many quick checks does a video ask?
before: 2026-09-23-deep-dives | decisions D-021, D-024: where does a detail open?
terms: chapter, answer bar, choice, label, accepted in a row, off-plan change, scene
terms_check: strict
---

## Video direction

- THE OWNER'S WORDS FIRST (1): the two asks as said, typos aside ("on the cards i do want to be able to click somewhere on them or hover over them to see more details … same with the question, option to see more thorough question"; "why we have a bar below the main video screen … cant we do more gracefully like embed in the video itself just like how we click directly in it?"), then what was built for them (2).
- PLAIN WORDS (decision D-127): what is seen and heard says choice (not call), label (not tag: "you'll notice it", "toss-up", "hard-to-undo"), accepted in a row (not streak), off-plan change (not deviation), chapter (not part), scene (not beat) or pause when it stops, answer bar (not band). Files, commands, tags in this storyboard and the decision log keep today's names. No command names on screen or in the voice.
- DEFINE BEFORE USE: each word is said plainly the first time, with a small 'means' card on screen and `- defines:` on that scene: answer bar and chapter (2), choice and label (3), accepted in a row, off-plan change and scene (4). No id is said or shown without what it is ('choice A7', 'decision D-108', 'off-plan change D1'); each choice is described in words on its card and in the voice.
- ONE NUMBER FOR EACH THING, from `reel stops` and `reel audit` now: twenty rows (nineteen choices and one off-plan change), past the dozen the skill warns about (the audit's △: step 1 has ten); seventeen labelled choices stop (every label at 0 of 10 accepted in a row, hard-to-undo at 2), two unlabelled wait in one list, the off-plan change always stops: four pauses for them, one a step and one for the off-plan change.
- THE PAUSES `reel stops` prints, grouped per step: step 1 `- autonomy: a1, a2, a3, a4, a5, a6, a7, a8, a19` (9) and the off-plan change `- autonomy: d1` on its own (10); step 2 `- autonomy: a9, a10, a11, a12, a13` (13); step 3 `- autonomy: a14, a16, a18` (16), with `- autonomy_group: a15, a17` at the end of its chapter (18). Each choice is a clause in the voice and a card on the frame (`data-call`), laid out three by three with a line's room under each for its Accept and Flag.
- THE OFF-PLAN CHANGE said plainly (10): on a phone (a frame under 620 px wide) the answer bar stays below the frame; the frame is 390 × 219 px there and its cards' words 8 px, so readable chips would cover it; the cards still take the tap and show More. Accept keeps it; flag asks for phones on the frame too.
- THE OLDER DECISION (8): decision D-108 said "the principle of A, not messing with the video, but bigger … more graceful in the video": a strip below the video, bigger. This plan says: no strip where the frame has its cards; the bar only for frames without cards and on a phone. The decision log marks D-108 replaced when this plan's review is recorded (`reel record`), not before: it is still active now.
- A RECAP for new viewers (6, `- knowledge: new`, under 10 s): the earlier decisions past the two `before:` videos, in words: a second agent checks the code (D-001), going back is sent as a rewind (D-005), a long read opens in the side panel (D-021).
- REAL SCREENSHOTS, before and after, of what this plan changed: the videos-you-can-follow plan video's quick check 1, answered wrong, at 1440 × 1000, in e7d6064's player (a git worktree; the answer bar below the frame) and this build's (the answer on the cards) (7); this build's More on a card and Full question (12); a 390 px phone, both players: the bar stays (10); a caption word clicked (15). Taken with the player served the way packages/player/test/answer-on-frame.spec.mjs serves videos, with its follow-more fixture; in assets/shots/.
- QUICK CHECKS (§7): one per chapter, each testing its scene's main idea on the exact case just shown, with no new fact, a `- walk_me_through:`, `- explained_at:`, `- question_more:` where the heading shortens it, `- option_x_more:` that never gives the answer away and `- option_x_why:` on every card: k1 how many pauses (4), k2 a quick check on a phone (10), k3 More before an answer on a card with no extra words (13), k4 a caption word clicked while playing (15). The question heading carries `data-question`; option cards `data-option`.
- FOUR CHAPTERS (the step scenes carry `chapter_start` and say the chapter): what you asked for (1–6), step 1 (7–11), step 2 (12–14), step 3 (15–19).
- ANSWERED ON THE FRAME: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions, so the lowest eighth (y ≥ 945) is empty for the player's chips.
- A spine of three ticks (steps 1–3), the live one coral, on step scenes; the ending's step rows carry `data-plan-step`. The look from `.reelplanning/theme/frame.md`; one coral per frame (none on the choice cards, which the player rings); no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still. No details.

## Frame 1 — Your words

- chapter_start: What you asked for, and what was built
- scene: NO SPINE: kicker 'Your words · a direct ask'; the label 'On the cards' on 'First' and under it the quote card '“click somewhere on them or hover over them to see more details”'; the label 'The bar below the video' on 'Second' and its quote card '“embed in the video itself, just like how we click directly in it”', outlined coral on 'embed' (the one coral)
- voiceover: "You asked for two things. First: on the cards, I want to click somewhere or hover to see more details, because sometimes the answers aren't explained fully; the same with the question. Second: why is there a bar below the main video screen? Can't we embed it in the video itself, just like how we click directly in it?"
- duration: 17.67s
- transition_in: cut
- status: animated
- src: compositions/frames/01-your-words.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: the owner's two asks, in their words
- sfx: none

narrativeRole: Your words.
keyMessage: You asked for two things.

## Frame 2 — What was built

- defines: answer bar, chapter
- scene: NO SPINE: kicker 'As built · three steps'; three step rows landing on 'one', 'two', 'three', each 'done': 'Answer on the frame', 'More on each card', 'Plain words you can click'; the card 'answer bar · the strip below the video' on 'answer bar'; the chip 'gone where the frame has cards' outlined coral on 'gone' (the one coral); the card 'chapter · one stretch of this video' on 'chapters', with the grey chip '4 chapters'
- voiceover: "Both are built, in three steps. Step one: you answer on the frame, by its cards; the answer bar, the strip below the video, is gone wherever a frame has cards. Step two: More on each card and the question. Step three: plain words you can click. Four chapters: this one, then one per step."
- duration: 15.765s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-built.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: three steps built, the answer bar gone where a frame has its cards
- sfx: none

narrativeRole: What was built.
keyMessage: Both are built, in three steps.

## Frame 3 — Twenty choices, and their labels

- defines: choice, label
- scene: NO SPINE: kicker 'The words · 1 of 2'; the card 'choice · decided by the agent alone' on 'choices'; the figure '20' with 'choices' on 'Twenty'; the chip 'past 12: the skill warns' outlined coral on 'dozen' (the one coral); the grey chip 'step 1: 10, past the 5 that asks' on 'five' (decision D-110: at a step's fifth choice the agent stops and asks; this build did not); the card 'label · a note: worth a look' on 'label'; three label rows on their words: you'll notice it · you see it in use; toss-up · the other way was close; hard-to-undo · costly to change later
- voiceover: "Building it, the agent made twenty choices: things it decided alone, that the plan did not spell out. Twenty is past the dozen the skill warns about, and step one alone has ten, past the five where it should have stopped to ask you. A label is a note on a choice worth a look: you'll notice it; toss-up, the other way was close; or hard-to-undo."
- duration: 17.877s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-choice-label.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: twenty choices, past the dozen; what a label is
- sfx: none

narrativeRole: Twenty choices, and their labels.
keyMessage: Building it, the agent made twenty choices:

## Frame 4 — Which choices stop, and where they pause

- defines: accepted in a row, off-plan change, scene
- scene: NO SPINE: kicker 'The words · 2 of 2'; the card 'accepted in a row · at 10, no stop' on 'row'; tallies '17 labelled · stop' on 'seventeen' and '2 no label · one list' on 'without'; the card 'off-plan change · not what the plan said' on 'off-plan'; the card 'scene · a picture and a sentence or two' on 'scene'; the chip '1 pause a step + 1 off-plan' outlined coral on 'pause' (the one coral)
- voiceover: "A labelled choice stops the video until you have accepted its label ten times in a row. None here is past two: seventeen stop, and two without a label wait in one list. An off-plan change, not what the plan said, always stops. A step's choices share one scene, a picture and a sentence or two, so the video pauses once a step, plus once for the off-plan change."
- duration: 20.373s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-row-offplan-scene.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: seventeen stop, two wait in one list, one off-plan change; one pause a step
- sfx: none

narrativeRole: Which choices stop, and where they pause.
keyMessage: A labelled choice stops the video until you have accepted its label ten times in a row.

## Frame 5 — Quick check: how many pauses

- scene: QUESTION + THREE OPTIONS: kicker 'Quick check · The words'; the question heading (data-question) '17 stop in 3 steps, + 1 off-plan change. Pauses?'; three option cards (data-option a–c); nothing marked (the player asks, then shows the answer on the cards)
- voiceover: "Quick check. Seventeen choices stop, across three steps, and there is one off-plan change. How many times does the video pause for them?"
- duration: 7.573s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k1
- question: Seventeen choices stop, across three steps, and there is one off-plan change. How many times does the video pause for them?
- question_more: Step one has nine choices that stop, step two five, step three three; the off-plan change is in step one.
- option_a: Once a step, plus once for the off-plan change
- option_b: Once for each choice, and the off-plan change
- option_c: Once a step; the off-plan change joins its step
- option_a_more: Each step's choices share one pause, and the off-plan change has one of its own.
- option_b_more: Every choice that stops, and the off-plan change, gets a pause of its own.
- option_c_more: The off-plan change shares its step's pause with the step's choices.
- answer: a
- explain: A step's choices that stop share one scene, so three steps pause three times, and the off-plan change pauses once more on its own.
- option_a_why: Each step's choices share one scene, and the off-plan change pauses on a scene of its own: four pauses here.
- option_b_why: A pause for each choice was how it worked before; now a step's choices share one scene.
- option_c_why: An off-plan change never joins its step's scene; it always pauses on its own.
- walk_me_through: Step one has nine choices that stop, step two five, step three three: seventeen. Each step's choices share one scene, so that is three pauses. The off-plan change is in step one, but it always has a scene of its own: a fourth pause. The two choices without a label wait in one list and are not among the seventeen.
- explained_at: 4
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: how many pauses.
keyMessage: Quick check.

## Frame 6 — Kept from earlier plans

- scene: NO SPINE: kicker 'Kept from earlier plans'; three rows on their words: 'a second agent checks the code' on 'second', 'going back is sent as a rewind' on 'rewind', 'a long read opens in the side panel' on 'side' (outlined coral, the one coral: it comes back in step 1)
- voiceover: "Kept from earlier plans: a second agent checks the code; going back is sent as a rewind; a long read opens in the side panel."
- duration: 7.552s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-recap.html
- type: pain_point
- beat: Focus
- blueprint: compose
- knowledge: new
- focal: three earlier decisions this build keeps
- sfx: none

narrativeRole: Kept from earlier plans.
keyMessage: Kept from earlier plans:

## Frame 7 — Step 1: the answer on the frame, before and now

- chapter_start: Step 1: answer on the frame
- scene: SPINE + TWO SCREENSHOTS: kicker 'Step 1 · On the frame'; 'Before' e7d6064's player at 1440, a quick check answered wrong (assets/shots/before-1440-answered.png), its answer bar outlined grey on 'bar'; 'Now' this build's player, the same answer on the cards (assets/shots/after-1440-answered.png), the cards and their whys outlined coral on 'ringed' (the one coral); the grey chip 'no cards → the answer bar' on 'no card'
- voiceover: "Chapter two: step one. Before, you clicked a card, but the verdict and Continue sat in the answer bar below the frame. Now the answer is on the frame: the right card and yours are ringed, each card's why under it, Continue under the cards. A frame with no card for each option still keeps the answer bar."
- duration: 18.13s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the same quick check answered: in the bar before, on the cards now
- sfx: none

narrativeRole: Step 1: the answer on the frame, before and now.
keyMessage: Chapter two:

## Frame 8 — An older decision, replaced

- scene: SPINE + TWO DECISION CARDS: kicker 'Step 1 · An older decision'; left card 'decision D-108 · answer on the video' reading 'a strip below the video,' / 'bigger, more graceful' on 'D-108'; the arrow '→' on 'says'; right card 'this plan · answer in the frame' reading 'no strip where the frame' / 'has its cards' on 'plan'; the chip 'replaced once your review is recorded' outlined coral on 'recorded' (the one coral)
- voiceover: "This replaces an older decision. Decision D-108 said: keep a strip below the video, but bigger and more graceful. This plan says: no strip where the frame has its cards. The decision log marks D-108 replaced once your review is recorded."
- duration: 14.933s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-d108.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: decision D-108's strip below the video, and this plan's answer on the frame
- sfx: none

narrativeRole: An older decision, replaced.
keyMessage: This replaces an older decision.

## Frame 9 — Step 1's nine choices that stop, in one pause

- scene: SPINE + NINE CHOICE CARDS (data-call a1…a8, a19), three by three, each with room under it for its Accept and Flag, each on its number word: A1 'A layer over the frame' · toss-up; A2 'Short of room: whys inside' · you'll notice it · toss-up; A3 'The answer on the cards' · you'll notice it; A4 'Chips in the lowest eighth' · you'll notice it; A5 'A card found by its mark' · hard-to-undo; A6 'Your words: a dashed slot' · you'll notice it; A7 'Accept and Flag on each card' · you'll notice it; A8 'No room kept for a bar' · toss-up; A19 'A click on it opens More' · you'll notice it · toss-up. No coral: the player rings the cards
- voiceover: "Step one's nine choices that stop share this one scene. One: the answer lies on a layer over the frame, so nothing is cut. Two: short of room, whys go inside their cards, last into the side panel. Three: a quick check's answer is on its cards. Four: the chips sit in the lowest eighth. Five: a choice's card is found by its mark. Six: your words go in a dashed slot. Seven: Accept and Flag hang from each choice's card. Eight: no room is kept for a bar. Nine: a click on a choice's card opens More, and judges nothing."
- duration: 32.01s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-stop-step-1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a1, a2, a3, a4, a5, a6, a7, a8, a19
- focal: nine choice cards, one pause
- sfx: none

narrativeRole: Step 1's nine choices that stop, in one pause.
keyMessage: Step one's nine choices that stop share this one scene.

## Frame 10 — The off-plan change: a phone keeps the bar

- scene: SPINE + TWO PHONE SCREENSHOTS + THE CHANGE'S CARD: kicker 'Step 1 · The off-plan change'; 'Before' e7d6064's player on a 390 px phone (assets/shots/before-phone.png) and 'Now' this build's (assets/shots/after-phone.png), its bar outlined grey on 'below'; the card (data-call d1) 'off-plan change D1' reading 'A phone keeps the bar' / 'instead of all on the frame' on 'kept'; grey chip '390 × 219 px frame' on 'four'; the chip 'card words: 8 px' outlined coral on 'eight' (the one coral); grey chip 'the cards still take the tap' on 'tap'
- voiceover: "The off-plan change has its own scene. You asked for everything on the frame. On a phone, the agent kept the answer bar below it: the frame is under four hundred pixels wide, its cards' words eight pixels tall, so chips you could read would cover it. The cards still take your tap. Accept to keep the bar on phones; flag it to change that."
- duration: 19.3s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-offplan-d1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: d1
- focal: on a phone the answer bar stays below the frame; the cards still take the tap
- sfx: none

narrativeRole: The off-plan change: a phone keeps the bar.
keyMessage: The off-plan change has its own scene.

## Frame 11 — Quick check: a quick check on a phone

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the question heading (data-question) 'A phone, a check with its cards: where is Continue?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. On a phone, a quick check whose frame has a card for each option. Where are its Continue and your words?"
- duration: 6.315s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 1
- quiz: k2
- question: On a phone, a quick check whose frame has a card for each option. Where are its Continue and your words?
- question_more: The phone is 390 pixels wide; the frame shows three option cards.
- option_a: In the answer bar, below the frame
- option_b: On the frame, under the cards
- option_c: In the side panel
- option_a_more: The strip below the frame, as before this build.
- option_b_more: Drawn by the cards, as on a wide window.
- option_c_more: The panel beside the video, where a long read opens.
- answer: a
- explain: On a phone the agent kept the answer bar below the frame, since chips and whys you could read would cover a frame under four hundred pixels wide.
- option_a_why: On a phone the frame is too small to write on, so the answer bar below it keeps Continue and your words; the cards still take the tap.
- option_b_why: That is a wide window; on a phone the chips would cover a frame whose cards' words are eight pixels tall.
- option_c_why: The side panel opens only for a long read that does not fit, not for Continue.
- walk_me_through: On a phone the frame is under four hundred pixels wide, and its cards' words are eight pixels tall. Chips and whys big enough to read would cover the frame, so the agent kept them in the answer bar below it: Continue, your words, the verdict. The cards themselves still take your tap and show More. That is the off-plan change you can accept or flag.
- explained_at: 10
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a quick check on a phone.
keyMessage: Quick check.

## Frame 12 — Step 2: More on each card, and the question in full

- chapter_start: Step 2: More on each card
- scene: SPINE + TWO SCREENSHOTS: kicker 'Step 2 · More'; left this build's player with card A's More open (assets/shots/after-1440-more-card.png), the popover outlined coral on 'fuller' (the one coral); right the same check with Full question open (assets/shots/after-1440-more-question.png), its popover outlined grey on 'whole'; grey chips 'a click still answers' on 'click' and 'never the answer, before one' on 'never'
- voiceover: "Chapter three: step two. Hold the pointer on a card a moment, or press its More, and the fuller words open by the card; a click on the card still answers. Full question, by the heading, shows it whole. Before a quick check is answered, More never says whether an option is right."
- duration: 15.61s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: More open by a card; the full question open by the heading
- sfx: none

narrativeRole: Step 2: More on each card, and the question in full.
keyMessage: Chapter three:

## Frame 13 — Step 2's five choices that stop, in one pause

- scene: SPINE + FIVE CHOICE CARDS (data-call a9…a13), three and two, each on its number word: A9 'More shows on hover' · you'll notice it · toss-up; A10 'Opens after 450 ms' · you'll notice it; A11 'The heading, found' · toss-up; A12 'No More before an answer' · toss-up; A13 'The words ride on options' · hard-to-undo. No coral: the player rings the cards
- voiceover: "Step two's five choices that stop share one scene. One: More shows while the pointer is on a card, always on a touch screen. Two: a hover opens it after a moment, so a passing pointer flashes nothing. Three: the heading is the one marked as the question, else the largest words. Four: a quick check's card with no extra words has no More until you answer. Five: the player's file carries them."
- duration: 22.55s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-stop-step-2.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a9, a10, a11, a12, a13
- focal: five choice cards, one pause
- sfx: none

narrativeRole: Step 2's five choices that stop, in one pause.
keyMessage: Step two's five choices that stop share one scene.

## Frame 14 — Quick check: More before an answer

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the question heading (data-question) 'Not answered yet; card B has no extra words. B shows?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. A quick check, not answered yet. Card B has no extra words written for it. What does B show?"
- duration: 5.931s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 2
- quiz: k3
- question: A quick check, not answered yet. Card B has no extra words written for it. What does B show?
- option_a: No More, until you answer
- option_b: More, with why B is right or wrong
- option_c: More, with its label again
- option_a_more: The card shows only its label for now.
- option_b_more: B's More gives the reason for B, right or wrong.
- option_c_more: B's More repeats B's short label.
- answer: a
- explain: Before an answer, More shows only an option's own extra words; with none, the card has no More until you answer, and then it shows its why.
- option_a_why: With no extra words of its own, B has nothing to show that would not give the answer away, so its More waits for your answer.
- option_b_why: That would give the answer away before you pick; a card's why shows only once you answer.
- option_c_why: A More that repeats the label says nothing new, so the agent left it out.
- walk_me_through: Card B has no extra words of its own. Its why would say whether B is right, so it cannot show before you answer. Repeating the label adds nothing. So B has no More until you answer; then its why appears under it.
- explained_at: 13
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: More before an answer.
keyMessage: Quick check.

## Frame 15 — Step 3: plain words, and a word you can click

- chapter_start: Step 3: plain words you can click
- scene: SPINE + SCREENSHOT: kicker 'Step 3 · Plain words'; this build's player, the caption word 'scene' clicked, its meaning by it (assets/shots/after-1440-caption-word.png), the meaning outlined coral on 'means' (the one coral); four grey chips on their words: choice, label, chapter, scene; then 'sent: words looked up' on 'looked' and 'sent: videos watched' on 'watched'
- voiceover: "Chapter four: step three. The player now says the plain words: choice, label, chapter, scene. A caption word is dotted: click it, and the video pauses and shows, by the word, what it means, where it is explained, and a link to that scene. Your review also sends the words you looked up and the videos you watched."
- duration: 17.75s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: a caption word clicked: its meaning by the word, and where it is explained
- sfx: none

narrativeRole: Step 3: plain words, and a word you can click.
keyMessage: Chapter four:

## Frame 16 — Step 3's three choices that stop, in one pause

- scene: SPINE + THREE CHOICE CARDS (data-call a14, a16, a18), one row, each on its number word: A14 'The glossary's word first' · you'll notice it · toss-up; A16 'A caption word, clicked' · you'll notice it; A18 'Only a caption word pauses' · you'll notice it. No coral: the player rings the cards
- voiceover: "Step three's three choices that stop share one scene. One: each word comes from the glossary's on-screen column first. Two: a caption word is found where you click, in any of its forms. Three: only a caption word pauses the video; one in the player's own text leaves it playing."
- duration: 16.83s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-stop-step-3.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a14, a16, a18
- focal: three choice cards, one pause
- sfx: none

narrativeRole: Step 3's three choices that stop, in one pause.
keyMessage: Step three's three choices that stop share one scene.

## Frame 17 — Quick check: a word in the captions

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the question heading (data-question) 'Playing: you click “label” in the captions. Then?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. The video is playing, and you click the word label in the captions. What happens?"
- duration: 4.693s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-quiz-k4.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 3
- quiz: k4
- question: The video is playing, and you click the word label in the captions. What happens?
- option_a: It pauses and shows, by the word, what it means
- option_b: The Terms panel opens; the video plays on
- option_c: Nothing: only the player's own words open
- option_a_more: The video waits while you read the word's meaning beside it.
- option_b_more: The list of every word opens at the side, and the video keeps going.
- option_c_more: The captions' words cannot be clicked; only the player's text can.
- answer: a
- explain: A word clicked in the captions pauses the video and shows, by the word, what it means, where it is explained, and a link to that scene.
- option_a_why: A word clicked in the captions pauses the video and shows its meaning by the word, with where it is explained.
- option_b_why: A click on one caption word opens that word, by it, and pauses; the Terms panel is the list of every word.
- option_c_why: Step three made the captions' glossary words clickable, dotted where they are said.
- walk_me_through: Label is a glossary word, so the captions show it dotted. Clicking it pauses the video, since you read it over the frame it was said on. Its meaning opens by the word, with where it is explained and a link that plays that scene. A word in the player's own text shows its meaning too, but leaves the video playing.
- explained_at: 15
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a word in the captions.
keyMessage: Quick check.

## Frame 18 — The two choices that don't stop

- scene: SPINE + TWO CHOICE CARDS (data-call a15, a17): kicker 'Step 3 · No label, no pause'; card 'choice A15 · No step? None in the heading' on 'One'; card 'choice A17 · Looked up: its own meaning opened' on 'Two'; the chip 'Flag either one' outlined coral on 'flag' (the one coral)
- voiceover: "Two choices have no label, so they wait in this one list, where you can still flag either. One: a scene whose choices belong to no step leaves the step out of its heading. Two: a word counts as looked up only when its own meaning opens."
- duration: 13.099s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-group-3.html
- type: benefit_highlight
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy_group: a15, a17
- focal: two unlabelled choices, in one list
- sfx: none

narrativeRole: The two choices that don't stop.
keyMessage: Two choices have no label, so they wait in this one list, where you can still flag either.

## Frame 19 — What ran; flag a choice, or accept

- scene: STEPS + WHAT RAN: kicker 'As built · 3 steps, 20 choices'; left the three steps as rows (data-plan-step), each 'done'; right rows on their words: 'every test ✓' on 'every', '1 timing check: alone ✓' on 'timing', 'code check · 3 of 3 steps ✓' on 'second', 'not done · decision D-108 in force' on 'not'; on 'flag' the ask 'Flag a choice, or accept' outlined coral (the one coral); holds still
- voiceover: "What ran: every test, all passing; one timing check only when run alone. A second agent checked the code: all three steps held; its four findings were fixed or logged. Not done: decision D-108 stays in force until your review is recorded. Flag a choice, or accept."
- duration: 20s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-end.html
- type: cta
- beat: Focus
- blueprint: compose
- focal: three steps done, what ran, what is not done, the ask
- sfx: none

narrativeRole: What ran; flag a choice, or accept.
keyMessage: What ran:
