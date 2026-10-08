# Walkthrough: A case study for any plan: text only, HTML and ours, from one prompt to a finished site

**Status:** step 1 implemented on branch `claude/clever-knuth-b5gtcf`; steps 2 to 4 are the owner's to run · **Plan:** `plan.md` (the approval, `reviews/plan-20260926T214418Z.md`, folded into step 4 as text: `c88d3a2`) · **Started from:** `c88d3a2` · **Questions 1 to 3:** decided at review (D-168, D-169, D-170) · **Question 4:** asked at step 1's fifth call (D-110), answered by the owner 2026-09-29: plain files and a `site.bundle` (D-247), `reel case-study keep`

## What was done, per step

First the approval was folded into `plan.md` (no new plan video): the owner went back twice around step
4's scene, so step 4 now says the same thing more plainly, in three parts (measured the same way, judged
two ways, one page), with nothing it decides changed; "How each was decided" says so.

### Step 1 — The kit: a template, the sheets, an empty start, and a command that sets it up ✅ (one question open)

- **The command.** `scripts/case-study.mjs`, run as `reel case-study` (`scripts/reel.mjs` hands it on) or
  `reelplanning case-study`. `reel case-study <slug> --prompt <file> [--from <commit>]` makes
  `eval/case-studies/<slug>/` (m1): `prompt.md` byte for byte; `start/` (greenfield: a note that it is
  empty; `--from`: `commit.txt` and `files.txt`, nothing copied, m4); `arms/{text,html,ours}/`, each with
  `SHEET.md` (the preflight first, then the seven stages, each with what you do in that arm, the clock,
  your time, the cost, the questions and your answers, the screenshot's name), `prompt.txt` (exactly
  what to type first), the container (`Dockerfile`, `start.sh`, `preflight.sh`, A1, A2) and an empty
  `site/` and `shots/`; `FEEDBACK.md`; `RUBRIC.md`; `JUDGE.md`; `README.md` from the template; `data/`
  (A3); and `REPLICATE.md` filled in. It prints the tree, and refuses a slug that already exists.
- **The kit it copies**, in `eval/case-studies/`: `TEMPLATE.md` (the nine sections in the page's order,
  under each what goes there and which file feeds it), `REPLICATE.md` (generic, below) and `kit/` (the
  sheet, the feedback sheet, the rubric's five measures with a 1, a 3 and a 5 each, the judge's prompt
  with how to make X, Y and Z, the container, the preflight, and the HTML arm's two paragraphs). Shipped in
  the npm package so `reel case-study` works from any repo (m2).
- **The empty start, checked.** `eval/case-studies/kit/preflight.sh` is the plan's draft, one line a
  check; a failing line exits 1 and `start.sh` stops the container. Built and run for real here: the text
  arm's image (with this sandbox's proxy certificate added in a scratch copy only, since npm could not
  reach the registry without it) printed seven ✓ lines as the agent's user, in `~/dylan-site`, and Claude
  Code 2.1.283 was there with `claude-opus-5-5` set. The ours arm's image was not built (it installs the
  video tools; see Not done).
- **The arms' words.** The text arm: `claude --permission-mode plan` in its `start.sh`, and its seven stages
  in `REPLICATE.md`. The HTML arm: `prompt.txt` is the prompt plus the paragraph from
  `eval/bob-dylan-site/baselines/html-plan.prompt.md`, byte for byte; `report.prompt.txt` asks for
  `report.html`: what was built, file by file with the why, the choices it made that `plan.html` did not
  cover and how to check each, and where to focus, in the words of the article's PR writeup example (m8).
- **Instructions to replicate it.** `eval/bob-dylan-site/RUN.md` moved to
  `eval/case-studies/REPLICATE.md` (moved, not copied) and became its generic form: before the first arm;
  starting an arm (the two commands, what you see, what to capture); the seven stages; each arm from its
  first prompt to done; our arm's part is RUN.md's stages 1 to 10, now 11 (the code check and the audit
  got a stage of their own), each named by the stage it falls in; when an arm ends; the judge and the page.
  Words in double braces are filled in each case study's copy (m7). `README.md`'s quick start links it
  as "a full example, start to finish"; `docs/status.md`'s link to RUN.md now points at it, and
  `docs/reference.md` names the command.
- **The page.** `reel case-study report <slug>` builds `case-study.html` from the folder: the nine sections
  in order, the words from `README.md` (the template's notes left out), the numbers from `data/` (a bar
  per stage and arm for the clock with your own time inside it, the counts, the judge's scores with their
  evidence, the key once it is in, both rankings, the links), the feedback sheet as a table, the
  preflights, and the screenshots side by side. Each empty section is marked on the page and warned on in
  the terminal; `--publish` refuses until all nine are filled (A4). The review page's colours and its three
  typefaces (embedded, m5), light and dark, one column at a phone's width with wide tables scrolling in
  place (checked at 1440 px light and 390 px dark: no sideways scroll).
- **The Bob Dylan case study**, made by the command:
  `reel case-study bob-dylan-site --prompt eval/bob-dylan-site/prompt.md --folder dylan-site --title "an interactive website about Bob Dylan"`
  (m3). The headless baselines stay where they are, `eval/bob-dylan-site/baselines/`, as step 2 says
  ("the plan with nobody asked"), linked from its `README.md` and named in `REPLICATE.md`; the prompt stays
  there too, the case study holding its byte-for-byte copy.
- **The retro's benchmark** (`scripts/reel.mjs` `benchmark`) reads `eval/case-studies/`: each case study,
  which arms have run (a preflight pasted in) and how many of its page's sections are still empty; the
  retro's plan says to redo the example next to the case study's text-only and HTML arms, or its baselines
  where none has run (m6).
- **The fifth call was not made** (D-110): how each arm's finished site is kept in this repo is question 4
  in `plan.md`'s open questions. Until it was answered, the arms' `site/` folders were empty and untracked.
- **Question 4, answered (D-247): plain files and a `site.bundle`.** `reel case-study keep <slug> <arm>
  [<site-dir>]` (`scripts/case-study.mjs` `keep`) is the step when an arm ends: it refuses a site with
  changes not committed (the files kept and the history's last commit are the same site), writes the site's
  git history as `arms/<arm>/site.bundle` (`git bundle create --all`), checks it with `git bundle verify`
  (in a new empty repository: git wants one to verify in) and that it has a HEAD, and only then takes the
  site's own `.git` out of `site/` (the default: the folder the container mounted) or, for a site that
  ended elsewhere, copies the files its git tracks into `site/` (`--replace` over a kept one).
  `keep <slug> --check` checks every arm kept; the page's section 5 is not filled until every arm's site
  is kept (the files there, no `.git`, the bundle verifies), and it links each site and its bundle.
  `REPLICATE.md` (the generic one and Bob Dylan's copy) says it under "When an arm ends"; `TEMPLATE.md`'s
  section 5 note (and the copy's `README.md`) says what feeds it.

### Step 2 — The text-only and HTML arms, run by you, all the way to a finished site ⏳ (the owner's)

Not started: the owner runs both, after ours, a day between arms, each all the way to a finished site
(D-168, D-169). What each needs is in place: `eval/case-studies/bob-dylan-site/arms/text/` and `arms/html/`
(their sheets, `prompt.txt`, the HTML arm's `report.prompt.txt`, the containers) and `FEEDBACK.md`, to write
before the first arm.

### Step 3 — Our arm: the whole lifecycle, every stage captured ⏳ (the owner's)

Not started: the owner runs it first (D-169). Its steps are `eval/case-studies/bob-dylan-site/REPLICATE.md`'s
"Ours" part (the old `RUN.md`, moved); its container installs the skill and `reelplanning setup`
(`arms/ours/Dockerfile`). It keeps the implementer's stop at a step's fifth (D-110), a quick check per step
(D-083) and what stops the walkthrough (D-084, D-109), and ends with the system video current (D-003).

### Step 4 — Where each ends up, and how each got there: measured, judged blind, and a page ⏳ (after steps 2 and 3)

Not started. What it will use is in place: `eval/case-studies/TEMPLATE.md` (the nine sections), `RUBRIC.md`,
`JUDGE.md` and `data/judge.json`, `data/key.json` and `data/ranking.json` for the rubric, the blind judge and
your ranking (D-170), and `reel case-study report` for the page (`scripts/case-study.mjs`).

## Tests

- New: `scripts/test/case-study.spec.mjs`, in `npm test` (32 checks, all pass): the scaffold makes the tree
  the plan lists (the prompt byte for byte, the empty start, each arm's first words, sheet, container and
  preflight; the three containers the same but for the lines marked "this arm only"; `REPLICATE.md` filled
  in; `--from` records the commit and its files; a second run refuses); the preflight passes an empty folder
  in a new home and flags a folder with a file in it and a planted `~/.claude/CLAUDE.md` in a temp HOME,
  exiting 1; the report builds the page with the nine sections in order, warns on each empty section,
  refuses `--publish` (exit 1, nothing written) while any is empty, one arm's missing cell included, and
  builds the page with no draft line once all nine are filled.
- Run on their own after the last change: `case-study` (32 ✓), `version` (4 ✓), `lifecycle` (54 ✓),
  `memory` (67 ✓, it covers `reel retro`'s benchmark). The rest of `npm test` was not run (about 25
  minutes; nothing else it covers was touched).
- Since, for question 4 (D-247): `case-study.spec.mjs` keeps a scratch site repo (44 checks now, all pass):
  in place (the bundle verifies and clones to the same commits, `.git` out of `site/`, the files as they
  were), from a clone elsewhere (its tracked files copied in, not `node_modules/`), refused with changes not
  committed, with no `.git` of its own (not the repository above it), and over a kept site without
  `--replace`; `--check` fails on a bundle that does not verify; section 5 waits for every arm's site.

## Not done

- ~~**Question 4** (how each arm's finished site is kept in this repo) waits for the owner~~: answered,
  plain files and a `site.bundle` (D-247), and built: `reel case-study keep` (above). No arm has ended
  yet, so no site is kept here yet: each arm's `site/` stays empty and untracked until its arm ends and is
  kept.
- **The ours arm's container was not built here.** It installs ffmpeg, Python, a compiler and a headless
  Chrome's libraries, then the skill and `reelplanning setup`; the first real build is the owner's, in step
  3 ("1. Install" captures its output). Docker Hub refused this sandbox's pulls (too many requests), so the
  text arm was built from the same image pulled through a mirror.
  Since (2026-10-04, preparing the run on fresh compute): it was built here through every step, `setup` and
  a new smoke check (`kit/smoke.sh`) included, after three fixes: reelplanning installs from a `npm pack`
  tarball or GitHub (it is not on npm), the image adds `unzip` (without it setup's Chrome download stalled),
  and each site's `.git/info/exclude` keeps the videos' voice files out of the history `keep` bundles
  (D-305). How to run the arm, in a container or a cloud session: `eval/case-studies/bob-dylan-site/RUNBOOK.md`.
- **The code check by a second agent (D-001) and the walkthrough video** have not been run.
- Steps 2 to 4 are the owner's.

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 1 | The same Claude Code and model in every arm, pinned in each `Dockerfile` as build arguments with the defaults recorded in `REPLICATE.md`: Claude Code 2.1.283 (what the machine making the case study has; `--claude-code` to change it) and `claude-opus-5-5` (`--model`), passed to `claude --model` at start [close, hard-to-undo] | `claude-sonnet-5`, the model the headless baselines ran on; or no pin, whatever Claude Code defaults to on the day | the plan asks for the same model in all three but names none; this repo's own plans are built with Opus 5.5, and a pin keeps a later arm, a day later, on the same model; once an arm has run it can't be changed without running it again | eval/case-studies/kit/Dockerfile, scripts/case-study.mjs `MODEL`, `CLAUDE_CODE` |
| A2 | 1 | The container: `node:22-bookworm-slim`; the agent's user takes your user id (`--build-arg UID=$(id -u)`) so it can write to `site/`; `start.sh` runs `git init`, the preflight, then waits for Enter so you can copy its lines, then starts Claude Code; you log in inside the container (or pass `ANTHROPIC_API_KEY`), nothing from your own `~/.claude` is copied in [visible, hard-to-undo] | mounting your `~/.claude` for the login (it would bring your CLAUDE.md and past sessions); or a fixed user id (the first run here could not write to the mounted folder) | the plan says a new empty home and only `site/` mounted; built and run here, the text arm's preflight passed all seven lines | eval/case-studies/kit/Dockerfile, eval/case-studies/kit/start.sh |
| A3 | 1 | The numbers files: `times.json` (per arm and stage, minutes on the clock and yours), `counts.json` (questions, decisions, how many the code kept to), `sites.json` (how to run each, its six screenshots' paths), `judge.json` (X, Y and Z's five scores with evidence, its ranking and reasons, the shape `JUDGE.md` asks the judge to answer in), `key.json`, `ranking.json` (yours), `links.json` (per arm: kind, label, link); each says in an `about` line what it holds [hard-to-undo] | only the two the plan names (`times.json`, `judge.json`), with the rest as words in `README.md` | the page draws bars, tables and rankings from them, and the report can only tell a filled section from an empty one when the numbers are in a file; once a case study is filled, changing a shape means changing its files | scripts/case-study.mjs `emptyData`, `missing` |
| A4 | 1 | `report` always writes the page, with a "Draft: n of 9 sections filled" line at the top and each empty section marked with what it lacks, and exits 0; `report --publish` exits 1 and writes nothing while any section is empty, and once all nine are filled writes the page without the draft line. A section is empty while `README.md` has a `_fill in: …_` blank in it (or no words where it needs them), or while its file is not filled in [visible, close] | refusing to write any page until all is filled; or writing it and only exiting 1 | you see the page grow while you fill it in, and the refusal is only where it matters, at publishing; the plan asks for a warning while filling in and a refusal to publish | scripts/case-study.mjs `report`, `missing` |

### Smaller calls (logged, not beaten in the video)

| # | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| m1 | 1 | The command is `scripts/case-study.mjs`; `reel case-study` hands its arguments to it; a case study goes in `eval/case-studies/<slug>/` under the folder you run it from (`--into` for elsewhere) | adding it inside `scripts/reel.mjs` | `reel.mjs` is 670 lines and holds the project record; `reelplanning case-study` also works, as every script does | scripts/reel.mjs `caseStudy` |
| m2 | 1 | The kit's files live in `eval/case-studies/` (`TEMPLATE.md`, `REPLICATE.md`, `kit/`), where the plan puts the first two, and those paths are added to the npm package's files | `templates/case-study/` with copies in eval/ | one copy of each; the command reads them from the package, so it works from any repo | package.json `files` |
| m3 | 1 | `--folder <name>` names the folder the agent sees (default: the slug); the Bob Dylan case study uses `dylan-site`, as the plan says | the slug always (`~/bob-dylan-site`) | the plan names `~/dylan-site`; a folder name is part of what the agent reads | scripts/case-study.mjs `scaffold` |
| m4 | 1 | `start/` holds a `README.md` saying it is empty (git keeps no empty folder); `--from` writes `commit.txt` and `files.txt` and copies nothing, with the command to put the files in `site/` | an empty `start/` that git drops | the plan says `--from` records the commit and its file list | scripts/case-study.mjs `scaffold` |
| m5 | 1 | The page embeds the review page's three typefaces (about 180 KB) and uses its colours, so it is one file with no outside requests | system fonts only | the plan asks for it to look like the review page, published the same way | scripts/case-study.mjs `fontFaces` |
| m6 | 1 | The retro's benchmark lists each case study with the arms run and the page's empty sections; a missing case study is listed as missing | reading only the old baselines | the plan says `reel retro`'s benchmark reads this folder | scripts/reel.mjs `benchmark` |
| m7 | 1 | The generic `REPLICATE.md` is also the template for each case study's copy: words in double braces are filled in; the five questions from memory go in each sheet and in section 7 of the write-up | two files, a guide and a template | one set of instructions to keep up to date | eval/case-studies/REPLICATE.md, eval/case-studies/TEMPLATE.md |
| m8 | 1 | The HTML arm's report prompt follows the article's "PR writeup for reviewers" example (motivation, file by file with the why, before and after, where to focus), adding the choices `plan.html` did not cover and how to check each | a prompt in our own words | the plan asks for it in the words of the article the HTML arm follows | eval/case-studies/kit/html-report.txt |

## Decisions in force

- **D-168** (both other arms go all the way to a finished site) held: the text and HTML sheets run to "done"
  (`scripts/case-study.mjs` `ARMS`), and `REPLICATE.md` takes each arm to a site you would ship.
- **D-169** (you review all three, ours first, a day between) held: `REPLICATE.md` ("Before the first arm")
  and the command's closing line say so.
- **D-170** (the rubric, a blind judge and your ranking; the process written up beside it) held:
  `RUBRIC.md`, `JUDGE.md`, `data/judge.json`, `data/key.json`, `data/ranking.json`, and the template's
  sections 6 and 7 (`eval/case-studies/TEMPLATE.md`).
- **D-127** held: the sheets, the rubric, the instructions and the page use plain words.
- **D-001** held for all three arms: the template's section 2 counts the decisions each arm's code kept to
  (`data/counts.json`); this plan's own code check has not run yet (Not done).
- **D-003**, **D-083**, **D-084**, **D-109**, **D-110** held: our arm runs the skill as it is
  (`REPLICATE.md`, "Ours"); this build kept D-110 itself (four calls, the fifth asked as question 4).
- **D-107** held: the retro's benchmark reads the case study (`scripts/reel.mjs` `benchmark`).
- **D-106** held: each arm's home is new, so memory starts empty, and the preflight checks it
  (`eval/case-studies/kit/preflight.sh`).
- **D-129**, **D-082**, **D-085**, **D-024** held: untouched; this adds templates and one command, no new
  stage (D-085).
- Decided after this build (in conversation, 2026-10-04): **D-304** (the README says reelplanning sounds like
  "real planning") holds: `README.md`, its "Why" section.
