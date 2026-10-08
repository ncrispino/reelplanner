---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Five steps, three questions. You can ask for an explainer, a video of something that is there, with no plan behind it: four kinds (a part of the repo, a transcript or log, a change, a period), each from sources the agent pins (step 1); question 1, whether the whole source is behind the video (recommended: a guide for a transcript and a change). One command, a folder of its own and a row of its own on the review page (step 2). The same player; Finish ends with Done, Explain more or Plan this, and nothing goes into the decision log (step 3). Plan this starts a plan from what you said (step 4); question 2, how far its video leans on the explainer (recommended: lean on it). Facts from their sources, a fact check, a transcript kept out of git (step 5); question 3, what goes into git (recommended: its text, never the transcript)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for a video to explain first and to decide on a plan after; knows the system video, the review page, the walkthrough and the plan guide; watches on a laptop, so one idea a scene and plain words
length: about four and a half minutes, four chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-29-explain-first/plan.md`. It opens on the owner's own words, then
what there is today (every video hangs off a plan, or the whole repo), then each step. Its examples are this repo's
real sources, measured today: the review server (6 files, 951 lines, 5 decisions in force), the lead session's
transcript (21,562 lines, 101 MB), the videos-that-make-sense build (33 files) and the week since Monday (30
commits, 19 decisions).

## Customizations

- Medium: the owner's message and the repo's real sizes, then planned mocks of the command, the review page's row, the Finish panel, the plan it starts and the new check, labelled planned.
- Layouts: a quote (1), lists (2, 3, 4, 28), a table (5), a terminal and a page row (10), a panel beside a list (12), a before and after (14, 21), a storyboard and a terminal (20), question and quick-check cards (6, 11, 13, 15, 19, 22, 26, 27), branch tiles (7–9, 16–18, 23–25).
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; push-slide UP for a question; crossfade for a branch and the ending.
- Real things: scene 1 (the owner's message), 5 (the four sources' real sizes, read from the repo today), 21 (the session file's real size); the command (10), the Finish panel (12), the review and plan.md (14), the check's run (20) and sources.json (21) are mocks, labelled planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`, headings `data-question`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. The review player plays the HTML project; an MP4 is rendered as well (render chosen at Step 6 for this autonomous run).

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on. Frames
are written by one generator, each reveal timed to its word from `audio_meta.json`.
