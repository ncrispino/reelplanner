# Codex authoring reliability: timed follow-up

**Complete; AWS resources deleted. No reliable production speedup demonstrated.** The comparable
first showings took **30.71 minutes before and 32.23 minutes after**; both revisions reached their
25-minute caps. The other new-version trial did not show a video within 40 minutes.

This follows the [owner-session audit](2026-10-12-reading-prompt-codex.md), the
[packet experiment](2026-10-12-codex-packet-bench.md) and the
[authorized implementation](2026-10-12-authoring-reliability-plan.md). Correctness checks established
the fixes; this experiment measures actual video work rather than inferring elapsed savings from
passing tests.

## Method

Four fresh sessions, serially on one disposable Ubuntu c7i.4xlarge: before-1, after-1, after-2,
before-2. Each receives the same six synthetic source events, five open choices and scripted
feedback. The first video gets 40 minutes; a successful review POST starts a separate 25-minute
revision allowance. No standalone context video or implementation/walkthrough is authored. Both
conditions retain independent script/frame reviews, a companion guide and five quick checks.

Before is the prior frozen package, core `45f64f2` plus its recorded shared guidance. It already
contains caption, chapter and linked-worktree delivery repairs. After is a Git archive of pushed
`4851416`, including the subsequent guide/parser fixes and focused authoring guidance. This does
not measure the whole change from the original owner checkout. Packages and measurement scripts
were frozen before the trials; [the manifest](../../.claude/skills/pipeline-cost/bench/codex-speed/source-manifest.json)
records their hashes.

Node 22.23.3, Codex CLI 0.162.1, `gpt-6.1-sol` high and the approval policy are identical. Each trial
has a fresh native plugin cache, verified against the selected package. Narration is local Kokoro
`am_michael` at 1.25x throughout both initial and revised videos. Holding pace fixed removes the
previous retuning confound; it does not measure the benefit of avoiding discretionary pace changes.
No Mac credentials or private research logs were uploaded. The VM had its own device sign-in.

## Results and scope

| Trial | First showing | Revision | Authored scenes / branches / checks | Layouts / transitions |
|---|---:|---:|---:|---:|
| Before-1 | 29.51 min | 19.60 min | 19 / **0** / 5 | 10 / 2 |
| After-1 | ≥40.01 min; not shown | Not reached | 31 / 10 / 5 drafted | Partial; not rated |
| After-2 | 32.23 min | ≥25.00 min; not shown | 29 / 10 / 5 | 12 / 3 |
| Before-2 | 30.71 min | ≥25.00 min; not shown | 27 / 10 / 5 | 8 / 2 |

All observed first showings have five choices. Before-1 nevertheless omits every per-option
consequence branch required by the shared style guide. A passing build and five choice cards are
therefore insufficient evidence of complete workflow coverage. Do not credit that omission as a
speed advantage or average its smaller workload into a fully featured comparison.

After-1 read the authoring guidance and justified its 31 scenes in BRIEF.md: ten are conditional
option branches. The player skips unselected branches, so authored scene count and linear duration
are different from the viewer's chosen path. The scene target is guidance, not runtime enforcement.
After-2 and before-2 both include all ten branches and five checks; their 1.52-minute difference is
one small pair, not a reliable slowdown estimate. No new-version trial completes the full measured
first-video-plus-revision loop.

Layout counts come from authored layout tags; they are not an aesthetic rating.

Capture delays were 0.28 seconds for before-1's first showing, 0.45 for its revision, 0.62 for
after-2 and 0.34 for before-2. All three first-showing review POSTs succeeded with five answers.
Both capped revisions passed late builds, but neither has a successful second showing within its
allowance. After-2's final show command was still in progress at cutoff; before-2 had just finished
its guide check. A ready message is not a showing receipt.

## Where work remains

**Frame authoring and repair still dominate.** Before-1 used a shared frame generator; after-1
used a fresh author and six frame groups. Those frame workers averaged roughly 35.6–43.1k input
tokens per request, but the continuing coordinator still made 142 requests averaging 144.7k.
Before-1's coordinator made 76 first-episode requests averaging 138.7k, then 28 revision requests
averaging 216.6k. Smaller frame workers do not by themselves bound the coordinator or prove faster
completed work. Scope and finished work differ between these trials.

**Shared rendering mistakes are caught too late.** Before-1's first assembly had 19 runtime
errors from numeric-leading DOM IDs used as CSS selectors. After-1 reached assembly with 26 root
styling lint errors despite individual frame checks: its scene roots were styled through classes
instead of HyperFrames' `#root` contract. Correcting a shared pattern is cheap compared with
authoring it repeatedly. The follow-up guidance now names the root/selector examples and calls for
pinned HyperFrames lint after the first HTML batch. That guidance was added after the measurement;
its latency effect is not tested here.

**Meaning repairs are material.** Before-1's first frame review found 15 newcomer and four designer
issues: inclusion criteria, overlapping labels, unknown eligibility, invented versus observed
rates and “four retries” versus four total attempts. Its second round had one newcomer finding.
After-1's designer found small table text/qualifiers, a category under a result heading and an
incomplete command example. Its newcomer requested explicit event identity, uncertain opportunity
counts and the distinction between Read and cooperative action/use. These should be caught in the
plan/visible-content contract before expensive frame rework; dropping the reviews would lose useful
corrections. Script review currently sees scene descriptions and narration, so it does not establish
that the eventual table cells and option cards preserve those meanings.

**The guide repairs are real, but are not an elapsed-speed result.** An isolated identical input
using `Components touched (all steps)` crashes the frozen before guide with `c.steps.join is not a
function`; after covers all 18 source paragraphs. In the live baseline, the guide omitted ordinary
Decisions in force prose and failed coverage; the author worked around the source format. An
independent check of its committed first-showing source passes all 137 headings/paragraphs. After-1
retained all 138 paragraphs but needed a separate four-pixel mobile overflow repair. Fixing format
compatibility does not prevent every authoring/layout problem.

## Usage and accounting

| Episode | Author/video-review input | Output | Recorded requests |
|---|---:|---:|---:|
| Before-1 first | 12.027M | 50.033k | 135 |
| Before-1 revision | 6.387M | 31.271k | 43 |
| After-1 first, capped | 24.955M | 132.186k | 261 |
| After-2 first | 24.752M | 61.051k | 267 |
| After-2 revision, capped | 18.344M | 40.634k | 125 |
| Before-2 first/revision | Unknown | Unknown | Unknown |

These are unique recorded response IDs inside each episode. Input includes cached input; output
already includes reasoning output. Automatic approval-review sessions are separate in the
[sanitized aggregates](2026-10-12-codex-speed-followup.json), along with command durations and cap
status. They are model work, not estimates of Codex subscription billing. Summed command durations
can overlap and are not phase wall time or agent-minutes. Missing session exports now produce
unknown request counts rather than zero.

## Experiment recovery and cleanup

The first setup-only VM stopped before any model runs because the setup used the unsupported TTS
alias `local`. It was deleted, and the replacement used `kokoro` explicitly before all trials.

The Codex process-group timeout did not stop every detached tool job. After-1's last build finished
at 42.77 minutes, 2.77 minutes beyond the CLI cap, while after-2 was in its initial planning stage.
An ownership audit found six residual shell/Node processes; they finished before the guarded
cleanup needed to signal them. Possible resource overlap limits precise comparisons. Future runs
need owned-tool draining before starting the next trial.

A local network interruption broke the collector. Its recovery download then timed out, and
cleanup was mistakenly started before the archive had been verified. Complete entries preceding
the interrupted archive tail were recovered: all four timing/reviewer/CLI logs, showing source and
synthetic repos. JSONL validation passes for the recovered files. Before-2's model-session export
is missing; its usage is explicitly unknown. The remaining three trials have their session exports.
Raw output and archive fragments remain private, outside Git.

Independent AWS reads confirm the instance terminated, the security group/key pair are absent and
the local SSH key is deleted. The independent watchdog also exited. Main VM runtime was 3.962 hours;
the setup-only attempt was 0.142 hours. At the previously verified $0.714/hour list price, combined
compute is approximately **$2.93**, plus storage/network. This is a runtime estimate, not an invoice.

## Next work and validation

Prioritize early frame-contract lint and a shared validated frame scaffold, then a fresh repair
owner with a focused handoff. Enforce branch coverage in the comparison rubric and preserve exact
visible example values before drawing. Keep complete checks, fixed voice pace and permission policy.
The next experiment also needs logs-first collection, resilient progress output and owned-job
draining; another four-trial run with the same measurement gaps would not establish a clean gain.

The [follow-up harness](../../.claude/skills/pipeline-cost/bench/codex-speed/README.md) preserves the
measurement scripts and reuses the earlier fixture/accounting helpers. **23 offline checks pass**:
accounting, missing exports, login lifecycle, separate deadlines, process ownership and fresh-cache
selection. No production latency claim follows from those regression checks.

The initial local fast suite passed 58/59 specs but failed the frame-tools elapsed-time assertion.
Power logs show a clamshell sleep interval during the run; the failing operation took 715.7 seconds.
With sleep prevention, the complete frame-tools spec passes all 14 checks in 24.6 seconds. The
repository fixtures and owner edits were preserved throughout. The attempted clean rerun also crossed a long lid-close sleep interval and ended with browser
timeouts (49/59 specs passed). Idle-sleep prevention does not prevent clamshell sleep. These local
full-suite runs are not clean validation; the draft PR uses the normal remote CI runner. The focused
23 benchmark checks and full 14-check frame-tools run pass.

Remote CI on `512dbf1` passes all 59 fast specs and fresh installs on macOS, Ubuntu Node 22 and
Ubuntu apt Node. The exhaustive run passed 79/80 specs and found two stale local-review text
expectations: the player says “Your waiting session picks this up,” while the older assertions
expected “Your open session picks this up.” Updating those exact assertions preserves the intended
waiting-session behavior; the full local-review spec then passes all 26 checks in 14.3 seconds.
The draft PR reruns remote validation on that correction.
