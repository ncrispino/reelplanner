# Answer on the video itself, and edit the record in place

## The problem

When the video stops at a question, a sheet slides up over the frame and asks it again: the frame
already shows the question and its options as cards, and the sheet repeats both in a smaller, busier
form, covering part of what it asks about. You answer in the sheet, not on the thing you are looking
at. And the record is only partly editable: a comment's words can be edited there, and a comment or
a mark removed, but changing an answer ("change") sends you back into the video to be asked again,
and a call's verdict, a mark's words and a quick check's note can't be changed from the list at all.

## What changes

Three changes, independent of each other. The first version of steps 1–4 is built (2918435); your
review of this plan asked for step 2 to be redone and for step 5.

1. **You answer on the frame** (steps 1 and 2). The option cards the frame draws are what you click;
   what the frame can't take goes in a band that is large enough to read, and the video keeps one
   size throughout.
2. **Questions keep pace with you** (step 5). A quick check waits long enough, takes you back to where
   its answer was explained, and a question you haven't answered stops the video again.
3. **The record is editable** (step 3). What it can't change yet, it can: an answer, a verdict, a
   mark's words, a quick check's note, where each is listed.

Step 4 checks them on the videos already on the review page.

## Steps

### Step 1 — Click an option on the frame to answer

*Independent.*

While a question waits, the frame's option cards are clickable: hover and keyboard focus light the
card, a click answers exactly as the A–D keys do (a pick-all question ticks the card and waits for
Confirm). The same for a quick check's options. The player already reads each frame's page (it
marks the chosen option there after an answer), so this is the player's work, not the frames': new
frames mark each card with `data-option="a"`, and older frames, which don't, are matched by the
order of their option cards. A frame with no cards to match keeps today's sheet.

### Step 2 — A band, not a sheet: large enough to read, and the video never resizes

*Needs step 1 (the cards answer, so the band no longer repeats them).*

The question and its options are no longer repeated over the frame. What is left is what the frame
cannot do: answer in your own words, "Explain this more", a note on your answer, Confirm for a
pick-all question, "Show the frame" to look without answering, and a call's Accept and Flag (with A
and B as now). The first version put these in a thin strip under the video (question 1, answered
A), and your review found it too small to read, and that the video shrank to make room for it and
grew back after. So the band is redone: type at reading size, the question's own words in it, clear
buttons rather than links, laid out to match the frame's look; and its room is kept for the whole
video, so nothing changes size when a question opens or closes. Where it sits is question 2.

### Step 3 — Edit the record where it is listed

*Independent.*

In the record, the items that can't be changed there yet get their own small edit: a decision's
answer is changed in place, without going back into the video (the video routes as a fresh answer
would); a call's verdict switched; a mark's words edited; a quick check's note edited. Editing a
comment's words and removing a comment or a mark already work, and stay as they are. A quick check's first
answer stays as it is. After a review is sent, any edit is offered as "Send the change", as a new
comment already is.

### Step 4 — Check it on the videos already there

*Needs steps 1–3 and 5.*

Every video on the review page is played through its questions with clicks only, in light and dark
and at phone width: the plan videos, the walkthroughs and the system video. The record edits are
checked in the export the Finish panel sends; the video's size is measured before, during and after
each question and must not change.

### Step 5 — Questions keep pace with you

*Independent.* Not in the video: this step came from the owner's review of the plan video (f98a21d), after it was
made.

Three things your review asked for:

- **A quick check waits longer.** After you answer, the video goes on by itself after 10 s, not 4 s,
  and never while the pointer or focus is on the band; Continue still goes at once.
- **"Back to where this was explained."** Every quick check has it: one click takes the video to the
  start of what the question tests (the first beat of its step, or a beat the storyboard names with
  `- explained_at:`), and the question waits there again when playback reaches it.
- **An unanswered question stops again.** A question you skipped past, folded away or never answered
  stops the video every time playback reaches it, until it is answered. (Answered ones come back
  answered and go on by themselves, as now.)

## Components touched

- **The review player** — clicking the frame's options, the thin strip, editing the record (steps 1–3)
- **The plan-to-video skill** — new frames mark their option cards (step 1)

## How each was decided

1. **Where do the answers the frame can't take go?** (step 2) Answered in your own words (D-108):
   the principle of A, not covering the video, but bigger; best if videos are designed so the band is
   larger and more graceful. Question 2 asks how.

## Open questions for the reviewer

2. **Where does the band sit?** (step 2)
- **A · Under the video, always there.** A band about an eighth of the video's height, under it for
  the whole video, empty until a question waits. Works for every video, old and new; the video is a
  little smaller all the time.
- **B · Inside the frame, in room the video leaves for it.** New videos keep their lowest eighth
  free of content (the style guide and the frame template say so), and the band appears there, over
  empty space, in the frame's own look. Larger and closer to what it's about, and the video keeps its
  full size; videos built before this get A.
- **C · Over the controls under the video.** The band takes the place of the play bar while a question
  waits (you can't scrub while answering anyway) and gives it back after. Nothing is reserved, but
  the controls disappear during a question.
I recommend B: it is what you described (the video designed for it), old videos still work through A,
and neither ever resizes the video.

## Decisions in force

- **D-004** A pick-all answer plays its summary frame. Unchanged.
- **D-021** A detail opens in a side panel. Unchanged.
- **D-081** After a rebuild, "Play just the changes" is on by default. Unchanged.
- **D-005** Rewinds and slow-downs are sent automatically. Unchanged.
- **D-024** Detail pages start from a template. Unchanged.
- **D-082** A run nobody is watching runs in auto mode, in the sandbox. Unchanged.
- **D-083** A quick check per step, plus where there is something to predict: step 1 lets you answer
  them on the frame.
- **D-084** Only the calls you might overturn stop: step 2 moves their Accept and Flag into the strip.
- **D-085** Less scaffolding: step 1 asks new frames for one attribute, nothing more.
- **D-108** Question 1: the band under or around the video, never over it, and bigger. Step 2.
- **D-106**, **D-107** Memory's home file and the retro's timing. Unchanged; not touched here.
- **Question 2** is built with its recommendation (B) at the owner's word ("we will just update the
  walkthrough once the code is updated"); it is on the record once the walkthrough is reviewed.

## Not in this plan

Answering by clicking a frame of the system video (it asks only quick checks, which step 1 covers).
Touch gestures beyond a tap.
