# Fresh eyes: newcomer · round 2 · stamp 8e22ff2650ce

- N1 · scene 2 · "Send": the frame's first row is the bare word "Send", and the narration says it "hands your review" on, but nothing says what Send is or where it sits. The glossary has Finish (you approve or ask for changes) and Done on an explainer, and the review server "takes the review when you press Send". I guessed it is a button on the review page that comes after Finish. A newcomer can't tell whether Send, Finish and Done are one action or three, and the whole plan turns on what happens at Send.
  - Answer: fixed: scene 2's Send row now reads 'the button that ends your review: to the session that opened this page and waits, or a headless run where the config sets one'.

- N2 · scene 2 · "the one you opened this page from": I can't explain how a session opens "this page", or what makes a session "waiting". I guessed the agent prints a link to the review page and then sits idle in the terminal until a review arrives. This matters because every gap in scene 3 and every claim in scene 11 depends on whether a session counts as waiting.
  - Answer: fixed: scene 2 now says the session is the one that opened this page and waits, on the Send row itself.

- N3 · scene 2 · "a headless run ... can take it": "can" is never explained. When does a headless run take the review, and when does the review just wait? Scene 3 later says "in this repo" a headless run takes it because of the config, but scene 2 gives no condition. I guessed it is a per-repo setting. As it stands, scene 2 plants the same wrong picture (gap 1) that the video goes on to correct, with no sign that it depends on the repo.
  - Answer: fixed: scene 2's row now gives the condition, 'a headless run where the config sets one', so it no longer plants gap 1's wrong picture.

- N4 · scene 2 · "an explainer quotes its sources word for word": the glossary explains an explainer, but the scene never says why this plan builds on it. I guessed that predict cards quote the code's own lines the same way. Without that link, it reads as a stray fact among the four things.
  - Answer: fixed: scene 2's explainer row now reads 'its sources quoted word for word, as a card quotes the code'.

- N5 · scene 2 · "your memory, a file in your home folder, keeps what you've watched": this doesn't match the meanings given. The glossary says memory is "worked out each time from the decision log and the filed reviews, never kept by hand", and Got it puts a settled gap "into your memory as something you know", which is more than what you've watched. The screen doesn't name the file either: the glossary has `~/.reelplanner/you.jsonl`, the frame says only "a file in your home folder". I guessed memory keeps both what you watched and what you know. A newcomer would ask which it is, and whether it is a file you can open.
  - Answer: fixed: scene 2's memory row now names the file and both things it keeps, '~/.reelplanner/you.jsonl: what you watched, and what you know'.

- N6 · scene 11 · "Hold Space and talk": nothing says where you hold Space. In the review player, in the terminal, or on the card? On a video player Space normally pauses. I guessed it is a push-to-talk key on the review page while a say card is up. A newcomer would also ask whether they can type instead, and whether they can fix what whisper wrote before it is split into claims.
  - Answer: fixed: scene 11 now shows 'hold Space on this page · or type, and fix it' on the card.

- N7 [plan] · scene 11 · "Hold Space and talk" / "whisper writes it down": the video shows no way to type your words, and no way to check or correct the transcript before it is checked against the code. If whisper mishears, a wrong claim gets marked as a gap. The plan should say whether there is a typed fallback and a chance to edit the text.
  - Answer: plan: step 3 now says your words are shown before anything is checked, nothing is checked until you press Check, and a misheard word is fixed first, never marked as a gap.

- N8 · scene 11 · "as you chose" / "your decision D-315": I can't tell from this scene what the choice was or when I made it. I guessed an earlier stop in the video asked who checks your words, the waiting session or something else, and D-315 picked the session. The scene leans on a decision it doesn't restate, so a newcomer can't follow why it is the session and not the fresh checker.
  - Answer: fixed: scene 11's footer now restates the choice, 'checked by the waiting session (decision D-315), then the fresh checker'.

- N9 [plan] · scene 11 · "The waiting session ... splits your words into claims": what happens when no session is waiting? Scene 3 says a headless run takes a review in this repo. Does the headless run check the claims? Do they wait? Are they never checked? The plan needs to cover the no-session case for say cards.
  - Answer: plan: step 3 now says the page shows 'waiting for a session to check your words' until one takes it; no headless run checks them.

- N10 · scene 11 · "each checked against the code": predict cards are answered by the fresh checker "from the code alone", but here the waiting session checks claims, and that session has seen the whole conversation. A newcomer would ask why claims don't go to the fresh checker, and whether the session's view of the code can be trusted for exactly the gaps this plan is hunting.
  - Answer: fixed: scene 11's footer now says each claim is then read by the fresh checker, and step 3 of the plan says why: the session is the same agent whose picture may be wrong, so the checker reads each marked claim from the quoted lines alone first.

- N11 [plan] · scene 11 · "card c6" / "an assume card, next in this round": a round is "at most six" cards and this say card is already c6, so an assume card "next in this same round" would be a seventh. The plan needs to say what happens when a claim spawns a card in a round that is already full: does it go over the limit, replace a card, or go to a new round?
  - Answer: plan: step 3 now says the six is a limit on the cards the agent writes, so an assume card from your words can make a full round seven.

- N12 · scene 11 · the red underline under "It should tell me when it's been taken.": the "If I'm not there" quote is a gap and has a red underline with a red × chip. The "should" quote has the same red underline even though it is "neither", and the first quote, a match, has no underline. I guessed the underline means "worth a look", not "gap", but it reads as two gaps. The colour code needs to match the three outcomes: match, gap, neither.
  - Answer: fixed: scene 11 now marks only the gap in coral; the 'should' quote has the thin ink underline, as a thing to confirm.

- N13 · scene 11 · "✓ scripts/lib/inbox.mjs:673" / "× scripts/lib/inbox.mjs:700–705 · .reelplanner/config.json": the chips name files and line numbers but don't say what they are. I guessed they are the lines each claim was checked against, pinned at the round's commit. Nothing shows how you would see those lines (click the chip?) or how you would settle the gap from here: the Got it, Change the plan, The code is wrong and Show me more buttons don't appear on this card.
  - Answer: fixed: scene 11's pins now say what they are, 'a match · checked against scripts/lib/inbox.mjs:673' and 'a gap · checked against …', and the gap's line shows its card's four ways to settle.

- N14 · scene 11 · the "0" in the top-right Open chip ("Open Step 3 · Say it in your own words, and see each thing y… 0"): the Open chip is explained, but the "0" is not. I guessed it counts comments or marks on that detail. It is small, but a newcomer would wonder what the number counts.
  - Answer: kept: the Open chip and its count are the review player's own, drawn on every video with a guide part; this video's frames do not draw it.
