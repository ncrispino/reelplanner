# A research repo, two weeks of videos (2026-09-24 to 10-10)

The owner's own use of reelplanner (then reelplanning, up to 0.2.0) on a private research project: three Claude
Code sessions, about 420 subagents, 17 videos (plan videos, walkthroughs, explainers) and their revision rounds.
The project's content is left out here; only how the videos were made is. Measured with `phase_times.py` per
episode and read by hand by three agents.

## Episodes, request to first showing

**Before fresh eyes existed** (late September, one session). One video was drawn by 44 one-frame workers; six by one
agent writing its own frame generator:

| Episode | How the frames were made | Wall min | Agent min | In tok | Build / verify (agent min) |
|---|---|---:|---:|---:|---|
| E0 plan video | 44 one-frame workers | 71 | 418 | 109M | 370 / 28 |
| E1 system video | one agent, generator | 29 (8.5 of it a permission wait) | 29 | 14M | 14 / 4 |
| E2 plan video | one agent, generator | 11 | 11 | 13M | 8 / 2 |
| E3 plan video | one agent, generator | 16 | 17 | 19M | 3 / 2 |
| E4 plan video | fork, generator | 9 | 11 | 18M | 5 / 2 |
| E5 walkthrough | fork, generator | 9 | 10 | 24M | 4 / 4 |
| E6 plan video | fresh builder, generator | 21 | 24 | 19M | 17 / 4 |

**With fresh eyes** (October, one 10-day session). Every video's frames were drawn by workers, 4 to 24 a video:

| Episode | Frame workers | Wall min | Agent min | In tok | Fresh eyes before showing | Watched at first review |
|---|---:|---:|---:|---:|---|---:|
| plan video 1 | 8 | 81 | 264 | 171M | — | 100% |
| explainer-style plan 2 | 10 | 16 | 40 | 18M | — | 1% |
| plan video 3 | 9 | 20 | 40 | 35M | — | 100% |
| plan video 4 | 8 | 29 | 85 | 65M | — | 98% |
| plan video 5 | 10 | 94 | 293 | 136M | — | 100% |
| walkthrough 6 | 6 | 65 | 211 | 127M | — | 1% |
| plan video 7 | 5 | 56 | 172 | 131M | — | 100% |
| plan video 8 | 24 | 63 | 365 | 178M | — | 2% |
| explainer 9 | 4 | 71 | 129 | 85M | after showing | — |
| plan video 10 | 21 | 90 | 418 | 200M | 2 rounds | 4% |
| **sum** | | **558** | **2,018** | **1,147M** | | |

Up to first showing: plan 4%, **build 72%**, verify 16%, other 7% of agent-minutes. After showing, the agent itself
ran unasked rounds: on explainer 9, fresh eyes, a 19-frame redraw and a second video (184 wall-min, 624 agent-min,
263M tokens), then rebuilds answering 311 findings (148 min, 716 agent-min, 350M tokens, and an hour with no link).

## Where the time went

- **Frame workers' orientation.** 259 frame workers used 3,772 agent-min and 962M input tokens, against 188 min and
  85M for the 26 fresh-eyes agents. On Opus 5 the median worker spent 9.3 min reading (the kit, the theme, sibling
  frames, reelplanner's source) before writing its frame, 7.9 min and 2.4M tokens a frame in all; on Opus 5.5,
  1.5 min and 0.38M (with a better brief: a frame kit and a shared screenshot script). In September's 44-worker
  video, 71% of the build was orientation. Each worker built its own screenshot harness; the scratch screenshots
  filled the disk and killed four workers. A spawn refused at the 20-agent limit went unnoticed for 14 min.
- **One agent with a generator** made 28–43-scene videos in 8–17 agent-min, narration running meanwhile, and drew
  no visual complaints; but each run wrote its generator from nothing (a later builder spent 4.5 min rebuilding one).
- **Context.** The main agent's context averaged 300–620k tokens a turn over up to 365 turns an episode; forks
  carried the whole conversation (630–780k input tokens a call, against about 190k for a fresh builder).
- **Bookkeeping.** Durations and the script: 43 messages about timing conventions, narration read a stale script
  six times, about 18 retime workers. Source checks failed 72 → 53 → 16 → 7 → 0 over about 45 min.

## Was the verifying worth it

528 findings over 18 files; 34% fixed.

| Reader | Findings | Fixed | What they were |
|---|---:|---:|---|
| fact checker | 79 | 76% | Material: wrong numbers and false claims, still in its second round |
| designer | 181 | 34% | Mostly cosmetic; one second round fixed 0 of 20 |
| newcomer | 268 | 21% | Mostly undefined terms, answered "kept: the audience knows" |

What the person said after watching (about 45 comments on 8 first reviews): about 70% the plan's substance (what
review is for), about 20% confusion over terms (the newcomer's class, which the agent had answered "kept"), about 5%
visual. In September, about 40% were clarity a reader of the storyboard could have flagged (built in build order
rather than big picture first, words never defined, coined names, "too much verbiage").

What no check caught, and cost most: **the video not being what was asked.** Plan video 10, after two rounds and
122 findings: "very disappointed at how misaligned… you gave me mostly words" (prototypes were wanted; the designer
had raised "the mocks are thin" six times, each answered "kept"). Plan video 8, after 112 findings: "nothing was
addressed". Also a broken voice, wrong ports and a missing link. And the person watched 1–4% of four first videos,
which had grown to 15–17 minutes; they also wrote "dont spend too much time verifying… wasting tokens to catch minor
things", and asked for HTML instead of a video twice.

Answering is a gate on the build: one round of 311 answers took about 105 agent-min, 60–70% of them "kept", and
two agents spent 49 min only reformatting answers so the gate would accept them.
