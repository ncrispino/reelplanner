# The `.reelplanning/` directory: one canonical record per project

Every project we plan for gets one directory, committed in that project's repo. It holds what stays true across plans (the system, its names, its look, what has been decided) and, under it, every plan and video we made. Nothing in a video is invented per video: the diagram, the names, the colours and the decisions all come from here.

```
.reelplanning/
  README.md          what this directory is, and the three rules below
  spec.md            the canonical description of the system: purpose, parts, pipelines, invariants (prose, kept current)
  system.json        the same parts and pipelines as data: components (id, name, kind, files), edges, and each node's place on the stage;
                     `retired`: parts taken out (id, name, `on` the day, `plan`, `decision`, `now` the ids doing their work)
  glossary.md        the one name we use for each thing, with a one-line definition, and the plain word a viewer
                     sees and hears where it differs (the "On screen" column, D-127); every row is explained by a
                     scene of the system video tagged `- defines: <term>`
  terms-index.json   which video explains each word, from every storyboard's `- defines:` lines; written by
                     finish-project (`reelplanning terms-index`), read by the plan map and `reel prereqs`
  decisions.md       the decision ledger (append-only; entries are superseded, never edited)
  decisions.json     the ledger as data (what the tools read); a decision's `status` is active, folded (into spec.md:
                     `foldedInto`, `foldedOn`), superseded, or, for an agent's call, listed, flagged or own
  folds/<part>.md    a part's rules drafted as a section of spec.md by `reel fold`, for the owner's approval
  .cache/            the blame `reel check --base` and `reel status` place accepted calls with (not committed)
  config.json        the agent's headless command: what the review server runs on a submitted review when no session
                     is waiting, with the prompt appended (keep `-p` last). Nobody answers a prompt, so (D-082) it is
                     `claude --permission-mode auto --permission-prompts none --settings '{"sandbox":{"enabled":true,
                     "failIfUnavailable":true,"allowUnsandboxedCommands":false,"excludedCommands":["git commit *"]},
                     "hooks":{"PreToolUse":[…a node -e hook on Write|Edit|MultiEdit|NotebookEdit…]}}' -p`:
                     a classifier approves each action, subagents and the web included, anything that would still ask
                     is refused, and shell commands run in Claude Code's sandbox (writes only inside the repo; no
                     unsandboxed retry; a plain `git commit` runs outside it, so signing works; Linux needs bubblewrap
                     and socat, no native Windows). Where the sandbox can't run (a root container, native Windows),
                     the server runs the command with it off and says so: shell commands are then not fenced to the
                     repo. The hook refuses a file-tool write outside the repo either way. A run cannot reach the review server from there, so the server tells the reviewer
                     when the run ends. Codex: `codex exec --sandbox
                     workspace-write`; opencode: `opencode run --auto` with `permission` rules in `opencode.json`
                     (untested here; only Claude Code is tested end to end, D-066; reference.md, "Other agents").
                     In a shared repo, also `maintainers`: who can merge, each by the `id:<id>` `reel record`
                     prints for a hosted page's viewer ("by owner (id:…)"), or an email. `owner` still matches, with
                     a warning: it is whoever published the page, a second person on their own page too. Listed
                     beside an id, `owner` covers only reviews recorded before ids were kept, quietly. A
                     walkthrough review by anyone else is a contributor's: its verdicts add nothing to the ledger.
                     Unset: one person, as before. And `pr.issue`: `"required"` makes `reel pr-check` fail a PR
                     whose text links no issue; `"off"`, the default
  inbox/             reviews submitted on the local review page, until a session or a headless run handles them (not committed);
                     also `.server.json` and `server.log`, the review server `reelplanning review --detach` started
  you.pending.jsonl  only while it has something in it: the summaries `reel record` could not add to your own
                     `~/.reelplanning/you.jsonl` (a run fenced to the repo, a read-only home), one line per review.
                     Committed with the review, so it reaches the machine you next run on; the next `reel record`
                     or `reel memory --you` there that can write your file moves them in, each once, and removes it
  names.md           how each tool and product is written on screen (a tool's name in code markup)
  theme/
    frame.md         palette and type: the design tokens every frame worker reads
    motion-language.md   how frames move: the camera, reveals, what each transition means
  system-video/      the HyperFrames project for the system video (`kind: system`)
  explainers/<date>-<slug>/   an explainer: explain.md, sources.json, video/, reviews/
  plans/
    2026-09-12-upload-resume/
      plan.md              the harness's plan-mode Markdown, as written
      reviews/<kind>-<time>.json   every review as sent (plan or walkthrough, every round; never
                                   overwritten), with the reviewer's note
      reviews/<kind>-<time>.md     what to act on: decisions, steps to revise, calls to fix, the reviewer's words
      video/               the HyperFrames project for the plan video; `reel stage` writes its shared
                           stage (rail + diagram + option cards) to video/.hyperframes/stage-snippet.html
      video/fresh-eyes/    what two fresh agents, a newcomer and a designer, found in the video before you
                           saw it (newcomer.md, designer.md), each finding answered; their briefs and stamp;
                           this build's earlier rounds in round-<n>/, earlier builds' in build-<n>/; the
                           pictures (shots/) are not committed
      walkthrough.md       the stage-4 report: per-step results, autonomy calls, deviations, evidence, quiz
      walkthrough-video/   the HyperFrames project for the walkthrough video
      versions/<video>/<build id>.json   each version of a video a review opened or recorded: what `reel rebuild`
                           needs to build it again (below)
  media/             the files those versions need that nothing makes again (screenshots, captured text), one per
                     content, named by its hash: committed, small, never audio or video
  .gitignore         renders/, snapshots/, node_modules/, packets, vendored libs, the voice and the guides: everything rebuilt;
                     any .wav or .mp4 anywhere in the record (D-305); and .env
  .env               keys for narration (OPENROUTER_API_KEY=…), one a line: read by narrate, narration-check and setup
                     after the shell's environment, never committed (narration-check and setup warn if git would);
                     ~/.reelplanning/.env, read after it, holds the same for every repo on the machine
```

The repo counts as set up once `decisions.json` is here. A `.reelplanning/` holding only setup files (`.env`,
`config.json`, `.gitignore`, made for the hosted voice before any plan) is not: `reel status` says so, a review
downloads instead of landing in `inbox/`, and `reel init` sets the folder up over them, keeping `.env` and merging
`config.json` into its template (your keys win).

## Three rules

1. **The ledger is append-only.** A decision, once recorded, is never edited or deleted. A later plan that wants a different answer adds a new entry marked `supersedes: D-00n`, with the reason. `reel check` fails a plan that touches a part with a rule on it (the owner's answer to a plan's question, or their own words) without either citing the rule as in force or superseding it. Nothing decided gets reverted by omission. An agent's call a walkthrough accepted is history (D-306): kept in the log, the guides and the walkthroughs, never asked for by part; a plan is told about one only when its diff changes the lines that call's commits wrote (`reel check --base`, `code-check`, `pr-check`). A part's rules can be folded into a section of `spec.md` (`reel fold`), which a plan then cites in their place. **An id is final once it is on main** (D-171): ids are numbered in order across the repo, so two branches can each write the next one; the PR merged second runs `reel renumber` at its rebase, which puts its own entries after main's last and rewrites their mentions in its plan folder, and `reel pr-check` fails a branch whose id names a different entry than on main.
2. **One name per thing.** `glossary.md` and `system.json` own the names. Plans, scripts, storyboards and the stage use those names and ids (`data-plan-component`). A plan that introduces a part adds it to `system.json` first (greenfield plans start the file).
3. **Text is the record, video is the review surface.** Every fact in a video is in a file here. Sources are committed so a plan can be rewound; renders, snapshots and vendored libraries are not, because they are reproducible from the sources (`renders/video.mp4` is published from the review player, not from git).

## An earlier version, built again

A video's text is committed; much of what it is built from is not (the `.gitignore` above, and in a shared repo
`templates/gitignore`). After a review the video is revised and rebuilt, and a screenshot recaptured under the same
name overwrites the one the reviewer saw. So each version a reviewer opened (`reelplanning review <video-dir>`) or
recorded (`reel record`) is kept, once per build (the player's build signature: the plan map's `changes.at`), and
`reel rebuild <video-dir> --version <n>` builds it again in a git worktree of its own. What becomes of each file git
leaves out:

| In the video folder | Kept? | How it comes back |
|---|---|---|
| `renders/`, `snapshots/`, `node_modules/`, `.hyperframes/` scratch, `fresh-eyes/shots/` | no | the build makes them again |
| `assets/vendor/` (the animation library) | no | `vendor-gsap`, from the gsap reelplanning pins |
| `assets/fonts/`, `assets/sfx/` from the pinned tools | no | the same bytes the frame preset or media-use's catalog ships (checked by hash) |
| `guide/` (D-213) | no | `guide` from the commit: plan.md, the ledger, runs/, walkthrough.md and the history as they were |
| `assets/voice/`, `audio_meta.json`, `audio_engine_meta.json` | no | voiced again by `narrate` with the recorded voice and speed (D-305: no voice is committed); the engine is this machine's, and a rebuild says when it is not the one recorded |
| screenshots and other pictures in `assets/`, `capture/` (the text it was captured from), a media ledger | **yes** | from `media/`, checked by hash |
| a sound or video no tool ships | no | listed as lost (D-305) |

`media/<sha256, 16 hex>.<ext>` holds one file per content, shared by every version and video: a PNG as lossless WebP
when that is smaller and gives the same pixels, anything else as it is. `plans/<plan>/versions/<video>/<build id>.json`
(an explainer's under its folder, the system video's under `.reelplanning/versions/`) says what the version is:

```json
{ "format": 1, "video": ".reelplanning/plans/2026-10-01-drafts/video", "build": "2026-10-01T10:00:00.000Z", "id": "a20554b5a334",
  "keptAt": "2026-10-01T10:05:12.000Z", "keptBy": "review", "commit": "ef48183…", "dirty": [],
  "scenes": { "compositions/frames/02-plan.html": "5c1d…", "plan-map.json": "9e02…" },
  "files": [{ "path": "assets/shots/after.jpg", "sha256": "8fdb…", "size": 91337, "store": "media/8fdb6a67c032be57.jpg", "as": "as-is" },
            { "path": "assets/shots/page.png", "sha256": "603d…", "size": 120334, "store": "media/603d53245b112bc7.webp", "as": "webp-lossless" }],
  "shipped": [{ "path": "assets/fonts/Inter-400.woff2", "sha256": "…", "from": "skills:hyperframes-creative/frame-presets/code-editorial/fonts/Inter-400.woff2" }],
  "regenerated": { "assets/voice/": 12, "audio_meta.json": 1 }, "rebuilt": ["guide/", "renders/", "snapshots/"], "lost": [],
  "tools": { "reelplanning": "0.2.0", "hyperframes": "0.8.52", "skills": { "ref": "v0.8.52", "faceless-explainer": "<folder hash>" } },
  "narration": { "voice": "am_michael", "speed": 1.25, "model": "kokoro-v1.0 + whisper small.en", "provider": "kokoro", "lines": 12 },
  "audio": { "sfx": [], "bgm": null } }
```

`scenes` is every file of the video git has, by hash: a rebuild checks the commit's against it and names any that
differ. A version kept before its video was committed (`dirty`) points at the commit once the video is committed as
it was. A version that adds more than 5 MB to `media/` is said (crop the screenshots). A plan video here adds about
0.3 to 1.2 MB a version: its screenshots, mostly JPEG, and a few KB of text.

## What is shared across plans

| Thing | File | Why it is shared |
|---|---|---|
| The parts of the system and how they connect | `system.json`, `spec.md` | the diagram is identical in every video for this project; the viewer learns it once |
| Where each part sits on the stage | `system.json` → `stage.layout` | a part never moves between videos |
| Names | `glossary.md` | a plan that says "upload record" for the manifest confuses the reviewer and the tools |
| Look | `theme/frame.md` | one palette, one type ramp, one motion doctrine |
| Decisions | `decisions.md` | the next plan builds on them and says so |
| Knowledge levels | `spec.md § Knowledge levels` | which beats the `familiar` and `owner` levels skip |

## What a plan adds

Two sections of `plan.md`, when they apply:

```
## Decisions in force
- D-001 manifest in Postgres (steps 1, 3)
- D-003 24-hour sweep (step 5)

## Supersedes
- **D-002** "client-generated idempotency key deferred": the SDK now ships in one language, so the cost that deferred it is gone; question 2 asks it again.
```

Each **Decisions in force** line ends with the step it keeps, "(step 4)", "(steps 1, 3)" or "(all steps)". A line may
cite a section of `spec.md` in place of the ids folded into it: `- spec.md#rules-player (all steps)`.

Each **Supersedes** line starts with the one decision it replaces, and names the question or step whose answer replaces it ("question 2 asks it again", "(step 4)"). `reel record` links the old decision to that answer (`supersededBy`), or to the plan as a whole when the line names neither (`supersededByPlan`); a line naming a question the review left open waits for its answer. Another id on the line is context, never replaced.

The plan video reads these: a step whose ground is a decision in force gets a small `decided · D-001` tag on the stage and one narrated sentence ("the manifest lives in Postgres; that was decided in the last plan and this one keeps it"), never a new question. A superseded decision gets a decision beat that says what it replaces and why.

## Uniform pipelines

`system.json` describes a system as components and edges, and pipelines as ordered edge lists. Every plan video draws pipelines the same way: the stage's edges come from the file, an active pipeline is the ordered subset lit one edge per spoken step, and a plan step that changes a pipeline shows before → after on the same nodes.

```json
{
  "name": "media-service",
  "kind": "brownfield",
  "components": [
    { "id": "api", "name": "Upload API", "kind": "service", "files": ["src/upload/"], "stage": { "x": 1030, "y": 430, "w": 270, "h": 110 } },
    { "id": "manifest", "name": "Manifest store", "kind": "store", "files": ["migrations/"], "stage": { "x": 1360, "y": 230, "w": 280, "h": 150, "navy": true } }
  ],
  "edges": [ { "from": "api", "to": "manifest" } ],
  "pipelines": [ { "id": "upload", "name": "An upload", "edges": ["sdk-api", "api-blob", "api-manifest", "api-billing"] } ]
}
```

Component kinds: `service`, `store`, `queue`, `job`, `client`, `external`, `page`, `build`. The stage colours one `store` navy (the data surface); everything else is a cream tile.

## The tools

`reel` (run as `reel <command>` once the tooling is installed ([Install](./reference.md#install)), as `npx -y reelplanning@0.2.0 reel <command>` once the package is on npm, or after `npm link` in a checkout; the code is `scripts/reel.mjs`):

| Command | Does |
|---|---|
| `init <repo> --name <n> --kind greenfield\|brownfield` | creates `.reelplanning/` from the template |
| `new-plan <repo> <slug> --plan <plan.md>` | creates `plans/<date>-<slug>/` with the plan |
| `stage <plan-dir>` | writes the plan video's `stage-snippet.html` from `system.json`, the theme and the plan's steps |
| `check <plan-dir> [--blocks] [--base <ref>]` | the decision guard: every rule on a component the plan touches (active, or folded: then its `spec.md` section may be cited instead) is cited as in force or superseded; open questions that re-ask a rule fail; accepted calls are history, never asked for by component, and with `--base` each one whose lines the diff from there changes is a warning, in its own words; components the plan names exist in `system.json` (a part since retired counts for a plan approved on or before the day it went, or for the plan that retired it). The plan's own decisions are not asked for; steps read as `### Step N` with —, –, - or : |
| `record <plan-dir> [review.json]` | files the review in `reviews/` (with who reviewed and the reelplanning version, under `recorded`: the reviewer is the hosted page's viewer, `owner` or `id:<opaque id>`, when the row names one, else git's `user.email`), appends its decisions and judged calls to the ledger (ids `D-00n`; a flagged or own-words call is kept with status `flagged`/`own`), and writes `reviews/<id>.md`. Where `config.json` lists `maintainers`, a walkthrough review by someone not listed adds no calls to the ledger (a contributor's own check); a plan review's answers join it whoever gave them |
| `pr-check [<repo>] [--base <ref>] [--merge] [--tidy]` | a pull request, in a shared repo: where `config.json`'s `pr.issue` is `"required"` (on the base or the branch), that its text links an issue (`#12`, `owner/repo#12` or an issues URL; with no text read it waits); whether it crosses the line for a video (the contributor's ticked box, a choice you'd notice or can't easily undo; the `needs-video` label; or over 300 changed lines outside tests, docs, videos and generated files; `no-video` waives it; a new flag, command or dependency is only named), the other choices written as a line each in the PR's text (waiting until a maintainer ticks them accepted, D-223), whether it brings one, no voice file, image or video under a plan folder, each video's plan map against `plan.md` and each row of `walkthrough.md` against its stop (and a row whose label now pauses it, still on the video's list, is stale) until the video is approved, ids against the base, and what lands on main against what stays in the PR. `--merge` also fails what is still waiting; `--tidy` removes the contributor's reviews in one commit once a maintainer accepted the walkthrough (`CONTRIBUTING.md`) |
| `renumber [<repo>] [--base <ref>] [--dry-run]` | the base's log as it is, then the branch's own new entries after its last, their mentions rewritten in the branch's plan folders (`plan.md`, `walkthrough.md`, `reviews/*.md`); lists the video lines that still say an old id, and writes `terms-index.json` again (D-171) |
| `stops <plan-dir>` | which of the plan's calls pause the walkthrough video and which go on its list at the end, and by which rule (an off-plan change always pauses; a call tagged `visible`, you'd notice it, or `hard-to-undo` pauses; "a late fix: …" when a recent miss shares a label with it, D-122; a miss with no labels pauses nothing, D-109; every other call is listed); then the beats by step: a step's calls that pause on one `- autonomy: a3, a4` beat, each off-plan change on its own, and one `- autonomy_list: …` at the end (walkthroughs-that-help step 2) |
| `build <video-dir>` | narrate (changed lines only) → sfx → timings → holds → retime → finish-project → verify, one line per stage |
| `rebuild <video-dir> [--version <n\|build\|commit>] [--out <dir>] [--no-build] \| --keep` | the versions of the video kept (each one a review opened or recorded), or one built again in a git worktree at its commit: its kept files back by hash, the voice made again, then `build` (a check grown stricter since is a △ there, not a stop); [above](#an-earlier-version-built-again) |
| `prereqs <plan-dir> [--walkthrough] [--dry-run]` | writes the video's `before:` lines: the system video's chapter(s) whose scenes say most of what the plan's steps say, then at most two earlier plans' videos whose decisions it builds on ("Decisions in force", "Supersedes"; a bullet that says "not touched" does not count) or whose video alone defines a word it says; and a `recap:` line for every earlier video it builds on, the listed ones included, for the recap scene that sums up each in a line. Says which your file has as watched |
| `status <repo>` | one table: every plan, its stage (from its files, `reviews/` and the ledger), its reviews and decisions; then at most seven lines of what reviews show (memory), a retro when one is due (five plans since the last, or one signal three times), and "a plan to drop the walkthrough video is due" when the first three timed walkthrough reviews all missed the bar (walkthroughs-that-help step 6). Before them: how many rules are in force (and folded), how many accepted calls are kept as history, and how many of those are outlived, none of the lines their commits wrote left in HEAD (said, never written into the log) |
| `memory [<repo>] [<id>] [--you]` | the memory lines, or the evidence behind one (the reviews, the words, the times; `outlived`: each accepted call none of whose lines is left in HEAD, in its words, with its files; `after-build`: per walkthrough review, the seconds a pause held you from its `shownAt` to each answer's `judgedAt`, the middle value, flags, own words, comments, and whether it was sent before the video could have played through, against the bar: five seconds and some words); `--you` works them out across repos from `~/.reelplanning/you.jsonl` (`REELPLANNING_HOME` moves it), where `record` adds a summary of each review; where that file cannot be written, `record` keeps the summary in the repo's `.reelplanning/you.pending.jsonl` and says so, and the next `record` or `memory --you` that can write it moves it in (`--you` reads the pending file beside yours until then) |
| `retro [<repo>]` | starts `plans/<date>-retro/`: a draft plan listing the evidence memory holds, with "Proposed skill edits" to fill, each citing its evidence, and the benchmark it is checked against |
| `fold [<repo>] <part> [--dry-run] [--apply]` | drafts `folds/<part>.md`: the rules in force on the part as a section of `spec.md`, and the decisions it folds, for the owner's approval (`--dry-run` prints it, writes nothing). `--apply`, after their yes: the section goes into `spec.md` under "## Rules in force" at `spec.md#rules-<part>`, and each decision it lists gets `status: "folded"`, `foldedInto`, `foldedOn`. A plan touching the part then cites the section (D-306) |

The plan-to-video skill reads `.reelplanning/` first when it exists: theme, stage, glossary and the decisions in force go into the worker dispatch.

## Greenfield

A greenfield project starts with an empty `system.json`; the first plan's **Components** section fills it (the plan video's "cast" beat is the moment the parts get their names). From the second plan on, it is brownfield with a short history.

## Examples

`eval/projects/media-service/.reelplanning/` (brownfield: the upload-resume plan, three recorded decisions, a follow-up plan that fails `check` until it cites them) and `eval/projects/bob-dylan-site/.reelplanning/` (greenfield).
