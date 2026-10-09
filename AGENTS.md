# AGENTS.md

reelplanner turns an implementation plan into a short narrated review video that stops at each open choice,
records the answers in a decision log in the repo, and after the build makes a walkthrough video of what the
agent decided on its own. It is an agent skill (`skills/plan-to-video/`) plus a CLI (`reelplanner`, `reel`).
Tested with Claude Code, basic support for Codex, untested elsewhere: [`docs/agents.md`](docs/agents.md).
Codex and most other agents read this file; Claude Code reads it through `CLAUDE.md`.

## To use reelplanner in another repo

reelplanner is not on npm yet. Install once per machine (Node 22.20+):

```bash
npm i -g github:ncrispino/reelplanner      # puts `reelplanner` and `reel` on PATH
reelplanner setup --dry-run                # what is missing; then `reelplanner setup`
npx skills add "$(npm root -g)/reelplanner" --skill plan-to-video -g -y
# the skill. -y: an agent cannot answer its "Which agents?" picker (stdin is not a terminal, so it cancels with exit
# 1); with -y and no agent named, it installs to ~/.agents/skills and links into every agent the skills CLI knows
# (about 55 folders)
```

- `setup` needs the network and may need sudo for ffmpeg; on Codex, ask the person to run it outside the sandbox.
- Load the skill: `/plan-to-video <plan.md>` in Claude Code, `$plan-to-video <plan.md>` in Codex, or read
  `~/.agents/skills/plan-to-video/SKILL.md`. It also applies when someone asks you for an implementation plan.
- The skill writes commands as `$RP`: the installed `reelplanner` (until reelplanner is on npm, it is installed
  from GitHub, as above).
- The first plan in a repo runs `reel init <repo> --name <name> --kind brownfield|greenfield`
  (`--agent claude|codex|none` picks the headless command for reviews that arrive with no session open).
- `reelplanner --help` lists every command; `--help` after any command says what it takes.

More: [README](README.md) · [install details](docs/reference.md#install) · [lifecycle](docs/lifecycle.md) ·
[the `.reelplanner/` format](docs/project-dir.md).

## To contribute here

Setup, tests and the PR steps are in [CONTRIBUTING.md](.github/CONTRIBUTING.md). In short:

```bash
npm ci
npx playwright-core install chromium           # the player specs' browser
node bin/reelplanner.mjs hyperframes-skills     # HyperFrames' skills at the pinned version (narrate and build specs)
npm test                                        # the fast specs
```

- Run `npm test` and the full run of the specs you touched: `node scripts/test/run.mjs --full <name>`.
  A failing spec is never flaky: find the cause.
- Specs work on scratch copies; never change committed files under `videos/`, `.reelplanner/` or `eval/` from a spec.
- `.reelplanner/decisions.md` and `decisions.json` are the owner's record: `reel record` adds to them; don't
  edit them by hand unless the owner asks.
- Check a PR's text as CI will: `node bin/reelplanner.mjs reel pr-check --base <upstream>/main --body-file pr.md`.
- "reelplanner" is lowercase in code and prose.

reelplanner is planned with reelplanner: its own plans, reviews, decisions and system video are in
`.reelplanner/`, and the plan-to-video skill (`skills/plan-to-video/`) applies here as in any repo.

### Autonomous mode

This repo's video runs are autonomous: each video's `BRIEF.md` says `flow: automation` and
`storyboard: no`. Post the storyboard summary as a heads-up and continue; the one question kept is the
faceless-explainer skill's preview-or-render at its Step 6.

### Tooling from this checkout

Where the skill says `$RP` (the installed `reelplanner`), run this checkout's own tooling instead,
so a plan is built with the code it changes: `node bin/reelplanner.mjs <command>`, or `reelplanner`
after `npm link`. `npm test` runs the fast specs (a few minutes); `npm run test:full` runs every spec, exhaustive.
