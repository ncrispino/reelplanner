---
title: "Explain first: a video of what is going on, before any plan"
format: 1920x1080
duration: 285s
message: "Five steps, three questions. You can ask for an explainer, a video of something that is there (a part of the repo, a transcript or log, a change, a period), with no plan behind it: four kinds, each from sources the agent pins (step 1); question 1, whether the whole source is behind the video (recommended: a guide for a transcript and a change). One command and a folder of its own, a row of its own on the review page (step 2). The same player, and Finish ends with Done, Explain more or Plan this; nothing goes into the decision log (step 3). Plan this starts a plan from what you said (step 4); question 2, how far its video leans on the explainer (recommended: lean on it). Facts from their sources, a fact check, and a transcript kept out of git (step 5); question 3, what goes into git (recommended: its text, never the transcript)."
arc: your words; today every video hangs off a plan; earlier plans (new viewers); three changes; step 1 four kinds, question 1; step 2 ask for one; a check on step 1; step 3 review it; a check on step 2; step 4 plan this, question 2; a check on step 3; step 5 honest, private, question 3; checks on steps 4 and 5; the plan
audience: the repo owner, who asked for a video to explain first and decide on a plan after; knows the system video, the review page, the walkthrough and the plan guide
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-29-explain-first
terms: explainer = a video that explains something that is there (a part of the repo, a transcript or log, a change, a period of time), with no plan behind it and nothing to decide; transcript = the record of a whole session with an agent, or of a run: every message and command in order (Claude Code keeps each session as a file on your machine); pinned = kept as it was when the explainer was made (the commit, and a fingerprint of each file), so the video says only what those sources said; fingerprint = a short code worked out from a file's contents (its hash), which changes if one character changes; source = a file, commit, transcript or log that a scene's facts come from; fact check = a third fresh agent, for a transcript or a change, that reads the narration against the sources and lists each sentence they do not support; Plan this = the Finish button on an explainer that starts a plan from what you said on it; Explain more = the Finish button on an explainer that brings its next version, with the scenes you commented or asked on rebuilt; Done = the Finish button on an explainer that ends it: you know what you wanted; guide = the plan guide's page: the video at the top, and the whole of what it shows behind it (full diffs, real outputs), a click from each moment; masked = cut down so only its first letters show (sk-…REDACTED); check-sources = the build's new check that a quoted line is in its source word for word; sources.json = the explainer's list of its sources, each pinned; explain.md = the explainer's first file: what you asked, in your words, and what it will cover; snapshot = a picture of something as it was at one moment, not kept up to date; decision = a choice recorded in the decision log (decisions.md): each answer to a plan's question, and each choice of the agent's you accepted; turn = one message in a session: yours, or the agent's with the commands it ran; planned = a picture of what this plan would build: it does not exist yet; Explained first = a plan's first line when it started from an explainer, naming it, so its video lists that explainer under Before you watch; draw on a step = mark the step's row with the player's pen, to leave a note on that step; Keep = a new Finish button, only with question 3's option C: it commits the explainer to the repo; library = the review page's list of every video in the repo: the system video, and a row for each plan; lean on = count on the viewer having the explainer to watch, and so not say its content again
terms_check: strict
details_check: strict
before: system#part 3 | the review page, with the review player, the plan-to-video skill, the review server, finish-project
before: system#part 7 | memory, and six rules, with the reel CLI, the plan-to-video skill, the review player
before: 2026-09-26-better-visuals | decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "real thing"
before: 2026-09-27-walkthroughs-that-help | decisions D-222, D-224, D-219, D-221, D-223: does the walkthrough test you?
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "real thing"
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-222, D-224, D-219, D-221, D-223: does the walkthrough test you?
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-200, D-213, D-215: how much does a PR ask of its contributor?; explains "ci"
recap: 2026-09-28-plan-guide | The plan guide: the video first, and a full page behind it…: decisions D-228, D-229, D-230: where does the guide open from the video?; explains "guide"
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-065, D-064, D-082: when a system-video comment asks for the system itself to…
recap: 2026-09-28-videos-that-make-sense | Videos that make sense: fresh eyes before you watch, a way…: decisions D-225, D-226, D-227: what becomes of a fresh-eyes finding nobody has answered?
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-003, D-001: when does the system video update?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decision D-106: where does your memory across repos live?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
---

## Video direction

- YOUR WORDS LEAD: scene 1 is the owner's message as sent (data-artifact).
- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the owner's message (1); the real sizes of the four sources, read from the repo today (5); the session file's real size (21). The command and its row (10), the Finish panel (12), the review and plan.md (14), the check's run (20) and sources.json (21) are mocks, labelled planned; the quoted key line (21) is labelled an example.
- THIS VIDEO FOLLOWS ITS OWN RULES: no stand-ins; a label on its thing; a question that says what is decided; one focal point a scene.
- MOTION LANGUAGE: things are revealed by their own verb (typed, printed, drawn, struck, pinned); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; push-slide UP = a question; crossfade = a branch and the ending.
- FOUR CHAPTERS: explain first (1–4, scene 3 for new viewers only); steps 1 and 2 (5–11); steps 3 and 4 (12–19); step 5 and the plan (20–28).
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question headings data-question, cards data-option, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice. Words this video defines where it first says them: explainer (4), transcript (5), pinned (10), fact check (20); the rest have their meaning in the storyboard's terms.
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.

## Frame 1 — Explain first

- chapter_start: Explain first
- scene: THE OWNER'S MESSAGE (data-artifact), their words as sent, 'explaining first' underlined in coral; on the right, on 'know', 'you asked · Explain first', on 'decide', 'then decide: a plan, or not'; on 'Today', 'today · a plan first, then its video'
- voiceover: "You asked for this: sometimes you just want to know what's going on, in the repo or in a transcript, and then decide whether a plan follows. Today, every video needs a plan first."
- duration: 10.261s
- transition_in: cut
- status: animated
- src: compositions/frames/01-explain-first.html
- type: hook
- blueprint: compose
- layout: screen
- focal: your words, and the ask
- sfx: none

narrativeRole: Explain first.
keyMessage: You asked for this:

## Frame 2 — Today, every video hangs off a plan

- scene: THE REVIEW PAGE'S LIBRARY TODAY, three kinds of row landing on their words (System video · the whole repo; Plan video · a plan, before the code; Walkthrough · the plan, after the code); under 'no video for', four asks, each on its word; on 'chat', 'answered in chat, as text'
- voiceover: "Every video today hangs off something: the system video off the whole repo, and the plan video and the walkthrough off a plan. So what does the review server do? What happened in this session? What does this branch change? What changed since Monday? None of these has a video. The agent answers in chat, in text."
- duration: 16.384s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-today.html
- type: pain_point
- blueprint: compose
- layout: list
- focal: three kinds of row, and four asks with none
- sfx: none

narrativeRole: Today, every video hangs off a plan.
keyMessage: Every video today hangs off something:

## Frame 3 — Earlier plans

- knowledge: new
- scene: FOUR ROWS, ONE LINE EACH, landing on their words: Videos that make sense · fresh eyes, Ask about this; The plan guide · the whole plan behind its video; Walkthroughs that help · a check where there is something to predict; Better visuals · the real thing on screen
- voiceover: "Earlier plans lead here. Videos that make sense added fresh eyes, two fresh agents that look at a video before you do, and Ask about this. The plan guide puts the whole plan behind its video. Walkthroughs that help ask a quick check only where there's something to predict. Better visuals put the real thing on screen."
- duration: 17.173s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-earlier-plans.html
- type: pain_point
- blueprint: compose
- layout: list
- focal: what this builds on
- sfx: none

narrativeRole: Earlier plans.
keyMessage: Earlier plans lead here.

## Frame 4 — What changes

- defines: explainer
- scene: THREE ROWS, each with its steps on the right, landing on their words: 'ask for an explainer · steps 1, 2'; 'review it, then plan it if you want · steps 3, 4'; 'honest and private · step 5'
- voiceover: "Three changes. Steps one and two: you can ask for an explainer, a video of something that's there, with no plan behind it and nothing to decide. Steps three and four: you review it on the same page, and a plan can follow. Step five: it stays honest, every fact from its sources, and private, a transcript kept out of the repo."
- duration: 17.792s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-what-changes.html
- type: product_intro
- blueprint: compose
- layout: list
- focal: the three changes
- sfx: none

narrativeRole: What changes.
keyMessage: Three changes.

## Frame 5 — Step 1: four kinds

- chapter_start: Steps 1 and 2: ask for one
- plan_step: 1
- guide: step-1
- defines: transcript
- scene: A TABLE, ONE ROW A KIND, each row landing on its word: A part · 'explain the review server' · 6 files · 5 decisions · about 3 min; A transcript or log · 'what happened in this session' · 21,562 lines · up to 5 min; A change · 'explain this branch' · 33 files · about 3 min; A period · 'what changed since Monday' · 30 commits · 19 decisions · about 3 min
- voiceover: "Step one: four kinds of explainer. A part of the repo: the review server is six files and five decisions. A transcript or a log, the record of a session or a run: the session building this repo since last Tuesday is over twenty-one thousand lines. A change: a branch of thirty-three files. A period: since Monday, thirty commits and nineteen decisions. Each runs two to five minutes, and shows the real thing: the code, the lines, the diff."
- duration: 23.36s
- transition_in: cut
- status: animated
- src: compositions/frames/05-step-1-four-kinds.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: four kinds, with the real sizes of each
- sfx: none

narrativeRole: Step 1: four kinds.
keyMessage: Step one:

## Frame 6 — Question 1: the whole source behind it

- plan_step: 1
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question one. That session is over twenty-one thousand lines, and its video quotes a dozen. A: no guide; you get the video. B: a guide for a transcript and a change: the whole transcript, organized, or the full diff, a click from each moment. C: a guide for every kind. I recommend B: the two with far more than a video can hold. Is the whole source there to read?"
- duration: 20.331s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/06-q1-whole-source.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q1
- question: Is an explainer's whole source there to read, behind the video?
- question_more: Say you asked 'what happened in this session?' (21,562 lines, of which the video quotes a dozen) and 'explain this branch' (33 files, of which the video opens two).
- option_a: No guide
- option_b: Transcripts and changes
- option_c: Every kind
- option_a_more: Each explainer is its video, with a detail page where one scene needs more. Nothing new to build; you see only what the scenes quote.
- option_b_more: A transcript's explainer gets a guide: every turn, organized, tool calls folded, errors marked, each moment of the video opening its turns. A change's gets its full diff in categories. A part and a period stay a video. Needs the plan guide's builder first.
- option_c_more: B, and a part's guide holds its files whole, a period's its commits and decisions. Two more sections, which repeat what the files and git log already show.
- why_a: The explainer is its video; the rest of the transcript or the diff is not shown.
- why_b: A transcript or a change gets a guide with the whole of it, a click from each moment.
- why_c: Every explainer gets a guide, a part's files and a period's commits included.
- recommended: b
- focal: three options, B recommended
- sfx: none

narrativeRole: Question 1: the whole source behind it.
keyMessage: Question one.

## Frame 7 — If A: the video only

- plan_step: 1
- scene: kicker 'If A'; a transcript slab with two quoted lines, the rest folded as '21,550 lines not shown'
- voiceover: "With A, the session is only the lines its scenes quote."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-branch-q1-a.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- branch: q1=a
- focal: only the quoted lines
- sfx: none

narrativeRole: If A: the video only.
keyMessage: With A, the session is only the lines its scenes quote.

## Frame 8 — If B: a guide for a transcript and a change

- plan_step: 1
- scene: kicker 'If B · an example'; left the video's moment 'scene 4 · the tests fail' with 'open turns 212–240 →'; right the guide's turns 212–240, a line drawn from one to the other
- voiceover: "With B, each moment of the session's video opens its turns on the guide."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-branch-q1-b.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q1=b
- focal: a moment opens its turns
- sfx: none

narrativeRole: If B: a guide for a transcript and a change.
keyMessage: With B, each moment of the session's video opens its turns on the guide.

## Frame 9 — If C: a guide for every kind

- plan_step: 1
- scene: kicker 'If C'; two tiles landing on their words: a part · its 6 files, whole; a period · its 30 commits; under them 'and B's two: a transcript, a change'
- voiceover: "With C, a part's guide also holds its files, and a period's its commits."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-branch-q1-c.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q1=c
- focal: four guides
- sfx: none

narrativeRole: If C: a guide for every kind.
keyMessage: With C, a part's guide also holds its files, and a period's its commits.

## Frame 10 — Step 2: ask for one

- plan_step: 2
- guide: step-2
- defines: pinned
- scene: YOUR WORDS in a bubble 'explain the review server'; the command typed and its line printed (planned): the folder, 'part · 6 files, 5 decisions · pinned at dee5830', 'pinned' pinned on it; then the review page's new row (planned): Explainer · the review server · 3:10 · explained at dee5830 · 12 commits since
- voiceover: "Step two: you ask in your own words, and the agent runs one command. It gathers the sources and pins them: the commit, and each file as it was, so the video can say only what they say. It isn't rebuilt on its own; ask again for a new one. The explainer gets a folder of its own, and a row of its own on the review page, which says how many commits have landed since."
- duration: 20.288s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/10-step-2-ask.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: one command, the sources pinned, a row of its own
- sfx: none

narrativeRole: Step 2: ask for one.
keyMessage: Step two:

## Frame 11 — Quick check: last night's run

- plan_step: 1
- scene: THE CASE ON A LINE ABOVE; the heading and three cards land, still
- voiceover: "Quick check. You ask: why did last night's CI run fail? What does the explainer read?"
- duration: 4.757s
- transition_in: cut
- status: animated
- src: compositions/frames/11-qc-last-nights-run.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: You ask: why did last night's CI run fail? What does the explainer read?
- option_a: The run's log
- option_b: The branch's diff
- option_c: Every commit since yesterday
- answer: a
- explain: A run that failed is the transcript-or-log kind: its log is the record of what ran, in order, and where it stopped.
- walk_me_through: A CI run is something that happened, like a session, so it is the transcript-or-log kind. Its record is the run's log: what ran, in order, and where it stopped. So the explainer reads the log, and the commit it ran on.
- option_a_why: Right: a run that failed is the transcript-or-log kind, and its log is the record of what ran.
- option_b_why: The diff says what the code changed, not what the run did or where it stopped.
- option_c_why: That is a period; the question is about one run.
- explained_at: 5
- focal: three predictions
- sfx: none

narrativeRole: Quick check: last night's run.
keyMessage: Quick check.

## Frame 12 — Step 3: review it

- chapter_start: Steps 3 and 4: review it, then plan it
- plan_step: 3
- guide: step-3
- scene: LEFT, THE FINISH PANEL (planned): 'Approve · Request changes' struck through on 'in place of', 'for an explainer, instead:', then three buttons landing on their words, each with its line: Done · you know enough; Explain more · its next version; Plan this · a plan starts. RIGHT, what it files: reviews/ · filed; your memory · what you watched; the decision log · nothing, 'nothing' underlined in coral
- voiceover: "Step three: you review it on the same page, with marks, comments and Ask about this, and a quick check only where there's something to predict. It asks nothing to decide, so in place of Approve and Request changes, Finish has three ends: Done; Explain more, which rebuilds the scenes you asked about; or Plan this. The review is filed, and your memory learns what you watched. The decision log gets nothing: only an answer is a decision."
- duration: 22.101s
- transition_in: cut
- status: animated
- src: compositions/frames/12-step-3-review.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: Finish's three ends, and nothing in the decision log
- sfx: none

narrativeRole: Step 3: review it.
keyMessage: Step three:

## Frame 13 — Quick check: seven commits later

- plan_step: 2
- scene: THE CASE ON A LINE ABOVE; the heading and three cards land, still
- voiceover: "Quick check. On Monday you ask about the review server; by Friday, seven commits have changed it. What plays on Friday?"
- duration: 6.72s
- transition_in: cut
- status: animated
- src: compositions/frames/13-qc-seven-commits.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: On Monday you ask about the review server; by Friday, seven commits have changed it. What plays on Friday?
- option_a: Monday's video, “7 commits since”
- option_b: A video rebuilt from Friday's code
- option_c: Nothing: it is out of date
- answer: a
- explain: Its sources were pinned when it was made, so it plays as it was built, and its row says how many commits have landed since.
- walk_me_through: The explainer pinned Monday's sources: the commit, and each file as it was. So on Friday it plays Monday's video, unchanged. Its row says seven commits have landed since; ask again for Friday's.
- option_a_why: Right: its sources were pinned on Monday, so it plays as it was built, and the row says how far the repo has moved.
- option_b_why: Nothing rebuilds it on its own: it says only what its pinned sources said.
- option_c_why: It stays in the library; the row only says how many commits have landed since.
- explained_at: 10
- focal: three predictions
- sfx: none

narrativeRole: Quick check: seven commits later.
keyMessage: Quick check.

## Frame 14 — Step 4: Plan this

- plan_step: 4
- guide: step-4
- scene: LEFT, THE EXPLAINER'S REVIEW (planned): reviews/explainer-<time>.md, 'Comments by scene: scene 4 · make a waiting review easy to see', 'Questions you asked: why does Send twice start one run?'; a line drawn to the RIGHT, plan.md (planned): 'Explained first: 2026-09-29-review-server' with '→ its video's Before you watch' under it, '## The problem', the comment and the question quoted
- voiceover: "Step four: Plan this. The agent writes a plan from what you said: your comments by scene and your questions, quoted in the plan's problem section, under a first line naming the explainer. From there it's an ordinary plan, with its review and its decisions, and its video lists the explainer under Before you watch."
- duration: 17.152s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-step-4-plan-this.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: your words become the plan's problem
- sfx: none

narrativeRole: Step 4: Plan this.
keyMessage: Step four:

## Frame 15 — Question 2: how far the plan leans on it

- plan_step: 4
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question two: how much does the plan's video say again? A: it leans on the explainer, with two lines for a new viewer. B: a recap chapter, about forty seconds of the explainer's scenes. C: it stands alone and explains it all again, about a minute. I recommend A: you just watched it. How far does it lean?"
- duration: 17.173s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/15-q2-lean-on-it.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q2
- question: After Plan this, how far does the plan lean on the explainer?
- question_more: Say you watched the review server's explainer and pressed Plan this. How much does the new plan's video say again of what the explainer said?
- option_a: Lean on it
- option_b: A recap chapter
- option_c: Stand alone
- option_a_more: The plan's video lists the explainer first under Before you watch, and one scene for new viewers says it in two lines; the video starts at what changes. A teammate who skips the explainer gets two lines.
- option_b_more: The explainer's key scenes, cut down to about 40 seconds, open the plan's video. 40 seconds more, of what you just watched.
- option_c_more: The plan's video explains the server from scratch, as a plan video does today. About a minute said twice.
- why_a: The plan's video starts at what changes; the explainer is under Before you watch, with two lines for new viewers.
- why_b: About 40 seconds of the explainer's scenes open the plan's video.
- why_c: The plan's video explains it all again, about a minute.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 2: how far the plan leans on it.
keyMessage: Question two:

## Frame 16 — If A: lean on it

- plan_step: 4
- scene: kicker 'If A'; Before you watch with the explainer (3:10) first and 'new viewers: 2 lines'; a line to the plan video's first chapter 'What changes'
- voiceover: "With A, the plan's video starts at what changes."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-branch-q2-a.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q2=a
- focal: starts at what changes
- sfx: none

narrativeRole: If A: lean on it.
keyMessage: With A, the plan's video starts at what changes.

## Frame 17 — If B: a recap chapter

- plan_step: 4
- scene: kicker 'If B'; the plan video's chapters: 'Recap · 0:40' (the explainer's scenes), then 'What changes'
- voiceover: "With B, its first forty seconds are the explainer's scenes, cut down."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-branch-q2-b.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q2=b
- focal: 40 seconds of its scenes first
- sfx: none

narrativeRole: If B: a recap chapter.
keyMessage: With B, its first forty seconds are the explainer's scenes, cut down.

## Frame 18 — If C: stand alone

- plan_step: 4
- scene: kicker 'If C'; the plan video's chapters: 'The review server · 1:00' (explained again), then 'What changes'
- voiceover: "With C, a minute of the plan's video explains the server again."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-branch-q2-c.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q2=c
- focal: a minute said twice
- sfx: none

narrativeRole: If C: stand alone.
keyMessage: With C, a minute of the plan's video explains the server again.

## Frame 19 — Quick check: a comment, then Done

- plan_step: 3
- scene: THE CASE ON A LINE ABOVE; the heading and three cards land, still
- voiceover: "Quick check. You comment on a branch's explainer, this looks wrong, and press Done. What goes into the decision log?"
- duration: 5.867s
- transition_in: cut
- status: animated
- src: compositions/frames/19-qc-this-looks-wrong.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: You comment “this looks wrong” on a branch's explainer and press Done. What goes into the decision log?
- option_a: Nothing
- option_b: One entry, for the comment
- option_c: A question for the next plan
- answer: a
- explain: Only an answer is a decision, and an explainer asks none: the comment is filed with the review, and the decision log gets nothing.
- walk_me_through: An explainer asks nothing to decide, so there is no answer to log. Your comment is filed with the review, and Done starts nothing more. So the decision log is as it was.
- option_a_why: Right: only an answer is a decision, and an explainer asks none; the comment is filed with the review.
- option_b_why: A comment is not an answer; it is kept with the review.
- option_c_why: Done starts nothing more; Plan this would take your comment into a plan.
- explained_at: 12
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a comment, then Done.
keyMessage: Quick check.

## Frame 20 — Step 5: honest

- chapter_start: Step 5: honest and private
- plan_step: 5
- guide: step-5
- defines: fact check
- scene: (planned) A STORYBOARD scene with its '- source: scripts/lib/inbox.mjs:50-80' line, 'where its facts come from: lines 50–80' pinned under it; the check's run typed and printed: '✗ fails · scene 5 · quoted line not in its source', '△ warns · scene 3 · "three times": no source'. Then fresh eyes, three names in a row on their words: newcomer, designer, 'fact check: a third agent' in coral with 'reads the narration against the sources'
- voiceover: "Step five: honest. Each scene names where its facts come from, and a new check fails a quoted line its source doesn't hold word for word. Fresh eyes look at it, as at every video. For a transcript or a change, a third fresh agent, the fact check, reads the narration against the sources, since the agent that did the work is the worst judge of it."
- duration: 19.2s
- transition_in: cut
- status: animated
- src: compositions/frames/20-step-5-honest.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: a source on every fact, and a third fresh agent
- sfx: none

narrativeRole: Step 5: honest.
keyMessage: Step five:

## Frame 21 — Step 5: private

- plan_step: 5
- scene: LEFT 'on your machine': the session file's path, '21,562 lines · 101 MB'. RIGHT 'in the repo' (planned): sources.json with its path, line count and hash, 'fingerprint' pinned on the hash. BELOW, an example quoted line 'OPENAI_API_KEY=sk-proj-…' ringed on 'key', 'the build stops' on 'stops', then the masked line 'sk-…REDACTED' on 'masked'
- voiceover: "And private. A transcript is read where it is, and never copied into the repo: the folder keeps its path and a fingerprint of it. A quoted line that looks like a key or a password, or holds an email address, stops the build until it's masked."
- duration: 13.333s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/21-step-5-private.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the transcript stays on your machine; a key stops the build
- sfx: none

narrativeRole: Step 5: private.
keyMessage: And private.

## Frame 22 — Question 3: what goes into git

- plan_step: 5
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question three. The session's explainer quotes twelve lines of over twenty-one thousand. A: its text goes into git, those twelve lines included, never the transcript. B: the whole transcript too, for a teammate to read. C: nothing, until you press a new Keep button, or Plan this. I recommend A: it's committed and shared like a plan's video, and the transcript stays yours. What goes into git?"
- duration: 21.269s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/22-q3-into-git.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q3
- question: What of an explainer goes into git?
- question_more: Say the session's explainer quotes 12 lines of a 21,562-line transcript. The repo is shared with the people who work on it.
- option_a: Its text, never the transcript
- option_b: The transcript too
- option_c: Nothing, until kept
- option_a_more: explain.md, sources.json (paths and fingerprints), the storyboard, script and scenes, so the 12 quoted lines, checked for keys, and the reviews: kept as a plan's video is. The transcript stays on your machine.
- option_b_more: The transcript, organized, is committed beside the explainer, so a teammate can read the whole session. Everything said in it stays in the repo's history.
- option_c_more: The explainer's folder is left out of git; a new Finish button, Keep, or Plan this, commits it. An explainer you pressed Done on lives on one machine.
- why_a: The explainer's text is committed, with its 12 quoted lines; the transcript never is.
- why_b: All 21,562 lines are committed, for a teammate to read.
- why_c: Nothing is committed until you keep the explainer or plan from it.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 3: what goes into git.
keyMessage: Question three.

## Frame 23 — If A: its text

- plan_step: 5
- scene: kicker 'If A'; left 'in the repo': explain.md, sources.json, the scenes, 12 quoted lines; right 'on your machine': the transcript, 21,562 lines
- voiceover: "With A, the repo holds the explainer and twelve lines; the transcript stays on your machine."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-branch-q3-a.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q3=a
- focal: 12 lines in the repo, the rest on your machine
- sfx: none

narrativeRole: If A: its text.
keyMessage: With A, the repo holds the explainer and twelve lines; the transcript stays on your machine.

## Frame 24 — If B: the whole transcript

- plan_step: 5
- scene: kicker 'If B'; 'in the repo': the explainer, and the transcript, 21,562 lines
- voiceover: "With B, every line of the session is in the repo's history."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-branch-q3-b.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q3=b
- focal: every line in the history
- sfx: none

narrativeRole: If B: the whole transcript.
keyMessage: With B, every line of the session is in the repo's history.

## Frame 25 — If C: nothing until kept

- plan_step: 5
- scene: kicker 'If C'; 'in the repo': nothing yet; 'Keep · Plan this' commits it
- voiceover: "With C, an explainer you press Done on stays on one machine."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-branch-q3-c.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q3=c
- focal: one machine
- sfx: none

narrativeRole: If C: nothing until kept.
keyMessage: With C, an explainer you press Done on stays on one machine.

## Frame 26 — Quick check: a question, then Plan this

- plan_step: 4
- scene: THE CASE ON A LINE ABOVE; the heading and three cards land, still
- voiceover: "Quick check. You asked one question with Ask about this, left two comments, and press Plan this. Where does the question go?"
- duration: 6.699s
- transition_in: cut
- status: animated
- src: compositions/frames/26-qc-one-question.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: You asked one question with Ask about this, left two comments, and press Plan this. Where does the question go?
- option_a: Quoted in the new plan's problem
- option_b: Into the decision log
- option_c: Nowhere: the page answered it
- answer: a
- explain: Plan this writes the plan from what you said: your comments by scene and your questions, quoted in its problem.
- walk_me_through: Plan this starts a plan from what you said on the explainer. The two comments and the one question, answered or not, are quoted in the new plan's problem. A question is not an answer, so the decision log does not change.
- option_a_why: Right: Plan this quotes your comments and your questions in the plan's problem.
- option_b_why: A question is not an answer; the decision log does not change.
- option_c_why: Answered or not, it is quoted in the plan, with its answer.
- explained_at: 14
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a question, then Plan this.
keyMessage: Quick check.

## Frame 27 — Quick check: an access key in a log

- plan_step: 5
- scene: THE CASE ON A LINE ABOVE; the heading and three cards land, still
- voiceover: "Last check. A CI log's explainer quotes a line holding a GitHub access key. What does the build do?"
- duration: 6.101s
- transition_in: cut
- status: animated
- src: compositions/frames/27-qc-an-access-key.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: A CI log's explainer quotes a line holding a GitHub access key. What does the build do?
- option_a: Stops until it is masked
- option_b: Blurs it on the scene
- option_c: Goes on: git keeps it safe
- answer: a
- explain: A quoted line that looks like a key stops the build until it is masked.
- walk_me_through: A quoted line that looks like a key or a password stops the build, whichever kind of explainer quotes it. The agent masks it, so only its first letters show, and builds again. Nothing is blurred, and nothing goes on as it was.
- option_a_why: Right: a quoted line that looks like a key stops the build, whichever kind of explainer it is in.
- option_b_why: Nothing is blurred: the line itself would still be in the scene's text, and in git.
- option_c_why: Git keeps it for good, which is why the build stops first.
- explained_at: 21
- focal: three predictions
- sfx: none

narrativeRole: Quick check: an access key in a log.
keyMessage: Last check.

## Frame 28 — The plan

- guide: decisions
- scene: THE FIVE STEPS, still, each with its question's slot where it has one: 1 'four kinds' (question 1); 2 'ask for one'; 3 'review it'; 4 'Plan this' (question 2); 5 'honest and private' (question 3); 'draw on a step to leave a note · or approve'. Holds still.
- voiceover: "That's the plan: four kinds of explainer, asked for in your own words, reviewed on the same page, a plan when you want one, and honest and private. Draw on any step to leave a note, or approve."
- duration: 12s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- plan_questions: 1, 2, 3
- focal: the five steps, and your answers
- sfx: none

narrativeRole: The plan.
keyMessage: That's the plan:
