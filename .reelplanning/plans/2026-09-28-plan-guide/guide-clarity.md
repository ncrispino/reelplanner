# The guide, for clarity: what a reader asks, in order

The owner, on the built guide pages (2026-09-30):

> "not really easy to understand or according to human principles like it doesnt fully detail what i want to know
> and what we want to go through … clarity is biggest focus against slop and against poor design and not making
> sense"

The built page opened on a mono stat line ("5 steps · 28 cases · 16 interface parts · 4 questions · built: 79
files, +3,487 -6,617"), then "What changed" as a table of "kinds of change" with diff counts and spark bars,
"+1,890 -78 written by the build", "44 gaps", and words only this repo uses (beats, layers, kinds, Trace, the four
blocks, bare D-numbers). It answered "how big is the diff?" first. Nobody reviewing a change asks that first.

This file is the test the guide is held to: the questions a person has, in the order they have them, for each
kind of guide. The page answers them in that order, in plain words, and each answer is built from the plan's own
files (never written for one plan). Where a plan's files are too thin to answer, the page says so and lists it as
something the plan should add.

The guide now sits under the video on the same page, the video shrinking to a small player as you scroll (D-264).
So the guide is read as a column 720–1100 px wide, after or while watching, and on its own.

## How good pages explain a change

- **A good pull request description** (Google's "CL descriptions" guidance, most repos' PR templates): the first
  line says what the change does, in the imperative; then why; then how it was tested; reviewers are pointed at
  the risky parts. The diff is linked, not pasted.
- **Linear's changelog**: a headline that says what you can now do, one hero picture of it working, an opening
  paragraph on why it matters ("Coding sessions are the shortest path from issue to diff. Assign a task to Linear
  Agent, and it works …"), then short subsections, one per part, each a sentence and a screenshot; fixes and small
  improvements as a list at the end.
- **Stripe's changelog**: the benefit to the reader in one sentence ("Businesses in … can now offer Pix …"), the
  detail one link away; no code in the entry itself.
- **Rust's RFC template**: Summary (one paragraph), Motivation, a guide-level explanation (teach it as if it
  already exists, with examples), then the reference-level detail, drawbacks, alternatives, unresolved questions.

What they share, and the guide takes: **say what it is and what it's for before anything else; show it working
(a picture, a command, its output) before explaining how; put the reader's decisions and the risks where they
can't be missed; keep the full detail one click away, never in front.** Numbers appear only where they carry
meaning ("3 things need you", not "+3,487 −6,617").

## The questions, in the order a person asks them

Each section of the page answers one. Its heading is the answer's subject in plain words, its first sentence the
answer, then the real thing (a picture, a command, an output), then the detail folded away.

| # | The question | On a walkthrough (after the build) | On a plan video (before it) | On an explainer |
|---|---|---|---|---|
| 1 | **What is this, in one sentence, and why should I care?** | The plan's name and its promise (its title after the colon); "Built, and waiting on your review" or "Built; you accepted it on …"; why: your own words that asked for it (the first quote under "The problem") | The same, "A plan: not built yet"; why: your words | The question you asked, and the one-line answer the video gives (`explain.md`) |
| 2 | **What can I do now that I couldn't before? Show me.** | Each step as a thing you can now do: the step's name, its first plain sentence, a real picture of it running (the walkthrough video's scene), and its saved run (`runs/`) | Each step as a thing you would be able to do, with the plan's example of it | What it covers (`explain.md`), each source as the real thing |
| 3 | **How do I try it myself?** | The commands, copyable: those that really ran (`runs/`), then those the build says it has (Interface as built), then the plan's; and where in the video it runs | The commands the plan says it will add (marked "planned") | Where each source is, at which commit |
| 4 | **What did the agent decide on its own, and which should I look at?** | Its choices, the ones worth a look first: changed from the plan, what you'll notice, what's hard to undo; each "chose … instead of … because …"; the small ones folded | What's already decided for this plan, and why (each decision in plain words: the question, the answer, the reason) | — (an explainer decides nothing) |
| 5 | **What needs me?** | Your review: done or not, and what it covers; any plan question still open; any step still waiting | The open questions: each with its options, the plan's recommendation, and a place to answer | What you want next (the video's Finish) |
| 6 | **What could go wrong, or isn't done?** | "Not done", the code check's misses and how each was answered, what the tests covered | What the plan leaves out ("Not in this plan"), and what its text doesn't say yet | What it leaves out, and open threads |
| 7 | **Only then: where is the code?** | Each part of the change: a sentence, its files, and "See the code" (the real diff, every line, and each file whole) | Where it will touch ("Components touched"); the plan in full, each step's cases, interface and example | Each source, whole |

Last, folded: the plan in its own words, every paragraph (the guide drops nothing `plan.md` says, D-244), and how
the page was made.

## Rules for the words

- **No internal words on the page.** Not "beat", "layer", "kind", "Trace", "the four blocks", "gap", "part",
  "stage". Where a word of the system is needed ("walkthrough", "plan video", "decision log"), it is said with its
  plain meaning the first time.
- **A decision is its question and its answer**, never a bare number. The number (D-228, A9) is a small reference
  after it, for finding it in the log.
- **Headings say what you learn** ("What you can do now", "What needs you"), not what the data is ("Categories of
  change", "Decisions in force").
- **Counts only where they mean something to the reader**: "3 choices worth a look", "2 questions wait on you".
  Line counts live inside "See the code".
- **When the plan doesn't say, the page says so** ("The walkthrough doesn't say how to run this step"), and lists
  it under "What the plan should add". It never guesses.

## Where plans are too thin to answer (seen on the three walkthroughs)

- **How to try it** (question 3): only the plan guide's walkthrough has "Interface as built" blocks and saved runs;
  explain-first and contributing have neither, so their commands come from the plan (marked planned) and from the
  step's own words.
- **A plain one-line purpose per step**: the page uses the plan step's first sentence; some start with a file
  name, not a purpose.
- **The cases' traces and the interface's meanings** (a Trace column, `#` meanings): the older plans have none.
  These are listed together as what the plan should add, never one warning per row.

## Tested with fresh readers

Each round, a newcomer agent (`claude -p`, from its own scratch folder, with only `Read`) got one guide as a reader
gets it: the page's text as shown (folds closed), screenshots of it top to bottom at 1000 px, and the text with every
fold opened (for where it would click). It answered the seven questions above in its own words, then listed what
confused or bored it, what was missing, how it looks, and a verdict. The prompt is `guide-clarity/prompt.txt`; every
answer is in `guide-clarity/round-<n>/<plan>.md`. Three guides each round: this plan's walkthrough, explain-first's
walkthrough, and contributing's walkthrough.

**Against the truth** (`walkthrough.md`, `plan.md`, the reviews): from round 1 on, every answer to questions 1, 2, 4,
5, 6 and 7 matched the walkthroughs: what was built per step, which choices changed the plan (D1, D2; contributing's
D1), which are hard to undo, the review state (this plan's and contributing's not on file, explain-first's approved on
30 Sep with A9, A12, A13 accepted), what is not done, and the code by part. Question 3 was right where a run was
saved (this plan: `reelplanning guide …/video`, and the page it writes); for the two plans with no saved run the
readers said, correctly, that the commands were named but not proven.

| Round | What the readers flagged | What changed on the page |
|---|---|---|
| 1 | no plain top summary; D-/A-numbers and system words never introduced; "Six commands" over a list of seven; a failing `--check` run shown as the step's proof; "Also in the video" rows and per-step decision lists as noise; no single command to see all the code | An "In short" box (what you can do, see it work, worth your look, needs you, not done); the glossary's plain meaning for each system word the page uses, marked where it first appears; A/D/m explained where the choices start; reference numbers dropped from lead sentences; a run that finished cleanly preferred as a step's proof; the extra moments and per-step decision lists removed; `git show <the commits>` to copy |
| 2 | the code check's "2 of 5 steps done as planned" read as failure; cut sentences with a stray backtick; code names in command descriptions; the review asked for with no way to it; owner's to-dos only under Not done | The code check in plain words (what it agreed with, what it raised, that each is answered); cuts never inside code or bold; code asides removed from descriptions; the walkthrough video linked where the review is asked for; to-dos the walkthrough leaves to the owner listed under What needs you; "In short" became the page's contents |
| 3 | still no one sentence; the step 2 proof a failing run with no word why; choice cards a wall; "Where to check" folds repeated; Not done items not named | "What changes" as the plan numbers it, in the In short; a failing run says it found a problem and stops, the ✗ lines being what it reports; choices ranked (changed the plan, hard to undo, you'll notice), "The plan said" only where it changed; where to check on one line; Not done items named |
| 4 | a sentence made of the changes' titles read as a fragment; "none is on file yet" misread; the code check sentence hard to parse | No made-up sentence (the plan's own `**In one sentence:**` line, or it is listed as missing); "Not reviewed yet. Watch the walkthrough video and press Finish there"; the code check in two short sentences |
| 5 | the code check's findings folded away | Each thing the code check raised, one line: its subject and how the walkthrough answers it |
| 6 | the plans' own jargon (a part, the plan map, the system video); no one-sentence line; no saved run for explain-first and contributing | The words list opens by default; "the decisions it had to follow" for the code check's count. The rest is what the plans' files do not say, below |

**After round 6, the owner's own read at 1100 px** (no newcomer round: the next rework follows at once):

- The words list opened by default and was long; its meanings were dense and some out of date ("Guide" still opened
  over the frame, before D-264). It is one folded line now ("Eight words here have a special meaning, marked with a
  dotted line. Show them"); each word is still marked where it first appears, its meaning in a small card on hover,
  focus or a tap. The glossary rows the guides show are one or two plain sentences, the code in brackets (the player
  keeps those as "in the files"); "Guide" says the page under the video.
- "In short → What you can do now" listed step titles ("The guide (steps 1, 2)"). It lists what you can now do, a
  short verb phrase a step, from a `**You can now:**` line under each step of `walkthrough.md` (the skill asks for
  it; this plan's, explain-first's, contributing's and walkthroughs-that-help's have it), else a sentence of the step
  said to you ("You answer, comment and edit …"), else the title, listed under "What the plan and walkthrough don't
  say yet". Each step opens with the same phrase ("You can now …").
- "Not done" was one run-on line of capitalised fragments; it is a list, a clause each. The code check has its own
  line ("Checked"); "70 files written by hand, in eight parts" is "70 files changed, grouped by what they do". The
  problem paragraph drops its long bracketed asides and stops after two sentences, with a link to the rest.

**What is left is in the plans' files, not the page.** In every round the readers asked for the same two things the
files do not have, and the page says so under "What the plan and walkthrough don't say yet" rather than make them up:

- **One sentence of what it lets you do.** No plan or walkthrough has one. The page shows an `**In one sentence:**`
  line from `walkthrough.md` (or `plan.md`) when it is there; the skill now asks for it.
- **A saved run of it working.** explain-first and contributing saved none (`runs/`), so their "Try it yourself" is
  commands named in the walkthrough, marked "not run".

The plans' own words also carry their vocabulary (a guide part, the plan map, prototype v4, the system video). The
page gives the glossary's meaning for each system word it uses, and leaves the plans' sentences as written.
Verdicts, 18 readings over six rounds ("would a busy owner understand this change in five minutes?"): "mostly" in
every one. From round 3 on, each reader answered what it is, what needs you and what to look at first correctly, and
each "biggest fix" named the one-line summary or a saved run: the two things the files do not have.

## More than the video: diagrams, worked examples, depth (D-265)

The owner, after the clarity rewrite (2026-09-30):

> "remember the guide should not just restate the video but make more sense, do more concrete, more in depth, more
> examples more full and thorough. and big thing we are missing is more diagrams and using the html to its fullest extent"

So each step of a guide now carries what the video cannot: **how it works, drawn**; **worked examples**, each case with
its input, what happens, what it really printed (a saved run in `runs/`) and its edge cases; and **the depth** (why it
works this way, what else was considered, what breaks it, its limits, the files and commands). All of it is written by
the author, never by the builder, so nothing on the page is made up:

- **The diagram format** (`scripts/lib/guide/diagram.mjs`): a fenced ` ```diagram ` block, `flow:`, `sequence:`,
  `state:` or `compare:` (before/after), one line an edge (`a -> b: a few words | a sentence`, `-->` sometimes, `-x`
  refused), a node's kind in brackets, `id = Label | #section` or a file path for where a click goes. It is drawn when
  the page is built, as inline SVG with no library at run time: a layered layout (ranks by longest path, crossings cut
  by ordering, a point per rank for a long edge, labels on a chip of paper, moved along their edge until clear), a
  sequence of lifelines, or, on a phone, a row a message. Two drawings each, wide and for a phone. Labels are real
  `<text>` in the page's inks (light and dark), so they can be highlighted for a note; each node has an accessible name,
  and a node with a link is a keyboard link to its section or its file's diff. "Step through it" lights one stage at a
  time and says it in words; "In words" is the text alternative.
- **Made from structure**, not written: which step needs which (from "*Needs step …*"), each part of the change's files
  and which imports which (only where that is three files and two imports), how the parts of the change use each other,
  and where the video stops for you, on its timeline, with a legend.
- **Where it is written**: in a new plan's steps (the skill asks for a diagram per step and worked examples per case;
  `reel check` warns, never fails, on a step with no diagram); and for a walkthrough already reviewed, in a
  `## For the guide` section at its end, `### For step N — …` a step, opened by one italic line saying it was written
  after the build. The four walkthroughs on the review page have one each, grounded in their code, and 37 runs were
  saved for them (most in scratch repos set up as each plan's own spec sets its up; each run's `$` line says where).

Tested with fresh readers, three rounds: a newcomer (`claude -p`, Read only, from its own folder) given the page as
shown, every fold opened, screenshots and the video's narration, asked the reader's questions plus what it learned that
the video would not show, which diagram helped, what is only restated and what is invented; and a designer given light,
dark and phone screenshots and each diagram close up. Prompts: `guide-clarity/depth-prompt-newcomer.txt` and
`depth-prompt-designer.txt`; answers in `guide-clarity/depth-round-<n>/`.

| Round | What the readers said | What changed |
|---|---|---|
| 1 (4 newcomers, 2 designers) | Every newcomer named concrete things the video does not show (the 300-line rule's exclusions, the late-fix rule and its five plans, `scenesSaying`, files pinned by path and hash only); nothing invented. The designers: edge labels on their own curves, text about 10 px, trivial diagrams (a before/after of one arrow, two-file import graphs), a fan of edges drawn left to right, "Step through it" read as a caption, a step as a stack of nine folds; one diagram cut off on a phone; the one-sentence line lowercase | Labels placed by the target in a fan, moved along their edge until clear of nodes and other labels; a fan drawn top to bottom; parallel edges one line; text 15/13.5 px; diagrams centred; nodes named only in a definition dropped; import graphs only where they say something, inside See the code; a real "▶ Step through it" button; a legend on the timeline; the step's "why" in the flow and everything else in one "More on this step"; the one-sentence line capitalised. Content: two trivial compare diagrams became sentences, two sequences cut to five lifelines, explain-first's one sentence says only what is checked, a claim about the video's length made exact (2:55) |
| 2 (4 newcomers, 2 designers) | Diagrams mostly readable; still lines through labels; the steps diagram and the change map "decoration"; worked examples "the best-designed control"; a real output behind a click where nothing was to be predicted; contributing's open point (who `owner` is) contradicted by code since | Every edge label on a chip of paper, 14 px; the steps and the change map a click away; Step through and In words on one line; an example with nothing to predict shows what it printed at once; contributing says up front that the open point was answered in code; explain-first says why the video's numbers differ from its runs; two diagrams redrawn as one connected flow |
| 3 (2 newcomers, 1 designer) | The newcomers again list what they learned beyond the video, find nothing invented, and pick the paired runs (a key found, then masked; the clash, then renumber) as the most useful. The designer: the tabs and outputs work; remaining crossings in contributing's "over the line" and CI diagrams; a fan's labels wider than their targets | Those diagrams redrawn (one source, three routes in one label; the jobs without crossings; the two review diagrams made one); a fan's target takes the width of its label |

**What is left**, from the readers, outside what this pass owns: the video stills in each step are mostly empty at column
width (the pictures' work), the "In short" box repeats the sections, the A/D/m ids and a few system words still need
their meaning where they first appear, and the readers want a runnable scratch setup for the examples (the runs name the
spec that sets it up, not a script to copy).
