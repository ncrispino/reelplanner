# Code check brief: 2026-09-27-details-in-the-frame

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-27-details-in-the-frame/code-check/findings.md`.

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
# Code check: 2026-09-27-details-in-the-frame

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

## Commits (1e5f6c1..HEAD, limited to packages/player scripts/frame-lint.mjs scripts/check-details.mjs scripts/lib/frame-html.mjs scripts/test/details.spec.mjs scripts/test/visuals.spec.mjs skills/plan-to-video templates/reelplanning/theme/frame.md .reelplanning/theme/frame.md)

```
6d9c869 Player: own words wrap, grow to a few lines, then scroll in the same box (the owner's ask)
e2be703 Details in the frame, steps 2-4: the marked thing is the button, the page opens over the frame, the chip is the fallback
4382522 Details in the frame, step 1: data-detail marks the thing a page explains; frame-lint and the details check hold it
eb9cee1 Quick checks later, on a new case: D-197 to D-199 decided in conversation; the style guide §7 and SKILL.md follow
a705562 Tests: answer-on-frame's full pass runs as 4 shards side by side; test:full about 5 minutes
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-27-details-in-the-frame/plan.md` in full. Its title is "Details in the frame: click the thing a detail explains", with 4 steps.

## The decisions that apply

- **D-004** (step 2) After a pick-all-that-apply answer, what does the video play? → **One summary frame**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-023** (step 4) What code does a walkthrough show? → **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-066** (step 3) How far does the first version go beyond Claude Code? → **One setting, tested with Claude Code**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
  - note: changed by D-197 to D-199 (decided in conversation, 2026-09-27): the count holds, but each check now comes after the next step's scenes (the last step's at the end, before the ending) and asks about a case the video did not show; the style guide's "It comes right after the beat that sets it up", "Use the same names and numbers as that beat's case" and "on a case the video showed" are replaced
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-194** (step 2) What shows that a thing on the frame opens a page? → **A tab, the whole time**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
- **D-196** (step 4) What becomes of the corner chip on a rebuilt video? → **It goes where a thing is marked**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | `frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding [close] | measuring each frame in a browser, or failing an unmeasured mark | frame-lint is the cheap static check run as each frame lands, as its camera and card rules are; failing every unsized span would fail most pinned words, and the player guards at run time (no button on a thing too small to tap on a phone) | `scripts/frame-lint.mjs`, `scripts/lib/frame-html.mjs` (`hboxOf`, `ownSize`), `scripts/test/visuals.spec.mjs` |
| A2 | 1 | Two things marked with one name in a frame fail `frame-lint` [close] | a note, or the player taking the first | the plan says one marked thing per detail, and the button goes over one box; a second would silently never open | `scripts/frame-lint.mjs`, `scripts/test/visuals.spec.mjs` |
| A3 | 2 | "Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip [visible, close] | the end of its reveal read from the scene's timeline, or the button from the scene's start | the page shows what is on screen whatever the timeline says (a fade, a camera, a later reveal), and a button over a thing still at 72 % would open a page about something not yet there | `detailMark` in `packages/player/reelplanning-player.js`; `packages/player/test/details.spec.mjs` ("before the thing lands") |
| A4 | 2 | The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`) [close] | moving the button after the controls in the page and placing it by script | in the picture's layer it moves with the zoomed picture as the cards' buttons do, with nothing to keep in step; the hop gives the order the plan asks for | `tabHop`; `packages/player/test/details.spec.mjs` (Tab / Shift+Tab) |
| A5 | 2 | The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes [visible] | only while the question is unanswered | while the box is up its cards carry the answer and their whys; one thing at a time on the frame | `syncDetailChip` (`!this._pendingDecision`); spec "answered, the button comes back" |
| A6 | 3 | Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel [visible, close] | over the frame only from the thing, the side panel from the chip and the list | one place for a page whichever way it was opened; D-195 supersedes D-021's side panel, and the Terms and the band's words are not details | `openDetail`, `homeDetailPanel`; spec "D-195: the page takes the video's box" |
| A7 | 3 | O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"` [close] | a fourth value for the key | the record says which way in reviewers use, and O is the key for whichever the scene shows; the plan names three values | `openDetailFrom`, `endDetail`; spec "logged from: frame" and "each says where it was opened from" |
| A8 | 3 | The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed [visible, close] | keeping the ring a few seconds after the page closes | the plan's ring was written for a page beside the frame; with the page over it, the grow, the shrink and the focus back on the thing say what the page was about | `.dhit[data-open]`; spec "while it is open, the thing keeps an ink ring" |

## The diff

Read it yourself: `git diff 1e5f6c1..HEAD -- packages/player scripts/frame-lint.mjs scripts/check-details.mjs scripts/lib/frame-html.mjs scripts/test/details.spec.mjs scripts/test/visuals.spec.mjs skills/plan-to-video templates/reelplanning/theme/frame.md .reelplanning/theme/frame.md` (from the repository root). The files it touches:

```
.reelplanning/theme/frame.md                   |  11 +-
 packages/player/reelplanning-player.js         | 300 ++++++++++++---
 packages/player/test/answer-on-frame.spec.mjs  | 514 ++++++++++++++-----------
 packages/player/test/details.spec.mjs          | 134 ++++++-
 packages/player/test/own-answer.spec.mjs       |  42 +-
 packages/player/test/revisit.spec.mjs          |   4 +-
 packages/player/test/size.spec.mjs             |   6 +-
 scripts/check-details.mjs                      |  21 +
 scripts/frame-lint.mjs                         |  40 +-
 scripts/lib/frame-html.mjs                     |  33 ++
 scripts/test/details.spec.mjs                  |  29 +-
 scripts/test/visuals.spec.mjs                  |  27 ++
 skills/plan-to-video/SKILL.md                  |  19 +-
 skills/plan-to-video/references/style-guide.md |  87 +++--
 templates/reelplanning/theme/frame.md          |  11 +-
 15 files changed, 952 insertions(+), 326 deletions(-)
```
