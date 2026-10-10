# Sketch scenarios: the sketch page under real use

Twenty-two sessions of what engineers put on a whiteboard and how they change it, each a timed script the real page is
played through (`play.mjs`): what they say, what they draw, and every edit, made as Excalidraw's own UI makes it.

- `scenarios/classic--*`: a request through zones with a webhook hop, a hand-drawn sequence diagram, a state machine
  with a self-loop, an ER sketch with a join table added late, prod infra with colour meanings said afterwards.
- `scenarios/editing--*`: a box split and merged back, a pipeline reordered and a step moved out and back, one box
  renamed three times, undo/redo and an old path crossed out, a rough pass refined into a frame.
- `scenarios/creative--*`: a race on a timeline in lanes, swimlanes with a step nobody owns, a comparison grid with a
  circled deciding cell, a permission tree with the buggy branch red, a code snippet with numbered steps and a legend.
- `scenarios/gaps--*` and `pointing--*`: what a whiteboard does badly (confidence by dashes and a legend,
  alternatives side by side and the choice, rates and paths written by things, a numbered story with a zoom into a
  box, "this one" said while pointing).
- `scenarios/ui--*`: what the page adds beyond a whiteboard: a box linked to the file it is, today / new / going
  marks, and a box opened up into a frame to draw its insides.
- `scenarios/rich--*`: beyond boxes: a Mermaid flow pasted from a doc and reshaped, icons from the page's library, an
  SVG dropped in from the infra repo.

`sketch-scenarios.spec.mjs` (the full run) plays them all with the partner off and checks each final drawing against
its `expect` and that `sketch.md` tells the edits made. `judge.mjs` measures more: whether an agent given only
`sketch.md` and the final picture can tell each `expect.story` statement. Run it before and after a change to what
the page records or how `sketch.md` tells it:

```bash
SKETCH_SCENARIOS_OUT=/tmp/scn node scripts/test/sketch-scenarios.spec.mjs      # add SKETCH_SCENARIOS_PARTNER=openrouter for the questions
node scripts/test/sketch-scenarios/judge.mjs /tmp/scn                          # needs OPENROUTER_API_KEY
```

In October 2026 that measure went from 106 to 132 of 157 statements clear (68% to 84%) as `sketch.md` began
telling the changes of mind, the looks, frames, marks and pointing (the pointing scenario: 0 of 3 to 3 of 3); the
same output judged twice differs by about 2. The scenarios also found what the page saved wrong: labels as
Excalidraw wrapped them to fit their box ("PaymentServic / e"), and strokes, lines and arrows placed by their first
point rather than by where they are.

## The format

A scenario is one JSON file: a person at the sketch page (a full-screen Excalidraw whiteboard, 1280×800 viewport)
recording themselves drawing, talking and typing how they think some software works. A runner plays it against the
real page and checks what the page saved (session.json, sketch.md, pictures).

### Canvas

- Draw inside x 40–880, y 90–700 (scene coordinates = screen pixels at 100% zoom). The top-right corner
  (x > 900, y < 330) is covered by the page's topic box and question card; the bottom bar covers y > 720.
- Typed notes are placed by the page itself, under whatever is drawn: leave some room at the bottom.

### File

```json
{
  "id": "kebab-case-unique",
  "title": "short human title",
  "persona": "who is drawing and why (one sentence)",
  "topic": "what they type in 'What are you explaining?' (their words)",
  "realism": "why a real engineer would whiteboard exactly this",
  "steps": [ ...timed steps, "t" in seconds from pressing Record, increasing... ],
  "expect": {
    "final_labels": ["labels that must be in the final drawing, exactly as last typed"],
    "absent_labels": ["labels that were removed or renamed away and must NOT be in the final drawing"],
    "arrows": [["from label", "to label"], ["from label", "to label", "arrow label"]],
    "story": ["things an agent reading only sketch.md must be able to tell, in plain words: e.g. 'they first had one Worker, then split it into Fetcher and Parser', 'the dashed boxes are the parts they are unsure of', 'step 3 happens before step 2 in their picture'"],
    "partner_should_ask_about": ["optional: the open threads a good question would target"]
  }
}
```

### Steps

Every step has `"t"` (seconds) and exactly one action. Keep a scenario between 40 and 120 s, with speech roughly every
3–6 s while they draw (people talk while drawing), and some silences.

| Action | Shape | What it does |
|---|---|---|
| `say` | `"say": "one spoken sentence"` | they say it; it ends at `t` (the live caption hears it then) |
| `add` | `"add": [element, ...]` | draws new elements (below) |
| `move` | `"move": {"id": "api", "x": 300, "y": 120}` | drags an element to a new top-left (bound labels and arrows follow) |
| `resize` | `"resize": {"id": "api", "width": 240, "height": 120}` | |
| `relabel` | `"relabel": {"id": "api", "label": "Gateway"}` | changes a shape's or arrow's label, or a text element's text |
| `restyle` | `"restyle": {"id": "api", "strokeColor": "#e03131", "backgroundColor": "#ffc9c9", "strokeStyle": "dashed"}` | any of the three |
| `reroute` | `"reroute": {"id": "a1", "from": "api", "to": "cache"}` | an arrow's ends move to other elements (either may be omitted to keep it, or `null` to leave it loose) |
| `delete` | `"delete": ["db", "a2"]` | erases elements (a shape's label goes with it) |
| `group` | `"group": {"ids": ["api", "cache"]}` | groups elements |
| `frame` | `"frame": {"id": "f1", "name": "Region us-east", "children": ["api", "cache"]}` | puts existing elements in a named frame (also `add` can create one) |
| `pen` | `"pen": {"points": [[x, y], ...]}` (Excalidraw's style panel covers about x 14–190, y 66–400 while the pen is picked: the player starts a stroke at its first point clear of it) | a freehand stroke with the mouse (circling something, crossing out, a squiggle, an underline); 6–40 points |
| `note` | `"note": "typed text"` | types it on the canvas with the text tool, on an empty spot in view (what a note is now) |
| `undo` / `redo` | `"undo": 1` | Ctrl+Z / Ctrl+Shift+Z that many times |
| `pause` | `"pause": 4` | presses Pause, waits that many seconds, presses Resume (the recording's clock stops) |
| `point` | `"point": {"ids": ["app", "edge"], "seconds": 3}` | the pointer rests on each element in turn (the time shared between them), as a person points while talking |
| `link` | `"link": {"id": "api", "type": "routes/upl"}` | selects it, presses Link to code, types into its search and picks the first file listed (Enter) |
| `mark` | `"mark": {"ids": ["ftp", "imp"], "as": "going"}` | selects each and presses Today, New or Going (`today`, `new`, `going`) |
| `openup` | `"openup": {"id": "wrk", "as": "inside"}` | selects it and presses Open up: a frame beside everything, the view on it; `as` names the frame for later steps |
| `back` | `"back": {"from": "inside"}` | selects that frame and presses Back: the whole picture again |
| `icon` | `"icon": {"icon": "database", "id": "db", "x": 480, "y": 440, "label": "Orders DB"}` | opens the Library, clicks that icon (`packages/sketch/icons.js`), closes it, puts it with its top left at x, y and names it; `id` is its biggest part (arrows bind to it), `<id>:label` its label (to `relabel` later) |
| `mermaid` | `"mermaid": {"source": "flowchart LR\n  A[Checkout] --> B{Card ok?}", "x": 250, "y": 110}` | More tools → Mermaid to Excalidraw, the source typed, Insert, then moved to x, y; later steps name its boxes `"@Checkout"` (by label) |
| `image` | `"image": {"name": "vpc.svg", "id": "vpc", "x": 60, "y": 580, "width": 260, "height": 120, "svg": "<svg …>"}` (or `"file"`, relative to the scenario) | drops the SVG on the canvas there, as a file from the desktop |

Any id can be `"@<label>"`: the shape with that label (what a Mermaid insert drew).

### Elements (for `add`)

Every element has a unique `"id"` you choose (used by later steps). Types:

- `rectangle`, `ellipse`, `diamond`: `x`, `y`, `width`, `height`, optional `label`, `strokeColor`, `backgroundColor`,
  `strokeStyle` (`"solid" | "dashed" | "dotted"`)
- `arrow`, `line`: either `"from": "<id>", "to": "<id>"` (bound to those elements; geometry computed for you), or
  free with `x`, `y` and `points: [[0,0],[dx,dy],...]` (relative). `from` alone (or `to` alone) with `points` gives an
  arrow that starts at an element and ends in empty space. Optional `label`, `strokeColor`, `strokeStyle`,
  `"endArrowhead": null` for no head, `"startArrowhead": "arrow"` for two-headed.
- `text`: `x`, `y`, `text` (can be multi-line with `\n`), optional `fontSize`, `strokeColor`
- `frame`: `x`, `y`, `width`, `height`, `name`, optional `children: ["ids already drawn"]`
- any of them with `"in": "<frame id>"`: `x` and `y` are inside that frame (one `openup` made, wherever it landed)

A scenario's `"repo": {"path": "text", ...}` adds those files to its scratch repo (what `link` picks from).

Colours: `#1e1e1e` black, `#e03131` red, `#2f9e44` green, `#1971c2` blue, `#f08c00` orange; fills `#ffc9c9`,
`#b2f2bb`, `#a5d8ff`, `#ffec99`.

### What is not possible (don't use)

Raster images (only SVG is dropped), web embeds, sticky notes beyond text elements, zooming or panning (beyond what `openup` and `back` do), multiple pages, libraries other than the page's own icons.
