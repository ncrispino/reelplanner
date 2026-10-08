# Code check brief: 2026-09-27-walkthroughs-that-help

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-27-walkthroughs-that-help/code-check/findings.md`.

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
# Code check: 2026-09-27-walkthroughs-that-help

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

## Commits (806f8aa..HEAD, limited to .github/pull_request_template.md .reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough.md .reelplanning/theme/frame.md CHANGELOG.md CONTRIBUTING.md README.md docs/lifecycle.md docs/project-dir.md docs/reference.md docs/status.md packages/player/reelplanning-player.js packages/player/test/bundle.spec.mjs packages/player/test/fixtures/l2-autonomy-list.json packages/player/test/list.spec.mjs scripts/bundle-player.mjs scripts/check-terms.mjs scripts/lib/autonomy.mjs scripts/lib/length.mjs scripts/lib/memory.mjs scripts/lib/notify.mjs scripts/lib/review-scope.mjs scripts/plan-map.mjs scripts/pr-check.mjs scripts/reel.mjs scripts/test/build.spec.mjs scripts/test/contributing.spec.mjs scripts/test/lifecycle.spec.mjs scripts/test/loop.spec.mjs scripts/test/memory.spec.mjs scripts/test/run.mjs scripts/test/terms.spec.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md templates/CONTRIBUTING.md templates/pull_request_template.md templates/reelplanning/theme/frame.md templates/video/BRIEF.md)

```
300fc10 Walkthroughs that help: walkthrough.md, the tests run, the decisions held, what is not done (step 7 waits on the walkthrough's acceptance); reel audit passes but for the code check
bc341a1 Walkthroughs that help, step 6: measure whether it worked. Each verdict carries shownAt, when its pause began; reel memory's after-build line (the seconds a pause held you, the middle value; flags, own words, comments; sent before the video could play through); the bar over the first three timed walkthrough reviews, per review (A10): three misses make reel status say a plan to drop the walkthrough video is due, which the skill says the next plan proposes, changing nothing until approved. walkthrough.md notes step 7 waiting on the walkthrough's acceptance (D-003)
34b7a04 Walkthroughs that help, step 5: the plan and what was built in one row (D-224): each plan one line on the review page with a Plan | Built switch; the header carries the same switch, which lands on the same step (the walkthrough's running scene, "See it built"; back to the plan's step, "See the plan"; "Nothing to run for this step" where the walkthrough runs nothing) (A7, A8). The owner's ask: what needs you first, then the system video and the five newest plans, the rest behind "Earlier plans (N)" (A9). library.json keeps both videos per plan, with status and the step table; bundle.spec covers the rows, the fold and the switch
c0d438e Walkthroughs that help, step 4: pull requests get the short walkthrough (D-223): over 300 lines, or a choice you'd notice or can't easily undo (the template's box, reworded); any other choice is a line under "Other choices" in the PR's text, which reel pr-check waits on until a maintainer ticks them accepted (A6); its stale check follows step 2's rule (a call labelled visible or hard-to-undo, or an off-plan change, only listed by the video is stale). CONTRIBUTING.md, both templates, the skill, lifecycle and project-dir docs
9637026 Walkthroughs that help, step 3: a walkthrough's quick check only where the change has something to predict, just before the scene that runs it (D-222; "the page looks the same" is not "nothing to predict": a saved file or a command's output counts); check-terms keeps D-197/D-198's two warnings for the plan and system videos; the review ends on one open question, "Seeing it run, anything you'd change?", asked in Finish, the words a note under "Seeing it run" in reviews/<id>.md (A5)
0fe7672 Walkthroughs that help, step 2: a choice pauses the walkthrough when you'd notice it or can't easily undo it (labels visible, hard-to-undo; an off-plan change always; no count, and D-084's ten-in-a-row rule gone; D-122's late fix kept); every other choice is one list at the end (- autonomy_list:, A2), a line each with its own Flag and Go on (A3), logged "listed, not judged" (D-221, A4) so a later plan is not warned by it. reel stops, plan-map, the player, reel record, reviews/<id>.md, memory, the notification line. The skill and style guide say steps 1 and 2 (the change running, about two minutes; what pauses; the list). walkthrough.md started (A1-A4). list.spec added
294a0c4 Walkthroughs that help, step 1: a walkthrough video aims for about two minutes (the build says long past 3, too long past 5; A1); the docs and the template brief say it shows the change running, every change scene a real thing (the skill's and style guide's words land with step 2)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-27-walkthroughs-that-help/plan.md` in full. Its title is "Walkthroughs that help: see the build run, stop only where you'd notice", with 7 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-002** (step 5) What happens to a flagged call? → **Fix and rebuild**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-023** (step 4) What code does a walkthrough show? → **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
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

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop) | keeping "too long" at 10 minutes, or no "too long" at all | the plan aims for about two minutes and the build warns past 3; a walkthrough past 5 is as long as today's, the thing this plan replaces, so it says so more firmly | `scripts/lib/length.mjs` (`BUDGET.walkthrough`), `scripts/test/build.spec.mjs` ("length: …") |
| A2 | 2 | The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos [close] | reusing `- autonomy_group:` for the list, or no beat at all (the list only in the Finish panel) | the list is judged differently from a grouped beat (Flag or leave, never Accept), so the player and `reel record` must tell them apart; older walkthroughs keep playing as they were | `scripts/plan-map.mjs` (`autonomyList`, `list: true`), `scripts/reel.mjs` (`stops`), `scripts/lib/autonomy.mjs` (`listedOf`) |
| A3 | 2 | The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card [visible] | an Accept and a Flag per row, or the grouped beat's row of Flag buttons with the words only on hover | the plan says each choice in one line with its own Flag, and Approve takes the rest; hover-only words were the thing that made choices hard to judge | `askList`, `listRows` in `packages/player/reelplanning-player.js`; `packages/player/test/list.spec.mjs` |
| A4 | 2 | "Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged" [close] | only at Approve, or listing unreached choices whatever the verdict | Go on is the list's Accept all; "Approve takes the rest" is the plan's words, and a review asking for changes has not taken anything | `acceptGroup` in `packages/player/reelplanning-player.js`; `walkthroughScope` in `scripts/lib/review-scope.mjs`; `scripts/test/lifecycle.spec.mjs` ("reel record, the list") |
| A5 | 3 | The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md` [visible, close] | a pause on the ending frame with its own box, or a new field in the review file | the plan cuts pauses, and Finish is where every review ends anyway; a note needs no new field, reaches the agent like any comment, and counts as your words (so Finish suggests Request changes once you have written some) | `openQuestion`, `setOpenWords`, `showHandoff` in `packages/player/reelplanning-player.js`; `actOnMarkdown` in `scripts/lib/review-scope.mjs`; `packages/player/test/list.spec.mjs` |
| A6 | 4 | A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure [visible, close] | the choices in a comment on the PR, or no tick (reading them is accepting them) | a line in the PR's text is where the plan puts them, and a tick is something `pr-check` can read, so accepting is never forgotten at merge | `templates/pull_request_template.md`, `.github/pull_request_template.md`, `scripts/pr-check.mjs` (`otherChoices`), `scripts/test/contributing.spec.mjs` ("D-223") |
| A7 | 5 | The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`) [close] | a scene the walkthrough marks as the step's running one, or the player fetching the other video's plan map as it plays | every built walkthrough already tags its scenes by step, so older ones jump right too; the page is built from both maps anyway, and a tenth in keeps the seek off the scene before | `stepStarts` in `scripts/bundle-player.mjs`; `packages/player/test/bundle.spec.mjs` ("lands there") |
| A8 | 5 | One control: the header's Plan \| Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes [visible, close] | a "See it built" button on each plan scene beside the switch | the owner asked for switching to be clean and obvious, with no competing links; the switch already says where you are, and the same click then lands on the same step | `#pb` in `scripts/bundle-player.mjs` (`LIBRARY_JS`); `packages/player/test/bundle.spec.mjs` ("the header's Plan \| Built switch") |
| A9 | videos list | The list's order: what needs you first (a plan waiting says "waiting" and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word: waiting, approved, changes, not reviewed, questions open, built), and on a phone the word under the name [visible] | every plan in date order, two rows each, or a search box | the owner asked for what waits first and the rest folded; five is about the last week of plans here, and one word keeps a row on one line | `LIBRARY_JS`, `STATUS_WORD` in `scripts/bundle-player.mjs`; `packages/player/test/bundle.spec.mjs` ("Earlier plans (N)") |
| A10 | 6 | The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss | pooling the three reviews' pauses into one middle value and one count, or counting reviews from before pauses were timed | "the next three walkthroughs" means reviews made after this change, and "3 of 3" in the status message counts reviews; one review that was looked at is enough to keep the video | `walkthroughBar`, `clearsBar` in `scripts/lib/memory.mjs`; `scripts/test/memory.spec.mjs` ("walkthroughBar") |

## The diff

Read it yourself: `git diff 806f8aa..HEAD -- .github/pull_request_template.md .reelplanning/plans/2026-09-27-walkthroughs-that-help/walkthrough.md .reelplanning/theme/frame.md CHANGELOG.md CONTRIBUTING.md README.md docs/lifecycle.md docs/project-dir.md docs/reference.md docs/status.md packages/player/reelplanning-player.js packages/player/test/bundle.spec.mjs packages/player/test/fixtures/l2-autonomy-list.json packages/player/test/list.spec.mjs scripts/bundle-player.mjs scripts/check-terms.mjs scripts/lib/autonomy.mjs scripts/lib/length.mjs scripts/lib/memory.mjs scripts/lib/notify.mjs scripts/lib/review-scope.mjs scripts/plan-map.mjs scripts/pr-check.mjs scripts/reel.mjs scripts/test/build.spec.mjs scripts/test/contributing.spec.mjs scripts/test/lifecycle.spec.mjs scripts/test/loop.spec.mjs scripts/test/memory.spec.mjs scripts/test/run.mjs scripts/test/terms.spec.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md templates/CONTRIBUTING.md templates/pull_request_template.md templates/reelplanning/theme/frame.md templates/video/BRIEF.md` (from the repository root). The files it touches:

```
.github/pull_request_template.md                   |  14 +-
 .../walkthrough.md                                 | 235 +++++++
 .reelplanning/theme/frame.md                       |   2 +-
 CHANGELOG.md                                       |  17 +
 CONTRIBUTING.md                                    |  18 +-
 README.md                                          |  12 +-
 docs/lifecycle.md                                  |   9 +-
 docs/project-dir.md                                |   8 +-
 docs/reference.md                                  |   4 +-
 docs/status.md                                     |   2 +-
 packages/player/reelplanning-player.js             |  82 ++-
 packages/player/test/bundle.spec.mjs               |  31 +-
 .../player/test/fixtures/l2-autonomy-list.json     | 758 +++++++++++++++++++++
 packages/player/test/list.spec.mjs                 | 106 +++
 scripts/bundle-player.mjs                          | 150 ++--
 scripts/check-terms.mjs                            |  12 +-
 scripts/lib/autonomy.mjs                           |  59 +-
 scripts/lib/length.mjs                             |   7 +-
 scripts/lib/memory.mjs                             |  61 +-
 scripts/lib/notify.mjs                             |   7 +-
 scripts/lib/review-scope.mjs                       |  23 +-
 scripts/plan-map.mjs                               |  24 +-
 scripts/pr-check.mjs                               |  44 +-
 scripts/reel.mjs                                   |  60 +-
 scripts/test/build.spec.mjs                        |   6 +-
 scripts/test/contributing.spec.mjs                 |  19 +
 scripts/test/lifecycle.spec.mjs                    |  61 +-
 scripts/test/loop.spec.mjs                         |   1 +
 scripts/test/memory.spec.mjs                       |  65 +-
 scripts/test/run.mjs                               |   2 +-
 scripts/test/terms.spec.mjs                        |   6 +
 skills/plan-to-video/SKILL.md                      |  75 +-
 skills/plan-to-video/references/style-guide.md     | 123 ++--
 templates/CONTRIBUTING.md                          |  18 +-
 templates/pull_request_template.md                 |  14 +-
 templates/reelplanning/theme/frame.md              |   2 +-
 templates/video/BRIEF.md                           |   4 +-
 37 files changed, 1848 insertions(+), 293 deletions(-)
```
