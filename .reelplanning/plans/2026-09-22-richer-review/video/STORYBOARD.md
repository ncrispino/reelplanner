---
title: "Richer review: more kinds of question, words on marks, diagrams a newcomer can follow"
format: 1920x1080
duration: 210s
message: "The first real review found limits in the review itself; this plan fixes six of them"
arc: how-to-process with decisions, in four parts
audience: the engineer reviewing reelplanning's own plan before approving it, including someone new to the repo
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-richer-review
---

## Video direction

- A SERIES OF FOUR PARTS (style guide §16): `chapter_start` on frames 1, 5, 12 and 17; each part opens on the rail as resolved so far and closes by naming the next part. Under a minute each watched.
- Built from the project record (§14): node names from `glossary.md`, the stage from `.reelplanning/system.json` via `reel stage` (kind `dataflow`), the look from `.reelplanning/theme/frame.md`. No decisions in force; nothing superseded.
- THIS PLAN'S OWN DENSITY RULE, applied to itself (step 5, the reviewer feedback that motivated the plan): at most six parts on screen at once, one new thing per beat, every part named in plain words. The stage shows only the four parts this plan touches (the plan-to-video skill, the review player, resolve-plan, the reel CLI) at their fixed system.json places; each carries its glossary line as a chip the first time it appears. The full stage appears on two beats only: the today beat and step 6. The ending is the steps and the choices, not the diagram.
- Most steps change how the review LOOKS (the question sheet, the tick boxes, the text box on a mark), so they are prototypes of the player's own surfaces, with the rail reduced to a 44px spine (§18 v9). Openers, closers and branches carry the full rail, because the rail is what changes there.
- Both open questions have THREE options: each decision beat shows three cards, and three branch beats follow it (one per option, option order).
- Palette: paper ground, ink voice, coral as the single signal per frame. No navy node.
- Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.


## Frame 1 — Three answers, two buttons

- chapter_start: The problem, and step 1
- scene: PROTOTYPE, no stage: the player's question sheet as it is today, at a readable size: the question 'After a pick-all answer, what plays?', two option cards A and B; a third card C sits outside the sheet, dashed; on 'only offer two' a coral chip 'not offered' lands on C; on 'five limits' a mono line '1 of 5 limits' lands under the sheet
- voiceover: "A plan asks a question with three good answers, and the review player offers only two. The first real review found five limits like that."
- duration: 8s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete failure with stakes
- beat: Recognition
- blueprint: compose
- focal: the third answer the sheet cannot hold
- roles: question sheet = foreground · card C + 'not offered' = the signal · paper ground = background
- sfx: none

narrativeRole: Three answers, two buttons.
keyMessage: A plan asks a question with three good answers, and the review player offers only two.

Scene 1 (0.0–2.5s): the sheet (1180×420, paper, hairline) lands; its question in serif; cards A 'Every picked branch' and B 'One summary frame' in a row.
Scene 2 (2.5–5s): on 'three good answers' card C 'Branchless only' lands outside the sheet's right edge, dashed; on 'only offer two' the coral chip 'not offered' lands on it — the one coral.
Scene 3 (5–end): on 'five limits' the mono line '1 of 5 limits' lands under the sheet. Held.

## Frame 2 — Today: 4 parts run a review

- scene: FULL STAGE, no rail (brownfield today + cast in one beat, four parts, one per spoken name, 4 parts): the plan-to-video skill, the review player, resolve-plan, the reel CLI land at their system.json places, each with a plain-words chip on its outer side (the glossary line, ≤4 words); edges player→resolve-plan and resolve-plan→reel CLI draw as their names are said; the finished map of four holds ≥1.5s
- voiceover: "Four parts run a review, and this plan changes all four. The plan-to-video skill turns a plan into a video. The review player plays it and takes your answers. resolve-plan writes your answers into the plan. The reel CLI checks each plan and keeps the record."
- duration: 14.571s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-today.html
- knowledge: new,familiar
- type: pain_point
- persuasion: Before state on the real stage + named cast
- beat: Orientation
- blueprint: compose
- focal: the four parts, one at a time
- roles: nodes = foreground · chips = plain names · paper ground = background
- sfx: none

narrativeRole: Today: 4 parts run a review.
keyMessage: Four parts run a review, and this plan changes all four.

Scene 1 (0.0–2.4s): kicker 'Today · 4 parts'. Empty paper.
Scene 2 (2.4–5s): 'plan-to-video skill' — the node lands coral with chip 'plan → video' above it; settles to ink.
Scene 3 (5–7.5s): 'review player' — the node lands coral, chip 'you watch and answer' under it.
Scene 4 (7.5–10s): 'resolve-plan' — edge player→resolve-plan draws; the node lands coral, chip 'writes answers in' above it.
Scene 5 (10–13s): 'reel CLI' — edge resolve-plan→reel CLI draws; the node lands coral, chip 'checks, keeps record' above it.
Scene 6 (last 1.5s): the four parts in ink, nothing coral. Held.

## Frame 3 — Step 1: up to 4 options

- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Up to 4 options'; the spine's first tick lights; the question sheet from the hook, now a 2×2 grid: A and B take the top row, the missing C lands in the bottom row at the same text size, and a dashed fourth cell 'room for D' beside it; on 'stores a list' a mono chip 'options: a, b, c' under the sheet; on 'argue for' nothing new — the grid holds
- voiceover: "Step one: up to four options, each with its own branch. The player sets them in a grid that fits four at full text size. resolve-plan already stores a list. And the style guide adds a rule: every option must be one someone would argue for."
- duration: 13.931s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-step-1.html
- type: feature_showcase
- persuasion: Prototype of the thing, before → after
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- focal: the four-card grid
- roles: question sheet = foreground · spine = anchor · chip = the worked example
- sfx: none

narrativeRole: Step 1: up to 4 options.
keyMessage: Step one: up to four options, each with its own branch.

Scene 1 (0.0–1.2s): 'Step one' — kicker, spine tick 1 coral.
Scene 2 (1.2–4.5s): the sheet lands with A and B side by side (the old layout).
Scene 3 (4.5–8.5s): on 'grid' A and B settle into the top row; C lands in the bottom row, coral border (the answer the hook lost); the dashed cell 'room for D' beside it.
Scene 4 (8.5–end): on 'stores a list' the chip 'options: a, b, c' lands under the sheet (ink). Held.

## Frame 4 — Next: part 2

- scene: RAIL (full): slot 1 filled; 'Next · Part 2' in mono beside the rail with the hero line 'Pick all that apply'
- voiceover: "Next, part two: questions where you can tick more than one answer."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two: questions where you can tick more than one answer.

Scene 1 (0.0–end): the rail as resolved so far; the mono line 'Next · Part 2' and the hero. Held still.

## Frame 5 — Part 2 of 4

- chapter_start: Step 2: pick all that apply
- scene: RAIL (full): slot 1 filled; slot 2 lifts from dashed to filled; kicker 'Part 2 of 4'; hero 'Up to 4 options, banked'
- voiceover: "Part two of four. A question can now have up to four options. What if more than one is right?"
- duration: 5.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-opener-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 4.
keyMessage: Part two of four.

Scene 1 (0.0–end): kicker; hero; slot 2 fills on 'more than one'. Held.

## Frame 6 — Step 2: pick all that apply

- scene: SPINE + PROTOTYPE: kicker 'Step 2 · Pick all that apply'; the question sheet with four options as tick boxes and a 'Confirm' button; A and C tick on 'tick'; Confirm presses on 'confirm'; on 'records' a ledger row 'q1 · a, c' lands under the sheet; on 'open question' the space after the sheet shows a dashed '?' frame
- voiceover: "Step two: a question can be pick-all-that-apply. You tick any number of options, then confirm. The ledger records the whole set, and resolve-plan lists every picked option under its step. What the video plays next is the open question."
- duration: 13.013s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-step-2.html
- type: feature_showcase
- persuasion: Worked example with real values
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- focal: two ticks becoming one ledger row
- roles: question sheet = foreground · ledger row = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 2: pick all that apply.
keyMessage: Step two: a question can be pick-all-that-apply.

Scene 1 (0.0–1.2s): 'Step two' — kicker, spine tick 2 coral.
Scene 2 (1.2–4s): the sheet lands: 'Which formats ship first?' with four tick boxes: 'Web', 'PDF', 'Slides', 'Email'.
Scene 3 (4–6.5s): on 'tick' A ('Web') and C ('Slides') tick; on 'confirm' the Confirm button fills.
Scene 4 (6.5–11s): on 'records' the ledger row 'q1 · a, c' lands under the sheet (coral left rule — the one coral).
Scene 5 (11–end): on 'plays next' a dashed empty frame with the mono label 'then: ?' to the right of the ledger row. Held.

## Frame 7 — Choice 1: what plays after a pick-all?

- scene: SPINE + THREE OPTION CARDS (a decision about what the video plays, so each card shows the playback as a strip of frames): A 'Every picked branch' — strip [Q][A][C]; B 'One summary frame' — strip [Q][Picks]; C 'Branchless only' — strip [Q] then straight on; on 'I recommend' B takes the coral border
- voiceover: "First choice: what plays after a pick-all answer? Every picked branch shows each pick, but grows with each tick. One summary frame is always short, but hides what each pick changes. No branches on these questions is simplest, but costs the richer ones. I recommend one summary frame, because pick-all is usually about scope. Which one?"
- duration: 18.389s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-decision-1.html
- type: cta
- persuasion: Comparison of three options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 2
- decision: q1
- question: After a pick-all-that-apply answer, what does the video play?
- option_a: Every picked branch
- option_b: One summary frame
- option_c: Branchless only
- why_a: you see the consequence of each pick; costs watch time that grows with every tick
- why_b: short and always the same length; costs seeing what each pick means in the plan
- why_c: simplest to build and to watch; costs the richer questions that need branches
- recommended: b
- focal: the three option cards
- roles: option cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Choice 1: what plays after a pick-all?.
keyMessage: First choice: what plays after a pick-all answer? Every picked branch shows each pick, but grows with each tick.

Scene 1 (0.0–1.5s): kicker 'Choice 1 · Step 2'; spine tick 2 coral.
Scene 2 (1.5–6s): card A lands on 'Every picked branch'; its strip adds a frame per tick.
Scene 3 (6–10s): card B lands on 'One summary frame'.
Scene 4 (10–15s): card C lands on 'No branches'.
Scene 5 (15–end): 'I recommend' — B's border coral (the tick hands it off). Held.

## Frame 8 — If every picked branch plays

- scene: RAIL (full): slot 2 takes its tag 'All branches'; hero '+1 branch per tick'
- voiceover: "With every picked branch, two ticks play two branch beats, and four ticks play four."
- duration: 5.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-branch-1a.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 2
- branch: q1=a
- focal: the tag on slot 2
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If every picked branch plays.
keyMessage: With every picked branch, two ticks play two branch beats, and four ticks play four.

Scene 1 (0.0–0.4s): rail as step 2 left it.
Scene 2 (0.4–end): the tag lands on slot 2 (coral), hero beside. Held.

## Frame 9 — If one summary frame plays

- scene: RAIL (full): slot 2 takes 'One summary'; hero '1 frame, any picks'
- voiceover: "With one summary frame, any number of ticks plays one frame that lists the picks, then moves on."
- duration: 5.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-branch-1b.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 2
- branch: q1=b
- focal: the tag on slot 2
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If one summary frame plays.
keyMessage: With one summary frame, any number of ticks plays one frame that lists the picks, then moves on.

Scene 1 (0.0–0.4s): rail as step 2 left it.
Scene 2 (0.4–end): the tag lands on slot 2 (coral), hero beside. Held.

## Frame 10 — If only branchless questions allow it

- scene: RAIL (full): slot 2 takes 'No branches'; hero 'No branch beats'
- voiceover: "With branchless questions only, a pick-all question has no branch beats at all, and the video just carries on."
- duration: 6.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-branch-1c.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 2
- branch: q1=c
- focal: the tag on slot 2
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If only branchless questions allow it.
keyMessage: With branchless questions only, a pick-all question has no branch beats at all, and the video just carries on.

Scene 1 (0.0–0.4s): rail as step 2 left it.
Scene 2 (0.4–end): the tag lands on slot 2 (coral), hero beside. Held.

## Frame 11 — Next: part 3

- scene: RAIL (full): slots 1–2 filled, slot 2 with its tag; 'Next · Part 3' and the hero 'Count, marks, diagrams'
- voiceover: "Next, part three: how many questions, words on a mark, and diagrams you can follow."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-closer-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three: how many questions, words on a mark, and diagrams you can follow.

Scene 1 (0.0–end): held still.

## Frame 12 — Part 3 of 4

- chapter_start: Steps 3 to 5: count, marks, diagrams
- scene: RAIL (full): slots 1–2 filled with slot 2's tag; slots 3, 4 and 5 lift to filled; kicker 'Part 3 of 4'; hero 'Any shape of question'
- voiceover: "Part three of four. Questions can take any shape now. Next is how many a plan should ask."
- duration: 5.3s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-opener-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 3 of 4.
keyMessage: Part three of four.

Scene 1 (0.0–end): kicker; hero; slots 3–5 fill on 'how many'. Held.

## Frame 13 — Step 3: as many questions as it needs

- scene: SPINE + PROTOTYPE: kicker 'Step 3 · As many as needed'; a plan's question list 'q1'…'q5' on the left; on 'five parts' five part cards land to the right, one question each, joined by hairlines; on 'reel check' a terminal line lands under them: 'reel check · 7 open questions · warn'
- voiceover: "Step three: a plan asks every question it leaves open, not about three. The limit moves to the part: one decision per part of about a minute, so five questions make five parts. reel check warns past six, because a plan that open is not ready."
- duration: 14.485s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-step-3.html
- type: feature_showcase
- persuasion: Worked example with real values
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- focal: five questions becoming five parts
- roles: plan page + part cards = foreground · terminal line = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 3: as many questions as it needs.
keyMessage: Step three: a plan asks every question it leaves open, not about three.

Scene 1 (0.0–1.2s): 'Step three' — kicker, spine tick 3 coral.
Scene 2 (1.2–5s): the plan page lands with its five question rows 'q1'…'q5'.
Scene 3 (5–10s): on 'five parts' five part cards 'Part 1'…'Part 5' land in a column right of the page, one per row, a hairline from each question to its part; coral hands from the tick to the hairline set.
Scene 4 (10–end): on 'reel check' the terminal line lands under the page (ink); the word 'warn' is the coral. Held.

## Frame 14 — Step 4: type on the mark

- scene: SPINE + PROTOTYPE: kicker 'Step 4 · Type on the mark'; a paused video frame (the player at 1:12, 'paused' chip) with a drawn arrow on it; on 'text box' a small text box opens beside the arrow's head; 'Why only two options?' types into it; on 'Enter' the box settles and a record row lands under the frame: '1:12 · step 1 · arrow · "Why only two options?"'
- voiceover: "Step four: when you finish a mark, a small text box opens right beside it, and the video stays paused. Type and press Enter, and the words become that mark's comment, at the same moment and step. Escape leaves the mark without words, as today."
- duration: 13.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-step-4.html
- type: feature_showcase
- persuasion: Prototype of the thing
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- focal: the words typed beside the mark
- roles: paused frame = foreground · text box = the new thing · record row = the worked example
- sfx: none

narrativeRole: Step 4: type on the mark.
keyMessage: Step four: when you finish a mark, a small text box opens right beside it, and the video stays paused.

Scene 1 (0.0–1.2s): 'Step four' — kicker, spine tick 4 coral.
Scene 2 (1.2–4s): the paused frame lands (1100×520) with a coral arrow drawn onto it as the mark.
Scene 3 (4–8s): on 'text box' the box opens beside the arrow head; the words type in.
Scene 4 (8–12s): on 'Enter' the box border settles to ink; the record row lands under the frame.
Scene 5 (12–end): on 'Escape' nothing new; held.

## Frame 15 — Step 5: diagrams a newcomer can follow

- scene: SPINE + PROTOTYPE, before → after: kicker 'Step 5 · Diagrams to follow'; left, a miniature of the close-the-lifecycle resolved frame (its ten parts and eleven edges, real names) with a coral chip '10 parts at once'; on 'frame lint' a mono rule card '≤ 6 parts · 1 new per beat' lands; on 'ending' a miniature of the new ending (six steps with their choices, no diagram) lands right
- voiceover: "Step five: the last video ended on ten parts at once, and its reviewer could not follow it. The frame lint now enforces at most six parts on screen, one new thing per beat, and plain names. The ending shows the steps and your choices instead."
- duration: 14.251s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-step-5.html
- type: feature_showcase
- persuasion: Before → after on the real artefact
- beat: Comprehension
- blueprint: compose
- plan_step: 5
- focal: the dense map against the rule
- roles: old ending miniature = before · rule card / new ending = after · spine = anchor
- sfx: none

narrativeRole: Step 5: diagrams a newcomer can follow.
keyMessage: Step five: the last video ended on ten parts at once, and its reviewer could not follow it.

Scene 1 (0.0–1.2s): 'Step five' — kicker, spine tick 5 coral.
Scene 2 (1.2–5s): on 'ten parts' the dense miniature lands left (720×405); coral hands to its chip '10 parts at once'.
Scene 3 (5–10s): on 'frame lint' the rule card lands centre-right: '≤ 6 parts on screen', '1 new thing per beat', 'plain names' — one line per spoken clause.
Scene 4 (10–end): on 'ending' the new-ending miniature (six step rows, two with choice tags) replaces the rule card on the right. Held.

## Frame 16 — Next: part 4

- scene: RAIL (full): slots 1–5 filled, slot 2 with its tag; 'Next · Part 4' and the hero 'What only video knows'
- voiceover: "Next, the last part: what only a video can tell us."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-closer-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, the last part: what only a video can tell us.

Scene 1 (0.0–end): held still.

## Frame 17 — Part 4 of 4

- chapter_start: Step 6, and the plan
- scene: RAIL (full): slots 1–5 filled with slot 2's tag; slot 6 lifts to filled; kicker 'Part 4 of 4'; hero 'Words on marks, small diagrams'
- voiceover: "Part four of four. Marks carry words now, and diagrams stay small. Last, the feedback only a video can give."
- duration: 6.9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-opener-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 4 of 4.
keyMessage: Part four of four.

Scene 1 (0.0–end): kicker; hero; slot 6 fills on 'feedback'. Held.

## Frame 18 — Step 6: feedback only a video can give

- scene: SPINE + FULL STAGE (the four parts from the today beat, dim, with their two edges): the review player lights with chip 'rewound 2× · 1:12'; on 'sends those moments' the edge player→resolve-plan draws coral; resolve-plan lights; on 'hard to follow' a plan.resolved.md page lands right of the player with the line '1:12 · hard to follow here' under 'Step 3'
- voiceover: "Step six: the player already knows where you rewound or slowed down. The review now sends those moments to the agent, and resolve-plan marks each on its step as hard to follow here. They are prompts to explain more plainly, not comments."
- duration: 13.611s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-step-6.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Comprehension
- blueprint: compose
- plan_step: 6
- focal: a rewind becoming a line in the resolved plan
- roles: stage = foreground · resolved page = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 6: feedback only a video can give.
keyMessage: Step six: the player already knows where you rewound or slowed down.

Scene 1 (0.0–1.2s): 'Step six' — kicker, spine tick 6 coral; the four parts at 0.72, edges dim.
Scene 2 (1.2–4.5s): on 'rewound' the review player lifts and takes the coral; chip 'rewound 2× · 1:12' under it.
Scene 3 (4.5–8s): on 'sends' the player→resolve-plan edge draws (coral), resolve-plan lifts; the player lets the coral go.
Scene 4 (8–12s): on 'hard to follow' the page lands (560×300) right of the player; its row '1:12 · hard to follow here' takes the coral left rule.
Scene 5 (12–end): on 'prompts' nothing new. Held.

## Frame 19 — Choice 2: which signal comes first?

- scene: SPINE + THREE OPTION CARDS (a decision about what the reviewer does, so each card shows the player's bar under that option): A 'Automatic rewinds' — a timeline with two rewind ticks sent on their own; B 'A lost-me button' — the bar with a 'Lost me here' button; C 'Both' — the ticks and the button; on 'I recommend' A takes the coral border
- voiceover: "Last choice: which signal comes first? Automatic rewinds ask nothing of you, but a rewind can mean interesting, not lost. A lost-me button is clear, but you must remember to press it, and the last one went unused. Both gives the most signal and the most work. I recommend automatic rewinds, since they are only prompts. Which one?"
- duration: 18.176s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-decision-2.html
- type: cta
- persuasion: Comparison of three options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 6
- decision: q2
- question: Which video-only feedback comes first?
- option_a: Automatic rewinds
- option_b: A lost-me button
- option_c: Both
- why_a: no extra effort from the reviewer; costs precision: a rewind can mean 'interesting' as well as 'lost me'
- why_b: clear intent; costs a button the reviewer has to remember to press (the old 'Wait, what?' button was dropped for being unused)
- why_c: the most signal; costs the most to build and to read
- recommended: a
- focal: the three option cards
- roles: option cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Choice 2: which signal comes first?.
keyMessage: Last choice: which signal comes first? Automatic rewinds ask nothing of you, but a rewind can mean interesting, not lost.

Scene 1 (0.0–1.5s): kicker 'Choice 2 · Step 6'; spine tick 6 coral.
Scene 2 (1.5–6s): card A lands on 'Automatic rewinds'.
Scene 3 (6–11s): card B lands on 'lost-me button'.
Scene 4 (11–14s): card C lands on 'Both'.
Scene 5 (14–end): 'I recommend' — A's border coral. Held.

## Frame 20 — If rewinds are sent automatically

- scene: RAIL (full): slot 6 takes 'Rewinds'; hero 'Nothing to press'
- voiceover: "With automatic rewinds, you just watch, and every rewind reaches the agent as a possible hard spot."
- duration: 6.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-branch-2a.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 6
- branch: q2=a
- focal: the tag on slot 6
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If rewinds are sent automatically.
keyMessage: With automatic rewinds, you just watch, and every rewind reaches the agent as a possible hard spot.

Scene 1 (0.0–0.4s): rail.
Scene 2 (0.4–end): tag lands (coral), hero. Held.

## Frame 21 — If you press a lost-me button

- scene: RAIL (full): slot 6 takes 'Lost-me tap'; hero 'Only what you press'
- voiceover: "With a lost-me button, only the moments you press reach the agent, and each one is meant."
- duration: 5.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-branch-2b.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 6
- branch: q2=b
- focal: the tag on slot 6
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If you press a lost-me button.
keyMessage: With a lost-me button, only the moments you press reach the agent, and each one is meant.

Scene 1 (0.0–0.4s): rail.
Scene 2 (0.4–end): tag lands (coral), hero. Held.

## Frame 22 — If both are sent

- scene: RAIL (full): slot 6 takes 'Both'; hero 'Rewinds + presses'
- voiceover: "With both, the agent gets every rewind and every press, and has twice as much to sort through."
- duration: 5.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-branch-2c.html
- type: benefit_highlight
- persuasion: Consequence of the choice
- beat: Resolution
- blueprint: compose
- plan_step: 6
- branch: q2=c
- focal: the tag on slot 6
- roles: rail = foreground · hero = supporting
- sfx: none

narrativeRole: If both are sent.
keyMessage: With both, the agent gets every rewind and every press, and has twice as much to sort through.

Scene 1 (0.0–0.4s): rail.
Scene 2 (0.4–end): tag lands (coral), hero. Held.

## Frame 23 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram (step 5's own rule): the six steps as a list at reading size, centred; steps 2 and 6 carry their choice tags (the recommended defaults; the player rewrites them); no coral; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: six steps and your two choices. Draw on any step to ask for a change, or approve it."
- duration: 8.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-resolved.html
- type: cta
- persuasion: Resolved plan + call to action
- beat: Resolve
- blueprint: compose
- plan_questions: 1,2
- focal: the six steps and the two choices
- roles: step list = foreground · paper ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That is the plan: six steps and your two choices.

Scene 1 (0.0–0.8s): the list settles in.
Scene 2 (0.8–end): held dead still.
