# Keep authoring work focused

Apply this to every harness. The October 2026 AWS experiment found avoidable repair loops and large
continuing builders; it did not prove a speedup.

## Decide what each scene earns

Start with one concrete case: its input, what changes, and the result. Define unfamiliar terms where
that case needs them, then show the rule and a boundary case. Map each unresolved choice to the example
that lets the reviewer compare its options. Keep factual uncertainty visible.

For a small plan, start around 12–20 scenes, including its questions and quick checks. This is an
authoring target, not a validation cap: expand when a necessary example, choice or prerequisite would
otherwise disappear. Explain the extra scope in BRIEF.md before assigning frames. A repeated definition
or a second version of the same diagram rarely needs another animated scene. Put full traces and
reference detail in the guide, while keeping the evidence needed to decide in the video.

Count every authored conditional option branch, including the branches a selected path skips. Many open
choices can take a small plan past this target; keep their consequences and checks rather than trimming
them to meet a scene count. Record authored count and the selected path's length separately.

List each scene's teaching purpose, concrete artifact and intended layout in STORYBOARD.md. Reuse theme
and layout code where it fits, with scene-specific content and motion. Preserve visual variety; record
`reelplanner variety <video-dir>` alongside the checks. Don't trade readable examples for fewer scenes.

Before drawing, list the exact visible input, result, field names and uncertainty/hypothetical qualifiers
in each scene's storyboard block. Both alternatives of a choice show populated consequences on the same
case. A format title alone cannot demonstrate how its proposed records differ. The guide holds longer
traces; the video keeps the evidence the reviewer needs to decide.

## Check the first frame batch before copying its pattern

Start from [the frame shell](frame-shell.md) and the packet's scene-specific content contract. Reuse its
validated root, local font declarations, scoped selectors, safe region and paused timeline. Choose the
actual form independently for each scene; reusing mechanics does not require repeating its layout.

A composition root is the container for one scene. Follow HyperFrames' root contract: give it
`id="root"` and style it through `#root`. Give animated elements letter-prefixed DOM IDs such as
`scene-17-title`, or escape their CSS selectors; `#17-title` is an invalid selector even though the
HTML ID itself is allowed. Frame numbers and composition metadata can remain numeric.

After the first HTML batch, run the pinned `$RP hyperframes lint <video-dir> --json` while authoring
continues. It checks `compositions/` before the final browser check. Individual `frame-check` passes
alone do not establish the framework contract. The follow-up AWS test reached assembly with 26 root
styling errors after its frame checks; an earlier baseline hit 19 numeric-selector runtime errors.
Fix the shared pattern before repeating it across the remaining frames. Keep the full assembled
checks and independent reviewers.

The first populated batch must also be assembled for its browser check and pictures. Check a substantive
evidence scene and a question scene when present, save the output in the handoff, and inspect them with
captions and controls. Check later frames in batches when the command supports it, retaining every
frame's requested samples and picture. A skipped check or missing picture is unfinished verification.

## Settle narration before timing frames

Use the existing narration record's voice and pace on a revision. On a new video, use 1.25× unless the
person requested another pace. If pace is uncertain, try one representative line in a scratch project
before voicing the whole script. Settle it once, then narrate the checked script while drawing.

A speed change invalidates every line's audio and word timings. The large AWS drafts each spent about
four minutes on a late full revoicing pass, followed by retiming. Avoid speculative speed adjustments
after drawing. An owner request or a demonstrated comprehension problem still warrants a change.
Shorten an overlong script or scene before accelerating the entire narration.

On a rebuild, run `reelplanner narrate <video-dir> --dry-run --json` to see which frames need narration.
Omit `--speed` to retain the recorded pace. Changed lines should regenerate; unchanged lines should be
reused. Preserve `.hyperframes/narration.json` and the verified local audio rather than deleting the cache.

## Stage handoffs

Keep a durable handoff with the request, source paths, decisions and unresolved questions; storyboard
and script paths; settled voice/pace; frame assignments; successful check commands and saved outputs;
and the exact remaining findings. Keep it around 1,200 words. Link complete evidence instead of pasting
generated HTML, full transcripts or repeated command output into the handoff.

Where the harness supports fresh workers, use a fresh writer for storyboard/script, frame workers with
3–5 frame packets for larger videos. For more than 20 authored frames, hand assembly and review repairs
to a **new focused owner** by default: the original frame builder writes the handoff and transfers the
remaining work rather than carrying every repair in its continuing conversation. Give the new owner
the source and artifact paths, exact current findings and evidence, settled voice/pace, stable frame IDs,
successful checks and remaining work. Keep the same model and effort. The coordinator tracks artifact
paths and stage gates; the repair owner reads the relevant evidence and makes the changes.

A requested revision likewise starts with a new focused owner from the actual saved review and first
showing's handoff. Include the recorded decisions and the reviewer's exact words, the source/version they
saw, changed-scope evidence, stable IDs and narration record. Preserve accepted content and reuse unchanged
audio at its recorded pace. Fresh script/frame reviewers remain separate and receive only their exact
generated prompts, without the authoring conversation or the repair owner's conclusions.

A worker gets the complete evidence relevant to its stage, the current constraints and the person's own
words; it does not inherit the conversation. A single-agent harness uses the same handoff file and
selective reads without pretending it has reset its context.

Read required references once, then revisit the relevant section. Inspect specific frame files and
short failure output instead of repeatedly dumping whole artifacts. Capture full output in a saved log
when it is needed as evidence. Independent reviewers still get their exact generated prompts and no
authoring context. Answer every required finding and rerun the checks affected by the repairs.

The scene target and stage guidance are preferences, not runtime enforcement or a measured latency
guarantee. Keep the same model effort, permission policy, reviewer requirements and quality gates for
the next comparable timed audit.


### Intended visible content

Use the canonical [`### Visible content` convention](frames.md#intended-visible-content) in each
storyboard frame for exact inputs, results, reasoning, qualifications and relationships intended on screen.
`fresh-eyes --script` and `frame-packet` share that section, scene summary and narration. Keep private notes
and guide-only text outside it. Repair missing reasoning and obtain an independent rereview after meaning
changes; the versioned script stamp detects stale reviewer-visible input. Preserve the final independent
screenshot reviews and count brief preparation, extra tokens and repairs in measured authoring cost.

For an optional populated frame with bounded header, body and conclusion regions, see
[`frame-scaffold.md`](frame-scaffold.md). Keep custom HTML when none of its forms fits the explanation.
