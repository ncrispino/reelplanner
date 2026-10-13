# Codex batched-authoring pilot: all four trials timed out

All four trials ended at the 60-minute first-showing cap without delivering a review. The pilot failed
the prespecified all-four-trials rule; no scripted revision began. Neither the cap nor a successful
intermediate build is a completed review time. This comparison demonstrates neither whole-video
speedup nor quality parity. The terminal results remain useful for diagnosing unfinished work.

## Fixed comparison and success rule

The clean baseline is `1866c4c`; the changed package is `d5818bc`, with batched frame checking,
shared frame mechanics and earlier assembled checks. Protocol tooling is frozen at `bd014c8`.
Both use Codex CLI 0.162.1, gpt-6.1-sol/high, Node 22.23.3, approve-for-me, and the same
workspace-write/network permissions on one Ubuntu 24 c7i.4xlarge. Narration is local Kokoro
am_michael at 1.25×. The order is before-1, after-1, after-2, before-2, with exact trial-owned
processes drained between runs.

The synthetic source evidence, 28–30 scenes, five choices, ten consequence branches and five
quick checks are fixed. Each first showing has a 60-minute allowance; its new scripted revision
has a separate 45-minute allowance. See the [contract](../../.claude/skills/pipeline-cost/bench/codex-batched/CONTRACT.md),
[protocol](../../.claude/skills/pipeline-cost/bench/codex-batched/protocol.json) and
[quality rubric](../../.claude/skills/pipeline-cost/bench/codex-batched/QUALITY.md).

Success requires both showings and every quality gate in all four trials, at least 20% lower median
total time, positive savings in both matched pairs, and no phase median more than 5% slower.
The total excludes synthetic reviewer delivery latency. Two independent comparisons must find no
materially weaker explanation, readability or visual usefulness for any required case or option.
Capped runs remain failures; they are never dropped from the comparison.

## First terminal pair

| Measurement | before-1 | after-1 |
| --- | ---: | ---: |
| Elapsed when the first phase was stopped | 3,600.313 s (60.005 min) | 3,600.292 s (60.005 min) |
| Time to successful first showing | Unknown; none occurred | Unknown; none occurred |
| Scripted revision | Not started | Not started |
| Completed recorded commands / nonzero exits | 189 / 26 | 89 / 21 |
| Completed command durations, summed | 901.074 s | 1,051.302 s |
| Completed command durations, wall-time union | 744.116 s | 949.141 s |
| Open command at the cap | One build | One HyperFrames play preview |
| Elapsed since that command's logged start | 49.556 s | 212.237 s |
| Command intervals including the open interval, summed / union | 950.630 / 793.672 s | 1,263.539 / 1,096.278 s |

The command recorder covers reelplanner invocations, not every shell command, browser operation,
approval, writing step or model wait. Summed durations add concurrent work; their union counts
overlap once. The open interval is clipped at the cap and is not proof of uninterrupted execution.
Time outside the recorder's intervals is not a measurement of pure model reasoning. The open
commands have unknown completed durations and exit codes. A long-lived preview command is not
equivalent to a render still being computed; these command intervals are not comparable work totals.

Exact exported response records observed before the cap:

| Run / role | Unique response records | Input tokens, including cache | Output tokens, including reasoning |
| --- | ---: | ---: | ---: |
| before-1 authors and reviewers | 397 | 40,804,194 | 192,687 |
| before-1 automatic approval review (guardian) | 351 | 23,883,906 | 25,749 |
| after-1 authors and reviewers | 389 | 45,361,025 | 154,468 |
| after-1 automatic approval review (guardian) | 337 | 20,028,913 | 25,452 |

These are observed records, not a claim of exhaustive whole-episode usage. Cached input and reasoning
output are subsets, not additional tokens. Before-1 guardian intervals sum to 691.039 s and occupy a
639.950 s union. After-1's sum/union is 829.655 / 758.888 s, including one interval clipped at the cap.
They overlap other work and cannot simply be added to elapsed time. All 26 baseline and 21 improved
exported session files match their checkpoint hashes. Responses are deduplicated across recursive exports.
Different unfinished work at the cap prevents interpreting the smaller output count as a quality-matched saving.

The [machine-readable record](2026-10-12-codex-batched-pilot.json) retains hashes, exact seconds,
observed token fields, unknown completion totals and the complete quality-gate vector. Delivery is
false because no showing occurred; the other gates remain unknown, not inferred semantic failures.
No actual visual-variety or paired-quality result is available for a delivered artifact.

## What consumed baseline time

The first 31m40s included plan/script authoring, material script-review repairs, guide source-format
repairs and frame workers. Fifty substantive frame-check attempts took only 7.755 s in that snapshot:
the 41 complete outputs explicitly skipped layout checks and pictures because the scenes were not
assembled; nine outputs were truncated. These checks do not measure browser performance. Two
narration jobs took 390.282 s summed and overlapped frame authors.

The first substantive build then stopped in 0.576 s on missing source pins and unsupported citation
forms. From starting that build to a passing source check took roughly 3m18s. A second build took 42.311 s and
found persistent text overlaps plus six missing guide references. The guide pages existed: adding
video-local `sources.json` made guide dispatch mistake the plan video for an unbuilt explainer.

A third build passed in 138.652 s. Independent newcomer/designer review then returned 23 and two
findings. These included hidden uncertainty explanations, overlapping counting rules and missing
operational definitions. Some questions concerned unavailable manuscript or implementation detail;
they were answered with limits rather than invented facts. Finding counts are not counts of proven
factual errors. Interactive QA separately reported quick-check jump-back, glossary-name collision
and expanded-explanation layering concerns.

The author repaired visuals and guide explanations and regenerated two narration lines. Answer
bookkeeping accepted dispositions for 25 findings, but required a second review of changed scenes
1 and 2. Player changes also still needed retesting. The final repaired build started with only
49.556 s remaining and did not finish before the cap. No user confirmation wait or review delivery
was observed. Earlier coordination sleeps overlapped writer/reviewer work; they are not additive
idle time.

## What changed in the improved run

The treatment was actually used: a shared generator produced the first six frames, a selected
storyboard assembled them, and three six-frame browser checks took 15.552, 16.988 and 16.769 s.
The first checks found theme/root and layout mistakes; the last recorded all 18 sampled moments
clean and six at-rest pictures. Narration took 298.162 s and overlapped this work. These were real
browser checks, unlike the baseline's early checks of unassembled files.

Script repairs finished later: the answer gate was reached at 1,472.310 s versus 1,024.748 s in the
baseline. The improved run had 14 first-round and eight second-round script findings, versus eight
in the baseline's first round. The baseline later needed more frame-review repairs. These are
different review scopes, not evidence that more checking was wasted or that early quality was equal.

All 29 frames were authored by the roughly 42-minute checkpoint, but later layouts still needed
repair. A build found ten overlaps across frames 19, 22, 23, 25, 26 and 29. An all-frame check took
140.588 s; inspecting its pictures also exposed card, link and caption overflow. After repairs, a
124.254 s build passed at 50.98 minutes. Shorter crossfades then required another 123.682 s build,
followed by a 127.613 s all-frame check and 30.504 s picture capture; some of that work overlapped.

At the cap, the designer had reported four unanswered findings. Preserved pictures confirm covered
text in scenes 25 and 26. The scene-6 column finding remains unconfirmed, and the scene-29 finding
needs adjudication; four reports do not mean four independently established defects. Relevant frame
writes preceded those pictures, with no later repair evidenced. The newcomer inspected all 29
pictures but had not saved findings or a final response. Expanded-guide browser checks and complete
reelplanner interaction checks were unfinished. No first showing or scripted revision occurred.

A separate HyperFrames playback audit observed all 29 media elements ready and advancing, the
549.081 s duration and the final scene near the end. That resolves an earlier shorter-snapshot
concern; it does not prove reelplanner's choices, quick checks, narration across branches or review POST.

The treatment therefore improved early assembled validation, but this pair does not demonstrate
faster completed delivery or equal final quality. Later layout rework and explanatory review remain
substantial costs. The next improvement must address those costs without removing the checks.

## Remaining terminal pair

The recovered after-2 and before-2 records close the frozen ABBA comparison. Both reached the
original 60-minute cap without a showing. No cap, source, version or success rule was changed.

| Measurement | after-2 | before-2 |
| --- | ---: | ---: |
| Elapsed when the first phase was stopped | 3,600.392 s (60.007 min) | 3,600.466 s (60.008 min) |
| Time to successful first showing | Unknown; none occurred | Unknown; none occurred |
| Scripted revision | Not started | Not started |
| Completed recorded commands / nonzero exits | 92 / 14 | 124 / 11 |
| Completed command durations, summed | 823.617 s | 462.027 s |
| Completed command durations, wall-time union | 758.257 s | 444.301 s |
| Open recorded command at the cap | None | One HyperFrames check |
| Elapsed since that command's logged start | — | 8.750 s |
| Command intervals including open intervals, summed / union | 823.617 / 758.257 s | 470.777 / 453.051 s |

After-2 recorded three builds: two nonzero exits followed by a 106.179 s successful build ending
about 45.67 minutes into the episode. It then continued frame checks and generated independent
frame-review briefs. Before-2 recorded three builds, all with nonzero exits, and its final HyperFrames
check had no end receipt at the cap. These are command outcomes, not delivered-artifact quality
judgments. The smaller recorded command sum in before-2 does not establish less total authoring work.

| Run / role | Observed unique response records | Input tokens, including cache | Output tokens, including reasoning |
| --- | ---: | ---: | ---: |
| after-2 authors and reviewers | 381 | 34,740,502 | 178,362 |
| after-2 automatic approval review (guardian) | 351 | 20,050,774 | 25,844 |
| before-2 authors and reviewers | 368 | 38,209,073 | 157,009 |
| before-2 automatic approval review (guardian) | 290 | 20,252,996 | 23,434 |

Usage coverage remains partial; these are observed exact records, with unknown whole-episode
request and token totals. No cumulative-usage fallback was added. Guardian task intervals sum to
1,352.542 s with a 1,234.168 s union in after-2 (350 completed tasks and one interval clipped at
the cap), and 766.820 / 713.324 s in before-2 (289 completed tasks, none open). Task counts and
response-record counts describe different units. Guardian intervals overlap author work and recorded
commands; adding their duration to elapsed episode time would count that overlap twice.

Neither run has immutable showing artifacts to support full gate assessment. Delivery is false;
all other quality gates, including readability, visual variety and paired usefulness, remain unknown.
This recovery did not independently classify the later trials' findings or inspect final diagnostic
pictures. The records therefore add no semantic-failure count or claim of equivalent quality.
With zero first showings and zero revisions across four trials, there is no valid median completed
delivery time or qualified speedup to calculate.

## Source-check limitation and follow-up fixes

To work around the guide classification error, the baseline moved its source manifest and renamed
active `source` fields to `evidence_sources`. It retained an earlier successful quotation audit, but
later builds skipped source checking. This storyboard did not set `sources_check: strict`; the
observed bypass followed optional source-tag activation. The old audit cannot certify later edits,
and bypass alone does not prove those edits contain false claims.

The separately pushed guide fix `d7a4231` preserves plan/walkthrough ownership when evidence is
pinned locally or beside the plan. Its regression fails the earlier classifier and covers real guide
generation, with 130 full guide checks and all 59 fast specs passing. It does not relax source checks.
The separate playback fix `0345f97` prevents a stale pre-seek tick from prematurely routing out of a
chosen branch. The Back fix `3c6027b` prevents an earlier question's arrival window from trapping
explanation replay. The parser fix `662cfbd` preserves headings quoted inside fenced source examples;
the improved run had needed an indentation workaround to stop losing guide paragraphs. Its regression
fails against the prior parser and passes 140 full guide checks plus all 59 fast specs. None of these
fixes was inserted into the frozen running comparison.

Earlier assembled checks and shared frame mechanics target repeated layout/root mistakes. Source
format discovery, guide dispatch and deeper explanatory repairs are distinct costs. The four frozen
trials did not demonstrate an improvement to completed delivery. The existing
[checker-only result](2026-10-12-frame-check-all-scenes.md) does not establish that outcome.

## Evidence limits

Final allowlisted logs were downloaded and verified before any cleanup; the drained baseline had
no remaining owned child processes. Its archive SHA-256 is
`459925353a7aae3c4b17dbc3c17014a66b933dd9b3df3375faef8057e132b3a0`.
Independent command-interval and exported-usage calculations agree; extractor/sanitizer checks
cover overlap, duplicate responses, missing exports, units, censoring and privacy. Raw transcripts
and machine identifiers remain private.

A separately preserved unfinished source or author-QA bundle is diagnostic evidence, not a showing.
It cannot substitute for the immutable delivered artifacts, narration playback, responsive guide
inspection, revision behavior and independent paired judgments required by the rubric. All four terminal
run records and their trial-owned process-drain receipts have now been verified.

The baseline's diagnostic snapshot contains 307 files (44,254,741 bytes), with SHA-256
`e991d9d2c12dd6100cb8a454af74edb17d4a2659697164f856e8f8c09a206689`.
Its author-QA bundle's map differs from the final source map: it predates some edits and cannot stand
in for the final state. The additional read/hash/archive capture took 3.218 s while after-1 was
running; it accessed only the drained baseline's files. This observational I/O is disclosed without
subtracting it from the measured trial clock.

After-1's terminal log archive is 21,813,054 bytes, SHA-256
`35666eab1ef6b9e13de63afb8853550b6afa80159076197129d90f426d2f1d33`.
Independent command and guardian interval sweeps, recursive response counters and the frozen legacy
usage calculator agree. The unfinished diagnostic snapshot contains 212 files (34,275,487 bytes),
SHA-256 `883b239190ff27f08c25559f302af849983e4c69e5289e60e65c8e988d765417`.
Its allowlisted read/hash/archive capture took 5.266 s while after-2 ran; that observational I/O is
disclosed without subtracting it from the trial clock. It is not a delivered artifact or paired-quality pass.

The final recovered collection covers all four terminal trials, with combined SHA-256
`7b518802efebca79dfc2544890f46e7a5f059f0ceb5e2fd2b5f5978346b81b01`. Its 91 session exports
match their checkpoint hashes (26 before-1, 21 after-1, 26 after-2, 18 before-2). The frozen summary
script searched only the sessions directory itself, missing recursively stored exports. A recovery-only
recursive discovery fix reproduced both previously published token totals; a separate exact-record
audit reproduced every published first-pair command field and guardian interval and matched all four
trials' observed usage. Independent endpoint sweeps also agree on command and guardian interval sums
and unions. The machine-readable record retains the new extractor, validator, collection and per-trial
receipt hashes. Existing first-pair records and their original archive provenance remain unchanged.
Raw sessions, command arguments, machine identifiers and diagnostic source bundles remain private.
