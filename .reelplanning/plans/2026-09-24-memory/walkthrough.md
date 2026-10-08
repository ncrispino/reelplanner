# Walkthrough: Memory, from what reviews already record

**Status:** implemented on branch `claude/clever-knuth-b5gtcf`, not committed · **Plan:** `plan.md` · **Started from:** `d21da9d` · **Question 1:** A, a file in your home folder (D-106) · **Question 2:** A, every five plans or a signal repeated three times (D-107)

Built in one sitting from `plan.md` as approved. The owner's comment (D-107's: a retro adds no text the
evidence doesn't need, and is not a quota to cut words) is in the retro's draft word for word. The two
quick checks answered differently from the video (k3, k4) did not change the behaviour: the summary
reaches your file when a review is recorded, and a step rewound twice is a rewind, not a miss. Fifteen
calls and one deviation: past the dozen at which the skill says the plan left too much open, and it did,
mostly in step 4 (what counts as a miss, when one is recent, and what "of that kind" matches).

## What was done, per step

### Step 1 — Every review records its reviewer and the skill version ✅

`fileReview` (`scripts/lib/reviews.mjs`) stamps every review it files from now on with `recorded`:
`{ reviewer, via, reelplanning }` (A5). The reviewer is the page's viewer when the row (or the export)
names one, else git's `user.email` in the folder where the review is recorded (`recordedBy`; A7); the
version is this package's (`VERSION` from `package.json`; A6). Intake (`scripts/reel-intake.mjs`), `reel
record` (`scripts/reel.mjs`) and `system-review` pass the row, so a hosted row's viewer reaches it;
`migrate-reviews` files old reviews unstamped (A8). A review already in `reviews/` is never rewritten:
recording it again leaves its file byte for byte, and the same review filed again with another stamp is
still the same file. So when the same review is recorded again on another machine, with another git
email, `reviews/` still holds one file for it: the first, exactly as it was, with its first stamp; the
second stamp is not written anywhere. `reel record` names the reviewer and version on its first line.

Already seen in use: while this was being built, another session in this checkout recorded the revise
loop's walkthrough review (`ad77bb0`, `reviews/walkthrough-20260924T192645Z.json`) with this code, and it
carries `recorded: { reviewer: "noreply@anthropic.com", via: "git user.email" }`. In a cloud session git's
`user.email` is the agent's, not the reviewer's: the page's viewer (A7) is the reliable source there, and
until a page sends one, a reviewer recorded through git in such a session names the agent.

### Step 2 — The repo's memory: `reel status` says what reviews show ✅

`scripts/lib/memory.mjs` works the memory out each time from the ledger and every plan's `reviews/`
(nothing stored, D-085): `reviewFacts` boils one review down, `memoryLines` makes at most five lines,
each with an id (A1): `recommended` (recommendations taken, questions and calls; A3), `own-words` (the
questions answered in own words, and why; A2), `rewinds` (steps rewound or slowed, and those rewound
again after a revision; A4), `checks` (quick checks answered wrong, with the reviewer's words) and
`misses` (step 4). `reel status` ends with them; `reel memory <id>` prints the evidence behind one: the
plan, the review, when, where in the video, the question and the reviewer's words (`scripts/reel.mjs`
`status`, `memory`). One sentence in `skills/plan-to-video/SKILL.md` ("A new plan", step 2) says to read
it before writing a plan and when tagging calls, with `--you` for the reviewer's own; `memory` and
`retro` join the skill's list of `reel` commands, and `docs/project-dir.md`'s table.

On this repo `reel status` ends with (the numbers move as reviews come in):

    [recommended] The recommendation taken on 15 of 15 questions answered from the options (4 more in your own words); 84 of 91 calls accepted the first time they were judged.
    [own-words]   4 questions answered in your own words: an option, with a condition (2), unclear, asked for more (1), the question framed otherwise (1); 2 of them ask a question back; and 6 calls.
    [rewinds]     Rewound or slowed on 12 steps in 9 reviews; 1 rewound again after a revision: deep-dives step 4.
    [checks]      8 of 28 quick checks answered wrong, 2 with your words: …
    [misses]      4 misses, let through by a review and changed later (2 recent: a call of that kind stops): …

### Step 3 — Your memory, across repos ✅

D-106 holds: when `reel record` records a review, it appends that review's facts (repo, plan, review,
verdict, reviewer, version, recommendations taken, own-words answers with their reasons, rewinds, wrong
quick checks, the calls and the kinds of call flagged) as one line of `~/.reelplanning/you.jsonl`, once
per repo, plan and review, and says so on one line (A9; `appendYou`, `repoName` in
`scripts/lib/memory.mjs`, `record` in `scripts/reel.mjs`). `REELPLANNING_HOME` moves the folder: every
spec that records sets it (`scripts/test/memory.spec.mjs`, `lifecycle.spec.mjs`, `reviews.spec.mjs`,
`review-data.spec.mjs`), and the player's `finish.spec` records in a folder outside git, which adds
nothing. `reel memory --you` works out the same lines from that file, with the kinds of call flagged as
the fifth (A10); `reel memory <id> --you` prints their evidence, repo by repo.

(**changed after review:** your answer to A15, "we still want to write somewhere, just somewhere we can
access". Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only
home), `reel record` now appends the summary to the repo's own `.reelplanning/you.pending.jsonl`, once
per repo, plan and review, and says so on its line: "could not write ~/.reelplanning/you.jsonl (…), so a
summary of this review is kept in .reelplanning/you.pending.jsonl (commit it with the review); the next
`reel record` or `reel memory --you` that can write ~/.reelplanning/you.jsonl moves it there". The next
`reel record` that can write your file moves every pending line in first, each once by the same key
`appendYou` uses (repo, plan, review), removes the pending file, and adds "1 summary waiting in … moved
there too" to its line; `reel memory --you` run in the repo does the same, and where your file still
cannot be written it reads the pending lines beside yours and says so (`recordYou`, `movePending`,
`youMemory` in `scripts/lib/memory.mjs`; `record` and `memory` in `scripts/reel.mjs`). Only if the repo
cannot be written either does the line still say the review is recorded but not in your memory.)

### Step 4 — Misses decide what stops ✅ (one deviation)

`findMisses` (`scripts/lib/memory.mjs`) finds three kinds, each traced to the question or call that let
it through and its kind (a call's tags, else its components; a question's components):

- a decision superseded by a later one (the ledger's `supersededBy`): D-056 by D-063, traced to call A3
  of deep-dives;
- an accepted call later flagged or answered in own words (the ledger keeps every verdict, and the new
  one supersedes the accept), or accepted in review and then changed after review (its row says so):
  close-the-lifecycle's A1 and A3;
- a step reworked after its walkthrough quick check was disagreed with, traced to that step's plan
  questions (D1): m3's step 6 (k3, the file tools), traced to D-082.

A miss is recent while the plan that showed it is one of the last five (A11). `stopFor`
(`scripts/lib/autonomy.mjs`) gains the one exception to D-084's streak: a tagged call of a kind with a
recent miss stops however many accepts ran before it (`missFor`; A12), and `reel stops` says so: "a miss:
D-056 superseded by D-063 (component player)". Untagged calls still never stop, and deviations always do.

### Step 5 — A retro you start ✅

D-107 holds: `reel status` suggests a retro when five plans have gone by since the last one (a plan folder
whose slug starts `retro`), or when one signal has repeated three times since then (A13; `signals`,
`retroDue`). On this repo it is due: six plans, no retro yet. `reel retro [<repo>]` starts a plan through
the same code as `reel new-plan` (`makePlan`): a draft `plan.md` listing the evidence the memory holds
(this repo's lines and yours), a "Proposed skill edits" section for the agent to fill, each edit citing
its evidence, the owner's sentence ("A retro adds no text the evidence doesn't need. That is not a quota
to cut words …"), and the benchmark it must be checked against: the Bob Dylan example, what `eval/` has
and what is missing (the prompt, the text baseline, the HTML baseline; A14). The draft passes `reel check`
as written. Nothing edits the skill (`scripts/reel.mjs` `retro`, `benchmark`).

**Tests:** `scripts/test/memory.spec.mjs` (added to `npm test`, 47 checks, about 4 s) runs on a scratch
copy of this repo's `.reelplanning` with its real reviews (the videos left out but their plan maps), in a
git repo of its own and a home of its own (`REELPLANNING_HOME`): the memory lines and their evidence
(D-022, D-003 and D-023 each with its reason; deep-dives step 4 rewound again; memory's k4 with its
question and answers; the three kinds of miss, traced), the stamp on a new review from git and from a
page's viewer, an old review left byte for byte, your file written once and, where it cannot be written, the
summary kept in the repo's pending file instead (once), moved in by the next writable `reel record` and by
`reel memory --you` without a duplicate, and read beside yours by `--you` meanwhile (after review), `reel memory --you`, `reel stops` saying "a miss: …" for another plan's `[visible]` call after an
accepted `[visible]` call was flagged, the retro draft passing `reel check`, the suggestion gone after it
and back five plans later; plus unit checks of `ownReason`, `stopFor` with misses (ten accepts in a row
and still stopping), `recordedBy`, `fileReview`'s stamp-blind dedup and `retroDue`'s repeated signal. It
checks the real `~/.reelplanning/you.jsonl` is not touched.

The whole `npm test` list was run on a clean worktree of `HEAD` (`ad77bb0`) with only this plan's files
copied in (other sessions' uncommitted edits to the review server and sandbox left out): every spec up to
and including `sound.spec.mjs` passes (`loop`, `lifecycle`, `reviews`, `review-data`, `memory`, `finish`,
`sound` among them), except the player specs `controls`, `parts-copy`, `revisit` and `group`, which fail
the same way at clean `HEAD` without this change (the strip checks and a revisit timeout; the player is
being changed elsewhere), and `own-answer` and `review-keys`, which each timed out once and passed when run
again. In the working tree itself, `loop.spec.mjs` fails three sandbox checks on the other session's
uncommitted `scripts/lib/sandbox.mjs`; it passes on the clean worktree with this change.

**Not done:** the walkthrough video (not asked for). The player does not send a viewer yet (A7).
Memory lines are not split by reviewer; the evidence names each review's reviewer.

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 2 | The five lines' ids are words: `recommended`, `own-words`, `rewinds`, `checks`, `misses` (and `flagged` for yours across repos), so `reel memory own-words` says what it prints [visible] | numbered ids (`m1` … `m5`) | an id you type is easier to remember as a word, and it stays the same when a line has nothing to say and is left out | scripts/lib/memory.mjs `LINES`, `memoryLines` |
| A2 | 2 | Why a question was answered in own words is read from the words and the options: "unclear, asked for more" (Explain this more, or words like confused / example / not sure), "an option, with a condition" (the words carry every distinctive word of one option, or name one by its letter: "the principle of A, but…"), otherwise "the question framed otherwise"; the words are always shown with it [close] | no reason, only the words; or a reason the reviewer picks | the plan's own problem statement sorts D-022, D-003 and D-023 this way, and all three land where it put them (D-108, "the principle of A … but bigger", lands on "with a condition"); a heuristic that shows its evidence can be wrong in the open | scripts/lib/memory.mjs `ownReason`, `REASONS` |
| A3 | 2 | A call counts once, by the first verdict it was given (a later round that re-judges it does not count again); plan questions count per review | every verdict in every walkthrough review | "how often a recommendation was taken" is about the call as the agent first made it; deep-dives' second round re-judged all its calls | scripts/lib/memory.mjs `firstVerdicts` |
| A4 | 2 | "Rewound again after a revision" is the same step of the same plan's same video (plan or walkthrough) rewound or slowed in two different reviews of it; a rewind with no step is left out of the line [close] | counting rewinds twice within one review; or including rewinds with no step | a second review of a video is what follows a revision; two rewinds in one sitting are one hard part, and a moment with no step cannot be said about any step | scripts/lib/memory.mjs `rewoundAgain` |
| A5 | 1 | The stamp is one `recorded` object in the filed review, `{ reviewer, via, reelplanning }`, where `via` says whether the reviewer came from the page's viewer or git's `user.email`; the same review filed again with a different stamp (another person's intake, an upgrade) is still the same review, not a second file [hard-to-undo] | top-level `reviewer` and `version` fields, or a file beside the review | the filed review is the player's export plus what intake adds; one key keeps the two apart, and a refile must not turn one review into two | scripts/lib/reviews.mjs `recordedBy`, `fileReview` (`bare`, `same`) |
| A6 | 1 | The version is the reelplanning that records the review (its `package.json`) [close] | the version that built the video, as the plan says | no build writes which version built a video (`video/meta.json` has none); with the pinned `npx` or this checkout, the two are the same version | scripts/lib/reviews.mjs `recordedBy` (`VERSION`) |
| A7 | 1 | The page's viewer is read from the row's `viewer` (a string, or `{ email }` / `{ name }`), else the export's; the player is not changed to send one | a player change that puts the viewer on every row | the plan asks intake to use a viewer when the row has one; the player is being changed elsewhere right now, and a row that carries one works as soon as a page sends it | scripts/lib/reviews.mjs `recordedBy`; scripts/reel-intake.mjs passes the row |
| A8 | 1 | `migrate-reviews` files old reviews unstamped (`stamp: false`) [close] | stamping them with whoever runs the migration | old reviews stay as they are: who recorded them then is not known, and today's email and version would be wrong | scripts/migrate-reviews.mjs, scripts/lib/reviews.mjs `fileReview` |
| A9 | 3 | Your file gets a summary only for a review recorded inside a git repo (the repo is named by its git top level), once per repo, plan and review, and `reel record` says so on one line each time ("a summary of this review added to …", "already in …", or "not in a git repo") [visible, hard-to-undo, close] | a summary for every review recorded anywhere | a summary names its repo, and outside git there is none to name; it also keeps the player's `finish.spec` (a scratch folder, no git) out of the real home without touching the player; the line makes it plain what reached the file | scripts/lib/memory.mjs `repoName`, `appendYou`; scripts/reel.mjs `record` |
| A10 | 3 | Across repos (`reel memory --you`) the fifth line is `flagged`, the kinds of call flagged or answered in own words, by tag, instead of misses [visible, close] | misses across repos too | a miss is found in a repo's ledger history (what superseded what, rows changed after review), which a one-line summary per review does not carry; the plan's step 3 lists "the kinds of call flagged" as what the summary holds | scripts/lib/memory.mjs `memoryLines` (`you`) |
| A11 | 4 | A miss is recent while the plan that showed it (the superseding decision's plan, the plan whose row was changed, the plan whose walkthrough check was disagreed with) is one of the last five plan folders, retros not counted [close] | a number of days, or until the next retro | plans are the unit the retro rule already counts (D-107), and days mean nothing in a repo worked on in bursts; on this repo it keeps D-056 → D-063 and m3's step 6, and lets close-the-lifecycle's two go | scripts/lib/memory.mjs `RECENT_PLANS`, `findMisses` |
| A12 | 4 | A call's kind is its tags and the components its step names; a recent miss stops a tagged call that shares a tag with it, or, when the miss has no tags (a plan question, or a call logged before tags), a component. An untagged call still never stops (D-084) [visible, close] | tags only (every miss so far has none, so nothing would change); or making untagged calls stop too | the plan traces a question's miss to its components, so a component is the only way such a miss can reach a call; untagged calls are the ones the agent judged a reviewer would not care about, and the streak is what the exception overrides | scripts/lib/autonomy.mjs `missFor`, `stopFor`; scripts/reel.mjs `stops` |
| D1 | 4 | "A part reworked soon after" is read as a step whose walkthrough quick check the reviewer disagreed with in their own words (it worked otherwise than the plan they approved led them to expect, and was reworked), traced to that step's plan questions; a call accepted in review whose row later says "(changed after review: …)" counts as "an accepted call reversed". Not read from git history [deviation] | parts whose files a later commit changed within some days | every plan here touches the player and the CLI, so "changed again within days" would call every plan a miss; the disagreed check is the record of a part that worked otherwise than approved, and it finds the owner's own example (m3's step 6, the file tools, k3) | scripts/lib/memory.mjs `findMisses` (`reworked`, the `changed after review` rows) |
| A13 | 5 | A signal is one of: a question answered in own words for the same reason, a step rewound again after a revision, a quick check answered wrong on the same component, a miss of the same kind (tag, else component), a call flagged with the same tag; each counted over the plans since the last retro, and three of one makes a retro due [close] | any line's count reaching three (rewinds and wrong checks reach it in every repo) | a repeat has to be the same thing three times to say something the skill should learn; counting from the last retro means a retro answers the signals before it | scripts/lib/memory.mjs `signals`, `retroDue` |
| A14 | 5 | `reel retro` names its folder `<date>-retro` (then `-retro-2` …); its draft cites the active plan decisions on the skill (and any about the retro) as in force, so `reel check` passes it as written; the benchmark's parts are found by their files (the plan, the example project, its video; a prompt, a text and an HTML baseline), in the repo or else in reelplanning's own checkout [visible] | a fixed list of what is missing; a draft that fails `reel check` until the agent cites decisions | a benchmark that gains its baselines should stop being called missing without a code change; a draft that fails its own check is scaffolding to clean up | scripts/reel.mjs `retro`, `benchmark` |
| A15 | 3 | Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory (**changed after review:** you answered "we still want to write somewhere, just somewhere we can access". The summary now goes to `.reelplanning/you.pending.jsonl` in the repo, once, and the line says so; the next `reel record` or `reel memory --you` that can write your file moves the pending lines in, deduplicated by repo, plan and review, and removes the file; until then `--you` reads both. The pending file is committed, not gitignored: a run fenced to the repo is the review server's headless run or a cloud session, and what reaches you from there is what it commits; a gitignored file would stay on that machine, gone with a cloud container. It holds nothing `reviews/` does not already carry. If two machines of yours pull it, the first that can write its home takes the lines) [visible, close] | failing the record; or keeping a pending copy in the repo to add later | recording the review is the job; the summary is a copy, and a pending file in the repo would be one more thing kept by hand | scripts/lib/memory.mjs `recordYou`, `movePending`, `youMemory`; scripts/reel.mjs `record`, `memory` |

### Smaller calls (logged, not beaten in the video)

| # | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| m1 | 4 | A step that names no component takes the plan's "Components touched", as `reel record` places a decision | only the components the step's own text names | most steps name none, which would leave their calls with no kind to match a question's miss | scripts/lib/memory.mjs `stepComponents` |
| m2 | 2 | `componentsIn` moves from `scripts/reel.mjs` to `scripts/lib/memory.mjs`, used by both | a second copy | `reel stops`, `reel record` and memory read components the same way | scripts/lib/memory.mjs `componentsIn` |

## Decisions in force

- **D-106** held: your memory is `~/.reelplanning/you.jsonl`, one line per review (`scripts/lib/memory.mjs` `youPath`, `appendYou`); a summary that cannot reach it yet waits in the repo's `.reelplanning/you.pending.jsonl` until a run that can write it moves it in (A15, changed after review).
- **D-107** held: a retro every five plans, or when a signal repeats three times (`scripts/lib/memory.mjs` `RETRO_PLANS`, `RETRO_REPEAT`, `retroDue`).
- **D-084** held, with the one exception step 4 adds: a recent miss of a call's kind stops it (`scripts/lib/autonomy.mjs` `stopFor`); untagged calls never stop, deviations always do.
- **D-085** held: memory is worked out from the records on every run, never kept by hand; your file is written by `reel record`, never edited (`scripts/lib/memory.mjs`).
- **D-083** held: a quick check answered wrong is one of memory's signals (`checks`), and one disagreed with in a walkthrough is a miss (`scripts/lib/memory.mjs` `findMisses`).
- **D-082** held: nothing here changes the headless run; a run reads memory like a session (`scripts/reel.mjs`).
- **D-024** held: detail templates are untouched (`templates/details/`).

## Code check

A fresh headless agent (`claude -p` with exactly the `code-check --prompt` text, read-only tools: Read,
Grep, Glob and `git diff` / `log` / `show`) read `code-check/brief.md`. Its write to `findings.md` was refused
by the tools it was given, so it returned the findings as text, saved as is in `code-check/findings.md`.
The change is not committed, so the brief was made against a snapshot commit of this plan's own files
(`9d7f064`, made with a scratch index, on no branch; other sessions' uncommitted edits to
`scripts/lib/sandbox.mjs`, `scripts/lib/inbox.mjs` and `scripts/review.mjs` left out):
`code-check .reelplanning/plans/2026-09-24-memory --base d21da9d --head 9d7f064 -- bin scripts skills docs package.json`.

**Steps 5 ✓ / 0 ✗, Decisions 7 ✓ / 0 ✗, Unexplained 0 ✗.** No ✗ to answer. One note on its Step 4 ✓:
"the next plan that touches that part asks that kind of question" is carried only by the skill's new
sentence (read the memory before writing a plan, where `reel memory misses` names each miss's kind), with
no gate in `reel check`. That is as the plan's step says it and as D-085 keeps format rules out of the
checks; a check that fails a plan touching a part with a recent miss until it asks a question there would
be a later plan's choice.

## After the walkthrough review

Reviewed 2026-09-25 (`reviews/walkthrough-20260925T195701Z.md`), accepted with fixes and no new
walkthrough video: fifteen calls and D1 accepted (in the ledger), A15 answered in your own words, and
step 1's quick check missed. What changed:

- **A15:** "we still want to write somewhere, just somewhere we can access". A summary that cannot reach
  `~/.reelplanning/you.jsonl` now waits in the repo's `.reelplanning/you.pending.jsonl`, committed with the
  review, and the next `reel record` or `reel memory --you` that can write your file moves it in, each
  review once, and removes the pending file (step 3 and A15's row say how and why committed;
  `scripts/lib/memory.mjs`, `scripts/reel.mjs` `record` and `memory`, `docs/project-dir.md`).
  `scripts/test/memory.spec.mjs` checks the pending line written, a second fenced record not adding it
  again, `--you` reading both, and the next writable run moving it without a duplicate.
- **Step 1's quick check** ("The same review is recorded again, on a machine with another git email. How
  many files does reviews/ hold for it?", answered "Two: one per stamp"; the answer is "One: the first
  file, as it was"): step 1 now says it in one sentence. No code change: that is how `fileReview` already
  behaves.
- **Found while doing it:** once this review recorded D1 as accepted, `reel memory misses` counted D1
  itself as a miss ("D1 of memory accepted, then changed"), because D1's row quotes the note it describes,
  "(changed after review: …)". `findMisses` now reads the note only where it is not in quotes
  (`AFTER_REVIEW` in `scripts/lib/memory.mjs`); this repo's misses are back to the four real ones.

`memory.spec`, `reviews.spec` and `lifecycle.spec` pass after the change.
