# Answer in the frame

## The problem

A direct ask from the owner, built without a plan video (the owner asked for the change itself):

> "on the cards i do want to be able to click somewhere on them or hover over them to see more details.
> bc sometimes the answers arent explained fully. same with the question, option to see more thorough
> question."

> "the main thing about wondering whats going on why we have a bar below the main video screen with the
> place to see more about the question, and to give the text answers, cant we do more gracefully like
> embed in the video itself just like how we click directly in it?"

Today the reviewer clicks a card on the frame to answer, but everything else happens in a bar under the
frame (or in the frame's lowest eighth): the question again, your own words, a note, "Explain this more",
the quick check's feedback, Continue, "Back to where this was explained", "Walk me through it". The eye
goes from the card to the bar and back. And a card holds a short label: there is no way to read more on
an option, or the question in full, without leaving the frame.

Also built here, because this plan owns the player's words: D-127's plain words on screen (choice for
call, label for tag, chapter for part, scene for beat, and the rest), and what the videos-you-can-follow
plan needs from the player (a word in the captions can be clicked, where it is explained, what was
looked up and watched is sent).

## What changes

Three changes; the second and third stand alone, the first is the main one.

1. **You answer where you look** (step 1): on a frame that has its cards, everything happens on the frame,
   by the cards; no bar under or over the video.
2. **More on every card and on the question** (step 2): hover, or a small "More", opens the fuller words.
3. **The words say what they mean** (step 3): plain words on screen, and a word can be clicked where it is said.

## Steps

### Step 1 — Answer on the frame, by its cards

*Independent.*

Where the frame has a card for each option (`data-option`), or a card for each of the agent's choices
(`data-call`), and is large enough to write on (not a phone), the question is answered on the frame:

- The frame asks the question; the player does not ask it again.
- Your own words are a dashed, card-like slot the player draws beside the cards (or under them where the
  frame has no room beside); opened, it holds the box.
- A quick check's answer is on the cards: yours and the right one marked, each card's why under it
  (`- option_a_why:`, the right card's falling back on `explain`), "Expected something else?" on the card
  you picked. Where the frame has no room under the cards, the why goes inside the card under its words,
  or the chips flow into the columns the whys leave free; past all that, each card keeps its verdict and
  "Read why in full" opens the side panel. Nothing is cut.
- Continue, "Back to where this was explained", "Walk me through it", "Explain this more", a note and
  Confirm are small chips under the cards, in the frame's reserved lowest eighth where it keeps one.
  "Show the frame" sits in the frame's top-right corner, and folds the question to a pill there.
- A stop scene: each choice's Accept, Flag and own words hang from its own card; a verdict rings the card.
  The rest in one list: each Flag on its card, Accept all among the chips.
- A frame without cards keeps the answer bar (a phone keeps it under the frame); it still never cuts text.
  The video never changes size.

### Step 2 — More on each card, and the question in full

*Independent.*

Hovering a card a moment, or its "More", opens a popover by the card with the fuller words; the click on
the card itself still answers. The heading's "Full question" (and a hover on the heading) shows the
question as the plan map has it. The words come from new storyboard tags, `- question_more:`,
`- option_a_more:` … and, for a quick check after it is answered, `- option_a_why:` …; before an answer
a quick check's "More" never gives the answer away. `plan-map` carries them; older videos fall back on a
choice's `why` and a quick check's `explain`. Frames mark the heading `data-question`.

### Step 3 — Plain words on screen, and a word you can click

*Needs the videos-you-can-follow plan's glossary (`display`, `definedIn`).*

The player's own text says choice, label, chapter, scene, off-plan change, the rest in one list (D-127),
from the glossary's on-screen word where it has one, else a table in the player. A glossary word in the
captions is underlined; a click pauses the video and shows what it means by the word, with where it is
explained and a link that plays that scene (`?t=`). The review sends the words looked up and what this
browser has watched; with every video on the card watched, the video starts without the newcomer scenes.

## Components touched

- **The review player** — the answer on the frame, "More", plain words, clickable words (steps 1–3)
- **finish-project** — the plan map carries `question_more`, `option_x_more`, `option_x_why` (step 2)
- **The plan-to-video skill** — frames mark `data-question` and `data-call`; storyboards write the new tags; the style guide's §6–§8 and §11, the frame template (steps 1 and 2)

## Decisions in force

- **D-127** Plain words on screen; the files keep theirs. Built in the player (step 3).
- **D-128** "Watched" is kept in this browser and, when a review is sent, in your file: the review now carries `watched` (step 3).
- **D-129** Approving is never blocked: unchanged, the guard stays a quiet note.
- **D-083** A quick check per step: unchanged; its answer now shows on its cards.
- **D-021** A detail, and "Read why in full", open in the side panel. Unchanged.
- **D-005** Rewinds and slow-downs are sent: "Back to where this was explained" is still a rewind.
- **D-004** A pick-all answer plays its summary frame: its Confirm is a chip on the frame.
- **D-001** The code check is a second agent. Unchanged.
- **D-024** Detail pages start from a template; **D-085** the scaffolding: untouched.
- **D-064**, **D-066**, **D-082** The loop's background agent, the one setting, auto mode in the sandbox: untouched.
- **D-084**, **D-109** What stops (the labels and your record; a late fix with no label stops nothing): untouched; the player only shows the scenes that stop.
- **D-106**, **D-107** Your memory's file and the retro: untouched; the review now also sends the words looked up and what was watched, which `reel record` reads (the videos-you-can-follow plan).
- **D-110** A step's fifth choice is asked before going on: this build kept to it (no step reached five).

## Supersedes

- **D-108** "The principle of A, not messing with the video, but bigger … more graceful in the video": the
  bar is gone for frames that have their cards. The owner's words above ask for the answer embedded in the
  video, as the click on a card already is; the bar stays only for frames without cards, and on a phone.
