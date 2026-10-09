# Why this theme (read docs/design-rationale.md §2 for the full table)
# - cream ground + ink text: paper contrast for a three-minute watch; strokes in the review player read on it.
# - one coral, one element at a time: the video's job is to point at one thing per beat; the reviewer's pen uses the same colour.
# - navy only for the data surface: the eye finds where state lives first.
# - three type voices: serif = the narrator's sentence (captions), sans = the stage's names, mono = exact values.
# - no gradients, glows, blur, tilt, music: load without meaning. The hairline card shadow is the only elevation.
# - the coral is darker (#B8552E, D-142): it clears 3:1 on the paper and both tiles, which #CC785C did not; its dark partner #D2693F keeps the hue.
# - the mono heading is optional (better-visuals): a quiet place label where it helps, not a ✱ kicker on every frame; the real thing leads where the brief picks it.
# A theme change must come with a reason in this header; the critique loop (rationale §5) rejects decoration.

---
version: alpha
name: Code editorial — Frame (video / frame layer)
description: >
  Video-first companion to Code editorial's design.md. The unit is the frame (1920×1080). Atoms are
  identical and sacred — warm cream paper (never pure white, never cool), a single terracotta coral
  as scarce "voltage", hairline ink elevation (no heavy shadow), EB Garamond for all
  display + Inter body + JetBrains Mono for the index/code voice on a warm-navy code surface,
  sentence-case display, and the ✱ coral spike mark. Composition + frame scale rewritten. Motion is
  motion-language.md, beside this file.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  ink: "#141413"
  cream: "#FAF9F5"
  tile: "#EFE9DE"
  tile-strong: "#ECE3D4"
  coral: "#B8552E"        # D-142; the dark theme's partner is #D2693F (tokens.html)
  navy: "#181715"
  navy-soft: "#1F1E1B"
  navy-elev: "#252320"

borders: { hairline: "1px solid ink@12%", hairline-strong: "1px solid ink@20%", dark: "1px solid cream@14% (on navy)" }
shadows: { card: "0 1px 3px ink@8%, 0 4px 16px ink@4%", none: "none" }

typography:
  # — reading + chrome ramp —
  body:    { fontFamily: "Inter", cqw: 1.5, weight: 400, lineHeight: 1.5 }
  lead:    { fontFamily: "Inter", cqw: 2.08, weight: 400, lineHeight: 1.5 }
  card-title:{ fontFamily: "Inter", cqw: 2.3, weight: 500, lineHeight: 1.25, tracking: "-0.005em" }
  button:  { fontFamily: "Inter", cqw: 1.46, weight: 500, lineHeight: 1.0 }
  tag-upper:{ fontFamily: "Inter", cqw: 1.35, weight: 500, tracking: "0.18em", upper: true }
  place-label:{ fontFamily: "JetBrains Mono", px: 26, cqw: 1.35, weight: 500, tracking: "0.06em", color: "ink@62%" }
  mono-label:{ fontFamily: "JetBrains Mono", px: 26, cqw: 1.35, weight: 500, tracking: "0.02em" }
  code:    { fontFamily: "JetBrains Mono", cqw: 1.67, weight: 400, lineHeight: 1.6 }
  # — display ramp (EB Garamond 400, sentence case, negative tracking. Renderer embeds only 400/700 — author at 400; italic is the synthesized slant) —
  headline:{ fontFamily: "EB Garamond", cqw: 4.6, weight: 400, lineHeight: 1.06, tracking: "-0.018em" }
  quote-pull:{ fontFamily: "EB Garamond", cqw: 5.0, weight: 400, lineHeight: 1.12, tracking: "-0.012em", italic: true }
  display-italic:{ fontFamily: "EB Garamond", cqw: 6.7, weight: 400, lineHeight: 1.05, tracking: "-0.012em", italic: true }
  display:{ fontFamily: "EB Garamond", cqw: 7.3, weight: 400, lineHeight: 1.02, tracking: "-0.022em" }
  number-hero:{ fontFamily: "EB Garamond", cqw: 9.4, weight: 400, lineHeight: 0.95, tracking: "-0.025em" }
  display-cover:{ fontFamily: "EB Garamond", cqw: 9.9, weight: 400, lineHeight: 0.98, tracking: "-0.028em" }
  number-unit:{ fontFamily: "JetBrains Mono", cqw: 2.08, weight: 500, lineHeight: 1.0 }

spacing:
  slide-pad: "4.2cqw"   # ~80px @1920
  gap-md: "1.7cqw"
  hairline: "1px"
  radius-sm: "6px"
  radius-md: "8px"
  radius-lg: "12px"
  radius-pill: "9999px"

components:
  card-hairline:
    backgroundColor: "{colors.cream} or {colors.tile}"
    border: "1px solid {colors.ink}@12%"
    rounded: "{spacing.radius-lg}"
    shadow: "{shadows.card}"
    typography: "{typography.card-title} + {typography.body}"
    description: "The editorial content card. Elevation is the hairline + ONE soft warm shadow — never a heavy drop, glow, or gradient."
  place-label:
    typography: "{typography.place-label}"
    description: "OPTIONAL. A quiet mono label saying where the scene is, as the thing names itself: `walkthrough.md · fewer, better stops`, `scripts/lib/autonomy.mjs · missFor`, `Chapter 3 · Step 2`. Use it when it helps the viewer place the scene; leave it off when the scene says so already. No ✱, no uppercase, never a sentence, never coral."
  artifact:
    markup: "data-artifact=\"<what it is>\" on the container"
    description: "The real thing a scene is about: the real table with its labels, the real diff, the real command and its output, the real screen before and after. It is the focal; a card ABOUT the thing is only for what has no surface (a rule, a count). Its own words stay as the files write them."
  pinned-word:
    markup: "data-gloss=\"<the artifact's own word>\" on the label; the label's text is the plain word"
    description: "A word the video defines, pinned on the token, column or button it names (a small label on the thing, a draw-on underline under it), never a card floating beside it. Sans, on a paper or slab-ink chip; one of them may be the frame's coral."
  detail-mark:
    markup: "data-detail=\"<the storyboard's detail name>\" on the one thing the scene's detail page explains"
    description: "Where a scene opens a detail, the thing its page explains is the way in: the code block, the table, one row or line of it, or a pinned word's label. The review player lays a clear button over it with a small ink tab, 'Open · <title>'; the frame draws nothing for it. The smallest thing that is still what the page is about, at least 120 × 44 px, above the lowest eighth, and at rest (camera included, at scale 1) for the scene's last 3 s."
  coral-callout:
    backgroundColor: "{colors.coral} (full-bleed) or {colors.cream} with a coral edge"
    textColor: "{colors.cream} on coral"
    rounded: "{spacing.radius-md}"
    typography: "{typography.button} / {typography.h2}"
    description: "The ONE voltage moment per frame — the CTA, the single inline link, OR the full-bleed band. Never two corals in one frame."
  number-lockup:
    typography: "{typography.number-hero} figure + {typography.number-unit} unit"
    description: "Hero stat — a EB Garamond figure paired with a JetBrains Mono unit (200K, +1,204, −318, 17 files). Figure is serif; the unit is ALWAYS mono, never the serif."
  pull-quote:
    typography: "{typography.quote-pull} (EB Garamond italic) + {typography.tag-upper} cite"
    description: "A commit message, a reviewer line, or the thesis. EB Garamond italic, small Inter uppercase cite beneath."
  section-rule:
    rule: "1px solid {colors.ink}@12% (or {colors.cream}@14% on navy)"
    description: "The only separator. A coral 1px rule may draw on to introduce a section. Never 2px+, never a heavy divider."
  code-surface:
    backgroundColor: "{colors.navy} body / {colors.navy-elev} title bar + status strip (tokens --rp-slab / --rp-slab-bar)"
    textColor: "{colors.cream} (JetBrains Mono, --rp-slab-ink); syntax by token: --rp-syn-key (keywords), --rp-syn-str (strings), --rp-syn-num (numbers), --rp-syn-com (comments), --rp-syn-add / --rp-syn-del (added and removed lines)"
    border: "1px solid {colors.cream}@14%"
    rounded: "{spacing.radius-md}"
    description: "The warm-navy code / terminal surface. The code itself is the theme's two forks of HyperFrames' blocks, `blocks/code-diff.html` and `blocks/terminal-run.html` (reelplanning's templates/reelplanning/theme/blocks/), coloured only by theme tokens so frame-lint's colour rule passes. The registry's own code-* blocks hard-code colours and fail it."
  spike-mark:
    glyph: "✱ (U+2731), always {colors.coral}"
    description: "The brand mark, optional. Fades + scales 0.92→1 on a single emphasis beat; never spins."
---

# Code editorial — Frame (video / frame layer)

## Overview

Code editorial at frame scale is a **warm-editorial brand book come to life** — the register of a literary
imprint or a research note. The thesis is three colors: **cream is the ground, ink is the voice,
coral is the voltage** — and a fourth (warm navy) only where code shows itself. Every surface is
**warm cream** (never pure white, never cool gray); content gathers on a **tile** surface half a
step darker — the demarcation is a half-step, never a hard contrast. Elevation is a **1px hairline**
ink border at low alpha plus, rarely, one soft warm shadow. There are no heavy drops, no glows, no
gradients on content.

Three editorial voices, each in its own face: **EB Garamond** carries every display moment — covers,
headlines, pull-quotes, big stat numerals — at large display sizes with gentle negative tracking;
its **italic** is the expressive register. **Inter** carries body, leads, card titles, buttons, and
UI chrome. **JetBrains Mono** carries the indexical layer — place labels, technical labels, the code
window, status strips. Switching a voice's face collapses the register: a sans headline or a serif
label reads as a different brand.

**Key characteristics at frame scale:**

- **Cream / ink / coral trinity** + a warm-navy code surface; cream is the default ground, ink the voice, coral the scarce voltage.
- **EB Garamond** (sentence case, negative-tracked) for all display; **Inter** body/chrome; **JetBrains Mono** index + code.
- **Hairline elevation** — a 1px low-alpha ink border + at most one soft warm shadow. No heavy drop, glow, or gradient.
- **Coral is rationed** — at most ONE coral moment per frame (CTA, inline link, OR full-bleed band); coral never sets a headline or a body run.
- **Density is free** — fill the frame as the content wants; a frame may stand on a single focal or carry a dense, layered composition.
- **The real thing leads where the brief picks it.** In a scene BRIEF.md's `- Real things:` names (a file, a table, a command's output, a screen), that thing is the focal, with plain words pinned to it; elsewhere a picture that explains it is fine. A quiet mono **place label** is optional; warm navy is reserved for the code/terminal surface.

## The Frame

### Frame Craft Bar

Eyeball tests gate every frame before any structural check:

- **Squint** — one EB Garamond display moment dominates at 3–6× its neighbor.
- **Trinity** — cream/tile ground, ink text, coral exactly **once**; warm navy only on the code surface; no cool gray / pure white / fourth hue.
- **Type** — EB Garamond sentence-case display (negative-tracked); Inter 400 body; JetBrains Mono place labels (optional) + code.

- **Primary:** 1920×1080 (16:9). Display authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `slide-pad` ~4.2cqw; the place label / mono chrome sit inside it.
- **Answering in the frame:** a question is answered on the frame itself. Mark each option card
  `data-option="a"`, the question's heading `data-question`, and on a call, stop, list or grouped beat each
  choice's card `data-call="a3"`. While a question waits, the review player draws on the frame, by those
  cards, in the frame's paper and voices: a dashed your-own-words slot beside or under the cards, each
  card's why under it once a quick check is answered (the right one ringed in coral), and small chips
  (Continue, Back, Walk me through it) under them; "More" on a card and "Full question" by the heading open
  the fuller words. So keep each card whole and clear of the next, with a line of room under the cards.
- **A detail's thing:** a scene with a `- detail:` marks the one thing its page explains
  `data-detail="<name>"` (the code block, a table row, a pinned word's label). The player lays a clear
  button over it with an "Open · <title>" tab on its top edge, the whole time it can be clicked, and it
  hides while a question is up (the cards answer; a click on the thing then does nothing). Keep it at least
  120 × 44 px, above the lowest eighth, and at rest at scale 1 for the scene's last 3 s: `frame-lint` fails
  each.
- **The lowest eighth:** every frame's root carries `data-band="bottom"` and keeps its lowest eighth
  (y ≥ 945, `12.5cqh`) empty: it is inside the caption band already, and nothing else goes there. The
  player's chips sit there while a question waits, and the captions step aside until it goes. A frame with
  no cards gets the answer bar there instead (a video whose frames lack the attribute, under the video).
- **A camera** moves inside a view clipped at y 900 (`overflow:hidden`, bottom ≤ 900), so nothing it carries
  reaches the lowest eighth; a question's heading and cards sit outside it, or it is at rest at scale 1
  when the scene ends. `frame-lint` fails either. How it moves: `motion-language.md`.

**The container law (load-bearing).** Every frame ground sets `container-type: size`; ALL
frame-relative units are `cqw`/`cqh` against it — never `vw`. Hairlines stay 1px; card radii stay
6/8/12px; the warm-paper reading must survive every ratio.

## Colors

Tokens identical to the source. Default ground `{colors.cream}`; content gathers on
`{colors.tile}` / `{colors.tile-strong}` (half-step warm steps, never a hard contrast).
**Headlines & body:** `{colors.ink}` on cream/tile; `{colors.cream}` on navy. **Coral**
(`{colors.coral}`) is the scarce voltage — one moment per frame (CTA, inline link, or full-bleed
band), never body text, never a card fill. **Warm navy** (`{colors.navy}` / `navy-soft` /
`navy-elev`) is the code / terminal / dark-card surface — a structural anchor, not a fourth brand
hue. **No cool grays, no pure white, no pure black.**

**Syntax colors (tokens, NOT brand hues).** Code on the slab is coloured by `--rp-syn-key` (keywords),
`--rp-syn-str` (strings, teal), `--rp-syn-num` (numbers, amber), `--rp-syn-com` (comments),
`--rp-syn-add` / `--rp-syn-del` (added and removed lines, with `--rp-syn-add-rgb` / `--rp-syn-del-rgb` for
their tints). The slab is dark in both themes, so these do not change with it; each clears 4.5:1 on it.
They track the code surface, not the brand trinity: keep them out of the brand palette, and never write
their hex in a frame (frame-lint fails a hex literal).

## Typography

Two ramps. The **reading/chrome ramp** (Inter `body` 1.5cqw / `lead` 2.08cqw weight 400; JetBrains
Mono `place-label`/`mono-label` in px) carries copy + chrome; the **display ramp** (EB Garamond `headline` 4.6cqw
→ `display-cover` 9.9cqw, weight 400, negative-tracked) carries every headline + stat.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw**; mono px labels are chrome only.
- **Fit-to-measure:** size the headline to its length. Cap the block at **≤ 78cqw**; ≤3 words → `display-cover`; 4–6 → `display`; 7+ → `headline`. Reserve the 7.3–9.9cqw tier for cover / statement / stat.
- **EB Garamond display is sentence case** (NOT title case, NOT uppercase), weight 400, negative-tracked (−0.012..−0.028em); reach for **italic** when the line is a stance or a definition. **Inter body** sentence case weight 400. **JetBrains Mono** place labels as the thing writes its name (0.06em, ink@62%), code and exact values. No uppercase serif, no sans headline, no serif label.
- **Under a camera the floor is on screen:** a label inside a camera is measured at the camera's smallest scale (`frame-lint`), so a 20 px label in a camera that never goes below 1.4 is fine, and a 30 px one in a camera pulled back to 0.6 is not.

## Depth & Surface

Hairline elevation:

- **1px hairline** ink border at ~12% alpha is the primary lift (cream@14% on navy).
- **One soft warm shadow** (`0 1px 3px ink@8%, 0 4px 16px ink@4%`) — used rarely, never heavy.
- **Half-step surface** — a `{colors.tile}` block on cream reads elevated by the warm step, not by a cast shadow.

**Ceiling:** no heavy drop shadow, no glow, no gradient on content, no tilt. The system has no light
to emit; it reads by warmth and hairline.

## Shapes

- **6px** small chrome, **8px** cards / code surface, **12px** large cards / quote frames, **9999px** true pills only. No square corners, no heavy rounding; the editorial register is gently rounded, never hard.

## Components

- **card-hairline** — the editorial content card (hairline + one soft shadow). **section-rule** — the only separator (1px, coral may draw on).
- **place-label** — optional, a quiet mono "where": the file, the page, the chapter. **coral-callout** — the one voltage moment (CTA / inline link / full-bleed band).
- **artifact** — the real thing in a `data-artifact` container; **pinned-word** — a `data-gloss` label on the part of it a word names; **detail-mark** — `data-detail` on the thing a scene's detail page explains (the player's button goes over it).
- **number-lockup** — EB Garamond figure + mono unit (the PR `+N / −M`, `200K`, file counts). **pull-quote** — EB Garamond italic + cite (a commit message / reviewer line).
- **code-surface** — the warm-navy code / terminal surface; the code itself comes from the theme's **`blocks/code-diff.html`** and **`blocks/terminal-run.html`** (forks of HyperFrames' blocks, tokens only).
- **spike-mark** — the ✱ brand glyph, always coral, optional.

## Frame Treatments

> Recipe: ground · container · composes · focal · chrome · accent · Fixed/Free · density.
> One coral moment per frame. A place label only when it helps. Where the brief picks a scene to show the real thing, use treatment 7.

### 1 · Cover (identity · move: oversized EB Garamond · cream)

**Ground** `{colors.cream}`, `slide-pad`. **Composes** display-cover, lead, mono-label index, an optional place label. **Focal** a 2–3 line EB Garamond `display-cover` (sentence case, ink). **Chrome** mono index strip (repo · branch). **Accent** one coral mark (the ✱, or one word). **Fixed** EB Garamond 400 sentence case, hairline, cream ground. **Free** title, the mono index, layout + how full the frame runs. **Density** free.

### 2 · Statement (statement · move: single EB Garamond line · cream or navy)

**Ground** `{colors.cream}` (or `{colors.navy}` for gravity). **Composes** display, optional lead, optional place label. **Focal** one 2-line EB Garamond `display` carrying the change in a sentence — reach for **italic** if it's a stance. **Chrome** none, or the place label. **Accent** none — the serif carries it (or one coral word). **Fixed** sentence-case serif. **Free** the line, ground, layout + density. **Density** free.

### 3 · Code Surface (code · move: warm-navy code window · the PR-critical frame)

**Ground** `{colors.cream}` framing a `{colors.navy}` **code-surface** (8px, cream@14% hairline, `navy-elev` title bar + filename in mono). **Composes** mono-label filename, the theme's **`blocks/code-diff.html`** or **`blocks/terminal-run.html`** in a `data-artifact` container, words pinned on its tokens (`data-gloss`), optional `section-rule`. **Focal** the code panel — the diff / before→after / typed-on snippet. **Chrome** mono filename + status strip. **Accent** the `--rp-syn-*` tokens inside the panel; one coral mark (a pinned word, an underline). **Fixed** warm-navy surface, mono code, hairline, tokens only. **Free** which block, the code (from the diff), how large the panel runs, a camera over it (clipped at 900). **Density** dense.

### 4 · Number / Impact (data · move: oversized figure · cream)

**Ground** `{colors.cream}`, `slide-pad`. **Composes** number-lockup, lead/caption, optional `section-rule`, optional place label. **Focal** a EB Garamond `number-hero` figure with a mono unit over a 1px rule — the PR impact (`+1,204 / −318`, `17 files`, `2.1× faster`). **Chrome** mono tag. **Accent** the figure in ink; at most one coral unit. **Fixed** serif figure + mono unit, hairline rule. **Free** the figures (from the script), tag, layout + density. **Density** free.

### 5 · Pull-quote (quote · move: EB Garamond italic · cream)

**Ground** `{colors.cream}`. **Composes** pull-quote, tag-upper cite, optional place label. **Focal** a EB Garamond **italic** `quote-pull` — a commit message, a reviewer line, or the thesis — with a small Inter uppercase cite (author · role) beneath. **Chrome** none, or the place label. **Accent** none, or one coral mark. **Fixed** EB Garamond italic quote + uppercase cite. **Free** quote, attribution, layout + density. **Density** free.

### 6 · Closing / CTA (closer · move: coral voltage · cream or navy)

**Ground** `{colors.cream}` (or `{colors.navy}`). **Composes** display sign-off, coral-callout, optional contributor row (`assets/<login>.png` avatars + mono names). **Focal** a short EB Garamond sign-off with the one **coral-callout** (the CTA or full-bleed band) and, for a "shipped-by" close, a row of hairline-ringed avatar chips. **Chrome** mono index. **Accent** the single coral voltage. **Fixed** one coral moment, hairline avatar rings, sentence-case serif. **Free** sign-off, who ships, layout + density. **Density** free.

### 7 · The real thing (artifact · move: its own verb · cream, slab or the thing's own ground)

**Ground** whatever the thing is on: the paper for a document or table, the slab for code and a terminal, a screenshot's own pixels. **Composes** the thing in a `data-artifact` container (the real table with its labels, the real diff, the real command typed and its output printed, the real screen before and after with a wipe between), words pinned on it (`data-gloss`), an optional place label naming it. **Focal** the part of the thing the sentence is about, found by a camera (clipped at 900) or an underline drawn on the word. **Chrome** the place label. **Accent** one coral pinned word or mark. **Fixed** the thing's own words and numbers (never re-typed into a card), plain words pinned where the video defines them. **Free** how much of it shows, the camera's poses, the reveal verb (drawn, typed, wiped, counted, struck). **Density** as dense as the thing.

## Composition Rules

### Do

- Stand every frame on the **warm cream floor**; gather content on a **half-step tile** surface.
- Set all display in **EB Garamond, sentence case**, negative-tracked; **Inter 400** body; **JetBrains Mono** place labels + code.
- Ration **coral to one moment per frame** — CTA, inline link, OR full-bleed band.
- Elevate with a **1px hairline** + at most one soft warm shadow; reserve **warm navy** for the code/terminal surface.
- Lead with **one clear focal**: the real thing where the brief picks it, a picture or card that explains it elsewhere. Fill the frame as the content wants.
- Pin a defined word **on** what it names (`data-gloss`), never on a card beside it.
- Pair a EB Garamond figure with a **mono unit** for every stat; render code via the theme's **code-diff / terminal-run blocks** on the navy surface.

### Don't

- No pure white, no cool gray, no pure black; no fourth brand hue (navy is structural, syntax colors are decoration).
- No heavy drop shadow, glow, gradient on content, or tilt — hairline elevation only.
- No uppercase or title-case EB Garamond display; no sans headline; no serif label; no serif-set numeric unit.
- No two coral moments in one frame; coral never sets a headline or body run.
- Don't blow a headline past the measure — step the ramp down.

## Aspect-Ratio Behavior

| Treatment     | 16:9                    | 9:16                        | 1:1                    |
| ------------- | ----------------------- | --------------------------- | ---------------------- |
| Cover         | display left, index top | display top, index below    | display, index corner  |
| Statement     | line left/centered      | line stacked                | centered               |
| Code Surface  | panel framed in cream   | panel taller, fewer lines   | panel centered, square |
| Number/Impact | figure left             | figure centered, taller     | centered               |
| Pull-quote    | quote left              | quote stacked               | centered               |
| Closing/CTA   | sign-off + avatar row   | sign-off top, avatars below | centered, avatars wrap |

`slide-pad` holds on the short edge; re-step display above the 1.4cqw floor. The code surface keeps
its hairline + mono chrome on every ratio; the avatar row wraps rather than shrinks below legibility.

## Approved Real Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder. Contributor avatars come from the project's `assets/<login>.png` (staged from the PR's
people graph); the ✱ spike, hairlines, and the code surface are CSS-only and need no external imagery.

## Numerals & Claims (hard rule)

Never invent figures, stats, diffs, or counts at frame scale. Render slots as `— figure —`,
`{metric}`, `+N / −M`. Number-lockups, code panels, and impact stats carry placeholders until the
script (from the PR ingest) supplies real values. Branch names, file counts, and `+/−` totals trace
to the diff; commit/issue numbers are chrome.

## Pre-Render Self-Audit

- **Squint** — one EB Garamond display moment dominates.
- **Trinity** — cream floor + tile step + ink voice; coral appears exactly once; warm navy only on the code surface; no cool gray / pure white / fourth hue.
- **Type** — EB Garamond sentence-case display (negative-tracked); Inter 400 body; JetBrains Mono place labels (optional) + code; ≥1.4cqw floor, on screen under a camera.
- **Depth** — 1px hairline + at most one soft warm shadow; no heavy drop / glow / gradient / tilt; 6/8/12px radii.
- **Code** — code rendered by the theme's code-diff / terminal-run block on the warm-navy surface; syntax by `--rp-syn-*` tokens; figures paired with a mono unit.
- **The real thing** — in a scene the brief's `- Real things:` names, that thing is on screen in a `data-artifact`, with its words pinned; a change across many files is its map, then one or two places, never every file.
- **Fabrication** — every numeral / diff traces to the PR, else placeholder.

## Known Gaps

- **Motion is `motion-language.md`**, beside this file: a camera over one clipped view, a reveal by the thing's own verb, transitions that mean something (cut, push, crossfade, zoom into code). frame.md specifies composition; `hyperframes-animation` has the recipes.
- **EB Garamond + Inter + JetBrains Mono ship as licensed local WOFF2 assets with this preset.** `build-frame.mjs` stages weights 400 + 700 into `assets/fonts/` and appends the exact `@font-face` block to the generated `frame.md`, so Studio, snapshots, and renders resolve them offline without a first-run Google Fonts fetch. Author display at **weight 400** (700 reads as a heavy bold, off-register), and treat italic as the browser-synthesized slant (acceptable for the pull-quote register; add a real italic face only if a project leans hard on it). EB Garamond is a warm old-style serif (low contrast, humanist); if it ever fails, fall to Georgia or another old-style serif — never to a sans. CJK: Noto Serif SC (display) / Noto Sans SC (body) / Noto Sans Mono CJK (code); the sentence-case warmth carries when the serif drops.
- **Syntax colors are the `--rp-syn-*` tokens** (tokens.html), declared in §Colors — they are NOT in the remixable `colors:` block, so a brand remix never repaints them.
- **The code itself is the theme's forks of HyperFrames' code-diff and code-terminal-run** (`blocks/`), coloured by tokens; the registry's own blocks hard-code colours and fail frame-lint.
- **9:16 / 1:1 are guidance**; verify the legibility floor and that the cream/tile warmth + one-coral discipline hold per ratio.
