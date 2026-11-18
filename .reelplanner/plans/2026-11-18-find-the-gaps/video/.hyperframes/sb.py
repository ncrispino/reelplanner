#!/usr/bin/env python3
"""Writes STORYBOARD.md and SCRIPT.md for the find-the-gaps plan video from one list of frames."""
import re, sys
VD = sys.argv[1]

FRONT = """---
title: "Find the gaps: line up your picture, the agent's and the code"
format: 1920x1080
duration: 330s
message: "Revised after your review: five steps, four decisions recorded (D-314 to D-317), nothing left to decide. One round with three ways in, the chat first (step 2, D-314); your own words checked by the waiting session (step 3, D-315); one click settles each gap, and a card you got is asked once more on a new case days later (step 4, D-316); a round before a plan only when a gap is likely and costly (step 5, D-317). The three quick checks you missed are explained again in steps 1, 2 and 3."
arc: your words; earlier plans (new viewers); three pictures, three gaps; today and the four changes; what your review changed; step 1 three kinds of card; step 1 choosing and the checker; step 2 one round, three ways in; step 2 the card on the page; a check on step 1; step 3 your own words; a check on step 2; step 4 settle each gap; step 4 asked once more; a check on step 3; step 5 into the loop; checks on steps 4 and 5; the revised plan
audience: the repo owner, who asked for a way to line up their picture of the code with the code and with the agent writing it; knows the system video, the review page, quick checks, Ask about this and explainers
mode: autonomous
music: none
plan_dir: .reelplanner/plans/2026-11-18-find-the-gaps
terms: gap = a place where two of the three pictures of the code disagree: yours, the agent's, or the code itself; round = a short set of cards, at most six, about one topic, that the agent writes where a gap is likely and costly; card = one question in a round: predict, assume or say; predict card = a card that asks what the code does, holding the answer and the code's own lines, quoted; assume card = a card that says what the agent assumes you want, which only you can answer; say card = a card that asks you to explain how you think something works, in your own words; claim = a stretch of your own words that says one thing about the code, checked on its own; fingerprint = a short code worked out from some lines of a file, which changes when one character of them changes; fresh checker = a new agent that never saw this conversation and answers each predict card from the code alone; session = one conversation with your agent, open in a terminal or an app; You told me first = the section of a plan that lists what a round settled, so the plan is written on it and its video doesn't ask it again; Got it = settling a gap where the code is right: it goes into your memory as something you know; Change the plan = settling a gap where you want it your way: it goes into the plan; The code is wrong = settling a gap as a bug: it becomes a fix; Show me more = settling a gap by asking for more: a longer card now, and one short video of the round's gaps at the end; not sure = the answer when you have no picture of your own: a gap of its own kind, settled with Got it or Show me more; Skip the rest = ends a round at any time, and the cards you skipped are listed in the plan as not checked; whisper = the speech-to-text program the narration already uses, run on this machine; planned = a picture of what this plan would build: it does not exist yet; pinned = kept as it was when the round was made (the commit, and a fingerprint of each file), so a card quotes only what the code said then; config = the repo's settings file for reelplanner, `.reelplanner/config.json`; AskUserQuestion = Claude Code's own way for the agent to ask you a multiple-choice question in the chat; draw on a step = mark the step's row with the player's pen, to leave a note on that step; recommended = the option a question's author suggests, marked on its card
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
- FIVE CHAPTERS: three pictures and what your review changed (1–5, scene 2 for new viewers only); steps 1 and 2 (6–10); step 3 (11–12); step 4 (13–15); step 5 and the plan (16–19).
- A REVISION: the four questions are decided (D-314 to D-317) and asked no more; each step they decided says so in a line and a small 'decided' tag.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question headings data-question, cards data-option, whole and still.
- PLAIN WORDS: scene, chapter, choice. Words this video defines where it first says them: agent (1), review, headless run, quick check, explainer and memory (2, for new viewers), gap (3), step (4), round and card (5), fresh checker (6), claim (13), decision log (19), fingerprint (20), approve (25); the rest have their meaning in the storyboard's terms.
- The look from .reelplanner/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. The final frame holds still.
"""

F = []
def fr(title, vo, **k): F.append((title, vo, k))

fr("Your words",
   "You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you.", src="compositions/frames/01-your-words.html",
   defines="agent", chapter_start="Three pictures of the same code", scene="THE OWNER'S MESSAGE, AS SENT, in a data-artifact quote card (issue #57): 'basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another.' The words 'i assume it is one way when it is actually another' underlined in coral as the voice says them",
   type="hook", layout="quote", focal="your own words", transition_in="cut")
fr("Earlier plans",
   "If you're new, four things this plan builds on. Send hands your review to an agent session that is waiting for it, the one you opened this page from; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched.", src="compositions/frames/02-earlier-plans.html",
   knowledge="new", defines="review, headless run, quick check, explainer, memory", scene="FOUR PLAIN LINES, one at a time, each with the earlier plan's name small beside it: review · Send → the waiting session, or a headless run; quick check · predict a case the video didn't show; explainer · quoted word for word; memory · a file in your home folder",
   type="product_intro", layout="list", focal="what this plan leans on")
fr("Three pictures, three gaps",
   "Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying the hand-off to a waiting session once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session.", src="compositions/frames/03-three-pictures-three-gaps.html",
   defines="gap", scene="A TRIANGLE: three nodes, 'you', 'the agent', 'the code'. Each side lights in turn with its gap written along it as the voice says it: you–code 'waits for you · a headless run takes it'; agent–code 'tries once · tries again after 15 s'; you–agent 'the agent read: any agent · you meant: your open session'",
   type="pain_point", layout="triangle", focal="the three sides, each a gap")
fr("Today, and what changes",
   "Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check.", src="compositions/frames/04-today-and-what-changes.html",
   defines="step", scene="LEFT: one arrow 'agent → you', labelled 'today'. RIGHT: four rows landing on their words: 'a round · steps 1, 2'; 'your own words · step 3'; 'one click a gap · step 4'; 'before a plan, and on quick checks · step 5'",
   type="product_intro", layout="list", focal="the four changes")

fr("What your review changed",
   "Your review changed three things. One: you can answer the agent's questions three ways, in the chat with the agent alone, on this page, or in a video. Two: something you got right is asked once more, days later, on a new case. Three: you got three of this video's quick checks wrong, so what they test is now said plainly. Those were gaps too, between the video and you.",
   src="compositions/frames/04b-what-your-review-changed.html", scene="THREE ROWS landing on their words, each with its decision tag: 'one round, three ways in · decided D-314'; 'asked once more, days later · decided D-316'; 'three checks you missed · steps 1, 2, 3'. Small under them: 'question 2 and 4 kept the recommendation · D-315, D-317'",
   type="product_intro", layout="list", focal="what your review changed")
fr("Step 1 · Three kinds of card",
   "Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three.", src="compositions/frames/05-step-1-three-kinds-of-card.html",
   chapter_start="Steps 1 and 2: a round", plan_step=1, guide="step-1", guide_title="Step 1 · A round of cards", defines="round, card", scene="THREE PLANNED CARDS fanned out, each landing on its word, each labelled with its kind: predict · 'In this repo, you press Send and no session is waiting. What happens to the review?' with A B C; assume · 'I'm assuming you mean the session you have open'; say · 'Say how you think a review reaches the agent'. A quiet 'planned' label; a counter '3 of at most 6'",
   type="feature_showcase", layout="cards", focal="three kinds of card", transition_in="cut")
fr("Step 1 · Where gaps are likely",
   "Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone. Where it disagrees, the card is fixed or dropped before the round opens. You never see two answers side by side.", src="compositions/frames/06-step-1-where-gaps-are-likely.html",
   plan_step=1, guide="step-1", guide_title="Step 1 · A round of cards", defines="fresh checker", scene="FOUR SOURCES on the left, in the narration's words (what your words take for granted; quick checks you got wrong; commits since you watched; its own assumptions) flowing into 'candidates', then 'at most 6'. One card's two lines pinned on it: 'likely wrong: in a repo with no headless command it does wait' and 'matters: step 2 of the plan'. Then the checker: card c4 'tries once' struck, 'tries again after 15 s' written in; the agent–code side of the small triangle lights",
   type="feature_showcase", layout="flow", focal="likely and costly, then checked")
fr("Step 2 · One round, three ways in",
   "Step two, as you decided: one round, three ways in. First, in the chat with the agent alone: it asks each card with its own question tool, and shows the code's lines as text. That needs no page, no video, and no setup in the repo. Then the review page, which adds clicking a box on a diagram, and your voice. Then a video, where a quick check is a card. Each way writes the same record, so what comes next is the same. Drawing your picture comes later, on the page, as a plan of its own.",
   src="compositions/frames/07a-step-2-one-round-three-ways-in.html", plan_step=2, guide="step-2", guide_title="Step 2 · Three ways in", transition_in="push-slide LEFT", scene="ONE RECORD in the middle, 'align.md · one record'. Three ways landing in order on their words, left to right: 'the chat' (a planned AskUserQuestion mock: card c3's question, options A B C, then the lines as a code block); 'the review page' (the card, turned over); 'a video' (a quick check). A 'decided · D-314' tag; 'built first' on the chat",
   type="feature_showcase", layout="flow", focal="one record, three ways in")
fr("Step 2 · Predict, then see the code",
   "On the review page, a card at a time, you answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it. Not sure is kept too, never skipped: it's a gap of its own, settled with Got it or Show me more.", src="compositions/frames/07-step-2-predict-then-see-the-code.html",
   plan_step=2, guide="step-2", guide_title="Step 2 · Three ways in", defines="not sure", scene="THE PLANNED CARD, FRONT: c3's question and three options, A ringed in coral as 'your pick'. It TURNS OVER: the back is the real thing (data-artifact): scripts/lib/inbox.mjs, lines 700–702 on the navy slab ('if (!question && !isMachineInbox(rp)) {', 'const result = await start();', 'if (result.started) return { handledBy: \"agent\", …') beside .reelplanner/config.json's '\"command\": \"claude --permission-mode auto …\"'; under them the why, 'A headless command is set, so a run starts'; your A dashed, B ringed in ink 'the answer'; a row of four buttons 'Got it · Change the plan · The code is wrong · Show me more'; a quiet 'Skip the rest'",
   type="feature_showcase", layout="before-after", focal="the card turned over", detail=None)
fr("Quick check · A card the checker disagrees with",
   "Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?", src="compositions/frames/12-quick-check-a-card-the-checker-disagrees.html",
   plan_step=1, quiz="k1", transition_in="cut", type="social_proof", layout="cards",
   question="A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?",
   option_a="Both answers, side by side", option_b="The card fixed, or no card", option_c="The card as written, with a note",
   answer="b",
   explain="Where the checker's answer differs, the agent's picture is the wrong one, so the card is fixed against the code or dropped before you see it.",
   option_a_why="You never see a card the code doesn't back; the two answers are settled before the round opens.",
   option_b_why="The checker answers from the code alone, so a card it disagrees with is fixed against the code or dropped.",
   option_c_why="A note would still show you a card whose answer the code may not back.",
   walk_me_through="The card says B. The checker read only the code and the card, and picked C. So the card's answer is not backed by the code: the agent's picture was wrong. Before the round opens, the card is fixed against the code, or dropped. You see the right card, or none.",
   explained_at="06-step-1-where-gaps-are-likely", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'card c2: B · checker: C'; the heading and three cards land, still")

fr("Step 3 · Your own words, checked",
   "Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. The waiting session, as you chose, splits your words into claims, each checked against the code. Say you said: it goes to my session. A match. If I'm not there, it waits. A gap, in this repo. It should tell me when it's taken: that says should, so it's neither a match nor a gap. It comes back as an assume card, next in this same round.", src="compositions/frames/13-step-3-your-own-words-checked.html",
   chapter_start="Step 3: your own words", plan_step=3, guide="step-3", guide_title="Step 3 · Your own words", defines="claim", transition_in="cut",
   scene="YOUR WORDS typed out as said (planned page): 'When I press Send it goes to my session. If I'm not there, it waits for me. It should tell me when it's been taken.' Each claim underlined as the voice reads it: the first marked ✓ with 'inbox.mjs:673' pinned under it; the second marked ✗ in coral with 'inbox.mjs:700–705 · config.json' and a small gap card sliding out of it. 'whisper · on this machine' small by a microphone; the third sentence 'It should tell me when it's been taken.' marked '?' with 'assume card' sliding out of it; a quiet line at the foot 'drawing your picture · issue #23, a separate plan'",
   type="feature_showcase", layout="document", focal="your words, marked claim by claim")
fr("Quick check · Not sure",
   "Quick check. On card c five, you press N, for not sure. What comes next?", src="compositions/frames/18-quick-check-not-sure.html",
   plan_step=2, quiz="k2", transition_in="cut", type="social_proof", layout="cards",
   question="On card c5, you press N: not sure. What comes next?",
   option_a="The next card; nothing kept", option_b="A gap: Got it or Show me more", option_c="The round ends",
   answer="b",
   explain="Not sure is a gap of its own kind, you had no picture, so the card turns over and you settle it with Got it or Show me more.",
   option_a_why="Not sure is kept: having no picture is a gap too, so it isn't skipped.",
   option_b_why="Having no picture is a gap of its own kind, settled with Got it or Show me more.",
   option_c_why="Only Skip the rest ends a round; one Not sure doesn't.",
   walk_me_through="You press N on card c5. The card still turns over, and shows the lines. You had no picture there, which is a gap of its own kind. So you settle it, with Got it or Show me more, and the next card comes.",
   explained_at="07-step-2-predict-then-see-the-code", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'card c5 · you press N'; the heading and three cards land, still")

fr("Step 4 · Settle each gap",
   "Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. Nothing from a round goes into the decision log, the record of your answers: a plan built on it gets its decisions from its own questions.", src="compositions/frames/19-step-4-settle-each-gap.html",
   chapter_start="Step 4: settle each gap", defines="decision log", plan_step=4, guide="step-4", guide_title="Step 4 · Settle each gap", transition_in="cut",
   scene="THE PLANNED CARD'S FOUR BUTTONS across the top; from each a line drawn down to where it goes, landing on its word: Got it → 'your memory · you.jsonl'; Change the plan → 'plan.md · You told me first'; The code is wrong → 'a plan step · or issue.md'; Show me more → 'one short video'. Then 'decision log' at the side, reached only from 'plan.md' by a thin line labelled 'its questions'",
   type="feature_showcase", layout="map", focal="four buttons, four places")
fr("Step 4 · Asked once more",
   "As you decided, Got it is not the end. A few days later, it's asked once more, on a new case: other names, the same rule, so you apply it instead of remembering the answer. Got it again, and it's known until its lines change; wrong again, and it's a gap to settle. Nothing reminds you on a schedule: the first round in this repo three days or more later carries it as one more card, whatever that round is about.",
   src="compositions/frames/20b-step-4-asked-once-more.html", plan_step=4, guide="step-4", guide_title="Step 4 · Settle each gap", transition_in="push-slide LEFT", scene="A TIMELINE, ticks on the line, labels under them, left to right: 'Got it · c3'; '3 days'; 'the next round on the inbox'; 'a new case · same rule'; 'known until the lines change'. A 'decided · D-316' tag",
   type="feature_showcase", layout="timeline", focal="once more, on a new case")
fr("Quick check · A want, not a fact",
   "Quick check. You say: and it should only go to the session I have open. How is that claim marked?", src="compositions/frames/24-quick-check-a-want-not-a-fact.html",
   plan_step=3, quiz="k3", transition_in="cut", type="social_proof", layout="cards",
   question="You say: 'and it should only go to the session I have open.' How is that claim marked?",
   option_a="A match", option_b="A gap", option_c="Neither: an assume card",
   answer="c",
   explain="It says what you want, not what the code does, so it is neither a match nor a gap; it becomes an assume card for you to confirm.",
   option_a_why="A match needs lines that back it; a want has none.",
   option_b_why="A gap needs code that does otherwise; this is about what should be, which only you can settle.",
   option_c_why="'Should' is about what you want, so the code can't say, and it comes back as an assume card.",
   walk_me_through="The claim says 'it should only go to my session'. That is a want, not how the code works now. The code can't say whether you want it. So it is neither a match nor a gap, and becomes an assume card: you answer Right or Not quite.",
   explained_at="13-step-3-your-own-words-checked", focal="three options",
   scene="THE CASE ON A LINE ABOVE, your words in quotes: 'and it should only go to the session I have open'; the heading and three cards land, still")

fr("Step 5 · Into the loop",
   "Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and, as you chose, runs a round only when one is likely and costly. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change.", src="compositions/frames/25-step-5-into-the-loop.html",
   chapter_start="Step 5: into the loop", defines="approve, miss", plan_step=5, guide="step-5", guide_title="Step 5 · Into the loop", transition_in="cut",
   scene="THREE PLACES in a row, each landing on its word: 'before a plan' with candidates → 'a round, if worth it'; a quick-check card with the four buttons under its answer and 'Approve · never blocked'; a planned reel status line 'rounds 3 · gaps 11 · Got it 7 · the plan 3 · a fix 1', with 'compared after 5 plans each way'",
   type="feature_showcase", layout="list", focal="three places the round goes")
fr("Quick check · Two gaps, more please",
   "Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?", src="compositions/frames/30-quick-check-two-gaps-more-please.html",
   plan_step=4, quiz="k4", transition_in="cut", type="social_proof", layout="cards",
   question="In a round, you press Show me more on two gaps. How many videos are made?",
   option_a="Two, one a gap", option_b="One, at the end of the round", option_c="None; text only",
   answer="b",
   explain="Show me more opens a longer card at once, and at the end the gaps you asked about become one short video, since a video takes minutes and a card seconds.",
   option_a_why="One video a gap would mean minutes of building for each; the gaps share one.",
   option_b_why="The gaps you asked more on become one short video at the end of the round.",
   option_c_why="Text comes at once on the card, and the video comes after, at the end.",
   walk_me_through="You press Show me more on two gaps. Each card opens its longer page right away. At the end of the round, both gaps go into one short explainer video, which starts from what you expected. That is one video.",
   explained_at="19-step-4-settle-each-gap", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'a round · Show me more on c2 and c4'; the heading and three cards land, still")
fr("Quick check · A quick check you missed",
   "Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?", src="compositions/frames/31-quick-check-a-quick-check-you-missed.html",
   plan_step=5, quiz="k5", transition_in="cut", type="social_proof", layout="cards",
   question="In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?",
   option_a="Your memory, as known", option_b="The agent, as a comment", option_c="Straight into the decision log",
   answer="b",
   explain="A quick check settles like a card: Change the plan's words reach the agent as a comment on that step, as Expected something else does today.",
   option_a_why="Your memory takes Got it, not Change the plan.",
   option_b_why="Change the plan's words go to the agent as a comment on the step the check tests.",
   option_c_why="Nothing goes straight into the decision log; it gets there through the plan.",
   walk_me_through="You got the check wrong and pressed Change the plan, so you want it to work your way. Your words go to the agent with the review, as a comment on the step the check tests, as Expected something else does today. The plan changes, and a decision comes only from its questions.",
   explained_at="25-step-5-into-the-loop", focal="three options",
   scene="THE CASE ON A LINE ABOVE: 'a video like this one · a quick check you got wrong · Change the plan'; the heading and three cards land, still")
fr("The plan",
   "That's the revised plan: one round with three ways in, your own words checked, one click to settle each gap, asked once more days later, and the round in the loop. Your four decisions sit on the steps. Draw on any step to leave a note, or approve.", src="compositions/frames/32-the-plan.html",
   transition_in="crossfade", type="cta", layout="rail",
   scene="THE RAIL OF FIVE STEPS, each with its slot for an answer (data-plan-step): step 2 · D-314; step 3 · D-315; step 4 · D-316; step 5 · D-317; the triangle small beside it, its three sides closed. Holds still",
   focal="the resolved plan")

ORDER = ["chapter_start","plan_step","guide","guide_title","defines","knowledge","scene","voiceover","duration","transition_in","status","src","type","blueprint","layout"]
QK = ["decision","quiz","question","question_more","option_a","option_b","option_c","option_d","option_a_more","option_b_more","option_c_more","why_a","why_b","why_c","recommended","answer","explain","walk_me_through","explained_at","option_a_why","option_b_why","option_c_why","branch","plan_questions"]
def slug(t): return re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')[:40].strip('-')
out=[FRONT]; script=["# SCRIPT — find the gaps (plan video, five chapters)\n","**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)","**Voice settings:** default","**Voice direction:** Plain and even. A patient engineer talking to the owner: the case first, then the rule; one idea per sentence.\n","---\n"]
for i,(t,vo,k) in enumerate(F,1):
    k=dict(k); k.setdefault("transition_in","push-slide LEFT")
    words=len(vo.split()); dur=k.pop("dur",None) or round(max(5,words/3.1+0.6),3)
    if "branch" in k: dur=5
    src=k.pop("src", None) or f"compositions/frames/{i:02d}-{slug(t)}.html"
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
