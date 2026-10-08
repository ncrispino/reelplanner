# Review of "The plan guide" page

## 1. What is this change, and why should I care?
Every plan video now gets a generated web page under it. The page holds all the plan's cases, commands, decisions and changed code that the video only mentions. It also lets you comment on the plan's words or suggest an edit to them. You should care because your last seven plan reviews came back as "explain this more" instead of answers. This is meant to stop those extra rounds.

Found: the top of the page (intro, "The problem", "In short"). Nothing needed opening.
Confidence: high

## 2. What can I do now, and what is the evidence?
- **Open a full page under each video.** The evidence is a saved run of `reelplanning guide .../2026-09-28-plan-guide/video`. It printed "5 steps, 4 questions, 9 kinds of change, 74 files, 6 runs, 17 parts, 44 gaps, 1.0 s, exit 0".
- **Have `reel check` refuse thin plans.** New plans (dated 30 Sep 2026 or later) must have cases, an interface and examples. The saved run on a scratch plan, `quiet-output`, printed three ✗ failures and exit 1. A second scratch plan, `rename-flag`, passed with warnings.
- **Click between the video and the page.** A scene names a part of the guide, and the part opens over the paused frame. Evidence: the storyboard `- guide:` lines and a plan-map excerpt, both saved runs.
- **Suggest an edit on the page.** `reel record` turns it into a decision-log entry plus an "Edits to apply" list. Evidence: a saved review file and a `reel record` run.
- **See Built next to Planned.** Each step gets a Built side with diffs and saved runs. The evidence is 11 commits and 70 files with diffs. I found no saved command to try step 5 (the page admits this).

Found: "In short", each step's "Worked examples" tabs, and "Try it yourself". I had to open the tabs and "What it printed" for the actual output text.
Confidence: medium. Steps 3 and 4 show only excerpts, not a full demonstration.

## 3. One step explained: step 2, `reel check` and the four blocks
Every step in a new plan's `plan.md` has to carry four blocks: Cases (a table), Interface (a fenced block, or the line "No interface: …"), an Example, and Decisions. `reel check` looks at the folder's date. If it is 30 Sep 2026 or later, a missing Cases table or Interface block, or an option with no example, is a ✗ failure and the command exits 1. A missing Example, diagram or meaning is only a △ warning. An older plan passes as before, unless you pass `--blocks`.

Edge case: an option counts as "having an example" if it contains a value, a quote, a command, a number, or a five-letter-plus word from the question's own setup. The page's example, "It stops.", has none, so it fails.

Found: the step 2 section, the "How it works" diagram, the worked example tab "A new plan with blocks missing", and "Show what it really printed". I had to open the printed output.
Confidence: high

## 4. How would I try it myself?
Run these from the repo's top folder:
1. `reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video`. I expect `✓ …/video/guide/index.html`, then a line like "5 steps, 4 questions, built: 9 kinds of change, 74 files, 6 runs, … 17 parts · 44 gaps · ~1 s", then `exit 0`. Open the `index.html` in a browser.
2. `reel check .reelplanning/plans/2026-10-01-quiet-output`. I expect three ✗ lines (no Cases table, no Interface block, option B has no example), one △ warning line, and `exit 1`.

The `quiet-output` and `rename-flag` plans appear to be scratch plans. The page says the `rename-flag` run was in a scratch repo, and I can't tell whether `quiet-output` exists in my checkout. The first-time build takes about 10 s, so the "1.0 s" printed likely came from a cached build.

Found: "Try it yourself" (the commands and saved runs are visible, but "What it printed" needed opening).
Confidence: medium

## 5. What did the agent decide on its own, and what should I look at first?
It made 27 choices the plan didn't settle. Twelve are flagged as worth a look, and 15 are small. Two changed what the plan said:
- **D1:** guide parts live in `guide/<part>.html`, not `details/`, because the guide is never committed.
- **D2:** a step's picture is a row of system-part names with the touched ones lit, not the stage drawing.

Look first at the "hard to undo later" items:
- **A4:** an outside-the-repo explainer source shows only its path and hash, never its text.
- **A10:** an edit is its own kind of decision-log entry.
- **A12:** a file claimed by two categories goes to the first listed, and anything unclaimed goes to "Everything else".

Also check A1 (one guide per video, rather than one per plan), because it changes where files land. I would start with D1 and D2 because they contradict the plan I approved, and then A4 because it concerns privacy.

Found: "What the agent decided on its own". Nothing needed opening, though the "full wording" folds were unopened.
Confidence: high

## 6. What needs me right now?
Your review of the build. Watch the walkthrough video and press Finish to approve it or ask for changes. The video pauses on the twelve flagged choices for you to accept or flag each, and on two quick-check questions. It ends with a "Seeing it run, anything you'd change?" question. A timeline (0:41, 1:45, 2:10, 2:36, 2:46, 3:05, 3:38, 3:51) shows where each pause falls.

Found: "Needs you" in the summary and the "What needs you" section. Nothing needed opening.
Confidence: high

## 7. What could go wrong, or isn't done?
- Hand-built things to do and data tables from the earlier prototypes (v4 and v5) are not made by the builder.
- A step's own picture is supported, but no plan has one yet.
- The system video is behind by the glossary's new rows.
- Older plans lack a Trace column and most `#` meanings, so their guides show gaps. There are 28 cases without a trace and 16 interface lines without a meaning.
- No explainer exists in the repo yet.
- The independent code check said one step doesn't fully match the plan and flagged ten unmentioned changes. The page says "Step 5: not built, said in Not done", yet the header says "Built: all five steps". I couldn't reconcile those.
- No command is written to try step 5.
- The first build is slow (about 10 s).
- The check fails if a commit named in `walkthrough.md` is missing from the clone.
- The build has 44 gaps on the page for this very plan.

Found: the "Not done" summary row, "What isn't done, and what could go wrong", and the edge cases in each step.
Confidence: medium (because of the step 5 contradiction)

---

## Depth

**LEARNED** (things the video would not show me):
- The guide is generated and never committed, so it is rebuilt by `reelplanning build`.
- The exact `reel check` failure output and exit codes.
- The 30 Sep 2026 cutoff date that separates old plans from new ones.
- The "example" rule (value, quote, command, number, or a five-letter word).
- The 44 gaps and the 28 cases with no trace.
- Guides are per video, not per plan.
- The guide is not private once published.

**DIAGRAMS:**
- **Helped:** "What guide --check does in a browser" and "A scene opens its part, and back". These sequence diagrams show who talks to whom in order.
- **Also fine:** the "From the plan's files to the page" flow diagram. It is a clear file-dependency picture but says nothing about behaviour.
- **Didn't help:**
  - The step-dependency graph ("The steps, and which each needs first"). It is just five boxes with crossing arrows, and the step titles were already listed.
  - The "What the folder you name gets" diagram. The arrows are crossed and the labels are tiny.
  - The "Step through it" animations, which I couldn't see in static shots.

**EXAMPLES:**
- Step 2's `quiet-output` example clarified things the most. The real output, with ✗ and △ lines, was worth opening.
- The "BEFORE YOU LOOK" prompt ("Do they fail too?") is a nice touch, but the answer sits in a fold.
- Step 5's example has "No saved run for this case", so it is weaker.

**RESTATED:**
- "You can now open a full page under each video…" appears three times (intro, "In short", step 1).
- "The guide holds every word of the plan; a scene, only its own." adds little beyond the video.
- "Where the walkthrough video stops for you" repeats the video timeline.
- "The code check" is stated twice.

**INVENTED:** I found nothing that looks made up. The page says it has no source for the "Where the code is" totals beyond the diffs, and the "worth your look" ranking is the agent's own judgement, without a stated rule. One claim I couldn't verify: "matches the plan on 4 of the 5 steps and on all 55 earlier decisions" (the guide says 56 elsewhere: "Earlier decisions it keeps 56").

**CONFUSED:**
- "a part" (of the guide) versus "a detail" versus "a scene opens its part". I guessed it means a sub-page.
- "Trace column" and "# meanings". I guessed they mean case-trace and interface-comment.
- "plan-map", "ledger" versus "decision log", "revise", "kind of change".
- "A/D/m numbers", "A12", "D-244", "A5" and "A6". These are cited without meaning until you dig.
- "△" and "✗". I guessed warning and failure.
- "Ten words here have a special meaning, marked with a dotted line" is a glossary hidden behind a link.
- "scenesSaying" (a run-together typo).
- The header says "Built: all five steps", but the code check says step 5 is "not built".

**BORED:**
- The "In short" list duplicates the section headings.
- The diagram-in-words folds.
- The repeated "Watch this moment" lines.
- The unlabeled file lists in "Where the code is".
- The long "How this page was made" paragraph.

**MISSING:**
- A plain statement of what the guide page looks like when finished. There is no screenshot of the actual built page, only the thumbnail inside the video frame.
- How to open the guide from the video (as built) versus the plan ("under the video" was decided but changed).
- A before/after of a review round showing the fewer rounds it promises.
- The result of the two "quick check" questions (what `reel check` does with a step lacking an interface, and what the revise rebuilds). These are in the video but not answered on the page.
- Any way to try step 5.

**VERDICT:** Mostly. The biggest fix is to resolve and state plainly whether step 5 is built, and to define "part", "detail" and the A/D/m ids where they first appear. The page is thorough but front-loads jargon, and its "Built: all five steps" headline conflicts with the code check.
