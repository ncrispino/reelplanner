# Details in the frame: click the thing a detail explains

## The problem

The owner, in the better-visuals walkthrough review:

> "we might want to work the detail pages more into the video so we dont just click a bar on the side, we
> instead click within the video kind of like we do for answering a question"

A detail is a page a scene opens for what the video cannot hold: the whole file, a table to sort, a
prototype to try (D-024: it starts from a template). Today you open it from outside the picture:

- **The Open chip.** While a scene has a detail, one chip sits in the stage's top-right corner: "Open · The
  data block and the slots · O". In the deep-dives walkthrough, scene 12 shows the real code, eight lines of
  `templates/details/table.html`; the detail is that file, whole, with the lines that carry the choice
  marked. The code is in the middle of the frame, and the way into it is a chip in the corner.
- **The plan text.** Each step's section ends with an "Open:" row naming its details.
- **The side panel** (D-021). Either one opens the page beside the paused video, 560 px wide on a
  1440 px window: the frame shrinks to the left, and the code gets less than half the width.

Answering already works the other way. Since the answer-in-the-frame plan, a question is answered on the
frame: each card carries `data-option`, the player lays a clear button over it, your pointer or focus rings
it in coral, "More" opens beside the card and never over the chips, and the lowest eighth of the frame is
kept for the answer bar. You click the thing you mean. A detail should open the same way: you click the code,
the table or the pinned word it explains.

## What changes

Three changes, in four steps.

1. **The frame says what each detail explains** (step 1): the scene's frame marks the thing
   (`data-detail="<name>"`), and the checks hold the marked thing to rules a click can rely on.
2. **The thing is the button** (steps 2 and 3): the player lays a clear button over it, as over an answer
   card; a click pauses the video and opens the page.
3. **The chip becomes the fallback** (step 4): a frame that marks its thing loses the corner chip; the
   plan text's list stays; older videos keep their chip until they are rebuilt.

Steps 2 and 3 need step 1's marked thing. Step 4 needs step 2.

## Steps

### Step 1 — The frame marks the thing a detail explains, and the checks hold it

*Independent.*

A scene with `- detail: <name>` in the storyboard marks, in its frame, the one thing the page explains, with
`data-detail="<name>"` on that element:

- **a real thing** (a `data-artifact` region): the code block, the table, the terminal run. In deep-dives
  scene 12 that is the eight-line block of `table.html`.
- **a part of it**: one code line, one table row, one file on a map.
- **a pinned word** (its `data-gloss` label with the token under it): in the better-visuals plan video, the
  label "said too early: a warning" on `early.push` could open the rule's whole table.

One marked thing per detail, the smallest that is still what the page is about. The storyboard's
`- detail:` tag stays the source of which details a scene has (`- detail_title:`, `- detail_why:`); the frame
only says where. The skill's tag table, the style guide's §10 and the frame template say so, with the three
examples above.

The checks, so the player can trust the marked thing:

- **`frame-lint`** fails a marked thing that reaches the lowest eighth (y ≥ 945, where the answer bar goes), a marked thing
  under 120 × 44 px at 1920 × 1080 (a tap target), and one that is still moving in its scene's last 3 s:
  it, or a camera it sits in, has to be at rest, at scale 1, by then, as a question's cards are. It notes a
  marked thing that overlaps a `data-option` card.
- **`check-details`** (the details check, run by `finish-project`) fails a scene whose frame marks a name the
  storyboard does not give it. A storyboard `- detail:` with no marked thing in its frame is a △ warning, and a
  failure on a storyboard that carries `details_check: strict` (every new storyboard does, as it carries
  `terms_check: strict`). Older storyboards pass as they are.

### Step 2 — The player makes the marked thing a button

*Needs step 1's marked thing.*

The player finds the marked thing in the scene's own composition, the way it finds the cards (by `data-detail`,
inside the frame's `data-composition-id`), and lays a clear button over its box in the same layer as the
cards' buttons: it moves with the picture when you zoom past Fit (D-182), and a mark tool that is on takes the
frame, as for the cards.

- **What it draws** (question 1). The ring is the cards' ring: coral under your pointer or focus (D-179: the
  thing under your pointer is yours). The tab reads "Open · <the detail's title>"; hovering it for a moment
  shows the `detail_why` line beside it, placed as a card's "More" is, never over a control.
- **When it is there.** From the moment the marked thing lands (its reveal ends) to the end of the scene, and again
  whenever the video is paused on that scene. While a question or a choice is asked, the frame belongs to the
  cards: the detail's button hides and comes back when the question is answered.
- **While a question is up, a click on the thing does nothing.** Take a quick check on scene 12, whose block
  is marked: while the check is asked, the block has no button, no tab and no ring, so clicking the block
  opens nothing and answers nothing (only the cards answer). Answer the check first; the button comes back
  and the same click then opens the page. O, meanwhile, still means your own words (D-046), not the detail.
- **Keyboard.** The button is in the tab order after the play controls; Enter or O opens it, as O opens the
  chip today. Focus draws the same ring as a pointer.
- **Never over what you answer with.** Its tab sits on the thing's top edge, inside the frame and above the
  lowest eighth; where that would cover a card's button or a chip, it goes inside the thing's top-left
  corner instead.

### Step 3 — A click pauses the video and opens the page

*Needs step 2.*

A click on the thing, Enter on it, or O pauses the video and opens the detail. Where the page opens is
question 2 (the side panel today, D-021). Whichever way:

- **The thing stays marked.** While the page is open, the thing you clicked keeps an ink ring, so the frame
  says what the page is about when you come back to it.
- **Closing goes back.** ×, Esc or O closes the page; the video goes on from where it paused if it was
  playing, and focus returns to the thing's button.
- **The page keeps what it has.** Comments inside a page (anchored to a line or a row) and, in a walkthrough,
  a choice's Accept and Flag in the page's footer, work as today.
- **The record says where you opened it.** Each detail opened is logged with `from: "frame"`, `"chip"` or
  `"list"`, beside its time open (D-005: opening a page is not a rewind), so a later plan can see which way
  reviewers use.
- **The narration names the thing.** The style guide's `detail_why` rule gains one line: the sentence says
  what to click, "click the block to read the whole file".

### Step 4 — The corner chip and the plan text's list; older videos and phones

*Needs step 2.*

What becomes of the corner chip is question 3. The plan text's "Open:" row under each step stays in every
case: it is how you reach a detail from the keyboard without playing to its scene, and how you find one again
later.

- **Older videos keep working.** A detail whose frame marks nothing keeps today's corner chip, unchanged,
  until its video is rebuilt with its thing marked. Nothing in an older plan map or review changes.
- **Phones.** On a narrow stage (the player's `data-size="narrow"`), a thing whose box is under 44 px tall on
  screen is not a button (it would be too small to tap); that scene shows the chip instead (unless question 3 takes C: then the
  plan text's list), and the page covers the video as it does today.

## Components touched

- **The review player** — the button on the marked thing, where the page opens, the chip as the fallback
  (steps 2–4)
- **finish-project** — the details check reads `data-detail` (step 1)
- **The plan-to-video skill** — `data-detail` in the tag table, the style guide's §10 and the frame template;
  `frame-lint`'s three rules (step 1)

## Open questions for the reviewer

1. **What shows that a thing on the frame opens a page?** (step 2)
Take deep-dives scene 12: the eight lines of `table.html`, and their page, the file whole.
- **A · A small tab on it, the whole time it can be clicked.** "Open · The data block and the slots" sits on
  the block's top edge from the moment the block lands; a pointer or focus rings the block. You see it
  without looking for it; costs a tab on every scene with a detail.
- **B · A ring once, then only on hover.** When the narration says what the page gives, the block is ringed
  for 2 s and the ring fades; after that, a pointer or focus brings the ring and the tab back. A clean frame;
  costs missing it if you looked away for those 2 s.
- **C · Only on hover or focus.** Nothing shows until the pointer is on the block. The cleanest frame; costs
  finding it by chance: a reviewer watching with their hands off never learns the block opens.
I recommend A: the tab is small and in ink, and a detail nobody knows is there is a detail nobody opens.

2. **Where does a detail open once you click the thing?** (step 3)
The same click on the block of scene 12, at a 1440 px window.
- **A · Beside the video, as today.** The side panel slides in (560 px); the frame shrinks to the left with
  the block ringed. You see what you clicked while you read; costs width: the file gets less than half.
- **B · Over the frame, grown from the thing.** The page grows out of the block to fill the video's box
  (about 1050 px), and shrinks back into it when you close it. The page gets twice the room, and it opens
  where you clicked; costs the frame while you read (one key brings it back).
- **C · A preview beside the thing, the page on request.** A card beside the block, like a card's "More",
  shows the page's first screen; "Open in full" opens the side panel. Quick looks stay small; costs a second
  click for anything you would use.
I recommend B: it is what "into the video" asks for, the video is paused anyway, and it gives the page the
room the side panel cannot. On a phone A and B are the same today: the page covers the video.

3. **What becomes of the Open chip in the corner?** (step 4)
Scene 12 again, rebuilt with its block marked.
- **A · It stays beside the new click.** The chip and the block both open the page. Nothing to relearn;
  costs two ways to do one thing on every scene with a detail.
- **B · It goes where the frame marks its thing.** The block is the way in; the chip stays only where a frame
  marks nothing (an older video, or a thing too small on a phone), and the plan text's list stays for the
  keyboard and for finding a detail later. One way in on each scene; costs the chip's O hint (O still works).
- **C · It goes on every rebuilt video, phones too.** A detail opens from its thing; a thing too small to tap
  on a phone opens from the plan text's list. The simplest frame; costs a phone reviewer a trip to the list,
  away from the video. Older videos keep their chip, as in A and B.
I recommend B: one way in on a new video, and nothing lost on an old one or on a phone.

## Decisions in force

- **D-024** A detail page starts from a template; untouched: this plan changes how you reach a page, not how
  it is made.
- **D-023** A walkthrough's detail opens on what judges a choice fastest: untouched.
- **D-143** The frame's cards are answered through clear buttons the player lays over them, placed from each
  card's box: the detail's button is built the same way (step 2).
- **D-179** Coral stays on the card under your pointer or focus: the marked thing's ring is that ring (step 2).
- **D-182**, **D-183** Zoom past Fit: the detail's button moves with the picture, as the cards' buttons do.
- **D-172** The pinned word is marked `data-gloss` on its token: a pinned word can carry `data-detail` too (step 1).
- **D-166** The brief picks which scenes show the real thing: the attribute goes on the real thing where there is
  one, on a part of a picture where there is not.
- **D-046**, **D-060** The detail's key is O: it still opens the scene's detail, from the frame or the chip; while a
  question is up, O still means your own words, and the detail's button hides (step 2).
- **D-052** A comment inside a detail is a note with where in the page it points: unchanged (step 3).
- **D-005** Rewinds and slow-downs are sent: opening a page is still not a rewind (step 3).
- **D-004** A pick-all answer plays one summary frame: a detail never replaces it.
- **D-127** Plain words on screen: the tab says "Open", the plan says scene and choice.
- **D-142**, **D-167** The accent colour and today's look: the ring and the tab use the tokens the player has.
- **D-083** A quick check per step: this plan's video keeps it.
- **D-085** Less scaffolding: one attribute and one front-matter line, no new stage.
- **D-129** Approving is never blocked: untouched.
- **D-084**, **D-109** What stops the walkthrough video: untouched.
- **D-110** A step's fifth choice is asked before going on: the build keeps it.
- **D-064**, **D-066**, **D-082** The loop's background agent, its one setting, auto mode in the sandbox:
  untouched.
- **D-106**, **D-107** Your memory's file and the retro: untouched; the record's new `from` is one more field
  a retro can read.
- **D-169**, **D-171** The case study's order and the merge rule for decision numbers: untouched.

## Supersedes

- **D-021** "Where does a detail open? Side panel." Question 2 asks it again. It was decided when a detail
  opened from a chip outside the picture, so a page beside the video kept the frame in view at the cost of
  width. The owner now asks for the details "more into the video", opened by a click on the frame, and a page
  that opens where you clicked is a real option it was not then. Keeping the side panel is option A.

## Not in this plan

Rebuilding older videos with their things marked (each gets them when it is next rebuilt). More than one detail on a scene
(still rare, still the last one opens). Details in the system video. A detail opened from a word in the
captions (the Terms panel already does that for a word's meaning).
