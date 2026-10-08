---
title: "The plan guide: what was built"
format: 1920x1080
duration: 260s
message: "The plan guide is built, steps 1 to 5, shown running: reelplanning guide writes a video's page and a part a step (step 1; A1 to A4 pause, and D2); every step's four blocks held to by reel check, and the guide checked (step 2); a scene's part over the frame (step 3; A8, A9 pause, and D1); suggested edits filed with what they rebuild (step 4; A10, A11 pause); the Built side, every changed line and run (step 5; A12, A13 pause). Ten choices pause, two changes from the plan, four are the list."
arc: the map; step 1's command, its page, its things to do (A1 to A4) and its picture (D2); step 2's four blocks, the guide checked, a check, reel check run; step 3's part over the frame (A8, A9) and its folder (D1); a check; step 4's edits filed (A10, A11); step 5's Built side (A12, A13); what ran; the list; the open question
audience: the repo owner, who asked for the plan guide, answered its four questions and approved this plan; watched its plan video and knows the review page
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-28-plan-guide
terms: plan.md = the plan's own file, in plain words: its problem, its steps and its questions; case = one situation a step must handle, with an example and what happens in it (a row of a step's Cases table); interface = what a step adds that someone uses: a command, its flags and what it prints; beat = one short piece of the page's flow, beside what it shows; layer = a part of the page that opens with a click, one level down; Built side = the page's view of what was built for a step: its changes and runs; kind of change = one group of what was built, named in the walkthrough, with its files and runs; Everything else = what no kind of change claims, listed so nothing is left out; gap = something the plan does not say, shown on the page as not written, never guessed; run = a command as it ran, saved whole in the plan's runs folder; stage = the drawing of the system's parts a video shows; decision log = the record of every answer to a plan's questions (decisions.md); ledger = the decision log, as `reel` calls it in its output; the list = one sheet at a walkthrough's end: the choices that do not pause, one line each with its own Flag; plan map = the file that says which scene shows which step, and what each scene opens; things to do = the guide's small exercises: drag each case onto what happens, fill in what a command prints, predict an answer, each checked against the plan; builder = `reelplanning guide`, the command that makes the guide; prototype = the pages made by hand before this plan, to try the guide out; details = the pages a scene opened before the guide, written by hand into a video's details folder; strict = a storyboard setting that makes a check fail where it would otherwise warn; choices table = walkthrough.md's table of the choices the agent made, each with where to check it; it pauses here = the video stops on this choice for you to Accept or Flag it; scratch repo = a throwaway copy of a repo, made to run a command on
plain: flag, spec, browser
terms_check: strict
details_check: strict
before: system#part 3 | the review page, with the review player, the plan-to-video skill, finish-project, the revise step, the implement step
before: 2026-09-26-better-visuals | decisions D-167, D-142, D-166: which look should the review page take?; explains "real thing"
before: 2026-09-27-details-in-the-frame | decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-167, D-142, D-166: which look should the review page take?; explains "real thing"
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decisions D-024, D-022, D-023: how is each detail page made?
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-224, D-219: how do the plan and what was built sit together?; explains "the list"
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-003, D-001, D-002: when does the system video update?
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-168, D-169, D-170: do the text-only and HTML arms go all the way to a…
recap: 2026-09-27-details-in-the-frame--walkthrough | Details in the frame: click the thing a detail explains: decisions D-206, D-208: the button hides for as long as a question's box is up, an…
recap: 2026-09-23-deep-dives--walkthrough | Deep dives: the video opens into HTML where a video falls…: decisions D-063, D-062: beside the stage when that costs it under 15 % of its…
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-213, D-215: where does a PR's built video live?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-065, D-064: when a system-video comment asks for the system itself to…
---

## Video direction

- THE CHANGE RUNNING (decision D-219): real runs saved in the plan's runs folder and the real guide and review page, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a1, a2, a3, a4 (4); d2 (5); a8, a9 (10); d1 (11); a10, a11 (13); a12, a13 (14), each on the scene that shows it running; the list `a5, a6, a7, a14` (16).
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the scene that runs it: k1 (8) before `reel check` on a new plan (9); k2 (12) before the edits are filed (13).
- SIX PARTS: what landed (1); the page (2–5); complete, and checked (6–9); the video and the guide (10–11); edit the plan (12–13); after the build, and what ran (14–17).
- THE SHOWCASE: every scene that has one opens its part of this plan's own guide, built by the new builder (`- guide:`), from the thing it marks (`data-detail`).
- MOTION: things revealed by their own verb (typed, wiped, ringed); cut = a part or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing below y 945. Headings `data-question`, option cards `data-option`, choice cards `data-call`, still in the scene's last seconds.
- PLAIN WORDS (decision D-127): choice, scene, the list, quick check; tool names in code markup.

## Frame 1 — What landed: its map

- chapter_start: What landed
- guide: what-changed
- defines: The guide
- scene: THE MAP (the real change, one row a place): a heading 'The code this build changed, one line a place'; seven rows, each a path in mono and a plain line
- voiceover: "The plan guide, built. Every plan video now has a page behind it, the guide: the whole plan to read, check and edit, a click from the scene you're watching. Seven places carry it, one line each."
- duration: 11.008s
- transition_in: cut
- status: animated
- src: compositions/frames/01-landed.html
- layout: table
- focal: seven places, one plain line each

## Frame 2 — Step 1: the command, run

- plan_step: 1
- guide: builder
- defines: A part of the guide, decision log
- scene: TERMINAL: the real `reelplanning guide` run on videos-that-make-sense (runs/guide-check.txt): each video's page, its counts, its parts; under it what it reads and what it writes
- voiceover: "Step one, running. The new guide command reads a video's plan, its decisions and its scenes; after the build, the walkthrough, git and the saved runs as well. It writes one page, and a part for each step and each kind of change. The build runs it, and nothing it writes is committed."
- duration: 15.232s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-step-1-command.html
- layout: terminal
- focal: one page, and a part a step

## Frame 3 — Step 1: the page

- plan_step: 1
- guide: page
- scene: REAL SCREEN: the plan guide's own guide at 1440 × 900, rings in the narration's order: the steps down the left, the beats, the stage, Expand all, the line saying any words can be selected
- voiceover: "Here is the page. The steps down the left; each step a column of short beats beside the real thing. Every case, every part of the interface and every decision is one click down. Expand all opens every one. Select any words to comment, ask, or suggest an edit."
- duration: 15.637s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-step-1-page.html
- layout: shot
- focal: beats beside the real thing

## Frame 4 — Step 1: things to do, and choices A1 to A4

- plan_step: 1
- guide: step-1
- guide_title: Step 1: the guide, a page a plan
- autonomy: a1, a2, a3, a4
- scene: REAL SCREEN, two crops: step 2's cases to drag onto what happens (made from its Cases table), and an explainer's source kept outside the repo, its path, hash and lines only; the choice cards A1 to A4 (data-call) at the right
- voiceover: "Things to do come from the plan itself: drag each case onto what happens, fill in what a command prints, predict a question's answer. Four choices. Each video has a guide of its own. The page is one flow, not boxes. No thing to do is written by hand. And an explainer's source kept outside the repo shows its path and size, never its text."
- duration: 19.648s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-step-1-todo.html
- layout: shot
- focal: things to do from the plan's own blocks

## Frame 5 — Step 1: the step's picture, a change from the plan

- plan_step: 1
- autonomy: d2
- scene: REAL SCREEN: the stage of step 1, 'Where step 1 sits: the parts it touches', the touched ones ringed; the deviation card D2 (data-call) at the right
- voiceover: "One change from the plan. A step's picture is the system's parts as names, the ones it touches lit, instead of the stage drawn for the video: that drawing is sized for a whole frame, not a column."
- duration: 11.413s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-step-1-picture.html
- layout: before-after
- focal: the parts as names

## Frame 6 — Step 2: four blocks a step

- chapter_start: Complete, and checked
- plan_step: 2
- guide: step-2
- guide_title: Step 2: four blocks a step
- scene: REAL SCREEN: step 2's Cases on the guide, ten rows, each an example and what happens; beside it the four blocks, each named as it is said: Cases, Interface, Example, Decisions
- voiceover: "Step two. A plan written from the thirtieth of September, twenty twenty-six, on holds every step to four blocks: its cases, each with an example and what happens; its interface, each part with its meaning; an example to follow; and the decisions it answers. `reel check` fails a step missing one, and names it."
- duration: 17.131s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-2-blocks.html
- layout: shot
- focal: the four blocks

## Frame 7 — Step 2: the guide, checked

- plan_step: 2
- guide: blocks
- scene: TERMINAL: two real `guide --check` runs: passing on videos-that-make-sense (every paragraph, every layer by a visible control); then, walkthrough.md naming a run nobody saved, '✗ category "The build gate": names runs/build-typed-in.txt, which is not in runs/'
- voiceover: "The guide is checked too. Every paragraph of the plan has to be on the page, and every layer has a button that opens it. A run shown as real must be one that was saved: name one nobody saved, and the check fails. What the plan leaves out is listed as a gap, never made up."
- duration: 15.552s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-step-2-guide-check.html
- layout: terminal
- focal: passes, then fails on a run nobody saved

## Frame 8 — Quick check: a step with no interface

- plan_step: 2
- quiz: k1
- question: A plan dated October the first has a step with cases, but no interface and no line saying it has none. What does `reel check` do?
- option_a: Warns, and passes
- option_b: Fails, naming the step
- option_c: Passes; the guide shows a gap
- answer: b
- explain: From the thirtieth of September on, every step must have its four blocks; a step with no interface and no line saying so fails, named.
- option_a_why: A warning is for a missing meaning or trace; a missing block fails.
- option_b_why: Right: it fails, and says which step has no Interface block.
- option_c_why: A gap on the guide is for what an older plan never wrote; this plan is held to the blocks.
- walk_me_through: The plan's folder is dated October the first, after the thirtieth of September, so its steps are held to the four blocks. Its step has a Cases table but no Interface block and no line saying it has none. `reel check` fails, naming the step and the missing block. Add the block, or one line saying there is no interface, and it passes.
- explained_at: 6
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. A plan dated October the first has a step with cases, but no interface and no line saying it has none. What does `reel check` do?"
- duration: 12s
- transition_in: cut
- status: animated
- src: compositions/frames/08-qc-no-interface.html
- layout: quiz
- focal: the question and three predictions

## Frame 9 — Step 2: reel check, on a new plan

- plan_step: 2
- scene: TERMINAL: the real `reel check` on a new plan in a scratch repo (runs/reel-check-new-plan.txt): three ✗ lines, the △ line, the summary, exit 1
- voiceover: "Here it is, on a new plan in a scratch repo. Its second step has neither cases nor an interface, and one option has no example, so `reel check` fails on all three and says which. An older plan passes as it did."
- duration: 12.565s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/09-step-2-reel-check.html
- layout: terminal
- focal: it fails, and says which

## Frame 10 — Step 3: a part over the frame, and choices A8 and A9

- chapter_start: The video and the guide
- plan_step: 3
- guide: pointing
- autonomy: a8, a9
- scene: REAL SCREEN: the review page playing videos-that-make-sense's walkthrough, its part 'What changed, in full' open over the frame, 'Open the full guide' ringed; the choice cards A8 and A9 (data-call) at the right
- voiceover: "Step three. A scene names its part of the guide, and in the player the part opens over the frame. The guide holds every word of the plan; a scene only its own. Two choices. The player offers a part only once the guide is built. And the videos on the review page open the builder's parts now, not the prototype's pages."
- duration: 18.368s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-3-part.html
- layout: shot
- focal: the part, over the frame

## Frame 11 — Step 3: where a part lives, a change from the plan

- plan_step: 3
- guide: step-3
- guide_title: Step 3: a part over the frame
- autonomy: d1
- scene: REAL THING: the plan map's entry for a scene's part ('src: guide/what-changed.html', 'guide: true') and the four lines of .gitignore that keep the guide out; the deviation card D1 (data-call) at the right
- voiceover: "One more change from the plan: a part sits in the guide's own folder, not with the details, because the guide is built each time and never committed."
- duration: 8.149s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/11-step-3-folder.html
- layout: code
- focal: guide/, never committed

## Frame 12 — Quick check: an edit no scene shows

- plan_step: 4
- quiz: k2
- question: You suggest an edit to a case that no scene shows. What does the revise rebuild?
- option_a: Every scene
- option_b: The guide only
- option_c: Its step's scenes
- answer: b
- explain: The guide holds every word of the plan, and a scene only its own; no scene says those words, so only the guide is built again.
- option_a_why: A scene is rebuilt only when its own words change.
- option_b_why: Right: the guide only, since no scene says or shows those words.
- option_c_why: Its step's scenes don't say those words either.
- walk_me_through: Your edit changes a case row in step 2. The guide holds every word of the plan, so it is built again with your words. No scene says or shows that row, so no scene changes. The review's Edits to apply says so: the guide only.
- explained_at: 10
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. You suggest an edit to a case that no scene shows. What does the revise rebuild?"
- duration: 10s
- transition_in: cut
- status: animated
- src: compositions/frames/12-qc-edit-rebuild.html
- layout: quiz
- focal: the question and three predictions

## Frame 13 — Step 4: an edit, filed, and choices A10 and A11

- chapter_start: Edit the plan
- plan_step: 4
- guide: edits
- autonomy: a10, a11
- scene: TERMINAL: the real `reel record` run with two suggested edits ('ledger: +2 (D-002 --to <file>; D-003 …)'), and the filed review's 'Edits to apply': one rebuilding scenes 12, 20, 21, 22, 23 and 26, one 'the guide only'; the choice cards A10 and A11 (data-call) at the right
- voiceover: "Step four. `reel record` files each suggested edit in the decision log, your words chosen over the plan's, and lists it under Edits to apply, with what it rebuilds: the scenes that say those words, or the guide only. Two choices. An edit is a log entry of its own kind. And an answer given on the guide counts on the video too."
- duration: 18.923s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/13-step-4-edits.html
- layout: terminal
- focal: the scenes it rebuilds, or the guide only

## Frame 14 — Step 5: the Built side, and choices A12 and A13

- chapter_start: After the build
- plan_step: 5
- guide: step-5
- guide_title: Step 5: the Built side
- autonomy: a12, a13
- scene: REAL SCREEN: the plan guide's own Built side, the builder's every line: its files, its changes from git with the lines around them; the choice cards A12 and A13 (data-call) at the right
- voiceover: "Step five. After the build, each step has a Built side: every kind of change, its files, every changed line with the file around it, and its runs, whole. Two choices. The walkthrough names each kind of change once, and what none claims is Everything else. A file the build writes is listed with its counts, not shown."
- duration: 17.387s
- transition_in: cut
- status: animated
- src: compositions/frames/14-step-5-built.html
- layout: shot
- focal: every changed line

## Frame 15 — What ran

- chapter_start: What ran
- guide: tests
- defines: The code check
- scene: WHAT RAN: rows: '`npm test` · every fast spec passes · guide.spec new', 'the guides · five plans, nine videos, each checked in a browser', 'code check · step 5's two hand-made things to do missing: under Not done', '`reel audit` · passes'
- voiceover: "What ran: every fast test, with a new spec; guides for five plans' nine videos, each checked in a browser; and a fresh agent's code check. It found one thing step five asked for that's missing, two hand-made things to do, now under Not done, and four choices to add to the table."
- duration: 15.936s
- transition_in: cut
- status: animated
- src: compositions/frames/15-what-ran.html
- layout: steps
- focal: the runs, and what is not done

## Frame 16 — The list

- guide: choices
- autonomy_list: a5, a6, a7, a14
- scene: THE LIST: four rows (data-call), each its id and a few words
- voiceover: "The other four choices are the list: the plans the four blocks hold, what counts as an example, what counts as saying the video's words again, and a part its frame doesn't mark only warning. Flag any you'd change."
- duration: 12.16s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/16-the-list.html
- layout: list
- focal: four choices, one line each

## Frame 17 — Seeing it run

- open_question: Seeing it run, anything you'd change?
- scene: THE ASK: 'Seeing it run, anything you'd change?' in the serif; under it 'Say what to change in Finish, or approve the build'; holds still
- voiceover: "Seeing it run, anything you'd change? Say it in Finish, or approve the build."
- duration: 9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-end.html
- layout: ask
- focal: the open question
