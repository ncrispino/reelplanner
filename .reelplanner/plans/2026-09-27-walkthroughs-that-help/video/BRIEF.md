---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Six steps, four questions. The review records say walkthroughs are accepted without a look (69 of 69 since 26 September, four choices on one pause in under a second, two approved with nothing judged), and what the owner did catch was always something they could picture. The walkthrough becomes about two minutes of the change running, before and after on the real screen (step 1, question 1); an off-plan change always pauses, plus at most three choices you'd see or can't undo, the rest a list, and the ten-in-a-row rule goes (step 2, questions 2 and 4); no quick checks after the build, one open question at the end (step 3, question 3); pull requests get the short video, the line unchanged (step 4); the page logs when each pause began and reel memory reports it against a mark to beat (step 5); the system video says the new rule and stays under eight minutes (step 6)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who says they end up spamming accept on walkthroughs and asked whether it should be a separate video at all; knows the system video, the review page and the walkthrough; reads this on a phone, half-awake, so one idea a scene and plain words
length: about five minutes, five chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

Round 3, after the owner's second review (`reviews/plan-20260927T194145Z.md`): all four questions decided (D-221 to D-224), so no question is asked and the video ends on approve; steps 1 to 3 take in backend changes; step 6 says what dropping the video means and opens a page with the whole of it; step 7 a bit shorter.

Revised after the owner's plan review (changes requested, `reviews/plan-20260927T181934Z.md`): question 1 decided (D-219), step 2 decided in the owner's words with no fixed count (D-220), the listed choices and quick checks asked again with an example per option, a new question on small pull requests, a new step 5 (plan and what was built in one place), step 6's missed bar made plain, step 7's soft target. The accepted evidence is cut to a line; the first version's intent follows.


The plan video of `.reelplanning/plans/2026-09-27-walkthroughs-that-help/plan.md`: the owner said walkthroughs
are not helpful ("i just end up spamming accept"). The video starts on a real walkthrough pause and the
owner's words, shows the evidence from the review files (four accepts in under a second, two walkthroughs
approved unjudged, what was caught versus a real choice nobody could judge from one line), and why fewer
pauses made accepts faster. Then each step: the change shown running on real screens (step 1), the old
ten-in-a-row rule struck on a real `reel stops` run and the new cap of three (step 2), one open question in
place of quick checks (step 3), the real CONTRIBUTING.md line (step 4), the gap the page will measure (step 5)
and the system video's real scene lengths (step 6). Question 2 asks decision D-084 again, question 3 asks
D-083 again for the walkthrough, question 4 asks D-041 again for the listed choices.

## Customizations

- Medium: real screens of the review page and real files and runs, plus small charts and diagrams; composition varies per scene.
- Layouts: a real screen beside a quote (1), lists (2, 4, 18), four tiles (3), real screens over two file slabs (5), two sorted columns (6), a planned mock of two checks (7), a real document with two small cards (9), two scene strips with a jump (11), a chain from the bar to a plan row (13), a row of real scene lengths (15), quick-check cards (8, 10, 12, 14, 16, 17).
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; crossfade for the ending.
- Real things: scene 1 (the review page paused at a walkthrough's stop, and the owner's words), 5 (the details-in-the-frame walkthrough's screens, before and after), 9 (CONTRIBUTING.md), 15 (the system video's scene lengths); scenes 7 and 13 are mocks, labelled planned (13's status line opens the "If the bar is missed" page); the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; quick-check and question cards carry `data-option`, headings `data-question`, outside any camera.
- Question 2 re-asks decision D-084, question 3 D-083 (for the walkthrough), question 4 D-041 (for listed choices): each says what it asks again, with keeping it as an option (style guide §6, superseded decisions).
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. The review player plays the HTML project; an MP4 is rendered as well (the lead chose render at Step 6 for this autonomous run).

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on.
Frames are written by one generator (adapted from the details-in-the-frame video's), each reveal timed to its
word from `audio_meta.json`. The screenshots in `assets/shots/` are reused: `today-stop.jpg` from the system
video's `stop-light.jpg` (the fewer-better-stops walkthrough at 1:51, scaled to 1440 × 900), and
`scene12-chip.jpg`, `mark-button.jpg`, `grow.jpg` from the details-in-the-frame walkthrough video.
