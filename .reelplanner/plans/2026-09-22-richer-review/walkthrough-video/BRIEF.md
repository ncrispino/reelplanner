---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The richer-review plan as built: all six steps landed, one with a deviation; fifteen calls the plan did not cover, each to accept or flag; what the review asked for on top; what ran and what did not"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer who approved the richer-review plan, deciding whether to accept what was built, including someone new to the repo
length: a series of five parts, 60–75 s each
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-22-richer-review`, built with
`--walkthrough walkthrough.md` (style guide §13) from the plan's own `walkthrough.md` — the first
walkthrough built from real code rather than a hand-written example. Same stage, look and names as
this plan's video (`../video/`): the rail's six slot titles, the parts at their `system.json` places
with their `glossary.md` names, the project theme.

## Customizations

- One what-changed beat per step (6), one autonomy beat per row A1–A15, the step-5 deviation as its
  own autonomy beat (`- autonomy: d1`), quiz beats K1 (after step 2) and K2 (after step 6), two beats
  for what the review asked for (the part bar and keys; a note on any answer; the sound fix is A15),
  and the ending: what ran, what is not tested, flag a call or accept.
- At most six parts on screen (§19): the plan video's four, then finish-project at A2 and the revise
  step at A6, one new part per beat.
- A6, A13, A14 (notes) and A15 (sound) have no step in the autonomy table; they carry the nearest
  step so a flag lands somewhere: notes on answers → step 1, the sound fix → step 4 (typing in a
  comment was the bug).
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25. No MP4: the review player plays
  the HTML project.

## Notes

Autonomous run. Frames were written by one generator (no per-frame sub-agents were available in
this run), each reveal timed to its word from `audio_meta.json`.
