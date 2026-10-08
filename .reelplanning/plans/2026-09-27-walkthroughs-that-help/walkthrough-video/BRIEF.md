---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the walkthroughs-that-help build did, shown running: steps 1 to 6 landed (a short walkthrough of the change running; a choice pauses only when you'd notice it or can't easily undo it, the rest one list; a quick check where there is something to predict, and one open question; small pull requests list their other choices; one row per plan with a Plan | Built switch; each pause timed, and a bar). Ten choices: five pause, in five scenes that show them running (A3, A5, A6, A8, A9), five are the list at the end. No off-plan change. Step 7, the system video, waits for your accept. The first walkthrough under its own new rules."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for walkthroughs that help and approved this plan; watched its plan video and knows the review page
length: about two minutes, five chapters (style guide §1 and §8: a walkthrough about two, past 3 is long)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough.md`, and the first walkthrough built to the rules
that plan made. Short, the change running: real screens of the review page before and after, and real command
runs (`reel stops`, `reel pr-check`, `reel memory`), the saved review file before and after. It pauses only for the
five choices `reel stops` says pause, each in the scene that shows it; the other five are the list at the end.
Two quick checks, each just before the run that answers it; the last is the approval's own case (the page looks
the same, the saved file changes). It ends on the open question.

## Customizations

- Medium: the real things the build changed (the review page, command runs in a terminal, the saved review file),
  with one map and two quick checks.
- Layouts: a change's map in a table, a terminal run, a screenshot with its words pinned, before and after side by
  side, a file before and after, quick checks over a dimmed case, the list of choices, what ran.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; crossfade
  for the ending.
- Real things: scene 1 (the change's map, `git diff --numstat`), 4 (`reel stops` on this plan), 5 (the list in the
  review player), 6 (Finish with the open question), 7 (`reel pr-check` on a scratch pull request, waiting, then
  ticked), 8 (the page's header before and after, the switch), 9 (the list of videos before and after), 12 (the
  saved review file before and after, and `reel memory after-build`), 13 (the test run and the code check's counts);
  every change scene is a real thing, the rules scenes (2, 10) explain in words
- The choices `reel stops` pauses: a3 (5), a5 (6), a6 (7), a8 (8), a9 (9), each on the scene that shows it running;
  the list, `- autonomy_list: a1, a2, a4, a7, a10`, at the end (14). No off-plan change.
- Quick checks by style guide §8 (D-222): k1 before `reel stops` runs (3), k2 before the saved file is shown (11).
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, choice cards `data-call`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the HTML
  project.

## Notes

Autonomous run. Screens in `assets/shots/`: the review page at this build (a bundle of details-in-the-frame's two
videos and the system video) and at `806f8aa` (before), 1440 × 900; the list and Finish on the list spec's fixture
(the l2 worked example, its grouped beat made the list). The command runs are real: `reel stops` on this plan,
`reel pr-check` on a scratch repo with a 4-line change and the template's "Other choices" filled in, `reel memory
after-build` on this repo. The file before is details-in-the-frame's walkthrough review; after, the list spec's export.
