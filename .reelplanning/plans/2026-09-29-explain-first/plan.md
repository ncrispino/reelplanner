# Explain first: a video of what is going on, before any plan

## The problem

The owner:

> "i do think we have various stages where we want to just know whats going on in the repo, or transcripts
> that result, etc, instead of a video always based on a plan, like i might just ask for a video for
> explaining first then we can decide if we want a plan too"

### What we have

Every video hangs off a plan, or off the whole system:

- **The plan video** is made before the code, from `plan.md`, and asks the plan's questions.
- **The walkthrough video** is made after the code, from `walkthrough.md`, and asks you to accept or flag
  the choices the agent made alone.
- **The system video** explains the whole repo from `spec.md`, `system.json` and `glossary.md`
  (`.reelplanning/system-video/`, 5–8 minutes), kept current after every accepted walkthrough (D-003).

So a question like "what does the review server do?", "what happened in this session?", "what does this
branch change?" or "what changed since Monday?" has no video. Today the agent answers it in chat, in text,
or it becomes a plan before anyone has seen what is there. The pieces a video of it would need already exist:

- `reelplanning build` turns any `STORYBOARD.md` and `SCRIPT.md` into a video, checks it (the terms, the
  frames, the details) and says its length; fresh eyes look at it before you do (D-227).
- The review page plays any built video, with marks, comments and Ask about this (D-226). Its library lists
  the system video and each plan's two videos, one row a plan (D-224).
- `reel record` files a review under a plan's `reviews/`, and adds what you watched and looked up to your
  memory, `~/.reelplanning/you.jsonl` (D-106, D-218).
- The skill already makes a one-off video under `videos/<slug>/` when someone declines to set up
  `.reelplanning/`, but nothing lists it, reviews it or leads anywhere from it.
- The plan guide (approved, not built: D-228, D-229, D-230) puts the whole of a plan behind its video: the
  full diff and the real outputs, a click away from the moment that shows them.

### Real sizes, today

- **A part of the repo:** the review server is six files, 951 lines (`scripts/review.mjs` and five more), with
  five decisions in force on it.
- **A transcript:** the Claude Code session that has been building this repo since 2026-09-22 (the one this
  plan was written in): 21,562 lines, 101 MB of JSONL.
- **A change:** videos-that-make-sense's five build commits (`4dc6bfc` to `cc0dde0`): 33 files, 1,433 lines
  added and 50 removed outside the plan folders.
- **A period:** since Monday (2026-09-28): 30 commits, 19 decisions logged, three plans moved.

## What changes

Three changes, in five steps.

1. **You can ask for an explainer** (steps 1 and 2): a video of whatever you want to understand, not of a
   plan: a part of the repo, files changed in a session or outside one, a new experiment's output, a
   transcript, a log, a period. You say what; the agent pins the sources that hold it and follows a few
   principles for what goes in the video and in its guide, the same for any of them (D-250). It lives in
   `.reelplanning/explainers/<date>-<slug>/` and has a row of its own on the review page.
2. **You review it, and a plan can follow** (steps 3 and 4): the same player; Finish ends it with Done,
   Explain more or **Plan this**, and Plan this starts a plan from what you said, whose video leans on the
   explainer instead of explaining it again.
3. **It is honest and private** (step 5): every fact from a source it names, quoted lines checked word for
   word, fresh eyes as for every video, and a transcript never copied into the repo.

## Steps

### Step 1 — What an explainer is for, and what it shows (question 1)

*Independent.*

**An explainer is a video of something that is already there**, made so you understand it before you decide
anything. You say what you want explained, in your own words. It asks no plan questions and changes nothing.

**What it can be of is open** (D-250, your answer to question 1). Files changed in an agent session or
outside one, a new experiment's output, a part of the repo, a transcript, a CI log, what happened since
Monday, or something nobody has asked for yet. So this plan does not list kinds of explainer. It gives the
principles the agent applies to whatever you name: where the facts come from, what goes in the video, and what
goes in the guide behind it. A new kind of thing needs no new code, only these principles.

**Where the facts come from.** The agent finds the sources that hold the answer and pins each one in
`sources.json` (step 2): a file at a commit, a folder, a range of commits, a log or a transcript by its path
and hash, a decision by its id. The video says only what they say (step 5). A source is described by its
**shape**, never by a kind of explainer:

- a **sequence**: entries in time order (a transcript, a log, commits);
- **files**: a set of files, or the changes to them;
- a **table**: rows and columns (an experiment's results);
- **text**: anything else (a config, a note, a decision).

**What goes in the video.** Six principles, the same for everything:

1. **Your question first.** The first scene says what you asked, in your words. Each scene after helps
   answer it, and nothing else goes in.
2. **The shape before the detail.** What it is and what it is for; then its parts or its order, as a map
   (each file, run or turn one plain line); then the one or two places that carry the idea.
3. **The real thing** (D-166). The actual lines, output or rows, quoted word for word from a pinned source.
   Where the real thing is hard to read (21,562 lines of transcript, a table of 400 numbers), a picture
   that explains it, beside the lines it came from.
4. **What moved.** The turning points: an error, a change of course, a result that differs from what was
   expected, a choice somebody made.
5. **What is settled and what is open.** The decisions in force on it, what is left, and what waits on you.
6. **Short.** 2–4 minutes, in one to three chapters; up to 5 when a source is far longer than a video can
   show.

**What goes in its guide.** The guide is the plan guide's (D-228, D-244, D-246): parts that open from the
video over the paused frame, and a full page of every part in one flow, with a way back to the video. For an
explainer:

- **The guide holds what the video leaves out.** A source the video can show whole (a 40-line file, five
  commits) needs no part. A source far bigger than that (over about 200 lines) gets one. The rule is its size,
  never its kind.
- **One part per thing the video marks.** The scene that shows a source marks it (`data-detail`), and a click
  opens its part at that place (D-246).
- **A part is its source, organized by its shape, never retyped** (D-244: one source, the page a way to read
  it). A sequence: one line an entry, the long ones folded, errors marked, each video moment opening its
  entries. Files: a map, each file whole with its changed lines marked. A table: the table, its columns
  sortable. Text: the text, the quoted lines marked.
- **Until the plan guide's builder exists** (D-228 is approved, not built), a part is a detail made from the
  same templates as any other (D-024, D-194), and `sources.json` says which sources need one.

**Not the system video.** An explainer is made when you ask, and is as narrow as your question; the system
video stays the one kept current (D-003). "What's going on in this repo", asked where the system video is
current, opens the system video.

**Not the walkthrough.** An explainer of a change has no plan to compare with, so it has no choices to accept
or flag. A pull request that needs a walkthrough still gets its plan folder (D-200).

#### Examples: the principles applied

These are examples, not a list to choose from. Each row is the same six principles and the same guide rule,
applied to a different thing.

| You ask | The sources, by shape | The video | The guide |
|---|---|---|---|
| "explain the review server" | files: its six (951 lines); text: five decisions | about 3 min: what it is for, one review from Send to the inbox, what is decided | a part for `scripts/review.mjs` (376 lines); the rest are shown whole |
| "what happened in this session" | a sequence: its JSONL (21,562 lines) | up to 5 min: what was asked, the turning points in their own lines, what is left | the transcript by turn, tool calls folded, errors marked |
| "explain the files I changed by hand" | files: the working tree against `HEAD` | about 2 min: the map, then the one place that carries it | none, when the change is short |
| "what did last night's experiment show" | a table: its results; text: its config | about 2 min: what ran, the numbers that moved, one row in full | the results table, sortable |
| "what changed since Monday" | a sequence: 30 commits; text: 19 decisions | about 3 min: the plans that moved, what shipped, what waits on you | the commits, by day |

#### Interface

```
explain.md      # what you asked, in your words; what it will cover and leave out
sources.json    # each source pinned, with its shape, its size and whether it needs a guide part
STORYBOARD.md   # kind: explainer (front matter); no decision beats; - source: on each scene (step 5)
```

#### Example

You ask "what did last night's experiment show?" and point at its output folder. The agent pins
`results.csv` (a table, 412 rows) and `config.yaml` (text, 30 lines). The video: what ran (the config's
three lines that matter), the two numbers that moved (in their own rows), and what is left to try. The CSV
is far longer than a video can show, so it gets a guide part, opened from the scene with the two rows; the
config is shown whole, so it gets none. Nothing in this was about experiments: the same principles made it.

### Step 2 — Ask for one: the skill, a command, and a folder of its own

*Needs step 1.*

**You ask in your own words.** The skill's triggers gain "explain …", "what's going on in …", "what happened
in …", "walk me through this branch" and "what changed since …". The agent finds the sources, runs the
command, builds the video as it builds any other (`reelplanning build`, fresh eyes, the page), and opens it.
No plan is written.

**The command** pins the sources, so the video can only say what they say. It takes your question and the
sources, and nothing that names a kind of explainer:

```
reelplanning explain "<what you asked>" <source> … [--slug <slug>]
```

A source is anything that holds the answer, pinned by its form: a path (a file or a folder, in the repo or
outside it), a commit, a branch or a range (`main..HEAD`), `worktree` (what is changed and not committed),
`since:<date>`, `pr:<n>`, `ci:<run-id>`, `this-session` (Claude Code's transcript of this repo's newest
session), or a decision (`D-233`). The form decides how it is pinned (a hash, a commit, a line count); what the
explainer is about does not change the command.

It makes `.reelplanning/explainers/<date>-<slug>/` with `explain.md` (your words, what it will cover),
`sources.json` (the commit it starts from; each source's form, shape, size, hash, and whether it needs a guide
part; a file outside the repo by its path, hash and line count, never its text) and the video's start
(`video/`, its brief and storyboard with `kind: explainer`). The agent writes the storyboard from the sources
and builds; `build` holds it to 2–4 minutes (5 when a source needs a guide part), a warning past that, as for
any video.

**An explainer is a snapshot, and is never rebuilt on its own.** It explains the commit it was made at. Say
on Monday you ask about the review server, and by Friday seven commits have changed it. On Friday the page
plays Monday's video, exactly as it was built, and its row says "7 commits since". Nothing rebuilt it: the
video is about Monday's code, and the row tells you how far the repo has moved. To see Friday's code
explained, ask again: a new explainer in a new folder, and Monday's stays.

**On the review page** an explainer is a row of its own kind, **Explainer**, beside the plans' rows: its
title, its length, "explained at `dee5830`, 7 commits since", and what came of it (Done, or "planned: <the
plan>"). The review server serves it as it serves the plans' videos.

#### Cases

| Case | Example | What happens |
|---|---|---|
| Asked in chat | "what changed since Monday?" | the agent runs `reelplanning explain "what changed since Monday?" since:2026-09-28` and builds |
| Asked by command | `reelplanning explain "explain this branch" 4dc6bfc~1..cc0dde0` | the folder and its sources; the agent is asked to write the video |
| Something new | "what did the experiment show?" `runs/0929/` | the folder's files pinned, each with its shape; the same steps as any other |
| Opened after the repo moved | the review server explainer, on Friday | it plays Monday's video as it was built; the row says "7 commits since" |
| Asked again | "explain the review server" on Friday | a new folder, a new date; Monday's stays |

#### Interface

```
reelplanning explain "<what you asked>" <source> … [--slug <slug>]
  ✓ .reelplanning/explainers/2026-09-29-review-server/ · 7 sources (files 6, text 1) · 1 needs a guide part · pinned at dee5830
review page row   Explainer · the review server · 3:10 · explained at dee5830, 7 commits since · Done
```

#### Example

"What changed since Monday?" makes `2026-09-29-what-changed-since-monday/`: 30 commits, 19 decisions, three
plans. The video, three minutes: videos-that-make-sense built and accepted, the plan guide approved, 19
decisions, and what waits on you (the plan guide's question 1, left unanswered).

### Step 3 — Review it: the same player, and Finish says what comes next

*Needs step 2.*

**The same player.** You mark, comment, look words up and Ask about this, as on any video. Ask about this
answers from the explainer's sources, the glossary and the scene ("from `scripts/lib/inbox.mjs`, line 56").

**No plan questions.** An explainer asks nothing to decide: `build` fails a `- decision:` scene in a video
of kind `explainer`. A quick check goes where there is something to predict, asked just before the scene
that shows it, as in a walkthrough (D-222): "you press Send twice on the same review: how many runs
start?", then the run shows it. Many explainers have none.

**Finish** has three ends instead of Approve and Request changes:

- **Done**: you know what you wanted to know.
- **Explain more**: your comments and questions come back as the next version: the scenes they are on
  rebuilt, and a scene for each question, with fresh eyes again.
- **Plan this**: a plan starts from what you said (step 4).

**What each end would mean, for this video** (added after the walkthrough review). Explain more and Plan this are not
fixed lines: Finish offers what each would mean for the video just watched ("go deeper on how the inbox dedupes, the
part you rewound", "explain the 3 commits since", "a plan to make the sweeper run on a timer"). They are drawn from the
explainer's own content, its scenes, its sources and the open threads `explain.md` names, at build time into its plan
map, so a hosted page has them with no server; at Finish the page refines them with what you did: your marks,
comments and rewinds, the words you looked up, the questions you asked. You pick one, edit it, or write your own. What
you pick is filed with the review, and `new-plan --from` and an Explain more rebuild start from it.

**What a review of it produces.** `reel record <explainer-dir>` files it, as every review, under the
explainer's `reviews/`, with a `.md` of your comments by scene and your questions, answered or not. Your
memory gets what you watched and looked up (D-218: a word you know stops being underlined).

**Nothing goes into the decision log, whatever you press.** The decision log holds only answers to questions a
plan asked. An explainer asks none, so a review of it has nothing to put there: a comment is not an answer.
Say you comment "this looks wrong" on a branch's explainer and press Done. The comment is filed with the review,
in `reviews/explainer-<time>.md`, and the decision log does not change. A comment reaches a decision only by way
of a plan: press Plan this, and it is quoted in the plan's problem (step 4), and that plan's review decides.

#### Cases

| Case | Example | What happens |
|---|---|---|
| Done, with comments | "this looks wrong" on a branch's scene 3 | filed with the review; memory updated; nothing in the decision log |
| Explain more | "why does Send twice start one run?" asked on scene 4 | the next version: scene 4 rebuilt, a scene answering it |
| Plan this | "make a waiting review easy to see" in your own words | filed; step 4 |
| A quick check | "Send pressed twice: how many runs start?" | answered, then the scene runs it; memory counts it |

#### Interface

```
Finish            Done · Explain more · Plan this        (in place of Approve · Request changes)
reviews/explainer-<time>.json   { kind: "explainer", end: "done" | "more" | "plan", next: { end, pick, words, edited }, comments, questions, ... }
reviews/explainer-<time>.md     ## Comments by scene · ## Questions you asked · ## What you want next
```

#### Example

You watch the review server explainer, ask "why does a second Send not start a second run?" on scene 4, and
press Done. The page answered it from `scripts/lib/inbox.mjs`; the review is filed with the question and its
answer; the decision log does not change.

### Step 4 — Plan this: a plan that starts from the explainer (question 2)

*Needs step 3.*

**Plan this** files the review, then the agent writes a plan, as it would when asked in chat, with the
explainer as its start:

- `reel new-plan … --from <explainer-dir>` makes the plan folder, and `plan.md` opens with a line naming the
  explainer, "Explained first: `2026-09-29-review-server`".
- **The problem** quotes you: your comments by scene, the questions you asked, and what you wrote under "What
  you want next". The agent writes the steps from there and the check runs as for any plan (`reel check`).
- **The plan video leans on the explainer** (D-248, question 2's answer). `reel prereqs` puts it first under
  Before you watch, with a `recap:` line: the recap scene for new viewers says it in two lines, and the video
  starts at what changes. It never explains again what the explainer showed.

A plan started this way is an ordinary plan from then on: its review, its decisions, its walkthrough. The
explainer's row says "planned: <the plan>", and the plan's row links back to it.

#### Cases

| Case | Example | What happens |
|---|---|---|
| Plan this with comments | two comments on scene 4 | both quoted in the plan's problem, with their scene |
| Plan this with a question | "why does Send twice start one run?" answered on the page | the question and its answer quoted |
| A plan video after it | the waiting-reviews plan | Before you watch lists the explainer first |
| Plan this twice | a second plan from the same explainer | a second plan folder; the row lists both |

#### Interface

```
reel new-plan <repo> <slug> --from <explainer-dir>
plan.md         Explained first: `2026-09-29-review-server` (its review: reviews/explainer-<time>.md)
STORYBOARD.md   before: explainer:2026-09-29-review-server | what the review server does, and your two comments
```

#### Example

You press Plan this on the review server explainer, with "make a waiting review easy to see" on scene 4. The
plan `2026-09-30-waiting-reviews` opens with that comment in its problem; its video starts on what changes, and its
Before you watch lists the explainer (3:10) first.

### Step 5 — Honest and private: facts from their sources, a transcript kept out of git (question 3)

*Needs steps 1 and 2.*

**Facts from the sources, and only them.** Each scene that says a fact names where it comes from, `- source:`
(`scripts/review.mjs:200-230`, `transcript:turns 212-240`, `git:4dc6bfc`, `D-233`). A new check in the build,
`check-sources`, fails a quoted line (inside a `data-artifact`) that its source does not hold word for word,
and a source that is not pinned in `sources.json`; a scene that states a number with no source is a warning,
a failure under `sources_check: strict` (every new explainer carries it). A repo file is read as it was at the
pinned commit, so a later edit never makes an old explainer fail.

**Fresh eyes, as for every video** (D-227): the newcomer and the designer, and every finding answered before
the page opens. An explainer that sums up more than it quotes (one with a source that needs a guide part, step
1) also gets a **fact check**: a third fresh agent reads the narration against the sources, never the agent's
own account, and lists each sentence they do not support. It is the code check's reason (D-001): the agent
that did the work is the worst judge of its story.

**Private.** A file outside the repo (a transcript, a log, an experiment's output) is read where it is and
never copied into the repo; `sources.json` keeps its path, hash and line count (D-249: its text goes into git,
never the transcript). A path in your home is shown as `~/…`.

**A secret stops the build until it is masked; it is never blurred.** The storyboard, script and frames are
the explainer's text, and its text is committed (D-249). A key blurred on screen would still sit in that text,
in the repo's history for good. So a quoted line that looks like a secret (a key such as `sk-…` or `ghp_…`, a
private key, a `password=`) or holds an email address stops the build, naming the scene and the line, and the
build goes on only once the text itself is cut or masked (`ghp_…REDACTED`). Say a CI log's explainer quotes a
line holding a GitHub access key: the build stops there, and nothing is blurred. `.gitignore` keeps an
explainer's voice files and render out, as it does a plan's video's (D-213).

#### Cases

| Case | Example | What happens |
|---|---|---|
| A quoted line its source holds | `export function claim(rp, id, by, extra = {})` from `scripts/lib/inbox.mjs` | passes |
| A quoted line changed by hand | the line retyped with a word missing | `check-sources` fails: not in its source |
| A number with no source | "the server retried three times" | a warning; fails under strict |
| A key in a quoted line | a GitHub access key in a CI log's line | the build stops until the text is masked; nothing is blurred |
| A sentence the sources do not say | "the run was slow because of the network" | the fact check lists it; it is fixed, or kept with a reason |

#### Interface

```
STORYBOARD.md    - source: scripts/lib/inbox.mjs:50-80            (each scene that says a fact)
                 sources_check: strict                             (front matter)
reelplanning check-sources <video-dir>                             (run by build)
  ✗ scene 5 · quoted line not in scripts/lib/inbox.mjs: "claim(rp, id)"
  ✗ scene 7 · a key in a quoted line (transcript:turn 212): mask it
  △ scene 3 · "three times" with no source
reelplanning fresh-eyes <video-dir> --prompt checker               (transcripts and changes)
```

#### Example

The session explainer quotes turn 212, where a command printed an API key. The build stops on it; the agent
masks it (`sk-…REDACTED`) and builds again. The fact check finds "the tests passed first time" in scene 6; the
transcript shows two runs, so the line becomes "the tests passed on the second run".

## Components touched

- **The plan-to-video skill** — the explainer's triggers and section, its storyboard (`kind: explainer`,
  `- source:`), the fact check among fresh eyes (steps 1, 2, 5)
- **The reel CLI** — `reelplanning explain`, `reel record` for an explainer, `reel new-plan --from` (steps 2,
  3, 4)
- **The review player** — Finish's three ends; Ask about this from the sources (step 3)
- **The review server** — the Explainer row in the library (step 2)
- **finish-project** — `check-sources` (step 5)

An explainer is a new part: the implement step adds it to `system.json` and `glossary.md` when it is built.

## Open questions for the reviewer

1. **Is an explainer's whole source there to read, behind the video?** (step 1)
Say you asked "what happened in this session?" (21,562 lines) and "explain this branch" (33 files).
- **A · No guide.** Each is its video, with a detail where one scene needs more. Costs nothing new; the
  transcript is only the lines its scenes quote, and the branch only its map and two places.
- **B · A guide for a transcript and a change.** The session's guide is the whole transcript, organized: a
  line a turn, tool calls folded, errors marked, each video moment opening its turns. The branch's is its full
  diff in categories, as the plan guide's Built side. A part and a period stay a video. Costs: the plan
  guide's builder first (D-228, not built), and two new sections for it.
- **C · A guide for every kind.** B, and a part's guide has its files whole, a period's its commits and
  decisions. Costs: B's, and two more sections that repeat what `git log` and the files already show.
I recommend B: the two kinds with far more than a video can hold.
**Answered in your own words (D-250):** none of these, since an explainer is not of a fixed set of kinds. Step
1 now gives general principles for what goes in the video and what goes in its guide, and the guide rule is a
source's size, never its kind: any source far bigger than the video can show gets a part.

2. **After Plan this, how far does the plan lean on the explainer?** (step 4)
Say you watched the review server explainer and pressed Plan this.
- **A · Lean on it.** The plan video's Before you watch lists the explainer, and one recap scene for new
  viewers says it in two lines; the video starts at what changes. Costs: a teammate who skips the explainer
  gets two lines.
- **B · A recap chapter.** The explainer's key scenes, cut down to about 40 seconds, open the plan video.
  Costs: 40 seconds more, of what you just watched.
- **C · Stand alone.** The plan video explains the server again from scratch, as today. Costs: about a
  minute said twice.
I recommend A: you just watched it, and the link is one click for anyone who did not.
**Decided: A · Lean on it (D-248).**

3. **What of an explainer goes into git?** (step 5)
Say the session explainer quotes 12 lines of a 21,562-line transcript.
- **A · Its text, never the transcript.** `explain.md`, `sources.json` (paths and hashes), the storyboard,
  script and frames (so the 12 lines, checked for secrets) and the reviews, as a plan's video is kept. Costs:
  those 12 lines are in the repo's history.
- **B · That, and the whole transcript.** The transcript, organized, committed beside it, so a teammate can
  read the whole session. Costs: everything said in the session is in the history for good.
- **C · Nothing, until you keep it or plan it.** The folder is left out of git; Keep, or Plan this, commits it.
  Costs: an explainer you pressed Done on lives on one machine.
I recommend A: the explainer is shared like a plan's video, and the transcript stays yours.
**Decided: A · Its text, never the transcript (D-249).**

## Decisions in force

- **D-003** The system video is kept current after every accepted walkthrough: kept; an explainer never
  replaces it, and never makes it behind. (step 1)
- **D-065** A review of the system video changes the video or the system: kept; an explainer's review is its
  own kind. (step 3)
- **D-166** The brief picks which scenes show the real thing: kept for explainers. (step 1)
- **D-197** A quick check comes later, on a new case: kept for plan and system videos; an explainer asks one as
  a walkthrough does. (step 3)
- **D-222** A walkthrough asks a check where there is something to predict: an explainer follows it. (step 3)
- **D-200** A pull request over the line gets a plan folder and its walkthrough: kept; a change explainer is
  not that walkthrough. (step 1)
- **D-213**, **D-215** A built video is not committed in a shared repo: kept; an explainer commits its text as a
  plan's video does (D-249). (step 5)
- **D-224** One row a plan, with a Plan | Built switch: kept; an explainer is a row of its own kind. (step 2)
- **D-225**, **D-226**, **D-227** Fresh eyes on every new video, every finding answered, meanings and Ask about
  this: kept; an explainer gets them, and a fact check for a transcript or a change. (steps 3, 5)
- **D-228**, **D-229**, **D-230** The plan guide on its own page, suggested edits, every plan with a Built side:
  kept; an explainer's guide follows step 1's rule, a part for each source far bigger than the video (D-250,
  question 1's answer). (step 1)
- **D-001** A second, fresh agent checks the code: kept; the fact check is the same idea for an explainer.
  (step 5)
- **D-106**, **D-218** Your memory across repos, and a word you know stops being underlined: kept; an
  explainer's review adds to it. (step 3)
- **D-127** Plain words on screen: kept. (all steps)
- **D-129** Approving is never blocked: kept; Done, Explain more and Plan this are never blocked either.
  (step 3)
- **D-064** The main session hands long jobs to workers: an explainer's build is one. (step 2)
- **D-219**, **D-221**, **D-223** The walkthrough shows the change running; a listed choice is listed, not
  judged; a small pull request's choice needs no video: kept; a change explainer is none of these. (step 1)
- **D-220** No fixed count of pauses: a choice pauses the walkthrough when you'd notice it (the walkthrough's
  pauses, step 2 of walkthroughs-that-help): kept; an explainer makes no choices, so it never pauses for one.
  (step 3)
- **D-024**, **D-194**, **D-195**, **D-196** Detail pages from templates, opened over the frame from the thing
  they explain: kept; an explainer's detail is made the same way. (step 1)
- **D-198**, **D-199** The warnings on a quick check asked too soon or on the case just shown, and which
  videos take the new checks: kept; an explainer's check is placed as a walkthrough's. (step 3)
- **D-216**, **D-217** The build finds the jargon, and fails a strict storyboard on a word with no meaning:
  kept for explainers. (all steps)
- **D-142**, **D-167** Today's look and the darker coral: the Explainer row uses them. (step 2)
- **D-082** A run nobody watches runs in auto mode inside the sandbox: kept; Plan this and Explain more,
  handed to the headless run, run that way. (steps 3, 4)
- **D-244** A plan's guide is built from `plan.md`: kept; an explainer's guide is built from its pinned sources,
  the same way (one source, the page a way to read it). (step 1)
- **D-246** A click on a marked thing opens its part of the guide, a question up or not: kept; an explainer's
  guide parts open the same way. (step 1)
- **D-245** Before you watch shows only the kept findings new to the build: kept for explainers. (step 5)
- **D-247** The case study keeps each site as plain files and a site.bundle: not touched. (all steps)
- **D-005**, **D-066**, **D-085**, **D-107**, **D-109**, **D-110**, **D-169**, **D-170**, **D-171**, **D-201**,
  **D-202** Rewinds, other agents, less scaffolding, retros, late fixes, the fifth choice, the case study,
  decision numbers and a contributor's plan: not touched. (all steps)

## Not in this plan

A guide for the system video. Explainers that update themselves when the repo moves (each is a snapshot; ask
again). Explaining a repo that has no `.reelplanning/` (the skill's one-off video under `videos/` stays as it
is). Other agents' transcript formats beyond Claude Code's JSONL and a plain text log.
