# Pipeline cost ledger

One row per episode: from the person's request (or a review taken in) to the first video they can watch. Measured
with the [pipeline-cost skill](../../.claude/skills/pipeline-cost/SKILL.md) (`phase_times.py`, gaps that are not work
capped at 60 s). **Wall** is what the person waited; the phase columns are agent-minutes (parallel agents add up), so
they can sum past wall. **In tok** counts input tokens with cache reads, usually most of the cost; **Out tok** is estimated from what the model wrote (— where the runs were measured before that). **Rounds** are
fresh-eyes rounds; **material** is how many of their findings a viewer would have been misled or lost without.
**Variety** is how many layouts the video's scenes take, over its scenes (`reelplanner variety <video-dir>`): a
cheaper video that looks more alike shows here. Capped episodes are lower bounds with no completed showing; Codex benchmark input/output totals exclude automatic approval review, which is reported separately.

| Date | Run | Episode | reelplanner | Wall min | Plan | Build | Verify | Other | In tok (M) | Out tok (k) | Rounds | Findings (material) | Variety | Report |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| 2026-10-12 | Codex follow-up, before-1 | first look; required branches omitted | frozen 45f64f2 + guidance | 29.51 | — | — | — | — | 12.027 | 50.0 | 2 script + 2 frame | 19 first-frame + 1 second; see scope limit | 10 / 19 | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, before-1 | scripted revision | frozen 45f64f2 + guidance | 19.60 | — | — | — | — | 6.387 | 31.3 | — | see report | — | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, after-1 | first look; capped, not shown | 4851416 | ≥40.01 | — | — | — | — | 24.955 | 132.2 | partial | material source/readability repairs | — | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, after-2 | first look | 4851416 | 32.23 | — | — | — | — | 24.752 | 61.1 | — | see report | 12 / 29 | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, after-2 | scripted revision; capped, not shown | 4851416 | ≥25.00 | — | — | — | — | 18.344 | 40.6 | — | revised build passed; show still running at cap | — | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, before-2 | first look | frozen 45f64f2 + guidance | 30.71 | — | — | — | — | Unknown | Unknown | — | model-session export missing | 8 / 27 | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | Codex follow-up, before-2 | scripted revision; capped, not shown | frozen 45f64f2 + guidance | ≥25.00 | — | — | — | — | Unknown | Unknown | — | revised checks passed; not shown within allowance | — | [report](2026-10-12-codex-speed-followup.md) |
| 2026-10-12 | synthetic Codex EC2, baseline-1 | first look; capped, not shown | frozen 45f64f2 + guidance | ≥40.01 (capped) | — | — | — | — | 27.762 | 120.7 | — | partial; see report | — | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | synthetic Codex EC2, baseline-2 | first look | frozen 45f64f2 + guidance | 38.04 | — | — | — | — | 11.147 | 50.6 | 1 script + 2 frame | 5 script + 16 frame | 11 / 20 | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | synthetic Codex EC2, baseline-2 | scripted revision; capped, not shown | frozen 45f64f2 + guidance | ≥1.96 (capped) | — | — | — | — | 0.991 | 1.1 | — | partial; see report | — | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | synthetic Codex EC2, packet-1 | first look; capped, not shown | frozen 45f64f2 + guidance | ≥40.01 (capped) | — | — | — | — | 25.111 | 118.1 | — | partial; see report | — | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | synthetic Codex EC2, packet-2 | first look | frozen 45f64f2 + guidance | 36.49 | — | — | — | — | 10.412 | 48.0 | 1 script + 2 frame | 9 script + 20 frame | 8 / 20 | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | synthetic Codex EC2, packet-2 | scripted revision; capped, not shown | frozen 45f64f2 + guidance | ≥3.50 (capped) | — | — | — | — | 1.095 | 2.1 | — | partial; see report | — | [report](2026-10-12-codex-packet-bench.md) |
| 2026-10-12 | research repo, Codex CLI, owner Mac | reading-prompt plan, first look | checkout, PR #27 + c161c82 | 38.6 | — | — | — | — | 14.885 | 84.1 | 1 script + 1 frame | 16 script + 56 frame (material timing and meaning errors; repeated symptoms) | 10 / 30 | [report](2026-10-12-reading-prompt-codex.md) |
| 2026-10-12 | research repo, Codex CLI, owner Mac | revise, plus worktree delivery and timing repairs | checkout + local delivery-fix branch | 32.5 | — | — | — | — | — | — | 1 script + 1 frame | 31 final frame findings | — | [report](2026-10-12-reading-prompt-codex.md) |
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
