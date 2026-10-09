# Walkthrough: Better visuals: show the real thing, and a page that reads well

**Status:** implemented on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (revised after
`reviews/plan-20260926T170650Z.md` and `reviews/plan-20260926T185319Z.md`) · **Started from:** `b421610` ·
**Question 1:** the brief picks which scenes show the real thing (D-166) · **Question 2:** today's look,
fixes only (D-167) · **Accent:** a darker coral (D-142) · **Also:** zoom into the video, an answered
check's whys that covered the next card, and tool names in code markup (the owner's asks, outside the
plan's steps)

## What was done, per step

Steps 1 and 2 went in first without question 1 (`30ec428`), step 3's groundwork without question 2
(`312d989`); the second review decided both (D-166, D-167), step 1 took D-166 and the owner's note on
changes across many files (`a28dbe4`), and step 3 as built was the look chosen. Then the system video was
rebuilt once (`6d83613`, `eebb945`).

### Step 1 — A scene shows the real thing, with plain words pinned to it ✅

- **The real thing first** is a rule with examples in `skills/plan-to-video/references/style-guide.md` §5:
  a table change shows the table, a code change the diff, a command its run, a screen change the screen
  before and after; a card only for what has no surface (a rule, a count). The real thing sits in a
  `data-artifact` box and a pinned word is `data-gloss` (A1); `scripts/frame-lint.mjs` notes a pinned word
  outside one.
- **The brief picks** (D-166, `a28dbe4`): a video's `BRIEF.md` names its real-thing scenes on one line
  under Customizations, `- Real things: scene 3 (the map), scene 4 (the check's lines); the rest explain with
  pictures` (`templates/video/BRIEF.md`, `skills/plan-to-video/SKILL.md` Build a video step 1, style guide
  §5, the theme's `frame.md` in both copies, A26). Nothing checks it and nothing warns about the scenes it
  leaves out; `build` repeats the line as a ✓ when it is there (`scripts/lib/variety.mjs`, A25). The
  per-scene storyboard field and the warning for a scene of boxes that the first worker held for question 1
  were never built: D-166 chose neither.
- **Never every file** (the owner's note, `a28dbe4`): style guide §5 "A change across many files" says a map
  first (the files, one plain line each: the real `git diff --stat` list in plain words), then the one or
  two places that carry the idea as the real thing with plain words pinned on, and a picture where the real
  thing is hard to read, with a ten-file example (A27). This plan's own video shows it on the terms check's
  nine-file commit (`1d9818c`, scenes 4 to 6).
- **The heading and the ticks are optional** (`templates/reelplanning/theme/frame.md`, style guide §2 and
  §5); this repo's `.reelplanning/theme/frame.md` is the template's copy again (A4).
- **Code-diff and terminal-run blocks** in the theme's colours: `templates/reelplanning/theme/blocks/`, with
  syntax tokens in `tokens.html` (A2).
- **Composition varies:** each video's `BRIEF.md` names its medium, layouts and main transition, with an
  optional `- layout:` storyboard line (`templates/video/BRIEF.md`, `skills/plan-to-video/SKILL.md`); `build`
  warns when one of the three lines is missing (A3).

Step 1 has seven calls (A1 to A4, A25 to A27). Its biggest open choice was asked as question 1 and answered
(D-166), which `reel audit` counts (`16af905`, D-110); A25 to A27 were made after that answer.

### Step 2 — What each move means, written down; checks that keep the answer safe ✅

- `templates/reelplanning/theme/motion-language.md` (and `.reelplanning/theme/`), pointed to by `frame.md`:
  the camera over one scene in a view clipped at y 900, reveal verbs, transitions with meaning (a cut for a
  chapter or a quick check, a push for the next scene, a crossfade for the same place later, a zoom into
  code as a cut plus a pull-back).
- `scripts/check-terms.mjs` reads a real thing's own words as glossed in place (A5) and splits text on
  block elements only; `scripts/scale-only-zoom.mjs` (run by `scripts/finish-project.sh`) takes the blur
  out of zoom-through; `scripts/motion-static.mjs` reads helper and camera moves (`scripts/lib/timeline.mjs`);
  `scripts/stage-presence.mjs` no longer rewards still ticks (A6); `scripts/lib/variety.mjs` warns past 70%
  sameness (A7); the mono floor counts screen pixels under a camera.
- `scripts/frame-lint.mjs` fails a camera outside a view clipped at 900 px and a question or card that is
  moving or scaled when its scene ends (A8). No existing video trips either.

### Step 3 — The review page: today's look, made readable, with its fonts ✅

Question 2 chose today's look with its fixes (D-167), which is the groundwork `312d989` had built so that
any look could follow; nothing more was needed for the look itself.

- **Fonts shipped:** today's three faces in `packages/player/fonts/` (A21), listed once in
  `packages/player/fonts/faces.json` and declared in the page's `<head>` by `declareFonts` in
  `packages/player/reelplanning-player.js` (A22); `scripts/bundle-player.mjs` copies, inlines and preloads
  them; `package.json` ships the folder.
- **One setting for the letters:** `--sans`, `--serif`, `--mono` defined once; 48 rules read `var(--sans)`,
  and no family is named in `STYLE`.
- **Text in three solid inks** (`--ink`, `--ink-2`, `--ink-3`), a type scale (`--fs-xs` to `--fs-h2`),
  keycaps, a readable Terms panel (`reelplanning-player.js`, `packages/player/index.html`).
- **The darker coral** (D-142) in the videos (`templates/reelplanning/theme/tokens.html`, A9, A10) and on the
  page (`--accent`, `--accent-text`), meaning only "yours, waiting on you" (A24). The right answer to a quick
  check is marked in ink with a tick, a wrong pick with a cross and a dashed ring (A23): this changes
  D-145's "the right answer in coral", as step 3 says.
- **Reading desk and Tally leave the review page:** they were never in the repo's player; they lived only in
  the sample site published for the review (the Look menu), which is not rebuilt. The player has one look.
- **The video's size and place** are unchanged at Fit (`packages/player/test/size.spec.mjs`,
  `answer-on-frame.spec.mjs` "keeps its size").
- **The detail pages, after the review** (`04b9826`, A10 changed): `templates/details/*.html` take the page's
  look, one theme script and one token block in all six: the darker coral in both themes and at text size,
  the three solid inks (`--ink-72` and `--ink-55` are now their aliases), coral only for the call and the part a
  comment is on (explore's current step is a 3 px ink stroke, try's lost upload hatched). The page's faces:
  a detail's frame is sandboxed, so once the page says "ready" the player posts it `faces.json`'s roles and
  each face's bytes and the page adds them (`detailFaces`); opened on its own it keeps its fallbacks.
  `reelplanning detail restyle <video-dir>` brings pages built from an older template up to it without a
  video rebuild.

### Step 4 — Videos rebuilt as they are revised; the system video once ✅

- **The system video, once, whole** (`6d83613`): seven chapters, 35 scenes, 7:32 (was five, 37, 7:58), in
  the new style. Its `.reelplanning/system-video/BRIEF.md` has the four lines, `- Real things:` naming the
  review page's screens (shot in light and dark), the deep-dives plan, the decision log, the fewer-stops
  table, code-check findings and real runs of `reel audit`, `reel stops`, spec-diff, `reel memory --you`
  and `git log`; pictures for the map of twelve parts, the hand-off, the sandbox and the rules. 19 of its
  35 frames carry a `data-artifact`. Its coverage came up to today (the fifth-choice stop, what stops a
  walkthrough, memory across repos). `eebb945` put the `reel` CLI's name in code markup on five of its
  frames (names.md). `reel status`: "the system video is current".
- **No mass rebuild.** This plan's own video was the first built the new way (`768fd5c`, rebuilt after the
  second review in `1d9818c`, 4:13); this walkthrough's video is the second. No other plan's video was
  rebuilt; two had only their watch-first pointers moved to the rebuilt system video's chapter 5, "The
  build" (`693f5dc`: `2026-09-25-videos-you-can-follow/walkthrough-video` and this plan's `video`), and five
  had their captions redone for the names (`7fe843b`, below).

### Also: the owner's asks during this plan (outside its steps) ✅

Three asks came in while the plan was built. They are not plan steps, so their calls are logged under their
own heading and do not count toward a step's five; each ask that reached its fifth call asked it
(`questions.md` of the worker, answered below).

- **Zoom into the video** ("can we zoom into video as well? rn it just allows fit or smaller in html";
  `84e255c`, `981f364`). The Size drag, the corner and `-`/`=` reach 200%. Past Fit the stage keeps Fit's
  box and the picture is zoomed inside it, in a view that scrolls; the drawing, the cards' buttons, a mark's
  words and the answer on the frame move with the picture, the band and the controls stay put (A30); a
  question asked while zoomed in scrolls into view (A31); the wheel and scroll bars move around (A32); one
  control for all of it (A33). The question left at the fifth call, how big a step `-`/`=` take past Fit, was
  answered by the owner: 25% (125, 150, 175, 200), 5% up to Fit (`981f364`, A33 changed in place). A phone
  stays Fit. In `packages/player/reelplanning-player.js` (`picRect`, `homeLayer`, `placeLayer`,
  `revealQuestion`, `wireSizeGrip`, `nudgeSize`, `syncSize`); `packages/player/test/size.spec.mjs` §10.
- **An answered check's whys covered the next card** (the owner's screenshot of answer-on-the-video's
  step-1 check, cards in a column; `01e4f62`). `layoutFrame` now passes over a layout whose whys or note
  meet another card or why (A34); where nothing fits by the cards, each verdict rides on its card's tag with
  "Read why in full" (A35). Where nothing meets a card, the layout is as before.
  `packages/player/test/answer-on-frame.spec.mjs` §16 fails 4 checks on the old player.
- **Tool names in code markup** (`1f9e726`, `7fe843b`, `eebb945`). `.reelplanning/names.md` (template
  `templates/reelplanning/names.md`) lists each name and how it is shown (A40, A41); `scripts/lib/names.mjs`
  reads it; `scripts/captions-sentences.mjs` puts a tool's name and its command's next words in a
  `<code class="cap-code">` chip in the captions (A42); `scripts/check-terms.mjs` warns (△) on a tool's name
  on a frame outside code markup (A43); `scripts/inject-theme.mjs --captions-only` repoints the captions
  layer after the caption steps are re-run alone. The captions of the review page's five videos were redone
  with the caption steps only (`7fe843b`, so plan-diff's change marks stay). The question left at the fifth
  call, whether plain names (GitHub, HyperFrames) should stand out too, stands as built: case only, the chip
  is the only mark (A41). The skill and the style guide say so (`skills/plan-to-video/SKILL.md`, style guide).

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | The pinned word is marked `data-gloss="<the thing's own word>"`, its text the plain word (`<em data-gloss="misses">late fixes</em>` on the `misses` token); frame-lint notes one outside any `data-artifact` [visible] | a `data-pin` or `data-term` attribute, or the attribute holding the plain word | the attribute names what is glossed (the file's word), the text is what the viewer reads, which check-terms already holds to the rules | `skills/plan-to-video/references/style-guide.md` §5, `templates/reelplanning/theme/frame.md` (pinned-word), `scripts/frame-lint.mjs` |
| A2 | 1 | The code-diff and terminal-run forks ship as paste-in snippets (`templates/reelplanning/theme/blocks/`, FID prefix like the stage snippets: static diff lines struck and wiped, a typed command and printed rows), with syntax tokens `--rp-syn-key/-str/-num/-com/-add/-del` that are the same in both themes [close] | porting the registry blocks' JS renderers (shiki tokens, magic-move) with their colours swapped | a frame worker edits markup, not a renderer; the registry engine hard-codes colours throughout its 800 lines; the slab is dark in both themes, so its syntax colours need not move | `templates/reelplanning/theme/blocks/`, `templates/reelplanning/theme/tokens.html`, `scripts/test/visuals.spec.mjs` (both pass frame-lint) |
| A3 | 1 | BRIEF.md's three lines are `- Medium:`, `- Layouts:`, `- Main transition:` under Customizations, a starting point at `templates/video/BRIEF.md`, and `build` warns (△) when one is missing [visible] | skill text only | a line nothing reads drifts; a warning never stops a build, so old videos only get a △ | `scripts/lib/variety.mjs`, `skills/plan-to-video/SKILL.md` Build a video step 1 |
| A4 | 1 | `.reelplanning/theme/frame.md` is now the template's copy (it lacked the answer-in-the-frame section), with `motion-language.md` beside it; `reel init` copies both [close] | editing this repo's older copy in place | one frame template, so this repo's own videos are built with the rules this plan writes | `.reelplanning/theme/`, `scripts/reel.mjs` (init) |
| A25 | 1 | `variety` reads BRIEF.md's `- Real things:` as an optional fourth line: when there, `build` prints it as a ✓ line ("BRIEF.md picks the real things: …"); when not, nothing; build warnings stay the three existing lines [visible] | not reading it at all, or warning when it is missing | D-166 says nothing warns; a line nothing reads drifts (A3), and repeating it in the build output lets whoever builds see the brief's pick next to the frames | `scripts/lib/variety.mjs`, `scripts/test/visuals.spec.mjs` (last variety check) |
| A26 | 1 | Softened the same wording in the theme's `frame.md` (both copies: `templates/reelplanning/theme/` and `.reelplanning/theme/`, kept identical per A4): "the real thing leads where the brief picks it", treatment 7 "where the brief picks a scene", the self-audit line names the `- Real things:` scenes and the many-files map [close] | editing only the style guide, SKILL.md and the BRIEF template | frame workers read `frame.md`, not the style guide; left alone it would still tell every frame about a file to lead with the file | `templates/reelplanning/theme/frame.md` (Principles, Frame Treatments note, Do, Self-Audit) |
| A27 | 1 | The many-files example is a made-up ten-file change drawn from this repo's own answer-on-the-video work (map rows `reelplanning-player.js` · finds the cards and answers on them, `frame-lint.mjs` · stops a card that moves, `BRIEF.md` · says where the cards go; then the player's diff at one place, then the screen before and after) [close] | an abstract example ("files a–j") | a real-looking case teaches the rule the way §5 asks scenes to; it is illustrative, not a record of that plan's file list | `skills/plan-to-video/references/style-guide.md` §5 "A change across many files" |
| A5 | 2 | check-terms: a `data-artifact`'s own words never count as a word used before its definition, an id in them is a △ even on a strict storyboard, and a `data-gloss` word on it is the video's own, held to the rules [close] | a warning for each early word in an artifact too | "glossed in place (a warning at most)"; warning on the thing's own words is what bent the sample (7 warnings on real code and a failed build on `D-110` in real output) | `scripts/check-terms.mjs`, `scripts/test/terms.spec.mjs` |
| A6 | 2 | stage-presence: still step ticks on most scenes are a △ (never ✗, never "the rail earns its place"), and a scene with only the ticks counts as "ticks only", not "rail only" [close] | failing still ticks like a still full rail | the ticks are optional now, and failing them would fail every existing video; saying it plainly is enough to stop it being the cheapest pass | `scripts/stage-presence.mjs`, `scripts/test/stage-presence.spec.mjs` |
| A7 | 2 | The variety warning reads a scene's layout from a new optional `- layout:` storyboard line, else a `- blueprint:` other than `compose`; transitions by type (push-slide LEFT and UP are one); under 5 scenes is not judged; `build` prints it after the length [visible, close] | reading `- blueprint:` alone | every storyboard says `blueprint: compose` whatever it draws (the better-visuals video too), so blueprint alone warned on every video, varied or not | `scripts/lib/variety.mjs`, `scripts/test/visuals.spec.mjs` |
| A8 | 2 | For frame-lint a camera is an element the timeline moves that is named one (`data-camera`, or a class ending `-cam`, `-camera`, `-world`) or that zooms past scale 1 where its box could reach y 900; the mono floor under a camera uses its smallest scale; the card rule checks every moving ancestor of a `data-question`/`data-option` [close] | named cameras only; the floor at the camera's rest pose | an unnamed zoom pushes content into the lowest eighth as surely as a named one, while a pulse on a chip up top cannot; a label can be on screen at any pose, so its smallest size is the one to hold | `scripts/frame-lint.mjs`, `scripts/lib/timeline.mjs`, `scripts/lib/frame-html.mjs`, `scripts/test/visuals.spec.mjs` |
| A9 | 3 | The dark theme's coral is `#D2693F` (same hue, lighter: 5.2:1 on the dark paper, 4.5 and 4.0 on its tiles), light stays `#B8552E` (4.6 on paper, 4.0 and 3.8 on the tiles) [visible, close] | `#B8552E` in both themes | it clears 3:1 on the dark grounds too, but only just (3.0 on the darker dark tile) | `templates/reelplanning/theme/tokens.html` (comment has the ratios) |
| A10 | 3 | Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now [close] (changed after review: the detail pages' templates take today's look too, `#B8552E` / `#D2693F` and `#9C4524` / `#E3A184` at text size, the three solid inks, coral only for the call and the part a comment is on, and in the player's panel the review page's faces, which the player posts to the page; `04b9826`) | recolouring the detail templates now | the detail pages follow the review page's look, which waited on question 2 when this was made (decided since, D-167: see Not done) | `templates/reelplanning/theme/tokens.html`, `templates/details/`, `detailFaces` in `packages/player/reelplanning-player.js`, `scripts/detail.mjs` (restyle) |
| A21 | 3 | The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/` [hard-to-undo] | an npm devDependency (@fontsource-variable/*), which an `npx reelplanning` install does not carry, or the videos' static 400/700 files, which have no 500/600 for the chrome's weights; italics (+143 KB) left out | the bundle must work from an installed package offline, and the chrome sets 500 and 600; italics only show in glossary `<i>`, which the browser slants | `packages/player/fonts/`, `faces.json` |
| A22 | 3 | The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there [close] | the bundle writing the `@font-face` rules itself (a second builder, and a dev page or any other host of the player without fonts), or a hand-written fonts.css beside a list | one list and one builder, and every page that hosts the player gets the faces; swapping to Tally or Reading desk is new files plus this JSON | `packages/player/fonts/faces.json`, `declareFonts` in `reelplanning-player.js`, `scripts/bundle-player.mjs` |
| A23 | 3 | The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged) [visible] | staying coral (D-145), which D-142 now keeps for what is yours, or Reading desk's green (a new hue, one look's choice) | ink is the neutral both looks can start from (Tally keeps it; Reading desk sets `--right` to its green in one line), and the tick, the cross and the dashed ring say it without colour | `.hit[data-right]`, `.fwhy[data-right]` in `reelplanning-player.js`; answer-on-frame.spec "marked by more than colour" |
| A24 | 3 | Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker [visible] | a lighter pass that only darkens the colour | D-142 and the plan make coral mean one thing, "yours, waiting on you"; each of these was coral for "current" or "state" | the accent rules in `STYLE`; `LIBRARY_UI` in `scripts/bundle-player.mjs` |

Step 1 has seven calls and step 3 six; both steps' biggest choices were asked (questions 1 and 2) and are
answered in the decision log (D-166, D-167), so `reel audit` passes them (D-110). Step 2 has four.

The owner's asks, outside the plan's steps (their calls do not count toward a step's five; each ask that
reached its fifth call asked it, as the worker's two questions above):

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A30 | zoom | Past Fit the stage keeps Fit's box and the picture is zoomed inside it, in a view that scrolls (`.zport` > `.zin`, `--zoom-k`): the player, the drawing canvas, the cards' buttons, a mark's words and, while zoomed, the answer-on-frame layer are inside the picture and move with it; the band, the sheets, the chips, the poster and the corner stay on the view; a card's "More" and a word's meaning close when the view scrolls [visible] | growing the stage itself inside a scrolling box (the band, chips and corner would scroll away with it), or a CSS transform on the stage (text in the band would grow and every rect-based placement would mix scaled and unscaled boxes) | nothing under the video moves; everything placed from the picture's box (boxesOf, More, a mark's words) now reads `picRect()`, so it follows the zoom with one change each | `packages/player/reelplanning-player.js` (Size CSS, `picRect`, `homeLayer`, `placeLayer`), `packages/player/test/size.spec.mjs` §10 |
| A31 | zoom | A question asked while zoomed in keeps the zoom; the view scrolls once to it: its heading and cards where both fit in the view, else the cards (centred where they fit, else their top-left corner; clear of the band's eighth where the band is in the frame) [visible] | resetting to Fit while a question is up | the reviewer chose the zoom to read; the cards' buttons line up at any size (checked at 200%), and the heading's words are one click away in "Full question" | `revealQuestion` in `packages/player/reelplanning-player.js`, `packages/player/test/size.spec.mjs` §10 "asked while zoomed in" |
| A32 | zoom | Moving around: the view's own (thin) scroll bars, the wheel and a trackpad; the wheel over what sits on the view (the poster's play button, the chips, the corner) is passed to the view; no drag-to-pan; the arrow keys stay the player's (seek) [close] | drag-to-pan, or arrow keys that pan | a drag already draws (Mark), answers (a card) and resizes (the corner); the wheel is what every zoomed viewer on a laptop offers | the `wheel` listener after `syncSize()` in `packages/player/reelplanning-player.js`, `packages/player/test/size.spec.mjs` §10 (wheel, →) |
| A33 | zoom | The corner's drag scales the size by the corner's move as a share of the stage's box from where it started (the same as before at Fit and under, where the corner stays under the pointer; dragged out from Fit it zooms in); `=`/`-` step 5% up to Fit and 25% past it, to 200% and 40% (**changed after the owner's answer** to the question left at the fifth call: 5% everywhere at first; `981f364`); the slider has a tick at Fit; a change of zoom keeps the middle of the view in the middle; a phone ignores a stored zoom [close] | a separate zoom control | one control, one set of keys, as the owner's words ("zoom into video as well") put it; the tick lets a drag land back on Fit; twenty presses from Fit to 200% were too many | `wireSizeGrip`, `nudgeSize`, `syncSize` in `packages/player/reelplanning-player.js`; `packages/player/test/size.spec.mjs` §1, §3, §4, §10 |
| A34 | overlap | Cause: `layoutFrame` laid each why (and the note on your pick) under its card and only checked that it stayed above the frame's foot, never whether it met the card under it, so with cards stacked in a column the whys sat over the next card's words. Now a try whose whys or note meet another card or another why is passed over, like one that runs past the foot (the old last try, verdicts only under the cards whatever the room, included); then come "longin" (verdicts only, in each card's corner under its words) and last "none". Where nothing meets a card the tries and their order are as before, so cards in a row lay out as they did (the row still folds behind "…" at 1024 × 660) [close] | shrinking the whys to fit the gap between cards, or covering each card whole with its why | a why that covers a card hides what it is the why of; the tries already had the order "under, inside, verdict only", this makes each of them honest about the cards | `layoutFrame` (`meets`, `clash`, `tries`) in `packages/player/reelplanning-player.js`; `packages/player/test/answer-on-frame.spec.mjs` §16 (fails 4 checks on the old player) |
| A35 | overlap | When no why fits anywhere by the cards ("none"), each card's verdict ("Your answer · not quite, it is B", "The answer") rides on its card's tag on the top edge (the ink tag the cards already had, ✕ or ✓ before it), and "Read why in full" opens the words [visible] | hiding the verdicts and leaving the rings alone to say it | at 1440 × 900 this plan's own k1–k4 land here; without the words a dashed ring does not say "yours, and wrong" | `syncHits` (`_whyTags`), the `.hits[data-whytags]` CSS in `packages/player/reelplanning-player.js`; `packages/player/test/answer-on-frame.spec.mjs` §16 |
| A40 | captions | The names list is its own file, `.reelplanning/names.md` (template `templates/reelplanning/names.md`; `reel init` copies it; a repo with none uses the package's), read by `scripts/lib/names.mjs` [hard-to-undo] | a "Names" section in `glossary.md` | a `glossary.md` edit marks the system video behind (`reel status` compares dates), and frame-lint, system-review and spec-diff each parse every table row in it | `.reelplanning/names.md`; `namesFor` in `scripts/lib/names.mjs` |
| A41 | captions | Code (chip, own spelling): `reelplanning`, `reel`, `hyperframes`, `npm`, `npx`, `git`, `claude` (lowercase: the command), `codex`, `opencode`, `ffmpeg`. Plain, with their case: HyperFrames (the framework), GitHub, Claude, Claude Code, Kokoro, Whisper, GSAP, CLI, JSON, JSONL, HTML, CSS, TTS, API, URL, macOS; a plain name has its case fixed and is not highlighted (the question left at the fifth call; stands as built) [visible, close] | Whisper as code; `reel` left out (it is also an English word); plain names in bold, in full ink | you named command names as code. Whisper is the model's own name, and its tool, whisper-cli, is a path-like word that is left alone anyway. An exact spelling picks its row first, so HyperFrames stays the framework and `hyperframes` stays the command; one kind of mark in a caption line reads as "this is the tool" | `templates/reelplanning/names.md`, `.reelplanning/names.md` |
| A42 | captions | The caption markup is `<code class="cap-code">` inside the word's own span: JetBrains Mono at 0.8em on a `--rp-tile-2` chip, its colour following the karaoke state. A command's next words join the same chip (`reel status`, `npx reelplanning build`), with punctuation outside it [visible] | the name alone as a chip (`reel` status); a full-ink chip ahead of the spoken word | it reads as one command, the way the frames' terminal shows it. Following the karaoke keeps the viewer's place in the line | `scripts/captions-sentences.mjs`; `.reelplanning/system-video/compositions/captions.html` (the system video at 11.3s, 268.8s and 438s) |
| A43 | captions | The on-screen check lives in check-terms as a △ warning that never fails. It flags a code name outside `<code>`/`<pre>`/`<kbd>`/`<samp>` or a mono face, and a listed name spelled another way. Text inside a `data-artifact` and words inside a path are left alone [visible] | a frame-lint finding | check-terms already walks each frame's on-screen lines and knows `data-artifact`, and build runs it first. On the system video it flagged six sans labels "The reel CLI", fixed in `eebb945` | `scripts/check-terms.mjs`, `scripts/test/names.spec.mjs` |

The walkthrough check, changed to close this plan (outside its steps; found by the code check, below):

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A44 | audit | `reel audit` counts a step's question as asked when it is already answered in the decision log (a decision of this plan on that step), as it counts one still open in `plan.md` [close] | counting only `plan.md`'s open questions | at its fifth call a step asks, and once the owner answers, the question leaves `plan.md` for the decision log; step 1 (seven calls, D-166) and step 3 (six, D-167) failed an audit that had already been satisfied | `scripts/reel.mjs` (audit, `asked`), `scripts/test/lifecycle.spec.mjs`, `16af905` |
| A45 | audit | Calls outside the plan's steps are counted per ask, by their step column's word ("zoom" 4, "overlap" 2, "captions" 4), and an ask at its fifth call is a warning (its question goes to the owner, not `plan.md`); the load warning names the busiest step or ask [close] | lumping them as one step "?" (10 calls here, a failure no question could answer) | the three asks were separate, each asked at its fifth (A33, A41); every other plan's audit output is unchanged | `scripts/reel.mjs` (audit, `outside`), `scripts/test/lifecycle.spec.mjs` (two checks), `d644b49` |

## Tests run

By the workers, as each piece landed:

- Steps 1 and 2 (`30ec428`, `a28dbe4`): `scripts/test/visuals.spec.mjs` (new: cameras and the clipped view,
  cards at rest, the screen-pixel mono floor, the pinned-word note, both blocks passing frame-lint,
  motion-static's helpers and holds, scale-only-zoom, variety and its `- Real things:` line), `terms.spec`,
  `stage-presence.spec`, `build.spec`, `lifecycle.spec`, `version.spec`, `hyperframes-skills.spec`: pass.
  frame-lint and check-terms, old against new, on every video in the repo (26 projects): the same results. A
  copy of the videos-you-can-follow video rebuilt with every stage passing, differing only in the theme's
  colours.
- Step 3 (`312d989`): `access.spec` §0 (the faces declared and loaded, the three inks at 4.5:1 or more on
  every ground in both themes, the accent at 3:1 or more), `bundle.spec` on a fresh bundle, `answer-on-frame`
  (the tick, the cross, the right card's ring not coral), and the rest of the player's specs: pass. Shots
  before and after (the Terms panel, a check waiting and answered, light and dark) in the worker's
  scratchpad `bv-impl/page-shots/`.
- Step 4 (`6d83613`): the system video built with `reelplanning build`, every stage passing.
- The owner's asks: `size.spec` §1, §3, §4, §10 (150% and 200%, the wheel, the keys, a question at 200%,
  Fit; 25% steps after `981f364`); `answer-on-frame.spec` §16 (every quick check of two videos answered
  wrong, at Fit and at 200%, fails 4 checks on the old player); `scripts/test/names.spec.mjs` (new).

After the review (`04b9826`): `scripts/test/details.spec.mjs` (one theme script and token block in every
template, the darker coral and the solid inks, no old coral, restyle) and `packages/player/test/details.spec.mjs`
(a template page in the panel gets the faces, the coral and the inks, light and dark): pass. Before and after
shots of a built page in the panel and on its own, light and dark: the worker's scratchpad `dp/shots/`.

At the end, on `16af905`: `npm test`, every spec from `version` to `group` (953 checks), pass; then the five
after it run on their own, since `answer-on-frame` met another worker's run on its port inside `npm test`:
`answer-on-frame` (1044), `access` (61), `stop` (44), `band` (103) and `size` (67), pass. With the audit fix
(`d644b49`): `lifecycle.spec`, with its two new checks, pass, and `reel audit` on every other plan prints what
it printed before.

## Not done

- **Detail pages built before the fix** (twelve, in the m3-revise-loop, deep-dives and
  answer-on-the-video walkthrough videos) keep the old coral and inks until `reelplanning detail restyle` is
  run on their video (a copy of deep-dives' seven restyles and passes; the pages themselves were not changed
  here). Opened on its own, a detail page keeps its fallback fonts; the faces come in the player's panel.
- **Italics** are not shipped (the browser slants the upright for a glossary `<i>`, A21).
- **With the player's own theme set to dark over a video whose frame stays light,** the ink rings on the frame
  (your pick, and now the right answer) are cream on cream; your pick's already was. In a real dark page the
  frame is dark too.
- **Old videos keep their look** until revised (step 4): only the system video, this plan's video and this
  walkthrough's video are in the new style.
- **Plain names** (GitHub, HyperFrames) are case-fixed in the captions, not highlighted (A41).

## Decisions in force

- **D-166** (this plan, question 1: the brief picks which scenes show the real thing) held: `- Real things:`
  in `templates/video/BRIEF.md`, `skills/plan-to-video/SKILL.md` (Build a video step 1) and style guide §5;
  `scripts/lib/variety.mjs` only repeats the line and warns on nothing about it (A25); no per-scene field and
  no warning for a scene of boxes exist. The system video's and this plan's briefs name their scenes.
- **D-167** (this plan, question 2: today's look, fixes only) held: today's cream and coral with its fonts
  shipped (`packages/player/fonts/faces.json`), three solid inks and a type scale in
  `packages/player/reelplanning-player.js` and `packages/player/index.html`; no Look menu in the player.
- **D-142** (the darker coral, on the page and in the videos) held for the videos
  (`templates/reelplanning/theme/tokens.html` `--rp-coral`), the page (`--accent` in
  `packages/player/reelplanning-player.js`, one value in both) and, after the review, the detail pages'
  templates (`templates/details/*.html`, A10).
- **D-127** (plain words on screen) held: a pinned `data-gloss` word is the video's own word, held to the
  glossary's rules by `scripts/check-terms.mjs` (A5); a real thing's own words are its own.
- **D-083** (a quick check per step) held: unchanged; the frame-lint card rule keeps its case still behind
  the question (`scripts/frame-lint.mjs`, A8); this walkthrough's video has one per step.
- **D-108** (the answers the frame can't take go to the band) held: `scripts/frame-lint.mjs` fails a camera
  outside a view clipped at 900 px, keeping the lowest eighth empty (A8); zoomed in, the band stays on the
  view, not the picture (`packages/player/reelplanning-player.js`, A30).
- **D-021** (a detail opens in the side panel) and **D-024** (detail pages from a template) held: the panel
  is as it was (`openDetail`); after the review the templates took the page's look and the player posts an
  open page its faces (`onDetailMessage`, `detailFaces`; `templates/details/`, A10).
- **D-085** (less scaffolding) held: this plan adds a document (`templates/reelplanning/theme/motion-language.md`)
  and checks, and one optional brief line; no new step in `skills/plan-to-video/SKILL.md`.
- **D-003** (the system video updates after every accepted walkthrough) held, and step 4 added its one full
  rebuild (`6d83613`); `reel status` says it is current (`.reelplanning/system-video/`).
- **D-065** (a system-video comment changes the video or the system) held: unchanged (`scripts/system-review.mjs`
  untouched).
- **D-128** ("watched" in this browser and your file) held: only its mark's colour changed (ink, A24,
  `.pre[data-watched]` in `packages/player/reelplanning-player.js`); the rebuilt system video counts as changed.
- **D-129** (approving never blocked) held: the approve path is unchanged; the Finish panel only took the new
  inks and coral (`packages/player/reelplanning-player.js`, `packages/player/test/finish.spec.mjs`).
- **D-005** (rewinds are sent) held: untouched (`packages/player/reelplanning-player.js`).
- **D-064**, **D-066**, **D-082** (the loop's background agent, one setting, auto mode in the sandbox) held:
  untouched (`scripts/review.mjs`, `scripts/lib/sandbox.mjs` unchanged).
- **D-084**, **D-109** (what stops the walkthrough) held: `scripts/lib/autonomy.mjs` unchanged.
- **D-110** (at a step's fifth choice, ask) held: steps 1 and 3 asked theirs as questions 1 and 2, and
  `reel audit` counts a question already answered in the decision log (`scripts/reel.mjs`, `16af905`); the
  owner's asks each asked at their fifth (A33, A41), and `reel audit` now counts calls outside the plan's
  steps per ask ("zoom" 4, "overlap" 2, "captions" 4) instead of lumping them as one step "?" of 10, with a
  warning at an ask's fifth (`scripts/reel.mjs`, `scripts/test/lifecycle.spec.mjs`, `d644b49`; every other
  plan's audit output unchanged).
- **D-106**, **D-107** (your memory's file and the retro) held: `scripts/lib/memory.mjs` unchanged.

## Code check

A fresh headless agent (`claude -p` with exactly the `code-check --prompt` text; tools: Read, Grep, Glob,
read-only `git diff`/`git log`/`git show`, and an edit rule for `code-check/findings.md` alone) read
`code-check/brief.md` and wrote `code-check/findings.md` itself (a first run, without the edit rule, stopped at
the write and returned nothing; it was run again with the same prompt). The brief:
`code-check .reelplanning/plans/2026-09-26-better-visuals --base b421610 --head d644b49 -- <60 paths>`: this
plan's code, skill, template and test paths, `.reelplanning/names.md`, the theme copies, and the system video's
`BRIEF.md` and `STORYBOARD.md` (its 127 frame, voice and shot files left out); the case study, the cleanup
commits and the license commit left out by path where they touch no path of this plan's.

**Steps 4 ✓ / 0 ✗, Decisions 21 ✓ / 0 ✗, Unexplained 2 ✗.** Each ✗, by its key:

- `package.json` — the license change (ISC to Apache-2.0) is commit `fb4f6b5`, the owner's license and
  SECURITY.md change, not this plan's; it is in the diff only because `package.json` is a path this plan
  also touched (a path filter cannot split a file). This plan's lines there are `packages/player/fonts/` in
  `files` (`312d989`, A21) and `visuals.spec` and `names.spec` in the test script (`30ec428`, `1f9e726`). Not a row.
- `scripts/reel.mjs` (with `scripts/test/lifecycle.spec.mjs`, `skills/plan-to-video/SKILL.md`) — a real miss in
  the log: the two changes to how `reel audit` counts toward D-110's fifth call, `16af905` (an answered question
  counts) and `d644b49` (the owner's asks counted per ask), were made to close this plan and had no row. Now
  rows A44 and A45 (above). `plan.md`'s "D-084, D-109, D-110 … untouched" holds for the rules themselves (a
  step still stops and asks at its fifth call; `scripts/lib/autonomy.mjs` is unchanged); what changed is the
  audit's counting, said under D-110 below.

## After the walkthrough review

Reviewed 2026-09-27 (`reviews/walkthrough-20260927T010310Z.md`), changes requested: 22 calls accepted (in the
ledger), step 1's quick check missed, and one note on the ending. What changed:

- **The detail pages' coral** (the note at the ending, on "Not done: the detail pages still use the old
  coral": "ok why dont we just fix this while we are at it?"): done, `04b9826`. The six templates take
  today's look (step 3's entry, A10's row changed in place): the darker coral, the solid inks, coral only
  for what is yours or waiting on you, and the page's faces in the player's panel. The pages already built
  do not rebuild from the templates: each is a copy filled in by hand. `reelplanning detail restyle
  <video-dir>` (new) swaps their theme script and token block for today's without a video rebuild; it was
  not run on the twelve built pages here (Not done). The same note's other ask, opening a detail from
  inside the picture, is a plan of its own (`2026-09-27-details-in-the-frame`).
- **Step 1's quick check** ("The brief picks scene 3. Scene 5 draws only boxes. What does the build say
  about scene 5?", answered "A warning for scene 5"; the answer is "Nothing", D-166): step 1's scene now
  shows that very case. Under the brief template's diff, a video of six scenes whose brief picks scene 3,
  the build's real lines for it (`reelplanning variety` on that sample: "✓ variety  BRIEF.md picks the real
  things: scene 3 (the table); the rest explain with pictures"), and for scene 5, which draws boxes, an
  empty row: "scene 5: no line". The narration says it: "the build says nothing about it: no warning, no
  line at all". No code change: that is how `scripts/lib/variety.mjs` already behaves (A25).
- **The walkthrough video** rebuilt in the three scenes the fixes touch, their frame ids kept: 2 (step 1),
  14 (step 3's grouped scene: A10 now reads "Detail pages take today's coral, inks and fonts", tagged
  "changed, as you asked") and 24 (the ending: what changed since you asked; Not done is italics and older
  videos until revised). Rebuilt with `reelplanning build`, every stage passing; 4:41 → 4:53 (step 1's scene
  says the case, 14.5 s → 19.9 s). `reel audit` passes.

