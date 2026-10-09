# SCRIPT — several people, one repo (plan video, six chapters)

**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)
**Voice settings:** default
**Voice direction:** Plain and even. A good teacher talking to the owner: the real thing first, then the rule; one idea per sentence.

---

## Line 1 — One person per repo, then a shared one (Frame 1)

**Delivery:** Plain.

    reelplanning assumes one person per repo, who plans, reviews the videos and merges. What happens when the repo is shared, and a contributor, someone who may not use reelplanning at all, opens a pull request: a change they ask to have merged?

## Line 2 — What changes (Frame 2)

**Delivery:** Plain.

    This plan is for any shared repo, this one first. Step one: when a pull request gets a video, and who makes it. Steps two and three: who reviews, what lands on main, and where the video lives. Four and five: records that merge, and tests.

## Line 3 — Eight earlier plans (Frame 3)

**Delivery:** Plain.

    Eight earlier plans lead here. The system video catches up after every accepted walkthrough, and a second agent checks the code. Memory lives in each person's home folder. A quick check per step. Plain words on screen. At a step's fifth choice, the builder asks. Detail pages start from a template. Scenes show the real thing. And the case study stays as it is.

## Line 4 — Step 1: the line, as decided (Frame 4)

**Delivery:** Plain.

    Step one. CONTRIBUTING.md, which reelplanning gives any shared repo, draws the line, as you decided: a pull request gets a video only when it makes a choice a reviewer could make the other way, like a default or a new flag, or when it changes over three hundred lines. Which files it touches no longer counts.

## Line 5 — The check, on a one-line fix (Frame 5)

**Delivery:** Plain.

    Its check, reel pr-check, counts the lines and looks for a new flag, command or dependency; a choice it cannot see, the contributor ticks. So pull request forty-three, a one-line fix in the reel CLI, merges on a normal code review, with no video. And a maintainer, someone who can merge, can still ask for one on any pull request, with the needs-video label.

## Line 6 — Who makes the video, as decided (Frame 6)

**Delivery:** Plain.

    Who makes the video, as you decided. A contributor who plans with reelplanning, like Sam, brings a plan video, reviewed before the code, and a walkthrough. One who doesn't just opens the pull request, and the maintainer's agent makes the walkthrough from it. Nobody is turned away.

## Line 7 — Step 2: who does what, with one PR (Frame 7)

**Delivery:** Plain.

    Step two, with pull request forty-two. Sam, the contributor, answers their own plan's questions, and checks their agent's choices before opening it. The owner, the maintainer, then watches its walkthrough, and accepts or flags each choice. Sam's checks help Sam; the owner's are the ones that count.

## Line 8 — What lands on main (Frame 8)

**Delivery:** Plain.

    So what lands on main is only what counts: the plan, its final decisions, walkthrough.md, and the owner's review. Sam's own reviews stay in the pull request's history: reel pr-check --tidy takes them off the branch before the merge. And if the owner changed one of Sam's answers, the log keeps the last one, as you decided.

## Line 9 — Quick check: a small PR with a flag (Frame 9)

**Delivery:** Plain.

    Quick check, on step one. Omar's pull request is twenty-five lines, and adds a new flag to the reel CLI. He doesn't use reelplanning. What happens?

## Line 10 — Step 3: watching and checking, as decided (Frame 10)

**Delivery:** Plain.

    Step three. The maintainer watches a contributor's video without building anything: reelplanning review just serves the files. Then, as you decided, two checks. On every pull request, CI, the checks GitHub runs, confirms the video matches the plan, in seconds. And before accepting, the maintainer's own code check: a fresh agent reads the code, in minutes.

## Line 11 — The video is heavy in git (Frame 11)

**Delivery:** Plain.

    But where does the built video live? Today the branch carries it, voice files and all, in git for good. This plan's video has fifteen megabytes of voice alone, and this repo's history is already eight hundred and ninety-three megabytes.

## Line 12 — Where it lives, as decided (Frame 12)

**Delivery:** Plain.

    As you decided, the built video never lands in main's history. The pull request's branch carries only the video's text. The built video goes on a throwaway branch of its own, never merged: the maintainer clones it and runs reelplanning review, and it is deleted after the merge.

## Line 13 — Would it be easy? A real run (Frame 13)

**Delivery:** Plain.

    Would it be easy? Yes: every step is a command an agent runs, nothing by hand. In a real run the packed video is about five megabytes; a clone gets it only while its branch exists, and after, a fresh clone is back to main's text alone: kilobytes, not megabytes. The catch: once it is deleted, watching it again means rebuilding it.

## Line 14 — Quick check: what main holds (Frame 14)

**Delivery:** Plain.

    Quick check, on step two. Lee accepted all four of their agent's choices; the owner flagged one, and it was fixed. After the merge, what reviews does main hold?

## Line 15 — Step 4: records that merge, as decided (Frame 15)

**Delivery:** Plain.

    Step four, as you decided: numbers stay in order. In a real run, two branches each wrote decision D-194. The one merged second runs reel renumber, and its entry becomes decision D-195. The terms index, which builds write, is never merged by hand: take main's copy and write it again.

## Line 16 — Quick check: a walkthrough that is wrong (Frame 16)

**Delivery:** Plain.

    Quick check, on step three. Lee's walkthrough says a missing file is skipped, but the code stops with an error. CI's checks pass. What finds it?

## Line 17 — Step 5: CI, the merge, the system video (Frame 17)

**Delivery:** Plain.

    Step five: CI runs the fast suite on every push. Before a merge, it runs the full suite, every test, about five minutes, and the merge needs it to pass; and again on the release tag. The system video catches up on main after the merges, as decision D-003 keeps it.

## Line 18 — Quick check: two branches, one number (Frame 18)

**Delivery:** Plain.

    Quick check, on step four. Two pull requests each recorded a decision D-210, and one has merged. What does the other's contributor do?

## Line 19 — Quick check: the full suite (Frame 19)

**Delivery:** Plain.

    Last quick check, on step five. A pull request passes the fast suite, but a test only the full suite runs is failing. Can it merge?

## Line 20 — The plan (Frame 20)

**Delivery:** Plain.

    That is the plan: five steps, every question decided. Draw on any step to leave a note, or approve.
