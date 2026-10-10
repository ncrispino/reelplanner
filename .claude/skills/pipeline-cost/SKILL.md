---
name: pipeline-cost
description: "Measure where a reelplanner run's time and tokens go — planning, turning the plan into a video, verifying it, the review loop, implementing — from Claude Code transcripts, and record it in eval/pipeline-cost/ so runs can be compared over time. Use when asked how long or how much a video took, why it was slow or expensive, whether verification is worth it, to compare a change to the skill or tools against earlier runs, or to audit a case study's sessions."
---

# Pipeline cost

The question each audit answers: from the person's request to the first video they can watch, how much time and
how many tokens went into **understanding the plan** (fine to spend) against **making the video** and
**verifying it** (the parts to make cheaper), and was the verifying worth what it cost?

Results go in `eval/pipeline-cost/`: one report per audited run, and a row each in
[`LEDGER.md`](../../../eval/pipeline-cost/LEDGER.md), so a change to the skill or the tools is judged against the
runs before it, not by impression.

## 1. Find the transcripts

Claude Code keeps a session as `~/.claude/projects/<cwd with / as ->/<session-id>.jsonl`. Gather all of a run:

- **The session:** in the project folder of the repo it ran in. `grep -l plan-to-video <folder>/*.jsonl` finds the
  sessions that used the skill.
- **Its subagents:** `<session-id>/subagents/agent-*.jsonl`, each with a `.meta.json` holding its description (read
  automatically by both scripts).
- **Agents started as separate sessions:** fresh eyes and code checks run with `claude -p` from a scratch folder get
  their own project folder, named after that folder: `ls -d ~/.claude/projects/*<session-id>*` (for example
  `…-scratchpad-fe-designer`). Pass them as extra sessions.
- **A headless review run** (the review server starting the repo's agent command) is a session of its own in the
  repo's project folder, short, around the review's time.
- **On another machine** (a fresh-machine run): copy its `~/.claude/projects` back before the machine goes; nothing
  else keeps them.

Transcripts can be hundreds of MB. Never read one whole: the scripts stream them; slice with `python3` or `grep`.

## 2. Cut it into episodes

```bash
python3 .claude/skills/pipeline-cost/scripts/milestones.py <session.jsonl> [--since ISO] [--until ISO]
```

One line per milestone: ASK (the person speaks), AGENT (a subagent starts), BUILD and CHECK (commands, in the session
or a subagent), SHOWN (a review link or "the video is ready"), REVIEW (a review taken in). An **episode** runs from
the ASK that asked for the plan or video to the first SHOWN after it. A revise round after a review is an episode of
its own (from the review's REVIEW to the next SHOWN). Note each episode's start and end times, and where the plan was
done (the plan committed or `reel check` passing) and the video work began.

## 3. Measure each episode

```bash
python3 .claude/skills/pipeline-cost/scripts/phase_times.py <session.jsonl> [<extra sessions>…] \
  --since <start> --until <first SHOWN> --agents [--json out.json]
```

Per phase (plan, build, verify, review, implement, other): **agent-min** (summed over agents: the cost, since
parallel agents add up), **wall-min** (the union over agents: what the person waits), tool calls, output tokens and
input tokens (with cache reads: usually the larger cost). Its docstring says how each call is classified and what
counts as work. Check its classification against what you read in the transcript (a fork named "Build the video"
also runs fresh eyes; a call that touches nothing telling keeps the phase before it), and say where it was wrong in
the report; fix the patterns in the script when a mistake repeats.

**Variety:** `reelplanner variety <video-dir>` (its `layouts: n over m scenes` line): a change that makes videos
cheaper must not make them alike, so record it beside the time.

## 4. Judge the verifying

Numbers alone do not say whether verification paid. For each episode:

- **Rounds:** how many fresh-eyes rounds, findings per round, and how each was answered (fixed, given a meaning,
  kept). The findings and answers are in the video folder's `fresh-eyes/` (`newcomer.md`, `designer.md`, per round).
- **Material or cosmetic:** sample the findings. Material: a viewer would be misled or lost (a wrong fact, a
  contradiction, a missing step, a word never defined). Cosmetic: placement, wording taste, a chip a few pixels off.
- **Did later rounds pay:** what did round 2 and 3 find that round 1 did not, and was it material?
- **Against the person:** read their review of that video (the plan's `reviews/`, or the session after SHOWN). What
  did they flag, and would any verification step have caught it? What did verification fix that they would have
  flagged?
- **Rework:** frames redrawn, scenes re-voiced, retimed, rebuilt because of findings (count, and minutes).

## 5. Find the waste

Look for: the same frame rebuilt many times; serial work that could run side by side; long waits (a `sleep` loop,
a wait loop that never ends early); agents reading reelplanner's own source to learn a format the skill does not
state; large prompts sent again and again (input tokens per call); tool failures and retries; a verification round
whose findings were all kept.

## 6. Write it down

- A report at `eval/pipeline-cost/<date>-<run>.md`: the run (repo, what was planned, machine, model, reelplanner
  version or commit), the episode table, the phase split, verification's value, the wastes, and proposals ranked by
  expected saving and the risk to what the person sees, each with its evidence. No credentials, account ids, IPs,
  or session links: transcript ids are fine.
- A row per episode in `eval/pipeline-cost/LEDGER.md` (its columns say what goes in each, the video's variety too).
- A proposal that changes the skill or tools is a plan of its own (the plan-to-video skill applies). After it lands,
  audit the next comparable run and add its row: the ledger is how a change is shown to help.
