# Walkthroughs that help: see the build run, stop only where you'd notice

## The problem

The owner, after the last few walkthroughs:

> "i think one main thing too is that walkthroughs are not very helpful rn i just end up spamming accpet
> maybe its just hard to make snese of them, or maybe it shoulnd really be a huge separate video at all?
> idk this is something we need to plan better for"

Today, once a plan is built, the agent makes a second video, the walkthrough: about five minutes that go
step by step through what was built, pause at the choices the agent made on its own (Accept or Flag
each), and ask quick checks. The review records say what happens to it.

- **You accept everything, and faster each time.** In 15 walkthrough reviews you judged 191 choices:
  183 accepted, 1 flagged, 7 answered in your own words, all 8 of those before 26 September. Since
  then: 69 of 69 accepted. On one pause, several choices were accepted 0.3 s apart in better-visuals and 0.6 s apart in details-in-the-frame (4 s in videos-you-can-follow);
  one choice's line takes longer than that to read.
- **Two walkthroughs were approved without a look.** answer-in-the-frame (27 choices) was sent 15 s after
  you pressed play; fewer-better-stops (10 choices) after 77 s. None of their choices was judged.
- **You write on plans, not on walkthroughs.** On 26 and 27 September: 7 walkthrough reviews, 2 with
  any words of yours (one comment, one note on a check); 9 plan reviews, 6 asking for changes, 7 with
  your words (comments, answers in your words, notes on a check).
- **The quick checks don't land.** 25 of 38 right across walkthroughs; the last two, 0 of 4 and 1 of 3,
  with no words on any wrong one.
- **Accepting didn't catch what was wrong.** 10 choices accepted in a walkthrough were changed later
  anyway. 6 of them were about the answer bar and the plan text, things you see on the page, and they
  were found by using it: answer-on-the-video's A5 went after you saw the video shrink and grow back.
- **An accept is a decision.** 171 of the 218 entries in the decision log are walkthrough choices you
  accepted, and a later plan that touches one is warned about it: this plan's own check lists 135.
- **The accepts teach the wrong thing.** A label stops the video until it has been accepted ten times in
  a row (D-084). Every label has now reached ten; in details-in-the-frame, only an old late fix still
  made six choices stop.

What you did catch, when you caught something, was something you could picture or that decides what runs
on your machine: Escape throwing away the words you typed (richer-review A10), which plan text shows
beside the video (deep-dives A8), what a run nobody is watching may do (revise-loop A11, A18, D2), where
your memory file goes when it can't be written (memory A15). None was about an inside detail, like a lint
rule, a field in a JSON file or a file's name, and most choices are those.

## Why they fail

- **A choice is a sentence about code.** "`frame-lint` measures a marked thing from the frame's CSS
  (px left/top/width/height…)". You can't judge that from one line, so Accept is the only answer that
  makes sense.
- **It retells the plan you approved.** One scene per step, five minutes, as long as the plan video.
- **It never shows the thing running.** The late fixes were found by using the page, not by watching a
  picture of it.
- **Fewer pauses alone did not help.** fewer-better-stops put a step's choices on one pause: from one
  pause per choice (23 in answer-on-the-video) to three to five. The walkthroughs after it were accepted
  faster, not slower: several cards on one pause read as a checklist. A recent
  walkthrough still pauses 10 to 14 times in under five minutes, counting grouped scenes and checks.

## After your reviews

**First review.** You picked a short video of it running (D-219), and on which choices pause you said, in
your words: "i dont like specifically saying 'five' … there's a lot that changes per plan i dont think being
too specific is good" (D-220). You asked to tie the walkthrough to its plan (now step 5), and not to be held
to the system video's eight minutes (step 7).

**Second review.** You took all four recommendations: a choice on the list is listed, not judged (D-221);
a quick check where there's something to predict (D-222); a small pull request needs the video only for a
choice you'd notice (D-223); one row per plan with a Plan | Built switch (D-224). Three things were not
clear enough, and are now in the steps:

- "ok but arent there big bckend changes important too?" They are. "Running" now includes a real run of a
  backend change: the saved file before and after, a command's output, a migration on a copy of real data
  (steps 1 to 3).
- "wdym dropps the video … how ma i supposed to get more information about this???" Step 6 now says which
  video would go, what you get in its place, and that it only happens if you approve the plan that
  proposes it; the scene opens a page with the whole of it, and every quick check has its walk-through.
- "ideally shorten it a bit but maybe not too crazy": the system video gets a bit shorter where the new
  rule makes scenes redundant (step 7).

No question is left open.

## What changes

Four changes, in seven steps.

1. **The walkthrough shows the change running** (steps 1 and 3): before and after, on the real screen or
   in a real run, in about two minutes, with a quick check where there is something to predict.
2. **Only what you'd notice, or can't easily undo, pauses it** (steps 2 and 4): a judgment, not a count;
   the rest are a list you can flag. The same for pull requests.
3. **The plan and what was built sit together** (step 5): one row per plan on the review page.
4. **We measure whether it worked** (steps 6 and 7): the page logs how long you look at each pause, and
   the system video says the new rule.

Step 1 stands alone. Step 2 stands alone. Step 3 needs step 1. Step 4 needs steps 1 and 2. Step 5 needs
step 1. Step 6 needs step 2. Step 7 needs steps 1 to 3.

## Steps

### Step 1 — The walkthrough shows the change running

*Independent. Decided: D-219.*

After the build, the walkthrough shows each of the plan's changes running, before and after:

- **On the screen**, when you'd see it: the review page before and after. Take details-in-the-frame: the
  corner chip on an older scene, then the same scene with the tab on its code block, and a click opening
  the page over the frame.
- **In a real run**, when it happens behind the page: the saved file before and after (a review stored as
  one file per review, then one per day), a command's real output in the terminal block, a migration run on
  a copy of real data with the rows before and after.

Then the pauses (step 2), and at the end what ran (the tests, the code check), what is not done, and the
list. It aims for about two minutes; `build` warns when it runs much longer. The brief picks every change
scene as a real thing (D-166). `walkthrough.md` keeps its per-step record in text, and `reel audit` checks
it as today. The file and folder names stay (`walkthrough.md`, `walkthrough-video/`), and so does the word
walkthrough.

### Step 2 — A choice pauses the video when you'd notice it or can't easily undo it

*Independent. Decided: D-220, in your words: no fixed count; D-221, a listed choice is not judged.*

Which choices pause is a judgment, made for each build and said in `walkthrough.md`:

- **An off-plan change always pauses**, as today.
- **Another choice pauses when you'd notice it, or can't easily undo it, and the video can show it
  running.** You'd notice it: it changes what you see or do (the Save button moves, Escape keeps your
  words). You can't easily undo it: stored data and formats, permissions, something other people's code
  relies on (old reviews deleted after a month; saved reviews moved to a new file layout). Both are shown
  running: the page before and after, or the saved file before and after.
- **Every other choice goes on the list.** The line: after the change, you see the same page, press the
  same buttons, and the same data sits on disk. A long file split in two, a helper renamed: nothing you see
  or do changes, so they go on the list. The list is one sheet at the end: each choice in one line (what it
  chose, instead of what), each with its own Flag. Approve takes the rest, as Accept all does today.
- **A listed choice is logged as "listed, not judged"** (D-221). A later plan that touches it is not warned
  by it; a flag on it while it is on the list still gets it fixed.
- **The ten-in-a-row rule goes** (it was D-084). Accepts a third of a second apart are not a judgment.

No count of pauses is fixed or capped. `reel stops` prints each choice with why it pauses or is listed,
from its label: *visible* now means you'd see it and it can be shown running; *hard-to-undo* covers
stored data and formats.

### Step 3 — A quick check where there is something to predict

*Needs step 1's video. Decided: D-222.*

A quick check comes where the built change has something to predict, asked just before the video shows it
running:

- **On the screen:** "You have typed a note and press Escape: what happens?", then the scene runs it and
  you see the note kept.
- **Behind the page:** "After the change, what does the saved file look like?", then the scene shows the
  real file before and after the run; or "The migration runs on a copy of last week's reviews: how many
  are left unread?", then the run prints it.

Only a change with no visible or runnable effect has nothing to predict: a rename, a split file. There is
no fixed number of checks.

**"The page looks the same" does not mean there is nothing to predict** (from the approval). A change to
what is saved, or to what a command prints, is something to predict, and the walkthrough shows it by a real
run. Take a build that changes the saved review file so each date moves from one field to two, with the page
looking just as before: its walkthrough asks "After the change, what does the saved file look like?", then
shows the real file before and after. Only when the screen, the saved files and every command's output all
stay the same is there nothing to predict. Each check has its walk-through and a way back to where its rule was shown, as
every check does. The end of the walkthrough asks one open question too, with room for your words: "Seeing
it run, anything you'd change?"

### Step 4 — Pull requests get the short walkthrough

*Needs steps 1 and 2. Decided: D-223.*

`CONTRIBUTING.md`, its template and the PR template keep who makes the video (D-200). The video is the short
one: "the walkthrough video, which shows the change running and pauses at what you'd notice". A pull request
over 300 lines needs it. A smaller one needs it only for a choice you'd notice or can't easily undo (step
2's test); any other choice is a line in the pull request's text that the maintainer accepts. `reel
pr-check` checks that line, and its check that the video is not stale follows step 2's rule.

### Step 5 — The plan and what was built, in one row

*Needs step 1. Decided: D-224.*

Today the review page lists each plan with two separate rows, "Plan video" and "Walkthrough" (`library.json`,
written by `bundle-player`, keeps them as `<plan>` and `<plan>--walkthrough`), and each opens a page of its
own. After this step:

- **One row per plan**, with a Plan | Built switch at the top of its page.
- **"See it built" jumps to the same step, running.** On step 6's plan scenes, See it built opens the
  walkthrough at step 6's own running scene (`?project=<plan>--walkthrough&t=<that scene's start>`, from the
  walkthrough's plan map, which says which step each scene belongs to), not at the walkthrough's start.
  "See the plan" on that scene jumps back to step 6's plan scene. A step with nothing running (a step that
  only changed wording, say) shows "Nothing to run for this step" instead of the button.
- **The two reviews stay separate records** (`reviews/plan-*.json`, `reviews/walkthrough-*.json`).

### Step 6 — Measure whether it worked, and what happens if it didn't

*Needs step 2's pauses.*

Today the review logs when you answered each choice, not when its pause began, so time spent reading can
only be guessed.

- **The page logs when each pause began** (`shownAt` beside each choice's `judgedAt`).
- **`reel memory` gains a line, `after-build`:** for each walkthrough review, the seconds from a pause to
  each answer (the middle value), flags and answers in your words, written comments, and whether it was
  sent before the video could have played through.
- **The bar.** Over the next three walkthroughs: a pause holds you at least five seconds (the middle
  value), and at least one flag, answer in your words or comment. Today: a third of a second, and nothing.
- **When it's missed.** Both halves are needed. When the three walkthroughs miss either one:
  - `reel status` says "walkthroughs: still accepted without a look (3 of 3), a plan to drop the walkthrough
    video is due".
  - The agent's next plan proposes it, as a plan you review like any other. Nothing changes until you
    approve that plan; asking for changes, or never answering, keeps walkthrough videos as they are.
  - What would go: the walkthrough video made after each build. What stays: the plan video, the code check
    and `walkthrough.md`.
  - What you'd get in its place, on the plan's row: a "what changed" section beside the plan video, a few
    lines per change (what differs from the plan, each off-plan change), with the list and its Flags, and
    Approve.
- **Where to read it.** The step 6 scene opens a page, "If the bar is missed", with all of the above.

### Step 7 — The system video says the new rule, a bit shorter

*Needs steps 1 to 3.*

The system video changes only the scenes the new rule makes wrong, and gets a bit shorter where the new
rule makes a scene redundant:

- "Two videos for every plan" says the walkthrough shows the change running.
- "What stops the walkthrough" and "One stop per step" (37 s together) become one scene of about 20 s:
  step 2's judgment and the list.
- "Fixing what you flagged" loses its sentence on the grouped scene, which is gone.
- Its last quick check (which asks the old pause count) asks step 2's judgment, on a new case, at the same
  length.
- The glossary rows for `reel stops`, the walkthrough video and the grouped scene change; "accepted in a
  row" goes.

That takes it from 7:59 to about 7:40. Eight minutes stays a soft target, in your words: "i dont want to
be too constrained then we'll just waste tokens on making it smaller where we dont really care if it is
much bigger". The build reports it as a warning only, and no plan trims a scene just to stay under it (it
relaxes D-133, which cut sentences to fit).

## Components touched

- **The plan-to-video skill** — the walkthrough's order, labels, pauses and checks in the skill and the
  style guide's §8; the system video's soft length; the template brief; `CONTRIBUTING.md` and the PR
  template (steps 1–4, 7)
- **The review player** — the list at the end with a Flag per choice, the open question, `shownAt` on
  each pause, the Plan | Built switch and the jump (steps 2, 3, 5, 6)
- **The reel CLI** — `reel stops`'s rule, `reel pr-check`'s line and stale check, `reel memory`'s
  `after-build` line and `reel status`'s message, `bundle-player`'s library (steps 2, 4, 5, 6)
- **The walkthrough fix step** — a flag on the list is fixed like a flag on a pause (step 2)
- **The system video** — the scenes the new rule makes wrong or redundant, and the glossary rows (step 7)

## Decisions in force

- **D-219** A short video of it running replaces today's walkthrough: step 1.
- **D-220** No fixed count of pauses (your words): step 2 is a judgment.
- **D-221** A choice on the list is listed, not judged: step 2.
- **D-222** A quick check where there's something to predict: step 3.
- **D-223** A small pull request needs the video only for a choice you'd notice: step 4.
- **D-224** One row per plan, a Plan | Built switch: step 5.
- **D-001** A second agent checks the code against the plan: kept; the video's end says what it found.
- **D-002** A flagged choice is fixed and the touched scenes rebuilt: a flag on the list works the same
  (step 2).
- **D-003** The system video is brought up to date after an accepted walkthrough: step 7 does it now.
- **D-023** A walkthrough shows code only where it matters: the short video shows the thing running, and
  code only for a choice about an interface or data.
- **D-110** At a step's fifth choice the agent asks: kept; fewer choices mean fewer on the list.
- **D-109** A late fix with no label pauses nothing: kept.
- **D-127** Plain words on screen: choice, label, off-plan change, late fix.
- **D-129** Approving is never blocked: kept; a missed bar proposes a plan (step 6), it never blocks.
- **D-166** The brief picks which scenes show the real thing: for the walkthrough, it picks every change
  scene (step 1).
- **D-200**, **D-202**, **D-213**, **D-215** Who makes a PR's video, the maintainer's code check, and the
  throwaway branch: kept (step 4).
- **D-197**, **D-198**, **D-199** When a quick check comes: the plan video and the system video keep them;
  a walkthrough's check comes just before the scene that runs it (step 3).
- **D-194**, **D-195**, **D-196** A detail opens from the thing it explains, over the frame: a choice's
  detail in the short video opens the same way.
- **D-142**, **D-167** The coral and today's look: the list, the open question and the switch use the
  page's tokens.
- **D-201** The log keeps the last answer when a maintainer disagrees: kept for PRs (step 4).
- **D-005**, **D-024**, **D-065**, **D-082**, **D-085**, **D-106**, **D-107**, **D-128**, **D-169**,
  **D-170**, **D-171**, **D-216**, **D-217**, **D-218** Rewinds, how a detail page is made, a system-video
  comment, the sandbox, less scaffolding, your memory file and the retro, where "watched" is kept, the case
  study, decision numbers, and the labelled words: not touched.

## Supersedes

- **D-084** "Does your own record also decide what stops? The labels, and your record." Replaced by
  step 2's judgment, decided in your words.
- **D-083** "How many quick checks does a video ask?" For the walkthrough only, replaced by step 3's check where there's something to predict. The plan
  video and the system video keep D-083.
- **D-041** "An accepted choice warns a later plan that touches its part." For listed choices, replaced by
  "listed, not judged" (step 2).
- **D-214** "When does a PR need a video? Choices or size only." Narrowed for small pull requests (step 4).
- **D-133** The system video's scenes were cut "to stay under eight minutes". Step 7 makes eight minutes a
  soft target, in your words; nothing is trimmed just to fit.

## Not in this plan

Recording video of the screen (screenshots and real command runs are enough for a first version).
Rebuilding older walkthroughs. Changing the plan video's own shape. The entries already in the decision log
stay as they are. Dropping the walkthrough video: if the bar is missed, that is the next plan's to propose.
