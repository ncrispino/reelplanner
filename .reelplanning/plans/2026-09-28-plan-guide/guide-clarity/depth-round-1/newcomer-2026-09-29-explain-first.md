# Review of the "Explain first" guide

I read `page-as-shown.txt`, `narration.txt` and the relevant parts of `page-everything-opened.txt`. I looked at eight screenshots: 1, 2, 3, 4, 5, 8, 12 and 14. Three of them had diagrams (3, 4 and 12).

## 1. What is this change, and why should I care?

You can now ask the tool for a short video that explains existing code, a log or a transcript before any plan exists. Every fact in the video is checked word for word against a named source. You asked for this: you wanted to "know what's going on" without a plan-first video, and to decide about a plan afterward.

Found: the top of the page, the "In short" box and the quote of your request. Nothing needed opening.
Confidence: high

## 2. What can I do now, and what is the evidence?

- **Ask for a video about any source.** Run `reelplanning explain "<question>" <sources>`. A source can be a file, a folder, a commit range, a decision, a transcript or a CI log.
  - Evidence: a saved run pinned 5 sources (table 1, files 2, text 1, sequence 1) and said 2 need a guide part.
- **Review it in the same player.** At Finish you pick Done, Explain more or Plan this.
  - Evidence: `reel record` output. It filed the review, added nothing to the decision log, and put the review in a memory file.
- **Turn the explainer into a plan.** `reel new-plan --from` produces a draft plan.
  - Evidence: the draft `plan.md` quotes my comments and the picked suggestion, "make the loss easy to compare". `reel prereqs` lists the explainer under "before:".
- **Have quotes checked against their sources.** `check-sources` runs on the video.
  - Evidence: a run stopped with exit 1 on a made-up GitHub token in scene 3. It printed the token only as `ghp_…`.
  - Evidence: another run passed, with 2 scenes and 3 quoted pieces against 4 pinned sources.
- **Get a clear refusal for a bad source.** `explain "x" no-such-thing` lists what it would have accepted and exits 1.

All of these are runs in a scratch repo, not on a real explainer.

Found: the "What you can do now" steps, the "Show what it really printed" tabs and the "Try it yourself" section. I had to open the tabs and "What it printed".
Confidence: high

## 3. One step explained, plus an edge case

I picked Step 2, the `explain` command.

1. You give it a question and sources.
2. It works out how each source is read: a repo path, a folder, a commit range, a decision, or "outside" the repo.
3. It gives each source a shape: sequence, table, files or text.
4. It records the source's path, hash and line count in `sources.json`. It does not store text for files outside the repo.
5. It creates a new folder, `.reelplanning/explainers/<date>-<slug>/`, with `explain.md` and a `video/` folder.
6. The output then tells you the next step. The agent fills in `explain.md`, `STORYBOARD.md` and `SCRIPT.md`, then runs `reelplanning build`.

**Edge case:** you ask the same question on the same day. The first folder is left alone, and the second is named `…-experiment-2`. An explainer is a snapshot and is never rebuilt when the repo moves. The saved output shows the second run pinning "1 source".

Found: the Step 2 diagram and the "Asked again the same day" tab. I had to open the tab and "Show the real output".
Confidence: high

## 4. How would I try it myself?

The page says to run from the repo top folder. Its ten commands all ran in a scratch repo, so the paths below need adapting.

```
reelplanning explain "what did the experiment show?" ~/runs/results.csv --date 2026-09-29 --slug experiment
```

I would expect a line like `✓ .reelplanning/explainers/2026-09-29-experiment/ · 1 source (table 1) · none needs a guide part · pinned at <commit>`. Under it, a line for the CSV, "table · N lines (outside the repo: its path and hash only, never its text)". Then a `next:` hint, ending in `exit 0`.

Then:

```
cat .reelplanning/explainers/2026-09-29-experiment/sources.json
```

This should show the question, the created date, the commit and the sources array.

Then the safe failure check:

```
reelplanning explain "x" no-such-thing
```

It should print `✗ explain: could not pin a source`, followed by the list of accepted forms. It exits 1.

Caveat: I don't have a real CSV, and the page says no explainer exists in this repo yet. Building the video and running `check-sources` on it is done by the agent, not me. The page doesn't say how I do that by hand.

Found: the "Try it yourself" section and the "What it printed" folds. I had to open the folds.
Confidence: medium

## 5. What did the agent decide on its own, and what should I look at first?

The agent made 13 choices. Seven are highlighted, and they are grouped as "hard to undo later" or "you'll notice it".

**Hard to undo later**
- **A1:** an explainer's name is `<name>--explainer`, because Windows doesn't allow a colon in a folder name.
- **A6:** a secret, an email address or a home path anywhere in the video's text stops the build.

**You'll notice it**
- **A7:** a third fresh-eyes "checker" role that checks the narration against the sources.
- **A9:** a "What you want next" box on every Finish.
- **A10:** an unreviewed explainer waits under "Needs you".
- **A12:** `new-plan --from` writes a draft with an empty step.
- **A13:** Done is the first choice at Finish.

Six smaller choices are listed only in the video's list.

Look first at **A6**, and probably **A1**, because they are the ones flagged "hard to undo". A6 also changes what is allowed in committed text: a home path or an email address will fail a build.

You already accepted A9, A12 and A13.

Found: "What the agent decided on its own", opened. The "hard to undo" label was visible on the page. Their reasons ("Because…") were shown without opening.
Confidence: high

## 6. What needs me right now?

Nothing. The page says you approved the build on 30 Sep 2026. The video's last scene asks "anything you'd change?", but the page treats that as already settled.

Found: the "Needs you" row in the summary and the "What needs you" section.
Confidence: high

## 7. What could go wrong, or isn't done?

- **Guide parts don't exist yet.** A source over 200 lines is supposed to get a guide part. Until the plan guide's builder exists, the part is only a "detail page" (D-228 approved, not built).
- **Ask about this is limited.** On a hosted page it gets only the source names, the quoted lines and the glossary, not the files.
- **The system video is stale.** It lacks the new glossary row and will be updated after acceptance.
- **The change has 13 calls,** one over the dozen that `reel audit` warns on.
- **No real explainer exists in this repo.** Every run was in a scratch repo, and the transcript's key is made up.
- **The independent check only partly matched the plan.** The code matched on 2 of 5 steps. The other three steps were "fixed, 6ebdc58".
- **The page notes gaps in `plan.md`:** 18 cases have no trace and 11 interface lines have no meaning.
- **Secret handling has a rough edge.** The `check-sources` run also printed a warning that the session file "changed since it was pinned", while the run stopped for the secret. It's unclear whether a changed pinned file can break the build.
- **A transcript file's content isn't stored, only its hash.** So the transcript quote check can't be replayed later on another machine. I'm inferring this, and the page doesn't say it.

Found: the "Not done" list and "What isn't done, and what could go wrong". I also opened "The code check".
Confidence: medium

## Depth

**LEARNED**
- The four shapes: sequence, table, files, text. The kind of thing is never stored (D-250).
- Files outside the repo store only a path and hash. Repo files are checked "at the pinned commit", so a file that changed later still passes.
- Nothing goes into the decision log from an explainer. Only answers to a plan's questions do.
- The naming rule (`--explainer`) and the reason behind it (Windows folders).
- The secret and email/home-path ban covers all video text, not just quotes.
- The count of 250 decisions in the log and the 13-calls audit warning.
- `reel` is a second command for the project's record. `reelplanning` is the main tool.

**DIAGRAMS**
- **Helped:** the "An explainer, from your question to what comes next" diagram (shot 3). It shows the flow with the check-sources loop and the three ends. The "Steps and which each needs first" graph is also readable.
- **Cluttered:** the "A file's shape" diagram (shot 4). The edge labels overlap the arrows (".csv, .tsv, a JSON list of rows" is crowded), and it says little beyond the prose below it.
- **Weak:** the check-sources diagram (shot 12). The branches are cut off at the bottom of the screenshot and hard to read. The "which file uses which" import diagrams show file names only, with no meaning attached.

**EXAMPLES**
- The Plan this draft (`plan.md` with my quoted words) made step 4 concrete.
- The `check-sources` token failure made step 5 concrete.
- The "Before you look" prompts are good ("How many after?"), but the answer is hidden behind a click.
- The five-sources output was worth opening for the "outside the repo: path and hash only" wording.

**RESTATED**
- The step "You can now…" one-liners repeat the "In short" bullets word for word. "You can now get a video that explains any code, log or transcript, before you decide anything." is the example.
- The narration's scenes 1 to 3 and 9 to 10 are largely restated. The "Watch this moment" clips add nothing new.

**INVENTED**
Nothing looks made up. Two things are asserted without support on the page:
- "every fact in it is checked word for word". The check covers only quoted lines. A fact that is a summary or a number is a weaker check (the "number" rule is in the unlisted small choices).
- "Trust that every fact in it comes from a named source". The page shows the check catching one retyped line and one token, but no example of a real explainer that passed.

**CONFUSED**
- "guide part". I guessed it means an extra detail page for a long source that the video can't cover.
- "fresh eyes" and "checker (F1 …)". I guessed they mean a separate agent that looks at the result without the earlier context.
- "pinned at 9fe2b88". I guessed this is the commit.
- "A2", "D-250", "m". I guessed A is an agent choice and D is a decision, which the page does explain eventually.
- "the decision log held one entry before" on the page, but "two hundred and fifty" in the narration. I can't tell which is right, and I assumed the scratch repo had a different number.
- "the system video is behind by the new glossary row". I guessed the project's overview video is out of date.
- "Ask about this". I guessed it is a question tool in the player.
- "dropped by" ("a later commit dropped by"). Unclear.

**BORED**
- The "How this page was made" block and "Every note the builder made".
- The long list of 62 files. Its diagrams are import graphs with no explanation.
- The "What the plan asked for" and "What was built for it" folds, which I only skimmed.

**MISSING**
- A plain example of an actual generated video: what it looks like and how long it is. Only scratch-repo folders and a table of source shapes are shown.
- One real, end-to-end run from question to finished video. The page says "No explainer is built in this repo yet".
- Exactly how I run `reelplanning build` and where I watch the result.
- What the page's "quick checks" resolve to. The narration asks the questions, but the page doesn't show their answers.
- How big a risk A6 is. If the ban on emails and home paths is strict, how often does it trigger on normal repos?
- The contents of the "What it chose instead of" folds.

**VERDICT: mostly.** I could follow what was built, what the agent chose and what is missing. The page's biggest weakness is that everything was demonstrated on a scratch repo, with the video not built. The single biggest fix is a real, end-to-end example: one explainer built and watched from a real source, with the `check-sources` result on it.
