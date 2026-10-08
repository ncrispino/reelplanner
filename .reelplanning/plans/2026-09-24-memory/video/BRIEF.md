---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Four changes: every review records who reviewed it and with which skill (step 1); memory worked out on demand, for this repo and for you across repos (steps 2 and 3); misses decide what stops (step 4); a retro you start, checked against a fixed benchmark (step 5). Two open questions: where your memory across repos lives (step 3, recommend A, a file in your home folder) and when the tool suggests a retro (step 5, recommend A, every five plans or when a signal repeats three times)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner reviewing reelplanning's own plan on the review page; they wrote every review this plan reads, and know the player, the ledger and reel status well
length: a series of five short parts, about a minute each
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme, as in the answer-on-the-video video)
music: none
---

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns
`.reelplanning/plans/2026-09-24-memory/plan.md` into its review video. The plan is about what the
records already say, so the video quotes them: the real numbers and cases from this repo's ledger and
`reviews/`, the few lines `reel status` would end with, and `reel memory <id>` opening the evidence
behind one of them.

## Customizations

- Five short parts: the problem and what changes (the four changes, then how the steps depend on each
  other) before any how; steps 1 and 2; step 3 and question 1; step 4; step 5, question 2 and the
  ending.
- Two decision beats, `q1` (step 3) and `q2` (step 5), options A–C, recommended A. One branch beat
  only, `q1=c`: it drops step 3 from the plan. No option of q2 changes the plan's shape (A and B tune
  when, C removes one suggestion line), so q2 has no branch.
- Six quick checks, each a prediction: old reviews at step 1; what `reel status` shows versus
  `reel memory <id>`; what reaches your own file; what counts as a miss; whether a call with ten
  accepts stops after a miss of its kind; whether a retro is accepted on the loop's own numbers.
- Real evidence: 85 of 91 calls accepted; 3 of 16 questions in own words (D-022 too abstract, D-023
  framed wrong, D-003 with a condition); D-056 superseded by D-063; the file tools reversed after k3;
  deep-dives step 4 rewound, rewritten and rewound again (03:36 and 04:28 reviews); 4 of 16 quick
  checks answered wrong.
- The look and `frame.md` from `.reelplanning/plans/2026-09-24-answer-on-the-video/video/`. Option
  cards carry `data-option` (and `data-plan-option`).
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time.

## Notes

Autonomous run: preview only, no MP4. `build` passing through verify is the bar.
