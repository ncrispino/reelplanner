# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/setup-check.mjs`, `scripts/lib/agents.mjs`, `scripts/test/codex-install.spec.mjs`, `skills/plan-to-video/references/harnesses.md`.
- Step 2 — ✗ `scripts/lib/inbox.mjs:204` accepts any new descendant HEAD with the original pending tracked diff, so a scratch review requesting an unapplied edit could be marked committed and done after an unrelated empty commit; this does not establish the review's successful commit as the plan and A4 require.
- Step 3 — ✗ `scripts/lib/inbox.mjs:310` releases expired review claims only in the queued phase, so a fresh session cannot recover a crashed handler in handling/intake/editing/checked, and `scripts/lib/inbox.mjs:452` refuses retry when the default headless command is empty; a scratch expired handling claim remained unavailable to the next waiter.
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/explainer.mjs`, `scripts/explain.mjs`, `scripts/session.mjs`, `scripts/test/session-export.spec.mjs`, `scripts/test/explainer.spec.mjs`.
- Step 5 — ✗ the launcher, discovery, delivery and audio changes exist in `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/review.mjs` and `scripts/lib/http-file.mjs`, but `docs/terminal-review.md:61` explicitly leaves the pane review controls open and the diff contains no completed portable-export identity/answer/comment trial or Codex app annotation-handoff evidence.
- Step 6 — ✗ `docs/agents.md:136` leaves the complete narrated scratch lifecycle and Codex app unproved, `eval/agents/codex-2026-10-11/headless-summary.json` explicitly excludes server/player/video work, and neither `.reelplanner/spec.md` nor `.reelplanner/system.json` is updated despite this step requiring the system spec/map to match what landed.

## Decisions
- D-023 — ✓ holds: `scripts/lib/details.mjs:12` retains code details only where the code itself is judged, alongside other detail kinds.
- D-024 — ✓ holds: `scripts/lib/details.mjs:5` retains typed detail templates and a fresh-page fallback.
- D-082 — ✓ holds: `scripts/lib/agents.mjs:26` selects automatic approval review with workspace-write for Codex, without disabling its sandbox.
- D-085 — ✓ holds: `skills/plan-to-video/SKILL.md:483`, `scripts/lib/details.mjs:6` and the existing plan/review files retain the reduced scaffolding and free detail kinds.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:52` retains the home-folder `you.jsonl` record; the diff changes only scratch-test isolation in this component.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40` and `scripts/lib/memory.mjs:480` retain five plans or three repeated signals as the retro trigger.
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:48` matches misses by shared tags, so untagged misses directly pause nothing.
- D-110 — ✓ holds: `scripts/lib/autonomy.mjs:103`, `scripts/reel.mjs:622` retain the fifth-call check, and the supplied autonomy table has fewer than five calls in each step.
- D-129 — ✓ holds: `scripts/lib/review-scope.mjs:239` records approval with missed checks without blocking it.
- D-168 — ✓ holds: `eval/case-studies/REPLICATE.md:3` and `scripts/case-study.mjs:2` retain finished-site outcomes for every arm; this diff does not alter those workflows.
- D-169 — ✓ holds: `eval/case-studies/REPLICATE.md:34` retains owner review with ours first.
- D-170 — ✓ holds: `eval/case-studies/TEMPLATE.md:62` and `eval/case-studies/TEMPLATE.md:72` retain rubric, blind judgment, owner ranking and planning-process comparisons beyond the rubric.
- D-171 — ✓ holds: `skills/plan-to-video/SKILL.md:645` and `scripts/renumber.mjs` retain ordered decision IDs and rebase renumbering.
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains details opening over the frame from their anchor; changed player sections concern questions/status.
- D-197 — ✓ holds: `skills/plan-to-video/SKILL.md:308`, `scripts/check-terms.mjs:226` retain later checks on a new case for plan/system videos.
- D-198 — ✓ holds: `scripts/check-terms.mjs:258` and `scripts/check-terms.mjs:259` retain separate too-soon and repeated-case warnings.
- D-199 — ✓ holds: `scripts/check-terms.mjs` and `skills/plan-to-video/SKILL.md:575` retain checks for new/revised videos and the system-video authoring route; this diff removes no existing checks.
- D-200 — ✓ holds: `skills/plan-to-video/SKILL.md:625` retains the maintainer-made walkthrough route for a PR that needs a video.
- D-201 — ✓ holds: `skills/plan-to-video/SKILL.md:632` retains the last answer when the maintainer changes a contributor's answer.
- D-213 — ✓ holds as clarified by D-215: `skills/plan-to-video/SKILL.md:634` keeps built media off the PR branch and uses its throwaway video branch.
- D-215 — ✓ holds: `skills/plan-to-video/SKILL.md:637` and `.github/workflows/pr.yml:48` retain `video/pr-<n>` delivery and cleanup.
- D-216 — ✓ holds: `scripts/lib/jargon.mjs:25`, `scripts/lib/terms.mjs` retain build-driven jargon detection and meanings.
- D-217 — ✓ holds: `scripts/check-terms.mjs` retains warnings and strict-mode failures for unlabelled jargon; its behavior is unchanged.
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:3040` retains known-word tracking, and `scripts/review.mjs:397` still reads the owner's known words.
- D-219 — ✓ holds: `skills/plan-to-video/SKILL.md:548` retains the walkthrough as a short video of the change running.
- D-220 — ✓ holds: `scripts/lib/autonomy.mjs:61` chooses pauses from visibility, reversibility, deviation and tagged misses without a fixed pause count.
- D-221 — ✓ holds: `packages/player/reelplanner-player.js:5824`, `scripts/lib/review-scope.mjs:166` retain listed, unjudged calls when they were not flagged.
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md:274` retains walkthrough checks only where there is something to predict.
- D-223 — ✓ holds: `skills/plan-to-video/SKILL.md:621`, `scripts/lib/contributing.mjs` retain the visible-choice threshold for small PR videos.
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:287` fails unanswered findings, and `skills/plan-to-video/SKILL.md:382` still requires fresh reviewers and answered findings before presenting a build.
- D-227 — ✓ holds: `skills/plan-to-video/SKILL.md:382` and `scripts/lib/fresh-eyes.mjs:270` retain fresh eyes for new/rebuilt videos; the integration does not exempt Codex.
- D-230 — ✓ holds: `scripts/lib/guide/model.mjs:154` and `scripts/lib/guide/model.mjs:206` retain each plan's guide with its Built side.
- D-244 — ✓ holds: `scripts/lib/guide/model.mjs:206` reads plan/walkthrough text to build the guide, rather than treating the guide as editable source.
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:329` and `packages/player/reelplanner-player.js:2914` retain only newly kept findings in the before-watch list.
- D-247 — ✓ holds: `scripts/case-study.mjs:288` retains plain site files plus a verified `site.bundle`.
- D-248 — ✓ holds: `scripts/lib/explainer.mjs:391` retains a plan originating from, and leaning on, its explainer.
- D-249 — ✓ holds: `scripts/lib/codex-session.mjs:124` writes private exports outside the repository, and `scripts/lib/explainer.mjs:139` pins only external metadata/hash/size.
- D-250 — ✓ holds: `scripts/lib/explainer.mjs:4` and `skills/plan-to-video/SKILL.md:197` retain general source/story principles rather than a closed list of explainer kinds.
- D-303 — ✓ holds in the authoring rules: `skills/plan-to-video/SKILL.md:553` and `skills/plan-to-video/SKILL.md:575` still require real install commands run and shown; the remaining runtime proof is reported under Steps 5 and 6.
- D-304 — ✓ retains the plan-video motivation in `README.md:5`; the pronunciation/name now follows the later D-312 rename, and this diff does not introduce another name.
- D-305 — ✓ holds for its surviving media rule: the diff adds text evidence only, and `scripts/release/make-public.mjs` retains its media exclusions; D-310 governs the public-history shape.
- D-306 — ✓ holds: `scripts/lib/ledger.mjs:18` and `scripts/lib/call-lines.mjs` retain binding owner rules, accepted-call history and line-based reactivation.
- D-309 — ✓ holds: `scripts/reel.mjs:665` retains rule-break notes for an owner-accepted walkthrough and failures for unsettled work.
- D-310 — ✓ holds as renamed by D-312: `scripts/release/make-public.mjs`, `.reelplanner/README.md` retain the one-tree public export and development-history citation note; the release workflow is unchanged.
- D-311 — ✓ holds: `.github/workflows/ci.yml:13`, `.github/workflows/pr.yml:9`, `.github/pull_request_template.md` retain separate test/PR checks and maintainer merge checking; no integration change alters those rules.
- D-312 — ✓ holds: `plugin.json:3`, `.agents/plugins/marketplace.json:2`, `scripts/lib/old-names.mjs`, `packages/player/reelplanner-player.js:1532` retain lowercase reelplanner naming, legacy reads and existing annotation-storage keys.
- D-313 — ✓ holds for scope: `scripts/review.mjs:429` saves local Send directly, while `skills/plan-to-video/references/harnesses.md:129` retains portable exports and explicitly excludes automatic remote service delivery.

## Unexplained
- `scripts/lib/codex-session.mjs` — ✗ sets a 64 MiB, 1,000-page and 30-second history/export ceiling at line 12 that can stop explainers of long sessions, without a step, decision or autonomy row selecting those limits; suggest an autonomy row naming the export limits, their reason and the external-copy fallback.
