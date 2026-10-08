---
title: "The loop, what's left: what landed"
format: 1920x1080
duration: 370s
message: "Steps 1–4 landed and step 5 is half done: rebuilds narrate only the lines that changed, the loop runs itself through a review server, the system video can be reviewed. Sixty calls the plan did not make (sixteen beaten here) and one deviation (the hosted page's hook is documented, not built), each to accept or flag; the owner's ask (play just the changes after a rebuild) is in; a fresh agent's code check found two step gaps and five real problems, four of them bugs now fixed; one of the two timed reviews is proven for real (a system-video review with no session open, picked up by claude -p, 9 min 13 s from Finish to the notification); the second is the reviewer's Finish on this video"
arc: walkthrough with autonomy beats, by track, in five parts
audience: the repo owner who approved the revise-loop plan (and someone new to the repo), deciding whether to accept what was built
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-22-m3-revise-loop
---

## Video direction

- A WALKTHROUGH (lifecycle stage 4, style guide §13), built from `walkthrough.md` with the look, beats and tags of `../../2026-09-23-deep-dives/walkthrough-video/`, on this plan's own stage (`../video/`): the five slot titles of the plan video's rail, its overview's three lanes, the 44 px spine with five ticks, and prototypes of what landed (the terminal, the files, the review player's own surfaces).
- OVERVIEW FIRST (style guide §2, v11): frame 1 is the plan video's overview beat reporting — the three tracks as three lanes, each marked done, and the proof bar half done. Step beats say what they need only where they need it: step 3 "needs step two", step 5 "needs all four"; steps 1, 2 and 4 carry their track chip and say nothing.
- A SERIES OF FIVE PARTS (§16): `chapter_start` on frames 1, 8, 16, 24, 32; each part opens on the rail as reported so far and closes by naming the next. The rail's slot tags are the running tally of beaten calls per step ('4 calls', '1 call', '7 + dev', '3 + 1 ask', 'half proven').
- WHAT-CHANGED BEATS (one per step): a real value each (1 line voiced and 34 kept, 32 s against 675 s; the notification's own waiting line; the three ways a review is taken; a real comment on frame 8, filed and sorted; the Action's three files struck, and the proof: one real review, 9 min 13 s, the second still to come).
- AUTONOMY BEATS (A1–A16, and the deviation as its own beat, d1 = the hosted page's hook is written in the skill, not built): in the left column two cards — `Chose · …` with a 2 px INK border and `Instead of · …` at ink 55 % — and the check as a mono chip under them; on the right a small prototype of what the call is about, its part outlined coral, with one worked-example chip. No coral on the cards: the thing is done; the player pauses and asks Accept (A) or Flag (B). Each is about 9–11 s. A16's step in walkthrough.md is "ask" (asked during the review, no plan step); plan-map needs a number, so it is filed under step 4, the part it sits in, and its kicker says "Asked in review".
- NOT IN THE PLAN (frame 29): the owner's ask, play just the changes after a rebuild with one toggle, as its own beat before A16.
- SAID PLAINLY (frame 34): sixty calls against the dozen the rules allow — the plan left too much open.
- THE CODE CHECK (frame 35) shows the check working: the findings page's nine keys, two step gaps and five problems, four of them bugs, and one of them (a second system-video review overwrote the first one's answers) fixed before → after.
- DETAILS (style guide §20), three, each put through the test: A4 opens the runs behind the narration estimate (evidence: 32 s and 675 s next to the plan's 40 s and the 13 s + 19 s a line estimate); A15 opens the Finish panel in each of its states (try); the code check opens every finding with its answer and the test that pins it (table).
- THE STEP 5 PROOF landed while this video was being built (commit df94160, walkthrough.md's Code check): the step 5 beat, the code-check rows for Step 5 and D-066, what ran and the ending report it; A11 says the call and what the proof changed (config.json now allows edits and Bash, -p last).
- QUICK CHECKS: K1 after A9 (Send twice: how many runs), K2 after the code check (two system-video reviews back to back).
- One coral per frame; no gradients, glows, pictograms or music; power3 settles on the spoken word, a held read at the end; nothing below y 900 but captions.
- ROUND 2 (frames 39–80, added after round 1, whose 38 frames are unchanged): five parts, `chapter_start` on 39, 43, 55, 65, 76, on the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan) and a spine of ticks 6–10. Part 6: what the review asked, the four decisions D-082–D-085, what landed. Part 7: step 6, quick check k3, the owner's three answers on its limits (one beat, not calls; answers 2 and 3 built since, fbcb8bc), d4 (the proof's weaker sandbox, a deviation said in prose), A17–A20, D2, D3. Part 8: step 7, k4, step 8, k5, A22, A24, k6, the grouped beat a21, a23. Part 9: step 9, k7, A25, A26, A29–A32, the grouped beat a27, a28. Part 10: round 2's code check, d5 (step 5's second real review still owed, in prose), not done, the end. Which calls stop is `reel stops`: every tagged call and deviation has its own beat; untagged calls share their part's `autonomy_group` beat.

- AFTER ROUND 2'S REVIEW (changes requested, reviews/walkthrough-20260924T071728Z.md): only the beats the fixes touch are rebuilt, each keeping its composition id so plan-diff reads it as edited — 44 (the file tools fenced by a hook, tried for real), 45 (k3's answer is now 'It is refused'), 46 (answer 1 changed; other agents skip the sandbox check), 49 (A18: the README note and the start-up line), 52 (D2: Codex's own modes wait), 56–57 (step 7 said plainly, with your own k3 answer as the example), 61–62 (A24 worked: flag A21, Accept all, A21 stays flagged), 66–67 (step 9: two reviews, two files, side by side), 70 (A29: both work, no change), 79 (not done, per walkthrough.md). One beat is new, frame 80 (`81-verdicts`): what Approve and Request changes each do now, and the review summary's errors fixed; the end is frame 81, unchanged.

## Frame 1 — What landed, by track

- chapter_start: What landed, and cheaper rebuilds
- scene: TRACKS, no rail (the plan video's overview, now reporting): kicker 'What landed · 3 tracks'; the three lanes of the plan video's overview stacked — 1 'Cheaper rebuilds' with 'Step 1', 2 'A loop that runs itself' with 'Step 2' → 'Step 3', 3 'A reviewable system video' with 'Step 4' — each landing on the words that name it, its step tiles on their numbers, and a mono 'done' at its right end ('done · 1 deviation' on lane 2); on 'five' the proof bar 'Proof on real reviews' with 'Step 5' and 'half done'; on 'removed' the chip 'Action removed' under it; on 'proven' the chip '1 of 2 reviews proven' and the bar's coral border (the one coral); held
- voiceover: "What landed, by track. Cheap rebuilds: step one, done. The loop runs itself: steps two and three, done, with one deviation. A reviewable system video: step four, done. Step five is half done: the Action is removed, and one of two real reviews is proven."
- duration: 15.93s
- transition_in: cut
- status: animated
- src: compositions/frames/01-overview.html
- type: hook
- persuasion: The whole build before any step
- beat: Overview
- blueprint: compose
- focal: three lanes done, the proof bar half done
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What landed, by track.
keyMessage: What landed, by track.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Cheap'): lane1 lands, timed to the start of the word.
Scene 3 (on 'one'): st1 lands, timed to the start of the word.
Scene 4 (on 'loop'): lane2 lands, timed to the start of the word.
Scene 5 (on 'two'): st2 lands, timed to the start of the word.
Scene 6 (on 'three'): st3 lands, timed to the start of the word.
Scene 7 (on 'deviation'): dev lands, timed to the start of the word.
Scene 8 (on 'reviewable'): lane3 lands, timed to the start of the word.
Scene 9 (on 'four'): st4 lands, timed to the start of the word.
Scene 10 (on 'five'): bar lands, timed to the start of the word.
Scene 11 (on 'removed'): rm lands, timed to the start of the word.
Scene 12 (on 'proven'): pend lands, timed to the start of the word.
Scene 13 (last ≥ 0.6 s): held read, nothing moves.

## Frame 2 — Step 1: narrate only the lines that changed

- scene: SPINE + KEY + GRID: kicker 'Step 1 · Narrate changed lines', track chip 'Track 1 · independent'; on 'narrate' the command line '$ reelplanning narrate <video>'; on 'key' the key card (text · voice · speed · model → kept: wav + word timings); on 'changed' the 35-cell grid of the system video's lines, one cell coral (the one coral) and '1 voiced · 34 kept'; on 'edited' '32 s' lands; on 'six' '675 s' beside it, struck
- voiceover: "Step one is a new command, narrate. Each line's audio and timings are kept under a key of its text, voice, speed and model; only changed lines are voiced. One edited line took thirty-two seconds, not six hundred seventy-five."
- duration: 14.47s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-step-1.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: 1 cell voiced, 34 kept; 32 s against 675 s
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 1: narrate only the lines that changed.
keyMessage: Step one is a new command, narrate.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'narrate'): cmd lands, timed to the start of the word.
Scene 3 (on 'key'): key lands, timed to the start of the word.
Scene 4 (on 'changed'): cell lands, timed to the start of the word.
Scene 5 (on 'edited'): res lands, timed to the start of the word.
Scene 6 (on '675'): old lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 3 — Call A1: the kept audio is committed

- scene: SPINE + PROTOTYPE: kicker 'Call A1 · Step 1'; spine tick 1 live; on the right, the file .hyperframes/narration.json · committed, its line "\"12\": { \"key\": \"9c1f…\", \"sha256\": \"4b0e…\", … }," marked, outlined coral (the frame's one coral), with the worked-example chip 'fresh clone = empty cache' under it (on 'fresh'); on 'committed' the card 'Chose · A committed record' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A gitignored cache' lands at ink 55 %; under them the check chip 'narration.mjs · recordPath'; held — the player pauses here and asks Accept / Flag
- voiceover: "The kept audio is the committed voice files, indexed by a committed record, rather than a gitignored cache. A cloud session starts from a fresh clone, where that cache is empty."
- duration: 10.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-call-a1.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a1
- chose: The kept narration is the project's own committed assets/voice/NN.wav and audio_meta.json, indexed by a small committed record, .hyperframes/narration.json (frame → key, text, wav sha256)
- instead_of: a per-repo, gitignored store (.reelplanning/cache/narration/)
- why: cloud sessions start from a fresh clone, so a gitignored cache is empty exactly when the system video gets rebuilt; the wavs are already committed, so a committed key record makes them the cache, with no second copy
- check: scripts/lib/narration.mjs recordPath; scripts/narrate.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A1: the kept audio is committed.
keyMessage: The kept audio is the committed voice files, indexed by a committed record, rather than a gitignored cache.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'committed'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'fresh'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 4 — Call A2: the key names the voice and whisper models

- scene: SPINE + PROTOTYPE: kicker 'Call A2 · Step 1'; spine tick 1 live; on the right, a small table 'One line's key: sha256 of four fields', the row 'model · kokoro-v1.0 + whisper small.en' marked, outlined coral (the frame's one coral), with the worked-example chip 'an upgrade re-voices 0 lines' under it (on 'upgrade'); on 'whisper' the card 'Chose · Voice + whisper model' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · HyperFrames version' lands at ink 55 %; under them the check chip 'narration.mjs · modelId'; held — the player pauses here and asks Accept / Flag
- voiceover: "The key's model is the voice model plus the whisper model, rather than the HyperFrames version. An upgrade that keeps the same voice should not re-narrate every video."
- duration: 9.7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-call-a2.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a2
- chose: The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (kokoro-v1.0 + whisper small.en), read from the pinned HyperFrames CLI
- instead_of: the HyperFrames version as the model
- why: a HyperFrames upgrade that keeps kokoro-v1.0 should not re-narrate every video; whisper is in the key because the word timings come from it
- check: scripts/lib/narration.mjs modelId
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A2: the key names the voice and whisper models.
keyMessage: The key's model is the voice model plus the whisper model, rather than the HyperFrames version.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'whisper'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'upgrade'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 5 — Call A3: an older video is adopted from git

- scene: SPINE + PROTOTYPE: kicker 'Call A3 · Step 1'; spine tick 1 live; on the right, a terminal, its line "kept lines from the narration committed in 2065e51" marked, outlined coral (the frame's one coral), with the worked-example chip '35 kept · 0 to narrate' under it (on 'commit'); on 'adopted' the card 'Chose · Adopt from git' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Narrate once more' lands at ink 55 %; under them the check chip 'gitNarratedLines'; held — the player pauses here and asks Accept / Flag
- voiceover: "A video narrated before the record existed is adopted from git, rather than narrated again: the commit that wrote its voice files says what they were made from."
- duration: 9.65s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-call-a3.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a3
- chose: A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote audio_meta.json, only when audio_meta.json and assets/voice/ are exactly that commit's; --adopt does the same from the working SCRIPT.md, outside git
- instead_of: re-narrating every line once, to create the record
- why: every existing video (the system video included) would pay the 11 minutes once more on its first rebuild; the committed pair is the evidence of what the wavs were made from, and any later touch to the wavs disqualifies it
- check: scripts/lib/narration.mjs gitNarratedLines; scripts/test/narrate.spec.mjs "adopted from git"
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A3: an older video is adopted from git.
keyMessage: A video narrated before the record existed is adopted from git, rather than narrated again:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'adopted'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'commit'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 6 — Call A4: the cost counts lines already edited

- scene: SPINE + PROTOTYPE: kicker 'Call A4 · Step 1'; spine tick 1 live; on the right, a terminal, its line "cost: 2 of 35 lines to narrate (~51 s to make);" marked, outlined coral (the frame's one coral), with the worked-example chip 'said before anything runs' under it (on 'prints'); on 'already' the card 'Chose · Edited lines count too' (2 px ink border) lands in the left column; on 'only' the card 'Instead of · Only the named frames' lands at ink 55 %; under them the check chip 'narration.mjs · narrationCost'; held — the player pauses here and asks Accept / Flag
- voiceover: "The cost prints first: lines to narrate, and about how long. It counts lines already edited, not only the frames spec-diff names. The runs behind the estimate are one click away."
- duration: 11.1s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-call-a4.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- autonomy: a4
- chose: The cost is one phrase shared by spec-diff ("cost: …") and reel status ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make; spec-diff --json carries it as narration
- instead_of: counting only the named frames' lines
- why: an edit already made to SCRIPT.md is part of the cost too, and the record knows it exactly (D-003: say the cost first)
- check: scripts/lib/narration.mjs narrationCost; scripts/spec-diff.mjs; scripts/reel.mjs status
- detail: narration-timing
- detail_kind: evidence
- detail_title: The runs behind the estimate
- detail_why: The runs behind the estimate are one click away.
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A4: the cost counts lines already edited.
keyMessage: The cost prints first:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'already'): chose lands, timed to the start of the word.
Scene 3 (on 'only'): instead lands, timed to the start of the word.
Scene 4 (on 'prints'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 7 — Next: part 2

- scene: FULL RAIL: the rail as reported so far, the part's new slot tag ('4 calls') landing coral-deep and settling to ink; 'Next · Part 2' and the hero 'The loop runs itself' to the right
- voiceover: "Next, part two: the loop runs itself."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-closer-1.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 2.
keyMessage: Next, part two:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 8 — Part 2 of 5

- chapter_start: The loop runs itself: steps 2 and 3
- scene: FULL RAIL: kicker 'Part 2 of 5'; the rail with the five slot titles of the plan video and the calls reported so far as slot tags (1: '4 calls'); the hero 'Steps 2 and 3' to the right; on 'loop' slot 2 takes a 2 px ink border
- voiceover: "Part two of five. Rebuilds are reported. Now the loop runs itself."
- duration: 4.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-opener-2.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 2 of 5.
keyMessage: Part two of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'loop'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 9 — Step 2: background workers, and a notification

- scene: SPINE + SESSION + NOTIFICATION: kicker 'Step 2 · Background workers', track chip 'Track 2 · independent', 'decided · D-064'; on 'main' the tile 'Main session' (the one you talk to); on 'worker' four worker chips fan out to its right ('Build a video', 'Implement a part', 'Code check', 'Fix a flag'); on 'notification' a desktop notification lands top right ('reelplanning · walkthrough ready'), and on 'seventeen' its line '17 calls to accept or flag, 2 quick checks' takes the coral edge (the one coral)
- voiceover: "Step two. The main session hands every long job to a background worker and stays free. When a review page is up, reelplanning sends a notification saying what waits: here, seventeen calls to accept or flag."
- duration: 13.27s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-step-2.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: the notification saying what waits
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 2: background workers, and a notification.
keyMessage: Step two.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'main'): main lands, timed to the start of the word.
Scene 3 (on 'worker'): workers lands, timed to the start of the word.
Scene 4 (on 'notification'): note lands, timed to the start of the word.
Scene 5 (on 'seventeen'): count lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 10 — Call A5: notified when the page is up

- scene: SPINE + PROTOTYPE: kicker 'Call A5 · Step 2'; spine tick 2 live; on the right, a terminal, its line "17 calls to accept or flag, 2 quick checks" marked, outlined coral (the frame's one coral), with the worked-example chip 'verify knows no URL' under it (on 'again'); on 'address' the card 'Chose · When the page is up' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · When verify passes' lands at ink 55 %; under them the check chip 'review.mjs · after listen'; held — the player pauses here and asks Accept / Flag
- voiceover: "The notification fires once the page is up and its address is known, rather than when verify passes. Verify knows no address, and runs again while findings are fixed."
- duration: 10.66s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-call-a5.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 2
- autonomy: a5
- chose: The notification fires from reelplanning review <video-dir> once the server is listening (the page is up and its URL known), and from reelplanning notify <video-dir> --url <artifact-url>, run by the skill after publishing a hosted page; review with no folder (the library) does not notify; --no-notify turns it off
- instead_of: firing at the end of verify.sh or finish-project.sh
- why: verify and finish-project know no URL and run again and again while findings are fixed; "ready" in the plan means verify passed and the page is up, and the skill always runs review right after verify passes
- check: scripts/review.mjs (the notify call after listen); scripts/notify.mjs; skills/plan-to-video/SKILL.md "Running the loop (v9)"
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A5: notified when the page is up.
keyMessage: The notification fires once the page is up and its address is known, rather than when verify passes.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'address'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'again'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 11 — Step 3: Send reaches the session, or starts one

- scene: SPINE + SEQUENCE: kicker 'Step 3 · Finish reaches the session', track chip 'needs step 2', 'decided · D-064'; on 'Send' the tile 'The review player' with the chip 'Send'; on 'server' an arrow into 'The review server'; on 'inbox' its chip 'inbox/<id>.json'; then three outcomes stacked on the right, each on its word: '1 · a waiting session takes it', '2 · none: claude -p starts' (coral edge: the headless run is the new part), '3 · no server: next session'
- voiceover: "Step three needs step two. Send on the local page posts the review to the review server, into its inbox. A waiting session takes it; with none, the server starts claude dash p; with no server, the next session does."
- duration: 13.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-step-3.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: the three ways a review is taken
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 3: Send reaches the session, or starts one.
keyMessage: Step three needs step two.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Send'): send lands, timed to the start of the word.
Scene 3 (on 'server'): srv lands, timed to the start of the word.
Scene 4 (on 'inbox'): inbox lands, timed to the start of the word.
Scene 5 (on 'waiting'): o1 lands, timed to the start of the word.
Scene 6 (on 'starts'): o2 lands, timed to the start of the word.
Scene 7 (on 'next'): o3 lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 12 — Call A6: the inbox is not committed

- scene: SPINE + PROTOTYPE: kicker 'Call A6 · Step 3'; spine tick 3 live; on the right, the file .reelplanning/.gitignore, its line "inbox/" marked, outlined coral (the frame's one coral), with the worked-example chip 'intake writes the record' under it (on 'push'); on 'gitignored' the card 'Chose · A gitignored inbox' (2 px ink border) lands in the left column; on 'committed' the card 'Instead of · Committed rows' lands at ink 55 %; under them the check chip '.reelplanning/.gitignore'; held — the player pauses here and asks Accept / Flag
- voiceover: "The inbox is gitignored, not committed. A review is untrusted until intake checks it, and a committed one would let a push look like a new review."
- duration: 9.06s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-call-a6.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a6
- chose: The inbox is .reelplanning/inbox/<id>.json, gitignored with its claims, heartbeats and run logs; reel-intake is what turns a row into committed files
- instead_of: committing inbox rows
- why: a row is untrusted and machine-local until intake checks it; committing it would also let a push look like a new review
- check: .reelplanning/.gitignore; templates/reelplanning/gitignore
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A6: the inbox is not committed.
keyMessage: The inbox is gitignored, not committed.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'gitignored'): chose lands, timed to the start of the word.
Scene 3 (on 'committed'): instead lands, timed to the start of the word.
Scene 4 (on 'push'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 13 — Call A7: a waiting session is a fresh heartbeat

- scene: SPINE + PROTOTYPE: kicker 'Call A7 · Step 3'; spine tick 3 live; on the right, a small table 'inbox/.waiters/', the row '41822.json · 1.4 s · alive → waiting' marked, outlined coral (the frame's one coral), with the worked-example chip 'under 10 s old = waiting' under it (on 'killed'); on 'heartbeat' the card 'Chose · A 2 s heartbeat' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A pid lock file' lands at ink 55 %; under them the check chip 'inbox.mjs · liveWaiters'; held — the player pauses here and asks Accept / Flag
- voiceover: "A session counts as waiting while its heartbeat file is under ten seconds old and its process lives, rather than a lock file. A killed session's heartbeat just ages out."
- duration: 10.17s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-call-a7.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a7
- chose: "A session is waiting" = a heartbeat file inbox/.waiters/<pid>.json, rewritten every 2 s by review --wait, and counted when it is under 10 s old and (same host) its pid is alive
- instead_of: a plain pid lock file, or a socket the waiter holds open
- why: a killed session (SIGKILL, the laptop lid) leaves a stale file that ages out by itself; the pid check catches a clean exit sooner; one file per waiter so two sessions never overwrite each other
- check: scripts/lib/inbox.mjs liveWaiters, startHeartbeat
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A7: a waiting session is a fresh heartbeat.
keyMessage: A session counts as waiting while its heartbeat file is under ten seconds old and its process lives, rather than a lock file.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'heartbeat'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'killed'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 14 — Call A8: the server looks again after 15 s

- scene: SPINE + PROTOTYPE: kicker 'Call A8 · Step 3'; spine tick 3 live; on the right, a small table 'One review, delivered', the row '15 s · unclaimed, no one waiting → claude -p' marked, outlined coral (the frame's one coral), with the worked-example chip 'unclaimed at 15 s → claude -p' under it (on 'unclaimed'); on 'again' the card 'Chose · Look again at 15 s' (2 px ink border) lands in the left column; on 'strands' the card 'Instead of · Trust the first look' lands at ink 55 %; under them the check chip 'review.mjs · deliver'; held — the player pauses here and asks Accept / Flag
- voiceover: "With a session waiting, the server leaves it the review, then looks again after fifteen seconds. Still unclaimed, it starts the headless run, so a dying session strands nothing."
- duration: 10.23s
- transition_in: crossfade
- status: animated
- src: compositions/frames/14-call-a8.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a8
- chose: With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run
- instead_of: trusting the first look
- why: a waiter that dies between the look and its next poll would otherwise strand the review until someone opens a session
- check: scripts/review.mjs deliver
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A8: the server looks again after 15 s.
keyMessage: With a session waiting, the server leaves it the review, then looks again after fifteen seconds.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'again'): chose lands, timed to the start of the word.
Scene 3 (on 'unclaimed'): example lands, timed to the start of the word.
Scene 4 (on 'strands'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 15 — Next: part 3

- scene: FULL RAIL: the rail as reported so far, the part's new slot tags ('1 call', '3 calls') landing coral-deep and settling to ink; 'Next · Part 3' and the hero 'The server's rules' to the right
- voiceover: "Next, part three: the rules around the server, and one deviation."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-closer-2.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 3.
keyMessage: Next, part three:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 16 — Part 3 of 5

- chapter_start: The review server's rules, and a deviation
- scene: FULL RAIL: kicker 'Part 3 of 5'; the rail with the five slot titles of the plan video and the calls reported so far as slot tags (1: '4 calls', 2: '1 call', 3: '3 calls'); the hero 'Step 3, continued' to the right; on 'rules' slot 3 takes a 2 px ink border
- voiceover: "Part three of five. Send reaches a session. Now the rules around it."
- duration: 4.85s
- transition_in: crossfade
- status: animated
- src: compositions/frames/16-opener-3.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 3 of 5.
keyMessage: Part three of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'rules'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 17 — Call A9: one claim file, one handler

- scene: SPINE + PROTOTYPE: kicker 'Call A9 · Step 3'; spine tick 3 live; on the right, a small table 'inbox/<id>.claim · open(…, "wx")', the row 'the waiting session · creates the claim → handles it' marked, outlined coral (the frame's one coral), with the worked-example chip 'second taker: does nothing' under it (on 'loser'); on 'claim' the card 'Chose · A claim file' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A lock in memory' lands at ink 55 %; under them the check chip 'inbox.mjs · claim'; held — the player pauses here and asks Accept / Flag
- voiceover: "Each review is handled once: whoever creates its claim file first wins, rather than a lock in the server's memory. The file survives a restart, and the loser does nothing."
- duration: 10.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/17-call-a9.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a9
- chose: One handler per review, enforced by an exclusive-create claim file inbox/<id>.claim (open(…, "wx")): the waiting session, the headless start and the session-start pickup all have to win it
- instead_of: a lock held in the server's memory
- why: it survives the server restarting and settles the race between a waiter and a headless start; the loser simply does nothing
- check: scripts/lib/inbox.mjs claim; scripts/test/loop.spec.mjs "only the first taker"
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A9: one claim file, one handler.
keyMessage: Each review is handled once:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'claim'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'loser'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 18 — Call A10: the endpoint takes JSON from this machine only

- scene: SPINE + PROTOTYPE: kicker 'Call A10 · Step 3'; spine tick 3 live; on the right, a terminal, its line "POST /api/review  Origin: other tab    → 403 cross-origin" marked, outlined coral (the frame's one coral), with the worked-example chip 'another tab's post: 403' under it (on 'foreign'); on 'JSON' the card 'Chose · JSON, this machine only' (2 px ink border) lands in the left column; on 'agent' the card 'Instead of · Any POST' lands at ink 55 %; under them the check chip 'review.mjs · handleApi'; held — the player pauses here and asks Accept / Flag
- voiceover: "The endpoint takes only JSON, from this machine's own address, with no foreign origin, up to five megabytes. It can start an agent, so another tab's page must not reach it."
- duration: 11.1s
- transition_in: crossfade
- status: animated
- src: compositions/frames/18-call-a10.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a10
- chose: POST /api/review accepts only content-type: application/json, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry review.annotations
- instead_of: accepting any POST
- why: the endpoint can start an agent run, so a page in another tab must not reach it: a text/plain form post skips the CORS preflight, and the Host check stops DNS rebinding; the plan directory is still checked by reel-intake, not here
- check: scripts/review.mjs handleApi
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A10: the endpoint takes JSON from this machine only.
keyMessage: The endpoint takes only JSON, from this machine's own address, with no foreign origin, up to five megabytes.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'JSON'): chose lands, timed to the start of the word.
Scene 3 (on 'foreign'): example lands, timed to the start of the word.
Scene 4 (on 'agent'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 19 — Call A11: claude -p, with no permission flags

- scene: SPINE + PROTOTYPE: kicker 'Call A11 · Step 3'; spine tick 3 live; on the right, the file .reelplanning/config.json · after the proof · D-066, its line "\"command\": \"claude --permission-mode acceptEdits --allowedTools Bash -p\"" marked, outlined coral (the frame's one coral), with the worked-example chip 'bare claude -p: denied' under it (on 'denied'); on 'setting' the card 'Chose · No flags at first' (2 px ink border) lands in the left column; on 'cost' the card 'Instead of · Edits allowed up front' lands at ink 55 %; under them the check chip '.reelplanning/config.json'; held — the player pauses here and asks Accept / Flag
- voiceover: "The setting was claude dash p, with no permission flags, since how much a headless run may do is your call. The real run showed the cost: a bare claude dash p is denied every edit, so the flags are in now."
- duration: 12.98s
- transition_in: crossfade
- status: animated
- src: compositions/frames/19-call-a11.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a11
- chose: This repo's config.json is "command": "claude -p", exactly, with no permission flags; its // note says flags can be added (changed by the step 5 proof: a bare claude -p is denied every edit and command, so config.json now names claude --permission-mode acceptEdits --allowedTools Bash -p, with -p last)
- instead_of: adding --permission-mode acceptEdits or an allowed-tools list
- why: how much a headless run may do unasked is the owner's call, not the implementer's; the cost: a real headless run may stop at its first permission prompt (not yet tried)
- check: .reelplanning/config.json; templates/reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A11: claude -p, with no permission flags.
keyMessage: The setting was claude dash p, with no permission flags, since how much a headless run may do is your call.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'setting'): chose lands, timed to the start of the word.
Scene 3 (on 'denied'): example lands, timed to the start of the word.
Scene 4 (on 'now'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 20 — Call A15: the page posts only to its own server

- scene: SPINE + PROTOTYPE: kicker 'Call A15 · Step 3'; spine tick 3 live; on the right, the review player's Finish panel on a local page: the verdict, the note field, 'Send your approval', and under it the line 'No session is open: claude -p starts on it.' marked, outlined coral (the frame's one coral), with the worked-example chip 'plain server: download only' under it (on 'lines'); on 'own' the card 'Chose · Only its own server' (2 px ink border) lands in the left column; on 'otherwise' the card 'Instead of · Any localhost page' lands at ink 55 %; under them the check chip 'player.js · reachLocal'; held — the player pauses here and asks Accept / Flag
- voiceover: "The page posts only when the review server marked it as its own and answered; otherwise the download stays. The Finish panel's three lines are there to try."
- duration: 9.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/20-call-a15.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: a15
- chose: On a local page, Finish POSTs the row to /api/review only when the review server marked the page as its own (a meta tag) and a GET /api/review on load answered {ok:true}; a failed POST is dropped quietly and the download stays
- instead_of: posting blind from every localhost page
- why: npm run review serves the player with python's http.server, which would answer every POST with a 501; the download and commands are still a complete answer
- check: packages/player/reelplanning-player.js reachLocal, postLocal; scripts/review.mjs (the meta tag)
- detail: finish-panel
- detail_kind: try
- detail_title: The Finish panel, in each of its states
- detail_why: The Finish panel's three lines are there to try.
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A15: the page posts only to its own server.
keyMessage: The page posts only when the review server marked it as its own and answered;

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'own'): chose lands, timed to the start of the word.
Scene 3 (on 'otherwise'): instead lands, timed to the start of the word.
Scene 4 (on 'lines'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 21 — Deviation: the hosted page's hook is written down, not built

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 3'; spine tick 3 live; on the right, the hosted page's Send, an arrow to a dashed box 'hook · not built', and the skill's line 'register one where the harness offers it' marked, outlined coral (the frame's one coral), with the worked-example chip 'hosted page: by hand' under it (on 'deviation'); on 'skill' the card 'Chose · Written in the skill' (2 px ink border) lands in the left column; on 'check' the card 'Instead of · A hook in the code' lands at ink 55 %; under them the check chip 'SKILL.md · Running the loop'; held — the player pauses here and asks Accept / Flag
- voiceover: "One deviation, said plainly: step three's hook for the hosted page is not built. The skill tells the agent to register one where its harness allows, and to check submitted rows at session start."
- duration: 11.81s
- transition_in: crossfade
- status: animated
- src: compositions/frames/21-deviation-hook.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- autonomy: d1
- chose: Deviation from step 3: the hosted page's hook is documented in the skill, not built; the agent registers one where its harness offers a hook, and otherwise checks the page's submitted rows at session start
- instead_of: Step 3 as written: the hosted page tells the session through a hook the session registered when it published the page
- why: the hook belongs to the environment (a Claude Code cloud session can register one), not the repo; only the local page's path (review server, inbox, --wait, headless run) is built and tested
- check: skills/plan-to-video/SKILL.md "Running the loop (v9)", the Hosted page item; walkthrough.md · Deviations
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: the hosted page's hook is written down, not built.
keyMessage: One deviation, said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'deviation'): example lands, timed to the start of the word.
Scene 3 (on 'skill'): chose lands, timed to the start of the word.
Scene 4 (on 'check'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 22 — Quick check: Send twice

- scene: SPINE + QUESTION: kicker 'Quick check · Step 3'; the question in serif; three option cards (A '2', B '1', C 'None'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. You press Send twice on the same review. How many runs start?"
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-check-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 3
- quiz: k1
- question: You press Send twice on the same review. How many runs start?
- option_a: 2
- option_b: 1
- option_c: None
- answer: b
- explain: One: the same review posted twice is one inbox file, and one claim file decides who handles it (A9).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: Send twice.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'twice'): o1 lands, timed to the start of the word.
Scene 3 (on 'many'): o2 lands, timed to the start of the word.
Scene 4 (on 'start'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 23 — Next: part 4

- scene: FULL RAIL: the rail as reported so far, the part's new slot tag ('7 + dev') landing coral-deep and settling to ink; 'Next · Part 4' and the hero 'The system video' to the right
- voiceover: "Next, part four: the system video, and playing just the changes."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/23-closer-3.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 4.
keyMessage: Next, part four:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 24 — Part 4 of 5

- chapter_start: The system video, and just the changes
- scene: FULL RAIL: kicker 'Part 4 of 5'; the rail with the five slot titles of the plan video and the calls reported so far as slot tags (1: '4 calls', 2: '1 call', 3: '7 + dev'); the hero 'Step 4, and an ask' to the right; on 'system' slot 4 takes a 2 px ink border
- voiceover: "Part four of five. The loop is reported. Now the system video."
- duration: 4.53s
- transition_in: crossfade
- status: animated
- src: compositions/frames/24-opener-4.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 4 of 5.
keyMessage: Part four of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'system'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 25 — Step 4: a system-video review changes the system

- scene: SPINE + COMMENT → REVIEW FILE: kicker 'Step 4 · System video reviews', track chip 'Track 3 · independent', 'decided · D-065'; on 'comment' a comment card on 'System video · frame 8' ('I can't tell what plan-diff does here, next to finish-project'); on 'filed' the file 'system-video/reviews/<id>.md' lands to its right, its frame line and 'Spec · Parts'; on 'four' the parts line (the skill · finish-project · plan-diff · the review player); on 'sorted' the sort line 'video: say it more plainly' takes the coral edge (the one coral)
- voiceover: "Step four. A system-video review now goes through intake like a plan's. A real comment on frame eight was filed with that frame's spec section and its four parts, and sorted as: fix the video."
- duration: 12.16s
- transition_in: crossfade
- status: animated
- src: compositions/frames/25-step-4.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: one real comment, filed with its parts and sorted
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 4: a system-video review changes the system.
keyMessage: Step four.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'comment'): cmt lands, timed to the start of the word.
Scene 3 (on 'filed'): doc lands, timed to the start of the word.
Scene 4 (on 'four'): parts lands, timed to the start of the word.
Scene 5 (on 'sorted'): sort lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 26 — Call A12: intake checks a system-video review

- scene: SPINE + PROTOTYPE: kicker 'Call A12 · Step 4'; spine tick 4 live; on the right, a terminal, its line "✗ 3 mark(s) sit on frames this system video does not have" marked, outlined coral (the frame's one coral), with the worked-example chip 'wrong video: refused' under it (on 'mark'); on 'checks' the card 'Chose · Checked, not believed' (2 px ink border) lands in the left column; on 'believing' the card 'Instead of · Trust the path' lands at ink 55 %; under them the check chip 'reel-intake · intakeSystem'; held — the player pauses here and asks Accept / Flag
- voiceover: "Intake checks a system-video review, rather than believing its path: the folder, a storyboard marked system, and every mark on that video's own frames."
- duration: 9.38s
- transition_in: crossfade
- status: animated
- src: compositions/frames/26-call-a12.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a12
- chose: Intake checks a system-video target: inside the repo, directly in a .reelplanning/, with a STORYBOARD.md whose front matter says kind: system and a plan-map.json, and every mark's frame.compositionId one of that video's frames; system-review runs with the checked folder, never the row's claim
- instead_of: believing the path once it matches
- why: the same rule as for plans (checked, not believed); the frame check refuses a plan video's review sent to the system video by mistake
- check: scripts/reel-intake.mjs intakeSystem; scripts/test/system-review.spec.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A12: intake checks a system-video review.
keyMessage: Intake checks a system-video review, rather than believing its path:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'checks'): chose lands, timed to the start of the word.
Scene 3 (on 'believing'): instead lands, timed to the start of the word.
Scene 4 (on 'mark'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 27 — Call A13: the first sort is a keyword hint

- scene: SPINE + PROTOTYPE: kicker 'Call A13 · Step 4'; spine tick 4 live; on the right, a small table 'system-video/reviews/<id>.md · first sort', the row '“make it hourly or daily” · plan · a choice on the table' marked, outlined coral (the frame's one coral), with the worked-example chip '“or” → a new plan' under it (on 'choice'); on 'keyword' the card 'Chose · A keyword hint' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A model call' lands at ink 55 %; under them the check chip 'system-review.mjs · hint'; held — the player pauses here and asks Accept / Flag
- voiceover: "The first sort is a keyword hint, rather than a model call: rewinds mean fix the video; a choice word, or two parts or more, means a plan. I decide each."
- duration: 9.87s
- transition_in: crossfade
- status: animated
- src: compositions/frames/27-call-a13.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a13
- chose: The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small; each hint prints its reason; the agent decides
- instead_of: no hint, or a model call
- why: the plan asks for a sort the agent overrides; crude and explainable beats clever
- check: scripts/system-review.mjs hint
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A13: the first sort is a keyword hint.
keyMessage: The first sort is a keyword hint, rather than a model call:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'keyword'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'choice'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 28 — Call A14: a small change gets a one-step plan

- scene: SPINE + PROTOTYPE: kicker 'Call A14 · Step 4'; spine tick 4 live; on the right, a small table '.reelplanning/plans/2026-09-25-rename-box/', the row 'plan.md · 1 step · reel new-plan' marked, outlined coral (the frame's one coral), with the worked-example chip 'reel record works as is' under it (on 'ledger'); on 'one-step' the card 'Chose · A one-step plan' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A bare walkthrough' lands at ink 55 %; under them the check chip 'SKILL.md · review (v9)'; held — the player pauses here and asks Accept / Flag
- voiceover: "A small change is shown in a one-step plan with its own walkthrough, rather than a walkthrough with no plan: the ledger and the library hang off a plan folder."
- duration: 9.27s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-call-a14.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a14
- chose: The "short walkthrough" for a small change is a one-step plan from reel new-plan, with its own walkthrough.md and walkthrough video
- instead_of: a walkthrough with no plan directory
- why: walkthroughs, reel record, the ledger and the library all hang off a plan directory; a one-step plan is the smallest thing they already accept
- check: skills/plan-to-video/SKILL.md "Reviewing the system video (v9)"
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A14: a small change gets a one-step plan.
keyMessage: A small change is shown in a one-step plan with its own walkthrough, rather than a walkthrough with no plan:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'one-step'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'ledger'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 29 — Asked in the review: play just the changes

- scene: SPINE + PLAYER: kicker 'Not in the plan · Asked in review'; the review player after a rebuild: a timeline of 21 beats, 4 dark (changed) and 17 faint; on 'rebuild' the Revised line 'Revised since the last build: 4 of 21 beats changed' and the mode 'Plays just the changes' with a coral dot (the one coral); on 'button' the one toggle 'Play the whole video'; on 'seek' a playhead dropped on a faint beat with the chip 'a seek plays it'
- voiceover: "Not in the plan: you asked for it in the review. After a rebuild, the player plays just the changes, with one button for the whole video. A seek to an unchanged beat still plays it."
- duration: 11.03s
- transition_in: crossfade
- status: animated
- src: compositions/frames/29-changes.html
- type: benefit_highlight
- persuasion: Prototype of what landed
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: the mode in force and its one toggle
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Asked in the review: play just the changes.
keyMessage: Not in the plan:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'asked'): kick lands, timed to the start of the word.
Scene 3 (on 'rebuild'): bar lands, timed to the start of the word.
Scene 4 (on 'button'): btn lands, timed to the start of the word.
Scene 5 (on 'seek'): seek lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 30 — Call A16: just the changes, for any revision not yet sent

- scene: SPINE + PROTOTYPE: kicker 'Call A16 · Asked in review'; spine tick 4 live; on the right, the review player's poster after a rebuild: 'Play · 0:40 of changes', the Revised line and the mode 'Plays just the changes' marked, outlined coral (the frame's one coral), with the worked-example chip 'downloaded, not sent: still on' under it (on 'downloaded'); on 'revision' the card 'Chose · On for any revision' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Only after a sent round' lands at ink 55 %; under them the check chip 'player.js · initOnly'; held — the player pauses here and asks Accept / Flag
- voiceover: "Just the changes is on for any revision you have not already sent a review of, rather than only after a sent round: a reviewer who downloaded still wants the changes."
- duration: 10.02s
- transition_in: crossfade
- status: animated
- src: compositions/frames/30-call-a16.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- autonomy: a16
- chose: After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build
- instead_of: on only when a sent round exists, or remembering "whole video" for good
- why: a reviewer who downloaded instead of sending, or opens the revised video in a new browser, has no round on record but still wants the changes; a "whole video" kept from last round would hide the next round's changes
- check: packages/player/reelplanning-player.js initOnly, toggleOnly; packages/player/test/changes.spec.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A16: just the changes, for any revision not yet sent.
keyMessage: Just the changes is on for any revision you have not already sent a review of, rather than only after a sent round:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'revision'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'downloaded'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 31 — Next: part 5

- scene: FULL RAIL: the rail as reported so far, the part's new slot tag ('3 + 1 ask') landing coral-deep and settling to ink; 'Next · Part 5' and the hero 'The proof, and the checks' to the right
- voiceover: "Next, the last part: step five, the code check, and what is still to come."
- duration: 4.52s
- transition_in: crossfade
- status: animated
- src: compositions/frames/31-closer-4.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 5.
keyMessage: Next, the last part:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 32 — Part 5 of 5

- chapter_start: Step 5, the code check, and what is pending
- scene: FULL RAIL: kicker 'Part 5 of 5'; the rail with the five slot titles of the plan video and the calls reported so far as slot tags (1: '4 calls', 2: '1 call', 3: '7 + dev', 4: '3 + 1 ask'); the hero 'Step 5, and the checks' to the right; on 'five' slot 5 takes a 2 px ink border
- voiceover: "Part five of five. Four steps are reported. Now step five, and the checks."
- duration: 5.17s
- transition_in: crossfade
- status: animated
- src: compositions/frames/32-opener-5.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 5 of 5.
keyMessage: Part five of five.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'five'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 33 — Step 5: the Action is removed; one real review is proven

- scene: SPINE + FILES + PENDING: kicker 'Step 5 · Proof on real reviews', track chip 'needs steps 1–4'; on the left three file lines, each struck on its word ('.github/workflows/reelplanning-revise.yml', its template, 'reel init · installs it'), then '4 docs now name config.json and inbox/'; on 'real' the box on the right 'The proof', its first row '1 · a system-video review, no session open → claude -p'; on 'nine' '9 min 13 s' (Finish → notification); on 'second' its dashed second row '2 · your Finish on this video' and the tag 'half proven' in coral (the one coral)
- voiceover: "Step five needs all four. The Action is gone, with its template and install. A real review, with no session open, started claude dash p: nine minutes thirteen from Finish to the notification. The second is your Finish on this one."
- duration: 14.51s
- transition_in: crossfade
- status: animated
- src: compositions/frames/33-step-5.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: one real review proven, the second still to come
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 5: the Action is removed; one real review is proven.
keyMessage: Step five needs all four.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'gone'): rm lands, timed to the start of the word.
Scene 3 (on 'template'): rm2 lands, timed to the start of the word.
Scene 4 (on 'install'): rm3 lands, timed to the start of the word.
Scene 5 (on 'real'): proof lands, timed to the start of the word.
Scene 6 (on 'nine'): timed lands, timed to the start of the word.
Scene 7 (on 'second'): second lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 34 — 60 calls: the plan left too much open

- scene: THE LOG: kicker 'Said plainly · 60 calls'; a grid of 60 small tiles, one per call (16 in ink: the ones beaten here; 44 grey), filling on 'sixty', with the hero '60' beside it; on 'dozen' a coral rule under the first 12 tiles, 'the rules: about a dozen'; three chips, each on its word, naming what the plan left open: 'where narration is kept', 'who wins a review', 'how a system review is filed'
- voiceover: "Said plainly: the workers made sixty calls the plan did not, five times the dozen the rules allow. The plan left too much open: where narration is kept, who wins a review, how a system review is filed."
- duration: 12.88s
- transition_in: crossfade
- status: animated
- src: compositions/frames/34-too-open.html
- type: social_proof
- persuasion: Said plainly
- beat: Focus
- blueprint: compose
- focal: 60 against a dozen
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: 60 calls: the plan left too much open.
keyMessage: Said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'sixty'): big lands, timed to the start of the word.
Scene 3 (on 'dozen'): rule lands, timed to the start of the word.
Scene 4 (on 'narration'): g1 lands, timed to the start of the word.
Scene 5 (on 'wins'): g2 lands, timed to the start of the word.
Scene 6 (on 'filed'): g3 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 35 — The code check: two gaps, five problems

- scene: FINDINGS PAGE: kicker 'Code check · a fresh agent'; the findings page 'code-check/findings.md' as a list of nine keys, each with its answer on the right: on 'gaps' the two step rows land ('Step 3 · the hosted hook' → 'deviation', 'Step 3 · the server outlives the session' → 'fixed'), with 'Step 5' and 'D-066' → 'pending'; on 'problems' the five path rows ('docs/hosted-review.md:89' → 'fixed', and four more); on 'bugs' four of them take '· bug'; on 'overwrite' the last row 'system-review.mjs:142' takes the coral edge and, beside the page, before → after: 'review.md, overwritten' struck, 'reviews/<id>.md, one per review'
- voiceover: "A fresh agent checked the code against the plan: two step gaps, and five real problems. Four were bugs, each now fixed with a test; one: a second system-video review would overwrite the first. The findings and answers are one click away."
- duration: 14.78s
- transition_in: crossfade
- status: animated
- src: compositions/frames/35-code-check.html
- type: social_proof
- persuasion: The check working
- beat: Focus
- blueprint: compose
- detail: code-check-findings
- detail_kind: table
- detail_title: Every finding, and its answer
- detail_why: The findings and answers are one click away.
- focal: the check working: a real bug found and fixed
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: The code check: two gaps, five problems.
keyMessage: A fresh agent checked the code against the plan:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fresh'): page lands, timed to the start of the word.
Scene 3 (on 'gaps'): gaps lands, timed to the start of the word.
Scene 4 (on 'problems'): probs lands, timed to the start of the word.
Scene 5 (on 'bugs'): bugs lands, timed to the start of the word.
Scene 6 (on 'overwrite'): fix lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 36 — Quick check: two reviews back to back

- scene: SPINE + QUESTION: kicker 'Quick check · Step 4'; the question in serif; three option cards (A 'are overwritten', B 'stay in its own file', C 'merge into one file'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. Two system-video reviews arrive back to back. What happens to the first one's answers?"
- duration: 5.96s
- transition_in: crossfade
- status: animated
- src: compositions/frames/36-check-2.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 4
- quiz: k2
- question: Two system-video reviews arrive back to back. The first one's answers…
- option_a: are overwritten
- option_b: stay in its own file
- option_c: merge into one file
- answer: b
- explain: Each review now has its own file, reviews/<id>.md, and review.md is only their index (m52, after the code check).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: two reviews back to back.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'back'): o1 lands, timed to the start of the word.
Scene 3 (on 'happens'): o2 lands, timed to the start of the word.
Scene 4 (on 'answers'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 37 — What ran

- scene: RESULTS: kicker 'What ran'; three result tiles, each on its word: '5 specs pass' (narrate · loop · system-review · 2 player specs), 'A real wake' (curl POST → review --wait claimed it), 'A headless run' (no session open: claude -p fixed it, verified, notified in 9 min 13 s); the note 'full suite: not re-run'
- voiceover: "What ran: this plan's five spec files pass; the full suite was not run again. A real post woke a waiting session, and a real review, with no session open, started claude dash p."
- duration: 11.77s
- transition_in: crossfade
- status: animated
- src: compositions/frames/37-ran.html
- type: social_proof
- persuasion: Named result
- beat: Focus
- blueprint: compose
- focal: the result
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What ran.
keyMessage: What ran:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'five'): r1 lands, timed to the start of the word.
Scene 3 (on 'woke'): r2 lands, timed to the start of the word.
Scene 4 (on 'open'): r3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 38 — Still to come, and your call

- scene: STEPS AND TAGS, no diagram: kicker 'What landed · 5 steps, 16 calls'; the five steps as a list at reading size with their tags ('4 calls', '1 call', '7 + dev', '3 + 1 ask', 'half proven' in coral-deep, the one coral); on 'second' the line '2nd timed review: your Finish · retiming: not fixed'; on 'flag' the mono line '16 calls · 1 deviation · accept or flag each' and 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "Still to come: the second timed review, which is your Finish on this video. Re-timing the frames took three and a half of the nine minutes, by hand, and is not fixed. Flag a call, or accept."
- duration: 13.68s
- transition_in: crossfade
- status: animated
- src: compositions/frames/38-end.html
- type: cta
- persuasion: What is pending + call to action
- beat: Resolve
- blueprint: compose
- focal: the result
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Still to come, and your call.
keyMessage: Still to come:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'second'): pend lands, timed to the start of the word.
Scene 3 (on 'Flag'): note lands, timed to the start of the word.
Scene 4 (last ≥ 0.6 s): held read, nothing moves.

## Frame 39 — Round 2: what your review asked for

- chapter_start: Round 2: what your review asked for
- scene: FULL RAIL: kicker 'Round 2 · Part 6'; the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan); 'Steps 1–5 · reported' over the hero 'From your review' to the right; the five slots fill on 'five'
- voiceover: "Round two. Your review of round one asked what a run nobody is watching may do, and the plan grew five steps: six to ten."
- duration: 8.09s
- transition_in: crossfade
- status: animated
- src: compositions/frames/39-opener-r2.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Round 2: what your review asked for.
keyMessage: Round two.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'five'): the five slots fill, one after another.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 40 — Four decisions: D-082 to D-085

- scene: FOUR DECISIONS, no rail: kicker 'Round 2 · 4 decisions'; four rows stacked, each landing on its word, its step on the left and its ledger id on the right: '6 · Auto mode, in the sandbox · D-082' (on 'auto'), '7 · A check per step, and more · D-083' (on 'check'), '8 · Tags stop; your record fades them · D-084' (on 'Tagged'), '9 · Trim the text and the files · D-085' (on 'trimmed'); the row being said takes the coral edge, the last one keeps it
- voiceover: "You decided four questions. A run nobody is watching runs in auto mode, inside the sandbox. A quick check per step, plus wherever there is something to predict. Tagged calls stop, and your record decides which tags fade. And the text and the files are trimmed."
- duration: 16.67s
- transition_in: crossfade
- status: animated
- src: compositions/frames/40-decided-r2.html
- type: benefit_highlight
- persuasion: What was decided
- beat: Focus
- blueprint: compose
- focal: the four decisions, one per step
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Four decisions: D-082 to D-085.
keyMessage: You decided four questions.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'auto'): d1 lands, timed to the start of the word.
Scene 3 (on 'check'): d2 lands, timed to the start of the word.
Scene 4 (on 'Tagged'): d3 lands, timed to the start of the word.
Scene 5 (on 'trimmed'): d4 lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 41 — What landed in round 2

- scene: STEPS AND CALLS: kicker 'What landed · round 2'; four step tiles 'Step 6' … 'Step 9', each marked 'built', landing on 'built'; a dashed tile 'Step 10 · next plan' on 'waits'; below, a grid of 20 small tiles, one per call: 16 on 'sixteen', 4 more (deviations) on 'deviations'; on 'Twelve' the 12 calls and 4 deviations that stop fill ink and take the label '16 stop' (the coral edge on that group); on 'share' the other 4 stay grey with '4 on a sheet'
- voiceover: "Steps six to nine are built, in four commits, and step ten waits for the next plan. The build made sixteen calls the plan did not, and four deviations. Twelve calls and every deviation stop for you; the other four calls share a sheet at the end of their part."
- duration: 16.11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/41-landed-r2.html
- type: hook
- persuasion: The whole round before any step
- beat: Overview
- blueprint: compose
- focal: 4 steps built; 16 stop, 4 on a sheet
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What landed in round 2.
keyMessage: Steps six to nine are built, in four commits, and step ten waits for the next plan.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'built'): st lands, timed to the start of the word.
Scene 3 (on 'waits'): s10 lands, timed to the start of the word.
Scene 4 (on 'sixteen'): calls lands, timed to the start of the word.
Scene 5 (on 'deviations'): devs lands, timed to the start of the word.
Scene 6 (on 'Twelve'): stop lands, timed to the start of the word.
Scene 7 (on 'share'): grp lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 42 — Next: part 7

- scene: FULL RAIL: the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan) as reported so far; 'Next · Part 7' and the hero 'Unattended runs' to the right
- voiceover: "Next, part seven: step six, the run nobody is watching."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/42-closer-6.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 7.
keyMessage: Next, part seven:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 43 — Part 7: step 6

- chapter_start: Step 6: auto mode, in the sandbox
- scene: FULL RAIL: kicker 'Round 2 · Part 7'; the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan); the hero 'Step 6' to the right; on 'six' slot 6 takes a 2 px ink border
- voiceover: "Part seven: step six, what a run nobody is watching may do."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/43-opener-7.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 7: step 6.
keyMessage: Part seven:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'six'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 44 — Step 6: auto mode, inside the sandbox; the file tools fenced too

- scene: SPINE + COMMAND + THE HOOK TRIED: kicker 'Step 6 · Unattended runs', track chip 'independent · decided · D-082'; on 'auto' the command that ships, in two lines ('claude --permission-mode auto --permission-prompts none' / '--settings '{"sandbox":{…},"hooks":{"PreToolUse":…}}' -p'); four chips under it, each on its word: 'a classifier approves each action' (on 'classifier'), 'a prompt: refused' (on 'prompt'), 'shell writes: this repo only' (on 'Shell'), 'file tools: this repo only · a hook' (on 'hook', new since the review); on 'Tried' the box 'Tried for real' on the right, four Write rows landing on their words: 'in the repo · written' (on 'write'), '/tmp/… · refused' (on 'temp'), '$HOME/… · refused' (on 'home'), 'a subagent's, $HOME · refused' (on 'subagent'); on 'refused' the three refused rows outlined coral (the one coral)
- voiceover: "Step six. The run nobody is watching is Claude Code in auto mode, in its sandbox: a classifier approves each action, and anything that would prompt is refused. Shell writes stay in the repo, and since your review, a hook keeps the file tools there too. Tried for real: a write in the repo went through; writes to the temp folder, to your home folder, and from a subagent were refused."
- duration: 21.22s
- transition_in: crossfade
- status: animated
- src: compositions/frames/44-step-6.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: the command that ships; the file tools fenced, tried for real
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 6: auto mode, inside the sandbox; the file tools fenced too.
keyMessage: Step six.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'auto'): cmd lands, timed to the start of the word.
Scene 3 (on 'classifier'): c1 lands, timed to the start of the word.
Scene 4 (on 'prompt'): c2 lands, timed to the start of the word.
Scene 5 (on 'Shell'): c3 lands, timed to the start of the word.
Scene 6 (on 'hook'): c4 lands, timed to the start of the word.
Scene 7 (on 'Tried'): proof lands, timed to the start of the word.
Scene 8 (on 'write'): w1 lands, timed to the start of the word.
Scene 9 (on 'temp'): w2 lands, timed to the start of the word.
Scene 10 (on 'home'): w3 lands, timed to the start of the word.
Scene 11 (on 'subagent'): w4 lands, timed to the start of the word.
Scene 12 (on 'refused (last)'): refused rows lit lands, timed to the start of the word.
Scene 13 (last ≥ 0.6 s): held read, nothing moves.

## Frame 45 — Quick check: a write outside the repo

- scene: SPINE + QUESTION: kicker 'Quick check · Step 6'; the question in serif; three option cards (A 'It is refused', B 'It is written', C 'The run stops and asks'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. The run writes a file outside the repo with its file tool, not the shell. What happens?"
- duration: 5.96s
- transition_in: crossfade
- status: animated
- src: compositions/frames/45-check-3.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 6
- quiz: k3
- question: The run writes a file outside the repo with its file tool, not the shell. What happens?
- option_a: It is refused
- option_b: It is written
- option_c: The run stops and asks
- answer: a
- explain: It is refused: since your review, a hook in the command's settings refuses Write, Edit, MultiEdit and NotebookEdit to any path outside the repo, a subagent's included; the sandbox itself fences only the shell. Real runs: the writes to /tmp and $HOME were refused, the one in the repo went through (walkthrough.md, Step 6).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: a write outside the repo.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'file'): o1 lands, timed to the start of the word.
Scene 3 (on 'shell'): o2 lands, timed to the start of the word.
Scene 4 (on 'happens'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 46 — Step 6: its three limits, as you decided

- scene: SPINE + THREE DECISIONS: kicker 'Step 6 · Decided by you'; three rows, each on its word, the limit on the left and your answer on the right: '1 · file tools outside the repo → refused by a hook' (on 'file'), its tag 'changed' (on 'fenced'), '2 · a signed git commit → outside: git commit *' (on 'Git'), '3 · no strict sandbox → checked first; the review waits' (on 'strict'); on 'waits' rows 2 and 3 take 'built' in coral-deep (the one accent; row 1's 'changed' in the same); on 'Codex' the chip 'codex, opencode: no sandbox check', on 'references' the line 'docs/reference.md · Other agents'; not calls: nothing to accept or flag here
- voiceover: "You decided each limit the proof found. The file tools, at your request, are now fenced too, by that hook. Git commit runs outside the sandbox, so commits stay signed. Where the strict sandbox cannot start, no run starts, and a review waits for a session. Codex and opencode commands skip that check; the reference's Other agents section says what is Claude Code's alone."
- duration: 21.13s
- transition_in: crossfade
- status: animated
- src: compositions/frames/46-limits-decided.html
- type: feature_showcase
- persuasion: What the owner decided
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: the owner's three answers; the first changed after review; other agents
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 6: its three limits, as you decided.
keyMessage: You decided each limit the proof found.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'file'): l1 lands, timed to the start of the word.
Scene 3 (on 'fenced'): bb1 lands, timed to the start of the word.
Scene 4 (on 'Git'): l2 lands, timed to the start of the word.
Scene 5 (on 'strict'): l3 lands, timed to the start of the word.
Scene 6 (on 'waits'): bb lands, timed to the start of the word.
Scene 7 (on 'Codex'): oa lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 47 — Deviation: the proof ran on a weaker sandbox

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 6'; spine tick 6 live (the round-2 spine, steps 6–10); on the right, a small table 'The sandbox: the proof against what ships', the row 'enableWeakerNestedSandbox · true · not set' marked, outlined coral (the frame's one coral), with the worked-example chip 'as root: no working shell' under it (on 'root'); on 'weaker' the card 'Chose · A weaker sandbox' (2 px ink border) lands in the left column; on 'untested' the card 'Instead of · The one that ships' lands at ink 55 %; under them the check chip 'walkthrough.md · Deviations'; held — the player pauses here and asks Accept / Flag
- voiceover: "One deviation, said plainly: the proof ran on a weaker sandbox than the one that ships. This container runs as root, where the strict sandbox leaves the run no working shell. The shipped setting is untested on a normal machine."
- duration: 13.71s
- transition_in: crossfade
- status: animated
- src: compositions/frames/47-deviation-sandbox.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: d4
- chose: Deviation from step 6: the re-run of the step 5 proof used enableWeakerNestedSandbox, which the shipped setting does not carry, because this container runs as root and the strict sandbox leaves such a run with no working shell
- instead_of: Step 6 as written: re-run the step 5 proof with the setting that ships
- why: under root the strict sandbox fails (uid_map: Operation not permitted) and failIfUnavailable does not catch it; the command that ships is proved as far as auto mode, the refused prompts and the server's notification, and its strict sandbox is untested on a normal macOS or Linux machine
- check: walkthrough.md · Deviations and Round 2's code check (Step 6); .reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: the proof ran on a weaker sandbox.
keyMessage: One deviation, said plainly:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'weaker'): chose lands, timed to the start of the word.
Scene 3 (on 'root'): example lands, timed to the start of the word.
Scene 4 (on 'untested'): instead lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 48 — Call A17: the sandbox settings are in the command

- scene: SPINE + PROTOTYPE: kicker 'Call A17 · Step 6'; spine tick 6 live (the round-2 spine, steps 6–10); on the right, the file .reelplanning/config.json, its line "'{\"sandbox\":{\"enabled\":true, …}}' -p\"" marked, outlined coral (the frame's one coral), with the worked-example chip 'your own sessions: unfenced' under it (on 'only'); on 'inline' the card 'Chose · Inline in the command' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A settings file' lands at ink 55 %; under them the check chip '.reelplanning/config.json'; held — the player pauses here and asks Accept / Flag
- voiceover: "The sandbox settings sit inline in the command, rather than in a committed Claude settings file: only the run nobody is watching is fenced, not every session in the repo."
- duration: 10.38s
- transition_in: crossfade
- status: animated
- src: compositions/frames/48-call-a17.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a17
- chose: The sandbox settings are inline in the command's --settings, not a committed .claude/settings.json
- instead_of: a committed .claude/settings.json
- why: only the run nobody is watching is fenced, not every session in the repo; reel init already writes the one line
- check: .reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A17: the sandbox settings are in the command.
keyMessage: The sandbox settings sit inline in the command, rather than in a committed Claude settings file:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'inline'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'only'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 49 — Call A18: no sandbox, no run, and now it says so

- scene: SPINE + PROTOTYPE: kicker 'Call A18 · Step 6'; spine tick 6 live; on the right, a small table 'Where a review starts a run', the row 'Linux without bubblewrap · none' marked, outlined coral (the frame's one coral), with the worked-example chip 'no bubblewrap → no run' under it (on 'bubblewrap'); on 'headless' the card 'Chose · No sandbox: no run' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Run unfenced, warn' lands at ink 55 %; under them the check chip 'failIfUnavailable'; after review, on 'README' the chip 'README · Unattended runs need Claude Code's sandbox', on 'starts' a terminal with the server's start-up line '△ unattended runs are off on this machine: …'; held — the player pauses here and asks Accept / Flag
- voiceover: "Where the sandbox cannot run, such as native Windows or Linux without bubblewrap, there is no headless run at all, rather than one that runs unfenced with a warning. As you asked, that is now said: in a note in the README, and in one line when the review server starts: unattended runs are off on this machine, and why."
- duration: 18.14s
- transition_in: crossfade
- status: animated
- src: compositions/frames/49-call-a18.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a18
- chose: failIfUnavailable: true: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all (after review: kept, and now said: a README note, and one line when the review server starts, 'unattended runs are off on this machine: …', which the Finish panel repeats)
- instead_of: the default, which runs unsandboxed with a warning
- why: D-082 chose the fence; no run should go unfenced quietly
- check: .reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A18: no sandbox, no run, and now it says so.
keyMessage: No sandbox, no run; and now the README and the server say so.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'bubblewrap'): example lands, timed to the start of the word.
Scene 3 (on 'headless'): chose lands, timed to the start of the word.
Scene 4 (on 'rather'): instead lands, timed to the start of the word.
Scene 5 (on 'README'): readme lands, timed to the start of the word.
Scene 6 (on 'starts'): term lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 50 — Call A19: nothing runs outside the fence

- scene: SPINE + PROTOTYPE: kicker 'Call A19 · Step 6'; spine tick 6 live (the round-2 spine, steps 6–10); on the right, a small table 'A command the sandbox blocks', the row 'git commit, signed by a local agent · runs outside · signed' marked, outlined coral (the frame's one coral), with the worked-example chip 'except git commit *' under it (on 'signed'); on 'Nothing' the card 'Chose · Nothing outside it' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · An approved retry' lands at ink 55 %; under them the check chip 'allowUnsandboxedCommands'; held — the player pauses here and asks Accept / Flag
- voiceover: "Nothing runs outside the fence, rather than letting the classifier approve a retry outside it. Otherwise the fence is only advice. The one exception is now git commit, so signed commits work: your answer, built since."
- duration: 13.37s
- transition_in: crossfade
- status: animated
- src: compositions/frames/50-call-a19.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a19
- chose: allowUnsandboxedCommands: false: nothing runs outside the fence, so a commit signed through a local agent fails
- instead_of: letting the classifier approve an unsandboxed retry
- why: otherwise the fence is advice
- check: .reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A19: nothing runs outside the fence.
keyMessage: Nothing runs outside the fence, rather than letting the classifier approve a retry outside it.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Nothing'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'signed'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 51 — Call A20: the server says when the run ends

- scene: SPINE + PROTOTYPE: kicker 'Call A20 · Step 6'; spine tick 6 live (the round-2 spine, steps 6–10); on the right, a small table 'When the run the server started ends', the row 'marked the review done · ready · the page's link' marked, outlined coral (the frame's one coral), with the worked-example chip 'first run: a dead link' under it (on 'dead'); on 'server' the card 'Chose · The server tells you' (2 px ink border) lands in the left column; on 'Before' the card 'Instead of · The run notifies itself' lands at ink 55 %; under them the check chip 'review.mjs · afterRun'; held — the player pauses here and asks Accept / Flag
- voiceover: "The review server tells you when the run it started ends: ready, or stopped, with its log. Before, the run notified itself, but a sandboxed run cannot reach the server: the first real one sent a dead link."
- duration: 12.64s
- transition_in: crossfade
- status: animated
- src: compositions/frames/51-call-a20.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: a20
- chose: The review server tells the reviewer when the run it started ends (ready, or stopped with its log); review --detach inside a run does nothing
- instead_of: the run notifying through review --detach
- why: a sandboxed run cannot see or reach the server: the first real run sent a dead link
- check: scripts/review.mjs afterRun; scripts/lib/inbox.mjs startAgent
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A20: the server says when the run ends.
keyMessage: The review server tells you when the run it started ends:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'server'): chose lands, timed to the start of the word.
Scene 3 (on 'Before'): instead lands, timed to the start of the word.
Scene 4 (on 'dead'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 52 — Deviation D2: Codex's flag

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 6'; spine tick 6 live; on the right, the file .reelplanning/config.json · its note, its line "codex exec --sandbox workspace-write" marked, outlined coral (the frame's one coral), with the worked-example chip 'full-auto: deprecated' under it (on 'deprecated'); on 'workspace' the card 'Chose · Its workspace sandbox' (2 px ink border) lands in the left column; on 'plan's' the card 'Instead of · The plan's full-auto' lands at ink 55 %; under them the check chip 'config.json · the note'; on 'approval' the chip 'its auto modes: when a Codex agent works on this'; held — the player pauses here and asks Accept / Flag
- voiceover: "A small deviation: the note names Codex's equivalent as its workspace-write sandbox, not the plan's full-auto flag, which is deprecated and prints a warning. Like the plan's, it is untested. Codex's own auto and approval modes wait, as you said, until a Codex agent works on this."
- duration: 17.55s
- transition_in: crossfade
- status: animated
- src: compositions/frames/52-deviation-codex.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: d2
- chose: Codex's equivalent is codex exec --sandbox workspace-write, not the plan's codex exec --full-auto (after review: no change; Codex's own auto and approval modes wait until a Codex agent works on this, as docs/reference.md "Other agents" says)
- instead_of: the plan's flag
- why: --full-auto is deprecated and prints a warning
- check: .reelplanning/config.json note
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation D2: Codex's flag.
keyMessage: A small deviation:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'workspace'): chose lands, timed to the start of the word.
Scene 3 (on 'plan's'): instead lands, timed to the start of the word.
Scene 4 (on 'deprecated'): example lands, timed to the start of the word.
Scene 5 (on 'approval'): later lands, timed to the start of the word.
Scene 6 (last ≥ 0.6 s): held read, nothing moves.

## Frame 53 — Deviation D3: no list of allowed hosts

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 6'; spine tick 6 live (the round-2 spine, steps 6–10); on the right, a small table 'A command names a host', the row 'the list: kept by hand · no list' marked, outlined coral (the frame's one coral), with the worked-example chip 'network: not tested here' under it (on 'tested'); on 'hosts' the card 'Chose · The classifier judges' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A list of named hosts' lands at ink 55 %; under them the check chip '.reelplanning/config.json'; held — the player pauses here and asks Accept / Flag
- voiceover: "And one more: no list of allowed hosts, rather than the plan's network to named hosts. In auto mode the classifier reviews each host a command names; a list needs upkeep. The sandbox's network was not tested here."
- duration: 13.73s
- transition_in: crossfade
- status: animated
- src: compositions/frames/53-deviation-hosts.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 6
- autonomy: d3
- chose: No list of allowed hosts: in auto mode the classifier reviews each host a command names
- instead_of: the plan's "network to named hosts"
- why: a list needs upkeep; untested here, the sandbox had no network in this container
- check: .reelplanning/config.json
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation D3: no list of allowed hosts.
keyMessage: And one more:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'hosts'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'tested'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 54 — Next: part 8

- scene: FULL RAIL: the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan) as reported so far, the part's new slot tag ('4 + 3 dev') landing coral-deep and settling to ink; 'Next · Part 8' and the hero 'Checks and stops' to the right
- voiceover: "Next, part eight: more quick checks, and fewer stops."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/54-closer-7.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 8.
keyMessage: Next, part eight:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 55 — Part 8: steps 7 and 8

- chapter_start: Steps 7 and 8: more checks, fewer stops
- scene: FULL RAIL: kicker 'Round 2 · Part 8'; the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan), the calls reported so far as slot tags (6: '4 + 3 dev'); the hero 'Steps 7 and 8' to the right; on 'seven' slot 7 takes a 2 px ink border
- voiceover: "Part eight: step seven, more quick checks, and step eight, fewer stops."
- duration: 4.53s
- transition_in: crossfade
- status: animated
- src: compositions/frames/55-opener-8.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 8: steps 7 and 8.
keyMessage: Part eight:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'seven'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 56 — Step 7: a quick check per step, and a wrong answer is a comment

- scene: SPINE + RULE + A REAL WRONG ANSWER: kicker 'Step 7 · More quick checks', track chip 'independent · decided · D-083'; on the left the rule, two tiles on their words: 'At least 1 per step' (on 'least'), '+ 1 wherever you could guess wrong' (on 'guess'); on the right the quick-check sheet as you answered it in round 2 (k3: A 'The sandbox refuses it' your answer, B 'It is written' round 2's answer) (on 'Answer'); on 'expected' its box 'Expected something else? Say how it should work' with your words, 'we'd expect the other tools to do this too', the coral edge (the one coral); on 'comment' the chip 'a comment on step 6'; on 'now' the chip '→ file tools fenced by a hook'
- voiceover: "Step seven is about quick checks. Every step gets at least one, plus one wherever you could guess wrong. Answer one wrong, and the player asks how you expected it to work; your words reach me as a comment on that step. Your answer at step six did just that: you expected the file tools kept in the repo, so now they are."
- duration: 17.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/56-step-7.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 7
- focal: the rule; a wrong answer's words become a comment, and a change
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 7: a quick check per step, and a wrong answer is a comment.
keyMessage: Step seven is about quick checks.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'least'): r1 lands, timed to the start of the word.
Scene 3 (on 'guess'): r2 lands, timed to the start of the word.
Scene 4 (on 'Answer'): sheet lands, timed to the start of the word.
Scene 5 (on 'expected'): box lands, timed to the start of the word.
Scene 6 (on 'comment'): cm lands, timed to the start of the word.
Scene 7 (on 'now'): fx lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 57 — Quick check: a wrong answer with a note

- scene: SPINE + QUESTION: kicker 'Quick check · Step 7'; the question in serif; three option cards (A 'Nothing: the check only scores you', B 'A comment on that step', C 'Saved for the next plan'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. You answer a check wrong, and type how you expected it to work. What happens to your words?"
- duration: 5.61s
- transition_in: crossfade
- status: animated
- src: compositions/frames/57-check-4.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 7
- quiz: k4
- question: You answer a check wrong, and type how you expected it to work. What happens to your words?
- option_a: Nothing: the check only scores you
- option_b: A comment on that step
- option_c: Saved for the next plan
- answer: b
- explain: They reach the agent as a comment on that step (in the review's reviews/<id>.md), and the plan or the code is changed to match, as your note on k3 fenced the file tools; words that would overturn a ledger decision become a new plan.
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: a wrong answer with a note.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'wrong'): o1 lands, timed to the start of the word.
Scene 3 (on 'expected'): o2 lands, timed to the start of the word.
Scene 4 (on 'words'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 58 — Step 8: tagged calls stop

- scene: SPINE + A CALL'S ROW + THE RULE: kicker 'Step 8 · Stop where it matters', track chip 'independent · decided · D-084'; on 'tags' a call's row from walkthrough.md, 'A18 · No sandbox: no run', with its tags '[visible, hard-to-undo, close]' in brackets at the end; then the rule as three rows, each on its word: 'deviation → always stops', 'no tag → one sheet per part', 'a tag → stops, until your record says' (the coral edge, the one coral); on 'record' the chip 'the ledger: every verdict'
- voiceover: "Step eight. Each call now carries tags: visible, hard to undo, close, or deviation. A deviation always stops. An untagged call never does: it joins one sheet at the end of its part. A tagged call stops, and your record in the ledger decides which tags fade."
- duration: 16.87s
- transition_in: crossfade
- status: animated
- src: compositions/frames/58-step-8.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 8
- focal: the tags, and the three-line rule
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 8: tagged calls stop.
keyMessage: Step eight.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'tags'): row lands, timed to the start of the word.
Scene 3 (on 'deviation'): r1 lands, timed to the start of the word.
Scene 4 (on 'untagged'): r2 lands, timed to the start of the word.
Scene 5 (on 'tagged'): r3 lands, timed to the start of the word.
Scene 6 (on 'record'): rec lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 59 — Quick check: a tag accepted ten times

- scene: SPINE + QUESTION: kicker 'Quick check · Step 8'; the question in serif; three option cards (A 'stops, as every tagged call does', B 'joins its part's grouped sheet', C 'is left out of the video'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. Your last ten calls tagged visible were all accepted. The next call is tagged only visible. What happens to it?"
- duration: 7.51s
- transition_in: crossfade
- status: animated
- src: compositions/frames/59-check-5.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 8
- quiz: k5
- question: Your last ten calls tagged visible were all accepted. The next call is tagged only visible. It…
- option_a: stops, as every tagged call does
- option_b: joins its part's grouped sheet
- option_c: is left out of the video
- answer: b
- explain: Once each of a call's tags has ten accepts in a row across plans, it no longer stops on its own: it is listed on its part's grouped sheet, and one flag on a visible call makes visible stop again (D-084).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: a tag accepted ten times.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'ten'): o1 lands, timed to the start of the word.
Scene 3 (on 'only'): o2 lands, timed to the start of the word.
Scene 4 (on 'happens'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 60 — Call A22: every verdict goes in the ledger

- scene: SPINE + PROTOTYPE: kicker 'Call A22 · Step 8'; spine tick 8 live (the round-2 spine, steps 6–10); on the right, a small table 'What reel record keeps, per call', the row 'flagged · flagged · its tags · your words' marked, outlined coral (the frame's one coral), with the worked-example chip 'a flag resets its tags' under it (on 'needs'); on 'every' the card 'Chose · Every verdict kept' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Only accepted calls' lands at ink 55 %; under them the check chip 'reel.mjs · record'; held — the player pauses here and asks Accept / Flag
- voiceover: "The ledger now keeps every verdict, flags and your own words included, and a new verdict on a call replaces its earlier accept, rather than keeping only accepted calls. The stop rule needs the flags."
- duration: 12.49s
- transition_in: crossfade
- status: animated
- src: compositions/frames/60-call-a22.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 8
- autonomy: a22
- chose: Flagged and own-words calls enter the ledger with status flagged/own; a new verdict on a call supersedes its earlier accept
- instead_of: keeping only accepted calls
- why: the stop rule needs flags; the old rule left an accept in force after a later flag
- check: scripts/reel.mjs record
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A22: every verdict goes in the ledger.
keyMessage: The ledger now keeps every verdict, flags and your own words included, and a new verdict on a call replaces its earlier accept, rather than keeping only accepted calls.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'every'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'needs'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 61 — Call A24: the grouped sheet

- scene: SPINE + PROTOTYPE, WORKED: kicker 'Call A24 · Step 8'; spine tick 8 live; on the right, the player's grouped sheet: 'A21 · Tags in brackets at the end of “chose”', 'A23 · A tag's run counts across all plans', each with its Flag, and 'A · Accept all' with 'accepts every call you have not flagged'; on 'Flag' the card 'Chose · A Flag each, Accept all' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Words and a key each' at ink 55 %; under them the check chip 'player · askGroup'; the worked example on its words: 'flag' A21's Flag turns 'Flagged', outlined coral (the one coral); 'press' Accept all fills; 'accepted' A23's Flag turns 'Accepted'; 'stays' the chip 'A21: still flagged'; on 'comment' the chip 'words: a comment'; held — the player pauses here and asks Accept / Flag
- voiceover: "On the grouped sheet, each call has its own Flag, and one Accept all, with no box for your own words, rather than words and a key per call. Accept all takes only the calls you have not flagged: flag A21, press Accept all, and A23 is accepted while A21 stays flagged. A comment still works."
- duration: 18.48s
- transition_in: crossfade
- status: animated
- src: compositions/frames/61-call-a24.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 8
- autonomy: a24
- chose: The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict
- instead_of: own words and a key per call
- why: keeps the sheet short; a comment still works
- check: packages/player/reelplanning-player.js askGroup, flagInGroup
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A24: the grouped sheet.
keyMessage: Accept all takes only the calls you have not flagged.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Flag'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'flag A21'): A21 flagged lands, timed to the start of the word.
Scene 5 (on 'press'): accept all pressed lands, timed to the start of the word.
Scene 6 (on 'accepted'): A23 accepted lands, timed to the start of the word.
Scene 7 (on 'stays'): still flagged lands, timed to the start of the word.
Scene 8 (on 'comment'): example lands, timed to the start of the word.
Scene 9 (last ≥ 0.6 s): held read, nothing moves.

## Frame 62 — Quick check: flag one, then Accept all

- scene: SPINE + QUESTION: kicker 'Quick check · Step 8'; the question in serif, naming A21; three option cards (A 'is accepted with the rest', B 'stays flagged', C 'blocks Accept all until unflagged'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. On that sheet you flag A21, then press Accept all. What happens to A21?"
- duration: 5.89s
- transition_in: crossfade
- status: animated
- src: compositions/frames/62-check-6.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 8
- quiz: k6
- question: On the grouped sheet you flag A21, then press Accept all. A21…
- option_a: is accepted with the rest
- option_b: stays flagged
- option_c: blocks Accept all until unflagged
- answer: b
- explain: It stays flagged: Accept all accepts only the calls you have not flagged (A23 here), and A21's flag becomes a note on its step (the player's acceptGroup).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: flag one, then Accept all.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'flag'): o1 lands, timed to the start of the word.
Scene 3 (on 'Accept'): o2 lands, timed to the start of the word.
Scene 4 (on 'A21 (last)'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 63 — Step 8's other calls: A21 and A23

- scene: SPINE + THE GROUPED SHEET: kicker 'Calls A21, A23 · Step 8'; the player's grouped sheet drawn as it opens here, '2 more calls from this part.', each call's row landing on its word ('A21 · Tags go in brackets at the end of “chose”' on 'written', 'A23 · A tag's run of accepts counts across all plans' on 'counted') with its own Flag, and on 'sheet' the button 'A · Accept all' with the coral edge (the one coral); held — the player pauses here and lists them, each flaggable, above Accept all
- voiceover: "Two more calls from step eight don't stop: where a call's tags are written, and how a run of accepts is counted. They share one sheet."
- duration: 7.81s
- transition_in: crossfade
- status: animated
- src: compositions/frames/63-group-8.html
- type: cta
- persuasion: The calls that don't stop, on one sheet
- beat: Focus
- blueprint: compose
- plan_step: 8
- autonomy_group: a21, a23
- focal: the grouped sheet: each call, its Flag, Accept all
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 8's other calls: A21 and A23.
keyMessage: Two more calls from step eight don't stop:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'written'): c1 lands, timed to the start of the word.
Scene 3 (on 'counted'): c2 lands, timed to the start of the word.
Scene 4 (on 'sheet'): acc lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 64 — Next: part 9

- scene: FULL RAIL: the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan) as reported so far, the part's new slot tags ('no calls', '2 + 2 grouped') landing coral-deep and settling to ink; 'Next · Part 9' and the hero 'Less scaffolding' to the right
- voiceover: "Next, part nine: step nine, less scaffolding."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/64-closer-8.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 9.
keyMessage: Next, part nine:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 65 — Part 9: step 9

- chapter_start: Step 9: less scaffolding
- scene: FULL RAIL: kicker 'Round 2 · Part 9'; the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan), the calls reported so far as slot tags (6: '4 + 3 dev', 7: 'no calls', 8: '2 + 2 grouped'); the hero 'Step 9' to the right; on 'nine' slot 9 takes a 2 px ink border
- voiceover: "Part nine: step nine, less scaffolding."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/65-opener-9.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 9: step 9.
keyMessage: Part nine:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'nine'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 66 — Step 9: half the text, one build, each review its own file

- scene: SPINE + BEFORE → AFTER: kicker 'Step 9 · Less scaffolding', track chip 'independent · decided · D-085'; on 'half' two bars shrink to about half, each with its count: 'SKILL.md 4,926 → 2,488 words', 'style guide 7,223 → 3,258'; on 'build' the command '$ reelplanning build <video-dir>' with 'narrate … verify: 8 stages'; on 'review' this plan's reviews/ folder, with round 1's walkthrough review 'walkthrough-20260924T031132Z.json'; on 'second' round 2's 'walkthrough-20260924T071728Z.json' lands beside it, outlined coral (the one coral); on 'never' the chip 'beside the first, never over it'
- voiceover: "Step nine trims the text and the files. The skill and the style guide are each about half as long, with the history moved to design notes. One command, build, runs narration through verify. And each review gets its own file, named by its time: a second review goes beside the first, never over it."
- duration: 17.76s
- transition_in: crossfade
- status: animated
- src: compositions/frames/66-step-9.html
- type: feature_showcase
- persuasion: Prototype of what landed, real values
- beat: Focus
- blueprint: compose
- plan_step: 9
- focal: half the words; one command; two reviews, two files
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 9: half the text, one build, each review its own file.
keyMessage: Step nine trims the text and the files.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'half'): t1 lands, timed to the start of the word.
Scene 3 (on 'build'): cmd lands, timed to the start of the word.
Scene 4 (on 'review'): dir lands, timed to the start of the word.
Scene 5 (on 'second'): r2 lands, timed to the start of the word.
Scene 6 (on 'never'): nv lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 67 — Quick check: a second review of the same plan

- scene: SPINE + QUESTION: kicker 'Quick check · Step 9'; the question in serif; three option cards (A 'Over the first: git keeps the old', B 'Beside the first, in its own file', C 'Merged into the first one's file'), each on its word; none marked — the player pauses and asks
- voiceover: "Quick check. You send a second review of the same plan. Where is it filed?"
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/67-check-7.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 9
- quiz: k7
- question: You send a second review of the same plan. Where is it filed?
- option_a: Over the first: git keeps the old
- option_b: Beside the first, in its own file
- option_c: Merged into the first one's file
- answer: b
- explain: Beside the first, in its own file: each review is filed once as reviews/<kind>-<time>.json with a short .md of what to act on beside it, and never overwritten; this plan's reviews/ holds round 1's and round 2's walkthrough reviews side by side (A25; scripts/lib/reviews.mjs).
- focal: the question and its three options
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Quick check: a second review of the same plan.
keyMessage: Quick check.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'second'): o1 lands, timed to the start of the word.
Scene 3 (on 'same'): o2 lands, timed to the start of the word.
Scene 4 (on 'filed'): o3 lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 68 — Call A25: one layout for reviews, migrated

- scene: SPINE + PROTOTYPE: kicker 'Call A25 · Step 9'; spine tick 9 live (the round-2 spine, steps 6–10); on the right, a small table '2026-09-22-m3-revise-loop/reviews/', the row 'walkthrough-20260924T031132Z.json · .md' marked, outlined coral (the frame's one coral), with the worked-example chip '16 reviews · 6 plans' under it (on 'six'); on 'kind' the card 'Chose · One layout, migrated' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Read both layouts' lands at ink 55 %; under them the check chip 'lib/reviews.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "Reviews are filed by kind and time, each with a short note beside it, and a migrate command moved all six plans to that layout, rather than reading both layouts. Other repos get the same path."
- duration: 12.41s
- transition_in: crossfade
- status: animated
- src: compositions/frames/68-call-a25.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a25
- chose: Reviews are filed as reviews/plan-<time>.json / walkthrough-<time>.json with an .md beside each, and migrate-reviews ships as a command that moved all six plans
- instead_of: reading both layouts
- why: one layout to read; other repos get the same path
- check: scripts/lib/reviews.mjs; scripts/migrate-reviews.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A25: one layout for reviews, migrated.
keyMessage: Reviews are filed by kind and time, each with a short note beside it, and a migrate command moved all six plans to that layout, rather than reading both layouts.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'kind'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'six'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 69 — Call A26: two resolve commands deleted

- scene: SPINE + PROTOTYPE: kicker 'Call A26 · Step 9'; spine tick 9 live (the round-2 spine, steps 6–10); on the right, a small table 'Four commands', the row 'resolve-plan · deleted' marked, outlined coral (the frame's one coral), with the worked-example chip 'scope: JSON only' under it (on 'scope'); on 'deleted' the card 'Chose · Two deleted' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · Keep all four' lands at ink 55 %; under them the check chip 'scripts/*-scope.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "The resolve-plan and resolve-walkthrough commands are deleted, rather than kept, since the resolved copies are gone. The two scope commands stay, printing JSON: the sorting is still used."
- duration: 11.66s
- transition_in: crossfade
- status: animated
- src: compositions/frames/69-call-a26.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a26
- chose: resolve-plan and resolve-walkthrough are deleted; revise-scope and walkthrough-scope stay as JSON printers
- instead_of: keeping all four
- why: the resolved copies are gone; the sorting is still used
- check: scripts/*-scope.mjs, scripts/lib/review-scope.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A26: two resolve commands deleted.
keyMessage: The resolve-plan and resolve-walkthrough commands are deleted, rather than kept, since the resolved copies are gone.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'deleted'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'scope'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 70 — Call A29: this checkout's tooling, in this repo

- scene: SPINE + PROTOTYPE: kicker 'Call A29 · Step 9'; spine tick 9 live; on the right, the file CLAUDE.md, its line "run this checkout's own tooling instead," marked, outlined coral (the frame's one coral); on 'checkout's' the card 'Chose · This checkout's tooling' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · The published version' at ink 55 %; under them the check chip 'CLAUDE.md'; your question answered: on 'both' the chip 'both work · no change', on 'Outside' the line 'outside this repo · npx -y reelplanning@<version>', on 'Inside' the line 'in this repo · node bin/reelplanning.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "This repo's instructions for agents tell one working here to run this checkout's own tooling, rather than the published version. You asked if that is local against npx: yes, and both work. Outside this repo, the published package; inside it, this checkout's tools, so a plan here is built with the code it changes. No change."
- duration: 18.74s
- transition_in: crossfade
- status: animated
- src: compositions/frames/70-call-a29.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a29
- chose: CLAUDE.md also tells an agent here to run this checkout's tooling rather than the published $RP (after review: yes, it is local vs npx, and both work: outside this repo the published package, inside it this checkout's own tools; no change)
- instead_of: moving only the autonomous-mode section
- why: a plan here should be built with the code it changes
- check: CLAUDE.md
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A29: this checkout's tooling, in this repo.
keyMessage: Both work: the published package outside this repo, this checkout's tools inside it.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'checkout's'): chose lands, timed to the start of the word.
Scene 3 (on 'tooling'): the CLAUDE.md line is outlined, timed to the start of the word.
Scene 4 (on 'rather'): instead lands, timed to the start of the word.
Scene 5 (on 'both'): nc lands, timed to the start of the word.
Scene 6 (on 'Outside'): o lands, timed to the start of the word.
Scene 7 (on 'Inside'): i lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 71 — Call A30: a detail's kind is a free word

- scene: SPINE + PROTOTYPE: kicker 'Call A30 · Step 9'; spine tick 9 live (the round-2 spine, steps 6–10); on the right, a small table 'detail new <video> <name> --kind …', the row 'timeline (no template) · the blank page' marked, outlined coral (the frame's one coral), with the worked-example chip '--kind timeline → blank' under it (on 'starting'); on 'free' the card 'Chose · Any word' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A list of seven' lands at ink 55 %; under them the check chip 'detail.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "A detail's kind is now a free word, and a kind with no template starts from the blank page, rather than a closed list of seven. The kinds were a starting point, not a rule."
- duration: 10.7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/71-call-a30.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a30
- chose: detail_kind is free-form and detail new --kind <anything> starts from the blank page; --step is gone
- instead_of: a closed list of seven kinds
- why: the kinds were a starting point, not a rule
- check: scripts/check-details.mjs, scripts/detail.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A30: a detail's kind is a free word.
keyMessage: A detail's kind is now a free word, and a kind with no template starts from the blank page, rather than a closed list of seven.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'free'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'starting'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 72 — Call A31: two details on one beat warn

- scene: SPINE + PROTOTYPE: kicker 'Call A31 · Step 9'; spine tick 9 live (the round-2 spine, steps 6–10); on the right, the file scripts/check-details.mjs, its line "if (b.names.length > 1) warn(at, `${b.names.length} detail tags:" marked, outlined coral (the frame's one coral), with the worked-example chip 'found by the code check' under it (on 'found'); on 'warn' the card 'Chose · Warn; the last opens' (2 px ink border) lands in the left column; on 'failing' the card 'Instead of · Fail the build' lands at ink 55 %; under them the check chip 'check-details.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "Two details on one beat now warn, instead of failing the build, and the last one opens. A second detail is a slip, not a broken page. The code check found this call; it is logged now."
- duration: 11.45s
- transition_in: crossfade
- status: animated
- src: compositions/frames/72-call-a31.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a31
- chose: Two details on one beat warn instead of failing the build; the last one opens
- instead_of: failing the build
- why: a second detail is a slip, not a broken page; the warning names it
- check: scripts/check-details.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A31: two details on one beat warn.
keyMessage: Two details on one beat now warn, instead of failing the build, and the last one opens.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'warn'): chose lands, timed to the start of the word.
Scene 3 (on 'failing'): instead lands, timed to the start of the word.
Scene 4 (on 'found'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 73 — Call A32: no kind, the blank page

- scene: SPINE + PROTOTYPE: kicker 'Call A32 · Step 9'; spine tick 9 live (the round-2 spine, steps 6–10); on the right, the file scripts/detail.mjs, its line "const kind = opt(\"kind\") || \"fresh\";" marked, outlined coral (the frame's one coral), with the worked-example chip 'the guide: a template first' under it (on 'guide'); on 'blank' the card 'Chose · The blank page' (2 px ink border) lands in the left column; on 'rather' the card 'Instead of · A template required' lands at ink 55 %; under them the check chip 'detail.mjs'; held — the player pauses here and asks Accept / Flag
- voiceover: "And detail new with no kind starts from the blank page, rather than requiring a template. The guide still says to start from a template when one fits."
- duration: 9.16s
- transition_in: crossfade
- status: animated
- src: compositions/frames/73-call-a32.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 9
- autonomy: a32
- chose: detail new with no --kind starts from the blank page (fresh)
- instead_of: requiring a template
- why: kinds are free-form now; the guide still says start from a template when one fits (D-024)
- check: scripts/detail.mjs
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Call A32: no kind, the blank page.
keyMessage: And detail new with no kind starts from the blank page, rather than requiring a template.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'blank'): chose lands, timed to the start of the word.
Scene 3 (on 'rather'): instead lands, timed to the start of the word.
Scene 4 (on 'guide'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 74 — Step 9's other calls: A27 and A28

- scene: SPINE + THE GROUPED SHEET: kicker 'Calls A27, A28 · Step 9'; the player's grouped sheet drawn as it opens here, '2 more calls from this part.', each call's row landing on its word ('A27 · build retimes against the narration the frames were timed to' on 'retimes', 'A28 · One on-screen budget: five new words a beat' on 'budget') with its own Flag, and on 'sheet' the button 'A · Accept all' with the coral edge (the one coral); held — the player pauses here and lists them, each flaggable, above Accept all
- voiceover: "Two more from step nine don't stop: what build retimes against before a commit, and one budget for on-screen words. They share one sheet."
- duration: 8.54s
- transition_in: crossfade
- status: animated
- src: compositions/frames/74-group-9.html
- type: cta
- persuasion: The calls that don't stop, on one sheet
- beat: Focus
- blueprint: compose
- plan_step: 9
- autonomy_group: a27, a28
- focal: the grouped sheet: each call, its Flag, Accept all
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Step 9's other calls: A27 and A28.
keyMessage: Two more from step nine don't stop:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'retimes'): c1 lands, timed to the start of the word.
Scene 3 (on 'budget'): c2 lands, timed to the start of the word.
Scene 4 (on 'sheet'): acc lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 75 — Next: part 10

- scene: FULL RAIL: the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan) as reported so far, the part's new slot tag ('6 + 2 grouped') landing coral-deep and settling to ink; 'Next · Part 10' and the hero 'The checks, and what's left' to the right
- voiceover: "Next, the last part: the code check, and what is not done."
- duration: 4.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/75-closer-9.html
- type: benefit_highlight
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Next: part 10.
keyMessage: Next, the last part:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (last ≥ 0.6 s): held read, nothing moves.

## Frame 76 — Part 10: the code check, and what is not done

- chapter_start: Round 2's code check, and what is not done
- scene: FULL RAIL: kicker 'Round 2 · Part 10'; the plan video's round-2 rail (steps 6–10: Unattended runs, More quick checks, Stop where it matters, Less scaffolding, Proof on the next plan), the calls reported so far as slot tags (6: '4 + 3 dev', 7: 'no calls', 8: '2 + 2 grouped', 9: '6 + 2 grouped'); the hero 'The checks' to the right; on 'ten' slot 10 takes a 2 px ink border
- voiceover: "Part ten, the last: what the code check found in round two, and what is not done."
- duration: 5.23s
- transition_in: crossfade
- status: animated
- src: compositions/frames/76-opener-10.html
- type: hook
- persuasion: Signposting
- beat: Transition
- blueprint: compose
- focal: the rail as reported so far
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Part 10: the code check, and what is not done.
keyMessage: Part ten, the last:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'ten'): lift lands, timed to the start of the word.
Scene 3 (last ≥ 0.6 s): held read, nothing moves.

## Frame 77 — Round 2's code check: three gaps, two calls, one bug

- scene: FINDINGS PAGE: kicker 'Code check · round 2'; the findings page 'code-check/findings.md' with a header line 'steps 1–4, 7–9 ✓ · 11 decisions hold' (on 'carried'); on 'gaps' three step rows ('Step 5 · 2nd real review' → 'deviation', 'Step 6 · the proof's sandbox' → 'deviation', 'Step 10 · the next plan' → 'not done'); on 'logged' two rows ('check-details.mjs:40' → 'A31', 'detail.mjs:24' → 'A32'); on 'bug' the row 'migrate-reviews.mjs:27' takes the coral edge (the one coral), and on 'fixed' its answer 'fixed · reviews.spec' and, beside the page, 'a README written by hand is kept'
- voiceover: "A fresh agent checked round two. Steps one to four and seven to nine carried, and all eleven decisions hold. It found three step gaps, two calls I had not logged, now A31 and A32, and one bug in migrate-reviews, now fixed with a test."
- duration: 16.05s
- transition_in: crossfade
- status: animated
- src: compositions/frames/77-code-check-r2.html
- type: social_proof
- persuasion: The check working
- beat: Focus
- blueprint: compose
- focal: six findings, each answered; one bug fixed
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Round 2's code check: three gaps, two calls, one bug.
keyMessage: A fresh agent checked round two.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'fresh'): page lands, timed to the start of the word.
Scene 3 (on 'carried'): ok lands, timed to the start of the word.
Scene 4 (on 'gaps'): gaps lands, timed to the start of the word.
Scene 5 (on 'logged'): calls lands, timed to the start of the word.
Scene 6 (on 'bug'): bug lands, timed to the start of the word.
Scene 7 (on 'fixed'): fix lands, timed to the start of the word.
Scene 8 (last ≥ 0.6 s): held read, nothing moves.

## Frame 78 — Deviation: one of step 5's two real reviews is still owed

- scene: SPINE + PROTOTYPE: kicker 'Deviation · Step 5'; spine tick 5 live (the round-1 spine, steps 1–5); on the right, a small table 'Step 5's two real reviews', the row 'a plan's walkthrough · not yet' marked, outlined coral (the frame's one coral), with the worked-example chip 'your next local Send' under it (on 'next'); on 'only' the card 'Chose · One review proven' (2 px ink border) lands in the left column; on 'walkthrough' the card 'Instead of · Two reviews, timed' lands at ink 55 %; under them the check chip 'walkthrough.md · Deviations'; held — the player pauses here and asks Accept / Flag
- voiceover: "One deviation carried from step five: only the system video's review has been through a headless run. A review of a plan's walkthrough has not; the next one you send from the local page will be it."
- duration: 11.72s
- transition_in: crossfade
- status: animated
- src: compositions/frames/78-deviation-proof.html
- type: cta
- persuasion: Choice made, alternative named, where to check
- beat: Focus
- blueprint: comparison-split
- plan_step: 5
- autonomy: d5
- chose: Step 5's second proof is still owed: only the system video's review has been through a headless run and timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's walkthrough has not
- instead_of: Step 5 as written: two real reviews, one of this plan's walkthrough and one of the system video, each timed from Finish to the notification
- why: only the system video's review has gone through a headless run so far; the next walkthrough review sent from the local page will be the second
- check: walkthrough.md · Deviations and Round 2's code check (Step 5)
- focal: the call's two cards, and the part it is about
- roles: outlined part = the signal · cards = foreground · spine = anchor · paper ground = background
- sfx: none

narrativeRole: Deviation: one of step 5's two real reviews is still owed.
keyMessage: One deviation carried from step five:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'only'): chose lands, timed to the start of the word.
Scene 3 (on 'walkthrough'): instead lands, timed to the start of the word.
Scene 4 (on 'next'): example lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.

## Frame 79 — Not done

- scene: NOT DONE: kicker 'Not done'; five rows, each on its word: 'Step 10 · the next plan' with its line 'wrong checks counted · stops against accepts' (the coral edge, the one coral), 'The strict sandbox · untested on a normal machine', 'The file-tools hook · Claude Code's own tools; not an MCP server's writes', 'Codex, opencode · not run; a stand-in only', 'A headless run · npx reelplanning@0.1.0, older than this code'
- voiceover: "Not done. Step ten waits for the next plan, the Bob Dylan site redone from scratch. The strict sandbox is untested on a normal machine. The new hook fences Claude Code's own file tools, not an MCP server that writes files. Codex and opencode have not run; only a stand-in has. And a headless run uses the published tool, older than this code."
- duration: 21s
- transition_in: crossfade
- status: animated
- src: compositions/frames/79-not-done-r2.html
- type: social_proof
- persuasion: What is pending
- beat: Focus
- blueprint: compose
- focal: step 10 waiting, and what is still open
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: Not done.
keyMessage: Not done.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'ten'): n1 lands, timed to the start of the word.
Scene 3 (on 'strict'): n2 lands, timed to the start of the word.
Scene 4 (on 'hook'): n3 lands, timed to the start of the word.
Scene 5 (on 'Codex'): n4 lands, timed to the start of the word.
Scene 6 (on 'published'): n5 lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 80 — What Accept means now

- scene: SPINE + PROTOTYPE: kicker 'Asked in review · Your verdict'; on the right the Finish panel's two verdicts as the player shows them on a walkthrough with comments: 'Approve · The agent fixes what your 2 comments ask. No new video.' (on 'Approve'), 'Request changes · … and you rewatch just those beats.' (on 'Request'), outlined coral (the one coral: what you sent); on the left, on 'plan' the chip 'comments → the plan or the fix', on 'rebuilt' the chip 'touched beats rebuilt, shown again'; on 'errors' the file 'reviews/walkthrough-…071728Z.md' with '3 errors fixed'
- voiceover: "Asked in your review: what accepting means now. Approve with comments, and they go into the plan or the fix, with no new video. Request changes, as you did, and the fixes are made, the beats they touch rebuilt, and shown again: these beats. And three errors in your review's summary are fixed."
- duration: 16.33s
- transition_in: crossfade
- status: animated
- src: compositions/frames/81-verdicts.html
- type: feature_showcase
- persuasion: What your verdict does, shown on the panel you used
- beat: Focus
- blueprint: compose
- focal: what Approve and Request changes each do now
- roles: prototype = foreground · spine = anchor · chips = worked example · paper ground = background
- sfx: none

narrativeRole: What Accept means now.
keyMessage: Approve with comments: no new video. Request changes: rebuilt and shown again.

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'Approve'): ap lands, timed to the start of the word.
Scene 3 (on 'plan'): c1 lands, timed to the start of the word.
Scene 4 (on 'Request'): rq lands, timed to the start of the word.
Scene 5 (on 'rebuilt'): c2 lands, timed to the start of the word.
Scene 6 (on 'errors'): fx lands, timed to the start of the word.
Scene 7 (last ≥ 0.6 s): held read, nothing moves.

## Frame 81 — Round 2: built, and your call

- scene: STEPS AND TAGS, no diagram: kicker 'What landed · round 2'; steps 6–10 as a list at reading size with their tags ('4 + 3 dev', 'no calls', '2 + 2 grouped', '6 + 2 grouped', 'next plan' in coral-deep, the one coral); on 'passing' the line 'the full npm test: passes'; on 'Twelve' the mono line '12 calls · 4 deviations · accept or flag each · 4 on 2 sheets'; on 'Flag' 'AI-generated narration and visuals' bottom right. Holds still.
- voiceover: "Round two is built: steps six to nine, with the full test suite passing, and step ten waits for the next plan. Twelve calls and four deviations stop for you, and four calls sit on two sheets. Flag a call, or accept."
- duration: 15.83s
- transition_in: crossfade
- status: animated
- src: compositions/frames/80-end-r2.html
- type: cta
- persuasion: What is pending + call to action
- beat: Resolve
- blueprint: compose
- focal: the result
- roles: rail = foreground · paper ground = background
- sfx: none

narrativeRole: Round 2: built, and your call.
keyMessage: Round two is built:

Scene 1 (0.0s): kicker and the frame's standing elements settle (power3, 0.5 s).
Scene 2 (on 'passing'): pass lands, timed to the start of the word.
Scene 3 (on 'Twelve'): sum lands, timed to the start of the word.
Scene 4 (on 'Flag'): note lands, timed to the start of the word.
Scene 5 (last ≥ 0.6 s): held read, nothing moves.
