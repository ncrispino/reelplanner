# Review of "The plan guide" page

## 1. What is this change, and why should I care?
The change adds a `reelplanning guide` command. It builds one readable HTML page per plan from `plan.md`, the decision log and the saved runs. The page sits behind the walkthrough video and lets you read details, comment, and suggest edits.

You should care because your plan reviews kept coming back as "explain this more". Seven times across four plans, you asked to see more.

Found: the top paragraphs and the "In short" box, with nothing opened. Confidence: medium. The purpose is clear, but "plan", "video" and "walkthrough" assume I already know the project.

## 2. What can I do now that I couldn't before?
- **Build a guide page for a plan.** The page shows a screenshot of the command running and its printed output. The output is a ✓ line reading "5 steps, 4 questions… 17 parts… exit 0".
- **Run a completeness check (`--check`).** The page shows a saved run that stops with exit 1 and a ✗ line. That is evidence the check can catch a problem, not that it passes.
- **Open a guide part from the video, and the video from the guide.** The evidence is a still frame with a "Watch this moment 2:10" link. I had to trust that it works.
- **Comment on or edit the plan on the page.** The evidence is the contents of a review file with an "Edits to apply" list. The list shows `--out` → `--to`, plus the scenes to rebuild.
- **See a "Built" side after the build.** The only evidence is a timestamp link. No output is shown for step 3 or step 5.

Found: "What you can do now" steps 1–5. Confidence: medium. The outputs and command text were visible without opening anything, but the "What it printed" sections are folded, and steps 3 and 5 have no printed proof.

## 3. How would I try it myself?
Run these from the repo's top folder:
```
reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video
```
Then open `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html` in a browser.

A second command is `reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check`.

Found: "Try it yourself", with copy buttons and nothing opened. Confidence: high. The page also says the second command "finished without an error". I can't tell whether that matches the earlier ✗ story.

## 4. What did the agent decide on its own?
The agent made 27 choices: 12 flagged for your look and 15 small ones. The 12 fall into three groups.

**Changed from the plan (look at these first):**
- Parts are written to `guide/<part>.html` instead of `details/<part>.html`, because the guide is never committed.
- A step's picture is just a row of part names with the touched ones lit. The plan asked for a richer drawing on the stage.

**Hard to undo later:**
- Transcripts kept outside the repo are shown as path and hash only.
- A suggested edit is stored as a ledger entry of kind `edit`.
- The format of the "Categories of change" line in `walkthrough.md`.

**You'll notice it:**
- Where each guide lives.
- The page layout.
- Which "things to do" are auto-generated.
- How scenes link into the guide.
- How answers given on the guide are recorded.
- How large or generated diffs are cut.

Look at the two "changed from the plan" ones first, because they contradict what you approved. After those, look at the "hard to undo" ones. The page orders them the same way.

Found: "What the agent decided on its own", with nothing opened. The "chose instead of, in full" details are folded. Confidence: high.

## 5. What needs me right now?
A review of the whole build. Watch the walkthrough video, press Finish there, and either approve or ask for changes. In the video you accept or flag each of the 12 choices. There is also a folded "plan's questions, and how each was answered" section with 4 items, though it is unclear whether any is still open.

Found: "Needs you", plus the top line and the "In short" box. Confidence: high.

## 6. What could go wrong, or isn't done?
Five gaps are listed:
- Hand-built to-dos and data tables from earlier prototypes aren't produced.
- A step's own picture isn't used by any plan yet.
- The "system video" is out of date.
- Older plans show many gaps.
- There is no real explainer in the repo, so that feature was only tested on a scratch one.

An independent code check agreed on 4 of 5 steps and all 55 decisions. It raised points on the other step and on 10 unexplained changes, but the page doesn't say which step or what the points were; that is folded. The saved check run ends in exit 1 with an unresolved ✗, and the page frames that as a demonstration. The "missing information" list says steps 3 and 5 have no runnable command, and 28 cases have no trace.

Found: "What isn't done, and what could go wrong", visible. The code-check findings are folded. Confidence: medium.

## 7. Where is the code, and how do I see what changed?
- **By part:** eight parts covering 70 hand-written files, each with a "See the code" fold that opens the real diff.
- **By commit:** `git show faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da`.
- **Size:** the "guides for the videos we have" part shows +447 −6538. That is a large deletion, and the page doesn't explain it.

Found: "Where the code is", visible. The diffs are folded, but the commit command is shown. Confidence: high.

---

## CONFUSED
- **"Not reviewed yet… press Finish there".** I guessed "there" means the walkthrough video, which I don't have.
- **"plan.md", "the ledger", "the plan map", "walkthrough.md", "parts.json", "a part".** I guessed these are project files and page sections, with no explanation up front.
- **"Twelve choices… two of them changing what the plan said".** The count of choices shown differs from the "27 things" figure. I worked out that 12 is 2 + 3 + 7, but I only got there by counting.
- **"A/D/m numbers, D-022, D-249".** These are IDs in a decision log I can't see.
- **"The code check agreed… on 4 of the 5 steps".** I guessed it means an independent review.
- **"Prototype v4/v5", "frame-lint", "fresh-eyes", "newcomer's brief".** I couldn't follow these and skimmed past them.
- **"No explainer exists in this repo yet".** I guessed it refers to a kind of content the tool can eventually document.
- **The guide command run against `.../video`.** In the 5-minute path, the `--check` command is labeled "finished without an error", while the same page shows a ✗ run for a near-identical command.

## BORED
- The "All of what you said" quote.
- The long 12-choice list, where the wording is dense and full of file paths.
- The eight-part code list, which is repetitive.
- The decisions and "plan in its own words" sections.
- "How this page was made".

## MISSING
- A plain one-line summary of what the change is. The page itself admits this, in "What the plan and walkthrough don't say yet".
- Any screenshot of the finished guide page itself. The pictures are video frames of pieces.
- A clear statement of which code-check points were raised and whether any are unresolved.
- Runnable proof for steps 3 and 5.
- An explanation of the −6538 deletion.
- Whether the ✗ in the check demo is a real problem in an existing plan that needs fixing.

## LOOK
It is calm and well typeset, with generous spacing and readable serif headings. But it is long, and many fold-outs hide the substance. The jargon density in the decisions section makes it read like an internal log.

## VERDICT
**Mostly.** I understood the goal and the try-it command within five minutes. I could not judge the risk or the quality of the results without opening folds and watching the video. The single biggest fix is to open with one plain sentence of what changed and what to do next. It should be followed by the code-check findings and the state of the ✗ demo, in words and without IDs.
