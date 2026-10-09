# Code check: 2026-09-27-details-in-the-frame

## Steps
- Step 1 — ✓ carried by `.reelplanning/theme/frame.md`, `templates/reelplanning/theme/frame.md` (`detail-mark`), `scripts/frame-lint.mjs` (marked-thing rules), `scripts/lib/frame-html.mjs` (`hboxOf`, `ownSize`), `scripts/check-details.mjs` (frame-vs-storyboard check), `skills/plan-to-video/SKILL.md` and `references/style-guide.md` §10
- Step 2 — ✓ carried by `packages/player/reelplanning-player.js` (`detailMark:2481`, `syncDetailChip:2495`, `.dmark`/`.dhit` CSS, `hoverDetail:2544`, `tabHop:4867`)
- Step 3 — ✓ carried by `packages/player/reelplanning-player.js` (`openDetail:2564`, `openDetailFrom:2558`, `growDetail:2606`, `homeDetailPanel:2598`, `closeDetail:2617`, `endDetail:2643`) and `skills/plan-to-video/references/style-guide.md` §10 (`detail_why` gains "click the block to read the whole file")
- Step 4 — ✓ carried by `packages/player/reelplanning-player.js:2495` (`syncDetailChip`'s `useChip = !d && ... || !m?.el || m.tooSmall`) and the style guide/SKILL.md text on the chip and `details_check: strict`

## Decisions
- D-004 — ✓ holds: `packages/player/reelplanning-player.js:4114` still plays one summary frame after a pick-all answer; untouched by this diff
- D-005 — ✓ holds: `packages/player/reelplanning-player.js:2643` (`endDetail`) keeps "opening a detail is not a rewind," now with the `from` field alongside it
- D-023 — ✓ holds: out of scope (components `diff`, `implement-step`); nothing in this diff touches what code a walkthrough shows
- D-024 — ✓ holds: `skills/plan-to-video/references/style-guide.md` "Start from a template" line is unchanged; page construction is untouched
- D-064 — ✓ holds: untouched; no file in this diff concerns the background agent loop (components: `finish`)
- D-066 — ✓ holds: untouched (components: `finish`)
- D-082 — ✓ holds: untouched (components: `skill, cli, player, system-video, action`; no auto-mode/sandbox code in this diff)
- D-083 — ✓ holds: `skills/plan-to-video/references/style-guide.md` §7 ("The same number of checks, so the video is no longer") — D-197–199's retiming keeps one check per step
- D-084 — ✓ holds: untouched (components: `skill, cli, player, system-video, action`; no stop/tag logic in this diff)
- D-085 — ✓ holds: `.reelplanning/theme/frame.md:82-86` (one attribute, `data-detail`) and `skills/plan-to-video/SKILL.md` (one front-matter line, `details_check: strict`); no new stage
- D-106 — ✓ holds: untouched (components: `skill`)
- D-107 — ✓ holds: untouched (components: `skill`)
- D-109 — ✓ holds: untouched (components: `cli, finish, player, skill`; this plan's new fail/warn in `check-details.mjs` is about a mismatched name, not a miss with no tags)
- D-110 — ✓ holds: untouched (components: `skill`)
- D-127 — ✓ holds: `packages/player/reelplanning-player.js:2495` — the tab reads plain "Open · <title>", never a new term
- D-129 — ✓ holds: untouched (components: `skill, system-video`)
- D-142 — ✓ holds: `packages/player/reelplanning-player.js` `.dhit` rules use `var(--accent)` / `var(--accent-rgb)`, no new hex literal
- D-166 — ✓ holds: untouched (which scenes show the real thing is a brief concern, not touched here)
- D-167 — ✓ holds: the new `.dmark`/`.dhit`/`.dpanel.over` CSS uses the page's existing tokens; no look change
- D-169 — ✓ holds: untouched (components: `skill, system-video`)
- D-171 — ✓ holds: untouched (components: `cli, skill, system-video`)
- D-194 — ✓ holds: `packages/player/reelplanning-player.js:2495` — the tab shows the whole time the thing can be clicked, not just on hover
- D-195 — ✓ holds: `packages/player/reelplanning-player.js:2564` (`openDetail`), `2598` (`homeDetailPanel`), `2606` (`growDetail`) — the page grows into the stage's own box and shrinks back into what opened it
- D-196 — ✓ holds: `packages/player/reelplanning-player.js:2495` — `useChip` is true only where nothing is marked or the marked thing is too small on a phone

## Unexplained
- `packages/player/reelplanning-player.js` — ✗ own-words fields (the comment line, "Expected something else?", your own answer, a call's own words, the record's editor) change from single-line `input` to a wrapping, growing, scrolling `textarea` (`fitField` at `reelplanning-player.js:2477`, `keepLines` at `:1263`, plus matching CSS and `packages/player/test/own-answer.spec.mjs`, `revisit.spec.mjs`, `size.spec.mjs`, `own-answer.spec.mjs`). This is commit `6d9c869`, an owner-requested fix unrelated to details-in-the-frame; no step, decision or autonomy row covers it. Suggest: an autonomy row (or its own decision) naming the change from `input` to a capped, scrolling `textarea`.
- `packages/player/test/answer-on-frame.spec.mjs` — ✗ adds a sharding scheme for the full test pass (`UNITS` table of measured times, `--shard`/`--units` flags, a longest-first bin-packing `dealt()`), from commit `a705562`. It touches none of this plan's code and isn't named by any step, decision or autonomy row. Suggest: an autonomy row noting the sharding approach and its defaults (4 shards, longest-first packing), or leave it for its own plan.
