# Codex before/after authoring follow-up

This is the second synthetic AWS experiment. It compares the earlier frozen package with
`4851416`, without the previous authoring-packet treatment. The
[report](../../../../../eval/pipeline-cost/2026-10-12-codex-speed-followup.md) records the results and
limitations. It does not demonstrate a production speedup.

Assemble a private harness from the shared `../codex/` files, then overlay this directory's files.
The shared fixture, reviewer, login helper, summarizer and accounting tests are reused. Place that
harness at `/opt/rp/codex-bench/` on a dedicated disposable Ubuntu VM, supply the two frozen packages
as `/opt/rp/packages/{before,after}.tgz`, and place the manifest at `/opt/rp/source-manifest.json`.
`codex-machine.sh setup` installs both versions. This setup is for a disposable machine.

The VM uses its own user-authorized Codex device login. Each trial has a fresh native plugin cache;
the selected skill is checked against its package. Active Mac credentials are not copied. Collect
only `bench-results` and synthetic `bench-repos`; exclude authentication/configuration directories
and generated audio/video. Keep raw transcripts private.

The frozen order is before-1, after-1, after-2, before-2, serially on one c7i.4xlarge. Both conditions
use Node 22.23.3, Codex CLI 0.162.1, `gpt-6.1-sol` high, the same approval policy, local Kokoro
`am_michael` at 1.25x, five choices, five quick checks and the usual independent reviews. Neither
authors a standalone context video. Each first showing gets 40 minutes; a successful review POST
starts a separate 25-minute revision allowance. HTML review only, no MP4.

The source manifest retains the package and measurement-harness hashes used in the experiment.
After analysis, the shared summarizer was corrected to report missing session exports as unknown
request counts. Additional ownership/cache tests were added after the run. These changes do not
change measured showing timestamps.

The private controller, resource state, SSH key and device-login helper stay outside Git. The VM
had six-hour automatic termination, and an independent local cleanup watchdog. Ownership checks
precede resource deletion. Both instances used for this follow-up were deleted.

## Measurement limits to address before another run

- A successful showing command does not establish complete workflow coverage. Audit each option's
  consequence branch: before-1 passed its gates but omitted all ten required branches.
- Stopping the Codex process group did not stop every detached tool job. One build finished 2.77
  minutes after its trial cap. Verify owned tool processes have drained before the next trial.
- A local network interruption broke the collector. Recover and verify essential timing/source
  files before deleting resources; collect small logs before large images. Before-2's session
  export is missing, so its token/request counts remain unknown.
- Capped revisions are lower bounds. A passed build or a message saying the video is ready does
  not replace the successful second-showing receipt.
- Inspect examples and snapshots, and record layout variety alongside time. Four ordered trials
  are exploratory, with author-chosen outlines and different completed scope.

Offline checks, with no AWS or model calls:

```sh
python3 -m unittest discover -s .claude/skills/pipeline-cost/bench/codex -p 'test_*.py'
PYTHONPATH=.claude/skills/pipeline-cost/bench/codex python3 -m unittest discover \
  -s .claude/skills/pipeline-cost/bench/codex-speed -p 'test_*.py'
```
