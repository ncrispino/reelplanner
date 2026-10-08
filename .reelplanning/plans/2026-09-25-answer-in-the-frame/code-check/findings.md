# Code check: 2026-09-25-answer-in-the-frame

(A fresh read-only checker, with no access to the implementer's conversation, rebuilt the brief's inputs
by hand — plan.md, walkthrough.md, the cited ledger entries and `git diff e7d6064..660d34f` on
packages/player, scripts/plan-map.mjs, skills/plan-to-video, templates/reelplanning/theme — and answered
in the brief's shape. Saved here as given.)

## Steps
- Step 1 — ✓ carried by `packages/player/reelplanning-player.js` openCard ("onframe"/"band"/"sheet"), onframeRoom, frameCallCards/callCardsIn, placeCard, placeLayer, layoutFrame, cardWhys, detectBand/placeBand "frame", the `.decision.onframe` CSS; `templates/reelplanning/theme/frame.md`; SKILL.md (Build a video 3, Implement 5); style guide §6, §8.
- Step 2 — ✓ carried by renderHits (More per card, "Full question"), frameHeading, moreHtml (no answer before a quick check is answered), openMore/closeMore, hoverMore (450 ms), `.fpop`; `scripts/plan-map.mjs` (questionMore, option `more`, a quick check's option `why`); SKILL.md tag table; style guide §6, §7, §11.
- Step 3 — ✓ carried by PLAIN, plain(), shown()/termName, the renames; wireCaptions, termAtPoint; whereExplained; `confusion.termsLookedUp`; `watched`; the "familiar" default; `packages/player/index.html` `?t=`.

## Decisions
- D-001, D-004, D-005, D-021, D-024, D-064, D-066, D-082, D-083, D-084, D-085, D-106, D-107, D-109, D-110, D-128, D-129 — ✓ hold.
- D-127 — ✗ broken: `reelplanning-player.js:2192` renderDetailCall shows "The agent's call:"; `:3725` the record's rows have "Open this call on the video", "Copy this call as one line of text", `aria-label="Copy this call"`.

## Unexplained
- `reelplanning-player.js:1885` — ✗ showTerm pauses the video for any word opened, including one underlined in the player's own text; the plans and A16 say a caption word pauses it.
- `reelplanning-player.js:4032` — ✗ a click on a choice's card (`.cring`) opens its More; no row names it.
- `reelplanning-player.js:1094-1097`, `:1051` — ✗ misplaced comments (GLOSS_SKIP's comment on the PLAIN line; a second comment on `.stage.overterm`).

Counts — Steps: ✓ 3, ✗ 0 · Decisions: ✓ 17, ✗ 1 · Unexplained: ✓ 0, ✗ 3

Outside the diff: `.reelplanning/decisions.json` still lists D-108 active although this plan supersedes it; walkthrough.md's "not committed" and "No code check" lines are stale.
