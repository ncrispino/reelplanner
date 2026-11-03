# Faster scene authoring without losing the explanation

**In one sentence:** Give independent script reviewers and frame authors the same intended visible evidence, and give authors optional layouts that keep growing explanations from covering one another; retain the full quality bar and measure completed review delivery.

## The problem

The first baseline and improved Codex runs each reached the 60-minute cap without a first showing. The improved run really used an early six-frame assembled browser check and shared generation, but script review still required substantial explanation repairs and later frames needed manual coordinate repairs. A successful build at about 51 minutes was not successful delivery. Scenes 25 and 26 still had covered text at the cap. The current pilot cannot demonstrate whole-video speedup or quality parity.

Two concrete mechanisms merit the next experiment:

1. `scripts/fresh-eyes.mjs` gives the script reviewer only `meta.scene` and narration. `scripts/frame-packet.mjs` gives the frame author the whole storyboard block. Important visible inputs, results and qualifiers therefore reached one worker but not the other; the improved author rewrote all 29 scene summaries. The second review also found real category, precedence and population problems. Those substantive corrections remain necessary.
2. The documented shell provides a safe outer region, but no executable internal allocation. Both authors already used shared Python generators. The new mechanism must therefore be bounded normal-flow allocation, not merely advice to reuse a generator. In the unfinished diagnostic HTML, the naturally growing right columns of scenes 25 and 26 began around 24% and 23%, while separate observed-result boxes were fixed around 66% and 64%. Added qualifiers grew underneath them.

Evidence: `eval/pipeline-cost/2026-10-12-codex-batched-pilot.md` and its JSON record. The private matched-early-phase report and terminal audit explain the hypotheses; unfinished diagnostic HTML is not a delivered artifact. All four frozen pilot attempts are now terminal failures at their declared caps; their evidence remains under the original protocol. No running VM, frozen source or frozen rubric changes for this plan.

This is a narrow follow-up to `.reelplanner/plans/2026-10-10-cheaper-videos/plan.md`, not a replacement for its thirteen-step scope. That plan explicitly shares plumbing, never layouts. The optional composition primitives here extend that earlier boundary: the agent still chooses and customizes each visual relationship, and freeform HTML remains first-class. The extension is an experiment under the current authorization, not a claimed ledger approval. It must earn its place through actual visual-variety and blinded usefulness checks; remove it if it makes videos generic. The unrelated system-video-guide plan and original Codex plan/walkthrough remain untouched.

Three changes: align the script-review input; ship an optional bounded scaffold and actionable diagnostics; qualify the combination through controlled authoring and then full matched trials. Step 2 uses step 1's content contract. Step 3 depends on both. No new approval is needed for these implementation choices under the existing authorization; no implementation or experiment is launched by this draft.

## Components touched

- **The plan-to-video skill**: reviewer-visible content, frame packets, executable scaffolding, author handoffs and quality checks.
- **The reel CLI**: an optional frame-scaffold command and packaged resources.
- **finish-project**: existing assembly remains the source of actual sample times; integration checks retain its contracts.

## Decisions in force

- **D-127**: plain words in the video and plan; existing technical names stay in interfaces (all steps).
- **D-216**: retain detected-term checks and meanings for unfamiliar words (all steps).
- **D-225**: answer every fresh-eyes finding before delivery; a clean layout is not a reason to skip explanation review (all steps).
- **D-227**: independent fresh eyes remain required for every new video and rebuild (all steps).
- **D-265**: the guide keeps depth, concrete examples and interactions beyond the overview; do not move essential qualifications off the frame just to make it fit (all steps).
- **D-266**: keep the guide interaction quiet and reserve its actual clearance (step 2).
- **D-303**: the walkthrough demonstrates the installed command and packaged resources working (step 3).
- **D-305** and **D-312**: generated media stay out of Git; commands, package and prose use reelplanner (all steps).
- **D-001** and `spec.md#invariants`: a fresh agent checks implementation; revisions retain composition IDs and owner records are changed only by their owning commands (all steps).

- **D-024** and **D-195**: ordinary detail pages still start from supported types, with custom pages when needed, and open over the frame from the marked thing; scene scaffolds do not replace detail-page templates or change their interaction (step 2).
- **D-064**, **D-066** and **D-082**: background workers own builds and review follow-up; without a session, work waits or uses the configured headless command. Keep agent selection configurable and preserve automatic approval review inside the active harness's sandbox. D-066's Claude-only proof described that earlier plan; it does not bar this iteration's explicit Codex validation or justify claiming untested clients work (step 3).
- **D-085**: retain one build command and one saved review plus its short action summary; the optional frame helper adds no duplicate review records or parallel plan versions (steps 1, 2).
- **D-106** and **D-107**: personal memory remains the machine-local home-folder record read through `reel memory --you`, with the current renamed path; keep retro suggestions at five plans or three repeated signals. This performance iteration does not replace memory storage or turn a suggestion into an automatic retro (step 3).
- **D-109** and **D-110**: an untagged miss causes no direct pause; tagged misses retain their matching-choice rule. If implementation reaches a fifth unplanned choice in a step, put its biggest open choice in the plan and resolve it before proceeding with that step; other steps may continue. Existing authorization settles choices it already covers, not a new unresolved choice outside it (all steps).
- **D-129**, **D-197**, **D-198** and **D-199**: wrong quick-check answers never block the person's Approve. New and revised plan videos retain delayed checks on new cases whose rule was taught; build warnings for checks too early or reusing the shown case remain warnings. This experiment's stricter pass criteria qualify its speed claim, not the person's approval (steps 1, 3).
- **D-169**, **D-170** and **D-247**: preserve the separate case study's owner-first review order with a day between arms, rubric/blind judge/owner rank with ranking before judge scores, and finished sites as plain files plus `site.bundle`. These govern the site-building case study; this newly declared synthetic video-authoring benchmark uses its own ABBA and paired-quality protocol without rewriting that case study or claiming to satisfy it (step 3).
- **D-171**, **D-201** and **D-306**: binding owner answers remain constraints; accepted agent choices are history raised when their lines are touched. Keep the maintainer's last answer authoritative with the contributor's earlier words in the saved review. Use `reel renumber` for branch collisions, never renumber decisions on main or hand-edit owner records; only owner-approved folds replace decision citations (all steps).
- **D-200** and **D-223**: preserve plan review before implementation for work planned with reelplanner, applying the owner's existing authorization as actually given; do not invent a recorded approval. A contributor without videos remains welcome and a maintainer supplies one when required. Visible or hard-to-undo changes get the walkthrough; smaller internal choices go in PR text under the existing contribution rules (step 3).
- **D-213** and **D-215**: the working PR carries video text; built bundles reach the maintainer through an unmerged `video/pr-<number>` branch deleted after merge, the later command-driven delivery of D-213's no-media-in-main rule (step 3).
- **D-217**: missing jargon meanings warn normally and fail when `terms_check: strict`; a faster scaffold or richer script brief does not relax that check (steps 1, 2).
- **D-219**, **D-220**, **D-221** and **D-222**: the walkthrough shows the real change running in about two minutes; its meaningful pauses have no fixed count. Listed choices remain listed, not judged, and flags still require action. Walkthrough checks occur only where there is something to predict, immediately before the behavior runs; the benchmark's five choices/checks are workload requirements, not new walkthrough limits (step 3).
- **D-244** and **D-245**: `plan.md` remains the guide's source; the shared scene contract does not create another plan. Before you watch still shows newly kept findings and folds repeated same-reason findings into a counted line (steps 1, 3).
- **D-304**, **D-309** and **D-310**: preserve the name's real-planning explanation, already accepted release walkthroughs as settled history, and ordinary development on the public repository after its one-time initial export. This plan neither reopens those accepted walkthroughs nor repeats or rewrites the public-history export (step 3).
- **D-311** and **D-313**: retain full tests on every PR push, current-head fast/full/PR checks and maintainer review before merge, with `pr-check --merge` run by the maintainer. Scope stays local review plus portable exports; the speed experiment adds no hosted review service (step 3).

## Supersedes

None. Existing custom HTML, player behavior, review duties and the failed pilot's success rule are retained.

## Steps

### Step 1 — Show the script reviewer the intended visible explanation

**It lets you:** Write an input, its interpretation, its result and its limitations once, and have both the script reviewer and frame author see them.

Add `scripts/lib/scene-content.mjs`, using the existing storyboard frame parser for frame identity and a fence-aware block extractor for the explicit `### Visible content` section. The section is author text describing what will actually appear, including exact input/output values, intermediate reasoning, qualifications and relationships. Do not expose arbitrary author notes, hidden source interpretation or guide-only text to the newcomer. It is evidence of intended screen content, not proof that HTML eventually contains it.

Use the same parsed representation in `scripts/fresh-eyes.mjs` and `scripts/frame-packet.mjs`. The packet keeps its existing path, metadata, marks, word timing and original block; the normalized visible section is clearly identified. Older scenes with no section retain their existing `scene` summary and narration and need no migration. Update `references/frame-shell.md`, `references/authoring.md` and `references/frames.md` with the one canonical convention.

For newly generated script-review stamps, hash all reviewer-visible input, including the visible section, narration, ask, glossary and review context. Store a version. `--script --check` must report a versioned review as stale when that input changes, including when narration stays identical. Keep older stamps readable without declaring that they certified the new contract. Preserve the existing finding answer rules, exact fresh prompts and independent final screenshot reviews.

#### Cases

| Situation | Example | Result | Trace |
|---|---|---|---|
| Intended evidence was outside `scene` | Scene summary says “count actors”; visible section has `X/X/Y → 3 occurrences, 2 actors` | Both workers receive the exact input/result and its qualifier | author: section; parse: same content; reviewer: sees it; worker: draws it |
| Actual reasoning is incomplete | The section gives an actor total without explaining repeated identities | Newcomer still flags the explanation | reviewer: finds gap; author: fixes reasoning; review: checked again |
| Legacy/custom frame | Only `scene` and narration exist | Current content and custom HTML continue to work | parse: fallback; packet: old metadata; frame: unchanged |
| Visible-only correction | Add “Hypothetical; excluded from observed counts” | Versioned script review becomes stale | edit: qualifier; hash: changes; check: requests current review |

#### Interface

```text
STORYBOARD.md / ## Frame N / ### Visible content  # only what this scene intends to show
sceneContent(storyboard, script)                 # ordered identity, scene summary, visible section, narration
reelplanner fresh-eyes <video-dir> --script      # same command; complete intended screen content in brief
reelplanner frame-packet <video-dir> 25 26       # same packet paths and timing/marks; same visible contract
```

#### Example

Frame 25 keeps its `src` and composition ID. Its visible section explicitly says: input `X/X/Y`, repeated X retains one actor identity, result three occurrences/two actors, and one versus three episodes does not change either count. Script review receives those words without rewriting the one-line scene summary; the frame author receives the identical section. If the category-precedence rule is still missing, the reviewer flags it and the author repairs it before narration.

```diagram
flow: One intended explanation
Visible section -> Script brief: review
Visible section -> Frame packet: author
Rendered frame -> Fresh eyes: verify what is visible
```

### Step 2 — Allocate space before text can cover the conclusion

**It lets you:** Generate a populated native frame whose title, explanation and conclusion share normal flow, then identify the exact region that cannot fit.

Add `scripts/frame-scaffold.mjs`, `scripts/lib/frame-scaffold.mjs`, and packaged resources under `templates/reelplanner/theme/scaffolds/`; dispatch through `bin/reelplanner.mjs`. The command is optional. It writes a new frame only at its storyboard `src`, refuses an existing destination, and never regenerates custom HTML automatically. Authors edit the generated HTML thereafter. Resolve the composition ID and duration from existing packet/storyboard/audio data. Reuse actual local font declarations, theme tokens, letter-prefixed DOM IDs, root rules and one native paused timeline; no new renderer or runtime dependency.

The scaffold accepts an author-owned JSON description with `layout`, `header`, populated `groups` (`label`, authored local `html`) and `conclusionHtml`. It allocates a normal-flow header/body/conclusion inside the existing content area ending at y=900; use grid/flex with explicit bounded regions, wrapping and visible overflow for diagnosis. Qualifiers stay attached to the item they qualify. Reserve detail hover clearance, caption space and the bottom eighth; preserve native question/option/call/detail/artifact marks in authored body HTML. Never fix an overfull scene by clipping, truncating evidence, omitting qualifiers or reducing text below the theme floor of 1.4cqw. Root/camera clipping required by the existing runtime remains; it is not proof that content fits.

Provide five genuinely different body relationships: record with adjacent inference, ordered trace, paired options, events grouped by actor, and an assignment table. These are small composable HTML/CSS forms, not five titles applied to the same card grid. Include a custom-body route inside the same outer allocation. The author still chooses the form, evidence, emphasis and motion; explain cases the forms do not cover instead of forcing every scene through them. Existing terminal-run and code-diff blocks remain usable inside a body region.

Mark allocated regions with `data-rp-region`. Extend `scripts/lib/frame-layout.mjs` and `scripts/frame-check.mjs` to attach a source/region and actionable fit message to scaffold overflow findings using the existing pinned browser check and its three scene samples. Preserve raw findings, severity, sample coverage and plain PNGs. Do not create a second full browser pass for every frame. If additional DOM measurement is needed, keep it in the existing capture/check session and count its cost. A preassembly or incomplete browser check never reports fit. Fit diagnostics remain advisory consistently with frame-check; author handoff requires addressing material overflow and final build/independent review remain authoritative.

#### Cases

| Situation | Example | Result | Trace |
|---|---|---|---|
| Qualifier grows | Right-column explanation gains two lines | Conclusion moves in normal flow if space remains | content: grows; flow: reallocates; check: samples |
| Content cannot fit | Dense record plus three qualifications exceeds body region | Report frame, body region and overflow; author redistributes while preserving meaning | check: names region; author: changes layout; check: repeats |
| Distinct relationships | Ordered events versus actor assignments | Trace shows order; table shows mapping | author: selects form; scaffold: arranges relationship; reviewer: judges usefulness |
| Existing frame | `25-counts.html` already exists | Refuse overwrite; ordinary edit/check workflow continues | command: detects destination; output: unchanged |
| Custom diagram | Diagram needs geometry beyond five forms | Custom body uses common outer allocation and existing checks | author: custom HTML; shell: bounds; checker: samples |

#### Interface

```text
reelplanner frame-scaffold <video-dir> <frame> --content <json>  # optional; creates storyboard src, refuses overwrite
  layout: record-inference|trace|paired-options|actor-groups|assignment-table|custom # relationship, not decoration
  header, groups[{label, html}], conclusionHtml               # populated authored content, no placeholder evidence
  prints: frame path, composition ID, selected regions, next frame-check command
reelplanner frame-check <video-dir> <frame> [<frame>…]         # existing flags and three samples preserved
  advice: frame 25, body region, overflow; redistribute content and recheck
```

#### Example

A hypothetical record and its inference occupy one normal-flow body, followed by the observed-count conclusion. Adding “opportunities are unknown” expands the inference. If the complete text fits, the conclusion moves down without overlap. Otherwise the browser names the overfull body region; the author changes column proportions or the scene's grouping, preserves all values and qualifications, and checks the populated result. No fixed `top:66%` conclusion covers the text.

A complete repair example uses the fixed input `X/X/Y`, conclusion “3 comments / 2 people; participation rates cannot be calculated,” and three qualifications: “Chances to speak are unknown”; “Repeated X remains one person”; “Grouping entries changes neither count.” Suppose stacking these full sentences in a narrow body overflows. Keep the input and conclusion in their reserved rows; distribute the three unchanged qualifications across three columns in the body. Recheck the populated scene at every required sample: every sentence must fit above y=900 at or above 1.4cqw, approximately 27 pixels on a 1920-pixel-wide frame. This is a proposed repair example, not a reported benchmark success. In the controlled probe, the scene identity, complete words, narration, and duration stay fixed: no new scene or longer hold earns a pass. If no readable arrangement fits, retain a failed attempt. Outside that frozen comparison, splitting or retiming is ordinary authoring, but requires an explicitly revised storyboard, narration where affected, a new script review and fresh final checks; do not silently change a running benchmark.

```diagram
flow: Fit the explanation
Populated content -> Header body conclusion: allocate
Header body conclusion -> Browser samples: measure
Browser samples --> Author redistributes: overfull region
Browser samples -> Independent pictures: inspect
```

### Step 3 — Prove the package and then completed delivery

**It lets you:** Distinguish a faster layout probe from a faster, equally useful video that completed both reviews.

First add scratch regressions to `scripts/test/fresh-eyes.spec.mjs`, `frame-tools.spec.mjs`, `package.spec.mjs` and `codex-install.spec.mjs`; add `frame-scaffold.spec.mjs` to `scripts/test/run.mjs` for the new command. A current-source fixture must demonstrate the scene-summary omission; a grown-text fixture must fail against fixed-position layout and exercise the overfull normal-flow diagnostic. Cover all five populated forms, custom fallback, missing assets, refusal to overwrite, local/offline fonts, duration/ID/mark stability, no clipping workaround, 1.4cqw floor, detail clearance, final-rest question cards, and unchanged custom frames. Run `npm test` and the full touched specs; run the full suite before merge. Install an `npm pack` tarball in a clean scratch prefix and invoke the real packaged CLI from outside the checkout, including the native Codex plugin/skill route. Existing Claude installation and commands remain covered. A fresh code-check agent gets only the generated prompt; answer findings in the new walkthrough.

Then freeze a bounded authoring experiment before launching workers. Keep content and narration identical across conditions. Use seven populated fixtures: five distinct visual forms plus the dense 25/26 mechanisms, with synthetic non-benchmark variants in different domains and different title/qualifier lengths to detect overfitting. Fresh Codex author sessions receive the same task and source bundle, with only the optional tooling treatment differing. Run two matched pairs, balanced order, a 30-minute cap per seven-fixture attempt. Define a repair cycle consistently: after the initial assembled check, one corrective edit batch through its next assembled check counts as one cycle, even when the batch changes several frames. Retain failed checks and unsuccessful attempts; do not count the same batch once per frame. Record batch start, check completion, changed frames and result. Measure start-to-first-clean-assembled artifact, repair cycles, tool intervals, observed token usage and region failures; independently judge semantic equivalence and actual visual relationships. Retain capped attempts and diagnostics. The clean artifact is an immutable playable assembly of all seven frames, its unchanged IDs/audio/durations, PNG samples and passing technical plus independent authoring-review receipts. The clock ends at the independent verifier’s accepted receipt, inside the 30-minute cap, not at file submission or screenshot creation. Later blinded pairwise comparisons may run outside this authoring clock symmetrically, but cannot rescue a failed or incomplete candidate or permit off-clock repairs. Predeclare the probe continuation bar: all four attempts finish clean and preserve every semantic requirement, treatment is faster in both matched pairs with at least 15% lower median authoring-to-clean time, and median repair cycles do not increase. A failure means inspect the retained evidence and revise the mechanism or a separately declared probe before spending up to eleven hours on four full trials. This probe can reject the mechanism or support launching the full trial; it cannot satisfy the delivery claim.

For the full next protocol, freeze a clean common baseline after the shared compatibility repairs are verified. The earlier candidate runtime `662cfbd` (report-only HEAD `41fe94b`) is historical context, not the final frozen comparison source. Put the same guide ownership, responsive layout, playback, jump-back, source-heading parsing and existing batching fixes in both arms; the after package differs only by steps 1–2. Record the exact final common baseline and treatment revisions before launch. The earlier four AWS trials all failed at their caps; they are retained failures, not evidence of speedup. Record exact Git/package/skill/model/effort/browser/runtime hashes, narration voice and pace, permissions, machine shape, warmup/cache policy, instrumentation and source bundle. Use fresh author and independent reviewer sessions for every trial and fresh focused stage handoffs. Do not inherit explanations between matched conditions. Keep source/narration/gate requirements fixed, including 28–30 scenes, five choices, ten consequence branches and five checks.

Predeclare **120 minutes for request→first showing and 45 minutes for review POST→revised showing**, on both arms. The longer first cap addresses the prior censoring at 60 minutes; it is a new experiment, not a rescue or reclassification of the old one. Use ABBA before-1/after-1/after-2/before-2, drain exactly trial-owned processes between runs, and retain all failures. Do not change caps, inputs or success criteria after outcomes. Revision cap remains 45 minutes because the prior pilot supplies no completed revision estimate. If that cap censors a trial, report failure and design a separately declared experiment.

Keep every gate in the existing `QUALITY.md`: scope, source evidence, complete worked cases and populations, delayed new-case checks, readable held moments/minimum camera scale/overlays, at least five actual forms and no dominant form above 70%, full responsive expanded guide coverage, independent script/newcomer/designer review, immutable showing receipts and audio provenance, real branch/caption playback and review POST/intake, and the exact fresh scripted revision controls with stable IDs and unchanged audio reuse. For visual variety, count actual rendered relationships from screenshots: at least five distinct forms, with no dominant form above 70% of frames. Freeze desktop 1920×1080 and mobile width 375px guide checks before trials: every required section must remain reachable and readable without page-wide horizontal overflow; intentionally wide tables may scroll locally if all cells remain accessible, with expand/collapse, scene-linked details and jump-back working at both sizes. These explicit checks supplement, rather than replace, the existing QUALITY.md gates. Preserve every raw finding and explicitly adjudicate disagreements. Two independent blinded matched comparisons must find no materially weaker explanation, readability or visual usefulness for any required case or option, for both showings. Freeze the case-by-case rubric before launch: wrong or missing reasoning, a lost qualification or population boundary, required text unreadable at the prescribed viewing size, or a visual relationship that hides or changes required meaning is a material failure. Cosmetic preference alone is not. Save both independent judgments unchanged. A third independent adjudicator, also blinded to condition and timing, resolves disagreements only against the frozen case requirements and screenshot/playback evidence, with an explicit written reason. The author cannot self-adjudicate. Preserve both original judgments and the adjudicator’s receipt; unresolved disagreement cannot qualify. Do not average away a failed case or redefine materiality after seeing timing results.

Qualify only when all four trials deliver both showings and pass all gates, after median combined episode time is at least 20% lower, after is faster in both matched pairs, and neither episode median is more than 5% slower. Record each trial's seconds and complete gate vector. Timeouts remain censored failures, not 120-minute successful deliveries. Report command sums and unions separately, guardian overlap, observed deduplicated tokens with missing totals unknown, actual screenshot-based form counts and repairs. Append sanitized evidence to `eval/pipeline-cost/LEDGER.md` through that skill's workflow; raw conversations stay private. A qualifying synthetic pilot supports this workload only, not production reliability.

#### Cases

| Situation | Example | Result | Trace |
|---|---|---|---|
| Probe improves | Seven fixtures clean sooner, semantics equivalent | Proceed to full trial; no delivery claim yet | freeze: probe; measure: clean artifact; compare: useful layouts |
| After times out | No revised showing by 45 minutes | Failed experiment retained | cap: stop; evidence: preserve; report: censored failure |
| Faster but weaker | Visible qualifier omitted on one consequence | Quality gate fails regardless of median | reviewer: weaker cell; adjudicate: evidence; result: not qualified |
| All requirements pass | Both pairs faster and median total falls 20% | Report bounded synthetic evidence | receipts: freeze; reviewers: compare; ledger: publish metrics |

#### Interface

```text
node scripts/test/run.mjs --full fresh-eyes frame-tools frame-scaffold package codex-install  # exhaustive touched specs
npm test                                                                                # required fast suite
npm pack                                                                                # test actual shipping resources
new benchmark protocol.json                                                             # separate frozen hashes and 120/45 caps
new results.json                                                                        # trial times, censoring, all gates, usage completeness
```

#### Example

If before totals are 110 and 100 minutes and after totals are 80 and 85 minutes, the median reduction is about 21.4%. This is only qualifying if both episodes completed, both matched pairs improved, neither episode median regressed over 5%, and every quality gate passed. A missing qualifier or a capped revision makes that same timing table a failed result.

```diagram
flow: Evidence for a speed claim
Scratch regressions -> Packaged install: verify
Packaged install -> Controlled authoring: test mechanism
Controlled authoring -> Four full trials: measure delivery
Four full trials -> Independent paired quality: compare
Independent paired quality -> Ledger: retain outcome
```

## Checks and risks

- A larger script brief can cost more tokens or reveal an intended explanation that never reaches the screen. Measure the former; retain screenshot-based final review for the latter. Do not give newcomers private author rationale.
- Normal flow can still overfill a bounded body, especially with long unbroken tokens, deep tables or camera transforms. Report the region, preserve the content, and let the author change the composition. Browser measurement is authoritative; no character-count promise and no required pretext dependency.
- Five named forms can become five superficially different card grids. Judge actual rendered relationships and every paired case/option, with a custom escape hatch and unrelated-domain fixtures.
- Additional preparation and diagnostics may erase downstream savings. Count all authoring, approval and repair time from the declared start, including unsuccessful calls and repeated builds.
- Treat the installed package and Codex CLI as the product: the implementation is incomplete if it only works through checkout-relative imports or the main session's accumulated context.
- Preserve the owner's existing Codex plan, walkthrough, terms index, staged work and decision records. This work gets its own plan and walkthrough; no benchmark or regression writes committed `videos/`, `.reelplanner/` or `eval/` fixtures.

## Continuing through delivery

The owner has already authorized implementation, experiments, commits and pushes, and asked us to continue until speed improves without weaker quality. This plan and its video make that work reviewable; they do not ask for a second approval or create an approval entry in the decision log.

If a probe or full comparison fails, retain its result and inspect the recorded repair cycles, command intervals and quality findings. Choose the next bounded change from that evidence, implement and check it, then declare a new comparison with new immutable versions before launching it. The owner supplied no overall attempt, elapsed-time or cost ceiling, so do not invent one. Per-attempt caps still stop each trial; continuing means a newly declared comparison, not extending that trial. Give progress reports and surface a genuine blocker or a change outside the authorized scope to the owner. Continue this cycle under the existing authorization; never change the criteria of a running experiment or discard its failed attempts. Once a comparison qualifies, package the tested change, complete the supported Codex CLI checks below, and commit and push the code and sanitized evidence. Report the measured scope and any remaining limits; owner acceptance of the original walkthrough remains separate.

## Supported Codex CLI behavior to preserve

The packaged checks cover the supported workflow, not installation alone: load the native plugin/skill, build and open a narrated plan, send and adopt a saved review, revise the requested scenes while preserving other narration and stable scene identities, implement and produce a walkthrough, and process a requested walkthrough correction. Retain the tested question/answer inbox path, private read-only conversation export, unattended review completion and deliberate retry after a failed run, including preservation of the owner's edits and staging. Exercise the shared player’s sound, captions, rewind, question stops, branch routing and Send controls. Run the relevant complete regression suites and the installed-package smoke checks; preserve prior real CLI lifecycle evidence and repeat any behavior whose implementation changes. Desktop-app support and automatic session wake remain outside the demonstrated CLI scope.

## Open questions for the reviewer

None required to implement this bounded iteration. The optional interface, custom escape hatch, preserved quality bar and predeclared experiment are reversible choices within the existing authorization. Record visible implementation choices in the new walkthrough; any scope expansion or contradictory owner decision becomes a separately stated choice.
