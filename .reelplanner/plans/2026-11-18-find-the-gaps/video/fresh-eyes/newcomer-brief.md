# Fresh eyes: the newcomer's brief · Find the gaps: line up your picture, the agent's and the code

You are a newcomer to this project. You are about to watch "Find the gaps: line up your picture, the agent's and the code", a narrated video of 19 scenes,
the way a viewer would: the narration of each scene as it is said, and a picture of the scene at its last moment
as the review page shows it (the player's buttons, tabs and captions included). You also have what a viewer can
open on the page: the glossary, the meanings this video gives its own words, and a line on each earlier video this
one leans on. You have nothing else: not the plan, not the code, not what the author meant.

List every phrase or thing on screen you could not explain from what the video had shown **by then**, what you
guessed it means, and every question a newcomer would ask. A word with a meaning below counts as explained. A
plain phrase with no meaning (made of ordinary words, like "the saved review file" or "drops the video") counts as
unexplained when the video never says what it is or where it comes from. Be specific: say the scene, the words,
and what you would need to follow.

**This is a rebuild: look only at what it changed.** Scenes 2, 11 of the 19 are new or changed since
the last build, and those are what you look at. Scenes 1, 3, 10, 12 are here for context only,
the scene just before or after a changed one: they have not changed and had their look, so list nothing on them. The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.

A scene not here may have explained a phrase before the scene you look at: flag the phrase if that scene leaves you
unable to follow it, and the author will say where it is explained.

## The shape of newcomer.md (keep it exactly)

```
# Fresh eyes: newcomer · round 2 · stamp 8e22ff2650ce

- N1 · scene 4 · "the phrase or thing": what you could not explain, and what you guessed; why it matters
- N2 · scene 7 · …
```

One finding a line, numbered N1, N2 … in scene order, each starting with its scene (only scenes 2, 11). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- N3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## Viewers were lost on these before

What the people who review this project's videos did not follow in earlier videos (words they looked up, questions
they asked, "Explain this more", checks they missed). Watch for the same kind of phrase here.

- a quick check missed (find-the-gaps, plan review): A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?
- a quick check missed (find-the-gaps, plan review): On card c5, you press N: not sure. What comes next?
- a quick check missed (find-the-gaps, plan review): You say: 'and it should only go to the session I have open.' How is that claim marked?
- a word looked up (codex-first-class, plan review): codex
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

## The videos this one leans on (a line each)

- 2026-09-26-contributing: Several people, one repo: contributing with reelplanning: decisions D-306, D-171, D-200, D-201, D-202, D-213, D-215, D-305, D-310, D-311, D-312: how does the decision log scale to thousands of decisions?
- 2026-09-27-walkthroughs-that-help: Walkthroughs that help: see the build run, stop only where…: decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
- 2026-09-28-videos-that-make-sense: Videos that make sense: fresh eyes before you watch, a way…: decisions D-226, D-225, D-227, D-245, D-303: how do you find out what a phrase means?
- 2026-09-26-better-visuals: Better visuals: show the real thing, and a page that reads…: decisions D-142, D-167, D-166: which accent colour?; explains "look"
- 2026-09-26-case-study: A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170, D-247, D-304: who reviews each arm, and in what order?
- 2026-09-28-plan-guide: The plan guide: the video first, and a full page behind it…: decisions D-244, D-246, D-264, D-266: which is the source: plan.md, or the guide?
- 2026-09-29-explain-first: Explain first: a video of what is going on, before any plan: decisions D-248, D-249, D-250: after Plan this, how far does the plan lean on the…
- 2026-09-25-fewer-better-stops: The right calls stop, and the walkthrough stays short: decisions D-110, D-109, D-309: a step reaches its fifth call during the build. What does…
- 2026-09-24-memory: Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
- 2026-09-25-videos-you-can-follow: Videos you can follow: decisions D-128, D-129: where is "you watched it" kept?
- 2026-09-22-m3-revise-loop: The loop, what's left: an agent that runs it in the…: decisions D-082, D-085: what may a run nobody is watching do?
- 2026-09-27-details-in-the-frame: Details in the frame: click the thing a detail explains: decisions D-195, D-196: where does a detail open once you click the thing?
- 2026-10-11-codex-first-class: Codex as a first-class reelplanner agent: decision D-313: how far should remote reviews go?; explains "headless"
- 2026-09-22-close-the-lifecycle: Close the lifecycle: implement to the plan, walk it…: decision D-001: who checks that the code followed the plan?
- 2026-09-28-videos-that-make-sense--walkthrough: Videos that make sense: fresh eyes before you watch, a way…: decision D-232: ask about this opens in the side panel (where Terms and…
- 2026-09-22-richer-review: Richer review: more kinds of question, comments on marks…: decision D-005: which video-only feedback comes first?
- 2026-09-23-deep-dives: Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
- 2026-09-26-better-visuals--walkthrough: Better visuals: show the real thing, and a page that reads…: explains "verdict"

## The words this video gives a meaning

- **gap**: a place where two of the three pictures of the code disagree: yours, the agent's, or the code itself
- **round**: a short set of cards, at most six, about one topic, that the agent writes where a gap is likely and costly
- **card**: one question in a round: predict, assume or say
- **predict card**: a card that asks what the code does, holding the answer and the code's own lines, quoted
- **assume card**: a card that says what the agent assumes you want, which only you can answer
- **say card**: a card that asks you to explain how you think something works, in your own words
- **claim**: a stretch of your own words that says one thing about the code, checked on its own
- **fingerprint**: a short code worked out from some lines of a file, which changes when one character of them changes
- **fresh checker**: a new agent that never saw this conversation and answers each predict card from the code alone
- **session**: one conversation with your agent, open in a terminal or an app
- **You told me first**: the section of a plan that lists what a round settled, so the plan is written on it and its video doesn't ask it again
- **Got it**: settling a gap where the code is right: it goes into your memory as something you know
- **Change the plan**: settling a gap where you want it your way: it goes into the plan
- **The code is wrong**: settling a gap as a bug: it becomes a fix
- **Show me more**: settling a gap by asking for more: a longer card now, and one short video of the round's gaps at the end
- **not sure**: the answer when you have no picture of your own: a gap of its own kind, settled with Got it or Show me more
- **Skip the rest**: ends a round at any time, and the cards you skipped are listed in the plan as not checked
- **whisper**: the speech-to-text program the narration already uses, run on this machine
- **planned**: a picture of what this plan would build: it does not exist yet
- **pinned**: kept as it was when the round was made (the commit, and a fingerprint of each file), so a card quotes only what the code said then
- **config**: the repo's settings file for reelplanner, `.reelplanner/config.json`
- **AskUserQuestion**: Claude Code's own way for the agent to ask you a multiple-choice question in the chat
- **draw on a step**: mark the step's row with the player's pen, to leave a note on that step
- **recommended**: the option a question's author suggests, marked on its card

## The glossary (every word a viewer can look up)

- **The plan-to-video skill**: The instructions the agent follows for this whole way of working: turning a plan into a video, then building the change and making its walkthrough video.
- **narrate**: Voices the script, only the lines that changed since the last build; `reelplanner build` runs it, then finish-project and verify.
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
- **The inbox**: Reviews the review server has taken, each handed on once; not committed. A repo not set up has it in this machine's `~/.reelplanner/inbox/<repo-key>/`.
- **The sandbox**: The fence a headless run starts in: commands write only inside the repo, a hook keeps the file tools there too; checked before each run, and turned off, with the reviewer told, where it can't run (the hook stays).
- **A notification**: A desktop notice from the review server: a video is ready, with what it will ask, or a headless run has ended.
- **choice** (in the files: A call): A choice the agent made on its own while building, one the plan did not cover. Labelled *visible*, *hard-to-undo* or *close* when you might want to overturn it.
- **reel stops**: Which choices pause the walkthrough video: an off-plan change always, a choice labelled *visible* or *hard-to-undo*, and one sharing a label with a recent late fix; every other choice goes on the list at the end.
- **Memory**: What reviews show, worked out each time from the decision log and the filed reviews, never kept by hand: the lines `reel status` ends with, the evidence behind each in `reel memory <id>`; the reviewer's own, across repos, from `~/.reelplanner/you.jsonl`.
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
- **A video's depth / depth**: How deep a video's checks go, set in its brief: low (about two minutes, and no fresh eyes but the fact check), medium, the default (one round of fresh eyes, a cosmetic finding noted rather than redrawn), or high (two rounds, every finding fixed or answered).
- **The frame rules**: The style guide's seven rules for a frame a newcomer can read (§5): show the thing, never a stand-in; one reading order; each name on its thing; a question that says what you decide; nothing covering content; readable at a glance; pleasing. frame-lint fails the two a program can see; the designer of fresh eyes checks all seven.
- **frame-lint**: A check that reads each frame of a video for problems a program can spot, such as an empty bar where words should be, or something in the way of a thing the video points at.
- **Ask about this**: Ask a question about the scene you're on: press Q, or click a word in the captions, and type it. An agent answers it from the plan and the scene when one is there to answer (on a hosted page, Claude), and every question is kept with your review.
- **A brief**: A short written description an agent starts from. A video's brief says who it is for, what it shows and how it looks; the code check's agent gets one saying what to compare.
- **The storyboard**: A video's plan, scene by scene: what each scene shows and says, and the tags the player reads, such as a question, a quick check or a word the scene explains.
- **reel audit / audit**: The check on a walkthrough: it fails while a finding of the code check is unanswered, or a step has five choices the agent made alone and no question asked.
- **The explainer**: A video that explains something already there (some code, a log, a transcript, a session's changes), made when you ask, so you understand it before deciding anything. It asks you nothing; at the end you choose Done, Explain more or Plan this, and a plan can start from it.
- **a round** (in the files: The alignment round): A few cards (at most six) the agent writes where you and it most likely picture the code differently, before a plan or whenever you ask: some ask you to predict what the code does, checked against its own lines; some say what the agent assumes you want, for you to confirm. Each gap you find is settled in one click: you learn it, the plan changes, or the code is fixed. It adds nothing to the decision log.
- **The guide**: The page under a video, with what the video cannot hold: every case, every command, every decision, and after the build every changed line and the real runs. Scroll down from the video to read it; the video goes on in a small player in the corner. Select any words on it to comment, suggest an edit or ask.
- **An agent adapter**: The small boundary for an agent's feature checks, launch and permission advice, live notification and conversation sources. The review workflow, storage and completion stay shared.
- **A terminal review pane**: The existing review player opened beside the coding agent through terminal-browser or cmux. The same questions, comments and Send use the same inbox; after a Send a session took, the server closes it, and the agent opens the new version in a new one.
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
- **reelplanning**: Reelplanner's name until October 2026 (D-312). Plans, reviews, pages and videos made before then keep it, as they were written.
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

### Scene 1 · part: Three pictures of the same code · context only: it did not change, list nothing on it

Picture: `shots/scene-01.png`

> You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> If you're new, four things this plan builds on. Send hands your review to an agent session that is waiting for it, the one you opened this page from; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3 · context only: it did not change, list nothing on it

Picture: `shots/scene-03.png`

> Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying the hand-off to a waiting session once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.

_(scenes 4 to 9: not changed, not here)_

### Scene 10 · context only: it did not change, list nothing on it

Picture: `shots/scene-10.png`

> Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 11 · part: Step 3: your own words · look at this one

Picture: `shots/scene-11.png`

> Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session, as you chose, splits your words into claims, each checked against the code. Say you said: it goes to my session. A match. If I'm not there, it waits. A gap, in this repo. It should tell me when it's taken: that says should, so it's neither a match nor a gap. It comes back as an assume card, next in this same round.

### Scene 12 · context only: it did not change, list nothing on it

Picture: `shots/scene-12.png`

> Quick check. On card c five, you press N, for not sure. What comes next?
