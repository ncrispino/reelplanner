# Fresh eyes: newcomer · round 3 · stamp a3771a3ccdb1

- N1 · scene 2 · "this session" / "this branch": the four example questions never say whose session or which branch; I guessed the current chat with the agent and the git branch I'm on. Matters because scene 5 later treats "the session" as a 21,562-line file, and I did not know a session is a saved file.
  - Answer: kept: the narration names both as the viewer's own ("this session", "this branch"), and scene 5 says a transcript is "the record of a session", with its meaning in the terms (Claude Code keeps each session as a file on your machine)

- N2 · scene 5 · "A part": "a part of the repo" here, but the glossary's "part of the system" is a box in the system video. I guessed a part is a folder or component like the review server; I could not tell whether it is the same "part" or a different one.
  - Answer: kept: it is the same part of the system the glossary names (the review server is one), which is the example scene 5 gives

- N3 · scene 5 · "it would read, measured today": what does an explainer "read", and who measures it? I guessed it is the size of the sources the agent would gather. Also "3 min / 5 min" is the video length, but the column header does not say so.
  - Answer: kept: the columns are what you ask, what it would read and about how long; the narration says "Each runs two to five minutes", so "about" is the video's length

- N4 · scene 6 · "guide" (turns 212-240): the glossary defines guide, but this video never shows one until scene 8, and "turn" is used on screen in scene 7 before any scene says a turn is one message. I guessed turn = one line of the session. It matters because question 1 asks me to choose between guides I have not yet seen.
  - Answer: kept: question 1 describes its options in its own narration ("the whole transcript, organized, or the full diff, a click from each moment"), and turn has its meaning in the terms

- N5 · scene 7 · "… 21,560 lines not shown": the caption says the video quotes only 2 lines here, but question 3 later says 12 are quoted. I could not tell whether 2 is an example or the real amount, or where the "21,560" is stored.
  - Answer: kept: the kicker says "an example", and question 3's 12 lines are another example; the count is the transcript's, which sources.json keeps (scene 21)

- N6 · scene 10 · "It isn't rebuilt on its own; ask again for a new one": this seems to conflict with scene 12, where "Explain more" brings a next version. I guessed Explain more is the "ask again" button. The video never says so, and I could not tell what a new ask versus Explain more does.
  - Answer: kept: Explain more answers your comments on this explainer (its next version); asking again makes a new one for a later commit; scene 12 says what Explain more rebuilds

- N7 · scene 10 · "reelplanning explain part "the review server"" and ".reelplanning/explainers/2026-09-29-review-server/": what is "reelplanning" (the tool name) and is this the agent's command or mine? The narration says the agent runs it. I guessed the agent types it after I ask in chat.
  - Answer: kept: the narration says the agent runs the command after you ask in your own words; reelplanning is the product, named in names.md and the system video

- N8 · scene 11 · "why did last night's CI run fail?": the answers say "the run's log", but the video never says how the explainer would get a CI log, or how it is told which run. I guessed a log is a file I hand over. Also the tag "quick check · step 1" points to step 1 but the answer is not visible in step 1's scene.
  - Answer: kept: how a CI log is fetched is the plan's (step 1's table, `gh run view <id> --log`), not the video's; the check applies scene 5's rule, "a transcript or a log, the record of a session or a run", which is step 1's scene

- N9 · scene 12 · "reviews/ filed" and "your memory: what you watched": "reviews/" is a folder shown with no earlier introduction. I guessed it is where review files are saved, and that "memory" is the glossary's Memory. "Filed" is never explained on the frame.
  - Answer: kept: the frame shows where the review goes, reviews/; memory is the glossary's row (Before you watch: the system video's part 7)

- N10 · scene 13 · "What plays on Friday?": option A says Monday's video "7 commits since", which I could not link to the row in scene 10 without going back. The narration does not say what "out of date" would look like or who decides. I guessed the row's commit count is the only warning.
  - Answer: kept: scene 10 says the row "says how many commits have landed since", and that it isn't rebuilt on its own; the check asks you to put the two together

- N11 · scene 14 · "## The problem" / "plan.md": "the plan's problem section" is never introduced. I guessed every plan has a section called The problem that holds the reason for the plan. Also "scene 4 · 'make a waiting review easy to see'" doesn't say which video's scene 4 this is.
  - Answer: kept: the narration says "the plan's problem section"; the scene 4 is the explainer's, which the left card's file, reviews/explainer-<time>.md, says

- N12 · scene 15 · "lean on it" / "Before you watch, and two lines": "how far does the plan lean on the explainer" is a plain phrase with no meaning given. I guessed lean means "assume you already watched it". "two lines" for a new viewer is unclear: two lines of what, and where?
  - Answer: kept: the option is named in plain words; lean on is now in the storyboard's terms ("count on the viewer having the explainer to watch, and so not say its content again"); option A says the two lines are for a new viewer, under Before you watch

- N13 · scene 16 · "What changes": chapter 1 of the plan's video is called "What changes" and the plan's video is never shown before. I guessed it is the first chapter of any plan video. I could not tell what a plan video normally opens with, so I could not compare A, B and C.
  - Answer: kept: every plan video opens on what changes (scene 4 of this one is its own); the three options differ in what comes before it, which each branch shows

- N14 · scene 19 · "A question for the next plan": I do not know what it would mean for the decision log to hold a question, or what "the next plan" is. I guessed it is a follow-up plan started later. Also I could not tell whether my "this looks wrong" comment is kept anywhere after Done.
  - Answer: kept: C is a reasonable wrong answer; the check's why for it says Done starts nothing more, and the comment is filed with the review (scene 12: "The review is filed")

- N15 · scene 20 · "Frame 5 — Where a review waits" and "source: scripts/lib/inbox.mjs:50-80": the storyboard calls a scene a "frame", and the file path with ":50-80" is never explained. I guessed the numbers are line numbers. "warns scene 3 · 'three times': no source" is also unexplained: what is a warn versus a fail, and what did "three times" quote?
  - Answer: kept: the storyboard's own word is Frame (the glossary's "A beat" row: scene); "lines 50–80" is pinned under the source line; ✗ fails and △ warns are labelled on the run

- N16 · scene 21 · "sha256:…" and "masked by the agent, then built again": "the build stops" is shown, but I don't know who runs a build or when (I assumed it is the reelplanning build). The masked line still looks like "OPENAI_API_KEY", so I couldn't tell what the mask hides.
  - Answer: kept: the build is the explainer's, the one this scene is about; the mask hides the key after its first letters (sk-…REDACTED), as masked's meaning in the terms says

- N17 · scene 22 · "committed and shared like a plan's video": the recommendation assumes a plan's video is already committed to the repo. That was never said in this video. I also could not tell what "its text" means: the narration says its scenes and its quoted lines, but the option card says "Its text, never the transcript".
  - Answer: kept: option A's card says "its scenes and 12 lines"; that a plan's video is committed is the repo's way today (the contributing plan, before this one); the narration states it as the comparison

- N18 · scene 25 · "after Done: the explainer: this machine only": I could not tell whether it is deleted or just not shared once I press Done. I guessed it stays as files on my computer. The narration only says it "stays on one machine".
  - Answer: kept: the branch says "stays on one machine", which is not deleted; it is option C's cost

- N19 · scene 28 · "approve": this plan closes with "or approve", but the video never said that a plan review has Approve. It only said explainers do not. I guessed approving is what turns the plan into a build, which is not shown.
  - Answer: kept: Approve is the glossary's "Approve / Request changes" row, every plan video's ending, and scene 12 names it as what an explainer has in its place
