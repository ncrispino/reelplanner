# The review page is a video player wearing a dashboard

## The problem, from its own screenshots

The page exists so one busy reviewer can watch a plan and make two or three calls. Measured against
that, three things are wrong, and none of them are matters of taste.

1. **The decision sheet crops the video it is asking about.** When "Where does the manifest live?"
   opens, the frame behind it is sliced through the middle: `Blob store` and `Sweeper` are cut in
   half. The reviewer is asked to choose between two stores while the picture of where stores live
   is truncated.
2. **The video is the smallest thing on the page.** At 1440 wide it gets a 1040 px column and then
   roughly four hundred pixels of empty space below it, while a fixed 320 px rail stacks four lists
   of equal visual weight — steps, knowledge level, decisions, comments. On a phone it is worse: the
   video is an unreadable strip at about 15% of the page and the remaining 85% is chrome.
3. **The same thing is asked in two places.** While the sheet asks the decision, the rail also lists
   it as "Not yet · watch". Two homes for one question, and neither is obviously the real one.

Two smaller ones follow from the same cause: the status line is six facts in one sentence
("Waiting at 0:55 for choice 1 · step 1 · part 1 of 3 · 2 marks, 0 of 3 decided, not yet approved"),
and commenting — the thing we most want a reviewer to do — sits below three other sections.

## Steps

### Step 1 — Give the video the page

One column, video first, at the width the viewport allows. The rail stops being a fixed 320 px
sibling competing for width.

### Step 2 — Never crop the frame a decision is about

Resolved (D-001): the sheet overlays the lower third at full size, and folds away on request so the
reviewer can see the frame underneath, then reopen it. This answers the reviewer's own worry about
the recommended option — the stage shrinking — without giving up the full-size picture as the
default: folding is the escape hatch, not a smaller frame all the time.

### Step 3 — One home per question

A decision is asked in exactly one place; the rail records what was answered, not what is being
asked.

### Step 4 — Comment where attention already is

The composer sits with the video, not three sections below it.

### Step 5 — One fact per line

The status line says what is happening now; everything else moves to where it belongs.

### Step 6 — On a phone, the video is the page

Everything else collapses behind it.

## Components touched

- **The video** — the region the page exists for
- **The question** — the decision sheet
- **The rail** — steps, level, decisions, comments
- **Comments** — the composer
- **Status** — the line under the transport

## Decisions in force

- **D-001** — when a decision is asked, the sheet overlays the lower third, with a fold (step 2)
- **D-002** — comments live under the video, in the main column, the recommended option (step 4)
- **D-003** — on a phone, the rail becomes one sheet you pull up, the recommended option (step 6)

## How each was decided

Every open question this plan asked is now answered; kept here as the record of what the
alternatives were and why one was picked over another, not as something still to decide.

1. **When a decision is asked, what happens to the video?** — **Resolved: B, with a fold (D-001).**
   The reviewer's own words: "We can do an overlay but easily collapse the question and then re
   open. Concerned whole stage shrinking bc then might be too small to view."
- **A · The stage shrinks.** The whole frame stays visible above the sheet, smaller. Nothing is ever
  cropped, and the cost is a smaller picture at exactly the moment you are studying it.
- **B · The sheet overlays the lower third — chosen, with a fold.** The video keeps its size and the
  sheet floats over the bottom of it, and folds away on request so the frame underneath is never
  permanently covered. Full-size picture, and the caption-band cost is temporary, not standing.
- **C · The video steps aside.** It pauses and the sheet takes the column. Clearest reading of the
  question, and you lose the picture you are deciding about.
Originally recommended A. The reviewer's own answer chose B instead, on the condition that its one
cost folds away — see Step 2.

2. **Where do comments live?** — **Resolved: A, the recommended option (D-002).**
- **A · Under the video, in the main column — chosen.** Always in view while watching; pushes the
  video up and competes with the toolbar for the space directly under the frame.
- **B · In the rail, at the top.** Keeps the main column clean and puts comments beside the video
  rather than under it; on a narrow screen the rail is below the fold again.
Recommended A: a comment is about the moment on screen, so it belongs next to the moment.

3. **On a phone, what happens to the rail?** — **Resolved: A, the recommended option (D-003).**
- **A · One sheet — chosen.** Steps, decisions and comments become a single sheet you pull up over
  the video.
- **B · Tabs.** The three lists become tabs under the video, one visible at a time.
Recommended A: a phone reviewer is watching, not browsing, and a sheet keeps the video uncovered
until they ask for something else.

## Not in this plan

The palette, the type and the annotation tools are settled and are not reopened here. This plan is
about where things sit and how much room the video gets.
