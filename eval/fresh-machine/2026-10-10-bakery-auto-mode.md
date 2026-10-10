# A fresh machine, the whole pipeline, in auto mode (2026-10-10)

The README's new-project example, run on a new cloud machine as a new user meets it: Claude Code first, then
the README's Install, then `claude "Use reelplanner to plan a small website for a neighborhood bakery"` in an
empty `bakery-site/`, through every stage of the whole pipeline. The question was whether Claude Code's auto mode,
now its default, stops reelplanner's commands, after `reel init` stopped writing a headless agent command
(the change this run checked) and with no allow rules set.

## The setup

- An EC2 c7i.4xlarge (16 vCPU), Ubuntu 24.04, from `scripts/release/ec2-fresh.sh --shell --type c7i.4xlarge
  --hours 6`: this branch packed and copied over, nothing run.
- As the image's own user: Node 22 from nvm, Claude Code from its installer (2.1.296; Opus 5.5, logged in by
  hand over `ssh -t … tmux attach`), then the README's three Install lines, with `npm i -g` pointed at the packed
  copy.
- Claude Code ran in tmux. An agent watched its screen and transcripts and answered as the person would. The
  reviews were sent from the real review page through an SSH tunnel, by a headless browser standing in for the
  reviewer (no one was at the page).

## What happened

| Stage | Time |
|---|---|
| Install (`npm i -g` 7 s, `setup` 75 s, the skill 1 s) | 83 s |
| Plan, `reel init`, `new-plan`, `check`, and the plan video (6:37, 27 scenes, 3 questions, 3 fresh-eyes rounds) | 45 min |
| The review in (3 answers, 1 comment, Request changes), recorded as D-001 to D-003, the plan revised, 13 of 20 scenes rebuilt | 24 min |
| Approved; the site built (21 tests pass, Lighthouse 100/100 on Home), a fresh agent's code check, the walkthrough video (3:37) | 52 min |
| Walkthrough accepted; `spec.md`, `system.json` and the glossary brought up to date; the system video (6:28) | 58 min |

**Where a person was needed:** the login; the skill's first question (which level: the whole pipeline); one
Claude Code prompt (below); and each review.

**Denials:** none of reelplanner's commands, in 310 tool calls across the session and its background agents,
with no allow rules. One built-in Claude Code check refused an `rm` whose target it could not resolve, in the
agent building the site; it went another way.

**The skill's new advice showed:** before any command was stopped, the agent told the person that
`Bash(reelplanner:*)` and `Bash(reel:*)` skip the prompts and that `/permissions` → Recently denied retries one.

## Findings

| Finding | What was done |
|---|---|
| Claude Code asks once, in auto mode too, whether to allow reads outside the working directories, the first time the skill reads its own `references/style-guide.md` (in `~/.claude/skills`). Every new user meets it at the first storyboard. | Said in [docs/agents.md](../../docs/agents.md#claude-code): answer the first option. |
| The Finish panel said "Your 1 comment goes with it" with nothing said: it counted the approval it had picked as a comment. | Fixed in the player; `finish.spec` checks it. |
| `playwright-core` was a dev dependency, so an installed reelplanner had none: fresh eyes' pictures lacked the player's captions and controls, and the guide was never opened in a browser. And Playwright looked only in its own browser stores. | A dependency now; it drives the Chrome headless shell `setup` installs for HyperFrames when there is no Playwright browser. `package.spec` checks that every package a shipped script imports is a dependency. |
| The review server takes only its own host and port, so a tunnel to a remote one must keep the port number. | Said in [docs/releasing.md](../../docs/releasing.md) beside `ec2-fresh.sh --shell`. |
| The background agents read reelplanner's installed source to learn formats the skill does not spell out: mostly the `walkthrough.md` table `reel audit` reads, `system.json`'s components and the storyboard's plan tags. | Open: a format reference the skill points to. |
| The skill asks for one command a tool call; the session mostly kept to it (16 alone, 14 chained), its background agents mostly did not (about 150 chained, many with heredocs). Auto mode allowed all of them. | Open: it matters only to someone relying on allow rules without auto mode. |
| A background agent's wait loop (`pgrep -f 'sfe1-'`) matched its own command line and waited out its 590 s timeout. | The agent's slip, not reelplanner's. |
| The site's publishing ran from `main`; `git init` had made `master`. The agent said so in what is not done. | None needed here. |

## Run it again

`bash scripts/release/ec2-fresh.sh --profile <yours> --shell --type c7i.4xlarge --hours 6` prints how to reach the
machine and how to delete it. On it: Node 22 (nvm), Claude Code (`curl -fsSL https://claude.ai/install.sh | bash`),
`claude` once in tmux to log in, then the README's Install with `npm i -g /opt/rp/reelplanner-<version>.tgz`, then
the bakery prompt in a new `bakery-site/`. For the review page: `reelplanner review <video-dir> --port 18787
--no-open` there and `ssh -L 18787:127.0.0.1:18787 …` here. Delete the machine when done: the Claude Code login is
on it.
