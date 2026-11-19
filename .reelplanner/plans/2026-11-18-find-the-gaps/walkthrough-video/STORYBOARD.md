---
title: "Find the gaps: what was built"
format: 1920x1080
duration: 200s
message: "Find the gaps is built, steps 1 to 5, shown running in a scratch repo: a round's cards held to their rules and a fresh checker's reading (step 1; A2, A3, A4, A20 pause); the round on the review page, a card turned over to the code's lines (step 2; A7, A9, A10, A13); your own words on a say card (step 3; A11, A12, A19); one record, and where each settled gap goes (step 4; A1, A5, A6, A8); a wrong quick check settling the same way, and reel status counting rounds (step 5; A14 to A18). One deviation: step 5 was built past its fifth choice before asking (D1); the question is open as the plan's question 5."
arc: what landed; a check on step 1; step 1 running (A2, A3, A4, A20); step 2 the page (A7, A9, A10, A13); step 3 your words (A11, A12, A19); a check on step 4; step 4 the record (A1, A5, A6, A8); step 5 quick checks and status (A14 to A18); the deviation D1; what ran and what is not done; the ending
audience: the repo owner, who asked for a way to line up their picture of the code with the code and with the agent, answered the plan's four questions (D-314 to D-317) and approved it; watched its plan video and knows the review page
mode: autonomous
music: none
plan_dir: .reelplanner/plans/2026-11-18-find-the-gaps
terms: round = a short set of cards, at most six, about one topic, written where you and the agent likely picture the code differently; card = one question in a round: predict (what the code does, answered before you see its lines), assume (what the agent assumes you want) or say (how you think it works, in your own words); fresh checker = a new agent that never saw this conversation and answers each predict card from the code's lines alone; pinned = kept as it was when the round was made, so a card quotes only what the code said then; gap = a place where your picture and the code, or the agent's, disagree; claim = a stretch of your own words that says one thing about the code; fingerprint = a short code worked out from some lines of a file, which changes when one character of them changes; You told me first = the section of a plan that lists what a round settled, so the plan is written on it; Got it = settling a gap where the code is right: it goes into your memory; Change the plan = settling a gap where you want it your way: it goes into the plan; The code is wrong = settling a gap as a bug: it becomes a fix; Show me more = settling a gap by asking for more: a longer explanation now, and one short video of the round's gaps; whisper = the speech-to-text program the narration already uses, run on this machine; scratch repo = a new git repo made just for these runs, so nothing in this one changed; inbox = the folder where a review waits for the agent session that takes it; headless run = the agent started on its own, with nobody watching, to work on a review; deviation = a place the build did otherwise than the plan or a decision says
terms_check: strict
details_check: strict
before: system#part 3 | the plan and its video, with the plan-to-video skill, the reel CLI, the review server
before: system#part 7 | what's kept, with the reel CLI, the explainer
before: 2026-09-26-contributing | decisions D-306, D-171, D-200, D-201, D-202, D-213, D-215, D-305, D-310, D-311, D-312: how does the decision log scale to thousands of decisions?
before: 2026-09-27-walkthroughs-that-help | decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-306, D-171, D-200, D-201, D-202, D-213, D-215, D-305, D-310, D-311, D-312: how does the decision log scale to thousands of decisions?
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
recap: 2026-09-28-videos-that-make-sense | Videos that make sense: fresh eyes before you watch, a way…: decisions D-226, D-225, D-227, D-245, D-303: how do you find out what a phrase means?
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170, D-247, D-304: who reviews each arm, and in what order?
recap: 2026-09-28-plan-guide | The plan guide: the video first, and a full page behind it…: decisions D-244, D-246, D-264, D-266: which is the source: plan.md, or the guide?
recap: 2026-09-29-explain-first | Explain first: a video of what is going on, before any plan: decisions D-248, D-249, D-250: after Plan this, how far does the plan lean on the…
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-142, D-167, D-166: which accent colour?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-110, D-109, D-309: a step reaches its fifth call during the build. What does…
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-128, D-129: where is "you watched it" kept?
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-082, D-085: what may a run nobody is watching do?
recap: 2026-09-27-details-in-the-frame | Details in the frame: click the thing a detail explains: decisions D-195, D-196: where does a detail open once you click the thing?
recap: 2026-10-11-codex-first-class | Codex as a first-class reelplanner agent: decision D-313: how far should remote reviews go?; explains "headless"
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decision D-001: who checks that the code followed the plan?
recap: 2026-09-28-videos-that-make-sense--walkthrough | Videos that make sense: fresh eyes before you watch, a way…: decision D-232: ask about this opens in the side panel (where Terms and…
recap: 2026-09-22-richer-review | Richer review: more kinds of question, comments on marks…: decision D-005: which video-only feedback comes first?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
---

## Video direction

- THE CHANGE RUNNING (decision D-219): real runs in a scratch repo and the real round page and player, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a2, a3, a4, a20 (3); a7, a9, a10, a13 (4); a11, a12, a19 (5); a1, a5, a6, a8 (7); a14, a15, a16, a17, a18 (8); the deviation d1 on its own beat (9). Nothing on the list.
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the scene that runs it: k1 (2) before the checker stops a card (3); k2 (6) before the record routes a skipped card (7).
- MOTION: things revealed by their own verb (typed, turned over, ringed); cut = a part or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Headings data-question, option cards data-option, choice cards data-call, still in the scene's last seconds.
- PLAIN WORDS (decision D-127): choice, scene, quick check; tool names in code markup.

## Frame 1 — What landed

- chapter_start: What landed
- guide: what-changed
- defines: agent, round, card, gap, fresh checker
- scene: THE MAP (the real change, git diff 95a5bdb..HEAD, one row a file): scripts/align.mjs · the command; scripts/lib/align.mjs · cards, checks, the record; scripts/lib/align-server.mjs · the round on the review server; packages/player/align-page.html · the round's page; scripts/review.mjs · opens a round; packages/player/reelplanner-player.js · a quick check settles; scripts/lib/review-scope.mjs · what a settled check asks; skills/plan-to-video/SKILL.md · when a round runs
- voiceover: "Find the gaps, built. A plan could rest on a wrong picture of the code. Now you first answer a few cards; once answered, each turns over to show the code's lines, and settle each gap, where your picture and the code disagree. A fresh checker, a new agent with only those lines, must read each predict card as it does, or the check stops: the agent rewrites the card once, or drops it."
- duration: 21.205s
- transition_in: cut
- status: outline
- src: compositions/frames/01-what-landed.html
- layout: table
- focal: eight files, one plain line each
- sfx: none

## Frame 2 — Quick check · The checker reads it otherwise

- plan_step: 1
- defines: quick check, step
- scene: THE CASE ON A LINE ABOVE: 'card c2 says B · the fresh checker reads A'; the heading and three cards land, still
- voiceover: "Quick check. The fresh checker reads card c2's lines as A. The card says B. What does the check do?"
- duration: 6.016s
- transition_in: cut
- status: outline
- src: compositions/frames/02-quick-check-the-checker-reads-it-otherwi.html
- layout: cards
- quiz: k1
- question: The fresh checker reads card c2's lines as A; the card says B. What does `align --check` do?
- option_a: Passes, with a warning
- option_b: Stops: rewrite the card once, or drop it
- option_c: Shows you both answers
- answer: b
- explain: A card reaches you only when the fresh checker reads its lines as the card does; otherwise the check stops, and the card is rewritten once or dropped.
- walk_me_through: The card says B. The checker, with only the lines, says A. One of them has the code wrong, and you would learn whichever the card says. So the check stops: the card is rewritten once from its lines, and dropped if they still disagree.
- explained_at: 01-what-landed
- option_a_why: A warning would let a card that teaches the agent's wrong picture reach you.
- option_b_why: The check fails on the card: rewrite it once from its lines, or drop it.
- option_c_why: You never see a card the two read differently; a dropped one is only listed after the round.
- focal: three options
- sfx: none

## Frame 3 — Step 1 · Cards, checked twice

- chapter_start: Step 1: a round's cards
- plan_step: 1
- guide: step-1
- defines: pinned, scratch repo, call
- autonomy: a2, a3, a4, a20
- scene: A REAL RUN (runs/align-checker.txt, runs/align-check-quote.txt), a terminal: `reelplanner align <round> --check --no-checker` with '✗ c2: its quote is not in src/send.mjs:3-5 word for word'; then '--check' with '✗ c2: the checker read the lines as A, the card says B: rewrite it once'; then '✓ 3 cards, 0 failure(s)'. Each ✗ ringed as said. At the right, the choice cards A2, A3, A4, A20 (data-call)
- voiceover: "In a scratch repo, a card quotes a line one word off: stopped. The checker reads c2 as A: stopped, rewrite it once, else drop it. It reads B: it passes. My choices, each a card at the right: the checker's question mark stops a card too. No checker answer, no round. One range of lines a card. A round finds its repo from its own folder, in any clone."
- duration: 20.309s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-step-1-cards-checked-twice.html
- layout: terminal
- focal: the checker's ✗, then ✓
- sfx: none

## Frame 4 — Step 2 · The round on the page

- chapter_start: Step 2: on the review page
- plan_step: 2
- guide: step-2
- defines: review, review server, inbox, headless run
- autonomy: a7, a9, a10, a13
- scene: REAL SCREEN, the round page from a scratch repo's review server: the card's front ('No session is waiting and a command is set. Where does the review go?', A B C), then the same card turned over (your pick A dashed in coral, the answer B in ink, src/send.mjs lines 2 to 6 on the navy slab, the why, 'A gap. Settle it:' and its four buttons), each ringed as said. At the right, the choice cards A7, A9, A10, A13 (data-call)
- voiceover: "On the review page: no session waiting, a command set, where does the review go? Pick A, the inbox; it turns over to B, a headless run, with its line. A gap. What you skip is listed in the plan as assumed, not checked. My choices: each answer is routed once. The page has its own address. A round's Send never starts a headless run. A settled card moves on."
- duration: 20.139s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/04-step-2-the-round-on-the-page.html
- layout: shot
- focal: the card turned over
- sfx: none

## Frame 5 — Step 3 · Your own words

- chapter_start: Step 3: in your own words
- plan_step: 3
- guide: step-3
- defines: claim, whisper
- autonomy: a11, a12, a19
- scene: REAL SCREEN, the say card on the round page: 'Say how you think a review is handed on.', the words typed in ('It goes to my session. If I'm not there it waits in the inbox for me.'), the microphone button and Check; under it three claims marked ✓ match, ✗ a gap, ? neither. At the right, the choice cards A11, A12, A19 (data-call)
- voiceover: "On a say card, hold Space and talk. Whisper writes it down here, and the session that opened the page checks each claim: a match, a gap, or a want, asked back as an assume card. My choices: your words reach it as a question. Speech stays on this machine. The recording is thrown away once written down."
- duration: 17.152s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-step-3-your-own-words.html
- layout: shot
- focal: your words, then their claims
- sfx: none

## Frame 6 — Quick check · A card you skipped

- plan_step: 4
- defines: memory
- scene: THE CASE ON A LINE ABOVE: 'c2 · Got it · c3 · skipped'; the heading and three cards land, still
- voiceover: "Quick check. You settle c2 with Got it, and skip c3. Where does c3 go?"
- duration: 4.587s
- transition_in: cut
- status: outline
- src: compositions/frames/06-quick-check-a-card-you-skipped.html
- layout: cards
- quiz: k2
- question: You settle card c2 with Got it, and skip c3. Where does c3 go?
- option_a: Into your memory, as known
- option_b: Into the plan, as Assumed, not checked
- option_c: Nowhere
- answer: b
- explain: A skipped card is listed in the plan as Assumed, not checked, so the plan says what it took for granted; only Got it goes into your memory.
- walk_me_through: You never answered c3, so nothing is known about your picture there. The plan should not pretend it is settled. So c3 is listed in the plan, under Assumed, not checked, and only c2, with Got it, goes into your memory.
- explained_at: 04-step-2-the-round-on-the-page
- option_a_why: Your memory takes only what you settled with Got it.
- option_b_why: What you skip is listed in the plan as Assumed, not checked.
- option_c_why: Nothing a round asked is lost: a skipped card is still listed.
- focal: three options
- sfx: none

## Frame 7 — Step 4 · Where each gap goes

- chapter_start: Step 4: settle each gap
- plan_step: 4
- guide: step-4
- defines: You told me first, fingerprint, Got it, explainer
- autonomy: a1, a5, a6, a8
- scene: A REAL RUN (runs/align-record.txt), a terminal: `reelplanner align record <round> answers.json` with 'c1 → You told me first, in a line', 'c2 → your memory, asked once more on a new case from 2026-11-21', 'c3 → Assumed, not checked'; then the plan's first lines with '## You told me first' and '## Assumed, not checked' before '### Step 1', each ringed as said. At the right, the choice cards A1, A5, A6, A8 (data-call)
- voiceover: "Record it: c1, an assume card you called right, into the plan's You told me first; c2, Got it, into your memory, asked again three days on; c3, skipped, assumed, not checked. My choices: what you know is a marked line in your memory file. A due thing comes back as a new card. You told me first sits before the steps. Show me more's video is one explainer command."
- duration: 20.117s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/07-step-4-where-each-gap-goes.html
- layout: terminal
- focal: three answers, three places
- sfx: none

## Frame 8 — Step 5 · Quick checks, and the count

- chapter_start: Step 5: into the loop
- plan_step: 5
- guide: step-5
- defines: Change the plan, Show me more, miss, plan video
- autonomy: a14, a15, a16, a17, a18
- scene: REAL SCREEN, the player on a quick check answered wrong: 'Not quite, it is B.', then Got it, Change the plan (pressed, coral), Show me more, and the box relabelled 'Change the plan: how should it work?' holding 'retries should stop after three', ringed as said; below it a real run (runs/reel-status-rounds.txt): 'rounds: 1, gaps: 1 (Got it 1)' and 'too few plans to compare (1 with a round, 0 with a likely gap and none; 5 of each)'. At the right, the choice cards A14 to A18 (data-call)
- voiceover: "Every video changes too: a wrong quick check settles the same way, and Change the plan's box takes your words. Reel status counts rounds, and compares late fixes with and without one, from five plans each. My choices: a header line records a round, the question next. A late fix counts once. The buttons sit in the check's box. Got it sends no rewrite. Show me more with no example asks again."
- duration: 21.867s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/08-step-5-quick-checks-and-the-count.html
- layout: shot
- focal: the four ways under a wrong answer
- sfx: none

## Frame 9 — Off the plan · Step 5 went on

- plan_step: 5
- defines: deviation
- autonomy: d1
- scene: THE DEVIATION CARD D1 (data-call), large: 'Step 5 built past its fifth choice before asking (decision D-110)'; beside it the plan's question 5 as it reads, 'Where is it kept whether a round ran first, or was skipped?', with its three options and 'built as A until you answer'
- voiceover: "One thing went off the plan: a step's fifth choice should stop and ask. Step five went on, and asked after: where is it kept whether a round ran? A, a header line, as built; B, a command; C, the rounds alone. Answer it in the plan."
- duration: 12.992s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/09-off-the-plan-step-5-went-on.html
- layout: card
- focal: what went off the plan
- sfx: none

## Frame 10 — What ran, and what is not done

- chapter_start: What ran
- defines: code check
- scene: TWO COLUMNS: 'ran' with npm test, align.spec 53 checks, align-page.spec 37, quiz.spec 54, and the code check's findings answered; 'not done' with the four items, each a line
- voiceover: "What ran: the fast suite, two new specs, and a code check, its findings fixed or listed. Not done, all from the approved plan: words shown live as you talk, a diagram on Show me more, later videos skipping what you know, and a round before a real plan."
- duration: 14.443s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/10-what-ran-and-what-is-not-done.html
- layout: list
- focal: what ran, what is not done
- sfx: none

## Frame 11 — The ending

- open_question: Seeing it run, anything you'd change?
- scene: THE ROUND CARD, small, turned over, beside the line 'Seeing it run, anything you'd change?'. Holds still
- voiceover: "That's find the gaps, running. Seeing it run, anything you'd change?"
- duration: 3.435s
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-the-ending.html
- layout: card
- focal: the ask
- sfx: none
