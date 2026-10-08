# How to run a case study, step by step

A case study takes one prompt and runs it three ways, each to a finished site: **text only** (Claude
Code's plan mode), **HTML** (a plan written as an HTML page) and **ours** (reelplanning). You run every
arm yourself, at the keyboard. This page says exactly what to do in each, what you will see, and what
to write down and where.

`reel case-study <slug> --prompt <file>` makes a case study's folder, with its own copy of this page.
In that copy, the words in double braces here are filled in: the versions, the model, the
dates and the container. Keep it up to date as you go (the dates especially).

| | |
|---|---|
| Case study | `{{slug}}` |
| reelplanning | {{version}} |
| Claude Code | {{claude_code_version}}, the same in all three arms |
| Model | `{{model}}`, the same in all three arms |
| The folder the agent sees | `~/{{folder}}`, empty but for `git init` |
| Start | {{start}} |
| Made | {{date}} |
| Arms run | text: _fill in: date_ · HTML: _fill in: date_ · ours: _fill in: date_ |
| Machine | _fill in: OS, Docker version_ |

## Before the first arm

1. **The folders.** `reel case-study {{slug}} --prompt <file>` has already made
   `{{dir}}/`. The prompt is in `prompt.md`, word for word. Each arm has its own
   folder in `arms/`, with its `SHEET.md` (the form you fill in as it runs), `prompt.txt` (exactly what
   to type first), its container (`Dockerfile`, `start.sh`, `preflight.sh`) and an empty `site/`
   (where the site is built, and kept when the arm ends: "When an arm ends").
2. **The feedback sheet.** Before any arm, write `FEEDBACK.md` from the prompt alone: what you care
   about in this site, one point a row. Don't change the points once an arm has started. In every arm
   you raise the same points, in whatever form that arm allows.
3. **The order.** Ours first, then the other two, a day between arms (so what you learn on ours helps
   the others, and a win for ours is not from practice).

## Start an arm (the same for all three)

Each arm runs in a fresh container. It holds Claude Code, `git`, what that arm needs and nothing else.
Its home folder is new and empty, and the only folder it can see from your machine is the arm's own
`site/`, as `~/{{folder}}`. From the arm's folder:

```bash
cd {{dir}}/arms/<arm>
mkdir -p site
docker build --build-arg UID=$(id -u) -t cs-{{slug}}-<arm> .
docker run -it --rm -e ANTHROPIC_API_KEY -v "$PWD/site:/home/agent/{{folder}}" cs-{{slug}}-<arm>
```

- **Ours only, before `docker build`:** reelplanning is not on npm yet, so its container installs it from
  a `reelplanning-<version>.tgz` beside the `Dockerfile` when there is one, else from GitHub (that works
  once the repo is public). While the repo is private, make the tarball at the root of a checkout:
  `npm pack --pack-destination {{dir}}/arms/ours` (it is never committed). And add `--network host` to
  `docker run` (the first lines of its `Dockerfile` have it): the review page the agent serves inside
  the container, on its `127.0.0.1:8787`, then opens in your browser. That is Linux; on Docker Desktop,
  turn on host networking first (Settings, Resources, Network).
- **What you see.** `start.sh` runs `git init` in the folder, then the preflight: one line a check,
  each ✓ or ✗. If any line is ✗, the container stops: fix what it names and start again. When all
  pass, it waits for Enter. (`git init` also writes `site.exclude` into the folder's `.git/info/exclude`:
  the built videos' voice files, pictures and renders stay out of the site's history, as no voice file or
  render is committed in this repo, D-305. It is inside `.git`, so the folder the agent sees is still empty.
  Where the skill commits voice files, git leaves them out as ignored; `reel case-study keep` refuses a
  history that holds one anyway, and says how to take it out.)
- **Capture.** Copy the preflight's lines into `SHEET.md`, under "Preflight", before anything else.
  Then press Enter: Claude Code starts. Without `ANTHROPIC_API_KEY` it asks you to log in; the login is
  kept in the container's home and goes when the container does.
- **Without Docker.** On your own machine: the arm's folder outside any repo, and per arm a Claude Code
  config of its own (`CLAUDE_CONFIG_DIR`) and reviewer memory of its own (`REELPLANNING_HOME`), which the
  preflight checks; your other repos on the disk stay a ✗ line. Or a fresh cloud session: a new machine,
  but it starts from a checkout of a repo and its agent reads that repo's `CLAUDE.md`, so the preflight
  shows ✗ lines there (the checkout on disk, the session's own transcript). Paste the lines into the sheet
  as they are, and say so in the write-up's first section. Bob Dylan's
  [`RUNBOOK.md`](bob-dylan-site/RUNBOOK.md) is a worked one for both; on your own machine,
  `eval/case-studies/kit/arm.sh` sets up an arm, starts it, notes its stages and finishes it.

The preflight checks, one line each: the folder is empty (`git init` only); no `CLAUDE.md`,
`AGENTS.md` or `.claude` above it; no `~/.claude/CLAUDE.md`; no `~/.reelplanning/you.jsonl` (the
reviewer memory starts empty); no past sessions (with `CLAUDE_CONFIG_DIR` or `REELPLANNING_HOME` set, it
looks there instead); no other repos, plans or plan pages on the disk.

## The seven stages

Every arm goes through the same seven stages, so the times line up. At each one, write in the sheet:
the time on the clock when it starts and ends, how much of that was your own time (reading, typing,
thinking), every question the agent asked and your answer, the screenshots (into the arm's `shots/`,
named `NN-stage.png`, for example `02-review.png`), and the cost the agent reports.

| Stage | Text only | HTML | Ours |
|---|---|---|---|
| plan | plan mode, the prompt as typed | the prompt, plus the HTML paragraph | "Use reelplanning to plan: " and the prompt |
| review | read the plan, answer its questions in chat | read `plan.html` in a browser, notes in chat | the plan video on the review page |
| revise | the agent edits the plan | the agent edits `plan.html` | revised steps, rebuilt scenes |
| build | approve; it builds | "build what plan.html says" | build, choices recorded, stop at a step's fifth |
| check the result | its closing summary and `git diff --stat` | the `report.html` it writes | code check by a fresh agent, `reel audit`, the walkthrough video |
| fix | ask in chat | ask in chat | flags on the walkthrough, fixes |
| done | you would ship it | you would ship it | accepted; the system video current |

An arm ends when you would ship the site, or after two rounds of fixes, whichever comes first.

## Text only

The container starts Claude Code in plan mode (`claude --permission-mode plan`).

1. **plan.** Type the prompt, exactly as in `prompt.txt`. Plan mode may ask questions first: answer
   them in chat. Capture each question and your answer, word for word, and the plan it shows.
2. **review.** Read the plan. Raise your feedback points in chat, as you would for real work. Capture
   what you wrote.
3. **revise.** It changes the plan. Capture the new plan (or what changed) and how many rounds it took.
4. **build.** Approve the plan; it builds. Capture how long it took and the cost.
5. **check the result.** Read what it says it did, then run `git diff --stat` (and `git log`) in the
   folder. Open the site. Capture its closing summary, word for word, and the diff's summary.
6. **fix.** Ask for fixes in chat. Capture each ask and what changed.
7. **done.** When you would ship it. Capture how to run the site.

## HTML

The container starts plain Claude Code. The arm follows
[The Unreasonable Effectiveness of HTML](https://thariqs.github.io/html-effectiveness/): the plan and the
report are pages you read in a browser.

1. **plan.** Type `prompt.txt`: the prompt, then the paragraph asking for `plan.html`, unchanged from
   the Bob Dylan baseline's prompt (`eval/bob-dylan-site/baselines/html-plan.prompt.md`):

   ```text
   {{html_plan_paragraph}}
   ```

2. **review.** Open `site/plan.html` in a browser on your machine (the folder is shared with the
   container). Give your notes in chat.
3. **revise.** Ask it to revise the page. Capture each version (`plan.html` is in git).
4. **build.** "build what plan.html says". Capture how long it took and the cost.
5. **check the result.** Ask for the report, with this prompt (it is also in `report.prompt.txt`). It is
   in the words of the article's
   [PR writeup example](https://thariqs.github.io/html-effectiveness/17-pr-writeup.html):

   ```text
   {{html_report_prompt}}
   ```

   Read `report.html` in a browser, then open the site.
6. **fix.** Ask for fixes in chat.
7. **done.** When you would ship it.

## Ours: reelplanning from start to finish

This part is also a full example of using reelplanning, from install to the finished site. The
container builds with the skill and its tools already installed (the `Dockerfile`'s lines marked "this
arm only"), so step 1 happens in `docker build`.

**At every stage, capture:** the exact commands and prompts typed, screenshots (into `shots/`, named
`NN-stage.png`), links to videos and pages, your words verbatim, and the time spent (the clock, and how
much of it was yours). Cut what didn't happen.

### 1. Install (in `docker build`)

The install in [the reference](../../docs/reference.md#install), as the container runs it. reelplanning
is not on npm yet, so the tooling comes from GitHub (or, while the repo is private, from the tarball
`npm pack` made: "Start an arm"), and the skill from the package just installed:

```bash
npm i -g ./reelplanning-{{version}}.tgz    # once the repo is public: npm i -g github:<owner>/<repo>
npx skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g -y -a claude-code
reelplanning setup
sh smoke.sh                          # a line of speech, its word timings and ten seconds of video
```

The skill writes its commands as `$RP`, which is the `reelplanning` installed here (it is on the PATH;
the package is not on npm). Capture: what `setup` installed or
couldn't and the smoke's lines (the build's output), and how long the build took.

### 2. First prompt (stage: plan)

In the container's empty folder, type `prompt.txt`:

```text
Use reelplanning to plan: <the prompt>
```

The part after the colon is `prompt.md`, word for word. Capture: every question the agent asked and
your answers, the plan (`.reelplanning/plans/<date>-<slug>/plan.md`), the time to a plan.

### 3. Plan video (stage: plan)

Capture: the storyboard summary, the build time, the video's parts and their lengths, the link to the
review page (in the container, the local page `reelplanning review` serves; in a cloud session, the page it
published as a claude.ai Artifact) and to each part's MP4 if any, a screenshot of the first choice.

### 4. Comments (stage: review)

Answer on the frame: each choice made and every comment or mark. Raise your feedback points here.
Capture them verbatim, with the frame each was on; the review file (`reviews/plan-*.md`); how long the
review took.

### 5. Revised plan (stage: revise)

Capture: which steps changed (`plan-diff`), what you watched again and for how long, and whether it was
approved on this pass or needed another.

### 6. Implement (stage: build)

Capture: the start commit, how long the build took, each step's recorded choices and any step that
stopped at its fifth.

### 7. The code check and the audit (stage: check the result)

Capture: the second agent's code check and what it found (`code-check/findings.md`), and `reel audit`'s
output.

### 8. Walkthrough video (stage: check the result)

Capture: the link, its parts and lengths, the calls the agent made on its own and which ones stopped
the video (`reel stops`).

### 9. Flags (stage: fix)

Capture: each call accepted or flagged, with your words verbatim (`reviews/walkthrough-*.md`).

### 10. Fixes (stage: fix)

Capture: what was rewritten for each flag, the scenes rebuilt, and the second walkthrough if there was
one.

### 11. The finished site (stage: done)

Capture: how to run it, a link to browse it (hosted or a recording), phone and desktop screenshots, and
the system video it left behind.

## When an arm ends

- Fill in the arm's column of `FEEDBACK.md`: for each point, raised (and where), already covered by the
  plan, or missed. Add a row for anything new you raised that was not on the sheet. Where the arm's
  format made a point easier or harder to raise, say how.
- Take the same screenshots of the site as the other arms: three screens, at 390 px (a phone) and at
  1440 px (a desktop), into `shots/` as `site-phone-1.png` … `site-desktop-3.png`.
- A day later, answer the five questions on what was built, from memory, in the sheet.
- **Keep the site** (D-247). The agent's last commit is the finished site: if the folder has changes
  not committed, commit them there first. Then, from the folder you ran `reel case-study` in:

  ```bash
  reel case-study keep {{slug}} <arm>
  ```

  It saves the site's git history, every commit the agent made, as `arms/<arm>/site.bundle`
  (`git bundle create`: HEAD, its branches and its tags), checks it with `git bundle verify`, and only then takes the site's own
  `.git` out of `site/`, so `site/` is the finished site as plain files you can open (git can't commit a
  folder holding a `.git` of its own: it would record only a pointer to it). If the site ended somewhere
  else (a cloud session's clone, say), name that folder last: `reel case-study keep {{slug}} <arm> <folder>`
  copies the files its git tracks into `site/` and bundles its history. `reel case-study keep {{slug}}
  --check` checks every arm kept so far. To see the history again: `git clone arms/<arm>/site.bundle <folder>`.
  It refuses a history that holds a voice file, a video or a render under `.reelplanning/` (no voice file or
  render is committed here, a bundle included: D-305) and prints the commands that take them out. In place,
  what the site's git ignored (its `node_modules`, the built videos' media) stays on disk, so the videos
  still play, and `arms/<arm>/.gitignore` keeps it out of this repo.
- Commit the arm's folder, with its sheet, its column of the feedback sheet, `site/` and `site.bundle`.

## After all three: the judge and the page

1. **The blind judge.** Follow `JUDGE.md`: copy the three sites into folders named X, Y and Z, shuffled,
   with everything that names an arm taken out, and give a fresh agent the prompt in it. Keep the key
   from X, Y, Z to the arms to yourself until its scores are in.
2. **Your ranking.** Write `data/ranking.json` before you read the judge's scores.
3. **The write-up.** The agent fills `README.md` and `data/` from the arm folders (`TEMPLATE.md` in
   `eval/case-studies/` says what goes in each section and which file feeds it).
4. **The page.** `reel case-study report {{slug}}` builds `case-study.html` and warns on each section
   still empty. `reel case-study report {{slug}} --publish` refuses until every section is filled; then
   publish the page the way the review page is published.
