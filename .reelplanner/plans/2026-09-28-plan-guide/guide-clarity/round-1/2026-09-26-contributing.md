# Review of the "Several people, one repo" guide

## 1. What is this change, and why should I care?
The change adds rules and tooling so a repo can be shared by several people while still using reelplanning. It covers when a pull request needs a video, who reviews and decides, how decision numbers stay in order, and a CI (automated checks on GitHub) gate before merging. You should care because you asked for this. Until now the tool assumed one person per repo, and this repo is the first to use the new rules.
Found: the intro and quote at the top; no need to open anything.
Confidence: high

## 2. What can I do now that I couldn't before?
- **Decide which PRs need a video.** Only a PR that makes a choice a reviewer could make the other way, or changes more than 300 lines outside tests, docs, videos and generated files, needs one. Evidence: a screenshot of the PR template with two checkboxes, plus a caption.
- **Separate maintainers from contributors.** A contributor's review doesn't add to the decision log, and a maintainer's does. Evidence: only a prose description. I saw no output or picture.
- **Watch a contributor's video.** `reelplanning review <folder>` serves a packed video folder, which the contributor pushes to a throwaway branch. Evidence: a terminal screenshot showing `gh pr checkout 42` and `git clone`, with a caption.
- **Fix decision-number clashes with one command.** `reel renumber` moves the branch's new entries after main's last, so Sam's D-194 becomes D-195. Evidence: a described example only.
- **Get a CI gate.** Fast tests run on every push. `reel pr-check` and `reel audit` run on every PR. The full suite runs only when the PR is ready to merge. Evidence: a screenshot of the YAML snippet.

All of this evidence is stills of the walkthrough video, which I can't play. No command output is shown. The page says the commands were "not run here".
Found: "What you can do now" and "Try it yourself"; no need to open anything.
Confidence: medium

## 3. How would I try it myself?
The page gives no single starting command. Its list is:
- `gh pr view` (step 1)
- `reelplanning review <folder>` (step 3)
- `git rebase origin/main`, then `reel renumber` (step 4)
- `npm run test:full` (step 5)

Step 2 has no command. Every one is marked "not run here". I would start with `npm run test:full`, because it is the only one that stands alone. The others need a PR, a packed video folder, or a two-branch conflict that I would have to set up.
Found: "Try it yourself"; no need to open anything.
Confidence: medium

## 4. What did the agent decide on its own?
The agent decided ten things and flags five:
- A PR with no video prints △ and passes on ordinary pushes, but fails under `--merge` in the full-suite job.
- `maintainers` is `["owner"]` with no email.
- Older plan folders (dated up to 2026-09-27) keep their media committed.
- The workflow file is `ci.yml`, not `test.yml` as the plan said.
- The full-suite job always runs and fails without the `ready-to-merge` label, because GitHub treats a skipped required check as passing.

I would look at the maintainers/owner decision first. It is the weakest, and the page itself admits it breaks once a second reviewer appears. Second is the "passes with a △" behaviour, because you'll see it often. Five more small ones are folded away.
Found: "What the agent decided on its own"; the five smaller ones are folded.
Confidence: high

## 5. What needs me right now?
- **Review:** watch the walkthrough video and approve it or ask for changes. It pauses on the five choices above so I can accept or flag each.
- **Repo settings:** create the labels `needs-video`, `no-video` and `ready-to-merge`, and mark the full suite as a required check.

The page puts the settings task under "what isn't done", not under "What needs you". I only noticed it there.
Found: "What needs you" and a bullet under "What isn't done".
Confidence: high

## 6. What could go wrong, or isn't done?
- CI has never run on GitHub. Only the YAML parse and local commands were checked.
- The owner identity breaks once a second person reviews. A second reviewer's accepts would count as the owner's.
- The labels and branch protection aren't set up yet.
- The video for a PR lives on a throwaway branch and is gone after the merge. Rebuilding it needs the voice engine.
- The tool has to be tried on the first real PR.
- The "missing" box lists five gaps in the plan and walkthrough: no step 2 command, and no Cases, Interface or worked examples.
- The code check says steps 5 of 5 ✓, decisions 33 of 33 ✓ and unexplained 0 ✗.

Found: "What isn't done", plus the missing-items box; the code-check details are folded.
Confidence: medium

## 7. Where is the code, and how do I see what changed?
- "Where the code is" lists 66 hand-written files in eight groups, plus 40 more hand-written files and 43 generated ones in "Other files". Each group has a "See the code" fold with its diff.
- Rough sizes: PR check +293, templates +287, tests +216, CI +111, decision numbers +112.
- There is also a fold called "The six commits". Repo paths appear (`.reelplanning/plans/2026-09-26-contributing/plan.md`) but no URL, branch name or PR link.

I would open "See the code" for the PR check and for CI. To see everything in one place I'd use the six commits.
Found: "Where the code is" and "How this page was made", where the commit approach is described; folds not opened.
Confidence: medium

---

**CONFUSED**
- "Waiting on your review": I guessed it means the walkthrough video review, not a GitHub PR review.
- "the line for a video": I guessed it means the 300-line threshold.
- "prints △ and passes": I guessed it's a warning triangle in the check's output.
- "reel record", "reel audit", "reel pr-check", "bundle-player", "code check": I guessed these are the project's own subcommands and don't exist outside it.
- "A2", "A3", "D-201", "D-171": I guessed A is an agent decision and D is a logged decision.
- "Sam": I guessed an imaginary contributor used as an example.
- "unexplained 0 ✗": a ✗ next to a zero looks like a failure. I guessed it means zero unexplained items, which is good.
- "It was built in five steps… Five things break": the five things are never listed on the page, so I guessed they map to the five steps.
- Truncated text: "`walkthrough …" and "full runs this …".
- "your plan's words" and "Your notes · 0": I guessed a commenting feature.

**BORED**
- The "Also in the video" timestamps repeated under every step.
- The folded "What was built for it" and "What the plan asked for" blocks, identical in shape for every step.
- The "You decided for this step" lines, which repeat the decisions section.
- The long "Where the code is" list, and "Other files", which has 4051 added lines.

**MISSING**
- A real command that I can run and see working, with actual output.
- A one-line summary of the five things that broke.
- A link to the PR, branch or diff, and the commit hashes.
- A plain "what changed in your day-to-day" summary.
- A clear statement of whether CI passing is proven. It isn't.
- The "what you need to do" items collected in one place.

**LOOK**
The page is calm and readable, with serif headings, plenty of whitespace and a clean layout. It is long, and it leans heavily on jargon and internal IDs. The screenshots are static video frames with little detail.

**VERDICT: mostly.**
I got the gist and the to-dos in about five minutes. But I couldn't tell what I'd run or see for myself, and the stills give only thin proof. The biggest fix is to open with a short block listing the five problems and their solutions, with one real command and its actual output. Move the owner's to-dos (labels and required check) into "What needs you".
