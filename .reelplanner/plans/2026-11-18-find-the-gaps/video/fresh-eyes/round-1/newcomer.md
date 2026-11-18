# Fresh eyes: newcomer · round 1 · stamp 3b5c70df6202

- N1 · scene 1 · "issue #57 · your words, as sent": the video never says what issue #57 is or where it lives (a GitHub issue? a file in the repo?). I guessed it is a GitHub issue the owner wrote. It matters because scene 13 cites "issue #23" and scene 19 puts "issue.md" on screen, and I can't tell whether these are the same kind of thing.
  - Answer: fixed: scene 1's label now reads 'GitHub issue #57 · your words, as sent', and scene 13's 'GitHub issue #23'; scene 19 no longer shows issue.md.

- N2 · scene 2 · "review loop", "quick checks", "explain first", "memory" (the small grey labels under each row): nothing says what these labels are. I guessed they name the earlier videos each idea comes from, but no scene says so or tells me where to find those videos.
  - Answer: fixed: scene 2 drops the small plan-name labels; its heading, 'Four things this plan builds on', is what the rows are.

- N3 · scene 3 · "tries once · tries again after 15 s": what does Send "try"? I guessed it tries to hand the review to a waiting session, but the video never says what happens after the second try fails (does a headless run start then, or does it wait?). I need that to follow card c4 in scene 6.
  - Answer: fixed: scene 3's box now reads 'hand-off tried once · tried again 15 s later': Send tries to hand the review on; scene 7 shows what happens when no session takes it, and card c4 in scene 6 is the same case.

- N4 · scene 3 · "a gap" (the label on the you–code line only): the narration says a gap is wherever two of the three disagree, and gives one on each side, but the frame labels only the bottom line. I wondered for a moment whether only you-versus-the-code counts as a gap.
  - Answer: fixed: scene 3 drops the single 'a gap' label; each side's box is now headed 'gap 1', 'gap 2', 'gap 3' with the two pictures it lines up.

- N5 · scene 3 · "in this repo, a headless run takes it": why "in this repo"? The reason (the config sets a headless command) only comes in scene 7. Until then it reads as a rule I am meant to know already.
  - Answer: fixed: scene 3's box now says 'this repo's config starts a headless run', so the reason is on screen where the gap is first named; scene 7 shows the config line.

- N6 · scene 4 · "Step five: the cards before a plan, and on every quick check": I could not work out what cards "on a quick check" would be. Scene 25 shows it means the four settle buttons after a wrong quick check. Here it sounds like a round of cards is added to every quick check.
  - Answer: fixed: scene 4's step-five row now reads 'before a plan; quick checks settle the same way', so it no longer reads as cards added to a quick check.

- N7 · scene 5 · "Open Step 1 · A round of cards… 0" (the chip, top right): the glossary explains the Open chip, but not the "0" at its end. I guessed it is a count of comments or notes on that step. It is on every step scene, so it looks like it matters.
  - Answer: kept: the 'Open … 0' chip is the review player's own corner chip, drawn on every scene of every video that has a guide part; this video's frames don't draw it, and the glossary's Open chip row already says what it opens.

- N8 · scene 6 · "answer: once (struck through) twice · again after 15 s": the video never says what the strike-through shows. I guessed the agent first wrote "once" and the fresh checker changed it to "twice". If that is right, it is the clearest example of "the card is fixed", and the narration says nothing about it.
  - Answer: fixed: scene 6 now labels the new answer 'fixed by the checker' as the strike lands, on the word 'fixed'.

- N9 · scene 6 · "the page says Sent at once": which page, and what does "Sent" look like? I guessed the review page shows "Sent" as soon as you press Send, even though no session has the review yet. I'd need to see that to understand why I'd "picture it otherwise".
  - Answer: fixed: scene 6's line now reads 'the review page says Sent right away'.

- N10 [plan] · scene 6 · "where it disagrees, the card is fixed or dropped": who decides between fixing and dropping, and what if the fresh checker is the one that is wrong? The video also doesn't say what the fresh checker costs (time, a second agent run) before every round.
  - Answer: plan: step 1 now says who decides and how: the agent rewrites the card once from the quoted lines and the checker answers again; a card reaches you only when they agree; still disagreeing, it is dropped and listed at the end of the round as a gap between the agent and the code. The checker's cost was already added to step 1.

- N11 · scene 7 · "if (!question && !isMachineInbox(rp))" and the "a headless run" label laid over line 701: I couldn't tell from these lines why they mean a run starts. What is "question", and what is a "machine inbox"? The label sits on top of the code it explains, so I couldn't read the full line under it.
  - Answer: fixed: scene 7 now pins 'a review, in a set-up repo' on line 700's isMachineInbox and 'a headless run' on start() in coral, each to the right of its line, so neither covers the code.

- N12 · scene 9 · "card c3, turned over" (only lines 700–701, no file name): scene 7 said the back of a card holds the file, the lines and one sentence why, but this back has no file name. The card numbers also skip around (c4 in scene 6, c3 here, c2 in 12, c5 in 18, c6 in 13), and I couldn't tell whether they are all one round.
  - Answer: fixed: scene 9's card now has its file bar, 'scripts/lib/inbox.mjs · 700–701', and the four buttons under it. The card numbers c2 to c6 are one example round's cards, each named on the card itself in scenes 5 to 7.

- N13 · scene 10 · "c3: you press Send, no session waiting. A, B or C?": in the chat version the options are never shown, so I couldn't see how anyone would know what A, B and C stand for. Is that part of what option B costs, or is the picture just leaving them out?
  - Answer: fixed: scene 10's agent message now gives the options, 'A waits · B a headless run · C lost?', and the reply chip reads 'you: A', the code box 'agent'.

- N14 · scene 13 · "It goes to my session: a match. If I'm not there, it waits: a gap": the narration suddenly says "my" and "I". I took a while to work out that it is reading out the viewer's own spoken claims. Nothing marks it as a quote.
  - Answer: fixed: scene 13 now heads its words 'your words, as you said them' and puts each sentence in quotation marks.

- N15 · scene 13 · "Drawing your picture stays a separate plan" / "issue #23": "drawing your picture" is never explained. I guessed it means sketching a diagram of how you think the code works, instead of saying it, but that is a guess.
  - Answer: fixed: scene 13's foot line now reads 'drawing your picture instead of saying it · GitHub issue #23, a separate plan'.

- N16 [plan] · scene 13 · "Hold Space and talk; whisper writes it down on this machine": what happens on a hosted page (the glossary says hosted pages run online, in a Claude Artifact), or on a machine without a microphone or without whisper? The video says only "hold Space, or type" on the card in scene 5.
  - Answer: plan: step 3 now says that with no microphone, or on a hosted page, the say card takes typed words only and says so; with no whisper and live recognition off, it offers typing and how to install whisper.

- N17 [plan] · scene 14 · "a small hosted model, called from the page": whose model is it, who pays for it, and does it need a key? Option B can't be weighed fairly without knowing that.
  - Answer: plan: question 2's option B now says it is OpenRouter with your own key in ~/.reelplanner/.env, billed to you as the hosted voice is, and that your words go to that service; scene 14's card and its more say the same.

- N18 · scene 14 · "C: the next session to take the round, after Send": I didn't know a round could be "taken" like a review. I guessed the round's answers go out with Send in the review, but the video never says how a round travels to the agent.
  - Answer: fixed: scene 14's option C now reads 'sent with the round, like a review · marked when it comes back', and its more says it is filed with the round as a review is.

- N19 · scene 18 · "a card about where a question waits": which question? I didn't know whether this means a plan video's question, a quick check, or a review. Also, option B gives "Got it or Show me more" when scene 7 said a gap has four ways to settle. Are Change the plan and The code is wrong not offered after Not sure? The video doesn't say.
  - Answer: fixed: scene 18 now asks about 'card c5', not a card about a question; scene 7 now says 'A wrong answer is a gap, with four ways to settle it; not sure, with two.', so B's two ways are what was explained.

- N20 · scene 19 · "a plan step · or issue.md": who decides whether The code is wrong becomes a plan step or an issue, and what is issue.md? (It is not the GitHub "issue #57" of scene 1, as far as I can tell.)
  - Answer: fixed: scene 19 now reads 'a step of the plan · with no plan, an issue to file', so the rule is on screen and issue.md is gone.

- N21 · scene 19 · "The decision log… gets them only through the plan's own questions": I couldn't follow this. I guessed that a settled gap reaches the decision log only if it later becomes one of the plan video's questions and gets answered there. It matters, because scene 31's quick check depends on it.
  - Answer: fixed: scene 19's line now reads 'only when a plan's question asks it and you answer', drawn down from the plan.md box to the decision log.

- N22 [plan] · scene 19 · "Show me more: a longer card now, and one short video of those gaps at the end": the longer card and the short video are only named, never shown. I'd need to see one, and to know how long the video takes to make while I wait.
  - Answer: plan: step 4 now says Show me more's video is built in the background at low depth, a few minutes, while you go on, and the page says when it is ready. The longer card is the card's own page, the same lines with more words and the diagram.

- N23 [plan] · scene 20 · "Got it is kept with the lines' fingerprint": what happens when an edit above those lines moves them (700–705 become 710–715) without changing them, or when the file is renamed? Does the card come back, or is the memory lost?
  - Answer: plan: step 4 now says the fingerprint is of the lines' text, not their numbers: a move or a rename is found again by that text and the place updated; only changed or removed text makes it not known.

- N24 · scene 24 · "Open: an assume card": "Open" here seems to mean "not yet settled", but the glossary uses "the Open chip" for something else, and every step scene shows an "Open" chip. I wasn't sure the two were unrelated.
  - Answer: fixed: scene 24's third option is now 'Neither: an assume card', with its explain and walk-through saying neither a match nor a gap.

- N25 [plan] · scene 25 · "A wrong quick check gets the same four buttons": on a plan video's quick check the code isn't built yet. What do "Got it" (the code is right) and "The code is wrong" mean there?
  - Answer: plan: step 5 now says a plan video's quick check is about what the plan will do and settles three ways (Got it, Change the plan, Show me more); The code is wrong comes only where there is code, a walkthrough or the system video. Scene 7 and 25 now say 'the same buttons', and scene 25 shows three with 'and The code is wrong, once there is code'.

- N26 · scene 25 · "Got it 7 · the plan 3 · a fix 1" and "late fixes: compared after 5 plans each way": these labels don't match the button names (is "a fix" The code is wrong? where is Show me more?), and "each way" is not explained. I guessed it means 5 plans with a round against 5 plans without one.
  - Answer: fixed: scene 25's status lines now read 'Got it 7 · the plan 3' and 'code wrong 1 · more 0', the buttons' own names, and 'late fixes compared after 5 plans with a round and 5 without'.

- N27 · scene 25 · "likely gaps listed": listed where, and to whom: in the chat, in the plan, or on the page? Nothing says whether I see this list when no round runs.
  - Answer: fixed: scene 25 now reads 'likely gaps, listed in the plan'.

- N28 · scene 26 · "two requests: make Send reach my open session · rename the Save button" (tiny unstyled text in the very top-left corner): it looks like a stray caption left in the frame, far smaller than anything else on screen.
  - Answer: fixed: scene 26's two requests were built before the frame's styles existed and came out unstyled; they are now the scene's mono line under the question, at the theme's size.

- N29 [plan] · scene 26 · "only when a gap is likely and costly": the video never says how the agent judges "likely" or "costly", and Question 4's recommended option depends on that rule. I'd need at least the rule or an example of the "line saying why".
  - Answer: plan: step 5 now gives the rule: likely when one of the four places points at it (your words take it for granted, a missed check on that part, a change since you watched, an assumption the agent can't check alone); costly when a plan step depends on it or it is hard to undo. Question 4's option B more says the same.

- N30 · scene 31 · "quick check k2 wrong": cards are numbered c1, c2 and so on, but here a quick check is "k2". No scene explains the k numbering.
  - Answer: fixed: scene 31's case line now reads 'a video like this one · a quick check you got wrong · Change the plan', with no k2.

- N31 · scene 32 · "Your four answers sit on the steps" and "the code" drawn black in the triangle: the step list on screen shows no answers, so I couldn't see where they "sit". Nothing says why "the code" is highlighted at the end.
  - Answer: plan: plan.md's questions are as they were; this was the frame: scene 32's steps two to five now each show 'your answer' in their slot until the player writes your pick there. The code stays navy, as it is in every scene where code shows itself (scenes 3 and 7).
