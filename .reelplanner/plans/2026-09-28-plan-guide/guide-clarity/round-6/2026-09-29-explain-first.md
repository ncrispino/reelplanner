# Review of the "Explain first" guide

**1. What is this change, and why should I care?**
The change adds a new kind of video to the tool, an "explainer". You ask for it, and it explains what is going on in a repo, a transcript or a results folder. You get the explainer first and decide about a plan afterwards. You should care because you asked for this. Your quoted message says you want to understand things without every video having to start from a plan.
Found: the title, the quote and "In short" at the top, no opening needed. Confidence: medium. The page has no single plain sentence and says so itself in the "What the plan and walkthrough don't say yet" list.

**2. What can I do now that I couldn't before, and what evidence is shown?**
- **Ask for an explainer.** You use your own words or a command, and it records each source (files, text, tables, logs) by its shape and size. Evidence: a screenshot of a terminal run with output (2 sources, one needing a "guide part"), and a table of sources.
- **Review it and pick what comes next.** The finish screen offers Done, Explain more or Plan this. Evidence: a screenshot of that screen.
- **Start a plan from the explainer.** Your comments and questions are quoted into the new plan. Evidence: a screenshot of the generated plan.md, with the quoted lines highlighted.
- **Check facts and keep things private.** Every quoted line must match a pinned source, and secrets or emails stop the build. Evidence: a one-line "check-sources" pass (2 scenes, 3 quotes, 4 sources).

All of the evidence comes from the walkthrough video, shown as stills. The page states that no run was saved and that none of the commands has been shown to work.
Found: the step sections, no opening needed. Confidence: medium.

**3. How would I try it myself?**
The page lists these commands, and I would run them from the repo's top folder:
`reelplanning explain "what did last night's experiment show?" ~/runs/0929`
Then `reel record <explainer-dir>`, then `reel new-plan <repo> <slug> --from <explainer-dir>`, then `reelplanning check-sources <video-dir>`.
There is no command for step 1. The page says the commands are "named, not run", and the folded "Try it yourself" text was cut off, so I would only be guessing at the exact flags.
Found: the "Try it yourself" block, no opening needed. Confidence: medium.

**4. What did the agent decide on its own, and which should I look at first?**
It made 13 choices, and 7 are highlighted:
- explainer naming (`<name>--explainer`)
- a build-stopping privacy check for secrets, emails and home paths
- a third "checker" fact-check role
- the "What you want next" box
- an explainer showing up under "Needs you"
- new-plan writing a draft
- Done being offered first at Finish

I would look first at the privacy check (A6). It can halt a build and is hard to undo. Second is the naming (A1), also marked hard to undo. The page says you already accepted A9, A12 and A13.
Found: "What the agent decided on its own", no opening needed. Confidence: medium.

**5. What needs me right now?**
Nothing. The page says you approved it on 30 Sep 2026.
Found: "Needs you" in the summary and its section. Confidence: high.

**6. What could go wrong, or isn't done?**
- The "guide parts" for long sources are not built.
- "Ask about this" can only read source text on your own machine.
- The system video is out of date.
- The change made 13 calls, one more than the warning level.
- No explainer has actually been built in this repo yet.
- The independent code check raised points on three steps. They are marked "fixed" in commit 6ebdc58. The page also lists five changes the plan didn't explain, each answered.
- No commands were run for real.
Found: "Not done" and "What isn't done" (partly folded). Confidence: high.

**7. Where is the code, and how do I see what changed?**
The change touches 62 hand-written files in seven groups, each with a "See the code" diff you open. To see everything in git, run `git show 60e9173 8b93f2a … 5609921`, the 12 commits on the page. The repo path is not named, so you would go to the project's top folder.
Found: "Where the code is" and the copy-able git command, no opening needed. Confidence: high.

---

**CONFUSED**
- "guide part" and "a source that needs a guide part". I guessed it is a separate detail page for a long source (over 200 lines).
- "pins" a source. I guessed it records the path and a hash or commit.
- "fresh eyes", "checker (F1 …)", "rounds". I guessed these are a review loop run by a separate agent.
- "the walkthrough's open-question box" and "note with open: true". I could not work out what these are.
- "D-228", "A9", "m" and "D-003". I guessed they are numbers for decisions and choices.
- "the missed-checks guard's 'Ask the agent to explain it again'". I could not follow it.
- "The system video is behind by the new glossary row". I found this opaque.
- "13 calls, one past the dozen reel audit warns on". I guessed "calls" means decisions the agent made.
- "reelplanning" versus "reel". The page explains the difference in one clause, which is easy to miss.

**BORED**
- The "Words this page uses" list, the decisions section, "The plan, in its own words" and the twelve commits.
- The identical "What was built for it / What the plan asked for" folds under every step.
- The long code-check paragraph, which repeats what the summary says.

**MISSING**
- A plain one-sentence summary of what the change does. The page admits this itself.
- Any real output. Nothing was run, and no saved run of it working was shown.
- A command for step 1.
- A clear line on whether the tool works end to end. Only "no explainer built in this repo yet" hints at it.
- What "Done", "Explain more" and "Plan this" do in practice.

**LOOK**
The page is calm, with readable typography and good screenshots. The summary box is dense with jargon and ID codes. Long code-path fragments in the decision cards are cut off with "…", and a lot of the information is folded away.

**VERDICT: mostly.**
The intent and the flow are clear from the quote, the screenshots and the step headings. The biggest fix is to add a one-sentence "what this lets you do" at the top. The jargon and decision IDs should be defined or dropped, and at least one real command run with its output should be shown.
