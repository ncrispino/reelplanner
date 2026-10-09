---
title: "Details in the frame: click the thing a detail explains"
format: 1920x1080
duration: 270s
message: "Four steps, three questions. The frame marks the one thing a detail explains with data-detail (a code block, a line, a table row, a pinned word), and frame-lint and the details check hold it: above the lowest eighth, at least 120 by 44, at rest in the scene's last 3 s (step 1); the player lays a clear button over it, as over an answer card, ringed in coral under your pointer or focus, reached by Tab, Enter or O, hidden while a question is asked; what shows it opens is question 1 (step 2); a click pauses the video and opens the page, the thing stays ringed, closing plays on; where the page opens asks decision D-021 again, question 2 (step 3); the corner chip becomes the fallback, older videos keep theirs until rebuilt, the plan text's list stays, question 3 (step 4)."
arc: the real scene 12 of the deep-dives walkthrough, its code in the middle and the way in a chip in the corner; the side panel it opens; the real answer card as the model, with the owner's words; what changes; four earlier plans (new viewers); the marked thing on the real frame, then on a real pinned word; the checks; the button (planned mock); never over the cards; question 1; the click and the way back; question 2, D-021 asked again; the chip, older videos and phones; question 3; the plan with the reviewer's picks
audience: the repo owner, who asked for details to open by a click in the video; knows the system video and the review page
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-27-details-in-the-frame
terms: detail, side panel; frame-lint = the check that reads each scene's page for mistakes without playing it, such as a marked thing in the lowest eighth (`reelplanning frame-lint`)
terms_check: strict
before: system#part 3 | the review page, with the review player, finish-project
before: system#part 6 | the walkthrough, with the review player
before: 2026-09-22-m3-revise-loop | decisions D-083, D-085, D-084, D-064, D-066, D-082: how many quick checks does a video ask?
before: 2026-09-26-better-visuals | decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "the real thing"
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-083, D-085, D-084, D-064, D-066, D-082: how many quick checks does a video ask?
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "the real thing"
recap: 2026-09-26-better-visuals--walkthrough | Better visuals: show the real thing, and a page that reads…: decisions D-179, D-182, D-183, D-172: where coral stays and where it goes: it stays on the…
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decisions D-024, D-023, D-021: how is each detail page made?
recap: 2026-09-23-deep-dives--walkthrough | Deep dives: the video opens into HTML where a video falls…: decisions D-046, D-060, D-052: the Open chip's key is O; while a question sheet is up, O…
recap: 2026-09-22-richer-review | Richer review: more kinds of question, comments on marks…: decisions D-005, D-004: which video-only feedback comes first?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-109, D-110: what may a miss with no tags stop?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-24-answer-on-the-video--walkthrough | Answer on the video itself, and edit the record in place: decision D-143: the frame's cards are answered through transparent buttons…
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decision D-169: who reviews each arm, and in what order?
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decision D-171: how do decision numbers survive two branches?
---

## Video direction

- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the real review page on scene 12 of the deep-dives walkthrough, its Open chip in the corner (1) and its side panel open (2); the real answer card, hovered, on the contributing video's quick check (3), under the owner's words from the review; the real frame of scene 12 (6) and the real pinned word in the better-visuals plan video (7). The new click (10) is a mock over the real frame, labelled planned; the rest explain with pictures.
- MOTION LANGUAGE: a camera moves over one view clipped at y 900 and is at rest, scale 1, when a question or quick check ends; things are revealed by their own verb (ringed, typed, drawn, struck, wiped); cut = a new chapter, a question or a quick check; push-slide LEFT = the next scene of the same chapter; crossfade = a branch and the ending.
- FIVE CHAPTERS: opened from the corner (1–5, scene 5 for new viewers only); step 1, the frame marks it (6–9); step 2, the thing is the button (10–16); step 3, what a click opens (17–22); step 4, the chip and the list, and the plan (23–29).
- QUESTIONS: what shows it opens (q1, scene 13, A recommended), where it opens (q2, scene 19, D-021 asked again, B recommended), the corner chip (q3, scene 25, B recommended), each followed by its three branches.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question and quick-check headings data-question, cards data-option, outside any camera, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice. Words this video defines where it first says them: detail (1), side panel (2).
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. No details. The final frame holds still.

## Frame 1 — A chip in the corner

- chapter_start: Opened from the corner
- defines: detail
- scene: THE REAL REVIEW PAGE (data-artifact, the deep-dives walkthrough at scene 12, paused): the frame with its code block of templates/details/table.html and the Open chip in the top-right corner. On 'eight lines' the code block is ringed in ink; on 'whole file' a small 'detail · the whole file' pin lands on the block; on 'chip in the corner' the chip is ringed in coral and a dashed line is drawn from the chip to the block
- voiceover: "A detail is a page a scene opens, for what the video cannot hold. This real scene shows eight lines of a template. Its detail is the whole file, with the lines that carry the choice marked. To open it, you click a chip in the corner, away from the code."
- duration: 14.485s
- transition_in: cut
- status: animated
- src: compositions/frames/01-a-chip-in-the-corner.html
- type: hook
- blueprint: compose
- layout: screen
- focal: the code in the middle, the way in at the corner
- sfx: none

narrativeRole: A chip in the corner.
keyMessage: A detail is a page a scene opens, for what the video cannot hold.

## Frame 2 — The side panel

- defines: side panel
- scene: THE REAL PAGE WITH THE PANEL OPEN (data-artifact): the same scene, the frame shrunk left, the code page in the panel on the right. On 'side panel' the panel is outlined in coral; on 'five hundred and sixty' a dimension line is drawn across it with '560 px'; on 'decision D-021' a small 'decided · D-021 · side panel' tag lands
- voiceover: "The page then opens in the side panel, a column beside the paused video. On a fourteen-forty window it is five hundred and sixty pixels wide, and the frame shrinks to the left. That is decision D-021, made when the chip was the only way in."
- duration: 14.869s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-the-side-panel.html
- type: pain_point
- blueprint: compose
- layout: screen
- focal: the page beside the video, less than half the width
- sfx: none

narrativeRole: The side panel.
keyMessage: The page then opens in the side panel, a column beside the paused video.

## Frame 3 — Answering is on the frame

- scene: THE REAL ANSWER CARD (data-artifact, the contributing video's quick check 2, the pointer on card B, ringed in coral) on the right; the owner's words from the better-visuals walkthrough review, word for word, as a quote on the left (data-artifact, the review file). On 'clear button' a pin 'the card is the button' lands on card B; on 'owner asked' the quote's 'click within the video' is underlined
- voiceover: "Answering already works the other way. On a quick check, you click the card you mean: the player lays a clear button over it, and your pointer rings it in coral. The owner asked for details to open like that, by a click within the video."
- duration: 12.523s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-answering-on-the-frame.html
- type: product_intro
- blueprint: compose
- layout: screen
- focal: the model: you click the thing you mean
- sfx: none

narrativeRole: Answering is on the frame.
keyMessage: Answering already works the other way.

## Frame 4 — What changes

- scene: THREE TILES landing on their words, each with its steps under it: 'the frame marks it' (step 1); 'the thing is the button' (steps 2, 3); 'the chip, a fallback' (step 4); thin arrows from tile 1 into tile 2
- voiceover: "The plan makes three changes. The frame marks the thing a detail explains, and the checks hold it: step one. The player makes that thing a button, and a click opens the page: steps two and three. The corner chip becomes the fallback: step four."
- duration: 13.397s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-what-changes.html
- type: product_intro
- blueprint: compose
- layout: diagram
- focal: three changes, four steps
- sfx: none

narrativeRole: What changes.
keyMessage: The plan makes three changes.

## Frame 5 — Four earlier plans

- knowledge: new
- scene: FOUR ROWS, ONE LINE EACH, landing on their words: deep dives · pages from a template, in the side panel; answer on the video · a clear button over each card; better visuals · the real thing, words pinned on it; the other eight · untouched
- voiceover: "Four earlier plans lead here. Deep dives made details, opened in the side panel. Answer on the video put a clear button over each card. Better visuals put the real thing on screen, with words pinned on it. The others stay as they are."
- duration: 13.269s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-four-earlier-plans.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: four earlier plans in a line each
- sfx: none

narrativeRole: Four earlier plans.
keyMessage: Four earlier plans lead here.

## Frame 6 — Step 1: the frame marks it

- chapter_start: Step 1: the frame marks it
- plan_step: 1
- scene: THE REAL FRAME OF SCENE 12 (data-artifact) on the left, the code block ringed in ink on 'code block'; under it the frame's markup typed, marked planned: <div data-artifact="templates/details/table.html" data-detail="data-block-and-slots">; on 'whole block' three chips land: a block · a line · a row · a pinned word
- voiceover: "Step one. The frame marks the one thing a detail explains, with data-detail and the detail's name. In scene twelve, that is the code block. It can be a whole block, one line of it, one table row, or a pinned word."
- duration: 12.395s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-1-the-frame-marks-it.html
- type: feature_showcase
- blueprint: compose
- layout: code
- focal: data-detail on the thing the page explains
- sfx: none

narrativeRole: Step 1: the frame marks it.
keyMessage: Step one.

## Frame 7 — A pinned word works too

- plan_step: 1
- scene: THE REAL FRAME (data-artifact, scripts/check-terms.mjs in the better-visuals plan video) with its pinned words; the camera leans in on line 79; on 'said too early' the label and its token are ringed in ink; on 'marked' a planned chip `data-detail="the-rule"` lands beside it; the camera comes back to rest
- voiceover: "A pinned word works too. In the better visuals plan video, the label said too early, a warning, is pinned on early dot push. Marked, that word could open the rule's whole table."
- duration: 10.261s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-a-pinned-word.html
- type: feature_showcase
- blueprint: compose
- layout: code
- focal: a pinned word as the thing
- sfx: none

narrativeRole: A pinned word works too.
keyMessage: A pinned word works too.

## Frame 8 — The checks

- plan_step: 1
- scene: A 1920 × 1080 FRAME OUTLINE: the lowest eighth hatched, 'answer bar'; three boxes land on their words and are struck: one in the band; a tiny one '< 120 × 44'; one sliding in with a 'last 3 s' bracket on a small timeline under the frame; a fourth, whole and still, above the band, ticked. On 'details check' a row: `check-details` · a name the storyboard does not give ✗
- voiceover: "Then the checks. frame-lint fails a marked thing in the lowest eighth, where the answer bar goes; one smaller than a hundred and twenty by forty-four pixels; and one still moving in its scene's last three seconds. The details check fails a name the storyboard does not give that scene."
- duration: 15.36s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08-the-checks.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: three rules a click can rely on
- sfx: none

narrativeRole: The checks.
keyMessage: Then the checks.

## Frame 9 — Quick check: a late slide

- plan_step: 1
- scene: THE CASE FROZEN BEHIND: the frame outline and its boxes, dimmed; the heading and three cards land, outside the camera, still
- voiceover: "Quick check. A new frame marks its code block, well above the lowest eighth. The block slides in during the scene's last second. What does frame-lint say?"
- duration: 8.405s
- transition_in: cut
- status: animated
- src: compositions/frames/09-qc-late-slide.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: A frame marks its code block, well above the lowest eighth. The block slides in during the scene's last second. What does frame-lint say?
- option_a: It passes: above the answer bar
- option_b: It fails: still moving
- option_c: A warning, not a failure
- answer: b
- explain: A marked thing has to be at rest in its scene's last three seconds, or a click could miss it.
- walk_me_through: The block is above the lowest eighth, so the first rule passes. But it slides in during the last second, and a marked thing has to be at rest for the scene's last three seconds. So frame-lint fails it, whatever its size or place.
- option_a_why: Its place passes, but it is still moving in the last three seconds.
- option_b_why: Right: a marked thing must be at rest in the scene's last three seconds.
- option_c_why: Each of the three rules fails the frame; none is only a warning.
- explained_at: 8
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a late slide.
keyMessage: Quick check.

## Frame 10 — Step 2: the thing is the button

- chapter_start: Step 2: the thing is the button
- plan_step: 2
- scene: A MOCK OVER THE REAL FRAME OF SCENE 12, labelled planned: on 'clear button' a dashed outline is drawn round the block; on 'rings' the outline turns to a coral ring; on 'tab' a small ink tab lands on the block's top edge, 'Open · The data block and the slots'; on 'keyboard' three keys land under the frame: Tab · Enter · O
- voiceover: "Step two. The player finds the marked thing and lays a clear button over it, as over an answer card. Your pointer or focus rings the block in coral, and a small tab on its top edge says Open. Tab reaches it from the keyboard; Enter or O opens it."
- duration: 14.251s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-2-the-button.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: the block itself opens the page
- sfx: none

narrativeRole: Step 2: the thing is the button.
keyMessage: Step two.

## Frame 11 — Never over the cards

- plan_step: 2
- scene: THE SAME FRAME AS A WIREFRAME: the block with its tab; on 'question is asked' three cards land over the lower half and the block's ring and tab fade to a dashed 'hidden' outline; on 'once you answer' card B ticks and the ring comes back; the lowest eighth hatched, 'answer bar', the tab clear of it
- voiceover: "It never sits over what you answer with. While a question is asked, the frame belongs to its cards: the block's button hides, and comes back once you answer. Its tab stays above the lowest eighth."
- duration: 10.773s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/11-never-over-the-cards.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: the cards come first
- sfx: none

narrativeRole: Never over the cards.
keyMessage: It never sits over what you answer with.

## Frame 12 — Quick check: a question on the scene

- plan_step: 2
- scene: THE CASE FROZEN BEHIND: the wireframe with its cards, dimmed; the heading and three cards land, still
- voiceover: "Quick check. Scene twelve's block is marked, and a quick check comes up on that scene. Before you answer, what does a click on the block do?"
- duration: 7.104s
- transition_in: cut
- status: animated
- src: compositions/frames/12-qc-question-on-the-scene.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: A quick check comes up on scene 12, whose block is marked. Before you answer, what does a click on the block do?
- option_a: Nothing: the button hides
- option_b: Opens the page
- option_c: Answers the quick check
- answer: a
- explain: While a question is asked the frame belongs to its cards; the block's button comes back once you answer.
- walk_me_through: The quick check asks its question on scene twelve, so the frame belongs to its cards. The block's button hides while the question is asked. A click on the block does nothing; once you answer, the button is back and the same click opens the page.
- option_a_why: Right: the cards come first; the button returns after you answer.
- option_b_why: Not yet: the button hides while the question is asked.
- option_c_why: Only the cards answer; the block is not one of them.
- explained_at: 11
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a question on the scene.
keyMessage: Quick check.

## Frame 13 — Question 1: what shows it opens

- plan_step: 2
- scene: THREE CARDS: the heading (data-question) and three cards (data-option a–c) land on their letters, each with a small block drawn in it: with a tab; with a ring and '2 s'; bare, with a pointer; on 'recommend' A is ringed coral with 'recommended'
- voiceover: "Question one: what shows that the block opens a page? A: a small tab on it, the whole time. B: a ring for two seconds, then only on hover. C: nothing until your pointer or focus is on it. I recommend A: a detail nobody knows is there is a detail nobody opens. Which one?"
- duration: 16.341s
- transition_in: cut
- status: animated
- src: compositions/frames/13-q1-what-shows-it.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q1
- question: What shows that a thing on the frame opens a page?
- option_a: A tab, the whole time
- option_b: A ring once, then hover
- option_c: Only on hover or focus
- option_a_more: "Open · The data block and the slots" sits on the block's top edge from the moment the block lands; a pointer or focus rings it.
- option_b_more: When the narration says what the page gives, the block is ringed for two seconds; after that, a pointer or focus brings the ring and the tab back.
- option_c_more: Nothing shows until the pointer or keyboard focus is on the block; then the ring and the tab appear.
- why_a: You see it without looking for it; a small ink tab on every scene with a detail.
- why_b: A clean frame; missed if you looked away for those two seconds.
- why_c: The cleanest frame; a reviewer watching hands-off never learns the block opens.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 1: what shows it opens.
keyMessage: Question one:

## Frame 14 — If A: a tab, the whole time

- plan_step: 2
- scene: THE BLOCK UNDER A: kicker 'If A · a tab'; the block lands and its tab 'Open' lands with it, and stays
- voiceover: "With A, every scene with a detail shows its tab from the moment the thing lands."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-branch-q1-a.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q1=a
- focal: always shown
- sfx: none

narrativeRole: If A: a tab, the whole time.
keyMessage: With A, every scene with a detail shows its tab from the moment the thing lands.

## Frame 15 — If B: a ring once

- plan_step: 2
- scene: THE BLOCK UNDER B: kicker 'If B · a ring once'; a coral ring drawn round the block, held, fading; a pointer arrives and the ring and tab come back
- voiceover: "With B, the ring shows once, on the narration's words, and then waits for your pointer."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-branch-q1-b.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q1=b
- focal: once, then on hover
- sfx: none

narrativeRole: If B: a ring once.
keyMessage: With B, the ring shows once, on the narration's words, and then waits for your pointer.

## Frame 16 — If C: only on hover

- plan_step: 2
- scene: THE BLOCK UNDER C: kicker 'If C · on hover'; the bare block; a pointer arrives and only then the ring and tab land
- voiceover: "With C, the frame shows nothing until you point at the thing."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-branch-q1-c.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q1=c
- focal: nothing until you point
- sfx: none

narrativeRole: If C: only on hover.
keyMessage: With C, the frame shows nothing until you point at the thing.

## Frame 17 — Step 3: what a click does

- chapter_start: Step 3: what a click opens
- plan_step: 3
- scene: A ROW OF FOUR STATES landing on their words: 'click' (the block ringed coral, a pointer) → 'paused · page open' (the block in an ink ring) → 'Esc' → 'plays on' (the block, focus ring); under it the review's line typed: { "name": "data-block-and-slots", "from": "frame", "seconds": 42 }
- voiceover: "Step three. A click on the block, Enter, or O pauses the video and opens the page. The block keeps an ink ring while it is open. Closing plays on from where it paused, if it was playing, with focus back on the block. The review logs where you opened it: the frame, the chip, or the list."
- duration: 16.043s
- transition_in: cut
- status: animated
- src: compositions/frames/17-step-3-the-click.html
- type: feature_showcase
- blueprint: compose
- layout: timeline
- focal: pause, open, and back where you were
- sfx: none

narrativeRole: Step 3: what a click does.
keyMessage: Step three.

## Frame 18 — Quick check: Escape

- plan_step: 3
- scene: THE CASE FROZEN BEHIND: the row of four states, dimmed; the heading and three cards land, still
- voiceover: "Quick check. The video is playing scene twelve. You click the block, read the file, and press Escape. What happens?"
- duration: 6.037s
- transition_in: cut
- status: animated
- src: compositions/frames/18-qc-escape.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: The video is playing scene 12. You click the block, read the file, and press Escape. What happens?
- option_a: It stays paused on the block
- option_b: It jumps to the next scene
- option_c: It plays on from where it paused
- answer: c
- explain: Closing goes back where you paused and plays on, because it was playing when you clicked.
- walk_me_through: The video was playing when you clicked, so the click paused it and opened the page. Escape closes the page. Closing goes back to where it paused and plays on, since it was playing, with focus on the block.
- option_a_why: It stays paused only if it was paused when you clicked.
- option_b_why: Closing never moves the video: it goes on from the moment it paused.
- option_c_why: Right: it was playing, so closing plays on from the same moment.
- explained_at: 17
- focal: three predictions
- sfx: none

narrativeRole: Quick check: Escape.
keyMessage: Quick check.

## Frame 19 — Question 2: where it opens

- plan_step: 3
- scene: A SMALL TAG over the heading, 'asked again · decision D-021 · side panel'; the heading and three cards land on their letters, each with a small wireframe: the frame and a panel beside it; a page filling the frame with an arrow out of the block; a small card beside the block with 'Open in full'; on 'recommend' B is ringed coral with 'recommended'
- voiceover: "Question two asks decision D-021 again. It put a detail in the side panel, so the frame stayed in view, when the chip was the only way in. A: beside the video, as today. B: over the frame, grown from the block, with about twice the room. C: a preview beside the block, the page on request. I recommend B: it is what into the video asks for, and the video is paused anyway. Which one?"
- duration: 21.675s
- transition_in: cut
- status: animated
- src: compositions/frames/19-q2-where-it-opens.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q2
- question: Where does a detail open once you click the thing?
- question_more: Decision D-021 put a detail in the side panel when the only way in was the corner chip. With the click on the frame, the question is asked again; keeping the side panel is A.
- option_a: Beside the video, as today
- option_b: Over the frame, from the block
- option_c: A preview, then the page
- option_a_more: The side panel slides in beside the video, 560 px on a 1440 px window; the frame shrinks to the left with the block ringed.
- option_b_more: The page grows out of the block to fill the video's box, about 1050 px, and shrinks back into the block when you close it.
- option_c_more: A card beside the block, like a card's More, shows the page's first screen; Open in full opens the side panel.
- why_a: You see what you clicked while you read; the file gets less than half the width (560 px at 1440).
- why_b: The page gets the video's whole box, about twice the room, and opens where you clicked; the frame is hidden while you read.
- why_c: Quick looks stay small; a second click for anything you would use.
- recommended: b
- focal: three options, B recommended
- sfx: none

narrativeRole: Question 2: where it opens.
keyMessage: Question two asks decision D-021 again.

## Frame 20 — If A: beside the video

- plan_step: 3
- scene: THE CLICK UNDER A: kicker 'If A · beside the video'; the frame shrinks left, the block ringed in ink; the panel slides in on the right, '560 px'
- voiceover: "With A, the side panel opens as today, with the block ringed in the frame beside it."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-branch-q2-a.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q2=a
- focal: the side panel, kept
- sfx: none

narrativeRole: If A: beside the video.
keyMessage: With A, the side panel opens as today, with the block ringed in the frame beside it.

## Frame 21 — If B: over the frame

- plan_step: 3
- scene: THE CLICK UNDER B: kicker 'If B · over the frame'; the block's outline grows to fill the frame, the page inside, '≈ 1050 px'; then shrinks back into the block
- voiceover: "With B, the page grows out of the block to fill the video's box, and shrinks back into it on close."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-branch-q2-b.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q2=b
- focal: grown from the block
- sfx: none

narrativeRole: If B: over the frame.
keyMessage: With B, the page grows out of the block to fill the video's box, and shrinks back into it on close.

## Frame 22 — If C: a preview first

- plan_step: 3
- scene: THE CLICK UNDER C: kicker 'If C · a preview'; a small card lands beside the block with the page's first lines and 'Open in full'; on 'side panel' the panel slides in
- voiceover: "With C, a small preview opens beside the block, and Open in full opens the side panel."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-branch-q2-c.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q2=c
- focal: a preview, then the panel
- sfx: none

narrativeRole: If C: a preview first.
keyMessage: With C, a small preview opens beside the block, and Open in full opens the side panel.

## Frame 23 — Step 4: the chip and the list

- chapter_start: Step 4: the chip and the list
- plan_step: 4
- defines: plan text
- scene: THREE ROWS landing on their words, each with a small picture: 'the plan text' · a step's section ending 'Open: The data block and the slots' (kept); 'an older video' · a frame with its corner chip (kept until rebuilt); 'a phone' · a narrow frame, the block '< 44 px', the chip in its corner
- voiceover: "Step four is about the corner chip. The plan text, the plan's own words beside the video, keeps its Open row under each step, whatever you pick. Older videos keep their chip, as today, until they are rebuilt. And on a phone, a thing under forty-four pixels tall is too small to tap, so that scene shows the chip."
- duration: 17.301s
- transition_in: cut
- status: animated
- src: compositions/frames/23-step-4-chip-and-list.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: the list stays; the chip where nothing can be clicked
- sfx: none

narrativeRole: Step 4: the chip and the list.
keyMessage: Step four is about the corner chip.

## Frame 24 — Quick check: an older video

- plan_step: 4
- scene: THE CASE FROZEN BEHIND: the three rows, dimmed; the heading and three cards land, still
- voiceover: "Quick check. The deep dives walkthrough is not rebuilt. After this plan ships, you reach its scene twelve on a laptop. How do you open the file?"
- duration: 7.979s
- transition_in: cut
- status: animated
- src: compositions/frames/24-qc-older-video.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: The deep-dives walkthrough is not rebuilt. After this plan ships, you reach its scene 12 on a laptop. How do you open the file?
- option_a: The corner chip, as today
- option_b: Click the code block
- option_c: Only from the plan text
- answer: a
- explain: An older video's frame marks nothing, so its scene keeps the corner chip until the video is rebuilt.
- walk_me_through: The deep dives walkthrough was built before this plan, so its frame marks nothing: the block is not a button. An older video keeps its corner chip until it is rebuilt. So you open the file from the chip, as today, or from the plan text's list.
- option_a_why: Right: an older video keeps its chip until it is rebuilt.
- option_b_why: Its frame marks nothing, so the block is not a button yet.
- option_c_why: The plan text's list works too, but the chip is still there.
- explained_at: 23
- focal: three predictions
- sfx: none

narrativeRole: Quick check: an older video.
keyMessage: Quick check.

## Frame 25 — Question 3: the corner chip

- plan_step: 4
- scene: THREE CARDS: the heading and three cards land on their letters, each with a small frame: the block with its tab and the chip; the block with its tab, no chip; a phone with no chip and an arrow to 'the list'; on 'recommend' B is ringed coral with 'recommended'
- voiceover: "Question three: what becomes of the corner chip on a rebuilt video? A: it stays beside the new click. B: it goes where the frame marks its thing, and stays on older videos and small phone targets. C: it goes everywhere, phones too, and a phone opens small things from the list. I recommend B: one way in, and nothing lost. Which one?"
- duration: 18.517s
- transition_in: cut
- status: animated
- src: compositions/frames/25-q3-the-corner-chip.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q3
- question: What becomes of the corner chip on a rebuilt video?
- option_a: It stays, beside the click
- option_b: It goes where a thing is marked
- option_c: It goes everywhere
- option_a_more: The chip and the block both open the page, on every scene with a detail.
- option_b_more: The block is the way in; the chip stays only where a frame marks nothing (an older video) or the thing is too small to tap on a phone. O still opens the page.
- option_c_more: A detail opens from its thing; on a phone, a thing too small to tap opens from the plan text's list. Older videos keep their chip, as in A and B.
- why_a: Nothing to relearn; two ways to do one thing on every scene with a detail.
- why_b: One way in on each scene; the chip stays where nothing is marked and on a phone where the thing is too small.
- why_c: The simplest frame; a phone reviewer goes to the plan text's list, away from the video.
- recommended: b
- focal: three options, B recommended
- sfx: none

narrativeRole: Question 3: the corner chip.
keyMessage: Question three:

## Frame 26 — If A: it stays

- plan_step: 4
- scene: THE SCENE UNDER A: kicker 'If A · it stays'; the block with its tab, and the chip in the corner, both
- voiceover: "With A, a rebuilt scene shows both, the tab on the block and the chip in the corner."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-branch-q3-a.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q3=a
- focal: two ways in
- sfx: none

narrativeRole: If A: it stays.
keyMessage: With A, a rebuilt scene shows both, the tab on the block and the chip in the corner.

## Frame 27 — If B: only where nothing is marked

- plan_step: 4
- scene: THE SCENE UNDER B: kicker 'If B · a fallback'; the chip struck on the rebuilt scene; beside it an older frame and a phone, each keeping its chip
- voiceover: "With B, the chip goes from a rebuilt scene, and stays on older videos and small phone targets."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-branch-q3-b.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q3=b
- focal: one way in
- sfx: none

narrativeRole: If B: only where nothing is marked.
keyMessage: With B, the chip goes from a rebuilt scene, and stays on older videos and small phone targets.

## Frame 28 — If C: it goes everywhere

- plan_step: 4
- scene: THE SCENE UNDER C: kicker 'If C · no chip'; the chip struck on the rebuilt scene and on the phone; the phone's arrow to 'the plan text's list'
- voiceover: "With C, no rebuilt scene shows the chip; a phone opens small things from the list."
- duration: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-branch-q3-c.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- branch: q3=c
- focal: the list on a phone
- sfx: none

narrativeRole: If C: it goes everywhere.
keyMessage: With C, no rebuilt scene shows the chip; a phone opens small things from the list.

## Frame 29 — The plan

- scene: THE STEPS AND THEIR SLOTS, still: four rows (data-plan-step 1 to 4) at reading size: step 1 'the frame marks it, the checks hold it'; step 2 'the thing is the button' with q1's slot; step 3 'a click opens the page' with q2's slot; step 4 'the chip, a fallback' with q3's slot; 'draw a note · approve' on 'approve'. Holds still.
- voiceover: "That is the plan: four steps and three questions. The frame marks the thing, the player makes it a button, a click opens the page, and the chip stays where nothing can be clicked. Draw on any step to leave a note, or approve."
- duration: 16s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- plan_questions: 1, 2, 3
- focal: the four steps, with the reviewer's picks
- sfx: none

narrativeRole: The plan.
keyMessage: That is the plan:
