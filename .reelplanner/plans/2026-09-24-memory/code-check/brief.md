# Code check brief: 2026-09-24-memory

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-24-memory/code-check/findings.md`.

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
# Code check: 2026-09-24-memory

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

## Commits (d21da9d..9d7f064, limited to bin scripts skills docs package.json)

```
9d7f064 snapshot: memory plan, uncommitted (for the code check)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-24-memory/plan.md` in full. Its title is "Memory: learn which questions are the right ones, from what reviews already record", with 5 steps.

## The decisions that apply

- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-083** (step 7) How many quick checks does a video ask? → **One per step, plus wherever there is something to predict**
- **D-084** (step 8) Does your own record also decide what stops? → **The tags, and your record**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
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
| A15 | 3 | Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory [visible, close] | failing the record; or keeping a pending copy in the repo to add later | recording the review is the job; the summary is a copy, and a pending file in the repo would be one more thing kept by hand | scripts/reel.mjs `record` (the `appendYou` try) |
| m1 | 4 | A step that names no component takes the plan's "Components touched", as `reel record` places a decision | only the components the step's own text names | most steps name none, which would leave their calls with no kind to match a question's miss | scripts/lib/memory.mjs `stepComponents` |
| m2 | 2 | `componentsIn` moves from `scripts/reel.mjs` to `scripts/lib/memory.mjs`, used by both | a second copy | `reel stops`, `reel record` and memory read components the same way | scripts/lib/memory.mjs `componentsIn` |

## The diff

Read it yourself: `git diff d21da9d..9d7f064 -- bin scripts skills docs package.json` (from the repository root). The files it touches:

```
bin/reel.mjs                      |   2 +-
 bin/reelplanning.mjs              |   2 +-
 docs/project-dir.md               |   8 +-
 package.json                      |   2 +-
 scripts/lib/autonomy.mjs          |  18 ++-
 scripts/lib/memory.mjs            | 320 ++++++++++++++++++++++++++++++++++++++
 scripts/lib/reviews.mjs           |  30 +++-
 scripts/migrate-reviews.mjs       |   2 +-
 scripts/reel-intake.mjs           |   2 +-
 scripts/reel.mjs                  | 134 ++++++++++++++--
 scripts/system-review.mjs         |   2 +-
 scripts/test/lifecycle.spec.mjs   |   1 +
 scripts/test/memory.spec.mjs      | 176 +++++++++++++++++++++
 scripts/test/review-data.spec.mjs |   1 +
 scripts/test/reviews.spec.mjs     |   1 +
 skills/plan-to-video/SKILL.md     |   6 +-
 16 files changed, 678 insertions(+), 29 deletions(-)
```
