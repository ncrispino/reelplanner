# Frame-check batching: measured command saving

Checking the same three assembled frames together took **17.175 seconds**, versus **41.918 seconds**
with three separate calls: **59.0% less checking time**. This is a tool measurement on unchanged
content. It does not demonstrate faster end-to-end video authoring.

The implementation is `d5818bc`. The two strategies use that same implementation, including its
new failure guards; the comparison isolates batching rather than comparing a weaker checker.

A later [counterbalanced all-19-scene probe](2026-10-12-frame-check-all-scenes.md) retains full
logs and PNG digests, with a larger measured saving and explicit fixture/finding-parity limits.

| Serial round | Three separate calls | One batch call | Saved |
| --- | ---: | ---: | ---: |
| A | 42.271 s | 17.274 s | 24.997 s |
| B | 41.565 s | 17.075 s | 24.490 s |
| Mean | 41.918 s | 17.175 s | 24.744 s |

Both strategies used scratch copies of `videos/l2-upload-resume`, frames 3, 4 and 5, on the same
Apple M4 Pro/macOS machine with Node 22.19.0 and pinned HyperFrames 0.8.52. No model, narration
generation or cache reuse was involved. Each round ran the separate calls first and the batch
second; this small sequential probe is not a counterbalanced production trial.

Each frame keeps its three requested layout moments and plain at-rest screenshot. All six separate
calls and both batch calls succeeded; every batch reported three layouts and three pictures.
All six paired PNG comparisons matched by SHA-256. Individual PNG digest values and full command
logs were not retained; the measurement records preserve equality booleans. The
[JSON](2026-10-12-frame-check-batching.json) includes exact raw durations, source hashes and this
evidence limitation. The private script/raw records were preserved; the
[reproduction helper](../../.claude/skills/pipeline-cost/bench/codex-batched/measure-frame-check.mjs)
uses the same measurement logic with a portable import.

The previous authoring audit found 40 expensive frame browser checks occupying a 4.81-minute
union. Some overlapped other work, so this probe cannot turn that union into predicted authoring
savings. Batching removes repeated browser startup and whole-video sweeps; it retains per-frame
sampling and picture output.

Quality is checked independently of clean screenshots. Full differential regressions compare
individual pinned checks with batches containing duplicate labels in separate scenes, held overlap,
occlusion, overflow and transient content. Global runtime failures, lint that skips browser checks
and missing requested pictures fail explicitly. Whole-video verification and independent reviews
remain required. A documented mechanics-only shell was also checked with two distinct populated
visual forms, local fonts and assembled browser samples.

Validation: all **59 fast specs** pass in 263.3 seconds; full **28 frame-tools**, **35 build** and
**51 visuals** checks pass; **49 offline benchmark checks** pass. The fast suite retains Codex CLI,
inbox delivery, guide and player regressions. No owner fixtures were changed.

The [matched AWS protocol](../../.claude/skills/pipeline-cost/bench/codex-batched/README.md) measures
request-to-first-showing and POST-to-revised-showing separately, with the same complete scope,
model, permissions and voice. It requires independent source/readability/variety/guide/delivery
gates plus blinded paired quality judgments. Those video results must be recorded before making
a quality-preserving authoring-speed claim.
