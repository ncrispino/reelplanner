# Review of the "Explain first" guide

## 1. What is this change, and why should I care?
The change adds a new kind of video, an "explainer". It's a video that walks through something that already exists (a repo, a transcript, a run's results) so you understand it before you decide whether to plan anything. You care because you asked for exactly this: a way to just find out what's going on without committing to a plan first. A plan can follow if you want one.

Found: the subtitle, the quoted request and the "In short" box at the top; no opening needed. Confidence: high.

## 2. What can I do now that I couldn't before?
- **Ask for an explainer in your own words.** The skill now reacts to phrases like "explain…" and "what changed since…". `reelplanning explain "<question>" <sources>` pins each source and creates a folder under `.reelplanning/explainers/`.
  - Evidence: a still of a terminal showing that command and a "✓ … 2 sources … pinned at 4f6e262" result. It comes from the walkthrough video on a scratch clone, not from a saved run.
- **Review it in the usual player.** At the end, Finish offers three choices: Done, Explain more, or Plan this.
  - Evidence: a screenshot of the Finish screen showing those three options.
- **Turn the review into a plan.** `reel new-plan --from <explainer-dir>` writes a plan whose problem section quotes your comments and questions.
  - Evidence: a screenshot of a generated plan.md with the quotes highlighted, and a `reel prereqs` output.
- **Have facts checked against their sources, with private material kept out.** A check fails the build if a quoted line isn't in its source. It also stops on secrets, emails or home paths.
  - Evidence: a still of `check-sources` printing "✓ 2 scenes, 3 quoted pieces against 4 pinned sources".

The page itself says no run was saved. The only proof is stills from the walkthrough video.

Found: the "What you can do now" steps 1–5 (screenshots 2–6), plus "See it work". I didn't have to open anything to see the pictures. Confidence: medium.

## 3. How would I try it myself?
Run these from the repo's top folder. The page says none of them has been run, so they aren't proven:
```
reelplanning explain "what did last night's experiment show?" ~/runs/0929
reel record <explainer-dir>
reel new-plan <repo> <slug> --from <explainer-dir>
reelplanning check-sources <video-dir>
```
I'd start with the first one. The `<explainer-dir>` value is never stated beyond the folder pattern `.reelplanning/explainers/<date>-<slug>/`. The page also says no explainer exists in this repo yet.

Found: "Try it yourself" section, no opening needed. Confidence: medium.

## 4. What did the agent decide on its own, and which should I look at first?
There were 13 decisions, and the page shows 7 of them:
- **A1:** the name is `<name>--explainer`, because a colon is not allowed in Windows folder names.
- **A6:** the build stops on a secret, email or home path anywhere in the video's text.
- **A7:** the fact check is a third "checker" reviewer role.
- **A9:** the "What you want next" box is asked on every Finish.
- **A10:** an unreviewed explainer waits under "Needs you".
- **A12:** `new-plan --from` without `--plan` writes a draft with an empty step.
- **A13:** Finish offers Done first.

I'd look first at A1, because it's the one marked hard to undo, since the name ends up in folders and in `before:` lines. Next is A6, also marked hard to undo: it hard-blocks builds and it's a privacy rule. Then A13 (the default is Done), since it shapes how you'll use the feature. You already accepted A9, A12 and A13.

Found: "What the agent decided on its own", with each item's "What it chose instead of" folded. I did not open those. Confidence: medium.

## 5. What needs me right now?
Nothing. The page says you approved it on 30 Sep 2026, and it lists the three choices you accepted.

Found: the "Needs you" row and the section of the same name; no opening needed. Confidence: high.

## 6. What could go wrong, or isn't done?
- The "guide parts" aren't built. This is a placeholder detail page until the decision D-228 is built.
- "Ask about this" can't read source files on a hosted page. It only gets the source names, the quoted lines and the glossary.
- The system video is out of date.
- 13 calls is one past the warning threshold.
- No explainer has been built in this repo yet.
- An independent code check agreed on only 2 of 5 steps. It raised points on the other three and on five unexplained changes. The page says the walkthrough answers each, but I'd have to open "What it found" (8 items) to see them.
- No commands were run or saved, so working behaviour is unproven.

Found: "What isn't done, and what could go wrong", plus the "Not done" row. The 8 findings are folded and I did not open them. Confidence: high.

## 7. Where is the code, and how do I see exactly what changed?
The change is 62 hand-written files in seven parts: the explain command (+576/−13), the Explainer row, Finish's three ends, Plan this, Facts from sources, the skill, and tests. Another 34 hand-written files aren't named by any part. Each part opens to its diff under "See the code". For everything in git, run:
`git show 60e9173 8b93f2a 33d744a 3c02f1d a523e4e 6ebdc58 35dfce8 4f6e262 34bdc49 45f7a94 cc7c32a 5609921`
The branch name isn't stated.

Found: "Where the code is", at the bottom. The `git show` command is visible without opening; the diffs are folded. Confidence: high.

---

## CONFUSED
- "the plan guide's builder", "guide part": I guessed these are extra detail pages for long sources.
- "fresh eyes", "checker (F1 …)": I guessed a separate reviewer agent that hasn't seen the work.
- "reel audit", "13 calls, one past the dozen": I guessed calls means decisions or agent calls, but I can't tell which.
- "A/D/m" numbering: the page explains it, but D-228 and D-003 are still opaque.
- "Explained at <commit>, N commits since": I guessed it's a staleness marker.
- "missed-checks guard": I couldn't work out what this is.
- "the system video", "the walkthrough": I guessed a video for the whole tool, and the change's own demo video.
- "Under Needs you" (A10): I assumed a queue on the review page.
- "check-terms": the page names it and doesn't say what it does.
- "2 of the 5 steps and all 55 decisions": it's unclear how 55 relates to 13 or the "50 earlier" decisions.

## BORED
- The "Explain first" title repeats what the subtitle says.
- The "Not done" summary is a run-on line of five items.
- The "What the plan and walkthrough don't say yet" list is process housekeeping.
- The "How this page was made" text and the "Every note the builder made (29)" block.
- The per-item "Because…" lines on decisions read as code-level detail.

## MISSING
- A real, saved run with output. The page admits this.
- An end-to-end example for someone who wants to try it, including which sources to pass.
- A plain one-sentence "what changed" line. The page's own list of gaps says this line is missing.
- The findings from the independent code check up front. They're only in the folded 8.
- Risk ranking of the "not done" items.

## LOOK
Calm and well spaced, with a serif headline and generous margins. The screenshots are readable, but many are tiny video stills, and the folded sections plus the jargon-heavy text make it dense.

## VERDICT
**Mostly.** I understood the gist and what to approve, but I couldn't confirm that it works. The biggest fix is to add one real saved run, with the command and its output, and a plain "what changed" sentence at the top. The commands are currently labelled as unproven.
