# SCRIPT — reelplanning's system video (seven chapters)

**Voice:** am_michael (Kokoro, local; synthesised at speed 1.1, 0.8 s held after each line)
**Voice settings:** default
**Voice direction:** Plain and even. A good teacher showing a newcomer round a system: one idea per sentence, a real example for every mechanism, the glossary's plain words and no others.

---

## Line 1 — A long plan (Frame 1)

**Delivery:** Plain.

    Your agent, the AI assistant that writes your code, hands you a plan like this: five steps, eight hundred lines, and four questions at the end. You can answer them right in the chat. But that's a lot to read, so it's easy to skim, and hard to see what each question is asking.

## Line 2 — A plan, as a video (Frame 2)

**Delivery:** Plain.

    reelplanning turns that plan into a short narrated video, which stops at each question for your answer. It's a row of scenes, each a picture and a line or two, grouped into chapters. The rest goes on a page under it, the guide.

## Line 3 — One loop for every change (Frame 3)

**Delivery:** Plain.

    Used in full, every change follows one loop. The plan video tells the plan, before any code, and your review's answers become decisions. The agent builds, noting each choice it makes alone. The walkthrough video shows it running, for your review too. Then the system video, this one, catches up.

## Line 4 — How much you use (Frame 4)

**Delivery:** Plain.

    You choose how much of it you use. The basic unit is one video: a plan video, or an explainer, a video of something already there. Add a walkthrough after the build, if you want, or take the whole pipeline: your answers kept as decisions, every review on record, and the system video kept current. From here on, this video shows the whole pipeline.

## Line 5 — The skill, and which agents (Frame 5)

**Delivery:** Plain.

    It all runs through the plan-to-video skill, the instructions your agent follows. It's tested with Claude Code, though not yet its sandboxed run on a normal machine. Codex has basic support.

## Line 6 — The tooling, once per machine (Frame 6)

**Delivery:** Plain.

    Installing takes four commands. First, once per machine, npm installs the tooling from GitHub. That adds `reelplanning`, and `reel`, the reel CLI, which keeps the project's record.

## Line 7 — What the videos need (Frame 7)

**Delivery:** Plain.

    Second, `reelplanning setup`, once per machine too, gets what videos need: a voice, a transcriber for captions, a browser that draws the frames, and HyperFrames' skills.

## Line 8 — The skill, into your agent (Frame 8)

**Delivery:** Plain.

    Third, `npx skills add` copies the plan-to-video skill from that install to where Claude Code, Codex and the other agents read skills.

## Line 9 — Then, in each repo (Frame 9)

**Delivery:** Plain.

    Last, in each repo, `reel init` writes `.reelplanning/`: the project's description, its parts and words, the decision log: every answer you give, and the command that starts your agent when a review arrives. Your agent runs it for you, and in a repo with code, fills in the description and parts from it.

## Line 10 — Quick check: a login page, built (Frame 10)

**Delivery:** Plain.

    Quick check: your agent has finished building a login page you approved. Which video do you watch next?

## Line 11 — The plan, in your repo (Frame 11)

**Delivery:** Plain.

    To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan. From there, your agent runs the commands. It writes the plan into your repo as `plan.md`: a few steps, each with its cases, interface and an example, and a numbered question wherever the choice is yours.

## Line 12 — Held to what you decided (Frame 12)

**Delivery:** Plain.

    Then `reel check` holds the plan to what you decided: your answers on each part it touches are rules it must cite, or say why it replaces one.

## Line 13 — From plan to video (Frame 13)

**Delivery:** Plain.

    The agent writes a storyboard and the frames; `reelplanning build` voices it with a local voice, adds captions and checks every frame.

## Line 14 — Fresh eyes, before you (Frame 14)

**Delivery:** Plain.

    Before you see it, fresh eyes look: two new agents who know nothing of the plan. One lists what a newcomer couldn't follow; the other, what breaks the frame rules, like one reading order and each name on its thing. The author answers every finding: fixed, given a meaning, or kept with a reason.

## Line 15 — The review page (Frame 15)

**Delivery:** Plain.

    Your agent starts the review server, `reelplanning review`, and it keeps running after your session ends. It serves the review page, and a notification says when a video is ready: here, four choices to make and five quick checks, about five minutes.

## Line 16 — Quick check: a second repo (Frame 16)

**Delivery:** Plain.

    Quick check. On a new laptop, you've run the first three commands. So in a second repo: what still has to run?

## Line 17 — The review player (Frame 17)

**Delivery:** Plain.

    Open a video, and it plays in the review player, its chapters on the timeline. Draw on a frame, or comment anywhere, and it's tied to the plan step on screen.

## Line 18 — It stops, and you answer on the frame (Frame 18)

**Delivery:** Plain.

    At each question the video stops, and you click a card to answer; More on a card says what picking it means. Not ready? Explain this more asks for it again, explained better. None fits? Write your own words in the answer bar.

## Line 19 — Terms, Ask, and the plan text (Frame 19)

**Delivery:** Plain.

    Stuck on a word? Terms opens in the side panel. Ask about this, or Q, asks an agent about the scene. The Plan switch shows the plan text.

## Line 20 — A quick check, and why (Frame 20)

**Delivery:** Plain.

    Now and then, a quick check asks what the plan will do on a new case. Once you answer, each card says why. And Walk me through it works the case through.

## Line 21 — The guide, under the video (Frame 21)

**Delivery:** Plain.

    Scroll down, and the guide is under the video, which keeps playing small in the corner. It holds what a video can't: every case, the interface, worked examples, and diagrams to step through.

## Line 22 — A quiet way into the guide (Frame 22)

**Delivery:** Plain.

    A thing in a scene can lead to its part of the guide, quietly: a faint arrow when paused; on hover, a thin ring and More in the guide.

## Line 23 — A note on any words (Frame 23)

**Delivery:** Plain.

    On the guide, select any words to leave a note, suggest an edit, or ask. It goes with the same review.

## Line 24 — Finish: approve, or ask for changes (Frame 24)

**Delivery:** Plain.

    When you're done, press Finish. Approve, and the agent works your comments into the plan, with no new video. Request changes, and you'll see only the scenes that changed. Then press Send.

## Line 25 — Quick check: a phrase that's flagged (Frame 25)

**Delivery:** Plain.

    Quick check. Fresh eyes flag “stage map” in another video, and its author thinks it's clear. What happens before the review page opens?

## Line 26 — How a review arrives (Frame 26)

**Delivery:** Plain.

    Your review reaches the agent one of three ways. Send, on your machine. Send on a hosted page: the review page as a link you open anywhere, Claude only. Or a download you hand it.

## Line 27 — Who picks it up (Frame 27)

**Delivery:** Plain.

    Sent on your machine, the review server keeps it in the inbox and hands it on once: to a waiting session; else it starts the headless run, your agent alone in the sandbox, a fence keeping its writes in your repo; else it waits for your next session.

## Line 28 — Filed once, and on record (Frame 28)

**Delivery:** Plain.

    `reel record` files the review and adds each answer, with an id like D-264, to the decision log. The log keeps everything, but little of it binds a plan. Of 309, only 65 are rules: your answers in force. The agent's choices are history, back only when a change rewrites their code. And `reel fold` drafts a part's rules as one spec section; once you approve it, plans cite that instead.

## Line 29 — Only what your words touched (Frame 29)

**Delivery:** Plain.

    Then the agent revises. Approved: your comments go into `plan.md`, no new video. Changes requested: only the steps your words touched are rewritten, plan-diff marks the scenes that changed, and the player plays just those.

## Line 30 — Quick check: does it lead somewhere? (Frame 30)

**Delivery:** Plain.

    Quick check. Paused on a scene, your pointer over its table: how do you know the table leads to the guide?

## Line 31 — Every choice, written down (Frame 31)

**Delivery:** Plain.

    Once you approve, the agent builds the plan. Each choice the plan didn't cover is a row in `walkthrough.md`, with a label when you might want to look: visible, hard-to-undo, or close. At a step's fifth choice, the agent stops and asks you instead: that step waits, with a question in `plan.md`.

## Line 32 — A second agent checks (Frame 32)

**Delivery:** Plain.

    Then the code check: a second agent, new to the work, reads the code against the plan and your decisions. `reel audit` fails until every finding is answered.

## Line 33 — The change, running (Frame 33)

**Delivery:** Plain.

    The walkthrough video shows each change running, the real page or a real run, before and after, in about two minutes, with its own guide.

## Line 34 — What pauses it (Frame 34)

**Delivery:** Plain.

    `reel stops` decides what pauses it: an off-plan change, where the agent strayed from the plan; a choice labelled visible or hard-to-undo; and one sharing a label with a recent late fix: something a review let through, changed later.

## Line 35 — A pause, and the list (Frame 35)

**Delivery:** Plain.

    A pause shows the choice running, with Accept and Flag. Every other choice is on one list at the end, each with a Flag.

## Line 36 — What was built, and the fix (Frame 36)

**Delivery:** Plain.

    Under it, the guide's Built side shows what changed, with the real runs. Finish asks again: anything you'd change? Flag a choice, and the agent fixes the code and its row.

## Line 37 — Quick check: sent at night (Frame 37)

**Delivery:** Plain.

    Quick check. In a repo set up for Claude Code, you press Send at eleven at night, with no session open. What happens to your review?

## Line 38 — All of it, as text (Frame 38)

**Delivery:** Plain.

    The record is text in your repo, under `.reelplanning/`: the spec, the parts, the glossary, the decision log, and each plan's `plan.md`, reviews, `walkthrough.md` and video sources. The inbox stays on your machine; guides and video files are built again, never committed. This repo's own older plans still hold theirs, until its public history leaves them out.

## Line 39 — This video, kept current (Frame 39)

**Delivery:** Plain.

    This video is made from three of those files: `spec.md`; `system.json`, the parts of the system and how they connect; and the glossary, each word with a scene. When they change, spec-diff names the scenes to rebuild. system-review sorts each comment on it: fix the video, a small change, or a new plan. This video has no guide yet: `spec.md` holds the rest.

## Line 40 — What your reviews teach (Frame 40)

**Delivery:** Plain.

    Your reviews teach it too: `reel status` ends with the memory, lines worked out from the log and your reviews, like how often you take the recommendation. When evidence piles up, a retro proposes skill edits.

## Line 41 — Explain first (Frame 41)

**Delivery:** Plain.

    Not ready to plan? `reelplanning explain` makes an explainer: a video of something already there, every fact from a named source. It ends with Done, Explain more, or Plan this.

## Line 42 — More people (Frame 42)

**Delivery:** Plain.

    With more people, a big pull request gets its own walkthrough video, on a branch of its own, and the maintainer's review is the one that counts.

## Line 43 — Quick check: three choices in step six (Frame 43)

**Delivery:** Plain.

    Quick check. Step six has three choices: one labelled visible, one close, one with no label, and no recent late fixes. Which of them pause the walkthrough video?

## Line 44 — Quick check: a new part (Frame 44)

**Delivery:** Plain.

    Quick check. A walkthrough you accept adds a new part, the scheduler, to the parts and the glossary. What happens to this video?

## Line 45 — reelplanning, in one picture (Frame 45)

**Delivery:** Plain.

    That's reelplanning: a plan you watch and answer, a build you watch and accept, and a record that keeps everything. Install it, ask your agent for a plan, and watch.
