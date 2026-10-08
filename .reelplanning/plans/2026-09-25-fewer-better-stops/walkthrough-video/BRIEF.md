---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the fewer-better-stops build did: all three steps and the band fix landed; nine calls and one deviation, seven tagged calls stopping on three stop beats, two untagged grouped, and the deviation (memory's call A12 left as it is, so decisions D-122 and D-109 are both active) on its own beat."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who got all three of this plan's quick checks wrong and asked for videos a newcomer can follow; assumes only the system video
length: about four minutes, four parts (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-25-fewer-better-stops/walkthrough.md`, the first built under the
define-before-use rules (`before:`, `terms:`, `terms_check: strict`, `- defines:`, `- walk_me_through:`,
one stop beat per step). The owner said "I don't know what a tag is … I'm just so confused" and got all
three of the plan's quick checks wrong, so every word is defined where it is first said and every quick
check tests the case just shown.

## Customizations

- Four parts: the words (call, tag, streak, deviation) and a quick check; step 1; step 2 and its
  deviation; step 3 and the band fix.
- The beats `reel stops` prints: a stop beat per step for its calls that stop, the deviation on its
  own, the untagged calls grouped at the end of their part.
- Real before and after screenshots of the band, taken with the player served the way
  `packages/player/test/band.spec.mjs` serves videos.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator, each reveal timed to its word from
`audio_meta.json`.
