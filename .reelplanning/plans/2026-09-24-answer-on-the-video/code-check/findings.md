# Code check: 2026-09-24-answer-on-the-video

## Steps
- Step 1 — ✓ carried by `packages/player/reelplanning-player.js` (`frameCards`, `renderHits`, `syncHits`, `.hits`/`.hit` CSS), `skills/plan-to-video/SKILL.md`, `skills/plan-to-video/references/style-guide.md` §6, `scripts/reel.mjs`, `templates/reelplanning/theme/stages/dataflow.html` (`data-option="a"` scaffolding)
- Step 2 — ✓ carried by `packages/player/reelplanning-player.js` (`detectBand`, `placeBand`, `.bandroom`/`--band-k`/`--band-min`, `.decision.band` CSS, `syncBand`, `fold`/`placeCard`), `templates/reelplanning/theme/frame.md` ("The answer band"), `skills/plan-to-video/references/style-guide.md` §6–7, `skills/plan-to-video/SKILL.md`
- Step 3 — ✓ carried by `packages/player/reelplanning-player.js` (`answerEditor`, `changeAnswer`, `.redit` CSS, `renderAutonomy`/`data-reverdict`, `changeVerdict`, `syncResend`/`.resend`)
- Step 4 — ✓ carried by `packages/player/test/answer-on-frame.spec.mjs` (`playThrough` click-driven, light/dark/phone, `checkBand`, Finish-panel export assertions); narrowed from "every video on the review page" to four, per the logged deviation D1
- Step 5 — ✓ carried by `packages/player/reelplanning-player.js` (`startWait`, `_freshAnswer`, `bandHeld`, `backToExplained`, `explainedAt`, `noteRewind`, `tickDecisions`), `scripts/plan-map.mjs` (`explainedFrame`)

## Decisions
- D-004 — ✓ holds: `packages/player/reelplanning-player.js:2496` (`confirmMulti`) still plays one summary frame for a pick-all answer, unchanged
- D-005 — ✓ holds: `packages/player/reelplanning-player.js:2073` (`backToExplained` → `noteRewind`) sends its jump as a rewind, same path as manual scrub/seek; editing a record answer seeks nothing and sends none
- D-021 — ✓ holds: the side-panel/detail code (`openDetail`, `.dpanel`, `packages/player/test/details.spec.mjs`) is outside this diff's file scope, untouched
- D-024 — ✓ holds: detail templates (`templates/details/`) are outside this diff's file scope, untouched
- D-082 — ✓ holds: sandbox/auto-mode logic in `scripts/` is untouched beyond `scripts/reel.mjs`'s decision-stub attribute and `scripts/plan-map.mjs`'s `explained_at`
- D-083 — ✓ holds: quick checks answer on the frame the same way decisions do (`frameCards`/`answerOnFrame`) and now wait/rewind per step 5 (`startWait`)
- D-084 — ✓ holds: a stopping call's Accept/Flag live in the band (`packages/player/reelplanning-player.js` `askAutonomy`, `openCard` `kind==="call"`)
- D-085 — ✓ holds: a new frame needs exactly two attributes — `data-option="a"` (step 1) and `data-band="bottom"` (step 2) — per `style-guide.md` §6–7 and `frame.md`, nothing more
- D-106 — ✓ holds: memory's home-file logic (`scripts/lib/memory.mjs` etc.) is outside this diff's file scope
- D-107 — ✓ holds: retro-timing logic is outside this diff's file scope
- D-108 — ✓ holds: the band sits under or beside the video, never over it, at reading size (`placeBand`/`detectBand`, `.decision.band` CSS in `packages/player/reelplanning-player.js`)

## Unexplained
- none
