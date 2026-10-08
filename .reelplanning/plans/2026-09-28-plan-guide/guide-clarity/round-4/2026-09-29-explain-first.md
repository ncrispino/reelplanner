# Review of the "Explain first" guide

**1. What is this change, and why should I care?**
The tool can now make a video that just explains what's going on in the repo, a transcript or some files, without needing a plan first. You can review that video, and if you want, turn it into a plan. You care because it's what you asked for: "explain first, then decide if we want a plan."
Found: the top of the page, plus the quote from the owner. Nothing opened.
Confidence: high

**2. What can I do now, and what evidence is shown?**
- **Ask for an explainer** in plain words ("what's going on in…", "walk me through this branch"). Each source is recorded by its path and a hash, and the sources are sorted by type and size.
  - Evidence: a screenshot of a table of sources, and a screenshot of a terminal showing `reelplanning explain …` and its output.
  - Both are stills from the walkthrough video. The page says the command was "named, not run" and that no run was saved.
- **Review it** in the same player, then choose Done, Explain more or Plan this at the end.
  - Evidence: the "Finish" moment is only a video timestamp (1:10). I saw no picture of it.
- **Start a plan from the explainer.** `reel new-plan --from` writes a draft `plan.md` that quotes your review.
  - Evidence: a still of a plan.md with highlighted quotes, and of `reel prereqs` output.
- **Check facts and privacy.** Every scene that states a fact must name its source, quotes must match the source word for word, and secrets are blocked.
  - Evidence: a one-line `check-sources` success output, again from the video.

The page is candid that there is no saved run. All the evidence is the video's stills.
Found: the "What you can do now" steps 1–5, and Try it yourself. Nothing opened.
Confidence: medium

**3. How would I try it myself?**
- `reelplanning explain "what did last night's experiment show?" ~/runs/0929`
- Then `reel record <explainer-dir>`
- Then `reel new-plan <repo> <slug> --from <explainer-dir>`
- And `reelplanning check-sources <video-dir>`

Run them from the repo's top folder. The page calls them "named in the walkthrough, not run", so they may not work as written. Step 1 has no command at all.
Found: "Try it yourself". Nothing opened, though the descriptions are cut off with "…".
Confidence: medium

**4. What did the agent decide on its own, and what should I look at first?**
The agent made 13 choices, and the page shows 7 of them:
- Explainer names use `--explainer` instead of a colon.
- A secret, email address or home path anywhere in the video's text stops the build.
- The fact check is a third "fresh-eyes" reviewer role.
- "What you want next" is asked on every explainer's Finish.
- An unreviewed explainer waits under "Needs you".
- `new-plan --from` without `--plan` writes a draft.
- Finish puts Done first.

Look first at the naming choice (A1) and the secrets rule (A6). Both are labelled "hard to undo later". The secrets rule also makes builds fail in a way you will notice. A9, A12 and A13 you already accepted.
Found: "What the agent decided on its own". Nothing opened. Six smaller choices are folded away.
Confidence: high

**5. What needs me right now?**
Nothing. The page says you approved this on 30 Sep 2026, and it accepted A9, A12 and A13.
Found: "Needs you" in the summary box, and "What needs you". Nothing opened. The list of the plan's questions is folded, so I didn't read it.
Confidence: high

**6. What could go wrong, or isn't done?**
- **No real run exists.** Nothing was demonstrated in this repo, only on a scratch clone in the video.
- **Guide parts** aren't built. Big sources get only a detail page, because the builder doesn't exist yet.
- **"Ask about this"** on a hosted page can't read the source files.
- **The system video** is out of date.
- **13 calls** is one over the audit warning threshold.
- **The independent code review** flagged items in 3 of 5 steps, plus five changes the plan didn't explain. The page says each was fixed or kept with a reason, but those answers are folded.
- **The gaps list** says there are no saved runs, no way to try step 1, and 18 cases with no trace.

Found: "What isn't done…" and the gaps box. Opening "What it found" would give the detail.
Confidence: high

**7. Where is the code, and how do I see what changed?**
- 62 hand-written files in seven groups, each with a "See the code" fold showing its diff (for example +576/−13 for the explain command).
- Or run `git show 60e9173 8b93f2a 33d744a 3c02f1d a523e4e 6ebdc58 35dfce8 4f6e262 34bdc49 45f7a94 cc7c32a 5609921`, the 12 commits.
- The plan lives at `.reelplanning/plans/2026-09-29-explain-first/plan.md`.

Found: "Where the code is" and "How this page was made". I opened nothing.
Confidence: high

## CONFUSED
- **"guide part"**: I guessed it means a companion detail page for a source of more than 200 lines.
- **"fresh eyes" / "checker (F1 …)"**: I guessed a separate reviewer agent that has no context.
- **"pinned"**: I guessed it means recorded by path and hash, so it can't silently change.
- **"packed page"**, **"check-terms"**, **"D-228 / D-003"**, **"A/D/m" codes**: I only half-guessed these. The letters are explained once, but the D-numbers are never explained inline.
- **"the system video"**: I guessed it's a separate overview video.
- **"reel audit warns on a dozen calls"**: unclear what a "call" is here.
- **"The code check: it found nothing to question in 2 of the 5 steps and all 55 decisions"**: the sentence is hard to parse.
- **"Words this page uses"**: a glossary of 10 terms, folded. I didn't open it, though I needed it.

## BORED
- The "Not done" summary line, which lists five items in a run-on.
- The seven code-group cards, whose names and counts repeat the summary.
- "How this page was made" and the folded "Every note the builder made" (29).
- The repeated "named in the walkthrough, not run" tags.

## MISSING
- **A real output or transcript** of an explainer being made and reviewed. There is only stills from a video I can't watch.
- **Any picture of the actual explainer video or the review screen.**
- **A single "try this first" command** with expected output. Step 1 has no command at all.
- **An explanation of what the explainer contains**, meaning what a finished one looks like to watch.
- **Plain-language stakes** for the hard-to-undo choices, such as what breaks later if the `--explainer` naming is wrong.

## LOOK
It looks calm and typographically clean, with a lot of whitespace and a clear top-to-bottom structure. The prose is dense with internal jargon, IDs and file paths, and it feels written for someone who already knows the project.

## VERDICT
**Mostly.** I got what was built, that it's approved, and what is missing within five minutes. What I couldn't get was what an explainer actually looks like or whether it works, because no real evidence was saved.
Biggest fix: put one saved, real run (command, output, and a screenshot of the resulting explainer video and review screen) at the top, and drop the internal codes and jargon from the summary.
