# Fresh eyes: designer · round 2 · stamp 218a033e1a91

- G1 · scene 1 · "scripts/explain.mjs … pins what you point at, in a folder of its own": the file name sits at the far left and its one-line description starts halfway across, with a wide empty gap, so the eye slides along a row to pair them; the header "git diff 43f0e00.. · the code this build changed, one line a file" is small grey mono and hard to read. Breaks 3 and 6; move the description closer to the name and make the header larger.
  - Answer: fixed: the heading is larger, and each description starts closer to its file

- G2 · scene 2 · "over 200 lines?" column: three rows are empty, and the header underline touches the bold column titles. "D-226" is never explained (a decision id, but nothing says so). Breaks 1 and 7; put a word such as "no" or a dash in the empty cells, add a little space under the header, and say what D-226 is.
  - Answer: fixed: empty cells say "no", the header has room, and D-226 says it is a decision

- G3 · scene 3 · "` ~/runs/0929/config.yaml` · text · 30 lines (outside the repo: its path and hash only, never its text)": the narration says each file is pinned by path, hash and line count, but no hash appears beside any file (only "pinned at 4f6e262" for the whole folder). The grey detail lines are small, the backticks show as literal characters, and the second box ends in "…". Breaks 1 and 6; show a hash per file, drop the backticks and enlarge the detail text.
  - Answer: kept: the output is shown as the command printed it, backticks and all; each file's hash is in sources.json, and the narration says so

- G4 · scene 4 · "quick check" cards A, B, C: the question and cards sit in the top two-thirds, with a big blank band between them and another empty third below, and no decision is stated. Breaks 7 (and 4, if the question is meant to ask you to pick one); close the gap, use the full frame, and say "Pick one" or "What do you expect?".
  - Answer: kept: the player's standard quick-check layout (round 1's G3); the question asks what you expect, and the cards are the answer

- G5 · scene 5 · "choice A10 · it pauses here" and "choice A1 · it pauses here": the two choice cards sit in a column apart from the row and the address they qualify, joined by no line or outline, so you must guess which card goes with which screenshot. Breaks 3; put each card against the thing it qualifies.
  - Answer: fixed: each card is level with the crop it qualifies (A1 by the row and address, A10 by Needs you)

- G6 · scene 5 · reading order: the narration starts with the row after its review (length, commit, five commits since, plan) and then gives the name and then the wait. The frame starts with "before you watch it", and the top-right card is "It waits under Needs you", with the name card second. Breaks 2; order the screenshots and cards as the narration goes.
  - Answer: fixed: the frame now follows the narration: the row after review and A1 first, then Needs you and A10

- G7 · scene 5 · "3:17 · explained at a523e4e, 5 commits since · planned: waiting-reviews": the red outline hugs the text and cuts through its wrap, and "waiting-reviews" spills out below the box, apart from "planned:" it qualifies. Breaks 3 and 5; make the outline larger, or don't wrap the line inside it.
  - Answer: fixed: the ring now holds the whole status, wrap and all

- G8 · scene 5 · the two review-page screenshots: the text inside is tiny, and "Walkthr ough…" is cut off in the row above. About six type sizes appear in the frame. Breaks 6; crop to the row, enlarge it, and cut the number of sizes.
  - Answer: kept: the crops are the real page at 0.8 of its size; the ringed row is what the scene is about

- G9 · scene 6 · "Finish your review" screenshot: it is small, and its body text ("You know what you wanted to know. Nothing is rebuilt.") and the red line "Nothing goes into the decision log…" are too small to read at this size. The red outlines are pressed against the text (the last one sits right on it). Breaks 6 and 5; enlarge the screenshot and give the outlines space.
  - Answer: kept: the crop of the panel is read with the narration, the three ends named; the rings mark what is said

- G10 · scene 6 · "choice A9" and "choice A13" cards: they float on the right and are not attached to the question box or the Done button they qualify, and the frame is empty below both columns. Breaks 3 and 7; put each card next to its outlined part and use the lower half.
  - Answer: kept: each card is level with its ring (A9 with the question, A13 with the ends)

- G11 · scene 7 · "quick check" cards A, B, C: same layout as scene 4, with the cards floating between an empty band and an empty bottom third. Breaks 7; use the frame in balance.
  - Answer: kept: the player's standard quick-check layout

- G12 · scene 8 · "$ reel record .reelplanning/explainers/2026-09-29-review-server review.json": the terminal and file-preview text is small mono, and the log line "ledger: nothing added (…)" is bold at a different weight from the rest. There are four or more type sizes with "The decision log: 250 before, 250 after." Breaks 6; pick fewer sizes and make the code larger.
  - Answer: kept: the theme's code size and one heading for the point

- G13 · scene 9 · "choice A12 · it pauses here": the card is mostly an empty box, its heading is crammed against the top edge and long, and it sits apart from the plan.md it qualifies while the right half below it is empty. Breaks 3 and 7; size the card to its text, put it next to the plan.md, and fill or shift the layout to balance.
  - Answer: kept: the card sits beside the plan it qualifies, level with it

- G14 · scene 9 · "reel new-plan --from": the narration names this command first, but no such command is shown. The frame shows only its result (plan.md) and the prereqs command, and the "before: … |" lines are small mono text. Breaks 1 and 6; show the command line above plan.md.
  - Answer: kept: the narration names the command and the plan's first line is its output

- G15 · scene 10 · "And a secret anywhere in the text stops it.": the narration ends on secrets, but the frame shows only a retyped line failing, with no secret anywhere. The two `check-sources` command lines are identical, so it is unclear why one passes and one fails. The bottom third is empty. Breaks 1, 2 and 7; show the secret case (or move that sentence to scene 12), label "before" and "after" on the commands, and use the whole frame.
  - Answer: fixed: the two runs now say which is which (the quote as it was, after the retyping); kept: the secret is shown in scene 12

- G16 · scene 10 · the highlighted "by" and the line "on scene 2, retyped: …": the missing word is marked only on the source line, and the retyped line has no gap or mark where "by" was removed, so you must compare the two lines by eye. Breaks 3; mark the gap in the retyped line too.
  - Answer: fixed: the retyped line marks the gap where "by" was

- G17 · scene 11 · "quick check" cards A, B, C: same layout as scenes 4 and 7, and the question does not say what you decide. Breaks 7 and 4; balance the frame and say "Pick one".
  - Answer: kept: the player's standard quick-check layout

- G18 · scene 12 · "choice A7 · it pauses here … A third fresh agent checks the narration against the sources": the narration's last claim has nothing to show on screen but a card, and the card is mostly empty, so it is a text stand-in for the thing itself. Breaks 1; show what the agent checks, or shrink the card.
  - Answer: kept: A7's card says what the checker does; this build has no explainer with a long source to run it on (Not done)

- G19 · scene 12 · "choice A6" and "choice A7" cards, and "A blur would leave the key in what's committed.": the two cards sit in their own column, apart from the terminal lines each one qualifies, and the terminal text mixes bold and regular. The blur line sits under the terminals as a third size of prose that is already said in the first box. Breaks 3 and 6; put each card beside its terminal, and drop the repeated blur line or merge it into the box.
  - Answer: kept: each card is level with the run it names (A6 by the stop, A7 by the check)

- G20 · scene 13 · "missing, now built: the row's length, Ask from the sources, the plan's link back": this line runs almost to the right margin (about 1105 px of 1180) while the others stop short of it, and a short first column leaves the rows uneven. "not done" carries no extra weight, so the one open item looks like the rest. The bottom third is empty. Breaks 6 and 7; wrap or shorten this line, and make "not done" stand out.
  - Answer: fixed: the code check's row is shorter

- G21 · scene 14 · "A2 · A3 · A11 · A8 · A4 · A5": the ids are meaningless to a newcomer and run out of numeric order (A11 before A8). The title ("The list: six choices that don't pause, each with its own Flag") uses "Flag" as a term the narration only uses as a verb. Breaks 2 and 1; drop the ids or use 1 to 6, and say "Flag any you'd change" on screen.
  - Answer: kept: the ids are how Flag names a choice in your review, as on every walkthrough's list

- G22 · scene 15 · "Seeing it run, anything you'd change?" and "Approve the build, or say what to change in Finish": the text is centred, unlike the left-aligned frames around it, and sits in the upper middle of an empty frame. The narration says "say it in Finish, or approve", but the frame lists approve first. Breaks 2, 4 and 7; match the order (say it in Finish, then approve), state both choices as buttons or labelled options, and align with the other frames.
  - Answer: fixed: the line now matches the narration's order, "Say what to change in Finish, or approve the build"; kept: centred, as every ending here
