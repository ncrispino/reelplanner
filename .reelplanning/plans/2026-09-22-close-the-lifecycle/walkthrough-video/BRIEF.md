---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The close-the-lifecycle plan as built: all six steps landed; nineteen calls the plan did not cover and two deviations, each to accept or flag; a fresh agent's code check found thirteen things, all answered; what ran and what is not done"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer who approved the close-the-lifecycle plan, deciding whether to accept what was built, including someone new to the repo
length: a series of six parts, 60–75 s each
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-22-close-the-lifecycle`, built with
`--walkthrough walkthrough.md` (style guide §13) from the plan's own `walkthrough.md`, the second
walkthrough built from real code. Same look, beats and tags as the first
(`../../2026-09-22-richer-review/walkthrough-video/`): the rail with this plan video's six slot
titles (`../video/`), parts with their `glossary.md` names, the project theme.

## Customizations

- One what-changed beat per step (6); one autonomy beat per row A1–A19; the two deviations as their
  own autonomy beats (`d1` = D-003, narration is still re-made for the whole video; `d2` = step 3,
  audit asks a file only of this plan's own decisions); one beat for the code check (13 findings,
  the most serious shown as the check working); one beat saying 19 rows means the plan left too much
  open; quick checks K1 (after the code check: who checks the code) and K2 (after the step-5 calls:
  an answer in your own words); the ending: what ran, what is not done, flag a call or accept.
- Six parts. Step 3 carries eleven calls and a deviation, so it spans parts 2–4.
- Every autonomy row in `walkthrough.md` names a step, so no row needed a nearest step. Two calls
  light a part that is not literally their script: the frame lint (A11) lights the plan-to-video
  skill, whose style guide it enforces, and the code-check calls (A1–A4, A15, A19) light the
  implement step, which owns `scripts/code-check.mjs` in `system.json`.
- The stage keeps `system.json`'s columns and row order with the rows closer together
  (y 150 / 335 / 520), so the build loop's bottom row stays above the player's sheet while it asks.
  At most six parts per frame (§19): each stage frame draws one small group around the part it lights.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25. No MP4: the review player plays
  the HTML project.

## Notes

Autonomous run. Frames were written by one generator (no per-frame sub-agents), each reveal timed to
its word from `audio_meta.json`.
