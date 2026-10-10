# Contributing to reelplanner

Thanks for helping. Every change starts with an [issue](https://github.com/ncrispino/reelplanner/issues)
(there is a form for a bug and one for an idea), and every pull request (PR) against `main` links the issue it
closes. A security problem goes to [SECURITY.md](SECURITY.md) instead. Everyone here follows the
[code of conduct](CODE_OF_CONDUCT.md).

## Set up

Node 22.20 or later. Fork the repo on GitHub, clone your fork, then in the clone:

```sh
npm ci
npx playwright-core install chromium          # the player specs' browser (on Linux, --with-deps adds its system libraries, with sudo)
node bin/reelplanner.mjs hyperframes-skills   # HyperFrames' skills at the pinned version: the narrate and build specs run them
```

Run this checkout's own tooling, never a published version: `node bin/reelplanner.mjs <command>` (or
`reelplanner <command>` after `npm link`), and `node bin/reelplanner.mjs reel <command>` for the project
record. `--help` after any command says what it takes. To build a video you also need ffmpeg, the voice and
whisper.cpp: `node bin/reelplanner.mjs setup` installs them (`--dry-run` first says what it would do). The
tests need none of these.

To try your change through an agent, install this checkout's skill into a scratch repo with `npx skills add
<this checkout> --skill plan-to-video -a claude-code` (run it in the scratch repo; `-g` puts it in your user's
skills instead), and tell the agent to run `reelplanner` (after `npm link`) where the skill says `$RP`.

## Run the tests

| Command | What it runs |
|---|---|
| `npm test` | the fast specs: every script spec and the core player specs, side by side (about 5 minutes on 4 CPUs) |
| `node scripts/test/run.mjs <name> …` | just these specs, by name (`narrate`, `answer-on-frame`) or path; `--list` names them all |
| `node scripts/test/run.mjs --full <name> …` | these specs' exhaustive run, as the full suite runs them |
| `npm run test:full` | every spec, exhaustive: what a release runs, and what a PR needs before it merges |

Run `npm test`, and the full run of the specs your change touches. A spec that fails says why and keeps its
temp folder; a failing spec is never flaky, so find the cause. A new spec goes in `scripts/test/` or
`packages/player/test/`, and in the lists in `scripts/test/run.mjs`. Specs work on scratch copies: the runner
fails a spec that changes a committed file under `videos/`, `.reelplanner/` or `eval/`.

## Find something to work on

- An open [issue](https://github.com/ncrispino/reelplanner/issues), or a bug you hit yourself (open an issue for it).
- **Other agents.** reelplanner is tested with Claude Code and has basic support for Codex. Support for
  GitHub Copilot, Cursor, OpenCode and Antigravity CLI, and the rest of Codex, is open work: [`docs/agents.md`](../docs/agents.md)
  lists each item with what to change, where, why and how to check it.
- **Good first contributions**, each small and on its own:
  - `reel pr-check --help` (and `reel renumber`, `reel build`, `reel case-study`) prints one line, while
    `reelplanner pr-check --help` prints the whole usage, with `--body-file`, `--labels` and `--json`. Make the
    `reel` form print the script's own usage (`scripts/reel.mjs`, its `--help`).
  - Checking Antigravity CLI (`agy`) loads the skill, and the skill's `compatibility:` frontmatter ([`docs/agents.md`](../docs/agents.md),
    items 11 and 6).
  - `reelplanner setup` on macOS, or on Windows under WSL: run `setup --dry-run`, then `setup`, and fix or write
    down what it misses (`scripts/setup.sh`). Native Windows is not supported yet.
  - A question the docs left you with. The docs are meant to answer it, so a fix to the page you were reading is a
    welcome PR.

## Open a pull request

1. Start from an issue: open one, or comment on the one you'll work on, so nobody does the same work twice.
   A typo fix too: a one-line issue is enough.
2. Branch from `main`, make the change in commits, and run the tests above.
3. Write the PR's text from the template, `.github/pull_request_template.md`, into a file such as `pr.md`: the
   issue it closes (`Closes #12`, or `Refs #12` if the issue stays open), what it does, the video box, and one
   line under "Other choices" for each small choice you made (a name, a default).
4. Check it as CI will. With this repo as a remote (`git remote add upstream <this repo's URL>`, then `git fetch
   upstream`): `node bin/reelplanner.mjs reel pr-check --base upstream/main --body-file pr.md`. It fails a PR
   that links no issue, says whether the PR is over the line for a video, and what waits for a maintainer; it
   exits 1 only on something marked ✗.
5. Push your branch and open the PR with that text.

**A video?** Most PRs need none: a bug fix, a typo, docs, a small flag. A PR gets a video, the walkthrough
video that shows the change running, when it changes over 300 lines outside tests, docs, videos and generated
files, or makes a choice you'd notice or can't easily undo (tick the box and name it). You don't have to make
it: if you don't plan with reelplanner, a maintainer's agent makes it from your diff. The rules, and how to
bring your own, are in "Contributing with reelplanner" below.

**What runs on a PR:** the fast and full suites on every push (`.github/workflows/ci.yml`), and `reel pr-check`
and `reel audit` on the plan folders the PR adds (`.github/workflows/pr.yml`, which also runs when the PR's text
or labels change). A PR merges once all three passed on its last commit and a maintainer approved it. A PR that changes the
install's path (the README, `package.json`, `setup`, the skill) also gets a fresh install in a bare Ubuntu and on
macOS (`.github/workflows/fresh-install.yml`), which reports but does not block; `scripts/release/ec2-fresh.sh` runs
the same check on a new EC2 machine, with your AWS credentials, for a branch you have not pushed. A version
tag runs the full suite again before publishing (`docs/releasing.md`).

**The maintainers** here are listed in `.reelplanner/config.json`: `owner`, the repo's owner as the
review page names them. `owner` is whoever published the review page, so on a page of their own a second
person is `owner` too; `reel record` warns, and keeps the viewer id the page sends (`id:…`), which goes in
`owner`'s place once a review has carried it.

This repo plans itself with reelplanner (`.reelplanner/`), so the section below applies here as in any
shared repo; it is `templates/CONTRIBUTING.md`, as the plan-to-video skill copies it.

## Contributing with reelplanner

This repo plans its changes with [reelplanner](https://github.com/ncrispino/reelplanner): a plan, and
the work done from it, are reviewed as short narrated videos. You don't need it to contribute. Open a pull
request (PR) as on any GitHub repo; this section says when a PR gets a video, and who makes it.

### When a PR gets a video

The video is the walkthrough video, which shows the change running and pauses at what you'd notice. A PR
gets one only when it does one of these:

- **is large**: over 300 changed lines outside tests, docs, videos and generated files.
- **makes a choice you'd notice or can't easily undo**: it changes what you see or do (a button moves,
  a key does something else), or it touches stored data and formats, permissions, or something other
  people's code relies on. Tick the box in the PR template and name the choice.

Any other choice a smaller PR makes (a helper's name, a file split in two, a default nobody sees) needs no
video: write it as one line under "Other choices" in the PR's text, what it chose instead of what, and the
maintainer accepts it there. `reel pr-check` waits until they tick "The other choices above are accepted".

A maintainer can also ask for a video on any PR (the `needs-video` label), or waive one (`no-video`). Only a
maintainer can add a label.

Everything else merges on a normal code review, with no video: a bug fix, a typo, a small flag. A new
flag or command alone is not a choice that needs one; `reel pr-check` names it and moves on.

### Who makes the video

- **You plan with reelplanner:** bring a plan folder, `.reelplanner/plans/<date>-<name>/`, with two
  videos. The plan video, which you review yourself before writing the code, where a wrong choice costs
  least; and the walkthrough video, which shows the change running and pauses at the choices your agent
  made on its own that you'd notice or can't easily undo, the rest a list at its end. Tick "This PR brings
  a video".
- **You don't:** leave the box unticked. If the PR is over the line, a maintainer's agent makes its
  walkthrough video from the diff and the PR's text. Nobody is turned away.

### Who decides

- A **contributor** opens a PR. A **maintainer** can merge; maintainers are listed in
  `.reelplanner/config.json` under `maintainers`.
- Your own plan review answers your plan's questions: those answers are the plan's decisions. If a
  maintainer disagrees with one, the change is made on your branch and the decision log keeps the last
  answer.
- Your own walkthrough review is a check for you: it helps you fix things before the PR, and decides
  nothing. **The maintainer's review is the one that counts.** It reaches you as comments on the PR; your
  agent fixes the code on the branch.

### What lands on main

A PR is merged with GitHub's **Create a merge commit**, so main keeps the PR's own commits rather than one
squashed commit. It adds the plan, its final decisions, `walkthrough.md` (with the code check it answers),
the maintainer's reviews, and the videos' text. Your own reviews are not among them: before merging,
`reel pr-check --tidy` removes them from the branch in one commit, so main's files never hold them (the
branch's earlier commits, now in main's history, still do).

### Where the built video goes

Never into git's history. The PR's branch carries only the videos' text (the lines in `.gitignore` leave
the rest out, and `reel pr-check` fails a PR that adds a voice file, an image or a video under
`.reelplanner/plans/`). Once the PR is open, your agent packs the built videos and pushes them to a branch
of their own, `video/pr-<number>`, that is never merged:

```sh
url=$(git remote get-url origin)            # for a PR from a fork, this is the fork
reelplanner bundle-player ../pr-42-video <plan-dir>/video <plan-dir>/walkthrough-video
cd ../pr-42-video
git init -q -b video/pr-42 && git add -A && git commit -qm "PR #42: its videos"
git push --force "$url" video/pr-42
```

Then it adds two lines to the PR's text, for the maintainer:

```sh
git clone -q --depth 1 -b video/pr-42 <url> ../pr-42-video
reelplanner review ../pr-42-video           # in the PR's checkout, so Send files the review there
```

A rebuild runs the same again: the forced push replaces the branch's one commit. When the PR closes, the
branch is deleted (for a PR from a fork, delete it in your fork when you like).

### Decision numbers

Decisions are numbered in order across the repo, so two open PRs can each record the same next number. The
PR merged second fixes it: `git rebase origin/main`, and when it stops at `.reelplanner/decisions.json`,
run `reel renumber`: your new decisions go after main's last, and their mentions in your plan folder are
rewritten. A number never changes once it is on main. A conflict in `.reelplanner/terms-index.json` is
never merged by hand: `reel renumber` (or `reelplanner terms-index .reelplanner`) writes it again.

### Before a merge

The maintainer checks:

- the tests passed on the PR's last commit (CI runs them on every push);
- a PR over the line has a walkthrough a maintainer accepted, or the `no-video` label;
- the other choices in the PR's text are accepted (ticked);
- a contributor's own plan was reviewed before the code, and their code check found nothing left;
- `.reelplanner/spec.md`, `system.json` and `glossary.md` say what changed;
- `reel pr-check --base origin/main --merge` passes; then `reel pr-check --tidy`, and merge with **Create a merge commit**.

After merging, a maintainer brings the system video up to date on main, once for every PR merged since
(`reelplanner spec-diff`, then `reelplanner build .reelplanner/system-video`).
