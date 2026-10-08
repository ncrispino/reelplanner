# Spike: can a guide be built from any plan.md?

A throwaway generator (`gp/gen.py` in the session scratchpad, not in `scripts/`) takes a plan folder and builds
a guide with no hand-written content. It reads only these:

- `plan.md`
- `video/plan-map.json` and `video/snapshots/` (scene times and pictures)
- `walkthrough.md` (the Built side)
- `.reelplanning/decisions.json`
- `.reelplanning/system.json` (the parts picture, as `reel stage` draws it)

The page is v3's: a short scroll story, then the plan in layers. Where a layer needs something plan.md does not
say, the page shows a dashed "Not written in plan.md" box instead of filling it in.

I ran it on two plans written before the four-block rule, and on this plan as the control:

| Plan | Steps | Case rows | Interface blocks | Examples | Open questions | Own ledger answers | Gaps shown |
|---|---|---|---|---|---|---|---|
| videos-that-make-sense | 5 | 0 | 0 | 0 | 3 (all answered since: D-225–227) | 3 | 16 |
| walkthroughs-that-help | 7 | 0 | 0 | 0 | none left in plan.md | 6 (D-219–224) | 21 |
| plan-guide (control) | 5 | 21 | 5 | 5 | 4 | 0 | 5 |

All three render, and I checked each at 1440×900 and 390×844, light and dark. The console showed no errors and
nothing scrolled sideways. Pages and contact sheets are listed at the end.

**In short:** the frame of a guide can be generated from any plan today. That means the story, the outline, the
full text, the parts the steps touch, the scenes, the decisions, the questions and the Built side. The layers the
owner asked for (cases, interface, example) exist only when plan.md has the four blocks. The two older plans
have none of them, so their guides are the plan's text with honest gaps. The deepest layers do not come from the
blocks as step 2 now words them. Those are a full trace per case, what each interface part does, and a picture
per case or option. Something has to write them per plan.

## Layer by layer

### The story (opening, the problem, the parts drawing themselves, what changes)

- **Derived today, all three plans:**
  - the title, from the H1 split at its colon;
  - scene 1's picture;
  - the first blockquote under "The problem", and the line before it as its speaker;
  - the parts picture drawing itself, from `system.json`;
  - one beat for each numbered item in "What changes", which lights the parts of the steps it names.
  - Every beat's "Watch this part" comes from the plan map.
- **Reads well.** The quote beat is strong on every plan, since all three open with the owner's words, and so is
  the change beats' lighting.
- **Thin:**
  - The quote is cut at 46 words with "…".
  - A plan with no blockquote falls back to its first paragraph.
  - Each change beat's caption is the item's first ~32 words, sometimes cut mid-clause.
  - There are no plan-specific pictures like v3's "7 ×" bubbles or its quarter chart: those were hand-drawn from
    numbers in the prose.
- **Breaks.** walkthroughs-that-help's plan map points at snapshot files that no longer exist (the generator found a picture for 7 of 18 scenes by time, none for
  scene 1). The opening then shows a "no picture of scene 1" box.

### The parts picture

- **Derived:**
  - the parts each step touches, from "Components touched": each bullet's name is matched to a `system.json`
    component, and its "(steps 1, 2, 4)" or "(steps 1 to 3)" gives the steps;
  - the camera fitted to them, with the rest faded;
  - per case, the parts the row names (matched by component name or file name).
  - All 5 + 7 + 5 steps got parts, and no bullet failed to match.
- **Thin:**
  - `system.json` has the pipeline's components (skill, CLI, player, server…), not a plan's things. For this plan,
    the guide itself isn't a part yet, so the story can't show the new part. v3's hand-drawn picture used the
    plan's own artifacts (plan.md, the guide, reviews/<id>.md, decisions.md).
  - A step touching one or two parts zooms onto one or two boxes, which says little.
  - Case rows rarely name a component, so most case pictures fall back to the step's parts, with the row printed
    under them.
- **Needs per plan:** a picture of the step's own change (an edge drawn on, a file, a field), as step 1's picture
  fragments propose. The generator cannot invent one.

### Cases and their traces

- **Derived today:** nothing for the two older plans, since neither has a Cases table. The generator lists each
  step's bold-labelled bullets as "What the step's text lists". Some of those are cases ("An off-plan change
  always pauses", "Another choice pauses when…"), but many are parts of the design ("What they get", "Where it
  goes"). Only the author can tell them apart.
- **With the four blocks (control):**
  - every row shows, and opens its layer;
  - the "trace" can only be the row's "What happens" split at its semicolons: 8 of 21 rows split into more than one
    beat, and 13 are a single line;
  - the page says plainly that the fuller trace is not written.
- **Needs per plan.** v3's traces were written by hand from the step's prose: what is sent, which file changes, what
  you see, 3–5 beats a case. The prose usually holds those facts, spread over paragraphs, but pulling them into a
  trace is judgment. Estimate: 40–80 words a case, about 1–2 minutes of agent time a case, 2–4k tokens a step
  (mostly re-reading the step and its code).

### Interface and its parts

- **Derived today (older plans):** no Interface block anywhere. The generator lists the code-formatted commands and
  files each step's text names (7, 1, 3, 0, 0 for videos-that-make-sense; 3, 2, 0, 1, 4, 3, 1 for
  walkthroughs-that-help), each with the sentences that mention it. It is useful as a pointer, but it is not an
  interface: there are no flags, fields or outputs.
- **With the four blocks (control):**
  - the block shows verbatim;
  - each unindented line becomes a part, with its indented lines as its output (12 parts across 5 steps);
  - each part's layer is plan.md's own sentences that name it.
  - Step 1's block became one part: the file lines are in the bullets under the block, not in it. v3's hand-written
    version had seven parts, one per flag and file.
- **Needs per plan:** what each flag, field and output line means. Estimate: 30–60 words a part, 5–10 parts a
  plan, about 5 minutes and 5–10k tokens (most of it reading the code to get it right, as step 5's own estimate
  says).
- **Try-its** (v3's terminal, reel check toggles, the edit-in-place) are hand-built widgets. The generator shows the
  block as a dark card in the picture. A generic "choose the flags, see the lines plan.md prints" is feasible
  only when the block lists each flag's output, which today's blocks don't.

### Example

- **Derived today:** none in the older plans. Every step still gets its scenes from the plan map (title, time, picture,
  "Watch this part"), which is a real example of a kind: the video's own.
- **With the four blocks:** shown as written (5 of 5 in the control).
- **Needs per plan:** the example itself, which step 2 already asks for.

### Decisions, per step

- **Derived today:**
  - The plan's own answered questions come from `decisions.json` by `plan` and `step`: 3 and 6 on the older plans,
    each opening its full ledger entry (chosen, why, not chosen with reasons, note, status).
  - Each "Decisions in force" line that says "step N" or "(steps 2, 3)" is placed under that step: 3 of 14 lines on
    videos-that-make-sense and 13 of 21 on walkthroughs-that-help.
- **Breaks on the control.** None of this plan's 19 lines names a step, and it has no answered questions yet, so every
  step's Decisions block is a gap. v3 had placed them by hand, reading what each one says.
- **Cheap fix:** end each Decisions-in-force line with the step(s) it keeps, "(step 4)", as walkthroughs-that-help
  mostly does. Then the block can be generated, as step 2 proposes.

### Questions

- **Derived today:**
  - every open question in the plan's format (title, "(step N)", setup line, options with their text, "I recommend
    X: why") sits at the end of its step and can be answered on the page;
  - a question the ledger has since decided shows "Already decided: …" with its D-number;
  - once a plan is reviewed, walkthroughs-that-help's questions exist only in the ledger, and the page shows them as
    answered under Decisions.
- **Thin:** the picture for a question is a plain board of the options. v3's pictures that reshape per option
  (who reads what; three layouts of video and guide; an edit's path; the cost bar) were drawn per question.
- **Needs per plan:** one picture state per option, if the question should reshape the picture. Estimate: about
  5 minutes a question as a fragment from a template.
- **Check today:** "an option with no example" can be tested roughly. The generator marked options whose text has
  no number, quote or "say"; a real check wants an explicit example line per option.

### Built side

- **Derived today:** each step's "### Step N — … ✅/⏳" section of `walkthrough.md`, behind a layer, on both built
  plans (5 of 5 and 7 of 7). "Interface as built" beside the planned one needs step 5's new walkthrough heading and
  a planned Interface block to compare against.

### The full text, outline, search, comments and edits

These are fully generic. Every paragraph of plan.md lands in the page, extra sections included ("Why they fail",
"After your reviews", "Supersedes"), and comment/edit works on every line.

## What it costs, and who writes what

| Layer | From plan.md today | Needs the four blocks | Needs an agent per plan |
|---|---|---|---|
| Story | yes (quote, changes, parts) | no | a plan-specific opening picture (optional) |
| Parts picture | yes (Components touched + system.json) | no | the step's own change drawn on (a fragment) |
| Cases | no (only candidate bullets) | the table | the full trace a case: ~2k tokens and 1–2 min each |
| Interface | no (only named commands and files) | the block | each part explained, try-it outputs: ~5–10k tokens, ~5 min a plan |
| Example | the plan video's scenes | the example | none beyond the block |
| Decisions per step | the ledger by step, and lines that name a step | none if lines name their step | none |
| Questions | yes | none | a picture per option: ~5 min a question |
| Built side | yes (walkthrough.md) | step 5's "Interface as built" | none |

This roughly matches step 5's estimate of 10 minutes and 20,000 tokens a plan for the blocks. The deeper layers
(traces, interface parts, pictures) would add about as much again, 10–15 minutes and 15–25k tokens, for a
five-step plan.

## Recommendations for the plan

1. **Require the four blocks** (step 2), and make two of them more exact, because the generator stops exactly
   where they are loose:
   - **Cases:** keep the table, and let a row have a fourth column, **Trace**: the beats in order ("sent: …;
     filed: …; you see: …"). A generator can draw beats; it cannot split prose into them. `reel check` warns
     (it does not fail) when a row has no trace.
   - **Interface:** every flag, field and printed line goes inside the block, one part per line, with a
     one-line meaning after `#`. Then each part's layer, and a try-it, are generated. The bullets under
     today's blocks lose the file lines as parts.
2. **Generate, don't write:**
   - the story;
   - the parts each step touches (from Components touched, which already carries "(steps …)");
   - the scenes and "Watch this part";
   - Decisions per step;
   - the questions, answered or open;
   - the Built side.
3. **Make "Decisions in force" name its step on every line** ("(step 4)", or "(all steps)"), so its per-step block
   is generated rather than guessed. `reel check` should warn on a line with neither.
4. **The agent writes per plan**, and only where a step needs it: a picture fragment for a step's own change, and a
   picture state per option of a question. Everything else comes from the blocks.
5. **`guide --check` should report gaps as a list, not only fail.** For example: "step 3 · case 2: no trace",
   "step 1 · interface part `--out`: no meaning", "decision D-213: no step", "scene 1: no picture". It should fail
   only on what step 2 already fails on. An older plan built with `reelplanning guide` then shows its gaps on the
   page, as these three do.
6. **Parts picture:** `system.json` is too coarse for a plan's own story. Let a plan add its own artifacts to the
   picture (a small "parts" list in plan.md: plan.md, the guide, reviews/<id>.md), or accept that only the step
   fragments show them.
7. **Plan map:** have `reelplanning build` fail, or at least warn, when a frame's thumbnail file is missing.
   walkthroughs-that-help's map points 11 of its 18 scenes at snapshot files that are gone, and 7 have none. The
   generator fell back to the snapshots whose time falls in each scene, which covered 7 scenes.

## Files

Generated pages, in page-contract form, in the session scratchpad (not kept):
`guide-2026-09-28-videos-that-make-sense.html`, `guide-2026-09-27-walkthroughs-that-help.html`,
`guide-2026-09-28-plan-guide.html`. Contact sheets: `genguide-<slug>-{desktop,phone}-{light,dark}.png`.
Generator: `gp/gen.py`, with `gen.js` and `gen.css`; its derivation counts are in `gp/stats-<slug>.json`.
