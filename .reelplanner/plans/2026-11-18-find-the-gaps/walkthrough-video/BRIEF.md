---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the find-the-gaps build did, shown running: a round's cards held to their rules and the fresh checker stopping a card it reads otherwise (step 1); the round on the review page, a card turned over to the code's own lines (step 2); a say card, your words checked claim by claim (step 3); one record, and where each settled gap goes (step 4); a wrong quick check settling the same way, and reel status counting rounds (step 5). Twenty-one choices, all paused, in five scenes that show them running, and one deviation on its own (D1: step 5 built past its fifth choice before its question was asked). No list at the end."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for a way to line up their picture of the code with the code and with the agent, answered the plan's four questions (D-314 to D-317) and approved it; watched its plan video and knows the review page
length: under three minutes
depth: medium
angle: how-to-process
narration: yes
style_preset: .reelplanner/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanner dogfooding itself: the walkthrough video of
`.reelplanner/plans/2026-11-18-find-the-gaps/walkthrough.md`, the change running (real runs in a scratch repo, the
real round page and player), pausing for the choices `reel stops` says pause (all of them: each is tagged, or shares a
label with a recent late fix), and the deviation on its own beat. Two quick checks, each just before the scene that
runs what it asks about. It ends on the open question.

## Customizations

- Ask: "ok approved, implement it"
- Medium: the real things the build changed: command runs in a terminal (`reelplanner align --check`, `align record`,
  `reel status`), the round page (a card's front, the same card turned over, a say card), the player's quick check.
- Layouts: the change's map in a table, a terminal run, a screenshot with its words ringed, quick checks, the
  deviation's card, what ran, the ask.
- Main transition: push-slide LEFT for the next scene of a part; cut for a part or a quick check; crossfade for the
  ending.
- Real things: scene 1 (the change's map), 3 (`align --check` stopping and passing), 4 (the round page, front and
  turned over), 5 (the say card), 7 (`align record` and the plan's sections), 8 (the player's quick check, and
  `reel status`); every change scene is a real thing.
- The choices `reel stops` pauses: a2, a3, a4, a20 (3); a7, a9, a10, a13 (4); a11, a12, a19 (5); a1, a5, a6, a8 (7);
  a14, a15, a16, a17, a18 (8), each on the scene that shows it running; the deviation d1 (9). No list.
- Quick checks by style guide §8 (D-222): k1 before the checker stops a card (2), k2 before the record routes a
  skipped card (6).
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`,
  headings `data-question`, choice cards `data-call`.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time.

## Notes

Autonomous run. The runs were made in a scratch repo (one file, `src/send.mjs`: how a review is handed on), with a
scratch home folder, so your own memory file was never touched. Screens in `assets/shots/` (kept out of git, D-213):
the round page from a scratch repo's review server, and the player's quick check on the l2 fixture, taken with
Playwright.
