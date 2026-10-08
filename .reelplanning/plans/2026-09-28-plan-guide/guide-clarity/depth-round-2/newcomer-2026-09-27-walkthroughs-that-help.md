# Review of "Walkthroughs that help"

The narration file holds only the fifteen scene titles, with no spoken text. My "video vs page" judgments below rest on those titles and on the captions visible in the page's video stills.

## 1. What is this change, and why should I care?

The tool's post-build review video is now a roughly two-minute run of each change. It pauses only on choices the agent made that you'd notice or couldn't easily undo. Everything else goes on one list at the end. You should care because you said you were "just spamming accept" on the old five-minute walkthroughs. This change is meant to fix that, and it also measures whether it worked.

Found: The top of the page (intro, your quoted complaint, "In short"). No opening needed.
Confidence: high

## 2. What can I do now that I couldn't before?

- **Watch each change running, before and after.** Step 1. The evidence is the video stills, such as the terminal frame showing `reel pr-check` output. No saved run backs step 1 itself.
- **Pause only on noticeable or hard-to-undo choices.** Step 2. The evidence is `reel stops` output listing each choice as "pauses" or "listed", with the reason.
- **Get a prediction quick check** before a scene that runs the change. Step 3. The page shows no saved run for it.
- **Get the short walkthrough on a pull request.** Step 4. Two saved `reel pr-check` runs back this up. One "waits" for a maintainer to accept the two other choices. The other, with the box ticked and `--merge`, gives "0 waiting".
- **Switch Plan and Built on one row.** Step 5. It is checked by `bundle.spec.mjs`, and `npm run bundle` is named but not run.
- **See how long each pause held you.** Step 6. The saved run of `reel memory . after-build` is the evidence: 18 reviews, 3 timed, median hold 8.6 s, and 1 of 3 clearing the bar.

Step 7, the system video, is not built.

Found: "In short" at the top, the per-step sections, and "Try it yourself". I had to open the "what it printed" blocks; the outputs were readable in the everything-opened text.
Confidence: medium-high

## 3. One step, explained: step 2, which choices pause

The diagram is a decision chain. For each choice the agent made, the tool checks in order and the first rule that holds decides:

1. Is the choice off-plan? It pauses.
2. Is it visible, or hard to undo? It pauses.
3. Is it like a recent "late fix"? It pauses if it shares a label with that fix.
4. Otherwise it goes on the list at the end.

A "late fix" is a choice you accepted in an earlier review and that was changed afterwards. It counts as recent for the next five plans.

The real example is `reel stops` on this plan. A2, A4 and A7 carry only the label `close`. Because explain-first's A13 was labelled `close`, accepted, and later changed, all three now pause. When the video was built, they sat on the list.

**Edge case:** a late fix with no label makes nothing pause, because there is no label to share (D-109).

Found: Step 2's diagram, worked-example tabs and "Before you look" box. I had to open "Show what it really printed".
Confidence: high

## 4. How would I try it myself?

Run these from the repo's top folder.

```
reel stops .reelplanning/plans/2026-09-27-walkthroughs-that-help
```

I expect one line per choice, A1 to A10: step, "pauses" or "listed", the reason, and the label. For example, `A2 step 2 pauses a late fix: A13 of explain-first accepted, then changed (label close) [close]`, and A1 `listed no label`.

```
reel memory . after-build | head -1
```

I expect one line like: `[after-build] 18 walkthrough reviews: a pause held you 8.6 s (…3 reviews timed); 1 flag, 7 in your words, 15 comments; 11 sent before the video could have played through. The bar (5 s and some words): 1 of 3 cleared.` Your numbers will drift as more reviews land.

For pull requests, use the `reel pr-check . --base origin/main --body-file ../pr.md --labels ""` command shown in "Try it yourself". It needs a scratch repo and a `pr.md` I don't have.

The page gives no command for steps 1, 3 and 7. It says so itself.

Found: "Try it yourself". I had to open the "What it printed" folds.
Confidence: high

## 5. What did the agent decide on its own, and what should I look at first?

It made ten choices the plan didn't settle. Five are flagged as worth a look:

- **A3:** the list has only a Flag on each row and one "Go on" button; your own words go in a comment.
- **A5:** the open question is asked in Finish, and your words are saved as a note on no step.
- **A6:** a small PR's other choices go in a new "Other choices" section, and a tick accepts them.
- **A8:** the Plan | Built switch is the only jump control; there is no separate button on the scenes.
- **A9:** the list's ordering and the fold of older plans.

I'd start with A5, because it changes how Finish behaves and touches your words and the Request-changes suggestion. A6 is next, because it changes the PR template and whether a merge is allowed. Another candidate is the "late fix" rule behind A2, A4 and A7. That one pauses choices the agent had labelled only "close", and the page shows a decision reversal ("Replaced by a later answer": you didn't like saying "five"). The reversal appears in the decisions section, and the page doesn't say whether the code follows your later answer. See the last point in section 7.

Found: "What the agent decided on its own". I had to open each card's "instead of, in full".
Confidence: medium. The page doesn't rank the five.

## 6. What needs me right now?

Your review of the whole build. Watch the walkthrough video (2:55 in all), then press Finish to approve or request changes. It stops at these points:

- 0:24 quick check
- 2:03 quick check
- 2:36 the list (A1, A2, A4, A7 and A10)
- 2:47 the "Seeing it run, anything you'd change?" question

Found: "Needs you" and "Where the walkthrough video stops for you".
Confidence: high

## 7. What could go wrong, or isn't done?

- **Step 7 is unbuilt** and waits for your acceptance of this walkthrough (D-003).
- **A pre-existing test failure:** `group.spec` has a failing check. The third Flag on side-by-side cards lands under the row rather than under its card. The page says this is older than the plan, but the new list shows the same placing.
- **Older walkthroughs** keep their grouped beats and their length.
- **The independent code check** flagged `bundle.spec.mjs:74`, which expected a fold the page rightly leaves out. Otherwise 6 of 7 steps and 42 decisions matched.
- **The metric is thin.** Only 3 reviews are timed, and just 1 clears the bar. If the first three timed reviews all miss, the tool will propose dropping the walkthrough video. On current numbers that is close, which is a notable consequence.
- **A conflict with your words.** You said you don't like "five", yet the list keeps "the five newest plans" and "recent = last five" (`RECENT_PLANS`). It isn't clear whether this is settled.
- **A missing test run.** The step 5 command is "named, not run".

Found: "What isn't done, and what could go wrong", the code-check fold, and "What the plan and walkthrough don't say yet".
Confidence: medium-high

---

## Depth

**LEARNED**
- The exact pause rules, and their order.
- "Late fix" and the five-plan memory. The video probably didn't show that A2, A4 and A7 now pause because of a different plan's choice.
- The bar for "did it work" (5 s and some words). Only 3 of 18 reviews are timed, and 1 of 3 clears it.
- `reel pr-check` behaviour: a line without "instead of" is a note, not a failure. `--merge` fails while other choices are waiting.
- The dropping rule is only a proposal, and not answering keeps the videos (D-129).
- The 42 decisions the code check confirmed.

**DIAGRAMS**
- **Helped:** the step 2 decision chain, which I could follow directly. The step 6 shownAt/judgedAt chain also helped.
- **Helped:** the top "choice from walkthrough.md to you" diagram, though its edge labels overlap the lines ("off-plan, visible, hard to undo…").
- **Didn't help:** the "steps and which each needs first" graph. It has truncated node titles ("…") and doesn't matter to me as owner.
- **Didn't help:** step 1's "what a scene shows" diagram, which is small and mostly says nothing new.
- **Didn't help:** the step 4 PR diagram, which is two disconnected rows and hard to read.
- **Didn't help:** the code-parts diagram, which I couldn't judge (no shots of it opened).

**EXAMPLES**
- The step 2 "Before you look" question, "are they still on the list?", is good. The real output answered it: they now pause.
- The step 4 two-case `pr-check` output was worth opening, since the waiting and accepted runs differ clearly.
- The step 6 "how many clear it?" prompt, with the answer 1 of 3, was worth opening.

**RESTATED**
- Each step's "You can now…" line repeats its "In short" bullet.
- The subtitle ("See the build run, stop only where you'd notice") repeats the opening sentence.
- Every "Watch this moment" repeats the video.

**INVENTED**
- Nothing clearly unsupported. Weak spots:
  - "five is about the last week of plans here" (A9's reason).
  - The "worked …" text in step 5 is cut off.
  - The claim that step 1's picture "shows it working" has no saved run.

**CONFUSED**
- "late fix", "close", "A13 of explain-first". I guessed a late fix is a review-accepted choice later altered.
- "Go on (key A)". I guessed it's the button that accepts the rest of the list.
- "off-plan", "D-109", "D-084", "D-003", "D-129" and "m". I guessed D is a decision ID.
- "grouped beat", "stopFor", "shownAt/judgedAt" and "held".
- "Six words here have a special meaning" was never explained without opening.
- "the plan map".
- "the middle value" means the median.
- "Interface as built".
- "the fold".

**BORED**
- "The ten commits", "Every note the builder made", the file-group +/- counts, and the long "How this page was made".

**MISSING**
- A plain before/after of the review flow from your seat: what pausing 3 of 10 means, and what happens on Flag.
- Any statement of whether the video actually got shorter (a measured runtime of about 2:55).
- A ranking of which decisions to look at first.
- A screenshot of the new list or Finish panel with real interaction.
- A resolution of the "five" contradiction.

**VERDICT: mostly.**
I could follow the design and the evidence. The single biggest fix is to cut the jargon and IDs (late fix, close, D-xxx, A13) and add a plain top-of-page before/after, with a "look at these two first, and why" ranking.
