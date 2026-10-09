---
title: "Close the lifecycle: what landed"
format: 1920x1080
duration: 438s
message: "All six steps landed; nineteen calls the plan did not cover and two deviations, each to accept or flag; a fresh agent's code check found thirteen things, all answered"
arc: walkthrough with autonomy beats, in six parts
audience: the reviewer who approved the close-the-lifecycle plan (and someone new to the repo), deciding whether to accept what was built
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-close-the-lifecycle
---

## Video direction

- A WALKTHROUGH (lifecycle stage 4, style guide §13), built from `walkthrough.md` with the same look, beats and tags as the first real walkthrough (`../../2026-09-22-richer-review/walkthrough-video/`): the rail with this plan video's six slot titles (`../video/`), parts with their `glossary.md` names, `.reelplanning/theme/frame.md`, the same fonts.
- THE STAGE: `system.json`'s columns and row order, with the three rows closer together (y 150 / 335 / 520 instead of 175 / 405 / 625), so the build loop's bottom row (the system video, resolve-walkthrough, the walkthrough fix step) stays above the player's sheet (y ≈ 650) while it asks Accept / Flag. The hook shows the build loop this plan added (six parts, five edges); every other stage frame draws one group of at most six parts around the part it lights: the check (the plan-to-video skill, resolve-plan, the reel CLI, the implement step, the review player), the revise (the review loop's top row with the review player), the fix (the review player, resolve-walkthrough, the walkthrough fix step, finish-project, plan-diff), the system video.
- A SERIES OF SIX PARTS (§16): `chapter_start` on frames 1, 8, 16, 24, 31, 39; each part opens on the rail as reported so far and closes by naming the next. The rail's slot tags are the running tally of calls per step (`1 call`, `6 calls`, `9 + dev`, `11 + dev`, …). Step 3 carries eleven calls and a deviation, so it spans parts 2–4: what the checker sees, the check run for real, then its last two calls.
- WHAT-CHANGED BEATS (one per step): prototypes of what landed (the system video's part bar and one frame's tags; the autonomy table; the code-check and audit terminal; the review's record of richer review's calls; the spec-diff and status terminal), with the rail as a 44 px spine; step 5 is the fix loop on the stage.
- AUTONOMY BEATS (A1–A19, and the two deviations as their own beats, d1 and d2): the stage group with the touched part lit coral, and in the left column two cards — `Chose · …` with a 2 px INK border and `Instead of · …` at ink 55 % — and the check as a mono chip under them. No recommendation and no coral on the cards: the thing is done; the player pauses and asks Accept (A) or Flag (B). Everything the call needs sits above y 650. Each is about 9–11 s.
- THE CODE CHECK gets its own beat (part 3): the findings page, 13 findings, the most serious (the spec said the fix step had run; it had not) shown as the check working. The 19-row log gets one beat (part 1): by step 2's own rule, the plan left too much open.
- QUICK CHECKS (K1 after the code check, K2 after the step-5 calls): the question and three option cards, none marked.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word, a held read at the end; nothing below y 900 but captions.
- Rows with no step: none in this walkthrough (every row names one). Parts lit for calls whose code has no part of its own: the frame lint (A11) lights the plan-to-video skill, whose style guide it enforces; the code check (A1–A4, A15, A19) lights the implement step, which owns `scripts/code-check.mjs` in `system.json`.


## Frame 1 — What landed

- chapter_start: What landed: steps 1 and 2
- scene: FULL STAGE, STARTS DONE: the rail with all 6 slots filled, and the build loop this plan added (the implement step, the review player, resolve-walkthrough, the walkthrough fix step, finish-project, the system video) with its 5 edges, in ink from t=0; on 'six steps' a mono chip '6 of 6' under the rail; on 'nineteen' a mono chip '19 calls · 2 deviations' lands under the stage (coral-deep, the one coral); held
- voiceover: "Close the lifecycle is built. All six steps landed, and I made nineteen calls the plan did not cover, with two deviations. After each call, the video stops: accept it, or flag it."
- duration: 11.63s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete outcome first
- beat: Hook
- blueprint: compose
- focal: the finished build loop, and the count of calls
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What landed.
keyMessage: Close the lifecycle is built.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'six'): c6 lands, timed to the start of the word.
Scene 3 (on 'nineteen'): c19 lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 2 — Step 1: the system video

- scene: SPINE + PROTOTYPE: kicker 'Step 1 · System video'; the system video's part bar (5 parts: Why a video, The parts, The review loop, The build loop, The rules); on 'Thirty-five' a result card '5:52 · 35 frames · 5 parts'; on 'tagged' a storyboard card for one frame with its two tag lines (spec_section, components); on 'change' the components line gains a coral left rule
- voiceover: "Step one landed: the system video, thirty-five frames in five parts. Every frame is tagged with the spec section and the parts it explains, so a change can find its frames."
- duration: 10.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-step-1.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: one frame's tags
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 1: the system video.
keyMessage: Step one landed:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'parts'): bar lands, timed to the start of the word.
Scene 3 (on 'Thirty'): res lands, timed to the start of the word.
Scene 4 (on 'tagged'): doc lands, timed to the start of the word.
Scene 5 (on 'change'): rule lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 3 — Step 2: log each call as it is made

- scene: SPINE + PROTOTYPE: kicker 'Step 2 · Implement + log'; the autonomy table of a walkthrough (header: id · chose · instead of · check); on 'row' the first row lands, on 'chose' the second, on 'check' the third; on 'fifteen' a mono chip '15 calls · richer review' (coral-deep)
- voiceover: "Step two: the moment the agent makes a call the plan did not cover, it writes a row: what it chose, the other way, why, and where to check. Richer review logged fifteen."
- duration: 10.17s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-step-2.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: a row landing as the call is made
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 2: log each call as it is made.
keyMessage: Step two:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'row'): r1 lands, timed to the start of the word.
Scene 3 (on 'chose'): r2 lands, timed to the start of the word.
Scene 4 (on 'check'): r3 lands, timed to the start of the word.
Scene 5 (on 'fifteen'): n15 lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 4 — Call A18: a pinned package

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A18 · Step 2'; spine tick 2 in ink; The plan-to-video skill lit coral (the frame's one coral) with the worked-example chip 'not on npm yet' under it; on 'pinned' the card 'Chose · A pinned package' (2 px ink border) lands in the left column; on 'local' the card 'Instead of · The local command' lands at ink 55 %; under them the check chip 'SKILL.md · The commands'; held — the player pauses here and asks Accept / Flag
- voiceover: "The skill runs its tools as a pinned package, version zero point one, instead of the local command. Said plainly: that package is not published yet, so those commands fail as written until it is."
- duration: 11.86s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-call-a18.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a18
- chose: The skill runs its tools as npx -y reelplanning@0.1.0, pinned to the package version
- instead_of: The local reelplanning bin on PATH
- why: The npm packaging makes the skill work in any agent without an installer. It needs the package published first; until then the commands fail as written
- check: SKILL.md · The commands
- focal: The plan-to-video skill, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A18: a pinned package.
keyMessage: The skill runs its tools as a pinned package, version zero point one, instead of the local command.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'pinned'): chose lands, timed to the start of the word.
Scene 3 (on 'local'): instead lands, timed to the start of the word.
Scene 4 (on 'published'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 5 — 19 calls: the plan left too much open

- scene: SPINE + PROTOTYPE: kicker 'Step 2 · Too much left open'; the autonomy log as 19 short rows (A1 … A19) in a page card; on 'Nineteen' the rows stagger in and a large '19' lands to the right; on 'dozen' a dashed coral rule draws under row 12 with the mono label 'about a dozen'; on 'mechanics' rows 13–19 take an ink border
- voiceover: "Nineteen calls is too many. Past about a dozen, step two's own rule says the plan left too much open. Most of the extra rows are review mechanics the plan never spelled out."
- duration: 11.07s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-too-open.html
- type: pain_point
- persuasion: Said plainly
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the rows past the dozen line
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: 19 calls: the plan left too much open.
keyMessage: Nineteen calls is too many.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Nineteen'): rows lands, timed to the start of the word.
Scene 3 (on 'dozen'): rule lands, timed to the start of the word.
Scene 4 (on 'mechanics'): extra lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 6 — Step 3: a fresh agent checks the diff

- scene: SPINE + TERMINAL: kicker 'Step 3 · Check the diff'; tag 'decided · D-001' on 'decision'; a terminal card: on 'brief' the lines '$ reelplanning code-check <plan> --base <start>' and '→ code-check/brief.md · where the plan and the diff are' (the brief is short and points; changed after review); on 'fresh' '$ … --prompt  → a fresh agent'; on 'fails' '$ reel audit <plan>' and '✗ 13 findings unanswered'; on 'answered' '✓ every finding answered'
- voiceover: "Step three keeps decision one: a second agent checks the code. Code check writes a short brief: where the plan is, and which diff to read. A fresh agent reads them itself. Reel audit fails until every finding is answered."
- duration: 13.52s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-step-3.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the short brief, and audit's gate
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 3: a fresh agent checks the diff.
keyMessage: A short brief points a fresh agent at the plan and the diff; audit fails until every finding is answered.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'decision'): d001 lands, timed to the start of the word.
Scene 3 (on 'brief'): l1 lands, timed to the start of the word.
Scene 4 (on 'fresh'): l2 lands, timed to the start of the word.
Scene 5 (on 'fails'): l3 lands, timed to the start of the word.
Scene 6 (on 'answered'): l4 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 7 — Next: part 2

- scene: RAIL (full, all filled): slot 2 gains the ink tag '1 call'; 'Next · Part 2' in mono beside the rail with the hero 'What the checker sees'
- voiceover: "Next, part two: step three, and what the checking agent gets to see."
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

## Frame 8 — Part 2 of 6

- chapter_start: Step 3: what the checker sees
- scene: RAIL (full): slot 2 carries '1 call'; kicker 'Part 2 of 6'; hero 'Video and log, reported'; slot 3 lifts (ink border) on 'brief'
- voiceover: "Part two of six. The system video and the call log are reported. Now, the brief a fresh agent checks from."
- duration: 7.13s
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

narrativeRole: Part 2 of 6.
keyMessage: Part two of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'brief'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 9 — Call A1: a short brief that points

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A1 · Step 3'; on 'Changed' the mono chip 'changed after review' lands beside the kicker; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip 'brief → plan + diff' under it; on 'short' the card 'Chose · A short brief' (2 px ink border) lands in the left column; on 'Everything' the card 'Instead of · Everything in one file' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "Changed after review, as you asked: the brief is short now. It points the checker at the plan and the diff, and the checker reads them itself. Everything in one file was the old way, but the checker is fresh because it is a new agent, not because of what it reads."
- duration: 15.12s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-call-a1.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a1
- chose: A short brief that points at the plan and the diff; the checker reads them itself (changed after review)
- instead_of: The checker's whole world in one file, code-check/brief.md, with the diff pasted in
- why: The reviewer asked: a capable agent can find and read the plan and the diff; its freshness comes from being a new subagent
- check: scripts/code-check.mjs
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A1: a short brief that points.
keyMessage: Changed after review: the brief is short and points at the plan and the diff; the checker reads them itself.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Changed'): the 'changed after review' chip lands, timed to the start of the word.
Scene 3 (on 'short'): chose lands, timed to the start of the word.
Scene 4 (on 'Everything'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 10 — Call A2: my log goes in, nothing else

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A2 · Step 3'; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip 'log in · reasons out' under it; on 'carries' the card 'Chose · My log, nothing else' (2 px ink border) lands in the left column; on 'other' the card 'Instead of · Nothing from me' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The brief carries one thing from me: my log of calls. The other way was to give the checker nothing from me. But the checker must say what the log does not explain, so it needs the log."
- duration: 10.49s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-call-a2.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a2
- chose: The brief includes the implementer's autonomy log, but nothing else from the implementer
- instead_of: Giving the checker nothing from the implementer
- why: Question 3 (anything the log does not explain?) needs the log; the reasons in the implementer's conversation stay out
- check: scripts/code-check.mjs
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A2: my log goes in, nothing else.
keyMessage: The brief carries one thing from me: my log of calls, because the checker must say what the log does not explain.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'carries'): chose lands, timed to the start of the word.
Scene 3 (on 'other'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 11 — Call A19: the plan as built

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A19 · Step 3'; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip 'found by the check' under it; on 'built' the card 'Chose · The plan as built' (2 px ink border) lands in the left column; on 'other' the card 'Instead of · The resolved plan' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The brief points the checker at the plan as it was built. The other way was the resolved plan, but that file is older: it misses the last revise. This plan's own check found that, when it saw an old step six."
- duration: 12.05s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-call-a19.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a19
- chose: The brief points at plan.md, the plan as built
- instead_of: plan.resolved.md when it exists
- why: Found by this plan's own code check: plan.resolved.md records the review before the last revise, so the checker saw the old step 6
- check: scripts/code-check.mjs
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A19: the plan as built.
keyMessage: The brief points at the plan as built; the resolved plan is older and misses the last revise.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'built'): chose lands, timed to the start of the word.
Scene 3 (on 'other'): instead lands, timed to the start of the word.
Scene 4 (on 'found'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 12 — Call A15: accepted calls left out

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A15 · Step 3'; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip 'reviewed decisions only' under it; on 'leaves' the card 'Chose · Calls left out' (2 px ink border) lands in the left column; on 'Including' the card 'Instead of · Checked as well' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The check leaves accepted agent calls out of the decisions it checks. Including them was the other way, but they are defaults, and reel check already warns about them."
- duration: 9.68s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-call-a15.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a15
- chose: The code check leaves accepted agent calls out of the decisions it checks
- instead_of: Including them
- why: They are defaults, warned about by reel check; the brief stays about what this plan's reviewer decided. Worth revisiting once accepted calls pile up
- check: scripts/code-check.mjs
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A15: accepted calls left out.
keyMessage: The check leaves accepted agent calls out of the decisions it checks.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'leaves'): chose lands, timed to the start of the word.
Scene 3 (on 'Including'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 13 — Call A3: no diff pasted in

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A3 · Step 3'; on 'Changed' the mono chip 'changed after review' lands beside the kicker; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip 'brief 174 KB → 8 KB' under it; on 'pasted' the card 'Chose · No diff pasted in' (2 px ink border) lands in the left column; on 'Cutting' the card 'Instead of · Cut at 400k' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs --inline-diff'; held — the player pauses here and asks Accept / Flag
- voiceover: "Changed after review, as you asked: no diff is pasted into the brief now, unless you ask for an inline diff. The checker runs the diff command itself. Cutting a long diff at four hundred thousand characters was the old way, but a whole-repo diff can run to megabytes."
- duration: 16.32s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-call-a3.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a3
- chose: No diff is pasted into the brief unless --inline-diff is given; the checker runs the diff command itself (changed after review)
- instead_of: The diff pasted in, cut at 400k characters, with the command to read the rest
- why: A whole-repo diff can be megabytes; the checker can read any file with git
- check: scripts/code-check.mjs --inline-diff
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A3: no diff pasted in.
keyMessage: Changed after review: no diff is pasted in unless you ask for an inline diff; the checker runs the diff command itself.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Changed'): the 'changed after review' chip lands, timed to the start of the word.
Scene 3 (on 'pasted'): chose lands, timed to the start of the word.
Scene 4 (on 'Cutting'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 14 — Call A4: narrow the diff by path

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A4 · Step 3'; spine tick 3 in ink; The implement step lit coral (the frame's one coral) with the worked-example chip '13 files, not all' under it; on 'narrow' the card 'Chose · Narrow by path' (2 px ink border) lands in the left column; on 'whole' the card 'Instead of · Whole range only' lands at ink 55 %; under them the check chip 'scripts/code-check.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "You can narrow the diff to some paths. The whole range only was the other way, but a branch often carries unrelated work: richer review's also held the status page."
- duration: 10.19s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-call-a4.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a4
- chose: -- <paths> narrows the diff
- instead_of: The whole range only
- why: A branch often carries unrelated work (richer review's range also held the status page)
- check: scripts/code-check.mjs
- focal: The implement step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A4: narrow the diff by path.
keyMessage: You can narrow the diff to some paths.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'narrow'): chose lands, timed to the start of the word.
Scene 3 (on 'whole'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 15 — Next: part 3

- scene: RAIL (full): slot 3 gains '6 calls'; 'Next · Part 3'; hero 'The check, run for real'
- voiceover: "Next, part three: the check running on this plan, and what reel audit enforces."
- duration: 4.99s
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

## Frame 16 — Part 3 of 6

- chapter_start: Step 3: the check ran
- scene: RAIL (full): kicker 'Part 3 of 6'; hero 'The brief, reported'; slot 3 lifts on 'found'
- voiceover: "Part three of six. The brief is reported. Now, what the check found on this plan, and what audit enforces."
- duration: 6.94s
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

narrativeRole: Part 3 of 6.
keyMessage: Part three of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'found'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 17 — The code check found 13 things

- scene: SPINE + PROTOTYPE: kicker 'The code check · Step 3'; the findings page (code-check/findings.md): 'Steps · 6 of 6 carried', 'Decisions · 1 broken in part', 'Unexplained · 12'; on 'thirteen' a large '13' lands to the right with 'findings, all answered'; on 'serious' a row 'spec.md: “the fix step ran”' lands with a coral left rule, and 'it had not' under it on 'not'; on 'job' the chip 'then fixed · 2 of 38 beats'
- voiceover: "Then the check ran on this plan. A fresh agent, given only the brief, found thirteen things. The most serious: the spec said the fix step had run, and it had not. That is the check doing its job."
- duration: 12.07s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-found.html
- type: benefit_highlight
- persuasion: Named result
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the most serious finding
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: The code check found 13 things.
keyMessage: Then the check ran on this plan.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fresh'): page lands, timed to the start of the word.
Scene 3 (on 'thirteen'): big lands, timed to the start of the word.
Scene 4 (on 'serious'): row lands, timed to the start of the word.
Scene 5 (on 'not'): hadnot lands, timed to the start of the word.
Scene 6 (on 'job'): fixed lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 18 — Call A5: findings in a fixed shape

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A5 · Step 3'; spine tick 3 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip 'each ✗ has a key' under it; on 'fixed' the card 'Chose · A fixed shape' (2 px ink border) lands in the left column; on 'Free' the card 'Instead of · Free prose' lands at ink 55 %; under them the check chip 'code-check.mjs brief · reel audit'; held — the player pauses here and asks Accept / Flag
- voiceover: "Findings come in a fixed shape: every cross keyed by a step, a decision or a path. Free prose was the other way, but then reel audit could not check that each one is answered."
- duration: 10.58s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-call-a5.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a5
- chose: Findings in a fixed shape, every ✗ keyed by Step N, a decision id or a path
- instead_of: Free prose
- why: reel audit can then check that each one is answered
- check: code-check.mjs brief · reel audit
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A5: findings in a fixed shape.
keyMessage: Findings come in a fixed shape:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fixed'): chose lands, timed to the start of the word.
Scene 3 (on 'Free'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 19 — Call A6: no findings file only warns

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A6 · Step 3'; spine tick 3 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip 'no findings → warning' under it; on 'warns' the card 'Chose · Warn' (2 px ink border) lands in the left column; on 'Failing' the card 'Instead of · Fail' lands at ink 55 %; under them the check chip 'scripts/reel.mjs audit'; held — the player pauses here and asks Accept / Flag
- voiceover: "A plan with no findings file only warns in reel audit. Failing was the other way, but plans walked through before the check existed must still pass."
- duration: 9.42s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-call-a6.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a6
- chose: No findings file is a warning in reel audit, not a failure
- instead_of: Failing
- why: Plans walked through before the check existed must still pass
- check: scripts/reel.mjs audit
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A6: no findings file only warns.
keyMessage: A plan with no findings file only warns in reel audit.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'warns'): chose lands, timed to the start of the word.
Scene 3 (on 'Failing'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 20 — Call A14: a file for this plan's decisions

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A14 · Step 3'; spine tick 3 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip 'cited → a mention' under it; on 'only' the card 'Chose · Own decisions only' (2 px ink border) lands in the left column; on 'every' the card 'Instead of · Every decision' lands at ink 55 %; under them the check chip 'scripts/reel.mjs audit'; held — the player pauses here and asks Accept / Flag
- voiceover: "Audit wants a named file only for this plan's own decisions. A file for every decision in force was the other way, but a cited decision was already checked in its own plan."
- duration: 10.47s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-call-a14.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a14
- chose: reel audit asks for a named file only for this plan's own decisions, in their step's entry; a cited decision in force needs a mention
- instead_of: A file per decision in force
- why: A cited decision was checked in its own plan's walkthrough; this one only has to say it still holds
- check: scripts/reel.mjs audit
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A14: a file for this plan's decisions.
keyMessage: Audit wants a named file only for this plan's own decisions.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'only'): chose lands, timed to the start of the word.
Scene 3 (on 'every'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 21 — Deviation: audit and cited decisions

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Deviation · Step 3'; spine tick 3 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip 'cited · no file named' under it; on 'passes' the card 'Chose · A mention passes' (2 px ink border) lands in the left column; on 'Step' the card 'Instead of · Step 3 as written' lands at ink 55 %; under them the check chip 'scripts/reel.mjs audit'; held — the player pauses here and asks Accept / Flag
- voiceover: "That is also a deviation, said plainly: a cited decision passes audit on a mention. Step three says audit fails when any decision in force has no file named against it."
- duration: 10.54s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-deviation-audit.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: d2
- chose: Deviation from step 3: reel audit asks a named file only of this plan's own decisions (A14)
- instead_of: Step 3 as written: audit fails when any decision in force has no file named against it
- why: A cited decision was checked in its own plan's walkthrough
- check: scripts/reel.mjs audit
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: audit and cited decisions.
keyMessage: That is also a deviation, said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'deviation'): example lands, timed to the start of the word.
Scene 3 (on 'passes'): chose lands, timed to the start of the word.
Scene 4 (on 'Step'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 22 — Quick check: who checks the code

- scene: SPINE: kicker 'Quick check · Step 3'; the question in serif; three option cards A/B/C land on their words, none marked
- voiceover: "Quick check. Who checks the code against the plan: the agent that wrote it, a fresh agent, or reel audit on its own?"
- duration: 7.02s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-check-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 3
- quiz: k1
- question: Who checks the code against the plan?
- option_a: The agent that wrote it
- option_b: A fresh agent
- option_c: reel audit, on its own
- answer: b
- explain: D-001: a second agent that never saw the implementer's conversation, started with only the brief; reel audit is the floor under it
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: who checks the code.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'wrote'): o1 lands, timed to the start of the word.
Scene 3 (on 'fresh'): o2 lands, timed to the start of the word.
Scene 4 (on 'audit'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 23 — Next: part 4

- scene: RAIL (full): slot 3 now '9 + dev'; 'Next · Part 4'; hero 'Lint, signals, walkthrough'
- voiceover: "Next, part four: the last two step three calls, then steps four and five."
- duration: 4.73s
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

## Frame 24 — Part 4 of 6

- chapter_start: Steps 3 to 5
- scene: RAIL (full): kicker 'Part 4 of 6'; hero 'The check, reported'; slot 4 lifts on 'walkthrough'
- voiceover: "Part four of six. The check is reported. Now, two more calls, then the walkthrough and the fix step."
- duration: 6.17s
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

narrativeRole: Part 4 of 6.
keyMessage: Part four of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'walkthrough'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 25 — Call A11: file names on a node fail

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A11 · Step 3'; spine tick 3 in ink; The plan-to-video skill lit coral (the frame's one coral) with the worked-example chip 'file name → fail' under it; on 'fails' the card 'Chose · File names fail' (2 px ink border) lands in the left column; on 'Failing' the card 'Instead of · Fail every mismatch' lands at ink 55 %; under them the check chip 'scripts/frame-lint.mjs rule 4c'; held — the player pauses here and asks Accept / Flag
- voiceover: "A node labelled with a file name fails the frame lint; other names off the glossary are only noted. Failing every mismatch was the other way, but a mock may shorten a name on purpose."
- duration: 11.11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-call-a11.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a11
- chose: A part labelled with a file name fails the lint; any other label that is not its glossary name is only a note; a mock of a file or page is left alone
- instead_of: Failing every label that differs from the glossary
- why: A mock or a branch may shorten a name on purpose; a file name on a node is never right
- check: scripts/frame-lint.mjs rule 4c
- focal: The plan-to-video skill, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A11: file names on a node fail.
keyMessage: A node labelled with a file name fails the frame lint;

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fails'): chose lands, timed to the start of the word.
Scene 3 (on 'Failing'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 26 — Call A12: rewinds reach the revise

- scene: SPINE + STAGE (4 parts: The review player, resolve-plan, The reel CLI, The revise step; all dim except the one this call touches): kicker 'Call A12 · Step 3'; spine tick 3 in ink; The revise step lit coral (the frame's one coral) with the worked-example chip 'rewound → say it plainer' under it; on 'revise' the card 'Chose · Sent to the revise' (2 px ink border) lands in the left column; on 'Leaving' the card 'Instead of · Resolved plan only' lands at ink 55 %; under them the check chip 'scripts/revise-scope.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "A step you rewound or slowed down on now goes to the revise step, to be said more plainly. Leaving that in the resolved plan only was the other way, but then it changed nothing."
- duration: 10.62s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-call-a12.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a12
- chose: A step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides
- instead_of: Leaving those signals in the resolved plan only
- why: The first code check showed the revise never saw them, so 'hard to follow' changed nothing
- check: scripts/revise-scope.mjs
- focal: The revise step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A12: rewinds reach the revise.
keyMessage: A step you rewound or slowed down on now goes to the revise step, to be said more plainly.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'revise'): chose lands, timed to the start of the word.
Scene 3 (on 'Leaving'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 27 — Step 4: the first real walkthrough

- scene: SPINE + PROTOTYPE: kicker 'Step 4 · Walk through'; a result card '38 frames · 15 calls'; the review's record of calls: 'A1 · accepted', 'A7 · accepted', 'A9 · accepted', 'A10 · changed in your words' (coral left rule on the last), landing on 'reviewed' and 'changed'
- voiceover: "Step four: richer review's walkthrough video was the first built from real code. Thirty-eight frames, and fifteen calls to accept or flag. You reviewed it: fifteen accepted, and one changed in your own words."
- duration: 12.51s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-step-4.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: A10, changed in your words
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 4: the first real walkthrough.
keyMessage: Step four:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Thirty'): res lands, timed to the start of the word.
Scene 3 (on 'reviewed'): rows lands, timed to the start of the word.
Scene 4 (on 'changed'): a10 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 28 — Step 5: your words are a change to make

- scene: SPINE + STAGE (5 parts: the review player, resolve-walkthrough, the walkthrough fix step, finish-project, plan-diff) + LEFT COLUMN: kicker 'Step 5 · Act on verdicts'; on 'own words' an own-words box lands in the left column, 'YOUR WORDS ON CALL A10' over the reviewer's real words 'maybe escape should keep them too', and resolve-walkthrough lights with chip 'richer A10 · your words'; on 'change' the serif line '= a change the agent makes' lands under the box (2 px ink rule, the frame's statement), with 'your words are the instruction' in mono under it; on 'rewrites' the coral moves to the walkthrough fix step; on 'rebuilds' the edge to finish-project lights and the chip '1 beat rebuilt' lands; on 'decision' the tag 'decided · D-002'
- voiceover: "Step five: an answer in your own words is a change the agent makes, with your words as the instruction. A flag is a change too. The agent rewrites the code, and rebuilds only that beat. An accepted call just joins the ledger. That keeps decision two."
- duration: 15.57s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-step-5.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: your words, becoming a change the agent makes
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 5: your words are a change to make.
keyMessage: An answer in your own words is a change the agent makes, with your words as the instruction.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'own words'): the own-words box and rw land, timed to the start of the words.
Scene 3 (on 'change'): '= a change the agent makes' lands, timed to the start of the word.
Scene 4 (on 'rewrites'): fix lands, timed to the start of the word.
Scene 5 (on 'rebuilds'): finish lands, timed to the start of the word.
Scene 6 (on 'decision'): d002 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 29 — Call A7: the fix step is instructions

- scene: SPINE + STAGE (5 parts: The review player, resolve-walkthrough, The walkthrough fix step, finish-project, plan-diff; all dim except the one this call touches): kicker 'Call A7 · Step 5'; spine tick 5 in ink; The walkthrough fix step lit coral (the frame's one coral) with the worked-example chip 'rewriting = agent work' under it; on 'instructions' the card 'Chose · Skill instructions' (2 px ink border) lands in the left column; on 'applies' the card 'Instead of · A fixing script' lands at ink 55 %; under them the check chip 'SKILL.md step 7'; held — the player pauses here and asks Accept / Flag
- voiceover: "The fix step is instructions in the skill, not a script. A script that applies fixes was the other way, but rewriting code is agent work, and walkthrough scope already does the sorting."
- duration: 11.09s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-call-a7.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a7
- chose: The fix step is skill instructions, not a script
- instead_of: A script that applies fixes
- why: Rewriting code is agent work; walkthrough-scope already does the sorting a script can do
- check: SKILL.md step 7
- focal: The walkthrough fix step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A7: the fix step is instructions.
keyMessage: The fix step is instructions in the skill, not a script.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'instructions'): chose lands, timed to the start of the word.
Scene 3 (on 'applies'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 30 — Next: part 5

- scene: RAIL (full): slot 3 '11 + dev', slot 5 '1 call'; 'Next · Part 5'; hero 'Your verdicts'
- voiceover: "Next, part five: how your verdicts are read."
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
keyMessage: Next, part five:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 31 — Part 5 of 6

- chapter_start: Step 5: your verdicts
- scene: RAIL (full): kicker 'Part 5 of 6'; hero 'Walkthrough and fix, in'; slot 5 lifts on 'verdicts'
- voiceover: "Part five of six. The walkthrough and the fix step are in. Now, the rules for reading your verdicts."
- duration: 6.23s
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

narrativeRole: Part 5 of 6.
keyMessage: Part five of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'verdicts'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 32 — Call A8: a fixed row changes in place

- scene: SPINE + STAGE (5 parts: The review player, resolve-walkthrough, The walkthrough fix step, finish-project, plan-diff; all dim except the one this call touches): kicker 'Call A8 · Step 5'; spine tick 5 in ink; The walkthrough fix step lit coral (the frame's one coral) with the worked-example chip 'richer A10 · row changed' under it; on 'place' the card 'Chose · Updated in place' (2 px ink border) lands in the left column; on 'new' the card 'Instead of · A new row' lands at ink 55 %; under them the check chip 'richer-review walkthrough.md A10'; held — the player pauses here and asks Accept / Flag
- voiceover: "A fixed call's row is updated in place, marked changed after review. A new row for the fix was the other way, but one row per call keeps the ledger and the beat ids lined up."
- duration: 11.11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-call-a8.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a8
- chose: A fixed call's row is updated in place ("changed after review: …")
- instead_of: A new row for the fix
- why: One row per call keeps the ledger and the video's beat ids lined up
- check: richer-review walkthrough.md A10
- focal: The walkthrough fix step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A8: a fixed row changes in place.
keyMessage: A fixed call's row is updated in place, marked changed after review.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'place'): chose lands, timed to the start of the word.
Scene 3 (on 'new'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 33 — Call A9: a note near a flag

- scene: SPINE + STAGE (5 parts: The review player, resolve-walkthrough, The walkthrough fix step, finish-project, plan-diff; all dim except the one this call touches): kicker 'Call A9 · Step 5'; spine tick 5 in ink; The walkthrough fix step lit coral (the frame's one coral) with the worked-example chip 'flag, then 9 s → note' under it; on 'fifteen' the card 'Chose · Within 15 s' (2 px ink border) lands in the left column; on 'Only' the card 'Instead of · Same step only' lands at ink 55 %; under them the check chip 'walkthrough-scope.mjs NEAR'; held — the player pauses here and asks Accept / Flag
- voiceover: "A note with no step, typed within fifteen seconds of a flag, is read as about that flag. Only notes on its step was the other way, but people flag, then type."
- duration: 9.94s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-call-a9.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a9
- chose: A note with no step, within 15 s after a flag, is taken to be about that flag
- instead_of: Only notes on the flag's step
- why: Reviewers flag, then type; the note often lands on no step
- check: walkthrough-scope.mjs NEAR
- focal: The walkthrough fix step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A9: a note near a flag.
keyMessage: A note with no step, typed within fifteen seconds of a flag, is read as about that flag.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fifteen'): chose lands, timed to the start of the word.
Scene 3 (on 'Only'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 34 — Call A13: an accepted call warns

- scene: SPINE + STAGE (5 parts: The plan-to-video skill, resolve-plan, The reel CLI, The implement step, The review player; all dim except the one this call touches): kicker 'Call A13 · Step 5'; spine tick 5 in ink; The reel CLI lit coral (the frame's one coral) with the worked-example chip 'accepted call → warning' under it; on 'warns' the card 'Chose · Warn a later plan' (2 px ink border) lands in the left column; on 'failing' the card 'Instead of · Fail it' lands at ink 55 %; under them the check chip 'scripts/reel.mjs check'; held — the player pauses here and asks Accept / Flag
- voiceover: "An accepted call warns a later plan that touches its part, instead of failing it like a reviewed decision. It is a ratified default, not an answer, and blocking on it would make accepting costly."
- duration: 11.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-call-a13.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a13
- chose: An accepted agent call warns a later plan in reel check that touches its part
- instead_of: Failing it, like a reviewed decision
- why: An accepted call is a ratified default, not an answer to a question; blocking every later plan on it would make accepting costly
- check: scripts/reel.mjs check
- focal: The reel CLI, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A13: an accepted call warns.
keyMessage: An accepted call warns a later plan that touches its part, instead of failing it like a reviewed decision.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'warns'): chose lands, timed to the start of the word.
Scene 3 (on 'failing'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 35 — Call A16: when a flag becomes a new plan

- scene: SPINE + STAGE (5 parts: The review player, resolve-walkthrough, The walkthrough fix step, finish-project, plan-diff; all dim except the one this call touches): kicker 'Call A16 · Step 5'; spine tick 5 in ink; The walkthrough fix step lit coral (the frame's one coral) with the worked-example chip '“full size” → new plan' under it; on 'new' the card 'Chose · Any label escalates' (2 px ink border) lands in the left column; on 'Only' the card 'Instead of · Chosen option only' lands at ink 55 %; under them the check chip 'walkthrough-scope.mjs reaches'; held — the player pauses here and asks Accept / Flag
- voiceover: "A flag becomes a new plan when your words name a ledger id, or any option of an active decision. Only the chosen option was the other way; a false alarm costs one question, a miss much more."
- duration: 12.58s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-call-a16.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a16
- chose: A flag becomes a new plan when the reviewer's words contain a ledger id or any option label (over 3 letters) of an active decision
- instead_of: Only the chosen option, or only this plan's decisions
- why: Overturning any recorded choice is a plan-level change; a false escalation costs a question, a missed one costs an unreviewed reversal
- check: walkthrough-scope.mjs reaches
- focal: The walkthrough fix step, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A16: when a flag becomes a new plan.
keyMessage: A flag becomes a new plan when your words name a ledger id, or any option of an active decision.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'new'): chose lands, timed to the start of the word.
Scene 3 (on 'Only'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 36 — Call A17: your words are a change to make

- scene: SPINE + STAGE (5 parts: The review player, resolve-walkthrough, The walkthrough fix step, finish-project, plan-diff; all dim except the one this call touches): kicker 'Call A17 · Step 5'; spine tick 5 in ink; resolve-walkthrough lit coral (the frame's one coral) with the worked-example chip 'richer A10 · your words' under it; on 'change' the card 'Chose · A change the agent makes' (2 px ink border) lands in the left column; on 'accept' the card 'Instead of · Accept with a note' lands at ink 55 %; under them the check chip 'resolve-walkthrough.mjs · walkthrough-scope.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "An answer in your own words on a call is a change the agent makes, with your words as the instruction. An accept with a note was the other way, but that reading dropped richer review's A10 change."
- duration: 11.69s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-call-a17.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a17
- chose: An answer in the reviewer's own words on an agent's call is a change the agent makes, with those words as the instruction
- instead_of: An accept with a note
- why: The reviewer rewrote the call; reading it as an accept dropped the richer-review A10 change
- check: resolve-walkthrough.mjs · walkthrough-scope.mjs
- focal: resolve-walkthrough, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A17: your words are a change to make.
keyMessage: An answer in your own words on a call is a change the agent makes, with your words as the instruction.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'change'): chose lands, timed to the start of the word.
Scene 3 (on 'accept'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 37 — Quick check: an answer in your words

- scene: SPINE: kicker 'Quick check · Step 5'; the question; three option cards on their words, none marked
- voiceover: "Quick check. You answer a call in your own words. Does it count as accepted, does the agent fix the code to your words, or does nothing happen until the next plan?"
- duration: 9.56s
- transition_in: crossfade
- status: animated
- src: compositions/frames/37-check-2.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 5
- quiz: k2
- question: You answer a call in your own words. What happens?
- option_a: It counts as accepted
- option_b: The agent fixes it to them
- option_c: Nothing, until the next plan
- answer: b
- explain: A17: your own words are a fix, with your words as the instruction; only words that reach a ledger decision become a new plan
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: an answer in your words.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'accepted'): o1 lands, timed to the start of the word.
Scene 3 (on 'fix'): o2 lands, timed to the start of the word.
Scene 4 (on 'nothing'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 38 — Next: part 6

- scene: RAIL (full): slot 5 '6 calls'; 'Next · Part 6'; hero 'Staying current'
- voiceover: "Next, the last part: step six, and what ran."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/38-closer-5.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 6.
keyMessage: Next, the last part:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 39 — Part 6 of 6

- chapter_start: Step 6, and what ran
- scene: RAIL (full): kicker 'Part 6 of 6'; hero 'Steps 1 to 5, reported'; slot 6 lifts on 'current'
- voiceover: "Part six of six. Steps one to five are reported. Last: keeping the system video current, and what ran."
- duration: 6.98s
- transition_in: crossfade
- status: animated
- src: compositions/frames/39-opener-6.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 6 of 6.
keyMessage: Part six of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'current'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 40 — Step 6: the system video stays current

- scene: SPINE + TERMINAL: kicker 'Step 6 · Stay current'; tag 'decided · D-003' on 'decision'; on 'glossary' a page card listing the three files updated (spec.md, system.json, glossary.md); a terminal card with a real change (the narrowed invariant): on 'diff' '$ reelplanning spec-diff' and 'spec.md: ~Invariants → frames 29–34'; on 'status' '$ reel status' and '△ the system video is behind spec.md'; on 'rebuild' 'an update would rebuild 6 of 35 frame(s), about 65 s of narration'
- voiceover: "Step six keeps decision three. After an accepted walkthrough, the spec, parts list and glossary are updated. Spec diff names the frames a change touches, and reel status says what an update would rebuild."
- duration: 12.49s
- transition_in: crossfade
- status: animated
- src: compositions/frames/40-step-6.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: what an update would touch, before it runs
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 6: the system video stays current.
keyMessage: Step six keeps decision three.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'decision'): d003 lands, timed to the start of the word.
Scene 3 (on 'glossary'): doc lands, timed to the start of the word.
Scene 4 (on 'diff'): l1 lands, timed to the start of the word.
Scene 5 (on 'status'): l2 lands, timed to the start of the word.
Scene 6 (on 'rebuild'): l3 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 41 — Call A10: behind, by commit time

- scene: SPINE + STAGE (4 parts: The review player, resolve-walkthrough, The walkthrough fix step, The system video; all dim except the one this call touches): kicker 'Call A10 · Step 6'; spine tick 6 in ink; The system video lit coral (the frame's one coral) with the worked-example chip 'spec newer → behind' under it; on 'behind' the card 'Chose · By commit time' (2 px ink border) lands in the left column; on 'hash' the card 'Instead of · A content hash' lands at ink 55 %; under them the check chip 'scripts/reel.mjs status'; held — the player pauses here and asks Accept / Flag
- voiceover: "The system video is behind when the spec changed after the video did, by commit time. A content hash was the other way, but this is cheap, and the spec is the video's only source."
- duration: 10.9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/41-call-a10.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a10
- chose: The system video is behind when spec.md changed after the video did (git commit times, file times when uncommitted)
- instead_of: A content hash of what the video says
- why: Cheap, and the spec is the only source the video is built from
- check: scripts/reel.mjs status
- focal: The system video, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A10: behind, by commit time.
keyMessage: The system video is behind when the spec changed after the video did, by commit time.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'behind'): chose lands, timed to the start of the word.
Scene 3 (on 'hash'): instead lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 42 — Deviation: the whole video is re-narrated

- scene: SPINE + STAGE (4 parts: The review player, resolve-walkthrough, The walkthrough fix step, The system video; all dim except the one this call touches): kicker 'Deviation · Step 6'; spine tick 6 in ink; The system video lit coral (the frame's one coral) with the worked-example chip '1 beat · 11 min' under it; on 'whole' the card 'Chose · Re-narrate it all' (2 px ink border) lands in the left column; on 'changed' the card 'Instead of · Changed lines only' lands at ink 55 %; under them the check chip 'walkthrough.md · Not done'; held — the player pauses here and asks Accept / Flag
- voiceover: "One deviation from decision three: a rebuild still narrates the whole video again, not only the changed lines. That is the M3 plan's work. The first fix-step rebuild spent eleven minutes on it."
- duration: 12.01s
- transition_in: crossfade
- status: animated
- src: compositions/frames/42-deviation-narration.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: d1
- chose: Deviation from D-003: a rebuild regenerates narration for the whole video
- instead_of: Narration for the changed lines only
- why: Per-line narration is the M3 plan's (2026-09-22-m3-revise-loop); caching each line's audio by its text would make a small rebuild seconds instead of 11 minutes
- check: walkthrough.md · Not done
- focal: The system video, lit, and the two cards
- roles: lit part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: the whole video is re-narrated.
keyMessage: One deviation from decision three:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'whole'): chose lands, timed to the start of the word.
Scene 3 (on 'changed'): instead lands, timed to the start of the word.
Scene 4 (on 'eleven'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 43 — What ran

- scene: NO STAGE: kicker 'What ran'; four result cards land in turn: 'All pass · npm test', '2 · code checks', '1 · fix step run, for real', '35 · system video frames'
- voiceover: "What ran: every test passes. Two code checks ran, on richer review and on this plan. The fix step ran once for real, and the system video is built."
- duration: 9.7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/43-ran.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- focal: the four results
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What ran.
keyMessage: What ran:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'every'): r1 lands, timed to the start of the word.
Scene 3 (on 'Two'): r2 lands, timed to the start of the word.
Scene 4 (on 'fix'): r3 lands, timed to the start of the word.
Scene 5 (on 'system'): r4 lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 44 — What is not done

- scene: NO STAGE: kicker 'Not done'; two dashed cards: 'Per-line narration · the M3 plan', '2 spec sections · no frame to rebuild'
- voiceover: "Not done: narration for changed lines only, so a small change still narrates the whole video again. And two spec sections have no frame, so a change there names nothing to rebuild."
- duration: 11.45s
- transition_in: crossfade
- status: animated
- src: compositions/frames/44-not-done.html
- type: pain_point
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the two gaps
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What is not done.
keyMessage: Not done:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'narration'): u1 lands, timed to the start of the word.
Scene 3 (on 'two'): u2 lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 45 — Flag a call, or accept

- scene: RAIL (full, centred) with every slot's tag (step 6 now '1 + dev'); the mono line '19 calls · 2 deviations · accept or flag each'; a mono note 'AI-generated narration and visuals' bottom right; long still hold
- voiceover: "That is what landed: six steps, nineteen calls and two deviations. Flag any call, draw on a step to ask for a change, or accept it."
- duration: 11.26s
- transition_in: crossfade
- status: animated
- src: compositions/frames/45-end.html
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
Scene 2 (on 'nineteen'): sum lands, timed to the start of the word.
Scene 3 (on 'Flag'): ask lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.
