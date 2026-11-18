# Fresh eyes: the newcomer's script brief · Find the gaps: line up your picture, the agent's and the code

You are a newcomer to this project, reading the script of "Find the gaps: line up your picture, the agent's and the code", a narrated video of 32 scenes,
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
# Fresh eyes: newcomer · script · stamp 53ed0f6e5924

- N1 · scene 4 · "the phrase": what you could not follow, and what you guessed; why it matters
- N2 [plan] · scene 7 · …
```

One finding a line, in scene order. Write "- none" if you have nothing. Do not answer or fix anything yourself.

## What the person asked, in their words

- "basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another. we want to actually interact to be able to do this."
- "we want to also make it easy for human to really make sure htey are aligned and interact in a way that is least effort for them to do interactions (this is what the drawing and voice was for) just like video is easiest way for them to understand."
- "then pls create a reelplanner video for this i think we can make a good plan for what we want to do here, really think in depth about it"

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

_Shows:_ FOUR PLAIN LINES, one at a time, each with the earlier plan's name small beside it: review · Send → the waiting session, or a headless run; quick check · predict, later, on a new case; explainer · quoted word for word; memory · a file in your home folder

_Says:_ If you're new: you review a plan on this page, and Send hands your review to the agent session waiting on it; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict, later, on a new case. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.

### Scene 3 · Three pictures, three gaps

_Shows:_ A TRIANGLE: three nodes, 'you', 'the agent', 'the code'. Each side lights in turn with its gap written along it as the voice says it: you–code 'waits for you · a headless run takes it'; agent–code 'tries once · tries again after 15 s'; you–agent 'any agent · your open session'

_Says:_ Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying once; it tries again fifteen seconds later. And you asked for a review that reaches the agent: it took any agent, and you meant your open session.

### Scene 4 · Today, and what changes

_Shows:_ LEFT: one arrow 'agent → you', labelled 'today'. RIGHT: four rows landing on their words: 'a round · steps 1, 2'; 'your own words · step 3'; 'one click a gap · step 4'; 'in the loop · step 5'

_Says:_ Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change, in four parts. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards in the loop.

### Scene 5 · Step 1 · Three kinds of card

_Shows:_ THREE PLANNED CARDS fanned out, each landing on its word, each labelled with its kind: predict · 'In this repo, you press Send and no session is waiting. What happens to the review?' with A B C; assume · 'I'm assuming you mean the session you have open'; say · 'Say how you think a review reaches the agent'. A quiet 'planned' label; a counter '3 of at most 6'

_Says:_ Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words.

### Scene 6 · Step 1 · Where gaps are likely

_Shows:_ FOUR SOURCES on the left (your words; your memory; what moved; the agent's assumptions) flowing into 'candidates', then 'at most 6'. One card's two lines pinned on it: 'likely wrong: in a repo with no headless command it does wait' and 'matters: step 2 of the plan'. Then the checker: card c4 'tries once' struck, 'tries again after 15 s' written in; the agent–code side of the small triangle lights

_Says:_ Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, checks you got wrong, commits since you last watched, and its own assumptions. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone. Where it disagrees, the card is fixed or dropped before you see it.

### Scene 7 · Step 2 · Predict, then see the code

_Shows:_ THE PLANNED CARD, FRONT: c3's question and three options, A ringed in coral as 'your pick'. It TURNS OVER: the back is the real thing (data-artifact): scripts/lib/inbox.mjs, lines 700–702 on the navy slab ('if (!question && !isMachineInbox(rp)) {', 'const result = await start();', 'if (result.started) return { handledBy: "agent", …') beside .reelplanner/config.json's '"command": "claude --permission-mode auto …"'; under them the why, 'A headless command is set, so a run starts'; your A dashed, B ringed in ink 'the answer'; a row of four buttons 'Got it · Change the plan · The code is wrong · Show me more'; a quiet 'Skip the rest'

_Says:_ Step two puts the round on the review page, a card at a time. You answer first, with a key: A to D, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. Where you match, the next card comes. Where you don't, it's a gap: Got it, Change the plan, The code is wrong, or Show me more. Skip the rest is always there.

### Scene 8 · Question 1 · Where the cards show first

_Shows:_ THE QUESTION AND THREE CARDS, still, each with a tiny drawing of where the card appears: a page card; a chat bubble; both. The recommended card carries 'recommended'

_Says:_ Question one. A: the cards show up on the review page, with keys, pointing, your voice, and the code on the card. B: in the chat, as the agent's questions: quickest to build, but plain text and no voice. C: both from the start, twice the work before either is good. I recommend A: the page makes each answer a key press. Where do the cards show up first?

### Scene 9 · If A · on the review page

_Shows:_ kicker 'If A'; the planned card's back on a review page, the slab of lines on it

_Says:_ With A, the card turns over on the page, with the code's lines on its back.

### Scene 10 · If B · in the chat

_Shows:_ kicker 'If B'; a chat exchange: the agent's question with A B C, your 'A', and the answer as plain lines of text

_Says:_ With B, the agent asks each card in the chat, and the lines come back as text.

### Scene 11 · If C · both from the start

_Shows:_ kicker 'If C'; the card on a page beside the same card in a chat, one line joining them 'one round'

_Says:_ With C, the same round opens on the page and in the chat at once.

### Scene 12 · Quick check · A card the checker disagrees with

_Shows:_ THE CASE ON A LINE ABOVE: 'card c2: B · checker: C'; the heading and three cards land, still

_Says:_ Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?

### Scene 13 · Step 3 · Your own words, checked

_Shows:_ YOUR WORDS typed out as said (planned page): 'When I press Send it goes to my session. If I'm not there, it waits for me. A question I ask on the page does the same.' Each claim underlined as the voice reads it: the first and third marked ✓ with 'inbox.mjs:673' and ':700' pinned under them; the second marked ✗ in coral with 'inbox.mjs:700–705 · config.json' and a small gap card sliding out of it. 'whisper · on this machine' small by a microphone

_Says:_ Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session splits your words into claims, each a stretch that says one thing, and checks each against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. A claim about what you want, not what is, comes back as an assume card.

### Scene 14 · Question 2 · Who checks what you said

_Shows:_ THE QUESTION AND THREE CARDS, still, each with its time on it: 'about 1 min'; 'a few seconds'; 'next version'. The recommended card carries 'recommended'

_Says:_ Question two. A: the session that's waiting reads your words against the code. It knows the code best, and takes about a minute. B: a small fast model on the page: seconds, but it sees only the pinned lines. C: the agent after Send, so nothing live. I recommend A, falling back to C when no session waits. Who reads your spoken explanation against the code?

### Scene 15 · If A · the waiting session

_Shows:_ kicker 'If A'; your three claims, marked, with '≈ 1 min' beside them

_Says:_ With A, your claims come back marked in about a minute.

### Scene 16 · If B · a small fast model

_Shows:_ kicker 'If B'; your three claims, marked, '≈ 3 s', and 'from the pinned lines only' on them

_Says:_ With B, they're marked in seconds, from the pinned lines alone.

### Scene 17 · If C · after Send

_Shows:_ kicker 'If C'; your three claims unmarked, then a 'next version' tab where they are marked

_Says:_ With C, you see them marked only in the next version.

### Scene 18 · Quick check · Not sure

_Shows:_ THE CASE ON A LINE ABOVE: 'card c5 · you press N'; the heading and three cards land, still

_Says:_ Quick check. On a card about where a question waits, you press N, for not sure. What comes next?

### Scene 19 · Step 4 · Settle each gap

_Shows:_ THE PLANNED CARD'S FOUR BUTTONS across the top; from each a line drawn down to where it goes, landing on its word: Got it → 'your memory · you.jsonl'; Change the plan → 'plan.md · You told me first'; The code is wrong → 'a fix'; Show me more → 'one short video'. Then 'decision log' at the side, struck: 'not directly'

_Says:_ Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it as something you know. Change the plan: it goes into the plan, under You told me first. The code is wrong: it becomes a fix. Show me more: a longer card now, and one short video of those gaps at the end. Nothing goes straight into the decision log, the record of your answers.

### Scene 20 · Question 3 · When a card comes back

_Shows:_ A SMALL MEMORY LINE first: 'knows: a headless run takes it · inbox.mjs:700–705 · 4b1e', 'fingerprint' pinned on 4b1e. Then THE QUESTION AND THREE CARDS, still. The recommended card carries 'recommended'

_Says:_ Got it is kept with the lines' fingerprint, a short code that changes when they do. Question three. A: the same card comes back only when those lines change. B: also once more, on a new case, a few days later. C: whenever a plan depends on it. I recommend A: a change to the code is what makes your picture stale. When does the same card return?

### Scene 21 · If A · when its lines change

_Shows:_ kicker 'If A'; a timeline: 'Got it · 4b1e', weeks of nothing, 'inbox.mjs edited · 9c07', 'asked again'

_Says:_ With A, the card returns only after its lines change.

### Scene 22 · If B · once more, later

_Shows:_ kicker 'If B'; a timeline: 'Got it', 'three days', 'a new case'

_Says:_ With B, it returns once more, on a new case, a few days on.

### Scene 23 · If C · whenever a plan needs it

_Shows:_ kicker 'If C'; a timeline: 'Got it', then 'plan', 'asked', 'plan', 'asked'

_Says:_ With C, it returns each time a plan leans on it.

### Scene 24 · Quick check · A want, not a fact

_Shows:_ THE CASE ON A LINE ABOVE, your words in quotes: 'and it should only go to the session I have open'; the heading and three cards land, still

_Says:_ Quick check. You say: and it should only go to the session I have open. How is that claim marked?

### Scene 25 · Step 5 · Into the loop

_Shows:_ THREE PLACES in a row, each landing on its word: 'before a plan' with candidates → 'a round, if worth it'; a quick-check card with the four buttons under its answer and 'Approve · never blocked'; a planned reel status line 'rounds 3 · gaps 11 · Got it 7 · the plan 3 · a fix 1', with 'too few plans to compare'

_Says:_ Step five puts the round in the loop. Before a plan on code that exists, the agent lists the likely gaps, and runs a round when one is worth your time. A wrong quick check gets the same four buttons; Change the plan's words reach the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and later surprises.

### Scene 26 · Question 4 · How often a round comes

_Shows:_ THE QUESTION AND THREE CARDS, still, each showing what the two requests get: A 'Send · 4 cards, rename · 2 cards'; B 'Send · 4 cards, rename · none'; C 'none, none'. The recommended card carries 'recommended'

_Says:_ Question four. A: a round comes before every plan on code that exists: the surest, and two minutes more each time, often for nothing. B: when the agent finds a gap that's likely and costly; it can overlook one it didn't see coming. C: only when you ask. I recommend B, with a line in the plan when there was none. How often does a round come ahead of a plan?

### Scene 27 · If A · every plan

_Shows:_ kicker 'If A'; three plans in a row, each with a round before it

_Says:_ With A, every plan on existing code starts with a round, a rename included.

### Scene 28 · If B · when it's worth it

_Shows:_ kicker 'If B'; two plans: 'rename the Save button · no round', 'make Send reach my open session · 4 cards'

_Says:_ With B, the rename gets no round, and the change to Send gets four cards.

### Scene 29 · If C · only when you ask

_Shows:_ kicker 'If C'; a chat line 'align me first', then a round

_Says:_ With C, a round comes only when you say: align me first.

### Scene 30 · Quick check · Two gaps, more please

_Shows:_ THE CASE ON A LINE ABOVE: 'a round of 5 · Show me more on c2 and c4'; the heading and three cards land, still

_Says:_ Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?

### Scene 31 · Quick check · A quick check you missed

_Shows:_ THE CASE ON A LINE ABOVE: 'a video like this one · quick check k2 wrong · you pressed Change the plan'; the heading and three cards land, still

_Says:_ Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?

### Scene 32 · The plan

_Shows:_ THE RAIL OF FIVE STEPS, each with its slot for an answer (data-plan-step): step 2 · question 1; step 3 · question 2; step 4 · question 3; step 5 · question 4; the triangle small beside it, its three sides closed. Holds still

_Says:_ That's the plan: a round of a few cards where a gap is likely, your own words checked, one click to settle each gap, and the round in the loop. Your four answers sit on the steps. Draw on any step to leave a note, or approve.
