# Changelog

## Unreleased

- **Send works for a quick video too.** With no set-up `.reelplanner/` (the skill's first level, one video), the
  Finish panel offered only **Download annotations.json**, and the person then told the agent where the file was.
  Now the review server keeps that repo's inbox in this machine's folder, `~/.reelplanner/inbox/<repo-key>/` (the
  repo folder's name and a short hash of its path; `REELPLANNER_HOME` moves it), so **Send** hands the review to
  the session waiting on it (`review --wait`) with nothing added to the repo. There is no agent command at that
  level, so with no session waiting the panel says plainly it is saved on this machine until you tell your agent;
  `inbox` lists it. `review --detach` and `--stop` work there too (its `.server.json` and log go in the same
  folder). The download is left for a page no server takes the review for (none behind it, or a Send that
  failed). A repo set up later uses its own `.reelplanner/inbox/`; a review left in the machine's is named by
  `inbox` and finished by `inbox done`, never picked up twice.
- **The system video says reelplanner,** in its narration and on its frames, and its install is shot again from the
  public repo on a fresh Ubuntu machine (`npm i -g github:ncrispino/reelplanner`, a first `setup`, the skill, `reel
  init`); the README's GIF is its opening, made again. The voice says the name as "reel planner": Kokoro read
  "reelplanner" as "reopliner", so `say.mjs` hands it over apart (`NAME_SAID`), alone, in code and in a path, and the
  captions still show it as written. `reelplanning` has a meaning in Terms (the glossary's Other words) for the pages
  and videos made before the rename.
- **reelplanning is now reelplanner** (D-312: reelplanning.com is already a business). The package, the command
  (`reelplanner`; `reel` stays), the repo (`github:ncrispino/reelplanner`), the case-studies repo, the Claude Code
  plugin (`/plugin install reelplanner@reelplanner`), a repo's `.reelplanner/`, the machine's `~/.reelplanner` and
  the settings (`REELPLANNER_*`) take the new name, and the review player is `reelplanner-player.js`. The old names
  are still read: a repo's `.reelplanning/` (each command says so once, with the `git mv` that renames it),
  `~/.reelplanning` while there is no `~/.reelplanner` (then its `you.jsonl` and `.env` are named, with the `mv` that
  moves them), a `REELPLANNING_*` setting in the shell or a .env file (a line that says where a setting came from
  names it as it was set: `from the shell's REELPLANNING_TTS (its old name)`, not its new name), and the `reelplanning`
  command, which says the new name and runs it. A review begun on the page before the rename keeps its marks.
  To move over: `npm rm -g reelplanning` (npm stops at `EEXIST` otherwise; `install.sh` does it), then install
  reelplanner. The entries below keep the old name.
- **The Claude Code plugin is the skill's folder alone.** Its marketplace entry's source was the whole repository,
  so installing it copied all of it into `~/.claude/plugins/cache` (117 MB), and Claude Code npm-installed the
  root's `package.json` there (177 MB more), beside the marketplace's own clone (172 MB). The source is now
  `skills/plan-to-video` (108 KB, `SKILL.md` and its style guide), and the entry in `marketplace.json` is its
  manifest (`.claude-plugin/plugin.json` is gone; `sync-version.mjs` carries the version into the entry, and
  `version.spec` keeps the plugin that folder alone). An install made before keeps its copy until the version moves.
- **`setup`'s summary names a narration problem once:** a narration setting that cannot work was listed as
  `narration: narration: …` under "still missing".
- **A fresh-install check** (`.github/workflows/fresh-install.yml`, `scripts/release/fresh-install.sh`): the README's
  Install run as written in a bare `ubuntu:24.04` container, by a user with sudo, with Node 22 from nvm and with
  Ubuntu's own older Node, which the CLI must refuse. On a PR that changes the install's path, on each version tag,
  each week, and by hand; it reports, it does not block a merge. Its first run found that `setup` could not install
  the local voice on a stock Ubuntu: its `python3` has no pip. `setup` now installs `python3-pip` with apt, as it
  does ffmpeg, and says how when it cannot. And `setup` read a libwebp ffmpeg as one without (`grep -q` in a pipe
  under `pipefail`), so on Ubuntu it installed `cwebp` it did not need.
- **Node 22.20 or later.** HyperFrames needs Node 22 and the `skills` installer 22.20, so `package.json`'s
  engines, `setup`, the curl installer and the docs say 22.20 (they said 18, and on Ubuntu's own Node 18 the
  install failed in `npx skills`). `reelplanning` and `reel` refuse a Node older than 22 before anything runs and
  say how to update, instead of failing later on an import it does not have; on 22.0 to 22.19 they run, and
  `setup` and the curl installer say that `skills` asks for 22.20. `version.spec` keeps the docs and checks on
  the engines' version.
- **PRs are merged with a merge commit, not squashed:** main keeps a PR's own commits. CONTRIBUTING, the PR
  template, the templates the skill copies into a repo, the skill and `docs/lifecycle.md` say so; `reel pr-check
  --tidy` still takes the contributor's own reviews off the branch before the merge.
- **The README's quick start begins in a project you already have,** then a new one (a neighborhood bakery's
  site, in place of Bob Dylan's albums). Its Install names the Claude Code plugin (`/plugin marketplace add
  ncrispino/reelplanning`), and says the plugin is the skill only; `marketplace.json` describes it as
  `plugin.json` does (it said "90-second" videos).
- **A repo reached through a link works as one reached directly.** On macOS a temp folder is `/var/…`, a link to
  the `/private/var/…` that git and the working directory report, and the same happens to a linked home or projects
  folder. Code that measured one spelling against the other found no history or the wrong folder: a review's
  approval, narration reused from git, `spec-diff`, `reel status`'s rebuild check, review's Send line,
  `bundle-player`'s repo id, `code-check`, and fresh eyes' check of where findings were written. They now compare
  real paths (`realPath()` in `scripts/lib/env.mjs`).
- **Playwright's Chromium is found on macOS and in its current layouts** (`chromiumPath()`): each OS's own store
  (`~/Library/Caches/ms-playwright` on a Mac) and Chrome for Testing's folders, the full browser before the
  headless shell.
- **Guide pictures on a Mac.** Homebrew's ffmpeg is built without libwebp, so guides there had no pictures; they
  are made with `cwebp` when ffmpeg cannot, and `setup` installs it (`brew install webp`) when neither is there.
- **The case-study kit on a Mac:** `arm.sh` parses under macOS's `/bin/sh` (bash 3.2), and `preflight.sh` finds
  `~` however `HOME` and the folder are spelled.
- **The test suite passes on CI and on macOS,** not only in the development containers: CI runs on Node 22 (which
  HyperFrames needs) with ffmpeg, and the specs no longer lean on the machine's tools, its temp folder's spelling,
  the development history, a page measured before it came to rest, or a paused video read before its pause landed.
- **The full suite runs on every push to a pull request,** instead of failing until a maintainer added
  `ready-to-merge`: a PR's checks are green or red for its code, and a maintainer's approving review is what else
  it needs. The tests (`.github/workflows/ci.yml`) start only on pushes, and `reel pr-check` moved to
  `.github/workflows/pr.yml`, so an edited PR text or a label never records a skipped test check, which GitHub
  counts as passed.
- **The public repo is `ncrispino/reelplanning`, one commit (D-310).** `scripts/release/make-public.mjs` builds it
  in a scratch folder: a new repo whose `main` is one commit, `reelplanning <version>`, holding exactly a ref's
  tracked tree, tagged `v<version>`; it refuses a tree with a `.wav`, `.mp4` or `renders/` path, adds a line to
  `.reelplanning/README.md` saying the record's commit ids name the development history (not public), and prints
  the push without running it. It replaces `slim-history.mjs`; this repo keeps its full history. The package, the
  plugin manifests, the installer, the skill, the docs and the issue forms name the repo in lowercase, and
  `docs/releasing.md` has the steps to go public, in order.
- **A shorter top level.** The repo's root lists 22 entries instead of 28: `CONTRIBUTING.md`, `SECURITY.md` and
  `CODE_OF_CONDUCT.md` are in `.github/` (GitHub still links them from the repo page), `RESEARCH.md` is
  `docs/research.md`, the README's pictures are in `docs/media/`, and the curl installer is
  `scripts/release/install.sh` (its URL: `…/main/scripts/release/install.sh`; not a `reelplanning` command, and
  not in the package).
- **Every version you reviewed can be built again.** Opening a video for review and recording a review keep that
  version: its commit, and the files git leaves out that nothing makes again (screenshots shown in scenes, the text
  the video was captured from), committed once per content in `.reelplanning/media/` (a PNG as lossless WebP), with
  a small record of the version in `<plan-dir>/versions/`. No voice, video or render is kept (D-305). `reel rebuild
  <video-dir>` lists the versions; `--version <n>` builds one in a git worktree at its commit, with its plan, ledger,
  guide and screenshots as they were, the voice made again, and says what differs or could not come back. A
  check that has grown stricter since is said and does not stop it. What is kept and why: `docs/project-dir.md`.
- **The local voice is optional.** `reelplanning setup` installs Kokoro, its 840 MB of models and whisper.cpp only
  when narration here runs them: with a hosted engine set (read as `narrate` reads it), it skips them and the speed
  check and says so in one line. `setup --hosted-voice` skips them before the key is set and prints the two lines for
  `~/.reelplanning/.env`; `setup --local-voice` installs them anyway. `narrate` without the local voice it needs stops
  first, naming both ways on, and `transcribe-missing` re-times a hosted line with the hosted transcriber, not local
  whisper. The README's Install says the choice and what each costs.
- **A small download: no voice file or render is committed (D-305).** The repo stops tracking its 819 .wav, .mp4
  and `renders/` files (451 MB; they stay on disk), so the package is about 64 MB instead of about 440 MB. `.gitignore`
  and the `.reelplanning/.gitignore` that `reel init` writes leave out `*.wav` and `*.mp4`, and `reel pr-check` fails
  a PR that adds a .wav, .mp4 or `renders/` file anywhere. The five sample videos play their committed .mp3 from a
  clone, and `narrate` keeps a line from that mp3 (writing a newly voiced one as mp3 too) instead of voicing every
  line again.
- **One `.env` for the machine, and a folder of setup files is not a set-up repo.** `~/.reelplanning/.env`
  (`$REELPLANNING_HOME/.env`) is read last, after the shell, the repo's `.reelplanning/.env` and a `.env` beside the
  project: two lines there, `REELPLANNING_TTS=openrouter` and `OPENROUTER_API_KEY=…`, give every repo the hosted
  voice with no `config.json`. The slow verdict and `setup --dry-run` now point there, and the engine line says
  which file a setting or key came from (never the key). A repo is set up when `.reelplanning/decisions.json`
  exists, not the folder: `reel init` over a folder with only `.env` and `config.json` keeps the `.env` and merges
  the config (your keys win), `reel status` says "not set up yet" instead of crashing, and `review` downloads the
  review there instead of filing it in an inbox no one reads.
- **A README a newcomer reads.** Two sentences and the GIF, install in three commands, then examples in plain
  words: a new project from an empty folder first, then a change, a plan file and an explainer in a repo you have.
  The three ways to use it as a list, where the hosted voice's key goes (`.reelplanning/.env`), and a short
  comparison. The full loop's detail moved to [`docs/lifecycle.md`](docs/lifecycle.md) ("The full loop, in
  short"). Works with names GitHub Copilot, Cursor, OpenCode and Antigravity CLI (untested); `docs/agents.md`
  replaces Gemini CLI with Antigravity CLI (`agy`) and says each agent gets the skill through `npx skills`' link
  into its own folder.
- **The record stays within reach, and so does what you asked for.** Reading the guide under the video, the record's
  bar stays at the window's foot (the small player sits above it), and pulled up it lists every comment, the ones on
  the guide's words too. A comment's time goes to it on the video, the video back in its place and the comment named
  on the frame; a guide comment's place goes to it in the guide. Your comments show as short strokes on the timeline,
  and **Marks: on | off** (beside Clear, or `V`, remembered per viewer) hides them and the marks drawn on the frame.
  After a rebuild, **Your last review** in the record lists the round you sent, read-only, each line going to where
  it is now (or saying it is not in this version), so you can check every request was handled.
- **The page says the review is being worked on.** After Send, a line above the video says where the review is:
  waiting for your agent, being worked on (with its step), done, or stopped (with the run's log), with the time since
  Send and a quiet pulse (still under reduced motion). It survives a reload and a closed panel. When the agent is
  done and the video was rebuilt, "The new version is ready" opens over the player: **Watch what changed** reloads
  into just the changes. The local page asks the review server's new `GET /api/review/status?id=`; the hosted page
  follows its row.
- **Narration through hosted APIs.** `.reelplanning/config.json`'s `narration` (or `REELPLANNING_TTS`) can name a
  hosted voice: OpenRouter (recommended), OpenAI, any OpenAI-compatible server, ElevenLabs, or Kokoro on DeepInfra (the local build's voice; slow, not recommended).
  Word timings come from the provider, from a hosted whisper (Groq or OpenAI), or from local whisper at a smaller
  model, so a small machine no longer spends minutes a line in whisper. Hosted lines run 4 at a time, retried on
  429 and 5xx. Keys come from the environment only; a missing one stops `narrate` and says what to set. `setup
  --dry-run` says which engine narrates. Without the setting nothing changes: local Kokoro + whisper small.en.
- **OpenRouter, one key for the voice and the timings.** `"tts": "openrouter"` voices with Deepgram Aura-2 (a line in
  1–3 s, checked with a real key) or another of its speech models (not its Kokoro: 47–125 s a line), and times the words with its `openai/whisper-1`, all on
  `OPENROUTER_API_KEY`; `"timings_api": "openrouter"` times any provider's speech there.
- **`reelplanning narration-check`** voices one sentence with the narration engine you name (or the one `narrate`
  would use) and says, a line each, whether the speech and the word timings work, how long they took, what a minute
  costs, and on a failure the API's answer and what to set. A minute's test of a hosted provider with a real key.
- **Is local narration fast enough here? And keys in `.reelplanning/.env`.** `reelplanning setup` (and
  `narration-check --local`) times one plan-video line through local Kokoro + whisper, at most 30 s, and says in one
  line whether that is fine for a plan video or slow (over 20 s a line), and then exactly how to switch to the
  hosted voice: `OPENROUTER_API_KEY` in `.reelplanning/.env`, `"narration": { "tts": "openrouter" }` in config.json,
  `narration-check`. Local still works either way. Keys now belong in the repo's `.reelplanning/.env` (git ignores
  it): `narrate`, `narration-check` and `setup` read it from anywhere in the repo, after the shell's environment and
  before a `.env` beside the project, and warn when git would commit it.
- **The guide shows what a revision changed, as the video does.** After a review asks for changes, each part of
  `plan.md` whose words changed since the version the review watched (a step's words, a case, a question, a section)
  is marked "Changed since your review", with "What changed": the old and new words, and the review's own words
  that asked for it. In short lists them; "Show only the changes" folds the rest. `guide --check` fails a change
  left unmarked, or a mark on a part that is the same.
- **Install from GitHub, for now.** reelplanning is not on npm yet: install it with `npm i -g
  github:ncrispino/reelplanning`, then `reelplanning setup`, and the skill runs `reelplanning …` where it says `$RP`.
  `scripts/release/install.sh` falls back to the GitHub install when `npm view` finds no version, and `setup`'s
  fix lines say `reelplanning …` first. On Linux, `setup` installs `unzip` before the Chrome download, which hung at 100% without
  it. The README, `docs/reference.md`, `docs/project-dir.md` and the case-study kit use this install.
- **Choose how much you take on.** The skill opens with three levels, and with no `.reelplanning/` the agent asks
  which: Quick, one video (a plan video or an explainer, 1–3 minutes, nothing in the repo but `videos/<slug>/`); a
  plan video and a walkthrough after the build; or the whole loop (decisions, reviews, the system video). In the
  full loop a reviewer can skip a plan's walkthrough video: `**Walkthrough video:** skipped` in `walkthrough.md`,
  and `reel status` reads the plan as done. The skill runs the `reelplanning` already on the PATH before trying
  `npx`. The README starts with install, then a quick start. From first quick runs: `explain` runs `hyperframes
  init` before writing into `video/`, a new project gets the caption code font, and a backticked word is one code
  run in the captions.
- **Claude Code first, basic Codex support** ([docs/agents.md](docs/agents.md) says what each agent is tested for).
  `reel init --agent claude|codex|none` writes the headless command for the agent (by default, the one it runs
  inside). Codex gets `codex exec -s workspace-write`. The skill names skills per agent (`/faceless-explainer` in
  Claude Code, `$faceless-explainer` in Codex). Fresh eyes and the code check say how to start an agent with none of
  the conversation's context in each agent. `AGENTS.md` holds this repo's agent instructions, and `CLAUDE.md` points
  to it.
- **The decision log scales** (D-306). The owner's answers are rules and stay binding. Accepted agent calls are
  history: `reel check` asks a plan to cite only the rules, and with `--base` it names each accepted call whose lines
  the diff changes (`pr-check` and the code check do the same). Each call is placed on the lines its plan's commits
  wrote. `reel status` and `reel memory` name the calls none of whose lines is left. `reel fold <component>` drafts
  that component's rules as a section of `spec.md` for the owner's approval, and `--apply` puts it there.
- **`reel record` files a review given in conversation** (`"source": "conversation"`, `"by"`, `"said"`). It is
  recorded by the reviewer's id, not an email, says "accepted in conversation" and quotes the owner instead of a
  watch percentage, and `reel memory` counts it as untimed. The plan-guide, walkthroughs-that-help and
  contributing walkthroughs were accepted this way (D-267 to D-302), and the ledger's supersedes links were
  corrected with the owner's approval (D-194 is now superseded by D-266).
- **The system video, redone** (D-003, D-303, D-304): about 9½ minutes in seven chapters, from a `spec.md`,
  `system.json` and glossary brought up to date first. It shows the real install (GitHub, `reelplanning setup`, the
  skill, `reel init`), says which commands your agent runs for you, and defines the words a newcomer lacks. Its
  voice and renders are no longer committed (D-305), and the README shows a GIF of its first 48 s. It has no guide
  yet: `plans/2026-10-04-system-video-guide` is a draft.
- **Video building:** a rebuild without `--speed` keeps the speed the video was voiced at. `holds.json` takes a
  `"tail"` held after every line. `chapters --no-checks` cuts the quick checks out of the chapter MP4s. A code span
  of several words is one code run in the captions. `finish-project` works with macOS's `sed`.
- **`reel init`'s `.gitignore`** leaves out each video's voice, its guide, the plan's guide page and the system
  video's renders.
- **`--help` everywhere.** `reel --help`, `reel help <command>`, `reel <command> --help` and `reelplanning <script>
  --help` print the usage and run nothing (`reel init --help` used to make a folder named `--help`). A `reel`
  command run without its arguments prints its usage. `reel init`, `new-plan` and `prereqs` say what to do when
  the folder already exists or has no `plan.md`. So does `guide` for a folder it cannot build. The test runner
  takes `--help` too.
- **Ready to publish.** A new `package.spec` (in `npm test`) checks what npm ships: no media, tests, videos or plans,
  every shipped import resolvable, the licences in. It replaces `publish.yml`'s own check, which refused the
  case-study files the package ships and would have failed the first release. A `NOTICE` covers the fonts, GSAP and
  HyperFrames. New: issue forms, a code of conduct, a CONTRIBUTING with setup, tests and how to find work, a README
  rewritten for the public, `docs/comparison.md` (similar projects, with sources), `llms.txt`, and topics to apply.
  `.gitattributes` keeps the plan videos' HTML out of GitHub's language bar. The owner's email address is gone from
  the current files.
- **The case-study kit** installs reelplanning the way it installs today. `smoke.sh` runs a ten-second check. Each
  arm keeps voice files and renders out of the site's history, and `reel case-study keep` refuses a history that
  holds them. The Bob Dylan case study has a runbook for running it on fresh compute.
- **Fixes:** `narrate` finds its sibling scripts in an install path with a space. `retime-frames` no longer prints
  "✓ retimed" when it wrote nothing. A second `review --detach` gives a busy server 15 s before it starts another. A
  guide build keeps pictures another build is still writing. The test runner hands out ports below the range the
  system uses for outgoing connections. `quiz.spec` waits until the video is past the quick check. A mark on the
  frame is live once its thing is in and some of it shows, not once its last line or row is (a terminal's run held
  it back to the scene's last seconds). A guide carries the words of plan.md's open questions section and any words
  before its first section, so `guide --check` passes on every plan. `npm run bundle:check` serves the bundle it is
  given again (a relative folder was read twice). Play on the poster plays, instead of opening the guide of a mark
  under it, and a click on a marked thing that fills most of the frame pauses the video (only its label opens the
  guide).
- **Cleanup:** removed the unused `theme-tokens`, `motion-coverage` and `rebuild-narration` scripts, `frame-lint
  --expect-stage`, and the guide's unread step pictures. Code written two or three times now has one helper.
  Comments and docs say what the code does now. The skill and style guide no longer cite reelplanning's own decision
  numbers, which would mean other decisions in another repo. The glossary new repos get no longer describes the
  ten-in-a-row rule, which is gone.

- **The plan guide.** Behind each plan's video, a page that shows more than the video can and that you work with,
  built from `plan.md` (the one source, D-244) by `reelplanning guide <video-dir>`, which `build` runs and checks:
  each step's cases with their traces, its whole interface (a try-it for its flags), its example, its decisions and
  its question; after the build, each kind of change with every line of it from git, each file whole with its
  changed lines marked, and the runs saved in `runs/`, whole. Things to do, each checked against the plan or the real
  run: drag each case onto what happens, put a trace in order, fill in what a command prints, predict a question's
  option, sort the files by kind. A scene's `- guide: <part>` opens that part over the paused frame, as a detail
  opens (a click on it during a question, too: D-246); each part opens the full page at its place, and "Watch this
  moment" goes back to the video. Highlight any words to comment, suggest an edit or ask. An explainer's source
  marked `needsPart` gets a part: the source itself, whole. `reel check` holds a plan written from 2026-09-30 to the
  four blocks (Cases, Interface, Example; Decisions generated), and `reel record` files a suggested edit under
  "Edits to apply", with the scenes it rebuilds (the guide only, when none says it). Never committed (D-213).
- **Explain first.** A video of what is already there, before any plan: `reelplanning explain "<what you asked>"
  <source> …` pins the sources that hold the answer (a file or a folder, a range of commits, `worktree`,
  `since:<date>`, `pr:<n>`, `ci:<run-id>`, `this-session`, a decision) in `.reelplanning/explainers/<date>-<slug>/`,
  each by its shape and size, with no list of kinds (D-250). `build` runs `check-sources`: a quoted line its source
  does not hold, an unpinned source, a secret, an email address or a home path stops it. Finish ends an explainer's
  review with Done, Explain more or Plan this; nothing goes into the decision log. `reel new-plan --from` starts a
  plan from it, and `reel prereqs` lists it first (D-248). Fresh eyes add a fact check where a source is far longer
  than the video. The review page has an Explainer row: the commit it explains, and how many have landed since.
- **The guide under the video** (D-264, superseding D-228). The review page shows the open video's guide under its
  player, on the same page: scroll down to read it, and the video shrinks to a small player in the corner (a slim bar
  on a phone) that keeps playing, with play/pause, the time and the way back up; scroll back and it is back in its
  place. It is never replaced. "Watch this moment" seeks that player; a marked thing on the frame scrolls to its part
  of the guide, pausing the video, the part lit a moment; notes and questions in the guide go into the same review. A
  plan's Guide link opens its video with the page down at its guide.
- **Highlight anything in the guide.** Let go of a selection anywhere in it (prose, a heading, a table cell, a diff's
  lines, a run's output, a caption, a diagram's label), or click a labelled shape or a line's number, and the box a
  mark on the video opens pops up beside it: the same look, keys and words, the quote above; Suggest an edit and Ask
  are in it. Kept, the words stay highlighted, and the note sits in the review's list with the video's marks, labelled
  with its section and step (a click goes to it), goes with Finish, and `reel record` files it under its step with the
  quote. A phone's selection docks the box at the foot; `N` opens it with the keyboard; the page opened on its own
  keeps notes the same way and exports them.
- **Answer in the frame.** Each option card and the question open into more detail; a choice is judged
  on its card. The answer band grows up over the frame and never cuts text; the video never resizes.
- **A size control** for the video: Fit, smaller down to 40% (drag, corner handle, or `-` / `=`), and
  zoomed past Fit up to 200%. Remembered per browser.
- **Words you can follow.** What a viewer sees and hears uses plain words (a choice, a label, a
  chapter, a scene; D-127) while files and commands keep theirs. A terms panel (`G`) and underlined
  terms; ids never shown alone; "Walk me through it" after a wrong quick check; a "Before you watch"
  card from `reel prereqs`. `build` runs `check-terms` before the voice.
- **Fewer, better stops.** The choices that stop in a step share one stop (an off-plan change keeps its
  own); a late fix stops only choices sharing its label. `reel audit` warns past 12 choices and fails a
  step with five and no question about it in `plan.md`.
- **Better visuals.** Scenes show the real thing (the brief picks which), with the theme's
  `code-diff` and `terminal-run` blocks and a written motion language; the review page's type and
  colour are fixed up, with its fonts shipped.
- **Tool names shown one way.** `.reelplanning/names.md` lists how each name is shown: a tool's name
  (`reelplanning`, `reel audit`, `git`) is lowercase in code markup, in captions and on screen; others
  (GitHub, Kokoro) take their own case. `check-terms` warns on one shown otherwise.
- **Details in the frame.** A frame marks the thing a detail page explains (`data-detail="<name>"`);
  once it has landed, a click on it opens the page over the frame, and the corner chip is only for
  frames with no mark. `frame-lint` checks the marks; `reelplanning detail restyle <video-dir>` brings
  pages built earlier to today's look.
- **The guide in the player** (the plan guide, prototype v5). What a beat opens over the frame is a part of the
  video's guide ("Guide · step 2"); its header has "Open the full guide", the video's full guide page beside it
  (`<video>/guide/index.html` in a bundle, made from its parts when the video has no guide of its own), whose
  "Watch this moment" goes back to the player at that time; the plan's row has Guide beside Plan | Built. Words
  selected in a part open a note box on them (comment, suggested edit on plan text, Ask, answered in the box and
  kept with the review's questions); the detail pages' bridge is v2 (`select`, `size`), and `detail restyle`
  brings it to older pages. While a question is up, a click on a marked thing opens its part and closing it
  brings the question back as it was (D-246).
- **Contributing with several people.** `reel pr-check` says whether a pull request needs a
  walkthrough video (choices or size, D-214) and what it carries; `reel renumber` moves a branch's
  decisions after the ones that landed first when `decisions.json` conflicts on a rebase. A
  `CONTRIBUTING.md`, a pull request template, `config.json`'s `maintainers`, and a CI workflow (not yet
  run on GitHub); the skill copies their templates into a repo that takes contributions.
- **Jargon found by the build.** `check-terms` finds words a viewer may not know that have no meaning
  in the glossary (acronyms, code, technical compounds): a warning, failing on `terms_check: strict`
  (D-216, D-217). A word stays underlined until you know it (D-218).
- **Quick checks later, on a new case** (D-197 to D-199): `check-terms` warns on a quick check right
  after the beat that explains it, or on that beat's own example.
- **Captions show spoken forms written** (`/work`, not "slash work"), and the size control steps 5% up
  to Fit, 25% past it.
- **Tests:** `npm test` runs the fast specs; `npm run test:full` runs every spec, sharded, in about 5
  minutes.
- **`reel check` judges a plan by the ledger it was approved under:** decisions recorded later no longer
  fail an approved plan (a plan approved in conversation dates from its walkthrough's start commit).
  `reel stops` gives each ask outside the plan's steps its own stop instead of one "step ?".
- **Maintainers by id.** `config.json`'s `maintainers` lists the id `reel record` prints (or an email);
  `owner` still matches, with a warning, since anyone's own review page calls them owner.
- **Player fixes:** the caption code chip is solid and full size; own words on the frame hold two lines
  and scroll; answering on the frame never covers the frame's own words or puts "Full question" inside a
  diagram; `?part=N` opens at that part on a slow network too.
- **Removed:** the uncalled `check-dark` and `render-dark` scripts; the worked examples' full renders
  (71 MB; their chapters stay) and `packages/player/design/`.
- **Licensed under Apache-2.0** (was ISC in `package.json`, with no license file), and a short
  `.github/SECURITY.md`: what reelplanning adds to an agent run, and how to report a problem.
- **Walkthroughs that help.** The walkthrough video shows the change running, before and after, in about
  two minutes: the real page, or a real run (the saved file, a command's output); `build` says it is long
  past 3 minutes. It pauses only for an off-plan change or a choice you'd notice or can't easily undo
  (`reel stops`: the labels `visible` and `hard-to-undo`; no count, no ten-in-a-row rule); every other
  choice is one list at the end (`- autonomy_list:`), each with a Flag, and Go on or Approve logs the rest
  as listed, not judged: a later plan is not warned by them. A quick check comes only where the change
  has something to predict (a saved file or a command's output counts), just before the scene that runs
  it; the review ends on one open question, "Seeing it run, anything you'd change?", in Finish. A pull
  request needs the video over 300 lines or for a choice you'd notice or can't easily undo; its other
  choices are lines under "Other choices" in its text, which `reel pr-check` waits on until a maintainer
  ticks them accepted. The review page shows each plan on one row with a **Plan | Built** switch, which
  the header carries too and which lands on the same step (the walkthrough's running scene, or "Nothing to
  run for this step"); every plan waiting on you comes first (its row says what: plan to review,
  walkthrough to review), older plans fold behind "Earlier plans (N)", and names wrap instead of being cut.
  While a question is up, the captions stay hidden behind its answer row, met again after going back too. Each
  verdict carries `shownAt`, when its pause began; `reel memory`'s new `after-build` line says how long
  a pause held you, the flags and words, and reviews sent before the video could play through; three
  timed walkthroughs that all miss the bar (5 s and some words) make `reel status` say a plan to drop the
  walkthrough video is due.
- **Videos that make sense.** Before a video reaches you, `reelplanning fresh-eyes` has two fresh agents look at
  it with only what a viewer gets (each scene's narration and a picture of it at rest, through the review page): a
  newcomer lists what it could not follow, from what the video had shown by then and what viewers were lost on
  before; a designer what breaks the style guide's seven frame rules. Every finding is answered under it (fixed, a
  meaning, or kept with the reason) and `verify` stops on one that isn't (D-225); at most three rounds, and what is
  left is said on "Before you watch" and in the notification. Every new video gets it, a rebuild of an older one
  too, and the system video was checked now (D-227). Rounds belong to a build: a rebuild starts a new set (the last
  kept in `fresh-eyes/build-<n>/`), whose agents look at the scenes it changed, with their neighbours for context,
  and Before you watch lists that build's kept findings only; `--all` for the whole video. Each agent writes one
  file, at the absolute path its prompt names, and `--check` refuses one written anywhere else.
  **Ask about this** (`Q`): paused on a scene, ask in your own
  words; the answer comes from the plan, the glossary and the scene, and says where from: on a hosted page from
  Claude (the page declares `sample`), on your machine from the session waiting on the page (`inbox answer`),
  otherwise with your review (D-226). Questions are kept in the review, listed in `reviews/<id>.md` and counted in
  `reel memory lost`. `frame-lint` fails empty bars standing where words go and anything within 40 px above a
  detail's thing; the stage templates hold words.

## 0.2.0 (2026-09-25)

Everything since 0.1.0. The skill now pins `npx -y reelplanning@0.2.0`.

### Breaking changes

- **Reviews live in `reviews/`.** Each review is filed once as `<plan-dir>/reviews/<plan|walkthrough>-<time>.json`,
  never overwritten, with `reviews/<id>.md` beside it saying what to act on. That replaces
  `annotations.json`, `walkthrough-annotations.json`, `plan.resolved.md`, `walkthrough.resolved.md`
  and the `*-scope.json` files. Move an existing repo with `reelplanning migrate-reviews [<dir>] [--dry-run]`:
  it files every old review, including earlier rounds it finds in git history, and removes the old
  files. Running it twice changes nothing.
- **`resolve-plan` and `resolve-walkthrough` are removed.** `reel record <plan-dir> <review.json>` files
  the review, adds its decisions and judged calls to the ledger, and writes the `reviews/<id>.md`.
- **The GitHub Action is gone.** `reel init` no longer installs `.github/workflows/reelplanning-revise.yml`,
  and nothing writes the `plan.resolved.md` it triggered on. Delete the workflow from repos that have it.
  A review now goes to the local review server, which hands it to a waiting session or starts your
  agent headless (below).
- **No plan `README.md` checklist.** `reel new-plan` no longer writes one. `reel status` works out each
  plan's stage from its files, `reviews/` and the ledger.
- **The player's handoff is two lines**, not three: `reel record <plan-dir> ~/Downloads/annotations.json`
  reads the download where it is.

### Review player

- Answer on the video itself: click the frame's option cards, answer in a thin band inside the frame,
  and the video never resizes. Answers can be edited in place.
- After a revise, the player says what changed, marks it on the timeline and plays just the changes
  (a toggle plays the whole video). A revised video starts a new review round.
- Arrow keys scrub. Answered questions come back when you revisit them. A quick check can be
  disagreed with, and a missed one is marked apart.
- Marks can be selected, erased and edited. "Explain this more" on a plan question asks for more
  without recording a decision.
- Deep dives: an Open chip on a frame opens an HTML detail beside the video, and comments made there
  point at the right beat. The plan text beside the video is off until you turn it on.
- Autoplay across parts; copy any one answer; a calmer page with one line of controls.
- Fixes: a Play pressed while narration is loading is no longer dropped; sound works in the Claude
  desktop app.

### The loop and headless runs

- `reelplanning review` is a review server: Finish, then Send, files the review in `.reelplanning/inbox/`.
  A session waiting on `reelplanning review --wait` picks it up; with none waiting, the server starts
  the command in `.reelplanning/config.json` (`agent.command`) once. `--detach` keeps the server running
  after the session ends.
- The default command is Claude Code in auto mode inside its sandbox, with a hook that refuses file
  writes outside the repo. `git commit` runs outside the sandbox so commits stay signed. Where the
  sandbox can't run (a root container, native Windows) the run goes ahead with it off and says so.
  Codex and opencode commands are documented, untested.
- `reelplanning notify`: a desktop notification when a run ends, with what is waiting.
- Reviewing the system video changes the system: `reelplanning system-review` sorts each comment for
  the agent.

### Walkthroughs

- Only the calls a reviewer might overturn stop the walkthrough video; the rest are grouped at the end
  of each part. `reel stops <plan-dir>` shows which stop and why.
- `reelplanning code-check <plan-dir> --base <ref>` writes a brief for a second agent to check the diff
  against the plan and the ledger; `reel audit` reads its findings.
- Details (deep dives): `reelplanning detail new <video-dir> <name> --kind <kind>` from six templates
  (explore, try, evidence, table, code, fresh); `reelplanning check-details` checks them.

### Memory

- Every recorded review carries who reviewed it and the reelplanning version.
- `reel status` ends with at most five lines of what your reviews show (recommendations taken, own
  words, rewinds, wrong quick checks, misses), and says when a retro is due.
- `reel memory [<repo>] [<id>] [--you]` prints those lines or the evidence behind one. `--you` works
  across repos from `~/.reelplanning/you.jsonl` (`REELPLANNING_HOME` moves it).
- A call of a kind that was recently missed stops the walkthrough.
- `reel retro` starts a retro plan listing the evidence, with proposed skill edits to fill in.

### The CLI

- `reelplanning build <video-dir>` (also `reel build`) runs narrate, sfx, timings, holds, retime,
  finish-project and verify, one line per stage. `rebuild-narration` is now an alias for it.
- `reelplanning narrate` voices only the lines that changed and keeps the rest (one edited line: about
  30 s instead of 11 minutes). A killed run keeps the lines it already voiced.
- New commands: `build`, `narrate`, `notify`, `inbox`, `system-review`, `code-check`, `detail`,
  `check-details`, `migrate-reviews`; `reel stops`, `reel memory`, `reel retro`, `reel build`.
- `reel check` reads steps as `### Step N` with a dash, en/em dash or colon, and no longer asks a plan
  to cite its own decisions.
- `reelplanning` forwards SIGINT/SIGTERM/SIGHUP to the command it runs, so stopping a background
  `review` leaves no orphan.
- The review page bundle shares fonts and GSAP across videos and copies every asset a frame points at.

### Skill and style guide

- `SKILL.md` and the style guide are rewritten at about half the length.
- A length budget: plan and walkthrough videos aim for 3 to 5 minutes, the system video 5 to 8.
- The skill covers running the loop, reviewing the system video, the second agent's code check, and
  the quick-check rule.

## 0.1.0

The first version number: `npx reelplanning` runs every script from the npm cache with your repo as
the working directory, and `npx skills add` installs the plan-to-video skill.
