# All-scene frame-check batching probe

Checking all 19 assembled scenes took **259.710 seconds separately, versus 38.689 seconds in one
batch**: **85.1% less command time**, saving 221.021 seconds. This extends the
[three-frame probe](2026-10-12-frame-check-batching.md). It measures checking existing content;
it does not establish faster video authoring or unchanged whole-video quality.

| Round and order | 19 separate calls | One all-19 batch | Saved |
| --- | ---: | ---: | ---: |
| A: separate, then batch | 261.814 s | 38.707 s | 223.107 s |
| B: batch, then separate | 257.606 s | 38.671 s | 218.935 s |
| Mean | 259.710 s | 38.689 s | 221.021 s |

Both strategies used the same `d5818bc` checker and failure guards, the same frozen scratch input,
Apple M4 Pro/macOS, Node 22.19.0 and pinned HyperFrames 0.8.52. These are actual unmodified CLI
calls, without injected browser flags or check-result cache reuse. Each strategy received its own scratch copy.
Timing covers CLI process start through exit; static checks, layout and snapshot work are included.
All 40 timed commands exited successfully. Counterbalancing reduces order bias; two rounds remain
a bounded tool probe, rather than an estimate of production latency.

Every requested frame retained its three sampling moments and at-rest PNG. **38/38 paired PNG
hashes, 38/38 sample lists and 38/38 own-frame printed finding sets matched.** All 76 PNGs,
individual SHA-256 digests and complete command stdout/stderr are retained privately. The
[JSON](2026-10-12-frame-check-all-scenes.json) contains exact elapsed times for every command,
sample lists, PNG digests, source/input hashes, normalized global findings and the scratch repair.

There are two important limits to finding parity:

- All own-frame warning/error sets are empty. This fixture adds sample and pixel coverage, but
  does not add positive defect/severity coverage beyond the committed differential regressions.
  CLI advice does not distinguish warning from error; an untimed structured batch independently
  recorded zero own-frame errors/warnings and 18 global warnings.
- Global finding sets differ: singleton checks collectively print 20 unique global findings,
  versus 18 in the full batch. The two differences are overlap advice for frame 8 when it is
  outside the requested singleton frame. A raw pinned frame-8 check finds overlaps at only one
  of its own three sample times; the pinned persistence rule treats those as transient info.
  Different seek sequences affect the unrelated global advice. Repeated GSAP `fromTo` swaps
  without an explicit stable baseline are a plausible fixture cause, not a separately proven
  causal diagnosis. Global equality and deterministic motion across arbitrary seeks are not
  claimed. Whole-video verification remains required.

The original fixture failed static lint on frame 14: two one-pixel strikethrough divs were
classified as text stand-ins. Frozen `1866c4c` reproduces the same failure. That failed probe is
retained and excluded from these timings. For this probe only, both divs became SVGs in the private
frozen input; all other input stayed fixed. Original and repaired at-rest frame-14 PNGs are byte
identical, SHA-256 `53db9d5891918ad2e23359f72f2b34884344ef1a98cae3ac3662a1fdf3d1dbc8`.
The committed fixture and checker were unchanged; the JSON records both source hashes and the
exact patch. This repair and the global differences prevent treating the probe as a clean bill
of health for that older video.

The authoring change still needs the [matched AWS pilot](../../.claude/skills/pipeline-cost/bench/codex-batched/README.md):
complete initial videos and genuinely new revisions, fixed scope and narration pace, showing
receipts, independent content/readability/variety/guide/delivery gates, and blinded paired quality
judgments. A faster checker is one measured improvement within that larger workflow.
