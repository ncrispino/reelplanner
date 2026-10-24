# Scenes: start a frame from one that works

A frame drawn from a blank page tends to come out as cards of words: the bakery bench's low-depth runs drew
most of their scenes as a heading over a row of boxes. The videos that showed the most drew something
else: the Dylan plan video (`videos/g1-bob-dylan-site`) drew its choices as two futures of the same album list
and its steps as one page growing; a long explainer on a research project drew a count narrowing, one log
row labelled field by field, its actors as lanes over time, a field of tens of thousands with a few dozen
marked, a sentence check with its tally, an agent's own words at size. These scenes are those, rebuilt in the theme's tokens and motion
language so a plan video can start from them.

Each is a whole scene: it passes `frame-lint` as it ships (visuals spec), moves by `../motion-language.md`, keeps
coral to its one moment, and carries a worked example from the Dylan plan (`eval/plans/bob-dylan-site/plan.md`),
so you can see it working before your plan goes in. Its header says what it is for, how many things fit, and how
it moves.

| scene | use it when the beat is about… | it shows | its verbs |
|---|---|---|---|
| `count.html` | how many, and how much of them the step means | the figure, the whole as a field of cells, the part filled, the rest dimmed with what it costs | counted, filled, dimmed |
| `anatomy.html` | the record, file, form, URL or command the plan keeps coming back to | the thing whole, each part named on its own row, then the camera on the part that matters | printed, pinned, a push in, drawn |
| `lanes.html` | a hand-off: who does what, in what order | the actors as lanes, a now line stepping from event to event, the failure as the one coral mark | drawn, stepped, pinned |
| `verdicts.html` | a rule run over many things | the list, a scan down it, the tally, then the one that fails opened as its file writes it | printed, scanned, counted, opened |
| `own-words.html` | a sentence whose exact words carry the point | the words at size, the turn underlined, what follows from them | printed, drawn |
| `two-futures.html` | a decision whose options change something you can draw | the same thing in each future, side by side, as the answer cards | printed, drawn, scrolled, counted |
| `journey.html` | what the plan makes, as the person meets it | the real pages, the camera following each click, the whole path at the end | printed, a click, a pan, a pull back |

The stage (`../stages/`) is the other half: the rail and the chain a whole video keeps coming back to, which
these scenes leave to it. The Dylan video's rail, where each answer lands on its step as a tag, is
`stages/pipeline.html`.

## Using one

1. **Pick by what the beat is about**, from its storyboard block, not by the look. A beat no scene fits is drawn
   fresh by the style guide (§5); so is a second beat that would repeat the scene just before it. A video uses
   several (`build` warns when over 70% of its scenes share one layout).
2. **`reelplanner scene <video-dir> <frame>=<scene> …`** (`3=count 7=two-futures`, as many as you like) writes each
   frame's file (its storyboard `- src:`) from its scene: in the frame's `<template>`, every `FID` made the frame's
   prefix, its root marked with its id, length and bottom band, its timeline registered and run to the frame's end.
   `reelplanner scene` lists them.
3. **Put your plan in.** Every word, number and thing in the scene is the Dylan example's: replace each with your
   plan's own, from the plan or its sources, never a figure they do not give. Keep the structure: the positions,
   the classes, the moves. Fewer or more items: each header says the range that fits.
4. **Put the times on the cues** once `audio_meta.json` has the words' times (the packet lists them): each tween's
   position is a plain number on its word, so `retime-frames` keeps it there when the line is voiced again.
5. **`reelplanner frame-check <video-dir> <frame>`**, and look at the picture.

## Taken from

| scene | from |
|---|---|
| `count` | the long explainer's field of records with the few it cited marked, and its count narrowing |
| `anatomy` | the long explainer's one log row with its fields named under it |
| `lanes` | the long explainer's timeline: each actor a lane, the refusals as crosses |
| `verdicts` | the long explainer's sentence check: each sentence of a summary against its source, the tally |
| `own-words` | the long explainer's agent reasoning, quoted whole, the turn drawn out |
| `two-futures` | the Dylan video's choice 1 ("10 albums" against "all 40") and choice 3 (two page mocks) |
| `journey` | the Dylan plan's "After this lands", and the video's page mocks |
