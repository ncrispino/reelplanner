# Reading-prompt review video: where the wait went

The exact Codex conversation titled “Review reading-prompt findings,” on the owner's Mac, made the
**Readable labels and defensible metrics** plan video in a scratch worktree of the research repo.
The first video took **38.6 minutes** from the request to the ready-and-open message. After the
owner's feedback, the revised video took another **32.5 minutes** to show. First narration took
**84 seconds**. Most of the wait went into agent preparation and rework.

This audit reads saved Codex transcripts, command outputs and review findings. It does not rebuild
the video, copy raw history into Git, or change the research worktree. Times below are UTC; the
request was at 4:47 p.m. Pacific on 11 October. The report date follows the UTC showing dates.
The main session used `gpt-6.1-sol` at high reasoning effort.

## Episodes

| Episode | Start | First showing | Wall minutes |
|---|---|---|---:|
| First video | 2026-10-11 23:47:43.006 | 2026-10-12 00:26:18.689 | 38.6 |
| Revision, with delivery and timing repairs | 2026-10-12 00:52:28.707 | 2026-10-12 01:24:58.169 | 32.5 |

The second episode starts with the owner's message that the submitted review had not reached the
conversation. It includes discussion with the owner and delivery repairs, so it is not a video-only
benchmark. The roughly 26 minutes between showing and that message are excluded. The first showing
is the explicit ready-and-open message, not the earlier draft review-server launch.

### First video: elapsed intervals

These non-overlapping intervals add to 38.6 minutes. They include reasoning, tools and interaction;
they are not tool CPU time or summed agent-minutes.

| Interval | Minutes | Evidence at its end |
|---|---:|---|
| Workflow preparation, voice setup, source/decision reading and plan | 12.3 | First plan check/project initialization at 00:00:03 |
| Script/storyboard draft and visual preparation | 6.7 | 30 scenes, 918 narration words; script check launched at 00:06:47 |
| Early script review and corrections | 5.5 | 16 findings answered, terms pass and first frame packet at 00:12:16 |
| Drawing, narration, assembly and first guide repair | 8.0 | Successful assembly; visual reviewers launched at 00:20:14 |
| Visual review, fixes, rebuild and opening the player | 6.1 | Ready-and-open message at 00:26:18 |

Voice setup was a first-use cost. The agent asked about narration at 23:50:20; the owner requested
the settings file at 23:55:25 and confirmed the key was saved at 23:57:08. Other preparation ran
during this interval, so those minutes are not all idle waiting or pure waste. The first hosted
request also received an approval-review rejection; the owner authorized the concrete payload at
00:08:33 while the script review was underway.

### Command costs

- Hosted narration: **30 lines in 84 seconds**, four at a time, overlapping drawing. Later builds
  reused unchanged narration in about 0.2–0.3 seconds.
- Successful full builds: **57.5 seconds** and **46.3 seconds**. The first assembly stopped on a
  guide check: one paragraph was absent and two first-layer sentences repeated narration.
- Browser verification: **21.5, 23.7 and 21.9 seconds**, included in build durations, not additional.
- Script reviewer: about **74 seconds** from spawn to its last recorded event.
- Frame newcomer: about **149 seconds**; designer: about **70 seconds**, running concurrently.

No MP4 encode accounts for the first-showing delay: the deliverable was the interactive player.
The first build reported **10 layouts across 30 scenes**, three transition kinds and a **6:56**
timeline. That timeline includes alternative-choice scenes, not necessarily every viewer's route.

## Context and model work

Unique recorded response usage within the first episode:

| Agent | Requests | Input tokens, including cached | Cached input | Output tokens |
|---|---:|---:|---:|---:|
| Main session | 90 | 14,206,420 | 13,974,400 | 75,118 |
| Script reviewer | 3 | 74,957 | 54,656 | 2,168 |
| Frame newcomer | 9 | 335,992 | 303,232 | 4,671 |
| Frame designer | 8 | 267,599 | 228,224 | 2,132 |
| Total | 110 | 14,884,968 | 14,560,512 | 84,089 |

The main session's mean input was **157,849 tokens per request**. It authored the video inside a
long research conversation, reading skills, repo guidance, formats and existing decisions, querying
command help, and writing/revising the plan and generators. Its first 19 requests, before the first
plan check, already account for 4.54M input and about 24k output tokens.

Cached input is real context, but is not new output or equivalent uncached billing. Large context
and repeated authoring are strong candidates for the cost; these records do not independently measure
model-server latency or prove a speedup from reducing context. No dollar cost is inferred.

The revision used a fresh builder (`fork_turns: none`), yet it grew to **78 requests and 11.15M
input tokens**, about 143k per request. It reread full skills, references, review, plan and evidence,
and received continuing scope updates. A fresh worker alone is insufficient: it also needs a concise,
complete packet and selective reads. Main plus builder recorded at least 27.54M input and 95,123
output tokens in the revision; separately launched CLI reviewers are excluded from that lower bound.
The ledger therefore leaves that episode's complete token totals blank.

## Verification's value and rework

Early script review answered **16 findings**. The first frame round answered **56**: 43 newcomer
and 13 designer. Its completion output records 30 fixed, six kept and 20 moved into the plan.
This was one script round and one frame round, not an uncontrolled three-round loop.

Ten of the 13 designer findings concerned captions from another scene. These were material: the
picture asked one question while the caption recommended an answer to another. They shared one
cause: the storyboard began at frame 0, but sentence captions used `frame - 1` as the position.
The fix maps stable frame identifiers to their actual storyboard order. Other findings included a
promised evidence interaction not shown, an omitted service result, and actor-versus-affected-agent
counting.

The newcomer also found unresolved meanings and thin examples. Many answers added depth to the
plan rather than showing it in the picture. The owner's later review still asked for examples to
be shown and explained before each question, and clearer grader/record access and honesty. The early
draft's `Shows` descriptions were largely headings. Settle **the actual evidence and intermediate
states the picture shows** before drawing; a script pass alone does not establish visual clarity.

The revision reduced **30 scenes to 14**, retaining stable identifiers. That exposed another bug:
chapter boundaries indexed the shortened scene array using frame identifiers. Its final frame-review
files contain another 29 newcomer and two designer findings, separate from the first round's 56.

## Earlier PR: used here, but not enough

PR #27 merged at 2026-10-11 05:57 UTC, before this episode. The run invokes the checkout CLI,
`fresh-eyes --script` and `frame-packet`. Build output explicitly skips the stale frames assembly
after script/storyboard changes. The older global install found during this audit was not the CLI
used for this video.

The [bakery bench](2026-10-11-bench.md) measured 47.8 minutes to first showing on its baseline and
35.9 on the fixed branch; revision improved from 30.2 to 13.6 minutes. The 78.4-minute result was
the branch's initially slower implementation, not the PR's baseline. Those were fresh-machine Claude
runs on an 18-scene bakery plan. This was high-effort Codex on a 30-scene research plan with first-use
setup and delivery repairs. These runs cannot establish a Codex-versus-Claude speed comparison.

The PR reduced checking/repeated-build overhead. It did not remove workflow discovery in a large
conversation, explanation writing, ambiguous plan meanings, stable-ID bugs or worktree delivery repairs.

## Next changes, ranked

1. **A concise authoring handoff and selective reads.** Give a fresh builder the agreed problem,
   unresolved choices, definitions, relevant evidence, selected CLI and output location in one packet.
   Use frame packets for its scenes; avoid repeatedly reading whole skills/plans. Highest expected
   recurring saving, still to be measured. Preserve source pointers and fact/readability checks so
   a smaller context does not produce a shallow or wrong explanation.
2. **An example and visual plan per choice before drawing.** Work the same case through each option,
   including intermediate results and the reason they differ. Resolve glossary/counting meanings here.
   This targets observed rework and actual owner confusion. Reduce scenes only when the explanation
   stays complete.
3. **Integrate the tested stable-ID repairs.** Separate local branch `codex-review-worktree-delivery`
   contains `d388584` (caption order, with regression coverage) and `fd7ecbe` (chapter boundaries after
   removed scenes, with regression coverage). They are based on `c161c82` and absent from this
   checkout's HEAD. Reconcile them with pending owner-edit work instead of fixing each symptom.
4. **Verify live review connectivity before making the video.** The scratch worktree's connection
   was refused because its folder differed from the conversation's original checkout. The initial
   page fell back to the inbox; the background waiter's completion did not wake the chat. Repairing
   this consumed part of the revision. That local branch contains `7f6f80d`, verifying an explicitly
   selected session across linked worktrees while rejecting unrelated repos, and `45f64f2` for
   tracked inbox runtime files during completion.
5. **Measure model/context settings on the same task.** Compare the bounded builder at high effort
   with a lower setting before recommending a new default. Keep the examples/checks the same. This
   audit does not justify silently trading clarity for speed.

Voice-provider changes, render hardware and removing fresh eyes are poor first targets: audio/build
stages were already short and checks found real errors. Tool/skill proposals need their own plan and
a subsequent comparable cost audit, as required by the pipeline-cost workflow.

## Reproduction and limits

Source transcript: `01a12beb-72a7-73b0-aa69-3b5b2c503050`, found by its exact saved title. The three
initial reviewers are identified by parent-thread metadata and task names `labels_video_script_review`,
`labels_video_newcomer`, `labels_video_designer`; revision builder: `revise_label_video`. Sum unique
`token_usage_record.payload.usage` by response ID within each interval, not whole-session cumulative
counters. Reasoning output is part of output usage and is not added again.

Artifact: `<research-worktree>/.reelplanning/plans/2026-10-11-readable-labels/video/`. First frame
findings remain in `fresh-eyes/build-1/round-1/{newcomer,designer}.md`. Root `fresh-eyes/` and script
findings were replaced by the revision, so they are not the original script's 16 findings. Initial
script counts and durations above come from their timestamped main-session tool results.

Existing `phase_times.py`/`milestones.py` parse Claude transcripts, not Codex. Ledger agent-minute
columns are left blank; the elapsed intervals and exact usage above are provided instead. This is
one observed run and a diagnosis, not a before/after speedup for the proposed changes. No raw history
or research quotes are saved with this report.
