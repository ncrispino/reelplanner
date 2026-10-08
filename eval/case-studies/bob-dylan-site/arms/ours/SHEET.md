# Ours (reelplanning): the sheet

Fill this in as the arm runs, one stage at a time ([RUNBOOK.md](../../RUNBOOK.md) says what to do at each). Write the
agent's questions and your answers word for word. Screenshots go in `shots/`, named `NN-stage.png`.
Cut what didn't happen. A blank looks like _fill in: this_.

| | |
|---|---|
| Case study | `bob-dylan-site` |
| Arm | Ours (reelplanning) |
| Provenance | [`provenance.json`](provenance.json): the machine, every tool's version, the settings, and what the transcripts say ran |
| Claude Code, model | _fill in: the version, and each model with its responses, from provenance.json_ |
| reelplanning, where it ran | _fill in: ours, its version and commit from provenance.json; the others, not used_ · _fill in: locally (the OS), a cloud session, or the container_ |
| Started, ended | _fill in: date and time_ – _fill in: date and time_ |
| Total: clock, yours | _fill in: minutes_, _fill in: minutes_ |
| Cost the agent reports | _fill in: $_ |

## Preflight

Paste the preflight's lines here, first, before anything else:

```text
```

## The first thing typed

Exactly `prompt.txt`:

```text
Use reelplanning to plan: Build an interactive website about Bob Dylan. I want someone to be able to explore his life and music — the different eras, the albums, the songs and how they connect — in a way that's more engaging than reading a Wikipedia article, and it should work well on a phone. Start from scratch in this empty folder.
```

## 1. plan

What you do: "Use reelplanning to plan: " and the prompt; the plan video.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/01-plan.png`

## 2. review

What you do: the plan video on the review page.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/02-review.png`

## 3. revise

What you do: revised steps, rebuilt scenes.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/03-revise.png`

## 4. build

What you do: build, choices recorded, stop at a step's fifth.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/04-build.png`

## 5. check the result

What you do: code check by a fresh agent, `reel audit`, the walkthrough video.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/05-check-the-result.png`

## 6. fix

What you do: flags on the walkthrough, fixes.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/06-fix.png`

## 7. done

What you do: accepted; the system video current.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/07-done.png`

## A day later: five questions, from memory

The same five questions in every arm, about what was built (for example: "What happens when you tap a
song on a phone?", "How would you add an album?"). Answer without looking; the write-up checks each answer
against the code.

1. _fill in: the question_ — _fill in: your answer_
2. _fill in: the question_ — _fill in: your answer_
3. _fill in: the question_ — _fill in: your answer_
4. _fill in: the question_ — _fill in: your answer_
5. _fill in: the question_ — _fill in: your answer_
