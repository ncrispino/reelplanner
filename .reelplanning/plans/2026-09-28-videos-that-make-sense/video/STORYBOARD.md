---
title: "Videos that make sense: fresh eyes before you watch, a way to ask, frames back to basics"
format: 1920x1080
duration: 270s
message: "Five steps, three questions. The phrases that lost the owner were plain words no check could flag (saved review file, drops the video, the real thing), and the frames drew words, not things. Step 1: two fresh agents, a newcomer and a designer, get only what a viewer gets (each scene's narration and a picture of it at rest) and list what they couldn't follow and what reads badly. Step 2: every finding is answered (fixed, a meaning, or kept with the reason), at most three rounds; question 1, what becomes of an unanswered one (recommended: the build stops until it has an answer). Step 3: a flagged phrase gets a meaning you can click; question 2, also Ask about this (recommended). Step 4: seven rules for how a frame reads, step 6 redrawn as the example; frame-lint fails grey bars and a covered thing. Step 5: the loop in the skill; question 3, which videos (recommended: every new one, and the system video now)."
arc: the frame the owner saw, and their words; phrases, not words; why nothing caught it; earlier plans (new viewers); three changes; step 1 fresh eyes; step 2 answered, question 1; a check on step 1; step 3 find out, question 2; a check on step 2; step 4 the rules on the real frame, and the frame redrawn; a check on step 3; step 5 which videos, question 3; checks on steps 4 and 5; the plan
audience: the repo owner, who asked what a saved review file is and how they'd find out, and said the frames don't explain; knows the system video, the review page and the walkthrough
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-28-videos-that-make-sense
terms: fresh eyes = two fresh agents that look at a video before you do, given only what a viewer gets: a newcomer, who lists what it couldn't follow, and a designer, who lists what reads badly on each frame; saved review file = the file the review page writes into the repo when you press Send: your answers, marks and comments (reviews/plan-<time>.json); stand-in = a shape that stands for content instead of showing it: grey lines where words go, an empty box with a label; frame-lint = the check that reads each scene's code for layout mistakes (where things sit, their sizes and colours) without looking at the picture; newcomer.md = the newcomer's findings, one numbered line each (N1, N2 …), kept in the video's folder; designer.md = the designer's findings, the same way (G1, G2 …); glossary = the repo's list of words with what each means (glossary.md), whose "Other words" part holds the trade's words and phrases
terms_check: strict
details_check: strict
before: system#part 2 | twelve parts, two loops, with the plan-to-video skill, the review player, the review server, the reel CLI, the system video
before: system#part 3 | the review page, with the review player
before: 2026-09-26-contributing | decisions D-171, D-200, D-201, D-202, D-213, D-215: how do decision numbers survive two branches?; explains "pull request"
before: 2026-09-27-walkthroughs-that-help | decisions D-221, D-222, D-223, D-219, D-220, D-224: what does Approve make of a choice on the list?; explains "the list"
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-171, D-200, D-201, D-202, D-213, D-215: how do decision numbers survive two branches?; explains "pull request"
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-221, D-222, D-223, D-219, D-220, D-224: what does Approve make of a choice on the list?; explains "the list"
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "the real thing"
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-064, D-065, D-082, D-085: who runs the loop between your reviews?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129, D-128: which words does the viewer see: plain new ones, or…
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-001, D-003: who checks that the code followed the plan?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-109, D-110: what may a miss with no tags stop?
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170: who reviews each arm, and in what order?
recap: 2026-09-22-richer-review | Richer review: more kinds of question, comments on marks…: decision D-005: which video-only feedback comes first?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
---

## Video direction

- THE FRAME YOU SAW LEADS: scene 1 is the real review page at step 6 of the walkthroughs-that-help plan video, as the owner saw it (player tab and caption included); scene 19 pins the rules on it; scene 20 is the same scene redrawn by them.
- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the real frame (1, 19); the real check-terms and frame-lint runs (3); the real pictures of scenes at rest (6). The fresh-eyes files (6, 7), the review page with a meaning and Ask (13) and the redrawn scene (20) are labelled planned; the rest explain with pictures.
- THIS VIDEO FOLLOWS ITS OWN RULES: no stand-ins (every box holds its words); a label on its thing; a question that says what is decided; one focal point a scene.
- MOTION LANGUAGE: things are revealed by their own verb (ringed, typed, printed, drawn, struck, pinned); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; push-slide UP = a question; crossfade = a branch, the redrawn scene, the ending.
- FOUR CHAPTERS: what lost you (1–5, scene 4 for new viewers only); steps 1 and 2 (6–12); steps 3 and 4 (13–21); step 5 and the plan (22–29).
- ONE DETAIL: scene 2's "What lost you", every phrase and frame with the owner's words, opened from the list it explains.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question headings data-question, cards data-option, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice, label. Words this video defines where it first says them: fresh eyes (6), stand-in (19); saved review file has its meaning in the storyboard's terms.
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.

## Frame 1 — Lost on a phrase

- chapter_start: What lost you
- scene: THE REAL FRAME (data-artifact, the review page at step 6 of the walkthroughs-that-help plan video, at rest, as the owner saw it) on the left; on 'you asked' the owner's words on the right, 'saved review file' underlined in coral on its word
- voiceover: "This is step six of the last plan video, as you saw it. You asked: what's a saved review file, and how would I find out? And the frame explains little. This plan makes each video make sense before you see it."
- duration: 11.456s
- transition_in: cut
- status: animated
- src: compositions/frames/01-lost-on-a-phrase.html
- type: hook
- blueprint: compose
- layout: screen
- focal: the frame you saw, and your words
- sfx: none

narrativeRole: Lost on a phrase.
keyMessage: This is step six of the last plan video, as you saw it.

## Frame 2 — Phrases, not words

- scene: TWO COLUMNS: left 'looked up, and understood' with three rows (maintainer · 4 times, tag · 4, pull request · 3), each ticked; right, on 'phrases', 'lost you, never labelled' with four rows, each the phrase and the owner's words under it in small type; on 'click the list' the right list is marked data-detail
- voiceover: "The words with a meaning you could click on the page, you looked up and understood: maintainer, tag, pull request. What lost you were phrases made of plain words: the saved review file, drops the video, the real thing, nothing to predict. None had a meaning to click. Click the list for all of them."
- duration: 15.808s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-phrases-not-words.html
- type: pain_point
- blueprint: compose
- layout: table
- detail: what-lost-you
- detail_title: What lost you
- detail_why: Click the list for every phrase and frame that lost you, with your words and the review each is in.
- detail_kind: evidence
- focal: labelled words were fine; plain phrases were not
- sfx: none

narrativeRole: Phrases, not words.
keyMessage: The words with a meaning you could click on the page, you looked up and understood:

## Frame 3 — Why nothing caught it

- scene: TWO REAL RUNS (data-artifact) on the slab, typed then printed: `node scripts/check-terms.mjs …/walkthroughs-that-help/video` ending '△ terms: 12 words before their definition (warnings)' with '0 with no meaning' pinned; `node scripts/frame-lint.mjs …/30-step-5-did-it-work.html` printing '✓ 30-step-5-did-it-work.html'; on 'the agent' a small line 'the author judged it'
- voiceover: "Nothing we have looks for that. check-terms, the build's word check, looks for acronyms, code and two lists of jargon; on that video it found nothing missing a meaning. frame-lint, the layout check, reads a frame's code, not the picture, so it passed step six. And the agent that wrote the video judged it, knowing what every phrase meant."
- duration: 18.048s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-why-nothing-caught-it.html
- type: pain_point
- blueprint: compose
- layout: terminal
- focal: both checks passed the frame you couldn't read
- sfx: none

narrativeRole: Why nothing caught it.
keyMessage: Nothing we have looks for that.

## Frame 4 — Earlier plans

- knowledge: new
- scene: FOUR ROWS, ONE LINE EACH, landing on their words: close the lifecycle · a second, fresh agent; videos you can follow · plain words; better visuals · the real thing; details in the frame · the Open tab
- voiceover: "Earlier plans lead here. Close the lifecycle added the code check: a second, fresh agent reads the code. Videos you can follow put plain words on screen. Better visuals put the real thing there. Details in the frame put an Open tab on the thing a detail page explains."
- duration: 16.085s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-earlier-plans.html
- type: pain_point
- blueprint: compose
- layout: list
- focal: what this builds on
- sfx: none

narrativeRole: Earlier plans.
keyMessage: Earlier plans lead here.

## Frame 5 — What changes

- scene: THREE ROWS AND A FOURTH, each with its steps on the right: 'fresh eyes before you watch · steps 1, 2'; 'a way to find out · step 3'; 'frames that read · step 4'; 'which videos · step 5', landing on their words
- voiceover: "Three changes. Steps one and two: fresh agents look at each video before you do, and every finding is answered. Step three: a way to find out what a phrase means. Step four: rules for how a frame reads. Step five: which videos get it."
- duration: 13.76s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-what-changes.html
- type: product_intro
- blueprint: compose
- layout: list
- focal: the three changes
- sfx: none

narrativeRole: What changes.
keyMessage: Three changes.

## Frame 6 — Step 1: fresh eyes

- chapter_start: Steps 1 and 2: fresh eyes
- plan_step: 1
- guide: step-1
- defines: fresh eyes
- scene: LEFT: WHAT THEY GET: the real picture of one scene's last moment (scene 10 of the walkthroughs-that-help video, the saved-review-file check), large enough to read, its narration under it, 'each of its 18 scenes, in order'; 'the plan' struck, 'not given', on 'Not the plan'. RIGHT, labelled planned: two short files, newcomer.md (N1 · scene 10 · 'saved review file': which file? what's in it?; N2 · scene 13 · 'drops the video': which video?) and designer.md (G1 · scene 13 · grey lines stand in for 'What changed'), each line landing on its word
- voiceover: "Step one: fresh eyes. Two fresh agents get only what a viewer gets: each scene's narration, in order, and a picture of its last moment, as the review page shows it. Not the plan. One, the newcomer, lists what it couldn't explain: saved review file, which file? The other, the designer, looks at each picture: grey lines stand in for words."
- duration: 18.581s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-1-fresh-eyes.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: only what a viewer gets, and what they found
- sfx: none

narrativeRole: Step 1: fresh eyes.
keyMessage: Step one:

## Frame 7 — Step 2: every finding answered

- plan_step: 2
- guide: step-2
- scene: THE SAME FILE, newcomer.md, labelled planned: each finding gains its answer on its word: N1 'fixed · scene 13 now says which video, and what you get instead'; N2 'meaning · added under Other words'; N3 'kept · scene 14 says it'; then a row of three round chips '1 · 5 found', '2 · 1', '3 · 0'
- voiceover: "Step two: every finding gets an answer. Fixed: the line or the frame changed. A meaning: the phrase stays, and gets one. Or kept, with the reason: the newcomer guessed, but the next scene says it plainly. Then two new agents look again, up to three times, and what's left is said before you watch."
- duration: 15.957s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-step-2-answered.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: each finding, answered
- sfx: none

narrativeRole: Step 2: every finding answered.
keyMessage: Step two:

## Frame 8 — Question 1: a finding nobody answered

- plan_step: 2
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question one. Say the newcomer flags saved review file, and nobody answers. A: the video doesn't reach you until it's fixed, given a meaning, or kept with a reason. B: only a warning; you see it unexplained. C: it must be fixed; a reason isn't enough. I recommend A, like the code check: each finding gets a look, and a wrong one can be kept. What becomes of it?"
- duration: 19.499s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/08-q1-unanswered.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q1
- question: What becomes of a fresh-eyes finding nobody has answered?
- question_more: Say the newcomer flags 'saved review file' in scene 10, and the author has not answered it.
- option_a: Answered before you see it
- option_b: A warning only
- option_c: Fixed, every one
- option_a_more: On every new video the build stops until each finding has an answer: fixed, a meaning added, or kept with the reason. Costs a round or two per video.
- option_b_more: The build prints the finding and goes on. Faster; you may get a video with a known confusion left in it.
- option_c_more: Kept with a reason is not an answer. Costs the most rounds, and a fight when the newcomer is wrong about something the video already says.
- why_a: The build stops until each finding is fixed, given a meaning, or kept with a reason.
- why_b: The build warns and goes on; the page opens with the phrase unexplained.
- why_c: Every finding must be fixed; a reason to keep it is not allowed.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 1: a finding nobody answered.
keyMessage: Question one.

## Frame 9 — If A: answered

- plan_step: 2
- scene: kicker 'If A'; the build's line 'fresh eyes: 3 of 3 answered', then 'review page · open'
- voiceover: "With A, the page opens only once every finding has an answer."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-branch-q1-a.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- branch: q1=a
- focal: answered, then open
- sfx: none

narrativeRole: If A: answered.
keyMessage: With A, the page opens only once every finding has an answer.

## Frame 10 — If B: a warning

- plan_step: 2
- scene: kicker 'If B'; the build's line 'fresh eyes: N1 has no answer (warning)', then 'review page · open'
- voiceover: "With B, the build warns, and the video reaches you with the finding open."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-branch-q1-b.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- branch: q1=b
- focal: open anyway
- sfx: none

narrativeRole: If B: a warning.
keyMessage: With B, the build warns, and the video reaches you with the finding open.

## Frame 11 — If C: fixed

- plan_step: 2
- scene: kicker 'If C'; 'N3 · kept · scene 14 says it' struck; 'rewrite scene 13' under it
- voiceover: "With C, a finding the newcomer got wrong still has to be rewritten."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-branch-q1-c.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- branch: q1=c
- focal: no keeping
- sfx: none

narrativeRole: If C: fixed.
keyMessage: With C, a finding the newcomer got wrong still has to be rewritten.

## Frame 12 — Quick check: the plan says it

- plan_step: 1
- scene: THE CASE FROZEN BEHIND, dimmed: a plan line and a scene line; the heading and three cards land, still
- voiceover: "Quick check. A plan says what the bar means, but its video never does. Does the newcomer flag the bar?"
- duration: 5.483s
- transition_in: cut
- status: animated
- src: compositions/frames/12-qc-the-plan-says-it.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: A plan says what 'the bar' means, but its video never does. Does the newcomer flag 'the bar'?
- option_a: No: the plan explains it
- option_b: Yes: it never gets the plan
- option_c: Only if a later video says it
- answer: b
- explain: The newcomer gets only what a viewer gets: the narration, the pictures and the glossary, never the plan.
- walk_me_through: The newcomer gets each scene's narration, a picture of it at rest, and the glossary: nothing else. The plan says what the bar means, but the newcomer never reads the plan. The video never says it, so the newcomer flags it.
- option_a_why: The newcomer never reads the plan, so the plan's words don't help it.
- option_b_why: Right: it has only what a viewer has, and the video never says it.
- option_c_why: The newcomer reads this video only, as you would.
- explained_at: 6
- focal: three predictions
- sfx: none

narrativeRole: Quick check: the plan says it.
keyMessage: Quick check.

## Frame 13 — Step 3: a way to find out

- chapter_start: Steps 3 and 4: find out, and frames that read
- plan_step: 3
- guide: step-3
- scene: A MOCK OF THE REVIEW PAGE, labelled planned: a caption line with 'saved review file' underlined; on 'saved review' its meaning card opens under it; on 'ask about anything' an 'Ask about this' box, the question typed 'what does drops the video mean?'; on 'Claude answers' the answer lines and 'from: the plan, step 6'; on 'your machine' a small line 'no session waiting · sent with your review'
- voiceover: "Step three: a way to find out. Each phrase the newcomer flags gets a meaning, underlined, so you can click it: a saved review is the file the page writes into your repo when you press Send. And you can ask about anything. Online, Claude answers from the plan and the scene, and says where from. On your own machine, the agent answers if it's running and watching the page; if not, the question goes with your review."
- duration: 21.355s
- transition_in: cut
- status: animated
- src: compositions/frames/13-step-3-find-out.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: a meaning to click, and a way to ask
- sfx: none

narrativeRole: Step 3: a way to find out.
keyMessage: Step three:

## Frame 14 — Question 2: how you find out

- plan_step: 3
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question two. You're paused, and a phrase means nothing to you. A: it's underlined only if the newcomer flagged it. B: that, and you can ask about anything; each question is a request to Claude. C: that, plus one plain sentence a scene, to write and keep true. I recommend B: A covers what the check found, and asking covers what it missed. How do you find out?"
- duration: 19.029s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/14-q2-find-out.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q2
- question: How do you find out what a phrase means?
- question_more: You're paused on a scene, and 'saved review file' means nothing to you.
- option_a: Meanings for flagged phrases
- option_b: Those, and Ask about this
- option_c: Those, and a plain line a scene
- option_a_more: Nothing new in the player: a flagged phrase is underlined and a click shows its meaning. A phrase the newcomer missed has nowhere to go.
- option_b_more: On the page published online Claude answers in seconds, saying where the answer came from; on your own machine the agent answers if it's waiting, or the question goes with your review. Each question is a request to Claude.
- option_c_more: Each scene also carries one plain sentence, written with it and kept true when it changes. It mostly repeats the narration.
- why_a: A phrase the newcomer flagged gets a meaning you can click; any other stays a dead end.
- why_b: Also: type a question on any scene and get an answer from the plan and the scene.
- why_c: Also: one plain sentence for every scene, which you can open.
- recommended: b
- focal: three options, B recommended
- sfx: none

narrativeRole: Question 2: how you find out.
keyMessage: Question two.

## Frame 15 — If A: flagged only

- plan_step: 3
- scene: kicker 'If A'; a caption with 'saved review file' underlined and 'the bar' plain beside it, 'no meaning' under it
- voiceover: "With A, a phrase the newcomer missed is still a dead end."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-branch-q2-a.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=a
- focal: only what was flagged
- sfx: none

narrativeRole: If A: flagged only.
keyMessage: With A, a phrase the newcomer missed is still a dead end.

## Frame 16 — If B: ask

- plan_step: 3
- scene: kicker 'If B'; the Ask about this box with a question and its answer, 'from: the plan, step 6'
- voiceover: "With B, you ask, and the answer says where it came from."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-branch-q2-b.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=b
- focal: ask anything
- sfx: none

narrativeRole: If B: ask.
keyMessage: With B, you ask, and the answer says where it came from.

## Frame 17 — If C: a plain line

- plan_step: 3
- scene: kicker 'If C'; under a scene, 'In plain words' and its one sentence
- voiceover: "With C, each scene also has one plain sentence you can open."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-branch-q2-c.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=c
- focal: a sentence a scene
- sfx: none

narrativeRole: If C: a plain line.
keyMessage: With C, each scene also has one plain sentence you can open.

## Frame 18 — Quick check: a later scene says it

- plan_step: 2
- scene: THE CASE FROZEN BEHIND, dimmed: a finding line; the heading and three cards land, still
- voiceover: "Quick check. The newcomer flags the list in scene four, and scene five says what it is. With the recommendation, what's the least the author does before you watch?"
- duration: 8.789s
- transition_in: cut
- status: animated
- src: compositions/frames/18-qc-a-later-scene.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: The newcomer flags 'the list' in scene 4, and scene 5 says what it is. With the recommendation, what's the least the author does before you watch?
- option_a: Nothing: scene 5 explains it
- option_b: Answer it: kept, with that reason
- option_c: Rewrite scene 4
- answer: b
- explain: Every finding needs an answer before the page opens, and keeping it with the reason is one.
- walk_me_through: With the recommendation, the build stops while any finding has no answer. Here scene five already explains the list. So the author keeps it, and writes that reason beside it. That is an answer, and the page opens.
- option_a_why: Nothing is not an answer: the build stops until there is one.
- option_b_why: Right: kept, with the reason, is an answer, and the page opens.
- option_c_why: It may help, but it isn't needed: a reason to keep it is enough.
- explained_at: 7
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a later scene says it.
keyMessage: Quick check.

## Frame 19 — Step 4: seven rules

- plan_step: 4
- guide: step-4
- defines: stand-in
- scene: THE REAL FRAME (data-artifact, as the owner saw it), large; on each problem a pinned label lands on its thing: 'stand-in' on the grey lines, 'floats' on the stays chips, 'approve what?' on the chip, 'covered' on the tab
- voiceover: "Step four: seven rules for how a frame reads. Here's step six against them. Grey lines stand in for words. The words stays and nothing changes float apart from the thing each is about; a label should sit on its thing. You approve, or not: approve what? And the Open tab sits on the status line."
- duration: 16.789s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/19-step-4-seven-rules.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: the frame, against the rules
- sfx: none

narrativeRole: Step 4: seven rules.
keyMessage: Step four:

## Frame 20 — Step 4: the same scene, redrawn

- plan_step: 4
- scene: THE SCENE REDRAWN, labelled planned: the status line with room above it for the tab; the question 'Next plan: drop the walkthrough video after each build?'; under it two answers: 'Approve' with the plan's row under it (Plan video · stays, Code check · stays, What changed: 'Save moved to the top' Flag, 'Reviews stored one file a day' Flag), and 'If you ask for changes, or don't answer · nothing changes: the walkthrough video stays as it is'
- voiceover: "The same scene, redrawn. The question says what you'd decide: drop the walkthrough video? Each answer sits under it. What changed shows its real lines. What stays sits on the row it stays in. The tab has room. frame-lint will catch grey bars and anything covered; the designer checks the rest."
- duration: 16.555s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-step-4-redrawn.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the same scene, read in one pass
- sfx: none

narrativeRole: Step 4: the same scene, redrawn.
keyMessage: The same scene, redrawn.

## Frame 21 — Quick check: asking at home

- plan_step: 3
- scene: THE CASE FROZEN BEHIND, dimmed: the Ask box with the question; the heading and three cards land, still
- voiceover: "Quick check. With the recommendation, you're on your own machine, the agent isn't running, and you ask what a soft target means. What happens?"
- duration: 7.317s
- transition_in: cut
- status: animated
- src: compositions/frames/21-qc-asking-at-home.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: With the recommendation, you're on your own machine, the agent isn't running, and you ask what 'a soft target' means. What happens?
- option_a: Claude answers in seconds
- option_b: It goes with your review
- option_c: Nothing: only online
- answer: b
- explain: On your own machine the agent answers if it's running and watching the page; if not, the question goes with your review.
- walk_me_through: On your own machine, the question goes to the agent, not to Claude on the page. The agent isn't running, so nobody can answer now. The page says so, and the question goes with your review, to be answered in the next version.
- option_a_why: That's the page published online; on your machine it goes to the agent.
- option_b_why: Right: with the agent not running, it goes with your review.
- option_c_why: Your machine can ask too: the question goes to the agent.
- explained_at: 13
- focal: three predictions
- sfx: none

narrativeRole: Quick check: asking at home.
keyMessage: Quick check.

## Frame 22 — Step 5: which videos

- chapter_start: Step 5, and the plan
- plan_step: 5
- guide: step-5
- scene: TOP: THE LOOP, five chips joined by drawn lines: build it · fresh eyes · answer · build again · open the page. BELOW, on 'question three': the system video's card (reelplanning: the whole system · 35 scenes · 7:59); on 'twenty-six' the count, 26 videos on the review page; on 'an older one' an older plan video's card (Better visuals), and on 'rebuilt' a 'rebuilt · fresh eyes' chip on it
- voiceover: "Step five: making a video gets a loop: build it, fresh eyes, answer, build again, then open the page. Which videos get it is question three. There are twenty-six on the review page. An older one not checked now gets fresh eyes the next time it's rebuilt."
- duration: 14.229s
- transition_in: cut
- status: animated
- src: compositions/frames/22-step-5-which-videos.html
- type: feature_showcase
- blueprint: compose
- layout: wall
- focal: the loop, and the videos we have
- sfx: none

narrativeRole: Step 5: which videos.
keyMessage: Step five:

## Frame 23 — Question 3: which videos

- plan_step: 5
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question three. A: every new video, and the system video checked now. B: new plan videos only, the cheapest. C: every new video, and all twenty-six now, rebuilt wherever a finding is fixed. I recommend A: the system video is where a newcomer starts, and older plan videos are already decided. Which videos get fresh eyes?"
- duration: 18.901s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/23-q3-which-videos.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q3
- question: Which videos get fresh eyes?
- option_a: Every new one, and the system video now
- option_b: New plan videos only
- option_c: Every new one, and all 26 now
- option_a_more: Two agent runs a round for each new video, plus the system video now: the first one a newcomer watches, rebuilt where a finding is fixed.
- option_b_more: The cheapest: walkthrough videos and the system video are not checked.
- option_c_more: About 26 checks now, and rebuilds for videos you have already reviewed.
- why_a: Plan, walkthrough and system videos from now on; the system video is checked now and fixed.
- why_b: Only where you decide; walkthroughs and the system video keep what they have.
- why_c: Every video on the review page is checked now, and rebuilt wherever a finding is fixed.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 3: which videos.
keyMessage: Question three.

## Frame 24 — If A: the system video now

- plan_step: 5
- scene: kicker 'If A'; the system video's card 'checked now'; the older plan video's card 'when it is next rebuilt'
- voiceover: "With A, the system video is checked now, and fixed where it's unclear."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-branch-q3-a.html
- type: benefit_highlight
- blueprint: compose
- layout: wall
- branch: q3=a
- focal: system video now
- sfx: none

narrativeRole: If A: the system video now.
keyMessage: With A, the system video is checked now, and fixed where it's unclear.

## Frame 25 — If B: plan videos

- plan_step: 5
- scene: kicker 'If B'; the system video's card 'not checked'; the older plan video's card 'when it is next rebuilt'
- voiceover: "With B, walkthroughs and the system video keep what they have."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-branch-q3-b.html
- type: benefit_highlight
- blueprint: compose
- layout: wall
- branch: q3=b
- focal: plan videos only
- sfx: none

narrativeRole: If B: plan videos.
keyMessage: With B, walkthroughs and the system video keep what they have.

## Frame 26 — If C: all of them

- plan_step: 5
- scene: kicker 'If C'; both cards 'checked now', the older one 'rebuilt if fixed'
- voiceover: "With C, all twenty-six are checked now, and the ones with fixes rebuilt."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-branch-q3-c.html
- type: benefit_highlight
- blueprint: compose
- layout: wall
- branch: q3=c
- focal: every video now
- sfx: none

narrativeRole: If C: all of them.
keyMessage: With C, all twenty-six are checked now, and the ones with fixes rebuilt.

## Frame 27 — Quick check: chips on the right

- plan_step: 4
- scene: THE CASE FROZEN BEHIND, dimmed: two file names on the left, two chips far to the right; the heading and three cards land, still
- voiceover: "Quick check. A frame lists two files on the left, and far to the right a column of chips: kept, and removed. Which rule does it break?"
- duration: 7.381s
- transition_in: cut
- status: animated
- src: compositions/frames/27-qc-chips-on-the-right.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: A frame lists two files on the left and, far to the right, a column of chips: 'kept' and 'removed'. Which rule does it break?
- option_a: One reading order
- option_b: A label sits on its thing
- option_c: Show the thing, not a stand-in
- answer: b
- explain: Each chip says something about one file, so it belongs on that file's row, not in a column of its own.
- walk_me_through: Kept and removed each say something about one file. Far to the right, you have to match them to the files by counting rows. On each file's own row, you read it in one pass. So the chips break the rule that a label sits on what it labels.
- option_a_why: The order is fine: files, then what happened to them. The chips are just far from their files.
- option_b_why: Right: each chip is about one file and belongs on its row.
- option_c_why: Nothing stands in for content here: the files and chips are real words.
- explained_at: 19
- focal: three predictions
- sfx: none

narrativeRole: Quick check: chips on the right.
keyMessage: Quick check.

## Frame 28 — Quick check: last week's video

- plan_step: 5
- scene: THE CASE FROZEN BEHIND, dimmed: one older tile, 'revised'; the heading and three cards land, still
- voiceover: "Quick check. With the recommendation, you revise last week's plan video, which was never checked. Does the rebuild get fresh eyes?"
- duration: 7.061s
- transition_in: cut
- status: animated
- src: compositions/frames/28-qc-last-weeks-video.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: With the recommendation, you revise last week's plan video, which was never checked. Does the rebuild get fresh eyes?
- option_a: No: it's an older video
- option_b: Yes: a rebuild is a new build
- option_c: Only if you ask for it
- answer: b
- explain: An older video not checked now gets fresh eyes the next time it is rebuilt.
- walk_me_through: With the recommendation, every video built from now on gets fresh eyes. Revising last week's video rebuilds it. So that rebuild gets fresh eyes, even though the old version never did.
- option_a_why: Its age doesn't matter: the rebuild is a new build, and gets it.
- option_b_why: Right: every build from now on gets fresh eyes, a rebuild included.
- option_c_why: Nothing to ask for: every build from now on gets it.
- explained_at: 22
- focal: three predictions
- sfx: none

narrativeRole: Quick check: last week's video.
keyMessage: Quick check.

## Frame 29 — The plan

- guide: decisions
- scene: THE FIVE STEPS, still, each with its question's slot where it has one: 1 'fresh eyes'; 2 'every finding answered' (question 1); 3 'a way to find out' (question 2); 4 'frames that read'; 5 'which videos' (question 3); 'draw a note · approve'. Holds still.
- voiceover: "That's the plan: fresh eyes before you watch, every finding answered, a way to find out, frames that read, and which videos get it. Draw on any step to leave a note, or approve."
- duration: 12.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- plan_questions: 1, 2, 3
- focal: the five steps, and your answers
- sfx: none

narrativeRole: The plan.
keyMessage: That's the plan:
