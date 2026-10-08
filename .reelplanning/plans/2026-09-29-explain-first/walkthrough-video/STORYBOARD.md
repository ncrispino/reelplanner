---
title: "Explain first: what was built"
format: 1920x1080
duration: 225s
message: "Explain first is built, steps 1 to 5, shown running: sources pinned by form and shape with no list of kinds (step 1); reelplanning explain on a real experiment folder, and the Explainer row on the review page (step 2; A1, A10 pause); Finish's three ends, Explain more and Plan this each offering what it would mean for this video, the review filed and the decision log unchanged (step 3; A9, A13 pause); Plan this and Before you watch (step 4; A12 pauses); check-sources passing, failing on a retyped line, stopping on a key until it is masked, and the fact check (step 5; A6, A7 pause). Seven choices pause, six are the list."
arc: the map; step 1's sources and shapes; step 2's command run; a check; the page's row (A1, A10); step 3's Finish (A9, A13); a check; the review filed; step 4's Plan this (A12); step 5's check-sources; a check; the key stopping the build, masked, and the checker (A6, A7); what ran; the list; the open question
audience: the repo owner, who asked for explainers, answered question 1 in their own words (D-250) and approved this plan
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-29-explain-first
terms: explainer = a video of something already there, made when you ask, so you understand it before deciding anything; pin = to record a source exactly as it was (its commit, or its hash), so the video can only say what it held; hash = a short fingerprint of a file's contents: change one letter and it changes; shape = how a source is laid out: a sequence of entries in time order, a set of files, a table of rows, or plain text; guide part = the whole of a source, organized to read, opened from the scene that shows it; mask = to replace a secret in the text itself, as ghp_…REDACTED, so it is never committed; decision log = the record of every answer to a plan's questions (decisions.md); Needs you = the review page's list of what waits on you; the list = one sheet at a walkthrough's end: the choices that do not pause, one line each with its own Flag; code check = a second, fresh agent reading the change against the plan; fresh eyes = two fresh agents, a newcomer and a designer, that look at a video before you do, given only what a viewer gets; ledger = the decision log, as `reel` calls it in its output; reel prereqs = the command that writes a video's Before you watch lines; snapshot = a video of how things stood at one commit, never updated after; open threads = what an explainer's sources leave open or unsettled, listed in its explain.md, which Finish offers as plans to start from; explain.md = an explainer's own notes: what you asked, what it covers and leaves out, and its open threads; long sources = sources far longer than a video can show (over about 200 lines), each with a guide part
plain: range, token
terms_check: strict
details_check: strict
before: system#part 3 | the review page, with the review player, the plan-to-video skill, the review server, finish-project
before: 2026-09-27-walkthroughs-that-help | decisions D-222, D-224, D-219, D-221, D-223: does the walkthrough test you?; explains "the list"
before: 2026-09-28-plan-guide | decisions D-228, D-229, D-230, D-244, D-246: where does the guide open from the video?; explains "guide"
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-222, D-224, D-219, D-221, D-223: does the walkthrough test you?; explains "the list"
recap: 2026-09-28-plan-guide | The plan guide: the video first, and a full page behind it…: decisions D-228, D-229, D-230, D-244, D-246: where does the guide open from the video?; explains "guide"
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-166, D-142, D-167: which scenes must show the real thing?; explains "look"
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-200, D-213, D-215: how much does a PR ask of its contributor?; explains "ci"
recap: 2026-09-28-videos-that-make-sense | Videos that make sense: fresh eyes before you watch, a way…: decisions D-225, D-226, D-227, D-245: what becomes of a fresh-eyes finding nobody has answered?
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-065, D-064, D-082: when a system-video comment asks for the system itself to…
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-194, D-195, D-196: what shows that a thing on the frame opens a page?
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-003, D-001: when does the system video update?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decision D-106: where does your memory across repos live?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
recap: 2026-09-26-better-visuals--walkthrough | Better visuals: show the real thing, and a page that reads…: explains "verdict"
---

## Video direction

- THE CHANGE RUNNING (decision D-219): real runs in a scratch clone and the real review page, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a1, a10 (5); a9, a13 (6); a12 (9); a6, a7 (12), each on the scene that shows it running; the list `a2, a3, a11, a8, a4, a5` (14). No off-plan change.
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the scene that runs it: k1 (4) before the row's "commits since" (5); k2 (7) before the review is filed (8); k3 (11) before the key stops the build (12). They are the three the owner missed on the plan video, now shown running.
- FIVE PARTS: what landed (1–2); ask for one (3–5); review it, then plan (6–9); honest and private (10–12); what ran (13–15).
- MOTION: things revealed by their own verb (typed, wiped, ringed, pinned); cut = a part or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing below y 945. Headings `data-question`, option cards `data-option`, choice cards `data-call`, still in the scene's last seconds.
- PLAIN WORDS (decision D-127): choice, scene, the list, quick check; tool names in code markup.

## Frame 1 — What landed: its map

- guide: what-changed
- chapter_start: What landed
- defines: explainer
- scene: THE MAP (the real change, one row a file): a label 'git diff 43f0e00.. · this plan's code'; seven rows, each a path in mono and a plain line
- voiceover: "Explain first, built. You can now ask for a video of something that's already there, before any plan: a part of the repo, a branch, a transcript, a log, last night's experiment. Seven files carry it, one line each."
- duration: 12.139s
- transition_in: cut
- status: animated
- src: compositions/frames/01-landed.html
- layout: table
- focal: seven files, one plain line each

## Frame 2 — Step 1: no kinds, only sources

- plan_step: 1
- guide: step-1
- defines: pin, shape, guide part
- scene: REAL THING: five sources from three real runs, one row each: its id, its shape, its size, and 'a guide part' on the two over 200 lines; a heading 'no list of kinds: sources, by shape'
- voiceover: "Step one. As you asked, there's no list of kinds. The command knows sources. Each is pinned by what it is, a file, a commit range, a log, and described by its shape: a sequence, files, a table, or text. A source over two hundred lines gets a guide part. That's its size, never its kind."
- duration: 16.811s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-step-1-sources.html
- layout: table
- focal: the shapes, and the rule by size

## Frame 3 — Step 2: the command, run

- chapter_start: Ask for one
- plan_step: 2
- guide: explain
- defines: hash, snapshot
- scene: TERMINAL: the real `reelplanning explain "what did last night's experiment show?" ~/runs/0929` run and its three lines; the two sources pinned outside the repo
- voiceover: "Step two, running. `reelplanning explain` takes your question and what holds the answer; here, last night's experiment, a folder outside the repo. Each file is pinned by its path, hash and line count, never its text. It's a snapshot: asked again, you get a new folder, and nothing is ever rebuilt."
- duration: 16.363s
- transition_in: cut
- status: animated
- src: compositions/frames/03-step-2-explain.html
- layout: terminal
- focal: the two sources pinned, never their text

## Frame 4 — Quick check: seven commits later

- plan_step: 2
- quiz: k1
- question: On Monday you ask about the review server. By Friday, seven commits have changed it. What plays on Friday?
- option_a: A video rebuilt from Friday's code
- option_b: Monday's video, "7 commits since"
- option_c: Nothing, until you rebuild it
- answer: b
- explain: An explainer is a snapshot of the commit it explains: it plays as it was built, and its row says how many commits have landed since.
- option_a_why: Nothing rebuilds an explainer: asked again, you get a new one beside it.
- option_b_why: Right: Monday's video, as it was built, and the row says seven commits since.
- option_c_why: It plays as it was built; the row only says how far the repo has moved.
- walk_me_through: On Monday the command pinned the review server's files at Monday's commit. Seven commits land by Friday. On Friday the page plays Monday's video, unchanged, and its row says "7 commits since". To see Friday's code explained, you ask again, and a new explainer sits beside the old one.
- explained_at: 3
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. On Monday you ask about the review server. By Friday, seven commits have changed it. What plays on Friday?"
- duration: 11s
- transition_in: cut
- status: animated
- src: compositions/frames/04-qc-seven-commits.html
- layout: quiz
- focal: the question and three predictions

## Frame 5 — Step 2: its row, and choices A1 and A10

- plan_step: 2
- guide: explainer-row
- autonomy: a1, a10
- defines: Needs you
- scene: REAL SCREEN, two crops of the review page's Videos list, in the narration's order: after its review, its own row ('3:17 · explained at a523e4e, 5 commits since · planned: waiting-reviews'), its status ringed, and under it the page's address for it, '?project=2026-09-29-review-server--explainer', with the choice card A1 (data-call) beside; then, before you watch it, under Needs you ('Explainer · Explain the review server · to review · 4 min'), ringed, with the choice card A10 beside
- voiceover: "On the review page, it's a row of its own: its length, the commit it explains, five commits since, and the plan it led to. Two choices. Its name is its folder's plus “explainer”, as a walkthrough's is. And it waits under Needs you until you've watched it."
- duration: 13.888s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-step-2-row.html
- layout: shot
- focal: the row, and 'commits since'

## Frame 6 — Step 3: Finish, and choices A9 and A13

- chapter_start: Review it, then plan
- plan_step: 3
- guide: finish
- autonomy: a9, a13
- defines: decision log
- scene: REAL SCREEN: the player's Finish panel on the review server's explainer, after a viewer rewound scene 2 twice and commented on scene 3: the three ends, Explain more and Plan this each led by this video's own suggestion ('For instance, go deeper on how a claim stops a second run …, the part you rewound'); Plan this picked, its three suggestions (from the comment, and the explainer's two open threads), one picked and filling 'What do you want next?'; each ringed as it is said; the choice cards A9 and A13 (data-call) at the right
- voiceover: "Step three. Finish on an explainer has three ends: Done, Explain more, and Plan this, and nothing goes into the decision log. The last two aren't templates any more. Each lists what it could mean for this video, from its scenes, its long sources and its open threads, and from what you did while watching: the scene you rewound, your comment. Pick one, edit it, or write your own; it goes with the review. Two choices: that box is on every explainer's Finish, and Done still comes first."
- duration: 23.595s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-3-finish.html
- layout: shot
- focal: the three ends

## Frame 7 — Quick check: this looks wrong

- plan_step: 3
- quiz: k2
- question: You comment "this looks wrong" on an explainer and press Done. What goes into the decision log?
- option_a: One entry, for the comment
- option_b: Nothing
- option_c: An entry marked unclear
- answer: b
- explain: The decision log holds only answers to a plan's questions; an explainer asks none, so a comment is kept with its review.
- option_a_why: A comment is not an answer: it is filed with the review, by its scene.
- option_b_why: Right: nothing. The comment is kept in the review, and reaches a plan only through Plan this.
- option_c_why: Unclear is how a plan's question asks to be explained again; an explainer asks no question.
- walk_me_through: You wrote "this looks wrong" on scene two and pressed Done. `reel record` files your review beside the explainer, with the comment under scene two. The decision log holds answers to a plan's questions, and this video asked none, so it does not change. Press Plan this instead, and the comment is quoted in the new plan's problem.
- explained_at: 6
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. You comment “this looks wrong” on an explainer and press Done. What goes into the decision log?"
- duration: 10s
- transition_in: cut
- status: animated
- src: compositions/frames/07-qc-this-looks-wrong.html
- layout: quiz
- focal: the question and three predictions

## Frame 8 — Step 3: the review, filed

- plan_step: 3
- guide: step-3
- scene: TERMINAL: the real `reel record` run on the review-server explainer: filed as explainer-<time>, 'ledger: nothing added', 'decision log: 250 before, 250 after'; under it the filed .md: 'Comments by scene', '- Scene 2 … "this looks wrong"'
- voiceover: "`reel record` files it beside the explainer: your comment by scene, your question and its answer. The decision log held two hundred and fifty decisions before, and the same after. Only an answer to a plan's question goes there."
- duration: 12.757s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/08-step-3-filed.html
- layout: terminal
- focal: 250 before, 250 after

## Frame 9 — Step 4: Plan this, and choice A12

- plan_step: 4
- guide: plan-this
- autonomy: a12
- scene: REAL THING: the draft plan.md's first lines, titled by what was picked at Finish ('# Make a waiting review easy to see on the page', 'Explained first: `2026-09-29-review-server`', the quoted comment by scene, 'Picked at Finish: …') and `reel prereqs`' first line ('before: 2026-09-29-review-server--explainer | …'); the choice card A12 (data-call) at the right
- voiceover: "Step four, Plan this. `reel new-plan --from` titles the draft with what you picked, names the explainer, and quotes what you said, by scene. `reel prereqs` puts the explainer first under Before you watch, so the plan video starts at what changes. One choice: with no plan file, it writes a draft, the problem only."
- duration: 17.707s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/09-step-4-plan-this.html
- layout: before-after
- focal: the explainer, first

## Frame 10 — Step 5: every quote against its source

- chapter_start: Honest and private
- plan_step: 5
- guide: check-sources
- scene: TERMINAL: two real `check-sources` runs on the review-server explainer: '✓ check-sources: 2 scenes, 3 quoted pieces against 4 pinned sources'; between them the source's line 77 with 'by' marked, and the quote retyped without it; then '✗ scene 2 · quoted line not in scripts/lib/inbox.mjs:77-83'
- voiceover: "Step five. `build` now runs `check-sources`. Every quoted line must be in its source, word for word, as it was when it was pinned. Retype one, and the build fails. And a secret anywhere in the text stops it."
- duration: 11.819s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-5-check-sources.html
- layout: terminal
- focal: passes, then fails on the retyped line

## Frame 11 — Quick check: an access key

- plan_step: 5
- quiz: k3
- question: A CI log's explainer quotes a line holding a GitHub access key. What does the build do?
- option_a: Blurs it on the scene
- option_b: Stops until it is masked
- option_c: Warns, and builds
- answer: b
- explain: The explainer's text is committed, so a blur would leave the key in it; the build stops until the text itself is masked.
- option_a_why: A blur is on the picture only: the key would still be in the committed frames.
- option_b_why: Right: it stops, naming the scene, until the text says ghp_…REDACTED.
- option_c_why: A secret is never a warning: once committed, it is in the history for good.
- walk_me_through: The CI log's line 97 printed a GitHub token. The explainer's frame quotes it. `check-sources` finds the token in the frame's text and stops the build, naming scene two and the key's kind only. You replace it in the text with ghp_…REDACTED, and the build goes on.
- explained_at: 10
- scene: QUICK CHECK: the heading (data-question), three cards (data-option a to c)
- voiceover: "Quick check. A CI log's explainer quotes a line holding a GitHub access key. What does the build do?"
- duration: 10s
- transition_in: cut
- status: animated
- src: compositions/frames/11-qc-access-key.html
- layout: quiz
- focal: the question and three predictions

## Frame 12 — Step 5: the key, and choices A6 and A7

- plan_step: 5
- guide: step-5
- autonomy: a6, a7
- defines: mask
- scene: TERMINAL: the real run on the CI explainer: '✗ scene 2 · a GitHub token in its text (ghp_…): the build stops until the text itself is cut or masked (ghp_…REDACTED)'; then masked, '✓ check-sources: 2 scenes, 3 quoted pieces against 1 pinned source'; the choice cards A6 and A7 (data-call) at the right
- voiceover: "Here it is. The key stops the build, named by its kind only, never printed. Masked in the text, it passes; a blur would leave it in what's committed. Two choices: that holds anywhere in the video's text, not just in quotes. And where a source is far longer than the video, a third fresh agent checks the narration against the sources."
- duration: 17.92s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-step-5-key.html
- layout: terminal
- focal: stopped, then masked and passing

## Frame 13 — What ran

- guide: tests
- chapter_start: What ran
- defines: code check
- scene: WHAT RAN: rows: '`npm test` · every fast spec passes · explainer.spec new', 'code check · 3 steps missing, all three built since', '`reel audit` · passes'; 'not done · the guide parts wait for the plan guide's builder'
- voiceover: "What ran: every fast test, with a new spec, and a fresh agent's code check. It found three things the steps asked for that were missing: the row's length, Ask about this from the sources, and the plan's link back. All three are built now. Not done: the guide parts wait for the plan guide's builder."
- duration: 16.299s
- transition_in: cut
- status: animated
- src: compositions/frames/13-what-ran.html
- layout: steps
- focal: the runs, and what is not done

## Frame 14 — The list

- guide: choices
- autonomy_list: a2, a3, a11, a8, a4, a5
- scene: THE LIST: six rows (data-call), each its id and a few words
- voiceover: "The other six choices are the list: the two-hundred-line rule, how a file's shape is read, the length an explainer aims for, the end kept as its verdict, what counts as a quoted line, and what counts as a number. Flag any you'd change."
- duration: 13.227s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-the-list.html
- layout: list
- focal: six choices, one line each

## Frame 15 — Seeing it run

- open_question: Seeing it run, anything you'd change?
- scene: THE ASK: 'Seeing it run, anything you'd change?' in the serif; under it 'Say what to change in Finish, or approve the build'; holds still
- voiceover: "Seeing it run, anything you'd change? Say it in Finish, or approve the build."
- duration: 9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-end.html
- layout: ask
- focal: the open question
