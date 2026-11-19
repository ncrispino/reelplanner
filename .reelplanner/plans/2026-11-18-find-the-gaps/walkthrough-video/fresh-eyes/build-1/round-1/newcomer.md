# Fresh eyes: newcomer · round 1 · stamp 805593b19164

- N1 · scene 1 · "each turned over to the code's lines": "turned over" is never said to mean anything. I guessed that a card flips once you answer it, to show the real lines of code and the right answer, but nothing shows that until scene 4. Scene 4's "it turns over to B" also depends on it.
  - Answer: fixed: scene 1 now says 'once answered, each turns over to show the code's lines'.

- N2 · scene 1 · "rewrite the card once, or drop it": the scene doesn't say who rewrites or drops the card (the agent? me?), or what happens when the rewritten card fails a second time. Is it dropped by itself? The words are also the scene's last caption ("or drop it."), so they are what a viewer remembers.
  - Answer: fixed: scene 1 now says 'the agent rewrites the card once, or drops it'; a card the checker still reads otherwise after the rewrite is dropped, as scene 3 says ('rewrite it once, else drop it').

- N3 · scene 1 · "the cards, their checks, the one record" / "a wrong quick check settles": in the file table, "the one record" has no meaning yet. It only shows up again as scene 4's title "one record, three ways in" and as scene 7's "answers.json". "A wrong quick check settles" assumes I know that settling applies to quick checks too, which scene 8 only says later. I could not tell what either row of the table changed.
  - Answer: kept: the file map is one plain line a file by design (the change's map, style guide §5), and the next scenes run each one; 'a wrong quick check settles' is shown running in scene 8.

- N4 · scene 2 · "card c2" / "`align --check`": I have never seen what card c2 asks, so the question can only be answered from scene 1's narration. `align --check` shows up as a command with no introduction (scene 1 said only "the command" next to `scripts/align.mjs`). The narration says "the check" and the screen says `align --check`. Are they the same thing?
  - Answer: kept: the quick check's case line on screen says what c2 asks about ('card c2 says B · the fresh checker reads A'), which is all the check needs; `align --check` is the command scene 1's map names, and scene 3 runs it right after.

- N5 · scene 3 · "a card quotes a line one word off" / "--no-checker": no scene has said that a card quotes lines of code word for word, or why one might stop matching ("pinned" hints at it). `--no-checker` is never explained. I guessed it runs only the quote check, without the fresh checker. When would anyone use it?
  - Answer: kept: scene 1 says a card quotes the code's lines, and scene 3 shows the quote failing word for word in the real run; `--no-checker` is on screen as the run's own flag, the check before the checker has answered.

- N6 · scene 3 · "choice A2 · it pauses here" (and every choice card through A20): all 20 choices are marked "it pauses here", but none shows a label. The glossary says only choices labelled *visible* or *hard-to-undo* (or an off-plan change) pause, and the rest go on the list at the end. I could not tell why each one stops. A20 also sits among A2–A4 out of order.
  - Answer: fixed: each choice card now says why it pauses, its label ('visible', 'hard-to-undo') or 'close, like a recent late fix', which is the rule `reel stops` printed for every close one.

- N7 · scene 3 · "No checker answer, no round" / "A round finds its repo from its own folder, in any clone": I guessed "no checker answer" means the fresh checker could not be run or returned nothing, but the scene doesn't say. It also never says where a round's folder lives, so "finds its repo from its own folder" can't be followed. What is `<round>` in the commands: a name, a path?
  - Answer: kept: scene 3's run shows it: the check without a checker answer fails; `<round>` is the round's folder, written as the run wrote it.

- N8 · scene 4 · "Step 2: one record, three ways in": the title promises three ways in, and the scene never names them. I guessed the page, speech and the command line, but that is only a guess. "One record" is still unexplained (see N3).
  - Answer: fixed: scene 4's chapter is now 'Step 2: on the review page', which is what it shows.

- N9 · scene 4 · "no session waiting, a command set": I can piece "a command set" together from the glossary's headless run (the agent's own command). The scene doesn't say where the command is set, or that "set" means configured rather than "a set of commands".
  - Answer: kept: 'a command set' is the card's own case, and the glossary's headless run (defined in this scene) is the agent started by that command.

- N10 · scene 4 · "Send goes to the inbox, never a headless run" (choice A10): this looks like it contradicts the card on the same screen. The card's answer is that a review with a command set goes to a headless run. Sending what? The round's answers, as opposed to a review? The narration's "Send never starts a headless run" doesn't say which Send. A newcomer leaves thinking the card and the choice disagree.
  - Answer: fixed: the choice card and the narration now say 'A round's Send', so it reads apart from the card's review.

- N11 · scene 4 · "Each card is routed once, however often sent" (choice A7): "routed" and "sent" are not explained for a card. Where is a card sent, by whom, and why would it be sent more than once? The narration says "each answer is routed once", so is it a card or an answer?
  - Answer: kept: the card's words are the choice's row; the narration says 'each answer is routed once', and scene 7 shows where answers are routed.

- N12 · scene 4 · "A settled card moves on by itself" (choice A13): the screen shows a "Next · Enter" button under the settle buttons. If a settled card moves on by itself, what is Next for?
  - Answer: kept: Next is there for a card you want to read longer; a card moves on by itself once you settle it.

- N13 · scene 4 · "Skip the rest": the only skip control on the page skips every remaining card. Scene 6 then asks about skipping just c3. How do you skip a single card?
  - Answer: kept: c3 is the round's last card, so Skip the rest skips it; in the chat each card can be skipped.

- N14 · scene 5 · "the session that opened the page" / "the waiting session": the screen says "once the waiting session has checked them", and the narration says "the session that opened the page". Are these the same agent session? Which session is that, when a round page is opened?
  - Answer: kept: they are the same session: the one that opened the page waits for what the page sends; the narration names it once, the label the second time.

- N15 · scene 5 · "a want, asked back as an assume card": "a want" has no meaning. I guessed it is a claim about what I'd like rather than what the code does. I could not tell why "for me" is a want and not a match or a gap.
  - Answer: kept: scene 5 says it in the line: 'a want, asked back as an assume card', and the third claim on screen ('for me') is what the speaker wants, not what the code does.

- N16 · scene 5 · "Whisper writes it down here" vs scene 10's "Not done… speech written as you talk" / "live recognition in the browser": scene 5 shows "Hold to talk", and the words appear in the box. Scene 10 then says speech written as you talk is not done. I guessed the words appear only after you let go of Space, but neither scene says what actually happens while you hold it.
  - Answer: fixed: scene 10 now says 'words shown live as you talk' is not done, which is apart from holding Space to record.

- N17 · scene 5 · "c2 → your memory, asked once more on a new case from 2026-11-22": scene 7's terminal says "from 2026-11-21", and its narration says "three days on" from a round dated 2026-11-18, which is the 21st. The two dates disagree. The screen also shows c2 already settled before step 4 has explained settling.
  - Answer: fixed: scene 5's shot is cropped above the line from an earlier record (taken on another day); scene 7's date is the run's.

- N18 [plan] · scene 5 · "the session that opened the page checks each claim": a say card needs an agent session to check the claims. The video doesn't say what happens to a say card when no session is waiting, for example on a hosted page or after the session has closed. Are the words kept, skipped, or sent to the inbox?
  - Answer: ask: with no session waiting, a say card's words wait in the inbox as a question for the next session (they are kept, not skipped); should the page say so on the card itself?

- N19 · scene 5 · "your words reach it as a question" (choice A11): "it" isn't said to be the session, and "as a question" is unclear. A question to the agent, like Ask about this? Or a card asked back?
  - Answer: kept: 'it' is the session the line before names; a question is how the page hands words to the waiting session, as Ask about this does.

- N20 · scene 7 · "c1, Right": "Right" is not one of the four ways to settle a gap I was shown (Got it, Change the plan, The code is wrong, Show me more). I guessed it means I predicted correctly, so there was no gap. I also never saw what card c1 asked; the terminal shows only "… the session you have open".
  - Answer: fixed: scene 7 now says 'c1, an assume card you called right': Right is an assume card's answer, not a way to settle a gap.

- N21 · scene 7 · "align record <round> answers.json": where does `answers.json` come from? The glossary says the player's download is `annotations.json`, so is this a different file, downloaded from the round's page? A newcomer couldn't run this command.
  - Answer: kept: answers.json is what the agent writes from the chat's answers; the page writes the same record itself, as scene 4 shows.

- N22 · scene 7 · "A due thing comes back as a new card" / "asked again three days on": "due" is never explained. I guessed memory brings a settled card back on a schedule, like flash-card review. Is it always three days? Who decides?
  - Answer: kept: 'asked again three days on' is said in the same scene; three days is the owner's decision D-316.

- N23 · scene 7 · "Show me more's video is one explainer command": which command is that, and who runs it, me or the agent? The glossary says Show me more gives "one short video of the round's gaps", but this scene doesn't show it or name the command.
  - Answer: kept: the agent runs it; scene 7's choice says it is one explainer command, and the not-done line says what is not shown.

- N24 · scene 8 · "Send part one twice. What does the second PUT do?" / "The bit is already set; the PUT is idempotent": "PUT", "the bit" and "idempotent" are unexplained jargon from an example the video never introduces. It is hard to tell whether they matter or are only filler.
  - Answer: fixed: a label under the shot now says it is a test video's quick check; its words (PUT, idempotent) are that test video's, not this change's.

- N25 · scene 8 · "a wrong quick check settles the same way": the screen shows only three buttons (Got it, Change the plan, Show me more). "The code is wrong" is missing. Why can't a missed quick check be settled as a bug?
  - Answer: fixed: the label under it says it: a plan video builds nothing yet, so The code is wrong is only for code that exists.

- N26 · scene 8 · "(1 with a round, 0 with a likely gap and none; 5 of each)": I couldn't read this line. I guessed it compares plans that had a round against plans that had a likely gap but no round, and needs five of each before it compares. "A likely gap" has no meaning, and the scene doesn't say who decides a plan had one.
  - Answer: kept: it is the real line `reel status` prints; the narration reads it plainly, 'compares late fixes with and without one, from five plans each'.

- N27 · scene 8 · "A header line records a round, the question next" / "A late fix counts once": "the question next" only makes sense after scene 9. "Counts once" in what: the comparison in `reel status`? Why would it count more than once?
  - Answer: kept: 'the question next' points at scene 9, one scene on; a late fix counts once in that comparison, as the narration's sentence before says.

- N28 · scene 8 · "Got it sends no rewrite" / "Show me more with no example asks again": the scene doesn't say what is rewritten (the screen says "of the step", but which step, and who rewrites it?), what "an example" is, or who asks again. I guessed Show me more needs you to say what you'd like shown, and asks you to if you don't.
  - Answer: kept: each card is one choice, said in a clause; 'Got it sends no rewrite of the step' is on its card, and the step is the quick check's own.

- N29 · scene 9 · "a step's fifth choice should stop and ask. Step five went on": "step five" and "the fifth choice" read as the same five, and the narration is hard to parse. "off the plan D1" sits next to "decision D-110". Are D1 and D-110 the same kind of thing? Off-plan changes and decisions seem to share the letter D.
  - Answer: kept: D1 is the off-plan change, D-110 the decision it went against; the card says both, each with its kind ('off the plan', 'decision').

- N30 · scene 9 · "Answer it in the plan" / "the plan's question 5": where and how do I answer it? Can I answer it here in the walkthrough, or do I have to open the plan's video or file? The scene doesn't say why the choice matters (I guessed it changes how `reel status` counts rounds), or what C, "only the rounds themselves", means.
  - Answer: kept: the walkthrough's review carries a comment like any; the question is the plan's, so 'Answer it in the plan'.

- N31 [plan] · scene 10 · "Not done, all from the approved plan": four things the approved plan asked for were not built (live recognition, a diagram on Show me more, later videos skipping what you know, a round before a real plan). None of them is shown as an off-plan change, which the glossary says always stops the walkthrough. Was each one deferred by a decision, or just skipped? When is each done? Nothing ties them to a later plan.
  - Answer: ask: four parts of the approved plan are not built (words shown live as you talk, a diagram on Show me more, later videos skipping what you know, a round before a real plan); build them before you accept, or as a plan of their own?

- N32 · scene 10 · "a later video dropping what you know" / narration "later videos skipping what you know": earlier viewers tripped on "drops the video". Here, "dropping what you know" doesn't say what is dropped: scenes, quick checks, words in the glossary?
  - Answer: kept: what is dropped is the explanation of a thing you know, which the not-done line keeps short; nothing is said to be built there.

- N33 [plan] · scene 10 · "no round yet before a real plan": the feature has run only in a scratch repo. Nothing says when the first round on a real plan happens, or how that would be judged a success. The comparison in scene 8 needs five plans of each kind before it can show anything.
  - Answer: ask: no round has run before a real plan yet; run one on the next plan in this repo, before you accept this?

- N34 · scene 10 · "two new specs": the screen lists three spec lines (align.spec, align-page.spec, quiz.spec extended). I guessed quiz.spec is an extended old one, but the narration's "two" and the three rows don't line up at a glance.
  - Answer: fixed: scene 10's column now marks them 'new' and 'extended'.
