---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Three independent changes: the calls that stop in a step share one beat (step 1), a miss stops calls of its own kind (step 2; question 1, what a miss with no tags may stop, recommend A: nothing directly), and too many calls in one step is asked, not made (step 3; question 2, what the implementer does at a step's fifth call, recommend A: ask before going on)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner reviewing reelplanning's own plan on the review page; they know walkthroughs, calls, tags and the answer band well
length: about three and a half minutes, four parts (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns
`.reelplanning/plans/2026-09-25-fewer-better-stops/plan.md` into its review video. The owner asked
for short videos (3–5 minutes) and for memory to make the right calls stop, not fewer for their own
sake. The problem is told with this repo's own numbers: 23 of 23 calls stop on the answer-on-the-video
walkthrough, every tag's streak is 0, one old miss (D-056) reaches every player call, and every plan so
far made more than a dozen calls.

## Customizations

- Four short parts: the problem and what changes (before any how); step 1 and its quick check; step 2,
  its quick check and question 1 with three branches; step 3, its quick check, question 2 with two
  branches, and the resolved plan.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty (the answer band);
  option cards carry `data-option`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator, each reveal timed to its word from
`audio_meta.json`.
