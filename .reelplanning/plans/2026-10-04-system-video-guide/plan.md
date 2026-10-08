# A guide under the system video

_Opened 2026-10-04 from a review of the rebuilt system video. A first draft: the problem and a sketch of the steps,
for the agent to plan in full (cases, interface, examples, questions) before any video is made of it._

## The problem

The guide is the page under a video with what the video cannot hold (D-264, D-265). Every plan's video and
walkthrough video has one, built by `reelplanning guide` from the plan's `plan.md` (and, after the build, its
`walkthrough.md` and the real runs in `runs/`). The system video has none: `scripts/guide.mjs` skips it ("the system
video has no guide"), because the system video has no `plan.md` to build one from.

So the first video a newcomer opens teaches the guide in its whole fourth chapter, and has no guide of its own.
What stands in for one is `spec.md`, plain prose read in a text editor. Held to the guide's own criteria
(`plans/2026-09-28-plan-guide/guide-criteria.md`), it is partly plain prose, and has none of the rest: no worked
examples, diagrams to step through, real outputs or diffs; nothing under the player, no marks in the video to open
it from; no note on selected words and no Ask about this.

### What we have

- `spec.md` (Purpose, Install, Parts, Pipelines, Invariants, Several people, How it is tested), `system.json` (the
  parts, how they connect, the two pipelines) and `glossary.md`: the three files the system video is made from.
- The real runs the system video shows, made on a scratch machine for its install chapter (`npm i -g` from a packed
  copy, `setup`, `npx skills add`, `reel init`) and in this repo (`reel check`, `reel stops`, `reel audit`, `reel
  status`, `spec-diff`); today only their text on the frames keeps them.
- The guide's builder (`scripts/lib/guide/`), which reads a `plan.md`'s steps and blocks.

### What the video left to the guide

The 2026-10-04 review of the system video asked for these to move under it, out of the video:

- the seven frame rules, and what `frame-lint` and the details check stop (scene 13 of the earlier cut);
- the record's history: the agent's own past choices, raised again only when a change rewrites their lines, and
  `reel fold`, which folds a part's rules into one section of `spec.md` (D-306; scene 29 of the earlier cut);
- `reel case-study`: one prompt, run as a text plan, an HTML page and reelplanning (the end of scene 42).

## Steps, in outline

1. **The guide's source for the system video.** Build its parts from `spec.md`'s sections and `system.json`'s parts
   and pipelines, in the video's order: one part per chapter, each part's own section, its diagram from
   `system.json`'s edges, and the glossary's rows for the words it uses.
2. **Real outputs.** Keep the install runs and the `reel` runs the video shows as files under the system video
   (`runs/`, as a plan's guide keeps them), so the guide shows them as real and `guide --check` can hold it to them.
3. **The way in.** Mark the things in the system video's scenes that lead to a part (D-266), and let the review page
   put the guide under it, as for any other video. `guide --check` runs in its build.
4. **What moved out of the video.** The three topics above, each a part of its own.

## Open questions for the reviewer

To be written with the steps in full: at least, whether the guide is built from `spec.md` as it stands or from a
fuller text kept beside it, and whether the system video's guide is checked against the spec on every build.
