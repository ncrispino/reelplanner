# Review of "Walkthroughs that help"

The narration file has only the 15 scene titles, with no spoken text. I could only compare the page against those titles and against the captions in the page's picture frames.

## 1. What is this change, and why should I care?

The review video that follows a build is now about two minutes long instead of five. It shows each change running and pauses only on choices you'd notice or couldn't easily undo. The other choices wait on one list at the end.

You care because you said you were "spamming accept" on walkthroughs you couldn't make sense of. This change tries to fix that. It also adds a way to measure whether the pauses actually make you look.

Found: the top of the page, the quote of your request, and the "In short" box. Nothing had to be opened.
Confidence: high

## 2. What can I do now, and what is the evidence?

The page lists six built things and one waiting.

| # | What you can do | Real evidence on the page |
|---|---|---|
| 1 | See each change running, before and after | No saved run. Only a still from the video and a diff summary. |
| 2 | Pause only on noticeable or hard-to-undo choices, and flag the rest from a list | Saved `reel stops` output for this plan and for a later plan |
| 3 | Predict what a change does before the video shows it | No saved run. Only a still and a diagram. |
| 4 | Get the short walkthrough on pull requests that need a video | Saved `reel pr-check` output, one run waiting and one accepted |
| 5 | Switch between a plan's video and what was built on one row | "Named, not run". A test spec is cited, and there is no saved output. |
| 6 | See how long each pause held you | Saved `reel memory` line: "18 walkthrough reviews… 8.6 s… bar: 1 of 3 cleared" |
| 7 | A shorter system video | Not built |

The strongest evidence is steps 2, 4 and 6. Steps 1, 3 and 5 have no run behind them.

Found: the "In short" box, then each step section. The real outputs sit behind "Show what it really printed" buttons and in "Try it yourself". I opened them in the everything-opened file.
Confidence: high

## 3. One step explained: step 2, which choices pause

Every choice the agent made carries labels in `walkthrough.md`. A tool, `reel stops`, reads them and applies rules in order. The first rule that matches decides the outcome:

- An off-plan change always pauses.
- A choice labelled "visible" or "hard-to-undo" pauses in its step's scene.
- A choice sharing a label with a recent "late fix" also pauses. A late fix is a choice you accepted that was changed afterwards, and it counts as recent for the last five plans.
- Anything else goes on the list at the end.

The pauses for one step are grouped into a single stop. In this plan, A2, A3 and A4 share one pause at step 2.

Edge case: A2, A4 and A7 are labelled only "close". The video, built earlier, put them on the list. Today `reel stops` says they pause, because an earlier plan's A13 was a "close" choice that was accepted and then changed. So the video and the current rules disagree. A late fix with no label makes nothing pause.

Found: the step 2 diagram, "The rules are checked in that order" paragraph, the two worked-example tabs, and the "Before/After" toggle. I had to open "Show what it really printed" and the "Before" toggle.
Confidence: medium. I'm inferring that the video is stale from the "Before" output.

## 4. How would I try it myself?

Run these from the repo's top folder:

```
reel stops .reelplanning/plans/2026-09-27-walkthroughs-that-help
```

I expect ten lines, A1 to A10. A1 and A10 are "listed". A2 to A9 are "pauses", with reasons and labels. It ends with "8 call(s) pause, in 5 stop beat(s)… 2 on the list", then `exit 0`.

```
reel memory . after-build | head -1
```

I expect one line like "[after-build] 18 walkthrough reviews… 8.6 s… The bar (5 s and some words): 1 of 3 cleared". It is dated 30 Sep, so your numbers may differ.

The page gives no command for steps 1, 3 and 7. Step 5's `npm run bundle` is "named, not run".

Found: the "Try it yourself" section, and the saved outputs behind its "What it printed" buttons.
Confidence: high

## 5. What did the agent decide on its own, and what should I look at first?

It made ten choices. Five are highlighted, and the other five are on the end list.

- **A3:** the list sheet has one Flag per row and one "Go on" button. Your own words go in a comment.
- **A5:** the open question is asked in the Finish panel, and your answer is stored as a note.
- **A6:** on small PRs, other choices go under "## Other choices" in the PR template. A maintainer ticks a box, and `reel pr-check` waits for the tick.
- **A8:** the Plan | Built header switch is the only jump control.
- **A9:** the list order puts what needs you first, then the newest five plans. The rest are folded.

I'd look at A5 and A6 first. They change how reviews are recorded and how merges are gated, and they are harder to undo than layout choices. A8 and A9 look like UI taste.

One more item: a recorded decision says "i dont like specifically saying 'five'", and the page says that answer replaced an earlier one. Yet A9 still says "five newest plans", so it may contradict your stated preference.

Found: "What the agent decided on its own", plus the decisions list near the bottom. The full "instead of" text is behind folds.
Confidence: medium

## 6. What needs me right now?

You need to watch the video and press Finish to approve or request changes. It pauses at 0:24 (a quick check), 2:03 (a quick check), 2:36 (the list of A1, A2, A4, A7 and A10) and 2:47 ("Seeing it run, anything you'd change?"). Beyond the video itself, nothing else is asked of you.

Found: "What needs you", with a timeline.
Confidence: high

## 7. What could go wrong, or isn't done?

- Step 7, the shorter system video, isn't built. It waits on your acceptance.
- The video's own `reel stops` output (scene 4) is stale against today's run. A2, A4 and A7 were listed then and pause now, so the video may show something different from what the tool says.
- `group.spec` has a failing check. Side-by-side cards put the third Flag under the row instead of its card. The page says it predates this plan.
- The reviewer questioned `bundle.spec.mjs:74`, where the test expects a fold that the page rightly leaves out.
- The measure in step 6 is weak so far. Only 3 reviews are timed, the median is 8.6 s, and only 1 of 3 cleared the bar. If all three miss it, a plan to drop the walkthrough video becomes due.
- The page's own gap list says several steps lack cases, interfaces and worked examples.
- Older walkthroughs are not rebuilt.

Found: "What isn't done, and what could go wrong", "The code check", and "What the plan and walkthrough don't say yet". The last one was folded, and I read it in the opened text.
Confidence: medium-high

## Depth

**LEARNED**
- The late-fix rule: an accepted-then-changed choice makes any choice with the same label pause for the next five plans.
- The bar for "actually looked": a median hold of at least 5 s plus some words of yours, in each of the first three timed reviews.
- The real result so far: 1 of 3 cleared, and 11 of 18 reviews were sent before the video could have played through.
- Dropping the video is only proposed. Not answering keeps the videos.
- The PR flow: a maintainer ticks a box, and `pr-check --merge` fails until then.
- The video's scene-4 output differs from the current run.

**DIAGRAMS**
- **Helped:** the top flow (walkthrough.md → reel stops → pause or list → you → reel record), and the step 3 sequence diagram (video, you, check, guess, answer). The PR diagram was also clear.
- **Didn't help:**
  - The step 2 "Does a choice pause" diagram. Its edge labels overprint each other into unreadable text, and it says less than the prose.
  - The step 1 frame, which was mostly empty. The step 3 and step 6 frames show only a caption and blank boxes.
  - The "which file uses which" import graphs. They are tiny, with one or two boxes, and say nothing about behaviour.

**EXAMPLES**
- The step 2 worked example helped most, with its "Before you look" question and the real `reel stops` output. It was worth opening, because it exposes the stale-video mismatch.
- The `reel memory` line was also worth opening.
- The `pr-check` output was fine, but the two variants differ only in the last lines.

**RESTATED**
- "You can now see each change running, before and after, in the walkthrough video" is followed by "After the build, the walkthrough shows each of the plan's changes running, before and after." That is the same sentence twice.
- The "In short" bullets repeat each step's headline.
- The four-row "What needs you" timeline repeats the video's own pauses.

**INVENTED**
- Nothing is invented outright.
- Some claims lack an example or run:
  - "five is about the last week of plans here" (A9) has no source shown.
  - Steps 1, 3 and 5 say things work, with no saved run.
  - "Hover-only words were the thing that made choices hard to judge" has no evidence attached.

**CONFUSED**
- "Step through it, one stage at a time": I guessed it is an interactive walk of the diagram.
- "the second each video's scenes of each step start at (A7)": I guessed it means timestamps stored per step.
- "a late fix": explained, but the wording is dense.
- "Go on (key A)" and "Finish panel": I guessed these are buttons in the player.
- "beat", "storyboard", "stop beat" and "grouped beat": I guessed a beat is a scene or pause unit.
- "Approve takes the rest" versus "listed, not judged": I guessed the rest are recorded as accepted without judgement.
- "label close": I guessed it means "a near call", not "closed".
- "D-109, D-084, D-129, D-003, D-023, D-265": decision IDs with no explanation in place.
- "Earlier decisions it keeps: 36" and "42 earlier decisions": I don't know why the numbers differ.
- "half-spec" and "group.spec": I guessed these are test files.
- "explain-first's A13": I guessed it is another plan.

**BORED**
- The "which file uses which" graphs.
- The commit hashes.
- "The ten commits" and the "Every note the builder made" scene list.
- The "Files and commands" folds.
- The code-diff section.

**MISSING**
- No plain description of what the new video looks like frame by frame.
- No before/after comparison of the old five-minute walkthrough and the new one.
- No result showing the two-minute target was met.
- Your two-minute request isn't checked against the actual video length. The player timeline says 2:55.
- No answer on whether the pauses lowered blind accepting, beyond the 1 of 3 figure.
- No screenshot of the real list sheet or the Plan | Built switch, only blank placeholder frames.
- No run for step 5.

**VERDICT: mostly**

I understood the rules and the measure better than the video showed. The single biggest fix is to put a real before/after of the new video, with actual screenshots and the measured length, at the top. It should also resolve the stale scene-4 output. The blank picture frames and unreadable step 2 diagram mean I had to trust the text.
