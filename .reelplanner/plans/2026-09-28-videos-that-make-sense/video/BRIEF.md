---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Five steps, three questions. What lost the owner were phrases of plain words that no check can flag (saved review file, drops the video), and frames that drew words instead of things. Two fresh agents, a newcomer and a designer, look at each video before the owner does (step 1); every finding is answered, and question 1 asks what becomes of one nobody answered (recommended: the build stops until it has an answer; step 2); a flagged phrase gets a meaning to click, and question 2 asks whether you can also ask about anything (recommended; step 3); seven rules for how a frame reads, with step 6 redrawn by them (step 4); question 3 asks which videos get it (recommended: every new one, and the system video now; step 5)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked what a saved review file is and how they would find out, and said the frames don't explain; knows the system video, the review page and the walkthrough; watches on a laptop, so one idea a scene and plain words
length: about four and a half minutes, four chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-28-videos-that-make-sense/plan.md`. It opens on the frame the owner
sent (step 6 of the walkthroughs-that-help plan video, as the review page showed it), then the evidence from the
review records: the labelled words were looked up and understood, the plain phrases were not; why check-terms and
frame-lint passed that frame; then each step. Step 4 pins the rules on the same real frame and shows it redrawn.
The video follows its own rules: no stand-ins, a label on its thing, a question that says what is decided.

## Customizations

- Medium: the real review page and real command runs, then planned mocks of the fresh-eyes files and the page, labelled planned.
- Layouts: a real screen beside a quote (1, 19), two columns (2), terminal runs (3), lists (4, 5, 29), a document (6, 7), a page mock (13), a before and after (20), a wall of video tiles (22), question and quick-check cards (8, 12, 14, 18, 21, 23, 27, 28).
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; push-slide UP for a question; crossfade for a branch, the redrawn scene and the ending.
- Real things: scene 1 and 19 (the review page at step 6 of the walkthroughs-that-help plan video, as the owner saw it), 3 (the real check-terms and frame-lint runs on that video), 6 (real pictures of its scenes at their last moment); scenes 6, 7, 13 and 20 are mocks, labelled planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`, headings `data-question`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. The review player plays the HTML project; an MP4 is rendered as well (the lead chose render at Step 6 for this autonomous run).

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on. Frames
are written by one generator, each reveal timed to its word from `audio_meta.json`. `assets/shots/step6-as-seen.jpg`
is the review page's stage at 2:58.6 of the walkthroughs-that-help plan video (the player's tab and caption
included), and `assets/shots/scene-*.jpg` are that video's scenes at their last moment. Before the build was opened,
the author ran the newcomer and designer checks the plan proposes by hand on this video's own narration and
frames, and fixed what they found (the report lists it).
