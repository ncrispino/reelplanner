# Review of "The plan guide" page

Note: the folder also held `answers.md` and `err.txt`. I did not open them.

**1. What is this change, and why should I care?**
It adds a `reelplanning guide` command. For each plan, the command builds a detailed web page from the plan's written source (`plan.md`). The page sits behind the walkthrough video, and you can read, comment on and edit it. You should care because your past reviews kept coming back as "explain this more" (seven times across four plans). This gives you the "what exactly happens" detail without redoing the video.
Found: the top of the page, and the paragraph under your quote. Nothing needed opening.
Confidence: medium. The page never gives a one-sentence summary. It admits so itself in the "don't say yet" box ("What it lets you do now, in one plain sentence" is listed as missing).

**2. What can I do now that I couldn't before?**
The page names five things, with this evidence:
- **A generated guide page per plan.** Evidence: a picture from the video, plus a real command with output (`✓ … index.html · 5 steps … exit 0`).
- **Each step gets four blocks, and a check enforces them.** Evidence: a check run that printed several ✓ lines and one ✗, then `exit 1`. The picture is a frame of the video showing a table of cases.
- **Video and guide link to each other.** Evidence: only a video timestamp, "2:10 Step 3". There is no output.
- **Comment on the guide and suggest edits that the agent applies exactly.** Evidence: a saved "Edits to apply" file, printed with `cat`. It shows `--out` becoming `--to`.
- **A "Built" side after the build.** Evidence: only a video timestamp, "3:05". There is no output.

Steps 3 and 5 have no command evidence on the page.
Found: the "What you can do now" section, plus "Try it yourself". The command outputs are visible, and the picture stills are inside the "Watch this moment" blocks. I did not open the folded "What was built for it" sections.
Confidence: medium.

**3. How would I try it myself?**
Run these from the repo's top folder:
```
reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video
```
Then open `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html` in a browser. Next, run the check variant:
```
reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check
```
Found: the "Try it yourself" section. The commands have Copy buttons, and the file to open is stated in the text beside each command. Nothing needed opening.
Confidence: high.

**4. What did the agent decide on its own, and which should I look at first?**
- The plan left 27 choices to the agent: 12 are flagged as worth a look and 15 are minor.
- Two changed what the plan said:
  - **D1:** parts are written to `guide/<part>.html`, not `details/`, because the guide is never committed to git.
  - **D2:** a step's picture is just a row of names with the touched ones lit, not the animated stage the plan described.
- Some are hard to undo: transcripts are shown as path and hash rather than text (A4), the edit format (A10), and the "Categories of change" line format (A12).

Look first at D1 and D2, because they contradict the plan. Then look at A4, which is about privacy and hard to reverse.
Found: "What the agent decided on its own", visible without opening anything. The "Where to check it in the code" folds under each choice are closed.
Confidence: high.

**5. What needs me right now?**
Your review of the walkthrough video: approve it or ask for changes. The video pauses on the twelve choices for you to accept or flag each. The "Your notes" counter reads 0.
Found: "Needs you", and the blue line at the top, "Waiting on your review".
Confidence: high.

**6. What could go wrong, or isn't done?**
- **A failing check.** The shown check run ended with `✗ … build-typed-in.txt is not in runs/` and `exit 1`. I can't tell whether that failure is expected or a real bug. The page presents it as a demonstration of the check working.
- **Unfinished or missing pieces:**
  - hand-built interactive things from the earlier prototypes are dropped;
  - a step's own picture is supported but no plan uses it;
  - the system video is out of date;
  - older plans show gaps, and 28 cases have no trace;
  - no explainer exists yet;
  - steps 3 and 5 have no command to try.
- **Code-check result.** A second agent found one step with something to answer and ten changes the plan didn't explain. The page says each was "fixed, or kept with a reason", but the details are folded.
- **Diff size.** The "Guides for the videos we have" part shows −6538 lines. I don't know whether that's legitimate.

Found: "What isn't done, and what could go wrong" is visible. The code-check details ("What it found, and how each was answered", 6 items) are folded, and I did not open them.
Confidence: medium.

**7. Where is the code, and how do I see what changed?**
- 70 hand-written files in eight parts (builder, page, four-blocks check, video-guide links, edits, guides for existing videos, skill/record, tests), each with a "See the code" fold showing its diff.
- The exact command for the full history:
```
git show faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da
```
Found: "Where the code is". The per-part diffs need opening. The `git show` command is visible.
Confidence: high.

---

**CONFUSED**
- "the plan map", "the ledger", "D-022" and "D-249": I guessed these are the project's records of plans and decisions.
- "3 inks and coral", "prototype v4 / v5", "frame-lint": I guessed these are design and earlier-version jargon.
- "a part" and "layer": I guessed a part is a sub-page of the guide and a layer is a foldable section.
- "Trace column" and "# meaning": I have no real idea what these are.
- "Categories of change: - <name> {<id>} (<paths>) (<commits>) (step N)…": this is unreadable syntax to me.
- "the video first, and a full page behind it": I first thought the guide was the video, and it took a while to see it's a separate page.
- The Step 2 evidence is a *failing* run with "0 cases, 0 interface parts". I couldn't tell whether that is good.
- "Twelve choices… two of them changing what the plan said": the tally is confusing next to "27 things" and "15 smaller". The A/D/m codes are only explained further down.
- "Waiting on your review of the walkthrough video": it isn't clear whether I'm watching the video or reading this page.

**BORED**
- The "Step N · A#" choice cards are long, dense and repetitive. Each repeats "Instead of / Because" with code syntax.
- The "Try it yourself" list is padded with a second and third command, including a bare `<video-dir | plan-dir | explainer-dir>` usage line.
- The repeated "What was built for it / What the plan asked for" folds add clutter.
- The long "gaps" line of D-numbers in the check output means nothing to me.

**MISSING**
- A plain one-sentence "what this does for you". The page itself admits it lacks one.
- A screenshot of the actual guide page. The "pictures" are video frames of diagrams, not the finished page.
- A single command whose output I can trust for "it works". The only Step 2 run ends in a ✗ and `exit 1`, and the page doesn't say why that is okay.
- Any evidence for Steps 3 and 5 beyond video timestamps.
- A clear statement of the risk of the −6538-line deletion.
- A direct link or path to open the video.

**LOOK**
The page is calm and elegant, with a serif headline, lots of whitespace and a readable summary box. It slides into dense, jargon-heavy technical prose and long code-ish sentences as you scroll.

**VERDICT: mostly.**
The top gives me the motive, the "needs you" item and the command. The biggest fix is a plain one-sentence "what this is and what to do" at the top, plus one clean passing example with a screenshot of the real guide page. The Step 2 evidence is a confusing failing run.
