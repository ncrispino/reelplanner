---
title: "The plan guide: the video first, and a full page behind it you can read, check and edit"
format: 1920x1080
duration: 280s
message: "Five steps, four questions. The video stays the first place to go; behind it, the guide: a page for each plan, built from plan.md, holding every step's cases, interface, example and decisions, where things happen as you scroll (step 1; question 1, which is the source: recommended plan.md). Step 2: four short blocks a step, and reel check fails a step without them. Step 3: a scene points at its section and a section plays its scene; question 2, where it opens (recommended its own page). Step 4: a note on any line, or a suggested edit the agent applies exactly and the decision log keeps; question 3 (recommended). Step 5: a Built side after the build, and the cost; question 4, how much guide (recommended every plan, with Built)."
arc: your words; the reviews (explain this more); today; what changes; beside videos-that-make-sense; step 1 the guide (the prototype), as you scroll, question 1; step 2 complete and checked; a check on step 1; step 3 each points at the other, question 2; a check on step 2; step 4 edit, question 3; a check on step 3; step 5 Built and the cost, question 4; checks on steps 4 and 5; the plan
audience: the repo owner, who asked for a full HTML plan behind the video, to see exactly what happens in each case and edit it; knows the system video, the review page and the walkthrough
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-28-plan-guide
terms: reviews/<id>.md = the short file reel record writes for each review you send: what to act on, step by step; walkthrough.md = the written report of a build: what landed in each step, and each choice the agent made on its own, and the walkthrough video is made from it; plan.md = the plan's own text, a file in its folder that every command reads; decisions.md = the file that holds the decision log; guide = a page for each plan, built from its plan.md: a short scroll story where the whole page changes, then the whole plan (every step's cases, interface, example and decisions), each detail one click down; case = one kind of input or situation a step handles, one row of its cases table, with a real example and what happens; interface = what someone or something else uses: a command with its flags and output, a file with its fields, a function, what a page shows; suggested edit = a change you make in place on the guide (a word, a cell, a flag), which the agent puts into plan.md exactly as you wrote it; Built side = a guide section's other half after the build: what landed, and the interface as built beside the planned one; tokens = the units a model reads and writes, what an agent's run is paid in; fresh eyes = two fresh agents that look at a video before you do, given only what a viewer gets (the videos-that-make-sense plan); Ask about this = the videos-that-make-sense plan's question box: paused on a scene, you type a question and get an answer from the plan; source = the one file the others are made from, the one you change
terms_check: strict
details_check: strict
before: 2026-09-28-videos-that-make-sense | decisions D-225, D-226, D-227: fresh eyes before you watch, meanings to click and Ask about this
before: system#part 3 | the review page, with the review player, finish-project, the revise step, the implement step
before: system#part 7 | memory, and six rules, with the reel CLI, the plan-to-video skill, the revise step, the implement step, the review player
before: 2026-09-26-better-visuals | decisions D-167, D-142, D-166: which look should the review page take?; explains "real thing"
before: 2026-09-27-details-in-the-frame | decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-28-videos-that-make-sense | Videos that make sense: fresh eyes before you watch, a way to ask, frames back to basics: decisions D-225, D-226, D-227: two fresh agents, a newcomer and a designer, look at each video first and every finding is answered; a phrase gets a meaning to click, and Ask about this answers a question on any scene
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-167, D-142, D-166: which look should the review page take?; explains "real thing"
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decisions D-024, D-022, D-023: how is each detail page made?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-003, D-001, D-002: when does the system video update?
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-168, D-169, D-170: do the text-only and HTML arms go all the way to a…
recap: 2026-09-23-deep-dives--walkthrough | Deep dives: the video opens into HTML where a video falls…: decisions D-063, D-062: beside the stage when that costs it under 15 % of its…
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-224, D-219: how do the plan and what was built sit together?
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-213, D-215: where does a PR's built video live?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-065, D-064: when a system-video comment asks for the system itself to…
recap: 2026-09-27-details-in-the-frame--walkthrough | Details in the frame: click the thing a detail explains: decision D-208: every way in opens the page over the frame, the chip's and…
---

## Video direction

- THE OWNER'S WORDS LEAD: scene 1 is their message, the three phrases that ask for more than a video underlined.
- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the owner's words (1); the guide prototype this plan comes with, as a browser shows it (6, 7, the right of 14, 20); plan.md's own cases block (12). The reel check run (12), the review page's plan text (left of 14) and the Built side (26) are labelled planned; the rest explain with pictures.
- THE VIDEO POINTS INTO THE GUIDE: scene 6 marks the prototype data-detail="guide", so a click opens it over the frame, as the guide's own step 3 proposes (more on the guide).
- THIS VIDEO FOLLOWS THE FRAME RULES OF THE PLAN BEFORE IT: no stand-ins (every box holds its words); a label on its thing; a question that says what is decided; one focal point a scene; nothing covers content.
- MOTION LANGUAGE: things are revealed by their own verb (typed, drawn, ringed, struck, pinned); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; push-slide UP = a question; crossfade = a branch and the ending.
- FOUR CHAPTERS: why a page too (1–5, scene 3 for new viewers only); steps 1 and 2 (6–13); steps 3 and 4 (14–25); step 5 and the plan (26–33).
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question headings data-question, cards data-option, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice, label. Words this video defines where it first says them: guide (4); the rest have their meaning in the storyboard's terms.
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.

## Frame 1 — You asked for more than a video

- chapter_start: Why a page too
- scene: THE OWNER'S WORDS (data-artifact, their message), three excerpts landing on their words, the key words underlined in coral: '3 classes of changes … what would happen in each, what the interface is'; 'less of a guarantee and too many open questions if just video is used'; 'more deterministic changes … more in control'
- voiceover: "You said the video should stay the first place to go. But say a step has three classes of change: what happens in each, and what's the interface? A video can't hold all of that, so you're left with open questions, and less of a say."
- duration: 12.416s
- transition_in: cut
- status: animated
- src: compositions/frames/01-more-than-a-video.html
- type: hook
- blueprint: compose
- layout: quote
- focal: you asked for more than a video
- sfx: none

narrativeRole: You asked for more than a video.
keyMessage: You said the video should stay the first place to go.

## Frame 2 — Explain this more

- scene: LEFT: two bars, 'plan.md · 3,102 words' full, 'its video · 1,058 words' a third, the last plan's; RIGHT: '7 × explain this more · 4 plans' then three of the owner's lines, each with its plan
- voiceover: "The reviews show it. Seven times, you answered a question with explain this more, instead of a choice, and four plans were reviewed three or four times. The last plan was three thousand words; its video said a thousand. The rest had nowhere to go."
- duration: 13.653s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-explain-this-more.html
- type: pain_point
- blueprint: compose
- layout: two-column
- focal: explain this more
- sfx: none

narrativeRole: Explain this more.
keyMessage: The reviews show it.

## Frame 3 — What there is today

- knowledge: new
- scene: THREE ROWS, each a thing and what it holds: plan.md · the whole plan, as text; the plan text · the same words, beside the video; a detail page · one page, for one scene ('2 in the last 7 videos')
- voiceover: "Today, plan.md holds the whole plan, as text, and the plan text beside the video shows the same words. A detail page opens over one scene; the last seven videos opened two."
- duration: 11.243s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-today.html
- type: pain_point
- blueprint: compose
- layout: list
- focal: what there is today
- sfx: none

narrativeRole: What there is today.
keyMessage: Today, plan.md holds the whole plan, as text, and the plan text beside the video shows the same words.

## Frame 4 — What changes

- defines: guide
- scene: FOUR ROWS with their steps on the right: 'The guide, complete and checked · steps 1, 2'; 'The video and the guide, linked · step 3'; 'Edits on the guide · step 4'; 'After the build, and which plans · step 5'
- voiceover: "So, a page behind the video: the guide, which holds the whole plan, and where things happen as you scroll. Steps one and two: a guide for each plan, complete and checked. Step three: the video and the guide point at each other. Step four: you edit the plan on the guide. Step five: after the build, and which plans get one."
- duration: 17.493s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-what-changes.html
- type: product_intro
- blueprint: compose
- layout: list
- focal: what changes
- sfx: none

narrativeRole: What changes.
keyMessage: So, a page behind the video: the guide, which holds the whole plan, and where things happen as you scroll.

## Frame 5 — Beside videos that make sense

- scene: TWO COLUMNS joined by three arrows: left, the videos-that-make-sense plan's parts (two fresh agents; Ask about this; meanings to click); right, what each does with the guide (read it too; answers link into it; the same on both); under them 'neither plan needs the other'
- voiceover: "It works beside the plan before it, videos that make sense, now approved. Its two fresh agents read the guide too, and its Ask about this box answers with a link into the guide. A meaning you can click is the same on both. Neither plan needs the other."
- duration: 14.293s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-beside-videos-that-make-sense.html
- type: product_intro
- blueprint: compose
- layout: wall
- focal: beside videos that make sense
- sfx: none

narrativeRole: Beside videos that make sense.
keyMessage: It works beside the plan before it, videos that make sense, now approved.

## Frame 6 — Step 1: the guide

- chapter_start: Steps 1 and 2: the guide
- plan_step: 1
- scene: THE REAL THING (data-artifact, the guide prototype at step 1, as a browser shows it: the outline, the step's text, its picture), large; on 'the whole plan' the four layers named on the left one by one, and the step's line of layers (3 cases · interface · example · 8 decisions · question 1) ringed; on 'built from plan.md' the picture's plan.md → guide edge ringed with 'built from plan.md' pinned; the page marked data-detail='guide'
- voiceover: "Step one: the guide isn't the video replayed. The video tells the story. The guide opens with a short one, then holds the whole plan: every case, interface, example and decision, in layers you open. It's built from plan.md each time the video is built. Click the page to try this plan's guide, a prototype."
- duration: 18.24s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-1-the-guide.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- detail: guide
- detail_title: This plan's guide, a prototype
- detail_why: Click the page to scroll this plan's own guide: a rough prototype, written by hand.
- detail_kind: try
- focal: step 1: the guide
- sfx: none

narrativeRole: Step 1: the guide.
keyMessage: Step one: the guide isn't the video replayed.

## Frame 7 — Step 1: every detail, a click down

- plan_step: 1
- guide: step-1
- scene: BEFORE AND AFTER, the real prototype: left, step 4's cases table, each row with its Trace button (ringed); right, the second case's trace opened in place under its row (you write, sent, filed, then); pins 'a trace a case' and 'opened in place'
- voiceover: "As you scroll, the story at the top changes a picture at a time. Then each step has its section, with a picture that reacts. Each case has its trace, the example step by step, and it opens in place, right under its row. Nothing is only in the motion: Expand all opens every layer at once."
- duration: 16.427s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-step-1-as-you-scroll.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: step 1: every detail, a click down
- sfx: none

narrativeRole: Step 1: every detail, a click down.
keyMessage: As you scroll, the story at the top changes a picture at a time.

## Frame 8 — Question 1: which is the source

- plan_step: 1
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question one. Say step three needs its three cases. A: they go in plan.md, and the guide is built from it; every command that reads plan.md today keeps working. B: the agent writes the guide by hand, and plan.md is taken from it: any page, at twice the time. C: both, kept the same by a check. I recommend A. Which is the source?"
- duration: 20.309s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/08-q1-the-source.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q1
- question: Which is the source: plan.md, or the guide?
- question_more: Say you want step 3 of a plan to show its three cases.
- option_a: plan.md; the guide is built from it
- option_b: The guide; plan.md is taken from it
- option_c: Both, kept the same by a check
- option_a_more: The agent writes a cases table under step 3 in plan.md, and the build draws it. Every tool that reads plan.md keeps working; git shows the change as text.
- option_b_more: The agent writes the guide's HTML by hand and plan.md is extracted from it. Any page is possible; each guide takes about twice the time, and a change is an HTML diff.
- option_c_more: Both are written separately, and a check says when they differ. Two sources to keep in step; the check cannot say which is right.
- why_a: One source; the page is a way to read it.
- why_b: Any page is possible, at twice the agent's time and a hard diff.
- why_c: Two sources, and a check that only finds they differ.
- recommended: a
- focal: question 1: which is the source
- sfx: none

narrativeRole: Question 1: which is the source.
keyMessage: Question one.

## Frame 9 — If A: plan.md

- plan_step: 1
- scene: kicker 'If A'; plan.md → the guide, one arrow
- voiceover: "With A, the cases are a table in plan.md, and the build draws them."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-branch-q1-a.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q1=a
- focal: if a: plan.md
- sfx: none

narrativeRole: If A: plan.md.
keyMessage: With A, the cases are a table in plan.md, and the build draws them.

## Frame 10 — If B: the guide

- plan_step: 1
- scene: kicker 'If B'; the guide → plan.md, the arrow reversed
- voiceover: "With B, the guide is the file you review, and plan.md follows it."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-branch-q1-b.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q1=b
- focal: if b: the guide
- sfx: none

narrativeRole: If B: the guide.
keyMessage: With B, the guide is the file you review, and plan.md follows it.

## Frame 11 — If C: both

- plan_step: 1
- scene: kicker 'If C'; plan.md and the guide side by side, a check between them
- voiceover: "With C, both are written, and the check says when they differ."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-branch-q1-c.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q1=c
- focal: if c: both
- sfx: none

narrativeRole: If C: both.
keyMessage: With C, both are written, and the check says when they differ.

## Frame 12 — Step 2: complete, and checked

- plan_step: 2
- guide: step-2
- scene: LEFT, THE REAL THING (data-artifact, plan.md, step 4's Cases block, as written): the table's rows typed; the four block names pinned as it is said; RIGHT, planned: `reel check` printing '✗ step 3: no cases' and the 'No interface: wording only' line, then `reelplanning guide --check` listing a gap ('△ step 3 · case 2: no trace') and failing '✗ case 2: only in the animation'
- voiceover: "Step two: complete, and checked. Each step in plan.md gets four blocks: its cases, each with its trace, step by step; its interface, every flag and field with a one-line meaning; one worked example; and its decisions, which the guide works out. reel check fails a step with no cases, or no interface and no line like: no interface, wording only. The guide's own check lists what's missing, like a case with no trace, and fails on a detail you can't open, or one only in an animation."
- duration: 29.413s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-step-2-complete.html
- type: feature_showcase
- blueprint: compose
- layout: code
- focal: step 2: complete, and checked
- sfx: none

narrativeRole: Step 2: complete, and checked.
keyMessage: Step two: complete, and checked.

## Frame 13 — Quick check: step 2 rewritten

- plan_step: 1
- scene: THE HEADING AND THREE CARDS land, still
- voiceover: "Quick check. The agent rewrites step two in plan.md and runs the build. What does the guide show?"
- duration: 5.76s
- transition_in: cut
- status: animated
- src: compositions/frames/13-qc-step-2-rewritten.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: After this ships, the agent rewrites step 2 in plan.md and runs the build. What does the guide show?
- option_a: The new step 2
- option_b: The old one, until the guide is edited by hand
- option_c: The old one, until the video is rebuilt
- answer: a
- explain: The guide is built from plan.md on every build, so it shows whatever plan.md says now.
- walk_me_through: The agent changed plan.md, and the build ran. The build makes the guide from plan.md each time, all of it. So the guide shows the new step 2; nobody edits the guide by hand.
- option_a_why: Right: the build makes the guide from plan.md each time.
- option_b_why: Nobody edits the guide by hand: it is built, never written.
- option_c_why: The guide does not wait on the video; it is rebuilt with every build.
- explained_at: 6
- focal: quick check: step 2 rewritten
- sfx: none

narrativeRole: Quick check: step 2 rewritten.
keyMessage: Quick check.

## Frame 14 — Step 3: each points at the other

- chapter_start: Steps 3 and 4: point and edit
- plan_step: 3
- guide: step-3
- scene: TWO PANELS joined by an arrow: left, planned, the review page's plan text column with 'More on the guide · Step 3'; right, THE REAL THING (data-artifact, the prototype's step 3 section) with its 'Watch this part 2:40' button ringed and 'plays its first scene' pinned; under, the review page's row 'Plan | Built | Guide', 'Guide' typed on
- voiceover: "Step three: the video and the guide point at each other. At each scene, more on the guide opens its step's part of the guide. Each part has watch this part, which plays its first scene. And each plan's row on the review page gets Guide, beside Plan and Built."
- duration: 14.485s
- transition_in: cut
- status: animated
- src: compositions/frames/14-step-3-both-ways.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: step 3: each points at the other
- sfx: none

narrativeRole: Step 3: each points at the other.
keyMessage: Step three: the video and the guide point at each other.

## Frame 15 — Question 2: where it opens

- plan_step: 3
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question two. You're on step three and want its cases. A: the guide takes the plan text's place beside the video, as narrow as a phone. B: its own page, a click away, and your notes go out with the same Send. C: it grows over the frame, like a detail page. I recommend B: the guide needs the room. Where should it open?"
- duration: 18.069s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/15-q2-where-it-opens.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q2
- question: Where does the guide open from the video?
- question_more: You're on step 3's scene and want its three cases.
- option_a: Beside the video, in the plan text's place
- option_b: Its own page, a click away
- option_c: Over the frame, like a detail
- option_a_more: The Plan switch shows the guide, scrolled to step 3, in the 340 px column beside the video. One place; a page whose picture fills the screen, with its drawers and text view, squeezed into a column as narrow as a phone.
- option_b_more: More on the guide opens it at step 3 and the video pauses; Watch this part brings you back. Your notes on the guide go out with the same Send. Two tabs to move between.
- option_c_more: The guide grows over the paused video and closes back to it, like a detail page. One place; a page made for scrolling, inside the video's box.
- why_a: One place; a full-screen page in a 340 px column.
- why_b: The room a scrolling page needs, and one review to send.
- why_c: One place, inside the video's box.
- recommended: b
- focal: question 2: where it opens
- sfx: none

narrativeRole: Question 2: where it opens.
keyMessage: Question two.

## Frame 16 — If A: beside

- plan_step: 3
- scene: kicker 'If A'; the video with a narrow guide column beside it
- voiceover: "With A, the guide scrolls in the narrow column beside the video."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-branch-q2-a.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=a
- focal: if a: beside
- sfx: none

narrativeRole: If A: beside.
keyMessage: With A, the guide scrolls in the narrow column beside the video.

## Frame 17 — If B: its own page

- plan_step: 3
- scene: kicker 'If B'; two tabs, the review page and the guide, arrows both ways
- voiceover: "With B, the guide opens in its own tab, and watch this part brings you back."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-branch-q2-b.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=b
- focal: if b: its own page
- sfx: none

narrativeRole: If B: its own page.
keyMessage: With B, the guide opens in its own tab, and watch this part brings you back.

## Frame 18 — If C: over the frame

- plan_step: 3
- scene: kicker 'If C'; the guide covering the video's box
- voiceover: "With C, the guide covers the paused video until you close it."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-branch-q2-c.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q2=c
- focal: if c: over the frame
- sfx: none

narrativeRole: If C: over the frame.
keyMessage: With C, the guide covers the paused video until you close it.

## Frame 19 — Quick check: nothing anyone else uses

- plan_step: 2
- scene: THE HEADING AND FOUR CARDS land, still
- voiceover: "Quick check. A step has its cases, and only rewords some help text: no command, file or function. What else does reel check need?"
- duration: 7.616s
- transition_in: cut
- status: animated
- src: compositions/frames/19-qc-no-interface.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: A step has its cases table and only rewords some help text: no command, file or function. What else does reel check need?
- option_a: Nothing more
- option_b: An interface block with a sample command
- option_c: A line: "No interface: wording only"
- option_d: Three more case rows
- answer: c
- explain: A step needs an interface, or a line saying there is none; a made-up interface would be worse than none.
- walk_me_through: The step has its cases, so that rule is met. It has no interface: nothing anyone else uses. So it needs the one line that says so, "No interface: wording only", and then reel check passes.
- option_a_why: reel check fails a step with no interface and no line saying there is none.
- option_b_why: A made-up command would say the step has an interface it doesn't have.
- option_c_why: Right: the line says there is nothing anyone else uses.
- option_d_why: The cases are there already; the missing piece is the interface, or the line.
- explained_at: 12
- focal: quick check: nothing anyone else uses
- sfx: none

narrativeRole: Quick check: nothing anyone else uses.
keyMessage: Quick check.

## Frame 20 — Step 4: edit on the guide

- plan_step: 4
- guide: step-4
- scene: THE REAL THING (data-artifact, the prototype's step 4 interface beat: step 1's command edited, --to, and the review, reviews/<id>.md and decisions.md following), 'your edit' pinned; on the right four rows land on their words: 'an answer · as on the video'; 'a note on any line'; 'a suggested edit · exactly into plan.md'; 'the video · only scenes that show it'
- voiceover: "Step four: you answer, comment and edit right on the guide. Pick an option on a question, and it's answered, as on the video. Click any line to leave a note. Or suggest an edit: here, in step one's command, the option --out becomes --to, in place. The agent puts exactly that into plan.md, the decision log keeps it, and only the scenes that show it are rebuilt."
- duration: 20.693s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/20-step-4-edit.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: step 4: edit on the guide
- sfx: none

narrativeRole: Step 4: edit on the guide.
keyMessage: Step four: you answer, comment and edit right on the guide.

## Frame 21 — Question 3: what an edit does

- plan_step: 4
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question three. You want --out to be --to. A: you write a comment, and the agent rewrites the step as it reads it. B: you change it in place, and exactly that goes into plan.md, checked against the decisions. C: the page on your own machine writes plan.md itself, unchecked. I recommend B. What does an edit do?"
- duration: 19.072s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/21-q3-what-an-edit-does.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q3
- question: What does an edit on the guide do?
- question_more: You want step 1's flag --out to be --to.
- option_a: Comments only
- option_b: Suggested edits, applied exactly
- option_c: Direct edits from the page
- option_a_more: You write "rename --out to --to" on the line; the agent rewrites the step as it reads your comment. Nothing new to build.
- option_b_more: You change --out to --to in the block; the agent puts exactly that into plan.md, and the decision log keeps it. Comments still work. An edit that overturns a decision comes back as a question.
- option_c_more: The local review page writes your change into plan.md itself and commits it. Only on your own machine, and nothing checks it against the decision log first.
- why_a: Nothing new; the words in the plan are the agent's.
- why_b: What you change is what the plan says, checked and kept.
- why_c: Your change lands at once, on your machine only, unchecked.
- recommended: b
- focal: question 3: what an edit does
- sfx: none

narrativeRole: Question 3: what an edit does.
keyMessage: Question three.

## Frame 22 — If A: comments

- plan_step: 4
- scene: kicker 'If A'; a comment on the line, the agent's rewrite under it
- voiceover: "With A, your comment is the instruction; the words are the agent's."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-branch-q3-a.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q3=a
- focal: if a: comments
- sfx: none

narrativeRole: If A: comments.
keyMessage: With A, your comment is the instruction; the words are the agent's.

## Frame 23 — If B: applied exactly

- plan_step: 4
- scene: kicker 'If B'; plan.md with --to, and one decision log entry
- voiceover: "With B, plan.md says --to, as you wrote it, and the log keeps it."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-branch-q3-b.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q3=b
- focal: if b: applied exactly
- sfx: none

narrativeRole: If B: applied exactly.
keyMessage: With B, plan.md says --to, as you wrote it, and the log keeps it.

## Frame 24 — If C: from the page

- plan_step: 4
- scene: kicker 'If C'; a commit from the local page
- voiceover: "With C, the page commits your change, on your own machine only."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-branch-q3-c.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q3=c
- focal: if c: from the page
- sfx: none

narrativeRole: If C: from the page.
keyMessage: With C, the page commits your change, on your own machine only.

## Frame 25 — Quick check: watch this part

- plan_step: 3
- scene: THE HEADING AND THREE CARDS land, still
- voiceover: "Quick check. You're reading step five's section on the guide and press watch this part. What plays?"
- duration: 4.992s
- transition_in: cut
- status: animated
- src: compositions/frames/25-qc-watch-this-part.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: You're reading step 5's section on the guide and press Watch this part. What plays?
- option_a: The video, from its start
- option_b: Step 5's first scene
- option_c: The walkthrough video
- answer: b
- explain: Each section's Watch this part plays its own scene, so step 5's section plays step 5's first scene.
- walk_me_through: You are on step 5's section. Its Watch this part knows the time of step 5's first scene, from the plan map. So the review page opens there and plays step 5.
- option_a_why: It opens at the section's own scene, not the start.
- option_b_why: Right: each section plays its own scene.
- option_c_why: The plan's guide points at the plan video; the Built side is where the walkthrough comes in.
- explained_at: 14
- focal: quick check: watch this part
- sfx: none

narrativeRole: Quick check: watch this part.
keyMessage: Quick check.

## Frame 26 — Step 5: the Built side, and the cost

- chapter_start: Step 5, and the plan
- plan_step: 5
- guide: step-5
- scene: BEFORE AND AFTER, labelled planned: 'Plan' and 'Built' on one section, the interface line as planned and as built, the flag that differs marked; then, on 'the cost', three numbers land: '+1,000 words · a quarter more'; '≈ 10 min'; '≈ 20,000 tokens'
- voiceover: "Step five: after the build, each section gets a Built side: what landed, and the interface as built beside the planned one: both, the difference marked. The cost: this plan's blocks added a thousand words, a quarter more; by our estimate, ten minutes and twenty thousand tokens a plan."
- duration: 15.531s
- transition_in: cut
- status: animated
- src: compositions/frames/26-step-5-built.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: step 5: the built side, and the cost
- sfx: none

narrativeRole: Step 5: the Built side, and the cost.
keyMessage: Step five: after the build, each section gets a Built side: what landed, and the interface as built beside the planned one: both, the difference marked.

## Frame 27 — Question 4: how much guide

- plan_step: 5
- scene: THE QUESTION AND THREE CARDS, still; the recommended card ringed on 'recommend'
- voiceover: "Question four. Say a one-step plan that renames a flag, and a six-step plan. A: both get a guide; after the build, walkthrough.md stays text. B: both, and each section gets its Built side. C: only the big plan. I recommend B: before and after, in one place. How much guide?"
- duration: 16.832s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/27-q4-how-much-guide.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q4
- question: How much guide does each plan get?
- question_more: Say a plan with one step, a flag renamed, and a plan with six steps and three questions.
- option_a: Every plan, the plan side only
- option_b: Every plan, with a Built side
- option_c: Big plans only
- option_a_more: Both plans get a guide; after the build, walkthrough.md stays text. About ten minutes and 20,000 tokens a plan.
- option_b_more: Both get a guide, and after the build each section shows what landed beside what was planned. A's cost, and a few lines a step in walkthrough.md.
- option_c_more: Only the six-step plan gets a guide (four steps or more, or a question); the one-step plan is its video and plan.md. Costs least.
- why_a: A guide for every plan; what was built stays text.
- why_b: Before and after the build, in one place.
- why_c: The least cost; a small plan with a real choice has none.
- recommended: b
- focal: question 4: how much guide
- sfx: none

narrativeRole: Question 4: how much guide.
keyMessage: Question four.

## Frame 28 — If A: the plan side

- plan_step: 5
- scene: kicker 'If A'; the section with Plan only; walkthrough.md beside it
- voiceover: "With A, what landed stays in walkthrough.md, as text."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-branch-q4-a.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q4=a
- focal: if a: the plan side
- sfx: none

narrativeRole: If A: the plan side.
keyMessage: With A, what landed stays in walkthrough.md, as text.

## Frame 29 — If B: plan and built

- plan_step: 5
- scene: kicker 'If B'; the section's Plan | Built switch
- voiceover: "With B, each section switches between Plan and Built."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-branch-q4-b.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q4=b
- focal: if b: plan and built
- sfx: none

narrativeRole: If B: plan and built.
keyMessage: With B, each section switches between Plan and Built.

## Frame 30 — If C: big plans only

- plan_step: 5
- scene: kicker 'If C'; the six-step plan with a guide, the one-step plan without
- voiceover: "With C, the one-step plan is its video and plan.md."
- duration: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-branch-q4-c.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q4=c
- focal: if c: big plans only
- sfx: none

narrativeRole: If C: big plans only.
keyMessage: With C, the one-step plan is its video and plan.md.

## Frame 31 — Quick check: a row no scene shows

- plan_step: 4
- scene: THE HEADING AND THREE CARDS land, still
- voiceover: "Quick check. You change one row of step two's cases table, a row no scene shows, and ask for changes. What's rebuilt?"
- duration: 6.976s
- transition_in: cut
- status: animated
- src: compositions/frames/31-qc-a-row-no-scene-shows.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: You change one row of step 2's cases table, a row no scene shows, and ask for changes. What is rebuilt?
- option_a: The whole video, and the guide
- option_b: Step 2's scenes, and the guide
- option_c: The guide only
- answer: c
- explain: The guide is rebuilt whole every time; a scene is rebuilt only when its words show what the edit changed.
- walk_me_through: The edit goes into plan.md, so the guide is built again, all of it. No scene shows that row, so no scene's words change. So only the guide is rebuilt.
- option_a_why: Only scenes that show what changed are rebuilt, and none shows this row.
- option_b_why: Step 2's scenes don't show that row, so their words don't change.
- option_c_why: Right: the guide always; no scene, since none shows the row.
- explained_at: 20
- focal: quick check: a row no scene shows
- sfx: none

narrativeRole: Quick check: a row no scene shows.
keyMessage: Quick check.

## Frame 32 — Quick check: built differently

- plan_step: 5
- scene: THE HEADING AND THREE CARDS land, still
- voiceover: "Quick check. After the build, step three's command landed with a different flag. You switch its section to Built. What do you see?"
- duration: 6.635s
- transition_in: cut
- status: animated
- src: compositions/frames/32-qc-built-differently.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: After the build, step 3's command landed with a different flag. You switch its section to Built. What do you see?
- option_a: The planned command only
- option_b: Both commands, the flag marked
- option_c: A link to the walkthrough only
- answer: b
- explain: The Built side shows the interface as built beside the planned one, with the difference marked.
- walk_me_through: Step 3 planned one flag and the build used another. The Built side puts the command as built beside the planned one. The flag that differs is marked, so you see both.
- option_a_why: That is the Plan side; Built shows what landed.
- option_b_why: Right: as built beside as planned, the difference marked.
- option_c_why: The Built side links its scene in the walkthrough, but shows the interface itself.
- explained_at: 26
- focal: quick check: built differently
- sfx: none

narrativeRole: Quick check: built differently.
keyMessage: Quick check.

## Frame 33 — The plan

- guide: decisions
- scene: THE FIVE STEPS, still, each with its question's slot where it has one: 1 'the guide, from plan.md' (question 1); 2 'complete, and checked'; 3 'each points at the other' (question 2); 4 'edits, applied exactly' (question 3); 5 'the Built side' (question 4); 'draw a note · approve'. Holds still.
- voiceover: "That's the plan: the guide, built from plan.md; complete, and checked; the video and the guide pointing at each other; edits applied exactly; and a Built side. Draw on any step to leave a note, or approve."
- duration: 12.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- plan_questions: 1, 2, 3, 4
- focal: the plan
- sfx: none

narrativeRole: The plan.
keyMessage: That's the plan: the guide, built from plan.md; complete, and checked; the video and the guide pointing at each other; edits applied exactly; and a Built side.
