# Videos that make sense: fresh eyes before you watch, a way to ask, frames back to basics

## The problem

The owner, after the walkthroughs-that-help plan video:

> "make sure the simplification and term in the video stuff was done already, i mean we wanted it much
> clearer and making sense right? still some confusion not only in terms but in phrases that werent
> explained well enough. like what about 'saved review file' what if we dont know what that is how can we
> find out? and also look in the image, things dont visually explained well, i mean we can have subagents
> look go back to basics ensure when we produce videos that they actually make sense to users, explain
> whats needed, and are visually very pleasing"

The image is step 6 of that video, at rest: a grey "What changed" box with two grey lines and two Flag
buttons, where the words of what changed should be; chips spread across the frame ("a pause holds you
≥ 5 s", "something flagged or said", "plan video · stays", "code check · stays", "if you don't · nothing
changes"), each apart from the thing it is about; the page's "Open · If the bar is missed" tab sitting on
the status line's top edge; and "you approve, or not", which does not say what you would approve. It is
a diagram of words, not the thing.

### What the reviews show

- **Phrases, not only words.** The words the build labels were looked up and understood (maintainer 4
  times, tag 4, pull request 3, walkthrough video 2). What lost you were phrases made of plain words,
  never labelled:
  - "drops the video" (walkthroughs-that-help, round 2): "wdym dropps the video. again this dkind of thing
    is not explained well how ma i supposed to get more information about this???" The video never said
    which video, or what comes instead.
  - "the saved review file" (round 3): the one quick check missed. The video showed a file name,
    `reviews/2026-09-27.json · one per day`, but never what is in it: the review you send from this page.
  - "the real thing" (better-visuals): "what is 'the real thing' mean? need mroe first".
  - "nothing to predict" and "the page looks the same" (round 2): "ok but arent there big bckend changes
    important too?" The phrase said more than it meant.
  - Questions asked to be explained again: which choices a listed choice is (walkthroughs-that-help),
    who writes a detail page ("confused by this, need more information and examples", deep-dives), where
    a maintainer watches ("im again confused here", contributing), this checkout's tooling ("confused
    here, i guess this is about doing a local vs npx one?", revise-loop).
- **The checks catch it too late.** In plan reviews, 24 of 64 quick checks were missed; the last
  three rounds of one plan missed 4, 5 and 1. Each miss is found by you, after the video is made.
- **The frames draw words, not things.** Beside step 6: step 3's "before · check · after" boxes are
  empty labels with a note floating beside them; step 1's real screenshots are placed so small that their
  code is about 10 px high, and the Open tab sits on a file name; "a command's output" and "a migration
  on a copy of real data" are chips naming things never shown. The frame generator's small card was
  three grey bars by design.

### Why what we have didn't catch it

- **Plain words** (D-127) swaps a known term for its plain word. It never asks whether a sentence is
  understood.
- **The jargon check** (`check-terms` with `scripts/lib/jargon.mjs`, D-216 to D-218) finds acronyms, code,
  technical compounds and two word lists. "Saved review file", "drops the video" and "the bar" are
  ordinary words, so it has nothing to flag. It is a list, and confusion is not on a list.
- **The Terms panel and underlines** work only for a word that has a meaning. A phrase with none is not
  underlined, so there is nothing to click, and "Explain this more" exists only on a question.
- **Walk me through it** works a quick check through in the video's own phrases, so a phrase you didn't
  follow stays unexplained.
- **frame-lint** reads a frame's HTML, not the picture: where a camera sits, the lowest eighth, sizes,
  colours. It cannot see grey lines standing for text, a chip far from its thing, or the player's tab,
  which is drawn later by the page.
- **The style guide** says what to draw (the real thing where the brief picks it, D-166; six parts at
  most; one accent) but not how a frame reads: nothing about placeholders, reading order, or where a
  label goes. A scene the brief doesn't pick can be anything.
- **Nobody looks with fresh eyes.** The agent that writes the video also judges it, knowing what every
  phrase means. The code has a second agent for this (the code check, D-001); the videos don't.

## What changes

Three changes, and when they reach the videos we have.

1. **Fresh eyes before you watch** (steps 1 and 2): two fresh agents look at each video before it reaches
   you, a newcomer and a designer, and every finding is answered before the page opens.
2. **A way to find out** (step 3): every phrase the newcomer flagged gets a meaning you can click, and
   you can ask about anything, paused on a scene.
3. **Frames back to basics** (step 4): seven rules for how a frame reads, in the style guide, checked
   where a program can check them and by the designer where it can't.
4. **The videos we have** (step 5): which are checked again now.

## Steps

### Step 1 — Two fresh agents look at the video before you do

*Independent.*

A new command, `reelplanning fresh-eyes <video-dir>`, writes a brief for two fresh agents, like the code
check's (`code-check.mjs`): the agent building the video launches each one with exactly the prompt from
`fresh-eyes <video-dir> --prompt newcomer` or `--prompt designer`, and nothing else, so neither knows what
the author meant.

- **What they get.** For each scene, in order: its narration, and a screenshot of it at rest (the scene's
  last moment, taken through the review page, so the player's tab, chips and captions are in it). Only a
  picture shows those: in this plan's own video, done by hand, the first build's Open tab sat on the first
  row of scene 2's list, and `frame-lint` passed it. The
  newcomer also gets the glossary and the recap lines of the videos this one leans on (`before:`), and
  nothing from the plan. Anything else is what a viewer does not have.
- **The newcomer** lists every phrase or thing on screen it could not explain from what the video had
  shown by then, what it guessed, and every question a newcomer would ask. On the walkthroughs-that-help
  video: "saved review file: which file? what's in it?", "drops the video: which video? what do I get
  instead?", "you approve, or not: approve what?".
- **The designer** looks at each screenshot for seven things (step 4's rules): shapes standing for
  content, the reading order, a label or a qualifier apart from its thing, a question that doesn't say
  what is decided, something covering content, text too small to read (in a screenshot too), and whether
  it is pleasing: one focal point, even spacing, balance.
- **Where it goes.** `<video-dir>/fresh-eyes/newcomer.md` and `designer.md`, one numbered finding a line
  (N1, G1: scene, what, why), stamped with the narration and frames they saw.
- **What people got lost on before goes in.** The words and phrases your reviews show you didn't follow
  (`reel memory lost`, every "Explain this more", an answer that says "wdym", step 3's questions) are
  given to the newcomer as "a viewer was lost on these before".

It costs two agent runs a round: about a minute each for a four-minute video; the system video's 35
scenes, a few minutes.

### Step 2 — Every finding is answered before the page opens (question 1)

*Needs step 1.*

The author answers each finding by its number, in the same file: **fixed** (the line or frame changed,
and where), **meaning** (the phrase kept, with a meaning added: step 3), or **kept**, with the reason
(the newcomer guessed wrong about something the video says plainly two scenes later, say). Then the
video is rebuilt and two new fresh agents look again, at most three rounds; what is left after the third
is said in the notification and in the page's "Before you watch".

**Answering is not always a rewrite** (from the approval). "Kept, with the reason" is a full answer. Say the
newcomer flags "the list" in scene 4, and scene 5 says what the list is: the least the author does before
you watch is write "kept: scene 5 says what the list is" beside that finding. Nothing in the video changes.
A rewrite is for a finding the video does not already answer.

The build holds it. `verify` reads `fresh-eyes/`: a video with no fresh-eyes run, a run on narration or
frames that have changed since, or a finding with no answer, is a △ line, and how strict that is is
question 1.

### Step 3 — Find out about any phrase, in the player (question 2)

*Needs step 1 for the flagged phrases.*

- **A meaning for every flagged phrase you keep.** It goes under the glossary's "Other words" when other
  videos will say it ("A saved review: the file the review page writes into the repo when you press Send,
  `reviews/plan-<time>.json`: your answers, marks and comments"), or in the storyboard's `terms:` line
  when only this video does. The player already underlines a phrase with a meaning in the captions, and a
  click opens it (D-218: until you know it). `check-terms` already reads phrases; nothing new to detect.
- **"Ask about this"** (question 2). Paused on any scene, you click a caption word or the frame and type
  a question: "what's the saved review file?". On the hosted page, Claude answers in the side panel, from
  the plan, the glossary and this scene's narration and frame, and says where the answer came from ("plan,
  step 3"). On your own machine, the question goes to the agent: a session waiting on the page answers in
  a few seconds; with none waiting, the page says so and the question goes with your review, to be
  answered in the next version. Every question is kept in the review, counts in `reel memory lost` like a
  word looked up, and goes to the next video's newcomer (step 1).
- **"In plain words"** (only with question 2's C): one plain sentence a scene, `- in_plain_words:` in the
  storyboard, shown under the frame on request.

### Step 4 — Frames back to basics: seven rules, checked where they can be

*Independent.*

A new part of the style guide's §5, "A frame a newcomer can read", with the step 6 frame redrawn as its
example:

1. **Show the thing, never a stand-in.** Write the words; never grey lines or an empty box where words
   go. If the words don't matter, leave the box out. ("What changed" shows its two real lines: "Save
   moved to the top", "Reviews stored one file a day".)
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** "Stays" is on the plan
   video's own row; "if you don't, nothing changes" is the second answer to the question it answers.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not",
   never "you approve, or not" alone.
5. **Nothing covers content.** The player's Open tab gets 40 px of room above the thing it opens.
6. **Readable at a glance.** Text at least the theme's floor on screen, text inside a screenshot too (crop
   to the part that matters rather than shrink it); at most three type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a
   column of chips with an empty half.

What a program can check, `frame-lint` fails: a box whose content is only empty bars (no text, under 12 px
high, over 120 px wide: rule 1), and a `data-detail` thing with another element within 40 px above it
(rule 5). The designer (step 1) checks all seven on the picture. The theme's frame generator loses its
three-bar card.

**Rule 3 is about where a word sits, rule 1 about what is drawn** (from the approval). A frame with two
files on the left and, far to the right, a column of chips "kept" and "removed" draws real files, so it
keeps rule 1. It breaks rule 3: each chip labels one file, so it goes on that file's own row ("kept" on
the file that stays). A label is on its thing, never in a column of its own.

### Step 5 — The videos we have, and the skill (question 3)

*Needs steps 1 to 4.*

The skill's **Build a video** gets the fresh-eyes loop between `build` and opening the page, and §11's
checklist gets step 4's rules. Which videos get it, from now on and now, is question 3. A video checked
now is rebuilt only where a finding is fixed, keeping its scene ids.

**A rebuild is a new build** (from the approval). An older video not checked now gets fresh eyes the next
time it is rebuilt, for any reason. Say you revise last week's plan video, which was never checked: the
rebuild gets fresh eyes, like any new video, before it reaches you. What decides is whether the video is
being built now, not when it was first made.

## Components touched

- **The plan-to-video skill** — the fresh-eyes loop in "Build a video"; the style guide's §5 rules and §11
  checklist; the frame generator's card (steps 1, 2, 4, 5)
- **The reel CLI** — `fresh-eyes` and its prompts; `verify` reading its answers; `reel memory lost`
  counting questions asked (steps 1 to 3)
- **The review player** — Ask about this, the flagged phrases underlined, what's left in "Before you
  watch" (steps 2, 3)
- **The review server** — the local page's question to a waiting session (step 3)
- **The system video** — checked with fresh eyes and fixed where needed (step 5)

## Open questions for the reviewer

1. **What becomes of a fresh-eyes finding nobody has answered?** (step 2)
Say the newcomer flags "saved review file" in scene 7, and the author has not answered it.
- **A · Answered before you see it.** On every new video the build stops until each finding is fixed,
  given a meaning, or kept with a reason. You never get a video with a known confusion left silent; costs
  a round or two per video.
- **B · A warning only.** The build prints the finding and goes on; the page opens with "saved review
  file" still unexplained. Faster; costs trusting the author to fix it.
- **C · Fixed, every one.** "Kept with a reason" is not allowed. Costs the most rounds, and a fight when
  the newcomer is wrong about something the video already says.
I recommend A: every finding gets a look, like the code check's, and a wrong finding can be kept.

2. **How do you find out what a phrase means?** (step 3)
You're paused on step 3, and "saved review file" means nothing to you.
- **A · Meanings for flagged phrases.** It is underlined, because the newcomer flagged it and it got a
  meaning; a click shows it. Costs nothing new in the player; a phrase the newcomer missed stays a dead
  end.
- **B · A, and Ask about this.** You type "what's the saved review file?" and the answer comes from the
  plan and the scene: on the hosted page, from Claude, in seconds; on your machine, from the agent if one
  is waiting, otherwise with your review. Costs a model call a question, and answers that can be wrong
  (each one says where it came from).
- **C · B, and a plain sentence a scene.** Each scene also has one "in plain words" sentence you can open.
  Costs a sentence a scene to write and keep true; it mostly repeats the narration.
I recommend B: A covers what the check found, and Ask covers what it didn't, which is your question.

3. **Which videos get fresh eyes?** (step 5)
- **A · Every new video, and the system video now.** Plan, walkthrough and system videos from now on;
  the system video, the first one a newcomer watches, is checked now and fixed. Costs two agent runs a
  round per video, and the system video's rebuilt scenes.
- **B · New plan videos only.** Where you decide. Costs least; walkthroughs and the system video keep
  what they have.
- **C · Every new video, and all 26 on the review page now.** Costs about 26 checks now and rebuilds
  wherever a finding is fixed, for videos already reviewed.
I recommend A: the system video is where a newcomer starts, and older plan videos are already decided.

## Decisions in force

- **D-001** A second, fresh agent checks the code: fresh eyes is the same idea for the video, launched
  the same way.
- **D-127** Plain words on screen: kept; fresh eyes tests whether the sentence around them is understood.
- **D-216**, **D-217**, **D-218** The build finds likely jargon, warns (fails on strict), and a word stays
  underlined until you know it: kept; step 3's phrase meanings use the same rows and underline.
- **D-166** The brief picks which scenes show the real thing: kept; step 4's first rule is about stand-ins,
  so a scene not picked can still explain with a picture, never with grey lines.
- **D-129** Approving is never blocked: kept; fresh eyes runs before you see the video, and never stops
  your Approve.
- **D-194**, **D-195** The Open tab on the thing, and the page grown from it: kept; step 4 gives the tab
  room.
- **D-197**, **D-198** When a quick check comes and on what case: kept; the newcomer reads checks as a
  viewer would.
- **D-064** The main session hands long jobs to workers: the two fresh agents are launched by the session
  building the video.
- **D-142**, **D-167** The coral and today's look: Ask about this uses the page's tokens.
- **D-221**, **D-222**, **D-223** Listed choices, a quick check where there's something to predict, small
  pull requests: kept; a walkthrough video gets fresh eyes like any other.
- **D-199** New and revised videos take the new quick checks, and the system video at once: question 3
  follows the same shape for fresh eyes.
- **D-003**, **D-065** The system video is kept current, and a comment on it is sorted: kept; a fresh-eyes
  finding on it is fixed like a comment that says the video is unclear.
- **D-196** The corner chip where nothing is marked: kept.
- **D-005**, **D-024**, **D-082**, **D-085**, **D-106**, **D-107**, **D-109**, **D-110**, **D-128**,
  **D-169**, **D-170**, **D-171**, **D-200**, **D-201**, **D-202**, **D-213**, **D-215**, **D-219**,
  **D-220**, **D-224** Rewinds, how a detail page is made, the sandbox, less scaffolding, your memory
  file and the retro, late fixes, the fifth choice, where "watched" is kept, the case study, decision
  numbers, pull requests and their videos, the walkthrough's shape and the Plan | Built switch: not
  touched.

## Not in this plan

Rebuilding the walkthroughs-that-help plan video (it was approved; its walkthrough video gets fresh eyes
when it is built). A model inside the build itself: the fresh agents are launched by the session that
builds the video, as the code check is. Changing quick checks, or how many.
