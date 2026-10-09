# Code check brief: 2026-09-26-better-visuals

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-26-better-visuals/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-26-better-visuals

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (b421610..d644b49, limited to .reelplanning/README.md .reelplanning/names.md .reelplanning/theme/frame.md .reelplanning/theme/motion-language.md docs/design-rationale.md package.json packages/player/fonts/OFL-eb-garamond.txt packages/player/fonts/OFL-inter.txt packages/player/fonts/OFL-jetbrains-mono.txt packages/player/fonts/eb-garamond-latin-wght-normal.woff2 packages/player/fonts/faces.json packages/player/fonts/inter-latin-wght-normal.woff2 packages/player/fonts/jetbrains-mono-latin-wght-normal.woff2 packages/player/index.html packages/player/reelplanning-player.js packages/player/test/access.spec.mjs packages/player/test/answer-on-frame.spec.mjs packages/player/test/bundle.spec.mjs packages/player/test/group.spec.mjs packages/player/test/parts-copy.spec.mjs packages/player/test/review-keys.spec.mjs packages/player/test/revisit.spec.mjs packages/player/test/size.spec.mjs scripts/build.mjs scripts/bundle-player.mjs scripts/captions-sentences.mjs scripts/check-terms.mjs scripts/finish-project.sh scripts/frame-lint.mjs scripts/inject-theme.mjs scripts/lib/frame-html.mjs scripts/lib/names.mjs scripts/lib/timeline.mjs scripts/lib/variety.mjs scripts/motion-static.mjs scripts/reel.mjs scripts/scale-only-zoom.mjs scripts/stage-presence.mjs scripts/test/lifecycle.spec.mjs scripts/test/names.spec.mjs scripts/test/stage-presence.spec.mjs scripts/test/terms.spec.mjs scripts/test/visuals.spec.mjs scripts/theme-tokens.mjs scripts/variety.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md templates/reelplanning/README.md templates/reelplanning/names.md templates/reelplanning/theme/blocks/README.md templates/reelplanning/theme/blocks/code-diff.html templates/reelplanning/theme/blocks/terminal-run.html templates/reelplanning/theme/frame.md templates/reelplanning/theme/motion-language.md templates/reelplanning/theme/stage.css templates/reelplanning/theme/stages/dataflow.html templates/reelplanning/theme/tokens.html templates/video/BRIEF.md .reelplanning/system-video/BRIEF.md .reelplanning/system-video/STORYBOARD.md)

```
d644b49 reel audit: calls outside the plan's steps are counted per ask, not lumped as one step "?" (D-110)
16af905 reel audit: a step's question already answered (in the decision log) counts, as an open one in plan.md does (D-110)
fb4f6b5 License under Apache-2.0; SECURITY.md: what reelplanning adds to an agent run, and how to report a problem
9447ecb Remove the uncalled check-dark and render-dark scripts; changelog notes names.md
1f9e726 Names shown one way: a tool's name in code markup, from one list (names.md)
981f364 Size keys: - and = step 25% past Fit (125, 150, 175, 200), 5% up to it
01e4f62 Answered quick check: a card's why never covers another card's words
6d83613 System video rebuilt once, whole, in the better-visuals style (better-visuals step 4; D-003)
84e255c Zoom into the video: the size goes past Fit to 200%, the picture zoomed inside Fit's box
a28dbe4 Better visuals step 1 after review: the brief picks the real things (D-166), and a change across many files shows its map first
312d989 The review page's type and colour, the groundwork every look needs (better-visuals step 3, without question 2; D-142)
30ec428 Better visuals, video side: the real thing in a scene, a written motion language, checks that keep the answer safe, the darker coral (steps 1-2 without question 1; D-142)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-26-better-visuals/plan.md` in full. Its title is "Better visuals: show the real thing, and a page that reads well", with 4 steps.

## The decisions that apply

- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**

## The autonomy log (the implementer's own calls)

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
| A10 | 3 | Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now [close] | recolouring the detail templates now | the detail pages follow the review page's look, which waited on question 2 when this was made (decided since, D-167: see Not done) | `templates/reelplanning/theme/tokens.html`, `templates/details/` |
| A21 | 3 | The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/` [hard-to-undo] | an npm devDependency (@fontsource-variable/*), which an `npx reelplanning` install does not carry, or the videos' static 400/700 files, which have no 500/600 for the chrome's weights; italics (+143 KB) left out | the bundle must work from an installed package offline, and the chrome sets 500 and 600; italics only show in glossary `<i>`, which the browser slants | `packages/player/fonts/`, `faces.json` |
| A22 | 3 | The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there [close] | the bundle writing the `@font-face` rules itself (a second builder, and a dev page or any other host of the player without fonts), or a hand-written fonts.css beside a list | one list and one builder, and every page that hosts the player gets the faces; swapping to Tally or Reading desk is new files plus this JSON | `packages/player/fonts/faces.json`, `declareFonts` in `reelplanning-player.js`, `scripts/bundle-player.mjs` |
| A23 | 3 | The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged) [visible] | staying coral (D-145), which D-142 now keeps for what is yours, or Reading desk's green (a new hue, one look's choice) | ink is the neutral both looks can start from (Tally keeps it; Reading desk sets `--right` to its green in one line), and the tick, the cross and the dashed ring say it without colour | `.hit[data-right]`, `.fwhy[data-right]` in `reelplanning-player.js`; answer-on-frame.spec "marked by more than colour" |
| A24 | 3 | Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker [visible] | a lighter pass that only darkens the colour | D-142 and the plan make coral mean one thing, "yours, waiting on you"; each of these was coral for "current" or "state" | the accent rules in `STYLE`; `LIBRARY_UI` in `scripts/bundle-player.mjs` |
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

## The diff

Read it yourself: `git diff b421610..d644b49 -- .reelplanning/README.md .reelplanning/names.md .reelplanning/theme/frame.md .reelplanning/theme/motion-language.md docs/design-rationale.md package.json packages/player/fonts/OFL-eb-garamond.txt packages/player/fonts/OFL-inter.txt packages/player/fonts/OFL-jetbrains-mono.txt packages/player/fonts/eb-garamond-latin-wght-normal.woff2 packages/player/fonts/faces.json packages/player/fonts/inter-latin-wght-normal.woff2 packages/player/fonts/jetbrains-mono-latin-wght-normal.woff2 packages/player/index.html packages/player/reelplanning-player.js packages/player/test/access.spec.mjs packages/player/test/answer-on-frame.spec.mjs packages/player/test/bundle.spec.mjs packages/player/test/group.spec.mjs packages/player/test/parts-copy.spec.mjs packages/player/test/review-keys.spec.mjs packages/player/test/revisit.spec.mjs packages/player/test/size.spec.mjs scripts/build.mjs scripts/bundle-player.mjs scripts/captions-sentences.mjs scripts/check-terms.mjs scripts/finish-project.sh scripts/frame-lint.mjs scripts/inject-theme.mjs scripts/lib/frame-html.mjs scripts/lib/names.mjs scripts/lib/timeline.mjs scripts/lib/variety.mjs scripts/motion-static.mjs scripts/reel.mjs scripts/scale-only-zoom.mjs scripts/stage-presence.mjs scripts/test/lifecycle.spec.mjs scripts/test/names.spec.mjs scripts/test/stage-presence.spec.mjs scripts/test/terms.spec.mjs scripts/test/visuals.spec.mjs scripts/theme-tokens.mjs scripts/variety.mjs skills/plan-to-video/SKILL.md skills/plan-to-video/references/style-guide.md templates/reelplanning/README.md templates/reelplanning/names.md templates/reelplanning/theme/blocks/README.md templates/reelplanning/theme/blocks/code-diff.html templates/reelplanning/theme/blocks/terminal-run.html templates/reelplanning/theme/frame.md templates/reelplanning/theme/motion-language.md templates/reelplanning/theme/stage.css templates/reelplanning/theme/stages/dataflow.html templates/reelplanning/theme/tokens.html templates/video/BRIEF.md .reelplanning/system-video/BRIEF.md .reelplanning/system-video/STORYBOARD.md` (from the repository root). The files it touches:

```
.reelplanning/README.md                            |    2 +-
 .reelplanning/names.md                             |   45 +
 .reelplanning/system-video/BRIEF.md                |   54 +-
 .reelplanning/system-video/STORYBOARD.md           | 1154 ++++++++------------
 .reelplanning/theme/frame.md                       |  114 +-
 .reelplanning/theme/motion-language.md             |   84 ++
 docs/design-rationale.md                           |    4 +-
 package.json                                       |    5 +-
 packages/player/fonts/OFL-eb-garamond.txt          |   93 ++
 packages/player/fonts/OFL-inter.txt                |   93 ++
 packages/player/fonts/OFL-jetbrains-mono.txt       |   93 ++
 .../fonts/eb-garamond-latin-wght-normal.woff2      |  Bin 0 -> 44336 bytes
 packages/player/fonts/faces.json                   |   16 +
 .../player/fonts/inter-latin-wght-normal.woff2     |  Bin 0 -> 48256 bytes
 .../fonts/jetbrains-mono-latin-wght-normal.woff2   |  Bin 0 -> 40404 bytes
 packages/player/index.html                         |   18 +-
 packages/player/reelplanning-player.js             |  782 +++++++------
 packages/player/test/access.spec.mjs               |   35 +
 packages/player/test/answer-on-frame.spec.mjs      |   82 +-
 packages/player/test/bundle.spec.mjs               |   20 +
 packages/player/test/group.spec.mjs                |    2 +-
 packages/player/test/parts-copy.spec.mjs           |    2 +-
 packages/player/test/review-keys.spec.mjs          |    2 +-
 packages/player/test/revisit.spec.mjs              |    4 +-
 packages/player/test/size.spec.mjs                 |  126 ++-
 scripts/build.mjs                                  |    7 +-
 scripts/bundle-player.mjs                          |   43 +-
 scripts/captions-sentences.mjs                     |   17 +-
 scripts/check-terms.mjs                            |   65 +-
 scripts/finish-project.sh                          |    4 +-
 scripts/frame-lint.mjs                             |   80 +-
 scripts/inject-theme.mjs                           |   16 +-
 scripts/lib/frame-html.mjs                         |  118 ++
 scripts/lib/names.mjs                              |  186 ++++
 scripts/lib/timeline.mjs                           |  190 ++++
 scripts/lib/variety.mjs                            |   70 ++
 scripts/motion-static.mjs                          |   48 +-
 scripts/reel.mjs                                   |   19 +-
 scripts/scale-only-zoom.mjs                        |   39 +
 scripts/stage-presence.mjs                         |   22 +-
 scripts/test/lifecycle.spec.mjs                    |   27 +-
 scripts/test/names.spec.mjs                        |   91 ++
 scripts/test/stage-presence.spec.mjs               |    9 +-
 scripts/test/terms.spec.mjs                        |   18 +
 scripts/test/visuals.spec.mjs                      |  168 +++
 scripts/theme-tokens.mjs                           |    3 +-
 scripts/variety.mjs                                |   14 +
 skills/plan-to-video/SKILL.md                      |   32 +-
 skills/plan-to-video/references/style-guide.md     |   90 +-
 templates/reelplanning/README.md                   |    2 +-
 templates/reelplanning/names.md                    |   45 +
 templates/reelplanning/theme/blocks/README.md      |   18 +
 templates/reelplanning/theme/blocks/code-diff.html |   83 ++
 .../reelplanning/theme/blocks/terminal-run.html    |   67 ++
 templates/reelplanning/theme/frame.md              |   98 +-
 templates/reelplanning/theme/motion-language.md    |   84 ++
 templates/reelplanning/theme/stage.css             |   10 +-
 templates/reelplanning/theme/stages/dataflow.html  |    8 +-
 templates/reelplanning/theme/tokens.html           |   23 +-
 templates/video/BRIEF.md                           |   36 +
 60 files changed, 3379 insertions(+), 1301 deletions(-)
```
