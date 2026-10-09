# Fresh eyes: the designer's brief · reelplanning: the whole system

You are a designer looking at "reelplanning: the whole system", a narrated video of 45 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 12, 28, 45 of the 45 are new or changed since
the last build, and those are what you look at. Scenes 11, 13, 27, 29, 44 are here for context only,
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

List every place a picture breaks one, with the rule's number and what would fix it in a few words.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 2 · stamp 65d4139fac32

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 12, 28, 45). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 11 · part: The plan and its video · context only: it did not change, list nothing on it

Picture: `shots/scene-11.png`

> To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan. From there, your agent runs the commands. It writes the plan into your repo as `plan.md`: a few steps, each with its cases, interface and an example, and a numbered question wherever the choice is yours.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> Then `reel check` holds the plan to what you decided: your answers on each part it touches are rules it must cite, or say why it replaces one.

### Scene 13 · context only: it did not change, list nothing on it

Picture: `shots/scene-13.png`

> The agent writes a storyboard and the frames; `reelplanning build` voices it with a local voice, adds captions and checks every frame.

_(scenes 14 to 26: not changed, not here)_

### Scene 27 · context only: it did not change, list nothing on it

Picture: `shots/scene-27.png`

> Sent on your machine, the review server keeps it in the inbox and hands it on once: to a waiting session; else it starts the headless run, your agent alone in the sandbox, a fence keeping its writes in your repo; else it waits for your next session.

### Scene 28 · look at this one

Picture: `shots/scene-28.png`

> `reel record` files the review and adds each answer, with an id like D-264, to the decision log. The log keeps everything, but little of it binds a plan. Of 309, only 65 are rules: your answers in force. The agent's choices are history, back only when a change rewrites their code. And `reel fold` drafts a part's rules as one spec section; once you approve it, plans cite that instead.

### Scene 29 · context only: it did not change, list nothing on it

Picture: `shots/scene-29.png`

> Then the agent revises. Approved: your comments go into `plan.md`, no new video. Changes requested: only the steps your words touched are rewritten, plan-diff marks the scenes that changed, and the player plays just those.

_(scenes 30 to 43: not changed, not here)_

### Scene 44 · context only: it did not change, list nothing on it

Picture: `shots/scene-44.png`

> Quick check. A walkthrough you accept adds a new part, the scheduler, to the parts and the glossary. What happens to this video?

### Scene 45 · look at this one

Picture: `shots/scene-45.png`

> That's reelplanning: a plan you watch and answer, a build you watch and accept, and a record that keeps everything. Install it, ask your agent for a plan, and watch.
