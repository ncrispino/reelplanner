---
title: "A case study for any plan: text only, HTML and ours, from one prompt to a finished site"
format: 1920x1080
duration: 290s
message: "Four steps, all three questions decided. The kit (step 1, built by the agent now): one template every write-up follows, a guide to replicate a case study step by step, a sheet per arm, a feedback sheet, a rubric, the blind judge's prompt, and a container per arm with a preflight that proves the start is empty. The text-only and HTML arms, run by you, all the way to a site you would ship (step 2, decision D-168): a case study, not an experiment, testing whether reviewing a plan is easier in a video, with the same feedback raised in every arm. Our arm through every stage, run first, a day between arms (step 3, decision D-169). Where each ends up and how each got there: the same measures, the rubric, the blind judge and your ranking (decision D-170), the process and what felt different in your words, all on one HTML page built from the case study's folder (step 4)."
arc: the real prompt and the two real plans that stop at the plan; what changes before how; the kit as its folder's map (a template, a replication guide), an empty start proved by two real preflight runs, the seven stages from the plan's table, the rubric and the blind judge; the other two arms, all the way (decided), a case study with the same feedback in every arm; what our arm keeps (new viewers), our arm with the real review page, ours first (decided); the measures, the result and the process (decided, with your note), the case study's page; the plan with what was decided
audience: the repo owner, who asked for the case study; knows the system video
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-26-case-study
terms: arm, case study, rubric, blind judge, feedback sheet, preflight, container
terms_check: strict
before: system#part 5 | the build, with the reel CLI
before: system#part 7 | memory, and six rules, with the reel CLI
before: 2026-09-22-m3-revise-loop | decisions D-083, D-084, D-082, D-085: how many quick checks does a video ask?
before: 2026-09-25-videos-you-can-follow | decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-083, D-084, D-082, D-085: how many quick checks does a video ask?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-001, D-003: who checks that the code followed the plan?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-107, D-106: when does the tool suggest a retro?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-110, D-109: a step reaches its fifth call during the build. What does…
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: explains "the real thing"
---

## Video direction

- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the real prompt (1), the two real baseline plans, plan mode's Markdown and the HTML page (2), two real runs of the draft preflight, one with only a fresh home folder, one in an isolated run (5), the plan's own seven-stage table (6), the real HTML plan at phone width and the plan-mode command (9), the real review page (13), your note on question 3, word for word (18). The kit (4) is shown as its folders' map, each file with one plain line; the feedback sheet (10) and the case study's page (19) are not built yet and are drawn as planned; the rest explain with pictures.
- MOTION LANGUAGE: a camera moves over one view clipped at y 900 and is at rest, scale 1, when a quick check ends; things are revealed by their own verb (typed, printed, drawn, struck, wiped); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; crossfade = the ending.
- FIVE CHAPTERS: one prompt, three ways (1–3); step 1, the kit and an empty start (4–8); step 2, the other two arms and the same feedback (9–11); step 3, ours, ours first (12–15, scene 12 for new viewers only); step 4, the result and the process, the page, the plan (16–20).
- DECIDED IN REVIEW, SAID AS DECIDED, NOT ASKED: the other two arms go all the way (decision D-168, scene 9); ours first, a day between arms (decision D-169, scene 14); the rubric, the blind judge and your ranking, with the process beside them (decision D-170, scene 18). No question scenes and no branches remain.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Quick-check headings data-question, cards data-option, outside any camera, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice. Words this video defines where it first says them: arm (3), case study and feedback sheet (4), preflight and container (5), rubric and blind judge (7).
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. No details. The final frame holds still.
- REVISED after the plan review of 2026-09-26 (changes requested): the three questions were decided, so their question scenes and branches are gone and each is said as decided; your note on step 2 is answered by scenes 9 and 10 (you run every arm; a case study; the same feedback); your note on question 3 by scene 18 (the process, and what felt different); your note on an empty start by scene 5 (a container, and the preflight's real output). Scene 4 adds the template and the replication guide, scene 19 the case study's page, and the ending says what was decided.

## Frame 1 — One prompt, three ways

- chapter_start: One prompt, three ways
- scene: THE REAL PROMPT: eval/bob-dylan-site/prompt.md typed on the slab, word for word; on 'three ways' three lanes draw out from it to the right, labelled 'text only', 'HTML', 'ours' (in code markup: reelplanning); on 'end up' a '?' lands at the end of each lane
- voiceover: "Here is one prompt: an interactive website about Bob Dylan, built in an empty folder. We give it to the same agent three ways: a text plan, an HTML plan, and ours. Where does each one end up?"
- duration: 12.7s
- transition_in: cut
- status: animated
- src: compositions/frames/01-one-prompt-three-ways.html
- type: hook
- blueprint: compose
- layout: terminal
- focal: one prompt, three lanes, three question marks
- sfx: none

narrativeRole: One prompt, three ways.
keyMessage: Here is one prompt:

## Frame 2 — Today: both stop at the plan

- scene: THE REAL BASELINES: left, baselines/plan-mode.md as a document page (its real first lines); right, baselines/html-plan.html as rendered at 1280 px (a real screenshot); on 'stop at the plan' a coral line draws under both at their foot with 'stops here' pinned; on 'nobody was asked' three struck chips land: 'questions: 0', 'approved: no', 'built: no'
- voiceover: "We already have part of this. From that prompt, plan mode wrote this plan, and another run wrote this HTML plan. Both stop at the plan: nobody was asked a question, nothing was approved, and nothing was built."
- duration: 13.1s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-both-stop-at-the-plan.html
- type: pain_point
- blueprint: compose
- layout: before-after
- focal: two real plans, both stopping at the plan
- sfx: none

narrativeRole: Today: both stop at the plan.
keyMessage: We already have part of this.

## Frame 3 — What changes

- defines: arm
- scene: THREE CHANGES AS A ROW: 'the kit' (step 1) on 'kit'; 'three arms' (steps 2, 3) on 'arms', its three lanes drawn, the word 'arm' pinned on one lane with 'prompt → shipped site' on 'one way of working'; 'compared' (step 4) on 'measured', arrows from the lanes into it
- voiceover: "The plan makes three changes. A kit any plan can use: step one. Three arms, each taken to a finished site: steps two and three. An arm is one way of working, from the prompt to a site you would ship. Then where each ends up, measured the same way: step four."
- duration: 15.2s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-what-changes.html
- type: product_intro
- blueprint: compose
- layout: diagram
- focal: kit, three arms, compared
- sfx: none

narrativeRole: What changes.
keyMessage: The plan makes three changes.

## Frame 4 — Step 1: the kit, one command

- chapter_start: Step 1: the kit
- plan_step: 1
- defines: case study, feedback sheet
- scene: THE KIT'S MAP, IN A TERMINAL: `reel case-study bob-dylan-site --prompt eval/bob-dylan-site/prompt.md` types on the slab; the folders it makes print as a tree, one row a file, each with one plain line beside it: TEMPLATE.md · every write-up's sections, in order; REPLICATE.md · how to run one, step by step; bob-dylan-site/: prompt.md, start/ · the user's words, the empty start (on 'empty start'); arms/text/, arms/html/, arms/ours/ · a sheet and a Dockerfile each; preflight.sh · checks each start is empty; FEEDBACK.md · your points, a column per arm; README.md, data/ · the write-up: words and numbers; RUBRIC.md, JUDGE.md · the score sheet, the judge's prompt; REPLICATE.md · this one's versions, model and dates. The three arms light on 'one sheet per arm'; TEMPLATE.md lights on 'template', both REPLICATE.md on 'replication guide'
- voiceover: "Step one. A case study is the three arms and their write-up. One command, reel case-study, sets up its folder: the prompt, the empty start, a sheet per arm, a feedback sheet for your points, the score sheet and the judge's prompt. Every write-up follows one template, and a replication guide gives every command, from install to the finished site."
- duration: 19.7s
- transition_in: cut
- status: animated
- src: compositions/frames/04-step-1-the-kit.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the folder one command makes: a template, a guide to replicate it
- sfx: none

narrativeRole: Step 1: the kit, one command.
keyMessage: Step one.

## Frame 5 — An empty start, checked

- plan_step: 1
- defines: preflight, container
- scene: TWO REAL RUNS OF THE DRAFT PREFLIGHT, STACKED (terminal-run blocks): top, in an empty folder with only a fresh home folder, on this machine: its six lines print, the ✗ line '9 other repos or plans on disk: /home/user/ReelPlanning/.git …' underlined coral on 'this repo', 'the rest of the disk' pinned; bottom, the same script in an isolated run with a new home and only ~/dylan-site: seven ✓ lines print on 'container', 'nothing to read but the prompt' drawn under on 'nothing'
- voiceover: "Each arm starts empty, and a preflight, a check run before the agent, proves it. With only a fresh home folder, it still finds this repo on the disk. In its own container, a fresh machine holding only the empty folder, it finds nothing but the prompt."
- duration: 15.2s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04b-an-empty-start.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: a fresh home still sees the disk; a container sees nothing
- sfx: none

narrativeRole: An empty start, checked.
keyMessage: Each arm starts empty, and a preflight, a check run before the agent, proves it.

## Frame 6 — Seven stages, three ways

- plan_step: 1
- scene: THE PLAN'S OWN TABLE: its seven rows (plan, review, revise, build, check the result, fix, done) by three columns (text only, HTML, ours), the real cells; on 'seven stages' the stage column draws down; on 'check the result' that row lights and the camera leans in on its three cells, each lit on its words; on 'ship it' the 'done' row lights with 'or 2 sets of fixes' pinned
- voiceover: "Every arm goes through the same seven stages, so the times line up. What differs is how. To check the result, text only reads the agent's summary and its diff; HTML reads a report page; ours has a fresh agent check the code, then a walkthrough video. An arm stops when you would ship it, or after you have asked for fixes twice."
- duration: 20s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-seven-stages.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: the same seven stages; how each arm checks the result
- sfx: none

narrativeRole: Seven stages, three ways.
keyMessage: Every arm goes through the same seven stages, so the times line up.

## Frame 7 — The rubric and the blind judge

- plan_step: 1
- defines: rubric, blind judge
- scene: LEFT, THE RUBRIC: five rows (does what was asked · beats a Wikipedia article · works on a phone · facts right · easy to change), a 1–5 scale on each, drawn on 'five things'. RIGHT, THREE FOLDERS: the arms' folders shuffle into X, Y, Z on 'three folders'; inside each, on 'taken out', the files that name an arm are struck: .reelplanning/, plan.html, report.html, the plan files, the git history
- voiceover: "The rubric is a fixed score sheet: one to five on five things, from does what was asked, to easy to change. The blind judge is a fresh agent that never learns which arm made which site. It gets three folders, X, Y and Z. Anything that names an arm is taken out first, so each folder holds a site alone."
- duration: 18.7s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-rubric-and-blind-judge.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: five scores; three folders, nothing names an arm
- sfx: none

narrativeRole: The rubric and the blind judge.
keyMessage: The rubric is a fixed score sheet:

## Frame 8 — Quick check: what the judge sees

- plan_step: 1
- scene: THE CASE FROZEN BEHIND: the three folders X, Y, Z, dimmed; the question heading (data-question) and three cards (data-option a–c) land, outside the camera, still
- voiceover: "Quick check. The HTML arm's folder goes to the judge. What does the judge see?"
- duration: 6.5s
- transition_in: cut
- status: animated
- src: compositions/frames/07-quick-check-what-the-judge-sees.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: The HTML arm's folder goes to the blind judge. What does the judge see?
- option_a: Its plan page and the site
- option_b: The site alone, as X, Y or Z
- option_c: The site, labelled HTML
- answer: b
- explain: Everything that names an arm is taken out, the plan page and the report included, so the judge sees only a site, under a letter.
- walk_me_through: The HTML arm's folder holds its plan page, its report page and the site. Before the judge sees it, anything that names an arm is taken out: plan.html and report.html go. What is left is the site alone, and it arrives as X, Y or Z, shuffled with the other two.
- option_a_why: The plan page names the arm, so it is taken out first.
- option_b_why: Right: only the site is left, under a shuffled letter.
- option_c_why: The judge never learns which arm made which site; the key stays with you.
- explained_at: 7
- focal: three predictions
- sfx: none

narrativeRole: Quick check: what the judge sees.
keyMessage: Quick check.

## Frame 9 — Step 2: the other two arms, all the way

- chapter_start: Step 2: the other two arms
- plan_step: 2
- scene: TWO LANES, REAL THINGS: a coral 'decision D-168 · all the way' tag lands on 'decided'; top lane, text only: `claude --permission-mode plan` typed on 'plan mode', then chips 'questions in chat', 'summary + git diff --stat' on their words; bottom lane, HTML: the real html-plan.html at phone width (a real screenshot) on 'plan page', then 'notes in chat', 'build', and a 'report.html' card on 'report page' with 'what it built' and 'the choices it made alone' underlined on 'choices'; both lanes end at 'a site you'd ship' on 'ship'
- voiceover: "Step two: the other two arms, which you decided go all the way to a site you would ship, decision D-168. Text only starts in plan mode: answer its questions in chat, check the diff. HTML adds a plan page, then a report page: what it built, and the choices it made on its own."
- duration: 17.9s
- transition_in: cut
- status: animated
- src: compositions/frames/08-step-2-the-other-two-arms.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: two arms, each to a site you would ship
- sfx: none

narrativeRole: Step 2: the other two arms, all the way.
keyMessage: Step two:

## Frame 10 — A case study, the same feedback

- plan_step: 2
- scene: WHAT THIS IS, THEN THE SHEET: 'you, in every arm' on 'yourself'; 'a case study, not an experiment' pinned on 'case study'; 'it tests: is reviewing a plan easier in a video?' on 'testing'; below, FEEDBACK.md as a table (planned): rows are example points from the prompt (eras first, then albums · works on a phone · which songs · the tone), drawn on 'your points'; columns text only, HTML, ours land on 'every arm', cells empty; on 'records' the four marks a cell can take land as a legend: raised (and where) · covered by the plan · missed · new
- voiceover: "You run every arm yourself: a case study, not an experiment, testing whether reviewing a plan is easier in a video. Before the first arm, you write your points from the prompt alone, and raise them in every arm. The sheet records which came up, which the plan covered, and what was new."
- duration: 16.3s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08b-the-same-feedback.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: one reviewer, the same points in every arm
- sfx: none

narrativeRole: A case study, the same feedback.
keyMessage: You run every arm yourself:

## Frame 11 — Quick check: where the HTML arm's choices are

- plan_step: 2
- scene: THE CASE FROZEN BEHIND: the HTML lane, dimmed; the heading and three cards land, still
- voiceover: "Quick check. In the HTML arm, where do you read the choices the agent made that the plan did not cover?"
- duration: 7.3s
- transition_in: cut
- status: animated
- src: compositions/frames/09-quick-check-the-html-arm.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: In the HTML arm, where do you read the choices the agent made that the plan did not cover?
- option_a: In the chat
- option_b: In its report page
- option_c: In the plan page
- answer: b
- explain: After the build, the HTML arm asks for a report page: what was built, and the choices the agent made on its own.
- walk_me_through: The HTML arm's plan page is written before the build, so it cannot hold choices made during it. After the build, the arm asks the agent for a report page. That page says what it built and the choices it made on its own, so that is where you read them.
- option_a_why: The chat has the agent's closing words, but the arm asks for the choices in a page.
- option_b_why: Right: the report page lists what was built and the choices made alone.
- option_c_why: The plan page is written before the build, so it cannot hold choices made during it.
- explained_at: 9
- focal: three predictions
- sfx: none

narrativeRole: Quick check: where the HTML arm's choices are.
keyMessage: Quick check.

## Frame 12 — What our arm keeps

- chapter_start: Step 3: ours, every stage
- defines: retro
- knowledge: new
- scene: SEVEN EARLIER PLANS, ONE LINE EACH: a list of seven rows landing on their words: close the lifecycle · a second agent checks the code; fewer stops · the fifth choice asks; the revise loop · a quick check per step; videos you can follow · plain words; memory · a retro judged against this run; deep dives · pages from a template; better visuals · the real thing on screen
- voiceover: "Our arm keeps what seven earlier plans decided. A second agent checks the code, and the system video catches up after each accept. At a step's fifth choice, the builder asks you. A quick check per step. Plain words on screen. A retro, a plan to change the skill, is judged against this very run. A page beside the video starts from a template. And scenes show the real thing."
- duration: 21.9s
- transition_in: cut
- status: animated
- src: compositions/frames/14-what-our-arm-keeps.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: seven earlier plans in one line each
- sfx: none

narrativeRole: What our arm keeps.
keyMessage: Our arm keeps what seven earlier plans decided.

## Frame 13 — Step 3: ours, every stage

- plan_step: 3
- scene: THE LIFECYCLE ROW + THE REAL PAGE: eleven stage chips in a row, each lit on its word; on 'hosted page' the real review page (a real screenshot: a quick check on the better-visuals video) opens under the row and the camera pushes into it, then pulls back; on 'done' the last two chips ring coral: 'accepted', 'system video current'
- voiceover: "Step three: our arm, every stage captured. The plan and its video, your review on the hosted page, the revised plan, the build with its choices recorded, the code check by a fresh agent, the walkthrough video, your accepts and flags, the fixes, and the system video it leaves behind. Ours is not done until the walkthrough is accepted and the system video is current."
- duration: 20.9s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/15-step-3-ours-every-stage.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: every stage, the real review page, where done is
- sfx: none

narrativeRole: Step 3: ours, every stage.
keyMessage: Step three:

## Frame 14 — Decided: ours first

- plan_step: 3
- scene: THE ORDER, DECIDED: kicker 'decision D-169 · ours first'; 'You' then three chips in a row, ours (coral), text only, HTML, each joined by a line with 'a day' over it, drawn on their words; on 'helps' an arrow from ours over the other two, 'what you learn helps these' pinned
- voiceover: "You decided the order: ours first, then the other two, a day between arms, decision D-169. What you learn on ours helps the others, so a win for ours is its own."
- duration: 11.2s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/15b-decided-ours-first.html
- type: benefit_highlight
- blueprint: compose
- layout: diagram
- focal: ours first, a day between arms
- sfx: none

narrativeRole: Decided: ours first.
keyMessage: You decided the order:

## Frame 15 — Quick check: when ours is done

- plan_step: 3
- scene: THE CASE FROZEN BEHIND: the lifecycle row, dimmed, lit up to 'build'; the heading and three cards land, still
- voiceover: "Quick check. Our arm has an approved plan and a built site. Is it done?"
- duration: 6.5s
- transition_in: cut
- status: animated
- src: compositions/frames/16-quick-check-when-ours-is-done.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: Our arm has an approved plan and a built site. Is it done?
- option_a: Yes, the site is built
- option_b: Not until the walkthrough is accepted
- option_c: Not until a second plan review
- answer: b
- explain: Ours is done when the walkthrough is accepted and the system video is current, not when the site is first built.
- walk_me_through: After the build come the code check by a fresh agent, the walkthrough video, your accepts and flags, and the fixes. Only when the walkthrough is accepted, and the system video is current, is our arm done. A built site is about two thirds of the way.
- option_a_why: The code check, the walkthrough and the fixes still come after the build.
- option_b_why: Right: done is the walkthrough accepted, with the system video current.
- option_c_why: The plan was already approved; what comes next is about the code.
- explained_at: 13
- focal: three predictions
- sfx: none

narrativeRole: Quick check: when ours is done.
keyMessage: Quick check.

## Frame 16 — Step 4: measured the same way

- chapter_start: Step 4: where each ends up
- plan_step: 4
- scene: THE WRITE-UP'S TABLE: rows (time per stage · questions and decisions · code held to them · caught in review · slipped through · understood, from memory) by columns (text only · HTML · ours), cells empty, each row drawn on its words; on 'sweep' a strip of five chips under the table: 390 px · 1440 px · console · links · 10 facts
- voiceover: "Step four: where each ends up, measured the same way. Time per stage, yours and the agent's. Questions asked and decisions recorded, then whether the code held to them: the same code check, run on all three. What each review caught, and what slipped through, from one sweep of every site: phone, desktop, console, links, ten facts. And a day later, five questions on what was built, from memory."
- duration: 22s
- transition_in: cut
- status: animated
- src: compositions/frames/21-step-4-measured-the-same-way.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: the same measures for all three
- sfx: none

narrativeRole: Step 4: measured the same way.
keyMessage: Step four:

## Frame 17 — Quick check: a site that scrolls sideways

- plan_step: 4
- scene: THE CASE FROZEN BEHIND: the table dimmed, a phone outline with a page wider than it; the heading and three cards land, still
- voiceover: "Quick check. The text-only site scrolls sideways on a phone, and nobody asked for a fix. Where does that show?"
- duration: 7.5s
- transition_in: cut
- status: animated
- src: compositions/frames/22-quick-check-sideways.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: The text-only site scrolls sideways on a phone, and nobody asked for a fix. Where does that show?
- option_a: Nowhere: the review passed it
- option_b: In what slipped through
- option_c: Only if you notice it
- answer: b
- explain: The same sweep runs on every finished site, a phone width included, so a defect nobody fixed is counted as slipped through.
- walk_me_through: After each arm is done, one sweep runs on every site: a phone at 390 pixels, a desktop, the console, the links and ten facts. The text-only site scrolls sideways at 390 pixels, so the sweep finds it. Nobody asked for a fix, so it lands in what slipped through for that arm.
- option_a_why: Passing review is what the sweep checks after; it does not hide the defect.
- option_b_why: Right: the sweep on every site finds it, and it counts as slipped through.
- option_c_why: The sweep is the same for every site, so it does not depend on you noticing.
- explained_at: 16
- focal: three predictions
- sfx: none

narrativeRole: Quick check: a site that scrolls sideways.
keyMessage: Quick check.

## Frame 18 — Decided: the result, and the process

- plan_step: 4
- scene: TWO COLUMNS: left, 'the result', three boxes (the rubric · the blind judge · your ranking) land on their words, a coral 'decision D-170' tag on 'decision'; right, 'the process, per arm', four rows land on their words: how you read and answered · what was misunderstood, and when · the effort your feedback took · what you knew before the code; under both, on 'as you said', YOUR NOTE ON QUESTION 3 from the review, word for word, in a quote; on 'felt different' a box 'what felt different · in your words' lands under it
- voiceover: "You decided how it is judged: the rubric, the blind judge and your ranking, decision D-170. And as you said, the process counts too: how you read and answered each plan, what was misunderstood and when, and the effort your feedback took. Then what felt different, in your own words."
- duration: 17s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/23b-judged-result-and-process.html
- type: feature_showcase
- blueprint: compose
- layout: split
- focal: the result and the process, in your words
- sfx: none

narrativeRole: Decided: the result, and the process.
keyMessage: You decided how it is judged:

## Frame 19 — The case study's page

- plan_step: 4
- scene: LEFT: two chips, 'the agent · steps 1, 4' and 'you · steps 2, 3, ours first', on their words; a slab where `reel case-study report bob-dylan-site` types on 'reel'. RIGHT: a wireframe of the page, labelled 'case-study.html · planned', its sections as blocks top to bottom, each landing on its words: the prompt, the empty start; the arms, stage by stage (three columns, a time bar each); the feedback sheet (a small grid); caught, slipped through (on the page, not said); the three sites (X, Y, Z at phone and desktop); the scores, the judge, your ranking; your words; what we'd change; links
- voiceover: "The agent builds step one now; you run the arms, ours first. Then one command, reel case-study report, builds the case study's page from its folder: the prompt and the empty start, the arms stage by stage, the feedback sheet, the three sites, the scores, and your words."
- duration: 16s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/27-who-does-what.html
- type: benefit_highlight
- blueprint: compose
- layout: split
- focal: one command, one page for any case study
- sfx: none

narrativeRole: The case study's page.
keyMessage: The agent builds step one now; you run the arms, ours first.

## Frame 20 — The plan, decided

- scene: THE STEPS AND WHAT WAS DECIDED, still: four rows (data-plan-step 1 to 4) at reading size, each with its chip: step 1 'an empty start, checked'; step 2 'decision D-168 · all the way'; step 3 'decision D-169 · ours first'; step 4 'decision D-170 · result and process'; 'draw a note · approve' on 'approve'. Holds still.
- voiceover: "That is the plan: four steps, all three questions decided. Each arm starts empty; you give the same feedback in each; and the page shows the process as well as the sites. Draw on any step to leave a note, or approve."
- duration: 13.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- focal: the four steps, and what was decided
- sfx: none

narrativeRole: The plan, decided.
keyMessage: That is the plan:
