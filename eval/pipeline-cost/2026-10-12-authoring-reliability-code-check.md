# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/setup-check.mjs`, `scripts/lib/agents.mjs` and `skills/plan-to-video/references/harnesses.md`.
- Step 2 — ✓ carried by `scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`, `scripts/review.mjs` and `scripts/test/delivery.spec.mjs` (sandboxed Codex launch, checked commit evidence, retained owner edits and guarded stopped-run recovery).
- Step 3 — ✓ carried by `scripts/lib/inbox.mjs`, `scripts/lib/agents.mjs`, `scripts/review.mjs`, `scripts/inbox.mjs` and `scripts/test/delivery.spec.mjs` (durable saved questions, verified delivery, renewable ownership, and command-position dispatch that preserves command-like answers).
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs`, `scripts/lib/explainer.mjs`, `scripts/explain.mjs`, `scripts/session.mjs` and `scripts/test/session-export.spec.mjs` (exact identity/project selection and bounded private history exports).
- Step 5 — ✓ carried by `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/lib/http-file.mjs`, `scripts/review.mjs`, `packages/player/reelplanner-player.js`, `docs/terminal-review.md` and `eval/agents/codex-2026-10-11/lifecycle-final.json`.
- Step 6 — ✓ carried by `eval/agents/codex-2026-10-11/lifecycle-final.json`, `docs/agents.md`, `scripts/lib/guide/model.mjs`, `scripts/lib/plan-md.mjs`, `templates/guide/guide.js`, `scripts/captions-sentences.mjs`, `scripts/plan-map.mjs`, `skills/plan-to-video/references/authoring.md`, `skills/plan-to-video/references/communication/codex.md` and the sanitized benchmark sources (lifecycle evidence, guide formatting, stable timing and focused authoring guidance without an asserted speedup).

## Decisions
- D-023 — ✓ holds: `scripts/lib/details.mjs:12` reserves code details for cases where the code itself is relevant.
- D-024 — ✓ holds: `scripts/lib/details.mjs:5` and `scripts/detail.mjs` retain typed starting templates and a fresh-page fallback.
- D-082 — ✓ holds: `scripts/lib/agents.mjs:26` configures Codex automatic review with workspace-write; its commit advice preserves signing and permitted approvals.
- D-085 — ✓ holds: `scripts/lib/reviews.mjs`, `scripts/lib/details.mjs:6` and `scripts/lib/review-scope.mjs` retain review files and free detail kinds.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50` and `scripts/lib/env.mjs:311` retain the owner's machine-level memory folder.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:480` suggests a retro after five plans or three repetitions of a signal.
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:49` requires shared labels before a miss affects a stop.
- D-110 — ✓ holds: `scripts/reel.mjs:624` and `skills/plan-to-video/SKILL.md` retain the fifth-choice stopping rule.
- D-129 — ✓ holds: `scripts/lib/review-scope.mjs:239` records approval with missed checks, and the player retains approval availability.
- D-168 — ✓ holds: `eval/case-studies/REPLICATE.md:3` and its text/HTML fix stages retain complete-site comparisons.
- D-169 — ✓ holds: `eval/case-studies/REPLICATE.md:5` and `eval/case-studies/REPLICATE.md:34` keep the owner as reviewer and ours first.
- D-170 — ✓ holds: `scripts/case-study.mjs:632` and `eval/case-studies/TEMPLATE.md:60` retain rubric scores, a blind judge, the owner's ranking and process observations.
- D-171 — ✓ holds: `scripts/renumber.mjs` and `scripts/pr-check.mjs:245` retain ordered numbering and conflict checks.
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains detail opening over the frame from the selected object.
- D-197 — ✓ holds: `scripts/check-terms.mjs:226` retains the later-check rule for plan and system videos.
- D-198 — ✓ holds: `scripts/check-terms.mjs:226` and `scripts/check-terms.mjs:229` retain separate timing and reused-case warnings.
- D-199 — ✓ holds: `skills/plan-to-video/references/style-guide.md:381` and `scripts/check-terms.mjs` retain prediction checks for new/revised plan and system videos.
- D-200 — ✓ holds: `scripts/pr-check.mjs:15` and `.github/CONTRIBUTING.md` retain contributor requests with maintainer-created videos allowed.
- D-201 — ✓ holds: `scripts/reel.mjs:501` and `scripts/pr-check.mjs:263` retain the last recorded answer.
- D-213 — ✓ holds as delivered by D-215: `scripts/pr-check.mjs:201` and `.github/workflows/pr.yml` keep generated review media off the contribution branch.
- D-215 — ✓ holds: `scripts/pr-check.mjs:188` and `.github/workflows/pr.yml` retain throwaway video branches and cleanup.
- D-216 — ✓ holds: `scripts/lib/jargon.mjs` and `scripts/check-terms.mjs:169` retain build-time discovery of unexplained terms.
- D-217 — ✓ holds: `scripts/lib/jargon.mjs:3` and `scripts/check-terms.mjs` retain warnings and strict-mode failures.
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:1277` and `scripts/lib/memory.mjs:232` retain familiar-word display and remembered lookups.
- D-219 — ✓ holds: `skills/plan-to-video/SKILL.md` and `.reelplanner/plans/2026-10-11-codex-first-class/walkthrough-video/STORYBOARD.md` use the running change and actual command/app evidence for the walkthrough.
- D-220 — ✓ holds: `scripts/lib/autonomy.mjs:64` selects stops by their meaning without a fixed count.
- D-221 — ✓ holds: `packages/player/reelplanner-player.js:5913` and `scripts/reel.mjs:509` retain listed-but-unjudged treatment for unflagged list choices.
- D-222 — ✓ holds: `skills/plan-to-video/references/style-guide.md:385` retains walkthrough checks only where there is something to predict.
- D-223 — ✓ holds: `scripts/pr-check.mjs:11` and `scripts/pr-check.mjs:175` retain the visible-choice threshold and other-choice text.
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:186` and `scripts/build.mjs:215` retain answered-findings gates, including the actual explainer source document.
- D-227 — ✓ holds: `scripts/fresh-eyes.mjs:239` retains fresh review for rebuilt videos and archives earlier rounds.
- D-230 — ✓ holds: `scripts/guide.mjs` and `scripts/lib/guide/model.mjs` retain each plan's guide and Built side.
- D-244 — ✓ holds: `scripts/lib/guide/model.mjs:310` derives guide decisions, ordinary prose and component references from plan.md.
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:316` and `packages/player/reelplanner-player.js:2914` retain only new kept findings before playback.
- D-247 — ✓ holds: `scripts/case-study.mjs:238` retains plain site files and the Git bundle.
- D-248 — ✓ holds: `scripts/reel.mjs:221` and `scripts/reel.mjs:842` retain the originating explainer as a plan prerequisite.
- D-249 — ✓ holds: `scripts/lib/codex-session.mjs:170`, `scripts/lib/explainer.mjs:139` and `scripts/check-sources.mjs` keep private transcript text outside Git while pinning its source.
- D-250 — ✓ holds: `scripts/lib/explainer.mjs` and `skills/plan-to-video/references/style-guide.md` retain explanation principles and guide depth rather than imposing source-kind lists.
- D-303 — ✓ holds: `.reelplanner/plans/2026-10-11-codex-first-class/walkthrough-video/STORYBOARD.md` includes actual install commands; `.reelplanner/plans/2026-10-11-codex-first-class/runs/native-plugin-install.txt` records the install outcome.
- D-304 — ✓ holds: `README.md:153` retains the real-planning explanation for the original name, alongside the current name.
- D-305 — ✓ holds: `.gitignore`, `scripts/pr-check.mjs:206` and `scripts/lib/inbox.mjs` keep generated voice/render files out of source commits.
- D-306 — ✓ holds: `scripts/lib/ledger.mjs`, `scripts/lib/call-lines.mjs` and `scripts/reel.mjs:990` retain binding owner decisions, touched-line agent history and approved specification folds.
- D-309 — ✓ holds: `scripts/reel.mjs:654` treats accepted walkthrough rule breaks as notes.
- D-310 — ✓ holds, with the D-312 name update: `scripts/release/make-public.mjs` retains a single-tree public export without pushing it.
- D-311 — ✓ holds: `.github/workflows/ci.yml`, `.github/workflows/pr.yml` and `.github/PULL_REQUEST_TEMPLATE.md` retain full PR-push testing, separate text/label checks and the maintainer merge check.
- D-312 — ✓ holds: `package.json`, `plugin.json`, `scripts/lib/old-names.mjs`, `scripts/lib/env.mjs` and `packages/player/reelplanner-player.js:1532` retain the current name, compatibility reads and existing annotation keys.
- D-313 — ✓ holds: `scripts/review.mjs`, `packages/player/reelplanner-player.js:7149` and `skills/plan-to-video/references/harnesses.md:171` provide direct local delivery and portable exports while excluding an automatic remote service.

## Unexplained
- none
