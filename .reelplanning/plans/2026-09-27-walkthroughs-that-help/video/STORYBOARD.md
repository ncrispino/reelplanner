---
title: "Walkthroughs that help: see the build run, stop only where you'd notice"
format: 1920x1080
duration: 290s
message: "Revised after the owner's second review: seven steps, every question decided (D-219 to D-224), so the video ends on approve. Step 1: the change shown running, on the screen or in a real run behind the page (the saved file before and after, a command's output, a migration on a copy of real data). Step 2: an off-plan change always pauses; a choice pauses when you'd notice it or can't easily undo it (stored data and formats included); a split file or a rename changes nothing you see or do, so it goes on the list, not judged. Step 3: a quick check where there's something to predict, on the screen or on the disk. Step 4: small pull requests need the short walkthrough only for a choice you'd notice. Step 5: one row, a Plan | Built switch; See it built lands on the same step. Step 6: the bar, and what a miss starts: reel status says so and the next plan proposes dropping the walkthrough video, for the owner to approve; a page says what goes, what replaces it, what stays. Step 7: the system video a bit shorter, eight minutes a soft target."
arc: a real pause and the owner's words; what the second review changed; four changes; earlier plans (new viewers); step 1 on real screens and a real run; step 2's line between noticed and inside; step 3's prediction on the screen and on the disk; a check on step 2; step 4; a check on step 3; step 5's jump; step 6's bar and what a miss starts, with its page; step 7; the plan, all decided
audience: the repo owner, who says they end up spamming accept on walkthroughs; knows the system video, the review page and the walkthrough
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-27-walkthroughs-that-help
terms: backend = the part of a program that runs behind the page: saved files, stored data, commands; the list = the choices that don't pause the walkthrough, one line each at its end, each with its own Flag; pr-check = `reel pr-check`, the command that says where a pull request stands against the contributing rules, and whether its videos are current
terms_check: strict
details_check: strict
before: system#part 5 | the build, with the reel CLI
before: system#part 6 | the walkthrough, with the reel CLI, the review player, the walkthrough fix step, the system video
before: 2026-09-26-contributing | decisions D-200, D-202, D-213, D-215, D-201, D-214: how much does a PR ask of its contributor?; explains "pull request"
before: 2026-09-26-better-visuals | decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "the real thing"
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-200, D-202, D-213, D-215, D-201, D-214: how much does a PR ask of its contributor?; explains "pull request"
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "the real thing"
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-001, D-002, D-003: who checks that the code followed the plan?
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-110, D-109: a step reaches its fifth call during the build. What does…
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-084, D-083: does your own record also decide what stops?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-023: what code does a walkthrough show?
recap: 2026-09-22-close-the-lifecycle--walkthrough | Close the lifecycle: implement to the plan, walk it…: decision D-041: an accepted agent call warns a later plan in reel check…
recap: 2026-09-25-videos-you-can-follow--walkthrough | Videos you can follow: decision D-133: the system video says the plain words throughout, not only…
---

## Video direction

- A REVISED VIDEO, ROUND 3 (style guide §1): the four answered questions are cut to a "decided" line on their steps; the owner's three points (backend changes, what dropping the video means, a shorter system video) are at full length.
- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the real review page paused at a walkthrough's stop (1); the details-in-the-frame walkthrough's real screens (5); the real CONTRIBUTING.md (9); the system video's real scene lengths (15). The walkthrough mocks (7, 13) are labelled planned; the rest explain with pictures.
- MOTION LANGUAGE: things are revealed by their own verb (ringed, typed, drawn, struck, wiped); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; crossfade = the ending.
- FOUR CHAPTERS: after your review (1–4, scene 4 for new viewers only); steps 1 to 3 (5–8); steps 4 and 5 (9–12); steps 6 and 7, and the plan (13–18).
- NO QUESTIONS LEFT: every one is decided (D-219 to D-224); the ending asks for a note or approve.
- NO FIXED COUNTS for what pauses (D-220, the owner's words).
- ONE DETAIL: step 6's "If the bar is missed" page, opened from the reel status line it explains.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Quick-check headings data-question, cards data-option, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice, label, off-plan change, late fix. Words this video defines where it first says them: the list (6).
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.

## Frame 1 — Accept, accept, accept

- chapter_start: Accept, accept, accept
- scene: THE REAL REVIEW PAGE (data-artifact, the fewer-better-stops walkthrough paused at its step 1 stop): two choice cards, each with Accept, Flag and Own words. On 'pauses' the two cards are ringed in ink; on 'accept or flag' the two Accept buttons are ringed; on 'owner' the owner's words land as a quote at the right, and 'spamming accept' is underlined in coral
- voiceover: "After a plan is built, the walkthrough video goes through what landed, and pauses at each choice the agent made on its own, for you to accept or flag. The owner, on the last few: I just end up spamming accept."
- duration: 11.819s
- transition_in: cut
- status: animated
- src: compositions/frames/01-accept-accept-accept.html
- type: hook
- blueprint: compose
- layout: screen
- focal: a real pause, and the owner's words
- sfx: none

narrativeRole: Accept, accept, accept.
keyMessage: After a plan is built, the walkthrough video goes through what landed, and pauses at each choice the agent made on its own, for you to accept or flag.

## Frame 2 — After your review

- scene: FOUR ROWS landing on their words: 'four questions · decided'; 'backend changes · steps 1 to 3'; 'dropping the video · step 6'; 'a bit shorter · step 7'
- voiceover: "You took all four recommendations, so no question is left. You asked three things: aren't backend changes important too, what does dropping the video mean, and could the system video be a bit shorter. Each is now in the plan."
- duration: 12.629s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02b-after-your-review.html
- type: pain_point
- blueprint: compose
- layout: list
- focal: what your second review changed
- sfx: none

narrativeRole: After your review.
keyMessage: You took all four recommendations, so no question is left.

## Frame 3 — What changes

- scene: FOUR TILES landing on their words, each with its steps under it: 'the change, running' (steps 1, 3); 'what you'd notice' (steps 2, 4); 'plan and built together' (step 5); 'did it work?' (steps 6, 7)
- voiceover: "Four changes now. The walkthrough shows the change running: steps one and three. What you'd notice pauses it, pull requests too: steps two and four. The plan and what was built sit together: step five. And we measure it: steps six and seven."
- duration: 12.971s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-what-changes.html
- type: product_intro
- blueprint: compose
- layout: diagram
- focal: four changes, seven steps
- sfx: none

narrativeRole: What changes.
keyMessage: Four changes now.

## Frame 4 — Earlier plans

- knowledge: new
- scene: FOUR ROWS, ONE LINE EACH, landing on their words: close the lifecycle · the walkthrough; fewer, better stops · what pauses today; better visuals · the real thing on screen; contributing · when a pull request needs a video
- voiceover: "Earlier plans lead here. Close the lifecycle made the walkthrough. Fewer, better stops set what pauses today. Better visuals put the real thing on screen. Contributing set when a pull request needs a video."
- duration: 12.011s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-earlier-plans.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: earlier plans in a line each
- sfx: none

narrativeRole: Earlier plans.
keyMessage: Earlier plans lead here.

## Frame 5 — Step 1: the change, running

- chapter_start: Steps 1 to 3: running, what pauses, what to predict
- plan_step: 1
- guide: step-1
- scene: TOP: THE REAL SCREENS (data-artifact, the details-in-the-frame walkthrough's shots), 'decided · decision D-219'; on 'corner chip' the old scene, its chip ringed; on 'tab after' the same scene with the tab on its code block, ringed. BOTTOM, on 'real run': two small file slabs, 'before' (one file per review) and 'after' (one file per day), then chips 'a command's output' and 'a migration on a copy'
- voiceover: "Step one is decided: after the build, the walkthrough shows each change running, before and after. On the screen: the corner chip before, the tab after. Or in a real run, when it happens behind the page: the saved file before and after, a command's output, a migration on a copy of real data."
- duration: 17.024s
- transition_in: cut
- status: animated
- src: compositions/frames/07-step-1-the-change-running.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: on the screen, or in a real run
- sfx: none

narrativeRole: Step 1: the change, running.
keyMessage: Step one is decided:

## Frame 6 — Step 2: what you'd notice

- plan_step: 2
- guide: step-2
- defines: the list
- scene: TWO COLUMNS: 'decided · decisions D-220, D-221' chip; left 'pauses': 'an off-plan change · always', 'the Save button moves · you'd notice', 'saved reviews, new file layout · hard to undo'; right, on 'split a long file', a before and after pair that match: 'the page · the same', 'the buttons · the same', 'the data on disk · the same', each ticked 'same', then 'the list · not judged' with a Flag
- voiceover: "Step two is decided, with no fixed count. An off-plan change always pauses. So does a choice you'd notice, like the Save button moving, or can't easily undo, like saved reviews moving to a new file layout. The line: split a long file in two, and you see the same page, press the same buttons, and the same data sits on disk. Nothing you see or do changes, so it goes on the list, not judged."
- duration: 22.187s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/13-step-2-only-what-youd-notice.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: the line: nothing you see or do changes
- sfx: none

narrativeRole: Step 2: what you'd notice.
keyMessage: Step two is decided, with no fixed count.

## Frame 7 — Step 3: something to predict

- plan_step: 3
- guide: step-3
- scene: A MOCK OF THE WALKTHROUGH, labelled planned, 'decided · decision D-222': a strip 'before · check · after' and the check 'You press Escape with a note typed: what happens?', the note kept; a second strip 'before · check · run' with 'After the change, what does the saved file look like?' and the file slab; a third, dimmed, 'a rename · nothing to predict'
- voiceover: "Step three is decided: a quick check where there's something to predict, just before it runs. On the screen: you press Escape with a note typed; what happens? Behind the page: after the change, what does the saved file look like? Then the run shows it. Only a rename or a split file has nothing to predict."
- duration: 16.64s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/22-step-3-one-question.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: a prediction on the screen, and on the disk
- sfx: none

narrativeRole: Step 3: something to predict.
keyMessage: Step three is decided:

## Frame 8 — Quick check: three choices

- plan_step: 2
- scene: THE CASE FROZEN BEHIND: a small label, dimmed; the heading and three cards land, still
- voiceover: "Quick check. A build moves the Send button to the top, renames an inside function, and changes how saved reviews are stored on disk. Which of those pause its walkthrough?"
- duration: 9.6s
- transition_in: cut
- status: animated
- src: compositions/frames/23-qc-which-pause.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: A build moves the Send button to the top, renames an inside function, and changes how saved reviews are stored on disk. Which of those pause its walkthrough?
- option_a: All three
- option_b: The button and the saved data
- option_c: Only the button
- answer: b
- explain: You'd notice the button, and stored data is hard to undo; a renamed function changes nothing you see or do.
- walk_me_through: The Send button moving is something you see, so it pauses. Changing how reviews are stored changes data on disk, which is hard to undo, so it pauses too, shown as the saved file before and after. Renaming an inside function leaves the page, the buttons and the data the same: it goes on the list.
- option_a_why: The renamed function changes nothing you see or do: it goes on the list.
- option_b_why: Right: one you'd see, one that's hard to undo; the rename goes on the list.
- option_c_why: Stored data is hard to undo, so the storage change pauses too.
- explained_at: 6
- focal: three predictions
- sfx: none

narrativeRole: Quick check: three choices.
keyMessage: Quick check.

## Frame 9 — Step 4: pull requests

- chapter_start: Steps 4 and 5: pull requests, and plan and built together
- plan_step: 4
- guide: step-4
- scene: THE REAL FILE (data-artifact, CONTRIBUTING.md), 'decided · decision D-223': the old words struck and the planned words written under them; on 'small one' two small pull request cards: 'a default you'd see · the short walkthrough' and 'an inside default · a line in its text'; on `reel pr-check` a chip
- voiceover: "Step four is decided: pull requests get the short walkthrough. A small one needs it only for a choice you'd notice or can't easily undo, like a default you'd see change. Any other choice is a line in its text, and reel pr-check checks for it."
- duration: 14.059s
- transition_in: cut
- status: animated
- src: compositions/frames/28-step-4-pull-requests.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: small ones: only what you'd notice
- sfx: none

narrativeRole: Step 4: pull requests.
keyMessage: Step four is decided:

## Frame 10 — Quick check: the saved file

- plan_step: 3
- scene: THE CASE FROZEN BEHIND: a small label, dimmed; the heading and three cards land, still
- voiceover: "Quick check. A build changes the saved review file: each date moves from one field to two. The page looks the same. Does its walkthrough ask a quick check?"
- duration: 9.024s
- transition_in: cut
- status: animated
- src: compositions/frames/29-qc-nothing-to-predict.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: A build changes the saved review file: each date moves from one field to two. The page looks the same. Does its walkthrough ask a quick check?
- option_a: No: the page looks the same
- option_b: Yes: what the saved file looks like
- option_c: Yes, one per chapter
- answer: b
- explain: A change behind the page still runs: the check asks what the saved file will look like, then the run shows it.
- walk_me_through: The page looks the same, but the saved file changes, and the walkthrough shows that file before and after a real run. So there is something to predict: what the file will look like. The check asks it just before the run shows it. Only a rename or a split file has nothing to predict.
- option_a_why: The page is the same, but the saved file changes, and that is shown running.
- option_b_why: Right: a change behind the page is predicted, then run.
- option_c_why: One per chapter was the old rule; a check comes where there's something to predict.
- explained_at: 7
- focal: three predictions
- sfx: none

narrativeRole: Quick check: the saved file.
keyMessage: Quick check.

## Frame 11 — Step 5: plan and built together

- plan_step: 5
- guide: step-5
- scene: 'decided · decision D-224'; a 'Plan | Built' switch; the plan video's strip, steps 1 to 7, step 6 lit with a 'See it built' button; on 'running' an arrow down to the walkthrough's strip, its playhead landing on step 6's running scene, the strip's start marked 'not here' and struck; on 'See the plan' an arrow back up to step 6's plan scene
- voiceover: "Step five is decided: one row per plan, with a Plan and Built switch. On step six's plan scenes, See it built opens the walkthrough at step six, running, not at its start. See the plan brings you back to step six's plan scene."
- duration: 12.885s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/29b-step-5-plan-and-built.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: the jump lands on the same step
- sfx: none

narrativeRole: Step 5: plan and built together.
keyMessage: Step five is decided:

## Frame 12 — Quick check: dark mode

- plan_step: 4
- scene: THE CASE FROZEN BEHIND: a small label, dimmed; the heading and three cards land, still
- voiceover: "Quick check. A small pull request makes the review page open in dark mode. What does it need?"
- duration: 5.248s
- transition_in: cut
- status: animated
- src: compositions/frames/31-qc-forty-lines.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: A small pull request makes the review page open in dark mode. What does it need?
- option_a: Nothing: it's small
- option_b: The short walkthrough
- option_c: A line in its text
- answer: b
- explain: Small pull requests need the video only for a choice you'd notice, and you'd notice the page opening dark.
- walk_me_through: The pull request is small, so the question is whether you'd notice its choice. The page opening in dark mode is the first thing you'd see. So it needs the short walkthrough, showing it running.
- option_a_why: Small is not enough: you'd notice this choice.
- option_b_why: Right: you'd notice it, so it needs the short walkthrough.
- option_c_why: A line in the text is for a choice you wouldn't notice.
- explained_at: 9
- focal: three predictions
- sfx: none

narrativeRole: Quick check: dark mode.
keyMessage: Quick check.

## Frame 13 — Step 6: did it work

- chapter_start: Steps 6 and 7: did it work
- plan_step: 6
- scene: THE BAR, then WHAT A MISS STARTS: the bar as two chips joined by 'and': 'a pause holds you ≥ 5 s', 'something flagged or said'; on 'missed' a terminal line (reel status · walkthroughs: still accepted without a look), marked data-detail; on 'proposes' a plan card 'drop the walkthrough video · for you to approve'; on 'If you do' a plan row mock: 'Plan video' and a 'What changed' text block with list lines and Flags; on 'stay' chips 'plan video · stays', 'code check · stays'; on 'If you don't' 'nothing changes'
- voiceover: "Step six: measure it. The bar, over the next three walkthroughs: a pause holds you five seconds, and something gets flagged or said. If either half is missed, reel status says so, and the agent's next plan proposes dropping the walkthrough video, for you to approve like any plan. If you do, each plan's row shows what changed as text, with the list and its Flags. The plan video and the code check stay. If you don't, nothing changes. Click the status line for the whole of it."
- duration: 23.531s
- transition_in: cut
- status: animated
- src: compositions/frames/30-step-5-did-it-work.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- detail: if-the-bar-is-missed
- detail_title: If the bar is missed
- detail_why: Click the status line for what goes, what you get instead, and what stays.
- detail_kind: fresh
- focal: what a miss starts, and only with your yes
- sfx: none

narrativeRole: Step 6: did it work.
keyMessage: Step six:

## Frame 14 — Quick check: jump back

- plan_step: 5
- scene: THE CASE FROZEN BEHIND: a small label, dimmed; the heading and three cards land, still
- voiceover: "Quick check. You're in the walkthrough, watching the step that moved the Save button run, and press See the plan. Where do you land?"
- duration: 6.123s
- transition_in: cut
- status: animated
- src: compositions/frames/33b-qc-see-it-built.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: You're in the walkthrough, watching the step that moved the Save button run, and press See the plan. Where do you land?
- option_a: The plan video's start
- option_b: That step's plan scene
- option_c: The walkthrough's next step
- answer: b
- explain: The jump goes to the same step in the other video, both ways.
- walk_me_through: See it built and See the plan jump between the same step in the two videos. You are watching the Save button step run. So See the plan lands on that same step's plan scene, not on the plan video's start.
- option_a_why: The jump goes to the same step, not to the start.
- option_b_why: Right: the same step, in the plan video.
- option_c_why: See the plan leaves the walkthrough for the plan video.
- explained_at: 11
- focal: three predictions
- sfx: none

narrativeRole: Quick check: jump back.
keyMessage: Quick check.

## Frame 15 — Step 7: the system video

- plan_step: 7
- guide: step-7
- scene: THE REAL SCENE LIST (data-artifact, the system video's walkthrough chapter): on 'become one' the first two bars merge; on 'seven forty' the total bar shortens from 7:59 to ≈ 7:40; on 'soft target' the 8:00 line turns dashed with 'a warning'
- voiceover: "Step seven. The system video changes only the scenes the new rule makes wrong, and gets a bit shorter where it's easy: its two scenes on what stops the walkthrough become one. About seven forty. Eight minutes stays a soft target: the build warns, and nothing is cut just to fit."
- duration: 15.317s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/32-step-6-the-system-video.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: a bit shorter; a soft target
- sfx: none

narrativeRole: Step 7: the system video.
keyMessage: Step seven.

## Frame 16 — Quick check: nobody approves

- plan_step: 6
- scene: THE CASE FROZEN BEHIND: a small label, dimmed; the heading and three cards land, still
- voiceover: "Quick check. The bar is missed, and the next plan proposes dropping walkthrough videos. You ask for changes to that plan. What happens to walkthroughs?"
- duration: 8.213s
- transition_in: cut
- status: animated
- src: compositions/frames/33-qc-when-nothing-changes.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: The bar is missed, and the next plan proposes dropping walkthrough videos. You ask for changes to that plan. What happens to walkthroughs?
- option_a: They're dropped anyway
- option_b: They stay as they are
- option_c: They pause for a week
- answer: b
- explain: Dropping the walkthrough video is a plan you approve; until you do, nothing changes.
- walk_me_through: A missed bar only makes reel status say so and the next plan propose the drop. That plan is reviewed like any other. You asked for changes, so it is not approved, and walkthrough videos stay as they are.
- option_a_why: Nothing is dropped without your approval of that plan.
- option_b_why: Right: the drop is a plan you approve, and you didn't.
- option_c_why: There is no pause; it is a plan you approve or not.
- explained_at: 13
- focal: three predictions
- sfx: none

narrativeRole: Quick check: nobody approves.
keyMessage: Quick check.

## Frame 17 — Quick check: a longer system video

- plan_step: 7
- scene: THE CASE FROZEN BEHIND: nothing but the heading and three cards, still
- voiceover: "Quick check. A plan adds a twenty second scene to the system video, which is already at its target. What else must the plan do?"
- duration: 7.061s
- transition_in: cut
- status: animated
- src: compositions/frames/34-qc-a-scene-added.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k6
- question: A plan adds a 20-second scene to the system video, which is already at its target. What else must the plan do?
- option_a: Cut twenty seconds elsewhere
- option_b: Nothing: the build warns
- option_c: Split the video in two
- answer: b
- explain: Eight minutes is a soft target: the build warns, and nothing is cut just to fit.
- walk_me_through: Twenty seconds more runs past the target. Eight minutes is now a soft target: the build says so as a warning. Nothing is cut just to fit, so the plan does nothing more.
- option_a_why: Nothing is cut just to fit any more.
- option_b_why: Right: a soft target, so the build warns and it ships.
- option_c_why: Nothing asks for a split; the build only warns.
- explained_at: 15
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a longer system video.
keyMessage: Quick check.

## Frame 18 — The plan

- guide: decisions
- scene: THE SEVEN STEPS, still, each with 'decided' or its one-line rule: step 1 'the change, running' (decided); 2 'what you'd notice' (decided); 3 'a check where there's something to predict' (decided); 4 'pull requests' (decided); 5 'plan and built together' (decided); 6 'measure it'; 7 'the system video, a bit shorter'; 'draw a note · approve'. Holds still.
- voiceover: "That is the plan: seven steps, and every question decided. The walkthrough shows the change running, on the screen or in a real run, pauses where you'd notice, sits beside its plan, and we measure whether you look. Draw on any step to leave a note, or approve."
- duration: 14.715s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- focal: the seven steps, all decided
- sfx: none

narrativeRole: The plan.
keyMessage: That is the plan:
