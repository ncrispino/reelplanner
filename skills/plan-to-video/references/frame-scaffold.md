# Optional bounded frame scaffold

Use `reelplanner frame-scaffold <video-dir> <frame> --content <json>` to create a populated native
frame at the storyboard's `src`. It refuses an existing file. Edit that file thereafter; this is not
regeneration. Freeform frames remain supported.

The JSON is author-owned visible content, using the storyboard's visible-content contract as its source:

```json
{
  "layout": "record-inference",
  "header": "Repeated identities keep their identity",
  "groups": [
    { "label": "Hypothetical record", "html": "<p data-artifact=\"record\">X / X / Y</p>" },
    { "label": "Inference", "html": "<p>Repeated X retains one actor identity.</p><p>Opportunities are unknown; this record does not establish a rate.</p>" }
  ],
  "conclusionHtml": "<p>Three occurrences, two actors. Hypothetical; excluded from observed counts.</p>"
}
```

Header and group labels are plain text; `html` and `conclusionHtml` preserve authored markup. Keep
qualifiers with the item they qualify. Retain actual `data-option`, `data-call`, `data-detail`,
`data-artifact` and `data-gloss` marks in that markup. Decision/quiz headers get `data-question`.
Author element IDs must be unique across the assembled video and start with a letter (for example
`f25-evidence`). The scaffold's own IDs follow that rule.

Choose the relationship the evidence needs:

| Layout | Relationship | Group meaning |
| --- | --- | --- |
| `record-inference` | Unequal adjacent columns with a dividing rule | Exactly two: record, inference |
| `trace` | Numbered vertical sequence | One event/step per group |
| `paired-options` | Equal adjacent alternatives | Exactly two options; put actual option marks on their authored cards |
| `actor-groups` | Actor labels alongside their event lists | One actor and its events per group |
| `assignment-table` | Row labels mapped to authored values | One assignment per row |
| `custom` | Authored content within the same outer allocation | One or more custom sections |

These forms do not cover spatial diagrams, maps, cinematic compositions or every comparison. Use the
custom route or ordinary HTML when geometry carries the explanation. Existing terminal-run and code-diff
blocks can go inside a body region; keep their own native timing contract. Authors choose emphasis and
seek-safe motion after generation; the initial timeline holds the full scene without invented cues.

Generation requires `frame.md` with the project's exact local `@font-face` declarations and their files,
plus `assets/vendor/gsap.min.js`. Initialize/stage those project assets first; it never downloads or guesses
fonts. The composition ID remains the storyboard source basename. Duration uses the frame's audio metadata
when available, otherwise its positive storyboard duration. The command does not edit storyboard, narration,
owner records or other frames.

Header, body and conclusion share normal flow within the safe content area ending at y=900. Added content
moves the conclusion downward. The shell reserves the caption/control area, including the lowest eighth,
and 40 px above authored detail marks. Content overflows visibly for diagnosis; only the required root
clips the canvas. No automatic truncation, qualifier removal, font reduction or fit claim is made.

Assemble the frames before running `reelplanner frame-check <video-dir> <frame> [<frame>…]`. Its existing
three samples and plain PNGs remain. Browser overflow findings gain a source and named region when the
source selector identifies it unambiguously. Ambiguous findings retain the native message without a guessed
region. This adds no second browser pass. Review every material overflow; redistribute or split evidence
while keeping its meaning, and recheck. A skipped or incomplete browser check does not establish fit.
Final build checks and independent script and screenshot review still judge the result.
