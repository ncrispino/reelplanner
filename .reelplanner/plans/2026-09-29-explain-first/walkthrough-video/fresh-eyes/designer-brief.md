# Fresh eyes: the designer's brief · Explain first: what was built

You are a designer looking at "Explain first: what was built", a narrated video of 15 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's Open tab,
chips and captions included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 6, 9 of the 15 are new or changed since
the last build, and those are what you look at. Scenes 5, 7, 8, 10 are here for context only,
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
# Fresh eyes: designer · round 2 · stamp 712366da6611

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 6, 9). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 5 · context only: it did not change, list nothing on it

Picture: `shots/scene-05.png`

> On the review page, it's a row of its own: its length, the commit it explains, five commits since, and the plan it led to. Two choices. Its name is its folder's plus "explainer", as a walkthrough's is. And it waits under Needs you until you've watched it.

### Scene 6 · part: Review it, then plan · look at this one

Picture: `shots/scene-06.png`

> Step three. Finish on an explainer has three ends: Done, Explain more, and Plan this, and nothing goes into the decision log. The last two aren't templates any more. Each lists what it could mean for this video, from its scenes, its long sources and its open threads, and from what you did while watching: the scene you rewound, your comment. Pick one, edit it, or write your own; it goes with the review. Two choices: that box is on every explainer's Finish, and Done still comes first.

### Scene 7 · context only: it did not change, list nothing on it

Picture: `shots/scene-07.png`

> Quick check. You comment "this looks wrong" on an explainer and press Done. What goes into the decision log?

### Scene 8 · context only: it did not change, list nothing on it

Picture: `shots/scene-08.png`

> `reel record` files it beside the explainer: your comment by scene, your question and its answer. The decision log held two hundred and fifty decisions before, and the same after. Only an answer to a plan's question goes there.

### Scene 9 · look at this one

Picture: `shots/scene-09.png`

> Step four, Plan this. `reel new-plan --from` titles the draft with what you picked, names the explainer, and quotes what you said, by scene. `reel prereqs` puts the explainer first under Before you watch, so the plan video starts at what changes. One choice: with no plan file, it writes a draft, the problem only.

### Scene 10 · part: Honest and private · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Step five. `build` now runs `check-sources`. Every quoted line must be in its source, word for word, as it was when it was pinned. Retype one, and the build fails. And a secret anywhere in the text stops it.
