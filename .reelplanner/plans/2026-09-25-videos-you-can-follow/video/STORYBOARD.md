---
title: "Videos you can follow"
format: 1920x1080
duration: 235s
message: "Four steps so a video never loses you: every word explained once in the system video and one click away (step 1; question 1, plain words on screen or today's words explained, recommend plain words), the tool picks what to watch first (step 2; question 2, where 'watched' is kept, recommend this browser and your file), memory keeps where you got lost (step 3; question 3, can approving be blocked, recommend never, it is recorded), and quick checks test the main idea on the case just shown (step 4)."
arc: the last plan approved with 3 of 3 quick checks wrong, and the four words its check never explained, each explained here; what is built separately (not asked); the four steps, each with its quick check, three questions after their steps; the resolved plan
audience: the repo owner, who got lost in the last video; assumes only the system video
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-25-videos-you-can-follow
before: system | what a plan, a review and the decision log are
terms: quick check, call, tag, streak, miss, prerequisite, system video, glossary, beat, memory
terms_check: strict
---

## Video direction

- PRACTISE WHAT IT PREACHES: this video is the test of its own plan. Every word a newcomer would trip on is explained, in plain words, the first time it is said, with a small definition card on screen (`- defines:` on that beat; the front matter's `terms:` lists them): quick check (frame 1), call and tag (2), streak and miss (3), prerequisite (4), glossary and beat (6), memory (16). No id is said or shown: decisions are named by what they decided, plans by what they are ("the last plan", "the revise-loop plan"). One number for each thing (3 of 3 checks, the streak of ten, eight pauses).
- PREREQUISITE: `before: system`, for what a plan, a review and the decision log are. Nothing else is assumed.
- EACH QUICK CHECK tests its step beat's main idea on the exact case that beat just showed (streak with no beat; the last plan's card; streak looked up three times; eight pauses becoming one), with no new facts, a `- walk_me_through:` of two to four sentences on that case, and `- explained_at:` naming the step beat.
- FIVE CHAPTERS, no separate openers (the step beats carry `chapter_start` and say their step number): why you got lost (1–3); what is built and what this plan adds (4–5); step 1 with question 1 (6–10); step 2 with question 2 (11–15); steps 3 and 4 with question 3 and the resolved plan (16–23).
- WHAT TO DRAW (style guide §5): nothing here moves data between parts, so no node graph. Each beat draws the thing it is about: the check itself with its unexplained words underlined (1–3), the card before a video (4, 11), the glossary with a beat per word (6), memory's lost line (16), a beat's eight pauses becoming one (21).
- A spine of four ticks (steps 1–4), the live one coral, on step, check, question and branch beats; the overview, branches and ending show the four steps as rows (`data-plan-step`).
- THE ANSWER BAR: every frame's root carries `data-band="bottom"` and keeps its lowest eighth (y ≥ 945) empty; nothing sits below y 880 but the captions. Option cards carry `data-option` (decision cards also `data-plan-option`).
- Names from `glossary.md` (the system video, a quick check, a call, a miss, memory); the look from `.reelplanning/theme/frame.md`. No details.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word; the last frame holds still.

## Frame 1 — Three wrong, and approved

- chapter_start: Why you got lost
- defines: quick check
- scene: NO SPINE: kicker 'The last plan · 3 quick checks'; three chips 'Check 1 ✗' 'Check 2 ✗' 'Check 3 ✗' on 'three', the chip 'Approved' on 'approved'; the definition card 'quick check · a question on what the plan will do' on 'question'; the second check word for word on 'second'; its four unexplained words underlined coral and the chip '4 words, never explained' outlined coral on 'never' (the one coral)
- voiceover: "You approved the last plan with all three quick checks wrong. A quick check is the video's question on what the plan will do. The second one used four words the video never explained."
- duration: 10.048s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- beat: Focus
- blueprint: compose
- focal: the check that could not be read, and its four words
- sfx: none

narrativeRole: Three wrong, and approved.
keyMessage: You approved the last plan with all three quick checks wrong.

## Frame 2 — Two of the words: call and tag

- defines: call, tag
- scene: The check small at the top with 'call' and 'tagged' underlined coral (the one coral); two definition cards: 'call · a choice the agent makes on its own, outside the plan' on 'call', 'tag · why you might look at a call' on 'tag'; under the tag card the three tags 'visible', 'hard to undo', 'close' each on its word, and 'close = could go either way' on 'either'
- voiceover: "A call is a choice the agent makes on its own, outside the plan. A tag says why you might look at a call: visible, hard to undo, or close, meaning either way is reasonable."
- duration: 10.219s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-call-tag.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: call and tag, each with its meaning
- sfx: none

narrativeRole: Two of the words: call and tag.
keyMessage: A call is a choice the agent makes on its own, outside the plan.

## Frame 3 — The other two: streak and miss

- defines: streak, miss
- scene: The check small at the top with 'ten times running' and 'miss' underlined; definition cards 'streak · calls with one tag, accepted in a row' with ten ticks landing on 'ten' and '10 in a row → no pause' on 'pausing', and 'miss · something a review let through, fixed later' on 'miss'; the chip 'can't be read' outlined coral on 'read' (the one coral)
- voiceover: "A streak counts calls with one tag accepted in a row; at ten, they stop pausing the video. A miss is something a review let through, fixed later. Without them, the check can't be read."
- duration: 10.261s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-streak-miss.html
- type: pain_point
- beat: Focus
- blueprint: compose
- focal: streak and miss, each with its meaning
- sfx: none

narrativeRole: The other two: streak and miss.
keyMessage: A streak counts calls with one tag accepted in a row; at ten, they stop pausing the video.

## Frame 4 — Built separately, not asked here

- chapter_start: What is built, and what this plan adds
- defines: prerequisite, system video
- scene: LEFT: a mock of the card before a video ('Watch first' · 'The system video' · 'what a plan, a review and the decision log are') on 'card'; the definition card 'prerequisite · a video to watch first' on 'prerequisites'. RIGHT: six rows, each on its words: 'A card: watch first', 'A panel of the words', 'No number alone', 'Walk me through it', 'Missed checks noted', 'Unexplained words flagged'; the chip 'not asked here' outlined coral on 'asked' (the one coral)
- voiceover: "Some fixes are built separately, not asked here. A card before each video lists its prerequisites, the videos to watch first; by default, the system video, which explains the whole tool. A panel lists the video's words. No decision is named by its number alone. A wrong answer can be walked through. Approving notes missed checks. The build flags unexplained words."
- duration: 20.331s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-built.html
- type: product_intro
- beat: Focus
- blueprint: compose
- focal: the six basics, built separately
- sfx: none

narrativeRole: Built separately, not asked here.
keyMessage: Some fixes are built separately, not asked here.

## Frame 5 — What this plan adds: four steps

- scene: LIST: kicker 'This plan · 4 steps'; the four steps as rows, each on its number word; right, the chip '2 needs 1' outlined coral on 'needs' (the one coral) and the grey chip '3 and 4 stand alone' on 'alone'
- voiceover: "Four steps go deeper. One: every word explained once, one click away. Two: the tool picks what to watch first. Three: it remembers where you got lost. Four: checks test the main idea. Step two needs step one; three and four stand alone."
- duration: 14.165s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-overview.html
- type: product_intro
- beat: Focus
- blueprint: compose
- focal: the four steps, and which needs which
- sfx: none

narrativeRole: What this plan adds: four steps.
keyMessage: Four steps go deeper.

## Frame 6 — Step 1: every word explained once, one click away

- chapter_start: Step 1: every word explained once
- plan_step: 1
- defines: glossary, beat
- scene: SPINE + GLOSSARY: kicker 'Step 1 · Every word explained once'; a glossary mock with rows call, tag, miss, streak on 'glossary', '✓ beat' marks on 'explains', streak's '✗ no beat' on 'streak'; definition cards 'glossary · the repo's words, one meaning each' and 'beat · one short scene of a video'; the build window '✗ streak has no beat' outlined coral on 'name' (the one coral); a caption mock with 'streak' underlined and its meaning popping over it on 'clicking'
- voiceover: "Step one. The glossary is the repo's list of words, one meaning each. Each gets a beat of the system video that explains it; a beat is one short scene. No beat explains a streak yet, so the system video's build stops and names it. And clicking a word in the captions shows its meaning."
- duration: 15.595s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-step-1.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: the glossary as a promise the system video keeps, and a word in the captions that opens
- sfx: none

narrativeRole: Step 1: every word explained once, one click away.
keyMessage: Step one.

## Frame 7 — Quick check: a word with no beat

- plan_step: 1
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 1'; the question 'Streak: a glossary row, no beat.'; three option cards (data-option a–c) landing on 'built'; nothing marked (the player asks, then shows the answer)
- voiceover: "Quick check. The glossary has streak, and no beat of the system video explains it. What happens when the system video is built?"
- duration: 6.549s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-quiz-k1.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k1
- question: The glossary has a row for streak, and no beat of the system video explains it. What happens when the system video is built?
- option_a: It stops, and names streak
- option_b: It builds, with a warning
- option_c: It builds; plan videos explain it
- answer: a
- explain: Step one makes the system video explain every glossary word, so a word with no beat stops its build, and the build names the word.
- walk_me_through: The glossary has a row for streak. After step one, building the system video checks each glossary row for a beat that explains it. Streak has none, so the build stops and says streak has no beat. Adding a beat that explains a streak lets it pass.
- explained_at: 6
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a word with no beat.
keyMessage: Quick check.

## Frame 8 — Question 1: which words you see

- plan_step: 1
- scene: SPINE + TWO OPTION CARDS: kicker 'Question 1 · Step 1'; the question; card A 'Plain words on screen' with 'call → choice', 'tag → label', 'streak → in a row' and the cost 'files keep theirs'; card B 'Today's words, explained' with 'call · tag · streak' and 'one name everywhere'; each on its words; on 'recommend' A's border turns coral and 'recommended' lands under it (the one coral)
- voiceover: "Question one: which words should you see? A: plain ones, like choice for call and label for tag; the files keep theirs. B: today's words, each explained. I recommend A: a word that says what it means needs no explaining. Which one?"
- duration: 13.227s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-decision-q1.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q1
- question: Which words does the viewer see: plain new ones, or today's, explained?
- option_a: Plain words on screen
- option_b: Today's words, explained
- why_a: What you see and hear says choice (not call), label (not tag), accepted in a row (not streak), late fix (not miss), chapter (not part) and scene (not beat); files, commands and the decision log keep today's names, and the glossary lists both. Costs two names for each thing.
- why_b: One name everywhere; the explanation card, the words panel and step one's click do the work, in every video, for every new viewer.
- recommended: a
- focal: the two options, A recommended
- sfx: none

narrativeRole: Question 1: which words you see.
keyMessage: Question one:

## Frame 9 — If A: plain words on screen

- plan_step: 1
- scene: RAIL, the plan under A: kicker 'If A · Plain words'; the four steps as rows; step 1's tag 'Plain words' outlined coral (the one coral); chips 'you see: choice, label' and 'files: call, tag' on their words
- voiceover: "With A, you see choice and label; the files still say call and tag."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-branch-q1-a.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=a
- focal: step 1 under this option
- sfx: none

narrativeRole: If A: plain words on screen.
keyMessage: With A, you see choice and label; the files still say call and tag.

## Frame 10 — If B: today's words, explained

- plan_step: 1
- scene: RAIL, the plan under B: kicker 'If B · Today's words'; the four steps as rows; step 1's tag 'Today's words' outlined coral (the one coral); chips 'you see: call, tag' and 'each one explained' on their words
- voiceover: "With B, you see call and tag, and each is explained."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-branch-q1-b.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q1=b
- focal: step 1 under this option
- sfx: none

narrativeRole: If B: today's words, explained.
keyMessage: With B, you see call and tag, and each is explained.

## Frame 11 — Step 2: the tool picks what to watch first

- chapter_start: Step 2: what to watch first
- plan_step: 2
- scene: SPINE + PICK: kicker 'Step 2 · What to watch first'; grey chip 'today: guessed by the writer' on 'guessed'; the card 'The last plan · builds on: the streak of ten' on 'last', an arrow, and 'The revise-loop plan · decided the streak of ten' on 'decided'; right, the card 'Watch first' with '1 The system video' on 'system' and '2 The revise-loop video' outlined coral on 'then' (the one coral); the grey chip 'up to 2 besides the system video' on 'two'
- voiceover: "Step two. Today, prerequisites are guessed; now the tool picks them: the system video, plus up to two videos of plans this one builds on. The last plan builds on the streak of ten, decided in the revise-loop plan, so its card lists the system video, then the revise-loop video."
- duration: 15.936s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-step-2.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: the card the tool fills, from what the plan builds on
- sfx: none

narrativeRole: Step 2: the tool picks what to watch first.
keyMessage: Step two.

## Frame 12 — Quick check: what the last plan's card lists

- plan_step: 2
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 2'; the question 'The last plan builds on the streak of ten.'; three option cards (data-option a–c) landing on 'list'; nothing marked
- voiceover: "Quick check. The last plan builds on the streak of ten, decided in the revise-loop plan. Which videos does its card list?"
- duration: 6.891s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-quiz-k2.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k2
- question: The last plan builds on the streak of ten, decided in the revise-loop plan. Which videos does its card list?
- option_a: Only the system video
- option_b: The system video, then the revise-loop video
- option_c: Every earlier plan's video
- answer: b
- explain: The card lists the system video, then the video of each plan whose decisions this one builds on: here, the revise-loop plan, where the streak of ten was decided.
- walk_me_through: The tool starts with the system video. Then it asks what the plan builds on: the last plan builds on the streak of ten, which was decided in the revise-loop plan. So the card lists two videos: the system video, then the revise-loop video. Plans it doesn't build on stay off the card.
- explained_at: 11
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: what the last plan's card lists.
keyMessage: Quick check.

## Frame 13 — Question 2: where "watched" is kept

- plan_step: 2
- scene: SPINE + TWO OPTION CARDS: kicker 'Question 2 · Step 2'; the question; card A 'This browser, and your file' ('ticked at once; every repo'), card B 'Only reviews you send' ('counts once sent'), each on its words; on 'recommend' A's border turns coral and 'recommended' lands under it (the one coral)
- voiceover: "Question two: the card ticks what you've watched. Where is that kept? A: this browser at once, and your own file, read by every repo, once you send a review. B: only the reviews you send. I recommend A: the card needs it at once, the tool in every repo. Which one?"
- duration: 15.04s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-decision-q2.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q2
- question: Where is "you watched it" kept?
- option_a: This browser, and your file
- option_b: Only reviews you send
- why_a: The page ticks a video off the moment you finish it; when you send a review, your file across repos records it too, so any repo's tool can read it.
- why_b: A review already records how much you watched; a video you finish without sending a review counts as not watched.
- recommended: a
- focal: the two options, A recommended
- sfx: none

narrativeRole: Question 2: where "watched" is kept.
keyMessage: Question two:

## Frame 14 — If A: this browser, and your file

- plan_step: 2
- scene: RAIL, the plan under A: kicker 'If A · Browser and file'; the four steps as rows; step 2's tag 'Browser and file' outlined coral (the one coral); chips 'ticked at once' and 'every repo, once sent' on their words
- voiceover: "With A, a finished video is ticked at once, and in every repo once sent."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-branch-q2-a.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q2=a
- focal: step 2 under this option
- sfx: none

narrativeRole: If A: this browser, and your file.
keyMessage: With A, a finished video is ticked at once, and in every repo once sent.

## Frame 15 — If B: only reviews you send

- plan_step: 2
- scene: RAIL, the plan under B: kicker 'If B · Reviews only'; the four steps as rows; step 2's tag 'Reviews only' outlined coral (the one coral); chips 'watched = review sent' and 'finished, not sent: not watched' on their words
- voiceover: "With B, a video counts as watched once you send its review."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-branch-q2-b.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q2=b
- focal: step 2 under this option
- sfx: none

narrativeRole: If B: only reviews you send.
keyMessage: With B, a video counts as watched once you send its review.

## Frame 16 — Step 3: the tool remembers where you got lost

- chapter_start: Steps 3 and 4: remember, and check the main idea
- plan_step: 3
- defines: memory
- scene: SPINE + MEMORY: kicker 'Step 3 · The tool remembers'; the definition card 'memory · what the tool learns from your reviews' on 'memory'; the 'lost' line as a window, its four entries each on its words; right, three review chips 'streak looked up' on the second 'three', and the card 'streak's beat · marked for a rewrite' outlined coral on 'rewrite' (the one coral)
- voiceover: "Step three. Memory is what the tool learns from your reviews. It gains a line for getting lost: checks wrong, explanations opened, words looked up, approvals with checks missed. A word looked up in three reviews gets its beat marked for a rewrite."
- duration: 14.293s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-step-3.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: the lost line, and a word looked up three times
- sfx: none

narrativeRole: Step 3: the tool remembers where you got lost.
keyMessage: Step three.

## Frame 17 — Quick check: one word, three reviews

- plan_step: 3
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 3'; the question 'Streak, looked up in 3 reviews.'; three option cards (data-option a–c) landing on 'happens'; nothing marked
- voiceover: "Quick check. You look up streak in three reviews. What happens?"
- duration: 3.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-quiz-k3.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k3
- question: You look up streak in three reviews. What happens?
- option_a: Its beat in the system video is marked for a rewrite
- option_b: Nothing: look-ups aren't kept
- option_c: The word streak is renamed
- answer: a
- explain: Three look-ups of one word, in three reviews, say its explanation isn't working, so memory marks its beat in the system video for a rewrite.
- walk_me_through: Each time you open streak's meaning, memory counts it. One look-up is normal. When streak has been looked up in three reviews, memory says its explanation isn't working and marks its beat in the system video for a rewrite; the word itself stays.
- explained_at: 16
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: one word, three reviews.
keyMessage: Quick check.

## Frame 18 — Question 3: can approving be blocked?

- plan_step: 3
- scene: SPINE + TWO OPTION CARDS: kicker 'Question 3 · Step 3'; the question; card A 'Never; it is recorded' ('approved, 3 of 3 missed'), card B 'Blocked when all are missed' ('until each is explained'), each on its words; on 'recommend' A's border turns coral and 'recommended' lands under it (the one coral)
- voiceover: "Question three: can approving be blocked when you answered checks wrong? A: never; the review records approved with three of three missed. B: blocked when all were missed, until you open each explanation. I recommend A: a record fixes the next video; a block just teaches clicking through. Which one?"
- duration: 15.915s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-decision-q3.html
- type: cta
- beat: Decision
- blueprint: compose
- decision: q3
- question: Can approving ever be blocked when you answered checks wrong?
- option_a: Never; it is recorded
- option_b: Blocked when all are missed
- why_a: Approve works as always; the review says approved with 3 of 3 checks missed, and memory's lost line counts it.
- why_b: When every check was answered wrong, Approve waits until you open each missed check's explanation.
- recommended: a
- focal: the two options, A recommended
- sfx: none

narrativeRole: Question 3: can approving be blocked?.
keyMessage: Question three:

## Frame 19 — If A: never blocked, recorded

- plan_step: 3
- scene: RAIL, the plan under A: kicker 'If A · Never; recorded'; the four steps as rows; step 3's tag 'Never; recorded' outlined coral (the one coral); chips 'Approve always works' and 'the record shows it' on their words
- voiceover: "With A, you can always approve, and the record shows what you missed."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-branch-q3-a.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q3=a
- focal: step 3 under this option
- sfx: none

narrativeRole: If A: never blocked, recorded.
keyMessage: With A, you can always approve, and the record shows what you missed.

## Frame 20 — If B: blocked when all are missed

- plan_step: 3
- scene: RAIL, the plan under B: kicker 'If B · Can block'; the four steps as rows; step 3's tag 'Can block' outlined coral (the one coral); chips '3 of 3 missed' and 'open 3, then approve' on their words
- voiceover: "With B, three of three missed means three explanations before approving."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-branch-q3-b.html
- type: benefit_highlight
- beat: Branch
- blueprint: compose
- branch: q3=b
- focal: step 3 under this option
- sfx: none

narrativeRole: If B: blocked when all are missed.
keyMessage: With B, three of three missed means three explanations before approving.

## Frame 21 — Step 4: quick checks test the main idea

- plan_step: 4
- scene: SPINE + BEFORE/AFTER: kicker 'Step 4 · Checks test the main idea'; three rule chips 'main idea', 'the case shown', 'nothing new' on their words; the beat mock with eight pause marks on 'eight' collapsing to one on 'one'; the card 'Before · an exception said in passing' on 'exception'; the card 'After · 8 calls stop here: how many pauses?' outlined coral on 'those' (the one coral); the build window '△ the answer isn't in its beat' on 'warns'
- voiceover: "Step four. A quick check tests its beat's main idea, on the case the beat just showed, with nothing new. The last plan's first check asked about an exception said in passing; its beat showed eight pauses becoming one. Now the check asks about those eight. The build warns when an answer isn't in its beat."
- duration: 16.661s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-step-4.html
- type: feature_showcase
- beat: Focus
- blueprint: compose
- focal: a check on the case the beat showed
- sfx: none

narrativeRole: Step 4: quick checks test the main idea.
keyMessage: Step four.

## Frame 22 — Quick check: which check follows step 4

- plan_step: 4
- scene: SPINE + QUESTION + THREE OPTIONS: kicker 'Quick check · Step 4'; the question 'A beat: 8 pauses become 1.'; three option cards (data-option a–c) landing on 'follows'; nothing marked
- voiceover: "Quick check. A beat shows eight pauses in one step becoming one. Which check follows step four?"
- duration: 5.291s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-quiz-k4.html
- type: social_proof
- beat: Check
- blueprint: compose
- quiz: k4
- question: A beat shows eight pauses in one step becoming one. Which quick check follows step four?
- option_a: Eight calls stop here: how many pauses?
- option_b: What happens in a case the beat didn't show?
- option_c: Which step made this change?
- answer: a
- explain: It tests the beat's main idea on the beat's own case, eight pauses becoming one, and adds nothing new.
- walk_me_through: The beat showed one thing: eight pauses in a step becoming one. A check that follows step four asks about exactly that case: eight calls stop here, so how many pauses? A case the beat never showed, or which step made the change, tests something else.
- explained_at: 21
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: which check follows step 4.
keyMessage: Quick check.

## Frame 23 — The plan, resolved

- scene: RESOLVED: kicker 'The plan · 4 steps, 3 questions'; the four steps as rows, each with the choice on its slot (the reviewer's pick replaces it), each on its words; right, 'Draw a note, or approve' on 'draw'; the grey chip 'AI-generated narration and visuals' on 'narration'
- voiceover: "That's the plan: every word explained once, prerequisites the tool picks, a memory of where you got lost, and checks on the main idea. Draw on a step to leave a note, or approve. Narration and visuals are AI-generated."
- duration: 15.65s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-resolved.html
- type: cta
- beat: Ending
- blueprint: compose
- plan_questions: 1, 2, 3
- focal: the four steps with their choices
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That's the plan:
