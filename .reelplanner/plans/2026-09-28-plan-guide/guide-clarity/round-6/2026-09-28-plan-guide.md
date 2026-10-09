# Review of "The plan guide"

I read all of page-as-shown.txt and looked at screenshots 1, 2, 3, 5, 8, 10, 13 and 15. I did not open page-everything-opened.txt.

**1. What is this change, and why should I care?**
A new command, `reelplanning guide <plan-dir>`, builds a readable, editable web page for each plan. Until now, plans have been reviewed mostly through a video. Your past reviews kept coming back as "explain this more", and this page adds the detail behind the video.
Found: the top paragraphs and the "In short" box. Nothing needed opening.
Confidence: medium. The "why" is clear, but the one-sentence "what" is never stated. The page admits this itself under "What the plan and walkthrough don't say yet".

**2. What can I do now that I couldn't before?**
- **Build a guide page for any plan.** The evidence is a real command with its output. It prints a ✓ line (5 steps, 17 parts, exit 0, 1.0 s), and there is a screenshot from the video of it running.
- **Have `--check` reject an incomplete guide.** The saved run stops with exit 1 and a ✗ line, because a named file is missing from runs/. It is shown as a working failure. This is the only evidence for step 2.
- **Open guide parts from a video scene.** The evidence is a screenshot of a part open over the video frame. There is no command output.
- **Comment on the plan and suggest exact edits on the page.** The evidence is a printed "Edits to apply" file. It shows `--out` → `--to`, with the scenes to rebuild listed.
- **See a "Built" side after the build.** The screenshots and text show only a "Watch this moment" link. I saw no picture or output for it.

Found: the "What you can do now" section, mostly visible. The "What was built for it" and "What it printed" folds were closed.
Confidence: medium.

**3. How would I try it?**
From the repo's top folder, I would run:
`reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video`
I would then open `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html` in a browser. Next I would try `reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check`.
Found: the "Try it yourself" section, with Copy buttons. No folds needed for the commands.
Confidence: high for step 1, low for steps 3 and 5. The page says no command is written for those two.

**4. What did the agent decide on its own, and which should I look at first?**
The agent made 27 decisions. Twelve are flagged as worth a look, and 15 smaller ones are hidden. Look first at the two labelled "changed from the plan":
- **Part file location.** The plan said `details/<part>.html`. The agent uses `guide/<part>.html`, because the guide is built and never committed.
- **Step picture.** The plan said a step's picture would light a path per case. The agent draws a row of names with the touched ones lit. Its reason is that the stage drawing is sized for a 1920 px frame.

These matter most because they contradict what you approved.

Next are the "hard to undo later" ones:
- An explainer's outside-the-repo transcript shows only its path, hash and lines, not its text.
- How a suggested edit is stored in the ledger.
- The file format of the walkthrough's "Categories of change".

Found: the "What the agent decided on its own" section, visible. The reasons are given, but "in full" folds were closed.
Confidence: high.

**5. What needs me right now?**
One thing: a review. I watch the walkthrough video and press Finish there to approve or ask for changes. The video pauses on the twelve flagged choices so I can accept or flag each. Two of the plan's questions sit in a folded section, and I don't know whether any are unanswered.
Found: "Needs you", visible. The "plan's questions" fold was closed.
Confidence: high.

**6. What could go wrong, or isn't done?**
Five items are not done:
- Prototype-only hand-built to-dos and tables are not generated.
- No plan has its own step picture yet.
- The "system video" is out of date until this is accepted.
- Older plans show many gaps, such as no Trace column.
- No explainer exists in the repo, so that feature was only tested on a scratch one.

A second agent that read the code agreed with 4 of 5 steps and all 55 decisions. It raised points on the fifth step, and on ten changes the plan didn't explain. Step 5 is listed as "not built" in that check, yet the page marks it "BUILT". The page also has a gap list of 44 or so items with "no step" against them.
Found: "What isn't done, and what could go wrong", visible. The "What it found" fold, which holds the six points, was closed.
Confidence: medium.

**7. Where is the code, and how do I see what changed?**
It is 70 hand-written files in eight parts. Each part has a "See the code" fold with its real diff. The parts are the builder (+578/−15), the page (+1107/−13), and so on, plus a large "Guides for the videos we have" part at −6538 lines. The whole change is 11 commits. The command is `git show faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da`. No branch name is given.
Found: the "Where the code is" section. The diffs are folded, but the git command is visible.
Confidence: high.

## CONFUSED
- **"the plan video", "walkthrough video", "system video", "the video's record"**: I guessed these are separate videos. The first is the plan's explainer and the second is the after-build tour. I could not tell what the "system video" is.
- **"a part", "a beat", "a stage", "a layer"**: I guessed these are sections of the generated page. "Part" is used for both the page's sections and the code groupings.
- **"the review page", "prototype v4/v5"**: I guessed these are earlier things you already know.
- **"D-022", "D-003", "A4", "D2", "m10"**: These are decision codes. The page explains them only in a sentence on the decisions section.
- **"Words this page uses, in plain terms"**: a glossary of 8 terms, closed by default. I needed it and didn't open it.
- **"reel check holds a new plan to its Cases, Interface and Example"**: I guessed this is a plan-format linter.
- **The step 2 demo**: it runs the guide on a different plan (videos-that-make-sense). I was left unsure whether the failure is a real bug or a demonstration.
- **"Try it yourself"**: it says six commands ran, but I count fewer than six under the steps I could see. One of them (`reel check … quiet-output`) refers to a plan dated 2026-10-01, which is after the plan's date.
- **"Hand-built things to do"**: I guessed these are manual tasks in the prototypes.
- **"The step 6 frame to fix with frame-lint recomputed"**: the plan has five steps, so I don't know what step 6 is.

## BORED
- The long, dense decision sentences, such as the "Categories of change" line.
- The repeated "What was built for it / What the plan asked for" folds.
- The reference sections at the bottom (the plan in its own words, "Every note the builder made", 44).

## MISSING
- A plain one-sentence summary at the very top. The page says it's missing one.
- Any screenshot or picture of the actual guide page the command produces. I only saw screenshots of the video.
- Evidence for steps 3 and 5: no command output, and no run for the Built side.
- What "approve" would commit me to, and how big the risk is.
- Which of the 12 choices are safe to accept quickly.
- A branch or PR link.
- Reconciliation of step 5 "Built" against the code check's "not built".

## LOOK
It looks calm and editorial: serif headings, a warm paper background, and dark code blocks that are easy to read. It is long, though, and dense with jargon and folds. It reads like an internal spec more than a summary.

## VERDICT
**Mostly.** I understood the gist in five minutes: a new command builds a plan page, and I need to review the video. I could not say exactly what each step delivers or whether step 5 is really done. The single biggest fix is to put a plain one-sentence "what this is" at the top, with a picture of the generated guide page. That should be followed by the two "changed from the plan" decisions, so a review takes minutes.
