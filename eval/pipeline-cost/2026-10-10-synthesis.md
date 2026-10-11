# Where a video's time goes, and what to cut (2026-10-10)

Across the first audits: [the bakery example on a fresh machine](2026-10-10-bakery.md) and [two weeks of the
owner's research repo](2026-10-10-research-repo.md), 19 videos from request to first showing.

## What the numbers say

1. **Understanding the plan is the small part.** Plan 4–17% of agent-minutes; turning it into a video and verifying
   it, 80–90%.
2. **How frames are made decides the cost.** One-frame workers: 9 min of orientation each on Opus 5 (71% of the
   build), 259 of them at 3,772 agent-min and 962M input tokens over ten videos. One agent with a frame generator:
   8–17 agent-min for a whole 28–43-scene video. Frame workers on Opus 5.5 with a kit: 1.5 min a frame.
3. **Verifying pays once.** The first fresh-eyes round finds the material things (the bakery: ~11 of 48; the fact
   checker: 76% fixed, all material). Later rounds find little (bakery round 3: none material; a designer round:
   0 of 20 fixed) and cost as much, mostly in answering: on the bakery video, 30.5 of 45 min was verifying and
   answering, three rounds, 135 written answers.
4. **The checks miss what costs most, and dismiss what they find.** The worst outcomes were the video not being what
   was asked ("you gave me mostly words": prototypes wanted), and plan gaps (the bakery's web address). Fresh eyes
   raised both, three and six times, and every time the builder answered "kept". The answers (fixed, meaning, kept)
   cannot send a finding back to the plan or the person.
5. **Context is the hidden cost.** Input tokens with cache reads are most of the bill: forks carry the whole
   conversation (630–780k a call), a main agent runs at 300–620k a turn, a fork grows 186k → 388k in one video.
6. **Long videos go unwatched.** 1–4% watched on four first reviews of 15–17-minute videos; the person asked for less
   verifying and, twice, for HTML instead.

## Proposals, ranked by saving

| # | Change | Saves | Risk | Evidence |
|---|---|---|---|---|
| 1 | **Frames from one generator, not one worker a frame.** Ship a frame kit in reelplanner (layouts, a cue/timing helper, holds, `reel shot` and `reel frame-check` instead of ad-hoc screenshot harnesses); one builder writes the frames with it, or, for big videos, 3–5 frames a worker from a self-contained packet (word timings, exact strings, one sibling frame), never reelplanner's source. | 50–90% of build agent-min; 15–40 wall-min a video | low | research repo E0 vs E1–E6; 259 workers' orientation |
| 2 | **One fresh-eyes round by default**, and show the video once its answers are in; a second round only on changed scenes, only when the first changed narration or structure. Keep the fact checker for videos that state numbers. | bakery 45 → ~29 min; ~16 min a revise | low | rounds 2–3 yield; "dont spend too much time verifying" |
| 3 | **A `plan:` answer that cannot be kept.** A finding that the plan lacks something, or that a frame describes what it should show, goes back to the plan (or to Before you watch) before showing. | a whole review cycle when it fires (22–90+ min) | improves quality | web address ×3, thin mocks ×6, all kept |
| 4 | **Check the storyboard against the ask before any frame**: the person's words and open review comments covered, big picture first, every term defined; the newcomer reads the storyboard and script here, where a fix costs a line, not a frame. | whole wasted videos (1–2 h, 400+ agent-min) | low | "misaligned", "nothing was addressed", ~20–40% of comments clarity |
| 5 | **The designer reports blocking defects only** (overlap, overflow, contrast, unreadable, a frame contradicting its line), most checked mechanically in the build; the rest advisory, no answer required. Plus a check that a value (a phone number, a count, a timing) is the same in every scene. | about half the answers and rebuilds | low | designer ~cosmetic; the phone mismatch twice |
| 6 | **A fresh video worker with a compact brief** (plan, BRIEF, decisions, the person's words; ≤50k), not a fork of the conversation. | 30–80% of input tokens; ~3 min orientation | low–medium | fork and main context sizes |
| 7 | **Shorter videos, decisions first**, held to the BRIEF's length. | 30–50% of build | low–medium | 1–4% watched; 15–17-min videos |
| 8 | **No unasked rounds after showing**: once shown, wait for the person. | up to 600+ agent-min a time | low | explainer 9 |
| 9 | **The build ends by checking and printing the review link** (right project, port, voice, fresh build). | idle hours, re-sends | none | wrong port, stale build, no link for an hour |
| 10 | **Plumbing:** narrate first with one source of timings; `build --check` with no render; the formats the tools read stated in one reference (not found by reading source); headless runs get the skill's path and skip `verify` on an approval. | 5–40 min a round | none | timing churn; failed builds 2/3 and 4/7; source reading |

1–3 alone would bring the bakery video from 45 to about 25 min; 1, 4 and 6 matter most where frames are many.

## Next

Each proposal that changes the skill or tools is a plan of its own. After it lands, audit the next comparable run
with the [pipeline-cost skill](../../.claude/skills/pipeline-cost/SKILL.md) and add its row to the
[ledger](LEDGER.md): the bakery example on a fresh machine is the repeatable baseline
([how to run it](../fresh-machine/2026-10-10-bakery-auto-mode.md#run-it-again)).
