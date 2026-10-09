# Better visuals: show the real thing, and a page that reads well

## The problem

The owner, on the videos:

> "I think in general we can improve the visuals. Like the way the video is presented, the kinds of
> animation or things shown can likely be improved; rn it is very formulaic with style and with what
> exactly is presented. We have so much flexibility that we are not using and likely are contained here."

And on the review page:

> "the html itself, the way it has text is not great, like the whole theming here (example is the terms)
> is not great, less clear, harder to read, i think unoriginal."

Both are true, and both have causes in this repo.

- **Every scene looks the same.** Across 111 scenes of four videos, every one is a small mono heading
  at the top left (the frame template requires it), a row of step ticks down the side, one to three thin
  boxes in the top half and empty paper below. The boxes are cards *about* a thing (a "means" card, a
  "chose / instead" card) where the thing itself would do: the real table, the real code, the real
  player. The style guide already says "show the thing, not a card about it"; nothing checks it.
- **Motion is one move.** 631 things pop in, and 543 of 561 cuts between scenes are the same crossfade.
  No camera moves, nothing leaves, nothing is drawn, typed or wiped. The frame template says motion is
  "out of scope" and points to a motion language that does not exist, and the lint that finds still
  stretches is satisfied by a steady drip of pops.
- **The code and terminal blocks HyperFrames offers go unused**, because they hard-code colours the
  frame lint rejects.
- **The page never loads its fonts.** The player names Inter, EB Garamond and JetBrains Mono but ships
  none of them, so each viewer gets whatever their machine has. Its text is five shades of grey alpha on
  cream, with coral for everything from "current" to "yours".

A sample proves the video side: six scenes of the fewer-stops walkthrough redrawn with the same words
and voice (the real table with its labels, the real player timeline going from 23 pauses to 5, the real
code change, a real `reel audit` run, a before and after wipe of the real answer bar). It built with
every check passing, and it found where today's rules and checks get in the way. Two samples of the
page's look, "Reading desk" and "Tally", were put on the review page beside today's; the review chose
today's look with its reading fixed (D-167), so they leave it.

## What changes

Three changes, and a fourth that says when they reach the videos we have.

1. **Scenes show the real thing** (steps 1 and 2): the actual file, table, command output or screen a
   scene is about, instead of boxes of words about it, in the scenes each video's brief picks (decided,
   D-166); a change across many files shows its map, then the one or two places that carry the idea
   (step 1 says it with an example); the rules, and the checks that let it through while keeping the
   answer safe.
2. **The review page reads well** (step 3): today's look, cream and coral, with its fonts shipped, text in
   solid shades and a real scale of sizes (decided, D-167), and the darker coral for what waits on you
   (decided, D-142). This is already built.
3. **Old videos change only when revised** (step 4), and the system video once.

## Steps

### Step 1 — A scene shows the real thing, with plain words pinned to it

*Independent.*

**What "the real thing" means.** The real thing is the actual file, table, command output or screen a
scene is about, shown as it looks, instead of a box of words describing it. An example from our own
videos: the fewer-stops walkthrough has a scene about its table of choices (`walkthrough.md`, the table
"Choices the plan did not specify", rows A1 to A9 with their labels). Today that scene draws boxes of
words about the table: a card saying "choice: decided by the agent alone", one saying "label: a note:
worth a look", three label names with what each means, and a big "9 choices". Showing the real thing,
the same scene shows the table itself, its rows and label column as they are in the file, with the plain
words placed on it. In the same way a scene about a code change shows the diff, a scene about a command
shows the command typed and what it printed, and a scene about the player shows the player's own screen.
A scene about a rule or a count has no such thing to show, so it keeps a box.

**It is never "every file".** A change that touches ten files does not put ten files on screen. It shows,
in order:

- **A map of the change first:** the files it touches, one row each, with one plain line on what changed
  there. It is the real list (what `git diff --stat` prints), in plain words. A real one from this repo,
  the terms check (commit 6d9e961, nine files): `check-terms.mjs` · the new check;
  `lib/terms.mjs` · finds the words; `build.mjs` · runs the check first; `glossary.md` · plain rows for
  the words that lost you; `jargon.txt` · words to explain; two test files · the tests; and so on.
- **Then the one or two places that carry the idea,** as the real thing, with plain words pinned on.
  For the terms check that is five lines of `check-terms.mjs`: where a word is first said, where it is
  defined, and the warning when the first comes before the second. The other files stay a line on the
  map and are never opened.
- **A picture where the real thing is hard to read.** The real thing is a means to understanding, not a
  goal. Where the code is dense or the idea is a flow, a picture that explains it is right: a before and
  after diagram, or a flow. For the terms check, a row of scenes with the word "label" said in scene 2
  and defined in scene 4, and the warning drawn between them, says more than the code does.

**The brief picks which scenes show real things** (decided, D-166). Each video's brief names the scenes
that show the thing itself and leaves the rest to explain with a picture, one line under Customizations:
`- Real things: scene 3 (the map), scene 4 (the check's lines); the rest explain with pictures`. Nothing
checks it and nothing warns about the scenes it leaves out: the writer picks the scenes where seeing the
thing is what makes it click.

In a scene the brief picks, the thing is shown, and the words a newcomer needs sit on it:

- **The real thing first.** The style guide's "what to draw" says how, with examples: a table change
  shows the table, a code change shows the diff, a command shows its run, a screen change shows the
  screen before and after, and a change across many files shows its map, then its one or two places.
  Cards about a thing are for what has no surface (a rule, a count).
- **A plain word is pinned to what it names.** A word the video defines is a small label on the code
  word, the table column or the button it names, never a card floating beside it. In the frame's code
  the real thing sits in a box marked `data-artifact`, so the checks know its words are its own, and a
  pinned label says which word it explains.
- **The heading and the step ticks are optional.** The frame template's required mono heading becomes
  a quiet place label ("walkthrough.md · fewer, better stops"), used when it helps; the ticks go where a
  scene has room and a reason.
- **Code and terminal blocks in the theme's colours.** Forks of HyperFrames' code-diff and terminal-run
  blocks ship with the theme, coloured only by the theme's named colours, with named colours added for
  code.
- **Composition varies.** Each video's brief says its medium (screen, code, document, diagram), its
  layouts, its main transition and, as above, which scenes show real things; the storyboard gives each
  scene its layout.

### Step 2 — What each move means, written down; checks that keep the answer safe

*Needs step 1's `data-artifact` mark (the words check reads it).*

- **The motion language** (`motion-language.md` beside the frame template): a camera moves over one
  scene clipped above the answer area; a thing is revealed by its own verb (drawn, typed, wiped,
  counted, struck); transitions carry meaning: a cut for a new chapter or a quick check, a push for the
  next scene of the same chapter, a crossfade for the same place later, a zoom into a step's code done
  as a cut plus a pull-back.
- **The checks change to allow it:** the words check reads the real thing's own text as explained in
  place (a warning at most) and splits text only on block elements; zoom-through loses its blur; the
  still-stretch check reads camera moves and helper-made moves; the stage check stops rewarding the
  ticks, and a video warns when over 70% of its scenes share one layout or one transition.
- **The checks that keep the answer safe:** the frame lint fails a camera or zoom that is not inside a
  view clipped at 900 px, so nothing moves into the lowest eighth; and it fails a question's heading or
  card inside a moving camera unless the camera is at rest, at full size, when the scene ends. The
  cards stay whole and still, where the player measures them.

### Step 3 — The review page: today's look, made readable, with its fonts

*Independent. Already built (commit 312d989).*

The page keeps today's look, cream and coral, and gets the fixes that make it read well (decided,
D-167), in the player's styles:

- **Fonts are shipped.** Today's faces (Inter, EB Garamond, JetBrains Mono) go into the bundle and are
  declared in the page's head (a font declared inside the player's shadow root does not apply). No viewer
  depends on what is installed.
- **One named setting for the letters (`--sans`).** About forty places in the player spelled out `Inter,
  ui-sans-serif, …`; they read `var(--sans)`, defined once.
- **Text in three solid shades** instead of five light greys, a real scale of sizes, keycaps for keys,
  and the accent meaning only "yours, waiting on you". The accent is the darker coral (decided, D-142):
  the same hue as before, dark enough to pass 3 : 1 contrast on the page, and the videos take it too, so
  there is one colour from video to page. The right answer of a quick check is marked by more than colour
  (a tick; a wrong pick gets a cross and a dashed ring).
- **The Look menu's two samples, Reading desk and Tally, leave the review page**: they were there to
  choose from, and today's look was chosen.
- The video's size and place do not change; the specs that check the answer's colours are updated.

### Step 4 — Videos rebuilt as they are revised; the system video once

*Needs steps 1–3.*

No mass rebuild. A plan or walkthrough video takes the new style when it is next revised, in the
scenes a review touches; its other scenes stay as they are. The system video is rebuilt once, whole,
after steps 1–3 land, since every new viewer starts there. This plan's own video is the first built
this way.

## Components touched

- **The plan-to-video skill** — the style guide's "what to draw", pinned words, the frame template's
  optional heading, the motion language, the forked code and terminal blocks, the lints (steps 1 and 2)
- **finish-project** — transitions with meaning, the scale-only zoom-through (step 2)
- **The review player** — its fonts, solid text shades and scale, and the one setting for its letters (step 3)
- **The system video** — rebuilt once in the new style (step 4)

## How each was decided

Reviewed 2026-09-26 in the review page, twice (both verdicts: changes requested).

- **Which accent colour?** A darker coral (D-142, the recommendation, first review): the same hue, dark
  enough to pass on the page, and the videos take it too. Step 3 says so.
- **Which scenes must show the real thing?** (step 1) The brief picks (D-166, second review; not the
  recommendation, which was every scene with a real thing, checked by the build). Each video's brief
  names the scenes that show the real thing, and nothing warns. Step 1 now says so, and its warning for
  scenes that draw only boxes is gone.
- **Which look should the review page take?** (step 3) Today's look, fixes only (D-167, second review;
  not the recommendation, Tally): its fonts shipped, solid text shades, a real scale of sizes, still cream
  and coral, the darker coral. Step 3 is now that work, already built; Reading desk and Tally leave the
  page.
- **Your note on "the real thing"** (second review, on the scene that defines it): "ok but its infeasible
  to hsow all file changes, and we often need to explain it in a way thats easier tounderstand. like waht
  if we change 10 files, how do you expect to do here". Step 1 now answers it: never every file; a change across many files shows its map
  first, each file with one plain line, then the one or two places that carry the idea; and where the real
  thing is hard to read, a picture that explains it.

## Decisions in force

- **D-166** The brief picks which scenes show the real thing; nothing warns (step 1).
- **D-167** The review page keeps today's look, with its reading fixed (step 3).
- **D-142** The accent colour is a darker coral, on the page and in the videos (step 3).
- **D-127** Plain words on screen; the files keep theirs. The pinned labels (step 1) use the
  glossary's on-screen word.
- **D-083** A quick check per step, plus wherever there is something to predict: unchanged; its case
  now stays frozen behind the question.
- **D-108** Where the answers the frame can't take go: unchanged; step 2's checks keep the lowest eighth
  empty and the cards still for it.
- **D-021** A detail opens in the side panel; **D-024** detail pages start from a template: untouched.
- **D-085** Less scaffolding: this plan adds a document (the motion language) and checks, not steps.
- **D-003** The system video updates after every accepted walkthrough; step 4 adds one full rebuild.
- **D-065** A comment on the system video changes the video or the system: unchanged.
- **D-128** "Watched" is kept in this browser and your file: a rebuilt video counts as changed, as now.
- **D-129** Approving is never blocked: unchanged.
- **D-005** Rewinds are sent: unchanged.
- **D-064**, **D-066**, **D-082** The loop's background agent, one setting, auto mode in the sandbox:
  untouched.
- **D-084**, **D-109**, **D-110** What stops the walkthrough and the fifth choice: untouched.
- **D-106**, **D-107** Your memory's file and the retro: untouched.

## Not in this plan

Changing what a scene says: narration, pace, the length budget and the order of a plan video stay as
they are. Sound and music (still none). New HyperFrames blocks beyond the two forks.
