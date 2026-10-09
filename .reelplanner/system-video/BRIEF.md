---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "a plan as long text is too hard to take in, so reelplanning turns it into a short narrated video you review by watching, with the detail on a guide under it. This is the whole system as it is today, from installing it to the record it keeps"
destination: embed
aspect: 1920x1080
language: en
audience: someone new to the repo who knows nothing about reelplanning; the video anyone new watches first
length: seven chapters of about a minute each; 5–8 minutes in all, a soft target (past 8 is a warning, not a reason to trim)
angle: concept explainer
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

reelplanning's system video (SKILL.md "The system video"): one video explaining the whole repo, built from
`.reelplanning/spec.md`, `system.json` and `glossary.md`, kept current as plans land (decision D-003): every frame is
tagged with the spec section and the parts it explains, and `reelplanning spec-diff` names the frames a change to
those three files affects.

Redone whole on 2026-10-04, at the owner's request (a full redo, not a patch), for a newcomer and in the order of the
lifecycle: what reelplanning is and its one loop (what it makes of a plan); installing it, with the four real commands run
(D-303); the plan and its video (plan.md's blocks, `reel check`'s rules and history, D-306, the build, the frame rules,
fresh eyes, the review page); reviewing in the player (the cards, own words, Terms, Ask about this, the plan text, quick
checks, the guide under the video, D-264 and D-265, the quiet mark, D-266, a note on any words, Finish); after you send
(the hand-off, the record, the revise step); the build and its walkthrough (choices and labels,
the code check and `reel audit`, the change running, what pauses, the list, the Built side and the fix); and what is
kept (the folder, this video kept current, memory, explainers, pull requests). Its spec was brought
up to date first, in the commit before this video's.

Reworked the same day after a review of that cut (33dd648): slower (speed 1.1, a 0.8 s hold after each line) and
shorter in words; scenes 13 (the frame rules) and 29 (`reel fold`) out, with the record's history and the case study,
left to the guide this video does not have yet (`plans/2026-10-04-system-video-guide/`); how to start, who starts the
review server, who answers Ask about this, the three ways a review arrives and the hand-off's third branch added;
the install shown as it really ran; Finish shot with a review server behind the page, so Send shows.

Reworked again after a review of that cut (a040712): who runs what (you type only `/plan-to-video`; a chip, "your
agent runs this", on every scene that shows a command); the words a newcomer was never given (a hosted page, two of
the frame rules, "Explain this more", the review server that keeps running, the agent filling a repo's description in
from its code); scene 25 split in two (how a review arrives; who picks it up); "step" kept for a plan's steps (the
agent builds, revises, fixes; the stages' names only on screen); `reelplanning build` drawn as what it runs, beside
what the agent writes; `reel check` on a fresh plan and `reel audit` cropped to their ✓ lines; a step's fifth choice
asked in `plan.md`; the quiet mark on the plan video's own scene; the real review page in scene 2; the review-page
shots closer and below the walkthrough's header (its count of choices); the asides on older videos out of the
narration (their words stay on screen, so the glossary's rows keep a scene); the README's install command on screen,
with what ran in a note; one line on the record's history and `reel fold`, and spec.md named for the rest, until the
guide plan lands.

Corrected on 2026-10-05, after the owner watched it: the opening said a skimmed plan's questions go unanswered
("Nobody answers the questions", a "0 of 4 answered" tag), which is not so: people answer their agent's questions in
the chat. The point is that a long plan is hard to take in, so it gets skimmed and its questions are hard to see; the
video stops at each one. Lines 1, 2, 10, 32 and 37 (now 11, 33, 38) were re-checked against the code and docs
and reworded. The same day, at the owner's direction, a scene after the loop (scene 4): you pick how much of it you
use, three levels in the README's words, each optional: one video (a plan video or an explainer), plus a walkthrough,
or the whole pipeline, which the rest of the video shows; scene 3 now says the loop is the whole of it, used in full. The ending's hold is 10.6 s. Later that day the owner asked that the video not say the name's sound-alike ("it's kinda obv"): scene 2
now says what reelplanning does with the plan, a short narrated video that stops at each question, and its subtitle
reads "turns a plan into a short video". The README keeps its line on the name (D-304 is about the README only).

## Customizations

- Medium: screens of the real review page and guide, real terminal runs, real documents of this repo (plans, a
  walkthrough table, code-check findings, reviews, the decision log), with pictures for the loop, the pipeline, the
  hand-off and the rest.
- Layouts: a document page; a terminal run on the slab; the review page under a camera, its states wiped in (light
  and dark, swapped with the theme); a table; a pipeline; a loop of stations; two lanes; quick checks that draw their
  own new case, then set it aside above their cards.
- Main transition: push-slide LEFT for the next scene of a chapter; cut for a new chapter and a quick check;
  crossfade for the ending.
- Real things: scene 1 (the plan guide's plan.md, shown as a plan like this one), 2 (the review page stopped at a
  question), 5 (docs/agents.md's table), 6 to 9 (the install: the README's npm command, run from a packed copy, `setup`,
  the README's `npx skills add`, `reel init`), 11 (docs/agents.md's start commands, plan.md's step 3 and question 2), 12
  (`reel check` on a fresh plan), 14 (fresh-eyes/newcomer.md), 15 (the Videos list and the notification's line), 17 to
  24 (the review page: the player, a question, Terms, Ask about this, the plan text, a quick check, the guide, the quiet
  mark, a note, Finish with Send), 28 (reviews/ and decision D-264), 29 (the page's "Revised since the last build"), 31
  (walkthrough.md's choices), 32 (code-check findings and `reel audit`), 33 (the walkthrough running), 34 (`reel
  stops`), 35 (a pause and the list), 36 (the Built side and Finish's open question), 38 (the record's folders), 39
  (`spec-diff`), 40 (`reel status`'s memory); the rest explain with pictures
- Every frame's root carries `data-band="bottom"` and keeps its lowest eighth empty; option cards carry
  `data-option`, headings `data-question`, outside any camera.
- One quick check per chapter (seven), three options each, later and on a new case (decisions D-197 to D-199):
  chapter N's check at the end of chapter N+1, the last two just before the ending. No decision scenes.
- `music: none`. Kokoro `am_michael` at speed 1.1, one line at a time, and 0.8 s held after each line
  (`.hyperframes/holds.json`'s `tail`): slower than a plan video's 1.25, for someone new.
- The chapter MP4s leave the quick checks out (`reelplanning chapters --no-checks`): an MP4 cannot stop for an answer.

## Notes

Autonomous run (`flow: automation`, `storyboard: no`); the render was asked for (the owner wants the finished video).
Frames were written by one generator (in the session's scratchpad, `sv3/gen/`), each reveal timed to its word from
`audio_meta.json`. The review page was shot from a bundle of this branch's player with the plan guide's and other
plans' videos (`bundle-player`), at 1440×900 at 2×, in both themes.

The install runs (scenes 6 to 9) were made on a scratch machine: its own home folder and npm prefix. reelplanning is
not on npm and the GitHub repo is private today, so the tooling was installed from `npm pack` of this branch with
`npm i -g ./reelplanning-0.2.0.tgz`. The screen shows the README's `npm i -g github:ncrispino/reelplanning` as the
command, with a note under it saying what ran (`npm i -g github:…` run today installs the default branch, whose
older `bin/` scripts do not start; once this branch is merged and the repo public, scene 6 is shot again with it). The skill went in with the README's own command, `npx skills add "$(npm root
-g)/reelplanning" --skill plan-to-video -g`, from the copy npm had just installed, as it runs for anyone today. A path
in the scratch home is shown as `~`. `reel check` in scene 12 ran on a one-step plan written for it in a scratch copy of
this repo's record (`2026-10-05-bigger-captions`), cropped to its ✓ line. The Finish panels (scenes 24 and 36) were shot with `reelplanning review`
serving the bundle and a session waiting (`review --wait`), so they show Send and who picks the review up; the
inner videos' own captions are off in every shot.
