# Review of the "Several people, one repo" guide

**1. What is this change, and why should I care?**
The change adds rules and tooling so several people can work in one reelplanning repo. It covers when a PR needs a walkthrough video, who reviews it, how decision numbers avoid clashing, and CI checks. You care because reelplanning assumed one person per repo, and this repo is the first shared one.
Found: title, intro and "In short" box at the top; no opening needed.
Confidence: high

**2. What can I do now that I couldn't before, and what evidence is there?**
- Contributors get a PR template and a CONTRIBUTING section. A PR needs a video only if it makes a choice a reviewer could reverse, or changes more than about 300 lines outside tests, docs, videos and generated files.
- `reel pr-check` reports where a PR stands against that rule.
- A contributor's own walkthrough review doesn't change the decision log. Only a maintainer's does.
- `reelplanning review <folder>` serves a contributor's packed video folder.
- `reel renumber` fixes decision-number clashes after a rebase.
- CI has four jobs: fast, pr-check/audit, full, and one more I couldn't identify. A full-suite check gates the merge.

The evidence is stills from the walkthrough video. They include a PR template with the 300-line rule, a terminal showing `reel record` printing a △ "id:ana is not in maintainers" and "+0 (nothing new)", a rebase conflict followed by `reel renumber`, and a ci.yml snippet. The page says outright that no run was saved and that the commands are "named in the walkthrough; not run here". So the only evidence is the video. I did not watch it, and the stills are not command output I can trust.
Found: "What you can do now" section, five step cards with video stills. "Try it yourself" was visible without opening anything. "What was built for it" was folded and I didn't open it.
Confidence: medium

**3. How would I try it myself?**
The page gives these, run from the repo's top folder:
- `gh pr view` (step 1)
- `reelplanning review <folder>` (step 3)
- `git rebase origin/main`, then `reel renumber` when it conflicts (step 4)
- `npm run test:full` (step 5)

Step 2 has no command. `<folder>` is never filled in with a real path. Since I have no repo, I would start with `npm run test:full`, as the only one that needs no arguments.
Found: "Try it yourself" section, visible without opening anything.
Confidence: medium

**4. What did the agent decide on its own, and which should I look at first?**
There were ten decisions, five highlighted and five smaller ones kept in a folded list. The five highlighted:
- **A2:** a PR that's over the line with no video prints △ and passes, and only fails at merge time.
- **A3:** the maintainer list is `["owner"]` with no email.
- **A6:** old plan folders, dated up to 2026-09-27, keep their video media committed.
- **D1:** the workflow is named `ci.yml` instead of the plan's `test.yml`.
- **A9:** the full-suite job always runs and fails fast without a ready-to-merge label.

I'd look first at D1, because it is the only one that changed the plan. Then A3, because it ties to an unresolved problem (see Q5). Then A9, because it makes merging depend on your GitHub settings.
Found: "What the agent decided on its own". The five smaller ones are folded and I didn't open them.
Confidence: high

**5. What needs me right now?**
- Review the walkthrough video and approve it or ask for changes.
- In GitHub settings, create the labels `needs-video`, `no-video` and `ready-to-merge`, and mark the "full suite" check as required. Only you can do this.
- An open question: `owner` can't tell two reviewers apart once a second person reviews. The page defers it to a later plan.

Found: the header line, "What needs you", and again under "What isn't done". No opening needed.
Confidence: high

**6. What could go wrong, or isn't done?**
- CI has never run on GitHub, so its first real run comes with the next PR.
- Branch protection isn't set up yet, so the full-suite gate does nothing until you do it.
- The maintainer identity problem above.
- The page notes that a second agent checked the code and found everything matched the plan. Its findings are folded, so I couldn't see them.
- The "what the plan doesn't say yet" list shows gaps. There is no how-to-try for step 2, and five steps have no cases table, interface block or worked example.
- Nothing was run and saved, so none of the commands are proven.

Found: "What isn't done, and what could go wrong". The code-check details were folded.
Confidence: high

**7. Where is the code, and how do I see what changed?**
It is 66 hand-written files, plus 43 generated ones, split into eight groups. The groups are PR check, Who decides, Watching a video, Decision numbers, Templates, CI, Skill and docs, and Tests. A ninth group holds 40 hand-written files that no part of the walkthrough names. Each has a "See the code" fold showing its diff. For the whole change:
`git show 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc`
The repo location and branch aren't stated on the page. The plan file is `.reelplanning/plans/2026-09-26-contributing/plan.md`.
Found: "Where the code is". The command was visible without opening anything. The diffs are folded.
Confidence: high

## CONFUSED
- "Waiting on your review of the walkthrough video" / "Back to the video". I guessed the walkthrough video is a separate recorded demo of the change. I never found a link to it.
- "system video": "updated system video too". I guessed it is a whole-project overview video that also needs updating. Step 5 supposedly covers it, but the visible text never explains it.
- "plan map", "bundle-player", "packed folder", "Send files the review in the inbox". I guessed these are internal pieces of the tool, and I couldn't tell what "Send" is.
- "reel is its second command, for the project's record". I guessed there are two CLIs, `reelplanning` and `reel`.
- "A/D/m" numbering versus "33 decisions" versus "26 earlier decisions" versus "ten things". I could not reconcile these counts.
- "△ and passes; --merge ... makes it a failure". I guessed this is a warning that becomes a hard failure in the merge job.
- "Sam's D-194", while the video still says "Ana". I guessed Sam and Ana are two example contributors.
- Truncated text: "`walkthrough …" and "full runs this …". These look like cut-off sentences.
- "19 reviews filed as owner". I guessed this is history from the hosted review page.
- "4 jobs" in ci.yml, while I could only identify three (fast, pr-check, full). The fourth may be the system video.

## BORED
- The "In short" box repeats the section list from "On this page" and again from the step cards.
- The decisions list ("How much does a PR ask…") is terse, and I skimmed it.
- The list of file counts and +/- line totals for the eight groups.
- The "What the plan doesn't say yet" boilerplate.

## MISSING
- Any real command output as evidence. I got only video stills, plus the page's own admission that nothing was run.
- A one-line statement of what to do first. The video review is mentioned, but there is no link or timestamp guidance for the highlights.
- The repo name or URL and a PR link.
- A concrete example for step 2 and the `<folder>` path.
- Findings from the independent code check. They are folded away, and the headline "all done as planned" is the only visible result.
- A plain explanation of why a video is needed at all, for someone new.

## LOOK
It is calm and typographically clean, with a good serif heading, generous spacing and video stills. The prose is dense with internal jargon and truncated fragments. The many folds and duplicated lists make it hard to tell what matters.

## VERDICT
**Mostly.** In five minutes I understood the purpose, the five-step shape and what I must do (review the video and set up GitHub labels and branch protection). I could not verify that any of it works. The biggest fix is to lead with a short, jargon-free "what you must do" and one run-and-see command with real captured output, and to explain "system video", "plan map" and the truncated sentences.
