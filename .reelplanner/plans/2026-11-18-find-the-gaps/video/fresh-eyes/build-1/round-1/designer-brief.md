# Fresh eyes: the designer's brief · Find the gaps: line up your picture, the agent's and the code

You are a designer looking at "Find the gaps: line up your picture, the agent's and the code", a narrated video of 32 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

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
# Fresh eyes: designer · round 1 · stamp 3b5c70df6202

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- G3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Three pictures of the same code

Picture: `shots/scene-01.png`

> You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.

### Scene 2

Picture: `shots/scene-02.png`

> If you're new, four things this plan builds on. Send hands your review to the agent session waiting on this page; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3

Picture: `shots/scene-03.png`

> Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.

### Scene 4

Picture: `shots/scene-04.png`

> Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check.

### Scene 5 · part: Steps 1 and 2: a round

Picture: `shots/scene-05.png`

> Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three.

### Scene 6

Picture: `shots/scene-06.png`

> Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six of those candidates. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone; where it disagrees, the card is fixed or dropped.

### Scene 7

Picture: `shots/scene-07.png`

> Step two, as proposed, puts the round on the review page, a card at a time. You answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer, or not sure, is a gap, with four ways to settle it. Skip the rest ends the round.

### Scene 8

Picture: `shots/scene-08.png`

> Question one. A: the cards show up on the review page, with a key per answer, a box to click, your spoken words, and the code on the card. B: in the chat, as the agent's questions: quickest to build, but plain text, nothing to click or say. C: both at once, twice the work. I recommend A: the page makes each answer a key press. Where do the cards show up first?

### Scene 9

Picture: `shots/scene-09.png`

> With A, the card turns over on the page, with the code's lines on its back.

### Scene 10

Picture: `shots/scene-10.png`

> With B, the agent asks each card in the chat, and the lines come back as text.

### Scene 11

Picture: `shots/scene-11.png`

> With C, the same round opens on the page and in the chat at once.

### Scene 12

Picture: `shots/scene-12.png`

> Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 13 · part: Step 3: your own words

Picture: `shots/scene-13.png`

> Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. Your words are split into claims, each a stretch that says one thing, checked against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. A claim about what you want comes back as an assume card. Drawing your picture stays a separate plan.

### Scene 14

Picture: `shots/scene-14.png`

> Question two. A: the waiting agent session checks your words. It knows the code best, and takes about a minute. B: a small hosted model, called from the page: seconds, but your words leave the machine, and it sees only the pinned lines. C: the next session to take the round, after Send. I recommend A, falling back to C. So who checks your spoken words against the code?

### Scene 15

Picture: `shots/scene-15.png`

> With A, your claims come back marked in about a minute.

### Scene 16

Picture: `shots/scene-16.png`

> With B, they're marked in seconds, by a model your words are sent to.

### Scene 17

Picture: `shots/scene-17.png`

> With C, you see them marked only when the round comes back.

### Scene 18

Picture: `shots/scene-18.png`

> Quick check. On a card about where a question waits, you press N, for not sure. What comes next?

### Scene 19 · part: Step 4: settle each gap

Picture: `shots/scene-19.png`

> Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. The decision log, the record of your answers, gets them only through the plan's own questions.

### Scene 20

Picture: `shots/scene-20.png`

> Got it is kept with the lines' fingerprint, a short code that changes when they do. Question three. A: the same card comes back only when those lines change. B: also once more, on a new case, days later. C: whenever a plan depends on it. I recommend A: a change to the code is what makes your picture stale. When does the same card return?

### Scene 21

Picture: `shots/scene-21.png`

> With A, the card returns only after its lines change.

### Scene 22

Picture: `shots/scene-22.png`

> With B, it returns once more, on a new case, a few days on.

### Scene 23

Picture: `shots/scene-23.png`

> With C, it returns each time a plan leans on it.

### Scene 24

Picture: `shots/scene-24.png`

> Quick check. You say: and it should only go to the session I have open. How is that claim marked?

### Scene 25 · part: Step 5: into the loop

Picture: `shots/scene-25.png`

> Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and runs a round when one is worth your time. A wrong quick check gets the same four buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.

### Scene 26

Picture: `shots/scene-26.png`

> Question four. Take two requests: make Send reach my open session, and rename the Save button. A: a round before every plan, both included: the surest, and two minutes more each time. B: only when a gap is likely and costly, so Send gets four cards and the rename none, with a line saying why. C: only when you ask. I recommend B. So how often should a round come before a plan?

### Scene 27

Picture: `shots/scene-27.png`

> With A, every plan on existing code starts with a round, a rename included.

### Scene 28

Picture: `shots/scene-28.png`

> With B, the rename gets no round, and the change to Send gets four cards.

### Scene 29

Picture: `shots/scene-29.png`

> With C, a round comes only when you say: align me first.

### Scene 30

Picture: `shots/scene-30.png`

> Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?

### Scene 31

Picture: `shots/scene-31.png`

> Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?

### Scene 32

Picture: `shots/scene-32.png`

> That's the plan: a round of a few cards where a gap is likely, your own words checked, one click to settle each gap, and the round in the loop. Your four answers sit on the steps. Draw on any step to leave a note, or approve.
