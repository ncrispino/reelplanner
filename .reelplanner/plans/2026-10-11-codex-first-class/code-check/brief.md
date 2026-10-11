# Code check brief: 2026-10-11-codex-first-class

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanner/plans/2026-10-11-codex-first-class/code-check/findings.md`.

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
# Code check: 2026-10-11-codex-first-class

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

## Commits (652894a6ddb8cf7303bd0cf709afa27f27b6b399..76859a2)

```
76859a2 Enforce question ownership before answering recovered work
1796951 Recover stopped legacy sessions and record completed CLI lifecycle
7c89555 Isolate review bundles and finish source-only Codex rebuilds
8ef559a Scope Codex support to CLI and record exact session evidence
e481b8c Require checked evidence for every Git review completion
0fef69b Tie review completion to checked work and preserve portable identity
0d051e7 Add native Codex integration and shared terminal review
```

## The plan, as implemented

Read `.reelplanner/plans/2026-10-11-codex-first-class/plan.md` in full. Its title is "Codex as a first-class reelplanner agent", with 6 steps.

## The decisions that apply

- **D-023** (step 4) What code does a walkthrough show? → **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-168** (step 2) Do the text-only and HTML arms go all the way to a finished site? → **All the way, fixes included**
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-170** (step 4) How is where we end up judged? → **Rubric, blind judge, your rank**
  - note: yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-021, with the owner's approval in conversation on 2026-10-04
- **D-197** (step ?) When does a quick check come, and on what case? → **Later, on a new case**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-198** (step ?) What does the build do about a check asked too soon, or on the case just shown? → **Two warnings**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-199** (step ?) Which videos take the new quick checks, and when? → **New and revised, and the system video now**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with not the recommendation (it was: new and revised only)
- **D-200** (step 1) How much does a PR ask of its contributor? → **Asked; the maintainer can make it**
- **D-201** (step 2) When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep? → **The last answer**
- **D-213** (step 3) Where does a PR's built video live? → **Attached to the PR, as a zip**
  - note: the reviewer's note: "would B be easy to do? also i dont know if we want in the git history thought hats the main question"; delivered by D-215 (decided in conversation, 2026-09-27): what this decided holds, the built video never lands in git's history and the PR's branch carries only its text, but it reaches the maintainer on a throwaway branch (video/pr-<n>, never merged, deleted after the merge), not as a zip attached to the PR by hand
- **D-215** (step 3) How does a PR's built video reach the maintainer? → **A throwaway branch**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **D-216** (step ?) What gets labelled? → **The build finds it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **D-217** (step ?) What does check-terms do with a likely-jargon word said or shown with no meaning? → **Warn, fail on strict**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-218** (step ?) How long does a labelled word stay underlined? → **Stop once you know it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-219** (step 1) What replaces today's walkthrough video? → **A short video of it running**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes nothing (D-084, D-083 and D-041 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-220** (step 2) Which choices make it pause? → **i dont like specifically saying 'five' i mean i think there's a lot that changes per plan i dont think being too specific is good**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): never superseded (it was linked to D-221 by mistake), active again; supersedes D-084, with the owner's approval in conversation on 2026-10-04
- **D-221** (step 2) What does Approve make of a choice on the list? → **Listed, not judged**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-041 only (D-220, D-214 and D-133 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **D-222** (step 3) Does the walkthrough test you? → **Where there's something to predict**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-083, with the owner's approval in conversation on 2026-10-04
- **D-223** (step 4) Does a small pull request's choice need the video? → **Only a choice you'd notice**
  - note: corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-214, with the owner's approval in conversation on 2026-10-04
- **D-225** (step 2) What becomes of a fresh-eyes finding nobody has answered? → **Answered before you see it**
- **D-227** (step 5) Which videos get fresh eyes? → **Every new one, and the system video now**
- **D-230** (step 5) How much guide does each plan get? → **Every plan, with a Built side**
- **D-244** (step 1) Which is the source: plan.md, or the guide? → **plan.md; the guide is built from it**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 1 was left unanswered when the plan was approved (reviews/plan-20260928T190542Z.md), so it was asked again
- **D-245** (step 2) What does Before you watch show of the findings the author kept? → **Only new ones**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; narrows D-231 (which listed every finding kept in the third round): after the rebuild of the system video it listed 28, mostly the agents repeating points already kept with the same reason; D-231 otherwise stands
- **D-247** (step 1) How is each arm’s finished site kept in this repo? → **Plain files and a site.bundle**
  - note: decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 4 of the case-study plan had waited on the owner since step 1
- **D-248** (step 4) After Plan this, how far does the plan lean on the explainer? → **Lean on it**
- **D-249** (step 5) What of an explainer goes into git? → **Its text, never the transcript**
- **D-250** (step 1) Is an explainer's whole source there to read, behind the video? → **General principles, not a list of kinds: you say what you want explained, and the principles say what goes in the video and what goes in its guide**
  - note: the plan review answered q1 in the reviewer's own words; asked again in conversation (2026-09-29) with three readings, the owner answered in their own words
- **D-303** (step ?) When what's built has to be installed, does its video show the install? → **Yes: a video of something people install shows the real install commands, run and working, as a step of the system; this repo's system video walks through installing reelplanning**
  - note: decided in conversation (2026-10-04); a rule for every video the skill makes, not only this repo's
- **D-304** (step ?) What does the README say about the name? → **It says reelplanning sounds like "real planning": a plan as long text is too hard to take in, and a video of it is what makes real planning possible**
  - note: decided in conversation (2026-10-04)
- **D-305** (step ?) How does the repo go public when its history holds about 1 GB of narration audio and renders? → **A slimmed history: every .wav, .mp4 and renders/ file removed from all commits (about 70 MB left), with the commit hashes the record cites rewritten to the new ones, pushed to a new public remote as one branch; this private repo keeps its full history. From then on no voice files or renders are committed anywhere (the exception for plans before 2026-09-28 ends): finished videos people should watch go up as release files or on the hosted page**
  - note: decided in conversation (2026-10-04), choosing the recommended way over a single fresh commit; extends D-213
- **D-306** (step ?) How does the decision log scale to thousands of decisions? → **Owner answers stay binding; accepted agent calls become history, raised again only when a change touches the lines their commits wrote; a component's binding decisions can be folded into a section of spec.md the owner approves, which a plan then cites instead of each id**
  - note: decided in conversation (2026-10-04), built without a plan video
- **D-309** (step ?) The walkthroughs still open at the release: watch each, or accept them as they are? → **Accepted as they are, given in conversation, not watched; `reel audit` treats a walkthrough the owner has accepted as settled history: its rule breaks are notes (△), not failures, and a walkthrough not yet accepted is held to every rule**
  - note: decided in conversation (2026-10-05)
- **D-310** (step ?) What does the public repo hold, and what is it called? → **The public repo is ncrispino/reelplanning, lowercase, and its main is one commit holding the current tree (`scripts/release/make-public.mjs` builds it, never pushes it); this private repo keeps its full history as an internal archive and is renamed first (e.g. to reelplanning-dev), since GitHub names ignore case. From then on all work happens on the public repo, with an ordinary history on top of that first commit: no later exports. This replaces D-305's slimmed history for the public repo; D-305's other half stands: no voice files or renders are committed anywhere. Commit ids the record cites name the development history, which is not public, and the public repo's .reelplanning/README.md says so**
  - note: decided in conversation (2026-10-08); supersedes in part D-305 (its slimmed public history, with the record's commit citations rewritten), so it is not linked as superseding it: D-305 stays active for its rule that no voice file or render is committed anywhere; the owner renames this repo and creates the public one
- **D-311** (step ?) How does a pull request reach the full suite, and what else does it need before it merges? → **The full suite runs on every push to a pull request, with no label: a PR's checks are green or red for its code, never red for waiting on a maintainer. `.github/workflows/ci.yml` holds the tests (the fast and full suites) and starts only on pushes; `reel pr-check` and the video branch's cleanup move to `.github/workflows/pr.yml`, which also runs when the PR's text or labels change, so no such event records a skipped test check (GitHub counts a skipped required check as passed). Main requires a pull request with one approving review, and the fast suite, the full suite and `reel pr-check` passed on its last commit, up to date with main; the owner may merge their own with the admin bypass. The maintainer runs `reel pr-check --merge` before merging (the PR template), not CI**
  - note: decided in conversation (2026-10-08); supersedes D-296 (the full-suite job failing at once until a maintainer added `ready-to-merge`), and D-297 in part (ci.yml stays the tests' workflow; the pull request's checks move to pr.yml), so D-297 is not linked as superseded and stays active for the tests' workflow's name
- **D-312** (step ?) What is the project called? → **reelplanner, said "reel planner": the npm package, the command `reelplanner` (`reel` stays), the GitHub repo ncrispino/reelplanner, the case-studies repo ncrispino/reelplanner-case-studies (its site at ncrispino.github.io/reelplanner-case-studies), the Claude Code plugin and its marketplace, a repo's project folder `.reelplanner/`, the machine's folder `~/.reelplanner` and the settings `REELPLANNER_*`. The old names are still read for a while: a repo's `.reelplanning/` when it has no `.reelplanner/` (said once, with the `git mv .reelplanning .reelplanner` that renames it), `~/.reelplanning` while there is no `~/.reelplanner`, a `REELPLANNING_*` setting, in the shell or a .env file, when its new name is unset, and the `reelplanning` command, which says the new name on stderr and runs it. The review page keeps its saved marks' storage keys (`reelplanning:annotations:…`), so a review begun before the rename is still there after it**
  - note: decided in conversation (2026-10-08); it changes the name D-310 gave the public repo and the code chip D-186 shows, which are not linked as superseded: their other rules stand. The record's history keeps the old name as written: the entries before D-312, the plans, the reviews and the videos' narration. The owner renames the GitHub repos (GitHub redirects a renamed repo's old address; a GitHub Pages site's old address is not redirected)
- **D-313** (step 5) How far should remote reviews go? → **Local loop + portable exports**

## Earlier calls this diff changes

- none

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | Preserve “Decisions in force” in the guide's fold label [visible] | Relaxing the source-coverage check | Preparing the plan exposed an omitted source heading; the existing warning text had hidden the bug in old fixtures. This was fixed before approval. | `templates/guide/guide.js`, `scripts/test/guide.spec.mjs`; `preparation.md` records the passed 52-spec and 111-check runs. |
| A2 | 3 | Keep an explicit session connection in the ignored inbox's `.connection.json` [visible] | Keeping it only in a server process's memory | A reused or restarted local server should retain the connection the user explicitly selected, while validating it before delivery. | `scripts/review.mjs`, `scripts/lib/inbox.mjs`; connection and stale-recipient specs. |
| A3 | 3 | Use a renewable five-minute session ownership lease, with explicit renewal/progress commands [close] | Treating the exited waiter process as the worker's lifetime | A waiter exits as soon as it hands work to the agent; expiry must reflect the real owner's activity and must never override a live headless process. | `scripts/lib/inbox.mjs`, `scripts/inbox.mjs`; live-owner, expiry and renewal specs. |
| A4 | 2 | Keep retry phases and the original Git baseline in one persistent ignored progress record [close] | Recreating progress from the latest claim or treating a changed HEAD alone as proof of completion | Recovery must distinguish edited, committed and completed work after a crash, without repeating edits or accepting an unrelated commit. | `scripts/lib/inbox.mjs`; stopped-run recovery and completion-guard specs. |
| A5 | 4 | Provide `--session-source` for a verified owner copy, and export identity-first JSONL [visible] | Treating an arbitrary transcript path as the active conversation, or exporting an unlabelled conversation | The saved source must identify the requested session and project; JSONL remains readable by the existing sequence-source tools and stays outside Git. | `scripts/explain.mjs`, `scripts/session.mjs`, `scripts/lib/codex-session.mjs`; active-source and export specs. |
| A6 | 5 | List current and ancestor videos with their owning repo, and keep each review page within one owner [visible] | Combining different repos into a page whose single inbox could receive the wrong review | A nested Git repo must retain its own session and inbox even when an ancestor has a library. Explicit video paths route to their owner; mixed-owner bundles fail before opening. | `scripts/lib/review-projects.mjs`, `scripts/lib/env.mjs`, `scripts/review.mjs`; nested-repo discovery and routing checks. |
| A7 | 3 | Bind a connection to a verified running endpoint, with explicit `--session-endpoint` when needed [visible] | Treating saved identity plus a successful bare queue command as live delivery | A real closed-thread queue returned success without acting. Read-only endpoint verification must confirm that exact project thread is loaded; delivery then targets that endpoint. | `scripts/lib/codex-session.mjs`, `scripts/lib/agents.mjs`, `scripts/lib/inbox.mjs`, `scripts/review.mjs`; actual App Server turn and endpoint regressions. |
| A8 | 4 | Declare `ws` as a direct dependency for the documented Unix WebSocket transport [close] | Hand-writing WebSocket framing or relying on an undeclared transitive dependency | The daemon socket speaks WebSocket, while the CLI proxy copies raw bytes. A real read-only probe exposed the difference; Node's native WebSocket cannot connect to a Unix socket. | `package.json`, `package-lock.json`, `scripts/lib/codex-session.mjs`; real Unix transport regression and daemon verification. |
| A9 | 5 | Serve single byte ranges and return the complete file for unsupported multipart ranges [close] | Implementing multipart responses for the local review server | Browser media seeking uses single ranges. The shared response helper supplies exact lengths and partial responses without adding a multipart encoder; unsupported requests still get a valid complete representation. | `scripts/lib/http-file.mjs`, `scripts/lib/static-server.mjs`, `scripts/review.mjs`; `scripts/test/media-seek.spec.mjs`. |
| A10 | 4 | Bound a history export to 64 MiB, 1,000 pages and 30 seconds, with an external-copy fallback [close] | Reading an unbounded conversation through the running service | History can contain large tool output. The limits bound memory, pagination and service waits; an oversized or unavailable history fails explicitly and can use a verified owner copy outside Git. The independent code check identified that these existing implementation limits needed to be recorded. | `scripts/lib/codex-session.mjs`; `scripts/test/session-export.spec.mjs`; `explain --session-source` verifies the exact session and project. |
| A11 | 5 | Preserve a provided viewer in downloaded reviews, with the same bounded 1.5-second identity wait as hosted Send [visible] | Keeping a known identity only on hosted submissions | The portable path must retain the provided reviewer together with answers and comments. A delayed identity may resolve before download, while an absent or hanging capability still permits export with the existing Git fallback at intake. No new anonymous identity is invented. | `packages/player/reelplanner-player.js`; `packages/player/test/handoff.spec.mjs`; disconnected download/intake trial. |

## The diff

Read it yourself: `git diff 652894a6ddb8cf7303bd0cf709afa27f27b6b399..76859a2` (from the repository root). The files it touches:

```
.agents/plugins/marketplace.json                   |   20 +
 .reelplanner/glossary.md                           |    2 +
 .../code-check/brief.md                            |  256 ++
 .../code-check/checkpoint-0d051e7/brief.md         |  203 ++
 .../code-check/checkpoint-0d051e7/findings.md      |   61 +
 .../code-check/checkpoint-0fef69b/brief.md         |  220 ++
 .../code-check/checkpoint-0fef69b/findings.md      |   61 +
 .../code-check/checkpoint-1796951/brief.md         |  256 ++
 .../code-check/checkpoint-1796951/findings.md      |   61 +
 .../code-check/checkpoint-e481b8c/brief.md         |  228 ++
 .../code-check/checkpoint-e481b8c/findings.md      |   61 +
 .../code-check/findings.md                         |   61 +
 .../plans/2026-10-11-codex-first-class/plan.md     |   25 +-
 .../runs/audit-checkpoint.txt                      |    3 +
 .../runs/cli-live-question.txt                     |    8 +
 .../runs/completion-recovery.txt                   |    8 +
 .../runs/corrected-contracts.txt                   |    9 +
 .../runs/current-cli-export.txt                    |    3 +
 .../runs/full-bundle-isolation.txt                 |    9 +
 .../runs/full-fresh-eyes-source-doc.txt            |    7 +
 .../runs/full-generated-removals.txt               |    6 +
 .../runs/full-handoff.txt                          |    7 +
 .../runs/full-legacy-recovery.txt                  |   24 +
 .../runs/full-question-ownership.txt               |   25 +
 .../runs/full-touched.txt                          |   27 +
 .../runs/ghostty-audio-position.txt                |    3 +
 .../runs/headless-real.txt                         |   27 +
 .../runs/headless-video-served.txt                 |  177 ++
 .../runs/legacy-owner-recovery.txt                 |    5 +
 .../runs/native-plugin-install.txt                 |   58 +
 .../runs/native-plugin-source-only.txt             |   58 +
 .../runs/npm-test-audio.txt                        |   69 +
 .../runs/npm-test-final-cli.txt                    |   69 +
 .../runs/npm-test-final-guard.txt                  |   69 +
 .../runs/npm-test-post-review.txt                  |   69 +
 .../runs/npm-test-question-ownership.txt           |   69 +
 .../runs/npm-test-source-doc-and-isolation.txt     |   69 +
 .../runs/occupied-port.txt                         |    7 +
 .../runs/plan-check-final.txt                      |    3 +
 .../runs/portable-review.txt                       |   31 +
 .../runs/setup-supported-node.txt                  |   19 +
 .../runs/stops-checkpoint.txt                      |   22 +
 .../runs/terminal-lifecycle.txt                    | 2577 ++++++++++++++++++++
 .../runs/unclaimed-completion.txt                  |    8 +
 .../2026-10-11-codex-first-class/walkthrough.md    |  484 ++++
 .reelplanner/spec.md                               |   12 +-
 .reelplanner/system.json                           |    8 +-
 AGENTS.md                                          |    8 +-
 README.md                                          |   35 +-
 docs/agents.md                                     |  129 +-
 docs/reference.md                                  |   46 +-
 docs/status.md                                     |    8 +-
 docs/terminal-review.md                            |   86 +
 .../agents/codex-2026-10-11/cli-live-question.json |   24 +
 .../codex-2026-10-11/current-cli-export.json       |   13 +
 eval/agents/codex-2026-10-11/ghostty-trial.json    |   27 +
 .../agents/codex-2026-10-11/headless-commands.json |  360 +++
 eval/agents/codex-2026-10-11/headless-summary.json |   98 +
 .../headless-video-source-only.json                |  175 ++
 eval/agents/codex-2026-10-11/headless-video.md     |   21 +
 eval/agents/codex-2026-10-11/lifecycle-final.json  |  938 +++++++
 .../native-install-source-only.json                |   16 +
 .../codex-2026-10-11/queue-active-summary.json     |   22 +
 package-lock.json                                  |    3 +-
 package.json                                       |    8 +-
 packages/player/guide-review.js                    |   28 +-
 packages/player/reelplanner-player.js              |   53 +-
 packages/player/test/ask.spec.mjs                  |    9 +-
 packages/player/test/guide-notes.spec.mjs          |   21 +
 packages/player/test/handoff.spec.mjs              |   50 +
 packages/player/test/working.spec.mjs              |    6 +
 plugin.json                                        |   24 +
 scripts/explain.mjs                                |   11 +-
 scripts/inbox.mjs                                  |   29 +-
 scripts/lib/agents.mjs                             |  142 +-
 scripts/lib/codex-session.mjs                      |  273 +++
 scripts/lib/env.mjs                                |   36 +-
 scripts/lib/explainer.mjs                          |   19 +-
 scripts/lib/fresh-eyes.mjs                         |   14 +-
 scripts/lib/http-file.mjs                          |   45 +
 scripts/lib/inbox.mjs                              |  432 +++-
 scripts/lib/presentation.mjs                       |   56 +
 scripts/lib/review-projects.mjs                    |   29 +
 scripts/lib/setup-check.mjs                        |   38 +
 scripts/lib/static-server.mjs                      |   11 +-
 scripts/release/sync-version.mjs                   |    8 +-
 scripts/review.mjs                                 |  153 +-
 scripts/session.mjs                                |   31 +
 scripts/setup.sh                                   |    5 +
 scripts/test/codex-install.spec.mjs                |  105 +
 scripts/test/delivery.spec.mjs                     |  369 +++
 scripts/test/explainer.spec.mjs                    |   15 +-
 scripts/test/fresh-eyes.spec.mjs                   |   37 +
 scripts/test/harnesses.spec.mjs                    |  106 +
 scripts/test/init.spec.mjs                         |   12 +-
 scripts/test/loop.spec.mjs                         |    9 +-
 scripts/test/media-seek.spec.mjs                   |  129 +
 scripts/test/memory.spec.mjs                       |    4 +-
 scripts/test/package.spec.mjs                      |   19 +-
 scripts/test/presentation.spec.mjs                 |   50 +
 scripts/test/review-projects.spec.mjs              |  104 +
 scripts/test/review-status.spec.mjs                |   53 +-
 scripts/test/run.mjs                               |    2 +-
 scripts/test/session-export.spec.mjs               |  144 ++
 scripts/test/version.spec.mjs                      |   23 +-
 skills/plan-to-video/SKILL.md                      |   46 +-
 skills/plan-to-video/references/harnesses.md       |  140 ++
 107 files changed, 10165 insertions(+), 306 deletions(-)
```
