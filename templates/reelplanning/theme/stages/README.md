# Stage kinds

The stage is a picture of **what the plan changes**, so its form comes from the plan's shape rather
than from whatever the last project used (style guide §5). A project records its choice in
`.reelplanning/system.json` as `stage: { kind, why }`, and `why` is a sentence someone can disagree
with — not "it is the default".

| file | kind | use it when the plan changes… | the mistake it avoids |
|---|---|---|---|
| `dataflow.html` | `dataflow` | how data moves between parts at runtime | — (this is the original stage; it is correct for a service) |
| `pipeline.html` | `pipeline` | how artefacts get produced | drawing a build as a runtime graph. Ends in the REAL output (pages, files), not a box named after it |
| `layout.html` | `layout` | where things sit on one screen, and how much room each gets | describing a layout in words over a still picture. The artefact IS the screen, as a wireframe; a step beat is its regions travelling to where the step puts them, so the motion and the sentence are the same event |

Still to build when a plan needs them: `record` (a row or document whose fields move) and `sequence`
(two or three actors and the messages between them).

**Every box holds its words** (the style guide's §5, "A frame a newcomer can read", rule 1): a page, region or
card shows a line or two of its real words, never grey bars standing for them; where the words don't matter to the
beat, the box keeps only its name. `frame-lint` fails empty bars stacked where words go.

**The test for whether anything belongs on the stage at all:** if it has no edge, no place on the
chain and no place on the artefact, it is a rail step and nothing more. That is what demoted
`Design`, `Search` and `Hosting` from nodes to properties of the pages in the Dylan plan — drawn as
nodes they sat disconnected for the whole video, a checklist wearing the costume of an architecture.

**Presence.** Whichever kind you pick, the full stage is context and not the subject: it earns the
cast beat, the beats that change it, and the resolved plan. `reelplanning stage-presence <video-dir>`
reports the share of beats that draw it (nothing runs it for you): run it to check, and over half is
worth fixing.
