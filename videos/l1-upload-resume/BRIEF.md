---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Uploads survive a server restart because the server records intent before the first byte"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer reviewing this implementation plan before approving it
length: 90s
angle: how-to-process
narration: yes
---

## Intent

reelplanning spike L1. Same plan and same preset as the L0 baseline (`videos/l0-upload-resume`),
but the storyboard and script are written under `skills/plan-to-video/references/style-guide.md`:
hook → tension → pre-training → one step per beat on a single incrementally built component
diagram → callback → open questions pinned to steps with a call to action. Audience: one engineer
deciding whether to approve the plan.

## Assets

None. Faceless.

## Customizations

- Hard cap 120 s, target 90 s; hook ≤ 8 s; every beat 4–15 s.
- One component diagram as the stage for every step frame; one signal per beat; one colour per component.
- Final frame: open questions pinned to steps, explicit "draw on a step or approve" CTA, ≥ 3 s still hold.
- Each `feature_showcase` frame carries `plan_step: N`; the `cta` frame carries `plan_questions`.
- `music: none`.

## Notes

- Source text is the plan verbatim in `capture/extracted/visible-text.txt`.
- Autonomous run. Voice: local Kokoro `am_michael`.
