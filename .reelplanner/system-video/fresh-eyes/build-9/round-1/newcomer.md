# Fresh eyes: newcomer · round 1 · stamp d1e3d695730c

- N1 · scene 12 · "reel check": the video never says what this command is; "reel" is glossed only as "the reel CLI", and "check" is not explained. I guessed it is a validator that compares a plan file to earlier answers. Needed: one line saying it is run by the agent on a plan before the plan video is made.
  - Answer: kept: scene 11 says the agent runs every command from there and writes the plan as plan.md; scene 12's chip says 'your agent runs this', and its line says what the check does (holds the plan to what you decided)

- N2 · scene 12 · "your answers on each part it touches are rules": "rules" is not defined here. Where do these answers come from, and when did I give them? I guessed they are answers from earlier reviews, but this scene is before any review is shown. Also "part it touches" is unclear: the screen shows "touches [player]", and I guessed this is the review player, but the video had not yet named it as a part.
  - Answer: kept: scene 3 says your review's answers become decisions, and scene 6 names the parts; scene 12 is about the answers already in the log, and scene 28 shows where they are filed

- N3 · scene 12 · "26 in force" / "0 superseded": "in force" and "superseded" are ordinary words with no meaning given. I guessed "in force" means answers still binding and "superseded" means answers replaced by a later one. I also could not tell what "1 steps", "0 failure(s)" and "0 warning(s)" count or what would make a check fail.
  - Answer: fixed: the storyboard's terms now give 'in force' (still binding on later plans: not replaced by a later answer); the run's other counts are the check's own output, shown whole as the real thing

- N4 · scene 12 · "a fresh plan" / "2026-10-05-bigger-captions": it is unclear whether this is a real plan from this repo or an invented example. I guessed an example. I also could not tell which plan file the path points to; scene 11 only named "plan.md".
  - Answer: kept: the terminal is titled 'a fresh plan', and the real thing is labelled as a run on a scratch copy of this repo's record; what matters is the line it prints

- N5 · scene 12 · "cited on each part the plan touches, or replaced, with the reason": "cited" is unclear. Cited where? In the plan text? I guessed the plan must name each rule by its decision id. The "Your answers · rules" card is a stand-in box, not a real plan or a real answer, so I cannot see what a citation looks like.
  - Answer: fixed: the storyboard's terms now give 'cite' (name a decision by its id, or the spec.md section it is folded into, in the plan's list of the decisions it keeps)

- N6 · scene 28 · "reel record": the command is not explained beyond filing the review. Where does the review come from, and what is "the review" here? I guessed it is the file the player sends at Finish.
  - Answer: kept: scene 27, just before, says how a review reaches the agent (Send, a hosted page, a download); scene 28 files that review

- N7 · scene 28 · "never overwritten" and the file listing "reviews/": the filenames (plan-…json/.md, walkthrough-…json/.md) are not explained. What is the difference between .json and .md, and why are there two plan files and two walkthrough files? I guessed .json is the raw answers and .md a readable copy.
  - Answer: kept: the scene's point is that the review is filed once and kept; the two file kinds are a detail the folder shows as it is

- N8 · scene 28 · "D-264" / "an id": I guessed a decision number. The shown title "Where does the guide open from the video?" is a question I never saw asked. Whose answer is it, and where is the answer? The card shows only a heading.
  - Answer: fixed: 'an id' is now pinned right under D-264, with a coral underline on the id; the narration says each answer goes into the decision log with an id; scene 21 showed the answer it records: the guide under the video

- N9 · scene 28 · "the decision log": it is named in the narration, but the screen shows the entry as a heading and no log. Where does the log live (a file? which one?) and what is an "entry"? I guessed a file of numbered answers.
  - Answer: fixed: the entry now sits on a page labelled decisions.md (with a meaning in the storyboard's terms), and the bar is labelled 'the decision log: 309 entries'

- N10 · scene 28 · "309 entries" / "65 rules" / "213 history" / "31 not in force": the bar adds up (65+213+31=309), but what makes an entry a "rule", "history" or "not in force"? Narration says "your answers in force" are rules and "the agent's choices are history", but "not in force" is never explained. I guessed it means answers that a later answer replaced. Also, are 65 rules a lot? Why do only some entries bind a plan?
  - Answer: fixed: 'in force' now has a meaning in the storyboard's terms, so 'not in force' reads as replaced by a later answer; the narration says only the 65 rules bind a plan

- N11 · scene 28 · "binds a plan": ordinary words with no meaning given. I guessed "a plan must obey it".
  - Answer: kept: scene 12 just said what binding is: rules a plan must cite, or say why it replaces one

- N12 · scene 28 · "back only when a change rewrites their code: reel check --base, pr-check": I could not follow this. What does "back" mean (come back into force)? What is "--base"? I do not know what pr-check does here. The glossary says it reports where a pull request stands, which does not obviously connect to the agent's choices. The narration says only "back only when a change rewrites their code".
  - Answer: fixed: the line under history now reads 'raised again only when a change rewrites their code', with the command names dropped

- N13 · scene 28 · "26 on the player": I guessed the 26 matches the "26 in force" in scene 12, but the scene does not say so. "the player" is not defined at this point.
  - Answer: fixed: the line now reads 'a plan touching the player cites all 26 of its rules', the same player and the same 26 as scene 12's run; the player is named in chapter 4 and scene 12's run shows it as a part

- N14 · scene 28 · "reel fold player" → "a draft: those 26 as one section of spec.md" → "you approve" → "plans cite spec.md#rules-player": I do not know why folding is needed (what is wrong with citing the 26 separately?) or who "you" is (the project owner?). "spec.md#rules-player" looks like a link into the file, which I guessed. I also could not tell what happens to the 26 original rules after approval: are they still in the log? Are they still "in force"?
  - Answer: fixed: the last box now reads 'plans cite spec.md#rules-player, not 26 ids', which says why; 'you' is the viewer throughout the video, the person reviewing

- N15 · scene 45 · "decisions" / "the build" / "your review" (drawn twice): the loop shows "your review" twice with no label saying which is the plan review and which is the walkthrough review. I guessed the top is the plan review and the bottom is the walkthrough review. The arrow from "the system video" back up to "the plan" is not explained: how does a video lead to a plan? Narration does not mention it.
  - Answer: kept: scene 45 only changed its words; the loop is scene 3's, where each review is said in order, the plan review then the walkthrough review

- N16 · scene 45 · "a record that keeps everything": the loop has no box named "record". I guessed it refers to "decisions". But scene 28 said the log keeps everything, yet only 65 of 309 are rules, so "keeps everything" may mislead.
  - Answer: kept: the ending says the record keeps everything, which is what scene 28 says of the log; what binds a plan is a part of it

- N17 · scene 45 · "Install it": install what, and how? No command or place is shown. A newcomer cannot act on the last instruction.
  - Answer: kept: chapter 2 (scenes 6 to 10) runs the install commands one by one; the ending points back to it
