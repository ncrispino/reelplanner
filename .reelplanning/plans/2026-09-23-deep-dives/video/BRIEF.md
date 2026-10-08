---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "A plan video tells the story well and fails at what you read at your own pace or try: code, long tables, prototypes, the plan's own text. This plan lets any beat open an HTML page inside the player"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer reviewing this plan (reelplanning's own) before approving it, including someone new to the repo
length: a series of four parts, 60–75 seconds each
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns the repo's own plan
`.reelplanning/plans/2026-09-23-deep-dives/plan.md` into its review video. Brownfield (this
repo), built from the project record (style guide §14): names from `glossary.md`, the stage from
`system.json` via `reel stage`, the look from `.reelplanning/theme/frame.md`.

Six steps and three open questions: q1 (step 1) and q2 (step 2) with THREE options each, q3
(step 4) with TWO. Two decisions in force, never asked: D-005 on step 1, D-004 on step 2. Style
guide §16–§19: a series of four parts; an opener and a closer per part; a decision beat per
question followed by one branch beat per option; a callback to the hook; a resolved-plan ending.

## Customizations

- One worked example runs through the whole video: the upload-resume walkthrough's call A1,
  `src/upload/parts.ts` line 14 (16 MB parts instead of 8). The hook fails on it; the callback
  resolves it inside the player.
- The plan changes how the review looks, so steps are prototypes of the player's own surfaces with
  the rail reduced to a spine. The node stage appears on step 4 only (the implement step → the
  review player). At most six parts on any frame.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time
  (`HYPERFRAMES_TTS_CONCURRENCY=1`).

## Notes

Autonomous run (the one kept question — preview or render — answered: preview only; no MP4s this
build, `finish-project` and a clean `verify` are the bar).
