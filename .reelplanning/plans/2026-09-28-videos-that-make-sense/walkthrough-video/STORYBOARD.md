---
title: "Videos that make sense: what was built"
format: 1920x1080
duration: 130s
message: "Videos that make sense is built, steps 1 to 5, shown running: fresh eyes on the system video, the build stopping until each finding has an answer, what is kept said before you watch (A6), Ask about this answered by the waiting session or kept with your review (A8, A10, A11), frame-lint on the frame you sent, the system video checked in three rounds. Four choices pause, nine are the list."
arc: the map; step 1's fresh-eyes run and a finding; step 2's build stopping; a check; what is left, on Before you watch (A6); a check; Ask about this on the page; the saved review file (A8, A10, A11); step 4's frame-lint run; step 5's system video, before and after; what ran; the list; the open question
audience: the repo owner, who asked for videos that make sense and approved this plan
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-28-videos-that-make-sense
terms: inbox answer = the command an agent session waiting on the page answers a question with (`reelplanning inbox answer`); the list = one sheet at a walkthrough's end: the choices that do not pause, one line each with its own Flag; hosted page = the review page published as a Claude Artifact, where Claude answers a question on your own account; fresh eyes = two fresh agents that look at a video before you do, given only what a viewer gets: a newcomer, who lists what it couldn't follow, and a designer, who lists what reads badly on each frame; stand-in = a shape that stands for content instead of showing it, such as grey bars where words go; saved review file = the file the review page writes into the repo when you press Send: your answers, marks, comments and now your questions; frame-lint = the check that reads each scene's code for layout mistakes, without looking at the picture
terms_check: strict
details_check: strict
before: system | what each part and word here is
before: system#part 2 | twelve parts, two loops, with the plan-to-video skill, the review player, the review server, the reel CLI, the system video
before: system#part 3 | the review page, with the review player
before: 2026-09-27-walkthroughs-that-help | decisions D-221, D-222, D-223, D-219, D-220, D-224: what does Approve make of a choice on the list?; explains "the list"
before: 2026-09-26-contributing | decisions D-171, D-200, D-201, D-202, D-213, D-215: how do decision numbers survive two branches?
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-221, D-222, D-223, D-219, D-220, D-224: what does Approve make of a choice on the list?; explains "the list"
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-171, D-200, D-201, D-202, D-213, D-215: how do decision numbers survive two branches?
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "look"
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-064, D-065, D-082, D-085: who runs the loop between your reviews?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129, D-128: which words does the viewer see: plain new ones, or…
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-001, D-003: who checks that the code followed the plan?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-109, D-110: what may a miss with no tags stop?
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170: who reviews each arm, and in what order?
recap: 2026-09-22-richer-review | Richer review: more kinds of question, comments on marks…: decision D-005: which video-only feedback comes first?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
recap: 2026-09-28-plan-guide | The plan guide: the video first, and a full page behind it…: explains "guide"
---

## Video direction

- THE CHANGE RUNNING (decision D-219): real screens and real runs, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a6 (5); a8, a10, a11 (8), each on the scene that shows it; the list `a1, a2, a3, a4, a5, a7, a9, a12, a13` (12). No off-plan change.
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the scene that runs it: k1 (4) before Before you watch (5); k2 (6) before a question is asked with nobody waiting (7).
- FOUR CHAPTERS: what landed (1); steps 1 and 2 (2–5); step 3 (6–8); steps 4 and 5, and what ran (9–13).
- MOTION: things revealed by their own verb (typed, wiped, ringed, pinned); cut = a chapter or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing below y 945. Headings `data-question`, option cards `data-option`, choice cards `data-call`, still in the scene's last seconds.
- THE SEVEN RULES, this video's own: words, never grey bars; a label on its thing; one focal point a scene.
- PLAIN WORDS (decision D-127): choice, scene, the list, quick check; tool names in code markup.

## Frame 1 — What landed: its map

- chapter_start: What landed
- defines: fresh eyes
- scene: THE MAP (the real change, one row a place): a label 'git diff a9896c9.. · this plan's code'; six rows, each a path in mono and a plain line: scripts/fresh-eyes.mjs · writes what two fresh agents get; scripts/verify.sh · stops on a finding with no answer; reelplanning-player.js · Ask about this, and what is left; scripts/review.mjs · a question to the waiting session; scripts/frame-lint.mjs · grey bars, and room for the tab; SKILL.md · the loop, for every new video
- voiceover: "This build, running. Before a video reaches you, two fresh agents now look at it, and every finding gets an answer. You can ask about any scene. Frames follow seven rules. And the system video was checked."
- duration: 11.648s
- transition_in: cut
- status: animated
- src: compositions/frames/01-landed.html
- guide: what-changed
- guide_title: What changed, in full
- guide_why: Open it for the seven kinds of change with their counts, each one a click from its full diff.
- type: hook
- blueprint: compose
- layout: map
- focal: the change's map, one row a place
- sfx: none

narrativeRole: What landed.
keyMessage: This build, running.

## Frame 2 — Step 1: fresh eyes, run

- chapter_start: Steps 1 and 2: before you watch
- plan_step: 1
- scene: TERMINAL (real): `reelplanning fresh-eyes .reelplanning/system-video` and its two lines; under it newcomer.md's real finding N9 ('the library') on paper, 'a newcomer' pinned on it
- voiceover: "Step one, on the system video. `fresh-eyes` takes a picture of each scene at rest, through the review page, and writes two briefs: one for a newcomer, one for a designer, each a fresh agent that gets only what a viewer gets. The newcomer found the ending sent you to the library, a place never shown."
- duration: 16.235s
- transition_in: cut
- status: animated
- src: compositions/frames/02-step-1-fresh-eyes.html
- guide: command
- guide_title: The new command: fresh-eyes
- guide_why: Open it for every line of the new command, and the two runs it made, whole.
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the run, and one finding it led to
- sfx: none

narrativeRole: Step 1: fresh eyes, run.
keyMessage: Step one, on the system video.

## Frame 3 — Step 2: the build stops

- plan_step: 2
- scene: TERMINAL (real): `reelplanning build .reelplanning/system-video` stopped at verify, 'fresh eyes, round 2: 34 findings not answered: N1 (scene 1) no answer; …'; under it one answer line typed ('- Answer: kept: …'); then the later run's line '✓ fresh-eyes 3 rounds done, 35 findings answered'
- voiceover: "Step two. Until every finding has an answer, `build` stops. An answer is fixed, a meaning, or kept with its reason; kept alone fails. Then the agents look again, three rounds at most."
- duration: 10.645s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-step-2-build-stops.html
- guide: build-gate
- guide_title: The build gate
- guide_why: Open it for every line of the gate, and the build stopping and passing as it ran, to predict what it printed.
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the build stopped on unanswered findings
- sfx: none

narrativeRole: Step 2: the build stops.
keyMessage: Step two.

## Frame 4 — Quick check: what is left

- plan_step: 2
- quiz: k1
- question: After three rounds, the author kept thirty-two findings on the system video. What does its page show before you press play?
- option_a: Nothing: kept means settled
- option_b: All thirty-two, in full
- option_c: Three, with their reasons; the rest one click away
- answer: c
- explain: What is left after the third round is said before you watch, each with the reason it was kept; three on the card, so Start stays in view.
- option_a_why: A kept finding is the one confusion you may still meet, so it is said, never silent.
- option_b_why: Thirty-two in full pushed Start off the card; three show, the rest are one click away.
- option_c_why: Right: three kept findings with their reasons, and the rest one click down.
- walk_me_through: The system video's third round left thirty-two findings the author kept, each with a reason. Before the first play, the card says what was left: the first three, each a short line with its reason, and "29 more" under them. The whole finding shows when you point at it. Start stays on the card.
- explained_at: 3
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. After three rounds, the author kept thirty-two findings on the system video. What does its page show before you press play?"
- duration: 7.168s
- transition_in: cut
- status: animated
- src: compositions/frames/04-qc-what-is-left.html
- type: social_proof
- blueprint: compose
- layout: quiz
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: what is left.
keyMessage: Quick check.

## Frame 5 — Step 2: what is left, and choice A6

- plan_step: 2
- autonomy: a6
- scene: REAL SCREEN: the system video's review page before its first play: Before you watch, 'Left as they are', three kept findings, '29 more', Start; pins on 'Left as they are' and '29 more'; the choice card A6 (data-call a6) at the right
- voiceover: "Before you watch now says what was left, and why: three kept findings, the rest one click down. That's choice A6: only the kept ones, each with its reason, and the notification says the count."
- duration: 10.752s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-step-2-left.html
- type: cta
- blueprint: compose
- layout: shot
- focal: the page's card, what was left
- sfx: none

narrativeRole: Step 2: what is left.
keyMessage: Before you watch now says what was left, and why.

## Frame 6 — Quick check: nobody waiting

- chapter_start: Step 3: ask about this
- plan_step: 3
- quiz: k2
- question: You ask about a scene on your own machine, and no agent session is waiting on the page. What happens to your question?
- option_a: A headless run starts, to answer it
- option_b: It goes with your review
- option_c: It is dropped
- answer: b
- explain: With nobody waiting, the page says so and keeps the question in your review, to be answered in the next version; nothing starts.
- option_a_why: A headless run takes minutes; the plan keeps the question with the review instead.
- option_b_why: Right: the page says nobody is waiting, and the question goes with your review.
- option_c_why: Every question is kept: in the review, in memory, and for the next video's newcomer.
- walk_me_through: You are on your own machine, paused on scene sixteen, and you ask what the saved review file is. No agent session is waiting on the page, so the review server writes nothing and starts nothing. The page says so, and keeps the question in your review. When you press Send, it goes with the review, and the next version answers it.
- explained_at: 1
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. You ask about a scene on your own machine, and no agent session is waiting on the page. What happens to your question?"
- duration: 6.869s
- transition_in: cut
- status: animated
- src: compositions/frames/06-qc-nobody-waiting.html
- type: social_proof
- blueprint: compose
- layout: quiz
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: nobody waiting.
keyMessage: Quick check.

## Frame 7 — Step 3: ask about this

- plan_step: 3
- scene: REAL SCREEN: the local review page paused on the system video's scene 16, Ask about this open in the side panel: the first question answered by the waiting session with its 'From:' line, the second asked with nobody waiting, 'goes with your review'; pins on each
- voiceover: "Step three. Paused on a scene, press Q, or click a caption, and ask. Here the session waiting on the page answered in seconds, and said where from. With none waiting, the question goes with your review. On a hosted page, Claude answers."
- duration: 12.949s
- transition_in: cut
- status: animated
- src: compositions/frames/07-step-3-ask.html
- guide: ask
- guide_title: Ask about this
- guide_why: Open it for every line behind Ask, file by file.
- type: feature_showcase
- blueprint: compose
- layout: shot
- focal: the side panel: a question, its answer, where from
- sfx: none

narrativeRole: Step 3: ask about this.
keyMessage: Step three.

## Frame 8 — Step 3: the saved review file, and choices A8, A10, A11

- plan_step: 3
- autonomy: a8, a10, a11
- scene: A FILE, BEFORE AND AFTER (real): the saved review file's `questions` from the page's export (the two questions, one answered, one `answered: false`), and reviews/<id>.md's 'Questions you asked' under it; three choice cards (data-call a8, a10, a11) at the right
- voiceover: "Every question is kept in the saved review file, and listed to answer in the next version. Three choices pause here: Ask opens in the side panel, the waiting session answers with `inbox answer`, and questions are a field of their own in the file."
- duration: 13.888s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08-step-3-saved-file.html
- type: cta
- blueprint: compose
- layout: before-after
- focal: the file's questions, and three choices
- sfx: none

narrativeRole: Step 3: the saved review file.
keyMessage: Every question is kept in the saved review file.

## Frame 9 — Step 4: frame-lint on the frame you sent

- chapter_start: Steps 4 and 5, and what ran
- plan_step: 4
- scene: TERMINAL (real): `reelplanning frame-lint …/30-step-5-did-it-work.html` and its finding '2 empty bars (#k30-rl0, #k30-rl1) stand where words go (rule 1: show the thing, never a stand-in)'; 'rule 1' pinned
- voiceover: "Step four. The style guide has seven rules for a frame. `frame-lint` fails the two it can see. Here it is on step six's frame you sent: two grey bars where the words should be."
- duration: 10.24s
- transition_in: cut
- status: animated
- src: compositions/frames/09-step-4-frame-lint.html
- guide: frame-rules
- guide_title: The frame rules: frame-lint
- guide_why: Open it for the rules' code, and frame-lint on the frame you sent and on its redraw, as they ran.
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the finding on the frame you sent
- sfx: none

narrativeRole: Step 4: frame-lint.
keyMessage: Step four.

## Frame 10 — Step 5: the system video, checked

- plan_step: 5
- scene: BEFORE AND AFTER (real): the system video's scene 6, three parts before ('ThereelCLI') and after ('The reel CLI'), 'before' and 'after' on each; the counts '3 rounds · 93 findings · 17 fixed · 3 meanings · 73 kept'
- voiceover: "Step five. The system video, checked now: three rounds, ninety-three findings, every one answered. Seventeen were fixed, like this label, three got a meaning, the rest are kept with a reason."
- duration: 10.432s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/10-step-5-system-video.html
- guide: system-video
- guide_title: The system video, checked
- guide_why: Open it for every file of the system video's rebuild, and the check that passes on it.
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: one scene fixed, and the counts
- sfx: none

narrativeRole: Step 5: the system video.
keyMessage: Step five.

## Frame 11 — What ran

- defines: code check
- scene: WHAT RAN: rows: '`npm test` · 31 of 31 pass · fresh-eyes and ask new', 'code check · 5 of 5 steps, 43 of 43 decisions, 1 finding answered', '`reel audit` · passes'; 'not done · older videos keep their stand-ins until rebuilt'
- voiceover: "What ran: every fast test, two new ones among them, and a fresh agent's code check: every step built, every decision held. Not done: older videos keep their grey bars until they're rebuilt."
- duration: 11.136s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/11-what-ran.html
- guide: tests
- guide_title: Tests
- guide_why: Open it for every spec that changed, and npm test as it ran.
- type: benefit_highlight
- blueprint: compose
- layout: steps
- focal: the runs' counts, and what is not done
- sfx: none

narrativeRole: What ran.
keyMessage: What ran: every fast test.

## Frame 12 — The list

- autonomy_list: a1, a2, a3, a4, a5, a7, a9, a12, a13
- scene: THE LIST: nine rows (data-call a1 to a13 but the four that paused), each its id and a few words
- voiceover: "The other nine choices are the list: the findings' shape, how the pictures are taken, the stamp, what counts as lost before, what stops the build, how answers are checked, the hosted call, and frame-lint's two rules. Flag any you'd change."
- duration: 12.651s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-the-list.html
- type: cta
- blueprint: compose
- layout: list
- focal: nine choices, one line each
- sfx: none

narrativeRole: The list.
keyMessage: The other nine choices are the list.

## Frame 13 — Seeing it run

- open_question: Seeing it run, anything you'd change?
- scene: THE ASK: 'Seeing it run, anything you'd change?' in the serif; under it 'Finish: your words, or Approve'; holds still
- voiceover: "Seeing it run, anything you'd change? Say it in Finish, or approve the build."
- duration: 7.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-end.html
- type: cta
- blueprint: compose
- layout: ask
- focal: the open question
- sfx: none

narrativeRole: Seeing it run.
keyMessage: Seeing it run, anything you'd change?
