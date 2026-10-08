---
title: "Deep dives: the video opens into HTML where a video falls short"
format: 1920x1080
duration: 219s
message: "A plan video tells the story; code, long tables, prototypes and the plan's own text open as pages inside the player"
arc: how-to-process, every question decided, in three parts (revised after the second 2026-09-23 review)
audience: the engineer reviewing reelplanning's own plan before approving it, including someone new to the repo
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-23-deep-dives
---

## Video direction

- REVISED twice after the reviews of 2026-09-23 (revise v6). Round 1 decided D-021 (a detail opens in a side panel) and D-023 (code only when the call is about the code). Round 2 decided the last open question, how each detail page is made: D-024, fixed types first and a fresh page when none fits. Nothing is asked any more; each decision is a `decided · D-0nn` tag on its step (1, 2, 4) and one sentence. Round 2 also set the rule for a detail: it holds only what the video cannot (more than a screen shows, something to try, or the evidence behind a claim); the part-size example is now the video's claim, and the detail is the staging runs behind it.
- A SERIES OF THREE PARTS (style guide §16): `chapter_start` on frames 1, 7, 13. Part 1 is the problem, step 1 and step 2's six kinds (two beats of three), closing on D-024; part 2 is steps 3 and 4 (step 4 in three beats, one kind of detail each); part 3 is steps 5 and 6, the callback and the resolved plan. Linear.
- Built from the project record (§14): names from `glossary.md`, the rail from `reel stage`, the look from `.reelplanning/theme/frame.md`. Decisions in force, never asked: D-021 and D-005 on step 1, D-004 and D-024 on step 2, D-023 on step 4.
- The plan is about what the review LOOKS like, so almost every beat is a prototype of a page with the rail reduced to a 44px spine (§18 v9). Openers, closers and branches carry the full rail, because the rail is what changes there. The node stage is gone: no beat needs it. At most six parts on any frame; one new thing per beat.
- One call carries the whole video: the upload-resume walkthrough's call A1, `src/upload/parts.ts` line 14 (16 MB parts instead of 8). The hook fails on it, step 1 opens it, step 3 comments on it, and step 4 and the callback open its evidence: the staging runs behind '16 MB parts lose less' (8, 16 and 32 MB, each through the same 40 dropped connections: parts resent, time to finish, retries). One spelling of those runs in every frame: 8 MB · 96 · 6:10 · 131; 16 MB · 52 · 4:40 · 64; 32 MB · 45 · 5:25 · 58.
- Steps 5 and 6 carry no internal names (no script or command names on screen or in the narration): step 5 is the plan's text below the video, following it; step 6 is a check that opens every page before you see the video.
- Palette: paper ground, ink voice, coral as the single signal per frame. Code pages are paper with mono text, never navy.
- Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still.
- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900 except captions.

## Frame 1 — Check parts.ts line 14


- chapter_start: The problem, steps 1 and 2
- scene: PROTOTYPE, no stage: the review player paused on a walkthrough beat (a 960×540 player: the frame inside shows 'Call A1 · Step 2' and the line 'check parts.ts line 14'; a scrub bar with 'paused 1:12'); on 'leave the player' a code editor window lands to the right, outside the player, titled 'src/upload/parts.ts', lines 12–16 with line 14 'const PART_SIZE = 16 * MB;'; on 'could not show it' a coral chip 'not in the video' lands on the editor
- voiceover: "The walkthrough says: check parts dot T S, line fourteen. So you leave the player to find it. The video pointed at the code, but could not show it."
- duration: 8.043s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete failure with stakes
- beat: Recognition
- blueprint: compose
- focal: the line the video pointed at but could not show
- roles: player = foreground · editor window = the thing outside · chip = the signal
- sfx: none

narrativeRole: Check parts.ts line 14.
keyMessage: The walkthrough says: check parts dot T S, line fourteen.

Scene 1 (0.0–2.5s): the paused player lands left of centre; its frame reads 'check parts.ts line 14'.
Scene 2 (2.5–5s): on 'leave the player' the editor window lands right, outside the player, line 14 marked with an ink rule.
Scene 3 (5–end): on 'could not show it' the chip 'not in the video' lands on the editor — the one coral. Held.

## Frame 2 — What a video cannot hold


- scene: PROTOTYPE ROW, no stage: three small page mocks side by side (each 500×420, the kinds of thing a video fails at): 1 'Risks' — a real 12-row risk table with a mono chip 'on screen 4 s'; 2 'Book-like' — the Bob Dylan design prototype as a flat picture, a pointer on its button and a chip 'a picture'; 3 on 'web page' a browser-shaped outline around all three with the mono line 'HTML · read, try, copy' above
- voiceover: "Other things fall through the same gap. A twelve-row risk table is on screen for four seconds. The Bob Dylan design prototypes are pictures you cannot click. A web page is good at these; a video is good at the story."
- duration: 13.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-gaps.html
- type: pain_point
- persuasion: Three concrete failures, then the contrast
- beat: Tension
- blueprint: compose
- focal: the table that is gone in four seconds, the prototype you cannot click
- roles: mocks = foreground · chips = the signal, one at a time
- sfx: none

narrativeRole: What a video cannot hold.
keyMessage: Other things fall through the same gap.

Scene 1 (0.0–2.5s): kicker 'What a video drops'.
Scene 2 (2.5–6.5s): on 'risk table' the 12-row table mock lands left; on 'four seconds' its chip 'on screen 4 s' (coral).
Scene 3 (6.5–10s): on 'Bob Dylan' the Book-like prototype lands centre; the pointer rests on its button, chip 'a picture'. The coral moves to that chip.
Scene 4 (10–end): on 'web page' the right slot fills with a page outline carrying 'HTML · read, try, copy'; on 'story' nothing new. Held.

## Frame 3 — Step 1: deep-dive beats

- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Deep-dive beats'; the storyboard line '- detail: parts-14' above the review player (1100×620) playing the walkthrough beat; on 'Open chip' a pill 'Open · E' lands on the player; on 'Press E' the pill fills, the bar reads 'paused', and the page opens as a side panel on the right half (parts.ts lines 12–16); on 'You chose' the tag 'decided · D-021' lands under the panel; on 'Close it' the panel leaves and the bar reads 'playing'; on 'rewind' the tag 'decided · D-005' lands under the player
- voiceover: "Step one: deep-dive beats. A beat can point at a page, and the player shows an Open chip. Press E: the video pauses, and the page opens in a side panel. You chose the panel in this review. Close it to carry on. Time in a page is not a rewind; the last plan decided that."
- duration: 15.403s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-step-1.html
- type: feature_showcase
- persuasion: Prototype of the thing
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- decided: D-021, D-005
- focal: the Open chip and the side panel it opens
- roles: player = foreground · Open chip = the new thing · side panel = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 1: deep-dive beats.
keyMessage: Step one:

Scene 1: 'Step one' — kicker, spine tick 1 coral.
Scene 2: on 'Open chip' the pill lands; the tick hands the coral to the pill.
Scene 3: on 'Press E' the pill fills; 'paused'; the side panel slides in over the right half.
Scene 4: on 'You chose' 'decided · D-021' lands under the panel.
Scene 5: on 'Close it' the panel slides out; 'playing'.
Scene 6: on 'rewind' 'decided · D-005' lands under the player. Held.

## Frame 4 — Step 2: kinds of detail, only what the video cannot

- scene: SPINE + THREE PAGE MOCKS (things you do, or data you check), one landing per spoken name: on 'only what the video cannot' the mono line 'only what the video cannot' under the row; 'Explore' — the uploads manifest row for upload 7f3a, its part cells filling as a 'Next part' button steps, status 'part 90'; 'Try it' — the Bob Dylan home page with three tabs 'Book-like · Magazine · Reference', the pointer on 'Magazine'; 'Evidence' — the claim '16 MB parts lose less' over the staging runs behind it: the same 40 dropped connections, one row each for 8, 16 and 32 MB (parts resent, time to finish, retries), the 16 MB row marked on 'staging runs'
- voiceover: "Step two: kinds of detail. A detail holds only what the video cannot; if one sentence could say it, the video says it. Explore: step through an upload yourself. Try it: click through the three Bob Dylan home pages. Evidence: the video says sixteen-megabyte parts lose less, and the page holds the staging runs behind that."
- duration: 19.387s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- persuasion: The rule and its test, then three pages you would use or check
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- focal: three details that hold what one narrated sentence could not
- roles: page mocks = foreground · spine = anchor
- sfx: none

narrativeRole: Step 2: kinds of detail, only what the video cannot.
keyMessage: Step two:

Scene 1: 'Step two' — kicker, spine tick 2 coral.
Scene 2: on 'only what the video cannot' the mono line lands under the row.
Scene 3: on 'Explore' the explorer lands; its cells fill as the button steps.
Scene 4: on 'Try it' the home page lands; the tab switches to Magazine.
Scene 5: on 'Evidence' the evidence page lands with its claim; on 'staging runs' the three runs land and the 16 MB row is marked. Held.

## Frame 5 — Step 2: kinds of detail, things to read

- scene: SPINE + THREE PAGE MOCKS (things you read), one landing per spoken name: 'Table' — the risk list, 7 rows with a level column, 'sorted by level'; 'Code' — parts.ts lines 12–16 with the chip 'only when justified' under it; 'Plan text' — the Step 2 heading and its opening lines with a search field 'manifest · 1 match'; on 'pick-all' the tag 'decided · D-004' lands under the row with 'a pick-all summary may carry one'
- voiceover: "Three kinds are for reading. A table, for anything over four rows, like the risk list. Code, only when the code itself is what you are judging. And the plan's own text, to search and copy. A pick-all summary frame may carry one too; that was decided before."
- duration: 14.741s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10b-step-2-read.html
- type: feature_showcase
- persuasion: Prototype of the thing: three pages you would read
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- decided: D-004
- focal: three details you read
- roles: page mocks = foreground · decided tag = the signal · spine = anchor
- sfx: none

narrativeRole: Step 2: kinds of detail, things to read.
keyMessage: Three kinds are for reading.

Scene 1: the spine as step 2 left it.
Scene 2: on 'table' the risk table lands.
Scene 3: on 'Code' the code page lands; 'only when justified' under it.
Scene 4: on 'plan's own text' the plan page lands.
Scene 5: on 'pick-all' 'decided · D-004' lands. Held.

## Frame 6 — Next: part 2

- scene: RAIL (full): slot 1 'Deep-dive beats' with 'decided · D-021' under its title, slot 2 'Detail kinds' filled; on 'fixed types first' the tag 'decided · D-024' lands under slot 2's title (coral, the one signal); on 'Next' 'Next · Part 2' in mono beside the rail with the hero line 'Comments, and what changed'
- voiceover: "Each page is a fixed type first, and a fresh page only when none fits; you chose that in your second review. Next, part two: comments inside a page, and what a walkthrough opens."
- duration: 10.661s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- decided: D-024
- focal: the rail, and step 2's decided tag
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two:

Scene 1: the rail as resolved so far.
Scene 2: on 'fixed types first' 'decided · D-024' lands under slot 2 (coral).
Scene 3: on 'Next' the mono line and the hero. Held still.

## Frame 7 — Part 2 of 3

- chapter_start: Steps 3 and 4: comments, what changed
- scene: RAIL (full): slots 1–2 as resolved (slot 2 'decided · D-024'); slots 3 and 4 lift from dashed to filled, slot 4 carrying 'decided · D-023' under its title; kicker 'Part 2 of 3'; hero 'Only what the video cannot'
- voiceover: "Part two of three. A page opens beside the video, and it holds only what the video cannot. Now, steps three and four."
- duration: 7.083s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-opener-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 3.
keyMessage: Part two of three.

Scene 1: kicker; hero; slots 3, 4 fill on 'three and four'. Held.

## Frame 8 — Step 3: comments inside a detail


- scene: SPINE + PROTOTYPE: kicker 'Step 3 · Comments inside'; the code detail page (parts.ts, lines 11–17) on the left; on 'a line of code' line 14 takes a selection; a comment box opens beside it with 'Why 16 MB, not 8?'; on 'knows its step' three mono chips under the box 'step 2 · parts-14 · line 14'; on 'resolve-plan' a plan.resolved.md page lands right with 'Step 2' and the row 'parts.ts line 14: Why 16 MB, not 8?'
- voiceover: "Step three: comments inside a detail. Select a line of code, a table row, or a button in a prototype, and comment on it. The comment knows its step, its page and its line. resolve-plan lists it under that step, with where it points: parts dot T S, line fourteen."
- duration: 16.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-step-3.html
- type: feature_showcase
- persuasion: Worked example with real values
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- focal: a selected line becoming a line in the resolved plan
- roles: code page = foreground · comment box = the new thing · resolved page = the worked example · spine = anchor
- sfx: none

narrativeRole: Step 3: comments inside a detail.
keyMessage: Step three: comments inside a detail.

Scene 1 (0.0–1.2s): 'Step three' — kicker, spine tick 3 coral.
Scene 2 (1.2–4s): the code page lands left.
Scene 3 (4–7s): on 'a line of code' line 14 is selected; the comment box opens beside it, the words in it.
Scene 4 (7–10s): on 'knows its step' the three chips land under the box.
Scene 5 (10–end): on 'resolve-plan' the resolved page lands right; its row takes the coral left rule. Held.

## Frame 9 — Step 4: a behaviour change, before and after

- scene: SPINE + TWO PAGE MOCKS: kicker 'Step 4 · What changed'; on 'behaviour' the mono line 'a behaviour change · before and after' top; on 'before and after' two upload mocks side by side: 'Before' — a 2 GB upload bar stopped at 90% with 'restart · starts from 0'; 'After' — the same bar continuing past 90% with 'restart · resumes at part 116'; each has a 'Run' button (you can try it); on 'resumes' the After card takes the coral border
- voiceover: "Step four: walkthroughs open onto what changed, not always the code. Each call the agent made on its own can open a detail. A behaviour change opens a before and after you can try: the old upload fails at ninety percent, and the new one resumes."
- duration: 16.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-step-4.html
- type: feature_showcase
- persuasion: Prototype of the thing: before and after
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- focal: the same upload, failing and resuming
- roles: two upload mocks = foreground · spine = anchor
- sfx: none

narrativeRole: Step 4: a behaviour change, before and after.
keyMessage: Step four:

Scene 1: 'Step four' — kicker, spine tick 4 coral.
Scene 2: on 'agent made on its own' the call line lands.
Scene 3: on 'before and after' both cards land; on 'fails' the Before bar stops at 90%.
Scene 4: on 'resumes' the After bar runs on; its card takes the coral. Held.

## Frame 10 — Step 4: a value, and the evidence for it

- scene: SPINE + THE EVIDENCE PAGE: kicker 'Step 4 · What changed'; the mono line 'a value the agent picked · call A1'; on 'eight-megabyte' a chip 'plan said · 8 MB', on 'sixteen' a chip 'agent picked · 16 MB'; on 'staging runs' the evidence page lands (details/a1-staging-runs.html: 'same 40 dropped connections', rows 8, 16 and 32 MB with parts resent, time to finish, retries), the 8 MB row tagged 'plan', the 16 MB row tagged 'picked' and bordered coral on 'judge'
- voiceover: "A value the agent picked opens the evidence for it, not the value again. The plan said eight-megabyte parts; the agent picked sixteen. So the page holds the staging runs behind that pick: eight, sixteen and thirty-two megabytes, each through the same forty dropped connections. You judge the number from the runs."
- duration: 17.808s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18b-step-4-value.html
- type: feature_showcase
- persuasion: The evidence behind a claim, not the claim restated
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- focal: the three runs, the agent's pick marked
- roles: evidence page = foreground · two chips = the claim · spine = anchor
- sfx: none

narrativeRole: Step 4: a value, and the evidence for it.
keyMessage: A value the agent picked opens the evidence for it, not the value again.

Scene 1: the call line lands.
Scene 2: on 'eight-megabyte' the plan chip; on 'sixteen' the agent chip.
Scene 3: on 'staging runs' the evidence page lands; its rows land on 'eight, sixteen and thirty-two'.
Scene 4: on 'judge' the 16 MB row takes the coral border. Held.

## Frame 11 — Step 4: code, only for an interface or data

- scene: SPINE + CODE PAGE: kicker 'Step 4 · What changed'; the mono line 'an interface change · call A2'; a code page 'src/upload/complete.ts' lines 21–26 (complete returns 409 when parts are missing) with the two lines that carry the call marked and the note 'A2 · 409, not 400'; on 'accept or flag' two buttons 'Accept' 'Flag' under the page; on 'justified' the tag 'decided · D-023' lands under the buttons
- voiceover: "Only a change to an interface or to data opens the code, with the lines that carry the call marked. You accept or flag the call from inside the page. Code only when it is justified: you decided that in this review."
- duration: 12.437s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18c-step-4-code.html
- type: feature_showcase
- persuasion: Prototype of the thing
- beat: Comprehension
- blueprint: compose
- plan_step: 4
- decided: D-023
- focal: the marked lines of a data change
- roles: code page = foreground · decided tag = the signal · spine = anchor
- sfx: none

narrativeRole: Step 4: code, only for an interface or data.
keyMessage: Only a change to an interface or to data opens the code, with the lines that carry the call marked.

Scene 1: the call line lands.
Scene 2: on 'interface or to data' the code page lands; on 'marked' the two lines mark.
Scene 3: on 'accept or flag' the buttons land.
Scene 4: on 'justified' 'decided · D-023' lands. Held.

## Frame 12 — Next: part 3

- scene: RAIL (full): slots 1–4 as resolved (slot 2 'decided · D-024', slot 4 'decided · D-023'); 'Next · Part 3' beside the rail with the hero 'The plan, and the check'
- voiceover: "Next, the last part: the plan beside the video, and the check before you see it."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-closer-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, the last part:

Scene 1: the rail as resolved so far; the mono line and the hero. Held still.

## Frame 13 — Part 3 of 3

- chapter_start: Steps 5 and 6, and the plan
- scene: RAIL (full): slots 1–4 as resolved (slot 2 'decided · D-024'); slots 5 and 6 lift from dashed to filled; kicker 'Part 3 of 3'; hero 'Each call opens what changed'
- voiceover: "Part three of three. Comments reach inside a page, and each call opens what changed. Two steps left, then the plan."
- duration: 6.592s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-opener-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 3 of 3.
keyMessage: Part three of three.

Scene 1: kicker; hero; slots 5, 6 fill on 'Two steps left'. Held.

## Frame 14 — Step 5: the plan below the video

- scene: SPINE + PROTOTYPE OF THE REVIEW PAGE: kicker 'Step 5 · Plan below the video'; a page (1300 wide) with the player on top (the frame 'Step 4 · What changed', a bar at '1:52 · playing') and the plan's text below it, one section per step (headings 'Step 3 — Comments inside a detail', 'Step 4 — …', 'Step 5 — …' with grey text bars); on 'highlighted' the Step 4 section takes the coral left rule; on 'Click any step' a pointer clicks the 'Step 5' heading, the bar jumps to '3:40' and the frame reads 'Step 5', and the highlight moves to Step 5
- voiceover: "Step five: the whole plan, as text, sits below the video. It is the same plan you would read on its own. The step the video is on is highlighted, so you always know where you are. Click any step, and the video jumps there. You can skim ahead, search, or copy a sentence without losing your place."
- duration: 16.149s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-step-5.html
- type: feature_showcase
- persuasion: Prototype of the thing
- beat: Comprehension
- blueprint: compose
- plan_step: 5
- focal: the text below the video following it, and a click moving the video
- roles: review page = foreground · spine = anchor
- sfx: none

narrativeRole: Step 5: the plan below the video.
keyMessage: Step five:

Scene 1: 'Step five' — kicker, spine tick 5 coral.
Scene 2: the page lands: the player on top, the plan text below.
Scene 3: on 'highlighted' the Step 4 section takes the coral rule.
Scene 4: on 'Click any step' the pointer clicks Step 5; the video jumps; the highlight moves.
Scene 5: on 'skim ahead' nothing new. Held.

## Frame 15 — Step 6: every detail works before you see it

- scene: SPINE + A CHECK LIST: kicker 'Step 6 · Checked first'; a card 'Before you see this video' listing its 5 pages ('parts.ts line 14 · code', 'manifest explorer', 'risk table', 'Bob Dylan home pages', 'Step 2 text'), each row taking 'opens' in turn; on 'missing' the risk table row reads 'missing' and a bar 'Build stopped · not sent' lands under the card (coral); on 'never leads nowhere' the row reads 'opens' again and the bar becomes 'Sent to you'
- voiceover: "Step six: every page works before you see it. Before a video reaches you, a check opens every page it links to. If one is missing or broken, the build stops, just as it does for a broken frame. So an Open chip never leads nowhere. This plan's own video is the first test."
- duration: 16.128s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-step-6.html
- type: feature_showcase
- persuasion: The failure, then the guard
- beat: Comprehension
- blueprint: compose
- plan_step: 6
- focal: one missing page stopping the build
- roles: check card = foreground · stop bar = the signal · spine = anchor
- sfx: none

narrativeRole: Step 6: every detail works before you see it.
keyMessage: Step six:

Scene 1: 'Step six' — kicker, spine tick 6 coral.
Scene 2: on 'opens every page' the rows take 'opens' one by one.
Scene 3: on 'missing' the risk table row reads 'missing'; 'Build stopped' lands.
Scene 4: on 'never leads nowhere' the row is fixed; 'Sent to you'. Held.

## Frame 16 — Back to line 14

- scene: PROTOTYPE, no stage (the hook's player, now with details): the paused player at the walkthrough beat 'check parts.ts line 14', the claim '16 MB parts lose less' under it; on 'Open chip' the pill 'Open · E' lands; on 'press E' a side panel opens on the right half with the evidence page 'A1 · staging runs' (same 40 dropped connections; 8, 16 and 32 MB rows: parts resent, time to finish, retries; the 16 MB row marked); on 'accept' the Accept button fills and a mono chip 'A1 · accepted' lands under the player; on 'goes on' the panel closes and the bar reads 'playing'
- voiceover: "Back to line fourteen. The walkthrough reaches it, the Open chip appears, and you press E. The panel holds the staging runs: through the same forty dropped connections, sixteen-megabyte parts finished first. You accept the call, close the page, and the video goes on."
- duration: 14.848s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-callback.html
- type: benefit_highlight
- persuasion: Before → after on the hook's own example
- beat: Resolution
- blueprint: compose
- focal: the same call, now judged from its evidence inside the player
- roles: player = foreground · panel = the resolution · chip = the signal
- sfx: none

narrativeRole: Back to line 14.
keyMessage: Back to line fourteen.

Scene 1: the hook's player lands at the same place.
Scene 2: on 'Open chip' the pill lands; on 'press E' it fills.
Scene 3: the panel opens on the right half, the staging runs in it.
Scene 4: on 'accept' Accept fills; the chip 'A1 · accepted' lands (coral).
Scene 5: on 'goes on' the panel closes; 'playing'. Held.

## Frame 17 — The plan, resolved

- scene: STEPS AND CHOICES, no diagram: the six steps as a list at reading size, centred; step 1 carries 'decided · D-021', step 2 'decided · D-024', step 4 'decided · D-023'; kicker 'The plan · 6 steps, 3 decided'; no coral; 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "That is the plan: six steps, and three decisions you have made. Draw on any step to ask for a change, or approve it."
- duration: 9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-resolved.html
- type: cta
- decided: D-021, D-024, D-023
- persuasion: Resolved plan + call to action
- beat: Resolve
- blueprint: compose
- focal: the six steps and the three decisions
- roles: step list = foreground · paper ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That is the plan:

Scene 1: the list settles in.
Scene 2: held dead still.
