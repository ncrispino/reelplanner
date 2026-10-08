# Review of the "Explain first" guide

## 1. What is this change, and why should I care?
The change adds a new kind of video to ReelPlanning. It's an "explainer" that shows you what's already in the repo, a branch, or a transcript before any plan exists. You can then decide whether to turn it into a plan. You should care because you asked for this. Until now every video was tied to a plan, so you had no way to just find out what's going on.

Found: the title, subtitle and your quoted request at the top of the page (no opening needed). Confidence: high

## 2. What can I do now that I couldn't before?
- **Ask for an explainer** in your own words, about files, a decision, a table or a log. Each source is "pinned", meaning frozen as it was. The page shows a picture of a table of sources (a file, a decision and a CSV, each labelled with a shape, a size and whether it gets a guide part). It also shows the command as text.
- **Review it in the same player**. Finish now ends in Done, Explain more or Plan this. The evidence is a screenshot of the Finish screen with suggestion boxes. There is no output from a real run.
- **Turn the review into a plan** with "Plan this". The evidence is a screenshot of a generated `plan.md` that starts "Explained first:" and quotes your comments.
- **Have facts checked against their sources**, with secrets blocked from the build and the transcript kept out of git. The evidence is video moments and the diff. I saw no picture that I could read as proof.

The "pictures" are stills from the walkthrough video. Every command is marked "Named in the walkthrough; not run here." The page also says no explainer has been built in this repo yet. The demo ran on a scratch clone.

Found: "What you can do now" and "Try it yourself". The step summaries are folded, so I couldn't read the "What was built for it" text without opening them. Confidence: medium

## 3. How would I try it myself?
The page gives templates, not runnable commands, and I would run them in this order from the repo's top folder:
1. `reelplanning explain "<what you asked>" <source> … --dry-run`. I would add `--dry-run` myself, since it's the only safe-looking flag. I would fill in a real question and a real file, for example `scripts/review.mjs`.
2. `reel record <explainer-dir>`
3. `reel new-plan <repo> <slug> --from <explainer-dir>`
4. `reelplanning check-sources <video-dir>`

There is no worked example with real arguments. I also don't know how to open the review player.

Found: "Try it yourself", visible with no opening. The descriptions under each command are cut off with "…". Confidence: medium

## 4. What did the agent decide on its own?
The agent had 13 decisions to make. It flagged seven for you to look at first:
- **A1** (hard to undo): the name format is `<name>--explainer`, not `explainer:<name>`, because Windows folders can't contain a colon.
- **A6** (hard to undo): a secret, email or home path anywhere in the video text stops the build. The plan only said inside quoted lines.
- **A7**: a third fact-checker role, used only when a source needs a guide part.
- **A9**: a "What you want next" box, with suggestions built from the video itself.
- **A10**: an unreviewed explainer waits under "Needs you".
- **A12**: `new-plan --from` works without `--plan` and writes a draft.
- **A13**: Finish offers Done first, even when there are comments.

Look first at **A1 and A6**. The page labels them "hard to undo later", and they are the ones that constrain future work: names and the build's blocking rules. Next would be A13, since it changes how you'll see the review every time. Six smaller choices are folded away and I didn't open them.

Found: "What the agent decided on its own", visible. The six smaller choices are folded. Confidence: high

## 5. What needs me right now?
Nothing, according to the page. It says you already approved on 30 Sep 2026 and accepted A9, A12 and A13. There's a folded list of "the plan's questions, and how each was answered" (3), and I didn't open it.

Found: "What needs you", visible. Confidence: high

## 6. What could go wrong, or isn't done?
- The "guide parts" for big sources are only a detail page for now. The builder that would make them properly (D-228) is approved but not built.
- "Ask about this" on a hosted page can't read the actual source files. It only sees names, quoted lines and the glossary.
- The system video is out of date by one glossary row. It will be refreshed later.
- There are 13 calls, one past the audit's warning threshold of a dozen.
- No explainer has ever been built in the real repo.
- The independent code check gave "unexplained 5 ✗", though the page says each was answered. That's odd next to "decisions 55 of 55 ✓".
- "What the plan and walkthrough don't say yet" lists gaps: no command for step 1, and missing cases and traces.
- Step 1 has no try-it command.

Found: "What isn't done, and what could go wrong", visible. The findings (8) and tests are folded. Confidence: medium

## 7. Where is the code, and how do I see what changed?
- Twelve commits are listed, from `60e9173` to `5609921`, all dated 29 Sep 2026. I got their hashes only by opening "The twelve commits".
- The change touches 62 hand-written files, in seven groups: the explain command, the Explainer row, Finish, Plan this, check-sources, the skill, and tests.
- Each group has a "See the code" fold with the diff and line counts (+576/−13, and so on). The biggest is "Other files", at +3091.
- The page's footer says the diffs come from `git show -U10` of those commits.
- The main files are `scripts/explain.mjs`, `scripts/lib/explainer.mjs`, `scripts/reel.mjs`, `scripts/check-sources.mjs` and `packages/player/reelplanning-player.js`.
- The plan itself is at `.reelplanning/plans/2026-09-29-explain-first/plan.md`.
- I didn't see a branch name or a single "git diff A..B" command.

Found: "Where the code is" and "The twelve commits". The commits need opening, and so do the diffs. Confidence: medium

---

## CONFUSED
- **"pins every source" and "pinAll".** I guessed it means freezing a copy or version of each source.
- **"guide part".** I guessed it's an extra explanatory sub-page for long sources.
- **"fresh eyes", "checker (F1 …)".** I guessed these are reviewer agents that haven't seen the work.
- **"D-249", "D-228", "A9".** I guessed D-numbers are decision-log entries and A-numbers are the agent's choices. They are never introduced.
- **"the missed-checks guard".** I couldn't tell what it is.
- **"reel audit warns on a dozen calls".** I don't know what a "call" is here.
- **"unexplained 5 ✗".** Unclear.
- **"walkthrough" vs "plan video" vs "system video".** I only worked out the difference in the opened text.
- **"reelplanning" vs "reel".** I assumed they are two CLIs.
- **"changed after review: …"** This is a long parenthetical inside A9 and A13 that I struggled to follow.
- **"the box follows this video's own suggestions…".** I couldn't picture what that looks like.

## BORED
- The lists of "where to check" symbols (`openQuestion, showHandoff, nextSuggestions…`).
- The folded "What was built for it" and "What the plan asked for" blocks, repeated five times.
- The commit-group lists.
- The many "Also in the video" timestamp links.
- The "How this page was made" and "Every note the builder made" sections.

## MISSING
- A real example of it working, such as an actual explainer's output or a command run with its result. Every command is "not run here".
- A one-line "how to open the player and see it".
- Step 1's try-it command. The page itself lists this as missing.
- A short list of which risks matter, and a plain answer to "is it safe to merge?"
- A single git range or branch to diff.
- A clear explanation of the vocabulary before it is used.

## LOOK
The page is calm and well spaced, with a nice serif design, big headings and a table of contents. But it's long. The middle is dense with jargon, file paths and parenthetical asides, and the useful content sits behind many folds.

## VERDICT
**Mostly.** In five minutes I got the gist (explainer, review, plan-from-explainer, privacy checks) and that nothing is waiting on me. The biggest fix is to add one concrete, actually-run example with real arguments and output, to show "here it is working". The page should also define the jargon (pin, guide part, fresh eyes, D-/A-numbers) in plain words.
