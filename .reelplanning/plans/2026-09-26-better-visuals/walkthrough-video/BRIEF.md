---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the better-visuals build did: all four steps landed (the brief picks the real things, D-166; a motion language and checks that keep the answer safe; today's review page made readable with its fonts and the darker coral, D-167 and D-142; the system video rebuilt once), and three things the owner asked for along the way (zoom into the video, an answered check's whys that covered the next card, tool names in code markup). Twenty-nine choices: fifteen stop, in five stop scenes (one per step, and two for the asks), fourteen wait in grouped scenes; no off-plan change."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for better visuals and a page that reads well, and watched this plan's video; knows the system video
length: about four and a half minutes, five chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-26-better-visuals/walkthrough.md`, built in the style the plan made: the
real thing where this brief picks it (the change's map, the real diff, real runs, the real page before and
after), a change across many files shown as its map first, a camera over one clipped view, transitions that
mean something, and tool names in code markup (`.reelplanning/names.md`).

## Customizations

- Medium: the real things the build changed (a diff, terminal runs, the review page before and after,
  the captions), with pictures where a card of the choices is clearer.
- Layouts: a change's map in a table, a diff on the slab, a terminal run, before and after wipes of the real
  page, a wall of the rebuilt system video, stop scenes of choice cards, quick checks.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a quick check or a
  stop scene; crossfade for the ending.
- Real things: scene 1 (the change's map), 2 (the brief template's diff and the build's line), 5 (the frame
  check's real run), 6 (the variety check's run on an older video), 9 (the page before and after), 12 (the
  rebuilt system video and `reel status`), 15 (the player at 200%), 16 (the answered check before and after),
  19 (the captions and names.md), 22 (the code check and `reel audit`); the rest explain with pictures
- The choices `reel stops` stops, one stop scene per step (steps 1, 2, 3), and one per ask outside the
  steps that has choices that stop (the review player: zoom and the overlap; the names); the rest in one
  grouped scene at the end of each chapter. No off-plan change.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, choice cards `data-call`, outside any camera; a camera is at rest
  when a question ends.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays
  the HTML project.

## Notes

Autonomous run. Frames written by one generator (the plan video's, adapted), each reveal timed to its word
from `audio_meta.json`. The before shot of the overlap is the player at `01e4f62^` on the answer-on-the-video
plan video's step-1 check at 1440 × 900, answered A; the after shots are the player at this build.
