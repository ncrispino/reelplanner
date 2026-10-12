# Codex authoring-packet experiment

**Status: complete; AWS resources deleted.** Two larger drafts reached their 40-minute caps without a showing; both smaller repeats showed a first video, but neither finished its revision. This experiment does not establish a reliable production speedup.

The [owner-session audit](2026-10-12-reading-prompt-codex.md) found large authoring contexts, explanation rework and stable-frame bugs. This experiment tests whether a complete source packet, selective reference reads and an example-first visual outline reduce that work while retaining the same choices and checks.

## Method

Four sequential fresh sessions: baseline-1, packet-1, baseline-2, packet-2. Each has a 40-minute cap for its first video and scripted revision together. An unfinished showing is incomplete evidence; it is never counted as a completed video. A capped first showing is a lower bound on production time. A capped revision is a lower bound only on the revision interval. Each condition uses the same five unresolved choices, six synthetic source events and fixed revision comment.

The treatment bundles context preparation and earlier visual/example planning; it cannot isolate their individual effects. The trials use a fresh greenfield project. The prerequisite command announces a system/context video explaining the parts and review flow. Execution differs: only baseline-1 authors that standalone context video, and all four write `before: none`. This limits claims about equivalent completion of the full new-project workflow. The reported first showings are the plan pages with five choices; they are not proof that every announced prerequisite was fulfilled. This differs from revising an existing project and from the original owner session. Local narration, Linux browser rendering and a fresh headless session also differ from that Mac session. Compare conditions within this experiment, not these times directly with the owner's 38.6 minutes.

- Primary model: `gpt-6.1-sol`, high effort; Codex CLI 0.162.1.
- Machine: disposable Ubuntu EC2 `c7i.4xlarge`; Node 22.23.3; local Kokoro narration with local Whisper timings.
- Frozen core: `45f64f23c4c2a741b05c3b2ccdd544787041b43d`, plus identical shared communication/style guidance for both conditions. This core includes the tested caption, chapter and linked-worktree delivery repairs.
- Package SHA-256: `ce7501c370dcc3f9ccf832231c8fbf1a1bf51aff9257176f29882fa91ef2bb2b`. Guidance hashes are in the [source manifest](../../.claude/skills/pipeline-cost/bench/codex/source-manifest.json).
- No private research logs or local Mac credentials were uploaded. The VM has its own user-authorized Codex login. Raw model output remains outside Git; the result archive explicitly excludes auth/config directories.
- Synthetic global reelplanner memory is cleared between trials. The first trial began with no memory on the fresh VM; that reset was added for subsequent trials during the first run.

The initial batch stopped on any incomplete run. Before baseline-1's first showing or timeout, the policy was amended to continue after the 40-minute cap and stop on other failures. Its already-loaded shell also reported a parsing error after the completed baseline timeout receipt because the runner had been updated in place. That handoff failure happened after the measured episode; a separate local coordinator completed the remaining trials on the same VM and login. Subsequent runner files were kept fixed while running. The original collector resumed after the comparisons and completed collection and cleanup. An independent safety timer and four-hour VM shutdown bounded the experiment; neither benchmark machine remains running.

## Results

| Trial | First showing | Revision | Plan/context draft scenes | Author + video-review input | Output | Requests |
|---|---:|---:|---:|---:|---:|---:|
| Baseline-1 | ≥40 min; not shown | Not reached | 30 / 8 | 27.762M | 120.708k | 314 |
| Packet-1 | ≥40 min; not shown | Not reached | 30 / none authored | 25.111M | 118.105k | 247 |
| Baseline-2 | 38.04 min | ≥1.96 min; not shown | 20 / none authored | 11.147M | 50.556k | 107 |
| Packet-2 | 36.49 min | ≥3.50 min; not shown | 20 / none authored | 10.412M | 47.999k | 117 |

Baseline-1's author/reviewer input includes 27.094M cached tokens. Separately, automatic approval review (`codex-auto-review`, low effort) recorded 17.823M input, 17.106M cached input and 17.587k output across 301 requests. The 300 completed approval checks sum to 10.410 turn-minutes and occupy 9.328 minutes as a union of their observed activity intervals; median duration is 1.757 seconds. They overlap other work, so this is not a removable nine-minute portion of the critical path. These are separate model work, not an estimate of Codex subscription billing or AWS charges. Output already includes reasoning output; it is not added again.

## Baseline observations

The baseline drafted 30 plan scenes plus eight context scenes, rather than a tiny synthetic case yielding a tiny authoring workload. Its context video completed two builds but drew a second independent frame-review round. Its plan had not finished the checks needed for showing when the cap stopped it.

The context script received six findings; its first frame round received 13 newcomer and one designer finding. After corrections, another newcomer round had six unanswered findings at cutoff. The plan's script had six findings. Many concern real comprehension: what the task checker tests, whether a suppressed-error read establishes an empty file, the unknown ownership of a restricted file, and how to find the separate plan review. Several later findings concern automated benchmark mechanics mixed into the context video. The greenfield prerequisite asks how a review works, but that does not require teaching the test runner’s automatic reviewer and its scripted revision.

Local narration is a material difference from the owner run: four completed narration calls sum to 668 seconds, with another 68 seconds of narration inside a rebuild. These calls overlap other work and must not be added as phase wall time. The saved plan's audio metadata still has some word ends beyond audio duration; the agent was retrying transcription for larger overruns. A narration preflight passed, so passing one short sample does not establish that every generated scene's timing will pass.

A scratch reproduction isolates the guide omission: the repaired baseline plan passes `guide --check --no-thumbs`; adding only a `Decisions in force` section saying no decisions are recorded produces one coverage failure for that paragraph. The [model excludes that section](../../scripts/lib/guide/model.mjs), while the [check expects every paragraph](../../scripts/lib/guide/check.mjs). This is a deterministic renderer/check mismatch, not just an agent failing to write a guide.

A separate metadata inspection finds all five baseline questions, but none attached to steps: its `(step N)` annotations sit inside the bold question title, while the parser reads the text after the bold title. `Recommendation: A` also is not parsed as a recommendation; the parser recognizes `I recommend`. The question text is retained as unplaced content, so zero questions attached to steps does not mean the words disappear. This is another format-compatibility issue to assess before judging the artifact fully functional; a passing plan check alone does not establish all those relationships.

Two inspected honesty frames clearly distinguish the unresolved synthetic observation from the invented thirty-row control. That is useful visual evidence, but partial snapshots do not establish that the whole video or its review flow is ready. The full plan frame review and scripted revision were not reached.

## Packet-1 observations

The treatment also drafted 30 plan scenes. It recorded 25.111M primary input (24.613M cached) and 118.105k output across 247 requests. Automatic approval review separately recorded 15.532M input and 14.938k output across 210 requests/checks; their observed activity spans 6.005 minutes, summing to 6.434 turn-minutes.

These lower totals are not a demonstrated efficiency gain: packet-1 never completed assembly, did not author the announced standalone context video, and did not reach the built-frame reviewers or the scripted revision. Its 30 frame checks sum to just 4.82 seconds because the assembly did not yet exist for their layout/snapshot checks; baseline-1's checks included actual assembled-context browser checks. Neither partial workload is a substitute for the completed quality gate.

The script reviewer had ten findings. The guide hit the same empty-decision prose omission. Narration invocations sum to 592 seconds (one is a help call lasting 0.1 seconds). Larger timestamp overruns were retried; the final public update says the counting scene's transcription recovered the actor clauses and fit the audio, then the first assembly failed on words concatenated across adjacent honesty-table cells. The cap stopped the run before that repair passed. Inspecting this text extraction separately is a candidate tooling fix; the timing result alone cannot establish whether the rendered table was unreadable.

## Recurring authoring costs in the first pair

Both agents changed narration speed after the initial voice work: baseline-1 reran all plan narration at `--speed 1.8` (264 seconds), and packet-1 at `--speed 1.4` (238 seconds). Their defaults began at the same local voice profile, but their final speeds are not identical. These are observed author choices, not a controlled voice-speed treatment. Stabilize voice pace before drawing; a later change invalidates audio reuse and adds retiming work.

The packet did not keep the continuing video builder's context smaller. That builder recorded 119 requests averaging 123,011 input tokens versus baseline-1's 94 averaging 104,428. Its smaller frame workers did use roughly 37–41k input per request, versus 61–63k for the baseline frame workers. The coordinator's mean input also fell (133k to 104k). This locates the remaining growth in the long-lived builder rather than establishing that every authoring context became bounded. Its scope and completed work differed, so these are diagnostic role counts, not a performance ratio.

The repeat baseline drafts 20 plan scenes rather than the first baseline's 30, with the same source facts and five choices. That within-condition variation reinforces the need for repeat trials and a defined authoring budget before a precise speed claim.

## Measurement and limits

[Experiment sources](../../.claude/skills/pipeline-cost/bench/codex/README.md) include the timing shim, fixed reviewer, artifact observer and aggregate summarizer. Use saved review-command completion timestamps for showings and the successful review POST timestamp for revision start. Command durations may overlap; they are not agent-minutes or non-overlapping phase intervals.

Tokens come from unique recorded response IDs inside each episode, separating author/video-review sessions from automatic approval-review sessions. The summarizer also supports cumulative-only CLI formats and leaves request count unknown on that fallback. Usage-update count is not a request count. Initial `run.json` totals include automatic review; the report uses the separated aggregate.

Four small, ordered trials are exploratory. A timed-out draft must not be compared as though it passed the same quality gate as a completed video. No complete revised showing was observed. The combined cap leaves only 1.96 and 3.50 minutes for those revisions; this experiment therefore does not measure their completed revision latency. A future revision comparison needs its own time allowance.

## The smaller pair and quality checks

Both first-showing captures arrived less than one second after the successful review command: 0.50 seconds for baseline-2 and 0.86 for packet-2. Each has 20 scenes, five decision stops and five quick checks. The automated review POST succeeded with five answers in each; the public CLI messages confirm both active sessions read their saved reviews and began revisions. This verifies the foreground CLI inbox handoff for the synthetic case, not real owner acceptance or desktop-app support.

Baseline-2's script review had five findings. Its first frame round had 14 newcomer and one designer finding; its second newcomer round had one. Packet-2's script had nine findings; its first frame round had 12 newcomer and two designer findings; its second newcomer round had six. All findings in the first-showing captures have answers. These include real clarity repairs: distinguishing agents A/B from options A/B, explaining suppressed read errors, preserving unknown rules rather than choosing them, and showing how Finish review → Send works.

`variety` on the saved first-showing sources reports **11 layouts / 20 scenes and three transition kinds** for baseline-2; **8 / 20 and two kinds** for packet-2. Neither overuses one transition beyond 70%. The two inspected counting frames clearly mark their three-occurrence/two-actor example as hypothetical. The packet snapshot shows three named attempts and their totals, but a static snapshot does not prove that episode regrouping is shown as a visual transition. Its requested revision was still in progress at cutoff. Fewer layouts are not automatically worse, but this metric prevents treating a slightly earlier showing as a free quality win.

For baseline-2's first showing, automatic review has 151 requests/checks and 4.934 minutes of observed activity (4.933 summed turn-minutes). Packet-2 has 124 requests, 123 completed checks and 5.937 minutes of observed activity (6.054 summed turn-minutes). That variation, alongside the small 1.55-minute difference, reinforces that this is an exploratory result. Do not average the two capped large drafts as 40-minute completed videos.

## Recommended next work

1. **Fix repeatable tooling friction first.** Preserve ordinary prose under Decisions in force and support common question/step and recommendation formatting. Reinspection of baseline-2's saved failed guide output identifies `c.steps.join is not a function`: its Components touched section used `(all steps)`, which reached the browser as the string `all`. The initial map-schema diagnosis was mistaken; expand those valid references to the plan's actual step numbers. The guide mismatch is reproduced independently; format relations are directly inspected. The table text-extraction issue needs its own isolated reproduction before calling it a bug.
2. **Set voice pace before drawing and retain it through the first showing.** Late speed changes triggered full four-minute narration passes in both large drafts. Owner-requested pace changes remain valid; avoid speculative retuning during authoring and regenerate only the changed work when needed.
3. **Bound the continuing builder, not just its initial brief.** Small frame workers stayed near 37–41k input per request, but the packet's continuing builder reached a 123k mean across 119 requests. Give each stage a narrow contract, concise diagnostic output and reusable frame/layout code. Avoid carrying full generated artifacts into every subsequent request.
4. **Define an explanation and scene budget with quality gates.** The same inputs yielded 30 or 20 plan scenes. Keep the five choices, examples, uncertainty and independent checks, but decide which facts need a separate animated scene before assigning work. The observed lower layout variety should remain visible in the next audit.
5. **Measure command and approval overhead under the intended CLI profile.** Automatic review occupies meaningful intervals. Group safe independent operations where the tooling supports it, and consider a shared browser check implementation. `frame-check` currently accepts one frame; appending extra frame numbers would silently leave them unchecked, so it is not an existing batching solution. Keep the same checks and permission policy in any comparison; do not infer a nine-minute saving from overlapping review activity.

These are proposals for their own plan and measured follow-up, as the pipeline-cost workflow requires. This experiment does not justify changing production model effort, dropping reviewers or claiming that AWS render hardware is the main bottleneck.

## Authorized implementation

The owner authorized implementation, commit and push on 2026-10-12. The
[implementation plan](2026-10-12-authoring-reliability-plan.md) covers the reproduced guide defects,
question formatting, stable caption/chapter timing, per-harness communication and focused authoring
guidance. Voice pace already participates in the narration cache key and persists on rebuilds; retain
that behavior rather than adding a second cache policy. Regression checks verify behavior, not elapsed
video-production savings. A comparable timed follow-up remains necessary for a speedup claim.

## Cost, cleanup and reproducibility

October-to-date AWS Cost Explorer reported **$25.00 estimated before this experiment**. EC2 list pricing was verified at **$0.714/hour** for this Linux instance type. The replacement VM ran about 3.43 hours until termination was requested; the earlier unused login VM ran about 0.58 hours. Combined compute is roughly **$2.9**, plus storage/network; this is a runtime/list-price estimate, not the final invoice. The first VM's approximate start is its key-creation timestamp.

The first VM expired before authentication and ran no models. The replacement used one separate user-authorized Codex login for all trials. The result archive was collected through an explicit allowlist before cleanup. Independent AWS reads confirm the replacement instance terminated, its security group and key pair are absent, and the local SSH private key is deleted. The first machine's successful cleanup receipt was retained. No benchmark VM remains running.

The [sanitized numeric aggregates](2026-10-12-codex-packet-bench.json) retain recorded token/request totals, episode boundaries, cap status and approval activity. They omit raw output, private paths and live resource identifiers. Raw transcripts, source captures and probe logs remain in private scratch storage outside Git. Four small ordered trials, incomplete revisions, author-chosen voice speeds and inconsistent prerequisite execution are explicit limits on interpretation.

## Validation

The login helper's four lifecycle tests pass, benchmark Python sources parse, Bash runners pass syntax checks, and the scripted reviewer passes Node syntax checking. Native exact-response accounting, duplicate usage events, cumulative episode subtraction and separate approval-review counts were checked with small fixtures and against the saved run data. The guide defect was reproduced on a synthetic scratch copy, with a passing control and one isolated coverage failure.

The investigation's initial owner-checkout fast run finished **58/59 specs passing**. Its two failed assertions were in the existing `names` regression for nonconsecutive frame IDs and shuffled voice order: that checkout still used `frame - 1` for caption offsets. The benchmark used the separate delivery-fix core, not that code. Its existing full `names` spec passed **43 checks**, and a separate scratch fixture with IDs 17/2/42 and shuffled voices passed the exact ordering/timing assertions that failed in the owner checkout. The paused owner's staging and production files were preserved during the experiment. The subsequent authorized implementation integrates that fix and both regression fixtures: the combined full `names` spec passes **46 checks**.

The first local test attempt could not allocate localhost ports in the sandbox (`EPERM`) and started no specs. The required fast run above used localhost access. The Git-archive-only snapshot could not run the spec's Git-index enumeration; the full successful spec was run in the actual delivery-fix Git worktree.

The authorized implementation's final clean fast run passes **all 59 specs in 230.8 seconds**. Full
affected specs pass, including **118 guide checks**, **46 caption/name checks** and **20 delivery
checks**. Eight offline benchmark regression tests pass. Independent re-review passes all six plan
steps and 47 cited decisions with no unexplained changes. Its first review caught command-word replies
being interpreted as inbox commands and the missing recommended-option badge; both are corrected and
covered through the package CLI and real guide page. [Saved check output](2026-10-12-authoring-reliability-checks.txt)
and [independent findings](2026-10-12-authoring-reliability-code-check.md) retain that verification.
The earlier fast run's concurrent report/brief edits tripped the fixture guard despite passing all
assertions; the final run kept fixtures stable. These are correctness checks, not a timed video speedup.
