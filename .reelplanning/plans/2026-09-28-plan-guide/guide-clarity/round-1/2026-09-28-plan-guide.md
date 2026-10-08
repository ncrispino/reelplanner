# Review of "The plan guide" page

## 1. What is this change, and why should I care?
The change adds a `reelplanning guide` command. For each plan it builds one readable web page, generated from plan.md, the decision log, git and saved runs. It sits behind the walkthrough video, so you can read, check, comment on and edit a plan there. You care because your reviews kept coming back as "explain this more" (7 times across 4 plans). This page is meant to show the detail behind the video.
Found: header, the quoted request and the paragraph under it, then "What you can do now". Nothing needed opening.
Confidence: medium. The purpose is clear, but I had to guess at how the tool fits together.

## 2. What can I do now, and what is the evidence?
- **Build a guide page for a plan or video.** Evidence: a picture from the walkthrough video, and a saved run that printed "✓ … guide/index.html · 5 steps … exit 0".
- **Run a check that a plan's four blocks are present and every plan.md paragraph appears on the page.** Evidence: a saved run of `--check`. It ends in ✗ and exit 1, because a category names a missing file, `runs/build-typed-in.txt`. So the evidence shows the checker catching a failure, not a clean pass.
- **Jump between video and guide** (a scene opens its part of the guide). Evidence: a screenshot from the video only. There is no command or output for it.
- **Suggest edits on the page that the agent applies exactly to plan.md.** Evidence: a saved "Edits to apply" file, exit 0. This shows a filed edit, not the edit being applied.
- **See a "Built" side with the real diffs, per step.** Evidence: a video screenshot of a diff. No command is written for steps 3 and 5.

Found: "What you can do now", step by step. The saved output was visible without opening anything. The "What was built for it" and "What the plan asked for" folds were closed, and I didn't need to open them.
Confidence: medium.

## 3. How would I try it myself?
Run from the repo's top folder:
```
reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video
```
Then open the resulting `.../video/guide/index.html`. The page doesn't say to open it, but it names that file. Next I would run:
```
reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check
```
Found: "Try it yourself". The commands are visible with Copy buttons. The saved outputs are behind "What it printed" folds.
Confidence: medium. I can't tell how to open the built page or see the video-and-guide linking. Also, the "Try it yourself" section says "Six commands", but it lists seven.

## 4. What did the agent decide on its own, and what should I look at first?
The plan left 27 decisions to the agent. 12 are called out, 2 of them "changed from the plan", and the other 15 are smaller and folded away.
Look first at the **CHANGED FROM THE PLAN** ones:
- D1: parts are written to `guide/`, not `details/`, because the guide is never committed.
- D2: a step's picture is just a row of names with the touched ones lit, not the drawn stage the plan promised. This is a visible downgrade.

Then the **HARD TO UNDO LATER** ones:
- A4: transcripts are kept out of the guide, since a published page isn't private.
- A10: how a suggested edit is filed as a ledger entry.
- A12: the format of the "Categories of change" line in walkthrough.md.
- A13: which generated files and long lines are cut from the diffs.

Also A9: it replaced the hand-built prototype pages of the earlier plan.
Found: "What the agent decided on its own". The 12 are visible, and the other 15 are behind a fold.
Confidence: high on what they are, medium on my ranking.

## 5. What needs me right now?
A review. I should watch the walkthrough video, then approve it or ask for changes. It pauses on the 12 choices for me to accept or flag each. Also "Waiting on your review" appears in the header. There are folded lists, "The plan's questions, and how each was answered (4)" and "What it found… (6)", that I did not open. The page doesn't say whether any of the 4 questions is still open.
Found: the header and "What needs you". Some of it is behind folds.
Confidence: medium.

## 6. What could go wrong, or isn't done?
- The one saved `--check` run on the earlier plan fails (exit 1), and the page doesn't say whether that was fixed.
- The hand-built prototype extras (frame to fix, newcomer brief, findings table) are not produced by the builder.
- No plan has a custom step picture yet.
- The system video is out of date until this is accepted.
- Older plans show many gaps: 28 cases with no trace, 16 interface lines with no meaning, and "44 gaps" on this very page.
- No command is written for trying steps 3 and 5.
- No real explainer exists yet, so that path was only tested on a scratch one.
- A second agent's code check gave "unexplained 10 ✗", meaning 10 unexplained items. The page says each is answered, but I didn't open them. The check is also "steps 4 of 5 ✓", so one step was not confirmed.

Found: "What isn't done" (visible), and the code check (partly folded).
Confidence: medium.

## 7. Where is the code, and how do I see what changed?
"Where the code is" lists 70 hand-written files in eight parts: builder, page, checks, the video-guide link, edits, guides for existing videos, skill and record, and tests. Each has a "See the code" fold with +/− counts, and the folds open to the real diffs. File names appear in the decisions, such as `scripts/lib/guide/model.mjs` and `templates/guide/guide.js`. There is an "eleven commits" fold. The page says diffs come from `git show -U10` of those commits.
Found: "Where the code is". I had to open the folds to see any diff. The page-as-shown text doesn't show them.
Confidence: medium. I see no branch name, no PR link and no single "git diff X..Y" command.

## CONFUSED
- "reelplanning guide" vs "reel check" vs "reel record" vs "reel stage". I guessed these are different commands of the same tool.
- "plan map", "part", "beat", "stage", "layer". I guessed they are pieces of the page and video.
- "Trace column", "# meaning". I guessed they are columns in plan.md tables.
- "D-022", "D-213", "A1…A13", "D1/D2". I guessed they are decision IDs. "A" seems to mean "agent choice" and "D" seems to mean "changed from the plan".
- "prototype v4/v5". I guessed they are earlier hand-built versions.
- "unexplained 10 ✗" and "steps 4 of 5 ✓". I guessed at their meaning.
- "Instead of … Because …" under each decision is dense. "in the review page's look (its paper, three inks and coral)" reads as jargon.
- "Six commands" while seven are listed.
- Which "video" is meant: the plan-guide video or the videos-that-make-sense one? Several outputs use the other plan.

## BORED
- The long path-heavy code lines.
- The middle decisions (A2, A3, A8, A9), which are hard to read.
- The 44 gaps and "and 7 more" lists in the output.
- The "How this page was made" and "plan in its own words" sections.
- The same step names repeat across the "What you can do now", "Try it yourself" and "Where the code is" sections.

## MISSING
- A plain one-line "what and why" at the top. It's buried in the "explain this more" paragraph.
- A clean success example of `--check`. The one shown fails.
- How to open the built page or the video.
- A statement of whether the exit-1 failure was fixed.
- A branch, PR or one diff command.
- A picture of the finished page itself.
- Whether the four questions are answered or open.

## LOOK
Calm and pleasant: warm paper look, good serif headings, and lots of white space. The decision cards are dense and read like an internal spec. Folds hide the important detail, such as the diffs and the code-check findings.

## VERDICT
**Mostly.** I understood what was built and that a review is waiting. I could not tell if it works cleanly, since the shown check fails, or which decisions are truly mine to answer. The biggest fix is a plain top summary. It should say what to run, what a success looks like, and the two or three decisions to accept or reject, in ordinary words. It should also state whether the failing check was fixed.
