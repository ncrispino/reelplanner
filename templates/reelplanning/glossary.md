# Glossary

One name per thing, and no synonyms. The Term is the name in the files, commands and the decision log. Where a row has an **On screen** word, that is what a viewer sees and hears instead: narration, captions, frames and the player say *choice*, not call (plain words on screen; the files keep theirs). A plan's prose says the plain word too. Add a row when a plan introduces a part; never rename a row (add the old name under "also called", then stop using it).

Every row is explained by a scene of the system video tagged `- defines: <term>`; a new row makes the system video behind until one is (`reel status`, `check-terms`).

| Term | id (`system.json`) | Meaning | Also called (do not use) | On screen |
|---|---|---|---|---|
| A call | — | A choice the agent made on its own while building, one the plan did not cover: one row in `walkthrough.md` | | choice |
| A tag | — | A label the agent puts on a choice it made alone, saying why you might want to look at it. Four kinds: *visible* (you'll notice it when you use the thing), *hard-to-undo* (changing it later costs real work), *close* (a toss-up: the other way was nearly as good), *deviation* (an off-plan change). An off-plan change, and a choice labelled visible or hard-to-undo, pauses the walkthrough video; every other choice is on its list at the end | | label |
| A miss | — | A late fix: something a review let through that a later plan, fix or review had to change. A recent one makes a choice that shares its label pause the walkthrough video | | late fix |
| A deviation | — | An off-plan change: a choice where the agent did something other than what the plan said. It always stops the walkthrough video | | off-plan change |
| A beat | — | One scene of a video: a picture and a sentence or two of its voice. A video is a row of scenes; a question or a choice pauses at the end of its scene | | scene |
| A chapter | — | A stretch of one video under one title; the player shows "Chapter 2 of 4" as it begins. Not a plan's step, and not a part of the system | a part (of a video) | |
| An area | — | One part of the system, drawn as a box, with an id in `system.json` (where it is called a component) | component | part of the system |
| An id (D-056, A12, D1, k3, q2) | — | How to read one: D-056 is a decision in the decision log, numbered across the repo; A12 is the twelfth choice the agent made alone while building one plan, and D1 its first off-plan change; k3 is a video's third quick check, q2 a plan's second question. The player always says what an id is next to it | | |

## Other words

General words of the trade, with the meaning a newcomer needs: the player shows each on hover and in Terms, like any row, but the system video does not have to explain them, so a row here never makes it behind. `check-terms` finds a word like these said or shown with no meaning; add its row here, or give it a meaning in the storyboard's `terms:` line (`terms: branch = …`).

| Term | id | Meaning | Also called (do not use) | On screen |
|---|---|---|---|---|
| A repo / repository | — | A project's folder of code together with its whole history, kept with git | | |
| A branch | — | A line of work kept apart from the main code until it is merged | | |
| Merge | — | To bring a branch's changes into the main code. A pull request is merged when it is accepted | | |
| A commit | — | One saved change to a repo, with a message saying what changed | | |
| A pull request / PR | — | A change someone asks to have merged into a repo; others read it and comment before it goes in | | |
| The agent | — | The AI coding assistant that does the work, in chat: it writes the plan, builds the code and makes the videos | | |
