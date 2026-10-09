---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Four steps, three questions. The frame marks the one thing a detail explains with data-detail (a code block, a line, a table row, a pinned word), and frame-lint and the details check hold it (step 1); the player lays a clear button over it, as over an answer card, ringed in coral under your pointer or focus, reached by Tab, Enter or O, hidden while a question is asked; what shows it opens is question 1 (step 2); a click pauses the video and opens the page, the thing stays ringed, closing plays on; where the page opens asks decision D-021 again, question 2 (step 3); the corner chip becomes the fallback, older videos keep theirs until rebuilt, the plan text's list stays, question 3 (step 4)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for details to open by a click in the video, as answering does; knows the system video and the review page; missed four of five quick checks on the last plan video, so each check here tests the case the scene before it just showed
length: about four and a half minutes, five chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-27-details-in-the-frame/plan.md`: the owner asked, in the
better-visuals walkthrough review, for detail pages to open by a click within the video, as a question is
answered on its card. The video starts on the real thing the owner meant (scene 12 of the deep-dives
walkthrough on the review page: the code in the middle, the Open chip in the corner, the side panel it
opens), sets the answer card beside it as the model, and then shows each step on that same scene: the
block marked, the block as the button (a mock, labelled planned), what a click does, and what becomes of
the chip. Question 2 asks decision D-021 again, and says so.

## Customizations

- Medium: real screens of the review page, real frames, a markup line, wireframes and diagrams; composition varies per scene.
- Layouts: a real screen with rings (1, 2), a real screen beside a quote (3), a row of tiles (4), a list (5), a real frame over its markup (6), a real frame under a camera (7), a frame outline with struck boxes (8), question cards over a frozen case (quick checks, questions), a mock over the real frame (10), a wireframe (11), a row of states over a log line (17), before-and-after wireframes (branches of question 2), three rows with small pictures (23), the plan's steps (29).
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a question or a quick check; crossfade for a branch and the ending.
- Real things: scene 1 (the review page on the deep-dives walkthrough's scene 12, its Open chip in the corner), 2 (the same page with the side panel open), 3 (the contributing video's quick check with a card under the pointer, and the owner's words from the review file), 6 (the real frame of scene 12, with its markup planned), 7 (the pinned word on `scripts/check-terms.mjs` in the better-visuals plan video); scene 10 is a mock of the new click over the real frame, labelled planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; quick-check and question cards carry `data-option`, headings `data-question`, outside any camera; the camera is at rest when a quick check ends.
- Question 2 re-asks decision D-021 (the side panel): its scene says so, with keeping the side panel as option A (style guide §6, superseded decisions).
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the HTML project.

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on.
Frames are written by one generator (adapted from the contributing video's), each reveal timed to its
word from `audio_meta.json`. The screenshots in `assets/shots/` were taken from the review player
(`packages/player/?project=…`) at 1440 × 900: the deep-dives walkthrough at 1:50, the contributing video's
quick check 2 with the pointer on card B, and the better-visuals plan video at 1:16.
