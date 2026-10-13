# What a frame is, for the tools

The formats the build reads, written down so no one learns them from reelplanner's source. How a frame looks is
the theme's (`theme/frame.md`, `theme/motion-language.md`) and the style guide's; this is only what the tools need.
A worker drawing frames gets its frames' part of this, with their words and timings, from
`reelplanner frame-packet <video-dir> <frame>…`, and checks a finished batch with
`reelplanner frame-check <video-dir> <frame> [<frame>…] [--no-shot] [--no-layout]`.

## The file

`compositions/frames/<NN>-<slug>.html`, the path the storyboard's `- src:` names; its composition id is the file's
name without `.html` (`03-pretrain`). One `<template>` holding the frame's `<style>`, its root, and its script:

```html
<template>
  <style> /* the frame's own classes, prefixed with its id (.f03-pretrain-…) so frames never collide */ </style>
  <div id="root" data-composition-id="03-pretrain" data-width="1920" data-height="1080" data-duration="8.18"
       data-band="bottom">
    … what the scene shows …
  </div>
  <script src="assets/vendor/gsap.min.js"></script>
  <script>
    (function () {
      var ID = "03-pretrain";
      var root = document.querySelector('[data-composition-id="' + ID + '"]');
      var q = function (s) { return root.querySelector(s); };
      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });   // one paused timeline, registered under the id
      window.__timelines[ID] = tl;
      var DUR = 8.18;                               // the frame's own length, in seconds
      tl.fromTo(q(".f03-pretrain-kicker"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.894);   // on "six"
      tl.to({}, { duration: 0.001 }, DUR - 0.001);  // the timeline runs to the frame's end
    })();
  </script>
</template>
```

- **Positions are seconds from the scene's start, written as plain numbers** (`0.894`), each on the word it goes
  with. When a line is voiced again at another pace, `retime-frames` moves plain numbers onto the same words; a
  computed position (`at + 0.12`, `LIFT[i]`) is reported and left alone. `DUR` (or `D`) is the frame's length,
  which `sync-durations` and `hold-durations` set: keep the last position at `DUR - 0.001`.
- Only what is the same every time it plays: no `Date.now()`, `Math.random()` or network.
- Fonts by family name in the frame's CSS (`font: 400 46px/1.1 "EB Garamond"`; the theme's are "EB Garamond",
  "Inter" and "JetBrains Mono"): HyperFrames loads them, so there is no font file to find. Images from the video's
  `assets/`.

## The marks the player reads

| On | Mark | Why |
|---|---|---|
| the root, every frame | `data-band="bottom"`, its lowest eighth (y 945–1080) empty | the player's chips and answer bar sit there |
| a decision's or quick check's heading | `data-question` | the player answers on the frame |
| each option card | `data-option="a"` … `"d"` | the reviewer clicks a card to answer |
| each call's card (a walkthrough's calls, stops, list) | `data-call="a3"` | the same, for a call |
| the one thing a detail or guide part explains | `data-detail="<name>"` | the player lays its "More in the guide" button over it |
| a real thing shown as itself (the brief's `- Real things:`) | `data-artifact` on its container; its words pinned on with `data-gloss` | its own text is not held to the video's word rules |

## The timing files (read them through the packet)

- `audio_meta.json`: `voices: [{ frame, path, duration_s, words: [{ text, start, end }] }]`, one per voiced frame;
  `start` and `end` are seconds from the scene's start. `narrate` writes it.
- `.hyperframes/holds.json`: `{ "<frame>": <seconds>, "tail": <seconds> }`, the least a held beat lasts (a branch, a
  beat that assembles something, the last frame), and an optional pause after every line.
- `.hyperframes/narration.json`: what each line was voiced from; `narrate` keeps it. Don't edit it.

## What `frame-check` (and `frame-lint`) stop

`frame-check` runs HyperFrames' layout and contrast check on the frame's slot of the assembled video and says what
it finds in that frame (text overflowing its box or hidden under another element, overlapping text, contrast under
WCAG AA), as advice. On a rebuild, `build`'s first stage runs verify's own check on the whole video before anything
is voiced, and stops on what verify would. And `frame-lint` stops: a camera or zoom that could reach y 900 outside a view clipped at 900 px;
a question's heading or card inside something that moves, unless at rest at scale 1 when the scene ends; a
`data-detail` mark in the bottom band, under 120 × 44 px, still moving in the scene's last 3 s, or twice with one
name; empty bars where words go; anything within 40 px above a `data-detail` mark. An image drawn wider than half its
pixels is a note (take screenshots at 2×).

A batch shares one layout browser and one snapshot browser. Every requested frame retains the same three layout
moments (25%, 60%, and 0.4 s before its end) and its plain at-rest PNG in `.hyperframes/shots/`. Inspect every PNG.
Framework lint or runtime errors, incomplete browser checks, and failed requested pictures exit 1; they cannot
produce a clean layout message. Frames not assembled yet get static checks and an explanation of missing pictures.
Layout, motion, and contrast findings remain advice; the full assembled `build` and independent reviews still apply.
Batch layout findings are grouped per source using the pinned HyperFrames persistence rules, so shared classes in
different scenes cannot hide one scene's finding. Updating the HyperFrames pin requires rerunning the differential
checks before updating those rules.


### Intended visible content

In each `## Frame N` block of `STORYBOARD.md`, keep the `- scene:` summary and add
`### Visible content` when the scene needs concrete evidence beyond that summary. Put only intended
screen content here: exact input/output values, intermediate reasoning, qualifications and relationships.
The section ends at the next heading of level 3 or above outside a fenced block. Fenced examples remain
content. Keep private author notes and guide-only text in another section. Legacy scenes need no migration.

```markdown
## Frame 25 — Count actors
- scene: count actors
- src: compositions/frames/25-counts.html
### Visible content
Input X/X/Y. Repeated X retains one actor identity.
Result: three occurrences, two actors. One versus three episodes changes neither count.
### Author notes
Layout and implementation notes go here.
```

`fresh-eyes --script` and `frame-packet` share this parsed scene summary, visible section and narration.
The packet also retains its original block, metadata, marks and word timing. This contract describes
intended evidence; final independent screenshot review still checks what actually reached the screen.
A missing explanation still needs a real repair and independent rereview, even if its intended labels exist.

New script stamps version and hash reviewer-visible scene content, narration, asks, terms, glossary and
latest review. `--script --check` fails stale input and mismatched findings headers. Timing and private-note
edits do not stale the review. Regenerating identical input preserves its stamp, timestamp, plan hash and
findings. Changed input archives the answered brief, stamp and findings under `fresh-eyes/script/review-N/`
and requires new independent findings; unanswered findings block regeneration. Legacy stamps remain
readable with a warning that they did not certify this contract. Do not copy old findings into a new review.
Count the larger brief's tokens, rereviews and repair time in the experiment cost; a clean intended-content
review never replaces the final newcomer and designer screenshot reviews.
