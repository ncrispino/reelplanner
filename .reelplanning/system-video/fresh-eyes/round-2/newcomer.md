# Fresh eyes: newcomer · round 2 · stamp 65d4139fac32

- N1 · scene 12 · "reel check": the command is named but never introduced; I guessed it is a linter for plan.md run by the agent. The narration says it "holds the plan to what you decided", but "holds" is vague: does it block, warn, or just report? Why it matters: I can't tell what the check does to the plan or what happens when it fails.
  - Answer: kept: scene 11 introduces the plan and that the agent runs the commands; the line says what the check holds the plan to, and what failing means is the plan guide's detail, not this scene's

- N2 · scene 12 · "your answers on each part it touches are rules it must cite": "cite" has a meaning, but "each part it touches" is unclear on this frame; I guessed "touches [player]" means the plan changes the review player. Where do these rules come from (the decision log, shown only later in scene 28), and what is a "rule" at this point? Why it matters: the key idea of the scene depends on a record the viewer hasn't seen yet.
  - Answer: kept: scene 3 says your review's answers become decisions, and scene 12's card names them 'your answers · rules'; scene 28 then shows the log they live in, in the lifecycle's order

- N3 · scene 12 · "26 in force, 0 superseded, 0 failure(s), 0 warning(s)": "in force" is defined, but "superseded" is not, and I guessed it means replaced by a later answer. I couldn't tell what would make a failure or a warning, or whether 26 is all the project's rules or only the player's. Why it matters: it is the one result line on screen and I can't read it fully.
  - Answer: fixed: 'superseded' now has a meaning in the storyboard's terms (replaced by a later decision); 'in force' already had one; the line is the run's own output, shown whole

- N4 · scene 12 · "a fresh plan" / ".reelplanning/plans/2026-10-05-bigger-captions": "fresh" and the folder name are unexplained; I guessed it is a newly written plan and that "bigger-captions" is its name. "1 steps" also reads oddly. Why it matters: it is unclear whether this is a real example or an illustration.
  - Answer: kept: the terminal is titled 'a fresh plan' and the folder name is the plan's name, as scene 11 says plans are kept; the output is the real run's

- N5 · scene 12 · "or say why it replaces one.": the caption suggests a plan can override a rule, but the frame shows no example of replacing. I guessed that the plan must justify it in its text. Why it matters: who accepts that reason, and what happens if the plan just ignores a rule?
  - Answer: kept: the narration says the plan must cite each rule or say why it replaces one; who accepts the reason is the review, which chapter 4 shows

- N6 · scene 28 · "reel record": the command is not introduced; I guessed it files a review into the repo. The narration's "files the review" is unclear on where the review goes. The frame's listing shows `reviews/` with plan-…json/md and walkthrough-…json/md, labelled "never overwritten", but the video never says which file is the review or why there are two types. Why it matters: I can't link the listing to the narration.
  - Answer: kept: scene 27, just before, says how a review reaches the agent; the folder is that plan's reviews, one per review, each kept as data and as text

- N7 · scene 28 · "D-264" / "an id": the frame labels it "an id" and shows a heading "Where does the guide open from the video?" in decisions.md. The narration says "an id like D-264", but I couldn't tell that the heading is a question from an earlier review, or that D-264 is the answer to it. "The guide" appears there without having been introduced in this video. Why it matters: it isn't obvious what an entry contains (question, answer, who answered).
  - Answer: kept: the entry's heading is the question it answers, and scene 21 showed the guide under the video, the answer this entry records

- N8 · scene 28 · "309 entries / 65 rules / 213 history / 31 not in force": 65+213+31 = 309, but the narration says "Of 309, only 65 are rules" and never mentions 213 or 31. "history" is explained as "the agent's choices", but those are said to be in the log with "your answers", so 213 agent choices versus 65 answers is unexplained. I guessed "not in force" means answers replaced by later ones. Why it matters: it is the main picture and a third of it goes unnarrated.
  - Answer: kept: the narration says the 65 bind a plan and the agent's choices are history; the bar shows the rest to scale so the share is seen, not said; 'not in force' has a meaning in the terms

- N9 · scene 28 · "raised again only when a change rewrites their code" vs the narration's "back only when a change rewrites their code": "raised again" is not clear. I guessed the agent's old choices are shown again to you only when later code touches them. Why it matters: it is unclear who raises them and where (a plan, a walkthrough, a question?).
  - Answer: kept: the narration says 'back', the frame 'raised again': the check and the code check name such a choice when a change rewrites its code, and scene 32 shows the code check

- N10 · scene 28 · "a plan touching the player cites all 26 of its rules": "the player" is unexplained here. I guessed it is the review player. Also, scene 12 said "26 in force" for the same part, and here 26 is "its rules", so I guess they match, but the video doesn't say so. Why it matters: the link between scenes 12 and 28 is left to the viewer.
  - Answer: kept: the player is named in chapter 4 ('reviewing in the player') before scene 28, and scene 12's run shows 'touches [player]' with '26 in force'; the same number on the same part ties them

- N11 · scene 28 · "reel fold player" → "a draft: the 26 as one section of spec.md" → "you approve" → "plans cite spec.md#rules-player in place of 26 ids": "fold" and the "#rules-player" anchor are new. I guessed it merges 26 decision ids into one spec section so plans cite one thing. Why it matters: it's unclear why folding is needed (are 26 citations too many?) and who triggers it. The narration says "drafts" but the frame doesn't show the draft or what is written into spec.md.
  - Answer: kept: the narration says why: plans then cite one section instead of each id; the box reads 'in place of 26 ids'; the agent runs it, as the chip says, and you approve the draft

- N12 · scene 45 · "your review" appears twice in the cycle (after "the plan video" and after "the walkthrough video"), and "decisions" sits between review and build: I guessed the loop is plan → plan video → review → decisions → build → walkthrough video → review → system video → back to the plan. The frame doesn't say what the arrows mean (produces, feeds, then). Why it matters: the closing recap is hard to read without a legend, and "the system video" feeding "the plan" is a surprising link.
  - Answer: kept: scene 45 only changed its words; its loop is scene 3's, where each arrow is said in order

- N13 · scene 45 · "a record that keeps everything": it sits beside the diagram but points at no box. I guessed it means "decisions". Why it matters: the summary lines on the right aren't tied to the diagram's parts.
  - Answer: kept: the line sums up the whole loop, which is lit whole; scene 28 said what the record keeps

- N14 · scene 45 · "Install it": no install command, link or place is given anywhere on screen, and the video never says where to get it. Why it matters: a newcomer who wants to start has nowhere to go. Also the text "Install it, ask your agent for a plan, and watch." is cut off at the right edge of the frame ("and watch" is clipped), so I can't read it.
  - Answer: fixed: the closing line now wraps in two lines inside the frame; where to install from is chapter 2 (scenes 6 to 10)
