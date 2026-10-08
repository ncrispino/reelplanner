---
title: "Resumable uploads for the media service"
format: 1920x1080
duration: 120s
message: "Uploads survive a server restart because the server records intent before the first byte"
arc: how-to-process with decisions
audience: the engineer reviewing this implementation plan before approving it
mode: autonomous
music: none
plan_dir: eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume
---

## Video direction

- palette system (from `frame.md`): cream ground, ink voice, coral as the single signal per frame (the active node border, the active edge, the recommended option's border, or the ✱ kicker — never two at once). Tile half-step for cards; warm navy only for the manifest node.
- the stage: `.hyperframes/stage-snippet.html` (v2) — six-slot step rail on the left, a six-node component diagram filling the right 62 %, vertically centred. Built in frame 3, reused unchanged in frames 4–19. Node labels only; **no sub-labels, no file paths, no narration text**. ≤ 5 new on-screen words per beat beyond the persistent labels.
- decision beats: the stage stays, the affected rail slot and node are lit, and two option cards appear under the diagram (`.FID-opt`), the recommended one with the coral border. The narration ends on the ask; the player pauses there and asks the reviewer. Branch beats show the consequence on the same stage (a card line, an edge, a small tag) and nothing else.
- motion grammar: long-tail `power3`, reveal on the spoken cue, edges draw on when named, held read at the end of every frame; the final frame holds dead still ≥ 4 s.
- negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; nothing below y 900.

## Frame 1 — The upload that dies at 90 percent

- scene: One wide progress bar, centred in the frame, climbs to 90 % and snaps to 0 %; a large "×2" lands beside it
- voiceover: "A two-gigabyte upload fails at ninety percent. Today the client starts again from zero, and if it retries twice, we bill the customer twice."
- duration: 8.363s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- chapter_start: The problem and step 1
- type: hook
- persuasion: Stakes / consequence + Concretization
- beat: Recognition + concern
- blueprint: kinetic-type-beats
- focal: the progress bar
- roles: progress bar = foreground subject (centred, ~70 % width) · "×2" number-lockup = supporting · cream ground = background
- sfx: none

narrativeRole: Opens the gap with the concrete failure and its cost.
keyMessage: Interrupted uploads restart from zero and can bill twice.

Adapt (kinetic-type-beats): the beats are a bar, a reset, and a serif figure — centred, big, nothing else.
Scene 1 (0.0–2.6s): cream ground; ✱ kicker "2 GB UPLOAD" top-left. One hairline bar, centred at y≈470, ~1300 px wide, fills to 90 % (`stat-bars-and-fills`) with a mono "90%" at its right end. Centred, full-width strip.
Scene 2 (2.6–5.0s): on "restarts from zero" the fill snaps back to 0 % and the label swaps (hard state swap); the bar dims and a second bar starts filling just beneath it.
Scene 3 (5.0–8.0s): on "twice" an EB Garamond `number-hero` "×2" with mono "billed" spring-pops centred under the bars (`spring-pop-entrance`, smooth), coral ✱ beside it — the one coral. Hold.

## Frame 2 — The fix you'd reach for

- scene: One card "Retry loop" centred; three short consequences land beside it and get struck through
- voiceover: "The obvious fix is a retry loop in the client. That throws away the bytes the server already has, it can bill twice, and the server never learns the upload failed."
- duration: 9.301s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-tension.html
- type: pain_point
- persuasion: Common-belief vs reality + Counterexample
- beat: Skepticism
- blueprint: kinetic-type-beats
- focal: the retry-loop card
- roles: card = foreground subject (left-centre) · three struck lines = supporting (right) · cream ground = background
- sfx: none

narrativeRole: Names the reviewer's default and shows it break.
keyMessage: Client retry loses state, bills twice, hides the failure.

Adapt (kinetic-type-beats, Problem): consequences land one at a time next to a fixed card; total on-screen words: 2 + 3×2.
Scene 1 (0.0–2.0s): a `card-hairline` "Retry loop" (Inter card-title, ✱ kicker "THE OBVIOUS FIX" above it) slides up to x≈420–860, y≈400–560 (`spring-pop-entrance`). Split 40/60.
Scene 2 (2.0–7.4s): three two-word lines reveal at x≈1000, spaced 120 px from y≈380: "loses bytes" on "throws away", "bills twice" on "bills twice", "hides failure" on "hides the failure"; each gets a coral strike drawn on a beat later (`css-marker-patterns`) — the strikes are the one coral.
Scene 3 (7.4–9.0s): held read.

## Frame 3 — 6 pieces

- scene: The stage appears: empty rail on the left, six nodes assemble on the right, one per spoken name
- voiceover: "The plan has six parts: the client SDK, the upload API, a new manifest store, the blob store, billing, and a sweeper job."
- duration: 7.68s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-pretrain.html
- knowledge: new,familiar
- type: product_intro
- persuasion: Frame-then-fill + Signposting
- beat: Orientation
- blueprint: grid-card-assemble
- focal: the six nodes
- roles: nodes = foreground subject · empty rail = supporting · cream ground = background
- sfx: none

narrativeRole: Pre-training: the cast, named before any interaction.
keyMessage: Six components; everything after is edges between them.

Adapt (grid-card-assemble): stagger-assemble into fixed slots, one node per cue.
Scene 1 (0.0–0.8s): cream ground; the rail's six dashed slots fade in (numbers/titles hidden); ✱ kicker "SIX PIECES" at top of the diagram region.
Scene 2 (0.8–6.6s): nodes assemble on cue (`center-outward-expansion`, short path): SDK, API, Manifest, Blob, Billing, Sweeper; the node being named carries the coral border for that instant, then settles.
Scene 3 (6.6–8.0s): held read, all nodes at 0.72 opacity, no edges.

## Frame 4 — Step 1: write the manifest first

- scene: Rail slot 1 fills; edge API → Manifest draws; a one-line row appears inside the manifest node
- voiceover: "Step one. Before the API accepts any data, it writes one manifest row: upload 7f3a, two gigabytes, no parts yet. From then on, any crash leaves that row behind. Write it after part one instead, and a crash during part one leaves nothing."
- duration: 15.403s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Progressive disclosure + Counterexample (why-not)
- beat: Comprehension
- blueprint: compose
- plan_step: 1
- focal: the API → Manifest edge
- roles: rail (slot 1) = anchor · diagram = foreground subject · manifest row = supporting · cream ground = background
- sfx: none

narrativeRole: First step, with the why-not (write-after-first-part) in one clause.
keyMessage: The manifest row exists before any byte is accepted.

Scene 1 (0.0–1.2s): stage from frame 3 already on screen; on "Step one" slot 1 fills ("1 · Write-ahead manifest") and the coral lands on the Manifest node.
Scene 2 (1.2–5.2s): on "written before" the API node lifts to full opacity, the API → Manifest edge draws on (`svg-path-draw`) and takes the coral; a mono row `7f3a · 000000` types inside the manifest node (`discrete-text-sequence`).
Scene 3 (5.2–9.0s): on "Any later" a faint hairline "after part 1" ghost line under the edge appears and gets a small strike (the why-not, 3 words); hold.

## Frame 5 — Where does the manifest live?

- scene: Stage held; slot 1 and the Manifest node lit; two option cards appear under the diagram, Postgres with the coral border
- voiceover: "First choice: where does that row live? In a Postgres table, marking a part done is one transaction with the part write: both happen, or neither. In a JSON file in S3, each part needs a write, a check that the file did not change, and a retry. I recommend Postgres, because step two stays simple. Which do you want?"
- duration: 17.749s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-decision-1.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- decision: q1
- plan_step: 1
- question: Where does the manifest live?
- option_a: Postgres
- option_b: S3 object
- why_a: parts_done flips in the same transaction as the part write; one more table to migrate
- why_b: all upload state in one system; every part becomes an ETag-conditional write with retries, about a day more in step 2
- recommended: a
- focal: the two option cards
- roles: option cards = foreground subject · stage (slot 1 + Manifest lit) = anchor · cream ground = background
- sfx: none

narrativeRole: Teaches the first fork, costs both options, recommends, asks. The player pauses at the end of this frame.
keyMessage: Postgres keeps step 2 atomic; S3 keeps one system but adds conditional writes.

Adapt (comparison-split): two cards of equal weight, no tilt (preset forbids), the recommended one bordered coral.
Scene 1 (0.0–1.4s): stage held (rail slot 1 filled, Manifest node + API → Manifest edge lit, rest dim); on "Where does" a ✱ kicker "YOUR CALL · STEP 1" fades in above the diagram.
Scene 2 (1.4–8.6s): on "Postgres" option card A "Postgres" pops in at left:700 top:770 with the coral border (`spring-pop-entrance`); on "An S3 object" card B "S3 object" pops in at left:1320; on "conditional write" a tiny mono "+1 day" tag fades in under card B.
Scene 3 (8.6–13.0s): on "I'd pick Postgres" card A's border brightens once; on "your call" both cards hold; still to the end.

## Frame 6 — If Postgres

- scene: Stage; slot 1 gains a small "Postgres" tag; the manifest node shows a "txn" bracket around row + edge
- voiceover: "With Postgres, one part write is one transaction. The only new work is one database migration."
- duration: 6.037s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-branch-1a.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Clarity
- blueprint: compose
- branch: q1=a
- plan_step: 1
- focal: the "txn" bracket on the manifest node
- roles: stage = anchor · txn bracket + slot tag = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option A on the plan.
keyMessage: Postgres keeps step 2 atomic; cost is one migration.

Scene 1 (0.0–2.4s): stage held; on "With Postgres" slot 1 gains a coral mono tag "POSTGRES" at its right edge (the one coral).
Scene 2 (2.4–5.2s): on "one transaction per part" a hairline bracket labelled mono "txn" draws around the manifest row and the API → Manifest edge (`svg-path-draw`).
Scene 3 (5.2–7.0s): on "migration" a mono "+1 migration" tag fades in under the rail; hold.

## Frame 7 — If S3

- scene: Stage; slot 1 gains an "S3" tag; the manifest node turns to a cream object card; a retry loop arrow draws on the API → Manifest edge
- voiceover: "With S3, one part write becomes a write, a check, and a retry. Step two grows by about a day."
- duration: 5.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-branch-1b.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Unease (a cost)
- blueprint: compose
- branch: q1=b
- plan_step: 1
- focal: the retry loop on the edge
- roles: stage = anchor · loop arrow + slot tag = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option B on the plan.
keyMessage: S3 adds a conditional write and retries to step 2.

Scene 1 (0.0–2.2s): stage held; on "With S3" slot 1 gains a coral mono tag "S3" (the one coral); the manifest node swaps navy → cream (hard state swap) to read as an object, keeping its label.
Scene 2 (2.2–5.8s): on "conditional write" a small mono "if-match ETag" label appears on the API → Manifest edge; on "retry loop" a hairline loop arrow draws beside it (`svg-path-draw`).
Scene 3 (5.8–8.0s): on "a day" rail slot 2 (still dashed) shows a mono "+1 day" ghost tag; hold.

## Frame 8 — Step 2: chunked, idempotent parts

- scene: Slot 2 fills; edge API → Blob draws; six part boxes fill 1–3 as the bitmap flips; a re-sent part bounces off
- voiceover: "Step two. The file goes up in parts. Each PUT stores one part and flips one bit in the manifest, in one transaction. Send part one twice, and the second PUT sees the bit and does nothing. A byte-range resume would not work here: S3 cannot append to a file."
- duration: 15.211s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/08-step-2.html
- chapter_start: Steps 2 to 4
- type: feature_showcase
- persuasion: Progressive disclosure + Demonstration + why-not
- beat: Comprehension
- blueprint: compose
- plan_step: 2
- focal: the API → Blob edge and the part boxes
- roles: rail (slots 1–2) = anchor · diagram = foreground subject · part boxes + bitmap = supporting · cream ground = background
- sfx: none

narrativeRole: Second step; the part is the unit of resumption; why-not: range-resume.
keyMessage: Parts are idempotent; re-sends are safe.

Scene 1 (0.0–1.2s): stage (slot 1 filled dim, API → Manifest edge dim, manifest row `7f3a · 000000`); on "Step two" slot 2 fills; coral on the Blob node.
Scene 2 (1.2–6.4s): on "lands one chunk" the API → Blob edge draws and takes the coral; six 30×30 boxes under Blob appear and box 1 fills; on "flips one bit" the bitmap in the manifest row flips 000000 → 100000; boxes 2–3 follow; on "re-sends change nothing" a mono `PUT /parts/1` chip slides to box 1 and stops, bitmap unchanged.
Scene 3 (6.4–10.0s): on "Not a range-resume" a faint mono "range" ghost tag under the Blob node gets a small strike (why-not, 1 word); hold.

## Frame 9 — Step 3: resume

- scene: Slot 3 fills; edge SDK → API draws; the reply bitmap shows one 0; complete flips it and closes the upload
- voiceover: "Step three. After a crash, the client asks which bits are set. The API answers: one one one zero one one. Part four is missing. The client sends it, calls complete, and the API checks every bit before closing the upload. The server holds the truth, not the client."
- duration: 15.915s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/09-step-3.html
- type: feature_showcase
- persuasion: Progressive disclosure + Question→answer pairing + why-not
- beat: Comprehension
- blueprint: compose
- plan_step: 3
- focal: the SDK ⇄ API exchange
- roles: rail (slots 1–3) = anchor · diagram = foreground subject · bitmap reply = supporting · cream ground = background
- sfx: none

narrativeRole: Third step; server truth drives resumption; why-not: client memory.
keyMessage: The server, not the client, knows which parts landed.

Scene 1 (0.0–1.2s): stage (slots 1–2 filled dim; edges api→manifest, api→blob dim; row `7f3a · 111011`; boxes 1,2,3,5,6 filled); on "Step three" slot 3 fills; coral on the SDK node.
Scene 2 (1.2–5.6s): on "asks which bits" the SDK → API edge draws and takes the coral; the bitmap `111011` appears above the edge with the 0 boxed (`css-marker-patterns`) — the box becomes the coral; on "closes the upload" the 0 flips to 1, box 4 fills, a mono "closed" tag fades in at Blob.
Scene 3 (5.6–9.0s): on "not client memory" a faint mono "client memory" ghost under the SDK node gets a strike; hold.

## Frame 10 — Step 4: bill on completion, once

- scene: Slot 4 fills; edge API → Billing draws; one BILLED stamp; a second call shows no stamp
- voiceover: "Step four. Billing moves to the complete call, keyed by the manifest id. The first complete for 7f3a bills once. A second complete for 7f3a sees the completed timestamp and does nothing. That is how we stop billing twice."
- duration: 14.891s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/10-step-4.html
- type: feature_showcase
- persuasion: Progressive disclosure + Counterexample + Callback
- beat: Aha
- blueprint: compose
- plan_step: 4
- focal: the API → Billing edge and the single stamp
- roles: rail (slots 1–4) = anchor · diagram = foreground subject · BILLED stamp = supporting · cream ground = background
- sfx: none

narrativeRole: Fourth step; resolves the hook's double-charge.
keyMessage: Billing fires exactly once per manifest.

Scene 1 (0.0–1.4s): stage (slots 1–3 dim; three edges dim; row `7f3a · 111111`; six boxes filled); on "Step four" slot 4 fills; coral on Billing.
Scene 2 (1.4–5.4s): on "moves to complete" the API → Billing edge draws and takes the coral; on "manifest id" a coral "BILLED" stamp pops beside Billing (the coral moves to the stamp).
Scene 3 (5.4–10.0s): on "A second call" a second mono `complete` chip rises along the edge and stops; on "does nothing" the empty second-stamp slot stays empty and a mono "no-op" tag fades in; on "double-charge gone" a faint "×2" under Billing gets a strike; hold.

## Frame 11 — Who owns the idempotency key?

- scene: Stage held; slot 4 and Billing lit; two option cards: "Server id" (coral) and "Client key"
- voiceover: "Second choice: who owns the idempotency key? Say a client sends POST uploads, times out, and sends it again. With the server's manifest id, that makes two manifests, and the client pays once per file it completes. With a key the client makes and sends both times, the second POST is refused. But that needs a unique index, a 409 path, and a change in every SDK. For version one, I recommend the server id. Which do you want?"
- duration: 23.232s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-decision-2.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- decision: q2
- plan_step: 4
- question: Who owns the idempotency key?
- option_a: Server id
- option_b: Client key
- why_a: the manifest id is the key; no SDK change beyond step 6; a client that loses it starts over and pays once per completed file
- why_b: survives a client that retries POST /uploads itself; costs a (customer, key) unique index, a 409 path, and SDK changes in every language
- recommended: a
- focal: the two option cards
- roles: option cards = foreground subject · stage (slot 4 + Billing lit) = anchor · cream ground = background
- sfx: none

narrativeRole: Second fork: taught, costed, recommended, asked.
keyMessage: Server id is free for v1; a client key buys retry-safety at real cost.

Adapt (comparison-split): as frame 5.
Scene 1 (0.0–1.4s): stage held (slot 4 + Billing + API → Billing edge lit); ✱ kicker "YOUR CALL · STEP 4".
Scene 2 (1.4–9.4s): card A "Server id" pops in with the coral border on "server's manifest id"; card B "Client key" pops in on "A client key"; on "an index, a 409 path" a mono "+index · 409 · SDKs" tag fades in under card B.
Scene 3 (9.4–13.0s): on "For v1" card A brightens once; hold still.

## Frame 12 — If server id

- scene: Stage; slot 4 gains a "SERVER ID" tag; a "once per file" tag at Billing
- voiceover: "Server id: the only client change is step six. Each completed file is billed once."
- duration: 5.376s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-branch-2a.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Clarity
- blueprint: compose
- branch: q2=a
- plan_step: 4
- focal: the "once per file" tag at Billing
- roles: stage = anchor · tags = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option A.
keyMessage: No extra client work; billing once per completed file.

Scene 1 (0.0–2.2s): on "Server id" slot 4 gains a coral mono tag "SERVER ID" (the one coral).
Scene 2 (2.2–5.0s): on "step six is the only client change" rail slot 6 (dashed) lifts briefly to full opacity then settles.
Scene 3 (5.0–7.0s): on "once per completed file" a mono "1× per file" tag fades in under Billing; hold.

## Frame 13 — If client key

- scene: Stage; slot 4 gains a "CLIENT KEY" tag; the API node grows a "409" chip; slot 6 shows "+ every SDK"
- voiceover: "Client key: the API gains a unique index on customer and key, plus a 409 response, and every SDK must send the key."
- duration: 8.555s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-branch-2b.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Unease (a cost)
- blueprint: compose
- branch: q2=b
- plan_step: 4
- focal: the 409 chip on the API node
- roles: stage = anchor · chips + tags = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option B.
keyMessage: A client key adds API surface and SDK work.

Scene 1 (0.0–2.0s): on "Client key" slot 4 gains a coral mono tag "CLIENT KEY" (the one coral).
Scene 2 (2.0–5.4s): on "unique index" a mono "uniq(customer,key)" chip appears under the Manifest node; on "409 path" a mono "409" chip pops on the API node.
Scene 3 (5.4–8.0s): on "every SDK" rail slot 6 shows a ghost mono "+ every SDK"; hold.

## Frame 14 — Step 5: the sweeper

- scene: Slot 5 fills; edges Sweeper → Manifest and Sweeper → Blob draw; a stale row flips to abandoned; parts fade
- voiceover: "Step five. A job runs every hour and finds manifests older than a day with no completion. Manifest 2c91, twenty-six hours old: the job aborts its upload, deletes its parts, and marks it abandoned. An S3 lifecycle rule cannot do this; it never sees the manifest."
- duration: 17.429s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/14-step-5.html
- chapter_start: Steps 5 and 6, and the resolved plan
- type: feature_showcase
- persuasion: Progressive disclosure + why-not
- beat: Foresight
- blueprint: compose
- plan_step: 5
- focal: the Sweeper node and its two edges
- roles: rail (slots 1–5) = anchor · diagram = foreground subject · stale row = supporting · cream ground = background
- sfx: none

narrativeRole: Fifth step; closes the storage leak; why-not: lifecycle rules.
keyMessage: Abandoned uploads are cleaned within a day; only the sweeper sees manifests.

Scene 1 (0.0–1.2s): stage (slots 1–4 dim; four edges dim); on "Step five" slot 5 fills; coral on Sweeper.
Scene 2 (1.2–6.2s): on "a day old" a second row `2c91 · 26h` types under the first inside the manifest node; on "aborts" the Sweeper → Manifest edge draws and takes the coral and the row's tail swaps to coral "abandoned" (coral moves there); on "deletes their parts" the Sweeper → Blob edge draws and three part boxes fade to 0.72 with a hairline strike.
Scene 3 (6.2–10.0s): on "lifecycle rules can't" a faint mono "lifecycle" ghost under Blob gets a strike; hold.

## Frame 15 — How long before an upload is abandoned?

- scene: Stage held; slot 5 and Sweeper lit; two option cards: "24 hours" (coral) and "7 days"
- voiceover: "Third choice: how old is abandoned? At twenty-four hours, orphaned parts take at most one day of storage, and most phones on bad networks retry within hours. At seven days, a huge upload over a bad link still finishes, but each abandoned upload holds its parts for a week, and the hourly scan grows seven times. I recommend twenty-four hours. Which do you want?"
- duration: 20.949s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-decision-3.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- decision: q3
- plan_step: 5
- question: How long before an upload is abandoned?
- option_a: 24 hours
- option_b: 7 days
- why_a: bounds blob storage at one day of interrupted uploads; mobile clients on flaky networks almost always retry within hours
- why_b: safer for very large uploads over bad links; up to a week of orphaned parts per abandoned upload and a sweeper scan that grows with it
- recommended: a
- focal: the two option cards
- roles: option cards = foreground subject · stage (slot 5 + Sweeper lit) = anchor · cream ground = background
- sfx: none

narrativeRole: Third fork: taught, costed, recommended, asked.
keyMessage: A day bounds storage; a week protects huge uploads at a storage cost.

Adapt (comparison-split): as frame 5.
Scene 1 (0.0–1.4s): stage held (slot 5 + Sweeper + its edges lit); ✱ kicker "YOUR CALL · STEP 5".
Scene 2 (1.4–9.6s): card A "24 hours" pops in with the coral border on "A day"; card B "7 days" on "A week"; on "orphaned parts" a mono "×7 parts" tag under card B.
Scene 3 (9.6–13.0s): on "I'd take a day" card A brightens once; hold still.

## Frame 16 — If 24 hours

- scene: Stage; slot 5 gains a "24H" tag; a small ring around the Sweeper ticks one day
- voiceover: "Twenty-four hours: storage is bounded by one day of failed uploads, and the scan stays small."
- duration: 5.547s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-branch-3a.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Clarity
- blueprint: compose
- branch: q3=a
- plan_step: 5
- focal: the day ring at the Sweeper
- roles: stage = anchor · ring + tag = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option A.
keyMessage: Small scan, storage bounded to a day.

Scene 1 (0.0–2.0s): on "A day" slot 5 gains a coral mono tag "24H" (the one coral).
Scene 2 (2.0–5.0s): on "scan stays small" a hairline ring draws once around the Sweeper node (`svg-path-draw`).
Scene 3 (5.0–7.0s): on "one day of failures" a mono "≤ 1 day" tag under Blob; hold.

## Frame 17 — If 7 days

- scene: Stage; slot 5 gains a "7D" tag; the part boxes multiply into a longer faded row; a "×7" tag
- voiceover: "Seven days: a week-long upload survives, and abandoned parts stay seven times longer."
- duration: 5.12s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-branch-3b.html
- type: benefit_highlight
- persuasion: Causal chain
- beat: Unease (a cost)
- blueprint: compose
- branch: q3=b
- plan_step: 5
- focal: the multiplied part boxes
- roles: stage = anchor · extra boxes + tag = supporting · cream ground = background
- sfx: none

narrativeRole: Consequence of option B.
keyMessage: Safer for huge uploads; seven times the orphaned parts and scan.

Scene 1 (0.0–2.0s): on "A week" slot 5 gains a coral mono tag "7D" (the one coral).
Scene 2 (2.0–5.0s): on "huge uploads" the SDK → API edge lifts briefly; on "grows seven-fold" a second and third row of faded part boxes appear under the first (`center-outward-expansion`).
Scene 3 (5.0–7.0s): a mono "×7" tag under the Sweeper node; hold.

## Frame 18 — Step 6: the SDK resumes

- scene: Slot 6 fills; the SDK node shows a saved id; one part travels SDK → API → Blob; bitmap completes
- voiceover: "Step six. The SDK saves the upload id, 7f3a. After a reconnect it asks which bits are set and sends only part four."
- duration: 8.448s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/18-step-6.html
- type: feature_showcase
- persuasion: Progressive disclosure
- beat: Momentum
- blueprint: compose
- plan_step: 6
- focal: the single travelling part
- roles: rail (all six) = anchor · diagram = foreground subject · saved-id chip = supporting · cream ground = background
- sfx: none

narrativeRole: Sixth step; the client half; completes the rail.
keyMessage: The client only ever sends the missing parts.

Scene 1 (0.0–1.0s): stage (slots 1–5 dim; all edges dim; row `7f3a · 111011`; box 4 empty); on "Step six" slot 6 fills; coral on SDK.
Scene 2 (1.0–4.6s): on "keeps its upload id" a mono chip "id 7f3a" inside the SDK node; on "asks what's missing" the SDK → API edge takes the coral and `111011` shows with the 0 boxed.
Scene 3 (4.6–7.0s): on "sends only those parts" one 30×30 box travels SDK → API → Blob into the empty slot; bitmap → `111111`; hold.

## Frame 19 — The plan, resolved

- scene: Full stage at full opacity; the three decided slots show their chosen option as a small coral tag; a CTA line; long still hold
- voiceover: "That is the plan, with your three choices filled in. Draw on any step to ask for a change, or approve it."
- duration: 5.525s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-resolved.html
- type: cta
- persuasion: Distillation + Direct address
- beat: Resolve
- blueprint: titlecard-reveal
- plan_questions: 1,2,3
- focal: the full rail with its three decision tags
- roles: rail + diagram = foreground subject · CTA line + AI note = supporting · cream ground = background
- sfx: none

narrativeRole: The resolved plan, ready to approve. The player overwrites the three tags with the reviewer's actual choices.
keyMessage: Every step and every decision on one screen; approve or annotate.

Reproduce (titlecard-reveal): one restrained move, then stillness.
Scene 1 (0.0–1.5s): the full stage (all six slots filled, all edges) lifts from 0.72 to full opacity; ✱ kicker "THE PLAN" above the diagram.
Scene 2 (1.5–5.0s): on "three calls filled in" slots 1, 4, 5 each gain a small coral mono tag at their right edge — "POSTGRES", "SERVER ID", "24H" (elements with ids FID-slot-1 .d etc. so the player can rewrite them) — appearing one per beat; the three tags share the frame's one coral.
Scene 3 (5.0–8.0s): on "Draw on any step" an Inter `lead` line "Draw on a step · or approve" fades in centred under the diagram (y≈800); a mono note "AI-GENERATED NARRATION AND VISUALS" at the bottom-right of the safe area (y≈860).
Scene 4 (8.0–12.0s): dead-still hold.
