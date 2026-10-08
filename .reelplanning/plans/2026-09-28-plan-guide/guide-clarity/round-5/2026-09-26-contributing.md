# Review of "Several people, one repo"

**1. What is this change, and why should I care?**
It sets up rules and tooling for running reelplanning in a repo with more than one person. reelplanning is the owner's planning-and-video tool. The change covers when a PR needs a walkthrough video, who reviews it, how decision numbers stay in order, and what CI checks before a merge. You asked for this yourself ("kinda meta"). Without it, the one-person workflow breaks once anyone else opens a PR.
Found: the top of the page (quoted request, intro, "In short" box); no opening needed.
Confidence: medium. The page has no one-sentence summary. It says so itself: "In one sentence" is listed as missing.

**2. What can I do now, and what evidence is shown?**
- **Video rule:** a PR gets a video only if it makes a choice a reviewer could go either way on, or changes more than 300 lines outside tests, docs, videos and generated files. A PR template and a CONTRIBUTING section state this. Evidence: a screenshot of the template with checkboxes. The command `reel pr-check` measures it.
- **Two roles:** maintainer and contributor. A contributor's own review of their walkthrough adds nothing to the decision log. Evidence: a screenshot of `reel record` printing "+0 (nothing new)" for a contributor named "ana".
- **Reviewing a contributor's video:** `gh pr checkout` plus `reelplanning review <folder>` serves the video. Evidence: only a terminal mock-up screenshot.
- **Decision numbers:** `reel renumber` fixes clashes after a merge. Evidence: none I saw beyond the video-moment link.
- **CI:** fast tests on every push, `reel pr-check` and `reel audit` on PRs, and the full suite once a PR is labelled ready-to-merge. Evidence: a YAML screenshot.

The page admits that no run was saved. The pictures are frames from the walkthrough video, and the commands are "as planned, not run". So there is no real command output anywhere.
Found: "What you can do now" (screenshots), "Try it yourself"; the video links are not something I could watch.
Confidence: medium.

**3. How would I try it myself?**
Run these from the repo's top folder:
- `reel pr-check --base origin/main`
- `reelplanning review <folder>` (I'd need a contributor's packed video folder)
- `npm run test:full`

`gh pr view 44` is also listed, but it is a step in a maintainer workflow rather than a test. Steps 2 and 4 have no command at all. The page says so. `reel renumber` is only named in the code section.
Found: "Try it yourself"; the commands show up unopened, but the text under them is truncated with "…".
Confidence: medium.

**4. What did the agent decide on its own, and which should I look at first?**
There are ten decisions. Five are highlighted and five smaller ones are hidden. Look first at the one marked "changed from the plan" (D1). The workflow file is `ci.yml`, not the `test.yml` the plan said. It is minor, but it is the only place the agent departed from the plan. After that, I'd look at these:
- **A3, `maintainers: ["owner"]`:** any review filed as "owner" counts as a maintainer's. This is the riskiest one for a shared repo.
- **A9, full-suite job:** it fails without the ready-to-merge label, on purpose, because GitHub treats a skipped required check as passed.
- **A2, PR over the line:** a PR over the line with no video prints a warning and passes, and only `--merge` makes it fail.
- **A6, `.gitignore`:** plans dated up to 2026-09-27 keep their media committed.

Found: "What the agent decided on its own". The main text is visible, and the "chose instead of, in full" folds were not opened.
Confidence: high.

**5. What needs me right now?**
- Watch the walkthrough video and press Finish to approve it or ask for changes. It is "not reviewed yet".
- Create the labels `needs-video`, `no-video` and `ready-to-merge` on GitHub.
- Mark the "full suite" check as required in Settings → Branches.

The GitHub steps are only on you because a maintainer can add labels.
Found: "Needs you" in the summary box, and the "What needs you" section (visible, but the text is cut off with "…").
Confidence: high.

**6. What could go wrong, or isn't done?**
- CI has never run on GitHub. The YAML parses and the commands pass locally, and the first real run is the first PR after this merges.
- The labels and branch protection don't exist yet, so the merge gate doesn't hold until you set them up.
- A second maintainer reviewing on their own hosted page would also be named "owner", so their accepts would be counted as yours. This is an open question for a later plan.
- A review recorded by git email is treated as a contributor's until an email is added to the config.
- The automated code check found nothing, but it is another agent's opinion.
- No real run output is saved.
- The plan is missing the Cases, Interface and Worked-example sections.

Found: "What isn't done", plus the summary box.
Confidence: high.

**7. Where is the code, and how do I see what changed?**
It is 66 hand-written files, plus 43 generated ones, in six commits. To see them all, run `git show 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc`. The page also groups the diffs into eight parts: pr-check, roles, review, renumber, templates, CI, docs, and tests. Each part opens to its diff. The big "Other files" bucket is +4051 lines. Key files include `scripts/pr-check.mjs`, `scripts/reel.mjs`, `.github/workflows/ci.yml` and `.reelplanning/config.json`.
Found: "Where the code is". The git command shows unopened, and the diffs need opening (I did not open them).
Confidence: high.

---

**CONFUSED**
- "reel" versus "reelplanning". The page explains it late, in Try it yourself. I guessed reel is a companion CLI.
- "the line": I guessed it means the 300-line threshold.
- "△ and passes": I guessed it is a warning symbol.
- "packed folder / bundle-player packed": I guessed it is a zipped video bundle.
- "hosted page … 19 reviews filed as owner": I guessed it is the online place where videos get reviewed.
- "the plan map", "the ledger", "the decision log": I guessed they are internal records.
- "A/D/m" decision codes: the page explains them only in passing.
- "Not in this plan: branch protection", pasted into the "The owner's, in the repo's settings" bullet: it reads like leftover markup.
- The step 3 screenshot shows `$ git clone` with no argument. I guessed the video animates typing.
- "system video": I guessed it is a video showing how the whole system works.
- "Words this page uses" is a folded glossary of 4 terms. I didn't open it.

**BORED**
- The "how this page was made" section, the plan in its own words, the six commits list, the 28 builder notes, and the repeated "What was built for it / What the plan asked for" folds under each step.
- The "Not done" content is repeated in the summary box, the Needs-you section and the Not-done section.

**MISSING**
- A one-line plain statement of the change.
- Any real output. Every command is "not run".
- A "try it" path for steps 2 and 4.
- A plain answer to "what happens when a PR arrives?", told as one story, from the contributor's side and the maintainer's side.
- The video itself. I can't watch it, and it is the main evidence.
- A recommendation such as "approve if you accept A3".

**LOOK**
The page is calm and readable. It has generous whitespace, a serif headline, and a summary box. But it is long, with many folds and repeated sections. The screenshots are dark, tiny terminal frames that add little.

**VERDICT: mostly.**
The single biggest fix is to open with one plain sentence and a real saved command run, so the "not run, planned" caveat disappears. It should also put the two things you need to do (approve, and set up the labels and branch protection) at the very top.
