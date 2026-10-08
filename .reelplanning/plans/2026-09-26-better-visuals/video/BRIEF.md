---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Four steps: a scene shows the real thing, the actual file, table, command output or screen it is about instead of boxes of words, with plain words pinned to it, in the scenes each brief picks (decided, D-166); a change across ten files shows its map, then the one place that carries the idea, or a picture where that explains better (the review's note, answered on a real nine-file change); a written motion language and checks that keep the camera out of the answer bar and the cards still; the review page keeps today's look, made readable, with its fonts shipped and the darker coral (decided, D-167 and D-142; already built); old videos change only when revised, the system video once. Nothing left to decide."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for better visuals and a page that reads well; knows the system video
length: about four minutes, six chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the plan video of `.reelplanning/plans/2026-09-26-better-visuals/plan.md`,
built in the style the plan proposes, so the video is its own sample: real things on screen where the brief
picks them (below), plain words pinned to them, a camera over one clipped view, transitions that mean
something. The review's note on scene 3 ("what if we change 10 files") is answered on a real change from
this repo, the terms check (`git show --stat 6d9e961`, nine files): its map, each file with one plain line,
then the five lines of `scripts/check-terms.mjs` that carry the idea, then the same idea as a picture.

## Customizations

- Medium: screens, documents, code and a terminal; composition varies per scene.
- Layouts: a wall of real scenes, a zoomed page, before and after wipes, a change's map in a terminal, a
  code excerpt on the slab, a diagram, document pages, a frame drawn to scale.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a quick check or a
  zoom into code; crossfade for the ending.
- Real things: scene 1 (twelve real scenes), 2 (today's Terms panel), 3 and 9 (the sample's before and after), 4 (the terms check's map), 5 (its five lines), 7 (the plan's text), 8 (the decision log), 11 (this brief), 15 (the page before and after), 17 (the plans folder); the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, outside any camera; the camera is at rest when a quick check ends.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays
  the HTML project.

## Notes

Autonomous run. Frames were written by one generator (adapted from the visual sample's), each reveal timed
to its word from `audio_meta.json`.

Revised after the plan review of 2026-09-26 (changes requested): a scene that shows what "the real thing" means
before the plan first says it; question 1 asked again on one scene done three ways; the three looks shown on
the same two screens (the Terms panel, an answered quick check) with the Look menu before question 2; question 3
decided (a darker coral, decision D-142), its scenes dropped. Frames written by the same generator, adapted.

Revised after the second plan review of 2026-09-26 (changes requested): the note on scene 3 answered by three
new scenes (the map of a nine-file change, the one file that carries it, the same idea as a picture); question
1 decided (the brief picks, decision D-166) and question 2 decided (today's look, made readable, decision
D-167), so their question scenes, branches and the three-looks scenes are gone; step 3 shows today's page
before and after its fixes; the ending says what was decided.
