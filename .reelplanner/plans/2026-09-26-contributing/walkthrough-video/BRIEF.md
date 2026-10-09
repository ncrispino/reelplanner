---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the contributing build did: all five steps landed (when a pull request gets a video and the check that reads it, D-214, D-200; who decides, D-201; where the built video goes and how a maintainer watches it, D-202, D-213, D-215; decision numbers after a rebase, D-171; CI). Ten choices: four stop, one off-plan change stops on its own, five wait in grouped scenes. CI has never run on GitHub; the owner creates the three labels and marks the full suite required; who owner is once a second person reviews is an open point."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked how several people use reelplanning on a shared repo and approved this plan; knows the system video and the review page
length: about five minutes, six chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-26-contributing/walkthrough.md`. The plan is about a shared repo, so the video shows
the real things a contributor and a maintainer meet: the pull request template and `CONTRIBUTING.md`, the check
every pull request gets, run for real on a scratch repo under and over the line, `reel renumber` fixing a real
clash of decision numbers at a rebase, `reelplanning review` serving a packed video folder, and `ci.yml`.

## Customizations

- Medium: the real things the build changed (the change's map, the two files a contributor reads, real terminal
  runs on a scratch repo, the review page a packed folder serves, the workflow file), with cards where a choice
  or a quick check is clearer.
- Layouts: a change's map in a table, two documents side by side, terminal runs, commands beside a real screen,
  a file's map beside its one place, stop scenes of choice cards, grouped lists, quick checks over a dimmed case,
  the checks' counts, the steps and the ask.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a quick check or a stop
  scene; crossfade for the ending.
- Real things: scene 1 (the change's map, from `git diff --numstat 6ffbc60..e7904a3` over the plan's paths), 2
  (`.github/pull_request_template.md`'s "A video?" and `CONTRIBUTING.md`'s "When a PR gets a video"), 3 (two
  `reel pr-check` runs on a scratch repo: Omar's `--quiet` under the line, Ana's ticked box over it), 6 (`reel
  record` of Ana's walkthrough review, and the check's "lands on main / stays in the PR"), 7 (`config.json`'s
  maintainers line), 9 (the maintainer's commands, `reelplanning review` of the contributing plan's video packed
  by `bundle-player`, and the review page it serves), 10 (`.gitignore`'s lines), 13 (`git rebase origin/main`
  stopping at `decisions.json`, and `reel renumber`), 16 (`.github/workflows/ci.yml`: its four jobs as a map,
  then the `full` job's first step), 20 (the code check's counts and `reel audit`); the rest explain with
  pictures
- Parts of the guide (D-264, D-266): each scene's real thing is marked `data-detail` with the guide part it leads
  to, read under the video: scene 3's terminal run (`step-1`, where everything `reel pr-check` counts, names,
  waits on and fails is: once the old detail page `the-line`) and scene 16's workflow slab (`ci`, the whole
  `ci.yml` in its diff: once the page `ci-workflow`); and 1, 2, 6, 9 and 13. Both at rest, outside any camera,
  above the lowest eighth, 40 px clear above. The old `details/` pages are gone (round 1 of the guide, A2).
- The choices `reel stops` stops: one stop scene each for steps 1, 2, 3 and 5, and the off-plan change D1 on a
  scene of its own; the rest in one grouped scene at the end of each step's chapter.
- Quick checks by style guide §7 (D-197): step N's check after step N+1's scenes, the last just before the
  ending, each on a case the video did not show, `explained_at` naming the scene that explained its rule.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, choice cards `data-call`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the
  HTML project.

## Notes

Autonomous run. The scratch repo (a bare `origin`, `REELPLANNING_HOME` in a scratch folder) is built the way
`scripts/test/contributing.spec.mjs` builds its own: Omar's branch adds `--quiet` in 25 lines, Ana's picks a
default port with the box ticked; main records the cache plan's D-001 while Ana's branch records the port plan's
D-001, and `git rebase origin/main` stops at `decisions.json`. The packed folder is this plan's own video,
packed by `bundle-player` and served by `reelplanning review ../pr-42-video` from this checkout; the △ line is
the same folder with the plan map this plan's video had at `6ffbc60`. The review page shot is 1440 × 900.
