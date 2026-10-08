# Review of the "Explain first" guide

## 1. What is this change, and why should I care?
The change adds `reelplanning explain "<question>" <sources>`, which makes a video that explains something already there (code, a log, a transcript, a CSV) before any plan exists. Every quoted line is checked against its source. This is the standalone "explain first, plan maybe later" video you asked for in your quote at the top of the page.

Found: the top summary and "You, asking for it" quote, visible without opening anything. Confidence: high.

## 2. What can I do now, and what is the evidence?
- **Ask for an explainer.** `reelplanning explain "…" <sources>` pins each source and makes a folder under `.reelplanning/explainers/<date>-<slug>/`. Evidence: a saved run printing `✓ … 1 source (table 1) … pinned at 9fe2b88`. A second saved run shows a bad source refused with exit 1, and nothing is written.
- **Review it in the same player.** You then pick Done, Explain more, or Plan this. Evidence: a saved review file. The page says the decision log stays the same size whichever you pick. The narration says it held 250 entries before and after. The page's own worked example says 1 entry before, in a scratch repo.
- **Turn it into a plan.** `reel new-plan … --from <explainer>` writes a draft plan whose problem quotes your review. `reel prereqs` then lists the explainer first under "Before you watch". Evidence: two saved outputs, both exit 0.
- **Trust the sources.** `check-sources` printed a pass on 3 scenes and 7 quotes. It failed on a fake GitHub token (exit 1), and passed once the token was masked. Evidence: three saved runs.

Found: the "What you can do now" steps 1–5, "Try it yourself", and the "What it printed" folds, which I had to open. Confidence: high.

## 3. One step explained: Step 5, check-sources
1. Every scene that states a fact has a `- source:` line naming where it came from (a file with line range, a transcript turn range, a commit, a decision).
2. The check requires the source to be pinned in `sources.json`. If it isn't, the build fails.
3. Every quoted line must appear word for word in the source. A repo file is read at the commit it was pinned at, not as it is now.
4. Separately, all the video's text is scanned for secrets, emails and home paths. Frames, narration, storyboard and script are all covered. A hit stops the build.
5. Passing gives `✓ 3 scenes, 7 quoted pieces against 5 pinned sources`.

**Edge case:** a line contains a made-up GitHub token. The check prints `ghp_…`, never the whole key, and exits 1. It says the text must be cut or masked, and that blurring would leave the key in what's committed. With the token masked as `ghp_…REDACTED` it passes. It still warns that `session.jsonl` changed since it was pinned.

Found: the Step 5 diagram and the "In words" fold, then the opened worked examples for the outputs. Confidence: medium-high. The diagram is partly clipped.

## 4. How would I try it myself?
Run from the repo top. The page says these ran in a scratch repo, so the paths need to exist on your machine.

```
reelplanning explain "what did the experiment show?" ~/runs/results.csv --date 2026-09-29 --slug experiment
```
I expect: `✓ .reelplanning/explainers/2026-09-29-experiment/ · 1 source (table 1) · none needs a guide part · pinned at <hash>`, then a `next:` hint, then exit 0. Running it again the same day should create `…-experiment-2/`.

```
reelplanning explain "x" no-such-thing
```
I expect: `✗ explain: could not pin a source: … is none of: a path, a commit or a range…` and exit 1.

Then `reelplanning check-sources .reelplanning/explainers/2026-09-29-experiment/video`. That needs a built video, and no explainer exists in this repo yet. So the first command is realistic. The others need setup the page only partly explains.

Found: the "Try it yourself" section, with output folds opened. Confidence: medium.

## 5. What did the agent decide, and what should I look at first?
It made 13 choices; 7 are highlighted and 6 are listed only in the video. The 7:
- **A1:** the name `<name>--explainer`.
- **A6:** secrets, emails and home paths stop the build anywhere in the video's text.
- **A7:** a third "checker" fresh-eyes agent, used only when a source needs a guide part.
- **A9:** a "what you want next" box on every Finish.
- **A10:** an explainer waits under "Needs you" until watched.
- **A12:** `new-plan --from` without `--plan` writes a draft with an empty step.
- **A13:** Done comes first at Finish, even with comments.

Look first at A6. The page marks it "hard to undo" and it can block builds. It is strict: an email address or home path counts as a failure. A1 is also marked hard to undo, but it is only a naming choice. A9, A12 and A13 you already accepted.

Found: the "What the agent decided on its own" section, no fold needed for the headlines. Confidence: high.

## 6. What needs me right now?
Nothing. The page says you approved it on 30 Sep 2026 and accepted A9, A12 and A13. The video does end with "anything you'd change?", but that is optional. A flag on the six small choices is invited but not required.

Found: the "Needs you" row in the summary and the "What needs you" section. Confidence: high.

## 7. What could go wrong, or isn't done?
- **Guide parts:** the guide parts for sources over 200 lines aren't built, because the builder doesn't exist. The plan is approved but not built.
- **"Ask about this":** on a hosted page it only sees source names, quoted lines and the glossary, not the files.
- **System video:** it is out of date, missing the new glossary row.
- **Audit warning:** 13 calls, one past the dozen that `reel audit` warns on.
- **No real explainer:** none has been built in this repo. Every run is from a scratch repo.
- **Code check:** the independent check matched the plan on only 2 of 5 steps. The other three were flagged, and the page says fixed in 6ebdc58.
- **Warning in the example:** the "changed since pinned" warning shows sources outside the repo can drift. They are pinned only by path and hash.
- **Missing docs:** the page admits 1 step lacks a Cases table, 18 cases lack a trace, and 11 interface lines lack a meaning.

Found: the "Not done" summary row and the "What isn't done" section, plus the "Where the page has nothing to show" list. Confidence: high.

---

## Depth
**LEARNED:**
- Nothing enters the decision log from an explainer review.
- Outside-repo files are pinned by path and hash only, never their text.
- A repo file is checked at its pinned commit, so later edits don't break old explainers.
- Each explainer is a snapshot, so asking again makes a `-2` folder.
- The "shape" model has four shapes and no kinds.
- `check-sources` also blocks emails and home paths.

**DIAGRAMS:**
- **Helped:** the top flow diagram, since it shows the whole lifecycle of question, pin, video, check, then three ends. The sequence diagram for `explain` was also readable.
- **Didn't:** the "file's shape" diagram has overlapping edge labels ("anything e… anything else, outside… rep"), so it's unreadable. The check-sources diagram was cut off, and its edge labels are ambiguous. The top diagram has an overlapping red ✗ and label near "the video".

**EXAMPLES:**
- The "Asked again the same day" case made the snapshot behaviour concrete.
- The token-fail then masked-pass pair was the best, because it shows the exact messages and exit codes.
- The "BEFORE YOU LOOK" prompts (log size, what `sources.json` keeps) are nice, but the answer is behind "Show what it really printed".
- Opening the outputs was worth it for the error text and the `sources.json` content.

**RESTATED:**
- Several step blurbs restate the video. "Nothing goes into the decision log" repeats narration scene 6. "It's a snapshot: asked again, you get a new folder" repeats scene 3.
- "Seeing it run, anything you'd change?" is just narration scene 15.

**INVENTED:** nothing clearly unsupported, since most claims have runs or file names behind them. Two are loosely backed:
- "A reviewer who wants more picks it with one click." It is a UI claim with no screenshot.
- "Trust that every fact in it comes from a named source". The check verifies quotes and pinned sources, but the page shows no check on numbers or paraphrases. The number check is only mentioned in the six small choices ("what counts as a number").

**CONFUSED:**
- "guide part". I guessed it is a separate detail page for a long source.
- "fresh eyes / checker (F1 …)". I guessed it is a separate reviewing agent.
- "D-233", "A9", "m" codes. I guessed D is a decision id, A is an agent choice, m is a small one. The page does explain these at the "decided on its own" section.
- "the decision log held one entry" (page) versus "two hundred and fifty" (narration). I guessed the video used a different repo.
- "Explain more … a new version, those scenes rebuilt". I'm not sure what triggers the rebuild, given the snapshot rule.
- "made from" diagrams, "packed page", "walkthrough".
- "reel" versus "reelplanning". The page does explain them under "Try it yourself".

**BORED:**
- "The code" file groups (62 files, +3091 lines in "Other files").
- The "Every note the builder made" and "How this page was made" sections.
- The long list of decision codes and the twelve commit hashes.

**MISSING:**
- No screenshot of the review UI, the Finish screen or the Explainer row on the review page.
- No sample of an actual finished explainer video, as opposed to the pipeline around it.
- Nothing shows the generated `explain.md` content.
- No number check example.
- No instruction for setting up the scratch data to reproduce the runs.
- No example of "Explain more".

**VERDICT:** mostly. The lifecycle and the guarantees come across well beyond the video. The biggest fix is to show one complete finished explainer (its scenes and its Finish screen), and to fix the clipped, overlapping diagrams so the mechanism isn't left to the text.
