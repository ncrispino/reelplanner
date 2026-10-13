# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json:1`, `.agents/plugins/marketplace.json:1`, `package.json:60`, `scripts/release/sync-version.mjs:38`, `scripts/lib/agents.mjs:63`, `scripts/lib/setup-check.mjs:1`, `skills/plan-to-video/references/harnesses.md:1` and `eval/agents/codex-2026-10-11/native-install-owner-handle.json:1`.
- Step 2 — ✓ carried by `scripts/lib/agents.mjs:25`, `scripts/lib/inbox.mjs:208`, `scripts/lib/inbox.mjs:333`, `scripts/lib/inbox.mjs:481`, `scripts/lib/inbox.mjs:558`, `scripts/review.mjs:341` and `eval/agents/codex-2026-10-11/headless-summary.json:1` (automatic review, checked commit evidence, retained progress, guarded retry and stopped status).
- Step 3 — ✓ carried by `scripts/lib/inbox.mjs:141`, `scripts/lib/inbox.mjs:396`, `scripts/lib/inbox.mjs:450`, `scripts/lib/inbox.mjs:582`, `scripts/lib/inbox.mjs:593`, `scripts/lib/codex-session.mjs:138`, `scripts/inbox.mjs:47`, `scripts/review.mjs:444` and `eval/agents/codex-2026-10-11/cli-live-question.json:1` (durable questions, verified endpoints, shared delivery priority, renewable ownership and anonymous owner handles).
- Step 4 — ✗ `scripts/lib/codex-session.mjs:92` always prefers an available App Server main conversation when no active ID exists instead of comparing it with eligible legacy transcripts, so a scratch reproduction selected `older-current` (updatedAt 1000) over `newer-legacy` (mtime 2000), breaking the promised newest-eligible-main fallback.
- Step 5 — ✓ carried by `scripts/lib/presentation.mjs:23`, `scripts/lib/review-projects.mjs:6`, `scripts/lib/env.mjs:224`, `scripts/review.mjs:180`, `scripts/review.mjs:282`, `scripts/review.mjs:484`, `scripts/lib/http-file.mjs:24`, `packages/player/reelplanner-player.js:7120`, `docs/terminal-review.md:1` and `eval/agents/codex-2026-10-11/lifecycle-final.json:1` (shared terminal player, owning-repo routing/bundle isolation, actual listening port and portable identity preservation).
- Step 6 — ✓ carried by `eval/agents/codex-2026-10-11/lifecycle-final.json:1`, `eval/agents/codex-2026-10-11/headless-video-source-only.json:1`, `docs/agents.md:8`, `README.md:35`, `AGENTS.md:1`, `.reelplanner/spec.md:13`, `.reelplanner/system.json:1` and `.reelplanner/plans/2026-10-11-codex-first-class/runs/npm-test-owner-handle.txt:1` (real narrated lifecycle and failure/recovery evidence, full touched-spec runs and explicit CLI/platform limits).

## Decisions
- D-023 — ✓ holds: `scripts/lib/details.mjs:12`, `templates/details/code.html:9` (code detail remains justified by what the reviewer is judging).
- D-024 — ✓ holds: `scripts/lib/details.mjs:6`, `templates/details/fresh.html:8` (existing detail types remain starting points, with a fresh-page fallback).
- D-082 — ✓ holds: `scripts/lib/agents.mjs:25`, `scripts/lib/agents.mjs:107`, `scripts/lib/inbox.mjs:489` (Codex automatic review retains workspace-write and failed approvals leave the review unfinished).
- D-085 — ✓ holds: `scripts/reel.mjs:368`, `scripts/lib/reviews.mjs:1`, `scripts/lib/details.mjs:6` (existing reduced scaffolding, single filed reviews and free detail kinds remain).
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50`, `scripts/reel.mjs:547`, `scripts/review.mjs:387` (reviewer memory remains in the machine's home-folder file, with pending summaries when home writes are unavailable).
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40`, `scripts/lib/memory.mjs:480` (retro suggestions retain five-plan and three-repeat thresholds).
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:46`, `scripts/lib/autonomy.mjs:61` (an untagged miss cannot directly create a stop).
- D-110 — ✓ holds: `skills/plan-to-video/SKILL.md:493`, `scripts/reel.mjs:624` (the implementer must ask before a fifth call, and audit checks the recorded question).
- D-129 — ✓ holds: `scripts/lib/review-scope.mjs:237` (approval with missed quick checks is recorded without blocking approval).
- D-168 — ✓ holds: `eval/case-studies/REPLICATE.md:98`, `eval/case-studies/REPLICATE.md:112`, `eval/case-studies/REPLICATE.md:141` (text and HTML arms still include implementation and fixes).
- D-169 — ✓ holds: `eval/case-studies/REPLICATE.md:4`, `eval/case-studies/REPLICATE.md:34` (the owner reviews each arm, ours first).
- D-170 — ✓ holds: `eval/case-studies/TEMPLATE.md:62`, `eval/case-studies/TEMPLATE.md:74`, `eval/case-studies/kit/JUDGE.md:35` (rubric scores, blind judging, owner ranking and differences outside the rubric remain).
- D-171 — ✓ holds: `scripts/renumber.mjs:2`, `scripts/pr-check.mjs:245` (ordered branch renumbering and collision checks remain).
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895`, `packages/player/reelplanner-player.js:3917` (detail overlays still grow from the clicked block; guide parts retain their later under-video behavior).
- D-197 — ✓ holds: `scripts/check-terms.mjs:226`, `skills/plan-to-video/SKILL.md:308` (plan/system checks remain later than the explanation and use a new case).
- D-198 — ✓ holds: `scripts/check-terms.mjs:226`, `scripts/check-terms.mjs:229` (the timing and repeated-case warnings remain distinct).
- D-199 — ✓ holds: `skills/plan-to-video/SKILL.md:308`, `skills/plan-to-video/SKILL.md:576`, `scripts/check-terms.mjs:74` (new/revised videos and the system video retain the applicable quick-check rules).
- D-200 — ✓ holds: `scripts/pr-check.mjs:15`, `skills/plan-to-video/SKILL.md:625` (the missing-video path asks for a walkthrough the maintainer can make).
- D-201 — ✓ holds: `scripts/reel.mjs:501`, `scripts/pr-check.mjs:263` (plan answers still join the ledger and maintainer answers take precedence).
- D-213 — ✓ holds: `templates/reelplanner/gitignore:39`, `skills/plan-to-video/SKILL.md:637`, `scripts/pr-check.mjs:3` (PR branches retain video text while built bundles use the D-215 throwaway-branch route).
- D-215 — ✓ holds: `skills/plan-to-video/SKILL.md:637`, `.github/workflows/pr.yml:54` (video/pr branches stay separate and are removed after closing the PR).
- D-216 — ✓ holds: `scripts/check-terms.mjs:169`, `.reelplanner/glossary.md:65` (the build still finds likely jargon; the added adapter/pane terms have meanings).
- D-217 — ✓ holds: `scripts/check-terms.mjs:23`, `scripts/check-terms.mjs:169` (missing meanings retain warning behavior and strict failure).
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:2508`, `scripts/lib/memory.mjs:232` (known terms still lose their underline using saved reviewer memory).
- D-219 — ✓ holds: `skills/plan-to-video/SKILL.md:548`, `eval/agents/codex-2026-10-11/lifecycle-final.json:1` (walkthrough authoring still requires running behavior, exercised by the recorded scratch-app trial).
- D-220 — ✓ holds: `scripts/lib/autonomy.mjs:61` (stops depend on the choice and its tags, without a fixed count).
- D-221 — ✓ holds: `packages/player/reelplanner-player.js:5913`, `scripts/reel.mjs:509`, `scripts/lib/memory.mjs:125` (unflagged listed calls remain listed, not judged).
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md:274`, `skills/plan-to-video/SKILL.md:308` (walkthrough checks remain conditional on something to predict).
- D-223 — ✓ holds: `scripts/pr-check.mjs:5`, `scripts/pr-check.mjs:175`, `skills/plan-to-video/SKILL.md:618` (small PR choices retain the noticeable-choice video threshold and written alternatives).
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:186`, `scripts/fresh-eyes.mjs:46` (fresh-eye findings require answers before presentation, including the actual explain.md source document).
- D-227 — ✓ holds: `skills/plan-to-video/SKILL.md:378`, `scripts/fresh-eyes.mjs:239` (new/rebuilt videos require a fresh round; the existing system-video rule remains).
- D-230 — ✓ holds: `skills/plan-to-video/SKILL.md:369`, `skills/plan-to-video/SKILL.md:500`, `scripts/lib/guide/model.mjs:503` (every plan retains its generated guide and Built side).
- D-244 — ✓ holds: `scripts/guide.mjs:3`, `scripts/lib/guide/model.mjs:7` (plan.md remains the guide's source).
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:316` (Before you watch still includes only newly kept findings).
- D-247 — ✓ holds: `scripts/case-study.mjs:238`, `eval/case-studies/REPLICATE.md:243` (finished sites remain plain files plus verified site.bundle history).
- D-248 — ✓ holds: `scripts/reel.mjs:226`, `scripts/reel.mjs:842` (Plan this still carries the explainer forward and lists it first).
- D-249 — ✓ holds: `scripts/lib/codex-session.mjs:117`, `scripts/lib/explainer.mjs:134`, `templates/reelplanner/gitignore:16` (conversation exports stay external and source pins carry metadata rather than transcript contents).
- D-250 — ✓ holds: `skills/plan-to-video/SKILL.md:197`, `scripts/lib/explainer.mjs:87` (source forms and general story/guide principles remain, without a closed list of explainer kinds).
- D-303 — ✓ holds: `skills/plan-to-video/SKILL.md:553`, `skills/plan-to-video/SKILL.md:575`, `eval/agents/codex-2026-10-11/native-install-owner-handle.json:1` (installation walkthroughs retain real-command requirements and the native install has actual CLI evidence).
- D-304 — ✓ holds: `README.md:153` (the original reelplanning name and real-planning rationale remain explained).
- D-305 — ✓ holds: `skills/plan-to-video/SKILL.md:323`, `scripts/lib/inbox.mjs:486`, `templates/reelplanner/gitignore:30`, `eval/agents/codex-2026-10-11/headless-video-source-only.json:1` (generated voice/render files remain ignored and corrected real commits contain only source/metadata).
- D-306 — ✓ holds: `scripts/reel.mjs:326`, `scripts/reel.mjs:990`, `scripts/lib/memory.mjs:293` (owner rules, accepted-call history and owner-approved spec folding remain).
- D-309 — ✓ holds: `scripts/reel.mjs:654` (accepted walkthrough rule breaks remain notes, while pending walkthroughs retain failures).
- D-310 — ✓ holds: `scripts/release/make-public.mjs:2`, `scripts/release/make-public.mjs:101` (the release builder retains the current-tree single-commit export and private-history notice, without pushing).
- D-311 — ✓ holds: `.github/workflows/ci.yml:16`, `.github/workflows/pr.yml:11`, `.github/pull_request_template.md:1` (test events remain separate from PR-text/label checks and maintainer merge checks).
- D-312 — ✓ holds: `plugin.json:3`, `.agents/plugins/marketplace.json:2`, `scripts/lib/old-names.mjs:1`, `packages/player/reelplanner-player.js:1532` (new integration uses reelplanner while old settings and saved player keys remain readable).
- D-313 — ✓ holds: `scripts/review.mjs:421`, `packages/player/reelplanner-player.js:7120`, `docs/agents.md:98`, `skills/plan-to-video/references/harnesses.md:145` (direct local intake and portable exports are delivered; automatic remote hosting remains outside scope).

## Unexplained
- none
