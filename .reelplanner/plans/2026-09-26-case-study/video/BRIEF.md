---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Four steps, all three questions decided: a kit any plan can use, built by the agent now (one template every write-up follows, a guide to replicate a case study, a sheet per arm, a feedback sheet, a rubric, a blind judge's prompt, a container per arm with a preflight that proves the start is empty, and reel case-study to set it up); the text-only and HTML arms, run by the owner all the way to a site they would ship (D-168), a case study with the same feedback in every arm; our arm through every stage, run first (D-169); where each ends up and how each got there, judged by the rubric, a blind judge and the owner's ranking with the process beside them (D-170), on one HTML page built from the case study's folder."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for the case study; knows the system video
length: about five minutes, five chapters (style guide §1: 3–5 minutes); revised after the plan review, its question scenes and branches gone
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-26-case-study/plan.md`: the owner asked for a case study,
for any plan, of text only against HTML against ours, starting with the Bob Dylan site from one prompt
and one empty folder, taken through the whole lifecycle, and compared where each ends up. The video
shows the real starting point (the prompt, the two plans already made from it, which stop at the plan)
before it shows the kit, the three arms and the measures.

## Customizations

- Medium: documents, a terminal, a table, screens and diagrams; composition varies per scene.
- Layouts: a terminal (the prompt, the kit's map, two real preflight runs stacked), documents side by side, a diagram of three lanes, the plan's table under a camera, a rubric beside three folders, two lanes with real things, a statement over a planned table (the feedback sheet), a list, a lifecycle row over the real review page, an order of chips (decided), question cards for the quick checks, a split of the result and the process over the owner's note, a split of one command beside a wireframe of the page, the plan's steps.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; crossfade for the ending.
- Real things: scene 1 (the prompt, `eval/bob-dylan-site/prompt.md`), 2 (the two baseline plans, `plan-mode.md` and `html-plan.html`), 5 (two real runs of the draft `preflight.sh`: with only a fresh home folder, and in an isolated run), 6 (the plan's seven-stage table), 9 (the plan-mode command and `html-plan.html` at phone width), 13 (the review page), 18 (the owner's note on question 3, word for word); scene 4 is the kit's map (each file, one plain line); the feedback sheet (10) and the case study's page (19) are not built yet and are drawn as planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; quick-check cards carry `data-option`, headings `data-question`, outside any camera; the camera is at rest when a quick check ends.
- Decided in review, said as decided: D-168 (scene 9), D-169 (scene 14), D-170 (scene 18); no question scenes, no branches.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the HTML project.

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on.
Frames are written by one generator (adapted from the better-visuals video's), each reveal timed to its
word from `audio_meta.json`. Revised after the plan review of 2026-09-26: scenes 4, 9, 19 and 20 rebuilt,
scenes 5, 10, 14 and 18 new, the question scenes and branches removed; the other scenes are unchanged.
