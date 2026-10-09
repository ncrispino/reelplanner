---
title: "Answer on the video itself, and edit the record in place"
format: 1920x1080
duration: 210s
message: "Two independent changes: you answer on the frame (steps 1 and 2: the frame's option cards take the click, and the sheet stops repeating the question), and the record is editable where it is listed (step 3). Step 4 checks both on the videos already on the review page. One open question: where the answers the frame can't take go (step 2), recommend A, a thin strip under the video."
arc: how-to-process: the problem drawn (the sheet over the frame, the record that sends you back), what changes before how (two tracks and a check), then the steps in plan order with their quick checks and the one decision, in four parts
audience: the repo owner reviewing reelplanning's own plan on the review page; they know the player and its question sheet well
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-24-answer-on-the-video
---

## Video direction

- A SERIES OF FOUR SHORT PARTS (style guide §1): `chapter_start` on frames 1, 6, 11 and 17. Part 1 is the problem and what changes, before any how: the sheet over the frame (frames 1–2), the record that sends you back (frame 3), then the overview (frame 4): two changes, each labelled with its steps, independent of each other, then step 4 that checks both. Part 2: step 1 and two quick checks. Part 3: step 2, a quick check, question 1 and its one branch. Part 4: step 3, a quick check, step 4, a quick check, and the resolved plan.
- WHAT TO DRAW (style guide §5): the plan decides how something looks, so the stage is the review player itself, drawn as a prototype: a 16:9 stage holding a real frame (the revise-loop video's Choice 2, "What may a run nobody is watching do?", with its four option cards), and over it the question sheet as the player draws it today (`.decision.sheet`: the kicker, the question again, four option rows with their key squares and reasons, "Answer in my own words", "Explain this more", a note field, "Show the frame"). After step 2 the same frame sits whole with a thin strip under it. The record is drawn as the player's record panel (Decisions, Comments). No node graph: nothing in this plan moves data between parts.
- The persistent anchor is a spine of four ticks at the rail's slot rows (steps 1–4), the live one coral, the done ones grey; openers, closers and the ending show the four-slot rail itself.
- One question, `q1` (step 2), options A–C, recommended A. One branch beat, for C only: C is the one option that changes the plan's shape (clicking the frame's cards is no longer needed, and step 2 restyles the sheet instead of removing it). A and B keep the plan's shape, so choosing either goes straight on (the player's resumeAt).
- Five quick checks (style guide §7), each a prediction whose wrong options are what a reasonable reviewer might expect: k1 a click on a pick-all question's card (it ticks and waits for Confirm, not answers); k2 an older frame with no `data-option` (matched by card order, not the sheet); k3 a call on the agent's choice (Accept and Flag in the strip, not a card); k4 an edit after the review is sent ("Send the change", not saved quietly, not locked); k5 where step 4 checks the record's edits (the export the Finish panel sends). Each answer is also said in the next beat (frames 10, 12, 14, 20), so the video carries the whole plan for someone who reads no explain line.
- Dependencies said only where they exist: step 2 "needs step one", step 4 "needs steps one to three"; step 3 "stands alone".
- Decisions in force get no question: a small `decided · D-085` tag on step 1 (one attribute on new frames) and `decided · D-084` on step 2 (a call's Accept and Flag move into the strip); D-083 is the quick-check rule this video follows. D-004, D-005, D-021, D-024, D-081, D-082 are unchanged and not narrated.
- New option cards in this video carry `data-option` (and `data-plan-option`), as step 1 asks of new frames.
- Built from the project record: names from `glossary.md` (the review player, the plan-to-video skill); the look from `.reelplanning/theme/frame.md`. No details.
- Palette: paper ground, ink voice, coral as the single signal per frame. Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.

## Frame 1 — The sheet asks again

- chapter_start: The problem, and what changes
- scene: PROTOTYPE, spine hidden: kicker 'Today · a question waits'; the player's stage (1280×720) holding the revise-loop video's Choice 2 frame: its kicker, the question 'What may a run nobody is watching do?' and four option cards (As now, Auto mode, Everything, A short list); on 'sheet slides up' the question sheet slides up from the stage's bottom edge and covers its lower two thirds: 'Choice 2 · step 6', the question again, four rows A–D with key squares and reasons, 'Answer in my own words', 'Explain this more', a note field, 'Show the frame'; on 'again' the sheet's question takes the coral underline (the one coral)
- voiceover: "When the video stops at a question, a sheet slides up over the frame and asks it again."
- duration: 5.64s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete failure the reviewer has seen
- beat: Recognition
- blueprint: compose
- focal: the sheet sliding over the frame
- roles: stage = the player · sheet = the problem · coral = the question asked again
- sfx: none

narrativeRole: The sheet asks again.
keyMessage: A question you can already see is asked a second time, over the frame.

Scene 1: the stage and its frame.
Scene 2: on 'sheet slides up' the sheet rises over the lower two thirds.
Scene 3: on 'again' the sheet's question is underlined in coral. Held.

## Frame 2 — Asked twice, and covered

- scene: PROTOTYPE, same stage with the sheet up: on 'question' a grey bracket joins the frame's question and the sheet's question with the chip 'asked twice'; on 'four options as cards' the four cards' visible tops are outlined; on 'covers the cards' their hidden lower halves are drawn through the sheet as dashed coral outlines with the chip 'covered' (the one coral); on 'you answer in the sheet' the sheet's row B takes its filled key square
- voiceover: "The frame already shows the question, and its four options as cards. The sheet repeats both, smaller and busier, and covers the cards it asks about. So you answer in the sheet, not on the thing you are looking at."
- duration: 12.35s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-covered.html
- type: pain_point
- persuasion: The duplication, made visible
- beat: Tension
- blueprint: compose
- focal: the cards covered by the sheet that repeats them
- roles: bracket = asked twice · dashed outlines = the covered cards · coral = covered
- sfx: none

narrativeRole: Asked twice, and covered.
keyMessage: The sheet repeats what the frame shows and hides the cards it asks about.

Scene 1: on 'question' the bracket and 'asked twice'.
Scene 2: on 'cards' the visible card tops outline.
Scene 3: on 'covers' the dashed coral outlines through the sheet and 'covered'.
Scene 4: on 'answer in the sheet' row B's key fills. Held.

## Frame 3 — The record sends you back

- scene: PROTOTYPE, no spine: the player's record panel (1100 wide): header 'Record · 1/4 decided · 1 comment'; Decisions: 'Choice 2 · step 6 · 4:20', 'What may a run nobody is watching do?', 'Auto mode, inside the sandbox' with its 'change' link; Comments: '4:21', 'the strip should say what the key does'; under the panel the video's timeline (0:00–7:08) with the question's diamond at 4:20 and the playhead at 5:40; on 'change' the link takes the coral outline (the one coral); on 'jumps back' the playhead slides back to 4:12 with the chip '8 s before'; on 'asks it again' the answer in the panel empties to 'Not yet'
- voiceover: "And the record, the list of everything you have said, sends you back to the video to change it. Press change on an answer, and the video jumps back eight seconds before its question, and asks it again."
- duration: 11.45s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-record.html
- type: pain_point
- persuasion: A worked example with real values
- beat: Tension
- blueprint: compose
- focal: the playhead jumping back from the record
- roles: record = the list · timeline = the video · coral = change
- sfx: none

narrativeRole: The record sends you back.
keyMessage: Changing what is on the record means going back into the video.

Scene 1: the record panel and the timeline land.
Scene 2: on 'change' the link lights.
Scene 3: on 'jumps back' the playhead slides to 4:12; '8 s before'.
Scene 4: on 'asks it again' the answer empties. Held.

## Frame 4 — What changes: two changes, and a check

- scene: TRACKS, no spine: kicker 'What changes · 2 tracks'; two lanes stacked: lane 1 'You answer on the frame' with 'Step 1' → 'Step 2' and 'needs' on the arrow; lane 2 'The record is editable' with 'Step 3'; each lane lands on the words that name it, its step tiles on their numbers; on 'neither needs the other' both lanes take 'independent'; on 'Step four' the check bar lands under both, 'Check on the videos already there' with 'Step 4' and 'needs 1–3', a bracket from both lanes into it, its border coral (the one coral)
- voiceover: "So the plan makes two changes, and neither needs the other. You answer on the frame: steps one and two. The record becomes editable where it is listed: step three. Step four then checks both, on the videos already on the review page."
- duration: 14.51s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-overview.html
- type: product_intro
- persuasion: The whole plan before the first step
- beat: Overview
- blueprint: compose
- focal: two separate lanes, then the check that joins them
- roles: lanes = the two changes · step tiles = which steps carry each · bar = the check · coral = the check bar
- sfx: none

narrativeRole: What changes: two changes, and a check.
keyMessage: Two changes that stand alone, and one step that checks them together.

Scene 1: kicker; 'independent' chips wait.
Scene 2: on 'answer on the frame' lane 1; 'Step 1', 'needs', 'Step 2' on 'one and two'.
Scene 3: on 'record' lane 2; 'Step 3' on 'three'.
Scene 4: on 'Step four' the bar and the bracket; coral. Held 1.5 s.

## Frame 5 — Next: part 2

- scene: RAIL: kicker 'Part 1 of 4 · done'; the four-slot rail filled with the step titles, lane labels in grey to its left ('on the frame' beside 1–2, 'the record' beside 3, 'the check' beside 4); on 'part two' slot 1 takes the coral outline and the hero 'Next · The cards answer' lands right
- voiceover: "Next, part two: the frame's cards answer."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-closer-1.html
- type: benefit_highlight
- persuasion: What is next
- beat: Closer
- blueprint: compose
- focal: slot 1
- roles: rail = the plan · coral = the next step
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, the cards answer.

Scene 1: the rail settles.
Scene 2: on 'part two' slot 1 lights; the hero lands. Held.

## Frame 6 — Part 2 of 4

- chapter_start: Step 1: the frame's cards answer
- scene: RAIL: kicker 'Part 2 of 4'; the rail with slot 1 filled and coral; hero 'Click an option on the frame'; slots 2–4 dashed
- voiceover: "Part two of four: step one, clicking an option on the frame."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-opener-2.html
- type: product_intro
- persuasion: Where we are
- beat: Opener
- blueprint: compose
- focal: slot 1
- roles: rail = the plan · coral = step 1
- sfx: none

narrativeRole: Part 2 of 4.
keyMessage: Step one.

Scene 1: kicker, rail, slot 1 fills.
Scene 2: the hero. Held.

## Frame 7 — Step 1: click an option on the frame to answer

- plan_step: 1
- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Click an option on the frame'; spine tick 1 coral; the stage (1200×675) holding the Choice 2 frame, no sheet; on 'clickable' the four cards take a pointer-hover edge; on 'Hover or keyboard focus lights a card' card C takes an ink focus ring; on 'a click answers' card B takes the coral border (the one coral) and the chip 'your answer' under it, and the chip '= key B'; on 'quick check' the grey chip 'quick checks too'; on 'data option' a code chip under card B, 'data-option="b"', joined to it by a line, and the grey tag 'decided · D-085'
- voiceover: "Step one: while a question waits, the frame's option cards are clickable. Hover or keyboard focus lights a card, and a click answers exactly as the A to D keys do. A quick check's options work the same way. The player already reads each frame's page, so this is the player's work, not the frames': new frames mark each card with one attribute, data option, and nothing more."
- duration: 20.437s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-step-1.html
- type: feature_showcase
- persuasion: The mechanism on the real frame
- beat: Step
- blueprint: compose
- focal: card B answered by a click
- roles: stage = the player · cards = what you click · code chip = the one attribute · coral = the clicked card
- sfx: none

narrativeRole: Step 1: click an option on the frame to answer.
keyMessage: The frame's own cards take the answer, and new frames add one attribute.

Scene 1: kicker, spine, the stage and its frame.
Scene 2: on 'clickable' the cards' edges; on 'focus' card C's ring.
Scene 3: on 'click answers' card B coral, 'your answer', '= key B'.
Scene 4: on 'quick check' the chip; on 'data option' the code chip and the D-085 tag. Held.

## Frame 8 — Quick check: a click on a pick-all question

- plan_step: 1
- scene: SPINE + PROTOTYPE + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Pick-all: you click card B. Then?'; a small stage with a pick-all frame, 'Which pages ship at launch?', three cards with tick boxes (Albums, Lyrics, Tour dates), card B under the pointer ring; three option cards in a row, each on its word: A 'B is picked; it plays on', B 'B is ticked; waits for Confirm', C 'Nothing: the sheet answers it'; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. A pick-all question waits, and you click card B on the frame. What happens?"
- duration: 5.65s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-quiz-pickall.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- quiz: k1
- question: A pick-all question waits, and you click card B on the frame. What happens?
- option_a: B is picked, and the video plays on
- option_b: B is ticked, and the player waits for Confirm
- option_c: Nothing: a pick-all question is still answered in the sheet
- answer: b
- explain: A click does exactly what the key does: on a pick-all question it ticks the card, and Confirm sends the picks, after which the summary frame plays (D-004).
- focal: the pick-all frame and the three predictions
- roles: small stage = the worked example · option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: a click on a pick-all question.
keyMessage: Quick check.

Scene 1: kicker, the question, the small stage.
Scene 2: on 'What happens' the three option cards. Held for the pause.

## Frame 9 — Quick check: an older frame

- plan_step: 1
- scene: SPINE + PROTOTYPE + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'An older frame: you click card 2'; a small stage with a frame built before step 1: three cards, each with the grey mono chip 'no data-option' under the row; on 'second card' card 2 takes the pointer ring; three option cards, each on its word: A 'It answers, by card order', B 'Nothing: it keeps today's sheet', C 'The build asks for a rebuild'; nothing marked
- voiceover: "Quick check. This frame was built before step one, so its cards carry no data option. You click its second card. What happens?"
- duration: 8.01s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-quiz-older.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- quiz: k2
- question: A frame built before step 1 has option cards with no data-option. You click its second card. What happens?
- option_a: It answers B: the cards are matched by their order
- option_b: Nothing: it keeps today's sheet
- option_c: The build stops and asks for the frame to be rebuilt
- answer: a
- explain: Older frames are matched by the order of their option cards; only a frame with no cards to match keeps today's sheet.
- focal: the older frame and the three predictions
- roles: small stage = the worked example · option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: an older frame.
keyMessage: Quick check.

Scene 1: kicker, the question, the small stage; on 'no data option' the chips.
Scene 2: on 'second card' the ring; on 'What happens' the three option cards. Held for the pause.

## Frame 10 — Next: part 3

- scene: THREE CASES + RAIL: kicker 'Step 1 · done'; spine tick 1 grey; three small frames in a row, each with its outcome under it: 'new frame' with 'data-option' → 'answers'; 'older frame' with 'card order' → 'answers'; 'no cards' → 'today's sheet'; each case lands on its words; on 'part three' the hero 'Next · What is left of the sheet' with slot 2's tick coral (the one coral)
- voiceover: "An older frame is matched by the order of its cards; a frame with no cards to match keeps today's sheet. Next, part three: what is left of the sheet."
- duration: 9.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-closer-2.html
- type: benefit_highlight
- persuasion: The step's result, in three cases
- beat: Closer
- blueprint: compose
- focal: the three cases
- roles: small frames = cases · coral = what is next
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Every frame answers by click, except one with no cards.

Scene 1: on 'older frame' cases 1 and 2 land; on 'no cards' case 3.
Scene 2: on 'part three' the hero and tick 2. Held.

## Frame 11 — Part 3 of 4

- chapter_start: Step 2: the thin strip, and question 1
- scene: RAIL: kicker 'Part 3 of 4'; slot 1 filled grey, slot 2 filled and coral; hero 'The sheet stops repeating'; the chip 'Choice 1 · open' under the hero
- voiceover: "Part three of four: step two, and the plan's one question."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-opener-3.html
- type: product_intro
- persuasion: Where we are
- beat: Opener
- blueprint: compose
- focal: slot 2
- roles: rail = the plan · coral = step 2
- sfx: none

narrativeRole: Part 3 of 4.
keyMessage: Step two and the one question.

Scene 1: kicker, rail, slot 2 fills.
Scene 2: the hero and the chip. Held.

## Frame 12 — Step 2: the sheet stops repeating the question

- plan_step: 2
- scene: SPINE + PROTOTYPE, before → after on one stage: kicker 'Step 2 · The sheet stops repeating'; the chip 'needs step 1'; spine tick 2 coral; the stage with today's sheet up; on 'no longer repeated' the sheet slides down and away, and the frame stands whole; on 'What is left' a thin strip lands under the stage, its border coral (the one coral); its items land on their words: 'Own words O', 'Explain this more ?', 'Add a note', 'Confirm ↵' (greyed: pick-all only), 'Show the frame'; on 'question one' the grey chip 'where: choice 1' under the strip; the tag 'decided · D-084'
- voiceover: "Step two needs step one: once the cards answer, the sheet no longer has to. The question and its options are no longer repeated over the frame. What is left is what the frame cannot do: answer in your own words, explain this more, a note on your answer, confirm for a pick-all question, and show the frame, to look without answering. They sit together in one place; where it goes is question one."
- duration: 20.779s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-step-2.html
- type: feature_showcase
- persuasion: Before and after on the same stage
- beat: Step
- blueprint: compose
- focal: the frame whole, and the strip under it
- roles: stage = the player · strip = what is left · coral = the strip
- sfx: none

narrativeRole: Step 2: the sheet stops repeating the question.
keyMessage: The frame stays whole; what the frame can't take goes in one small place.

Scene 1: kicker, 'needs step 1', the stage with the sheet up.
Scene 2: on 'no longer repeated' the sheet leaves.
Scene 3: on 'What is left' the strip; each item on its word.
Scene 4: on 'question one' the chip. Held.

## Frame 13 — Quick check: a call on the agent's choice

- plan_step: 2
- scene: SPINE + PROTOTYPE + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'A call stops the video. Then?'; a small stage with a walkthrough's call frame: 'Call · step 3', 'chose: a heartbeat every 2 s', 'instead of: every 10 s' (no option cards), with the thin strip under it; three option cards, each on its word: A 'Click its card on the frame', B 'Today's sheet, kept for calls', C 'Accept or Flag in the strip'; nothing marked
- voiceover: "Quick check. In a walkthrough, the video stops on one of the agent's calls. How do you accept it, or flag it?"
- duration: 5.99s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-quiz-call.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- quiz: k3
- question: In a walkthrough, the video stops on one of the agent's calls. How do you accept it, or flag it?
- option_a: Click its card on the frame, as for a question
- option_b: In today's sheet, which calls keep
- option_c: Accept or Flag in the strip, or the keys A and B
- answer: c
- explain: A call has no cards to click, so its Accept and Flag go in the same strip as the rest of what the frame can't take, with the keys A and B as now (D-084).
- focal: the call frame and the three predictions
- roles: small stage = the worked example · option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: a call on the agent's choice.
keyMessage: Quick check.

Scene 1: kicker, the question, the call frame.
Scene 2: on 'accept it' the three option cards. Held for the pause.

## Frame 14 — Choice 1: where do the answers the frame can't take go?

- plan_step: 2
- scene: SPINE + THREE PROTOTYPES side by side under the question 'Where do the answers the frame can't take go?': A 'A thin strip' — the frame whole, the strip under it, cost 'frame whole'; B 'A corner card' — the frame with a compact card over its top-right corner, cost 'covers a corner'; C 'Keep the sheet' — the frame with a lighter, smaller sheet over its lower third, cost 'no clicking cards'; on 'accept and flag' the strip in A shows 'Accept A · Flag B'; each option lands on its letter, its cost on its cost words; on 'I recommend' A takes the coral border and 'recommended' lands under it (the one coral); all three stay on screen together
- voiceover: "A call's accept and flag go in that same place, with the keys A and B as now. So where does it go? A: a thin strip under the video, never over the frame. B: a small card over the frame's top-right corner: closer to where you look, but it covers a little. C: keep the sheet, only lighter and smaller, with no clicking on the cards. I recommend A: the frame stays whole, and what is left is what you reach for least. Which one?"
- duration: 21.504s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-decision-q1.html
- type: cta
- persuasion: Comparison of three looks + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- decision: q1
- question: Where do the answers the frame can't take go?
- option_a: A thin strip under the video
- option_b: A small card in a corner of the frame
- option_c: Keep the sheet, restyled
- why_a: Own words, Explain this more, a note, Confirm, Show the frame, and a call's Accept and Flag, on one line under the frame, never over it. The frame is whole.
- why_b: The same things in a compact card over the frame's top-right corner. Closer to where you look, but it covers a little of the frame.
- why_c: No clicking on the frame's cards is needed; the sheet stays and only gets lighter and smaller.
- recommended: a
- focal: the three prototypes
- roles: prototypes = the options · spine = anchor · coral = the recommendation
- sfx: none

narrativeRole: Choice 1: where do the answers the frame can't take go?
keyMessage: I recommend A: the frame stays whole, and what is left is what you reach for least.

Scene 1: kicker 'Choice 1 · Step 2', the question; on 'accept and flag' nothing moves yet.
Scene 2: on 'A:' prototype A; on 'B:' prototype B; on 'C:' prototype C; each cost on its words.
Scene 3: on 'I recommend' A's border turns coral; 'recommended'. Held.

## Frame 15 — If C: the sheet stays, restyled

- plan_step: 2
- branch: q1=c
- scene: RAIL, the plan under C: kicker 'If C · Keep the sheet'; the four steps as a list; on 'restyles the sheet' step 2's title changes to 'Restyle the sheet' with the coral outline (the one coral); on 'no longer needed' step 1 dims with the grey chip 'not needed'; steps 3 and 4 unchanged
- voiceover: "With C, step two restyles the sheet instead: lighter and smaller, still over the frame. Clicking the frame's cards is no longer needed."
- duration: 8.229s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-branch-c.html
- type: benefit_highlight
- persuasion: What the choice changes in the plan
- beat: Branch
- blueprint: compose
- focal: step 2 retitled, step 1 not needed
- roles: step list = the plan under C · coral = the changed step
- sfx: none

narrativeRole: If C: the sheet stays, restyled.
keyMessage: C drops the clicking and keeps a lighter sheet.

Scene 1: kicker, the list.
Scene 2: on 'restyles' step 2 changes; on 'no longer needed' step 1 dims. Held.

## Frame 16 — Next: part 4

- scene: RAIL: kicker 'Part 3 of 4 · done'; slots 1–2 filled, slot 2 carrying the choice tag (the player writes the pick; 'Thin strip' until then); on 'part four' slot 3 takes the coral outline and the hero 'Next · The record, and the check'
- voiceover: "Next, part four: the record, and the check."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-closer-3.html
- type: benefit_highlight
- persuasion: What is next
- beat: Closer
- blueprint: compose
- focal: slot 3
- roles: rail = the plan · coral = the next step
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, the record and the check.

Scene 1: the rail with the choice.
Scene 2: on 'part four' slot 3 lights; the hero. Held.

## Frame 17 — Part 4 of 4

- chapter_start: Steps 3 and 4: edit the record, and check it all
- scene: RAIL: kicker 'Part 4 of 4'; slots 1–2 filled grey, slots 3–4 filled, slot 3 coral; hero 'Edit the record in place'
- voiceover: "Part four of four: steps three and four."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-opener-4.html
- type: product_intro
- persuasion: Where we are
- beat: Opener
- blueprint: compose
- focal: slot 3
- roles: rail = the plan · coral = step 3
- sfx: none

narrativeRole: Part 4 of 4.
keyMessage: Steps three and four.

Scene 1: kicker, rail, slots 3 and 4 fill.
Scene 2: the hero. Held.

## Frame 18 — Step 3: edit the record where it is listed

- plan_step: 3
- scene: SPINE + PROTOTYPE: kicker 'Step 3 · Edit the record in place'; spine tick 3 coral; the record panel with five rows, one per kind: a decision 'Choice 2 · Auto mode', a call 'A7 · heartbeat every 2 s · Accepted', a comment '4:21 · the strip should say what the key does', a mark '5:02 · stroke · step 8', a quick check 'k1 · B · note'; each row's edit lands on its words, and the coral outline moves to it (one coral at a time): the decision's answer becomes a small picker, 'Auto mode' → 'A short list', with the grey chip 'routes as a fresh answer'; the call's 'Accepted' switches to 'Flagged'; the comment's words take 'edit' and 'remove'; the mark's the same; the quick check's note takes 'edit', its answer 'B' greys with the chip 'stays'
- voiceover: "Step three stands alone: edit the record where it is listed. Each item gets its own small edit. Change a decision's answer right there, and the video routes as a fresh answer would. Switch a call's verdict. Edit the words of a comment, or of a mark, or remove it. Edit a quick check's note; its first answer stays as it is."
- duration: 17.899s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-step-3.html
- type: feature_showcase
- persuasion: Every kind of item, edited where it is listed
- beat: Step
- blueprint: compose
- focal: the record's rows, each with its edit
- roles: record = the list · edits = the change · coral = the edit in play
- sfx: none

narrativeRole: Step 3: edit the record where it is listed.
keyMessage: Every item on the record can be changed or removed where it is; a quick check's first answer stays.

Scene 1: kicker, spine, the record.
Scene 2: on 'decision's answer' the picker; on 'fresh answer' its chip.
Scene 3: on 'verdict' the switch; on 'comment's words' edit/remove; on 'mark's' the same.
Scene 4: on 'quick check's note' edit; on 'stays' the chip. Held.

## Frame 19 — Quick check: an edit after sending

- plan_step: 3
- scene: SPINE + PROTOTYPE + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Sent, then edited: what happens?'; a small record panel whose header reads 'Review sent · 5:58'; the comment row '4:21 · the strip should say what the key does' with its text being edited (a caret after 'key does'); three option cards, each on its word: A 'Saved; goes with the next review', B 'Offered as “Send the change”', C 'Nothing: a sent record is locked'; nothing marked
- voiceover: "Quick check. You have sent your review. Now you edit a comment's words in the record. What happens?"
- duration: 5.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-quiz-sent.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- quiz: k4
- question: You have sent your review. Now you edit a comment's words in the record. What happens?
- option_a: The edit is saved, and goes with your next review
- option_b: It is offered as "Send the change"
- option_c: Nothing: a sent review's record is locked
- answer: b
- explain: After a review is sent, any edit in the record is offered as "Send the change", the way a new comment already is.
- focal: the edited comment and the three predictions
- roles: record = the worked example · option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: an edit after sending.
keyMessage: Quick check.

Scene 1: kicker, the question, the record with 'Review sent'.
Scene 2: on 'edit a comment's words' the caret; on 'What happens' the three option cards. Held for the pause.

## Frame 20 — Step 4: check it on the videos already there

- plan_step: 4
- scene: SPINE + GRID: kicker 'Step 4 · Check on the videos already there'; spine tick 4 coral; first, on 'send the change', the comment row from frame 19 with its button 'Send the change' (coral), which then settles grey; the chip 'needs steps 1–3'; a grid of three rows ('Plan videos', 'Walkthroughs', 'System video') by three columns ('Light', 'Dark', 'Phone'), each cell a small frame thumbnail in that look (the dark cells on the dark ground, the phone cells narrow); each row lands on its words, each column on its; the chip 'clicks only' above the grid on 'clicks only'
- voiceover: "An edit after sending is offered as send the change, the way a new comment already is. Step four needs steps one to three. Every video on the review page is played through its questions with clicks only: the plan videos, the walkthroughs and the system video, in light and dark, and at phone width."
- duration: 16.299s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-step-4.html
- type: feature_showcase
- persuasion: The check's coverage, as a grid
- beat: Step
- blueprint: compose
- focal: the grid of videos by look
- roles: grid = what step 4 plays · coral = Send the change, then the grid's frame
- sfx: none

narrativeRole: Step 4: check it on the videos already there.
keyMessage: Every video, every question, clicks only, in light, dark and at phone width.

Scene 1: on 'send the change' the row and its button.
Scene 2: on 'Step four needs' the chip; the row settles.
Scene 3: on 'clicks only' the chip; rows on their names; columns on 'light', 'dark', 'phone width'. Held.

## Frame 21 — Quick check: where the record's edits are checked

- plan_step: 4
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 4'; the question 'Your record edits: where checked?'; three option cards, each on its word, each with a small drawing of the place: A 'In the export the Finish panel sends' (the Finish panel's export), B 'In the record, as you edit' (a record row), C 'Nowhere: step 4 is clicks only' (a click ring); nothing marked
- voiceover: "Quick check. Step four also checks your edits to the record. Where does it look?"
- duration: 4.81s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-quiz-export.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- quiz: k5
- question: Step 4 also checks your edits to the record. Where does it look?
- option_a: In the export the Finish panel sends
- option_b: In the record on the page, as you edit
- option_c: Nowhere: step 4 checks clicks only
- answer: a
- explain: Step 4 checks the record's edits in the export the Finish panel sends, which is what reaches the agent, not only what the record shows.
- focal: the three predictions
- roles: option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: where the record's edits are checked.
keyMessage: Quick check.

Scene 1: kicker, the question.
Scene 2: on 'Where does it look' the three option cards. Held for the pause.

## Frame 22 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram: kicker 'The plan · 4 steps, 1 question'; steps 1–4 as a list at reading size, each with its track in grey to its left ('on the frame' for 1 and 2, 'the record' for 3, 'the check' for 4); step 1 carries 'decided · D-085', step 2 the choice tag 'Thin strip' (the recommended default; the player fills the reviewer's pick); 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: two changes in four steps, and one question. Answer it, draw on any step to leave a note, or approve. The narration and visuals are AI-generated."
- duration: 12.75s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-resolved.html
- type: cta
- plan_questions: 1
- persuasion: Resolved plan + call to action
- beat: Resolve
- blueprint: compose
- focal: the four steps, their tracks and the one choice
- roles: step list = foreground · paper ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: Two changes in four steps, and one question.

Scene 1: the list settles in.
Scene 2: held dead still.
