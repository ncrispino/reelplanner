# Code check: 2026-09-25-fewer-better-stops

## Steps
- Step 1 — ✓ carried by `scripts/lib/autonomy.mjs` (`beatsByStep`, `pausesOf`), `scripts/reel.mjs` (`stops`), `scripts/plan-map.mjs` (a multi-id `autonomy:` line becomes an `autonomyGroups` entry with `stop: true`), `packages/player/reelplanning-player.js` (`askStop`, `stopRows`, `judgeInStop`, `openOwnFor`, `stopDone`), `skills/plan-to-video/SKILL.md`, `skills/plan-to-video/references/style-guide.md` §8, `docs/project-dir.md`
- Step 2 — ✓ carried by `scripts/lib/autonomy.mjs` (`missFor` now matches only by shared tag; `call.components` no longer read), `scripts/reel.mjs` `stops()` (no longer builds or passes `comps`/`stepComponents`), `scripts/test/memory.spec.mjs`, `scripts/test/lifecycle.spec.mjs`
- Step 3 — ✓ carried by `scripts/lib/autonomy.mjs` (`MANY_CALLS`, `STEP_CALLS`, `callLoad`), `scripts/reel.mjs` `audit()` (the new warning line), `skills/plan-to-video/SKILL.md` (the five-call rule, D-110's "stop and ask"), `scripts/test/lifecycle.spec.mjs`

## Decisions
- D-001 — ✓ holds: `scripts/reel.mjs` `audit()` folds step 3's call-count warning into the same single-agent audit run; the code check itself (a second agent) is untouched.
- D-005 — ✓ holds: `packages/player/reelplanning-player.js` `endDetail()`/`detailsLog()` (lines 1934, 1939) exclude a band-read-in-full from the details log; rewind logic itself is untouched.
- D-021 — ✓ holds: `packages/player/reelplanning-player.js:2672` `readBand()` opens the band's long words through the same `openDetail` side panel a detail uses.
- D-024 — ✓ holds: untouched (no diff to `templates/details/`).
- D-064 — ✓ holds: untouched (no diff to `scripts/review.mjs`).
- D-066 — ✓ holds: untouched.
- D-082 — ✓ holds: untouched (no diff to `scripts/lib/sandbox.mjs`).
- D-083 — ✓ holds: one quick check per step is unchanged; its band now also reads in full (`fitBand`).
- D-084 — ✓ holds: `scripts/lib/autonomy.mjs` `STREAK`/`acceptedRun` unchanged; only `missFor`'s miss exception is narrowed to a shared tag (D-109).
- D-085 — ✓ holds: a stop beat is still carried as one `- autonomy:` tag naming several ids; no new template or scaffolding.
- D-106 — ✓ holds: `reel memory --you` still reads `~/.reelplanning/you.jsonl` as your memory across repos (see Unexplained for an unrelated pending-file addition alongside it).
- D-107 — ✓ holds: untouched.
- D-108 — ✓ holds: `packages/player/reelplanning-player.js:2645` `fitBand()` and `:2672` `readBand()` keep an answer in the band, growing it up to 40% of the frame as its words need, and only send what is left over to the side panel — matching "keep it in the band, not messing with the video, but make it bigger/more graceful."
- D-109 — ✓ holds: `scripts/lib/autonomy.mjs` `missFor` no longer reads `call.components`; a miss with no tags now matches nothing.
- D-110 — ✓ holds: `skills/plan-to-video/SKILL.md` Implement step 1 ("At a step's fifth call, stop… put that step's biggest open choice into `plan.md`"); the walkthrough says no step in this build reached a fifth call.

## Unexplained
- `packages/player/reelplanning-player.js` — ✗ carries an entire second feature that this plan's steps, decisions and autonomy rows never mention: a Terms/glossary side panel (`termList`, `glossHtml`, `showTerm`, `openTerms`/`closeTerms`, around lines 1679-1816), a "Before you watch" prerequisites box (`renderBefore`, `markWatched`, `prereqs`), "Walk me through it" worked examples (`syncWalk`, `openWalk`), the confusion guard (`guardLine`, `walkMissed`, `askAgainMissed`), and `confusion()` review telemetry. This matches the different, later plan `.reelplanning/plans/2026-09-25-videos-you-can-follow/` (commit `29ee99c`), not fewer-better-stops.
- `scripts/plan-map.mjs:12,146` — ✗ imports and calls `addAccess` from `./lib/terms.mjs`; that module does not exist anywhere in the checked commit's tree (`git show` on it fails with "exists on disk, but not in" that commit) — `reel plan-map` would throw on import. Same unrelated feature as above, and broken besides; no row covers it.
- `scripts/bundle-player.mjs:268,304` — ✗ adds a per-video "Watched" indicator (`rp:watched:` in `localStorage`, `.row .wd`, the `watched()` helper) to the review-page library UI; part of the same unrelated feature, no row.
- `package.json:51` — ✗ adds `node scripts/test/terms.spec.mjs` and `node packages/player/test/access.spec.mjs` to the `test` script; neither file exists in the checked commit (same "exists on disk, but not in" result as `lib/terms.mjs`), so `npm test` would fail outright before it ever reaches this plan's own new tests (`stop.spec.mjs`, `band.spec.mjs`). No row covers it.
- `skills/plan-to-video/SKILL.md` and `skills/plan-to-video/references/style-guide.md` — ✗ both add `before:`/`terms:`/`terms_check:`/`- defines:`/`- walk_me_through:` front matter and a `check-terms` build stage; same unrelated feature as above, no row in this plan's log.
- `scripts/reel.mjs` (`record()`, `memory()`) and `scripts/test/memory.spec.mjs` — ✗ carry a "pending memory summary" mechanism (`pendingPath`, `recordYou`, `movePending`, the new `you.pending.jsonl` file, and new `pending`/`pending-again`/`lost` console-log branches). This is real, user-visible behaviour, but the whole of it lands inside one separate, already-committed change (`7e5bd45`, "Memory A15 after review") that sits between this plan's stated start point (`c2f7fd2`) and its own work — `walkthrough.md` never mentions it, and its "D-106, D-107 held: untouched" line only addresses `scripts/lib/memory.mjs` staying unedited, not this.
- `.reelplanning/plans/2026-09-25-fewer-better-stops/walkthrough.md:92` — ✗ the "## Tests" section still holds the literal placeholder `TESTS_LINE` rather than an actual test run's output, so the walkthrough's own claim that tests pass is unverified as written — and, given the broken imports/test-file references above, `npm test` would not in fact get through the suite at this commit.
