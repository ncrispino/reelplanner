# The bakery bench at low depth, with scenes (2026-10-24)

One run of the README's bakery request at low depth, on the `scene-patterns` branch (847997d): the theme's scenes,
`reelplanner scene`, and the plan's **Look** block. It was measured as the [low-depth runs](2026-10-22-bench-low.md)
were:
- a fresh EC2 c7i.4xlarge, Claude Code 2.1.310;
- Opus 5.5 at medium effort;
- headless, with the same scripted review.

The question was not speed. Low run 3's video was mostly boxes of words, and the site it presented was drawn in the
video's own cream, ink and coral. Did the plan give the site a look, and did the video show it?

## Results

| | low, run 3 (2026-10-22) | scenes, run 1 |
|---|---:|---:|
| commit | 6377616 | 847997d |
| **First video, wall** | **10.8 min** | **11.0 min** |
| agent-min: plan / build | 1.8 / 9.0 | 2.0 / 9.0 |
| builds (failed) | 2 (0) | 3 (1) |
| tokens in (with cache) / out | 5.5M / 32k | 5.2M / 41k |
| cost | $2.78 | $3.13 |
| **Revision, wall** | **5.3 min** | **8.0 min** |
| builds (failed) | — | 3 (1) |
| cost | $1.27 | $1.34 |
| scenes | 8 | 8 |
| length | 1:45, then 1:51 | 1:52, then 1:59 |
| **Variety** (layouts over scenes) | 6 / 8, then 7 / 8 | 8 / 8, then 8 / 8 |

The first video took about the same time and cost 35¢ more. The revision took 2.7 min longer, for a bug that has
nothing to do with scenes (below).

## What the video shows

- **The plan has a Look** for each step people see: a palette with hex (flour cream, crust brown, oven red, ink),
  type, imagery, and the one recognisable thing (a wheat stalk by the name). The menu and the open-now badge each get
  their own.
- **The pages are drawn in it.** Frame 1 shows the three pages side by side, frame 2 the home page with each part
  labelled, frame 3 `menu.json` beside the menu page it builds, and frames 5 and 6 the visit page and the badge.
  All are in the bakery's colours, each marked `data-plan-component="page"`, with an SVG loaf as the photo.
- **The scenes were a start, not a form.** The agent read the scenes' README, ran `reelplanner scene` for frames 1
  (journey), 2 (anatomy) and 4 (two-futures), and read the three files. Then it wrote one generator script for all 8
  frames, taking their layouts but not their files. The frames do not keep the "Started from" header, so `variety`
  cannot count them against the cap.
- **Still boxes:** frames 7 and 8 (publishing, the web address) are nodes and wires.
- **Type:** the Look names Fraunces and Source Sans 3. Videos bundle only Inter, EB Garamond and JetBrains Mono, so
  the pages fell back to those.

## Avoidable, about 3 min

- **frame-lint read a picture's colour as a tween's target.** The loaf's `fill="#C99A63"`, in the page mock, gave
  "tween targets missing id #C99A63", five times. The agent rewrote the picture's colours as `rgb()` to get past it.
  Fixed: only a frame's script is read for a tween's target (a visuals spec check fails without the fix).
- **The first build stopped on an overlap** in frame 2's header (38 s). The agent drew the nav itself. As in low
  run 2, the layout check needs the frames assembled, so the first build is the first to see it.
- **The revision's build stopped at the guide** (about 1 min, and the fix). For the new step 5, the agent wrote
  `plan_step: 4, 5` on the last frame. That reads as no number, so step 4 lost its only scene. Not fixed here: a
  frame takes one step.
- **One build after each passing build** for words over words or past their box. Those are what a viewer would
  misread, so the skill's rule held.

## Limits

- One run. Agent runs vary, and one run cannot say how much of a difference is noise.
- Quality is judged by looking at the frames, and by `variety`.
