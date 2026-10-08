# Review of "The plan guide" page

## 1. What is this change, and why should I care?

The change is a new command, `reelplanning guide`, that turns a plan's `plan.md` and the build record into one readable, clickable web page. The page sits behind the walkthrough video and shows what was built, with real diffs. It also lets you comment and suggest edits on the page.

You should care because your review answers kept coming back as "explain this more". The page opens with that history: seven times across four plans, with three or four review rounds each. The guide is the "more detail behind the video" you asked for.

Found: the header, the quote from you, and the paragraph after it. Nothing needed opening.
Confidence: medium. The "why" is clear, but the page never states the "what" in a single plain sentence.

## 2. What can I do now that I couldn't before?

- **Build a guide page for a plan or video** with `reelplanning guide <dir>`.
  - Evidence: a saved run in a dark terminal box. It prints ✓, the output path, "5 steps, 4 questions… 17 parts… 1.0 s" and `exit 0`. A video still sits above it.
- **Check that the guide is complete.** `--check` verifies every part of `plan.md` is in the page.
  - Evidence: a saved run for another plan that ends with a ✗ and `exit 1`. It reports a missing file, `runs/build-typed-in.txt`. That shows the check catches problems, but it is not a clean pass.
- **Open a guide part from the video, and the video from the guide.**
  - Evidence: only a video still and a "Watch this moment 2:10" link. There is no command or output.
- **Comment on the page or suggest an edit to the plan's words.** The agent then applies the edit exactly.
  - Evidence: a saved `cat` of a review file. It has an "Edits to apply" section with two edits, each listing which scenes get rebuilt. There is also a `reel record` output that says "ledger: +2".
- **See a "Built" side** with real diffs after the build.
  - Evidence: the "Where the code is" section lists diffs, all folded. There is no command or output for this step.

Found: the "What you can do now" section, in steps 1–5. The saved runs are visible, but "What it printed" is folded in the Try section. I did not have to open anything to see the main outputs.
Confidence: medium.

## 3. How would I try it myself?

Run from the repository's top folder:

```
reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video
```

Then open the generated `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html`. Next, I would run the check:

```
reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check
```

Found: the "Try it yourself" section, with Copy buttons. Nothing needed opening.
Confidence: high for the commands. Low for how to open the result, since the page never says to open the html file.

## 4. What did the agent decide on its own, and which should I look at first?

The agent made 27 decisions in total. Twelve are highlighted and 15 smaller ones are listed only in the video. The highlighted twelve fall into three labels: "You'll notice it", "Hard to undo later" and "Changed from the plan".

I would look first at:

- **D1 and D2**, the only two labelled "Changed from the plan". D1 is a step's picture: it is a row of names instead of the real stage drawing. D2 is where the guide lives: one per video instead of one per plan. Both contradict what you approved.
- **A4, "hard to undo"**: a transcript kept outside the repo shows only its path, not its text, because a published guide is not private.
- **A9 and A11, "hard to undo"**: how an edit is stored in the ledger, and how changes are grouped into categories.

Found: the "What the agent decided on its own" section. Nothing needed opening. The "Where to check it in the code" links under each decision are folded.
Confidence: medium. The order the page shows is not ranked by importance.

## 5. What needs me right now?

One thing: your review of the walkthrough video. You approve what was built or ask for changes, and the video pauses on the twelve choices for you to accept or flag each.

Found: the top line ("Waiting on your review of the walkthrough video"), the "In short" box and the "What needs you" section. The plan's questions and how each was answered are folded, with 4 items.
Confidence: high.

## 6. What could go wrong, or isn't done?

- **A failing check.** The `--check` run ends in ✗ and `exit 1`, and the page shows it as a proof that step 2 works. It is unclear whether that failure is the expected one. The page lists it under "Try it yourself" as "stopped, reporting a problem it found", so it seems to be intended. The `reel check … quiet-output` command also exits 1.
- **Not done, per the page:**
  - Hand-built interactive items from the prototypes are not carried over.
  - A step's own picture is supported, but no plan uses one yet.
  - The system video is out of date.
  - Older plans show many gaps: 28 cases have no trace and 16 lines have no meaning.
  - No explainer exists yet, so that path is only tested on a scratch one.
- **The independent code check** found 4 of 5 steps done as planned and ten unexplained changes. The page says each was fixed or kept with a reason, but the details are folded (6 items).
- **Steps 3 and 5 have no commands to run.**
- **Privacy:** A4 warns that a published guide is no more private.

Found: "What isn't done, and what could go wrong". The code-check details are folded.
Confidence: medium.

## 7. Where is the code, and how do I see exactly what changed?

The "Where the code is" section lists 70 hand-written files in eight groups: the builder, the page, the four blocks checked, the video and guide pointing at each other, suggested edits, guides for existing videos, the skill and record, and tests. The last group is "other files".

Each group shows +/− line counts. Each has a folded "See the code" control that opens the real diff. For all of it, run:

```
git show faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da
```

These are the eleven commits.

Found: "Where the code is". The diffs are folded, but the git command is visible.
Confidence: high.

---

## CONFUSED

- **"plan video", "walkthrough video", "the video".** These look like different things. I guessed that the plan video is made before the build and the walkthrough video after it, for review.
- **"three inks and coral"**. I guessed it means the colour scheme.
- **"prototype v4/v5", "D-249", "D-022", "A8", "m"** and the mix of A/D/m numbering. I guessed they are internal record IDs.
- **"plan map", "parts.json", "ledger", "scene", "beats", "stage"**. I guessed these are internal names for the video's structure.
- **"Watch this moment"** links: I guessed they jump to a video timestamp, but I could not test it.
- **"Instead of / Because"** in the decision cards. Some are full of syntax like `- guide: <part>[#<place>]`, and I could not follow them.
- **"9 kinds of change, 74 files, 6 runs".** I guessed "kinds of change" means the categories.
- **"Rebuild: the guide, and scenes 12, 20…"**. I guessed these are video scenes that would be regenerated.
- **"#### headings" and "the four blocks".** I guessed the blocks are Cases, Interface, Example and Decisions.
- **"Blame-marked", "-U10".** I skipped these.
- **"D2" as a "changed from the plan" item versus "Step 1 · D2".** I guessed the step label is where it applies.

## BORED

- The long "Instead of / Because" text in the twelve decision cards, which has little context.
- The eleven commit hashes, and the eight code parts with matching +/− counts.
- "It ran while this was built; its output is saved…", repeated for every command.
- The bottom sections (the plan in its own words, "How this page was made", "Every note the builder made 44").
- Two similar "In short" and "What you can do now" lists.

## MISSING

- **One plain sentence at the top** saying what the thing is.
- **A screenshot of the generated guide itself.** I saw only terminal outputs and video stills. The page never shows what a finished guide looks like.
- **An explicit next step**: how to open the built page.
- **A clear pass/fail summary** of the code check and test results without opening folds.
- **A ranking or reason** for why those twelve decisions matter and which one to check first.
- **Evidence for steps 3 and 5**, the video and guide pointing at each other and the Built side. Only stills exist for them.
- **A plain explanation of the intentional ✗ in `--check`**, so it does not look like a failure.

## LOOK

The page looks calm and well typeset. It has generous space, a serif headline and clean dark terminal boxes. It reads dense once you reach the decision cards, which are long strings of internal jargon.

## VERDICT

**Mostly.** In five minutes I get the idea (a browsable guide behind the video), the command and the one review ask. I do not get what the guide looks like, or whether the ✗ results are expected.

The single biggest fix: open with a plain-language summary and a real screenshot of the generated guide. Then move the jargon-heavy decision cards behind a fold, with a short "look at these two first" note.
