# Review of "Several people, one repo"

**1. What is this change, and why should I care?**
The agent added rules and tooling so reelplanning works when several people share a repo. It covers when a PR needs a video, who reviews it, how decision numbers avoid clashing, and what CI checks before a merge. You care because reelplanning assumed one person per repo, and you asked for this yourself, with this repo as the first user.
Found: the top of the page and the quoted request; no opening needed.
Confidence: medium-high.

**2. What can I do now, and what evidence is shown?**
- **PR video rule.** A PR needs a video only if it makes a choice a reviewer could go the other way on, or changes over 300 lines outside tests, docs, videos and generated files. A `reel pr-check` command reports where a PR stands against that. Evidence: a screenshot of the PR template with checkboxes.
- **Two roles.** A maintainer and a contributor, where a contributor's own review counts only as their own check. Evidence: a terminal picture of `reel record`, where Ana's review adds "+0 (nothing new)" to the decision log.
- **Watching a contributor's video.** `reelplanning review <folder>` serves a packed video folder as it is. Evidence: only a code diff. I saw no picture.
- **Decision-number clashes.** After a rebase conflict, `reel renumb` (a truncated `reel renumber`) fixes the numbers. Evidence: a picture of two plans both claiming D-001, then the command being typed. The output isn't visible in the frame I saw.
- **CI.** Four jobs in `ci.yml`, with a full-suite check that is meant to gate merging. Evidence: a frame headed "4 jobs" that I only glimpsed.

The real evidence is thin. The page states that no run was saved, and that every command is "as planned, not run" or "named in the walkthrough, not run". The pictures are stills from a walkthrough video, which I can't see.
Found: the step sections and Try it yourself. Some detail was hidden behind "What was built for it".
Confidence: medium.

**3. How would I try it?**
The page gives these, from the repo's top folder:
```
reel pr-check --base origin/main
gh pr view 44
reelplanning review <folder>
npm run test:full
```
The last of these would run everything. Steps 2 and 4 have no command written, although `reel record <plan>/wa.json` and `reel renumb` appear in pictures. The first command I'd run is `reel pr-check`. Note that the page says none of these has been run.
Found: Try it yourself; it needed no opening, but some command text is cut off with "…".
Confidence: medium.

**4. What did the agent decide on its own?**
It made ten decisions, five of them highlighted:
- **D1.** It named the workflow `ci.yml` instead of the planned `test.yml`. This is the one that changed the plan.
- **A2.** A PR that needs a video but lacks one only gets a warning (△) and still passes. It fails only under `--merge` in the full-suite job.
- **A3.** `maintainers` is `["owner"]` with no email.
- **A6.** Older plan folders, dated up to 2026-09-27, keep their video media committed.
- **A9.** The full-suite job runs on every PR and fails at once if `ready-to-merge` is missing.

Look first at D1 because it deviates from the plan. Then look at A3, because its consequence is the open point that a second reviewer would also count as "owner". A9 is also worth a look, because it decides whether an untested PR can merge.
Found: What the agent decided on its own; visible without opening. Five smaller ones are folded.
Confidence: high.

**5. What needs me right now?**
- Watch the walkthrough video and press Finish there. No review is on file.
- Create the labels `needs-video`, `no-video` and `ready-to-merge` in GitHub.
- Mark the `full suite` check as required in Settings → Branches.

Found: the "Waiting on your review" line and the Needs you section.
Confidence: high.

**6. What could go wrong, or isn't done?**
- CI has never run on GitHub. Its first real run will be the first PR after this merges.
- The labels and the required-check setting are not in place, so merges aren't actually gated yet.
- "owner" isn't a unique identity. A second reviewer using their own hosted page would also count as the owner.
- A local review made under a git email is treated as a contributor's until that email is added to the config.
- Nothing shows any of it running, and the page lists missing worked examples and saved runs.
- A second agent reviewed the code and found nothing to question.

Found: Not done, and the What isn't done section.
Confidence: high.

**7. Where is the code, and how do I see what changed?**
It is 66 hand-written files in eight groups: PR check, Who decides, Watching a video, Decision numbers, Templates, CI, Skill and docs, and Tests. Each group opens to its diff. There are also 43 generated files. The command is `git show 565cc23 19e6e2c e7904a3 6ea6a9f d4d30a4 97052cc`. No repo path or branch name is given.
Found: Where the code is; the diffs are behind "See the code", and the commits are listed under a fold.
Confidence: high.

---

**CONFUSED**
- "reel" versus "reelplanning". I guessed reel is the second command for the project's record.
- "the line" for a video ("its videos against their text", "against the line"). I guessed it means the 300-line or "makes a choice" threshold.
- "system video" versus the "walkthrough video". I guessed the system video is an overall explainer for the tool and the walkthrough is this change's video.
- "Waiting on your review: none is on file yet". I first read this as "nothing is waiting". It actually means no review has been recorded yet.
- "A, D, m" codes, and "ten decisions" against "33 decisions". I guessed 10 is this plan's and 33 includes the earlier ones.
- "packed folder", "bundle-player", "plan map", "ledger", "renumb". I guessed at the meaning of each.
- Truncated text with "…" throughout, for example "the check required before a merge …".
- "The owner's, in the repo's settings" appears as a Not done item, but it is really a to-do for you.
- "Send", "hosted page" and "published as owner". I couldn't follow this.

**BORED**
- The Where the code is section repeats the step headings. The "How this page was made" material, the six commits and "the plan in its own words" are mostly noise for an owner.
- The Not done and Needs you text is repeated in the In short box, the Needs you section and the Not done section.

**MISSING**
- Any real output from a command.
- A plain first line saying what to do next, such as "watch the video". The link to the video is easy to miss.
- A one-line summary of the CI's overall behaviour.
- A repo path or branch or PR link, and a risk rating.
- How a contributor would actually experience the flow, walked through as one story.
- A picture for step 3 or step 5. I couldn't clearly see one.

**LOOK**
The page is calm and readable. It has good typography, a warm palette, and generous spacing. But it is long, with many folded sections, and the jargon is dense.

**VERDICT**
Mostly. The biggest fix is to lead with one plain paragraph and one action ("watch the 5-minute video, then create three labels"), and to define the terms before using them. Real command output would also help, since everything is marked "not run".
