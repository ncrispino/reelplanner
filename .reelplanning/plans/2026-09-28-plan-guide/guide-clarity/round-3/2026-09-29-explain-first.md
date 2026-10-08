# Review of the "Explain first" guide

**1. What is this change, and why should I care?**
The tool can now make a video that explains something that already exists (files, a transcript, a log, an experiment's output), with no plan needed first. You care because you asked for this: you wanted to understand what's going on in the repo before deciding whether to plan anything.
Found: the quoted request and the subtitle at the top, plus step 1. Nothing had to be opened. The page itself admits it has no one-sentence summary ("In one sentence" is listed as missing).
Confidence: medium. I pieced the sentence together myself.

**2. What can I do now, and what evidence is shown?**
- **Ask for an explainer.** `reelplanning explain "…" <sources>` pins the sources and creates a folder for the explainer. Evidence: a terminal screenshot from the walkthrough video showing the output (2 sources, pinned commit, "needs a guide part").
- **Review it in the same player.** You comment, and Finish ends in Done, Explain more or Plan this. Evidence: only a walkthrough moment at 1:10 and command descriptions.
- **Turn it into a plan.** `reel new-plan --from` writes a plan draft that quotes your review. Evidence: a screenshot of the plan text with highlighted quotes.
- **Check facts.** `check-sources` fails the build if a quoted line isn't in a pinned source. Evidence: a screenshot of the line "✓ check-sources: 2 scenes, 3 quoted pieces against 4 pinned sources".
- **Sources by shape.** Step 1 shows a table classifying sources as files, text, table or sequence.

The page says plainly that no run was saved. The pictures are frames from a video I can't play here, and the commands are "named in the walkthrough, not run". There is no real proof that these work, beyond "all 33 tests passed" in the opened testing notes.
Found: the step sections, screenshots and Try it yourself. Most of the detail needed opening.
Confidence: medium.

**3. How would I try it myself?**
The page gives templates, not a runnable example, and says to run them from the repo's top folder. The example in the screenshot is the closest to real:
```
reelplanning explain "what did last night's experiment show?" ~/runs/0929
```
Then `reel record <explainer-dir>`, then `reel new-plan <repo> <slug> --from <explainer-dir>`, then `reelplanning check-sources <video-dir>`. I would start with the first one, using a real folder of my own. I don't know how to see or play the resulting video, and the page doesn't say.
Found: "Try it yourself" section, no opening needed. The first command is truncated with "…".
Confidence: medium.

**4. What did the agent decide on its own, and which should I look at first?**
Seven choices are highlighted (A1, A6, A7, A9, A10, A12, A13), plus six smaller ones. I'd start with the two labelled "hard to undo later":
- **A1:** the name is `<name>--explainer` rather than `explainer:<name>`, so it works as a Windows folder name. It's hard to undo because names end up in files and packed pages.
- **A6:** the build fails on any secret, email or home path anywhere in the video's text, not only in quoted lines. It's hard to undo because that text is committed, and it will block builds.

Next would be A7, the extra fact-check role, and A10, the explainer sitting under "Needs you". A9, A12 and A13 are marked "you accepted it".
Found: "What the agent decided on its own", visible without opening. The "Where to check it in the code" folds were closed.
Confidence: high.

**5. What needs me right now?**
Nothing. The page says you approved it on 30 Sep 2026, including A9, A12 and A13. The "plan's questions" and "code check findings" folds are closed and don't need action.
Found: "Needs you" line in the summary, and the "What needs you" section.
Confidence: high.

**6. What could go wrong, or isn't done?**
- The "guide parts" for long sources aren't built. They are plain detail pages until a separate builder exists.
- On a hosted page, "Ask about this" can't read the source files, only their names, the quoted lines and the glossary.
- The overall system video is out of date.
- The agent made 13 calls, one over the warning level.
- **No explainer has been built in this repo yet.** It was only shown on a scratch clone.
- The code check found 8 items, all answered (fixed, or kept with a reason).
- The full test run had 2 timing failures out of 33. They passed when re-run alone.
- A new failure mode is that the build now rejects videos containing emails or paths.

Found: "What isn't done" section, with the code-check details in a fold that I opened via the everything-opened text.
Confidence: high.

**7. Where is the code, and how do I see what changed?**
It's 62 hand-written files in seven groups: the explain command, the Explainer row, Finish's three ends, Plan this, Facts from sources, the skill, and tests, plus other files. Each group has a "See the code" fold with its diff. There's also a command listing the twelve commits, starting with `git show 60e9173 8b93f2a 33d744a …`. The plan lives at `.reelplanning/plans/2026-09-29-explain-first/plan.md`. There's no branch name or repo location, and "Other files" (34 files, about +3091 lines) is large.
Found: "Where the code is", visible without opening. The commit list is folded ("The twelve commits").
Confidence: high.

## CONFUSED
- "**guide part**" / "needs a guide part". I guessed it's a longer detail page for a big source (over 200 lines).
- "**fresh eyes**", "**checker (F1 …)**". I guessed a second agent that reviews the work.
- "**pinned**". I guessed it means recorded by path and hash.
- "**D-228**", "**D-003**", "**A9**", "**m**". These are IDs from a decision log I can't see.
- "**system video**", "**reel audit**", "**plan map**", "**Before you watch**", "**prereqs**". I guessed at all of these.
- "**the walkthrough video above**". I only had screenshots and couldn't tell where the video plays.
- "**reelplanning** vs **reel**". The page explains it once, but the roles are still blurry.
- "**Words this page uses**" was folded, so I didn't get its help.

## BORED
- The "Where to check it in the code" folds repeat under every decision.
- The list of seven code groups is long, and the "Other files" group (3091 lines) is unhelpful.
- The "what the plan asked for" and "what was built" folds repeat per step.
- The tests paragraph and the code-check bullets are dense.
- The "Not done" summary is counts and jargon ("55 decisions").

## MISSING
- A one-sentence "what this does" (the page says so itself).
- Any real saved command output. Nothing shows it working beyond video frames.
- A concrete, runnable first example against this repo, and where the finished video is opened.
- A plain description of what an explainer video looks like when finished.
- A branch or PR link, or a single "see all changes" command that isn't 12 hashes.
- What happens next: whether to build a real explainer and try it.

## LOOK
It's calm, with a clean serif and generous spacing, and the "In short" box is a good idea. It becomes long and repetitive further down, and it leans heavily on internal terms and IDs.

## VERDICT
**Mostly.** In five minutes I get the gist, and I can find the decisions to look at and the fact that nothing needs me. But I'd have trouble knowing whether it really works, because the page says there's no saved proof.
**Biggest fix:** add a one-sentence summary and one real saved run, a command with its actual output, at the top. Together they would show that it works.
