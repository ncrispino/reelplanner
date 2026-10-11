# Code check: 2026-10-11-codex-first-class

## Steps
- Step 1 — ✓ carried by `plugin.json`, `.agents/plugins/marketplace.json`, `package.json`, `scripts/release/sync-version.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/setup-check.mjs`, `scripts/test/codex-install.spec.mjs`, `skills/plan-to-video/references/harnesses.md` (native packaging, isolated real installation, prerequisite diagnostics and a shared harness boundary).
- Step 2 — ✓ carried by `scripts/lib/agents.mjs:25`, `scripts/lib/inbox.mjs:243`, `scripts/lib/inbox.mjs:317`, `scripts/inbox.mjs:47`, `scripts/test/delivery.spec.mjs` (sandboxed automatic review, checked-tree commit evidence, preserved owner work and guarded recovery; the direct delivery spec passed all 13 checks).
- Step 3 — ✓ carried by `scripts/lib/codex-session.mjs:138`, `scripts/lib/agents.mjs:155`, `scripts/lib/inbox.mjs:557`, `scripts/review.mjs:442`, `packages/player/reelplanner-player.js:3341`, `packages/player/guide-review.js:502`, `eval/agents/codex-2026-10-11/cli-live-question.json` (verified live CLI recipient, durable questions, session leases, fallback and sourced answer polling).
- Step 4 — ✓ carried by `scripts/lib/codex-session.mjs`, `scripts/lib/explainer.mjs:135`, `scripts/explain.mjs:45`, `scripts/session.mjs`, `scripts/test/session-export.spec.mjs` (exact session/project discovery, read-only paginated export and verified external-source fallback without storing transcript contents in Git).
- Step 5 — ✗ the terminal-pane parity proof remains incomplete: `docs/terminal-review.md:61` explicitly leaves walkthrough Accept/Flag and changed-scenes validation open; the presentation, discovery, seeking and portable-export changes exist in `scripts/lib/presentation.mjs`, `scripts/lib/review-projects.mjs`, `scripts/lib/http-file.mjs` and `packages/player/reelplanner-player.js`.
- Step 6 — ✗ the real narrated CLI lifecycle, headless requested-change rebuild, session explainer and accepted/flagged walkthrough-to-fix proof remain incomplete: `docs/agents.md:138` limits the focused evidence, and `eval/agents/codex-2026-10-11/headless-summary.json` explicitly excludes video builds and full plan validation; the owner's CLI-only clarification removes desktop-app acceptance from this finding.

## Decisions
- D-023 — ✓ holds: `scripts/lib/details.mjs:7` offers interactive exploration, prototypes and evidence alongside code, with code reserved for justified cases.
- D-024 — ✓ holds: `scripts/detail.mjs` selects a typed template and falls back to the fresh template.
- D-082 — ✓ holds: `scripts/lib/agents.mjs:25` uses automatic review with workspace-write, and the Codex adapter preserves that sandbox and signing policy.
- D-085 — ✓ holds: `scripts/detail.mjs` writes the chosen template file and `scripts/lib/reviews.mjs` preserves review files.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:50` keeps the cross-repository memory in the machine's home-folder record.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:40` retains five-plan and three-repeat retro thresholds.
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs:46` makes an untagged miss stop nothing directly.
- D-110 — ✓ holds: `skills/plan-to-video/SKILL.md:493` requires asking before a step's fifth call, with enforcement in `scripts/reel.mjs:638`.
- D-129 — ✓ holds: `scripts/lib/review-scope.mjs:239` records approval with missed checks without blocking it.
- D-168 — ✓ holds: `eval/case-studies/REPLICATE.md:95` retains fixes and finished-site stopping conditions for the comparison arms.
- D-169 — ✓ holds: `eval/case-studies/REPLICATE.md:34` retains the owner's review order, ours first with a day between arms.
- D-170 — ✓ holds: `scripts/case-study.mjs:215` retains rubric evidence, blind judging and the owner's ranking, with process differences covered separately.
- D-171 — ✓ holds: `scripts/pr-check.mjs:245` checks decision-ID collisions and requires the existing rebase/renumber merge rule.
- D-195 — ✓ holds: `packages/player/reelplanner-player.js:3895` retains the detail overlay grown from the clicked block.
- D-197 — ✓ holds: `skills/plan-to-video/SKILL.md:308` retains later checks on a new case, with the timing check in `scripts/check-terms.mjs:226`.
- D-198 — ✓ holds: `scripts/check-terms.mjs:226` retains separate too-soon and repeated-case warnings.
- D-199 — ✓ holds: `skills/plan-to-video/SKILL.md:308` retains the quick-check authoring rule and `scripts/check-terms.mjs` applies it to plan/system videos; this diff removes no existing checks.
- D-200 — ✓ holds: `scripts/pr-check.mjs:15` keeps the video request as something a maintainer may satisfy rather than contributor failure.
- D-201 — ✓ holds: `scripts/pr-check.mjs:263` retains the rule for the final maintainer answer in the merged record.
- D-213 — ✓ holds: `scripts/pr-check.mjs:201` keeps built media out of a plan's PR branch, with delivery through the throwaway video branch.
- D-215 — ✓ holds: `.github/workflows/pr.yml:7` retains cleanup of the unmerged `video/pr-<n>` branch.
- D-216 — ✓ holds: `scripts/lib/jargon.mjs` and `scripts/check-terms.mjs` retain build-time discovery of likely jargon.
- D-217 — ✓ holds: `scripts/lib/jargon.mjs:3` retains warnings with strict-mode failure.
- D-218 — ✓ holds: `packages/player/reelplanner-player.js:3040` retains learned-term tracking and removes underlining once the viewer knows a word.
- D-219 — ✓ holds: `skills/plan-to-video/SKILL.md:549` requires a short walkthrough showing the change running.
- D-220 — ✓ holds: `skills/plan-to-video/SKILL.md:542` and `scripts/lib/autonomy.mjs:58` impose no fixed pause count.
- D-221 — ✓ holds: `scripts/lib/review-scope.mjs:166` records unflagged listed calls as listed rather than accepted.
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md:308` places walkthrough predictions where there is something to predict.
- D-223 — ✓ holds: `scripts/pr-check.mjs:97` retains the visible-choice video threshold and written review of other choices.
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs:257` retains failure for unanswered findings before presentation.
- D-227 — ✓ holds: `scripts/fresh-eyes.mjs:239` starts a fresh review set for each rebuild and keeps prior rounds.
- D-230 — ✓ holds: `skills/plan-to-video/SKILL.md:497` retains the Built-side guide material for every plan.
- D-244 — ✓ holds: `scripts/guide.mjs:3` builds the guide from plan.md and the recorded sources.
- D-245 — ✓ holds: `scripts/lib/fresh-eyes.mjs:314` suppresses repeated kept findings with the same reason.
- D-247 — ✓ holds: `scripts/case-study.mjs:238` retains finished sites as plain files and a Git bundle.
- D-248 — ✓ holds: `scripts/lib/explainer.mjs:391` retains the explainer as context for a resulting plan.
- D-249 — ✓ holds: `scripts/lib/explainer.mjs:135` pins an external transcript without copying its contents, and `scripts/lib/codex-session.mjs:111` writes exports outside the repository.
- D-250 — ✓ holds: `skills/plan-to-video/SKILL.md:197` retains source-driven general explainer principles rather than a fixed list of kinds.
- D-303 — ✓ holds: `skills/plan-to-video/SKILL.md:553` requires real working installation commands, and `scripts/test/codex-install.spec.mjs:81` exercises the actual plugin installation; the unfinished lifecycle video is covered under Step 6.
- D-304 — ✗ `README.md:152` explains the difficulty of long plans but never explains the former name's “real planning” meaning as this decision requires; this omission predates the diff and remains in the changed README, although `.reelplanner/spec.md:10` keeps the explanation.
- D-305 — ✓ holds: `scripts/pr-check.mjs:206` and `templates/reelplanner/gitignore:30` retain the prohibition on committed voice files and renders; this diff adds none.
- D-306 — ✓ holds: `scripts/lib/ledger.mjs:19`, `scripts/lib/call-lines.mjs:202` and `scripts/fold.mjs` retain binding owner answers, line-sensitive historical calls and approved specification folds.
- D-309 — ✓ holds: `scripts/reel.mjs:654` retains accepted walkthrough violations as notes and applies failures to unsettled walkthroughs.
- D-310 — ✓ holds: `scripts/release/make-public.mjs` retains the single-commit public-tree export without pushing it.
- D-311 — ✓ holds: `.github/workflows/ci.yml` retains push-driven fast/full checks and `.github/workflows/pr.yml` retains separate review checks and video cleanup.
- D-312 — ✓ holds: `plugin.json`, `.agents/plugins/marketplace.json`, `scripts/lib/old-names.mjs` and `scripts/lib/env.mjs:264` retain lowercase reelplanner identity and old-name read compatibility; player storage keys remain compatible.
- D-313 — ✓ holds: `scripts/review.mjs`, `packages/player/reelplanner-player.js:7149` and `skills/plan-to-video/references/harnesses.md:138` implement direct local delivery plus portable export while leaving automatic remote hosting outside scope.

## Unexplained
- none
