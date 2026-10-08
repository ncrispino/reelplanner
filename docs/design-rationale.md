# Design rationale: why the videos and the review page look the way they do

Every visual choice here has a reason that can be checked. A choice without a reason is decoration, and decoration is what makes generated design look generated. This file is the reference the critique loops (the review page's critique rounds, `videos/*/DESIGN-REVIEW.md`) judge against.

## 1. What the artefacts are for

A plan video is watched once by one busy reviewer who must understand a change and make two or three calls. A walkthrough video is watched once to check what an agent did. The review page is where they watch, draw, decide and export. None of this is marketing. The design goal is **reading speed and confidence**, not delight; the viewer should never notice the design, only the plan.

## 2. The video

| Choice | Reason |
|---|---|
| **Cream ground (#FAF9F5), ink text (#141413)** | Paper contrast without the glare of pure white on a screen that is watched for three minutes; ink at 15:1 keeps every caption readable at 40 px. Dark grounds were rejected: strokes drawn in the review player (ink and coral) read best on light paper, and dark video frames make the cream page around them look broken. |
| **One accent, coral (#B8552E; #D2693F in the dark theme), one element at a time** | The video's job is to direct attention to one thing per beat (`research.md` §1.3, signalling). A second accent halves the effect. Coral was chosen over blue or green because it reads as "hand-marked", the same colour a reviewer's pen uses on the page, so the video's signal and the reviewer's marks share one vocabulary. Small coral tags use #9C4524 so they pass 4.5:1 on cream. The coral was darkened from #CC785C (D-142) because that one failed 3:1 on the tiles and on a light grey page. |
| **Navy only for the data surface** | One dark tile in a cream diagram marks *where state lives* (the manifest store; the content files), which is what most plan decisions are about. Every other part is a cream tile so the eye finds the store first. |
| **EB Garamond for captions and display, Inter for labels, JetBrains Mono for values** | Three voices for three kinds of text: the narrator's sentence (serif, the reading voice), the stage's names (sans, the label voice), the exact values and ids (mono, the code voice). A viewer can tell what kind of text something is before reading it. |
| **The stage: a numbered rail on the left, the system diagram on the right, fixed positions** | A plan is "these steps, on these parts". The rail is the plan; the diagram is the system; a step lights its slot and its part. Positions never change between frames or between videos for the same project, so the viewer learns the map once (`research.md` §1.4, spatial contiguity; the `.reelplanning/system.json` layout makes this a rule). |
| **≤ 5 new on-screen words per beat; captions are full sentences** | Text on screen competes with narration (redundancy effect). Labels are names; the sentence is in the caption, which is the script's sentence so it can be re-read in context. |
| **Reveals on the spoken word** | Temporal contiguity: a thing appears when it is named, never before (the cue sheets make this mechanical). |
| **No gradients, glows, blur, tilt, bokeh, music** | Each of these adds load without meaning. The one texture is a hairline card shadow so tiles sit on the paper. |
| **Motion: power3 settles, 0.4–0.8 s, no bounce** | Motion tells the eye where to look; it must not become the thing looked at. |
| **A decision beat is the stage plus two to four cards, the recommended one bordered** | The choice is made *on the map*: the slot and the part it affects stay lit while the cards appear. Cards are plain so the recommendation border is the only signal. |
| **Chapters of about a minute** | One sitting per chapter; a natural pause to decide or stop. |

## 3. The review page

The page hosts the video and the reviewer's tools. It uses the video's palette and type so a stroke on the video and a note in the list look like the same act, and so the frame does not sit in a foreign-looking box.

| Choice | Reason |
|---|---|
| **The video is the page** | It is the only thing the reviewer came for. It gets the widest column, at the top, at 16:9, with nothing above it but the title line. |
| **Tools sit under the video, in one row, in the order they are used** | Mark (draw, arrow, box; a note on each) → answer on the frame → Finish review. Keyboard letters are shown on the buttons, not in a paragraph. |
| **The rail on the right is the plan, not a sidebar of widgets** | Steps (the gallery), then what the reviewer decided, then what they marked. Chapters are a progress line under the video, since they are about time, not about the plan. |
| **State is written in words** | "Paused at 1:47 · step 2 · chapter 2 of 3", "3 marks, 1 decision, not yet approved". No icons standing in for sentences. |
| **Serif for the plan's sentences, sans for the chrome, mono for times and ids** | The same three voices as the video. |
| **Cream page, no cards inside cards** | One hairline rule separates regions; tiles are used only for things that are selectable (a step, an option). |
| **Finish review is the one filled button** | It ends the review (approve, or ask for changes); everything else is a hairline button. |
| **It works at 1024 and on a phone** | Reviewers watch on a laptop; they answer a question from a phone. Under 720 px the page is one column. |
| **The guide sits under the video** | Scrolling down reads the guide while the video shrinks to a small player that stays in view; the video is never replaced (D-264). |

## 4. The anti-slop checklist (what the critique loops reject)

1. Any colour that is not in the palette (cream, tile, ink, coral, navy) or a tint of ink.
2. A gradient, glow, blur, drop shadow heavier than the hairline card shadow, rounded corner larger than 12 px, or a "glassmorphism" panel.
3. A second accent, or two accented things at once.
4. Decorative icons or emoji where a word would do; icon fonts; illustrations.
5. Centered-everything layouts, hero sections, feature grids, marketing copy, exclamation marks.
6. Text that says nothing ("Welcome to the review page"), placeholder text, or a label that repeats what is visible.
7. Type with no hierarchy (everything 14 px) or with too much (five sizes on one panel). The ramp is: display 22–28 serif, body 15 sans, small 13 sans, mono 12–13.
8. Spacing by feel. Spacing is on an 8 px grid; region gaps 24 or 32; inline gaps 8 or 12.
9. Anything the reviewer cannot act on that takes space (a logo, a tagline, a footer of links).
10. Controls whose state is invisible (a tool that is active but looks the same), or a tool without its keyboard letter.
11. In the video: a beat with more than one coral element; on-screen text that is a narration sentence; a node that jumps between frames (a camera or a move with a meaning may carry it: `motion-language.md`); a reveal before its word; a decorative animation.
12. Anything you cannot say the reason for in one sentence.

## 5. How the loops run

- **Page loop:** the player specs screenshot the page in its states (`RP_SHOTS=<folder> node packages/player/test/access.spec.mjs`, and `size` and `answer-on-frame` the same way) → a critic reads the screenshots against §3 and §4 and writes numbered findings with the fix → an implementer applies them → screenshots again → the critic confirms each finding closed. Three rounds, or until a round has no finding above "nit".
- **Video loop:** `scripts/verify.sh videos/<project>` produces contact sheets → a critic reads them against §2 and §4 and writes per-frame findings → frame workers fix their frame → `check` + snapshots again → the critic confirms. Findings about the *grammar* (something every frame does) go into the style guide, not into one frame.
