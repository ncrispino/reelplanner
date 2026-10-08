# Design review: "Several people, one repo"

**Scope.** The folder held `shot-01…23` and `diagram-01` only. There were no `dark-*` or `phone-*` images, and only one close-up diagram (the nine-stage pull-request flow). I judged the other diagrams from the in-page shots, and I can't judge dark theme or phone at all. Section 5 is limited to what I could see.

## 1. Clarity

**What works**
- The top is strong (shot-01/02):
  - The serif title, the one-sentence summary and "Not reviewed yet." in red, followed by the quoted request.
  - The "In short" panel.
- Each step opens with an "You can now…" line, then the picture, then "How it works". That order is right.

**What doesn't**
- **The top is long.**
  - The "In short" panel (shots 1–2) has six rows: What you can do now, See it work, Worth your look, Needs you, Not done, Checked, The code.
  - It repeats what the sections below say. "Needs you" and "Not done" appear again in full near the end (shots 18–19).
  - A reader hits about 1.5 screens of summary before the first real section.
- **"See it work" leads with a raw command.** `reel pr-check . --base origin/main --body-file ../pr.md --labels ""` sits in the summary before any explanation. A command is not a benefit.
- **The "Not done" row shows a fragment:** "Who owner is, once a second person reviews". It reads as broken. The section under "What isn't done" says the question has since been answered in code (Step 2 note, shot-07), so the summary is now out of date too.
- **The "Not done" list mixes different things:** a fact ("CI has never run"), a chore for the owner, and an open design question. They should be split.
- **Machine-generated phrasing leaks through:**
  - "Step 3 · *Stands alone; its checks run in CI with step 5" with a stray asterisk (shot-08).
  - "the full suite once it is ready to merge ." with a space before the full stop (shot-16).
  - "The plan said …test.yml, as the plan names it."
  - Step 1's third paragraph begins "reelplanning ships two templates…" with no lead-in.
  - Step 3's worked example: "the port branch now carries its walkthrough video's text. Its plan map carries the plan it was built from, and that plan is plan.md as it is" (shot-09). It reads as rambling.
  - The "Try it yourself" row for `npm run test:full` ends mid-sentence with "runs this …" (shot-15).
  - Step 5's pull-quote reads `"maybe a merge requires full suite ... so we know it doesnt break": yes.` It is unattributed and looks unfinished.
- **The tags "A2", "D1", "A3" and the letters in "Step 1 · A2 · in scripts/pr-check.mjs (…)" are unexplained until you reach the paragraph above them.** That paragraph is dense (shot-19).
- **Section order.** "The decisions it was built on", "The plan in its own words" and "How this page was made" trail after "Where the code is". There are seven or more H2s after the useful content ends.

## 2. Diagrams

**Flow diagram** (`diagram-01`, shot-03)
- Text is legible and contrast is fine. It shows the real mechanism: a pull request, the check, a fork on size, a maintainer's review, then merge.
- It is good.
- Problems:
  - A tall, thin, centred column in a 760 px area, so it wastes width and pushes the "Step through it" button below the fold.
  - Labels sit against curved edges and are hard to tie to an arrow. "only this one counts" is offset from its edge.
  - The dashed no-video branch and the "a maintainer adds no-video" label crowd each other.
  - The underlined node names (`reel pr-check`, `needs a video`) look like links but aren't obviously links.
  - The top "contributor" pill and the arrows are very light against the page.

**"Is a pull request over the line?"** (shots 4–5)
- The diagram is split across two screenshots, but that is probably just the screenshot cut.
- The edges cross and tangle: "ticked, naming the choice", "added by a maintainer" and "over 300 lines of code" all bend into "over the line".
- The "a new flag, command or dependency" label sits on a dashed line that runs through it.
- The labels overlap edge curves. It is the most cluttered diagram on the page.

**"A walkthrough review, recorded"** (shot-06)
- Small, and the edge labels ("a maintainer: accepted choices join it", "anyone else: filed, nothing joins") overlap the edge curves.
- The text right-aligned against the node collides with the arrowhead ("it" is stuck on the edge).
- At about 50 px tall it is barely a diagram. A two-row sentence would do.

**"What a merged PR leaves on main"** (shot-07)
- Two nodes and two edges; the label "a contributor's reviews" straddles both edges.
- It is decoration, not explanation. Cut it or fold it into prose.

**Sequence diagrams** (steps 3 and 4, shots 8–9 and 11–12)
- The concept is right. The gray note boxes (e.g. "the same hash: its plan map matches; else built from another version: rebuild it") sit on the lifeline and are narrow, so text wraps into 5 lines.
- The lifelines are faint.
- The red ✕ on "D-001 names another entry on main" is a nice touch.
- The note "frames that still say the old id are listed, not changed" floats in the empty right-hand area.
- Labels wrap to two or three lines because the text is centred over long arrows.
- Readable, but the diagram spans two screens (shot-11 shows the bottom half).

**Step 5 job diagram** (shots 13–14)
- The dashed and solid edges from "a PR push" cross ("npm test", "only with ready-to-merge", "npm test" overlap each other in shot-13).
- The "npm test" labels collide.
- This is the worst crossing on the page.

**Scene "pictures" in each step** (shots 4, 6, 8, 10, 13)
- These are the video stills in a big card. Each is 60% empty, with a caption pill at the bottom and a black terminal block floating in the top-left.
- The step 3 card is mostly blank: `$ git clone`, `$`, then a small pill. It gives no information and looks like an unfinished frame.
- Step 2's terminal only fills the top third of the card.
- They are the biggest chunks of wasted space and don't teach much.

**Phone and dark:** not available to judge. The sequence diagrams have four to five columns at about 130 px each and small labels. At 390 px they would scale down to roughly 40% and become illegible unless they scroll or reflow. Given what I can see, I would expect that to fail.

## 3. Interaction

- **"Step through it · N stages" and "In words"** look like buttons, which is good. The pill with a ▶ is clear.
  - But "In words" and "Which step needs which" are plain chevrons, so they read as low-priority.
  - There is no hint of what happens when you step: does the diagram animate or highlight? The 9-stage flow has no visible focus state in these shots.
  - Every diagram ends with the same row, so it repeats five times and becomes noise.
- **Worked-example tabs** (shots 5, 7, 9, 11) are the best interaction. Pills are clear, the active one is inverted, and INPUT → WHAT HAPPENS → WHAT IT PRINTED is a clear structure. The terminal blocks look good and the Copy buttons are useful.
  - Weakness: "The same PR, its box ticked" sits right next to the first tab, and nothing says these are alternatives to compare.
  - Step 2's "BEFORE YOU LOOK … Show what it really printed" is a good prediction prompt. It is the one before/after-style toggle I could see and it looks like a button. Good.
- **"Watch this moment 0:16 …"** is a small underlined link with a ▶ glyph and a timestamp. It looks like text, not a play button. The card above it is the obvious thing to click, but nothing shows that.
- **The video-stops timeline** (shot-20) looks like what it is:
  - Rings for pauses, diamonds for quick checks, and a legend.
  - However: the rings are orange-red and the diamonds gray, and the legend is tiny.
  - Markers 3 and 4 collide (the ring at 2:36 next to the diamond at 2:28).
  - The list under it is eight near-identical rows: "A quick check: you predict, then it shows you" ×5. The repeated phrase is noise. Give each a title ("Sam's own review") first.
  - The row also repeats the time three times: "1:04", "Watch it 1:04", "1:04 Step 1…".
- **"Show them" for six glossary words** (shot-02) is a small line of grey text, easy to miss and unexplained. It is fine if the dotted underline is enough.
- **"Highlight anything to leave a note" and "Open everything"** appear twice. "Open everything" in the top bar is ambiguous: opens what?
- **Disclosure chevrons:** "More on this step", "What it printed", "What was built for it", "What the plan asked for", "Its full wording", "What it chose instead of, in full", "See the code". There are dozens of them (the list is about 40 across the page), and they are the same weight everywhere. They are calm individually, but as a mass they read as a legal document.

## 4. Calm and flowing

**Good**
- Serif headings with generous space, a narrow text column, and a warm off-white palette. It reads like a long-form essay at the top.
- H2 sections have plenty of air (shots 2, 15, 18).

**Where the rhythm breaks**
- **Each step has the same 8 layers:** eyebrow, H2, sentence, prose, large video card, watch link, "How it works" + title + diagram + two buttons, worked example, more-on-this-step. The same pattern five times makes the middle of the page a repeating stack. Each step is about 3 screens for a small idea.
- **Box types:** grey summary panel, left-rule quote, left-rule worked example, dark terminal, video card with a shadow, tinted "Before you look" box, dashed "what the plan doesn't say" box, a pill, and a badge. That is too many enclosure styles.
- **Small-caps labels** are everywhere: WHAT WAS BUILT, STEP 1 · BUILT, INPUT, WHAT HAPPENS, WHAT IT PRINTED, BEFORE YOU LOOK, CHANGED FROM THE PLAN, YOU'LL NOTICE IT, plus bold grey mini-headings ("How it works", "Worked examples: three cases, each with what it really printed"). The labels outnumber the content in the decisions section.
- **"What the agent decided on its own"** (shot-16): each choice has 5 lines of metadata (label, title, "The plan said", "Because", "Step 5 · D1 · in …", "In the code: ci.yml", "Its full wording"). The reader has to hunt for the decision. The "Because" is the useful part. The path lines are clutter.
- **"Try it yourself" repeats the worked examples** almost verbatim (shots 15–17: the same `reel pr-check` commands, the same run output). It is 3 screens of duplicate content. Fold it into the step examples or cut it.
- **Long command captions:** long comments in the dark blocks wrap awkwardly (the `# a scratch repo:` text wraps under the command in shots 15–17). Move the comment above the block.
- **"Where the code is"** is a list of eight groups with +/- numbers. Fine, but heavy on the same "N files · step N · In the video 0:16 Step 1: …" line with three separators.

## 5. Light, dark, phone

- **Light:** clean at 1000 px. No overlaps in text. The header bar is readable, though it is busy: "GUIDE | title | Your notes · 0 | Open everything | Back to the video". "Your notes · 0" with a tiny "0" is fussy.
- **Cut off / cramped in light:**
  - Diagrams' label overlaps (step 1, step 5).
  - The big step cards leave empty areas.
  - In shot-16 the dark code block runs past the column with 80-column wraps (`"reopened"]'), github.event.action)` wraps mid-token).
  - The `-- ` separators from `grep -A2` print as noise.
- **Dark:** no dark shots supplied. The dark terminal blocks already dominate the light page, so in dark they will lose their contrast against the page unless given a border. The diagram lines are grey-on-cream now and are likely to need remapping. **I can't verify either.**
- **Phone:** no phone shots. Risks I can infer: the "In short" two-column table (label column plus bullets) needs stacking; sequence diagrams with five lanes; the four-tab worked-example row; the video card with a side-by-side terminal; and the timeline with 8 markers. Each needs a phone check.

## 6. The fixes

**Biggest fix: cut the repeated structure and shrink each step to "one sentence, one picture, one example."**
- Drop the big video-still card in every step (or shrink it to a thumbnail with a play button). Most are mostly empty and duplicate the video.
- Keep exactly one diagram per step, and make it a horizontal, self-sufficient one. Move all others ("What a merged PR leaves on main", "A walkthrough review, recorded") into a sentence.
- Fold "Try it yourself" into the worked examples. Cut "Step through it / In words / More on this step" down to a single "Details" disclosure per step.
- That would take the page from about 23 screens to about 14 and give the calm long-read the top of the page promises.

**Next three**
1. **Fix the diagrams' layout.**
   - Remove edge crossings and label collisions. Steps 1 and 5 need re-routing; use straight orthogonal edges with labels on their own line.
   - Make the sequence diagrams reflow on narrow widths, or draw them as a numbered list on phone.
   - Add borders so the dark theme doesn't wash them out, and check all of them at 390 px.
2. **Shorten the top.** Cut "In short" to three or four lines of outcomes, with "Needs you" as the single call to action (and one link to the video). Remove "Not done" and "Checked" from the summary, and update the stale owner question.
3. **Restructure the decisions and the timeline.**
   - Make each decision one paragraph: the choice in bold, then "Because …", and hide the path, ID and "in the code" under a single link.
   - Give the timeline rows real titles instead of "A quick check: you predict…", show the time once, and make "Watch" a play button.
4. *(Bonus polish)* Proofread the generated text: the stray `*`, "merge .", "runs this …", the unattributed quote, "as the plan names it", and the awkward Step 3 sentence. Reduce the small-caps labels to a single style.
