# Work needed to make this plan reviewable

The Codex implementation is still proposed. This file records the small tooling correction made while preparing its review, for inclusion in the implementation walkthrough later.

| ID | Step | Chose | Instead of | Why | Where to check |
|---|---|---|---|---|---|
| A1 | 1 | Preserve “Decisions in force” in the guide's existing fold label [visible] | Changing the coverage check or inserting duplicate source text merely to satisfy it | The guide omitted the source heading, while `guide --check` requires every heading. Older fixtures passed only because a missing-step warning happened to contain that phrase. | `templates/guide/guide.js`, `scripts/test/guide.spec.mjs`: all-citations-assigned regression |

Before: the plan's generated guide failed on one missing heading after video checks passed. After: the same reference fold retains the source heading, without relaxing the check or editing generated HTML. Verification: `npm test` passed all 52 specs in 255.0 seconds; `node scripts/test/run.mjs --full guide` passed all 111 checks in 104.4 seconds. Both finished with the protected fixture tree unchanged. The earlier runs passed their functional checks but correctly failed the fixture guard because video authoring was still changing this plan; the required reruns above used the stable final tree.
