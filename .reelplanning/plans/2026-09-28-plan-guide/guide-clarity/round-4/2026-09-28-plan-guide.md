# Review of "The plan guide" page

**1. What is this change, and why should I care?**
The change adds a command, `reelplanning guide`. It turns a plan's files into one browsable web page: the plan's steps, the choices the agent made, saved command output, and diffs. You can read that page, comment on it and edit the plan from it. You should care because your past review notes kept saying "explain this more", and this page is meant to give the detail that the video only summarises.
Found: the top of the page and the "In short" box; nothing opened. Confidence: medium. The opening lines are garbled and I pieced this together from later sections.

**2. What can I do now that I couldn't before?**
- **Build a guide page from a plan.** Evidence: a green terminal run of `reelplanning guide …/2026-09-28-plan-guide/video` that ends in "exit 0", plus a screenshot from the video.
- **Run a check on a guide's completeness.** Evidence: a saved run that fails (exit 1) on a missing `runs/build-typed-in.txt`. The page presents that failure as proof the check works.
- **Move between video and guide.** A scene can open a part of the guide. Evidence: only a video timestamp (2:10) and a frame. I saw no command or output for this.
- **Edit the plan's wording from the guide.** It files a ledger entry and an "Edits to apply" list showing which scenes get rebuilt. Evidence: a `cat` of a review file, plus a picture.
- **See a "Built" side for every plan.** Evidence: only a video timestamp (3:05).

Found: "What you can do now", steps 1–5. The evidence is inline except the "What it printed" folds. Confidence: medium.

**3. How would I try it myself?**
Run from the repo's top folder:
`reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video`
Then open `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html` in a browser. A second one to try is `reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check`.
Found: "Try it yourself", with a Copy button; no need to open anything for the command. Confidence: high. The page gives no way to try steps 3 and 5 and says so.

**4. What did the agent decide on its own, and which should I look at first?**
The agent made 27 choices, and 12 are flagged as worth a look. I would start with the two marked "changed from the plan":
- Parts are written to `guide/<part>.html` instead of `details/<part>.html`, because the guide is generated and never committed.
- A step's picture is a row of the system's parts with the touched ones lit, not the drawn stage the plan called for.

Then I would read the three marked "hard to undo later":
- Transcripts kept outside the repo show only a path and hash, not their text.
- Suggested edits are stored as ledger entries of kind "edit".
- Categories of change are read from a line format in `walkthrough.md`.

The deviations from the plan come first because they are where the agent overrode what you approved. The hard-to-undo ones come next because they lock in a format.
Found: "What the agent decided on its own", visible without opening. The other 15 are folded. Confidence: high.

**5. What needs me right now?**
Your review of the walkthrough video. None is on file yet. You watch the video and press Finish there, approving or asking for changes, and the video pauses on the 12 flagged choices for you to accept or flag each.
Found: "Waiting on your review" at the top, "Needs you" in the summary box, and the "What needs you" section. Confidence: high.

**6. What could go wrong, or isn't done?**
- The builder does not make the hand-built exercises and data tables from the earlier prototypes.
- A step's own custom picture is supported but no plan uses it.
- The system video is out of date until the walkthrough is accepted.
- Older plans' guides show gaps: 28 cases have no trace, 16 interface lines have no meaning, and no command is written for steps 3 and 5.
- No explainer exists yet in the repo, so that feature was tested only on a scratch one.
- A second agent's code check found something to answer in one step and ten changes the plan did not explain. It says each was "fixed, or kept with a reason", but the list is folded.
- The shown `--check` run fails on the plan it was pointed at. I can't tell whether that is a real defect or a staged demo.

Found: "Not done", "The code check", and "What the plan and walkthrough don't say yet". The findings themselves need opening. Confidence: medium.

**7. Where is the code, and how would I see exactly what changed?**
The change is 70 hand-written files in eight parts: builder, page, four-blocks check, video↔guide, edits, guides for existing videos, skill/record, and tests. Each part has a "See the code" fold with its diff and line counts (for example builder +578/−15). For git, run `git show faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da`. The page does not give a repo path or a branch name.
Found: "Where the code is" and the git command at the bottom; the diffs are behind folds. Confidence: high.

---

**CONFUSED**
- "The guide; the video and the guide point at each other; you edit the plan on the guide; and after the build, and which plans." This is a sentence fragment, and I guessed it was a list of the five steps.
- "Waiting on your review: none is on file yet." I guessed no review has been submitted.
- "The plan left 27 things for the agent to decide … Twelve … 15 smaller" against "Twelve choices … and all 55 decisions". I guessed the 55 are the plan's ledger decisions, a different set.
- "the video's ledger", "plan map", "parts.json", "Trace column", "# meaning", "layer" and "beat". I guessed they are project-internal terms.
- The "Watch this moment" links and the "walkthrough video". I never worked out where the video is. "Back to the video" is a button, and I assumed it leads there.
- "in the review page's look (its paper, three inks and coral…)". I guessed it means the visual style.
- The step 2 demo shows "0 cases, 0 interface parts". I couldn't tell whether that is fine.
- "reel record", "reel check", "D-002", "A10", "m". I guessed they are decision IDs and subcommands.

**BORED**
- The "Instead of / Because / Step N · A# · in path" entries are repetitive and dense. The 12 choices read as a wall.
- Long file lists, the `--check` gaps list ("D-216, D-217…"), and "The plan, in its own words" at the bottom.
- The "In short" box restates the sections below it.

**MISSING**
- A plain sentence at the top saying what the guide is and why it exists.
- A whole-page screenshot of the generated guide. The pictures shown are video frames, not the finished page.
- A clear yes/no on whether it all works. The one visible `--check` run fails.
- What the code check actually found. It is folded.
- Which decision to accept or flag first, given that the accept/flag step happens in the video, not on this page.

**LOOK**
The page is calm and readable. It has an elegant serif, plenty of space, and clean dark code blocks, and it is not cluttered. The prose is dense, jargon-heavy and clipped, and the 12-choice list is long.

**VERDICT: mostly.** I could say what was built, what to run and what needs me. The biggest fix is to rewrite the opening as one plain sentence about what the guide is and what you're being asked to do, and to cut or fold the repetitive choice entries and internal IDs.
