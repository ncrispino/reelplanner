# Security

reelplanning is a skill and a command-line tool that your coding agent runs. It adds no service of its
own: it works with whatever permissions and sandbox your agent's harness already gives it (Claude Code,
Codex, opencode), and it sends nothing about your code anywhere.

## What it adds on top of a normal agent run

- **A local review server.** `reelplanning review` serves the review page on `127.0.0.1` only, and
  receives the review you send from it. When no agent session is waiting for that review, it starts the
  repo's headless agent command (`agent.command` in `.reelplanning/config.json`) to act on it. Set that
  command to one you trust, as you would any script in the repo. The default is Claude Code in auto mode
  inside its sandbox, with a hook that refuses file-tool writes outside the repo. Where that sandbox
  cannot run (a container running as root), the run goes ahead without it and the server says so: shell
  commands are then not fenced to the repo, file-tool writes still are. Another agent's command (`codex
  exec`, `opencode run`) is started as written, fenced only by its own flags
  ([other agents](../docs/reference.md#other-agents)).
- **Files it writes.** Everything for a plan lives in the repo's `.reelplanning/`. A short summary of
  each review you send goes to `~/.reelplanning/you.jsonl`, so the next plan knows what you already
  know; delete that file to forget it. There is no telemetry.
- **What it downloads.** `reelplanning setup` installs ffmpeg, a headless Chrome, the Kokoro voice,
  whisper.cpp and HyperFrames' skills from their usual sources. Building a video after that is local.
- **A hosted review page, if you use one.** The page and your answers are stored wherever you publish
  it (for example a private claude.ai artifact); who can open it is that host's sharing setting.

## Reporting a problem

Please report a vulnerability privately through GitHub: the repository's **Security** tab, then
**Report a vulnerability** ([ncrispino/reelplanning](https://github.com/ncrispino/reelplanning/security)).
Please don't open a public issue for it.
