# A long explainer on the research repo (2026-10-21)

One explainer (`reelplanner explain`), built on the owner's laptop in the research repo, from the ask to the review
page. Measured from its transcripts with `phase_times.py` (gaps capped at 60 s); its cost is from the transcripts'
token counts at Opus 5.5's list prices ($0.20/M cache reads, $5/M cache writes, $20/M output). The proposal it led
to is #34.

## The run

- **The video:** 26:31, 26 scenes (a frame each), 5 chapters, 2 quick checks, no decisions. 14 sources over the size
  limit, each with a guide part, and 274 facts printed by the explainer's own fact script. Variety: 15 layouts over
  26 scenes.
- **reelplanner:** 0.2.0, installed from main. Opus 5.5 throughout: the session and 32 subagents.
- **Wall:** 211 min (19:17 to 22:48 UTC). About 40 min of it was unrelated work in the same session and a machine
  reboot (the narration and review servers restarted).

| Phase | Agent-min | Wall-min | Input tokens (with cache) | Output tokens (est.) |
|---|---:|---:|---:|---:|
| plan | 40 | 37 | 47.3M | 27k |
| build | 206 | 63 | 69.2M | 319k |
| verify | 331 | 181 | 257.8M | 308k |
| all | 578 | 209 | 374.9M | 653k |

The phases are `phase_times.py`'s, and here they mislead. The four research agents (63 agent-min) count as verify:
they read the system the video explains, which is understanding, not checking. The session counts as verify too
(its main phase), although most of its work was writing and fixing the video.

## Where it went, by stage

| Stage | Agents | Agent-min | Input | Cost |
|---|---:|---:|---:|---:|
| The session | 1 | 158 | 183.0M | $45 (36%) |
| Research: reading the system it explains | 4 | 63 | 58.9M | $19 (15%) |
| Frames, first draw | 7 | 109 | 33.6M | $20 (16%) |
| Frames, redrawn after fresh eyes round 1 | 7 | 106 | 33.0M | $16 (13%) |
| Frames, redrawn after round 2 | 7 | 83 | 30.2M | $13 (10%) |
| Fact check of the storyboard | 1 | 19 | 18.3M | $5 (4%) |
| Fresh eyes, 2 rounds of newcomer, designer, fact checker | 6 | 41 | 17.9M | $9 (7%) |
| all | 33 | 578 | 374.9M | about $128 |

The session's 116 minutes of work, by what its tool calls were about:

| | min |
|---|---:|
| the explainer's text, storyboard and script | 28 |
| on-screen facts made to pass the sources check verbatim: the fact script, `check-sources`, `set-sources` | 23 |
| narration, and moving each frame's cues onto new word timings after re-voicing | 22 |
| unrelated work | 12 |
| frame workers' briefs, frame checks | 11 |
| answering findings | 9 |
| builds | 6 |
| other reads | 5 |

## The verifying

| Findings, fixed of found | Round 1 | Round 2 |
|---|---:|---:|
| Newcomer | 59 of 63 | 38 of 51 |
| Designer | 54 of 54 | 41 of 43 |
| Fact checker | 12 of 12 | 12 of 12 |

- **The fact checker's findings were all material:** claims the sources don't support. Round 2's 12 were new, several
  in lines rewritten after round 1. The second round paid for the fact check.
- **The designer's drove most of the redrawing.** In the building session's own sample of round 2, most were cosmetic:
  chip placement, margins, fades. Each round of them sent all 26 frames back to seven workers ($16 and $13).
- **The newcomer's** were mostly missing glosses. The building session judged one round enough.
- **Against the person:** their first remark on seeing it was that it was long ("wow this is kinda a long video
  right?"). No check measures that.

## The wastes

1. **Length.** At about $5 a scene, 26 scenes is most of the bill, and the person found it long. Its brief aimed at
   2–4 minutes; its `Length:` line took it past the build's 1.5× stop, on the grounds that the owner had said length
   doesn't matter and that each departure from the spec needed a scene of its own. The stop is one line away from
   off, and the agent writes that line.
2. **Whole-video redraws for cosmetic findings.** Two rounds of seven workers redrew every frame: $29 and 189
   agent-min, more than the first draw.
3. **Re-voicing by hand.** After each round, the session rewrote narration, re-ran narrate, and moved every frame's
   cues onto the new word timings with its own scripts (`retime.py`, `retime_all.py`). Stale durations then had to
   be fixed by the workers and the build's duration sync.
4. **The session's context.** 182M cache reads over about 2,170 calls: about 84k tokens a call, re-read each time,
   with two compactions on the way. Small steps were forced in part by a worktree guard that refused compound shell
   commands, so the session wrote small Python drivers instead.
5. **Verbatim facts.** Every on-screen fact had to pass `check-sources` verbatim, so the fact script grew with each
   checker round. That is what made the checker's fixes hold, at about 23 min of the session.

## Proposals

In #34: a depth per video (`depth: low | medium | high`) that sets its length and the checks it gets, and, at every
depth, a `reel retime` for cues after re-voicing and fewer, larger steps in the session. Ranked by this run's saving:

| # | Change | Saves here | Risk |
|---|---|---|---|
| 1 | A scene budget set by the depth (at most 15 at medium), past which only the person's own words take a video | about 40% of the frames and the session's per-scene work | an explainer of a large system says less; its guide parts carry the rest |
| 2 | Cosmetic findings noted, not redrawn, below high; one batched redraw | $16–29 and 80–190 agent-min | small layout faults ship |
| 3 | `reel retime` | most of the 22 min of re-voicing work, and the stale durations | none: it replaces a script each session writes |
| 4 | The fact checker again on rewritten lines only, instead of a whole round | part of round 2's cost | a claim outside the rewritten lines is not read twice |
