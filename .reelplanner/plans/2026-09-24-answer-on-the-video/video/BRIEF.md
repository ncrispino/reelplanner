---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Two independent changes: you answer on the frame (steps 1 and 2: the frame's option cards take the click, and the sheet stops repeating the question), and the record is editable where it is listed (step 3). Step 4 checks both on the videos already on the review page. One open question: where the answers the frame can't take go (step 2), recommendation A, a thin strip under the video."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner reviewing reelplanning's own plan on the review page; they know the player and its question sheet well
length: a series of four short parts, about a minute each
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns
`.reelplanning/plans/2026-09-24-answer-on-the-video/plan.md` into its review video. The problem is a
thing you can see, so the video shows it: a frame with its option cards, the question sheet sliding
up over it and repeating the question, then the same frame whole with a thin strip under it.

## Customizations

- Four short parts: the problem and what changes (before any how); step 1 and its two quick checks;
  step 2, a quick check and question 1; steps 3 and 4 with a quick check each, and the ending.
- One decision beat, `q1`, options A–C, recommended A. One branch beat only, for C: it is the one
  option that changes the plan's shape (clicking the frame's cards is no longer needed). A and B go
  straight on.
- Five quick checks, each a prediction: a click on a pick-all question's card; an older frame whose
  cards carry no `data-option`; how a call is answered once the sheet is gone; an edit after the
  review is sent; where step 4 checks the record's edits.
- Built from the project record: names from `glossary.md`, the look and `frame.md` from
  `.reelplanning/plans/2026-09-22-m3-revise-loop/video/` (the repo theme). The player and its sheet
  are drawn as prototypes, after the real `.decision.sheet` in `packages/player/reelplanning-player.js`.
- New option cards in this video carry `data-option="a"` (and `data-plan-option`), as step 1 asks of
  new frames.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time.

## Notes

Autonomous run: preview only, no MP4. `build` passing through verify is the bar.
