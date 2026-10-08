# Storing the decision log so it merges (a design, not built yet)

D-306 asked for a decision log that scales to thousands of decisions. Its first three parts are built: rules and
history (`lib/ledger.mjs`), relevance by the lines a call's commits wrote (`lib/call-lines.mjs`), and folding a
part's rules into `spec.md` (`reel fold`). This is the fourth, the storage. It is written down rather than built,
because it is not safe to change today (the last section says why).

## What happens now

`writeLedger` (`scripts/lib/contributing.mjs`) writes `decisions.json` (about 540 KB at 306 decisions) and
regenerates `decisions.md` (about 420 KB) whole, on every `reel record`, `reel renumber` and `reel fold --apply`.
The output is the same for the same log, so a record's diff is only its new entries and the statuses it changed.
Size on disk is not the problem. These are:

- **Two branches always conflict.** Each appends after the last entry: the same end of the array in
  `decisions.json`, and the same end of the table and of the entries in `decisions.md`. `reel renumber` fixes the
  ids, but someone still resolves the conflict by hand first.
- **Every reader reads all of it.** About fifteen places read the whole file, three of them from an old commit
  with `git show <sha>:.reelplanning/decisions.json`: `approvalOf` (the log as it stood when a plan's build
  started), `pr-check` (the base and the branch), and `renumber` (the base).

## The design

1. **One file a plan.** `.reelplanning/decisions/<plan>.json` holds the entries filed under that plan, sorted by
   id, one entry a line: `{"decisions":[\n{…},\n{…}\n]}`. A record touches its own plan's file. A supersede or a fold
   changes one line in the other plan's file. Two branches conflict only when they change the same decision.
2. **Ids stay `D-nnn`, one sequence for the repo.** The next id is the highest in any file, plus one. The
   roughly 700 citations in plans, walkthroughs, reviews and storyboards keep working. `reel renumber` works the
   same way, on the files the branch added or changed.
3. **One reader for both layouts.** `readLedger(rp)` reads `decisions/*.json` when that folder exists, and
   `decisions.json` when it does not. `readLedgerAt(repo, sha, rp)` does the same at a commit, so `approvalOf`,
   `pr-check` and `renumber` can still read logs from before the split. Every reader goes through these two.
   Nothing else opens `decisions.json`.
4. **`decisions.md` per plan.** `decisions/<plan>.md` is regenerated from its plan's file only. A short
   `decisions.md` keeps the table head and points to the folder. Nothing generated is shared between two plans.
5. **The split is one commit.** `reel migrate-ledger` writes the folder from `decisions.json` and removes the
   old file. It checks that `readLedger` returns the same entries, in the same order by id, before it writes.

## Why not today

- **Readers.** `reel.mjs` (check, record, audit, stops, status, prereqs, retro, fold) reads the log, and so do
  `code-check`, `pr-check`, `renumber`, `lib/reviews.mjs` (`approvalOf`, `ledgerFor`), `lib/memory.mjs`,
  `lib/terms.mjs`, `lib/explainer.mjs`, `lib/guide/model.mjs`, `migrate-reviews` and `lib/call-lines.mjs`. The specs
  build their own logs, and the eval projects ship theirs. All of them would move in one change, with a spec for
  each reading at an old commit.
- **The pinned skill.** The skill runs `npx -y reelplanning@0.2.0`, which reads `decisions.json`. A repo split by
  a newer version breaks for anyone still on the old one. The split has to ship with a version bump of the
  skill's pin, and `reel` should refuse to write the old layout once the folder exists.
- **Work in flight.** Other branches are changing `decisions.json` right now. A reformat of a 540 KB file makes
  every one of them conflict at once.

## Until then

Folding (`reel fold`) keeps the active part of the log small, and accepted calls no longer cost a plan anything
unless its diff changes their lines. When two branches both add to the log, the one merged second runs
`reel renumber` at its rebase, as it does today (D-171).
