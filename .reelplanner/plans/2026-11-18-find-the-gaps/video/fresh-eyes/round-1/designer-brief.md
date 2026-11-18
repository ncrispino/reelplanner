# Fresh eyes: the designer's brief · Find the gaps: line up your picture, the agent's and the code

You are a designer looking at "Find the gaps: line up your picture, the agent's and the code", a narrated video of 19 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 of the 19 are new or changed since
the last build, and those are what you look at. The
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
# Fresh eyes: designer · round 1 · stamp 2b7d9dd8c2ea

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- G3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Three pictures of the same code · look at this one

Picture: `shots/scene-01.png`

> You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> If you're new, four things this plan builds on. Send hands your review to the agent session waiting on this page; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3 · look at this one

Picture: `shots/scene-03.png`

> Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying the hand-off to a waiting session once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.

### Scene 4 · look at this one

Picture: `shots/scene-04.png`

> Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check.

### Scene 5 · look at this one

Picture: `shots/scene-05.png`

> Your review changed three things. One: you can answer the agent's questions three ways, in the chat with the agent alone, on this page, or in a video. Two: something you got right is asked once more, days later, on a new case. Three: you got three of this video's quick checks wrong, so what they test is now said plainly. Those were gaps too, between the video and you.

### Scene 6 · part: Steps 1 and 2: a round · look at this one

Picture: `shots/scene-06.png`

> Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three.

### Scene 7 · look at this one

Picture: `shots/scene-07.png`

> Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone. Where it disagrees, the card is fixed or dropped before the round opens. You never see two answers side by side.

### Scene 8 · look at this one

Picture: `shots/scene-08.png`

> Step two, as you decided: one round, three ways in. First, in the chat with the agent alone: it asks each card with its own question tool, and shows the code's lines as text. That needs no page, no video, and no setup in the repo. Then the review page, which adds clicking a box on a diagram, and your voice. Then a video, where a quick check is a card. Each way writes the same record, so what comes next is the same. Drawing your picture comes later, on the page, as a plan of its own.

### Scene 9 · look at this one

Picture: `shots/scene-09.png`

> On the review page, a card at a time, you answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it. Not sure is kept too, never skipped: it's a gap of its own, settled with Got it or Show me more.

### Scene 10 · look at this one

Picture: `shots/scene-10.png`

> Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 11 · part: Step 3: your own words · look at this one

Picture: `shots/scene-11.png`

> Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session, as you chose, splits your words into claims, each checked against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. It should tell me when it's taken: that says should, so it's neither a match nor a gap. It comes back as an assume card.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> Quick check. On card c five, you press N, for not sure. What comes next?

### Scene 13 · part: Step 4: settle each gap · look at this one

Picture: `shots/scene-13.png`

> Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. Nothing from a round goes into the decision log, the record of your answers: a plan built on it gets its decisions from its own questions.

### Scene 14 · look at this one

Picture: `shots/scene-14.png`

> As you decided, Got it is not the end. A few days later, it's asked once more, on a new case: other names, the same rule, so you apply it instead of remembering the answer. Got it again, and it's known until its lines change; wrong again, and it's a gap to settle. Nothing reminds you on a schedule: the first round in this repo three days or more later carries it as one more card, whatever that round is about.

### Scene 15 · look at this one

Picture: `shots/scene-15.png`

> Quick check. You say: and it should only go to the session I have open. How is that claim marked?

### Scene 16 · part: Step 5: into the loop · look at this one

Picture: `shots/scene-16.png`

> Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and, as you chose, runs a round only when one is likely and costly. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.

### Scene 17 · look at this one

Picture: `shots/scene-17.png`

> Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?

### Scene 18 · look at this one

Picture: `shots/scene-18.png`

> Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?

### Scene 19 · look at this one

Picture: `shots/scene-19.png`

> That's the revised plan: one round with three ways in, your own words checked, one click to settle each gap, asked once more days later, and the round in the loop. Your four decisions sit on the steps. Draw on any step to leave a note, or approve.
