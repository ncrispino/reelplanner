---
title: "Deep dives: what landed"
format: 1920x1080
duration: 394s
message: "All six steps landed; forty-two calls the plan did not cover (fifteen beaten here) and two deviations, each to accept or flag; a fresh agent's code check found a real bug, now fixed; the first video whose beats open real details, one of each of the seven kinds"
arc: walkthrough with autonomy beats and deep dives, in six parts
audience: the reviewer who approved the deep-dives plan (and someone new to the repo), deciding whether to accept what was built
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-23-deep-dives
---

## Video direction

- A WALKTHROUGH (lifecycle stage 4, style guide §13), built from `walkthrough.md` with the look, beats and tags of `../../2026-09-22-close-the-lifecycle/walkthrough-video/`, on this plan's own stage (`../video/`): the rail with the plan video's six slot titles, and prototypes of the review player's own surfaces (the Open chip, the side panel, the comment box, the plan column) with the rail reduced to a 44 px spine. No node stage: like the plan video, no beat needs it.
- THE FIRST REAL TEST OF DEEP DIVES (plan step 6, as the code check's answer says): seven beats open a detail, one of each kind, each tagged `- detail:` / `detail_kind` / `detail_title` / `detail_why`, the narration saying the `detail_why` sentence. Four are on calls (A5 try, A11 code, A3 evidence, A13 table), so the panel carries Accept / Flag for them; three are on other beats (step 3 explore, step 5 plan-text, the code check fresh). Every page is in `details/`, self-contained, light and dark, with the bridge, and `check-details` opens each in Chromium.
- A SERIES OF SIX PARTS (§16): `chapter_start` on frames 1, 8, 16, 23, 30, 36; each part opens on the rail as reported so far and closes by naming the next. The rail's slot tags are the running tally of beaten calls per step (`4 + dev`, `3 calls`, …).
- WHAT-CHANGED BEATS (one per step): prototypes of what landed, each with a real value (the panel's 560 px and the stage's 640 px; the seven templates and the command; a comment on one row and the resolve-plan line it becomes; Accept / Flag in the panel; the plan column at 1440 × 900; the check run on this video).
- AUTONOMY BEATS (A1–A15, and the two deviations as their own beats, d1 = the key is O, not E, and d2 = the plan text sits beside the video, not below it): in the left column two cards — `Chose · …` with a 2 px INK border and `Instead of · …` at ink 55 % — and the check as a mono chip under them; on the right a small prototype of the player surface the call is about, its part outlined coral, with one worked-example chip. No recommendation and no coral on the cards: the thing is done; the player pauses and asks Accept (A) or Flag (B). Everything the call needs sits above y 650. Each is about 9–12 s.
- THE CODE CHECK gets its own beat (part 5): the findings page; the step 6 gap (this plan's video has no details, so this one carries them) and the real bug (a comment in a detail opened from the plan text pointed at the wrong frame), fixed with a test, shown as the check working. The 42-call log gets one beat (part 6): past about a dozen, the plan left too much open.
- QUICK CHECKS (K1 after step 2's calls: what earns a detail; K2 after step 3's calls: Esc in a comment box): the question and three option cards, none marked.
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word, a held read at the end; nothing below y 900 but captions.


## Frame 1 — What landed

- chapter_start: Step 1: the chip and the panel
- scene: FULL RAIL, STARTS DONE: the rail with all 6 slots filled (the plan video's titles), in ink from t=0; on 'six' a mono chip '6 of 6' under the rail; on 'forty-two' the mono line '42 calls · 2 deviations' lands to the right (coral-deep, the one coral); on 'pages' seven small page cards (explore, try, evidence, table, code, plan text, fresh) land in a row under it; held
- voiceover: "Deep dives is built: six steps, forty-two calls the plan did not cover, and two deviations. It is also the first video whose beats open real pages, one of each kind."
- duration: 11.35s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete outcome first
- beat: Hook
- blueprint: compose
- focal: the seven kinds, and the count of calls
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What landed.
keyMessage: Deep dives is built:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'six'): c6 lands, timed to the start of the word.
Scene 3 (on 'forty'): c42 lands, timed to the start of the word.
Scene 4 (on 'pages'): pages lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 2 — Step 1: the Open chip and the side panel

- scene: SPINE + PROTOTYPE: kicker 'Step 1 · Deep-dive beats'; the review player paused on a walkthrough beat ('Call A13 · Step 6'); on 'chip' the Open chip 'Open · O' lands in the stage's top-right corner; on 'panel' the side panel slides in from the right (header 'Every rule the check applies', a table page) and the stage narrows beside it; on 'closing' the chip 'panel ≤ 560 px · stage ≥ 640 px' lands under the player
- voiceover: "Step one landed. A beat can carry a detail, and the player shows an Open chip on it. Opening pauses the video and shows the page in a side panel; closing plays on from where you were."
- duration: 11.1s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-step-1.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: the panel beside the paused stage
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 1: the Open chip and the side panel.
keyMessage: Step one landed.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'chip'): chip lands, timed to the start of the word.
Scene 3 (on 'panel'): panel lands, timed to the start of the word.
Scene 4 (on 'closing'): note lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 3 — Call A1: O opens, but a question keeps O

- scene: SPINE + PROTOTYPE: kicker 'Call A1 · Step 1'; spine tick 1 in ink; on the right, the review player paused on a call, its question sheet up (Accept A · Flag B · own words O) with the Open chip waiting behind it, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'O = own words, here' under it; on 'Open' the card 'Chose · O waits for a question' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · O always opens' lands at ink 55 %; under them the check chip 'player.js · onKey'; held — the player pauses here and asks Accept / Flag
- voiceover: "The Open key is O. While a question is up, O keeps meaning answer in my own words, rather than opening the chip: a question owns its letters."
- duration: 9.21s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-call-a1.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a1
- chose: The Open chip's key is O; while a question sheet is up, O keeps meaning "answer in my own words", so the chip waits behind it
- instead_of: O opening the chip even over a question (or E, the plan's key)
- why: O is the chip's own first letter and is free outside a question; a question on screen owns its letters
- check: packages/player/reelplanning-player.js onKey, the o branch
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A1: O opens, but a question keeps O.
keyMessage: The Open key is O.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Open'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'owns'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 4 — Deviation: the key is O, not E

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 1'; spine tick 1 in ink; on the right, two keycaps side by side: E (labelled Export) and O (labelled Open), the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'E = Export today' under it; on 'Export' the card 'Chose · O, not E' (2 px ink border) lands in the left column; on 'moving' the card 'Instead of · E, as step 1 says' lands at ink 55 %; under them the check chip 'walkthrough.md'; held — the player pauses here and asks Accept / Flag
- voiceover: "That is a deviation, said plainly: step one says E. But E is Export today, and moving it would break a key reviewers and a test already rely on."
- duration: 9.23s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-deviation-key.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: d1
- chose: Deviation from step 1: the Open chip's key is O
- instead_of: Step 1 as written: the key is E
- why: E is Export today; moving Export would break a key reviewers and review-keys.spec.mjs already rely on
- check: walkthrough.md · Deviations
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: the key is O, not E.
keyMessage: That is a deviation, said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'deviation'): example lands, timed to the start of the word.
Scene 3 (on 'Export'): chose lands, timed to the start of the word.
Scene 4 (on 'moving'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 5 — Call A2: beside the stage, not over it

- scene: SPINE + PROTOTYPE: kicker 'Call A2 · Step 1'; spine tick 1 in ink; on the right, the review player with the side panel open at the right edge, the stage narrowed beside it, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'stage ≥ 640 px' under it; on 'beside' the card 'Chose · Beside the stage' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Over the stage' lands at ink 55 %; under them the check chip 'player.js · measurePeek'; held — the player pauses here and asks Accept / Flag
- voiceover: "The panel sits beside the stage rather than over it, and covers the window only when the stage would drop under six hundred forty pixels. In the review page, it now sits beside at every window I measured."
- duration: 12.15s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-call-a2.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a2
- chose: The panel is fixed to the window's right edge, full height, min(560px, 44vw) wide, and the stage shrinks beside it; where that would leave the stage under 640 px (a window under about 1250 px) or on a phone, it covers the window
- instead_of: A panel inside the stage's own height, or an overlay on the stage
- why: A detail is read or tried at length: the stage's 16:9 height is too short for a page, and covering the stage would lose the frame it belongs to
- check: packages/player/reelplanning-player.js .dpanel, measurePeek (dcover)
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A2: beside the stage, not over it.
keyMessage: The panel sits beside the stage rather than over it, and covers the window only when the stage would drop under six hundred forty pixels.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'beside'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'six'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 6 — Call A4: close plays on only if it was playing

- scene: SPINE + PROTOTYPE: kicker 'Call A4 · Step 1'; spine tick 1 in ink; on the right, the review player paused, the panel just closed, the playhead where it was, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'no seek back' under it; on 'Closing' the card 'Chose · Play if it played' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Always play on' lands at ink 55 %; under them the check chip 'player.js · closeDetail'; held — the player pauses here and asks Accept / Flag
- voiceover: "Closing plays again only if the video was playing and you have not moved it, rather than always playing on. A video that starts by itself surprises you."
- duration: 9.27s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-call-a4.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a4
- chose: Close plays again only if the video was playing when the detail opened and the playhead is still where it was; no seek back
- instead_of: Always play on close, or always seek back to the opening moment
- why: "Resumes where you were": a reviewer who opened it from a paused frame, or moved the video while reading, would be surprised by a video that starts or jumps on its own
- check: packages/player/reelplanning-player.js closeDetail
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A4: close plays on only if it was playing.
keyMessage: Closing plays again only if the video was playing and you have not moved it, rather than always playing on.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Closing'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'surprises'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 7 — Next: part 2

- scene: RAIL (full, all filled): slot 1 gains the ink tag '4 + dev'; 'Next · Part 2' in mono beside the rail with the hero 'The keys, and the pages'
- voiceover: "Next, part two: the keys while a page is open, and step two's pages."
- duration: 4.69s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-closer-1.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 8 — Part 2 of 6

- chapter_start: The keys, and step 2's pages
- scene: RAIL (full): slot 1 carries '4 + dev'; kicker 'Part 2 of 6'; hero 'Chip and panel, reported'; slot 2 lifts (ink border) on 'pages'
- voiceover: "Part two of six. The chip and the panel are reported. Now the keys, then the pages."
- duration: 5.62s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-opener-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 6.
keyMessage: Part two of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'pages'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 9 — Call A5: the video's keys wait behind the page

- scene: SPINE + PROTOTYPE: kicker 'Call A5 · Step 1'; spine tick 1 in ink; on the right, the review player with a page open in the panel; keycaps Space, A–D and N dimmed, O and Esc in ink, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'space: nothing' under it; on 'off' the card 'Chose · Keys off; O, Esc close' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Keys reach the video' lands at ink 55 %; under them the check chip 'player.js · onKey guard'; held — the player pauses here and asks Accept / Flag
- voiceover: "With a page open, the video's keys are off, rather than reaching the hidden video; O and Escape close it. Open it to press the keys yourself, with a page or a question up."
- duration: 10.32s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-call-a5.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a5
- chose: While the panel is open the video's keys are off (no play, draw or answer); O and Esc close it
- instead_of: Letting space, A–D or N act on the hidden video
- why: Keys meant for the page should not start or answer the video under it. Once focus is inside the sandboxed page its keys are the page's own: Esc then works after one click on the panel's header, and × always works
- check: packages/player/reelplanning-player.js onKey (this._dopen guard)
- detail: keys-with-a-page-open
- detail_kind: try
- detail_title: Press the keys yourself
- detail_why: Open it to press the keys yourself, with a page or a question up.
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A5: the video's keys wait behind the page.
keyMessage: With a page open, the video's keys are off, rather than reaching the hidden video;

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'off'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'Escape'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 10 — Step 2: seven page templates

- scene: SPINE + PROTOTYPE: kicker 'Step 2 · Detail kinds'; tag 'decided · D-024' on 'seven'; seven template file cards land in a row (explore, try, evidence, table, code, plan-text, fresh); on 'command' a terminal line '$ reelplanning detail new <video> <name> --kind table'; on 'rule' the mono chip 'only what the video cannot' lands under them
- voiceover: "Step two: seven page templates, from explore to a blank fresh page, each one self-contained and themed. One command copies a template into a video, and the style guide carries the rule: a detail holds only what the video cannot."
- duration: 14.6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the seven templates, and the rule
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 2: seven page templates.
keyMessage: Step two:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'seven'): files lands, timed to the start of the word.
Scene 3 (on 'command'): term lands, timed to the start of the word.
Scene 4 (on 'rule'): rule lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 11 — Call A10: a seventh, blank template

- scene: SPINE + PROTOTYPE: kicker 'Call A10 · Step 2'; spine tick 2 in ink; on the right, the templates folder: seven file names, fresh.html lit, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'fresh.html' under it; on 'Fresh' the card 'Chose · A blank template' (2 px ink border) lands in the left column; on 'scratch' the card 'Instead of · Bridge from scratch' lands at ink 55 %; under them the check chip 'templates/details/fresh.html'; held — the player pauses here and asks Accept / Flag
- voiceover: "Fresh, the seventh template, is the theme and the bridge around an empty page, rather than a bridge written from scratch each time, which is how it breaks."
- duration: 8.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-call-a10.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a10
- chose: A seventh template, fresh.html: the base styles, theme and bridge with an empty body, for kind fresh
- instead_of: Writing the bridge from scratch each time
- why: The contract says a fresh page still carries the bridge; copying it is the reliable way
- check: templates/details/fresh.html
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A10: a seventh, blank template.
keyMessage: Fresh, the seventh template, is the theme and the bridge around an empty page, rather than a bridge written from scratch each time, which is how it breaks.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Fresh'): chose lands, timed to the start of the word.
Scene 3 (on 'scratch'): instead lands, timed to the start of the word.
Scene 4 (on 'breaks'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 12 — Call A11: a JSON block fills a page

- scene: SPINE + PROTOTYPE: kicker 'Call A11 · Step 2'; spine tick 2 in ink; on the right, a page's head: the <script id="rp-data"> block with three keys, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'id="rp-data"' under it; on 'JSON' the card 'Chose · A JSON block' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · HTML slots everywhere' lands at ink 55 %; under them the check chip 'templates/details/try.html'; held — the player pauses here and asks Accept / Flag
- voiceover: "Data pages are filled from one JSON block, a prototype from two slots, rather than HTML slots everywhere. Open it to read the block and the slots, with the lines that carry the call marked."
- duration: 12.9s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-call-a11.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a11
- chose: Data pages are filled by one JSON block (rp-data); a prototype by two slots, markup and behaviour; explore by one optional script
- instead_of: HTML slots everywhere, or JSON only
- why: Data pages (table, evidence, code, plan text) are data; a prototype is markup and behaviour, and 90 steps are a loop, not a list
- check: templates/details/try.html, explore.html
- detail: data-block-and-slots
- detail_kind: code
- detail_title: The data block and the slots
- detail_why: Open it to read the block and the slots, with the lines that carry the call marked.
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A11: a JSON block fills a page.
keyMessage: Data pages are filled from one JSON block, a prototype from two slots, rather than HTML slots everywhere.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'JSON'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'marked'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 13 — Call A12: a worked sample in every template

- scene: SPINE + PROTOTYPE: kicker 'Call A12 · Step 2'; spine tick 2 in ink; on the right, a copied table template, its sample rows (the uploads plan's risks) and the tag 'Sample content', the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'Sample content' under it; on 'worked' the card 'Chose · A worked sample' (2 px ink border) lands in the left column; on 'lorem' the card 'Instead of · Lorem ipsum' lands at ink 55 %; under them the check chip 'templates/details/*.html'; held — the player pauses here and asks Accept / Flag
- voiceover: "Each template ships with a worked sample from the uploads plan, marked sample content, rather than lorem ipsum: a copied template already shows what good looks like."
- duration: 10.1s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-call-a12.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a12
- chose: Each template's sample is the uploads plan (risks, the 8/16/32 MB staging runs, parts.ts line 14, before/after drop, manifest explorer, a step's text), marked "Sample content"
- instead_of: Lorem ipsum
- why: A copied template already shows what good looks like for its kind; the check passes the templates as they are
- check: templates/details/*.html
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A12: a worked sample in every template.
keyMessage: Each template ships with a worked sample from the uploads plan, marked sample content, rather than lorem ipsum:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'worked'): chose lands, timed to the start of the word.
Scene 3 (on 'lorem'): instead lands, timed to the start of the word.
Scene 4 (on 'good'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 14 — Quick check: what earns a detail

- scene: SPINE: kicker 'Quick check · Step 2'; the question in serif; three option cards A/B/C land on their words, none marked
- voiceover: "Quick check. Which of these earns a detail: a page that says sixteen megabytes, the staging runs behind that number, or the step's title, larger?"
- duration: 9.03s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-check-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 2
- quiz: k1
- question: Which of these earns a detail?
- option_a: A page saying 16 MB
- option_b: The runs behind 16 MB
- option_c: The step title, larger
- answer: b
- explain: A detail holds what the video cannot: the evidence behind a number, never the number restated (style guide §20)
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: what earns a detail.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'page'): o1 lands, timed to the start of the word.
Scene 3 (on 'staging'): o2 lands, timed to the start of the word.
Scene 4 (on 'title'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 15 — Next: part 3

- scene: RAIL (full): slot 2 gains '3 calls'; 'Next · Part 3'; hero 'Comments inside a page'
- voiceover: "Next, part three: comments inside a page."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-closer-2.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 16 — Part 3 of 6

- chapter_start: Step 3: comments inside a page
- scene: RAIL (full): kicker 'Part 3 of 6'; hero 'The pages, reported'; slot 3 lifts on 'commenting'
- voiceover: "Part three of six. The pages are reported. Now, commenting on one line of a page."
- duration: 5.85s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-opener-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 3 of 6.
keyMessage: Part three of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'commenting'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 17 — Step 3: a comment on one row of a page

- scene: SPINE + PROTOTYPE: kicker 'Step 3 · Comments inside'; the side panel with this video's own table page (Every rule the check applies); on 'row' the row 'a <script src>' takes an ink left rule; on 'comment' the comment box docks under the page: 'Comment on row: a <script src>'; on 'resolve' a line from resolve-plan lands to the left: '- note in detail check-rules at row: a <script src>'
- voiceover: "Step three: click a row in a page, and a comment box opens on it, naming that row. The comment reaches resolve plan under its step, with where it points. Open it to step through one comment's path and see what each part carries."
- duration: 13.47s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-step-3.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 3
- detail: a-comments-path
- detail_kind: explore
- detail_title: One comment's path, step by step
- detail_why: Open it to step through one comment's path and see what each part carries.
- focal: a row, its comment box, and the line it becomes
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 3: a comment on one row of a page.
keyMessage: Step three:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'row'): row lands, timed to the start of the word.
Scene 3 (on 'comment'): box lands, timed to the start of the word.
Scene 4 (on 'resolve'): line lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 18 — Call A6: a comment in a page is a note

- scene: SPINE + PROTOTYPE: kicker 'Call A6 · Step 3'; spine tick 3 in ink; on the right, the panel's comment box: 'Comment on row: 16 MB', the words typed, the hint 'Enter or Esc keeps it · × discards it', the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'Esc keeps the words' under it; on 'ordinary' the card 'Chose · An ordinary note' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A new kind' lands at ink 55 %; under them the check chip 'player.js · saveDetailComment'; held — the player pauses here and asks Accept / Flag
- voiceover: "A comment in a page is an ordinary note plus where it points, rather than a new kind. Enter or Escape keep the words; only the cross throws them away."
- duration: 9.63s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-call-a6.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a6
- chose: A detail comment is kind: "note" with detail: { name, anchor, text }; Enter or Esc keeps the words, the × discards them; a click on another anchor keeps what was typed on the first
- instead_of: A new kind (detail-note), or Esc discarding
- why: An ordinary annotation per the contract, so resolve-plan and every existing view read it as a comment; words are only thrown away on purpose
- check: packages/player/reelplanning-player.js saveDetailComment, closeDetailComment
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A6: a comment in a page is a note.
keyMessage: A comment in a page is an ordinary note plus where it points, rather than a new kind.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'ordinary'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'Escape'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 19 — Call A9: a button inside a row just works

- scene: SPINE + PROTOTYPE: kicker 'Call A9 · Step 3'; spine tick 3 in ink; on the right, a table page: a row with a Sort button in its header and a Copy button in a cell, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'sort ≠ a comment' under it; on 'button' the card 'Chose · Controls just act' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Every click comments' lands at ink 55 %; under them the check chip 'rp-bridge · CONTROL'; held — the player pauses here and asks Accept / Flag
- voiceover: "A click on a button inside a row works the button, rather than opening a comment: sorting a table should not start a note."
- duration: 7.46s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-call-a9.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a9
- chose: A click on a control (button, a, input, select, textarea, label, summary, [data-no-anchor]) inside an anchored element does not post an anchor; the anchor element itself does
- instead_of: Posting an anchor on every click inside an anchor
- why: Sorting a table, copying a cell or pressing a prototype's button should not open a comment box; commenting on the region still works by clicking or selecting text in it
- check: templates/details/*.html (rp-bridge)
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A9: a button inside a row just works.
keyMessage: A click on a button inside a row works the button, rather than opening a comment:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'button'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'sorting'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 20 — Call A15: a link shows its words, not a link

- scene: SPINE + PROTOTYPE: kicker 'Call A15 · Step 3'; spine tick 3 in ink; on the right, a plan-text page: a sentence whose link shows its words and the address in grey, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'the address, in grey' under it; on 'words' the card 'Chose · Words, no link' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A working link' lands at ink 55 %; under them the check chip 'details/plan-text.html'; held — the player pauses here and asks Accept / Flag
- voiceover: "Plan text shows a link as its words and the address in grey, rather than a working link: a link is a network load, and the panel cannot follow it."
- duration: 8.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-call-a15.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a15
- chose: plan-text renders a Markdown link as its text plus the address in grey, never an <a href>
- instead_of: A working link
- why: The contract counts an http(s) href as a network load, and a sandboxed panel cannot open it anyway
- check: templates/details/plan-text.html
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A15: a link shows its words, not a link.
keyMessage: Plan text shows a link as its words and the address in grey, rather than a working link:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'words'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'network'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 21 — Quick check: Escape in a comment

- scene: SPINE: kicker 'Quick check · Step 3'; the question; three option cards on their words, none marked
- voiceover: "Quick check. You typed a comment on a row, then press Escape. Are the words thrown away, saved to the record, or kept until you close the page?"
- duration: 8.45s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-check-2.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 3
- quiz: k2
- question: You typed a comment, then press Esc. The words…
- option_a: Are thrown away
- option_b: Are saved to the record
- option_c: Wait until you close
- answer: b
- explain: A6: Enter or Esc keeps the words and saves them to the record; only the × throws them away
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: Escape in a comment.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'thrown'): o1 lands, timed to the start of the word.
Scene 3 (on 'saved'): o2 lands, timed to the start of the word.
Scene 4 (on 'kept'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 22 — Next: part 4

- scene: RAIL (full): slot 3 gains '3 calls'; 'Next · Part 4'; hero 'What a call opens'
- voiceover: "Next, part four: what a call opens, and the plan beside the video."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-closer-3.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, part four:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 23 — Part 4 of 6

- chapter_start: Steps 4 and 5: calls, and the plan beside
- scene: RAIL (full): kicker 'Part 4 of 6'; hero 'Comments, reported'; slot 4 lifts on 'four'
- voiceover: "Part four of six. Comments are reported. Now, steps four and five."
- duration: 4.66s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-opener-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 4 of 6.
keyMessage: Part four of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'four'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 24 — Step 4: a call opens what judges it

- scene: SPINE + PROTOTYPE: kicker 'Step 4 · What changed'; tag 'decided · D-023' on 'code'; the panel's header for a call: 'The agent's call: …' with Accept and Flag; on 'four' four call chips land: 'A5 · try', 'A13 · table', 'A3 · evidence', 'A11 · code'
- voiceover: "Step four: a call's beat can open a detail, with Accept and Flag in the panel. Here, four calls open one: a try, a table, the evidence, and code only where the call is about data."
- duration: 11.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-step-4.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: Accept and Flag in the panel
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 4: a call opens what judges it.
keyMessage: Step four:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Accept'): hdr lands, timed to the start of the word.
Scene 3 (on 'four'): calls lands, timed to the start of the word.
Scene 4 (on 'code'): d023 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 25 — Call A7: one verdict per call

- scene: SPINE + PROTOTYPE: kicker 'Call A7 · Step 4'; spine tick 4 in ink; on the right, the panel's header for a call: Accept pressed and both buttons disabled, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'answers the sheet' under it; on 'once' the card 'Chose · One verdict, once' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Change it later' lands at ink 55 %; under them the check chip 'player.js · detailVerdict'; held — the player pauses here and asks Accept / Flag
- voiceover: "Accept and Flag in the panel work once, like the sheet's, and answer the sheet if it is waiting, rather than letting a verdict change later."
- duration: 7.97s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-call-a7.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a7
- chose: Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled; if that call's sheet is waiting, the panel's verdict answers it too
- instead_of: Letting the panel change a verdict, or leaving the sheet waiting
- why: The sheet has no "change" for a call either; one verdict per call keeps the export and the Flag note consistent
- check: packages/player/reelplanning-player.js detailVerdict, recordVerdict
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A7: one verdict per call.
keyMessage: Accept and Flag in the panel work once, like the sheet's, and answer the sheet if it is waiting, rather than letting a verdict change later.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'once'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'answer'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 26 — Step 5: the plan's own text with the video

- scene: SPINE + PROTOTYPE: kicker 'Step 5 · Plan below video'; the review page at 1440 wide: the stage, and beside it the plan column (Step 3 …, Step 4 …, Step 5 …); on 'coral' step 5's section takes the coral rule; on 'jump' the playhead jumps to step 5's first frame
- voiceover: "Step five: the plan's own text sits with the video, a section per step, the current one ruled in coral; click one to jump there. Open it for step five as written, each sentence beside what was built."
- duration: 12.17s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-step-5.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 5
- detail: step-5-written-and-built
- detail_kind: plan-text
- detail_title: Step 5, as written and as built
- detail_why: Open it for step five as written, each sentence beside what was built.
- focal: the plan column beside the stage
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 5: the plan's own text with the video.
keyMessage: Step five:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'text'): col lands, timed to the start of the word.
Scene 3 (on 'coral'): lit lands, timed to the start of the word.
Scene 4 (on 'jump'): jump lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 27 — Call A3: beside the stage, or in the record

- scene: SPINE + PROTOTYPE: kicker 'Call A3 · Step 5'; spine tick 5 in ink; on the right, the review page at 1440 × 900: the stage and the 340 px plan column beside it, the part the call is about outlined coral (the frame's one coral), with the worked-example chip '1440 × 900 · beside' under it; on 'beside' the card 'Chose · Beside, or in the record' (2 px ink border) lands in the left column; on 'record' the card 'Instead of · Always below' lands at ink 55 %; under them the check chip 'player.js · placePlan'; held — the player pauses here and asks Accept / Flag
- voiceover: "The plan text sits beside the stage when that costs under a tenth of its width, and in the record otherwise. In the review page it now fits beside at every size; the widths I measured are one click away."
- duration: 11.83s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-call-a3.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a3
- chose: The plan text goes beside the stage (a 340 px column) when the stage loses under 10 % of its width for it; otherwise it is a section in the record, under Steps
- instead_of: Always below the player in the page flow (the plan's words)
- why: The record sheet is fixed and rests at a peek that fills the window under the controls, so anything in the page flow below the player sits behind it; beside, the reviewer reads the lit step while the video plays
- check: packages/player/reelplanning-player.js placePlan, .wrap.beside CSS
- detail: plan-column-widths
- detail_kind: evidence
- detail_title: Stage widths, measured
- detail_why: The widths I measured are one click away.
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A3: beside the stage, or in the record.
keyMessage: The plan text sits beside the stage when that costs under a tenth of its width, and in the record otherwise.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'beside'): chose lands, timed to the start of the word.
Scene 3 (on 'record'): instead lands, timed to the start of the word.
Scene 4 (on 'measured'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 28 — Deviation: beside the video, not below it

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 5'; spine tick 5 in ink; on the right, the review page: the player, and the record sheet resting over what sits below it, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'the sheet covers it' under it; on 'sheet' the card 'Chose · Beside, or the record' (2 px ink border) lands in the left column; on 'below' the card 'Instead of · Below the player' lands at ink 55 %; under them the check chip 'walkthrough.md'; held — the player pauses here and asks Accept / Flag
- voiceover: "That is a deviation, said plainly: step five says below the player. But the record sheet rests over whatever sits below the player, so no one would find it there."
- duration: 9.53s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-deviation-plan-text.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: d2
- chose: Deviation from step 5: the plan text sits beside the stage when the window is wide, in the record otherwise (A3)
- instead_of: Step 5 as written: below the player
- why: The record sheet covers whatever sits below the player
- check: walkthrough.md · Deviations
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: beside the video, not below it.
keyMessage: That is a deviation, said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'deviation'): example lands, timed to the start of the word.
Scene 3 (on 'below'): instead lands, timed to the start of the word.
Scene 4 (on 'sheet'): chose lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 29 — Next: part 5

- scene: RAIL (full): slot 4 '1 call', slot 5 '1 + dev'; 'Next · Part 5'; hero 'Step 6, and its check'
- voiceover: "Next, part five: step five's last call, then step six and its check."
- duration: 4.58s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-closer-4.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 5.
keyMessage: Next, part five:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 30 — Part 5 of 6

- chapter_start: Step 6: every page checked
- scene: RAIL (full): kicker 'Part 5 of 6'; hero 'Plan beside, reported'; slot 6 lifts on 'check'
- voiceover: "Part five of six. The plan beside the video is reported. Now, one more call on it, then the check that opens every page."
- duration: 8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-opener-5.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 5 of 6.
keyMessage: Part five of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'check'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 31 — Call A8: the plan as written, not resolved

- scene: SPINE + PROTOTYPE: kicker 'Call A8 · Step 5'; spine tick 5 in ink; on the right, two files: plan.md (read) and plan.resolved.md (not read), the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'no review sections' under it; on 'plan' the card 'Chose · plan.md' (2 px ink border) lands in the left column; on 'resolved' the card 'Instead of · plan.resolved.md' lands at ink 55 %; under them the check chip 'scripts/plan-map.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The plan beside the video is read from plan dot M D, rather than the resolved plan, which appends review sections the page should not carry."
- duration: 8.71s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-call-a8.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a8
- chose: The plan beside the video reads plan.md, never plan.resolved.md
- instead_of: The resolved file when it exists
- why: The contract says plan.md; the resolved file appends review sections the page beside the video should not carry
- check: scripts/plan-map.mjs
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A8: the plan as written, not resolved.
keyMessage: The plan beside the video is read from plan dot M D, rather than the resolved plan, which appends review sections the page should not carry.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'plan'): chose lands, timed to the start of the word.
Scene 3 (on 'resolved'): instead lands, timed to the start of the word.
Scene 4 (on 'review'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 32 — Step 6: every page is opened before you see it

- scene: SPINE + TERMINAL: kicker 'Step 6 · Checked first'; a terminal card with this video's real run: on 'check' '$ reelplanning check-details walkthrough-video'; on 'stops' '✗ details/…: a <script src>' (a broken copy, dim); on 'seven' '✓ check-details: 7 page(s) ok'; on 'dark' the chip 'opened · light and dark'
- voiceover: "Step six: check details runs in finish project and in verify. A missing page, a network load, or a page without the bridge stops the build. This video's seven pages were each opened in Chromium, light and dark."
- duration: 13.73s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-step-6.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: the check, run on this video
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 6: every page is opened before you see it.
keyMessage: Step six:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'check'): l1 lands, timed to the start of the word.
Scene 3 (on 'stops'): l2 lands, timed to the start of the word.
Scene 4 (on 'seven'): l3 lands, timed to the start of the word.
Scene 5 (on 'dark'): chip lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 33 — Call A13: eight more ways fail the build

- scene: SPINE + PROTOTYPE: kicker 'Call A13 · Step 6'; spine tick 6 in ink; on the right, a terminal: check-details failing a page whose bridge never answers a click, the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'no anchor → fail' under it; on 'eight' the card 'Chose · 8 more ways fail' (2 px ink border) lands in the left column; on 'named' the card 'Instead of · Only the named 4' lands at ink 55 %; under them the check chip 'scripts/check-details.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The check fails on eight more ways a page breaks than the plan named, like a bridge that never answers a click. Every rule, fail or warn, with its reason, is one click away."
- duration: 10.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-call-a13.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a13
- chose: The check fails on eight more ways a page can break than the four named before the build (the detail lists every rule)
- instead_of: Only a missing page, a network load, missing bridge text, or a page error
- why: Each is a way the Open chip leads to a broken page; the last two test the bridge by running it, not by reading it
- check: scripts/check-details.mjs
- detail: check-rules
- detail_kind: table
- detail_title: Every rule the check applies
- detail_why: Every rule, fail or warn, with its reason, is one click away.
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A13: eight more ways fail the build.
keyMessage: The check fails on eight more ways a page breaks than the plan named, like a bridge that never answers a click.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'eight'): chose lands, timed to the start of the word.
Scene 3 (on 'named'): instead lands, timed to the start of the word.
Scene 4 (on 'bridge'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 34 — Call A14: no browser, static checks only

- scene: SPINE + PROTOTYPE: kicker 'Call A14 · Step 6'; spine tick 6 in ink; on the right, a terminal: '✓ check-details: 7 page(s) ok (not opened in a browser: playwright-core is not installed)', the part the call is about outlined coral (the frame's one coral), with the worked-example chip 'not opened in a browser' under it; on 'static' the card 'Chose · Static, and say so' (2 px ink border) lands in the left column; on 'failing' the card 'Instead of · Fail the build' lands at ink 55 %; under them the check chip 'scripts/check-details.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "Without a browser, the static checks still run and the result says the pages were not opened, rather than failing the build: under npx, the browser is not installed."
- duration: 10.12s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-call-a14.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a14
- chose: Without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened
- instead_of: Failing the build
- why: The contract says "when available"; under npx the dev dependency is not installed
- check: scripts/check-details.mjs
- focal: the call's two cards, and the part of the player it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A14: no browser, static checks only.
keyMessage: Without a browser, the static checks still run and the result says the pages were not opened, rather than failing the build:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'static'): chose lands, timed to the start of the word.
Scene 3 (on 'failing'): instead lands, timed to the start of the word.
Scene 4 (on 'npx'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 35 — Next: part 6

- scene: RAIL (full): slot 5 '2 + dev', slot 6 '2 calls'; 'Next · Part 6'; hero 'The code check, 42 calls'
- voiceover: "Next, the last part: the code check, the forty-two calls, and what ran."
- duration: 4.56s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-closer-5.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 6.
keyMessage: Next, the last part:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 36 — Part 6 of 6

- chapter_start: The code check, 42 calls, what ran
- scene: RAIL (full): kicker 'Part 6 of 6'; hero 'Every step, reported'
- voiceover: "Part six of six. Every step is reported. Last: what the code check found, and what forty-two calls says about the plan."
- duration: 7.88s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-opener-6.html
- type: branding
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 6 of 6.
keyMessage: Part six of six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 37 — The code check found a real bug

- scene: SPINE + PROTOTYPE: kicker 'The code check · Step 6'; the findings page (code-check/findings.md): 'Steps · 5 of 6 carried', 'Decisions · all 5 hold', 'Unexplained · 5'; on 'details' the row 'Step 6 · the plan video has no details' lands, answered 'this video carries them'; on 'bug' the row 'player.js:1198 · frame and step disagree' lands with a coral left rule; on 'fixed' the chip 'fixed · m27 · a new test'
- voiceover: "Then a fresh agent checked the code. It caught that this plan's own video has no details, so this one carries them; and a real bug: a comment in a page opened from the plan text pointed at the wrong frame. Now fixed. The finding, the fix and the new test are one click away."
- duration: 16.62s
- transition_in: crossfade
- status: animated
- src: compositions/frames/37-code-check.html
- type: benefit_highlight
- persuasion: Named result
- beat: Focus
- blueprint: compose
- plan_step: 6
- detail: code-check-bug
- detail_kind: fresh
- detail_title: The finding, the fix, the test
- detail_why: The finding, the fix and the new test are one click away.
- focal: the bug the check found
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: The code check found a real bug.
keyMessage: Then a fresh agent checked the code.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fresh'): page lands, timed to the start of the word.
Scene 3 (on 'details'): step6 lands, timed to the start of the word.
Scene 4 (on 'bug'): bug lands, timed to the start of the word.
Scene 5 (on 'fixed'): fixed lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 38 — 42 calls: the plan left too much open

- scene: SPINE + PROTOTYPE: kicker 'Too much left open'; the autonomy log as 42 short rows (A1 … A15, m1 … m27) in two columns; on 'Forty' the rows stagger in and a large '42' lands to the right; on 'dozen' a dashed coral rule draws under row 12 with 'about a dozen'; on 'filled', 'refuses' and 'goes' three chips land under the 42: 'how a page is filled', 'what the check refuses', 'where the plan text goes'
- voiceover: "Forty-two calls is far too many. Past about a dozen, the build rules say the plan left too much open, and it did: it never said how a page is filled, what the check refuses, or where the plan text goes."
- duration: 12.95s
- transition_in: crossfade
- status: animated
- src: compositions/frames/38-too-open.html
- type: pain_point
- persuasion: Said plainly
- beat: Focus
- blueprint: compose
- focal: the rows past the dozen line
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: 42 calls: the plan left too much open.
keyMessage: Forty-two calls is far too many.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Forty'): rows lands, timed to the start of the word.
Scene 3 (on 'dozen'): rule lands, timed to the start of the word.
Scene 4 (on 'filled'): g1 lands, timed to the start of the word.
Scene 5 (on 'refuses'): g2 lands, timed to the start of the word.
Scene 6 (on 'goes'): g3 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 39 — What ran

- scene: NO STAGE: kicker 'What ran'; three result cards land in turn: 'All pass · npm test', '6 · findings answered', '7 · pages opened'
- voiceover: "What ran: npm test passes, with the details checks in it. The code check ran, and every finding is answered. And check details opened this video's seven pages."
- duration: 10.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/39-ran.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- focal: the three results
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What ran.
keyMessage: What ran:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'npm'): r1 lands, timed to the start of the word.
Scene 3 (on 'code'): r2 lands, timed to the start of the word.
Scene 4 (on 'seven'): r3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 40 — What is not tested

- scene: NO STAGE: kicker 'Not tested'; a dashed card: 'A real review · this video is the first'; on 'bug' a second card: 'Found building it · fixed before it shipped' with its coral left rule
- voiceover: "Not tested: no reviewer has opened a detail in a real review yet; this video is the first. Building it found one bug: the review page was too narrow for the panel or the plan to sit beside the video, fixed before it shipped."
- duration: 14.25s
- transition_in: crossfade
- status: animated
- src: compositions/frames/40-untested.html
- type: pain_point
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the one gap
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What is not tested.
keyMessage: Not tested:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'reviewer'): u1 lands, timed to the start of the word.
Scene 3 (on 'bug'): u2 lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 41 — Flag a call, or accept

- scene: RAIL (full, centred) with every slot's tag; the mono line '15 calls · 2 deviations · accept or flag each'; a mono note 'AI-generated narration and visuals' bottom right; long still hold
- voiceover: "That is what landed: six steps, fifteen calls and two deviations to judge. Flag any call, draw on a step to ask for a change, or accept it."
- duration: 12s
- transition_in: crossfade
- status: animated
- src: compositions/frames/41-end.html
- type: cta
- persuasion: Resolved walkthrough + call to action
- beat: Resolve
- blueprint: compose
- focal: the whole walkthrough as a rail
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Flag a call, or accept.
keyMessage: That is what landed:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fifteen'): sum lands, timed to the start of the word.
Scene 3 (on 'Flag'): ask lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.
