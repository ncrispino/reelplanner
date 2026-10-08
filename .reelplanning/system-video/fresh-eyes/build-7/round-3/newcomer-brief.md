# Fresh eyes: the newcomer's brief · reelplanning: the whole system

You are a newcomer to this project. You are about to watch "reelplanning: the whole system", a narrated video of 45 scenes,
the way a viewer would: the narration of each scene as it is said, and a picture of the scene at its last moment
as the review page shows it (the player's buttons, tabs and captions included). You also have what a viewer can
open on the page: the glossary, the meanings this video gives its own words, and a line on each earlier video this
one leans on. You have nothing else: not the plan, not the code, not what the author meant.

List every phrase or thing on screen you could not explain from what the video had shown **by then**, what you
guessed it means, and every question a newcomer would ask. A word with a meaning below counts as explained. A
plain phrase with no meaning (made of ordinary words, like "the saved review file" or "drops the video") counts as
unexplained when the video never says what it is or where it comes from. Be specific: say the scene, the words,
and what you would need to follow.

**This is a rebuild: look only at what it changed.** Scenes 1, 2, 3, 4, 11, 14, 33, 38, 45 of the 45 are new or changed since
the last build, and those are what you look at. Scenes 5, 10, 12, 13, 15, 32, 34, 37, 39, 44 are here for context only,
the scene just before or after a changed one: they have not changed and had their look, so list nothing on them. The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.

A scene not here may have explained a phrase before the scene you look at: flag the phrase if that scene leaves you
unable to follow it, and the author will say where it is explained.

## The shape of newcomer.md (keep it exactly)

```
# Fresh eyes: newcomer · round 3 · stamp 4ac8a356e92d

- N1 · scene 4 · "the phrase or thing": what you could not explain, and what you guessed; why it matters
- N2 · scene 7 · …
```

One finding a line, numbered N1, N2 … in scene order, each starting with its scene (only scenes 1, 2, 3, 4, 11, 14, 33, 38, 45). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## Viewers were lost on these before

What the people who review this project's videos did not follow in earlier videos (words they looked up, questions
they asked, "Explain this more", checks they missed). Watch for the same kind of phrase here.

- a word looked up (explain-first, walkthrough review): agent
- a comment (explain-first, walkthrough review): "oh i think we want to integrate this a bit more, like it should suggest based on that video what explain more would mean or waht plan this would mean, not just templated" (on "Step 3: Finish, and choices A9 and A13")
- an answer that asks what it means (explain-first, plan review): Is an explainer's whole source there to read, behind the video? — "i think we need to note the explainer is for many different things; we might not always be doing changes within an agent session, we might be doing outs…
- a comment (explain-first, plan review): "i think we need to note the explainer is for many different things; we might not always be doing changes within an agent session, we might be doing outside of it, so its different what we want to see, it might be files…
- a quick check missed (explain-first, plan review): On Monday you ask about the review server; by Friday, seven commits have changed it. What plays on Friday?
- a quick check missed (explain-first, plan review): You comment “this looks wrong” on a branch's explainer and press Done. What goes into the decision log?
- a quick check missed (explain-first, plan review): A CI log's explainer quotes a line holding a GitHub access key. What does the build do?
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

## The videos this one leans on (a line each)

- none named

## The words this video gives a meaning

- **own words** (defined in the video itself)
- **plan.md**: the file a plan is written in: its problem, its steps and its questions for you
- **walkthrough.md**: the file the agent writes as it builds: what landed in each step, and each choice it made on its own
- **spec.md**: the project's description of itself, in plain prose: what it is for, its parts and its rules
- **system.json**: the project's parts and how they connect, as data
- **interface**: what a step adds that you use: a command and its flags, a file's fields, what a page shows
- **HyperFrames**: the video framework that draws each scene as an HTML page and renders the video
- **maintainer**: a person who decides what goes into a repo
- **author**: the agent that made a video
- **glossary**: the project's list of words, one name per thing, each with its meaning
- **pr-check**: the command that says where a pull request stands: waiting on its video, on a review, or ready to merge
- **case**: one kind of input or situation a step handles, with a real example
- **reel-intake**: the command that files a review that came as a row of a hosted page: it checks the row, then records it like any other
- **the list**: the walkthrough video's last scene: every choice that doesn't pause, one line each, with its own Flag
- **reel fold**: the command that gathers a part's many rules into one section of spec.md, once the owner says yes
- **past choice**: a choice the agent made on its own in an earlier build, kept in its walkthrough.md
- **pipeline**: the third level, all of reelplanning: your answers kept as decisions that later plans are checked against, every review kept, walkthrough videos and the system video

## The glossary (every word a viewer can look up)

- **The plan-to-video skill**: The instructions the agent follows for this whole way of working: turning a plan into a video, then building the change and making its walkthrough video.
- **narrate**: Voices the script, only the lines that changed since the last build; `reelplanning build` runs it, then finish-project and verify.
- **finish-project**: The last stage of building a video: it adds the captions and the page, ties each scene to the plan, and checks the result.
- **plan-diff**: Content-hash diff vs. the last committed build.
- **spec-diff**: Which scenes of the system video a change to the system's description, its parts or this glossary reaches, so only those are rebuilt; it also names a row no scene explains yet.
- **The review player**: The video player on the review page. You watch, answer the video's questions, mark and comment on what you see, and press Finish to send your review.
- **The review server**: Serves the review page, takes the review when you press Send, keeps it in the inbox and hands it on once; sends the notifications.
- **The headless run**: The agent's own command, started by the review server when no session is waiting; auto mode, inside the sandbox, or without it (and the reviewer told) where this machine can't run it.
- **The reel CLI**: The command that keeps the project's record: its plans, reviews and decisions. For example, `reel record` files a review and logs your answers, and `reel status` says what is waiting.
- **The revise step**: What the agent does with your review of a plan. If you approved it, it works your comments into the plan; if you asked for changes, it rewrites the steps your comments touched.
- **The implement step**: The agent building what the approved plan says, and noting each choice the plan left open. A second agent then checks the code against the plan: the code check.
- **The walkthrough fix step**: Acts on a walkthrough review: changes the code for each flagged call; on changes requested, rebuilds only those beats.
- **The system video**: One video that explains the whole project: its parts and how they work together. It is updated whenever the project's description of itself changes.
- **A review**: One pass by a reviewer, filed once and never overwritten. The player's download is `annotations.json` until it is filed.
- **Approve / Request changes**: The verdict at Finish. Approve (on a walkthrough, the build is accepted): the comments are acted on, no new video. Request changes: they are acted on, the touched beats rebuilt, and the video shown again.
- **The inbox**: Reviews the review server has taken, each handed on once; not committed.
- **The sandbox**: The fence a headless run starts in: commands write only inside the repo, a hook keeps the file tools there too; checked before each run, and turned off, with the reviewer told, where it can't run (the hook stays).
- **A notification**: A desktop notice from the review server: a video is ready, with what it will ask, or a headless run has ended.
- **choice** (in the files: A call): A choice the agent made on its own while building, one the plan did not cover. Labelled *visible*, *hard-to-undo* or *close* when you might want to overturn it.
- **reel stops**: Which choices pause the walkthrough video: an off-plan change always, a choice labelled *visible* or *hard-to-undo*, and one sharing a label with a recent late fix; every other choice goes on the list at the end.
- **Memory**: What reviews show, worked out each time from the decision log and the filed reviews, never kept by hand: the lines `reel status` ends with, the evidence behind each in `reel memory <id>`; the reviewer's own, across repos, from `~/.reelplanning/you.jsonl`.
- **late fix** (in the files: A miss): A late fix: something a review let through that a later plan, fix or review had to change. A recent one makes choices with its label pause the walkthrough video.
- **label** (in the files: A tag): A label the agent puts on a choice it made alone, saying why you might want to look at it. Four kinds: *visible* (you'll notice it when you use the thing), *hard-to-undo* (changing it later costs real work), *close* (a toss-up: the other way was nearly as good), *deviation* (an off-plan change). A choice labelled *visible* or *hard-to-undo* pauses the walkthrough video; the rest go on the list at the end.
- **off-plan change** (in the files: A deviation): An off-plan change: a choice where the agent did something other than what the plan said. It always stops the walkthrough video.
- **scene** (in the files: A beat): One scene of a video: a picture and a sentence or two of its voice. A video is a row of scenes; a question or a choice pauses at the end of its scene.
- **A chapter**: A stretch of one video under one title; the player shows "Chapter 2 of 4" as it begins, and N / P jump between them. Not a plan's step, and not a part of the system.
- **part of the system** (in the files: An area): One part of the system, drawn as a box: the review player, the review server and the rest of this table's ids. `system.json` calls it a component; the system video says "part".
- **A retro**: A plan of skill edits the memory's evidence supports, started when the status says one is due, and judged against a fixed benchmark.
- **grouped scene** (in the files: A grouped beat): In older walkthrough videos, one scene per chapter listing the agent's smaller choices, the ones the video doesn't stop on. You flag any you'd change, and Accept all takes the rest.
- **A step**: One numbered part of a plan: one change, what it does and what it needs from another step; the video tells each in its own scenes. The system video tells its two loops in steps too.
- **Finish**: Where a review ends: you approve, or ask for changes, and send what you answered and marked. An explainer's ends instead with Done, Explain more or Plan this.
- **The decision log**: The record of every answer you gave and every choice you accepted, one numbered entry each (D-056). An entry is never changed; a later one can replace it.
- **A quick check**: A short question the video asks you about what the plan or the code will do, to check you followed. If you expected something else, you can say so, and your words go to the agent as a comment.
- **answer bar** (in the files: The answer band): A question is answered on the frame's cards when it has them (own words, a note, Accept / Flag beside them); a frame with no cards gets the bar in the lowest eighth it leaves empty, and only an older video without that gets it under the video; the video never changes size.
- **system-review**: Files a review of the system video and sorts each comment: fix the video, a small change, or a new plan.
- **part of the guide** (in the files: A part of the guide / guide part): One section of the page under the video, about one thing a scene shows: click that thing in the video, or press O, and the page scrolls to its section while the video pauses. A scene can instead open a small page of its own over the video.
- **The Open chip**: The way into a detail where the frame marks nothing (an older video), or, on a phone, where the marked thing is too small to tap: a chip in the frame's corner; click it or press O. A scene that marks its thing has no chip.
- **The side panel**: Where the Terms and the answer bar's long words open: beside the stage on a wide window, covering it otherwise. A detail opens over the frame, not here.
- **The plan text**: The plan's own words, shown beside the video with the current step highlighted. It is off until you turn it on with the Plan switch, or press L.
- **The details check / check-details**: The check that every detail page works and that each frame marks only its own scene's detail, run by finish-project and verify; a broken detail page, or a frame marking a detail its scene does not have, stops the build.
- **The agent**: The AI coding assistant that does the work, in chat: it writes the plan, builds the code and makes the videos. Claude Code, Codex or opencode, whichever the repo uses.
- **The plan video**: The video of a plan, made before any code is written: its steps, and a question wherever a choice is yours. You answer on the video, and the plan is revised.
- **The walkthrough video / walkthrough**: The video made after the code is built: what was built, step by step, and each choice the agent made alone. You accept or flag each choice, then approve the build or ask for changes.
- **The code check**: A second agent, which has not seen the work, reads the built code against the plan and the earlier decisions, and lists where they differ. Each thing it finds is answered before the walkthrough video is made.
- **Fresh eyes**: Two new agents that look at every new or rebuilt video before you do, knowing nothing of the plan: one lists what a newcomer couldn't follow, the other what breaks the rules for a clear frame. Everything they find is fixed or answered before the video reaches you.
- **The frame rules**: The style guide's seven rules for a frame a newcomer can read (§5): show the thing, never a stand-in; one reading order; each name on its thing; a question that says what you decide; nothing covering content; readable at a glance; pleasing. frame-lint fails the two a program can see; the designer of fresh eyes checks all seven.
- **frame-lint**: A check that reads each frame of a video for problems a program can spot, such as an empty bar where words should be, or something in the way of a thing the video points at.
- **Ask about this**: Ask a question about the scene you're on: press Q, or click a word in the captions, and type it. An agent answers it from the plan and the scene when one is there to answer (on a hosted page, Claude), and every question is kept with your review.
- **A brief**: A short written description an agent starts from. A video's brief says who it is for, what it shows and how it looks; the code check's agent gets one saying what to compare.
- **The storyboard**: A video's plan, scene by scene: what each scene shows and says, and the tags the player reads, such as a question, a quick check or a word the scene explains.
- **reel audit / audit**: The check on a walkthrough: it fails while a finding of the code check is unanswered, or a step has five choices the agent made alone and no question asked.
- **The explainer**: A video that explains something already there (some code, a log, a transcript, a session's changes), made when you ask, so you understand it before deciding anything. It asks you nothing; at the end you choose Done, Explain more or Plan this, and a plan can start from it.
- **The guide**: The page under a video, with what the video cannot hold: every case, every command, every decision, and after the build every changed line and the real runs. Scroll down from the video to read it; the video goes on in a small player in the corner. Select any words on it to comment, suggest an edit or ask.
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
- **A hosted page**: The review page published online and opened from a link (a Claude Artifact), rather than run on your own computer. There, Claude answers Ask about this, on your own account.
- **Before you watch**: The card the review page shows before a video first plays: the videos to watch first, and what fresh eyes left as it is (the findings the author kept), each with why.
- **Walk me through it**: The button under a quick check once you have answered: it works that check's own case through, step by step, in a few plain sentences.

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

> You choose how much of it you use. The basic unit is one video: a plan video, or an explainer, a video of something already there. Add a walkthrough after the build, if you want, or take the whole pipeline: your answers kept as decisions, every review on record, and the system video kept current. From here on, this video shows the whole pipeline.

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
