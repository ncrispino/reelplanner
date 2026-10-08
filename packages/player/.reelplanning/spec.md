# review-page — system spec

_Kept current by the agent after every walkthrough (stage 4). Names come from `glossary.md`; parts and edges from `system.json`. Prose here, data there._

## Purpose

One paragraph: what the system does and for whom.

## Parts

One line per component in `system.json`, in the same order: what it is, what it owns, where it lives.

## Pipelines

One short numbered list per pipeline in `system.json`: what moves, through which parts, in what order. A plan step that changes a pipeline rewrites the list here after it lands.

## Invariants

The things that must stay true (for example: "a file is charged once", "a part write and its manifest bit commit together"). Decisions that created an invariant cite it.

## Knowledge levels

What each level is assumed to know, so a brownfield plan video can tag frames:

- `new`: nothing about this system.
- `familiar`: the part names above, not the mechanics.
- `owner`: the mechanics and the history; skips the "today" and cast beats.

## Conventions

How things are named, tested, deployed, migrated. Anything a plan should not restate.
