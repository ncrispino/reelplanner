Note: the folder has no `dark-*` or `phone-*` images, so section 5 covers only what the light screens and diagram close-ups let me infer. I looked at shots 1–12, 16, 18, 20, 24, 27, 28, and diagrams 2 and 9. I did not open the other diagrams or shots.

## 1. Clarity

**What works.** The top of the page (shot-01) is good. It has a plain title, a one-sentence promise, the user's quote, "The problem:" and then "In short". Each step opens with a bold "You can now…" line (shot-04 "STEP 1", shot-06 "STEP 2", shot-07 "STEP 3"). That line says what the section is for before any detail.

**What confuses or feels sloppy:**
- **The "In short" box (shots 01–02) is a summary table, not a summary.**
  - It has seven labelled rows: What you can do now, See it work, Worth your look, Needs you, Not done, Checked, The code.
  - "Not done" is five terse fragments, e.g. "The system video is behind by the glossary's new rows" and "No explainer exists in this repo yet". A reader cannot tell what these are or whether they matter.
  - It also has half a dozen dotted-underline jargon words plus a "Ten words here have a special meaning… Show them" line under it.
  - The result is a long box before the first real section, and it repeats the page below it.
- **The page uses builder vocabulary the reader has to decode.**
  - Examples: "part", "gaps", "Trace column", "blame", "A1/A8/D1/m", "D-244", "kinds of change", "layer".
  - Shot-18 explains the A/D/m codes in one paragraph, but the codes appear from shot-06 on ("A1", shot-06). So they are used about twelve screens before they are explained.
- **Some sentences are too dense to parse.** Two examples:
  - The "YOU'LL NOTICE IT" bold paragraphs (shot-20) are one 60-word sentence each, written in bold. The A2 one is a semicolon chain of nouns: "a rail (outline, Expand all, gaps), then What changed (Built), a section a step…".
  - The "How this page was made" paragraph (shot-28) is a wall of small text with stray punctuation: `…in a scratch repo.”.` and `( reel-check-no-diagram ,`. The stray `.”.` and the spaces inside parentheses (`( named`, `( D-244 )`) look like a sloppy build.
- **The "Worked examples" hide their answer.**
  - The `INPUT` and `WHAT HAPPENS` blocks describe the command, and the result is behind "Show the real output" (shot-06, shot-11). So the section that promises "what it really printed" shows only prose until you click.
  - Shot-08 has a "BEFORE YOU LOOK" question ("Do they fail too?") followed by another "Show what it really printed" button. That is a quiz inside a worked example.
- **Some wording is hard to follow.**
  - "Held to them: a plan written from 30 September 2026 on" (shot-07 video frame) reads awkwardly.
  - "step 1's interface wrote one page a plan" (shot-06) is hard to parse.
  - The shot-27 decisions table has an odd item: "Replaced by a later answer" is greyed out as a status, and the next item repeats a near-identical question. Two entries ask nearly the same thing ("Where does the guide open from the video?").

## 2. Diagrams

**Legibility.** The label text is small (about 11–12 px at 1000 px wide) and mid-grey. The colour is passable, but it is smaller than the body text.

**Diagram 1, "From the plan's files to the page under the video" (shot-03).**
- It shows how the page is built, with real file names.
- Edge labels collide with the arrows. "commits, kinds of change" sits on the walkthrough.md curve, and "each step's decisions" sits next to a curve.
- Six curves converge on model.mjs with arrowheads piled up.
- This is a good diagram whose labels need cleaning up.

**Diagram 2, "The steps, and which each needs first" (diagram-02, shots 03–04).**
- The node text is fine.
- Edges cross and run behind the "2. Complete, and checked" node. The "1 → 4" line passes just under "3" and the "1 → 5" line loops under node 2.
- Two arrowheads land on the same spot on node 4, and again on node 5.
- It does not show what "needs" means. The reader gets a graph of five ordinals without seeing why the order matters.
- It is close to decoration. A simple numbered list or a left-to-right layout would be clearer.

**Diagram 3, "What the folder you name gets" (shot-05).**
- It has three labels colliding with edges: "each of its videos", "plan.md one folder up", "its video/".
- The "its video/" label is cut by the arrow.
- Two different arrows are labelled with overlapping text, so the mapping is hard to follow.

**Diagram 4, "What reel check does with a new plan's blocks" (shot-07).**
- This one is clear, a small decision tree.
- "30 Sep 2026 or later, or --blocks" overlaps the edge to "held to the blocks". Labels sit on top of the arrow.

**Diagram 5, the `guide --check` sequence diagram (shot-08).**
- It reads well.
- The grey note "plan.md's every paragraph in the text; no narration sentence on the first layer; each run in runs/" is a text-heavy box floating in the lane, and it is squeezed into a narrow column.
- The participants sit in the middle of the column with large empty space left and right. The diagram is about 430 px wide inside a 760 px column, so the type could be larger.

**Diagram 6, "A scene opens its part, and back" (shot-09).**
- It is a good sequence diagram: it shows the real click path.
- The two actor shapes are inconsistent. "you" is a pill and the others are rectangles. That makes sense but reads oddly.
- Text is small and pale.

**Diagram 7, "A suggested edit, from the page to plan.md" (shot-12).**
- It is clear, with five lanes and readable labels.
- The final message "applied exactly, then reel check" is squeezed against the right edge.
- The five lanes at about 1000 px are tight. At 720 px, and on a phone, I expect labels to shrink to about 8 px or need side-scroll. I cannot confirm, because there are no phone images.

**Diagram 8, "How the parts of the change use each other" (diagram-09, shot-24).**
- It is nearly decoration. Four boxes are joined by five edges, with three arrowheads piled onto "The four blocks, checked".
- It says "click a part to go to its code" but does not show what the parts are.

**Dark theme.** I cannot verify it, since no dark screens were supplied. The diagram nodes use a beige fill and grey strokes, and the mid-grey text on paper is likely to lose contrast if the theme only inverts.

**The video-frame pictures** (shots 04, 06, 07, 10, 12) show a real UI at 30–60% scale. Text inside them is unreadable ("Held to them: a plan written from 30 September 2026 on" is about 9 px). They are the largest images on the page, and the reader has to trust them.

## 3. Interaction

- **"▶ Step through it — nine stages"** is a small outlined button with a play glyph, placed under every diagram (shots 03, 05, 07, 08, 09, 12).
  - It looks like a button, but it is low-contrast and small.
  - It comes after the diagram, so the reader has already read the diagram before finding out it can be stepped.
  - It is repeated seven times with identical styling. It reads as part of a template rather than an invitation.
  - It says "nine stages" but gives no hint of what happens: highlight, zoom, or text.
- **"The diagram in words"** is a chevron disclosure under every diagram. Good for accessibility, but it sits right under "Step through it", so two grey controls stack (shots 03, 08). It is noise. It could be one control, or merged into the caption.
- **Worked-example tabs** ("A video's guide / A plan folder, both videos, checked / A plan with no video yet") look like pills, and the selected one is black-filled (shots 05, 08). They look like what they are, but the pill row wraps to a second line in shot-08, and the labels are long ("Every block written, one diagram missing"). The selected pill in dark ink is the loudest thing on the screen.
- **"Show the real output"** is a bordered button (shots 06, 08, 11). It is clear, but it is used as the punchline of every worked example, so the page shows the least interesting thing first.
- **"Watch this moment 0:11 Step 1: the command, run"** (shots 05, 07, 10) is a small ▶ text link with a timestamp. It is what the brief calls the timeline of where the video stops, but there is no timeline. There are only text links, one per video frame. The link is easy to miss under a large picture, and the timestamps are tiny grey.
- **"Where the video pauses on it 0:41 Step 1…"** (shot-20) repeats the same pattern inside each decision card.
- **"More on this step"** (shots 06, 08, 11) is a chevron with grey subtext ("what else was considered, what breaks it, limits, files and commands…"). It hides a lot: considered alternatives, limits, what was built, the plan's words. It reads as a tail, not a section, and users will miss that it holds the depth.
- **Copy buttons** on the command boxes (shot-16) are fine.
- **"Open everything"** appears in three places: the top bar, the "In short" box, and a line under it (shots 01–02). The top-bar link looks like a link, not a control that changes the page.
- **"Your notes · 0"** in the top bar has no visible affordance and its purpose is unclear.

Overall the interactive controls are consistent and look like what they are, but there are far too many of them. Many of the disclosures (chevron rows: shots 24, 27, 28) are the same visual weight as real headings.

## 4. Calm and flowing

**What is calm.** The typography is good. The EB Garamond-style serif for headings, the sans body, the paper background and one narrow reading column all feel like an essay. Section titles ("What you can do now", "Where the code is", "The decisions it was built on") have generous space above (shots 24, 27).

**Where the rhythm breaks:**
- **Every step repeats the same sequence.** Small label, serif heading, bold promise, prose, big video-frame picture, "Watch this moment", "How it works", diagram, "Step through it", "The diagram in words", "Worked examples", tabs, INPUT/WHAT HAPPENS/EDGE CASES, "Why it works this way", "More on this step". That is about 12 elements per step, five times. By step 3 the reader stops reading. It is a template, not an article.
- **Too many kinds of container.** The page uses all of these:
  - the beige "In short" box;
  - the white rounded video-frame cards;
  - the dark terminal blocks with a light beige box inside (shot-04);
  - the left-rule quote, and left-rule worked-example blocks;
  - the "BEFORE YOU LOOK" beige card;
  - the dashed "What the plan and walkthrough don't say yet" box (shot-24);
  - the "CHANGED FROM THE PLAN / YOU'LL NOTICE IT / HARD TO UNDO LATER" left-rule cards (shots 18, 20);
  - pills, saved-run badges, chips.
- **The all-caps mini-labels multiply.** Examples: "STEP 1 · BUILT", "INPUT", "WHAT HAPPENS", "EDGE CASES", "BEFORE YOU LOOK", "CHANGED FROM THE PLAN", "YOU'LL NOTICE IT", "How it fits together", "How it works", "Why it works this way", "Worked examples". Even where they are small, they turn the page into a form.
- **Video-frame cards hurt the flow.** Shots 04–06, 07–08 and 10 show large empty areas inside the cards: in shot-05 the light card shows the caption "the walkthrough, git and the saved runs as well." over empty space, and in shot-08 there is blank space under the "Held to them" mock-up. About a full screen per step is a screenshot of a video frame with a subtitle burned in, which the reader can already get from the video above.
- **The bottom third of the page is a list of collapsed rows** (shots 27–28): six decisions and eight "plan's own words" sections, each a chevron row. It is calm, but the last screen is a very small-type paragraph, "How this page was made", that nobody will read.
- **The "What the agent decided on its own" section (shot-18, 20) is long.**
  - It is 27 choices, with 12 shown in bold sentence-length cards.
  - Each card has four lines: bold statement, "Because", a "Step 1 · A2 · in file" metadata line, and a video link plus "In the code" plus "What it chose instead of, in full".
  - That much metadata is too heavy for an article.

## 5. Light, dark, phone

No dark or phone screenshots were in the folder, so I can only flag risks from the light layout:
- **Light:**
  - The small grey text is low in contrast: captions, "The diagram in words", the greyed "Because" prefix, and chevron subtitles such as "what else was considered…".
  - Diagram labels are about 11 px.
  - In shot-03 the "Step through it nine stages" button has a light border on a light background.
  - The sticky top bar has "Your notes · 0", "Open everything" and "Back to the video" all in one row. At 390 px this row cannot fit; it will need to collapse.
- **Phone risks I can see in the desktop layout:**
  - Sequence diagrams with five lanes (shot-12) will shrink to unreadable text unless they scroll.
  - Dark terminal blocks contain very long lines (shot-16, `$ reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense/walkthrough-video --check --no-thumbs`). They wrap in the light layout, and a wrapped path with the Copy button will crowd the text.
  - The two-column "Because" and decision rows (shot-27, where question and answer sit side by side, e.g. "While a question is up…") will stack.
  - The inline mock-up pictures inside video-frame cards are already unreadable at 1000 px.
- **Dark risks:** beige node fills with dark text, the coral highlight ring in the mock-up (shot-12), and the black filled active tab pill (shot-05) will each need a redefined colour. Please recheck once the dark screens exist.

## 6. Fixes

**Single biggest fix: cut each step to a real article section.** Drop the twelve-part template. Keep four things per step: the promise line, one short paragraph, one diagram or one worked example (its real output visible, not behind a button), and one "More on this step" fold. Fold "Why it works this way", "Edge cases" and the "In the plan's words" material into that one fold. Remove the video-frame picture cards (the video is directly above the page) and replace them with a small "Watch this moment 0:11" link beside the heading. That alone would take the page from about 28 screens to about 15 and give it the calm the top of the page has.

**Next three:**
1. **Shrink "In short" to three lines** (what you can do, what needs you, what isn't done) and write "Not done" as one plain sentence each. Move the jargon list ("Ten words here…") out of the top. Define A/D/m codes and "part", "gap" and "trace" where they first appear, or replace them with plain words.
2. **Redraw the diagrams once, with a single pass over labels:**
   - Put edge labels on a background chip so arrows do not cut them.
   - Use one arrowhead per target.
   - Raise the label text to at least 13 px, and make the sequence diagrams fill the column.
   - Replace diagrams 2 and 8, which show "needs" and "uses" only as crossing curves, with either a list or a layered left-to-right layout.
3. **Make the interactions fewer and more obvious.**
   - Merge "Step through it" and "The diagram in words" into one control placed above the diagram, with a real label such as "Play the 9 steps".
   - Show each worked example's real output by default, and remove the "BEFORE YOU LOOK" quiz.
   - Show the video's stops as one horizontal timeline near the top with the steps marked, instead of one text link per card.

I would also add dark and phone screenshots of the diagrams, especially the five-lane sequence diagram (shot-12) and the terminal blocks (shot-16), before judging those two areas.
