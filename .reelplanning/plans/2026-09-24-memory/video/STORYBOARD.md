---
title: "Memory: learn which questions are the right ones"
format: 1920x1080
duration: 344s
message: "Four changes: every review records who reviewed it and with which skill (step 1); memory worked out on demand, for this repo and for you across repos (steps 2 and 3); misses decide what stops (step 4); a retro you start, checked against a fixed benchmark (step 5). Two questions: where your memory across repos lives (step 3, recommend A) and when the tool suggests a retro (step 5, recommend A)."
arc: how-to-process: the problem told with this repo's own records (what you answered, what got past), what changes before how (four changes, then which step needs which), then the steps in plan order with their quick checks and the two decisions, in five parts
audience: the repo owner reviewing reelplanning's own plan on the review page; they wrote every review this plan reads
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-24-memory
---

## Video direction

- A SERIES OF FIVE SHORT PARTS (style guide §1): `chapter_start` on frames 1, 7, 14, 20 and 26. Part 1 is the problem and what changes, before any how: fourteen reviews no plan reads (frame 1), what they say you answered (frame 2), what got past a review (frame 3), the four changes with their steps (frame 4), then which step needs which (frame 5). Part 2: steps 1 and 2, with `reel status`'s five lines and `reel memory m3` opening the evidence behind one of them (progressive disclosure). Part 3: step 3 and question 1, with its one branch. Part 4: step 4, what a miss is and what it makes stop. Part 5: step 5, the benchmark outside the loop, question 2, and the resolved plan.
- REAL EVIDENCE, quoted from this repo (style guide §4, a number the viewer can follow): 14 reviews in `reviews/`; 16 questions, every list answer the recommendation, 3 in own words (D-022 too abstract, D-023 framed wrong, D-003 accepted with a condition); 85 of 91 calls accepted; D-056 superseded by D-063 the same day; the file tools reversed after quick check k3 (m3 walkthrough, step 6); deep-dives step 4 rewound at 03:36 (back to 198.9 s from 215.3 s), rewritten, and rewound again at 04:28 (back to 197.9 s from 274.1 s); 4 of 16 quick checks answered wrong. The five status lines and their ids (m1–m5) are a mock-up of step 2's output with these real numbers.
- WHAT TO DRAW (style guide §5): the plan changes records and what two commands print, so the frames show the records (a review file gaining two lines, a summary line leaving the repo), the terminal output (`reel status`'s memory block, `reel memory m3`), a streak of accepts broken by a miss, and the loop beside its benchmark. No node graph of the system: nothing here is a runtime data flow except the dependency arrows between steps (frame 5), which are what the reviewer asked to see.
- The persistent anchor is a spine of five ticks at the rail's slot rows, the live one coral, the done ones grey; openers, closers and the ending show the five-slot rail.
- Two questions: `q1` (step 3) and `q2` (step 5), options A–C, recommended A. One branch beat, `q1=c`: C takes step 3 out of the plan, the one option that changes its shape. q1's B keeps step 3 and changes only where the file lives; q2's options tune when a retro is suggested (C removes one suggestion line from step 5), so neither has a branch and the player goes straight on.
- Six quick checks (style guide §7), each a prediction whose wrong options are what a reasonable reviewer might expect: k1 old reviews at step 1 (left as they are, not backfilled or dropped); k2 where your words on D-023 are (reel memory m2, not the status line, not a kept file); k3 what reaches your own file (a short summary, not the review); k4 which is a miss (an accepted call reversed later, not own words, rewinds or a wrong check); k5 ten accepts then a miss of its kind (it stops, with no flag needed); k6 a retro that makes the tool ask less (judged by the benchmark and your review, not the loop's numbers). Each answer is also said in the next beat (frames 10, 13, 17, 23, 25, 30), so the video carries the whole plan for someone who reads no explain line.
- Dependencies said as the plan's steps state them: step 1 independent; step 2 needs step 1 (works without it for one reviewer); step 3 needs step 1; step 4 needs step 2; step 5 needs steps 2–4.
- Decisions in force get no question: a small `decided · D-085` tag on step 2 (memory worked out, not kept) and `decided · D-084` on step 4 (the stop rule this step gains one exception to). D-083 is the quick-check rule this video follows and one of memory's signals; D-082 and D-024 are unchanged and not narrated.
- Option cards carry `data-option` (and `data-plan-option`), quick checks and decisions alike.
- Built from the project record: names from `glossary.md` (the reel CLI, the plan-to-video skill, the review player); the look from `.reelplanning/theme/frame.md` via the answer-on-the-video video. No details.
- Palette: paper ground, ink voice, coral as the single signal per frame. Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.

## Frame 1 — Every plan starts from nothing

- chapter_start: The problem, and what changes
- scene: RECORDS, no spine: kicker 'Today · 14 reviews'; a grid of fourteen small review files (their real names, plan-… and walkthrough-…, grey), landing row by row on 'Fourteen reviews'; at the right a new plan card, 'plan.md', its body lines empty; on 'no plan reads them' a dashed arrow from the grid to the plan with the chip 'not read', the one coral
- voiceover: "Every plan starts from nothing. Fourteen reviews sit in this repo, and no plan reads them."
- duration: 6.48s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- beat: Recognition
- blueprint: compose
- focal: fourteen reviews and a plan that reads none of them
- roles: files = the record · plan card = a new plan · coral = not read
- sfx: none

narrativeRole: Every plan starts from nothing.
keyMessage: Every plan starts from nothing.

## Frame 2 — What the reviews say you answered

- scene: EVIDENCE, no spine: kicker 'What the reviews say'; row 1 'Questions · 16': sixteen squares, thirteen filled grey with the chip 'recommended' on 'recommended one'; the three own-words squares outlined, each landing on its reason with its decision id under it: 'too abstract · D-022', 'framed wrong · D-023', 'a condition · D-003'; the own-words squares take the coral outline (the one coral); row 2 'Calls · 91': ninety-one thin ticks, eighty-five filled grey, six open; the count '85 of 91 accepted' on 'eighty-five'
- voiceover: "Here is what they say. Sixteen questions: every answer you picked from the list was the recommended one. Three you answered in your own words: the options were too abstract, the question was framed wrong, or you accepted with a condition. And you accepted eighty-five of the agent's ninety-one calls."
- duration: 17.03s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-answered.html
- type: pain_point
- beat: Tension
- blueprint: compose
- focal: the three own-words squares and their reasons
- roles: squares = questions · ticks = calls · coral = own words
- sfx: none

narrativeRole: What the reviews say you answered.
keyMessage: What the reviews say you answered.

## Frame 3 — What got past a review

- scene: THREE TIMELINES, no spine: kicker 'Changed after review'; three rows, each a short timeline of real events landing on its words: 'D-056 · accepted' → 'D-063 · supersedes' ('same day'); 'file tools · accepted' → 'k3 · reversed'; 'deep-dives step 4 · rewound 03:36' → 'rewritten' → 'rewound 04:28'; the row being spoken carries the coral mark, moving down (one coral at a time); on 'should have been asked' each row gets the grey chip 'a missed question' or 'a call that should stop'
- voiceover: "Some things got past a review and changed later. Decision fifty-six was accepted, then superseded by sixty-three the same day. The file tools call was accepted, then reversed after quick check three. Step four of the deep-dives plan was rewound, rewritten, and rewound again. Each is a question that should have been asked, or a call that should have stopped."
- duration: 21.19s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-got-past.html
- type: pain_point
- beat: Tension
- blueprint: compose
- focal: three things changed after a review let them through
- roles: rows = the three cases · coral = the case being spoken
- sfx: none

narrativeRole: What got past a review.
keyMessage: What got past a review.

## Frame 4 — What changes: four changes

- scene: FOUR LANES, no spine: kicker 'What changes · 4'; the hero 'The right questions, not fewer' on 'aim'; four lanes land on their words, each with its step tiles on their numbers: 'Who and which skill' (Step 1); 'Memory, on demand' (Steps 2, 3); 'Misses decide what stops' (Step 4); 'A retro you start' (Step 5); the lane being named takes the coral border, moving down
- voiceover: "The aim is the right questions, not fewer. Four changes. Every review records who reviewed it and with which skill: step one. Memory, worked out on demand, for this repo and for you: steps two and three. Misses decide what stops: step four. And a retro you start: step five."
- duration: 16.98s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-overview.html
- type: product_intro
- beat: Overview
- blueprint: compose
- focal: the four changes and which steps carry each
- roles: lanes = the changes · tiles = steps · coral = the change being named
- sfx: none

narrativeRole: What changes: four changes.
keyMessage: What changes: four changes.

## Frame 5 — How the steps depend on each other

- scene: DEPENDENCIES, no spine: kicker 'Which step needs which'; five step tiles: 1 at the left, 2 and 3 stacked in the middle, 4 right of 2, 5 at the right; each 'needs' arrow draws on its words: 1→2 dashed with the chip 'one reviewer: optional', 1→3 solid, 2→4, then 2, 3 and 4 → 5; on 'stands alone' tile 1 takes the chip 'independent'; the retro tile takes the coral border on 'the retro' (the one coral); holds 1.5 s after the last arrow
- voiceover: "Step one stands alone. Steps two and three build on its record; step two works without it while there is one reviewer. Step four needs step two, and the retro needs two, three and four."
- duration: 12.87s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-depends.html
- type: product_intro
- beat: Overview
- blueprint: compose
- focal: the arrows between the five steps
- roles: tiles = steps · arrows = needs · coral = the retro, which needs the rest
- sfx: none

narrativeRole: How the steps depend on each other.
keyMessage: How the steps depend on each other.

## Frame 6 — Next: part 2

- scene: RAIL: kicker 'Part 1 of 5 · done'; the five-slot rail filled with the step titles; on 'part two' slots 1 and 2 take the coral outline and the hero 'Next · The record, and memory' lands right
- voiceover: "Next, part two: the record, and this repo's memory."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-closer-1.html
- type: benefit_highlight
- beat: Closer
- blueprint: compose
- focal: slots 1 and 2
- roles: rail = the plan · coral = what is next
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next: part 2.

## Frame 7 — Part 2 of 5

- chapter_start: Steps 1 and 2: the record, and the repo's memory
- scene: RAIL: kicker 'Part 2 of 5'; slots 1 and 2 filled, slot 1 coral; hero 'Who, which skill, and memory'
- voiceover: "Part two of five: steps one and two."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-opener-2.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slots 1 and 2
- roles: rail = the plan · coral = step 1
- sfx: none

narrativeRole: Part 2 of 5.
keyMessage: Part 2 of 5.

## Frame 8 — Step 1: every review records its reviewer and version

- plan_step: 1
- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Who, and which skill'; spine tick 1 coral; the review file as it is recorded, 'reviews/plan-20260923T042829Z.json', its real fields ('verdict: changes', 'decisions: 1', 'marks: 1', 'watched: 100%'); on 'who reviewed it' a new line lands, 'reviewer: git user.email', with its coral outline (the one coral); on 'reelplanning version' a second, 'built with: reelplanning 0.1.0'; at the right two small comparisons land on their sentences: 'skill changed? or plans?' and 'your taste? or what works?'
- voiceover: "Step one: when a review is recorded, intake adds who reviewed it, from git's user email or the page's viewer, and the reelplanning version that built the video. Without the version, a change to the skill looks like a change in the plans. Without the reviewer, one person's taste looks like what works."
- duration: 16.84s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-step-1.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: the two new lines in a real review
- roles: file = the record · coral = what step 1 adds
- sfx: none

narrativeRole: Step 1: every review records its reviewer and version.
keyMessage: Step 1: every review records its reviewer and version.

## Frame 9 — Quick check: the reviews recorded before step 1

- plan_step: 1
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Recorded before step 1: then?'; fourteen small grey file tiles with no reviewer line; three option cards land on 'What happens': A 'Left as they are', B 'Filled in from git', C 'Left out of memory'; nothing marked
- voiceover: "Quick check. Fourteen reviews were recorded before step one. What happens to them?"
- duration: 5.35s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-quiz-old.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k1
- question: Fourteen reviews were recorded before step 1. What happens to them?
- option_a: They are left as they are
- option_b: They are filled in from git's history
- option_c: Memory leaves them out until they are
- answer: a
- explain: Step 1 changes intake only: old reviews are left as they are, and with one reviewer memory reads them as they stand (step 2 works without the field).
- focal: the fourteen old reviews and three predictions
- roles: tiles = the old reviews · option cards = the predictions
- sfx: none

narrativeRole: Quick check: the reviews recorded before step 1.
keyMessage: Quick check: the reviews recorded before step 1.

## Frame 10 — Step 2: reel status says what reviews show

- plan_step: 2
- scene: SPINE + PROTOTYPE: kicker 'Step 2 · The repo's memory'; spine tick 2 coral; the chip 'needs step 1 · or one reviewer'; a terminal-like panel '$ reel status' with the real table condensed (six plans, their stages) and under it 'Memory', five lines landing each on its words: 'm1 recommended taken: 13 of 16', 'm2 own words: 3 · abstract, framed, a condition', 'm3 rewound: 1 step again after revision', 'm4 quick checks wrong: 4 of 16', 'm5 misses: 3'; the 'Memory' block takes the coral border (the one coral); the grey tag 'decided · D-085'
- voiceover: "They are left as they are. Step two: reel status ends with at most five lines, worked out each time from the ledger and the reviews. How often a recommendation was taken; the own-words answers, and why; the steps rewound; the quick checks answered wrong; and the misses."
- duration: 16.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: five lines at the end of reel status
- roles: panel = reel status · lines = the memory · coral = the new block
- sfx: none

narrativeRole: Step 2: reel status says what reviews show.
keyMessage: Step 2: reel status says what reviews show.

## Frame 11 — reel memory m3 opens the evidence

- plan_step: 2
- scene: SPINE + PROTOTYPE, progressive disclosure: kicker 'Step 2 · One line, then its evidence'; left, the five status lines small, line m3 lit coral on 'm three'; right, a second panel '$ reel memory m3' opening on 'opens its evidence': '2026-09-23-deep-dives · step 4', '03:36 plan review · back to 198.9 s from 215.3 s', '— step 4 rewritten —', '04:28 plan review · back to 197.9 s from 274.1 s', 'reviews/plan-20260923T033620Z.json, plan-20260923T042829Z.json', each row on its words; on 'skill reads it' the chips 'before a plan' and 'when tagging'
- voiceover: "Each line has an id. Reel memory m three opens its evidence: deep dives, step four, rewound in one review, rewritten, and rewound again in the next. The status stays short, and the evidence is one command away. The skill reads it before writing a plan, and when tagging calls."
- duration: 17.85s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-memory-id.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: one status line opening onto its evidence
- roles: left = reel status · right = reel memory m3 · coral = the line opened
- sfx: none

narrativeRole: reel memory m3 opens the evidence.
keyMessage: reel memory m3 opens the evidence.

## Frame 12 — Quick check: status or memory

- plan_step: 2
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'Your words on D-023: where?'; three option cards on 'Where', each with a small drawing of the place: A 'reel status' (one line), B 'reel memory m2' (the evidence panel), C 'a memory file' (a file icon drawn as a card, 'memory.md'); nothing marked
- voiceover: "Quick check. You want the words you wrote on decision twenty-three. Where do you find them?"
- duration: 5.25s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-quiz-where.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k2
- question: You want the words you wrote on D-023. Where do you find them?
- option_a: On its line in reel status
- option_b: In reel memory m2, from the reviews
- option_c: In a memory file the skill keeps
- answer: b
- explain: reel status keeps each signal to one line; reel memory <id> prints the reviews, the words and the times behind it, worked out from reviews/ each time: nothing is kept by hand (D-085).
- focal: three places the words might be
- roles: option cards = the predictions
- sfx: none

narrativeRole: Quick check: status or memory.
keyMessage: Quick check: status or memory.

## Frame 13 — Next: part 3

- scene: RAIL: kicker 'Part 2 of 5 · done'; the answer first: 'reel memory m2' → 'reviews/' with the chip 'nothing stored'; then on 'part three' slot 3 takes the coral outline and the hero 'Next · Your memory'
- voiceover: "In reel memory m two, worked out from the reviews; nothing new is stored. Next, part three: your memory, across repos."
- duration: 7.65s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-closer-2.html
- type: benefit_highlight
- beat: Closer
- blueprint: compose
- focal: the answer, then slot 3
- roles: rail = the plan · coral = what is next
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next: part 3.

## Frame 14 — Part 3 of 5

- chapter_start: Step 3: your memory, and question 1
- scene: RAIL: kicker 'Part 3 of 5'; slots 1–2 grey, slot 3 filled and coral; hero 'Your memory, across repos'; the chip 'Choice 1 · open'
- voiceover: "Part three of five: step three, and the first question."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-opener-3.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 3
- roles: rail = the plan · coral = step 3
- sfx: none

narrativeRole: Part 3 of 5.
keyMessage: Part 3 of 5.

## Frame 15 — Step 3: your memory, across repos

- plan_step: 3
- scene: SPINE + FLOW: kicker 'Step 3 · Your memory'; spine tick 3 coral; the chip 'needs step 1'; left, two repo boxes, 'ReelPlanning' and 'another repo', each with its reviews/ stack; right, outside both, a file card 'your file' (its place is question 1); on 'short summary' one line travels from a review into the file, and its fields land on their words: 'verdict', 'own words + why', 'rewinds', 'wrong checks', 'calls flagged'; on 'dash dash you' a panel '$ reel memory --you' with three lines across repos; on 'your taste' the file takes the coral border (the one coral)
- voiceover: "Step three needs step one. When a review is recorded, a short summary of it goes into a file of your own, outside any repo: the verdict, your own-words answers and their reasons, the rewinds, the wrong quick checks, the kinds of call you flagged. Reel memory dash dash you works out the same few lines across every repo you review in: your taste, not one repo's facts."
- duration: 20.85s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-step-3.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: a summary line leaving the repo for your own file
- roles: repo boxes = where reviews stay · file = your memory · coral = your file
- sfx: none

narrativeRole: Step 3: your memory, across repos.
keyMessage: Step 3: your memory, across repos.

## Frame 16 — Quick check: what reaches your file

- plan_step: 3
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Another repo's review: what travels?'; a small repo box 'another repo' with a new review, and 'your file' at the right, an empty arrow between; three option cards on 'What reaches': A 'The whole review', B 'A short summary', C 'Nothing, until you ask for it'; nothing marked
- voiceover: "Quick check. You review a plan in another repo. What reaches your own file?"
- duration: 4.92s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-quiz-summary.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k3
- question: You review a plan in another repo. What reaches your own file?
- option_a: The whole review, copied
- option_b: A short summary of it
- option_c: Nothing until you run reel memory --you
- answer: b
- explain: Recording a review appends a short summary (verdict, own-words answers and their reasons, rewinds, wrong quick checks, kinds of call flagged) to your file; the review itself stays in its repo.
- focal: the arrow between a repo and your file
- roles: option cards = the predictions
- sfx: none

narrativeRole: Quick check: what reaches your file.
keyMessage: Quick check: what reaches your file.

## Frame 17 — Choice 1: where does your memory across repos live?

- plan_step: 3
- scene: SPINE + THREE OPTIONS side by side under the question 'Where does your memory across repos live?': A 'Home folder' with a small file card '~/.reelplanning/you.jsonl' and its lines, cost 'any agent reads it'; B 'Claude's memory' with a card 'Claude Code · user memory', cost 'only Claude reads it'; C 'Not yet' with step 3 dashed as 'a later plan', cost 'no taste across repos'; each option lands on its letter, its cost on its words; on 'I recommend' A takes the coral border and 'recommended' (the one coral)
- voiceover: "Only the short summary; the review stays in its repo. So where does that file live? A: a file in your home folder, one line per review, that any agent reads through reel memory. B: Claude's own memory: nothing new to keep, but only Claude reads it. C: not yet: this repo's memory first, yours in a later plan. I recommend A: it works under any agent, and it is the same kind of record the repo keeps. Where should it live?"
- duration: 22.64s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-decision-q1.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q1
- question: Where does your memory across repos live?
- option_a: A file in your home folder
- option_b: Claude's own memory
- option_c: Not yet
- why_a: ~/.reelplanning/you.jsonl, one line per review; any agent reads it through reel memory --you. Stays on this machine.
- why_b: Claude Code's user memory holds it: nothing new to keep, but only Claude reads it.
- why_c: The repo's memory first; yours waits for a later plan.
- recommended: a
- focal: the three places
- roles: cards = options · coral = the recommendation
- sfx: none

narrativeRole: Choice 1: where does your memory across repos live?.
keyMessage: Choice 1: where does your memory across repos live?.

## Frame 18 — If C: step 3 waits for a later plan

- plan_step: 3
- scene: RAIL, the plan under C: kicker 'If C · Not yet'; the five steps as a list; on 'leaves this plan' step 3 dims with the grey chip 'a later plan' and a strike; on 'this repo's alone' step 2 takes the coral outline (the one coral) with the chip 'the only memory'; steps 4 and 5 unchanged
- voiceover: "With C, step three leaves this plan, and memory is this repo's alone until a later plan."
- duration: 6.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-branch-q1-c.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=c
- focal: step 3 out of the plan
- roles: list = the plan under C · coral = what memory is left
- sfx: none

narrativeRole: If C: step 3 waits for a later plan.
keyMessage: If C: step 3 waits for a later plan.

## Frame 19 — Next: part 4

- scene: RAIL: kicker 'Part 3 of 5 · done'; slots 1–3 filled, slot 3 carrying the choice tag ('Home folder' until the player writes the pick); on 'part four' slot 4 takes the coral outline and the hero 'Next · Misses'
- voiceover: "Next, part four: what counts as a miss, and what it makes stop."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-closer-3.html
- type: benefit_highlight
- beat: Closer
- blueprint: compose
- focal: slot 4
- roles: rail = the plan · coral = what is next
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next: part 4.

## Frame 20 — Part 4 of 5

- chapter_start: Step 4: misses decide what stops
- scene: RAIL: kicker 'Part 4 of 5'; slots 1–3 grey, slot 4 filled and coral; hero 'Misses decide what stops'
- voiceover: "Part four of five: step four, misses."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-opener-4.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 4
- roles: rail = the plan · coral = step 4
- sfx: none

narrativeRole: Part 4 of 5.
keyMessage: Part 4 of 5.

## Frame 21 — Step 4: what a miss is, traced to what passed it

- plan_step: 4
- scene: SPINE + TRACE: kicker 'Step 4 · What a miss is'; spine tick 4 coral; the chip 'needs step 2'; the rule as a strip: 'changed later' ← 'let through'; three miss rows land on their words: 'D-056 → D-063', 'file tools → reversed', 'a part → reworked'; on 'traces each miss' an arrow draws back from each row to what passed it: 'call A3 · deep-dives walkthrough', 'step 6 walkthrough · k3', 'the review before'; on 'its kind' each gets its chip, 'a call's tags' or 'a question's topic'; the trace arrows are the one coral
- voiceover: "Step four needs step two. A miss is something a later plan, a fix, or a system-video review changed that an earlier review let through. A decision superseded: fifty-six by sixty-three. An accepted call reversed: the file tools. A part reworked soon after. Reel memory traces each miss to the question or call that passed it, and its kind: a call's tags, or a question's topic."
- duration: 22.72s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-step-4-miss.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: each miss traced back to what let it through
- roles: rows = misses · arrows = the trace · coral = the trace
- sfx: none

narrativeRole: Step 4: what a miss is, traced to what passed it.
keyMessage: Step 4: what a miss is, traced to what passed it.

## Frame 22 — Quick check: what counts as a miss

- plan_step: 4
- scene: SPINE + FOUR OPTIONS: kicker 'Quick check · Step 4'; the question 'Which is a miss?'; four option cards 2 × 2 on 'Which': A 'Own-words answer', B 'Rewound twice', C 'Accepted, reversed later', D 'Quick check wrong'; nothing marked
- voiceover: "Quick check. Which of these counts as a miss?"
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-quiz-miss.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k4
- question: Which of these counts as a miss?
- option_a: A question answered in your own words
- option_b: A step rewound twice
- option_c: An accepted call, reversed later
- option_d: A quick check answered wrong
- answer: c
- explain: A miss is something changed later that a review let through; own words, rewinds and wrong quick checks are signals reel status reports, not misses.
- focal: four real cases, one of them a miss
- roles: option cards = the predictions
- sfx: none

narrativeRole: Quick check: what counts as a miss.
keyMessage: Quick check: what counts as a miss.

## Frame 23 — Step 4: a miss makes its kind stop

- plan_step: 4
- scene: SPINE + STREAK: kicker 'Step 4 · What a miss stops'; spine tick 4 coral; the grey tag 'decided · D-084 + 1 exception'; a row of ten accept ticks for the tag 'hard-to-undo', with the chip 'grouped · no stop' (D-084 today); on 'a miss changes' a miss marker lands after the streak; on 'stops the walkthrough again' the next call card 'hard-to-undo' takes the coral border and the chip 'stops' (the one coral); on 'next plan' a plan card 'next plan', 'touches: the sandbox' (the part the file tools miss was about), 'asks: that kind of question'
- voiceover: "An accepted call, reversed later. The others are signals, not misses. A miss changes what stops: a call of its kind stops the walkthrough again, whatever its streak of accepts. That is one exception to decision eighty-four's rule. And the next plan that touches that part asks that kind of question."
- duration: 17.11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-step-4-stops.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: a streak of ten accepts broken by a miss
- roles: ticks = accepts · marker = the miss · coral = the call that stops
- sfx: none

narrativeRole: Step 4: a miss makes its kind stop.
keyMessage: Step 4: a miss makes its kind stop.

## Frame 24 — Quick check: ten accepts, then a miss

- plan_step: 4
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 4'; the question 'Ten accepts, then a miss. Stops?'; the ten ticks and the miss marker small above; three option cards on 'Does the next': A 'Yes: it stops', B 'No: grouped, after ten accepts', C 'Only once you flag one'; nothing marked
- voiceover: "Quick check. You have accepted ten hard-to-undo calls running. Then one is reversed after its review. Does the next hard-to-undo call stop?"
- duration: 8.94s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-quiz-streak.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k5
- question: You have accepted ten hard-to-undo calls running. Then one is reversed after its review. Does the next hard-to-undo call stop?
- option_a: Yes: the miss brings its kind back
- option_b: No: ten accepts, so it is grouped
- option_c: Not until you flag one
- answer: a
- explain: A miss of its kind makes a call stop again whatever its streak of accepts; before step 4, only a flag did that (D-084).
- focal: the streak, the miss and three predictions
- roles: option cards = the predictions
- sfx: none

narrativeRole: Quick check: ten accepts, then a miss.
keyMessage: Quick check: ten accepts, then a miss.

## Frame 25 — Next: part 5

- scene: RAIL: kicker 'Part 4 of 5 · done'; the answer first: the call card 'hard-to-undo · stops'; then on 'part five' slot 5 takes the coral outline and the hero 'Next · A retro you start'
- voiceover: "It stops: the miss brings its kind back, with no flag needed. Next, part five: the retro, and the second question."
- duration: 7.35s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-closer-4.html
- type: benefit_highlight
- beat: Closer
- blueprint: compose
- focal: the answer, then slot 5
- roles: rail = the plan · coral = what is next
- sfx: none

narrativeRole: Next: part 5.
keyMessage: Next: part 5.

## Frame 26 — Part 5 of 5

- chapter_start: Step 5: a retro you start, and question 2
- scene: RAIL: kicker 'Part 5 of 5'; slots 1–4 grey, slot 5 filled and coral; hero 'A retro you start'; the chip 'Choice 2 · open'
- voiceover: "Part five of five: step five, and the second question."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-opener-5.html
- type: product_intro
- beat: Opener
- blueprint: compose
- focal: slot 5
- roles: rail = the plan · coral = step 5
- sfx: none

narrativeRole: Part 5 of 5.
keyMessage: Part 5 of 5.

## Frame 27 — Step 5: reel retro writes a plan

- plan_step: 5
- scene: SPINE + PROTOTYPE: kicker 'Step 5 · A retro you start'; spine tick 5 coral; the chip 'needs steps 2–4'; the status's last line 'retro due · reel retro' on 'suggests'; a plan card 'retro plan' with two skill edits, each with its evidence chip: 'options get an example each · m2 (D-022)', 'say a step plainer when rewound · m3'; on 'cut at least as many' a word counter 'added 38 · cut 52' with the rule 'cut ≥ added' (the one coral); on 'like any plan' the chip 'reviewed like any plan'
- voiceover: "Step five needs steps two to four. Reel status suggests a retro when one is due, and reel retro starts it: a plan of skill edits that the evidence supports, each citing its evidence. It must cut at least as many words as it adds, and you review it like any plan."
- duration: 15.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-step-5-retro.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: a retro plan, its evidence and its word count
- roles: plan card = the retro · chips = evidence · coral = the word rule
- sfx: none

narrativeRole: Step 5: reel retro writes a plan.
keyMessage: Step 5: reel retro writes a plan.

## Frame 28 — Step 5: the benchmark, outside the loop

- plan_step: 5
- scene: SPINE + LOOP AND YARDSTICK: kicker 'Step 5 · Checked outside the loop'; left, the loop drawn as four boxes in a ring, 'reviews' → 'memory' → 'retro' → 'skill' → back; on 'ask less' the chip 'fewer questions = better?' beside the ring, struck; right, outside the ring, the benchmark: 'Bob Dylan · same prompt' with four columns landing on their words, 'old skill', 'new skill', 'text baseline', 'HTML baseline'; on 'outside the loop' the benchmark takes the coral border (the one coral)
- voiceover: "Its own numbers can't judge it: the tool could ask less, and count that as success. So before a retro is accepted, the benchmark runs with the old skill and the new: the Bob Dylan example, redone from the same prompt, next to its text and HTML baselines. The yardstick sits outside the loop."
- duration: 17.86s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-step-5-bench.html
- type: feature_showcase
- beat: Step
- blueprint: compose
- focal: the benchmark, outside the loop that edits the skill
- roles: ring = the loop · box = the benchmark · coral = the yardstick
- sfx: none

narrativeRole: Step 5: the benchmark, outside the loop.
keyMessage: Step 5: the benchmark, outside the loop.

## Frame 29 — Quick check: a retro that asks less

- plan_step: 5
- scene: SPINE + THREE OPTIONS: kicker 'Quick check · Step 5'; the question 'Fewer questions: accepted?'; two small falling bars 'questions asked' and 'own words' above; three option cards on 'accepted on that': A 'Yes: the numbers improved', B 'Yes, if it cut more than it added', C 'No: the benchmark, then you'; nothing marked
- voiceover: "Quick check. After a retro, the next plans ask fewer questions, and fewer answers come in your own words. Is the retro accepted on that?"
- duration: 8.85s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-quiz-retro.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k6
- question: After a retro, the next plans ask fewer questions, and fewer answers come in your own words. Is the retro accepted on that?
- option_a: Yes: the numbers improved
- option_b: Yes, if it cut more words than it added
- option_c: No: the benchmark, then your review
- answer: c
- explain: Fewer own-words answers can mean the tool asks less; a retro is judged by the benchmark, old skill against new, and you review it like any plan.
- focal: the loop's own numbers improving, and three predictions
- roles: bars = the loop's numbers · option cards = the predictions
- sfx: none

narrativeRole: Quick check: a retro that asks less.
keyMessage: Quick check: a retro that asks less.

## Frame 30 — Choice 2: when does the tool suggest a retro?

- plan_step: 5
- scene: SPINE + THREE OPTIONS side by side under the question 'When does the tool suggest a retro?': each option drawn as a timeline of ten plans with the retro suggestions marked on it: A 'Every 5, or 3 repeats' (a mark at the third repeat, plan 3, and the next five plans on, plan 8), B '3 repeats only' (one mark, at the third repeat), C 'Never; you ask' (no marks); each lands on its letter; on 'I recommend' A takes the coral border and 'recommended' (the one coral)
- voiceover: "No: the benchmark judges it, and then you do. Question two: when does the tool suggest a retro? A: every five plans, or when a signal repeats three times, whichever comes first. B: only when a signal repeats three times. C: never; you ask for one. I recommend A: a schedule catches slow drift that no single signal shows, and you still decide. When should it suggest one?"
- duration: 21.37s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-decision-q2.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q2
- question: When does the tool suggest a retro?
- option_a: Every five plans, or when a signal repeats three times
- option_b: Only when a signal repeats three times
- option_c: Never; you ask for one
- why_a: Whichever comes first. A schedule catches slow drift that no single signal shows, and you still decide.
- why_b: No schedule; evidence only.
- why_c: reel retro exists, and nothing suggests it.
- recommended: a
- focal: three schedules on the same ten plans
- roles: timelines = options · coral = the recommendation
- sfx: none

narrativeRole: Choice 2: when does the tool suggest a retro?.
keyMessage: Choice 2: when does the tool suggest a retro?.

## Frame 31 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram: kicker 'The plan · 5 steps, 2 questions'; steps 1–5 as a list at reading size, each with its change in grey to its left ('who' for 1, 'memory' for 2 and 3, 'misses' for 4, 'retro' for 5); step 3 carries the choice tag 'Home folder' and step 5 'Every 5, or 3 repeats' (the recommended defaults; the player fills the reviewer's picks); step 4 'decided · D-084'; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: four changes in five steps, and two questions. Answer them, draw on any step to leave a note, or approve. The narration and visuals are AI-generated."
- duration: 12.98s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-resolved.html
- type: cta
- beat: Resolve
- blueprint: compose
- plan_questions: 1, 2
- focal: the five steps and the two choices
- roles: list = the plan · paper ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: The plan, resolved.
