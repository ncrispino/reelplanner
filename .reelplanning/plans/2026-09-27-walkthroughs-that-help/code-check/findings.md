# Code check: 2026-09-27-walkthroughs-that-help

## Steps

- Step 1 — ✓ carried by `scripts/lib/length.mjs` (`BUDGET.walkthrough` aim 1–2, warn 3, over 5), `scripts/test/build.spec.mjs`, `skills/plan-to-video/references/style-guide.md` §1/§8/§11, `skills/plan-to-video/SKILL.md`, `templates/video/BRIEF.md`, `docs/reference.md`, `docs/status.md`, `README.md`
- Step 2 — ✓ carried by `scripts/lib/autonomy.mjs` (`stopFor`, `PAUSING`, `listedOf`, `STREAK`/`acceptedRun` removed), `scripts/reel.mjs` (`stops`), `scripts/plan-map.mjs` (`autonomyList`, `list: true`), `packages/player/reelplanning-player.js` (`askList`, `listRows`, `acceptGroup`), `scripts/lib/review-scope.mjs` (`listed`), `scripts/lib/memory.mjs` (`reviewFacts` counts `listed` separately), `scripts/lib/notify.mjs` (`waitingLine`)
- Step 3 — ✓ carried by `scripts/check-terms.mjs` (`WALKTHROUGH`, skips D-197/D-198 there), `scripts/plan-map.mjs` (`openQuestion`), `packages/player/reelplanning-player.js` (`openQuestion()`, `setOpenWords`), `scripts/lib/review-scope.mjs` (`open` reason, "Seeing it run" heading), style guide §7/§8
- Step 4 — ✓ carried by `templates/pull_request_template.md`, `.github/pull_request_template.md` (identical), `CONTRIBUTING.md`/`templates/CONTRIBUTING.md`, `scripts/pr-check.mjs` (`otherChoices`, `choicesAccepted`, stale check using `PAUSING`), `scripts/test/contributing.spec.mjs`
- Step 5 — ✓ carried by `scripts/bundle-player.mjs` (`STATUS_WORD`, `stepStarts`, `prow`, `seg`, `#pb` sync logic), `packages/player/test/bundle.spec.mjs`, `docs/reference.md`
- Step 6 — ✓ carried by `packages/player/reelplanning-player.js` (`pauseBegins`, `shownAtOf`), `scripts/lib/memory.mjs` (`afterBuildOf`, `BAR`, `clearsBar`, `walkthroughBar`, `LINES` now 7), `scripts/reel.mjs` (`status()` prints the "a plan to drop the walkthrough video is due" line), `skills/plan-to-video/SKILL.md` (what the next plan proposes)
- Step 7 — ✗ nothing in the diff carries "the system video says the new rule, a bit shorter"; this is disclosed, not hidden: `.reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough.md` marks it ⏳ and ties the wait to D-003 ("the system video is brought up to date after an accepted walkthrough"), which plan.md itself lists under "Decisions in force". So the gap is explained by an in-plan decision, but a reviewer should know step 7's four described scene changes and glossary edits are not yet in the system video's own files (out of this diff's scope to check further)

## Decisions

- D-001 — ✓ holds: unaffected by this diff (this code check is itself the second-agent check it describes)
- D-002 — ✓ holds: `scripts/lib/review-scope.mjs` (`walkthroughScope`'s `fixes`) treats a flag on the list the same as a flag on a pause
- D-003 — ✓ holds (not yet exercised): step 7 is deliberately deferred until the walkthrough is accepted, per `walkthrough.md`
- D-023 — ✓ holds: `skills/plan-to-video/references/style-guide.md` §8, "Code is shown only for a choice about an interface or data (D-023)"
- D-041 — ✓ superseded for listed calls as claimed: `scripts/reel.mjs:198` (`check()`'s `active = ledger.filter(d => d.status === "active" ...)`) excludes `status: "listed"` entries, so a listed call never warns a later plan
- D-084 — ✓ superseded as claimed: `STREAK` and `acceptedRun` are gone from `scripts/lib/autonomy.mjs`
- D-083 — ✓ superseded for the walkthrough only: `scripts/check-terms.mjs`'s `WALKTHROUGH` flag only suppresses the "too soon"/"same case" checks, style guide §7 keeps them for plan/system videos
- D-109 — ✓ holds: `missFor` in `scripts/lib/autonomy.mjs` only matches a miss that itself carries a tag, so an untagged miss (from before tags, or a plan question) pauses nothing
- D-110 — ✓ holds: unrelated code (`STEP_CALLS`/`MANY_CALLS`) not touched by this diff
- D-127 — ✓ holds: player copy uses plain words ("Go on", "Listed, not judged", "Seeing it run"); `scripts/bundle-player.mjs` uses "Plan", "Built", "waiting"
- D-129 — ✓ holds: `scripts/reel.mjs`'s `status()` only prints a message when the bar is missed; nothing blocks Approve
- D-142/D-167 — ✓ hold: the new list/switch/open-question CSS in `packages/player/reelplanning-player.js` and `scripts/bundle-player.mjs` reuses the existing `--ink`/`--paper`/`--accent` tokens
- D-166 — ✓ holds: style guide §8 and `templates/video/BRIEF.md` say a walkthrough's `- Real things:` names every change scene
- D-194/D-195/D-196 — ✓ hold: `detailMark`/`openDetail` in `packages/player/reelplanning-player.js` untouched by this diff
- D-197/D-198/D-199 — ✓ hold for plan/system videos; a walkthrough's exception is D-222, confirmed in `scripts/check-terms.mjs` and `scripts/test/terms.spec.mjs`
- D-200 — ✓ holds: `CONTRIBUTING.md`/`templates/CONTRIBUTING.md` keep "who makes it" unchanged
- D-201/D-202 — ✓ hold: not touched by this diff (`scripts/reel.mjs`'s `record()` decision-log-conflict logic, and the maintainer's checklist bullets on CI/code-check, are unchanged beyond the new "other choices" bullet)
- D-213/D-215 — ✓ hold: the PR template's throwaway-branch comment (`git clone -q --depth 1 -b video/pr-<number> ...`) is unchanged
- D-214 — ✓ narrowed by D-223 as claimed: `CONTRIBUTING.md`, `templates/CONTRIBUTING.md`, `docs/lifecycle.md`, `scripts/pr-check.mjs` all describe the video line the same, consistent way
- D-219 — ✓ holds: `scripts/lib/length.mjs`, style guide §8, SKILL.md all describe a short video of the change running
- D-220 — ✓ holds: `stopFor(call, misses)` in `scripts/lib/autonomy.mjs` takes no count/streak parameter; `scripts/reel.mjs`'s `stops()` prints no cap
- D-221 — ✓ holds thoroughly: `scripts/lib/autonomy.mjs`, `scripts/lib/review-scope.mjs`, `scripts/lib/memory.mjs`, `scripts/reel.mjs`, `packages/player/reelplanning-player.js`, plus `packages/player/test/list.spec.mjs` and `scripts/test/lifecycle.spec.mjs`
- D-222 — ✓ holds: style guide §7/§8 and `scripts/check-terms.mjs`'s `WALKTHROUGH` flag
- D-223 — ✓ holds: `scripts/pr-check.mjs` (the box's new wording, `otherChoices`, stale-check via `PAUSING`), both PR templates
- D-224 — ✓ holds: `scripts/bundle-player.mjs`'s `prow`/`seg`/`#pb` gives exactly one row per plan with a Plan | Built switch
- D-005, D-024, D-065, D-082, D-085, D-106, D-107, D-128, D-169, D-170, D-171, D-216, D-217, D-218 — ✓ hold, not touched: none of their owning files (`scripts/review.mjs`, `scripts/lib/sandbox.mjs`, `scripts/case-study.mjs`, `scripts/renumber.mjs`, `scripts/lib/jargon.mjs`, etc.) are in this diff

## Unexplained

- `packages/player/test/bundle.spec.mjs:74` — ✗ the "older plans folded" check gates on `lib.plans.filter((p) => p.status === "waiting").length`, but a plan's `status` field (set in `scripts/bundle-player.mjs` via `STATUS_WORD`) can only ever be one of `"approved"`, `"changes"`, `"questions open"`, `"not reviewed"`, `"built"`, `"reviewed"`, `"no video yet"` — never `"waiting"` (that word is only ever computed client-side, from `waitingOf`/`needs`, and never written into `library.json`). So this filter is dead code and always evaluates to 0; the check happens to pass on the bundle it runs against (which has no plan actually waiting for review), but on a repo where a plan is waiting and the plan count is just over `RECENT` (5), the test would wrongly expect an "Earlier plans (N)" fold that the real page correctly omits (since `restPlans` already excludes waiting plans in `scripts/bundle-player.mjs`). No step, decision or autonomy row (A9 describes the fold's design but not this test's accounting for waiting plans) covers this. Suggest: an autonomy-log-style note, or fixing the filter to key off the same `needs()`/TODO logic the page itself uses.
