---
title: "reelplanning: the whole system"
format: 1920x1080
duration: 570s
message: "a plan as long text is too hard to take in, so reelplanning turns it into a short narrated video you review by watching, with the detail on a guide under it. This is the whole system as it is today: installing it, the plan and its video, reviewing in the player, what happens after you send, the build and its walkthrough, and what is kept"
arc: explainer in seven chapters: what reelplanning is and its one loop; installing it, run for real; the plan and its video; reviewing in the player and the guide; after you send; the build and its walkthrough; what is kept, and kept current
audience: someone new to the repo, who knows nothing about reelplanning
mode: autonomous
music: none
kind: system
plan_dir: .reelplanning
terms: own words; plan.md = the file a plan is written in: its problem, its steps and its questions for you; walkthrough.md = the file the agent writes as it builds: what landed in each step, and each choice it made on its own; spec.md = the project's description of itself, in plain prose: what it is for, its parts and its rules; system.json = the project's parts and how they connect, as data; interface = what a step adds that you use: a command and its flags, a file's fields, what a page shows; HyperFrames = the video framework that draws each scene as an HTML page and renders the video; maintainer = a person who decides what goes into a repo; author = the agent that made a video; glossary = the project's list of words, one name per thing, each with its meaning; pr-check = the command that says where a pull request stands: waiting on its video, on a review, or ready to merge; case = one kind of input or situation a step handles, with a real example; reel-intake = the command that files a review that came as a row of a hosted page: it checks the row, then records it like any other; the list = the walkthrough video's last scene: every choice that doesn't pause, one line each, with its own Flag; reel fold = the command that gathers a part's many rules into one section of spec.md, once the owner says yes; past choice = a choice the agent made on its own in an earlier build, kept in its walkthrough.md; decisions.md = the decision log's file, in .reelplanning/; superseded = replaced by a later decision; in force = still binding on later plans: not replaced by a later answer; cite = name a decision by its id, or the spec.md section it is folded into, in the plan's list of the decisions it keeps; pipeline = the third level, all of reelplanning: your answers kept as decisions that later plans are checked against, every review kept, walkthrough videos and the system video
terms_check: strict
details_check: strict
---

## Video direction

- THE SYSTEM VIDEO, REDONE WHOLE (decision D-003 keeps it current; the owner asked for a full redo on 2026-10-04): one video explaining the whole repo, from `.reelplanning/spec.md`, `system.json` and `glossary.md`, for someone new. No decision scenes; a quick check per chapter (seven), each later and on a new case (decisions D-197 to D-199): chapter N's check at the end of chapter N+1, the last two just before the ending, with `explained_at` naming the scene that explained its rule. Every glossary row has a scene tagged `- defines:`, in the row's on-screen word (decision D-127).
- SEVEN CHAPTERS (`chapter_start` on scenes 1, 6, 11, 17, 26, 31, 38), the lifecycle in order: what reelplanning is (what it makes of a plan, and the real review page stopped at a question; the loop: plan, plan video and guide, your review, decisions, build, walkthrough video and guide, your review, the system video; how much of it you use, three levels you pick from, in the README's words: one video, a plan video or an explainer; plus a walkthrough; the whole pipeline, which the rest of this video shows); installing it (decision D-303: the four commands, with what they print; the README's `npm i -g github:…` on screen, run from a packed copy until the repo is public, said in a note; your agent fills a repo's description in from its code); the plan and its video (how to start, and that you type only that: your agent runs every command after it, a chip on each command scene says so; plan.md's blocks, `reel check`'s rules, decision D-306; what the agent writes and what `reelplanning build` runs, fresh eyes and two of the frame rules, the review page your agent starts and that keeps running); reviewing in the player (the cards, Explain this more, own words, Terms, Ask about this, the plan text, quick checks, the guide under the video, decisions D-264 and D-265, the quiet mark on the plan video's own scene, decision D-266, a note on any words, Finish and Send); after you send (how a review arrives, a hosted page said in plain words; who picks it up: the hand-off and the sandbox; `reel record` and the decision log, which keeps everything while what binds a plan stays small: rules, history and `reel fold`, decision D-306; the agent revises); the build and its walkthrough (choices and labels, a step's fifth choice asked in plan.md, the code check and `reel audit`, the change running, what pauses, the list, the Built side and the fix); what is kept (the folder, this video kept current and spec.md for the rest, memory, explainers, several people). The frame rules in full, the record's history in full, and the case study are left to the guide this video does not have yet (plans/2026-10-04-system-video-guide/); until then spec.md holds them.
- PACE: narrated at speed 1.1, with 0.8 s after every line (`.hyperframes/holds.json`'s tail), for someone new; quick checks are cut out of the chapter MP4s (`chapters --no-checks`), which cannot stop for an answer.
- THE REAL THING WHERE THE BRIEF PICKS IT (decision D-166): today's review page and guide (this branch's player, bundled with `bundle-player`, shot at 1440×900 at 2×, light and dark, swapped with the theme); the plan guide's plan.md, walkthrough.md, code-check findings, reviews and the decision log's entry D-264; real runs of the install (npm, `setup`, `npx skills add`, `reel init`, on a scratch machine), `reel check`, `reel status`, `reel stops`, `reel audit` and `spec-diff` in the theme's terminal block. Each sits in a `data-artifact` container with its own words, plain words pinned on it (`data-gloss`). The rest explain with pictures: the loop, the pipeline, the hand-off and its fence, the two lanes of a revise, an explainer's ends, a pull request's video branch.
- MOTION (theme motion-language.md): a camera moves over one view clipped at y 900; things arrive by their own verb (typed, printed, wiped, drawn, pinned, lit); cut = a new chapter or a quick check, push-slide LEFT = the next scene of a chapter, crossfade = the ending. Quick-check headings (`data-question`) and cards (`data-option`) sit outside any camera, whole and still; the check's own new case is drawn first, then set aside small at the top left.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions.
- TAGS FOR spec-diff: every frame carries `- spec_section:` and, where it shows parts, `- components:`.
- Palette and type from the theme's tokens only, light and dark; one coral at a time; no gradients, glows, blur or idle drift. The final frame holds still.

## Frame 1 — A long plan

- chapter_start: What reelplanning is
- defines: agent, step
- scene: A PLAN LIKE THIS ONE: the plan guide's plan.md (803 lines) on a document page in a camera, line numbers in its gutter: its title, The problem, its five `### Step N` headings, then Open questions for the reviewer with its four questions at line 696. 'step' is pinned on Step 1's heading; the camera runs down the page to the questions; on 'question is asking' a coral '4 questions, at line 696 of 803' lands on them: you can answer them in the chat, but they sit at the end of a lot of reading.
- voiceover: "Your agent, the AI assistant that writes your code, hands you a plan like this: five steps, eight hundred lines, and four questions at the end. You can answer them right in the chat. But that's a lot to read, so it's easy to skim, and hard to see what each question is asking."
- duration: 17.675s
- transition_in: cut
- status: animated
- src: compositions/frames/01-long-plan.html
- type: hook
- blueprint: compose
- layout: document
- spec_section: Purpose
- sfx: none

narrativeRole: A long plan.
keyMessage: Your agent, the AI assistant that writes your code, hands you a plan like this:

## Frame 2 — A plan, as a video

- defines: scene, chapter, guide
- scene: THE NAME, THEN THE REAL THING: `reelplanning` typed large, then 'turns a plan into a short video' set under it; on 'a short narrated video that stops at each question', the real review page wipes in, the plan guide's video stopped at its question 2 with its three cards on the frame ('stopped at a question' pinned on it), for about four seconds; then a row of six scene cards, each a picture and a line of voice, two brackets over them naming two chapters ('scene' and 'chapter' pinned), and a page slides in under the row: 'the guide: the rest of the plan, on a page under its video'.
- voiceover: "reelplanning turns that plan into a short narrated video, which stops at each question for your answer. It's a row of scenes, each a picture and a line or two, grouped into chapters. The rest goes on a page under it, the guide."
- duration: 14.88s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-real-planning.html
- type: pain_point
- blueprint: compose
- layout: title
- spec_section: Purpose
- sfx: none

narrativeRole: A plan, as a video.
keyMessage: reelplanning turns that plan into a short narrated video, which stops at each question for your answer.

## Frame 3 — One loop for every change

- defines: plan video, review, choice, walkthrough video, system video
- scene: THE LIFECYCLE, DRAWN ON ITS WORDS: the whole loop, used in full: eight stations round it, each landing as it is said: the plan, the plan video, your review, decisions, the build (its choices noted), the walkthrough video, your review, the system video; the arrow closes back to the next plan; the system video's station is ringed on 'this one'.
- voiceover: "Used in full, every change follows one loop. The plan video tells the plan, before any code, and your review's answers become decisions. The agent builds, noting each choice it makes alone. The walkthrough video shows it running, for your review too. Then the system video, this one, catches up."
- duration: 19.061s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-the-loop.html
- type: product_intro
- blueprint: compose
- layout: loop
- spec_section: Purpose
- sfx: none

narrativeRole: One loop for every change.
keyMessage: Used in full, every change follows one loop.

## Frame 4 — How much you use

- defines: explainer
- scene: THREE LEVELS, ONE LINE EACH (the README's words), landing on their words: '1 · one video' with 'a plan video, from a plan · or an explainer, of what is already there · just the video: no guide, no record'; '2 · + a walkthrough' with 'after the build: the change, running'; '3 · + the whole pipeline' with 'your answers kept as decisions · every review on record · the system video kept current'; a coral 'you pick: each level is optional' on 'you choose', the first row lit 'the basic unit'; last, 'from here on: the whole pipeline' under the three.
- voiceover: "You choose how much of it you use. The basic unit is one video: a plan video, or an explainer, a video of something already there. Add a walkthrough after the build, if you want, or take the whole pipeline: your answers kept as decisions, every review on record, and the system video kept current. From here on, this video shows the whole pipeline."
- duration: 22.133s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03b-levels.html
- type: product_intro
- blueprint: compose
- layout: levels
- spec_section: Purpose
- components: explainer
- sfx: none

narrativeRole: How much you use.
keyMessage: You choose how much of it you use.

## Frame 5 — The skill, and which agents

- defines: plan-to-video skill
- scene: THE REAL TABLE: docs/agents.md's Support table (Agent, Status), the plan-to-video skill named over it; Claude Code's row ringed 'tested' on its word, its line saying the sandbox as shipped is untested on a normal machine; Codex's 'basic', the four untested rows marked 'open work' together.
- voiceover: "It all runs through the plan-to-video skill, the instructions your agent follows. It's tested with Claude Code, though not yet its sandboxed run on a normal machine. Codex has basic support."
- duration: 13.045s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-agents.html
- type: product_intro
- blueprint: compose
- layout: table
- spec_section: Install
- components: skill
- sfx: none

narrativeRole: The skill, and which agents.
keyMessage: It all runs through the plan-to-video skill, the instructions your agent follows.

## Frame 6 — The tooling, once per machine

- chapter_start: Installing it
- defines: reel cli
- scene: A RUN on the terminal slab, on a scratch machine: the README's `npm i -g github:ncrispino/reelplanning` typed, its output printed ('added 120 packages in 10s'), then `reelplanning --version` printing 0.2.0 and `reel --help`'s first line; a small note under the run says what really ran while the repo is private: a packed copy of this branch, `npm i -g ./reelplanning-0.2.0.tgz`; 'keeps the record' on `reel`.
- voiceover: "Installing takes four commands. First, once per machine, npm installs the tooling from GitHub. That adds `reelplanning`, and `reel`, the reel CLI, which keeps the project's record."
- duration: 12.811s
- transition_in: cut
- status: animated
- src: compositions/frames/05-install.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Install
- components: cli
- sfx: none

narrativeRole: The tooling, once per machine.
keyMessage: Installing takes four commands.

## Frame 7 — What the videos need

- scene: A REAL RUN: `reelplanning setup` typed; its check lines print one by one (node, ffmpeg, Chrome headless, Kokoro TTS, whisper.cpp, HyperFrames skills at v0.8.52, the voice's speed patch, 'reelplanning is set up'); plain words pinned on three of them on their words: 'a voice', 'captions', 'draws the frames'.
- voiceover: "Second, `reelplanning setup`, once per machine too, gets what videos need: a voice, a transcriber for captions, a browser that draws the frames, and HyperFrames' skills."
- duration: 11.339s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-setup.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Install
- components: narrate
- sfx: none

narrativeRole: What the videos need.
keyMessage: Second, `reelplanning setup`, once per machine too, gets what videos need:

## Frame 8 — The skill, into your agent

- scene: A REAL RUN: the README's `npx skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g` typed; its output prints: one skill found, plan-to-video selected, installed to every agent ('universal: … Codex …', 'symlinked: …'), 'Done!'; then `ls -l ~/.claude/skills` shows plan-to-video, linked; 'where Claude Code reads skills' pinned on it.
- voiceover: "Third, `npx skills add` copies the plan-to-video skill from that install to where Claude Code, Codex and the other agents read skills."
- duration: 9.589s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-skill.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Install
- components: skill
- sfx: none

narrativeRole: The skill, into your agent.
keyMessage: Third, `npx skills add` copies the plan-to-video skill from that install to where Claude Code, Codex and the other agents read skills.

## Frame 9 — Then, in each repo

- defines: decision log
- scene: A REAL RUN in a new repo: `reel init . --name my-app --kind brownfield --agent claude` prints its ✓ lines; `ls -p .reelplanning` lists what it wrote, each pinned with its plain word (its own description, its parts, its words, the decision log); then 'your agent: fills spec.md and system.json in from your code' lands on spec.md and system.json; a chip 'your agent runs this' over the run.
- voiceover: "Last, in each repo, `reel init` writes `.reelplanning/`: the project's description, its parts and words, the decision log: every answer you give, and the command that starts your agent when a review arrives. Your agent runs it for you, and in a repo with code, fills in the description and parts from it."
- duration: 19.381s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-init.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Install
- components: cli
- sfx: none

narrativeRole: Then, in each repo.
keyMessage: Last, in each repo, `reel init` writes `.reelplanning/`:

## Frame 10 — Quick check: a login page, built

- defines: quick check
- scene: A NEW CASE, DRAWN, THEN SET ASIDE: a login page's plan, approved (a tick on it), and a build bar run to the end; it shrinks to the top left as the question lands, and the three cards come in on their words.
- voiceover: "Quick check: your agent has finished building a login page you approved. Which video do you watch next?"
- duration: 6.859s
- transition_in: cut
- status: animated
- src: compositions/frames/09-check-loop.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Purpose
- quiz: k1
- question: Your agent has finished building a login page you approved. Which video do you watch next?
- option_a: The plan video, revised
- option_b: The walkthrough video: the page running
- option_c: The system video
- answer: b
- explain: After the build comes the walkthrough video: it shows the change running, and you review it before the system video catches up.
- walk_me_through: The plan video came first, before any code, and you approved it. Now the agent has built the login page. The next video in the loop is the walkthrough video: the page running, which you review. Only after that is the system video brought up to date.
- explained_at: 3
- option_a_why: The plan video is made before any code; once you approve it, it isn't shown again for the build.
- option_b_why: Right: after the build, the walkthrough video shows the change running, and you review it.
- option_c_why: The system video is brought up to date last, after you review the walkthrough video.
- question_more: A login page: you watched its plan video and approved it, and the agent has built it.
- sfx: none

narrativeRole: Quick check: a login page, built.
keyMessage: Quick check:

## Frame 11 — The plan, in your repo

- chapter_start: The plan and its video
- scene: HOW TO START, THEN THE REAL PLAN TEXT: the start command for each agent, or a plain ask for a plan, and 'from there, your agent runs the commands' under it; then the plan guide's step 3 as written in plan.md, on a document page: its `### Step 3` heading, the `#### Cases` table (three rows), `#### Interface` (two lines), `#### Example` (one line); then, wiping in beside it, its question 2 with options A, B and C; a chip on the page: 'as written, before question 2 was answered'; 'cases', 'interface', 'example' pinned on their headings on their words, 'a question for you' on question 2.
- voiceover: "To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan. From there, your agent runs the commands. It writes the plan into your repo as `plan.md`: a few steps, each with its cases, interface and an example, and a numbered question wherever the choice is yours."
- duration: 21.771s
- transition_in: cut
- status: animated
- src: compositions/frames/10-plan-md.html
- type: feature_showcase
- blueprint: compose
- layout: document
- spec_section: Parts
- components: skill
- sfx: none

narrativeRole: The plan, in your repo.
keyMessage: To start, type `/plan-to-video` in Claude Code, or `$plan-to-video` in Codex, or just ask your agent for a plan.

## Frame 12 — Held to what you decided

- scene: A REAL RUN: `reel check` on a fresh plan, cropped to its ✓ line (its steps, the parts it touches, no failures); then one shelf under it: 'your answers · rules', cited on each part the plan touches, or replaced with the reason; '26 in force' pinned on the run; the chip 'your agent runs this' over the run.
- voiceover: "Then `reel check` holds the plan to what you decided: your answers on each part it touches are rules it must cite, or say why it replaces one."
- duration: 9.909s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/11-reel-check.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Parts
- components: cli
- sfx: none

narrativeRole: Held to what you decided.
keyMessage: Then `reel check` holds the plan to what you decided:

## Frame 13 — From plan to video

- defines: brief, storyboard, narrate, finish-project, plan-diff, frame-lint, details check
- scene: THE PIPELINE, LIT ON ITS WORDS: outside the box, what the agent writes: BRIEF.md, STORYBOARD.md and the frames (one HTML page a scene); then the box, `reelplanning build`, holding what it runs: `narrate` (a local voice), finish-project (adds the captions and ties each scene to the plan) and the checks (frame-lint, the details check), with plan-diff under finish-project (marks the scenes that changed since the last build); ending in 'the video'; each lights as it is said; the chip 'your agent runs this' over the box.
- voiceover: "The agent writes a storyboard and the frames; `reelplanning build` voices it with a local voice, adds captions and checks every frame."
- duration: 9.077s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-making.html
- type: feature_showcase
- blueprint: compose
- layout: pipeline
- spec_section: Parts
- components: skill, narrate, finish, diff
- sfx: none

narrativeRole: From plan to video.
keyMessage: The agent writes a storyboard and the frames; `reelplanning build` voices it with a local voice, adds captions and checks every frame.

## Frame 14 — Fresh eyes, before you

- defines: fresh eyes, frame rules
- scene: THE REAL FINDINGS: two findings of the newcomer, from an earlier build of this video, as fresh-eyes/newcomer.md writes them, each with the author's answer under it ('Answer: fixed: …', 'Answer: kept: …'); two agents drawn as two chips over the page, 'newcomer' and 'designer'; under the designer's chip, two of the seven frame rules as it says them: 'one reading order', 'each name on its thing'; 'answered' pinned on each answer.
- voiceover: "Before you see it, fresh eyes look: two new agents who know nothing of the plan. One lists what a newcomer couldn't follow; the other, what breaks the frame rules, like one reading order and each name on its thing. The author answers every finding: fixed, given a meaning, or kept with a reason."
- duration: 18.315s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-fresh-eyes.html
- type: feature_showcase
- blueprint: compose
- layout: document
- spec_section: Parts
- components: skill
- sfx: none

narrativeRole: Fresh eyes, before you.
keyMessage: Before you see it, fresh eyes look:

## Frame 15 — The review page

- defines: review server, notification
- scene: THE REAL PAGE: the review page's Videos list open (Needs you, then the system video and the recent plans, each with Plan, Built and Guide); the camera pushes in on the list; 'every video in the repo' pinned on it; 'your agent starts it: reelplanning review --detach' with 'keeps running after your session ends' under it; a notification drawn beside it with its real line: '4 choices to make, 5 quick checks, … 5 min'.
- voiceover: "Your agent starts the review server, `reelplanning review`, and it keeps running after your session ends. It serves the review page, and a notification says when a video is ready: here, four choices to make and five quick checks, about five minutes."
- duration: 16.224s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/15-review-page.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: server
- sfx: none

narrativeRole: The review page.
keyMessage: Your agent starts the review server, `reelplanning review`, and it keeps running after your session ends.

## Frame 16 — Quick check: a second repo

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: a laptop with three ticks on it (the tooling, setup, the skill) and two repos beside it, the second one ringed; it shrinks to the top left as the question lands.
- voiceover: "Quick check. On a new laptop, you've run the first three commands. So in a second repo: what still has to run?"
- duration: 7.456s
- transition_in: cut
- status: animated
- src: compositions/frames/16-check-install.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Install
- quiz: k2
- question: On a new laptop, you've run the first three install commands: the tooling, setup and the skill. In a second repo, what still has to run?
- option_a: All four commands again
- option_b: Only `reel init`, which your agent can run
- option_c: `setup` again, then `reel init`
- answer: b
- explain: The tooling, setup and the skill are once per machine; each repo only needs `reel init`, and your agent runs it for you.
- walk_me_through: The npm install, setup and the skill went onto the laptop once, and every repo on it uses them. The second repo has no `.reelplanning/` folder yet. So only `reel init` runs there, and your agent runs it for you the first time you plan.
- explained_at: 9
- option_a_why: Three of the four are once per machine: the laptop already has them.
- option_b_why: Right: only `reel init` is per repo, and the agent runs it when you first plan there.
- option_c_why: setup is once per machine; it already ran on this laptop.
- question_more: Same laptop, a different project: the tooling, setup and the skill are already on it.
- sfx: none

narrativeRole: Quick check: a second repo.
keyMessage: Quick check.

## Frame 17 — The review player

- chapter_start: Reviewing in the player
- defines: review player
- scene: THE REAL PLAYER: the plan guide's plan video paused on its step 1 scene, in the review page, its own captions off; the camera moves from the frame to the timeline's chapter marks ('chapters') to the Mark and comment bar at the foot ('tied to the step on screen').
- voiceover: "Open a video, and it plays in the review player, its chapters on the timeline. Draw on a frame, or comment anywhere, and it's tied to the plan step on screen."
- duration: 10.635s
- transition_in: cut
- status: animated
- src: compositions/frames/17-player.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player
- sfx: none

narrativeRole: The review player.
keyMessage: Open a video, and it plays in the review player, its chapters on the timeline.

## Frame 18 — It stops, and you answer on the frame

- defines: own words, answer bar
- scene: THE REAL PAGE AT A QUESTION: the plan guide's question 2, 'Where does the guide open from the video?', its three cards on the frame; 'click a card' pinned on card A; the same screen with More open on card A wipes in, the camera on the popover whole; then 'Explain this more' pinned on its button in the row under the cards ('never counted as an answer'); then with own words typed; 'answer bar' pinned on the row under the cards. The camera close enough that the page's words read at 1080p.
- voiceover: "At each question the video stops, and you click a card to answer; More on a card says what picking it means. Not ready? Explain this more asks for it again, explained better. None fits? Write your own words in the answer bar."
- duration: 14.56s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-question.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player
- sfx: none

narrativeRole: It stops, and you answer on the frame.
keyMessage: At each question the video stops, and you click a card to answer; More on a card says what picking it means.

## Frame 19 — Terms, Ask, and the plan text

- defines: side panel, ask about this, plan text
- scene: THE REAL PAGE, THREE STATES, the video's own captions off: Terms open in the side panel (Case, Step, each with its meaning); then Ask about this in the same panel, a question typed; then the plan's own text beside the video with the step highlighted; each pinned on its word, the camera close on each so the page's words read at 1080p.
- voiceover: "Stuck on a word? Terms opens in the side panel. Ask about this, or Q, asks an agent about the scene. The Plan switch shows the plan text."
- duration: 10.165s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-terms-ask.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player
- sfx: none

narrativeRole: Terms, Ask, and the plan text.
keyMessage: Stuck on a word?

## Frame 20 — A quick check, and why

- scene: THE REAL PAGE: a quick check of the plan guide answered wrong: each card with its why under it, the right one marked; then Walk me through it open under the cards; 'why' pinned on a card's line.
- voiceover: "Now and then, a quick check asks what the plan will do on a new case. Once you answer, each card says why. And Walk me through it works the case through."
- duration: 9.845s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-quick-check.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player
- sfx: none

narrativeRole: A quick check, and why.
keyMessage: Now and then, a quick check asks what the plan will do on a new case.

## Frame 21 — The guide, under the video

- defines: guide
- scene: THE REAL PAGE, SCROLLED: the plan guide's guide under its video, at step 1's diagram ('What the folder you name gets', its five stages to step through) and its worked examples; the video small in the corner, still playing ('the video, small'); 'step through' pinned on the diagram's control, 'real values' on the worked example's input.
- voiceover: "Scroll down, and the guide is under the video, which keeps playing small in the corner. It holds what a video can't: every case, the interface, worked examples, and diagrams to step through."
- duration: 12.192s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/21-guide.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: guide
- sfx: none

narrativeRole: The guide, under the video.
keyMessage: Scroll down, and the guide is under the video, which keeps playing small in the corner.

## Frame 22 — A quiet way into the guide

- defines: part of the guide, open chip
- scene: THE REAL PAGE: the plan guide's own plan video, paused on its step 1 scene, whose picture leads to its part of the guide, the camera close on it: the faint arrow at its corner ringed; then the pointer over it: a thin ring and a small grey 'More in the guide ↓', pinned in a neutral colour so it isn't taken for the real thing; then the guide's step 1, where it leads; a small line beside the page: 'on a phone, or where a scene marks nothing: the Open chip in its corner'.
- voiceover: "A thing in a scene can lead to its part of the guide, quietly: a faint arrow when paused; on hover, a thin ring and More in the guide."
- duration: 8.992s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/22-quiet-mark.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player, guide
- sfx: none

narrativeRole: A quiet way into the guide.
keyMessage: A thing in a scene can lead to its part of the guide, quietly:

## Frame 23 — A note on any words

- scene: THE REAL PAGE: words selected on the guide ('Five stages: step through them…'), and the note box open on them with a note typed, Ask and Save in it; the camera pushes in on the box; 'same box as a mark' pinned on it.
- voiceover: "On the guide, select any words to leave a note, suggest an edit, or ask. It goes with the same review."
- duration: 7.136s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-note.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: guide
- sfx: none

narrativeRole: A note on any words.
keyMessage: On the guide, select any words to leave a note, suggest an edit, or ask.

## Frame 24 — Finish: approve, or ask for changes

- defines: finish, approve
- scene: THE REAL PANEL, served by the review server: Finish your review, with Approve and Request changes side by side; Approve ringed on its word ('no new video'), then Request changes ('only what changed'); then the Send button and the line under it saying who picks the review up.
- voiceover: "When you're done, press Finish. Approve, and the agent works your comments into the plan, with no new video. Request changes, and you'll see only the scenes that changed. Then press Send."
- duration: 12.021s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-finish.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Pipelines
- components: player
- sfx: none

narrativeRole: Finish: approve, or ask for changes.
keyMessage: When you're done, press Finish.

## Frame 25 — Quick check: a phrase that's flagged

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: a scene of another plan's video, the phrase 'stage map' ringed by fresh eyes, and the author's 'it's clear' beside it; it shrinks to the top left as the question lands.
- voiceover: "Quick check. Fresh eyes flag “stage map” in another video, and its author thinks it's clear. What happens before the review page opens?"
- duration: 9.141s
- transition_in: cut
- status: animated
- src: compositions/frames/25-check-fresh.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Parts
- components: skill
- quiz: k3
- question: In another plan's video, fresh eyes flag the phrase “stage map”, and its author thinks it's clear. What happens before the review page opens?
- option_a: Nothing: it opens as it is
- option_b: The author answers it: fixed, a meaning, or kept with the reason
- option_c: The build waits for you to decide
- answer: b
- explain: Every finding is answered before the page opens, fixed, given a meaning, or kept with the reason; the build won't pass one left unanswered.
- walk_me_through: Fresh eyes found “stage map” hard to follow in that video. The author may disagree, but can't ignore it. They answer it under the finding: fix the line, give the phrase a meaning you can click, or keep it and say why. Only then does the build pass and the page open.
- explained_at: 14
- option_a_why: A finding left unanswered stops the build, so the page can't open as it is.
- option_b_why: Right: the author answers every finding, and keeping it needs a reason.
- option_c_why: The author answers fresh eyes before you see the video; you aren't asked.
- question_more: Fresh eyes looked at another plan's video, and the newcomer couldn't follow “stage map”.
- sfx: none

narrativeRole: Quick check: a phrase that's flagged.
keyMessage: Quick check.

## Frame 26 — How a review arrives

- chapter_start: After you send
- defines: hosted page
- scene: THREE WAYS IN, DRAWN: Send on your machine (to the review server); a hosted page, drawn as the review page in a browser on a phone and a laptop, a link ('the review page as a link you open anywhere · Claude only'), and the review sent from it; a download, handed over; the last two filed by `reel-intake` or `reel record`, said under them.
- voiceover: "Your review reaches the agent one of three ways. Send, on your machine. Send on a hosted page: the review page as a link you open anywhere, Claude only. Or a download you hand it."
- duration: 12.576s
- transition_in: cut
- status: animated
- src: compositions/frames/26a-arrive.html
- type: feature_showcase
- blueprint: compose
- layout: flow
- spec_section: Pipelines
- components: server, cli
- sfx: none

narrativeRole: How a review arrives.
keyMessage: Your review reaches the agent one of three ways.

## Frame 27 — Who picks it up

- defines: inbox, headless run, sandbox
- scene: THE HAND-OFF, DRAWN: Send's review travels to the review server and drops into the inbox, then takes one of three paths: to a waiting session; with none, to the headless run inside a dashed fence, the sandbox, with the repo inside it; with no agent set, it waits for your next session; 'exactly once' pinned on the path out of the inbox.
- voiceover: "Sent on your machine, the review server keeps it in the inbox and hands it on once: to a waiting session; else it starts the headless run, your agent alone in the sandbox, a fence keeping its writes in your repo; else it waits for your next session."
- duration: 15.819s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/26-hand-off.html
- type: feature_showcase
- blueprint: compose
- layout: flow
- spec_section: Pipelines
- components: server, headless
- sfx: none

narrativeRole: Who picks it up.
keyMessage: Sent on your machine, the review server keeps it in the inbox and hands it on once:

## Frame 28 — Filed once, and on record

- defines: id
- scene: THE REAL RECORD, THEN WHAT BINDS: the plan guide's reviews folder (its plan review and walkthrough review, each a .json and a .md), 'never overwritten' pinned on it; the decision log's real entry D-264's heading on a page labelled decisions.md, 'an id' pinned under the id; then the whole log as one bar, 'the decision log: 309 entries', split to scale (from `reel status` and decisions.json): 65 coral, '65 rules · your answers in force', with 'binds a plan' bracketed over it; 213 grey, '213 history · the agent's choices · raised again only when a change rewrites their code'; 31 dashed, 'not in force'; then 'a plan touching the player cites all 26 of its rules' and, drawn (not a run), `reel fold player` → 'a draft: the 26 as one section of spec.md' → 'you approve' → 'plans cite spec.md#rules-player in place of 26 ids'; the chip 'your agent runs this' in the top margin.
- voiceover: "`reel record` files the review and adds each answer, with an id like D-264, to the decision log. The log keeps everything, but little of it binds a plan. Of 309, only 65 are rules: your answers in force. The agent's choices are history, back only when a change rewrites their code. And `reel fold` drafts a part's rules as one spec section; once you approve it, plans cite that instead."
- duration: 26.805s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/27-record.html
- type: feature_showcase
- blueprint: compose
- layout: document
- spec_section: Pipelines
- components: cli
- sfx: none

narrativeRole: Filed once, and on record.
keyMessage: The decision log keeps everything, but little of it binds a plan: your answers are rules, the agent's choices are history, and `reel fold` can gather a part's rules into one section of spec.md.

## Frame 29 — Only what your words touched

- defines: revise step
- scene: TWO LANES, under the name of this stage, 'the revise step': Approved, a comment going into plan.md as a line of text, and 'no new video'; Requested changes, a row of eight scenes with two lit coral, and the real line from the review page above it, 'Revised since the last build: 7 of 33 scenes changed', with 'Play just the changes'.
- voiceover: "Then the agent revises. Approved: your comments go into `plan.md`, no new video. Changes requested: only the steps your words touched are rewritten, plan-diff marks the scenes that changed, and the player plays just those."
- duration: 15.776s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/28-revise.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- spec_section: Pipelines
- components: revise, diff, player
- sfx: none

narrativeRole: Only what your words touched.
keyMessage: Then the agent revises.

## Frame 30 — Quick check: does it lead somewhere?

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: a paused scene with a table on it and a pointer moving onto the table; it shrinks to the top left as the question lands.
- voiceover: "Quick check. Paused on a scene, your pointer over its table: how do you know the table leads to the guide?"
- duration: 6.88s
- transition_in: cut
- status: animated
- src: compositions/frames/30-check-mark.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Parts
- components: player
- quiz: k4
- question: You pause on a scene with a table, and move your pointer over it. How do you know the table leads to the guide?
- option_a: A black tab is drawn on it
- option_b: A thin ring, and “More in the guide”
- option_c: Nothing: you open Terms
- answer: b
- explain: A thing that leads to the guide stays quiet: a faint arrow when paused, and on hover a thin ring and “More in the guide”.
- walk_me_through: The video is paused, so the table shows a faint arrow. Your pointer moves over it, and a thin ring and a small grey “More in the guide” appear. Click that label, and the guide opens at the table's part.
- explained_at: 22
- option_a_why: Nothing heavy is drawn on the video: no tab, only a ring and a small label on hover.
- option_b_why: Right: on hover, a thin ring and “More in the guide”; a click on that label opens it.
- option_c_why: Terms says what words mean; the table shows its own way into the guide.
- question_more: The scene is paused, and the table is the thing it's about.
- sfx: none

narrativeRole: Quick check: does it lead somewhere?.
keyMessage: Quick check.

## Frame 31 — Every choice, written down

- chapter_start: The build and its walkthrough
- defines: implement step, label
- scene: THE REAL TABLE, under the name of this stage, 'the implement step': the plan guide's walkthrough.md choices table, its header and three rows (A8, A9, A10: step, what it chose), the label at the end of each row's choice ('visible', 'hard-to-undo') pinned on its word; then a step's fifth choice is struck out and goes, as a question, to plan.md's 'Open questions for the reviewer', drawn under it: '5. … (step 3)', 'that step waits for your answer'.
- voiceover: "Once you approve, the agent builds the plan. Each choice the plan didn't cover is a row in `walkthrough.md`, with a label when you might want to look: visible, hard-to-undo, or close. At a step's fifth choice, the agent stops and asks you instead: that step waits, with a question in `plan.md`."
- duration: 20.064s
- transition_in: cut
- status: animated
- src: compositions/frames/31-implement.html
- type: feature_showcase
- blueprint: compose
- layout: table
- spec_section: Pipelines
- components: implement-step
- sfx: none

narrativeRole: Every choice, written down.
keyMessage: Once you approve, the agent builds the plan.

## Frame 32 — A second agent checks

- defines: code check, reel audit
- scene: THE REAL FINDINGS, THEN A RUN: the plan guide's code-check/findings.md, its steps (Step 4 ✓, Step 5 ✗ nothing in the diff carries …) on a document page; then `reel audit` on the plan, cropped to its ✓ line: '✓ 2026-09-28-plan-guide: 5 step(s), 7 own decision(s), 62 cited, 0 failure(s)'; 'every ✗ answered' pinned on the ✓; the chip 'your agent runs this' over the run.
- voiceover: "Then the code check: a second agent, new to the work, reads the code against the plan and your decisions. `reel audit` fails until every finding is answered."
- duration: 10.592s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/32-code-check.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Pipelines
- components: implement-step, cli
- sfx: none

narrativeRole: A second agent checks.
keyMessage: Then the code check:

## Frame 33 — The change, running

- scene: THE REAL PAGE: the plan guide's walkthrough video on its step 1 scene, the page as built, with the header's Plan and Built switch on Built; the camera pushes in on the scene; 'the real page' pinned on it, 'Plan · Built' on the switch.
- voiceover: "The walkthrough video shows each change running, the real page or a real run, before and after, in about two minutes, with its own guide."
- duration: 9.333s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/33-walkthrough.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Pipelines
- components: player
- sfx: none

narrativeRole: The change, running.
keyMessage: The walkthrough video shows each change running, the real page or a real run, before and after, in about two minutes, with its own guide.

## Frame 34 — What pauses it

- defines: reel stops, off-plan change, late fix
- scene: A REAL RUN: `reel stops` on the plan guide prints its calls, each 'pauses' or 'listed' and why (A1 visible, A4 hard-to-undo, A5 close · listed, D1 an off-plan change always pauses); each kind lit as it is said; its last line, '10 call(s) pause, 4 on the list', pinned: 'pause: a choice that stops the video; several can share one scene'; 'late fix' drawn as a chip on its words beside the run; the chip 'your agent runs this' over the run.
- voiceover: "`reel stops` decides what pauses it: an off-plan change, where the agent strayed from the plan; a choice labelled visible or hard-to-undo; and one sharing a label with a recent late fix: something a review let through, changed later."
- duration: 16.075s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/34-what-pauses.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Parts
- components: cli
- sfx: none

narrativeRole: What pauses it.
keyMessage: `reel stops` decides what pauses it:

## Frame 35 — A pause, and the list

- defines: grouped scene
- scene: THE REAL PAGE, TWO STATES, the camera close enough that the page's words read at 1080p: a pause, choices A8 and A9 each on its card with Accept and Flag; then the list at the end, four choices one line each with its own Flag, and Go on; 'Accept · Flag' pinned on a card, 'Go on' on its button; a small line beside the page: 'older videos: a grouped scene per chapter'.
- voiceover: "A pause shows the choice running, with Accept and Flag. Every other choice is on one list at the end, each with a Flag."
- duration: 8.16s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-stop-list.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: player
- sfx: none

narrativeRole: A pause, and the list.
keyMessage: A pause shows the choice running, with Accept and Flag.

## Frame 36 — What was built, and the fix

- defines: walkthrough fix step
- scene: THE REAL PAGE, TWO STATES, the camera close and below the guide's header (its count of choices left out): the walkthrough's guide, its Built side at step 1 (the real run of `reelplanning guide`, what it reads and writes); then Finish, served by the review server, with the open question 'Seeing it run, anything you'd change?' above Approve and Request changes, and Send; 'real runs' pinned on the run; 'the walkthrough fix step' named over the Finish.
- voiceover: "Under it, the guide's Built side shows what changed, with the real runs. Finish asks again: anything you'd change? Flag a choice, and the agent fixes the code and its row."
- duration: 12.064s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-built.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- spec_section: Parts
- components: guide, fix-step
- sfx: none

narrativeRole: What was built, and the fix.
keyMessage: Under it, the guide's Built side shows what changed, with the real runs.

## Frame 37 — Quick check: sent at night

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: a repo set up for Claude Code, a clock at 11 pm, Send pressed, and an empty chair where a session would be; it shrinks to the top left as the question lands.
- voiceover: "Quick check. In a repo set up for Claude Code, you press Send at eleven at night, with no session open. What happens to your review?"
- duration: 8.928s
- transition_in: cut
- status: animated
- src: compositions/frames/37-check-send.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Pipelines
- components: server, headless
- quiz: k5
- question: In a repo set up for Claude Code (`reel init --agent claude`), you press Send at 11 pm, and no agent session is open. What happens to your review?
- option_a: It's lost
- option_b: It waits for your next session
- option_c: The headless run starts on it, in the sandbox
- answer: c
- explain: With no session waiting, the review server starts the headless run on it, inside the sandbox.
- walk_me_through: The review server keeps your review in the inbox, then hands it on once. No session is waiting at eleven at night. So the server starts the headless run, your agent on its own, inside the sandbox, and it works on your review.
- explained_at: 27
- option_a_why: Nothing is lost: the review server keeps it in the inbox first.
- option_b_why: It waits for your next session only in a repo set up with `--agent none`, which has no command to start; here the headless run starts.
- option_c_why: Right: no session is waiting, so the headless run starts, inside the sandbox.
- question_more: Your agent's chat is closed for the night; the review server is still running, and the repo's config names `claude` as its agent.
- sfx: none

narrativeRole: Quick check: sent at night.
keyMessage: Quick check.

## Frame 38 — All of it, as text

- chapter_start: What's kept
- scene: THE REAL FOLDER: `.reelplanning/` as this repo has it, printed as a tree (spec.md, system.json, glossary.md, decisions.md, config.json, theme/, system-video/, plans/<date>-<name>/ with plan.md, reviews/, walkthrough.md, code-check/, runs/, video/, walkthrough-video/); 'text, committed' marks the text; 'on your machine' the inbox; 'built again' the guides, the voice and the renders, each on its line.
- voiceover: "The record is text in your repo, under `.reelplanning/`: the spec, the parts, the glossary, the decision log, and each plan's `plan.md`, reviews, `walkthrough.md` and video sources. The inbox stays on your machine; guides and video files are built again, never committed. This repo's own older plans still hold theirs, until its public history leaves them out."
- duration: 23.605s
- transition_in: cut
- status: animated
- src: compositions/frames/38-stored.html
- type: feature_showcase
- blueprint: compose
- layout: tree
- spec_section: Conventions
- components: cli
- sfx: none

narrativeRole: All of it, as text.
keyMessage: The record is text in your repo, under `.reelplanning/`:

## Frame 39 — This video, kept current

- defines: part of the system, spec-diff, system-review
- scene: THREE FILES, THEN A REAL RUN: spec.md, system.json and glossary.md as three cards ('the parts of the system' pinned on system.json); then `spec-diff` printing what this spec change touched and the first scenes to rebuild; last, system-review sorting a comment three ways: the video is wrong (fix the frame), a small change (a one-step plan), a choice (a new plan). Last, the spec.md card lit: 'no guide yet: the rest is in spec.md'; the chip 'your agent runs this' over the run.
- voiceover: "This video is made from three of those files: `spec.md`; `system.json`, the parts of the system and how they connect; and the glossary, each word with a scene. When they change, spec-diff names the scenes to rebuild. system-review sorts each comment on it: fix the video, a small change, or a new plan. This video has no guide yet: `spec.md` holds the rest."
- duration: 23.712s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/39-system-video.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Parts
- components: system-video
- sfx: none

narrativeRole: This video, kept current.
keyMessage: This video is made from three of those files:

## Frame 40 — What your reviews teach

- defines: memory, retro
- scene: A REAL RUN: the end of `reel status` on this repo: 'What reviews show', its lines (recommended: taken on 45 of 47 questions; rewinds; checks), then '△ a retro is due'; 'worked out each time' pinned on the block, 'retro' on its line. The chip 'your agent runs this' over the run.
- voiceover: "Your reviews teach it too: `reel status` ends with the memory, lines worked out from the log and your reviews, like how often you take the recommendation. When evidence piles up, a retro proposes skill edits."
- duration: 14.325s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/40-memory.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- spec_section: Parts
- components: cli
- sfx: none

narrativeRole: What your reviews teach.
keyMessage: Your reviews teach it too:

## Frame 41 — Explain first

- scene: A PICTURE: a question in your words ('what changed on this branch?'), the sources it pins (a branch, a log, a session), a video with no question marks on it, and its three ends, Done, Explain more, Plan this, each landing on its word.
- voiceover: "Not ready to plan? `reelplanning explain` makes an explainer: a video of something already there, every fact from a named source. It ends with Done, Explain more, or Plan this."
- duration: 12.085s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/41-explainer.html
- type: feature_showcase
- blueprint: compose
- layout: flow
- spec_section: Parts
- components: explainer
- sfx: none

narrativeRole: Explain first.
keyMessage: Not ready to plan?

## Frame 42 — More people

- scene: A PICTURE: a big pull request, its walkthrough video on a branch of its own, `video/pr-12`, beside it (never merged), the maintainer's review ringed ('counts'); `reel pr-check` under it, saying where it stands.
- voiceover: "With more people, a big pull request gets its own walkthrough video, on a branch of its own, and the maintainer's review is the one that counts."
- duration: 9.525s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/42-others.html
- type: feature_showcase
- blueprint: compose
- layout: flow
- spec_section: Several people
- components: cli
- sfx: none

narrativeRole: More people.
keyMessage: With more people, a big pull request gets its own walkthrough video, on a branch of its own, and the maintainer's review is the one that counts.

## Frame 43 — Quick check: three choices in step six

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: step six's three choices as three rows, one labelled visible, one close, one with no label; it shrinks to the top left as the question lands.
- voiceover: "Quick check. Step six has three choices: one labelled visible, one close, one with no label, and no recent late fixes. Which of them pause the walkthrough video?"
- duration: 11.061s
- transition_in: cut
- status: animated
- src: compositions/frames/43-check-stops.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Parts
- components: cli
- quiz: k6
- question: In step 6, the agent made three choices: one labelled visible, one labelled close, one with no label; no late fixes lately. Which of them pause the walkthrough video?
- option_a: All three
- option_b: Only the visible one
- option_c: The visible and the close one
- answer: b
- explain: A choice labelled visible or hard-to-undo pauses; close and unlabelled choices go on the list at the end, unless a recent late fix shares their label.
- walk_me_through: The visible choice changes what you see, so it pauses in the scene that runs it. The close one has no recent late fix sharing its label, so it goes on the list at the end. The unlabelled one goes on the list too. That's one pause.
- explained_at: 34
- option_a_why: Unlabelled choices never pause: they go on the list at the end.
- option_b_why: Right: only visible or hard-to-undo pause, with no late fix lately.
- option_c_why: Close pauses only when a recent late fix shares its label; here there's none.
- question_more: Step six of some plan, and the labels the agent gave its choices.
- sfx: none

narrativeRole: Quick check: three choices in step six.
keyMessage: Quick check.

## Frame 44 — Quick check: a new part

- scene: A NEW CASE, DRAWN, THEN SET ASIDE: system.json with a new part, 'scheduler', added, and a new glossary row for it; it shrinks to the top left as the question lands.
- voiceover: "Quick check. A walkthrough you accept adds a new part, the scheduler, to the parts and the glossary. What happens to this video?"
- duration: 8.011s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/44-check-current.html
- type: social_proof
- blueprint: compose
- layout: quiz
- spec_section: Parts
- components: system-video
- quiz: k7
- question: You accept a walkthrough that adds a new part, the scheduler, to the project's parts and its glossary. What happens to this video?
- option_a: Nothing: it's a record
- option_b: spec-diff names scenes to rebuild, and one explains the scheduler
- option_c: It's made again from scratch
- answer: b
- explain: A change to those files makes spec-diff name the scenes to rebuild, and every word in the glossary gets a scene.
- walk_me_through: The walkthrough was accepted, so the parts and the glossary now name the scheduler. spec-diff compares them with what this video covers and names the scenes to rebuild. And since every word in the glossary has a scene, one is added for the scheduler.
- explained_at: 39
- option_a_why: This video is kept current: a change to its three files names scenes to rebuild.
- option_b_why: Right: spec-diff names the scenes, and the new word gets a scene of its own.
- option_c_why: Only the scenes spec-diff names are rebuilt, not the whole video.
- question_more: The scheduler is a new part, with a row in the glossary.
- sfx: none

narrativeRole: Quick check: a new part.
keyMessage: Quick check.

## Frame 45 — reelplanning, in one picture

- scene: THE ENDING, HELD STILL: the loop from scene 3, small, every station lit; three lines land on their words: a plan you watch and answer, a build you watch and accept, a record that keeps everything.
- voiceover: "That's reelplanning: a plan you watch and answer, a build you watch and accept, and a record that keeps everything. Install it, ask your agent for a plan, and watch."
- duration: 10.72s
- transition_in: crossfade
- status: animated
- src: compositions/frames/45-end.html
- type: cta
- blueprint: compose
- layout: ending
- spec_section: Purpose
- sfx: none

narrativeRole: reelplanning, in one picture.
keyMessage: That's reelplanning:

