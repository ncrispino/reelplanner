# Review of the "Several people, one repo" guide

The narration file is empty (only scene titles), so I can't say what the video covered. Wherever I say "the page adds", I mean the page adds it beyond the scene titles. I read the full page text, screenshots 1, 3, 4, 5, 6, 8, 10 and 12, and the opened text for the run outputs.

## 1. What is this change, and why should I care?

**Sentence:** reelplanning now has rules and tooling for a repo with several contributors. A PR says whether it needs a video, only a maintainer's review changes the decision log, and clashing decision numbers are fixed by one command, with CI enforcing this.

**Why you care:** it was your own request. reelplanning assumed one person per repo, and this makes it work once others contribute.

Found: the top of the page (title, summary, your quoted request, "The problem"); no opening needed.
Confidence: high

## 2. What can I do now, and what is the evidence?

- **Tell contributors when a PR needs a video (step 1).**
  - The threshold is 300 lines of code, or a ticked box naming a choice a reviewer could make the other way. Tests, docs, lock files and `.reelplanning/` don't count.
  - Evidence: three saved `pr-check` runs.
    - A 25-line change adding `--quiet` gets "normal code review", exit 0.
    - A 301-line change plus tests and docs counts 304 lines and prints "needs a video".
    - The ticked box makes a 25-line change "over the line".
- **Have only a maintainer's review count (step 2).**
  - Evidence: a saved `reel record` run where sam, who isn't a maintainer, approves and accepts A1. The result was "+0 (nothing new)" in the log.
- **Watch and check a contributor's video without rebuilding it (step 3).**
  - Evidence: a saved `pr-check` run printing "plan map matches plan.md (e23bc84710eb)" and "1 row(s) match their stops".
  - Running `reelplanning review <folder>` is only "named in the walkthrough, not run". That is the actual watching.
- **Merge decision logs with `reel renumber` (step 4).**
  - Evidence: a saved `pr-check` run failing on the clash, then a dry-run and a real renumber run turning D-001 into D-002.
- **Run fast tests on every push and the full suite before merge (step 5).**
  - Evidence: only a `grep` of `ci.yml` listing the four jobs. CI has never run on GitHub.
  - So this step has the weakest evidence.

Found: "In short", "What you can do now", each step's worked examples, and "Show the real output" (which I had to open).
Confidence: high

## 3. One step explained: step 4, decision numbers

- **The setup:** main and the port branch each independently took D-001, for different answers (cache plan vs port plan).
- **The check:** `reel pr-check` spots that D-001 on the branch names a different entry than D-001 on main. It fails with exit 1 and says to rebase and run `reel renumber`.
- **The fix:** after the rebase, `reel renumber` takes main's log as it is. It appends the branch's new entries after main's last, so D-001 becomes D-002. It then rewrites mentions of D-001 in the branch's walkthrough and review files, all at once, so a chain of renumbers is never applied twice.
- **The rule behind it:** an id is final once it's on main, so only the branch ever moves.
- **Edge case:** the page says that while `decisions.json` is mid-conflict, renumber reads the branch's entries from the side of the conflict that holds them.
- **A related case:** frames that still carry the old id are listed but not changed.

Found: step 4's sequence diagram (visible), the worked examples and "Show the real output" (opened), and the "Edge cases" line (only in the opened text).
Confidence: medium. I inferred how the conflict-side reading works.

## 4. How would I try it myself?

The page never says where to get the scratch repo. It says "a scratch repo", and the Step 4 commands only work if you first recreate the branch state. The tests in `scripts/test/contributing.spec.mjs` set the repo up. I would run the commands from the repo's top folder, in this order:

1. `grep -n -A2 "^  [a-z-]*:$" .github/workflows/ci.yml`
   - This is the only command that works on the real repo as it is.
   - Expected: `fast`, `pr-check`, `full` and `video-branch`, each with its `if:` condition.
2. In your own repo, if you have a plausible PR branch: `reel pr-check . --base origin/main --body-file ../pr.md --labels ""`
   - For a small change: "under the line: a normal code review… ✓ … 0 problem(s)", exit 0.
   - For a big one: "△ needs a video", still exit 0.
3. Add `--merge` to the same command with a ticked-box body file and no video.
   - It exits 1.
4. `reel renumber . --base origin/main --dry-run`
   - It prints "would renumber: D-001 → D-002".
   - Then run without `--dry-run`.

Found: "Try it yourself"; the outputs need opening.
Confidence: medium

## 5. What did the agent decide on its own, and what should I look at first?

Ten choices in total, five of them worth a look:

- **D1:** the workflow file is `ci.yml`, not the planned `test.yml`.
- **A2:** an over-the-line PR with no video prints △ and passes on every push, but fails under `--merge`.
- **A3:** `maintainers` is `["owner"]`, with no email.
- **A6:** older plan folders keep their committed media.
- **A9:** the full-suite job runs on every PR event and fails immediately without `ready-to-merge`.

**Look at these first:**

- **A3:** it decides who counts as a maintainer. The page's own "Not done" section says it breaks once a second reviewer appears. Its statement of it is also stale (see item 7).
- **D1:** it is the only choice that changed the plan.
- **A9:** it rests on a GitHub behaviour, where a skipped required check counts as passed. The page gives no source for that claim.

Found: "What the agent decided on its own". Each choice's full wording is folded.
Confidence: medium

## 6. What needs me right now?

- **Review:** watch the video and press Finish to approve or ask for changes.
- **Labels:** create `needs-video`, `no-video` and `ready-to-merge`.
- **Branch protection:** mark the "full suite" check as required (Settings → Branches).

Found: "Needs you" near the top, and again in "What needs you" and "What isn't done".
Confidence: high

## 7. What could go wrong, or isn't done?

- **CI has never run on GitHub.** Its first real run will be the first PR after merge.
- **Maintainer identity:** `maintainers: ["owner"]` can't tell two reviewers apart. The hosted page calls whoever published it "owner".
  - The opened text says this "has since been answered in code" (`id:<id>`, commits eed4d14 and 3f5c919). The visible page still calls it an open, undecided point. The page contradicts itself, and I don't know which is current.
- **Waiting counts as passing:** until `--merge`, a PR that needs a video and has none passes with △, so nothing stops it before merge unless the full-suite check is required.
- **Gaps in the plan:** five steps have no cases table and no interface block, and 23 decision lines name no step.
- **The system video** is behind the glossary: renumber warns "no beat of the system video defines: call, tag, streak…".
- **Code check:** the second agent's clean result ("raised nothing else") is a single reviewer.

Found: "What isn't done, and what could go wrong", "What the plan and walkthrough don't say yet", and the renumber output (opened).
Confidence: medium

## Depth

**LEARNED**
- **Cost in lines:** the 300-line rule excludes tests, docs, lock files and `.reelplanning/`, and a new flag, command or dependency is only named, never a trigger.
- **Who gets what:** contributors' reviews stay in the PR, while only a plan and its record land on main.
- **PR outcomes:** "needs a video" is a waiting state (△, exit 0), not a failure, until `--merge`.
- **CI details:** the full-suite job deliberately runs on every PR and fails without `ready-to-merge`, because skipped required checks count as passed.
- **Cleanup:** closing a PR deletes its `video/pr-<n>` branch.

**DIAGRAMS**
- **Helped:**
  - "Is a pull request over the line?" was clear once I saw three routes in (box, label, diff), the waiver, and the "named only" side branch.
  - The step-4 sequence diagram was clear.
  - The four-jobs CI diagram was mostly clear, but its "npm test" labels overlap and the "only with ready-to-merge" arrow is hard to trace.
- **Less helpful:**
  - The full PR flowchart is neat but mostly repeats the step titles.
  - The "steps and which each needs first" diagram says only "step 5 needs 1–4", which is little information.
  - "How the parts use each other" was not seen in the screenshots I read.

**EXAMPLES**
- The 25-line vs 304-line pair made the counting rule concrete, and opening the real output was worth it.
- The "BEFORE YOU LOOK" predictions are good (the log held one entry before; how many after?).
- Opening the output for the renumber dry run was worth it too.

**RESTATED**
- "Tell contributors when a pull request needs a video, and who makes it" repeats the title and the summary.
- The step-3 line "the port branch now carries its walkthrough video's text…" is just the output re-described.

**INVENTED**
- "GitHub counts a skipped required check as passed" has no source on the page.
- "the agent's email is every Claude session's" has no source.
- "It found the code matches the plan… on all 33 earlier decisions" gives no report I could open beyond the summary.
- Mild: "Eight of the ten commands… really ran" while "12 saved in runs/" appear elsewhere. The counts differ and aren't reconciled.

**CONFUSED**
- "decision log", "ledger", "record", "plan map", "stops", "frames", "beats". I guessed at a record of accepted choices, and the "stops" are the video's pause points.
- "A1 / D1 / m" numbering: I guessed A is a choice the plan left open, D one that changed the plan, and m a small one. The page does say this.
- "Send files the review in the inbox of the repo it is run in": I couldn't follow it.
- "system video": I guessed it is a whole-project explainer video. It is never defined in the parts I read.
- "the diagram in words" is repeated many times, and I guessed it is a text alternative to the picture.

**BORED**
- The repeated "Step through it" buttons, "In the video" timestamps, and the group list of 66 files (+4051 lines, most of it generated).
- The provenance paragraph at the end.

**MISSING**
- A clear "start here, try it in 5 minutes" that produces the scratch repo (only the spec is named).
- Where the labels come from and who may add them, beyond one line.
- A failure story for the video-branch cleanup.
- What "updated system video" (your request) actually became. The only trace I found is the renumber warning.
- Any real GitHub run of it.

**VERDICT: mostly**
The rules and the tool outputs are well shown and worth more than the video's scene titles.

The biggest fix is to resolve the maintainer-identity contradiction, so the visible page matches the later code, and to add a single runnable scratch-repo recipe for trying it.
