---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the plan guide's build did, shown running: reelplanning guide writing a video's page and a part a step, the page, its things to do and its step picture (step 1; A1 to A4, D2); every step's four blocks held to by reel check, and the guide's own check (step 2); a scene's part over the frame, and where parts live (step 3; A8, A9, D1); suggested edits filed with what they rebuild (step 4; A10, A11); the Built side, every changed line and run (step 5; A12, A13). Fourteen choices: ten pause, in five scenes that show them running, two changes from the plan pause on their own, four are the list at the end."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for the plan guide, answered its four questions and approved this plan; watched its plan video and knows the review page
length: 3–5 minutes (asked for this walkthrough; a walkthrough is usually about two, style guide §8)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
render: yes
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-28-plan-guide/walkthrough.md`, the change running (real runs saved in the plan's `runs/`,
the real guide and review page), pausing only for the choices `reel stops` says pause, the rest one list at the end.
Two quick checks, each just before the scene that runs what it asks about. It ends on the open question. Its scenes
open this plan's own guide, built by the builder it shows: the showcase.

## Customizations

- Medium: the real things the build changed: command runs in a terminal (`reelplanning guide`, `guide --check`,
  `reel check`, `reel record`), the guide page (its flow, a thing to do, the Cases of a step, the Built side), a part
  open over the frame on the review page, the plan map's entry and `.gitignore`.
- Layouts: a change's map in a table, a terminal run, a screenshot with its parts ringed, two runs one over the other,
  quick checks, what ran, the list of choices, the ask.
- Main transition: push-slide LEFT for the next scene of a part; cut for a part or a quick check; crossfade for the
  ending.
- Real things: scene 1 (the change's map), 2 (`reelplanning guide` run), 3 (the page), 4 (a thing to do, and an
  explainer's outside source), 5 (a step's picture), 6 (step 2's Cases on the page), 7 (`guide --check` passing, then
  failing), 9 (`reel check` on a new plan), 10 (a part over the frame), 11 (the plan map's entry and `.gitignore`), 13
  (`reel record` and Edits to apply), 14 (the Built side); every change scene is a real thing.
- The choices `reel stops` pauses: a1, a2, a3, a4 (4); d2 (5); a8, a9 (10); d1 (11); a10, a11 (13); a12, a13 (14),
  each on the scene that shows it running; the list, `- autonomy_list: a5, a6, a7, a14`, at the end (16).
- Quick checks by style guide §8 (D-222): k1 before `reel check` on a new plan (8), k2 before the edits are filed (12).
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`,
  headings `data-question`, choice cards `data-call`; the thing a scene's guide part explains carries `data-detail`.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. Rendered to MP4 as well (asked for).

## Notes

Autonomous run. The runs are the plan's own `runs/*.txt`, made in this branch and in scratch repos (a new plan with no
blocks; a review with two suggested edits; walkthrough.md naming a run nobody saved, in a scratch clone). Screens in
`assets/shots/` (kept out of git, D-213): the plan guide's own guide (the page, step 2's thing to do and Cases, the
Built side), an explainer's outside source in a scratch repo, and videos-that-make-sense's walkthrough on the bundled
review page with its part open, taken with Playwright.
