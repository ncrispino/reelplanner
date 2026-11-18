# Fresh eyes: the designer's brief · Find the gaps: line up your picture, the agent's and the code

You are a designer looking at "Find the gaps: line up your picture, the agent's and the code", a narrated video of 32 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 7, 18, 25 of the 32 are new or changed since
the last build, and those are what you look at. Scenes 6, 8, 17, 19, 24, 26 are here for context only,
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
5. **Nothing covers content.** The player's "More in the guide ↓" label has room above the thing it opens; no chip
   or caption sits on words.
6. **Readable at a glance.** Text big enough to read in the picture, text inside a screenshot too, and sharp (a
   screenshot stretched soft breaks it); at most three type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of
   chips with an empty half.

List only what stops a viewer: a place a picture breaks rules 1–6 so that they cannot read, find or trust what is
there (cut off, covered, too small or faint to read, in an order the narration contradicts, a stand-in where the
thing should be), with the rule's number and what would fix it in a few words. What only makes a frame less
pleasing (rule 7: a gap, the balance, a nicer layout) goes after your findings under a heading `## Advisory`, a
line each with no number: the author reads it and need not answer it.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 2 · stamp ae2c1bec4d7e

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 7, 18, 25). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- G3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 6 · context only: it did not change, list nothing on it

Picture: `shots/scene-06.png`

> Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six of those candidates. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone; where it disagrees, the card is fixed or dropped.

### Scene 7 · look at this one

Picture: `shots/scene-07.png`

> Step two, as proposed, puts the round on the review page, a card at a time. You answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it; not sure, with two. Skip the rest ends the round.

### Scene 8 · context only: it did not change, list nothing on it

Picture: `shots/scene-08.png`

> Question one. A: the cards show up on the review page, with a key per answer, a box to click, your spoken words, and the code on the card. B: in the chat, as the agent's questions: quickest to build, but plain text, nothing to click or say. C: both at once, twice the work. I recommend A: the page makes each answer a key press. Where do the cards show up first?

_(scenes 9 to 16: not changed, not here)_

### Scene 17 · context only: it did not change, list nothing on it

Picture: `shots/scene-17.png`

> With C, you see them marked only when the round comes back.

### Scene 18 · look at this one

Picture: `shots/scene-18.png`

> Quick check. On card c five, you press N, for not sure. What comes next?

### Scene 19 · part: Step 4: settle each gap · context only: it did not change, list nothing on it

Picture: `shots/scene-19.png`

> Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. The decision log, the record of your answers, gets them only through the plan's own questions.

_(scenes 20 to 23: not changed, not here)_

### Scene 24 · context only: it did not change, list nothing on it

Picture: `shots/scene-24.png`

> Quick check. You say: and it should only go to the session I have open. How is that claim marked?

### Scene 25 · part: Step 5: into the loop · look at this one

Picture: `shots/scene-25.png`

> Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and runs a round when one is worth your time. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.

### Scene 26 · context only: it did not change, list nothing on it

Picture: `shots/scene-26.png`

> Question four. Take two requests: make Send reach my open session, and rename the Save button. A: a round before every plan, both included: the surest, and two minutes more each time. B: only when a gap is likely and costly, so Send gets four cards and the rename none, with a line saying why. C: only when you ask. I recommend B. So how often should a round come before a plan?
