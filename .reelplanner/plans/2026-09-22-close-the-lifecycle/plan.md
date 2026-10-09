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

What counts as a call: a choice a reviewer could reasonably have made the other way and would want
to know about. That means a default value, an error code, a library, a data shape, deleting instead of
flagging, or anything that changes behaviour someone can see. It does not mean variable names,
file layout inside a module, or the order of independent edits. One row per choice, not per line
changed. If the log grows past about a dozen rows for one plan, the plan left too much open, and the
walkthrough says so.

### Step 3 — Check the diff against the plan before the walkthrough

Before any video is built, a second agent reads the branch diff alongside `plan.resolved.md` and the
ledger, and answers three questions (decided, D-001). It is a separate agent run, not a helper of the
implementing agent: the pipeline starts it with a fresh context that holds only the plan, the ledger
and the diff, never the implementer's conversation. It cannot inherit the implementer's reasons for
drifting. In Claude Code that is a subagent started by the orchestrating session, and never by the
agent whose work it is checking. Does every plan step have a change that carries it out? Does every
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
only that beat of the walkthrough video (decided, D-002). `plan-diff` then offers the reviewer just
the changed beats to rewatch. A flag whose comment would supersede a decision in the ledger is not
fixed in place: `walkthrough-scope` marks it to escalate, and it becomes a new plan.

### Step 6 — Keep the system video current

After every accepted walkthrough (decided, D-003), the agent updates `spec.md`, `system.json` and
`glossary.md` for what landed. `spec-diff` names the sections and components that changed; the
system video rebuilds only the frames tagged with them, keeping their frame ids, and `plan-diff`
flags them. `reel status` warns when `spec.md` is newer than the system video. The video anyone
watches first never describes a system that no longer exists.

It has to stay cheap, because it runs on every accept. Most changes touch one or two scenes, and
only those are rebuilt:
- **Text first, in the background.** The spec, the storyboard lines and the frame HTML for the
  changed scenes are updated right after the accept, without waiting on anyone. The video is then
  ready to build at any moment.
- **Narration for the changed lines only.** New lines are synthesised; unchanged ones keep their
  audio (this needs the per-frame narration from the M3 plan).
- **No render until someone asks.** The review page plays the HTML live, so nothing needs an MP4
  to be watched. Rendering the MP4 or its parts happens only on request, such as for the README or
  a share link.
A typical update is then a few scenes' worth of agent time and a few seconds of speech, not a full
video build. `reel status` reports what an update would touch before it runs.

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

## How each was decided

Reviewed 2026-09-22 in the hosted player (verdict: changes requested).

1. **Who checks that the code followed the plan?** A second agent, plus the deterministic floor
   (D-001). Step 3 now says what "second" means: a fresh agent run, never the implementer's helper.
2. **What happens to a flagged call?** The agent fixes the code and rebuilds that beat, escalating
   to a new plan when a comment would supersede a decision (D-002).
3. **When does the system video update?** After every accepted walkthrough, kept cheap (D-003):
   only the changed scenes, text in the background, narration for changed lines, no render until
   asked. Step 6 spells this out.

## Decisions in force

- **D-001** Who checks that the code followed the plan: a second agent.
- **D-002** What happens to a flagged call: fix and rebuild.
- **D-003** When the system video updates: after every accepted walkthrough, and cheaply.

## Not in this plan

What the M3 plan (`2026-09-22-m3-revise-loop`) still owns: the push-triggered workflow running in a real
Actions runner, and regenerating narration for only the changed frames. Multi-reviewer review.
Restructuring a plan's steps from a walkthrough review. The review's requests about reelplanning
itself (questions with more than two options, select-all answers, more than three questions, other
kinds of feedback a video allows, simpler diagrams, typing a comment right on a mark) are their own
plan: `2026-09-22-richer-review`.
