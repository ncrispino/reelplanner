# Code check brief: 2026-09-22-close-the-lifecycle

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-22-close-the-lifecycle/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-22-close-the-lifecycle

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (094dfdd^..HEAD, limited to scripts/walkthrough-scope.mjs scripts/spec-diff.mjs scripts/code-check.mjs scripts/reel.mjs scripts/resolve-walkthrough.mjs scripts/revise-scope.mjs scripts/frame-lint.mjs skills/plan-to-video/SKILL.md .reelplanning/spec.md .reelplanning/system.json .reelplanning/glossary.md .reelplanning/system-video/STORYBOARD.md scripts/test/lifecycle.spec.mjs)

```
4494076 The system video: this repo's first, built from spec.md, system.json and the glossary
42b5395 Deep dives, second review: types first (D-024); a detail must hold what the video cannot
6e3f62c Deep dives: video revised after review; lint leaves file mocks alone
242536b First code check, on richer review: four real gaps found and fixed
2bf60a8 Close the lifecycle: the second agent's code check, the fix step, system video build steps
2e8567b "Explain this more": the scripts never record it as a decision
6efd644 Walkthrough review: 15 calls accepted, A10 changed; Escape keeps a mark's words
26dfe58 Narrate one line at a time: whisper runs no longer fight over the cores
30aa9c2 Run every script from the npm cache, with the user's repo as cwd
84dc7d8 Richer review, script side: options a–d, pick-all, notes on answers, watch signals, density
a8152d3 Merge #1: pin HyperFrames' skills, stop finish-project before a skill that cannot load
74b2b80 Build the richer-review plan video
7209b6b Revise close-the-lifecycle from its review; plan the review's own asks
799a7e7 Pin HyperFrames' skills, and stop finish-project before a skill that cannot load
dd8b547 A mute button, and one page for every video in a repo
c867184 Build the close-the-lifecycle plan video
eaad68f Build the parts of close-the-lifecycle that don't hang on its questions
094dfdd README review pass, and walkthrough-scope for a reviewed walkthrough
```

## The plan, as approved

# Close the lifecycle: implement to the plan, walk it through, keep one system video current

## The problem

reelplanning covers the first half of the workflow. An agent's plan becomes a video; the reviewer
watches it, marks it, comments and decides; `reel record` writes the calls to the ledger and
`plan.resolved.md`; the revise step rewrites the plan and the beats a comment landed on
(`2026-09-22-m3-revise-loop`). That loop has been run for real on this repo's own review page.

The second half does not exist yet:

- **Nothing holds the implementation to the plan.** An agent that implements `plan.resolved.md` is
  on its own. Nothing checks that the code follows the decisions and tenets the reviewer approved,
  and nothing records the calls the agent made that the plan never covered.
- **The walkthrough has only ever been built from a made-up report.** `w1-upload-resume` is a
  complete walkthrough video, and stage 5 (`resolve-walkthrough`) reads its review back. But its
  `walkthrough.md` was written by hand to show the format; no agent has written one from a real diff.
- **A flagged call goes nowhere.** `walkthrough.resolved.md` lists what the reviewer rejected, and
  no step reads it. The reviewer can say "not like that" and the code stays as it is.
- **There is no system video.** Someone new to a repo has `spec.md` to read, and nothing to watch.
  Nothing updates `spec.md` when a plan changes the system, either; the style guide asks for it and
  no step does it.

## Steps

### Step 1 — Build the system video

A new mode for the plan-to-video skill, `--system`, builds one video from `spec.md`, `system.json`
and `glossary.md`: what the repo is for, its parts on the shared stage, each pipeline in order, and
the invariants. It has no decision beats; nothing is being approved. It is written for a viewer who
knows nothing about the repo. Every frame is tagged with the spec section and components it
explains (`- spec_section:`, `- components:`), so a later change can find the frames it affects.
It lives at `.reelplanning/system-video/` and is linked from the README. The first one is this repo's own.

When it is first built depends on the repo. In an existing repo it is built alongside the first
plan: the first time someone asks for a plan, the agent maps the code, then builds the system video
and the plan video at the same time, so the plan is not held up. The person corrects the map while
reviewing the plan, and a correction rebuilds the plan video's affected scenes. In a new repo there
is nothing to explain yet, so the first plan names the parts, and the system video is built once
that plan's walkthrough is accepted.

### Step 2 — Implement to the plan, and log calls as they are made

An implement section in the skill. The agent implements from `plan.resolved.md` with the
decisions in force as constraints, not suggestions. Whenever it makes a call the plan did not
cover (a default, an error code, a library, deleting instead of flagging), it appends a row to the
autonomy log in `walkthrough.md` at that moment, with what it chose, what else it could have done,
why, and where to look. Writing each call down when it happens means none are forgotten by the
time the report is written.

### Step 3 — Check the diff against the plan before the walkthrough

Before any video is built, a second agent reads the branch diff alongside `plan.resolved.md` and the
ledger, and answers three questions. Does every plan step have a change that carries it out? Does every
decision in force hold in the code? Is there anything in the diff that the autonomy log does not
explain? Its findings go into `walkthrough.md` as deviations or new autonomy rows; they are never
fixed quietly. A deterministic floor runs first: `reel audit <plan-dir>` fails when a plan step
has no entry in `walkthrough.md`, or when a decision in force has no file named against it.

### Step 4 — Walk through the real implementation

The walkthrough video is built from the `walkthrough.md` Steps 2–3 produced, with the existing
`--walkthrough` mode, on the same stage as the plan video. Every autonomy row becomes an Accept /
Flag beat; every deviation is said plainly. This is the first walkthrough built from code an agent
actually wrote.

### Step 5 — Act on the walkthrough review

Once a walkthrough is reviewed, `reel record` already writes `walkthrough.resolved.md`. A new
`walkthrough-scope` reads it the way `revise-scope` reads a plan review. An accepted call becomes a
ledger entry, so the next plan cannot quietly undo it. A flagged call, with the reviewer's comment,
becomes a fix: the agent rewrites that code to match, updates the matching autonomy row, and rebuilds
only that beat of the walkthrough video. `plan-diff` then offers the reviewer just the changed
beats to rewatch.

### Step 6 — Keep the system video current

When a walkthrough is accepted, the agent updates `spec.md`, `system.json` and `glossary.md` for
what landed. `spec-diff` names the sections and components that changed; the system video
rebuilds only the frames tagged with them, keeping their frame ids, and `plan-diff` flags them.
`reel status` warns when `spec.md` is newer than the system video. The video anyone watches first
never describes a system that no longer exists.

## Components touched

- **The plan-to-video skill** — gains `--system` and an implement section
- **The reel CLI** — gains `audit`; `status` gains the staleness warning
- **The implement step** — new
- **resolve-walkthrough** — unchanged; already writes `walkthrough.resolved.md`
- **The walkthrough fix step** — new
- **plan-diff** — unchanged; flags the rebuilt beats
- **finish-project** — unchanged; rerun after every rebuild
- **The system video** — new
- **The review player** — unchanged; already plays only what changed

## Open questions for the reviewer

1. **Who checks that the code followed the plan?** (step 3)
- **A · A second agent, plus the deterministic floor.** It reads the diff with fresh eyes and
  catches what the implementer rationalised. Costs one more agent run per implementation.
- **B · The implementing agent reports on itself, plus the floor.** Cheaper and faster. Costs the
  one thing this step exists for: an agent rarely flags its own drift.
I recommend A: the walkthrough is only as honest as the report it is built from.

2. **What happens to a flagged call?** (step 5)
- **A · The agent fixes the code and rebuilds that beat.** The loop stays tight; the reviewer's
  comment is the instruction. Costs a larger change going through with no plan video of its own.
- **B · The flag becomes a new plan, reviewed as a video first.** Every change is planned before it
  is made. Costs a full plan cycle for what is often a one-line fix.
I recommend A, with the fix step escalating to B when the comment would supersede a decision in
the ledger.

3. **When does the system video update?** (step 6)
- **A · Automatically, after every accepted walkthrough.** It is never stale. Costs a partial
  rebuild on every accepted change, including ones that only touch internals.
- **B · On demand, with `reel status` warning when it is stale.** Costs nothing until someone
  asks. The cost is that it drifts until someone does.
I recommend A: a system video that drifts is worse than none, because new people trust it.

## Not in this plan

What the M3 plan (`2026-09-22-m3-revise-loop`) still owns: the push-triggered workflow running in a real
Actions runner, and regenerating narration for only the changed frames. Multi-reviewer review.
Restructuring a plan's steps from a walkthrough review.

## Decisions (from the video review)

- **Q1** (step 3): **Second agent** (the recommended option)
- **Q2** (step 5): **Fix and rebuild** (the recommended option)
- **Q3** (step 6): **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?** (overrides the recommendation)

## Review annotations

### step 1
- note at 4.7s (Approved, and then nothing): is it always three ? or can be more than three questions? that seems somewhat arbitrary. i know we dont wanna overload but still can do more maybe, if it is desired?
### step 3
- note at 111.57s (If a second agent checks): is it just subagent tho? or separate agent?
### step 13
- note at 132.87s (Next: part 3): i guess i wonder too what granularity is in the agent autonomy log
### step 5
- note at 173.63s (Choice 2: what happens to a flag?): also i notice you are only giving binary questions, sometimes there can be as many as 4 options. and there should be many type of question, like can be select all that apply not just choose one, again, depending on what we need.

also wondering if using video opens us up to any other type of requested feedback? something beyond just clicking one of these, something that text or basic html site dont apply
### step 6
- note at 228.14s (Choice 3: when does it update?): i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?
### step 25
- stroke at 246.1s (The plan, resolved)
- note at 246.1s (The plan, resolved): do you see this part i circled? the pipeline too complex dont you see kinda hard for me to understand it? this is a general comment for all the videos, like this stuff wont be too helpful if we are really not having the user understand it.

also, a separate thing: when we mark, i want to be able to immeditaly enter text to go with that marking, like a text box will open on the video that we can type into and leave comment there.

**Status:** changes requested by the reviewer — revise the steps the comments landed on · watched 1% · exported 2026-09-22T22:03:46.875Z

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-002** (step 5) What happens to a flagged call? → **Fix and rebuild**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 3 | the checker's whole world is one file, `code-check/brief.md` | letting the checker explore the repo and history freely | a fresh context is only fresh if what goes into it is fixed; one file also makes the check repeatable | `scripts/code-check.mjs` |
| A2 | 3 | the brief includes the implementer's autonomy log, but nothing else from the implementer | giving the checker nothing from the implementer | question 3 ("anything the log does not explain?") needs the log; the reasons in the implementer's conversation stay out | `scripts/code-check.mjs` |
| A3 | 3 | a diff over 400k characters is cut, with the command to read the rest | always the full diff | a whole-repo diff can be megabytes; the checker can read any file with git | `scripts/code-check.mjs` `LIMIT` |
| A4 | 3 | `-- <paths>` narrows the diff | the whole range only | a branch often carries unrelated work (richer review's range also held the status page) | `scripts/code-check.mjs` |
| A5 | 3 | findings in a fixed shape, every ✗ keyed by `Step N`, a decision id or a path | free prose | `reel audit` can then check each one is answered | `scripts/code-check.mjs` brief, `scripts/reel.mjs` `audit` |
| A6 | 3 | no findings file is a warning in `reel audit`, not a failure | failing | plans walked through before the check existed must still pass | `scripts/reel.mjs` `audit` |
| A7 | 5 | the fix step is skill instructions, not a script | a script that applies fixes | rewriting code is agent work; `walkthrough-scope` already does the sorting a script can do | `skills/plan-to-video/SKILL.md` step 7 |
| A8 | 5 | a fixed call's row is updated in place ("changed after review: …") | a new row for the fix | one row per call keeps the ledger and the video's beat ids lined up | `.reelplanning/plans/2026-09-22-richer-review/walkthrough.md` A10 |
| A9 | 5 | a note with no step, within 15 s after a flag, is taken to be about that flag | only notes on the flag's step | reviewers flag, then type; the note often lands on no step | `scripts/walkthrough-scope.mjs` `NEAR` |
| A10 | 6 | the system video is "behind" when `spec.md` changed after the video did (git commit times, file times when uncommitted) | a content hash of what the video says | cheap, and the spec is the only source the video is built from | `scripts/reel.mjs` `status` |
| A11 | 3 | a part labelled with a file name fails the lint; any other label that is not its glossary name is only a note | failing every label that differs from the glossary | a mock or a branch may shorten a name on purpose; a file name on a node is never right | `scripts/frame-lint.mjs` rule 4c |
| A12 | 3 | a step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides | leaving those signals in the resolved plan only | the first code check showed the revise never saw them, so "hard to follow" changed nothing | `scripts/revise-scope.mjs` |

## The diff

```
.reelplanning/glossary.md                |   2 +-
 .reelplanning/spec.md                    |  19 +-
 .reelplanning/system-video/STORYBOARD.md | 956 +++++++++++++++++++++++++++++++
 .reelplanning/system.json                |  39 +-
 scripts/code-check.mjs                   | 140 +++++
 scripts/frame-lint.mjs                   |  38 +-
 scripts/reel.mjs                         | 100 +++-
 scripts/resolve-walkthrough.mjs          |  14 +-
 scripts/revise-scope.mjs                 |  32 +-
 scripts/spec-diff.mjs                    |  74 +++
 scripts/test/lifecycle.spec.mjs          |  91 +++
 scripts/walkthrough-scope.mjs            |  73 +++
 skills/plan-to-video/SKILL.md            |  75 ++-
 13 files changed, 1587 insertions(+), 66 deletions(-)
```

```diff
diff --git a/.reelplanning/glossary.md b/.reelplanning/glossary.md
index 199dbcd..3c9e6cc 100644
--- a/.reelplanning/glossary.md
+++ b/.reelplanning/glossary.md
@@ -12,7 +12,7 @@ One name per thing. A plan, a script or a storyboard uses these words and no syn
 | The revise step | `revise` | Reads plan.resolved.md, rewrites the plan and the beats a comment touched | revision, auto-revise |
 | The push-triggered workflow | `action` | GitHub Action that runs the revise step on push | the trigger, the bot |
 | The review player | `player` | `<reelplanning-player>` | the player |
-| The implement step | `implement-step` | Implements `plan.resolved.md` and logs each call the plan did not cover into `walkthrough.md` | implementation |
+| The implement step | `implement-step` | Implements `plan.resolved.md` and logs each call the plan did not cover into `walkthrough.md`; its diff is then checked by a second, fresh agent (the code check) | implementation |
 | resolve-walkthrough | `resolve-walk` | Merges a walkthrough review's Accept/Flag verdicts and quiz answers into `walkthrough.resolved.md` | |
 | The walkthrough fix step | `fix-step` | Reads `walkthrough.resolved.md`, rewrites the code for each flagged call, rebuilds only those beats | |
 | The system video | `system-video` | One video explaining the whole repo from `spec.md`; rebuilt where the spec changes | the main video, the overview video |
diff --git a/.reelplanning/spec.md b/.reelplanning/spec.md
index 4187697..135ac65 100644
--- a/.reelplanning/spec.md
+++ b/.reelplanning/spec.md
@@ -15,11 +15,11 @@ Turns an implementation plan into a short narrated video so an engineer can revi
 - **finish-project** — the deterministic assembly tail (captions, index, transitions, plan-map, plan-diff) that runs after frame content changes.
 - **The revise step** — reads `plan.resolved.md` and rewrites the plan and the beats a comment actually touched. `revise-scope` finds the steps to rewrite and the skill's Revise section does the rewrite; run once by hand, on the review-page plan.
 - **The push-triggered workflow** — a GitHub Action that runs the revise step when a review is pushed. Written (`.github/workflows/reelplanning-revise.yml`), not yet run in a real Actions runner.
-- **The review player** — `<reelplanning-player>`; what a reviewer actually watches, marks and comments in.
-- **The implement step** — implements `plan.resolved.md` with the decisions in force as constraints, and logs every call the plan did not cover into `walkthrough.md` as it makes it. Does not exist yet; the close-the-lifecycle plan in `plans/` builds it.
-- **resolve-walkthrough** — merges a walkthrough review's Accept / Flag verdicts and quiz answers into `walkthrough.resolved.md`.
-- **The walkthrough fix step** — reads `walkthrough.resolved.md`, rewrites the code for each flagged call, and rebuilds only those beats. Does not exist yet.
-- **The system video** — one video explaining the whole repo from this file, rebuilt where this file changes. Does not exist yet.
+- **The review player** — `<reelplanning-player>`; what a reviewer actually watches, marks and comments in. Questions take two to four options or "pick all that apply"; any answer can carry a note; a finished mark takes words; keys jump between parts (N / P) and answer (A–D). It sends where the reviewer rewound or slowed down as "hard to follow" signals.
+- **The implement step** — implements `plan.resolved.md` with the decisions in force as constraints, and logs every call the plan did not cover into `walkthrough.md` as it makes it (the skill's build section). Before any walkthrough video, a second, fresh agent checks the diff against the plan and the ledger from a brief `code-check` writes; `reel audit` fails until every finding is answered in `walkthrough.md`. First run for real on the richer-review plan.
+- **resolve-walkthrough** — merges a walkthrough review's Accept / Flag verdicts and quiz answers into `walkthrough.resolved.md`. A call answered in the reviewer's own words reads as a change to make, not an accept.
+- **The walkthrough fix step** — `walkthrough-scope` lists each flagged or rewritten call with the reviewer's words; the agent rewrites that code, updates the call's row, and rebuilds only its beat. A flag that would overturn a ledger decision becomes a new plan instead. First run on richer review's A10 (Escape keeps a mark's words).
+- **The system video** — one video explaining the whole repo from this file, rebuilt where this file changes (`spec-diff` names the frames). Lives in `.reelplanning/system-video/`.
 
 ## Pipelines
 
@@ -42,11 +42,13 @@ Steps 1–3 and 6–7 exist and are tested. Step 5 exists and has been run by ha
 5. The walkthrough fix step rewrites what was flagged and rebuilds only those beats.
 6. `spec.md` is updated and the system video rebuilds the frames it affects.
 
-Steps 3–4 exist (built and reviewed against a hand-written report, `videos/w1-upload-resume`). Steps 1–2 and 5–6 are what the close-the-lifecycle plan builds.
+All six exist. Steps 1–5 ran for real on the richer-review plan: its walkthrough was built from real code, reviewed, and its one change (A10) fixed. Step 6 is this file's first update, and the system video's first build.
 
 ## Invariants
 
-- **`decisions.md` is append-only.** A revise never edits a past ledger entry; it can only add one (via `reel record`, before revising) or mark one superseded.
+- **`decisions.md` is append-only.** A revise never edits a past ledger entry; it can only add one (via `reel record`, before revising) or mark one superseded, or reopened when the answer asked for the question again.
+- **Only an answer is a decision.** "Explain this more" and a confused own-words reply never enter the ledger as a choice; the question is explained better and asked again.
+- **The code check is never the implementer.** The agent that wrote the code does not check it; the checker starts from the brief alone, and its findings are answered in the walkthrough, never fixed quietly.
 - **A frame keeps its composition id across a revise.** `plan-diff` matches by id first — renaming or recreating a frame turns a real edit into a false add+remove, and the player's "only what changed" promise breaks.
 - **The revise step only touches a step a comment, mark, flag or own-words answer actually landed on.** A plain option pick with no attached text needs no rewrite — the ledger already recorded it.
 - **Plan history lives in git, not in parallel plan.md versions.** A revise edits `plan.md` in place and lands as a commit; `git log` is the record, not `reel new-plan`'s versioning.
@@ -61,4 +63,5 @@ Steps 3–4 exist (built and reviewed against a hand-written report, `videos/w1-
 
 - Scripts live in `scripts/`, one file per pipeline step, invoked from the repo root.
 - `.reelplanning/` templates live in `templates/reelplanning/`; anything scaffolded by `reel init` for a *reviewed* repo belongs there, not hand-added once to this repo's own copy.
-- Tests: `npm test` runs the player's Playwright specs; there is no test harness yet for the CLI/pipeline scripts themselves.
+- Tests: `npm test` runs the pipeline specs (`scripts/test/`: the ledger, record, audit, scopes, review data, versions) and the player's Playwright specs.
+- Scripts run from the npm package (`npx -y reelplanning@<version> <script>`) with the user's repo as the working directory; they never write inside the package.
diff --git a/.reelplanning/system-video/STORYBOARD.md b/.reelplanning/system-video/STORYBOARD.md
new file mode 100644
index 0000000..70a3216
--- /dev/null
+++ b/.reelplanning/system-video/STORYBOARD.md
@@ -0,0 +1,956 @@
+---
+title: "reelplanning: the whole system"
+format: 1920x1080
+duration: 343s
+message: "Review your agent's plans by watching them, not reading them: a text plan gets skimmed and approved; a video has a length and stops at each choice"
+arc: explainer in five parts: why, the parts, the review loop, the build loop, the rules
+audience: someone new to the repo, who knows nothing about reelplanning
+mode: autonomous
+music: none
+kind: system
+plan_dir: .reelplanning
+---
+
+## Video direction
+
+- THE SYSTEM VIDEO (SKILL.md "System video (v8)"): one video explaining the whole repo from `.reelplanning/spec.md`, `system.json` and `glossary.md`, and nothing else. No decision beats; the only questions are one quick check per part.
+- A SERIES OF FIVE PARTS (style guide §16): `chapter_start` on frames 1, 7, 14, 21, 29. Part 1, why a video (spec: Purpose); part 2, the parts, four at a time, then the cast (spec: Parts); part 3, the review loop and part 4, the build loop, one part per pipeline in `system.json`, their steps in order (spec: Pipelines); part 5, the invariants, told as the rules that keep the loops honest (spec: Invariants). 60–75 s each.
+- TAGS FOR spec-diff: every frame carries `- spec_section:` (a `##` heading of spec.md) and, where it shows parts, `- components:` (system.json ids), so a later change names the frames to rebuild. Frame ids never change on a rebuild.
+- THE STAGE (§14, §18): the parts sit at their `system.json` places, drawn with the plan videos' own stage CSS (nodes, edges, chips). The push-triggered workflow has no stage place in system.json; it sits in the free band directly above the revise step (x 1534, y 30), dashed because it has not run for real, with its one edge down into the revise step. The plan-to-video skill has no edge in system.json and is drawn without one.
+- DENSITY (§19): at most six parts on any frame, one per spoken name, each with a plain-words chip the first time. The cast beat (frame 11) is the one frame with every part, and the only one with `data-density="full"`.
+- NO RAIL: a system video has no plan steps. Openers, closers and the ending show the PART LIST (the five parts, the rail's form and place) as the "where am I"; everywhere else it is gone. Pipeline beats are the stage plus one small mock of the real thing (the decision log, the plan's rows, the player's changed-beats offer, the call table, Accept / Flag, the spec page).
+- WORKED EXAMPLES ARE REAL: the deep-dives plan (its steps, its three questions, D-021 "Side panel", its revise touching steps 2, 4 and 6, its git history), and the richer-review build (calls A7, A10, A15; A10 changed after review in the reviewer's own words; the code check's Step 6 finding and its answer). Nothing on screen is invented except the "2 beats changed" count in part 3, which the narration gives as an example ("if two beats changed").
+- NAMES: every label is the glossary's. File names appear only as the files handed on (annotations.json, plan.resolved.md, spec.md, plan.md) and composition ids only on the frame about ids.
+- Palette: paper ground, ink voice, coral as the single signal per frame. Motion: power3 settles, reveal on the spoken word, held read at the end; no blur, no idle drift; the final frame holds still. Nothing below y 900 except captions; quick-check frames keep everything above y 650.
+- Negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms.
+
+
+## Frame 1 — A plan nobody answered
+
+- chapter_start: Why a video
+- scene: PROTOTYPE, no stage: a text plan as a page (the deep-dives plan: its six real step titles, running text as grey bars, and 'Open questions' at the very bottom with its three real questions); on 'approve' an 'Approve' button beside the page presses and the mono chip 'approved' lands; on 'Nobody' a coral chip '0 of 3 answered' lands on the questions
+- voiceover: "An agent hands you its plan: six steps, pages of text, and three questions at the very end. You skim it, and you approve it. Nobody answered the questions."
+- duration: 8.469s
+- transition_in: cut
+- status: animated
+- src: compositions/frames/01-hook.html
+- type: hook
+- persuasion: Concrete failure with stakes
+- beat: Recognition
+- blueprint: compose
+- spec_section: Purpose
+- focal: the three questions nobody answered
+- roles: plan page = foreground · Approve button = the reflex · chip = the signal
+- sfx: none
+
+narrativeRole: A plan nobody answered.
+keyMessage: An agent hands you its plan:
+
+Scene 1 (0.0–2.5s): the plan page lands left of centre; step titles and grey text bars.
+Scene 2 (on 'three questions'): the questions block at the page's foot lifts into view.
+Scene 3 (on 'approve'): the Approve button presses; 'approved' lands under it.
+Scene 4 (on 'Nobody'): the coral chip '0 of 3 answered' lands on the questions. Held.
+
+## Frame 2 — Review it by watching
+
+- scene: PROTOTYPE: the plan page from the hook shrinks to a thumbnail on the left; on 'plan-to-video skill' a mono chip 'The plan-to-video skill' rides the arrow to the right; on 'review player' the player lands right (a 1000×560 mock: a frame showing a small stage, a scrub bar, and the part bar of numbered part chips under it, part 2 widened with its title); on 'where you are' the playhead sits in part 2 and the mono line 'Part 2 of 4' lands (coral)
+- voiceover: "reelplanning turns that plan into a short narrated video, and you review it by watching. The plan-to-video skill makes the video. The review player plays it in parts of about a minute, with a bar that shows where you are."
+- duration: 11.755s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/02-watch.html
+- type: pain_point
+- persuasion: The turn: the same plan, watched
+- beat: Orientation
+- blueprint: compose
+- spec_section: Purpose
+- components: skill, player
+- focal: the part bar: a video with a length you can see
+- roles: plan thumbnail = before · player = after · part bar = the signal
+- sfx: none
+
+narrativeRole: Review it by watching.
+keyMessage: reelplanning turns that plan into a short narrated video, and you review it by watching.
+
+Scene 1 (0.0–3s): the plan page shrinks left.
+Scene 2 (on 'plan-to-video'): the arrow draws and its chip lands.
+Scene 3 (on 'review player'): the player mock lands right.
+Scene 4 (on 'parts'): the part chips land under the bar, one per part.
+Scene 5 (on 'where'): part 2 widens, 'Part 2 of 4' lands. Held.
+
+## Frame 3 — It stops at each choice
+
+- scene: PROTOTYPE: the review player (1180×640) on the deep-dives plan's first choice; on 'stops' the bar reads 'paused' and the question sheet rises over the lower half: 'Where does a detail open?', cards A 'Side panel' (with a small 'recommended' tag), B 'Full size', C 'New tab'; on 'pick' A takes the coral border; on 'note' a note field under the cards types 'Full size on phones'
+- voiceover: "Text lets you skim past a question. A video has a length, and it stops at each choice. Here it asks where a detail page should open, gives three options, and recommends one. You pick an answer, and you can add a note."
+- duration: 12.98s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/03-stops.html
+- type: pain_point
+- persuasion: Show the thing: the paused question
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Purpose
+- components: player
+- focal: the paused question, waiting for an answer
+- roles: player = foreground · question sheet = the thing · picked card = the signal
+- sfx: none
+
+narrativeRole: It stops at each choice.
+keyMessage: Text lets you skim past a question.
+
+Scene 1 (0.0–2.5s): the player lands, playing.
+Scene 2 (on 'stops'): 'paused'; the sheet rises.
+Scene 3 (on 'three options'): the three cards land; on 'recommends' the tag lands on A.
+Scene 4 (on 'pick'): A's border coral.
+Scene 5 (on 'note'): the note field lands and fills. Held.
+
+## Frame 4 — Two videos per plan
+
+- scene: PROTOTYPES side by side: left player 'Before the code' (a question sheet: A / B / C); right player 'After the code' (a walkthrough call: 'Call A10 · Step 4', 'Clicking away keeps typed words', with Accept and Flag buttons); each lands on its words; on 'accept or flag' the two buttons land (Flag coral)
+- voiceover: "Each plan gets two videos. Before any code, the plan video asks you its questions. After the code is written, a walkthrough video shows what landed, and stops at each call the agent made on its own, for you to accept or flag."
+- duration: 12.971s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/04-two-videos.html
+- type: product_intro
+- persuasion: Before / after the code, side by side
+- beat: Orientation
+- blueprint: compose
+- spec_section: Purpose
+- components: player, implement-step
+- focal: the same player, before and after the code
+- roles: two players = foreground · Accept / Flag = the signal
+- sfx: none
+
+narrativeRole: Two videos per plan.
+keyMessage: Each plan gets two videos.
+
+Scene 1 (0.0–1.5s): kicker 'Two videos per plan'.
+Scene 2 (on 'Before'): the left player lands with its question sheet.
+Scene 3 (on 'After'): the right player lands with the call.
+Scene 4 (on 'accept'): Accept and Flag land. Held.
+
+## Frame 5 — Quick check, part 1
+
+- scene: NO STAGE: kicker 'Quick check · Part 1'; the question in serif; three option cards A/B/C land on their words, none marked (the player marks the answer after you pick). Everything above y 650: the player's sheet covers the lower third while it asks.
+- voiceover: "Quick check. Why review a plan as a video? Because it's shorter to write, because it stops at each choice and waits, or because the agent can skip the plan?"
+- duration: 8.69s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/05-check-1.html
+- type: social_proof
+- persuasion: Question→answer pairing
+- beat: Focus
+- blueprint: compose
+- spec_section: Purpose
+- components: player
+- quiz: k1
+- question: Why review a plan as a video?
+- option_a: It is shorter to write
+- option_b: It stops at each choice and waits
+- option_c: The agent can skip the plan
+- answer: b
+- explain: a text plan lets you skim past its questions; the video stops at each one until you answer
+- focal: the question and its three options
+- roles: question = foreground · option cards = the answers · paper ground = background
+- sfx: none
+
+narrativeRole: Quick check, part 1.
+keyMessage: Quick check.
+
+Scene 1 (0.0s): kicker and the question settle (power3, 0.5 s).
+Scene 2 (on 'shorter'): card A lands.
+Scene 3 (on 'stops'): card B lands.
+Scene 4 (on 'skip'): card C lands.
+Scene 5 (last ≥ 0.6 s): held read, nothing moves.
+
+## Frame 6 — Next: part 2
+
+- scene: PART LIST (full): parts 1–1 filled; 'Next · Part 2' in mono beside the list with the hero line 'The parts'
+- voiceover: "Next, part two: the parts that make this work."
+- duration: 4s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/06-closer-1.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Purpose
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Next: part 2.
+keyMessage: Next, part two:
+
+Scene 1 (0.0–end): the part list as done so far; the mono line and the hero. Held still.
+
+## Frame 7 — Part 2 of 5
+
+- chapter_start: The parts
+- scene: PART LIST (full): parts 1–1 filled; part 2 lifts from dashed to filled; kicker 'Part 2 of 5'; hero 'A video that asks' (what the last part banked)
+- voiceover: "Part two of five. Twelve parts do this work. Here they are, four at a time."
+- duration: 4.27s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/07-opener-2.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Parts
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Part 2 of 5.
+keyMessage: Part two of five.
+
+Scene 1 (0.0–end): kicker; hero; part 2 fills on 'Twelve'. Held.
+
+## Frame 8 — Four parts make the video
+
+- scene: STAGE (4 parts, at their system.json places): the plan-to-video skill, finish-project, plan-diff, the review player, each landing on its spoken name with a plain-words chip (≤ 3 words); edges finish-project → plan-diff and plan-diff → review player draw as their names are said; the finished four hold ≥ 1.5 s
+- voiceover: "Four parts make the video and play it. The plan-to-video skill writes the script and the frames. finish-project puts them together, with the voice and captions. plan-diff finds what changed since the last build. And the review player is where you watch and answer."
+- duration: 14.101s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/08-make.html
+- type: product_intro
+- persuasion: Pre-training: name each part once
+- beat: Orientation
+- blueprint: compose
+- spec_section: Parts
+- components: skill, finish, diff, player
+- focal: four parts, one at a time
+- roles: nodes = foreground · chips = plain names · paper ground = background
+- sfx: none
+
+narrativeRole: Four parts make the video.
+keyMessage: Four parts make the video and play it.
+
+Scene 1 (0.0–1.5s): kicker 'The parts · 1 of 3'.
+Scene 2 (on 'plan-to-video'): the node lands coral, chip 'plan → video'.
+Scene 3 (on 'finish-project'): node + chip 'puts it together'; the coral moves.
+Scene 4 (on 'plan-diff'): edge finish → diff draws; node + chip 'finds what changed'.
+Scene 5 (on 'review player'): edge diff → player draws; node + chip 'you watch, answer'.
+Scene 6 (last 1.5s): four parts in ink. Held.
+
+## Frame 9 — Four carry your answers back
+
+- scene: STAGE (5 parts): the review player (already met, dim) at its place; resolve-plan, the reel CLI, the revise step land on their names with chips; the push-triggered workflow lands above the revise step, dashed (written, not yet run for real); edges player → resolve-plan → reel CLI → revise step and workflow → revise step draw on their names
+- voiceover: "Four more carry your answers back. resolve-plan writes them into the plan. The reel CLI keeps the project's record, with every decision in a log. The revise step rewrites the steps you commented on. And the push-triggered workflow starts the revise step when you push."
+- duration: 14.869s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/09-answers-back.html
+- type: product_intro
+- persuasion: Pre-training: name each part once
+- beat: Orientation
+- blueprint: compose
+- spec_section: Parts
+- components: resolve, cli, revise, action, player
+- focal: four more parts, one at a time
+- roles: nodes = foreground · chips = plain names · dashed node = not yet run
+- sfx: none
+
+narrativeRole: Four carry your answers back.
+keyMessage: Four more carry your answers back.
+
+Scene 1 (0.0–1.5s): kicker 'The parts · 2 of 3'; the review player dim at its place.
+Scene 2 (on 'resolve-plan'): edge player → resolve-plan; node + chip 'writes answers in'.
+Scene 3 (on 'reel'): edge → reel CLI; node + chip 'keeps the record'.
+Scene 4 (on 'revise'): edge → revise step; node + chip 'edits the plan'.
+Scene 5 (on 'push-triggered'): the dashed workflow node lands above, its edge down; chip 'starts it on a push'.
+Scene 6 (last 1.5s): held.
+
+## Frame 10 — Four work after the code
+
+- scene: STAGE (6 parts): the review player and finish-project (already met, dim); the implement step, resolve-walkthrough, the walkthrough fix step, the system video land on their names with chips; edges implement step → player → resolve-walkthrough → fix step → finish-project, and resolve-walkthrough → system video draw on their names
+- voiceover: "The last four work after approval. The implement step writes the code and logs each call the plan didn't cover. resolve-walkthrough records your accept or flag on each call. The walkthrough fix step changes what you flagged. And the system video is this one."
+- duration: 14.101s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/10-after-code.html
+- type: product_intro
+- persuasion: Pre-training: name each part once
+- beat: Orientation
+- blueprint: compose
+- spec_section: Parts
+- components: implement-step, resolve-walk, fix-step, system-video, player, finish
+- focal: the last four parts, one at a time
+- roles: nodes = foreground · chips = plain names
+- sfx: none
+
+narrativeRole: Four work after the code.
+keyMessage: The last four work after approval.
+
+Scene 1 (0.0–1.5s): kicker 'The parts · 3 of 3'; the player and finish-project dim.
+Scene 2 (on 'implement'): node + chip 'writes the code'; edge → player.
+Scene 3 (on 'resolve-walkthrough'): edge player → it; node + chip 'writes verdicts in'.
+Scene 4 (on 'fix'): edge → fix step, and on to finish-project; node + chip 'fixes flagged code'.
+Scene 5 (on 'system video'): edge → system video; node + chip 'this video'. Held.
+
+## Frame 11 — All twelve parts
+
+- scene: FULL STAGE, data-density=full (the one frame with every part): all twelve parts at their places land in three quick groups, then every edge; on 'review loop' its six edges turn coral in loop order, then back to ink; on 'build loop' the build loop's edges take the coral; on 'joins' the review player and finish-project take it; the finished map holds ≥ 1.5 s in ink
+- voiceover: "Here are all twelve. The review loop runs round the top. The build loop runs along the bottom, and joins it at the review player and at finish-project."
+- duration: 10.06s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/11-cast.html
+- type: product_intro
+- persuasion: The whole cast, once
+- beat: Orientation
+- blueprint: compose
+- spec_section: Parts
+- components: skill, cli, resolve, diff, finish, revise, action, player, implement-step, resolve-walk, fix-step, system-video
+- focal: the whole map, and its two loops
+- roles: twelve nodes = foreground · the lit loop = the signal
+- sfx: none
+
+narrativeRole: All twelve parts.
+keyMessage: Here are all twelve.
+
+Scene 1 (0.0–1.8s): the twelve land in their three groups; the edges draw.
+Scene 2 (on 'review loop'): its edges coral in order.
+Scene 3 (on 'build loop'): the coral moves to the build loop's edges.
+Scene 4 (on 'joins'): the review player and finish-project take the coral.
+Scene 5 (last ≥ 1.5 s): all ink. Held.
+
+## Frame 12 — Quick check, part 2
+
+- scene: NO STAGE: kicker 'Quick check · Part 2'; the question in serif; three option cards A/B/C land on their words, none marked (the player marks the answer after you pick). Everything above y 650: the player's sheet covers the lower third while it asks.
+- voiceover: "Quick check. After your review, which part rewrites the plan: resolve-plan, the revise step, or plan-diff?"
+- duration: 6.2s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/12-check-2.html
+- type: social_proof
+- persuasion: Question→answer pairing
+- beat: Focus
+- blueprint: compose
+- spec_section: Parts
+- components: resolve, revise, diff
+- quiz: k2
+- question: After your review, which part rewrites the plan?
+- option_a: resolve-plan
+- option_b: The revise step
+- option_c: plan-diff
+- answer: b
+- explain: the revise step rewrites the steps you commented on; resolve-plan only writes your answers into a copy of the plan, and plan-diff finds what changed in the video
+- focal: the question and its three options
+- roles: question = foreground · option cards = the answers · paper ground = background
+- sfx: none
+
+narrativeRole: Quick check, part 2.
+keyMessage: Quick check.
+
+Scene 1 (0.0s): kicker and the question settle (power3, 0.5 s).
+Scene 2 (on 'resolve'): card A lands.
+Scene 3 (on 'revise'): card B lands.
+Scene 4 (on 'or'): card C lands.
+Scene 5 (last ≥ 0.6 s): held read, nothing moves.
+
+## Frame 13 — Next: part 3
+
+- scene: PART LIST (full): parts 1–2 filled; 'Next · Part 3' in mono beside the list with the hero line 'The review loop'
+- voiceover: "Next, part three: the review loop, one step at a time."
+- duration: 4s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/13-closer-2.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Parts
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Next: part 3.
+keyMessage: Next, part three:
+
+Scene 1 (0.0–end): the part list as done so far; the mono line and the hero. Held still.
+
+## Frame 14 — Part 3 of 5
+
+- chapter_start: The review loop
+- scene: PART LIST (full): parts 1–2 filled; part 3 lifts from dashed to filled; kicker 'Part 3 of 5'; hero '12 parts, met' (what the last part banked)
+- voiceover: "Part three of five. You've met all twelve parts. The review loop starts when you finish a review."
+- duration: 5.4s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/14-opener-3.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Pipelines
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Part 3 of 5.
+keyMessage: Part three of five.
+
+Scene 1 (0.0–end): kicker; hero; part 3 fills on 'review loop'. Held.
+
+## Frame 15 — Review loop, steps 1–3: decide, export, record
+
+- scene: STAGE (3 parts) + LOG ENTRY: kicker 'Review loop · Steps 1–3'; the review player, resolve-plan, the reel CLI at their places; 'Step one' lights the player; 'Step two' draws player → resolve-plan with the chip 'annotations.json'; 'Step three' draws resolve-plan → reel CLI; on 'decision log' a page of the log lands in the left column with the real row 'D-021 · Where does a detail open? · Side panel · active' (coral left rule); on 'copy of the plan' the chip 'plan.resolved.md' lands above resolve-plan
+- voiceover: "Step one: you mark, comment and decide in the review player. Step two: your review exports as one file. Step three: the reel CLI adds each answer to the decision log, and resolve-plan writes a copy of the plan with your answers in it."
+- duration: 13.781s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/15-review-1-3.html
+- type: feature_showcase
+- persuasion: Pipeline edges, one per spoken step, with the real record
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: player, resolve, cli
+- focal: an answer becoming a log entry
+- roles: nodes = the pipeline · log page = the worked example · chips = the files handed on
+- sfx: none
+
+narrativeRole: Review loop, steps 1–3: decide, export, record.
+keyMessage: Step one:
+
+Scene 1 (0.0–1.2s): kicker; the three parts dim.
+Scene 2 (on 'one'): the player lit.
+Scene 3 (on 'two'): edge to resolve-plan draws; chip 'annotations.json'.
+Scene 4 (on 'three'): edge to the reel CLI draws; the CLI lit.
+Scene 5 (on 'decision log'): the log page lands left; its D-021 row takes the coral rule.
+Scene 6 (on 'copy'): chip 'plan.resolved.md' above resolve-plan. Held.
+
+## Frame 16 — Review loop, steps 4–5: push, then revise
+
+- scene: STAGE (3 parts) + PLAN PAGE: kicker 'Review loop · Steps 4–5'; the reel CLI, the revise step, and the push-triggered workflow (dashed) above it; 'Step four' draws reel CLI → revise and workflow → revise; 'Step five' lights the revise step; the deep-dives plan lands under the stage as six rows with their real titles; on 'two, four and six' rows 2, 4, 6 take 'rewritten' (row 2's rule coral); on 'plain pick' row 1 takes 'picked · unchanged'
+- voiceover: "Step four: a push starts the push-triggered workflow, which runs the revise step. Step five: the revise step rewrites only the steps your words landed on. In the deep-dives review, that was steps two, four and six. Step one got a plain pick, and stayed as it was."
+- duration: 15.147s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/16-review-4-5.html
+- type: feature_showcase
+- persuasion: Worked example with real values
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: cli, action, revise
+- focal: three steps rewritten, three left alone
+- roles: nodes = the pipeline · plan page = the worked example
+- sfx: none
+
+narrativeRole: Review loop, steps 4–5: push, then revise.
+keyMessage: Step four:
+
+Scene 1 (0.0–1.2s): kicker; the CLI dim.
+Scene 2 (on 'four'): edges draw; the workflow node lands dashed.
+Scene 3 (on 'five'): the revise step lit; the plan page lands, six rows.
+Scene 4 (on 'two, four and six'): three rows take 'rewritten'.
+Scene 5 (on 'plain pick'): row 1 takes 'picked · unchanged'. Held.
+
+## Frame 17 — Review loop, steps 6–7: rebuild, rewatch
+
+- scene: STAGE (4 parts) + PLAYER PANEL: kicker 'Review loop · Steps 6–7'; the revise step, finish-project, plan-diff, the review player; 'Step six' draws revise → finish-project → plan-diff; 'Step seven' draws plan-diff → player; the player's part bar lands in the left column with two beats marked 'changed', the line '2 beats changed' and the button 'Play just the changes' (coral)
+- voiceover: "Step six: finish-project rebuilds the video, and plan-diff compares it with the last build. Step seven: the review player offers only the beats that changed. If two beats changed, you rewatch two beats, not the whole video."
+- duration: 12.587s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/17-review-6-7.html
+- type: feature_showcase
+- persuasion: Show the thing: the player's changed-beats offer
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: revise, finish, diff, player
+- focal: only the changed beats, offered
+- roles: nodes = the pipeline · player panel = the worked example
+- sfx: none
+
+narrativeRole: Review loop, steps 6–7: rebuild, rewatch.
+keyMessage: Step six:
+
+Scene 1 (0.0–1.2s): kicker; the four parts dim.
+Scene 2 (on 'six'): revise → finish-project draws; finish lit.
+Scene 3 (on 'plan-diff'): finish → diff draws; diff lit.
+Scene 4 (on 'seven'): diff → player draws; player lit; the panel lands left.
+Scene 5 (on 'two beats'): the two marks and the button (coral). Held.
+
+## Frame 18 — The whole review loop
+
+- scene: STAGE (6 parts, the loop): the review player, resolve-plan, the reel CLI, the revise step, finish-project, plan-diff; the six edges draw in loop order on 'your answers go in'; on 'run by hand' the chip 'run by hand' under the revise step; on 'hasn't run' the chip 'on a push: not run yet' above it (coral)
+- voiceover: "That's the review loop: your answers go in, and only the changes come back. Every step exists. Five are tested, the revise step has run by hand, and the workflow that starts it hasn't run for real yet."
+- duration: 12.011s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/18-review-loop.html
+- type: benefit_highlight
+- persuasion: The loop, closed, with what has run for real
+- beat: Resolution
+- blueprint: compose
+- spec_section: Pipelines
+- components: player, resolve, cli, revise, finish, diff
+- focal: the loop, closed
+- roles: the loop = foreground · status chips = what has not run for real
+- sfx: none
+
+narrativeRole: The whole review loop.
+keyMessage: That's the review loop:
+
+Scene 1 (0.0–3s): the six parts; the loop's edges draw in order.
+Scene 2 (on 'Five'): nothing new; the loop holds.
+Scene 3 (on 'by hand'): chip under the revise step.
+Scene 4 (on 'hasn't'): the coral chip above it. Held.
+
+## Frame 19 — Quick check, part 3
+
+- scene: NO STAGE: kicker 'Quick check · Part 3'; the question in serif; three option cards A/B/C land on their words, none marked (the player marks the answer after you pick). Everything above y 650: the player's sheet covers the lower third while it asks.
+- voiceover: "Quick check. You answer a question with a plain pick, and write nothing. What does the revise step rewrite: that question's step, nothing, or every step?"
+- duration: 8.44s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/19-check-3.html
+- type: social_proof
+- persuasion: Question→answer pairing
+- beat: Focus
+- blueprint: compose
+- spec_section: Pipelines
+- components: revise
+- quiz: k3
+- question: You answer with a plain pick. What does the revise step rewrite?
+- option_a: That question's step
+- option_b: Nothing
+- option_c: Every step
+- answer: b
+- explain: a plain pick is already in the decision log; only steps a comment, mark, flag or own-words answer landed on are rewritten
+- focal: the question and its three options
+- roles: question = foreground · option cards = the answers · paper ground = background
+- sfx: none
+
+narrativeRole: Quick check, part 3.
+keyMessage: Quick check.
+
+Scene 1 (0.0s): kicker and the question settle (power3, 0.5 s).
+Scene 2 (on 'that'): card A lands.
+Scene 3 (on 'nothing'): card B lands.
+Scene 4 (on 'every'): card C lands.
+Scene 5 (last ≥ 0.6 s): held read, nothing moves.
+
+## Frame 20 — Next: part 4
+
+- scene: PART LIST (full): parts 1–3 filled; 'Next · Part 4' in mono beside the list with the hero line 'The build loop'
+- voiceover: "Next, part four: what happens after the code is written."
+- duration: 4s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/20-closer-3.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Pipelines
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Next: part 4.
+keyMessage: Next, part four:
+
+Scene 1 (0.0–end): the part list as done so far; the mono line and the hero. Held still.
+
+## Frame 21 — Part 4 of 5
+
+- chapter_start: The build loop
+- scene: PART LIST (full): parts 1–3 filled; part 4 lifts from dashed to filled; kicker 'Part 4 of 5'; hero 'Answers reach the plan' (what the last part banked)
+- voiceover: "Part four of five. Your answers now reach the plan and the video. Next, the plan gets built."
+- duration: 5.48s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/21-opener-4.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Pipelines
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Part 4 of 5.
+keyMessage: Part four of five.
+
+Scene 1 (0.0–end): kicker; hero; part 4 fills on 'built'. Held.
+
+## Frame 22 — Build loop, step 1: build, and log each call
+
+- scene: STAGE (1 part) + CALL LOG: kicker 'Build loop · Step 1'; the implement step at its place, lit; the walkthrough's call table lands right (header 'call · chose · instead of · why'), three real rows from the richer-review build (A7, A10, A15), one per spoken clause; on 'chose' / 'instead' / 'why' those columns take an ink underline in turn; A10's row carries the coral rule
+- voiceover: "Step one: the implement step builds from the resolved plan. Whenever it makes a call the plan didn't cover, it logs it right then: what it chose, instead of what, and why."
+- duration: 9.088s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/22-code-1.html
+- type: feature_showcase
+- persuasion: Show the thing: the call log
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: implement-step
+- focal: a call logged the moment it is made
+- roles: node = the part · call table = the worked example
+- sfx: none
+
+narrativeRole: Build loop, step 1: build, and log each call.
+keyMessage: Step one:
+
+Scene 1 (0.0–1.2s): kicker; the implement step lit.
+Scene 2 (on 'logs'): the table lands, rows one by one.
+Scene 3 (on 'chose'): the 'chose' column underlines; then 'instead of'; then 'why'. Held.
+
+## Frame 23 — Build loop, step 2: a second agent checks
+
+- scene: PROTOTYPE, stage gone: kicker 'Build loop · Step 2'; card 'Agent 1 · wrote the code' left; on 'short brief' a brief page lands in the middle ('plan · decisions · call log · diff'); on 'fresh agent' card 'Agent 2 · fresh' right, reading only the brief; on 'reasons' a dashed line from Agent 1 to Agent 2 with 'not shared' on it; on 'answered' a finding lands under Agent 2: 'Step 6 · rewinds never reached the revise' with 'answered in the walkthrough' (coral)
+- voiceover: "Step two: a second, fresh agent checks the code against the plan and the decision log. It starts from a short brief, never from the first agent's reasons, and every finding must be answered."
+- duration: 10.773s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/23-code-2.html
+- type: feature_showcase
+- persuasion: Show the thing: the brief and a finding
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: implement-step
+- focal: the brief is all the checker gets
+- roles: agent cards = the two agents · brief page = the hand-off · finding = the worked example
+- sfx: none
+
+narrativeRole: Build loop, step 2: a second agent checks.
+keyMessage: Step two:
+
+Scene 1 (0.0–1.5s): kicker; Agent 1 card.
+Scene 2 (on 'fresh'): Agent 2 card lands right.
+Scene 3 (on 'brief'): the brief page lands between them.
+Scene 4 (on 'reasons'): the dashed 'not shared' line.
+Scene 5 (on 'finding'): the finding and its answer (coral). Held.
+
+## Frame 24 — Build loop, step 3: the walkthrough video
+
+- scene: STAGE (2 parts) + PLAYER: kicker 'Build loop · Step 3'; the implement step at its place; edge → the review player, which opens into a walkthrough player mock (x 946–1844): 'Call A10 · Step 4', 'Clicking away keeps typed words'; on 'pauses' the bar reads 'paused' and Accept / Flag land; on 'own words' a note types 'maybe escape should keep them too' (the reviewer's real words; its box coral)
+- voiceover: "Step three: a walkthrough video shows what landed. At each call the agent made on its own, the player pauses: accept it, or flag it. You can also answer in your own words, as this reviewer did."
+- duration: 11.008s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/24-code-3.html
+- type: feature_showcase
+- persuasion: Show the thing: Accept / Flag
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: implement-step, player
+- focal: a call, paused for your verdict
+- roles: player = the thing · Accept / Flag = the ask · note = the worked example
+- sfx: none
+
+narrativeRole: Build loop, step 3: the walkthrough video.
+keyMessage: Step three:
+
+Scene 1 (0.0–1.5s): kicker; the implement step.
+Scene 2 (on 'walkthrough'): edge draws; the player mock lands.
+Scene 3 (on 'pauses'): 'paused'; Accept and Flag land.
+Scene 4 (on 'own words'): the note box lands and types. Held.
+
+## Frame 25 — Build loop, steps 4–5: record, fix
+
+- scene: STAGE (4 parts) + CALL ROW: kicker 'Build loop · Steps 4–5'; the review player, resolve-walkthrough, the walkthrough fix step, finish-project at their places; 'Step four' draws player → resolve-walkthrough; 'Step five' draws → fix step → finish-project; the A10 row lands in the left column and gains 'changed after review: Escape keeps them too; a × discards' (coral rule); on 'new plan' the chip 'or: a new plan' under the fix step
+- voiceover: "Step four: resolve-walkthrough writes down your verdicts. Step five: the walkthrough fix step changes the code you flagged, and rebuilds only that call's beat. But if your words would overturn a logged decision, it becomes a new plan instead."
+- duration: 13.44s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/25-code-4-5.html
+- type: feature_showcase
+- persuasion: Worked example: the one call changed
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: player, resolve-walk, fix-step, finish
+- focal: one flagged call, changed
+- roles: nodes = the pipeline · A10 row = the worked example · chip = the escape hatch
+- sfx: none
+
+narrativeRole: Build loop, steps 4–5: record, fix.
+keyMessage: Step four:
+
+Scene 1 (0.0–1.2s): kicker; the four parts dim.
+Scene 2 (on 'four'): player → resolve-walkthrough draws; it lights.
+Scene 3 (on 'five'): → fix step → finish-project; the A10 row lands and gains its change line.
+Scene 4 (on 'new plan'): the chip under the fix step. Held.
+
+## Frame 26 — Build loop, step 6: this video catches up
+
+- scene: STAGE (2 parts) + SPEC PAGE: kicker 'Build loop · Step 6'; resolve-walkthrough → the system video (edge draws on 'Step six'); a spec.md page lands right with its section headings (Purpose, Parts, Pipelines, Invariants), 'Pipelines' marked 'changed'; on 'only the frames' a strip of this video's frame chips lands under it, two marked 'rebuild' (coral), the rest 'keep'
+- voiceover: "Step six: the spec is updated, and this video rebuilds only the frames that explain what changed. Steps one to five ran for real on the richer-review plan; this video is step six's first run."
+- duration: 11.669s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/26-code-6.html
+- type: feature_showcase
+- persuasion: Show the thing: spec → the frames it touches
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Pipelines
+- components: resolve-walk, system-video
+- focal: a spec change finding its frames
+- roles: spec page = the change · frame strip = what rebuilds
+- sfx: none
+
+narrativeRole: Build loop, step 6: this video catches up.
+keyMessage: Step six:
+
+Scene 1 (0.0–1.2s): kicker; the two parts.
+Scene 2 (on 'spec'): the edge draws; the spec page lands; 'Pipelines' marked.
+Scene 3 (on 'only the frames'): the frame strip; two chips 'rebuild'.
+Scene 4 (on 'richer-review'): nothing new. Held.
+
+## Frame 27 — Quick check, part 4
+
+- scene: NO STAGE: kicker 'Quick check · Part 4'; the question in serif; three option cards A/B/C land on their words, none marked (the player marks the answer after you pick). Everything above y 650: the player's sheet covers the lower third while it asks.
+- voiceover: "Quick check. You flag a call, and your words would overturn a logged decision. Is the code changed anyway, does it become a new plan, or is the flag dropped?"
+- duration: 9.22s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/27-check-4.html
+- type: social_proof
+- persuasion: Question→answer pairing
+- beat: Focus
+- blueprint: compose
+- spec_section: Pipelines
+- components: fix-step
+- quiz: k4
+- question: Your flag would overturn a logged decision. What happens?
+- option_a: The code changes anyway
+- option_b: It becomes a new plan
+- option_c: The flag is dropped
+- answer: b
+- explain: a flag that would overturn a decision in the log is not fixed in place: it becomes a new plan that lists that decision under Supersedes, and is reviewed again
+- focal: the question and its three options
+- roles: question = foreground · option cards = the answers · paper ground = background
+- sfx: none
+
+narrativeRole: Quick check, part 4.
+keyMessage: Quick check.
+
+Scene 1 (0.0s): kicker and the question settle (power3, 0.5 s).
+Scene 2 (on 'anyway'): card A lands.
+Scene 3 (on 'new'): card B lands.
+Scene 4 (on 'dropped'): card C lands.
+Scene 5 (last ≥ 0.6 s): held read, nothing moves.
+
+## Frame 28 — Next: part 5
+
+- scene: PART LIST (full): parts 1–4 filled; 'Next · Part 5' in mono beside the list with the hero line 'The rules'
+- voiceover: "Next, the last part: the rules that keep both loops honest."
+- duration: 4s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/28-closer-4.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Pipelines
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Next: part 5.
+keyMessage: Next, the last part:
+
+Scene 1 (0.0–end): the part list as done so far; the mono line and the hero. Held still.
+
+## Frame 29 — Part 5 of 5
+
+- chapter_start: The rules
+- scene: PART LIST (full): parts 1–4 filled; part 5 lifts from dashed to filled; kicker 'Part 5 of 5'; hero '2 loops' (what the last part banked)
+- voiceover: "Part five of five. One loop reviews the plan, one checks the build. Last: six rules keep them honest."
+- duration: 6.27s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/29-opener-5.html
+- type: branding
+- persuasion: Signposting
+- beat: Transition
+- blueprint: compose
+- spec_section: Invariants
+- focal: the part list
+- roles: part list = foreground · paper ground = background
+- sfx: none
+
+narrativeRole: Part 5 of 5.
+keyMessage: Part five of five.
+
+Scene 1 (0.0–end): kicker; hero; part 5 fills on 'six rules'. Held.
+
+## Frame 30 — Rules 1–2: the log only grows
+
+- scene: PROTOTYPE: kicker 'Rules 1 and 2'; the decision log as a page (real rows D-019 … D-022: id, question, chosen, status); on 'only grows' a dashed empty row lands at the foot, 'next: D-024'; on 'never edits' the rows' text holds still while the status column takes an ink underline; on 'confused' D-022's status 'reopened · asked again' takes the coral rule
+- voiceover: "Rule one: the decision log only grows. A revise never edits a past entry; it adds one, or marks one superseded. Rule two: only an answer is a decision. When a reviewer said a question confused them, it was logged as reopened, and asked again."
+- duration: 14.699s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/30-rule-log.html
+- type: benefit_highlight
+- persuasion: Show the thing: the real log
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Invariants
+- components: cli
+- focal: the log: new rows only, and a confused answer that is not a choice
+- roles: log page = foreground · D-022 = the worked example
+- sfx: none
+
+narrativeRole: Rules 1–2: the log only grows.
+keyMessage: Rule one:
+
+Scene 1 (0.0–1.2s): kicker; the log page lands.
+Scene 2 (on 'grows'): the dashed next row.
+Scene 3 (on 'superseded'): the status column underlined.
+Scene 4 (on 'confused'): D-022's row, coral rule. Held.
+
+## Frame 31 — Rules 3–4: only what your words touched
+
+- scene: PROTOTYPE: kicker 'Rules 3 and 4'; left, the plan's six rows again with rows 2, 4, 6 'rewritten' (from part 3); on 'in place' a file list lands right: 'plan.md' (ink) and 'plan-v2.md' dashed and struck, chip 'never'; on 'git' the real history of that plan under it: '040f02c Plan: deep dives …', '9bad874 … plan revised …' (the second takes the coral rule)
+- voiceover: "Rule three: the revise step touches only a step that a comment, mark, flag or own-words answer landed on. Rule four: it edits the plan in place, and git keeps the history. There is never a plan two."
+- duration: 12.64s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/31-rule-touched.html
+- type: benefit_highlight
+- persuasion: Show the thing: one plan file and its history
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Invariants
+- components: revise
+- focal: one plan file, its history in git
+- roles: plan rows = rule 3 · file list + git log = rule 4
+- sfx: none
+
+narrativeRole: Rules 3–4: only what your words touched.
+keyMessage: Rule three:
+
+Scene 1 (0.0–1.2s): kicker; the plan rows land with their tags.
+Scene 2 (on 'in place'): the file list lands right.
+Scene 3 (on 'git'): the two commits land; the second coral.
+Scene 4 (on 'never'): 'plan-v2.md' struck. Held.
+
+## Frame 32 — Quick check, part 5
+
+- scene: NO STAGE: kicker 'Quick check · Part 5'; the question in serif; three option cards A/B/C land on their words, none marked (the player marks the answer after you pick). Everything above y 650: the player's sheet covers the lower third while it asks.
+- voiceover: "Quick check. A reviewer presses Explain this more. What goes in the decision log: their note as the answer, no choice at all, or the recommended option?"
+- duration: 9.27s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/32-check-5.html
+- type: social_proof
+- persuasion: Question→answer pairing
+- beat: Focus
+- blueprint: compose
+- spec_section: Invariants
+- components: cli
+- quiz: k5
+- question: A reviewer presses Explain this more. What goes in the log?
+- option_a: Their note, as the answer
+- option_b: No choice: it is asked again
+- option_c: The recommended option
+- answer: b
+- explain: only an answer is a decision; the question is explained better and asked again
+- focal: the question and its three options
+- roles: question = foreground · option cards = the answers · paper ground = background
+- sfx: none
+
+narrativeRole: Quick check, part 5.
+keyMessage: Quick check.
+
+Scene 1 (0.0s): kicker and the question settle (power3, 0.5 s).
+Scene 2 (on 'note'): card A lands.
+Scene 3 (on 'choice'): card B lands.
+Scene 4 (on 'recommended'): card C lands.
+Scene 5 (last ≥ 0.6 s): held read, nothing moves.
+
+## Frame 33 — Rule 5: a frame keeps its id
+
+- scene: PROTOTYPE, two columns: left 'Same id': frame '06-step-2' before → '06-step-2' after, chip 'edited · rewatch 1'; right 'New id': '06-step-2' struck, '06-step-2b' added, chips 'removed' and 'added'; on 'breaks' the right column's chips take the coral
+- voiceover: "Rule five: a rebuilt frame keeps its id. plan-diff matches frames by id, so an edit shows as one edited beat. Give it a new id, and it looks deleted and re-added, and you rewatch more than changed."
+- duration: 12.544s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/33-rule-ids.html
+- type: benefit_highlight
+- persuasion: Comparison: same id vs a new id
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Invariants
+- components: diff
+- focal: the same edit, read two ways
+- roles: left column = the rule kept · right column = the rule broken
+- sfx: none
+
+narrativeRole: Rule 5: a frame keeps its id.
+keyMessage: Rule five:
+
+Scene 1 (0.0–1.2s): kicker 'Rule 5'.
+Scene 2 (on 'keeps'): the left column: the same id twice; 'edited · rewatch 1'.
+Scene 3 (on 'new id'): the right column: one struck, one added.
+Scene 4 (on 'deleted'): chips 'removed' / 'added' (coral). Held.
+
+## Frame 34 — Rule 6: the checker never wrote the code
+
+- scene: PROTOTYPE: kicker 'Rule 6'; the two agent cards from part 4, small, left; on 'answered in the walkthrough' the walkthrough's 'Code check' section lands right as a page: the real finding 'Step 6 · rewinds never reached the revise' and its answer 'right, a real gap · fixed after the check'; on 'quietly' the mono line 'every finding answered' under it (coral)
+- voiceover: "Rule six: the agent that wrote the code never checks it. The checker starts from the brief alone, and every finding is answered in the walkthrough, where you can see it, never fixed quietly."
+- duration: 10.76s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/34-rule-checker.html
+- type: benefit_highlight
+- persuasion: Show the thing: a finding, answered in the open
+- beat: Comprehension
+- blueprint: compose
+- spec_section: Invariants
+- components: implement-step
+- focal: a finding and its answer, in the open
+- roles: agent cards = context · Code check page = the worked example
+- sfx: none
+
+narrativeRole: Rule 6: the checker never wrote the code.
+keyMessage: Rule six:
+
+Scene 1 (0.0–1.5s): kicker; the two agent cards.
+Scene 2 (on 'walkthrough'): the Code check page lands; the finding, then its answer.
+Scene 3 (on 'quietly'): the coral line. Held.
+
+## Frame 35 — reelplanning, in one picture
+
+- scene: PART LIST (full), no diagram: the five parts filled with their tags; beside it the hero 'Watch plans. Answer them.' and the mono line 'Open a plan video in the library'; 'AI-generated narration and visuals' bottom right. Holds still ≥ 3 s.
+- voiceover: "That's reelplanning: a plan you watch and answer, a build you accept or flag, and a record that only grows. To see it on real work, open any plan video in the library."
+- duration: 13.24s
+- transition_in: crossfade
+- status: animated
+- src: compositions/frames/35-end.html
+- type: cta
+- persuasion: The whole series as a list + where to go next
+- beat: Resolve
+- blueprint: compose
+- spec_section: Purpose
+- focal: the five parts, done
+- roles: part list = foreground · hero = the pitch
+- sfx: none
+
+narrativeRole: reelplanning, in one picture.
+keyMessage: That's reelplanning:
+
+Scene 1 (0.0–0.8s): the list settles in.
+Scene 2 (0.8–end): the hero and the line land; held dead still.
diff --git a/.reelplanning/system.json b/.reelplanning/system.json
index 66e2ae2..af7e6e9 100644
--- a/.reelplanning/system.json
+++ b/.reelplanning/system.json
@@ -6,37 +6,43 @@
       "id": "skill",
       "name": "The plan-to-video skill",
       "role": "authoring",
-      "files": ["skills/plan-to-video/SKILL.md", "skills/plan-to-video/references/style-guide.md"]
+      "files": ["skills/plan-to-video/SKILL.md", "skills/plan-to-video/references/style-guide.md"],
+      "stage": { "x": 632, "y": 175, "w": 270, "h": 110 }
     },
     {
       "id": "cli",
       "name": "The reel CLI",
       "role": "tooling",
-      "files": ["scripts/reel.mjs"]
+      "files": ["scripts/reel.mjs"],
+      "stage": { "x": 1260, "y": 175, "w": 270, "h": 110 }
     },
     {
       "id": "resolve",
       "name": "resolve-plan",
       "role": "pipeline-step",
-      "files": ["scripts/resolve-plan.mjs"]
+      "files": ["scripts/resolve-plan.mjs"],
+      "stage": { "x": 946, "y": 175, "w": 270, "h": 110 }
     },
     {
       "id": "diff",
       "name": "plan-diff",
       "role": "pipeline-step",
-      "files": ["scripts/plan-diff.mjs"]
+      "files": ["scripts/plan-diff.mjs"],
+      "stage": { "x": 1260, "y": 405, "w": 270, "h": 110 }
     },
     {
       "id": "finish",
       "name": "finish-project",
       "role": "pipeline-step",
-      "files": ["scripts/finish-project.sh"]
+      "files": ["scripts/finish-project.sh"],
+      "stage": { "x": 1574, "y": 405, "w": 270, "h": 110 }
     },
     {
       "id": "revise",
       "name": "The revise step",
       "role": "authoring",
-      "files": []
+      "files": [],
+      "stage": { "x": 1574, "y": 175, "w": 270, "h": 110 }
     },
     {
       "id": "action",
@@ -48,31 +54,36 @@
       "id": "player",
       "name": "The review player",
       "role": "artifact",
-      "files": ["packages/player/reelplanning-player.js"]
+      "files": ["packages/player/reelplanning-player.js"],
+      "stage": { "x": 946, "y": 405, "w": 270, "h": 110 }
     },
     {
       "id": "implement-step",
       "name": "The implement step",
       "role": "authoring",
-      "files": []
+      "files": ["skills/plan-to-video/SKILL.md", "scripts/code-check.mjs"],
+      "stage": { "x": 632, "y": 405, "w": 270, "h": 110 }
     },
     {
       "id": "resolve-walk",
       "name": "resolve-walkthrough",
       "role": "pipeline-step",
-      "files": ["scripts/resolve-walkthrough.mjs"]
+      "files": ["scripts/resolve-walkthrough.mjs"],
+      "stage": { "x": 946, "y": 625, "w": 270, "h": 130 }
     },
     {
       "id": "fix-step",
       "name": "The walkthrough fix step",
       "role": "authoring",
-      "files": []
+      "files": ["scripts/walkthrough-scope.mjs", "skills/plan-to-video/SKILL.md"],
+      "stage": { "x": 1574, "y": 625, "w": 270, "h": 130 }
     },
     {
       "id": "system-video",
       "name": "The system video",
       "role": "artifact",
-      "files": []
+      "files": [".reelplanning/system-video/", "scripts/spec-diff.mjs"],
+      "stage": { "x": 632, "y": 625, "w": 270, "h": 130 }
     }
   ],
   "edges": [
@@ -116,5 +127,9 @@
       ]
     }
   ],
-  "stage": { "rail": { "x": 80, "y": 150, "w": 500, "slotH": 90, "gap": 20, "slots": 6 } }
+  "stage": {
+    "kind": "dataflow",
+    "why": "reelplanning is two loops that hand files to each other, and only a graph with return edges can show a loop. The edges are real hand-offs, each carrying a file to the next part (annotations.json, plan.resolved.md, walkthrough.md, walkthrough.resolved.md). The review loop runs across the top and middle; the build loop along the bottom, rejoining it at the review player and finish-project. The push-triggered workflow sits above the revise step it starts, dashed, because it runs in CI rather than on the reviewer's machine. The plan-to-video skill makes every video but hands no file along an edge, so it stands apart.",
+    "rail": { "x": 80, "y": 150, "w": 500, "slotH": 90, "gap": 20, "slots": 6 }
+  }
 }
diff --git a/scripts/code-check.mjs b/scripts/code-check.mjs
new file mode 100644
index 0000000..c9163cf
--- /dev/null
+++ b/scripts/code-check.mjs
@@ -0,0 +1,140 @@
+#!/usr/bin/env node
+// The second agent's code check (close-the-lifecycle, step 3; D-001). Before a walkthrough video is
+// built, an agent that did NOT write the code reads the diff against the plan and the decision
+// ledger, and answers three questions:
+//   1. Does every plan step have a change that carries it out?
+//   2. Does every decision in force hold in the code?
+//   3. Is there anything in the diff the autonomy log does not explain?
+//
+// This script does not do the checking. It writes the checker's whole world into one file,
+// <plan-dir>/code-check/brief.md: the resolved plan, the decisions that apply, the autonomy log, and
+// the diff. The checker starts with a fresh context holding only that brief, never the implementer's
+// conversation, so it cannot inherit the implementer's reasons for drifting. It writes its answers to
+// <plan-dir>/code-check/findings.md, in the fixed shape below, which `reel audit` reads.
+//
+// usage: reelplanning code-check <plan-dir> --base <ref> [--head <ref>] [-- <path>…]
+//        reelplanning code-check <plan-dir> --prompt     print the prompt that starts the checker
+import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
+import { join, resolve, basename, dirname, relative } from "node:path";
+import { execFileSync } from "node:child_process";
+
+const argv = process.argv.slice(2);
+const dd = argv.indexOf("--");
+const paths = dd >= 0 ? argv.slice(dd + 1) : [];
+const args = dd >= 0 ? argv.slice(0, dd) : argv;
+const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };
+const die = (m) => { console.error(`✗ code-check: ${m}`); process.exit(1); };
+const pd = resolve(args[0] && !args[0].startsWith("--") ? args[0] : die("usage: code-check <plan-dir> --base <ref> [--head <ref>] [-- <path>…]"));
+if (!existsSync(join(pd, "plan.md"))) die(`${pd} has no plan.md`);
+const outDir = join(pd, "code-check"), briefPath = join(outDir, "brief.md"), findingsPath = join(outDir, "findings.md");
+
+const git = (...a) => execFileSync("git", ["-C", pd, ...a], { encoding: "utf8", maxBuffer: 64 << 20 });
+const repo = git("rev-parse", "--show-toplevel").trim();
+const rel = (p) => relative(repo, p) || ".";
+
+if (args.includes("--prompt")) {
+  if (!existsSync(briefPath)) die(`no brief yet: run code-check ${rel(pd)} --base <ref> first`);
+  console.log(`You are the code checker for a reelplanning plan. You did not write this code, and you have no
+access to the conversation of the agent that did. Everything you need is in one file:
+
+  ${rel(briefPath)}
+
+Read it in full. Read any file in the repository you need to confirm a finding, but do not edit code,
+the plan or walkthrough.md. Write your answers to ${rel(findingsPath)}, in exactly the shape the brief gives,
+then reply with the counts (✓ and ✗ per section) and the path.`);
+  process.exit(0);
+}
+
+const base = flag("base") || die("--base <ref> is required: the commit the implementation started from");
+const head = flag("head", "HEAD");
+const read = (p) => readFileSync(p, "utf8");
+const planText = existsSync(join(pd, "plan.resolved.md")) ? read(join(pd, "plan.resolved.md")) : read(join(pd, "plan.md"));
+const planName = basename(pd);
+
+// the ledger: this plan's own decisions, and the ones it cites as in force
+let rp = pd; while (rp !== dirname(rp) && basename(rp) !== ".reelplanning") rp = dirname(rp);
+const ledger = existsSync(join(rp, "decisions.json")) ? JSON.parse(read(join(rp, "decisions.json"))).decisions || [] : [];
+const cited = new Set([...(read(join(pd, "plan.md")).split(/^## Decisions in force/m)[1] || "").split(/^## /m)[0].matchAll(/\bD-\d{3}\b/g)].map((m) => m[0]));
+const applies = ledger.filter((d) => d.status === "active" && d.kind !== "autonomy" && (d.plan === planName || cited.has(d.id)));
+
+// the autonomy log, as the implementer wrote it: the calls it says it made on its own
+const wt = existsSync(join(pd, "walkthrough.md")) ? read(join(pd, "walkthrough.md")) : "";
+const log = wt.split("\n").filter((l) => /^\|\s*A\d+\b/.test(l));
+
+const range = `${base}..${head}`;
+const stat = git("diff", "--stat", range, "--", ...paths).trim();
+let diff = git("diff", "--unified=3", range, "--", ...paths);
+const LIMIT = 400_000;   // a diff bigger than this is summarised; the checker reads the rest from git
+const cut = diff.length > LIMIT;
+if (cut) diff = diff.slice(0, LIMIT);
+const commits = git("log", "--oneline", range, "--", ...paths).trim();
+
+const brief = `# Code check brief: ${planName}
+
+You are checking that an implementation follows its plan. You did not write it. Answer three questions,
+every answer tied to a file (and a line where you can), and write them to \`${rel(findingsPath)}\`.
+
+1. **Steps.** Does every plan step have a change that carries it out?
+2. **Decisions.** Does every decision below hold in the code?
+3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
+   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
+   reviewer could reasonably have made the other way (a default, an error code, a library, a data
+   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
+   and the order of edits do not.
+
+Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
+in one sentence.
+
+## The shape of findings.md (keep it exactly)
+
+\`\`\`
+# Code check: ${planName}
+
+## Steps
+- Step 1 — ✓ carried by \`path/to/file\`, \`other/file\`
+- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is \`file\`
+
+## Decisions
+- D-004 — ✓ holds: \`path/file.mjs\` (the summary frame is written in resumeAt)
+- D-005 — ✗ broken: \`path/file.js:120\` counts a record jump as a rewind
+
+## Unexplained
+- \`path/file.js\` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
+\`\`\`
+
+Write "- none" under a section with nothing to report. Every ✗ line must start with its key: \`Step N\`,
+a decision id, or a backticked path.
+
+## Commits (${range}${paths.length ? `, limited to ${paths.join(" ")}` : ""})
+
+\`\`\`
+${commits || "(none)"}
+\`\`\`
+
+## The plan, as approved
+
+${planText.trim()}
+
+## The decisions that apply
+
+${applies.length ? applies.map((d) => `- **${d.id}** (step ${d.step ?? "?"}) ${d.question} → **${d.chosen}**${d.note ? `\n  - note: ${d.note}` : ""}`).join("\n") : "- none"}
+
+## The autonomy log (the implementer's own calls)
+
+${log.length ? `| id | step | chose | instead of | why | check |\n|---|---|---|---|---|---|\n${log.join("\n")}` : "_No walkthrough.md yet, or no rows in it._"}
+
+## The diff
+
+\`\`\`
+${stat}
+\`\`\`
+
+${cut ? `_The diff is ${Math.round(diff.length / 1000)}k+ characters; the first ${LIMIT / 1000}k are below. Read the rest with \`git diff ${range} -- <path>\`._\n\n` : ""}\`\`\`diff
+${diff}
+\`\`\`
+`;
+mkdirSync(outDir, { recursive: true });
+writeFileSync(briefPath, brief);
+const files = stat.split("\n").length - 1;
+console.log(`✓ ${rel(briefPath)}: ${applies.length} decision(s), ${log.length} autonomy row(s), ${files} file(s) changed in ${range}${cut ? " (diff summarised)" : ""}`);
+console.log(`next: start a FRESH agent (not the one that implemented) with the prompt from \`code-check ${rel(pd)} --prompt\`; it writes ${rel(findingsPath)}`);
diff --git a/scripts/frame-lint.mjs b/scripts/frame-lint.mjs
index 3a8bf51..b5b4a20 100644
--- a/scripts/frame-lint.mjs
+++ b/scripts/frame-lint.mjs
@@ -2,12 +2,23 @@
 // Static checks for the invariants this rebuild keeps breaking. Cheap enough to run per frame as
 // each one lands, instead of finding out at render time.
 //
-// usage: node scripts/frame-lint.mjs videos/<project>/compositions/frames/*.html
-import { readFileSync } from "node:fs";
-import { basename } from "node:path";
+// usage: reelplanning frame-lint <project-dir>/compositions/frames/*.html
+import { readFileSync, existsSync } from "node:fs";
+import { basename, dirname, join, resolve } from "node:path";
 
 const expectStage = process.argv.includes("--expect-stage") ? process.argv[process.argv.indexOf("--expect-stage") + 1] : null;
 let bad = 0, noted = 0;
+// id → glossary name, from the nearest .reelplanning/glossary.md above a frame (cached per file)
+const glossCache = new Map();
+function glossaryFor(file) {
+  for (let d = dirname(resolve(file)), i = 0; i < 10 && d !== dirname(d); i++, d = dirname(d)) {
+    const g = basename(d) === ".reelplanning" ? join(d, "glossary.md") : join(d, ".reelplanning", "glossary.md");
+    if (!existsSync(g)) continue;
+    if (!glossCache.has(g)) glossCache.set(g, new Map([...readFileSync(g, "utf8").matchAll(/^\| ([^|]+?) \| `([^`]+)` \|/gm)].map((m) => [m[2], m[1].trim()])));
+    return glossCache.get(g);
+  }
+  return null;
+}
 const argv = process.argv.slice(2);
 const files = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1] === "--expect-stage"));
 for (const f of files) {
@@ -64,6 +75,27 @@ for (const f of files) {
     for (const m of r[2].matchAll(/font:[^;]*?(\d+)px[^;]*?(?:JetBrains|Mono)/g)) if (+m[1] < 26) findings.push(`mono at ${m[1]}px in ${r[1].trim().slice(0, 40)}`);
   }
 
+  // 4b. density (richer-review step 5): a newcomer cannot follow a diagram of every part at once.
+  //     At most six distinct parts on one frame. A beat whose job IS the whole system (the system
+  //     video's cast, a resolved map) says so with data-density="full" on its root and is exempt.
+  const parts = new Set([...body.matchAll(/data-plan-component="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== "page"));
+  if (parts.size > 6 && !/data-density="full"/.test(body)) findings.push(`${parts.size} parts on one frame (at most 6; mark a whole-system beat data-density="full")`);
+
+  // 4c. names a newcomer knows (richer-review step 5): a part's label on screen is its glossary name,
+  //     not a script or file name. Checked against the nearest .reelplanning/glossary.md; a label that
+  //     is neither the name nor a short form of it is a note, since a mock may label things its own way.
+  const gloss = glossaryFor(f);
+  //     A mock of a file or page the part produces (class *page*, *mock*, *file*, *doc*) is labelled
+  //     with that file's name on purpose, and is not a node: it is left alone.
+  if (gloss) for (const m of body.matchAll(/data-plan-component="([^"]+)"[^>]*>(?:\s*<(?!\/)[^>]*>)*\s*([^<]{2,60}?)\s*</g)) {
+    const name = gloss.get(m[1]); if (!name) continue;
+    const tag = body.slice(body.lastIndexOf("<", m.index), m.index + m[0].indexOf(">"));
+    if (/class="[^"]*(page|mock|file|doc)[^"]*"/.test(tag)) continue;
+    const n = (x) => x.toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
+    if (!n(name).includes(n(m[2])) && !n(m[2]).includes(n(name))) notes.push(`"${m[2].trim()}" labels ${m[1]}, whose glossary name is "${name}"`);
+    if (/\.(mjs|js|sh|json|md)\b/.test(m[2])) findings.push(`a part labelled with a file name ("${m[2].trim()}"); use its glossary name, "${name}"`);
+  }
+
   // 5. nothing in the caption band
   for (const m of body.matchAll(/top:\s*(\d{3,4})px/g)) if (+m[1] >= 900) findings.push(`element at y ${m[1]} (caption band starts at 900)`);
 
diff --git a/scripts/reel.mjs b/scripts/reel.mjs
index 88702d6..0c277d4 100644
--- a/scripts/reel.mjs
+++ b/scripts/reel.mjs
@@ -5,9 +5,10 @@
 //   stage <plan-dir>                                         write video/.hyperframes/stage-snippet.html from system.json + theme + the plan's steps
 //   check <plan-dir>                                         decision guard + component names (exit 1 on a failure)
 //   record <plan-dir> [annotations.json]                     append the review's decisions to the ledger, write plan.resolved.md
-//   status <repo>                                            one table of plans and stages
-import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, cpSync } from "node:fs";
-import { resolve, join, dirname, basename } from "node:path";
+//   audit <plan-dir>                                         walkthrough.md covers every plan step and decision, and says where to look (exit 1 on a failure)
+//   status <repo>                                            one table of plans and stages, and whether the system video is behind the spec
+import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, cpSync, statSync } from "node:fs";
+import { resolve, join, dirname, basename, relative } from "node:path";
 import { fileURLToPath } from "node:url";
 import { execFileSync } from "node:child_process";
 
@@ -164,16 +165,25 @@ function check() {
   const cited = new Set([...plan.inForce, ...plan.supersedes]);
   for (const d of active) {
     const onTouched = (d.components || []).some((c) => touched.includes(c));
-    if (onTouched && !cited.has(d.id)) fails.push(`${d.id} (${d.question} → ${d.chosen}) is on a component this plan touches [${(d.components || []).filter((c) => touched.includes(c)).join(", ")}] but is neither in "Decisions in force" nor in "Supersedes"`);
+    // An accepted agent call is a decision, but a small one: a plan that touches its component is told
+    // about it, not blocked by it. The re-ask guard below still applies in full.
+    if (onTouched && !cited.has(d.id) && d.kind === "autonomy") warns.push(`${d.id} (${d.chosen}) — an accepted agent call on a component this plan touches [${(d.components || []).filter((c) => touched.includes(c)).join(", ")}]; cite it if the plan keeps it, supersede it if not`);
+    else if (onTouched && !cited.has(d.id)) fails.push(`${d.id} (${d.question} → ${d.chosen}) is on a component this plan touches [${(d.components || []).filter((c) => touched.includes(c)).join(", ")}] but is neither in "Decisions in force" nor in "Supersedes"`);
   }
   for (const id of cited) if (!ledger.find((d) => d.id === id)) fails.push(`${id} is cited but not in the ledger`);
   for (const id of plan.supersedes) { const d = ledger.find((x) => x.id === id); if (d && d.status !== "active") fails.push(`${id} is already superseded by ${d.supersededBy}`); }
   // 3. open questions that re-ask a decided question (keyword overlap with an active decision's question + chosen) and do not supersede it
   for (const q of plan.questions) for (const d of active) {
     if (plan.supersedes.includes(d.id)) continue;
-    const o = overlap(words(q), new Set([...words(d.question), ...words(d.chosen)]));
+    // An own-words answer is a paragraph: its common words ("video", "want") overlap almost any new
+    // question. Match on the question it answered, and on the chosen option only when it is a label.
+    const label = d.chosenId !== "own" && String(d.chosen).split(/\s+/).length <= 8;
+    const o = overlap(words(q), new Set([...words(d.question), ...(label ? words(d.chosen) : [])]));
     if (o >= 2) fails.push(`open question "${q}" re-asks ${d.id} ("${d.question}" → ${d.chosen}); cite it as in force and drop the question, or list it under Supersedes with the reason`);
   }
+  // As many questions as the plan needs, one per part of about a minute (richer-review step 3). Past
+  // six, the plan is probably not ready to review: say so, but do not block it.
+  if (plan.questions.length > 6) warns.push(`${plan.questions.length} open questions: a plan this open may not be ready to review (one question per part means ${plan.questions.length} parts)`);
   for (const f of fails) console.log(`✗ ${f}`); for (const w of warns) console.log(`△ ${w}`);
   console.log(`${fails.length ? "✗" : "✓"} ${basename(pd)}: ${plan.steps.length} steps, touches [${touched.join(", ")}], ${plan.inForce.length} in force, ${plan.supersedes.length} superseded, ${fails.length} failure(s), ${warns.length} warning(s)`);
   process.exit(fails.length ? 1 : 0);
@@ -189,22 +199,48 @@ function record() {
   const planName = basename(pd); let n = ledger.decisions.length; const added = []; const date = flag("date", (ann.exportedAt || "").slice(0, 10) || today());
   // supersede first: the plan said so, the review confirmed by approving
   for (const id of plan.supersedes) { const d = ledger.decisions.find((x) => x.id === id && x.status === "active"); if (d) { d.status = "superseded"; d.supersededBy = `D-${String(n + 1).padStart(3, "0")}`; d.supersededOn = date; } }
+  const unclear = [];
   for (const made of ann.decisions || []) {
-    if (ledger.decisions.some((d) => d.plan === planName && d.questionId === made.id)) continue; // already recorded
+    // "Explain this more" is not an answer: nothing enters the ledger, and the question stays open
+    if (made.option === "unclear") { unclear.push(made); continue; }
     const q = map?.decisions?.find((d) => d.id === made.id);
+    // already recorded: the same question, not just the same id. A revise can ask a new question under
+    // an old id (the question that was q2 becomes q1 once the others are decided).
+    const qText = q?.question || made.question || made.id;
+    if (ledger.decisions.some((d) => d.plan === planName && d.questionId === made.id && (d.question === qText || !q))) continue;
     const step = plan.steps.find((s) => s.n === (made.planStep ?? q?.planStep));
     const stepComps = step ? componentsIn(`${step.title}\n${plan.stepBodies[step.n] || ""}`, sys) : [];
     const id = `D-${String(++n).padStart(3, "0")}`;
     const entry = { id, date, plan: planName, step: step?.n ?? null, stepTitle: step?.title ?? null, questionId: made.id, question: q?.question || made.id,
       options: (q?.options || []).map((o) => ({ id: o.id, label: o.label, why: o.why, recommended: !!o.recommended })),
       chosen: made.label, chosenId: made.option, recommended: !!made.recommended, why: q?.options?.find((o) => o.id === made.option)?.why || "",
+      ...(made.option === "multi" ? { chosenIds: made.options || [] } : {}),   // pick all that apply: the set, in order
+      ...((made.note || "").trim() ? { note: made.note.trim() } : {}),          // the reviewer's note on the answer
       components: stepComps.length ? stepComps : touched, status: "active", supersedes: plan.supersedes.filter((s) => ledger.decisions.find((x) => x.id === s)?.supersededBy === id) };
     ledger.decisions.push(entry); added.push(entry);
   }
+  // A walkthrough review's accepted calls are decisions too: the reviewer ratified a choice the plan
+  // never made, and the next plan must not quietly undo it. walkthrough-scope sorts the verdicts.
+  const wtScope = join(pd, "walkthrough-scope.json");
+  if ((ann.autonomy || []).length && existsSync(join(pd, "walkthrough.md"))) {
+    execFileSync("node", [join(ROOT, "scripts", "walkthrough-scope.mjs"), pd, annPath], { stdio: "inherit" });
+    for (const c of json(wtScope).accepted) {
+      const qid = `autonomy-${c.id.toLowerCase()}`;
+      if (ledger.decisions.some((d) => d.plan === planName && d.questionId === qid)) continue;
+      const step = plan.steps.find((s) => s.n === c.step);
+      const stepComps = step ? componentsIn(`${step.title}\n${plan.stepBodies[step.n] || ""}`, sys) : [];
+      const id = `D-${String(++n).padStart(3, "0")}`;
+      const entry = { id, date, plan: planName, step: step?.n ?? c.step, stepTitle: step?.title ?? null, questionId: qid, kind: "autonomy",
+        question: `${c.chose}, or ${c.insteadOf || "something else"}? (the agent's own call ${c.id}, accepted in the walkthrough)`,
+        options: [{ id: "chose", label: c.chose, why: c.why, recommended: true }, ...(c.insteadOf ? [{ id: "instead", label: c.insteadOf, why: "", recommended: false }] : [])],
+        chosen: c.chose, chosenId: "chose", recommended: true, why: c.why, components: stepComps.length ? stepComps : touched, status: "active", supersedes: [] };
+      ledger.decisions.push(entry); added.push(entry);
+    }
+  }
   writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
   // the human-readable ledger: regenerate the table from the data (append-only is enforced on the data)
   const rows = ledger.decisions.map((d) => `| ${d.id} | ${d.date} | ${d.plan} | ${d.step ?? ""} | ${d.question} | **${d.chosen}**${d.recommended ? "" : " (not the recommendation)"} | ${d.status}${d.supersededBy ? ` by ${d.supersededBy}` : ""}${d.supersedes?.length ? `, supersedes ${d.supersedes.join(", ")}` : ""} |`);
-  const details = ledger.decisions.map((d) => `### ${d.id} — ${d.question}\n\n- **Chosen:** ${d.chosen}${d.why ? ` — ${d.why}` : ""}\n- **Not chosen:** ${d.options.filter((o) => o.id !== d.chosenId).map((o) => `${o.label}${o.why ? ` (${o.why})` : ""}`).join("; ") || "—"}\n- **Where:** ${d.plan}, step ${d.step ?? "?"}${d.stepTitle ? ` (${d.stepTitle})` : ""}; components: ${d.components.join(", ") || "—"}\n- **Status:** ${d.status}${d.supersededBy ? `, superseded by ${d.supersededBy} on ${d.supersededOn}` : ""}${d.supersedes?.length ? `; supersedes ${d.supersedes.join(", ")}` : ""}\n`);
+  const details = ledger.decisions.map((d) => `### ${d.id} — ${d.question}\n\n- **Chosen:** ${d.chosen}${d.why ? ` — ${d.why}` : ""}\n- **Not chosen:** ${d.options.filter((o) => o.id !== d.chosenId && !(d.chosenIds || []).includes(o.id)).map((o) => `${o.label}${o.why ? ` (${o.why})` : ""}`).join("; ") || "—"}${d.note ? `\n- **Note:** ${d.note}` : ""}\n- **Where:** ${d.plan}, step ${d.step ?? "?"}${d.stepTitle ? ` (${d.stepTitle})` : ""}; components: ${d.components.join(", ") || "—"}\n- **Status:** ${d.status}${d.supersededBy ? `, superseded by ${d.supersededBy} on ${d.supersededOn}` : ""}${d.supersedes?.length ? `; supersedes ${d.supersedes.join(", ")}` : ""}\n`);
   const head = read(join(TPL, "decisions.md")).trim();
   writeFileSync(join(rp, "decisions.md"), `${head}\n${rows.join("\n")}\n\n${details.join("\n")}`);
   // Which review this is. A plan review answers the plan's open questions; a walkthrough review
@@ -232,6 +268,46 @@ function record() {
     console.log(`△ this review judged ${(ann.autonomy || []).length} call(s) and answered ${(ann.quizzes || []).length} check(s), but ${wtPath} does not exist — nothing to resolve them against`);
   }
   console.log(`✓ ledger: +${added.length} (${added.map((d) => `${d.id} ${d.chosen}`).join("; ") || "nothing new"}), ${ledger.decisions.length} total`);
+  if (unclear.length) console.log(`△ asked to explain more, not decided: ${unclear.map((d) => d.id).join(", ")} — the revise explains ${unclear.length === 1 ? "it" : "them"} with examples and asks again`);
+}
+
+// The floor under the code check (close-the-lifecycle, step 3): before a walkthrough video is built,
+// its report must account for the whole plan. Deterministic on purpose — an agent reviewing the diff
+// catches drift; this catches a report that simply leaves things out.
+function audit() {
+  const pd = resolve(argv[1] || die("audit <plan-dir>")); const rp = rpDir(pd);
+  const wtPath = join(pd, "walkthrough.md"); if (!existsSync(wtPath)) die(`${wtPath} not found (the implement step writes it)`);
+  const wt = read(wtPath); const plan = parsePlan(read(join(pd, "plan.md"))); const planName = basename(pd);
+  const ledger = json(join(rp, "decisions.json")).decisions || [];
+  const fails = [];
+  const stepSection = (n) => { const m = wt.match(new RegExp(`^### Step ${n}\\b[^\\n]*\\n([\\s\\S]*?)(?=^#{2,3} |(?![\\s\\S]))`, "m")); return m ? m[1] : null; };
+  const namesFile = (s) => /`[^`\s]*(\/|\.[a-z0-9]{1,5}\b)[^`]*`/i.test(s || "");
+  // 1. every plan step has an entry
+  for (const s of plan.steps) if (stepSection(s.n) == null) fails.push(`step ${s.n} (${s.title}) has no "### Step ${s.n}" entry in walkthrough.md`);
+  // 2. every decision this plan made, and every one it cites, is said to hold — and this plan's own
+  //    decisions point at the code that carries them
+  const own = ledger.filter((d) => d.plan === planName && d.status === "active" && d.kind !== "autonomy");
+  const cited = plan.inForce.map((id) => ledger.find((d) => d.id === id)).filter(Boolean);
+  // said = the id appears, or every word of the chosen option appears on one line ("server manifest id" says "Server id")
+  const said = (d) => { const w = String(d.chosen).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return new RegExp(`\\b${d.id}\\b`).test(wt) || wt.toLowerCase().split("\n").some((l) => w.every((x) => l.includes(x))); };
+  for (const d of [...own, ...cited.filter((c) => !own.includes(c))]) if (!said(d)) fails.push(`${d.id} (${d.question} → ${d.chosen}) is never mentioned: say whether the code holds to it`);
+  for (const d of own) if (d.step != null && stepSection(d.step) != null && !namesFile(stepSection(d.step))) fails.push(`${d.id} (${d.chosen}) is on step ${d.step}, but that step's entry names no file to check it in`);
+  // 3. every call the agent made on its own says where to look
+  for (const line of wt.split("\n")) { const c = line.split("|").slice(1, -1).map((x) => x.trim()); if (c.length >= 6 && /^A\d+$/i.test(c[0]) && !c[5]) fails.push(`${c[0]} (${c[2]}) has no "check" — where should the reviewer look?`); }
+  // 4. the second agent's code check (D-001): every ✗ it raised is answered in walkthrough.md's
+  //    "## Code check" section — as a deviation, a new autonomy row, or why it is not one. Findings are
+  //    reported, never fixed quietly, and never dropped.
+  const findingsPath = join(pd, "code-check", "findings.md"); const warns = [];
+  if (!existsSync(findingsPath)) warns.push(`no code check yet: \`reelplanning code-check ${basename(pd)} --base <ref>\`, then a fresh agent writes code-check/findings.md`);
+  else {
+    const cc = (wt.match(/^## Code check\b[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m) || [])[1];
+    const keys = read(findingsPath).split("\n").filter((l) => /^- .*✗/.test(l)).map((l) => (l.match(/^- (Step \d+|D-\d{3}|`[^`]+`)/) || [])[1]).filter(Boolean);
+    for (const k of keys) if (!(cc || "").includes(k)) fails.push(`code check ✗ ${k} is not answered in walkthrough.md's "## Code check" section${cc == null ? " (there is none yet)" : ""}`);
+  }
+  for (const f of fails) console.log(`✗ ${f}`);
+  for (const w of warns) console.log(`△ ${w}`);
+  console.log(`${fails.length ? "✗" : "✓"} ${planName}: ${plan.steps.length} step(s), ${own.length} own decision(s), ${cited.length} cited, ${fails.length} failure(s)`);
+  process.exit(fails.length ? 1 : 0);
 }
 
 function status() {
@@ -240,6 +316,14 @@ function status() {
   console.log(`| plan | plan.md | video | decided | walkthrough | walkthrough video | decisions |\n|---|---|---|---|---|---|---|`);
   for (const p of plans) { const d = join(rp, "plans", p); const has = (f) => existsSync(join(d, f)) ? "✓" : "·"; console.log(`| ${p} | ${has("plan.md")} | ${has("video/index.html")} | ${has("plan.resolved.md")} | ${has("walkthrough.md")} | ${has("walkthrough-video/index.html")} | ${ledger.filter((x) => x.plan === p).map((x) => x.id).join(" ") || "·"} |`); }
   console.log(`\n${ledger.filter((d) => d.status === "active").length} active decision(s), ${ledger.length} total; ${json(join(rp, "system.json")).components?.length || 0} component(s)`);
+  // The system video is made from spec.md, system.json and glossary.md. When any of them moved on
+  // since it was last built, it describes a system that no longer exists — and new people trust it.
+  const sv = join(rp, "system-video");
+  if (!existsSync(join(sv, "index.html"))) { console.log("· no system video yet"); return; }
+  // last commit time; an uncommitted edit counts as now
+  const when = (p) => { try { if (execFileSync("git", ["-C", rp, "status", "--porcelain", "--", p], { encoding: "utf8" }).trim()) return Date.now() / 1000; return Number(execFileSync("git", ["-C", rp, "log", "-1", "--format=%ct", "--", p], { encoding: "utf8" }).trim()) || statSync(p).mtimeMs / 1000; } catch { return statSync(p).mtimeMs / 1000; } };
+  const built = when(sv); const newer = ["spec.md", "system.json", "glossary.md"].filter((f) => existsSync(join(rp, f)) && when(join(rp, f)) > built);
+  console.log(newer.length ? `△ the system video is behind ${newer.join(", ")} — \`reelplanning spec-diff ${relative(process.cwd(), rp) || "."}\` names the scenes to rebuild` : "✓ the system video is current");
 }
 
-({ init, "new-plan": newPlan, stage, check, record, status }[cmd] || (() => die("usage: reel init|new-plan|stage|check|record|status …")))();
+({ init, "new-plan": newPlan, stage, check, record, audit, status }[cmd] || (() => die("usage: reel init|new-plan|stage|check|record|audit|status …")))();
diff --git a/scripts/resolve-walkthrough.mjs b/scripts/resolve-walkthrough.mjs
index 18ca1a8..3f43309 100644
--- a/scripts/resolve-walkthrough.mjs
+++ b/scripts/resolve-walkthrough.mjs
@@ -11,11 +11,11 @@
 // A wrong quick check is not a mark against the reviewer. It says the walkthrough did not make
 // that point land, which is a fact about the walkthrough, so it is reported as one.
 //
-// usage: node scripts/resolve-walkthrough.mjs walkthrough.md annotations.json [plan-map.json]
+// usage: reelplanning resolve-walkthrough walkthrough.md annotations.json [plan-map.json]
 import { readFileSync, writeFileSync, existsSync } from "node:fs";
 
 const [wtPath, annPath, mapPath] = process.argv.slice(2);
-if (!wtPath || !annPath) { console.error("usage: node scripts/resolve-walkthrough.mjs walkthrough.md annotations.json [plan-map.json]"); process.exit(1); }
+if (!wtPath || !annPath) { console.error("usage: reelplanning resolve-walkthrough walkthrough.md annotations.json [plan-map.json]"); process.exit(1); }
 if (!existsSync(wtPath)) { console.error(`✗ ${wtPath} not found`); process.exit(1); }
 if (!existsSync(annPath)) { console.error(`✗ ${annPath} not found (export it from the review player)`); process.exit(1); }
 const wt = readFileSync(wtPath, "utf8");
@@ -32,7 +32,7 @@ let out = wt;
 // the table reads as settled rather than as a list of things still to look at.
 for (const v of verdicts) {
   const id = String(v.id).toUpperCase();
-  const tag = v.verdict === "flag" ? "🚩 **flagged**" : "✅ accepted";
+  const tag = v.verdict === "flag" ? "🚩 **flagged**" : v.verdict === "own" ? "✍️ **changed**" : "✅ accepted";
   out = out.replace(new RegExp(`^(\\| ${id} \\|)`, "mi"), `| ${id} ${tag} |`);
 }
 
@@ -41,15 +41,17 @@ L.push("", "## Verdicts on the agent's own calls", "");
 if (!verdicts.length) L.push("_None recorded — the walkthrough video had no autonomy beats, or none were reached._");
 for (const v of verdicts) {
   const d = defA[String(v.id).toLowerCase()] || {};
-  const head = v.verdict === "flag" ? "🚩 **FLAGGED**" : "✅ **Accepted**";
+  // "own": the reviewer answered in their own words, a change to make, never an accept
+  const head = v.verdict === "flag" ? "🚩 **FLAGGED**" : v.verdict === "own" ? "✍️ **CHANGED**" : "✅ **Accepted**";
   L.push(`- **${String(v.id).toUpperCase()}** (step ${v.planStep ?? d.planStep ?? "?"}) — ${head}: ${v.chose || d.chose || ""}`);
+  if (v.verdict === "own" && v.own) L.push(`  - **the reviewer's answer:** ${v.own}`);
   if (d.insteadOf) L.push(`  - instead of: ${d.insteadOf}`);
   if (d.why) L.push(`  - the agent's reason: ${d.why}`);
   if (d.check) L.push(`  - where to check: \`${d.check}\``);
 }
-const flagged = verdicts.filter((v) => v.verdict === "flag");
+const flagged = verdicts.filter((v) => v.verdict === "flag" || v.verdict === "own");
 if (flagged.length) {
-  L.push("", `**${flagged.length} call${flagged.length === 1 ? "" : "s"} flagged — these are the ones to act on:** ${flagged.map((v) => String(v.id).toUpperCase()).join(", ")}`);
+  L.push("", `**${flagged.length} call${flagged.length === 1 ? "" : "s"} flagged or changed — these are the ones to act on:** ${flagged.map((v) => String(v.id).toUpperCase()).join(", ")}`);
 }
 
 L.push("", "## Quick checks", "");
diff --git a/scripts/revise-scope.mjs b/scripts/revise-scope.mjs
index 56e96c3..fd13a75 100644
--- a/scripts/revise-scope.mjs
+++ b/scripts/revise-scope.mjs
@@ -6,14 +6,14 @@
 // own-words answer — all `kind: "note"` or otherwise, it doesn't matter which) is signal for a
 // rewrite, because it's the one place the plan doesn't already have the words for.
 //
-// usage: node scripts/revise-scope.mjs <plan-dir> [annotations.json]
+// usage: reelplanning revise-scope <plan-dir> [annotations.json]
 // writes <plan-dir>/revise-scope.json
 import { readFileSync, writeFileSync, existsSync } from "node:fs";
 import { resolve, join, relative } from "node:path";
-import { ROOT } from "./lib/env.mjs";
+import { repoRoot } from "./lib/env.mjs";
 
 const [planDirArg, annArg] = process.argv.slice(2);
-if (!planDirArg) { console.error("usage: node scripts/revise-scope.mjs <plan-dir> [annotations.json]"); process.exit(1); }
+if (!planDirArg) { console.error("usage: reelplanning revise-scope <plan-dir> [annotations.json]"); process.exit(1); }
 const planDir = resolve(planDirArg);
 const annPath = resolve(annArg || join(planDir, "annotations.json"));
 if (!existsSync(annPath)) { console.error(`✗ ${annPath} not found (export it from the review player, or run reel record first)`); process.exit(1); }
@@ -29,11 +29,33 @@ for (const a of worded) {
   if (!byStep.has(step)) byStep.set(step, []);
   byStep.get(step).push(reason);
 }
+// A note on an answer is words too: it clarifies the pick, and may ask for the step to say more.
+for (const d of ann.decisions || []) {
+  if (!(d.note || "").trim() || d.planStep == null) continue;
+  if (!byStep.has(d.planStep)) byStep.set(d.planStep, []);
+  byStep.get(d.planStep).push({ id: `note-${d.id}`, kind: "answer-note", t: d.t ?? null, comment: d.note.trim(), about: `note on ${d.id}: ${d.label}`, component: null });
+}
+// "Explain this more" on a question: its step is rewritten to explain the question better, and it is asked again.
+for (const d of ann.decisions || []) {
+  if (d.option !== "unclear" || d.planStep == null) continue;
+  if (!byStep.has(d.planStep)) byStep.set(d.planStep, []);
+  byStep.get(d.planStep).push({ id: `unclear-${d.id}`, kind: "unclear", t: d.t ?? null, comment: (d.note || "").trim() || "The reviewer asked for this question to be explained more before answering.", about: `question ${d.id}: explain it with examples, then ask again`, component: null });
+}
+// Where the reviewer rewound or slowed down (D-005): signals, not comments, but the step still goes to
+// the revise, to be explained more plainly (richer-review step 6). One reason per step, with the moments.
+const moments = (ann.watch?.moments || []).filter((m) => m.planStep != null);
+const momentSteps = new Map();
+for (const m of moments) { if (!momentSteps.has(m.planStep)) momentSteps.set(m.planStep, []); momentSteps.get(m.planStep).push(m); }
+for (const [step, list] of momentSteps) {
+  if (!byStep.has(step)) byStep.set(step, []);
+  const what = list.map((m) => m.kind === "rewind" ? `went back to ${m.t}s${m.from != null ? ` from ${m.from}s` : ""}` : `slowed to ${m.rate}× at ${m.t}s`).join("; ");
+  byStep.get(step).push({ id: `hard-${step}`, kind: "hard-to-follow", t: list[0].t, comment: `Hard to follow: ${what}. Say this step more plainly; do not change what it decides.`, about: null, component: null });
+}
 const steps = [...byStep.entries()].sort((a, b) => a[0] - b[0]).map(([step, reasons]) => ({ step, reasons }));
 const wordedSteps = new Set(steps.map((s) => s.step));
 // a decision recorded for the ledger's sake, with nothing said about it — real signal for
 // `reel record`, no signal for a rewrite
-const decidedNoRewrite = (ann.decisions || []).filter((d) => d.option !== "own" && !wordedSteps.has(d.planStep))
+const decidedNoRewrite = (ann.decisions || []).filter((d) => d.option !== "own" && d.option !== "unclear" && !wordedSteps.has(d.planStep))
   .map((d) => ({ id: d.id, planStep: d.planStep, label: d.label }));
 
 // A plan directory collects two reviews over its life — the plan's and, after implementation, the
@@ -43,7 +65,7 @@ const isWalkthrough = (ann.autonomy || []).length || (ann.quizzes || []).length;
 // Paths go in relative to the repo root. This file is committed and read back by the revise step,
 // and an absolute path is a note about the machine that happened to run `reel record` — it means
 // nothing in anyone else's checkout, least of all a CI runner's.
-const rel = (p) => relative(ROOT, resolve(p)) || ".";
+const rel = (p) => relative(repoRoot(planDir), resolve(p)) || ".";
 const out = { generatedAt: new Date().toISOString(), of: isWalkthrough ? "walkthrough" : "plan", planDir: rel(planDir), annotations: rel(annPath), steps, componentOnly, decidedNoRewrite };
 const outPath = join(planDir, isWalkthrough ? "walkthrough-revise-scope.json" : "revise-scope.json");
 writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
diff --git a/scripts/spec-diff.mjs b/scripts/spec-diff.mjs
new file mode 100644
index 0000000..92b5f9c
--- /dev/null
+++ b/scripts/spec-diff.mjs
@@ -0,0 +1,74 @@
+#!/usr/bin/env node
+// What changed in a project's description of itself since the system video was last built, and so
+// which of its scenes to rebuild (close-the-lifecycle, step 6).
+//
+// The system video is made from three files: spec.md (prose), system.json (parts, edges,
+// pipelines, where each part sits on the stage) and glossary.md (the names). Each of its frames is
+// tagged with what it explains — `- spec_section: <## heading in spec.md>` and
+// `- components: <id>, <id>` in its STORYBOARD.md. This compares the three files against the commit
+// that last touched the system video and names the frames whose tags meet a change. Everything else
+// is left alone, which is what keeps a frame's id — and plan-diff's "only what changed" — intact.
+//
+// usage: reelplanning spec-diff [<repo or .reelplanning dir>] [--since <git rev>] [--json]
+//   --since   compare against this revision instead of the system video's last commit
+//   --json    print the full result as JSON
+import { readFileSync, existsSync } from "node:fs";
+import { resolve, join, dirname, basename, relative } from "node:path";
+import { execFileSync } from "node:child_process";
+
+const args = process.argv.slice(2);
+const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
+const pos = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--since");
+let rp = resolve(pos[0] || ".");
+for (let i = 0; i < 6 && basename(rp) !== ".reelplanning"; i++) { if (existsSync(join(rp, ".reelplanning"))) { rp = join(rp, ".reelplanning"); break; } rp = dirname(rp); }
+if (basename(rp) !== ".reelplanning") { console.error(`✗ no .reelplanning/ at or above ${pos[0] || "."}`); process.exit(1); }
+
+const git = (...a) => { try { return execFileSync("git", ["-C", rp, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
+const top = git("rev-parse", "--show-toplevel");
+const sv = join(rp, "system-video");
+const since = flag("since") || (top ? git("log", "-1", "--format=%H", "--", sv) : "");
+const then = (f) => (since && top ? (() => { try { return execFileSync("git", ["-C", top, "show", `${since}:${relative(top, join(rp, f))}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return ""; } })() : "");
+const now = (f) => (existsSync(join(rp, f)) ? readFileSync(join(rp, f), "utf8") : "");
+
+const diff = (a, b) => {
+  const out = { added: [], changed: [], removed: [] };
+  for (const k of Object.keys(b)) if (!(k in a)) out.added.push(k); else if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) out.changed.push(k);
+  for (const k of Object.keys(a)) if (!(k in b)) out.removed.push(k);
+  return out;
+};
+const sections = (md) => Object.fromEntries(md.split(/\n(?=## )/).filter((s) => s.startsWith("## ")).map((s) => [s.match(/^## (.+)$/m)[1].trim(), s.replace(/^## .+\n/, "").trim()]));
+const sys = (s) => { try { return JSON.parse(s || "{}"); } catch { return {}; } };
+const byId = (list) => Object.fromEntries((list || []).map((x) => [x.id, x]));
+const edges = (s) => Object.fromEntries((s.edges || []).map((e) => [`${e.from}→${e.to}`, e]));
+const glossary = (md) => Object.fromEntries(md.split("\n").map((l) => l.match(/^\|[^|]*\|\s*`([^`]+)`\s*\|/)).filter(Boolean).map((m) => [m[1], m.input.trim()]));
+
+const [s0, s1] = [sys(then("system.json")), sys(now("system.json"))];
+const r = {
+  since: since || null,
+  sections: diff(sections(then("spec.md")), sections(now("spec.md"))),
+  components: diff(byId(s0.components), byId(s1.components)),
+  edges: diff(edges(s0), edges(s1)),
+  pipelines: diff(byId(s0.pipelines), byId(s1.pipelines)),
+  glossary: diff(glossary(then("glossary.md")), glossary(now("glossary.md"))),
+};
+const touched = (d) => [...d.added, ...d.changed, ...d.removed];
+const comps = new Set([...touched(r.components), ...touched(r.glossary), ...touched(r.edges).flatMap((k) => k.split("→"))]);
+const secs = new Set(touched(r.sections));
+if (touched(r.pipelines).length) secs.add("Pipelines");
+
+// the system video's frames whose tags meet a change
+const sbPath = join(sv, "STORYBOARD.md");
+r.frames = !existsSync(sbPath) ? null : readFileSync(sbPath, "utf8").split(/\n(?=## Frame )/).slice(1).map((b) => {
+  const head = b.match(/^## Frame (\d+) — (.+)$/m); const tag = (k) => (b.match(new RegExp(`^- ${k}:\\s*(.+)$`, "m")) || [])[1];
+  const fc = (tag("components") || "").split(/[,\s]+/).filter(Boolean); const fs = (tag("spec_section") || "").trim();
+  const why = [...(fs && secs.has(fs) ? [`spec: ${fs}`] : []), ...fc.filter((c) => comps.has(c)).map((c) => `part: ${c}`)];
+  return head && why.length ? { frame: Number(head[1]), title: head[2].trim(), why } : null;
+}).filter(Boolean);
+
+if (args.includes("--json")) { console.log(JSON.stringify(r, null, 2)); process.exit(0); }
+const line = (label, d) => { const t = [...d.added.map((k) => `+${k}`), ...d.changed.map((k) => `~${k}`), ...d.removed.map((k) => `-${k}`)]; return t.length ? `  ${label}: ${t.join(", ")}` : null; };
+console.log(since ? `since ${since.slice(0, 7)} (the system video's last commit${flag("since") ? ", overridden by --since" : ""}):` : "no system video yet — everything below is new:");
+const lines = [line("spec.md", r.sections), line("parts", r.components), line("edges", r.edges), line("pipelines", r.pipelines), line("glossary", r.glossary)].filter(Boolean);
+console.log(lines.length ? lines.join("\n") : "  nothing changed");
+if (r.frames === null) console.log("· no system-video/STORYBOARD.md to match against");
+else console.log(r.frames.length ? `frames to rebuild:\n${r.frames.map((f) => `  ${f.frame} — ${f.title} (${f.why.join("; ")})`).join("\n")}` : "✓ no system-video frame explains anything that changed");
diff --git a/scripts/test/lifecycle.spec.mjs b/scripts/test/lifecycle.spec.mjs
new file mode 100644
index 0000000..c544c46
--- /dev/null
+++ b/scripts/test/lifecycle.spec.mjs
@@ -0,0 +1,91 @@
+#!/usr/bin/env node
+// The build half of the lifecycle, against a scratch copy of the media-service example (its walkthrough
+// was reviewed for real: A1 flagged, A2–A4 accepted). Nothing under eval/ is modified.
+//   walkthrough-scope — sorts the verdicts, carries the reviewer's words onto the flag
+//   reel record       — accepted calls become ledger entries, once
+//   reel check        — an accepted call warns a later plan, it does not block it
+//   reel audit        — a report that leaves out where a decision lands fails
+//   spec-diff         — a spec edit names exactly the system-video frames it affects
+import { execFileSync } from "node:child_process";
+import { mkdtempSync, cpSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
+import { join } from "node:path";
+import { tmpdir } from "node:os";
+import { ROOT } from "../lib/env.mjs";
+
+const tmp = mkdtempSync(join(tmpdir(), "reel-lifecycle-"));
+const rp = join(tmp, ".reelplanning");
+cpSync(join(ROOT, "eval/projects/media-service/.reelplanning"), rp, { recursive: true });
+const pd = join(rp, "plans/2026-09-12-upload-resume");
+const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
+const git = (...a) => execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { stdio: "ignore" });
+let failed = 0;
+const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };
+
+try {
+  const s = run("walkthrough-scope.mjs", pd, join(pd, "walkthrough-annotations.json"));
+  const scope = JSON.parse(readFileSync(join(pd, "walkthrough-scope.json"), "utf8"));
+  ok("walkthrough-scope: A1 flagged, A2–A4 accepted", scope.fixes.map((f) => f.id).join() === "A1" && scope.accepted.map((a) => a.id).join() === "A2,A3,A4", s.out);
+  ok("walkthrough-scope: the reviewer's note rides on the flag, the player's own label does not", scope.fixes[0].comments.length === 1 && /mobile/.test(scope.fixes[0].comments[0].comment), JSON.stringify(scope.fixes[0].comments));
+  ok("walkthrough-scope: a flag whose words don't reach a decision is a fix, not a new plan", scope.fixes[0].escalate === false);
+
+  const r1 = run("reel.mjs", "record", pd, join(pd, "walkthrough-annotations.json"));
+  const ledger = JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions;
+  const auto = ledger.filter((d) => d.kind === "autonomy");
+  ok("reel record: the three accepted calls join the ledger", auto.length === 3 && auto.every((d) => d.status === "active"), r1.out);
+  run("reel.mjs", "record", pd, join(pd, "walkthrough-annotations.json"));
+  ok("reel record: recording again adds nothing", JSON.parse(readFileSync(join(rp, "decisions.json"), "utf8")).decisions.length === ledger.length);
+
+  const c = run("reel.mjs", "check", join(rp, "plans/2026-09-20-part-size-and-sweep"));
+  ok("reel check: accepted calls warn the follow-up plan without failing it", c.code === 0 && /△ D-00\d .*accepted agent call/.test(c.out), c.out);
+
+  const a = run("reel.mjs", "audit", pd);
+  ok("reel audit: the hand-written report fails — steps 4 and 5 name no file for their decisions", a.code === 1 && /D-002.*step 4/.test(a.out) && /D-003.*step 5/.test(a.out), a.out);
+  const wt = readFileSync(join(pd, "walkthrough.md"), "utf8")
+    .replace(/(### Step 4[^\n]*\n)/, "$1Keyed on the server id: `src/billing/charge.ts`.\n")
+    .replace(/(### Step 5[^\n]*\n)/, "$1The 24 hours is `SWEEP_AFTER` in `src/upload/sweep.ts`.\n");
+  writeFileSync(join(pd, "walkthrough.md"), wt);
+  const a2 = run("reel.mjs", "audit", pd);
+  ok("reel audit: passes once each decision's step names its file", a2.code === 0, a2.out);
+  // the second agent's findings: every ✗ must be answered in walkthrough.md's "## Code check"
+  mkdirSync(join(pd, "code-check"), { recursive: true });
+  writeFileSync(join(pd, "code-check", "findings.md"), "# Code check\n\n## Steps\n- Step 1 — ✓ carried by `migrations/0042.sql`\n- Step 6 — ✗ the Go SDK has no resume\n\n## Decisions\n- none\n\n## Unexplained\n- `src/upload/sweep.ts` — ✗ pauses 200 ms between batches; no row covers it\n");
+  const a3 = run("reel.mjs", "audit", pd);
+  ok("reel audit: a code-check ✗ that walkthrough.md does not answer fails", a3.code === 1 && /Step 6/.test(a3.out) && /sweep\.ts/.test(a3.out), a3.out);
+  writeFileSync(join(pd, "walkthrough.md"), readFileSync(join(pd, "walkthrough.md"), "utf8") + "\n## Code check\n\n- Step 6: already a known gap (Not done).\n- `src/upload/sweep.ts`: the pause is A4's batching; A4's row now says so.\n");
+  const a4 = run("reel.mjs", "audit", pd);
+  ok("reel audit: passes once each ✗ is answered", a4.code === 0, a4.out);
+
+  // spec-diff: a system video tagged by spec section and part; change one of each
+  mkdirSync(join(rp, "system-video"), { recursive: true });
+  writeFileSync(join(rp, "system-video/index.html"), "<!-- built -->\n");
+  const spec = readFileSync(join(rp, "spec.md"), "utf8");
+  const firstHeading = spec.match(/^## (.+)$/m)[1];
+  writeFileSync(join(rp, "system-video/STORYBOARD.md"), `---\n---\n## Frame 1 — Why it exists\n- spec_section: ${firstHeading}\n\n## Frame 2 — The sweeper\n- components: sweeper\n\n## Frame 3 — The SDK\n- components: sdk\n`);
+  git("init", "-q"); git("add", "-A"); git("commit", "-qm", "base");
+  writeFileSync(join(rp, "spec.md"), spec.replace(/^(## .+\n)/m, "$1\nOne more sentence about it.\n"));
+  const sys = JSON.parse(readFileSync(join(rp, "system.json"), "utf8"));
+  sys.components.find((x) => x.id === "sweeper").files = ["src/upload/sweep.ts", "src/upload/sweep-batch.ts"];
+  writeFileSync(join(rp, "system.json"), JSON.stringify(sys, null, 2));
+  const d = JSON.parse(run("spec-diff.mjs", rp, "--json").out);
+  ok("spec-diff: names the spec section and the part that changed, and only those frames", d.frames.map((f) => f.frame).join() === "1,2" && d.sections.changed.includes(firstHeading) && d.components.changed.join() === "sweeper", JSON.stringify(d.frames));
+  const st = run("reel.mjs", "status", tmp);
+  ok("reel status: says the system video is behind", /behind spec\.md, system\.json/.test(st.out), st.out);
+
+  // an answer in the reviewer's own words is a change to make, carrying those words, never an accept
+  const annOwn = JSON.parse(readFileSync(join(pd, "walkthrough-annotations.json"), "utf8"));
+  const ownV = annOwn.autonomy.find((v) => String(v.id).toLowerCase() === "a2");
+  Object.assign(ownV, { verdict: "own", own: "keep the 409, but say which parts are missing in the body" });
+  writeFileSync(join(tmp, "own.json"), JSON.stringify(annOwn));
+  run("walkthrough-scope.mjs", pd, join(tmp, "own.json"));
+  const own = JSON.parse(readFileSync(join(pd, "walkthrough-scope.json"), "utf8"));
+  const f2 = own.fixes.find((f) => f.id === "A2");
+  ok("walkthrough-scope: an own-words answer is a fix, with the reviewer's words as its instruction", f2 && f2.verdict === "own" && /which parts are missing/.test(f2.comments[0]?.comment) && !own.accepted.some((a) => a.id === "A2"), JSON.stringify(own.fixes));
+  cpSync(join(pd, "walkthrough.md"), join(tmp, "wt.md"));
+  run("resolve-walkthrough.mjs", join(tmp, "wt.md"), join(tmp, "own.json"));
+  const wr = readFileSync(join(tmp, "wt.resolved.md"), "utf8");
+  ok("resolve-walkthrough: an own-words answer reads as changed, with the words, not as accepted", /\*\*A2\*\*.*✍️ \*\*CHANGED\*\*/.test(wr) && /reviewer's answer:\*\* keep the 409/.test(wr) && !/\*\*A2\*\*.*Accepted/.test(wr), wr.slice(wr.indexOf("## Verdicts"), wr.indexOf("## Verdicts") + 900));
+} finally {
+  rmSync(tmp, { recursive: true, force: true });
+}
+console.log(failed ? `✗ ${failed} failed` : "✓ lifecycle: all passed");
+process.exit(failed ? 1 : 0);
diff --git a/scripts/walkthrough-scope.mjs b/scripts/walkthrough-scope.mjs
new file mode 100644
index 0000000..1e22631
--- /dev/null
+++ b/scripts/walkthrough-scope.mjs
@@ -0,0 +1,73 @@
+#!/usr/bin/env node
+// What a walkthrough review asks the agent to do next — the walkthrough's counterpart to
+// revise-scope.mjs.
+//
+// A plan review changes the plan. A walkthrough review judges the calls the agent made on its own
+// while implementing it, and each verdict points somewhere different:
+//   - an accepted call is now a decision, and belongs in the ledger so the next plan cannot quietly
+//     undo it (`reel record` writes those entries);
+//   - a flagged call is a fix: rewrite that code, update its row in walkthrough.md, rebuild its beat.
+//     The reviewer's own words are the instruction, so every comment near the flag rides along;
+//   - a flag whose words reach an active decision (names its id, or one of its options) is not a
+//     one-line fix any more — it would supersede something decided, which is a plan's job. Those are
+//     marked `escalate`, and the fix step turns them into a new plan instead of an edit.
+// Calls the walkthrough listed but the reviewer never judged are reported too, so they are not
+// mistaken for accepted.
+//
+// usage: reelplanning walkthrough-scope <plan-dir> [annotations.json]
+// writes <plan-dir>/walkthrough-scope.json
+import { readFileSync, writeFileSync, existsSync } from "node:fs";
+import { resolve, join, relative, dirname, basename } from "node:path";
+import { repoRoot } from "./lib/env.mjs";
+
+const [planDirArg, annArg] = process.argv.slice(2);
+if (!planDirArg) { console.error("usage: reelplanning walkthrough-scope <plan-dir> [annotations.json]"); process.exit(1); }
+const planDir = resolve(planDirArg);
+const annPath = resolve(annArg || [join(planDir, "walkthrough-annotations.json"), join(planDir, "annotations.json")].find((p) => existsSync(p) && (JSON.parse(readFileSync(p, "utf8")).autonomy || []).length) || join(planDir, "walkthrough-annotations.json"));
+if (!existsSync(annPath)) { console.error(`✗ ${annPath} not found (export the walkthrough review from the player)`); process.exit(1); }
+const ann = JSON.parse(readFileSync(annPath, "utf8"));
+const wtPath = join(planDir, "walkthrough.md");
+if (!existsSync(wtPath)) { console.error(`✗ ${wtPath} not found — a walkthrough review needs the report it judged`); process.exit(1); }
+
+// the walkthrough's own autonomy table: | id | step | chose | instead of | why | check |
+const rows = {};
+for (const line of readFileSync(wtPath, "utf8").split("\n")) {
+  const c = line.split("|").slice(1, -1).map((s) => s.trim());
+  if (c.length >= 6 && /^A\d+/i.test(c[0])) rows[c[0].match(/^A\d+/i)[0].toLowerCase()] = { step: Number(c[1]) || null, chose: c[2], insteadOf: c[3], why: c[4], check: c[5].replace(/`/g, "") };
+}
+
+// the ledger, if this plan dir sits in a .reelplanning/
+let ledger = [];
+for (let d = planDir, i = 0; i < 6; i++, d = dirname(d)) {
+  const p = basename(d) === ".reelplanning" ? join(d, "decisions.json") : join(d, ".reelplanning", "decisions.json");
+  if (existsSync(p)) { ledger = JSON.parse(readFileSync(p, "utf8")).decisions || []; break; }
+}
+const active = ledger.filter((d) => d.status === "active");
+
+const verdicts = ann.autonomy || [];
+const notes = (ann.annotations || []).filter((a) => (a.comment || "").trim() && a.kind !== "approve");
+const auto = (a, v) => a.kind === "flag" && a.comment.trim() === `Flagged: ${v.chose}`; // the player's own label, not the reviewer's words
+const NEAR = 15; // seconds: a note with no step, this soon after a flag, is taken to be about that flag
+const call = (v) => { const r = rows[String(v.id).toLowerCase()] || {}; return { id: String(v.id).toUpperCase(), step: v.planStep ?? r.step ?? null, chose: v.chose || r.chose || "", insteadOf: r.insteadOf || "", why: r.why || "", check: r.check || "" }; };
+
+const accepted = verdicts.filter((v) => v.verdict === "accept").map(call);
+// An answer in the reviewer's own words rewrites the call: it is a fix, and those words are its instruction.
+const flagged = verdicts.filter((v) => v.verdict === "flag" || v.verdict === "own");
+const fixes = flagged.map((v) => {
+  const c = call(v);
+  const own = v.verdict === "own" && (v.own || "").trim() ? [{ id: `${c.id}-own`, kind: "own", t: v.t, comment: v.own.trim(), anchoredBy: "verdict" }] : [];
+  const said = own.concat(notes.filter((a) => !auto(a, c) && !own.some((o) => o.comment === a.comment.trim()) && (a.plan?.step === c.step && c.step != null || (a.plan?.step == null && a.t >= v.t && a.t - v.t <= NEAR)))
+    .map((a) => ({ id: a.id, kind: a.kind, t: a.t, comment: a.comment, anchoredBy: a.plan?.step === c.step && c.step != null ? "step" : "time" })));
+  const words = said.map((a) => a.comment).join("\n").toLowerCase();
+  const reaches = active.filter((d) => words.includes(d.id.toLowerCase()) || (d.options || []).some((o) => o.label && o.label.length > 3 && words.includes(o.label.toLowerCase())));
+  return { ...c, verdict: v.verdict, comments: said, escalate: reaches.length > 0, reaches: reaches.map((d) => `${d.id} (${d.question} → ${d.chosen})`) };
+});
+const judged = new Set(verdicts.map((v) => String(v.id).toLowerCase()));
+const unjudged = Object.entries(rows).filter(([id]) => !judged.has(id)).map(([id, r]) => ({ id: id.toUpperCase(), step: r.step, chose: r.chose }));
+
+const rel = (p) => relative(repoRoot(planDir), resolve(p)) || ".";
+const out = { generatedAt: new Date().toISOString(), planDir: rel(planDir), annotations: rel(annPath), accepted, fixes, unjudged };
+const outPath = join(planDir, "walkthrough-scope.json");
+writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
+const esc = fixes.filter((f) => f.escalate);
+console.log(`✓ ${outPath}: ${accepted.length} accepted (→ ledger), ${fixes.length} flagged to fix [${fixes.map((f) => f.id).join(", ") || "none"}]${esc.length ? `, ${esc.length} reach a decision and need a plan [${esc.map((f) => f.id).join(", ")}]` : ""}${unjudged.length ? `, ${unjudged.length} never judged [${unjudged.map((u) => u.id).join(", ")}]` : ""}`);
diff --git a/skills/plan-to-video/SKILL.md b/skills/plan-to-video/SKILL.md
index b9aa129..09560e9 100644
--- a/skills/plan-to-video/SKILL.md
+++ b/skills/plan-to-video/SKILL.md
@@ -9,23 +9,26 @@ This skill is a thin layer over HyperFrames' `/faceless-explainer`. It changes *
 
 ## The commands
 
-`reelplanning <script>` and `reel` run this skill's own tooling from wherever you are — they are on
-PATH when reelplanning is installed as a plugin, and `npm link` (or `export PATH="$PWD/bin:$PATH"`)
-puts them there in a checkout. `reelplanning` with no arguments lists what it has. Paths you pass
-are relative to YOUR working directory, not to wherever reelplanning lives, so a video project and
-a plan directory both belong in the repo being planned.
+`$RP` below means `npx -y reelplanning@0.1.0`: this skill's own tooling, pinned to the version the skill was written for. Write it out in full in every command you run (a shell variable does not survive from one tool call to the next), e.g. `npx -y reelplanning@0.1.0 plan-map <video-dir>`.
+
+- `$RP <command> …` runs a reelplanning command; `$RP --help` lists them all.
+- `$RP reel …` is the project-record CLI (`init`, `new-plan`, `stage`, `check`, `record`, `audit`, `status`).
+- `$RP hyperframes …` is the HyperFrames CLI at the version reelplanning pins. Use it wherever `/faceless-explainer` says `npx hyperframes …`; plain `npx hyperframes` fetches whatever release is newest.
+- Paths you pass are relative to YOUR working directory, never to wherever reelplanning is installed, so a video project and a plan directory both belong in the repo being planned.
+
+**First run on a machine.** Run `$RP --version`, then `$RP setup --dry-run`. If the first fails, or the second marks anything `·` (would install) or `✗` (missing), run `$RP setup` once. It installs ffmpeg, a headless Chrome, Kokoro TTS, whisper.cpp and HyperFrames' own skills (`/faceless-explainer`, `media-use`, …), skips whatever is already there, and names anything it could not install (e.g. no sudo for ffmpeg) with the command to run. Pass those on to the person instead of working around them.
 
 ## A new plan (the usual way in)
 
 Most plans start in conversation: someone asks their agent for a plan. With reelplanning installed, that plan is written into the repo and reviewed as a video, not left as text in the chat. Nobody has to run a command.
 
 1. Look for `.reelplanning/` at the repo root. If there is none, this is the first plan here; set the repo up before planning (if the person declines, build the video under `videos/` as a one-off):
-   - **Existing code (brownfield):** `reel init <repo> --name <name> --kind brownfield`, then map the code into `spec.md`, `system.json` and `glossary.md`. Don't make the person wait for it: carry on with the plan (steps 2–5) straight away, and build the system video at the same time once it exists (`.reelplanning/plans/2026-09-22-close-the-lifecycle` in the reelplanning repo); until then, show the map as text next to the review page. Every plan video draws its diagram and names from the map, so when the person corrects it, update `system.json`/`glossary.md` and rebuild the plan video's affected scenes (`plan-diff` shows which).
-   - **Nothing yet (greenfield):** `reel init <repo> --name <name> --kind greenfield`. There is nothing to map; the first plan adds the parts to `system.json` as it names them. The system video comes after that plan is built and its walkthrough accepted.
+   - **Existing code (brownfield):** `$RP reel init <repo> --name <name> --kind brownfield`, then map the code into `spec.md`, `system.json` and `glossary.md`. Don't make the person wait for it: carry on with the plan (steps 2–5) straight away, and build the system video at the same time once it exists ([.reelplanning/plans/2026-09-22-close-the-lifecycle](https://github.com/ncrispino/ReelPlanning/tree/main/.reelplanning/plans/2026-09-22-close-the-lifecycle) in the reelplanning repo); until then, show the map as text next to the review page. Every plan video draws its diagram and names from the map, so when the person corrects it, update `system.json`/`glossary.md` and rebuild the plan video's affected scenes (`plan-diff` shows which).
+   - **Nothing yet (greenfield):** `$RP reel init <repo> --name <name> --kind greenfield`. There is nothing to map; the first plan adds the parts to `system.json` as it names them. The system video comes after that plan is built and its walkthrough accepted.
 2. Read `spec.md`, `glossary.md` and `decisions.md` first, so the plan uses the project's names and builds on what is already decided.
 3. Write the plan in the shape `reel` reads: `## The problem`; `### Step N — <title>` per step (at most six); `## Components touched` with each glossary name in bold; `## Open questions for the reviewer`, numbered, each question in bold with `(step n)`, then `- **A · …**` / `- **B · …**` with what each costs, then a recommendation; `## Decisions in force` and `## Supersedes` when they apply. A plan that adds a part adds it to `system.json` and `glossary.md` too.
-4. `reel new-plan <repo> <slug> --plan <file>`, then `reel check <plan-dir>`; fix the plan until the check passes.
-5. Build the video with the steps under **Run** and **Project record** below, then open it for the person: run `reelplanning review <video-dir>` in the background (it bundles the player with the video, serves it on localhost and opens their browser) and give them the URL it prints. Hand them the review page, not the plan text; the text plan stays in the repo as the record.
+4. `$RP reel new-plan <repo> <slug> --plan <file>`, then `$RP reel check <plan-dir>`; fix the plan until the check passes.
+5. Build the video with the steps under **Run** and **Project record** below, then open it for the person: run `$RP review <video-dir>` in the background (it bundles the player with the video, serves it on localhost and opens their browser) and give them the URL it prints. Hand them the review page, not the plan text; the text plan stays in the repo as the record. `$RP review` with no folder opens every video in the repo under one library, for someone who wants to see the system video or any other plan.
 
 ## Inputs
 
@@ -35,10 +38,10 @@ Most plans start in conversation: someone asks their agent for a plan. With reel
 ## Run
 
 1. Read `references/style-guide.md` in full. It overrides `/faceless-explainer`'s story-design where they disagree on structure.
-2. Run `/faceless-explainer` Step 0–2 as written (init under `videos/<plan-slug>/`, `BRIEF.md`, `capture/extracted/visible-text.txt` = the plan verbatim, a frame preset). Prefer a low-decoration preset; `music: none` always.
-3. Step 3: write `STORYBOARD.md` / `SCRIPT.md` as a series of parts (style guide §16: one part per chapter, 60–75 s each, an opener and a closer per part, `chapter_start` on each opener; a decision about how something looks is a prototype beat, not a card) under the style guide's beat order and seconds budget. Run the style guide's §8 self-check before continuing. Every `feature_showcase` frame carries `- plan_step: <n>`. Every open question in the plan becomes a **decision beat** right after its step (`- decision: q<N>`, `- question:`, `- option_a:`/`- option_b:`, `- why_a:`/`- why_b:`, `- recommended: a`) followed by one **branch beat per option** (`- branch: q<N>=a`), per style guide §9; the ending is the resolved plan (`- plan_questions:`). `reelplanning plan-map videos/<plan-slug>` turns these tags into `plan-map.json`, which the player uses to pause, ask, branch and export the reviewer's calls.
-4. Step 3.1 as written, but pass `--speed 1.25` to `audio.mjs` (Kokoro speaks at ~150 wpm; the guide wants 185+). The speed is **synthesised, not stretched** — `reelplanning patch-tts-speed --check` must pass first, because the Kokoro branch of media-use's `lib/tts.mjs` drops the speed it is handed unless patched, and `hyperframes skills update` reverts that patch. Then `audio.mjs fetch-sfx`, then `reelplanning transcribe-missing videos/<plan-slug>` (the longest lines lose the engine's concurrency race and come back with no word timings; a frame with none gets no captions at all), then `sync-durations`, then `reelplanning hold-durations videos/<plan-slug>` — sync-durations sets every frame to its voice length, which flattens the held beats (a branch beat holds 5–8s even on a two-second line); the holds live in `.hyperframes/holds.json` and are a floor, never a cap. Steps 4–6 as written, plus `reelplanning captions-sentences videos/<plan-slug>` after `captions.mjs build` so captions are the script's sentences. Before render, run `reelplanning verify videos/<plan-slug>` (lint → check → snapshot); fix findings in the named frame and re-run.
-5. Open the review page: `reelplanning review videos/<plan-slug>` in the background, and give the person the URL it prints. Then report the MP4 path, the contact sheet, the final duration, and the word count vs the 185–254 wpm budget.
+2. First run `$RP hyperframes-skills` (a no-op when current). It installs HyperFrames' skills at the version reelplanning pins and re-applies the TTS speed patch. Then run `/faceless-explainer` Step 0–2 as written (init under `videos/<plan-slug>/`, `BRIEF.md`, `capture/extracted/visible-text.txt` = the plan verbatim, a frame preset), with two exceptions. Skip its "keep this skill fresh" `skills update`. Run its init as `HYPERFRAMES_SKIP_SKILLS=1 $RP hyperframes init …`. Both of those otherwise refresh every skill from GitHub main. That bypasses the pin, undoes the speed patch and has already once shipped a `media-use` that could not load. Prefer a low-decoration preset; `music: none` always.
+3. Step 3: write `STORYBOARD.md` / `SCRIPT.md` as a series of parts (style guide §16: one part per chapter, 60–75 s each, an opener and a closer per part, `chapter_start` on each opener; a decision about how something looks is a prototype beat, not a card) under the style guide's beat order and seconds budget. Run the style guide's §8 self-check before continuing. Every `feature_showcase` frame carries `- plan_step: <n>`. Every open question in the plan becomes a **decision beat** right after its step (`- decision: q<N>`, `- question:`, `- option_a:`/`- option_b:`, `- why_a:`/`- why_b:`, `- recommended: a`) followed by one **branch beat per option** (`- branch: q<N>=a`), per style guide §9. A question can have two to four options (`option_a` … `option_d`), and a pick-all-that-apply question is `- kind: multi` with one `- summary: q<N>` beat instead of branches (style guide §19); the ending is the resolved plan (`- plan_questions:`). `$RP plan-map videos/<plan-slug>` turns these tags into `plan-map.json`, which the player uses to pause, ask, branch and export the reviewer's calls.
+4. Step 3.1 as written, but run `audio.mjs` with `HYPERFRAMES_TTS_CONCURRENCY=1` in its environment and pass it `--speed 1.25`. One line at a time is the fast way: at the default of four, four whisper runs fight over the cores, take minutes each, hit the 300 s timeout and come back with no word timings (a 38-line walkthrough took 44 min this way and lost 10 lines' timings; one at a time, a 27-line plan video took 7 min, about 16 s a line for voice and timings together, and lost none). The speed matters because Kokoro speaks at ~150 wpm and the guide wants 185+. The speed is **synthesised, not stretched** — `$RP patch-tts-speed --check` must pass first, because the Kokoro branch of media-use's `lib/tts.mjs` drops the speed it is handed unless patched, and any skills reinstall reverts that patch (`$RP hyperframes-skills` puts it back). Then `audio.mjs fetch-sfx`, then `$RP transcribe-missing videos/<plan-slug>` (a safety net: any line that still came back with no word timings is re-transcribed, since a frame with none gets no captions at all), then `sync-durations`, then `$RP hold-durations videos/<plan-slug>` — sync-durations sets every frame to its voice length, which flattens the held beats (a branch beat holds 5–8s even on a two-second line); the holds live in `.hyperframes/holds.json` and are a floor, never a cap. Steps 4–5 as written up to the frames. Then, in place of Step 5's captions/assemble and Step 6's transitions, run `$RP finish-project videos/<plan-slug>`. It does those same steps plus reelplanning's own: sentence captions, caption fades, theme, clip durations, local GSAP, plan map, plan diff, and a closing `check`. It refuses to start, and says which file is missing and how to fix it, when a HyperFrames skill script cannot load. Before render, run `$RP verify videos/<plan-slug>` (lint → check → snapshot); fix findings in the named frame and re-run.
+5. Open the review page: `$RP review videos/<plan-slug>` in the background, and give the person the URL it prints. Then report the MP4 path, the contact sheet, the final duration, and the word count vs the 185–254 wpm budget.
 
 ## Inputs, extended (v4)
 
@@ -48,26 +51,52 @@ Most plans start in conversation: someone asks their agent for a plan. With reel
 
 ## Project record (v5)
 
-If the target repo has `.reelplanning/` (format: `docs/project-dir.md`), work from it (style guide §14):
+If the target repo has `.reelplanning/` (format: [docs/project-dir.md](https://github.com/ncrispino/ReelPlanning/blob/main/docs/project-dir.md)), work from it (style guide §14):
 
-1. `reel new-plan <repo> <slug> --plan <plan.md>` puts the plan under `.reelplanning/plans/<date>-<slug>/`; the video project goes in `video/` there (not `videos/`).
-2. `reel check <plan-dir>` before writing the storyboard; fix the plan on a failure (cite decisions in force, or list what it supersedes and why).
-3. `reel stage <plan-dir>` writes the stage snippet from `system.json` + the theme + the plan's steps; `theme/frame.md` is the frame preset; `glossary.md` gives the names the script uses; decisions in force become `decided · D-00n` tags and one narrated sentence each, never a question.
-4. After the review: `reel record <plan-dir> annotations.json`. A review sent from a hosted player arrives as a row in the artifact's store instead of a file — read the submitted rows and hand each to `reelplanning reel-intake <row.json>`, which validates it, files it and runs `record` for you. `docs/hosted-review.md` has the row shape, the statuses to write back, and why a row's `planDir` is checked rather than believed.
+1. `$RP reel new-plan <repo> <slug> --plan <plan.md>` puts the plan under `.reelplanning/plans/<date>-<slug>/`; the video project goes in `video/` there (not `videos/`).
+2. `$RP reel check <plan-dir>` before writing the storyboard; fix the plan on a failure (cite decisions in force, or list what it supersedes and why).
+3. `$RP reel stage <plan-dir>` writes the stage snippet from `system.json` + the theme + the plan's steps; `theme/frame.md` is the frame preset; `glossary.md` gives the names the script uses; decisions in force become `decided · D-00n` tags and one narrated sentence each, never a question.
+4. After the review: `$RP reel record <plan-dir> annotations.json`. A review sent from a hosted player arrives as a row in the artifact's store instead of a file — read the submitted rows and hand each to `$RP reel-intake <row.json>`, which validates it, files it and runs `record` for you. [docs/hosted-review.md](https://github.com/ncrispino/ReelPlanning/blob/main/docs/hosted-review.md) has the row shape, the statuses to write back, and why a row's `planDir` is checked rather than believed.
 5. Every video project's `STORYBOARD.md` front matter carries `plan_dir: <path>` — `plan-map.mjs` lifts it into `plan-map.json`, and it is the only thing that lets the player tell a reviewer where their review goes. A project without it makes every reviewer work that out by hand.
 
-No `.reelplanning/`? Offer `reel init` for a brownfield repo; a one-off plan can still be built under `videos/` as before.
+No `.reelplanning/`? Offer `$RP reel init` for a brownfield repo; a one-off plan can still be built under `videos/` as before.
 
 ## Revise (v6)
 
-After `reel record` has written `plan.resolved.md`, close the loop: fold the review back into the plan and the video, touching only what the review actually left text against.
+After `$RP reel record` has written `plan.resolved.md`, close the loop: fold the review back into the plan and the video, touching only what the review actually left text against.
 
-1. `reelplanning revise-scope <plan-dir>` writes `<plan-dir>/revise-scope.json`: the plan steps some annotation left a comment against (a plain option pick, with nothing written on it, is already fully captured by the ledger and carries nothing to revise). If `steps` is empty, stop here — there is nothing to revise, whatever else the ledger recorded.
-2. For each step in scope, read its `reasons` and rewrite that step's body in `plan.md` — in place, same file, no version suffix; git is the version history. Touch only the steps `revise-scope.json` named. A step with a decision but no comment is left exactly as it reads; re-litigating an already-made choice is not this step's job. Once every open question in the plan has a ledger entry, move all of them out of "Open questions for the reviewer" (rename or fold into a "How each was decided" section — anything but that exact heading) and add a "Decisions in force" section citing every decision id: `reel check`'s own gates read a plan's still-open questions as re-asking a decision the ledger already answered, and its own touched components as failing to cite that decision, for good reason elsewhere — but they fire on a plan citing *its own* just-recorded decisions too, so a revised plan has to clear both explicitly. Run `reel check <plan-dir>` after the rewrite and fix anything it reports before continuing.
+1. `$RP revise-scope <plan-dir>` writes `<plan-dir>/revise-scope.json`: the plan steps some annotation left a comment against (a plain option pick, with nothing written on it, is already fully captured by the ledger and carries nothing to revise). If `steps` is empty, stop here — there is nothing to revise, whatever else the ledger recorded.
+2. For each step in scope, read its `reasons` and rewrite that step's body in `plan.md` — in place, same file, no version suffix; git is the version history. Touch only the steps `revise-scope.json` named. A `hard-to-follow` reason (the reviewer rewound or slowed down there) asks for the step to be said more plainly, in the plan and in its beats, without changing what it decides. A step with a decision but no comment is left exactly as it reads; re-litigating an already-made choice is not this step's job. A question the reviewer answered with **Explain this more** (`option: "unclear"`, a `kind: "unclear"` reason) was not decided: rewrite it so it can be answered, with a concrete example for each option and the note's words addressed, and keep it under "Open questions for the reviewer" so the rebuilt video asks it again. Once every open question in the plan has a ledger entry, move all of them out of "Open questions for the reviewer" (rename or fold into a "How each was decided" section — anything but that exact heading) and add a "Decisions in force" section citing every decision id: `$RP reel check`'s own gates read a plan's still-open questions as re-asking a decision the ledger already answered, and its own touched components as failing to cite that decision, for good reason elsewhere — but they fire on a plan citing *its own* just-recorded decisions too, so a revised plan has to clear both explicitly. Run `$RP reel check <plan-dir>` after the rewrite and fix anything it reports before continuing.
 3. For each rewritten step, rewrite its beat(s) in `STORYBOARD.md`/`SCRIPT.md` and its composition frame HTML — same frame id, so `plan-diff` reads it as "edited," not delete-and-add. Regenerate narration with the normal Step 4 audio pipeline; it re-synthesizes the whole project, not just the touched frames — scoping that is real work against `faceless-explainer`'s own `audio.mjs` and not worth doing before the loop works end to end at all.
-4. Rerun `reelplanning finish-project <video-dir>` (its own tail: captions, assemble-index, transitions, clip-durations, plan-map, plan-diff) against the same project directory. Read `plan-diff`'s printed summary before continuing: the changed frame count should equal the number of touched beats. If it doesn't, something outside the intended scope moved — find out why before committing.
+4. Rerun `$RP finish-project <video-dir>` (its own tail: captions, assemble-index, transitions, clip-durations, plan-map, plan-diff) against the same project directory. Read `plan-diff`'s printed summary before continuing: the changed frame count should equal the number of touched beats. If it doesn't, something outside the intended scope moved — find out why before committing.
 5. Commit locally, message naming the plan and the step(s) revised. Whether that commit reaches the remote as a push or a pull request is the calling workflow's decision, not this step's — see the push-triggered workflow this repo runs itself from.
 
+## Implement, check, walk through, fix (v8)
+
+After the plan is approved (`plan.resolved.md`), the build half. Note the commit you start from: the code check diffs against it.
+
+1. **Implement from `plan.resolved.md`.** Treat the decisions in force as constraints, not suggestions. The moment you make a call the plan did not cover, add a row to the autonomy table in `walkthrough.md`: `| A<n> | <step> | <chose> | <instead of> | <why> | <where to check> |`. Written when it happens, not reconstructed at the end. Format: [eval/plans/upload-resume/walkthrough.md](https://github.com/ncrispino/ReelPlanning/blob/main/eval/plans/upload-resume/walkthrough.md). **What counts as a call:** a choice a reviewer could reasonably have made the other way and would want to know about: a default value, an error code, a library, a data shape, deleting instead of flagging, anything that changes behaviour someone can see. Not variable names, file layout inside a module, or the order of independent edits. One row per choice, not per line. Past about a dozen rows, the plan left too much open: say so in the walkthrough.
+2. **Finish `walkthrough.md`:** a `### Step N — <title>` entry per plan step saying what landed and in which files, deviations said plainly, evidence (tests run), what is not done.
+3. **The code check (D-001): a second agent, never you.** Run `$RP code-check <plan-dir> --base <start commit>` (add `-- <paths>` to leave out unrelated work). It writes `code-check/brief.md`: the approved plan, the decisions that apply, your autonomy log and the diff. Then start a **fresh** agent with the prompt from `$RP code-check <plan-dir> --prompt`. In Claude Code that is a subagent started by the orchestrating session; never one started by, or sharing the context of, the agent that implemented. It must not inherit your reasons. It writes `code-check/findings.md`: every step carried or not, every decision holding or not, anything the log does not explain. Answer every ✗ in a `## Code check` section of `walkthrough.md`, by its key (`Step N`, `D-00n` or the path): a new autonomy row, a deviation said plainly, or why it is not one. Never fix a finding quietly: the reviewer sees what the checker saw.
+4. **`$RP reel audit <plan-dir>`** before any video. It fails when a plan step has no entry, when a decision this plan made or cites is never mentioned, when a decision's step names no file to check it in, when an autonomy row has no "where to check", or when a code-check ✗ goes unanswered. Fix the report, not the check.
+5. **Build the walkthrough video** with `--walkthrough <plan-dir>/walkthrough.md` into `<plan-dir>/walkthrough-video/`, then open it with `$RP review`.
+6. **After the review:** `$RP reel record <plan-dir> <annotations.json>` writes `walkthrough.resolved.md`, runs `walkthrough-scope` and adds each accepted call to the ledger. A later plan touching that part is warned about it by `$RP reel check`, not blocked.
+7. **The fix step (D-002).** `walkthrough-scope.json` lists `fixes`: each call the reviewer flagged, or answered in their own words, with those words as the instruction.
+   - `escalate: true` means the words would overturn a decision in the ledger. Don't fix it in place: write a new plan that lists that decision under **Supersedes**, and go through review again.
+   - Otherwise rewrite the code to what the reviewer said, run the tests, and update that call's autonomy row in place (`… (**changed after review:** <what it does now>)`). Add a line to its step entry.
+   - Rebuild only that call's beat in the walkthrough video, keeping its frame id: its storyboard lines, its frame, its narration. Then `$RP finish-project`. `plan-diff` offers the reviewer just the changed beats to rewatch.
+   - Commit, naming the calls fixed. Only then is the walkthrough accepted: move on to **System video**, "Keeping it current".
+
+## System video (v8)
+
+One video per repo explains the whole system from `spec.md`, `system.json` and `glossary.md`. It lives in `.reelplanning/system-video/`.
+
+- **When:** in an existing repo, built at the same time as the first plan video (see **A new plan**). In a new repo, after the first plan is built and its walkthrough accepted.
+- **Story:** what the repo is for, its parts on the shared stage, each pipeline in order, the invariants. No decision beats. Written for a viewer who knows nothing about the repo.
+- **Tags:** every frame carries `- spec_section: <## heading in spec.md>` and/or `- components: <id>, <id>`, so a change can find the frames it affects.
+- **Building it (`--system`):** the steps under **Run**, into `.reelplanning/system-video/`, with `plan_dir: .reelplanning` and `kind: system` in the storyboard front matter. One part per pipeline in `system.json`, after an opening part (what the repo is for, and its parts introduced a few at a time). The cast beat, where every part is on screen at once, may declare `data-density="full"`; every other frame keeps to six parts. A quick check per part is welcome: it is the one question a system video asks. Every name is the glossary's. The newcomer check applies to every frame.
+- **Keeping it current:** after an accepted walkthrough, update `spec.md`, `system.json` and `glossary.md` for what landed. `$RP spec-diff` names the frames whose tags meet a change; rebuild only those, keeping their frame ids, then `finish-project`. `$RP reel status` says when the video is behind the spec.
+
 ## Autonomous mode
 
 This repo's runs are autonomous (`flow: automation`, `storyboard: no`). Post the storyboard summary as a heads-up and continue; the one kept question is preview-or-render at Step 6.

```
