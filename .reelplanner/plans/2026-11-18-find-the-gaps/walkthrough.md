# Find the gaps — implementation

**In one sentence:** before a plan, answer a few cards about how you think the code works, see the code's own lines on each, and settle every gap you find with one click, in the chat, on the review page or in a video's quick check.

**Started from:** `95a5bdb` (the approval recorded in conversation).

## Autonomous choices

| ID | Step | Chose | Instead of | Why | Where to check |
|---|---|---|---|---|---|
| A1 | 4 | Keep a Got it in `~/.reelplanner/you.jsonl` as a line marked `kind: "knows"`, which `readYou` skips and the new `readKnows` reads [hard-to-undo] | A file of its own beside `you.jsonl`, or unmarked lines every reader of the file would count as a review | The plan names your memory's file; marking the line keeps every review count, memory line and dedup as it was | `scripts/lib/memory.mjs` `readYou`, `readKnows`, `appendKnows` |
| A2 | 1 | A checker answer of `?` (its lines do not decide it) stops the round like a disagreement, saying "quote the lines that do" [close] | Treating `?` as no answer, or as agreement | The first real round showed it: two of three cards quoted too few lines to decide them, which is a card that would teach a guess | `scripts/lib/align.mjs` `checkRound`, `checkerAnswers` |
| A3 | 1 | `align --check` fails while any predict card has no checker answer; `--no-checker` checks the rest first [visible] | Making the checker a warning, or a separate command | A card reaches you only when the agent and the checker agree (step 1); `--no-checker` lets the brief be written from cards that already pass | `scripts/align.mjs`, `checkRound({ checker })` |
| A4 | 1 | A card's `- source:` is one `path:from-to` range, read as pinned [close] | Several ranges a card | One range a card keeps the back of the card one block of code, and the checker's brief one block to read; a card that needs two files is two cards | `scripts/lib/align.mjs` `refOf`, `linesOf` |
| A5 | 4 | A due card comes back as one more card in the first round three days on: `--check` warns on a due card and asks for `- once_more: <fingerprint>`; Got it on it is "known for good" (`asked: 2`) [close] | A second card the tool adds by itself | The agent writes the new case (other names, the same rule); the tool can only say which thing is due | `scripts/lib/align.mjs` `knowsFor`, `checkRound`, `recordAnswers` |
| A6 | 4 | You told me first is a `## You told me first` section put before the plan's first `### Step`, made when absent; The code is wrong lands there too, as a line marked "A step of this plan." with the card's lines, for the agent to make into a step [visible] | At the end of plan.md; `record` writing a `### Step` itself | It is what the plan is written on, so it reads before the steps; a step needs its cases and interface, which the agent writes, and `record` adding steps to a reviewed plan would change what was approved | `scripts/lib/align.mjs` `appendSection`, `recordAnswers` |
| A7 | 2 | The record merges answers by card, and each card's settlement is routed once (`routed` in answers.json) [close] | Routing every time `record` runs | The page sends answers as they come and Send sends them all again; a Got it must not land twice in your file | `scripts/lib/align.mjs` `recordAnswers` |
| A8 | 4 | Show me more's one video is a command the agent runs, `align --explain-gaps` printing `reelplanner explain "<the gaps, from what you expected>" <their files> --depth low` [visible] | Building the explainer from inside `align record` | An explainer is built like any video (narration, frames, fresh eyes); the record stays seconds | `scripts/lib/align.mjs` `explainGaps` |
| A9 | 2 | The round page is `/round/?r=<name>` on the review server, `reelplanner review <round>` opening it with no video bundled; any round of the repo is served by name [visible] | A row in the video library | A round is no video: it has no frames or narration to bundle, and one server per repo serves both | `scripts/review.mjs` (`rounds`, `roundOnly`), `scripts/lib/align-server.mjs` `roundAsset`, `roundByName` |
| A10 | 2 | Send files the round as an inbox row of kind `align`, delivered with a start that never starts anything [hard-to-undo] | A row of its own folder, or a page-only record | `review --wait` already wakes the waiting session on an inbox row; giving it a no-op start keeps the rule that a round never starts a headless run | `scripts/lib/align-server.mjs` `api/round/send`, `scripts/inbox.mjs` `roundNote` |
| A11 | 3 | Your spoken words on a say card go to the waiting session as an inbox question of kind `say` that carries the `align answer` command; the page polls for the claims [close] | The server splitting words into claims itself | Splitting and checking need reading the code (D-315: the waiting session does it); questions already never start a headless run | `scripts/lib/align-server.mjs` `api/round/say` |
| A12 | 3 | Talking is written down by the local whisper (`whisper-cli` + `ggml-small.en.bin`), with no model saying "type your words instead" [visible] | A hosted speech-to-text | Nothing you say leaves the machine; the model narration installs is already there | `scripts/lib/align-server.mjs` `transcribe` |
| A13 | 2 | A settled card moves on by itself; a card you had the same picture on moves on after two seconds [close] | A Next press after each | One key a card is the least effort; Next stays for a card you want to read | `packages/player/align-page.html` `settle`, `draw` |
| A14 | 5 | (asked: the plan's question 5) Whether a plan had a round is a `**Round:**` line the skill writes in the plan's header (a round's folder, `none, a likely, costly gap (<why>)`, or `none needed`), with a round's own `**Plan:**` line counting too [hard-to-undo] | A record of each judgement kept by a command | The comparison needs the plans where a likely gap had no round, which only the agent knows when it writes the plan; one header line is readable and costs nothing | `scripts/lib/align.mjs` `roundLineOf`, `roundStats` |
| A15 | 5 | A late fix counts against the plan whose call was changed later (`plan` added to each miss); a step reworked after a walkthrough check counts once, as its Expected something else [close] | Counting a reworked step as both | The four kinds of surprise should not count one thing twice | `scripts/lib/memory.mjs` `findMisses`, `scripts/lib/align.mjs` `roundStats` |
| A16 | 5 | The quick check's settle row sits inside its "Expected something else?" box, and pressing Change the plan or The code is wrong relabels that box and focuses it; words typed with no way chosen are Change the plan's [visible] | A row of its own on the frame | The box is already placed on the frame by the layout; the plan says its words become Change the plan's | `packages/player/reelplanner-player.js` `syncSettle`, `settleQuiz`, `saveDisagree` |
| A17 | 5 | A quick check settled Got it with no words sends no rewrite of its step; The code is wrong or Change the plan with no words asks the agent to ask how [close] | Sending every missed check as "explain this step so the answer is obvious", as before | Got it says the reviewer had it wrong, not that the step was unclear; left unsettled, it is sent as before | `scripts/lib/review-scope.mjs` `reviseScope` |
| A19 | 3 | A recording is thrown away once whisper has written it down; only your words, which you can edit, are kept [hard-to-undo] | Keeping the recording in the inbox | Your words are the record and you check them before Check; a recording kept is a voice file on disk for nothing (D-249: never a transcript in git; D-305) | `scripts/lib/align-server.mjs` `transcribe` |
| A20 | 1 | A round's repo is found from its own folder (the git top around `.reelplanner/align/`); `sources.json`'s `repo` path is read only for a round kept on this machine [close] | Always the path `sources.json` names, or no path at all | A committed round must work in every clone; a round kept in `~/.reelplanner/align/` has no repo around it but the one it names | `scripts/lib/align.mjs` `repoOfRound` |
| D1 | 5 | Step 5's fifth choice (A18) was made and the step built before its biggest open choice became the plan's question 5 [deviation] | Stopping at the fifth choice, asking, and building the rest after the answer (D-110) | Noticed only when counting the step's rows; the question is now open, and the code follows its recommendation (A): an answer of B or C changes `roundLineOf` and `roundStats` only, nothing stored | `plan.md` question 5; `scripts/lib/align.mjs` `roundLineOf`, `roundStats` |
| A21 | 4 | (asked: the plan's question 6) A card's diagram is a ```diagram block under the card, written by the agent in the diagram text plans already use, drawn as the guide draws one; Show me more opens it, and a point card's boxes are its options [close] | Drawn by the tool from the pinned lines, or no diagram | The diagram shows what the card is about (who waits, in what order), which the lines alone often don't; one drawing serves both | `scripts/lib/align.mjs` `parseCards`, `cardDiagram`, `checkRound` |
| A22 | 4 | A frame that shows lines you know from a round is a warning in `check-terms`, and `reel prereqs` lists what you know on the plan's files [close] | Failing the build on it | A walkthrough may show the same lines changing, which is not explaining them again; a warning says it where the agent writes the video | `scripts/check-terms.mjs`, `scripts/reel.mjs` `prereqs`, `scripts/lib/align.mjs` `knownNow` |
| A18 | 5 | Show me more on a quick check with no worked example marks it "asked to have it explained again" (`unclear`) [close] | A button that does nothing there | That is the existing explain-again path the revise already reads | `packages/player/reelplanner-player.js` `settleQuiz` |

## Implementation by step

**Ran in a scratch repo:** `runs/align-*.txt`, `runs/review-round.txt`, `runs/reel-status-rounds.txt` — a new git repo with one file, `src/send.mjs` (how a review is handed on: the waiting session, else a headless run, else the inbox), set up with `reel init`, and one plan; `HOME` pointed at the scratch folder, so your own memory file was never touched. `runs/real-round.txt` ran here, on this repo's own round.

### Step 1 — A round of cards, written where a gap is likely and costly

**You can now:** start a round on the code a plan touches, write up to six cards, and have a fresh agent read each card's code before you ever see it.

**Commits:** `dfab7f3`.

`reelplanner align "<your words>" <sources…> [--plan <plan-dir>]` makes `.reelplanner/align/<date>-<slug>/` (a repo not set up: `~/.reelplanner/align/<repo-key>/`, nothing written into the repo), with `align.md` (your words, the plan it is for, a `## Cards` section to write in) and `sources.json` (each source pinned at its commit and hash, as an explainer pins it: `pinAll` in `scripts/lib/explainer.mjs`). `--candidates` lists the four places a gap is likely: your words, your memory (quick checks missed on these files), what moved since you last watched, and cards due once more. `--check` holds the cards to the plan's rules: at most six; `likely_wrong` and `matters` on each; an assume card has no answer; a predict card has a source, an answer among its options, and a quote found word for word in its lines; nothing you know already at the same lines. `--prompt checker` writes `checker/brief.md` with each predict card's question, options and lines and never its answer or why, and prints the prompt for a fresh agent, which writes `checker/answers.md`; `--check` then fails on a predict card it read otherwise, or could not decide (`?`, A2). The first real round, on this repo's inbox (`.reelplanner/align/2026-11-18-review-reaches-agent/`), had its first checker catch a card whose answer was wrong (`checker/round-1/`); the rewritten cards pass.

**Tests:** `scripts/test/align.spec.mjs` (57 checks: the folder in both kinds of repo, each rule of `--check`, the brief holding no answer, the checker's disagreement and `?`).

```diagram
flow: A round's cards, before you see them
your words + the files -> align: pinned at the commit
align -> align.md: you write the cards
align.md -> --check: the rules
--check -> the fresh checker: only the lines
the fresh checker -> --check: agrees | a card it reads otherwise stops the round
--check -> you: the cards that pass
```

#### Worked examples

##### Starting a round

- **Input:** `reelplanner align "how a review is handed on" src/send.mjs --plan .reelplanner/plans/2026-11-18-send`
- **What happens:** the round's folder, its one source pinned at the commit, and the next commands.
- **Output:** `runs/align-start.txt`
- **Edge cases:** a repo with no `.reelplanner/` keeps the round on this machine; a source that is not in git is refused, as an explainer refuses it.

##### A quote that is not in its lines

- **Input:** a predict card whose `- quote:` says `if (command) wait`, then `align <round> --check --no-checker`.
- **What happens:** the card fails, naming its line in `align.md`; nothing reaches you.
- **Output:** `runs/align-check-quote.txt`
- **Predict:** the quote is one word off. Does `--check` pass it? No: a quote is matched word for word, or the card would teach a line the code does not hold.

##### The checker reads it otherwise

- **Input:** the checker answers `- c2: a`, where the card says B; then it answers `b`.
- **What happens:** the first `--check` stops: "the checker read the lines as A, the card says B: rewrite it once"; the second passes.
- **Output:** `runs/align-checker.txt` (lines 18-24)
- **Edge cases:** `?` stops the round the same way (A2); a card the checker never answered fails (A3).

#### Why it works this way

The agent writing the cards is the one whose picture may be wrong. A card that teaches its picture is worse than no card, so a second reader with no context and only the lines must agree first (D-001's idea, applied to the cards). Pinning the sources means the back of a card shows the lines as they were when it was written, and a Got it can be matched to those exact lines later.

#### What else was considered

The checker as a warning (A3): the first real round showed it catching a wrong card, so it stops the round. Several ranges a card (A4): one block of code keeps the back readable.

#### What breaks it

A source edited since the round started: the lines are read as pinned, so the card stays true to what it quoted; a new round pins the new lines. A checker given more than its brief would read the repo and inherit nothing, but could answer from code the card does not show: its prompt names the one file it may read.

#### Limits

Nothing writes the cards for the agent: `--candidates` points at where to look, and the agent judges likely and costly. The checker is run by the agent (a subagent); the tool only checks that its answers agree.

#### Files and commands

`scripts/align.mjs`, `scripts/lib/align.mjs` (`roundsDir`, `parseCards`, `linesOf`, `checkRound`, `writeCheckerBrief`, `checkerAnswers`, `candidates`); `reelplanner align`, `--candidates`, `--check [--no-checker]`, `--prompt checker`.

### Step 2 — One round, three ways to answer it: in the chat, on the page, in a video

**You can now:** answer a round in the chat, or open it on the review page and answer it one card at a time with a key, and have every answer land in the same record.

**Commits:** `35ab170` (the record and the chat's cards), `6cbef4a` (the page), `054419b` (point cards).

In the chat, `align <round> --cards` prints each card's front, then its back (the lines, the answer, why), assume cards first; the agent asks them one at a time (AskUserQuestion in Claude Code) and records them with `align record <round> <answers.json>`. On the page, `reelplanner review <round>` opens `/round/?r=<name>` on the review server, with no video to bundle (A9): `packages/player/align-page.html`, in the review page's look (paper, ink, the coral on what is yours; EB Garamond, Inter, JetBrains Mono). Its API is `scripts/lib/align-server.mjs`, behind the server's host and origin checks: the fronts with no answer, why or lines until you answer; each answer recorded as it comes through the same `recordAnswers` the chat uses (`via: "page"`); Send files the round as an inbox row of kind `align` for the waiting session, and never starts a headless run, even with one configured (A10); `review --wait` prints what came back (`roundNote` in `scripts/inbox.mjs`). In a video, a quick check settles the same way (step 5). Found while saving the runs: answering a card again with a different pick kept the old settlement; a new answer now clears it, so the card is settled again (`recordAnswers`, checked in `align-page.spec.mjs`). A point card (`- point: yes`, with a ```diagram block under it, A21) is drawn on the page as the guide draws a diagram, and you answer by clicking a box; the chat asks the same card by its boxes' names.

**Tests:** `scripts/test/align-page.spec.mjs` (51 checks: the page and its fonts, the fronts with nothing given away, a wrong pick turning over to the lines, Got it landing once, Not sure's two ways, the say card's route, Send into the inbox and never a headless run, another site refused; in Chromium, a key answering a card, 1 settling it, a right pick moving on, Send; a point card answered by clicking a box of its diagram, the back marking your box and the answer's).

```diagram
flow: One record, three ways in
the chat -> align record: answers.json
the review page -> /api/round/answer: as you answer
/api/round/answer -> align record: the same record
a video's quick check -> the review: settled (step 5)
align record -> answers.json: merged by card, routed once
the review page -> Send: the inbox | never a headless run
```

#### Worked examples

##### The chat's cards

- **Input:** `reelplanner align <round> --cards`
- **What happens:** the assume card first, then each predict card's front with its options and Not sure, then its back: the lines, the answer, why.
- **Output:** `runs/align-cards.txt`
- **Predict:** No session is waiting and a command is set. Where does the review go? B: a headless run (`src/send.mjs:4`).

##### The page, its API, and Send

- **Input:** `reelplanner review <round> --no-open`, then the page's own requests.
- **What happens:** the fronts come with no answer; a wrong pick comes back with the lines and "gap"; another site's page is refused; Send files it in the inbox ("a round never starts a headless run"), and `inbox --wait` prints it, saying nothing goes into the decision log.
- **Output:** `runs/review-round.txt`
- **Edge cases:** a round name that is not this repo's is a 404; `transcribe` takes audio only.

#### Why it works this way

The page and the chat must end the same way (D-314), so neither has its own record: both call `recordAnswers`, and each settled card is routed once however often it is sent (A7). The page is a page of the review server, not a row in the library, because a round has no frames to bundle and the server already guards the API and wakes the waiting session.

#### What else was considered

A row in the video library (A9); a folder of its own for sent rounds (A10). Both would have needed a second way to wake the session.

#### What breaks it

A second review server for the same repo on another port: the page talks to the one it was opened from. A round's folder moved out of `.reelplanner/align/`: the page finds rounds by name in that folder only.

#### Limits

A point card needs its diagram written with it (A21). The page has been driven in headless Chromium, not yet by you.

#### Files and commands

`scripts/lib/align-server.mjs`, `packages/player/align-page.html`, `scripts/review.mjs` (round folders as arguments, `/round/`, `api/round*`), `scripts/inbox.mjs` (`roundNote`), `scripts/lib/align.mjs` (`recordAnswers`, `cardsForChat`); `reelplanner align <round> --cards`, `reelplanner align record`, `reelplanner review <round>`.

### Step 3 — Say it in your own words, and see each thing you said checked

**You can now:** hold Space on a say card and talk (or type), and get back each thing you said marked as matching the code, differing from it, or a want rather than what is.

**Commits:** `6cbef4a` (the page and its routes), `35ab170` (`align answer`), `054419b` (live words, the checker on claims, the microphone run end to end).

On a say card, holding Space or the microphone records with `MediaRecorder`; `POST /api/round/transcribe` writes it down with the local whisper (`transcribe` in `align-server.mjs`: ffmpeg to 16 kHz, `whisper-cli` with `ggml-small.en.bin`), and nothing leaves the machine (A12). The words stay editable. Check sends them as an inbox question of kind `say` for the waiting session (A11), whose words say what to do: split them into claims, check each against the pinned sources, run the fresh checker on each marked claim, and record them with `reelplanner align answer <round> <card> <claims.json>`. The page polls and shows each claim: ✓ a match, ✗ a gap, ? an open want (an assume card next), or not settled where the session and the checker read it differently. A switch, off on every visit until you turn it on, gives live words instead: the browser's own recognition, which in some browsers sends the audio to its maker's servers, as the switch says. With no whisper here the card says to type and how to install it (`reelplanner setup --local-voice`); with no session waiting it says your words wait in the inbox for the next. The session's marks reach you only after the fresh checker: `align <round> --prompt claims --card <card>` writes its brief (each marked claim and its lines, never the mark), and `align <round> --claims <card>` applies its reading; a claim it reads otherwise, or cannot decide, is shown as not settled.

**Tests:** `align.spec.mjs` (claims ✓ ✗ ?, a differs claim must name its lines, an open claim asks for an assume card not counted in the six); `align-page.spec.mjs` (the say question and its command, the claims coming back, transcribe refusing anything but audio and saying "type your words instead" with no whisper; the claims not shown until the fresh checker's reading is applied, its brief holding no mark, a claim it reads otherwise not settled; the say card with no whisper saying how to install it, the live switch off and saying where the audio may go; the microphone end to end, a spoken clip as Chromium's microphone written down by whisper here).

```diagram
flow: Your words, checked
you talk -> whisper: on this machine
whisper -> your words: editable
your words -> the waiting session: a question, never a headless run
the waiting session -> claims: match, differs, open
claims -> the fresh checker: each marked claim, from its lines
claims -> the page: ✓ ✗ ? or not settled
```

#### Worked examples

##### A say card's claims

- **Input:** "It goes to my session. If I'm not there it waits. It should tell me.", split into three claims and `align answer`.
- **What happens:** one ✓ (`src/send.mjs:3`), one ✗ (`src/send.mjs:4`: with a command set it starts a run), one ? (a want): an assume card is asked for it.
- **Output:** `runs/align-record.txt` shows the record; the claims run is in `scripts/test/align.spec.mjs` ("align answer: a say card's claims").
- **Edge cases:** a claim marked differs with no lines is refused; no whisper: the page says to type.

#### Why it works this way

Splitting spoken words and checking them needs someone who reads the code, and the waiting session reads it best (D-315). A question is the route the page already uses for Ask about this, and it never starts a headless run.

#### What else was considered

A small hosted model on the page (the plan's question 2, option B): your words would leave the machine, and it would see only the pinned lines.

#### What breaks it

No session waiting: the words wait in the inbox as a question, and the page says so. A recording longer than about 25 MB is refused.

#### Limits

Live words need a browser whose speech recognition runs; headless Chromium has the switch but cannot hear, so they have not been seen working. Speaking without them needs whisper and its model installed (`reelplanner setup --local-voice`), which the card says.

#### Files and commands

`scripts/lib/align-server.mjs` (`transcribe`, `api/round/say`), `packages/player/align-page.html` (`drawSay`, `startRec`, `checkSay`), `scripts/lib/align.mjs` (`validClaims`); `reelplanner align answer <round> <card> <claims.json>`.

### Step 4 — Settle each gap, and keep what it settled where it belongs

**You can now:** settle a gap with one of four ways and see it land where it belongs: your memory, the plan's You told me first, a fix, or one short explainer.

**Commits:** `35ab170`, `054419b` (Show me more's diagram, what you know in a later video).

`recordAnswers` sends each newly settled gap once: **Got it** into your memory (`~/.reelplanner/you.jsonl`, a line of `kind: "knows"` at the lines' fingerprint, A1), due once more on a new case three days on (`ONCE_MORE_DAYS`; D-316); the second Got it is known for good (A5). **Change the plan** and an assume card's **Not quite** go into the plan's `## You told me first`, before its first step (A6); with no plan, into `align.md`. **The code is wrong** becomes a step of the plan, or `issue.md` for you to file. **Show me more** is listed for one short explainer of every such gap (`align --explain-gaps` prints its `reelplanner explain` command, A8). Skipped cards are "Assumed, not checked". `align due` lists what is due; `reel memory --you` says how many things you know from rounds. A card on lines you know, not yet due, fails `--check`; due, it warns until the card says `- once_more:`; once the lines change, it is not known any more. Nothing goes into the decision log. Show me more opens the card's `- more:` and its diagram at once (A21). A later video drops what you know: `reel prereqs` lists the Got it things still true on the plan's files, found by their lines' text wherever it has moved (`knownNow`), and `check-terms` warns on a frame that shows those lines again (A22).

**Tests:** `align.spec.mjs` (each way's destination, nothing routed twice, the three days, known for good, a changed line, the decision log untouched); `memory.spec.mjs` (81 checks, as before: the knows lines are not counted as reviews); `align.spec.mjs` again (what you know found where its lines moved, `check-terms` warning on a frame that shows them, `reel prereqs` listing them, not known once they change); `align-page.spec.mjs` (Show me more opening the card's text and diagram).

```diagram
flow: Where a settled gap goes
Got it -> your memory: due once more in 3 days
Change the plan -> You told me first: in the plan
The code is wrong -> a step of the plan: else issue.md
Show me more -> one explainer: of all such gaps
skipped -> Assumed, not checked
anything -> the decision log: never
```

#### Worked examples

##### Recording a round

- **Input:** `reelplanner align record <round> answers.json` with c1 Right, c2 A settled Got it, c3 skipped.
- **What happens:** c1 into You told me first in a line, c2 into your memory (asked once more from three days on), c3 Assumed, not checked; the plan shows both sections before its first step; `reel memory --you` says one thing known.
- **Output:** `runs/align-record.txt`, `runs/align-due.txt`
- **Before:** the plan's header, then `### Step 1`. **After:** `## You told me first` and `## Assumed, not checked` before it.

#### Why it works this way

Each way is where the thing it settles is used next: what you know is read before the next video explains it (D-218), what you want changed is what the plan is written on, a fix is work. The decision log keeps what was decided on a plan's own questions; a round settles pictures, not decisions.

#### What else was considered

A file of its own for what you know (A1): every reader of your memory would need to learn a second file. A second card added by the tool on a due thing (A5): only the agent can write a new case.

#### What breaks it

Editing `answers.json` by hand past `routed`: a settlement already routed is not routed again. A plan folder renamed after the round: `**Plan:**` no longer finds it, and You told me first goes into `align.md`.

#### Limits

Show me more opens its text and diagram on the card itself, not as a detail over it (D-195's way); the one explainer is built by the agent after the round. A card's diagram is only as right as the agent drew it: `--check` holds that it reads, and that a point card's options are its boxes, not that it matches the code.

#### Files and commands

`scripts/lib/align.mjs` (`recordAnswers`, `knowsFor`, `appendSection`, `explainGaps`, `writeAfter`), `scripts/lib/memory.mjs` (`readKnows`, `appendKnows`), `scripts/reel.mjs` (`memory --you`); `reelplanner align record`, `align due`, `align <round> --explain-gaps`.

### Step 5 — Into the loop: before a plan, in every quick check, and measured

**You can now:** get a round only when one is worth your time, settle a wrong quick check in any video the same way, and see in `reel status` how rounds went.

**Commits:** `76cc466`.

The skill's **A round** section (`skills/plan-to-video/SKILL.md`) runs it before a plan: candidates first, a round only when a gap is likely and costly (D-317), assume and say cards only in a new project, the checker, the chat by default and the page when you would rather click or talk, and the plan's `**Round:**` line saying which it was (A14, the plan's new question 5). In the player, a wrong quick check now shows Got it, Change the plan, Show me more, and in a walkthrough, an explainer or the system video, The code is wrong, inside its "Expected something else?" box (A16); Change the plan's words are the box's, and it never blocks Approve (D-129). The revise reads each way (A17): Got it with no words sends no rewrite, Change the plan and The code is wrong carry your words, Show me more is the explain-again it already had (A18). `reel status` gains an Alignment rounds block: rounds and gaps by settlement, later surprises (own words, Expected something else, flagged calls, late fixes) with a round against plans with a likely gap and none, and "too few plans to compare" below five of each.

**Tests:** `packages/player/test/quiz.spec.mjs` (five new checks: the row on a wrong answer, Change the plan focusing the box and recording its words, Got it, nothing on a right answer); `align.spec.mjs` (the Round line, the two kinds of plan, surprises counted once, the status lines, each settlement in the revise); the player's frame-room, answer-on-frame, revisit and band specs still pass.

```diagram
flow: Before a plan
your request -> candidates: four places
candidates -> a round: likely and costly
candidates --> the plan: none worth asking | **Round:** none needed
a round -> the plan: You told me first
the plan -> its video: a wrong quick check settles four ways
reel status -> rounds: compared after 5 and 5
```

#### Worked examples

##### reel status after one round

- **Input:** `reelplanner reel status .` in a repo with one answered round.
- **What happens:** "rounds: 1, gaps: 1 (Got it 1)", the surprises line, and "too few plans to compare (1 with a round, 0 with a likely gap and none; 5 of each)".
- **Output:** `runs/reel-status-rounds.txt` (lines 6-10)
- **Edge cases:** a plan with `**Round:** none needed` is in neither group: the comparison is only with plans where a gap was likely.

##### A wrong quick check in a plan video

- **Input:** in the player, answer quick check A where B is right, then press Change the plan and type "retries should stop after three".
- **What happens:** the box is relabelled "Change the plan: how should it work?" and takes the keys; the check is recorded `settled: "change-plan"` with your words, which reach the agent as a comment does.
- **Output:** the run is `packages/player/test/quiz.spec.mjs`, section 2d (`npm test`).
- **Predict:** in a plan video, is The code is wrong offered? No: nothing is built yet.

#### Why it works this way

A round costs your time, so the agent asks only where a gap is both likely and costly (D-317), and says in the plan which it was, so the comparison is between plans that had a gap worth asking about, not the easy ones. A quick check is already a predict card inside a video, so it settles the same way rather than in a second vocabulary.

#### What else was considered

A command recording each judgement, or counting only the rounds themselves: the plan's question 5 asks you. A settle row of its own on the frame (A16): the frame's layout already places the box.

#### What breaks it

A plan written without its `**Round:**` line is counted in neither group. A quick check's Got it in a video goes into your memory as part of the review's summary (`wrongChecks[].settled`), not as a fingerprinted thing you know: a video's check has no pinned lines.

#### Limits

No round has yet run before a real plan, and none has been answered by you; the comparison needs five plans of each kind before it says anything.

#### Files and commands

`skills/plan-to-video/SKILL.md` (**A round**, **A new plan** step 2), `packages/player/reelplanner-player.js` (`syncSettle`, `settleQuiz`), `scripts/lib/review-scope.mjs`, `scripts/lib/align.mjs` (`roundLineOf`, `roundStats`, `roundStatusLines`), `scripts/lib/memory.mjs` (`plan` on each miss, `settled` on each wrong check), `scripts/reel.mjs` (`status`), `docs/reference.md`, `docs/status.md`, `docs/project-dir.md`; `reelplanner reel status`.

## Decisions in force

Each decision the plan cites, and whether the code holds to it (checked again by the code check):

- **D-001** holds: `scripts/lib/align.mjs` `writeCheckerBrief`/`checkerPrompt` (a fresh agent with no answers answers each predict card; `checkRound` fails on a disagreement)
- **D-005** holds: nothing in this change touches it; the player diff adds only the settle row (`packages/player/reelplanner-player.js` `syncSettle`, `settleQuiz`)
- **D-024** holds: detail pages untouched
- **D-082** holds: `scripts/lib/align-server.mjs:183` passes Send a start that returns `{ started: false }`, and a say card goes through `deliverInbox(..., { question: true })`, which never reaches `start()` (`scripts/lib/inbox.mjs:700`)
- **D-085** holds: nothing in this change touches it
- **D-106** holds: `scripts/lib/memory.mjs` `appendKnows` writes to `youPath()` (`~/.reelplanner/you.jsonl`)
- **D-107** holds: the retro line in `scripts/reel.mjs` status is unchanged
- **D-109** holds: `scripts/lib/memory.mjs` `findMisses` only adds a `plan` field; nothing new stops on a miss
- **D-110** not kept on step 5: its fifth choice was built before its question was asked; said as the deviation D1, and asked as the plan's question 5.
- **D-128** holds: "you watched it" storage untouched
- **D-129** holds: `packages/player/reelplanner-player.js` `settleQuiz` never gates Continue or Approve; `packages/player/test/quiz.spec.mjs` 2d goes on with nothing settled
- **D-142** holds: `packages/player/align-page.html:12` uses `--coral: #B8552E`, the player's `--accent`
- **D-166** holds: nothing in this change touches it
- **D-167** holds: `packages/player/align-page.html` takes the review page's palette and fonts
- **D-169** holds: nothing in this change touches it
- **D-170** holds: nothing in this change touches it
- **D-171** holds: nothing in this change touches it; nothing from a round enters the decision log (`scripts/lib/align.mjs` `recordAnswers`)
- **D-195** holds: the player's detail opening is untouched
- **D-196** holds: nothing in this change touches it
- **D-197** holds: when and where quick checks are asked is untouched
- **D-198** holds: nothing in this change touches it
- **D-199** holds: nothing in this change touches it
- **D-200** holds: nothing in this change touches it
- **D-201** holds: nothing in this change touches it
- **D-202** holds: nothing in this change touches it
- **D-213** holds: nothing in this change touches it
- **D-215** holds: nothing in this change touches it
- **D-216** holds: nothing in this change touches it
- **D-217** holds: nothing in this change touches it
- **D-218** holds: term underlining untouched
- **D-219** holds: nothing in this change touches it
- **D-220** holds: nothing in this change touches it
- **D-221** holds: the autonomy-row filters in `packages/player/reelplanner-player.js` are unchanged
- **D-222** holds: nothing in this change touches it
- **D-223** holds: nothing in this change touches it
- **D-224** holds: the round is its own page (`/round/`), not a row of the library
- **D-225** holds: Show me more's video is an ordinary `reelplanner explain` (`scripts/lib/align.mjs` `explainGaps`), so it gets fresh eyes as any video does
- **D-226** holds: a say card's words take Ask about this's route (`scripts/lib/align-server.mjs` `writeQuestion` + `deliverInbox` question)
- **D-227** holds: as D-225
- **D-244** holds: nothing in this change touches it
- **D-245** holds: nothing in this change touches it
- **D-246** holds: nothing in this change touches it
- **D-247** holds: nothing in this change touches it
- **D-248** holds: nothing in this change touches it
- **D-249** holds: `scripts/lib/align-server.mjs` `transcribe` keeps no recording; only words go into `align.md`/`answers.json`
- **D-250** holds: nothing in this change touches it
- **D-264** holds: nothing in this change touches it
- **D-266** holds: nothing in this change touches it
- **D-303** holds: nothing in this change touches it
- **D-304** holds: nothing in this change touches it
- **D-305** holds: no voice file is written into the repo (`scripts/lib/align-server.mjs` `transcribe` works in a temp folder)
- **D-309** holds: nothing in this change touches it
- **D-310** holds: nothing in this change touches it
- **D-311** holds: nothing in this change touches it; the new specs are added to `scripts/test/run.mjs`
- **D-312** holds: new code uses `reelplanner`/`.reelplanner`; the `reelplanning-review-server` meta in `scripts/review.mjs:558` is the existing marker the player reads
- **D-313** holds: a round is filed through the local inbox (`scripts/lib/align-server.mjs` `api/round/send`)
- **D-314** holds: chat, page and `align answer` all write through `recordAnswers` (`scripts/lib/align.mjs`)
- **D-315** holds: `scripts/lib/align-server.mjs` `api/round/say` hands the words to the waiting session as a question
- **D-316** holds: `scripts/lib/align.mjs` `ONCE_MORE_DAYS = 3`, `knowsFor` due, `checkRound` warns, `asked: 2` known for good
- **D-317** holds: `skills/plan-to-video/SKILL.md` runs a round only when a candidate is both likely and costly
- **D-232** holds: Ask about this is untouched; a say card's words take its route, a question for the waiting session (`scripts/lib/align-server.mjs` `api/round/say`).
- **D-306** holds: nothing a round settles is written into the decision log (`scripts/lib/align.mjs` `recordAnswers`), and no accepted call's lines are changed (`reel check --base 95a5bdb`: none).

## Code check

The fresh checker's findings are in `code-check/findings.md` (2 of 5 steps ✓, 60 of 61 decisions ✓, 4 unexplained). Each ✗, by its key:

- **Step 1** — fixed: a card the checker reads otherwise can be dropped with `- dropped: <how it read it>`; it is never checked or asked (`parseCards` leaves it out), and After the round lists it as "the agent and the checker read this code differently" (`writeAfter`). Checked in `align.spec.mjs`.
- **Step 3** — (1) fixed: a say card whose claims differ is a gap, made into a card from your first differing claim and its lines (`sayGapCard`) and settled the four ways, on the page and in the chat; The code is wrong on it goes to `issue.md` or the plan with your words and the lines (`align-page.spec.mjs`). (2) not done: the browser's live recognition behind a switch; the page records and the local whisper writes it down, nothing else (Not done). (3) partly: the skill now tells the session to give each marked claim, with only its lines, to a fresh agent and mark `unsettled` what it reads otherwise; no tool checks that it ran (Not done).
- **Step 4** — (1) fixed in part: a predict card's `- more:` is the longer explanation, shown on the card at once when you press Show me more, and given in the chat; no diagram (Not done). (2) fixed: the round's end offers Done, Plan this, and Explain the gaps once a gap asked for more; the session's `--wait` says which was pressed (`roundNote`). (3) not done: a later video's build does not read what you know from rounds to drop an explanation (Not done). (4) fixed: `reel memory --you --forget <fingerprint>` takes a thing out, and `reel memory --you` says so.
- **D-110** — a deviation, D1: step 5 was built past its fifth choice before asking. The question is open as the plan's question 5.
- **`scripts/align.mjs:134`** — fixed and a row, A20: a round's repo is the git top around its folder; the absolute path is read only for a round kept on this machine. Checked against a second clone in `align.spec.mjs` (it fails on the old code).
- **`scripts/lib/align-server.mjs:117-124`** — a row, A19: the recording is thrown away once written down.
- **`scripts/lib/align.mjs:280-281`** — a row: A6 now says that The code is wrong lands in You told me first, marked "A step of this plan.", for the agent to make into a step.
- **`packages/player/align-page.html:26,29,38`** — fixed: the question at 44 px, the options at 22 px and the lines at 20 px, as step 2's Look gives (smaller under 600 px wide).

## Tests run

`npm test` (the fast suite): 63 of 64 specs pass (`runs/npm-test.txt`). The one that fails, `session-export`, makes a file unreadable with `chmod 000` and expects reading it to fail; this container runs as root, which reads it anyway. Nothing in this change touches that code (`git diff 95a5bdb -- scripts/lib/codex-session.mjs` is empty). Full runs of the specs touched: `align`, `align-page`, `memory`, `reviews`, `review-data`, `contributing`, `package`, and the player's `quiz`, `answer-on-frame`, `frame-room`, `revisit`, `band`.

## Not done

- **Not yet used for real:** no round before a real plan, and the one real round in this repo (`.reelplanner/align/2026-11-18-review-reaches-agent/`) is checked but not answered by you.
- **The plan's question 5** (how a plan says whether a round ran) is open; it is built as recommended (D1).
- **The plan's question 6** (who draws a card's diagram) is open; it is built as recommended (A21).
- **Live words, in a real browser:** the switch and its wiring are built and checked in headless Chromium, whose speech recognition cannot run there; words appearing as you speak have not been seen in a browser that can.
- **A hosted round page:** there is none; a round is answered on this machine's review server or in the chat.


## Categories of change

- **The round and its checks** {align-round} (`scripts/align.mjs`, `scripts/lib/align.mjs`, `scripts/test/align.spec.mjs`, `.reelplanner/align/2026-11-18-review-reaches-agent/`) (step 1): a round's folder, its cards and the rules they pass, and the fresh checker that must read each predict card as the card does.
  Runs: `runs/align-start.txt`, `runs/align-check-quote.txt`, `runs/align-checker.txt`, `runs/real-round.txt`.
- **One record, and where each gap goes** {align-record} (`scripts/lib/align.mjs`, `scripts/lib/memory.mjs`, `scripts/reel.mjs`) (steps 2 and 4): answers from the chat or the page merged into `answers.json`, and each settled gap sent to your memory, the plan, a fix or one explainer, once.
  Runs: `runs/align-cards.txt`, `runs/align-record.txt`, `runs/align-due.txt`.
- **The round on the review page** {align-page} (`scripts/lib/align-server.mjs`, `packages/player/align-page.html`, `scripts/review.mjs`, `scripts/inbox.mjs`, `scripts/test/align-page.spec.mjs`, `scripts/test/run.mjs`, `package.json`) (steps 2 and 3): one card at a time, keys or your voice written down on this machine, and Send into the inbox, never a headless run.
  Runs: `runs/review-round.txt`.
- **Quick checks settle the same way** {quick-check-settle} (`packages/player/reelplanner-player.js`, `scripts/lib/review-scope.mjs`, `packages/player/test/quiz.spec.mjs`) (step 5): a wrong quick check offers the four ways under its answer, and the revise reads each.
  Runs: `runs/npm-test.txt`.
- **Into the loop, and measured** {align-loop} (`skills/plan-to-video/SKILL.md`, `scripts/lib/align.mjs`, `scripts/lib/memory.mjs`, `scripts/reel.mjs`, `docs/reference.md`, `docs/status.md`, `docs/project-dir.md`, `.reelplanner/system.json`) (step 5): the skill runs a round before a plan when one is worth it, and `reel status` counts rounds and compares later surprises.
  Runs: `runs/reel-status-rounds.txt`.
