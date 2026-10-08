---
title: "Fewer, better stops: what was built"
format: 1920x1080
duration: 291s
message: "All three steps of the fewer-better-stops plan are built, and the answer-bar fix the owner asked for: the choices that stop in a step share one pause (23 pauses become 5), a late fix stops only choices that share one of its labels (one with no labels stops nothing directly), and the walkthrough check warns past twelve choices. Nine choices and one off-plan change: seven labelled choices stop in three pauses, two unlabelled wait in one list, and the off-plan change (memory's choice A12 left as it is, so decision D-122 and decision D-109 are both in force) pauses on its own."
arc: the words first (chapter, choice, label, accepted in a row, off-plan change), each said plainly where it is first used, with a quick check; then the steps in plan order, each with what changed, its one pause, and a quick check on the case just shown; the answer-bar fix with real before and after screenshots and its pause; what ran, and the ask
audience: the repo owner, who got all three of this plan's quick checks wrong and asked for plain words (D-127); assumes only the system video
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-25-fewer-better-stops
before: system | what a plan, a review and a walkthrough are
terms: chapter, choice, label, accepted in a row, off-plan change, scene, answer bar, late fix, part of the system
terms_check: strict
---

## Video direction

- PLAIN WORDS (decision D-127, approved during this build): what is seen and heard says choice (not call), label (not tag: "you'll notice it", "toss-up", "hard-to-undo", "off-plan change"), accepted in a row (not streak), late fix (not miss), chapter (not part), scene (not beat) or pause when it stops, answer bar (not band), and "the rest, in one list" for the choices that don't stop. Files, commands, tags in this storyboard and the decision log keep today's names. Keep it simple: no command names on screen or in the voice; the walkthrough check and "the command that says which choices stop" are described, not named.
- DEFINE BEFORE USE: each word is said plainly the first time, with a small 'means' card on screen and `- defines:` on that scene: chapter (1), choice and label (2), accepted in a row and off-plan change (3), scene (5), answer bar (6), late fix and part of the system (10). No id is said or shown without what it is ('choice A2', 'decision D-122'); where a choice can be described, it is described.
- ONE NUMBER FOR EACH THING, from `reel stops` now: answer-on-the-video 23 pauses → 5 (pauses of 4, 8, 4 and 6 choices, and its off-plan change); memory 14 → 6; this build nine choices and one off-plan change, seven labelled choices stopping, two unlabelled in one list; memory's walkthrough check 16, step 1 has 4; this build ten counted, no warning.
- THE PAUSES `reel stops` prints: step 1 `- autonomy: a2, a4` (7), with `- autonomy_group: a1, a5` at the end of its chapter (9); step 2 `- autonomy: a3` (11) and the off-plan change `- autonomy: d1` on its own (12); the answer bar's choices, outside the steps, `- autonomy: a6, a7, a8, a9` (17). Step 3 made no choice.
- THE OFF-PLAN CHANGE said plainly (12): memory's choice A12, accepted as decision D-122 ("a late fix with no labels stops the labelled choices on its part"), against this plan's decision D-109 ("such a late fix stops nothing"); both in force; accepting it leaves decision D-122 to be marked replaced by D-109 when the owner says so in the decision log (nothing marks it on its own); flagging it asks for the row rewritten now.
- REAL SCREENSHOTS, only of what this plan changed (the player's answering is being redesigned): one pause listing two choices, and memory's quick check at 1024 × 768 before (c2f7fd2's player cuts its question to 'runni…') and after (whole). Taken with the player served the way packages/player/test/band.spec.mjs serves videos; in assets/shots/.
- QUICK CHECKS (§7): one per chapter and one per step, each testing its scene's main idea on the exact case just shown, with no new fact, a `- walk_me_through:` and `- explained_at:`: k1 which of two choices stop (3), k2 eight choices in one step (5), k3 the old player late fix and a choice at ten in a row (10), k4 memory's sixteen choices (14). Option cards carry `data-option`.
- FOUR CHAPTERS, no separate openers (the step scenes carry `chapter_start` and say the chapter): the words (1–4), step 1 (5–9), step 2 (10–13), step 3 and the answer bar (14–18).
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions, so the lowest eighth (y ≥ 945) is empty.
- A spine of three ticks (steps 1–3), the live one coral, on step scenes; the ending's step rows carry `data-plan-step`. The look from `.reelplanning/theme/frame.md`; one coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still. No details.

## Frame 1 — Fewer, better stops, as built

- chapter_start: What was built, and the words for it
- defines: chapter
- scene: NO SPINE: kicker 'As built · fewer, better stops'; three step rows, each 'done' on its words; a fourth row '+ Questions never cut short' on 'fix', outlined coral (the one coral); the definition card 'chapter · one stretch of this video' on 'chapters', with the chip '4 chapters'
- voiceover: "The plan for fewer, better stops is built. All three of its steps landed, and so did one more fix you asked for: a question at the bottom of the video is no longer cut short. This video has four chapters: the words first, then the steps."
- duration: 13.291s
- transition_in: cut
- status: animated
- src: compositions/frames/01-built.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: three steps and the bar fix, all built
- sfx: none

narrativeRole: Fewer, better stops, as built.
keyMessage: The plan for fewer, better stops is built.

## Frame 2 — A choice, and a label

- defines: choice, label
- scene: DEFINITION CARDS: kicker 'The words · 1 of 2'; the card 'choice · decided by the agent alone' on 'choice'; its example chip 'e.g. A accepts · B flags' on 'example'; the figure '9' with 'choices' on 'nine'; the card 'label · a note: worth a look' on 'label'; three label rows landing on their words: you'll notice it, toss-up, hard-to-undo; 'toss-up' outlined coral (the one coral)
- voiceover: "A choice, here, is something the agent decided alone, that the plan did not spell out. For example: A accepts, and B flags. This build made nine. A label is a note on a choice you may want to look at. There are three: you'll notice it; toss-up, where the other way was nearly as good; and hard-to-undo, costly to change later."
- duration: 17.515s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-choice-label.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: what a choice is, and the three labels
- sfx: none

narrativeRole: A choice, and a label.
keyMessage: A choice, here, is something the agent decided alone, that the plan did not spell out.

## Frame 3 — Accepted in a row, and an off-plan change

- defines: accepted in a row, off-plan change
- scene: DEFINITION CARDS + TALLY: kicker 'The words · 2 of 2'; the card 'accepted in a row · at 10, no stop' on 'row'; three rows, one per label, each '0 of 10' on 'zero'; the tally '7 labelled · stop' on 'seven', '2 no label · don't' on 'two'; the card 'off-plan change · not what the plan said' on 'off-plan'; '1 off-plan · always stops' outlined coral on 'always' (the one coral)
- voiceover: "A labelled choice stops the video, so you can accept or flag it. Each label counts how often you accepted it in a row; at ten in a row, it stops no more. Every count is zero today, so all seven labelled choices stop, and the two without a label don't. One more label, off-plan change, means the agent did something other than the plan said. It always stops."
- duration: 20.352s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-row-offplan.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: every count at zero: seven labelled choices stop, two unlabelled don't, one off-plan change always stops
- sfx: none

narrativeRole: Accepted in a row, and an off-plan change.
keyMessage: A labelled choice stops the video, so you can accept or flag it.

## Frame 4 — Quick check: which choices stop

- scene: QUESTION + THREE OPTIONS: kicker 'Quick check · The words'; the question 'No label, and toss-up at 0 of 10: which stop?'; three option cards (data-option a–c) landing near the end of the question; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. Two choices from this build: one has no label, and one is labelled toss-up, accepted zero times in a row. Which of them stop the video?"
- duration: 8.533s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k1
- question: Two choices from this build: one has no label, and one is labelled toss-up, accepted zero times in a row. Which of them stop the video?
- option_a: Both of them
- option_b: Only the toss-up one
- option_c: Neither: it is at zero
- answer: b
- explain: A labelled choice stops until its label has been accepted ten times in a row, and toss-up is at zero; a choice with no label never stops.
- walk_me_through: Take the toss-up choice first: its label has been accepted zero times in a row, far short of ten, so it stops the video and waits for you. The choice with no label never stops; it waits in one list at the end of its chapter, where you can still flag it. So only the toss-up one stops.
- explained_at: 3
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: which choices stop.
keyMessage: Quick check.

## Frame 5 — Step 1: the choices that stop in a step share one pause

- chapter_start: Step 1: one pause per step
- defines: scene
- scene: SPINE + TWO TIMELINES: kicker 'Step 1 · One pause per step'; the card 'scene · a picture and a sentence or two' on 'scene'; 'Before' with 23 pause marks on 'twenty-three'; 'Now' with five marks labelled by step (4, 8, 4, 6 choices, and the off-plan change) on 'share'; on 'five' the chip '23 → 5 pauses' outlined coral (the one coral); on 'memory' the grey chip 'memory: 14 → 6'
- voiceover: "Chapter two: step one. A scene is one piece of the video: a picture and a sentence or two. Before, each choice that stopped had its own scene, so the answer-on-the-video walkthrough paused twenty-three times. Now the choices that stop in a step share one scene, and the video pauses once. An off-plan change still pauses on its own. So that walkthrough pauses five times, not twenty-three; memory's six, not fourteen."
- duration: 21.781s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: 23 pauses become 5
- sfx: none

narrativeRole: Step 1: the choices that stop in a step share one pause.
keyMessage: Chapter two:

## Frame 6 — One pause for several choices, in the player

- defines: answer bar
- scene: SPINE + SCREENSHOT: kicker 'Step 1 · In the player'; a real screenshot of the player pausing once for two choices (assets/shots/stop2.png, 1440 × 1000, answer-on-the-video's first two choices as band.spec.mjs's fixture makes them, taken the way band.spec.mjs serves videos); on 'answer bar' the card 'answer bar · where you answer' and the bar's region outlined coral (the one coral); on 'goes' the grey chip '1 pause'
- voiceover: "Here is that shared scene in the player, with two choices. The answer bar, along the bottom, lists each one: what it chose, instead of what, with its own Accept and Flag. The video goes on once each has an answer."
- duration: 13.28s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-stop-shot.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the bar listing two choices, each with its own Accept and Flag
- sfx: none

narrativeRole: One pause for several choices, in the player.
keyMessage: Here is that shared scene in the player, with two choices.

## Frame 7 — Step 1's two choices that stop, in one pause

- scene: SPINE + TWO CHOICE CARDS: kicker 'Step 1 · 2 choices · 1 pause'; card 'choice A2 · stored as a group marked stop' with 'instead of a new kind of list' and label 'toss-up', on 'First'; card 'choice A4 · Own words too' with 'instead of Accept and Flag only' and labels 'you'll notice it · toss-up', on 'Second'; on 'seven' the chip '7 answered in your own words' outlined coral (the one coral)
- voiceover: "Two choices in step one stop, in this one pause. First: the shared scene is stored as a group marked stop, not a new kind of list, so everything that reads groups already handles it. Second: each choice there also gets an Own words button, since you have answered seven choices in your own words."
- duration: 16.533s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-stop-step-1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a2, a4
- focal: two choices, one pause
- sfx: none

narrativeRole: Step 1's two choices that stop, in one pause.
keyMessage: Two choices in step one stop, in this one pause.

## Frame 8 — Quick check: eight choices in one step

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Step 2: 8 choices stop, nothing off-plan. Pauses?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. In the answer-on-the-video walkthrough, step two has eight choices that stop, and no off-plan change. Rebuilt, how many times does it pause in step two?"
- duration: 9.387s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 1
- quiz: k2
- question: In the answer-on-the-video walkthrough, step 2 has eight choices that stop, and no off-plan change. Rebuilt, how many times does it pause in step 2?
- option_a: Once: all eight share one scene
- option_b: Eight times, once per choice
- option_c: Twice: once per label
- answer: a
- explain: The choices that stop in a step share one scene, so step 2 pauses once, and the answer bar lists all eight.
- walk_me_through: Step 2 has eight choices that stop and no off-plan change. All eight share the step's one scene, so the video pauses once, at that scene's end. The answer bar lists the eight, each with its own Accept and Flag, and the video goes on after the eighth answer. An off-plan change would have added a second pause; step 2 has none.
- explained_at: 5
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: eight choices in one step.
keyMessage: Quick check.

## Frame 9 — Step 1's choices that don't stop

- scene: SPINE + TWO CHOICE CARDS: kicker 'Step 1 · No label, no pause'; the chip 'Flag either one' outlined coral on 'flag' (the one coral); card 'choice A1 · pauses listed by step' on 'One'; card 'choice A5 · A accepts, B flags' on 'Two'
- voiceover: "Two choices in step one have no label, so they don't stop: they wait in one list at the end of the chapter, where you can still flag them. One: the command that says which choices stop now lists the pauses by step. Two: at a pause, A accepts and B flags the next choice waiting."
- duration: 15.147s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-group-1.html
- type: benefit_highlight
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy_group: a1, a5
- focal: two unlabelled choices, in one list
- sfx: none

narrativeRole: Step 1's choices that don't stop.
keyMessage: Two choices in step one have no label, so they don't stop:

## Frame 10 — Step 2: a late fix stops choices of its own kind

- chapter_start: Step 2: a late fix stops its own kind
- defines: late fix, part of the system
- scene: SPINE + BEFORE/NOW: kicker 'Step 2 · A late fix stops its own kind'; the card 'late fix · let through by a review, changed later' on 'late fix'; 'part of the system' said with its example, the review player; 'Before' panel: 'player late fix · no labels' → 'every player choice stops' on 'every'; 'Now' panel: 'shares a label → stops' on 'share', 'no labels → stops nothing' on 'nothing', outlined coral (the one coral); grey chip 'decided · decision D-109' on 'answer'
- voiceover: "Chapter three: step two. A late fix is something a review let through that had to be changed later. Before, a late fix with no labels stopped every labelled choice on its part of the system, such as the review player: one old late fix there stopped every player choice. Now a late fix stops only choices that share one of its labels; with no labels, it stops nothing directly. That was your answer to the plan's first question."
- duration: 22.613s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the old player late fix: every player choice, then nothing
- sfx: none

narrativeRole: Step 2: a late fix stops choices of its own kind.
keyMessage: Chapter three:

## Frame 11 — Step 2's choice that stops

- scene: SPINE + CHOICE CARD + EXAMPLE: kicker 'Step 2 · 1 choice stops'; card 'choice A3 · the reason, in words' with 'instead of a short code' and label 'toss-up' on 'reason'; the example line 'toss-up: 0 of 10 accepted in a row' on 'zero', outlined coral (the one coral)
- voiceover: "One choice in step two stops. That command now gives the reason for each stop in words, such as: toss-up, zero of ten accepted in a row, rather than a short code."
- duration: 9.835s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-stop-step-2.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a3
- focal: the reason said in words
- sfx: none

narrativeRole: Step 2's choice that stops.
keyMessage: One choice in step two stops.

## Frame 12 — The off-plan change: two decisions that disagree

- scene: SPINE + TWO DECISION CARDS: kicker 'Step 2 · The off-plan change'; left card 'decision D-122 · memory's choice A12' reading 'no labels: stops choices on its part' on 'D-122'; right card 'decision D-109 · this plan' reading 'no labels: stops nothing' on 'D-109'; between them '≠' on 'opposite'; grey chips 'choice A12's row · left as is' on 'left' and 'both decisions in force' on 'both'; the line 'Accept → decision D-122 replaced' outlined coral on 'Accept' (the one coral); grey chip 'Flag → the row rewritten now' on 'Flag'
- voiceover: "And the off-plan change. Memory's choice A12 said: a late fix with no labels stops the labelled choices on its part of the system. You accepted it, so it became decision D-122. This plan's decision D-109 says the opposite: such a late fix stops nothing. The agent left choice A12's row as it was, since memory's walkthrough had already been reviewed, so both decisions are in force. Accept this change, and decision D-122 is to be marked replaced by D-109, when you say so in the decision log. Flag it to have the row rewritten now."
- duration: 34.703s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-offplan-d1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: d1
- focal: decision D-122 and decision D-109 side by side; accepting marks the older one replaced
- sfx: none

narrativeRole: The off-plan change: two decisions that disagree.
keyMessage: And the off-plan change.

## Frame 13 — Quick check: the old player late fix

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'Player late fix, no labels. A choice at 10 in a row: stops?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. The old late fix on the review player has no labels. A new player choice is labelled you'll notice it, accepted ten times in a row. Does it stop?"
- duration: 9.152s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 2
- quiz: k3
- question: The old late fix on the review player has no labels. A new player choice is labelled you'll notice it, accepted ten times in a row. Does it stop?
- option_a: Yes: the late fix is on its part of the system
- option_b: No: no shared label, and it has its ten
- option_c: Yes: every labelled choice stops
- answer: b
- explain: A late fix now stops only choices that share one of its labels; this one has none, and the choice's label has its ten, so it does not stop.
- walk_me_through: Start with the late fix: it is on the review player but has no labels, so it shares none with the choice and stops nothing. Then the choice's own label: you'll notice it has been accepted ten times in a row, the count at which a label stops no more. Nothing is left to stop it, so it waits in the list at the end of its chapter.
- explained_at: 10
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: the old player late fix.
keyMessage: Quick check.

## Frame 14 — Step 3: too many choices in one step is asked first

- chapter_start: Step 3, and the answer bar
- scene: SPINE + COUNTS: kicker 'Step 3 · Too many choices'; the chip 'past 12 → a warning' on 'twelve'; the rule 'memory: 16 · step 1 has 4' on 'sixteen', outlined coral (the one coral); grey chips 'still passes' on 'passes', 'this build: 10 · no warning' on 'ten', '5th in a step → ask you' on 'fifth', 'decided · decision D-110' on 'decided'
- voiceover: "Chapter four: step three, and the bar. The check on a finished walkthrough now counts all its choices, off-plan changes too, and warns past twelve, naming the busiest step. Memory's has sixteen, step one the most with four: it warns, though no step reaches five, and still passes. This build has ten: no warning. And at a step's fifth choice, the agent now stops and asks you, as you decided."
- duration: 21.141s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: memory's 16 choices warn; this build's 10 don't
- sfx: none

narrativeRole: Step 3: too many choices in one step is asked first.
keyMessage: Chapter four:

## Frame 15 — Quick check: sixteen choices, none at five

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Memory: 16 choices, no step over 4. The check?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. Memory's walkthrough has sixteen choices, and no step has more than four. What does the walkthrough check say?"
- duration: 6.272s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-quiz-k4.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 3
- quiz: k4
- question: Memory's walkthrough has sixteen choices, and no step has more than four. What does the walkthrough check say?
- option_a: Nothing: no step reaches five
- option_b: A warning: 16; step 1 has 4
- option_c: It fails
- answer: b
- explain: The warning counts the whole walkthrough, past twelve, whichever steps the choices are in; it warns and the check still passes.
- walk_me_through: The check adds up every choice in the walkthrough, off-plan changes too, whatever step they are in. Memory's has sixteen, past twelve, so it warns, and names step 1, the busiest with four. Five in one step is the agent's rule while it builds, not this check's. The warning never fails the check.
- explained_at: 14
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: sixteen choices, none at five.
keyMessage: Quick check.

## Frame 16 — The answer bar reads in full

- scene: TWO SCREENSHOTS, stacked: kicker 'The answer bar'; 'Before' the bar of c2f7fd2's player on memory's quick check at 1024 × 768, its question ending 'runni…', outlined grey on 'cut'; 'After · this build' the same bar with the whole question, outlined coral on 'wrap' (the one coral); grey chips 'at most 40% of the picture' on 'forty', 'the video keeps its size' on 'size'
- voiceover: "And the fix you asked for. Before, at this window size, the bar cut a quick check's question short. Now nothing in it is cut: the words wrap, and the bar grows up over the picture as far as they need, at most forty percent of it. The video keeps its size."
- duration: 15.52s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-bar.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: the same quick check before and after: cut short, then whole
- sfx: none

narrativeRole: The answer bar reads in full.
keyMessage: And the fix you asked for.

## Frame 17 — The bar's four choices that stop, in one pause

- scene: FOUR CHOICE ROWS: kicker 'The answer bar · 4 choices · 1 pause'; four numbered rows, each on its number word: 'choice A6 · one line, or wrap', 'choice A7 · at most 40%', 'choice A8 · a row per choice', 'choice A9 · a note fits its words'; the chip '1 pause' outlined coral on 'together' (the one coral)
- voiceover: "Four choices about the bar stop, together. One: short words keep one line; longer ones wrap. Two: the bar grows to at most forty percent of the picture. Three: a pause lists one row per choice. Four: a note field is as wide as its words."
- duration: 15.59s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-stop-bar.html
- type: cta
- beat: Focus
- blueprint: compose
- autonomy: a6, a7, a8, a9
- focal: four choices about the bar, one pause
- sfx: none

narrativeRole: The bar's four choices that stop, in one pause.
keyMessage: Four choices about the bar stop, together.

## Frame 18 — What ran; flag a step, or accept

- scene: STEPS + WHAT RAN: kicker 'As built · 3 steps, 9 choices, 1 off-plan'; left the three steps as rows (data-plan-step), each 'done'; right rows on their words: 'every test ✓' on 'every', 'code check · 3 of 3 steps ✓' on 'second', 'not done · 2 things' on 'not'; on 'flag' the ask 'Flag a step, or accept' outlined coral (the one coral); holds still
- voiceover: "What ran: every test, all passing. A second agent checked the code: all three steps and every decision hold. Not done: memory's choice A12 is not rewritten, and videos already built keep their old pauses until rebuilt. Flag a step, or accept."
- duration: 18.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-end.html
- type: cta
- beat: Focus
- blueprint: compose
- focal: three steps done, what ran, the ask
- sfx: none

narrativeRole: What ran; flag a step, or accept.
keyMessage: What ran:
