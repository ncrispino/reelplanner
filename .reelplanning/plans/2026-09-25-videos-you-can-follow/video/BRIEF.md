---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Four steps so a video never loses you: every word explained once in the system video and one click away (step 1; question 1, plain words on screen or today's words explained, recommend plain words), the tool picks what to watch first (step 2; question 2, where 'watched' is kept, recommend this browser and your file), memory keeps where you got lost (step 3; question 3, can approving be blocked, recommend never, it is recorded), and quick checks test the main idea on the case just shown (step 4)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who approved the last plan with 3 of 3 quick checks wrong; assumes only the system video (what a plan, a review and the decision log are)
length: about four minutes, five chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns
`.reelplanning/plans/2026-09-25-videos-you-can-follow/plan.md` into its review video. The owner said
he was lost in the last video ("I don't know what a tag is, then it keeps talking about that"), and
that the worst case is being confused and approving everything. This video is the test of its own
plan: every word explained the first time it is said, with a small definition card; no ids; one number
for each thing; each quick check on its beat's main idea, on the case the beat just showed, with a
walk-through.

## Customizations

- Five short chapters, no separate openers: why you got lost (the last plan's second quick check and
  its four unexplained words, each explained here); what is built separately (not asked) and the four
  steps; step 1 and question 1; step 2 and question 2; steps 3 and 4, question 3 and the resolved plan.
- Front matter `before: system | what a plan, a review and the decision log are` and `terms:` for the
  words it explains itself; each explaining beat carries `- defines:`; each quick check a
  `- walk_me_through:` and `- explained_at:`.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty (the answer bar);
  option cards carry `data-option`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator, each reveal timed to its word from
`audio_meta.json`.
