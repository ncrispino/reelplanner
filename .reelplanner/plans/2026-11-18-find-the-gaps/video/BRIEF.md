---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Five steps, four questions. A round: a few cards the agent writes where you and it most likely picture the code differently, each checked against the code by a fresh agent (step 1), answered on the review page with a key and turned over to show the code's own lines (step 2; question 1, where the cards show first, recommended: the review page). Your own words, said or typed, split into claims and checked (step 3; question 2, who checks them, recommended: the waiting session). One click settles each gap, and each goes to its place: your memory, the plan, a fix, or one short video (step 4; question 3, when a card you got comes back, recommended: only when its lines change). The round in the loop: before a plan when worth it, on every quick check, and counted (step 5; question 4, how often, recommended: when a gap is likely and costly)."
destination: embed
aspect: 1920x1080
language: en
audience: The reelplanner owner, who asked for a way to line up their picture of the code with the code and with the agent writing it; knows the system video, the review page, quick checks, Ask about this and explainers
length: about five and a half minutes, five chapters
depth: high
angle: how-to-process
narration: yes
style_preset: .reelplanner/theme/frame.md (the project theme)
music: none
---

## Intent

Review the plan for issue #57 before anything is built. The plan changes how reelplanner works with you, not
only what it shows you: today it explains from the agent to you; this plan adds a round where your picture,
the agent's and the code are put side by side and each gap is settled. The video shows the three gaps with
real examples from this repo, the card front and back, your words marked claim by claim, the four ways a gap
is settled and where each goes, and the round's place before a plan and in every quick check.

## Customizations

- Ask: "basiclaly what i need here is a way to align me and the actual code + agent writing it. oftentimes we are not aligned, i assume it is one way when it is actually another. we want to actually interact to be able to do this."
- Ask: "we want to also make it easy for human to really make sure htey are aligned and interact in a way that is least effort for them to do interactions (this is what the drawing and voice was for) just like video is easiest way for them to understand."
- Ask: "then pls create a reelplanner video for this i think we can make a good plan for what we want to do here, really think in depth about it"
- Length: high depth on the owner's words, "really think in depth about it": five steps and four questions, each question explained with its case before it is asked.
- Medium: diagram and screen: the three pictures as a triangle, the planned review-page card front and back, your words with their claims marked, where each settled gap goes.
- Layouts: a triangle of three pictures, a card front and back, your words marked, a map of where gaps go, decision cards, quick-check cards.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a chapter or a quick check; push-slide UP for a question; crossfade for a choice's consequence.
- Real things: scene 1 (your words, as sent), scene 7 (the card's back: the real lines of `scripts/lib/inbox.mjs` and this repo's `config.json`), scene 13 (your words with their claims, against the real lines). The planned page is drawn as a planned mock, labelled planned; the rest explain with pictures.
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, outside any camera; a camera is at rest when a question ends.
- `music: none`. Kokoro `am_michael` at speed 1.25, one line at a time. No MP4: the review player plays
  the HTML project.

## Notes

- The quoted lines are real: `scripts/lib/inbox.mjs` lines 673, 700–705 at this commit, and `.reelplanner/config.json`'s `agent.command`. The plan's round, cards and page do not exist yet: every frame that shows them labels them planned.
- Holds: branch scenes 5 s; the final frame holds 4 s.
