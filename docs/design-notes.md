# Design notes: where the rules came from

The skill (`skills/plan-to-video/SKILL.md`) and its style guide say what to do, as current rules.
This file keeps the reasons that still explain a rule, grouped by topic: what went wrong, and what
changed because of it. The evidence base is [`research.md`](research.md), the reasons for the
visual choices are in [`design-rationale.md`](./design-rationale.md), and every decision a reviewer
made is in [`.reelplanner/decisions.md`](../.reelplanner/decisions.md).

## The research behind the guide

The first guide tagged each rule by its evidence. Strong: short segments (Guo 2014, ReelsEd 2025);
modality, redundancy and temporal contiguity (narration beside the picture, not on it; g = 0.74);
coherence (cut decoration; g = −0.37 to −0.41); signalling (useful, modest effect, g ≈ 0.38);
personalisation and a brisk voice (Brame, Guo); pre-training (name the parts first, Mayer); an ending
that states the pending decision (prospective memory, Chiossi 2023). Moderate: the beat order
(curiosity gap, Loewenstein; misconception first, Muller). Creator folklore: a hook of 8 s or less.

## Length: from one video to a series of parts

- The first target was 60–90 s, capped at 120 s. Real plans did not fit, and a later section made a
  plan video a series of 60–75 s parts, while the old cap stayed in the guide. A walkthrough ran six
  minutes. D-085 resolved it: the part is the unit, and the total follows from the plan.
- The first series build lost 47 s by cutting the beats with the least narration, which are the ones
  that pay off a choice: 9 of its 24 beats fell under 4 s, six branch beats went from 5.5 s to 2.7 s,
  and the cast beat's finished map was on screen for 0.16 s. Hence the 4 s floor, the 5–8 s branch
  hold and the 1.5 s hold after an assembly.
- `sync-durations` sets every frame to its voice line, which flattens those holds, so
  `hold-durations` re-applies them from `.hyperframes/holds.json`. A hold is a floor, never a cap:
  frame 9 of that build was held to 3.4 s after its line grew to 4.8 s, clipping the last two words.
- An opener that repeats the closer before it ("Next, part two…" then "Part two of three…") wastes
  both beats.

## The plan's shape

- "It seems like step i always depends on step i − 1, which is not the case" (the revise-loop plan
  review). So a plan says what changes before how, and which steps depend on which. For a while
  `reel check` demanded a `## What changes` heading and an exact `*Needs step N (why).*` line; D-085
  made both advice.
- `reel check` once read a step only as `### Step N — ` with that exact dash, so a plan written
  `Step 1: …` silently had no steps. One parser now reads any dash or a colon.
- A revised plan had to rename its own questions' heading to pass the re-ask guard, which compared
  the plan with the decisions its own review had just made. The check now skips a plan's own
  decisions.

## Questions

- The guide once implied about three questions, so a plan with five crammed them. The richer-review
  plan asked for every question the plan leaves open, budgeted per part rather than per video; `reel
  check` warns past six, because a plan that open is not ready to review.
- Pick-all-that-apply plays one summary frame, the same length whatever is picked (D-004), rather than
  every picked branch.
- Where a reviewer rewinds or slows down is sent as "hard to follow" (D-005), because nobody pressed
  the old "Wait, what?" button.

## Quick checks

The guide allowed at most one per part, so a six-minute walkthrough asked two, and none in the last
20 s. A wrong answer is the cheapest way to find where a reviewer expected something else, and after
any answer the player now offers "Expected something else? Say how it should work", which reaches the
agent as a comment on the step. D-083: at least one per step, plus wherever there is something to
predict, and each asks for a prediction.

## The stage

- The first three builds used one stage: a six-slot rail and a six-node service graph, present in 17 of
  19, 19 of 24 and 20 of 20 beats. A node graph says the parts exchange data at runtime. That is true
  of an upload service; in the Bob Dylan site plan, `Design`, `Search` and `Hosting` sat as
  disconnected nodes for the whole video, a checklist dressed as an architecture. Hence stage kinds,
  chosen from what the plan changes and recorded with a reason in `system.json`.
- The rail was exempt at first, as "cheap and orienting". But a 500×660 rail is 16 % of the frame and
  a third of its width, and it was a still picture on 63 %, 84 %, 88 % and 90 % of the beats of the first
  four videos. It also squeezed the subject: a page card was 1180 px wide because the rail took the
  first 660. So the rail is full only when it changes, a thin spine when the viewer still needs a
  position (an MP4 has no player chrome), and gone when the beat owns the frame.
- Two page mocks laid over the diagram covered half its nodes, so a prototype decision frame drops the
  diagram and keeps the rail. A mock of blank tiles and dot grids is decoration; a mock carries real
  words.
- At most six parts on a frame came from the first real review, where newcomers could not follow a
  diagram of everything at once. The lint counts the parts named in a frame's code, which is cheap
  enough to run per frame (D-013); four older frames that break it were left as they are (D-014).

## Visual rules from the first design review

The first design critique found every frame breaking the same rules at once. They now live in the
theme, the stage snippet and `frame-lint` rather than in the guide:

- One coral per frame means one: the caption's current-word underline, the kicker mark and option
  letters had all been coral too. When a card lands, the node hands its coral to the card.
- Edges are inherited, never front-loaded: a frame shows only the edges the steps so far have drawn.
- A node is a title and nothing else. Mono text is never below 26 px; shorten the words instead. A
  prototype's own content is exempt, because a label inside a depicted screen is small on purpose, and
  the markup declares it (`data-plan-component="page"` or `data-plan-option`).
- No pictograms; captions grow upward from a fixed bottom; decision kickers read `CHOICE n · STEP m`,
  never "your call"; an edge ends inside the node it points at; chips under the rightmost nodes align
  right, at most two, 12 px apart; a slot's decision tag is 12 characters or fewer.
- The navy tile never dims: a dimmed navy reads as a different colour, so the landmark flipped shade
  between frames. No brighter tint or halo on the recommended card: that is a second signal in the same
  colour. No blur entrances or idle drift: they crept back in when frames were rebuilt.

## Captions and numerals

- Captions were two- or three-word chunks; now they are the script's own sentences, with Whisper
  supplying only the timings.
- A card reading "A · Ten albums" under a caption reading "10 albums" looks like a bug, so everything
  the eye reads uses digits and the script keeps words for the voice. `captions-sentences` does the
  conversion, in the captions only. Its edge cases, each from a real script: a bare "one" stays a word
  (nearly always a determiner, "one index per album") unless it is counted off ("step one" → "step 1")
  or sits beside another numeral; only a real English number collapses ("three four five" stays words,
  since a caption saying 5 where the narration said "three, four" is worse than no digits); "and" joins
  a number only after a scale word; a spoken digit string keeps its digits ("four-oh-nine" → 409); a
  spoken year is written without a separator; "two-gigabyte" becomes "2-gigabyte" while "one-off"
  stays. `scripts/test/numerals.spec.mjs` holds the cases.

## Narration

- Kokoro speaks at about 150 words a minute and the guide wants 185 or more, so `narrate` asks for
  1.25×, synthesised rather than stretched. media-use's Kokoro branch dropped the speed it was handed
  until patched (`patch-tts-speed`), and any reinstall of the skills reverts the patch.
- One line at a time: at the default of four, the whisper runs fought over the cores and hit the 300 s
  timeout. A 38-line walkthrough took 44 minutes and lost 10 lines' timings; one at a time, a 27-line
  plan video took 7 minutes and lost none. `transcribe-missing` is the safety net, because a frame
  with no timings gets no captions.
- Only changed lines are voiced: one edited line of the system video's 35 took 32 s; all 35 take
  11 minutes.
- HyperFrames' skills are pinned: `hyperframes init` and `skills update` install from GitHub main,
  which on 2026-09-21 shipped a `media-use` that could not load.

## Details

A detail first opened in a side panel, so the frame stayed in view (D-021); since D-195 it opens over
the paused frame, grown from the thing it explains, and since D-264 a part of a video's guide is read in
the guide under the video instead. A call's detail opens on whatever
judges it fastest, and code only when the code is what is judged (D-023). Fixed templates came first,
with a blank page when none fits (D-024). D-085 made the kind a free word: the templates are starting
points, not a list to choose from, and the plan-text template went because the player shows the plan
itself. Two details on one beat became a warning. The look (the thing first, no cards, one
sentence before the content) came from critiques of the first pages.

## Running the loop

- The review server must outlive the session: a server started as one of the session's background
  tasks dies with it, and "no session is open" is exactly when a headless run is needed. Hence
  `review --detach`, one server per repo.
- A bare `claude -p` is denied every edit and command, and does nothing. The first headless command
  was `claude --permission-mode acceptEdits --allowedTools Bash -p` (with `-p` last, or
  `--allowedTools` takes the prompt as a tool name). It could not start subagents or read the web, and
  nothing fenced what its commands touched, so D-082 moved it to auto mode inside Claude Code's
  sandbox.
- The first sandboxed run could neither see nor reach the review server, so its closing
  `review --detach` started a second server and sent a dead link. Now the server watches the run it
  started and notifies the reviewer when it ends; `--detach` inside a run does nothing.
- "Autonomous mode" at the end of the skill described this repo but shipped to every repo, where it
  skipped the storyboard check-in. It moved to this repo's `CLAUDE.md`.

## Scaffolding taken out (D-085)

An audit found an agent reading about 12,000 words before starting, and each plan leaving about ten
files. What went:

- A review was kept three times: the annotations, a resolved copy of the whole plan or walkthrough,
  and one or two scope files. Now once, in `reviews/<kind>-<time>.json`, with a short `<id>.md` of what
  to act on; `migrate-reviews` filed 16 reviews across six plans, recovering overwritten rounds from
  git.
- The hand-ticked plan README went stale in two plans; `reel status` reads the stage from the files.
- The skill walked an agent through nine build commands by hand; `reelplanner build` runs them.
- The skill and the style guide, written as a changelog with version tags and contradictions, became
  one current guide each, with the history here.
