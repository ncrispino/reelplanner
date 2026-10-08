# HTML: the sheet

Fill this in as the arm runs, one stage at a time ([RUNBOOK.md](../../RUNBOOK.md) says what to do at each). Write the
agent's questions and your answers word for word. Screenshots go in `shots/`, named `NN-stage.png`.
Cut what didn't happen. A blank looks like _fill in: this_.

| | |
|---|---|
| Case study | `bob-dylan-site` |
| Arm | HTML |
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
Build an interactive website about Bob Dylan. I want someone to be able to explore his life and music — the different eras, the albums, the songs and how they connect — in a way that's more engaging than reading a Wikipedia article, and it should work well on a phone. Start from scratch in this empty folder.

Before writing any code, create a thorough implementation plan for this as a single self-contained HTML file, plan.html, instead of markdown. Include milestones on a timeline, a diagram of how the pieces fit together and how data flows through them, inline mockups of the main screens, the key code I'll need to write, and a risk table. Make it easy to skim on a phone — I'm going to review it in a browser and pass it to the implementer as-is. Don't build the site yet: plan.html is the only file to write.
```

## 1. plan

What you do: the prompt, plus the HTML paragraph (`prompt.txt`).

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/01-plan.png`

## 2. review

What you do: read `plan.html` in a browser, notes in chat.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/02-review.png`

## 3. revise

What you do: the agent edits `plan.html`.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/03-revise.png`

## 4. build

What you do: "build what plan.html says".

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/04-build.png`

## 5. check the result

What you do: ask for `report.html` (`report.prompt.txt`), read it, then open the site.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/05-check-the-result.png`

## 6. fix

What you do: ask in chat.

- Clock: _fill in: start_ – _fill in: end_ · your time: _fill in: minutes_ · cost: _fill in: $_
- Questions the agent asked, and your answers, word for word:
- What you saw, and what you said (your feedback points: which, and how):
- Screenshots: `shots/06-fix.png`

## 7. done

What you do: you would ship it.

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
