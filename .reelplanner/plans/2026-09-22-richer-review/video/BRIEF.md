---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The first real review found limits in the review format itself; this plan fixes them: up to four options, pick-all questions, as many questions as needed, words on a mark, diagrams a newcomer can follow, and feedback only a video can give"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer reviewing this plan (reelplanning's own) before approving it, including someone new to the repo
length: a series of four parts, under a minute each watched
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns the repo's own plan
`.reelplanning/plans/2026-09-22-richer-review/plan.md` into its review video. Brownfield (this
repo), built from the project record (style guide §14): names from `glossary.md`, the stage from
`system.json` via `reel stage`, the look from `.reelplanning/theme/frame.md`.

Six steps and two open questions, each with THREE options (q1 on step 2, q2 on step 6). Style guide
§16–§18: a series of four parts; an opener and a closer per part; a decision beat per question
followed by one branch beat per option (three each); a resolved-plan ending.

## Customizations

- The reviewer feedback that motivated this plan is applied to the video itself: at most six parts
  on screen at once, one new thing per beat, plain names (each part's glossary line as a chip), and
  a resolved-plan ending that shows the steps and the choices, not the component diagram.
- The stage shows only the four parts the plan touches (the plan-to-video skill gets its first stage
  position in `system.json`: x 632, y 175, the free cell in the grid the close-the-lifecycle video
  uses). Full stage on the today beat and step 6 only.
- Steps 1–5 are prototypes of the player's own surfaces with the rail reduced to a spine.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25.

## Notes

Autonomous run (the one kept question — preview or render — answered: render, with chapter MP4s).
