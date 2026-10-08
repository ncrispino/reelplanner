# The right calls stop, and the walkthrough stays short

## The problem

Every call in the answer-on-the-video walkthrough stops the video: 23 of 23 (22 calls and a
deviation), each with a beat of its own, so the walkthrough fits five minutes only with one sentence
a call. The memory walkthrough: 14 of 16. Three things cause it.

- **Every tag's streak is 0.** D-084 lets a tag stop no more once you have accepted it ten times
  running; the three own-words answers at the end of the revise-loop review (D-103 to D-105) reset
  `visible`, `close` and `hard-to-undo`.
- **A miss with no tags reaches every call on its component.** Memory's call A12: one old miss (D-056,
  a width limit for the plan text, on the review player) makes every tagged player call stop, and the
  quick-check miss on revise-loop step 6 names five components, so it reaches nearly every call.
- **Plans leave too much open.** The skill says a dozen calls is too many; every plan so far had more
  (15 to 34), and nothing acts on it. In the four walkthroughs you reviewed, steps with five or more
  calls hold 38 of the 84 calls, and 6 of the 8 you flagged, answered in your own words or saw
  changed later.

You take the recommendation (15 of 15 answered from the options) and accept most calls the first
time (84 of 91). So the aim is not fewer stops for their own sake: the calls that stop should be the
ones you might overturn, and a stop should cost a clause, not a beat.

## What changes

Three changes, independent of each other.

1. **One pause per step** (step 1): the calls that stop in a step share one beat.
2. **A miss stops its own kind** (step 2): matched by tag, not by component.
3. **Too many calls becomes a question** (step 3): warned, and asked before it is built.

## Steps

### Step 1 — The calls that stop in a step share one beat

*Independent.*

Today every call that stops has a beat of its own, so the video pauses once per call. After this
step it pauses once per step for that step's calls, and once more for each deviation:

- **The step's calls share one beat.** The walkthrough gives each step one stop beat that names all
  of that step's calls that stop: `- autonomy: a3, a4, a5` (a beat with one id still works). The
  narration gives each call a clause; its why and where to check are in its row.
- **The video pauses once, at the end of that beat.** The answer band lists each call (what it chose,
  and instead of what) with its own Accept and Flag. It is like the grouped sheet, with no Accept
  all. The video goes on once every call on the list has a verdict.
- **A deviation keeps its own beat.** It is never on the step's list: it pauses the video on its own,
  as now. Example: memory's step 4 has two calls that stop, A11 and A12, and a deviation, D1. The
  video pauses **twice** there: once for A11 and A12 together, once for D1.

`reel stops` prints the beats by step (the shared beat's ids, then each deviation's own beat), and
the skill and style guide replace "one beat per call" with this. On the two walkthroughs waiting for
review, 23 pauses become 5 and 14 become 6.

### Step 2 — A miss stops calls of its own kind

*Independent.*

A call stops for a recent miss only when it shares a tag with that miss. The component no longer
matters. So a call that shares no tag with any recent miss is judged by its own tags' streaks alone,
as if there were no miss:

- A recent miss is tagged `close`. A new call on the same part is tagged `close`: it stops, however
  long `close`'s streak (as now).
- The same miss, and a new call on the same part tagged `visible`, where `visible` has been accepted
  ten times running: it does **not** stop. It shares no tag with the miss, and its tag has its ten.
- A miss with no tags (a plan question's miss, or a call from before tags) stops nothing directly
  (D-109). It still shapes the next plan's questions (memory step 4).

`reel stops` says which rule stopped a call (a deviation, a tag's streak short of ten, or a miss
sharing a tag). Memory's call A12 changes before its review, and its row says so. Today this changes
why calls stop, not how many (every streak is 0), and it matters once a tag earns its ten.

### Step 3 — Too many calls in one step is asked, not made

*Independent.*

Two rules, one for the whole plan and one for a step:

- **The whole plan: `reel audit` warns past 12 calls.** It counts every call and deviation in the
  walkthrough, whichever steps they are in, and names the step with the most ("23 calls; step 2 has
  8"). It warns even when no step reaches five. Example: the memory walkthrough has sixteen calls
  and no step has more than four, and `reel audit` says "16 calls; step 1 has 4". The warning does not
  fail the audit.
- **A step: five calls is a question.** The skill tells the plan writer: a step you expect to need
  five or more calls asks its biggest as a question instead. When a step reaches its fifth call
  anyway during the build, the implementer asks before going on (D-110): that step waits, its
  biggest open choice goes into `plan.md` as a question for you, and the other steps carry on.

## Components touched

- **The reel CLI** — `stops` prints beats by step and the rule behind each stop; `audit` warns on
  the call count; the stop rule in `scripts/lib/autonomy.mjs` (steps 1–3)
- **finish-project** — the plan map reads a list of ids on a stop beat (step 1)
- **The review player** — one pause per stop beat, each call with its own Accept and Flag (step 1)
- **The plan-to-video skill** — one stop beat per step, the five-call rule (steps 1 and 3)

## Open questions for the reviewer

1. **What may a miss with no tags stop?** (step 2)
- **A · Nothing directly.** A miss stops only calls that share one of its tags; a miss with no tags
  still shapes the next plan's questions (memory step 4), but stops no call.
- **B · Close calls on its component.** It counts as a `close` miss on its components: it stops the
  calls there tagged `close` (15 of the answer-on-the-video's 22).
- **C · As now.** Every tagged call on its components stops, for five plans.
I recommend A: a component is too coarse to say what kind of call went wrong, and a question's miss
belongs to questions.

2. **When a step reaches its fifth call during the build, what does the implementer do?** (step 3)
- **A · Asks before going on.** That step waits; its biggest open choice goes into `plan.md` as a
  question for you, and the other steps carry on.
- **B · Builds on, and says so.** The walkthrough opens with the count and the step; `reel audit`
  warns.
I recommend A: 6 of the 8 calls you did not simply accept came from such steps,
so that is where a question is worth the wait.

## Decisions in force

- **D-084** Tags and your record decide what stops; this plan keeps the streak of ten and a flag
  resetting it, and narrows only the misses' exception to it.
- **D-108** The answer band holds a call's Accept and Flag; step 1 lists a step's calls in it.
- **D-083** Quick checks, one per step; unchanged.
- **D-001** The code check is a second agent; unchanged (step 3's warning is `reel audit`'s count).
- **D-106** Your memory across repos; unchanged, and it records which kinds of call were flagged.
- **D-107** When a retro is suggested; unchanged (this plan is not the retro `reel status` says is due).
- **D-005**, **D-021**, **D-024**, **D-064**, **D-066**, **D-082**, **D-085** Rewinds sent on their own,
  details in a side panel from templates, the loop's background agent, one setting, auto mode in the
  sandbox, less scaffolding. Unchanged; not touched here.

## Not in this plan

Changing what resets a streak. Of the three calls answered in your own words, two left the call as
it was (revise-loop A29 and D2) and one changed it (A18); resetting only on a change would move
`close` from 0 to 1 and stop no fewer calls today. Worth another look when there is more evidence.
The streak of ten itself.
