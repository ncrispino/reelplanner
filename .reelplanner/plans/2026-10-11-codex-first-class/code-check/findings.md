# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/setup-check.mjs`, `skills/plan-to-video/references/harnesses.md`, `eval/agents/codex-2026-10-11/native-install-source-only.json`.
- Step 2 — ✓ carried by `scripts/lib/agents.mjs:25`, `scripts/lib/inbox.mjs:208`, `scripts/lib/inbox.mjs:252`, `scripts/lib/inbox.mjs:332`, `scripts/lib/inbox.mjs:479`, `scripts/lib/inbox.mjs:556`, `scripts/review.mjs:341`, `eval/agents/codex-2026-10-11/headless-summary.json`, `eval/agents/codex-2026-10-11/headless-video-source-only.json`.
- Step 3 — ✗ the waiting-session fallback cannot answer its claimed question without `CODEX_THREAD_ID`, `CLAUDE_SESSION_ID` or `REELPLANNER_OWNER`: `scripts/lib/inbox.mjs:40` invents a random owner, `scripts/lib/inbox.mjs:394` returns only the path, and `scripts/lib/inbox.mjs:462` rejects the subsequent `inbox answer` caller (reproduced with `CLAUDECODE=1`, waiter exit 0 and answer exit 1), so the existing Claude/custom-command route needs a persistent caller identity.
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs:88`, `scripts/lib/codex-session.mjs:97`, `scripts/lib/codex-session.mjs:111`, `scripts/lib/explainer.mjs:68`, `scripts/explain.mjs:45`, `scripts/session.mjs`, `scripts/test/session-export.spec.mjs`, `eval/agents/codex-2026-10-11/current-cli-export.json`.
- Step 5 — ✓ carried by `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/lib/env.mjs:224`, `scripts/review.mjs:180`, `scripts/review.mjs:280`, `scripts/review.mjs:487`, `scripts/lib/http-file.mjs`, `packages/player/reelplanner-player.js:7120`, `packages/player/reelplanner-player.js:7149`, `docs/terminal-review.md`, `eval/agents/codex-2026-10-11/ghostty-trial.json`, `eval/agents/codex-2026-10-11/lifecycle-final.json`.
- Step 6 — ✓ carried by `eval/agents/codex-2026-10-11/lifecycle-final.json`, `eval/agents/codex-2026-10-11/cli-live-question.json`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/terminal-lifecycle.txt`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/npm-test-question-ownership.txt`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/full-touched.txt`, `docs/agents.md`, `README.md`, `AGENTS.md`, `.reelplanner/spec.md`, `.reelplanner/system.json` (real CLI trials and narrower unverified support limits are recorded).

## Decisions
- D-023 — ✓ holds: `templates/details/code.html:9`, `skills/plan-to-video/references/style-guide.md:222` keep code detail justified rather than automatic.
- D-024 — ✓ holds: `scripts/detail.mjs:54` selects a known template before the fresh-page fallback.
- D-082 — ✓ holds: `scripts/lib/agents.mjs:25`, `scripts/lib/agents.mjs:107`, `scripts/lib/inbox.mjs:511` retain Codex workspace-write and automatic approval review with harness-specific commit instructions.
- D-085 — ✓ holds: `scripts/detail.mjs:68`, `skills/plan-to-video/SKILL.md:254` retain generated starting files and authoring scaffolding.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50`, `scripts/reel.mjs:553` retain the home-folder memory and sandboxed pending-summary route.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40`, `scripts/lib/memory.mjs:481` retain the five-plan or three-repeat retro trigger.
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:46` requires shared tags before a miss can cause a pause.
- D-110 — ✓ holds: `scripts/reel.mjs:627` requires an owner question when a step reaches five calls; no step in the supplied autonomy log reaches five.
- D-129 — ✓ holds: `packages/player/reelplanner-player.js:3373`, `scripts/lib/memory.mjs:180` keep approval available and record missed checks.
- D-168 — ✓ holds: `scripts/case-study.mjs:45` keeps fix and done stages for every arm.
- D-169 — ✓ holds: `scripts/case-study.mjs:202`, `eval/case-studies/REPLICATE.md` preserve owner review with ours first.
- D-170 — ✓ holds: `scripts/case-study.mjs:215`, `scripts/case-study.mjs:218`, `scripts/case-study.mjs:523` preserve the blind rubric, owner ranking and separate process discussion.
- D-171 — ✓ holds: `scripts/renumber.mjs:76`, `skills/plan-to-video/SKILL.md:645` preserve sequential decision IDs and the second-branch merge rule.
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains detail expansion over the frame from its opener.
- D-197 — ✓ holds: `scripts/check-terms.mjs:226`, `skills/plan-to-video/SKILL.md:308` retain later checks on new cases.
- D-198 — ✓ holds: `scripts/check-terms.mjs:226`, `scripts/check-terms.mjs:229` retain the timing and repeated-case warnings.
- D-199 — ✓ holds: `skills/plan-to-video/SKILL.md:308`, `skills/plan-to-video/SKILL.md:575` retain the new/revised and system-video check rules.
- D-200 — ✓ holds: `.github/PULL_REQUEST_TEMPLATE.md:11`, `skills/plan-to-video/SKILL.md:621` retain contributor requests and maintainer control of video requirements.
- D-201 — ✓ holds: `scripts/reel.mjs:465`, `scripts/reel.mjs:501` preserve replacement through the later recorded answer and maintainer review rules.
- D-213 — ✓ holds: `scripts/lib/contributing.mjs:83`, `.github/workflows/pr.yml:7` preserve text-only PR branches and delivery through the D-215 video branch.
- D-215 — ✓ holds: `.github/workflows/pr.yml:58`, `skills/plan-to-video/SKILL.md:629` preserve throwaway video-branch delivery and cleanup.
- D-216 — ✓ holds: `scripts/check-terms.mjs:169`, `skills/plan-to-video/SKILL.md:360` retain build-time discovery of likely jargon.
- D-217 — ✓ holds: `scripts/check-terms.mjs:169`, `skills/plan-to-video/SKILL.md:361` retain warnings and strict-mode failures for unexplained jargon.
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:3040`, `scripts/review.mjs:387` retain known-term behavior backed by browser and home-folder memory.
- D-219 — ✓ holds: `skills/plan-to-video/references/style-guide.md:409`, `eval/agents/codex-2026-10-11/lifecycle-final.json` retain a walkthrough showing the change running, with an actual UI recording in the trial.
- D-220 — ✓ holds: `scripts/lib/autonomy.mjs:61` keeps pause selection based on the calls' meaning and tags, without a fixed count.
- D-221 — ✓ holds: `scripts/reel.mjs:509`, `packages/player/reelplanner-player.js:5824` keep unflagged list entries listed rather than accepted decisions.
- D-222 — ✓ holds: `skills/plan-to-video/references/style-guide.md:445`, `skills/plan-to-video/SKILL.md:274` retain walkthrough checks where an outcome can be predicted.
- D-223 — ✓ holds: `.github/PULL_REQUEST_TEMPLATE.md:11`, `skills/plan-to-video/SKILL.md:621` retain the noticeable-choice threshold for smaller PRs.
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:186`, `scripts/fresh-eyes.mjs`, `skills/plan-to-video/SKILL.md:377` retain answered findings before presentation, including explainer source-document corrections.
- D-227 — ✓ holds: `skills/plan-to-video/SKILL.md:377`, `scripts/fresh-eyes.mjs:239` retain fresh eyes for every new or rebuilt video.
- D-230 — ✓ holds: `scripts/lib/guide/model.mjs:33`, `scripts/lib/guide/model.mjs:126` retain a guide for each plan and its Built side.
- D-244 — ✓ holds: `scripts/lib/guide/model.mjs:116`, `scripts/guide.mjs:3` keep the guide derived from plan.md and the build record.
- D-245 — ✓ holds: `packages/player/reelplanner-player.js:2914`, `scripts/plan-map.mjs:207` retain deduplication of kept findings from earlier rounds.
- D-247 — ✓ holds: `scripts/case-study.mjs:288`, `scripts/case-study.mjs:338` retain both plain site files and a verified site.bundle.
- D-248 — ✓ holds: `scripts/reel.mjs:221`, `scripts/reel.mjs:842` retain the explainer prerequisite and lean-on-it plan transition.
- D-249 — ✓ holds: `scripts/lib/explainer.mjs:134`, `scripts/lib/codex-session.mjs:121`, `templates/reelplanner/gitignore:16` keep transcript text outside Git and pin only source metadata.
- D-250 — ✓ holds: `scripts/explain.mjs:30`, `skills/plan-to-video/SKILL.md:192` retain question-and-source authoring without a closed list of explainer kinds.
- D-303 — ✓ holds: `skills/plan-to-video/SKILL.md:553`, `.reelplanner/plans/2026-10-11-codex-first-class/runs/native-plugin-source-only.txt` retain and record real installation commands and outcomes.
- D-304 — ✓ holds: `README.md:153` retains the original real-planning name explanation alongside the D-312 rename.
- D-305 — ✓ holds: `skills/plan-to-video/SKILL.md:323`, `scripts/lib/inbox.mjs:484`, `scripts/release/make-public.mjs:72` prohibit committing generated voice and renders.
- D-306 — ✓ holds: `scripts/reel.mjs:326`, `scripts/reel.mjs:990` retain binding owner answers, line-scoped accepted-call history and owner-approved spec folding.
- D-309 — ✓ holds: `scripts/reel.mjs:658` retains notes for accepted walkthroughs and failures for unsettled ones.
- D-310 — ✓ holds: `scripts/release/make-public.mjs:2`, `.reelplanner/README.md` retain the single-tree public export and development-history citation explanation, with naming updated by D-312.
- D-311 — ✓ holds: `.github/workflows/ci.yml:15`, `.github/workflows/pr.yml:12`, `.github/PULL_REQUEST_TEMPLATE.md:32` retain full testing on PR pushes, separate text/label checks and the maintainer's merge check.
- D-312 — ✓ holds: `plugin.json:3`, `scripts/lib/old-names.mjs`, `scripts/lib/env.mjs:264`, `packages/player/reelplanner-player.js` retain lowercase naming, old-name reads and saved review storage keys.
- D-313 — ✓ holds: `scripts/lib/inbox.mjs:591`, `packages/player/reelplanner-player.js:7149`, `docs/agents.md` provide direct local intake and portable exports, while automatic hosted Codex delivery remains outside scope.

## Unexplained
- none
