# Motion language (video / motion layer)

`frame.md` says what a frame looks like; this says how it moves and what each move means. Motion here
is never decoration: a move tells the viewer where to look, what came from where, or that we are
somewhere new. `hyperframes-animation` has the recipes; this file says which ones this theme uses, and
the rules the checks hold a frame to.

Every tween is on the frame's one paused timeline, with a literal duration and a literal position, so a
frame seeks to any time and `motion-static` can read it. Initial states are set with `gsap.set`, outside
the timeline. Only transforms and opacity move (`frame-lint`); a counter or a typer may drive text from
the timeline. No blur, tilt, glow, bounce or idle drift.

## 1. The camera

A scene about one thing can have a camera: the thing is laid out once, at full size, in a **world**, and
the camera moves over it (a pan, a push in on a detail, a pull back to the whole). The thing's parts do
not move to be seen; the camera does, so the viewer keeps one picture of it.

```html
<div class="FID-view" id="FID-view">          <!-- clipped: overflow:hidden; top:0; height:900px -->
  <div class="FID-cam" id="FID-cam" data-camera>   <!-- transform-origin:0 0; the timeline moves this -->
    … the real thing, laid out once …
  </div>
</div>
<!-- a question's heading and its cards sit here, outside the camera -->
```

- **One view, clipped above the answer area.** The camera sits inside a view with `overflow:hidden`
  whose bottom is at most y 900, so nothing it carries is ever pushed into the lowest eighth (the
  captions and the answer chips, D-108). `frame-lint` fails a camera, or any zoom that could reach y 900,
  outside such a view. Name the camera: `data-camera`, or a class ending `-cam`, `-camera` or `-world`.
- **Poses, not wandering.** A camera goes from one pose to the next on a word: a pose puts a point of
  the world at the view's centre at a scale (`x = 960 − s·px`, `y = 450 − s·py`, origin 0 0). A scene
  has two to four poses. Slow pans ease `sine.inOut` or `power1.inOut`; a landing eases `expo.out`.
- **At rest when a question ends.** The review player measures a question's heading (`data-question`)
  and its cards (`data-option`) where they are when the scene ends. Keep them outside the camera; if
  they must sit inside it, the camera is at rest, at scale 1, by the scene's end. `frame-lint` fails a
  heading or card inside anything that is still moving, or not at scale 1, then. The case behind a
  question may stay frozen, dimmed, behind it.
- **Text size is what the screen shows.** A label inside a camera is measured at the camera's smallest
  scale (`frame-lint`'s 26 px mono floor counts screen pixels there).
- A camera move counts as motion for `motion-static`, and it reports the camera's share on its own.

## 2. Reveal a thing by its own verb

A thing appears the way it would come to exist, on the word that names it (the cues put it there):

| verb | for | how |
|---|---|---|
| **drawn** | an underline under a word, a bracket, a stroke, an edge | `scaleX` 0→1 from its start (transform-origin left), `power1.inOut`, 0.4–0.9 s |
| **typed** | a command, a line of code | the text driven from the timeline, one character a step; a caret that blinks in whole cycles |
| **printed** | a command's output | each row at once (opacity, 0.1 s), a beat after the command finishes |
| **wiped** | a before and after, a new row, a replaced line | a clip window slides while the content counter-slides (transforms only), `power2.inOut` |
| **counted** | a number that changes (23 → 5) | a numeral wheel or a counter on the timeline, on the word |
| **struck** | what a change removes | a line drawn through it, then it dims to 40% |
| **pinned** | a plain word on what it names (`data-gloss`) | the label rises 8 px and fades in, its underline draws |

A pop (fade and rise) is for a thing with no verb of its own: a label, a chip. A scene is not a drip of
pops: `motion-static` reads helper-made pops too, and a scene that is mostly still between them
is reported.

## 3. Transitions carry meaning

A scene's `- transition_in:` says how we got here, and a viewer learns the grammar within a minute:

| transition | means | storyboard |
|---|---|---|
| **cut** | a new chapter, or a quick check that interrupts | `- transition_in: cut` |
| **push** | the next scene of the same chapter: we move along | `- transition_in: push-slide LEFT` |
| **push up** | something comes up to you: a question, the answer bar | `- transition_in: push-slide UP` |
| **crossfade** | the same place, later (a branch, the ending) | `- transition_in: crossfade` |
| **zoom into code** | into a step's detail | a **cut** that lands close on the detail, then a camera **pull-back** in the frame |

`zoom-through` is scale and opacity only: `finish-project` strips the registry's blur from it
(`scale-only-zoom`). `blur-crossfade` stays banned (the theme has no blur). A video picks one main
transition in its BRIEF.md and uses the others where they mean something; `build` warns when over 70%
of its transitions, or of its scenes' layouts (`- layout:`), are one kind.

## 4. What stays still

- The lowest eighth (y ≥ 945): nothing but captions, and the player's chips while a question waits.
- A question's heading and cards, once the scene ends.
- Where the reviewer draws: hold the frame still for a beat after the last piece lands (holds.json).
- One coral at a time, including in motion: a coral mark hands off, it is never two at once.
