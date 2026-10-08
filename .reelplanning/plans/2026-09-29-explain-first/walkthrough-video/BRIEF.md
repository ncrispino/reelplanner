---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the explain-first build did, shown running: sources pinned by their form and described by their shape, with no list of kinds (step 1); reelplanning explain on last night's experiment, a folder outside the repo, and the Explainer row on the review page with its commits since (step 2); Finish's three ends, Explain more and Plan this each offering what it would mean for this video, and the review filed with the decision log unchanged (step 3); Plan this, and the explainer first under Before you watch (step 4); check-sources passing, failing on a retyped line, stopping on a GitHub key until it is masked, and the fact check (step 5). Thirteen choices: seven pause, in four scenes that show them running (A1, A10; A9, A13; A12; A6, A7), six are the list at the end. No off-plan change."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for explainers, answered question 1 in their own words (D-250) and approved this plan; watched its plan video and knows the review page
length: 3–5 minutes (asked for this walkthrough; a walkthrough is usually about two, style guide §8)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-29-explain-first/walkthrough.md`, the change running (real command runs in a scratch
clone of this branch, the real review page), pausing only for the choices `reel stops` says pause, the rest one list at
the end. Three quick checks, each just before the scene that runs what it asks about: they are the three the owner
missed on the plan video (Friday's video, "this looks wrong", the access key), now shown running. It ends on the open
question.

## Customizations

- Medium: the real things the build changed: command runs in a terminal (`reelplanning explain`, `reel record`,
  `reel new-plan --from`, `reel prereqs`, `check-sources`), the review page (the Explainer row, Finish's three ends),
  the draft plan's first lines, the pinned sources.
- Layouts: a change's map in a table, the sources in a table, a terminal run, a screenshot with its words ringed, a
  file and a run side by side, quick checks, what ran, the list of choices, the ask.
- Main transition: push-slide LEFT for the next scene of a part; cut for a part or a quick check; crossfade for the
  ending.
- Real things: scene 1 (the change's map), 2 (the sources three real runs pinned), 3 (`reelplanning explain` on the
  experiment folder), 5 (the review page's Explainer row), 6 (the Finish panel on an explainer, with this video's suggestions), 8 (`reel record`, and the
  filed `.md`), 9 (the draft `plan.md` and `reel prereqs`), 10 (`check-sources` passing, then failing), 12 (`check-sources`
  stopping on the key, then masked); every change scene is a real thing.
- The choices `reel stops` pauses: a1, a10 (5); a9, a13 (6); a12 (9); a6, a7 (12), each on the scene that shows it
  running; the list, `- autonomy_list: a2, a3, a11, a8, a4, a5`, at the end (14). No off-plan change.
- Quick checks by style guide §8 (D-222): k1 before the row's "commits since" (4), k2 before the review is filed (7),
  k3 before the key stops the build (11).
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`,
  headings `data-question`, choice cards `data-call`.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. Rendered to MP4 as well (the owner chose render).

## Notes

Autonomous run. The runs were made in a scratch clone of this branch, with a scratch home folder (so a file outside
the repo shows as `~/…`); the experiment's results and the CI log are made-up files there, and the GitHub token in the
log is made up too. Screens in `assets/shots/` (kept out of git, D-213): the review page's Videos list, the
explainer waiting under Needs you and its row after the review, and the Finish panel on an explainer with its suggestions after a viewer's rewinds and comment, taken
with Playwright from pages `bundle-player` packed.
