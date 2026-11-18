# Fresh eyes: the newcomer's script brief · Find the gaps: line up your picture, the agent's and the code

You are a newcomer to this project, reading the script of "Find the gaps: line up your picture, the agent's and the code", a narrated video of 19 scenes,
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
# Fresh eyes: newcomer · script · stamp 5770408c262e

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
```

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

- "basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another. we want to actually interact to be able to do this."
- "we want to also make it easy for human to really make sure htey are aligned and interact in a way that is least effort for them to do interactions (this is what the drawing and voice was for) just like video is easiest way for them to understand."
- "then pls create a reelplanner video for this i think we can make a good plan for what we want to do here, really think in depth about it"

### Their last review

# Plan review · 2026-11-18 22:39 UTC · changes requested

**Changes requested:** revise the steps below, rebuild the beats they touch, and show the plan video again.

What to act on, from [plan-20261118T223944Z.json](plan-20261118T223944Z.json): 4 decisions, 5 quick checks, 2 marks; watched 100%.

## Decisions

- **Q1** (step 2) Where do a round's cards show up first?: **like said earlier commnet we should support multiple modalities here, but same backend for doing the review (maybe with minor adjustments based on how the user gives the feedback, if later they want to for example draw what they are thinking and intereact more that cant be done in text but can in html and video)** (in the reviewer's own words) → D-314
- **Q2** (step 3) Who reads your spoken explanation against the code?: **The waiting session** (the recommendation) → D-315
- **Q3** (step 4) After Got it, when does the same card return?: **Once more, a few days later** (not the recommendation) → D-316
- **Q4** (step 5) How often does a round come ahead of a plan?: **When a gap is likely and costly** (the recommendation) → D-317

## Steps to revise

- **Step 1**
  - quick check missed: "A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?" — answered "Both answers, side by side", the answer is "The card fixed, or no card". Explain this step so that answer is obvious.
- **Step 2**
  - comment at 1:59 (Step 2 · Predict, then see the code): "note we also should support an easier implementation of just doing in agent alone without video, just with something like askuserquestions or wahtever the harness suppports. then, we can do in html, and also here in video. jic some dont use full reelplanner pipelien, we can still use this same kindo f quizzing and realignment."
  - comment at 2:37 (Question 1 · Where the cards show first): "like said earlier commnet we should support multiple modalities here, but same backend for doing the review (maybe with minor adjustments based on how the user gives the feedback, if later they want to for example draw what they are thinking and intereact more that cant be done in text but can in html and video)"
  - quick check missed: "On card c5, you press N: not sure. What comes next?" — answered "The next card; nothing kept", the answer is "A gap: Got it or Show me more". Explain this step so that answer is obvious.
- **Step 3**
  - quick check missed: "You say: 'and it should only go to the session I have open.' How is that claim marked?" — answered "A match", the answer is "Neither: an assume card". Explain this step so that answer is obvious.


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
- **draw on a step**: mark the step's row with the player's pen, to leave a note on that step
- **recommended**: the option a question's author suggests, marked on its card

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
- **A video's depth / depth**: How deep a video's checks go, set in its brief: low (about two minutes, and no fresh eyes but the fact check), medium, the default (one round of fresh eyes, a cosmetic finding noted rather than redrawn), or high (two rounds, every finding fixed or answered).
- **The frame rules**: The style guide's seven rules for a frame a newcomer can read (§5): show the thing, never a stand-in; one reading order; each name on its thing; a question that says what you decide; nothing covering content; readable at a glance; pleasing. frame-lint fails the two a program can see; the designer of fresh eyes checks all seven.
- **frame-lint**: A check that reads each frame of a video for problems a program can spot, such as an empty bar where words should be, or something in the way of a thing the video points at.
- **Ask about this**: Ask a question about the scene you're on: press Q, or click a word in the captions, and type it. An agent answers it from the plan and the scene when one is there to answer (on a hosted page, Claude), and every question is kept with your review.
- **A brief**: A short written description an agent starts from. A video's brief says who it is for, what it shows and how it looks; the code check's agent gets one saying what to compare.
- **The storyboard**: A video's plan, scene by scene: what each scene shows and says, and the tags the player reads, such as a question, a quick check or a word the scene explains.
- **reel audit / audit**: The check on a walkthrough: it fails while a finding of the code check is unanswered, or a step has five choices the agent made alone and no question asked.
- **The explainer**: A video that explains something already there (some code, a log, a transcript, a session's changes), made when you ask, so you understand it before deciding anything. It asks you nothing; at the end you choose Done, Explain more or Plan this, and a plan can start from it.
- **a round**: A few cards (at most six) the agent writes where you and it most likely picture the code differently, before a plan or whenever you ask: some ask you to predict what the code does, checked against its own lines; some say what the agent assumes you want, for you to confirm. Each gap you find is settled in one click: you learn it, the plan changes, or the code is fixed. It adds nothing to the decision log.
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

### Scene 1 · Your words

_Shows:_ THE OWNER'S MESSAGE, AS SENT, in a data-artifact quote card (issue #57): 'basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another.' The words 'i assume it is one way when it is actually another' underlined in coral as the voice says them

_Says:_ You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.

### Scene 2 · Earlier plans

_Shows:_ FOUR PLAIN LINES, one at a time, each with the earlier plan's name small beside it: review · Send → the waiting session, or a headless run; quick check · predict a case the video didn't show; explainer · quoted word for word; memory · a file in your home folder

_Says:_ If you're new, four things this plan builds on. Send hands your review to the agent session waiting on this page; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3 · Three pictures, three gaps

_Shows:_ A TRIANGLE: three nodes, 'you', 'the agent', 'the code'. Each side lights in turn with its gap written along it as the voice says it: you–code 'waits for you · a headless run takes it'; agent–code 'tries once · tries again after 15 s'; you–agent 'the agent read: any agent · you meant: your open session'

_Says:_ Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.

### Scene 4 · Today, and what changes

_Shows:_ LEFT: one arrow 'agent → you', labelled 'today'. RIGHT: four rows landing on their words: 'a round · steps 1, 2'; 'your own words · step 3'; 'one click a gap · step 4'; 'before a plan, and on quick checks · step 5'

_Says:_ Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check.

### Scene 5 · What your review changed

_Shows:_ THREE ROWS landing on their words, each with its decision tag: 'one round, three ways in · decided D-314'; 'asked once more, days later · decided D-316'; 'three checks you missed · steps 1, 2, 3'. Small under them: 'question 2 and 4 kept the recommendation · D-315, D-317'

_Says:_ Your review changed three things. One: the cards are one record with three ways to answer them, in the chat with the agent alone, on the review page, or in a video. Two: a card you got right comes back once more, a few days later, on a new case. Three: you got three quick checks wrong, so the checker, not sure, and a should claim are now said plainly. Those were gaps too.

### Scene 6 · Step 1 · Three kinds of card

_Shows:_ THREE PLANNED CARDS fanned out, each landing on its word, each labelled with its kind: predict · 'In this repo, you press Send and no session is waiting. What happens to the review?' with A B C; assume · 'I'm assuming you mean the session you have open'; say · 'Say how you think a review reaches the agent'. A quiet 'planned' label; a counter '3 of at most 6'

_Says:_ Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three.

### Scene 7 · Step 1 · Where gaps are likely

_Shows:_ FOUR SOURCES on the left, in the narration's words (what your words take for granted; quick checks you got wrong; commits since you watched; its own assumptions) flowing into 'candidates', then 'at most 6'. One card's two lines pinned on it: 'likely wrong: in a repo with no headless command it does wait' and 'matters: step 2 of the plan'. Then the checker: card c4 'tries once' struck, 'tries again after 15 s' written in; the agent–code side of the small triangle lights

_Says:_ Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone. Where it disagrees, the card is fixed or dropped before the round opens. You never see two answers side by side.

### Scene 8 · Step 2 · One round, three ways in

_Shows:_ ONE RECORD in the middle, 'align.md · one record'. Three ways landing in order on their words, left to right: 'the chat' (a planned AskUserQuestion mock: card c3's question, options A B C, then the lines as a code block); 'the review page' (the card, turned over); 'a video' (a quick check). A 'decided · D-314' tag; 'built first' on the chat

_Says:_ Step two, as you decided: one round, three ways in. First, in the chat with the agent alone: it asks each card with its own question tool, and shows the code's lines as text. That needs no page, no video, and no setup in the repo. Then the review page, which adds pointing and your voice. Then a video, where a quick check is a card. Each way writes the same record, so what comes next is the same.

### Scene 9 · Step 2 · Predict, then see the code

_Shows:_ THE PLANNED CARD, FRONT: c3's question and three options, A ringed in coral as 'your pick'. It TURNS OVER: the back is the real thing (data-artifact): scripts/lib/inbox.mjs, lines 700–702 on the navy slab ('if (!question && !isMachineInbox(rp)) {', 'const result = await start();', 'if (result.started) return { handledBy: "agent", …') beside .reelplanner/config.json's '"command": "claude --permission-mode auto …"'; under them the why, 'A headless command is set, so a run starts'; your A dashed, B ringed in ink 'the answer'; a row of four buttons 'Got it · Change the plan · The code is wrong · Show me more'; a quiet 'Skip the rest'

_Says:_ On the review page, a card at a time, you answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it. Not sure is kept too, never skipped: it's a gap of its own, settled with Got it or Show me more.

### Scene 10 · Quick check · A card the checker disagrees with

_Shows:_ THE CASE ON A LINE ABOVE: 'card c2: B · checker: C'; the heading and three cards land, still

_Says:_ Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 11 · Step 3 · Your own words, checked

_Shows:_ YOUR WORDS typed out as said (planned page): 'When I press Send it goes to my session. If I'm not there, it waits for me. It should tell me when it's been taken.' Each claim underlined as the voice reads it: the first marked ✓ with 'inbox.mjs:673' pinned under it; the second marked ✗ in coral with 'inbox.mjs:700–705 · config.json' and a small gap card sliding out of it. 'whisper · on this machine' small by a microphone; the third sentence 'It should tell me when it's been taken.' marked '?' with 'assume card' sliding out of it; a quiet line at the foot 'drawing your picture · issue #23, a separate plan'

_Says:_ Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session, as you chose, splits your words into claims, each checked against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. It should tell me when it's taken: that says should, so it's neither a match nor a gap. It comes back as an assume card.

### Scene 12 · Quick check · Not sure

_Shows:_ THE CASE ON A LINE ABOVE: 'card c5 · you press N'; the heading and three cards land, still

_Says:_ Quick check. On card c five, you press N, for not sure. What comes next?

### Scene 13 · Step 4 · Settle each gap

_Shows:_ THE PLANNED CARD'S FOUR BUTTONS across the top; from each a line drawn down to where it goes, landing on its word: Got it → 'your memory · you.jsonl'; Change the plan → 'plan.md · You told me first'; The code is wrong → 'a plan step · or issue.md'; Show me more → 'one short video'. Then 'decision log' at the side, reached only from 'plan.md' by a thin line labelled 'its questions'

_Says:_ Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. The decision log, the record of your answers, gets them only through the plan's own questions.

### Scene 14 · Step 4 · Asked once more

_Shows:_ A TIMELINE, ticks on the line, labels under them, left to right: 'Got it · c3'; '3 days'; 'the next round on the inbox'; 'a new case · same rule'; 'known until the lines change'. A 'decided · D-316' tag

_Says:_ As you decided, Got it is not the end. A few days later, the next round on that part asks it once more, on a new case: other names, the same rule, so you apply it instead of remembering the answer. Got it again, and it's known until its lines change; wrong again, and it's a gap to settle. Nothing reminds you on a schedule: it waits for the next round on that part.

### Scene 15 · Quick check · A want, not a fact

_Shows:_ THE CASE ON A LINE ABOVE, your words in quotes: 'and it should only go to the session I have open'; the heading and three cards land, still

_Says:_ Quick check. You say: and it should only go to the session I have open. How is that claim marked?

### Scene 16 · Step 5 · Into the loop

_Shows:_ THREE PLACES in a row, each landing on its word: 'before a plan' with candidates → 'a round, if worth it'; a quick-check card with the four buttons under its answer and 'Approve · never blocked'; a planned reel status line 'rounds 3 · gaps 11 · Got it 7 · the plan 3 · a fix 1', with 'compared after 5 plans each way'

_Says:_ Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and, as you chose, runs a round only when one is likely and costly. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.

### Scene 17 · Quick check · Two gaps, more please

_Shows:_ THE CASE ON A LINE ABOVE: 'a round · Show me more on c2 and c4'; the heading and three cards land, still

_Says:_ Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?

### Scene 18 · Quick check · A quick check you missed

_Shows:_ THE CASE ON A LINE ABOVE: 'a video like this one · a quick check you got wrong · Change the plan'; the heading and three cards land, still

_Says:_ Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?

### Scene 19 · The plan

_Shows:_ THE RAIL OF FIVE STEPS, each with its slot for an answer (data-plan-step): step 2 · D-314; step 3 · D-315; step 4 · D-316; step 5 · D-317; the triangle small beside it, its three sides closed. Holds still

_Says:_ That's the revised plan: one round with three ways in, your own words checked, one click to settle each gap, asked once more days later, and the round in the loop. Your four decisions sit on the steps. Draw on any step to leave a note, or approve.
