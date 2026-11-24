# The diagram kit

A ready-made look and a set of moves for a short diagram explainer: two or three actors, each with an item and a
destination slot behind a lock, arrows of who can deliver to whom, a shared area, and moves that play the story out
(a lock snaps shut, an item bounces off it, the row turns into a ring, a copy runs along an arrow, a clock fills and
every slot pings). You write the world once and each scene's words and moves; the kit draws the rest, keeps one type
system, keeps text readable, and avoids the mistakes that make a diagram video look static or jolt at every cut.

The worked example is [`videos/d1-locker-ring/`](../videos/d1-locker-ring/): three couriers, each with a parcel for
a locker only a neighbour's key opens, about 30 seconds in four scenes.

| File | What it is |
|---|---|
| `templates/diagram/kit.css` | the look: Space Grotesk for heads, Inter for words, JetBrains Mono for exact strings; nothing under 26 px |
| `templates/diagram/kit.js` | the moves (`DiagramKit(root, tl, G, DUR)`, below) |
| `templates/diagram/caption-skin.html` | captions in the frames' Inter on a dark pill, instead of HyperFrames' default Roboto pill |
| `scripts/diagram.mjs` | `reelplanner diagram <video>`: writes the frames from `world.json` and `scenes/` |
| `scripts/shoot.mjs` | `reelplanner shoot <video> <frame> 2 5 end`: pictures of one frame at given seconds, before any build |

## Build one

```bash
mkdir -p videos/my-video/scenes          # world.json, scenes/, STORYBOARD.md, SCRIPT.md, BRIEF.md (copy the example's)
reelplanner diagram videos/my-video --silent     # frames with no voice yet: each phrase spread through its frame
reelplanner shoot videos/my-video 02-ring 2 5 end    # look; settle the picture here, it costs nothing
reelplanner narrate videos/my-video              # the voice, and each word's time
reelplanner diagram videos/my-video              # every move put on its word
reelplanner build videos/my-video --render       # captions, index, checks, the MP4 and its stillness (#60)
```

Run `reelplanner diagram` again after every narrate and every edit to a scene: `build` does not, and a build alone
leaves every move on the old voice's seconds. The storyboard's frames name the scenes' files
(`- src: compositions/frames/02-ring.html`), one frame a scene, in order; the script's lines are the frames' lines.

## `world.json`

```json
{
  "actors": [
    { "id": "ana", "name": "Ana", "color": "hsl(212 72% 46%)", "item": "Ana’s parcel", "slot": "locker 1", "area": "Ana’s round" },
    { "id": "ben", "name": "Ben", "color": "hsl(152 60% 34%)", "item": "Ben’s parcel", "slot": "locker 2", "area": "Ben’s round" }
  ],
  "enclosure": "one building",
  "shared": "the hallway: three lockers",
  "slotSuffix": "’s locker",
  "locked": ", closed to {name}’s key",
  "arrows": [{ "from": "ben", "to": "ana", "words": "Ben’s key opens locker 1" }],
  "states": [{ "key": "empty", "text": "empty" }, { "key": "handed", "text": "delivered by {from}", "tone": "good" }],
  "clock": { "unit": "hour", "length": 12 },
  "strings": { "title": "The locker ring" }
}
```

- **actors**: two or three (the layouts are drawn for those). `color` is `hsl(H S% L%)`; it is darkened, hue and
  saturation kept, until it reads at 4.6:1 on the paper, the card and the shared area, so contrast holds by
  construction rather than on the moments a check happens to sample.
- **arrows**: who can deliver to whom, and the words beside each arrow (beside it, never on it).
- **states**: the words a slot can show, the first one at the start. `{name}`, `{item}`, `{slot}` are the slot's
  actor's; `{from}` is the actor whose arrow points at it. `tone` is `good` or `warn`.
- **strings**: any other words a scene shows, as `{{title}}`. In a scene, `{{name:ana}}`, `{{item:ana}}`,
  `{{slot:ana}}`, `{{color:ana}}` and `{{from:ana}}` are the actor's.
- **tokens** (optional): the neutral colours, `paper`, `chrome`, `card`, `rule`, `rule-2`, `ink`, `ink-2`, `good`,
  `warn`, as `hsl()`. The kit draws in its own light palette; the review player's dark theme does not recolour it.

## A scene

```html
<!-- start: {"layout": "ring", "areas": true, "names": true, "items": "held", "slots": true, "locks": true, "arrows": true, "head": "h3"} -->
<!-- tail: 1.6 -->
<div class="dk-head" data-head="h3" data-label>Who can open which locker</div>
<div class="dk-head" data-head="h4" data-label>Two ways to finish</div>
<div class="dk-at dk-chip good" data-k="c1" style="left:70px;top:130px" data-label>◆ A neighbour delivers it</div>
<script>
  K.unhead("h3", 0.05); K.head("h4", 0.3);
  K.show('[data-k="c1"]', @@delivers it@@, { pop: true });
  K.carry("ben", "ana", @@delivers it+0.2@@, 2.0); K.state("ana", "handed", @@delivers it+2.2@@);
</script>
```

- **`start`** is where the frame begins, and must be exactly where the scene before it ended: its layout, what is
  shown, the head on screen. A difference is a jolt at the cut. A scene that plays something out (a delivery, an
  unlock) takes it back before it ends, so the next starts from the same picture.
- **`tail`** is the time the frame holds after its line; `hold` is the length of a scene with no line.
- **Anchors**: `@@a phrase@@` is the second the line says it, `@@phrase+0.4@@` after it, `@@word#2@@` its second
  time, `@@END@@` the line's end, `@@DUR@@` the frame's length. Arithmetic is plain JavaScript:
  `K.after(@@a@@ - 0.2, @@b@@ + 1.8)`. Pick phrases a transcriber spells one way (`neighbour` may come back as
  `neighbor`; a number as a digit): `reelplanner diagram` names any phrase the line does not say.
- **Every word** is in the markup with `data-label`, never written by script, so lint, the layout and contrast
  checks, a source check and `shoot` all read it. The one exception is the clock's count, a number.

## The moves

| Move | Shows |
|---|---|
| `K.move(layout, t, d)` | everything carried to the other layout, `row` (areas side by side over the shared area) or `ring` (each actor with its slot, the arrows between) |
| `K.after(a, b, …)` | the latest of several times: a move that must wait for another to finish |
| `K.head(key, t)`, `K.unhead(key, t)` | the scene's head arrives; the one before fades and leaves the frame |
| `K.actor(a, t)`, `K.cursor(a, t)` | an actor's area and name; a blinking cursor |
| `K.write(a, t)`, `K.slot(a, t)` | the item drawn line by line; a slot with its first state |
| `K.lock(a, t)`, `K.unlock`, `K.relock` | the lock snaps shut (and the slot says who it is closed to); opens; closes |
| `K.bounce(a, t)` | the item drops toward its own slot and the lock stops it (1.25 s) |
| `K.arrow(f, to, t)`, `K.words(f, to, t, out)` | an arrow of who can deliver to whom draws; its words |
| `K.carry(f, to, t, d)`, `K.uncarry(to, t)` | a copy of `to`'s item runs along `f`'s arrow into `to`'s slot, dots along the arrow while it travels |
| `K.drop(a, t)`, `K.undrop` | the actor's own item goes into its own slot; back out |
| `K.state(a, key, t)` | the slot's words change |
| `K.glow(f, to, t)`, `K.ring(t, gap)` | one arrow lit; every arrow in turn |
| `K.show(sel, t, {pop, stagger})`, `K.hide`, `K.dim(sel, t, to)`, `K.pulse(sel, t, n)` | a scene's own pieces |
| `K.type(sel, t, d)` | exact words revealed line by line |
| `K.draw(sel, t, d)`, `K.undraw` | a path of the scene's own drawing (a `.dk-wire`) draws itself |
| `K.work(sel, t, n, gap)`, `K.clear` | lines of work in a `.dk-term`, one every `gap` seconds: spread them over the time the work takes |
| `K.clock(t, d, every)` | a `.dk-clock` bar fills; every slot pings at each check |
| `K.cam(who, t, d, k)`, `K.zoom(t, s, x, y, d)`, `K.fade(t, to, d)` | the camera in on one actor or back; the world scaled and moved; faded under something shown over it |

The scene's own pieces have classes too: `dk-chip` (`good`, `warn`), `dk-card`, `dk-panel` (exact words, mono),
`dk-recap`, `dk-outside` (a party outside every area), `dk-wire`, `dk-term`, `dk-reply`, `dk-count`, `dk-big`, and
the title card's `dk-title`, `dk-subtitle`, `dk-tagline`, `dk-dot`. A move the kit lacks goes into `kit.js` with a
line saying what it shows, not into one scene.

## Pitfalls met, and what the kit does about them

| Seen | Cause | Fix |
|---|---|---|
| A jolt at every cut | a whole-frame "breathing" scale through each scene, reset at the next | no ambient transform of the whole picture; a frame begins exactly where the last ended |
| A scene's head showing through other scenes | a timeline that sets `visibility`: a rewind writes back an inline `visible`, which shows through a scene the player has hidden | never animate `visibility`; `K.unhead` fades and moves the element off the frame |
| Pieces shown at a scene's start that should come later | `fromTo` renders its "from" at once by default | `immediateRender: false` on every `fromTo` that is not an element's first appearance |
| Items left behind when the actors move into the ring | the move started before the bounce's return tween, which then pulled them back | `K.move(…, K.after(@@phrase@@, bounceStart + 1.3))` |
| Paths visible before their moment | `gsap.set(opacity: 1)` at build time | `tl.set` at the move's time (`K.draw` does) |
| "Text is hidden beneath an opaque element" | the world faded to a few percent under a panel still counts | fade it to 0 (`K.fade(t, 0)`), or put the panel where nothing is |
| Contrast fails on one cut and not another | an accent colour at 3.7:1, and a check that samples moments | `reelplanner diagram` darkens each colour until it reads |
| Captions in another typeface | HyperFrames' default caption pill | the kit's caption skin, copied in when the video has none |
| A label on top of its arrow | the label at the arrow's middle | beside it: out to the side of a steep arrow, above or below a flat one |
| Words like "emptylocker" in a terms check | adjacent spans with no space between | a space between pieces of markup (the world has them) |
| A still stretch while the voice finishes a sentence | the phrase has no move | a move that means the phrase: a chip pulses on "counts", each arrow lit on "only through a neighbour" |
| Decorative motion | dots running along every arrow all the time | dots only while something travels an arrow (`K.carry`) |

## Look, then two fresh reviewers

`reelplanner shoot` while writing; after the render, `reelplanner stillness <video>` (#60): under 25% of the time
still, no still stretch over 3 s, and no jolt. Then two fresh agents, told nothing of the design, each reading only
the MP4 (frames cut with ffmpeg) and `SCRIPT.md`:

- **A newcomer (clarity):** say the story back in your own words and mark what you are unsure of; where were you
  confused, or could have taken away something wrong; where does the picture fail to show what the narration says;
  score clarity out of 10 and list the five changes that would raise it most, each tied to a time.
- **A motion designer (look and motion):** judge typography (full-size crops: anything ugly, cramped, clipped or
  inconsistent), layout (overlaps, crowding, empty areas, the caption band) and motion (still stretches, decorative
  motion, too much at once, any jolt), with frames every half second and the stillness numbers; score look and
  motion out of 10 and list the six changes that would raise them most, each tied to a time.

Answer every finding, rebuild, and send a fresh pair again; stop when a round finds nothing new of weight.
