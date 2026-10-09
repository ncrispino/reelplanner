# Code check: 2026-09-26-contributing

## Steps

- Step 1 — ✓ carried by `templates/CONTRIBUTING.md`, `templates/pull_request_template.md`, `scripts/pr-check.mjs` (the line: `LINES`, `NOT_CODE`, `choiceLine`/`bringsLine`/labels), `skills/plan-to-video/SKILL.md` ("Several people"), `scripts/test/contributing.spec.mjs` (Omar's `--quiet`, the 301-line branch, the ticked box)
- Step 2 — ✓ carried by `CONTRIBUTING.md` ("Who decides", "What lands on main"), `scripts/reel.mjs:286-313` (`record()`'s contributor/maintainer split), `scripts/lib/contributing.mjs` (`maintainersOf`, `isMaintainer`, `roleOf`), `scripts/pr-check.mjs` (`--tidy`, the lands/stays columns), `docs/project-dir.md` (the `maintainers` line)
- Step 3 — ✓ carried by `scripts/review.mjs` (serving a `bundle-player`-packed folder as it is, plan-map comparison), `scripts/pr-check.mjs` (the `video/pr-<n>` branch check, the "fresh" plan-map/row checks, the media check), `skills/plan-to-video/SKILL.md` (the `bundle-player`/`git push --force` commands)
- Step 4 — ✓ carried by `scripts/renumber.mjs`, `scripts/lib/contributing.mjs` (`entryKey`, `writeLedger`), `scripts/lib/memory.mjs` (`gitEmail`, `mineToMove`), `.gitattributes` (`merge=union`), `docs/project-dir.md` ("An id is final once it is on main")
- Step 5 — ✓ carried by `.github/workflows/ci.yml` (`fast`, `pr-check`, `full`, `video-branch` jobs), `docs/releasing.md`. Named `ci.yml`, not `test.yml` as the plan's text says — a deviation, and the autonomy log's D1 explains it.

## Decisions

- D-001 — ✓ holds: unaffected by this diff (the second-agent code check is pre-existing); `CONTRIBUTING.md` ("their code check found nothing left") and `skills/plan-to-video/SKILL.md` ("run their own code check") both point a maintainer at it for step 3.
- D-003 — ✓ holds: `docs/lifecycle.md` ("The system video... brought up to date on main after merges, once for every PR merged since") and `CONTRIBUTING.md` ("Before a merge") match; the pre-existing `systemVideoStatus()` in `scripts/reel.mjs:464` already reports "behind" by comparing commit times, so no new code was needed for "`reel status` says so meanwhile".
- D-024 — ✓ holds: not touched by this diff, as the plan's own "Decisions in force" says ("Detail pages start from a template: untouched").
- D-065 — ✓ holds: not touched by this diff; general policy already in force, unaffected here.
- D-082 — ✓ holds: `.reelplanning/config.json`'s agent block is unchanged except for the new `maintainers` key.
- D-083 — ✓ holds: not touched (no video content is in this diff's file scope).
- D-084 — ✓ holds: `scripts/reel.mjs`'s `record()` still routes accepted/flagged/own-words calls the same way; a PR-with-no-video walkthrough is built "as for any plan" (step 1 text), so the same stop rules apply with no special-case code.
- D-109 — ✓ holds: same as D-084, untouched.
- D-085 — ✓ holds: exactly what the plan lists is what the diff adds — two commands (`pr-check`, `renumber` in `scripts/reel.mjs`'s dispatch table), one flag (`--tidy`), two labels (`needs-video`, `no-video`, read in `scripts/pr-check.mjs`), three templates (`templates/CONTRIBUTING.md`, `templates/pull_request_template.md`, `templates/gitignore`), four files in this repo (`CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/workflows/ci.yml`, `.gitattributes`), one job (`video-branch`), no new stage.
- D-106 — ✓ holds: `scripts/lib/memory.mjs` keeps memory per home-folder file; `mineToMove`/`gitEmail` only gate which *pending* lines move into it, matching autonomy row A8.
- D-107 — ✓ holds: not touched.
- D-110 — ✓ holds: not touched (agent-level behaviour, out of this diff's scope).
- D-127 — ✓ holds: `CONTRIBUTING.md` and `templates/pull_request_template.md` are in plain language.
- D-128 — ✓ holds: not touched.
- D-129 — ✓ holds: not touched.
- D-169 — ✓ holds: not touched.
- D-170 — ✓ holds: not touched.
- D-171 — ✓ holds: `scripts/renumber.mjs` takes the base's log, appends the branch's own entries (by `entryKey`, matching plan/question/date/answer) after the base's last id, rewrites their mentions, and never changes an id already on main; `scripts/pr-check.mjs`'s id check fails a branch whose id names a different entry than the base's, matching `docs/project-dir.md`'s new rule.
- D-194 — ✓ holds: not touched (this plan's video has no details, per the plan's own note).
- D-195 — ✓ holds: not touched.
- D-196 — ✓ holds: not touched.
- D-197 — n/a for this check: about quick-check placement in video content, which is outside this diff's file scope (no `STORYBOARD.md`/`SCRIPT.md` in the reviewed files).
- D-198 — n/a for this check, same reason as D-197.
- D-199 — n/a for this check, same reason as D-197.
- D-200 — ✓ holds: `CONTRIBUTING.md` ("Who makes the video") gives both cases; `scripts/pr-check.mjs`'s `waits.push("needs a video...")` message names both ("the contributor brings one, or a maintainer's agent makes a walkthrough").
- D-201 — ✓ holds as the plan itself scopes it: the plan says "`reel record` needs nothing new for it" (the last answer is kept by hand-editing the branch's entry, not by new record logic), and indeed `scripts/reel.mjs`'s plan-decision loop is unchanged in this regard — it still skips a question already answered for that plan rather than overwriting, consistent with "nothing new".
- D-202 — ✓ holds: CI's checks are `reel pr-check` + `reel audit`, wired into `.github/workflows/ci.yml`'s `pr-check` job; the maintainer's own code check is documented (`CONTRIBUTING.md`, `SKILL.md`) as a manual step, matching "neither rebuilds anything, the code check is not automated".
- D-213 — ✓ holds: `templates/gitignore`/`.gitignore` exclude each video's `assets/`, `capture/` and audio metadata under a plan folder; `scripts/pr-check.mjs`'s `MEDIA` check fails a PR that adds a voice/image/video file under `.reelplanning/plans/`.
- D-214 — ✓ holds: `scripts/pr-check.mjs`'s `reasons` array is exactly the ticked box, `needs-video`, or `size > 300`; `whyNot()` never treats "which files it touches" as a factor, matching "which files it touches no longer counts".
- D-215 — ✓ holds: `scripts/pr-check.mjs` looks for `video/pr-<n>` via `git ls-remote`; `.github/workflows/ci.yml`'s `video-branch` job deletes it (only for a same-repo PR, matching "a branch in a contributor's fork was never in this repo").
- D-216 — ✓ holds (n/a to code): the plan's own note says this is untouched here since `CONTRIBUTING.md` and the PR template are not videos; nothing in the diff contradicts that.
- D-217 — ✓ holds (n/a to code), same reasoning as D-216.
- D-218 — ✓ holds (n/a to code), same reasoning as D-216.

## Unexplained

- none

Counts: Steps 5/5 ✓ · Decisions 33/33 ✓ (3 marked n/a: D-197, D-198, D-199 — outside this diff's file scope) · Unexplained 0 ✗
