# Pipeline cost ledger

One row per episode: from the person's request (or a review taken in) to the first video they can watch. Measured
with the [pipeline-cost skill](../../.claude/skills/pipeline-cost/SKILL.md) (`phase_times.py`, gaps that are not work
capped at 60 s). **Wall** is what the person waited; the phase columns are agent-minutes (parallel agents add up), so
they can sum past wall. **In tok** counts input tokens with cache reads, usually most of the cost; **Out tok** is estimated from what the model wrote (— where the runs were measured before that). **Rounds** are
fresh-eyes rounds; **material** is how many of their findings a viewer would have been misled or lost without.
**Variety** is how many layouts the video's scenes take, over its scenes (`reelplanner variety <video-dir>`): a
cheaper video that looks more alike shows here.

| Date | Run | Episode | reelplanner | Wall min | Plan | Build | Verify | Other | In tok (M) | Out tok (k) | Rounds | Findings (material) | Variety | Report |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| 2026-10-22 | bakery bench, low depth, run 1 (fresh EC2, headless, scripted review) | plan video, first look: 8 scenes | depth (#35, be0a1b2) | 13.2 | 2.4 | 10.8 | — | — | 5.7 | 47 | 0 | — | 7 / 8 | [report](2026-10-22-bench-low.md) |
| 2026-10-22 | bakery bench, low depth, run 1 | revise after review: 7 scenes | depth (#35, be0a1b2) | 7.1 | 1.5 | 5.6 | — | — | 3.9 | 22 | 0 | — | — | [report](2026-10-22-bench-low.md) |
| 2026-10-22 | bakery bench, low depth, run 2 | plan video, first look: 7 scenes | depth (#35, 44489b3) | 12.8 | 1.8 | 16.5 | — | — | 10.1 | 89 | 0 | — | 5 / 7 | [report](2026-10-22-bench-low.md) |
| 2026-10-22 | bakery bench, low depth, run 2 | revise after review: 7 scenes | depth (#35, 44489b3) | 10.1 | 1.3 | 10.3 | — | — | 4.7 | 46 | 0 | — | 6 / 7 | [report](2026-10-22-bench-low.md) |
| 2026-10-22 | bakery bench, low depth, run 3 | plan video, first look: 8 scenes | depth (#35, 6377616) | 10.8 | 1.8 | 9.0 | — | — | 5.5 | 32 | 0 | — | 6 / 8 | [report](2026-10-22-bench-low.md) |
| 2026-10-22 | bakery bench, low depth, run 3 | revise after review: 8 scenes | depth (#35, 6377616) | 5.3 | 1.3 | 3.9 | — | — | 3.3 | 19 | 0 | — | 7 / 8 | [report](2026-10-22-bench-low.md) |
| 2026-10-21 | research repo (owner's laptop) | explainer, first look: 26 scenes, 7 frame workers × 3 rounds | 0.2.0 (main) | 211 | 40 | 206 | 331 | — | 374.9 | 653 | 2 | 235 over both rounds (the fact checker's 24, all fixed) | 15 / 26 | [report](2026-10-21-research-explainer.md) |
| 2026-10-11 | bakery bench, main (fresh EC2, headless, scripted review) | plan video, first look | main (0.2.0 + #21) | 47.8 | 2.3 | 35.4 | 55.5 | — | 34.3 | 374 | — | — | 9 / 18 | [report](2026-10-11-bench.md) |
| 2026-10-11 | bakery bench, main | revise after review | main | 30.2 | 2.1 | 16.5 | 19.0 | — | 18.3 | 129 | — | — | — | [report](2026-10-11-bench.md) |
| 2026-10-11 | bakery bench, cheaper-videos as first built | plan video, first look | cost-audit (frames stage v1) | 78.4 | 2.7 | 70.1 | 37.8 | — | 44.0 | 398 | — | — | 10 / 18 | [report](2026-10-11-bench.md) |
| 2026-10-11 | bakery bench, cheaper-videos as first built | revise after review | cost-audit (frames stage v1) | 29.9 | 2.3 | 26.3 | 12.0 | — | 22.6 | 112 | — | — | — | [report](2026-10-11-bench.md) |
| 2026-10-11 | bakery bench, cheaper-videos fixed | plan video, first look | cost-audit (frames stage v2) | 35.9 | 2.7 | 18.9 | 20.3 | — | 16.2 | 146 | — | — | 10 / 18 | [report](2026-10-11-bench.md) |
| 2026-10-11 | bakery bench, cheaper-videos fixed | revise after review | cost-audit (frames stage v2) | 13.6 | 2.2 | 8.9 | 3.5 | — | 13.2 | 39 | — | — | — | [report](2026-10-11-bench.md) |
| 2026-10-10 | bakery (fresh EC2, c7i.4xlarge) | plan video, first look | 0.2.0 + #21 | 49 | 9 | 11 | 31 | 2 | 24.4 | 65 | 3 | 135 (~15) | — | [report](2026-10-10-bakery.md) |
| 2026-10-10 | bakery (fresh EC2, c7i.4xlarge) | revise after review | 0.2.0 + #21 | 24 | 2 | 4 | 16 | 2 | 15.2 | 24 | 3 | 94 (—) | 10 / 20 | [report](2026-10-10-bakery.md) |
| 2026-09-24 | research repo (owner's laptop) | E0 plan video, 44 one-frame workers | 0.1 | 71 | 13 | 370 | 28 | — | — | — | 0 | — | — | [report](2026-10-10-research-repo.md) |
| 2026-09-27 | research repo (owner's laptop) | E1 system video, one agent + generator | 0.1 | 29 | 10 | 14 | 4 | — | — | — | 0 | — | — | [report](2026-10-10-research-repo.md) |
| 2026-09-28 | research repo (owner's laptop) | E2 plan video, generator | 0.1 | 11 | — | 8 | 2 | — | — | — | 0 | — | — | [report](2026-10-10-research-repo.md) |
| 2026-09-28 | research repo (owner's laptop) | E3 plan video, generator | 0.1 | 16 | 5 | 3 | 2 | — | — | — | 0 | — | — | [report](2026-10-10-research-repo.md) |
| 2026-09-29 | research repo (owner's laptop) | E6 plan video, fresh builder + generator | 0.1 | 21 | 2 | 17 | 4 | — | — | — | 0 | — | — | [report](2026-10-10-research-repo.md) |
| 2026-10-06 – 10-10 | research repo (owner's laptop) | 10 videos, 4–24 frame workers each (sum) | 0.2 | 558 | 73 | 1,451 | 323 | 135 | 1147 | — | 0–2 | 528 over all rounds (fact checker 76% fixed) | — | [report](2026-10-10-research-repo.md) |
| 2026-10-10 | research repo (owner's laptop) | plan video 10, 21 frame workers | 0.2 | 90 | — | — | — | — | 200 | — | 2 | 122 | — | [report](2026-10-10-research-repo.md) |
