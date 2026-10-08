# A case study for any plan: text only, HTML and ours, from one prompt to a finished site

## The problem

The owner:

> "plan out how we do full example? remember we want for any plan to write up case study comparison of
> text only vs html vs ours. and the start is bob dylan site. we start with same prompt from user, same
> files (here, none bc greenfield) and then compare all of them, go thru full lifecycle especially on
> ours. and we compare where we end up."

What we have today stops short of that.

- **One prompt, three starts, one finish.** `eval/bob-dylan-site/` holds the prompt (`prompt.md`), a
  checklist for a full run of our way (`RUN.md`, stages 1 to 10), and two other plans from the same
  prompt: Claude Code's plan mode (`baselines/plan-mode.md`) and an HTML plan (`baselines/html-plan.html`).
  Both of those stop at the plan. Nobody reviewed them, nothing was built from them, so there is nothing
  to set beside our finished site.
- **They were not made the way a person would make them.** Both ran headless with `claude -p` on
  claude-sonnet-5, so plan mode asked no questions and nobody approved anything. A fair comparison needs
  the same agent, the same model and a person at the keyboard, in every arm.
- **Nothing says what "better" means.** `RUN.md` ends with "Totals and comparison" and three loose
  lines. `eval/metrics.md` has an older idea (a planted flaw, three formats) but no measures for a
  finished site. Without the measures fixed before the runs, any result is easy to doubt.
- **It is one-off.** The owner wants this for any plan, not just this site. Today every piece is
  written by hand for Bob Dylan.

The retro's benchmark (`reel retro`) already points at this run, so what we build here is also how a
later change to the skill is judged.

## What changes

Three changes, in four steps.

1. **A kit any plan can use** (step 1): one template every write-up follows, instructions to replicate a
   case study step by step, one capture sheet per arm, a feedback sheet, a rubric, the blind judge's
   prompt, a container for each arm with a check that it starts empty, and `reel case-study`, a command
   that sets up the folders and, at the end, builds the case study's page. The agent builds all of it
   here, now.
2. **Three arms from the same start, each to a finished site** (steps 2 and 3). An arm is one way of
   working, from the prompt to a site you would ship: text only, HTML, and ours. The owner runs every
   arm, at the keyboard; ours goes through every stage of the lifecycle.
3. **Where each ends up, and how each got there, compared and written up** (step 4): the same measures
   on all three, a judge who does not know which site came from which arm, the owner's own ranking, a
   section on the process in the owner's words, and an HTML page that shows it all.

**A case study, not an experiment.** Every arm is run by the owner, interactively: they answer its
questions, read its plan, ask for changes, approve, and ask for fixes. Nothing in an arm runs on its own.
One person, one prompt and three runs is not a controlled experiment, and the write-up says so in its
first lines. The claim under test is narrow: that reviewing a plan and answering its questions is easier
in a video than in text or in an HTML page. We keep the same what we can (the start, the agent, the
model, the feedback given) and write down where we could not.

## Steps

### Step 1 — The kit: a template, the sheets, an empty start, and a command that sets it up

*Independent. The agent builds this now, before any run.*

`reel case-study bob-dylan-site --prompt eval/bob-dylan-site/prompt.md` makes
`eval/case-studies/bob-dylan-site/`:

- `prompt.md`, the user's words, byte for byte, and `start/`, the starting files (empty here: the site
  is greenfield; for a plan in an existing repo, `--from <commit>` records the commit and its file list).
- `arms/text/`, `arms/html/`, `arms/ours/`, each with the arm's container (below) and a `SHEET.md`, the
  form filled in as the arm runs: the preflight's output first, then per stage the time on the clock and
  your own time, every question asked and your answer, screenshots named `NN-stage.png`, and the cost the
  agent reports.
- `REPLICATE.md`, this case study's copy of the instructions (below), filled in: the versions, the
  model, the dates, the container recipe.
- `FEEDBACK.md`, the feedback sheet (step 2 says how it is used): a table with one row a point and a
  column per arm.
- `README.md` from `eval/case-studies/TEMPLATE.md`, the write-up's words with their blanks, and
  `data/`, where the numbers go (times, scores, the judge's output), so the page is built from files.
- `RUBRIC.md` and `JUDGE.md`, copied from the templates (below), so a later case study is judged the
  same way.

`reel case-study report bob-dylan-site` builds the case study's page from that folder (step 4), so any
plan's case study gets the same page.

**One template for every write-up.** `eval/case-studies/TEMPLATE.md` holds the write-up's sections in
the same order as the page (step 4 lists them): the prompt and the empty start; the arms, stage by
stage; the feedback sheet; what each review caught and what slipped through; the sites; the scores, the
judge and your ranking; the process and what felt different; what we would change; links. Under each
heading it says what goes there and which file feeds it (`data/times.json`, `FEEDBACK.md`,
`data/judge.json`, the sheets). `reel case-study report` warns on a section left empty while you fill it
in, and refuses to publish the page until every section is filled, so every case study has the same
shape.

**Instructions to replicate it.** `eval/case-studies/REPLICATE.md` says how to run a case study exactly,
step by step, and each case study keeps its own copy with the versions, model, dates and container
filled in. Per arm, from install to the finished site: every command and prompt to type, what you see at
each stage, and what to capture and where. Our arm's part doubles as a walkthrough of using
`reelplanning` from start to finish: install (`npx skills add …`, `reelplanning setup`), the first
prompt, the plan video and answering on the frame, the revise, the build, the code check and `reel
audit`, the walkthrough video with its accepts and flags, the fixes, and the system video. Today's
`eval/bob-dylan-site/RUN.md` becomes that part (moved, not copied), and the repo's `README.md` links it
from its quick start as "a full example, start to finish".

The arms share the same seven stages, so the times line up: **plan, review, revise, build, check the
result, fix, done**. What happens at each:

| Stage | Text only | HTML | Ours |
|---|---|---|---|
| plan | plan mode, the prompt as typed | the prompt, plus the HTML paragraph already in `html-plan.prompt.md` | "Use reelplanning to plan: " and the prompt |
| review | read the plan, answer its questions in chat | read `plan.html` in a browser, notes in chat | the plan video on the hosted review page |
| revise | the agent edits the plan | the agent edits `plan.html` | revised steps, rebuilt scenes |
| build | approve; it builds | "build plan.html" | build, choices recorded, stop at a step's fifth |
| check the result | its closing summary and `git diff --stat` | a `report.html` it writes (new prompt, same article's words) | code check by a fresh agent, `reel audit`, the walkthrough video |
| fix | ask in chat | ask in chat | flags on the walkthrough, fixes |
| done | you would ship it | you would ship it | accepted; the system video current |

Every arm stops at "you would ship it", or after two rounds of fixes, whichever comes first.

**An empty start, checked.** Each arm's agent sees only an empty folder: no other plans, no baselines,
no HTML plans, no earlier arm's site, no `CLAUDE.md` or memory above it. A fresh folder is not enough on
its own: the agent can read anything on the disk by its path. A first run of the preflight (below) in
an empty folder with a fresh home folder, on the machine this plan was written on, still found nine
things: this checkout's repo and plans, a `.reelplanning/` in the real home folder, and other repos. The
same check in an isolated run (`bwrap`) holding only the empty folder and a new home folder found nothing
(both runs, and the draft script, are in `drafts/` beside this plan). So each arm
runs in a fresh container:

- `arms/<arm>/Dockerfile`: the same Claude Code version and model in all three, `git`, and nothing else
  but what that arm needs (ours adds `reelplanning` and its video tools). Its home folder is new and
  empty, and the only folder mounted is the arm's own empty `site/`, as `~/dylan-site`, with `git init`
  run in it. `REPLICATE.md` gives the two commands to build and start it. Without Docker, a fresh cloud
  session holding only an empty repo does the same.
- `preflight.sh` runs inside the container before `claude` starts, as the agent's user, in its folder,
  with its home: so it sees what the agent would see, and the session begins with the prompt alone. It
  prints one line a check: the folder is empty (`git init` only); no `CLAUDE.md` or `AGENTS.md` above
  it; no `~/.claude/CLAUDE.md`; no `~/.reelplanning/you.jsonl`; no past sessions; no other repos, plans or
  plan pages on the disk. If any line fails, the arm does not start. Its output is pasted first in the
  arm's sheet.

**Memory starts empty in every arm.** With a fresh home folder, our arm's memory of the reviewer
(`~/.reelplanning/you.jsonl`, D-106) starts empty too, so this first case study compares the formats
without memory. Memory is not tested here; a later case study does that (below, under Not in this plan).

**The rubric** scores each finished site 1 to 5 on five things, each with what a 1, a 3 and a 5 look
like: does what the prompt asked (eras, albums, songs and how they connect); more engaging than a
Wikipedia article (you can wander sideways, not only down); works on a phone (390 px wide, no sideways
scroll, taps land); facts right (ten facts checked against a source); easy to change (add one album
without touching code).

**The judge's prompt** is for a fresh agent that sees three folders named X, Y and Z, shuffled, with
everything that names an arm taken out (`.reelplanning/`, `plan.html`, `report.html`, the plan files, the
git history squashed to one commit). It runs each site, takes phone and desktop screenshots, scores
each on the rubric with a line of evidence per score, and ranks them. The key from X, Y, Z to the arms
stays with the owner until the scores are in.

`reel retro`'s benchmark reads this folder too, so a retro is checked against all three arms.

### Step 2 — The text-only and HTML arms, run by you, all the way to a finished site

*Needs step 1's kit. The owner runs it, on their own machine, after ours (step 3), a day between arms.*

Decided: both arms go all the way, fixes included (D-168), so all three end at a site you would ship.

You run each arm yourself, at the keyboard, as you would for real work: nothing in it is autonomous.
Each starts in its own fresh container (step 1), preflight first, and follows its `SHEET.md`:

- **Text only.** `claude --permission-mode plan`, the prompt as typed. Plan mode asks its questions in
  chat; answer them, read the plan, ask for changes, approve. It builds. Check the result from what it
  says it did and from `git diff --stat`, then open the site. Ask for fixes in chat.
- **HTML.** The prompt with the HTML paragraph from `html-plan.prompt.md`, unchanged. Read `plan.html` in
  a browser, give notes in chat, have it revise the page, then "build what plan.html says". Then ask for
  `report.html`: what was built, the choices it made that the plan did not cover, and how to check each
  (the agent writes this prompt in step 1, in the words of the article the HTML arm follows). Ask for
  fixes in chat.

**The same feedback in every arm.** Before the first arm, you write `FEEDBACK.md` from the prompt alone:
what you care about in this site, one point a row (for example: eras first, then albums; it works on a
phone; which songs it covers; the tone). It stays in the case study's folder. In each arm you raise the
same points, in whatever form that arm allows: in chat, as notes on the HTML page, or as answers and
notes on the video. After each arm, its column says for each point: raised (and where), already covered
by the plan, or missed; and a row is added for anything new you raised that was not on the sheet. Where
an arm's format made a point easier or harder to raise, that is a finding, and the column says how.

Each arm's folder is committed as it ends, with its sheet and its column of `FEEDBACK.md` filled in. The
two headless baselines stay where they are, as "the plan with nobody asked", for reference.

### Step 3 — Our arm: the whole lifecycle, every stage captured

*Needs step 1's kit (today's `RUN.md`, moved into `REPLICATE.md` as our arm's part). The owner runs it
first; it needs the hosted review page.*

In its fresh container (step 1), preflight first, "Use reelplanning to plan:" and the prompt, then every
stage as the skill runs it: the plan, the plan video, the review on the hosted page, the revised plan,
the build with its choices recorded (stopping at a step's fifth), the code check by a fresh agent,
`reel audit`, the walkthrough video, each choice accepted or flagged, the fixes, and the system video it
leaves behind, each as `REPLICATE.md` says. The sheet captures each stage as `RUN.md` does today: the
commands typed, your words verbatim, the links to the videos and the review page, and the time.

Decided: you review all three, ours first, a day between arms (D-169), so what you learn on ours helps
the other two, and a win for ours is not from practice.

### Step 4 — Where each ends up, and how each got there: measured, judged blind, and a page

*Needs steps 2 and 3.*

When all three arms are done, the agent writes up the case study from their folders. It does three
things: it measures each arm the same way, it has each arm judged, and it builds one page that shows it
all.

**Measured the same way.** Each of these is taken from all three arms alike:

- **Time.** How long each stage took, for you and for the agent. It comes from the sheets.
- **Questions and decisions.** The questions each arm asked you, your answers, and the decisions that
  came out of them, listed from its plan and its chat.
- **Did the code keep to those decisions?** A fresh agent reads each arm's code against that arm's own
  decisions. Our arm already has this check; here it runs on all three.
- **The feedback sheet.** For each point on it, per arm: raised, already covered by the plan, missed, or
  new. And where an arm's format made a point easier or harder to raise.
- **What each review caught.** What changed between the first plan and the approved one.
- **What slipped through.** Problems found after the arm said it was done. The same check runs on every
  site: a phone at 390 px, a desktop at 1440 px, errors in the console, broken links, and ten facts. Any
  place the site differs from its plan counts too.
- **The sites side by side.** The same three screens from each, on a phone and on a desktop.
- **What you understood.** A day after each arm ends, you answer five questions about what was built,
  from memory (for example "What happens when you tap a song on a phone?" or "How would you add an
  album?"). Your answers are checked against the code.

**Judged two ways: the result and the process** (D-170).

- **The result.** Three verdicts on the finished sites. The rubric scores. The blind judge, which does
  not know which site came from which arm, scores and ranks them. And you rank them yourself, before you
  see the judge's scores. Where you and the judge disagree, the write-up says so in a line.
- **The process.** A section per arm, on how it went: how you read the plan and answered it; what was
  misunderstood, and when that came out (at the plan, during the build, or only in the finished site);
  how much work your feedback took; and what you knew about the build before you looked at the code.
- **What felt different.** Your own words, for anything the rubric misses.

**One page shows it all.** The write-up is an HTML page, `case-study.html`, published the way the review
page is. (It has its own name so it is not confused with the HTML arm's `report.html`.) `reel case-study
report bob-dylan-site` builds it from the case study's folder. The folder stays the source: `README.md`
holds the words, yours and the process sections included; `data/` holds the numbers; the sheets, the
feedback sheet, the screenshots and the judge's output sit beside them. The page has the same sections as
`TEMPLATE.md`, in this order:

1. The prompt, the empty start, and each arm's preflight output.
2. The three arms side by side, stage by stage: what you saw when you reviewed the plan (plan mode's
   text, the HTML plan, our review page with its video), and a bar for the time each stage took.
3. The feedback sheet, as a table: each point, per arm.
4. What each review caught, and what slipped through.
5. The three finished sites side by side, on a phone and on a desktop, each with a link to run it.
6. The rubric scores, the blind judge's ranking and its reasons, and your ranking.
7. The process, and what felt different, in your words.
8. What we would change in reelplanning because of it.
9. Links to everything: the plans, the reviews, the videos, the commits.

A short video of the result can come later, once there is a result to show.

## Components touched

- **The reel CLI** — `reel case-study`, which sets up a case study's folders and sheets, and `reel
  retro`'s benchmark, which reads them (step 1)

`eval/case-studies/` is a folder of results and templates, not a part of the system, so it adds no area
to the system map. The skill is not changed: a case study runs the skill as it is, and `reel case-study`
prints what to do next.

## Open questions for the reviewer

Asked during the build of step 1, at its fifth choice (D-110). Numbered after the three decided at
review.

4. **How is each arm's finished site kept in this repo?** (step 1)
- **A · A copy, and its history as one file.** When an arm ends, its `site/` is committed as plain files,
  without its own `.git`, and its history is saved beside it as `site.bundle` (`git bundle`), which
  `git clone` can open. The repo holds all three sites, ready to run, with every commit each agent made.
- **B · A repo of its own for each arm.** Each site is pushed to a new repo, linked from
  `data/links.json`; this repo keeps the sheets and screenshots only.
- **C · Not kept.** The sites stay on your machine; the case study keeps screenshots and a recording.
I recommend A: the page links each site so it can be run, and the blind judge and step 4's sweep need
all three in one place. A site folder with its own `.git` can't be committed as it is (git records only
a pointer to it). Until you answer, the arms' `site/` folders stay empty and untracked; it needs an
answer before the first arm ends.

## How each was decided

Reviewed 2026-09-26 on the review page (verdict: changes requested). All three questions took the
recommendation.

- **Do the text-only and HTML arms go all the way to a finished site?** (step 2) All the way, fixes
  included (D-168). Step 2 now says so.
- **Who reviews each arm, and in what order?** (step 3) You, all three, ours first, a day between arms
  (D-169). Steps 2 and 3 now say so.
- **How is where we end up judged?** (step 4) The rubric, a blind judge, and your ranking (D-170), with
  your note: "yes we will use rubric but its also about the planning process, and also about what we
  think might be different than rubric". Step 4 now judges the process too, and ends with what felt
  different, in your words.
- **Your note on step 2**: "so for each of these they are non autonomous right like i have to go trhough
  them? i guess its hard to compare them in a scientific way which is fine, we'll just try to do our
  best. like the point is that interaction is easier in video, so this is more like a case study i would
  say. we want to genearlly try to follow same kinds of feedback choices or something?" Yes: every arm
  is yours, at the keyboard. What changes now says it is a case study, not an experiment, and names the
  claim under test; step 2 adds the feedback sheet, the same points raised in every arm.
- **Your note on the plan**: "oh and also we just want to double check that when we do plan the agent
  sees like an empty dir, it has no way of looking at other plans or other htmls that might already have
  been done . we might need to containerize if we want". Step 1 now gives each arm a fresh container and a
  preflight that checks, before the prompt, that the agent can read nothing else; a first run with only
  a fresh home folder showed why the container is needed.
- **Approved** 2026-09-26 on the review page (`reviews/plan-20260926T214418Z.md`), with no new plan
  video. You went back twice around step 4's scene, so step 4 now says the same thing more plainly:
  what is measured, how it is judged, and what the page shows. Nothing it decides has changed.

## Decisions in force

- **D-168** The text-only and HTML arms go all the way to a finished site, fixes included (step 2).
- **D-169** You review all three arms, ours first, a day between arms (steps 2 and 3).
- **D-170** Where each ends up is judged by the rubric, a blind judge and your ranking (step 4); the
  process is written up beside it.
- **D-127** Plain words on screen: the sheets, the rubric and the write-up use them too.
- **D-001** A second agent checks that the code followed the plan: step 4 runs that check on all three
  arms, not only ours.
- **D-003** The system video updates after every accepted walkthrough: our arm ends with it current.
- **D-107** A retro is suggested every five plans; its benchmark now reads the case study (step 1).
- **D-106** Your memory across repos is a file in your home folder: with each arm's fresh home folder,
  ours starts with it empty, so this case study does not test memory, and the write-up says so.
- **D-110** At a step's fifth choice the implementer asks: our arm's build keeps it.
- **D-083** A quick check per step: our arm's videos keep them.
- **D-084**, **D-109** What stops the walkthrough: untouched; our arm's walkthrough follows them.
- **D-129** Approving is never blocked: untouched.
- **D-082** A run nobody is watching stays in auto mode, inside the sandbox: untouched.
- **D-085** Less scaffolding: this plan adds templates and one command, no new stages.
- **D-024** Detail pages start from a template: untouched.

## Not in this plan

Changing the product because of the result: what the case study finds becomes the next plan, reviewed
like any other. More prompts than this one. A study with many reviewers, or a controlled experiment.
Memory: every arm here starts with none; a later case study runs ours with your memory against ours
without it.
