# Code check brief: 2026-11-18-find-the-gaps

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanner/plans/2026-11-18-find-the-gaps/code-check/findings.md`.

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
# Code check: 2026-11-18-find-the-gaps

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

## Commits (95a5bdb..HEAD)

```
037d06b Find the gaps: question 5 worded apart from earlier decisions
01c7372 Find the gaps: the walkthrough, its runs, and a re-answered card settled again
76cc466 Find the gaps, step 5: into the loop, and measured
6cbef4a Find the gaps, steps 2 and 3: the round on the review page
35ab170 Find the gaps, step 4: align record, where each settled gap goes, and the spec
dfab7f3 Find the gaps, step 1: reelplanner align, a round's cards and their checks
```

## The plan, as implemented

Read `.reelplanner/plans/2026-11-18-find-the-gaps/plan.md` in full. Its title is "Find the gaps: line up your picture, the agent's and the code", with 5 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-170** (step 4) How is where we end up judged? → **Rubric, blind judge, your rank**
  - note: yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-021, with the owner's approval in conversation on 2026-10-04
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
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes nothing (D-084, D-083 and D-041 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-220** (step 2) Which choices make it pause? → **i dont like specifically saying 'five' i mean i think there's a lot that changes per plan i dont think being too specific is good**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): never superseded (it was linked to D-221 by mistake), active again; supersedes D-084, with the owner's approval in conversation on 2026-10-04
- **D-221** (step 2) What does Approve make of a choice on the list? → **Listed, not judged**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-041 only (D-220, D-214 and D-133 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-222** (step 3) Does the walkthrough test you? → **Where there's something to predict**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-083, with the owner's approval in conversation on 2026-10-04
- **D-223** (step 4) Does a small pull request's choice need the video? → **Only a choice you'd notice**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-214, with the owner's approval in conversation on 2026-10-04
- **D-224** (step 5) How do the plan and what was built sit together? → **One row, a Plan | Built switch**
- **D-225** (step 2) What becomes of a fresh-eyes finding nobody has answered? → **Answered before you see it**
- **D-226** (step 3) How do you find out what a phrase means? → **Those, and Ask about this**
- **D-227** (step 5) Which videos get fresh eyes? → **Every new one, and the system video now**
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
- **D-264** (step 3) Where does the guide open from the video? → **Under the video, on the same page: scrolling down reads the guide while the video shrinks to a small player that stays in view; the video is never replaced**
  - note: decided in conversation (2026-09-30), after the plan guide was built: the owner found the guide pages unclear and asked for them to be redone for clarity, with the guide under the video
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
- **D-314** (step 2) Where do a round's cards show up first? → **like said earlier commnet we should support multiple modalities here, but same backend for doing the review (maybe with minor adjustments based on how the user gives the feedback, if later they want to for example draw what they are thinking and intereact more that cant be done in text but can in html and video)**
- **D-315** (step 3) Who reads your spoken explanation against the code? → **The waiting session**
- **D-316** (step 4) After Got it, when does the same card return? → **Once more, a few days later**
- **D-317** (step 5) How often does a round come ahead of a plan? → **When a gap is likely and costly**

## Earlier calls this diff changes

- none

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 4 | Keep a Got it in `~/.reelplanner/you.jsonl` as a line marked `kind: "knows"`, which `readYou` skips and the new `readKnows` reads [hard-to-undo] | A file of its own beside `you.jsonl`, or unmarked lines every reader of the file would count as a review | The plan names your memory's file; marking the line keeps every review count, memory line and dedup as it was | `scripts/lib/memory.mjs` `readYou`, `readKnows`, `appendKnows` |
| A2 | 1 | A checker answer of `?` (its lines do not decide it) stops the round like a disagreement, saying "quote the lines that do" [close] | Treating `?` as no answer, or as agreement | The first real round showed it: two of three cards quoted too few lines to decide them, which is a card that would teach a guess | `scripts/lib/align.mjs` `checkRound`, `checkerAnswers` |
| A3 | 1 | `align --check` fails while any predict card has no checker answer; `--no-checker` checks the rest first [visible] | Making the checker a warning, or a separate command | A card reaches you only when the agent and the checker agree (step 1); `--no-checker` lets the brief be written from cards that already pass | `scripts/align.mjs`, `checkRound({ checker })` |
| A4 | 1 | A card's `- source:` is one `path:from-to` range, read as pinned [close] | Several ranges a card | One range a card keeps the back of the card one block of code, and the checker's brief one block to read; a card that needs two files is two cards | `scripts/lib/align.mjs` `refOf`, `linesOf` |
| A5 | 4 | A due card comes back as one more card in the first round three days on: `--check` warns on a due card and asks for `- once_more: <fingerprint>`; Got it on it is "known for good" (`asked: 2`) [close] | A second card the tool adds by itself | The agent writes the new case (other names, the same rule); the tool can only say which thing is due | `scripts/lib/align.mjs` `knowsFor`, `checkRound`, `recordAnswers` |
| A6 | 4 | You told me first is a `## You told me first` section put before the plan's first `### Step`, made when absent [visible] | At the end of plan.md | It is what the plan is written on, so it reads before the steps | `scripts/lib/align.mjs` `appendSection` |
| A7 | 2 | The record merges answers by card, and each card's settlement is routed once (`routed` in answers.json) [close] | Routing every time `record` runs | The page sends answers as they come and Send sends them all again; a Got it must not land twice in your file | `scripts/lib/align.mjs` `recordAnswers` |
| A8 | 4 | Show me more's one video is a command the agent runs, `align --explain-gaps` printing `reelplanner explain "<the gaps, from what you expected>" <their files> --depth low` [visible] | Building the explainer from inside `align record` | An explainer is built like any video (narration, frames, fresh eyes); the record stays seconds | `scripts/lib/align.mjs` `explainGaps` |
| A9 | 2 | The round page is `/round/?r=<name>` on the review server, `reelplanner review <round>` opening it with no video bundled; any round of the repo is served by name [visible] | A row in the video library | A round is no video: it has no frames or narration to bundle, and one server per repo serves both | `scripts/review.mjs` (`rounds`, `roundOnly`), `scripts/lib/align-server.mjs` `roundAsset`, `roundByName` |
| A10 | 2 | Send files the round as an inbox row of kind `align`, delivered with a start that never starts anything [hard-to-undo] | A row of its own folder, or a page-only record | `review --wait` already wakes the waiting session on an inbox row; giving it a no-op start keeps the rule that a round never starts a headless run | `scripts/lib/align-server.mjs` `api/round/send`, `scripts/inbox.mjs` `roundNote` |
| A11 | 3 | Your spoken words on a say card go to the waiting session as an inbox question of kind `say` that carries the `align answer` command; the page polls for the claims [close] | The server splitting words into claims itself | Splitting and checking need reading the code (D-315: the waiting session does it); questions already never start a headless run | `scripts/lib/align-server.mjs` `api/round/say` |
| A12 | 3 | Talking is written down by the local whisper (`whisper-cli` + `ggml-small.en.bin`), with no model saying "type your words instead" [visible] | A hosted speech-to-text | Nothing you say leaves the machine; the model narration installs is already there | `scripts/lib/align-server.mjs` `transcribe` |
| A13 | 2 | A settled card moves on by itself; a card you had the same picture on moves on after two seconds [close] | A Next press after each | One key a card is the least effort; Next stays for a card you want to read | `packages/player/align-page.html` `settle`, `draw` |
| A14 | 5 | (asked: the plan's question 5) Whether a plan had a round is a `**Round:**` line the skill writes in the plan's header (a round's folder, `none, a likely, costly gap (<why>)`, or `none needed`), with a round's own `**Plan:**` line counting too [hard-to-undo] | A record of each judgement kept by a command | The comparison needs the plans where a likely gap had no round, which only the agent knows when it writes the plan; one header line is readable and costs nothing | `scripts/lib/align.mjs` `roundLineOf`, `roundStats` |
| A15 | 5 | A late fix counts against the plan whose call was changed later (`plan` added to each miss); a step reworked after a walkthrough check counts once, as its Expected something else [close] | Counting a reworked step as both | The four kinds of surprise should not count one thing twice | `scripts/lib/memory.mjs` `findMisses`, `scripts/lib/align.mjs` `roundStats` |
| A16 | 5 | The quick check's settle row sits inside its "Expected something else?" box, and pressing Change the plan or The code is wrong relabels that box and focuses it; words typed with no way chosen are Change the plan's [visible] | A row of its own on the frame | The box is already placed on the frame by the layout; the plan says its words become Change the plan's | `packages/player/reelplanner-player.js` `syncSettle`, `settleQuiz`, `saveDisagree` |
| A17 | 5 | A quick check settled Got it with no words sends no rewrite of its step; The code is wrong or Change the plan with no words asks the agent to ask how [close] | Sending every missed check as "explain this step so the answer is obvious", as before | Got it says the reviewer had it wrong, not that the step was unclear; left unsettled, it is sent as before | `scripts/lib/review-scope.mjs` `reviseScope` |
| A18 | 5 | Show me more on a quick check with no worked example marks it "asked to have it explained again" (`unclear`) [close] | A button that does nothing there | That is the existing explain-again path the revise already reads | `packages/player/reelplanner-player.js` `settleQuiz` |

## The diff

Read it yourself: `git diff 95a5bdb..HEAD` (from the repository root). The files it touches:

```
.../align/2026-11-18-review-reaches-agent/align.md |  57 +++
 .../checker/answers.md                             |   3 +
 .../checker/brief.md                               |  69 ++++
 .../checker/round-1/answers.md                     |   3 +
 .../checker/round-1/brief.md                       |  55 +++
 .../2026-11-18-review-reaches-agent/sources.json   |  51 +++
 .../plans/2026-11-18-find-the-gaps/plan.md         |   8 +
 .../2026-11-18-find-the-gaps/runs/align-cards.txt  |  18 +
 .../runs/align-check-quote.txt                     |   5 +
 .../runs/align-checker.txt                         |  27 ++
 .../2026-11-18-find-the-gaps/runs/align-due.txt    |   8 +
 .../2026-11-18-find-the-gaps/runs/align-record.txt |  28 ++
 .../2026-11-18-find-the-gaps/runs/align-start.txt  |   5 +
 .../2026-11-18-find-the-gaps/runs/real-round.txt   |   9 +
 .../runs/reel-status-rounds.txt                    |  15 +
 .../2026-11-18-find-the-gaps/runs/review-round.txt |  29 ++
 .../plans/2026-11-18-find-the-gaps/walkthrough.md  | 330 +++++++++++++++
 .reelplanner/system.json                           |   2 +-
 docs/project-dir.md                                |   3 +
 docs/reference.md                                  |  29 ++
 docs/status.md                                     |   1 +
 package.json                                       |   1 +
 packages/player/align-page.html                    | 193 +++++++++
 packages/player/reelplanner-player.js              |  39 +-
 packages/player/test/quiz.spec.mjs                 |  24 ++
 scripts/align.mjs                                  | 137 +++++++
 scripts/inbox.mjs                                  |  12 +
 scripts/lib/align-server.mjs                       | 133 ++++++
 scripts/lib/align.mjs                              | 454 +++++++++++++++++++++
 scripts/lib/memory.mjs                             |  24 +-
 scripts/lib/review-scope.mjs                       |   6 +-
 scripts/reel.mjs                                   |  14 +-
 scripts/review.mjs                                 |  35 +-
 scripts/test/align-page.spec.mjs                   | 150 +++++++
 scripts/test/align.spec.mjs                        | 193 +++++++++
 scripts/test/run.mjs                               |   2 +-
 skills/plan-to-video/SKILL.md                      |  53 ++-
 37 files changed, 2201 insertions(+), 24 deletions(-)
```
