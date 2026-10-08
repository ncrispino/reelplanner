---
title: "Resumable uploads for the media service"
format: 1920x1080
duration: 100s
message: "Uploads survive a server restart because the server records intent before the first byte"
arc: how-to-process
audience: the engineer reviewing this implementation plan before approving it
mode: autonomous
music: none
---

## Video direction

- palette system (from `frame.md`): cream ground, ink voice, coral as the single voltage per frame. The style guide's "one colour per component" is realised as **one fixed position + label per component** (the preset rations coral to one moment per frame), and the **signal** is that one coral moment: the active node's border/edge. Everything not active sits in ink on tile at ~45% opacity. Warm navy only for the two small code/table surfaces.
- the stage: ONE component diagram, built in frame 3 and reused unchanged in frames 4–12. Fixed positions on the right ~62% of the canvas: `sdk` (far left of the diagram), `api` (centre-left), `manifest` (upper right), `blob` (lower right), `billing` (far right, upper), `sweeper` (far right, lower). A **step rail** runs down the left ~34%: six slots, each filled with "N · title" when its step arrives and kept for every later frame (the persistent annotation anchors). Nothing on the diagram ever moves position; steps add edges, flip labels, and move the coral signal.
- motion grammar + reveal model: long-tail `power3` settles; every piece reveals on its spoken cue; edges draw on (`svg-path-draw`) when the VO names the interaction; the coral signal moves to the node the VO is naming at that instant (temporal contiguity). Last window of every frame is a held read; aliveness at most subtle jitter.
- rhythm / held frames: frames 3 (pre-training) and 12 (open questions) are the holds. Frame 12 holds still for ≥ 3 s with the full diagram and all six rail anchors visible.
- negative list: no narration text on screen; ≤ 8 new on-screen words per beat; no gradients, glows, drop shadows, tilt, bokeh, music; no whole-diagram reveal before frame 3 finishes; never two coral moments; no beat under 4 s.

## Frame 1 — The upload that dies at ninety percent

- scene: A wide progress bar climbs to 90%, snaps to 0%, and a "×2" bill stamps beside a second bar
- voiceover: "A two-gigabyte upload dies at ninety percent. Today it restarts from zero — and a racing retry bills the customer twice."
- duration: 8.597s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Stakes / consequence + Concretization
- beat: Recognition + concern
- blueprint: kinetic-type-beats
- focal: the progress bar that dies
- roles: progress bar = foreground subject · "×2 billed" number-lockup = supporting · cream ground = background
- sfx: none

narrativeRole: Opens the gap with the concrete failure and its cost, in outcome language.
keyMessage: Interrupted uploads currently restart from zero and can bill twice.

Adapt (kinetic-type-beats, Hook escalation): keep the beat-by-beat build and spring-pop payoff; the beats are a bar, a reset, and a serif figure.
Scene 1 (0.0–2.4s): cream ground; ✱ kicker "UPLOAD · 2 GB" top-left; a hairline bar fills to 90% (`stat-bars-and-fills`) with a mono "90%" ticking as the VO says "ninety percent". Full-width strip, upper third.
Scene 2 (2.4–4.6s): on "restarts from zero" the fill snaps to 0% and the label swaps (hard state swap); a second bar slides in beneath and starts filling.
Scene 3 (4.6–7.0s): on "twice" an EB Garamond `number-hero` "×2" + mono "billed" spring-pops right of the bars (`spring-pop-entrance`, smooth) with the coral ✱ — the frame's one coral. Hold.

## Frame 2 — The fix you'd reach for

- scene: "Retry loop · client" card; three consequences land and get struck through; "so: server-side" lands last
- voiceover: "The fix you'd reach for is a client retry loop. But that throws away the bytes already on the server, double-charges, and hides the failure."
- duration: 9.387s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-tension.html
- type: pain_point
- persuasion: Common-belief vs reality + Counterexample
- beat: Skepticism
- blueprint: kinetic-type-beats
- focal: the retry-loop card
- roles: retry-loop card = foreground subject · three struck consequences = supporting · cream ground = background
- sfx: none

narrativeRole: Names the reviewer's default approach and shows it break — misconception first.
keyMessage: Client-side retry loses state, double-charges, and hides the failure; the fix must be server-side.

Adapt (kinetic-type-beats, Problem): pain lines land one at a time under a fixed card rather than replacing each other.
Scene 1 (0.0–2.2s): `card-hairline` "Retry loop · client SDK" slides up into the upper-left (`spring-pop-entrance`) on "retry loop". Asymmetric 40/60.
Scene 2 (2.2–7.6s): three short lines reveal in the right column on cue — "loses partial state" on "throws away", "double-charges" on "double-charges", "server never knows" on "hides the failure" (per-word staggered reveal); each gets a coral strike drawn on a beat later (`css-marker-patterns`) — the strikes share the frame's one coral.
Scene 3 (7.6–9.0s): held read; the card dims to ~40% opacity.

## Frame 3 — Six pieces

- scene: The component diagram assembles node by node on the right; the empty six-slot step rail appears on the left
- voiceover: "Six pieces: the client SDK, the upload API, a new manifest store, the blob store, the billing hook, and a sweeper."
- duration: 8.299s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-pretrain.html
- type: product_intro
- persuasion: Frame-then-fill + Signposting
- beat: Orientation
- blueprint: grid-card-assemble
- focal: the six component nodes
- roles: component nodes = foreground subject · empty step rail = supporting · cream ground = background
- sfx: none

narrativeRole: Pre-training: names every component before any step animates an interaction between them.
keyMessage: These six components are the whole cast; everything after is edges between them.

Adapt (grid-card-assemble, Key_Feature grid): keep the stagger-assemble-into-slot signature; the "grid" is the fixed diagram layout, one node per spoken name.
Scene 1 (0.0–1.0s): cream ground; the step rail's six faint slot rules fade in on the left 34% (labelled only with mono "1"–"6"); ✱ kicker "SIX PIECES" above the diagram region. Asymmetric 34/66.
Scene 2 (1.0–6.0s): six `card-hairline` nodes (Inter card-title + a mono sub-label) assemble into their fixed positions one per cue (`center-outward-expansion`, short path from just outside their slot): SDK on "client SDK", API on "upload API", Manifest (navy `code-surface` chip) on "manifest store", Blob on "blob store", Billing on "billing hook", Sweeper on "a sweeper". The node being named carries the coral border for the instant it is named, then settles to ink — one signal at a time.
Scene 3 (6.0–7.0s): held read of the full cast, all nodes at ~45% opacity, no edges yet.

## Frame 4 — Step 1: write the manifest first

- scene: Rail slot 1 fills; on the diagram an edge API → Manifest draws and the manifest chip shows a new row
- voiceover: "Step one — the manifest. Before the API accepts a single byte, it writes a manifest row. A crash anywhere later leaves a record."
- duration: 9.472s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Progressive disclosure + Causal chain
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- focal: the API → Manifest edge
- roles: step rail (slot 1 filled) = foreground anchor · diagram with one lit edge = foreground subject · other nodes dimmed = supporting · cream ground = background
- sfx: none

narrativeRole: First step on the shared stage; establishes write-ahead as an edge that exists before any data edge.
keyMessage: The manifest row exists before any byte is accepted.

Scene 1 (0.0–1.4s): the stage from frame 3 (rail + dimmed diagram) is already on screen; on "Step one" rail slot 1 fills with "1 · Write-ahead manifest" (`spring-pop-entrance`, smooth) and the coral signal lands on the Manifest node's border.
Scene 2 (1.4–5.6s): on "Before the API accepts" the API node lifts to full opacity; on "writes a manifest row" an edge API → Manifest draws on (`svg-path-draw`) and a one-line mono row `7f3a · 2 GB · 000000` types into the manifest chip (`discrete-text-sequence`). The coral moves from Manifest's border to the drawn edge — still one coral.
Scene 3 (5.6–9.0s): on "leaves a record" a small mono `✓ record` tag fades in beside the row; hold with the edge lit and everything else dimmed.

## Frame 5 — Step 2: chunked, idempotent parts

- scene: Rail slot 2 fills; edge API → Blob draws; six part boxes fill and the manifest bitmap flips a bit per part; a repeated PUT is a no-op
- voiceover: "Step two — parts. Each PUT lands one chunk in the blob store and flips one bit in the manifest, same transaction. Re-sending a done part changes nothing."
- duration: 10.496s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/05-step-2.html
- type: feature_showcase
- persuasion: Progressive disclosure + Demonstration
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- focal: the API → Blob edge and the bitmap
- roles: step rail (slots 1–2) = foreground anchor · diagram = foreground subject · part boxes under Blob = supporting · cream ground = background
- sfx: none

narrativeRole: Second step; the part is the unit of resumption and re-sending is safe.
keyMessage: Parts are idempotent: a bit flips once per part, and re-sends change nothing.

Scene 1 (0.0–1.2s): rail slot 2 fills with "2 · Chunked parts" on "Step two"; the frame-4 edge stays but dims; coral lands on the Blob node.
Scene 2 (1.2–6.4s): on "lands one chunk" an edge API → Blob draws (`svg-path-draw`) and a row of six hairline part boxes under Blob fills box 1 (`stat-bars-and-fills`, scaleX); on "flips one bit" the manifest row's bitmap flips `000000 → 100000` (`discrete-text-sequence`); boxes 2 and 3 fill with their bits on the same cadence. Coral rides the API → Blob edge.
Scene 3 (6.4–10.0s): on "Re-sending a done part" a mono `PUT /parts/1` chip slides to box 1 and stops with a small `200` badge; the bitmap does not change; hold.

## Frame 6 — Step 3: resume

- scene: Rail slot 3 fills; edge SDK → API draws; the API answers with the bitmap; complete closes the upload
- voiceover: "Step three — resume. The client asks the API which bits are set; complete verifies them all and closes the multipart upload."
- duration: 9.088s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/06-step-3.html
- type: feature_showcase
- persuasion: Progressive disclosure + Question→answer pairing
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- focal: the SDK ⇄ API exchange
- roles: step rail (slots 1–3) = foreground anchor · diagram = foreground subject · request/response mono lines = supporting · cream ground = background
- sfx: none

narrativeRole: Third step; server truth drives client resumption.
keyMessage: The server, not the client, knows which parts landed.

Scene 1 (0.0–1.2s): rail slot 3 fills with "3 · Resume endpoint" on "Step three"; prior edges dim; coral lands on the SDK node.
Scene 2 (1.2–5.2s): on "asks the API" an edge SDK → API draws (`svg-path-draw`) with a mono `GET /uploads/7f3a` riding above it; on "which bits are set" the reply `111011` fades in under the edge, its 0 boxed (`css-marker-patterns`) — the box is the coral now.
Scene 3 (5.2–9.0s): on "complete verifies" a second mono line `POST /complete` types in and the bitmap's 0 flips to 1; on "closes the multipart upload" the Blob node shows a small `✓ closed` tag; hold.

## Frame 7 — Step 4: bill on completion, once

- scene: Rail slot 4 fills; edge API → Billing draws; a stamp fires once; a second complete call shows completed_at and no stamp
- voiceover: "Step four — billing moves to complete, keyed on the manifest id. A second call sees completed at and does nothing. That's the double-charge gone."
- duration: 9.792s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/07-step-4.html
- type: feature_showcase
- persuasion: Progressive disclosure + Counterexample + Callback
- beat: Aha
- blueprint: compose
- plan_step: 4
- focal: the API → Billing edge and the single stamp
- roles: step rail (slots 1–4) = foreground anchor · diagram = foreground subject · BILLED stamp = supporting · cream ground = background
- sfx: none

narrativeRole: Fourth step; resolves the hook's double-charge on the same stage.
keyMessage: Billing fires exactly once per manifest, keyed on its id.

Scene 1 (0.0–1.4s): rail slot 4 fills with "4 · Billing on complete" on "Step four"; coral lands on the Billing node.
Scene 2 (1.4–5.4s): on "moves to complete" an edge API → Billing draws (`svg-path-draw`) labelled mono `manifest 7f3a`; on "keyed on the manifest id" a coral "BILLED" stamp spring-pops beside Billing (`spring-pop-entrance`) — the stamp is the frame's coral, the edge settles to ink.
Scene 3 (5.4–10.0s): on "A second call" a mono `POST /complete` line types in at the API node; on "sees completed at" `completed_at 12:04:31 → no-op` fades in beneath it and the empty slot for a second stamp stays empty; on "double-charge gone" a faint mono `×2` under Billing gets a hairline strike; hold.

## Frame 8 — Step 5: the sweeper

- scene: Rail slot 5 fills; edge Sweeper → Manifest and Sweeper → Blob draw; a stale manifest row flips to abandoned and its parts fade
- voiceover: "Step five — the sweeper. Manifests a day old with no completion get aborted, their parts deleted. That's the storage leak closed."
- duration: 8.853s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/08-step-5.html
- type: feature_showcase
- persuasion: Progressive disclosure + Causal chain
- beat: Foresight
- blueprint: compose
- plan_step: 5
- focal: the Sweeper node and its two edges
- roles: step rail (slots 1–5) = foreground anchor · diagram = foreground subject · stale row + parts = supporting · cream ground = background
- sfx: none

narrativeRole: Fifth step; closes the storage leak the earlier steps would open.
keyMessage: Abandoned uploads are cleaned within a day; the sweeper bounds manifest growth.

Scene 1 (0.0–1.2s): rail slot 5 fills with "5 · Sweeper" on "Step five"; coral lands on the Sweeper node.
Scene 2 (1.2–5.6s): on "a day old" a second manifest row `2c91 · 26h · ∅` types into the manifest chip; on "get aborted" an edge Sweeper → Manifest draws and the row's status swaps to `abandoned` (`discrete-text-sequence`) in coral (the coral moves to that word); on "parts deleted" an edge Sweeper → Blob draws and three small part boxes under Blob fade to 20%.
Scene 3 (5.6–9.0s): on "storage leak closed" a small mono `bounded` tag fades in under the manifest chip; hold.

## Frame 9 — Step 6: the SDK resumes

- scene: Rail slot 6 fills; the SDK node shows a saved upload id; it asks, receives the bitmap, and sends one part along SDK → API → Blob
- voiceover: "Step six — the SDK keeps its upload id, asks what's missing, and sends only those parts."
- duration: 6.869s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/09-step-6.html
- type: feature_showcase
- persuasion: Progressive disclosure
- beat: Momentum
- blueprint: compose
- plan_step: 6
- focal: the single part travelling SDK → API → Blob
- roles: step rail (all six slots) = foreground anchor · diagram = foreground subject · saved-id chip = supporting · cream ground = background
- sfx: none

narrativeRole: Sixth step; the client half of the contract, completing the rail.
keyMessage: The client only ever sends the missing parts.

Scene 1 (0.0–1.0s): rail slot 6 fills with "6 · SDK resume" on "Step six"; coral lands on the SDK node.
Scene 2 (1.0–4.4s): on "keeps its upload id" a mono chip `upload id 7f3a · saved` fades in inside the SDK node; on "asks what's missing" the SDK → API edge lights and `111011` appears with its 0 boxed in coral.
Scene 3 (4.4–7.0s): on "sends only those parts" one part box travels along SDK → API → Blob (`viewport-change` is NOT used; the box is a translated element on the edge path) and the bitmap flips to `111111`; hold.

## Frame 10 — Same crash, now it resumes

- scene: The hook's progress bar returns above the diagram, dies at 90%, resumes from 90% to 100%; "×1" stamps once
- voiceover: "Same crash at ninety percent. Now the client resumes from ninety, and billing fires once."
- duration: 6.379s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-callback.html
- type: benefit_highlight
- persuasion: Callback + Before/after
- beat: Satisfaction
- blueprint: compose
- focal: the resumed progress bar
- roles: progress bar (over the diagram) = foreground subject · dimmed diagram + full rail = supporting · cream ground = background
- sfx: none

narrativeRole: Returns to the hook's failure on the same stage and shows the six steps resolving it.
keyMessage: A restart-from-zero became a resume-from-ninety, billed once.

Scene 1 (0.0–2.2s): the diagram and full rail stay at ~35% opacity; the frame-1 bar fades in across the top of the diagram region and fills to 90% (`stat-bars-and-fills`), stopping on "ninety percent"; a mono `manifest ✓` tag beside it.
Scene 2 (2.2–4.8s): on "resumes from ninety" the bar continues from 90% to 100% with no reset; the SDK → API → Blob path on the dimmed diagram lights briefly in ink.
Scene 3 (4.8–7.0s): on "fires once" an EB Garamond `number-hero` "×1" + mono "billed" spring-pops right of the bar with the coral ✱ (the one coral); hold.

## Frame 11 — Two things to watch

- scene: Two hairline cards over the dimmed diagram, each pinned to a node: manifest growth (Sweeper), old SDKs never resume (SDK)
- voiceover: "Two things to watch: the sweeper is the only bound on manifest growth, and old SDKs work but never resume."
- duration: 7.787s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-risks.html
- type: social_proof
- persuasion: Numbered enumeration + Signposting
- beat: Unease (a caveat)
- blueprint: grid-card-assemble
- focal: the two risk cards
- roles: risk cards = foreground subject · dimmed diagram + rail = supporting · cream ground = background
- sfx: none

narrativeRole: Names what could still go wrong, building trust before asking for a decision.
keyMessage: The plan has two known residual risks: unbounded growth if the sweeper is off, and no resume for old clients.

Adapt (grid-card-assemble, Benefits vertical-list BUILD): two cards build on cue and pin to their nodes; no clear-to-payoff.
Scene 1 (0.0–1.0s): ✱ kicker "TWO THINGS TO WATCH" fades in above the diagram on "Two things to watch".
Scene 2 (1.0–5.6s): on "only bound on manifest growth" a `card-hairline` "Manifest growth · bounded by the sweeper" pops in near the Sweeper node with a hairline leader line; on "old SDKs" a second card "Old SDKs never resume" pops in near the SDK node. The leader lines are the frame's coral.
Scene 3 (5.6–7.0s): held read.

## Frame 12 — Three calls for you

- scene: Full diagram and rail at full opacity; three question cards land, each pinned to rail slots 1, 4, 5; a final "draw on a step, or approve" line; long still hold
- voiceover: "Three calls for you. Step one: Postgres or S3 for the manifest? Step four: client idempotency keys now, or later? Step five: is twenty-four hours right? Draw on any step to leave a note, or approve."
- duration: 14.784s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-questions.html
- type: cta
- persuasion: Question→answer pairing + Signposting + Direct address
- beat: Resolve
- blueprint: grid-card-assemble
- plan_questions: 1,2,3
- focal: the three question cards pinned to rail slots 1, 4, 5
- roles: question cards = foreground subject · full rail + full diagram = foreground anchor · CTA line + AI-generated note = supporting · cream ground = background
- sfx: none

narrativeRole: Ends on the reviewer's three decisions, each pinned to its step, with an explicit call to action and a still hold for annotation.
keyMessage: Three specific decisions block approval; draw on the step or approve.

Adapt (grid-card-assemble, Benefits vertical-list BUILD): three cards build on cue next to their rail anchors; then a ≥ 3 s dead-still hold.
Scene 1 (0.0–1.2s): the rail and the diagram lift to full opacity; ✱ kicker "THREE CALLS FOR YOU" fades in on "Three calls for you". Asymmetric 34/66.
Scene 2 (1.2–8.6s): three `card-hairline` question cards pop in on cue, each with a hairline leader to its rail slot: "Postgres or S3?" → slot 1 on "Step one"; "Idempotency keys now?" → slot 4 on "Step four"; "Is 24h right?" → slot 5 on "Step five". The three small mono "STEP N" tags share the frame's coral.
Scene 3 (8.6–10.0s): on "Draw on any step" an Inter `lead` line "Draw on a step · or approve" fades in beneath the diagram; a mono `tag-upper` "AI-GENERATED NARRATION AND VISUALS" fades in at the safe-area bottom-right (above the caption band).
Scene 4 (10.0–13.0s): dead-still hold for annotation.
