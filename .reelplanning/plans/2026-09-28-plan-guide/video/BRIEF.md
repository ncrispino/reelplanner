---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Five steps, four questions. The video stays the first place to go; behind it, the guide: a page for each plan, built from plan.md, with every step's cases, interface, example and decisions, where things happen as you scroll. Question 1, which is the source (recommended plan.md; step 1); every step's four blocks, checked (step 2); a scene points at its section and back, question 2, where it opens (recommended its own page; step 3); a note on any line, or a suggested edit the agent applies exactly, question 3 (recommended; step 4); a Built side after the build and the cost, question 4, how much guide (recommended every plan, with Built; step 5)."
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner, who asked for a full HTML plan behind the video, to see what happens in each case, what the interface is, and to edit it; knows the system video, the review page and the walkthrough; watches on a laptop, so one idea a scene and plain words
length: about four and a half minutes, four chapters (style guide §1: 3–5 minutes)
angle: how-to-process
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The plan video of `.reelplanning/plans/2026-09-28-plan-guide/plan.md`. It opens on the owner's own words, then the
evidence from the review records (questions sent back as "explain this more"; a plan three times its video), what
there is today, and where it sits beside the videos-that-make-sense plan. Then each step. The plan comes with a
rough prototype of its own guide (`guide-prototype.html`); the video shows it as the real thing and opens it from
scene 6 (a detail, `details/guide.html`, a copy), which is what the plan's step 3 proposes: the video pointing into
the page.

## Customizations

- Medium: the owner's words and the guide prototype (one stage that changes as you scroll) as a browser shows it, plan.md's own text, then planned mocks of the review page's link, the reel check run and the Built side, labelled planned.
- Layouts: a quote (1), two columns (2, 5), lists (3, 4, 33), a real page (6, 20), a before and after (7, 14, 26), code and a terminal (12), question and quick-check cards (8, 13, 15, 19, 21, 25, 27, 31, 32), branch diagrams (9–11, 16–18, 22–24, 28–30).
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; push-slide UP for a question; crossfade for a branch and the ending.
- Real things: scene 1 (the owner's message), 6, 7, 14 and 20 (the guide prototype, as a browser shows it), 12 (plan.md's cases block, as written); the reel check run (12), the plan text's link (14) and the Built side (26) are mocks, labelled planned; the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry `data-option`, headings `data-question`, outside any camera.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. The review player plays the HTML project; an MP4 is rendered as well (the lead chose render at Step 6 for this autonomous run).

## Notes

Autonomous run (`storyboard: no`): the storyboard summary is posted as a heads-up and the build goes on. Frames
are written by one generator, each reveal timed to its word from `audio_meta.json`. `assets/shots/guide2-*.png` are
the guide prototype (the second version, one stage that changes as you scroll) in headless Chrome at 1280 × 800:
step 1's beat, step 4's second case and its full step in the drawer, step 3's beat with its Watch picture, and step
4's interface beat with the edit and the files that follow it. `details/guide.html` is that prototype wrapped as a
detail page (a document, GSAP inlined from the repo's copy, the web fonts left to their fallbacks, the detail
pages' theme and bridge scripts), made from `../guide-prototype.html` by a copy step, never edited by hand.

Revised after the owner's notes (plan.md, "After the owner's notes"): scenes 5, 6, 7, 12, 14, 15 and 20 rebuilt,
their ids kept; the rest as they were. The first build's newcomer and designer passes were run by hand; this
rebuild went through `reelplanning fresh-eyes` (D-227), two fresh agents, findings answered in `fresh-eyes/`.
