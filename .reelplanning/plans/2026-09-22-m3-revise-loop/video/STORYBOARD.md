---
title: "The loop, what's left: an agent runs it in the background, narration redoes only what changed, and the system video can change the system"
format: 1920x1080
duration: 428s
message: "Round 1, built: three independent changes and a proof. Rebuilds get cheap (step 1), the loop runs itself (steps 2 and 3), the system video can be reviewed (step 4), and step 5 proves them; D-064, D-065 and D-066 are decided. Round 2, from the walkthrough review: a run nobody is watching gets the right powers (step 6), reviews ask where you might disagree and stop only where it matters (steps 7 and 8), less scaffolding (step 9), and step 10 proves them on the next plan. Four open questions: what an unattended run may do (step 6, recommend B: auto mode in the sandbox), how many quick checks (step 7, recommend C: one per step plus wherever there is something to predict), whether your record decides what stops (step 8, recommend B), and how much scaffolding comes out (step 9, recommend C)."
arc: how-to-process, in two rounds: round 1 (built) as an overview of three independent tracks with its decisions in force, then round 2 as a second overview of three independent tracks, four open questions and a quick check, in five parts
audience: the repo owner reviewing reelplanning's own plan on the hosted review page, for the third time; round 1 is built and its walkthrough reviewed, and that review (68 of 71 calls accepted, A11 flagged, more quick checks asked for) added round 2
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-m3-revise-loop
---

## Video direction

- REVISED AGAIN after the walkthrough review, which added round 2 (steps 6–10, questions 2–5) to the plan. Frames 1–6, 8–10 and 12–16 (the old 15–19) are unchanged, word for word and byte for byte: only their frame numbers moved, because the three branch beats of the old question 1 (old frames 12–14) are deleted. Frames 7 and 17 (the old 20) keep their ids and are edited, so they no longer call question 1 open. Frame 11 keeps its frame id (`08b-decision-agents`) and is edited: question 1 is decided (D-066), so the decision beat is now a decided beat like frame 8, with no `decision:` tag. Frames 18–32 are new: part 4 and part 5, round 2.
- A SERIES OF FIVE PARTS (style guide §16): `chapter_start` on frames 1, 7, 13, 18 and 25. Parts 1–3 are round 1, as before: the problem, the **overview** and step 1; D-064, steps 2 and 3, and D-066; step 4, D-065, step 5 and round 1's resolved plan. Part 4 opens round 2: an opener (the first five steps are built; your walkthrough review added these), round 2's **overview** (style guide §2: three tracks, each labelled with its steps, all independent, then step 10's proof that needs them; the lanes are numbered 4–6, on from frame 4's 1–3, as the plan's "What changes" numbers them), step 6 and question 2, step 7 and question 3, and a closer. Part 5: step 8, its quick check and question 4, step 9 and question 5, step 10, and round 2's resolved list. Two decisions per part, not one: four questions in two parts kept each part near two minutes, and three parts of round 2 would have repeated an opener and closer for one step.
- Round 2's four questions are decision beats with no branch beats (`- decision: q2` … `q5`, numbered after the first round's question 1 so each keeps one number for good, as the plan does). The player's question sheet carries each option's detail (its `why_`, the plan's own text), and no option changes the plan's shape (none adds or removes a step), so a branch beat would only restate the sheet. On screen the kickers read `Choice 2 · Step 6` … `Choice 5 · Step 9`, the plan's numbers.
- One quick check (style guide §13), in part 5 after step 8: what happens to a call the agent did not tag. It is a prediction, as step 7 of the plan asks for: step 8's beat teaches the tags and that a tagged call stops, but not where an untagged one goes, so the wrong options are what a reasonable reviewer would expect (it is left out; it stops as today). Question 4's beat then opens with the answer, so the video carries the whole of step 8 for someone who never sees the quick check.
- Dependencies are said only where they exist: step 3 "needs step two", step 5 "needs all four", step 10 "needs six to nine". Steps 6–9 say nothing; round 2's overview has shown they stand alone.
- Numbers from the plan, said once each: 68 of 71 calls accepted across four walkthroughs, 3 of 12 plan questions answered in the reviewer's own words (step 8); about 12,000 words read before starting, the skill 4,800 and the style guide 7,200 (step 9); a six-minute walkthrough asks 2 quick checks (step 7).
- Round 2's spine has five ticks, for steps 6–10, in the rail's slot rows; the round is its own rail. Round 1's frames keep their five.
- Decided, not asked: D-064 (steps 2 and 3), D-065 (step 4) and now D-066 (one setting, tested with Claude Code, step 3), each a short beat with a `decided · D-06n` tag, the chosen answer and nothing about the alternatives (§14). D-003 on step 1, as before. D-005, D-021, D-024 unchanged and not narrated. Frame 7 (part 2's opener) and frame 17 (round 1's resolved list) are edited to match: question 1 reads as decided, and frame 17 closes round 1 with every question decided and points on to round 2.
- Built from the project record (§14): names from `glossary.md`, the look from `.reelplanning/theme/frame.md`. No details.
- Palette: paper ground, ink voice, coral as the single signal per frame. Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.
## Frame 1 — You wait, and you relay

- chapter_start: The problem, what changes, and step 1
- scene: SEQUENCE, no rail: a left-to-right timeline of four hand-offs, a 'time' axis under it. 'The review player' node with chip 'Finish'; on 'I submitted' an arrow to 'resolve-plan' with the chip 'you: “I submitted”' above it; on 'watch it build' 'The revise step' with chip 'you watch it build'; on 'GitHub Action' 'The push-triggered workflow' (dashed: it runs in CI) lands last; on 'plan dot resolved' resolve-plan's chip 'plan.resolved.md'; on 'push' the arrow into the workflow; on 'work is done' the workflow's chip 'starts after the work is done' and its coral border (the one coral)
- voiceover: "You press Finish, and nothing happens until you tell an agent session: I submitted. Then you watch it build. The GitHub Action in this repo starts on a push of plan dot resolved dot M D, but the agent writes that file when it records your review. By then, the work is done."
- duration: 15.488s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete failure with stakes
- beat: Recognition
- blueprint: compose
- focal: the workflow that starts after the work is done
- roles: timeline = foreground · chips = what happens at each hand-off · coral = the signal
- sfx: none

narrativeRole: You wait, and you relay.
keyMessage: The Action starts after the work is done; until then, you relay and wait.

Scene 1: 'The review player' + 'Finish' land.
Scene 2: on 'I submitted' the arrow and the 'you' chip; resolve-plan lands.
Scene 3: on 'watch it build' the revise step and its chip.
Scene 4: on 'GitHub Action' the workflow lands; on 'push' the arrow into it; on 'work is done' its chip and coral border. Held.

## Frame 2 — 35 lines to change 2

- scene: GRID, no rail: kicker 'System video · 2 frames rebuilt'; 35 line cells (7 × 5) numbered 01–35; lines 12 and 27 marked edited (the one coral) with '2 lines edited: 12, 27'; on 'all thirty-five' every cell fills as re-narrated; on 'eleven minutes' the big '11 min' lands right; on 'byte for byte' 33 cells grey out with '33 came out the same'
- voiceover: "The second cost is the voice. Rebuilding two frames of the system video re-narrated all thirty-five lines, and took eleven minutes. Thirty-three of them came out byte for byte the same."
- duration: 10.368s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-lines.html
- type: pain_point
- persuasion: A number the viewer can follow
- beat: Tension
- blueprint: compose
- focal: 2 edited cells among 35 re-narrated
- roles: grid = foreground · 11 min = the cost · coral = the 2 edited lines
- sfx: none

narrativeRole: 35 lines to change 2.
keyMessage: 33 of 35 lines were narrated again for nothing.

Scene 1: kicker; the grid lands, cells 12 and 27 marked.
Scene 2: on 'all thirty-five' every cell fills.
Scene 3: on 'eleven minutes' '11 min' lands.
Scene 4: on 'byte for byte' 33 cells grey; the line lands. Held.

## Frame 3 — The system video is watch-only

- scene: PROTOTYPE, no rail: the review player (960×540) playing the system video's frame 16 'Review loop, steps 4–5: push, then revise'; on 'comment' a comment 'this push step never runs' lands on the frame; on 'nowhere to go' an arrow leaves the player toward 'intake' (a dashed box) and stops short with the chip 'needs a plan' (the one coral); on 'no plan' the chip 'the system video has no plan' under the player
- voiceover: "And the system video is watch-only. You can comment on it, but the review has nowhere to go: intake takes only a plan's review, and the system video has no plan."
- duration: 9.259s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-watch-only.html
- type: pain_point
- persuasion: Concrete failure: a comment with nowhere to go
- beat: Tension
- blueprint: compose
- focal: the comment that goes nowhere
- roles: player = foreground · comment = the worked example · coral chip = the signal
- sfx: none

narrativeRole: The system video is watch-only.
keyMessage: A review of the system video has nowhere to go.

Scene 1: the player with the system video's frame 16.
Scene 2: on 'comment' the comment lands.
Scene 3: on 'nowhere to go' the arrow toward intake stops short; 'needs a plan' (coral).
Scene 4: on 'no plan' the chip under the player. Held.

## Frame 4 — What changes: three tracks and a proof

- scene: TRACKS, no rail: kicker 'What changes · 3 tracks'; three horizontal lanes stacked, each a tile with its number and title on the left and its step tiles on the right: lane 1 'Cheaper rebuilds' with 'Step 1'; lane 2 'A loop that runs itself' with 'Step 2' → 'Step 3' and 'needs' on the arrow between them; lane 3 'A reviewable system video' with 'Step 4'; each lane lands on the words that name it, its step tiles on their numbers; on 'None' every lane takes 'independent' at its right end; on 'Step five' the proof bar lands under the three, 'Proof on real reviews' with 'Step 5' and 'needs 1–4', a bracket from all three lanes into it, its border coral (the one coral)
- voiceover: "So the plan makes three changes. Rebuilds get cheap: step one. The loop runs itself: steps two and three. The system video can be reviewed: step four. None of them needs the others. Step five then proves all three, on real reviews."
- duration: 15.43s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03b-overview.html
- type: product_intro
- persuasion: The whole plan before the first step
- beat: Overview
- blueprint: compose
- focal: three separate lanes, then the proof that joins them
- roles: lanes = the three changes · step tiles = which steps carry each · bracket + bar = the proof · coral = the proof bar
- sfx: none

narrativeRole: What changes: three tracks and a proof.
keyMessage: Three changes that stand alone, and one step that proves them together.

Scene 1: kicker; on 'Rebuilds' lane 1 lands, 'Step 1' on 'one'.
Scene 2: on 'loop' lane 2 lands; 'Step 2', the arrow with 'needs', 'Step 3' on 'two and three'.
Scene 3: on 'system video' lane 3 lands; 'Step 4' on 'four'.
Scene 4: on 'None' the three 'independent' tags.
Scene 5: on 'Step five' the bracket draws and the proof bar lands, coral. Held 1.5 s.

## Frame 5 — Step 1: narrate only the lines that changed

- scene: SPINE + KEY + GRID: kicker 'Step 1 · Narrate changed lines'; left a key card with four rows (text · voice · speed · model) and under it 'kept: audio + word timings'; right the same 35-cell grid; on 'new or edited' cells 12 and 27 go coral with '2 to the voice'; on 'reused' the other 33 grey out as '33 reused'; bottom: '2 lines · about 40 s' lands beside a struck '35 lines · 11 min'; 'decided · D-003' small at the end
- voiceover: "Step one: narrate only the lines that changed. Each line's audio and word timings are kept under a key: its text, the voice, the speed and the model. On a rebuild, only new or edited lines go to the voice; the rest are reused. That update would have narrated two lines, not thirty-five: about forty seconds, not eleven minutes."
- duration: 18.645s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Worked example with real values, before and after
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- decided: D-003
- focal: 2 cells to the voice, 33 reused
- roles: key card = the mechanism · grid = the worked example · result line = the win · spine = anchor
- sfx: none

narrativeRole: Step 1: narrate only the lines that changed.
keyMessage: Two lines, not thirty-five: about forty seconds, not eleven minutes.

Scene 1: 'Step one' — kicker, spine tick 1 coral.
Scene 2: on 'key' the key card lands, its rows on 'text', 'voice', 'speed', 'model'.
Scene 3: on 'new or edited' cells 12 and 27 take the coral; on 'reused' the other 33 grey out.
Scene 4: on 'two lines' the result lands; on 'eleven minutes' the old cost is struck. Held.

## Frame 6 — Next: part 2

- scene: RAIL (full, 5 slots): slot 1 'Narrate changed lines' filled with 'decided · D-003' under its title; right a terminal mock '$ reel status' → 'system video: 2 of 35 lines to narrate'; on 'costs' the D-003 tag turns coral; on 'Next' 'Next · Part 2' and the hero 'The loop runs itself'
- voiceover: "Before anything runs, reel status says what an update costs in lines. Next, part two: the loop runs itself."
- duration: 6.464s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- decided: D-003
- focal: the cost said in lines, before anything runs
- roles: rail = anchor · terminal = the reel CLI · hero = what is next
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two: the loop runs itself.

Scene 1: the rail as step 1 left it; the terminal lands on 'reel status'.
Scene 2: on 'costs' the D-003 tag turns coral.
Scene 3: on 'Next' the mono line and the hero. Held still.

## Frame 7 — Part 2 of 3

- chapter_start: The loop runs itself: steps 2 and 3, and D-066
- scene: RAIL (full, 5 slots): slot 1 as resolved (decided · D-003); on 'steps two and three' slots 2 and 3 lift from dashed to filled; kicker 'Part 2 of 3'; hero 'The loop runs itself'; on 'decided' the chip 'decided · D-066 · step 3' (coral)
- voiceover: "Part two of three: steps two and three, and a question your review has since decided."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-opener-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail, and the decided question
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 3.
keyMessage: Steps two and three, and a question now decided (D-066).

Scene 1: kicker, hero; slots 2–3 fill on 'steps two and three'; the chip on 'decided'. Held.

## Frame 8 — Decided: a background agent runs the loop

- scene: SPINE + ONE CARD: kicker 'Decided · Steps 2 and 3'; the old question in grey 'Who runs the loop between your reviews?'; one card, the answer the review chose: 'A background agent' — builds: in the background · you: press Finish · told: a notification; on 'decided' the tag 'decided · D-064' under the card (the one coral); on 'steps two and three' the chip 'steps 2 and 3 are how'. No other options on screen.
- voiceover: "Who runs the loop was decided in your review: a background agent. Steps two and three are how."
- duration: 6.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-decision-1.html
- type: benefit_highlight
- persuasion: A decision in force, said once
- beat: Decided
- blueprint: compose
- plan_step: 2
- decided: D-064
- focal: the chosen answer and its tag
- roles: card = the decision · tag = decided · spine = anchor
- sfx: none

narrativeRole: Decided: a background agent runs the loop.
keyMessage: A background agent runs the loop; steps two and three are how.

Scene 1: kicker, the question in grey.
Scene 2: on 'decided' the tag; on 'background agent' the card and its rows.
Scene 3: on 'steps two and three' the chip. Held.

## Frame 9 — Step 2: one main session, background workers

- scene: SPINE + FAN-OUT: kicker 'Step 2 · Background workers'; left 'You'; in the middle 'The main session' with the chip 'the one you talk to' on 'talk' and a line between it and 'You'; on 'background worker' four dashed worker nodes fan out to the right, each on its word: 'build a video', 'implement a part', 'check the code', 'fix a flag'; on 'checks' return arrows from the four into the main session and the chip 'checks, tests, commits' under it; on 'notifies' a notification card under 'You': 'reelplanning · now' / 'Ready: the review page' / '2 choices · 3 min' (the one coral); on 'any agent' the chip 'under any agent' beside it
- voiceover: "Step two: one main session, the one you talk to, runs the work, but never sits on a long job. It hands each one to a background worker: build a video, implement a part, check the code, fix a flag. It checks what comes back and commits, and reelplanning itself notifies you, under any agent."
- duration: 16.043s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-step-2.html
- type: feature_showcase
- persuasion: Who does the work, shown as the work fanning out
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- decided: D-064
- focal: the main session handing long jobs to workers, then the notification
- roles: main session = who does the work · workers = the long jobs · notification = the new thing · spine = anchor
- sfx: none

narrativeRole: Step 2: one main session, background workers.
keyMessage: The session you talk to hands every long job to a worker, checks what comes back, and reelplanning tells you when a video is ready.

Scene 1: 'Step two' — kicker, spine tick 2 coral; 'You' and the main session; on 'talk' the chip and the line.
Scene 2: on 'background worker' the fan-out; each worker on its words.
Scene 3: on 'checks' the return arrows and the chip.
Scene 4: on 'notifies' the notification card (coral); on 'any agent' the chip. Held.

## Frame 10 — Step 3: pressing Finish reaches the main session, or starts one

- scene: SPINE + TWO WAYS IN + FALLBACK + MEMORY: kicker 'Step 3 · Finish reaches the session' with 'needs step 2' beside it; left 'The hosted page' (chip 'Claude only') and 'The local page' (chip 'any agent'); middle 'The review server'; right 'The main session'; on 'reaches' the main session lands with the coral border (the one coral); on 'hosted' the arrow from the hosted page straight to the session, chip 'its hook'; on 'local' local page → review server → session; on 'no session is open' a dashed path from the review server down to a dashed sheet 'A fresh, headless run' with `claude -p`, `codex exec`, `opencode run` on their names, chip 'no session open' on the path; on 'memory' a strip under everything: '.reelplanning/' · 'plans · reviews · decisions · videos'
- voiceover: "Step three needs step two. When you press Finish, the review reaches the main session: from the hosted page, Claude only, through its hook; from the local page, through the review server the session waits on. Only if no session is open does the server start a fresh, headless run: claude dash p, codex exec, or opencode run. Nothing is lost: the repo's reelplanning folder is the memory."
- duration: 21.461s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-step-3.html
- type: feature_showcase
- persuasion: Worked example: two ways in to one session, and a fallback
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- decided: D-064
- focal: Finish arriving back at the main session
- roles: main session = where a review lands · pages = the two ways in · dashed run = the fallback · strip = the shared memory · spine = anchor
- sfx: none

narrativeRole: Step 3: pressing Finish reaches the main session, or starts one.
keyMessage: Finish reaches the session you already have; only with none open does a fresh headless run start, and the repo keeps the memory.

Scene 1: 'Step three' — kicker, 'needs step 2', spine tick 3 coral.
Scene 2: on 'Finish' the two pages land; on 'reaches' the main session (coral).
Scene 3: on 'hosted' the hook arrow; on 'local' the server and its arrows.
Scene 4: on 'no session is open' the dashed path and the fresh run; its commands on their names.
Scene 5: on 'memory' the strip. Held.

## Frame 11 — Decided: one setting, tested with Claude Code

- scene: SPINE + ONE CARD: kicker 'Decided · Step 3'; the old question in grey 'How far does the first version go beyond Claude Code?'; one card, the answer the review chose: 'One setting, tested with Claude Code' — agent: set in config · tested: Claude Code · others: change 1 line; on 'decided' the tag 'decided · D-066' under the card (the one coral); on 'claude dash p' the chip 'config: claude -p' right of the card, and on 'Codex or opencode' the chip 'or: codex exec · opencode run' under it. No other options on screen.
- voiceover: "How far the first version goes beyond Claude Code was decided in your review: one setting, tested with Claude Code. The config names claude dash p; changing that one line runs Codex or opencode instead."
- duration: 13s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08b-decision-agents.html
- type: benefit_highlight
- persuasion: A decision in force, said once
- beat: Decided
- blueprint: compose
- plan_step: 3
- decided: D-066
- focal: the chosen answer and its tag
- roles: card = the decision · tag = decided · chips = the one line that picks the agent · spine = anchor
- sfx: none

narrativeRole: Decided: one setting, tested with Claude Code.
keyMessage: One setting names the agent's headless command; only Claude Code is tested end to end.

Scene 1: kicker, the question in grey.
Scene 2: on 'decided' the tag; on 'one setting' the card and its rows.
Scene 3: on 'claude dash p' the config chip; on 'Codex or opencode' the second chip. Held.


## Frame 12 — Next: part 3

- scene: RAIL (full): slots 1–3 as resolved (slot 1 'decided · D-003', slot 2 'decided · D-064', slot 3 'One setting', the recommended default; the player shows the reviewer's pick); on 'Next' 'Next · Part 3' and the hero 'Edit the system through its video'
- voiceover: "Next, part three: what a review of the system video can change."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-closer-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail, and what is next
- roles: rail = anchor · hero = what is next
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three.

Scene 1: the rail as resolved so far; on 'Next' the mono line and the hero. Held still.

## Frame 13 — Part 3 of 3

- chapter_start: The system video, and the proof: steps 4 and 5
- scene: RAIL (full, 5 slots): slots 1–3 as resolved; on 'step four' slots 4 and 5 fill; kicker 'Part 3 of 3'; hero 'Reviews that change the system'; on 'proof' the chip 'then the proof · step 5' (coral)
- voiceover: "Part three of three: step four, the system video, and step five, the proof."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-opener-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail, and what this part holds
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 3 of 3.
keyMessage: Step four, the system video, and step five, the proof.

Scene 1: kicker, hero; slots 4–5 fill; the chip on 'proof'. Held.

## Frame 14 — Step 4: reviewing the system video changes the system

- scene: SPINE + ROUTE + FORK: kicker 'Step 4 · System video reviews'; left the system video's frame 16 as a card ('Review loop · push, then revise') with its tags 'spec: Pipelines' and 'parts: cli, action, revise' and the comment 'this push step never runs'; on 'its parts' arrows from the comment to three nodes with their glossary names: 'The reel CLI', 'The push-triggered workflow', 'The revise step'; on 'wrong' the upper fork 'Fix the video' with the chip 'spec or frame · 1 rebuilt'; on 'system itself' the lower fork 'Change the system' with the chip 'decided · D-065' (the one coral)
- voiceover: "Step four: reviewing the system video changes the system. Each frame names its spec section and its parts, so a comment lands on those parts. If the video is wrong, the agent fixes the spec or the frame, and rebuilds only that frame. If the system itself should change, it goes the way your review decided."
- duration: 17.557s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-step-4.html
- type: feature_showcase
- persuasion: Worked example: one comment, routed, then sorted
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- decided: D-065
- focal: a comment routed to the parts it names, then the fork
- roles: frame card = the worked example · nodes = the parts it names · fork = what happens · spine = anchor
- sfx: none

narrativeRole: Step 4: reviewing the system video changes the system.
keyMessage: A comment lands on the parts its frame names; the video is fixed, or the system changes as decided.

Scene 1: 'Step four' — kicker, spine tick 4 coral; the frame card with its tags.
Scene 2: on 'comment' the comment lands; on 'those parts' the arrows and the three nodes.
Scene 3: on 'wrong' the upper fork and its chip.
Scene 4: on 'system itself' the lower fork; on 'decided' 'decided · D-065' coral. Held.

## Frame 15 — Decided: small fixes go in, choices become plans

- scene: SPINE + ONE CARD: kicker 'Decided · Step 4'; the old question in grey 'What happens when a comment asks for a change?'; one card, the answer the review chose: 'Small fixes in, choices a plan' — one part: goes straight in (on 'straight in') · you: a short walkthrough (on 'walkthrough') · a choice: a plan first (on 'plan'); the tag 'decided · D-065' under the card (the one coral). No other options on screen.
- voiceover: "A small change inside one part goes straight in, and you see it in a short walkthrough. Anything with a choice becomes a plan first."
- duration: 8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-decision-2.html
- type: benefit_highlight
- persuasion: A decision in force, said once
- beat: Decided
- blueprint: compose
- plan_step: 4
- decided: D-065
- focal: the chosen answer and its tag
- roles: card = the decision · tag = decided · spine = anchor
- sfx: none

narrativeRole: Decided: small fixes go in, choices become plans.
keyMessage: Small and local goes straight in; anything with a choice becomes a plan.

Scene 1: kicker, the question in grey, the tag.
Scene 2: the card; its rows on 'straight in', 'walkthrough', 'plan'. Held.

## Frame 16 — Step 5: prove it on real reviews

- scene: SPINE + FILE LIST + TIMER STRIPS: kicker 'Step 5 · Proof on real reviews' with 'needs steps 1–4' beside it; left a file list headed 'removed': '.github/workflows/reelplanning-revise.yml' and 'templates/…/reelplanning-revise.yml', struck on 'removed'; 'docs: how the loop runs' on 'docs'; right 'two real reviews' with two strips 'this plan's walkthrough' and 'the system video', each 'Finish → notification', filling on 'timed'; 'timed end to end' (the one coral)
- voiceover: "Step five needs all four. The GitHub Action and its template are removed, and the docs say how the loop runs. Then two real reviews, of this plan's walkthrough and of the system video, are timed from Finish to the notification."
- duration: 12.971s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-step-5.html
- type: feature_showcase
- persuasion: What goes, and the proof
- beat: Comprehension
- blueprint: compose
- plan_step: 5
- focal: two reviews timed from Finish to the notification
- roles: file list = what goes · strips = the proof · spine = anchor
- sfx: none

narrativeRole: Step 5: prove it on real reviews.
keyMessage: The Action goes, and two real reviews are timed from Finish to the notification.

Scene 1: 'Step five' — kicker, 'needs steps 1–4', spine tick 5 coral.
Scene 2: on 'GitHub Action' the file list; on 'removed' the two files are struck.
Scene 3: on 'docs' the docs line.
Scene 4: on 'two real reviews' the strips; on 'timed' they fill; 'timed end to end' coral. Held.

## Frame 17 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram: the five steps as a list at reading size, each with its track in grey to its left ('rebuilds', 'the loop' for 2 and 3, 'system video', 'proof'); step 1 carries 'decided · D-003', step 2 'decided · D-064', step 3 'decided · D-066', step 4 'decided · D-065', step 5 none; kicker 'Round 1 · 5 steps, built'; on 'round two' the chip 'Next · Round 2' under the list (the one coral); 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is round one: three changes in five steps, all built, and every question decided. Next, round two, from your review of its walkthrough."
- duration: 9.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-resolved.html
- type: cta
- decided: D-003
- persuasion: Round 1 resolved + signpost to round 2
- beat: Resolve
- blueprint: compose
- focal: the five steps, their tracks and their decisions
- roles: step list = foreground · paper ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: Round one: three changes in five steps, all built, every question decided.

Scene 1: the list settles in.
Scene 2: on 'round two' the chip. Held still.

## Frame 18 — Round 2: five more steps from your review

- chapter_start: Round 2: from your walkthrough review
- scene: RAIL (full, round 2's 5 slots): a grey mono line above the rail 'steps 1–5 · built'; the rail holds steps 6–10, dashed; kicker 'Round 2 · Part 4'; on 'five more' slots 6–10 fill in turn; hero 'From your walkthrough review'; on 'four open questions' the chip '4 questions · steps 6–9' (coral)
- voiceover: "Round two. The first five steps are built, and your review of their walkthrough added five more, with four open questions."
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-opener-r2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the round's five new slots, and its four questions
- roles: rail = foreground · built line = what is banked · chip = what is asked
- sfx: none

narrativeRole: Round 2.
keyMessage: Steps one to five are built; the walkthrough review added steps six to ten and four questions.

Scene 1: kicker, the built line; on 'built' the rail's dashed slots.
Scene 2: on 'five more' slots 6–10 fill; the hero.
Scene 3: on 'four open questions' the chip. Held.

## Frame 19 — What changes in round 2: three tracks and a proof

- scene: TRACKS, no rail (the frame 4 layout, numbered on from it): kicker 'What changes · Round 2'; three lanes stacked, each a tile with its number and title on the left and its step tiles on the right: lane 4 'Right powers, unattended' with 'Step 6'; lane 5 'Ask where you disagree' with 'Step 7' and 'Step 8' side by side (no arrow: neither needs the other); lane 6 'Less scaffolding' with 'Step 9'; each lane lands on the words that name it, its step tiles on their numbers; on 'None' every lane takes 'independent' at its right end; on 'Step ten' the proof bar lands under the three, 'Proof on the next plan' with 'Step 10' and 'needs 6–9', a bracket from all three lanes into it, its border coral (the one coral)
- voiceover: "They make three changes. A run nobody is watching gets the right powers: step six. Reviews ask where you might disagree, and stop only where it matters: steps seven and eight. And less scaffolding: step nine. None of them needs the others. Step ten then proves them on the next plan."
- duration: 17.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-overview-r2.html
- type: product_intro
- persuasion: The whole round before its first step
- beat: Overview
- blueprint: compose
- focal: three separate lanes, then the proof that joins them
- roles: lanes = the three changes · step tiles = which steps carry each · bracket + bar = the proof · coral = the proof bar
- sfx: none

narrativeRole: What changes in round 2: three tracks and a proof.
keyMessage: Three changes that stand alone, and one step that proves them together on the next plan.

Scene 1: kicker; on 'powers' lane 4 lands, 'Step 6' on 'six'.
Scene 2: on 'Reviews' lane 5 lands; 'Step 7' and 'Step 8' on 'seven and eight'.
Scene 3: on 'scaffolding' lane 6 lands; 'Step 9' on 'nine'.
Scene 4: on 'None' the three 'independent' tags.
Scene 5: on 'Step ten' the bracket draws and the proof bar lands, coral. Held 1.5 s.

## Frame 20 — Step 6: what a run nobody is watching may do

- scene: SPINE (round 2: ticks for steps 6–10) + COMMAND + TWO LISTS: kicker 'Step 6 · Unattended runs'; top a terminal sheet with today's command `claude --permission-mode acceptEdits --allowedTools Bash -p` and the grey note 'started by the review server'; on 'permission prompt' a dashed prompt card 'Allow this?' with the chip 'nobody to answer: refused'; on 'edit files' the left list 'allowed' fills: 'file edits', 'any shell command'; on 'not start workers' the right list 'refused' fills on its words: 'workers', 'the web', 'MCP tools'; on 'nothing fences' the chip 'no fence: any path, any host' under the lists (the one coral); on 'picks the setting' 'config.json · reel init' and on 'step five proof' 'then: re-run the step 5 proof'
- voiceover: "Step six: what a run nobody is watching may do. Nobody is there to answer a permission prompt, so anything that would prompt is refused. Today the run may edit files and run any shell command, but not start workers, read the web or use MCP tools, and nothing fences what a command touches. This step picks the setting, and re-runs the step five proof with it."
- duration: 21.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-step-6.html
- type: feature_showcase
- persuasion: Worked example: today's command, what it allows and what it refuses
- beat: Comprehension
- blueprint: compose
- plan_step: 6
- focal: what today's command allows, refuses, and does not fence
- roles: terminal = today's command · lists = allowed and refused · coral chip = the missing fence · spine = anchor
- sfx: none

narrativeRole: Step 6: what a run nobody is watching may do.
keyMessage: Today an unattended run may edit and run any command, but cannot start workers or read the web, and nothing fences it; this step picks the setting.

Scene 1: 'Step six' — kicker, spine tick 6 coral; the terminal with today's command.
Scene 2: on 'permission prompt' the prompt card and its chip.
Scene 3: on 'edit files' the allowed list; on 'workers', 'web', 'MCP' the refused list, item by item.
Scene 4: on 'nothing fences' the coral chip.
Scene 5: on 'picks the setting' the config line; on 'step five proof' the re-run line. Held.

## Frame 21 — Choice 2: what may a run nobody is watching do?

- scene: SPINE + FOUR OPTION CARDS under the question 'What may a run nobody is watching do?': A 'As now' — shell: any · workers: no · fence: none, cost 'costs: no workers, no fence'; B 'Auto mode' — shell: if approved · workers: yes · fence: sandbox, cost 'needs: auto mode, bwrap'; C 'Everything' — shell: any · workers: yes · fence: sandbox only, cost 'advised: a container'; D 'A short list' — shell: 4 commands · workers: no · fence: the list, cost 'costs: the rest refused'; each card lands on its letter, its cost on its cost words; on 'I recommend' B takes the coral border and 'recommended' lands under it
- voiceover: "What may that run do? A: as now, edits and any shell command. B: auto mode in the sandbox: a classifier approves each action, workers and the web included. C: everything, with the sandbox as the only fence. D: a short list of commands, still no workers. I recommend B: the run can do what the main session does, a classifier sits where you would, and the sandbox bounds a mistake. Which one?"
- duration: 21.099s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-decision-q2.html
- type: cta
- persuasion: Comparison of four options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 6
- decision: q2
- question: What may a run nobody is watching do?
- option_a: As now: edits and any shell command
- option_b: Auto mode, inside the sandbox
- option_c: Everything, inside the sandbox
- option_d: A short list
- why_a: simple, and the step 5 proof passed with it; it cannot start workers or read the web, and nothing fences what its commands touch
- why_b: --permission-mode auto --permission-prompts none: a classifier approves each action, workers and the web included, and refuses risky ones; Claude Code's sandbox keeps shell writes inside the repo and network to named hosts. Needs auto mode on your account, and bubblewrap on Linux; no native Windows
- why_c: --dangerously-skip-permissions with the sandbox on: nothing is refused, the sandbox is the only fence. Refuses to run as root; the docs recommend it only in a container
- why_d: edits, plus only node, npx, git and ffmpeg commands. The tightest; a command outside the list is refused, and still no workers or web
- recommended: b
- focal: the four option cards
- roles: option cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Choice 2: what may a run nobody is watching do?
keyMessage: I recommend B: the run can do what the main session does, a classifier sits where you would, and the sandbox bounds a mistake.

Scene 1: kicker 'Choice 2 · Step 6'; the question; spine tick 6 coral.
Scene 2: on 'A:' card A lands; on 'B:' card B; on 'C:' card C; on 'D:' card D; each cost line on its words.
Scene 3: on 'I recommend' B's border turns coral (the tick hands it on). Held.

## Frame 22 — Step 7: more quick checks, and a wrong answer is a comment

- scene: SPINE + QUIZ SHEET + TALLY: kicker 'Step 7 · More quick checks'; left a quick-check sheet at reading size, the walkthrough's real one: 'Quick check · step 3' / 'You press Send twice. How many runs start?' / options '2', '1', 'None'; on 'wrong answer' '2' is marked 'your answer' and '1' 'the answer'; right a strip '6-min walkthrough' with its 2 check marks on it and the chip '2 quick checks' on 'asks two'; on 'a box' a text box under the sheet 'Expected something else? Say how it should work' with the reviewer's words typed in ('a second Send should say: already sent'); on 'comment' an arrow from the box to the chip 'a comment on step 3 → the agent' (the one coral); on 'how many checks' the grey line 'this step: how many, and what kind'
- voiceover: "Step seven: more quick checks. A quick check asks you to predict what the plan or the code will do, so a wrong answer marks a place where you expected something else. Today a six-minute walkthrough asks two. After any answer, a box asks how it should work, and your words reach the agent as a comment on that step. The box is built; this step decides how many checks, and of what kind."
- duration: 21.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-step-7.html
- type: feature_showcase
- persuasion: Worked example: a real quick check answered wrong, and where the words go
- beat: Comprehension
- blueprint: compose
- plan_step: 7
- focal: a wrong answer turning into a comment on the step
- roles: sheet = the worked example · tally = how few today · box + arrow = the comment · spine = anchor
- sfx: none

narrativeRole: Step 7: more quick checks, and a wrong answer is a comment.
keyMessage: A wrong answer marks where you expected something else; the box sends your words to the agent as a comment. This step sets how many checks, and of what kind.

Scene 1: 'Step seven' — kicker, spine tick 7 coral; on 'quick check' the sheet.
Scene 2: on 'wrong answer' the two marks on the options.
Scene 3: on 'six-minute walkthrough' the strip; on 'two' its two marks and the chip.
Scene 4: on 'a box' the box and the typed words; on 'comment' the arrow and the coral chip.
Scene 5: on 'how many checks' the grey line. Held.

## Frame 23 — Choice 3: how many quick checks?

- scene: SPINE + THREE OPTION CARDS under the question 'How many quick checks does a video ask?': A 'One per step' — count: 1 a step, at least · pace: about 1 a minute · 6-min video: 5 or 6, cost 'never adds extras'; B 'Where to predict' — count: none set · asks: where to predict · 6-min video: 2 to 12, cost 'risk: a step unchecked'; C 'Floor + more' — floor: 1 a step · plus: where to predict · asks 0: never, cost 'no step unchecked'; each card lands on its letter, its cost on its cost words; on 'I recommend' C takes the coral border and 'recommended' lands under it
- voiceover: "How many quick checks does a video ask? A: at least one per step, about one a minute. B: one wherever there is something to predict; could be two, could be twelve. C: A's floor, plus B's. I recommend C: the floor means no step goes unchecked, which B alone cannot promise, and the extra checks go where a wrong answer is most likely, which A alone never adds. Which one?"
- duration: 19.797s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-decision-q3.html
- type: cta
- persuasion: Comparison of three options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 7
- decision: q3
- question: How many quick checks does a video ask?
- option_a: One per step, at least
- option_b: Wherever there is something to predict
- option_c: One per step, plus wherever there is something to predict
- why_a: each plan step, or each part of a walkthrough, ends with one: about one a minute. A six-minute walkthrough asks five or six
- why_b: no count: the agent asks one after every mechanism whose outcome a viewer could guess wrong. Could be two, could be twelve
- why_c: the floor of A, and more where there is something to predict
- recommended: c
- focal: the three option cards
- roles: option cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Choice 3: how many quick checks?
keyMessage: I recommend C: the floor leaves no step unchecked, which B alone cannot promise; the extras go where a wrong answer is most likely, which A alone never adds.

Scene 1: kicker 'Choice 3 · Step 7'; the question; spine tick 7 coral.
Scene 2: on 'A:' card A lands; on 'B:' card B; on 'C:' card C; each cost line on its words.
Scene 3: on 'I recommend' C's border turns coral. Held.

## Frame 24 — Next: part 5

- scene: RAIL (full, round 2's 5 slots): slot 6 'Unattended runs' with the tag 'Auto mode' and slot 7 'More quick checks' with 'Floor + more' (the recommended defaults; the player shows the reviewer's picks), slots 8–10 filled, untagged (all five filled since the round's opener); on 'Next' 'Next · Part 5' and the hero 'Fewer stops, less scaffolding'
- voiceover: "Next, part five: which of the agent's calls stop the video, and how much scaffolding comes out."
- duration: 5.6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-closer-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail, and what is next
- roles: rail = anchor · hero = what is next
- sfx: none

narrativeRole: Next: part 5.
keyMessage: Next, part five.

Scene 1: the rail as resolved so far; on 'Next' the mono line and the hero. Held still.

## Frame 25 — Part 5: fewer stops, less scaffolding

- chapter_start: Round 2: fewer stops, less scaffolding, the proof
- scene: RAIL (full, round 2's 5 slots): slots 6–7 as resolved ('Auto mode', 'Floor + more'); kicker 'Round 2 · Part 5'; hero 'Fewer stops, less scaffolding'; on 'step eight' slots 6–7 dim to the background, leaving 8–10 at full ink; on 'proof' the chip '2 questions · steps 8 and 9' (coral)
- voiceover: "Part five: step eight, fewer stops; step nine, less scaffolding; and step ten, the proof."
- duration: 5.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-opener-5.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail, and what this part holds
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 5: fewer stops, less scaffolding.
keyMessage: Step eight, step nine, and step ten, the proof.

Scene 1: kicker, hero; on 'step eight' slots 6–7 dim; the chip on 'proof'. Held.

## Frame 26 — Step 8: stop only for the calls you might overturn

- scene: SPINE + TALLY + CALL ROWS: kicker 'Step 8 · Stop where it matters'; left the record: a bar of 71 cells, on 'sixty-eight' 68 fill grey as 'accepted as they were' and 3 stay ink as 'changed'; under it '68 of 71 calls' big; on 'three of twelve' a second, shorter bar of 12 with 3 marked: '3 of 12 questions: your words'; right a call card from this plan, 'A11 · what an unattended run may do', and on each tag's word its tag chip lands in a row: 'visible', 'hard to undo', 'deviation', 'close'; on 'hard to undo' that chip is the one the card takes; on 'stops the video' the card's chip 'stops the video' (the one coral)
- voiceover: "Step eight: stop only for the calls you might overturn. Across four walkthroughs, you accepted sixty-eight of the agent's seventy-one calls as they were, while three of twelve plan questions got your own words. So the agent tags a call when it logs it: visible, hard to undo, a deviation, or close. A tagged call stops the video, as today."
- duration: 19.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-step-8.html
- type: feature_showcase
- persuasion: A number the viewer can follow, then the rule on a real call
- beat: Comprehension
- blueprint: compose
- plan_step: 8
- focal: 68 of 71 accepted, and a tagged call that still stops
- roles: bars = the record · call card = the worked example · tag chips = the four tags · coral = the stop
- sfx: none

narrativeRole: Step 8: stop only for the calls you might overturn.
keyMessage: You accepted 68 of 71 calls as they were; the agent now tags a call it logs, and a tagged call stops the video.

Scene 1: 'Step eight' — kicker, spine tick 8 coral.
Scene 2: on 'sixty-eight' the 71-cell bar fills; the big count.
Scene 3: on 'three of twelve' the questions bar.
Scene 4: on 'tags' the call card; the four chips on their words; 'hard to undo' settles on the card.
Scene 5: on 'stops the video' the coral chip. Held.

## Frame 27 — Quick check: a call with no tag

- scene: SPINE + CALL CARD + THREE OPTIONS: kicker 'Quick check · Step 8'; the question 'A call with no tag: what happens to it?'; one call card from this plan, 'A7 · a heartbeat every 2 s', with a grey chip 'no tag'; three option cards in a row, each on its word: A 'Left out: it stands', B 'Listed at the end of its part', C 'Stops the video, as today'; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. The agent logs a call with no tag: a heartbeat every two seconds. What happens to it?"
- duration: 7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-quiz-untagged.html
- type: social_proof
- persuasion: Prediction: what a reasonable reviewer might expect instead
- beat: Check
- blueprint: compose
- plan_step: 8
- quiz: k1
- question: The agent logs a call with no tag (a heartbeat every 2 s). What happens to it?
- option_a: It is left out: the agent's choice stands unasked
- option_b: It is listed in one beat at the end of its part
- option_c: It stops the video, as today
- answer: b
- explain: Untagged calls are never dropped and never stop on their own: they share one beat at the end of their part, each listed with what was chosen instead. Accept them all at once, or flag any one.
- focal: the question and its three options
- roles: call card = the worked example · option cards = the predictions · spine = anchor
- sfx: none

narrativeRole: Quick check: a call with no tag.
keyMessage: Quick check.

Scene 1: kicker, the question; on 'no tag' the call card and its chip.
Scene 2: on 'What happens' the three option cards, A, B, C. Held for the pause.

## Frame 28 — Choice 4: does your record decide what stops?

- scene: SPINE + THREE OPTION CARDS under the question 'Does your own record also decide what stops?'; first, on 'one beat', a strip across the top of the cards: 'untagged: 1 beat at the end of the part · accept all, or flag 1'; then A 'The tags only' — stops: tagged calls · learns: nothing, cost 'as good as the tags'; B 'Tags + your record' — stops: tagged calls · fades: 10 accepts in a row · back: 1 flag, cost '10 is a guess to tune'; C 'Every call' — stops: all of them · quicker: 1 key, cost 'nothing left out'; each card lands on its letter; on 'I recommend' B takes the coral border and 'recommended' lands under it
- voiceover: "Untagged calls share one beat at the end of their part: accept them all, or flag any one. So does your own record also decide what stops? A: the tags only. B: the tags and your record: a tag you accepted ten times running no longer stops on its own, and one flag brings it back. C: every call still stops. I recommend B: it starts as A, and your verdicts, not a guess, decide what fades. Which one?"
- duration: 21.376s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-decision-q4.html
- type: cta
- persuasion: The quick check's answer, then a comparison of three options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 8
- decision: q4
- question: Does your own record also decide what stops?
- option_a: The tags only
- option_b: The tags, and your record
- option_c: Every call still stops
- why_a: a call stops when the agent tagged it. Simple and predictable; how well it works depends on how well the agent tags
- why_b: the ledger keeps every verdict and the call's tags; a tag you have accepted ten times running across plans no longer stops on its own, and one flag brings it back. Learns what you care about; ten is a guess to tune
- why_c: faster to get through (one key, and the untagged ones grouped), but nothing is left out
- recommended: b
- focal: the untagged strip, then the three option cards
- roles: strip = the quick check's answer · option cards = foreground · spine = anchor
- sfx: none

narrativeRole: Choice 4: does your record decide what stops?
keyMessage: I recommend B: it starts as A, and your verdicts, not a guess, decide what fades.

Scene 1: kicker 'Choice 4 · Step 8'; spine tick 8 coral; on 'one beat' the untagged strip.
Scene 2: the question; on 'A:' card A lands; on 'B:' card B; on 'C:' card C; each cost line on its words.
Scene 3: on 'I recommend' B's border turns coral. Held.

## Frame 29 — Step 9: less scaffolding

- scene: SPINE + WORD BAR + KEEP / LOOSEN: kicker 'Step 9 · Less scaffolding'; top a bar of words read before starting, on 'twelve thousand' it fills: 'skill · 4,800' and 'style guide · 7,200', with '12,000 words' above it; left column 'stays' (on 'mechanical work'): 'narration', 'captions', 'verify', 'plan-diff', 'the review server', 'the ledger guard', each on its word; right column 'goes' (on 'dictates format'): 'format rules → advice', and on 'said twice' 'a review, kept 3 times' with its three files stacked ('annotations', 'resolved copy', 'scope files'), the chip 'kept 3 times' (the one coral)
- voiceover: "Step nine: less scaffolding. A fresh agent audited the skill: an agent reads about twelve thousand words before it starts. The tools that do mechanical work stay: narration, captions, verify, plan diff, the review server, the ledger guard. What goes is text that only dictates format, and what is said twice: a review, for one, is kept three times."
- duration: 20.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-step-9.html
- type: feature_showcase
- persuasion: A number the viewer can follow, then what stays and what goes
- beat: Comprehension
- blueprint: compose
- plan_step: 9
- focal: what stays (the tools) and what goes (format rules, duplicates)
- roles: word bar = the cost today · stays column = the tools · goes column = the scaffolding · coral chip = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 9: less scaffolding.
keyMessage: An agent reads about 12,000 words first; the mechanical tools stay, format rules and duplicate files go.

Scene 1: 'Step nine' — kicker, spine tick 9 coral.
Scene 2: on 'twelve thousand' the word bar and its two parts.
Scene 3: on 'mechanical work' the stays column; each tool on its name.
Scene 4: on 'dictates format' the goes column; on 'said twice' the three files and the coral chip. Held.

## Frame 30 — Choice 5: how much scaffolding comes out?

- scene: SPINE + THREE OPTION CARDS under the question 'How much scaffolding comes out?': A 'Only what hurts' — rules: 4 fixes · the text: as long · files: as now, cost 'small and safe'; B 'A, and the text' — guides: 1 each, ~half · history: design notes · files: as now, cost 'format rules → goals'; C 'B, and the files' — build: 1 command · a review: kept once, cost 'old readers: tested'; each card lands on its letter; on 'I recommend' C takes the coral border and 'recommended' lands under it
- voiceover: "How much comes out? A: only what hurts, such as the exact step heading reel check demands; small and safe, but the text stays as long. B: A, and the skill and the style guide rewritten, about half as long. C: B, and the files: one build command, and a review kept once. I recommend C: format rules and duplicate files are what an agent spends its attention on. Which one?"
- duration: 20.587s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-decision-q5.html
- type: cta
- persuasion: Comparison of three options + Recommendation with reason
- beat: Decision
- blueprint: comparison-split
- plan_step: 9
- decision: q5
- question: How much scaffolding comes out?
- option_a: Only what hurts
- option_b: A, and the text
- option_c: B, and the files
- why_a: move "Autonomous mode" out, loosen the step heading, let a plan cite its own decisions, drop the checklist. Small and safe; the text stays as long
- why_b: also rewrite the skill and the style guide as one current guide each, about half as long, with the history moved to a design notes file. Format rules become goals
- why_c: also one command for the build, and a review kept once: the annotations, plus one short "what to act on" file instead of the resolved copies and scope files
- recommended: c
- focal: the three option cards
- roles: option cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Choice 5: how much scaffolding comes out?
keyMessage: I recommend C: format rules and duplicate files are what an agent spends its attention on.

Scene 1: kicker 'Choice 5 · Step 9'; the question; spine tick 9 coral.
Scene 2: on 'A:' card A lands; on 'B:' card B; on 'C:' card C; each cost line on its words.
Scene 3: on 'I recommend' C's border turns coral. Held.

## Frame 31 — Step 10: prove it on the next plan

- scene: SPINE + NEXT PLAN + TWO COUNTS: kicker 'Step 10 · Proof on the next plan' with 'needs steps 6–9' beside it; left a plan card 'Next plan' / 'The Bob Dylan site, from scratch' with, on their words, 'new quick checks' and 'the call filter'; right a sheet 'counted in its review' with two rows filling on their words: 'quick checks answered wrong → what each changed' and 'stops vs calls accepted without a stop'; 'counted in its review' (the one coral)
- voiceover: "Step ten needs six to nine. The next plan through the loop, the Bob Dylan site redone from scratch, uses the new quick checks and the call filter. Its review counts the quick checks answered wrong, and what each changed, and the stops against the calls you accepted without stopping."
- duration: 16.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-step-10.html
- type: feature_showcase
- persuasion: What runs, and what is counted
- beat: Comprehension
- blueprint: compose
- plan_step: 10
- focal: the next plan, and the two counts its review makes
- roles: plan card = what runs · count rows = the proof · spine = anchor
- sfx: none

narrativeRole: Step 10: prove it on the next plan.
keyMessage: The next plan uses the new quick checks and the call filter; its review counts what they changed.

Scene 1: 'Step ten' — kicker, 'needs steps 6–9', spine tick 10 coral.
Scene 2: on 'Bob Dylan' the plan card; its two lines on 'quick checks' and 'call filter'.
Scene 3: on 'counts' the sheet; its rows on 'answered wrong' and 'stops'; the coral tag. Held.

## Frame 32 — Round 2, resolved

- scene: STEPS AND CHOICES, no diagram: steps 6–10 as a list at reading size, each with its track in grey to its left ('unattended', 'reviews' for 7 and 8, 'scaffolding', 'proof'); step 6 carries the choice tag 'Auto mode', step 7 'Floor + more', step 8 'Your record', step 9 'Text + files' (the recommended defaults; the player fills the reviewer's picks); a grey line above the list 'steps 1–5 · built'; kicker 'Round 2 · 5 steps, 4 questions'; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is round two: five more steps, and four questions. Answer them, draw on any step to leave a note, or approve."
- duration: 9.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-resolved-r2.html
- type: cta
- plan_questions: 2, 3, 4, 5
- persuasion: Resolved round + call to action
- beat: Resolve
- blueprint: compose
- focal: the five steps, their tracks and the four choices
- roles: step list = foreground · paper ground = background
- sfx: none

narrativeRole: Round 2, resolved.
keyMessage: Five more steps, and four questions.

Scene 1: the list settles in.
Scene 2: held dead still.
