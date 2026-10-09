# Review of "Several people, one repo"

**1. What is this change, and why should I care?**
The change makes reelplanning usable when more than one person works in a repo. It adds contribution rules, PR checks, CI and merge rules, and a way to keep decision numbers from colliding. You care because you said this matters, and it's "meta": this repo is the first to use the rules.
Found: the top paragraphs and the "In short" box; nothing opened. Confidence: medium. The page never gives a one-line summary. It admits that itself in the "don't say yet" box.

**2. What can I do now that I couldn't before, and what evidence is shown?**
- A PR template and CONTRIBUTING section say when a PR needs a video: a choice a reviewer could make the other way, or more than 300 changed lines. Evidence: a screenshot of the template from the walkthrough video.
- `reel pr-check` reports where a PR stands against that rule. Evidence: none. It is marked "as planned, not run".
- A maintainer can play a contributor's video with `reelplanning review <folder>`. Evidence: a video still of a terminal running `gh pr checkout 42` and `git clone`.
- Decision numbers renumber in order with `reel renumber`. Evidence: only a video moment.
- GitHub CI runs the fast suite, `pr-check` and `audit`, and a full suite that needs a `ready-to-merge` label.

The page states plainly that no run was saved. The only proof is the walkthrough video, which I can't see. The stills are illustrations, not command output.
Found: "What you can do now", "Try it yourself" and "In short"; the command notes were partly cut off with "…". Confidence: medium.

**3. How would I try it myself?**
In the repo's top folder:
1. `reel pr-check --base origin/main`
2. `gh pr view 44`, though this only shows a PR. The rest of that step's text is cut off.
3. `reelplanning review <folder>`
4. `npm run test:full`

I would start with `npm run test:full` or `reel pr-check`. Steps 2 and 4 have no command written down. Each entry is labeled "not run".
Found: "Try it yourself"; text was truncated with "…". Confidence: medium.

**4. What did the agent decide on its own, and which should I look at first?**
The agent made ten decisions; five are highlighted:
1. The CI file is `ci.yml`, not the planned `test.yml`. This is the only one that changed the plan.
2. A PR with no video gets a warning (△) and passes, but fails at merge time.
3. `maintainers` is just `["owner"]`, with no email.
4. Older plan folders keep their committed media, and newer ones follow the ignore rule.
5. The full-suite job runs on every PR and fails right away without the `ready-to-merge` label.

Look first at #3, the maintainer identity. It links to the page's own open problem: a second reviewer would also be counted as "owner". Then #5, since it changes what can merge. #1 is cosmetic.
Found: "What the agent decided on its own"; the "full wording" and "chose instead of" parts were folded and I didn't open them. Confidence: medium.

**5. What needs me right now?**
- Watch the walkthrough video and press Finish, to approve or ask for changes.
- Create the labels `needs-video`, `no-video` and `ready-to-merge`.
- Mark the full-suite check as required in Settings → Branches.
- Accept or flag the five highlighted choices.

Found: "Needs you" in the summary box, and the "What needs you" section; the text was cut off with "…". Confidence: high.

**6. What could go wrong, or isn't done?**
- CI has never run on GitHub.
- Branch protection and the labels aren't set up. Until they are, nothing enforces the rules.
- Multiple reviewers can't be told apart, so a second person's accepts would be counted as the owner's.
- Nothing was run and saved as proof.
- The page lists gaps in the plan: no cases tables, interfaces or worked examples.
- The independent code check found nothing, but it only compared the code to the plan.

Found: "What isn't done" and "The code check". Confidence: high.

**7. Where is the code, and how do I see what changed?**
It is 66 hand-written files in eight groups (PR check, roles, review, decision numbers, templates, CI, skill and docs, tests), plus 43 generated files. Each group has a "See the code" fold with its diff. To see it all in git, run `git show 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc`.
Found: "Where the code is" and the copyable command; the diffs are folded. Confidence: high.

## CONFUSED
- "bundle-player packed" and "Serving a packed folder". I guessed it means a video folder bundled for playing.
- "the plan map" and "system video". I guessed the plan map is a generated diagram and the system video is a whole-project overview video.
- "A / D / m" labels and ids like "A2", "D1". I worked out A is open choice, D is changed plan and m is minor, but only after reading the intro sentence.
- "The plan left ten things… five… and five smaller", against "all 33 decisions". The counts are confusing.
- "the code check agreed on all 33 decisions". I don't know which 33.
- "throwaway branch" and "Attached to the PR, as a zip". I guessed how a contributor's video reaches the maintainer.
- "as planned, not run" versus "named in the walkthrough, not run". I guessed they mean roughly the same thing.
- "negated lines in .gitignore". I guessed it means exceptions to the ignore rule.
- "GitHub counts a skipped required check as passed". I guessed it explains why the job fails immediately instead of being skipped.
- "reel" versus "reelplanning". The page explains this in one line.

## BORED
- The "decisions it was built on" list and "The plan, in its own words".
- The per-step folds ("What was built for it" and "What the plan asked for").
- The "How this page was made" section and the "28 notes".
- The "what the plan doesn't say yet" checklist. It is about the plan's paperwork, not the change.
- Facts like the missing run and the review status appear three or four times.

## MISSING
- A one-sentence summary of what this is.
- Any real command output or run. The page says so itself.
- A plain example of a contributor's flow, from a PR to a merge.
- What the PR size line actually measures for a typical PR.
- Which single decision to check first. The page says the five are worth a look but gives no ranking.
- The video itself is only linked, so I couldn't judge it.

## LOOK
The page is calm and clean, with a lot of white space and a serif heading. The still images are helpful. The text gets dense in the middle, and many `…` truncations, unexplained ids and folded sections make it feel like a reference document.

## VERDICT
**Mostly.** Within five minutes I understood the shape and the to-do list. I could not tell whether anything works. The biggest fix is to add a plain "In one sentence" line at the top plus one saved real run, such as `reel pr-check` output on an actual PR. That would turn "planned, not run" into evidence.
