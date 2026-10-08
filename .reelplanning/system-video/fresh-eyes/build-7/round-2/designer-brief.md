# Fresh eyes: the designer's brief · reelplanning: the whole system

You are a designer looking at "reelplanning: the whole system", a narrated video of 45 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 1, 2, 3, 4, 11, 14, 33, 38, 45 of the 45 are new or changed since
the last build, and those are what you look at. Scenes 5, 10, 12, 13, 15, 32, 34, 37, 39, 44 are here for context only,
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
# Fresh eyes: designer · round 2 · stamp 1b7bf3d7833f

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 1, 2, 3, 4, 11, 14, 33, 38, 45). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: What reelplanning is · look at this one

Picture: `shots/scene-01.png`

> Your agent, the AI assistant that writes your code, hands you a plan like this: five steps, eight hundred lines, and four questions at the end. You can answer them right in the chat. But that's a lot to read, so it's easy to skim, and hard to see what each question is asking.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> reelplanning sounds like real planning. Long text is hard to take in, so the plan becomes a short narrated video that stops at each question for your answer. It's a row of scenes, each a picture and a line or two, grouped into chapters. The rest goes on a page under it, the guide.

### Scene 3 · look at this one

Picture: `shots/scene-03.png`

> Used in full, every change follows one loop. The plan video tells the plan, before any code, and your review's answers become decisions. The agent builds, noting each choice it makes alone. The walkthrough video shows it running, for your review too. Then the system video, this one, catches up.

### Scene 4 · look at this one

Picture: `shots/scene-04.png`

> You choose how much of it you use. The basic unit is one video: a plan video, or an explainer, a video of something already there. If you want, add the walkthrough video after the build. Or run the whole loop: your answers kept as decisions, every review on record, and the system video kept current.

### Scene 5 · context only: it did not change, list nothing on it

Picture: `shots/scene-05.png`

> It all runs through the plan-to-video skill, the instructions your agent follows. It's tested with Claude Code, though not yet its sandboxed run on a normal machine. Codex has basic support.

_(scenes 6 to 9: not changed, not here)_

### Scene 10 · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Quick check: your agent has finished building a login page you approved. Which video do you watch next?

### Scene 11 · part: The plan and its video · look at this one

Picture: `shots/scene-11.png`

> To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan. From there, your agent runs the commands. It writes the plan into your repo as `plan.md`: a few steps, each with its cases, interface and an example, and a numbered question wherever the choice is yours.

### Scene 12 · context only: it did not change, list nothing on it

Picture: `shots/scene-12.png`

> Then `reel check` holds the plan to what you decided: your answers in the decision log are rules it must cite, or say why it replaces one. The agent's past choices come back when a change rewrites their lines, and `reel fold` gathers a part's rules into one section of the spec.

### Scene 13 · context only: it did not change, list nothing on it

Picture: `shots/scene-13.png`

> The agent writes a storyboard and the frames; `reelplanning build` voices it with a local voice, adds captions and checks every frame.

### Scene 14 · look at this one

Picture: `shots/scene-14.png`

> Before you see it, fresh eyes look: two new agents who know nothing of the plan. One lists what a newcomer couldn't follow; the other, what breaks the frame rules, like one reading order and each name on its thing. The author answers every finding: fixed, given a meaning, or kept with a reason.

### Scene 15 · context only: it did not change, list nothing on it

Picture: `shots/scene-15.png`

> Your agent starts the review server, `reelplanning review`, and it keeps running after your session ends. It serves the review page, and a notification says when a video is ready: here, four choices to make and five quick checks, about five minutes.

_(scenes 16 to 31: not changed, not here)_

### Scene 32 · context only: it did not change, list nothing on it

Picture: `shots/scene-32.png`

> Then the code check: a second agent, new to the work, reads the code against the plan and your decisions. `reel audit` fails until every finding is answered.

### Scene 33 · look at this one

Picture: `shots/scene-33.png`

> The walkthrough video shows each change running, the real page or a real run, before and after, in about two minutes, with its own guide.

### Scene 34 · context only: it did not change, list nothing on it

Picture: `shots/scene-34.png`

> `reel stops` decides what pauses it: an off-plan change, where the agent strayed from the plan; a choice labelled visible or hard-to-undo; and one sharing a label with a recent late fix: something a review let through, changed later.

_(scenes 35 to 36: not changed, not here)_

### Scene 37 · context only: it did not change, list nothing on it

Picture: `shots/scene-37.png`

> Quick check. In a repo set up for Claude Code, you press Send at eleven at night, with no session open. What happens to your review?

### Scene 38 · part: What's kept · look at this one

Picture: `shots/scene-38.png`

> The record is text in your repo, under `.reelplanning/`: the spec, the parts, the glossary, the decision log, and each plan's `plan.md`, reviews, `walkthrough.md` and video sources. The inbox stays on your machine; guides and video files are built again, never committed. This repo's own older plans still hold theirs, until its public history leaves them out.

### Scene 39 · context only: it did not change, list nothing on it

Picture: `shots/scene-39.png`

> This video is made from three of those files: `spec.md`; `system.json`, the parts of the system and how they connect; and the glossary, each word with a scene. When they change, spec-diff names the scenes to rebuild. system-review sorts each comment on it: fix the video, a small change, or a new plan. This video has no guide yet: `spec.md` holds the rest.

_(scenes 40 to 43: not changed, not here)_

### Scene 44 · context only: it did not change, list nothing on it

Picture: `shots/scene-44.png`

> Quick check. A walkthrough you accept adds a new part, the scheduler, to the parts and the glossary. What happens to this video?

### Scene 45 · look at this one

Picture: `shots/scene-45.png`

> That's reelplanning: a plan you watch and answer, a build you watch and accept, and a record that only grows. Install it, ask your agent for a plan, and watch.
