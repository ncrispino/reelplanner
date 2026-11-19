# Fresh eyes: the newcomer's script brief · Find the gaps: what was built

You are a newcomer to this project, reading the script of "Find the gaps: what was built", a narrated video of 11 scenes,
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
# Fresh eyes: newcomer · script · stamp f6f4529b488b

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
```

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

- "ok approved, implement it"

### Their last review

# Plan review · 2026-11-18 23:35 UTC · approved

**Approved:** fold the comments below into `plan.md`'s steps as text, then implement; no new plan video.

What to act on, from [plan-20261118T233500Z.json](plan-20261118T233500Z.json): nothing marked; accepted in conversation on 2026-11-18, not in the player (nothing watched or timed): "ok approved, implement it".

## Comments to fold into the steps

_None: every decision is in the ledger and nothing else was said. Leave plan.md as it reads._


## The words this video gives a meaning

- **round**: a short set of cards, at most six, about one topic, written where you and the agent likely picture the code differently
- **card**: one question in a round: predict (what the code does, answered before you see its lines), assume (what the agent assumes you want) or say (how you think it works, in your own words)
- **fresh checker**: a new agent that never saw this conversation and answers each predict card from the code's lines alone
- **pinned**: kept as it was when the round was made, so a card quotes only what the code said then
- **gap**: a place where your picture and the code, or the agent's, disagree
- **claim**: a stretch of your own words that says one thing about the code
- **fingerprint**: a short code worked out from some lines of a file, which changes when one character of them changes
- **You told me first**: the section of a plan that lists what a round settled, so the plan is written on it
- **Got it**: settling a gap where the code is right: it goes into your memory
- **Change the plan**: settling a gap where you want it your way: it goes into the plan
- **The code is wrong**: settling a gap as a bug: it becomes a fix
- **Show me more**: settling a gap by asking for more: a longer explanation now, and one short video of the round's gaps
- **whisper**: the speech-to-text program the narration already uses, run on this machine
- **scratch repo**: a new git repo made just for these runs, so nothing in this one changed
- **inbox**: the folder where a review waits for the agent session that takes it
- **headless run**: the agent started on its own, with nobody watching, to work on a review
- **deviation**: a place the build did otherwise than the plan or a decision says

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

### Scene 1 · What landed

_Shows:_ THE MAP (the real change, git diff 95a5bdb..HEAD, one row a file): scripts/align.mjs · the command; scripts/lib/align.mjs · cards, checks, the record; scripts/lib/align-server.mjs · the round on the review server; packages/player/align-page.html · the round's page; scripts/review.mjs · opens a round; packages/player/reelplanner-player.js · a quick check settles; scripts/lib/review-scope.mjs · what a settled check asks; skills/plan-to-video/SKILL.md · when a round runs

_Says:_ Find the gaps, built. Before a plan, you answer a few cards about how the code works, and each turns over to the code's own lines. A fresh checker, a new agent with only those lines, must read each card as it does; if it reads one otherwise, the check stops: rewrite the card once, or drop it. Eight files carry it.

### Scene 2 · Quick check · The checker reads it otherwise

_Shows:_ THE CASE ON A LINE ABOVE: 'card c2 says B · the fresh checker reads A'; the heading and three cards land, still

_Says:_ Quick check. The fresh checker reads card c2's lines as A. The card says B. What does the check do?

### Scene 3 · Step 1 · Cards, checked twice

_Shows:_ A REAL RUN (runs/align-checker.txt, runs/align-check-quote.txt), a terminal: `reelplanner align <round> --check --no-checker` with '✗ c2: its quote is not in src/send.mjs:3-5 word for word'; then '--check' with '✗ c2: the checker read the lines as A, the card says B: rewrite it once'; then '✓ 3 cards, 0 failure(s)'. Each ✗ ringed as said. At the right, the choice cards A2, A3, A4, A20 (data-call)

_Says:_ In a scratch repo, a card quotes a line one word off, and the check stops it. The checker reads c2 as A: stopped, rewrite it once. It reads B: it passes. Its choices: a question mark from the checker stops a card too. No checker answer, no round. One range of lines a card. And a round finds its repo from its own folder, in any clone.

### Scene 4 · Step 2 · The round on the page

_Shows:_ REAL SCREEN, the round page from a scratch repo's review server: the card's front ('No session is waiting and a command is set. Where does the review go?', A B C), then the same card turned over (your pick A dashed in coral, the answer B in ink, src/send.mjs lines 2 to 6 on the navy slab, the why, 'A gap. Settle it:' and its four buttons), each ringed as said. At the right, the choice cards A7, A9, A10, A13 (data-call)

_Says:_ On the review page, one card at a time. Press A, and it turns over: the lines, the answer, why, and a gap to settle. What you skip is listed in the plan as assumed, not checked. Its choices: each card is routed once. The page has its own address on the review server. Send goes to the inbox, never a headless run. And a settled card moves on by itself.

### Scene 5 · Step 3 · Your own words

_Shows:_ REAL SCREEN, the say card on the round page: 'Say how you think a review is handed on.', the words typed in ('It goes to my session. If I'm not there it waits in the inbox for me.'), the microphone button and Check; under it three claims marked ✓ match, ✗ a gap, ? neither. At the right, the choice cards A11, A12, A19 (data-call)

_Says:_ On a say card, hold Space and talk, or type. Whisper writes it down on this machine, and the waiting session checks each claim. One that differs is a gap, settled like any card. Its choices: your words reach the session as a question. Speech stays on this machine. And the recording is thrown away once written down.

### Scene 6 · Quick check · A card you skipped

_Shows:_ THE CASE ON A LINE ABOVE: 'c2 · Got it · c3 · skipped'; the heading and three cards land, still

_Says:_ Quick check. You settle c2 with Got it, and skip c3. Where does c3 go?

### Scene 7 · Step 4 · Where each gap goes

_Shows:_ A REAL RUN (runs/align-record.txt), a terminal: `reelplanner align record <round> answers.json` with 'c1 → You told me first, in a line', 'c2 → your memory, asked once more on a new case from 2026-11-21', 'c3 → Assumed, not checked'; then the plan's first lines with '## You told me first' and '## Assumed, not checked' before '### Step 1', each ringed as said. At the right, the choice cards A1, A5, A6, A8 (data-call)

_Says:_ Record it, and each answer goes where it belongs: c1 into You told me first, in the plan; c2 into your memory, asked once more three days on; c3, assumed, not checked. Its choices: what you know is a marked line in your memory's file, by its lines' fingerprint. A due thing comes back as a card the agent writes. You told me first sits before the plan's steps. And Show me more's video is one explainer command.

### Scene 8 · Step 5 · Quick checks, and the count

_Shows:_ REAL SCREEN, the player on a quick check answered wrong: 'Not quite, it is B.', then Got it, Change the plan (pressed, coral), Show me more, and the box relabelled 'Change the plan: how should it work?' holding 'retries should stop after three', ringed as said; below it a real run (runs/reel-status-rounds.txt): 'rounds: 1, gaps: 1 (Got it 1)' and 'too few plans to compare (1 with a round, 0 with a likely gap and none; 5 of each)'. At the right, the choice cards A14 to A18 (data-call)

_Says:_ A wrong quick check in any video now settles the same way: press Change the plan, and the box takes your words. And reel status counts rounds, and says too few plans to compare until there are five of each. Its choices: a plan's header says whether a round ran. A late fix counts once. The buttons sit in the check's own box. Got it sends no rewrite. And Show me more with no worked example asks for it again.

### Scene 9 · Off the plan · Step 5 went on

_Shows:_ THE DEVIATION CARD D1 (data-call), large: 'Step 5 built past its fifth choice before asking (decision D-110)'; beside it the plan's question 5 as it reads, 'Where is it kept whether a round ran first, or was skipped?', with its three options and 'built as A until you answer'

_Says:_ One thing went off the plan. Step five reached its fifth choice, and a decision says to stop there and ask. It went on, and the question came after: how does a plan say whether a round ran? It is the plan's question five, built as recommended until you answer.

### Scene 10 · What ran, and what is not done

_Shows:_ TWO COLUMNS: 'ran' with npm test, align.spec 53 checks, align-page.spec 37, quiz.spec 54, and the code check's findings answered; 'not done' with the four items, each a line

_Says:_ What ran: the fast suite, with two new specs, in scratch repos. Not done: live recognition in the browser, a diagram on Show me more, a later video dropping what you know, and no round yet before a real plan.

### Scene 11 · The ending

_Shows:_ THE ROUND CARD, small, turned over, beside the line 'Seeing it run, anything you'd change?'. Holds still

_Says:_ That's find the gaps, running. Seeing it run, anything you'd change?
