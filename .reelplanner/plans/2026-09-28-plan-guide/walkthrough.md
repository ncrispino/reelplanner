# Walkthrough: The plan guide: the video first, and a full page behind it you can read, check and edit

**Status:** implemented (steps 1 to 5), code-checked, walkthrough video built (4:00, 17 scenes, rendered), on branch `claude/clever-knuth-b5gtcf` ·
**Plan:** `plan.md` (approved, `reviews/plan-20260928T190542Z.md`; after the approval: prototypes v4 and v5, D-244,
D-246) · **Started from:** `3162f80` · **Decided before the build:** D-228 (its own page, a click away; parts over the
frame), D-229 (suggested edits, applied exactly), D-230 (every plan, with a Built side), D-244 (`plan.md` the one
source), D-246 (a click on a marked thing during a question opens its part)

**Commits:** faa6ee8 dc52612 5f80c02 30999e3 bba1a0b 9b6ec48 4551194 705ab97 d3a4e3c fb7d6dc a7073da (the reel CLI's
blocks and edits, the builder, the scenes' parts, the docs, the videos on the review page's guides, the parts made
small, the plan text's link, the stage at a glance and a check with no browser, the code check answered, an outside
source's part, the runs; the guide reads its diffs from them)

## Categories of change

What landed, by kind (this plan's own guide reads this list: each kind's files, the commits that are its, the runs).

- **The builder** {builder} (`scripts/guide.mjs`, `scripts/lib/guide/model.mjs`, `scripts/lib/guide/built.mjs`, `scripts/lib/guide/page.mjs`, `.gitignore`, `templates/gitignore`) (step 1): `reelplanning guide <video-dir>` reads `plan.md`, the ledger, the plan map, and after the build `walkthrough.md`, git and `runs/`; it writes the full page, a part a step or kind of change, and `parts.json`, never committed.
  Runs: `runs/guide-build.txt`, `runs/guide-check.txt`
- **The page** {page} (`templates/guide/`, `packages/player/guide-review.js`) (step 1): one flow of beats and a stage; every case, interface part, decision and line of a change one click down; things to do checked against the plan or the real run; the note box and Ask on any words.
- **The four blocks, checked** {blocks} (`scripts/lib/plan-md.mjs`, `scripts/lib/guide/check.mjs`) (step 2): `reel check` holds a new plan to its Cases, Interface and Example; `guide --check` fails what the page drops or makes up, lists every gap.
  Runs: `runs/reel-check-new-plan.txt`, `runs/guide-check-fails.txt`
- **The video and the guide point at each other** {pointing} (`scripts/plan-map.mjs`, `scripts/check-details.mjs`, `packages/player/reelplanning-player.js`, `scripts/bundle-player.mjs`, `scripts/build.mjs`, `scripts/finish-project.sh`, `scripts/explain.mjs`) (step 3): a scene's `- guide:` opens its part over the frame; "Open the full guide" and "Watch this moment" go back and forth; `build` makes and checks the guide.
- **Suggested edits, applied exactly** {edits} (`scripts/reel.mjs`, `scripts/lib/review-scope.mjs`, `scripts/revise-scope.mjs`) (step 4): `reel record` files an edit as a ledger entry and "Edits to apply", with the scenes it rebuilds: the guide only, when no scene says its words.
  Runs: `runs/reel-record-edit.txt`, `runs/edits-to-apply.txt`
- **Guides for the videos we have** {videos} (`.reelplanning/plans/2026-09-26-contributing/`, `.reelplanning/plans/2026-09-27-walkthroughs-that-help/`, `.reelplanning/plans/2026-09-28-videos-that-make-sense/`, `.reelplanning/plans/2026-09-29-explain-first/`, `.reelplanning/plans/2026-09-28-plan-guide/video/`) (step 5): their walkthrough.md's Commits and Categories of change, their scenes' parts, videos-that-make-sense's runs.
- **The skill and the record** {skill} (`skills/plan-to-video/SKILL.md`, `.reelplanning/glossary.md`, `.reelplanning/system.json`, `docs/reference.md`, `CHANGELOG.md`): the four blocks, `- guide:`, the build's guide stage, Edits to apply, walkthrough.md's Built-side lines; the guide a part of the system.
- **Tests** {tests} (`scripts/test/`): `guide.spec`, new; `run.mjs` runs it in the fast set.

## What was done, per step

### Step 1 — The guide: a page for each plan, built from plan.md (question 1) ✅

**You can now:** open a full page under each video, with every case, command and decision of the plan.

- **`reelplanning guide <video-dir | plan-dir | explainer-dir> [--check] [--out <file>]`** (`scripts/guide.mjs`) writes a
  video's guide into `<video-dir>/guide/`: `index.html`, the full page; `<part>.html`, each part the player opens over the
  frame (`step-<n>`, `decisions`, and after the build `what-changed`, one per kind of change, `choices`; an explainer's
  `sources` and `source-<id>`); `parts.json` (A1). A plan folder builds each of its videos' guides; a plan with no video
  yet gets `<plan-dir>/guide/index.html`. None of it is committed (D-213: `.gitignore`, `templates/gitignore`). It
  takes about a second once its pictures and `git blame` are cached (`guide/.cache/`; the first build of a built plan
  about ten).
- **Made from `plan.md`** (D-244; `scripts/lib/guide/model.mjs`): every section of it, each step's prose and blocks
  (`readPlanBlocks` in `scripts/lib/plan-md.mjs`), the decisions by step from `decisions.json` and each "Decisions in
  force" line under the steps it names, the questions answered or open, the parts each step touches ("Components
  touched" and `system.json`), each scene's time and picture from the plan map. An explainer's source marked
  `needsPart` (or `guide`, as `explain` writes it) is its part: the source as pinned, files whole with the lines the
  video quotes marked, a sequence an entry a line, a table filterable; one kept outside the repo by its path only (A4).
- **The page** (`templates/guide/guide.js`, `guide.css`; A2): the review page's paper, inks and coral, light and dark;
  the flow of prototype v5 (beats on the left, a stage that becomes each beat's thing), one column on a phone; the rail
  with the outline, Expand all and the gaps, folding into a menu on a phone. Each step: its moments ("Watch this
  moment", a picture of the scene and its time), "The step in the plan's words" in place, its cases (each row opens
  its trace), its interface parts (each opens its spec, and a try-it for its flags, marked "planned"), its example, its
  decisions (each its ledger entry), its question (predict each option's world, then answer in your review), and a Plan
  | Built switch. A gap is a dashed "Not written in plan.md". Things to do come from the blocks (A3).
- **The note box and Ask** on any words selected, on the full page (`packages/player/guide-review.js`) and in a part
  (the bridge): Comment, Suggest an edit (the plan's words only), Ask; one review with the video's.
- Tried: `runs/guide-check.txt` (videos-that-make-sense's two guides); the five plans below.

#### Interface as built

```
reelplanning guide <video-dir | plan-dir | explainer-dir>   # build the video's guide: the full page, its parts, parts.json
  --check                                                    # also check the page, and list what is missing
  --out <file>                                               # the full page to this file, no parts
  --no-thumbs                                                # leave the scenes' pictures out
  --outside                                                  # an explainer: a source outside the repo's text, masked
  ✓ …/video/guide/index.html · 5 steps, 3 questions, built: 8 kinds of change, 126 files, 11 runs, 1,255 KB · 16 parts
```

### Step 2 — Complete, and checked: every step's cases, interface, example and decisions ✅

**You can now:** count on each new plan spelling out every case, command and example: `reel check` insists.

- **The four blocks** are read (`stepBlocks`, `interfaceParts`, `traceBeats`, `stepsNamed` in `scripts/lib/plan-md.mjs`):
  Cases a table with a Trace column (labelled beats), Interface a fenced block a part a line with its meaning after `#`
  (a flag's line a part of it, what it prints under it), Example; Decisions generated.
- **`reel check`** (`check` in `scripts/reel.mjs`, `blockFindings`) holds a plan written from 2026-09-30 to them (A5),
  or any with `--blocks`: no Cases table, no Interface block and no "No interface" line, an open question's option with
  no example (A6) fail; a case with no trace, a part with no meaning, a decision in force with no step are one warning
  line (`runs/reel-check-new-plan.txt`). `reel retro`'s draft carries its blocks.
- **`guide --check`** (`scripts/lib/guide/check.mjs`), run by `build` after verify: in a browser, every heading and
  paragraph of `plan.md` in the page; each case, interface part, decision, step text and kind of change opens its
  layer by a visible control; Expand all with reduced motion leaves nothing closed; every drag has "Show me" and
  keyboard cards; a run shown as real is a file in `runs/`, a commit named is in the repo; no sentence of the narration
  on the first layer (A7); no error, no network, no sideways scroll at 375 px, each part fine at 560 px. It lists every
  gap and fails only on those.

### Step 3 — The video and the guide point at each other (question 2) ✅

**You can now:** click something in the video to jump to its part of the page, and back.

- **A scene's `- guide: <part>[#<place>]`** (A8; `scripts/plan-map.mjs`) is a detail whose page is `guide/<part>.html`:
  the frame marks its thing `data-detail="<part>"`, the player lays its Open tab on it, or the corner chip where it
  marks nothing (`scripts/check-details.mjs` warns then, never fails). The part's header has "Open the full guide · <the
  part>" (prototype v5's), the plan text's header "Open the full guide" and each step its part under "Open:", once the
  guide is there (`guidePart`, `renderPlanText` in `packages/player/reelplanning-player.js`).
- **D-246** holds for a part as for a detail: while a question is up, a click on the marked thing opens it, and closing
  it brings the question back as it was left (the player's, unchanged since prototype v5).
- **"Watch this moment"** on each section, category and case goes back to the review page's player at its time
  (`?project=<video>&t=`), the other video of the plan too; a part seeks its own video.
- **`build`** runs the guide after the plan map (`scripts/finish-project.sh`) and again after verify with the new
  pictures and its check, a △ for a scene whose picture is missing (`scripts/build.mjs`); `bundle-player` builds a
  guide missing or older than its sources and publishes its parts (`scripts/bundle-player.mjs`); the row's Guide link is
  prototype v5's.
- A part the builder makes lives in `guide/`, not `details/` (D1).

### Step 4 — Edit the plan on the guide: comments, and edits the agent applies exactly (question 3) ✅

**You can now:** comment on or suggest an edit to the plan's words, right on the page.

- **A suggested edit** is the note box's "Suggest an edit" on the plan's own words (a step's text, a case row, an
  interface line, the example, a question's option), as prototype v5 made it after the owner's "highlight text and a
  review box pops up": there is no separate Edit button. It is kept with its words and its place (A10).
- **`reel record`** files each as one ledger entry, kind `edit`: the reviewer's words chosen, the plan's not
  (`record` in `scripts/reel.mjs`), and `reviews/<id>.md` gets **Edits to apply**: each edit, and what it rebuilds, the
  guide and only the scenes whose narration or frame show the words (`editsOf`, `scenesSaying`, `actOnMarkdown` in
  `scripts/lib/review-scope.mjs`; `scripts/revise-scope.mjs` prints them). The plan's own example, run
  (`runs/reel-record-edit.txt`, `runs/edits-to-apply.txt`): `--out <file>` → `--to <file>` rebuilds scenes 12, 20, 21,
  22, 23 and 26; step 2's case row no scene says rebuilds the guide only.
- **An answer on the guide** is the same answer as on the video (A11). The skill says how the revise applies an edit.

### Step 5 — After the build, and which plans get a guide (question 4) ✅

**You can now:** see what was built beside what was planned, with the real diffs and saved runs.

- **The Built side** (D-230; `scripts/lib/guide/built.mjs`) is made from `walkthrough.md`: its **Commits:** line (else
  the commits after Started from whose message names the plan, said as a gap), its **Categories of change** (A12), each
  step's section and `#### Interface as built` beside the planned one, its calls; git (every file of every commit, its
  changes with ten lines around them, the whole file with the lines `git blame` gives to that kind's commits marked; a
  generated file listed, not shown); and `runs/`, whole. On it: What changed (each kind with its counts, a picture of
  its scene), each kind's section (its files, every line, its runs, a run's lines to predict), every choice.
- **Guides for the videos on the review page**: explain-first, videos-that-make-sense, contributing and
  walkthroughs-that-help got their Commits and Categories of change, and each of their videos' step scenes (and a
  walkthrough's scenes of each kind) its part; plan-guide's video its steps' parts (A9). Every plan gets its guide when
  it is built (D-230); an older plan when someone runs `reelplanning guide` on it, its gaps shown.

## The walkthrough video

`walkthrough-video/`, 4:00, 17 scenes in six parts, rendered (`renders/video.mp4`, not committed): the change running,
from the plan's own `runs/` and the guide itself. It pauses where `reel stops` says: A1 to A4 (scene 4), D2 (5), A8 and
A9 (10), D1 (11), A10 and A11 (13), A12 and A13 (14); A5, A6, A7 and A14 are the list (16). Quick checks k1 (8) before
`reel check` runs, k2 (12) before the edits are filed. The showcase: twelve of its scenes open their part of this plan's
own guide, built by the builder it shows (`- guide:`, the thing marked `data-detail`), and its guide is the plan's, with
the Built side. Fresh eyes: three rounds, every finding answered in `walkthrough-video/fresh-eyes/` (round 1 cropped
the screenshots to readable regions, moved labels off what they label, and gave the words it used meanings; what was
kept is on Before you watch).

## Tests run

- New: `scripts/test/guide.spec.mjs` (26 checks, 20 to 40 s, in the fast run): the four blocks read; `reel check` on a
  new plan with none (fails), with them (warnings only), on an older plan (not held; `--blocks` holds it); walkthrough.md
  read; the plan map's `- guide:` on a copy of walkthroughs-that-help's video; a built plan's guide in a scratch repo
  (its cases, interface, example, question, its Built side from git and a run, its gaps); `guide --check` passing, and
  failing a run `runs/` does not hold and a first layer saying the narration again; `check-details` taking a part's mark
  and warning on an unmarked one; an explainer's `needsPart` source whole; `reel record` filing two suggested edits.
- `npm test`: all 34 passed (139.6 s) after the merge of the shared branch; its run named the runs saved while it ran
  as changed fixtures (this plan's own, then committed).
- `guide --check` failing for real on a run nobody saved, in a scratch clone (`runs/guide-check-fails.txt`), and the
  guide built on this plan's video (`runs/guide-build.txt`).
- The guides of the five plans, each checked: `reelplanning guide <plan> --check` passes on all nine videos; pictures
  of each at 1440 × 900 and 390 × 844, light and dark, and of a part over the frame on the bundled review page.

## Not done

- **Hand-built things to do and data tables** from prototypes v4 and v5 (the step 6 frame to fix with frame-lint
  recomputed, the newcomer's brief to sort, every fresh-eyes finding as a filterable table, the specs table) are not
  made by the builder: nothing in a plan's files says them (A3, A9).
- **A step's own picture** (`templates/guide/picture.html`, a state per case and option) is supported and no plan has
  one yet; the step's parts are drawn as names, the touched ones lit (D2).
- **The system video** is behind by the glossary's new rows (the guide, a part of the guide); per D-003 it is brought
  up to date after this walkthrough is accepted, which it was in conversation on 4 Oct (`reviews/walkthrough-20261004T163158Z.md`), so
  that update is next.
- **Older plans' blocks**: the plans before this one have no Trace column and few `#` meanings (this one included:
  they were written before the rule), so their guides show those as gaps.
- **No explainer exists in this repo yet**: its parts are shown working in `guide.spec` on a scratch explainer.

## Code check

A fresh agent (`claude -p` with only the brief's prompt, reading the repo and `git diff`/`log`/`show`, writing
`code-check/findings.md` alone) checked `3162f80..4551194` over this plan's paths: **steps 4 of 5 ✓, decisions 55 of
55 ✓, unexplained 10 ✗** (`code-check/findings.md`).

- **✗ Step 5** (no "sort real findings by what their author did", no "move a label onto its thing on a real frame while
  `frame-lint`'s verdict follows"): not built, said in Not done. Both were prototype v5's, made by hand from one
  video's fresh-eyes findings and one frame; nothing in a plan's files says them, so the builder makes its things to
  do from the blocks and the real runs (A3). The rest of the step is carried, as the check says.
- **✗ `packages/player/reelplanning-player.js`**, **✗ `scripts/explain.mjs`**, **✗ `scripts/plan-map.mjs`**,
  **✗ `scripts/bundle-player.mjs`**, the first **✗ `scripts/reel.mjs`** (`new-plan --from`, `record`'s "what you want
  next") and **✗ `skills/plan-to-video/SKILL.md`** (Finish's suggestions, `- next_more:`, "Open threads"): not this
  plan's. They are explain-first's `a20bfc5`, made by another worker on the shared branch and merged in (`5823bbb`);
  that plan's walkthrough answers for them. This plan's changes to the same files are the guide's (its **Commits:**
  line lists only its own, and its guide's Built side shows only those).
- **✗ `scripts/reel.mjs`** (`retro` writes Cases and Interface blocks and "(all steps)"): a new row, m10. The retro's
  draft plan has two fixed steps (apply the skill edits, run the benchmark), and its blocks describe those two, so a
  retro plan written once the blocks are due passes `reel check`; the trace is those steps' own, the same every time.
- **✗ `scripts/lib/guide/check.mjs`** (passes without a browser): changed. With no `playwright-core` the check now
  says `△ not opened in a browser: …` (what was not checked, and how to install it), and `build`'s guide stage is a △,
  not a ✓ (`scripts/guide.mjs`, `scripts/build.mjs`); it still does not fail, as `check-details` does not: a plain
  `npx reelplanning` has no browser. A new row, m11.
- **✗ `scripts/lib/guide/built.mjs`** (generated files by counts, lines over 2,000 characters cut, no whole file over
  1.5 MB, files by folder with no categories): a new row, A13. What is cut is what no one reads line by line (a
  plan map, a picture, a minified line); every line a person wrote is there whole. Grouping by folder when
  `walkthrough.md` has no categories is said on the page as a gap (older plans; m7's case).
- **✗ `scripts/check-details.mjs`** (an unmarked guide part only warns under `details_check: strict`): a new row, A14.

## Decisions in force

- **D-244** (`plan.md` the one source) held: the guide reads `plan.md` and nothing is written for it
  (`scripts/lib/guide/model.mjs`); every tool that read `plan.md` reads it still.
- **D-228** (its own page; parts over the frame) held: `guide/index.html` beside each video, its parts opened over the
  frame (`scripts/plan-map.mjs`, `packages/player/reelplanning-player.js`).
- **D-229** (suggested edits, applied exactly) held: `reel record`'s Edits to apply (`scripts/lib/review-scope.mjs`).
- **D-230** (every plan, with a Built side) held: `build` builds it for every plan video and walkthrough
  (`scripts/finish-project.sh`, `scripts/lib/guide/built.mjs`).
- **D-246**, **D-206** (a click during a question opens its part; D-206 superseded) held: the player's
  (`packages/player/reelplanning-player.js`), unchanged, for a part as for a detail.
- **D-063**, **D-062** (the plan text beside the video) held: kept, its header links to the full guide
  (`renderPlanText` in `packages/player/reelplanning-player.js`).
- **D-194**, **D-195**, **D-196**, **D-208** (a detail over the frame from its thing) held: a part opens the same way
  (`detailMark` unchanged; `scripts/check-details.mjs`).
- **D-024**, **D-022** (details from templates; D-022 reopened) held: a step's picture is a fragment from
  `templates/guide/picture.html`; D-022 not answered here.
- **D-224** (one row, Plan | Built) held: a guide section's own Plan | Built switch, and the header's
  (`templates/guide/guide.js`); the row's Guide link (`scripts/bundle-player.mjs`).
- **D-219** (the walkthrough shows the change running) held: this plan's walkthrough video; the Built side holds the
  rest (`scripts/lib/guide/built.mjs`).
- **D-213**, **D-215** (built videos out of git) held: the guide too (`.gitignore`, `templates/gitignore`).
- **D-167**, **D-142** (today's look; the coral) held: the details template's tokens (`scripts/lib/guide/page.mjs`),
  coral only on what is yours or waiting on you (`templates/guide/guide.css`).
- **D-127** (plain words on screen) held: Guide, Watch this moment, Open the full guide, Expand all
  (`templates/guide/guide.js`).
- **D-129** (approving never blocked) held: nothing on the guide blocks Approve; an edit is a note
  (`packages/player/guide-review.js`).
- **D-166** (the brief picks the real things) held: the guide shows each step's interface in full either way
  (`templates/guide/guide.js`).
- **D-003**, **D-065** (the system video current; its review) held: the guide is added to `system.json` and
  `glossary.md`; the video catches up after acceptance (Not done).
- **D-001** (a second agent checks the code) held: the code check below (`code-check/findings.md`).
- **D-064** (long jobs to workers) held: the guide is a stage of the build (`scripts/build.mjs`).
- **D-225**, **D-226**, **D-227** (fresh eyes; meanings and Ask) held: Ask on the guide is Ask about this
  (`packages/player/guide-review.js`); this walkthrough video had its fresh eyes.
- **D-023** (a walkthrough shows code only where justified) held: the video shows the page; the whole diff is on the
  Built side (`scripts/lib/guide/built.mjs`).
- **D-002** (a flagged choice is fixed and its scenes rebuilt) held: the Built side is built again from what lands
  (`scripts/guide.mjs`).
- **D-168**, **D-169**, **D-170** (the case study) held: not touched (`scripts/case-study.mjs` unchanged).
- **D-066**, **D-171**, **D-200**, **D-201**, **D-202** (other agents, decision numbers, pull requests) held: not
  touched (`scripts/pr-check.mjs`, `scripts/renumber.mjs` unchanged); a contributor's plan gets a guide as any other.
- **D-005**, **D-082**, **D-083**, **D-084**, **D-085**, **D-106**, **D-107**, **D-108**, **D-109**, **D-110**, **D-128**,
  **D-197**, **D-198**, **D-199**, **D-216**, **D-217**, **D-218**, **D-220**, **D-221**, **D-222**, **D-223** held: not
  touched (`scripts/lib/memory.mjs`, `scripts/check-terms.mjs`, `scripts/lib/autonomy.mjs` unchanged; D-110: no step
  has five choices without a question: steps 1 to 5 have five (question 1 was asked about step 1), three, three, two and one).

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html` [visible] | one guide a plan at `<plan-dir>/guide/index.html`, as step 1's interface wrote it | the player and the review page open a video's guide beside it (after prototype v4); each video's page starts on its own side, its own moments first | `guideTarget` in `scripts/lib/guide/model.mjs` |
| A2 | 1 | The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat [visible, close] | v3's outline, text column and picture | the owner's direction after v4 was a flow, not boxes, and v5 was that flow; a `<details>` opens without a script and from the keyboard | `templates/guide/guide.js`, `templates/guide/guide.css` |
| A3 | 1 | Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in [visible, close] | prototypes v4 and v5's, built by hand for one plan | step 2: what to do comes from the blocks, so the agent writes nothing more; a hand-built one does not carry to another plan | `todosFor`, `builtOverview`, `catSection` in `templates/guide/guide.js` |
| A4 | 1 | An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine [hard-to-undo] | its text, masked, in every guide | the guide is published with the review page; D-249 keeps the transcript out of git, and a published page is no more private | `explainerModel` in `scripts/lib/guide/model.mjs` |
| A5 | 2 | The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them [close] | a marker in `plan.md`, or every plan | "a plan written after this ships": the folder's date is when it was written, and the plans before pass as they did | `BLOCKS_FROM`, `blocksDue` in `scripts/lib/plan-md.mjs` |
| A6 | 2 | An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup [close] | an `Example:` line under each option | the plans' questions set up one example and answer it per option; this passes those and fails "It stops." | `hasExample` in `scripts/lib/plan-md.mjs` |
| A7 | 2 | "Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out) [close] | any sentence, or the stage too | a short phrase (a step's title) is a heading by design; the stage is the real thing, not the page's words | `checkGuide` in `scripts/lib/guide/check.mjs` |
| A8 | 3 | A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:" [visible] | a chip on every step's scene | the guide is never committed (D-213), so a clone has none until it is built; a scene says which part is its, as a detail does | `scripts/plan-map.mjs`; `detailsList`, `guidePart` in `packages/player/reelplanning-player.js` |
| A9 | 3 | videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them [visible] | keeping the prototype's pages | the prototype is replaced; the same scenes open the same kinds of change, made from git and `runs/` | its `walkthrough-video/STORYBOARD.md` and `plan-map.json`; its `walkthrough.md`'s Categories of change |
| A10 | 4 | A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active [hard-to-undo] | a list of edits the page writes apart | the note box already keeps an edit with its words and place (prototype v5); one field fewer for every page to carry | `editsOf` in `scripts/lib/review-scope.mjs`; `record` in `scripts/reel.mjs` |
| A11 | 4 | An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`) [visible, hard-to-undo] | answers only on the video | step 4: one answer, whichever place gave it | `answerOnGuide` in `templates/guide/guide.js`; `answerFromGuide` in `packages/player/reelplanning-player.js` |
| A12 | 5 | walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else" [hard-to-undo] | a category a folder, or a commit | step 5's interface named the line; one file's changes can be two kinds (the player in videos-that-make-sense), and nothing is left out | `readWalkthrough`, `builtSide` in `scripts/lib/guide/built.mjs` |
| A13 | 5 | On the Built side a file the build writes (a plan map, captions, snapshots, pictures, audio, a rendered page) is listed with its counts, not shown; a changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has no whole text, its changes still shown [visible, close] | every line of every file | a plan's diff is mostly generated (a video's plan map alone is near 3,000 lines); step 5's "never cut" is about what a person wrote, which is always whole | `GENERATED`, `cutLine`, `builtSide` in `scripts/lib/guide/built.mjs` |
| A14 | 3 | A scene's guide part whose frame marks nothing is a △ under `details_check: strict`, where an unmarked detail fails; the player shows the corner chip for it [close] | failing it, as a detail | the videos on the review page were given their parts after they were built, and their frames mark the step's thing, not the part; a new frame marks it as a detail's (`data-detail`) | `scripts/check-details.mjs` |
| D1 | 3 | A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/` [deviation] | `details/<part>.html` | `details/` is committed with the video, and the guide is built, never committed (D-213) | `scripts/plan-map.mjs`, `scripts/check-details.mjs` |
| D2 | 1 | A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path [deviation] | the stage `reel stage` draws, the step's change drawn on, a case lighting its path | the stage's drawing is sized for a 1920 px frame, not a column; what a step changes is in its blocks, and the fragment is where a step draws its own | `stepPicture` in `templates/guide/guide.js` |
| m1 | 1 | Scene pictures on the page are 240 px JPEGs made from the snapshots with ffmpeg, cached in `guide/.cache/` | the snapshots' PNGs | a page of 40 scenes stays small | `thumbOf` in `scripts/lib/guide/model.mjs` |
| m2 | 5 | `git blame` runs eight at a time, cached in `guide/.cache/blame.json` | on every build | about a second a file | `builtSide` in `scripts/lib/guide/built.mjs` |
| m3 | 1 | A part carries only what it shows, and a file's whole text is kept once a page | every part the whole guide | videos-that-make-sense's guides went from 18 MB to 5 MB each | `partsOf` in `scripts/lib/guide/model.mjs` |
| m4 | 1 | `needsPart` and `guide` in `sources.json` both mean a part | `needsPart` only | `explain` writes `guide: true` | `needsPart` in `scripts/lib/guide/model.mjs` |
| m5 | 3 | `bundle-player` builds a guide missing or older than its `plan.md`, `walkthrough.md`, `sources.json` or plan map | publishing only one already built | a fresh clone has none | `scripts/bundle-player.mjs` |
| m6 | 3 | The videos on the review page get only the guide's fields in their plan maps; no scene rebuilt | regenerating their plan maps | a map written by today's plan-map carries more than the guide, and changes what memory reads | their `plan-map.json` |
| m7 | 5 | With no **Commits:** line, the commits after Started from whose message starts with the plan's title before its colon, said as a gap | no Built side | the repo's commits name their plan that way | `planCommits` in `scripts/lib/guide/built.mjs` |
| m8 | 5 | videos-that-make-sense's runs, made for prototype v4 on 2026-09-28, saved in its `runs/` as files | leaving them in v4's page | the Built side reads `runs/`; they are real runs | `.reelplanning/plans/2026-09-28-videos-that-make-sense/runs/` |
| m9 | 2 | An Interface block's indented `--flag` line is a part of its command, meaning or not | what the command prints | a flag is a part, and its missing meaning a gap | `interfaceParts` in `scripts/lib/plan-md.mjs` |
| m10 | 2 | `reel retro`'s draft plan writes its two fixed steps' Cases and Interface blocks, and "(all steps)" on its decisions in force | a draft with no blocks | a retro plan dated after the blocks are due would fail `reel check` as drafted | `retro` in `scripts/reel.mjs` |
| m11 | 2 | `guide --check` with no `playwright-core` says what it did not check, as a △, and `build`'s guide stage is a △ | passing silently, or failing | `check-details` passes the same way; a plain `npx` install has no browser, and the △ says so | `checkGuide` in `scripts/lib/guide/check.mjs`; the guide stage in `scripts/build.mjs` |

## For the guide

*Written after the build, for the guide (D-265): how each step works, drawn; worked examples, each from a run saved in
`runs/`; and what the video leaves out. Nothing above this section was changed. The runs made for it on 30 Sep 2026
(`reel-check-no-diagram`, `guide-plan-only`, `guide-tags`, `plan-map-detail`, `check-details`) ran with the code as it
is on that day, the first two in a scratch repo. Added on 30 Sep 2026 after the guide's first review round, still
after the build: the line below saying which runs were made in a scratch repo, and "every plan's or explainer's video"
in the sentence under it, where it said "every video" (the system video has none). Changed after the second round
(30 Sep): step 1's first example lists its slow first build last, and step 3's "Why" says D-246's rule in words.
Added after the third (30 Sep): step 5's two missing things and one choice in plain words, what step 3 does today, and
what each arrow of the first diagram is for. Added later on 30 Sep: under Since then, the two decisions made in
conversation after the build that changed step 3 (D-264, D-266) and the commits that carried them out.*

**Ran in a scratch repo:** `runs/reel-check-new-plan.txt`, `runs/reel-check-no-diagram.txt`, `runs/guide-plan-only.txt`,
`runs/reel-record-edit.txt`, `runs/edits-to-apply.txt`, `runs/guide-check-fails.txt` — each in a scratch repo, or a
scratch clone of this branch, set up for it (each run's own note, or its test, says which), never in this checkout:
the plans they name (`2026-10-01-quiet-output`, `2026-10-01-rename-flag`), the review filed by `demo@example.com`, its
two new ledger entries and the review's Edits to apply are that repo's, not this one's.

#### In plain words

- **Step 5**, with Not done's **Hand-built things to do**: Step 5 is built except two things prototype v5 made by
  hand: sorting real fresh-eyes findings by what their author did, and dragging a label onto its thing on a real
  frame while frame-lint re-checks it. They, and the prototypes' two data tables (every fresh-eyes finding, the specs
  table), are not built, because nothing in a plan's files describes them.
- **A12**: each kind of change is one line of walkthrough.md: its name, the files and commits it claims, its step and
  two lines about it; a changed file goes to the first kind that claims it, and one that none claims to "Everything
  else"

#### Since then

- **Step 3**: since 30 Sep (`3501c59`), where the guide sits under the video on the review page, clicking a marked
  thing pauses the video and scrolls this page down to its part, the video waiting as a small player in the corner.
  The diagram below is the step as it was built: a part opening over the paused frame, which is still what happens
  where no guide is under the video. Two decisions the owner made in conversation on 30 Sep, after the build, changed
  this step. **D-264**, the guide under the video (recorded in `6e4f7f6`), supersedes D-228's "its own page, a click
  away". The guide is on the same page as the video, below it, and the video is never replaced: scroll down and the
  video shrinks to a small player that stays in view. `3501c59` carried it out, with `fa8a474` (each part a section
  the page can land on) and two rounds of player fixes, `eeab1de` and `334e798`. **D-266**, quiet marks (recorded in
  `0be0254`), keeps the marks that lead to the guide from taking away from the video. Nothing is drawn while the
  video plays. When it is paused, a faint ↓ shows. On hover, a thin ring and a small grey "More in the guide ↓"
  appear. On a phone, the first tap shows the mark and the second opens it. The keyboard's focus ring stays. `257d723`
  carried it out and took away the black "Open · <title>" tab and 3 px ring that this step built. `334e798` kept the
  quiet look for a thing that fills much of the frame (a 1 px ring, no fill).

**In one sentence:** every plan's or explainer's video now has a guide under it, a page built from the plan's own files
that holds every case, command, decision and changed line the video only points at, and that you can comment on and
edit.

```diagram
flow: From the plan's files to the page under the video
plan.md (file) -> model: steps, blocks, questions | the page's one source: every section of plan.md is on the page
decisions.json (file) -> model: each step's decisions | so each step shows what was decided for it, and why
plan-map.json (file) -> model: scenes, times, pictures | so each part of the page can go back to its moment in the video
walkthrough.md (file) -> built: commits, kinds of change | which commits are the plan's, and the groups the page shows them in
git (store) -> built: diffs, whole files | the real changes, never written by hand
runs/ (file) -> built: saved outputs | what each command really printed, as it ran
built -> model: the Built side | what was built, beside what was planned
model -> page: one block of JSON | page.mjs puts the data, the CSS and guide.js in one file; guide.js draws the page in the browser
page -> guide/ (file): index.html, a page a part | nothing is committed: `reelplanning build` writes it again
model = model.mjs | scripts/lib/guide/model.mjs
built = built.mjs | scripts/lib/guide/built.mjs
page = page.mjs | scripts/lib/guide/page.mjs
```

### For step 1 — The guide

The system video is the one folder that gets no guide: it has `spec.md` instead. Where a plan's guide lives changed
from the plan: step 1's interface wrote one page a plan, at `<plan-dir>/guide/index.html`; as built, each video has its
own (A1), and only a plan with no video yet gets the plan folder's.

```diagram
flow: What the folder you name gets
a plan folder -> a video's guide: each of its videos
a plan folder -> plan-dir/guide/index.html (file): no video yet
a video's folder -> a video's guide: plan.md one folder up
an explainer's folder -> a video's guide: its video/
a video's guide -> guide/ (file): index.html, parts, parts.json
a video's guide = a video's guide | scripts/lib/guide/model.mjs
```

#### Worked examples

##### A video's guide
- **Input:** `reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video`
- **What happens:** it reads `plan.md`, the decision log, the video's `plan-map.json`, and, since the plan is built,
  `walkthrough.md`, the eleven commits it lists and `runs/`. It writes `video/guide/index.html`, one page for each
  part a scene can open, and `parts.json`, and says how many gaps it found. A gap is listed on the page, never filled in.
- **Output:** `runs/guide-build.txt`
- **Edge cases:**
  - A commit that `walkthrough.md` lists and this clone does not have fails `guide --check` (`named in walkthrough.md,
    not in this clone`): its diff cannot be shown.
  - A part page left from an earlier build (a kind of change since renamed) is deleted before the new ones are written.
  - It is slow only the first time: the first build of a built plan takes about ten seconds, since it asks git which
    commit wrote each line of every changed file (`git blame`); later builds read that from `guide/.cache/blame.json`
    and take about one.

##### A plan folder, both videos, checked
- **Input:** `reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense --check`
- **What happens:** a plan folder builds the guide of each of its videos, the plan video's and the walkthrough's, then
  opens each in Chromium to check it.
- **Output:** `runs/guide-check.txt` (lines 1-7)
- **Edge cases:**
  - Without `playwright-core` the check cannot open a browser. It says what it did not check, with a △, and does not
    fail (m11).

##### A plan with no video yet
- **Input:** `reelplanning guide .reelplanning/plans/2026-10-01-rename-flag --no-thumbs`
- **What happens:** there is no `video/` to put it in, so the page goes in the plan folder, `guide/index.html`, with no
  part pages: no scene can open one yet.
- **Output:** `runs/guide-plan-only.txt`

#### Why it works this way

The guide is generated, never written: every sentence on it is a sentence of `plan.md` or `walkthrough.md`, a line of
the decision log, a line of a diff or a line a command printed. So a plan that changes gets a guide that changes with
it, and there is no second copy to fall out of date (D-244). It is not committed either (D-213): `reelplanning build`
and `bundle-player` write it again from its sources, which are committed.

#### What else was considered

- One guide a plan, at `<plan-dir>/guide/index.html`, as step 1's interface wrote it. Built instead: one a video (A1),
  so the plan video's page opens on the plan and the walkthrough's on what was built, each with its own moments.
- Pages made by hand for one plan, as prototypes v4 and v5 were. They explained well, and none of it carried to the next
  plan; their hand-built things to do are not made (Not done).

#### What breaks it

- A walkthrough with no **Commits:** line: the builder falls back to the commits after **Started from** whose message
  starts with the plan's name (m7), and says so as a gap. A commit message worded otherwise is missed.
- A plan map older than the storyboard: the scenes' times and pictures on the page are the old ones until `plan-map` runs.

#### Limits

- A changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has its changes but
  not its whole text (A13).
- The scene pictures are small JPEGs made by ffmpeg from the video's snapshots; with no snapshots (a fresh clone), each
  scene is a link only.

#### Files and commands

- `scripts/guide.mjs`: the command; `scripts/lib/guide/model.mjs`: what goes on the page; `scripts/lib/guide/built.mjs`:
  the Built side; `scripts/lib/guide/page.mjs`: the one file; `templates/guide/guide.js` and `guide.css`: the page.
- `reelplanning guide <folder> --out /tmp/g.html` writes the full page alone, no parts, to look at without touching the
  video's folder.

### For step 2 — Complete, and checked

```diagram
flow: What reel check does with a new plan's blocks
a plan (file) -> its folder's date: 2026-10-01-…
its folder's date -> held to the blocks: 30 Sep 2026 or later, or --blocks
its folder's date -> not held: an older plan
held to the blocks -x fails: a missing block
held to the blocks -> warns: a missing detail
warns -> the guide: each shown where it is
fails = fails | no Cases table, no Interface, an option with no example
warns = warns: one line | no trace, no meaning, no step, no Example, no diagram
```

```diagram
sequence: What guide --check does in a browser
guide --check -> Chromium: open the page, 1440 and 375 px wide
Chromium -> guide --check: errors, network asks, width
guide --check -> Chromium: Open everything, reduced motion
Chromium -> guide --check: the text, every fold, each run shown
note guide --check: plan.md's every paragraph in the text; no narration sentence on the first layer; each run in runs/
guide --check -> Chromium: each part, 560 px wide
```

#### Worked examples

##### A new plan with blocks missing
- **Input:** `reel check .reelplanning/plans/2026-10-01-quiet-output`
- **What happens:** the folder's date is after 30 Sep 2026, so the blocks are required. Step 2 has neither a Cases table
  nor an Interface block, and question 1's option B says what happens without an example.
- **Predict:** three things are missing from step 1 and step 2 as well: two meanings and an Example. Do they fail too?
- **Output:** `runs/reel-check-new-plan.txt`
- **Edge cases:**
  - An older plan, dated before 30 Sep 2026, passes as it did; `--blocks` holds it to them (A5).
  - An option counts as having an example when it has a value, a quote, a command or a number, or a word of five
    letters or more from the question's own "Say …" setup (A6). "It stops." has none.

##### Every block written, one diagram missing
- **Input:** `reel check .reelplanning/plans/2026-10-01-rename-flag`
- **What happens:** a scratch plan with all four blocks in step 1, and a diagram. Step 2 has cases and says "No
  interface", with no Example and no diagram. Both are warnings: the plan passes, and the guide shows them where they are.
- **Output:** `runs/reel-check-no-diagram.txt`

##### A run shown that was never saved
- **Input:** `reelplanning guide .reelplanning/plans/2026-09-28-videos-that-make-sense/walkthrough-video --check --no-thumbs`
- **What happens:** in a scratch clone, one kind of change in `walkthrough.md` names `runs/build-typed-in.txt`, a file that
  is not in `runs/`. The page would show an output nobody saved, so the check fails and names it.
- **Output:** `runs/guide-check-fails.txt`
- **Edge cases:**
  - A sentence of eight words or more from the narration on the first layer of the page fails the same way (A7): the
    page says more than the video, never the same.

#### Why it works this way

The guide can only be as full as the plan. A step with no cases makes a guide with no cases, so the place to insist is
where the plan is written, not where the page is built. `reel check` fails what makes a step unreadable (no cases, no
interface, an option you cannot picture) and warns about what makes it thinner (no trace, no diagram).

#### What breaks it

- A plan folder named with a later date than it was written is held to rules it may not know about; the date is the
  only signal (A5).

#### Files and commands

- `blockFindings`, `BLOCKS_FROM` and `hasExample` in `scripts/lib/plan-md.mjs`; `checkGuide` in
  `scripts/lib/guide/check.mjs`.

### For step 3 — The video and the guide point at each other

```diagram
sequence: A scene opens its part, and back
storyboard (file) -> plan-map: - guide: step-1, on scene 4
plan-map -> player: a detail: guide/step-1.html
note player: offered only once guide/index.html is there
you (person) -> player: click the marked thing
player -> part: opens over the paused frame
part -> player: Watch this moment, or Open the full guide
plan-map = plan-map | scripts/plan-map.mjs
player = the player | packages/player/reelplanning-player.js
```

#### Worked examples

##### A scene given its part
- **Input:** `grep -n -B1 "^- guide:" .reelplanning/plans/2026-09-28-plan-guide/walkthrough-video/STORYBOARD.md | head -12`
- **What happens:** each scene that has something to open says which part of the guide, on its own line, beside the
  step it shows.
- **Output:** `runs/guide-tags.txt`

##### What plan-map made of it
- **Input:** `grep -n -A12 '"name": "step-1"' .reelplanning/plans/2026-09-28-plan-guide/walkthrough-video/plan-map.json | head -14`
- **What happens:** the tag becomes a detail the player knows how to open: its page, why you would open it, and the
  seconds of the video it belongs to (scene 4, 41.9 s to 61.5 s).
- **Output:** `runs/plan-map-detail.txt`

##### Every part a scene opens, checked
- **Input:** `reelplanning check-details .reelplanning/plans/2026-09-28-plan-guide/walkthrough-video --no-browser`
- **Output:** `runs/check-details.txt`
- **Edge cases:**
  - A scene whose frame marks nothing for its part is a △ even under `details_check: strict`, where a plain detail
    fails (A14): the videos that got their parts after they were built mark the step's thing, not the part.

A part's page is `guide/<part>.html`, built again every time and never committed, not `details/<part>.html` as step
3's interface wrote it: `details/` is committed with the video (D1).

#### Why it works this way

A part is opened the way a detail already was: from the thing on the frame that it explains, over the paused video.
So nothing new had to be learnt to use it, and the rule for a click during a question (it opens the part, and
closing it brings the question back; D-246) holds for parts with no new code.

#### Limits

- On a fresh clone there is no `guide/` until something builds it; the player then offers no part at all, rather than
  a link that goes nowhere (A8).

### For step 4 — Edit the plan on the guide

```diagram
sequence: A suggested edit, from the page to plan.md
you (person) -> the page: select words, Suggest an edit
the page -> reel record: in your review: old words, new words, their place
reel record -> the record: decisions.json: an entry of kind edit
reel record -> the record: reviews/<id>.md: Edits to apply
note reel record: rebuild only the scenes whose words or frame show the old words; if none, the guide only
the record -> the revise: applied exactly, then reel check
reel record = reel record | scripts/reel.mjs
```

#### Worked examples

##### An edit to a command, and one to a case row
- **Input:** a review with two suggested edits: step 1's interface `--out <file>` → `--to <file>`, and a case of step 2
  given "or on a long press" at its end.
- **What happens:** each becomes a decision log entry of kind `edit`, the new words chosen and the old the other option.
  Then `reviews/<id>.md` lists them under Edits to apply, each with the scenes it rebuilds.
- **Output:** `runs/reel-record-edit.txt`

##### What the revise is told to rebuild
- **Input:** `cat .reelplanning/plans/2026-09-28-plan-guide/reviews/plan-20260929T210000Z.md`
- **Predict:** the case row's words are on no scene. What does its edit rebuild?
- **Output:** `runs/edits-to-apply.txt`
- **Edge cases:**
  - An edit whose old words `plan.md` no longer has, or which would overturn a decision in force, is not applied: the
    next version asks it as a question.

#### Why it works this way

`scenesSaying` looks for the old words in each scene's narration and in its frame's HTML, so a revise rebuilds only the
scenes that would say something wrong after the edit, and a change nobody sees costs no video at all.

### For step 5 — After the build

```diagram
flow: Where each changed file goes on the Built side
walkthrough.md (file) -> the plan's commits: its Commits line
the plan's commits -> each changed file: git show --numstat
each changed file -> the first kind that claims it: its paths, its commits
each changed file -> Everything else: no kind claims it
the first kind that claims it -> the diff: 10 lines around each change
the first kind that claims it -> the whole file: its lines from git blame marked
the first kind that claims it --> listed only: a file the build writes
```

#### Worked examples

##### A category of change, as walkthrough.md writes it
- **Input:**
  ```
  - **The builder** {builder} (`scripts/guide.mjs`, `scripts/lib/guide/model.mjs`, …) (step 1): `reelplanning guide` reads …
    Runs: `runs/guide-build.txt`, `runs/guide-check.txt`
  ```
- **What happens:** `{builder}` is the part's name, the one a scene's `- guide: builder` opens. The paths in backticks
  claim every change the plan's commits made to them; `(step 1)` ties it to its step; `Runs:` names the saved runs it
  shows. A bare commit in the brackets would narrow it to that commit's changes, so one file can hold two kinds.
- **Edge cases:**
  - A file two kinds both name goes to the first one listed; a file none names goes to "Everything else", so nothing
    the commits changed is left off the page (A12).
  - A walkthrough with no Categories of change gets one kind a folder, said as a gap.

#### What else was considered

- A kind of change a folder, or a commit: simpler, and wrong for this repo, where one commit touches several kinds and
  one file (the player) can hold changes of two plans (A12).

#### Limits

- The whole file is the file at the plan's last commit that touched it, not today's. A later plan's changes to it are
  not on this plan's page.
