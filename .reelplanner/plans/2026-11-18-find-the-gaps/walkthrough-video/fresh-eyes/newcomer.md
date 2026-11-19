# Fresh eyes: newcomer · round 1 · stamp fe793e67de58

- N1 · scene 1 · "each turns over to the code's lines": I guess a card flips, like a paper card, to show the lines of code it is about once you answer. The narration says it, but the picture is a file table with no card in it, so I never see what "turning over" looks like. Scene 4 says "it turns over to B" too, and I still don't see a flip there. A newcomer needs one frame of a card before and after it turns.
  - Answer: kept: scene 4 shows it: the card's front, then the same card turned over to the code's lines, the scene the word is about; scene 1 is the change's map, one plain line a file.

- N2 · scene 1 · "or the check stops: the agent rewrites the card once, or drops it": I couldn't tell which check this is, or when it runs (when the round is made, or when you answer?). "drops it" doesn't say where a dropped card goes, or whether you are told. Earlier viewers stumbled on "drops the video" in the same way. I guess the card is removed from the round without a word to you.
  - Answer: kept: scene 3 shows which check (`align <round> --check`, before the round opens) and the card stopped; a dropped card is listed after the round as the agent and the checker reading the code differently, which is the round's own record, not a scene.

- N3 · scene 1 · "the one record" / "a wrong quick check settles" / "when a round runs, and how it is asked" (right column of the file table): these name things the video has not explained yet. What record? What does it mean for a quick check to "settle"? (That only comes in scene 8.) Most of all: when does a round run, and who starts it? The video never says whether the agent always runs one before a plan, or only when I ask, and that is the first thing a newcomer would ask.
  - Answer: fixed: scene 1 now says when a round runs: 'before one, when a gap is likely and costly, or when you ask'.

- N4 · scene 2 · "align --check": the quick check asks about a command the video never introduced. Scene 1's table says only that scripts/align.mjs is "the command". The full form, `reelplanner align <round> --check`, appears only in scene 3, after the question. I guess it is the step that checks a round's cards before you see them.
  - Answer: kept: the quick check's case line names the card and the two readings, which is all it asks; the command is the one scene 1's map names, run in scene 3 right after.

- N5 · scene 2 · "card c2's lines": I guessed each card is tied to a few lines of code, but "a card's lines" isn't said until scene 3 ("One range of lines a card"). Where do the lines come from: does the agent pick them?
  - Answer: kept: scene 1 says a card turns over to the code's lines, and scene 3 says 'One range of lines a card'; the agent picks them, as it writes the card.

- N6 · scene 3 · "A quote one word off is stopped" / "its quote is not in src/send.mjs:3-5 word for word": the video never says that a card quotes the code. I guess the card shows the code it is about, and the tool checks that the quoted text is really in that file at those lines. Without that, "a quote one word off" means nothing.
  - Answer: kept: scene 1 says each card turns over to the code's lines, and scene 3's run shows the check finding the quote not in those lines word for word.

- N7 · scene 3 · "--no-checker": the first command in the terminal runs with this flag and nothing explains it. I guess it runs only the quote check, without starting the fresh checker. Can a real round skip the checker this way, given that choice A3 says "No checker answer, no round"?
  - Answer: kept: `--no-checker` is the run's own flag, the check before the checker has answered; the next run in the same terminal shows the round stopped until it does (choice A3).

- N8 · scene 3 · "No checker answer: the round does not open" (choice A3): what does it mean for a round to "open"? Does the review page not show it? Is the person told why? And what is a "no answer", as opposed to the "?" in A2?
  - Answer: kept: 'open' is the round reaching you; the run shows the check failing, which is how the agent is told; you never see a round that has not passed.

- N9 · scene 3 · "A round finds its repo from its own folder" (choice A20): the video never says that a round has a folder, where that folder is, or why a round would need to "find its repo". I can't judge this choice without knowing what it replaced.
  - Answer: kept: the choice says what it gives, a round finding its repo wherever its folder is cloned; the folder is the round's own, which the map's first two rows make.

- N10 · scene 3 · "My choices, each a card at the right": "card" now means two things in one video: the round's question cards (c1–c4) and the agent's choice boxes (A2, A3 …). I first read "a card at the right" as one of the round's cards. The choice numbers also jump (A2, A3, A4, A20), with no word on where the others are.
  - Answer: fixed: scene 3 now says 'My choices, each boxed at the right', so card means only the round's cards.

- N11 · scene 3 · "close, like a recent late fix": the glossary explains the label, but almost every choice in the video carries "like a recent late fix" and the video never says which late fix. Without it, the tag reads as boilerplate, not a reason to look.
  - Answer: kept: the label says why the choice pauses, by the rule `reel stops` printed for every close one; the late fix it names is another plan's, outside this video.

- N12 · scene 4 · "no session waiting, a command set": "a command set" reads as one noun at first. I guess it means a headless command has been set up for the repo. The video never says where it is set: scene 7's frame starts "a command set in the repo's confi…" and the caption cuts it off.
  - Answer: fixed: scene 7's Show me more box is now cut above the captions, so 'a command set in the repo's config' is read whole.

- N13 · scene 4 · "A point card: click a box of its diagram": the meanings name three kinds of card (predict, assume, say). A "point card" is none of them, and the frame's card is labelled "predict". Is a point card a fourth kind, or a predict card you answer by clicking?
  - Answer: kept: the frame's label says it: 'card c4 · predict'; a point card is a predict card answered by clicking a box.

- N14 · scene 4 · "each answer is routed once" / "Each card is routed once, however often sent" (choice A7): routed where: to the session, the inbox, the plan? And "however often sent": how can a card be sent more than once?
  - Answer: kept: scene 7, three scenes on, shows where each answer is routed; the page sends an answer as you give it and again with the round, which is why once matters.

- N15 · scene 4 · "A round's Send never starts a headless run" (choice A10): this sits right beside a card whose answer is that a review with no session waiting and a command set starts a headless run. A newcomer reads it as a contradiction. The video needs to say that the round's own answers are handled differently from a review, and why.
  - Answer: fixed: the choice and the line now say 'Sending a round's answers never starts a headless run', apart from the card's review.

- N16 · scene 5 · "A fresh checker reads the session's marks before you do": "the session's marks" doesn't match anything on screen; the frame says "its claims, once a fresh checker has read them". I guess it means your spoken claims. And "before you do" what: before you see the code?
  - Answer: kept: 'the session's marks' are the match, gap and want the line names next, on your claims, which the frame's label calls its claims.

- N17 · scene 5 · "a want" / "a want: asked back as an assume card": the video gives match and gap a meaning but not "want". I guess it is something you said you wish for, which the code neither confirms nor contradicts. That "for me" counts as a want is not obvious.
  - Answer: kept: the line says it: 'a want, asked back as an assume card', and the third claim on screen is what the speaker wants, not what the code does.

- N18 · scene 5 · "your words reach the session as a question" (choice A11): which session, the agent's chat? And why as a question rather than as your statement? The frame adds "No session is waiting on this page: your words wait in its inbox for the next one", but the red outline sits over that text and cuts off its last line, so I couldn't read it all.
  - Answer: fixed: the ring now sits on the switch alone, and the line above it reads whole.

- N19 · scene 6 · "You settle c2 with Got it, and skip c3": in scene 4 I watched card c3 get answered (A, then turned over to a gap), so here I don't follow how c3 is "skipped". The video never shows how you skip a card. The only sign is "Skip the rest" in scene 12's picture. Were these two different c3s?
  - Answer: fixed: the round on screen in scene 4 is now cards c2 and c4, so c3 is only the card the quick check and scene 7's run skip.

- N20 · scene 7 · "c1, called right, into the plan's You told me first": card c1 is never shown, so I don't know what it asked. I also can't follow the logic: a card I called right goes into the plan, but a gap I settled with "Got it" goes only into my memory. I would have guessed the other way round.
  - Answer: kept: c1 is an assume card, which scene 7 says ('called right'); what an assume card settles goes into the plan, as You told me first, which the scene says.

- N21 · scene 7 · "A due thing comes back as a new card" / "asked once more on a new case from 2026-11-21": "due" has no meaning given. I guess it is spaced repetition: what you learned is asked again later. Why that date (three days on)? Who decides when something is due?
  - Answer: kept: 'asked again three days on' is said in the same scene's terminal, and three days is the owner's own decision, D-316.

- N22 · scene 7 · "what you know is a marked line in your memory file": "marked" how? Is it marked as known, or with a date? Is this the same as the glossary's Memory, which it says is "never kept by hand" and worked out each time? A file that stores lines sounds like the opposite.
  - Answer: kept: the choice card names the file, `~/.reelplanner/you.jsonl`, the same memory file the glossary's reviews are summed in; a line is marked as known.

- N23 · scene 7 · "A later video is warned where it shows what you know" (choice A22): who or what is warned, and what does the warning do: skip that scene, shorten it, or tell the author? I could not guess.
  - Answer: kept: the choice says it: the video being written is warned, which is the agent writing it, as `check-terms` does for any word.

- N24 · scene 7 · "The agent draws a card's diagram (question 6)" / "Show me more's video is one explainer command": "question 6" appears here before scene 10 says what it is, and I took it for a sixth card. "one explainer command" doesn't say which command.
  - Answer: fixed: the choice now says '(asked in the plan)' rather than a number that comes later.

- N25 · scene 7 · the diagram's boxes: "a headless run" has a bold outline and "the inbox" a dashed red one. I guess bold is the code's answer and dashed is my pick, but the frame never says so. The "More:" box below is cut off by the caption ("repo's confi…").
  - Answer: fixed: the Show me more box ends above the captions now; your pick dashed and the answer bold is the round page's own look, said in scene 4.

- N26 · scene 8 · "Send part one twice. What does the second PUT do?" / "The bit is already set; the PUT is idempotent": this sample quick check comes from an unrelated video. "part one", "PUT", "the bit" and "idempotent" are all unexplained, so I can't follow the example used to show settling.
  - Answer: kept: a label under the shot says it is a test video's check; its words are that video's, and only the buttons under the answer are this change.

- N27 · scene 8 · "Reel status counts rounds" / "too few plans to compare (1 with a round, 0 with a likely gap and none; 5 of each)": I couldn't parse the second line. Compare what with what? What is a "likely gap"? What does "5 of each" mean: five plans needed in each group? I guess it measures whether rounds help, but the video never says so.
  - Answer: kept: the narration reads it plainly, 'counts rounds'; the line is the real output, and what it compares is the plan's step 5.

- N28 · scene 8 · "a header line records a round, question five" / "A plan's header says whether a round ran" (choice A14): what is a plan's header? Why record whether a round ran at all, and who reads it? "question five" is named before scene 9 explains it.
  - Answer: fixed: scene 8 now says 'a header line records a round, asked in the plan', and the choice card the same.

- N29 · scene 8 · "A late fix counts once" (choice A15): counts once toward what: reel status, the memory, the labels that pause a video? I couldn't connect it to anything in this scene.
  - Answer: kept: in reel status, the line on screen right beside it; each choice is one clause.

- N30 · scene 8 · "Got it sends no rewrite of the step" / "Show me more with no example asks again": what would have been rewritten, and by whom? What is the "example" in Show me more, and who is asked again: me or the agent?
  - Answer: kept: each choice is one clause, as its box says it in full ('Got it sends no rewrite of the step': the step the quick check tests).

- N31 · scene 9 · "off the plan D1": "D1" looks like a decision number, but the same box cites "decision D-110", and decisions elsewhere are D-xxx. I guess D1 is "deviation 1", but the video calls these off-plan changes, not D-anything.
  - Answer: kept: the card says 'off the plan' before D1, and 'decision' before D-110, each with its kind.

- N32 · scene 9 · "C, the rounds alone" / "only the rounds themselves": I guess it means nothing extra is kept, and you tell that a round ran from whether its files exist. The narration says it too fast to tell. I also couldn't tell why it matters where this is kept, which I would need to answer question 5.
  - Answer: kept: scene 9 says the three options; why it matters, which plans `reel status` compares, is said in scene 8 just before.

- N33 · scene 10 · "B, the tool, from the pinned lines": "the tool" names no tool. I guess it is `reelplanner align`. To pick between A and B I would need to see one diagram the agent drew next to one the tool made; the video only names them.
  - Answer: kept: the tool is `reelplanner align`, the command scene 1's map names; the question's options are on the card beside it.

- N34 [plan] · scene 11 · "not done: a round before a real plan" / "live words seen in a real browser" / "a hosted round page": the feature's main use, a round before a real plan, has never been run, and neither has the setting that sends audio to a browser maker's servers. The plan should say how and when these get tried, and what counts as passing, before the build is called done.
  - Answer: ask: a round before a real plan, live words in a real browser and a hosted round page have not run; should the next plan in this repo start with a round, and should live words be tried in Chrome and Safari before you accept?

- N35 · scene 12 · the round page in the picture: card c3's answers here are "The inbox, to wait for you", "A headless run" and "Nowhere: it is lost", but in scene 4 the same c3 offered "the inbox", "a headless run", "the waiting session" and "Not sure". It also shows a "The code is wrong" button that scene 8 says a plan video doesn't have. A newcomer can't tell which page is the real one.
  - Answer: fixed: scene 12's picture is now the point card from scene 4, the same round and card.

- N36 · scene 12 · "How a review is handed on" / "Your words: \"how a review is handed on\"": this suggests a round starts from a topic you type. The video never showed how you start one or where that box is (see N3). At the end I still don't know how I would ask for a round.
  - Answer: fixed: scene 1 now says when a round runs, before a plan when a gap is likely and costly, or when you ask; the words on the page are your own words, as scene 1's 'when you ask' implies.
