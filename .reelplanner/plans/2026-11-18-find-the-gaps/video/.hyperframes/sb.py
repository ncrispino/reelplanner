#!/usr/bin/env python3
"""Writes STORYBOARD.md and SCRIPT.md for the find-the-gaps plan video from one list of frames."""
import re, sys
VD = sys.argv[1]

FRONT = """---
title: "Find the gaps: line up your picture, the agent's and the code"
format: 1920x1080
duration: 330s
message: "Five steps, four questions. A round of a few cards where a gap is likely and costly, checked against the code (step 1), answered with a key on the review page and turned over to show the code (step 2; question 1: where the cards show first, recommended the review page). Your own words split into claims and checked (step 3; question 2: who checks them, recommended the waiting session). One click settles each gap, each to its place (step 4; question 3: when a card you got comes back, recommended only when its lines change). The round in the loop (step 5; question 4: how often, recommended when a gap is likely and costly)."
arc: your words; three pictures, three gaps; earlier plans (new viewers); today and the four changes; step 1 three kinds of card; step 1 choosing and the checker; step 2 predict, then the code; question 1; a check on step 1; step 3 your own words; question 2; a check on step 2; step 4 settle each gap; question 3; a check on step 3; step 5 into the loop; question 4; checks on steps 4 and 5; the plan
audience: the repo owner, who asked for a way to line up their picture of the code with the code and with the agent writing it; knows the system video, the review page, quick checks, Ask about this and explainers
mode: autonomous
music: none
plan_dir: .reelplanner/plans/2026-11-18-find-the-gaps
terms: gap = a place where two of the three pictures of the code disagree: yours, the agent's, or the code itself; round = a short set of cards, at most six, about one topic, that the agent writes where a gap is likely and costly; card = one question in a round: predict, assume or say; predict card = a card that asks what the code does, holding the answer and the code's own lines, quoted; assume card = a card that says what the agent assumes you want, which only you can answer; say card = a card that asks you to explain how you think something works, in your own words; claim = a stretch of your own words that says one thing about the code, checked on its own; fingerprint = a short code worked out from some lines of a file, which changes when one character of them changes; fresh checker = a new agent that never saw this conversation and answers each predict card from the code alone; session = one conversation with your agent, open in a terminal or an app; You told me first = the section of a plan that lists what a round settled, so the plan is written on it and its video doesn't ask it again; Got it = settling a gap where the code is right: it goes into your memory as something you know; Change the plan = settling a gap where you want it your way: it goes into the plan; The code is wrong = settling a gap as a bug: it becomes a fix; Show me more = settling a gap by asking for more: a longer card now, and one short video of the round's gaps at the end; not sure = the answer when you have no picture of your own: a gap of its own kind, settled with Got it or Show me more; Skip the rest = ends a round at any time, and the cards you skipped are listed in the plan as not checked; whisper = the speech-to-text program the narration already uses, run on this machine; planned = a picture of what this plan would build: it does not exist yet; pinned = kept as it was when the round was made (the commit, and a fingerprint of each file), so a card quotes only what the code said then; config = the repo's settings file for reelplanner, `.reelplanner/config.json`; draw on a step = mark the step's row with the player's pen, to leave a note on that step; recommended = the option a question's author suggests, marked on its card
terms_check: strict
details_check: strict
before: system#part 6 | the build and its walkthrough, with the reel CLI, the review player, the review server
before: system#part 7 | what's kept, with the reel CLI, the explainer
before: 2026-09-26-contributing | decisions D-306, D-171, D-200, D-201, D-202, D-213, D-215, D-305, D-310, D-311, D-312: how does the decision log scale to thousands of decisions?
before: 2026-09-27-walkthroughs-that-help | decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
---

## Video direction

- YOUR WORDS LEAD: scene 1 is the owner's message as sent (data-artifact), quoted word for word, typos and all.
- REAL THINGS WHERE THE BRIEF PICKS THEM: the owner's words (1); the card's back, with the real lines of scripts/lib/inbox.mjs and the agent.command of .reelplanner/config.json (7); your words with their claims, beside the same real lines (13). The round, the cards and the page are planned: every frame that draws them carries a quiet 'planned' label.
- ONE RECURRING PICTURE: the triangle of three pictures (you, the agent, the code), drawn in scene 3 and brought back small where a step closes one of its sides: step 1's checker closes agent–code, step 2's card you–code, step 3's claims you–code, an assume card you–agent.
- THE CARD IS THE PRODUCT: a review-page card in the page's own look (paper, ink, one coral; EB Garamond question, Inter options, JetBrains Mono lines on the navy slab), the same card in scenes 5, 7 and 19, turned over front to back.
- MOTION LANGUAGE: revealed by its own verb (typed, turned over, marked, struck); cut = a new chapter or a quick check; push-slide LEFT = the next scene of the same chapter; push-slide UP = a question; crossfade = a branch and the ending.
- FIVE CHAPTERS: three pictures (1–4, scene 2 for new viewers only); steps 1 and 2, a round (5–12); step 3, your own words (13–18); step 4, settle each gap (19–24); step 5 and the plan (25–32).
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question headings data-question, cards data-option, whole and still.
- PLAIN WORDS: scene, chapter, choice. Words this video defines where it first says them: agent (1), review, headless run, quick check, explainer and memory (2, for new viewers), gap (3), step (4), round and card (5), fresh checker (6), claim (13), decision log (19), fingerprint (20), approve (25); the rest have their meaning in the storyboard's terms.
- The look from .reelplanner/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.
"""

F = []
def fr(title, vo, **k): F.append((title, vo, k))

fr("Your words",
   "You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.",
   defines="agent", chapter_start="Three pictures of the same code", scene="THE OWNER'S MESSAGE, AS SENT, in a data-artifact quote card (issue #57): 'basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another.' The words 'i assume it is one way when it is actually another' underlined in coral as the voice says them",
   type="hook", layout="quote", focal="your own words", transition_in="cut")
fr("Earlier plans",
   "If you're new, four things this plan builds on. Send hands your review to the agent session waiting on this page; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.",
   knowledge="new", defines="review, headless run, quick check, explainer, memory", scene="FOUR PLAIN LINES, one at a time, each with the earlier plan's name small beside it: review · Send → the waiting session, or a headless run; quick check · predict a case the video didn't show; explainer · quoted word for word; memory · a file in your home folder",
   type="product_intro", layout="list", focal="what this plan leans on")
fr("Three pictures, three gaps",
   "Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.",
   defines="gap", scene="A TRIANGLE: three nodes, 'you', 'the agent', 'the code'. Each side lights in turn with its gap written along it as the voice says it: you–code 'waits for you · a headless run takes it'; agent–code 'tries once · tries again after 15 s'; you–agent 'the agent read: any agent · you meant: your open session'",
   type="pain_point", layout="triangle", focal="the three sides, each a gap")
fr("Today, and what changes",
   "Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check.",
   defines="step", scene="LEFT: one arrow 'agent → you', labelled 'today'. RIGHT: four rows landing on their words: 'a round · steps 1, 2'; 'your own words · step 3'; 'one click a gap · step 4'; 'before a plan, and on quick checks · step 5'",
   type="product_intro", layout="list", focal="the four changes")

fr("Step 1 · Three kinds of card",
   "Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three.",
   chapter_start="Steps 1 and 2: a round", plan_step=1, guide="step-1", defines="round, card", scene="THREE PLANNED CARDS fanned out, each landing on its word, each labelled with its kind: predict · 'In this repo, you press Send and no session is waiting. What happens to the review?' with A B C; assume · 'I'm assuming you mean the session you have open'; say · 'Say how you think a review reaches the agent'. A quiet 'planned' label; a counter '3 of at most 6'",
   type="feature_showcase", layout="cards", focal="three kinds of card", transition_in="cut")
fr("Step 1 · Where gaps are likely",
   "Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six of those candidates. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone; where it disagrees, the card is fixed or dropped.",
   plan_step=1, guide="step-1", defines="fresh checker", scene="FOUR SOURCES on the left, in the narration's words (what your words take for granted; quick checks you got wrong; commits since you watched; its own assumptions) flowing into 'candidates', then 'at most 6'. One card's two lines pinned on it: 'likely wrong: in a repo with no headless command it does wait' and 'matters: step 2 of the plan'. Then the checker: card c4 'tries once' struck, 'tries again after 15 s' written in; the agent–code side of the small triangle lights",
   type="feature_showcase", layout="flow", focal="likely and costly, then checked")
fr("Step 2 · Predict, then see the code",
   "Step two, as proposed, puts the round on the review page, a card at a time. You answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it; not sure, with two. Skip the rest ends the round.",
   plan_step=2, guide="step-2", defines="not sure", scene="THE PLANNED CARD, FRONT: c3's question and three options, A ringed in coral as 'your pick'. It TURNS OVER: the back is the real thing (data-artifact): scripts/lib/inbox.mjs, lines 700–702 on the navy slab ('if (!question && !isMachineInbox(rp)) {', 'const result = await start();', 'if (result.started) return { handledBy: \"agent\", …') beside .reelplanner/config.json's '\"command\": \"claude --permission-mode auto …\"'; under them the why, 'A headless command is set, so a run starts'; your A dashed, B ringed in ink 'the answer'; a row of four buttons 'Got it · Change the plan · The code is wrong · Show me more'; a quiet 'Skip the rest'",
   type="feature_showcase", layout="before-after", focal="the card turned over", detail=None)
fr("Question 1 · Where the cards show first",
   "Question one. A: the cards show up on the review page, with a key per answer, a box to click, your spoken words, and the code on the card. B: in the chat, as the agent's questions: quickest to build, but plain text, nothing to click or say. C: both at once, twice the work. I recommend A: the page makes each answer a key press. Where do the cards show up first?",
   plan_step=2, decision="q1", transition_in="push-slide UP", type="cta", layout="cards",
   question="Where do a round's cards show up first?",
   question_more="The same round of four cards about the inbox, answered either on the review page or in the chat with your agent.",
   option_a="The review page", option_b="The chat", option_c="Both from the start",
   option_a_more="One card at a time on the review page: a key per answer, a box of a diagram to click, your spoken words (step 3), and the code's own lines on the card's back. It needs the browser open.",
   option_b_more="The agent asks each card as a question in the conversation. Quickest to build; no pointing, no voice, and the code's lines come as plain text.",
   option_c_more="One round, two ways to answer it, both built now. Twice the work before either one is good.",
   why_a="The page: a key per answer, the code turned over on the card, and your voice.",
   why_b="The chat: quickest to build, but plain text, no pointing and no voice.",
   why_c="Both now: two ways to answer, twice the work before either is good.",
   recommended="a", focal="three options, A recommended",
   scene="THE QUESTION AND THREE CARDS, still, each with a tiny drawing of where the card appears: a page card; a chat bubble; both. The recommended card carries 'recommended'")
fr("If A · on the review page", "With A, the card turns over on the page, with the code's lines on its back.",
   plan_step=2, branch="q1=a", type="benefit_highlight", layout="screen", transition_in="crossfade", focal="the card on the page",
   scene="kicker 'If A'; the planned card's back on a review page, the slab of lines on it")
fr("If B · in the chat", "With B, the agent asks each card in the chat, and the lines come back as text.",
   plan_step=2, branch="q1=b", type="benefit_highlight", layout="terminal", transition_in="crossfade", focal="the card as a chat question",
   scene="kicker 'If B'; a chat exchange: the agent's question with A B C, your 'A', and the answer as plain lines of text")
fr("If C · both from the start", "With C, the same round opens on the page and in the chat at once.",
   plan_step=2, branch="q1=c", type="benefit_highlight", layout="before-after", transition_in="crossfade", focal="one round, two places",
   scene="kicker 'If C'; the card on a page beside the same card in a chat, one line joining them 'one round'")
fr("Quick check · A card the checker disagrees with",
   "Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?",
   plan_step=1, quiz="k1", transition_in="cut", type="social_proof", layout="cards",
   question="A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?",
   option_a="Both answers, side by side", option_b="The card fixed, or no card", option_c="The card as written, with a note",
   answer="b",
   explain="Where the checker's answer differs, the agent's picture is the wrong one, so the card is fixed against the code or dropped before you see it.",
   option_a_why="You never see a card the code doesn't back; the two answers are settled before the round opens.",
   option_b_why="The checker answers from the code alone, so a card it disagrees with is fixed against the code or dropped.",
   option_c_why="A note would still show you a card whose answer the code may not back.",
   walk_me_through="The card says B. The checker read only the code and the card, and picked C. So the card's answer is not backed by the code: the agent's picture was wrong. Before the round opens, the card is fixed against the code, or dropped. You see the right card, or none.",
   explained_at=6, focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'card c2: B · checker: C'; the heading and three cards land, still")

fr("Step 3 · Your own words, checked",
   "Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. Your words are split into claims, each a stretch that says one thing, checked against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. A claim about what you want comes back as an assume card. Drawing your picture stays a separate plan.",
   chapter_start="Step 3: your own words", plan_step=3, guide="step-3", defines="claim", transition_in="cut",
   scene="YOUR WORDS typed out as said (planned page): 'When I press Send it goes to my session. If I'm not there, it waits for me. It should tell me when it's been taken.' Each claim underlined as the voice reads it: the first marked ✓ with 'inbox.mjs:673' pinned under it; the second marked ✗ in coral with 'inbox.mjs:700–705 · config.json' and a small gap card sliding out of it. 'whisper · on this machine' small by a microphone; the third sentence 'It should tell me when it's been taken.' marked '?' with 'assume card' sliding out of it; a quiet line at the foot 'drawing your picture · issue #23, a separate plan'",
   type="feature_showcase", layout="document", focal="your words, marked claim by claim")
fr("Question 2 · Who checks what you said",
   "Question two. A: the waiting agent session checks your words. It knows the code best, and takes about a minute. B: a small hosted model, called from the page: seconds, but your words leave the machine, and it sees only the pinned lines. C: the next session to take the round, after Send. I recommend A, falling back to C. So who checks your spoken words against the code?",
   plan_step=3, decision="q2", transition_in="push-slide UP", type="cta", layout="cards",
   question="Who reads your spoken explanation against the code?",
   question_more="Your 20 seconds of speech, three claims, checked against the inbox's code.",
   option_a="The waiting session", option_b="A small hosted model", option_c="The agent, after Send",
   option_a_more="The agent session waiting on the page splits your words into claims and checks each against the code. About a minute, and only with a session open; with none, it falls back to after Send.",
   option_b_more="A small hosted model, called from the page with your own key in ~/.reelplanner/.env and billed to you, as the hosted voice is, marks your claims in a few seconds. Your words go to its service, and it sees only the pinned lines, so it misses what the agent would find elsewhere.",
   option_c_more="Nothing is checked while you answer; your words go with Send, filed with the round as a review is, and the next session that takes the round marks them when it hands the round back.",
   why_a="The waiting session: it knows the code best; about a minute.",
   why_b="A small hosted model: seconds, but your words leave the machine.",
   why_c="After Send: nothing live; marked when the round comes back.",
   recommended="a", focal="three options, A recommended",
   scene="THE QUESTION AND THREE CARDS, still, each with its time on it: 'about 1 min'; 'a few seconds · hosted'; 'after Send'. The recommended card carries 'recommended'")
fr("If A · the waiting session", "With A, your claims come back marked in about a minute.",
   plan_step=3, branch="q2=a", type="benefit_highlight", layout="document", transition_in="crossfade", focal="marked in a minute",
   scene="kicker 'If A'; your three claims, marked, with '≈ 1 min' beside them")
fr("If B · a small fast model", "With B, they're marked in seconds, by a model your words are sent to.",
   plan_step=3, branch="q2=b", type="benefit_highlight", layout="document", transition_in="crossfade", focal="marked in seconds",
   scene="kicker 'If B'; your three claims, marked, '≈ 3 s', and 'sent to a hosted model' on them")
fr("If C · after Send", "With C, you see them marked only when the round comes back.",
   plan_step=3, branch="q2=c", type="benefit_highlight", layout="document", transition_in="crossfade", focal="marked later",
   scene="kicker 'If C'; your three claims unmarked, then 'round handed back' where they are marked")
fr("Quick check · Not sure",
   "Quick check. On card c five, you press N, for not sure. What comes next?",
   plan_step=2, quiz="k2", transition_in="cut", type="social_proof", layout="cards",
   question="On card c5, you press N: not sure. What comes next?",
   option_a="The next card; nothing kept", option_b="A gap: Got it or Show me more", option_c="The round ends",
   answer="b",
   explain="Not sure is a gap of its own kind, you had no picture, so the card turns over and you settle it with Got it or Show me more.",
   option_a_why="Not sure is kept: having no picture is a gap too, so it isn't skipped.",
   option_b_why="Having no picture is a gap of its own kind, settled with Got it or Show me more.",
   option_c_why="Only Skip the rest ends a round; one Not sure doesn't.",
   walk_me_through="You press N on card c5. The card still turns over, and shows the lines. You had no picture there, which is a gap of its own kind. So you settle it, with Got it or Show me more, and the next card comes.",
   explained_at=7, focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'card c5 · you press N'; the heading and three cards land, still")

fr("Step 4 · Settle each gap",
   "Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. The decision log, the record of your answers, gets them only through the plan's own questions.",
   chapter_start="Step 4: settle each gap", defines="decision log", plan_step=4, guide="step-4", transition_in="cut",
   scene="THE PLANNED CARD'S FOUR BUTTONS across the top; from each a line drawn down to where it goes, landing on its word: Got it → 'your memory · you.jsonl'; Change the plan → 'plan.md · You told me first'; The code is wrong → 'a plan step · or issue.md'; Show me more → 'one short video'. Then 'decision log' at the side, reached only from 'plan.md' by a thin line labelled 'its questions'",
   type="feature_showcase", layout="map", focal="four buttons, four places")
fr("Question 3 · When a card comes back",
   "Got it is kept with the lines' fingerprint, a short code that changes when they do. Question three. A: the same card comes back only when those lines change. B: also once more, on a new case, days later. C: whenever a plan depends on it. I recommend A: a change to the code is what makes your picture stale. When does the same card return?",
   plan_step=4, decision="q3", defines="fingerprint", transition_in="push-slide UP", type="cta", layout="cards",
   question="After Got it, when does the same card return?",
   question_more="You had card c3 wrong and pressed Got it. It is kept in your memory with inbox.mjs lines 700 to 705 at fingerprint 4b1e.",
   option_a="Only when its lines change", option_b="Once more, a few days later", option_c="Whenever a plan needs it",
   option_a_more="Known until the lines' fingerprint changes: when inbox.mjs lines 700 to 705 are edited, it may be asked again.",
   option_b_more="As A, and also once more, on a new case, a few days on, to check it stuck. About one card a round more.",
   option_c_more="Asked again each time a plan depends on it. The surest for a big change, and the most repetition.",
   why_a="Known until its lines change: nothing more to sit through.",
   why_b="Once more, later, to check it stuck: a card a round more.",
   why_c="Each time a plan leans on it: surest, most repetition.",
   recommended="a", focal="three options, A recommended",
   scene="A SMALL MEMORY LINE first: 'knows: a headless run takes it · inbox.mjs:700–705 · 4b1e', 'fingerprint' pinned on 4b1e. Then THE QUESTION AND THREE CARDS, still. The recommended card carries 'recommended'")
fr("If A · when its lines change", "With A, the card returns only after its lines change.",
   plan_step=4, branch="q3=a", type="benefit_highlight", layout="timeline", transition_in="crossfade", focal="back after an edit",
   scene="kicker 'If A'; a timeline: 'Got it · 4b1e', weeks of nothing, 'inbox.mjs edited · 9c07', 'asked again'")
fr("If B · once more, later", "With B, it returns once more, on a new case, a few days on.",
   plan_step=4, branch="q3=b", type="benefit_highlight", layout="timeline", transition_in="crossfade", focal="once more after days",
   scene="kicker 'If B'; a timeline: 'Got it', 'three days', 'a new case'")
fr("If C · whenever a plan needs it", "With C, it returns each time a plan leans on it.",
   plan_step=4, branch="q3=c", type="benefit_highlight", layout="timeline", transition_in="crossfade", focal="each plan",
   scene="kicker 'If C'; a timeline: 'Got it', then 'plan', 'asked', 'plan', 'asked'")
fr("Quick check · A want, not a fact",
   "Quick check. You say: and it should only go to the session I have open. How is that claim marked?",
   plan_step=3, quiz="k3", transition_in="cut", type="social_proof", layout="cards",
   question="You say: 'and it should only go to the session I have open.' How is that claim marked?",
   option_a="A match", option_b="A gap", option_c="Neither: an assume card",
   answer="c",
   explain="It says what you want, not what the code does, so it is neither a match nor a gap; it becomes an assume card for you to confirm.",
   option_a_why="A match needs lines that back it; a want has none.",
   option_b_why="A gap needs code that does otherwise; this is about what should be, which only you can settle.",
   option_c_why="'Should' is about what you want, so the code can't say, and it comes back as an assume card.",
   walk_me_through="The claim says 'it should only go to my session'. That is a want, not how the code works now. The code can't say whether you want it. So it is neither a match nor a gap, and becomes an assume card: you answer Right or Not quite.",
   explained_at=13, focal="three options",
   scene="THE CASE ON A LINE ABOVE, your words in quotes: 'and it should only go to the session I have open'; the heading and three cards land, still")

fr("Step 5 · Into the loop",
   "Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and runs a round when one is worth your time. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.",
   chapter_start="Step 5: into the loop", defines="approve, miss", plan_step=5, guide="step-5", transition_in="cut",
   scene="THREE PLACES in a row, each landing on its word: 'before a plan' with candidates → 'a round, if worth it'; a quick-check card with the four buttons under its answer and 'Approve · never blocked'; a planned reel status line 'rounds 3 · gaps 11 · Got it 7 · the plan 3 · a fix 1', with 'compared after 5 plans each way'",
   type="feature_showcase", layout="list", focal="three places the round goes")
fr("Question 4 · How often a round comes",
   "Question four. Take two requests: make Send reach my open session, and rename the Save button. A: a round before every plan, both included: the surest, and two minutes more each time. B: only when a gap is likely and costly, so Send gets four cards and the rename none, with a line saying why. C: only when you ask. I recommend B. So how often should a round come before a plan?",
   plan_step=5, decision="q4", transition_in="push-slide UP", type="cta", layout="cards",
   question="How often does a round come ahead of a plan?",
   question_more="Two requests: 'make Send reach my open session' (six candidates, four likely and costly) and 'rename the Save button' (one candidate, not costly).",
   option_a="Every plan on existing code", option_b="When a gap is likely and costly", option_c="Only when you ask",
   option_a_more="A round before each plan on code that exists, both requests included. About two minutes more each time, often on nothing.",
   option_b_more="Likely: one of the four places points at it. Costly: a step of the plan depends on it, or it is hard to undo. The Send change gets a round of four; the rename gets none, and its plan says so in a line. It can miss a gap the agent didn't see coming.",
   option_c_more="No round unless you say 'align me first'. Nothing changes otherwise; the gaps you didn't think to ask about stay hidden.",
   why_a="Every plan: the surest, two minutes more each time.",
   why_b="When likely and costly: none on a rename, four on Send.",
   why_c="Only when asked: the gaps you didn't think of stay hidden.",
   recommended="b", focal="three options, B recommended",
   scene="THE QUESTION AND THREE CARDS, still, each showing what the two requests get: A 'Send · 4 cards, rename · 2 cards'; B 'Send · 4 cards, rename · none'; C 'none, none'. The recommended card carries 'recommended'")
fr("If A · every plan", "With A, every plan on existing code starts with a round, a rename included.",
   plan_step=5, branch="q4=a", type="benefit_highlight", layout="list", transition_in="crossfade", focal="a round before each",
   scene="kicker 'If A'; three plans in a row, each with a round before it")
fr("If B · when it's worth it", "With B, the rename gets no round, and the change to Send gets four cards.",
   plan_step=5, branch="q4=b", type="benefit_highlight", layout="list", transition_in="crossfade", focal="a round where it matters",
   scene="kicker 'If B'; two plans: 'rename the Save button · no round', 'make Send reach my open session · 4 cards'")
fr("If C · only when you ask", "With C, a round comes only when you say: align me first.",
   plan_step=5, branch="q4=c", type="benefit_highlight", layout="list", transition_in="crossfade", focal="on request",
   scene="kicker 'If C'; a chat line 'align me first', then a round")
fr("Quick check · Two gaps, more please",
   "Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?",
   plan_step=4, quiz="k4", transition_in="cut", type="social_proof", layout="cards",
   question="In a round, you press Show me more on two gaps. How many videos are made?",
   option_a="Two, one a gap", option_b="One, at the end of the round", option_c="None; text only",
   answer="b",
   explain="Show me more opens a longer card at once, and at the end the gaps you asked about become one short video, since a video takes minutes and a card seconds.",
   option_a_why="One video a gap would mean minutes of building for each; the gaps share one.",
   option_b_why="The gaps you asked more on become one short video at the end of the round.",
   option_c_why="Text comes at once on the card, and the video comes after, at the end.",
   walk_me_through="You press Show me more on two gaps. Each card opens its longer page right away. At the end of the round, both gaps go into one short explainer video, which starts from what you expected. That is one video.",
   explained_at=19, focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'a round · Show me more on c2 and c4'; the heading and three cards land, still")
fr("Quick check · A quick check you missed",
   "Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?",
   plan_step=5, quiz="k5", transition_in="cut", type="social_proof", layout="cards",
   question="In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?",
   option_a="Your memory, as known", option_b="The agent, as a comment", option_c="Straight into the decision log",
   answer="b",
   explain="A quick check settles like a card: Change the plan's words reach the agent as a comment on that step, as Expected something else does today.",
   option_a_why="Your memory takes Got it, not Change the plan.",
   option_b_why="Change the plan's words go to the agent as a comment on the step the check tests.",
   option_c_why="Nothing goes straight into the decision log; it gets there through the plan.",
   walk_me_through="You got the check wrong and pressed Change the plan, so you want it to work your way. Your words go to the agent with the review, as a comment on the step the check tests, as Expected something else does today. The plan changes, and a decision comes only from its questions.",
   explained_at=25, focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'a video like this one · a quick check you got wrong · Change the plan'; the heading and three cards land, still")
fr("The plan",
   "That's the plan: a round of a few cards where a gap is likely, your own words checked, one click to settle each gap, and the round in the loop. Your four answers sit on the steps. Draw on any step to leave a note, or approve.",
   transition_in="crossfade", plan_questions="1, 2, 3, 4", type="cta", layout="rail",
   scene="THE RAIL OF FIVE STEPS, each with its slot for an answer (data-plan-step): step 2 · question 1; step 3 · question 2; step 4 · question 3; step 5 · question 4; the triangle small beside it, its three sides closed. Holds still",
   focal="the resolved plan")

ORDER = ["chapter_start","plan_step","guide","defines","knowledge","scene","voiceover","duration","transition_in","status","src","type","blueprint","layout"]
QK = ["decision","quiz","question","question_more","option_a","option_b","option_c","option_d","option_a_more","option_b_more","option_c_more","why_a","why_b","why_c","recommended","answer","explain","walk_me_through","explained_at","option_a_why","option_b_why","option_c_why","branch","plan_questions"]
def slug(t): return re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')[:40].strip('-')
out=[FRONT]; script=["# SCRIPT — find the gaps (plan video, five chapters)\n","**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)","**Voice settings:** default","**Voice direction:** Plain and even. A patient engineer talking to the owner: the case first, then the rule; one idea per sentence.\n","---\n"]
for i,(t,vo,k) in enumerate(F,1):
    k=dict(k); k.setdefault("transition_in","push-slide LEFT")
    words=len(vo.split()); dur=k.pop("dur",None) or round(max(5,words/3.1+0.6),3)
    if "branch" in k: dur=5
    src=f"compositions/frames/{i:02d}-{slug(t)}.html"
    lines=[f"## Frame {i} — {t}\n"]
    vals={**k,"voiceover":f'"{vo}"',"duration":f"{dur}s","status":"outline","src":src,"blueprint":"compose"}
    for key in ORDER:
        if key in vals and vals[key] is not None: lines.append(f"- {key}: {vals[key]}")
    for key in QK:
        if key in vals and vals[key] is not None: lines.append(f"- {key}: {vals[key]}")
    lines.append(f"- focal: {k.get('focal','')}"); lines.append("- sfx: none\n")
    lines.append(f"narrativeRole: {t}.\nkeyMessage: {vo.split('.')[0]}.\n")
    out.append("\n".join(lines))
    script.append(f"## Line {i} — {t} (Frame {i})\n\n**Delivery:** Plain.\n\n    {vo}\n")
open(f"{VD}/STORYBOARD.md","w").write("\n".join(out))
open(f"{VD}/SCRIPT.md","w").write("\n".join(script))
tot=sum(len(v.split()) for _,v,_ in F); br=sum(len(v.split()) for _,v,k in F if "branch" in k)
print(f"{len(F)} frames, {tot} words; played about {tot-br*2//3} words ≈ {(tot-br*2//3)/3.1/60:.1f} min")
