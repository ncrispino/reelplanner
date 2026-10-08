# Code check: 2026-09-24-memory

## Steps
- Step 1 — ✓ carried by `scripts/lib/reviews.mjs` (`recordedBy`, `fileReview`'s `recorded` stamp), `scripts/migrate-reviews.mjs` (`stamp: false`), `scripts/reel-intake.mjs` and `scripts/system-review.mjs` (pass `row` for the page's viewer), `scripts/reel.mjs` `record()` (passes `row`, prints the stamp)
- Step 2 — ✓ carried by `scripts/lib/memory.mjs` (`reviewFacts`, `memoryLines`, `LINES`), `scripts/reel.mjs` `status()` (prints the lines) and `memory()` (prints a line's evidence), `skills/plan-to-video/SKILL.md` (reads memory before planning)
- Step 3 — ✓ carried by `scripts/lib/memory.mjs` (`homeDir`, `youPath`, `appendYou`, `readYou`, `youMemory`), `scripts/reel.mjs` `record()` (calls `appendYou`, reports "added"/"again"/"no-repo"), `scripts/reel.mjs` `memory()` (`--you`). Its open question 1 is answered by ledger decision D-106.
- Step 4 — ✓ carried by `scripts/lib/memory.mjs` (`findMisses`), `scripts/lib/autonomy.mjs` (`missFor`, `stopFor`'s new `misses` argument), `scripts/reel.mjs` `stops()` (feeds recent misses into `stopFor` and prints "a miss: …"). "The next plan that touches that part asks that kind of question" is carried only softly, through `skills/plan-to-video/SKILL.md`'s new instruction to read memory (which surfaces a miss's tags/components) before writing a plan — there is no code gate (e.g. in `check()`) that forces the next plan to ask it. Consistent with this repo's own D-085 stance that content/format rules are skill advice rather than enforced checks, so not counted as a gap.
- Step 5 — ✓ carried by `scripts/lib/memory.mjs` (`sinceRetro`, `signals`, `retroDue`), `scripts/reel.mjs` `retro()` and `benchmark()`, and `status()`'s retro suggestion line. Its open question 2 is answered by ledger decision D-107.

## Decisions
- D-024 — ✓ holds: untouched by this diff. None of the files this plan changes (`scripts/lib/memory.mjs`, `scripts/lib/autonomy.mjs`, `scripts/lib/reviews.mjs`, `scripts/reel.mjs`, `scripts/migrate-reviews.mjs`, `scripts/reel-intake.mjs`, `scripts/system-review.mjs`) touch detail-page/template code (`player`, `finish`, `resolve`, `implement-step`); `skills/plan-to-video/SKILL.md`'s edit only adds a memory-reading instruction, not detail-page guidance.
- D-082 — ✓ holds: `scripts/reel.mjs:306-315` (`record()`) explicitly anticipates the sandbox's repo-only writes — `appendYou` is wrapped in try/catch and, when the write fails, the review is still recorded and the last line says it is "not in your memory" (A15), rather than assuming an unfenced run.
- D-083 — ✓ holds: untouched by this diff (no video-authoring/storyboard code is changed).
- D-084 — ✓ holds: `scripts/lib/autonomy.mjs:52-69` (`stopFor`) keeps the original tag+streak rule intact (untagged calls still never stop, deviations always do, an accepted tag's streak of `STREAK` still groups it) and only adds the miss exception on top, as `scripts/test/memory.spec.mjs`'s `stopFor` unit tests exercise.
- D-085 — ✓ holds: `reel retro` (`scripts/reel.mjs:471-505`) reuses `makePlan` (no checklist file beside the plan, `scripts/reel.mjs:104-111`) and the one-review-kept-once convention in `scripts/lib/reviews.mjs` is unchanged; no resolved-copy or scope-file scaffolding is reintroduced.
- D-106 — ✓ holds: `scripts/lib/memory.mjs:134-135` (`homeDir`/`youPath` → `~/.reelplanning/you.jsonl`, overridable by `REELPLANNING_HOME`), matching the ledger's D-106 chosen option.
- D-107 — ✓ holds: `scripts/lib/memory.mjs:123-124` (`RETRO_PLANS = 5`, `RETRO_REPEAT = 3`) and `retroDue` (`scripts/lib/memory.mjs:382-389`), which fires on whichever comes first, matching the ledger's D-107 chosen option.

## Unexplained
- none
