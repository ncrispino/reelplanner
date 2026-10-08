# {{arm_title}}: the sheet

Fill this in as the arm runs, one stage at a time (REPLICATE.md says what to do at each). Write the
agent's questions and your answers word for word. Screenshots go in `shots/`, named `NN-stage.png`.
Cut what didn't happen. A blank looks like _fill in: this_.

| | |
|---|---|
| Case study | `{{slug}}` |
| Arm | {{arm_title}} |
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
{{first_prompt}}
```

{{stages}}
## A day later: five questions, from memory

The same five questions in every arm, about what was built (for example: "What happens when you tap a
song on a phone?", "How would you add an album?"). Answer without looking; the write-up checks each answer
against the code.

1. _fill in: the question_ — _fill in: your answer_
2. _fill in: the question_ — _fill in: your answer_
3. _fill in: the question_ — _fill in: your answer_
4. _fill in: the question_ — _fill in: your answer_
5. _fill in: the question_ — _fill in: your answer_
