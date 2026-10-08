# Spike 01 — baseline (L0) vs style guide (L1) on the same plan

> **History.** The first test (milestones M0–M1 of the [original plan](./original-plan.md)), and
> notes from the runs after it. It was `spikes/01-baseline/NOTES.md`. The L0 video it compares
> (`videos/l0-upload-resume`) was removed from the tree on 2026-09-26. Its frames and script are in the development history, which is not public (the public repo is one commit, D-310), and no voice file or render is committed (D-305), so the render this page describes is not in the repo. Scripts it names may since have been renamed or removed.

**Plan:** `eval/plans/upload-resume/plan.md` (6 steps, one non-obvious decision: write-ahead manifest instead of a client retry loop; three open questions).
**Preset, voice, engine held constant:** `code-editorial`, Kokoro `am_michael`, whisper.cpp `small.en`, HyperFrames 0.8.52.

| | L0 `videos/l0-upload-resume` | L1 `videos/l1-upload-resume` |
|---|---|---|
| Instructions | `/faceless-explainer` bare + "cap at 90 s, end on the open questions" | same + `skills/plan-to-video/references/style-guide.md` |
| Frames | 11 | 12 |
| Beat order | hook → pain → idea → 6 steps → callback → questions | hook → tension → **pre-training** → 6 steps → callback → **risks** → questions + **CTA** |
| Stage for the steps | a numbered step list accumulating on the left, a fresh mechanism drawing per step on the right | one component diagram (6 nodes) built in the pre-training beat and reused unchanged; each step adds edges and moves a single coral signal; a persistent step rail with `data-plan-step` anchors |
| Narration words | 231 | 269 |
| Voice duration | 92.5 s | 109.8 s |
| Pace (Kokoro, speed 1.0) | ~150 wpm | ~147 wpm |
| Plan anchors for annotation | none (frames tagged by type only) | `plan_step` on every step frame, `plan_questions` on the cta frame, `data-plan-step` / `data-plan-component` / `data-plan-question` in the DOM |

_(Visual comparison, contact sheets and the render verdicts are filled in below once both renders exist.)_

## Caveat on the baseline

The same model wrote both storyboards after reading `RESEARCH.md` (now `docs/research.md`), so L0 is not a clean "naive" run: it already avoids on-screen narration text and front-loading because `/faceless-explainer` itself forbids those. What L0 genuinely lacks, and L1 adds, is the plan-specific structure: pre-training, one persistent diagram, one signal at a time, risks, pinned open questions with a call to action, a still end frame, and plan anchors.

## Expected L0 failure modes (PLAN.md §2.1) — observed?

| Expected | Observed in L0 |
|---|---|
| "in this video we'll cover…" intro | **No.** The skill's hook rules already forbid it. |
| On-screen text mirroring narration | **No.** The frame-worker contract forbids narration text; captions carry the words. |
| Whole plan revealed at once | **Partly.** The step list accumulates, but each step's mechanism is a fresh drawing; nothing persists that lets the reviewer see how the components relate. |
| Flat ending, no call to action | **Yes.** L0 ends on three question cards with no spoken or written call to action and no plan anchors. |

## Pipeline findings (apply to both runs)

1. `build-frame.mjs` says it stages the preset's WOFF2 fonts into `assets/fonts/` but did not; copied by hand. `scripts/setup.sh` and the skill should do this explicitly.
2. The packet builder caps a worker packet at 48 KB. A hook frame that cites `kinetic-type-beats` (29 KB) plus five motion rules overflows; keep ≤ 2 rule citations on kinetic-type frames.
3. The worker contract asks for ids prefixed with `<frame_id>-`, and frame ids start with digits (`04-…`), so lint emits `id_requires_css_escape` for every id (168 warnings in L0). L1 workers were told to prefix with `f<frame_id>-`.
4. Headless Chrome behind this proxy cannot fetch GSAP from jsdelivr (`ERR_CERT_AUTHORITY_INVALID`), so `check` reported `gsap is not defined` and the layout audit ran on un-animated DOM. `scripts/vendor-gsap.sh` copies GSAP into `assets/vendor/` and rewrites the tags; `verify.sh` runs it first. This also makes renders offline-safe.
5. Contrast gate: dimming earlier step cards to 50 % opacity fails the 3:1 check on cream; 72 % passes. Baked into the L1 stage snippet.
6. Kokoro speaks at ~150 wpm at speed 1.0, under the guide's 185–254 wpm. The `hyperframes tts` CLI has `--speed`, but the workflow's audio engine does not pass it. A 90 s target therefore means ~230 words, not 280–380. Tuning knob for M4.
7. Whisper transcription of 11–12 short lines runs concurrently and takes ~5 min on 4 cores; fine, but TTS+STT is the slowest stage.

## L0 — what the render shows (`videos/l0-upload-resume/renders/video.mp4`, 92.5 s, check passed)

Contact sheet: `videos/l0-upload-resume/snapshots/contact-sheet-1.jpg`, `-2.jpg`.

- **Works:** cold open on the concrete failure (two attempt bars, "×2 billed"); the obvious-fix beat with struck-through consequences; the step list accumulating on the left as a persistent stage; one mechanism per step on the right (manifest table, parts bitmap, GET/complete exchange, BILLED stamp, sweeper clock, SDK resend); a callback bar at 100 %; three question cards tagged STEP 1/4/5.
- **Missing vs the style guide:** no pre-training beat, so the six components are never named as a cast and the per-step drawings do not relate to each other; no risks beat; no spoken or written call to action; the end frame holds but nothing on it says what the reviewer should do; nothing in the DOM identifies plan steps (annotation would be time-anchored only).
- **Pacing:** 11 beats in 92 s, all within 6–11 s. Hook 8.5 s. No front-loading observed at the sampled midpoints (each step frame is mid-build at its midpoint).
- **Captions:** the caption track is built from whisper's transcription of the Kokoro audio, not from the script, so misheard words leak in ("ride ahead," for "write-ahead", "the SDK" split oddly). Pipeline fix for later: align the script text to whisper timings instead of using whisper's text (captions.mjs owns this). Not a difference between L0 and L1.
- **Dead space:** hook and callback frames leave the lower half empty (bars in the upper third, lockup at the right); the "×2"/"×1" figure overlapped its unit until a margin fix — the number-lockup recipe needs a minimum gap.

## L1 — what the render shows (`videos/l1-upload-resume/renders/video.mp4`, 109.8 s, check passed)

Contact sheets: `videos/l1-upload-resume/snapshots/contact-sheet-1.jpg`, `-2.jpg`.

- **The stage holds.** Frames 3–12 share one diagram (six nodes at fixed positions) and one six-slot rail; the pre-training beat assembles the cast, then each step adds edges (API→Manifest, API→Blob, SDK→API, API→Billing, Sweeper→Manifest/Blob) and fills the next rail slot. By frame 9 the whole architecture is on screen and the reviewer has seen every edge appear for a reason. This is the biggest visible difference from L0, whose per-step drawings never related to each other.
- **One signal at a time** worked with the preset's "one coral per frame" rule: the coral moves node → edge → word within a frame (contrast gate flags the small coral STEP tags at 3.1:1 against 4.5:1 for small text; a warning, and the preset's own colour).
- **Ending:** questions pinned to rail slots 1/4/5 with leader lines, a written CTA ("Draw on a step · or approve"), an AI-generated note, and a dead-still 4 s hold. The player's step gallery shows these as STEP 1–6 tiles because the storyboard tagged `plan_step`.
- **Length drift:** 109.8 s against a 90 s target (cap 120). Two causes: Kokoro's ~147 wpm, and the pre-training + risks beats adding ~16 s. Under the guide's 185–254 wpm the same script would be 70–85 s. Either speed the voice or drop the risks beat on ≤ 90 s targets.
- **Shared stage needed a shared snippet.** Twelve independent workers cannot reproduce one diagram from prose; giving them `.hyperframes/stage-snippet.html` (fixed geometry, ids, data-plan-* attributes) is what made the stage pixel-stable. This is the first concrete piece of L3 (a "component-graph" block) and should become a real block in `packages/blocks/` if we keep the diagram stage.
- **Same caption defect as L0** (whisper text instead of script text).

## Verdict for the M1 decision point (PLAN.md §6)

The style-guide layer (L1) fixes every structural gap the baseline had, and it did so as a prompt addendum plus one shared stage snippet — no schema, no validator. Length drifted +20 % on this plan, for reasons that are fixable in the prompt (word budget stated for the actual voice speed) rather than needing a validator. **Recommendation:** run L1 on two or three more plans from `eval/plans/` before deciding on L2; promote the stage snippet to a `component-graph` block (L3) since the diagram stage is clearly load-bearing; proceed to M2 (the player already exists and is tested against both runs).

## L2 — the interactive run (`videos/l2-upload-resume`, check passed)

Built after the review of L1 ("too much text, not centred, captions too short, where are the alternatives, and the questions should be asked *in* the video"). Same plan, preset and voice; four changes:

| Change | How | Result |
|---|---|---|
| Less text, better use of the frame | style guide §10: ≤ 5 new words per beat, no node sub-labels, stage v2 fills the right 62 % and is vertically centred, hook/tension composed around the centre | 19 frames, the only persistent text is six node titles and six rail titles |
| Captions as sentences | `scripts/captions-sentences.mjs`: script words aligned to whisper timings, regrouped at sentence/clause boundaries (≤ 14 words) | 60 groups, avg 7.2 words, e.g. "A two-gigabyte upload dies at ninety percent." instead of "A 2GB upload" |
| Why not the alternatives | the plan gained `Alternatives considered` per step and option rationale per question; each step beat spends one clause on the why-not with a struck ghost tag on screen ("after part 1", "range", "client memory", "lifecycle") | the reviewer hears why the obvious route loses without a list |
| Decisions in the video | style guide §9: after steps 1, 4, 5 a decision beat (teach, cost, recommend, ask) + one branch beat per option; `plan-map.json` → `decisions[]`; the player pauses, asks, plays only the chosen branch, skips the rest, rewrites the resolved-plan tags, exports `decisions[]`; `scripts/resolve-plan.mjs` folds the calls into `plan.resolved.md` | tested end to end on the real build (`decisions.spec.mjs`): pause at 37.9 s, choose S3, play branch 1b, skip to step 2 |
| Pace | `scripts/audio-speed.mjs` ×1.25 after TTS (~185 wpm) | 425 words: 142.8 s linear (all branches), 125.2 s on the recommended watched path |

Length: the watched path is 5 s over the 120 s cap. Three decisions cost ~50 s; the honest fix is two decisions per video (fold the third into the risks beat) or a 100 s step budget. Recorded as a style-guide tuning item, not hidden.

Pipeline findings added by L2:
8. `audio.mjs fetch-sfx` rewrites `audio_meta.json` from the unscaled engine metadata; run it before `audio-speed.mjs`, and `audio-speed.mjs` now detects and repairs the mismatch.
9. Caption groups must be sorted globally and clamped to the voice length, or the crossfade overlap between frames puts two sentences on screen at once (`check` flags it as `content_overlap`).
10. Duration sync trims the final frame to its voice line; a resolved-plan ending needs an explicit longer `duration:` plus a matching `data-duration` in the frame, and the voice `<audio>` slot set back to the wav length.
11. A worker put the composition attributes on `<template>` instead of a root `<div>`; `lint` catches it (`missing_or_empty_sub_composition`), the fix is mechanical.
12. The preset's coral on cream is 3.1:1, under the 4.5:1 small-text gate; the four warnings are all coral tags. Either darken the tag coral or accept the preset colour.

## L2 v3 — script rewritten for plain language (same frames, new narration)

Style guide §11 applied to every line: no mannered phrases, one idea per sentence, an example with real values in every step ("upload 7f3a, two gigabytes, no parts yet"; "one one one zero one one, part four is missing"), every decision as a same-sentence comparison plus a recommendation with a reason, and "Which do you want?" as the ask. The previous script is kept at `videos/l2-upload-resume/.hyperframes/SCRIPT.v2.md` for comparison.

| | v2 | v3 |
|---|---|---|
| Words | 425 | 656 |
| Linear (all branches) | 142.8 s | 209.4 s |
| Watched, recommended path | 125.2 s | 190.7 s |
| Caption groups (sentences) | 60 | 90 |
| First decision pause | 37.9 s | 55.7 s |

The explanations cost 65 s on the watched path. That is the trade the review asked for: each decision now gets its step, its example, both costs and a reason before the question. It also puts one video 70 s over the 120 s cap, which is the argument for chapters (PLAN §9): split at the decisions, one chapter per group of steps, choices carried across. Frames were not rebuilt: their reveals still land on the old cue times, so a longer line means the frame finishes its build early and holds; nothing is cut off.

Pipeline finding 13: the workflow's whisper pass returns no words for lines longer than ~10 s when several run at once (a timeout inside the engine). `scripts/transcribe-missing.mjs` re-runs those lines with a long timeout; it is part of `scripts/rebuild-narration.sh` now.

## L2 v3, second pass — reveals re-paced to the spoken word, chapters

- **Re-pacing.** The nine frames whose narration grew (hook, four steps, three decisions, step 5) were rebuilt against per-frame cue sheets (`.hyperframes/cues/NN.md`: every word with its start time on the final audio). Reveals now land on the word that names them: the manifest row types "7f3a", "two gigabytes", "no parts yet" as each is spoken; the six reply digits appear one per spoken digit; the POST-twice example in decision 2 draws two chips and a 409 badge on cue. This is temporal contiguity (RESEARCH §1.3, g = 0.74) done mechanically rather than by guesswork.
- **Chapters.** `chapter_start` tags on frames 1, 8, 14 → three chapters of 61 s / 70 s / 59 s watched. The player pauses at each chapter end with "Continue"; `scripts/chapters.mjs` cuts `renders/chapters/ch1..3.mp4` from the linear render. Choices carry across because they live in the player.
- **Contrast.** Small coral tags use #A5614A (4.5:1 on cream) while large coral elements keep the preset's #CC785C. All 92 text checks pass.

Pipeline findings 14–16:
14. When narration durations change, the assembler re-stamps each frame's root window but not always the frame's own full-length clips; a clip that ends before the window makes the frame go blank for its last seconds, in the render and for the player's hit test. `scripts/fix-clip-durations.mjs` (after transitions inject) extends full-length clips to the root window; it is in `rebuild-narration.sh`.
15. A stroke drawn right after a gallery jump can land before the frame's sub-composition is instantiated; the player now re-runs the anchor hit test a few times over ~1.4 s and updates the annotation in place.
16. Glyph crossfades (0 → 1) must fade the old glyph out, not only the new one in, or the layout audit flags overlapping text and the render shows both.

Pipeline finding 17: the HyperFrames player's `seek()` pauses playback, even mid-play. Every routing jump the review player makes (past an unchosen branch, past a frame the chosen knowledge level skips, past a decision already made) must resume explicitly, and must land a hair *past* the target: seeks quantize to frames, and landing just before a boundary re-triggers the same route on the next `timeupdate` (an endless seek-pause loop). `jump(t)` in the player does both; a jump to the end seeks to the duration and stays paused, since `play()` at the end restarts from 0. Caught by the knowledge-level and branch-skip e2e checks (`quiz.spec.mjs`, `decisions.spec.mjs`).

## G1 — greenfield: "Create a website about Bob Dylan"

The first greenfield run (`videos/g1-bob-dylan-site`, plan `eval/plans/bob-dylan-site/plan.md`), built with the v4 additions: a quiz beat, three chapters, and the same stage grammar as L2 with a new cast (Content, Data build, Generator, Search, Hosting, Design).

| | L2 (brownfield) | G1 (greenfield) |
|---|---|---|
| Frames | 19 | 20 (one quiz beat) |
| Words | 656 | 768 |
| Linear (all branches) | 209.4 s | 231.6 s |
| Watched, recommended path | 190.7 s | 214.4 s |
| Chapters (watched) | 61 / 70 / 59 s | 75 / 65 / 75 s |
| Decisions | 3 | 3 |
| Check | 0 errors | 0 errors |

What differed from brownfield, in practice:

- **The cast beat is the naming moment.** With nothing existing, frame 3 assembles the six parts one per spoken name and the edges draw after, so the viewer meets the diagram as it is built rather than as a map of something they might know. This is also where a greenfield `.reelplanning/system.json` gets its entries.
- **Tension is about the obvious build, not the obvious change.** "A template site with five pages" is struck three times (no cross-links, wall of text, slow on phones); in L2 the struck thing was a retry loop.
- **Decisions are scope and taste** (how much content before launch, the timeline, book-like vs magazine), each with a cost in weeks or a rights question rather than a migration risk.
- **The quiz beat** (frame 9, after the data build) pauses the player with a question the previous frame answered ("a song names an album that does not exist — what happens?"); a wrong answer gets the correction and the explanation, then playback resumes. It costs 8 s and is the kind of interpolated question RESEARCH §1.2 favours.
- **No knowledge toggle.** Everyone is `new` to a thing that does not exist; `plan-map.json` has no `levels` and the player hides the selector.

Pipeline findings 18–19:
18. Frame workers run from per-frame cue sheets from the start now (`scripts/cues.mjs` after `sync-durations`), so no re-pacing pass was needed: every reveal was authored against the word that names it.
19. A wide option-card label ("Ten albums, then launch") overlaps the card's small kicker once the card scales on the recommendation cue; the layout gate caught it at one sample window. Fix: the label sits 14 px lower in decision frames (`margin-top`). Short labels (L2's "Postgres") never touched the kicker, which is why L2 passed.

## Design loops (G1 video and the review page)

Both artefacts went through generate → critique → fix rounds run by subagents against `docs/design-rationale.md` (every choice with its reason, plus the anti-slop checklist).

**Video (3 rounds, `videos/g1-bob-dylan-site/DESIGN-REVIEW.md`).** Round 1 found 15 things, 8 of them grammar (every frame): coral was never scarce (caption underline, ✱ kicker, option letters and the stage's own signal all coral at once), decision frames front-loaded the whole map, one edge path ended in the gap between two nodes and read as pointing at the wrong one, mono tags at 16–22 px were unreadable at 1080p, nodes carried lists that shifted their titles, two-line captions ran off the frame, and the kicker used a banned phrase. The fix pass rewrote all 20 frames against a common brief; round 2 confirmed 14 closed, 1 partly, no regressions, and found a stray edge stub (a draw length computed for the old path) plus a tilted stamp and a half-empty card; round 3 closed those. The rules are now style guide §15 and the worker dispatch, so the next build starts from them. Check: 0 errors, 95/95 contrast.

**Review page (3 rounds, `packages/player/design/critique-r0.md`, `critique-r1.md`).** Round 0 judged the first page "a competent default": coral sprayed over every label, glyph icons, a gradient scrim, a 20-tile gallery of raw ids, a stale status line, no responsive rule. Round 1 rebuilt it: own transport bar with chapter segments, the rail as the plan (steps grouped, decisions, marks), one card style for every overlay, a status line in words, coral for state only, responsive at 1100 and 600. Round 2 found the remaining defaults (banned wording, a modal veil that dimmed the very thing the video lights, a top line from the composition's black body, the declined branch still clickable) and round 3 closed them. `packages/player/design/shots.mjs` captures the page's real states for each round.

Pipeline findings 20–21:
20. A path length hard-coded in a frame's draw tween silently breaks when the shared stage's path changes: the tail of the new path shows before the draw. Compute lengths with `getTotalLength()` or hide edges (opacity 0) until their draw.
21. The composition body must be paper, not black: at some player sizes a sub-pixel gap shows the body colour as a 1 px line along the stage's top edge.

## L2 rebuilt under the tightened grammar (three design rounds)

The brownfield reference run was rebuilt against style guide §15 and the anti-slop checklist, the same loop the greenfield run went through. Round 1 found 16 things, 10 of them grammar: coral was never one element (caption underline, ✱ spike, the recommended letter, three tags at once on the resolved frame), a layer of 14–22 px mono sat inside and around the nodes (manifest rows typed into the navy tile, `409`, `7f3a`, `POST`, `BILLED`), and small drawings (a bracket, a loop arrow, a ring, six part boxes) stood where a word in a chip would. Round 2 confirmed 14 closed, 2 partly, no regressions, and found the leftovers: off-palette brighten tints on "I recommend", a halo ring, the navy tile dimming to grey in 12 of 17 frames, chips running under neighbouring nodes, a bare bitmap floating between two nodes, and record chips whose wording changed between frames. Round 3 closed all of them.

Three rules came out of it and are now in the style guide: **the navy tile never dims** (it is the map's landmark; dimming makes it read as a different colour and the landmark flips shade at every cut), **no brighten tints, halos or breaths on the recommended card** (the coral border landing is the whole signal), and **one spelling per record** (`7f3a · 111011` is written the same way in every frame it appears).

Brownfield-specific: the edge set is not "nothing until a step draws it". The edges that exist **today** (client → API, API → blob, API → billing) are drawn in the cast beat as a beat of their own and are present dim from then on; a step that uses one **lights** it rather than drawing it, and only the edges the plan **adds** (API → manifest, the sweeper's two) are ever drawn. Drawing an existing edge tells the viewer the plan creates it, which is a lie about the system.

| | L2 v3 (before) | L2 v4 (after the rounds) |
|---|---|---|
| Linear | 209.4 s | 209.4 s |
| Watched, recommended path | 190.7 s | 190.7 s |
| Parts (watched) | 61 / 70 / 59 s | 61 / 70 / 59 s |
| Contrast checks | 92/92 | 93/93 |
| Coral elements per frame | 2–4 | 1 |
| Mono below 26 px | many | none |

## G1 v2 — a series of three parts, and prototypes at the design decisions

Two changes to the format, both from review feedback: a plan video is a **series of short parts**, not one long piece; and a decision about **how something looks** is made between two real page mocks, not two labelled cards.

**Parts.** Each part opens on the stage as resolved so far ("Part two of three: the data build and the generator") and closes by naming the next one. The openers and closers cost about 3 s each and buy the thing they are for: no part runs over 62 s, so a reviewer can watch one, decide, and stop. The player presents chapters as parts (the end-of-part sheet says "Next, part 2: …"), and `scripts/chapters.mjs` cuts them to separate files.

| | v1 (one piece) | v2 (three parts) |
|---|---|---|
| Frames | 20 | 24 (4 are openers/closers) |
| Script words | 768 | 590 |
| Linear | 231.6 s | 184.0 s |
| Watched, recommended path | 214.4 s | 173.8 s |
| Longest sitting | 74.9 s | 61.2 s |

The 178 words came off the explanations that were restating what the stage already showed, not off the reasoning: every decision still gets its comparison, its cost in weeks and its recommendation with a reason.

**Prototypes.** The plan is about a website, so three of its beats are about how something will look, and a card saying "Book-like" tells the reviewer nothing they can judge. Those beats now show the thing: the obvious build as a template-site mock with the biography as one wall of text (frame 2); ten albums versus forty as two site maps with the tiles actually drawn (frame 5); the era page with and without its year strip (frame 13); and the album page book-like versus magazine, side by side at reading size, with a `rights?` tag on the magazine's photograph (frame 19). The reviewer chooses between two pages, not two adjectives.

Pipeline finding 22: two readable page mocks need the width the node diagram occupies. Laid over it they cover the bottom row of nodes and the labels bleed through the mock (the layout audit does not catch it: the node text is behind an opaque box, not overlapping another text run). So a **prototype decision beat keeps the rail and drops the diagram** — the rail carries the step and the earlier choices, which is the context the reviewer needs — and the next frame brings the diagram back unchanged. This is now style guide §16.
