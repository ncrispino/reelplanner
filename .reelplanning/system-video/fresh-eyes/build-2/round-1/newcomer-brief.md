# Fresh eyes: the newcomer's brief · reelplanning: the whole system

You are a newcomer to this project. You are about to watch "reelplanning: the whole system", a narrated video of 38 scenes,
the way a viewer would: the narration of each scene as it is said, and a picture of the scene at its last moment
as the review page shows it (the player's buttons, tabs and captions included). You also have what a viewer can
open on the page: the glossary, the meanings this video gives its own words, and a line on each earlier video this
one leans on. You have nothing else: not the plan, not the code, not what the author meant.

List every phrase or thing on screen you could not explain from what the video had shown **by then**, what you
guessed it means, and every question a newcomer would ask. A word with a meaning below counts as explained. A
plain phrase with no meaning (made of ordinary words, like "the saved review file" or "drops the video") counts as
unexplained when the video never says what it is or where it comes from. Be specific: say the scene, the words,
and what you would need to follow.

**This is a rebuild: look only at what it changed.** Scenes 1, 11, 12, 13 of the 38 are new or changed since
the last build, and those are what you look at. Scenes 2, 10, 14 are here for context only,
the scene just before or after a changed one: they have not changed and had their look, so list nothing on them. The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.

A scene not here may have explained a phrase before the scene you look at: flag the phrase if that scene leaves you
unable to follow it, and the author will say where it is explained.

## The shape of newcomer.md (keep it exactly)

```
# Fresh eyes: newcomer · round 1 · stamp bc2662df6623

- N1 · scene 4 · "the phrase or thing": what you could not explain, and what you guessed; why it matters
- N2 · scene 7 · …
```

One finding a line, numbered N1, N2 … in scene order, each starting with its scene (only scenes 1, 11, 12, 13). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## Viewers were lost on these before

What the people who review this project's videos did not follow in earlier videos (words they looked up, questions
they asked, "Explain this more", checks they missed). Watch for the same kind of phrase here.

- a quick check missed (plan-guide, plan review): You change one row of step 2's cases table, a row no scene shows, and ask for changes. What is rebuilt?
- a quick check missed (videos-that-make-sense, plan review): The newcomer flags 'the list' in scene 4, and scene 5 says what it is. With the recommendation, what's the least the author does before you watch?
- a quick check missed (videos-that-make-sense, plan review): A frame lists two files on the left and, far to the right, a column of chips: 'kept' and 'removed'. Which rule does it break?
- a quick check missed (videos-that-make-sense, plan review): With the recommendation, you revise last week's plan video, which was never checked. Does the rebuild get fresh eyes?
- a word looked up (walkthroughs-that-help, plan review): walkthrough video
- a quick check missed (walkthroughs-that-help, plan review): A build moves the Send button to the top, renames an inside function, and changes how saved reviews are stored on disk. Which of those pause its walkthrough?
- a quick check missed (walkthroughs-that-help, plan review): A small pull request makes the review page open in dark mode. What does it need?
- a note on a quick check (walkthroughs-that-help, plan review): The bar is missed, and the next plan proposes dropping walkthrough videos. You ask for changes to that plan. What happens to walkthroughs? — "wdym dropps the video. again this dkind of thing is not explained well how ma…
- "Explain this more" on a question (walkthroughs-that-help, plan review): What does Approve make of the listed choices?
- an answer that asks what it means (walkthroughs-that-help, plan review): Does the walkthrough still test you? — "what do you think is optimal for us? we want to understand how it works so probably some kinda quick check is worth it. i guess it depends."
- a comment (walkthroughs-that-help, plan review): "what do you think is optimal for us? we want to understand how it works so probably some kinda quick check is worth it. i guess it depends." (on "Question 3: does it still test you")
- a quick check missed (walkthroughs-that-help, plan review): A build changes the saved review file: each date moves from one field to two. The page looks the same. Does its walkthrough ask a quick check?
- a quick check missed (walkthroughs-that-help, plan review): You're in the walkthrough, watching the step that moved the Save button run, and press See the plan. Where do you land?
- a quick check missed (walkthroughs-that-help, plan review): The bar is missed, and the next plan proposes dropping walkthrough videos. You ask for changes to that plan. What happens to walkthroughs?
- a quick check missed (walkthroughs-that-help, plan review): A plan adds a 20-second scene to the system video, which is already at its target. What else must the plan do?
- a note on a quick check (contributing, plan review): Omar's PR #58 is 25 lines and adds a flag, --quiet, to the reel CLI. He doesn't use reelplanning. What happens? — "eh idk i still feel like small ones just not needed really? what do you think"
- a quick check missed (details-in-the-frame, walkthrough review): A stop scene's choice cards are up, and the diff they are about is marked behind them. You click the diff. What happens?
- a quick check missed (details-in-the-frame, walkthrough review): The video is paused at 1:05 when you click a marked table. Its page opens, and you press Esc. What happens?
- a word looked up (contributing, plan review): pull request
- a quick check missed (details-in-the-frame, plan review): A quick check comes up on scene 12, whose block is marked. Before you answer, what does a click on the block do?
- a quick check missed (better-visuals, walkthrough review): The brief picks scene 3. Scene 5 draws only boxes. What does the build say about scene 5?
- a word looked up (contributing, plan review): maintainer
- a word looked up (contributing, plan review): tag
- "Explain this more" on a question (contributing, plan review): Who reviews a contributor's videos, and whose answer counts? — "im confused by this like doesnt the person submitting the pr we assume to have reviewed it already? like the maintinaer always has to read and do"
- an answer that asks what it means (contributing, plan review): Where does the maintainer watch a contributor's videos? — "im again confused here bc will they need to rebuild the whole thing then? that is annoying for many reasons and for voice, right? but also the maintainer might …
- a comment (contributing, plan review): "im again confused here bc will they need to rebuild the whole thing then? that is annoying for many reasons and for voice, right? but also the maintainer might go through and double check vid is correct before writing …
- a quick check missed (contributing, plan review): Omar's PR #58 is 25 lines and adds a flag, --quiet, to the reel CLI. He doesn't use reelplanning. What happens?
- a quick check missed (contributing, plan review): Lee accepted all 4 choices in PR #61's walkthrough; the owner flagged one, and it was fixed. What reviews does main hold?
- a quick check missed (contributing, plan review): PR #61's walkthrough says a missing file is skipped; the code stops with an error. CI's checks pass. What finds it?
- a quick check missed (contributing, plan review): PRs #70 and #71 each recorded a decision D-210, and #70 has merged. What does #71's contributor do?
- a comment (better-visuals, plan review): "ok but its infeasible to hsow all file changes, and we often need to explain it in a way thats easier tounderstand. like waht if we change 10 files, how do you expect to do here" (on "What “the real thing” means")
- a quick check missed (answer-on-the-video, walkthrough review): A frame draws three option cards, but its question has four options. What do you see?
- a quick check missed (answer-on-the-video, walkthrough review): A video built before the band stops at a question. Where does the band go?
- a quick check missed (answer-on-the-video, walkthrough review): You answered a quick check, and your pointer rests on the band. When does the video go on?
- a quick check missed (answer-on-the-video, walkthrough review): You have sent your review, and now switch a call's verdict in the record. What happens?
- an answer that asks what it means (better-visuals, plan review): Which scenes must show the real thing? — "what is 'the real thing' mean? need mroe first"
- "Explain this more" on a question (better-visuals, plan review): Which look should the review page take?
- a comment (better-visuals, plan review): "what is 'the real thing' mean? need mroe first" (on "Question 1: which scenes must show the real thing?")
- a word looked up (videos-you-can-follow, walkthrough review): choice
- a word looked up (videos-you-can-follow, walkthrough review): system video

## The videos this one leans on (a line each)

- none named

## The words this video gives a meaning

- **plan video** (defined in the video itself)
- **walkthrough video** (defined in the video itself)
- **own words** (defined in the video itself)
- **reel audit** (defined in the video itself)
- **accept all** (defined in the video itself)
- **plan.md**: the file a plan is written in: its problem, its steps and its questions for you
- **round**: one look by the two fresh agents: the author answers every finding, and they look again, three rounds at most
- **the author**: the agent that made the video
- **style guide**: the plan-to-video skill's rules for how a video is written and drawn (its section 5 holds the frame rules)

## The glossary (every word a viewer can look up)

- **The plan-to-video skill**: Turns a plan into a video, via HyperFrames.
- **narrate**: Voices the script, only the lines that changed since the last build; `reelplanning build` runs it, then finish-project and verify.
- **finish-project**: The assembly tail: captions → index → plan-map → the terms index (which video explains each word) → plan-diff → the details check.
- **plan-diff**: Content-hash diff vs. the last committed build.
- **spec-diff**: Which scenes of the system video a change to the system's description, its parts or this glossary reaches, so only those are rebuilt; it also names a row no scene explains yet.
- **The review player**: Where you watch, answer on the frame, mark, and press Finish.
- **The review server**: Serves the review page, takes the review when you press Send, keeps it in the inbox and hands it on once; sends the notifications.
- **The headless run**: The agent's own command, started by the review server when no session is waiting; auto mode, inside the sandbox, or without it (and the reviewer told) where this machine can't run it.
- **The reel CLI**: The command that keeps the project record: `reel record` logs a review's answers and files the review; `reel status` ends with memory.
- **The revise step**: Acts on a plan review: approved, folds the comments into the plan; changes requested, rewrites the steps a comment touched.
- **The implement step**: Builds what the plan says and logs each call the plan did not cover, with tags; its diff is then checked by a second, fresh agent (the code check).
- **The walkthrough fix step**: Acts on a walkthrough review: changes the code for each flagged call; on changes requested, rebuilds only those beats.
- **The system video**: One video explaining the whole repo; rebuilt where the spec changes.
- **A review**: One pass by a reviewer, filed once and never overwritten. The player's download is `annotations.json` until it is filed.
- **Approve / Request changes**: The verdict at Finish. Approve (on a walkthrough, the build is accepted): the comments are acted on, no new video. Request changes: they are acted on, the touched beats rebuilt, and the video shown again.
- **The inbox**: Reviews the review server has taken, each handed on once; not committed.
- **The sandbox**: The fence a headless run starts in: commands write only inside the repo, a hook keeps the file tools there too; checked before each run, and turned off, with the reviewer told, where it can't run (the hook stays).
- **A notification**: A desktop notice from the review server: a video is ready, with what it will ask, or a headless run has ended.
- **choice** (in the files: A call): A choice the agent made on its own while building, one the plan did not cover. Labelled *visible*, *hard-to-undo* or *close* when you might want to overturn it.
- **reel stops**: Which choices stop the walkthrough video: an off-plan change always, an unlabelled choice never, a labelled one until you have accepted that label ten times in a row, or again after a recent late fix with that label.
- **Memory**: What reviews show, worked out each time from the decision log and the filed reviews, never kept by hand: the lines `reel status` ends with, the evidence behind each in `reel memory <id>`; the reviewer's own, across repos, from `~/.reelplanning/you.jsonl`.
- **late fix** (in the files: A miss): A late fix: something a review let through that a later plan, fix or review had to change. A recent one makes choices with its label stop the video again, however many were accepted in a row.
- **label** (in the files: A tag): A label the agent puts on a choice it made alone, saying why you might want to look at it. Four kinds: *visible* (you'll notice it when you use the thing), *hard-to-undo* (changing it later costs real work), *close* (a toss-up: the other way was nearly as good), *deviation* (an off-plan change). A labelled choice stops the walkthrough video; an unlabelled one does not.
- **accepted in a row** (in the files: A streak): How many times in a row you accepted choices with the same label. At ten accepted in a row, choices with that label no longer stop the video; one flag starts the count again from zero.
- **off-plan change** (in the files: A deviation): An off-plan change: a choice where the agent did something other than what the plan said. It always stops the walkthrough video.
- **scene** (in the files: A beat): One scene of a video: a picture and a sentence or two of its voice. A video is a row of scenes; a question or a choice pauses at the end of its scene.
- **A chapter**: A stretch of one video under one title; the player shows "Chapter 2 of 4" as it begins, and N / P jump between them. Not a plan's step, and not a part of the system.
- **part of the system** (in the files: An area): One part of the system, drawn as a box: the review player, the review server and the rest of this table's ids. `system.json` calls it a component; the system video says "part".
- **A retro**: A plan of skill edits the memory's evidence supports, started when the status says one is due, and judged against a fixed benchmark.
- **grouped scene** (in the files: A grouped beat): One scene per chapter for the choices that don't stop: each can be flagged, and Accept all takes the rest.
- **A step**: One numbered part of a plan: one change, what it does and what it needs from another step; the video tells each in its own scenes. The system video tells its two loops in steps too.
- **Finish**: Where a review ends: you approve, or ask for changes, and send what you answered and marked.
- **The decision log**: Every answer you gave and every choice you accepted, one entry each, numbered across the repo (D-056); an entry is never edited, only added to or marked superseded.
- **A quick check**: A question on what the plan or the code will do; "Expected something else?" sends your words to the agent as a comment.
- **answer bar** (in the files: The answer band): A question is answered on the frame's cards when it has them (own words, a note, Accept / Flag beside them); a frame with no cards gets the bar in the lowest eighth it leaves empty, and only an older video without that gets it under the video; the video never changes size.
- **system-review**: Files a review of the system video and sorts each comment: fix the video, a small change, or a new plan.
- **A detail**: A page a beat opens over the paused frame, grown out of the thing it explains, for what the video cannot hold. The frame marks that thing; on the review page it is a button with a tab, "Open · <the page's title>": click it, or press O.
- **The Open chip**: The way into a detail where the frame marks nothing (an older video), or, on a phone, where the marked thing is too small to tap: a chip in the frame's corner; click it or press O. A scene that marks its thing has no chip.
- **The side panel**: Where the Terms and the answer bar's long words open: beside the stage on a wide window, covering it otherwise. A detail opens over the frame, not here.
- **The plan text**: The plan's own words, one section per step, with the current step lit; off until the Plan switch (L) turns it on, then beside the video or in the record.
- **The details check / check-details**: The check that every detail page works and that each frame marks only its own scene's detail, run by finish-project and verify; a broken detail page, or a frame marking a detail its scene does not have, stops the build.
- **The agent**: The AI coding assistant that does the work, in chat: it writes the plan, builds the code and makes the videos. Claude Code, Codex or opencode, whichever the repo uses.
- **The plan video**: The video of a plan, made before any code is written: its steps, and a question wherever a choice is yours. You answer on the video, and the plan is revised.
- **The walkthrough video / walkthrough**: The video made after the code is built: what was built, step by step, and each choice the agent made alone. You accept or flag each choice, then approve the build or ask for changes.
- **The code check**: A second, fresh agent that reads the built code against the plan and the decision log, from a short brief, and says where they differ; each finding is answered before the walkthrough video is made.
- **Fresh eyes**: Two fresh agents that look at every new or rebuilt video before you do, from a brief and a picture of each scene, never the plan: a newcomer, who lists what it could not follow, and a designer, who lists what breaks the frame rules. Every finding is answered before the page opens: fixed, given a meaning, or kept with a reason; what is kept after the third look is said on Before you watch.
- **The frame rules**: The style guide's seven rules for a frame a newcomer can read (§5): show the thing, never a stand-in; one reading order; each name on its thing; a question that says what you decide; nothing covering content; readable at a glance; pleasing. frame-lint fails the two a program can see; the designer of fresh eyes checks all seven.
- **frame-lint**: The check that reads a video's frames for what a program can see: among them, empty bars standing where words go, and anything in the room above a thing the player's Open tab sits on.
- **Ask about this**: In the player, paused on any scene: press Q, or click a caption word, and type a question. On a hosted page Claude answers from the plan, the glossary and the scene, and says where from; on your own machine the agent session waiting on the page answers, or, with none waiting, the question goes with your review. Every question is kept in the review.
- **A brief**: A short written description an agent starts from. A video's brief says who it is for, what it shows and how it looks; the code check's agent gets one saying what to compare.
- **The storyboard**: A video's plan, scene by scene: what each scene shows and says, and the tags the player reads, such as a question, a quick check or a word the scene explains.
- **reel audit / audit**: The check on a walkthrough: it fails while a finding of the code check is unanswered, or a step has five choices the agent made alone and no question asked.
- **A repo / repository**: A project's folder of code together with its whole history, kept with git (on GitHub, say).
- **A branch**: A line of work kept apart from the main code until it is merged.
- **Merge**: To bring a branch's changes into the main code. A pull request is merged when it is accepted.
- **A commit**: One saved change to a repo, with a message saying what changed; a repo's history is a row of them.
- **Clone**: To copy a repo, with its history, onto your own computer.
- **A diff**: The lines a change adds and removes, shown together.
- **A pull request / PR**: A change someone asks to have merged into a repo; others read it and comment before it goes in.
- **Squash**: To merge a pull request's commits as one commit.
- **CI**: The checks a repo runs by itself on every pull request (its tests, say), before anyone merges it.
- **A test suite**: All of a project's tests, run together to check that nothing broke.
- **A spec**: Two meanings here: one file of tests, run with the others by `npm test`; or the system's own description of its parts, `spec.md`.
- **Lint / linter**: A check that reads code or files for mistakes without running them.
- **A flag**: In a command, an option written after its name. On a choice in the walkthrough video, Flag is the answer that says "change this" (the other is Accept).
- **A prompt**: The words given to an agent to start it on a task.
- **A template**: A file to start from, filled in for each new use.
- **A dependency**: A package of someone else's code a project needs in order to run.
- **A terminal**: The window where you type commands.
- **CLI**: A command-line tool: a program you run by typing its name and options in a terminal.
- **HTML**: The language web pages are written in; each scene of a video is an HTML page.
- **CSS**: The rules for how a web page looks: its colours, sizes and where things sit.
- **JSON**: A plain-text format for data a program reads.
- **TTS**: Text to speech: the voice made from a video's script.
- **git**: The tool that keeps a repo's history: its commits and branches.
- **GitHub**: The website where many repos are kept and pull requests are reviewed.
- **npm**: The tool that installs a JavaScript project's packages and runs its scripts.
- **Plan mode**: Claude Code's mode where the agent plans in chat and changes nothing until you approve.
- **npx**: Runs a published package's command without installing it first, as in the two commands the review page shows when no review server is behind it.
- **Recommended**: The option a question's author suggests, marked on its card; the video plays what it leads to unless you pick another, and your memory counts how often you take it.
- **The real thing**: What a scene is about, shown as it is: the actual file, table, command output or screen, with its own words, instead of a picture about it.
- **A hosted page**: The review page published online as a Claude Artifact and opened from a link, not served from your own machine; there, Ask about this is answered by Claude, on your own account.
- **Walk me through it**: The button under a quick check once you have answered: it works that check's own case through, step by step, in a few plain sentences.

## The video, scene by scene

### Scene 1 · part: Why a video · look at this one

Picture: `shots/scene-01.png`

> An agent, the AI assistant that writes your code, hands you its plan: six steps, each step one numbered change, pages of text, and three questions at the very end. You skim it and say yes. Nobody answered the questions.

### Scene 2 · context only: it did not change, list nothing on it

Picture: `shots/scene-02.png`

> reelplanning turns that plan into a short narrated video, and you review it by watching. A review is one pass through it, kept as a file. The video is a row of scenes, each one picture and a sentence or two of voice, grouped into chapters.

_(scenes 3 to 9: not changed, not here)_

### Scene 10 · part: The review page · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Now the review page. Before the first play, a video says what to watch first: here, this video, with its length. And the Terms, in the side panel beside the video, say what each word means, in the scene you're on.

### Scene 11 · look at this one

Picture: `shots/scene-11.png`

> Before any video reaches you, fresh eyes look at it: two fresh agents that get only what a viewer gets. A newcomer lists what it couldn't follow; a designer, what makes a frame hard to read. Every finding is answered before the page opens: fixed, given a meaning, or kept with a reason. What was kept is listed here, on Before you watch, with why.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> The designer holds every frame to the frame rules, seven of them: show the thing, never a stand-in; one reading order; each name on the thing it names; a question that says what you decide; nothing covering content; readable at a glance; and pleasing. frame-lint, a check the build runs, fails the two a program can see. This frame, from an older video, broke both: grey lines where words go, and a button over its words.

### Scene 13 · look at this one

Picture: `shots/scene-13.png`

> A phrase fresh eyes flagged, and the author kept, gets a meaning: it's underlined, and a click shows it. Still lost? Pause, press Q or click a caption word, and Ask about this. On your own machine, the agent session waiting on the page answers, and says where from; with none waiting, your question goes with your review. On a hosted page, Claude answers.

### Scene 14 · context only: it did not change, list nothing on it

Picture: `shots/scene-14.png`

> Press L, and the plan text, the plan's own words, sits beside the video. When a scene holds more than a screen can, the thing it's about is marked, with an Open tab on it. Click it, and a detail, a page about that thing, grows over the paused frame. Where nothing is marked, the Open chip in the corner opens it. finish-project's details check tries every detail page, and every mark, first.
