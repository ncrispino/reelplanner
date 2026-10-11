---
title: "The reel pane: review a plan without leaving Claude Code"
format: 1920x1080
duration: 60s
message: "/reel plays the video beside the conversation, stops at each choice, and Send hands your answers to Claude"
arc: hook → open it → a stop → send → where it shows
audience: a Claude Code user who just installed the reelplanner plugin
mode: autonomous
music: none
terms: pane = a panel docked beside the conversation in Claude Code; stop = a moment where the video pauses for your answer
---

## Video direction

- THE STAGE IS THE TERMINAL: a wireframe of one terminal window, the conversation on the left (prompt lines in mono), the pane docked on the right. The outer window never moves; what changes is inside it.
- palette from `frame.md`, as tokens: paper ground, ink voice, ONE accent per frame (the thing the sentence is about).
- Commands and keys are shown exactly as typed, in mono: `/reel`, `/reel <plan>`, `p`, `m`, `n`, `b`, digits.
- motion: power3 settles, elements arrive on their spoken word, every frame holds still ≥ 2 s before it ends, the last ≥ 3 s. Transforms and opacity only.
- negative list: no gradients/glows/music; no screenshots; nothing below y 945 (the lowest eighth stays empty).

## Frame 1 — Watch it beside the conversation

- chapter_start: The reel pane
- layout: screen
- scene: A terminal draws in; the conversation on the left, then a pane slides in from the right edge with a video frame playing in it
- voiceover: "A reelplanner video doesn't have to send you to a browser. With the plugin installed, /reel plays it in a pane right beside your conversation with Claude."
- duration: 9.168s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- focal: the pane sliding in
- roles: terminal window = anchor · conversation lines = supporting · pane = foreground subject

Scene 1 (0–3s): kicker "CLAUDE CODE · /reel" top-left; the terminal outline draws, three conversation lines type in on the left.
Scene 2 (3–7s): on "slash reel" the command `/reel` appears at the prompt; on "in a pane" the pane slides in from the right edge, accent border, with a small video frame and a caption line under it.
Scene 3 (7–10s): a progress bar under the video frame fills slowly; hold.

## Frame 2 — Open a plan

- layout: screen
- scene: Close-up of the pane listing three plans, newest first, each with its open choices; one is picked and starts playing
- voiceover: "Type /reel to list the plans that have a video, newest first, with their open choices. Pick one, or name it, and it starts playing at once."
- duration: 10.224s
- transition_in: push-slide
- status: animated
- src: compositions/frames/02-open.html
- type: step
- focal: the plan list
- roles: list rows = foreground subject · `/reel <plan>` chip = supporting

Scene 1 (0–4s): three rows fade in top to bottom: "dark-mode · 3 choices", "upload-resume · 2 choices", "review-page · reviewed".
Scene 2 (4–7s): on "name it" a mono chip `/reel dark-mode` appears above the list; the first row takes the accent.
Scene 3 (7–10s): on "starts playing" the row expands into a video frame with a timeline under it; hold.

## Frame 3 — It stops at each choice

- layout: screen
- scene: The video halts; under it a card shows the question and three numbered options, the recommended one marked; a key press picks one
- voiceover: "At each open choice the video stops. The question and its options sit under the picture, with the recommended one marked. Press a number to answer, m to leave a comment at that moment, and n or b to jump between stops."
- duration: 12.288s
- transition_in: push-slide
- status: animated
- src: compositions/frames/03-stop.html
- type: step
- focal: the stop card
- roles: stop card = foreground subject · timeline marks = supporting · key caps = supporting

Scene 1 (0–3s): the timeline's playhead reaches a mark and stops; the frame dims slightly.
Scene 2 (3–7s): a card rises under the frame: "Where does the manifest live?" with options `1` `2` `3`; option 2 carries a "recommended" tag in the accent.
Scene 3 (7–10s): on "press a number" a key cap `2` presses; option 2 fills; the timeline mark fills.
Scene 4 (10–14s): on "m" a key cap `m` and a small comment bubble on the timeline; on "n or b" key caps `n` `b` with arrows to the next and previous marks; hold.

## Frame 4 — Send it back

- layout: before-after
- scene: The last stop sums up the answers; Send forks two ways: Approve leads to "Claude builds it", Changes needed to "Claude revises, the pane plays just what changed"
- voiceover: "The last stop sums up your review. Send it. Approve, and Claude builds the plan. Ask for changes, and Claude revises it, and the pane plays just what changed."
- duration: 8.664s
- transition_in: push-slide
- status: animated
- src: compositions/frames/04-send.html
- type: step
- focal: the Send fork
- roles: summary card = supporting · Approve path = subject · Changes path = subject

Scene 1 (0–3s): a summary card lists "q1 · option 2", "1 comment" and a Send button.
Scene 2 (3–6s): on "Send it" the button presses (accent) and a line leaves it, splitting in two.
Scene 3 (6–9s): on "Approve" the upper branch ends at "Claude builds the plan".
Scene 4 (9–13s): on "changes" the lower branch ends at "Claude revises it" then "the pane plays what changed", a short timeline with one highlighted stretch; hold.

## Frame 5 — Where the picture shows

- layout: wall
- scene: Three terminal tiles: kitty and Ghostty show the picture; any other terminal shows a link to the browser player while the pane keeps the choices and Send
- voiceover: "In kitty or Ghostty the picture plays right in the terminal. Anywhere else, the pane opens the browser player and keeps the choices, comments and Send."
- duration: 9.024s
- transition_in: push-slide
- status: animated
- src: compositions/frames/05-terminals.html
- type: outro
- focal: the three tiles
- roles: kitty and Ghostty tiles = subject · other terminal tile = supporting

Scene 1 (0–5s): tiles "kitty" and "Ghostty" draw, each with a small video frame inside (accent).
Scene 2 (5–9s): on "anywhere else" a third tile "other terminals" draws, with a link chip "browser player ↗" and the stop card's options under it.
Scene 3 (9–11s): closing line under the tiles in mono: `/reel` — hold ≥ 3 s.
