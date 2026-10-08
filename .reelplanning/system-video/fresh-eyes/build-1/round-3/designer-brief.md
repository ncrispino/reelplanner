# Fresh eyes: the designer's brief · reelplanning: the whole system

You are a designer looking at "reelplanning: the whole system", a narrated video of 35 scenes, before anyone reviews it. For
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
# Fresh eyes: designer · round 3 · stamp 0cabc5bbfb38

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: Why a video

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-01.png`

> An agent, the AI assistant that writes your code, hands you its plan: six steps, each step one numbered change, pages of text, and three questions at the very end. You skim it and say yes. Nobody answered the questions.

### Scene 2

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-02.png`

> reelplanning turns that plan into a short narrated video, and you review it by watching. A review is one pass through it, kept as a file. The video is a row of scenes, each one picture and a sentence or two of voice, grouped into chapters.

### Scene 3

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-03.png`

> A video has a length: it stops at each question, and waits. You answer on the frame itself, by clicking a card. More on a card says what picking it means. None fits? Answer in your own words, in the row under the cards: the answer bar.

### Scene 4

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-04.png`

> Every plan gets two videos. Before the code, the plan video asks the plan's questions. After it, the walkthrough video shows what landed, and stops at the agent's choices, things it decided on its own, for you to accept or flag. Both ask quick checks: a question on what the plan or the code will do.

### Scene 5 · part: Twelve parts, two loops

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-05.png`

> Twelve parts of the system do this work. Four make the video. The plan-to-video skill writes the storyboard, what each scene shows and says, and draws the scenes. narrate voices the lines, on a rebuild only the ones that changed. finish-project puts the video together. And plan-diff finds what changed since the last build.

### Scene 6

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-06.png`

> Four carry your answers back. The review player is the page where you watch and answer. The review server takes your review and keeps it in an inbox. If no session is waiting, it starts the headless run: your agent, working unattended. And the reel CLI keeps the record.

### Scene 7

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-07.png`

> Four act on your answers. The revise step rewrites the plan. The implement step writes the code. The walkthrough fix step changes what you flagged. And the system video is this one.

### Scene 8

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-08.png`

> Together they make two loops. The review loop goes from the player, through the server and the reel CLI, which keeps the record, to the revise step, and back as a rebuilt video. The build loop starts at the implement step, with the fix step in place of the revise step.

### Scene 9

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-09.png`

> Quick check. A plan video has four questions. At the third, you look away for a minute. What does the video do: play on to the end, stop there and wait, or pick a card for you?

### Scene 10 · part: The review page

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-10.png`

> Now the review page. Before the first play, a video says what to watch first: here, this video, with its length. And the Terms, in the side panel beside the video, say what each word means, in the scene you're on.

### Scene 11

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-11.png`

> Press L, and the plan text, the plan's own words, sits beside the video. When a scene holds more than a screen can, the thing it's about is marked, with an Open tab on it. Click it, and a detail, a page about that thing, grows over the paused frame. Where nothing is marked, the Open chip in the corner opens it. finish-project's details check tries every detail page, and every mark, first.

### Scene 12

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-12.png`

> Once you answer a quick check, each card says why it's right or wrong, and Walk me through it works the case through with real numbers. On a big screen, Size makes the video smaller.

### Scene 13

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-13.png`

> When you're done, press Finish. Approve means the plan goes ahead: your comments go into its steps as text, with no new video. Request changes means you want to see it again, rebuilt where your words landed.

### Scene 14

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-14.png`

> Quick check. You ask for changes to step three of a plan. Which part changes that step: the implement step, the revise step, or the walkthrough fix step?

### Scene 15 · part: After you send

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-15.png`

> After you send, the review server hands your review on exactly once: to a waiting session, or else to the headless run. Nobody watches that run, so it works inside a sandbox: a fence that lets it write only inside the repo.

### Scene 16

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-16.png`

> The reel CLI adds each answer to the decision log: one numbered entry per answer, kept for good. Decision D-127, plain words on screen, is one. Your review is filed beside the earlier ones, never over them.

### Scene 17

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-17.png`

> If you asked for changes, the revise step rewrites only the steps your words landed on: on the deep-dives plan, steps two, four, five and six. Step one got a plain pick, and stayed as it was.

### Scene 18

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-18.png`

> Then narrate voices only the changed lines, and plan-diff marks the changed scenes. A notification, a notice on your desktop, says the video is ready. If two scenes changed, you rewatch two scenes.

### Scene 19

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-19.png`

> Quick check. You approve a plan, with one comment on its step five. What happens to the comment: step five is rebuilt, it goes into step five as text, or it's dropped?

### Scene 20 · part: The build

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-20.png`

> Once a plan is approved, the implement step writes the code. Each choice the plan didn't cover becomes a row: what it chose, instead of what, and why. One you might overturn gets a label: visible, hard to undo, or close. Doing other than the plan says is an off-plan change.

### Scene 21

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-21.png`

> At a step's fifth choice, the agent stops, and asks you that step's biggest choice as a question in the plan. reel audit, the check on the walkthrough, fails a step with five choices and no question, as it does here.

### Scene 22

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-22.png`

> Then the code check: a second, fresh agent checks the code against the plan and the decision log, from a brief, a short note saying what to compare, never from the first agent's reasons. Every finding it marks wrong must be answered. One here was about this very video: no scene explained a step, or Finish.

### Scene 23

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-23.png`

> Quick check. A plan has seven steps. You pick a card on step three, and comment on step seven. What does the revise step rewrite: steps three and seven, step seven only, or all seven?

### Scene 24 · part: The walkthrough

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-24.png`

> The walkthrough doesn't stop at every choice; reel stops decides. An off-plan change always stops. A choice with no label never does. A labelled one stops until that label has been accepted in a row ten times. And a late fix, something a review let through that changed later, makes its label stop again.

### Scene 25

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-25.png`

> The choices of a step that stop share one scene: the video pauses once, and each choice is a card with its own Accept and Flag, like step one's two here. An off-plan change pauses on its own. The rest wait in one grouped scene per chapter, where Accept all takes any you didn't flag.

### Scene 26

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-26.png`

> Then the walkthrough fix step acts on what you flagged. Here a reviewer answered choice A10 in their own words: Escape should keep a mark's words too. The fix changed the code, and the choice's row, in place. Words that would overturn a logged decision become a new plan instead.

### Scene 27

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-27.png`

> Once you accept a walkthrough, the spec is updated, and spec-diff names the scenes of this video it affects, so only those are rebuilt. You can review this video too: system-review sorts each comment into a fix to the video, a small change, or a new plan.

### Scene 28

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-28.png`

> Quick check. Building step three, the agent has made four choices, each a row. One more comes up. What does it do: make it as a fifth row, stop and ask you a question, or leave it for the fix step?

### Scene 29 · part: Memory, and six rules

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-29.png`

> Every review teaches the next plan. Memory is worked out each time from the decision log and your reviews. Yours follows you across repos in one file: the videos you've watched and the words you looked up, so a video skips what you know. When a signal keeps repeating, a retro proposes changes to the skill.

### Scene 30

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-30.png`

> Six rules keep the loops honest. One: the decision log only grows; a revise never edits a past entry. Two: only an answer is a decision. Explain this more adds nothing to the log; the question is asked again, better.

### Scene 31

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-31.png`

> Three: the revise step touches only a step your words landed on. Four: it edits the plan in place, and git keeps the history. There is never a plan two.

### Scene 32

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-32.png`

> Five: a rebuilt scene keeps its id, so plan-diff shows an edit as one changed scene. Six: the agent that wrote the code never checks it, and every finding is answered where you can see it.

### Scene 33

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-33.png`

> Quick check. A step has three labelled choices that stop, and one off-plan change. How many times does the video pause in that step: once, twice, or four times?

### Scene 34

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-34.png`

> Quick check. A plan asks three questions. You pick a card on two, and press Explain this more on the third. How many entries join the decision log: three, two, or none?

### Scene 35

Picture: `.reelplanning/system-video/fresh-eyes/shots/scene-35.png`

> That's reelplanning: a plan you watch and answer, a build you accept or flag, and a record that only grows. To see it on real work, open any plan's video from Videos, at the top of the review page.
