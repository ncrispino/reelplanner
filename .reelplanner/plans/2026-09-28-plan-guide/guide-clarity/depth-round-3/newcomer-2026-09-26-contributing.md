# Review of "Several people, one repo"

## 1. What is this change, and why should I care?

reelplanning now has rules and tools for a repo with more than one contributor. A PR checks itself for whether it needs a walkthrough video, and only a maintainer's review counts for the decision log. When two branches both numbered a decision D-001, one command (`reel renumber`) fixes the clash. You should care because, until now, the tool assumed one person per repo. Your own request said this needed to be specified and applied to this repo too.

Found: the top summary and the "In short" box, no opening needed. The quote from you sits in the header.
Confidence: high

## 2. What can I do now, and what is the evidence?

- **Tell contributors when a PR needs a video and who makes it.**
  - The PR template and CONTRIBUTING.md now carry a rule: over 300 lines of code, or a checked "a choice a reviewer could make the other way" box.
  - Evidence: `reel pr-check` printed "under the line, normal code review" for a 25-line `--quiet` PR. With the box ticked and `--merge` it exited 1 with "needs a video". A maintainer's `no-video` label waives it.
- **Count only a maintainer's review.**
  - Evidence: for `reel record`, a non-maintainer (sam/ana) got "+0 (nothing new)" added to the log.
- **Check a contributor's video against its text.**
  - Evidence: `pr-check` reported "plan map matches plan.md (e23bc84710eb)" and "1 row(s) match their stops". An edge-case run showed a stale hash failing with "rebuild it".
  - Watching the video itself (`reelplanning review <folder>`) was not run, only named.
- **Merge decision logs.**
  - Evidence: `pr-check` failed on a D-001 clash (exit 1). `renumber --dry-run`, then the real run, turned D-001 into D-002 and rewrote the mentions.
- **Run CI.** Fast tests on every push, full suite before merge.
  - Evidence: only a `grep` of ci.yml that lists the four jobs. It has never run on GitHub.

Found: "What you can do now", the step worked-example tabs, and "Try it yourself". I had to open the "what it printed" folds and a few tabs, plus the everything-opened text for the `--merge` and renumber output.
Confidence: high

## 3. One step explained: step 4, decision numbers

- Main and the port branch each took D-001, for different answers. That is the clash.
- After `git rebase origin/main`, `reel pr-check` sees the branch's D-001 naming a different entry than on main. It fails with "Rebase … run `reel renumber`".
- `reel renumber` keeps main's log untouched and places the branch's own entries after main's last one. D-001 becomes D-002.
- It rewrites the D-001 mentions in the port plan's walkthrough.md and its review, all at once.
- It only lists video frames that still show the old id. It does not change them.
- Rule: an id is final once it is on main, so only the branch ever moves.
- Edge case: if the rebase left decisions.json in conflict, renumber reads the branch's entries from whichever side of the conflict holds them.

Found: the diagram "Two branches both took D-001" and the "The clash, found" tab. The rename output and the edge-case line were inside "What renumber would do, then doing it". I had to open that tab.
Confidence: high

## 4. How would I try it myself?

The page gives no setup for the scratch repo. It only says the runs were made in one that the test file sets up. A newcomer can't reproduce the clash case without that.

The nearest thing to a first command, run from the repo's top folder:

`grep -n -A2 "^  [a-z-]*:$" .github/workflows/ci.yml`

I expect four jobs: `fast`, `pr-check`, `full` and `video-branch`, each with its `if:` condition, then exit 0. On a real PR I'd run `reel pr-check . --base origin/main --body-file <pr body> --labels ""`. I'd expect lines like "under the line: a normal code review … ✓ repo against origin/main: 0 problem(s), 0 waiting", then exit 0.

Then `reel renumber . --base origin/main --dry-run` should print "would renumber: D-001 → D-002" and exit 0. That only makes sense if a clash exists.

Found: "Try it yourself". The outputs were behind "What it printed" folds.
Confidence: medium. Eight of ten commands have saved output. The setup is missing.

## 5. What did the agent decide on its own, and what should I look at first?

Five choices got flagged, and five smaller ones are listed only in the video.

- **D1, the one that changed the plan.** The workflow file is `ci.yml` instead of the planned `test.yml`.
- **A2.** A PR over the line but with no video still passes with a warning (△) on push. It fails only at `--merge`.
- **A3.** `maintainers` is `["owner"]`, with no email.
- **A6.** Older plan folders (dated up to 2026-09-27) keep their video media committed.
- **A9.** The full-suite job always runs and fails at once without `ready-to-merge`. A skipped required check counts as passed on GitHub, which would let a PR through untested.

I'd look first at A3, because it ties to the open "who is owner" problem. A9 comes next, because it is a merge-safety decision that has never run on GitHub. D1 is the plan deviation, but it's cosmetic.

Found: "What the agent decided on its own". Each item's "instead of" text was folded.
Confidence: medium. I didn't read the folded alternatives closely.

## 6. What needs me right now?

- Watch the walkthrough video and press Finish to approve it or ask for changes. It pauses on the five choices.
- Create the labels `needs-video`, `no-video` and `ready-to-merge`.
- Mark the `full suite` check as required (Settings → Branches).

Found: the "Needs you" row and the "What needs you" section.
Confidence: high

## 7. What could go wrong, or isn't done?

- CI has never run on GitHub. Only the commands were run locally.
- Labels and branch protection are not set up, so nothing is enforced.
- If a second person reviews on their own hosted page, they are also named "owner". Their accepts would then count as a maintainer's. The page says it is undecided, and it names a fix: an id or email per maintainer. One line says the open point was later answered in code. I was left unsure whether the "Not done" list is out of date.
- `renumber` warns that the system video defines no glossary terms.
- The guide says the plan lacks Cases tables and Interface blocks.

Found: "Not done", the "What isn't done" section, and the "What the plan and walkthrough don't say yet" list.
Confidence: high

---

## Depth

**LEARNED**
- `--merge` turns a "waiting" △ into a failure. Nothing in the video's captions covered that (narration.txt is empty).
- The 300-line count excludes tests, docs, videos, `.reelplanning/`, lock files, and anything `.gitattributes` marks generated.
- A new flag, command or dependency is "named only" and never counts on its own.
- A contributor's review stays in the PR, and only the owner's reviews land on main.
- The stale-hash check, where a changed plan.md fails a video built earlier.
- The reason A9 exists: a skipped required check counts as passed.

**DIAGRAMS**
- Helped: the D-001 sequence diagram, and the overall PR flow with the `no-video` dashed bypass.
- The "over the line" diagram was tangled at the top. Its edges cross, and "named only" hangs off a dashed line.
- The CI four-jobs diagram was fine, but the grep output says the same thing.
- I did not see the "Step through it" animations.

**EXAMPLES**
- The clash run and the renumber dry-run/real pair made step 4 concrete, and both were worth opening.
- Omar's 25-line PR was clear.
- The `--merge` ticked-box run was the best single demonstration of the policy.

**RESTATED**
- "Stands alone; its checks run in CI with step 5" repeats the step 3 text.
- The summary appears again in "In short", "Not done" and "What isn't done". The labels/branch-protection sentence appears at least four times.

**INVENTED**
- Nothing invented. The claims trace to runs, files or commits. The one gap is that the "second agent … raised nothing else" check has no visible output, only a summary ("What it found" was folded).

**CONFUSED**
- "the cacheplan's answer" and "Sam's plan-map hash".
- "Six words here have a special meaning" — the six words were not shown.
- "the system video" — I guessed it is a separate overview video of the whole project.
- "walkthrough video"/"walkthrough.md" — I guessed the video is built from that file.
- "D-171 / D-202" — I guessed they are decision ids.
- "D-001" (main) versus the text's "D-194" example. The example mixes numbers.
- "bundle-player packed" — I guessed a packing tool.
- "the video's stops" — I guessed pause points for choices.
- "Sam" vs "Ana" — the video scene and the runs use different names for the contributor.

**BORED**
- The long file table under "Where the code is", and the "Other files" count (+4051).
- The decision list, and the repeated "In words" and "Step through it" buttons.

**MISSING**
- A setup for a scratch repo so I could run the clash case myself.
- A plain one-screen summary of the rule: over 300 lines or a ticked choice needs a video, `no-video` waives it, only a maintainer's review counts.
- What the maintainer actually does when reviewing a contributor's video. The `gh pr checkout` and `reelplanning review` scene had no run output.
- What the "Cases" and "Interface" gaps mean for me.

**VERDICT:** mostly. The biggest fix is a copy-pasteable scratch-repo setup, so that the commands I'm told to try actually run for me. The second is to fix the stale "Not done: who owner is" item, given the note that says it was answered in code.
