# The bakery bench at medium depth (2026-10-22)

The README's bakery request at medium depth, the new default, on the `depth` branch (#35), measured as the
[low-depth runs](2026-10-22-bench-low.md) were:
- a fresh EC2 c7i.4xlarge for each run, Claude Code 2.1.309;
- Opus 5.5 at medium effort for every request, checked per request in the telemetry;
- headless, with the same scripted review.

The prompt is the baseline's with one sentence added: "Make it a medium-depth video." The agent wrote
`depth: medium` in the brief. The target was about 20 minutes to the first video: low's run 3 (10.8 minutes, about
7.5 without its avoidable part), plus a longer video, the newcomer on the script, and one round of fresh eyes on the
video with its fixes.

## Results

The baseline is the fixed branch of 2026-10-11, the last bakery bench, which ran every check (high).

| | 2026-10-11, fixed (every check) | medium, run 1 | medium, run 2 |
|---|---:|---:|---:|
| commit | — | ac473fd | 685c666 |
| **First video, wall** | **35.9 min** | **23.8 min** | **27.1 min** |
| agent-min: plan / build / verify / rework | 2.7 / 18.9 / 20.3 (with rework) | 2.8 / 14.5 / 4.7 / 3.6 | 3.5 / 17.3 / 6.9 / 1.7 |
| builds (failed) | 7 (4) | 5 (1) | 5 (3) |
| tokens in (with cache) / out | 16.2M / 146k | 10.3M / 81k | 13.3M / 94k |
| cost | $9.53 | $5.90 | $6.97 |
| fresh eyes | newcomer and designer, two rounds | the newcomer on the script, then one round on the video | the same |
| **Revision, wall** | **13.6 min** | **15.5 min** | **8.9 min** (no fresh eyes: below) |
| builds (failed) | — | 6 (2) | 4 (2) |
| cost | $4.08 | $2.72 | $1.75 |
| scenes | 18 | 15, then 11 | 15, then 14 |
| length | — | 4:53, then 4:09 | 5:49, then 5:25 |

## The depth held

- 15 scenes and 4:53, within medium's 15 and its 3–5 minutes; 11 scenes and 4:09 after the review.
- Fresh eyes: the newcomer on the script, then one round of the newcomer on the video ("round 1 of 1 at medium
  depth"), 1.1 minutes. No designer. Its 21 findings were answered in 1.9 minutes: 11 into the plan (holidays,
  allergens, who hears that a menu update failed, what paying by Square changes), 5 fixed, 5 kept. The revision's
  round, on the changed scenes only, had 29 findings: 9 fixed, 5 into the plan, 14 kept.
- The earlier fixes held: `frame-check all` before the first build caught HyperFrames' lint error (a root styled by
  its class) on 14 frames, and the guide's check passed.

## Run 1: built again for what a check before the build would have shown

Each build of this 4–5 minute video took about 1.4 minutes. The agent built first and looked after, five times:

- **First video (about 3 minutes avoidable):**
  - After the first build passed, it looked at the frames, fixed a phone mock and built again; then fresh eyes, and a
    build for their answers. Looking while fresh eyes read would have put both into one build.
  - After that build, it moved one label it saw in a picture, and built again.
- **Revision (about 4.5 minutes avoidable):**
  - A build passed a frame-lint failure in a new frame: the build said frame-lint's findings without stopping, and
    not at all once the script had changed. `frame-check` showed it after; another build.
  - A table row added without a check: the build stopped on the overlap, 41 s.
  - After the last build, a label's background fixed from a picture: another build.
- The build told the agent to launch "the newcomer and the designer" at medium. The agent followed `fresh-eyes`'
  own line, the newcomer alone, so it cost nothing.

Fixed on #35 (685c666, bb3fdd0):
- `build` stops on frame-lint in a frame changed since the last build, before anything is voiced, also when the
  script changed.
- The skill: while fresh eyes read, `frame-check all` and look; fix both in one build; before it, `frame-check` the
  frames you changed.
- `fresh-eyes`' line names the depth's agents.

Without those five builds the first video would have come in about 20.5 minutes and the revision about 11.

## Run 2: those fixes held, and three other things cost about 5 minutes

The fixes from run 1 held. While the newcomer read the video, the agent ran `frame-check all` and looked, then
answered the 25 findings (13 fixed, 4 into the plan, 8 kept) and its own look in one build. Every rebuild's
frames stage passed frame-lint. The first video was still slower, 27.1 minutes:

- **A longer video.** 5:49 against run 1's 4:53, with the same 15 scenes; the script said 6:23, past medium's 3–5
  minutes, a △ that does not stop it (the stop is at 7:30). Its narration, its builds and its fresh eyes' findings
  grew with it.
- **The guide dropped words written in code (about 1.6 minutes).** The plan said a page's first line is
  `<!-- title: Visit -->`. The guide page removed every HTML comment before it drew the text, the ones in code too,
  so `guide --check` found two paragraphs missing. The guide is the build's last stage, so it stopped 1.5 minutes
  in; the agent rewrote the plan's file format to get past it.
- **Narration waited on (1.6 minutes).** It narrated while the newcomer read the script; the answers changed 9 of
  15 lines. The agent narrated them again only after drawing every frame, and then waited.
- **A layout no check could see first (about 1.1 minutes).** `frame-check all` before the first build has nothing
  assembled to look at, so the build found the overlaps (four page mocks' footers over their text) in verify.
- check-terms stopped three builds in all (0.2 s each), one here and two in the revision: cheap, as it should be.
- About two minutes went on reading reelplanner's installed source (the depth's scene cap, frame-lint's rules, what
  the player does with `data-plan-step`).

**The revision had no fresh eyes.** The agent opened the first video without committing it. A build's fresh eyes
belong to it, and a build is what `plan-diff` compares with the last committed video: with none committed, the
revision's build was the first build again, and `fresh-eyes` said its round was done. Run 1 committed first, and
its revision's round (29 findings on the changed scenes) took about 4 minutes. So run 2's 8.9 minutes is not a like
for like gain; about 13 is.

Its revision also built once more for a picture: its two new scenes had no layout check before the first build
(not assembled yet), and `frame-check` after it showed an address running out of its box.

Fixed on #35:
- The guide leaves out an HTML comment only outside code; its check and a step's lead read plan.md the same way.
- `reel-intake`: when changes are asked of a video that is not committed, its next step says to commit it first.
- The skill: commit the video before opening it; after the script's findings are answered, narrate again at once,
  before drawing.

Without the guide's stop and the wait, the first video would have come in about 24 minutes, as run 1's did. Still
open: a layout check before a frame is first assembled, and a medium video past its 5 minutes.

## Limits

- Medium's runs and the baseline differ in more than the depth: 11 days of fixes, and the frames drawn by one script.
- Two runs. Their first videos differ by 3.3 minutes, most of it the length the agent chose.
- Quality is judged by a look at the frames. They are richer than low's: the real hours file, menu table, order
  form and DNS records, and quick checks of 3–4 answers. One caption reads "the word 4" where the narration says the
  word "four", the point of that quick check: the captions' transcription writes numbers as digits.
