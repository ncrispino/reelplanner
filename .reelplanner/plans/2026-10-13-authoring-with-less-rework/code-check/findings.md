# Code check: 2026-10-13-authoring-with-less-rework

## Steps
- Step 1 — ✓ carried by `scripts/lib/scene-content.mjs`, `scripts/lib/terms.mjs:55`, `scripts/fresh-eyes.mjs:80`, `scripts/frame-packet.mjs:101` and their scratch regressions: both workers receive the same visible evidence and versioned stamps detect changed reviewer input.
- Step 2 — ✓ carried by `scripts/frame-scaffold.mjs`, `scripts/lib/frame-scaffold.mjs:17`, `templates/reelplanner/theme/scaffolds/flow.css`, `scripts/lib/frame-layout.mjs:177` and `scripts/test/frame-scaffold.spec.mjs`: optional populated native forms refuse overwrite, retain normal flow, and annotate existing browser findings without another browser pass.
- Step 3 — ✗ nothing in the diff carries the frozen seven-fixture authoring experiment, the new matched 120/45-minute delivery trials, or their independent quality receipts; closest are the regression additions in `scripts/test/frame-scaffold.spec.mjs` and `scripts/test/package.spec.mjs`, while `eval/pipeline-cost/2026-10-12-codex-batched-pilot.json` only closes the earlier failed experiment, so completed-delivery improvement remains unproven.

## Decisions
- D-001 — ✓ holds: `scripts/code-check.mjs` and this independent check preserve the second-agent implementation review.
- D-024 — ✓ holds: `scripts/detail.mjs:2` retains typed detail templates; `scripts/lib/frame-scaffold.mjs` generates scene frames separately.
- D-064 — ✓ holds in the checked diff: `scripts/lib/agents.mjs` retains configurable headless ownership and waiting when no worker is configured.
- D-066 — ✓ holds in the checked diff: `scripts/lib/agents.mjs` retains agent selection; the changed pilot report makes no claim of support for untested clients.
- D-082 — ✓ holds in the checked diff: `scripts/lib/agents.mjs:25` retains the Codex sandbox and automatic approval review.
- D-085 — ✓ holds: `scripts/frame-scaffold.mjs` adds an optional helper, and `scripts/fresh-eyes.mjs:129` preserves identical reviews instead of duplicating them.
- D-106 — ✓ holds in the checked diff: `scripts/lib/memory.mjs:52` retains the home-folder memory record.
- D-107 — ✓ holds in the checked diff: `scripts/lib/memory.mjs:40` and `scripts/lib/memory.mjs:481` retain the five-plan/three-signal retro suggestion.
- D-109 — ✓ holds in the checked diff: `scripts/reel.mjs:681` retains the rule that untagged misses pause nothing directly.
- D-110 — ✓ holds in the checked diff: `scripts/reel.mjs:624` retains the fifth-choice check; the supplied autonomy log has fewer than five calls in each step.
- D-127 — ✓ holds: `skills/plan-to-video/references/frames.md:87` describes intended screen evidence in plain language while retaining interface names.
- D-129 — ✓ holds in the checked diff: `packages/player/reelplanner-player.js:6987` retains Approve without a quiz-score condition.
- D-169 — ✓ holds in the checked diff: `scripts/case-study.mjs` is unchanged; the terminal video-authoring pilot does not replace the site case study's review order.
- D-170 — ✓ holds in the checked diff: `scripts/case-study.mjs` is unchanged and the pilot report explicitly declines to claim quality parity without delivered artifacts.
- D-171 — ✓ holds in the checked diff: `scripts/renumber.mjs` retains branch collision handling; no decision records are renumbered by the changes.
- D-195 — ✓ holds in the checked diff: `packages/player/reelplanner-player.js:3896` retains details opening over the frame; authored detail marks survive scaffold generation.
- D-197 — ✓ holds in the checked diff: `scripts/check-terms.mjs:45` retains later checks on a new case.
- D-198 — ✓ holds in the checked diff: `scripts/check-terms.mjs` retains the timing and reused-case warnings; the parser change does not relax them.
- D-199 — ✓ holds in the checked diff: `scripts/check-terms.mjs:74` retains the distinction between plan/system checks and walkthrough checks.
- D-200 — ✓ holds in the checked diff: `scripts/pr-check.mjs` retains contribution review requirements and maintainer-supplied videos.
- D-201 — ✓ holds in the checked diff: `scripts/reel.mjs:501` retains the last plan answer as authoritative.
- D-213 — ✓ holds in the checked diff: `scripts/review.mjs:53` retains the later throwaway-branch delivery mechanism; the diff adds no built media.
- D-215 — ✓ holds in the checked diff: `scripts/review.mjs:53` retains review of the video branch without rebuilding it.
- D-216 — ✓ holds: `scripts/check-terms.mjs` retains detected-term checks, and `scripts/lib/terms.mjs:55` keeps visible examples from overwriting term metadata.
- D-217 — ✓ holds in the checked diff: `scripts/check-terms.mjs` retains strict-mode failures for missing jargon meanings.
- D-219 — ✓ preserved by the implementation boundary: `scripts/walkthrough-scope.mjs` retains the real-running-change walkthrough requirement; completion of this plan's delivery remains outstanding under Step 3.
- D-220 — ✓ holds in the checked diff: `scripts/walkthrough-scope.mjs` retains meaningful-choice scoping without imposing the benchmark's five-choice workload on walkthroughs.
- D-221 — ✓ holds in the checked diff: `packages/player/reelplanner-player.js:5838` retains “listed, not judged.”
- D-222 — ✓ holds in the checked diff: `scripts/check-terms.mjs:74` retains the separate walkthrough-check rules.
- D-223 — ✓ holds in the checked diff: `scripts/walkthrough-scope.mjs` and `scripts/pr-check.mjs` retain visible-choice walkthrough scoping.
- D-225 — ✓ holds: `scripts/fresh-eyes.mjs:123` refuses regeneration with unanswered findings and archives answered changed rounds before rereview.
- D-227 — ✓ holds: `skills/plan-to-video/references/frames.md` explicitly retains independent final screenshot reviews; the new script contract does not replace them.
- D-244 — ✓ holds: `scripts/lib/plan-md.mjs` reuses the same fence-aware parser without changing the guide's plan.md source.
- D-245 — ✓ holds in the checked diff: `packages/player/reelplanner-player.js:2914` and `scripts/lib/fresh-eyes.mjs` retain newly kept findings and counted repeats.
- D-247 — ✓ holds in the checked diff: `scripts/case-study.mjs` retains the separate case study's site storage workflow.
- D-265 — ✓ holds: `templates/guide/guide.css:194` wraps long prose without removing source content, and `scripts/test/guide.spec.mjs` checks the complete phrase at mobile width.
- D-266 — ✓ holds: `templates/reelplanner/theme/scaffolds/flow.css:12` reserves detail clearance and the player diff leaves the quiet guide affordance unchanged.
- D-303 — ✗ the installed-command walkthrough demonstration is still absent from this plan's artifacts; `scripts/test/package.spec.mjs:51` exercises the packaged helper but does not supply the required video of the real installation and command working.
- D-304 — ✓ holds in the checked diff: `README.md:153` retains the original name's “real planning” explanation.
- D-305 — ✓ holds: `eval/pipeline-cost/2026-10-12-codex-batched-pilot.json` stores sanitized evidence; the checked diff adds no voice files or rendered media.
- D-306 — ✓ holds in the checked diff: `scripts/lib/ledger.mjs` and `scripts/reel.mjs:326` retain binding owner answers and touched-line history rules.
- D-309 — ✓ holds in the checked diff: `scripts/reel.mjs:654` retains accepted walkthroughs as settled history.
- D-310 — ✓ holds in the checked diff: `scripts/release/make-public.mjs` is unchanged and no repeated public-history export is introduced.
- D-311 — ✓ holds in the checked diff: `.github/workflows/ci.yml`, `.github/workflows/pr.yml` and `scripts/pr-check.mjs` retain the existing CI and merge requirements.
- D-312 — ✓ holds: `scripts/frame-scaffold.mjs` and the new skill references use reelplanner; existing player annotation storage keys are unchanged.
- D-313 — ✓ holds: `scripts/lib/frame-scaffold.mjs:70` writes local frame files and adds no hosted review service.

## Unexplained
- `scripts/lib/frame-scaffold.mjs:54` — ✗ chooses body/display fonts by preferring family names containing Inter/Garamond and otherwise using the first declared family for both, which is a visible fallback policy not specified by the plan or A1–A3; suggest an autonomy row “infer font roles from the standard family names, falling back to the first declared family, instead of requiring explicit role mappings.”
