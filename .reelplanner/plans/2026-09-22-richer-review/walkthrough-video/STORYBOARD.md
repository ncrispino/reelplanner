---
title: "Richer review: what landed"
format: 1920x1080
duration: 365s
message: "All six steps landed, with one deviation; fifteen calls the plan did not cover, each to accept or flag"
arc: walkthrough with autonomy beats, in five parts
audience: the reviewer who approved the richer-review plan (and someone new to the repo), deciding whether to accept what was built
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-richer-review
---

## Video direction

- A WALKTHROUGH (lifecycle stage 4, style guide §13), built from `walkthrough.md` on the SAME stage, look and names as this plan's own video (`../video/`): the rail with the plan video's six slot titles, the parts at their `system.json` places with their `glossary.md` names, `.reelplanning/theme/frame.md`, the same fonts.
- THE STAGE STARTS DONE (as in `videos/w1-upload-resume`): every rail slot is filled from t=0 and nothing is built on cue; what changes is which part is lit, which chips land, which tag a slot gains.
- A SERIES OF FIVE PARTS (§16): `chapter_start` on frames 1, 8, 16, 24, 31; each part opens on the rail as reported so far and closes by naming the next. The rail's slot tags are the running tally of calls reported per step (`2 calls`, `4 calls`, …, `1 call · dev`).
- DENSITY (§19, the rule this plan added): at most six parts on screen. The stage starts as the plan video's four (the plan-to-video skill, resolve-plan, the reel CLI, the review player); finish-project joins at the first call that touches it (A2), the revise step at A6, one new part per beat. Node labels are glossary names; file names only ever appear in the check chip.
- WHAT-CHANGED BEATS (one per step): prototypes of the surfaces that landed (the option grid, the tick boxes, the reel check warning, the text box on a mark, the frame lint's failure), with the rail as a 44 px spine; step 6 is the plan video's step-6 stage picture.
- AUTONOMY BEATS (A1–A15, and the step-5 deviation as its own beat): the stage with the touched part lit coral, and in the left column two cards — `Chose · …` with a 2 px INK border and `Instead of · …` at ink 55 % — and the check as a mono chip under them. No recommendation and no coral on the cards: the thing is done; the player pauses and asks Accept (A) or Flag (B). Everything the call needs sits above y 650, because the player's sheet covers the lower third while it asks.
- QUICK CHECKS (K1 after step 2, K2 after step 6): the question and three option cards, none marked.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word, a held read at the end; nothing below y 900 but captions.
- Calls with no plan step in `walkthrough.md` (A6, A13, A14 on notes; A15 on sound) carry the step they sit closest to so a flag lands somewhere: notes on answers → step 1 (answering questions), the sound fix → step 4 (typing in a comment was the bug).


## Frame 1 — What landed

- chapter_start: What landed, and step 1
- scene: FULL STAGE, STARTS DONE: the rail with all 6 slots filled and the plan video's four parts (the plan-to-video skill, resolve-plan, the reel CLI, the review player) with their 2 edges, all in ink from t=0; on 'six steps' a mono chip '6 of 6' under the rail; on 'fifteen calls' a mono chip '15 calls · 1 deviation' lands under the stage (coral text, the one coral); held
- voiceover: "The richer review plan is built. All six steps landed, one with a deviation, and I made fifteen calls the plan did not cover. After each call, the video stops: accept it, or flag it."
- duration: 11.05s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete outcome first
- beat: Hook
- blueprint: compose
- focal: the finished stage, and the count of calls
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What landed.
keyMessage: The richer review plan is built.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'six'): c6 lands, timed to the start of the word.
Scene 3 (on 'fifteen'): c15 lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 2 — Asked for: part bar and keys

- scene: NO STAGE, PROTOTYPE of the player's own controls: kicker 'Not in the plan · keys'; the player's part bar (5 bars, each with a numbered chip and its title under it, part 1 current); on 'N and P' two keycaps N and P land beside the bar; on 'A accepts' the call sheet with keycap A 'Accept' and keycap B 'Flag' lands under it; on 'B flags' B's border goes coral
- voiceover: "Two things you asked for are already here. Each part has a numbered chip under its bar, and N and P jump between parts. When the video stops on a call, A accepts it and B flags it."
- duration: 10.43s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-keys.html
- type: benefit_highlight
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the part bar and the four keys
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Asked for: part bar and keys.
keyMessage: Two things you asked for are already here.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'numbered'): chips lands, timed to the start of the word.
Scene 3 (on 'N'): np lands, timed to the start of the word.
Scene 4 (on 'A'): ab lands, timed to the start of the word.
Scene 5 (on 'flags'): flag lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 3 — Call A15: the sound fix

- scene: SPINE + STAGE (4 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player; all dim except the one this call touches): kicker 'Call A15 · Step 4'; spine tick 4 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'old mute ignored' under it; on 'ignores' the card 'Chose · A new mute setting' (2 px ink border) lands in the left column; on 'deleting' the card 'Instead of · Delete the old one' lands at ink 55 %; under them the check chip 'player MUTE_KEY'; held — the player pauses here and asks Accept / Flag
- voiceover: "Also asked for: the sound fix. An old bug saved mute when you typed m in a comment. The player now ignores that setting and stores mute under a new name, instead of deleting the old one."
- duration: 10.82s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-call-a15.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a15
- chose: The player ignores the old saved mute setting and keeps mute under a new name
- instead_of: Deleting the old setting
- why: An old bug saved mute whenever you typed m in a comment, which kept the sound off
- check: player MUTE_KEY
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A15: the sound fix.
keyMessage: Also asked for:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'bug'): example lands, timed to the start of the word.
Scene 3 (on 'ignores'): chose lands, timed to the start of the word.
Scene 4 (on 'deleting'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 4 — Step 1: up to 4 options

- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Up to 4 options'; the player's question sheet from the test fixture ('Where does the manifest live?'); on 'Three' three option cards sit in one row; on 'two by two' a fourth arrives and the four settle 2 × 2 at the same text size (coral border on the new fourth card); on 'phone' a mono chip 'phone · 1 column' under the sheet
- voiceover: "Step one landed as written. A question can carry two, three or four options. Three sit in a row, four sit two by two, and on a phone they stack, so the text never shrinks."
- duration: 10.09s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the four-option grid
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 1: up to 4 options.
keyMessage: Step one landed as written.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Three'): row3 lands, timed to the start of the word.
Scene 3 (on 'two'): grid lands, timed to the start of the word.
Scene 4 (on 'phone'): stack lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 5 — Call A1: find the option by its letter

- scene: SPINE + STAGE (4 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player; all dim except the one this call touches): kicker 'Call A1 · Step 1'; spine tick 1 in ink; resolve-plan lit coral (the frame's one coral) with the worked-example chip 'B · One summary frame' under it; on 'letter' the card 'Chose · By its letter' (2 px ink border) lands in the left column; on 'exact' the card 'Instead of · Exact label only' lands at ink 55 %; under them the check chip 'scripts/resolve-plan.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "resolve plan now finds your chosen option by its letter when the label differs. Matching the exact label only was the other way, but real plans put the letter first, so it never matched."
- duration: 10.67s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-call-a1.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a1
- chose: resolve-plan finds your chosen option by its letter when the label does not match
- instead_of: Matching the exact label only
- why: Real plans write the letter first (A · Label), so exact matching never found the chosen option
- check: scripts/resolve-plan.mjs
- focal: resolve-plan, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A1: find the option by its letter.
keyMessage: resolve plan now finds your chosen option by its letter when the label differs.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'letter'): chose lands, timed to the start of the word.
Scene 3 (on 'exact'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 6 — Call A7: 4 options go 2 × 2

- scene: SPINE + STAGE (4 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player; all dim except the one this call touches): kicker 'Call A7 · Step 1'; spine tick 1 in ink; The review player lit coral (the frame's one coral) with the worked-example chip '4 options · 2 × 2' under it; on 'two' the card 'Chose · 4 across from 1200 px' (2 px ink border) lands in the left column; on 'across' the card 'Instead of · 4 across at 1440' lands at ink 55 %; under them the check chip 'player .opts[data-n]'; held — the player pauses here and asks Accept / Flag
- voiceover: "Four options sit two by two until the video is twelve hundred pixels wide. Four across on a fourteen-forty window was the other way, but there, four narrow cards wrap each reason onto four or five lines."
- duration: 12.38s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-call-a7.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a7
- chose: Four options sit 2 × 2, and go 4 across only when the video is at least 1200 px wide
- instead_of: 4 across from a 1440 px window
- why: There, four narrow cards (about 240 px) wrap each reason onto 4–5 lines
- check: player .opts[data-n]
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A7: 4 options go 2 × 2.
keyMessage: Four options sit two by two until the video is twelve hundred pixels wide.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'two'): chose lands, timed to the start of the word.
Scene 3 (on 'across'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 7 — Next: part 2

- scene: RAIL (full, all filled): slot 1 gains the ink tag '2 calls' (slot 4 already carries '1 call' from A15); 'Next · Part 2' in mono beside the rail with the hero 'Pick all that apply'
- voiceover: "Next, part two: step two, where you can tick more than one answer."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 8 — Part 2 of 5

- chapter_start: Step 2: pick all that apply
- scene: RAIL (full): slots 1 and 4 carry their tags; kicker 'Part 2 of 5'; hero 'Up to 4 options, reported'; slot 2 lifts (ink border) on 'more than one'
- voiceover: "Part two of five. Up to four options is reported. Now, questions where more than one answer is right."
- duration: 6.59s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-opener-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 5.
keyMessage: Part two of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'more'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 9 — Step 2: pick all that apply

- scene: SPINE + PROTOTYPE: kicker 'Step 2 · Pick all that apply'; tag 'decided · D-004' on 'decision'; the pick-all sheet ('Which clients get resume first?', 4 tick boxes); on 'tick' Web uploader and iOS app tick; on 'Confirm' the button 'Confirm 2 picks' fills; on 'ledger' a ledger row 'q2 · chosenIds: a, b' lands under the sheet (coral left rule, the one coral)
- voiceover: "Step two landed, and keeps the decision from the plan review: one summary frame, whatever you pick. You tick options and press Confirm. The decision ledger stores the whole set, and resolve plan marks every pick."
- duration: 12.42s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-step-2.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: two ticks becoming one ledger entry
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 2: pick all that apply.
keyMessage: Step two landed, and keeps the decision from the plan review:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'decision'): d004 lands, timed to the start of the word.
Scene 3 (on 'tick'): tick lands, timed to the start of the word.
Scene 4 (on 'Confirm'): confirm lands, timed to the start of the word.
Scene 5 (on 'ledger'): ledger lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 10 — Call A2: no branch beats on pick-all

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): finish-project lands at its system.json place as it is named (the one new part this beat); kicker 'Call A2 · Step 2'; spine tick 2 in ink; finish-project lit coral (the frame's one coral) with the worked-example chip 'pick-all → summary' under it; on 'branch' the card 'Chose · No branch beats' (2 px ink border) lands in the left column; on 'Allowing' the card 'Instead of · Branches allowed' lands at ink 55 %; under them the check chip 'scripts/plan-map.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "When finish project assembles the video, a pick-all question gets no branch beats at all. Allowing branches was the other way, but the review chose one summary frame, whatever is picked."
- duration: 10.65s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-call-a2.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a2
- chose: A pick-all question has no branch beats; the video goes straight to its summary frame
- instead_of: Allowing branch beats on a pick-all question
- why: The plan review decided on one summary frame, whatever is picked (D-004)
- check: scripts/plan-map.mjs
- focal: finish-project, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A2: no branch beats on pick-all.
keyMessage: When finish project assembles the video, a pick-all question gets no branch beats at all.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'finish'): node lands, timed to the start of the word.
Scene 3 (on 'branch'): chose lands, timed to the start of the word.
Scene 4 (on 'Allowing'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 11 — Call A3: 1 ledger entry per pick-all answer

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A3 · Step 2'; spine tick 2 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip '1 entry · 2 picks' under it; on 'one' the card 'Chose · One ledger entry' (2 px ink border) lands in the left column; on 'per' the card 'Instead of · One entry per pick' lands at ink 55 %; under them the check chip 'scripts/reel.mjs record'; held — the player pauses here and asks Accept / Flag
- voiceover: "A pick-all answer is one entry in the decision ledger, with every pick in it. One entry per pick was the other way, but you answered one question, and reel check compares questions."
- duration: 10.31s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-call-a3.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a3
- chose: A pick-all answer is one entry in the decision ledger, holding every pick
- instead_of: One ledger entry per pick
- why: You were asked one question, and reel check's re-ask guard compares questions
- check: scripts/reel.mjs record
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A3: 1 ledger entry per pick-all answer.
keyMessage: A pick-all answer is one entry in the decision ledger, with every pick in it.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'one'): chose lands, timed to the start of the word.
Scene 3 (on 'per'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 12 — Call A8: how a frame shows the picks

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A8 · Step 2'; spine tick 2 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'Web uploader, iOS app' under it; on 'line' the card 'Chose · One line per pick' (2 px ink border) lands in the left column; on 'template' the card 'Instead of · A template per item' lands at ink 55 %; under them the check chip 'player applyPicks()'; held — the player pauses here and asks Accept / Flag
- voiceover: "A summary frame shows your picks in one element: a list gets one line per pick, anything else gets the labels with commas. A template per item was the other way; this rule is simpler to rely on."
- duration: 11.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-call-a8.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a8
- chose: A summary frame shows the picks one line each in a list, or joined with commas anywhere else
- instead_of: A template per pick
- why: It is the simplest rule a frame author can rely on; the style guide says it
- check: player applyPicks()
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A8: how a frame shows the picks.
keyMessage: A summary frame shows your picks in one element:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'line'): chose lands, timed to the start of the word.
Scene 3 (on 'template'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 13 — Call A9: replays skip to the summary

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A9 · Step 2'; spine tick 2 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'own words → summary' under it; on 'skips' the card 'Chose · Skip to the summary' (2 px ink border) lands in the left column; on 'Routing' the card 'Instead of · Single picks only' lands at ink 55 %; under them the check chip 'player tickDecisions'; held — the player pauses here and asks Accept / Flag
- voiceover: "On a replay, an answer with no branch of its own skips straight to its summary. Routing only single picks was the other way, but then an answer in your own words replayed every branch."
- duration: 10.28s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-call-a9.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a9
- chose: On a replay, an answer with no branch of its own skips from the question to its summary
- instead_of: Routing only single picks that have branches
- why: A 4-option question may have options without branches, and own-words answers were replaying every branch
- check: player tickDecisions
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A9: replays skip to the summary.
keyMessage: On a replay, an answer with no branch of its own skips straight to its summary.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'skips'): chose lands, timed to the start of the word.
Scene 3 (on 'Routing'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 14 — Quick check: after a pick-all answer

- scene: SPINE: kicker 'Quick check · Step 2'; the question in serif; three option cards A/B/C land on their words, none marked
- voiceover: "Quick check. On a pick-all question, you tick Web and Slides. What plays next: both options' branches, one frame listing your picks, or nothing at all?"
- duration: 8.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-check-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 2
- quiz: k1
- question: You tick Web and Slides on a pick-all question. What plays next?
- option_a: Both options' branches
- option_b: One frame listing your picks
- option_c: Nothing, the video moves on
- answer: b
- explain: D-004: one summary frame, the same length whatever you pick
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: after a pick-all answer.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'both'): o1 lands, timed to the start of the word.
Scene 3 (on 'one'): o2 lands, timed to the start of the word.
Scene 4 (on 'nothing'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 15 — Next: part 3

- scene: RAIL (full): slot 2 gains '4 calls'; 'Next · Part 3'; hero 'Count, marks, diagrams'
- voiceover: "Next, part three: steps three, four and five."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-closer-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 16 — Part 3 of 5

- chapter_start: Steps 3 to 5
- scene: RAIL (full): kicker 'Part 3 of 5'; hero 'Pick-all, reported'; slot 3 lifts on 'how many'
- voiceover: "Part three of five. Pick-all questions are reported. Now: how many questions, words on a mark, and diagrams."
- duration: 7.19s
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

narrativeRole: Part 3 of 5.
keyMessage: Part three of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'how'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 17 — Step 3: as many questions as needed

- scene: SPINE + PROTOTYPE: kicker 'Step 3 · As many as needed'; a terminal card running 'reel check' on a plan with 7 open questions; on 'one decision per part' a mono chip '1 decision · 1 part'; on 'warns' the output line '△ 7 open questions' lands (coral mark), then '0 failure(s), 1 warning(s)' on 'never'
- voiceover: "Step three landed. The budget is now one decision per part of about a minute, not about three per plan. And reel check warns, but never fails, past six open questions."
- duration: 10.16s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-step-3.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the warning line
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 3: as many questions as needed.
keyMessage: Step three landed.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'budget'): budget lands, timed to the start of the word.
Scene 3 (on 'warns'): warn lands, timed to the start of the word.
Scene 4 (on 'never'): nofail lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 18 — Step 4: type on the mark

- scene: SPINE + PROTOTYPE: kicker 'Step 4 · Type on the mark'; a paused video with a question sheet; on 'mark' a coral arrow draws; on 'text box' the box opens beside it, a × at its right end, and words type in; on 'Enter' the record row '1:12 · step 1 · arrow · "Why only two?"' lands; on 'After' the mono line 'changed after review' lands under the box, and on 'Escape' the chip 'Esc keeps · × discards' above it
- voiceover: "Step four landed. When you finish a mark, a text box opens beside it, and the video stays paused. Enter saves the words as the mark's comment. After review, Escape keeps them too; only the x in the box throws them away."
- duration: 13.328s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-step-4.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: the arrow and its words
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 4: type on the mark.
keyMessage: Step four landed; after review, Escape keeps the words and only the × discards them.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'mark'): arrow lands, timed to the start of the word.
Scene 3 (on 'text'): box lands, timed to the start of the word.
Scene 4 (on 'Enter'): saved lands, timed to the start of the word.
Scene 5 (on 'After'): the 'changed after review' line lands, timed to the start of the word.
Scene 6 (on 'Escape'): the Esc / × chip lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 19 — Call A10: Escape keeps the words too

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A10 · Step 4'; on 'Changed' the mono chip 'changed after review' lands beside the kicker; spine tick 4 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'Esc · words kept · × discards' under it; on 'keeps' the card 'Chose · Only × discards' (2 px ink border) lands in the left column; on 'Discarding' the card 'Instead of · Discard on Escape' lands at ink 55 %; under them the check chip 'player openMarkBox, closeMarkBox'; held — the player pauses here and asks Accept / Flag
- voiceover: "Changed after review, as you asked: Escape now keeps what you typed, just like clicking away, and only the x in the box throws it away. Discarding on Escape was the old way, but you did not want to lose your words by accident."
- duration: 13.285s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-call-a10.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a10
- chose: Clicking away, starting another mark, or pressing Escape keeps the words you typed; only the × in the box discards them (changed after review)
- instead_of: Discarding the words when you click away, or when you press Escape
- why: Clicking away should not lose your words, and the reviewer did not want Escape to remove them by accident
- check: player openMarkBox, closeMarkBox
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A10: Escape keeps the words too (changed after review).
keyMessage: Changed after review: Escape keeps what you typed; only the × discards it.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Changed'): the 'changed after review' chip lands, timed to the start of the word.
Scene 3 (on 'keeps'): chose lands, timed to the start of the word.
Scene 4 (on 'Discarding'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 20 — Step 5: at most 6 parts on screen

- scene: SPINE + PROTOTYPE: kicker 'Step 5 · Diagrams to follow'; a terminal card of the frame lint on a frame with 7 parts; on 'fails' the line '✗ 7 parts on one frame (at most 6)' lands (coral ✗); on 'one new thing' a mono chip '1 new thing per beat'
- voiceover: "Step five: the frame lint, which checks each frame as it is built, now fails any frame with more than six parts. And the style guide asks for one new thing per beat, in plain names."
- duration: 10.9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-step-5.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: the failing lint line
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 5: at most 6 parts on screen.
keyMessage: Step five:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fails'): fail lands, timed to the start of the word.
Scene 3 (on 'new'): plain lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 21 — Call A5: count parts in the code

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A5 · Step 5'; spine tick 5 in ink; The plan-to-video skill lit coral (the frame's one coral) with the worked-example chip '7 parts → fails' under it; on 'counts' the card 'Chose · Count the code' (2 px ink border) lands in the left column; on 'browser' the card 'Instead of · Count the screen' lands at ink 55 %; under them the check chip 'scripts/frame-lint.mjs rule 4b'; held — the player pauses here and asks Accept / Flag
- voiceover: "The lint counts the parts named in a frame's code, and a whole-system beat can opt out. Checking in a browser was the other way, but this is cheap enough to run on every frame."
- duration: 9.75s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-call-a5.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a5
- chose: The lint counts the parts named in a frame's code; a whole-system beat can opt out
- instead_of: Counting what a browser shows at each moment
- why: It is cheap enough to run on every frame as it is built
- check: scripts/frame-lint.mjs rule 4b
- focal: The plan-to-video skill, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A5: count parts in the code.
keyMessage: The lint counts the parts named in a frame's code, and a whole-system beat can opt out.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'counts'): chose lands, timed to the start of the word.
Scene 3 (on 'browser'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 22 — Deviation: 4 older frames over the limit

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Deviation · Step 5'; spine tick 5 in ink; The plan-to-video skill lit coral (the frame's one coral) with the worked-example chip '4 frames · 7 and 10 parts' under it; on 'left' the card 'Chose · Left as they are' (2 px ink border) lands in the left column; on 'rebuilding' the card 'Instead of · Rebuilt here' lands at ink 55 %; under them the check chip 'frame-lint on close-the-lifecycle/video'; held — the player pauses here and asks Accept / Flag
- voiceover: "One deviation. Four frames of the older close-the-lifecycle video now fail this rule, with seven and ten parts. I left them as they are, instead of rebuilding them, because that video is outside this plan."
- duration: 12.35s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-deviation.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: d1
- chose: Four frames of the close-the-lifecycle video that now break the 6-part rule are left as they are
- instead_of: Rebuilding them to the new rule in this plan
- why: Built before the rule, and this plan leaves that plan's work out of scope
- check: frame-lint on close-the-lifecycle/video
- focal: The plan-to-video skill, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: 4 older frames over the limit.
keyMessage: One deviation.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Four'): example lands, timed to the start of the word.
Scene 3 (on 'left'): chose lands, timed to the start of the word.
Scene 4 (on 'rebuilding'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 23 — Next: part 4

- scene: RAIL (full): slot 4 '2 calls', slot 5 '1 + dev'; 'Next · Part 4'; hero 'What only video knows'
- voiceover: "Next, part four: step six, what only a video can tell us."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-closer-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, part four:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 24 — Part 4 of 5

- chapter_start: Step 6: what only a video knows
- scene: RAIL (full): kicker 'Part 4 of 5'; hero; slot 6 lifts on 'feedback'
- voiceover: "Part four of five. Marks carry words, and diagrams stay small. Last step: the feedback only a video can give."
- duration: 7.49s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-opener-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 4 of 5.
keyMessage: Part four of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'feedback'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 25 — Step 6: rewinds reach the agent

- scene: SPINE + STAGE (the plan video's step-6 picture): kicker 'Step 6 · Video signals'; tag 'decided · D-005'; the review player lit with chip 'rewound 2× · 2:05'; the edge player → resolve-plan; a page 'plan.resolved.md' with the section 'Hard to follow here' and the row 'Step 3 · 2:05' (coral left rule)
- voiceover: "Step six keeps the decision from the plan review: nothing is asked of you. The player notes each rewind of over two seconds, and each slow-down. resolve plan lists them under 'Hard to follow here', on their step."
- duration: 12.08s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-step-6.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: a rewind travelling into the resolved plan
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 6: rewinds reach the agent.
keyMessage: Step six keeps the decision from the plan review:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'decision'): d005 lands, timed to the start of the word.
Scene 3 (on 'rewind'): player lands, timed to the start of the word.
Scene 4 (on 'resolve'): edge lands, timed to the start of the word.
Scene 5 (on 'Hard'): doc lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 26 — Call A11: what counts as a rewind

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A11 · Step 6'; spine tick 6 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'back 10 s → rewind' under it; on 'scrub' the card 'Chose · Scrubs and keys' (2 px ink border) lands in the left column; on 'Counting' the card 'Instead of · Every jump back' lands at ink 55 %; under them the check chip 'player noteRewind callers'; held — the player pauses here and asks Accept / Flag
- voiceover: "A rewind is a scrub or a key press that goes back more than two seconds. Counting every jump back was the other way, but clicking a step in the record is not getting lost."
- duration: 9.69s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-call-a11.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a11
- chose: A rewind is a scrub or a key press that goes back more than 2 s; jumps from the record do not count
- instead_of: Counting every jump backwards
- why: Clicking a step or a comment time in the record is moving around, not getting lost
- check: player noteRewind callers
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A11: what counts as a rewind.
keyMessage: A rewind is a scrub or a key press that goes back more than two seconds.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'scrub'): chose lands, timed to the start of the word.
Scene 3 (on 'Counting'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 27 — Call A12: slow-downs merge

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A12 · Step 6'; spine tick 6 in ink; The review player lit coral (the frame's one coral) with the worked-example chip '3 changes · 1 moment' under it; on 'merge' the card 'Chose · Merge within 3 s' (2 px ink border) lands in the left column; on 'moment' the card 'Instead of · One per change' lands at ink 55 %; under them the check chip 'player noteSlow'; held — the player pauses here and asks Accept / Flag
- voiceover: "Speed changes within three seconds merge into one, and only slowing below normal counts. One moment per change was the other way, but speeding back up is no sign of trouble."
- duration: 10.39s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-call-a12.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a12
- chose: Speed changes within 3 s merge into one moment, and only slowing below 1× counts
- instead_of: One moment per speed change
- why: Speeding back up is not a sign of trouble
- check: player noteSlow
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A12: slow-downs merge.
keyMessage: Speed changes within three seconds merge into one, and only slowing below normal counts.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'merge'): chose lands, timed to the start of the word.
Scene 3 (on 'moment'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 28 — Call A4: moments listed by step

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project; all dim except the one this call touches): kicker 'Call A4 · Step 6'; spine tick 6 in ink; resolve-plan lit coral (the frame's one coral) with the worked-example chip 'Step 3 · 2:05, 2:40' under it; on 'step' the card 'Chose · Listed by step' (2 px ink border) lands in the left column; on 'Time' the card 'Instead of · In time order' lands at ink 55 %; under them the check chip 'scripts/resolve-plan.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The resolved plan lists these moments by step, with their times. Time order was the other way, but the revise works step by step, and a moment is a signal, not a comment."
- duration: 10.07s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-call-a4.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a4
- chose: The resolved plan lists hard-to-follow moments by step, with their times
- instead_of: Listing them in time order, or inside your comments
- why: The revise works step by step, and a moment is a signal, not a comment
- check: scripts/resolve-plan.mjs
- focal: resolve-plan, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A4: moments listed by step.
keyMessage: The resolved plan lists these moments by step, with their times.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'step'): chose lands, timed to the start of the word.
Scene 3 (on 'Time'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 29 — Quick check: where a rewind goes

- scene: SPINE: kicker 'Quick check · Step 6'; the question; three option cards on their words, none marked
- voiceover: "Quick check. You drag back ten seconds to hear a step again. Where does the agent see it: nowhere, as a comment, or under 'Hard to follow here', on that step?"
- duration: 8.9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-check-2.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 6
- quiz: k2
- question: You drag the playhead back 10 s to hear a step again. Where does the agent see it?
- option_a: Nowhere
- option_b: As a comment
- option_c: Under “Hard to follow here”, on that step
- answer: c
- explain: rewinds are sent automatically (D-005) and read as prompts to explain that step more plainly
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: where a rewind goes.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'nowhere'): o1 lands, timed to the start of the word.
Scene 3 (on 'comment'): o2 lands, timed to the start of the word.
Scene 4 (on 'Hard'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 30 — Next: part 5

- scene: RAIL (full): slot 6 '3 calls'; 'Next · Part 5'; hero 'Notes, and what ran'
- voiceover: "Next, the last part: notes on your answers, and what ran."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-closer-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 5.
keyMessage: Next, the last part:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 31 — Part 5 of 5

- chapter_start: Notes on answers, and what ran
- scene: RAIL (full): kicker 'Part 5 of 5'; hero 'All 6 steps, reported'
- voiceover: "Part five of five. All six steps are reported. Last: notes on answers, and the tests."
- duration: 5.68s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-opener-5.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 5 of 5.
keyMessage: Part five of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 32 — Asked for: a note on any answer

- scene: NO STAGE, PROTOTYPE: kicker 'Not in the plan · notes'; the player's question sheet with two options, B picked; on 'note' the field 'Add a note to this answer' lands under the options and the words 'only until accounts exist' type in; on 'record' a record row with the note and a 'change' link
- voiceover: "Also asked for in the review: any answer can carry a note. The box sits under the options, and you can edit the note later, in the record."
- duration: 7.75s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-note.html
- type: benefit_highlight
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the note under the answer
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Asked for: a note on any answer.
keyMessage: Also asked for in the review:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'note'): field lands, timed to the start of the word.
Scene 3 (on 'box'): typed lands, timed to the start of the word.
Scene 4 (on 'record'): record lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 33 — Call A6: a note sends its step to the revise

- scene: SPINE + STAGE (6 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project, The revise step; all dim except the one this call touches): The revise step lands at its system.json place as it is named (the one new part this beat); kicker 'Call A6 · Step 1'; spine tick 1 in ink; The revise step lit coral (the frame's one coral) with the worked-example chip '"only until accounts exist"' under it; on 'comment' the card 'Chose · Sent to the revise' (2 px ink border) lands in the left column; on 'Keeping' the card 'Instead of · Record only' lands at ink 55 %; under them the check chip 'scripts/revise-scope.mjs answer-note'; held — the player pauses here and asks Accept / Flag
- voiceover: "A note sends its step to the revise step, which rewrites the plan, just like a comment. Keeping notes in the record only was the other way, but a note usually narrows the answer."
- duration: 10.28s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-call-a6.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a6
- chose: A note on an answer sends its step to the revise step, just like a comment
- instead_of: Keeping notes in the record only
- why: A note usually narrows the answer (“only until accounts exist”), and the plan must then say so
- check: scripts/revise-scope.mjs answer-note
- focal: The revise step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A6: a note sends its step to the revise.
keyMessage: A note sends its step to the revise step, which rewrites the plan, just like a comment.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'revise'): node lands, timed to the start of the word.
Scene 3 (on 'comment'): chose lands, timed to the start of the word.
Scene 4 (on 'Keeping'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 34 — Call A13: a note still lets you approve

- scene: SPINE + STAGE (6 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project, The revise step; all dim except the one this call touches): kicker 'Call A13 · Step 1'; spine tick 1 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'note only → Approve' under it; on 'approve' the card 'Chose · Approve still offered' (2 px ink border) lands in the left column; on 'Treating' the card 'Instead of · Treated as a comment' lands at ink 55 %; under them the check chip 'player hasWords()'; held — the player pauses here and asks Accept / Flag
- voiceover: "A note on its own still lets you approve at the end. Treating it like a comment was the other way, but a note clarifies an answer; it does not ask for a change."
- duration: 8.96s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-call-a13.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a13
- chose: A note on its own still lets you approve when the review is finished
- instead_of: Treating a note like a comment, which asks for changes
- why: A note clarifies an answer; it is not a change request
- check: player hasWords()
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A13: a note still lets you approve.
keyMessage: A note on its own still lets you approve at the end.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'approve'): chose lands, timed to the start of the word.
Scene 3 (on 'Treating'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 35 — Call A14: notes on plan questions only

- scene: SPINE + STAGE (6 parts: The plan-to-video skill, resolve-plan, The reel CLI, The review player, finish-project, The revise step; all dim except the one this call touches): kicker 'Call A14 · Step 1'; spine tick 1 in ink; The review player lit coral (the frame's one coral) with the worked-example chip 'no note on checks' under it; on 'plan' the card 'Chose · Plan questions only' (2 px ink border) lands in the left column; on 'every' the card 'Instead of · A note on every stop' lands at ink 55 %; under them the check chip 'player askDecision'; held — the player pauses here and asks Accept / Flag
- voiceover: "Notes are offered on plan questions only, not on quick checks or on my calls. A note on every stop was the other way, but the review file defines notes on decisions only."
- duration: 10.46s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-call-a14.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a14
- chose: Notes are offered on plan questions only, not on quick checks or on the agent's calls
- instead_of: A note on every stop
- why: The review file defines a note on decisions only
- check: player askDecision
- focal: The review player, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A14: notes on plan questions only.
keyMessage: Notes are offered on plan questions only, not on quick checks or on my calls.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'plan'): chose lands, timed to the start of the word.
Scene 3 (on 'every'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 36 — What ran

- scene: NO STAGE: kicker 'What ran'; three ink chips land in turn: 'npm test · all pass', '10 script checks · 57 player checks', '4 widths · light and dark'
- voiceover: "What ran: every test passes, including ten new checks on the script side and fifty-seven on the player side. The player was also checked by screenshot at four widths, in light and dark."
- duration: 10.75s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-ran.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- focal: the three results
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What ran.
keyMessage: What ran:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'every'): r1 lands, timed to the start of the word.
Scene 3 (on 'ten'): r2 lands, timed to the start of the word.
Scene 4 (on 'screenshot'): r3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 37 — What is not tested

- scene: NO STAGE: kicker 'Not tested'; two ink chips with a level strike: 'a real 4-option video', 'long titles on a phone'
- voiceover: "Not tested: no real plan video has a four-option or pick-all question yet, so the player was checked on a test sample. And on a phone, a long part title can still be cut short."
- duration: 10.71s
- transition_in: crossfade
- status: animated
- src: compositions/frames/37-not-tested.html
- type: pain_point
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the two gaps
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What is not tested.
keyMessage: Not tested:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'real'): u1 lands, timed to the start of the word.
Scene 3 (on 'phone'): u2 lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 38 — Flag a call, or accept

- scene: RAIL (full, centred) with every slot's tag (slot 1 now '5 calls' with the three note calls); the mono line '15 calls · 1 deviation'; a mono note 'AI-generated narration and visuals' bottom right; long still hold
- voiceover: "That is what landed: six steps, fifteen calls, and one deviation. Flag any call, draw on a step to ask for a change, or accept it."
- duration: 11.32s
- transition_in: crossfade
- status: animated
- src: compositions/frames/38-end.html
- type: cta
- persuasion: Resolved walkthrough + call to action
- beat: Resolve
- blueprint: compose
- focal: the whole walkthrough as a rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Flag a call, or accept.
keyMessage: That is what landed:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fifteen'): sum lands, timed to the start of the word.
Scene 3 (on 'Flag'): ask lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.
