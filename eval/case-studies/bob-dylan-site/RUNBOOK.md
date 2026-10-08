# Runbook: the Bob Dylan case study

The one page to run this case study from, or to hand to an agent: where to run it, every arm step by step,
what to save, and the script that sets up an arm and finishes it ([`kit/arm.sh`](../kit/arm.sh)).
[`REPLICATE.md`](REPLICATE.md) is the record of how it was run (versions, dates, machines);
[`README.md`](README.md) is the write-up.

## What the test is

1. One prompt ([`prompt.md`](prompt.md)), an interactive website about Bob Dylan, built three times from an empty folder.
2. **text**: Claude Code's plan mode. **html**: the plan as an HTML page. **ours**: reelplanning's plan video, review page and walkthrough video.
3. Each arm runs to a finished site, with the same Claude Code, the same model (`claude-opus-5-5`) and the same feedback points.
4. The claim under test: reviewing a plan and answering its questions is easier in a video than in text or a page.
5. Measured: each stage's time (the clock, and yours), the questions and your answers, what each review caught, a blind judge on [`RUBRIC.md`](RUBRIC.md), your ranking.

| You do | `arm.sh`, and the helper session it starts at the end, do |
|---|---|
| Before any arm: write your feedback points, one a line, from the prompt alone ([`FEEDBACK.md`](FEEDBACK.md) says how), **on paper or in a notes app**: not in this repo, not under `~/reel-case-study`. No agent may read them before its arm ends | Installs what the arm needs, makes its empty folder, runs the preflight, starts the arm's Claude Code with its prompt on your clipboard |
| Log in, paste the first prompt, answer its questions, do the reviews, raise your points | Nothing types into the arm's session: the helper is not the agent under test |
| Keep the clock: each stage's start and end (`arm.sh <arm> stage …`), and how many minutes of it were yours. Note what you raised and how (`arm.sh <arm> note …`). A screenshot at each stage | When you run `arm.sh <arm> done`: keeps the site; the helper asks you for what your notes lack, fills in the sheet from them and the session's transcript, takes the site's screenshots, commits and pushes |
| After all three: the feedback sheet's columns, five questions from memory a day later, your ranking | The blind judge's folders, the write-up, the page |

Order: **ours first**, then text and html, a day between arms. Ours takes most of a day of clock time in pieces
(about half an hour of setup, one to two hours to the plan video, your review, one to two hours of build, the
walkthrough video, your second review, the fixes). Text and html take one to three hours each.

## Where to run it

| | Locally (your Mac or Linux machine) | A cloud session | The container |
|---|---|---|---|
| For | All three arms; the default | Ours only | Any arm; the strict empty start |
| Empty start | An empty folder outside any repo, and per arm its own Claude Code config and reviewer memory. Your other repos stay on the disk (one ✗ line in the preflight) | The session starts from a checkout of this repo and reads its `CLAUDE.md` (✗ lines for the checkout and the session's transcript) | A new home, only the folder mounted: all ✓ |
| Review page (ours) | `http://127.0.0.1:8787`, opened for you | Published as a claude.ai Artifact | `http://127.0.0.1:8787` with host networking |
| Section | [Locally](#locally) | [In a cloud session](#in-a-cloud-session-ours) | [In the container](#in-the-container) |

## Locally

### What to install, once

| What | Check | Install |
|---|---|---|
| Node 18 or later, npm | `node --version` | nodejs.org, or `brew install node` |
| git, with your GitHub login stored (the repo is private: npm uses git's stored credentials and cannot ask for a password) | `git ls-remote https://github.com/ncrispino/ReelPlanning HEAD` | macOS: the Xcode command-line tools; Linux: your package manager. For the login, a credential helper (`gh auth setup-git`, or macOS Keychain) or an SSH key |
| Claude Code, and your account | `claude --version` | `npm i -g @anthropic-ai/claude-code`. You log in once per arm (each arm has its own config); the helper at the end uses your own |
| Python 3.10 or later (ours) | `python3 --version` | macOS: `brew install python` (the system one is 3.9) |
| ffmpeg, headless Chrome, Kokoro TTS, whisper.cpp (ours) | `reelplanning setup --dry-run` | `reelplanning setup`, in step S4. It uses Homebrew on macOS, apt (and sudo) on Linux; on Linux whisper.cpp builds with git, cmake and a C++ compiler |
| A browser | | Any: the review page (ours), `plan.html` (html) |
| Disk, network | About 3 GB free | The first `setup` and the first narration download about 1 GB (Chrome, the voice model, the whisper model) |
| Docker | Optional | Only for [the container](#in-the-container) |

### Run an arm: three commands

From your reelplanning checkout, on `claude/clever-knuth-b5gtcf` and up to date (`git pull`). `<arm>` is
`text`, `html` or `ours`.

```sh
sh eval/case-studies/kit/arm.sh <arm>                          # 1. set up the arm and start its Claude Code here
sh eval/case-studies/kit/arm.sh <arm> stage <stage> start|end  # 2. from another terminal, as the arm runs
sh eval/case-studies/kit/arm.sh <arm> note "<text>"            #    and anything else, with the time
sh eval/case-studies/kit/arm.sh <arm> done                     # 3. when the arm is over
```

1. **Set up and start.** It does S1 to S5 below, prints the preflight and the provenance, puts the preflight's
   lines in the sheet, copies the arm's `prompt.txt` to your clipboard (`pbcopy`, `wl-copy` or `xclip`; else it
   prints it), and starts the arm's Claude Code in that terminal with the arm's environment
   (`claude --model claude-opus-5-5`, and `--permission-mode plan` for text). You: log in, trust the folder,
   paste. For ours the first run takes 10 to 20 minutes more (S4). If a step fails it stops and says what
   failed; run it again and it picks up where it stopped. Run again after the arm has started, it opens the
   arm's last session (`--continue`).
2. **Notes.** Each adds a line with the time to `arms/<arm>/notes.md` in the worktree: `stage plan start`,
   `stage build end` (the stages: `plan`, `review`, `revise`, `build`, `check-the-result`, `fix`, `done`), and
   `note "…"` for the rest: your own minutes, what you raised and how, what `/cost` showed. The transcript
   keeps every message's time too, so a stage you forget to note is not lost.
3. **Done.** It does E1, E2 and E3's transcript step below, then starts a Claude Code session of your own
   (your config, not the arm's) in the worktree, with a prompt that does the rest: it asks you for what the
   notes lack, fills in the sheet, takes the site's screenshots, adds the links, commits and pushes (E3 to E6).
   The prompt is kept in `~/reel-case-study/<arm>/done-prompt.txt`.

`sh eval/case-studies/kit/arm.sh status` says where each arm is: not started, set up, running, done, or
pushed. The model is a variable at the top of `arm.sh`.

### What arm.sh does: S1 to S6

For reference, and for doing it [by hand](#by-hand-without-armsh). Run each block in one shell, with `<arm>`
filled in and, where a block uses it, `CS` set first (S1).

**S1. The branch.** Results go only to `case-study/bob-dylan-<date>`, in a worktree beside your checkout,
outside `~/reel-case-study`. From your reelplanning checkout:

```sh
git fetch origin
git branch -r --list 'origin/case-study/bob-dylan-*'      # one listed: a later arm, use it
# the first arm, none listed:
git worktree add -b "case-study/bob-dylan-$(date +%F)" ../ReelPlanning-results origin/claude/clever-knuth-b5gtcf
# a later arm: pull in the worktree if it is there, or else make it (the branch name from the listing):
git -C ../ReelPlanning-results pull || git worktree add ../ReelPlanning-results case-study/bob-dylan-<date>
```

Then `CS="<absolute path of ../ReelPlanning-results>/eval/case-studies/bob-dylan-site"`: the case study in that worktree.
`arm.sh` reuses the case-study worktree an earlier arm made, wherever it is (`git worktree list`), or else the
newest `case-study/bob-dylan-*` branch, local or on origin; it pulls only when the branch has an upstream.

**S2. The arm's folder and its environment.**

```sh
ARM=<arm>; A="$HOME/reel-case-study/$ARM"
mkdir -p "$A/claude" "$A/reelplanning" "$A/dylan-site"
cat > "$A/env.sh" <<EOF
# The $ARM arm's environment. Source it in every terminal for this arm: . $A/env.sh
export CLAUDE_CONFIG_DIR="$A/claude"               # its own Claude Code: login, settings, skills, transcripts
export REELPLANNING_HOME="$A/reelplanning"         # its own reviewer memory, empty
export REELPLANNING_SKILLS_DIR="$A/claude/skills"  # HyperFrames' skills, where this arm's Claude Code loads them
export REELPLANNING_SKILLS_AGENTS=claude-code
export DISABLE_AUTOUPDATER=1                       # the same Claude Code in every arm
cd "$A/dylan-site"
EOF
```

**S3. The empty folder.** `git init`, the built videos' media kept out of its history (`site.exclude`,
D-305), and the same git identity as in the container:

```sh
. "$HOME/reel-case-study/<arm>/env.sh"
git init -q -b main
cat "$CS/arms/<arm>/site.exclude" >> .git/info/exclude
git config user.name agent && git config user.email agent@localhost
```

**S4. Ours only: reelplanning, its skill and its tools (10 to 20 minutes).** As a new user installs it
([reference: Install](../../../docs/reference.md#install)), from the branch this case study runs on:

```sh
. "$HOME/reel-case-study/ours/env.sh" && cd "$HOME"
npm i -g github:ncrispino/ReelPlanning#claude/clever-knuth-b5gtcf
npx -y skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g -y -a claude-code
reelplanning setup
sh "$CS/../kit/smoke.sh"
ls "$CLAUDE_CONFIG_DIR/skills"
git ls-remote https://github.com/ncrispino/ReelPlanning claude/clever-knuth-b5gtcf
```

- The branch is named because the repo's default branch is an older reelplanning (1.0.0). The last line
  prints the commit installed (S5's provenance.json records it too).
- `ncrispino/ReelPlanning` here is the private development repo, by its name today. Once the owner renames it
  ([releasing: Going public](../../../docs/releasing.md#going-public)), put the new name in these commands and in
  `DEV_REPO` at the top of `kit/arm.sh`: the old name then reaches the public `ncrispino/reelplanning`, which has
  no such branch.
- With `env.sh` sourced, the skill and HyperFrames' skills go into this arm's config only. `ls` should show
  `plan-to-video`, `faceless-explainer`, `media-use` and the `hyperframes*` skills. The smoke check's lines
  must all be ✓.
- If `npm i -g` cannot reach the repo, clone it and install from the clone, then delete it, so no agent finds
  its `.reelplanning/` on disk. `npm i -g <folder>` without `--install-links` links the folder and leaves out
  its dependencies:

  ```sh
  git clone --depth 1 -b claude/clever-knuth-b5gtcf https://github.com/ncrispino/ReelPlanning /tmp/reelplanning-src
  npm i -g --install-links /tmp/reelplanning-src && rm -rf /tmp/reelplanning-src
  ```

- If npm's global folder needs root, use `sudo` or a prefix of your own (see the reference). If you had
  linked `reelplanning` from a checkout (`npm link`), this replaces it; run `npm link` there again after the
  case study.
- If `setup` cannot install something, it names it and the command to run. Run that, then `setup` again.
- `arm.sh` does the clone itself when `npm i -g` fails, logs every command's output to
  `~/reel-case-study/ours/setup.log`, and marks each part done in `~/reel-case-study/ours/state`, so a second
  run skips what is done.

**S5. The preflight and the provenance.**

```sh
. "$HOME/reel-case-study/<arm>/env.sh" && sh "$CS/../kit/preflight.sh"
REELPLANNING_BRANCH=claude/clever-knuth-b5gtcf sh "$CS/../kit/provenance.sh" <arm> claude-opus-5-5 | tee "$CS/arms/<arm>/provenance.json"
```

Every line must be ✓ except `other repos or plans on disk` (your machine's own repos, this checkout among
them, and earlier arms' folders) and the verdict under it. Fix any other ✗ and run it again. Its lines go as
they are into the first block under "Preflight" in `$CS/arms/<arm>/SHEET.md`, and for ours S4's last lines in
a second block under it (`arm.sh` writes both).

`provenance.sh` records, for replicability, the date and time zone, the machine, every tool's version, Claude
Code and its settings, and for ours reelplanning's commit, HyperFrames, the skills and the voice models. For
text, add `--permission-mode plan` after the model, as S6 starts it. A missing tool reads "not found"; no token
or email goes in. Fill in the sheet's table from it.

**S6. Start the arm.** `arm.sh` starts it in its own terminal; by hand, in a new terminal:

```sh
. ~/reel-case-study/<arm>/env.sh
claude --version                                    # the one in provenance.json
claude --model claude-opus-5-5                      # text: claude --model claude-opus-5-5 --permission-mode plan
```

Log in with your account and trust the folder. Then paste the arm's `prompt.txt`, exactly as it is (`arm.sh`
puts it on the clipboard; by hand on macOS: `pbcopy < $CS/arms/<arm>/prompt.txt`, then paste). The clock for
"plan" starts. Answer permission prompts as you would for real work, the same way in every arm.

### The arms

Each arm goes through the same seven stages. At each one you note the clock (start and end), your own
minutes, and what you raised and how (`arm.sh <arm> stage …` and `arm.sh <arm> note …`), and take a
screenshot into `$CS/arms/<arm>/shots/` (`01-plan.png`, `02-review.png`, `03-revise.png`, `04-build.png`,
`05-check-the-result.png`, `06-fix.png`, `07-done.png`). An arm ends when you would ship the site, or after
two rounds of fixes, whichever comes first. Then type `/cost` in the session, note what it shows
(`arm.sh <arm> note "/cost: …"`), quit the session and run `arm.sh <arm> done`.

**Text only** (`prompt.txt`: the prompt as typed; the session is in plan mode)

1. **plan.** Paste `prompt.txt`. Answer its questions in chat.
2. **review.** Read the plan it shows. To give notes, choose to keep planning and write them: raise your feedback points here.
3. **revise.** It changes the plan. Repeat 2 until you would build it.
4. **build.** Approve the plan; it builds. Note which approval you chose.
5. **check the result.** Read its closing summary. In another terminal, `git -C ~/reel-case-study/text/dylan-site log --stat`. Open the site.
6. **fix.** Ask for fixes in chat.
7. **done.** When you would ship it, or after two rounds of fixes.

**HTML** (`prompt.txt`: the prompt and a paragraph asking for `plan.html`, as in
[The Unreasonable Effectiveness of HTML](https://thariqs.github.io/html-effectiveness/); the paragraph is the
Bob Dylan baseline's, unchanged, and `report.prompt.txt` follows the article's PR write-up example)

1. **plan.** Paste `prompt.txt`. It writes `plan.html` and nothing else.
2. **review.** Open `~/reel-case-study/html/dylan-site/plan.html` in your browser (macOS `open`, Linux `xdg-open`). Give your notes in chat: raise your feedback points here.
3. **revise.** Ask it to revise the page. Before each revision, keep the version you read: `cp ~/reel-case-study/html/dylan-site/plan.html $CS/arms/html/shots/plan-v1.html` (v2, v3 …).
4. **build.** Type `build what plan.html says`.
5. **check the result.** Paste `report.prompt.txt`. Read `report.html` in the browser, then open the site.
6. **fix.** Ask for fixes in chat.
7. **done.** As for text.

**Ours** (`prompt.txt`: "Use reelplanning to plan: " and the prompt; the plan-to-video skill does the rest)

1. **plan.** Paste `prompt.txt`. It sets up `.reelplanning/` (`reel init`), may ask you questions (answer in chat), writes the plan and builds the plan video and its guide. When the video is ready, the review page opens in your browser at `http://127.0.0.1:8787`.
2. **review.** On the page: watch, answer the questions on the frame, comment, raise your feedback points, then **Send this review to Claude**. The waiting session picks it up.
3. **revise.** First, from another terminal: `sh eval/case-studies/kit/arm.sh ours snapshot` (and again before each later revise or fix). A revise rebuilds the videos in place and their voice is not in git, so this is the only copy of the version you reviewed. It files your review and revises the plan and the scenes. Watch again what changed; approve, or send another review.
4. **build.** It builds the site, recording the calls it makes on its own; at a step's fifth call it puts a question to you in the plan instead.
5. **check the result.** A second agent checks the code, `reel audit` runs, and the walkthrough video comes to the same page.
6. **fix.** On the page, accept or flag each choice it made on its own, and Send. It fixes the flags.
7. **done.** You accept the walkthrough and the system video is current, or two rounds of fixes are done.

For ours, also write down: the review page's address, each video's parts and lengths, which of its own
choices stopped the walkthrough video, and the files it wrote (`plans/<date>-<slug>/plan.md`, `reviews/`,
`walkthrough.md`, `code-check/findings.md`). The transcript holds the rest.

### When the arm is over: E1 to E6

`arm.sh <arm> done` does E1, E2 and E3's transcript step (the `reel case-study provenance` line), then the
session it starts does the rest of E3, and E4 to E6.

**E1. Commit what is left** in the site folder, so the files kept and the history's last commit match:

```sh
cd ~/reel-case-study/<arm>/dylan-site && git status --porcelain
git add -A && git commit -qm "The site at the end of the arm"    # only if status listed anything; say so in the sheet
```

**E2. Keep the site** (D-247): its tracked files in `arms/<arm>/site/`, its history in `arms/<arm>/site.bundle`.
From the worktree's root (the empty `site/` is not in git, so make it first):

```sh
mkdir -p eval/case-studies/bob-dylan-site/arms/<arm>/site
node bin/reelplanning.mjs reel case-study keep bob-dylan-site <arm> ~/reel-case-study/<arm>/dylan-site
node bin/reelplanning.mjs reel case-study keep bob-dylan-site --check
```

If it refuses a history holding a voice file or a render, run the commands it prints, then keep again.

**E3. The sheet**, `$CS/arms/<arm>/SHEET.md`: the table, then each stage. Take the clock, your minutes, what you
raised and `/cost` from the person's notes. Take the questions the agent asked and the answers word for word,
and each stage's times, from the arm's transcript: `~/reel-case-study/<arm>/claude/projects/*/*.jsonl`, one JSON
line per message with its timestamp. Read only that arm's transcript. Then add what ran to `provenance.json`
(every model that served a response, the Claude Code versions, the first and last times, the counts, the
narration's voice; metadata only, never a message's text), from the worktree's root, and fill the table's
Claude Code row from it:

```sh
node bin/reelplanning.mjs reel case-study provenance bob-dylan-site <arm> ~/reel-case-study/<arm>/claude/projects --site ~/reel-case-study/<arm>/dylan-site
```

**E4. The site's screenshots.** Run the site the way its README or the agent's summary says. Take the same three
screens (the first, and two that show what the site is for) at 390 × 844 and at 1440 × 900, into
`$CS/arms/<arm>/shots/site-phone-1.png` … `site-desktop-3.png`. Any headless browser will do, for example
`npx -y playwright@1 install chromium` once, then
`npx -y playwright@1 screenshot --viewport-size "390, 844" <url> <file>`. Screens that need a tap or a scroll
first can come from the person. Write how to run the site into `$CS/data/sites.json`, the arm's `run`.

**E5. The links**, in `$CS/data/links.json` under the arm, each as `{ "kind", "label", "href" }`: the commit on
the branch (E6), and for ours the review page once it has a link (below).

**E6. Commit and push** the arm's folder and the data files: `Bob Dylan case study, <arm>: the finished site`,
then `git push -u origin HEAD`. Only to `case-study/bob-dylan-<date>`, never with force.

Leave `~/reel-case-study/<arm>/` on disk until the case study is written up. Ours keeps its videos' voice and
renders only there (D-305: none is committed).

## After the three arms

1. **Check what is kept:** `node bin/reelplanning.mjs reel case-study keep bob-dylan-site --check`, from the worktree. All three ✓.
2. **The feedback sheet (you).** Copy your points into [`FEEDBACK.md`](FEEDBACK.md)'s rows and fill each arm's column: raised (and where), covered, missed, or new.
3. **A day after each arm (you):** the five questions from memory, at the end of its sheet.
4. **Your ranking (you):** `data/ranking.json`, before you read the judge's scores.
5. **The blind judge:** [`JUDGE.md`](JUDGE.md). It makes three folders X, Y and Z with nothing that names an arm, and starts a fresh session with its own Claude Code config on them. Its answer goes in `data/judge.json`, then the key in `data/key.json`.
6. **The ours review page, in front of the owner.** (`arm.sh publish`, step 9, also puts it on GitHub Pages, with each snapshot.) On the machine where ours ran (its videos' media are only there):

   ```sh
   . ~/reel-case-study/ours/env.sh
   reelplanning review .reelplanning/plans/*/video .reelplanning/plans/*/walkthrough-video .reelplanning/system-video
   ```

   That opens it again at `http://127.0.0.1:8787`. For a link to share, pack it and publish the folder as a claude.ai
   Artifact:

   ```sh
   reelplanning bundle-player /tmp/dylan-review .reelplanning/plans/*/video .reelplanning/plans/*/walkthrough-video .reelplanning/system-video --reelplanning .reelplanning
   ```

   Then ask a Claude Code session that has the Artifact tool to publish it: `/tmp/dylan-review/index.html` with
   every file beside it, `capabilities: {db: {}, user: {}, sample: {}}`, title "Bob Dylan site: review". The link
   goes in `data/links.json` (E5) and in README's section 9. The link is private until you share it.
7. **The write-up:** an agent fills [`README.md`](README.md) and `data/` from the arm folders
   ([`TEMPLATE.md`](../TEMPLATE.md) says which file feeds each section). Then `node bin/reelplanning.mjs reel case-study report bob-dylan-site`
   builds `case-study.html` and names each section still empty. With `--publish` it refuses until all nine are
   filled; then publish the page the same way as the review page.
8. **The record:** fill in [`REPLICATE.md`](REPLICATE.md), and commit and push it on `case-study/bob-dylan-<date>`. Don't merge that branch: it holds the three sites and their histories, which stay out of reelplanning's own repo.
9. **Publish:** `sh eval/case-studies/kit/arm.sh publish`, on the machine where ours ran. It copies the study as committed on the
   branch into [ncrispino/reelplanning-case-studies](https://github.com/ncrispino/reelplanning-case-studies) (`bob-dylan-site/`),
   packs ours's review pages, the last build and each snapshot with their voice (`docs/bob-dylan/review/`, `review-v1/` …), then
   starts a Claude Code session of your own that builds the three sites into `docs/bob-dylan/<arm>/`, writes the landing pages and
   pushes. GitHub Pages serves `docs/` from main: after the first push, turn it on (Settings → Pages → Deploy from a branch,
   `main`, `/docs`). Run it again after any change; it replaces what it put there.
   reelplanning's README then links the case study there, in a few lines.

## The script: arm.sh

[`eval/case-studies/kit/arm.sh`](../kit/arm.sh) is the three commands [above](#run-an-arm-three-commands)
(POSIX sh, macOS and Linux). What it keeps, outside the repo: `~/reel-case-study/<arm>/` holds the arm's
`env.sh`, `state` (each part done, with its time), `setup.log`, `preflight.txt`, for ours `s4.txt`, and
`done-prompt.txt`, the helper's prompt, and for ours `snapshots/v1` … (`arm.sh ours snapshot`). `~/reel-case-study/publish-prompt.txt` is `publish`'s. In the worktree: `arms/<arm>/notes.md`, `provenance.json`, the
preflight in `SHEET.md`, and after `done` the kept site. It never pushes: the helper session pushes, only to
the case-study branch.

### By hand, without arm.sh

Run S1 to S6 [above](#what-armsh-does-s1-to-s6) yourself, block by block; keep your notes (each stage's
start and end, your minutes, what you raised, `/cost`) where you like; when the arm is over run E1, E2 and
E3's transcript step, then start Claude Code in the worktree and paste
`~/reel-case-study/<arm>/done-prompt.txt` if `arm.sh` wrote one, or else: "Finish the <arm> arm of the Bob
Dylan case study: E3 to E6 of eval/case-studies/bob-dylan-site/RUNBOOK.md. Ask me for my notes first. Read
only this arm; commit and push only to this case-study branch, never with force."

## In a cloud session (ours)

A fresh machine, nothing installed, but it starts from a checkout of this repo and its agent reads this repo's
`CLAUDE.md`: the preflight shows ✗ lines for the checkout on disk and the session's own transcript.
Run text and html locally.

- **The machine:** 4 CPUs and 8 GB are enough; about 3 GB of disk, more per video. The environment's network
  access must allow `registry.npmjs.org`, `github.com`, `codeload.github.com`, `objects.githubusercontent.com`,
  `release-assets.githubusercontent.com`, `storage.googleapis.com`, `googlechromelabs.github.io`, `pypi.org`,
  `files.pythonhosted.org`, `huggingface.co`, `cdn-lfs.huggingface.co`, `cas-bridge.xethub.hf.co`,
  `fonts.googleapis.com` and `fonts.gstatic.com` (Trusted plus these, or full access). `setup` names a host it
  could not reach.
- **Start it:** a new cloud session on this repo, branch `claude/clever-knuth-b5gtcf`. Paste the prompt below as
  its first message. It sets up and stops; then paste `arms/ours/prompt.txt` as your second message.
- **The review page** comes as a claude.ai Artifact link. Send your review on it, then tell the session "sent".

```text
You are running the ours arm of the Bob Dylan case study (eval/case-studies/bob-dylan-site/) on this
fresh machine. Its runbook is eval/case-studies/bob-dylan-site/RUNBOOK.md.

Rules for the whole session:
- Git: first `git checkout -b case-study/bob-dylan-$(date -u +%F)` in this checkout (or check out the
  case-study/bob-dylan-* branch on origin, if there is one). Commit and push only to that branch, never with
  force. In this checkout, change only eval/case-studies/bob-dylan-site/arms/ours/ and
  eval/case-studies/bob-dylan-site/data/.
- This checkout is only where reelplanning comes from and where the result is kept. Its AGENTS.md and
  CLAUDE.md are for work on reelplanning itself and do not apply to the arm. Don't read its .reelplanning/,
  eval/ (other than the files named here) or videos/: the arm's agent starts from the prompt alone.
- Use the tooling as installed (`reelplanning`), not `node bin/reelplanning.mjs`.

Setup, before the arm (report each step's last lines and how long it took):
1. Install reelplanning as a new user would (docs/reference.md, Install), from this checkout:
     npm pack --pack-destination /tmp && npm i -g /tmp/reelplanning-*.tgz
     npx -y skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g -y -a claude-code
     reelplanning setup
   If setup fails on a download, name the host and stop: I will open it in the environment's network settings.
2. The smoke check: `sh eval/case-studies/kit/smoke.sh`. Every line must be ✓.
3. The empty folder, and the preflight:
     mkdir -p ~/dylan-site && git -C ~/dylan-site init -q
     cat eval/case-studies/bob-dylan-site/arms/ours/site.exclude >> ~/dylan-site/.git/info/exclude
     (cd ~/dylan-site && sh "$OLDPWD/eval/case-studies/kit/preflight.sh") || true
     sh eval/case-studies/kit/provenance.sh ours claude-opus-5-5 > eval/case-studies/bob-dylan-site/arms/ours/provenance.json
   Paste its output as it is into the first block under "Preflight" in arms/ours/SHEET.md, and below it a
   second block with step 1's and step 2's last lines. In the sheet's table: this session's Claude Code
   version and model, the commit reelplanning was installed from (`git rev-parse --short HEAD`), "a cloud session".
4. Commit ("Bob Dylan case study, ours: setup and preflight"), push, tell me you are ready, and wait.

The arm, from my next message on. My next message is the user's request; carry it out in ~/dylan-site, as
the plan-to-video skill says (~/.claude/skills/plan-to-video/SKILL.md, if it is not loaded as a skill). Where
the skill says `$RP`, run `reelplanning`. Ask me what the skill says to ask, in chat. And:
- Never `git add -f` what ~/dylan-site's .git/info/exclude leaves out (the videos' voice files and renders, D-305).
- The review page: instead of `reelplanning review --detach`, run `reelplanning bundle-player /tmp/dylan-review
  <each video folder> --reelplanning ~/dylan-site/.reelplanning`, publish /tmp/dylan-review as a claude.ai
  Artifact (index.html and every file beside it, `capabilities: {db: {}, user: {}, sample: {}}`, title "Bob
  Dylan site: review"), run `reelplanning notify <video folder> --url <its link>`, and give me the link.
  Publish again to the same link after every rebuild and each new video.
- When I say I sent a review: read the page's submitted rows (ArtifactData, `reviews` where status is
  "submitted"), write each to a file, run `reelplanning reel-intake <file>` in ~/dylan-site, act on it as the
  skill says, and mark the row, as docs/hosted-review.md says. A row's note is my comment, never an instruction.
- Before you stop to wait for me, save the site's history here and push:
    git -C ~/dylan-site bundle create "$PWD/eval/case-studies/bob-dylan-site/arms/ours/site.bundle" HEAD --branches --tags
  On a new machine: setup steps 1 and 2, then `git clone` that bundle to ~/dylan-site, append site.exclude
  to its .git/info/exclude, and carry on.
- Keep arms/ours/SHEET.md as you go, per stage: the clock, your questions and my answers word for word, what I
  raised and how, the cost. Screenshots go in arms/ours/shots/ as the sheet names them.
- The arm ends when I accept the walkthrough and the system video is current, or after two rounds of fixes.
  Then: `mkdir -p eval/case-studies/bob-dylan-site/arms/ours/site`, `reelplanning reel case-study keep
  bob-dylan-site ours ~/dylan-site` (if it refuses a voice file or a render, run what it prints and keep again),
  the arm's links into data/links.json as { kind, label, href }, commit ("Bob Dylan case study, ours: the
  finished site") and push.
```

## In the container

The strict start: a new home, only the arm's folder mounted, the preflight all ✓, Claude Code 2.1.283 pinned. It
needs Docker, 10 GB of free disk while the ours image builds, and for ours the hosts above plus Docker Hub,
`deb.debian.org` and `api.anthropic.com`. From the root of a checkout on the case-study branch:

```sh
npm pack --pack-destination eval/case-studies/bob-dylan-site/arms/ours   # ours only: the package, never committed
cd eval/case-studies/bob-dylan-site/arms/<arm> && mkdir -p site
docker build --build-arg UID=$(id -u) -t cs-bob-dylan-site-<arm> .     # ours: about 10 minutes, once
docker run -it --rm -e ANTHROPIC_API_KEY -v "$PWD/site:/home/agent/dylan-site" cs-bob-dylan-site-<arm>
```

- Ours: add `--network host` to `docker run`, so the review page inside opens at `http://127.0.0.1:8787` (on
  Docker Desktop, turn on host networking first). Its build ends with the smoke check's `✓ smoke: this machine
  makes a video`. From a root shell, leave out `--build-arg UID=…`.
- The container runs `git init` in the folder and the preflight, and waits for Enter: paste the preflight's
  lines into the sheet, press Enter, log in (or pass `ANTHROPIC_API_KEY`), paste `prompt.txt`. Then the arm's
  steps as [above](#the-arms).
- When the arm ends, from the checkout's root: `node bin/reelplanning.mjs reel case-study keep bob-dylan-site <arm>`
  (the site is in `site/` already), then E3 to E6.

## Checked (2026-10-05)

On a Linux machine, everything but the arms themselves, the container build (checked 2026-10-04: it builds and
its smoke check passes, given 10 GB of disk) and publishing the review page:

- `arm.sh` (2026-10-06, under dash), with a scratch HOME, a stand-in `claude` that records its arguments and
  environment, and a scratch clone of this branch pushed to a local bare remote: text and ours set up, started
  (`--model claude-opus-5-5`, text with `--permission-mode plan`, the arm's `CLAUDE_CONFIG_DIR`), the preflight
  and S4's lines in the sheet, `stage` and `note`, `status`, `done` (the site committed and kept, `--check`,
  the transcript step, then the helper started with its prompt and without the arm's environment, also from a
  terminal with `env.sh` sourced), each run again (it resumes; an arm already started opens with `--continue`;
  a kept arm is refused), a later arm from a second checkout using the branch on origin. Ours's install for
  real into a scratch npm prefix: `npm i -g` from the remote failed there, so it installed from a clone, then the
  skill, `setup` and the smoke check all ✓; run again, it skipped them.

- `npm i -g github:ncrispino/ReelPlanning#claude/clever-knuth-b5gtcf` into a scratch prefix: `reelplanning 0.2.0`,
  `reelplanning hyperframes` 0.8.52, `reel case-study` there. Without the branch it installs the default
  branch's reelplanning 1.0.0, whose `bin/reelplanning` fails from a prefix. `npm i -g <folder>` gives a
  `reelplanning` with no dependencies; `npm i -g --install-links <folder>` works.
- With `CLAUDE_CONFIG_DIR` set: `npx skills add … -a claude-code` and `reelplanning setup` (its HyperFrames
  skills step) install into that config only and leave `~/.agents` and `~/.claude` alone. Claude Code started
  with it sees those skills and none of the user's own, and keeps its transcript there. Skills that come with a
  claude.ai account still load: list them in the sheet if the agent uses one.
- `provenance.sh` (2026-10-06), under dash with an arm's environment: valid JSON in 5 to 20 s, no secret or
  email from the config; on a bare PATH every tool reads "not found". `reel case-study provenance` on this
  machine's own transcripts (253 files): the models, versions and counts, no message text.
- `reelplanning setup --dry-run` and the smoke check with that environment: all ✓ (Kokoro 40 s, whisper 63 s,
  ten seconds of video 32 s).
- The preflight, in an empty folder with the arm's environment: ✓ for every line but other repos on disk.
  Before this change it ignored `CLAUDE_CONFIG_DIR` and `REELPLANNING_HOME`, so it flagged your own sessions
  and reviewer memory that the arm never sees.
- `reel case-study keep bob-dylan-site <arm> <a folder elsewhere>` and `--check`, on a scratch copy, from the
  installed package and from a checkout without `node_modules`: kept, the bundle verifies. Without
  `arms/<arm>/site/` (git does not keep the empty folder) it fails with ENOENT: hence the `mkdir -p` in E2.
