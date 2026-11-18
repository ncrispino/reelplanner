# Find the gaps: line up your picture, the agent's and the code

**In one sentence:** before a plan, or whenever you ask, the agent finds the few places where you and it most likely picture the code differently, checks both pictures against the code, and you settle each gap with one click: you learn it, the plan changes, or the code is fixed.

## The problem

The owner asked (issue #57): "basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another. we want to actually interact to be able to do this." And: "rn reelplanner focuses on making the plans easier to understand and lowest friction. but we want to also make it easy for human to really make sure htey are aligned and interact in a way that is least effort for them to do interactions (this is what the drawing and voice was for) just like video is easiest way for them to understand."

Three things hold a picture of the code: you, the agent, and the code itself. They drift apart in three ways:

- **You and the code.** You think a review you send with no session open waits in the inbox for you. In this repo it doesn't: `.reelplanner/config.json` sets a headless command, so a headless run starts on it. Nothing told you otherwise, because nothing asked.
- **The agent and the code.** The agent read the inbox code an hour ago and remembers Send as trying once and giving up. It tries again: when the waiting session goes away, Send checks again 15 seconds later. A plan built on the agent's picture is wrong before you see it.
- **You and the agent.** You asked for "a review that reaches the agent". The agent took that to mean any agent, a headless one included. You meant the session you have open. Neither of you said so.

reelplanner today explains in one direction, from the agent to you. A plan video's quick checks test whether you followed what the video said, on a new case. They don't find what you assumed and the video never mentioned, and that is where surprises come from. The decision questions cover only the choices the agent saw. Ask about this answers what you think to ask.

Issue #53 asked for a whole-repo quiz with scores, readiness thresholds and spaced retests. That treats a wrong answer as you failing. Here a wrong answer is a finding: one of the three pictures is wrong, and it is not always yours. #53 is closed in favour of #57. Drawing your picture first (#23) stays separate for now; this plan leaves room for it as another way to give your picture.

The plan makes four changes:

1. **A round**: a few cards the agent writes where a gap is likely and costly, each about the code checked against the code, or about what you want (steps 1 and 2).
2. **Your own words**: say or type how you think it works, and each thing you said comes back checked (step 3).
3. **Settling and keeping**: one click on each gap, and what it settled goes to the right place: your memory, the plan, a fix, or a short video (step 4).
4. **Into the loop**: a round before a plan when one is worth it, the same settling on every quick check, and a count of whether it helps (step 5).

Steps 1 and 2 go together. Step 3 needs step 2's page. Step 4 needs step 2. Step 5 needs steps 1 and 4.

### Step 1 — A round of cards, written where a gap is likely and costly

**It lets you:** get a handful of questions about exactly the places you and the agent are most likely to disagree, each one checked against the code before you see it.

This step stands alone. A **round** is a short set of **cards**, at most six, about one topic: a part of the code, a plan about to be written, a change. It takes about two minutes. `reelplanner align "<topic, in your words>" <source> …` starts one in `.reelplanner/align/<date>-<slug>/`, with `align.md` (your words, then the cards) and `sources.json`, pinned the way an explainer pins its sources: each file by its commit and fingerprint, so a card can quote it word for word.

A card is one of three kinds:

- **Predict**, about the code as it is. "In this repo, you press Send and no session is waiting. What happens to the review?" Two to four options; the page always adds **Not sure**. The card holds the right answer, the lines that show it (`scripts/lib/inbox.mjs:700-705`), those lines quoted word for word, and one sentence why.
- **Assume**, about what you want. "I'm assuming you mean the session you have open, not a headless one." It has no right answer; only you can settle it. You answer Right, Not quite (and say what), or Doesn't matter.
- **Say**, your own words: "Say how you think a review reaches the agent." Step 3.

**Choosing the cards is the point.** A round that tests what you already know wastes your time; a round of trivia is #53 again. So every card carries two lines the agent must write: `likely_wrong:`, why a reasonable person would picture it otherwise (in a repo with no headless command the review does wait, and this one has one), and `matters:`, what depends on it (step 2 of the plan; an agent you didn't expect working on your review). `align` hands the agent four places to look for candidates, and the agent picks the likeliest and costliest:

- **Your words**: what your request takes for granted. "A review that reaches the agent" takes for granted which agent.
- **Your memory**: quick checks you missed on these parts, words you looked up, answers in your own words (`reel memory --you`).
- **What moved**: commits on the pinned files since you last watched a video of these parts.
- **The agent's own assumptions**: what it would have to take for granted to write the plan. These become assume cards.

**The agent's picture is checked too.** A card with a wrong answer would teach you something false. So before you see the predict cards, a fresh agent that never saw this conversation answers each one from the pinned sources alone. Where its answer differs from the card's, the agent's picture is the wrong one: the card is fixed against the code, or dropped. Who decides, and how: the agent rewrites the card once from the quoted lines, and the checker answers it again. A card reaches you only when the two agree. If they still disagree, the card is dropped and listed at the end of the round as "the agent and the checker read this code differently": a gap between the agent and the code, shown to you, not hidden. The assume cards need no check and come first, so the check runs while you answer them. What a round costs before you see it: the agent's own minute or two to list candidates and write the cards, and one fresh agent reading only the cards and their pinned lines, a few thousand tokens. Step 5 counts it with the rest, so a round's cost can be weighed against the gaps it found.

`align --check` holds a round to its rules before it opens: each quote is in its source word for word (the explainer's `check-sources`), each card has `likely_wrong:` and `matters:`, there are at most six, an assume card has no answer, and no card asks what your memory says you already know, at the same fingerprint.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Before a plan | "make Send reach my open session" | Two assume cards, three predict cards on the inbox | you ask: plan; agent lists: candidates; picked: 5 cards; checked: by a fresh agent; you see: the round |
| On its own | `reelplanner align "how a review reaches the agent" scripts/lib/inbox.mjs` | Four predict cards, one say card | you run: align; pinned: inbox.mjs; written: 5 cards; checked: quotes; you see: the round |
| The agent was wrong | A card says Send tries once; the checker reads a second try 15 s later | The card is fixed before you see it | written: card c4; checker answers: tries again; fixed: c4 against the code; you see: the right c4 |
| You know it already | Your memory knows c2 at the same fingerprint | c2 is not asked | listed: c2; memory: known at fingerprint 4b1e; dropped: c2; you see: 4 cards |
| Nothing worth asking | The agent finds no likely, costly gap | No round; the plan says so in a line | agent lists: candidates; none: likely and costly; you see: the plan |

#### Interface

```text
reelplanner align "<topic>" <source> …        # start a round: .reelplanner/align/<date>-<slug>/
  --plan <plan-dir>                          # a round before that plan; its answers go into it
reelplanner align <align-dir> --check         # quotes, likely_wrong, matters, at most six, not known already
reelplanner align <align-dir> --prompt checker  # the fresh agent's exact prompt: answer each predict card from the sources
align.md                                      # your words, then the cards, then (after) what each settled
  ### c1 · predict | assume | say             # one card
  - question:                                 # what you are asked
  - option_a: … option_d:                     # predict only; Not sure is added by the page
  - answer: <letter>                          # predict only
  - source: <path>:<from>-<to>                # predict only, a pinned source
  - quote: "<the lines, word for word>"       # predict only
  - why:                                      # one sentence, shown after you answer
  - likely_wrong:                             # why a reasonable person would picture it otherwise
  - matters:                                  # what depends on it
sources.json                                  # as an explainer's: each source pinned by commit and fingerprint
```

#### Example

You ask for a plan: "make Send reach my open session". Before writing it, the agent lists its candidates and writes five cards. c1, assume: "I'm assuming you mean the session you have open, not a headless run" (`likely_wrong:` your words say "the agent"; `matters:` step 2 of the plan). c3, predict: "In this repo, you press Send and no session is waiting. What happens to the review?" A · it waits in the inbox for the next session, B · a headless run starts on it, C · it is lost. Answer B, from `scripts/lib/inbox.mjs:700-705` and the `agent.command` in `.reelplanner/config.json`. The fresh checker answers B too, so c3 stays. c4 said Send tries once; the checker read the second try 15 seconds later, so c4 is fixed. Your memory knows c5 already, so the round has four cards.

```diagram
flow: How a round is written
your words -> candidates: what they take for granted
your memory --> candidates: missed checks, words looked up
what moved --> candidates: commits since you watched
agent's assumptions -> candidates: assume cards
candidates -> round (at most six): likely and costly | each card says why you might picture it otherwise, and what depends on it
round (at most six) -> fresh checker: predict cards
fresh checker -x round (at most six): a card the code does not back | fixed or dropped before you see it
```

### Step 2 — The round on the review page: predict, then see the code

**It lets you:** answer each card in a click or a key, then see the code's own lines beside your answer.

Needs step 1's cards. The round opens on the review page as a row of its own, **Round**, served by the review server like every video: `reelplanner review <align-dir> --detach`. One card at a time, at the size of a video frame, in the review page's look.

You answer before you see anything: A to D, or N for Not sure. Committing first is what shows a gap; seeing the answer first would let you nod along. Then the card turns over. The code's lines are on it, quoted, with the file and line numbers, and the one sentence why. Your pick and the right one are marked as a quick check's are.

- **Same picture**: a quiet "✓ Same picture" and the next card after two seconds.
- **A gap**: the four ways to settle it (step 4) sit under the card. Nothing goes on until you pick one.
- **Not sure**: a gap too, of its own kind: you had no picture. It settles with Got it or Show me more.

A predict card can also ask you to point: its options are the boxes of a diagram drawn with the plan's ` ```diagram ` format, and you click the box. "You ask about a scene and no session is waiting. Where does your question go?" You click **inbox**: a question never starts a headless run.

**Skip the rest** is always there. A round is for you, not a gate: skipping ends it, and the cards you skipped go into the plan as **Assumed, not checked**, each in a line, so you can see what was never lined up.

**Send** files the round through the inbox, as a review is filed. The waiting session's `--wait` prints it: each card, your answer, same or a gap, and how you settled it. With no session waiting it stays in the inbox; a round never starts a headless run, as a question asked on the page never does.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Same picture | c3, you press B, the answer is B | ✓ and the next card | you press: B; turned over: lines 700–705; marked: same; next: c4 |
| A gap | c3, you press A | The lines, the why, and the four ways to settle | you press: A; turned over: lines; marked: gap; you see: Got it, Change the plan, The code is wrong, Show me more |
| Not sure | c3, you press N | A gap of its own kind | you press: N; turned over: lines; you see: Got it, Show me more |
| Pointing | "Where does a question wait?", a diagram | You click a box | you click: inbox; turned over: lines; marked: same |
| Send, no session | All cards answered, nobody waiting | Kept in the inbox, nothing started | you press: Send; saved: inbox; you see: waiting for a session |
| Skipped | Two of five cards answered, then Skip the rest | The plan lists the other three as not checked | you press: Skip the rest; kept: 2 answers; written: plan.md, Assumed, not checked: c3, c4, c5 |

#### Interface

```text
reelplanner review <align-dir> --detach    # the round as a row of its own on the review page, Round
keys                                       # A–D answer, N Not sure, 1–4 settle a gap, Enter next, S skip the rest
card, front                                # the question and its options; nothing about the answer
card, back                                 # the code's lines (path:from-to), the why, your pick and the answer marked
  ✓ Same picture                           # then the next card after 2 s
  Got it · Change the plan · The code is wrong · Show me more   # a gap; nothing goes on until one is picked
Send                                       # files the round as inbox/<id>.json, kind: align
reelplanner review --wait                  # prints it: each card, your answer, same or gap, how settled
```

#### Example

Card c3 shows its question and three options. You press A, "it waits in the inbox". It turns over: `scripts/lib/inbox.mjs`, lines 700 to 705, where a review with no session waiting goes to `start()`, beside the `agent.command` line of this repo's `config.json`, and "This repo sets a headless command, so a review no session takes starts a headless run; with none set, it would wait." Your A has a dashed ring, B the ink ring. Under them, the four ways to settle it. You press 1, Got it, and c4 comes up.

#### Look

The review page's own look, so a round feels like a part of reviewing, not a new tool: paper `#FAF9F5` and tile `#EFE9DE`, ink `#141413`, and the one coral `#B8552E` only on what is yours (your pick, the settle row while it waits on you). The question in EB Garamond at 44 px, the options and the why in Inter at 22 px, the quoted lines in JetBrains Mono at 20 px on the navy slab `#181715`, as code shows itself everywhere in reelplanner. The one thing that makes it recognisable: the card turns over, front to back, the question on one side and the code's lines on the other, so "you said, the code says" is always one card.

```diagram
sequence: One card
you -> page: press A
page -> you: the back: lines 700–705, the why, your A and the answer B
you -> page: 1, Got it
page -> inbox: kept with the round
page -> you: the next card
```

### Step 3 — Say it in your own words, and see each thing you said checked

**It lets you:** talk through how you think it works for half a minute, and see your own words marked where they match the code and where they don't.

Needs step 2's page. A say card asks you to explain, not to pick: "Say how you think a review reaches the agent." Hold Space, or press the microphone, and talk. By default the page records on your machine and the local whisper the narration already uses writes your words down when you stop, in a few seconds. A browser's own live recognition shows the words as you speak, but some browsers send the audio to their maker's servers to do it, so it is off until you turn it on, and the switch says so. You can type instead, or fix a word. Where there is no microphone, or on a hosted page (which has no local whisper and no session to hand words to), the say card takes typed words only, and says so; where whisper is not installed and live recognition is off, it offers typing and says how to install whisper (`reelplanner setup --local-voice`). The recording stays in the inbox and is never committed; only your words go into `align.md`.

Your words go to the waiting agent session the way a question from Ask about this does: saved first, then handed to a session that is waiting or connected. The agent splits them into **claims**, each one a stretch of your own words that says one thing about the code ("it starts the agent right away"), and checks each against the pinned sources. The page shows your words with each claim marked:

- **✓ matches**, with the lines that back it;
- **✗ differs**: a gap, made into a card from your own words and the code's lines, settled as in step 4;
- **? the code can't say**: a claim about what you want, not what is; it becomes an assume card for you to confirm.

With no session waiting, your words stay with the round in the inbox, and the next session that takes the round checks them; you see them marked when it hands the round back. A say card never starts a headless run, even in a repo that sets a headless command: like a question asked on the page, it waits for a session.

Claims are the shared format: a drawing of your picture (#23) can later produce the same claims, checked the same way.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Mostly right | 20 s of speech, 3 claims, 2 match | Two ✓, one ✗ made into a card | you say: 3 things; split: 3 claims; checked: against inbox.mjs; you see: 2 ✓, 1 gap card |
| A want, not a fact | "and it should only go to my session" | A ? claim, as an assume card | you say: should; marked: ?; made: assume card; you answer: Right |
| The default, local | Live recognition off | Recorded, written down by local whisper when you stop | you hold: Space; recorded: 21 s; transcribed: whisper, on this machine; you see: your words |
| Live words, turned on | You switch on the browser's recognition | Words as you speak; the switch says where the audio goes | you turn on: live; you speak: words appear; kept: your words, not the audio |
| No session waiting | Nobody to check | Kept, checked after Send | you say: words; saved: inbox; you see: checked when a session takes the round |

#### Interface

```text
say card                                     # "Say how you think <topic> works"; hold Space or the mic, or type
POST /api/align/say                          # your words, saved under inbox/questions/ before any hand-off
POST /api/align/transcribe                   # a recording, through local whisper, when the browser has no recognition
reelplanner align answer <align-dir> <card> <claims.json>   # the agent's checked claims; the page shows them in seconds
claims.json                                  # [{ words, from, to, verdict: match | differs | open, source, quote }]
  from, to                                   # where in your words the claim is, so the page can mark it
```

#### Example

You hold Space and say: "When I press Send it goes to my session. If I'm not there, it waits for me. A question I ask on the page does the same." Three claims. "It goes to my session": ✓, when a session is waiting (`inbox.mjs:673`). "If I'm not there, it waits": ✗, in this repo a headless run starts, because `config.json` sets `agent.command` (`inbox.mjs:700-705`). "A question does the same": ✓, a question waits and never starts a run (the `!question` on line 700). One gap card appears under your words, with your sentence on its front and the code's lines on its back.

```diagram
flow: Your words, checked
you speak -> your words: browser recognition or whisper
your words -> waiting session: saved first, then handed on
waiting session -> claims: one stretch of your words each
claims -> ✓ matches: the lines that back it
claims -> ✗ differs: a gap card from your words
claims --> ? open: a want, not a fact | becomes an assume card
```

### Step 4 — Settle each gap, and keep what it settled where it belongs

**It lets you:** close a gap in one click and know it won't come back to bite you, in this plan or a later one.

Needs step 2. A gap is settled one of four ways, each with somewhere to go:

- **Got it**: the code is right and you had it wrong. It goes to your memory (`~/.reelplanner/you.jsonl`) as something you know: the card's claim, its file and lines, and their fingerprint. A later round doesn't ask it, and a later video drops the explanation, the way it already drops a word you know. When those lines change, the fingerprint no longer matches and it counts as not known again. The fingerprint is of the lines' text, not their numbers: when an edit above them moves them, or the file is renamed, the next round finds the same text (in the file, then in the repo) and updates where it is; only when the text itself is gone or changed is it not known.
- **Change the plan**: you want it your way. Before a plan, it goes into the plan under **You told me first**: the plan is written on it, and its video doesn't ask it again. With no plan, the round's Finish offers **Plan this**, which starts one from the round, as an explainer does.
- **The code is wrong**: a fix, never a change made on the spot. Before a plan, it becomes a step of that plan, with the card's lines as its case. With no plan, the round's Finish drafts an issue's text, `align/<slug>/issue.md`, for you to file or to start a plan from. Nothing leaves the machine without you.
- **Show me more**: at once, the card opens a longer explanation and a diagram, from the same pinned lines. At the end of the round, the gaps you asked more on become one short explainer video, built by `reelplanner explain` from the round's sources, which starts from your picture: "You expected the review to wait for you. Here is why a headless run took it." One video for the round, not one a gap: a video takes minutes, a card seconds. It is built in the background at low depth, a few minutes, while you go on; the review page says when it is ready, as it does for a rebuilt video.

An assume card answered **Not quite** is a gap about what you want; your words go into the plan as **You told me first**. A card answered **Right** is said in the plan in one line.

**Nothing from a round goes into the decision log.** Only an answer to a plan's question is a decision, and a round is not a plan. What you settle reaches the log through the plan it shapes, as an explainer's comments do. `align.md` keeps the whole record: each card, your answer, same or a gap, and how it was settled. It is committed like an explainer's folder; a recording is never committed.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| Got it | c3, you had A | Known in your memory at its fingerprint | you press: Got it; kept: you.jsonl, inbox.mjs:700-705 at 4b1e; later: not asked |
| The code changes | Lines 700–705 edited a week later | Not known any more | edited: inbox.mjs; fingerprint: 9c07, not 4b1e; next round: may ask again |
| Change the plan | c1, "Not quite: only my open session" | Into the plan, You told me first | you answer: Not quite; written: plan.md, You told me first; plan video: no question on it |
| The code is wrong | A card's lines do what it says, and you say no code should do that | A step of the next plan, or an issue's text | you press: The code is wrong; drafted: a step; you see: it in the plan |
| Show me more, three gaps | c2, c3, c5 | One explainer at the end of the round | you press: Show me more ×3; made: one explainer; it starts: from what you expected |

#### Interface

```text
Got it                    # you.jsonl: { knows: <claim>, repo, source: path:from-to, fingerprint }
Change the plan           # plan.md, ## You told me first: your words, the card, the code's lines
The code is wrong         # a step of the next plan, or align/<slug>/issue.md for you to file
Show me more              # now: the card's longer page; at the end: one explainer of these gaps
Finish                    # Done · Plan this · Explain the gaps (when any asked for more)
align.md, after           # each card: your answer, same | gap | not sure, how settled
reel memory --you         # lists what you know, by repo, and lets you remove a line
```

#### Example

Of four cards you settle three gaps. c1, "Not quite: only my open session", goes into the plan's You told me first. c3 you had wrong: Got it, kept at fingerprint 4b1e. c4 you asked more on: the card opens the inbox's hand-off order as a diagram (a waiting session, then a connected one, then the headless run, then the inbox), and at Finish, Explain the gaps builds a two-minute explainer that opens with "You expected Send to try once". The plan that follows is written on c1, its video skips what c3 taught you, and nothing went into the decision log.

```diagram
flow: Where a gap goes
gap -> your memory: Got it | known at the lines' fingerprint, until they change
gap -> the plan: Change the plan | You told me first
gap -> a fix: The code is wrong | a step, or an issue's text
gap -> an explainer: Show me more | one video for the round's gaps
gap -x decision log: never directly
```

### Step 5 — Into the loop: before a plan, in every quick check, and measured

**It lets you:** get a round only when one is worth your time, settle a wrong quick check the same way, and see whether rounds make later surprises rarer.

Needs steps 1 and 4.

**Before a plan.** When you ask for a plan on code that exists, the skill lists gap candidates first (step 1's four places). A candidate is **likely** when one of the four places points at it: your words take it for granted, you missed a check on that part, it changed since you last watched, or it is an assumption the agent can't check alone. It is **costly** when a step of the plan depends on it, or it is hard to undo (stored data and formats, permissions, what other people's code relies on: the walkthrough's own label). When one is likely and costly, it runs a round before writing the plan, with `--plan` so the answers go into it. The plan then starts from where you stand: what you settled is said in a line, what you knew is not explained again.

**A new project.** With no code yet there is nothing to predict, so a round before a plan in a new project holds only assume and say cards: what the agent assumes you want, and how you picture what you are asking for.

**Every quick check settles like a card.** A quick check is a predict card inside a video. In a plan video, nothing is built yet, so its quick check asks what the plan will do, and settles three ways: Got it (you had the plan wrong), Change the plan, Show me more. A walkthrough's and the system video's quick checks are about code that exists, and add The code is wrong. Today a wrong answer shows Walk me through it and the box "Expected something else?". With this, a wrong answer also offers the same four ways: Got it (into your memory), Change the plan and The code is wrong (each with your words, reaching the agent as a comment does now), Show me more (Walk me through it). The box's words become Change the plan's words, so nothing you can do now is lost. A wrong quick check left unsettled is recorded as it is today, and never blocks Approve.

**Measured.** `reel status` gains a memory line: rounds, gaps found per round, and how they were settled. And it compares later surprises (answers in your own words, "Expected something else", choices you flagged in a walkthrough, late fixes) on plans that had a round with plans that didn't. It reports the counts and says nothing about whether rounds help until five plans of each kind exist. To compare like with like, the plans without a round it counts are the ones where the agent found a likely, costly gap and no round ran (you skipped it, or rounds were off), not the easy ones where it found none. It prints, for example, `late fixes · with a round 1 · likely gap, no round 4`, and below five plans of each, `too few plans to compare`.

#### Cases

| Case | Input | What happens | Trace |
|---|---|---|---|
| A plan with a likely gap | "make Send reach my open session" | A round of four, then the plan | you ask: plan; candidates: 6; likely and costly: 4; you see: a round, then the plan |
| A plan with none | "rename the Save button" | No round | you ask: plan; candidates: 1, not costly; you see: the plan |
| A wrong quick check | k2, you picked A | The four ways under the answer | you pick: A; you see: B marked, the four ways; you press: Got it; kept: you.jsonl |
| Too early to say | 3 plans with a round, 2 without | Counts only | you run: reel status; you see: 3 rounds, 11 gaps, 7 Got it; "too few plans to compare" |

#### Interface

```text
the plan-to-video skill, A new plan   # lists candidates; runs a round when one is likely and costly
plan.md, ## You told me first         # what the round settled, each with its card
quick check, a wrong answer           # Got it · Change the plan · The code is wrong · Show me more
reel status                           # rounds: 3, gaps: 11 (Got it 7, the plan 3, a fix 1); compared after 5 and 5
```

#### Example

You ask for a plan to make Send reach your open session. The agent finds six candidates, four likely and costly, and opens a round of four. You settle two gaps. The plan is written with "You told me first: only the session you have open". In its video, quick check k2 asks what happens when two sessions are open; you pick A, the wrong one, and press Got it. Three weeks later `reel status` says 3 rounds, 11 gaps, and "too few plans to compare".

```diagram
flow: Before a plan
your request -> candidates: step 1's four places
candidates -> a round: one likely and costly
candidates --> the plan: none worth asking | no round
a round -> the plan: You told me first
the plan -> its video: skips what you knew
```

## Risks

- **It turns into a quiz.** The agent writes what is easy to ask, not what is likely wrong. Guard: every card says why you might picture it otherwise and what depends on it, at most six, nothing you already know, and step 5 counts how many cards found a gap. A round where most cards were Same picture says the agent is asking the wrong things, and `reel status` says so.
- **A card teaches something false.** The agent's own picture is wrong and it writes the card from it. Guard: the fresh checker answers every predict card from the sources alone before you see it, and each card shows the code's own lines, so you can see what it rests on.
- **It costs more time than it saves.** Guard: two minutes at most, Skip the rest at any time, and question 4 decides how often a round comes at all.

## How it is tested

- Specs: `align --check` on a card with no `likely_wrong:`, a quote its source lacks, seven cards, and a card you already know; the page's keys, Not sure and Skip the rest; each of the four ways to settle reaching its place (your file, the plan, a fix, the explainer); a known thing coming back when its fingerprint changes; a say card's words never starting a headless run; a wrong quick check's four ways in the player.
- A real round on this repo, on this plan's own subject, the inbox: the first round is the evidence for the walkthrough.

## Components touched

- **The plan-to-video skill** — lists gap candidates before a plan and runs a round when one is worth it; writes You told me first; a new section, "A round" (steps 1, 5).
- **The alignment round** (new) — `reelplanner align`: cards, their check, the fresh checker's prompt, `align.md` (steps 1, 3, 4).
- **The review server** — serves a round as a row of its own, files it through the inbox, takes a say card's words and a recording (steps 2, 3).
- **The review player** — a wrong quick check gains the four ways to settle (step 5).
- **The reel CLI** — `reel status`'s new memory line; `reel memory --you` lists what you know (steps 4, 5).
- **The explainer** — Show me more's one video for a round's gaps, opened from your picture (step 4).

## Open questions for the reviewer

1. **Where do the cards show up first? (step 2)**
   - **A · On the review page** — pointing, your voice, the code's lines on the card, and Send; it needs the browser open.
   - **B · In the chat** — the agent asks each card as a question in the conversation; quickest to build, but no pointing, no voice, and the code's lines as plain text.
   - **C · Both from the start** — one round, two ways to answer it; twice the work before either is good.
   - Recommended: **A**. The page is what makes it low effort for you: a key per answer, the code turned over on the card, and your voice. The chat can come later from the same cards.


2. **Who reads your spoken explanation against the code? (step 3)**
   - **A · The agent session that is waiting** — it knows the code and checks against it; about a minute, and only with a session open.
   - **B · A small fast model on the page** — a few seconds, through OpenRouter with your own key in `~/.reelplanner/.env`, billed to you, as the hosted voice is; your words go to that service, and it sees only the pinned lines, so it misses what the agent would find.
   - **C · The agent, after Send** — nothing live; you see the checks in the next version.
   - Recommended: **A**. The check is only as good as the reader's picture of the code, and the waiting session has the best one; with none waiting it falls back to C.


3. **After Got it, when does the same card return? (step 4)**
   - **A · Only when that code changes** — known until its lines' fingerprint changes; nothing more to sit through.
   - **B · Also once more, on a new case, a few days later** — a second check that it stuck; about one card a round more.
   - **C · Whenever a plan depends on it** — asked again each time it matters to a plan; the surest for big changes, the most repetition.
   - Recommended: **A**. The point is to line up your picture with the code, not to test your memory of it; a change to the code is what makes your picture stale.

4. **How often does a round come ahead of a plan? (step 5)**
   - **A · Every plan on code that exists** — two to six cards before each plan; the surest, and about two minutes more each time, often on nothing.
   - **B · When it finds a gap that is likely and costly** — no round when nothing is worth asking; it can miss a gap it didn't see coming.
   - **C · Only when you ask** — nothing changes unless you say "align me first"; the gaps you didn't think to ask about stay hidden.
   - Recommended: **B**. A round costs your time, so it should come only when it is likely to find something that matters; the plan says in one line when there was none.


## Decisions in force

- **D-001** The code is checked by a second agent, never the one that wrote it; the round's fresh checker applies the same idea to the agent's cards (step 1).
- **D-106**, **D-128**, **D-218** What you know lives in your own file in your home folder, and a thing stops being explained once you know it; Got it adds to that file, and a known thing comes back only when its lines change (step 4).
- **D-129** Approving is never blocked by a wrong quick check; the settle row never blocks it either (step 5).
- **D-197**, **D-198**, **D-199**, **D-222** Quick checks come later, on a new case, and a walkthrough asks only where there is something to predict; the round leaves where and when checks are asked as it is (step 5).
- **D-226**, **D-232** Ask about this opens in the side panel and reaches the waiting session; a say card's words take the same route (step 3).
- **D-082** A run nobody is watching works in auto mode inside the sandbox; a round, like a question, never starts one (steps 2, 3).
- **D-248**, **D-249**, **D-250** An explainer leans on what came before it, keeps its text and never a transcript in git, and follows general principles; Show me more's video is one, and a round's folder keeps the same rule for recordings (step 4).
- **D-195** A detail opens over the frame from the thing it explains; Show me more on a card opens the same way (step 4).
- **D-142**, **D-167** The review page keeps today's look and the darker coral; the round's card wears it (step 2).
- **D-313** The local loop comes first; a round is filed and handed on through the same local inbox (step 2).
- **D-225**, **D-227**, **D-245** Fresh eyes answer every finding before you see a video; Show me more's explainer gets them like any video (step 4).
- **D-110**, **D-306** Stop before a step's fifth choice made alone, and owner answers stay binding while accepted choices are history (all steps).
- **D-005**, **D-024**, **D-085**, **D-107**, **D-109**, **D-166**, **D-169**, **D-170**, **D-171**, **D-196**, **D-200**, **D-201**, **D-202**, **D-213**, **D-215**, **D-216**, **D-217**, **D-219**, **D-220**, **D-221**, **D-223**, **D-224**, **D-244**, **D-246**, **D-247**, **D-264**, **D-266**, **D-303**, **D-304**, **D-305**, **D-309**, **D-310**, **D-311**, **D-312** keep the existing authoring, review, guide, contributions and naming behaviour; this plan adds the round beside them and changes none of them (all steps).

## Supersedes
