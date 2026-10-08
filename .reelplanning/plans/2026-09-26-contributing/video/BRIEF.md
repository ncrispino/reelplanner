---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Revised after the owner's fourth review and two answers in conversation: the line for a video is choices or size (D-214), so a small fix that makes no choice needs none; the built video stays out of git's history (D-213), on a throwaway branch that is never merged and is deleted after the merge (D-215), shown in a real run with the answer to \"would it be easy\"; step 3's checks said more plainly; no question left; quick checks by D-197, step 1's on a new case."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked how several people use reelplanning on a shared repo; knows the system video; chose the zip (D-213) asking whether it would be easy and whether the video stays out of git's history, said small PRs need no video, then answered two follow-ups in conversation (D-214, D-215); rewound on step 3
length: 3–5 minutes (style guide §1), six chapters; the third version ran 4:35, and the question and its branches give way to two decided scenes
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-26-contributing/plan.md`, revised after the owner's fourth
review (`reviews/plan-20260927T050151Z.md`) and two follow-up answers in conversation. Question 1 was
decided (D-213: not in git's history), and is delivered by a throwaway branch (D-215); the line for a video
is choices or size (D-214), after the owner's note on quick check 1 that small PRs need none. Step 1 says
the line as decided, on a one-line fix that now needs no video; step 3, rewound, says its two checks more
plainly, then where the video lives and a real run of the commands, with the honest answer to "would it
be easy". No question is left. One example throughout (Sam, a contributor; PR #42, #43 and a newcomer's
#44; the owner as maintainer); each quick check has a case of its own.

## Customizations

- Medium: documents, a planned PR page, terminals, real screens, tables and diagrams; composition varies per scene.
- Layouts: two lanes (the hook), a row of tiles, a list (the recap), a document (CONTRIBUTING.md), a PR page mock, two lanes (who makes the video), a split (who does what), two columns (what lands), a table beside a real screenshot (watching and checking), a terminal run (the weight in git), a diagram of main and a throwaway branch, a terminal run (the throwaway branch, for real), a terminal run (the real merge), three lanes and a line of merges (CI and the system video), the plan's steps.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a question or a quick check; crossfade for the ending.
- Real things: scene 10 (the real review page), 11 (the real sizes of this repo's videos in git: `du` and `git ls-files`, run in this repo), 13 (the real throwaway branch in a scratch copy: `bundle-player` packing this plan's video, the push, the maintainer's clone, the delete and a fresh clone's size), 15 (the real merge in a scratch copy of this repo's records: `git merge`'s CONFLICT lines and the `decisions.md` rows with two D-194s); CONTRIBUTING.md (4) and the pull request page (5) are not built yet and are drawn as planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; question and quick-check cards carry `data-option`, headings `data-question`, outside any camera; the camera is at rest when a question or quick check ends.
- Decisions in force said as kept, not asked: D-214 (scene 4), D-200 (6), D-201 (8), D-202 (10), D-213 and D-215 (12), D-171 (15), D-003 (17). No question left. Quick checks (D-197): step N's after step N+1's scenes, step 5's before the ending, each on a case the video did not show; their right answers are not all one letter.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the HTML project.

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on.
Frames are written by one generator (adapted from the case-study video's), each reveal timed to its word
from `audio_meta.json`.
