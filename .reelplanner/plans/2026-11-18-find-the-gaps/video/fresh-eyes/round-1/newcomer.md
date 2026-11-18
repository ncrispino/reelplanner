# Fresh eyes: newcomer · round 1 · stamp 2b7d9dd8c2ea

- N1 · scene 2 · "the agent session waiting on this page": I could not tell how a session "waits on" a review page (is it a terminal conversation that opened the page and is listening for Send?). I guessed it is the chat that made the video and opened the page; it matters because scenes 3, 9 and 11 all turn on whether a session is "waiting" or "open", and I can't tell those two words apart.
  - Answer: fixed: scene 2 now says Send hands your review 'to an agent session that is waiting for it, the one you opened this page from'.

- N2 · scene 3 · "hand-off tried once · tried again 15 s later": the narration says Send tries the hand-off "to a waiting session", but scene 7's card on the same gap asks "Send, no session waiting: how many tries?". I could not tell whether the retry happens when a session is waiting or when none is, or how it fits with gap 1, where no session means a headless run starts. I guessed: no session, try twice 15 s apart, then a headless run. I need the order of events spelled out once.
  - Answer: fixed: scene 3's gap 2 now spells the order: 'the agent: a waiting session that doesn't take it gets one try · the code: Send tries again 15 s later', and card c4 in scene 7 asks the same case, 'A session is waiting but doesn't take the review. Does Send try again?'

- N3 · scene 3 · "gap 3 · you and the agent" / "the agent read: any agent · you meant: your open session": gaps 1 and 2 put the sides in the order the label names them, but gap 3 puts the agent's side first, though its label says "you and the agent". I read it twice to work out whose picture was whose.
  - Answer: fixed: scene 3's gap 3 now reads 'you meant: your open session · the agent read: any agent', you first as its label says.

- N4 · scene 4 · "before a plan · quick checks alike": I could not tell what "quick checks alike" means, or what "the cards ... on every quick check" in the narration means: do quick checks become cards, or get a card after them? I guessed that a wrong quick check gets the same settle buttons as a card, but only found that out in scene 16.
  - Answer: fixed: scene 4's row now reads 'before a plan · quick checks settle like cards'.

- N5 · scene 5 · "questions 2 and 4 kept the recommendation · decisions D-315, D-317": the video never says what questions 2 and 4 were or what was recommended, so this line tells a newcomer nothing. Also "Three checks you missed · steps 1, 2, 3": which checks they were, and what is "now said plainly", is not shown. I guessed they are the quick checks in scenes 10, 12 and 15.
  - Answer: fixed: scene 5's line now names the two kept answers, 'the waiting session checks your words (decision D-315) · asked first only when a gap is likely and costly (decision D-317)', and the row reads 'Three quick checks you got wrong · steps 1, 2, 3'.

- N6 · scene 6 · the "Open Step 1 · A round of cards …" chip with a "0" badge: I don't know what the 0 counts (comments? details?), and the "planned" tag sits half under the chip. I guessed 0 is a count of notes on the step.
  - Answer: fixed: the 'planned' tag now sits at the frame's foot, clear of the player's chip. kept for the '0': the Open chip is the review player's own, drawn on every video; this video's frames do not draw it.

- N7 · scene 6 · "Right · Not quite" on the assume card: the video never says what happens after Not quite. Is it a gap with the four settle buttons, or does it ask for your words? I guessed it becomes a gap, but the settle buttons (scenes 9 and 13) are only ever shown on a predict card.
  - Answer: fixed: scene 6's assume card now reads 'Right · Not quite: say what, and it goes into the plan'.

- N8 · scene 7 · "You never see 2 answers side by side" against the card showing "answer: ~~once~~ twice · 15 s apart, fixed by the checker": the picture shows both answers side by side, with one crossed out, at the moment the caption says you never see that. I guessed the crossed-out answer is only the author's view, not what the reviewer gets, but nothing says so. It also makes the quick check in scene 10 (option A, "Both answers, side by side") a trap.
  - Answer: fixed: scene 7 now shows 'c4, as the agent wrote it' (answer no, struck), the checker's chip 'fixed before the round opens', and 'c4, the card you see' with only 'answer: yes · 15 s later', so the card you get never holds two answers.

- N9 · scene 7 · "predict · c4": this is the first time a card has a number like "c4", and later scenes use c2, c3, c5 and c6. I guessed it means card 4 of the round. It needs saying once, since scenes 10, 12 and 17 ask about cards only by these numbers.
  - Answer: fixed: scene 6's line now reads 'cards c1, c2, c3 … numbered in their round · at most 6'.

- N10 · scene 8 · "align.md · one record" and ".reelplanner/align/, or this machine": align.md is never explained (one file per round? per topic?), and I couldn't tell when the record goes to "this machine" instead of the repo, or where on the machine it goes. I guessed: in the repo when it is set up, otherwise in the home folder like the inbox.
  - Answer: fixed: scene 8's label now reads 'one file a round: the cards and your answers · .reelplanner/align/, or ~/.reelplanner/ in a repo not set up'.

- N11 · scene 8 · "with its own question tool": I couldn't tell what the agent's "question tool" is. I guessed it is the agent's built-in multiple-choice prompt in the chat. It matters because it is the way in that gets built first.
  - Answer: fixed: scene 8's chat card now reads 'the agent's multiple-choice prompt (AskUserQuestion)'.

- N12 · scene 8 · the chat's "701 const result = await start(" next to the review page's "700 if (!question … / 701 await start();": both are card c3, but they show different code for line 701, so I wondered whether they quote different files or versions.
  - Answer: fixed: scene 8's chat and page cards now quote the same lines, 700 'if (!question …' and 701 'await start();'.

- N13 · scene 8 · "later: drawing your picture" / "Drawing your picture comes later, on the page, as a plan of its own": I couldn't tell what drawing your picture means (sketching a diagram of how you think the code works?). Also "a video · a quick check is a card": I couldn't tell whether a video's quick checks become cards or a card plays as a quick check.
  - Answer: fixed: scene 8 now reads 'later: drawing how you think it works', and the video's card 'its quick checks ask the same cards'.

- N14 · scene 9 · "if (!question && !isMachineInbox(rp))" labelled "a review, in a repo with .reelplanner/": the label says "a review" but the code tests "!question". I couldn't tell what "question" is here (a question asked with Ask about this?) or why its absence means "a review". The card also says "a headless run starts on it", and I couldn't tell what "it" is.
  - Answer: fixed: scene 9's pin now reads 'a review, not a question, in a set-up repo', and its option and answer say 'a headless run starts on the review'.

- N15 · scene 11 · "It goes to my session: a match. If I'm not there, it waits": the narration moves into the first person to quote the viewer's words without saying so, so in audio it sounds like the narrator talking about its own session. The picture shows them as quotes; the voice does not.
  - Answer: fixed: scene 11's narration now marks the quote, 'Say you said: it goes to my session. A match.', and the frame shows each sentence in quotation marks.

- N16 · scene 11 · "✓ line 673": no file is named (the other claim names "lines 700–705 · config.json"). I guessed it is scripts/lib/inbox.mjs, but a claim's check should say where it looked.
  - Answer: fixed: scene 11's pins now name the file, 'scripts/lib/inbox.mjs:673' and 'scripts/lib/inbox.mjs:700–705 · .reelplanner/config.json'.

- N17 · scene 11 · "It comes back as an assume card": I couldn't tell when it comes back: right away, in the same round, or in the next round? And does it count toward the round's six?
  - Answer: fixed: scene 11 now says it comes back 'as an assume card, next in this same round', and its pin reads the same; step 3 of the plan says it is not counted in the six.

- N18 [plan] · scene 11 · "The waiting session, as you chose, splits your words into claims": what checks your words when no session is waiting (the case the whole video is about)? Does a headless run do it, does it wait, or is the say card unavailable? The video doesn't say, and the plan may not cover it.
  - Answer: plan: step 3 now says a say card is checked by a session or not yet, never by a headless run; in the chat there is always one, and on the page with none waiting the words wait with the round.

- N19 · scene 13 · "a step of the plan · with no plan, issue.md for you to file": the text runs out of its box ("file" spills below it, over the next label). I couldn't tell where issue.md is written. And "only when a plan's question asks it and you answer": I couldn't tell what "it" refers to (the gap? the same matter?). I guessed it means a round's result reaches the decision log only if a later plan's own question asks the same thing.
  - Answer: fixed: scene 13's box now reads 'a plan step · or issue.md to file', which fits, and the decision log sits apart, dimmed, with 'nothing from a round goes in · a plan's own questions do' beside it.

- N20 [plan] · scene 13 · "Change the plan: it goes into the plan, under You told me first": a round can run before any plan exists (step 5). Where does Change the plan go then? "The code is wrong" has a no-plan case (issue.md), but Change the plan doesn't.
  - Answer: plan: step 4 now says that before any plan exists your Change the plan words wait in align.md under You told me first, and the plan started from it (Plan this) carries them.

- N21 [plan] · scene 14 · "known until the lines change": what happens when the lines do change? Is it asked again as a card, dropped from memory, or flagged? The video stops there.
  - Answer: plan: step 4 now says that when the lines change it counts as not known, and the next round that touches it may ask it again as a new card, never the old one.

- N22 · scene 16 · "The code is wrong, once built" (dashed button): the narration says "the same buttons", but this one is greyed and its words are never explained. I guessed that in a plan video no code exists yet, so that button only works after the build, and I couldn't tell what to press until then.
  - Answer: fixed: scene 16's dimmed button now reads 'The code is wrong' with 'only once there is code' under it.

- N23 · scene 16 · "Approve: never blocked · left unsettled: recorded as today": I couldn't tell what "recorded as today" means. I guessed a wrong quick check left unsettled is kept the way a missed quick check is kept now, but "today" was only used in scene 4 for the current one-way setup.
  - Answer: fixed: scene 16 now reads 'Approve is never blocked · left unsettled, it is kept as a wrong check is now'.

- N24 · scene 16 · "late fixes · with a round 1 · likely gap, no round 4" and "under 5 plans of each: too few to compare": I couldn't tell what the two groups being compared are. I guessed: plans that ran a round vs plans where gaps were likely but no round was run. Also "rounds 3 · gaps 11" next to "not sure 2 · skipped 1": does 11 include the not-sure gaps? The numbers add up to 11 without them.
  - Answer: fixed: scene 16 now reads 'not sure 2 (in the 11) · skipped 1', 'late fixes after: with a round 1' and 'likely gap, no round 4'; the narration says what the comparison is.

- N25 · scene 19 · "the code" box drawn solid black in the triangle: the other two boxes stay light, and nothing says why the code is singled out at the end. I guessed it is the side that settles a disagreement, but the video never says that.
  - Answer: kept: the code is navy in every scene that draws it (scenes 3 and 9), as code shows itself across reelplanner; the triangle at the end is scene 3's.
