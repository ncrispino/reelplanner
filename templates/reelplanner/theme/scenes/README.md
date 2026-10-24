# Scenes: start a frame from one that works

A frame drawn from a blank page tends to come out as cards of words: the bakery bench's low-depth runs drew
most of their scenes as a heading over a row of boxes. The videos that showed the most drew something
else: the Dylan plan video (`videos/g1-bob-dylan-site`) drew its choices as two futures of the same album list
and its steps as one page growing; a long explainer on a research project drew a count narrowing, one log
row labelled field by field, its actors as lanes over time, a field of tens of thousands with a few dozen
marked, a sentence check with its tally, an agent's own words at size. These scenes are those, rebuilt in the theme's tokens and motion
language so a plan video can start from them.

Each is a whole scene, moving by `../motion-language.md` and keeping coral to its one moment, and a template: every
word in it is a `{{slot}}` for the plan's own, which its header lists with what goes in each, how many things fit,
and how it moves. A frame starts with no one else's content, and `frame-lint` fails a slot left unfilled. The visuals
spec fills each scene with a worked example (from the Dylan plan, in `scripts/test/scene-examples.json`, which is not
shipped) and checks that a real fill passes `frame-lint`.

| scene | use it when the beat is about… | it shows | its verbs |
|---|---|---|---|
| `count.html` | how many, and how much of them the step means | the figure, the whole as a field of cells, the part filled, the rest dimmed with what it costs | counted, filled, dimmed |
| `anatomy.html` | the record, file, form, URL or command the plan keeps coming back to | the thing whole, each part named on its own row, then the camera on the part that matters | printed, pinned, a push in, drawn |
| `lanes.html` | a hand-off: who does what, in what order | the actors as lanes, a now line stepping from event to event, the failure as the one coral mark | drawn, stepped, pinned |
| `verdicts.html` | a rule run over many things | the list, a scan down it, the tally, then the one that fails opened as its file writes it | printed, scanned, counted, opened |
| `own-words.html` | a sentence whose exact words carry the point | the words at size, the turn underlined, what follows from them | printed, drawn |
| `two-futures.html` | a decision whose options change something you can draw | the same thing in each future, side by side, as the answer cards | printed, drawn, scrolled, counted |
| `two-looks.html` | a decision about how something looks or reads | the same page in each look, in its own colours and type, as the answer cards | printed, drawn, wiped |
| `journey.html` | what the plan makes, as the person meets it | the real pages in the product's own look, the camera following each click, the whole path at the end | printed, a click, a pan, a pull back |

The stage (`../stages/`) is the other half: the rail and the chain a whole video keeps coming back to, which
these scenes leave to it. The Dylan video's rail, where each answer lands on its step as a tag, is
`stages/pipeline.html`.

## Using one

1. **Pick by what the beat is about**, from its storyboard block, not by the look. A beat no scene fits is drawn
   fresh by the style guide (§5). At most half a video's frames start from scenes, and each scene once: `variety`
   (and `build`) warn past either, since a video of copied scenes looks like every other video.
2. **`reelplanner scene <video-dir> <frame>=<scene> …`** (`3=count 7=two-futures`, as many as you like) writes each
   frame's file (its storyboard `- src:`) from its scene: in the frame's `<template>`, every `FID` made the frame's
   prefix, its root marked with its id, length and bottom band, its timeline registered and run to the frame's end.
   `reelplanner scene` lists them.
3. **Fill its slots, and make it this beat's.** Every word in the scene is a `{{slot}}`, and its header says what goes
   in each: fill each from the plan or its sources, never a figure they do not give, and delete one (with its
   element) the beat does not need. Keep the scene's idea (the part drawn to scale, the two futures); change its
   layout, sizes and moves wherever this beat needs. Each header says how many items fit.
4. **The product in its own look.** A page, screen or option mock (`data-plan-component="page"`) wears the plan's
   **Look** block: its palette, type and imagery, its colours written as they are (`frame-lint` allows them there,
   and holds the rest of the frame to the theme's tokens). Drawn in the video's cream and coral, every product the
   videos showed looked the same.
5. **Put the times on the cues** once `audio_meta.json` has the words' times (the packet lists them): each tween's
   position is a plain number on its word, so `retime-frames` keeps it there when the line is voiced again.
6. **`reelplanner frame-check <video-dir> <frame>`**, and look at the picture.

## Adding one

The set grows from videos that showed something: when a reviewer's answers say a scene worked, make it a scene here.
Take the idea, not the video's content: rebuild it in the theme's tokens and moves, its words as `{{slots}}`, with a
header like the others (what it is for, its slots, how many items fit, how it moves), a row above and under **Taken
from**, and a worked example for its slots in `scripts/test/scene-examples.json` from a plan in this repo
(`eval/plans/`). The visuals spec checks that the example fills every slot and passes `frame-lint`.

## Taken from

| scene | from |
|---|---|
| `count` | the long explainer's field of records with the few it cited marked, and its count narrowing |
| `anatomy` | the long explainer's one log row with its fields named under it |
| `lanes` | the long explainer's timeline: each actor a lane, the refusals as crosses |
| `verdicts` | the long explainer's sentence check: each sentence of a summary against its source, the tally |
| `own-words` | the long explainer's agent reasoning, quoted whole, the turn drawn out |
| `two-futures` | the Dylan video's choice 1 ("10 albums" against "all 40") |
| `two-looks` | the Dylan video's choice 3 ("Book-like" against "Magazine", two page mocks) |
| `journey` | the Dylan plan's "After this lands", and the video's page mocks |
