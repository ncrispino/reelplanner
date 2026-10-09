# Code check brief: 2026-09-28-plan-guide

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-28-plan-guide/code-check/findings.md`.

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
# Code check: 2026-09-28-plan-guide

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

## Commits (3162f80..HEAD, limited to scripts/guide.mjs scripts/lib/guide scripts/lib/plan-md.mjs scripts/reel.mjs scripts/lib/review-scope.mjs scripts/revise-scope.mjs scripts/plan-map.mjs scripts/check-details.mjs scripts/bundle-player.mjs scripts/build.mjs scripts/finish-project.sh scripts/explain.mjs packages/player/reelplanning-player.js packages/player/guide-review.js templates/guide templates/gitignore .gitignore skills/plan-to-video/SKILL.md scripts/test/guide.spec.mjs scripts/test/run.mjs .reelplanning/glossary.md .reelplanning/system.json docs/reference.md CHANGELOG.md)

```
4551194 Plan guide: walkthrough.md, and the plan text's header links to the full guide
9b6ec48 Plan guide: a part carries only what it shows; a file's whole text once a page; a flag line is a part
5823bbb Merge the shared branch into the plan guide's build (the tests' waits, explain-first's Finish)
30999e3 Plan guide: the skill, the glossary and system.json, the reference and the changelog
5f80c02 Plan guide, step 3: a scene opens its part of the guide over the frame; build makes and checks the guide
dc52612 Plan guide, step 1: reelplanning guide builds a video's guide from plan.md, git and runs/
faa6ee8 Plan guide, steps 2 and 4 in the reel CLI: the four blocks held to, suggested edits filed
a20bfc5 Explain first: Finish suggests from the video what Explain more and Plan this would mean (A9, A13 changed after review)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-28-plan-guide/plan.md` in full. Its title is "The plan guide: the video first, and a full page behind it you can read, check and edit", with 5 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-002** (step 5) What happens to a flagged call? → **Fix and rebuild**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-023** (step 4) What code does a walkthrough show? → **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.**
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
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**
- **D-168** (step 2) Do the text-only and HTML arms go all the way to a finished site? → **All the way, fixes included**
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
- **D-246** (step 3) While a question is up, what does a click on a marked thing on the frame do? → **Opens its part of the guide**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; supersedes D-206 (the button hidden while a question is up); raised when the details-in-the-frame build found the click did nothing during a question

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html` [visible] | one guide a plan at `<plan-dir>/guide/index.html`, as step 1's interface wrote it | the player and the review page open a video's guide beside it (after prototype v4); each video's page starts on its own side, its own moments first | `guideTarget` in `scripts/lib/guide/model.mjs` |
| A2 | 1 | The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat [visible, close] | v3's outline, text column and picture | the owner's direction after v4 was a flow, not boxes, and v5 was that flow; a `<details>` opens without a script and from the keyboard | `templates/guide/guide.js`, `templates/guide/guide.css` |
| A3 | 1 | Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in [visible, close] | prototypes v4 and v5's, built by hand for one plan | step 2: what to do comes from the blocks, so the agent writes nothing more; a hand-built one does not carry to another plan | `todosFor`, `builtOverview`, `catSection` in `templates/guide/guide.js` |
| A4 | 1 | An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine [hard-to-undo] | its text, masked, in every guide | the guide is published with the review page; D-249 keeps the transcript out of git, and a published page is no more private | `explainerModel` in `scripts/lib/guide/model.mjs` |
| A5 | 2 | The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them [close] | a marker in `plan.md`, or every plan | "a plan written after this ships": the folder's date is when it was written, and the plans before pass as they did | `BLOCKS_FROM`, `blocksDue` in `scripts/lib/plan-md.mjs` |
| A6 | 2 | An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup [close] | an `Example:` line under each option | the plans' questions set up one example and answer it per option; this passes those and fails "It stops." | `hasExample` in `scripts/lib/plan-md.mjs` |
| A7 | 2 | "Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out) [close] | any sentence, or the stage too | a short phrase (a step's title) is a heading by design; the stage is the real thing, not the page's words | `checkGuide` in `scripts/lib/guide/check.mjs` |
| A8 | 3 | A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:" [visible] | a chip on every step's scene | the guide is never committed (D-213), so a clone has none until it is built; a scene says which part is its, as a detail does | `scripts/plan-map.mjs`; `detailsList`, `guidePart` in `packages/player/reelplanning-player.js` |
| A9 | 3 | videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them [visible] | keeping the prototype's pages | the prototype is replaced; the same scenes open the same kinds of change, made from git and `runs/` | its `walkthrough-video/STORYBOARD.md` and `plan-map.json`; its `walkthrough.md`'s Categories of change |
| A10 | 4 | A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active [hard-to-undo] | a list of edits the page writes apart | the note box already keeps an edit with its words and place (prototype v5); one field fewer for every page to carry | `editsOf` in `scripts/lib/review-scope.mjs`; `record` in `scripts/reel.mjs` |
| A11 | 4 | An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`) [visible, hard-to-undo] | answers only on the video | step 4: one answer, whichever place gave it | `answerOnGuide` in `templates/guide/guide.js`; `answerFromGuide` in `packages/player/reelplanning-player.js` |
| A12 | 5 | walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else" [hard-to-undo] | a category a folder, or a commit | step 5's interface named the line; one file's changes can be two kinds (the player in videos-that-make-sense), and nothing is left out | `readWalkthrough`, `builtSide` in `scripts/lib/guide/built.mjs` |
| D1 | 3 | A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/` [deviation] | `details/<part>.html` | `details/` is committed with the video, and the guide is built, never committed (D-213) | `scripts/plan-map.mjs`, `scripts/check-details.mjs` |
| D2 | 1 | A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path [deviation] | the stage `reel stage` draws, the step's change drawn on, a case lighting its path | the stage's drawing is sized for a 1920 px frame, not a column; what a step changes is in its blocks, and the fragment is where a step draws its own | `stepPicture` in `templates/guide/guide.js` |
| m1 | 1 | Scene pictures on the page are 240 px JPEGs made from the snapshots with ffmpeg, cached in `guide/.cache/` | the snapshots' PNGs | a page of 40 scenes stays small | `thumbOf` in `scripts/lib/guide/model.mjs` |
| m2 | 5 | `git blame` runs eight at a time, cached in `guide/.cache/blame.json` | on every build | about a second a file | `builtSide` in `scripts/lib/guide/built.mjs` |
| m3 | 1 | A part carries only what it shows, and a file's whole text is kept once a page | every part the whole guide | videos-that-make-sense's guides went from 18 MB to 5 MB each | `partsOf` in `scripts/lib/guide/model.mjs` |
| m4 | 1 | `needsPart` and `guide` in `sources.json` both mean a part | `needsPart` only | `explain` writes `guide: true` | `needsPart` in `scripts/lib/guide/model.mjs` |
| m5 | 3 | `bundle-player` builds a guide missing or older than its `plan.md`, `walkthrough.md`, `sources.json` or plan map | publishing only one already built | a fresh clone has none | `scripts/bundle-player.mjs` |
| m6 | 3 | The videos on the review page get only the guide's fields in their plan maps; no scene rebuilt | regenerating their plan maps | a map written by today's plan-map carries more than the guide, and changes what memory reads | their `plan-map.json` |
| m7 | 5 | With no **Commits:** line, the commits after Started from whose message starts with the plan's title before its colon, said as a gap | no Built side | the repo's commits name their plan that way | `planCommits` in `scripts/lib/guide/built.mjs` |
| m8 | 5 | videos-that-make-sense's runs, made for prototype v4 on 2026-09-28, saved in its `runs/` as files | leaving them in v4's page | the Built side reads `runs/`; they are real runs | `.reelplanning/plans/2026-09-28-videos-that-make-sense/runs/` |
| m9 | 2 | An Interface block's indented `--flag` line is a part of its command, meaning or not | what the command prints | a flag is a part, and its missing meaning a gap | `interfaceParts` in `scripts/lib/plan-md.mjs` |

## The diff

Read it yourself: `git diff 3162f80..HEAD -- scripts/guide.mjs scripts/lib/guide scripts/lib/plan-md.mjs scripts/reel.mjs scripts/lib/review-scope.mjs scripts/revise-scope.mjs scripts/plan-map.mjs scripts/check-details.mjs scripts/bundle-player.mjs scripts/build.mjs scripts/finish-project.sh scripts/explain.mjs packages/player/reelplanning-player.js packages/player/guide-review.js templates/guide templates/gitignore .gitignore skills/plan-to-video/SKILL.md scripts/test/guide.spec.mjs scripts/test/run.mjs .reelplanning/glossary.md .reelplanning/system.json docs/reference.md CHANGELOG.md` (from the repository root). The files it touches:

```
.gitignore                             |   7 +-
 .reelplanning/glossary.md              |   3 +-
 .reelplanning/system.json              |   8 +
 CHANGELOG.md                           |  12 +
 docs/reference.md                      |  13 +
 packages/player/guide-review.js        |   4 +-
 packages/player/reelplanning-player.js | 147 +++++++-
 scripts/build.mjs                      |  13 +
 scripts/bundle-player.mjs              |  35 +-
 scripts/check-details.mjs              |  21 +-
 scripts/explain.mjs                    |  19 +-
 scripts/finish-project.sh              |   6 +-
 scripts/guide.mjs                      |  69 ++++
 scripts/lib/guide/built.mjs            | 185 ++++++++++
 scripts/lib/guide/check.mjs            | 128 +++++++
 scripts/lib/guide/model.mjs            | 246 +++++++++++++
 scripts/lib/guide/page.mjs             |  51 +++
 scripts/lib/plan-md.mjs                | 157 ++++++++
 scripts/lib/review-scope.mjs           |  43 ++-
 scripts/plan-map.mjs                   |  31 +-
 scripts/reel.mjs                       |  54 ++-
 scripts/revise-scope.mjs               |  11 +-
 scripts/test/guide.spec.mjs            | 217 +++++++++++
 scripts/test/run.mjs                   |   2 +-
 skills/plan-to-video/SKILL.md          |  63 +++-
 templates/gitignore                    |   6 +
 templates/guide/guide.css              | 393 ++++++++++++++++++++
 templates/guide/guide.js               | 638 +++++++++++++++++++++++++++++++++
 templates/guide/picture.html           |  42 +++
 29 files changed, 2560 insertions(+), 64 deletions(-)
```
