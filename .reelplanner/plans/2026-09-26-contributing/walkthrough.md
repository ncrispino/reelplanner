# Walkthrough: Several people, one repo: contributing with reelplanning

**Status:** implemented on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (the approval folded
into step 1, `61fafa1`) · **Started from:** `61fafa1` · **Decided:** choices or size only (D-214); asked,
the maintainer can make it (D-200); the last answer (D-201); CI's checks and a code check (D-202); the built
video never in git (D-213), on a throwaway branch (D-215); ids in order with a merge rule (D-171)

**Commits:** 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc (steps 1 to 5 in code, the templates, walkthrough.md, the code check,
the walkthrough video; the guide reads its diffs from them)

## Categories of change

What landed, by kind (the plan guide's Built side reads this list: each kind's files, and the commits that are its).

- **The PR check** {pr-check} (`scripts/pr-check.mjs`, `scripts/lib/contributing.mjs`, `bin/reel.mjs`, `bin/reelplanning.mjs`) (step 1): `reel pr-check` says where a pull request stands against the line for a video, its videos against their text, and what lands on main.
- **Who decides** {who-decides} (`scripts/reel.mjs`, `scripts/lib/memory.mjs`, `.reelplanning/config.json`, `templates/reelplanning/config.json`) (step 2): a contributor's walkthrough review is their own check; a maintainer's counts.
- **Watching a contributor's video** {watching} (`scripts/review.mjs`) (step 3): `reelplanning review <folder>` serves a packed video folder as it is, and says when its plan map is not the checkout's.
- **Decision numbers** {renumber} (`scripts/renumber.mjs`) (step 4): `reel renumber` puts the branch's new decisions after the base's last.
- **The templates** {templates} (`CONTRIBUTING.md`, `templates/CONTRIBUTING.md`, `.github/pull_request_template.md`, `templates/pull_request_template.md`, `templates/gitignore`, `.gitignore`, `.gitattributes`) (step 1): when a pull request gets a video, and the lines a shared repo adds.
- **CI** {ci} (`.github/workflows/`) (step 5): the fast suite on every push, `reel pr-check` and `reel audit` on every pull request, the full suite once it is ready to merge (untested on GitHub).
- **The skill and the docs** {skill} (`skills/plan-to-video/SKILL.md`, `docs/`, `README.md`): the skill's Several people section.
- **Tests** {tests} (`scripts/test/`): `contributing.spec`, new; `memory.spec` changed.

## What was done, per step

### Step 1 — When a PR gets a video, and who makes it ✅

**You can now:** tell contributors when a pull request needs a video, and who makes it.

- **The templates:** `templates/CONTRIBUTING.md` (the section "Contributing with reelplanning": when a PR
  gets a video, who makes it, who decides, what lands on main, where the built video goes, decision
  numbers, before a merge) and `templates/pull_request_template.md` (the two boxes: "makes a choice a
  reviewer could make the other way: <name it>" and "brings a video", and the maintainer's list). This repo
  has both: `CONTRIBUTING.md` (a short part about this repo, then the template's section as it is) and
  `.github/pull_request_template.md`. `README.md` links `CONTRIBUTING.md`.
- **The line, as decided (D-214), with the approval folded in:** `reel pr-check` (`scripts/pr-check.mjs`,
  `reel pr-check` in `scripts/reel.mjs`) crosses the line on the ticked box (naming the choice written after
  it), the `needs-video` label, or over 300 changed lines outside tests, docs, videos and generated files
  (A1). `no-video` waives it. A new flag, a new command (a file new under `bin/` or `scripts/`) or a new
  dependency in `package.json` is only named, "seen in the diff, not a reason by itself": Omar's 25-line
  `--quiet` passes on a normal code review. The PR's text and labels come from the GitHub event (CI), `gh
  pr view`, or `--body-file` and `--labels`.
- **Who makes the video (D-200):** over the line with no plan folder carrying a video's text, it says
  "needs a video: the contributor brings one, or a maintainer's agent makes a walkthrough from the diff
  (the skill's "Several people"), or a maintainer adds `no-video`", as waiting, not a failure (A2). The
  box "brings a video" ticked with no such plan folder is a failure. The skill's new "Several people"
  section (`skills/plan-to-video/SKILL.md`) tells the agent to copy the templates when a repo is shared,
  and how to make a walkthrough of a PR with no video of its own (a plan folder `<date>-pr-<n>/` from `gh pr
  diff` and `gh pr view`).
- D-127: `CONTRIBUTING.md` and the PR template use plain words; D-085: the plan's two commands, one flag
  and two labels, and nothing else new.

### Step 2 — Who does what, and what lands on main ✅

**You can now:** have only a maintainer's review count, and keep only a PR's plan and record on main.

- **Maintainers:** `.reelplanning/config.json` lists `maintainers: ["owner"]` (A3); the template's
  `templates/reelplanning/config.json` has an empty list, with a line saying what it is for. Read by
  `maintainersOf` and `isMaintainer` in `scripts/lib/contributing.mjs`.
- **A contributor's walkthrough review adds nothing to the log:** `reel record` (`scripts/reel.mjs`) files
  it and writes its `reviews/<id>.md` as always, prints "a contributor's walkthrough review (… is not in
  config.json's maintainers …): its accepts and flags help fix things before the PR, and add nothing to the
  decision log", and adds none of its calls. A maintainer's accepted calls join the log. A plan review's
  answers join it whoever gave them, and D-201 needs nothing new: the entry changed on the branch reads
  the last answer, final once on main (D-171).
- **What lands, what stays:** `reel pr-check` prints the two columns ("lands on main: … plan.md,
  walkthrough.md, code-check/findings.md, the videos' text …, the log's new entries, the maintainer's
  reviews"; "stays in the PR: the contributor's reviews"), and fails "not tidy" while a PR whose
  walkthrough a maintainer accepted still carries a contributor's review. `--tidy` removes them (the
  `.json` and its `.md`) in one commit, "tidy: the contributor's reviews stay in the PR's history", and
  refuses before a maintainer has accepted a walkthrough. `CONTRIBUTING.md` says Squash and merge.
- The ledger's writer moved into `writeLedger` (`scripts/lib/contributing.mjs`), shared by `reel record`
  and `reel renumber`, writing the same `decisions.md` as before. D-106: the contributor's own memory stays
  in their home folder; D-128 untouched.

### Step 3 — Watching a contributor's video, checking it, and where it lives ✅

**You can now:** watch and check a contributor's video without building it again.

- **Serving a packed folder:** `reelplanning review <folder>` (`scripts/review.mjs`) serves a folder
  `bundle-player` packed (it has `library.json` and the player) as it is, packing nothing again; Send files
  the review in the inbox of the repo it is run in. It compares each packed video's `plan-map.json` with the
  checkout's (`plans/<plan>/video/` or `walkthrough-video/`) and says "its plan map is the checkout's", or
  "this video was built from another version of the plan … ask for a rebuild", or that the checkout has
  none (run it in the PR's checkout). With `--detach` while this repo's server already runs, it says to stop
  that one first.
- **CI's checks (D-202):** `reel pr-check` compares each video's plan map with `plan.md` by hash (the plan
  text the map carries: title, problem and steps) and each row of `walkthrough.md` with its stop (chose,
  instead of, why, check), and fails a video built before the last change to either (A4, A5); every stop
  with no row and every row with no stop is named. On this repo's current walkthrough videos it reads
  them all as built (better-visuals 29 rows, details-in-the-frame 10). `reel audit` runs in CI on each
  plan folder the PR adds (`.github/workflows/ci.yml`). The maintainer's own code check (D-001) is in
  `CONTRIBUTING.md` and the skill's section, not code.
- **No media under a plan folder (D-213):** `reel pr-check` fails a PR that adds a voice file, an image or
  a video under `.reelplanning/plans/` (`MEDIA` in `scripts/lib/contributing.mjs`). `templates/gitignore`
  holds the lines that leave each video's `assets/`, `capture/` and audio metadata out; this repo's
  `.gitignore` has them, with its plan folders from before kept as they are (A6).
- **The throwaway branch (D-215):** the commands, as the plan gives them, are in `CONTRIBUTING.md` (from
  the template) and the skill's "Several people" (documented steps, no new command, D-085). `reel pr-check`
  looks for `video/pr-<n>` on the PR's own remote (`git ls-remote`) while a maintainer still has to watch
  it, and says when it is missing. The job that deletes it when the PR closes is `video-branch` in
  `.github/workflows/ci.yml`.

### Step 4 — Records that merge: decision numbers, generated files, the glossary ✅

**You can now:** merge two branches' decision logs with one command, `reel renumber`.

- **`reel renumber` (D-171)** (`scripts/renumber.mjs`): takes the base's log as it is, adds the branch's
  own entries after its last (A7), carries over a base entry the branch superseded, rewrites the new ids'
  mentions in the branch's plan folders (`plan.md`, `walkthrough.md`, `reviews/*.md`, all at once so
  D-194 → D-195 → D-196 never chain), lists the video lines that still say an old id, writes
  `decisions.md` and runs `terms-index` again. It reads the branch's log from the file, or, while
  `decisions.json` is in conflict, from the side that holds the branch's entries. `--dry-run` says what it
  would do.
- **`reel pr-check`** fails when an id on the branch names a different entry than on the base, or the log
  holds an id twice.
- `docs/project-dir.md`'s first rule gains the line: an id is final once it is on main; its tools table
  has `pr-check` and `renumber`, and `config.json`'s `maintainers`.
- **Memory with several reviewers:** a line waiting in `you.pending.jsonl` moves only into the file of the
  reviewer it names (A8; `mineToMove` in `scripts/lib/memory.mjs`), and `.gitattributes` marks the file
  `merge=union`. D-106 kept: memory stays per person.
- Plan folders, reviews, `glossary.md`, `spec.md`, `system.json`: nothing new, as the plan says.

### Step 5 — CI, the merge, and the system video ✅ (the workflow untested in CI)

**You can now:** run the fast tests on every push and the full suite before each merge.

- **`.github/workflows/ci.yml`** (D1): `fast` runs `npm test` (Node 20, `npm ci`, Chromium) on every push
  to main and every PR push; `reel pr-check` runs on every PR event but its closing (labels change what it
  says), with `reel audit` on each plan folder the PR adds; the full suite's job (`full`) runs `npm run test:full` and `reel
  pr-check --merge` once `ready-to-merge` is on the PR, on every push after it, and fails at once without
  it (A9); `video-branch` deletes `video/pr-<n>` when a PR from this repo closes. The pr-check and full
  jobs check out the PR's own last commit, not GitHub's merge with the base (a clash of decision ids would
  leave no merge to check out).
- **`publish.yml`** already runs `npm run test:full` on the tag; `docs/releasing.md` says the same suite is
  the check before every merge.
- **The system video (D-003)** is rebuilt on main after merges by a maintainer, once for every PR merged
  since, as the plan says: not a workflow (it needs the voice engine, Kokoro, and a browser, several
  minutes a merge). `CONTRIBUTING.md`, `docs/lifecycle.md`'s new "Several people" and the workflow's header
  say so; `reel status` already says when the video is behind.
- **Before merging** the maintainer's list is in `CONTRIBUTING.md` and the PR template.

## Decisions in force

- **D-214** holds: `scripts/pr-check.mjs` counts the box, `needs-video` and the 300 lines; a new flag is
  named only (the approval, folded into step 1).
- **D-200** holds: "needs a video" names both ways; the skill's "Several people" says how a maintainer's
  agent makes a walkthrough from a PR (`skills/plan-to-video/SKILL.md`).
- **D-201** holds: `reel record` adds a plan review's answers whoever gave them; the last answer is the
  entry on the branch.
- **D-202** holds: `reel pr-check` and `reel audit` in `.github/workflows/ci.yml`; the maintainer's code
  check in `CONTRIBUTING.md`.
- **D-213** holds, delivered by **D-215**: `templates/gitignore`, the media check, and the throwaway
  branch's commands and delete job.
- **D-171** holds: `scripts/renumber.mjs`, and the id check in `scripts/pr-check.mjs`.
- **D-003** holds: the system video rebuilt on main after merges, documented, no workflow. **D-065**,
  **D-001**, **D-106**, **D-127**, **D-110**, **D-083**, **D-085**, **D-107** hold as the plan says.
- Untouched: **D-082**, **D-197**, **D-198**, **D-199**, **D-084**, **D-109**, **D-128**, **D-129**,
  **D-024**, **D-194**, **D-195**, **D-196**, **D-169**, **D-170**, **D-216**, **D-217**, **D-218**.
- Decided after this walkthrough (in conversation, 2026-10-04), so not part of its build: **D-305** (a slimmed
  public history; no voice files or renders committed from then on) holds in part: the system video's voice and
  chapter files are ignored (`.reelplanning/system-video/.gitignore`) and `reel case-study keep` refuses a site
  history that holds them (`scripts/case-study.mjs`), but the slimmed history itself is not built yet, and the
  voice files of plans before 2026-09-28 stay committed until it is. **D-306** (rules binding, accepted calls as
  history, `reel fold`) holds: `reel check` asks a plan to cite only rules, `--base` raises the accepted calls
  whose lines a diff changes, and `reel fold` drafts a component's section of `spec.md` (`scripts/reel.mjs`).

## The agent's own calls

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

## Tests

- `scripts/test/contributing.spec.mjs` (new, in `scripts/test/run.mjs`'s script list), 39 checks against a
  scratch repo with a bare `origin`: the line (Omar's `--quiet` under it and named; the box, `needs-video`,
  304 lines over it; `no-video`; `--merge`), a real rebase stopping at `decisions.json` and `reel renumber`
  fixing it, media, a stale plan and a stale row, a contributor's and a maintainer's walkthrough reviews,
  not tidy and `--tidy`, memory lines per reviewer, `.gitattributes`, and `review` serving a packed folder.
- `scripts/test/memory.spec.mjs`: its copy of this repo's record drops `maintainers` (it is one person's
  repo; with them its `owner@example.com` reviews read as a contributor's).
- `npm test`: all 28 specs pass (88.8 s here).

## Code check

A fresh agent (`claude -p`, with only the brief's prompt, and write access to `code-check/findings.md` alone)
checked `6ffbc60..HEAD` over this plan's paths (`scripts/pr-check.mjs`, `scripts/renumber.mjs`,
`scripts/reel.mjs`, `scripts/review.mjs`, `scripts/lib/memory.mjs`, `scripts/lib/contributing.mjs`, `bin/`, the
four templates, `CONTRIBUTING.md`, `.github/`, `.gitignore`, `.gitattributes`, `.reelplanning/config.json`,
`docs/`, `README.md`, the skill, and the three specs), leaving out the system video and the other videos'
label commits (`7dd6937`, `a62dcf7`, `ca173ab`): **steps 5 of 5 ✓, decisions 33 of 33 ✓ (D-197, D-198 and
D-199 read as not in the diff's files: they are about videos), unexplained 0 ✗** (`code-check/findings.md`).
It named `ci.yml` in place of `test.yml` as the off-plan change D1 already logs. Nothing to answer.

## Not done

- **CI has never run on GitHub.** `.github/workflows/ci.yml`'s YAML parses, and the commands it runs pass here
  (`npm test`, `reel pr-check`, `reel audit`); its first real run is the first PR after this merges.
- **The owner's, in the repo's settings** (Not in this plan: branch protection): create the labels
  `needs-video`, `no-video` and `ready-to-merge` (only a maintainer can add a label), and mark the `full suite`
  check required (Settings → Branches), so a PR merges only when the full suite passed on its last commit.
- **Open point: who counts as `owner` once a second person reviews** (A3, A8). `maintainers: ["owner"]` counts every
  review named `owner`. The hosted page names whoever published it `owner`, so a second person who reviews a
  walkthrough on their own hosted page is `owner` too, and their accepts would join the log as a maintainer's.
  Fine while one person reviews; once a second does, `maintainers` needs something that tells them apart (an
  email or an id per maintainer, and the hosted page naming its reviewer by it). Not decided here: a question
  for the next plan that touches reviews.

## For the guide

*Written after the build, for the guide (D-265): how each step works, drawn; worked examples, each from a run saved in
`runs/`; and what the video leaves out. Nothing above this section was changed. The runs were made on 30 Sep 2026 in a
scratch repo with an origin, set up as `scripts/test/contributing.spec.mjs` sets its own up (Omar's 25-line `--quiet`,
a 301-line change, two branches that each take D-001), with the code as it is on that day. Added on 30 Sep 2026 after
the guide's first review round, still after the build: the two parts below, which runs were made in the scratch repo,
and what the open point under Not done became since; and, under step 1, what "over the line" means, said first.
Above this section, the steps' "You can now" lines were added for the guide (30 Sep), and the open point's lead
says "who counts as `owner`" for "who `owner` is" (30 Sep, the same point in plainer words). Added after the guide's
second review round (30 Sep): step 1's run of this repo's own change as a pull request (`runs/this-repo-as-a-pr.txt`,
made in a worktree of this repo, not the scratch repo), and what became of A3 since. Changed after the third round (30 Sep):
that run's example says which nine commits it checks (the plan's own six, and three made in between) and why it fails,
as its run's first line does; "over the line" says the box as the pull request template words it today; step 3's first
example says what matching means; and above this section, step 5 says `full` is the full suite's job.*

**Ran in a scratch repo:** `runs/pr-check-*.txt`, `runs/record-contributor.txt`, `runs/renumber-dry-run.txt`,
`runs/renumber.txt` — a scratch repo with an `origin`, set up as `scripts/test/contributing.spec.mjs` sets its own up:
Omar's 25-line `--quiet`, a 301-line change, and a port branch whose first decision takes the same number as main's;
the plan `2026-09-27-port` and the files `../pr.md` and `../ws.json` they name are that repo's.

#### Since then

- **Open point: who counts as `owner`**: answered in code on 27 Sep (`eed4d14`, `3f5c919`): `maintainers` takes `id:<id>`,
  the viewer id the hosted page sends, so a second person reviewing on their own hosted page is no longer counted as
  the owner; `owner` beside it covers only reviews recorded before ids were kept, and this repo's `config.json` lists
  the owner's id and `owner`.
- **A3**: changed on 27 Sep: this repo's `maintainers` is no longer `["owner"]` but the owner's hosted-page id
  (`cd9d233`), with `owner` beside it (`3f5c919`), which counts only for reviews recorded before ids were kept.

**In one sentence:** a pull request now says for itself whether it needs a video and who makes it, only a
maintainer's review changes the decision log, and two branches' decisions merge with one command.

```diagram
flow: A pull request, from opened to merged
contributor (person) -> the pull request: code, and the template's two boxes
the pull request -> reel pr-check: on every push | CI runs it and says whether the pull request is over the line
reel pr-check -> a code review: under the line | none of the three: a normal code review, no video
reel pr-check -> needs a video: over the line | its box ticked, the needs-video label, or over 300 lines of code
needs a video -> the walkthrough video: the contributor's, or a maintainer's agent's
needs a video --> no video: a maintainer adds no-video
the walkthrough video -> a maintainer's review: only this one counts | only a maintainer's review changes the decision log
a maintainer's review -> ready-to-merge: the full suite runs | once a maintainer adds the label: the full suite and reel pr-check --merge, on the PR's last commit
ready-to-merge -> main: squash and merge | after reel pr-check --tidy takes out what stays in the pull request
reel pr-check = reel pr-check | scripts/pr-check.mjs
needs a video = needs a video | #step-1
a maintainer's review = a maintainer's review | #step-2
```

### For step 1 — When a PR gets a video

```diagram
flow: Is a pull request over the line?
a pull request -> over the line: any one of three | the box ticked, naming the choice; a maintainer's needs-video label; or over 300 lines of code
a pull request -> a code review: none of them
over the line -> needs a video: until one comes | the contributor brings one, or a maintainer's agent makes it from the diff
over the line --> no video: a maintainer's no-video
over the line = over the line | #step-1-examples
```

"Over the line" means a pull request needs a video: its box is ticked, naming a choice you'd notice or can't easily
undo (the pull request template's words since walkthroughs-that-help's step 4; this plan's box said "a choice a reviewer
could make the other way"); a maintainer added the `needs-video` label; or it changes over 300 lines of code. "Under
the line", none of the three: a normal code review. Any other choice goes under the template's "Other choices", a
line each, and needs no video: a maintainer ticks them accepted.

What counts toward the 300 lines is code only: tests, docs, videos, the project record (`.reelplanning/`), lock files
and anything `.gitattributes` marks generated or documentation are left out.

#### Worked examples

##### Omar's 25-line --quiet
- **Input:** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
- **What happens:** 25 lines, the box not ticked, no label: a normal code review. The new flag is named, "seen in the
  diff", and does not count on its own.
- **Output:** `runs/pr-check-small.txt`

##### The same PR, its box ticked
- **Input:** `reel pr-check . --base origin/main --body-file ../pr-ticked.md --labels ""`
- **What happens:** the box names a choice a reviewer would notice (the port, 8790), so it is over the line at 25
  lines. With no video it is waiting, a △, not a failure.
- **Predict:** CI runs it again with `--merge` once `ready-to-merge` is on the PR. Still no video: what then?
- **Output:** `runs/pr-check-ticked.txt`, `runs/pr-check-ticked-merge.txt`
- **Edge cases:**
  - A maintainer's `no-video` label waives it, even at `--merge`: `runs/pr-check-no-video.txt`.
  - The box "brings a video" ticked with no plan folder carrying one fails at once.

##### A big change, most of it tests and docs
- **Input:** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
- **What happens:** 301 lines of code, 500 of tests, 200 of docs, a lock file, and a new dependency (3 lines of
  `package.json`). Only 304 count.
- **Output:** `runs/pr-check-big.txt`

##### This repo's own change, as a pull request
- **Input:** `reelplanning pr-check ../ReelPlanning-at-97052cc --base 61fafa1`
- **What happens:** the nine commits from where the plan started (`61fafa1`) to its last (`97052cc`), checked as one
  pull request in a worktree of this repo: the plan's own six, and three made in between for other work (`ca173ab` the
  glossary, `7dd6937` meanings across plans, `a62dcf7` the system video). The first two also touched better-visuals and
  details-in-the-frame, which is why those plans are listed too. 623 lines of code in 13 files: over the line. Each
  video the commits touch matches its text or was approved, what lands on main is listed (nothing stays in the pull
  request), and no decision number clashes. It fails (exit 1) on 23 files the plan committed in its own folder before
  the rule it brought in, as a pull request would today: its walkthrough video's 22 voice files and one picture (the
  built video goes on `video/pr-<n>`).
- **Output:** `runs/this-repo-as-a-pr.txt` (lines 2-3)
- **Edge cases:**
  - This repo's plan folders dated up to 2026-09-27 keep their videos committed (A6: `.gitignore`'s exceptions), so
    git keeps these files; `pr-check` does not read those exceptions and holds every pull request to the rule, so
    these commits, sent as a pull request today, fail on them, as this run shows. They reached the branch as commits,
    not through a pull request.

#### What else was considered

- A new flag, a new command or a new dependency as a reason on its own. It would have sent Omar's 25-line change to a
  video; they are named instead, for the reviewer to weigh (A1).

#### Files and commands

- `LINES` and `NOT_CODE` in `scripts/pr-check.mjs`; `templates/pull_request_template.md` and
  `templates/CONTRIBUTING.md`, copied to `.github/pull_request_template.md` and `CONTRIBUTING.md` here.

### For step 2 — Who does what, and what lands on main

Since this was built, the open point under Not done, who counts as `owner` once a second person reviews, has been answered in
code: `maintainers` names each maintainer by the viewer id the hosted page sends (below, under What breaks it).

```diagram
flow: Whose review changes the record
a walkthrough review -> maintainers?: reel record reads config.json
maintainers? -> the decision log: what a maintainer accepted joins it
maintainers? -> the PR only: anyone else's; --tidy takes it off
reel record = reel record | scripts/reel.mjs
```

#### Worked examples

##### A contributor approves a walkthrough
- **Input:** `reel record .reelplanning/plans/2026-09-27-port ../ws.json`
- **What happens:** sam approves the walkthrough and accepts A1. sam is not in `maintainers`, so the review is filed
  and read like any other, and adds nothing to the log.
- **Predict:** the log held one entry before. How many after?
- **Output:** `runs/record-contributor.txt`

##### The two columns
- **Input:** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
- **What happens:** on the port branch: its plan and walkthrough land on main; sam's two reviews stay in the PR. (It
  also fails, on the decision numbers: step 4.)
- **Output:** `runs/pr-check-clash.txt` (lines 5-6)

#### What breaks it

- `maintainers` once listed only `owner`, and the hosted page calls whoever published it `owner`, so a second person
  reviewing on their own page would have counted as a maintainer: the open point under Not done, as it stood on 26
  Sep. It has since been answered in code:
  `maintainers` takes `id:<id>`, the viewer id the hosted page sends, and `owner` beside it covers only reviews
  recorded before ids were kept (`maintainersOf`, `maintainerOf` in `scripts/lib/contributing.mjs`, commits `eed4d14`
  and `3f5c919`); this repo's `config.json` lists the owner's id and `owner`.

### For step 3 — Watching a contributor's video, checking it

```diagram
sequence: CI checks a video against its text
reel pr-check -> the video's plan-map.json (file): the plan it was built from, hashed
reel pr-check -> plan.md (file): hashed now
note reel pr-check: the same hash: its plan map matches; else built from another version: rebuild it
reel pr-check -> walkthrough.md (file): each row of choices
reel pr-check -> the video's stops: each row against its stop
```

#### Worked examples

##### A video that matches its plan
- **Input:** `reel pr-check . --base origin/main --body-file ../pr-ticked.md --labels ""`
- **What happens:** the port branch now carries its walkthrough video's text, and the video still matches it: the
  plan the video was built from is `plan.md` as it is now (the same fingerprint), and its one row of choices says what
  its stop in the video says. Nothing fails; it waits for a maintainer to accept the walkthrough.
- **Output:** `runs/pr-check-video-fresh.txt`

##### A line of plan.md changed after the video was built
- **Input:** `reel pr-check . --base origin/main --body-file ../pr-ticked.md --labels ""`
- **Predict:** one step's sentence changed; nothing else did. Does CI notice?
- **Output:** `runs/pr-check-video-stale.txt`
- **Edge cases:**
  - A row of `walkthrough.md` that reads otherwise than the video's stop fails the same way ("A1 reads otherwise than
    its stop").
  - A voice file, an image or a video added under `.reelplanning/plans/` fails: the built video is never committed
    (D-213).

#### Limits

- `reelplanning review <folder>` serves a packed video folder to watch; it runs a server, so there is no saved run of it
  here.

### For step 4 — Records that merge

```diagram
sequence: Two branches both took D-001
main -> main: D-001, the cache plan's answer
port branch -> port branch: D-001, the port plan's answer
reel pr-check -x port branch: D-001 names another entry on main
port branch -> reel renumber: after the rebase
reel renumber -> port branch: main's log, then its own after the last: D-001 becomes D-002
note reel renumber: frames that still say the old id are listed, not changed
reel renumber = reel renumber | scripts/renumber.mjs
```

#### Worked examples

##### The clash, found
- **Input:** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
- **Output:** `runs/pr-check-clash.txt`

##### What renumber would do, then doing it
- **Input:** `reel renumber . --base origin/main --dry-run`
- **What happens:** main's log is taken as it is, and the branch's one entry goes after main's last, D-001 → D-002. Its
  mentions are rewritten in the port plan's `walkthrough.md` and its review, all at once, so a chain (D-194 → D-195 →
  D-196) is never renumbered twice.
- **Output:** `runs/renumber-dry-run.txt`, `runs/renumber.txt`
- **Edge cases:**
  - While `decisions.json` is in conflict, renumber reads the branch's entries from the side of the conflict that
    holds them.

#### Why it works this way

An id is final once it is on main (D-171). So the branch always moves, never main, and the only question is what the
branch's new entries become; the answer is always "after main's last".

### For step 5 — CI and the merge

```diagram
flow: The four jobs, and when each runs
a push to main -> fast: npm test
a pull request push -> fast
a pull request push -> reel pr-check: and reel audit
a pull request push -> full: with ready-to-merge | npm run test:full and reel pr-check --merge; without the label it fails at once
a pull request closed -> video-branch: deletes video/pr-<n>
```

#### Worked examples

##### The workflow's jobs
- **Input:** `grep -n -A2 "^  [a-z-]*:$" .github/workflows/ci.yml`
- **What happens:** the four jobs and the condition each runs under.
- **Output:** `runs/ci-jobs.txt`

#### Limits

- The workflow has never run on GitHub; its YAML parses and the commands it runs pass here. Its first real run is the
  first pull request after it merges (Not done).
- The system video is rebuilt by a maintainer after merges, not by CI: it needs the voice engine and a browser, several
  minutes a merge.
