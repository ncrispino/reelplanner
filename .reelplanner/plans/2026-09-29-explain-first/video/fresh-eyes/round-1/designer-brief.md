# Fresh eyes: the designer's brief · Explain first: a video of what is going on, before any plan

You are a designer looking at "Explain first: a video of what is going on, before any plan", a narrated video of 28 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's Open tab,
chips and captions included) and what the narration says over it. Look at every picture, at the size it is.

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
# Fresh eyes: designer · round 1 · stamp b34339636c7c

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Explain first

Picture: `shots/scene-01.png`

> You asked for this: sometimes you just want to know what's going on, in the repo or in a transcript, and then decide whether a plan follows. Today, every video needs a plan first.

### Scene 2

Picture: `shots/scene-02.png`

> Every video today hangs off something: the system video off the whole repo, and the plan video and the walkthrough off a plan. So what does the review server do? What happened in this session? What does this branch change? What changed since Monday? None of these has a video. The agent answers in chat, in text.

### Scene 3

Picture: `shots/scene-03.png`

> Earlier plans lead here. Videos that make sense added fresh eyes, two fresh agents that look at a video before you do, and Ask about this. The plan guide puts the whole plan behind its video. Walkthroughs that help ask a quick check only where there's something to predict. Better visuals put the real thing on screen.

### Scene 4

Picture: `shots/scene-04.png`

> Three changes. Steps one and two: you can ask for an explainer, a video of something that's there, with no plan behind it and nothing to decide. Steps three and four: you review it on the same page, and a plan can follow. Step five: it stays honest, and private.

### Scene 5 · part: Steps 1 and 2: ask for one

Picture: `shots/scene-05.png`

> Step one: four kinds of explainer. A part of the repo: the review server is six files and five decisions. A transcript or a log, the record of a session or a run: the session building this repo since last Tuesday is over twenty-one thousand lines. A change: a branch of thirty-three files. A period: since Monday, thirty commits and nineteen decisions. Each runs two to five minutes, and shows the real thing: the code, the lines, the diff.

### Scene 6

Picture: `shots/scene-06.png`

> Question one. That session is over twenty-one thousand lines, and its video quotes a dozen. A: no guide; you get the video. B: a guide for a transcript and a change: the whole transcript, organized, or the full diff, a click from each moment. C: a guide for every kind. I recommend B: the two with far more than a video can hold. Is the whole source there to read?

### Scene 7

Picture: `shots/scene-07.png`

> With A, the session is only the lines its scenes quote.

### Scene 8

Picture: `shots/scene-08.png`

> With B, each moment of the session's video opens its turns on the guide.

### Scene 9

Picture: `shots/scene-09.png`

> With C, a part's guide also holds its files, and a period's its commits.

### Scene 10

Picture: `shots/scene-10.png`

> Step two: you ask in your own words, and the agent runs one command. It gathers the sources and pins them: the commit, and each file as it was, so the video can say only what they say. The explainer gets a folder of its own, and a row of its own on the review page, which says how many commits have landed since.

### Scene 11

Picture: `shots/scene-11.png`

> Quick check. You ask: why did last night's CI run fail? What does the explainer read?

### Scene 12 · part: Steps 3 and 4: review it, then plan it

Picture: `shots/scene-12.png`

> Step three: you review it on the same page, with marks, comments and Ask about this, and a quick check only where there's something to predict. It asks nothing to decide, so Finish has three ends: Done; Explain more, which rebuilds the scenes you asked about; or Plan this. The review is filed, and your memory learns what you watched. The decision log gets nothing: only an answer is a decision.

### Scene 13

Picture: `shots/scene-13.png`

> Quick check. On Monday you ask about the review server; by Friday, seven commits have changed it. What plays on Friday?

### Scene 14

Picture: `shots/scene-14.png`

> Step four: Plan this. The agent writes a plan from what you said: your comments by scene and your questions, quoted in its problem, under a first line naming the explainer. From there it's an ordinary plan, with its review and its decisions, and its video lists the explainer under Before you watch.

### Scene 15

Picture: `shots/scene-15.png`

> Question two: how much does the plan's video say again? A: it leans on the explainer, with two lines for a new viewer. B: a recap chapter, about forty seconds of the explainer's scenes. C: it stands alone and explains it all again, about a minute. I recommend A: you just watched it. How far does it lean?

### Scene 16

Picture: `shots/scene-16.png`

> With A, the plan's video starts at what changes.

### Scene 17

Picture: `shots/scene-17.png`

> With B, its first forty seconds are the explainer's scenes, cut down.

### Scene 18

Picture: `shots/scene-18.png`

> With C, a minute of the plan's video explains the server again.

### Scene 19

Picture: `shots/scene-19.png`

> Quick check. You comment on a branch's explainer, this looks wrong, and press Done. What goes into the decision log?

### Scene 20 · part: Step 5: honest and private

Picture: `shots/scene-20.png`

> Step five: honest. Each scene names where its facts come from, and a new check fails a quoted line its source doesn't hold word for word. Fresh eyes look at it, as at every video. For a transcript or a change, a third fresh agent, the fact check, reads the story against the sources, since the agent that did the work is the worst judge of it.

### Scene 21

Picture: `shots/scene-21.png`

> And private. A transcript is read where it is, and never copied into the repo: the folder keeps its path and a fingerprint of it. A quoted line that looks like a key or a password, or holds an email address, stops the build until it's masked.

### Scene 22

Picture: `shots/scene-22.png`

> Question three. The session's explainer quotes twelve lines of over twenty-one thousand. A: its text goes into git, those twelve lines included, never the transcript. B: the whole transcript too, for a teammate to read. C: nothing, until you keep it or plan it. I recommend A: it's shared like a plan's video, and the transcript stays yours. What goes into git?

### Scene 23

Picture: `shots/scene-23.png`

> With A, the repo holds the explainer and twelve lines; the transcript stays on your machine.

### Scene 24

Picture: `shots/scene-24.png`

> With B, every line of the session is in the repo's history.

### Scene 25

Picture: `shots/scene-25.png`

> With C, an explainer you press Done on stays on one machine.

### Scene 26

Picture: `shots/scene-26.png`

> Quick check. You asked one question on the page, left two comments, and press Plan this. Where does the question go?

### Scene 27

Picture: `shots/scene-27.png`

> Last check. A CI log's explainer quotes a line holding a GitHub access key. What does the build do?

### Scene 28

Picture: `shots/scene-28.png`

> That's the plan: four kinds of explainer, asked for in your own words, reviewed on the same page, a plan when you want one, and honest and private. Draw on any step to leave a note, or approve.
