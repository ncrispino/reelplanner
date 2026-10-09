# SCRIPT — several people, one repo: what was built (walkthrough video, six chapters)

**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)
**Voice settings:** default
**Voice direction:** Plain and even. A good teacher talking to the owner: the real thing first, then the choice; one idea per sentence; every number is this repo's own; every id said with what it is.

---

## Line 1 — What was built: its map (Frame 1)

**Delivery:** Plain.

    The contributing plan is built, all five steps, so a repo can take pull requests from other people. A contributor sends one; a maintainer, listed in the repo's settings, can merge it. Twenty-six files changed: the new check, the numbering command, who counts, the rules, the checks GitHub runs, and thirty-nine tests.

## Line 2 — Step 1: when a pull request gets a video (Frame 2)

**Delivery:** Plain.

    Step one. A pull request gets a video only when the contributor ticks this box, naming a choice a reviewer could make the other way, or it changes over three hundred lines of code: tests, docs, videos and generated files don't count. A maintainer can also add needs-video, or no-video to waive it. Everything else merges on a normal code review.

## Line 3 — Step 1: the check reads the line (Frame 3)

**Delivery:** Plain.

    The new check, reel pr-check, reads the line. Omar's twenty-five lines add a --quiet flag, box unticked: under the line. Ana ticks the box for a default port: over the line, so it needs a video, from her or from a maintainer's agent. Click the run to see everything the check counts.

## Line 4 — Step 1: a choice stops (Frame 4)

**Delivery:** Plain.

    Choice A2 stops. Over the line with no video yet, the check waits and passes, rather than failing every push; reel pr-check --merge, before a merge, fails it.

## Line 5 — Step 1: the choice that doesn't stop (Frame 5)

**Delivery:** Plain.

    One doesn't stop. Choice A1: the three hundred lines leave out tests, docs, the project record, videos and generated files.

## Line 6 — Step 2: who decides, and what lands (Frame 6)

**Delivery:** Plain.

    Step two: who decides. A contributor's plan review answers their plan's questions. Their walkthrough review is their own check: reel record adds nothing to the decision log; only a maintainer's review counts. The check lists what lands on main, and --tidy removes the contributor's reviews in one commit.

## Line 7 — Step 2: a choice stops (Frame 7)

**Delivery:** Plain.

    Choice A3 stops. The maintainers list says owner, with no email, so a review sent from the local page, under your git email, counts as a contributor's until that email is added. The other way was your email in a public file.

## Line 8 — Quick check: tests and code (Frame 8)

**Delivery:** Plain.

    Quick check, a question that asks you to predict. A pull request edits two hundred and eighty lines of code and adds four hundred lines of tests, box unticked. Does it need a video?

## Line 9 — Step 3: watching a contributor's video (Frame 9)

**Delivery:** Plain.

    Step three. The built video never goes into git. The contributor packs it onto a branch of its own, video/pr-42. The maintainer runs gh pr checkout 42, clones that branch beside it, and runs reelplanning review on it. It serves the folder as it is, and says whether its plan map matches the checkout's, or was built from another version of the plan and needs a rebuild.

## Line 10 — Step 3: a choice stops (Frame 10)

**Delivery:** Plain.

    Choice A6 stops. This repo's plan folders up to September the twenty-seventh keep their voice files and pictures in git; later plans follow the rule. So a rebuild of an older video never leaves out voice files its page names.

## Line 11 — Quick check: Sam's own review (Frame 11)

**Delivery:** Plain.

    Quick check. Sam is not a maintainer. In his own walkthrough review, he accepts all four choices his agent made. How many join the decision log?

## Line 12 — Step 3: the choices that don't stop (Frame 12)

**Delivery:** Plain.

    Two choices in step three don't stop. Each video is also checked against the text it was built from. Choice A4: only until it is approved. Choice A5: by what its plan map already carries.

## Line 13 — Step 4: decision numbers (Frame 13)

**Delivery:** Plain.

    Step four. Main's cache plan and Ana's port plan both made decision D-001. Ana's branch, merged second, rebases, stops at the conflict in decisions.json, and runs reel renumber: main's log stays as it is, and Ana's decision becomes decision D-002, after main's last. Its mentions are rewritten, and the video lines to rebuild are listed.

## Line 14 — Quick check: a video packed too early (Frame 14)

**Delivery:** Plain.

    Quick check. Pull request fifty-seven changed its plan.md after its video was packed. You run reelplanning review on that video in its checkout. What does it say?

## Line 15 — Step 4: the choices that don't stop (Frame 15)

**Delivery:** Plain.

    Two choices in step four don't stop. Choice A7: reel renumber takes an entry as the branch's own when main holds none deciding the same thing. Choice A8: a waiting memory line moves only to the reviewer it names.

## Line 16 — Step 5: the checks GitHub runs (Frame 16)

**Delivery:** Plain.

    Step five. CI runs the checks on GitHub by itself: the fast suite on every push; reel pr-check and reel audit on every pull request; the full suite once a maintainer adds ready-to-merge; and a closed pull request's video branch is deleted. Click the file to read it whole.

## Line 17 — Step 5: a choice stops (Frame 17)

**Delivery:** Plain.

    Choice A9 stops. Without ready-to-merge, the full suite fails at once instead of being skipped. GitHub counts a skipped required check as passed, so a skipped suite would let a pull request merge untested.

## Line 18 — Step 5: an off-plan change (Frame 18)

**Delivery:** Plain.

    And one off-plan change, where the build did other than the plan: the file is ci.yml, not test.yml as the plan named it, since it runs more than the tests.

## Line 19 — Quick check: two numbers after the rebase (Frame 19)

**Delivery:** Plain.

    Quick check. Main's log ends at decision D-231. Your branch also recorded decisions D-230 and D-231. After reel renumber, what are yours?

## Line 20 — Checked: the code check and the walkthrough check (Frame 20)

**Delivery:** Plain.

    A second agent checked the code against the plan: all five steps and thirty-three decisions hold, and it found nothing unexplained. The walkthrough check passes.

## Line 21 — Quick check: no ready-to-merge (Frame 21)

**Delivery:** Plain.

    Quick check. The full suite is marked required. A pull request passed its fast suite and reel pr-check, but nobody added ready-to-merge. Can it merge?

## Line 22 — What ran, what is not done, and the ask (Frame 22)

**Delivery:** Plain.

    Every test passed, thirty-nine new checks among them. Not done: CI has never run on GitHub, and the three labels and the required full suite are yours to set. One open point: the hosted page calls whoever publishes it owner, so a second reviewer there can't be told apart from you. Flag a choice, or accept the build.
