# Fresh eyes: the designer's brief · reelplanner: the whole system

You are a designer looking at "reelplanner: the whole system", a narrated video of 45 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 19, 23, 24, 26, 28, 29, 30, 31, 32, 34, 38, 39, 41, 44, 45 of the 45 are new or changed since
the last build, and those are what you look at. Scenes 3, 10, 17, 18, 20, 22, 25, 27, 33, 35, 37, 40, 42, 43 are here for context only,
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
# Fresh eyes: designer · round 1 · stamp 04915629a390

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 19, 23, 24, 26, 28, 29, 30, 31, 32, 34, 38, 39, 41, 44, 45). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: What reelplanner is · look at this one

Picture: `shots/scene-01.png`

> Your agent, the AI assistant that writes your code, hands you a plan like this: five steps, eight hundred lines, and four questions at the end. You can answer them right in the chat. But that's a lot to read, so it's easy to skim, and hard to see what each question is asking.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> reelplanner turns that plan into a short narrated video, which stops at each question for your answer. It's a row of scenes, each a picture and a line or two, grouped into chapters. The rest goes on a page under it, the guide.

### Scene 3 · context only: it did not change, list nothing on it

Picture: `shots/scene-03.png`

> Used in full, every change follows one loop. The plan video tells the plan, before any code, and your review's answers become decisions. The agent builds, noting each choice it makes alone. The walkthrough video shows it running, for your review too. Then the system video, this one, catches up.

### Scene 4 · look at this one

Picture: `shots/scene-04.png`

> You choose how much of it you use. The basic unit is one video: a plan video, or an explainer, a video of something already there. Add a walkthrough after the build, if you want, or take the whole pipeline: your answers kept as decisions, every review on record, and the system video kept current. From here on, this video shows the whole pipeline.

### Scene 5 · look at this one

Picture: `shots/scene-05.png`

> It all runs through the plan-to-video skill, the instructions your agent follows. It's tested with Claude Code, though not yet its sandboxed run on a normal machine. Codex has basic support.

### Scene 6 · part: Installing it · look at this one

Picture: `shots/scene-06.png`

> Installing takes four commands. First, once per machine, npm installs the tooling from GitHub. That adds `reelplanner`, and `reel`, the reel CLI, which keeps the project's record.

### Scene 7 · look at this one

Picture: `shots/scene-07.png`

> Second, `reelplanner setup`, once per machine too, gets what videos need: a voice, a transcriber for captions, a browser that draws the frames, and HyperFrames' skills.

### Scene 8 · look at this one

Picture: `shots/scene-08.png`

> Third, `npx skills add` copies the plan-to-video skill from that install to where Claude Code, Codex and the other agents read skills.

### Scene 9 · look at this one

Picture: `shots/scene-09.png`

> Last, in each repo, `reel init` writes `.reelplanner/`: the project's description, its parts and words, the decision log: every answer you give, and the command that starts your agent when a review arrives. Your agent runs it for you, and in a repo with code, fills in the description and parts from it.

### Scene 10 · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Quick check: your agent has finished building a login page you approved. Which video do you watch next?

### Scene 11 · part: The plan and its video · look at this one

Picture: `shots/scene-11.png`

> To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan. From there, your agent runs the commands. It writes the plan into your repo as `plan.md`: a few steps, each with its cases, interface and an example, and a numbered question wherever the choice is yours.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> Then `reel check` holds the plan to what you decided: your answers on each part it touches are rules it must cite, or say why it replaces one.

### Scene 13 · look at this one

Picture: `shots/scene-13.png`

> The agent writes a storyboard and the frames; `reelplanner build` voices it with a local voice, adds captions and checks every frame.

### Scene 14 · look at this one

Picture: `shots/scene-14.png`

> Before you see it, fresh eyes look: two new agents who know nothing of the plan. One lists what a newcomer couldn't follow; the other, what breaks the frame rules, like one reading order and each name on its thing. The author answers every finding: fixed, given a meaning, or kept with a reason.

### Scene 15 · look at this one

Picture: `shots/scene-15.png`

> Your agent starts the review server, `reelplanner review`, and it keeps running after your session ends. It serves the review page, and a notification says when a video is ready: here, four choices to make and five quick checks, about five minutes.

### Scene 16 · look at this one

Picture: `shots/scene-16.png`

> Quick check. On a new laptop, you've run the first three commands. So in a second repo: what still has to run?

### Scene 17 · part: Reviewing in the player · context only: it did not change, list nothing on it

Picture: `shots/scene-17.png`

> Open a video, and it plays in the review player, its chapters on the timeline. Draw on a frame, or comment anywhere, and it's tied to the plan step on screen.

### Scene 18 · context only: it did not change, list nothing on it

Picture: `shots/scene-18.png`

> At each question the video stops, and you click a card to answer; More on a card says what picking it means. Not ready? Explain this more asks for it again, explained better. None fits? Write your own words in the answer bar.

### Scene 19 · look at this one

Picture: `shots/scene-19.png`

> Stuck on a word? Terms opens in the side panel. Ask about this, or Q, asks an agent about the scene. The Plan switch shows the plan text.

### Scene 20 · context only: it did not change, list nothing on it

Picture: `shots/scene-20.png`

> Now and then, a quick check asks what the plan will do on a new case. Once you answer, each card says why. And Walk me through it works the case through.

_(scene 21: not changed, not here)_

### Scene 22 · context only: it did not change, list nothing on it

Picture: `shots/scene-22.png`

> A thing in a scene can lead to its part of the guide, quietly: a faint arrow when paused; on hover, a thin ring and More in the guide.

### Scene 23 · look at this one

Picture: `shots/scene-23.png`

> On the guide, select any words to leave a note, suggest an edit, or ask. It goes with the same review.

### Scene 24 · look at this one

Picture: `shots/scene-24.png`

> When you're done, press Finish. Approve, and the agent works your comments into the plan, with no new video. Request changes, and you'll see only the scenes that changed. Then press Send.

### Scene 25 · context only: it did not change, list nothing on it

Picture: `shots/scene-25.png`

> Quick check. Fresh eyes flag “stage map” in another video, and its author thinks it's clear. What happens before the review page opens?

### Scene 26 · part: After you send · look at this one

Picture: `shots/scene-26.png`

> Your review reaches the agent one of three ways. Send, on your machine. Send on a hosted page: the review page as a link you open anywhere, Claude only. Or a download you hand it.

### Scene 27 · context only: it did not change, list nothing on it

Picture: `shots/scene-27.png`

> Sent on your machine, the review server keeps it in the inbox and hands it on once: to a waiting session; else it starts the headless run, your agent alone in the sandbox, a fence keeping its writes in your repo; else it waits for your next session.

### Scene 28 · look at this one

Picture: `shots/scene-28.png`

> `reel record` files the review and adds each answer, with an id like D-264, to the decision log. The log keeps everything, but little of it binds a plan. Of 309, only 65 are rules: your answers in force. The agent's choices are history, back only when a change rewrites their code. And `reel fold` drafts a part's rules as one spec section; once you approve it, plans cite that instead.

### Scene 29 · look at this one

Picture: `shots/scene-29.png`

> Then the agent revises. Approved: your comments go into `plan.md`, no new video. Changes requested: only the steps your words touched are rewritten, plan-diff marks the scenes that changed, and the player plays just those.

### Scene 30 · look at this one

Picture: `shots/scene-30.png`

> Quick check. Paused on a scene, your pointer over its table: how do you know the table leads to the guide?

### Scene 31 · part: The build and its walkthrough · look at this one

Picture: `shots/scene-31.png`

> Once you approve, the agent builds the plan. Each choice the plan didn't cover is a row in `walkthrough.md`, with a label when you might want to look: visible, hard-to-undo, or close. At a step's fifth choice, the agent stops and asks you instead: that step waits, with a question in `plan.md`.

### Scene 32 · look at this one

Picture: `shots/scene-32.png`

> Then the code check: a second agent, new to the work, reads the code against the plan and your decisions. `reel audit` fails until every finding is answered.

### Scene 33 · context only: it did not change, list nothing on it

Picture: `shots/scene-33.png`

> The walkthrough video shows each change running, the real page or a real run, before and after, in about two minutes, with its own guide.

### Scene 34 · look at this one

Picture: `shots/scene-34.png`

> `reel stops` decides what pauses it: an off-plan change, where the agent strayed from the plan; a choice labelled visible or hard-to-undo; and one sharing a label with a recent late fix: something a review let through, changed later.

### Scene 35 · context only: it did not change, list nothing on it

Picture: `shots/scene-35.png`

> A pause shows the choice running, with Accept and Flag. Every other choice is on one list at the end, each with a Flag.

_(scene 36: not changed, not here)_

### Scene 37 · context only: it did not change, list nothing on it

Picture: `shots/scene-37.png`

> Quick check. In a repo set up for Claude Code, you press Send at eleven at night, with no session open. What happens to your review?

### Scene 38 · part: What's kept · look at this one

Picture: `shots/scene-38.png`

> The record is text in your repo, under `.reelplanner/`: the spec, the parts, the glossary, the decision log, and each plan's `plan.md`, reviews, `walkthrough.md` and video sources. The inbox stays on your machine; guides and video files are built again, never committed. This repo's own older plans still hold theirs, until its public history leaves them out.

### Scene 39 · look at this one

Picture: `shots/scene-39.png`

> This video is made from three of those files: `spec.md`; `system.json`, the parts of the system and how they connect; and the glossary, each word with a scene. When they change, spec-diff names the scenes to rebuild. system-review sorts each comment on it: fix the video, a small change, or a new plan. This video has no guide yet: `spec.md` holds the rest.

### Scene 40 · context only: it did not change, list nothing on it

Picture: `shots/scene-40.png`

> Your reviews teach it too: `reel status` ends with the memory, lines worked out from the log and your reviews, like how often you take the recommendation. When evidence piles up, a retro proposes skill edits.

### Scene 41 · look at this one

Picture: `shots/scene-41.png`

> Not ready to plan? `reelplanner explain` makes an explainer: a video of something already there, every fact from a named source. It ends with Done, Explain more, or Plan this.

### Scene 42 · context only: it did not change, list nothing on it

Picture: `shots/scene-42.png`

> With more people, a big pull request gets its own walkthrough video, on a branch of its own, and the maintainer's review is the one that counts.

### Scene 43 · context only: it did not change, list nothing on it

Picture: `shots/scene-43.png`

> Quick check. Step six has three choices: one labelled visible, one close, one with no label, and no recent late fixes. Which of them pause the walkthrough video?

### Scene 44 · look at this one

Picture: `shots/scene-44.png`

> Quick check. A walkthrough you accept adds a new part, the scheduler, to the parts and the glossary. What happens to this video?

### Scene 45 · look at this one

Picture: `shots/scene-45.png`

> That's reelplanner: a plan you watch and answer, a build you watch and accept, and a record that keeps everything. Install it, ask your agent for a plan, and watch.
