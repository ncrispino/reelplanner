# Code check: 2026-09-25-videos-you-can-follow

(A fresh read-only checker, with no access to the implementer's conversation, read the brief and the
working tree against e7d6064. It could not write files; its answer is saved here as given.)

## Steps
- Step 1 — ✓ carried by `.reelplanning/glossary.md` and `templates/reelplanning/glossary.md` (the "On screen" column), `scripts/lib/terms.mjs` (`parseGlossary`, `rowFor`, `definingBeats`, `definesIndex`, `addAccess` → `definedIn`), `scripts/terms-index.mjs` with `.reelplanning/terms-index.json`, `scripts/finish-project.sh:42`, `scripts/check-terms.mjs` section 3, `scripts/reel.mjs` `systemVideoStatus` and `scripts/spec-diff.mjs`, the system video's script, storyboard and frames, and SKILL.md "A new plan" step 3 with style guide §4. The click in the captions belongs to the player (Needs the player 1–2).
- Step 1 — ✗ nothing in the diff carries "the system video covers … a step … and Finish": neither has a glossary row or a `- defines:` scene ("decision log" is defined in frame 9 without a row), so the new build check does not hold the system video to them.
- Step 2 — ✓ carried by `scripts/reel.mjs` `prereqs`, `scripts/lib/terms.mjs` `parseBefore`, `scripts/lib/memory.mjs` `watchedOf`/`youKnows`, `record` and `reel-intake.mjs` (D-128), SKILL.md "Build a video" step 2, style guide §2, `docs/project-dir.md`. The card's ticks and skipping newcomer scenes belong to the player (Needs the player 4–6).
- Step 3 — ✓ carried by `scripts/lib/memory.mjs` (`lostOf`, the `lost` line, the `lost:word:` signal, `lostWords`), `scripts/reel.mjs` (`record`, `memory --you`, `retro`), `scripts/lib/review-scope.mjs:197-199`.
- Step 3 — ✗ nothing carries "so the skill stops explaining words you know, in any repo"; SKILL.md:40 only says to read the watched videos and looked-up words through `--you`, and never tells the author to drop an explanation the reviewer already knows.
- Step 4 — ✓ carried by `scripts/check-terms.mjs` section 4, SKILL.md (the quick-check row, build step 4), style guide §7, and the system video's five checks.

## Decisions
- D-003, D-005, D-021, D-024, D-064, D-065, D-066, D-082, D-083, D-084, D-085, D-106, D-107, D-108, D-109, D-110, D-128 — ✓ hold (see the checker's notes: D-110 — if the unexplained items get rows, step 1 reaches five).
- D-127 — ✗ broken in a few frames: `.reelplanning/system-video/compositions/frames/23-code-2.html:89` still shows "the call log" (frame 23 defines label and off-plan change), and `24-code-3.html:108,113` and `22-code-1.html:113` show "tags in brackets" and "a tag's streak counts across plans" on screen.
- D-129 — ✓ holds; one small gap: `lostOf` (memory.mjs:69) reads only `rv.verdict`, while `actOnMarkdown` uses `verdictOf`, which also accepts an `approve` annotation.

## Unexplained
- `skills/plan-to-video/SKILL.md`, `references/style-guide.md` — ✗ the player redesign's authoring rules (`data-question`, `data-call` cards, `question_more`, `option_a_more`, `option_a_why`, "nothing sits in a bar under or over the video") are in these files but no row of this plan covers them; the style guide's "nothing sits in a bar under … the video" contradicts the glossary's answer-bar row ("else under the video").
- `scripts/check-terms.mjs` (section 3, `unsaid`) — ✗ a system-video scene that defines a row but never says its word only warns.
- `.reelplanning/terms-index.json` — ✗ it indexes the fewer-better-stops walkthrough's uncommitted rebuild, which this plan's diff does not carry.

Counts — Steps: ✓ 4, ✗ 2 · Decisions: ✓ 18, ✗ 1 · Unexplained: ✓ 0, ✗ 3
