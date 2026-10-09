# Names

How each tool and product is written in a script and how a viewer sees it: in the captions, on the frames and
in the player. One row a name. The script says a name however reads best aloud (the narration is never
re-voiced for a spelling); the captions show it as this table does (`captions-sentences`), and `check-terms`
warns on a frame that shows it another way.

- **Shown in backticks** is a tool's name or a command: it is shown in code markup (the frames' mono, a chip in
  the captions), in its own spelling, wherever it appears, never capitalised ("reelplanner" at the start of a
  sentence is still `reelplanner`). Its next words, when the script says them, join the chip:
  `reel status`, `npm test`, `claude -p`.
- **Shown plain** is a product or an acronym, shown with that case and no markup: GitHub, CLI, JSON.
- A real thing on screen (inside a `data-artifact`) keeps its own text, and a word inside a path or a command
  line (`bin/reelplanner.mjs`) is part of it.
- A flag, a path or a file name (`-p`, `--dry-run`, `/work`, `plan.md`) is written in the script as it is
  written, and is code in the captions whether listed or not; `narrate` hands the voice its spoken form
  ("dash p", "plan dot md", `scripts/lib/say.mjs`). An old script that spells one out ("claude dash p") is
  shown written in the captions, and `check-terms` warns on it.

Add a row when a plan brings in a tool the videos name. Written lists the spellings to catch, commas between.

| Written | Shown | A command's next words |
|---|---|---|
| reelplanner, reel planner, ReelPlanner, Reelplanner, reelPlanner | `reelplanner` | build, review, setup, narrate, reel, finish-project, check-terms, frame-lint, plan-map, plan-diff, verify, inbox, notify, detail, captions-sentences, bundle-player, system-review, hyperframes |
| reel | `reel` | init, new-plan, stage, check, record, audit, stops, status, memory, retro, build |
| HyperFrames, Hyperframes | HyperFrames | |
| hyperframes | `hyperframes` | check, lint, render, preview, tts, init, snapshot, add, catalog |
| npm, NPM | `npm` | test, install, run, link, publish, pack |
| npx | `npx` | |
| git, Git | `git` | diff, log, status, commit, push, add, show, blame |
| claude | `claude` | -p |
| codex | `codex` | exec |
| opencode | `opencode` | run |
| ffmpeg, FFmpeg | `ffmpeg` | |
| Claude Code | Claude Code | |
| Claude | Claude | |
| github, Github | GitHub | |
| kokoro | Kokoro | |
| whisper | Whisper | |
| gsap | GSAP | |
| cli | CLI | |
| json | JSON | |
| jsonl | JSONL | |
| html | HTML | |
| css | CSS | |
| tts | TTS | |
| api | API | |
| url | URL | |
| macos, MacOS | macOS | |
