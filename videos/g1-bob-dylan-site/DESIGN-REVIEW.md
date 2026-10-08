# Design review — g1-bob-dylan-site (round 1)

Judged against `docs/design-rationale.md` §2 and §4 and `skills/plan-to-video/references/style-guide.md` §10–§11, from `snapshots/contact-sheet-{1,2,3}.jpg` and six full frames. Frame numbers below are the storyboard's (Frame 1 = `01-hook`); snapshot files are zero-based (`frame-04-at-62.21s.png` is Frame 5).

## Verdict

This looks designed for a reason: the stage geometry never moves across frames 3–20, the palette is clean (cream, tile, ink, one dark tile, one coral, no gradient or glow anywhere), and the three type voices are doing their jobs, so the viewer learns the map once and reads captions as sentences. It drifts toward generated design in two places: coral is not scarce (every frame carries two to four coral marks: the caption underline, the ✱ spike, the stage's own signal, the A/B letters), and a layer of 16–22 px mono tags and 50 px pictograms sits under the nodes saying things the narration already says, in sizes nobody can read. The single biggest improvement is to make the stage honest and single-signal: decision frames must inherit exactly the edges the previous step drew (not the whole map), the Design edge must land on Generator instead of dangling between Generator and Hosting, and the caption underline and ✱ must go to ink so the one coral is the stage's.

Counts: 6 must · 6 should · 3 nit.

## Findings

### GRAMMAR (every frame that uses the stage; fix in `.hyperframes/stage-snippet.html`, `.hyperframes/caption-skin.html`, or the style guide)

1. **must — The Design → Generator edge ends in mid-air and reads as Design → Hosting.** Frames 5, 11, 14, 15, 16, 17, 19, 20. `FID-e-design-generator` is `M1770 590 L1770 450 L1660 450 L1660 380`: x 1660 is the 40 px gap between Generator (right edge 1640) and Hosting (left edge 1680), and y 380 is the bottom line of both. In Frame 14 the coral edge visibly goes from Design up to the corner of Hosting. Violates §2 "the diagram is the system" and §4.12. Fix: end the path inside Generator's bottom edge, e.g. `M1770 590 L1770 450 L1600 450 L1600 380` (Search → Generator uses x 1500, so 1600 is clear).

2. **must — Decision frames show the whole map before it has been drawn.** Frames 5, 11, 15 render all six edges at full ink; Frame 4 (the step before 5) shows no edges, Frames 6–7 show none again, Frame 14 shows three. So Search → Generator and Generator → Hosting appear at 62 s, vanish at 72 s, and are "drawn" at 205 s and 217 s. Violates §2 "a thing appears when it is named, never before" and §4.11 (reveal before its word; the diagram changes between frames). Fix: a decision or branch frame carries exactly the edge set of the preceding step frame (5/6/7: none; 11/12/13: Content → Data build, Data build → Generator; 15/16/17: those plus Design → Generator), all in dim ink, none coral.

3. **must — Coral is never one element.** Every frame with the stage has the caption's current-word underline (3 px #CC785C, `caption-skin.html` line 103) plus the stage's coral; kicker frames add the coral ✱ (1, 3, 5, 9, 11, 15, 20); decision frames add the #A5614A `A`/`B` letters. Frame 5 has four coral marks at once; Frame 15 has four. Violates §2 "one accent, one element at a time", §4.3, §4.11. Fix: caption current word = ink underline (`border-bottom: 3px solid var(--cap-ink)`; the ink/grey split already separates spoken from unspoken); ✱ spike in ink or dropped; option letters in ink. Coral is then only the lit node, edge, tag or recommended border, one per beat.

4. **must — Two-line captions run off the bottom of the frame.** Frame 7 ("With all forty albums first, the content step alone takes about a / month,") and Frame 10 ("Each page is plain HTML; a phone needs no JavaScript to read / it."). The band starts at y 900 with 180 px height; at 56 px EB Garamond two lines plus 22 + 26 px padding exceed it, and the card's bottom border is cut at 1080. Any clause over ~9 words wraps at 56 px. Violates §2 "readable at 40 px" (the size the ramp was built for) and §4.8. Fix in the caption skin: anchor the card's bottom at y 1040 and let it grow upward, and set the size to 44–48 px; or keep 56 px and split clauses at ≤ 9 words.

5. **must — Supporting mono text is 16–22 px and unreadable.** `.FID-opt .k` is 16 px (`A · RECOMMENDED`, `B`), `.FID-slot .d` is 20 px (`TEN`, `ALL 40`, `Ten albums`), count tags (`40 · 400 · 30`), `≈ 2 weeks`, `serif · margins`, `1 template` are ~22 px. `frame.md` sets `mono-label` at 26 px and `kicker` at 28 px. In a 960-wide player these tags are 8–11 px. Violates §2 (mono is "the exact values", they must be legible) and §4.7 (a size below the ramp). Fix: no supporting mono below 26 px; and drop the word `RECOMMENDED` from card A, since §2 says the border is the only signal (keep `A` / `B` at 26 px if the player refers to options by letter).

6. **must — "YOUR CALL" is banned wording.** Frames 5, 11, 15 kickers read `✱ YOUR CALL · STEP n`. Style guide §11 lists "your call" first among mannered phrases. Fix: `CHOICE 1 · STEP 1`, `CHOICE 2 · STEP 3`, `CHOICE 3 · STEP 4`.

7. **should — Nodes carry lists inside them and grow.** Frames 4, 8, 10, 12, 13, 19. Frame 4 puts `album · title year type label tracks` and `song → album` inside Content and the node grows from 110 to ~200 px; Frame 10 adds `era · album / song · timeline` inside Generator and the "Generator" title shifts up ~30 px (it is flex-centred), so it no longer aligns with "Hosting"; Frame 8 puts nine words (`site.json`, `song → album → era`) under Data build. Violates §10 "a node is a title, nothing else", §2 "≤ 5 new on-screen words per beat", §4.11 "a node that moves". The stage-snippet comment (line 43) blesses this and should be corrected. Fix: node height and label position are fixed; the one worked example per beat is a single chip of ≤ 5 words at a fixed offset below the node (the `site.json` chip position is right); `song → album → era` becomes `song → album` or goes to narration.

8. **should — Choice tags change case and wording between branch and resolved frames.** Frames 6, 7, 12, 13, 16, 17 use uppercase `TEN`, `ALL 40`, `TIMELINE`, `NO TIMELINE`, `BOOK`, `MAGAZINE`; Frame 20 uses `Ten albums`, `Timeline`, `Book-like`. Same choice, two spellings; uppercase mono shouts against the sentence-case display `frame.md` asks for. Violates §4.12 (no reason for the difference). Fix: sentence case everywhere and the same words in both places: `Ten albums` / `All 40 albums`, `Timeline` / `No timeline`, `Book-like` / `Magazine`.

### FRAME (one frame)

9. **should — Frame 6: the Content node is dimmed in the frame that is about it.** Content renders grey (navy at 0.72) in Frame 6 but full in Frames 5 and 7, which are the same step-1 context. Violates §2 "a step lights its slot and its part". Fix: Content at full opacity in Frame 6, as in 7.

10. **should — Frame 15: the cost line sits above the card, not under it.** `serif · margins` is at y 745, above card A (770–870); Frame 5 puts `≈ 2 weeks` under card A at y 886 and Frame 11 puts `1 template` under. Violates §2 "positions never change" for the decision template. Fix: under the card at y 886 like the other two.

11. **should — Frames 14 and 16: pictograms where a word would do.** Two hairline icons (a lined column 50 × 70 px and an empty rectangle 110 × 70) under Design in Frame 14; in Frame 16 the column becomes a solid ink block ~24 × 40 px. At 1080p they are unreadable and read as decoration. Violates §4.4. Fix: two 26 px mono chips `reading column` and `track table` under the Design node; on Frame 16 the chosen chip gets the coral border (that frame's one coral) instead of a filled bar.

12. **should — Frame 20: three coral tags at once and a lead line that repeats the caption.** `Ten albums`, `Timeline`, `Book-like` are all #A5614A at once, and the serif lead `Draw on a step · or approve` (y 820) paraphrases the narration sentence that is in the caption below it. Violates §4.3 and §4.11 (on-screen text that is a narration sentence). Fix: the three tags in ink (they are the record, not the signal; the branch frames keep their single coral tag); keep the lead only if it must persist while the player is paused, and then as the two verbs the buttons use. Also check that the mono `AI-GENERATED NARRATION AND VISUALS` note from the storyboard renders; it is not visible at 226.6 s.

13. **nit — Frame 3: the `2 / 6` counter (top right, ~20 px mono) labels what the diagram already shows.** Violates §4.6. Fix: remove `f03-cast-count`.

14. **nit — Frame 6: a calendar glyph before `2 weeks`.** A ~14 px icon next to a mono tag. Violates §4.4. Fix: the tag alone, at 26 px.

15. **nit — Frame 2: five page pictograms inside the "Template site" card, under a mono line that already says `five pages`.** One of the two is redundant (§4.6, §4.4). Fix: keep the mono line, drop the icons.

## Working — do not "improve" these away

- **The stage geometry is law and it holds.** Rail at x 80–580, slots 90 px on a 110 px pitch; Content at (700, 430), Data build (1030, 430), Generator (1360, 230), Search (1360, 590), Hosting (1680, 230), Design (1680, 590). Measured identical in Frames 3, 4, 5, 8, 14, 15, 20. Nodes ≥ 270 px, diagram ≈ 60 % of the width, stage vertically centred in the top 83 %. Keep the coordinates as they are; fix edges, not nodes.
- **The palette is clean.** Cream ground, tile nodes, ink text, one dark tile (Content, #181715) that the eye finds first, one coral. No gradient, glow, blur, tilt or heavy shadow anywhere; the hairline card shadow is the only elevation. Empty rail slots as dashed hairlines are exactly right.
- **Three voices.** EB Garamond captions at reading size, Inter node and slot labels at 30–32 px, JetBrains Mono for values, ids and tags. Keep the split; only the mono size needs raising (finding 5).
- **Captions are the script's sentences,** with spoken words in ink, upcoming words in grey and the current word marked. Keep the ink/grey progression; only the underline colour changes (finding 3) and the band anchoring (finding 4).
- **Reveal on the word is disciplined.** Every mid-beat snapshot shows only what has been named so far (Frame 2 has one struck line, Frame 4 has `10 albums` but not yet `40 · 30`, Frame 11 has card A but not B). Do not front-load to "fill" the frames.
- **Decision beats are on the map.** Cards are plain, 540 px, aligned to the diagram's edges (700–1240, 1320–1860), the recommended one bordered; the lit slot and node stay lit. The quiz card marks no option. Keep this shape.
- **Why-nots as strikes** (`CMS`, `in templates`, `Next.js`, `UI kit`, `search service`) and choice tags on the rail slot as the record of a decision are the right idiom; keep them (with the case fix in finding 8).
- **The hook** (`40` / `600` in serif with mono units and one hairline between) is the one centred frame and earns it.

## Note outside the design remit

The storyboard's `duration: 190s` and per-frame timings do not match the snapshots, which run to 226.6 s (the ×1.25 speed-up is not reflected, or durations were re-timed). Chapters are now ~75 s rather than "about a minute" (§2). Worth reconciling before the next cue pass; it does not change any finding above.

## Round 2

Judged against the same law (`docs/design-rationale.md` §2 and §4) plus the round-1 fix rules in `.hyperframes/dispatch-fix.md`, from the regenerated `snapshots/contact-sheet-{1,2,3}.jpg` and eight full frames (`frame-01`, `-02`, `-05`, `-06`, `-07`, `-09`, `-13`, `-19`), with source checks where a midpoint snapshot cannot show a thing (font sizes, coral hand-offs, edge lengths). Frame numbers are the storyboard's; snapshot files are zero-based. Sheet 3 carries Frame 20 twice (226.57 s and an end snapshot at 224.627 s).

### Round-1 findings

| # | Status | Evidence |
|---|---|---|
| 1 | **closed** | Frames 14 and 20: the Design → Generator edge now runs `1770 590 → 1770 450 → 1600 450 → 1600 380` and lands on Generator's bottom edge, 100 px right of the Search → Generator edge (frame-13, frame-19). No edge dangles in the gap. |
| 2 | **closed** | Frame 5 shows no edges; Frame 11 shows only Content → Data build and Data build → Generator, both dim; Frame 15 those plus Design → Generator, dim; Frame 18 adds Data build → Search (dim) and Search → Generator (drawing); Frame 19 adds Generator → Hosting; Frame 20 shows all six in full ink. Nothing appears before its step. |
| 3 | **closed** | The caption's current word is underlined in ink in every frame (`caption-skin.html` line 103); the ✱ kicker mark is ink in Frames 1, 3, 5, 9, 11, 15, 20; `A`/`B` are ink-55 %. Per frame the one coral is: 3 Data build border, 4 Content ring, 5/11/15 card A border, 6/7/12/13/16/17 the slot tag, 8/10/14/19 the drawing edge, 9 Data build border, 18 the edge stub, 20 none. The timelines hand off rather than stack (8: node → edge → stamp; 10: edge → `no JS`; 18: ring → edge → edge; 19: ring → edge → `+1 file`). |
| 4 | **closed** | The band is now 880–1040 with the card's bottom at 1040 and 46 px type (`caption-skin.html` lines 51, 87). Frame 7's "With all forty albums first, the content step alone takes about a month," and Frame 10's "Each page is plain HTML; a phone needs no JavaScript to read it." each fit on one line with the card fully inside the frame (frame-06, frame-09). |
| 5 | **closed** | No `font-size` under 26 px in any of the 20 frames or the skin (grep); slot tags, chips, cost lines and the `A`/`B` letters are 26 px, kickers 28 px. Frame 6's `10 · 40 · 30`, Frame 8's `site.json`, Frame 14's `reading column` are legible at contact-sheet size. `RECOMMENDED` is gone from card A (Frames 5, 11, 15). |
| 6 | **closed** | Frames 5, 11, 15 read `✱ CHOICE 1 · STEP 1`, `✱ CHOICE 2 · STEP 3`, `✱ CHOICE 3 · STEP 4`. |
| 7 | **closed** | Frame 4: Content is 270 × 110 with the `10` chip 16 px below it; Frame 8: Data build's title is centred with `site.json` / `song → album` below the node; Frame 10: Generator's title is centred at the same y as Hosting's with `era · album · song · timeline` below. Node boxes measure the same as in Frame 20 (frame-07, frame-09, frame-19). |
| 8 | **partly** | Sentence case everywhere and the same words in branch and resolved frames for `Ten albums` (6, 20), `Timeline` / `No timeline` (12, 13, 20), `Book-like` / `Magazine` (16, 17, 20). Frame 7 reads `40 albums`, not the agreed `All 40 albums` (frame-06, `07-branch-1b.html` line 50). One word; fix in round 3. |
| 9 | **closed** | Frame 6: Content is full ink (#181715), the same as Frames 5 and 7, where Frame 8 onward shows the dim grey (frame-05 vs frame-07). |
| 10 | **closed** | Frame 15: `serif · margins` sits under card A at the same offset as `≈ 2 weeks` (Frame 5) and `1 template` (Frame 11). |
| 11 | **closed** | Frame 14: a single `reading column` chip under Design; Frame 16: `reading column` (ink border, the chosen one) and `track table`. No column or rectangle drawings anywhere (frame-13, sheet 2 tile 7). |
| 12 | **closed** | Frame 20: `Ten albums`, `Timeline`, `Book-like` in ink mono; the `Draw on a step · or approve` lead is gone; `AI-generated narration and visuals` renders at 26 px ink-55 % at about (1275, 860) (frame-19). |
| 13 | **closed** | Frame 3: no `2 / 6` counter (frame-02). |
| 14 | **closed** | Frame 6: `2 weeks` is the word alone, no glyph (frame-05). |
| 15 | **closed** | Frame 2: the five page icons are gone; `five pages` is a 26 px mono line under the title (frame-01). |

Counts: 14 closed · 1 partly · 0 open.

### Regressions

None against the "working" list. Stage geometry is identical in every full frame read (Content 700/430 270 × 110, Data build 1030/430, Generator 1360/230 280 × 150, Search 1360/590, Hosting 1680/230 180 × 150, Design 1680/590); the palette is still cream, tile, ink, one dark tile, one coral; the three voices hold; captions still progress ink/grey on the word; reveal discipline holds (Frame 11 has card A but not B, Frame 4 has `10` but not `40 · 30`); decision cards are still 540 px on the diagram's edges with the lit slot and node kept lit; strikes and slot tags remain the idiom; the hook is unchanged. Finding 16 below is new, not a regression of a listed item, though it most likely arrived with the round-1 edge re-route.

### New findings

16. **must — Frame 3: a stray edge fragment sits on the diagram before any edge is named.** frame-02 (29.28 s, about 6.9 s into the frame, cue "links them"): a 3 px vertical stroke at x 1599–1600, y 379–436, colour 84/84/82 on cream, which is ink at 0.72 opacity with round caps, i.e. exactly a `.f03-cast-edges path` at its drawn opacity. It is the last 56 px of `f03-cast-e-design-generator` (`… L1600 450 L1600 380`), visible while Generator, Search, Hosting and Design do not yet exist and Scene 3's edge draw (12.10 s) is five seconds away. The dasharray trick (`03-cast.html` lines 119–133: `strokeDasharray: len + " " + (len + 10)`, `strokeDashoffset: len + 5`, `opacity: 0.72` all set in the `from` state, which fromTo applies at build time) leaves the tail of this one path exposed. Violates §2 "a thing appears when it is named, never before", §4.11 (a reveal before its word), and it reads as a rendering error on the one frame that teaches the map. Fix: keep each path at `opacity: 0` (or `visibility: hidden`) until its own draw time and fade it in as the dash unwinds; do not rely on the dash pattern alone to hide a path. Take a snapshot between 25 and 34 s to confirm nothing is on the stage's right half before "generator" (7.01 s).

17. **should — Frame 8: a tilted "stamp" with a cross icon and a scale pop.** Not visible at the midpoint; from `08-step-2.html` lines 38–40, 77–81, 130–135: at 12.89 s ("fails") a `✕ build` element with a coral border, coral text and an 18 px SVG cross enters at `scale: 1.35, rotation: -5` and settles at `rotation: -5`, then bumps to 1.06 on "here". A 5° tilt is banned by §2 ("No gradients, glows, blur, tilt"), the cross is a glyph where a word would do (§4.4), and the pop-then-bump is motion that becomes the thing looked at (§2 motion row). The coral hand-off itself is correct (edge to ink at 12.89). Fix: a plain mono chip `build fails` in #A5614A text on tile with the hairline border, at the chip offset under Data build (it can replace `song → album` at that moment), entering with a 0.4 s power3 settle, no rotation, no icon, no second beat.

18. **should — Frame 2: the "Template site" card is half empty.** frame-01: the card is still 680 × 340 (`02-tension.html` lines 41–42), sized for the five page icons that finding 15 removed; its content ends at y 470 and the tile runs on to 630, so the lower half is blank paper inside a tile. Violates §4.8 (spacing by feel) and §4.12 (no reason for the height). Fix: let the card take its content height (44 + 94 + 16 + 26 + 44 ≈ 224 px) and keep its top at 290 so the hairline rule and the strike column do not move; or centre the card's two lines on the rule's midpoint.

19. **nit — Frames 4 and 6: the count chip is pre-sized for words that have not been spoken.** frame-03 (sheet 1 tile 4): the chip under Content is about 220 px wide and shows only `10`; frame-05: `10 · 40  · 30` has a wider gap before `· 30` because the hidden `+` (`06-branch-1a.html` line 68, opacity 0 at that moment) still takes its width. Fix: unspoken spans `display: none` until their cue (or tween the chip's width), so the chip is always exactly the words shown.

20. **nit — Frames 14 and 16: the Design chips are right-aligned, against the stated rule.** `.f14-step-4-chips` / `.f16-branch-3a-chips` are at `left: 1614`, i.e. flush to Design's right edge (1860), not its left edge (1680), because a left-aligned 250 px chip would leave the canvas. The exception is the right one; write it down (in `stage-snippet.html` or the style guide: "chips under the right column align to the node's right edge") so the two alignments are a rule and not a drift.

21. **nit — Chip discipline drifts in two places.** Frame 8 stacks two chips under Data build (`site.json`, `song → album`) and Frame 16 two under Design, where dispatch-fix says one chip per beat; and Frames 10/12's `era · album · song · timeline` (about 450 px) runs from Generator's left edge to under Hosting, so it reads as belonging to both nodes. Either write "at most two chips, each ≤ 3 words" into the style guide, or shorten (`4 page kinds`, and `site.json · song → album` as one chip).

22. **nit — Frames 6 and 7: the cost tag is a footnote, not a record.** `2 weeks` (Frame 6) and `1 month` (Frame 7, lands at 3.58 s) sit at (80, 812), 20 px under empty slot 6, 620 px away from slot 1 whose choice they price; in Frame 5 the same cost sits under the card it belongs to. Fix: put it with the tag it qualifies (`Ten albums · 2 weeks` in slot 1, four words) or as a second chip beside the counts under Content.

### Verdict

Round 3 is needed, but it is a targeted pass, not another rework: the grammar is now right and must not be touched. It must (a) hide the edge tail in Frame 3 until its draw (finding 16) and confirm with a snapshot at 25–34 s; (b) replace Frame 8's tilted stamp with a mono chip (17) and snapshot the frame at its "fails" cue (about 12.9 s in) to confirm one coral and no tilt; (c) fit Frame 2's card to its content (18); (d) change Frame 7's tag to `All 40 albums` (8). Nits 19–22 can ride along if the frame is open anyway; none of them blocks. With 16, 17, 18 and the word in 7 closed, the video is done from the design side.
