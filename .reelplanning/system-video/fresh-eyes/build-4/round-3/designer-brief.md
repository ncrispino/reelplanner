# Fresh eyes: the designer's brief · reelplanning: the whole system

You are a designer looking at "reelplanning: the whole system", a narrated video of 45 scenes, before anyone reviews it. For
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

List every place a picture breaks one, with the rule's number and what would fix it in a few words.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 3 · stamp 1a6df6598c8f

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: What reelplanning is

Picture: `shots/scene-01.png`

> Your agent, the AI assistant that writes your code, hands you its plan: five steps, each step one numbered change, eight hundred lines of text, and four questions at the very end. You skim it, and say yes. Nobody answered the questions.

### Scene 2

Picture: `shots/scene-02.png`

> reelplanning sounds like real planning, and that's the idea. Long text is too hard to take in, so reelplanning turns the plan into a short narrated video: a row of scenes, each one picture and a sentence or two of voice, grouped into chapters. Everything else goes on a page under it.

### Scene 3

Picture: `shots/scene-03.png`

> Every change follows one loop. The plan video tells the plan, before any code. You review it, one pass kept as a file, and your answers become decisions. The agent builds. The walkthrough video shows the change running, and you review that too. Then the system video, the one that explains the whole project, is brought up to date. This is it.

### Scene 4

Picture: `shots/scene-04.png`

> All of it runs through the plan-to-video skill: the instructions your agent follows for this way of working. It is tested with Claude Code, and has basic support for Codex. Other agents, like Cursor and Copilot, are open work, each written up for a contributor.

### Scene 5 · part: Installing it

Picture: `shots/scene-05.png`

> Installing takes four commands. First the tooling, once per machine: npm installs it from GitHub, since it isn't on npm yet, and adds two commands to your terminal: `reelplanning`, and `reel`, the reel CLI, which keeps the project's record.

### Scene 6

Picture: `shots/scene-06.png`

> Second, `reelplanning setup`, also once per machine. It gets what's needed to make the videos on your machine: a voice, a transcriber for the captions, a browser that draws the frames, and HyperFrames' skills. It installs what's missing, and skips the rest.

### Scene 7

Picture: `shots/scene-07.png`

> Third, the skill goes into your agent, once per machine too: `npx skills add` copies plan-to-video to where Claude Code reads skills, and to where Codex and the others read theirs.

### Scene 8

Picture: `shots/scene-08.png`

> Last, in each repo: `reel init`. It writes a folder, `.reelplanning/`, with the project's own description, its parts and words, the decision log, the record of every answer you give, and the command that starts your agent when a review arrives. Your agent runs it for you the first time you plan there.

### Scene 9

Picture: `shots/scene-09.png`

> Quick check, a question to see that you followed: your agent has finished building a login page you approved. Which video do you watch next: the plan video again, the walkthrough video, or the system video?

### Scene 10 · part: The plan and its video

Picture: `shots/scene-10.png`

> Ask for a plan, and the agent writes it into your repo as `plan.md`: a few steps, each with its cases, its interface and a worked example, and a numbered question wherever the decision is yours.

### Scene 11

Picture: `shots/scene-11.png`

> Then `reel check` holds the plan to what you decided before. Your answers in the decision log are rules: on each part the plan touches, it cites them, or says why it replaces one. The agent's own past choices, the ones no plan covered, are history: they come back only when a change rewrites their lines.

### Scene 12

Picture: `shots/scene-12.png`

> Then the agent makes the video. A brief says who it's for and how it looks, and the storyboard plans it scene by scene. `narrate` voices the script with a local voice; finish-project adds the captions and checks the result; and plan-diff marks what changed since the last build.

### Scene 13

Picture: `shots/scene-13.png`

> Every frame follows the seven frame rules, for a frame a newcomer can read: show the thing, never a stand-in; each name on the thing it names; nothing covering content. `frame-lint` fails the two a program can see, and the details check stops a page that's broken.

### Scene 14

Picture: `shots/scene-14.png`

> Before you see it, fresh eyes look: two new agents that know nothing of the plan. One lists what a newcomer couldn't follow; the other, what breaks the frame rules. The author answers every finding: fixed, given a meaning, or kept with the reason, and the build won't pass one left unanswered.

### Scene 15

Picture: `shots/scene-15.png`

> `reelplanning review` starts the review server: it serves the review page, with every video in the repo, and sends a notification when one is ready, saying what it will ask: four questions for you, five minutes. What waits on you is at the top.

### Scene 16

Picture: `shots/scene-16.png`

> Quick check. On a new laptop, you've installed reelplanning and run setup. Now you open a second repo to plan in. What still has to run there?

### Scene 17 · part: Reviewing in the player

Picture: `shots/scene-17.png`

> Open a video and it plays in the review player. The timeline shows its chapters, and the keys N and P jump between them. Draw on a frame, or comment at any moment, and it's tied to the plan step on screen.

### Scene 18

Picture: `shots/scene-18.png`

> At each question, the video stops and waits. You answer on the frame by clicking a card, and More on a card says what picking it means. None fits? Write your own words in the answer bar, under the cards.

### Scene 19

Picture: `shots/scene-19.png`

> Stuck on a word? Terms opens in the side panel, beside the video, with what each word means. Ask about this, or the key Q, takes your question about the scene you're on. And the Plan switch shows the plan text, the plan's own words, beside the video.

### Scene 20

Picture: `shots/scene-20.png`

> Now and then, a quick check asks what the plan will do, on a case the video didn't show. Once you answer, each card says why it's right or wrong, and Walk me through it works the case through. Expected something else? Your words go to the agent as a comment.

### Scene 21

Picture: `shots/scene-21.png`

> Scroll down, and the guide is under the video, while the video goes on in a small player in the corner. The guide holds what a video can't: every case, the interface, worked examples with real values, and diagrams you step through.

### Scene 22

Picture: `shots/scene-22.png`

> A thing in a scene can lead to its part of the guide. It stays quiet: nothing while the video plays, a faint arrow when it's paused, and on hover, a thin ring and More in the guide. Click it, and the guide opens there. An older video shows the Open chip in its corner instead.

### Scene 23

Picture: `shots/scene-23.png`

> On the guide, select any words to leave a note, suggest an edit, or ask. It's the same box as a mark on the video, and it goes with the same review.

### Scene 24

Picture: `shots/scene-24.png`

> When you're done, press Finish. Approve, and the agent works your comments into the plan, with no new video. Request changes, and you'll see the video again, with only the scenes that changed. Then send it to the agent.

### Scene 25

Picture: `shots/scene-25.png`

> Quick check. In another plan's video, fresh eyes flag the phrase “stage map”, and its author, the agent that made it, thinks it's clear. What happens before the review page opens?

### Scene 26 · part: After you send

Picture: `shots/scene-26.png`

> Press Send, and the review server keeps your review in the inbox and hands it on exactly once: to the agent's session, an open chat with it, if one is waiting. If not, it starts the headless run, your agent on its own, inside the sandbox, a fence that keeps its writes in your repo.

### Scene 27

Picture: `shots/scene-27.png`

> `reel record` files the review once, in a file that's never overwritten, with what to act on beside it, and adds each answer to the decision log, which is only ever added to. Each entry has an id: decision D-264, say, that the guide opens under the video.

### Scene 28

Picture: `shots/scene-28.png`

> Then the revise step. If you approved, your comments go into `plan.md` as text, and there's no new video. If you asked for changes, only the steps your words touched are rewritten, plan-diff marks the scenes that changed, and the player plays just those.

### Scene 29

Picture: `shots/scene-29.png`

> As the log grows to hundreds of entries, a part's rules can be folded: `reel fold` drafts them as one section of `spec.md`, and only on your yes does a plan cite that section instead of each id.

### Scene 30

Picture: `shots/scene-30.png`

> Quick check. You pause on a scene with a table, and move your pointer over it. How do you know the table leads to the guide?

### Scene 31 · part: The build and its walkthrough

Picture: `shots/scene-31.png`

> Once you approve, the implement step builds what the plan says. Each choice the plan didn't cover is a row in `walkthrough.md`, with a label when you might want to look: visible, hard-to-undo, or close, a toss-up. At a step's fifth choice, the agent stops and asks you instead.

### Scene 32

Picture: `shots/scene-32.png`

> Then the code check: a second agent, one that never saw the work, reads the code against the plan and your decisions. `reel audit` fails until everything it found is answered.

### Scene 33

Picture: `shots/scene-33.png`

> The walkthrough video shows each change running, before and after: the real page, or a real run, in about two minutes, with its own guide under it.

### Scene 34

Picture: `shots/scene-34.png`

> `reel stops` decides what pauses it: an off-plan change always, where the agent did something other than the plan said; a choice labelled visible or hard-to-undo; and one sharing a label with a recent late fix, something a review let through that had to be changed later.

### Scene 35

Picture: `shots/scene-35.png`

> A pause shows the choice running, with Accept and Flag on its card. Every other choice is on one list at the end, each with a Flag, and Go on takes the rest. Older videos put them in one grouped scene per chapter.

### Scene 36

Picture: `shots/scene-36.png`

> Under it, the guide's Built side shows what changed, with the real runs. The video ends asking: seeing it run, anything you'd change? Flag a choice, and the walkthrough fix step changes the code, and updates its row.

### Scene 37

Picture: `shots/scene-37.png`

> Quick check. You press Send at eleven at night, and no agent session is open. What happens to your review?

### Scene 38 · part: What's kept

Picture: `shots/scene-38.png`

> Everything is text in your repo, under `.reelplanning/`: the spec, the parts, the glossary, the decision log, and for each plan its `plan.md`, reviews, `walkthrough.md`, and the videos' sources. The inbox, the guides and the video files are made again, never committed.

### Scene 39

Picture: `shots/scene-39.png`

> This video is made from three of those files: `spec.md`, `system.json`, with the parts of the system and how they connect, and the glossary, with a scene that explains every word in it. After an accepted walkthrough they change, and spec-diff names the scenes to rebuild. A review of this video goes to system-review, which sorts each comment.

### Scene 40

Picture: `shots/scene-40.png`

> Your reviews teach it, too. `reel status` ends with the memory: lines worked out from the log and your reviews, like how often you take the recommendation. When the evidence piles up, a retro proposes edits to the skill.

### Scene 41

Picture: `shots/scene-41.png`

> Not ready to plan? Ask what's going on, and `reelplanning explain` makes an explainer: a video of something already there, with every fact from a named source. It asks nothing. At the end: Done, Explain more, or Plan this.

### Scene 42

Picture: `shots/scene-42.png`

> With more people, a big pull request gets its own walkthrough video, kept on a branch of its own, and the maintainer's review is the one that counts. `reel pr-check` says where it stands. And `reel case-study` tests the idea: one prompt, run as a text plan, an HTML page, and reelplanning.

### Scene 43

Picture: `shots/scene-43.png`

> Quick check. In step six, the agent made three choices: one labelled visible, one labelled close, and one with no label, and there are no late fixes lately. Which pause the walkthrough video?

### Scene 44

Picture: `shots/scene-44.png`

> Quick check. You accept a walkthrough that adds a new part, the scheduler, to the project's parts and its glossary. What happens to this video?

### Scene 45

Picture: `shots/scene-45.png`

> That's reelplanning: a plan you watch and answer, a build you watch and accept, and a record in your repo that only grows. Install it, ask your agent for a plan, and watch.
