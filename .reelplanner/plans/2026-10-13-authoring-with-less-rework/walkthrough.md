# Walkthrough: faster scene authoring without losing the explanation

**Started from:** `76a36fe8c0938d67286c0904a019a62fb42af1dc` · **Commits:** `1c11ba4` (shared playback/guide compatibility fixes), `635e23f` (scene content and scaffolds), `b49e2db` (all four capped pilot attempts). Benchmark qualification remains pending.

Implementation proceeds under the owner's explicit instruction to keep implementing and testing until a speedup preserves quality. This is not a recorded approval of the new plan or of the original Codex walkthrough. The original owner's records and edits remain separate.

## Categories of change

- **Shared scene content** {scene-content} (`scripts/`) (step 1): the script reviewer and frame author receive the same intended visible evidence and narration, while old storyboards remain readable.
- **Optional frame scaffolds** {frame-scaffold} (`scripts/`, `templates/`, `skills/`) (step 2): new populated frames allocate title, evidence and conclusion in normal flow; overflow advice names a confirmed region.
- **Measured delivery** {measurement} (`eval/pipeline-cost/`) (step 3): retain all four failed pilot attempts, qualify the new mechanism in a smaller probe, then measure both completed review episodes.

## What was done, per step

### Step 1 — Share the intended scene content

`scripts/lib/scene-content.mjs` supplies ordered scene identity, summary, explicit `### Visible content`, and narration to `scripts/fresh-eyes.mjs` and `scripts/frame-packet.mjs`. `scripts/lib/markdown-source.mjs` shares the existing fence-aware heading logic with `scripts/lib/plan-md.mjs` and `scripts/lib/terms.mjs`. Quoted sample frame headings and metadata no longer create phantom scenes or override actual metadata. Legacy metadata after unrelated subsections is preserved.

Version 1 script stamps cover actual reviewer-visible input: titles, summaries, visible evidence, narration, asks, terms, glossary meanings and the complete latest review. Unchanged input preserves the existing brief, timestamp, plan hash and findings. A changed input requires another review; answered prior rounds are archived, and unresolved findings cannot be silently replaced. Legacy stamps stay readable with an explicit warning.

Evidence: full fresh-eyes (104 checks), terms (67), frame-tools (30), guide (140 before the separate wrapping regression) and build (35) passed. The new tests demonstrate omitted visible evidence, stale visible-only corrections, fenced source examples, preserved metadata and retained review history. The isolated fast and exhaustive validation results are recorded below.

### Step 2 — Allocate space before text can cover the conclusion

`scripts/frame-scaffold.mjs` and `scripts/lib/frame-scaffold.mjs` add the optional `frame-scaffold <video-dir> <frame> --content <json>` command through the existing CLI dispatcher. `templates/reelplanner/theme/scaffolds/flow.css` supplies the bounded normal-flow layout. `skills/plan-to-video/references/frame-scaffold.md` documents populated input, local assets, ordinary editing after generation, refusal to overwrite and custom HTML.

The five forms express record/inference, ordered events, paired options, actor groups and assignments. The custom form retains ordinary HTML. Actual project font declarations and local GSAP are required; body and display roles prefer declared family names containing Inter and Garamond respectively, with the first declared family as each missing role’s fallback (A4). Missing or remote asset references fail before writing. Scene source/identity, audio duration and native marks are retained. Text growth moves the conclusion rather than covering it; overfull content remains visible to the existing checker and is never automatically clipped, shortened or shrunk.

`scripts/lib/frame-layout.mjs` adds region advice to existing native overflow findings only when the selector identifies an unambiguous source element or container. It preserves original fields/severity and adds no browser pass. Dispatch and check scripts required no edits because their existing extension points already expose the command and finding text.

Evidence: full frame-scaffold (28 checks), package (10) and frame-tools (29 before the Step 1 addition) passed. All six populated forms use real fonts in Chromium; fixtures verify growth, unreadable overflow, native marks, missing assets, no overwrite, question rest, and a packed CLI invoked outside the checkout.

### Step 3 — Prove the package and then completed delivery

Recovered and verified the frozen pilot's four terminal attempts. All four reached the first-phase cap without a showing; none began its scripted revision. `eval/pipeline-cost/2026-10-12-codex-batched-pilot.json`, its report and `LEDGER.md` retain all failures, exact recorded timing, partial observed usage and unknown undelivered quality. The verified private archive and diagnostic artifacts were saved before stopping the idle AWS instance. No credentials or raw transcripts are published.

The first frozen seven-scene probe was aborted because its assembly byte-lock contradicted the author task and feedback hid the cause. The interrupted baseline and all diagnostics are retained as an invalid experiment, not a capped product failure. The second probe was also stopped: verifier relocation changed the fallback video title and invalidated only the treatment’s versioned script review. Its baseline completion and started treatment attempts are diagnostic evidence, not a qualifying comparison. The third version passed a native relocation-identity preflight in both arms, including rejection of changed visible content, and an independent execution audit. Its explicit common title preserves identical review inputs after copying. All 21 freeze fields were bound before four fresh ABBA trials launched on 2026-10-13 at 13:37:59 UTC (freeze manifest `18e979c27c35023ea4237d1774f036da19142697247b456f0cab4fb7ff797161`). Trials are running; no outcome is claimed. It retains baseline `1c11ba4`, treatment `10e3733`, identical 171-second source/audio and 30-minute caps including verification. All four trials and independent blinded quality judgments must qualify before the full delivery comparison. No qualifying probe outcome is available yet. **No authoring or whole-delivery speedup has been established by this change yet.** The packed CLI regression and independent implementation code check have run. The required installed-command walkthrough video, completed experiments and their quality receipts remain outstanding; the code check explicitly identifies these limits. The prospective experiment continuation rule remains in `plan.md`; it is a chosen threshold, not a measured outcome or recorded owner approval.

Related compatibility fixes keep the main and small player's displayed Play/Pause action consistent when delayed runtime state arrives, and show Play at completion. Plain guide prose now wraps long unbroken phrases on mobile. Both fixes belong in both comparison arms. Full controls/quiz/guide-under passed 46/49/46 checks; full guide passed 142. An initial integrated run passed all 60 spec suites but its fixture guard rejected concurrent author/report edits. The isolated real-checkout `npm test` rerun then passed all 60 suites in 461.8 seconds, as reported by the validation owner. The initial guard failure is retained, not called flaky or a successful suite. The exhaustive suite passed all 81 processes in 479.4 seconds on these three commits. A subsequent scaffold duration correction preserves longer storyboard holds; its full scaffold suite passed 29 checks, and the required fast-suite rerun passed all 60 specs in 256.7 seconds. That correction is commit `10e3733`; CI on that exact commit passed both fast and exhaustive suites, all three fresh-install checks, and the PR check. The compatibility fixes are commit `1c11ba4` and belong in both comparison arms; the authoring treatment is `635e23f`, and the frozen pilot evidence is `b49e2db`.

## Choices made while implementing

| ID | Step | Chose | Instead of | Why | Where to check |
|---|---|---|---|---|---|
| A1 | 1 | Archive answered script rounds in monotonic `review-N` folders; preserve unchanged rounds exactly | Replacing a previous review or renewing its timestamp | A changed explanation needs new evidence, while a repeated command must not erase existing answers | `scripts/fresh-eyes.mjs`, `scripts/test/fresh-eyes.spec.mjs` |
| A2 | 1 | Concatenate repeated visible-content sections in source order and include the complete latest review | Dropping later visible sections or truncating review context at 4,000 characters | Both workers need every requirement that the versioned review claims to cover | `scripts/lib/terms.mjs`, `scripts/lib/scene-content.mjs`, `scripts/fresh-eyes.mjs` |
| A3 | 2 | Attribute regions only through unique selectors in a strict supported grammar | Guessing the region from an approximate CSS match or adding another browser pass | Advice must not point to the wrong region or add repeated measurement work | `scripts/lib/frame-layout.mjs`, `scripts/test/frame-scaffold.spec.mjs` |
| A4 | 2 | Infer body/display font roles from declared family names containing Inter/Garamond, falling back independently to the first declared family [visible] | Requiring explicit role mappings for every project | The populated helper works with the existing local font declarations without another configuration file; a custom theme may use one declared family for both roles, which the author can adjust in the generated HTML | `scripts/lib/frame-scaffold.mjs:54`, `templates/reelplanner/theme/scaffolds/flow.css`, commit `635e23f` |

## Code check

The independent generated-prompt review is saved in `code-check/findings.md`. It finds Steps 1 and 2 implemented and raises three findings, answered here without treating documentation or regression tests as completed delivery evidence:

- **Step 3 — pending:** accepted. The frozen seven-fixture authoring experiment and the subsequent matched 120/45-minute delivery trials have not supplied results or independent quality receipts. The earlier four capped attempts remain failed in `eval/pipeline-cost/2026-10-12-codex-batched-pilot.json`. Commit `b49e2db` records those failures; it does not qualify this treatment. Execute the separately declared probe first, retaining its prospective continuation threshold, then run the full comparison only if the probe clears that threshold. No speedup is claimed.
- **D-303 — pending:** accepted. `scripts/test/package.spec.mjs` exercises the packed command outside the checkout, but this is not the required walkthrough video showing real installation and the installed command working. Capture that demonstration in this plan's walkthrough video and retain its actual run evidence; it is not yet present.
- **`scripts/lib/frame-scaffold.mjs:54` — documented in A4:** accepted as an unrecorded visible implementation choice. A4 now records both font preferences, the independent first-declared-family fallbacks, the explicit-role alternative and the implementation location. No code changed to answer this finding; the generated result still needs the normal visual review.

The read-only `reel audit` checks that these findings and cited decisions are accounted for. A passing audit is not completion of Step 3, D-303, exhaustive validation, owner acceptance or the speed/quality experiment.

## Decisions preserved in the checked implementation

The following references record the independent check's findings for its inspected diff; they do not extend that review to later code or claim a delivered video. D-303's outstanding requirement is answered above.

- D-001 — holds: `scripts/code-check.mjs` and this independent check preserve the second-agent implementation review.
- D-024 — holds: `scripts/detail.mjs:2` retains typed detail templates; `scripts/lib/frame-scaffold.mjs` generates scene frames separately.
- D-064 — holds in the checked diff: `scripts/lib/agents.mjs` retains configurable headless ownership and waiting when no worker is configured.
- D-066 — holds in the checked diff: `scripts/lib/agents.mjs` retains agent selection; the changed pilot report makes no claim of support for untested clients.
- D-082 — holds in the checked diff: `scripts/lib/agents.mjs:25` retains the Codex sandbox and automatic approval review.
- D-085 — holds: `scripts/frame-scaffold.mjs` adds an optional helper, and `scripts/fresh-eyes.mjs:129` preserves identical reviews instead of duplicating them.
- D-106 — holds in the checked diff: `scripts/lib/memory.mjs:52` retains the home-folder memory record.
- D-107 — holds in the checked diff: `scripts/lib/memory.mjs:40` and `scripts/lib/memory.mjs:481` retain the five-plan/three-signal retro suggestion.
- D-109 — holds in the checked diff: `scripts/reel.mjs:681` retains the rule that untagged misses pause nothing directly.
- D-110 — holds in the checked diff: `scripts/reel.mjs:624` retains the fifth-choice check; the supplied autonomy log has fewer than five calls in each step.
- D-127 — holds: `skills/plan-to-video/references/frames.md:87` describes intended screen evidence in plain language while retaining interface names.
- D-129 — holds in the checked diff: `packages/player/reelplanner-player.js:6987` retains Approve without a quiz-score condition.
- D-169 — holds in the checked diff: `scripts/case-study.mjs` is unchanged; the terminal video-authoring pilot does not replace the site case study's review order.
- D-170 — holds in the checked diff: `scripts/case-study.mjs` is unchanged and the pilot report explicitly declines to claim quality parity without delivered artifacts.
- D-171 — holds in the checked diff: `scripts/renumber.mjs` retains branch collision handling; no decision records are renumbered by the changes.
- D-195 — holds in the checked diff: `packages/player/reelplanner-player.js:3896` retains details opening over the frame; authored detail marks survive scaffold generation.
- D-197 — holds in the checked diff: `scripts/check-terms.mjs:45` retains later checks on a new case.
- D-198 — holds in the checked diff: `scripts/check-terms.mjs` retains the timing and reused-case warnings; the parser change does not relax them.
- D-199 — holds in the checked diff: `scripts/check-terms.mjs:74` retains the distinction between plan/system checks and walkthrough checks.
- D-200 — holds in the checked diff: `scripts/pr-check.mjs` retains contribution review requirements and maintainer-supplied videos.
- D-201 — holds in the checked diff: `scripts/reel.mjs:501` retains the last plan answer as authoritative.
- D-213 — holds in the checked diff: `scripts/review.mjs:53` retains the later throwaway-branch delivery mechanism; the diff adds no built media.
- D-215 — holds in the checked diff: `scripts/review.mjs:53` retains review of the video branch without rebuilding it.
- D-216 — holds: `scripts/check-terms.mjs` retains detected-term checks, and `scripts/lib/terms.mjs:55` keeps visible examples from overwriting term metadata.
- D-217 — holds in the checked diff: `scripts/check-terms.mjs` retains strict-mode failures for missing jargon meanings.
- D-219 — preserved by the implementation boundary: `scripts/walkthrough-scope.mjs` retains the real-running-change walkthrough requirement; completion of this plan's delivery remains outstanding under Step 3.
- D-220 — holds in the checked diff: `scripts/walkthrough-scope.mjs` retains meaningful-choice scoping without imposing the benchmark's five-choice workload on walkthroughs.
- D-221 — holds in the checked diff: `packages/player/reelplanner-player.js:5838` retains “listed, not judged.”
- D-222 — holds in the checked diff: `scripts/check-terms.mjs:74` retains the separate walkthrough-check rules.
- D-223 — holds in the checked diff: `scripts/walkthrough-scope.mjs` and `scripts/pr-check.mjs` retain visible-choice walkthrough scoping.
- D-225 — holds: `scripts/fresh-eyes.mjs:123` refuses regeneration with unanswered findings and archives answered changed rounds before rereview.
- D-227 — holds: `skills/plan-to-video/references/frames.md` explicitly retains independent final screenshot reviews; the new script contract does not replace them.
- D-244 — holds: `scripts/lib/plan-md.mjs` reuses the same fence-aware parser without changing the guide's plan.md source.
- D-245 — holds in the checked diff: `packages/player/reelplanner-player.js:2914` and `scripts/lib/fresh-eyes.mjs` retain newly kept findings and counted repeats.
- D-247 — holds in the checked diff: `scripts/case-study.mjs` retains the separate case study's site storage workflow.
- D-265 — holds: `templates/guide/guide.css:194` wraps long prose without removing source content, and `scripts/test/guide.spec.mjs` checks the complete phrase at mobile width.
- D-266 — holds: `templates/reelplanner/theme/scaffolds/flow.css:12` reserves detail clearance and the player diff leaves the quiet guide affordance unchanged.
- D-304 — holds in the checked diff: `README.md:153` retains the original name's “real planning” explanation.
- D-305 — holds: `eval/pipeline-cost/2026-10-12-codex-batched-pilot.json` stores sanitized evidence; the checked diff adds no voice files or rendered media.
- D-306 — holds in the checked diff: `scripts/lib/ledger.mjs` and `scripts/reel.mjs:326` retain binding owner answers and touched-line history rules.
- D-309 — holds in the checked diff: `scripts/reel.mjs:654` retains accepted walkthroughs as settled history.
- D-310 — holds in the checked diff: `scripts/release/make-public.mjs` is unchanged and no repeated public-history export is introduced.
- D-311 — holds in the checked diff: `.github/workflows/ci.yml`, `.github/workflows/pr.yml` and `scripts/pr-check.mjs` retain the existing CI and merge requirements.
- D-312 — holds: `scripts/frame-scaffold.mjs` and the new skill references use reelplanner; existing player annotation storage keys are unchanged.
- D-313 — holds: `scripts/lib/frame-scaffold.mjs:70` writes local frame files and adds no hosted review service.
