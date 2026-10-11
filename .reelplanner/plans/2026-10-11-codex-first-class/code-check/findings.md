# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/setup-check.mjs`, `scripts/test/codex-install.spec.mjs`, `scripts/test/harnesses.spec.mjs`, `skills/plan-to-video/references/harnesses.md`; agent-specific operations stay behind ordinary adapters and the fake adapter exercises the shared lifecycle.
- Step 2 — ✗ `scripts/lib/inbox.mjs:317` checks completion evidence only when progress or a claim already exists, so `inbox done` on a newly saved, unclaimed review in an initialized Git repo moves it to done without checks or any commit (reproduced in a scratch repo); the Codex launch, signing failure and claimed-review recovery are otherwise carried by `scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs` and `eval/agents/codex-2026-10-11/headless-summary.json`.
- Step 3 — ✓ carried by `scripts/lib/agents.mjs`, `scripts/lib/codex-session.mjs`, `scripts/lib/inbox.mjs`, `scripts/review.mjs`, `scripts/inbox.mjs`, `packages/player/reelplanner-player.js`, `packages/player/guide-review.js`, `scripts/test/delivery.spec.mjs`; saved questions, verified endpoint notification, lease adoption and recovery share one workflow, and `eval/agents/codex-2026-10-11/cli-live-question.json` records a real sourced answer without claiming automatic wake.
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs`, `scripts/lib/explainer.mjs`, `scripts/explain.mjs`, `scripts/session.mjs`, `scripts/test/session-export.spec.mjs`; exact thread/repo verification, legacy and paginated history, external identity-first export, source pinning and explicit failure are implemented without substituting newer conversations.
- Step 5 — ✗ nothing in the diff proves the complete terminal-pane review and rebuild checklist; closest are `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/review.mjs`, `packages/player/reelplanner-player.js` and the playback trial, while `docs/agents.md:135` explicitly leaves full pane submission and changed-scenes checks open and `docs/terminal-review.md:59` leaves the remaining controls under test.
- Step 6 — ✗ nothing in the diff carries the required complete real plan → narrated revision → implementation → independently checked walkthrough → accepted/flagged choice → fix lifecycle or separate Codex app handoff; closest are focused installation/headless/export/question/playback records in `eval/agents/codex-2026-10-11/`, and `docs/agents.md:139` explicitly says they do not establish the complete lifecycle or app, so this step and its acceptance bar remain incomplete despite the passing regression suites.

## Decisions
- D-023 — ✓ holds: `scripts/lib/details.mjs:12` reserves code detail for cases where code itself is judged and retains other detail kinds.
- D-024 — ✓ holds: `scripts/lib/details.mjs:7` and `scripts/detail.mjs` retain templates first with a fresh-page fallback.
- D-082 — ✓ holds: `scripts/lib/agents.mjs:26` launches Codex automatic review with workspace-write, and its commit advice preserves approval and signing rather than granting blanket Git writes.
- D-085 — ✓ holds: `scripts/reel.mjs:368`, `scripts/lib/details.mjs:6` and `scripts/lib/reviews.mjs` retain relaxed scaffolding, free detail kinds and filed review records.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50` retains the owner's home-folder memory, and `scripts/reel.mjs:547` appends review facts there.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40` and `scripts/lib/memory.mjs:480` retain five-plan or three-repeat retro triggers.
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:46` retains the rule that untagged misses directly pause nothing.
- D-110 — ✓ holds: `scripts/reel.mjs:624` and `skills/plan-to-video/SKILL.md:143` retain the fifth-choice stop/ask rule; no step in the supplied autonomy log reaches five calls.
- D-129 — ✓ holds: `scripts/lib/review-scope.mjs:239` records approval with missed checks without blocking approval.
- D-168 — ✓ holds: `eval/case-studies/REPLICATE.md:95` retains implementation and fixes for all three arms.
- D-169 — ✓ holds: `scripts/case-study.mjs:202` retains the owner's review order, ours first with a day between arms.
- D-170 — ✓ holds: `scripts/case-study.mjs:632`, `eval/case-studies/kit/RUBRIC.md` and `eval/case-studies/kit/JUDGE.md` retain the rubric, blind judge and owner's separate ranking.
- D-171 — ✓ holds: `scripts/renumber.mjs`, `scripts/pr-check.mjs:245` and `docs/project-dir.md:95` retain sequential IDs and the second-branch merge rule.
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains the detail overlay grown from the clicked block.
- D-197 — ✓ holds: `scripts/check-terms.mjs:226` retains checks later than the explanatory beat.
- D-198 — ✓ holds: `scripts/check-terms.mjs:226` and `scripts/check-terms.mjs:229` retain warnings for checks too soon or reusing the shown case.
- D-199 — ✓ holds: `skills/plan-to-video/SKILL.md:272`, `scripts/check-terms.mjs` and `.reelplanner/system-video/STORYBOARD.md` retain quick checks for current plan/system authoring and the system video.
- D-200 — ✓ holds: `scripts/pr-check.mjs:15` and `.github/CONTRIBUTING.md` retain the maintainer route for making a contributor's needed video.
- D-201 — ✓ holds: `scripts/reel.mjs:501` and `scripts/pr-check.mjs:263` retain the last plan answer and maintainer record rules.
- D-213 — ✓ holds as delivered by D-215: `scripts/pr-check.mjs:201`, `scripts/bundle-player.mjs` and `.github/pull_request_template.md` retain text on the PR branch and a separate built-video branch.
- D-215 — ✓ holds: `.github/pull_request_template.md` and `.github/workflows/pr.yml` retain the throwaway `video/pr-<n>` branch and cleanup.
- D-216 — ✓ holds: `scripts/lib/jargon.mjs`, `scripts/check-terms.mjs:169` and `scripts/lib/terms.mjs` retain build-discovered jargon and meanings.
- D-217 — ✓ holds: `scripts/check-terms.mjs` and `scripts/lib/jargon.mjs:3` retain warnings and strict failures for unlabelled likely jargon.
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:3112` and `scripts/review.mjs:385` retain learned-word memory and stop underlining known terms.
- D-219 — ✓ holds: `skills/plan-to-video/SKILL.md:273` and `skills/plan-to-video/SKILL.md:553` retain walkthroughs of the change running.
- D-220 — ✓ holds: `scripts/lib/autonomy.mjs:58` retains relevance-based stops without a fixed or capped choice count.
- D-221 — ✓ holds: `packages/player/reelplanner-player.js:5824` and `scripts/reel.mjs:509` retain unflagged list choices as listed, not judged.
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md:274` and `scripts/check-terms.mjs:74` retain walkthrough checks only where there is something to predict.
- D-223 — ✓ holds: `scripts/pr-check.mjs:5`, `scripts/pr-check.mjs:175` and `.github/pull_request_template.md` retain video for noticeable/hard-to-undo choices and written acceptance of other choices.
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:257`, `scripts/fresh-eyes.mjs` and `scripts/verify.sh` retain the answered-findings gate before showing a video.
- D-227 — ✓ holds: `scripts/fresh-eyes.mjs:239` and `skills/plan-to-video/SKILL.md:382` retain fresh reviewers for a new build.
- D-230 — ✓ holds: `scripts/lib/guide/model.mjs:5` and `scripts/lib/guide/model.mjs:55` retain each plan's guide and Built side.
- D-244 — ✓ holds: `scripts/lib/guide/model.mjs:3` and `scripts/lib/guide/model.mjs:116` build the guide from plan.md rather than making it a second source.
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:314` and `packages/player/reelplanner-player.js:2914` retain only newly kept findings before watching.
- D-247 — ✓ holds: `scripts/case-study.mjs:238` retains plain site files and a verified site.bundle.
- D-248 — ✓ holds: `scripts/reel.mjs:221`, `scripts/reel.mjs:842` and `scripts/lib/explainer.mjs:391` retain plans leaning on their originating explainer.
- D-249 — ✓ holds: `scripts/lib/explainer.mjs`, `scripts/lib/codex-session.mjs:108` and `templates/reelplanner/gitignore` retain external transcript pins/exports without committing transcript text.
- D-250 — ✓ holds: `skills/plan-to-video/SKILL.md:209` and `scripts/lib/guide/model.mjs:6` retain general explainer story/source principles rather than a closed list of explainer kinds.
- D-303 — ✓ holds: `skills/plan-to-video/SKILL.md:553` and `skills/plan-to-video/SKILL.md:575` retain real installation commands and outputs in installation walkthrough/system videos; the new video's actual lifecycle proof remains the Step 6 gap above.
- D-304 — ✓ retained under the later D-312 name: `.reelplanner/spec.md:10` preserves the long-text/video naming rationale and `README.md:1` uses reelplanner.
- D-305 — ✓ holds for the surviving media rule: `scripts/pr-check.mjs:206`, `templates/reelplanner/gitignore` and `scripts/release/make-public.mjs` retain exclusions for voice files and renders; this diff adds text evidence rather than such media.
- D-306 — ✓ holds: `scripts/lib/ledger.mjs`, `scripts/lib/call-lines.mjs`, `scripts/reel.mjs:326` and `scripts/reel.mjs:990` retain binding owner answers, line-based accepted-call history and owner-approved folds.
- D-309 — ✓ holds: `scripts/reel.mjs:654` retains settled walkthrough rule breaks as notes after owner acceptance.
- D-310 — ✓ holds with D-312's renamed public repo: `scripts/release/make-public.mjs` retains a single-tree public export without pushing it and the development-history explanation.
- D-311 — ✓ holds: `.github/workflows/ci.yml`, `.github/workflows/pr.yml` and `.github/pull_request_template.md` retain full tests on PR code pushes, separate text/label checks and maintainer merge validation.
- D-312 — ✓ holds: `plugin.json`, `.agents/plugins/marketplace.json`, `scripts/lib/old-names.mjs`, `scripts/lib/env.mjs:264` and `packages/player/reelplanner-player.js` retain lowercase reelplanner, compatibility reads and existing review storage keys.
- D-313 — ✓ holds: `scripts/review.mjs`, `packages/player/reelplanner-player.js:7120`, `packages/player/test/handoff.spec.mjs` and `docs/agents.md:113` retain direct local Send plus identity-preserving portable exports, with remote automation outside scope.

## Unexplained
- none
