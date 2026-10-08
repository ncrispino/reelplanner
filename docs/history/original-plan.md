# reelplanning — implementation plans as short educational videos

> **History.** The original proposal (2026-09-21), kept for the layer (L0–L4) and milestone (M0–M4)
> names later docs still use. It was the repo's top-level `PLAN.md`; the layout and formats it proposes
> (`packages/compose`, `script.json`, a validator) were not built as written. What exists is in the
> [README](../../README.md) and [status](../status.md).

**Status:** proposal · **Companion doc:** [`docs/research.md`](../research.md) (evidence base and style guide; `RESEARCH.md` at the root when this was written, cited below as `RESEARCH.md §x.y`)

## 1. Problem

As agents do more of the work, humans review plans rather than code. Long text plans fatigue reviewers and get rubber-stamped; the code-review literature shows comprehension collapsing past a few hundred lines and reviewer focus fading after ~60 minutes (`RESEARCH.md §1.7`). HTML plans help, but still drone on. Short educational video is far more digestible: MOOC data shows near-100% completion under six minutes versus ~20% past twelve (`§1.1`), and LLM-generated short-form explainers beat long-form on comprehension in a controlled study (93.85% vs 79.72%, `§1.4`).

**reelplanning** turns an agent's implementation plan into a 60–120s narrated explainer in the style of Fireship / 3Blue1Brown / Vsauce, lets the reviewer draw and comment directly on the video, and feeds those annotations back to the agent so the plan gets reformulated. The video is HTML (HyperFrames), so annotations bind to plan steps, not pixels.

## 2. Non-goals (v1)

- Not a general video generator; only plans in.
- No diffusion/generative video; deterministic HTML only.
- No terminal player in v1 (see §9 for the storyboard fallback).
- No multi-user review or hosting; local-first, single reviewer.

## 2.1 Principle: start simple, build on what works

HyperFrames already ships `/faceless-explainer` (text in → narrated, LLM-invented-visuals explainer out). We start from that and add layers only when the previous layer provably isn't enough:

| Layer | What it is | Add it only if |
|---|---|---|
| L0 | `/faceless-explainer` run bare on a plan pasted as prose | — (baseline) |
| L1 | A one-page prompt addendum carrying `RESEARCH.md §3` (beat structure, seconds budget, what/why split, no redundant text, anchored open questions) | L0 output has structural problems (expected) |
| L2 | A script validator so the seconds/word/structure constraints are enforced, not requested | L1 output drifts on length / structure across plans |
| L3 | Custom visual blocks | The visuals, not the structure, are what's failing |
| L4 | Annotation overlay + decision beats (L4b) + reformulation loop | Always — nothing existing provides this, but only once L1–L3 produce a video worth annotating |

Expected L0 failure modes (all prompt-fixable): "in this video we'll cover…" intros, on-screen text mirroring the narration, whole plan revealed at once, flat ending with no call to action.

## 3. Prior art we build on

| Project | What we take | What we add |
|---|---|---|
| **HyperFrames** (heygen-com/hyperframes, Apache 2.0) | HTML-to-MP4 renderer, `<hyperframes-player>` web component, `data-start`/`data-duration` clip timing, `/faceless-explainer` and `/pr-to-video` skills, catalog blocks, `lint`/`preview`/`render` CLI | A plan-specific skill, a strict plan schema, an annotation layer, and the feedback→reformulation loop |
| tldraw `pr-walkthrough` skill | "Narration first, then choose visuals" method | Applied to plans instead of merged PRs |
| Videowright | Segment-per-beat authoring; STT-timestamped narration sync | Feedback is spatial/temporal, not chat |

Nothing found does plan-review video or draw-on-video feedback to an agent (first-message search, Sep 2026).

## 4. Architecture

```
plan.md    ──▶  script.json  ──▶  composition (index.html)  ──▶  player + annotations  ──▶  annotations.json  ──▶  plan.md'
  (harness)      (beats)           (HyperFrames)                  (@hyperframes/player          (schema)               (agent revises)
                                                                  + overlay canvas)
```

Everything is a projection of `plan.md`. The video is never the source of truth.

This is the *target* shape if all layers turn out to be needed. §4.1–4.3 are L2/L3 and may never be built; §4.4–4.5 are L4 and will be. The layer each part belongs to is marked.

### 4.1 `plan.md` — the harness plan (no schema)

The input is the plan the harness already produces: Claude Code's default plan-mode Markdown (a goal, a "why not the obvious way" section when the agent wrote one, numbered steps with files touched, risks, open questions). We do **not** impose a schema on it. The skill reads the plan as prose and the anchors used by the annotation layer are the plan's own step headings (`Step 3`, `### Step 3 — …`), which every harness plan already has.

Reasons: planning is ours and will grow into its own ecosystem; forcing a JSON shape now would couple the video layer to a format the planner hasn't settled. If a validator (L2) ever proves necessary, it validates the *script* (beats, seconds, word counts), never the plan.

### 4.2 `script.json` — beats with a seconds budget (L1 as prompt, L2 as validator)

Generated from `plan.md` by the LLM under the style-guide prompt (`RESEARCH.md §3`). Each beat: `id`, `kind` (hook|tension|pretrain|step|callback|risk|question|outro), `narration`, `visual` (a named block + data), `signal` (which component/step ids to highlight), `seconds`.

Hard constraints enforced by a validator, not just prompted:
- Total ≤ 120s; default target 60–90s (`§3.1`).
- One `step` beat per plan step, 5–15s each.
- Narration word count within 185–254 wpm × seconds (`§3.5`), so ~280–380 words for 90s.
- No beat's on-screen text may exceed ~8 words (redundancy principle, `§3.3`).
- Intro/hook ≤ 8s.
- `question` beats must reference ≥1 step id (annotation anchor, `§3.8`).

If the plan doesn't fit in 120s, the validator fails and the skill asks the agent to split the plan. This is a feature: a plan too big to explain in two minutes is too big to approve in one sitting.

### 4.3 Composition — HyperFrames (L0/L1; custom blocks are L3)

- One `<div class="clip" data-start data-duration data-beat="s1" data-plan-ids="s1,api">` per beat. `data-beat` and `data-plan-ids` are our additions; HyperFrames ignores unknown attributes and they give the overlay its anchors.
- Visual vocabulary is a small block library (`packages/blocks/`): `component-graph` (nodes/edges built incrementally, one signal highlighted at a time), `diff-card`, `before-after`, `step-card`, `question-card`. All GSAP-driven, seekable, using HyperFrames' catalog conventions so `hyperframes lint` passes.
- Narration via `/media-use` TTS; per-word timestamps from STT to align highlights to the spoken word (temporal contiguity, `§1.3`, g=0.74).
- A `frame.md` design system: dark, low-decoration, one accent colour per subsystem, no background music (coherence, `§3.7`).

### 4.4 Player + annotation overlay (L4)

`packages/player/` wraps `<hyperframes-player>` and adds a transparent canvas plus a step gallery:

- **Draw**: freehand, arrow, box. A stroke is stored as `{t, beat, plan_ids, path, comment?}`; `plan_ids` come from hit-testing the DOM under the stroke's bounding box.
- **"Wait, what?"** button: logs `{t, beat}` with no drawing. Cheapest possible feedback; also our pacing signal.
- **Pause-and-type** and **voice note** (transcribed) attached to the current beat.
- **Step gallery**: thumbnails per step beat for jump-to (ReelsEd's most requested feature, `§1.4`); also where annotations are listed.
- Ending frame holds the full labelled plan static for dwell time (`§3.8`).

Output: `annotations.json`. Everything is time-anchored *and* plan-anchored; the plan anchor is what the agent uses.

### 4.5 Reformulation loop (L4)

The skill's `revise` step reads `annotations.json`, groups by `plan_ids`, and asks the model for a plan delta (`steps` added/removed/changed, `open_questions` resolved). Only beats whose `plan_ids` changed are re-scripted and re-rendered; the rest are reused. Re-render is per-beat because each beat is its own clip.


### 4.6 Decision beats — the interactive layer (L4b)

A plan is steps *and* choices. Reviewing it is not only "is this right?" but "which way do we go?". So the video carries the plan's open questions as **decision beats**, and the player turns them into an interactive fork:

```
step k beat ──▶ decision beat (teach the fork, cost both options, recommend, ask) ──▶ [pause: reviewer picks]
                 ├─ branch a beat (what changes in the plan under a)   ─┐
                 └─ branch b beat (what changes under b)               ─┴─▶ step k+1 … ──▶ resolved-plan ending
```

- **Authoring:** the storyboard tags a `cta` frame with `decision: q1`, `question:`, `option_a`/`option_b`, `why_a`/`why_b`, `recommended:`; each option gets one `benefit_highlight` frame tagged `branch: q1=a`. All branches are rendered into the one linear composition (so the MP4 is complete and plays as "if A… / if B…"). `scripts/plan-map.mjs` lifts the tags into `plan-map.json` → `decisions[]` with each option's branch window and the `resumeAt` after the last branch.
- **Playback:** `<reelplanning-player>` pauses at the end of a decision beat, shows the options (recommended one marked, each with its cost), records the call, seeks to the chosen branch, and skips the others. The choice rewrites the resolved-plan frame's tags in the DOM, so the ending shows *their* plan. A recorded decision is routed past on replay; "change" re-opens it.
- **Output:** `annotations.json` gains `decisions[]`; `scripts/resolve-plan.mjs plan.md annotations.json plan-map.json` writes `plan.resolved.md` with the decided options marked, the annotations grouped by step, and the approval status. That file is what the agent's `revise` step (M3) consumes and what the human approves.
- **Why not a deck?** HyperFrames' `/slideshow` has branching and hotspots, but it is a navigable deck, not narrated video, and would give up the linear MP4 fallback. Branch-skipping over one timeline keeps one render, one caption track, and one annotation space.
- **Length accounting:** the cap applies to the *watched* path (decision + the chosen branch), not the MP4. `plan-map.json` reports both.
- **Chapters:** when the well-explained decisions do not fit one video, the storyboard tags chapter starts; the player pauses at chapter ends and `scripts/chapters.mjs` cuts one MP4 per chapter. Each chapter is one sitting under the cap; choices carry across because they live in the player, not the video.

## 5. Repo layout

```
reelplanning/
├── RESEARCH.md              # evidence + style guide (the research doc)
├── PLAN.md                  # this file
├── skills/
│   └── plan-to-video/
│       ├── SKILL.md         # L1: "run /faceless-explainer with references/style-guide.md"
│       ├── references/
│       │   └── style-guide.md      # RESEARCH.md §3, prompt-ready (the L1 addendum)
│       └── prompts/                # L2+: coerce-plan.md, script.md, revise.md
├── packages/
│   ├── player/              # L4: <reelplanning-player> = hyperframes-player + overlay + gallery
│   ├── validate/            # L2, only if needed: checks the SCRIPT, never the plan
│   └── blocks/              # L3, only if needed
├── spikes/
│   └── 01-baseline/         # L0 and L1 outputs on the same plan, side by side, with notes
├── eval/
│   ├── plans/               # real plans, 5–7 steps, each with one non-obvious decision
│   └── metrics.md           # see §7
└── docs/
```

Directories marked L2/L3 are created when their layer is justified, not up front.

## 6. Milestones

**M0 — Baseline (days).** Pick one real plan: 5–7 steps, one non-obvious decision (a trivial plan looks fine in any format and teaches nothing). `npx hyperframes skills update`, read `faceless-explainer`'s SKILL.md, run it bare on the plan pasted as prose with only two instructions: cap at 90s, end on the open questions. Save output and a list of what's wrong to `spikes/01-baseline/`.

**M1 — Style-guide layer (≤1 week).** Write `references/style-guide.md` from `RESEARCH.md §3` and re-run on the same plan. Compare against M0 against the expected failure modes in §2.1. Then run on 2–3 more plans from `eval/plans` to see whether the prompt holds up across plans. Decision point: if it holds, skip L2/L3 and go to M2; if length or structure drift, add the validator (L2) — schema only as far as the validator needs it.

**M2 — Player + annotations + decisions (2 weeks).** `<reelplanning-player>` wrapping `<hyperframes-player>` with draw, "wait what?", pause-and-type, step gallery, static end frame. Emits `annotations.json` with plan-step anchors read from the clip's data attributes. This is the first real code and the part nothing else provides.

**M3 — Loop (1–2 weeks).** `revise` prompt and per-beat re-render. Demo: reviewer draws on step 3, agent revises step 3, only beat 3 re-renders, video updates in place.

**M4 — Eval + tune (ongoing).** Run §7 on 10+ plans. Tune seconds budgets, block choices, hook style (misconception-first vs plain goal) using annotation data.

## 7. Evaluation

What we measure, per `RESEARCH.md` staged recommendations:

| Metric | Why | Changes what |
|---|---|---|
| Completion rate | Guo's engagement proxy | Length / beat count |
| Annotation rate and location | Is the ending inviting action? Are beat boundaries right? | `§3.8` ending; segmentation if strokes cluster mid-beat |
| "Wait what?" density per beat | Pacing / clarity | Seconds budget, pre-training beat |
| Decision quality | Reviewer catches a planted flaw (A/B: video vs text plan vs HTML plan) | Everything — this is the real test |
| Action-after-watch | Prospective memory (`§1.5`) — do reviewers actually approve/annotate/revise or abandon? | Cut speed, CTA strength |
| Time to decision | Fatigue claim | Cap |

Planted-flaw study is the headline experiment: same plan, one deliberate mistake, three formats, measure detection.

## 8. Risks

- **HyperFrames churn.** 4.5k commits, skills refreshed hourly. Pin a version; wrap the CLI behind `packages/compose` so upgrades are one place. *(Pinned: `package.json` holds `hyperframes` at an exact version and `scripts/hyperframes-skills.mjs` installs the skills from its git tag, because `init` / `skills update` pull GitHub main. That already broke `media-use` once: `docs/upstream/hyperframes-media-fetch-shim.md`.)*
- **AI narration is liked less** even when learning is equal (Netland, `§1.4`). Mitigate with a good TTS voice, clarity, and a visible "AI-generated" label.
- **Accuracy vs Kurzgesagt-style simplification.** A reviewer is making a real decision; the `what` field must be literal. Style guide forbids "lies-to-children" (`§3.6`).
- **Render latency.** Headless-Chrome render of 90s is tens of seconds. Preview in-browser first (no render) and only render MP4 for sharing.
- **Overfitting to Fireship.** Enthusiastic ≠ frantic. Cutting speed is capped by the coherence and prospective-memory evidence (`§3.7`), not by creator folklore.

## 9. Later

- Terminal storyboard: emit `script.json` as ASCII frames + narration text for `claude code` / TUI users.
- Recording watch behaviour (scrubs, replays) as an implicit signal, with consent.
- Multi-reviewer annotations, shared via hyperframes.dev or a published page.
- Chapters for plans that legitimately exceed 120s: a playlist of ≤90s videos, one per epic.

## 10. Open questions

1. Decided: build on `/faceless-explainer`, not our own generator. Decided: this stays our own skill and repo; we use HyperFrames as a renderer and do not contribute the workflow upstream, because the planning layer will grow into its own ecosystem.
2. Voice: HeyGen TTS via `/media-use` vs ElevenLabs. Pick by quality on the M0 sample.
3. Decided: no plan schema. The input is the harness's default plan-mode Markdown; the skill reads it as prose.
