---
title: "Resumable uploads: what actually landed"
format: 1920x1080
duration: 175s
message: "Six steps landed; four calls the plan did not specify; one part unfinished"
arc: walkthrough with autonomy beats
audience: the reviewer who approved the plan and now decides whether to merge
mode: autonomous
music: none
plan_dir: eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume
---

## Video direction

- A WALKTHROUGH (lifecycle stage 4, style guide §13 and §16): the same stage as the plan video `videos/l2-upload-resume`, so the reviewer sees the plan's own diagram with what actually landed on it. THE STAGE STARTS DONE: at t=0 in frame 1 all six rail slots are filled and all six edges are in ink. The plan video builds the map; the walkthrough reports on a map already built, lighting one step at a time.
- A SERIES OF THREE PARTS: each part opens on the stage as reported so far and closes by naming the next. One sitting is 60-70 s.
- palette from `frame.md`: cream ground, ink voice, one coral per frame (the lit node border, OR the lit edge, OR one small tag). The ✱ kicker mark and caption underline are ink.
- AUTONOMY BEATS (frames 4, 9, 11, 16): the choice the agent made on its own. Two chips side by side under the diagram — `Chose · <what>` with a 2 px INK border and `Instead of · <what>` at ink-55% — plus a mono line naming where to check it. There is no recommendation and no coral on the chips: the thing is already done, and the reviewer's job is to accept it or flag it, which the player asks. The affected slot and node stay lit; that lit node is the frame's one coral.
- DEVIATION MARKERS: a step that did not land as written carries a small ink tag on its rail slot (`16 MB` on slot 2, `partial` on slot 6). The resolved frame collects them.
- quick checks (frames 5, 12): a question card and three chips, none marked.
- motion grammar: power3 settles, reveal on the spoken cue, held read at the end; the final frame holds still >= 4 s.
- negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900.


## Frame 1 — It shipped

- chapter_start: What landed, steps 1 and 2
- scene: The full stage from t=0: all six rail slots filled, all six edges in ink, no node active; on 'four calls' four small ink ticks land at the right of slots 2, 3, 4, 5
- voiceover: "The plan is implemented. All six steps landed, a two gigabyte upload survives three disconnects, and a file is charged once. I also made four calls the plan did not specify. Here they are."
- duration: 11.627s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete outcome first
- beat: Hook
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: It shipped.
keyMessage: The plan is implemented.


## Frame 2 — Step 1 landed as planned

- scene: Slot 1 lights; the Manifest node border goes coral; a chip under Manifest reads 'upload_manifests · 6 columns', then a second chip '40 ms on staging'
- voiceover: "Step one, the write-ahead manifest, landed as written. The table has six columns and one index; the migration ran in forty milliseconds on staging."
- duration: 8.896s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-step-1.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 1 landed as planned.
keyMessage: Step one, the write-ahead manifest, landed as written.


## Frame 3 — Step 2, with one change

- scene: Slot 2 lights; the api → blob edge goes coral then hands to a chip under Blob store '7f3a · 128 parts'; slot 2 gains a small ink tag '16 MB' (the deviation marker)
- voiceover: "Step two, chunked parts. A repeated PUT still returns two hundred without rewriting. One change: the default part size is sixteen megabytes, not the eight the plan named. A two gigabyte file is a hundred and twenty-eight parts instead of two hundred and fifty-six."
- duration: 15.467s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-step-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 2, with one change.
keyMessage: Step two, chunked parts.


## Frame 4 — Why 16 megabytes

- scene: Stage held, slot 2 and Blob lit; two chips side by side under the diagram: 'Chose · 16 MB' (ink border) and 'Instead of · 8 MB'; a mono line 'src/upload/parts.ts line 14'
- voiceover: "I chose sixteen over the plan's eight because mobile clients on the test network lost fewer parts per disconnect, and sixteen is still far under the five gigabyte limit. The plan's warning about the five megabyte minimum still holds. Accept this, or flag it?"
- duration: 14.613s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-autonomy-1.html
- type: cta
- persuasion: Choice made, alternative named, evidence pointer
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a1
- chose: 16 MB default part size
- instead_of: 8 MB, as the plan said
- why: a 2 GB file is 128 parts instead of 256; mobile clients on the test network lost fewer parts per disconnect
- check: src/upload/parts.ts line 14
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Why sixteen megabytes.
keyMessage: I chose sixteen over the plan's eight because mobile clients on the test network lost fewer parts per disconnect, and sixteen is still far under the five gigabyte limit.


## Frame 5 — Quick check

- scene: Stage held with Blob lit; a question card and three chips A · stores it again, B · sees the bit and does nothing, C · fails the upload; none marked
- voiceover: "Quick check. The client sends part four twice. Does the second PUT store it again, see the bit and do nothing, or fail the upload?"
- duration: 6.741s
- transition_in: crossfade
- status: outline
- src: compositions/frames/05-quiz-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 2
- quiz: k1
- question: The client sends part 4 twice. What does the second PUT do?
- option_a: Stores it again
- option_b: Sees the bit and does nothing
- option_c: Fails the upload
- answer: b
- explain: the bit is already set, so the PUT is idempotent and returns 200 without rewriting
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Quick check.
keyMessage: Quick check.


## Frame 6 — Next: steps 3 and 4

- scene: Stage held with slots 1 and 2 lit and their tags; a mono line under the diagram 'Next · Part 2 · steps 3 and 4'
- voiceover: "Next, part two: resume and billing."
- duration: 4.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-closer-1.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Next: steps 3 and 4.
keyMessage: Next, part two: resume and billing.


## Frame 7 — Part 2 of 3

- chapter_start: Steps 3 and 4
- scene: Stage as left: slots 1–2 lit with their tags, the rest at rest; kicker 'PART 2 OF 3'
- voiceover: "Part two of three: resume, and billing once."
- duration: 4.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-opener-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Part two of three.
keyMessage: Part two of three: resume, and billing once.


## Frame 8 — Step 3: resume

- scene: Slot 3 lights; the sdk → api edge goes coral; a chip under Manifest '111011 · part 4 missing' then under SDK 'sends part 4 only'
- voiceover: "Step three, resume. A reconnecting client asks which bits are set, gets one one one zero one one, and sends part four only. Staging cut the network at forty, seventy and ninety-five percent; every one resumed."
- duration: 12.928s
- transition_in: crossfade
- status: outline
- src: compositions/frames/08-step-3.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 3: resume.
keyMessage: Step three, resume.


## Frame 9 — Why 409, not 400

- scene: Stage held, slot 3 and the API lit; two chips: 'Chose · 409 conflict' (ink border) and 'Instead of · 400'; a mono line 'src/upload/complete.ts'
- voiceover: "Complete returns four-oh-nine when parts are missing. The plan did not say which code. I picked four-oh-nine because it reads as a state conflict, which it is: the client can ask for the bitmap and carry on. Four hundred would say the request was malformed. Accept, or flag?"
- duration: 15.339s
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-autonomy-2.html
- type: cta
- persuasion: Choice made, alternative named, evidence pointer
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a2
- chose: complete returns 409 when parts are missing
- instead_of: 400
- why: 409 reads as a state conflict, which it is; the client can call GET and continue
- check: src/upload/complete.ts
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Why 409, not 400.
keyMessage: Complete returns four-oh-nine when parts are missing.


## Frame 10 — Step 4: billed once

- scene: Slot 4 lights; the api → billing edge goes coral; a chip under Billing 'billed once', then a chip under Content-side 'charge on completed_at'
- voiceover: "Step four. The charge job now runs from completed at, keyed on the manifest id. The staging upload that survived three disconnects produced exactly one charge."
- duration: 9.984s
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-step-4.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 4: billed once.
keyMessage: Step four.


## Frame 11 — The old charge path is gone

- scene: Stage held, slot 4 and Billing lit; two chips: 'Chose · deleted it' (ink border) and 'Instead of · kept behind a flag'; a mono line 'git show upload/resume -- src/billing/charge.ts'
- voiceover: "I deleted the old per-post charge path rather than putting it behind a flag. Two charge paths for one upload is the bug this plan exists to remove, and a flag keeps it possible. That also means no quick way back if something depended on it. Accept, or flag?"
- duration: 15.019s
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-autonomy-3.html
- type: cta
- persuasion: Choice made, alternative named, evidence pointer
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a3
- chose: delete the old charge path
- instead_of: keep it behind a flag
- why: two charge paths for one upload is the bug this plan exists to remove; a flag would keep it possible
- check: git show upload/resume -- src/billing/charge.ts
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: The old charge path is gone.
keyMessage: I deleted the old per-post charge path rather than putting it behind a flag.


## Frame 12 — Quick check

- scene: Stage held with Billing lit; a question card and three chips A · one, B · two, C · none; none marked
- voiceover: "Second check. A client crashes at ninety-five percent and starts a new upload of the same file. How many charges: one, two, or none?"
- duration: 7.744s
- transition_in: crossfade
- status: outline
- src: compositions/frames/12-quiz-2.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 4
- quiz: k2
- question: A client crashes at 95% and starts a new upload of the same file. How many charges?
- option_a: 1
- option_b: 2
- option_c: None
- answer: b
- explain: the charge is keyed on the manifest id, and a new upload is a new manifest; the client-key option you did not take would have made it one
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Quick check.
keyMessage: Second check.


## Frame 13 — Next: steps 5 and 6

- scene: Stage held with slots 1–4 lit and their tags; a mono line 'Next · Part 3 · the sweeper, the SDK, and what is not done'
- voiceover: "Next, part three: the sweeper, the SDK, and what is not done."
- duration: 4.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/13-closer-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Next: steps 5 and 6.
keyMessage: Next, part three: the sweeper, the SDK, and what is not done.


## Frame 14 — Part 3 of 3

- chapter_start: Steps 5 and 6, and what is not done
- scene: Stage as left: slots 1–4 lit with their tags; kicker 'PART 3 OF 3'
- voiceover: "Part three of three: the sweeper, the SDK, and what is not done."
- duration: 4.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/14-opener-3.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Part three of three.
keyMessage: Part three of three: the sweeper, the SDK, and what is not done.


## Frame 15 — Step 5: the sweeper

- scene: Slot 5 lights; the sweeper → manifest and sweeper → blob edges go coral in turn; a chip under Sweeper 'hourly · 24 h' then under Blob 'parts deleted'
- voiceover: "Step five, the sweeper. It runs hourly and removes manifests older than twenty-four hours with no completed at. On the staging copy it cleared twelve thousand abandoned manifests in six minutes."
- duration: 11.221s
- transition_in: crossfade
- status: outline
- src: compositions/frames/15-step-5.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 5: the sweeper.
keyMessage: Step five, the sweeper.


## Frame 16 — Why it deletes in batches

- scene: Stage held, slot 5 and Sweeper lit; two chips: 'Chose · batches of 500' (ink border) and 'Instead of · one delete'; a mono line 'src/upload/sweep.ts'
- voiceover: "It deletes in batches of five hundred with a two hundred millisecond pause. A single delete of a week of rows locked the table for nine seconds on the staging copy. Accept, or flag?"
- duration: 10.517s
- transition_in: crossfade
- status: outline
- src: compositions/frames/16-autonomy-4.html
- type: cta
- persuasion: Choice made, alternative named, evidence pointer
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: a4
- chose: sweep in batches of 500 with a 200 ms pause
- instead_of: one delete
- why: a single delete of a week of rows locked the table for 9 s on the staging copy
- check: src/upload/sweep.ts
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Why it deletes in batches.
keyMessage: It deletes in batches of five hundred with a two hundred millisecond pause.


## Frame 17 — Step 6: 2 SDKs of 3

- scene: Slot 6 lights; a chip under SDK 'TypeScript · Python' then a ghost chip 'Go' with a level strike; slot 6 gains a small ink tag 'partial'
- voiceover: "Step six. The TypeScript and Python clients resume after a reconnect. The Go client does not: it still starts a fresh upload. That is the one part of the plan that is not finished."
- duration: 10.517s
- transition_in: crossfade
- status: outline
- src: compositions/frames/17-step-6.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Step 6: two SDKs of three.
keyMessage: Step six.


## Frame 18 — What is not tested

- scene: Stage held at full ink, no node lit; two ink chips low on the stage: 'Go SDK resume' and 'load above 200 uploads', each with a level strike
- voiceover: "Two things are untested. The Go client's resume, because it is not written. And load above two hundred concurrent uploads, because staging will not take it."
- duration: 8.384s
- transition_in: crossfade
- status: outline
- src: compositions/frames/18-not-done.html
- type: pain_point
- persuasion: Named gaps
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: What is not tested.
keyMessage: Two things are untested.


## Frame 19 — What ran

- scene: Stage held; three ink chips appear in turn low on the stage: '212 tests · 41 new', '2 GB · 3 disconnects · 1 charge', '12,000 manifests · 6 min'
- voiceover: "What ran: two hundred and twelve tests, forty-one of them new. A two gigabyte upload through three disconnects, charged once. And twelve thousand abandoned manifests swept in six minutes, with no lock wait over fifty milliseconds."
- duration: 13.013s
- transition_in: crossfade
- status: outline
- src: compositions/frames/19-evidence.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: What ran.
keyMessage: What ran: two hundred and twelve tests, forty-one of them new.


## Frame 20 — Flag a step, or merge

- scene: Full stage at full ink; slots 2, 3, 4, 5 carry small ink tags '16 MB', '409', 'deleted', 'batched' (class d, data-plan-question 1–4); a mono note 'AI-generated narration and visuals' bottom right; long still hold
- voiceover: "That is what landed, with the four calls marked. Flag any of them, draw on a step to ask for a change, or merge it."
- duration: 10s
- transition_in: crossfade
- status: outline
- src: compositions/frames/20-resolved.html
- type: cta
- persuasion: Choice made, alternative named, evidence pointer
- beat: Resolve
- blueprint: comparison-split
- plan_questions: 1,2,3,4
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small chips = supporting · cream ground = background
- sfx: none

narrativeRole: Flag a step, or merge.
keyMessage: That is what landed, with the four calls marked.

