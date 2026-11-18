# Find the gaps — implementation

**Started from:** `95a5bdb` (the approval recorded in conversation).

## Autonomous choices

| ID | Step | Chose | Instead of | Why | Where to check |
|---|---|---|---|---|---|
| A1 | 4 | Keep a Got it in `~/.reelplanner/you.jsonl` as a line marked `kind: "knows"`, which `readYou` skips and the new `readKnows` reads [hard-to-undo] | A file of its own beside `you.jsonl`, or unmarked lines every reader of the file would count as a review | The plan names your memory's file; marking the line keeps every review count, memory line and dedup as it was | `scripts/lib/memory.mjs` `readYou`, `readKnows`, `appendKnows` |
| A2 | 1 | A checker answer of `?` (its lines do not decide it) stops the round like a disagreement, saying "quote the lines that do" [close] | Treating `?` as no answer, or as agreement | The first real round showed it: two of three cards quoted too few lines to decide them, which is a card that would teach a guess | `scripts/lib/align.mjs` `checkRound`, `checkerAnswers` |
| A3 | 1 | `align --check` fails while any predict card has no checker answer; `--no-checker` checks the rest first [visible] | Making the checker a warning, or a separate command | A card reaches you only when the agent and the checker agree (step 1); `--no-checker` lets the brief be written from cards that already pass | `scripts/align.mjs`, `checkRound({ checker })` |
| A4 | 1 | A card's `- source:` is one `path:from-to` range, read as pinned [close] | Several ranges a card | One range a card keeps the back of the card one block of code, and the checker's brief one block to read; a card that needs two files is two cards | `scripts/lib/align.mjs` `refOf`, `linesOf` |
