---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The review half works; this plan builds the half after approve: implement to the plan, check it, walk it through, act on flags, keep one system video current"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer reviewing this implementation plan (reelplanning's own) before approving it
length: a series of four parts, about a minute each
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns the repo's own plan
`.reelplanning/plans/2026-09-22-close-the-lifecycle/plan.md` into its review video. Brownfield (this
repo), built from the project record (style guide §14): names from `glossary.md`, the stage from
`system.json` via `reel stage`, the look from `.reelplanning/theme/frame.md`.

Six steps and three open questions (q1 on step 3, q2 on step 5, q3 on step 6). Style guide §16–§18:
a series of four parts of about a minute; an opener and a closer per part; a decision beat per
question followed by one branch beat per option; a resolved-plan ending.

## Customizations

- The stage is a node graph (kind `dataflow`, reason recorded in `system.json`): the review loop that
  exists today is the upper rectangle, the build loop this plan adds runs along the bottom and rejoins
  it at the review player and finish-project.
- A "today" beat (brownfield, knowledge `new,familiar`) before the cast.
- Steps 1 and 2 show the thing itself (the system video's tagged frames; the autonomy log in
  `walkthrough.md`) with the rail only; steps 3–6 change the diagram and use the full stage.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25.

## Notes

Autonomous run (the one kept question — preview or render — answered: render, with chapter MP4s).
