# Reference

The details behind the [README](../README.md): how to work on reelplanner itself, the commands behind each step, and how each piece is checked. The README says what the workflow is; this page says how each piece of it runs.

Layer names (L0–L4) come from the [original plan](./history/original-plan.md): L0 is HyperFrames' faceless-explainer skill run bare, L1 adds the style guide, L4 is the review player with its decisions (L4b) and the revise loop. The first test of L0 against L1 is [spike 01](./history/spike-01-baseline.md); where things stand today is [status](./status.md).

## What a video project contains

Each directory under `videos/` is one HyperFrames project, kept as a worked example and self-contained: `STORYBOARD.md`, `SCRIPT.md`, `compositions/frames/*.html`, `index.html`, `plan-map.json`, `assets/voice/NN.mp3` (each line's narration, which `index.html` and `audio_meta.json` point at), `snapshots/contact-sheet.jpg`. No `.wav` and no render is committed (D-305): `narrate` keeps a line from its mp3 and writes a newly voiced one as mp3, and `renders/` (the linear `renders/video.mp4`, the chapters cut from it) is rebuilt, never kept. `l1-upload-resume` is the style-guide run from [spike 01](./history/spike-01-baseline.md) (the specs play it); `l2-upload-resume` (brownfield) and `g1-bob-dylan-site` (greenfield) are the reference plan videos; `w1-upload-resume` is the walkthrough; `r1-review-page` is this repo's own review page, planned as a video (no render kept; `controls.spec` plays it).

## Install

Three commands, once per machine. The package is not on npm yet (`npm view reelplanner` says 404), so for now
the tooling installs from GitHub:

```bash
npm i -g github:ncrispino/reelplanner                                  # the tooling: `reelplanner` and `reel` on PATH
reelplanner setup                                                      # the tools the pipeline shells out to (--dry-run to see first)
npx skills add "$(npm root -g)/reelplanner" --skill plan-to-video -g   # the skill: it asks which agents (add -y for every agent)
```

`reelplanner setup --hosted-voice` in place of the second line skips the local voice (Kokoro, about 840 MB of
models, Python 3.10+, whisper.cpp) for the hosted one; see `setup` below.

Then, in an agent session in the repo you want to plan for, start a plan ([agents](./agents.md#starting-a-plan)).
The skill writes its commands as `$RP`, which means `reelplanner` when `reelplanner --version` works (the install
above), and the npm package pinned in `SKILL.md` only when it does not: the package is not on npm yet, so install it
as above. Every command reelplanner shows you (the review page's lines after an export, `--help`, setup's hints)
is written the same way, from one setting (`RP_COMMAND` in `scripts/lib/env.mjs`).

- **The tooling.** npm downloads the repo, packs the files `package.json` lists (there is no build or `prepare`
  step) and installs the dependencies. The download is the repo's files at that commit, its example videos included
  (about 64 MB compressed, measured October 2026: no voice file or render is committed, D-305). Where npm's global folder belongs to root, run it with `sudo`, or set a prefix of your
  own (`npm config set prefix ~/.npm-global` and put `~/.npm-global/bin` on your PATH). The public repo,
  `ncrispino/reelplanner`, is the release's tree as one commit (D-310; [releasing](./releasing.md#going-public));
  until it is up, install from a clone of the development repo instead: `npm i -g --install-links <clone>`, or
  `npm pack` in it and `npm i -g ./reelplanner-<version>.tgz` (or `npm install && npm link`, as below; `npm i -g
  <folder>` alone links the folder without its dependencies).
- **`setup`** installs ffmpeg, a WebP encoder where ffmpeg has none (`cwebp`: Homebrew's ffmpeg is built without libwebp, and the guide's pictures are WebP), `unzip` on Linux (HyperFrames unpacks Chrome with it), a headless Chrome (`hyperframes browser ensure`), Kokoro TTS (`pip`), whisper.cpp (built into HyperFrames' own cache, no root) and HyperFrames' skills at the pinned tag. It skips what is there, so re-running is cheap. `setup --dry-run` shows what it finds and what it would do, and which narration engine `narrate` will use ([Narration engines](#narration-engines)). With local narration (no hosted engine set), setup then times one sentence through Kokoro + whisper (at most 30 s) and says whether that is fast enough here; if it is slow, it says how to switch to the hosted voice ([Is local narration fast enough here?](#is-local-narration-fast-enough-here)). The hosted voice's setting and key go in `~/.reelplanner/.env` (this machine, every repo: `REELPLANNER_TTS=openrouter` and `OPENROUTER_API_KEY=…`), or per repo in `.reelplanner/.env` ([Choosing an engine](#choosing-an-engine)).
  **The local voice is optional.** Kokoro, its models (about 840 MB, once) and whisper.cpp are only for local narration, and Python 3.10+ only for Kokoro. When narration here is hosted (those two lines, read as `narrate` reads them: the shell, the repo's `.reelplanner/.env`, `~/.reelplanner/.env`, or `config.json`), setup skips all three and the speed check, in one line (`✓ local voice: skipped — narration is hosted (openrouter, from ~/.reelplanner/.env); …`). `setup --hosted-voice` skips them before the lines are there and prints the two lines and the next step (it still succeeds: the choice is not a failure); `setup --local-voice` installs them anyway. A hosted voice timed by local whisper (`"timings": "local"`) keeps whisper.cpp. Narrating locally without them later stops `narrate` before it starts, naming both ways on. Steps that need root (ffmpeg from apt) use sudo only as root, with passwordless sudo, or from a terminal; otherwise setup prints the command to run yourself and exits 1.
- **The skill** comes from the package just installed (the same files as this repo's `skills/`) through [`npx skills`](https://github.com/vercel-labs/skills); `npx skills add ncrispino/reelplanner …` would clone the repo's default branch instead. `-g` installs it for your user, not one project. It asks which agents to install to; `-a claude-code` (repeatable) names them instead, and `-y` with no `-a` takes every agent the skills CLI knows (about 55 folders, and what an agent running the install needs: with no terminal the question cancels the install). It lands in `~/.agents/skills/plan-to-video` (read by Codex, Cursor, Amp and other agents) and is linked into each other agent's folder, e.g. `~/.claude/skills/plan-to-video`. A "Failed to install" line for an agent that takes no global skills is harmless. From a clone, `npx skills add <the clone's path> --skill plan-to-video -g` does the same.
- **Once it is on npm,** nothing goes on your PATH: the skill runs every command as `npx -y reelplanner@<version>`, pinned in `SKILL.md`, so each skill version runs the exact tooling it was written for. `npx` caches the package; paths are always relative to your working directory, and nothing is written into the cache. Then the install is `npx skills add …` and `npx -y reelplanner@0.2.0 setup`.
- **To remove it:** `npx skills remove plan-to-video -g` (and HyperFrames' skills setup added: `npx skills ls -g`
  lists them), `npm rm -g reelplanner`, and `rm -rf ~/.cache/hyperframes` (HyperFrames' cache: Chrome, the voice
  models and, on Linux, whisper.cpp). `~/.reelplanner/` holds the hosted voice's key and your review summaries.
- **From reelplanning,** its name until October 2026 (D-312): `npm rm -g reelplanning`, then install as above (npm
  stops at `EEXIST` before that: both packages have a `reel` command). The plugin under the old name: `/plugin
  uninstall reelplanning@reelplanning` and `/plugin marketplace remove reelplanning`, then add it as above. The old
  names are still read for a while: a repo's `.reelplanning/` when it has no `.reelplanner/` (each command says so,
  once; `git mv .reelplanning .reelplanner` renames it, and a `.gitignore` line naming it needs the new name too),
  `~/.reelplanning` while there is no `~/.reelplanner` (once there is one, a command names the old one's `you.jsonl`
  or `.env` it no longer reads, with the `mv` that moves them), a `REELPLANNING_*` setting, in the shell or a `.env`, when
  its `REELPLANNER_*` name is unset, and the `reelplanning` command, which says the new name and runs it. A review
  begun on the page before the rename keeps its marks (the page's saved keys kept their names).
  ffmpeg, `unzip` and the pip packages (`kokoro-onnx`, `soundfile`) are left; a repo's `.reelplanner/` is its own.
- `scripts/release/install.sh` runs the same commands, for `curl -fsSL https://raw.githubusercontent.com/ncrispino/reelplanner/main/scripts/release/install.sh | sh`: the skill, then the tooling from npm when npm has the version and from GitHub when it does not, then `setup`. `REELPLANNER_VERSION`, `REELPLANNER_SOURCE` (a local path works), `REELPLANNER_GITHUB` and `SKILLS_AGENTS` override its defaults.

**On Codex** ([agents](./agents.md)): its sandbox has no network, so install the package globally (above) and run
`reelplanner setup` outside the agent, or start Codex with the network on, `codex -c
sandbox_workspace_write.network_access=true`.

`reelplanner --help` lists every command, and `--help` after any of them says what it takes. `reelplanner reel …`
(or `reel …`) keeps the project record; `reelplanner hyperframes …` is the HyperFrames CLI at the version
reelplanner pins. Below, `reelplanner` and `reel` mean those: the global install, `npx -y reelplanner@0.2.0` once
it is published, or the linked commands of a checkout.

## Working on reelplanner itself

[CONTRIBUTING.md](../.github/CONTRIBUTING.md) has the steps and the test commands. In short:

```bash
git clone <your fork> && cd reelplanner
npm ci
npx playwright-core install chromium         # the player specs' browser
npm link                                     # `reelplanner` and `reel` on PATH, running this checkout
reelplanner setup                            # system tools and HyperFrames' skills (--dry-run to see first)
npx skills add ./ --skill plan-to-video -g   # this checkout's skill into your agents
npm test                                     # the fast specs, headless (Playwright + Chromium), side by side: a few minutes
npm run test:full                            # every spec, exhaustive (what a release runs), answer-on-frame in 4 shards: about 5 minutes
```

A skill installed from `./` is a copy of the checkout at that moment: re-run the `skills add` after editing `SKILL.md`, or add `-a claude-code --copy` and symlink `~/.claude/skills/plan-to-video` to `skills/plan-to-video` yourself to edit it live. The installed skill still runs `npx -y reelplanner@<version>`, the published package; to try unpublished tooling through it, `npm pack` and run the commands with `npx -y --package "$PWD/reelplanner-<version>.tgz" reelplanner <command>` (a bare `npx -y ./reelplanner-<version>.tgz` fails on npm 10), or use the linked `reelplanner` directly. Releasing: [`releasing.md`](./releasing.md).

The public repo (D-310) is built, never pushed, by `node scripts/release/make-public.mjs [<public-remote-url>] [--ref HEAD] [--out <dir>] [--author "Name <email>"]`: a fresh repo in a scratch folder whose `main` is one commit, `reelplanner <version>`, holding exactly the ref's tracked tree (`git archive`, checked object for object), tagged `v<version>`. It refuses a tree holding a `.wav`, `.mp4` or `renders/` path, adds one line to `.reelplanner/README.md` saying the commit ids the record cites name the development history (which is not public), and prints the pack size and the `git push` the owner runs. Run in October 2026: 3392 files, a 57 MB pack, in about 30 seconds. This repo keeps its full history; no voice file or render is committed (`reel pr-check` fails a PR that adds one). The steps around it: [releasing](./releasing.md#going-public).

## Verify a video (the same gates the workflow uses)

```bash
reelplanner verify videos/l1-upload-resume             # lint → check → snapshot contact sheet
reelplanner verify videos/l1-upload-resume --render    # …then render renders/video.mp4
```

`check` runs HyperFrames' lint, a headless runtime validation (JS errors, missing assets, contrast), and a layout inspection across the timeline. `snapshot` writes `snapshots/contact-sheet.jpg`, one tile per frame midpoint, which is what you look at before rendering. To watch a video in the browser without rendering: `cd videos/<project> && reelplanner hyperframes preview`.

## Fresh eyes before you watch

The agent that writes a video knows what every phrase means, so it cannot judge whether a newcomer follows it.
`reelplanner fresh-eyes <video-dir>` (on a built video) writes what two fresh agents get, as `code-check` does for
the code (D-001): `fresh-eyes/newcomer-brief.md` and `designer-brief.md`, with a picture of each scene at rest
(its last moment, taken through the review page, so the player's Open tab, chips and captions are in it) under
`fresh-eyes/shots/`. The newcomer gets each scene's narration and picture, the glossary, the meanings this video
gives its own words, the recap lines of the videos it leans on, and what viewers were lost on before (from the
repo's reviews: words looked up, "Explain this more", answers and notes like "wdym", checks missed, questions
asked on the page); nothing from the plan. The designer gets the pictures, the narration, and the seven rules of
the style guide's §5 ("A frame a newcomer can read"). The session building the video launches each as a fresh agent with no
context of its conversation (in Claude Code a subagent or `claude -p`; in Codex `spawn_agent` with `fork_turns:
"none"`, or `codex exec -C <scratch> --skip-git-repo-check -s workspace-write --add-dir <video-dir>/fresh-eyes`), with
exactly `fresh-eyes <video-dir> --prompt newcomer` or `--prompt designer`, and nothing else, from a scratch folder of
its own outside the repo; each writes one numbered finding a line (`- N1 · scene 4 · "the list": …`) to the one absolute
path its prompt names, `fresh-eyes/newcomer.md` or `designer.md`, and no other file.

The author answers each under it: `- Answer: fixed: <what changed, where>`, `meaning: …` (a meaning a viewer can
click, in the glossary's "Other words" or the storyboard's `terms:`), or `kept: <the reason>` (D-225). Then the
video is rebuilt and `fresh-eyes` runs again for a second look, at most three rounds (a new round keeps the last
in `round-<n>/`, and never starts while a finding has no answer). `verify` (so `build`) runs
`fresh-eyes <video-dir> --check`: a finding with no answer, a kept with no reason, or a meaning that isn't there
stops it, and so does this round's findings file found anywhere else in the repo (it is not read from there); no
run yet, or scenes changed since the agents looked, is a △ line. What is left after the third round (the findings
kept) is said on the page's "Before you watch" and in the notification. Without `playwright-core` the pictures are
the frames alone (HyperFrames' snapshot), and the briefs say so.

Rounds belong to a build: the three are per build. A build is what `plan-diff` compares the video against, its last
commit (`changes.build` in `plan-map.json`: that plan map, hashed; `first` when there is none). Rebuilding between
rounds keeps it; a video built again with nothing changed since its commit is that build (its `changes` kept); a
video committed before its fresh eyes were done is built with `build <video-dir> --against <the commit before it>`. On a
rebuild, `fresh-eyes` moves the last build's rounds to `fresh-eyes/build-<n>/` and starts round 1; the briefs then
hold only the scenes `plan-diff` says changed (edited, added or restyled), each with the scene before and after it
marked context only, and a finding on a context scene is out of scope (named by `--check`, not counted, needing no
answer). "Before you watch" lists this build's kept findings only, never an earlier build's. `--all` looks at every
scene on a rebuild too, for the rest of that build.

## The guide behind a video

`reelplanner guide <video-dir | plan-dir | explainer-dir> [--check] [--out <file>]` builds a video's guide from
its sources: `plan.md` (each step's four blocks: Cases with a Trace column, Interface with a `#` meaning a line,
Example; Decisions from the ledger), the plan map, and after the build `walkthrough.md` (`**Commits:**`,
`## Categories of change`, `#### Interface as built`), git and `runs/`; an explainer's `sources.json` (a source
marked `needsPart`). It writes `<video-dir>/guide/index.html` (the full page), `guide/<part>.html` (each part the
player opens over the frame: `step-<n>`, `decisions`, `what-changed`, a category's id, `choices`, `source-<id>`) and
`guide/parts.json`, none committed. `build` runs it after the plan map, and again with `--check` after verify.
A scene opens a part with `- guide: <part>[#<place>]`, marking its thing `data-detail="<part>"`. `--check`
fails what the page drops or makes up, a layer with no visible way in, the narration said again, an error, the
network or a sideways scroll at 375 px, and lists every gap without failing. The page answers a reader's questions in
order, in plain words (`.reelplanner/plans/2026-09-28-plan-guide/guide-clarity.md`): what it is and why (the title's
promise, an `**In one sentence:**` line when the files have one, the problem's quote, an "In short" of the page: what
each step lets you do, from its `**You can now:**` line in `walkthrough.md`), what you can do now (each step with its scene's picture and a saved run), how to try it (the commands that ran, then those
named), what the agent decided alone (the choices worth a look first), what needs you, what isn't done (with what the
code check raised), and only then the code, each part's diff behind "See the code"; what the files are too thin to say
is listed as what the plan should add.
Each step also carries what the video cannot (D-265), from `plan.md`, `walkthrough.md` and either one's
`## For the guide` section (`### For step N — …` a step; `scripts/lib/guide/depth.mjs`): its **diagrams**, fenced
` ```diagram ` blocks drawn at build time as inline SVG by `scripts/lib/guide/diagram.mjs` (no library at run time; a
wide and a phone layout, labels as real text in the page's inks, light and dark; a click on a node goes to its section
or its file's diff; "Step through it" lights one edge at a time; each has its words folded under it); its **worked
examples** (`#### Worked examples`, a `##### <case>` each: Input, What happens, Output from `runs/`, Edge cases,
Predict, Before/After), shown as tabs with the real output a click away; and its **depth** (any other `####`: why,
alternatives, what breaks it, limits, files and commands), folded. The builder adds diagrams made from structure: the
steps and what each needs, each part of the change's files and which imports which, and how the parts use each other;
and on "What needs you", where the video stops for you on its timeline. The format:

```
flow: <title>                     (or sequence:, state:, compare: with before: <caption> / after: <caption>)
a -> b: a few words | a sentence  (-> an edge, --> sometimes, -x refused there)
a (file) -> b                     (kinds: file, store, person, check, page, step)
a = Its label | #section-id       (or a file of the change, or step-2: where a click goes)
note a, b: …                      (a sequence's note)
[*] -> Draft: …                   (a state diagram's start; `X -> [*]` its end)
```

`reel check` warns (never fails) on a new plan's step with no diagram or no Example; `guide --check` lists a step with
no diagram or worked example, and fails a diagram it cannot draw and an example naming a run `runs/` does not hold.
After a revision a plan's guide marks what changed, as the player marks changed scenes (`scripts/lib/guide/revised.mjs`):
each part of `plan.md` (a step's words, a case, its interface, example or other block, a question, the decisions in
force, any other section) whose words differ from plan.md as git had it when the last plan review was watched (its
first play, else its time; with no review, the previous version in git) gets a quiet "Changed since your review", a
"What changed" fold (the words taken out and put in, and what the review said there, quoted), a line in In short, and
"Show only the changes" at the top (off by default). Spacing and case are no change, as in `plan-diff`; `--check`
fails a changed part left unmarked and a mark on one that is the same.
On the review page the open video's guide sits under its player (D-264, superseding D-228): `guide/index.html?embed=1`
in a frame as tall as the window (`<reelplanner-guide>`; the embed block at the end of `templates/guide/guide.js` has
the messages). Scrolled to, the video goes on in a small player in the corner (a slim bar on a phone); a marked thing,
the chip or `O` scrolls to its part there instead of opening it over the frame; "Watch this moment" seeks the player.
The record's bar stays at the window's foot while the guide is read (the small player sits above it); pulled up, it
covers the guide and the small player, and Hide (`Esc`) puts it back.
Highlight anything in the guide and the video's note box pops up beside it (`packages/player/guide-review.js`): the
mark box's look, keys and words, with the quote above; Suggest an edit (on the plan's own words) and Ask are in it.
Text is selected (prose, headings, table cells, a diff's lines, run output, captions, a diagram's SVG text); a
labelled thing (an SVG shape or group with `aria-label`, `<title>` or `data-label`, a picture's alt) or a diff line's
number is clicked; `N` opens it with the keyboard. Kept, the words stay highlighted (CSS custom highlights: nothing
on the page moves) and the note is the review's own, `via: "guide"` with `detail.where` (its section and step) and
`detail.text` (the quote): listed with the video's marks (a click goes to it), sent by Finish, filed by `reel record`
under its step, pointing at the quote. Opened on its own, the page keeps them the same way, and Your notes exports
them as `annotations.json`.

## Review a video and annotate it (the L4 player)

In any repo: `reelplanner review videos/<project>` packs the player with the video into a temporary folder, serves it on `127.0.0.1` and opens the browser. This is what the agent runs when a video is ready. The page also carries the videos it builds on ("Before you watch": the system video, the explainer or plan it starts from) that are built in the repo's `.reelplanner/`, so their links play there, at the chapter named; one not built yet, or not in this repo, says so on its row. What the page keeps in the browser (your comments and answers, what you watched) is kept per repo, so two repos reviewed on the same port never share it; your settings (sound, size, quick checks, marks) are the same on every page. `--no-open` only prints the URL, `--port` picks the first port to try, and `--out` keeps the bundle somewhere you choose. `--detach` runs the server as a process of its own that outlives the session that started it (it records itself in `.reelplanner/inbox/.server.json` and logs to `inbox/server.log`); a second `--detach` reuses it, and `--stop` stops it. Send works in a repo with no set-up `.reelplanner/` too (a quick video): the server keeps that repo's inbox, `.server.json` and `server.log` in this machine's `~/.reelplanner/inbox/<repo-key>/` instead, so nothing is added to the repo, and `review --wait` there finds it; with no agent command, a review no session is waiting for stays there until one runs `review --wait` or `inbox`, which the page says. The page offers **Download annotations.json** only where no review server takes the review. When a headless run it started on a review exits, the server rebuilds its page and tells the reviewer the video is ready (or that the run stopped short, with its log): the run's own shell is sandboxed (D-082) and cannot reach the server, so `--detach` from inside such a run only says so. After Send, a line above the video follows the review (waiting, working, done or stopped, with the time since Send) from `GET /api/review/status?id=<id>`, which reads the inbox and claim files; when it is done and the video was rebuilt, "The new version is ready" offers **Watch what changed**, a reload into just the changes.

Before it starts a headless run whose command turns Claude Code's sandbox on, the server checks once, with no model call, that the sandbox can work here: on Linux it runs `true` through bubblewrap as the sandbox does, including the nested user namespace of its seccomp step; on macOS, under `sandbox-exec`. (`failIfUnavailable` misses this case: in a container running as root, every shell command in the run fails with `apply-seccomp: write /proc/self/uid_map: Operation not permitted`.) If the check fails, the run goes ahead without the sandbox (the owner's call: do more rather than hold a review back): the server starts the command with `sandbox` in its `--settings` replaced by `{"enabled":false,"failIfUnavailable":false}` (a settings file is read and passed inline), so neither the command nor a sandbox in the user's own settings stops the start; auto mode, `--permission-prompts none` and the file-tools hook are kept. Its shell commands are then not fenced to the repo; its file writes still are, by the hook. The server says so once when it starts (`△ unattended runs here go ahead without Claude Code's sandbox: this machine can't run it (…); shell commands aren't fenced to the repo, file writes still are (the hook)`, repeated by `--detach`), sends one notification at the first such run, records `sandbox: "off: …"` in the review's claim, and the local page's Finish panel says it in its line about what Send will do (`unsandboxed` in `GET /api/review`). To keep a fence there instead, add `"enableWeakerNestedSandbox": true` to the sandbox in `agent.command`'s `--settings`: the check is skipped and the sandbox runs sharing the container's `/proc`, which weakens its isolation but still fences the shell.

The sandbox fences shell commands only; Claude Code's file tools (Write, Edit, NotebookEdit) go through its permission system instead, and in auto mode an edit outside the working directory goes to the classifier, which allows it when asked. So the command's `--settings` also carries a `PreToolUse` hook on `Write|Edit|MultiEdit|NotebookEdit`: a few lines of `node -e` (exec form, no shell) that resolve the path (symlinks included) and refuse it, with exit 2 and a reason Claude reads, when it is outside `$CLAUDE_PROJECT_DIR`, the repo the run starts in. It names no path, so the committed command works in any clone, and it is inline, so the run cannot edit it. Permission rules cannot express this: rules are checked deny, then ask, then allow, so `Edit(//**)` in `deny` also denies the repo whatever `allow` says; a `!` carve-out only reaches relative rules, which match only inside the working directory; and `additionalDirectories` grants, it does not fence. Checked by `scripts/test/loop.spec.mjs` (the hook fed inside and outside paths) and by real `claude -p` runs: a Write inside a scratch repo succeeded; Writes to `/tmp/…` and `$HOME/…`, and one from a subagent, were refused by the hook; a shell write and an Edit inside the repo worked.

With no folder, `reelplanner review` opens the whole repo: the system video and every plan's video and walkthrough video. **Videos** at the top of the page opens the library: what needs you first, then the system video and the five newest plans, the rest behind **Earlier plans (N)**. Each plan is one row, its short name, its date, one word for what waits and on whom (plan to review, walkthrough to review, questions to answer; building, revising, fixing; approved) and a **Plan | Built** switch where both videos are on the page (one link where one is, "not on this page" where none is); every plan waiting on you is under **Needs you**, its video on the page or not; the page's header carries the same switch for the video open, and it lands on the same step: **Built** opens the walkthrough at that step's running scene, **Plan** the plan video at that step, and a step the walkthrough runs nothing for says "Nothing to run for this step". The same bundle, published as a Claude Artifact with `db`, is one page for reviewing everything, and each review it sends names its own plan folder. The player also has a mute button (`M`), remembered per viewer like the theme and the speed.

**Ask about this** (`Q`, or the Ask button; D-226): paused on any scene, you type a question in your own words and
it is answered in the side panel from the plan, the glossary and the scene's narration and frame, each answer
ending with where it came from. On a hosted page Claude answers (the page's `sample` capability, on your own
Claude account, asked the first time); on your machine the agent session waiting on the page answers
(`reelplanner inbox answer`); anywhere else, or with nobody waiting, the question goes with your review and is
answered in the next version. A plain caption word clicked opens it too, with that caption quoted, and an underlined
word's card says "Still unclear? Ask about this". Every question is kept in the review (`questions`), listed in
`reviews/<id>.md`, counted in `reel memory lost`, and given to the next video's newcomer.

**Quick checks on or off** (the Quick checks switch in the controls row, Stop at quick checks under Steps, or `K`):
on by default. Off, the video does not stop for them: a check that is a scene of its own is skipped as it plays and
faded on the timeline, and one asked over another scene does not open. Remembered per viewer; `?checks=off` (or `on`)
sets it for the page, and `checks: off` in a video's BRIEF.md front matter (carried into `plan-map.json`) ships it with
them off, the viewer's choice winning. The review records `checks: "off"`: a check left unanswered then counts as
neither wrong nor missed (`reel memory`), and Finish does not bring up missed checks.

**The record** (the bar at the window's foot; pulled up, Steps, Decisions and Comments): each comment's time goes to
it on the video (the video back in its place if it was small, paused there, the comment named on the frame a
moment); a drawn mark's row selects it on its frame; a comment on the guide's words names its place, which goes to
it in the guide. **Marks on or off** (the Marks switch beside Clear, or `V`): your marks drawn on the frame and your
comments' short coral strokes on the timeline (a click on one goes to it), shown by default; off hides them on the
video only (the record still lists them, and a tool on draws them), remembered per viewer (`rp:marks`). **Your last
review**: after the video was rebuilt since a review was sent, that round is archived (the next one starts clean)
and the record lists it, read-only: its comments, answers, a quick check you said works otherwise, a choice of the
agent's you flagged or changed, each going to where it is in this version (the same scene, the same question still
asked, its part of the guide) or saying it is not in this version.

In a clone of this repo you can also serve the whole checkout:

```bash
npm run review            # serves the repo on http://127.0.0.1:8787 and prints the review URL
```

Open `http://127.0.0.1:8787/packages/player/?project=videos/l1-upload-resume`. `<reelplanner-player>` wraps HyperFrames' own `<hyperframes-player>` and adds a drawing overlay (freehand / arrow / box), pause-and-type notes, a step gallery built from `plan-map.json` (thumbnails from `snapshots/`), **Finish review** (a verdict: Approve, or Request changes, offered first when the review has comments), then Send (or Download, as `annotations.json`, where no review server or hosted page takes the review). Every annotation carries `t`, the frame it landed on, and a plan anchor: the frame's `planStep` from the plan map plus whatever `data-plan-step` / `data-plan-question` / `data-plan-component` element the stroke crossed in the composition DOM. `plan-map.json` is produced by `npm run plan-map -- videos/<project>` from the storyboard's `plan_step:` / `plan_questions:` tags.

The player is tested headlessly against built projects (`npm run test:full` runs every spec in `scripts/test/` and `packages/player/test/`; `npm test` runs the script specs and the player's core ones, answer-on-frame on one question of each kind; the runner, `scripts/test/run.mjs`, says its options at its top, and any spec still runs alone with `node <spec>`). The first ones: it loads the composition offline (local HyperFrames runtime via `srcdoc`), draws a stroke, checks the export; pauses at a decision, plays only the chosen branch, skips to the resume point; picks a knowledge level and skips the frames it does not need, answers a quiz wrong and gets the correction, flags an autonomy call as a step-anchored annotation.

## Other agents

reelplanner is meant for any coding agent, and most of the loop does not care which one runs. It is tested with
Claude Code, has basic support for Codex, and is untested elsewhere: [`agents.md`](./agents.md) has the table, and
the open work a contributor can pick up for each agent.

**Which command:** `reel init` writes `agent.command` for the agent it runs inside (Claude Code sets `CLAUDECODE`,
Codex `CODEX_THREAD_ID`), else the first of `claude` and `codex` on PATH, else none, and prints what it picked;
`--agent claude|codex|none` picks another (`scripts/lib/agents.mjs`, checked by `scripts/test/init.spec.mjs`).

**Works with any agent:** the skill (installed for the agents you pick in `npx skills add`); every `reelplanner` and `reel` command; the local review page and its Finish panel; the inbox and `review --wait`; the review server starting `agent.command` on a review when no session waits (the prompt is appended as the last argument, with no shell, and names no Claude-only tool: `codex exec <prompt>` and `opencode run <prompt>` take it the same way); and the notifications, which the server sends itself when the run ends.

**Claude Code only:** the hosted review page (a claude.ai Artifact: only a Claude session can read its store; other agents use the local page); auto mode and `--permission-prompts none`; the `sandbox` settings in `--settings`, the check the server runs before starting such a run (and turning the sandbox off where it can't run), and the file-tools hook. The server probes only a command that turns Claude Code's sandbox on through `--settings`; any other command is started as it is and never changed, and nothing about the sandbox is said for it.

**Their own fences:** Codex has its own approval and sandbox modes. `reel init --agent codex` writes `codex exec -s workspace-write -c sandbox_workspace_write.network_access=true --color never`: it writes only inside the repo and the temp folder, never asks (approval is `never` for `exec`; `-a` and `--full-auto` are rejected by codex-cli 0.160.0), and has the network on so `npx` can fetch the package (drop that `-c` once the package is installed globally). Its sandbox keeps `.git` read-only, so the run's commit may be refused: not yet tried end to end. opencode has `opencode run --auto` with `permission` rules in `opencode.json` and no OS sandbox; it is not set up or tested here (D-066).

**Less safe:** reelplanner gives their runs no sandbox and no file-tools hook, so an unattended Codex or opencode run is fenced only by its own flags: less safe than a Claude Code run.

## Decisions in the video (L4b)

Open questions in the plan become decision beats: the video teaches the fork, costs both options, recommends one, and asks. The player pauses there, records the reviewer's call, plays only the chosen branch, and the ending shows the resolved plan. `annotations.json` carries `decisions[]`; `reelplanner reel record <plan-dir> annotations.json` keeps the review in `<plan-dir>/reviews/`, adds the decisions to the ledger, and writes what the agent's revise step acts on beside it (`reviews/<id>.md`). Tested by `packages/player/test/decisions.spec.mjs`.

HyperFrames' skills are pinned. `package.json` pins `hyperframes` (and `@hyperframes/player`) to an exact version, and `reelplanner hyperframes-skills` (run by `reelplanner setup`) installs the skills from that version's git tag with `npx skills add`: the files go to `~/.agents/skills` and are linked into every agent found, so one copy (and one TTS patch) serves Claude Code, Codex and the rest. The pipeline reads whichever installed copy loads (`hyperframes-skills --dir` prints it; `REELPLANNER_SKILLS_DIR` overrides). `hyperframes skills update` and `hyperframes init` would install them from GitHub main instead. On 2026-09-21 main shipped a `media-use` that could not load (see [`upstream/hyperframes-media-fetch-shim.md`](./upstream/hyperframes-media-fetch-shim.md)). `reelplanner hyperframes-skills --check` walks the imports of every skill script the pipeline runs. `finish-project` and `build` run that check first and stop before touching the project, naming the missing file and the fix. To move to a newer HyperFrames, bump both versions in `package.json`, run `npm install` and `reelplanner hyperframes-skills`, then rebuild one video end to end.

Pipeline additions in v2: `reelplanner patch-tts-speed` (Kokoro synthesises at ×1.25 → ~185 wpm; it silently ignores the speed it is handed until `lib/tts.mjs` is patched, and every skills reinstall reverts that, so `reelplanner hyperframes-skills` re-applies it after each install) and `reelplanner captions-sentences` (captions are the script's sentences with whisper timings, not whisper's transcript). The speed is generated, not time-stretched afterwards — a stretched file would be stretched a second time by the player's own speed slider, and two passes on the same audio is what made every setting but 1× sound rough.

## Chapters

Tag a frame with `- chapter_start: <title>` and `plan-map.json` gains `chapters[]` with per-chapter linear and watched seconds. The player lists them, pauses at each chapter end with "Continue", and reports per-chapter completion in the export. `reelplanner chapters videos/<project>` cuts the linear render into `renders/chapters/chN.mp4`; with `--no-checks` it leaves each quick check's scene out, since an MP4 cannot stop for the answer (the system video's chapters are cut this way). The style guide's budget: chapters of about a minute, 3–5 minutes in all for a plan video, about two for a walkthrough video (the change running; past 3 is long), 5–8 for the system video; `reelplanner build` ends with the length against it, as a warning.

## Design: chosen for a reason, checked by a loop

[`design-rationale.md`](./design-rationale.md) gives the reason for every visual choice in the videos (§2) and the review page (§3), and an anti-slop checklist (§4). Both are improved by a generate → critique → fix loop run with subagents (§5): the player specs screenshot the page in its real states (`RP_SHOTS=<folder>` saves `access`, `size` and `answer-on-frame`'s there) and a critic writes numbered findings; `reelplanner verify` makes the video's contact sheets and a critic writes `videos/<project>/DESIGN-REVIEW.md`; fixers apply the findings; the critic confirms. Rules the loop settles go into the style guide and the worker dispatch, so the next build starts from them.

## Host the review player

`npm run bundle` packs the player and the built videos into `dist/review/`: the HyperFrames runtime, the annotation layer, each project's composition, fonts and captions, and the voice track as mp3: transcoded from the wavs (about 6× smaller, which is what keeps three videos inside a hosting size budget), or copied as it is for a video that already plays mp3, as this repo's worked examples under `videos/` do (their narration is committed as mp3; the public history keeps no wav). Nothing is fetched from `node_modules` or the repo root at run time, so the folder can be served from anywhere static. `npm run bundle:check` drives the result headlessly: it loads, pauses at the first decision, takes a branch, records a stroke and exports the annotations. Annotations persist in the viewer's own browser and download as `annotations.json`; `reel record <plan-dir> annotations.json` files that download as a review.

## Getting the review back into the repo

On export the player opens a handoff panel: the exact commands to run, with the plan directory (`plan_dir:` in the storyboard's front matter) already filled in. Published as an Artifact, the same panel leads with **Send this review to Claude** — one click writes the review to the artifact's own store, Claude picks it up with `reelplanner reel-intake`, runs `reel record`, pushes, and marks the row while the reviewer watches it land, on the line above the video as well as in the panel. Nothing leaves the page until that click. Where the page cannot reach Claude the button never appears and the commands are the whole answer. See [`hosted-review.md`](./hosted-review.md).

## The project record (`.reelplanner/`)

Each project we plan for keeps one committed directory: the system's parts and pipelines (`system.json`), the names (`glossary.md`), the look (`theme/`), an append-only decision ledger (`decisions.md`), and every plan with its video under `plans/`. `reel` manages it: `init`, `new-plan`, `stage` (the shared stage from `system.json`), `check` (a plan that touches a part with a rule on it, an owner's answer, must cite the rule or supersede it; a question the ledger has answered is not asked again; an accepted agent call is history, raised only by `--base` when the diff changes the lines its commits wrote), `record` (the review's calls into the ledger), `audit` (walkthrough.md accounts for every step, decision and code-check ✗; once the owner has accepted the walkthrough, what it breaks is a note, not a failure: D-309), `fold` (a part's rules drafted as a section of `spec.md` for the owner's approval, then cited in their place), `status` (with the accepted calls none of whose lines is left: outlived), `rebuild` (below). Format and rules: [`project-dir.md`](./project-dir.md). Examples: `eval/projects/media-service` (brownfield, with a follow-up plan that supersedes one decision) and `eval/projects/bob-dylan-site` (greenfield).

`reel case-study <slug> --prompt <file> [--from <commit>]` sets up a case study: one prompt run three ways (text only, an HTML plan, and reelplanner), each to a finished site, each arm in its own fresh container with a check that it starts empty. `reel case-study report <slug>` builds its page, and with `--publish` refuses until every section is filled. `reel case-study keep <slug> <arm>` keeps an arm's finished site when it ends (D-247): its files as plain files in the arm's `site/`, and its git history beside them as `site.bundle`, checked with `git bundle verify` (`--check` checks every arm); it refuses a history holding a voice file or a render (D-305), which each arm's start keeps out of the site's git (`site.exclude`). Before a long run, `eval/case-studies/kit/smoke.sh` checks the machine makes a video. How to run one: [`eval/case-studies/REPLICATE.md`](../eval/case-studies/REPLICATE.md), and the Bob Dylan one, every arm, on your own machine, in a cloud session or in the container, and on your own machine three commands of `eval/case-studies/kit/arm.sh` (set up and start an arm, note its stages, finish it): [`RUNBOOK.md`](../eval/case-studies/bob-dylan-site/RUNBOOK.md); the write-up's sections: [`TEMPLATE.md`](../eval/case-studies/TEMPLATE.md).

### An earlier version of a video (`reel rebuild`)

`reelplanner review <video-dir>` and `reel record` keep the version of the video they open or record, once per build
(the files git leaves out that nothing makes again go into `.reelplanner/media/`; [what is kept](./project-dir.md#an-earlier-version-built-again)).

```
reel rebuild <video-dir>                                   the versions kept, 1 the oldest, the current one marked
reel rebuild <video-dir> --version <n|build|commit> [--out <dir>] [--no-build]
reel rebuild <video-dir> --keep                            keep the current version now (a review that came another way)
```

`--version` puts that version together in a git worktree of the whole repo at its commit (default
`<tmp>/reelplanner-rebuild/<plan>-<video>-v<n>`; `--out` must be empty or an earlier rebuild), so plan.md, the
ledger, runs/ and the history are as they were; restores its kept files and the fonts the tools ship, each checked by
hash; and runs `reelplanner build` there. It says which scenes, if any, differ from the ones reviewed, what came back
byte for byte, what is made again (the voice, with the recorded voice and speed; it says when this machine's engine is
not the one recorded) and anything it could not bring back. `--no-build` stops after the guide. Then
`reelplanner review <out>/<video path>` opens it, and `git worktree remove --force <out>` removes it. The current
video is never touched.

```
rebuild .reelplanner/plans/2026-09-28-videos-that-make-sense/video, version 1 of 2 (build d41af142f5c5, kept 2026-10-08 by review) → …/video
✓ scenes from commit 4986f17: every file as reviewed (48)
✓ kept files back: 6 byte for byte
✓ 9 file(s) the tools ship (fonts, sounds) back from the tools installed here
· made again: the voice and its word timings (29 line(s), am_michael ×1.25, kokoro-v1.0 + whisper small.en) […]; then by the build: assets/vendor/, guide/, snapshots/
· the voice: kokoro-v1.0 + whisper small.en, am_michael ×1.25, as recorded
▶ reelplanner build …/video
```

## Installing as a Claude Code plugin

```
/plugin marketplace add ncrispino/reelplanner
/plugin install reelplanner@reelplanner
```

Then the tooling and `setup`, as in [Install](#install). This keeps the skill updated through `/plugin`; the skill runs the same tooling either way. The plugin is the skill's folder alone, `skills/plan-to-video` (about 110 KB in `~/.claude/plugins/cache`: `marketplace.json`'s entry is its manifest). Adding the marketplace clones the repository at depth 1, about 170 MB on disk (the worked examples in `videos/` with their mp3 narration, `docs/media/`, and this repo's own `.reelplanner/`; no WAV or rendered MP4 is committed, D-305), as `npx skills add ncrispino/reelplanner` would. The npm package itself is under 1 MB and carries none of them.

## Voice and timing

By default everything runs offline: narration is local Kokoro, word timings are local whisper.cpp, rendering is headless Chrome + ffmpeg. Signing in to HeyGen (`npx hyperframes auth login`) upgrades the voice and adds native word timestamps; nothing else changes. On a small machine local whisper is slow (2–3 minutes a line on 2 CPUs): a hosted engine, below, takes the narration off the machine. `reelplanner narration-check --local` (and `setup`) says whether this machine is one.

## Narration engines

### Is local narration fast enough here?

```bash
reelplanner narration-check --local         # local Kokoro + whisper small.en, one plan-video line, timed
```

It voices one 19-word line as `narrate` does with no hosted engine, times its word timings with whisper small.en,
stops after 30 s, and ends with one line. Fast enough (20 s a line or under):

```
✓ local narration: about 11 s a line here, about 11 min for a plan video (60 lines): fine
```

Slow (over 20 s a line, so a 60-line plan video takes over 20 minutes, and each rebuild waits again on the lines
that changed), or not done in 30 s:

```
△ local narration: over 30 s a line here (one sentence did not finish in 30 s), over 30 min for a plan video (60 lines): slow
  the hosted voice is much faster: a line in 1–3 s, about $0.03 a minute of narration (Deepgram Aura-2 on OpenRouter). To use it:
    put REELPLANNER_TTS=openrouter and OPENROUTER_API_KEY=… in ~/.reelplanner/.env (this machine, every repo; a key from https://openrouter.ai/settings/keys)
    then run: reelplanner narration-check
  local narration still works here, just slower
```

That file is two lines, read in every repo on this machine, with no `config.json` to edit:

```bash
mkdir -p ~/.reelplanner && printf 'REELPLANNER_TTS=openrouter\nOPENROUTER_API_KEY=sk-or-…\n' >> ~/.reelplanner/.env
```

For one repo only, put the same lines in its `.reelplanner/.env` instead ([Choosing an engine](#choosing-an-engine)).

`reelplanner setup` runs the same check when Kokoro and whisper.cpp are installed and no hosted engine is set
(`setup --dry-run` says it would), and skips it, saying so, when either tool is missing. With a hosted engine set,
setup installs neither, nor times anything ([Install](#install)). The first time, it fetches
Kokoro's and whisper's models (about 840 MB, once, not timed). It is advice, never a failure: local narration
always works. Any `narration-check` of local Kokoro with local whisper small.en ends with the same line.

### Choosing an engine

`reelplanner narrate` (and `build`, which runs it) uses HyperFrames' audio engine unless `REELPLANNER_TTS` names
another, or the repo's `.reelplanner/config.json` does. The simple place is this machine's `~/.reelplanner/.env`
(`$REELPLANNER_HOME/.env` when that is set), read in every repo, two lines:

```bash
REELPLANNER_TTS=openrouter
OPENROUTER_API_KEY=sk-or-…
```

```bash
reelplanner setup --dry-run                  # says which engine narrate will use, from where, and which key is not set
reelplanner narration-check                  # one sentence, to hear the voice and check the key
```

With a hosted engine whose word timings are hosted too (every provider's default), nothing in a build runs Kokoro
or whisper: `narrate` voices and times each line through the APIs, `transcribe-missing` re-times a line that came
back without words through the same transcriber (or, for DeepInfra and ElevenLabs, any transcription key that is
set, else local whisper), and the rest of the build reads those timings. So setup skips the local voice
([Install](#install)), and `setup --local-voice` installs it anyway.

The engine line says where its settings came from, e.g. `— from REELPLANNER_TTS in ~/.reelplanner/.env`, and
where the key did (`key OPENROUTER_API_KEY from ~/.reelplanner/.env`); never the key. For one repo only, or a repo
whose videos must keep one voice whoever builds them, set it per repo instead: the same lines in its
`.reelplanner/.env` (left out of the repo by the `.gitignore` `reel init` writes; one made before `reel init` is
kept), or the engine in its `config.json`, committed and so shared:

```json
"narration": { "tts": "openrouter" }
```

That is the one to pick on a small machine: one key, a line in 1–3 s (Deepgram Aura-2, timed by whisper-1, both
on OpenRouter). Kokoro over an API is not recommended: OpenRouter's Kokoro route (to DeepInfra) took 47–125 s a
line when measured, slower than Kokoro on the machine itself. It stays supported only for a video that must keep
the local build's voice.

Then reelplanner's own engine (`scripts/lib/narrate-engine.mjs`, handed to faceless-explainer's `audio.mjs` in
place of HyperFrames' engine, which is not changed) voices each line over HTTP and gets its word timings without
local whisper, 4 lines at a time (`"concurrency"`), retrying on 429 and 5xx. Music and sound effects still come from
HyperFrames' engine.

| `tts` | what it calls | key | default model, voice | word timings | cost (documented) |
|---|---|---|---|---|---|
| `openai` | [`/v1/audio/speech`](https://platform.openai.com/docs/api-reference/audio/createSpeech) | `OPENAI_API_KEY` | `gpt-4o-mini-tts`, `onyx` (or `tts-1`, `tts-1-hd`) | a transcriber (below) | about $0.015 a minute; `tts-1` $15 per 1M characters ([pricing](https://openai.com/api/pricing/)) |
| `openai-compatible` | `{base_url}/audio/speech`, e.g. DeepInfra's `https://api.deepinfra.com/v1/openai` | `REELPLANNER_TTS_API_KEY`, or the variable `api_key_env` names | `model` and `voice` you set; a Kokoro model defaults to `am_michael` | a transcriber (below) | the server's |
| `deepinfra` (not recommended: Kokoro over an API is slow) | [Kokoro-82M](https://deepinfra.com/hexgrad/Kokoro-82M/api), its inference API | `DEEPINFRA_API_KEY` | `hexgrad/Kokoro-82M`, `am_michael`: the voice of a local build | its own (`return_timestamps`) | $0.62 per 1M characters (about $0.001 a minute) |
| `openrouter` | [`/api/v1/audio/speech`](https://openrouter.ai/docs/features/multimodal/tts), mp3 made a wav by ffmpeg | `OPENROUTER_API_KEY`, for the timings too | `deepgram/aura-2`, `aura-2-apollo-en`; `elevenlabs/eleven-flash-v2.5` (George) or another of its speech models with `model` and `voice` (not `hexgrad/kokoro-82m`: slow) | its transcriber, `openai/whisper-1` | Aura-2 $30 and ElevenLabs Flash $20 per 1M characters (about $0.03 a minute with the timings); whisper-1 $0.006 a minute ([models](https://openrouter.ai/models?output_modalities=speech)) |
| `elevenlabs` | [`/v1/text-to-speech/{voice}/with-timestamps`](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps) | `ELEVENLABS_API_KEY` | `eleven_multilingual_v2`, Rachel | its own (character alignment) | per character, from your plan's credits ([pricing](https://elevenlabs.io/pricing)) |
| `kokoro` | local `hyperframes tts` | none | `am_michael` | `local` whisper, or a transcriber | free |

The transcriber (`"timings": "api"`) is an OpenAI-style `/audio/transcriptions` with word timestamps
(`verbose_json`, `timestamp_granularities[]=word`): `"timings_api": "groq"` ([Groq](https://console.groq.com/docs/speech-to-text),
`whisper-large-v3-turbo`, $0.04 an hour, with a free tier; `GROQ_API_KEY`) or `"openai"` (`whisper-1`, $0.006 a
minute; OpenAI's `gpt-4o-transcribe` models return no word timings) or `"openrouter"` (`openai/whisper-1`, the same
price; `OPENROUTER_API_KEY`). With none named, `openrouter` speech is timed by OpenRouter; otherwise Groq is used when
`GROQ_API_KEY` is set, then OpenAI, then OpenRouter. `"timings_base_url"`, `"timings_api_key_env"` and `"timings_model"` point it
at another server. Whatever the transcriber hears, the timings are put on the line's own words, punctuation and all.

- **Keys** go in `~/.reelplanner/.env` (this machine, every repo) or the repo's `.reelplanner/.env` (one repo,
  next to `config.json`; the `.gitignore` `reel init` writes there leaves it out), `OPENROUTER_API_KEY=…`, one a
  line; any variable works there, `REELPLANNER_TTS` too. They are read in this order, the first that sets a
  variable winning: the shell's environment, `.reelplanner/.env`, the nearest other `.env` at or above the video
  (as HyperFrames' engine reads one), then `~/.reelplanner/.env`. Never from `config.json`, and no key is printed:
  the engine line names the file a setting or key came from. `narration-check`, `setup` and
  `narrate` warn when git would commit `.reelplanner/.env` (a `.gitignore` from before that line: add `.env` to it),
  or already holds it. A missing key stops `narrate` before it sends anything and names the variable; a refused one
  stops it with the kept lines put back.
- **A small machine: one key, fast.** `"tts": "openrouter"` with `OPENROUTER_API_KEY` sends both the voice and the
  timings out, so nothing heavy runs locally. Measured with a real key (8 October 2026): Aura-2 answers a line in
  1–3 s, ElevenLabs Flash in under 1 s, and a 12-line video was narrated in 19 s; OpenRouter's Kokoro route took
  47–125 s a line, slower than local Kokoro: don't use it for speed. Pick a voice by ear: `narration-check --keep <dir>`.
- **One key for both**: `"tts": "openrouter"` voices and times with `OPENROUTER_API_KEY` alone. Its speech answers
  mp3 or raw PCM, never a wav, so reelplanner asks for mp3 and ffmpeg makes it a wav; its transcriber takes the wav
  as an OpenAI-style upload (25 MB; about a second a line when measured). Its list of speech models (October 2026) has no OpenAI
  one, though its docs' example names `openai/gpt-4o-mini-tts-2025-12-15`: check a model with `narration-check`
  before a video.
- **Same voice as a local build**: `deepinfra` (or `openai-compatible` at a Kokoro server, or OpenRouter's Kokoro)
  speaks with Kokoro's voices, so a video keeps `am_michael`; slow, so only when that voice matters. A switch to
  another provider's voices takes its default, or `"voice"`.
- **What re-voices**: the provider, its model and where the timings come from are the key's model, so changing any of
  them voices every line again (as a new voice or speed does); `narration.json` records it, e.g. `openai
  gpt-4o-mini-tts + groq whisper-large-v3-turbo`.
- **Speed**: ElevenLabs takes 0.7–1.2 (on OpenRouter too), so 1.25 is said at 1.2. `gpt-4o-mini-tts` is reported to ignore `speed`, so
  the pace is asked for in its `instructions` as well (`"instructions"` sets your own).
- **A slow machine, staying local**: `"tts": "kokoro", "whisper_model": "base.en"` runs Kokoro and a smaller
  whisper through reelplanner's engine (HyperFrames' engine fixes whisper at `small.en`; its files are not
  patched), and `"tts": "kokoro", "timings": "api"` keeps the voice local and sends only the timings out.
- **Checked with a real key**: `openrouter` (Aura-2, ElevenLabs Flash and Kokoro, timed by whisper-1), on
  8 October 2026. The others are checked against fake servers only (`scripts/test/narrate-api.spec.mjs`,
  `narration-check.spec.mjs`), their request shapes following each API's documentation as of October 2026:
  `narration-check` is the check to make before a video.

`reelplanner narration-check` voices one sentence with the engine you name, or with no flag the one `narrate` would
use here, in a scratch folder, and prints a line each: the engine and why, the speech (seconds, length, format), the
word timings (count, the first few, whether they cover the audio), the cost of a minute where this page gives one,
and on a failure the API's status and answer and what to set. It writes nothing in the repo and prints no key;
`--keep <dir>` keeps the wav and the timings, `--local` times local narration ([above](#is-local-narration-fast-enough-here)),
and `--help` lists the flags (`--model`, `--voice`, `--text`, …).

```bash
OPENAI_API_KEY=… GROQ_API_KEY=… reelplanner narration-check --tts openai --timings-api groq
OPENROUTER_API_KEY=… reelplanner narration-check --tts openrouter    # one key for the speech and the timings
```
