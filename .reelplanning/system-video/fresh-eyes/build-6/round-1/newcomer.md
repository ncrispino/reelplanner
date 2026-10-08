# Fresh eyes: newcomer · round 1 · stamp e255110793cc

- N1 · scene 1 · "skimmed: 0 of 4 answered": the chip sits on the plan, but the narration never says who counts "answered" or what "skimmed" means. I guessed it is a tally of the plan's open questions that a skimming reader left unanswered. Why it matters: it is the scene's whole point, and only the narrator's last sentence backs it.
  - Answer: kept: the badge reads 'skimmed: 0 of 4 answered' on the plan's four questions, and the narration ends 'Nobody answers the questions'; the next scene says what reelplanning does about it

- N2 · scene 3 · "the system video, this one, catches up": catches up with what? The loop ends at this box with an arrow back to "the next plan starts here", but the narration never says it is rebuilt after changes to the project's description. I guessed it means "gets updated". Why it matters: this is the video's own role in the loop, and the glossary entry is the only place that says so.
  - Answer: kept: scene 37 says what this video catches up with (spec.md, system.json and the glossary) and spec-diff; the loop is the overview

- N3 · scene 4 · "headless review run", "sandbox", "hosted review page", "system-video review", "open work": the table packs in terms that are only explained in scenes 25 and 26. Narration says "not yet its sandboxed run on a normal machine", which means nothing at this point. I guessed the sandbox is a safety fence for the agent and "headless" means no window. Why it matters: it is the first claim about what is tested, and I can't judge it.
  - Answer: kept: the review asked that this line say the sandboxed run is untested; the headless run and the sandbox are drawn in scene 26, and 'open work' is docs/agents.md's own heading

- N4 · scene 5 · "while the repo is private, this ran from a packed copy of this branch: npm i -g ./reelplanning-0.2.0.tgz": this contradicts the command shown just above (`github:ncrispino/reelplanning`). I couldn't tell which command I should run. I guessed the real one is the first. Why it matters: it is an install instruction.
  - Answer: fixed: the note now begins 'the command you run', and says the shot itself ran from a packed copy while the repo is private

- N5 · scene 6 · "patched ~/.agents/skills/media-use/…/tts.mjs": nothing says what was patched, why, or whether I should expect it. Also "node", "ffmpeg" and "Kokoro" are shown with no word on whether I install them first. I guessed setup installs everything. Why it matters: unexplained output in a step I am told to run.
  - Answer: kept: setup's real output; the narration says what setup gets (a voice, a transcriber, a browser, HyperFrames' skills), and the patch is setup's own line, nothing for the viewer to do

- N6 · scene 7 · "Review skills before use; they run with full agent permissions": this warning is on screen and never mentioned. Is it about plan-to-video? Is it safe? Also "universal: Amp, Antigravity…" and "symlinked: AiderDesk…" are never explained. I guessed these are lists of agents that got the skill. Why it matters: it reads as a security warning.
  - Answer: kept: the real output of `npx skills add`; its warning is the tool's own, for any skill, and the narration says what the command did (copied the skill to where the agents read skills)

- N7 · scene 8 · "names.md", "theme/", "decisions.json", "plans/", "README.md": five of the ten files in `.reelplanning/` have no label, and the narration lists only some of them. I guessed names.md is a naming list and theme/ is the look of the videos. Why it matters: it is the first look at what the tool writes into my repo.
  - Answer: kept: the five files the narration names are pinned; the rest (README.md, names.md, plans/, theme/) are the folder as it is, and plans/ is shown in scene 10

- N8 · scene 10 · "STORYBOARD.md - guide: step-3#cases" and "index.html?project=<video>&t=102 (opens at 1:42)": these lines under "Interface" are shown without saying what STORYBOARD.md is yet, or what "guide: step-3#cases" does. I guessed it is a tag that says which guide part a scene opens. Also "as written, before question 2 was answered" is a chip I couldn't place. Why it matters: it is the example of what a plan's interface looks like.
  - Answer: kept: the plan's real Interface block, quoted as written; the narration says what an interface is ('what a step adds that you use'), and the chip says the text is the plan before its question was answered

- N9 · scene 11 · "26 in force", "0 superseded", "touches [player]", "cite": the narration says answers are "rules it must cite, or say why it replaces one". The frame's "26 in force" box has no definition of "in force", and "superseded" and "[player]" are not explained. I guessed a decision is "in force" until a later one replaces it. Why it matters: it is the main check of the loop.
  - Answer: kept: the chip under the run says what '26 in force' is (your answers, each cited), and the narration says the plan cites them or says why it replaces one; superseded is that replacing

- N10 · scene 13 · "N1 · scene 1 … answered", "from an earlier build of this video": the frame quotes a findings file with its own jargon ("0 of 3 answered", "OK ✓", "Before you watch"). I couldn't tell whether this is the file I am about to watch or an old one. I guessed it is an example. Also "given a meaning" is never said in plain words. Why it matters: it is the only picture of what fresh eyes produces.
  - Answer: kept: the label says it is a findings file from an earlier build of this video, an example of what fresh eyes writes; 'given a meaning' is said as one of the three answers

- N11 · scene 14 · "Plan | Built | Guide", "not on this page", "Earlier plans (12)", "Nothing needs you": the review page's list is shown but never explained. The Plan/Built toggle is the one that matters and nothing says what "Built" is. The narration says "four choices … and five quick checks" while the card shows "4 choices to make, 5 quick checks, … 5 min". I guessed Plan/Built are the plan video and the walkthrough video. Why it matters: it is my first look at the page I will use.
  - Answer: kept: the Videos list is shown for 'every video in the repo'; Plan and Built are the plan video and the walkthrough video, which scene 32 opens with Built; the card's own line is quoted

- N12 · scene 16 · "a trace a case", "opened in place, under its row", "Expand all: every layer", "Record · 5 steps · 0/4 decided", "Mark D", diamonds and circles on the timeline: the frame is cropped (it cuts off "Fi…" and "Pla…") and shows a lot of player controls the narration never names. The narration says "Draw on a frame, or comment anywhere", but I see no drawing. I guessed the diamonds are questions and the circles are quick checks. Why it matters: this is the review player and I can't find the things I am told to use.
  - Answer: kept: the real review page, a plan's own scene in it with that video's own pins; the narration names the timeline's chapters and the comment bar, which are pinned, and drawing is Mark

- N13 · scene 17 · "a full-screen page in 340 px", "room to scroll; one Send", "Waiting at 3:26 for question 2", "Save": the cards are cut off at the top, and I can't see the "More" on a card or "Explain this more" that the narration names. Only the answer bar is visible. I guessed the cards are the answer options for "Where does the guide open from the video?". Why it matters: the frame doesn't show the thing the narration describes.
  - Answer: kept: the picture is the scene's last state (own words typed in the answer bar); the scene shows the whole cards, More open on card A and Explain this more pinned before it

- N14 · scene 18 · "Plays the whole video / Play just the changes", "Trace ▲", "in place": the frame shows the plan text panel, but Terms, the side panel and Ask about this, which the narration describes, are not in it. "Trace" and "Play just the changes" are never explained. I guessed Trace opens the evidence for a case. Why it matters: the picture doesn't match the three things named.
  - Answer: kept: the picture is the scene's last state, the plan text; Terms and Ask about this open in the side panel earlier in the same scene, each pinned

- N15 · scene 19 · "Back to where this was explained", dotted-underlined words (step, cases, interface), "Expected something else?", "Continue Space": the frame is cropped and the question is out of view, so I can't tell what "C" or "only" refer to. "Say how it should work" is a comment box, but the narration doesn't mention it. I guessed the dotted underline means a defined term. Why it matters: the scene should show how a quick check works.
  - Answer: kept: the camera ends on the answers' reasons and Walk me through it, as said; the question and the cards are whole at the scene's start

- N16 · scene 20 · "Step through five stages", "Show it all", "In words", "plan-map.json", "parts.json", "runs/", "the eleven commits it lists": I couldn't follow the guide page's controls or the example's file names. The narration says "diagrams to step through" and the caption "step through" does match that. Why it matters: the frame is mostly text with no way to tell which of it matters.
  - Answer: kept: the guide's real controls; the narration names what matters (every case, the interface, worked examples, diagrams to step through), and 'step through' and 'real values' are pinned

- N17 · scene 21 · "A–D to pick", "Open chip", "PROTOTYPE", "7 of 33 scenes changed", "Watch this part": the narration describes "a faint arrow when paused", but the frame shows a "More in the guide ↓" chip and a ring label. I couldn't see an arrow. A strip above shows other jargon (A–D, Open chip). I guessed the chip is the arrow. Why it matters: I can't tell which thing is the cue.
  - Answer: kept: the arrow is pinned 'a faint arrow' while paused; the picture is the hovered state that follows, its thin ring and 'More in the guide' pinned; the top line is the Open chip's own sentence

- N18 · scene 22 · "same box as a mark": "mark" is never explained (the only "Mark D" was in scene 16's cropped control). I guessed a mark is a drawing or highlight on a frame. Also "Ask / Save" are both buttons and the narration says "leave a note, suggest an edit, or ask". Why it matters: it says comments on the guide share the review's box, without saying what the first box is.
  - Answer: kept: a mark is defined in scene 16 (Mark, on the player's comment bar); the note box is the same box

- N19 · scene 23 · "4 choices still open — they stay questions in the plan", "Do it yourself instead", "Your open session picks this up", "Send your approval": none of these is explained. Does Approve leave four questions unanswered? The narration says "Send" while the button says "Send your approval". I guessed "Do it yourself instead" is the download from scene 25. Why it matters: it is the end of every review.
  - Answer: kept: the real Finish panel; the narration says Approve, Request changes and Send, which are pinned; 'Send your approval' is that button's own label

- N20 · scene 25 · "Claude only" and "who picks it up: the next scene": why is a hosted page Claude only? The glossary says Claude answers there on your own account, but the scene never says why. Also "filed by reel-intake" and "filed by reel record" are opaque: filed where? I guessed a file in the repo's reviews folder. Why it matters: it explains the three routes by name only.
  - Answer: kept: the hosted page is the review page as a link, Claude only (a Claude Artifact); filed means recorded into the plan's reviews/, shown in scene 27

- N21 · scene 26 · "waiting session": how does a session "wait"? And "else: waits for your next session" — I couldn't tell if the review is stored or lost, and where. I guessed it is held in the inbox. Why it matters: it is the delivery guarantee ("exactly once").
  - Answer: kept: the scene says a waiting session is your agent's open session; else, the next session picks it up from the inbox, where it is kept

- N22 · scene 27 · "D-264 … the decision that the guide opens under the video", "components: player", "Status: active; …": the narration gives a real decision as an example of an id but I couldn't see how it connects to this scene's review. "plan-20260928T190542Z" and the walkthrough review are not explained, and what "Chosen / Where / Status" fields do is not said. I guessed each answer you give becomes one entry. Why it matters: the log is the thing the loop keeps.
  - Answer: kept: D-264 is the id of the answer that the guide opens under the video, as the narration says; the entry's fields are the log's own

- N23 · scene 28 · "7 of 33 scenes changed (2m 12s of 6m 3s)" and the row of boxes 1–7: the banner says 33 scenes, but seven boxes are drawn and two are marked (3 and 6). I guessed the seven boxes are an excerpt. "this stage: the revise step" is a chip I could only guess at. Why it matters: the picture and its numbers disagree.
  - Answer: kept: the row of boxes is a picture of a few of the scenes, two lit as the changed ones; the banner is the page's own line

- N24 · scene 30 · "A5, A8, A9, A10", columns "chose / instead of / why / check", "[close]", "videos-that-make-sense's walkthrough: its seven prototype …": the table is shown in full but the ids, the "check" column and the opaque row text are never explained. Why does a fifth choice stop the agent ("the agent stops and asks you")? I guessed A-numbers are choice ids. Why it matters: it is the choices table the walkthrough rests on.
  - Answer: kept: the real choices table; ids are each choice's name, the labels are pinned as said, and the fifth choice is drawn going to plan.md as a question

- N25 · scene 31 · "✗ nothing in the diff carries …", "D-127 — ✓ holds", "7 own decision(s), 62 cited", "scripts/lib/review-scope.mjs": I couldn't read the findings. What does ✗ mean for step 5, and was it answered? The audit says "0 failure(s)", but I don't see the answer. I guessed ✓ means the plan's step is in the code and ✗ means it isn't. Why it matters: it is the whole check shown.
  - Answer: kept: the real findings: ✗ step 5 is the finding, and '0 failure(s)' in the audit is pinned 'every ✗ answered' (its answer is in walkthrough.md)

- N26 · scene 32 · "44 gaps", "74 files, +2,910 -6,604", "Where step 1 sits: the parts it touches", "Watch this moment", "Plan | Built": the narration says "before and after … the real page or a real run", but the frame shows a guide page with chips for parts. I see no before/after and no run. "gaps" is unexplained. Why it matters: the picture doesn't show what is claimed.
  - Answer: fixed: a pin now says the picture is the change itself, the guide page this plan built, running (the plan's change is that page)

- N27 · scene 33 · "10 call(s) pause, in 4 stop beat(s) (one per step)", "A1…D1", "[deviation]", "call": the narration says "choice", while the output says "call", "beat" and "deviation". "10 choices pause, some sharing a pause" is also unclear: how can 10 choices share 4 stops? I guessed one pause covers several choices in a step. Why it matters: the words of the rules differ from the words in the output.
  - Answer: fixed: the chip now says 'a call is a choice: 10 pause, a few to one pause; 4 on the list'

- N28 · scene 34 · "Accept", "Go on (A)", "older videos: a grouped scene instead", "A14 a part its frame doesn't mark: a warning, even when strict": the narration says "A pause shows the choice running, with Accept and Flag", but the frame shows only the list scene, with no Accept. "Go on" is not explained (it appears to be the same as Accept). The row text for A14 is opaque. Why it matters: a pause scene is the walkthrough's main thing and isn't shown.
  - Answer: kept: the picture is the scene's last state, the list; the pause with Accept and Flag on its cards opens the scene

- N29 · scene 35 · "0/16 judged", "Back to the record", "the open question", "a flag: the walkthrough fix step": the narration says "Under it, the guide's Built side shows what changed, with the real runs", but the frame is only the Finish panel; I never see the Built side. "judged" vs "decided" in scene 23 is a change of word. Why it matters: the first sentence has no picture.
  - Answer: kept: the picture is the scene's last state, Finish; the Built side with its real run opens the scene

- N30 · scene 37 · "until its public history leaves them out", "system-video/", "terms-index.json", "the voice": what public history? Who decides to remove old plans from it? And "the voice" being "built again, never committed" is cryptic (the audio). I guessed the repo will rewrite its git history before going public. Why it matters: it changes what I should commit.
  - Answer: kept: the narration says this repo's older plans are the exception until its public history leaves them out; the voice is the narration's audio, rebuilt, as the chip lists

- N31 · scene 38 · "33dd648", "~Install, ~Parts, ~Pipelines", "36 of 43 lines to narrate (about 418 s of speech, ~697 s to make)", "frames to rebuild", "a choice: a new plan": the output is dense, "~Install" and "Pipelines" are never explained, and I don't know what a "line" is. The comment sorting on the card has three kinds, but "a choice" (frame) and "a new plan" (narration) are different. I guessed 33dd648 is a git commit and the "~" sections are the parts of spec.md that changed. Why it matters: it is how this video stays up to date.
  - Answer: kept: the real run of spec-diff, from the commit before this rebuild; the narration says spec-diff names the scenes to rebuild, which the output lists

- N32 · scene 39 · "[rewinds]", "[own-words]", "[lost]", "[misses]", "213 of 221 calls accepted", "a retro is due: 17 plans since the start": every bracketed name is unexplained and the narration says only "like how often you take the recommendation". "Calls" again. I guessed "lost" are words looked up. Why it matters: the claim that reviews teach the tool rests on this output.
  - Answer: kept: the real end of `reel status`; the narration names one line (how often you take the recommendation) and says the memory is worked out from the log and your reviews

- N33 · scene 40 · "reelplanning explain pins its sources": "pins" is not explained, and "this session" as a source is odd. The narration says "every fact from a named source". I guessed pinning fixes which files/logs are read. Also "asks you nothing" vs. the three buttons at the end. Why it matters: it is the whole explainer.
  - Answer: kept: the narration says every fact comes from a named source; the three sources are drawn, and the explainer asks nothing until its end, which offers the three buttons

- N34 · scene 41 · "With more people", "over 300 lines outside tests and docs", "video/pr-12 … never merged", "reel pr-check": the narration says "a big pull request gets its own walkthrough video" but never says how big or what happens to a small one. "With more people" is vague (contributors?). "the maintainer's review is the one that counts" is not explained (as against whose?). I guessed over 300 lines is the threshold. Why it matters: it is the only scene on contributing, and this is where viewers were lost before.
  - Answer: kept: the narration says a big pull request gets its own video and the maintainer's review counts; the threshold is on screen
