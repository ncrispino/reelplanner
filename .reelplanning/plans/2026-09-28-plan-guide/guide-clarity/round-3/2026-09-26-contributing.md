# Review of the "Several people, one repo" guide

## 1. What is this change, and why should I care?
The change adds rules and automation so more than one person can contribute to a reelplanning repo. It covers when a PR needs a video, who approves what, how decision numbers stay in order, and what CI checks. You should care because reelplanning assumed a single owner. This repo is meant to be the first shared one, so without this, outside PRs have no agreed process.

Found: the top blurb and "In short", no opening needed. The page has no plain one-sentence summary of its own, and it lists that gap under "What the plan and walkthrough don't say yet". I pieced the sentence together from the blurb and the step headings.
Confidence: medium

## 2. What can I do now that I couldn't before?
- **Video rule:** A PR gets a video only if it makes a choice a reviewer could decide the other way, or changes more than 300 lines outside tests, docs, videos and generated files. There is a PR template and a "Contributing with reelplanning" section in CONTRIBUTING. Evidence: a picture of the template, taken from the walkthrough video.
- **Two roles:** A contributor's own review of their walkthrough doesn't count as a maintainer's. Evidence: a terminal picture of `reel record` printing a △ warning and "+0 (nothing new)" for the contributor Ana.
- **Reviewing a contributor's video:** `reelplanning review <folder>` serves a packed video folder as it is. Evidence: a command only.
- **Decision numbers:** After a rebase conflict, `reel renumber` moves the branch's new decision numbers after main's last one, so D-194 becomes D-195. Evidence: a described example only.
- **CI:** It runs the fast tests on every push, `reel pr-check` and `reel audit` on every PR, and the full suite once a PR is labelled ready-to-merge. Evidence: a picture of the YAML.

The page says outright that no run was saved. The video shows the pictures, but no real command output is kept, and the commands are "named in the walkthrough, not run". Real evidence is thin.

Found: the five step cards under "What you can do now" and "Try it yourself". I didn't open the folded "What was built for it" sections.
Confidence: medium

## 3. How would I try it myself?
The page gives only one command per step. The first ones I would run, from the repo's top folder:
```
gh pr view
reelplanning review <folder>
npm run test:full
```
Step 4 is `git rebase origin/main`, followed by `reel renumber` when it stops at the conflict. Step 2 has no command at all. `<folder>` isn't filled in, so I would have to guess it. The page itself says none of these has been shown to work.

Found: the "Try it yourself" section, no opening needed.
Confidence: medium

## 4. What did the agent decide on its own, and what should I look at first?
The agent made ten decisions. Five are highlighted and five smaller ones are folded away.
1. **CI file name (changed the plan):** The workflow is `ci.yml`, not `test.yml`, because it runs more than tests.
2. **PR over the line with no video:** It prints a △ and passes. Only `--merge` in the full-suite job makes it fail.
3. **Maintainer identity:** `maintainers` is just `["owner"]`, with no email.
4. **Old plan folders:** Plan folders dated up to 2026-09-27 keep their media committed.
5. **Full-suite job:** It always runs and fails at once without the `ready-to-merge` label. It doesn't skip, because GitHub counts a skipped required check as passed.

Look first at #3, the maintainer identity. It affects who counts as a maintainer, and the page itself flags it as an open problem once a second reviewer exists. Then look at #2 and #5, since together they decide whether a PR can merge without a video or tests. #1 is the only one that changed the plan, but it is low stakes.

Found: the section "What the agent decided on its own". The five smaller decisions are folded and I did not open them.
Confidence: high

## 5. What needs me right now?
- Review and approve the walkthrough video, or ask for changes. It pauses on the five decisions above so I can accept or flag each.
- In the repo's settings on GitHub, create the labels `needs-video`, `no-video` and `ready-to-merge`. Then mark the full-suite check as required under Settings → Branches.
- Answer the open question of who "owner" is once a second person reviews.

Found: "Needs you" in the summary, and again in its own section, no opening needed.
Confidence: high

## 6. What could go wrong, or isn't done?
- CI has never run on GitHub. Its first real run will be the first PR after merge.
- Until the labels and the required check are set up, merging without the full suite is possible.
- Any second reviewer who publishes on their own hosted page is also named "owner", so their accepts would count as a maintainer's.
- A review filed from a local machine is treated as a contributor's until an email is added.
- No command output was saved as evidence.
- The page says "Three things" are not done, but I could only clearly identify these. The fuller list may be in the walkthrough video.
- A second agent reviewed the code and found nothing to question in all 5 steps and 33 decisions.

Found: the "What isn't done, and what could go wrong" section and the "Not done" line in the summary, no opening needed. The "What it found" and "What was tested" parts of the code check are folded and I did not open them.
Confidence: medium

## 7. Where is the code, and how would I see exactly what changed?
The change is 66 hand-written files in eight parts (PR check, roles, watching a video, decision numbers, templates, CI, skill and docs, tests, plus "other"). Each part opens to its real diff. To see it in git:
```
git show 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc
```
The plan lives in `.reelplanning/plans/2026-09-26-contributing/plan.md`.

Found: the "Where the code is" section. The diffs are folded, but the git command and the commit hashes are visible.
Confidence: high

---

## CONFUSED
- **"walkthrough video" / "Back to the video":** I guessed this is a separate recorded video of the change running. I can't see it, only stills.
- **"reel record", "reel audit", "reel pr-check", "reel renumber":** I guessed these are subcommands of a second tool called `reel`, for the project's record. I don't know what "record" and "audit" do in practice.
- **"decision log", "ledger: +0 (nothing new)":** I guessed it is a project-wide list of decisions, and that "+0" means no new entries.
- **"A2", "D1", "m":** These are decision codes. I understood them only after re-reading the explanation of A, D and m.
- **"bundle-player packed", "plan map", "throwaway branch":** I couldn't tell what these are.
- **"negated lines in .gitignore":** I guessed these are exceptions that keep old media tracked.
- **"Three things, as the walkthrough says":** I couldn't tell which three.
- **"Your notes · 0", "Words this page uses · 5":** Unclear how they relate to the page.
- **"whether one person uses reelplanning and the others don't":** I guessed it is just a scenario description.
- **Step 1 "Try it": `gh pr view`:** I guessed it just shows a PR's text, which isn't really trying the new feature.

## BORED
- The "Where to check it in the code" rows repeat under every decision.
- The large blocks of code-diff stats and the "Other files the change touched" (40 files, +4051 lines) are noise for an owner.
- The "How this page was made" and "The plan, in its own words" sections read as padding.
- The "What the plan and walkthrough don't say yet" list is the agent's housekeeping, not something I can act on.

## MISSING
- A one-sentence "what this does" at the top. The page admits this itself.
- Any real command output, or a saved run showing something working.
- A step 2 command.
- A plain description of what a contributor experiences end to end, for example "Sam opens a PR, gets a △, adds a video, you accept it".
- A clear list of the "three things not done".
- A statement of how risky merging is before the GitHub settings exist.

## LOOK
It is calm, uncluttered and well spaced, with a serif headline and readable body text. The reading order (summary, steps, decisions, needs you) is easy to follow. The many folded sections and unexplained jargon (`reel`, D and A codes) make it feel like it was written for insiders.

## VERDICT
**Mostly.** I understood the gist and what needs me within five minutes, but not what actually works or how to try it. The single biggest fix is to add a plain one-sentence summary and saved command output, since the page itself says "not proof that they work".
