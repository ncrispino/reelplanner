# Design review: "The plan guide"

## 1. Clarity

**What works.** The top of the page (shot-01) is strong. It has a kicker, a serif title, a one-line promise, the user's own quote and a status line ("Not reviewed yet"). The "In short" box (shot-01 to 02) gives a good map. Each step has a consistent shape: a "STEP n · BUILT" kicker, a serif title, and a bold "You can now…" line. That line is the best sentence on the page.

**What is confusing or sloppy.**

- **The opening is wordy and contradictory.** The subtitle is "The video first, and a full page behind it". Right after it, the lede says the guide is "under" the video. The lede starts lowercase ("every video now has…"), which reads like a leftover fragment. A reader still doesn't know why this page exists or what to do first.
- **"In short" is a dense two-column table** (shot-02) with eight labels: See it work, Worth your look, Needs you, Not done, Checked, The code, and so on. "Not done" alone has five bullets. It is a second page summary sitting on top of the actual page. Its labels don't match the section names below ("What needs you" and "What the agent decided on its own"). The "Twelve choices…", "the walkthrough answers each" and "Ten words here have a special meaning" lines assume the reader already knows the jargon.
- **Undefined internal jargon leaks everywhere.**
  - Codes like A1 to A14, D1, D2, m10 and D-244 appear in body text (shots 7, 18 to 22).
  - Working terms like "scenesSaying", "the revise", "plan-map", "a part", "Trace column" and "gaps shown" go unexplained.
  - In shot-03 the preface says "with a picture of it working", but the picture is a video frame.
- **The "Because / The plan said / In the code" cards** (shots 18 to 22) run bold headlines of 4 or 5 lines full of code spans. They are written as commit-log prose, not as "here's what you'd notice". The kickers "CHANGED FROM THE PLAN / HARD TO UNDO LATER / YOU'LL NOTICE IT" are useful, but the headline is the whole claim. Nothing says "what do I do with this?".
- **Step 1's "How it works" is repeated and ordered oddly.** The page opens with a "How it fits together" diagram before step 1 (shot-03), then a step-dependency diagram, then step 1's own diagrams. It is three diagrams before any step content.
- **"What isn't done" and "What the plan and walkthrough don't say yet"** (shots 24, 25) repeat the "Not done" list from the top box.
- **Section purpose is uneven.**
  - The big H2s ("What needs you", "Where the code is") do have a one-line intro.
  - The per-step sub-blocks ("How it works", "Worked examples", "Why it works this way", "What else was considered", "What breaks it", "Limits", "Files and commands", "What was built for it", "What the plan asked for") appear as a stack of 6 to 9 collapsed lines with no hint of content (shot-06, 10).

## 2. Diagrams (14 in total)

Diagrams 01 to 14 follow one visual language: light-tan file tabs, white rounded boxes and thin grey arrows. This consistency is good. Most of them do show a real mechanism from the sources.

| # | Verdict |
|---|---|
| **01** Plan's files → page | Best on the page. Clear top-to-bottom flow, and each source is labelled. Flaws: edge labels "commits, kinds of / change" collide with the curve, and the "built.mjs" arrows from the top row land beside the row-2 items, so it looks like a peer input. Labels are about 9 to 10 px equivalent. |
| **02** Step dependencies | Readable, and the clickable boxes work. Three arrows leave "1. The guide" in a tangled fan that overlaps the 2 and 5 boxes. There is a lot of empty space right of centre. It is a decorative dependency graph that doesn't help a reviewer. |
| **03** What the folder you name gets | Edge labels ("each of its videos", "plan.md one folder up") sit on top of crossing curves. The two curves crossing near "a video's guide" are hard to follow. The mechanism is fine, but it is really a 3-row table drawn as a graph. |
| **04** Where a plan's guide lives | Only two arrows to two labelled boxes. Labels ("the plan video's", "the walkthrough's") are crossed by their own curve. It is little content for the space, and the Before/After toggle is much more interesting than the drawing itself. |
| **05** reel check decision tree | Good idea, poorly laid out. "30 Sep 2026 or later, or --blocks" overlaps its own curve. "a missing block" and "a missing detail" labels overlap two arrows and the "fails" ✗. The red ✗ is tiny, and it is the only place where failure is shown. The fails and warns branches are not obviously different. |
| **06** guide --check ↔ Chromium (sequence) | The clearest diagram: readable, and it shows a real sequence. But labels are about 11 px. The tan note box sits lonely on the left with unbalanced wrap. About 60% of the width is empty. |
| **07** Scene opens its part (sequence) | Seven lifelines squeezed into 760 px. Labels are about 9 px, and the boxes are pill-shaped inconsistent with the others (rounded "you" vs sharp boxes). The link to the "full guide" is not visually connected to anything. It is hard to read on a phone. |
| **08** Where a part's page lives | The tiny red ✗ on the ".gitignore" arrow is the only signal. Three boxes, one arrow, one fact. This would be a sentence. |
| **09** Suggested edit (sequence) | Seven lifelines again; text ~9 to 10 px. The "rebuild: only the scenes…" note is centred over the wrong lifeline. The arrow to "Edits to apply" is very long for no reason. |
| **10** Built-side routing | Worst overlaps: "its paths, its commits" collides with the curve; "10 lines around each change" and "its lines from git blame marked" and "a file the build writes" all pile onto each other near the three leaf boxes. This is illegible right where the point is made. |
| **11** How parts of the change use each other | "plan-md.mjs" labels sit on the arrow lines. Crossing arrows go into "The four blocks, checked". Meaning is thin (module imports). |
| **12 to 14** import diagrams | Three to four boxes each. 13 is one dashed arrow between two boxes, which is a sentence rendered as a diagram. Arrowhead in 14 is doubled and smudged. These are decoration. |

**Overall for diagrams.**

- **Text size.** Edge labels are about 10 px against 16 to 17 px body text, and diagram text is grey on cream (contrast is borderline).
- **Whitespace.** Diagrams don't fill the column (01, 03, 04, 06, 12 to 14 leave 20 to 40% empty on the right).
- **Overlaps.** Edge labels sit on their own curves in 03, 04, 05, 10 and 11.
- **Two "Step through it" links** sit under every diagram. That is 9 or more repeated instances (see §3).
- **Dark theme** (dark-02) holds up well. Boxes and text remain legible, and tan tabs are neutralised. Contrast for the grey edge labels is slightly weaker than in light.
- **Phone** (phone-02, phone-03):
  - Diagram 03 is **cut off** on the right. "an explain… folder" runs off the edge in phone-02, and the "its video/" label is clipped.
  - Diagram 06 (phone-03) survives by reflowing, but text is small.
  - Diagrams 07, 09 and 10 with 7 lifelines almost certainly can't fit at 390 px; none was shown, so I can't confirm.

## 3. Interaction

- **Worked-example tabs** (shot-05, 08, 11, 13): pill tabs with a black active state. They look like tabs and they invite clicking. This is the best-designed control. Issues: the tabs wrap to a second line in shot-08. They sit below a diagram and a "Worked examples: three cases…" label, so a reader may treat them as a caption.
- **"Show the real output"** is a bordered button inside the example. It looks like a button and is discoverable. The "BEFORE YOU LOOK" nested card with "Show what it really printed" (shot-09) creates a button inside a card inside a bordered block. Three layers of boxes.
- **"Step through it, one stage at a time"** is underlined text with no icon and no button shape. It reads as a hyperlink or a caption. The action is not obvious, it repeats after every diagram, and it is set larger and darker than "The diagram in words" beneath it. Turn it into a proper control (▶ Step, or numbered dots) that sits at the diagram's edge.
- **"The diagram in words"** disclosure is a chevron plus grey text. It is clear enough, but repeated 14 times it becomes noise, and many diagrams are trivial enough that it adds nothing.
- **Before/After toggle** (diagrams 04 and 08): "Before: as step 1's interface wrote it | After: as built (A1)". It is a segmented control, but it's tiny, low contrast and sits between the title and the diagram. What matters is the change between the two states, and the toggle gives no visual cue of what differs.
- **"Watch this moment 0:11 Step 1: the command, run"** (shot-04, 10, 12, 13): a tiny ▶ plus bold underlined text plus timestamp. It looks like a link. The video frame above it looks like a static screenshot with a caption bar, not a still of a video. It reads as a broken video with no play button. Consider a play affordance on the still.
- **Timeline of video stops** (shot-23): a thin line with 8 dots, mixing round coral, round grey and diamonds, with no legend. The dots do not obviously line up with the list below. The hover or click behaviour is unknowable. The list beneath it is good, but the marker shapes carry meaning (quick check versus choices) that is never stated. The timestamps appear again ("0:41" and so on) in both list and dots.
- **Collapsed sub-sections** ("What breaks it", "Limits", …): 6 to 9 identical chevron lines stacked. They look like a table of contents of unknown content. One is open by default ("Why it works this way"), which is inconsistent.
- **Copy buttons** on dark code blocks (shot-16): well-styled and fine.
- **Top bar** ("Your notes · 0", "Open everything", "Back to the video"): "Back to the video" looks like the primary button and is clear. "Your notes · 0" is grey underlined text with a tiny zero and unclear meaning. "Open everything" also appears twice more inline (shot-02, 01), which is confusing.

## 4. Calm and flowing

The type is lovely: serif headings on a warm paper background, generous line length and good contrast. The page opens calmly. Then it turns chunky.

**Where the rhythm breaks.**

1. **The "In short" tan slab** (shot-01 to 02) is a huge two-column box that looks like a spec table.
2. **Every step is a factory line of ~10 elements** (shots 04 to 15): kicker, H2, bold lead, body, a big bordered video frame, a "Watch this moment" link, "How it works" label, a bold diagram title, a diagram, "Step through it", "The diagram in words", "Worked examples" label, tabs, a left-ruled example block with INPUT, WHAT HAPPENS, EDGE CASES, then "Why it works this way" open, then 5 or 6 collapsed lines. Small-caps labels (INPUT, WHAT HAPPENS, EDGE CASES, BEFORE YOU LOOK, HOW IT WORKS, HARD TO UNDO LATER, YOU'LL NOTICE IT) are everywhere. There are about 20 distinct small labels or kickers on a page that should read as one article.
3. **The video-frame cards** (shots 04, 07, 10, 12, 14) are large rounded bordered boxes where the frame content is tiny and low-res, and half of it is blank. Shot-10 shows a mostly empty white card with a tiny screenshot on top. The frames are unreadable at this size. They take about 400 px of vertical space and communicate almost nothing.
4. **"Try it yourself"** (shots 16 to 17): 11 near-identical dark code blocks each followed by a "saved run" pill, a sentence and a collapsed "What it printed". It's a wall of black bars. The sentence "It finished without an error" is repeated with no information.
5. **The decision cards** (shots 18 to 22) are a run of ~12 left-ruled cards of dense bold text. This is the section the reader most needs to judge, and it is the least scannable.
6. **The end** (shots 24 to 29) is a long tail of low-value material: two more "What the plan asked for" sections and "The plan, in its own words" with a monospace bold intro, which looks inconsistent with the serif ledes elsewhere. The section is greyed out, which suggests it is secondary but still gets an H2 the same size as the rest. "How this page was made" is a paragraph-long run of code spans.
7. **Nesting** (bordered example → nested tan "before you look" card → button) makes the structure feel like boxes in boxes.

The page reads as a reference document assembled from parts, not as one flowing column. The top 15% reads like an article. The other 85% reads like documentation output.

## 5. Light, dark and phone

**Dark.** Well done. Contrast is fine, the accent coral is preserved, code blocks stay legible, the pill tabs invert properly, and diagrams are legible. Small issues:
- Edge-label grey in diagrams is dim (dark-02).
- The dark code blocks vanish into the dark page in dark-06, where the border and contrast between block and background are almost gone.
- "saved run" pills read fine.

**Phone.**
- The header at 390 px truncates the title to "The plan gui…" (all phone shots). The "Your notes" control disappears.
- The lede (phone-01) is set at a much larger size than the following body text, so it looks like a mismatch.
- **Diagram 03 is cropped** in phone-02 ("an explain… folder" cut off, label clipped).
- Diagram edge labels are ~9 px equivalent (phone-02, 03).
- The tiny video-frame screenshots are unreadable.
- The bold headline of the decision cards (phone-06, 07) is a 7 to 10 line wall.
- "Where the video pauses on it 2:10 Step 3…" wraps into a broken two-column layout inside the card (phone-07), with the label stacked beside its timestamp.
- Code spans wrap mid-token ("<plan-\ndir>"), which is hard to read.
- Body text is fine at ~16 px, and line lengths are comfortable.

**Light.** Nothing is broken. The main issue is the low contrast of small grey labels (edge labels, "How it works", "Made from…" captions).

## 6. Fixes

**The single biggest fix: cut the page down to one article and push reference material out of the main flow.**

Treat each step as one calm section: a short lead, one video still, one diagram that earns its place, and one worked example. Move all the rest ("What else was considered", "What breaks it", "Limits", "Files and commands", "What was built for it", "What the plan asked for", the 11 "Try it yourself" blocks, "The plan, in its own words", "How this page was made", the full code list) into a single "Reference" region behind one disclosure or a separate tab. Reduce the "In short" table to 3 to 4 lines (what was built, needs you, not done). That removes about 60% of the boxes and labels and lets the strong parts (the typography, the "You can now…" lines, the examples) carry the page.

**Next three:**

1. **Redraw or drop the diagrams.**
   - Delete the trivial ones: 04, 08, 12, 13, 14 and probably 02 and 11. Each shows 2 to 4 boxes and could be a sentence.
   - Fix the label overlaps in 03, 05, 10 and 11 by adding label backgrounds and lengthening edges.
   - Bump text to ≥12 px at 1000 px.
   - Fill the column width.
   - Cut sequence diagrams 07 and 09 to ≤5 lifelines so they survive a phone, and make 03 reflow at 390 px.
   - Replace "Step through it" with an actual control on the diagram.
2. **Rewrite the decision cards and the intro in plain words.**
   - Lead each card with a short, human title (one line) and put the mechanism and codes (A1, D-244, file names) in a smaller second line.
   - Explain each code once, or drop it from the body.
   - Say why the reader should care.
   - Also fix the lowercase lede, and define "guide", "part" and "plan-map" once.
3. **Make the timeline and the video stops legible and honest.**
   - Add a legend (round = choice, diamond = quick check).
   - Align dots with the list rows.
   - Add a play icon to video stills, and crop the stills to the part that matters so it can be read at column width.
   - Remove the empty half-frame cards.
   - Fix the phone header (keep the "Notes" control), and the wrapped "Where the video pauses on it" row.
