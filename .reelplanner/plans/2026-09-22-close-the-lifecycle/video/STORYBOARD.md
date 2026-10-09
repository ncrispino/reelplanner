---
title: "Close the lifecycle: implement to the plan, walk it through, keep one system video current"
format: 1920x1080
duration: 183s
message: "The review half works; this plan builds the half after approve"
arc: how-to-process, decisions in force, in four parts
audience: the engineer reviewing reelplanning's own plan before approving it
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-close-the-lifecycle
---

## Video direction

- A SERIES OF FOUR PARTS (style guide §16): `chapter_start` on frames 1, 7, 11 and 14; each part opens on the stage as resolved so far and closes by naming the next part. About a minute each.
- Built from the project record (§14): node names from `glossary.md`, the stage from `.reelplanning/system.json` via `reel stage` (kind `dataflow`, reason in the file), the look from `.reelplanning/theme/frame.md`. Revised from its review: the three questions are decided (D-001..D-003, `plan.md` **Decisions in force**), so per §14 none is asked; steps 3, 5 and 6 carry a `decided · D-00n` tag on their slot and one narrated sentence, and there are no decision or branch beats. Nothing superseded.
- THE STAGE (§18): the review loop that exists today is the upper rectangle (review player → resolve-plan → the reel CLI → the revise step → finish-project → plan-diff → review player). The build loop this plan adds runs along the bottom (the implement step → review player → resolve-walkthrough → the walkthrough fix step → finish-project; resolve-walkthrough → the system video). The full stage appears on the today and cast beats and on steps 4 and 5; steps 1, 2, 3 and 6 show the thing itself beside the rail; openers and closers are rail only. The resolved plan is the rail and the three decisions, not the diagram (the review found the full map there too hard to read).
- Edges are inherited: the review loop's six from frame 2 on (dim); the build loop's five drawn once as a beat in the cast, then by the step that uses them (4: implement→player; 5: player→resolve-walkthrough→fix step→finish-project).
- Palette: cream ground, ink voice, coral as the single signal per frame (#CC785C borders/edges, #A5614A small tags). No navy node: this system has no data store on the stage.
- Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift, no exits except none; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.


## Frame 1 — Approved, and then nothing

- chapter_start: The problem, steps 1 and 2
- scene: PROTOTYPE, no stage: the resolved plan as a page (title 'plan.resolved.md', three decision rows, an 'Approved' stamp) on the left; on 'writes the code' a branch-diff page lands on the right; on 'nothing checks' the gap between them takes a coral 'no check' mark
- voiceover: "A reviewer approves a plan and makes three calls on it. Then an agent writes the code, and nothing checks that the code keeps those calls."
- duration: 7.445s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete failure with stakes
- beat: Recognition
- blueprint: compose
- focal: the gap between the approved plan and the code
- roles: plan page + diff page = foreground · 'no check' chip = the signal · cream ground = background
- sfx: none

narrativeRole: Approved, and then nothing.
keyMessage: A reviewer approves a plan and makes three calls on it.

Scene 1 (0.0–3.2s): the resolved-plan page (560×600, cream, hairline) centred-left; its three rows 'q1 · A', 'q2 · A', 'q3 · A' land on 'three calls'; the ink 'Approved' stamp lands on 'approves'.
Scene 2 (3.2–5.4s): on 'writes the code' a diff page (560×600) lands right: added / removed lines as green-free ink bars with + / − gutters, a path line 'src/…' in mono.
Scene 3 (5.4–end): on 'nothing checks' a dashed hairline between the pages and a coral mono chip 'no check' on it — the one coral. Held.

## Frame 2 — Today: the review loop

- scene: FULL DIAGRAM, no rail (brownfield today beat): the review loop's six nodes light one per spoken name and its six edges draw in pipeline order; the lower row shows resolve-walkthrough dim and three dashed empty places where the new parts will go
- voiceover: "Today, reelplanning covers the first half. You decide in the review player, resolve-plan and the reel CLI record your calls, the revise step rewrites the plan, and plan-diff offers only the beats that changed."
- duration: 12.075s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-today.html
- knowledge: new,familiar
- type: pain_point
- persuasion: Before state on the real stage
- beat: Orientation
- blueprint: compose
- focal: the review loop
- roles: review loop = foreground · dashed places = supporting · cream ground = background
- sfx: none

narrativeRole: Today: the review loop.
keyMessage: Today, reelplanning covers the first half.

Scene 1 (0.0–1.6s): all review-loop nodes at 0.72; resolve-walkthrough at 0.72; three dashed empty boxes at the implement step, the walkthrough fix step and the system video places. No edges.
Scene 2 (1.6–12s): 'review player' → player coral; 'resolve-plan' → edge player→resolve draws, coral hands to resolve; 'reel CLI' → resolve→cli; 'revise step' → cli→revise; 'plan-diff' → revise→finish, finish→diff, diff→player draw; each edge settles to ink as the next draws.
Scene 3 (last 1.5s): the loop in ink, nothing coral. Held.

## Frame 3 — The missing half, and 3 new parts

- scene: FULL STAGE, assembled: the rail's six slots fade in dashed; the three dashed places fill as nodes on their names; on 'build loop' the five build-loop edges draw as a beat of their own; the whole map holds ≥1.5s
- voiceover: "The second half is missing. Nothing holds the code to the plan, a flagged call goes nowhere, and a newcomer has nothing to watch. This plan adds the implement step, the walkthrough fix step and the system video, and joins them into a build loop."
- duration: 15.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-cast.html
- knowledge: new,familiar
- type: product_intro
- persuasion: Named cast
- beat: Orientation
- blueprint: compose
- focal: the three new nodes
- roles: nodes = foreground · rail = anchor · cream ground = background
- sfx: none

narrativeRole: The missing half, and 3 new parts.
keyMessage: The second half is missing.

Scene 1 (0.0–7.5s): review loop in ink (inherited), dim; the three dashed places pulse nothing — they stay dashed while the gaps are named; the rail's six dashed slots fade in.
Scene 2 (7.5–12s): 'implement step', 'walkthrough fix step', 'system video' — each dashed box becomes its node, coral while named, then ink.
Scene 3 (12–14s): 'build loop' — implement→player, player→resolve-walkthrough, resolve-walkthrough→fix step, fix step→finish-project, resolve-walkthrough→system video draw in that order, coral while drawing, then ink.
Scene 4 (last 1.5s): the whole map, held.

## Frame 4 — Step 1: the system video

- scene: RAIL + PROTOTYPE: slot 1 fills 'System video'; right of the rail a strip of four frame thumbnails of the system video (a purpose line, the parts, a pipeline, the invariants) lands one per spoken section; on 'tagged' a mono tag lands under each; the 'Pipelines' tag is the coral example
- voiceover: "Step one, the system video. A new system mode turns the spec, the system map and the glossary into one video for someone new: purpose, parts, pipelines, invariants. Every frame is tagged with the spec section it explains, so a later change can find its frames."
- duration: 15.019s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Prototype of the thing
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- focal: the system video's frames and their section tags
- roles: thumbnails = foreground · rail = anchor · tags = supporting
- sfx: none

narrativeRole: Step 1: the system video.
keyMessage: Step one, the system video.

Scene 1 (0.0–1.2s): 'Step one' — slot 1 fills and takes the coral border.
Scene 2 (1.2–9s): four 16:9 thumbnails (300×170, 2×2 grid right of the rail) land on 'purpose', 'parts', 'pipelines', 'invariants'.
Scene 3 (9–13s): on 'tagged' four mono tags '§ Purpose', '§ Parts', '§ Pipelines', '§ Invariants' land under the thumbs; coral hands from the slot to '§ Pipelines'. Held.

## Frame 5 — Step 2: implement, and log each call

- scene: RAIL + PROTOTYPE: slot 2 fills 'Implement + log'; right of the rail the autonomy log of walkthrough.md as a real table (id · chose · instead of · why · where); on 'four-oh-nine' row A2 types in (the coral); on 'a call is' two mono lines under the table say what counts ('a call · a default, an error code, a library') and what does not ('not a call · a variable name, file layout'); on 'a dozen' a row budget 'one row per choice · about 12 max'
- voiceover: "Step two, the implement step. The agent builds from the resolved plan, with the decisions in force as rules, not suggestions. Each call the plan did not cover, like returning four-oh-nine instead of four hundred, goes into the autonomy log the moment it is made. A call is a choice you could have made the other way, like a default or a library, never a variable name. One row per choice; past about a dozen, the plan left too much open."
- duration: 22.933s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-step-2.html
- type: feature_showcase
- persuasion: Worked example with real values
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- focal: the autonomy row as it is written, and what counts as one
- roles: log page = foreground · rail = anchor · cream ground = background
- sfx: none

narrativeRole: Step 2: implement, and log each call.
keyMessage: Step two, the implement step.

Scene 1 (0.0–1.2s): 'Step two' — slot 2 fills, coral.
Scene 2 (1.2–7s): the walkthrough.md page lands (1160×520): heading 'Autonomy log', a header row, one earlier row in ink.
Scene 3 (on 'four-oh-nine'): a row types in: 'A2 · 409 · 400 · a retry is safe · resume.ts:41'; coral hands from the slot to the new row's left rule.
Scene 4 (on 'A call is'): 'a call · a default, an error code, a library' lands under the table; on 'never a variable name' 'not a call · a variable name, file layout' lands under it (dimmer).
Scene 5 (on 'a dozen'): the budget line 'one row per choice · about 12 max' lands right. Held.

## Frame 6 — Next: part 2

- scene: RAIL ONLY: slots 1 and 2 filled; 'Next · Part 2' in mono beside the rail
- voiceover: "Next, part two: who checks the code, and the walkthrough."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two: who checks the code, and the walkthrough.

Scene 1 (0.0–end): the rail as resolved so far; slot 3 and 4 outlines darken slightly; the mono line 'Next · Part 2'. Held still.

## Frame 7 — Part 2 of 4

- chapter_start: Steps 3 and 4: check, then walk through
- scene: RAIL ONLY: slots 1–2 filled; slots 3 and 4 lift from dashed to filled as this part's steps; kicker 'PART 2 OF 4'
- voiceover: "Part two of four. The code is written, and every call it made is logged. Now, who checks it?"
- duration: 5.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-opener-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Part 2 of 4.
keyMessage: Part two of four.

Scene 1 (0.0–end): kicker; slots 3 and 4 fill on 'who checks it'. Held.

## Frame 8 — Step 3: check the diff first

- scene: RAIL + PROTOTYPE (the diagram gives way to the thing being decided): slot 3 lit; on 'reel audit' a terminal line '$ reel audit' with 'fail · step 4 has no entry' lands top right; on 'a second agent' a bar 'The orchestrating session' and, under it, the checker's run 'A second agent · fresh run'; on 'as you decided' slot 3 takes its tag 'decided · D-001'; on 'the plan, the ledger and the diff' three file rows land inside the checker's run; on 'never the implementer' the implementer's run lands left of it (its conversation, its reasons), divided from it by a dashed line 'nothing shared'
- voiceover: "Step three: check the diff before any video is built. First, reel audit fails when a plan step has no entry in the report. Then a second agent reads the diff, as you decided in the review. It is a fresh, separate run that holds only the plan, the ledger and the diff. The orchestrating session starts it, never the implementer, so it cannot inherit the implementer's reasons."
- duration: 20.309s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-step-3.html
- type: feature_showcase
- persuasion: Prototype of the run boundary
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- decided: D-001
- focal: the checker's fresh run and what it holds
- roles: two runs = foreground · rail = anchor · audit line = the floor
- sfx: none

narrativeRole: Step 3: check the diff first.
keyMessage: Step three: check the diff before any video is built.

Scene 1 (0.0–1.2s): 'Step three' — slot 3 lights.
Scene 2 ('reel audit'): the terminal line lands top right; coral hands to 'fail · step 4 has no entry'.
Scene 3 ('a second agent'): the orchestrator bar lands, then the checker's run under it, joined by a line 'starts'; coral to the checker's run.
Scene 4 ('as you decided'): slot 3's title lifts and 'decided · D-001' lands under it (small mono, #A5614A). One sentence; the alternatives are not re-explained (§14).
Scene 5 ('the plan, the ledger and the diff'): three rows land in the checker's run: 'plan.resolved.md', 'the ledger', 'the branch diff'.
Scene 6 ('never the implementer'): the implementer's run lands left ('its conversation', 'its reasons'), not joined to the checker; a dashed divider and 'nothing shared' between the runs. Held.

## Frame 9 — Step 4: walk through the real code

- scene: FULL STAGE: slot 4 lit; on 'built from that report' the edge implement step → review player draws coral; the player takes the coral; chip 'A2 · Accept / Flag' under the player
- voiceover: "Step four: the walkthrough is built from that report, with the existing walkthrough mode, on the same stage as the plan video. Every logged call becomes an Accept or Flag beat, and every deviation is said plainly. It is the first walkthrough of code an agent really wrote."
- duration: 15.403s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-step-4.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- focal: the implement step → review player edge
- roles: diagram = foreground · rail = anchor · chip = the worked example
- sfx: none

narrativeRole: Step 4: walk through the real code.
keyMessage: Step four: the walkthrough is built from that report, with the existing walkthrough mode, on the same stage as the plan video.

Scene 1 (0.0–1.2s): 'Step four' — slot 4 lights.
Scene 2 (1.2–5s): the implement→player edge draws, coral, then ink.
Scene 3 (5–10s): 'Accept or Flag' — the player coral; chip under it.
Scene 4 (10–end): held.

## Frame 10 — Next: part 3

- scene: RAIL ONLY: slots 1–4 filled, slot 3 with its tag; 'Next · Part 3'
- voiceover: "Next, part three: what happens to a flagged call."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-closer-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three: what happens to a flagged call.

Scene 1 (0.0–end): held still; 'Next · Part 3'.

## Frame 11 — Part 3 of 4

- chapter_start: Step 5: act on the walkthrough review
- scene: RAIL ONLY: slots 1–4 filled with slot 3's tag; slot 5 lifts to filled; kicker 'PART 3 OF 4'
- voiceover: "Part three of four. The walkthrough has been watched, and every logged call has a verdict."
- duration: 4.859s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-opener-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Part 3 of 4.
keyMessage: Part three of four.

Scene 1 (0.0–end): kicker; slot 5 fills on 'verdict'. Held.

## Frame 12 — Step 5: act on the verdicts

- scene: FULL STAGE: slot 5 lit; edges review player → resolve-walkthrough → walkthrough fix step → finish-project draw one per spoken step, coral while drawing; chips 'A1 → ledger' under resolve-walkthrough and 'A2 → 1 beat' under the fix step; on 'as you decided' slot 5 takes 'decided · D-002'; on 'new plan' a chip 'A3 overturns D-00n → new plan' under the fix step
- voiceover: "Step five: act on the verdicts. An accepted call becomes a ledger entry, so the next plan cannot quietly undo it. A flagged call goes to the walkthrough fix step, which rewrites the code and rebuilds only that beat, as you decided. And a comment that would overturn a ledger decision is not fixed in place: it becomes a new plan."
- duration: 19.029s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-step-5.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Comprehension
- blueprint: compose
- plan_step: 5
- decided: D-002
- focal: the fix step's path back into finish-project
- roles: diagram = foreground · rail = anchor · chips = the worked example
- sfx: none

narrativeRole: Step 5: act on the verdicts.
keyMessage: Step five: act on the verdicts.

Scene 1 (0.0–1.2s): 'Step five' — slot 5 lights.
Scene 2 (1.2–6s): player→resolve-walkthrough draws; on 'ledger entry' chip 'A1 → ledger' under resolve-walkthrough.
Scene 3 ('walkthrough fix step'): resolve-walkthrough→fix step draws; the fix step coral.
Scene 4 ('rebuilds only that beat'): fix step→finish-project draws; chip 'A2 → 1 beat' under the fix step (right-aligned).
Scene 5 ('as you decided'): slot 5's title lifts and 'decided · D-002' lands under it.
Scene 6 ('new plan'): chip 'A3 overturns a decision → new plan' lands under 'A2 → 1 beat'; the coral moves to it. Held.

## Frame 13 — Next: part 4

- scene: RAIL ONLY: slots 1–5 filled with their tags; 'Next · Part 4'
- voiceover: "Next, the last part: keeping the system video current."
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-closer-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, the last part: keeping the system video current.

Scene 1 (0.0–end): held still; 'Next · Part 4'.

## Frame 14 — Part 4 of 4

- chapter_start: Step 6, and the plan
- scene: RAIL ONLY: slots 1–5 filled with tags; slot 6 lifts to filled; kicker 'PART 4 OF 4'
- voiceover: "Part four of four. Flags are fixed, and accepted calls are in the ledger."
- duration: 4.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-opener-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · cream ground = background
- sfx: none

narrativeRole: Part 4 of 4.
keyMessage: Part four of four.

Scene 1 (0.0–end): kicker; slot 6 fills on 'ledger'. Held.

## Frame 15 — Step 6: keep the system video current

- scene: RAIL + PROTOTYPE (the cost of an update, not the diagram): slot 6 lit; on 'as you decided' slot 6 takes 'decided · D-003'; on 'only the frames tagged' a line 'accepted → spec-diff → 2 of 16 frames'; on 'cheap' three rows land one per spoken point: TEXT 'Updated in the background' · 'ready to build'; NARRATION 'Only the changed lines' · '2 lines'; RENDER 'Only when someone asks' · 'not built'
- voiceover: "Step six. After every accepted walkthrough, as you decided, the agent updates the spec for what landed, and the system video rebuilds only the frames tagged with what changed. It has to stay cheap. The text is updated in the background, so the video is always ready to build. Only the changed lines get new narration. And nothing renders until someone asks."
- duration: 20.288s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-step-6.html
- type: feature_showcase
- persuasion: Worked example of what one update costs
- beat: Comprehension
- blueprint: compose
- plan_step: 6
- decided: D-003
- focal: the three cost rows
- roles: cost rows = foreground · rail = anchor · the frame count = the worked example
- sfx: none

narrativeRole: Step 6: keep the system video current.
keyMessage: Step six.

Scene 1 (0.0–1.2s): 'Step six' — slot 6 lights.
Scene 2 ('as you decided'): slot 6's title lifts and 'decided · D-003' lands under it.
Scene 3 ('only the frames tagged'): the line 'accepted → spec-diff → 2 of 16 frames' lands top right; coral to '2 of 16 frames'.
Scene 4 ('in the background'): row TEXT lands, status 'ready to build'; coral to it.
Scene 5 ('changed lines'): row NARRATION lands, status '2 lines'; coral to it.
Scene 6 ('nothing renders'): row RENDER lands, status 'not built'; coral to it. Held.

## Frame 16 — The plan, resolved

- scene: RAIL + THE THREE DECISIONS, no diagram (the reviewer found the full component map on this frame too much): all six slots filled, slots 3, 5 and 6 carry 'decided · D-00n'; right of the rail a heading 'Decided in the review' and three cards, one per decision in force, with its step; no coral; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: six steps, and the three calls you made, now in force. Draw on any step to ask for a change, or approve it."
- duration: 8.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-resolved.html
- type: cta
- persuasion: Resolved plan, simplified + call to action
- beat: Resolve
- blueprint: compose
- focal: the six steps and the three decisions
- roles: rail + decision cards = foreground · cream ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That is the plan: six steps, and the three calls you made, now in force.

Scene 1 (0.0–0.8s): the rail and the three cards settle in (D-001 · step 3 'A second agent checks the diff'; D-002 · step 5 'A flagged call is fixed, and its beat rebuilt'; D-003 · step 6 'The system video updates after every accept, cheaply').
Scene 2 (0.8–end): held dead still.
