---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "<the plan in one sentence: its changes, and each question with its recommendation>"
destination: embed
aspect: 1920x1080
language: en
audience: <who reviews it, and what they already know (the videos before it)>
length: about four minutes, <n> chapters (style guide §1: 3–5 minutes; a walkthrough video about two, §8)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

<what this video is for, and what the plan changes: the files, tables, command runs and screens. A change
across many files is a map (each file with one plain line), then the one or two places that carry the
idea>

## Customizations

- Medium: <screen, code, document or diagram: what this video mostly shows>
- Layouts: <the few layouts its scenes take: a diff on the slab, a table, a terminal run, a before and after wipe, a wall of screens…>
- Main transition: <one, e.g. push-slide LEFT for the next scene; cut for a chapter or a quick check; push-slide UP for a question; crossfade for the same place later>
- Real things: <optional: the scenes that show the thing itself, e.g. scene 3 (the table), scene 8 (the diff); the rest explain with pictures. A walkthrough video names every change scene: the page before and after, the saved file before and after, a command's real output>
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, outside any camera; a camera is at rest when a question ends.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays
  the HTML project.

## Notes

<anything the build should know: holds, details, what was left out>
