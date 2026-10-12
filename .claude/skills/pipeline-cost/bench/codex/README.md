# Codex AWS experiment

This is an experiment harness, separate from the existing Claude bakery benchmark. Use only a dedicated disposable Ubuntu VM. `codex-machine.sh setup` installs dependencies and writes that VM's Codex configuration; do not run it on a machine you keep.

Both conditions use the same synthetic research task, model (`gpt-6.1-sol`), high reasoning effort, Codex CLI 0.162.1, local narration and frozen reelplanner package. The package manifest records the already-tested caption/chapter/delivery fixes and shared-guidance hashes. No private research logs are used.

Baseline follows the installed skill normally. Packet treatment adds a consolidated authoring packet, selective reference reads and an example-first visual outline. Every source file's complete text is retained in the packet. This measures that combined authoring treatment, not an isolated model-setting change. Both conditions have five identical open choices, the same scripted revision request and the existing correctness/visual checks.

Run order is baseline-1, packet-1, baseline-2, packet-2, sequentially on the same VM. Synthetic global reelplanner memory is reset between trials; authentication is retained. Each has a 40-minute limit. A timeout is an incomplete, censored result and comparison trials continue; a non-timeout failure stops the suite for diagnosis. This stop-policy amendment was made while baseline-1 was still running, before its first showing or timeout. The active machine’s already-loaded batch used the original stop-on-any-incomplete policy; its collector is temporarily paused if manual continuation is needed, then resumed to collect and clean up. Time the first successful review showing and revised showing from `timing.jsonl` and `reviewer.jsonl`; capture phase command timings, failures/retries, token usage, scene counts and visual variety. `observe-showings.py` can run independently to copy synthetic source and snapshots at each showing; its observation timestamp makes capture delay visible. `summarize.py <extracted>/bench-results` reports episode times, cumulative-token deltas and command durations. Command durations are summed and can overlap; they are not phase wall time. Inspect saved snapshots and findings before judging a speedup. Four runs are a small exploratory sample, not a precise performance guarantee.

Use the existing `scripts/release/ec2-fresh.sh --profile <profile> --region us-east-1 --shell --type c7i.4xlarge --hours 4` for a capped machine. Supply the frozen package under `/opt/rp/`, copy this folder to `/opt/rp/codex-bench/`, run setup and log Codex in once with `codex-machine.sh login`. Keep the VM's login separate from active local credentials. Never copy an auth cache into a public artifact or benchmark result. The SSH login helper and AWS resource state for this particular experiment live outside Git.

The trusted local controller requires a private `state.json` containing this instance, public IP, local SSH key path, security group, key-pair name, AWS profile and region, plus its pinned `known_hosts`. With `--wait-for-login`, it waits up to sixty minutes for actual login success; no login means no model runs. It collects an explicit allowlist (benchmark results and scratch repos), excluding auth/config/login directories, and deletes its recorded AWS resources. AWS also terminates the VM on the four-hour shutdown deadline. Never fabricate resource state or point cleanup at an existing machine.

Raw transcripts and model output remain in private results outside Git. Publish only aggregate timings, sanitized findings and selected synthetic frames. `finish.py` uses unique response usage when available; on CLI formats with cumulative token events, it reports final per-session cumulative usage and leaves exact model-request count unknown. Usage-update counts are not labelled as model requests. The aggregate report separates `codex-auto-review` guardian sessions from the author and video reviewers; those automatic approval checks use a different model and must not be presented as high-effort author usage. Raw `run.json` totals from the initial collector include both; use `summarize.py` for this separation.

Setup time is excluded from video production. Local narration and fresh headless sessions differ from the original interactive hosted-voice run, so compare the two conditions with each other, not directly against the 38.6-minute owner run.

Offline regression checks (no AWS resources or model calls):

```sh
python3 -m unittest discover -s .claude/skills/pipeline-cost/bench/codex -p 'test_*.py'
```

These cover login expiry/cleanup and exact-response deduplication, cumulative fallback, separate
approval accounting, overlapping approval intervals and censored revisions. The completed
[experiment report](../../../../../eval/pipeline-cost/2026-10-12-codex-packet-bench.md) records results,
scope differences and cleanup; these scripts preserve that exploratory protocol, not a speed guarantee.
