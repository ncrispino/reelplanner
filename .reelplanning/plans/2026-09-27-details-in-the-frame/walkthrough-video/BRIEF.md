---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "What the details-in-the-frame build did: all four steps landed (the frame marks the thing a detail explains with data-detail, and frame-lint and the details check hold it; the player lays a button with a tab over it, D-194; a click opens the page over the frame, grown from the thing, D-195; the corner chip is the fallback, D-196), and one thing the owner asked for along the way (own words wrap). Eight choices: four stop, in two stop scenes (steps 2 and 3), four wait in grouped scenes; no off-plan change. The first video to mark its own details in the frame."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for details to open by a click in the video and approved this plan; knows the system video and the review page
length: about four minutes, six chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning dogfooding itself: the walkthrough video of
`.reelplanning/plans/2026-09-27-details-in-the-frame/walkthrough.md`, and the first video to use what the plan
built. Two of its scenes open a detail by the thing on the frame: the frame check's real run opens the table of
every rule a mark is held to, and the player's button in the picture opens the code that decides when that
button shows. The review page lays its new button and tab over each; nothing in these frames draws them.

## Customizations

- Medium: the real things the build changed (the change's map, a markup line, a real `frame-lint` run, the
  review page at 1440 × 900 before and after), with cards where a choice or a quick check is clearer.
- Layouts: a change's map in a table, a markup line over a real screen, a terminal run, real screens side by side
  and before and after, stop scenes of choice cards, grouped lists, quick checks over a dimmed case, the checks'
  counts, the steps and the ask.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter, a quick check or a stop
  scene; crossfade for the ending.
- Real things: scene 1 (the change's map, from `git diff --numstat`), 2 (the `data-detail` line on the
  deep-dives walkthrough's scene 12, in the e2e scratch copy), 3 (`reelplanning frame-lint` on that frame made
  taller: its real finding), 5 (the review page: the button's tab, and the ring and why under the pointer),
  9 (the page growing from the block, and over the frame), 13 (an unmarked scene keeping its chip), 15 (the
  own-words field before and after, 300 characters), 16 (the code check's counts and `reel audit`); the rest
  explain with pictures
- Details (the plan's own feature): scene 3 `- detail: mark-rules` (a table, every rule the two checks hold a
  mark to), marked `data-detail` on the terminal run; scene 5 `- detail: when-the-button-shows` (code,
  `detailMark` and `syncDetailChip` with the lines that carry choices A3 and A5 marked), marked on the review
  page's picture of the button. Both are at rest, outside any camera, above the lowest eighth.
- The choices `reel stops` stops, one stop scene per step (steps 2 and 3); the rest in one grouped scene at the
  end of each step's chapter. No off-plan change.
- Quick checks by style guide §7 (D-197): step N's check after step N+1's scenes, the last just before the
  ending, each on a case the video did not show, `explained_at` naming the scene that explained its rule.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, choice cards `data-call`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays the
  HTML project.

## Notes

Autonomous run. The screenshots in `assets/shots/` are the end-to-end proof's (walkthrough.md, "Tests run"):
the review player at this build on a scratch copy of the deep-dives walkthrough, 1440 × 900, cropped to the
video's box; the own-words shots are the richer-review fixture's quick check with 300 characters typed, before
(`6d9c869^`) and after (`6d9c869`). The `frame-lint` run is real, on that scratch copy's scene 12 with its marked
block made 820 px tall.
