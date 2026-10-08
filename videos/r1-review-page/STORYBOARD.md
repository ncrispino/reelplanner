---
title: "The review page is a video player wearing a dashboard"
format: 1920x1080
duration: 247s
message: "Give the video the page, never crop the evidence, one home per question"
arc: plan review with three decision beats
audience: the reviewer who uses this page and has to approve a layout change
mode: autonomous
music: none
plan_dir: packages/player/.reelplanning/plans/2026-09-21-review-page
---

## Video direction

- THE STAGE IS THE PAGE (style guide §18; `.hyperframes/stage-snippet.html`, kind `layout`). This plan changes where things sit on one screen, so the artefact is that screen, drawn as a wireframe at a size you can read across the room. There is no node graph: nothing here exchanges data at runtime, and a graph would assert something false.
- WHAT IS LAW: the outer page card never moves — left 660, top 250, 1180 × 680. Everything inside it does move, because that is the plan. A step beat is the regions travelling from where they are to where the step puts them, so the motion and the sentence are the same event and no beat is text over a still picture.
- PRESENCE (style guide §16–17): the whole page is drawn on four frames only — 1, 3, 4 and 24. Every other beat draws the one region it is about: the main column (2, 5, 7, 8, 9, 13, 15, 16), the status line (19), the phone (20, 22, 23), or the rail alone (6, 10, 11, 12, 14, 17, 18, 21).
- MEASURE, DO NOT ASSERT. Where the narration says a number, the number is on screen as the thing it measures: the dead space is a dashed region labelled `≈ 400 px of nothing`, the rail is a labelled `320 px` bracket, the phone video is a strip with `15%` beside it.
- palette from `frame.md`, as tokens: paper ground, ink voice, ONE coral per frame — the lit region, OR the recommended option card, OR one small tag. Never a second.
- DECISION BEATS (6, 14, 21): option cards of equal weight under the page, the recommended one bordered coral, each with its cost in mono under it. The player pauses at the end of the frame and also offers your own answer in text.
- motion grammar: power3 settles, regions travel on the spoken cue, held read at the end; every frame holds still ≥ 2 s before it ends, and frame 24 holds ≥ 4 s. Animate transforms and absolute position only — never margin, letter-spacing, line-height, font-size, width or padding (`gsap_non_transform_motion`).
- negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; no screenshots of the real page (a wireframe reads, a screenshot does not); nothing below y 900.


## Frame 1 — You are in it

- chapter_start: What is wrong, and step 1
- scene: The whole page card draws in, region by region, in the order the eye meets them; the video region is the one coral outline
- voiceover: "You are watching this inside the page we are about to fix. It exists so one busy reviewer can watch a plan and make two or three calls. Measured against that, three things are wrong, and none of them are matters of taste."
- duration: 11.755s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: The subject is the surface you are standing on
- beat: Hook
- blueprint: compose
- focal: the page card
- roles: page card = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Names the subject and that the viewer is inside it.
keyMessage: The page you are watching this in is the thing being changed.

Scene 1 (0.0–2.0s): kicker ✱ "TODAY · THE PAGE AS IT IS" fades in top-left; the empty rail (6 dashed slots) fades to 100%.
Scene 2 (2.0–5.0s): on "inside the page" the page card scales from 0.98 to 1 and its border draws; title, video, transport and tools regions fade in top to bottom, 0.12s apart.
Scene 3 (5.0–7.5s): on "two or three calls" the four rail lists fade in on the right of the card.
Scene 4 (7.5–9.0s): on "three things are wrong" the video region's coral outline appears (the frame's one coral).
Scene 5 (9.0–11.0s): hold.


## Frame 2 — The sheet crops the evidence

- scene: Main column only, enlarged; a frame of the upload diagram inside the video region; the decision sheet rises and cuts Blob store and Sweeper in half
- voiceover: "Here is the first. When the video asks where the manifest lives, the sheet carrying that question covers the picture of where things live. Blob store and Sweeper are cut in half. You are asked to choose between two stores while the evidence is sliced through the middle."
- duration: 14.144s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-fault-crop.html
- type: problem
- persuasion: Show the defect happening
- beat: Unease
- blueprint: compose
- focal: the cut line where the sheet meets the two store labels
- roles: video region = foreground subject · sheet = supporting · rail = anchor · paper ground = background
- sfx: none

narrativeRole: The first fault, performed rather than described.
keyMessage: The question covers the picture the question is about.

Scene 1 (0.0–2.5s): the main column travels left and scales up to fill from x 660 to x 1840; inside the video region three small store tiles read "Manifest", "Blob store", "Sweeper".
Scene 2 (2.5–6.0s): on "asks where the manifest lives" the sheet slides up from the bottom of the video region to y = 55% of it, with the question "Where does the manifest live?" on it.
Scene 3 (6.0–9.5s): on "cut in half" a coral hairline runs along the sheet's top edge, and the halves of "Blob store" and "Sweeper" above it are the only labels still legible; the bottom halves are behind the sheet.
Scene 4 (9.5–13.0s): on "sliced through the middle" the coral line pulses once; hold.


## Frame 3 — The video is the smallest thing on its own page

- scene: The whole page again, with three measurements drawn on it: 1040 px across the video, the dashed dead region below it, a 320 px bracket over the rail
- voiceover: "The second. The video is the smallest thing on its own page. On a laptop it gets a thousand and forty pixels of width, then about four hundred pixels of nothing below it, while a fixed three hundred and twenty pixel rail stacks four lists of equal weight."
- duration: 13.803s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-fault-space.html
- type: problem
- persuasion: Measurement, not opinion
- beat: Unease
- blueprint: compose
- focal: the dashed dead region
- roles: page card = foreground subject · measurement rules = supporting · rail = anchor · paper ground = background
- sfx: none

narrativeRole: The second fault, measured on the artefact itself.
keyMessage: 400 px of nothing below the video, beside a fixed 320 px rail.

Scene 1 (0.0–3.0s): the main column travels back to its place; the whole page is drawn again, dimmed to 0.85 except the video region.
Scene 2 (3.0–6.0s): on "a thousand and forty pixels" a hairline measurement rule draws across the video region with a mono "1040 px" label.
Scene 3 (6.0–10.0s): on "four hundred pixels of nothing" the dead region's dashed coral border draws from the top-left corner clockwise and its label fades in (the frame's one coral).
Scene 4 (10.0–12.0s): on "three hundred and twenty pixel rail" a bracket draws over the rail column with a mono "320 px" label; the four lists' bars all sit at the same weight.
Scene 5 (12.0–14.0s): hold.


## Frame 4 — Step 1: give the video the page

- scene: The regions travel: the main column widens to the full card, the rail lists drop below it, the dead region collapses to nothing as the video takes the space
- voiceover: "So, step one. Give the video the page. One column, video first, at whatever width the window allows. The rail stops being a fixed sibling competing for width, and the empty four hundred pixels go back to the picture."
- duration: 12.523s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: The fix as a movement, not a claim
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the video region growing
- roles: page card = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Step 1 rearranges the page in front of you.
keyMessage: One column, video first, at the width the window allows.

Scene 1 (0.0–2.0s): rail slot 1 fills (ink, not coral) and reads "Give the video the page".
Scene 2 (2.0–5.5s): on "one column, video first" the four rail lists translate down and out of the card's right column and land in a row across its bottom, each shrunk to a header strip; use transform only.
Scene 3 (5.5–8.5s): on "whatever width the window allows" the video region scales on its own transform origin to span the full card width and the height the dead region used to hold; the dashed dead region fades out as the video passes over it; the video outline is the one coral.
Scene 4 (8.5–11.0s): on "back to the picture" a mono tag "+400 px" fades in at the video's bottom-right; hold.


## Frame 5 — Step 2: never crop the evidence

- scene: Main column only, in its new full width; the sheet rises again and is stopped by a coral rule at the video's lower edge
- voiceover: "Step two follows from the first complaint. Never crop the frame a decision is about. The sheet and the stage have to share the space instead of one covering the other. There is more than one way to do that, so this one is yours."
- duration: 12.309s
- transition_in: crossfade
- status: outline
- src: compositions/frames/05-step-2.html
- type: feature_showcase
- persuasion: State the rule, then show it holding
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the rule the sheet stops at
- roles: video region = foreground subject · sheet = supporting · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Step 2 states the rule and hands the reader the fork.
keyMessage: The sheet and the stage share space; they do not cover each other.

Scene 1 (0.0–2.0s): rail slot 2 fills, "Never crop the evidence"; the main column travels up and scales to fill.
Scene 2 (2.0–5.0s): on "never crop the frame" the sheet rises from the bottom as in frame 2 and is halted by a coral hairline at the video's bottom edge; the three store tiles stay whole (the frame's one coral is that rule).
Scene 3 (5.0–8.0s): on "share the space" the video region and the sheet settle into a stacked pair with a visible gap between them.
Scene 4 (8.0–11.0s): on "this one is yours" a mono "YOUR CALL · STEP 2" kicker fades in above the card; hold.


## Frame 6 — Choice 1: what happens to the video

- scene: Rail only, slot 2 lit; three option cards across the bottom, each a small wireframe of what that option does, B bordered coral
- voiceover: "When a decision is asked, what happens to the video? A: the stage shrinks, so the whole frame stays visible above the sheet, smaller. B: the sheet floats over the lower third, and it can fold away on request to show the frame underneath, then reopen. C: the video steps aside and the sheet takes the column. I recommend B: the picture stays full size, and folding answers the one real cost — you are never stuck looking at a smaller frame, or a covered one. Which do you want?"
- duration: 26.767s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-decision-1.html
- type: cta
- persuasion: Three options, each costed, one recommended
- beat: Focus
- blueprint: comparison-split
- decision: q1
- plan_step: 2
- question: When a decision is asked, what happens to the video?
- option_a: The stage shrinks
- option_b: The sheet overlays the lower third
- option_c: The video steps aside
- why_a: the whole frame stays visible above the sheet; the picture is smaller exactly when you are studying it
- why_b: the picture keeps every pixel, and folding the sheet away and back covers the one real cost — nothing stays smaller or covered longer than you ask for
- why_c: the clearest reading of the question; you lose the picture you are deciding about
- recommended: b
- focal: the three option cards
- roles: option cards = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: The first fork, with each option drawn as the layout it produces.
keyMessage: Folding is what makes the full-size picture free.

Scene 1 (0.0–2.0s): the page card fades out; the rail holds with slots 1–2 filled and slot 2 dimmed-lit; kicker "YOUR CALL · STEP 2".
Scene 2 (2.0–7.0s): on "A: the stage shrinks" card A pops in at left 700 with a mini wireframe — a small video block above a sheet block.
Scene 3 (7.0–11.0s): on "B: the sheet floats, and it can fold away" card B pops in at left 1100 — a full-size video block with a sheet block lying across its bottom third — and the coral border (the frame's one coral).
Scene 4 (11.0–14.5s): on "C: the video steps aside" card C pops in at left 1500 — a sheet block alone with the video block pushed off to a thin edge.
Scene 5 (14.5–19.0s): on "folding answers the one real cost" card B's border brightens once; all three hold to the end.


## Frame 7 — If the stage shrinks

- scene: Main column only; the video scales down in place and the sheet takes the freed space below it; the three store tiles stay whole and readable
- voiceover: "With A, nothing is ever cropped. The cost is a smaller picture at exactly the moment you are studying it."
- duration: 5.504s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-branch-1a.html
- type: benefit_highlight
- persuasion: Consequence, with its cost
- beat: Clarity
- blueprint: compose
- branch: q1=a
- plan_step: 2
- focal: the whole, smaller frame
- roles: video region = foreground subject · sheet = supporting · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Consequence of option A.
keyMessage: Nothing is cropped; the picture is smaller while you study it.

Scene 1 (0.0–3.0s): the video region scales to 0.72 from its top edge and the sheet slides up into the space below; all three store tiles remain whole.
Scene 2 (3.0–5.0s): on "nothing is ever cropped" a coral tick appears beside the tiles (the one coral).
Scene 3 (5.0–7.0s): on "smaller picture" a mono "-28%" tag fades in at the video's corner; hold.


## Frame 8 — If the sheet overlays

- scene: Main column only; the video keeps its size and the sheet lies across its bottom third, over the caption band; a fold hint sits in the sheet's clear corner
- voiceover: "With B, the picture keeps every pixel it had, and the sheet sits on the bottom third of it, captions included — but it folds away on request, so nothing stays covered longer than you ask for."
- duration: 10.517s
- transition_in: crossfade
- status: outline
- src: compositions/frames/08-branch-1b.html
- type: benefit_highlight
- persuasion: Consequence, with its mitigation
- beat: Relief (the cost, then its fix)
- blueprint: compose
- branch: q1=b
- plan_step: 2
- focal: the covered caption band, then the fold hint
- roles: sheet = foreground subject · video region = anchor · paper ground = background
- sfx: none

narrativeRole: Consequence of option B, and what removes its cost.
keyMessage: Full-size picture; folding it away is what makes the cost temporary.

Scene 1 (0.0–3.0s): the video region holds at full size; the sheet translates up from below and settles across its bottom third.
Scene 2 (3.0–5.0s): on "captions included" the caption band beneath the sheet is drawn in coral hairline and then goes behind it (the one coral).
Scene 3 (5.0–7.0s): on "folds away on request" a small "⇕ folds away, reopens" hint fades in at the sheet's clear top-right corner; hold.


## Frame 9 — If the video steps aside

- scene: Main column only; the video translates left to a thin edge and the sheet takes the column
- voiceover: "With C, the question reads best of the three, and the thing you are deciding about is not on screen while you decide."
- duration: 6.336s
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-branch-1c.html
- type: benefit_highlight
- persuasion: Consequence, with its cost
- beat: Unease (a cost)
- blueprint: compose
- branch: q1=c
- plan_step: 2
- focal: the sheet, alone
- roles: sheet = foreground subject · the video edge = supporting · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Consequence of option C.
keyMessage: Clearest question; no picture while you decide.

Scene 1 (0.0–3.0s): the video region translates left until only a 40 px edge is on screen; the sheet expands into the column.
Scene 2 (3.0–5.0s): on "not on screen" a coral hairline marks the video's remaining edge (the one coral).
Scene 3 (5.0–7.0s): hold.


## Frame 10 — Next

- scene: Rail only; slots 1 and 2 filled, slot 3 outlined ahead
- voiceover: "Next: where the question lives, and where comments live."
- duration: 2.965s
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-part-1-close.html
- type: transition
- persuasion: Name what comes next
- beat: Rest
- blueprint: compose
- focal: rail slot 3
- roles: rail = foreground subject · paper ground = background
- sfx: none

narrativeRole: Closes part 1.
keyMessage: Next: the question's home, and comments.

Scene 1 (0.0–2.0s): the page card fades out; slots 1 and 2 hold filled.
Scene 2 (2.0–4.0s): slot 3's dashed outline goes coral for a beat (the one coral); hold.


## Frame 11 — Part 2 of 3

- scene: Rail only; part title card over it
- voiceover: "Part two of three: one home per question, and comments where you already are."
- duration: 3.989s
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-part-2-open.html
- chapter_start: One home per question, and comments
- type: transition
- persuasion: Set the sitting
- beat: Rest
- blueprint: compose
- focal: the part title
- roles: part title = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Opens part 2.
keyMessage: Part 2 of 3: the question's home, and comments.

Scene 1 (0.0–2.5s): a mono kicker "PART 2 OF 3" and the title "One home per question" fade up over the held rail.
Scene 2 (2.5–5.0s): slots 3 and 4 outlines brighten in ink; hold.


## Frame 12 — Step 3: one home per question

- scene: The sheet and the rail's decisions list side by side, both carrying the same question; the rail copy changes from a question to a record
- voiceover: "Step three, and the third complaint. The open question is asked in two places at once: the sheet asks it, and the rail lists it as not yet, watch. After this, a decision is asked in exactly one place, and the rail records what was answered, not what is being asked."
- duration: 15.061s
- transition_in: crossfade
- status: outline
- src: compositions/frames/12-step-3.html
- type: feature_showcase
- persuasion: Show the duplicate, then remove it
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the two copies of the same question
- roles: sheet + rail decisions list = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Step 3 removes the duplicate.
keyMessage: A question is asked in one place; the rail records answers.

Scene 1 (0.0–3.0s): rail slot 3 fills; the sheet and the rail's Decisions list slide in from opposite sides, both reading "Where does the manifest live?".
Scene 2 (3.0–6.5s): on "two places at once" a coral hairline links the two identical lines (the one coral).
Scene 3 (6.5–10.0s): on "exactly one place" the rail copy crossfades from the question to a record line "Manifest store · answered"; the link fades.
Scene 4 (10.0–13.0s): hold.


## Frame 13 — Step 4: comment where attention is

- scene: Main column only; the comment composer travels from the bottom of the rail up to sit directly under the video
- voiceover: "Step four. The thing we most want you to do — leave a comment on a moment — currently sits below three other sections. A comment is about what is on screen, so it belongs next to what is on screen."
- duration: 10.688s
- transition_in: crossfade
- status: outline
- src: compositions/frames/13-step-4.html
- type: feature_showcase
- persuasion: The fix as a movement
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: the composer travelling
- roles: composer = foreground subject · video region = anchor · paper ground = background
- sfx: none

narrativeRole: Step 4 moves the composer to the frame.
keyMessage: A comment belongs next to the moment it is about.

Scene 1 (0.0–3.0s): rail slot 4 fills; the four rail list headers are drawn in a column with Comments fourth and dimmest.
Scene 2 (3.0–7.0s): on "below three other sections" a mono "4th" tag marks it; on "next to what is on screen" the composer block translates up and left to land under the video region, its border going coral as it lands (the one coral).
Scene 3 (7.0–11.0s): on "what is on screen" a timestamp chip "1:12" fades in on the composer; hold.


## Frame 14 — Choice 2: where comments live

- scene: Rail only, slot 4 lit; two option cards, each a mini wireframe, A bordered coral
- voiceover: "So, where do comments live? A: under the video, in the main column, always in view, but pushing the video up and competing with the toolbar for the space right under the frame. B: in the rail, at the top, which keeps the column clean and puts them below the fold on a narrow screen. I recommend A. Which do you want?"
- duration: 16.725s
- transition_in: crossfade
- status: outline
- src: compositions/frames/14-decision-2.html
- type: cta
- persuasion: Two options, each costed, one recommended
- beat: Focus
- blueprint: comparison-split
- decision: q2
- plan_step: 4
- question: Where do comments live?
- option_a: Under the video
- option_b: In the rail, at the top
- why_a: always in view while watching; pushes the video up and competes with the toolbar
- why_b: keeps the main column clean; on a narrow screen the rail is below the fold again
- recommended: a
- focal: the two option cards
- roles: option cards = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: The second fork.
keyMessage: A comment is about the moment on screen.

Scene 1 (0.0–2.0s): kicker "YOUR CALL · STEP 4" over the held rail.
Scene 2 (2.0–7.0s): on "A: under the video" card A pops in at left 760 — video block with a composer strip under it — coral border (the one coral); a mono "-40 px of video" cost line under it.
Scene 3 (7.0–12.0s): on "B: in the rail" card B pops in at left 1320 — video block with the composer in a side column; a mono "below the fold at 430 px" cost line.
Scene 4 (12.0–15.0s): on "I recommend A" card A's border brightens once; hold.


## Frame 15 — If comments sit under the video

- scene: Main column only; the composer lands under the frame and the toolbar moves up beside the transport
- voiceover: "With A, the composer is under the frame it is about, and the toolbar moves up beside the transport."
- duration: 5.227s
- transition_in: crossfade
- status: outline
- src: compositions/frames/15-branch-2a.html
- type: benefit_highlight
- persuasion: Consequence, with its cost
- beat: Clarity
- blueprint: compose
- branch: q2=a
- plan_step: 4
- focal: the composer under the frame
- roles: composer = foreground subject · video region = anchor · paper ground = background
- sfx: none

narrativeRole: Consequence of option A.
keyMessage: Composer under the frame; toolbar joins the transport.

Scene 1 (0.0–3.5s): the composer translates into place under the video; the tools strip translates up to sit on the transport row's right.
Scene 2 (3.5–5.0s): on "beside the transport" the merged row's border goes coral once (the one coral).
Scene 3 (5.0–7.0s): hold.


## Frame 16 — If comments sit in the rail

- scene: Main column only; the composer travels into the rail column's top and, at 430 px, drops below the fold line
- voiceover: "With B, the main column is only the video, and on a phone the comments are below the fold again."
- duration: 5.227s
- transition_in: crossfade
- status: outline
- src: compositions/frames/16-branch-2b.html
- type: benefit_highlight
- persuasion: Consequence, with its cost
- beat: Unease (a cost)
- blueprint: compose
- branch: q2=b
- plan_step: 4
- focal: the fold line
- roles: fold line = foreground subject · composer = supporting · paper ground = background
- sfx: none

narrativeRole: Consequence of option B.
keyMessage: Clean column; comments below the fold on a phone.

Scene 1 (0.0–3.0s): the composer translates up into the rail column's top slot; the main column holds, video only.
Scene 2 (3.0–5.5s): on "below the fold" a coral dashed fold line draws across the card and the composer sits under it (the one coral).
Scene 3 (5.5–7.0s): hold.


## Frame 17 — Next

- scene: Rail only; slots 1 to 4 filled, slot 5 outlined ahead
- voiceover: "Last part: the status line, and the phone."
- duration: 2.389s
- transition_in: crossfade
- status: outline
- src: compositions/frames/17-part-2-close.html
- type: transition
- persuasion: Name what comes next
- beat: Rest
- blueprint: compose
- focal: rail slot 5
- roles: rail = foreground subject · paper ground = background
- sfx: none

narrativeRole: Closes part 2.
keyMessage: Next: the status line, and the phone.

Scene 1 (0.0–2.0s): slots 1–4 hold filled.
Scene 2 (2.0–4.0s): slot 5's dashed outline goes coral for a beat (the one coral); hold.


## Frame 18 — Part 3 of 3

- scene: Rail only; part title card over it
- voiceover: "Part three of three: one fact per line, and what a phone gets."
- duration: 3.285s
- transition_in: crossfade
- status: outline
- src: compositions/frames/18-part-3-open.html
- chapter_start: One fact per line, and the phone
- type: transition
- persuasion: Set the sitting
- beat: Rest
- blueprint: compose
- focal: the part title
- roles: part title = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Opens part 3.
keyMessage: Part 3 of 3: the status line, and the phone.

Scene 1 (0.0–2.5s): a mono kicker "PART 3 OF 3" and the title "One fact per line" fade up over the held rail.
Scene 2 (2.5–5.0s): slots 5 and 6 outlines brighten in ink; hold.


## Frame 19 — Step 5: one fact per line

- scene: The status line itself, drawn full width as one long sentence, which breaks into six separate facts that fly to where each belongs
- voiceover: "Step five. The status line currently carries six facts in one sentence: waiting at fifty-five seconds, for choice one, step one, part one of three, two marks, none of three decided, not approved. After this it says what is happening now, and every other fact moves to the place that already owns it."
- duration: 16.853s
- transition_in: crossfade
- status: outline
- src: compositions/frames/19-step-5.html
- type: feature_showcase
- persuasion: The sentence taken apart in front of you
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: the sentence coming apart
- roles: status line = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Step 5 takes the overloaded line apart.
keyMessage: The status line says what is happening now; the rest goes where it belongs.

Scene 1 (0.0–3.0s): rail slot 5 fills; the real status line is drawn across the card as one line of mono, six facts separated by middots.
Scene 2 (3.0–7.5s): on "six facts" each fact is boxed in a hairline, one after another, 0.35s apart.
Scene 3 (7.5–11.0s): on "moves to the place that already owns it" five of the six boxes translate away to labelled destinations — Decisions, Steps, Chapters, Marks, Approve — and the one that stays goes coral: "Waiting at 0:55" (the one coral).
Scene 4 (11.0–13.0s): hold.


## Frame 20 — Step 6: the phone

- scene: The phone outline at readable size; today's layout inside it, with the video a strip labelled 15%, then everything else collapsing behind the frame
- voiceover: "Step six. On a phone, the video is the page. Today it is about fifteen percent of it, with a caption under it you cannot read. Everything else collapses behind the frame."
- duration: 9.515s
- transition_in: crossfade
- status: outline
- src: compositions/frames/20-step-6.html
- type: feature_showcase
- persuasion: The worst case, measured
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: the video strip
- roles: phone = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: Step 6 gives the phone to the video.
keyMessage: On a phone the video is the page; everything else collapses behind it.

Scene 1 (0.0–3.0s): rail slot 6 fills; the phone outline scales in from 0.96 with today's layout — a thin video strip at the top and four stacked lists below.
Scene 2 (3.0–6.0s): on "about fifteen percent" a bracket and a mono "15%" label draw beside the strip; on "cannot read" a tiny illegible caption line under it.
Scene 3 (6.0–9.0s): on "the video is the page" the four lists translate down out of the phone and the video strip scales up to fill it; the frame's border goes coral (the one coral).
Scene 4 (9.0–11.0s): hold.


## Frame 21 — Choice 3: what the phone rail becomes

- scene: Rail only, slot 6 lit; two option cards, each a mini phone, A bordered coral
- voiceover: "So on a phone, what happens to the rail? A: one sheet you pull up over the video when you want it. B: tabs under the video, one list at a time. I recommend A, because a phone reviewer is watching, not browsing, and a sheet keeps the frame uncovered until you ask for something else. Which do you want?"
- duration: 15.851s
- transition_in: crossfade
- status: outline
- src: compositions/frames/21-decision-3.html
- type: cta
- persuasion: Two options, each costed, one recommended
- beat: Focus
- blueprint: comparison-split
- decision: q3
- plan_step: 6
- question: On a phone, what happens to the rail?
- option_a: One sheet you pull up
- option_b: Tabs under the video
- why_a: the video stays uncovered until you ask; everything is one pull away
- why_b: one list is always visible; it always costs the video that strip
- recommended: a
- focal: the two option cards
- roles: option cards = foreground subject · rail = anchor · paper ground = background
- sfx: none

narrativeRole: The third fork.
keyMessage: A phone reviewer is watching, not browsing.

Scene 1 (0.0–2.0s): kicker "YOUR CALL · STEP 6" over the held rail.
Scene 2 (2.0–7.0s): on "one sheet you pull up" card A pops in at left 760 — a phone with a full-bleed video and a sheet handle at the bottom — coral border (the one coral).
Scene 3 (7.0–11.0s): on "B: tabs" card B pops in at left 1320 — a phone with a video and a tab strip under it, one list showing.
Scene 4 (11.0–15.0s): on "watching, not browsing" card A's border brightens once; hold.


## Frame 22 — If one sheet

- scene: The phone, full-bleed video, a sheet pulling up over it and falling back
- voiceover: "With A, the phone shows the video and nothing else until you pull, and one sheet holds all three lists."
- duration: 5.376s
- transition_in: crossfade
- status: outline
- src: compositions/frames/22-branch-3a.html
- type: benefit_highlight
- persuasion: Consequence, shown as the gesture
- beat: Clarity
- blueprint: compose
- branch: q3=a
- plan_step: 6
- focal: the sheet travelling
- roles: phone = foreground subject · sheet = supporting · paper ground = background
- sfx: none

narrativeRole: Consequence of option A.
keyMessage: Video uncovered until you pull; one sheet holds all three lists.

Scene 1 (0.0–3.0s): the phone holds with a full-bleed video; a handle sits at the bottom edge.
Scene 2 (3.0–5.5s): on "until you pull" the sheet translates up to cover two thirds, showing three list headers, then settles; its handle is coral (the one coral).
Scene 3 (5.5–7.0s): hold.


## Frame 23 — If tabs

- scene: The phone with a permanent tab strip under the video; the video is shorter by exactly that strip
- voiceover: "With B, one list is always visible under the video, and it always costs the video that strip."
- duration: 5.205s
- transition_in: crossfade
- status: outline
- src: compositions/frames/23-branch-3b.html
- type: benefit_highlight
- persuasion: Consequence, with its cost
- beat: Unease (a cost)
- blueprint: compose
- branch: q3=b
- plan_step: 6
- focal: the strip the video loses
- roles: tab strip = foreground subject · phone = anchor · paper ground = background
- sfx: none

narrativeRole: Consequence of option B.
keyMessage: A list is always visible, and the video is always shorter by that strip.

Scene 1 (0.0–3.0s): the tab strip translates up into place and the video block scales down from its top edge to make room.
Scene 2 (3.0–5.5s): on "costs the video that strip" the lost band is marked with a coral hairline and a mono "-96 px" tag (the one coral).
Scene 3 (5.5–7.0s): hold.


## Frame 24 — The resolved plan

- scene: The whole page in its new shape, all six rail slots filled, the three answered calls tagged on their steps
- voiceover: "That is the plan: six steps, three calls. The palette, the type and the annotation tools are settled, and this does not reopen them. It is only about where things sit and how much room the video gets. Answer the three, mark anything else you want changed, and approve — or send it back."
- duration: 15.317s
- transition_in: crossfade
- status: outline
- src: compositions/frames/24-resolved.html
- type: cta
- plan_questions: 1,2,3
- persuasion: The plan, resolved, with one action
- beat: Resolution
- blueprint: compose
- focal: the rail, complete
- roles: rail = foreground subject · page card = anchor · paper ground = background
- sfx: none

narrativeRole: Ends resolved, with the reviewer's two moves.
keyMessage: Six steps, three calls; approve or send it back.

Scene 1 (0.0–3.5s): the page card is drawn in its new shape — one column, video first at full width, lists as a row of headers beneath, composer under the frame.
Scene 2 (3.5–7.0s): on "six steps" the six rail slots fill in order, 0.2s apart.
Scene 3 (7.0–10.0s): on "three calls" coral tags land on slots 2, 4 and 6 carrying the chosen option (the frame's coral, used once as a set).
Scene 4 (10.0–14.0s): on "approve — or send it back" a mono line "answer 3 · mark · approve" fades in under the rail; hold still to the end.
