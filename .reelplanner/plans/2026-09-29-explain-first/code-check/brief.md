# Code check brief: 2026-09-29-explain-first

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-29-explain-first/code-check/findings.md`.

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
# Code check: 2026-09-29-explain-first

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

## Commits (43f0e00..HEAD, limited to scripts/lib/explainer.mjs scripts/explain.mjs scripts/check-sources.mjs .reelplanning/system.json .reelplanning/glossary.md scripts/lib/terms.mjs scripts/plan-map.mjs scripts/review.mjs scripts/bundle-player.mjs scripts/lib/length.mjs .gitignore .reelplanning/.gitignore templates/gitignore templates/reelplanning/gitignore scripts/pr-check.mjs scripts/reel.mjs scripts/reel-intake.mjs scripts/lib/reviews.mjs packages/player/reelplanning-player.js packages/player/test/explainer-finish.spec.mjs scripts/build.mjs scripts/test/build.spec.mjs scripts/fresh-eyes.mjs scripts/lib/fresh-eyes.mjs scripts/test/explainer.spec.mjs scripts/test/run.mjs skills/plan-to-video/SKILL.md CHANGELOG.md)

```
3c02f1d Explain first: the skill's An explainer section, its spec, and the changelog
33d744a Explain first, step 5: check-sources in the build, and the fact check
8b93f2a Explain first, steps 3 and 4: Finish's three ends, the review filed by scene, and Plan this
60e9173 Explain first, steps 1 and 2: reelplanning explain, sources pinned by form and shape, and the Explainer row
6e7d8c2 Plan map thumbnails name pictures that are there: verify sets them again after it takes the snapshots
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-29-explain-first/plan.md` in full. Its title is "Explain first: a video of what is going on, before any plan", with 5 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-170** (step 4) How is where we end up judged? → **Rubric, blind judge, your rank**
  - note: yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-194** (step 2) What shows that a thing on the frame opens a page? → **A tab, the whole time**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
- **D-196** (step 4) What becomes of the corner chip on a rebuilt video? → **It goes where a thing is marked**
- **D-197** (step ?) When does a quick check come, and on what case? → **Later, on a new case**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-198** (step ?) What does the build do about a check asked too soon, or on the case just shown? → **Two warnings**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-199** (step ?) Which videos take the new quick checks, and when? → **New and revised, and the system video now**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with not the recommendation (it was: new and revised only)
- **D-200** (step 1) How much does a PR ask of its contributor? → **Asked; the maintainer can make it**
- **D-201** (step 2) When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep? → **The last answer**
- **D-202** (step 3) How much does the maintainer check before trusting a contributor's video? → **CI's, and a code check**
- **D-213** (step 3) Where does a PR's built video live? → **Attached to the PR, as a zip**
  - note: the reviewer's note: "would B be easy to do? also i dont know if we want in the git history thought hats the main question"; delivered by D-215 (decided in conversation, 2026-09-27): what this decided holds, the built video never lands in git's history and the PR's branch carries only its text, but it reaches the maintainer on a throwaway branch (video/pr-<n>, never merged, deleted after the merge), not as a zip attached to the PR by hand
- **D-215** (step 3) How does a PR's built video reach the maintainer? → **A throwaway branch**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **D-216** (step ?) What gets labelled? → **The build finds it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **D-217** (step ?) What does check-terms do with a likely-jargon word said or shown with no meaning? → **Warn, fail on strict**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-218** (step ?) How long does a labelled word stay underlined? → **Stop once you know it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-219** (step 1) What replaces today's walkthrough video? → **A short video of it running**
- **D-221** (step 2) What does Approve make of a choice on the list? → **Listed, not judged**
- **D-222** (step 3) Does the walkthrough test you? → **Where there's something to predict**
- **D-223** (step 4) Does a small pull request's choice need the video? → **Only a choice you'd notice**
- **D-224** (step 5) How do the plan and what was built sit together? → **One row, a Plan | Built switch**
- **D-225** (step 2) What becomes of a fresh-eyes finding nobody has answered? → **Answered before you see it**
- **D-226** (step 3) How do you find out what a phrase means? → **Those, and Ask about this**
- **D-227** (step 5) Which videos get fresh eyes? → **Every new one, and the system video now**
- **D-228** (step 3) Where does the guide open from the video? → **Its own page, a click away**
- **D-229** (step 4) What does an edit on the guide do? → **Suggested edits, applied exactly**
- **D-230** (step 5) How much guide does each plan get? → **Every plan, with a Built side**
- **D-244** (step 1) Which is the source: plan.md, or the guide? → **plan.md; the guide is built from it**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 1 was left unanswered when the plan was approved (reviews/plan-20260928T190542Z.md), so it was asked again
- **D-245** (step 2) What does Before you watch show of the findings the author kept? → **Only new ones**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; narrows D-231 (which listed every finding kept in the third round): after the rebuild of the system video it listed 28, mostly the agents repeating points already kept with the same reason; D-231 otherwise stands
- **D-246** (step 3) While a question is up, what does a click on a marked thing on the frame do? → **Opens its part of the guide**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; supersedes D-206 (the button hidden while a question is up); raised when the details-in-the-frame build found the click did nothing during a question
- **D-247** (step 1) How is each arm’s finished site kept in this repo? → **Plain files and a site.bundle**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 4 of the case-study plan had waited on the owner since step 1
- **D-248** (step 4) After Plan this, how far does the plan lean on the explainer? → **Lean on it**
- **D-249** (step 5) What of an explainer goes into git? → **Its text, never the transcript**
- **D-250** (step 1) Is an explainer's whole source there to read, behind the video? → **General principles, not a list of kinds: you say what you want explained, and the principles say what goes in the video and what goes in its guide**
  - note: the plan review answered q1 in the reviewer's own words; asked again in conversation (2026-09-29) with three readings, the owner answered in their own words

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 2 | An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough` [hard-to-undo, close] | `explainer:<name>`, as the plan's interface wrote it | a name is also a folder in the packed page, and a colon is not allowed in a folder name on Windows; `--explainer` reads like the walkthrough's | `slugOf`, `videoDirFor` in `scripts/lib/terms.mjs`; `slugFor` in `scripts/bundle-player.mjs` |
| A2 | 1 | A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines [close] | a fixed number of scenes' worth, or one rule for a whole folder | the plan says "over about 200 lines"; a folder of six small files and one long one needs a part for the long one only, as its review-server example says | `GUIDE_LINES`, `pinSource` in `scripts/lib/explainer.mjs` |
| A3 | 1 | A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text [close] | asking for the shape on the command line | no flag to get wrong, and a new kind of file lands on the shape its contents have; a repo file is shown and guided as a file (whole, its lines marked) | `shapeOfFile`, `pinSource` in `scripts/lib/explainer.mjs`; `scripts/test/explainer.spec.mjs` |
| A4 | 5 | A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked [close] | checking every word in the frame, or only elements marked as quotes | the theme's blocks already put the real thing in a `data-artifact`; a file's name in its bar is not a quote; "…" is how a long line is cut to fit; an old explainer must not fail when the code moves on | `frameText`, the quoted-line loop in `scripts/check-sources.mjs`; `sourceText` in `scripts/lib/explainer.mjs` |
| A5 | 5 | "States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1) [close] | number words ("three") too | digits are what a source can hold word for word; "step 2" is the video's own structure, not a fact | `NOT_A_FACT` in `scripts/check-sources.mjs` |
| A6 | 5 | A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short [hard-to-undo] | only inside a quoted line, as the plan's words say | all of that text is committed (D-249); a key said in the narration or typed on a card is as public as one quoted | `privateIn` in `scripts/lib/explainer.mjs`; `scripts/check-sources.mjs` |
| A7 | 5 | The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part [visible] | a separate command, or a fact check on every explainer | it is fresh eyes' loop (briefs, answers, rounds) with another brief; the plan gives it to an explainer that sums up more than it quotes | `rolesFor`, `factChecked` in `scripts/lib/fresh-eyes.mjs`; `--prompt checker` in `scripts/fresh-eyes.mjs` |
| A8 | 3 | The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end` [close] | `end` alone | the player's Finish, Send and the review server already carry `verdict`; `end` is what the plan's interface names | `EXPLAINER_ENDS`, `exportPayload` in `packages/player/reelplanning-player.js`; `endOf` in `scripts/lib/explainer.mjs` |
| A9 | 3 | "What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` [visible] | a box shown only under Explain more or Plan this | one box the page already has; the words matter for both ends, and are empty for Done | `openQuestion`, `showHandoff` in `packages/player/reelplanning-player.js`; `wantNextOf` in `scripts/lib/explainer.mjs` |
| A10 | 2 | An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more) [visible] | never under Needs you (nothing to decide) | it waits on you to watch it, and you asked for it | the explainers' loop over `TODO` in `scripts/bundle-player.mjs` |
| A11 | 2 | An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8 [close] | the plan video's 3–5 | the plan's numbers; the two outer lines copy the plan video's gaps | `BUDGET`, `kindOf` in `scripts/lib/length.mjs` |
| A12 | 4 | `new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write [visible] | requiring `--plan` | Plan this has the review before any plan text exists; the agent writes the steps from the quotes | `fromExplainer` in `scripts/reel.mjs` |

## The diff

Read it yourself: `git diff 43f0e00..HEAD -- scripts/lib/explainer.mjs scripts/explain.mjs scripts/check-sources.mjs .reelplanning/system.json .reelplanning/glossary.md scripts/lib/terms.mjs scripts/plan-map.mjs scripts/review.mjs scripts/bundle-player.mjs scripts/lib/length.mjs .gitignore .reelplanning/.gitignore templates/gitignore templates/reelplanning/gitignore scripts/pr-check.mjs scripts/reel.mjs scripts/reel-intake.mjs scripts/lib/reviews.mjs packages/player/reelplanning-player.js packages/player/test/explainer-finish.spec.mjs scripts/build.mjs scripts/test/build.spec.mjs scripts/fresh-eyes.mjs scripts/lib/fresh-eyes.mjs scripts/test/explainer.spec.mjs scripts/test/run.mjs skills/plan-to-video/SKILL.md CHANGELOG.md` (from the repository root). The files it touches:

```
.gitignore                                     |   7 +
 .reelplanning/.gitignore                       |   7 +
 .reelplanning/glossary.md                      |   1 +
 .reelplanning/system.json                      |   6 +
 CHANGELOG.md                                   |   8 +
 packages/player/reelplanning-player.js         |  40 ++-
 packages/player/test/explainer-finish.spec.mjs |  49 ++++
 scripts/build.mjs                              |   5 +
 scripts/bundle-player.mjs                      |  37 ++-
 scripts/check-sources.mjs                      | 122 +++++++++
 scripts/explain.mjs                            | 144 ++++++++++
 scripts/fresh-eyes.mjs                         |  69 ++++-
 scripts/lib/explainer.mjs                      | 351 +++++++++++++++++++++++++
 scripts/lib/fresh-eyes.mjs                     |  26 +-
 scripts/lib/length.mjs                         |  21 +-
 scripts/lib/reviews.mjs                        |   5 +-
 scripts/lib/terms.mjs                          |   6 +-
 scripts/plan-map.mjs                           |  34 ++-
 scripts/pr-check.mjs                           |   7 +-
 scripts/reel-intake.mjs                        |  15 +-
 scripts/reel.mjs                               |  74 +++++-
 scripts/review.mjs                             |   7 +-
 scripts/test/build.spec.mjs                    |   7 +-
 scripts/test/explainer.spec.mjs                | 197 ++++++++++++++
 scripts/test/run.mjs                           |   4 +-
 skills/plan-to-video/SKILL.md                  |  59 ++++-
 templates/gitignore                            |   6 +
 templates/reelplanning/gitignore               |   7 +
 28 files changed, 1244 insertions(+), 77 deletions(-)
```
