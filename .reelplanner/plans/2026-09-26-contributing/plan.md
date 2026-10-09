# Several people, one repo: contributing with reelplanning

## The problem

The owner:

> "Sure contributing is good we should specify that. Each PR above certain complexity we would prefer a
> video for it and updated system video too? This is actually important, how do we use reelplanning to
> plan (here, for this repo itself so it's kinda meta) when multiple users"

on the first version of this plan:

> "do you think this might minimize contributions if we require this kind of thing? like make it less
> likely for people to help out? how do we balance that? also a general thing is this is not just for us
> working on this repo, but in fact for any repo where there is one person using reelplanning and we
> want to share it"

and on the second:

> "the point is the pr shouldnt add slop, it should appear very clean" · "but isnt it heavy to carry each
> video with the branch" · "maybe a merge requires full suite i guess like isnt that the point so we know
> it doesnt break"

and on the third:

> "eh idk i still feel like small ones just not needed really? what do you think" · "would B be easy to
> do? also i dont know if we want in the git history though thats the main question"

`reelplanning` assumes one person per repo: they write each plan with their agent, review its videos,
and merge. That stops working as soon as the repo is shared, whether one person uses `reelplanning` and
the others don't, or several people do. This plan is how `reelplanning` works in any shared repo; this
repo is the first to use it. Five things break.

- **Nothing says when a pull request (PR) gets a video, or who makes it.** There is no
  `CONTRIBUTING.md`, no PR template, and no check. And asking for videos has a cost: someone fixing a bug
  may have no `reelplanning`, no agent and no voice engine, and a rule that asks for them turns that
  person away.
- **Nothing says who reviews what, or what a merged PR leaves on main.** A contributor who plans with
  `reelplanning` answers their own plan's questions; the maintainer reads every PR before merging. Today
  both are the owner, so nothing says whose review counts, what happens when they disagree, or which of
  their files a merge should keep.
- **A maintainer cannot watch someone else's video, or tell whether it is right, and carrying the video
  is heavy.** The hosted review page is private to whoever published it. A video built by someone else
  could be out of date, or say something the code does not do. And a built video in git stays there for
  good: this repo's `.git` is 893 MB, with 538 MB of media tracked, 373 MB of it in 779 voice files.
- **The records collide.** The decision log numbers its entries in order across the repo (`reel record`
  takes the next number). Two branches made from main at D-193 each record their own D-194. A real run,
  in a scratch copy of this repo's `.reelplanning/` (two branches, one plan and one review each, then
  both merged into main), stops at the second merge:

  ```
  CONFLICT (content): Merge conflict in .reelplanning/decisions.json
  CONFLICT (content): Merge conflict in .reelplanning/decisions.md
  <<<<<<< HEAD
  | D-194 | 2026-09-27 | 2026-09-27-cache | 1 | q1 | **In the repo** | active |
  =======
  | D-194 | 2026-09-27 | 2026-09-27-port | 1 | q1 | **8790** | active |
  >>>>>>> sam
  ```

  Keeping both lines, the obvious fix, leaves two D-194s, and a later plan that cites D-194 then means
  two things. `terms-index.json` (written by every build) and the system video (brought up to date after
  every accepted walkthrough, D-003) collide the same way.
- **No tests run on a PR.** `.github/workflows/publish.yml` runs on version tags only, and runs no tests.

## What changes

Three changes, in five steps. `reelplanning` ships what any shared repo needs: three files as templates,
the checks in `reel`, and a "Several people" section in the skill.

1. **When a PR gets a video, and who makes it** (step 1): only when it makes a choice a reviewer could
   make the other way, or changes over 300 lines (D-214), a line in `CONTRIBUTING.md` that `reel
   pr-check` can read; the contributor brings the video, or the maintainer makes it (D-200).
2. **Who reviews what, what lands on main, and where the video lives** (steps 2 and 3): the maintainer's
   review is the one that counts, and a merged PR adds only the plan, its final decisions (D-201), the
   walkthrough and that review; the maintainer watches and checks a video without rebuilding it (D-202);
   the built video stays out of git's history (D-213), on a throwaway branch that is never merged
   (D-215).
3. **Records that merge, and what runs before and after a merge** (steps 4 and 5): decision numbers as
   decided (D-171), the generated files, the fast suite on every push and the full suite before every
   merge, and the system video rebuilt on main.

Steps 1 to 4 each stand alone. Step 5 runs the checks of steps 1 to 4 in CI.

## Steps

### Step 1 — When a PR gets a video, and who makes it

*Stands alone.*

`reelplanning` ships two templates, `templates/CONTRIBUTING.md` (a section, "Contributing with
reelplanning") and `templates/pull_request_template.md`. The skill's "Several people" section tells the
agent to copy them into a repo when it is shared. This repo is the first.

**The line, as decided (D-214): choices or size.** A PR gets a video only when it does one of these:

- **makes a choice a reviewer could make the other way**: a default, a command or flag, a file format, a
  data shape, a dependency the package ships;
- **is large**: over 300 changed lines outside tests, docs, videos and generated files.

**Which files it touches no longer counts.** A bug fix that makes no choice merges on a normal code
review, whatever part it is in, and brings no video. A maintainer can still ask for a video on any PR.

`reel pr-check [--base origin/main]` reads the line, in two parts:

- **the size**, exactly: the changed lines outside tests, docs, videos and generated files;
- **the choice, as a person says it**: the PR template asks the contributor to tick "makes a choice a
  reviewer could make the other way" and name it, and the maintainer, who reads every PR anyway, can add
  the `needs-video` label.

**A new flag alone is not a choice that needs a video** (the plan review of 2026-09-27 08:31, on quick
check 1: "eh but i still feel like the flag here is simple enough such that not needed here for vid").
What the check can see in the diff, a command or flag new to the CLI or a dependency added to
`package.json`, never crosses the line by itself: `reel pr-check` only names it, as a reminder to whoever
ticks the box or adds the label. The line is the ticked box, the `needs-video` label, or over 300 lines.

Two labels, and only a maintainer can add a label on GitHub: `needs-video` asks for a video on any PR;
`no-video` waives one the check asked for by mistake. `reel pr-check` reads them from the PR (`gh pr view
--json labels`, or the event CI hands it), then what the PR carries: a plan folder, its videos' text,
their reviews, and the video's branch (step 3). It prints one line each: whether the PR crosses the line
and why ("412 lines", "ticked: a choice", "`needs-video`"), what it saw that is not a reason by itself ("a
new flag: `--dry-run`"), and what is missing (with the checks of steps 3 and 4).

Examples:

- PR #42, "Serve the review page on port 8790", changes 20 lines of `scripts/review.mjs`. The port by
  default is a choice, so it crosses the line; Sam ticks the box and brings the video.
- PR #43 fixes a one-line bug in `scripts/reel.mjs`, with its test. No choice, 2 lines: it merges on a
  normal code review, with no video.
- Priya's PR #57 fixes a bug in 40 lines of the review player (the case in the last review's quick
  check). No choice, under 300 lines: no video, a normal code review.
- Omar's PR #58, 25 lines, adds a flag, `--quiet`, to the `reel` CLI, and leaves the box unticked. A flag
  that simple is not a choice worth a video: `reel pr-check` names the new flag and passes, and it merges
  on a normal code review. Had the maintainer thought otherwise, `needs-video` would ask for one.
- A typo fix in `docs/lifecycle.md` never crosses the line.

**Who makes the video**, as decided (D-200): the PR asks for one, and the maintainer can make it instead.
Two cases, and nobody is turned away:

- **The contributor plans with `reelplanning`** (Sam): they bring a plan folder with two videos. A plan
  video, which they reviewed themselves before writing the code, where a wrong choice costs least; and a
  walkthrough video of the code.
- **The contributor doesn't** (a newcomer's PR #44): they open the PR as on any GitHub repo and leave "This
  PR brings a video" unticked in the template. The maintainer asks their agent for a walkthrough of the PR (the skill's
  "Several people" section): it writes the PR's `walkthrough.md` from the diff and the PR's text (`gh pr
  diff 44`, `gh pr view 44`), each choice the PR makes as a row, in a plan folder
  `.reelplanning/plans/<date>-pr-44/`, and builds the walkthrough video as for any plan.
- `reel pr-check` reports a PR over the line with no video as "needs a video", not as the contributor's
  failure: it can merge once a maintainer has reviewed a video from either side, or added `no-video`.

### Step 2 — Who does what, and what lands on main

*Stands alone. Decided: the last answer (D-201).*

`CONTRIBUTING.md` names two roles. A **contributor** opens a PR. A **maintainer** can merge; maintainers
are listed in `.reelplanning/config.json` as `maintainers`, each as `reel record` writes a reviewer:
`owner`, `id:<id>` for a hosted page's viewer, or an email.

**Who does what**, with one PR, #42 by Sam:

1. **Sam, the contributor, plans.** Sam's plan asks "Which port by default?"; Sam answers 8790 in their
   own plan review, and the answer is an entry in the decision log on Sam's branch.
2. **Sam checks their agent's choices, for themselves.** Sam's agent builds it and makes one choice
   alone, A1: "the port is taken: try the next one". Sam accepts A1 in the walkthrough and opens the PR.
   Sam's accepts and flags help Sam fix things before the PR; they decide nothing.
3. **The owner, a maintainer, reviews the PR, and that review is the one that counts.** The owner always
   reads a PR before merging, and the walkthrough video is how (step 3): it stops on each choice the
   agent made alone. The owner flags A1: "fail with a message instead". The flag reaches Sam as a comment
   on the PR; Sam's agent changes A1 on the branch; the owner accepts it, and merges.

When the owner disagrees with one of Sam's plan answers (the owner would keep 8787), the log keeps the
last answer (D-201): Sam's agent changes the code and the entry on the branch, which then reads 8787,
"changed after the maintainer's review". An entry is final only once it is on main (D-171), so `reel
record` needs nothing new for it.

**What lands on main: only what counts.** A merged PR adds the plan, its final decisions, the walkthrough
and the maintainer's review. The contributor's working reviews, and anything the maintainer overruled, stay
in the PR:

| Lands on main | Stays in the PR (its branch, and its commits on GitHub) |
|---|---|
| `plan.md`, with each question's final answer | the contributor's plan reviews (their first answers) |
| the plan's entries in the decision log, as they read at the merge: the last answers | the contributor's walkthrough reviews (their accepts and flags) |
| `walkthrough.md`, and the code check it answers (`code-check/findings.md`) | a choice or answer the maintainer changed, as it first read |
| the maintainer's walkthrough reviews; their accepted choices join the log | |
| the videos' text (step 3) | |

The built videos are in neither: they ride on a throwaway branch, deleted after the merge (step 3).

For PR #42: on Sam's branch, `reviews/` holds Sam's plan review, Sam's walkthrough review and the owner's
two walkthrough reviews (the flag, then the accept). Main gets the owner's two. The log on main has "which
port? → 8790" and A1 as the owner accepted it, "fail with a message", never Sam's "try the next one".

How:

- **A contributor's walkthrough review adds nothing to the log.** In a repo whose `config.json` lists
  `maintainers`, `reel record` files a walkthrough review by someone not listed, and writes its
  `reviews/<id>.md` (the flags for their agent to fix), as today; its accepted choices do not join the
  decision log. A maintainer's do. A plan review's answers join the log whoever gave them: they are the
  plan's decisions, and D-201 keeps the last.
- **`reel pr-check --tidy`**, run once the maintainer has accepted the walkthrough, removes from the
  branch, in one commit, the review files of anyone not in `maintainers` ("tidy: the contributor's reviews
  stay in the PR's history"). Without `--tidy`, `reel pr-check` prints the two columns above for the PR,
  and fails "not tidy" while a PR with a maintainer's accepted walkthrough still carries the second.
- **Squash and merge.** `CONTRIBUTING.md` says a PR is merged with GitHub's "Squash and merge", so main
  gets one commit per PR, not the contributor's working commits. GitHub keeps a merged PR's commits on its
  page (`refs/pull/42/head`) after the branch is deleted, so Sam's reviews and first answers stay where
  anyone can read them.
- The repo's memory (`reel memory`, from every plan's `reviews/`) then learns from the maintainers'
  reviews; a contributor's own stays in their home folder (D-106).

What is kept as it is: every review is filed once, never overwritten, under its reviewer
(`recorded.reviewer`).

### Step 3 — Watching a contributor's video, checking it, and where it lives

*Stands alone; its checks run in CI with step 5. Decided: CI's checks, and a code check (D-202); the built
video stays out of git's history (D-213), on a throwaway branch (D-215).*

**Watching needs no rebuild.** A built video is HTML and its voice files; nothing in it needs making
again. The maintainer runs `reelplanning review` on it, which only serves those files on localhost
(`scripts/review.mjs`): no voice engine, only Node. The page's Send puts the review in the maintainer's
own inbox; `reel-intake` files it in the PR's plan folder, and the maintainer commits it to the PR branch
(GitHub's "allow edits by maintainers", on by default for a PR from a fork). A hosted review page will
not do: it is private to whoever published it, so **a contributor who sends the maintainer the link to
theirs shows them nothing, not even the video**.

**Checking it, as decided (D-202): two checks, neither rebuilds anything.**

- **CI, on every PR, in seconds.** `reel pr-check` checks that the video was built from the PR's plan
  as it is now: each video's plan map (written by the build: the plan's text and every stop) against
  `plan.md` by hash, and each row of `walkthrough.md` against its stop. A video built before the last
  change to either fails. `reel audit` checks that `walkthrough.md` covers every step and decision and
  answers every finding.
- **The maintainer's own code check, in minutes, before accepting a walkthrough they did not build.** A
  fresh agent reads the code against the plan, in the PR's checkout (`gh pr checkout 42`, then
  `reelplanning code-check <plan-dir> --base origin/main` and the prompt from `--prompt`). Its findings
  become the maintainer's flags; they are not committed.

A rebuild only when one of them disagrees with the video, and it is the contributor's to do (or, for a PR
with no video of its own, the maintainer's agent's).

**Where the built video lives, as decided: never in main's history (D-213), on a throwaway branch
(D-215).** "i dont know if we want in the git history though thats the main question": we don't. A built
video in git stays there for good: this plan's video is 16 MB in git (15 MB of voice files, fonts and a
screenshot; 1 MB of text), a walkthrough video 17 to 50 MB, and each rebuild that changes a line adds that
line's new voice file. This repo's `.git` is 893 MB, with 538 MB of media tracked, 373 MB of it in 779
voice files. So:

- **The PR's branch carries only the videos' text:** `BRIEF.md`, `STORYBOARD.md`, `SCRIPT.md`, the frames'
  HTML and `plan-map.json`, about 1 MB for this plan's video. `templates/gitignore` holds the lines that
  leave the rest out (each video's `assets/`, `snapshots/`, `capture/` and its audio files' metadata), and
  the skill copies them into a shared repo's `.gitignore`. `reel pr-check` fails a PR that adds a voice
  file, an image or a video under `.reelplanning/plans/`.
- **The built video goes on a second branch, `video/pr-42`, that is never merged.** Once the PR is open
  (so its number is known), the contributor's agent packs the videos with `bundle-player` (the voice as
  MP3, the player beside it) and pushes the packed folder as a branch of its own. The simplest way is a
  fresh repo in that folder: its one commit shares nothing with main, and the PR's checkout is not
  touched (a `git worktree add --orphan` needs the files copied in, and `git subtree` needs them committed on
  a branch first, which is what this avoids):

  ```sh
  url=$(git remote get-url origin)            # for a PR from a fork, this is the fork
  reelplanning bundle-player ../pr-42-video <plan-dir>/video <plan-dir>/walkthrough-video
  cd ../pr-42-video
  git init -q -b video/pr-42 && git add -A && git commit -qm "PR #42: its videos"
  git push --force "$url" video/pr-42
  ```

  The agent then writes the maintainer's two lines (below, with the URL filled in) into the PR's text. A
  rebuild runs the same again: `--force` replaces the branch's one commit, so the branch always holds
  just the latest video.
- **The maintainer clones just that branch beside the PR's checkout, and serves it:**

  ```sh
  git clone -q --depth 1 -b video/pr-42 <url> ../pr-42-video
  reelplanning review ../pr-42-video           # in the PR's checkout, so Send lands in its inbox
  ```

  `git fetch origin video/pr-42` and `git worktree add ../pr-42-video FETCH_HEAD` do the same in two
  commands, but keep the video in the maintainer's own `.git` until git cleans it up; the clone is one
  command, and deleting the folder removes it. `reelplanning review` today takes only a built video and
  packs it itself; it learns to serve a folder `bundle-player` already packed, as it is, and says so when
  that folder's plan map is not the checkout's `plan-map.json` (a video built from another version of
  the plan).
- **After the merge, the branch is deleted:** `git push origin --delete video/pr-42`. A job in
  `.github/workflows/test.yml` runs it when the PR closes, merged or not. A branch in a contributor's fork
  was never in this repo; the contributor deletes it when they like.

**What "never lands in main" means for a clone**, from a real run in a scratch copy (a bare repo as
`origin`, main holding this plan's text; this plan's video packed and pushed as above):

| | `.git` of a fresh clone |
|---|---|
| main alone (`git clone --single-branch`) | 224 KB |
| a full `git clone` while `video/pr-42` exists | 4.3 MB |
| a full `git clone` after `git push origin --delete video/pr-42` | 224 KB |

The packed video is 67 files, 5.4 MB (the voice 13.7 MB as WAV, 3.5 MB as MP3), about 4 MB once git
compresses it. Main's history never holds it. A plain `git clone` takes every branch, so while a PR from
this repo is open a full clone downloads its video too, about 4 MB a video; once it is merged and the
branch deleted, nobody does. A PR from a fork never adds it to this repo's clones. GitHub may keep a
deleted branch's files on its own servers for a while, but no clone gets them.

**Would it be easy?** Yes, and easier than the zip: every step is a command an agent runs, where the zip
needed a person to drag it into the PR's page, since GitHub has no command to attach a file there. The
contributor's agent runs five lines, the maintainer two, and the deletion runs by itself. What it costs:

- the code: `reelplanning review` serving a packed folder as it is, and the delete job;
- a second push per PR, and a forced push on each rebuild;
- from a fork, the video's branch is in the fork, so the maintainer clones from the fork's URL: the line
  in the PR's text has it;
- once the branch is deleted, the built video is gone. Watching it again after the merge means building
  it from its text on main (`reelplanning build`, with the voice engine), where a zip would have stayed
  on the PR. That is the price of nothing in git.

Why not the others: a zip attached to the PR is a person's step on every video; a GitHub release asset
needs write access to the repo, which a contributor from a fork does not have, and releases are for
versions. A CI workflow's artifact would need CI to voice the video, and Git LFS keeps the files for good
under the account's quota.

**This repo's own videos:** the ones already committed stay as they are. They are in the history either
way, and removing them from the tree would not make a clone any smaller. From the merge of this plan on, a
new plan's videos follow the rule (only their text is committed; the owner watches the built folder
locally, as today). The system video stays in the repo (Not in this plan).

### Step 4 — Records that merge: decision numbers, generated files, the glossary

*Stands alone. Decided: numbers in order, with a merge rule (D-171).*

Decision numbers stay in order across the repo, and the PR merged second fixes the clash with one
command. Example, the real run above: the cache PR merges first with its decision D-194; Sam's branch
wrote a D-194 too. `git rebase origin/main` on Sam's branch stops at the conflict in `decisions.json`,
then:

- **`reel renumber`** takes main's log as it is, adds the branch's own new entries after main's last
  (Sam's D-194 becomes D-195), and rewrites their mentions in the branch's plan folder (`plan.md`,
  `walkthrough.md`, `reviews/*.md`). It lists the video frames that say an old number; `reelplanning
  build` rebuilds them. It writes `terms-index.json` again too (below).
- `reel pr-check` (step 1) also fails when an id on the branch names a different entry on the base.
- `docs/project-dir.md`'s first rule gains a line: an id is final once it is on main.

The other records:

- **`terms-index.json`** is written by every build, from all the storyboards. **A conflict in it is never
  merged by hand: take main's copy, then run `reelplanning terms-index`**, which writes it again from
  every storyboard, both branches' words included. `reel renumber` does this.
- **Plan folders** are named by date and name, and `reel new-plan` refuses one that exists, so two
  branches clash only on the same date and name: pick another name.
- **Reviews** live in their plan's folder: no clash.
- **`glossary.md`, `spec.md`, `system.json`** are written by hand. A conflict keeps both rows; `reel
  check` on the plan after.
- **Memory** stays per person in each home folder (D-106). The repo's `you.pending.jsonl` holds one
  reviewer's lines until they move into that reviewer's file; with several reviewers, a line moves only
  into the file of the reviewer it names, and `.gitattributes` marks the file `merge=union` (both sides'
  lines kept).

### Step 5 — CI, the merge, and the system video

*Needs step 1's and step 3's `reel pr-check`, step 2's `--tidy`, and step 4's number check.*

"maybe a merge requires full suite ... so we know it doesnt break": yes. `.github/workflows/test.yml`
runs two suites.

- **The fast suite, on every push** (to a PR's branch, and to main): Node 20, `npm ci`, then `npm test`,
  the 19 script specs and the 8 player specs of the fast run in Chromium (the player loading and playing,
  its controls, a decision, a quick check, the band, the size, access, and answer-on-frame's quicker
  run); then `reel pr-check --base origin/main` and `reel audit` on each plan folder the PR adds.
- **The full suite, before every merge:** `npm run test:full`, all 19 script specs and 23 player specs,
  answer-on-frame's full pass as 4 shards side by side: about 5 minutes on 4 CPUs. It runs on a PR once
  a maintainer adds the `ready-to-merge` label (their review is done), and again on every push after it.
  It is the check the owner marks required in the repo's settings, so a PR merges only when the full
  suite passed on its last commit. Not on every push: 5 minutes of 4 CPUs on each push of a PR still being
  written is waiting nobody needs.
- **The full suite, on the release tag:** `publish.yml` runs `npm run test:full` before `npm publish`,
  which today runs no tests.
- **When a PR closes**, merged or not: a small job deletes its video's branch, `video/pr-<n>` (step 3).
- **Before merging**, the maintainer checks, as `CONTRIBUTING.md` and the PR template list them: both
  suites pass; a PR over the line has a video a maintainer has reviewed, or the `no-video` label; a
  contributor's own plan was reviewed before the code; their own code check found nothing left (D-202);
  `spec.md`, `system.json` and `glossary.md` say what changed. Then `reel pr-check --tidy` (step 2), and
  "Squash and merge".

**The system video, on main after the merge.** The system video is still brought up to date after every
accepted walkthrough (D-003); with several PRs open, it is done on main. A PR carries only the changes to
what the video is made from: `spec.md`, `system.json` and `glossary.md`. After a merge the maintainer runs
`reelplanning spec-diff` on main, rebuilds the frames it names with `reelplanning build
.reelplanning/system-video`, and commits once for every PR merged since. The video is behind only between
a merge and that commit, and `reel status` says so meanwhile. Why not in each PR: two PRs that touch one
chapter conflict in its frames and voice files, which git cannot merge. Why not a CI job: it needs the
voice and a browser in CI, several minutes per merge, for a rebuild one person can batch.

## Components touched

- **The reel CLI** — `reel pr-check`: the line (the size, the ticked box; a new dependency, command or
  flag only named), "needs a video", the `needs-video` and `no-video` labels (step 1); what lands on main, and
  `--tidy` (step 2); the videos' plan maps against `plan.md` and `walkthrough.md`, no media under a plan
  folder, and the video's branch (step 3); ids against the base (step 4). `reel record`: the `maintainers`
  list, and a contributor's walkthrough review adds nothing to the log (step 2). `reel renumber` (step 4)
- **The review server** — `reelplanning review <dir>` serves a folder `bundle-player` packed, as it is,
  and says when its plan map is not the checkout's (step 3)
- **The plan-to-video skill** — a short "Several people" section in `SKILL.md`: the templates to copy, a
  walkthrough of a PR with no video from its diff and text (step 1), who does what and what lands (step
  2), what the maintainer runs to watch and check a video, and the throwaway branch's commands (step 3), `reel
  renumber` (step 4)
- **The system video** — brought up to date on main after the merge, once for every PR merged since
  (step 5)

New files that are not areas: `templates/CONTRIBUTING.md`, `templates/pull_request_template.md` and
`templates/gitignore`, and in this repo `CONTRIBUTING.md`, `.github/pull_request_template.md`,
`.github/workflows/test.yml` (with the job that deletes a closed PR's video branch), `.gitattributes`; `.gitignore` gains the template's lines. `docs/lifecycle.md`
gains a section "Several people", `docs/project-dir.md` the rule on ids, `docs/releasing.md` the full
suite before a tag, and `README.md` a link to `CONTRIBUTING.md`.

## How each was decided

Reviewed 2026-09-27 08:31 UTC on the review page (verdict: approved; `reviews/plan-20260927T083137Z.md`),
watched through, no new video.

- **Your note on quick check 1** (step 1, Omar's 25-line PR #58 adding `--quiet`): "eh but i still feel
  like the flag here is simple enough such that not needed here for vid". Agreed: a new flag alone is not
  a choice that needs a video. Step 1 now says `reel pr-check` counts only the ticked box, the
  `needs-video` label and the 300 lines; a new flag, command or dependency it sees in the diff is named,
  never counted.

Reviewed 2026-09-27 05:01 UTC on the review page (verdict: changes requested;
`reviews/plan-20260927T050151Z.md`), then two follow-up questions answered in conversation the same day.

- **Where does a PR's built video live?** (was question 1, step 3) Attached to the PR, as a zip (D-213),
  the recommendation; your note: "would B be easy to do? also i dont know if we want in the git history
  though thats the main question". What D-213 decided holds: the built video never lands in git's
  history, and the PR's branch carries only its text. How it reaches the maintainer was then decided in
  conversation (D-215, below): a throwaway branch instead of a zip by hand. Step 3 answers "would it be
  easy" plainly (yes: every step is a command; what it costs is listed) and says what "never lands in
  main" means for a clone, from a real run.
- **When does a PR need a video?** (step 1; decided in conversation, 2026-09-27, after your note on quick
  check 1: "eh idk i still feel like small ones just not needed really? what do you think") Choices or
  size only (D-214), the recommendation: a choice a reviewer could make the other way, or over 300 lines.
  Touching a part's files no longer counts, so Priya's 40-line fix to the review player merges on a
  normal code review; a maintainer can still ask for a video on any PR (`needs-video`). Not chosen: only
  when the maintainer asks; keep today's line. Step 1 says it as decided, and `reel pr-check` reads the
  size and the choices it can see, not the part's files; `small-fix` gives way to `no-video`, for a check
  that asked by mistake.
- **How does the built video reach the maintainer?** (step 3; decided in conversation, 2026-09-27) A
  throwaway branch (D-215), the recommendation: the contributor's agent pushes the packed video to
  `video/pr-42`, never merged; the maintainer clones it and runs `reelplanning review`; it is deleted after
  the merge. This is how D-213's "not in the branch" is delivered, in place of the zip attached by hand.
  Not chosen: a zip attached by hand; a GitHub release asset. Step 3 gives the exact commands.
- **The rewind on step 3** (back from the video's weight in git to watching and checking): step 3 now
  says the two checks plainly, each by what it checks and how long it takes, deciding the same (D-202).
- **The quick checks** follow the new line: step 1's asks about a small PR that adds a flag.

Reviewed 2026-09-27 03:02 UTC on the review page (verdict: changes requested;
`reviews/plan-20260927T030251Z.md`).

- **How much does a PR ask of its contributor?** (step 1) Asked; the maintainer can make it (D-200), the
  recommendation. Step 1 says it as decided, in two cases.
- **When the maintainer disagrees with an answer from the contributor's plan, what does the decision log
  keep?** (step 2) The last answer (D-201), the recommendation. Step 2 says it as decided; the first answer
  stays in the contributor's review, which now stays in the PR (below).
- **How much does the maintainer check before trusting a contributor's video?** (step 3) CI's checks, and a
  code check (D-202), the recommendation. Step 3 says it as decided.
- **Your note on the owner's review** (quick check 2, step 2): "i think it might be cleaner this way. bc
  what if the pr has poor accept/reject and they behave differently, we might end up with a lot of slop
  instead of more targeted, the point is the pr shouldnt add slop, it should appear very clean". Agreed:
  step 2 now says what lands on main, the plan, its final decisions, `walkthrough.md` and the maintainer's
  review, which is the one that counts. The contributor's accepts and flags are advisory and add nothing to
  the log; their reviews stay in the PR (`reel pr-check --tidy`, then "Squash and merge").
- **Your note on watching from the branch** (quick check 3, step 3): "but isnt it heavy to carry each
  video with the branch". It is: 16 MB for this plan's video, in git for good, and `.git` is 893 MB. Step
  3 now asks where a PR's built video lives (question 1), recommending a zip attached to the PR, with only
  the videos' text in the branch; this repo's committed videos stay as they are.
- **Your note on CI** (quick check 5, step 5): "eh but maybe a merge requires full suite i guess like isnt
  that the point so we know it doesnt break". Yes: the full suite (`npm run test:full`, about 5 minutes)
  now runs before every merge, as the required check, and on the release tag; the fast suite on every
  push.
- **Rewinds on steps 1 and 2**: step 1 now says who makes the video as two cases, as decided; step 2 says
  each role by what it does, then what lands on main. Neither decides anything new.
- **The quick checks** now follow D-197: each comes after the next step's scenes (step 5's just before the
  ending) and asks about a case the video did not show.

Reviewed 2026-09-27 00:57 UTC on the review page (verdict: changes requested;
`reviews/plan-20260927T005745Z.md`).

- **How do decision numbers survive two branches?** (step 4) In order, with a merge rule (D-171), the
  recommendation. Step 4 now says it as decided, on the real run's numbers.
- **Who reviews a contributor's videos, and whose answer counts?** (was question 1, step 2) You asked to
  explain it more: "im confused by this like doesnt the person submitting the pr we assume to have
  reviewed it already? like the maintainer always has to read and do". Yes to both: the contributor has
  answered their own plan, and the maintainer always reads the PR, with the walkthrough video as the way
  to do it. Step 2 now says who does what with one PR, and asks only the choice left: question 2, what the
  log keeps when the maintainer disagrees with the contributor's answer.
- **Where does the maintainer watch a contributor's videos?** (was question 2, step 3) You asked to
  explain it more: "im again confused here bc will they need to rebuild the whole thing then? that is
  annoying for many reasons and for voice, right? but also the maintainer might go through and double
  check vid is correct before writing or something? bc what if the provided video is wrong". No rebuild:
  a built video is HTML and its voice files, and `reelplanning review` only serves them. Step 3 now says
  exactly what the maintainer runs, why a hosted link will not do, and three checks that a video matches
  the PR without rebuilding it. Where to watch is no longer a question; question 3 asks how much of the
  checking the maintainer does.
- **Your note on step 1**: "actually one question here, do you think this might minimize contributions if
  we require this kind of thing? like make it less likely for people to help out? how do we balance that?
  also a general thing is this is not just for us working on this repo, but in fact for any repo where
  there is one person using reelplanning and we want to share it". It might: step 1 now makes the balance
  question 1, with a way for the maintainer to make the video instead. And the plan is now for any shared
  repo: `reelplanning` ships the templates, and this repo is the first to use them.
- **The quick checks** (four of five missed) and a rewind on step 1: step 1 now says plainly that the
  check reads files, not the kind of change, so a one-line fix in a part crosses the line; step 2 that the
  maintainer's review is filed beside the contributor's, two reviews; step 3 that a private hosted page
  shows the maintainer nothing; step 4 that the terms index is taken from main and written again. Each
  quick check now tests the step's main idea on the case the step shows.

## Decisions in force

- **D-214** A PR gets a video only when it makes a choice a reviewer could make the other way, or changes
  over 300 lines; touching a part's files alone does not count, and a maintainer can ask for a video on
  any PR (decided in conversation, 2026-09-27; step 1).
- **D-200** A PR over the line asks for a video: a contributor who plans with `reelplanning` brings a plan
  video and a walkthrough; for one who doesn't, the maintainer's agent makes the walkthrough (decided in
  this plan's review; step 1).
- **D-201** When the maintainer disagrees with a contributor's answer, the log keeps the last answer,
  changed on the branch; the first stays in the contributor's review, in the PR (decided in this plan's
  review; step 2).
- **D-202** CI runs `reel pr-check` and `reel audit` on every PR, and the maintainer runs their own code
  check before accepting a walkthrough they did not build (decided in this plan's review; step 3).
- **D-213** A PR's built video never lands in git's history: the PR's branch carries only the videos'
  text (decided in this plan's review; step 3). Delivered by D-215, not by a zip attached by hand.
- **D-215** The built video goes on a throwaway branch, `video/pr-<n>`, never merged: the contributor's
  agent pushes it, the maintainer clones it and runs `reelplanning review`, and it is deleted after the
  merge (decided in conversation, 2026-09-27; step 3).
- **D-171** Decision numbers stay in order across the repo; the PR merged second runs `reel renumber`,
  and a number never changes once it is on main (decided in this plan's review; step 4).
- **D-003** The system video is brought up to date after every accepted walkthrough, mindful of the
  cost: kept; with several PRs, the maintainer does it on main after the merge, one rebuild for every
  PR merged since (step 5).
- **D-065** A comment on the system video that asks for the system to change: a small fix goes
  straight in, anything with a choice becomes a plan. Unchanged; a contributor follows it too.
- **D-001** A second agent checks that the code followed the plan: the contributor runs it, and the
  maintainer runs their own too (D-202, step 3).
- **D-106** Memory across repos is a file in each person's home folder: kept per person (step 4).
- **D-127** Plain words on screen: `CONTRIBUTING.md` and the PR template use them too.
- **D-110** At a step's fifth choice the implementer asks: unchanged for a contributor's agent.
- **D-082** A run nobody is watching stays in auto mode, inside the sandbox: untouched.
- **D-083** A quick check per step, and wherever there is something to predict: a contributor's
  videos keep them.
- **D-197**, **D-198**, **D-199** A quick check comes after the next step's scenes, on a case the video
  did not show; the build warns on one asked too soon or on the case just shown; new and revised videos
  take the rule: this plan's revised video follows it, and so do a contributor's.
- **D-084**, **D-109** What stops the walkthrough video: unchanged; a walkthrough of a PR with no video
  (step 1) stops by the same rules.
- **D-128** "You watched it" is kept in the browser and in your own file: per person, untouched.
- **D-129** Approving is never blocked by a wrong quick check: untouched.
- **D-085** Less scaffolding: this plan adds two commands (`reel pr-check`, `reel renumber`), a flag
  (`--tidy`), two labels (`needs-video`, `no-video`), three templates and four files in this repo, a job
  that deletes a closed PR's video branch, and no new stage.
- **D-107** A retro every five plans: untouched; a contributor's plans count like any other.
- **D-024** Detail pages start from a template: untouched.
- **D-194**, **D-195**, **D-196** A detail opens over the frame from the thing it explains: untouched
  (this plan's video has no details).
- **D-169**, **D-170** How the case study's arms are reviewed and judged: untouched.
- **D-216**, **D-217**, **D-218** Which words the build labels, what `check-terms` does with one said with no
  meaning, and how long a labelled word stays underlined (decided after this plan was written): untouched;
  `CONTRIBUTING.md` and the PR template are not videos.

## Not in this plan

- Memory per reviewer: `reel stops` counts accepted choices in a row across the log, whoever accepted
  them. A count per reviewer is a later plan.
- Branch protection and code owners on GitHub: the owner sets them in the repo's settings, once the
  test job exists.
- A hosted page several people can use at once.
- Moving this repo's committed videos out of its history, and the system video out of the repo: rewriting
  the history changes every commit id, and is a plan of its own.
