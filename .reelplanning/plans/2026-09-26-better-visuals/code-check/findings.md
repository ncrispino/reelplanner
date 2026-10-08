# Code check: 2026-09-26-better-visuals

## Steps
- Step 1 — ✓ carried by `.reelplanning/theme/frame.md` (place-label, artifact, pinned-word components, treatment 7), `templates/reelplanning/theme/blocks/code-diff.html` and `terminal-run.html` (theme-token-only forks), `scripts/frame-lint.mjs` (pinned-word-outside-artifact note), `scripts/check-terms.mjs` (data-artifact/data-gloss handling), `scripts/lib/variety.mjs` + `templates/video/BRIEF.md` (the brief's `- Real things:` line, D-166, never a warning), `skills/plan-to-video/references/style-guide.md` §5 (the many-files map example)
- Step 2 — ✓ carried by `.reelplanning/theme/motion-language.md` (new: camera, reveal verbs, transitions, what stays still), `scripts/frame-lint.mjs` (camera-inside-clipped-view check, question heading/card at-rest-at-scene-end check), `scripts/check-terms.mjs` (real thing's own text glossed in place, block-only splitting), `scripts/scale-only-zoom.mjs` (strips the registry's blur from zoom-through), `scripts/stage-presence.mjs` (ticks no longer credited, only a △), `scripts/lib/variety.mjs` (70% layout/transition warning)
- Step 3 — ✓ carried by `packages/player/fonts/` + `faces.json` (shipped faces), `packages/player/reelplanning-player.js` (`declareFonts`, `--sans`/`--serif`/`--mono`, three solid inks `--ink`/`--ink-2`/`--ink-3`, `--right` marking a quick check's answer, accent only on what waits on you), `scripts/bundle-player.mjs` (copies + preloads the faces), `templates/reelplanning/theme/tokens.html` and `.reelplanning/theme/frame.md` (the darker coral, D-142), `packages/player/test/access.spec.mjs` (asserts the faces load from the page, no family named in the player's own styles, and the contrast ratios)
- Step 4 — ✓ carried by `.reelplanning/system-video/BRIEF.md` and `STORYBOARD.md` (the system video rebuilt once, whole, in the new style: seven chapters/quick checks, `- Real things:` scenes, push-slide/cut/crossfade transitions)

## Decisions
- D-003 — ✓ holds: `.reelplanning/system-video/STORYBOARD.md` is rebuilt once, whole (step 4); nothing in this diff changes when it updates after an accepted walkthrough
- D-005 — ✓ holds: no change to rewind reporting in this diff
- D-021 — ✓ holds: no change to where a detail opens
- D-024 — ✓ holds: no change to detail-page templates
- D-064, D-066, D-082 — ✓ hold: nothing in this diff touches the background-agent loop
- D-065 — ✓ holds: nothing in this diff changes how a system-video comment is acted on
- D-083 — ✓ holds: nothing in this diff changes the one-quick-check-per-step rule
- D-084, D-109 — ✓ hold: `scripts/reel.mjs`'s changed lines are a different part of `audit()` (D-110's block only); these two checks are untouched
- D-085 — ✓ holds: this plan adds one document (`motion-language.md`) and checks, not steps
- D-106, D-107 — ✓ hold: nothing in this diff touches memory or the retro cadence
- D-108 — ✓ holds: `scripts/frame-lint.mjs` still fails a camera/zoom reaching the lowest eighth and a question left moving
- D-109 — ✓ (see D-84 above)
- D-110 — ✓ holds in outcome (a step still stops and asks at its fifth call), but see Unexplained: `scripts/reel.mjs`'s D-110 counting logic was changed by commits outside this plan
- D-127 — ✓ holds: `scripts/frame-lint.mjs` and `.reelplanning/theme/frame.md` pin the glossary's plain word (`data-gloss`) on the real thing, never a re-typed jargon word
- D-128 — ✓ holds: nothing in this diff changes what counts as "watched"
- D-129 — ✓ holds: no quiz-answer-gated `disabled` found on Finish/verdict controls
- D-142 — ✓ holds: `templates/reelplanning/theme/tokens.html`, `.reelplanning/theme/frame.md`, `packages/player/reelplanning-player.js` and `packages/player/index.html` all use `#B8552E`/`#D2693F`, and `packages/player/test/access.spec.mjs` asserts the exact values and contrast ratios
- D-166 — ✓ holds: `scripts/lib/variety.mjs` reads BRIEF.md's `- Real things:` line as a ✓-only report; no scene left out of it is warned about
- D-167 — ✓ holds: cream/coral kept, Reading desk and Tally are gone from `packages/player/reelplanning-player.js` and `scripts/bundle-player.mjs`, `templates/details/*.html` correctly left on the old palette (A10) pending question 2

## Unexplained
- `package.json` — ✗ the license changes from ISC to Apache-2.0 (with `LICENSE`, `SECURITY.md` added, out of this check's file scope) via commit `fb4f6b5`, which also happens to touch `package.json`'s scripts and `files` list in the same diff region as this plan's font/test additions. No step, decision or autonomy row in this plan covers a license change; it reads as an unrelated commit that landed in this range. Suggest: note it belongs to a different, undocumented change, not this plan.
- `scripts/reel.mjs` (also `scripts/test/lifecycle.spec.mjs`, `skills/plan-to-video/SKILL.md`) — ✗ commits `16af905` and `d644b49` change what `reel audit` counts toward D-110's fifth-call stop (a decision already answered in the decision log now also counts as "asked"; calls outside the plan's numbered steps are counted per distinct ask rather than lumped into one step "?"). This plan's own decision log lists D-110 only as untouched ("What stops the walkthrough and the fifth choice: untouched"), and no autonomy row in this plan names either choice. The resulting behavior (D-110's stop-and-ask outcome) still holds, but the specific counting choices are unexplained by this plan.
