# Review of the "Explain first" guide

## 1. What is this change, and why should I care?

You can now ask for a short video that explains something that already exists (code, a log, a transcript, experiment output) before any plan is written. The video may quote only what its named, pinned sources actually say. It matters because you asked for exactly this: to know "what's going on" first and decide about a plan afterwards. The guide also promises the video can't invent facts, and that secrets and transcripts stay out of git.

Found: the top of page-as-shown (the subtitle, your quoted request, "In short"). Nothing needed opening.
Confidence: high

## 2. What can I do now, and what is the evidence?

- **Explain any set of sources.** I can run `reelplanning explain "<question>" <sources…>`. Evidence: a saved run pinned five sources (a CSV, a folder, a commit range, a decision, a transcript), printed `exit 0`, and I can read the resulting `sources.json`.
- **Get a separate folder each time I ask.** Asking again the same day gave `…-experiment-2/`. A nonsense source (`no-such-thing`) was refused with exit 1.
- **Review it and choose an ending.** At Finish I pick Done, Explain more or Plan this. Evidence: a screenshot of the Finish panel, and a `reel record` run that filed a review `.md`. The decision log stayed unchanged.
- **Turn it into a plan.** `reel new-plan --from` wrote a draft `plan.md` quoting my comments, and `reel prereqs` listed the explainer first under "Before you watch".
- **Have quotes checked.** `check-sources` printed pass and fail runs: a retyped line failed, an unsourced number ("3") failed, and a fake GitHub token failed until it was masked.

The evidence is real saved output, but all of it comes from a scratch repo. The guide itself says no explainer exists in the real repo.

Found: "What you can do now", each step's "Worked examples" and the "Show what it really printed" panels. I had to open those panels.
Confidence: high

## 3. One step explained: `check-sources` (step 5)

For each scene, the check does two separate things.

- **Source lines.** It looks at the scene's `- source:` line. That source must be listed in `sources.json`, otherwise it fails. Every quoted line in the scene's data-artifact must then appear word for word in that source. Repo files are read as they were at the pinned commit, so later edits don't break old explainers.
- **Secrets.** Separately, all of the scene's text (frames, narration, storyboard) is scanned for secrets. Any hit stops the build.

Edge case: a transcript line contains `ghp_abcd…`. The build stops and names only the kind of key (`ghp_…`). You must mask it as `ghp_…REDACTED`; blurring the video isn't enough, because the text is committed to git. The masked line then passes, because `REDACTED` counts as a cut like "…" and the words around it are still checked. The run also printed a △ warning that the transcript "changed since it was pinned". That is a warning, not a failure.

Found: step 5's diagram and its four worked examples. I had to open the outputs.
Confidence: high

## 4. How would I try it myself?

The guide says all ten commands really ran, and it lists them under "Try it yourself". I would start with:

```
reelplanning explain "what did the experiment show?" ~/runs/results.csv --date 2026-09-29 --slug experiment
```

I expect a line like `✓ .reelplanning/explainers/2026-09-29-experiment/ · 1 source (table 1) · none needs a guide part · pinned at <commit>`. Then `(outside the repo: its path and hash only, never its text)` and a `next:` hint about filling `explain.md` and the storyboard, then `exit 0`. After that I would run `cat .reelplanning/explainers/2026-09-29-experiment/sources.json`.

The unclear part is that the page tells me to run these from "the repository's top folder", but the sources (`~/runs/results.csv`, `~/.claude/session.jsonl`, `dcd60fe..HEAD`) come from a scratch setup. The page doesn't say how to recreate it. I would have to supply my own files. The hashes and commit ids will differ from the page's.

Found: "Try it yourself" and its "What it printed" sections. I had to open them.
Confidence: medium

## 5. What did the agent decide alone, and what should I look at first?

The agent made 13 choices. Seven are highlighted and six are "smaller", listed only in the video. Three were already accepted by me (A9, A12, A13).

Look first at the two "hard to undo later" ones:
- **A1** is the naming `<name>--explainer`, chosen because Windows folder names can't contain a colon. It is hard to undo later.
- **A6** makes secrets, emails and home paths stop the build anywhere in the video's text, not only in quotes. It is the broadest rule and it can block builds.

Also worth a look is A7, the third "checker" fresh-eyes agent, which only runs when a source is over 200 lines.

Found: the "What the agent decided on its own" section. I didn't have to open anything, apart from the "in full" folds for detail.
Confidence: high

## 6. What needs me right now?

Nothing. It says I approved it on 30 Sep 2026. The narration still ends with "anything you'd change?", but the page treats that as closed.

Found: "Needs you" in the summary, and "What needs you".
Confidence: high

## 7. What could go wrong, or isn't done?

- **Guide parts aren't built.** For any source over 200 lines, the "guide part" is only a plain detail page for now.
- **Ask about this** only reads source text where it can. On a hosted page it gets just the source names, the scene's quoted lines and the glossary.
- **The system video is out of date.** It lacks the new glossary row.
- **The audit warning.** 13 calls is one past the dozen `reel audit` warns on.
- **Nothing real yet.** No explainer exists in this repo. Everything ran on a scratch clone.
- **Facts stated in words are not caught.** A claim with no digit and no quote ("most runs failed") gets past `check-sources`. Only the extra checker agent looks for these, and only when a source is over 200 lines.
- **Size is the only rule.** A short but hard-to-follow file gets no guide part.
- **The independent code check** matched the plan on only 2 of 5 steps. It flagged three steps, which were then "fixed, 6ebdc58". I can't see what was fixed without reading the diffs.

Found: "Not done" in the summary, "What isn't done, and what could go wrong", and "What breaks it" under step 5 (opened).
Confidence: high

---

## Depth

**LEARNED**
- Outside files are pinned by path, hash and line count only, never their text.
- The 200-line guide-part rule applies per file within a folder (244 lines total, but only `big.mjs` gets a part). For a commit range it counts changed lines (2 lines).
- Repo quotes are checked at the pinned commit.
- Blurring doesn't count as masking.
- An explainer never writes to the decision log, whatever ending I pick.
- The `-2` suffix for repeat asks.
- The `.gitignore` and `pr-check` rule that keeps media out of git.
- The "A second agent" checker only runs for long sources.

**DIAGRAMS**
- Helpful: the top flow diagram (question → `sources.json` → video → `check-sources` / Finish → three ends). The "explain" sequence diagram with the refused arrow was clear. The Finish state diagram was fine.
- The "steps and prerequisites" graph said little new; it just repeats the step order.
- The "file shape" diagram is cluttered. Its labels overlap at the fan-out ("anything else, in the repo" collides with "outside"). It is also tiny, and a table would do.
- The check-sources tree is cramped and its lower half is cut off in the screenshot, so the "fails" and "word for word" branches were hard to read. I relied on "The diagram in words".

**EXAMPLES**
- The best was the check-sources set (pass, retyped line, key, number). Their real output, with `exit 1` and the precise message, was worth opening.
- The `sources.json` dump was worth it for seeing what "pinned" means.
- The "Before you look" prompt ("What does `sources.json` keep of them?") was good, but its answer lives behind a click.
- The Step 3 example's "how many after?" is confusing next to the narration's "250 before".

**RESTATED**
- "Nothing goes into the decision log" appears in the step 3 text, the edge case, the "Why" section and the review `.md`.
- The "You can now…" line repeats in the summary, each step and the recap.
- "Seven choices the agent made on its own" is repeated in several places.

**INVENTED**
Nothing unsupported that I found, since most claims point to a run or file. The page does say the video shows things I couldn't verify: a "0:12 no kinds" table with 379 and 254 lines, and `ci-run-1142.log`. These aren't in the saved run, which used different numbers (244 lines, 3 lines). They look like illustrative examples, but the page doesn't label them as such.

**CONFUSED**
- "guide part" / "part of the guide": I guessed it means a detail page over a long source.
- "fresh eyes": I guessed it means reviewer agents.
- "A1/A7/D-250": I guessed these are the agent's choice ids and decision-log ids.
- "`reel audit` warns on 13 calls": I guessed a count of LLM or tool calls.
- "`- source:`, `data-artifact`": unexplained markup.
- "Explain more" vs "Plan this": the pages differ between the narration and the guide only in phrasing.
- "the guide's builder is not built (D-228)": I guessed a planned page generator.
- "Needs step 3" arrows: I guessed dependencies.
- "`— the walkthrough answers each`": I couldn't see the answers.

**BORED**
- The "What happens in each case … The plan doesn't spell this case out step by step" repeated dozens of times in the opened text.
- The "12 commits", the 62-file grouping, and the "Every note the builder made" section.
- The long "What was built for it" paragraphs, which restate the code.

**MISSING**
- A real explainer on this repo, or at least a screenshot of the finished video.
- How to recreate the scratch setup.
- A plain description of the review-page "Explainer row".
- What the code-check fixes at 6ebdc58 were.
- Which of the 13 choices I might want to change, and the consequence of each.
- What "Explain more" produces, shown as an example (only Plan this has a full example).

**VERDICT: mostly.**
I understood the design well: pinned sources, four shapes, three endings, quotes checked. Every claim is backed by real output, which is strong. The biggest fix: show one real explainer built on this repo (or an honest end-to-end walkthrough of the scratch repo with its setup), and cut the repetition.
