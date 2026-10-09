---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Three independent changes and a proof: cheaper rebuilds (step 1), a loop that runs itself (steps 2 and 3), a reviewable system video (step 4), then step 5 proves them. D-064 and D-065 are decided; one question is open: how far the first version goes beyond Claude Code (step 3), recommendation A, one setting tested with Claude Code."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner reviewing reelplanning's own plan on the hosted review page; they asked to discuss the GitHub Action
length: a series of three parts, about 3 minutes in all
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Revision (after the first review)

The review decided D-064 (a background agent runs the loop) and D-065 (small fixes go straight in,
anything with a choice becomes a plan); they are shown as decided, briefly. Its note on D-064 ("would
this be supported on other clis too besides just claude? like codex, opencode? … not sure about
hooks") is answered by the rewritten step 3 and asked back as the one open question. Its note on the
video ("this is not really ordered, some tasks are independent of others") is answered by an overview
beat after the tension: three tracks on one frame, and step beats that say what they need only when
they need it.

## Revision (round 2, after the walkthrough review)

Steps 1–5 are built. The walkthrough review decided question 1 (D-066: one setting, tested with
Claude Code) and added round 2 to the plan: steps 6–10 and questions 2–5. Frame 11 becomes a decided
beat (its three branch beats go); parts 4 and 5 are new: round 2's opener and overview, a beat per
step, a decision beat for each of questions 2–5 (no branch beats), one quick check after step 8, and
round 2's resolved list. Every other frame is kept as it was, narration included.

## Intent

reelplanning dogfooding itself: the plan-to-video skill turns
`.reelplanning/plans/2026-09-22-m3-revise-loop/plan.md` into its review video. The owner's words:
"idk about the whole github action thing can we discuss? should be able to see that in a short
reelplan too right?". So the video's main job is the one question (step 2): who picks up a review
once you press Finish, options A, B and C, recommendation A. It also shows step 1 (narrate only the
lines that changed) as the cost win it is.

## Customizations

- Short: two parts. The problem in two beats (the Action fires only after the agent has already
  recorded the review; 35 lines re-narrated to change 2), one beat per step, the question as a real
  decision beat with one branch per option, a short ending.
- One detail: a table comparing A, B and C on what the video cannot hold at once.
- Built from the project record: names from `glossary.md`, the look from `.reelplanning/theme/frame.md`,
  modelled on `.reelplanning/plans/2026-09-23-deep-dives/video/`.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time.

## Notes

Autonomous run: preview only, no MP4. `finish-project` and a clean `verify` are the bar.
