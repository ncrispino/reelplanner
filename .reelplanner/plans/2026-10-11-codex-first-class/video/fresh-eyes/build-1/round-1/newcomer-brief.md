# Fresh eyes: the newcomer's brief · video

You are a newcomer to this project. You are about to watch "video", a narrated video of 19 scenes,
the way a viewer would: the narration of each scene as it is said, and a picture of the scene at its last moment
as the review page shows it (the player's buttons, tabs and captions included). You also have what a viewer can
open on the page: the glossary, the meanings this video gives its own words, and a line on each earlier video this
one leans on. You have nothing else: not the plan, not the code, not what the author meant.

List every phrase or thing on screen you could not explain from what the video had shown **by then**, what you
guessed it means, and every question a newcomer would ask. A word with a meaning below counts as explained. A
plain phrase with no meaning (made of ordinary words, like "the saved review file" or "drops the video") counts as
unexplained when the video never says what it is or where it comes from. Be specific: say the scene, the words,
and what you would need to follow.

## The shape of newcomer.md (keep it exactly)

```
# Fresh eyes: newcomer · round 1 · stamp d2736c645a6b

- N1 · scene 4 · "the phrase or thing": what you could not explain, and what you guessed; why it matters
- N2 · scene 7 · …
```

One finding a line, numbered N1, N2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- N3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
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

### Scene 1 · part: The goal and the boundary

Picture: `shots/scene-01.png`

> You should be able to finish the same review loop with Codex or Claude Code. This proposal changes installation, review follow-up, conversation discovery and lifecycle proof. The branch is feat/codex-first-class; integration behavior remains proposed.

### Scene 2

Picture: `shots/scene-02.png`

> Claude Mods draw native panes. The audited branch’s /reel pane includes video and sound, choices and notes, Send and rebuild. Codex parity must match that. Plugins package skills, the agent’s instructions. Trusted hooks run at lifecycle events. MCP connects tools and compatible interfaces. None supplies the hosted Artifact’s stored reviews, identity and model answers. ChatGPT Sites offers hosting, with no proven repo bridge. Codex CLI has no inline Visualization renderer or documented native pane API. Standalone browser panes are candidates to test.

### Scene 3 · part: Choose the remote boundary\n- decision: q1

Picture: `shots/scene-03.png`

> Here is step five’s scope question, before the installation details. A completes the local loop and validates portable exports: the reviewer downloads answers and transfers the file. B also proves authenticated automatic Send on scratch content. I recommend A; choose B if automatic remote handoff belongs in this first acceptance bar.

### Scene 4

Picture: `shots/scene-04.png`

> With A, the browser player exports annotations.json. Codex records the answers locally. Manual transfer and no automatic remote answering remain explicit limitations.

### Scene 5

Picture: `shots/scene-05.png`

> With B, allow about two engineering days to investigate identity, durable storage and Codex handoff. Hosting, storage, sign-in and transport need service review. Paid hosting, public deployment and private-plan exposure require approval of a concrete result.

### Scene 6

Picture: `shots/scene-06.png`

> Earlier reviews established rules we keep. Contributions retain binding answers. Comparisons test complete outcomes. Walkthrough videos show changes running. Fresh findings get answers. Explainers keep private sources outside Git. Off-plan choices stop. Unattended work respects permissions. The guide comes from the plan. Saved learning reuses answers. Expanded evidence shows real results. Prediction questions never block approval. Extra information opens on the thing it explains.

### Scene 7 · part: Install and finish safely

Picture: `shots/scene-07.png`

> Step one stands alone. Package reelplanner natively for Codex; preserve Claude’s skill install. Validate these proposed commands in an isolated Codex settings folder. The marketplace is the plugin catalog. The skill supplies instructions; CLI and video tools still need setup. Diagnostics name missing tools. Optional hooks need manual local trust; the public plugin directory excludes bundled hooks.

### Scene 8

Picture: `shots/scene-08.png`

> Step two needs those capability checks. Configure headless follow-up only when asked: no session is already open. Workspace-write remains the sandbox boundary. An approval policy allowing escalation requests lets automatic review judge Git writes outside it. The command flag is checked; real commits remain unproved. Denial or signing failure leaves pending stopped-run evidence.

### Scene 9

Picture: `shots/scene-09.png`

> A teammate installs the plugin without video tools. Does installation prove the lifecycle, or should diagnostics name missing tools?

### Scene 10 · part: Deliver and find the right session

Picture: `shots/scene-10.png`

> Step three needs installation and safe headless follow-up. Save the review in the inbox first. Delivery prefers a waiting session, connected session, configured headless run, then inbox fallback. These proposed commands queue only the saved path. One worker claims ownership; failure releases that claim. Ask about this is the question button. Questions stay saved for live-session handling after disconnection; they never start headless work.

### Scene 11

Picture: `shots/scene-11.png`

> An approved edit exists, but its signing key is unavailable. Is the review done, pending with evidence, or committed by the server?

### Scene 12

Picture: `shots/scene-12.png`

> Step four stands alone. A transcript is the saved conversation. Match active Codex identity and repo, not the newest session. Support current paginated history as well as observed old storage. A missing active source requires an explicit transcript path. Pin path, hash and size only; the private text stays outside Git.

### Scene 13

Picture: `shots/scene-13.png`

> The connected session closes, then a question arrives. Yesterday’s headless setting exists. Does the question launch work, vanish, or stay saved?

### Scene 14 · part: Prove the result before claiming support

Picture: `shots/scene-14.png`

> Step five matches the audited /reel pane and follows your remote choice. Trial the existing player beside Codex using terminal-browser or cmux. Prove sound and playback controls, library and owning-repo routing, answers and notes, comments and review verdicts, delivery exactly once, and rebuilt changed scenes. Installing a pane alone proves nothing. For A, exported identity and answers survive local intake with manual transfer. B also proves authenticated automatic submission and question handoff. Without durable intake, hosted parity fails.

### Scene 15

Picture: `shots/scene-15.png`

> The identified active conversation is unreadable, but a newer main conversation from this repo is readable. Which source should the explainer use?

### Scene 16 · part: Evidence earns the support claim

Picture: `shots/scene-16.png`

> Step six needs all five steps. A real scratch project installs, builds a narrated plan, reviews and revises, implements, passes independent code check, shows a walkthrough, fixes a flagged choice and commits. Exercise questions, headless changes, failure recovery and session discovery. Record commands, versions, durations and results. Fast and full touched specs plus Claude regressions protect existing behavior. Untested live paths and platforms remain unverified.

### Scene 17

Picture: `shots/scene-17.png`

> A hosted candidate shows the video and cards, but Send loses answers on refresh. Nothing reaches Codex. Does that establish hosted parity?

### Scene 18

Picture: `shots/scene-18.png`

> Mocked queue specs pass, but no real Codex session has answered a page question. Can the complete lifecycle be called tested?

### Scene 19

Picture: `shots/scene-19.png`

> Approve the proposed local alternative, then prove it. Choose portable remote exports or the authenticated hosted spike. The plan guide holds full cases and interfaces. This review presents proposed behavior; implementation comes after approval.
