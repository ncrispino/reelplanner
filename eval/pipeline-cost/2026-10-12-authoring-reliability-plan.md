# Reduce avoidable video authoring rework

The owner authorized implementation, commit and push on 2026-10-12 after the
[session audit](2026-10-12-reading-prompt-codex.md) and
[AWS experiment](2026-10-12-codex-packet-bench.md). These are reliability and
authoring changes; the experiment did not establish a production speedup.

1. Preserve all ordinary prose in the guide's Decisions in force section, alongside
   its existing decision links. Accept step annotations inside or outside bold
   question headings and `Recommendation: A` alongside `I recommend A`, including
   the visible recommended-option badge.
2. Expand `(all steps)` component references into the actual step numbers before
   the guide renders them. The saved browser error was `c.steps.join is not a
   function`: ordinary plan metadata reached the browser as the string `all`.
3. Stabilize voice pace before the first full narration. Budget scenes by what the
   reviewer needs to understand and decide. Hand off growing builders by stage with
   concise evidence and paths, while retaining independent reviews and quality gates.
4. Integrate the already-tested caption, removed-scene chapter and CLI delivery
   repairs from the delivery worktree. Retain both caption ordering regressions.
   Dispatch inbox commands by their command position so answers such as `retry`
   or `renew` are saved as answers rather than interpreted as commands.
5. Run the fast suite and full affected specs, with an independent source review.
   Commit and push the reviewed changes on the existing
   `feat/codex-first-class` branch without staging private runtime or owner files.
   Keep the paused original walkthrough acceptance separate from these fixes.

Validation uses scratch copies for guide coverage, question placement, all-step
references, shuffled narration and removed scene IDs. No changes to model effort,
permission policy or reviewer requirements. A new timed benchmark is needed to
claim an end-to-end speedup; no further AWS spend is needed for these regressions.
