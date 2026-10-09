---
title: "Videos you can follow: what was built"
format: 1920x1080
duration: 297s
message: "All four steps of the videos-you-can-follow plan are built: every glossary word has a plain word for the screen and a scene of the system video that explains it, one click away in the captions (step 1); the tool writes what to watch first, the system video and at most two earlier plans (step 2); memory keeps where you got lost, and approving is never blocked (step 3); quick checks test the case just shown, and the build holds them to it (step 4). Twelve labelled choices stop in four pauses, one per step; no off-plan change. The code check's findings, each answered."
arc: the words first (chapter, choice, label, accepted in a row, scene, off-plan change), each said plainly where it is first used, and a short scene of earlier decisions for newcomers; then the four steps in plan order, each with what changed, a real screenshot of the current player where the change is visible, its one pause, and a quick check on the case just shown; what the code check found and how each finding was answered, with a check; what ran, and the ask
audience: the repo owner, who approved the last plan with 3 of 3 quick checks wrong and asked for videos a newcomer can follow; assumes only the system video and what the card lists
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-25-videos-you-can-follow
before: system#part 5 | the build and the walkthrough, with the review player, the reel CLI, the system video, the plan-to-video skill
before: 2026-09-22-m3-revise-loop | decisions D-083, D-084, D-065: how many quick checks does a video ask?
before: 2026-09-24-memory | decisions D-106, D-107: where does your memory across repos live?
terms: chapter, choice, label, accepted in a row, scene, off-plan change
terms_check: strict
---

## Video direction

- PLAIN WORDS (decision D-127, this plan's): what is seen and heard says choice (not call), label (not tag: "you'll notice it", "toss-up", "hard-to-undo"), accepted in a row (not streak), chapter (not part), scene (not beat), off-plan change (not deviation). Files, commands, tags in this storyboard and the decision log keep their names. The old names are said only where the video says which plain word replaced them (5), and where the code check found them on screen (23).
- DEFINE BEFORE USE: each word is said plainly the first time, with a small 'means' card on screen and `- defines:` on that scene: chapter (1), choice, label and accepted in a row (2), scene and off-plan change (3). The glossary is said as "the repo's list of words" (5), memory as "what the tool learns from your reviews" (14). No id is said or shown without what it is ('choice A5', 'decision D-127').
- WHAT TO WATCH FIRST: the `before:` lines are what `reel prereqs <plan-dir> --walkthrough` wrote: the system video's chapter on the build loop, the revise-loop plan, the memory plan. Past two, it named four more (fewer-better-stops, close-the-lifecycle, the memory walkthrough, answer-on-the-video): scene 4 (`- knowledge: new`, under 10 s) says the three of their decisions this video leans on.
- THE PAUSES `reel stops` prints: all twelve choices stop (every label's count is 0 or 2 of 10), one scene per step: step 1 `- autonomy: a1, a2, a3, a4` (8), step 2 `- autonomy: a5, a6, a7` (12), step 3 `- autonomy: a8, a9, a10` (16), step 4 `- autonomy: a11, a12` (20). No off-plan change, no choice that doesn't stop, so no list of the rest. Each choice a clause in the voice, and a card on the frame (`data-call`), clear of the next with room under it.
- REAL SCREENSHOTS of the current player (this checkout), served the way packages/player/test/access.spec.mjs serves videos, where the change is visible: a caption word clicked, with "Explained in the system video, chapter 1" (6), the Terms panel (7), this video's own Before you watch card (11), the quiet line on Finish after three missed checks (15), a walk-through after a wrong answer (19). In assets/shots/.
- QUICK CHECKS (§7): one per step and one on the code check, each on the case its scene just showed, with no new fact, a `- walk_me_through:`, `- explained_at:`, `- question_more:`, an `- option_x_more:` and `- option_x_why:` per option: k1 a row for sweep no scene explains (5), k2 six earlier videos, two on the card (10), k3 label looked up in a third review (14), k4 an answer never shown (18), k5 a scene that never says its word (23). Headings carry `data-question`, option cards `data-option`.
- SIX CHAPTERS, no separate openers (the step scenes carry `chapter_start` and say the chapter): the words (1–4), step 1 (5–9), step 2 (10–13), step 3 (14–17), step 4 (18–21), the code check and what ran (22–25).
- THE ANSWER ON THE FRAME: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions, so the lowest eighth (y ≥ 945) is empty.
- A spine of four ticks (steps 1–4), the live one coral, on step scenes; the ending's step rows carry `data-plan-step`. The look from `.reelplanning/theme/frame.md`; one coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still. No details.

## Frame 1 — Videos you can follow, as built

- chapter_start: What was built, and the words for it
- defines: chapter
- scene: NO SPINE: kicker 'As built · videos you can follow'; four step rows (data-plan-step), each 'done' on its words; the chip 'last plan · 3 of 3 checks wrong' outlined coral on 'wrong' (the one coral); the 'means' card 'chapter · one stretch of this video' on 'chapters', with the grey chip '6 chapters'
- voiceover: "The plan for videos you can follow is built, all four steps. You approved the last plan with all three quick checks wrong; this is the fix. Six chapters: the words, one per step, then a second agent's check."
- duration: 11.797s
- transition_in: cut
- status: animated
- src: compositions/frames/01-built.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: all four steps built; the last plan approved with 3 of 3 checks wrong
- sfx: none

narrativeRole: Videos you can follow, as built.
keyMessage: The plan for videos you can follow is built, all four steps.

## Frame 2 — A choice, a label, accepted in a row

- defines: choice, label, accepted in a row
- scene: 'MEANS' CARDS + COUNTS: kicker 'The words · 1 of 2'; the card 'choice · decided by the agent alone' on 'choice'; the figure '12 choices' on 'twelve'; the card 'accepted in a row · at 10, it stops no more' on 'row'; the card 'label · a note: worth a look' on 'label'; three label rows with their counts (you'll notice it 0 of 10, toss-up 0 of 10, hard-to-undo 2 of 10) on their words; the chip '12 of 12 stop' outlined coral on 'stop' (the one coral)
- voiceover: "A choice is something the agent decided alone, that the plan did not spell out: this build made twelve. A label is a note on a choice worth a look: you'll notice it, toss-up, or hard-to-undo. A labelled choice stops the video until its label is accepted ten times in a row."
- duration: 15.723s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-choice-label.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: twelve choices, three labels, every count far from ten: all twelve stop
- sfx: none

narrativeRole: A choice, a label, accepted in a row.
keyMessage: A choice is something the agent decided alone, that the plan did not spell out:

## Frame 3 — A scene, and one pause per step

- defines: scene, off-plan change
- scene: 'MEANS' CARDS + TIMELINE: kicker 'The words · 2 of 2'; the card 'scene · a picture, a sentence or two' on 'scene'; the card 'off-plan change · not what the plan said' on 'off-plan'; a timeline of four pause marks, one per step (4, 3, 3 and 2 choices), on 'twelve'; the chip '12 choices → 4 pauses' outlined coral on 'four' (the one coral); the grey chip 'off-plan changes · 0' on 'none'
- voiceover: "Choices that stop in one step share one scene, a picture and a sentence or two, and the video pauses once: twelve choices, four pauses. An off-plan change, something other than the plan said, would pause alone; there are none."
- duration: 12.309s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-scene-pause.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: twelve choices, four pauses, no off-plan change
- sfx: none

narrativeRole: A scene, and one pause per step.
keyMessage: Choices that stop in one step share one scene, a picture and a sentence or two, and the video pauses once:

## Frame 4 — Three earlier decisions that still hold

- scene: THREE RULES (for newcomers; skipped at 'familiar'): kicker 'From earlier plans'; three rule cards on their words: 'The system video catches up', 'A step's 5th choice is asked first', '3 of one kind is a signal' (outlined coral, the one coral)
- voiceover: "Three earlier decisions still hold: the system video catches up after each accepted walkthrough; a step's fifth choice is asked first; and three of one kind is a signal."
- duration: 9.643s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-recap.html
- type: pain_point
- beat: Focus
- blueprint: compose
- knowledge: new
- focal: three earlier decisions, one line each
- sfx: none

narrativeRole: Three earlier decisions that still hold.
keyMessage: Three earlier decisions still hold:

## Frame 5 — Step 1: every word explained once, and one click away

- chapter_start: Step 1: every word explained, one click away
- scene: SPINE + GLOSSARY: kicker 'Step 1 · Every word explained'; lab 'In the files → on screen'; three rows 'call → choice', 'tag → label', 'beat → scene' on their words; the grey chip 'decided · decision D-127, plain words' on 'decided'; the figure '40 rows explained' on 'forty'; the rule 'sweep: no scene → build stops' outlined coral on 'stops' (the one coral)
- voiceover: "Chapter two: step one. The glossary, the repo's list of words, now gives each a plain word for the screen, as you decided: choice for call, label for tag. All forty rows have a scene in the system video; add a row with none, say sweep, and its build stops and names it."
- duration: 15.019s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the glossary's plain words; 40 of 40 rows explained; a row with no scene stops the build
- sfx: none

narrativeRole: Step 1: every word explained once, and one click away.
keyMessage: Chapter two:

## Frame 6 — A word in the captions, clicked

- scene: SPINE + SCREENSHOT: kicker 'Step 1 · In the player'; a real screenshot of this plan's own video in the current player (assets/shots/caption.png): 'choice' clicked in the captions, its meaning and 'Explained in the system video, chapter 1 · Why a video. Play that scene'; the meaning's box outlined coral on 'explained' (the one coral); grey chips 'the video waits' on 'waits' and 'Play that scene' on 'link'
- voiceover: "In any video, a glossary word in the captions is underlined. Click it: the video waits, and its meaning shows with where it is explained, here the system video, chapter one, and a link that plays that scene."
- duration: 11.477s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-shot-caption.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the meaning over the captions, and where it is explained
- sfx: none

narrativeRole: A word in the captions, clicked.
keyMessage: In any video, a glossary word in the captions is underlined.

## Frame 7 — The Terms panel

- scene: SPINE + SCREENSHOT: kicker 'Step 1 · Terms (G)'; a real screenshot of the Terms panel open beside this plan's video (assets/shots/terms.png); the panel's first two entries ('Choice · in the files: A call', 'Label · in the files: A tag') outlined coral on 'label' (the one coral)
- voiceover: "Press G for the Terms panel: this scene's words, each in the word said on screen, then the files' name: label, in the files a tag."
- duration: 7.253s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-shot-terms.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: each word in the word said on screen, the files' name after it
- sfx: none

narrativeRole: The Terms panel.
keyMessage: Press G for the Terms panel:

## Frame 8 — Step 1's four choices, in one pause

- scene: SPINE + FOUR CHOICE CARDS (data-call a1–a4), two by two, each clear of the next with room under it: 'choice A1 · A new glossary column', 'choice A2 · 3 more plain words', 'choice A3 · One list for the repo', 'choice A4 · Plain words throughout', each with what it chose instead of and its labels, landing on 'First' … 'Fourth'
- voiceover: "Step one's four choices stop here. First: plain words are a new glossary column, not a separate file. Second: three more of them than you decided. Third: one list, for the whole repo, of which video explains each word. Fourth: plain words throughout the system video, cutting three passages."
- duration: 16.491s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-stop-step-1.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 1
- autonomy: a1, a2, a3, a4
- focal: four choices, one pause, each card answered on its own
- sfx: none

narrativeRole: Step 1's four choices, in one pause.
keyMessage: Step one's four choices stop here.

## Frame 9 — Quick check: a row no scene explains

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the heading (data-question) 'Sweep: a glossary row, and no scene.'; three option cards (data-option a–c) landing near the end of the question; nothing marked (the player asks, then shows the answer on the cards)
- voiceover: "Quick check. A glossary row for sweep, and no scene of the system video explains it. What happens when the system video is built?"
- duration: 6.912s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 1
- quiz: k1
- question: You add a glossary row for sweep, and no scene of the system video explains it. What happens when the system video is built?
- question_more: The system video's build, right after the new row is added to the glossary.
- option_a: It stops, and names sweep
- option_b: It builds, with a warning
- option_c: It builds; plan videos explain it
- option_a_more: The build does not finish, and says which word no scene explains.
- option_b_more: The build finishes, and prints a line about the word.
- option_c_more: The system video leaves the word to the plan videos that use it.
- answer: a
- explain: Every glossary row must have a scene of the system video that explains it, so a row with none stops that video's build, and the build names the word.
- option_a_why: Every glossary row needs a scene of the system video that explains it; a row with none stops its build, by name.
- option_b_why: A warning would let the system video ship with sweep unexplained; step one makes it a stop.
- option_c_why: Plan videos lean on the system video for glossary words; the promise is that it explains every one.
- walk_me_through: The glossary now has a row for sweep. Building the system video checks every row for a scene that explains it. Sweep has none, so the build stops and says so, by name. Adding a scene that says what sweep means lets it pass.
- explained_at: 5
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a row no scene explains.
keyMessage: Quick check.

## Frame 10 — Step 2: the tool picks what to watch first

- chapter_start: Step 2: what to watch first
- scene: SPINE + THE CARD'S LIST: kicker 'Step 2 · What to watch first'; three rows: 'The system video · chapter 4, the build loop' on 'always', 'The revise-loop plan' and 'The memory plan' on 'two'; the chip '6 earlier videos → 2 on the card' outlined coral on 'six' (the one coral); the grey chip 'the rest: one short scene' on 'sums'
- voiceover: "Chapter three: step two. The tool now writes what to watch first into the storyboard, the video's plan: the system video at its closest chapter, then at most two earlier plans. This video builds on six: the card lists two, and a short scene near the start sums up the rest."
- duration: 15.808s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the system video, then at most two earlier plans; six earlier videos become two on the card
- sfx: none

narrativeRole: Step 2: the tool picks what to watch first.
keyMessage: Chapter three:

## Frame 11 — This video's own Before you watch card

- scene: SPINE + SCREENSHOT: kicker 'Step 2 · Before you watch'; a real screenshot of this walkthrough video's own card in the current player (assets/shots/before.png), its rows written by the tool; the rows outlined coral on 'ticked' (the one coral); the grey chip 'decided · decision D-128' on 'decided'
- voiceover: "Here is that card, on this very video: each video, what it gives, its length, and whether you watched it. It is ticked off once you finish it, in this browser, and in your file across repos when you send a review, as you decided."
- duration: 12.181s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-shot-before.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the card before the first play: each video, what it gives, its length, watched or not
- sfx: none

narrativeRole: This video's own Before you watch card.
keyMessage: Here is that card, on this very video:

## Frame 12 — Step 2's three choices, in one pause

- scene: SPINE + THREE CHOICE CARDS (data-call a5–a7), each clear of the next with room under it: 'choice A5 · Picked by shared words', 'choice A6 · Kept or replaced decisions', 'choice A7 · Written into the storyboard', each with what it chose instead of and its labels, landing on 'First' … 'Third'
- voiceover: "Step two's three choices stop here. First: the system video's chapter is picked by the words it shares with the plan. Second: an earlier plan counts when this one keeps or replaces its decisions. Third: the lines are written into the storyboard, not printed to paste."
- duration: 15.168s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-stop-step-2.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 2
- autonomy: a5, a6, a7
- focal: three choices, one pause, each card answered on its own
- sfx: none

narrativeRole: Step 2's three choices, in one pause.
keyMessage: Step two's three choices stop here.

## Frame 13 — Quick check: six earlier videos

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the heading (data-question) '6 earlier videos. How many on the card?'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. This video builds on six earlier videos. Besides the system video, how many does its card list?"
- duration: 6.123s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 2
- quiz: k2
- question: This video builds on six earlier videos. Besides the system video, how many does its card list?
- question_more: Six earlier plans' videos made decisions this video builds on. The card lists what to watch before the first play.
- option_a: All six
- option_b: Two; a short scene sums up the rest
- option_c: None: only the system video
- option_a_more: Every one of the six is on the card, after the system video.
- option_b_more: Two are on the card; the others are summed up inside this video.
- option_c_more: The card lists only the system video.
- answer: b
- explain: The card lists at most two earlier videos besides the system video; past two, a short scene near the start sums up the rest.
- option_a_why: Past two, the card would ask too much before the first play; the rest are summed up in a short scene instead.
- option_b_why: At most two earlier videos go on the card, besides the system video; a short scene near the start sums up the other four.
- option_c_why: The earlier plans this one builds on are listed too, up to two of them.
- walk_me_through: This video builds on decisions from six earlier videos. The card lists the system video, then at most two of them: the revise-loop plan and the memory plan. The other four are summed up in one short scene near the start, for newcomers. So the card has two besides the system video.
- explained_at: 10
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: six earlier videos.
keyMessage: Quick check.

## Frame 14 — Step 3: the tool remembers where you got lost

- chapter_start: Step 3: where you got lost
- scene: SPINE + MEMORY'S LINE: kicker 'Step 3 · Where you got lost'; a code slab with memory's new line as this repo has it ('revise-loop · 3 of 5 checks wrong', 'the last plan · 3 of 3, approved anyway', '3 approvals with checks missed') on its words; the rule 'label · looked up in 3 reviews → a signal' outlined coral on 'signal' (the one coral); the grey chip 'the retro rewrites its scene' on 'retro'
- voiceover: "Chapter four: step three. Memory, what the tool learns from your reviews, has a new line: where you got lost. Here: most in the revise-loop plan, and the last plan, three of three wrong, approved anyway. One word looked up in three reviews, say label, is a signal: the retro rewrites its scene."
- duration: 16.192s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: memory's new line on this repo, and one word looked up three times
- sfx: none

narrativeRole: Step 3: the tool remembers where you got lost.
keyMessage: Chapter four:

## Frame 15 — Finish, with checks missed

- scene: SPINE + SCREENSHOT: kicker 'Step 3 · At Finish'; a real screenshot of Finish in the current player after three missed quick checks on this plan's video (assets/shots/finish.png): 'You missed 3 of 3 quick checks. Walk me through them · Ask the agent to explain it again · or approve as is.' above Approve and Request changes; the line outlined coral on 'quiet' (the one coral); the grey chip 'decided · decision D-129' on 'decided'
- voiceover: "Approving is never blocked, as you decided. At Finish, one quiet line says how many checks you missed, with a way to walk through them or ask the agent to explain again."
- duration: 9.579s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-shot-finish.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: one quiet line above the verdict; Approve stays open
- sfx: none

narrativeRole: Finish, with checks missed.
keyMessage: Approving is never blocked, as you decided.

## Frame 16 — Step 3's three choices, in one pause

- scene: SPINE + THREE CHOICE CARDS (data-call a8–a10), each clear of the next with room under it: 'choice A8 · A 6th line of memory', 'choice A9 · Two new fields in a review', 'choice A10 · Shown at your memory's end', each with what it chose instead of and its labels, landing on 'First' … 'Third'
- voiceover: "Step three's three choices stop here. First: where you got lost is a sixth memory line. Second: a review now carries the words you looked up and the videos you watched. Third: what your file knows ends your memory across repos."
- duration: 13.099s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-stop-step-3.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 3
- autonomy: a8, a9, a10
- focal: three choices, one pause, each card answered on its own
- sfx: none

narrativeRole: Step 3's three choices, in one pause.
keyMessage: Step three's three choices stop here.

## Frame 17 — Quick check: one word, three reviews

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the heading (data-question) 'Label, looked up in a 3rd review.'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. You looked up label in two reviews; in a third, you look it up again. What happens?"
- duration: 4.971s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 3
- quiz: k3
- question: You looked up label in two reviews already. In a third review, you look it up again. What happens?
- question_more: The same word, label, opened for its meaning in three different reviews.
- option_a: A signal: its scene is rewritten
- option_b: Nothing: only a count goes up
- option_c: Approve waits until you watch its scene
- option_a_more: It counts as a signal, and the retro asks for that word's scene to be rewritten.
- option_b_more: Memory's count of words looked up goes up by one, and nothing else.
- option_c_more: Approve is held until you have played the scene that explains it.
- answer: a
- explain: One word looked up in three reviews is a signal that its explanation is not working, so the retro lists it to rewrite its scene.
- option_a_why: Three reviews looking up one word is a signal that its explanation is not working, so the retro lists it to rewrite its scene.
- option_b_why: The count goes up too, but three of one kind is also a signal.
- option_c_why: Approving is never blocked; what you looked up is recorded, not enforced.
- walk_me_through: You looked up label in two reviews, and now in a third. Three of one kind is a signal. The retro lists label among the words looked up in three reviews, to rewrite its scene in the system video, or its glossary row. Nothing is blocked.
- explained_at: 14
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: one word, three reviews.
keyMessage: Quick check.

## Frame 18 — Step 4: quick checks test the case just shown

- chapter_start: Step 4: checks on the case just shown
- scene: SPINE + TWO RULES + EXAMPLE: kicker 'Step 4 · Checks on the case shown'; the rule 'no walk-through → the build fails' on 'fails'; the rule 'answer never shown → a warning' outlined coral on 'warns' (the one coral); a code slab 'answer · "Twice: …"' / 'its scene · never "twice"' on 'twice'
- voiceover: "Chapter five: step four. A quick check now tests the main idea, on the case just shown. The build fails a check with no walk-through, and warns when the answer uses words its scene never says: the last plan's first check says twice, and its scene never does."
- duration: 14.72s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-step-4.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: no walk-through fails; an answer never shown warns; the last plan's 'twice'
- sfx: none

narrativeRole: Step 4: quick checks test the case just shown.
keyMessage: Chapter five:

## Frame 19 — A wrong answer, walked through

- scene: SPINE + SCREENSHOT: kicker 'Step 4 · After a wrong answer'; a real screenshot of this plan's first quick check answered wrong in the current player (assets/shots/walk.png): 'Walk me through it' open over the cards, the right card and yours marked, 'Waits while you read'; the walk-through outlined coral on 'walk-through' (the one coral)
- voiceover: "And when you answer one wrong, its walk-through opens on the frame, working the same case through, and the video waits while you read."
- duration: 6.805s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-shot-walk.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: the walk-through open on the frame after a wrong answer
- sfx: none

narrativeRole: A wrong answer, walked through.
keyMessage: And when you answer one wrong, its walk-through opens on the frame, working the same case through, and the video waits while you read.

## Frame 20 — Step 4's two choices, in one pause

- scene: SPINE + TWO CHOICE CARDS (data-call a11, a12), side by side with room under them: 'choice A11 · Any longer word unsaid', 'choice A12 · Ids warned in the reason only', each with what it chose instead of and its label, landing on 'First' and 'Second'
- voiceover: "Step four's two choices stop here. First: an answer counts as not shown when any longer word of it goes unsaid, not only its exact phrase. Second: only a check's reason is warned for naming an id; a walk-through may name a choice by its number beside what it is."
- duration: 15.232s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-stop-step-4.html
- type: cta
- beat: Focus
- blueprint: compose
- plan_step: 4
- autonomy: a11, a12
- focal: two choices, one pause, each card answered on its own
- sfx: none

narrativeRole: Step 4's two choices, in one pause.
keyMessage: Step four's two choices stop here.

## Frame 21 — Quick check: an answer never shown

- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 4'; the heading (data-question) 'A walk-through, but “twice” never shown.'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. A check has a walk-through, but its answer says twice, and its scene never does. What does the build do?"
- duration: 5.824s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-quiz-k4.html
- type: social_proof
- beat: Check
- blueprint: compose
- plan_step: 4
- quiz: k4
- question: A check has a walk-through, but its answer says twice, and the scene it names never does. What does the build do?
- question_more: The check has its walk-through. Its right answer says twice; the scene it names as showing the answer never says twice.
- option_a: It warns: the answer was not shown
- option_b: It fails the build
- option_c: Nothing: the check passes quietly
- option_a_more: The build goes on, and prints a line saying the answer was not shown.
- option_b_more: The build stops at the check, as it does for a missing walk-through.
- option_c_more: The build says nothing about this check.
- answer: a
- explain: A check with no walk-through fails the build; an answer whose words its scene never says is only a warning.
- option_a_why: Only a missing walk-through fails; an answer whose words the scene never says is a warning.
- option_b_why: The build fails only a check with no walk-through, and this one has one.
- option_c_why: The build reads the answer's words against the scene, and warns when one is never said.
- walk_me_through: The check has its walk-through, so nothing fails. Its right answer says twice, and the scene it names never says twice, so the answer was not shown there. The build prints a warning about it, and goes on.
- explained_at: 18
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: an answer never shown.
keyMessage: Quick check.

## Frame 22 — The code check: two gaps in the steps

- chapter_start: What the code check found
- scene: ROWS: kicker 'The code check · 2 gaps'; row 'Step 1 · a step, Finish, the decision log' with 'fixed' on 'system'; the chip '3 glossary rows added' outlined coral on 'three' (each defined by a scene that already said the word, so nothing was voiced again); row 'Step 3 · words you already know' with 'fixed' on 'skill' (the one coral)
- voiceover: "Chapter six: the code check. A second agent, which had not seen the build, checked it against the plan and found two gaps. The system video had no scene for a step or Finish, and the decision log had no glossary row: all three have one now. And the skill now drops an explanation you already know."
- duration: 16.896s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-code-1.html
- type: benefit_highlight
- beat: Focus
- blueprint: compose
- focal: two gaps, both fixed; nothing voiced again
- sfx: none

narrativeRole: The code check: two gaps in the steps.
keyMessage: Chapter six:

## Frame 23 — The code check: plain words, approvals, and three more

- scene: ROWS: kicker 'The code check · answered'; five rows on their words: 'Plain words · 3 scenes of the system video' fixed; 'Approving with checks missed · both ways' fixed; 'Card rules · the player's work' not this plan's; 'A scene never says its word → fails, names it' fixed, outlined coral (the one coral); 'Which video explains each word' rebuilt
- voiceover: "It found your plain-words decision broken in three system-video scenes: fixed. Memory counted one way of approving; now both. Outside the steps: the card rules are the player's work, and a scene that explains a word but never says it now fails the build, and names the scene."
- duration: 15.637s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-code-2.html
- type: benefit_highlight
- beat: Focus
- blueprint: compose
- focal: every finding answered; a scene that never says its word now fails
- sfx: none

narrativeRole: The code check: plain words, approvals, and three more.
keyMessage: It found your plain-words decision broken in three system-video scenes:

## Frame 24 — Quick check: a scene that never says its word

- scene: QUESTION + THREE OPTIONS: kicker 'Quick check · The code check'; the heading (data-question) 'Marked for Finish, never says it.'; three option cards (data-option a–c); nothing marked
- voiceover: "Quick check. A system-video scene is marked as explaining Finish, but never says it. What does its build do now?"
- duration: 6.016s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-quiz-k5.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k5
- question: A scene of the system video is marked as explaining Finish, but it never says Finish. What does its build do now?
- question_more: The scene carries the mark that says it explains Finish, but neither its voice nor its frame says the word.
- option_a: It fails, and names the scene
- option_b: It warns, and builds
- option_c: Nothing: the mark is enough
- option_a_more: The build stops, and says which scene never says its word.
- option_b_more: The build finishes, with a line about the scene.
- option_c_more: The mark alone counts as explaining the word.
- answer: a
- explain: A scene that explains a word must say it; since the code check, one that never does fails the build and names the scene.
- option_a_why: Since the code check, a scene that explains a word must say it; one that never does fails the build, by name.
- option_b_why: That is how it worked before the code check: it only warned.
- option_c_why: The promise is that the word is explained in that scene, so the scene has to say it.
- walk_me_through: The scene is marked as explaining Finish, but its voice and frame never say Finish. The code check found that this only warned. Now it fails the system video's build, and names the scene, until the scene says the word.
- explained_at: 23
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a scene that never says its word.
keyMessage: Quick check.

## Frame 25 — What ran; flag a step, or accept

- scene: STEPS + WHAT RAN: kicker 'As built · 4 steps, 12 choices'; left the four steps as rows (data-plan-step), each 'done'; right lines on their words: 'every test ✓', 'system video · 7:58', 'not done · older videos'; the ask 'Flag a step, or accept' outlined coral on 'flag' (the one coral); 'AI-generated narration and visuals' small; holds still
- voiceover: "What ran: every test, all passing, and the system video, rebuilt under eight minutes. Not done: older videos still say call and tag until they are rebuilt. The narration and visuals are AI-generated. Flag a step, or accept."
- duration: 16.1s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-end.html
- type: cta
- beat: Focus
- blueprint: compose
- focal: four steps done, what ran, the ask
- sfx: none

narrativeRole: What ran; flag a step, or accept.
keyMessage: What ran:
