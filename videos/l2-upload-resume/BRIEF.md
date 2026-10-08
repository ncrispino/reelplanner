---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Uploads survive a server restart because the server records intent before the first byte"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer reviewing this implementation plan before approving it
length: 120s watched path
angle: how-to-process
narration: yes
---

## Intent

reelplanning spike L2: the interactive layer. Same plan and preset as L0/L1. The style guide v2
applies (`skills/plan-to-video/references/style-guide.md` §9–10): every open question becomes a
decision beat right after the step it concerns (teach the fork, cost of each option, recommendation,
ask), followed by one branch beat per option (what changes in the plan). The player pauses on the
decision, records the reviewer's choice, plays only that branch, and the ending shows the resolved
plan for approval. Less on-screen text than L1; captions are script sentences.

## Customizations

- Watched path ≤ 120 s (the MP4 is longer because it contains every branch).
- ≤ 5 new on-screen words per beat; no sub-labels on diagram nodes; stage vertically centred.
- `decision:` / `branch:` tags on frames; `plan_step` on step and decision frames.
- `music: none`.

## Notes

Autonomous run. Voice: Kokoro `am_michael`. Whisper timings only; captions come from the script.
