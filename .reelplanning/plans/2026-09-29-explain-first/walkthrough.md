# Walkthrough: Explain first: a video of what is going on, before any plan

**Status:** implemented (steps 1 to 5), code-checked, walkthrough video built and rendered; after your walkthrough
review (changes requested at step 3), Finish's Explain more and Plan this suggest from the video, A9 and A13 changed,
scenes 6 and 9 rebuilt (3:33), on branch
`claude/clever-knuth-b5gtcf` · **Plan:** `plan.md` (the approval folded in, `43f0e00`) · **Started from:** `43f0e00` ·
**Decided before the build:** D-248 (after Plan this, lean on the explainer), D-249 (its text goes into git, never the
transcript), D-250 (general principles for any kind of thing, not a list of kinds; the owner's own words)

**Commits:** 60e9173 8b93f2a 33d744a 3c02f1d a523e4e 6ebdc58 35dfce8 4f6e262 34bdc49 45f7a94 cc7c32a 5609921 (steps 1 to 5,
the code check and its fixes, the walkthrough video; the guide reads its diffs from them)

## Categories of change

What landed, by kind (the plan guide's Built side reads this list: each kind's files, and the commits that are its).

- **The explain command** {explain} (`scripts/explain.mjs`, `scripts/lib/explainer.mjs`, `scripts/lib/length.mjs`, `scripts/lib/terms.mjs`, `scripts/pr-check.mjs`, `.gitignore`, `.reelplanning/.gitignore`, `templates/gitignore`, `templates/reelplanning/gitignore`, `.reelplanning/system.json`, `.reelplanning/glossary.md`) (steps 1, 2): `reelplanning explain "<what you asked>" <source>…` pins each source by its form and its shape in `sources.json`, and starts the explainer's folder and its video; a source over 200 lines needs a guide part.
- **The Explainer row** {explainer-row} (`scripts/bundle-player.mjs`, `scripts/review.mjs`, `scripts/plan-map.mjs`) (step 2): the review page lists an explainer as a row of its own, "explained at `<commit>`, N commits since".
- **Finish's three ends** {finish} (`packages/player/reelplanning-player.js`, `scripts/reel-intake.mjs`, `scripts/lib/reviews.mjs`) (step 3): an explainer's Finish ends in Done, Explain more or Plan this; the review is filed by scene, nothing in the decision log.
- **Plan this** {plan-this} (`scripts/reel.mjs`) (step 4): `reel new-plan <repo> <slug> --from <explainer-dir>` opens `plan.md` with "Explained first" and quotes the review in its problem.
- **Facts from their sources** {check-sources} (`scripts/check-sources.mjs`, `scripts/fresh-eyes.mjs`, `scripts/lib/fresh-eyes.mjs`, `scripts/build.mjs`) (step 5): `check-sources` in the build: a quoted line its source does not hold, an unpinned source, a secret, an email address or a home path stops it; the fact check is a third fresh agent.
- **The skill** {skill} (`skills/plan-to-video/SKILL.md`, `CHANGELOG.md`): the skill's An explainer section, and the changelog.
- **Tests** {tests} (`scripts/test/`, `packages/player/test/`): `explainer.spec` and `explainer-finish.spec`, new; `build.spec` changed.

## What was done, per step

### Step 1 — What an explainer is for, and what it shows ✅

**You can now:** get a video that explains any code, log or transcript, before you decide anything.

- **No kinds in the code** (D-250). Nothing in `scripts/explain.mjs`, `scripts/lib/explainer.mjs` or
  `scripts/check-sources.mjs` names a kind of explainer. What it knows is sources: each is pinned by its **form**
  (how it is read and hashed: a path in the repo, a file outside it, a commit or range, `worktree`, `since:<date>`,
  `pr:<n>`, `ci:<run-id>`, `this-session`, a decision) and described by its **shape**, the plan's four: a sequence
  (a `.jsonl`, `.ndjson` or `.log`; `since:`; a CI log), files (a folder, a file of the repo, a commit or range,
  `worktree`, a pull request), a table (a `.csv`, `.tsv`, or a JSON array of rows) or text (anything else, a
  decision). A new kind of thing needs no new code: an experiment's output folder is files, its results a table.
- **The guide rule, by size** (A2): a source over 200 lines (`GUIDE_LINES`) needs a guide part, `guide: true` in
  `sources.json`; a folder's own files each get one past that (`parts`), and a change counts its changed lines. The
  plan guide's builder is not built (D-228), so a part is a detail page for now, as the plan says; `explain.md` and
  the storyboard's direction name the sources that need one.
- **The six principles for the video** are in the skill's new **An explainer** section and in every new storyboard's
  "Video direction" (`scripts/explain.mjs` writes them): your question first, the shape before the detail, the real
  thing quoted, what moved, what is settled and open, short.
- **The explainer is a new part:** `The explainer` in `.reelplanning/system.json` (`explainer`, the id D-250 names)
  and its row in `.reelplanning/glossary.md`. D-003 held: the system video is not changed here; it catches up after
  this walkthrough is accepted (see Not done).

### Step 2 — Ask for one: the skill, a command, and a folder of its own ✅

**You can now:** ask for one in your own words: `reelplanning explain "<what you asked>" <sources>`.

- **`reelplanning explain "<what you asked>" <source> … [--slug] [--date] [--dry-run]`** (`scripts/explain.mjs`) pins
  every source (`pinAll` in `scripts/lib/explainer.mjs`), refuses one it cannot pin with what a source can be, and
  makes `.reelplanning/explainers/<date>-<slug>/`: `explain.md` (your words, "Explained at", what it will cover and
  leave out for the agent to fill, the sources), `sources.json` (the question, the commit it starts from, each source
  pinned), and `video/` with `BRIEF.md` and `STORYBOARD.md` started (`kind: explainer`, `plan_dir` the explainer's
  folder, `sources_check: strict`, `terms_check: strict`). A file outside the repo is kept by its path, shown as
  `~/…`, its hash and line count, never its text (D-249); a folder outside the repo (an experiment's output) is
  pinned file by file, each with its own shape (`pinAll`; found on the walkthrough's real run, fixed in `a523e4e`).
  Asked again, a new folder (`-2` the same day).
- **A snapshot, never rebuilt** (the approval's quick check): nothing rebuilds an explainer when the repo moves; the
  review page's row says "explained at `<commit>`, N commits since" (`commitsSince`).
- **The skill** (`skills/plan-to-video/SKILL.md`): its description gains the triggers ("explain …", "what's going on
  in …", "what happened in this session", "walk me through this branch", "what changed since …", "what did this
  experiment show"); **An explainer** says the six steps; **Build a video** names the explainer and `check-sources`.
- **The review page** (`scripts/review.mjs`, `scripts/bundle-player.mjs`): the whole repo's page serves each built
  explainer, named `<name>--explainer` (A1; `slugOf` and `videoDirFor` in `scripts/lib/terms.mjs`), in a row of its
  own kind under **Explainers**: its title, its day, its length, the commit it explains and the commits since, and
  what came of it (Done, Explain more, or "planned: <the plans>"; the length added after the code check). It waits under **Needs you** until it is reviewed, and again when
  Explain more rebuilt it (A10). The line under the title says "Nothing to decide … then Finish: Done, Explain more, or
  Plan this".
- **Its length** (A11, `scripts/lib/length.mjs`): an explainer aims at 2–4 minutes, 2–5 when a source needs a guide
  part; `build` warns past that, never stops.
- **Kept out of git** (D-249, D-213): `.gitignore`, `.reelplanning/.gitignore` and the templates leave out an
  explainer's voice, images, captures, renders and fresh-eyes pictures; `reel pr-check` fails a pull request that adds
  media under `.reelplanning/explainers/` (`scripts/pr-check.mjs`).

### Step 3 — Review it: the same player, and Finish says what comes next ✅

**You can now:** review it in the same player, then pick Done, Explain more or Plan this.

- **Finish's three ends** (`packages/player/reelplanning-player.js`, `EXPLAINER_ENDS`): a video whose plan map says
  `kind: explainer` (`isExplainer`) ends with **Done** (offered first), **Explain more** or **Plan this**, each saying
  what happens next, in place of Approve and Request changes. The panel says "Nothing goes into the decision log: an
  explainer asks no questions, and only an answer is a decision". It asks "What do you want next?", and your words go
  with the review (A9). The review says `kind: "explainer"` and `end`, and the row sent to the server names its kind,
  so it is filed in the explainer's folder (A13: Finish offers Done first). Marks, comments and the Terms are the
  same player's. **Ask about this** is answered from the explainer's sources, not a plan (added after the code check):
  the plan map carries what was asked and every pinned source (`explainer`, `scripts/plan-map.mjs`) and each scene's
  `- source:`, the hosted prompt gives them in place of a plan section and asks where the answer came from ("the
  source, `<its id>`"), and the line under the box says "from the explainer's sources" (`askPrompt`); the waiting
  session answers from the sources themselves (the skill).
- **After your walkthrough review: Explain more and Plan this say what they would mean for this video** (your comment at
  scene 6: "it should suggest based on that video what explain more would mean or waht plan this would mean, not just
  templated"; A9 and A13 changed after review). The suggestions come from the explainer's own content and are made at
  build time into its plan map (`explainer.next`; `nextSuggestions` in `scripts/lib/explainer.mjs`, called by
  `scripts/plan-map.mjs`), so a hosted page offers them with no server: under Explain more, a scene's own
  `- next_more:`, each long source on the scene that quotes it ("go deeper on `scripts/lib/inbox.mjs`, past the lines
  scene 2 quotes"), and each line of `explain.md`'s "What it leaves out"; under Plan this, a scene's own `- next_plan:`
  and each line of a new `explain.md` section, "Open threads", read as what a plan would do ("a plan to make a waiting
  review easy to see on the page"). The packed plan map also says how many commits have landed since and the first few
  (`scripts/bundle-player.mjs`), for "explain the 11 commits since `a523e4e`". At Finish the page refines them with what
  you did (`nextSuggestions` in `packages/player/reelplanning-player.js`): a suggestion on a scene you commented on,
  rewound, slowed down for or marked comes first and says so ("…, the part you rewound"); a question you asked, a quick
  check you missed, the words you looked up and a scene you went back to that none is about add their own; a comment
  that asks for something becomes a plan ("it should show who picked it up, by name" → "a plan to show who picked it
  up, by name"). Five an end at most. Each end's card leads with its first ("For instance, …"), not a fixed line. Pick
  one and it fills "What do you want next?" to edit, or write your own; the review carries it as `next` (the end, the
  pick, your words, whether you changed them). `reel record` and `reel-intake` file it: the `.md`'s "What you want
  next" says what was picked and from where, and for Explain more which scenes the next version rebuilds; `reel
  record` prints it. `new-plan --from` titles the draft with it and quotes it in the problem; an Explain more rebuild
  starts from it (the skill). `reelplanning explain` asks for the open threads and the two tags.
- **No plan questions:** `check-sources` fails a `- decision:` beat in a video of kind `explainer`.
- **`reel record <explainer-dir> [review.json]`** (`recordExplainer` in `scripts/reel.mjs`, `explainerReviewMd` in
  `scripts/lib/explainer.mjs`) files it as `reviews/explainer-<time>.json` with `.md` beside it: what the end means,
  "Nothing goes into the decision log", **Comments by scene**, **Questions you asked** (answered, and from where, or
  not), **What you want next**, and the quick checks. **The decision log does not change**, whatever the end: "this
  looks wrong" and Done add nothing to it (the approval's quick check). Your memory gets what you watched and looked
  up (D-218, `reviewFacts` with kind `explainer`). `reel-intake` files a review sent from the page
  (`scripts/reel-intake.mjs`, a `planDir` under `.reelplanning/explainers/`), and `listReviews` reads its kind
  (`scripts/lib/reviews.mjs`).

### Step 4 — Plan this: a plan that starts from the explainer ✅

**You can now:** turn an explainer into a plan whose video doesn't explain it all again.

- **`reel new-plan <repo> <slug> --from <explainer-dir> [--plan <file>]`** (`fromExplainer` in `scripts/reel.mjs`,
  `planQuotes` in `scripts/lib/explainer.mjs`): `plan.md` opens with "Explained first: `<name>` (its review:
  `reviews/explainer-<time>.md`)", and its problem quotes the review: each comment with its scene, each question with
  its answer, what you want next. With `--plan`, that plan gets the line after its title and the quotes at the top of
  its problem; without, a draft with the problem only, for the agent to write the steps (A12).
- **The plan video leans on it** (D-248): `reel prereqs` puts `before: <name>--explainer | the explainer this plan
  starts from: …` first under Before you watch, and a `recap:` line for the recap scene ("say it in two lines"); the
  plan video starts at what changes. The explainer's row on the page lists the plans that start from it
  (`plannedFrom`), and the plan's row links back to it, **Explainer** beside Plan | Built (`explainedFirst` in
  `scripts/bundle-player.mjs`; added after the code check).

### Step 5 — Honest and private: facts from their sources, a transcript kept out of git ✅

**You can now:** trust that every fact in it comes from a named source, and transcripts stay out of git.

- **`reelplanning check-sources <video-dir>`** (`scripts/check-sources.mjs`), run by `build` right after
  `check-terms` (`scripts/build.mjs`; skipped, with a `·` line, for a video that is no explainer and names no
  `- source:`):
  - each `- source:` must be pinned in `sources.json` (a source's id, a file in one, `:<from>-<to>` for lines;
    `resolveRefs`), or it fails;
  - each quoted line (the text of a `data-artifact`, block by block, outside `data-label` and `data-gloss`; A4) must
    be in its sources word for word, whitespace aside, each piece of a line cut with "…" on its own; a repo file is
    read as it was at the pinned commit, so a later edit never fails an old explainer; a transcript's JSON-escaped
    lines are read plainly; a source not on this machine is a △, not a failure;
  - a scene that states a number, or quotes a thing, with no `- source:` is a △, a failure under
    `sources_check: strict` (A5);
  - **a secret stops the build until the text is masked, never blurred** (the approval's quick check): a key
    (`sk-…`, `ghp_…`, AWS, Google, Slack), a private key, a `password=`, an email address, or a path in a home
    folder, anywhere in the video's text (A6), stops it, naming the scene and the key's kind by its prefix only
    (`ghp_…`: the check never prints any of the secret), with the masked form to use (`ghp_…REDACTED`, `~/…`).
    Masked, it passes: `REDACTED` is a cut like "…", so the words around the mask are still checked against the
    source. (Both found while building the walkthrough video's real runs, after the code check: the masked line first
    failed as "not in its source", and the message showed two characters of the key; fixed in `4f6e262` and
    `34bdc49`.)
- **The fact check** (A7, `scripts/fresh-eyes.mjs`, `scripts/lib/fresh-eyes.mjs`): an explainer with a source that
  needs a guide part (it sums up more than it quotes) gets a third fresh agent, the **checker**:
  `fresh-eyes <video-dir> --prompt checker` hands it `checker-brief.md` (the question, each pinned source with how to
  read it, the narration scene by scene with its sources) and it lists each sentence the sources do not support (F1,
  F2 …), answered like any finding. The round waits on it; any other video has the newcomer and the designer only.
- **Private** (D-249): the transcript is read where it is; `sources.json`, `explain.md` and the checker's brief show
  it as `~/…`, by hash and line count.

## The walkthrough video

**Rebuilt after your walkthrough review:** scenes 6 and 9 only, keeping their frame ids (`build --against` the
committed video; `plan-diff`: 2 changed). Scene 6 is the real Finish panel on the review server's explainer after a
viewer went back over scene 2 twice and commented on scene 3: each end's card led by this video's suggestion, Plan
this's three suggestions (the comment read as a plan, and the explainer's two open threads), one picked and filling the
box; A9 and A13 say what they do now. Scene 9 is the real draft `new-plan --from` wrote from that pick, titled by it.
Both came from real runs in a scratch clone (the page packed by `bundle-player`, `reel record`, `new-plan --from`,
`reel prereqs`). Now 3:33. Fresh eyes on the two scenes: two rounds, 20 + 17 findings, every one answered (6 fixed in
round 1: the panel shown larger, each choice card beside what it names, Done ringed when it is said, a ring on each
thing in the draft and on the explainer's line in `reel prereqs`, as the narration says them; meanings for "open
threads", "explain.md" and "long sources"); the rest kept with reasons.

Before that review: `walkthrough-video/`: 3:23 (asked for 3 to 5 minutes; `build` warns past 3 for a walkthrough), 15 scenes in five
parts, rendered to `walkthrough-video/renders/video.mp4` (kept out of git, D-213). The change running, from real runs in
a scratch clone of this branch: the map; the sources three runs pinned; `reelplanning explain` on an experiment folder
outside the repo, and asked again; the review page's Explainer row, under Needs you and after its review; the Finish
panel's three ends; `reel record` with the decision log at 250 before and after; `reel new-plan --from` and `reel
prereqs`; `check-sources` passing, failing on a retyped line, stopping on a GitHub token until it is masked. Three
quick checks, each just before the scene that runs it: the three the owner missed on the plan video (Friday's video,
"this looks wrong", the access key). Seven choices pause, in four scenes (A1, A10; A9, A13; A12; A6, A7); six are the
list. Fresh eyes: three rounds, 56 + 57 + 56 findings, every one answered (38 fixed in rounds 1 and 2: among them
scene 7, which went blank while it waited for your answer, and scene 5's picture, now the explainer under Needs you
and after its review); round 3 kept all with reasons.

## Tests run

- New: `scripts/test/explainer.spec.mjs` (41 checks, about 10 s, in the fast run: `explain` over a CSV outside the
  repo, a folder with a 240-line file, a range, a decision and a transcript in a scratch home; `check-sources` passing
  and failing each rule; the length budget; the checker; the review page's names; `reel record`, `reel-intake`,
  `new-plan --from`, `prereqs`; the library's Explainer row) and `packages/player/test/explainer-finish.spec.mjs`
  (Finish's three ends in the browser; in the full run, not the fast one).
- Changed: `scripts/test/build.spec.mjs` (the `check-sources` stage in the build's line of stages, skipped for a video
  with no sources).
- After your walkthrough review: `scripts/test/explainer.spec.mjs` gains the suggestions made at build time (`plan-map`
  on an explainer: a scene's tags, the long source it quotes, "What it leaves out", "Open threads" read as plans, the
  chapters when there is nothing else), the pick filed by `reel record` (the `.md` says what was picked, from where and
  that it was edited; Explain more names the scenes the next version rebuilds), `new-plan --from` titling the draft
  with it, and the packed map's commits since; `packages/player/test/explainer-finish.spec.mjs` gains Finish in the
  browser: Done still first, each end's card led by this video's suggestion, a build-time suggestion on the scene you
  rewound saying so and coming first, the commits since, your comment as a plan, a pick filling the box, another end
  dropping an unchanged pick, an edited pick kept with your words, and your own words with no pick. `npm test` after
  it: all 33 passed. `memory.spec`'s walkthrough-bar check now sets this repo's own walkthrough reviews aside in its
  copy: yours, filed with the review, is timed and came before the three the check makes.
- `npm test` at the end: 31 of 33 passed in a run made while the video rendered and two fresh agents ran; the two that
  failed, `size.spec` (a hover's timing) and `decisions.spec` (a resume's timing), passed alone right after. The run
  also names the fresh-eyes answers written during it as changed fixtures (this build's own, then committed).
- Real runs in a scratch clone, the ones the video shows: `explain` on a folder outside the repo and on a CI log;
  `check-sources` passing, failing, stopping on a key and passing masked; `reel record` Done and Plan this;
  `new-plan --from`; `prereqs`; the page, bundled and photographed. Three fixes came from them (`a523e4e`, `4f6e262`,
  `34bdc49`), and the page's row layout and two wordings (`45f7a94`).

## Not done

- **The guide parts themselves.** `sources.json` says which sources need one, and the storyboard's direction asks the
  scene to mark it; the part is a detail page until the plan guide's builder exists (D-228 approved, not built).
- **Ask about this reads the sources' text only where it can.** On your machine the waiting session reads them; on a
  hosted page Claude gets the sources' names, the scene's own quoted lines and the glossary, not the files.
- **The system video** is behind by the new glossary row (the explainer); per D-003 it is brought up to date after
  this walkthrough is accepted, with `spec.md`'s parts.
- **13 calls**, one past the dozen `reel audit` warns on; no step reached five.
- **No explainer is built in this repo yet.** The walkthrough video shows the command, the check and the review
  running on a scratch clone.

## Code check

A fresh agent (`claude -p` with only the brief's prompt, reading the repo and `git diff`/`log`/`show`, writing
`code-check/findings.md` alone) checked `43f0e00..a523e4e` over this plan's paths: **steps 2 of 5 ✓, decisions 55 of
55 ✓, unexplained 5 ✗** (`code-check/findings.md`).

- **✗ Step 2** (the row's length once reviewed): fixed, `6ebdc58`: the Explainer row says its length always, as the
  plan's interface shows it (`xrow` in `scripts/bundle-player.mjs`; `scripts/test/explainer.spec.mjs`).
- **✗ Step 3** (Ask about this from the explainer's sources): fixed, `6ebdc58`: the plan map carries the explainer's
  question and pinned sources and each scene's `- source:` (`scripts/plan-map.mjs`); the player's hosted prompt gives
  them in place of a plan section, and the box's line says so (`askPrompt`, `renderAsk` in
  `packages/player/reelplanning-player.js`; `packages/player/test/explainer-finish.spec.mjs`). What is left is said in
  Not done.
- **✗ Step 4** (the plan's row links back): fixed, `6ebdc58`: `explainedFirst` on the plan's row, an **Explainer** link
  beside Plan | Built (`scripts/bundle-player.mjs`; `scripts/test/explainer.spec.mjs`).
- **✗ `scripts/plan-map.mjs`** (`plan-map --thumbs`): not this plan's. It is `6e7d8c2`, another worker's commit on the
  shared branch (plan-map thumbnails), inside the range the brief named. This plan's change to `scripts/plan-map.mjs` is
  the `before:` warning naming `<explainer>--explainer` and the explainer's sources in the map (A1; step 3 above).
- **✗ `scripts/explain.mjs`** (`terms_check` and `details_check` strict): not a new call. The skill's **Build a video**
  asks for `terms_check: strict` and `details_check: strict` "on every new storyboard"; the explainer's storyboard is a
  new one, so it starts with them, and `sources_check: strict` beside them as the plan asks.
- **✗ `scripts/check-sources.mjs`** (a quoted thing with no source; any video that names a source): a call, and now
  said: A5's row covers both (changed after the code check). A quoted thing with no source cannot be checked word for
  word, so it is treated as a number with none; `- source:` is a tag any storyboard may use, so the check runs where one
  is named.
- **✗ `scripts/pr-check.mjs`** (media under `explainers/` fails): D-213 applied to the new folder, not a new call. D-213
  keeps the built video out of git in a shared repo and `pr-check` already fails media under `plans/` for it; an
  explainer's video is the same built video (D-249: its text, never the rest). Step 2's entry says it.
- **✗ `packages/player/reelplanning-player.js`** (Finish offers Done even with comments; the missed-checks guard picks
  Explain more): a call, now A13.

## Decisions in force

- **D-250** (general principles, not a list of kinds) held: no kind in `scripts/explain.mjs`,
  `scripts/lib/explainer.mjs` or `scripts/check-sources.mjs`; forms and shapes only (step 1).
- **D-248** (lean on it) held: `reel prereqs` lists the explainer first with a recap line (`prereqs` in
  `scripts/reel.mjs`); the skill says the plan video starts at what changes.
- **D-249** (its text, never the transcript) held: `sources.json` keeps an outside file's path, hash and lines
  (`pinOutside` in `scripts/lib/explainer.mjs`); `.gitignore` leaves the built video out; `check-sources` stops on a
  secret in the committed text.
- **D-001** (a second, fresh agent checks the code) held: the code check below; the checker copies its reason.
- **D-003** (the system video kept current after an accepted walkthrough) held: it is not rebuilt now; an explainer
  never replaces it (`reel status` unchanged).
- **D-005**, **D-066**, **D-085**, **D-107**, **D-109**, **D-169**, **D-170**, **D-171**, **D-201**, **D-202**, **D-247**
  (rewinds, other agents, less scaffolding, the retro, late fixes, the case study and its sites, decision numbers, a
  contributor's plan) held: not touched (`scripts/case-study.mjs`, `scripts/renumber.mjs`, `scripts/lib/autonomy.mjs`
  unchanged).
- **D-024**, **D-194**, **D-195**, **D-196** (details from templates, opened from their thing) held: a guide part is a
  detail made the same way (`scripts/detail.mjs` unchanged).
- **D-064** (long jobs to workers) held: the skill's explainer is built as any video, by the same loop
  (`skills/plan-to-video/SKILL.md`).
- **D-065** (a review of the system video) held: an explainer's review is its own kind (`recordExplainer` in
  `scripts/reel.mjs`), never `system-review`.
- **D-082** (a run nobody watches, in the sandbox) held: `reel-intake` hands an explainer's review to `reel record`
  as it does a plan's (`scripts/reel-intake.mjs`); the headless run is unchanged.
- **D-106**, **D-218** (your memory; a word you know stops being underlined) held: an explainer's review is added to
  your memory (`reviewFacts`, `recordYou` in `scripts/lib/memory.mjs`, called from `scripts/reel.mjs`).
- **D-110** (at a step's fifth call, ask) held: no step reached five (steps 1 to 5 have two, three, three, one and four); thirteen in all, one past the dozen `reel audit` warns on (see Not done).
- **D-127** (plain words on screen) held: Done, Explain more, Plan this, "Nothing to decide", "What do you want next?"
  (`packages/player/reelplanning-player.js`, `scripts/bundle-player.mjs`).
- **D-129** (approving is never blocked) held: none of the three ends is ever blocked; a missed quick check says so,
  "or finish as is" (`guardLine`).
- **D-142**, **D-167** (today's look, the darker coral) held: the Explainer row is the plans' row (`.prow`), its kind in
  the page's tokens (`scripts/bundle-player.mjs`).
- **D-166** (the brief picks which scenes show the real thing) held: the explainer's `BRIEF.md` keeps `- Real things:`
  (`scripts/explain.mjs`).
- **D-197**, **D-198**, **D-199**, **D-222** (quick checks: when, on what, where there is something to predict) held:
  an explainer asks one as a walkthrough does, just before the scene that shows it (the skill; `scripts/check-terms.mjs`
  unchanged).
- **D-200**, **D-219**, **D-221**, **D-223** (a pull request's walkthrough; the change running; listed choices; a
  small pull request) held: an explainer of a change is none of these (`scripts/pr-check.mjs` only learns the
  explainer's folder).
- **D-220** (no fixed count of pauses: a choice pauses the walkthrough when you'd notice it) held: what pauses is
  read from a call's tags, with no count (`PAUSING` in `scripts/lib/autonomy.mjs`, unchanged); an explainer makes
  no choices, so it never pauses for one. (Cited since the ledger correction of 2026-10-04 made it active again.)
- **D-213**, **D-215** (the built video out of git) held: `.gitignore` and `templates/gitignore` for explainers.
- **D-216**, **D-217** (jargon found; strict fails an unexplained word) held: the explainer's storyboard starts with
  `terms_check: strict` (`scripts/explain.mjs`).
- **D-224** (one row a plan) held: an explainer is a row of its own kind (`LIBRARY.explainers` in
  `scripts/bundle-player.mjs`).
- **D-225**, **D-226**, **D-227**, **D-245** (fresh eyes on every video, every finding answered, Ask about this, only new
  kept findings) held: an explainer gets them, and the checker's findings are answered and counted the same way
  (`rolesFor` in `scripts/lib/fresh-eyes.mjs`).
- **D-228**, **D-229**, **D-230**, **D-244**, **D-246** (the plan guide; built from its source; a click opens its part)
  held: `sources.json` says which sources need a part, by size (step 1); the parts wait on the plan guide's builder.

## Choices the plan did not specify

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 2 | An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough` [hard-to-undo, close] | `explainer:<name>`, as the plan's interface wrote it | a name is also a folder in the packed page, and a colon is not allowed in a folder name on Windows; `--explainer` reads like the walkthrough's | `slugOf`, `videoDirFor` in `scripts/lib/terms.mjs`; `slugFor` in `scripts/bundle-player.mjs` |
| A2 | 1 | A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines [close] | a fixed number of scenes' worth, or one rule for a whole folder | the plan says "over about 200 lines"; a folder of six small files and one long one needs a part for the long one only, as its review-server example says | `GUIDE_LINES`, `pinSource` in `scripts/lib/explainer.mjs` |
| A3 | 1 | A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text [close] | asking for the shape on the command line | no flag to get wrong, and a new kind of file lands on the shape its contents have; a repo file is shown and guided as a file (whole, its lines marked) | `shapeOfFile`, `pinSource` in `scripts/lib/explainer.mjs`; `scripts/test/explainer.spec.mjs` |
| A4 | 5 | A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked [close] | checking every word in the frame, or only elements marked as quotes | the theme's blocks already put the real thing in a `data-artifact`; a file's name in its bar is not a quote; "…" is how a long line is cut to fit; an old explainer must not fail when the code moves on | `frameText`, the quoted-line loop in `scripts/check-sources.mjs`; `sourceText` in `scripts/lib/explainer.mjs` |
| A5 | 5 | "States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1); a scene that quotes a thing with no `- source:` is treated the same; and `check-sources` runs on any video with a `- source:`, not only an explainer [close] (changed after the code check: the quote and the where said here) | number words ("three") too; a quote with no source left alone; explainers only | digits are what a source can hold word for word; "step 2" is the video's own structure, not a fact; a quote with no source cannot be checked; `- source:` is a tag any storyboard may use | `NOT_A_FACT` and the scene loop in `scripts/check-sources.mjs`; `scripts/build.mjs` |
| A6 | 5 | A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short [hard-to-undo] | only inside a quoted line, as the plan's words say | all of that text is committed (D-249); a key said in the narration or typed on a card is as public as one quoted | `privateIn` in `scripts/lib/explainer.mjs`; `scripts/check-sources.mjs` |
| A7 | 5 | The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part [visible] | a separate command, or a fact check on every explainer | it is fresh eyes' loop (briefs, answers, rounds) with another brief; the plan gives it to an explainer that sums up more than it quotes | `rolesFor`, `factChecked` in `scripts/lib/fresh-eyes.mjs`; `--prompt checker` in `scripts/fresh-eyes.mjs` |
| A8 | 3 | The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end` [close] | `end` alone | the player's Finish, Send and the review server already carry `verdict`; `end` is what the plan's interface names | `EXPLAINER_ENDS`, `exportPayload` in `packages/player/reelplanning-player.js`; `endOf` in `scripts/lib/explainer.mjs` |
| A9 | 3 | "What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` (changed after review: under Explain more and Plan this, the box follows this video's own suggestions, made at build time from its scenes, long sources and `explain.md`'s open threads and refined by what you did while watching; a pick fills the box to edit, or you write your own, and the review carries it as `next`) [visible] | a box shown only under Explain more or Plan this | one box the page already has; the words matter for both ends, and are empty for Done | `openQuestion`, `showHandoff`, `nextSuggestions`, `pickNext`, `nextRecord` in `packages/player/reelplanning-player.js`; `nextSuggestions`, `wantNextOf`, `nextOf` in `scripts/lib/explainer.mjs`; `packages/player/test/explainer-finish.spec.mjs` |
| A10 | 2 | An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more) [visible] | never under Needs you (nothing to decide) | it waits on you to watch it, and you asked for it | the explainers' loop over `TODO` in `scripts/bundle-player.mjs` |
| A11 | 2 | An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8 [close] | the plan video's 3–5 | the plan's numbers; the two outer lines copy the plan video's gaps | `BUDGET`, `kindOf` in `scripts/lib/length.mjs` |
| A12 | 4 | `new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write [visible] | requiring `--plan` | Plan this has the review before any plan text exists; the agent writes the steps from the quotes | `fromExplainer` in `scripts/reel.mjs` |
| A13 | 3 | An explainer's Finish offers Done first, comments or not; the missed-checks guard's "Ask the agent to explain it again" picks Explain more (changed after review: Done still comes first, and Explain more and Plan this each say what they would mean for this video, their first suggestion, in place of a fixed line; the guard's Explain more starts from the missed check's suggestion) [visible, close] | Explain more first when there are comments, as a plan's Finish offers Request changes | the plan's Done is "you know what you wanted to know", and a comment on an explainer asks for nothing by itself (it is kept, D-249; step 3); a reviewer who wants more picks it with one click | `EXPLAINER_ENDS`, the `finish` case and `askAgainMissed` in `packages/player/reelplanning-player.js`; `packages/player/test/explainer-finish.spec.mjs` |

## For the guide

*Written after the build, for the guide (D-265): how each step works, drawn; worked examples, each from a run saved in
`runs/`; and what the video leaves out. Nothing above this section was changed. No explainer exists in this repo, so
every run here was made on 30 Sep 2026 in a scratch repo set up as `scripts/test/explainer.spec.mjs` sets its own up (a
table and a transcript in the home folder, a folder with a 240-line file, a range of commits, a decision), with the
code as it is on that day. The transcript's key is made up. The walkthrough video's own runs (`scripts/review.mjs` at 379 lines,
`scripts/lib/inbox.mjs` at 254, a CI log of 142) were made in a scratch clone when it was built, so its numbers differ
from these. Added on 30 Sep 2026 after the guide's first review round, still after the build: the line below, saying
it for the guide; and after the second (30 Sep), step 1's opening lines, saying what a source's form and shape are
before its diagram uses them. Added after the third (30 Sep): one Not done line and three choices in plain words. Added later on 30 Sep: Since
then, with the owner's two accepts after the build (D-262, D-263) and what became of the guide parts (D-264, D-266).*

**Ran in a scratch repo:** every run in `runs/` — a scratch repo set up as `scripts/test/explainer.spec.mjs` sets its
own up: a table and a transcript in the home folder, a folder with a 240-line file, a range of commits and a decision;
the explainer `2026-09-29-experiment` and the plan `2026-09-30-loss` they name are that repo's.

#### In plain words

- **13 calls**: 13 choices by the agent; the project's audit warns past 12, so this one is a little over, and no step
  has five of them
- **A1**: an explainer's name on the review page, and in a video's "Before you watch" list, is `<name>--explainer`,
  like `<plan>--walkthrough`
- **A3**: a repo file is shown whole, as a file with its lines marked; any other file's shape is read from what it
  holds: a log one entry a line (`.jsonl`, `.ndjson`, `.log`), a table (`.csv`, `.tsv`, a JSON array of rows), anything
  else text
- **A9**: "What you want next" is the box the walkthrough's open question uses, asked on every explainer's Finish and
  kept as a note marked open

#### Since then

- **A9**: accepted by the owner on 30 Sep, as changed after the review, in the walkthrough review that approved this
  build (D-262, recorded in `0703e44`).
- **A13**: accepted in the same review, as changed after the review (D-263, `0703e44`).
- **The guide parts themselves**: built since. The plan guide's builder (`dc52612`, 29 Sep) gives an explainer's
  guide a part for each source that needs one. This walkthrough video's scenes open this plan's guide parts
  (`bba1a0b`) and mark the thing each part explains (`7325f03`). D-228, which this line and "Decisions in force"
  waited on, was superseded on 30 Sep by D-264, a decision the owner made in conversation. The guide opens under the
  video on the same page, never in place of it, and the video shrinks to a small player as you scroll (`3501c59`).
  D-266, decided the same day, keeps the marks that lead to it quiet: nothing while the video plays, and a thin ring
  with "More in the guide ↓" on hover (`257d723`).

**In one sentence:** you can ask for a short video that explains code, a log or a transcript as it is, before anyone
plans anything; every line it quotes is checked word for word against its source, and a number it says must name one.

```diagram
flow: An explainer, from your question to what comes next
you (person) -> reelplanning explain: a question and its sources
reelplanning explain -> sources.json (file): each source pinned
sources.json -> the video: a scene a thing, each fact sourced
the video -> check-sources: in the build
check-sources -x the video: a line its source lacks, or a secret
the video -> Finish: you watch it
Finish -> Done: nothing more
Finish -> Explain more: a new version
Finish -> Plan this: reel new-plan --from
reelplanning explain = reelplanning explain | scripts/explain.mjs
check-sources = check-sources | scripts/check-sources.mjs
Finish = Finish, three ends | #step-3
Plan this = Plan this | #step-4
```

### For step 1 — What an explainer is for

Each source you name has a **form** and a **shape**. Its form is what it is to read and pin: a path in the repo, a
file outside it, a commit or a range of commits, a decision, `since:<date>`, a CI log, a pull request. Its shape is
how its contents are laid out, one of four: a sequence, a table, files or text. A file's shape is read from what it
holds:

```diagram
flow: A file's shape, from what it holds
a file -> sequence: .jsonl, .ndjson, .log
a file -> table: .csv, .tsv, a JSON list of rows
a file -> files: anything else, in the repo
a file -> text: anything else, outside it
```

The other forms have a shape of their own, whatever they hold: a folder, a commit or a range of commits are files
(what changed), a decision is text, `since:<date>` and a CI log are a sequence.


The shape decides how the guide shows the source: a sequence an entry a line, files whole with the quoted lines marked,
a table you can sort and filter, text whole. The kind of thing it is (a session, an experiment, a branch) is never asked
and never stored (D-250): a new kind of thing lands on the shape its contents have.

#### Worked examples

##### Five sources of four shapes
- **Input:** `reelplanning explain "what did the experiment show?" ~/runs/results.csv src dcd60fe..HEAD D-001 ~/.claude/session.jsonl --date 2026-09-29 --slug experiment`
- **What happens:** each source is pinned by how it is read (a file outside the repo, a repo folder, a range of
  commits, a decision) and given a shape. Two need a part of the guide: `src/big.mjs` (240 lines) and the transcript
  (232 lines), each past 200 lines.
- **Predict:** the CSV and the transcript are in your home folder. What does `sources.json` keep of them?
- **Output:** `runs/explain.txt`
- **Edge cases:**
  - A folder's files are counted one by one: `src` is 244 lines in all, and only `src/big.mjs` gets a part (A2).
  - A range of commits counts its changed lines, not the files' lengths: `dcd60fe..HEAD` is 2 lines.

##### What was pinned
- **Input:** `cat .reelplanning/explainers/2026-09-29-experiment/sources.json`
- **What happens:** each source with its form, shape, size, and a hash; the commit it was read at; the outside files by
  their `~/` path. This is what `check-sources` reads a quoted line against later.
- **Output:** `runs/sources-json.txt`

#### Why it works this way

A list of kinds (a session explainer, a branch explainer) would need code for each new kind. Four shapes cover how a
thing is read and shown; everything else about it is in the question you asked.

#### Limits

- The 200-line rule is by size only: a short file that is hard to follow gets no part of its own.

### For step 2 — Ask for one

```diagram
sequence: reelplanning explain, step by step
you (person) -> explain: a question, sources
explain -> each source: pin it: form, shape, hash
each source -x explain: none of the forms: refused
explain -> the folder: explain.md, sources.json
explain -> the folder: video/ started, kind explainer
note the folder: .reelplanning/explainers/<date>-<slug>/, a new one each time you ask
explain = reelplanning explain | scripts/explain.mjs
```

#### Worked examples

##### Asked again the same day
- **Input:** `reelplanning explain "what did the experiment show?" ~/runs/results.csv --date 2026-09-29 --slug experiment`
- **What happens:** the first folder is not touched: an explainer is a snapshot, never rebuilt when the repo moves. The
  second gets `-2`.
- **Output:** `runs/explain-again.txt`

##### A source it cannot pin
- **Input:** `reelplanning explain "x" no-such-thing`
- **Output:** `runs/explain-refused.txt`
- **Edge cases:**
  - Nothing is made when one source fails: the command stops before writing the folder.

#### What else was considered

- Naming an explainer `explainer:<name>`, as the plan's interface wrote it. A colon is not allowed in a folder name on
  Windows, and the name is also a folder in the packed review page, so it is `<name>--explainer` (A1).

#### Files and commands

- `pinAll`, `pinSource`, `shapeOfFile` and `GUIDE_LINES` in `scripts/lib/explainer.mjs`; `scripts/explain.mjs`.

### For step 3 — Review it, and Finish says what comes next

```diagram
state: An explainer's review
[*] -> Watching: the same player
Watching -> Finish: the end, or Finish
Finish -> Done: you know enough
Finish -> Explain more: a scene lost you
Finish -> Plan this: something should change
Done -> [*]
Explain more -> Watching: a new version, those scenes rebuilt
Plan this -> [*]
```

Whichever end you pick, the decision log does not change: it holds answers to a plan's questions, and an explainer asks
none. The review is filed in the explainer's folder, by scene.

#### Worked examples

##### A review that ends in Plan this
- **Input:** a review with one comment on scene 1 ("this looks wrong"), one question asked on scene 2, and at Finish,
  Plan this, a suggestion picked and then put in your words.
- **What happens:** `reel record` files it as `reviews/explainer-<time>.json` and `.md`, adds what you watched and looked
  up to your memory, and prints what to run next.
- **Predict:** in this scratch repo the decision log held one entry before. How many after?
- **Output:** `runs/record-explainer.txt`
- **Edge cases:**
  - "Done" and "this looks wrong" add nothing to the log either: only an answer is a decision.

##### What it filed
- **Input:** `cat .reelplanning/explainers/2026-09-29-experiment/reviews/explainer-20260929T100000Z.md`
- **Output:** `runs/record-explainer-md.txt`

#### Why it works this way

A plan's Finish asks you to approve or ask for changes, because a plan is going to be built. An explainer is not; what
you decide is only what you want next, so Finish offers that, Done first (A13).

### For step 4 — Plan this

```diagram
flow: From your review of an explainer to a plan
reviews/explainer-….md (file) -> reel new-plan --from: your comments, questions, pick
reel new-plan --from -> plan.md (file): its problem quotes you
plan.md -> reel prereqs: the plan video's Before you watch
reel prereqs -> the plan video: the explainer first, a two-line recap
```

#### Worked examples

##### The draft plan
- **Input:** `reel new-plan . loss --from .reelplanning/explainers/2026-09-29-experiment --date 2026-09-30`
- **What happens:** a plan folder, titled by what you picked at Finish, its problem made of your own words on the
  explainer, and one empty step for the agent to write (A12).
- **Output:** `runs/new-plan-from.txt`

##### What the draft says
- **Input:** `cat .reelplanning/plans/2026-09-30-loss/plan.md`
- **Output:** `runs/new-plan-from-plan-md.txt`

##### What the plan video asks you to watch first
- **Input:** `reel prereqs .reelplanning/plans/2026-09-30-loss --dry-run`
- **What happens:** the explainer is listed first under Before you watch, and the recap scene says it in two lines, so
  the plan video starts at what changes (D-248).
- **Output:** `runs/prereqs.txt`

### For step 5 — Honest and private

```diagram
flow: What check-sources does with a scene
a scene -> its source line: pinned in sources.json?
its source line -x not pinned: fails
its source line -> each quoted line: a data-artifact's text
each quoted line -> the source, at its commit: word for word
each quoted line -x not in the source: fails
a scene -> all its text: frames, narration, storyboard
all its text -x a secret: stops the build
check-sources = check-sources | scripts/check-sources.mjs
```

#### Worked examples

##### Three scenes that pass
- **Input:** `reelplanning check-sources .reelplanning/explainers/2026-09-29-experiment/video`
- **What happens:** scene 1 quotes two lines of `src/app.mjs` as it was when pinned. The file has changed since (a
  later commit removed its `by` argument), and the lines still pass: a repo file is read at the pinned commit.
- **Output:** `runs/check-sources-pass.txt`

##### A line retyped with a word missing
- **Input:** `reelplanning check-sources .reelplanning/explainers/2026-09-29-experiment/video`
- **What happens:** scene 1's line is now `export function claim(rp, id, extra = {}) {`, `by` left out.
- **Output:** `runs/check-sources-retyped.txt`

##### A key in a quoted line, then masked
- **Input:** `reelplanning check-sources .reelplanning/explainers/2026-09-29-experiment/video`
- **What happens:** scene 3 quotes a transcript line with a GitHub token in it. The check names the kind of key by its
  prefix only, and stops the build until the text itself is masked.
- **Before:** `export GITHUB_TOKEN=ghp_abcd… and rerun`, as the transcript has it
- **After:** `export GITHUB_TOKEN=ghp_…REDACTED and rerun`: `REDACTED` is a cut like "…", so the words around it
  are still checked against the transcript
- **Output:** `runs/check-sources-key.txt`, `runs/check-sources-masked.txt`
- **Edge cases:**
  - The transcript was appended to after it was pinned, so both runs also say it changed since: a △, not a failure.
  - A blur on the video would not do: the text is committed with the video, so the key would still be in git (D-249).

##### A number with no source
- **Input:** `reelplanning check-sources .reelplanning/explainers/2026-09-29-experiment/video`
- **What happens:** scene 3's narration says "retried 3 times" and names no `- source:`. Under `sources_check: strict`,
  which every explainer's storyboard starts with, that fails; otherwise it is a △ (A5).
- **Output:** `runs/check-sources-number.txt`

#### What breaks it

- A fact said in words, with no digit and no quote ("most runs failed"), is not caught: the check can only compare
  what a source can hold word for word. The fact check (a third fresh agent, A7) reads for those, and only on an
  explainer with a source long enough to need a part of the guide.

#### Files and commands

- `scripts/check-sources.mjs`; `privateIn`, `resolveRefs` in `scripts/lib/explainer.mjs`; `rolesFor` in
  `scripts/lib/fresh-eyes.mjs`.
