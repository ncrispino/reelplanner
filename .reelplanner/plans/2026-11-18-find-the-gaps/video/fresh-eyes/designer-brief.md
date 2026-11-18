# Fresh eyes: the designer's brief · Find the gaps: line up your picture, the agent's and the code

You are a designer looking at "Find the gaps: line up your picture, the agent's and the code", a narrated video of 19 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 2, 11 of the 19 are new or changed since
the last build, and those are what you look at. Scenes 1, 3, 10, 12 are here for context only,
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
# Fresh eyes: designer · round 2 · stamp 8e22ff2650ce

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 2, 11). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- G3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Three pictures of the same code · context only: it did not change, list nothing on it

Picture: `shots/scene-01.png`

> You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> If you're new, four things this plan builds on. Send hands your review to an agent session that is waiting for it, the one you opened this page from; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3 · context only: it did not change, list nothing on it

Picture: `shots/scene-03.png`

> Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying the hand-off to a waiting session once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.

_(scenes 4 to 9: not changed, not here)_

### Scene 10 · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 11 · part: Step 3: your own words · look at this one

Picture: `shots/scene-11.png`

> Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session, as you chose, splits your words into claims, each checked against the code. Say you said: it goes to my session. A match. If I'm not there, it waits. A gap, in this repo. It should tell me when it's taken: that says should, so it's neither a match nor a gap. It comes back as an assume card, next in this same round.

### Scene 12 · context only: it did not change, list nothing on it

Picture: `shots/scene-12.png`

> Quick check. On card c five, you press N, for not sure. What comes next?
