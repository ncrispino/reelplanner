# Scroll-driven and explorable pages: research for "the guide"

Research date: 2026-09-28. The screenshots were taken with Chromium (Playwright, `/opt/pw-browsers/chromium-1194`)
at 1440x900, plus 390x844 for the phone captures, at several scroll positions. Contact sheets are in
`scratchpad/shots/sheet-<name>.png` and single frames in `shots/<name>-NN.png`. The scripts that took them are
`scratchpad/batch.js` (it also records the words visible per screen, and the sticky, canvas, SVG and GSAP counts),
`llm.js`, `cnn.js` and `trust.js`.

---

## 0. Why the first prototype read as "a wall of text"

I measured the rejected `guide-prototype.html` with the same script as the sites below:

| Page | Words visible per screen (1440x900) | Share of the screen that is picture | What changes on scroll |
|---|---|---|---|
| **guide-prototype.html** | **308–492** | about 20% (a 340 px SVG in the left column) | one node or edge lights up in the small SVG |
| Apple AirPods Pro 3 | 13–72 (one 198-word spec block) | 70–100% | the whole screen: the scene, the scale, the colour, the headline |
| Apple Vision Pro | 20–70 | 80–100% | an inset photo grows to full-bleed; headlines cross over video |
| Stripe Press | 16–42 | 100% (a 3D stack of books) | the whole stack turns and moves |
| Linear /plan | 16–75 | 70% | a product UI panel per section |
| LLM Visualization (bbycroft) | ~150 in the side panel | 65% (a 3D model) | the camera flies to the part being explained |
| Pudding "Waveforms" | ~150 | 50% (the graph stays pinned) | the graph re-draws for each paragraph |
| Josh Comeau, Flexbox | 104–341 | inline widgets | nothing pins; you play with the widgets inline |

The owner's words ("the whole page to change, not just a subset of it") match the numbers. The pages that feel
like "you scroll and the whole thing changes" put **under about 60 words on a screen, and 70–100% of the screen
is one stage that changes**. The prototype had the opposite ratio: a 20% picture that changed only a highlight.
It also kept the full `plan.md` prose in the scrolling column, so the reader's eye stayed on the text.

---

## 1. Examples studied

The examples fall into four groups.

- **A. Product pages where the whole screen changes.** These are what the owner means.
- **B. Guided walkthroughs of one big diagram.** These are closest to a plan guide.
- **C. News scrollytelling.**
- **D. Explorable explanations: inline widgets inside prose.** These are good for depth and playgrounds, but
  they are not the "whole thing changes" feel.

### A. Product pages where the whole screen changes

**Apple AirPods Pro 3 — https://www.apple.com/airpods-pro/** (`sheet-airpods`, `sheet-apfine` at 300 px steps,
`sheet-apmob` for phone)
- **As you scroll:**
  - The hero product image scrolls away while the headline block slides up over it.
  - "Get the highlights" is a horizontal carousel of autoplaying clips, with dots and a pause button.
  - "Take a closer look" pins the product. Chips on the left (Sound quality, Fit and feel, Heart rate sensing…)
    each turn or swap the product render in place. This is progressive disclosure by click, not by scroll.
  - "Intelligent noise control" pins a full-viewport scene. An iridescent ring rises from the bottom and grows
    while the headline "The best thing you've never heard." stays centred (shots 9 to 13). Then a short paragraph
    and "2x more / 4x more" stats scroll up over it.
- **Text per screen:** one headline of 5–8 words, sometimes one paragraph of about 50 words.
- **Beyond scroll:** chips, a carousel, pause buttons, "Watch the film".
- **Navigation:** a sticky local nav (Overview, Hearing Health, Tech Specs, Compare, Buy).
- **Phone:** the same scenes stacked full-width. The product stays huge and the text is set in the gaps.
- **Technique:** `position: sticky` stages (12 sticky elements), inline `<video>` (15 of them), a few CSS
  `animation-timeline` rules (3), and Apple's own JS. There is no GSAP. Apple is known for canvas image-sequence
  scrubbing (CSS-Tricks, "Let's make one of those fancy scrolling animations…"). The 2026 page mostly uses
  video and CSS.
- **Why it feels like "the whole thing changes":** every section is a new full-viewport scene with a different
  background, scale and subject, and the one headline is the only text.

**Apple Vision Pro — https://www.apple.com/apple-vision-pro/** (`sheet-visionpro`)
- **Transitions:**
  - The hero photo fades while two short sentences scroll up over a white wash (shot 1).
  - An inset photo grows until it fills the screen: the "grow to full-bleed" move (shots 2 and 3).
  - Full-bleed video scenes carry a two-line headline over them ("The ultimate theater. Wherever you are.").
- **Text per screen:** 20–70 words, with one exception of 229.
- **What to take:** the inset-to-full-bleed zoom is the move for "we are now zooming into this part".

**Apple MacBook Pro — https://www.apple.com/macbook-pro/** (`sheet-macbook`)
- Dark full-bleed scenes: one kicker ("Performance"), one headline, 30–60 words, one visual.
- "Take a closer look" is an interactive, tabbed product viewer.
- The whole page is a series of about 10 scenes. Each one makes one point.

**Stripe Press — https://press.stripe.com/** (`sheet-stripepress`)
- The whole viewport is a WebGL stack of book spines that scrolls, turns and parts as you move. Clicking a book
  opens it.
- Text on screen: 16–42 words.
- A thin vertical rail of tick marks at the left edge shows where you are in the list: a minimal progress map.
- **What to take:** the tick rail for progress, and "the content is the stage": the list is the picture.

**Stripe Sessions — https://stripe.com/sessions** (`sheet-stripesessions`)
- A big 3D ribbon hero that shrinks as you scroll.
- The "About Sessions" paragraph is **scroll-highlighted**: words go from grey to ink as you scroll through
  them (shots 1 and 2). The text becomes the animation.
- **What to take:** a scrubbed word highlight turns one important paragraph into a beat, for example the
  problem quote.

**Stripe home — https://stripe.com/** (`sheet-stripe`, `sheet-stripediag`)
- Mostly cards.
- Near the end, a dark section draws a **system diagram** (CRM, Booking system, SDK, App Marketplace, Event
  Destinations, Data Pipeline, Orchestration, PSPs, with Stripe in the centre) with animated connectors, beside
  one sentence: "Connect to existing systems." The next beat re-lays out the same diagram with more nodes for
  "Scale with confidence."
- **What to take:** a plain node-and-edge diagram in the site's own type is enough to feel alive. The same
  diagram re-laid out per beat reads as "the whole thing changes".

**Linear — https://linear.app/ and https://linear.app/plan** (`sheet-linear`, `sheet-linearfeat`)
- Dark, big two-line headline on the left, one short paragraph on the right, and a large tilted **real product
  UI** (a project page, a roadmap, a code diff) under each headline.
- 16–75 words a screen on /plan.
- **What to take:** show the real artefact (the page, the file, the diff) as the picture, not an abstract icon.

**Also looked at: Raycast, Framer, Cursor, GitHub Copilot, Vercel, Supabase, Arc** (sheets in `shots/`)
- They share the grammar: full-width sections, a 2–10 word headline, and a big product mock that animates in.
- Copilot uses 10 CSS scroll-timeline rules and Comeau uses 21: CSS scroll-driven animation is now common for
  reveals.
- None of them pins long scrubbed sequences the way Apple does.

### B. Guided walkthroughs of one big diagram (closest to a plan guide)

**LLM Visualization, Brendan Bycroft — https://bbycroft.net/llm** (`llmviz-00`, `sheet-llmstep`)
- **Layout:**
  - Left panel (about 40%): a 2D schematic of the whole model, used as a **mini-map**. The current component has
    a dashed box around it.
  - Next to it, a chapter table of contents (Embedding, Layer Norm, Self Attention…).
  - Below them, the walkthrough text, with coloured words that match colours in the 3D view.
  - Right (about 60%): a 3D render of the whole model.
- **As you step** (Space, or the Continue button, or a chapter click): the camera flies to the part being
  explained (shots 0 to 8: from the overview to "Token Embed / Input Embed / Position Embed" to the Q/K/V
  weights). Cells light up as the computation runs.
- **Navigation:** Continue and Skip, a per-paragraph mini timeline with play, chapter arrows, and a vertical
  progress rail at the far left.
- **Beyond steps:** you can orbit and zoom the 3D view freely, and switch the model (GPT-2 small, nano-gpt, GPT-3).
- **Why it feels like "the whole thing changes":** the whole right side re-frames on every step, while the
  mini-map keeps you oriented.
- This is **the reference for "the system diagram zooms into the part a step changes"**.

**Transformer Explainer, Polo Club — https://poloclub.github.io/transformer-explainer/** (`trexp-00`)
- The whole viewport is one live diagram (Embedding → Multi-head Self-Attention → MLP → Probabilities) driven by
  **your own input**: you type a sentence and press Generate. Sliders for temperature and top-k change the output
  bars live.
- ⊕ icons expand a part into its detail.
- A **guided tour card** ("What is Transformer?", 1 / 20, with prev and next) sits over a corner and highlights
  the part it is talking about.
- **What to take:** the playground and the diagram are the same thing, and a small tour card replaces paragraphs.

**CNN Explainer, Polo Club — https://poloclub.github.io/cnn-explainer/** (`sheet-cnnclick`)
- The overview shows every layer at once. **Hovering** a node draws its incoming edges.
- **Clicking** a node fades the rest of the network to about 10% and **expands the node in place** into its
  computation (input → intermediate → conv), with animated edges. This is "focus + context".
- A long tutorial article sits below the tool.
- **What to take:** fade everything except the part being changed, and open the part in place.

**Jay Alammar, The Illustrated Transformer — https://jalammar.github.io/illustrated-transformer/**
(`sheet-alammar`)
- Static, but it teaches by **progressive zoom through one diagram**: a black box, then encoder and decoder, then
  6 stacked encoders, then one encoder's layers, then the vectors in one layer.
- Each figure is the previous one opened up, using the same colours.
- **What to take:** this is the storyboard to animate as a camera move.

### C. News scrollytelling

**The Pudding, "Let's learn about waveforms" (Josh Comeau) — https://pudding.cool/2018/02/waveforms/**
(`sheet-waveforms`, `sheet-wavemob`)
- **Desktop:** the graph is pinned on the left at about 50% width and re-draws per paragraph (amplitude,
  frequency, harmonics, the sum of two waves). Inactive paragraphs are **dimmed** so only the current one reads.
- Sliders inside the text change the graph.
- A persistent volume widget sits in the corner, with keyboard shortcuts (0–9, M).
- **Phone:** the graph pins to the **bottom 40%** of the screen and the text scrolls in the top 60%. It stays
  scrollytelling on a phone; it does not become a stack.
- **What to take:** the phone layout, and dimming the steps that are not active. Side by side on desktop, it is
  close to the rejected layout. The difference is that the graph is big and is the only thing that changes.

**The Pudding, "Film Dialogue" — https://pudding.cool/2017/03/film-dialogue/** (`sheet-pudding`)
- A chart pins at the top and **transitions between chart types** (Disney bar list → a 2,000-film beeswarm →
  per-film detail with search).
- Built with ScrollMagic, TweenMax and D3 (2017).
- **What to take:** the same data re-drawn in a different form per beat.

**R2D3, "A visual introduction to machine learning" — http://www.r2d3.us/visual-intro-to-machine-learning-part-1/**
- The site was down (HTTP 522) on the day of research. This is from its well-known design:
  - A full-width stage of dots (homes) that re-arrange into a scatter plot, then histograms, then a decision tree
    as you scroll. Short text blocks sit on the left.
  - A classic "one dataset, many forms" scroll.

**Bloomberg, "What's Really Warming the World?" — https://www.bloomberg.com/graphics/2015-whats-warming-the-world/**
- Blocked by a bot wall; from its known design: one pinned full-screen line chart, one factor line added per
  beat, and short text cards scrolling over the chart.
- The canonical "overlay" layout.

**NYT, "Snow Fall" — https://www.nytimes.com/projects/2012/snow-fall/** (`sheet-snowfall`)
- A counter-example: a hero video, then long article columns with media inserts.
- The famous part is only the full-bleed openers between chapters.
- This is the wall-of-text-plus-media shape to avoid.

**Technique reference: Pudding's "Responsive scrollytelling best practices" and "Scrollytelling with sticky"**
(pudding.cool/process/…)
- Use `position: sticky` for the graphic and JS only for step triggers (Scrollama, which uses
  IntersectionObserver).
- Set heights in px from `innerHeight`, not `vh`: the phone browser bars change `vh` as you scroll.
- Use fixed annotations instead of hover on a phone.
- Use fewer steps on a phone.
- Two layouts: side by side, and **full-bleed graphic with text cards overlaid**.

### D. Explorable explanations (inline widgets in prose)

**Bartosz Ciechanowski, "Mechanical Watch" — https://ciechanow.ski/mechanical-watch/** (`sheet-watch`)
- About 90 inline WebGL demos, one every screen or two. You drag to orbit, and a **slider scrubs each
  mechanism** (spring winding, the gear train).
- Text is 70–200 words between demos. **Words in the text are coloured like the parts** ("the **barrel**", "the
  **arbor**") and act as the legend.
- There is no pinning.
- **What to take:** colour-linked words, and "a slider scrubs the one mechanism of this beat".

**Red Blob Games, A* — https://www.redblobgames.com/pathfinding/a-star/introduction.html** (`sheet-redblob`)
- Inline diagrams with draggable start and goal, a **"Step backward / Step forward"** pair with a slider, and
  code blocks whose variables are coloured like the diagram.
- **What to take:** step-through buttons for a sequence (a case's data flow), with the code beside it.

**samwho, "Load Balancing" — https://samwho.dev/load-balancing/** (`sheet-samwho`)
- Each section has a small live simulation of requests (dots) flowing to servers, with reset, speed and pause.
- Requests that are dropped turn red.
- Later sections add more servers, weights and charts.
- **What to take:** "the example runs through each case" as literal dots moving through the system, with
  play, pause and speed controls.

**Nicky Case, "The Evolution of Trust" — https://ncase.me/trust/** (`sheet-trustp`) and
**"Parable of the Polygons" — https://ncase.me/polygons/** (`sheet-polygons`)
- **Trust:**
  - It is **not scroll at all**: full-screen slides, one short paragraph each, a big "…let's play a game →"
    button, and **chapter dots** in the footer (10 chapters). Every slide swaps the whole scene.
  - It ends in a sandbox with sliders.
- **Polygons:** scrolling prose, with full-width dark bands that hold playable simulations (drag the shapes,
  "start moving", a bias slider).
- **What to take:** button-driven full-screen steps are just as "whole-page" as scroll. Chapter dots give a
  sense of length.

**Setosa "Explained Visually", Image Kernels — https://setosa.io/ev/image-kernels/** (`sheet-setosa`)
- Hover over a pixel and the 3x3 multiplication is shown live.
- A kernel dropdown, then a closing **playground** (edit the matrix, upload an image).

**Josh Comeau, "An Interactive Guide to Flexbox" —
https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/** (`sheet-comeau`)
- Prose (100–340 words a screen) with dark widget panels: a "Drag me" container width, dropdowns for
  `justify-content` and `align-items`, a toggle for "Show primary axis".
- A sticky table of contents on the right that tracks the section.
- **What to take:** the widget style of an interface playground. The prose density is what to avoid.

**Amelia Wattenberger, "Thinking in React Hooks" — https://2019.wattenberger.com/blog/react-hooks**
(`sheet-hooks`)
- A class component and a function component side by side, with **coloured ribbons joining matching lines**
  (lifecycle method ↔ `useEffect`).
- As you scroll, the code changes and the ribbons re-route.
- **What to take:** a before/after that maps each part of the old to the new, for Built vs Plan and for an
  interface change.

**Distill, "Why Momentum Really Works" — https://distill.pub/2017/momentum/** (`sheet-distill`)
- A hero figure with sliders (step size, momentum) that you can drag. Dense math prose follows, with more small
  interactive figures.

**Seeing Theory — https://seeing-theory.brown.edu/**
- A chapter hub. Each section is a two-pane app (text on the left, a live simulation on the right).
- Navigation is by clicks, not scroll.
- (The captured shots show only the hub.)

**scroll-driven-animations.style (Bramus) — https://scroll-driven-animations.style/** (`sheet-sdastyle`)
- A catalogue of CSS `scroll()` and `view()` demos: progress bars, stacking cards, reveals, a carousel with a
  stepped progress bar.
- Each demo has a CSS version and a JS version.

---

## 2. Techniques, what they cost, and accessibility

| Technique | What it gives | Support (MDN BCD, 2026-09-24) | Cost and risk |
|---|---|---|---|
| **`position: sticky` stage + step triggers** (IntersectionObserver or Scrollama) | The pinned stage, and discrete beats that swap state | Everywhere | Cheap. `overflow: hidden` on an ancestor breaks sticky. Size the stage from `innerHeight`, or with `svh`/`dvh`, not `vh`. |
| **GSAP ScrollTrigger: `pin`, `scrub`, `snap: "labels"`** | One master timeline scrubbed by scroll, snapping to beat labels. Smooth camera moves between beats, and reverses for free when you scroll up. | GSAP **3.15.0** is the latest on npm. Every plugin (ScrollTrigger, Flip, DrawSVG, MorphSVG, MotionPath, SplitText) is free under the "standard no-charge license" and on jsdelivr: `cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js`. The repo already vendors **3.14.2** (`dist/review/shared/vendor/gsap.min.js`; `node_modules/gsap/dist` has ScrollTrigger and Flip). | gsap 73 KB + ScrollTrigger 45 KB minified (about 18 KB gzipped for ScrollTrigger); Flip 26 KB, DrawSVG 4 KB. Pin spacing needs care in flex parents. `ScrollTrigger.matchMedia` is deprecated: use `gsap.matchMedia()`. |
| **CSS scroll-driven animations** (`animation-timeline: scroll()` / `view()`, `animation-range`) | Reveals, progress bars and word highlights with no JS, off the main thread | Chrome 115+, **Safari 26+**, **Firefox: preview (Nightly) only** | Use only as an enhancement inside `@supports (animation-timeline: view())`. Never put meaning in it. |
| **View Transitions API** (`document.startViewTransition`) | A morph between two DOM states (a beat change, a layout change such as question 2's options). Elements with the same `view-transition-name` morph. | Same-document: Chrome 111, **Firefox 144**, Safari 18. It works everywhere now. | Cheap for discrete state swaps. Skip it under reduced motion. |
| **SVG `viewBox` camera** (tween `attr: {viewBox}`) | "The camera moves through one big diagram", crisp at any zoom, one source diagram | Everywhere | Very cheap. Labels scale with the zoom: set label size per beat, or use `vector-effect: non-scaling-stroke` for strokes. |
| **FLIP** (GSAP Flip, or by hand) | A heading or row flies from the `plan.md` text into its place on the stage | Everywhere | Moderate. Test it at phone width. |
| **SVG stroke draw and motion path** (DrawSVG, MotionPath, or `stroke-dashoffset`) | An edge draws on; a token (`--out` → `--to`) travels along the pipeline | Everywhere | Cheap. |
| **Canvas image sequence** (Apple) | Photoreal scrubbed product motion | Everywhere | Heavy: 100+ frames and megabytes. **Not needed for a plan guide.** |
| **WebGL / 3D** (Stripe Press, LLM viz) | Spatial scenes | GPU dependent | Highest risk on a phone. Not needed. |

**Accessibility rules seen in the best pieces** (the Pudding, scrollytelling.ai's pattern reference, and WCAG
2.2 SC 2.3.3):
1. `prefers-reduced-motion: reduce` swaps the layout; it does not delete. Unpin, and show each beat's end state
   as a still above its caption, or cross-fade with no motion. Parallax is off entirely.
2. Every step's meaning is in real text in DOM order. The graphics add to it; they do not carry it.
3. Never hijack the wheel or touch. Space, Page Down and the arrow keys must reach every beat. Snap gently
   (`snap` with a short `duration` and `delay`), or not at all.
4. Don't move focus when a step becomes active. Use an `aria-live="polite"` region for the stage's caption if
   the stage changes meaning.
5. Deep links (`#step-3-cases`) must land on the right beat in its end state.
6. Test on a mid-range Android: animate only transform, opacity and viewBox, and draw nothing per scroll frame
   that isn't needed.

---

## 3. Patterns for a plan guide

Each pattern has three parts: what it is, where it goes in the guide, and a reference example.

1. **One stage, the whole viewport, for the whole page.**
   - One pinned full-screen stage holds this plan's **system diagram** (plan.md, guide, video and plan map,
     review page, reviews/<id>.md, decisions.md, reel check, walkthrough.md).
   - Every beat is a new framing and state of it. Short caption cards scroll over it. There is no column of
     prose.
   - *Where:* the backbone of the page.
   - *Reference:* Bloomberg's warming chart, Apple Vision Pro, LLM Visualization.

2. **The camera zooms into the part a step changes (focus + context).**
   - At a step's first beat, the `viewBox` flies to the nodes that step touches. Everything else fades to about
     15%.
   - The step's one change is drawn on: an edge, a file, a field. A mini-map in the corner keeps the whole
     system in view, with a box for where you are.
   - *Where:* the opening beat of every step.
   - *Reference:* LLM Visualization (the mini-map with a dashed box, and the camera flight), CNN Explainer (fade
     and expand in place), Alammar (progressive zoom).

3. **Each case is a beat, and the example runs through the whole stage.**
   - Each row of a step's Cases table is one scroll beat. The stage re-renders with that row's real example: a
     token or file travels the pipeline, or stops where that case stops (the edit that overturns a decision
     bounces off `decisions.md`).
   - A small case counter reads "Case 2 of 4 · suggested edit, request changes", with ← → to step through.
   - *Where:* the Cases block of every step.
   - *Reference:* samwho (dots through the system, with play and pause), Red Blob (step backward and forward),
     R2D3 and Film Dialogue (the same data in a new form each beat).

4. **One or two sentences a beat, with "Read the full step" for depth.**
   - Captions are capped at about 35 words. Each step's full `plan.md` text, its whole case table and its
     interface sit in a **drawer**: a right-side panel on desktop, a bottom sheet on a phone. It opens from any
     beat of that step.
   - The drawer is what the completeness check reads ("every paragraph of plan.md lands in the page").
   - *Where:* every beat.
   - *Reference:* Apple (one headline a scene), the Transformer Explainer tour card, Waveforms (inactive
     paragraphs dimmed).

5. **The interface is a live playground.**
   - An Interface block becomes a small terminal or form on the stage. You choose flags (`--check`,
     `--out <file>`) or type the command, and the output prints from the plan's Interface lines.
   - For `reel check`, you toggle which of a step's four blocks exist and watch the ✗ lines appear.
   - *Where:* the Interface beat of each step (steps 1, 2 and 4 especially).
   - *Reference:* the Transformer Explainer (type your input and it runs), Setosa (the closing playground), the
     Comeau widgets, samwho's controls.

6. **The suggested edit is done in place and follows through the files.**
   - In step 4's playground you actually change `--out` to `--to` in the interface block. The stage then shows
     the three downstream files update live: `annotations.json` `edits[]`, `reviews/<id>.md` "Edits to apply",
     and the `decisions.md` entry. It also shows which scene gets rebuilt.
   - *Where:* step 4, and anywhere Edit applies.
   - *Reference:* Setosa's playground, and the Wattenberger ribbons that map each change to its effect.

7. **A before/after wipe, and ribbons for Plan against Built.**
   - A draggable divider (or a scrubbed wipe as the section passes the middle) between Before and After. For
     step 5, it is between the interface as planned and as built.
   - Coloured ribbons join the lines that match, and the lines that differ are marked.
   - *Where:* step 5's Built side, and any step that changes something you see (step 3's player controls).
   - *Reference:* "Thinking in React Hooks" (the ribbons), Apple's inset-to-full-bleed move for the reveal.

8. **Questions as decision cards whose options re-shape the stage.**
   - An open question is a card with its options A, B and C, each with its example. Choosing or hovering an
     option **morphs the whole stage into that option's world**. Q2's A, B and C are three layouts of video
     plus guide. Q4's options re-draw a cost bar for a 1-step and a 6-step plan.
   - Your pick is kept and appears in "Yours".
   - *Where:* the end of steps 1, 3, 4 and 5 (questions 1 to 4).
   - *Reference:* the Nicky Case sandbox, Apple's "Take a closer look" chips (click to swap the scene), and View
     Transitions for the morph.

9. **A persistent step rail with beat ticks.**
   - A slim bar at the top on desktop (bottom on a phone): Problem · What changes · 1 · 2 · 3 · 4 · 5 ·
     Decisions · Yours.
   - Each step has small ticks, one per beat (its cases, interface, example, question). A fill shows your
     progress. Click to jump; J and K move a beat; 1–5 jump to a step.
   - *Where:* global.
   - *Reference:* the Stripe Press tick rail, the Trust chapter dots, LLM viz's chapter list and progress rail.

10. **"Watch this part" on the stage.**
    - A docked video thumbnail in a corner of the stage shows the scene time that matches the current beat
      ("Step 4 · 3:35"). It updates as you scroll and opens the review page at `#t=`.
    - It is the reverse of the video's "More on the guide".
    - *Where:* global, tied to each beat's `scene` field.
    - *Reference:* the AirPods "Watch the film" link, and the Waveforms persistent corner widget.

11. **Colour-linked words.**
    - Every noun in a caption that names a thing on the stage (`plan.md`, "the review", "scene 6") is set in
      that thing's colour. Hovering or focusing it pulses the node.
    - The same words as the glossary: underlined terms open their meaning, as in the video's captions.
    - *Where:* every caption.
    - *Reference:* Ciechanowski (coloured part names), LLM viz (coloured terms), Red Blob (coloured variables).

12. **A scrubbed highlight for the one quote that matters.**
    - The owner's problem quote is shown full-screen and the words ink in as you scroll. Then it collapses into
      the "7 times 'explain this more'" beat.
    - *Where:* the opening problem beat only (use it once).
    - *Reference:* the Stripe Sessions paragraph highlight. It is CSS `view()` where supported, with a GSAP
      fallback.

**Avoid:**
- Parallax, except once in the opener if at all.
- 3D or WebGL.
- Canvas image sequences.
- Long pinned sections with nothing changing: every beat must visibly change the stage.
- A second column of prose.
- Hover-only information.

---

## 4. Recommended structure for the new prototype (the plan-guide plan)

### The frame (all the time)

- **The stage** is a full viewport, pinned, and has three layers:
  1. The **system SVG**: all parts of this plan's system laid out once, with a `viewBox` camera.
  2. A **scene layer** that holds the step's own objects: the step anatomy card, the terminal, the pipeline
     token, the Plan and Built panels, the decision cards.
  3. A **caption card** of 1–2 sentences: bottom-left on desktop, over a soft paper gradient; on a phone it is
     the top of the lower panel.
- **The top rail** (pattern 9) carries: the plan title (short), the steps with beat ticks, "Yours (n)", the theme
  switch, and a "Read as text" switch that turns the whole page into the stacked static version (the same as
  reduced motion or no JS).
- **The corner "Watch this part"** thumbnail (pattern 10).
- **The mini-map** (pattern 2): a small full-system outline with a box for the current view. It shows on desktop
  once you are past the "What changes" act.
- **The drawer**, which slides in over about 40% of the width on desktop, or up as a bottom sheet on a phone. It
  holds the step's full `plan.md` text, the full case table, the interface block (with Edit), the example and
  the decisions. Every caption has "Read the full step →".

### The beats

The numbers given are about 100–140 px of scroll per sub-move, and about one viewport per beat.

**Act 0 — Opening (1 beat)**
- The stage opens as a big video frame (a still from the plan video) with the title.
- As you scroll, the video frame **shrinks and docks** into the top-right corner, where it becomes the "Watch
  this part" thumbnail. Behind it, the system diagram fades in, zoomed far out.
- Caption: "The video is the summary. This page is the whole plan: every case, interface and choice, and you can
  change it."

**Act 1 — The problem (3 beats)**
1. The owner's quote fills the stage and **inks in word by word** as you scroll (pattern 12).
2. The quote shatters into **7 speech bubbles** (the seven "explain this more" answers). They land on four plan
   cards (deep-dives, better-visuals, contributing, walkthroughs-that-help), each with its real quote on hover
   or tap. Caption: "Seven times in four plans, a question came back as 'explain this more'."
3. The bubbles **morph into two bars**: `plan.md` 2,000–7,000 words against the video's 770–1,060 words of
   narration. The video bar is shaded as about a quarter. Caption: "A video can only hold a quarter of the plan.
   The rest had nowhere to go."

**Act 2 — What changes (4 beats, one per change)**
- The system diagram **draws itself** (DrawSVG): plan.md, then guide, then video ↔ guide, then review → reviews,
  decisions and plan.md, then walkthrough → Built.
- Each beat lights one of the four changes and labels it with its steps ("1–2 · the guide", "3 · point at each
  other", "4 · edit on the guide", "5 · after the build"). Everything else dims.
- The rail's step ticks appear here.

**Step 1 — The guide, built from plan.md (6 beats)**
- **1.0 zoom:** the camera flies to the plan.md → guide edge. The `plan.md` document on the left **FLIPs its
  headings** into the guide's sections on the right: Problem, What changes, Step 1…5, each with its Cases,
  Interface, Example and Decisions chips. Caption: "`reelplanning guide` builds a page from plan.md, all of it,
  in about a second."
- **1.1–1.3 cases** (pattern 3; the counter reads "Case 1 of 3"):
  - (1) A new plan: `reelplanning build` runs and `guide/index.html` pops into the folder tree.
  - (2) Revised after review: step 3's text in plan.md flickers with a change, and the guide re-builds with a
    1-second progress sweep.
  - (3) An older plan, walkthroughs-that-help: a ghost guide with a dashed outline and "run `reelplanning guide`
    to make one". Its block slots show "may be missing".
- **1.I Interface playground** (pattern 5):
  - A terminal on the stage, with flag chips `--check` and `--out <file>`, and a Run button (Enter).
  - It prints `✓ …/guide/index.html · 5 steps, 4 questions, 38 KB`, or the check lines with `--check`.
  - Beside it, the file list: `index.html` is marked "built, never committed", and `<step>.html` "committed".
- **1.Q Question 1** (pattern 8): three cards, A plan.md, B guide, C both.
  - Selecting one re-draws the source arrows on the stage: A plan.md → guide; B guide → plan.md with every tool
    now reading a generated file (the tools turn amber); C two sources with a "check" between them showing ≠.
  - "Recommended: A" tag. Your choice goes to Yours.

**Step 2 — Complete, and checked (6 beats)**
- **2.0:** the stage becomes the **anatomy of a step**: one big step card with four slots (Cases, Interface,
  Example, Decisions). The camera then goes to `reel check` in the diagram.
- **2.1–2.4 cases:** the slots fill or empty for each case, and a `reel check` terminal line types out:
  - four blocks → ✓ passes;
  - no Cases table → the Cases slot is empty and red, `✗ step 3 has no Cases table…`;
  - wording only → Interface shows "No interface: wording only" and ✓;
  - the video leaves it out → a "not in the video" tag, and ✓.
- **2.I playground:** toggle the four slots yourself and watch the `reel check` output change live.
- **2.C the guide's own check:** a scan line sweeps a 375 px phone frame of the guide. It ticks off "every
  paragraph of plan.md in the page", "24 scenes → 5 sections", "no sideways scroll".

**Step 3 — The video and the guide point at each other (6 beats)**
- **3.0:** the stage **splits**: the video player on the left and the guide on the right, with the link between
  them drawn as an arc.
- **3.1–3.4 cases:**
  - "More on the guide" is clicked on scene 12: the play head pauses, and the arc animates into step 3's
    section.
  - "Watch this part" on step 5: the reverse arc, and the video plays.
  - A scene with no step: the arc goes to the top (the Problem).
  - A section with no scene: no button, and a "not in the video" label.
- **3.I:** the four anchor lines (`- guide: step-3#cases`, `frames[i].guide`, `#t=102`, `#step-3`) sit as rows.
  Hovering or focusing a row lights where it lives on the stage.
- **3.Q Question 2:** A, B and C **morph the whole stage** (View Transition) into the three layouts: A, the guide
  in the 340 px column beside the video; B, its own page with two "tabs"; C, over the paused frame. Each shows
  its cost callout.

**Step 4 — Edit the plan on the guide (7 beats)**
- **4.0:** the stage becomes the **pipeline**: guide → review (`annotations.json`) → `reviews/<id>.md` →
  `decisions.md` → `plan.md` → rebuild (guide, scene 6).
- **4.1–4.4 cases:** a token travels the pipeline, scrubbed by scroll along a motion path (pattern 3):
  - a comment ("why 375 px?") stops at "revise step reads it";
  - the suggested edit `--out`→`--to` with request changes goes all the way, and scene 6 lights up;
  - approve goes all the way, but no scene lights up;
  - the edit that overturns D-213 **bounces off** `decisions.md` and comes back as a "?" question card.
- **4.I edit in place** (pattern 6): step 1's interface block is editable on the stage. Type `--to`, and
  `edits[]`, the "Edits to apply" line and the new D-2xx entry update live in three mini file panels.
- **4.Q Question 3:** A, comments only (the token is a speech bubble the agent paraphrases); B, suggested edits
  (your exact words go through); C, direct edits (the token skips `decisions.md` and is marked "local only").

**Step 5 — After the build (5 beats)**
- **5.0:** the **Plan | Built wipe** (pattern 7). A divider sweeps across as the section reaches the middle;
  after that you can drag it.
- **5.1–5.3 cases:**
  - built: the ribbons join the planned and built lines, and they all match;
  - not built yet: the Built half is a ghost, "not built yet";
  - built differently: one ribbon turns coral at `--out` against `--to`, with a link to the walkthrough scene.
- **5.Q Question 4:** a 1-step plan and a 6-step plan side by side. Options A, B and C switch which of them gets a
  guide and a Built side, and re-draw a small cost bar (about 10 minutes and 20,000 tokens a plan, plus a few
  lines a step).

**Close — Decisions and Yours (2 beats)**
- **Decisions in force:** the D-numbers become chips on the stage, grouped by the step they touch.
  - Clicking a step in the rail filters them; each chip opens its one line.
  - "Not in this plan" is a short list, greyed out.
- **Yours:** your four answers, edits and comments as a summary card, with Send. This is the same review as the
  review page (question 2's B).

That is about 40 beats. At about 0.9 viewport a beat, the page is about 36 viewports, and each one visibly
changes the stage.

### Technical approach

- **One self-contained HTML file.**
  - For the prototype: `gsap@3.14.2` (matching the repo's vendored copy) + `ScrollTrigger` + `Flip`, and
    optionally `DrawSVGPlugin` and `MotionPathPlugin`, from `cdn.jsdelivr.net/npm/gsap@3.14.2/dist/*.min.js`.
    All are free.
  - For the real builder: inline them from `node_modules/gsap/dist`, because step 2's `guide --check` fails a
    page that loads from the network.
  - Fonts come from the review page.
- **Data-driven.** A `<script type="application/json" id="beats">` holds, for each beat:
  `{id, step, kind: open|case|interface|example|question|decisions, camera: {desktop: viewBox, phone: viewBox},
  focus: [nodeIds], scene: "sceneName", state: {...case data}, caption, videoTime, anchor: "step-4-cases"}`.
  - One `render(beat, progress)` sets the stage.
  - This is also exactly what `scripts/guide.mjs` would emit from `plan.md`: Cases rows become case beats.
- **Scroll mechanics.**
  - A tall `#track` holds one invisible spacer per beat (the caption cards live in it, in DOM order, so the text
    is real and readable).
  - A master timeline has one label per beat: `gsap.timeline({ scrollTrigger: { trigger: '#track', start: 'top
    top', end: 'bottom bottom', scrub: 0.6, snap: { snapTo: 'labels', duration: {min: .2, max: .5}, delay: .15 } }
    })`.
  - The camera tweens `attr: {viewBox}` between labels. Scene swaps use `Flip`, or a `startViewTransition` on
    discrete beats.
  - The stage is `position: sticky; top: 0; height: 100svh` (or px from `innerHeight` on old iOS).
- **Keyboard.**
  - J and K (and ↓ ↑ when the stage has focus) move to the next or previous label with `ScrollToPlugin`, or
    `scrollTo` a spacer.
  - 1–5 jump to steps. Esc closes the drawer. Tab reaches every control: the rail, the case arrows, the
    playground, the option cards, Edit.
  - Focus is never moved on scroll. The caption region is `aria-live="polite"`.
  - Every beat has an `id` (`#step-3-cases`, `#step-3-case-2`) so deep links from the video land on that beat's
    end state.
- **Phone (≤ 720 px).**
  - The stage pins to the top 55–60% (`svh`). Captions and controls scroll in the lower 40–45%, as in Waveforms.
  - Every camera has a narrower `viewBox`, and the mini-map is hidden. The drawer becomes a bottom sheet.
  - Tap targets are ≥ 44 px, and nothing is hover-only.
  - Check that nothing scrolls sideways at 375 px.
- **Light and dark.**
  - Use the player's tokens (`--ground #F1EFE8 / #0E0D0B`, `--paper`, `--ink`, `--ink-2`, `--ink-3`,
    `--accent #B8552E / #D2693F`) under `prefers-color-scheme`, with the `[data-theme]` override.
  - SVG strokes and fills use `currentColor` and CSS variables so the camera works in both.
- **Reduced motion, no JS, and print.**
  - Under `gsap.matchMedia()` `"(prefers-reduced-motion: reduce)"`: no pin, no scrub, no snap. Each beat renders
    its **end state** as a still SVG above its caption, in a single column. Toggles and playgrounds still work.
  - The same layout is used without JS (`<html class="no-js">`) and for "Read as text".
  - The page carries each beat's final state in the HTML as it loads (the plan's "nothing is only in the
    motion").
- **Performance.**
  - Animate only transform, opacity and `viewBox`. The stage is one SVG of about 60 nodes.
  - No canvas, video or WebGL. Use a poster image for the docked video thumbnail.
  - The target is about 60–80 KB of page plus about 145 KB of GSAP.
- **Verification.** Run the same Playwright contact-sheet script at 1440 and 390, with reduced motion emulated,
  and with keyboard-only J/K. Every beat's shot should differ visibly (pixel diff over a threshold), and the
  visible words should be ≤ about 60 a beat outside the drawer.

---

## Sources

- Apple: https://www.apple.com/airpods-pro/ · https://www.apple.com/apple-vision-pro/ · https://www.apple.com/macbook-pro/
- Stripe: https://stripe.com/ · https://stripe.com/sessions · https://press.stripe.com/ · https://stripe.com/payments
- Linear: https://linear.app/ · https://linear.app/plan · https://linear.app/method
- LLM Visualization: https://bbycroft.net/llm (code: https://github.com/bbycroft/llm-viz)
- Polo Club: https://poloclub.github.io/transformer-explainer/ · https://poloclub.github.io/cnn-explainer/
- Jay Alammar: https://jalammar.github.io/illustrated-transformer/
- The Pudding: https://pudding.cool/2018/02/waveforms/ · https://pudding.cool/2017/03/film-dialogue/ · https://pudding.cool/process/responsive-scrollytelling/ · https://pudding.cool/process/scrollytelling-sticky/
- R2D3: http://www.r2d3.us/visual-intro-to-machine-learning-part-1/ (down: 522)
- Bloomberg: https://www.bloomberg.com/graphics/2015-whats-warming-the-world/ (bot wall)
- NYT: https://www.nytimes.com/projects/2012/snow-fall/
- Explorables:
  - https://ciechanow.ski/mechanical-watch/
  - https://www.redblobgames.com/pathfinding/a-star/introduction.html
  - https://samwho.dev/load-balancing/
  - https://ncase.me/trust/
  - https://ncase.me/polygons/
  - https://setosa.io/ev/image-kernels/
  - https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
  - https://2019.wattenberger.com/blog/react-hooks
  - https://distill.pub/2017/momentum/
  - https://seeing-theory.brown.edu/
- Techniques:
  - https://gsap.com/docs/v3/Plugins/ScrollTrigger/
  - https://gsap.com/showcase/
  - https://github.com/russellsamora/scrollama
  - https://scroll-driven-animations.style/
  - https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
  - https://scrollytelling.ai/scrollytelling-design-patterns/
  - MDN browser-compat-data 8.1.3 (2026-09-24) via jsdelivr
