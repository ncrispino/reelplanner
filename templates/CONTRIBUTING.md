## Contributing with reelplanning

This repo plans its changes with [reelplanning](https://github.com/ncrispino/reelplanning): a plan, and
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

- **You plan with reelplanning:** bring a plan folder, `.reelplanning/plans/<date>-<name>/`, with two
  videos. The plan video, which you review yourself before writing the code, where a wrong choice costs
  least; and the walkthrough video, which shows the change running and pauses at the choices your agent
  made on its own that you'd notice or can't easily undo, the rest a list at its end. Tick "This PR brings
  a video".
- **You don't:** leave the box unticked. If the PR is over the line, a maintainer's agent makes its
  walkthrough video from the diff and the PR's text. Nobody is turned away.

### Who decides

- A **contributor** opens a PR. A **maintainer** can merge; maintainers are listed in
  `.reelplanning/config.json` under `maintainers`.
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
`.reelplanning/plans/`). Once the PR is open, your agent packs the built videos and pushes them to a branch
of their own, `video/pr-<number>`, that is never merged:

```sh
url=$(git remote get-url origin)            # for a PR from a fork, this is the fork
reelplanning bundle-player ../pr-42-video <plan-dir>/video <plan-dir>/walkthrough-video
cd ../pr-42-video
git init -q -b video/pr-42 && git add -A && git commit -qm "PR #42: its videos"
git push --force "$url" video/pr-42
```

Then it adds two lines to the PR's text, for the maintainer:

```sh
git clone -q --depth 1 -b video/pr-42 <url> ../pr-42-video
reelplanning review ../pr-42-video           # in the PR's checkout, so Send files the review there
```

A rebuild runs the same again: the forced push replaces the branch's one commit. When the PR closes, the
branch is deleted (for a PR from a fork, delete it in your fork when you like).

### Decision numbers

Decisions are numbered in order across the repo, so two open PRs can each record the same next number. The
PR merged second fixes it: `git rebase origin/main`, and when it stops at `.reelplanning/decisions.json`,
run `reel renumber`: your new decisions go after main's last, and their mentions in your plan folder are
rewritten. A number never changes once it is on main. A conflict in `.reelplanning/terms-index.json` is
never merged by hand: `reel renumber` (or `reelplanning terms-index .reelplanning`) writes it again.

### Before a merge

The maintainer checks:

- the fast tests pass on every push, and the full suite passed on the PR's last commit (it runs once a
  maintainer adds `ready-to-merge`);
- a PR over the line has a walkthrough a maintainer accepted, or the `no-video` label;
- the other choices in the PR's text are accepted (ticked);
- a contributor's own plan was reviewed before the code, and their code check found nothing left;
- `.reelplanning/spec.md`, `system.json` and `glossary.md` say what changed;
- `reel pr-check --base origin/main --merge` passes; then `reel pr-check --tidy`, and merge with **Create a merge commit**.

After merging, a maintainer brings the system video up to date on main, once for every PR merged since
(`reelplanning spec-diff`, then `reelplanning build .reelplanning/system-video`).
