# Design review: "Explain first" guide

I looked at all 25 light screens, 6 dark, 8 phone and 11 diagrams.

## 1. Clarity

**What works.** The top is strong (shot-01). It has a title, a one-line subtitle, the user's own quote, and an "In short" box built as "What you can do now". Each step opens with "You can now…" (shot-05, shot-15), which says what it is for before the detail. The choices section labels each item with a colored tag ("Hard to undo later", "You'll notice it"), then a bold claim, then "Because…" (shot-16, shot-17).

**What confuses or reads as sloppy:**
- **The subtitle wraps oddly.** In shot-01 "A video of what is going on, before any / plan." leaves a one-word orphan, and the subtitle is narrower than the lede below it.
- **The lede starts lowercase.** "you can ask for a short video…" is pasted user-voice text (shot-01, phone-01). It reads as a bug.
- **The "In short" box is too dense.** "Not done" carries five bullets, including "13 calls, one past the dozen `reel audit` warns on". "Checked" reads "matches the plan on 2 of the 5 steps… questioned the other three steps and five changes". This is process bookkeeping, not what a reader needs. It sits before the "what you can do now" content has been explained.
- **Internal vocabulary leaks throughout.**
  - IDs such as A1, A9, D-250, D-265, F1 and "m" appear without explanation.
  - "Twelve words here have a special meaning", "guide part", "fresh eyes", "the walkthrough", "scene lost you" and "TODO loop" are used before they are defined.
  - The "Where the code is" and "Try it yourself" sections repeat the step content (shot-18).
- **Two "Open everything" links** sit within 60 px of each other in shot-02: one in the header and one under "Select any words…".
- **The worked examples have odd claims.**
  - "BEFORE YOU LOOK: the decision log held one entry before. How many after?" (dark-03) is a prediction quiz with no visible answer until the button is clicked. It also asks a question whose answer is "0 change", which is not obvious.
  - "It finished without an error." appears under ten "saved run" pills. It is filler.
- **The "Step 1 example" table (shot-04) is a screenshot of the video.** A caption overlays it ("and described by its shape: a sequence,"). This is meant to be the moment from the video, but it looks like a broken UI card. The "▶ Watch this moment" line beneath it is easy to miss.
- **The section "What the plan and walkthrough don't say yet" (shot-20)** is an audit note for the builder, not for this reader.
- **"How this page was made" (shot-24)** is a wall of small text quoting an internal spec. It belongs in a collapsed disclosure or should be cut.

## 2. Diagrams

| # | Diagram | Verdict |
|---|---|---|
| 01 | Question → next (flow) | Meaningful, and the best of the set. But the "in the build" label collides with the red ✕ and the two arrowheads at "the video". The "check-sources" back-loop crosses the "you watch it" path. "nothing more" and "a new version" hug the arrows. Text is about 11 px. |
| 02 | Step dependencies | Clear and small. One dead-simple fix: it is a straight chain with one skip. It works. |
| 03 | A file's shape (fan-out) | Broken. Edge labels overlap each other and the arrows: ".csv, .tsv, a JSON list of rows" sits on top of "anything else, in the repo". You cannot tell which label belongs to which arrow. A decision table would show this better. |
| 04 | Sequence: explain step by step | Readable. Lifelines are faint, the ✕ arrow is fine, and the note box floats unattached. On the phone it is turned into a numbered list (phone-03), which is a good response. |
| 05 | Review state machine | Mostly readable, but three labels stack ("you know enough / something should change") and collide with the arrows into Done. The dark version (dark-03) is worse: the labels sit on the strokes and Done is clipped at the top. |
| 06 | Explainer → plan (vertical chain) | Fine, but a list of five boxes with labels. The wide left-hand blank space wastes the column. |
| 07 | check-sources decision tree | Confusing. The "check-sources" node has no incoming or outgoing edges, so it floats at the top. Labels ("pinned in sources.json?", "frames, narration, storyboard") sit on top of strokes. The two "fails" branches lead to different nodes, and the reading order is unclear. |
| 08 | "Parts of the change use each other" | Hairball. Six edges cross and share the same mid-line. Labels ("terms.mjs +2", "reviews.mjs +1") overlap the arrows. It is decorative: the reader learns nothing from an import graph. Cut it. |
| 09–11 | Two-box "which file uses which" | Decoration. `fresh-eyes.mjs → fresh-eyes.mjs` (diagram-11) is a self-arrow that is meaningless. Each takes about 200 px of vertical space to say one import. Cut all three. |

**Column fit.** They fit at 1000 px, but text runs 10–11 px in most, smaller than the body text. Sizing them up would need a redraw. All diagrams sit left-aligned in a mostly empty column, so wide diagrams feel timid.

**Phone.** The sequence diagram becomes a list, which is good. Diagram 08 (dark-06) is squeezed to about 6 px text. This is the one the guide most needs to drop.

**Dark.** Strokes are grey on near-black and labels are low-contrast (dark-03, dark-06). The label backing colour does not match the page, so some labels show a halo.

## 3. Interaction

- **"Step through it, one stage at a time"** looks like a heading with a dotted underline, not a button. It sits on its own line below every diagram, with "The diagram in words" under it. It does not invite a click, and the same line repeats under 8 diagrams (11 in total). Give it a play-button affordance placed on the diagram itself.
- **Worked-example tabs** ("Five sources of four shapes / What was pinned") are the clearest interactive element. They look like pills, and the selected one is black. But the labels are cryptic (dark-03: "What it filed"), and the tabs sit directly above a second layer of buttons.
- **"Show what it really printed" / "Show the real output" / "What it printed"** are three different names for one thing, and the actual output is hidden behind them. This is the point of the guide ("real output of saved runs") and it is never seen. Show the first output open by default. The second "Show" button sits inside a shaded "Before you look" box, so it reads as a quiz answer button, not an output toggle.
- **Disclosure rows** ("What breaks it", "Files and commands", "What was built for it", "What the plan asked for") use a small chevron and bold text. They look right. But four sit under every step (shot-15), so they read as a wall of closed drawers.
- **"▶ Watch this moment 0:12"** (shot-04, shot-07) is a small text link with a tiny triangle. The timestamp is in monospace. It does the job but is easy to miss and has no thumbnail.
- **The video-stops timeline** (shot-18): diamonds and circles on a rail. Nothing says what the diamond vs the orange circle vs the grey circle means (a legend is missing). The dots do not line up with the rows below, and 0:45 looks 25% along while the list is uniformly spaced. On the phone (phone-07) it is cramped, and "Watch it" wraps into two lines. The rows are otherwise good: time, description, link.
- **"Your notes · 0", "Open everything", "Back to the video"** in the header are clear. "Open everything" sounds like a risky command. "Expand all" is more usual.

## 4. Calm and flowing

The typography is good: the serif headings, the cream background, and the measure of about 760 px against the 880 px rule width all read like an essay. The rhythm breaks in these places:

- **After the first fold.** The "In short" box, the "Twelve words…" line, the "Select any words…" line, and then a big gap, all before the first heading. Four separate meta-blocks stack before the article starts (shot-02).
- **Every step repeats the same fixed stack:** a video-frame card, "How it works", a diagram, "Step through it", "The diagram in words", "Worked examples", tabs, INPUT / WHAT HAPPENS / BEFORE YOU LOOK / EDGE CASES, prose, "Why it works this way", and four disclosures. That is about 12 labelled parts per step, most with small-caps headers. It reads as a form, not as a story. Step 1 alone (shot-04, shot-05) needs three screens before its prose paragraph.
- **Uppercase micro-labels everywhere:** STEP 1 · BUILT, INPUT, WHAT HAPPENS, BEFORE YOU LOOK, EDGE CASES, HARD TO UNDO LATER, YOU'LL NOTICE IT. Together they turn the page into a database view.
- **The choices blocks are tag-heavy** (shot-16): each has a tag, a bold claim, "Because…", a metadata line ("Step 5 · A6 · in `privateIn in scripts/lib/…`"), a "Where the video pauses" link, an "In the code" list and a disclosure. Truncated code paths ("scripts/bun…", "in packages/playe…") look broken.
- **Boxes inside boxes.** The worked example is a left-ruled block containing a black code box, a shaded quiz box and a bulleted list.
- **The page's second half is meta.** "The plan, in its own words" (shot-24) opens with its intro set in bold monospace, which is a styling error next to the serif and sans everywhere else. Then come "Where the code is" with eight groups, "The decisions", "Every note the builder made 29" and the provenance paragraph. Nothing here is written for the reader's decision.
- **Ordering.** "What needs you" says "Nothing", and it comes after 15 screens. A reader who has to act should learn that at the top.

## 5. Light, dark and phone

**Light:** clean. The main flaws are the diagram overlaps above.

**Dark (dark-01…06):** the theme is applied consistently, and the header button flips correctly. Problems:
- Diagram edge labels are dim grey on dark, and the halos are visible (dark-03).
- The state machine is clipped at the top, with the "Done" node cut off.
- The import-graph diagram is nearly illegible.
- The shaded "Before you look" box is barely distinct from the page.

**Phone (phone-01…08):**
- The header drops the "GUIDE" label and keeps three controls, which is fine. But the sticky header covers scrolled text.
- The sequence diagram becomes a list, which is good.
- Code blocks wrap awkwardly, and "Copy" buttons overlay text on the narrow width. The "Try it yourself" commands wrap at odd points (phone-05).
- The timeline (phone-07) squeezes six markers, and "Watch it" wraps to two lines on every row.
- The key ideas are only readable after a lot of scrolling. With about 13 blocks per step, one step becomes 8+ screens.
- The dropped diagrams are not checked for phone. I would expect diagrams 01, 05, 07 and 08 to shrink to about 6–7 px text.

## 6. Fixes

**The biggest fix: make one calm article of the steps, and move the audit material out.** Each step gets: a one-sentence "what it lets you do", one diagram that shows the mechanism, one worked example with the real output already visible, and one paragraph of "why". Fold everything else (the "What breaks it" and "Files and commands" drawers, the "what the plan asked for" text, edge cases, "Where the code is", the decision list, the provenance note and the notes count) into a single "For reviewers" section at the bottom. The 12-part stack in every step is what makes the page feel chunky, and everything else is secondary to it.

**Next three:**
1. **Fix or cut the diagrams.**
   - Cut diagrams 08–11 (import graphs).
   - Redraw 03 as a small table.
   - Unstick the labels in 01, 05 and 07 and give 07 a real starting node.
   - Give diagram labels the page background, and set text at 13 px or more.
   - Check the dark and phone versions again.
2. **Make the interactions look like controls.** Replace the repeating "Step through it" underline with a real "▶ Step through" button on the diagram. Use one name and one style for reveal-output. Open the first real output by default. Give the video-stops timeline a legend, a time tick per marker, and a phone layout in which the "Watch it" link does not wrap.
3. **Say it in plain words, and cut the front matter.**
   - Lowercase and orphaned lede: fix.
   - "In short": three lines, with "Not done" and "Checked" moved down.
   - Put "What needs you" first.
   - Define A/D/m IDs once, or drop them from the body.
   - Remove the double "Open everything".
   - Keep the code-path metadata out of the reading flow, and stop truncating it with "…".
