# Review of the "Explain first" guide

**1. What is this change, and why should I care?**
The change adds a new kind of video, an "explainer", that walks you through something that already exists (code, a branch, a transcript, a decision) before any plan is written. You may want to understand what is going on first and only then decide whether to plan. It also lets you go from an explainer straight into a plan.
Found: the top of the page (title, your quoted request, the "In short" box). No opening needed.
Confidence: high

**2. What can I do now that I couldn't before, and what evidence is shown?**
- **Ask for an explainer.** You use your own words or a command, `reelplanning explain "<what you asked>" <source>…`. It makes a folder for it under `.reelplanning/explainers/`. Evidence: a screenshot of a table listing each source, its shape and size, and whether it needs a "guide part". The command itself is shown only as text.
- **Review one in the same player.** The Finish screen offers Done, Explain more or Plan this. Evidence: a screenshot of that Finish screen.
- **Turn the review into a plan.** `reel new-plan … --from <explainer-dir>` starts the plan from your comments. Evidence: a screenshot of a plan.md quoting the review, next to a `reel prereqs` output.
- **Have facts checked against their sources.** `reelplanning check-sources` runs during the build. Evidence: a screenshot showing "✓ check-sources: 2 scenes, 3 quoted pieces against 4 pinned sources".

The page says plainly that no run was saved. The pictures are frames from a walkthrough video, and I can't play that video from here. The commands are "named in the walkthrough; not run here".
Found: the "What you can do now" step cards (screenshots visible without opening) and "Try it yourself".
Confidence: medium

**3. How would I try it myself?**
The page gives templates, not a ready-to-paste example:
`reelplanning explain "what happened in the review server" scripts/review.mjs D-226`, run from the repo's top folder.
After that:
`reel record .reelplanning/explainers/<date>-<slug>`
`reel new-plan <repo> <slug> --from <explainer-dir>`
`reelplanning check-sources <video-dir>`
The sources I put in the first command are my guess at the syntax, based on the example table.
Found: the "Try it yourself" section, visible without opening. The command descriptions are cut off with "…".
Confidence: medium

**4. What did the agent decide on its own, and which should I look at first?**
There are 13 decisions, and seven are highlighted. The ones I'd look at first are the two labelled "hard to undo later".
- **A1, naming.** An explainer is called `<name>--explainer` instead of `explainer:<name>`, because a colon isn't allowed in Windows folder names. This is hard to undo because names end up in saved data.
- **A6, secrets check.** The build stops if a secret, an email address or a home path appears anywhere in the video text, not only in quoted lines. Everything is committed, so it errs on the safe side.
- **A7.** The fact check becomes a third fresh-eyes "checker" role, and its round waits for the checker.
- **A9, A12 and A13.** These cover the "What you want next" box on every Finish screen and Done as the first option. You already accepted all three.
- **A10.** An explainer waits under "Needs you" until it is reviewed.
- **A12 (the plan draft).** `new-plan --from` works without `--plan` and writes a draft.

Found: "What the agent decided on its own". The reasons are visible, and full wording is behind "Where to check it in the code" links that I didn't open.
Confidence: medium (the A-number labels are confusing, see below)

**5. What needs me right now?**
Nothing. The page says you approved this on 30 Sep 2026 and accepted A9, A12 and A13. One optional item is the note that the "system video" is behind and will be updated after this walkthrough is accepted.
Found: "What needs you" and the "In short" box. The plan's 3 questions are folded.
Confidence: high

**6. What could go wrong, or isn't done?**
- The "guide parts" are only detail pages until a builder that hasn't been built yet exists (D-228).
- "Ask about this" can't read the source files on a hosted page. It only sees names, quoted lines and the glossary.
- The system video is out of date.
- The change made 13 calls, one over the audit's warning threshold.
- No explainer has actually been built in this repo. Everything was shown on a scratch clone.
- The independent code check found only 2 of 5 steps "done as planned", plus five unexplained changes. The page says each was fixed or kept with a reason, but that list is folded (8 items), so I couldn't judge it.
- The commands weren't saved as runs, so nothing shows they work.
- The page's "What the plan and walkthrough don't say yet" list shows gaps: no way to try step 1, missing cases, and 11 interface lines with no explanation.

Found: "What isn't done" is visible. The code-check details and "What was tested" are folded.
Confidence: medium

**7. Where is the code, and how do I see exactly what changed?**
The change is 62 hand-written files in seven groups (explain command, Explainer row, Finish's three ends, Plan this, Facts from sources, the skill, tests) plus other files. Each group has a "See the code" fold with its diff. To see everything in git, run `git show 60e9173 8b93f2a 33d744a 3c02f1d a523e4e 6ebdc58 35dfce8 4f6e262 34bdc49 45f7a94 cc7c32a 5609921`. I don't see a branch name or a single diff command.
Found: "Where the code is" and the git command, visible. The diffs are folded.
Confidence: high

---

**CONFUSED**
- "A1", "A6", "D-228", "m", "D-003", "F1": the decision codes. I guessed A is a choice the agent made, D is a recorded decision, and m is a minor one. The page does say so once, but I can't tell what most of them refer to.
- "guide part" and "over 200 lines? a guide part": I guessed it's a separate detail page for a long source.
- "pins every source" / "pinned in sources.json": I guessed it means recording the exact version (a commit hash, a file range) of each source.
- "fresh-eyes role", "checker (F1 …)": I guessed it's a separate reviewing agent with no prior context.
- "Needs you" (as a queue) and "Before you watch" / `reel prereqs`: I guessed it's a list of things waiting on you, and things to read before watching a video.
- "system video", "packed page", "plan map", "hosted page".
- `reel` versus `reelplanning`: the page explains this in one sentence, but it is still hard to hold onto.
- "13 calls, one past the dozen reel audit warns on": I guessed "calls" means decisions.
- The "**Questions …" line in a command description shows markdown asterisks, which looks like a rendering glitch.
- "2 of 5 steps done as planned" sits next to "Built: all five steps". I guessed it means the checker found deviations, not missing work, but that wasn't clear.

**BORED**
- The long run of code-path and function names in the "Try it yourself" descriptions (`recordExplainer in scripts/reel.mjs…`), which are cut off anyway.
- Repeated folds ("What was built for it" and "What the plan asked for" under every step).
- The "Where the code is" file counts and the "How this page was made" note.

**MISSING**
- A concrete, complete example command with real sources, and its real output.
- One screenshot of an actual finished explainer. All the pictures show pieces: a source table, the Finish screen, a plan file.
- Any saved proof. It says "no run saved", so the evidence is a video I can't watch here.
- A plain "what could break for me" summary. The failing 2-of-5 result isn't explained in the visible text.
- A single diff or branch command. There is only a list of 12 commit hashes.
- A plain statement of which of the five capabilities matters most.

**LOOK**
The page is calm and well spaced, with a serif headline, a clear summary box and readable step cards. It gets dense in the middle, where the command sections have truncated text and code names, and in the decision cards, with their many codes.

**VERDICT: mostly.** The purpose, the five abilities, the fact that nothing waits on me and the list of what isn't done are clear within five minutes. The biggest fix is to give one complete, runnable example with its real output, and a plain-language explanation of the "2 of 5 steps as planned" finding, so I can believe it works rather than trust a video.
