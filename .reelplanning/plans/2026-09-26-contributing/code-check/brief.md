# Code check brief: 2026-09-26-contributing

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-26-contributing/code-check/findings.md`.

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
# Code check: 2026-09-26-contributing

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

## Commits (6ffbc60..HEAD, limited to scripts/pr-check.mjs scripts/renumber.mjs scripts/reel.mjs scripts/review.mjs scripts/lib/memory.mjs scripts/lib/contributing.mjs bin templates/CONTRIBUTING.md templates/pull_request_template.md templates/gitignore templates/reelplanning/config.json CONTRIBUTING.md .github .gitignore .gitattributes .reelplanning/config.json docs README.md skills/plan-to-video/SKILL.md scripts/test/contributing.spec.mjs scripts/test/memory.spec.mjs scripts/test/run.mjs)

```
e7904a3 CI: .github/workflows/ci.yml (untested on GitHub): the fast suite on every push, reel pr-check and reel audit on every PR, the full suite once ready-to-merge (failing without it, so a required check is never skipped), and video/pr-<n> deleted when its PR closes (D-215)
19e6e2c Contributing: CONTRIBUTING.md and the PR template (as templates and in this repo), the gitignore lines, maintainers, the skill's "Several people", the docs
565cc23 Contributing, steps 1 to 4 in code: reel pr-check, reel renumber, a contributor's walkthrough review adds nothing to the log, review serves a packed folder
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-26-contributing/plan.md` in full. Its title is "Several people, one repo: contributing with reelplanning", with 5 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
  - note: changed by D-197 to D-199 (decided in conversation, 2026-09-27): the count holds, but each check now comes after the next step's scenes (the last step's at the end, before the ending) and asks about a case the video did not show; the style guide's "It comes right after the beat that sets it up", "Use the same names and numbers as that beat's case" and "on a case the video showed" are replaced
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
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
- **D-214** (step 1) When does a PR need a video? → **Choices or size only**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it answers the owner's note on quick check 1 ("eh idk i still feel like small ones just not needed really? what do you think"): reel pr-check reads the size and the choices it can see, not a part's files, and the small-fix label gives way to needs-video (a maintainer asks) and no-video (a check that asked by mistake)
- **D-215** (step 3) How does a PR's built video reach the maintainer? → **A throwaway branch**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **D-216** (step ?) What gets labelled? → **The build finds it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **D-217** (step ?) What does check-terms do with a likely-jargon word said or shown with no meaning? → **Warn, fail on strict**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-218** (step ?) How long does a labelled word stay underlined? → **Stop once you know it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | The 300 lines leave out tests (test folders, `*.spec.*`, `*.test.*`), docs (`docs/`, Markdown and text files, the licence), the whole `.reelplanning/` record, `videos/` and media, lockfiles and `dist/`, and any file `.gitattributes` marks `linguist-generated` or `linguist-documentation` [close] | a fixed list of test, doc, video and generated paths only | the record is plans, reviews, videos and the log, none of it code; the attributes let any repo mark its own generated files | `scripts/pr-check.mjs` (`NOT_CODE`, `attrs`) |
| A2 | 1 | A PR over the line with no video, or still waiting for a maintainer to accept its walkthrough, prints △ and passes; `--merge`, in the full-suite job, makes it a failure [visible, close] | fail on every push until a video is reviewed | the plan says "needs a video" is what is missing, not the contributor's failure; the check required before a merge still holds it | `scripts/pr-check.mjs` (`waits`, `--merge`); `.github/workflows/ci.yml` (`full`) |
| A3 | 2 | This repo's `maintainers` is `["owner"]`, no email: a review recorded by git's user.email (the local page's Send, filed on some machine) counts as a contributor's until that email is added; `reel record` says so, and recording it again then adds its calls [visible, close] | listing the owner's email, or the agent's git email | the owner reviews on the hosted page (19 reviews filed as `owner`); an email in a public `config.json` shows it to everyone, and the agent's email is every Claude session's | `.reelplanning/config.json`; `scripts/reel.mjs` (`record`) |
| A4 | 3 | Each video is checked against its text only until it is approved: a plan video once a plan review approved it, a walkthrough once a maintainer accepted it [close] | check every video the PR carries, always | after an approval `plan.md` takes the folded comments and a row gets "(changed after review)", with no new video by design; checking then would fail every approved plan | `scripts/pr-check.mjs` (`done`) |
| A5 | 3 | The hashes compare what the map already carries (the plan's title, problem and steps; each stop's chose, instead of, why and check) with `plan.md` and `walkthrough.md`; no new field in `plan-map.json` [close] | a hash of the whole of `plan.md` and `walkthrough.md`, written into the map by the build | a map built before this plan checks the same, and a line added to "How each was decided" changes nothing the video says, so should not fail it | `scripts/pr-check.mjs` (`hash`, `rowText`) |
| A6 | 3 | This repo's plan folders dated up to 2026-09-27 keep their videos' media committed (negated lines in `.gitignore`); a plan started after that follows the rule [visible, hard-to-undo] | the template's lines alone, for every plan folder | a rebuild of an older video would leave its new voice files out while its committed `index.html` names them; the plan keeps this repo's committed videos as they are | `.gitignore` |
| A7 | 4 | `reel renumber` takes an entry as the branch's own when the base holds none that decided the same thing (plan, question, date, answer), and reads the branch's log from whichever side of the conflict holds such entries [close] | the entries after the merge-base's last id | the same in a rebase (where ours and theirs swap) and a merge, with no merge-base to find while a rebase is under way | `scripts/renumber.mjs`; `scripts/lib/contributing.mjs` (`entryKey`) |
| A8 | 4 | A pending memory line moves when it names no email, or this machine's git user.email; one naming `owner` or an id moves as before [close] | hold every line whose reviewer is not in `maintainers` | the hosted page calls whoever published it `owner`, on anyone's page, so only an email tells two people apart | `scripts/lib/memory.mjs` (`mineToMove`) |
| D1 | 5 | The workflow is `.github/workflows/ci.yml` [deviation] | `.github/workflows/test.yml`, as the plan names it | the task named ci.yml; it runs more than the tests | `.github/workflows/ci.yml` |
| A9 | 5 | The full-suite job runs on every PR event and fails at once without `ready-to-merge` [visible, close] | skip the job until the label is on | GitHub counts a skipped required check as passed, so a skipped full suite would let a PR merge untested | `.github/workflows/ci.yml` (`full`) |

## The diff

Read it yourself: `git diff 6ffbc60..HEAD -- scripts/pr-check.mjs scripts/renumber.mjs scripts/reel.mjs scripts/review.mjs scripts/lib/memory.mjs scripts/lib/contributing.mjs bin templates/CONTRIBUTING.md templates/pull_request_template.md templates/gitignore templates/reelplanning/config.json CONTRIBUTING.md .github .gitignore .gitattributes .reelplanning/config.json docs README.md skills/plan-to-video/SKILL.md scripts/test/contributing.spec.mjs scripts/test/memory.spec.mjs scripts/test/run.mjs` (from the repository root). The files it touches:

```
.gitattributes                     |   3 +
 .github/pull_request_template.md   |  24 ++++
 .github/workflows/ci.yml           | 111 +++++++++++++++++
 .gitignore                         |  13 ++
 .reelplanning/config.json          |   3 +
 CONTRIBUTING.md                    | 116 ++++++++++++++++++
 README.md                          |   2 +
 bin/reel.mjs                       |   2 +-
 bin/reelplanning.mjs               |   2 +-
 docs/lifecycle.md                  |  31 +++++
 docs/project-dir.md                |  11 +-
 docs/releasing.md                  |   2 +-
 scripts/lib/contributing.mjs       |  50 ++++++++
 scripts/lib/memory.mjs             |  12 +-
 scripts/pr-check.mjs               | 241 +++++++++++++++++++++++++++++++++++++
 scripts/reel.mjs                   |  28 +++--
 scripts/renumber.mjs               | 112 +++++++++++++++++
 scripts/review.mjs                 |  33 ++++-
 scripts/test/contributing.spec.mjs | 213 ++++++++++++++++++++++++++++++++
 scripts/test/memory.spec.mjs       |   2 +
 scripts/test/run.mjs               |   2 +-
 skills/plan-to-video/SKILL.md      |  42 ++++++-
 templates/CONTRIBUTING.md          |  93 ++++++++++++++
 templates/gitignore                |  14 +++
 templates/pull_request_template.md |  24 ++++
 templates/reelplanning/config.json |   2 +
 26 files changed, 1166 insertions(+), 22 deletions(-)
```
