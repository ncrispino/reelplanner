#!/usr/bin/env python3
"""Writes STORYBOARD.md and SCRIPT.md for the find-the-gaps walkthrough video from one list of frames."""
import re, sys
VD = sys.argv[1]
FRONT = """---
title: "Find the gaps: what was built"
format: 1920x1080
duration: 200s
message: "Find the gaps is built, steps 1 to 5, shown running in a scratch repo: a round's cards held to their rules and a fresh checker's reading (step 1; A2, A3, A4, A20 pause); the round on the review page, a card turned over to the code's lines (step 2; A7, A9, A10, A13); your own words on a say card (step 3; A11, A12, A19); one record, and where each settled gap goes (step 4; A1, A5, A6, A8); a wrong quick check settling the same way, and reel status counting rounds (step 5; A14 to A18). One deviation: step 5 was built past its fifth choice before asking (D1); the question is open as the plan's question 5."
arc: what landed; a check on step 1; step 1 running (A2, A3, A4, A20); step 2 the page (A7, A9, A10, A13); step 3 your words (A11, A12, A19); a check on step 4; step 4 the record (A1, A5, A6, A8); step 5 quick checks and status (A14 to A18); the deviation D1; what ran and what is not done; the ending
audience: the repo owner, who asked for a way to line up their picture of the code with the code and with the agent, answered the plan's four questions (D-314 to D-317) and approved it; watched its plan video and knows the review page
mode: autonomous
music: none
plan_dir: .reelplanner/plans/2026-11-18-find-the-gaps
terms: round = a short set of cards, at most six, about one topic, written where you and the agent likely picture the code differently; card = one question in a round: predict (what the code does, answered before you see its lines), assume (what the agent assumes you want) or say (how you think it works, in your own words); fresh checker = a new agent that never saw this conversation and answers each predict card from the code's lines alone; pinned = kept as it was when the round was made, so a card quotes only what the code said then; gap = a place where your picture and the code, or the agent's, disagree; claim = a stretch of your own words that says one thing about the code; fingerprint = a short code worked out from some lines of a file, which changes when one character of them changes; You told me first = the section of a plan that lists what a round settled, so the plan is written on it; Got it = settling a gap where the code is right: it goes into your memory; Change the plan = settling a gap where you want it your way: it goes into the plan; The code is wrong = settling a gap as a bug: it becomes a fix; Show me more = settling a gap by asking for more: a longer explanation now, and one short video of the round's gaps; whisper = the speech-to-text program the narration already uses, run on this machine; live words = your words written as you speak, by the browser's own speech recognition, which some browsers do on their maker's servers; scratch repo = a new git repo made just for these runs, so nothing in this one changed; inbox = the folder where a review waits for the agent session that takes it; headless run = the agent started on its own, with nobody watching, to work on a review; deviation = a place the build did otherwise than the plan or a decision says
terms_check: strict
details_check: strict
before: system#part 3 | the plan and its video, with the plan-to-video skill, the reel CLI, the review server
before: 2026-09-27-walkthroughs-that-help | decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
---

## Video direction

- THE CHANGE RUNNING (decision D-219): real runs in a scratch repo and the real round page and player, every change scene a real thing (decision D-166).
- THE PAUSES `reel stops` prints: a2, a3, a4, a20 (3); a7, a9, a10, a13 (4); a11, a12, a19 (5); a1, a5, a6, a8 (7); a14, a15, a16, a17, a18 (8); the deviation d1 on its own beat (9). Nothing on the list.
- QUICK CHECKS WHERE THERE IS SOMETHING TO PREDICT (decision D-222), just before the scene that runs it: k1 (2) before the checker stops a card (3); k2 (6) before the record routes a skipped card (7).
- MOTION: things revealed by their own verb (typed, turned over, ringed); cut = a part or a quick check; push-slide LEFT = the next scene; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Headings data-question, option cards data-option, choice cards data-call, still in the scene's last seconds.
- PLAIN WORDS (decision D-127): choice, scene, quick check; tool names in code markup.
"""
F = []
def fr(title, vo, **k): F.append((title, vo, k))

fr("What landed",
   "A plan could rest on a wrong picture of the code, so before one, when a gap is likely and costly, or when you ask, you answer a few cards; each turns over to the code's lines, and you settle each gap. A fresh checker, a new agent with only those lines, must read each predict card as it does, or the check stops: the agent rewrites the card once, or drops it.",
   chapter_start="What landed", guide="what-changed", defines="agent, round, card, gap, fresh checker",
   scene="THE MAP (the real change, git diff 95a5bdb..HEAD, one row a file): scripts/align.mjs · the command; scripts/lib/align.mjs · cards, checks, the record; scripts/lib/align-server.mjs · the round on the review server; packages/player/align-page.html · the round's page; scripts/review.mjs · opens a round; packages/player/reelplanner-player.js · a quick check settles; scripts/lib/review-scope.mjs · what a settled check asks; skills/plan-to-video/SKILL.md · when a round runs",
   layout="table", focal="eight files, one plain line each", transition_in="cut")
fr("Quick check · The checker reads it otherwise",
   "Quick check. The fresh checker reads card c2's lines as A. The card says B. What does the check do?",
   plan_step=1, quiz="k1", transition_in="cut", layout="cards", defines="quick check, step",
   question="The fresh checker reads card c2's lines as A; the card says B. What does `align --check` do?",
   option_a="Passes, with a warning", option_b="Stops: rewrite the card once, or drop it", option_c="Shows you both answers",
   answer="b",
   explain="A card reaches you only when the fresh checker reads its lines as the card does; otherwise the check stops, and the card is rewritten once or dropped.",
   option_a_why="A warning would let a card that teaches the agent's wrong picture reach you.",
   option_b_why="The check fails on the card: rewrite it once from its lines, or drop it.",
   option_c_why="You never see a card the two read differently; a dropped one is only listed after the round.",
   walk_me_through="The card says B. The checker, with only the lines, says A. One of them has the code wrong, and you would learn whichever the card says. So the check stops: the card is rewritten once from its lines, and dropped if they still disagree.",
   explained_at="01-what-landed", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'card c2 says B · the fresh checker reads A'; the heading and three cards land, still")
fr("Step 1 · Cards, checked twice",
   "A quote one word off is stopped. The checker reads c2 as A: stopped, rewrite it once. It reads B: it passes. My choices, each boxed at the right: the checker's question mark stops a card too. No checker answer, no round. One range of lines a card. A round finds its repo from its own folder.",
   chapter_start="Step 1: a round's cards", plan_step=1, guide="step-1", autonomy="a2, a3, a4, a20", defines="pinned, scratch repo, call",
   scene="A REAL RUN (runs/align-checker.txt, runs/align-check-quote.txt), a terminal: `reelplanner align <round> --check --no-checker` with '✗ c2: its quote is not in src/send.mjs:3-5 word for word'; then '--check' with '✗ c2: the checker read the lines as A, the card says B: rewrite it once'; then '✓ 3 cards, 0 failure(s)'. Each ✗ ringed as said. At the right, the choice cards A2, A3, A4, A20 (data-call)",
   layout="terminal", focal="the checker's ✗, then ✓")
fr("Step 2 · The round on the page",
   "On the page: no session waiting, a command set, where does it go? Pick A, the inbox; it turns over to B, a headless run, with its line: a gap. A point card: click a box of its diagram. What you skip is listed in the plan as assumed, not checked. My choices: each answer is routed once. The page has its own address. Sending a round never starts a headless run. A settled card moves on.",
   chapter_start="Step 2: on the review page", plan_step=2, guide="step-2", autonomy="a7, a9, a10, a13", defines="review, review server, inbox, headless run",
   scene="REAL SCREEN, the round page from a scratch repo's review server: the card's front ('No session is waiting and a command is set. Where does the review go?', A B C), then the same card turned over (your pick A dashed in coral, the answer B in ink, src/send.mjs lines 2 to 6 on the navy slab, the why, 'A gap. Settle it:' and its four buttons), each ringed as said. At the right, the choice cards A7, A9, A10, A13 (data-call)",
   layout="shot", focal="the card turned over")
fr("Step 3 · Your own words",
   "On a say card, hold Space and talk: whisper writes it down here, or, with the switch on, your browser shows live words. A fresh checker reads the session's marks first: a match, a gap, or a want. My choices: your words reach the session as a question. Speech stays on this machine. The recording is thrown away once written down.",
   chapter_start="Step 3: in your own words", plan_step=3, guide="step-3", autonomy="a11, a12, a19", defines="claim, whisper, live words",
   scene="REAL SCREEN, the say card on the round page: 'Say how you think a review is handed on.', the words typed in ('It goes to my session. If I'm not there it waits in the inbox for me.'), the microphone button and Check; under it three claims marked ✓ match, ✗ a gap, ? neither. At the right, the choice cards A11, A12, A19 (data-call)",
   layout="shot", focal="your words, then their claims")
fr("Quick check · A card you skipped",
   "Quick check. You settle c2 with Got it, and skip c3. Where does c3 go?",
   plan_step=4, quiz="k2", transition_in="cut", layout="cards", defines="memory",
   question="You settle card c2 with Got it, and skip c3. Where does c3 go?",
   option_a="Into your memory, as known", option_b="Into the plan, as Assumed, not checked", option_c="Nowhere",
   answer="b",
   explain="A skipped card is listed in the plan as Assumed, not checked, so the plan says what it took for granted; only Got it goes into your memory.",
   option_a_why="Your memory takes only what you settled with Got it.",
   option_b_why="What you skip is listed in the plan as Assumed, not checked.",
   option_c_why="Nothing a round asked is lost: a skipped card is still listed.",
   walk_me_through="You never answered c3, so nothing is known about your picture there. The plan should not pretend it is settled. So c3 is listed in the plan, under Assumed, not checked, and only c2, with Got it, goes into your memory.",
   explained_at="04-step-2-the-round-on-the-page", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'c2 · Got it · c3 · skipped'; the heading and three cards land, still")
fr("Step 4 · Where each gap goes",
   "Record it: c1, called right, into the plan's You told me first; c2, Got it, into your memory; c3, skipped, assumed, not checked. My choices: what you know is a marked line in your memory file. A due thing comes back as a new card. You told me first sits before the steps. Show me more's video is one explainer. The agent draws a card's diagram. A later video is warned where it shows what you know.",
   chapter_start="Step 4: settle each gap", plan_step=4, guide="step-4", autonomy="a1, a5, a6, a8, a21, a22", defines="You told me first, fingerprint, Got it, explainer, Show me more",
   scene="A REAL RUN (runs/align-record.txt), a terminal: `reelplanner align record <round> answers.json` with 'c1 → You told me first, in a line', 'c2 → your memory, asked once more on a new case from 2026-11-21', 'c3 → Assumed, not checked'; then the plan's first lines with '## You told me first' and '## Assumed, not checked' before '### Step 1', each ringed as said. At the right, the choice cards A1, A5, A6, A8 (data-call)",
   layout="terminal", focal="three answers, three places")
fr("Step 5 · Quick checks, and the count",
   "A wrong quick check in any video settles the same way, and Change the plan's box takes your words. Reel status counts rounds. My choices: a header line records a round, asked in the plan. A late fix counts once. The buttons sit in the check's box. Got it sends no rewrite. Show me more with no example asks again.",
   chapter_start="Step 5: into the loop", plan_step=5, guide="step-5", autonomy="a14, a15, a16, a17, a18", defines="Change the plan, miss, plan video",
   scene="REAL SCREEN, the player on a quick check answered wrong: 'Not quite, it is B.', then Got it, Change the plan (pressed, coral), Show me more, and the box relabelled 'Change the plan: how should it work?' holding 'retries should stop after three', ringed as said; below it a real run (runs/reel-status-rounds.txt): 'rounds: 1, gaps: 1 (Got it 1)' and 'too few plans to compare (1 with a round, 0 with a likely gap and none; 5 of each)'. At the right, the choice cards A14 to A18 (data-call)",
   layout="shot", focal="the four ways under a wrong answer")
fr("Off the plan · Step 5 went on",
   "One thing went off the plan: a step's fifth choice should stop and ask. Step five went on, then asked: where is it kept whether a round ran? A, a header line, as built; B, a command; C, the rounds alone.",
   plan_step=5, autonomy="d1", defines="deviation", transition_in="cut",
   scene="THE DEVIATION CARD D1 (data-call), large: 'Step 5 built past its fifth choice before asking (decision D-110)'; beside it the plan's question 5 as it reads, 'Where is it kept whether a round ran first, or was skipped?', with its three options and 'built as A until you answer'",
   layout="card", focal="what went off the plan")
fr("Off the plan · Step 4 went on",
   "And the same on step four: its fifth choice, who writes what Show me more opens, was built before you answered. That is question six: A, the agent, as built; B, the tool, from the lines; C, no diagram.",
   plan_step=4, autonomy="d2", transition_in="crossfade",
   scene="THE DEVIATION CARD D2 (data-call), large: 'Step 4 built past its fifth choice before asking (decision D-110)'; beside it the plan's question 6, 'Who writes what a card opens on Show me more, its longer text and its diagram?', with its three options and 'built as A until you answer'",
   layout="card", focal="the second thing off the plan")
fr("What ran, and what is not done",
   "What ran: the fast suite, two new specs, the microphone end to end. Not done: live words in a real browser, and a round before a real plan.",
   chapter_start="What ran", defines="code check",
   scene="TWO COLUMNS: 'ran' with npm test, align.spec 53 checks, align-page.spec 37, quiz.spec 54, and the code check's findings answered; 'not done' with the four items, each a line",
   layout="list", focal="what ran, what is not done")
fr("The ending",
   "Seeing it run, anything you'd change?",
   transition_in="crossfade", open_question="Seeing it run, anything you'd change?",
   scene="THE ROUND CARD, small, turned over, beside the line 'Seeing it run, anything you'd change?'. Holds still",
   layout="card", focal="the ask")

ORDER = ["chapter_start","plan_step","guide","defines","autonomy","open_question","scene","voiceover","duration","transition_in","status","src","layout"]
QK = ["quiz","question","option_a","option_b","option_c","answer","explain","walk_me_through","explained_at","option_a_why","option_b_why","option_c_why"]
def slug(t): return re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')[:40].strip('-')
out=[FRONT]; script=["# SCRIPT — find the gaps (walkthrough video)\n","**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)","**Voice settings:** default","**Voice direction:** Plain and even: the change running, then each choice in a clause.\n","---\n"]
for i,(t,vo,k) in enumerate(F,1):
    k=dict(k); k.setdefault("transition_in","push-slide LEFT")
    words=len(vo.split()); dur=round(max(5,words/3.1+0.6),3)
    src=f"compositions/frames/{i:02d}-{slug(t)}.html"
    lines=[f"## Frame {i} — {t}\n"]
    vals={**k,"voiceover":f'"{vo}"',"duration":f"{dur}s","status":"outline","src":src}
    for key in ORDER:
        if key in vals and vals[key] is not None: lines.append(f"- {key}: {vals[key]}")
    for key in QK:
        if key in vals and vals[key] is not None: lines.append(f"- {key}: {vals[key]}")
    lines.append(f"- focal: {k.get('focal','')}"); lines.append("- sfx: none\n")
    out.append("\n".join(lines))
    script.append(f"## Line {i} — {t} (Frame {i})\n\n**Delivery:** Plain.\n\n    {vo}\n")
open(f"{VD}/STORYBOARD.md","w").write("\n".join(out))
open(f"{VD}/SCRIPT.md","w").write("\n".join(script))
tot=sum(len(v.split()) for _,v,_ in F)
print(f"{len(F)} frames, {tot} words ≈ {tot/3.1/60:.1f} min")
