# Blocks: the real thing, in the theme's colours

HyperFrames' registry has blocks for code and terminals, but they hard-code their colours (code-diff
alone has 81 hex values and a glow), so `frame-lint` rejects them and no video used them. These are
forks of the two a plan video needs most, coloured only by the theme's tokens (`--rp-slab*`, and the
syntax tokens `--rp-syn-key`, `-str`, `-num`, `-com`, `-add`, `-del` in `tokens.html`), and written to
the motion language (`../motion-language.md`): literal tween times, transforms and opacity only, a
camera inside a view clipped at y 900.

| file | the real thing | its verbs |
|---|---|---|
| `code-diff.html` | a code change: the file, the two commits, the removed and added lines | struck, wiped, pinned, a pull-back |
| `terminal-run.html` | a command and what it printed, captured from the checkout | typed, printed, drawn, a push in |

Paste one into a frame's `<template>`, replace every `FID` with `f` + the frame id, put the real change
or run in (never re-worded), and move the tween times onto the cues. The container carries
`data-artifact`, so `check-terms` reads its text as the thing's own; a word the video defines is a
`data-gloss` label pinned on the token it names. Run `frame-lint` on the frame as it lands.
