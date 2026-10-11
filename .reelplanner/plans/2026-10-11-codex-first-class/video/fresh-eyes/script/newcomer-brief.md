# Fresh eyes: the newcomer's script brief · video

You are a newcomer to this project, reading the script of "video", a narrated video of 19 scenes,
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
# Fresh eyes: newcomer · script · stamp 06e6cbe52d51

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
```

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

- "Pls create a branch. Our goal is to get codex fully working, fully featured on reelplanner as an alternative so it is first-class like claude code"; "oh i am not sure about the claude artifact euqivalent i ahven used in codex. do look into that and codex if it has something similar to claude plugisn and mods though too".

## The words this video gives a meaning

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

_Says:_ You should be able to choose Codex and finish the same review loop you use with Claude Code. Today, checked command flags do not prove that. This proposal changes four things: installation, review follow-up, finding the right conversation, and a real installation-to-walkthrough proof. Nothing shown here has landed yet.

### Scene 2 · What Codex actually offers

_Shows:_ What Codex actually offers

_Says:_ A plugin packages extensions. A skill gives the agent instructions. A hook runs at a trusted lifecycle event. MCP connects tools, and compatible hosts can show their interfaces. These are different from a hosted Artifact: today’s Claude page depends on a database, reviewer identity and model answers. Codex CLI has no inline Visualization renderer. ChatGPT Sites offers hosting and stored data, but no proven drop-in handoff to this repo. No official extension called mods was identified; execution modes are permission settings.

### Scene 3 · How far should remote review go?

_Shows:_ How far should remote review go?

_Says:_ Here is the scope choice for step five, before the installation details. Option A completes the local Codex loop and validates browser exports: a remote reviewer downloads answers and transfers the file. Option B also proves an authenticated hosted bridge on scratch content: Send reaches Codex automatically. I recommend A because the local gaps are concrete. Choose B if automatic remote handoff must be part of this first acceptance bar.

### Scene 4 · A · Transfer the review file

_Shows:_ A · Transfer the review file

_Says:_ If you choose A, the browser player remains portable. The remote reviewer exports annotations.json. Codex records those answers locally. Manual transfer and the absence of automatic remote answering stay visible limitations.

### Scene 5 · B · Prove the hosted bridge

_Shows:_ B · Prove the hosted bridge

_Says:_ If you choose B, a working scratch spike must prove identity, durable storage, submission and question handoff. A public page or manifest is insufficient. Hosting cost and service design get a separate review; exposing this repo’s private plans or deploying requires final approval.

### Scene 6 · Rules this proposal keeps

_Shows:_ Rules this proposal keeps

_Says:_ Earlier reviews established the rules we keep. Contributions retain binding decisions. Case studies test the full outcome. Walkthroughs show changes running. Fresh findings get answers before showing. Explainers pin sources without copying private text. Off-plan choices stop for review. Headless work respects permissions. The guide comes from the plan. Memory reuses earlier answers. Deep dives show real evidence. Quick checks never block approval. Details open on the thing they explain.

### Scene 7 · Step 1 · Native installation

_Shows:_ Step 1 · Native installation

_Says:_ Step one stands alone: package reelplanner for Codex’s own plugin system while preserving Claude’s lightweight skill install. These are proposed commands to validate in a clean temporary Codex home, not commands already run here. Register the checkout as a marketplace, then add reelplanner at reelplanner. The installed skill provides instructions; the CLI and video dependencies still need setup. Optional hooks need local trust and manual installation; they cannot be a mandatory dependency or a public-directory promise.

### Scene 8 · Step 2 · A commit must really succeed

_Shows:_ Step 2 · A commit must really succeed

_Says:_ Step two depends on those capability checks. Configure future headless reviews only when asked. Headless means no session is open. Codex keeps workspace-write and uses automatic approval review for eligible escalation requests. Its supported command flag has passed a parser check; a real commit has not. Git writes that the sandbox blocks need escalation. Denial or signing failure keeps the review unfinished with its log. A server never commits on the agent’s behalf.

### Scene 9 · Quick check · Installation

_Shows:_ Quick check · Installation

_Says:_ A teammate installs the proposed plugin on a machine without video dependencies. What should happen when they try the first plan? Predict the result from the separation between installed instructions and working tools.

### Scene 10 · Step 3 · Save before delivery

_Shows:_ Step 3 · Save before delivery

_Says:_ Step three needs installation checks and safe headless follow-up. First save the review to the inbox, the durable pending-work record. A waiting session wins, then an explicitly connected live session, then configured headless follow-up, then the inbox. The proposed session connection sends only the saved path through Codex’s queue. A claim means one worker owns that review. A failed connection releases the claim and falls back. Ask about this reaches a live session only; it never starts a headless run.

### Scene 11 · Quick check · Commit failure

_Shows:_ Quick check · Commit failure

_Says:_ An approval has been applied, but the scratch repository’s signing key is unavailable. The code change exists. What status should the review have now? Consider whether finishing the edit also proves that the required commit happened.

### Scene 12 · Step 4 · This conversation means this one

_Shows:_ Step 4 · This conversation means this one

_Says:_ Step four stands alone. A transcript is the saved conversation. Find the active Codex thread by its identity and matching repo, even if another session is newer. Support the storage actually present, including current paginated history, rather than assuming old rollout files cover it. If the identified session is missing, ask for an explicit transcript path. Pin only path, hash and size; the private conversation stays outside Git.

### Scene 13 · Quick check · A question after disconnection

_Shows:_ Quick check · A question after disconnection

_Says:_ The reviewer asks a question after the connected session closes. Headless follow-up was configured yesterday. Does the question launch that agent, disappear, or remain available? Apply the different delivery rules for a question and a review.

### Scene 14 · Step 5 · Make the boundary testable

_Shows:_ Step 5 · Make the boundary testable

_Says:_ Step five follows your remote scope choice. For A, open the portable player without Claude’s runtime, answer a decision, export the review and record it. Prove reviewer identity and the chosen answer survive. Ask about this must explain its manual fallback. For B, the scratch bridge must also demonstrate authenticated storage, automatic submission and question handoff. A rendered interface cannot stand in for that evidence.

### Scene 15 · Quick check · Missing active source

_Shows:_ Quick check · Missing active source

_Says:_ The active thread belongs to this repo, but its saved conversation cannot be read. A newer main conversation from this same repo is readable. Which source should the explainer use? The active identity is still known.

### Scene 16 · Step 6 · Evidence earns the support claim

_Shows:_ Step 6 · Evidence earns the support claim

_Says:_ Step six depends on all five earlier steps. A real scratch project must install the plugin, build and revise a narrated plan, submit a review, implement the change, pass an independent code check, show a walkthrough, fix a flagged choice, and commit. Exercise live questions, headless changes, failures and the session explainer. Record commands, versions, durations and results. Run the fast suite, full touched specs and Claude regressions. Only passing real outcomes justify the support table; blocked platforms remain unverified.

### Scene 17 · Quick check · A hosted page

_Shows:_ Quick check · A hosted page

_Says:_ A candidate hosted app renders the video and its option cards. Its Send button loses answers on refresh, and nobody has reached the repo. What does that establish? Judge the outcome rather than whether the interface looks like an Artifact.

### Scene 18 · Quick check · Honest support

_Shows:_ Quick check · Honest support

_Says:_ Every automated specification passes, including mocked queue delivery. A real Codex session has never received and answered a page question. Can the docs call the complete lifecycle tested? Decide what the current evidence actually covers.

### Scene 19 · Approve a scope, then prove it

_Shows:_ Approve a scope, then prove it

_Says:_ The proposal is a complete local Codex alternative with native installation, recoverable reviews, the correct conversation and real lifecycle proof. The open choice is portable remote exports or an authenticated hosted spike. Your answer sets that boundary. Approval starts implementation; this video has presented the proposed behavior, not a finished integration.
