---
title: "Walkthroughs that help: what was built"
format: 1920x1080
duration: 125s
message: "Walkthroughs that help is built, steps 1 to 6, shown running: what pauses and the list, the open question, pull requests' other choices, one row a plan with its switch, each pause timed. Five choices pause, five are the list; step 7 waits for your accept."
arc: the map; step 2's rule, a check, the real reel stops run, the list (A3); step 3's open question (A5); step 4's pr-check run (A6); step 5's switch (A8) and the list of videos (A9); step 6's rule, a check, the saved file before and after; what ran; the list; the open question
audience: the repo owner, who asked for walkthroughs that help and approved this plan
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-27-walkthroughs-that-help
terms: the list = one sheet at a walkthrough's end, the choices that do not pause, one line each with its own Flag, and Go on lists the rest, not judged; shownAt = when a pause began, saved beside each answer in the review file; judgedAt = when you answered, saved with each answer in the review file; hard-to-undo = the label for a choice you can't easily undo, such as stored data and formats, permissions, or what other people's code relies on; pr-check = the check of a pull request, whether it needs a video and what it carries (`reel pr-check`)
terms_check: strict
details_check: strict
before: system | what each part and word here is
before: 2026-09-27-walkthroughs-that-help | the plan this builds, and its words
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

- THE CHANGE RUNNING (decision D-219): real screens and real runs, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a3 (5), a5 (6), a6 (7), a8 (8), a9 (9), each on the scene that shows it; the list `a1, a2, a4, a7, a10` (14).
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the run that answers them: k1 (3) before `reel stops` (4); k2 (11), the saved file, before it is shown (12).
- FIVE CHAPTERS: what was built (1); step 2 (2–5); steps 3 and 4 (6–7); step 5 (8–9); step 6 (10–12); what ran (13–15).
- MOTION: things revealed by their own verb (typed, wiped, ringed, pinned); cut = a chapter or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing below y 945. Headings `data-question`, option cards `data-option`, choice cards `data-call`, still in the scene's last seconds.
- PLAIN WORDS (decision D-127): choice, scene, the list, quick check; tool names in code markup.

## Frame 1 — What was built: its map

- chapter_start: What was built
- plan_step: 1
- guide: what-changed
- defines: walkthrough video
- scene: THE MAP (the real change, one row a place): a label 'git diff --numstat 806f8aa.. · this plan's files'; seven rows, each a path in mono, a plain line and its count: the review player, the review page, what pauses, memory, pull requests, the skill, the tests; '37 files' on 'thirty-seven'
- voiceover: "Walkthroughs that help is built. This video is step one: the change running, in about two minutes, pausing only where you'd notice. It changed thirty-seven files; here are the places that carry it."
- duration: 10.453s
- transition_in: cut
- status: animated
- src: compositions/frames/01-built.html
- type: hook
- blueprint: compose
- layout: map
- focal: the change's map, one row a place
- sfx: none

narrativeRole: What was built: its map.
keyMessage: Walkthroughs that help is built.

## Frame 2 — Step 2: what pauses

- chapter_start: Step 2: what pauses
- plan_step: 2
- guide: pauses
- defines: the list
- scene: THE RULE: two columns: 'pauses' (visible · you'd notice it; hard-to-undo · stored data, permissions; an off-plan change) and 'the list, at the end' (close; no label); each label lands on its word
- voiceover: "Step two. A choice pauses the video only when you'd notice it, labelled visible, or can't easily undo it, labelled hard to undo; an off-plan change always pauses. Every other choice, labelled close or not at all, goes on one list at the end."
- duration: 14.357s
- transition_in: cut
- status: animated
- src: compositions/frames/02-step-2-rule.html
- type: feature_showcase
- blueprint: compose
- layout: rule
- focal: two labels that pause, the rest the list
- sfx: none

narrativeRole: Step 2: what pauses.
keyMessage: Step two.

## Frame 3 — Quick check: which pauses

- plan_step: 2
- quiz: k1
- question: This build's choice A3 is labelled visible; its choice A2 only close. Which of them pauses this video?
- option_a: Both of them
- option_b: Only choice A3
- option_c: Neither: both go on the list
- answer: b
- explain: A choice labelled visible pauses the video; a close one goes on the list at the end.
- option_a_why: A close label alone never pauses the video now; it goes on the list.
- option_b_why: Right: visible means you'd notice it, so it pauses; close alone goes on the list.
- option_c_why: Visible is one of the two labels that pause; only the others go on the list.
- walk_me_through: A3 is labelled visible: you would notice it using the page, so it pauses, in the scene that shows it running. A2 is labelled only close: a reasonable person could pick the other way, but you would not notice it, so it goes on the list at the end. One pauses, one is listed.
- explained_at: 2
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. This build's choice A3 is labelled visible; its choice A2 only close. Which of them pauses this video?"
- duration: 7.061s
- transition_in: cut
- status: animated
- src: compositions/frames/03-quick-check-k1.html
- type: social_proof
- blueprint: compose
- layout: quiz
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: which pauses.
keyMessage: Quick check.

## Frame 4 — Step 2: the real run

- plan_step: 2
- guide: step-2
- scene: TERMINAL (real): the command and its ten lines, A3 'pauses' ringed, A2 'listed' pinned; the beats under it
- voiceover: "Here is the real run of `reel stops` on this plan. Choice A3 pauses, and choice A2 is listed. Five choices pause, each in the scene that shows it running; the other five are the list."
- duration: 11.008s
- transition_in: cut
- status: animated
- src: compositions/frames/04-step-2-reel-stops.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: `reel stops`, pauses and listed
- sfx: none

narrativeRole: Step 2: the real run.
keyMessage: Here is the real run of `reel stops` on this plan.

## Frame 5 — Step 2: the list, and choice A3

- plan_step: 2
- autonomy: a3
- scene: REAL SCREEN: the review player on the list (a test video's three choices), one flagged; pins 'one line a choice', 'its own Flag', 'Go on: the rest listed'; the choice card A3 (data-call a3) at the right
- voiceover: "This is the list in the review player. Each choice is one line, what it chose instead of what, with its own Flag. Choice A3 made it this sheet: a Flag on each row and one Go on under them, not an Accept on every row. Go on lists the rest, not judged."
- duration: 14.528s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-step-2-the-list.html
- type: cta
- blueprint: compose
- layout: shot
- focal: the list sheet, one Flag flagged
- sfx: none

narrativeRole: Step 2: the list, and choice A3.
keyMessage: This is the list in the review player.

## Frame 6 — Step 3: the open question, and choice A5

- chapter_start: Steps 3 and 4
- plan_step: 3
- guide: checks
- autonomy: a5
- scene: REAL SCREEN: Finish, the question 'Seeing it run, anything you'd change?' with words typed; the choice card A5 (data-call a5)
- voiceover: "Step three. A quick check now comes only where the change has something to predict, just before it runs, like the one you just answered. And the walkthrough ends on one open question. Choice A5 asks it in Finish, where every review ends, instead of one more pause."
- duration: 14.912s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-3-open-question.html
- type: cta
- blueprint: compose
- layout: shot
- focal: Finish with the open question
- sfx: none

narrativeRole: Step 3: the open question, and choice A5.
keyMessage: Step three.

## Frame 7 — Step 4: other choices, and choice A6

- plan_step: 4
- guide: pull-requests
- autonomy: a6
- scene: TERMINAL (real): `reel pr-check` on a scratch pull request: its two other choices, 'waiting for a maintainer to accept', then the ticked run '0 waiting'; the choice card A6 (data-call a6)
- voiceover: "Step four. A small pull request needs the video only for a choice you'd notice. Any other choice is one line in its text. Choice A6: `reel pr-check` waits until a maintainer ticks them accepted. Here it waits; ticked, it passes."
- duration: 13.781s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-step-4-pr-check.html
- type: cta
- blueprint: compose
- layout: terminal
- focal: `reel pr-check` waiting, then passing
- sfx: none

narrativeRole: Step 4: other choices, and choice A6.
keyMessage: Step four.

## Frame 8 — Step 5: one row, and choice A8

- chapter_start: Step 5: plan and built together
- plan_step: 5
- guide: one-row
- autonomy: a8
- scene: REAL SCREENS: the page's header before (title, Videos) and after (the Plan | Built switch); its link '…--walkthrough&t=19.56' pinned; the choice card A8 (data-call a8)
- voiceover: "Step five. Each plan now has one switch, Plan and Built, at the top of its page. Choice A8 makes that switch the jump itself: on a plan's step one, Built opens the walkthrough at step one, running."
- duration: 11.605s
- transition_in: cut
- status: animated
- src: compositions/frames/08-step-5-the-switch.html
- type: cta
- blueprint: compose
- layout: before-after
- focal: the header, before and after
- sfx: none

narrativeRole: Step 5: one row, and choice A8.
keyMessage: Step five.

## Frame 9 — Your ask: the list of videos, and choice A9

- plan_step: 5
- guide: step-5
- autonomy: a9
- scene: REAL SCREENS: the Videos list before (two rows a plan, long) and after (one row a plan, 'Earlier plans (10)'); the choice card A9 (data-call a9)
- voiceover: "You asked for the list of videos to be shorter. Now each plan is one row with that switch. Choice A9: what needs you first, then the five newest plans, the rest folded behind Earlier plans."
- duration: 11.136s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/09-step-5-the-videos.html
- type: cta
- blueprint: compose
- layout: before-after
- focal: the list of videos, before and after
- sfx: none

narrativeRole: Your ask: the list of videos, and choice A9.
keyMessage: You asked for the list of videos to be shorter.

## Frame 10 — Step 6: did it work?

- chapter_start: Step 6: did it work?
- plan_step: 6
- guide: measure
- defines: shownAt
- scene: THE RULE: a pause's two times on a line, 'began' and 'answered', the gap between them; the bar: '5 s, and a flag or your words'; three reviews that miss it and the status line
- voiceover: "Step six measures whether this helps. The review file now saves when each pause began, beside when you answered it. If three walkthroughs in a row are each answered in under five seconds, with nothing said, `reel status` says a plan to drop the video is due."
- duration: 14.251s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-6-rule.html
- type: feature_showcase
- blueprint: compose
- layout: rule
- focal: when a pause began, and the bar
- sfx: none

narrativeRole: Step 6: did it work?.
keyMessage: Step six measures whether this helps.

## Frame 11 — Quick check: the saved file

- plan_step: 6
- quiz: k2
- question: The review page looks just the same after this build. What does one saved answer look like in the review file now?
- option_a: Just as before
- option_b: When its pause began, beside when you answered
- option_c: Only the seconds you took
- answer: b
- explain: The page looks the same, but the saved file changes: each answer now keeps when its pause began, beside when you answered.
- option_a_why: The page is the same, but what is saved is not: that is the change to predict.
- option_b_why: Right: shownAt, when the pause began, is saved beside judgedAt, when you answered.
- option_c_why: Both times are saved; the seconds are worked out from them later, by reel memory.
- walk_me_through: Nothing on the page changed, so it is easy to think nothing did. But each answer in the saved review file now carries a second time: shownAt, when its pause began, beside judgedAt, when you answered. The seconds between them are what reel memory reads.
- explained_at: 10
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. The review page looks just the same after this build. What does one saved answer look like in the review file now?"
- duration: 6.784s
- transition_in: cut
- status: animated
- src: compositions/frames/11-quick-check-k2.html
- type: social_proof
- blueprint: compose
- layout: quiz
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: the saved file.
keyMessage: Quick check.

## Frame 12 — Step 6: the saved file, before and after

- plan_step: 6
- guide: step-6
- scene: REAL FILE: one saved answer before (details-in-the-frame's review) and after (the list spec's export), shownAt highlighted; under it the real `reel memory after-build` line
- voiceover: "Here is the real file, before and after. The new field, `shownAt`, sits beside `judgedAt`. And `reel memory` reads it: fifteen walkthrough reviews so far, none timed yet, nine sent before the video could have played through."
- duration: 12.544s
- transition_in: cut
- status: animated
- src: compositions/frames/12-step-6-saved-file.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the saved answer before and after; the memory line
- sfx: none

narrativeRole: Step 6: the saved file, before and after.
keyMessage: Here is the real file, before and after.

## Frame 13 — What ran

- chapter_start: What ran
- defines: code check
- scene: WHAT RAN: rows: '`npm test` · 29 of 29 pass', 'code check · 6 of 7 steps, 42 of 42 decisions, 1 finding fixed', '`reel audit` · passes'; 'step 7 · waits for your accept'
- voiceover: "What ran: all twenty-nine fast test files pass. A second agent checked the code against the plan: six steps built, every decision held, one mistake in a test, now fixed. Not done: step seven, the system video, waits for your accept."
- duration: 13.803s
- transition_in: cut
- status: animated
- src: compositions/frames/13-what-ran.html
- type: benefit_highlight
- blueprint: compose
- layout: steps
- focal: the runs' counts, and step 7 waiting
- sfx: none

narrativeRole: What ran.
keyMessage: What ran: all twenty-nine fast test files pass.

## Frame 14 — The list

- guide: choices
- autonomy_list: a1, a2, a4, a7, a10
- scene: THE LIST: five rows (data-call a1, a2, a4, a7, a10), each its id and a few words
- voiceover: "The other five choices are the list: the length a walkthrough aims for, how the list is written, when a choice counts as listed, where a step's jump lands, and the bar judged review by review. Flag any you'd change."
- duration: 11.648s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-the-list.html
- type: cta
- blueprint: compose
- layout: list
- focal: five choices, one line each
- sfx: none

narrativeRole: The list.
keyMessage: The other five choices are the list: the length a walkthrough aims for, how the list is written, when a choice counts as listed, where a step's jump lands, and the bar judged review by review.

## Frame 15 — Seeing it run

- open_question: Seeing it run, anything you'd change?
- scene: THE ASK: 'Seeing it run, anything you'd change?' in the serif; under it 'Finish: your words, or Approve'; holds still
- voiceover: "Seeing it run, anything you'd change? Say it in Finish, or approve the build."
- duration: 7.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-end.html
- type: cta
- blueprint: compose
- layout: ask
- focal: the open question
- sfx: none

narrativeRole: Seeing it run.
keyMessage: Seeing it run, anything you'd change? Say it in Finish, or approve the build.
