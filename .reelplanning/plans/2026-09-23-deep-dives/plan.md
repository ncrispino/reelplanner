# Deep dives: the video opens into HTML where a video falls short

## The problem

A plan video is good at the story: the problem, the parts, each step, each choice. It is bad at
things you read at your own pace or poke at:

- **Code.** A diff, an API contract, a schema. The walkthrough says "check `src/upload/parts.ts`
  line 14", and the reviewer has to leave the player to find it.
- **Exact values and long lists.** A risk table, twelve config keys, every file a step touches. On
  screen for four seconds, they are gone before anyone reads them.
- **Things you try.** A layout, an animation, a flow. The Bob Dylan video shows design prototypes
  as pictures; you cannot click them.
- **Skimming, searching, copying.** The text plan sits next to the video, but nothing links the two.

HTML is good at exactly these ([The Unreasonable Effectiveness of HTML](https://thariqs.github.io/html-effectiveness/):
annotated PRs, plans with data-flow diagrams and risk tables, clickable prototypes). HTML alone is
still a page to read and scroll, which is why reelplanning chose video. This plan gets the pros of both:
the video tells the story, and any moment that needs more opens into HTML without leaving the player.

## Steps

### Step 1 — Deep-dive beats

A storyboard beat can carry `- detail: <name>`, which points at a page in the video project's
`details/` folder. The plan map lists each detail with its frame, plan step and title. When the video
reaches a beat that has a detail, the player shows an "Open" chip (key: E). Opening it pauses the video
and shows the page. Closing it resumes where you were. The story never depends on a detail: the video
must make sense to someone who opens none.

### Step 2 — Kinds of detail, most of them things to try

**A detail must hold what the video cannot** (the reviewer's rule, second review): more than a screen can show, something to try,
or the evidence behind a claim. If one narrated sentence could say it, it is not a detail; say it in
the video. So most details are things you do, not things you read. For the resumable-uploads plan
and the Bob Dylan site, they would look like this:

- **Explore**: the frame's diagram, but live. Click a part to see what goes in and out; step through
  an upload yourself and watch the manifest row fill in, part 1 to part 90.
- **Try it**: a working prototype. Click through the three Bob Dylan home pages, drag the timeline,
  open an album. The design choice becomes three things you have used, not three pictures.
- **Evidence**: the data behind a number or a claim. The video says "16 MB parts lose less on a bad
  network"; the detail holds the staging runs behind it (8, 16 and 32 MB parts, each through the same
  forty dropped connections: parts resent, time to finish, retries), so the reviewer judges the number
  from the runs, not from the sentence.
- **Table**: anything with more than four rows. The risks, every config value, the options side by
  side. Sortable, and each cell copies.
- **Code**: only when the code itself is what you are judging: an API contract, a tricky function,
  a migration. Never by default (D-023).
- **Plan text**: the step as written in `plan.md`, so search and copy work.

The style guide carries the rule and its test: before adding a detail, write the one sentence the
video would say instead. If that sentence is enough, there is no detail. The narration says in one
sentence what opening it gives you that the video does not.

### Step 3 — Comments inside a detail

The review player's comment tools work in a detail. Select a line of code, a table row or an element
of a prototype and comment on it. The comment is tied to the plan step, the detail and the line or
row, and it reaches the agent like any other comment. resolve-plan lists it under its step with where
it points ("`parts.ts` line 14: …").

### Step 4 — Walkthroughs open onto what changed, not always the code

In a walkthrough, each call the agent made on its own can open a detail, and the detail shows whatever
lets you judge that call fastest (D-023):

- a behaviour change: a before-and-after you can try (the old upload failing at 90 %, the new one
  resuming);
- a value the agent picked: the evidence behind it, never just the value restated (the 16 MB part
  size opens onto the staging runs that chose it, next to the 8 MB the plan said);
- a change to an interface or to data: the code, with the lines that carry the call marked.

Code is one kind among these, used when the call is about the code itself. Accept and Flag work from
inside a detail as well as from the video.

### Step 5 — The whole plan as a page beside the video

Below the player, the full text of the plan, one section per step. The step the video is on is
highlighted, so you always know where you are in the text. Click any step and the video jumps there.
It is the text plan you would otherwise read on its own, joined to the video: you can skim ahead,
search for a word or copy a sentence without losing your place.

### Step 6 — Every detail works before you see it

Before a video reaches you, a check opens every detail it links to. A detail that is missing, broken,
or needs the internet to load stops the build, just as a broken frame does today. The review page you
open (on your machine or as a Claude page) carries the details with it, so an "Open" never leads
nowhere. This plan's own video is the first test: it is rebuilt with one detail of each kind.

## Components touched

- **The review player**: the Open chip, the side panel, comments inside a detail, the plan page beside the video
- **The plan-to-video skill**: the detail kinds, when to use each, the "earn its place" rule
- **finish-project**: the plan map lists details; the check opens every one
- **resolve-plan**: comments that point into a detail
- **The implement step**: the details a walkthrough links from each call

## How each was decided

Reviewed 2026-09-23 in the hosted player (verdict: changes requested).

- **Where does a detail open?** In a side panel beside the paused video (D-021).
- **What does a walkthrough show?** In the reviewer's words: not always code, and not only code; code
  only when it is justified, and other kinds of detail, such as more interactive depth, when they are
  clearer (D-023). Steps 2 and 4 now say this.
- **Who writes a detail page?** The reviewer asked for more information and examples (D-022, reopened),
  so it was asked again, with examples, as the question below.
- **How is each detail page made?** Types first, a fresh page when none fits (D-024, the
  recommendation). Reviewed 2026-09-23, second round.
- **What earns a detail?** The reviewer's note on the second round: a detail must hold what the video
  cannot; the part-size example restated a sentence and is replaced. Steps 2 and 4
  now say so.

The question as it was asked the second time:

1. **How is each detail page made?** (step 2)
Someone has to build every detail. Take the uploads plan: its "Explore" detail is a manifest row that
fills in as you step through an upload; its "Table" is the risk list.
- **A · Written fresh for each plan.** The agent builds the manifest explorer from scratch for this
  plan, as the HTML examples online do. Anything is possible. Costs the most time and tokens per video,
  pages vary in quality, and comments have to be wired into each one.
- **B · Only fixed page types, filled in.** A table page, a code page, a worked-example page, a
  prototype frame: the agent supplies rows, lines and values. Fast, consistent, and comments work the
  same everywhere. Costs anything the types did not foresee: the manifest explorer would become a
  plain table.
- **C · Fixed types first, a fresh page when none fits.** The risk list is a table page; the manifest
  explorer is written fresh. Costs a fresh page getting simpler comments (on the whole page, not on
  a line).
I recommend C: tables, code and worked examples fit a template, and the details worth the most (things
to explore and try) are the ones that need building fresh.

## Decisions in force

- **D-024** Detail pages: fixed types first, a fresh page when none fits.
- **D-021** A detail opens in a side panel beside the paused video (full screen on a phone).
- **D-023** Code only when the call is about the code; otherwise the detail that makes the call clearest.
- **D-004** A pick-all answer plays one summary frame. A detail never replaces it; the summary frame may carry one.
- **D-005** Rewinds and slow-downs are sent automatically. Opening a detail is not a rewind, and time spent in a detail is not counted as watching.

## Not in this plan

Rebuilding the example videos with details (that is the examples redo, after the lifecycle work).
Selecting, erasing and editing marks (asked for in this review, and built as a player change on its own).
Editing code from inside a detail. Details in the system video.
