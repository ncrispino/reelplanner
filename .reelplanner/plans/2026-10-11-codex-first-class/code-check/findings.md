# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/setup-check.mjs`, `skills/plan-to-video/references/harnesses.md`
- Step 2 — ✓ carried by `scripts/lib/agents.mjs:25`, `scripts/lib/inbox.mjs:252`, `scripts/lib/inbox.mjs:332`, `scripts/lib/inbox.mjs:537`, `scripts/review.mjs:341`, `eval/agents/codex-2026-10-11/headless-summary.json`
- Step 3 — ✗ the new question-ownership recovery is not enforced when answering: `scripts/lib/inbox.mjs:448` writes the answer and unlinks the claim without checking or locking the caller’s ownership; a scratch reproduction let an expired `codex:old` answer after `codex:new` adopted the question and removed the new owner’s claim.
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs`, `scripts/lib/explainer.mjs:66`, `scripts/explain.mjs`, `scripts/session.mjs`, `scripts/test/session-export.spec.mjs`, `eval/agents/codex-2026-10-11/current-cli-export.json`
- Step 5 — ✓ carried by `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/review.mjs:180`, `scripts/review.mjs:280`, `scripts/lib/http-file.mjs`, `packages/player/reelplanner-player.js:7149`, `docs/terminal-review.md`, `eval/agents/codex-2026-10-11/ghostty-trial.json`
- Step 6 — ✓ carried by `eval/agents/codex-2026-10-11/lifecycle-final.json`, `eval/agents/codex-2026-10-11/headless-video-source-only.json`, `eval/agents/codex-2026-10-11/cli-live-question.json`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/full-touched.txt`, `docs/agents.md`, `README.md`, `AGENTS.md`, `.reelplanner/spec.md`, `.reelplanner/system.json`

## Decisions
- D-023 — ✓ holds: `skills/plan-to-video/SKILL.md:337` justifies detail from the scene rather than requiring full code
- D-024 — ✓ holds: `scripts/detail.mjs:52` selects typed detail templates before the fresh fallback
- D-082 — ✓ holds: `scripts/lib/agents.mjs:25` uses automatic approval review inside workspace-write and preserves harness-specific commit policy
- D-085 — ✓ holds: `scripts/detail.mjs:54`, `scripts/lib/reviews.mjs` retain scaffolds, files and review records
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50` retains the home-folder memory, with repository pending records for fenced runs
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40` keeps the five-plan and three-repeat retro thresholds
- D-109 — ✓ holds: `scripts/reel.mjs:681` keeps an unlabelled miss from directly selecting a pause
- D-110 — ✓ holds: `scripts/reel.mjs:624` retains the fifth-call question requirement; this diff records fewer than five calls per step
- D-129 — ✓ holds: `scripts/lib/memory.mjs:171`, `packages/player/reelplanner-player.js` retain approval while recording missed checks
- D-168 — ✓ holds: `scripts/case-study.mjs:45` retains all arms through check, fix and done
- D-169 — ✓ holds: `scripts/case-study.mjs:202` retains owner review with the reelplanner arm first
- D-170 — ✓ holds: `scripts/case-study.mjs:215` retains rubric scores, the blind judge and owner ranking
- D-171 — ✓ holds: `scripts/renumber.mjs`, `scripts/lib/contributing.mjs` retain ordered decision IDs and merge conflict checks
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains details over the frame from the clicked block
- D-197 — ✓ holds: `scripts/check-terms.mjs:226` retains later checks on a fresh case
- D-198 — ✓ holds: `scripts/check-terms.mjs:226` retains the timing and reused-case warnings
- D-199 — ✓ holds: `skills/plan-to-video/SKILL.md:308`, `scripts/check-terms.mjs` retain the new/revised video and system check rules
- D-200 — ✓ holds: `.github/CONTRIBUTING.md`, `scripts/lib/contributing.mjs` retain contributor requests and the maintainer route
- D-201 — ✓ holds: `scripts/reel.mjs`, `scripts/lib/reviews.mjs` retain the latest recorded answer while preserving review history
- D-213 — ✓ holds: `scripts/lib/contributing.mjs:83`, `skills/plan-to-video/SKILL.md:323` keep built plan video media out of the PR branch
- D-215 — ✓ holds: `.github/workflows/pr.yml`, `scripts/review.mjs:176` retain throwaway video-branch delivery
- D-216 — ✓ holds: `scripts/check-terms.mjs:169` retains discovery of likely jargon without meaning
- D-217 — ✓ holds: `scripts/check-terms.mjs:169` retains warnings and strict-mode failure for unlabelled jargon
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:3040`, `scripts/review.mjs:387` retain known-word handling and home memory
- D-219 — ✓ holds: `eval/agents/codex-2026-10-11/lifecycle-final.json:22` records actual UI capture in the walkthrough
- D-220 — ✓ holds: `scripts/reel.mjs:681`, `scripts/lib/autonomy.mjs` retain pause selection by choice significance rather than a fixed count
- D-221 — ✓ holds: `packages/player/reelplanner-player.js:5824` retains listed, unjudged choices at Finish
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md:274` retains walkthrough prediction checks where the change supports one
- D-223 — ✓ holds: `scripts/lib/contributing.mjs`, `.github/PULL_REQUEST_TEMPLATE.md` retain the visible-choice threshold for a small PR
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:186` requires findings to be answered and checks the actual explainer source document
- D-227 — ✓ holds: `scripts/fresh-eyes.mjs:239`, `eval/agents/codex-2026-10-11/lifecycle-final.json` retain fresh review for rebuilt videos
- D-230 — ✓ holds: `scripts/guide.mjs:3` retains a guide from plan and walkthrough text with its Built side
- D-244 — ✓ holds: `scripts/guide.mjs:3` retains plan.md as the guide source
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:316`, `packages/player/reelplanner-player.js:2914` retain only new kept findings before watching
- D-247 — ✓ holds: `scripts/case-study.mjs:259` retains plain site files and a verified site.bundle
- D-248 — ✓ holds: `scripts/reel.mjs:228` retains the explainer review as the source for Plan this
- D-249 — ✓ holds: `scripts/lib/codex-session.mjs:111`, `scripts/lib/explainer.mjs:134` export privately and pin only source metadata
- D-250 — ✓ holds: `scripts/explain.mjs:6`, `skills/plan-to-video/SKILL.md:206` retain general source/story principles instead of an explainer-kind list
- D-303 — ✓ holds: `eval/agents/codex-2026-10-11/native-install-source-only.json`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/setup-supported-node.txt` record actual plugin installation and prerequisite commands
- D-304 — ✓ holds: `README.md:153` retains the original name and real-planning explanation
- D-305 — ✓ holds: `skills/plan-to-video/SKILL.md:323`, `scripts/lib/inbox.mjs:466` explicitly leave generated voices, renders and player bundles ignored
- D-306 — ✓ holds: `scripts/lib/ledger.mjs:3`, `scripts/reel.mjs:326` retain binding owner rules and scoped accepted-call history
- D-309 — ✓ holds: `scripts/reel.mjs` retains accepted walkthrough rule breaks as notes instead of failures
- D-310 — ✓ holds: `scripts/release/make-public.mjs:2` retains the one-commit public export without pushing
- D-311 — ✓ holds: `.github/workflows/ci.yml`, `.github/workflows/pr.yml`, `.github/PULL_REQUEST_TEMPLATE.md` retain PR suites, separate review checks and the maintainer merge check
- D-312 — ✓ holds: `scripts/lib/env.mjs:264`, `scripts/lib/old-names.mjs`, `packages/player/reelplanner-player.js` retain lowercase naming and old folder/env/storage compatibility
- D-313 — ✓ holds: `skills/plan-to-video/references/harnesses.md:140`, `packages/player/reelplanner-player.js:7149`, `scripts/review.mjs:431` retain direct local Send plus portable identity-preserving exports, with automatic remote delivery outside scope

## Unexplained
- none
