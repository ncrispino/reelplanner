---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "/reel plays a reelplanner video in a pane beside the conversation, stops at each choice, and sends your answers back to Claude"
destination: embed
aspect: 1920x1080
language: en
audience: someone using Claude Code who has just installed the reelplanner plugin and has not opened /reel yet
length: about one minute, one chapter
angle: how-to-process
narration: yes
style_preset: .reelplanner/theme/frame.md (the project theme)
music: none
---

## Intent

A quick explainer of the `/reel` pane: how to open it, what it does at a stop, what Send does, and where the picture
shows. No plan and no decisions: nothing to answer.

## Customizations

- Medium: screen (a terminal with Claude Code on the left and the pane docked on the right, drawn as a wireframe)
- Layouts: the docked terminal, a close-up of the pane's stop card, a two-way fork for Send, a row of terminals
- Main transition: push-slide LEFT for the next scene; crossfade for the same place later
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4 unless asked.

## Notes

Sources: README "Watch it in Claude Code (/reel)" and docs/reference.md "The reel pane in Claude Code".
