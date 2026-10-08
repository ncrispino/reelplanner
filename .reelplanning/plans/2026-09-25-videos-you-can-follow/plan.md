# Videos you can follow

## The problem

You approved the last plan (fewer, better stops) with all three of its quick checks answered
wrong. Across every review so far, 12 of 36 quick checks were answered wrong. In your words: "the
worst case is I am just confused, so I approve everything." Three things cause it.

- **Words are used before they are explained.** That video's second quick check asked about "a
  recent miss tagged close" and a tag "accepted ten times running". The video never said what a
  call, a tag, a streak or a miss is, and it named decisions by their numbers instead of what they
  decided.
- **Nothing says what to watch first.** Every plan video assumes you know how calls, tags and the
  video's answer bar work. The system video (the one video on the whole tool) would help, but nothing
  points to it, and nothing checks that it explains those words.
- **Quick checks test a clause, not the idea.** The first check asked about an exception said in
  passing ("a deviation", a change from the plan, "keeps its own beat"), while the beat before it
  showed a different case.

## Already built, not asked here

Built separately, alongside this plan: a card before each video listing its prerequisites (the
videos to watch first; the system video by default, from the storyboard's `before:` line); a panel
listing the words the video uses, each explained; no id shown or said without what it is; after a
wrong quick check, a "Walk me through it" button that explains the right answer on the case shown;
a quiet note at Finish when checks were missed; and a build check that flags bare ids and
unexplained words. This plan goes deeper, and builds on them.

## What changes

Four changes. Step 2 needs step 1's list of which video explains each word; steps 3 and 4 stand
alone.

1. **Every word explained once, and one click away** (step 1).
2. **The tool picks what to watch first** (step 2).
3. **The tool remembers where you got lost** (step 3).
4. **Quick checks test the main idea, on the case just shown** (step 4).

## Steps

### Step 1 — Every word is explained once, in the system video, and one click away

*Independent; step 2 builds on its list.*

- **The glossary (the repo's list of words, one meaning each) is a promise the system video keeps.**
  Every glossary row has a beat of the system video that explains it; that beat carries
  `- defines: <term>`. The system video's build fails while a row has no such beat, and names it.
  Example: no beat of the system video explains a streak (it never says "ten in a row"), so once the
  glossary has a row for it, the system video's build stops on "streak has no beat" until one is added.
- **The system video covers what you see and what is recorded:** a chapter, a beat, a step, a quick
  check, the answer bar, a detail and Finish; the decision log, a call, a tag, a streak, a miss and
  memory. A new glossary row marks the system video behind in `reel status`, as a changed spec
  section does (D-003: the system video catches up after every accepted walkthrough).
- **One list of which video explains each word.** finish-project reads every video's `defines:`
  lines into a repo-wide list: word, video, beat.
- **Words in the captions can be clicked.** In any video, a glossary word in the captions is
  underlined; clicking it pauses the video and shows its one-line meaning inside the frame, above
  the answer bar, with where it is explained ("the system video, chapter 4") and a link that plays
  that beat.
- **Plain words on screen; the files keep theirs (D-127).** What you see and hear says choice (not
  call), label (not tag), "accepted in a row" (not streak), late fix (not miss), chapter (not part) and
  scene (not beat). Files, commands and the decision log keep today's names. The glossary lists both:
  each row's name for the files, and the word said on screen where it differs. The system video's
  beats that explain a word explain it in the plain word, and the player's own text uses them too.
- **Simple language in plans too** (the owner's note on D-127: "in general we want simple language
  too in our plans … dont make more complicated than it needs to be"). The skill's "A new plan" and the
  style guide say it: plain words, one idea a sentence, no more complicated than the plan needs to be.

### Step 2 — The tool picks what to watch first

*Needs step 1's list.*

`reel prereqs <plan-dir>` writes the storyboard's `before:` line; the video's author no longer
guesses it.

- **The system video, always,** named by the chapters that show the parts this plan touches.
- **An earlier plan's video** when this plan builds on one of its decisions, or uses a word that only
  that video explains (step 1's list).
- **At most two** besides the system video. Past that, the video gets a short beat that sums up the
  rest for new viewers (`- knowledge: new`) instead.
- **What you have watched is ticked off.** With every video on the card watched, the video starts
  without its beats for newcomers. "Watched" is kept in this browser at once, and in your file across
  repos when you send a review (D-128): the page ticks a video off the moment you finish it; the review
  you send carries what this browser has watched, and `reel record` adds it to your file, so any repo's
  tool can read it.

Example: the last plan (fewer, better stops) builds on the streak of ten (D-084), decided in the
revise-loop plan. Its card lists the system video's chapter on the build loop, then the revise-loop video.

### Step 3 — The tool remembers where you got lost

*Independent.*

Memory is what the tool learns from your reviews (`reel status` ends with it).

- **A new line, `lost`:** per plan, the quick checks answered wrong, the explanations opened, the
  words looked up, and approvals given with checks missed.
- **The same word looked up in three reviews** is a signal (D-124: three of one kind make a retro due)
  that its explanation is not working: the retro rewrites that word's beat in the system video, or its
  glossary row.
- **Your file across repos** (D-106: `~/.reelplanning/you.jsonl`) keeps the words you have looked up
  and the videos you have watched, so the skill stops explaining words you know, in any repo.
- **An approval with checks missed is recorded** ("approved with 3 of 3 checks missed"), and never
  blocks (D-129): Approve works as always; the review says it, and memory's `lost` line counts it.

### Step 4 — Quick checks test the main idea, on the case just shown

*Independent.*

Rules in the skill and the style guide's quick-check section, and a build check:

- **A check tests the beat's main idea**, not a clause said in passing; on the exact case the beat
  before it showed, with the same names and numbers; and it adds no new facts.
- **Its `explain` gives the reason in words**, never an id; its `walk_me_through` walks the same case
  in two to four sentences; its `explained_at` names the beat that shows the answer.
- **The build warns** when a check's right answer uses words its `explained_at` beat never says (the
  answer was not shown), and fails when a check has no `walk_me_through`.

Example: the last plan's step 1 beat showed eight pauses in one step becoming one; its check asked
about a deviation (a change from the plan), said in one clause. Under this step the check asks:
eight calls stop in this step; how many times does the video pause?

## Components touched

- **The system video** — a beat that explains each glossary word, tagged `defines:` (step 1)
- **finish-project** — the list of which video explains each word, and the checks on it (steps 1 and 4)
- **The review player** — words in the captions that open their meaning; "watched" ticked off (steps 1 and 2)
- **The reel CLI** — `reel prereqs`, the `lost` line in memory (steps 2 and 3)
- **The plan-to-video skill** — the quick-check rules; `before:` from `reel prereqs` (steps 2 and 4)

## Open questions for the reviewer

1. **Which words does the viewer see: plain new ones, or today's, explained?** (step 1)
- **A · Plain words on screen; the files keep theirs.** What you see and hear says choice (not
  call), label (not tag), "accepted in a row" (not streak), late fix (not miss), chapter (not part)
  and scene (not beat). Files, commands and the decision log keep today's names; the glossary lists
  both. Costs two names for each thing: one for you, one for the files.
- **B · Keep today's words, and explain each one.** One name everywhere; the explanation card, the
  words panel and step 1's click do the work, in every video, for every new viewer.
I recommend A: a word that says what it means needs no explaining; "tag" means nothing until it is
explained, and "label" almost says it.

2. **Where is "you watched it" kept?** (step 2)
- **A · This browser at once, and your file when you send.** The page ticks a video off the moment you
  finish it; when you send a review, your file across repos records it too, so any repo's tool can
  read it.
- **B · Only from reviews you send.** A review already records how much you watched (96% of the last
  one); a video you finish without sending a review counts as not watched.
I recommend A: the card needs to know right away, and the tool needs it in every repo.

3. **Can approving ever be blocked when you answered checks wrong?** (step 3)
- **A · Never; it is recorded.** Approve works as always; the review says "approved with 3 of 3
  checks missed", and memory's `lost` line counts it.
- **B · Blocked when every check was missed**, until you open each missed check's explanation.
I recommend A: a block teaches clicking through; a record lets the next video fix what lost you.

## Decisions in force

- **D-003** The system video catches up after every accepted walkthrough; step 1 adds a new glossary
  row to what makes it behind.
- **D-083** Quick checks: one per step, plus wherever there is something to predict; step 4 changes
  how they are written, not how many.
- **D-084** A tag stops no more after you accept it ten times in a row, and one flag brings it back;
  unchanged (it is step 2's example).
- **D-106** Your memory across repos is `~/.reelplanning/you.jsonl`; step 3 adds words looked up and
  videos watched to it.
- **D-107** A retro is suggested every five plans, or when a signal repeats three times; unchanged.
- **D-124** A signal is three of one kind; step 3 adds "the same word looked up".
- **D-108** The answers the frame can't take go in the answer bar, inside the frame; step 1's meaning
  shows just above it.
- **D-065** A comment on the system video that asks for a change is fixed straight away when small, a
  plan otherwise; unchanged, and a word's rewrite from step 3 goes the same way.
- **D-109** A miss with no tags stops nothing directly, and **D-110** a step's fifth call is asked
  before going on; unchanged (the last plan's decisions, used here as an example).
- **D-005** (rewinds are sent on their own), **D-021** (a detail opens in a side panel), **D-024**
  (detail pages start from templates), **D-064** (a background agent runs the loop), **D-066** (one
  setting, tested with Claude Code), **D-082** (a run nobody watches is in auto mode, in the sandbox),
  **D-085** (less scaffolding): unchanged; not touched here.

## Not in this plan

What is built separately (listed above). Renaming anything inside the files, commands or the decision log.
