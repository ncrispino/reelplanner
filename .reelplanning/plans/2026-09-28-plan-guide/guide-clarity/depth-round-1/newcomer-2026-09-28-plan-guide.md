I've read the page text and eight screenshots, and I'm writing the review now.

# Review of the plan guide page

## 1. What is this change, and why should I care?
Every plan video now has a generated web page under it, called the guide. It holds the full plan (every case, command, decision) and, after the build, the real diffs and saved command outputs. You should care because your plan reviews kept bouncing back with "explain this more" (7 times across 4 plans, with 3–4 rounds each). This page is meant to answer those questions up front.

Found: the top summary block and the "problem" line. Nothing to open. Confidence: high.

## 2. What can I do now that I couldn't before?
Five things, each backed by evidence:
- **Open a full page under each video.** `reelplanning guide <plan-dir>` prints "✓ …/guide/index.html · 5 steps, 4 questions, 9 kinds of change, 74 files, 6 runs · 17 parts · 44 gaps · 1.0 s, exit 0". It's a saved run.
- **Have new plans held to a standard.** `reel check` on a made-up plan `2026-10-01-quiet-output` fails with three ✗ lines (no Cases table, no Interface block, an option with no example). Exit 1.
- **Click between video and guide.** A scene names its part with `- guide: step-1`. The evidence is grep output on the storyboard and plan-map, plus `check-details: 12 page(s) ok`.
- **Suggest edits on the page.** The page shows an example where `--out` → `--to` becomes a decision-log entry of kind `edit`, listed under "Edits to apply" with the scenes it rebuilds.
- **See planned vs built.** After the build, each step has a Built side with diffs and runs.

Found: "What you can do now", the "Try it yourself" section, and the "Show the real output" folds, which I opened. Confidence: medium-high. Step 5's outputs are thinner than the others.

## 3. One step explained: Step 2, `reel check` on new plans
The check looks at the plan folder's date. If it's 30 Sep 2026 or later, each step must have four blocks: cases, interface, an example, and the decisions it answers. Missing cases, a missing interface, or an option you can't picture make it fail. Missing extras (a trace, a diagram, meanings) only produce a warning. Older plans pass as they did.

**Edge case.** An option counts as having an example if it has a value, a quote, a command, a number, or a word of five or more letters from the question's own "Say …" setup. "It stops." has none, so it fails. The page's quiz asks whether step 1's missing meanings also fail. They don't: they show as △ warnings.

Found: the Step 2 diagram, the worked examples and the edge cases. I opened the real output. Confidence: high.

## 4. How would I try it myself?
Run from the repo root:
1. `reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video`. I expect one ✓ line like the one above (17 parts, ~1 s, exit 0).
2. Open `.reelplanning/plans/2026-09-28-plan-guide/video/guide/index.html` in a browser.
3. `reel check .reelplanning/plans/2026-10-01-quiet-output`. I expect three ✗ lines, one △ line and exit 1.

The page says this second plan is a scratch example. It may not exist in my repo, so I'm unsure it can be rerun.

Found: "Try it yourself" (11 commands), with each output behind a "What it printed" fold. Confidence: medium.

## 5. What did the agent decide on its own?
It made 27 choices; 12 are flagged and 15 are smaller. Two changed the plan:
- **D1.** Parts live in `guide/<part>.html`, not `details/`, because the guide is never committed.
- **D2.** A step's picture is a row of the system's parts with the touched ones lit, not the stage drawing. That drawing is too big for a column.

Others are labelled "hard to undo": A4 (an outside-repo transcript shows only path, hash and lines), A10 (an edit is a log entry of its own kind), A12 (how changes are sorted into kinds, with "Everything else" as a catch-all).

**Look first at D1 and D2.** They contradict what you approved. After that, A4 is a privacy-adjacent choice.

Found: "What the agent decided on its own", visible without opening anything. Confidence: high.

## 6. What needs me right now?
The build hasn't been reviewed. Watch the walkthrough video and press Finish, either approving or asking for changes. The video also pauses on the 12 choices so you can accept or flag each.

Found: the "Needs you" row and the "What needs you" section. Confidence: high.

## 7. What could go wrong, or isn't done?
- **Not done, listed on the page:**
  - Hand-built things to do from prototypes v4 and v5 aren't made by the builder.
  - No plan has its own step picture yet.
  - The system video is behind the glossary.
  - Older plans lack Trace and meanings.
  - No explainer exists yet.
- **A gap found by the checker.** Step 5 lacks two of its things to do (the "sort findings by what their author did" one, and "move a label onto its thing on a real frame").
- **Reviewer-flagged items.** Ten changes the plan didn't mention were questioned. The second agent's check covers only 4 of 5 steps.
- **Gaps in the guide itself.** The guide reports 44 gaps for this plan, and the earlier plan's `--check` ran with 19 gaps. Many of them read "D-…: no step", so many decisions aren't tied to any step.
- **Guide can fail to build.** A commit not in the clone makes `guide --check` fail. The first build takes about 10 s.

Found: the "Not done" and "Checked" rows, plus later sections I had to open. Confidence: medium.

---

## Depth questions

**LEARNED**
- The guide isn't committed. It's regenerated by `reelplanning build`, so there's no second copy to drift (D-213/D-244).
- The cutoff date: plans dated 30 Sep 2026 or later are held to the four blocks.
- The "counts as an example" rule (value, quote, command, number, or a 5+ letter word).
- A suggested edit rebuilds only scenes whose narration or frame contains the old words (`scenesSaying`).
- Files are sorted into kinds by first claim, with "Everything else" as the fallback.
- Timings: ~10 s for the first build, ~1 s after.

**DIAGRAMS**
- **Helpful:** the "what the folder you name gets" diagram, the Step 3 sequence diagram (storyboard → plan-map → player → part), and the Step 2 flow.
- **Less helpful:**
  - The big top "plan's files to page" graph is fine but says little beyond a file list.
  - The steps-dependency diagram is small and its arrows cross.
  - The Step 3 sequence diagram is wide with tiny labels.
  - The "Before/After" toggles show two nearly identical boxes.

**EXAMPLES**
- The Step 2 `reel check` failure was the clearest. The ✗ lines tell you exactly what's wrong, and opening it was worth it.
- The "Before you look" prediction prompt is good.
- The Step 4 edit example only describes the outcome in words, and I had to open the output to see it.

**RESTATED**
- The scene-by-scene "Watch this moment" screenshots mostly replay the video, for example the frame captioned "The guide holds every word of the plan; a scene, only its own."
- "Seeing it run, anything you'd change?"

**INVENTED**
- Nothing looks fabricated. The paragraph claiming a "second agent read the code" and matched "55 earlier decisions" has no visible source beyond the unopened check section.
- "Every sentence on it is a sentence of plan.md…" is a design claim, but the 44 gaps suggest it isn't fully true.

**CONFUSED**
- "beats", "layer", "part" and "detail". I guessed a part is a sub-page opened over the video.
- "kind of change" and "Everything else" (a category of files).
- "Trace column" and "# meanings".
- "the system video … behind by the glossary's new rows". I couldn't tell what that means.
- "D-244", "A5", "m10". I guessed the number prefixes are ID codes.
- "prototypes v4 and v5".
- "scenesSaying".
- "Plan | Built switch".
- "explainer".

**BORED**
- The repeated "What was built for it" and "What the plan asked for" folds.
- The 15 smaller choices.
- Repeating "Where the video pauses on it" links.
- The long commit and diff listings.

**MISSING**
- No screenshot of the actual finished guide page. I saw diagrams and thumbnails, but no real look at the thing.
- No plain-language "what did I approve versus what's different now" table for D1 and D2.
- No install or setup notes, and no test results.
- No explanation of the 44 gaps, and no plain-language description of what `reel record` does.
- No before/after of the "explain this more" problem, to show it's actually reduced.

**VERDICT: mostly**
A busy owner gets the shape (a page for each plan, plus a plan checker) and the two plan deviations in fifteen minutes. But the heavy jargon and internal IDs slow that down. **Biggest fix:** add a glossary of the terms above, and a real screenshot of the finished guide with its 44 gaps explained.
