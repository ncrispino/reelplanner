# Cheaper, faster videos: less rebuilding of plumbing, one round of fresh eyes, findings that reach the plan

**In one sentence:** from the plan to the first video the person can watch, spend the time on the video's ideas,
not on each agent re-learning the tools, on second and third rounds of fresh eyes, or on written answers to
cosmetic notes; and let what fresh eyes find in the plan reach the plan.

## The problem

The first audits (`eval/pipeline-cost/2026-10-10-synthesis.md`: 19 videos, the bakery example on a fresh machine
and two weeks of a research repo) measured where the time goes between a plan and its first showing. The plan itself
is 4–17% of it; making the video and checking it is 80–90%.

- **Frame workers re-learn the tools.** A worker drawing one frame spent a median 9 minutes reading the kit, the
  theme, sibling frames, timing formats and reelplanner's own source before drawing for 2: 71% of one video's build.
  Each wrote its own screenshot harness (one set filled a disk). With a frame kit and a shared screenshot script,
  workers took 1.5 min a frame.
- **Fresh eyes pay once.** Round 1 finds the material things; rounds 2 and 3 cost as much and found little (the
  bakery video: round 3 none material; a designer round fixed 0 of 20). Every finding needs a written answer before
  the build passes: 135 answers on one 6-minute video, 311 in one round of another, most "kept" on layout.
- **What matters most is dismissed.** The worst outcomes were a video that was not what was asked ("you gave me
  mostly words") and a gap in the plan (no step got the bakery a web address). Fresh eyes raised both, three and six
  times; each time the agent that built the video answered "kept". No answer sends a finding to the plan.
- **Context.** The video worker is a fork carrying the whole conversation (630–780k input tokens a call); the main
  agent runs at 300–620k a turn.
- **Length, rounds after showing, links.** First videos of 15–17 minutes were watched 1–4%; the agent ran unasked
  rounds after a video was shown (184 and 148 minutes); a wrong port, a stale build and an hour with no link.

- **Revisions rebuild the whole video for each fix.** A later audit of two revisions (38 and 31 minutes): every small
  tweak ran a full build (55–90 s, a one-number fix 71 s); 6 of 13 builds failed about a minute in, mostly on text
  overflowing a frame, which a check of the changed frame finds in seconds; fixes went one at a time (fix, build,
  fail, again); one script drawing every frame (33 KB) was written whole each pass (about 1:45); fresh eyes ran while
  the worker waited; a 61-second search of the disk for a font. Most of the time was the model writing.

The diversity of the frames must not suffer: what is shared is plumbing (timing, checks, screenshots, formats), never
layouts; each frame is still designed by an agent.

## Steps

### Step 1 — A frame packet, and one command to check a frame

A worker gets everything for its frames in one file and checks them with one command, so it never reads the tools.

- `$RP frame-packet <video-dir> <frame> [<frame>…]` writes `<video-dir>/.hyperframes/packets/<first>.md`: for each
  frame its storyboard block, its line with each word's start and end (from `audio_meta.json`, or "narration not
  ready" with the line's text), its file path and id, the data attributes its beat needs (option cards, the
  question, calls, details, the bottom band), the theme's rules (`theme/frame.md`, `motion-language.md`) once, the
  path of one finished sibling frame to keep consistent with (not to copy), and the two commands below.
- `$RP frame-check <video-dir> <frame>` runs `frame-lint` on that frame and takes one picture of it at rest
  (`.hyperframes/shots/<frame>.png`), printing both: the screenshot harness every worker wrote for itself.
- `skills/plan-to-video/references/frames.md` states the formats the tools read (a frame's file and root, the cue
  helper and how cues land on words, `holds.json`, `narration.json`, `audio_meta.json`), so no agent learns them
  from the source.
- `SKILL.md`'s step 3: a video of up to about 20 scenes is drawn by one builder; a longer one by workers of 3–5 frames
  each, each handed its packet and nothing else. Workers never read reelplanner's source.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Narration done | a frame whose line is voiced | the packet lists each word with its start and end | `frame-packet v 04` → "· menu (1.20–1.62)" |
| Narration not ready | no `audio_meta.json` yet | the packet says so and gives the line's text | "narration not ready: draw first, cue after" |
| A decision frame | a beat with `decision: q2` | the packet names `data-question` and `data-option="a"`… | three option cards listed |
| No such frame | an id the storyboard lacks | refused, naming the frames it has | "no frame 44 (01–27)" |
| frame-check on a broken frame | a camera past y 900 | frame-lint's line, and still the picture | exit 1 |

#### Interface

```
$RP frame-packet <video-dir> <frame> [<frame>…]    → .hyperframes/packets/<first>.md
$RP frame-check <video-dir> <frame>                 → frame-lint's lines; .hyperframes/shots/<frame>.png
skills/plan-to-video/references/frames.md           the formats the tools read
```

#### Example

```
$ reelplanner frame-packet .reelplanner/plans/x/video 04 05 06
✓ .reelplanner/plans/x/video/.hyperframes/packets/04.md (3 frames, narration ready)
```

### Step 2 — One round of fresh eyes, then show it

A build's fresh eyes are one round. A second runs only when the first's answers changed what a scene says (its
narration or the storyboard's order), on those scenes only; never a third. The fact checker runs with them on a video
that states numbers or sources (as now).

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Round 1 answered, nothing said changed | answers fixed layout only | build passes; the video is shown | "fresh eyes: 1 round, done" |
| Round 1 changed narration | a line rewritten | build asks for round 2 on those scenes | "scenes 4, 9 changed what they say: one more round on them" |
| After round 2 | anything | no third round; what is kept goes to Before you watch | "fresh eyes: 2 rounds done" |

#### Interface

`lib/fresh-eyes.mjs` `ROUNDS` becomes 2, and round 2 is asked for only on scenes whose narration or order changed.

#### Example

```
△ fresh eyes, round 1: 31 findings, 31 answered; scenes 4, 9 say something new since: one more round on those
```

### Step 3 — A finding about the plan goes to the plan

The newcomer, designer and checker mark a finding about the plan rather than the video (a missing step, an
unanswered case, a thing described where it should be shown) `[plan]`. Such a finding cannot be answered `kept`:
its answer is `- Answer: plan: <what plan.md now says>` (and `plan.md` changed since the round's stamp) or
`- Answer: ask: <the question put to the person>`, which is shown first on the page's Before you watch.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A plan finding kept | `[plan]` answered `kept: …` | the build stops on it | "N15 is about the plan: answer plan: or ask:" |
| Answered plan:, plan.md unchanged | `plan: added step 6` | the build stops: plan.md says nothing new | "plan.md is unchanged since round 1" |
| Answered ask: | `ask: should step 6 buy the domain?` | first on Before you watch | the question, with the finding |

#### Interface

`ANSWER` in `lib/fresh-eyes.mjs` accepts `plan` and `ask` beside `fixed`, `meaning` and `kept` (the line format the
agent's own call D-235 chose, otherwise as it is); the prompts say what `[plan]` marks.

#### Example

```
- N15 [plan] · scene 22 · no step gets the bakery its web address
  - Answer: plan: step 6 now buys the domain and points it at the host
```

### Step 4 — Read the storyboard against the ask before any frame

Before frames are drawn, `$RP fresh-eyes <video-dir> --script` writes a newcomer brief from the storyboard and
script alone, with the person's own words (the request, and any open review comments) at its top: does the video
do what they asked, big picture first, with every word it uses explained? Its findings are answered like any round's,
and cost a line to fix rather than a frame.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Storyboard and script written | no frames yet | the brief is written | `fresh-eyes/script/newcomer-brief.md` |
| The person's words | `reviews/*.md` open comments, plan.md's request | at the brief's top | "You asked: show me prototypes" |
| No storyboard | — | refused | "write STORYBOARD.md and SCRIPT.md first" |

#### Interface

`$RP fresh-eyes <video-dir> --script [--prompt newcomer]`; findings in `fresh-eyes/script/newcomer.md`.

#### Example

```
$ reelplanner fresh-eyes .reelplanner/plans/x/video --script --prompt newcomer
```

### Step 5 — The designer reports what blocks; values agree across scenes

The designer lists only what blocks a viewer (text cut off or overlapping, too little contrast, unreadable, a frame
that contradicts its line); other notes go under `## Advisory`, which needs no answer and is not counted. And the
build warns when one thing has different values across scenes: a phone number, an email address, a web address, or
a count of one thing ("5 pages" in one scene, "four pages" in another).

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Advisory notes | a `## Advisory` section | not parsed as findings | 0 answers needed |
| Two phone numbers | 555-0101 in scene 3, 555-0110 in scene 9 | △ naming both scenes | "two phone numbers: 555-0101 (3), 555-0110 (9)" |
| Counts disagree | "5 pages" and "four pages" | △ | "pages: 5 (scene 2), 4 (scene 7)" |
| One value | the same phone everywhere | nothing | |

#### Interface

`lib/consistency.mjs`, run by `check-terms` on the script and frames' text: △ lines, never a stop.

#### Example

```
△ values differ across scenes: phone 555-0101 (scenes 3, 12), 555-0110 (scene 9)
```

### Step 6 — The video builder starts fresh, with a short brief

`SKILL.md` stops forking the conversation for a video: it starts a fresh worker with the plan's folder, BRIEF.md,
the decisions in force on the plan's parts, and the person's own words quoted (the request, review comments), under
about 50k tokens in all.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A plan video | the plan, filed and checked | a fresh worker with the brief | not a fork |
| A revise | a review taken in | the brief carries the review's words | "they said: show prototypes" |

#### Interface

`SKILL.md` only.

#### Example

A worker's prompt starts "Build the plan video for .reelplanner/plans/x. The person asked, in their words: …".

### Step 7 — Shorter videos, decisions early

A plan video stays in its budget (3–5 minutes): past 1.5 times it, the build stops and says which parts are longest,
unless BRIEF.md says why (`- Length: <why it needs more>`). The style guide puts the plan's open questions as early
as the steps they decide allow.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| In budget | 4:50 | as now | |
| Past budget | 6:40 | △, as now | |
| Past 1.5× | 9:10, no reason | the build stops, naming the longest parts | "9:10 against 5:00: part 3 is 3:40" |
| Past 1.5×, with a reason | `- Length: three systems compared` | △ only | |

#### Interface

`lib/length.mjs`; `templates/video/BRIEF.md` gains `- Length:`.

#### Example

```
✗ length: 9:10 watched, budget 5:00 (×1.8): longest part 3 (3:40). Shorten, or say why in BRIEF.md (- Length:)
```

### Step 8 — Once shown, wait

`SKILL.md`: once a video is shown, no rounds, redraws or second videos until the person answers, unless they asked.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Shown, nothing asked | | wait for the review | |

#### Interface

`SKILL.md` only.

#### Example

"The video is ready: <link>. I'll wait for your review."

### Step 9 — The build ends with the way to the page

`build`'s last line is the command that puts this build on the review page and prints its link (`review <dir>
--detach`: a running server shows a rebuilt video only once that bundles it again), and, when a server is running for
the repo, where it is. `build` itself starts and changes no server: a headless run cannot reach one.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A server running for the repo | its `.server.json`, its process alive | where it is, and the command | "the page is up at http://127.0.0.1:8787/ (pid 4120): `reelplanner review … --detach` puts this build on it" |
| No server | | the command | "`reelplanner review … --detach` starts the page and prints its link" |
| A recorded server, its process gone | | as no server | |

#### Interface

`lib/inbox.mjs` `reviewWayLine(dir)`, printed last by `scripts/build.mjs`.

#### Example

```
· review   the page is up at http://127.0.0.1:8787/ (pid 4120): `reelplanner review .reelplanner/plans/x/video --detach` puts this build on it and prints its link; give the person that link
```

### Step 10 — The headless run finds the skill, and an approval verifies nothing

The prompt the review server gives a headless run names the skill's path; on an approval with nothing to rebuild,
it does not ask for `verify` (which failed in the sandbox and cost 2.5 minutes).

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A headless run | any review | the prompt names SKILL.md's path | |
| Approved | no rebuild | no `verify` asked | |

#### Interface

The headless prompt in `scripts/review.mjs` (or where it is written).

#### Example

"Load the plan-to-video skill: <path>/SKILL.md."

### Step 11 — A changed frame's layout, checked in seconds

`frame-check` also runs HyperFrames' layout and contrast check (`check --at`) on the frame's own slot in the
assembled video, three times in it, and keeps what is found in that frame's file: text overflowing or overlapping
stops it, as the build's `verify` would a minute later. `build` gets a first stage, `frames`: on a rebuild (an
`index.html` there), frame-lint and that check on every frame whose file changed since the last build, before
anything is voiced; a failure stops the build in seconds, naming the frame.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A frame's text overflows | an edited frame | frame-check exits 1 with HyperFrames' finding, in that frame | "✗ layout: text overflows its box (`.f04-…-title`), at 31.2s" |
| Another frame's finding | the check sees the whole video | not this frame's: left to `verify` | |
| A first build | no `index.html` | the `frames` stage is skipped: there is nothing assembled to look at | "· frames   a first build: nothing assembled yet to look at" |
| A rebuild, frames edited | files newer than `index.html` | frame-lint and the layout check on those, one browser | "✓ frames   2 changed (04, 07): lint and layout" |
| A rebuild, no frame edited | | skipped | "· frames   none changed since the last build" |

#### Interface

`scripts/lib/frame-layout.mjs` `layoutCheck(dir, frames)` → per frame, its errors and warnings; used by
`scripts/frame-check.mjs` and `build`'s `frames` stage.

#### Example

```
✗ frames    frame 4 (04-step-1.html): text overflows its box (.f04-step-1-title, 31.2s): fix it, frame-check 4, then build
```

### Step 12 — A revision: gather the fixes, patch the frames, build once

The skill's revision gathers every fix (the review's, fresh eyes') before touching a frame; patches only the frames
they touch, each in its own file, checked with `frame-check` as it lands (never one script that writes every frame,
and never a full build to see one change); hands independent frames to workers when there are several; and runs
`build` once at the end. Fresh eyes start in the background as soon as the build is done, and the builder prepares
the rest (the contact sheet, the summary, the review command) while they read.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| Six fixes over four frames | a review | four frames patched, each checked, one build | |
| Frames drawn by a generator script | a video whose frames one script writes | the script patched where the change is, not written whole | |
| A fix to the words only | SCRIPT.md | one build (narrate voices only that line) | |

#### Interface

`skills/plan-to-video/SKILL.md` (revising after a review, and Step 5's fresh eyes).

#### Example

"Gather every fix first. Patch the frames they touch, `frame-check` each. Then one `build`."

### Step 13 — Fonts by name

The packet and `references/frames.md` say how a frame uses a font: by family name in its CSS (`"EB Garamond"`,
`"Inter"`, `"JetBrains Mono"`), which HyperFrames loads; the video's own files, when it has them, are listed by
path. No worker looks for a font on the disk.

#### Cases

| Case | Input | What happens | Example |
|---|---|---|---|
| A video with `assets/fonts/` | | the families and their files by path | |
| A video without | | the theme's families by name | |

#### Interface

`scripts/frame-packet.mjs`, `skills/plan-to-video/references/frames.md`.

#### Example

"Fonts: name them by family in CSS (`font: 400 46px/1.1 "EB Garamond"`); HyperFrames loads them. This video's files:
…/assets/fonts/EBGaramond-400.woff2, …"

## Decisions in force

- **D-225** Every finding is answered before you see the video: still so. A note under the designer's `## Advisory` is
  not a finding, and a `[plan]` finding is answered `plan:` or `ask:`, never `kept`.
- **D-227** Every new video gets fresh eyes, and the system video: still so, one round (a second only on what the
  first changed).
- **D-245** Before you watch shows only new kept findings: still so; an `ask:` answer is shown first.
- **D-127** Plain words on screen: the storyboard read (step 4) tests them before any frame.
- **D-082** The headless run's auto mode and sandbox: unchanged; its prompt only names the skill and drops `verify`
  on an approval.
- **D-024**, **D-064**, **D-066**, **D-085**, **D-106**, **D-107**, **D-109**, **D-110**, **D-129**, **D-168**, **D-169**, **D-170**, **D-171**, **D-195**, **D-197**, **D-198**, **D-199**, **D-200**, **D-201**, **D-213**, **D-215**, **D-216**, **D-217**, **D-218**, **D-219**, **D-220**, **D-221**, **D-222**, **D-223**, **D-244**, **D-247**, **D-248**, **D-249**, **D-303**, **D-304**, **D-305**, **D-306**, **D-309**, **D-310**, **D-311**, **D-312**: unchanged by this plan, which
  touches how a video is drawn and checked, not what they decide.

## Supersedes

- **D-231** What is left after the third round: there is no third round. Fresh eyes are one round, and a second only
  on scenes whose narration or order the first changed (step 2); what is left after the last round is said as D-231
  says.

## Components touched

- **The plan-to-video skill** (SKILL.md, the style guide, references/frames.md, the fresh-eyes prompts)
- **finish-project** (the build's stages: fresh eyes' state, check-terms, the length)
- **The reel CLI** (`frame-packet`, `frame-check`, `fresh-eyes --script`, `build`'s link and its `frames` stage)
- **The review server** (the link `build` checks)
- **The headless run** (its prompt)

## How it is judged

The pipeline-cost ledger (`eval/pipeline-cost/LEDGER.md`): the bakery example on a fresh machine again, against its
row (49 wall-min, 31 of them verifying), and the variety line of the video's scenes (`lib/variety.mjs`: no more than
before share one layout), so a cheaper video that looks more alike shows in the numbers.

## Questions

None open: the owner asked for all of these (2026-10-10).
