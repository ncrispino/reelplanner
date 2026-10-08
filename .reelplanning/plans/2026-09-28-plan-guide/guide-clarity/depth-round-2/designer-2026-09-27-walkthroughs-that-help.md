# Review of "Walkthroughs that help"

**Coverage note:** the folder has no `dark-*.png` and no `phone-*.png`, only `shot-01` to `shot-24` (light, 1000 px) and `diagram-01` to `diagram-09`. I looked at every one of those. Dark theme and phone are unjudged. Point 5 below covers only what can be inferred from the light shots.

## 1. Clarity

**What works.** The top is strong (shot-01). The title, the one-sentence summary, the "Not reviewed yet." status and the quoted user complaint set the scene well. The step cards open with a plain "You can now…" line, and that is a good habit.

**What breaks it.**
- **Too much preamble (shot-01/02).** Before "What you can do now" you get: the kicker, the title, a subtitle, a lead paragraph, a status line, a quote, "The problem", an "In short" box, a "Six words…Show them" line and a "Highlight anything…Open everything" line. That is about 1.5 screens before any content.
- **"In short" repeats the page.** It is a six-row table that restates the page in miniature: "What you can do now", "See it work", "Worth your look", "Needs you", "Not done", "Checked", "The code". Its bullets duplicate the seven step headings. Its "Not done" and "Checked" rows duplicate later sections word for word.
- **Truncation in the summary.** "as …" is cut off mid-sentence (shot-02, "Not done" row). Step 7's card in diagram-02 also ends in "…".
- **Text that reads as unfinished (a trust problem).**
  - "The problem: … The review records say what happens to it." says nothing.
  - "Step 7: not built, as this report says (D-003." is missing a closing parenthesis (shot-21).
  - "the check would have expected a fold the page rightly leaves out" is opaque to a reader.
  - The "What the plan and walkthrough don't say yet" box (shot-21) is a to-do list for the file authors. It sits in the reader's column and reads as internal debugging output.
  - The scratch bullet "Step 7 … is still waiting: Not done yet, and not this build's" (shot-20) is the same kind of leftover.
- **Jargon and IDs without explanation.** A2, A3, A8, D-023, D-109, "m", "shownAt", "judgedAt", "stopFor", "RECENT_PLANS", "group.spec" and "late fix" appear without explanation. The "A for a choice the plan left open, D for one that changed the plan" line (shot-17) arrives after the IDs are already in use.
- **Sections that don't say what they are for.**
  - "The decisions it was built on" (shot-23) is a list of collapsed questions with no reason to open them.
  - "The plan, in its own words" (shot-23/24) has its intro set in bold monospace and is greyed. It looks disabled next to the sections around it.
  - "Every note the builder made 25" and "How this page was made" (shot-24) are a large wall of provenance text. That paragraph (shot-24) is the densest on the page and helps nobody.
- **Repeated "Watch this moment" links.** They appear in each step and again in "Where the code is" and in the timeline, so one video moment gets three links.
- **Odd states shown as if normal.** "Replaced by a later answer: i dont like specifically saying 'five'…" (shot-23) shows raw user typing as a decision status. The list also shows "Five choices" as the count of noticed choices while the user said they dislike "five".

## 2. Diagrams

**Text size, contrast, overlaps, crossings**
- **diagram-01 (choice flow).**
  - Edge labels collide with the lines. "off-plan, visible, hard to undo, or like a late fix" has the curve running through "hard", "a late" and "fix". "close, or no label" is struck through by its curve. "flag any; Go on takes the rest" is overlapped by the arrow.
  - Labels are grey, about 12 px, on a light background. Contrast is low.
  - The flow itself is the right idea, but the layout is spoiled by the labels.
- **diagram-02 (step dependencies).**
  - Titles are cut with "…", so the three boxes in the middle are unreadable in full.
  - Edges cross: 1→7 runs under 5 and 4, and 2→4 and 1→4 converge.
  - It is decorative. "Needs" order could be a 7-line list that says the same thing more clearly.
  - The caption ("Made from each step's 'Needs step …' line in plan.md") talks about the source file, not the reader.
- **diagram-03 (what a scene shows).** The three edge labels overlap their own lines: "you would see it on a page", "it happens behind the page", "nothing runs for it". Worse, "it happens behind the page" sits over a different edge from the one it names. It is also not clear what "before and after" hangs off.
- **diagram-04 (does a choice pause).** This is the best one and the only real decision tree. It is readable and shows the mechanism. Its problems: the "yes"/"no" labels sit on top of their curves, the "yes"-branch labels lean off-centre, and the tree is lopsided (left boxes creeping right).
- **diagram-05 (quick check).** A clean sequence diagram, readable, and it shows a real order. Small overlap: dotted lifeline through the "the scene that sets it up" text at the wrap. The note "the answer is on screen…" floats left of both lifelines, so it belongs to nothing.
- **diagram-06 (small PR).** Two disconnected rows, and the "ticked, it needs the video" label is broken across a tight wrap. It says almost nothing. Nothing links the two rows, so it looks like two separate diagrams.
- **diagram-07 (Plan | Built switch).** Fine as a sequence, but the 3-lifeline setup with "You" first is odd. "You" sends "watching step 3" to plan video and then arrow 2 goes plan video → walkthrough, so it reads as if the video talks to the walkthrough. The floating note has the same issue as diagram-05.
- **diagram-08 (does it earn its place).** A vertical chain of five small boxes with lots of empty space to the right. The edge labels are wedged against the lines. "each verdict → judgedAt" is a stub that never joins the chain, so `judgedAt minus shownAt` is only implied. A dependency line is missing.
- **diagram-09 (code parts).** Twelve crossing/overlapping curves: 5 edges go through boxes or under boxes (e.g. "Pull requests" → "The calls that pause" runs behind "A check where there is…"). Direction is not clear. This diagram is the one most in need of removal or a rewrite as a list.

**Do they show how the thing works?** 04, 05 and 07 do. 01 does but is spoiled by label collisions. 02, 03, 06, 08 and 09 are mostly restatements of a sentence and mostly decorative.

**Column fit.** Diagrams are drawn at about 760 px inside a ~760 px column but sit centred with wide empty margins (shot-03, shot-12, shot-15). Text is small at that size (about 12–13 px for edge labels), so the labels are the first thing to fail when the column is narrower.

**Phone/dark.** Not provided. From the light versions: the wide horizontal diagrams (06, 09) and the labelled curves (01, 03) will get smaller than legible at 390 px, and grey edge labels will lose contrast in dark. Treat them as likely failures until proven otherwise.

**The video-frame stills (shot-05, 06, 08, 10, 14, 15)** are also diagrams of a sort and are the weakest pictures on the page: near-empty cards (shot-06 mostly blank beaige box with "pauses / visible / hard-to-undo"; shot-08 a big blank frame with a single black pill "a check: just before it runs"; shot-14 an empty beige rectangle; shot-15 sits under a header row with a blank band). They look like screenshots caught mid-animation and add nothing. The caption pills at the bottom ("labelled hard to undo…", "If 3 walkthroughs in a row are each answered in under 5 seconds,") are cut mid-sentence.

## 3. Interaction

- **"Step through it" + "six stages" (shots 3, 5, 7, 9–11, 13, 15).** It is a small outlined pill with a ▶ under each diagram. It looks like a button and the stage count is a helpful hint. But it sits below the diagram, far from where the eye ends, and it is the same weight as every other outlined pill on the page, so it does not invite use. It appears under all six diagrams, so it stops being special. "The diagram in words" sits right under it and looks the same, and the two together read as one row of controls.
- **Tabs for worked examples (shot-07, 11).** "This plan's own choices, today | A later plan's choices" and "Two other choices, not yet accepted | Accepted, as CI checks" look like tabs: black selected pill, outlined unselected. Good. But the labels are long and full of jargon, so they do not say what the choice is between.
- **"Before / After" toggle (shot-07).** A tiny segmented control (~50 px wide) with "After" apparently selected, sitting in the middle of the paragraph with no lead-in. It is easy to miss and looks like a label, not a control. The text under it ("today: A2, A4 and A7 pause…") is not obviously the "After" state.
- **"Show what it really printed" / "Show the real output" (shot-07, 12, 13).** Rendered as outlined buttons inside a tinted "BEFORE YOU LOOK" box that asks a question first. This is the best interaction on the page: prediction, then reveal. But the box uses a lot of vertical space and repeats "Before you look" in each case.
- **Disclosures.** "More on this step", "What was built for it", "What the plan asked for", "What it printed", "The diagram in words", "See the code", "The ten commits", "What it chose instead of, in full", "The other five choices", plan sections, "What it found", "What was tested", "Earlier decisions it keeps", "Every note the builder made": there are about 40 disclosure rows. They all look alike (small chevron + bold text). None tells you what is inside beyond the grey subtitle, and none stands out from the rest. This is the biggest interaction problem: a reader can't tell which ones are important.
- **Timeline of video stops (shot-19).** A rail with diamonds and circles, a legend (quick check / the list / a last question) and a list below. It looks like a scrubber, which invites clicking, but it is not obviously clickable. The four markers are close to the same colour and size. The rail shows a 2:55 length but the markers at 0:24 and 2:03 are diamonds while the legend shapes are tiny and grey. Each row then repeats "Watch it 0:24 Quick check: which pauses", so the time appears three times per row.
- **Inline "Watch this moment ▶ 0:10 …" (shots 5, 6, 8, 10, 12, 14).** Underlined link in small text under each frame. It is a good idea but looks like a caption, not an action. Since the frame above it is an inert image, people will click the picture and get nothing.
- **"Copy" buttons (shot-07, 11, 15, 16).** Clear and well styled.
- **"saved run · It finished without an error." pills (shot-15, 16).** A green outlined badge repeated six times. It carries no news: they all say the same thing.

## 4. Calm and flowing

The text column itself is calm: serif headings, generous leading, a single reading width and quiet colour. Section rhythm on the main path (kicker → title → one-line promise → picture → "How it works" → "Why it works this way" → "More on this step") is consistent and good.

Where it stops being a calm article:
- **Every step has the same nine parts** (kicker, heading, bold promise, prose, video frame, watch link, "How it works" label, diagram title, diagram, step button, "diagram in words", worked example, "Why", "More"). The small grey subheads ("How it works", "Why it works this way") plus a bold diagram title add up to three headings per diagram. Step 1 to step 6 look the same, so the page feels like a form.
- **Boxes inside boxes.** Video frame (large rounded card with a mono label and a pill), quoted worked-example rail with a black code block, a tinted "BEFORE YOU LOOK" card inside it, an outlined button inside that, a dashed "What the plan doesn't say" box, a tinted "In short" panel. Six kinds of container, with different radii, fills and rules.
- **The middle of the page (shots 12–16 to 22)** turns into a reference manual: seven commands with code blocks, then five near-identical "YOU'LL NOTICE IT" cards (each labelled "YOU'LL NOTICE IT" identically), then "Where the code is" with six repeated headings and "+1196 −168" counts.
- **Label overload.** Small all-caps labels (STEP 1 · BUILT, INPUT, WHAT HAPPENS, EDGE CASES, BEFORE YOU LOOK, YOU'LL NOTICE IT, GUIDE), monospace tags, "step 4" pills inside bullets, "A3 · in askList, listRows in packages/player/reelplanning-player.js; package…" (truncated path), "In the code:" chip rows. Every choice card carries a Because/Step/In the code/What it chose instead of stack.
- **Repeated content.** The step list appears in "In short", again in "What you can do now" as headings, again in the dependencies diagram, again in "Try it yourself", again in "Where the code is", and again in "The decisions". The same five choices appear in "Worth your look", in "What the agent decided on its own", in the timeline and in "What needs you".
- **Order.** "Try it yourself" (seven commands) sits before "What the agent decided on its own", "What needs you" and "What isn't done". The thing the reader has to act on (review it) comes after 15 screens. "What needs you" should be near the top, given the "Not reviewed yet" status.
- **Tail.** "Where the code is", "The decisions it was built on", "The plan, in its own words" and "How this page was made" are reference, and they carry the same visual weight as the content above. The grey "The plan, in its own words" heading is even dimmer than the rest, which looks disabled.

## 5. Light, dark, phone

No dark or phone pictures were supplied, so this is what the light shots imply, and it needs checking:
- **Fixed sticky header (all shots).** "GUIDE | Walkthroughs that help | Your notes · 0 | Open everything | Back to the video". At 390 px this row will not fit. "Open everything" also appears twice (top bar and shot-02 near "Highlight anything").
- **Video-frame stills** have hard-coded 1000-px-wide layouts with mono labels (~10 px, e.g. "step 2 · what pauses the video", "the review page's header, 1440 wide · before and after") that will drop to unreadable on a phone. The step-5 before/after screenshot (shot-11 area) already shows text under 8 px at 1000 wide.
- **Code blocks** already wrap awkwardly at 1000 px (shot-15/16: `$ reel pr-check … # the same, a maintainer ticked…` wraps its comment under the command and hides the Copy target).
- **Diagram 09** with 5 crossing curves and 06 with a long horizontal chain will need to shrink to about 50% and become illegible.
- **Truncated paths** ("in packages/player/reelplanning-player.js; package…", shot-17/18) will clip further.
- **Dark:** the beige tinted panels, the grey edge labels and the light-on-dark video pills are all colour-tuned for light, so expect low-contrast grey labels on diagrams and possibly invisible dotted underlines.
- **Light-only issues that already show:** the dotted-underline glossary terms are very faint; the timeline circles and diamonds (shot-19) are grey-on-grey.

## 6. The single biggest fix and the next three

**Biggest fix: cut the page down to one reading path and push all reference material behind a single door.** Right now the reader meets about 40 disclosures, repeated lists, six kinds of box and a diagram under every heading, so nothing is the point. Concretely:
1. Delete "In short" (or make it the only summary and drop the other repeats: the step diagram, the "Where the code is" heading list).
2. Move "What needs you" and the video-stops timeline to directly under the lead paragraph, since the page's job is to get the reader to review.
3. Keep, per step, only: heading, one-sentence promise, one figure (only if it explains something), one short paragraph of why, and one example with its "Show output". Fold "Watch this moment", "More on this step", "What was built for it", "What the plan asked for" and "See the code" into a single "Details" disclosure per step.
4. Put "Try it yourself", "What the agent decided", "Where the code is", "The decisions", "The plan, in its own words", "Every note" and "How this page was made" under one "Reference" heading at the end, collapsed.

**Next three**
1. **Fix or remove the diagrams.**
   - Redraw diagram-01 with labels on clear space (or move the label into the boxes).
   - Delete diagram-02 and diagram-09 (replace with a two-line list).
   - Keep 04, 05 and 07, and add a real `judgedAt` join to 08.
   - Remove 03 and 06, or make them into one sentence.
   - Raise edge-label text to at least 14 px with a background halo, and confirm all of them at 390 px and in dark.
2. **Replace the video-frame stills** (shots 5, 6, 8, 10, 14, 15) with real captured frames that show the result, and make the frame itself the play button (with the time on it), instead of a separate "Watch this moment" caption. If a frame is empty, drop it.
3. **Clean up the copy that reads as unfinished:**
   - Truncated sentences ("as …", "…", "package…", "and the worked …").
   - The "(D-003." typo.
   - "Replaced by a later answer: i dont like…" shown raw.
   - The "What the plan and walkthrough don't say yet" to-do box: it belongs to the builder, not the reader.
   - Explain A/D/m IDs once at first use, or drop them from prose.
   - Repeated "saved run · It finished without an error."

Also confirm phone and dark once those renders exist; the header row, the frame-still text, the code-block wrapping and the grey diagram labels are the first things I would expect to break.
