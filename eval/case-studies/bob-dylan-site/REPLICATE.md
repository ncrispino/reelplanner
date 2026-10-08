# How it was run: the record

How to run it, step by step, locally, in a cloud session or in the container: [`RUNBOOK.md`](RUNBOOK.md). This page
is the record: what was the same in every arm, and where and when each one ran. Fill it in as the arms run
(the dates especially); the write-up's first section says where an arm's start was not empty, from the
preflight in each arm's sheet. (It began as `reel case-study`'s copy of the generic
[`eval/case-studies/REPLICATE.md`](../REPLICATE.md); the steps it held are in the runbook now.)

| | |
|---|---|
| Case study | `bob-dylan-site` |
| The prompt | [`prompt.md`](prompt.md), word for word; each arm's first message is its `arms/<arm>/prompt.txt` |
| Start | empty (greenfield): a folder with `git init` only, `~/reel-case-study/<arm>/dylan-site` locally or `~/dylan-site` in the container or a cloud session |
| reelplanning | 0.2.0, from branch `claude/clever-knuth-b5gtcf` at commit _fill in: the commit, from the ours sheet_ |
| Claude Code | _fill in: the version_, the same in all three arms (2.1.283 in the container) |
| Model | `claude-opus-5-5`, the same in all three arms |
| Made | 2026-09-26 |
| Arms run | text: _fill in: date_ · HTML: _fill in: date_ · ours: _fill in: date_ |
| Where each ran | text: _fill in: locally, a cloud session or the container_ · HTML: _fill in_ · ours: _fill in_ |
| Machine | _fill in: OS, CPU and memory (each arm's provenance.json); Docker version if the container was used_ |
| Order | ours first, then text and HTML, a day between arms (D-169) |

## What was not the same

_fill in: anything that differed between the arms (a different machine, a Claude Code update, a preflight ✗
line one arm had and another did not), or "nothing"._
