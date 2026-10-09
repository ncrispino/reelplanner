# Code check brief: 2026-09-25-videos-you-can-follow

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-25-videos-you-can-follow/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-25-videos-you-can-follow

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (e7d6064..HEAD, limited to scripts/lib/terms.mjs scripts/check-terms.mjs scripts/terms-index.mjs scripts/finish-project.sh scripts/spec-diff.mjs scripts/reel.mjs scripts/reel-intake.mjs scripts/lib/memory.mjs scripts/lib/review-scope.mjs scripts/test/terms.spec.mjs scripts/test/lifecycle.spec.mjs scripts/test/memory.spec.mjs skills/plan-to-video docs/project-dir.md templates/reelplanning/glossary.md .reelplanning/glossary.md .reelplanning/terms-index.json .reelplanning/system-video/STORYBOARD.md .reelplanning/system-video/SCRIPT.md .reelplanning/system-video/compositions .reelplanning/plans/2026-09-25-videos-you-can-follow/plan.md)

```
(none)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-25-videos-you-can-follow/plan.md` in full. Its title is "Videos you can follow", with 4 steps.

## The decisions that apply

- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-108** (step 2) Where do the answers the frame can't take go? → **i like the pricnicple of A, not messing w video, but we probably need it to be bigger. if we can design videos in a way where this bar is larger and more graceful in the video that might be best?**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn` [hard-to-undo] | a separate mapping file; or `display` on every row | one table stays the one list of names ("the glossary lists both", D-127), and the player already reads `glossary[]` | `.reelplanning/glossary.md`, `scripts/lib/terms.mjs` `parseGlossary`, `addAccess` |
| A2 | 1 | Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area [visible, close] | only the six D-127 names; or "part" for an area | the plan's own words for the first two; "part of the system", so an older video's "Part two" is never underlined as a piece of the system | `.reelplanning/glossary.md` (On screen column) |
| A3 | 1 | The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first [hard-to-undo] | a list inside every plan map; or worked out by the player | one file every tool reads (`reel prereqs`, the plan map's `definedIn`), rebuilt on every build | `scripts/terms-index.mjs`, `scripts/finish-project.sh`, `scripts/lib/terms.mjs` `definesIndex` |
| A4 | 1 | The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story [visible] | rename only the defining scenes; or let it run past eight minutes | D-127 is what you see and hear; the budget is the system video's | `.reelplanning/system-video/SCRIPT.md` lines 16, 19 and 32; `compositions/frames/18-review-loop.html`, `30-rule-log.html` |
| A5 | 2 | `reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie [close] | the parts touched alone | every chapter shows the review player or the reel CLI, so parts alone picked "why a video" for most plans; words pick the build loop for fewer-better-stops, the plan's example | `scripts/reel.mjs` `prereqs` |
| A6 | 2 | A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video [close] | every id cited; or the newest plan first | plans list "unchanged; not touched here" decisions for completeness, not because the video leans on them; this gives the plan's example, the revise-loop video for fewer-better-stops | `scripts/reel.mjs` `prereqs` |
| A7 | 2 | `reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too [visible] | print only, for the author to paste | the plan says the author no longer guesses; the files keep their names (D-127) | `scripts/reel.mjs` `prereqs`, `scripts/lib/terms.mjs` `parseBefore` |
| A8 | 3 | `lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest [visible, close] | `lost` replacing `checks`, keeping five lines | D-115, an accepted call, names the five ids with `checks` among them, and the plan asks for a new line; the memory plan's "at most five" was written before there was a sixth thing to say | `scripts/lib/memory.mjs` `LINES`, `memoryLines` |
| A9 | 3 | Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule [hard-to-undo] | a count only (today's `termsOpened`); or only the reviewed video | three reviews looking up one word needs the word; D-128 needs the browser's list to reach your file | `scripts/lib/memory.mjs` `lostOf`, `watchedOf`; `scripts/reel.mjs` `record`; `scripts/reel-intake.mjs` |
| A10 | 3 | What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line [close] | a memory line of its own | memory's lines say what reviews show about plans; this is what you know | `scripts/reel.mjs` `memory`, `prereqs`; `scripts/lib/memory.mjs` `youKnows` |
| A11 | 4 | "The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning [close] | an exact phrase; or any scene before the check | it catches the plan's example (fewer-better-stops' "Twice") without asking for the answer's exact words | `scripts/check-terms.mjs` (section 4) |
| A12 | 4 | The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…") [close] | `explain` and `walk_me_through` | the plan asks for `explain`'s reason in words; a walk-through works the case, and the bare-id rule still holds for what is said | `scripts/check-terms.mjs` (section 4) |

## The diff

Read it yourself: `git diff e7d6064 -- scripts/lib/terms.mjs scripts/check-terms.mjs scripts/terms-index.mjs scripts/finish-project.sh scripts/spec-diff.mjs scripts/reel.mjs scripts/reel-intake.mjs scripts/lib/memory.mjs scripts/lib/review-scope.mjs scripts/test/terms.spec.mjs scripts/test/lifecycle.spec.mjs scripts/test/memory.spec.mjs skills/plan-to-video docs/project-dir.md templates/reelplanning/glossary.md .reelplanning/glossary.md .reelplanning/terms-index.json .reelplanning/system-video/STORYBOARD.md .reelplanning/system-video/SCRIPT.md .reelplanning/system-video/compositions .reelplanning/plans/2026-09-25-videos-you-can-follow/plan.md` (from the repository root). The files it touches:

```
Nothing is committed yet: the diff is the working tree against e7d6064. Two files are new and untracked,
so `git diff` does not show them; read them whole: scripts/terms-index.mjs and .reelplanning/terms-index.json.

```
