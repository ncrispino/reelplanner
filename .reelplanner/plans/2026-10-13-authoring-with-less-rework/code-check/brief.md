# Code check brief: 2026-10-13-authoring-with-less-rework

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanner/plans/2026-10-13-authoring-with-less-rework/code-check/findings.md`.

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
# Code check: 2026-10-13-authoring-with-less-rework

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

## Commits (76a36fe..HEAD, limited to scripts packages/player templates skills/plan-to-video/references eval/pipeline-cost/2026-10-12-codex-batched-pilot.md eval/pipeline-cost/2026-10-12-codex-batched-pilot.json eval/pipeline-cost/LEDGER.md)

```
b49e2db Record all four capped Codex authoring trials
635e23f Share visible scene content and add bounded frame scaffolds
1c11ba4 Keep playback controls consistent and guide prose readable
```

## The plan, as implemented

Read `.reelplanner/plans/2026-10-13-authoring-with-less-rework/plan.md` in full. Its title is "Faster scene authoring without losing the explanation", with 3 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
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
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-170** (step 4) How is where we end up judged? → **Rubric, blind judge, your rank**
  - note: yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-021, with the owner's approval in conversation on 2026-10-04
- **D-197** (step ?) When does a quick check come, and on what case? → **Later, on a new case**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-198** (step ?) What does the build do about a check asked too soon, or on the case just shown? → **Two warnings**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-199** (step ?) Which videos take the new quick checks, and when? → **New and revised, and the system video now**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with not the recommendation (it was: new and revised only)
- **D-200** (step 1) How much does a PR ask of its contributor? → **Asked; the maintainer can make it**
- **D-201** (step 2) When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep? → **The last answer**
- **D-213** (step 3) Where does a PR's built video live? → **Attached to the PR, as a zip**
  - note: the reviewer's note: "would B be easy to do? also i dont know if we want in the git history thought hats the main question"; delivered by D-215 (decided in conversation, 2026-09-27): what this decided holds, the built video never lands in git's history and the PR's branch carries only its text, but it reaches the maintainer on a throwaway branch (video/pr-<n>, never merged, deleted after the merge), not as a zip attached to the PR by hand
- **D-215** (step 3) How does a PR's built video reach the maintainer? → **A throwaway branch**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **D-216** (step ?) What gets labelled? → **The build finds it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **D-217** (step ?) What does check-terms do with a likely-jargon word said or shown with no meaning? → **Warn, fail on strict**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-219** (step 1) What replaces today's walkthrough video? → **A short video of it running**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes nothing (D-084, D-083 and D-041 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-220** (step 2) Which choices make it pause? → **i dont like specifically saying 'five' i mean i think there's a lot that changes per plan i dont think being too specific is good**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): never superseded (it was linked to D-221 by mistake), active again; supersedes D-084, with the owner's approval in conversation on 2026-10-04
- **D-221** (step 2) What does Approve make of a choice on the list? → **Listed, not judged**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-041 only (D-220, D-214 and D-133 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-222** (step 3) Does the walkthrough test you? → **Where there's something to predict**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-083, with the owner's approval in conversation on 2026-10-04
- **D-223** (step 4) Does a small pull request's choice need the video? → **Only a choice you'd notice**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-214, with the owner's approval in conversation on 2026-10-04
- **D-225** (step 2) What becomes of a fresh-eyes finding nobody has answered? → **Answered before you see it**
- **D-227** (step 5) Which videos get fresh eyes? → **Every new one, and the system video now**
- **D-244** (step 1) Which is the source: plan.md, or the guide? → **plan.md; the guide is built from it**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 1 was left unanswered when the plan was approved (reviews/plan-20260928T190542Z.md), so it was asked again
- **D-245** (step 2) What does Before you watch show of the findings the author kept? → **Only new ones**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; narrows D-231 (which listed every finding kept in the third round): after the rebuild of the system video it listed 28, mostly the agents repeating points already kept with the same reason; D-231 otherwise stands
- **D-247** (step 1) How is each arm’s finished site kept in this repo? → **Plain files and a site.bundle**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 4 of the case-study plan had waited on the owner since step 1
- **D-265** (step ?) What does the guide hold that the video does not? → **More than the video, never a restatement of it: concrete, in depth, with worked examples for each case, full and thorough, with diagrams of how the thing works, and the page's HTML used to its fullest (diagrams you can step through and click, before/after, try-it examples from real runs); any words on it can be highlighted to leave a note, the same box as a mark on the video, sent with the review**
  - note: decided in conversation (2026-09-30), after the first rewrite of the guide for clarity
- **D-266** (step ?) How does a thing in the video that leads to the guide show itself? → **Quietly: nothing drawn while the video plays; a faint arrow when paused; on hover a thin ring on the thing and a small grey "More in the guide ↓"; a first tap shows it on a phone, a second opens it; the focus ring stays for the keyboard**
  - note: decided in conversation (2026-09-30); replaces the black "Open · <title>" tab and outline drawn over the frame; linked as superseding D-194, with the owner's approval in conversation on 2026-10-04
- **D-303** (step ?) When what's built has to be installed, does its video show the install? → **Yes: a video of something people install shows the real install commands, run and working, as a step of the system; this repo's system video walks through installing reelplanning**
  - note: decided in conversation (2026-10-04); a rule for every video the skill makes, not only this repo's
- **D-304** (step ?) What does the README say about the name? → **It says reelplanning sounds like "real planning": a plan as long text is too hard to take in, and a video of it is what makes real planning possible**
  - note: decided in conversation (2026-10-04)
- **D-305** (step ?) How does the repo go public when its history holds about 1 GB of narration audio and renders? → **A slimmed history: every .wav, .mp4 and renders/ file removed from all commits (about 70 MB left), with the commit hashes the record cites rewritten to the new ones, pushed to a new public remote as one branch; this private repo keeps its full history. From then on no voice files or renders are committed anywhere (the exception for plans before 2026-09-28 ends): finished videos people should watch go up as release files or on the hosted page**
  - note: decided in conversation (2026-10-04), choosing the recommended way over a single fresh commit; extends D-213
- **D-306** (step ?) How does the decision log scale to thousands of decisions? → **Owner answers stay binding; accepted agent calls become history, raised again only when a change touches the lines their commits wrote; a component's binding decisions can be folded into a section of spec.md the owner approves, which a plan then cites instead of each id**
  - note: decided in conversation (2026-10-04), built without a plan video
- **D-309** (step ?) The walkthroughs still open at the release: watch each, or accept them as they are? → **Accepted as they are, given in conversation, not watched; `reel audit` treats a walkthrough the owner has accepted as settled history: its rule breaks are notes (△), not failures, and a walkthrough not yet accepted is held to every rule**
  - note: decided in conversation (2026-10-05)
- **D-310** (step ?) What does the public repo hold, and what is it called? → **The public repo is ncrispino/reelplanning, lowercase, and its main is one commit holding the current tree (`scripts/release/make-public.mjs` builds it, never pushes it); this private repo keeps its full history as an internal archive and is renamed first (e.g. to reelplanning-dev), since GitHub names ignore case. From then on all work happens on the public repo, with an ordinary history on top of that first commit: no later exports. This replaces D-305's slimmed history for the public repo; D-305's other half stands: no voice files or renders are committed anywhere. Commit ids the record cites name the development history, which is not public, and the public repo's .reelplanning/README.md says so**
  - note: decided in conversation (2026-10-08); supersedes in part D-305 (its slimmed public history, with the record's commit citations rewritten), so it is not linked as superseding it: D-305 stays active for its rule that no voice file or render is committed anywhere; the owner renames this repo and creates the public one
- **D-311** (step ?) How does a pull request reach the full suite, and what else does it need before it merges? → **The full suite runs on every push to a pull request, with no label: a PR's checks are green or red for its code, never red for waiting on a maintainer. `.github/workflows/ci.yml` holds the tests (the fast and full suites) and starts only on pushes; `reel pr-check` and the video branch's cleanup move to `.github/workflows/pr.yml`, which also runs when the PR's text or labels change, so no such event records a skipped test check (GitHub counts a skipped required check as passed). Main requires a pull request with one approving review, and the fast suite, the full suite and `reel pr-check` passed on its last commit, up to date with main; the owner may merge their own with the admin bypass. The maintainer runs `reel pr-check --merge` before merging (the PR template), not CI**
  - note: decided in conversation (2026-10-08); supersedes D-296 (the full-suite job failing at once until a maintainer added `ready-to-merge`), and D-297 in part (ci.yml stays the tests' workflow; the pull request's checks move to pr.yml), so D-297 is not linked as superseded and stays active for the tests' workflow's name
- **D-312** (step ?) What is the project called? → **reelplanner, said "reel planner": the npm package, the command `reelplanner` (`reel` stays), the GitHub repo ncrispino/reelplanner, the case-studies repo ncrispino/reelplanner-case-studies (its site at ncrispino.github.io/reelplanner-case-studies), the Claude Code plugin and its marketplace, a repo's project folder `.reelplanner/`, the machine's folder `~/.reelplanner` and the settings `REELPLANNER_*`. The old names are still read for a while: a repo's `.reelplanning/` when it has no `.reelplanner/` (said once, with the `git mv .reelplanning .reelplanner` that renames it), `~/.reelplanning` while there is no `~/.reelplanner`, a `REELPLANNING_*` setting, in the shell or a .env file, when its new name is unset, and the `reelplanning` command, which says the new name on stderr and runs it. The review page keeps its saved marks' storage keys (`reelplanning:annotations:…`), so a review begun before the rename is still there after it**
  - note: decided in conversation (2026-10-08); it changes the name D-310 gave the public repo and the code chip D-186 shows, which are not linked as superseded: their other rules stand. The record's history keeps the old name as written: the entries before D-312, the plans, the reviews and the videos' narration. The owner renames the GitHub repos (GitHub redirects a renamed repo's old address; a GitHub Pages site's old address is not redirected)
- **D-313** (step 5) How far should remote reviews go? → **Local loop + portable exports**

## Earlier calls this diff changes

- none

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | Archive answered script rounds in monotonic `review-N` folders; preserve unchanged rounds exactly | Replacing a previous review or renewing its timestamp | A changed explanation needs new evidence, while a repeated command must not erase existing answers | `scripts/fresh-eyes.mjs`, `scripts/test/fresh-eyes.spec.mjs` |
| A2 | 1 | Concatenate repeated visible-content sections in source order and include the complete latest review | Dropping later visible sections or truncating review context at 4,000 characters | Both workers need every requirement that the versioned review claims to cover | `scripts/lib/terms.mjs`, `scripts/lib/scene-content.mjs`, `scripts/fresh-eyes.mjs` |
| A3 | 2 | Attribute regions only through unique selectors in a strict supported grammar | Guessing the region from an approximate CSS match or adding another browser pass | Advice must not point to the wrong region or add repeated measurement work | `scripts/lib/frame-layout.mjs`, `scripts/test/frame-scaffold.spec.mjs` |

## The diff

Read it yourself: `git diff 76a36fe..HEAD -- scripts packages/player templates skills/plan-to-video/references eval/pipeline-cost/2026-10-12-codex-batched-pilot.md eval/pipeline-cost/2026-10-12-codex-batched-pilot.json eval/pipeline-cost/LEDGER.md` (from the repository root). The files it touches:

```
.../2026-10-12-codex-batched-pilot.json            | 414 ++++++++++++++++++++-
 .../2026-10-12-codex-batched-pilot.md              |  73 +++-
 eval/pipeline-cost/LEDGER.md                       |   2 +
 packages/player/reelplanner-player.js              |  11 +-
 packages/player/test/controls.spec.mjs             |  48 +++
 packages/player/test/quiz.spec.mjs                 |  20 +-
 scripts/frame-packet.mjs                           |  20 +-
 scripts/frame-scaffold.mjs                         |  12 +
 scripts/fresh-eyes.mjs                             |  44 ++-
 scripts/lib/frame-layout.mjs                       |  39 +-
 scripts/lib/frame-scaffold.mjs                     |  73 ++++
 scripts/lib/markdown-source.mjs                    |  17 +
 scripts/lib/plan-md.mjs                            |  19 +-
 scripts/lib/scene-content.mjs                      |  17 +
 scripts/lib/terms.mjs                              |  26 +-
 scripts/test/frame-scaffold.spec.mjs               |  99 +++++
 scripts/test/frame-tools.spec.mjs                  |   6 +
 scripts/test/fresh-eyes.spec.mjs                   |  48 +++
 scripts/test/guide.spec.mjs                        |  18 +
 scripts/test/package.spec.mjs                      |  17 +
 scripts/test/run.mjs                               |   2 +-
 scripts/test/terms.spec.mjs                        |   8 +-
 skills/plan-to-video/references/authoring.md       |  13 +
 skills/plan-to-video/references/frame-scaffold.md  |  59 +++
 skills/plan-to-video/references/frame-shell.md     |  13 +
 skills/plan-to-video/references/frames.md          |  34 ++
 templates/guide/guide.css                          |   2 +-
 templates/reelplanner/theme/scaffolds/flow.css     |  25 ++
 28 files changed, 1109 insertions(+), 70 deletions(-)
```
