# Code check: 2026-09-29-explain-first

## Steps
- Step 1 — ✓ carried by `scripts/lib/explainer.mjs` (shapes, `GUIDE_LINES` size rule, no kinds), `skills/plan-to-video/SKILL.md` ("An explainer": the six principles and the guide rule)
- Step 2 — ✗ nothing in the diff shows "its length" on the Explainer row once it is reviewed; `seconds` is computed for the row but `xrow` in `scripts/bundle-player.mjs` prints only "explained at <commit>, N commits since" and what came of it (the length shows only under Needs you). The rest is carried by `scripts/explain.mjs`, `scripts/lib/explainer.mjs`, `scripts/bundle-player.mjs`, `scripts/review.mjs`, `scripts/lib/length.mjs`
- Step 3 — ✗ nothing in the diff carries "Ask about this answers from the explainer's sources, the glossary and the scene"; only the skill's prose says it, and no code in `packages/player/reelplanning-player.js` or the review server reads `sources.json` for an explainer. The rest is carried by `packages/player/reelplanning-player.js` (`EXPLAINER_ENDS`), `scripts/reel.mjs` (`recordExplainer`), `scripts/reel-intake.mjs`, `scripts/lib/reviews.mjs`, `scripts/check-sources.mjs` (`- decision:` fails)
- Step 4 — ✗ nothing in the diff carries "the plan's row links back to it"; `prow` in `scripts/bundle-player.mjs` is unchanged and only the explainer's row says "planned: <plan>". The rest is carried by `scripts/reel.mjs` (`fromExplainer`, `prereqs`), `scripts/lib/explainer.mjs` (`planQuotes`, `plannedFrom`)
- Step 5 — ✓ carried by `scripts/check-sources.mjs`, `scripts/build.mjs`, `scripts/lib/explainer.mjs` (`privateIn`, `sourceText`), `scripts/lib/fresh-eyes.mjs`, `scripts/fresh-eyes.mjs` (the checker), `.gitignore`, `.reelplanning/.gitignore`, `templates/gitignore`, `templates/reelplanning/gitignore`

## Decisions
- D-001 — ✓ holds: `scripts/lib/fresh-eyes.mjs` (`factChecked`, `rolesFor`) and `scripts/fresh-eyes.mjs` give a fresh agent the narration against the sources, never the author's account
- D-003 — ✓ holds: the system video is untouched; an explainer is its own row and folder (`scripts/bundle-player.mjs`)
- D-005 — ✓ holds: not touched
- D-024 — ✓ holds: a guide part is a detail from the same templates (`sources.json` says `guide`; the storyboard template sets `details_check: strict`)
- D-064 — ✓ holds: not touched (the skill builds it as any video)
- D-065 — ✓ holds: `scripts/reel-intake.mjs` and `packages/player/reelplanning-player.js` file an explainer's review as its own `kind: "explainer"`
- D-066 — ✓ holds: not touched
- D-082 — ✓ holds: nothing in the diff contradicts it (no headless handoff for Plan this or Explain more is added or changed)
- D-085 — ✓ holds: not touched
- D-106 — ✓ holds: `scripts/reel.mjs:recordExplainer` calls `recordYou`
- D-107 — ✓ holds: not touched
- D-109 — ✓ holds: not touched
- D-110 — ✓ holds: not touched
- D-127 — ✓ holds: `packages/player/reelplanning-player.js` (`EXPLAINER_ENDS` labels and sentences are plain words)
- D-129 — ✓ holds: nothing blocks Done, Explain more or Plan this; the missed-checks guard says "or finish as is"
- D-142 — ✓ holds: the Explainer row in `scripts/bundle-player.mjs` uses the existing tokens
- D-166 — ✓ holds: `skills/plan-to-video/SKILL.md` and the brief in `scripts/explain.mjs` leave the real-thing scenes to the brief
- D-167 — ✓ holds: same as D-142, the page's own look
- D-169 — ✓ holds: not touched
- D-170 — ✓ holds: not touched
- D-171 — ✓ holds: not touched
- D-194 — ✓ holds: not touched
- D-195 — ✓ holds: not touched
- D-196 — ✓ holds: not touched
- D-197 — ✓ holds: `skills/plan-to-video/SKILL.md` places a quick check just before the scene that shows it
- D-198 — ✓ holds: not touched; the check still applies to an explainer's checks
- D-199 — ✓ holds: not touched
- D-200 — ✓ holds: `scripts/pr-check.mjs` still gives a PR its plan folder; an explainer is not the walkthrough
- D-201 — ✓ holds: not touched
- D-202 — ✓ holds: not touched
- D-213 — ✓ holds: `.gitignore`, `templates/gitignore` keep the built video out; `scripts/pr-check.mjs` fails media under `explainers/`
- D-215 — ✓ holds: `scripts/pr-check.mjs` still points at `video/pr-<n>`
- D-216 — ✓ holds: `scripts/build.mjs` runs `check-terms` before `check-sources`, unchanged
- D-217 — ✓ holds: the storyboard `scripts/explain.mjs` writes carries `terms_check: strict`
- D-218 — ✓ holds: `scripts/reel.mjs:recordExplainer` adds what was watched and looked up to memory
- D-219 — ✓ holds: not touched
- D-221 — ✓ holds: not touched
- D-222 — ✓ holds: `skills/plan-to-video/SKILL.md` and `scripts/check-sources.mjs` (a `- decision:` fails, a check goes where there is something to predict)
- D-223 — ✓ holds: not touched
- D-224 — ✓ holds: `scripts/bundle-player.mjs` makes the explainer a row of its own kind; the plan rows keep their switch
- D-225 — ✓ holds: `scripts/lib/fresh-eyes.mjs` (`freshEyesState` waits on every finding of every role, the checker's too)
- D-226 — ✓ holds: not touched
- D-227 — ✓ holds: `scripts/lib/fresh-eyes.mjs` (an explainer gets the newcomer and the designer as every video does)
- D-228 — ✓ holds: not touched
- D-229 — ✓ holds: not touched
- D-230 — ✓ holds: not touched
- D-244 — ✓ holds: `scripts/lib/explainer.mjs` (`sourceText` reads the pinned source again, never a retyped copy)
- D-245 — ✓ holds: not touched
- D-246 — ✓ holds: not touched
- D-247 — ✓ holds: not touched
- D-248 — ✓ holds: `scripts/reel.mjs:prereqs` puts the explainer first with a `recap:` line
- D-249 — ✓ holds: `scripts/lib/explainer.mjs` (`pinOutside` keeps the path as `~/…`, hash and line count, never the text); the `.gitignore` files keep the built video out
- D-250 — ✓ holds: `scripts/lib/explainer.mjs`, `scripts/explain.mjs` (sources by form and shape, one size rule, no kinds)

## Unexplained
- `scripts/plan-map.mjs` — ✗ adds `plan-map --thumbs` and moves the thumbnail choice into `scripts/lib/thumbs.mjs` (with `scripts/snapshot.sh`, a `thumbs` spec added to `scripts/test/run.mjs`); this is the first commit, "Plan map thumbnails…", and none of the five steps, a decision or an autonomy row asks for it. Suggest: autonomy row "fix plan map thumbnails after verify, instead of leaving them out of this plan", or split it into its own commit.
- `scripts/explain.mjs` — ✗ the storyboard it starts carries `terms_check: strict` and `details_check: strict` as well as `sources_check: strict`; the plan asks only for `sources_check: strict`, so these two are a default a reviewer could have set the other way. Suggest: autonomy row "terms_check and details_check strict on a new explainer, instead of the project default".
- `scripts/check-sources.mjs` — ✗ warns (fails under strict) on a scene that quotes a thing with no `- source:`, not only on a number (A5 covers numbers only), and it also runs on any non-explainer video whose scenes name a `- source:`; no step, decision or autonomy row covers either. Suggest: autonomy row "a quoted thing with no source is treated like a number with none, and check-sources runs on any video that names a source, instead of numbers only and explainers only".
- `scripts/pr-check.mjs` — ✗ a PR that adds voice, image or video files under `.reelplanning/explainers/` now fails, as it does under `plans/`; the plan only asks `.gitignore` to keep them out. Suggest: autonomy row "pr-check fails media under explainers/, instead of leaving it to .gitignore".
- `packages/player/reelplanning-player.js` — ✗ Finish with no end chosen sets Done even when the reviewer has comments (a plan's Finish goes to Request changes then), and "Ask the agent to explain it again" sets Explain more; neither is in a step, a decision or A8/A9. Suggest: autonomy row "an explainer's Finish defaults to Done, comments or not, instead of Explain more when there are comments".
