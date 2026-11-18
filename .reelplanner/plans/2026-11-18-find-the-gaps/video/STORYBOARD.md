---
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
recap: 2026-09-26-contributing | Several people, one repo: contributing with reelplanning: decisions D-306, D-171, D-200, D-201, D-202, D-213, D-215, D-305, D-310, D-311, D-312: how does the decision log scale to thousands of decisions?
recap: 2026-09-27-walkthroughs-that-help | Walkthroughs that help: see the build run, stop only where…: decisions D-222, D-219, D-220, D-221, D-223, D-224: does the walkthrough test you?
recap: 2026-09-28-videos-that-make-sense | Videos that make sense: fresh eyes before you watch, a way…: decisions D-226, D-225, D-227, D-245, D-303: how do you find out what a phrase means?
recap: 2026-09-29-explain-first | Explain first: a video of what is going on, before any plan: decisions D-248, D-249, D-250: after Plan this, how far does the plan lean on the…; explains "pinned"
recap: 2026-09-26-better-visuals | Better visuals: show the real thing, and a page that reads…: decisions D-142, D-167, D-166: which accent colour?; explains "look"
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170, D-247, D-304: who reviews each arm, and in what order?
recap: 2026-09-28-plan-guide | The plan guide: the video first, and a full page behind it…: decisions D-244, D-246, D-264, D-266: which is the source: plan.md, or the guide?
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
recap: 2026-09-26-better-visuals--walkthrough | Better visuals: show the real thing, and a page that reads…: explains "verdict"
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

## Frame 1 — Your words

- chapter_start: Three pictures of the same code
- defines: agent
- scene: THE OWNER'S MESSAGE, AS SENT, in a data-artifact quote card (issue #57): 'basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another.' The words 'i assume it is one way when it is actually another' underlined in coral as the voice says them
- voiceover: "You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it. In your words: I assume it is one way when it is actually another. This plan finds those places, with the least effort from you."
- duration: 12.971s
- transition_in: cut
- status: outline
- src: compositions/frames/01-your-words.html
- type: hook
- blueprint: compose
- layout: quote
- focal: your own words
- sfx: none

narrativeRole: Your words.
keyMessage: You asked for a way to line up three things: you, the code, and the agent, the AI assistant writing it.

## Frame 2 — Earlier plans

- defines: review, headless run, quick check, explainer, memory
- knowledge: new
- scene: FOUR PLAIN LINES, one at a time, each with the earlier plan's name small beside it: review · Send → the waiting session, or a headless run; quick check · predict a case the video didn't show; explainer · quoted word for word; memory · a file in your home folder
- voiceover: "If you're new, four things this plan builds on. Send hands your review to the agent session waiting on this page; with none waiting, a headless run, the agent started on its own, can take it. A quick check asks you to predict a case the video didn't show. An explainer quotes its sources word for word. And your memory, a file in your home folder, keeps what you've watched."
- duration: 19.584s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/02-earlier-plans.html
- type: product_intro
- blueprint: compose
- layout: list
- focal: what this plan leans on
- sfx: none

narrativeRole: Earlier plans.
keyMessage: If you're new, four things this plan builds on.

## Frame 3 — Three pictures, three gaps

- defines: gap
- scene: A TRIANGLE: three nodes, 'you', 'the agent', 'the code'. Each side lights in turn with its gap written along it as the voice says it: you–code 'waits for you · a headless run takes it'; agent–code 'tries once · tries again after 15 s'; you–agent 'the agent read: any agent · you meant: your open session'
- voiceover: "Three things hold a picture of the code: you, the agent, and the code itself. A gap is where two disagree. You think a review sent with no session open waits for you; in this repo, a headless run takes it. The agent remembers Send trying once; it tries again fifteen seconds later. And you asked for a review that reaches the agent. The agent read any agent; you meant your open session."
- duration: 21.099s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-three-pictures-three-gaps.html
- type: pain_point
- blueprint: compose
- layout: triangle
- focal: the three sides, each a gap
- sfx: none

narrativeRole: Three pictures, three gaps.
keyMessage: Three things hold a picture of the code: you, the agent, and the code itself.

## Frame 4 — Today, and what changes

- defines: step
- scene: LEFT: one arrow 'agent → you', labelled 'today'. RIGHT: four rows landing on their words: 'a round · steps 1, 2'; 'your own words · step 3'; 'one click a gap · step 4'; 'before a plan, and on quick checks · step 5'
- voiceover: "Today reelplanner explains one way, from the agent to you. Its checks test whether you followed the video, not what you assumed that it never said. The plan has five steps, each one change. Steps one and two: a few cards where a gap is likely. Step three: your own words, checked. Step four: one click settles each gap. Step five: the cards before a plan, and on every quick check."
- duration: 20.075s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/04-today-and-what-changes.html
- type: product_intro
- blueprint: compose
- layout: list
- focal: the four changes
- sfx: none

narrativeRole: Today, and what changes.
keyMessage: Today reelplanner explains one way, from the agent to you.

## Frame 5 — Step 1 · Three kinds of card

- chapter_start: Steps 1 and 2: a round
- plan_step: 1
- guide: step-1
- defines: round, card
- scene: THREE PLANNED CARDS fanned out, each landing on its word, each labelled with its kind: predict · 'In this repo, you press Send and no session is waiting. What happens to the review?' with A B C; assume · 'I'm assuming you mean the session you have open'; say · 'Say how you think a review reaches the agent'. A quiet 'planned' label; a counter '3 of at most 6'
- voiceover: "Step one. A round is a short set of cards, at most six, about one topic: about two minutes. A card is one of three kinds. A predict card asks what the code does, and holds the answer with the code's own lines. An assume card says what the agent assumes you want, for you to answer. A say card asks you to explain it in your own words: that's step three."
- duration: 19.285s
- transition_in: cut
- status: outline
- src: compositions/frames/05-step-1-three-kinds-of-card.html
- type: feature_showcase
- blueprint: compose
- layout: cards
- focal: three kinds of card
- sfx: none

narrativeRole: Step 1 · Three kinds of card.
keyMessage: Step one.

## Frame 6 — Step 1 · Where gaps are likely

- plan_step: 1
- guide: step-1
- defines: fresh checker
- scene: FOUR SOURCES on the left, in the narration's words (what your words take for granted; quick checks you got wrong; commits since you watched; its own assumptions) flowing into 'candidates', then 'at most 6'. One card's two lines pinned on it: 'likely wrong: in a repo with no headless command it does wait' and 'matters: step 2 of the plan'. Then the checker: card c4 'tries once' struck, 'tries again after 15 s' written in; the agent–code side of the small triangle lights
- voiceover: "Picking the cards is the point. Each must say why you might picture it otherwise, and what depends on it. The agent looks at what your words take for granted, quick checks you got wrong, commits since you last watched, and its own assumptions, and keeps at most six of those candidates. Then a fresh checker, an agent that never saw this conversation, answers each predict card from the code alone; where it disagrees, the card is fixed or dropped."
- duration: 22.421s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/06-step-1-where-gaps-are-likely.html
- type: feature_showcase
- blueprint: compose
- layout: flow
- focal: likely and costly, then checked
- sfx: none

narrativeRole: Step 1 · Where gaps are likely.
keyMessage: Picking the cards is the point.

## Frame 7 — Step 2 · Predict, then see the code

- plan_step: 2
- guide: step-2
- defines: not sure
- scene: THE PLANNED CARD, FRONT: c3's question and three options, A ringed in coral as 'your pick'. It TURNS OVER: the back is the real thing (data-artifact): scripts/lib/inbox.mjs, lines 700–702 on the navy slab ('if (!question && !isMachineInbox(rp)) {', 'const result = await start();', 'if (result.started) return { handledBy: "agent", …') beside .reelplanner/config.json's '"command": "claude --permission-mode auto …"'; under them the why, 'A headless command is set, so a run starts'; your A dashed, B ringed in ink 'the answer'; a row of four buttons 'Got it · Change the plan · The code is wrong · Show me more'; a quiet 'Skip the rest'
- voiceover: "Step two, as proposed, puts the round on the review page, a card at a time. You answer first, with a letter key, or N for not sure. Then the card turns over: the file, the lines, one sentence why. Here, this repo's config sets a headless command, so a run starts. A match brings the next card. A wrong answer is a gap, with four ways to settle it; not sure, with two. Skip the rest ends the round."
- duration: 21.568s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/07-step-2-predict-then-see-the-code.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: the card turned over
- sfx: none

narrativeRole: Step 2 · Predict, then see the code.
keyMessage: Step two, as proposed, puts the round on the review page, a card at a time.

## Frame 8 — Question 1 · Where the cards show first

- plan_step: 2
- scene: THE QUESTION AND THREE CARDS, still, each with a tiny drawing of where the card appears: a page card; a chat bubble; both. The recommended card carries 'recommended'
- voiceover: "Question one. A: the cards show up on the review page, with a key per answer, a box to click, your spoken words, and the code on the card. B: in the chat, as the agent's questions: quickest to build, but plain text, nothing to click or say. C: both at once, twice the work. I recommend A: the page makes each answer a key press. Where do the cards show up first?"
- duration: 19.605s
- transition_in: push-slide UP
- status: outline
- src: compositions/frames/08-question-1-where-the-cards-show-first.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q1
- question: Where do a round's cards show up first?
- question_more: The same round of four cards about the inbox, answered either on the review page or in the chat with your agent.
- option_a: The review page
- option_b: The chat
- option_c: Both from the start
- option_a_more: One card at a time on the review page: a key per answer, a box of a diagram to click, your spoken words (step 3), and the code's own lines on the card's back. It needs the browser open.
- option_b_more: The agent asks each card as a question in the conversation. Quickest to build; no pointing, no voice, and the code's lines come as plain text.
- option_c_more: One round, two ways to answer it, both built now. Twice the work before either one is good.
- why_a: The page: a key per answer, the code turned over on the card, and your voice.
- why_b: The chat: quickest to build, but plain text, no pointing and no voice.
- why_c: Both now: two ways to answer, twice the work before either is good.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 1 · Where the cards show first.
keyMessage: Question one.

## Frame 9 — If A · on the review page

- plan_step: 2
- scene: kicker 'If A'; the planned card's back on a review page, the slab of lines on it
- voiceover: "With A, the card turns over on the page, with the code's lines on its back."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-if-a-on-the-review-page.html
- type: benefit_highlight
- blueprint: compose
- layout: screen
- branch: q1=a
- focal: the card on the page
- sfx: none

narrativeRole: If A · on the review page.
keyMessage: With A, the card turns over on the page, with the code's lines on its back.

## Frame 10 — If B · in the chat

- plan_step: 2
- scene: kicker 'If B'; a chat exchange: the agent's question with A B C, your 'A', and the answer as plain lines of text
- voiceover: "With B, the agent asks each card in the chat, and the lines come back as text."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-if-b-in-the-chat.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- branch: q1=b
- focal: the card as a chat question
- sfx: none

narrativeRole: If B · in the chat.
keyMessage: With B, the agent asks each card in the chat, and the lines come back as text.

## Frame 11 — If C · both from the start

- plan_step: 2
- scene: kicker 'If C'; the card on a page beside the same card in a chat, one line joining them 'one round'
- voiceover: "With C, the same round opens on the page and in the chat at once."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-if-c-both-from-the-start.html
- type: benefit_highlight
- blueprint: compose
- layout: before-after
- branch: q1=c
- focal: one round, two places
- sfx: none

narrativeRole: If C · both from the start.
keyMessage: With C, the same round opens on the page and in the chat at once.

## Frame 12 — Quick check · A card the checker disagrees with

- plan_step: 1
- scene: THE CASE ON A LINE ABOVE: 'card c2: B · checker: C'; the heading and three cards land, still
- voiceover: "Quick check. A card about reel status says B. The fresh checker reads the code and picks C. What do you see?"
- duration: 5.952s
- transition_in: cut
- status: outline
- src: compositions/frames/12-quick-check-a-card-the-checker-disagrees.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: A card about `reel status` says B; the fresh checker reads the code and picks C. What do you see?
- option_a: Both answers, side by side
- option_b: The card fixed, or no card
- option_c: The card as written, with a note
- answer: b
- explain: Where the checker's answer differs, the agent's picture is the wrong one, so the card is fixed against the code or dropped before you see it.
- walk_me_through: The card says B. The checker read only the code and the card, and picked C. So the card's answer is not backed by the code: the agent's picture was wrong. Before the round opens, the card is fixed against the code, or dropped. You see the right card, or none.
- explained_at: 6
- option_a_why: You never see a card the code doesn't back; the two answers are settled before the round opens.
- option_b_why: The checker answers from the code alone, so a card it disagrees with is fixed against the code or dropped.
- option_c_why: A note would still show you a card whose answer the code may not back.
- focal: three options
- sfx: none

narrativeRole: Quick check · A card the checker disagrees with.
keyMessage: Quick check.

## Frame 13 — Step 3 · Your own words, checked

- chapter_start: Step 3: your own words
- plan_step: 3
- guide: step-3
- defines: claim
- scene: YOUR WORDS typed out as said (planned page): 'When I press Send it goes to my session. If I'm not there, it waits for me. It should tell me when it's been taken.' Each claim underlined as the voice reads it: the first marked ✓ with 'inbox.mjs:673' pinned under it; the second marked ✗ in coral with 'inbox.mjs:700–705 · config.json' and a small gap card sliding out of it. 'whisper · on this machine' small by a microphone; the third sentence 'It should tell me when it's been taken.' marked '?' with 'assume card' sliding out of it; a quiet line at the foot 'drawing your picture · issue #23, a separate plan'
- voiceover: "Step three: say it in your own words. Hold Space and talk; whisper writes it down on this machine. Your words are split into claims, each a stretch that says one thing, checked against the code. It goes to my session: a match. If I'm not there, it waits: a gap, in this repo. A claim about what you want comes back as an assume card. Drawing your picture stays a separate plan."
- duration: 19.776s
- transition_in: cut
- status: outline
- src: compositions/frames/13-step-3-your-own-words-checked.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: your words, marked claim by claim
- sfx: none

narrativeRole: Step 3 · Your own words, checked.
keyMessage: Step three: say it in your own words.

## Frame 14 — Question 2 · Who checks what you said

- plan_step: 3
- scene: THE QUESTION AND THREE CARDS, still, each with its time on it: 'about 1 min'; 'a few seconds · hosted'; 'after Send'. The recommended card carries 'recommended'
- voiceover: "Question two. A: the waiting agent session checks your words. It knows the code best, and takes about a minute. B: a small hosted model, called from the page: seconds, but your words leave the machine, and it sees only the pinned lines. C: the next session to take the round, after Send. I recommend A, falling back to C. So who checks your spoken words against the code?"
- duration: 20.331s
- transition_in: push-slide UP
- status: outline
- src: compositions/frames/14-question-2-who-checks-what-you-said.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q2
- question: Who reads your spoken explanation against the code?
- question_more: Your 20 seconds of speech, three claims, checked against the inbox's code.
- option_a: The waiting session
- option_b: A small hosted model
- option_c: The agent, after Send
- option_a_more: The agent session waiting on the page splits your words into claims and checks each against the code. About a minute, and only with a session open; with none, it falls back to after Send.
- option_b_more: A small hosted model, called from the page with your own key in ~/.reelplanner/.env and billed to you, as the hosted voice is, marks your claims in a few seconds. Your words go to its service, and it sees only the pinned lines, so it misses what the agent would find elsewhere.
- option_c_more: Nothing is checked while you answer; your words go with Send, filed with the round as a review is, and the next session that takes the round marks them when it hands the round back.
- why_a: The waiting session: it knows the code best; about a minute.
- why_b: A small hosted model: seconds, but your words leave the machine.
- why_c: After Send: nothing live; marked when the round comes back.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 2 · Who checks what you said.
keyMessage: Question two.

## Frame 15 — If A · the waiting session

- plan_step: 3
- scene: kicker 'If A'; your three claims, marked, with '≈ 1 min' beside them
- voiceover: "With A, your claims come back marked in about a minute."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/15-if-a-the-waiting-session.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q2=a
- focal: marked in a minute
- sfx: none

narrativeRole: If A · the waiting session.
keyMessage: With A, your claims come back marked in about a minute.

## Frame 16 — If B · a small fast model

- plan_step: 3
- scene: kicker 'If B'; your three claims, marked, '≈ 3 s', and 'sent to a hosted model' on them
- voiceover: "With B, they're marked in seconds, by a model your words are sent to."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/16-if-b-a-small-fast-model.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q2=b
- focal: marked in seconds
- sfx: none

narrativeRole: If B · a small fast model.
keyMessage: With B, they're marked in seconds, by a model your words are sent to.

## Frame 17 — If C · after Send

- plan_step: 3
- scene: kicker 'If C'; your three claims unmarked, then 'round handed back' where they are marked
- voiceover: "With C, you see them marked only when the round comes back."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/17-if-c-after-send.html
- type: benefit_highlight
- blueprint: compose
- layout: document
- branch: q2=c
- focal: marked later
- sfx: none

narrativeRole: If C · after Send.
keyMessage: With C, you see them marked only when the round comes back.

## Frame 18 — Quick check · Not sure

- plan_step: 2
- scene: THE CASE ON A LINE ABOVE: 'card c5 · you press N'; the heading and three cards land, still
- voiceover: "Quick check. On card c five, you press N, for not sure. What comes next?"
- duration: 4.032s
- transition_in: cut
- status: outline
- src: compositions/frames/18-quick-check-not-sure.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: On card c5, you press N: not sure. What comes next?
- option_a: The next card; nothing kept
- option_b: A gap: Got it or Show me more
- option_c: The round ends
- answer: b
- explain: Not sure is a gap of its own kind, you had no picture, so the card turns over and you settle it with Got it or Show me more.
- walk_me_through: You press N on card c5. The card still turns over, and shows the lines. You had no picture there, which is a gap of its own kind. So you settle it, with Got it or Show me more, and the next card comes.
- explained_at: 7
- option_a_why: Not sure is kept: having no picture is a gap too, so it isn't skipped.
- option_b_why: Having no picture is a gap of its own kind, settled with Got it or Show me more.
- option_c_why: Only Skip the rest ends a round; one Not sure doesn't.
- focal: three options
- sfx: none

narrativeRole: Quick check · Not sure.
keyMessage: Quick check.

## Frame 19 — Step 4 · Settle each gap

- chapter_start: Step 4: settle each gap
- plan_step: 4
- guide: step-4
- defines: decision log
- scene: THE PLANNED CARD'S FOUR BUTTONS across the top; from each a line drawn down to where it goes, landing on its word: Got it → 'your memory · you.jsonl'; Change the plan → 'plan.md · You told me first'; The code is wrong → 'a plan step · or issue.md'; Show me more → 'one short video'. Then 'decision log' at the side, reached only from 'plan.md' by a thin line labelled 'its questions'
- voiceover: "Step four: one click settles a gap, and each goes somewhere. Got it: the code is right, and your memory keeps it. Change the plan: it goes into the plan, under You told me first. The code is wrong: a step of the plan, or an issue to file. Show me more: a longer card now, and one short video of those gaps at the end. The decision log, the record of your answers, gets them only through the plan's own questions."
- duration: 21.013s
- transition_in: cut
- status: outline
- src: compositions/frames/19-step-4-settle-each-gap.html
- type: feature_showcase
- blueprint: compose
- layout: map
- focal: four buttons, four places
- sfx: none

narrativeRole: Step 4 · Settle each gap.
keyMessage: Step four: one click settles a gap, and each goes somewhere.

## Frame 20 — Question 3 · When a card comes back

- plan_step: 4
- defines: fingerprint
- scene: A SMALL MEMORY LINE first: 'knows: a headless run takes it · inbox.mjs:700–705 · 4b1e', 'fingerprint' pinned on 4b1e. Then THE QUESTION AND THREE CARDS, still. The recommended card carries 'recommended'
- voiceover: "Got it is kept with the lines' fingerprint, a short code that changes when they do. Question three. A: the same card comes back only when those lines change. B: also once more, on a new case, days later. C: whenever a plan depends on it. I recommend A: a change to the code is what makes your picture stale. When does the same card return?"
- duration: 18.965s
- transition_in: push-slide UP
- status: outline
- src: compositions/frames/20-question-3-when-a-card-comes-back.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q3
- question: After Got it, when does the same card return?
- question_more: You had card c3 wrong and pressed Got it. It is kept in your memory with inbox.mjs lines 700 to 705 at fingerprint 4b1e.
- option_a: Only when its lines change
- option_b: Once more, a few days later
- option_c: Whenever a plan needs it
- option_a_more: Known until the lines' fingerprint changes: when inbox.mjs lines 700 to 705 are edited, it may be asked again.
- option_b_more: As A, and also once more, on a new case, a few days on, to check it stuck. About one card a round more.
- option_c_more: Asked again each time a plan depends on it. The surest for a big change, and the most repetition.
- why_a: Known until its lines change: nothing more to sit through.
- why_b: Once more, later, to check it stuck: a card a round more.
- why_c: Each time a plan leans on it: surest, most repetition.
- recommended: a
- focal: three options, A recommended
- sfx: none

narrativeRole: Question 3 · When a card comes back.
keyMessage: Got it is kept with the lines' fingerprint, a short code that changes when they do.

## Frame 21 — If A · when its lines change

- plan_step: 4
- scene: kicker 'If A'; a timeline: 'Got it · 4b1e', weeks of nothing, 'inbox.mjs edited · 9c07', 'asked again'
- voiceover: "With A, the card returns only after its lines change."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/21-if-a-when-its-lines-change.html
- type: benefit_highlight
- blueprint: compose
- layout: timeline
- branch: q3=a
- focal: back after an edit
- sfx: none

narrativeRole: If A · when its lines change.
keyMessage: With A, the card returns only after its lines change.

## Frame 22 — If B · once more, later

- plan_step: 4
- scene: kicker 'If B'; a timeline: 'Got it', 'three days', 'a new case'
- voiceover: "With B, it returns once more, on a new case, a few days on."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/22-if-b-once-more-later.html
- type: benefit_highlight
- blueprint: compose
- layout: timeline
- branch: q3=b
- focal: once more after days
- sfx: none

narrativeRole: If B · once more, later.
keyMessage: With B, it returns once more, on a new case, a few days on.

## Frame 23 — If C · whenever a plan needs it

- plan_step: 4
- scene: kicker 'If C'; a timeline: 'Got it', then 'plan', 'asked', 'plan', 'asked'
- voiceover: "With C, it returns each time a plan leans on it."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/23-if-c-whenever-a-plan-needs-it.html
- type: benefit_highlight
- blueprint: compose
- layout: timeline
- branch: q3=c
- focal: each plan
- sfx: none

narrativeRole: If C · whenever a plan needs it.
keyMessage: With C, it returns each time a plan leans on it.

## Frame 24 — Quick check · A want, not a fact

- plan_step: 3
- scene: THE CASE ON A LINE ABOVE, your words in quotes: 'and it should only go to the session I have open'; the heading and three cards land, still
- voiceover: "Quick check. You say: and it should only go to the session I have open. How is that claim marked?"
- duration: 5.056s
- transition_in: cut
- status: outline
- src: compositions/frames/24-quick-check-a-want-not-a-fact.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: You say: 'and it should only go to the session I have open.' How is that claim marked?
- option_a: A match
- option_b: A gap
- option_c: Neither: an assume card
- answer: c
- explain: It says what you want, not what the code does, so it is neither a match nor a gap; it becomes an assume card for you to confirm.
- walk_me_through: The claim says 'it should only go to my session'. That is a want, not how the code works now. The code can't say whether you want it. So it is neither a match nor a gap, and becomes an assume card: you answer Right or Not quite.
- explained_at: 13
- option_a_why: A match needs lines that back it; a want has none.
- option_b_why: A gap needs code that does otherwise; this is about what should be, which only you can settle.
- option_c_why: 'Should' is about what you want, so the code can't say, and it comes back as an assume card.
- focal: three options
- sfx: none

narrativeRole: Quick check · A want, not a fact.
keyMessage: Quick check.

## Frame 25 — Step 5 · Into the loop

- chapter_start: Step 5: into the loop
- plan_step: 5
- guide: step-5
- defines: approve, miss
- scene: THREE PLACES in a row, each landing on its word: 'before a plan' with candidates → 'a round, if worth it'; a quick-check card with the four buttons under its answer and 'Approve · never blocked'; a planned reel status line 'rounds 3 · gaps 11 · Got it 7 · the plan 3 · a fix 1', with 'compared after 5 plans each way'
- voiceover: "Step five puts the round in the loop. Before a plan, the agent lists the likely gaps, and runs a round when one is worth your time. A wrong quick check gets the same buttons, with Change the plan's words reaching the agent as a comment, and nothing blocks Approve, the verdict that accepts a plan. And reel status counts rounds, gaps, and whether plans with a round need fewer late fixes, things a review let through that a later fix had to change."
- duration: 23.275s
- transition_in: cut
- status: outline
- src: compositions/frames/25-step-5-into-the-loop.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: three places the round goes
- sfx: none

narrativeRole: Step 5 · Into the loop.
keyMessage: Step five puts the round in the loop.

## Frame 26 — Question 4 · How often a round comes

- plan_step: 5
- scene: THE QUESTION AND THREE CARDS, still, each showing what the two requests get: A 'Send · 4 cards, rename · 2 cards'; B 'Send · 4 cards, rename · none'; C 'none, none'. The recommended card carries 'recommended'
- voiceover: "Question four. Take two requests: make Send reach my open session, and rename the Save button. A: a round before every plan, both included: the surest, and two minutes more each time. B: only when a gap is likely and costly, so Send gets four cards and the rename none, with a line saying why. C: only when you ask. I recommend B. So how often should a round come before a plan?"
- duration: 21.355s
- transition_in: push-slide UP
- status: outline
- src: compositions/frames/26-question-4-how-often-a-round-comes.html
- type: cta
- blueprint: compose
- layout: cards
- decision: q4
- question: How often does a round come ahead of a plan?
- question_more: Two requests: 'make Send reach my open session' (six candidates, four likely and costly) and 'rename the Save button' (one candidate, not costly).
- option_a: Every plan on existing code
- option_b: When a gap is likely and costly
- option_c: Only when you ask
- option_a_more: A round before each plan on code that exists, both requests included. About two minutes more each time, often on nothing.
- option_b_more: Likely: one of the four places points at it. Costly: a step of the plan depends on it, or it is hard to undo. The Send change gets a round of four; the rename gets none, and its plan says so in a line. It can miss a gap the agent didn't see coming.
- option_c_more: No round unless you say 'align me first'. Nothing changes otherwise; the gaps you didn't think to ask about stay hidden.
- why_a: Every plan: the surest, two minutes more each time.
- why_b: When likely and costly: none on a rename, four on Send.
- why_c: Only when asked: the gaps you didn't think of stay hidden.
- recommended: b
- focal: three options, B recommended
- sfx: none

narrativeRole: Question 4 · How often a round comes.
keyMessage: Question four.

## Frame 27 — If A · every plan

- plan_step: 5
- scene: kicker 'If A'; three plans in a row, each with a round before it
- voiceover: "With A, every plan on existing code starts with a round, a rename included."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/27-if-a-every-plan.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q4=a
- focal: a round before each
- sfx: none

narrativeRole: If A · every plan.
keyMessage: With A, every plan on existing code starts with a round, a rename included.

## Frame 28 — If B · when it's worth it

- plan_step: 5
- scene: kicker 'If B'; two plans: 'rename the Save button · no round', 'make Send reach my open session · 4 cards'
- voiceover: "With B, the rename gets no round, and the change to Send gets four cards."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/28-if-b-when-it-s-worth-it.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q4=b
- focal: a round where it matters
- sfx: none

narrativeRole: If B · when it's worth it.
keyMessage: With B, the rename gets no round, and the change to Send gets four cards.

## Frame 29 — If C · only when you ask

- plan_step: 5
- scene: kicker 'If C'; a chat line 'align me first', then a round
- voiceover: "With C, a round comes only when you say: align me first."
- duration: 5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/29-if-c-only-when-you-ask.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- branch: q4=c
- focal: on request
- sfx: none

narrativeRole: If C · only when you ask.
keyMessage: With C, a round comes only when you say: align me first.

## Frame 30 — Quick check · Two gaps, more please

- plan_step: 4
- scene: THE CASE ON A LINE ABOVE: 'a round · Show me more on c2 and c4'; the heading and three cards land, still
- voiceover: "Quick check. In a round of five, you press Show me more on two gaps. How many videos are made?"
- duration: 4.736s
- transition_in: cut
- status: outline
- src: compositions/frames/30-quick-check-two-gaps-more-please.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: In a round, you press Show me more on two gaps. How many videos are made?
- option_a: Two, one a gap
- option_b: One, at the end of the round
- option_c: None; text only
- answer: b
- explain: Show me more opens a longer card at once, and at the end the gaps you asked about become one short video, since a video takes minutes and a card seconds.
- walk_me_through: You press Show me more on two gaps. Each card opens its longer page right away. At the end of the round, both gaps go into one short explainer video, which starts from what you expected. That is one video.
- explained_at: 19
- option_a_why: One video a gap would mean minutes of building for each; the gaps share one.
- option_b_why: The gaps you asked more on become one short video at the end of the round.
- option_c_why: Text comes at once on the card, and the video comes after, at the end.
- focal: three options
- sfx: none

narrativeRole: Quick check · Two gaps, more please.
keyMessage: Quick check.

## Frame 31 — Quick check · A quick check you missed

- plan_step: 5
- scene: THE CASE ON A LINE ABOVE: 'a video like this one · a quick check you got wrong · Change the plan'; the heading and three cards land, still
- voiceover: "Quick check. In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?"
- duration: 6.229s
- transition_in: cut
- status: outline
- src: compositions/frames/31-quick-check-a-quick-check-you-missed.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: In a video like this one, you get a quick check wrong and press Change the plan, with your words. Where do they go?
- option_a: Your memory, as known
- option_b: The agent, as a comment
- option_c: Straight into the decision log
- answer: b
- explain: A quick check settles like a card: Change the plan's words reach the agent as a comment on that step, as Expected something else does today.
- walk_me_through: You got the check wrong and pressed Change the plan, so you want it to work your way. Your words go to the agent with the review, as a comment on the step the check tests, as Expected something else does today. The plan changes, and a decision comes only from its questions.
- explained_at: 25
- option_a_why: Your memory takes Got it, not Change the plan.
- option_b_why: Change the plan's words go to the agent as a comment on the step the check tests.
- option_c_why: Nothing goes straight into the decision log; it gets there through the plan.
- focal: three options
- sfx: none

narrativeRole: Quick check · A quick check you missed.
keyMessage: Quick check.

## Frame 32 — The plan

- scene: THE RAIL OF FIVE STEPS, each with its slot for an answer (data-plan-step): step 2 · question 1; step 3 · question 2; step 4 · question 3; step 5 · question 4; the triangle small beside it, its three sides closed. Holds still
- voiceover: "That's the plan: a round of a few cards where a gap is likely, your own words checked, one click to settle each gap, and the round in the loop. Your four answers sit on the steps. Draw on any step to leave a note, or approve."
- duration: 12.859s
- transition_in: crossfade
- status: outline
- src: compositions/frames/32-the-plan.html
- type: cta
- blueprint: compose
- layout: rail
- plan_questions: 1, 2, 3, 4
- focal: the resolved plan
- sfx: none

narrativeRole: The plan.
keyMessage: That's the plan: a round of a few cards where a gap is likely, your own words checked, one click to settle each gap, and the round in the loop.
