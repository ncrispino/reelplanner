---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The answer-on-the-video plan as built after its review (commit 59c479f), the second version of this walkthrough: question 1 is on the record in the owner's words (D-108), and question 2 was built as B, the band inside the frame, in the lowest eighth new videos leave empty (on the record once this is reviewed). All five steps landed; twenty-two calls the plan did not make and one deviation, all twenty-three stopping for accept or flag; four quick checks; the whole test suite passes and a fresh agent's code check found nothing to answer"
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner who reviewed the plan video and asked for step 2 to be redone and for step 5, deciding whether to accept what was built, including someone new to the repo
length: about five minutes, four parts (style guide §1: 3–5 minutes, never past 7)
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-24-answer-on-the-video`, from its own
`walkthrough.md` and `code-check/findings.md`, rebuilt as the second version for what is built now
(commit 59c479f): the first version (38 frames, 7.2 min, the thin strip) was never reviewed. The owner
reviewed the plan video, asked for step 2 to be redone and for step 5, and said "we will just update
walkthrough once code is updated accordingly".

It says first: question 1 is on the record in the owner's words (D-108), question 2 was built as B (the
band inside the frame, in the lowest eighth new videos leave empty), what landed, and that the table's
twenty-two calls are well past the dozen at which the skill says a plan left too much open.

It is the first video built for the band: every frame's root carries `data-band="bottom"` and keeps its
lowest eighth empty, so the review player lays its answer band inside the frame.

## The real thing

The change is visual, so the video shows the actual player. Every capture in `assets/shots/` is a
Playwright screenshot of the review page (`packages/player/index.html?project=<video-dir>`, served over
http from the repo root the way `answer-on-frame.spec.mjs` serves it), in light (`-l`) and dark (`-d`);
each frame shows the one matching the video's theme.

| Capture | What it is | Used on |
|---|---|---|
| `hover` | this video's quick check k1, card B under the pointer, the band in the frame | step 1 |
| `answered` | k1 answered A: the cards' tags, the band's explanation, Back to where this was explained, the count | A6, step 5 |
| `held` | the same, the pointer on the band: "Waits while you are here" | A18 |
| `call` | this video's own call A1: the band in the frame, Accept and Flag | step 2, A3 |
| `band` | the lower part of that frame, the band's two lines | A15 |
| `folded` | Show the frame on that call: the pill in the empty eighth's corner | A11 |
| `under` | this plan's first video (built before the band) at k1: the band under the frame, in its kept room | A14 |
| `group` | the revise-loop walkthrough's grouped beat, in the band under the frame | A4 |
| `phone` | this video at 390 px on a touch device, k1: the band under the frame | A12 |
| `record-edit`, `verdict`, `resend` | kept from the first version (step 3 did not change) | step 3, A7, A9, A10 |

## Customizations

- `reel stops` decides the beats: all twenty-three calls stop (every tag's accepted streak is 0; D1 is a
  deviation), so each has its own beat of one or two sentences; there is no grouped beat. m1–m5 are
  logged in walkthrough.md, not beaten. The why and where to check are in the band (the call's tags) and
  in two details: `band-places` (step 2) and `step-5-rules` (step 5).
- Four quick checks, one per part, each a prediction with `- explained_at:` naming the beat that explains
  it; their option cards carry `data-option`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator, each reveal timed to its word from
`audio_meta.json`.
