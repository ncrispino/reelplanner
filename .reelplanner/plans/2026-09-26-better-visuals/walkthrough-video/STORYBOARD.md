---
title: "Better visuals: what was built"
format: 1920x1080
duration: 270s
message: "All four steps of the better-visuals plan are built, and three things the owner asked for along the way. Twenty-nine choices: fifteen stop, in five stop scenes (one per step for steps 1 to 3, one for the review player's asks, one for the names), fourteen wait in grouped scenes; no off-plan change."
arc: the change's map first (a hundred and eighty-seven files, one line a folder); the steps in plan order, each on its real thing (the brief template's diff, the frame check's run, the page before and after, the rebuilt system video), each with its one stop scene and a quick check on the case just shown; the owner's three asks on the real player before and after and the real captions, with their stop scenes and a check; what ran, and the ask
audience: the repo owner, who asked for better visuals and a page that reads well, and watched this plan's video
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-26-better-visuals
terms: zoom, verdict; motion-language.md = the theme's rules for how a scene moves: what each move means, and what the checks hold a frame to
terms_check: strict
before: system#part 1 | why a video, with the review player
before: system#part 5 | the build
before: 2026-09-26-better-visuals | the plan video: its four steps, and what the real thing means
before: 2026-09-22-m3-revise-loop | decisions D-083, D-085, D-065, D-064, D-066, D-082, D-084: how many quick checks does a video ask?
before: 2026-09-25-videos-you-can-follow | decisions D-127, D-128, D-129: which words does the viewer see: plain new ones, or…; explains "glossary"
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-083, D-085, D-065, D-064, D-066, D-082, D-084: how many quick checks does a video ask?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-128, D-129: which words does the viewer see: plain new ones, or…; explains "glossary"
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decisions D-021, D-024: where does a detail open?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-109, D-110: what may a miss with no tags stop?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-24-answer-on-the-video | Answer on the video itself, and edit the record in place: decision D-108: where do the answers the frame can't take go?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decision D-003: when does the system video update?
recap: 2026-09-22-richer-review | Richer review: more kinds of question, comments on marks…: decision D-005: which video-only feedback comes first?
---

## Video direction

- THIS VIDEO IS BUILT THE WAY THE PLAN SAYS: the brief picks the real things (BRIEF.md's `- Real things:`), each in a `data-artifact` with its words pinned where this video defines one; a change across many files is its map first (scene 1); a camera over one view clipped at y 900; transitions mean something (cut = a chapter, a quick check or a stop scene; push-slide LEFT = the next scene of a chapter; crossfade = the ending).
- THE STOPS `reel stops` prints: step 1 `- autonomy: a1, a3, a25` (3); step 2 `- autonomy: a7` (6); step 3 `- autonomy: a9, a21, a23, a24` (10). The owner's asks, outside the steps: `reel stops` puts all seven on one line under "step ?"; they are two asks, so two stop scenes, the review player's `- autonomy: a30, a31, a35` (17) and the names' `- autonomy: a40, a41, a42, a43` (20). The rest wait in one grouped scene at each chapter's end: `a2, a4, a26, a27, a5, a6, a8` (8), `a10, a22` (14), `a32, a33, a34` (21), and the two changes to the walkthrough check the code check found, `a44, a45` (23). No off-plan change. Why they stop, said once (3): a choice with the same label needed a late fix in an earlier plan (videos-you-can-follow's choice A7, label you'll notice it); hard-to-undo is at five accepted in a row of ten.
- QUICK CHECKS, one per step and one for the asks (§7), each on the case its scene just showed, with `- walk_me_through:` and `- explained_at:`: k1 the build and a scene the brief leaves out (2), k2 a zoom with no clipped view (5), k3 how the page marks the right answer (9), k4 which scenes of a revised video take the new style (12), k5 a quick check asked at 200% (17).
- PLAIN WORDS (D-127): choice, label, late fix, accepted in a row, scene, grouped scene, chapter, answer bar, off-plan change. No id without what it is ("choice A1", "decision D-166"). Tool names in code markup on screen (`reel audit`, `reelplanning`, `git`), as `.reelplanning/names.md` lists them; the frame check is "the frame check" in the voice.
- FIVE CHAPTERS: what was built (1); steps 1 and 2, the videos (2 to 8); steps 3 and 4, the page and the system video (9 to 14); what you asked for along the way (15 to 21); checked (22 to 24).
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions, so the lowest eighth (y ≥ 945) is empty. Question headings `data-question`, option cards `data-option`, choice cards `data-call`, outside any camera, whole and still.
- The look from `.reelplanning/theme/frame.md` and its tokens only; light and dark. One coral at a time; no gradients, glows, blur or drift. No details. The final frame holds still.

## Frame 1 — What was built: its map

- chapter_start: What was built
- defines: step
- scene: THE MAP (the real change, one row a folder): the real counts from `git diff --stat b421610..d644b49`, one row each with one plain line: `skills/plan-to-video/` 2 · the rules for scenes; `templates/` 11 · frame template, moves, the coral; `scripts/` 22 · the checks, and names in captions; `packages/player/` 17 · the page; zoom; whys; `.reelplanning/system-video/` 129 · rebuilt once; `.reelplanning/` 4 · names list, theme; the total '187 files' counts up on 'hundred and eighty-seven'; on 'system video' its row lit (the one coral), the rest dimmed; on 'rest' the other rows back
- voiceover: "The better-visuals plan is built: all four of its steps, the numbered parts of the plan, and three things you asked for. It changed a hundred and eighty-seven files, so here is its map, one line a folder: mostly the system video, rebuilt once, and then the rest."
- duration: 15.6s
- transition_in: cut
- status: animated
- src: compositions/frames/01-the-map.html
- type: hook
- blueprint: compose
- layout: map
- focal: the change's map, one row a folder
- sfx: none

narrativeRole: What was built: its map.
keyMessage: The better-visuals plan is built.

## Frame 2 — Step 1: the brief picks the real things

- chapter_start: Steps 1 and 2: the videos
- plan_step: 1
- scene: THE REAL DIFF, THEN THE CASE: a place label 'templates/video/BRIEF.md · step 1'; the slab with the brief template's Customizations as the diff adds them (`- Medium:`, `- Layouts:`, `- Main transition:`, `- Real things: …`), the `- Real things:` line wiped in on 'one line' and underlined (the one coral); on 'scene three' a strip of six scenes under it, scene 3 'the table' ringed in ink; on 'prints' the build's real lines for a brief that picks scene 3 (`reelplanning variety` on a six-scene sample): '✓ variety  BRIEF.md picks the real things: scene 3 (the table); the rest explain with pictures'; on 'five' scene 5 'boxes' is lit in the strip and, on 'nothing', the build's next row stays empty, outlined, with the pinned words 'scene 5: no line'
- voiceover: "Step one. A scene can show the real thing, the file, table or screen it is about. As you decided in decision D-166, each video's brief picks which scenes do, on one line. Say it picks scene three: the build prints that line back, with a tick. Scene five draws only boxes, and the build says nothing about it: no warning, no line at all."
- duration: 19.904s
- transition_in: cut
- status: animated
- src: compositions/frames/02-step-1-the-brief-picks.html
- type: feature_showcase
- blueprint: compose
- layout: diff
- focal: the `- Real things:` line and the build's ✓
- sfx: none

narrativeRole: Step 1: the brief picks the real things.
keyMessage: Step one.

## Frame 3 — Step 1: three choices stop

- plan_step: 1
- autonomy: a1, a3, a25
- scene: STOP SCENE, THREE CHOICE CARDS: a place label 'walkthrough.md · step 1 · 3 of 7 choices stop'; three cards stacked with room under each (data-call a1, a3, a25), each 'choice A1' in mono and what it chose: 'A pinned word names the file's own word', 'The brief says medium, layouts, transition', 'The build repeats the real-things line'; each lands on its id; on 'late fix' a small chip 'label: you'll notice it · a late fix' above the cards
- voiceover: "Three choices in step one stop, since their label, you'll notice it, needed a late fix before. Choice A1: a pinned word names the file's own word. Choice A3: the brief names its medium, layouts and transition. Choice A25: the build repeats the brief's real-things line."
- duration: 16.64s
- transition_in: cut
- status: animated
- src: compositions/frames/03-step-1-stops.html
- type: cta
- blueprint: compose
- layout: cards
- focal: three choices, one pause
- sfx: none

narrativeRole: Step 1: three choices stop.
keyMessage: Three choices in step one stop.

## Frame 4 — Quick check: a scene the brief leaves out

- plan_step: 1
- scene: QUICK CHECK: behind, the brief's `- Real things: scene 3` line from scene 2, dimmed; the heading 'The brief picks scene 3. Scene 5 is boxes.' (data-question); three cards (data-option a to c): 'A warning for scene 5', 'Nothing', 'The build stops'
- voiceover: "Quick check. This brief picks scene three. Scene five draws only boxes. What does the build say about scene five?"
- duration: 6.293s
- transition_in: cut
- status: animated
- src: compositions/frames/04-quick-check-k1.html
- type: social_proof
- blueprint: compose
- layout: quiz
- quiz: k1
- question: The brief picks scene 3. Scene 5 draws only boxes. What does the build say about scene 5?
- option_a: A warning for scene 5
- option_b: Nothing
- option_c: The build stops
- answer: b
- explain: The brief picks which scenes show the real thing, and nothing warns about the scenes it leaves out; the build only repeats the brief's line.
- option_a_why: A warning for a scene of boxes was the recommendation, and you chose the brief picks instead, where nothing warns.
- option_b_why: Right: the build repeats the brief's real-things line and says nothing about the scenes it leaves out.
- option_c_why: Nothing about the real things ever stops a build; even the three lines the brief must have only warn.
- walk_me_through: The brief's line names scene three, so scene three should show its real thing. Scene five is not on the line, so it may explain with boxes or a picture. The build repeats the brief's line as a tick and says nothing about scene five: no warning, no stop.
- explained_at: 2
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a scene the brief leaves out.
keyMessage: Quick check.

## Frame 5 — Step 2: checks that keep the answer safe

- plan_step: 2
- defines: answer band
- scene: THE REAL RUN: a place label 'step 2 · motion-language.md, frame-lint'; left, a picture of a frame: a table's box at y 300 and a dashed line at y 900 over the answer bar's eighth; on 'zooms' the table grows past the line (a box that could reach the answer bar, marked coral); right, the slab: the real run `reelplanning frame-lint frames/step-3-zoom.html` typed on 'fails', printing '✗ step-3-zoom.html' and 'camera #s-table moves outside a view clipped at 900 px …'; the pinned word 'answer bar' on 'lowest eighth'
- voiceover: "Step two writes down what each move means, in the motion language, and adds checks that keep the answer safe. Here a table grows with no view around it clipped at nine hundred pixels, so the frame check fails it: nothing may move into the answer bar, the strip at the bottom where you answer."
- duration: 15.531s
- transition_in: cut
- status: animated
- src: compositions/frames/05-step-2-checks.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the frame check failing a zoom with no clipped view
- sfx: none

narrativeRole: Step 2: checks that keep the answer safe.
keyMessage: Step two writes down what each move means, in the motion language.

## Frame 6 — Step 2: one choice stops

- plan_step: 2
- autonomy: a7
- scene: STOP SCENE, ONE CARD + A REAL RUN: the slab above: the real run `reelplanning variety …/fewer-better-stops/walkthrough-video` printing '△ 17 of 17 transitions are one kind (crossfade, 100%): over 70%. …'; the count '17 of 17' underlined on 'seventeen'; one card below (data-call a7): 'choice A7 · a scene's layout from its layout line'
- voiceover: "One choice in step two stops. Choice A7: the variety warning reads each scene's layout from its own layout line, not the blueprint every storyboard sets the same. On an older video it finds all seventeen cuts are one crossfade."
- duration: 13.739s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-2-stop.html
- type: cta
- blueprint: compose
- layout: cards
- focal: one choice, on the warning it writes
- sfx: none

narrativeRole: Step 2: one choice stops.
keyMessage: One choice in step two stops.

## Frame 7 — Quick check: a zoom with no clipped view

- plan_step: 2
- scene: QUICK CHECK: behind, the frame picture from scene 5 (the table past the line), dimmed; the heading 'A table grows; no clipped view around it.' (data-question); three cards (data-option a to c): 'A warning; the build goes on', 'The frame fails the check', 'Nothing: it is not named a camera'
- voiceover: "Quick check. A table grows, and no view clipped at nine hundred pixels is around it. What does the frame check do?"
- duration: 6.144s
- transition_in: cut
- status: animated
- src: compositions/frames/07-quick-check-k2.html
- type: social_proof
- blueprint: compose
- layout: quiz
- quiz: k2
- question: A table grows, and no view clipped at 900 pixels is around it. What does the frame check do?
- option_a: A warning; the build goes on
- option_b: The frame fails the check
- option_c: Nothing: it is not named a camera
- answer: b
- explain: A box that grows and could reach the answer bar counts as a camera, named or not, and a camera outside a view clipped at 900 pixels fails the frame check.
- option_a_why: The camera and card rules fail; a warning would let a scene move into the answer bar.
- option_b_why: Right: the zooming table could reach the answer bar, so it counts as a camera, and it has no clipped view.
- option_c_why: A box that grows counts as a camera when it could reach the line at 900 pixels, named or not, and this table's could.
- walk_me_through: The table's box starts at three hundred pixels and grows, so it could reach past nine hundred, into the answer bar. That makes it a camera, even with no camera in its name. A camera must sit inside a view clipped at nine hundred pixels; this one does not, so the frame check fails the frame, as the run in scene five printed.
- explained_at: 5
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a zoom with no clipped view.
keyMessage: Quick check.

## Frame 8 — Steps 1 and 2: the choices that don't stop

- autonomy_group: a2, a4, a26, a27, a5, a6, a8
- scene: GROUPED SCENE: a place label 'steps 1 and 2 · 7 choices, no pause'; seven short rows (data-call each), step 1's four then step 2's three, each 'choice A2' in mono and a few words: 'code and terminal blocks as snippets', 'this repo's frame template is the template's copy', 'the frame template says the brief picks', 'a made-up ten-file example', 'a real thing's own words count as explained', 'still step ticks only warn', 'what counts as a camera'; rows land in order
- voiceover: "Seven more choices in steps one and two don't stop: their labels have been accepted ten times in a row. They wait here in one list. Flag any of them, or accept the rest."
- duration: 9.92s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08-steps-1-2-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: seven choices in one list
- sfx: none

narrativeRole: Steps 1 and 2: the choices that don't stop.
keyMessage: Seven more choices in steps one and two don't stop.

## Frame 9 — Step 3: the review page, made readable

- chapter_start: Steps 3 and 4: the page and the system video
- plan_step: 3
- scene: THE REAL PAGE, BEFORE AND AFTER: a place label 'the review page · step 3'; the Terms panel before (real screenshot, at 312d989's parent) with a wipe to after on 'ship'; pinned words on the after shot: 'fonts: shipped' on a term's name on 'fonts', 'three inks' on a meaning on 'solid'; on 'right answer' a second pair, the answered quick check before and after (real screenshots), wiped; on 'tick' the ink ring and tick circled, on 'cross' the dashed ring
- voiceover: "Step three is that page: today's look, made readable, as you chose. Its fonts now ship with it, and its words are in three solid inks, not five greys. Coral, now darker, means only what is yours and waiting. The right answer gets an ink ring and a tick; a wrong pick, a cross and a dashed ring."
- duration: 16.768s
- transition_in: cut
- status: animated
- src: compositions/frames/09-step-3-the-page.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the page before and after its fixes
- sfx: none

narrativeRole: Step 3: the review page, made readable.
keyMessage: Step three is the review page, in today's look made readable, as you chose.

## Frame 10 — Step 3: four choices stop

- plan_step: 3
- autonomy: a9, a21, a23, a24
- scene: STOP SCENE, FOUR CHOICE CARDS: a place label 'walkthrough.md · step 3 · 4 of 6 choices stop'; four cards stacked with room under each (data-call a9, a21, a23, a24): 'choice A9 · a lighter coral in the dark theme', 'choice A21 · the fonts committed in the package', 'choice A23 · the right answer in ink', 'choice A24 · coral leaves what is only current'; each lands on its id
- voiceover: "Four choices in step three stop. Choice A9: a lighter coral in the dark theme. Choice A21: the fonts committed in the package. Choice A23: the right answer in ink. Choice A24: coral leaves what is only current."
- duration: 14.187s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-3-stops.html
- type: cta
- blueprint: compose
- layout: cards
- focal: four choices, one pause
- sfx: none

narrativeRole: Step 3: four choices stop.
keyMessage: Four choices in step three stop.

## Frame 11 — Quick check: the right card

- plan_step: 3
- scene: QUICK CHECK: behind, the answered quick check after (real screenshot), dimmed; the heading 'You answer wrong. How is the right card marked?' (data-question); three cards (data-option a to c): 'A coral ring', 'An ink ring and a tick', 'A green ring'
- voiceover: "Quick check. You answer a quick check wrong. How does the page mark the right card?"
- duration: 4.075s
- transition_in: cut
- status: animated
- src: compositions/frames/11-quick-check-k3.html
- type: social_proof
- blueprint: compose
- layout: quiz
- quiz: k3
- question: You answer a quick check wrong. How does the page mark the right card?
- option_a: A coral ring
- option_b: An ink ring and a tick
- option_c: A green ring
- answer: b
- explain: Coral now means only what is yours and waiting, so the right answer is ringed in ink with a tick, and a wrong pick gets a cross and a dashed ring.
- option_a_why: Coral was the right answer's colour before; now it means only what is yours and waiting.
- option_b_why: Right: ink, with a tick, so it reads without colour; your wrong pick gets a cross and a dashed ring.
- option_c_why: Green was one sample look's colour; you chose today's look, where the right answer is ink.
- walk_me_through: Coral used to mark the right answer. Step three keeps coral for what is yours and waiting, so the right card is ringed in ink and headed with a tick. Your wrong pick keeps a dashed ring and a cross, so the two differ by more than colour.
- explained_at: 9
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: the right card.
keyMessage: Quick check.

## Frame 12 — Step 4: the system video, rebuilt once

- plan_step: 4
- defines: chapter
- scene: THE REAL THING: a place label '.reelplanning/system-video · step 4'; a wall of the rebuilt system video's real scenes (its contact sheet), the camera pulling back on 'whole'; counters '7 chapters', '35 scenes', '7:32' count up on their words; the slab below prints the real `reel status` line '✓ the system video is current' on 'walkthrough'
- voiceover: "Step four: old videos change only when they are revised, in the scenes your comments touch. The system video was rebuilt once, whole: seven chapters, each a stretch under one title, thirty-five scenes, seven and a half minutes."
- duration: 14s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-step-4-the-system-video.html
- type: feature_showcase
- blueprint: compose
- layout: wall
- focal: the rebuilt system video
- sfx: none

narrativeRole: Step 4: the system video, rebuilt once.
keyMessage: Step four: old videos change only when they are revised, and the system video was rebuilt once, whole.

## Frame 13 — Quick check: a revised video

- plan_step: 4
- scene: QUICK CHECK: behind, the system video's wall, dimmed; the heading 'A video is revised in 2 scenes. Which take the new style?' (data-question); three cards (data-option a to c): 'Every scene', 'Only the scenes your comments touch', 'None until a full rebuild'
- voiceover: "Quick check. Next month the fewer-stops walkthrough is revised, and your comments touch two of its scenes. Which scenes take the new style?"
- duration: 7.296s
- transition_in: cut
- status: animated
- src: compositions/frames/13-quick-check-k4.html
- type: social_proof
- blueprint: compose
- layout: quiz
- quiz: k4
- question: Next month the fewer-stops walkthrough is revised, and your comments touch two of its scenes. Which scenes take the new style?
- option_a: Every scene
- option_b: Only the scenes your comments touch
- option_c: None until a full rebuild
- answer: b
- explain: Old videos change only when they are revised, in the scenes your comments touch; only the system video was rebuilt whole.
- option_a_why: A whole rebuild was the system video's alone, once; a revised video keeps the scenes your comments did not touch.
- option_b_why: Right: a video takes the new style when it is revised, in the scenes your comments touch.
- option_c_why: There is no mass rebuild to wait for; a revision brings the new style to the scenes it touches.
- walk_me_through: Step four says there is no mass rebuild: a video takes the new style when it is next revised. Only the scenes your comments touch are rebuilt, so the two scenes change and the rest stay as they are. The system video was the one rebuilt whole, once.
- explained_at: 12
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a revised video.
keyMessage: Quick check.

## Frame 14 — Step 3: the choices that don't stop

- defines: detail
- autonomy_group: a10, a22
- scene: GROUPED SCENE: a place label 'step 3 · 2 choices, no pause'; two rows (data-call a10, a22): 'choice A10 · detail pages take today's coral, inks and fonts' with a small ink tag 'changed, as you asked', 'choice A22 · one list of the page's fonts'
- voiceover: "Two more choices in step three don't stop. The detail pages, the pages a scene opens beside the video, now take the darker coral, the inks and the fonts of the page too, as you asked. And the page's fonts are one list that the player reads."
- duration: 13.909s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-step-3-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: two choices in one list
- sfx: none

narrativeRole: Step 3: the choices that don't stop.
keyMessage: Two more choices in step three don't stop.

## Frame 15 — You asked: zoom into the video

- chapter_start: What you asked for along the way
- defines: zoom
- scene: THE REAL PLAYER: a place label 'the player · Size'; the player at Fit (real screenshot) and, wiped in on 'two hundred', the same frame at 200% (real screenshot) with its size chip '200%' underlined; the pinned word 'zoom · the picture bigger than Fit' on the size chip; on 'twenty-five' four chips '125 · 150 · 175 · 200' land in order
- voiceover: "You also asked for three things. First, zoom: making the picture bigger than Fit. It now goes to two hundred percent, growing inside Fit's box, so the controls stay put; and the minus and equals keys step twenty-five percent past Fit, as you answered."
- duration: 14.635s
- transition_in: cut
- status: animated
- src: compositions/frames/15-zoom.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the player at 200%
- sfx: none

narrativeRole: You asked: zoom into the video.
keyMessage: You also asked for three things along the way.

## Frame 16 — You asked: a why covered the next card

- defines: verdict
- scene: THE REAL PLAYER, BEFORE AND AFTER: a place label 'an answered quick check · 1440 × 900'; before (real screenshot, the player at 01e4f62's parent): the why under card A and "Expected something else?" over card B's words, a coral ring drawn round the overlap on 'covered'; wiped to after on 'Now': each card whole, the verdict on each card's tag, the pinned word 'verdict · right, or not quite' on the tag
- voiceover: "Second, on an answered quick check, the reason under one card covered the next card's words. Now a layout that covers a card is passed over, and where none fits, each card's verdict, right or not quite, sits on its tag."
- duration: 12.117s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/16-overlap.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the why no longer covers a card
- sfx: none

narrativeRole: You asked: a why covered the next card.
keyMessage: Second, on an answered quick check, the reason under one card covered the next card's words.

## Frame 17 — The review player: three choices stop

- autonomy: a30, a31, a35
- scene: STOP SCENE, THREE CHOICE CARDS: a place label 'walkthrough.md · the player · 3 of 6 choices stop'; three cards stacked with room under each (data-call a30, a31, a35): 'choice A30 · the picture zooms inside Fit's box', 'choice A31 · a question keeps the zoom', 'choice A35 · the verdict rides on the tag'
- voiceover: "Three of these stop. Choice A30: the picture zooms inside Fit's box. Choice A31: a question asked while zoomed keeps the zoom, and the view scrolls to its cards. Choice A35: with no room for reasons, each verdict rides on its card's tag."
- duration: 15.381s
- transition_in: cut
- status: animated
- src: compositions/frames/17-player-stops.html
- type: cta
- blueprint: compose
- layout: cards
- focal: three choices, one pause
- sfx: none

narrativeRole: The review player: three choices stop.
keyMessage: Three of these choices stop.

## Frame 18 — Quick check: a question at 200%

- scene: QUICK CHECK: behind, the player at 200% from scene 15, dimmed; the heading 'You are at 200% when a quick check comes.' (data-question); three cards (data-option a to c): 'Back to Fit', 'It keeps the zoom and scrolls to the cards', 'It waits until you zoom out'
- voiceover: "Quick check. You are zoomed in to two hundred percent when a quick check comes up. What happens?"
- duration: 4.715s
- transition_in: cut
- status: animated
- src: compositions/frames/18-quick-check-k5.html
- type: social_proof
- blueprint: compose
- layout: quiz
- quiz: k5
- question: You are zoomed in to 200% when a quick check comes up. What happens?
- option_a: Back to Fit
- option_b: It keeps the zoom and scrolls to the cards
- option_c: It waits until you zoom out
- answer: b
- explain: A question asked while zoomed in keeps the zoom, and the view scrolls once to its heading and cards, which answer at any size.
- option_a_why: Going back to Fit was the choice not made: you chose the zoom to read.
- option_b_why: Right: the zoom stays, and the view scrolls to the heading and the cards.
- option_c_why: Nothing waits: the cards answer at any size, checked at 200%.
- walk_me_through: You chose two hundred percent to read the frame, so the player keeps it. When the quick check comes, the view scrolls once to its heading and cards, and the cards answer at that size. Fit is one double-click away if you want the whole frame.
- explained_at: 17
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a question at 200%.
keyMessage: Quick check.

## Frame 19 — You asked: tool names in code

- scene: THE REAL THINGS: a place label '.reelplanning/names.md · captions'; left, the real rows of names.md (`reelplanning` · shown in backticks, `reel` · `reel audit`, `git`, GitHub · plain), `reelplanning` lit on 'one list'; right, the real captions (a sheet of two lines, light and dark) with the chip '`reel audit`' underlined on 'chip'; on 'GitHub' its plain row underlined in ink
- voiceover: "Third, tool names. A tool's name is now shown as code, from one list, names dot md: reelplanning, reel audit, git. In the captions it sits on a small chip. A product, like GitHub, keeps its capitals and no chip."
- duration: 12.779s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/19-names.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: a tool's name as code, from one list
- sfx: none

narrativeRole: You asked: tool names in code.
keyMessage: Third, tool names.

## Frame 20 — The names: four choices stop

- autonomy: a40, a41, a42, a43
- scene: STOP SCENE, FOUR CHOICE CARDS: a place label 'walkthrough.md · the names · 4 of 4 choices stop'; four cards stacked with room under each (data-call a40 to a43): 'choice A40 · the list is its own file', 'choice A41 · which names are code', 'choice A42 · a command's words join the chip', 'choice A43 · the frame check only warns'
- voiceover: "All four choices here stop. Choice A40: the list is its own file. Choice A41: which names are code. Choice A42: a command's next words join its chip. Choice A43: a name outside code only warns."
- duration: 14.272s
- transition_in: cut
- status: animated
- src: compositions/frames/20-names-stops.html
- type: cta
- blueprint: compose
- layout: cards
- focal: four choices, one pause
- sfx: none

narrativeRole: The names: four choices stop.
keyMessage: All four choices here stop.

## Frame 21 — Your asks: the choices that don't stop

- autonomy_group: a32, a33, a34
- scene: GROUPED SCENE: a place label 'the player · 3 choices, no pause'; three rows (data-call a32, a33, a34): 'choice A32 · the wheel moves around', 'choice A33 · one size control, 25% steps past Fit', 'choice A34 · a layout that covers a card is passed over'
- voiceover: "Three more don't stop: the wheel moves around a zoomed frame, one size control does all of it, and a layout that covers a card is passed over."
- duration: 8.064s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/21-asks-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: three choices in one list
- sfx: none

narrativeRole: Your asks: the choices that don't stop.
keyMessage: Three more don't stop.

## Frame 22 — Checked: the code check and the walkthrough check

- chapter_start: Checked
- scene: THE REAL RUNS: a place label 'code-check/findings.md · reel audit'; the code check's counts from findings.md as rows landing on their words: 'Steps · 4 of 4 ✓', 'Decisions · 21 of 21 ✓', 'Unexplained · 2 ✗, answered in walkthrough.md'; the slab below: `reel audit .reelplanning/plans/2026-09-26-better-visuals` typed on 'walkthrough check', printing its real two lines, '△ 29 calls; step 1 has 7. …' and '✓ 2026-09-26-better-visuals: 4 step(s), 3 own decision(s), 22 cited, 0 failure(s)'
- voiceover: "A second agent checked the code: all four steps and twenty-one decisions hold. Two changes had no row: another commit's license change, and two changes to the walkthrough check, now choices A44 and A45. That check now passes."
- duration: 14.443s
- transition_in: cut
- status: animated
- src: compositions/frames/22-checked.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- focal: the checks, passing
- sfx: none

narrativeRole: Checked: the code check and the walkthrough check.
keyMessage: A second agent checked the code against the plan.

## Frame 23 — Closing the plan: two choices that don't stop

- autonomy_group: a44, a45
- scene: GROUPED SCENE: a place label 'the walkthrough check · 2 choices, no pause'; two rows (data-call a44, a45): 'choice A44 · an answered question counts as asked', 'choice A45 · your asks counted one by one'
- voiceover: "Choices A44 and A45 don't stop: the walkthrough check counts a question you already answered, and your asks one by one."
- duration: 7.616s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/23-closing-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: two choices in one list
- sfx: none

narrativeRole: Closing the plan: two choices that don't stop.
keyMessage: Choices A44 and A45 don't stop.

## Frame 24 — What ran, and the ask

- scene: WHAT RAN + THE ASK: the four steps as rows (data-plan-step 1 to 4), each 'built' on its words; right, rows on their words: 'every test · pass' on 'tests', 'since you asked · detail pages in today's look; step 1 says what the build prints' on 'asked', 'not done · italics; older videos until revised' on 'not done'; on 'flag' the ask 'Flag a choice, or accept' outlined coral (the one coral); holds still
- voiceover: "Every test ran and passed, the new checks included. Since you asked, the detail pages take today's look, and step one says what the build prints. Not done: italics, and older videos keep their look until they are revised. Flag a choice, or accept the build."
- duration: 14.779s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-end.html
- type: cta
- blueprint: compose
- layout: steps
- focal: four steps built, what ran, the ask
- sfx: none

narrativeRole: What ran, and the ask.
keyMessage: Every test ran and passed, the new checks included.
