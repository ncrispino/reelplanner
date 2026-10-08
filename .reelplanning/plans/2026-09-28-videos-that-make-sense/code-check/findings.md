# Code check: 2026-09-28-videos-that-make-sense

## Steps

- Step 1 — ✓ carried by `scripts/fresh-eyes.mjs`, `scripts/lib/fresh-eyes.mjs` (briefs, `--prompt newcomer|designer`, per-scene picture + narration, nothing from the plan given to either role, `lostBefore` from `scripts/lib/memory.mjs` fed to the newcomer, per-scene `stamp.json`), `packages/player/reelplanning-player.js` (screenshot capture path via the review page), `scripts/test/fresh-eyes.spec.mjs`
- Step 2 — ✓ carried by `scripts/lib/fresh-eyes.mjs` (`answerProblem`, `hasMeaning`, `freshEyesState`, the round-archiving logic capped at 3), `scripts/verify.sh` (runs `fresh-eyes --check`, fails only on an unanswered/bad finding), `scripts/build.mjs` (surfaces the fresh-eyes line), `scripts/plan-map.mjs` (`leftAfter` → `freshEyes`), `packages/player/reelplanning-player.js` (`freshLeft`/`freshLeftHtml` on Before you watch), `scripts/lib/notify.mjs` (`waitingLine`)
- Step 3 — ✓ carried by `packages/player/reelplanning-player.js` (`openAsk`, `captionAtPoint`, `renderAsk`, `askClaude`, `askPrompt`, `splitFrom`, `askLocal`, `exportPayload`), `scripts/review.mjs` (`handleAsk`, `/api/ask`), `scripts/lib/inbox.mjs` (`writeQuestion`, `waitingQuestions`, `answerQuestion`), `scripts/inbox.mjs` (`answer`), `scripts/plan-map.mjs` (scene narration for question-answering), `scripts/lib/memory.mjs` (`lostOf`, `memoryLines`), `docs/hosted-review.md`, `packages/player/test/ask.spec.mjs`, `scripts/test/loop.spec.mjs`
- Step 4 — ✓ carried by `skills/plan-to-video/references/style-guide.md` (the seven rules under §5, and the §11 checklist bullet), `scripts/frame-lint.mjs` (rule 1 "bar" detection, rule 5 `placeOf`/40px band), `scripts/test/visuals.spec.mjs`, `templates/reelplanning/theme/stages/layout.html` and `pipeline.html` (real words replacing the three-bar cards)
- Step 5 — ✓ carried by `skills/plan-to-video/SKILL.md` ("Build a video" step 5, the fresh-eyes loop between `build` and opening the page; "a rebuild is a new build"), `scripts/fix-clip-durations.mjs` (restamps a frame's root and full-length layers to its `index.html` slot), and `.reelplanning/system-video/fresh-eyes/` (three full rounds run, 93 findings — 17 fixed, 3 given a meaning, 73 kept — matching the commit message exactly; scene ids unchanged before/after)

## Decisions

- D-001 — ✓ holds: `scripts/fresh-eyes.mjs`'s briefs and `--prompt` isolation follow `scripts/code-check.mjs`'s pattern, as the plan asks
- D-003 — ✓ holds: not touched by this diff's code; the system video's fresh-eyes findings were fixed like any comment that flags it unclear (`.reelplanning/system-video/fresh-eyes/`)
- D-005 — ✓ holds: not touched (no rewind-related file in the diff)
- D-024 — ✓ holds: not touched (no detail-page-authoring file in the diff)
- D-064 — ✓ holds: the two fresh agents are launched by the building session, per `skills/plan-to-video/SKILL.md`'s "Build a video" step 5, not from inside any script
- D-065 — ✓ holds: consistent framing only; no contradicting code found
- D-082 — ✓ holds: `handleAsk` in `scripts/review.mjs` never starts a headless run when a question arrives with nobody waiting — confirmed by `scripts/test/loop.spec.mjs`'s assertion that no `inbox/questions` dir is created in that case
- D-085 — ✓ holds: not touched (no scaffolding-removal file in the diff)
- D-106 — ✓ holds: `scripts/lib/memory.mjs`'s `watchedOf`/home-folder file logic is unchanged; the diff only adds `lostBefore`/`lostOf`
- D-107 — ✓ holds: not touched (no retro-cadence file in the diff)
- D-109 — ✓ holds: `findMisses`/tag logic in `scripts/lib/memory.mjs` is untouched by this diff
- D-110 — ✓ holds: per `walkthrough.md`'s own count (steps 1–5 reached four, three, four, two and zero calls); not independently checkable from the diff, since it is a process claim, not a code artifact
- D-127 — ✓ holds: the newcomer brief in `scripts/fresh-eyes.mjs` tests whether the *sentence* around a plain phrase is understood, not just whether a jargon word was swapped
- D-128 — ✓ holds: `scripts/lib/memory.mjs`'s watched-state code is unchanged by this diff
- D-129 — ✓ holds: fresh eyes gates the build before the page opens; `packages/player/reelplanning-player.js`'s Approve/Finish-panel logic is untouched, and nothing gates on `this.questions`
- D-142 — ✓ holds: Ask about this's CSS reuses the existing `--accent` coral token (`packages/player/reelplanning-player.js`); no new color variable added
- D-166 — ✓ holds: step 4's rule 1 (style-guide.md) is written as "never a stand-in," not as "only brief-picked scenes may show the real thing" — no contradiction
- D-167 — ✓ holds: the Ask panel/button reuse the existing Terms-panel markup and styling; no redesign
- D-169 — ✓ holds: not touched (no review-order file in the diff)
- D-170 — ✓ holds: not touched (no rubric/judging file in the diff)
- D-171 — ✓ holds: `scripts/renumber.mjs` is unchanged by this diff
- D-194 — ✓ holds: Ask about this opens in the side panel, not laid over the frame; the Open-tab code is untouched outside frame-lint's new rule 5
- D-195 — ✓ holds: no contradiction — Ask uses the same side panel Terms/details already use; "over the frame, from the block" detail-opening code is untouched
- D-196 — ✓ holds: no `detailMark`/corner-chip code touched anywhere in this diff
- D-197 — ✓ holds: not touched (`scripts/check-terms.mjs` unchanged); the newcomer's brief reads checks as a viewer would, per plan text
- D-198 — ✓ holds: not touched, same file
- D-199 — ✓ holds: question 3 (D-227) follows the same "new videos, and now" shape D-199 set for quick checks
- D-200 — ✓ holds: not touched (`scripts/pr-check.mjs` unchanged)
- D-201 — ✓ holds: not touched, same file
- D-202 — ✓ holds: not touched, same file
- D-213 — ✓ holds: the fresh-eyes pictures (`fresh-eyes/shots/`) are kept out of git via `.reelplanning/.gitignore` and `templates/reelplanning/gitignore`, consistent with "a plan folder carries only its videos' text"
- D-215 — ✓ holds: not touched (no PR-video-branch file in the diff)
- D-216 — ✓ holds: `scripts/lib/jargon.mjs` and `scripts/check-terms.mjs` are unchanged by this diff
- D-217 — ✓ holds: same file, unchanged
- D-218 — ✓ holds: the underline-until-known code path in `packages/player/reelplanning-player.js` is unchanged; a `meaning`-answered phrase rides the same mechanism
- D-219 — ✓ holds: not touched (no walkthrough-video-replacement file in the diff)
- D-221 — ✓ holds: `verdict === "listed"` handling in `scripts/lib/memory.mjs` is untouched by this diff
- D-222 — ✓ holds: not touched; a walkthrough video gets fresh eyes like any other, per SKILL.md's step 5 text
- D-223 — ✓ holds: `scripts/pr-check.mjs` is unchanged
- D-224 — ✓ holds: no Plan/Built-switch code touched in `packages/player/reelplanning-player.js`
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs`'s `freshEyesState` only hard-fails the build (`state: "open"`) on a finding with no answer or a bad one; `scripts/verify.sh` exits 1 only in that case
- D-226 — ✓ holds: a `meaning` answer is checked against the glossary/`terms:` (`hasMeaning`), and Ask about this is fully implemented (`packages/player/reelplanning-player.js`, `scripts/review.mjs`, `scripts/lib/inbox.mjs`); option C's "in plain words" sentence was not built anywhere in the diff or the wider repo
- D-227 — ✓ holds: `skills/plan-to-video/SKILL.md`'s "Build a video" step 5 runs fresh eyes on every new video and every rebuild; the system video was in fact checked now, three full rounds, in `.reelplanning/system-video/fresh-eyes/`

## Unexplained

- `packages/player/reelplanning-player.js:5708` — ✗ the review's exported `questions[]` carries two fields A11 doesn't mention: `id` (the client-side question id, `ask-<timestamp>`) and `answeredAt` (set when a question is answered, `reelplanning-player.js:2608,2669`). `exportPayload`'s destructure `{ status, askId, ... }` strips `status` and `askId`, but the field the question object actually carries is named `id`, not `askId`, so `id` is not stripped and lands in the exported record alongside `answeredAt`. Harmless (an id and a timestamp), but A11's stated shape is `{ question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, note? }` and doesn't cover either field, and the stripped-field name mismatch (`askId` vs. the real `id`) looks like it may not be doing what it was meant to.
- none else: every other file touched by this diff traces to a step, a decision, or an autonomy-log row (A1–A13, m1–m7) — including the derived-data churn (`caption_groups.json`, `audio_meta.json`, `audio_engine_meta.json`, `terms-index.json` timestamps, and `compositions/captions.html`'s already-current-generator backtick-stripping in the word/code-chip renderer), which is fallout of rebuilding the system video's re-voiced scenes (8, 29, 35), not a new choice made in this diff.
