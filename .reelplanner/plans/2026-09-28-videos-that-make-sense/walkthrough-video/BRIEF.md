---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the videos-that-make-sense build did, shown running: fresh eyes writes two briefs with a picture of each scene (step 1); the build stops until every finding has an answer, and what is kept after three rounds is said before you watch (step 2); Ask about this, answered by the session waiting on the page, or kept with your review (step 3); frame-lint fails grey bars where words go (step 4); the system video checked, three rounds, 93 findings answered (step 5). Thirteen choices: four pause, in two scenes that show them running (A6; A8, A10, A11), nine are the list at the end. No off-plan change."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for videos that make sense and approved this plan; watched its plan video and knows the review page
length: about two minutes (style guide §1 and §8: a walkthrough about two, past 3 is long)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-28-videos-that-make-sense/walkthrough.md`, built under the walkthroughs-that-help rules:
short, the change running (real command runs, the real review page, the saved review file), pausing only for the
choices `reel stops` says pause (a choice you'd notice or can't easily undo; no off-plan change here), the rest one
list at the end. Two quick checks, each just before the scene that runs what it asks about. It ends on the open
question. And, as the plan asks of every new video, fresh eyes looks at it before it is done.

## Customizations

- Medium: the real things the build changed: command runs in a terminal (`fresh-eyes`, `build`, `frame-lint`), the
  review page (Before you watch, Ask about this), the saved review file, a scene of the system video before and after.
- Layouts: a change's map in a table, a terminal run, a screenshot with its words pinned, a file before and after,
  quick checks over a dimmed case, the list of choices, what ran.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; crossfade
  for the ending.
- Real things: scene 1 (the change's map), 2 (`fresh-eyes` run on the system video, and a finding it wrote), 3 (`build`
  stopping on unanswered findings, then passing), 5 (the system video's Before you watch), 7 (Ask about this on the
  local review page, answered by a waiting session, and with none waiting), 8 (the saved review file's `questions`
  and `reviews/<id>.md`), 9 (`frame-lint` on the step 6 frame the owner sent), 10 (a system-video scene before and after
  its fix), 11 (the tests and the code check); every change scene is a real thing.
- The choices `reel stops` pauses: a6 (5); a8, a10, a11 (8), each on the scene that shows it running; the list,
  `- autonomy_list: a1, a2, a3, a4, a5, a7, a9, a12, a13`, at the end (12). No off-plan change.
- Quick checks by style guide §8 (D-222): k1 before the page shows what is left (4), k2 before a question is asked
  with nobody waiting (6).
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, choice cards `data-call`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4 unless asked: the review player plays
  the HTML project.

## Notes

Autonomous run. Screens in `assets/shots/`: the system video's page before its first play (packed with
`bundle-player`, 1440 × 900 at 2×); Ask about this on the local review page served by `reelplanning review`, a
`review --wait` session answering with `inbox answer`, then none waiting. The command runs are real: `fresh-eyes` and
`build` on the system video (its second round), `frame-lint` on walkthroughs-that-help's step 6 frame. The saved file
is the page's own export after those two questions; `reviews/<id>.md`'s section is `actOnMarkdown` run on it.
