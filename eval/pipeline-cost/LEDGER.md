# Pipeline cost ledger

One row per episode: from the person's request (or a review taken in) to the first video they can watch. Measured
with the [pipeline-cost skill](../../.claude/skills/pipeline-cost/SKILL.md) (`phase_times.py`, gaps that are not work
capped at 60 s). **Wall** is what the person waited; the phase columns are agent-minutes (parallel agents add up), so
they can sum past wall. **In tok** counts input tokens with cache reads, usually most of the cost; **Out tok** is estimated from what the model wrote (— where the runs were measured before that). **Rounds** are
fresh-eyes rounds; **material** is how many of their findings a viewer would have been misled or lost without.

| Date | Run | Episode | reelplanner | Wall min | Plan | Build | Verify | Other | In tok (M) | Out tok (k) | Rounds | Findings (material) | Report |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 2026-10-10 | bakery (fresh EC2, c7i.4xlarge) | plan video, first look | 0.2.0 + #21 | 49 | 9 | 11 | 31 | 2 | 24.4 | 65 | 3 | 135 (~15) | [report](2026-10-10-bakery.md) |
| 2026-10-10 | bakery (fresh EC2, c7i.4xlarge) | revise after review | 0.2.0 + #21 | 24 | 2 | 4 | 16 | 2 | 15.2 | 24 | 3 | 94 (—) | [report](2026-10-10-bakery.md) |
| 2026-09-24 | research repo (owner's laptop) | E0 plan video, 44 one-frame workers | 0.1 | 71 | 13 | 370 | 28 | — | — | 0 | — | [report](2026-10-10-research-repo.md) |
| 2026-09-27 | research repo (owner's laptop) | E1 system video, one agent + generator | 0.1 | 29 | 10 | 14 | 4 | — | — | 0 | — | [report](2026-10-10-research-repo.md) |
| 2026-09-28 | research repo (owner's laptop) | E2 plan video, generator | 0.1 | 11 | — | 8 | 2 | — | — | 0 | — | [report](2026-10-10-research-repo.md) |
| 2026-09-28 | research repo (owner's laptop) | E3 plan video, generator | 0.1 | 16 | 5 | 3 | 2 | — | — | 0 | — | [report](2026-10-10-research-repo.md) |
| 2026-09-29 | research repo (owner's laptop) | E6 plan video, fresh builder + generator | 0.1 | 21 | 2 | 17 | 4 | — | — | 0 | — | [report](2026-10-10-research-repo.md) |
| 2026-10-06 – 10-10 | research repo (owner's laptop) | 10 videos, 4–24 frame workers each (sum) | 0.2 | 558 | 73 | 1,451 | 323 | 135 | 1147 | — | 0–2 | 528 over all rounds (fact checker 76% fixed) | [report](2026-10-10-research-repo.md) |
| 2026-10-10 | research repo (owner's laptop) | plan video 10, 21 frame workers | 0.2 | 90 | — | — | — | — | 200 | — | 2 | 122 | [report](2026-10-10-research-repo.md) |
