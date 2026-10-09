Issue: Closes #<!-- the issue's number; every PR here links one (.github/CONTRIBUTING.md). "Refs #" if it should stay open -->

## What this PR does

<!-- In a few plain sentences: what changes, and why. -->

## A video?

A PR gets the walkthrough video, which shows the change running and pauses at what you'd notice, when it
changes over 300 lines outside tests, docs, videos and generated files, or when it makes a choice you'd
notice or can't easily undo (`.github/CONTRIBUTING.md`). A bug fix, a typo or a small flag needs none.

- [ ] This PR makes a choice you'd notice or can't easily undo: <!-- name it: what you see or do changes, or stored data, a file format, permissions, what other people's code relies on -->
- [ ] This PR brings a video (a plan folder with its videos' text, and the built video on `video/pr-<number>`)

<!-- Brought a video? Add the maintainer's two lines, with your branch's URL:
git clone -q --depth 1 -b video/pr-<number> <url> ../pr-<number>-video
reelplanning review ../pr-<number>-video
-->

## Other choices

<!-- Any other choice the PR makes, one line each: what it chose, instead of what (a helper's name, a
file split in two, a default nobody sees). No video for these: the maintainer reads and accepts them. -->

## Before merging (the maintainer)

- [ ] The other choices above are accepted
- [ ] The fast tests pass, and the full suite passed on the last commit (`ready-to-merge`)
- [ ] Over the line: a walkthrough a maintainer accepted, or `no-video`
- [ ] `spec.md`, `system.json` and `glossary.md` say what changed
- [ ] `reel pr-check --merge` passes; then `reel pr-check --tidy`, and merge (Create a merge commit, not squash)
