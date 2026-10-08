# Review of the "Several people, one repo" guide

## 1. What is this change, and why should I care?

**One sentence:** it makes reelplanning work when a repo has more than one contributor. A pull request says whether it needs a video and who makes it, only a maintainer's review can change the decision log, and two branches' clashing decision numbers are fixed with `reel renumber`.

**Why you care:** you asked for this, as a "meta" rule for the reelplanning repo itself. Without it, a stranger's PR could rewrite your decision log, or two PRs could both take D-001.

Found: the top of the page (title, your quoted request, "In short"). I opened nothing.
Confidence: high

## 2. What can I do now, and what is the evidence?

**New things:**
- **Video rule for PRs.** The PR template and CONTRIBUTING.md say a PR needs a video when it ticks the "choice a reviewer could make the other way" box, carries the `needs-video` label, or changes more than 300 lines of code. The `no-video` label waives it.
- **Maintainer-only reviews.** A non-maintainer's walkthrough review is filed but adds nothing to the decision log.
- **Reviewing a contributor's video.** `reelplanning review <folder>` serves a packed video without rebuilding it. `reel pr-check` checks the video's plan map against `plan.md`, using a hash.
- **Fixing decision-number clashes.** `reel renumber` moves the branch's new decisions after main's last one.
- **CI.** Fast tests run on every push. The full suite must pass before a merge.

**Evidence** (saved runs, seen after clicking "Show the real output"):
- **25-line PR (Omar's `--quiet`):** exit 0, and it counts as a normal code review.
- **301-line PR:** it reports "needs a video (304 lines)". Tests, docs and lock file don't count towards the 304.
- **Port branch:** `reel pr-check` exits 1 with "D-001 names a different entry than on origin/main".
- **After renumber:** `D-001 → D-002`.
- **CI:** a `grep` of `ci.yml` lists the four jobs.
- **Sam's review:** `reel record` reports a ledger of "+0 (nothing new)".
- **Not actually run:** `reelplanning review` and `npm run test:full` are only "named in the walkthrough, not run". CI has never run on GitHub.

Found: "In short", the step sections, and the "Try it yourself" section. The real output needed opening.
Confidence: high

## 3. One step: Step 4, decision numbers

- **The clash.** Main's log has D-001 for the cache plan. The port branch's log also has D-001, for the port plan. That is a clash.
- **The check.** `reel pr-check` spots it and fails: "an id names a different entry than on origin/main… Rebase and run `reel renumber`".
- **The rule.** An id is final once it is on main. So main never changes, and the branch's new entries always go after main's last one.
- **The fix.** `reel renumber` takes main's log as it is, then appends the branch's entry after it. D-001 becomes D-002.
- **Mentions.** It rewrites mentions of the old id in `walkthrough.md` and the review, all at once. That way a chain like D-194 → D-195 → D-196 is never renumbered twice.
- **Edge case.** If `decisions.json` is mid-conflict, renumber reads the branch's entries from the side of the conflict that holds them. The diagram also says frames that still show the old id are listed, not changed.

Found: the Step 4 diagram, the worked examples and the "Why it works this way" line. I had to open "Show the real output" and the edge cases.
Confidence: medium (the edge-case wording is thin)

## 4. How would I try it myself?

The page never says how to make a scratch repo. Its runs used one set up "as `scripts/test/contributing.spec.mjs` sets its own up". So the plan is to reproduce that, or use the commands on your repo from its top folder.

```
grep -n -A2 "^  [a-z-]*:$" .github/workflows/ci.yml
```
This works in this repo. I expect the four jobs: `fast`, `pr-check`, `full` and `video-branch`, each with its `if:` condition, then exit 0.

```
reel pr-check . --base origin/main --body-file ../pr.md --labels ""
```
- **On a small PR:** "under the line: a normal code review… ✓ 0 problem(s), 0 waiting", exit 0.
- **On the clash branch:** two ✗ lines, then exit 1.

```
reel renumber . --base origin/main --dry-run
```
I expect "would renumber: D-001 → D-002" and the files whose mentions it would rewrite. Drop `--dry-run` to do it for real.

Found: the "Try it yourself" section, plus the opened outputs.
Confidence: medium (no setup command is given for the scratch repo)

## 5. What did the agent decide on its own, and what do I look at first?

It made ten choices. The five worth your look are:
- **D1 (changed the plan):** the workflow file is `ci.yml`, not the plan's `test.yml`, because it does more than tests.
- **A2:** a PR that is over the line with no video prints △ and passes normally. It fails only under `--merge` in the full-suite job.
- **A3:** `maintainers` is `["owner"]` with no email.
- **A6:** older plan folders keep their committed video media.
- **A9:** the full-suite job runs on every PR event and fails at once without `ready-to-merge`. A skipped required check would count as passed on GitHub.

Look at **A3 first**. It decides who can change your decision log, and it is the one the page itself calls an open problem.

Found: "What the agent decided on its own". Full wording was folded.
Confidence: high

## 6. What needs me right now?

- Watch the walkthrough video and approve it, or ask for changes.
- Create the GitHub labels `needs-video`, `no-video` and `ready-to-merge`. Only a maintainer can add a label.
- Mark the `full suite` check as required (Settings → Branches).

Found: "Needs you", the "In short" box, and the video stop list.
Confidence: high

## 7. What could go wrong, or isn't done?

- **CI has never run on GitHub.** The first real run is the first PR after this merges.
- **Who "owner" is.** With two reviewers on hosted pages, both would be named "owner". That would let a second person's accepts join the log as a maintainer's.
- **Contradiction on that point.** Under "What breaks it" (Step 2) it says that since this build `maintainers` takes `id:<id>`, which fixes it. Under "Not done" the same problem is called open and undecided. I can't tell which is current.
- **Step 4 warning.** After renumber, a warning says the system video is behind the glossary.
- **Reviewer coverage.** The code check found no problems. It looked only at code against plan, and CI hasn't been exercised.

Found: "What isn't done", plus "What breaks it" (opened).
Confidence: medium

---

## Depth

**LEARNED:**
- The 300-line count excludes tests, docs, videos, `.reelplanning/`, lock files and anything `.gitattributes` marks generated.
- A new flag, command or dependency is only named, never a reason by itself.
- A skipped required GitHub check counts as passed, which is why the full-suite job fails instead of skipping (A9).
- The video's plan map is hashed against `plan.md`, so a one-line plan edit is caught.
- Contributor reviews are removed from main by `--tidy` and stay in the PR history.

**DIAGRAMS:**
- **Helpful:** the "PR from opened to merged" flow and the four CI jobs diagram.
- **Cluttered:** in the "over the line" diagram, the edge labels overlap ("a new flag, command or over 300 lines of code" collides with "added by a maintainer").
- **Said little new:** the step-dependency diagram (four steps all pointing at step 5).
- **Couldn't judge:** the sequence diagrams in Steps 2, 3 and 4, which I only saw in fragments.

**EXAMPLES:**
- **Best:** the clash → dry-run → renumber trio. The real output was worth opening.
- **Also good:** the 25-line vs 304-line pair.
- **Least useful:** the CI `grep` example. The output is a fragment, and it is clearer to read as a list of jobs.

**RESTATED:**
- The "In short" box repeats "Needs you" and "Not done": the labels line appears in both, twice in "Not done" and once in "Needs you".
- "You can now…" per-step lines are close to the "What you can do now" bullets.

**INVENTED:** nothing clearly unsupported. Two things look unsourced:
- "It found the code matches… on all 33 earlier decisions". The figures are cited, but the findings behind them were not opened.
- Step 3's "Stands alone" note has no evidence for the claim.

**CONFUSED:**
- "Six words here have a special meaning, marked with a dotted line". I guessed these were glossary terms. Only "Show them" reveals them.
- "the system video" and "system video behind the glossary". I guessed it is a second video that explains the project overall.
- "video-branch… deletes `video/pr-<n>`". I guessed it is a temporary branch that carries a built video.
- "plan map", "stops", "frames". I guessed they are the video's scene index.
- "Eight of the ten commands… really ran" versus 12 saved runs. I couldn't reconcile these.
- "A/D/m" numbering. I worked out A is an open choice, D a plan change, and m a small one.

**BORED:**
- The "Worth your look" and "Not done" bullets, repeated three times.
- The long "How this page was made" note.
- The 43 generated files and the +4051 line count.

**MISSING:**
- A plain "do this first" setup for a scratch repo.
- Which of the five choices the owner must decide versus just accept.
- What CI does on a first PR, and rollback steps if it misbehaves.
- The narration file has only scene titles, so I couldn't compare the page with the video.

**VERDICT: mostly.** The **single biggest fix** is to reconcile the two conflicting statements about "owner" (fixed in Step 2, open under "Not done") and put the owner's decisions in one short list.
