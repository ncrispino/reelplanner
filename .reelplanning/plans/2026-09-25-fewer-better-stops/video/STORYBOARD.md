---
title: "The right calls stop, and the walkthrough stays short"
format: 1920x1080
duration: 220s
message: "Three independent changes: the calls that stop in a step share one beat (step 1), a miss stops calls of its own kind (step 2, question 1: what a miss with no tags may stop, recommend A, nothing directly), and too many calls in one step is asked, not made (step 3, question 2: what the implementer does at a step's fifth call, recommend A, ask before going on)."
arc: the problem drawn with this repo's own numbers (23 of 23 stops, streaks at 0, one old miss reaching every player call, every plan past a dozen calls), what changes before how (three independent steps), then the steps in plan order with a quick check each and the two decisions, in four parts
audience: the repo owner reviewing reelplanning's own plan on the review page; they know walkthroughs, calls, tags and the answer band well
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-25-fewer-better-stops
---

## Video direction

- SHORT (style guide §1, "Length"): aim three and a half minutes, four parts of about a minute or less. No closers: each part's opener shows the rail as resolved so far; the last part ends on the resolved plan.
- A SERIES OF FOUR PARTS: `chapter_start` on frames 1, 5, 8 and 15. Part 1: the problem (frames 1–3) and what changes (frame 4), before any how. Part 2: step 1 and k1. Part 3: step 2, k2, question 1 and its three branches. Part 4: step 3, k3, question 2 and its two branches, the resolved plan.
- WHAT TO DRAW (style guide §5): nothing in this plan moves data between parts, so no node graph. Each beat draws the thing it changes with this repo's real values: a walkthrough's timeline with its pauses (frames 1, 6), the tag streaks and the one miss (frame 2), the call counts of the six plans against the dozen (frame 3), the two kinds of miss (frame 9), `reel audit`'s warning on the code surface (frame 16).
- The persistent anchor is a spine of three ticks at the rail's slot rows (steps 1–3), the live one coral; openers and the ending show the three-slot rail itself.
- Two questions: `q1` (step 2, options A–C, recommended A) and `q2` (step 3, options A–B, recommended A). One branch beat per option, each showing what that option does to its step.
- Three quick checks (style guide §7), one per step, each a prediction whose wrong options are what a reasonable reviewer might expect instead, each with `- explained_at:` naming its step beat; option cards carry `data-option` (decision cards also `data-plan-option`).
- Decisions in force get no question: a small `decided · D-108` tag on step 1 (the band holds a call's Accept and Flag) and `decided · D-084` on step 2 (the streak of ten stays), each with one sentence. The others the plan cites are unchanged and not narrated.
- THE ANSWER BAND: every frame's root carries `data-band="bottom"` and keeps its lowest eighth (y ≥ 945) empty; nothing in any frame sits below y 900 but the captions.
- Built from the project record: names from `glossary.md` (the review player, the answer band, a call, a miss, reel stops, a grouped beat); the look from `.reelplanning/theme/frame.md`. No details.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still.

## Frame 1 — Twenty-three stops

- chapter_start: The problem, and what changes
- scene: NO SPINE: kicker 'Answer-on-the-video · walkthrough'; the figure '23' with the mono unit 'of 23 stop' on 'twenty-three'; a 4:58 timeline with 23 pause marks landing along it on 'stops'; on 'sentence' the chip 'one sentence a call' outlined coral (the one coral)
- voiceover: "The answer-on-the-video walkthrough stops twenty-three times: every call the agent made, and a deviation, each with a beat of its own. It fits five minutes only with one sentence a call."
- duration: 12.23s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: 23 pauses on one walkthrough's timeline
- sfx: none

narrativeRole: Twenty-three stops.
keyMessage: The answer-on-the-video walkthrough stops twenty-three times:

## Frame 2 — Two rules make it so

- scene: TWO PANELS: left 'Streaks (of 10)' with three rows, visible 0, close 0, hard-to-undo 0, landing on 'zero'; right 'A miss with no tags': the card 'D-056 · review player' on 'D-056', an arrow, and the chip 'every player call stops' outlined coral on 'stops' (the one coral)
- voiceover: "Two rules make it so. You accept a tag ten times running before it stops no more, and every streak is zero now. And a miss with no tags reaches every tagged call on its part: one old miss on the review player, D-056, stops every player call."
- duration: 16.73s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-causes.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: every streak at 0, and one old miss reaching every player call
- sfx: none

narrativeRole: Two rules make it so.
keyMessage: Two rules make it so.

## Frame 3 — Plans leave too much open

- scene: BAR CHART: kicker 'Calls per plan'; six bars (close-the-lifecycle 19, revise-loop 34, richer-review 16, deep-dives 15, answer-on-the-video 23, memory 16) grow on 'fifteen to thirty-four'; a dashed line at 12 on 'dozen'; on 'six' the chip '6 of 8 from steps with 5+' outlined coral (the one coral)
- voiceover: "And plans leave too much open. The skill says a dozen calls is too many; every plan so far had more, fifteen to thirty-four. And six of the eight calls you did not simply accept came from steps with five or more calls."
- duration: 14.04s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-too-many.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: six plans' call counts against the dozen
- sfx: none

narrativeRole: Plans leave too much open.
keyMessage: And plans leave too much open.

## Frame 4 — What changes: three steps, each on its own

- scene: LIST: kicker 'What changes · 3 steps'; grey chips 'recommended: 15 of 15' and 'calls accepted: 84 of 91' on their words; the three steps as rows, each on its words; on 'own' the chip 'each on its own' outlined coral (the one coral)
- voiceover: "You take the recommendation on fifteen of fifteen, so the aim is not fewer stops for their own sake. Three changes, each on its own: one pause per step, a miss stops its own kind, and too many calls becomes a question."
- duration: 14.11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-overview.html
- type: product_intro
- beat: Focus
- blueprint: compose
- focal: the three changes, independent
- sfx: none

narrativeRole: What changes: three steps, each on its own.
keyMessage: You take the recommendation on fifteen of fifteen, so the aim is not fewer stops for their own sake.

## Frame 5 — Part 2 of 4

- chapter_start: Step 1: one pause per step
- scene: RAIL: kicker 'Part 2 of 4'; the three-slot rail, slot 1 outlined coral (the one coral); the hero with step 1's title
- voiceover: "Part two of four: step one."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-opener-2.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 1
- sfx: none

narrativeRole: Part 2 of 4.
keyMessage: Part two of four:

## Frame 6 — Step 1: the calls that stop in a step share one beat

- plan_step: 1
- scene: SPINE + BEFORE/AFTER: kicker 'Step 1 · One pause per step'; 'Today' with a track and eight pause marks (A3 A4 A5 A12 A13 A14 A15 A16) on 'eight times'; 'With step 1' with one pause mark on 'once'; a mock of the answer band listing the eight calls, each 'Accept · Flag', on 'lists'; grey chips 'decided · D-108' on 'D-108', 'no Accept all' on 'no', 'D1 · its own beat' on 'deviation'; on 'twenty-three' the chip '23 → 5 pauses' outlined coral (the one coral)
- voiceover: "Step one. Today, step two of that walkthrough pauses eight times, once per call. With this plan, the calls that stop in a step share one beat. The video pauses once, and the answer band, where D-108 put Accept and Flag, lists each call with its own, and no Accept all. A deviation keeps its own beat. Twenty-three pauses become five."
- duration: 20.38s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: eight pauses become one, the band listing each call
- sfx: none

narrativeRole: Step 1: the calls that stop in a step share one beat.
keyMessage: Step one.

## Frame 7 — Quick check: a step with a deviation

- plan_step: 1
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Memory, step 4: A11, A12 and D1 stop.'; three option cards (data-option a–c): A 'Once, for all three', B 'Twice: D1 on its own', C 'Three times, as now', landing on the question's last words; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. In the memory walkthrough, step four has two calls that stop, and a deviation. How many times does the video pause there?"
- duration: 7.467s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k1
- question: In the memory walkthrough, step 4 has two calls that stop, A11 and A12, and a deviation, D1. How many times does the video pause there?
- option_a: Once: all three share the step's beat
- option_b: Twice: the two calls share a beat, and D1 has its own
- option_c: Three times, one per call, as now
- answer: b
- explain: The two calls share the step's stop beat; a deviation always keeps its own beat, so step 4 pauses twice.
- explained_at: 6
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a step with a deviation.
keyMessage: Quick check.

## Frame 8 — Part 3 of 4

- chapter_start: Step 2: a miss stops its own kind
- scene: RAIL: kicker 'Part 3 of 4'; the three-slot rail, steps before 2 done, slot 2 outlined coral (the one coral); the hero with step 2's title
- voiceover: "Part three of four: step two, and a question."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-opener-3.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 2
- sfx: none

narrativeRole: Part 3 of 4.
keyMessage: Part three of four:

## Frame 9 — Step 2: a miss stops calls of its own kind

- plan_step: 2
- scene: SPINE + TWO ROWS: kicker 'Step 2 · A miss stops its own kind'; row 'miss with tags → calls sharing a tag', tagged 'kept', on 'tags'; the grey tag 'decided · D-084' on 'D-084'; the card 'D-056 · no tags · review player' on 'D-056'; row 'no tags → every call on its part', tagged 'question 1', outlined coral on 'every' (the one coral); the figure '22' with 'still stop today' on 'zero'
- voiceover: "Step two. A recent miss that carries tags stops a call that shares one, as now, and D-084's streak of ten stays. What changes is a miss with no tags, like D-056, which today stops every call on its part. With every streak at zero, the count stays the same for now; this matters once a tag earns its ten."
- duration: 21.08s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: the two kinds of miss, and the one that changes
- sfx: none

narrativeRole: Step 2: a miss stops calls of its own kind.
keyMessage: Step two.

## Frame 10 — Quick check: a miss with a different tag

- plan_step: 2
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'A recent miss is tagged close. A new call is tagged visible: 10 in a row.'; three option cards (data-option a–c): A 'Yes: it is on the same part', B 'No: it shares no tag', C 'Yes: a miss stops every call', landing on the question's last words; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. A recent miss is tagged close. A new call on the same part is tagged visible, and visible was accepted ten times running. Does it stop?"
- duration: 8.747s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k2
- question: A recent miss is tagged close. A new call on the same part is tagged visible, and visible was accepted ten times running. Does it stop?
- option_a: Yes: it is on the same part as the miss
- option_b: No: it shares no tag with the miss, and its tag has its ten
- option_c: Yes: a recent miss stops every call
- answer: b
- explain: A miss that carries tags reaches only calls sharing one of them; visible has its ten accepts, so the call joins the grouped beat.
- explained_at: 9
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a miss with a different tag.
keyMessage: Quick check.

## Frame 11 — Question 1: what may a miss with no tags stop?

- plan_step: 2
- scene: SPINE + THREE OPTION CARDS: kicker 'Question 1 · Step 2'; the question; cards A 'Nothing directly' (cost 'shapes questions only'), B 'Close calls on its part' ('15 of 22 stop'), C 'As now' ('22 of 22 stop'), each on its letter; on 'recommend' A's border turns coral and 'recommended' lands under it (the one coral)
- voiceover: "So what may a miss with no tags stop? A: nothing directly; it still shapes the next plan's questions. B: the calls on its part tagged close, fifteen of that walkthrough's twenty-two. C: as now, every tagged call on its part. I recommend A: a part is too coarse to say what went wrong. What should it stop?"
- duration: 16.917s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-decision-q1.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q1
- question: What may a miss with no tags stop?
- option_a: Nothing directly
- option_b: Close calls on its part
- option_c: As now
- why_a: A miss stops only calls that share one of its tags; a miss with no tags still shapes the next plan's questions (memory step 4), but stops no call.
- why_b: It counts as a close miss on its components: it stops the calls there tagged close (15 of the answer-on-the-video's 22).
- why_c: Every tagged call on its components stops, for five plans.
- recommended: a
- focal: the three options, A recommended
- sfx: none

narrativeRole: Question 1: what may a miss with no tags stop?.
keyMessage: So what may a miss with no tags stop?

## Frame 12 — If A: tags only

- plan_step: 2
- scene: RAIL, the plan under A: kicker 'If A · Nothing directly'; the three steps as rows; step 2's tag 'Tags only' outlined coral (the one coral); chips 'D-056 stops nothing' and 'memory's A12 changes' on their words
- voiceover: "With A, step two matches a miss by its tags alone: D-056 stops nothing, and memory's call A12 changes."
- duration: 8.25s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-branch-q1-a.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=a
- focal: step 2 under this option
- sfx: none

narrativeRole: If A: tags only.
keyMessage: With A, step two matches a miss by its tags alone:

## Frame 13 — If B: close calls on its part

- plan_step: 2
- scene: RAIL, the plan under B: kicker 'If B · Close calls on its part'; the three steps as rows; step 2's tag 'Close on its part' outlined coral (the one coral); chips 'D-056 = a close miss' and '15 of 22 stop' on their words
- voiceover: "With B, step two treats D-056 as a close miss on the review player: fifteen of the twenty-two calls stop on it."
- duration: 8.49s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-branch-q1-b.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=b
- focal: step 2 under this option
- sfx: none

narrativeRole: If B: close calls on its part.
keyMessage: With B, step two treats D-056 as a close miss on the review player:

## Frame 14 — If C: as now

- plan_step: 2
- scene: RAIL, the plan under C: kicker 'If C · As now'; the three steps as rows; step 2's tag 'As now' outlined coral (the one coral); chips 'today's rule' and 'says which rule stopped it' on their words
- voiceover: "With C, step two keeps today's rule, and reel stops only says which rule stopped each call."
- duration: 6.23s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-branch-q1-c.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=c
- focal: step 2 under this option
- sfx: none

narrativeRole: If C: as now.
keyMessage: With C, step two keeps today's rule, and reel stops only says which rule stopped each call.

## Frame 15 — Part 4 of 4

- chapter_start: Step 3: too many calls becomes a question
- scene: RAIL: kicker 'Part 4 of 4'; the three-slot rail, steps before 3 done, slot 3 outlined coral (the one coral); the hero with step 3's title
- voiceover: "Part four of four: step three, and a question."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-opener-4.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 3
- sfx: none

narrativeRole: Part 4 of 4.
keyMessage: Part four of four:

## Frame 16 — Step 3: too many calls in one step is asked, not made

- plan_step: 3
- scene: SPINE + CODE SURFACE: kicker 'Step 3 · Too many calls'; the navy code surface with '$ reel audit plans/…answer-on-the-video' and, on 'warns', '△ 23 calls; step 2 has 8'; right, the rule card '5+ calls in a step' → 'ask the biggest', outlined coral on 'question' (the one coral); the grey chip 'the plan writer' on 'writer'
- voiceover: "Step three. Reel audit warns past twelve calls and names the step with the most: twenty-three calls, step two has eight. And the skill tells the plan writer: a step you expect to need five or more calls asks its biggest as a question instead."
- duration: 15.52s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: reel audit's warning, and the five-call rule
- sfx: none

narrativeRole: Step 3: too many calls in one step is asked, not made.
keyMessage: Step three.

## Frame 17 — Quick check: sixteen calls, four at most

- plan_step: 3
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Memory: 16 calls, at most 4 in a step. What does reel audit say?'; three option cards (data-option a–c): A '△ 16 calls; step 1 has 4', B 'Nothing: no step has 5', C '✗ The audit fails', landing on the question's last words; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. The memory walkthrough has sixteen calls, and no step has more than four. What does reel audit say?"
- duration: 6.037s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k3
- question: The memory walkthrough has sixteen calls, and no step has more than four. What does reel audit say?
- option_a: A warning: 16 calls; step 1 has 4
- option_b: Nothing: no step reaches five
- option_c: It fails the audit
- answer: a
- explain: It warns past twelve calls in all and names the step with the most, whether or not a step reaches five; it is a warning, never a failure.
- explained_at: 16
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: sixteen calls, four at most.
keyMessage: Quick check.

## Frame 18 — Question 2: a fifth call during the build

- plan_step: 3
- scene: SPINE + TWO OPTION CARDS: kicker 'Question 2 · Step 3'; the question 'A fifth call in a step. Then?'; cards A 'Asks before going on' ('that step waits') and B 'Builds on, and says so' ('you find out after'), each on its letter; the grey chip '6 of 8 from such steps' on 'six'; on 'recommend' A's border turns coral and 'recommended' lands under it (the one coral)
- voiceover: "One thing is left: a step reaches its fifth call during the build anyway. A: the implementer asks before going on; that step waits for your answer, and the others carry on. B: it builds on, and the walkthrough says so. I recommend A: six of the eight calls you did not simply accept came from such steps. Which one?"
- duration: 17.387s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-decision-q2.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q2
- question: A step reaches its fifth call during the build. What does the implementer do?
- option_a: Asks before going on
- option_b: Builds on, and says so
- why_a: That step waits; its biggest open choice goes into plan.md as a question for you, and the other steps carry on.
- why_b: The walkthrough opens with the count and the step; reel audit warns.
- recommended: a
- focal: the two options, A recommended
- sfx: none

narrativeRole: Question 2: a fifth call during the build.
keyMessage: One thing is left:

## Frame 19 — If A: the step waits for a question

- plan_step: 3
- scene: RAIL, the plan under A: kicker 'If A · Asks before going on'; the three steps as rows; step 3's tag 'Asks first' outlined coral (the one coral); chips 'a question in plan.md' and 'that step waits' on their words
- voiceover: "With A, a fifth call in a step becomes a question in the plan, and that step waits for your answer."
- duration: 6.14s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-branch-q2-a.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q2=a
- focal: step 3 under this option
- sfx: none

narrativeRole: If A: the step waits for a question.
keyMessage: With A, a fifth call in a step becomes a question in the plan, and that step waits for your answer.

## Frame 20 — If B: build on, and say so

- plan_step: 3
- scene: RAIL, the plan under B: kicker 'If B · Builds on, and says so'; the three steps as rows; step 3's tag 'Builds on' outlined coral (the one coral); chips 'nothing waits' and 'the walkthrough says so' on their words
- voiceover: "With B, nothing waits: the walkthrough opens with the count and the step."
- duration: 5.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-branch-q2-b.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q2=b
- focal: step 3 under this option
- sfx: none

narrativeRole: If B: build on, and say so.
keyMessage: With B, nothing waits:

## Frame 21 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram: kicker 'The plan · 3 steps, 2 questions'; steps 1–3 as rows at reading size, step 1 with 'decided · D-108', step 2 with the choice tag 'Nothing directly' and step 3 'Asks first' (the recommended defaults; the player fills the reviewer's picks); right, 'Answer, note, or approve' on 'answer'; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: three steps, each on its own, and two questions. Answer them, draw on any step to leave a note, or approve. The narration and visuals are AI-generated."
- duration: 12.95s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-resolved.html
- type: cta
- beat: Resolve
- blueprint: compose
- plan_questions: 1, 2
- focal: the three steps and the two choices
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That is the plan:

