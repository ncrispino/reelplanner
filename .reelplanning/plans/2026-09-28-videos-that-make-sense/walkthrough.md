# Walkthrough: Videos that make sense: fresh eyes before you watch, a way to ask, frames back to basics

**Status:** implemented (steps 1 to 5), code-checked, walkthrough video built and rendered, on branch `claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (the approval folded into
steps 2, 4 and 5, `a9896c9`) · **Started from:** `a9896c9` · **Decided before the build:** D-225 (every finding
answered before you see it), D-226 (meanings for flagged phrases, and Ask about this), D-227 (every new video, and
the system video now)

**Commits:** 4dc6bfc df9c961 c430c58 b474ec6 cc0dde0 be0cbcd d82e9cc (steps 1 to 5, the code check, the walkthrough
video; the guide reads its diffs from them)

## Categories of change

What landed, by kind (the plan guide's Built side reads this list: each kind's files, the commits that are its, and the
runs saved in `runs/`).

- **The new command** {command} (`scripts/fresh-eyes.mjs`, `scripts/lib/fresh-eyes.mjs`, `scripts/lib/memory.mjs`, `.gitignore`, `.reelplanning/.gitignore`, `templates/reelplanning/gitignore`, `README.md`, `docs/project-dir.md`) (4dc6bfc cc0dde0) (step 1): `reelplanning fresh-eyes <video-dir>` takes each scene's picture at rest through the review page and writes two briefs; `--prompt newcomer|designer` prints the one message that starts each agent. The pictures stay out of git; briefs, stamp and findings are committed.
  Runs: `runs/fresh-eyes-older-video.txt`, `runs/fresh-eyes-prompt-newcomer.txt`
- **The build gate** {build-gate} (`scripts/lib/fresh-eyes.mjs`, `scripts/verify.sh`, `scripts/build.mjs`, `scripts/plan-map.mjs`, `scripts/lib/notify.mjs`, `packages/player/reelplanning-player.js`, `docs/reference.md`) (df9c961 d82e9cc cc0dde0 be0cbcd) (step 2): `verify` runs `fresh-eyes --check` as its step 4 of 6. No answer, `kept` with no reason, or a `meaning` the glossary doesn't have: the build stops. No run yet, or scenes changed since: a △ line.
  Runs: `runs/build-stops.txt`, `runs/fresh-eyes-check-fails.txt`, `runs/build-passes.txt`
- **Ask about this** {ask} (`packages/player/reelplanning-player.js`, `scripts/review.mjs`, `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`, `scripts/lib/review-scope.mjs`, `scripts/lib/memory.mjs`, `scripts/plan-map.mjs`, `docs/hosted-review.md`, `docs/reference.md`) (c430c58) (step 3): Q, the Ask button or a caption word opens Ask in the side panel, the video paused. Hosted: one `sample` call per click; your machine: the session on `review --wait`; nobody waiting, it goes with the review.
- **The frame rules** {frame-rules} (`scripts/frame-lint.mjs`, `skills/plan-to-video/references/style-guide.md`, `templates/reelplanning/theme/stages/`) (b474ec6 cc0dde0) (step 4): style guide §5 gets seven rules; `frame-lint` checks the two a program can see (rule 1, empty bars where words go; rule 5, 40 px clear above a `data-detail` mark).
  Runs: `runs/frame-lint-step-6-frame.txt`, `runs/frame-lint-redrawn.txt`, `runs/frame-lint-scene-2.txt`
- **The system video, checked** {system-video} (`.reelplanning/system-video/`, `.reelplanning/terms-index.json`, `scripts/fix-clip-durations.mjs`) (cc0dde0) (step 5): three rounds of two fresh agents on the system video; 15 frames and 3 voice lines rebuilt, scene ids kept.
  Runs: `runs/fresh-eyes-check-system-video.txt`
- **The skill** {skill} (`skills/plan-to-video/SKILL.md`, `docs/status.md`, `CHANGELOG.md`, `.reelplanning/glossary.md`) (c430c58 cc0dde0): Build a video, step 5: fresh eyes between `build` and opening the page, for every build and every rebuild, at most three rounds.
- **Tests** {tests} (`scripts/test/`, `packages/player/test/`): new `fresh-eyes.spec` and `ask.spec`; `loop`, `visuals` and `access` changed.
  Runs: `runs/npm-test.txt`, `runs/npm-test-answer-on-frame.txt`

## What was done, per step

### Step 1 — Two fresh agents look at the video before you do ✅

- **`reelplanning fresh-eyes <video-dir>`** (`scripts/fresh-eyes.mjs`, `scripts/lib/fresh-eyes.mjs`) writes what two
  fresh agents get, as `code-check` does (D-001): `fresh-eyes/newcomer-brief.md` and `designer-brief.md`, and a
  picture of each scene at rest, taken through the review page so the player's Open tab, chips and captions are in
  it (`fresh-eyes/shots/scene-NN.png`, A2). `--prompt newcomer` and `--prompt designer` print the one message that
  starts each agent: read the brief, open nothing else, write `fresh-eyes/<role>.md` in the brief's shape.
- **The newcomer** gets each scene's narration and picture, the glossary (its "Other words" too), the meanings this
  video gives its own words (`terms:`), the recap lines of the videos it leans on, and what viewers were lost on
  before (A4: `lostBefore` in `scripts/lib/memory.mjs`, from every review in the repo); nothing from the plan. It
  lists every phrase or thing it could not explain from what the video had shown by then, what it guessed, and a
  newcomer's questions.
- **The designer** gets each picture and its narration, and the seven rules (step 4), and lists what breaks one.
- **Where it goes:** `fresh-eyes/newcomer.md` and `designer.md`, one numbered finding a line (N1, G1: scene, the
  phrase, what, why; A1), each file's heading carrying the round and the stamp of what they saw
  (`fresh-eyes/stamp.json`, each scene's narration and frame hashed; A3).
- Tried on this plan's own plan video: 29 pictures in 35 s; scene 2's shows its "Open · What lost you" tab on the
  heading's edge, as the plan says only a picture can.

### Step 2 — Every finding is answered before the page opens ✅

- **The answers** (D-225, answered before you see it): under each finding, `- Answer: fixed: <what, where>`,
  `meaning: …` or `kept: <the reason>` (A1). Answering is not always a rewrite: "kept: scene 5 says what the list is"
  is a full answer (the approval's quick check). Each is checked (A7).
- **The build holds it:** `verify` runs `fresh-eyes <video-dir> --check` (`scripts/verify.sh`, 4/6): a finding with no
  answer, a kept with no reason, or a meaning that isn't there stops it; no run yet, the agents not back yet, or
  scenes changed since they looked is a △ line, and `build` prints what verify read as a `fresh-eyes` line of its
  own (`scripts/build.mjs`; A5).
- **Rounds:** after a fix the video is rebuilt and `fresh-eyes` runs again; each round keeps the last in
  `fresh-eyes/round-<n>/`, at most three (m2). What is left after the third, the findings kept, is in the plan map
  (`freshEyes`, `scripts/plan-map.mjs`), on the page's "Before you watch", and in the notification's line (A6).
- D-129 (approving is never blocked) held: the check is on the build, before you see the video; the page and its
  Approve are as they were.

### Step 3 — Find out about any phrase, in the player ✅

- **A meaning for every flagged phrase you keep** (D-226): nothing new to build. A finding answered `meaning` needs
  its phrase in the glossary's "Other words" (other videos say it) or the storyboard's `terms: x = …` (only this
  one does), which `verify` checks (A7); the player already underlines a phrase with a meaning in the captions, and a
  click opens it until you know it (D-218).
- **Ask about this** (`packages/player/reelplanning-player.js`; A8): paused on any scene, `Q` or the Ask button (or a
  plain caption word clicked, or an underlined word's "Still unclear? Ask about this") opens it in the side panel,
  about the scene on screen. The question is answered from the plan, the glossary and the scene, and each answer
  ends with where it came from:
  - **hosted:** Claude, through the page's `sample` capability (A9), on the viewer's own account, the first call
    asking their consent; only on a click; `window.claude` is reached only through `use()`, and where it is absent
    or refused the hosted path is hidden and the local behaviour applies. The page needs `sample` declared at publish
    (`docs/hosted-review.md`: `capabilities: {db: {}, user: {}, sample: {}}`).
  - **your machine:** the session waiting on `review --wait` answers within seconds (`POST /api/ask`, `inbox answer`,
    `GET /api/ask`; A10); with none waiting, the page says so.
  - **otherwise:** the question goes with the review, answered in the next version.
- **Kept:** every question in the review (`questions`, A11), listed in `reviews/<id>.md`, counted in `reel memory
  lost` (m4), and given to the next video's newcomer (step 1's `lostBefore`).
- "In plain words" (question 2's C) was not chosen: not built.

### Step 4 — Frames back to basics: seven rules, checked where they can be ✅

- **The style guide's §5 has "A frame a newcomer can read"** (`skills/plan-to-video/references/style-guide.md`): the
  seven rules, with the step 6 frame of the walkthroughs-that-help plan video as the example, before (what it broke:
  rules 1, 3, 4, 5) and after (the videos-that-make-sense plan video's scene 20, redrawn by them). Rule 3 says it is
  about where a word sits, rule 1 about what is drawn: two real files with a column of chips far to the right keep
  rule 1 and break rule 3 (the approval's quick check).
- **`frame-lint` fails what a program can see** (`scripts/frame-lint.mjs`): empty bars standing where words go (rule
  1, A12) and anything within 40 px above a `data-detail` mark, where the player's Open tab goes (rule 5, A13). Run on
  every video here, rule 1 fails the step 6 frame (`30-step-5-did-it-work.html`, its two grey lines) and about fifty
  older frames that draw documents or pages as grey lines; rule 5 fails this plan's own scene 2 (its heading 39 px
  above the list). None of those videos is rebuilt for it (step 5: an older video gets it when it is rebuilt), but
  the system video's, checked now.
- **The designer checks all seven on the picture** (step 1's brief carries them).
- **The theme's frame generator loses its three-bar card** (m5): the stage templates' regions and page mocks show
  words.

### Step 5 — The videos we have, and the skill ✅

- **The skill's Build a video** (`skills/plan-to-video/SKILL.md`) has the loop between `build` and opening the page
  (step 5, D-225, D-227): every video built, plan, walkthrough or system, and a rebuild of an older one (a rebuild is a
  new build: the approval's quick check); `fresh-eyes`, two fresh agents with only their prompt, every finding
  answered by its number (fixed, meaning, or kept with the reason; answering is not always a rewrite), `build` again,
  at most three rounds. **A new plan**'s step 5 and **The system video**'s keeping-current say it; the loop's
  **Running the loop** says how a session answers a question asked on the page. The style guide's §11 checklist has
  the seven rules and the fresh-eyes line (`skills/plan-to-video/references/style-guide.md`). `docs/status.md` has a
  row for it.
- **The system video, checked now** (D-227; `.reelplanning/system-video/fresh-eyes/`), three rounds, each two fresh
  agents (m6):
  - **Round 1** (24 findings: newcomer 9, designer 15; `round-1/`): 10 fixed, 3 given a meaning, 11 kept. Fixed: "The
    reel CLI" read "ThereelCLI" on four scenes (a flex box dropped the spaces around its code; each label's words in
    one span now), a scene's frame blank for its last 0.4 s (two frames' clips shorter than their scenes), three pins
    on words or apart from their thing moved (scenes 10, 11, 27), scene 1's place label and scene 13's say what they
    show, the ending says where "the library" is ("from Videos, at the top of the review page"). Meanings: three rows
    under the glossary's Other words, "Recommended", "The real thing" (a phrase the reviews show lost a viewer before),
    "Walk me through it"; and "npx". Kept: the stage's fixed places (the reading-order findings), the real page's and
    files' own words and controls, crops that keep what the narration reads.
  - **Round 2** (34: newcomer 24, designer 10; `round-2/`): 4 fixed (scene 8 names the record's keeper, "the reel
    CLI"; scene 29 says "signal" as its output does; two pins moved off words), 30 kept, mostly the real page's own
    buttons in a screenshot, which a newcomer asked about one by one. `frame-lint`'s rule 1 also failed two of its
    frames, grey bars for a plan and a diff (scene 4) and for the repo's files (scene 15): both now show words.
  - **Round 3** (35: newcomer 21, designer 14; the last round): 3 fixed, 32 kept. Fixed: scene 8 went blank for its
    last 1.4 s, its voice line (re-voiced in round 2) now longer than its frame; `fix-clip-durations` now restamps a
    frame to its slot in `index.html` (`scripts/fix-clip-durations.mjs`, m7), which also would have caught round 1's
    G13; and "side panel", which round 1's move had put on a heading, moved again. The 32 kept are what is left: the
    plan map carries them and the page's Before you watch says them, three shown and the rest behind "29 more" (A6).
    Most are the real page's own controls and words in its screenshots, asked about one by one, and the stage's fixed
    places; one (scene 25's rules from before walkthroughs-that-help) waits on that plan's own system-video update
    (its step 7, D-003).
  - What the three rounds show: fresh agents never run dry. Each round's pair found as much as the last, most of it
    new (the same scene read another way), so three rounds and "kept, with the reason" are what end it, as the plan
    has it.
  - The fresh-eyes tool changed on the way: its first pictures were 0.12 s before a scene's end, where the next
    scene's first caption is already up (round 1's G12); they are 0.4 s before now (A2).
  - Rebuilt only where a finding was fixed, keeping every scene's id (`STORYBOARD.md`, `SCRIPT.md`, the frames named in
    the answers; lines 8, 29 and 35 re-voiced). Not published.

## The walkthrough video

`walkthrough-video/` (`flow: automation`, `storyboard: no`): 13 scenes, 2:22, 8 layouts, built under the
walkthroughs-that-help rules and checked by fresh eyes like any new video (D-227). It shows the change running: the
change's map; `fresh-eyes` run on the system video and a finding it wrote; `build` stopping on unanswered findings,
then passing; the system video's Before you watch; Ask about this on the local review page, answered by a waiting
session, then with none waiting; the saved review file's `questions` and `reviews/<id>.md`; `frame-lint` on the step 6
frame the owner sent; a system-video scene before and after its fix; what ran. It pauses only on the choices
`reel stops` says pause, each on the scene that shows it running: A6 (scene 5); A8, A10, A11 (scene 8). The other
nine are the list (scene 12). Two quick checks: k1 before the page shows what is left (4), k2 before a question is
asked with nobody waiting (6). It ends on the open question (13). Rendered to `renders/video.mp4` (the lead's call,
for the owner's morning review; not in git), not published.

Fresh eyes, three rounds (`walkthrough-video/fresh-eyes/`), 46 findings, every one answered:

- **Round 1** (23: newcomer 12, designer 11): 11 fixed, 12 kept. Fixed: the map's row says "the findings kept", not
  "what is left", before either is shown; the designer's card is named as the designer's; "hosted page" got a meaning;
  the step 6 frame is labelled as the frame the owner sent, another plan's; the A9 line reads as a sentence; a chip
  moved onto its card; the Ask scene's label clear of the panel, its pins starting where their rings end; the before
  and after pictures cropped so "inbox" shows whole; the "What ran" rows spread down the frame. Kept: the build's own
  output as it prints it ("4/6"), the system video's own kept findings as its page shows them, the example frame's
  faults (they are the point), a choice's card beside the thing it chose (where Accept and Flag go), "seven rules" (the
  style guide's §5; this video shows the two a program checks, running).
- **Round 2** (10: newcomer 7, designer 3): 1 fixed (scene 5's choice card fills the right column), 2 given a meaning
  ("inbox answer", "the list", in the storyboard's `terms:`), 7 kept (the same reasons, and the page's newest-first
  order in the Ask picture).
- **Round 3** (13: newcomer 10, designer 3; the last): 2 fixed, 11 kept. Fixed: the build's fresh-eyes line said "35
  findings answered" beside the narration's ninety-three, so it now says whose they are ("round 3's 35 findings",
  `scripts/lib/fresh-eyes.mjs`), and the before picture of "ThereelCLI" is labelled "spaces lost". The 11 kept are
  what the page's Before you watch says for it.
- Fresh eyes ran here as on the system video (m6), with one hitch: in round 3 the newcomer, allowed only to edit its
  findings file, could not create it, and wrote it in its own scratch folder; it was copied back as written.

## Tests run

- `npm test` (the fast run, 31 specs with the new `ask.spec`) at the end of each step: all pass each time. One run
  after step 3 failed `access.spec` and `answer-on-frame.spec` on a loaded machine (load average near 20, the run
  354 s); both passed alone and the next full run passed.
- New specs: `scripts/test/fresh-eyes.spec.mjs` (the briefs, the prompt, the check and its answers, the rounds,
  what is left, the plan map and the notification, questions in the record and in memory, a frame restamped to its
  slot) and `packages/player/test/ask.spec.mjs` (Ask about this: nothing to answer here, a stub of the page's `sample`
  capability, its refusals, the local page with a session waiting and with none; in the fast run).
- Changed specs: `scripts/test/loop.spec.mjs` (`/api/ask`, `--wait` waking on a question, `inbox answer`),
  `scripts/test/visuals.spec.mjs` (frame-lint's rules 1 and 5, the stage templates),
  `packages/player/test/access.spec.mjs` (what fresh eyes left, on Before you watch).
- Real runs: `fresh-eyes` on this plan's plan video and three rounds on the system video (its `build` stopping on
  the unanswered findings, then passing); frame-lint over every video here (rule 1 fails the step 6 frame and about
  fifty older frames; rule 5 this plan's own scene 2); three rounds on the walkthrough video, its build passing
  ("3 rounds done, round 3's 13 findings answered").

## Not done

- **Older videos keep their stand-ins.** `frame-lint`'s rule 1 fails about fifty frames of older plan and example
  videos (documents and pages drawn as grey lines, the walkthroughs-that-help step 6 frame among them); none is rebuilt
  now (question 3: an older video gets fresh eyes and the rules when it is next rebuilt). The system video's two were
  fixed.
- **The system video's own update for walkthroughs-that-help** (that plan's step 7: the list at the end instead of a
  grouped scene per chapter, the shorter walkthrough) still waits on its walkthrough's acceptance (D-003); round 3
  kept a finding on scene 25 for it.
- **The theme's frame generator** was read as the theme's stage templates (m5); the frames of older videos
  were drawn by workers from those templates and are unchanged.
- **13 calls**, one past the dozen `reel audit` warns on; no step reached five.

## Code check

A fresh agent (`claude -p` with only the brief's prompt, reading the repo and `git diff`/`log`/`show`, writing
`code-check/findings.md` alone) checked `a9896c9..HEAD` over this plan's paths (the plan-guide commit in between left
out): **steps 5 of 5 ✓, decisions 43 of 43 ✓, unexplained 1 ✗** (`code-check/findings.md`).

- **✗ `packages/player/reelplanning-player.js:5708`**: the exported `questions[]` carries `id` and `answeredAt`, which
  A11's row did not name, and `exportPayload` strips `askId`, not `id`. Not a deviation: `id` is the question's own id
  (the page's, kept on purpose so a question answered later can be matched), `askId` is the review server's id for it,
  left out on purpose with `status` (the page's state), and `answeredAt` says when an answer came. A11's row now names
  all of them; no code changed.

## Decisions in force

- **D-225** (every finding answered before you see it) held: `verify` stops on a finding with no answer
  (`freshEyesState` in `scripts/lib/fresh-eyes.mjs`, `scripts/verify.sh`); a wrong finding can be kept with its reason.
- **D-226** (meanings for flagged phrases, and Ask about this) held: a `meaning` answer is checked against the
  glossary and `terms:` (`hasMeaning` in `scripts/lib/fresh-eyes.mjs`); Ask about this in
  `packages/player/reelplanning-player.js`, `scripts/review.mjs`, `scripts/lib/inbox.mjs`.
- **D-227** (every new video, and the system video now) held: the skill's **Build a video** step 5
  (`skills/plan-to-video/SKILL.md`), a rebuild included; the system video checked now (step 5).
- **D-001** (a second, fresh agent checks the code) held, and is what fresh eyes copies: the briefs and
  `--prompt` of `scripts/fresh-eyes.mjs` follow `scripts/code-check.mjs`; the code check below, by a fresh `claude -p`.
- **D-127** (plain words on screen) held: the player says Ask, "Still unclear? Ask about this", "Left as they are",
  "Goes with your review" (`packages/player/reelplanning-player.js`).
- **D-216**, **D-217**, **D-218** (jargon found, warned, underlined until known) held: `check-terms` and
  `scripts/lib/jargon.mjs` unchanged; a kept phrase's meaning uses the same rows and underline (`wireCaptions`
  unchanged).
- **D-166** (the brief picks which scenes show the real thing) held: rule 1 is about stand-ins, not about showing
  the real thing (the style guide's §5).
- **D-129** (approving is never blocked) held: fresh eyes gates the build, before the page; Approve and the Finish
  panel are unchanged (`packages/player/reelplanning-player.js`).
- **D-194**, **D-195**, **D-196** (the Open tab on the thing, the page grown from it, the corner chip) held: the tab
  is drawn as before (`detailMark` unchanged); `frame-lint` gives it 40 px of room (`scripts/frame-lint.mjs`).
- **D-197**, **D-198**, **D-199** (when a quick check comes, on what case, and the system video at once) held:
  `scripts/check-terms.mjs` unchanged; the newcomer reads checks as a viewer would; question 3 follows D-199's shape.
- **D-064** (the main session hands long jobs to workers) held: the two fresh agents are launched by the session
  building the video (`skills/plan-to-video/SKILL.md`, **Build a video** step 5).
- **D-142**, **D-167** (the coral and today's look) held: Ask about this and "Left as they are" use the page's
  tokens (`--ink`, `--paper`, `--accent` in the player's `STYLE`).
- **D-221**, **D-222**, **D-223** (listed choices, a check where there's something to predict, small pull requests)
  held: `scripts/lib/autonomy.mjs`, `scripts/pr-check.mjs` unchanged; a walkthrough video gets fresh eyes like any
  other.
- **D-003**, **D-065** (the system video kept current; a comment on it sorted) held: the system video's fresh-eyes
  findings were answered as a comment that says the video is unclear would be (step 5,
  `.reelplanning/system-video/fresh-eyes/`).
- **D-082** (the sandbox for a headless run) held: a question asked on the page never starts a headless run
  (`handleAsk` in `scripts/review.mjs`).
- **D-005**, **D-024**, **D-085**, **D-106**, **D-107**, **D-109**, **D-110**, **D-128**, **D-169**, **D-170**,
  **D-171**, **D-200**, **D-201**, **D-202**, **D-213**, **D-215**, **D-219**, **D-220**, **D-224** (rewinds, how a
  detail page is made, less scaffolding, your memory file and the retro, late fixes, the fifth choice, where
  "watched" is kept, the case study, decision numbers, pull requests and their videos, the walkthrough's shape and
  the Plan | Built switch) held: not touched (`scripts/lib/memory.mjs` gains the questions asked and keeps its
  files; `scripts/case-study.mjs`, `scripts/renumber.mjs`, `scripts/pr-check.mjs`, `scripts/lib/autonomy.mjs`
  unchanged). D-110 held in the build: no step reached a fifth call (steps 1 to 5 have four, three, four, two and
  none); the whole table has 13, past the dozen `reel audit` warns on (see Not done). D-213: the fresh-eyes pictures
  stay out of git (m1).
- Decided after this walkthrough (in conversation, 2026-10-04), so not part of its build: **D-303** (a video of
  something people install shows the real install commands, run) holds: the skill says so for the system video and
  for a walkthrough whose change touches the install (`skills/plan-to-video/SKILL.md`), and this repo's system
  video runs the install in its second chapter (`.reelplanning/system-video/SCRIPT.md`).

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both [close] | a table per file, or the answers in a file of their own beside the findings | the plan says one numbered finding a line and the answer in the same file; a line and the one under it read as a conversation, and the quoted phrase is what a `meaning` answer is checked against | `parseFindings`, `answerProblem` in `scripts/lib/fresh-eyes.mjs`; `scripts/test/fresh-eyes.spec.mjs` |
| A2 | 1 | The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them [close] | the page at another size, or the frames alone every time | 1440 × 900 is a laptop, the size a viewer reads at, so "too small to read" is judged as they'd see it; the plan needs the player's tab in the picture (the Open tab that hid a row passed `frame-lint`), and a machine without a browser still gets a look | `pagePictures`, `framePictures` in `scripts/fresh-eyes.mjs` |
| A3 | 1 | What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked [close] | one hash for the whole video, or a stamp line in each findings file only | a finding is about a scene, and a round-2 look is due because of the scenes a fix touched; naming them says what changed | `stampOf`, `changedSince` in `scripts/lib/fresh-eyes.mjs` |
| A4 | 1 | "Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page [close] | only `reel memory lost`'s lines (words looked up in three reviews or more), or the reviewer's file across repos | the plan lists every kind; the repo's reviews hold the words themselves ("wdym dropps the video"), which a count does not, and every reviewer of this repo is who the next video is for | `lostBefore`, `LOST_WORDS` in `scripts/lib/memory.mjs` |
| m1 | 1 | The pictures (`fresh-eyes/shots/`) are kept out of git in `.reelplanning/.gitignore` and `reel init`'s template; the briefs, stamp and findings are committed | committing the pictures | each run makes them again, and a plan folder carries only its videos' text (D-213) | `.reelplanning/.gitignore`, `templates/reelplanning/gitignore` |
| A5 | 2 | Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own [close] | stopping on no run too, or on scenes changed since | the first build has to finish before anything can be pictured, and a fix is what makes scenes change: stopping on either would stop every build; D-225's promise is about findings, which a stop keeps | `freshEyesState` in `scripts/lib/fresh-eyes.mjs`; `scripts/verify.sh` (4/6); `scripts/build.mjs` |
| A6 | 2 | What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are") [visible] | every finding of every round, or a line with only the count | a kept finding is the one confusion the viewer still meets, and the reason is what they need; a meaning is already one click away | `freshLeft`, `freshLeftHtml` in `packages/player/reelplanning-player.js`; `leftAfter` in `scripts/lib/fresh-eyes.mjs`; `waitingLine` in `scripts/lib/notify.mjs`; `packages/player/test/access.spec.mjs` |
| A7 | 2 | An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more) [close] | any answer word passing | "kept" alone is exactly the silence D-225 rules out, and a meaning that was never added leaves the phrase with nothing to click | `answerProblem`, `hasMeaning` in `scripts/lib/fresh-eyes.mjs`; `scripts/test/fresh-eyes.spec.mjs` |
| m2 | 2 | A new round moves the last one's briefs, findings and stamp to `fresh-eyes/round-<n>/`, never starts while a finding of the last is unanswered, and a fourth is refused | overwriting the last round, or numbering the files | the rounds are the record of what was found and answered; the plan says at most three | `scripts/fresh-eyes.mjs` (a new round) |
| A8 | 3 | Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did [visible] | a box laid over the frame, or a click anywhere on the frame opening it | the side panel is where the page already explains things and leaves the frame readable; a click on the frame is drawing's (Mark), so only the captions, words the viewer reads, open it | `openAsk`, `captionAtPoint`, `renderAsk` in `packages/player/reelplanning-player.js`; `packages/player/test/ask.spec.mjs` |
| A9 | 3 | On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried [close] | the default tier (it thinks first, 5 to 60 s), or the whole glossary and plan in every call | the plan says answers in seconds, and the quick tier starts at once; what the scene needs is its own step and the words it says, which keeps the call small and the answer on the scene | `askClaude`, `askPrompt`, `splitFrom` in `packages/player/reelplanning-player.js`; `docs/hosted-review.md` |
| A10 | 3 | On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review [visible, close] | starting the headless agent command on a question, or a question file left for a session that starts later | the plan says a waiting session answers in seconds, and with none the question goes with the review; a headless run would take minutes to answer one line, and a file nobody polls answers nobody | `handleAsk` in `scripts/review.mjs`; `writeQuestion`, `waitingQuestions`, `answerQuestion` in `scripts/lib/inbox.mjs`; `scripts/inbox.mjs` (`answer`); `scripts/test/loop.spec.mjs` ("ask:") |
| A11 | 3 | Every question is kept in the review as `questions: [{ id, question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, answeredAt?, note? }]`, `answered: false` where it has no answer (the page's own state and the review server's id for a question, `status` and `askId`, are left out); `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too" [hard-to-undo] | only the unanswered ones, or questions as comments on their step | the plan keeps every question (it counts in memory and goes to the next newcomer), and an answered question still says the video didn't make it plain; a field of its own keeps them apart from what the reviewer said about the plan | `exportPayload` in `packages/player/reelplanning-player.js`; `actOnMarkdown` in `scripts/lib/review-scope.mjs`; `scripts/test/fresh-eyes.spec.mjs` ("step 3") |
| m3 | 3 | The plan map carries each scene's narration (`frames[].narration`, from `SCRIPT.md`), so a question about a scene is answered from what it says | reading the captions out of the frame at question time | the captions are split and timed for the screen; the script is the words | `scripts/plan-map.mjs` |
| m4 | 3 | `reel memory lost` counts the questions asked, and lists them in its evidence, beside the words looked up | a line of their own | the plan says a question counts like a word looked up | `lostOf`, `memoryLines` in `scripts/lib/memory.mjs` |
| A12 | 4 | Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes [close] | any empty bar failing, or only a box holding nothing but bars (the plan's words) | a single bar is a rule, an underline or a progress bar; the step 6 frame's two grey lines were siblings of the box's other words, not inside an empty box, so "only bars" alone would have passed the frame the owner sent | `scripts/frame-lint.mjs` (rule 1); `scripts/test/visuals.spec.mjs` |
| A13 | 4 | Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way [close] | any element's box touching the band, or only elements whose size the CSS gives | a panel or background behind the thing is not what the tab covers, and most labels in frames are placed with no height, so they would never be seen | `scripts/frame-lint.mjs` (rule 5, `placeOf`); `scripts/test/visuals.spec.mjs` |
| m5 | 4 | "The theme's frame generator" is read as the theme's stage templates: `layout.html`'s regions (Steps, Decisions, Comments, three grey bars each) and `pipeline.html`'s page mocks now hold a line or two of real words | a new generator | they are what frames are started from, and the only three-bar cards in the theme | `templates/reelplanning/theme/stages/` |
| m6 | 5 | Each fresh agent ran as a headless `claude -p` with exactly the `--prompt` text, in a scratch folder holding only its brief and the pictures (the brief's paths kept), allowed to read there and to edit only its findings file; the findings were copied back | a subagent in this session, or `claude -p` in the repo | the prompt says to open nothing else, and a scratch folder makes that true: nothing of the plan or the code is there to read | `.reelplanning/system-video/fresh-eyes/` (stamps, rounds) |
| m7 | 5 | `fix-clip-durations` restamps a frame's root, and its full-length layers, to its slot in `index.html` when they differ | fixing the two frames by hand | the system video's fresh eyes found a scene blank for its last moment twice, both after a voice line changed length; the build had left the frame's own length behind | `scripts/fix-clip-durations.mjs` |
