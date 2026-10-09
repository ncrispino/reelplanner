---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What was built for the owner's direct ask (no plan video), opened with their words: the question answered on the frame, by its cards, with no answer bar where a frame has its cards; More on each card and the full question; plain words and a caption word you can click. Twenty choices, past the dozen the skill warns about, grouped one pause per step; a phone keeping the bar is the one off-plan change; decision D-108 is replaced once this plan's review is recorded."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for this in their own words and asked for plain words (D-127); assumes the system video's first chapter
length: under five minutes, four chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-25-answer-in-the-frame/walkthrough.md`. The plan was the owner's direct ask,
built without a plan video, so the video opens with their words and what was built for them, and shows it
working with real before (e7d6064's player) and after (this build's) screenshots, at 1440 and on a phone.

## Customizations

- Four chapters: the owner's words, what was built and the words for it, with a quick check; then one per step.
- The scenes `reel stops` prints: one stop scene per step for its choices that stop (nine, five, three), the
  off-plan change on its own, the two unlabelled choices in one list at the end of step 3's chapter.
- Every choice's card carries `data-call`, every option card `data-option`, every question heading
  `data-question`; every frame's root `data-band="bottom"` with its lowest eighth empty, so the player
  answers on the frame.
- Quick checks with `walk_me_through`, `explained_at`, `question_more`, `option_x_more`, `option_x_why`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator, each reveal timed to its word from
`audio_meta.json`. Storyboard summary posted as a heads-up (no gate).
