# Fresh eyes: the newcomer's script brief · video

You are a newcomer to this project, reading the script of "video", a narrated video of 18 scenes,
before any picture is drawn: what each scene will show and what it says. You also have what the person who asked for
the video said, in their words. You have nothing else: not the plan, not the code.

Read it as the person would watch it, and list:

- **What they asked that it does not do.** Their words are first below: a thing they asked to see that the video
  only names or describes, a question they asked that it does not answer.
- **Where it loses the big picture.** A video that goes step by step, in the order things are built, before saying
  what the whole is and why: say where you first needed the whole and did not have it.
- **Every word or phrase you could not explain from what the script had said by then**, and what you guessed. A word
  with a meaning below counts as explained.
- **What the plan itself leaves out**, as far as the script shows it (a step, a case, a cost): mark those `[plan]`.

## The shape of newcomer.md (keep it exactly)

```
# Fresh eyes: newcomer · script · stamp e8979f180a56

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
```

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

- "oh there is a claude mod that lets you add windows and stuff within claude so we can view the plan in a terminal".
- "Pls create a branch. Our goal is to get codex fully working, fully featured on reelplanner as an alternative so it is first-class like claude code"; "oh i am not sure about the claude artifact euqivalent i ahven used in codex. do look into that and codex if it has something similar to claude plugisn and mods though too".
- "wait i have to download annotations it wont just tell codex its ready??"
- "also i mean we should just be clear that we need the coding to be good. there should be clear about the interface so we dont create a whole bunch of unnecessary repetitive code, make it really easy to add if there are special harness support needed."
- "this is also a gneeral thing, i think we need to just be sure the language i clear, like claude seems to have provided clearer language that makes sense, there is a bit too much domain specific technical langugae"

### Their last review

# Plan review · 2026-10-11 18:27 UTC · changes requested

**Changes requested:** revise the steps below, rebuild the beats they touch, and show the plan video again.

What to act on, from [plan-20261011T182741Z.json](plan-20261011T182741Z.json): 1 decision, 3 quick checks, 3 marks; watched 100%.

## Decisions

- **Q1** (step 5) How far should remote reviews go?: **Local loop + portable exports** (the recommendation) → D-313

## Steps to revise

- **Step 2**
  - quick check missed: "Edit applied; signing fails. Review status?" — answered "Done because the edit exists", the answer is "Pending with stopped-run evidence". Explain this step so that answer is obvious.
- **Step 5**
  - comment at 4:34 (Step 5 · Match terminal review and choose remote path): "this is also a gneeral thing, i think we need to just be sure the language i clear, like claude seems to have provided clearer language that makes sense, there is a bit too much domain specific technical langugae"
- **Not on a step**
  - comment at 1:20 (A · Transfer the review file): "wait i have to download annotations it wont just tell codex its ready??"
  - comment at 1:53 (Rules this proposal keeps): "also i mean we should just be clear that we need the coding to be good. there should be clear about the interface so we dont create a whole bunch of unnecessary repetitive code, make it really easy to add if there are special harness support needed."


## The words this video gives a meaning

- **adapter**: a small module containing only what one coding agent does differently
- **Claude /reel · ccr-7d2997e8-elkd7p · d09b72d**: the native Claude reel pane source inspected on branch ccr-7d2997e8-elkd7p at commit d09b72d. This is source inspection, not a passed Codex runtime trial
- **--session codex:<id>**: proposed connection to the active runtime thread. Validate its repo and identity first. Failed or stale delivery retains the saved inbox work
- **parity**: the same usable supported review outcomes. native visual appearance need not be identical
- **authenticated hosted spike**: a working scratch investigation of signed-in storage, automatic submission and question handoff. service design and deployment are reviewed separately
- **first acceptance bar**: the evidence required before calling the proposed local Codex workflow tested. automatic hosted parity depends on the selected remote scope
- **codex intake**: the agent records the reviewer-exported annotations.json locally after the reviewer transfers it
- **no automatic remote answering**: remote Ask about this questions require a manual transfer to a live agent and a manually returned reply in export-only option A
- **Codex handoff**: the proposed service delivers durable saved review work to an identified Codex session
- **Separate service review**: the owner reviews the working scratch results and a concrete implementation, hosting and cost proposal before service deployment
- **isolated Codex settings folder**: a temporary CODEX_HOME used for clean installation tests. it does not change the owner’s normal configuration
- **public plugin directory**: the public catalog of plugin packages. bundled hooks currently require separate manual installation and trust
- **--approve-for-me**: the supported Codex automatic reviewer flag. requests still need an eligible approval policy and may be denied
- **waiting session**: a session already running the review --wait command and waiting for an inbox item
- **connected session**: the exact Codex session explicitly linked to the review server through its current thread identity
- **CODEX_THREAD_ID**: the active session identity supplied by supported Codex runtimes. use the verified current thread when connecting
- **CODEX_HOME**: the Codex settings and history root. a person may choose a custom location, and scratch installation tests use a temporary one
- **sources.json**: the explainer’s source record inside its project folder, containing the external source path, hash and size instead of private transcript contents
- **local-review-url**: the localhost browser address printed by reelplanner review for a served HTML player. a bundle is a separate portable export
- **exported identity**: reviewer metadata carried with a manually exported review. this does not prove authenticated service identity
- **main conversation**: the primary implementation session, excluding independent checker and subagent sessions
- **checker conversation**: a separate independent review session, not the active primary source
- **audited branch**: ccr-7d2997e8-elkd7p, inspected at commit d09b72d. this source comparison was not merged and is not Codex runtime evidence
- **ccr-7d2997e8-elkd7p**: the inspected source branch containing Claude’s native /reel Mods pane
- **d09b72d**: the inspected commit on that branch, where the source includes picture and sound synchronization
- **Mods**: Claude’s native API for panes and widgets
- **owning-repo**: the project repository a review belongs to
- **multi**: a question allowing multiple answers
- **ancestor**: an earlier plan in the project library
- **bundle**: a portable package of player files
- **mock**: a simulated test substitute
- **terminal-browser**: a standalone browser pane for a terminal workspace
- **plugin**: a package of agent extensions
- **skill**: instructions an agent follows
- **hook**: a trusted command at a lifecycle event
- **MCP**: the connection protocol for external tools and compatible interfaces
- **Artifact**: a hosted interactive Claude page with runtime services
- **CLI**: the command-line interface
- **database**: durable stored records
- **headless**: an agent run with no session already open
- **sandbox**: the boundary limiting file writes and network access
- **escalation**: a request to execute an operation outside that boundary
- **inbox**: the durable record of pending review work
- **queue**: a message addressed to a particular Codex session
- **claim**: the ownership marker that prevents duplicate processing
- **transcript**: the saved conversation
- **hash**: a fingerprint used to detect source changes
- **manifest**: the package description file
- **lifecycle**: the complete installation-to-reviewed-build workflow
- **repo**: the project repository
- **runtime**: the services available while an interface runs
- **authenticated**: identified and authorized by a sign-in check
- **paginated history**: saved conversation storage read in bounded pieces
- **parser**: the command reader that checks accepted flags
- **signing**: cryptographic proof attached to a commit
- **bridge**: the service that transfers a remote review to the project
- **rollout**: a legacy saved Codex conversation file
- **regression**: a test that existing behavior still works
- **mocked**: simulated rather than exercised with the real session
- **flag**: a reviewer request to fix a choice
- **specs**: automated tests of expected behavior
- **UI**: the user interface
- **intake**: recording a submitted review in the project
- **Codex**: OpenAI’s coding agent
- **ChatGPT Sites**: hosted apps and stored data in supported ChatGPT accounts
- **Visualization**: an interactive visual supported in ChatGPT chats
- **deploy**: publish and run a service for people to reach
- **checkout**: a local working copy of the repository
- **render**: produce the visible image or video
- **marketplace**: a catalog of installable plugins
- **pane**: a separate view inside a terminal workspace
- **cmux**: a terminal workspace that can put a real browser beside an agent
- **binding decisions**: earlier answers that later plans must keep
- **case study**: a comparison that tests a complete workflow
- **deep dive**: an expanded view of the evidence
- **review**: the person’s approval, answers and comments
- **agent**: the coding assistant
- **step**: one implementation task
- **headless run**: an agent run without an existing open session
- **walkthrough video**: a video showing the built change running
- **explainer**: a video explaining evidence or existing behavior
- **guide**: the full plan text beside the video
- **quick check**: a prediction question testing the explained rule
- **code check**: an independent agent review of the implemented changes
- **ask about this**: the player’s button for asking a question about a scene
- **memory**: saved learning from earlier reviews
- **complete-lifecycle**: the entire process from installation through reviewed changes
- **API**: the supported interface for software extensions

## The glossary

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
- **choice**: A choice the agent made on its own while building, one the plan did not cover. Labelled *visible*, *hard-to-undo* or *close* when you might want to overturn it.
- **reel stops**: Which choices pause the walkthrough video: an off-plan change always, a choice labelled *visible* or *hard-to-undo*, and one sharing a label with a recent late fix; every other choice goes on the list at the end.
- **Memory**: What reviews show, worked out each time from the decision log and the filed reviews, never kept by hand: the lines `reel status` ends with, the evidence behind each in `reel memory <id>`; the reviewer's own, across repos, from `~/.reelplanner/you.jsonl`.
- **late fix**: A late fix: something a review let through that a later plan, fix or review had to change. A recent one makes choices with its label pause the walkthrough video.
- **label**: A label the agent puts on a choice it made alone, saying why you might want to look at it. Four kinds: *visible* (you'll notice it when you use the thing), *hard-to-undo* (changing it later costs real work), *close* (a toss-up: the other way was nearly as good), *deviation* (an off-plan change). A choice labelled *visible* or *hard-to-undo* pauses the walkthrough video; the rest go on the list at the end.
- **off-plan change**: An off-plan change: a choice where the agent did something other than what the plan said. It always stops the walkthrough video.
- **scene**: One scene of a video: a picture and a sentence or two of its voice. A video is a row of scenes; a question or a choice pauses at the end of its scene.
- **A chapter**: A stretch of one video under one title; the player shows "Chapter 2 of 4" as it begins, and N / P jump between them. Not a plan's step, and not a part of the system.
- **part of the system**: One part of the system, drawn as a box: the review player, the review server and the rest of this table's ids. `system.json` calls it a component; the system video says "part".
- **A retro**: A plan of skill edits the memory's evidence supports, started when the status says one is due, and judged against a fixed benchmark.
- **grouped scene**: In older walkthrough videos, one scene per chapter listing the agent's smaller choices, the ones the video doesn't stop on. You flag any you'd change, and Accept all takes the rest.
- **A step**: One numbered part of a plan: one change, what it does and what it needs from another step; the video tells each in its own scenes. The system video tells its two loops in steps too.
- **Finish**: Where a review ends: you approve, or ask for changes, and send what you answered and marked. An explainer's ends instead with Done, Explain more or Plan this.
- **The decision log**: The record of every answer you gave and every choice you accepted, one numbered entry each (D-056). An entry is never changed; a later one can replace it.
- **A quick check**: A short question the video asks you about what the plan or the code will do, to check you followed. If you expected something else, you can say so, and your words go to the agent as a comment.
- **answer bar**: A question is answered on the frame's cards when it has them (own words, a note, Accept / Flag beside them); a frame with no cards gets the bar in the lowest eighth it leaves empty, and only an older video without that gets it under the video; the video never changes size.
- **system-review**: Files a review of the system video and sorts each comment: fix the video, a small change, or a new plan.
- **part of the guide**: One section of the page under the video, about one thing a scene shows: click that thing in the video, or press O, and the page scrolls to its section while the video pauses. A scene can instead open a small page of its own over the video.
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

### Scene 1 · A complete alternative

_Shows:_ A complete alternative

_Says:_ You should be able to finish the same review loop with Codex or Claude Code. This proposal changes installation, review follow-up, conversation discovery and lifecycle proof. The branch is feat/codex-first-class; integration behavior remains proposed.

### Scene 2 · The same review with either agent

_Shows:_ The same review with either agent

_Says:_ The goal is the same review experience with either agent: watch with sound, answer choices, leave comments, press Send and see the revised video. Codex can install the instructions as a plugin. The existing browser player handles review. We will test a browser beside Codex in the terminal. A hosted Claude page has extra services; we have not found a proven Codex replacement.

### Scene 3 · Your chosen scope: A

_Shows:_ Your chosen scope: A

_Says:_ You chose A: finish the local Codex workflow and check portable reviews. That scope is settled. Local Send goes directly to the project and notifies Codex. Automatic delivery from a hosted page elsewhere stays outside this change.

### Scene 4 · Local Send needs no download

_Shows:_ Local Send needs no download

_Says:_ On this machine, press Send. The project saves your answers and comments, then the waiting Codex session receives the review. That is how your first review reached us: you did not download anything. A file transfer is needed only for a disconnected portable copy reviewed elsewhere.

### Scene 6 · One workflow, small agent differences

_Shows:_ One workflow, small agent differences

_Says:_ Good code means one shared review workflow: save, notify, review and fix, then commit. Small agent adapters contain only the differences: check available features, launch with the right permissions, notify the right session, and find its saved conversation. Adding another agent should mean adding those small functions. Keep one player, one server and one inbox, the saved pending reviews. Earlier answers still bind the plan; independent checks and real walkthroughs still apply. The guide holds the exact function contract.

### Scene 7 · Step 1 · Native installation

_Shows:_ Step 1 · Native installation

_Says:_ Step one stands alone. Package reelplanner natively for Codex; preserve Claude’s skill install. Validate these proposed commands in an isolated Codex settings folder. The marketplace is the plugin catalog. The skill supplies instructions; CLI and video tools still need setup. Diagnostics name missing tools. Optional hooks need manual local trust; the public plugin directory excludes bundled hooks.

### Scene 8 · Step 2 · Edited files can still be unfinished

_Shows:_ Step 2 · Edited files can still be unfinished

_Says:_ Step two uses the feature checks from step one. Starting Codex with no session open is enabled only when you ask. It must follow the allowed permissions and preserve commit signing. Here is the failure case: the files were edited, but the signing key is unavailable. The commit fails. The work is still unfinished. Show Stopped before commit and keep the edits and log. Fix signing, then retry from that work. Only a successful commit allows the review to be marked done.

### Scene 9 · Quick check · Installation

_Shows:_ Quick check · Installation

_Says:_ A teammate installs the plugin without video tools. Does installation prove the lifecycle, or should diagnostics name missing tools?

### Scene 10 · Step 3 · Save, then notify Codex

_Shows:_ Step 3 · Save, then notify Codex

_Says:_ Step three uses installation and the safe follow-up from step two. First save the review. Then notify the session already waiting, or the verified connected Codex session. If neither is available, use an explicitly configured new run; otherwise keep the review for the next session. Only one agent handles the saved item. Notification means the message arrived, not that the work finished. Ask about this saves a question for a live session; a disconnected question waits rather than starting a new run.

### Scene 11 · Quick check · Stopped before commit

_Shows:_ Quick check · Stopped before commit

_Says:_ A different change passes its checks, but commit signing fails. The files are edited. Is the review finished, still unfinished with its edits saved, or should the server commit for Codex?

### Scene 12 · Step 4 · This conversation means this one

_Shows:_ Step 4 · This conversation means this one

_Says:_ Step four stands alone. A transcript is the saved conversation. Match active Codex identity and repo, not the newest session. Support current paginated history as well as observed old storage. A missing active source requires an explicit transcript path. Pin path, hash and size only; the private text stays outside Git.

### Scene 13 · Quick check · A question after disconnection

_Shows:_ Quick check · A question after disconnection

_Says:_ The connected session closes, then a question arrives. Yesterday’s headless setting exists. Does the question launch work, vanish, or stay saved?

### Scene 14 · Step 5 · Send here; transfer only elsewhere

_Shows:_ Step 5 · Send here; transfer only elsewhere

_Says:_ Step five tests the same player in the ordinary browser and beside Codex in a terminal workspace. Watch with sound, answer choices, leave comments, and press Send. Codex receives the saved review; you see which scenes changed after revision. Check the printed address opens this plan, even when another server occupies the first port. Then test a separate portable copy elsewhere: only that disconnected copy needs a file returned to the agent. Your chosen scope A stays the same.

### Scene 15 · Quick check · Missing active source

_Shows:_ Quick check · Missing active source

_Says:_ The identified active conversation is unreadable, but a newer main conversation from this repo is readable. Which source should the explainer use?

### Scene 16 · Step 6 · Evidence earns the support claim

_Shows:_ Step 6 · Evidence earns the support claim

_Says:_ Step six needs all five steps. A real scratch project installs, builds a narrated plan, reviews and revises, implements, passes independent code check, shows a walkthrough, fixes a flagged choice and commits. Exercise questions, headless changes, failure recovery and session discovery. Record commands, versions, durations and results. Fast and full touched specs plus Claude regressions protect existing behavior. Untested live paths and platforms remain unverified.

### Scene 17 · Quick check · A disconnected copy

_Shows:_ Quick check · A disconnected copy

_Says:_ A teammate opens a portable copy with no connection to your project. They finish reviewing. Does Codex receive it automatically, or must they return the review file?

### Scene 18 · Quick check · Honest support

_Shows:_ Quick check · Honest support

_Says:_ Mocked queue specs pass, but no real Codex session has answered a page question. Can the complete lifecycle be called tested?

### Scene 19 · Review the clearer local plan

_Shows:_ Review the clearer local plan

_Says:_ The revised plan keeps your chosen local scope. Send here needs no download. One shared workflow and small agent adapters keep the code easy to extend. Failed commits remain unfinished. The guide holds the full examples and interfaces. Approve this clearer plan or ask for changes; implementation follows approval.
