# Walkthrough: Videos you can follow

**Status:** implemented on branch `claude/clever-knuth-b5gtcf`, not committed · **Plan:** `plan.md` (the owner's review, `reviews/plan-20260925T212252Z.md`, folded into its steps) · **Started from:** `e7d6064` · **Question 1:** A, plain words on screen, the files keep theirs (D-127), with the owner's note: simple language in plans too · **Question 2:** A, "watched" in this browser, and in your file when a review is sent (D-128) · **Question 3:** A, approving is never blocked; it is recorded (D-129) · **Split:** another worker owns the review player (`packages/player/reelplanning-player.js`) and every word it shows; what this plan needs from it is under "Needs the player"

## What was done, per step

First the owner's review was folded into `plan.md`'s steps as text (no new plan video): step 1 says what
D-127 means (what you see and hear says choice, label, accepted in a row, late fix, chapter and scene; the
files keep their names; the glossary lists both), and carries the owner's note as a rule for plans too;
step 2 says where "watched" is kept (D-128); step 3 says an approval with checks missed never blocks (D-129).

### Step 1 — Every word is explained once, in the system video, and one click away ✅ (the click is the player's)

- **Plain words on screen, the glossary lists both (D-127).** `.reelplanning/glossary.md` has an **On
  screen** column (A1, A2): choice (a call), label (a tag), accepted in a row (a streak), late fix (a miss),
  scene (a beat), off-plan change (a deviation), grouped scene (a grouped beat), answer bar (the answer
  band), part of the system (an area). Chapter is already the term. The rows these rename now say what they
  mean in the plain words (the player shows the meaning), and the table's opening says which name goes
  where. `templates/reelplanning/glossary.md` (a new repo's) has the column too.
- **The format the player reads** (`scripts/lib/terms.mjs` `parseGlossary`, `addAccess`; A1). Each row of a
  plan map's `glossary[]` is `{ term, id?, meaning, forms, display?, definedIn? }`:
  - `display`: the on-screen word, only where the row has one ("choice" for "A call"); otherwise show `term`.
  - `forms`: every way the row is said, the term's first (`forms[0]` is its key, unchanged), then the
    on-screen word's (`["call", "choice"]`), so a caption saying either can be underlined.
  - `definedIn`: where it is explained, the system video's scene first:
    `{ video: "system", frame: 25, title, start: 312.4, chapter: 4, chapterTitle: "The build loop" }`
    (`start` in seconds of that video, once it is built; `video` is the review page's name for it).
- **The system video is the grounding contract.** `scripts/check-terms.mjs` (run first by `reelplanning
  build`) fails a `kind: system` storyboard while a glossary row has no scene tagged `- defines: <term>`
  (the term or its on-screen word), by name: "✗ the system video: streak has no beat". A defining scene
  that says neither the term nor its on-screen word is a △ line. `reel status` (`scripts/reel.mjs`
  `systemVideoStatus`) says the system video is behind glossary.md while a row has no defining scene,
  however recent its build ("no beat explains sweep"), and `scripts/spec-diff.mjs` keys glossary rows by
  term (not only those with a `system.json` id), lists "words no beat explains yet", and names the scene
  that defines a row whose meaning changed.
- **The repo-wide list of which video explains each word** (A3): `scripts/terms-index.mjs`, run by
  `scripts/finish-project.sh` after the plan map, writes `.reelplanning/terms-index.json` (word → the
  videos and scenes that define it, the system video first) and says which rows no system-video scene
  defines. The plan map's `definedIn` comes from the same list (`definesIndex`).
- **The system video, rebuilt** (A4). Every one of the glossary's 40 rows has a defining scene, said in its
  plain word; new or reworded lines in 26 of its 37 scenes, the frames' own words changed where they show
  the old ones ("Chapter 2 of 5", "Choice A18", "Question 1", "Labels", "accepted 10 in a row"), and its
  five quick checks now have a walk-through and an `explained_at`. New definitions: a scene (frame 2), the
  answer bar (3), the agent's own choices (4), a label and an off-plan change (23), `reel stops`, accepted
  in a row, a choice's number, the grouped scene (25), a late fix and a retro (28). Length: see "The system
  video, as built" below.
- **Words in the captions can be clicked**: the player's (Needs the player, 1–3).

### Step 2 — The tool picks what to watch first ✅ (the ticks and the newcomer scenes are the player's)

`reel prereqs <plan-dir> [--walkthrough] [--dry-run]` (`scripts/reel.mjs` `prereqs`) writes the video's
`before:` lines into its storyboard's front matter, replacing the ones there (A7):

- **The system video, always**, by its chapter whose scenes say most of what the plan's steps say (A5).
- **Up to two earlier plans' videos** whose decisions this plan builds on ("Decisions in force" and
  "Supersedes", not a bullet that says "not touched"), or whose video alone defines a word this video says
  (from the terms index); a decision on a call points at that plan's walkthrough video (A6).
- **The recap scene** (`- knowledge: new`) sums up every earlier video the plan builds on, the ones on the
  card included, one plain line each: `reel prereqs` writes a `recap:` line for each (changed after the
  owner's review of quick check k2; it named only the ones past two, A7).
- Beside each line it says "(your file: watched)" when your file across repos has that video (D-128).

On the plan's example, fewer-better-stops: `before: system#part 4 | the build loop, …`, then
`2026-09-22-m3-revise-loop | decisions D-084, D-083: …` (the streak of ten), then memory; the recap lines
name those two and answer-on-the-video and close-the-lifecycle. `before: <video>#chapter N` is read as `#part N`
(`parseBefore`). The skill's "Build a video" step 2 and the style guide §2 say to run it instead of guessing.

### Step 3 — The tool remembers where you got lost ✅

- **Memory's `lost` line** (`scripts/lib/memory.mjs` `memoryLines`, `lostOf`; A8), per plan: the quick
  checks answered wrong, the explanations opened, the words looked up and the approvals given with checks
  missed. On this repo: "Lost most in m3-revise-loop (3 of 5 checks wrong), memory (3 of 11 checks wrong,
  approved anyway), fewer-better-stops (3 of 3 checks wrong, approved anyway); 2 words looked up, 3
  approvals with checks missed." `reel memory lost` has the evidence, a line per review. It is a sixth
  line, beside `checks` (12 of 40 answered wrong).
- **The same word looked up in three reviews is a signal** (`signals`, `lostWords`; D-124): it counts toward
  a retro, and `reel retro`'s draft lists the word under "Words looked up in three reviews or more", to
  rewrite its scene in the system video or its glossary row (D-065 says how).
- **Your file across repos (D-106, D-128)**: each review's summary in `~/.reelplanning/you.jsonl` now
  carries `lost` (with the words looked up) and `watched` (A9): the reviewed video when 80% of it was
  seen, and the videos the browser sent as watched, on the review or on the hosted row beside it
  (`scripts/reel.mjs` `record`, `scripts/reel-intake.mjs`). `reel memory --you` ends with the videos
  watched and the words looked up (A10); `reel prereqs` reads the same.
- **An approval with checks missed is recorded, never blocked (D-129):** the review's what-to-act-on file
  says "Approved with 2 of 3 quick checks missed: recorded, not blocked (D-129)"
  (`scripts/lib/review-scope.mjs` `actOnMarkdown`), and the `lost` line counts it.

### Step 4 — Quick checks test the main idea, on the case just shown ✅

- **The rules** in `skills/plan-to-video/references/style-guide.md` §7 and the skill's tag table: the same
  names and numbers as the scene before it; `explain` gives the reason in words, never an id; a
  `walk_me_through` on every check, on that case; `explained_at` names the scene that shows the answer.
- **The build** (`scripts/check-terms.mjs`, section 4): a check with no `walk_me_through` fails; a right
  answer whose words the `explained_at` scene (else the scene before) never says or shows is a △ line (A11);
  an id in `explain` is a △ line (A12). On the plan's own example it fires: fewer-better-stops' first check,
  "Twice: … D1 has its own", uses "twice", never said in the scene it names.

### The owner's note on plans ✅

`skills/plan-to-video/SKILL.md` "A new plan" step 3: plain words, one idea a sentence, no more complicated
than it needs to be, the glossary's on-screen word where it has one. The style guide §4: plain words on
screen, the files keep theirs, and the plan itself in plain words too. The glossary's opening says a
plan's prose uses the plain word.

## The system video, as built

`reelplanning build .reelplanning/system-video` (from this checkout): every stage passed, and it ends
"✓ length 7:58 (a system video: aim 5–8 min)", 478.3 s against 475.7 s before, so under eight minutes.
26 of its 37 lines were voiced again (the other 11 kept), and `retime-frames` moved the cues of the frames
whose lines changed onto their words. `plan-diff` reads 28 scenes edited (the 26 lines, and two quick
checks whose frame says "Chapter" now), 9 unchanged, none added or removed: every frame kept its id.
`check-terms` on it: every one of the 40 glossary rows is explained, and no defining scene fails to say its
word. Warnings left: 15 bare ids (the same ones as before, on its mocks of the decision log and the
call table) and 15 words used before their defining scene (36 before), most of them on a mock of the real
thing ("Step 1 — Deep-dive beats") or said in passing ("you review it by watching"). The terms index: 45 of its words are defined by the system video.

To fit, the scenes whose lines changed now hold about 0.4 s after their last word, where they held
about 0.8 s (`.hyperframes/holds.json` records the lengths as built), and three passages were cut (A4).
The contact sheets (`snapshots/contact-sheet-*.jpg`) show the renamed labels in place.

## Needs the player

The player is another worker's (`packages/player/reelplanning-player.js`); nothing here edits it. What this
plan needs from it:

1. **Say the plain word (D-127).** Wherever the player names a glossary word, show the row's `display`
   (else its `term`); underline a caption word matching any of its `forms` (the term's and the on-screen
   word's), keyed by `forms[0]` as today (`termList`, `glossHtml`). Its own text: choice for call, label for
   tag, accepted in a row for streak, late fix for miss, scene for beat, "Chapter 2 of 4" for "Part 2 of 4",
   and a `before:` line's `part` read as a chapter ("the system video · chapter 4, The build loop").
2. **A clicked word says where it is explained, and plays it** (step 1). In `showTerm`: pause, show the
   meaning inside the frame just above the answer bar (D-108), then "Explained in the system video, chapter
   4" from `glossary[].definedIn` (`video`, `chapter`, `chapterTitle`), and a link that plays that scene:
   `?project=<definedIn.video>&t=<definedIn.start>` (or a jump within this video when `definedIn.video` is
   this video's `slug`). A row with no `definedIn` keeps "Defined in this video" or no link.
3. **Send the words looked up** (step 3). In `confusion()`: add `termsLookedUp`, the keys (`forms[0]`) of
   every word whose meaning was opened in this review (a clicked word, an entry opened in the Terms panel),
   once each, persisted like `termsOpened` (which stays, as the count). `reel record` reads it
   (`lostOf`); three reviews looking up one word is a signal.
4. **Send what this browser has watched** (step 2, D-128). On the exported review, a top-level
   `watched: [{ video, seen?, sent? }]` from every `rp:watched:<slug>` mark in localStorage (the review
   page's names for the videos, the same as `markWatched` writes); a hosted row may carry it beside the
   review instead. `reel record` adds it to your file across repos.
5. **Tick a video off the moment you finish it** (D-128): `markWatched("seen")` at 80% seen or at the end,
   whichever comes first, and `markWatched("sent")` on Send (both exist; check the first fires on the end).
6. **Every video on the card watched: start without the newcomer scenes** (step 2). When every
   prerequisite is watched (`watchedOf` for each), start at knowledge level `familiar` (skip `- knowledge:
   new` scenes) unless the viewer picked a level.
7. **Never block Approve** (D-129): the confusion guard stays a quiet note; nothing to change if it already
   is one.

## Tests

Run after the last change to the code they test: `scripts/test/terms.spec.mjs` (new: the On screen column
as `display` and `forms`; `definedIn`; the system video failing on a row with no defining scene, by name,
and passing on its plain word; the terms index; a check with no walk-through failing, an id in `explain`
and an unshown answer warning; `#chapter N`), `scripts/test/lifecycle.spec.mjs` (new: a row no scene
defines makes `reel status` say behind, by name, though just built, and current once defined; a new row in
spec-diff; a changed row names its defining scene; `reel prereqs` picks the chapter and the earlier plan,
`--dry-run` writes nothing, and it writes the storyboard's front matter; after the review, a `recap:` line for the earlier video, and with five earlier videos two `before:` lines and five `recap:` lines, the two included), `scripts/test/memory.spec.mjs`
(new: the `lost` line, across repos too; your file's words looked up and videos watched, from the review,
the browser's list and a hosted row; `lostOf`, `watchedOf`; the word signal; D-129's line; `reel memory
checks` still answers), `scripts/test/build.spec.mjs`, `scripts/test/system-review.spec.mjs`,
`scripts/test/reviews.spec.mjs`, `scripts/test/review-data.spec.mjs`, `scripts/test/version.spec.mjs`:
all pass.`scripts/test/loop.spec.mjs` passes too (it files reviews through intake). The player's specs are the other worker's.

## Not done

- **The code check** ran (a fresh read-only checker, `code-check/findings.md`); each ✗ is answered under
  "## Code check" below.
- **The click in the captions, the ticks on the card, and the newcomer scenes skipped** are the player's
  (Needs the player).
- **Other plan and walkthrough videos are not rebuilt.** Their captions still say call, tag and part until
  they are; `check-terms` now fails a rebuild of the older ones whose quick checks have no
  `walk_me_through` (m3-revise-loop's, memory's, fewer-better-stops' and others'), which is step 4's rule.
- **No plan's storyboard was rewritten by `reel prereqs`**: it ran with `--dry-run` on the real plans.
- **Frame titles and `chapter_start` tags of older videos** still say "part" in the files; D-127 keeps file
  names.

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 1 | The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn` [hard-to-undo] | a separate mapping file; or `display` on every row | one table stays the one list of names ("the glossary lists both", D-127), and the player already reads `glossary[]` | `.reelplanning/glossary.md`, `scripts/lib/terms.mjs` `parseGlossary`, `addAccess` |
| A2 | 1 | Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area [visible, close] | only the six D-127 names; or "part" for an area | the plan's own words for the first two; "part of the system", so an older video's "Part two" is never underlined as a piece of the system | `.reelplanning/glossary.md` (On screen column) |
| A3 | 1 | The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first [hard-to-undo] | a list inside every plan map; or worked out by the player | one file every tool reads (`reel prereqs`, the plan map's `definedIn`), rebuilt on every build | `scripts/terms-index.mjs`, `scripts/finish-project.sh`, `scripts/lib/terms.mjs` `definesIndex` |
| A4 | 1 | The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story [visible] | rename only the defining scenes; or let it run past eight minutes | D-127 is what you see and hear; the budget is the system video's | `.reelplanning/system-video/SCRIPT.md` lines 16, 19 and 32; `compositions/frames/18-review-loop.html`, `30-rule-log.html` |
| A5 | 2 | `reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie [close] | the parts touched alone | every chapter shows the review player or the reel CLI, so parts alone picked "why a video" for most plans; words pick the build loop for fewer-better-stops, the plan's example | `scripts/reel.mjs` `prereqs` |
| A6 | 2 | A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video [close] | every id cited; or the newest plan first | plans list "unchanged; not touched here" decisions for completeness, not because the video leans on them; this gives the plan's example, the revise-loop video for fewer-better-stops | `scripts/reel.mjs` `prereqs` |
| A7 | 2 | `reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too (changed after review: it also writes a `recap:` line for every earlier video the plan builds on, the two on the card included, each with its plan's title and what it gives, so the recap scene sums up all of them in a line each and a viewer who watches none still has the gist; it named only the ones past two for the recap. The owner, on quick check k2: why not summarize everything if there is a summary anyway) [visible] | print only, for the author to paste | the plan says the author no longer guesses; the files keep their names (D-127) | `scripts/reel.mjs` `prereqs`, `scripts/lib/terms.mjs` `parseBefore` |
| A8 | 3 | `lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest [visible, close] | `lost` replacing `checks`, keeping five lines | D-115, an accepted call, names the five ids with `checks` among them, and the plan asks for a new line; the memory plan's "at most five" was written before there was a sixth thing to say | `scripts/lib/memory.mjs` `LINES`, `memoryLines` |
| A9 | 3 | Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule [hard-to-undo] | a count only (today's `termsOpened`); or only the reviewed video | three reviews looking up one word needs the word; D-128 needs the browser's list to reach your file | `scripts/lib/memory.mjs` `lostOf`, `watchedOf`; `scripts/reel.mjs` `record`; `scripts/reel-intake.mjs` |
| A10 | 3 | What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line [close] | a memory line of its own | memory's lines say what reviews show about plans; this is what you know | `scripts/reel.mjs` `memory`, `prereqs`; `scripts/lib/memory.mjs` `youKnows` |
| A11 | 4 | "The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning [close] | an exact phrase; or any scene before the check | it catches the plan's example (fewer-better-stops' "Twice") without asking for the answer's exact words | `scripts/check-terms.mjs` (section 4) |
| A12 | 4 | The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…") [close] | `explain` and `walk_me_through` | the plan asks for `explain`'s reason in words; a walk-through works the case, and the bare-id rule still holds for what is said | `scripts/check-terms.mjs` (section 4) |

No step reached a fifth call (step 1 has four, A1–A4; step 2 three; step 3 three; step 4 two), so no
question was put back into `plan.md` (D-110).

## Decisions in force

- **D-127** (this plan, question 1: plain words on screen, the files keep theirs) held: the glossary's On
  screen column (`.reelplanning/glossary.md`, read by `scripts/lib/terms.mjs` `parseGlossary`); the system
  video says them (`.reelplanning/system-video/SCRIPT.md`); files, commands, storyboard tags and the
  decision log keep their names (`before: system#part 4`, `- defines: streak`, `reel stops`). The owner's
  note on it: `skills/plan-to-video/SKILL.md` "A new plan" step 3 and the style guide §4.
- **D-128** (question 2: watched in this browser, and your file when a review is sent) held on this side:
  `watchedOf` (`scripts/lib/memory.mjs`) and `reel record` put the review's `watched` into your file, and
  `scripts/reel-intake.mjs` files a hosted row's; the browser's side is the player's (Needs the player, 4–5).
- **D-129** (question 3: never block; record it) held: nothing blocks; `actOnMarkdown`
  (`scripts/lib/review-scope.mjs`) says "Approved with 2 of 3 quick checks missed", and memory's `lost`
  line counts it (`scripts/lib/memory.mjs`).
- **D-003** held: the system video catches up after an accepted walkthrough; a glossary row no scene
  defines now also makes it behind (`systemVideoStatus`, `scripts/reel.mjs`; `scripts/spec-diff.mjs`), and
  its cost is still said before anything is rebuilt.
- **D-083** held: one quick check per step, as before; step 4 changes how they are written, not how many
  (`scripts/check-terms.mjs`).
- **D-084** held: the streak of ten and a flag resetting it are unchanged (`scripts/lib/autonomy.mjs`
  untouched); the system video now says it as "ten accepted in a row" (frame 25).
- **D-115** held: the memory lines' ids are words, and `checks` stays one; `lost` is added beside it (A8,
  `scripts/lib/memory.mjs` `LINES`).
- **D-106** held: your file stays `~/.reelplanning/you.jsonl`; a review's summary gains `lost` and
  `watched` (`scripts/lib/memory.mjs` `reviewFacts`).
- **D-107** and **D-124** held: a retro every five plans or at a signal repeated three times; "the same word
  looked up" is one more signal of that kind (`signals`, `retroDue`, `scripts/lib/memory.mjs`).
- **D-108** held: the meaning of a clicked word is to show inside the frame, above the answer bar (Needs
  the player, 2); `packages/player/reelplanning-player.js` is not edited here.
- **D-065** held: a word's rewrite after three look-ups goes as any system-video change does (`reel retro`'s
  draft says so, `scripts/reel.mjs` `retro`).
- **D-109** and **D-110** held: `scripts/lib/autonomy.mjs` is untouched; no step here reached a fifth call.
- **D-005**, **D-021**, **D-024**, **D-064**, **D-066**, **D-082**, **D-085** held: rewinds, the side panel,
  detail templates, the loop's background agent, the one setting, auto mode in the sandbox and the
  scaffolding are untouched (`packages/player/`, `templates/details/`, `scripts/review.mjs`,
  `scripts/lib/sandbox.mjs` not edited by this change).

## Code check

The checker's findings (`code-check/findings.md`), each ✗ answered. Fixed after the check, in the working
tree on top of the tooling half's commit (`f0f083f`); no new call (step 1 stays at four, D-110).

- **Step 1 — the system video covers a step and Finish; "decision log" has no row.** Fixed: three glossary
  rows, in plain words: *A step* ("one numbered part of a plan…; the system video tells its two loops in
  steps too"), *Finish* ("where a review ends: you approve, or ask for changes, and send…") and *The decision
  log* (`decisions.md`, also called the ledger). Each is defined by a scene that already says it, so nothing
  was voiced again: step by frame 1 ("six steps", with the plan's steps on screen), Finish by frame 15 ("then
  press Finish", beside Approve), the decision log by frame 17 ("adds each answer to the decision log";
  frame 9's tag moved there, since frame 9 says "a log", not the word). 40 rows, 40 defined; the build
  still ends at 7:58.
- **Step 3 — nothing tells the skill to stop explaining words you know.** Fixed:
  `skills/plan-to-video/SKILL.md` "Build a video" step 2: when `reel memory --you` shows the reviewer knows
  a word (watched the video that defines it, or looked it up and later answered a check on it right), the
  video drops its definition card for that word (the recap line, the defining clause); the word stays in
  the Terms panel.
- **D-127 — frames 22, 23 and 24 still show call, tag and streak.** Fixed: "labels in brackets, in the
  chose cell" (22-code-1, 24-code-3), "the log of choices" (23-code-2), "accepted in a row counts across
  plans" (24-code-3); the system video rebuilt (no line voiced again, 7:58). Left as they are, on purpose:
  frame 30's "What happens to a flagged call?" is decision D-002's own question in the decision log, and
  frame 37's "[misses]" is `reel status`'s own output: the log and the commands keep their names (D-127).
- **D-129 — `lostOf` reads only `rv.verdict`.** Fixed: it reads `verdictOf` (`scripts/lib/reviews.mjs`),
  as `actOnMarkdown` does, so an approve mark with no verdict field counts
  (`scripts/test/memory.spec.mjs`).
- **Unexplained — the card rules in SKILL.md and the style guide** (`data-question`, `data-call`,
  `question_more`, `option_a_more`, `option_a_why`, "nothing sits in a bar under or over the video"): not
  this plan's. They are the player redesign's, written by that worker, and commit with that work. The
  glossary's answer-bar row contradicted them ("else under the video"); their text says a frame with cards
  is answered on its cards, one without gets the bar in its lowest eighth, and only a video without
  `data-band` under it, so the row now says the same (`.reelplanning/glossary.md`, The answer band). Frame
  3's line ("a note goes in the answer bar at its foot") is left for the system video to catch up with that
  redesign once its walkthrough is accepted (D-003).
- **Unexplained — `check-terms`'s `unsaid` only warned.** Fixed: a system-video scene that defines a row
  but says neither its term nor its on-screen word now fails the build (`scripts/check-terms.mjs`, section
  3; `scripts/test/terms.spec.mjs`), as step 1 says those scenes explain it in the plain word.
- **Unexplained — `.reelplanning/terms-index.json` indexed the fewer-better-stops walkthrough's uncommitted rebuild.**
  Regenerated last, after the system video's rebuild here: it indexes the system video as rebuilt in this
  change (45 words), this plan's video (10) and the fewer-better-stops walkthrough as committed in
  `0158b3c` (9); nothing is undefined. It is rebuilt by every build's finish-project, so it always
  indexes the storyboards on disk at that build.

`reel status` reads the system video as behind glossary.md until the glossary and the video are committed
together (an uncommitted edit counts as now); `spec-diff` names frames 1, 3, 15 and 17, the scenes whose
rows are new or changed, and they are already rebuilt.
