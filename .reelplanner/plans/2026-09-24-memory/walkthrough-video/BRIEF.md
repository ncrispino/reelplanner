---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The memory plan as built (32a3efd): all five steps landed; fifteen calls the plan did not make and one deviation (D1, what 'a part reworked' means), thirteen calls stopping because a recent miss with no tags matches them by component, two grouped; the owner's two plan-video quick checks (k3, k4) kept as the plan says, with two cheap changes; five quick checks; a fresh agent's code check found nothing to answer"
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner who approved the memory plan on the review page, deciding whether to accept what was built; they know the player, the ledger and reel status well
length: a series of five parts, about a minute each; 4–5 minutes in all
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme, as in the plan video)
music: none
---

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-24-memory`, from its own `walkthrough.md` and
`code-check/findings.md`, on the plan video's stage (`../video/`): the five-slot rail with the plan
video's slot titles and the five-tick spine. The structure follows
`../../2026-09-24-answer-on-the-video/walkthrough-video/`, cut to the style guide's length budget
(§1): one beat per step with one real result, one or two sentences per call that stops, one grouped
beat per part for the calls that don't, and no closers.

## The real thing

The plan is about records and what two commands print, so the frames show the real ones: the stamp on
the revise loop's walkthrough review (`reviews/walkthrough-20260924T192645Z.json`), `reel status`'s
memory lines on this repo, `reel record`'s lines, the one line in `~/.reelplanning/you.jsonl`,
`reel memory misses`, and `reel stops` on this plan and on answer-on-the-video.

## Customizations

- `reel stops` decides the beats: 13 calls stop (a recent miss with no tags matches them by component:
  m3's step 6 for this plan), D1 stops as a deviation, and A7 (step 1) and A3 (step 2) are untagged and
  share a grouped beat at the end of their part. m1 and m2 are logged in walkthrough.md, not beaten.
- Said plainly, in their own beats: A12 (what it makes stop right now: all 22 of answer-on-the-video's
  calls on D-056), A9 (your file on every record, and the reviewer stamp that fell back to git's email,
  noreply@anthropic.com, in this cloud session), D1, and the owner's two plan-video quick checks (k3, k4)
  kept as the plan says with the two cheap changes.
- Five quick checks, one per part, each a prediction with `- explained_at:`; option cards carry
  `data-option`. Every frame's root carries `data-band="bottom"` and leaves its lowest eighth empty.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run: preview only, no MP4. Frames written by one generator, each reveal timed to its word
from `audio_meta.json`.
