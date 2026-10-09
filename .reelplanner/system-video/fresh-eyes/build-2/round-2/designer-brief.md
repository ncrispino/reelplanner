# Fresh eyes: the designer's brief · reelplanning: the whole system

You are a designer looking at "reelplanning: the whole system", a narrated video of 38 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's Open tab,
chips and captions included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 1, 11, 12, 13 of the 38 are new or changed since
the last build, and those are what you look at. Scenes 2, 10, 14 are here for context only,
the scene just before or after a changed one: they have not changed and had their look, so list nothing on them. The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.

## The seven rules (a frame a newcomer can read)

1. **Show the thing, never a stand-in.** Words, not grey lines or an empty box where words go.
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** Never a column of chips apart from
   the things they name.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not", never "you
   approve, or not" alone.
5. **Nothing covers content.** The player's Open tab has room above the thing it opens; no chip or caption sits on
   words.
6. **Readable at a glance.** Text big enough to read in the picture, text inside a screenshot too; at most three
   type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of
   chips with an empty half.

List every place a picture breaks one, with the rule's number and what would fix it in a few words.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 2 · stamp ee31e8977e68

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 1, 11, 12, 13). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Why a video · look at this one

Picture: `shots/scene-01.png`

> An agent, the AI assistant that writes your code, hands you its plan: six steps, each step one numbered change, pages of text, and three questions at the very end. You skim it and say yes. Nobody answered the questions.

### Scene 2 · context only: it did not change, list nothing on it

Picture: `shots/scene-02.png`

> reelplanning turns that plan into a short narrated video, and you review it by watching. A review is one pass through it, kept as a file. The video is a row of scenes, each one picture and a sentence or two of voice, grouped into chapters.

_(scenes 3 to 9: not changed, not here)_

### Scene 10 · part: The review page · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Now the review page. Before the first play, a video says what to watch first: here, this video, with its length. And the Terms, in the side panel beside the video, say what each word means, in the scene you're on.

### Scene 11 · look at this one

Picture: `shots/scene-11.png`

> Before any video reaches you, fresh eyes look at it: two fresh agents that get only what a viewer gets. A newcomer lists what it couldn't follow; a designer, what makes a frame hard to read. Every finding is answered before the page opens: fixed, given a meaning, or kept with a reason. What was kept is listed here, on Before you watch, with why.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> The designer holds every frame to the frame rules, seven of them: show the thing, never a stand-in; one reading order; each name on the thing it names; a question that says what you decide; nothing covering content; readable at a glance; and pleasing. frame-lint, a check the build runs, fails the two a program can see. This frame, from an older video, broke both: grey lines where words go, and a button over its words.

### Scene 13 · look at this one

Picture: `shots/scene-13.png`

> A phrase fresh eyes flagged, and the author kept, gets a meaning: it's underlined, and a click shows it. Still lost? Pause, press Q or click a caption word, and Ask about this. On your own machine, the agent session waiting on the page answers, and says where from; with none waiting, your question goes with your review. On a hosted page, Claude answers.

### Scene 14 · context only: it did not change, list nothing on it

Picture: `shots/scene-14.png`

> Press L, and the plan text, the plan's own words, sits beside the video. When a scene holds more than a screen can, the thing it's about is marked, with an Open tab on it. Click it, and a detail, a page about that thing, grows over the paused frame. Where nothing is marked, the Open chip in the corner opens it. finish-project's details check tries every detail page, and every mark, first.
