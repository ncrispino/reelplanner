# Matched Codex batch-authoring pilot

This overlay reuses `../codex/` and `../codex-speed/`. It owns no AWS resources, credentials or cleanup
controller. The frozen [protocol](protocol.json), [evidence/outline contract](CONTRACT.md) and
[independent quality rubric](QUALITY.md) apply identically to both conditions. No measured speedup
is claimed by the harness or its offline tests.

Build the private harness once, before freezing its hash:

```sh
python3 .claude/skills/pipeline-cost/bench/codex-batched/assemble.py /private/tmp/codex-batched-harness
python3 -m unittest discover -s .claude/skills/pipeline-cost/bench/codex-batched -p 'test_*.py'
```

Upload that harness as `/opt/rp/codex-bench/` and frozen packages as `/opt/rp/packages/{before,after}.tgz`
on the dedicated disposable machine. The external controller records package/harness hashes in
`/opt/rp/source-manifest.json`. Reuse the existing VM-only device login lifecycle and setup commands;
never copy an active local credential. Model, effort, permissions and pace stay fixed. The inherited
run-all order is before-1, after-1, after-2, before-2, serially, with independent episode
allowances of 60 minutes for the first showing and 45 minutes for revision. These caps were raised
before freezing because the fully scoped prior baseline's revision was censored at 25 minutes.
Caps are identical in both conditions. Four worst-case trials take seven hours; the external controller
must reserve setup/collection margin and an independently bounded machine lifetime. Warm the equivalent
local voice line outside trial timing and without a trial marker.
Do not average this protocol's results with the earlier 40/25-minute protocol.

Changes to the shared harness are small verified-anchor patches: fixed contract added to the input,
a genuinely new eight-row and P/P/Q/R revision comment, checkpoint monitor, showing capture gates and
owned-job drain. No installed reelplanner package is mutated. The old automatic cleanup controller
is deliberately absent from the assembled harness.
Future revision values stay in the harness/evaluator contract, outside the initial fixture. The first
author sees only initial scope and generic revision requirements. The evaluator checks that the new
examples were absent initially and that revised source bytes and visible content actually changed.

Sessions are checkpointed every 15 seconds from this trial's `CODEX_HOME/sessions/**/*.jsonl` only;
unchanged files are not recopied. A live incomplete final record is omitted until complete. Copies
and manifests are atomically written and fsynced. Authentication/configuration directories and
`:memory:.ses` are never traversed. A final checkpoint follows owned-job draining. Durable exports
remain private.

The reviewer freezes the showing before POST or done: source files, captions/map and screenshots,
plus immutable SHA-256 hashes. The owning canonical plan and original fixture/record evidence are also
frozen under each showing's `evidence/`, with validated trial-repo containment. Narration files are represented by hashes and WAV headers; audio
bytes are excluded. Capture rejects a source changed during the copy, and logs its delay separately.
Every showing requires a completed atomic observation manifest. Neither a ready message nor a late
passing build replaces a showing receipt.

Detached jobs inherit `RP_BENCH_LABEL`. Draining requires exact marker, same UID, original PID start
ticks and a cwd inside the trial repo before every signal. Unknown marked jobs outside the repo are
refused, including a neutral voice daemon; warm shared services outside markers or stop/restart them
outside timing with the same policy in both conditions. A final rescan must be empty before the next
trial. Any drain or verification failure stops the suite.
Reviewer and monitor launch from the trial repo; TMPDIR is an ignored trial-local operational folder.
Independent-review and repair scratch jobs must use that folder rather than an unregistered cwd.

The external controller must collect small logs periodically and before images, verify locally,
then collect and verify full captures. Example on the VM after a trial has drained:

```sh
python3 /opt/rp/codex-bench/collection.py pack "$HOME/bench-results" --labels before-1 --progress --out /tmp/progress-before-1.tgz
python3 /opt/rp/codex-bench/collection.py pack "$HOME/bench-results" --labels before-1 --out /tmp/logs-before-1.tgz
python3 /opt/rp/codex-bench/collection.py pack "$HOME/bench-results" --labels before-1 --full --out /tmp/full-before-1.tgz
```

After downloading, run `collection.py verify <archive> --labels <completed-labels>` for logs, and
again with `--full` for captures. It validates JSONL completeness, session hash manifests, drain
receipts and immutable showing source/sample hashes. Missing model exports block a collection claim;
Collection verifies sample byte hashes, not image validity or per-scene coverage; the independent
evaluator must establish actual scene coverage and readability under QUALITY.md.
accounting still reports missing usage as unknown. **Resource deletion may proceed only after both
archives pass locally and the controller records their SHA-256 hashes.** A network/download failure
must preserve the resource until recovery; an independently bounded safety watchdog remains the
controller's responsibility and should attempt durable logs collection first. No unconditional
`finally: cleanup()` belongs in this experiment.

For an active trial use `--progress` on pack and local verify after its first session checkpoint.
This tolerates an absent final drain receipt; it never returns `cleanup_eligible: true`. Final cleanup
still requires complete non-progress logs and a non-progress `--full` verification. Live JSONL writers
can advance during packing; a failed progress pack is retried against the next durable checkpoint,
without overwriting the last verified archive.

An independent evaluator supplies one result per trial with `label`, `completed`, `first_seconds`,
`revision_seconds` and a `quality` object containing an explicit boolean for every rubric gate.
Keep artifact evidence, usage and variety records beside that input. Assess it with:

```sh
python3 /opt/rp/codex-bench/assess.py /private/path/evaluated-trials.json
```

Caps and unknown gates disqualify the pilot. It qualifies only at ≥20% lower median total latency,
positive savings in both matched pairs and neither episode median >5% slower, with every gate passed
in all four trials. Report raw times and complete gate vectors even when the pilot fails.
