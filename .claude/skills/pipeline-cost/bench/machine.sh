#!/usr/bin/env bash
# One bench run, on a fresh machine (bench.sh copies this folder to /opt/rp/bench and runs it as the image's user):
#
#   machine.sh setup          as the baseline run was set up (eval/fresh-machine/2026-10-10-bakery-auto-mode.md): Node 22
#                             from nvm, Claude Code from its installer, the README's three Install lines with `npm i -g`
#                             pointed at the packed copy in /opt/rp. Then the measuring: Claude Code's telemetry to
#                             otel-sink.mjs, the model (Opus 5.5) and medium effort, all in ~/.claude/settings.json, so every
#                             claude on the machine has them, fresh eyes' `claude -p` too (telemetry records each request's
#                             effort, so the report can check it), and rp-shim.sh first on PATH as `reelplanner` and `reel`.
#   machine.sh ready          exit 0 once Claude Code answers (the person has logged in)
#   machine.sh run <label> [minutes] [depth]
#                             the README's bakery request in an empty ~/bakery-site, headless, with the reviewer
#                             (reviewer.mjs) sending the same review once the video is shown; stopped once the revised
#                             video is shown, or after --minutes. Everything measured ends in ~/bench-<label>.tgz.
#                             With a depth (low, medium, high), the request asks for a video of that depth in the
#                             person's words; without one it is the baseline's, word for word.
#
# Claude Code is logged in by the person, by hand, once per machine (bench.sh says how); no credential is copied
# here. The machine is deleted after its runs.
set -uo pipefail
B="$(cd "$(dirname "$0")" && pwd)"
OUT="$HOME/bench-out"
PROMPT='Use reelplanner to plan a small website for a neighborhood bakery.

There is no one to ask in this session. What the person answers: the level is the whole pipeline (reel init, the plan in .reelplanner/, fresh eyes); anywhere else the skill would ask the person something, take the default it gives and go on. Never end your turn to ask. Once you have given the link to the plan video, wait for the review in the foreground (run `reelplanner review --wait`, again until a review comes), act on it as the skill says, give the link to the revised video, and stop there: do not implement the plan.'

nvm_() { export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; }

setup() {
  local t0=$SECONDS
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash >/dev/null 2>&1
  nvm_ && nvm install 22 >/dev/null 2>&1 && nvm alias default 22 >/dev/null
  curl -fsSL https://claude.ai/install.sh | bash >/dev/null 2>&1
  export PATH="$HOME/.local/bin:$PATH"
  npm i -g /opt/rp/reelplanner-*.tgz >/dev/null 2>&1 || { echo "✗ npm i -g failed"; exit 1; }
  reelplanner setup > "$HOME/setup.log" 2>&1 || { echo "✗ reelplanner setup failed: $(tail -3 "$HOME/setup.log")"; exit 1; }
  npx -y skills add "$(npm root -g)/reelplanner" --skill plan-to-video -g -y >/dev/null 2>&1 || { echo "✗ the skill did not install"; exit 1; }
  mkdir -p "$HOME/.claude" "$HOME/bench/bin" "$OUT"
  cat > "$HOME/.claude/settings.json" <<'JSON'
{
  "model": "claude-opus-5-5",
  "effortLevel": "medium",
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/json",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://127.0.0.1:4318",
    "OTEL_LOGS_EXPORT_INTERVAL": "1000",
    "OTEL_METRIC_EXPORT_INTERVAL": "10000"
  }
}
JSON
  cp "$B/rp-shim.sh" "$HOME/bench/bin/reelplanner"; cp "$B/rp-shim.sh" "$HOME/bench/bin/reel"; chmod +x "$HOME/bench/bin/"*
  git config --global user.name "bench"; git config --global user.email "bench@example.com"; git config --global init.defaultBranch main
  echo "✓ set up in $((SECONDS - t0)) s: node $(node -v), claude $(claude --version 2>/dev/null | head -1), reelplanner $(reelplanner --version)"
}

run() {
  local label="$1" minutes="${2:-150}" depth="${3:-}" prompt="$PROMPT"
  [ -n "$depth" ] && prompt="Use reelplanner to plan a small website for a neighborhood bakery. Make it a ${depth}-depth video.${PROMPT#Use reelplanner to plan a small website for a neighborhood bakery.}"
  nvm_; local version; version="$(reelplanner --version)"   # before the shim is on PATH: no timing line for it
  export PATH="$HOME/bench/bin:$HOME/.local/bin:$PATH"
  export BENCH_TIMING="$OUT/timing.jsonl" OTEL_RESOURCE_ATTRIBUTES="bench.run=$label"
  # a clean start when a run came before on this machine: its results are packed already (~/bench-<label>.tgz)
  pkill -f "scripts/review.mjs" 2>/dev/null; pkill -f otel-sink.mjs 2>/dev/null; sleep 1
  rm -rf "$HOME/bakery-site" "$OUT" "$HOME/.claude/projects" "$HOME/.reelplanner/you.jsonl"; mkdir -p "$HOME/bakery-site" "$OUT"
  node "$B/otel-sink.mjs" "$OUT/otel.jsonl" 4318 > "$OUT/sink.log" 2>&1 & local sink=$!
  node "$B/reviewer.mjs" "$HOME/bakery-site" "$BENCH_TIMING" "$OUT/reviewer.jsonl" "$OUT/done.json" > "$OUT/reviewer.log" 2>&1 & local rev=$!
  sleep 1
  printf '{"ev":"run-start","at":%s,"label":"%s","reelplanner":"%s","depth":"%s"}\n' "$(date +%s%3N)" "$label" "$version" "$depth" >> "$OUT/run.jsonl"
  ( cd "$HOME/bakery-site" && claude -p "$prompt" --effort medium --permission-mode auto --output-format stream-json --verbose < /dev/null > "$OUT/claude.jsonl" 2> "$OUT/claude.err" ) & local agent=$!
  local deadline=$((SECONDS + minutes * 60)) why="the agent ended"
  while kill -0 "$agent" 2>/dev/null; do
    if [ -f "$OUT/done.json" ]; then why="the revised video was shown"; sleep 20; break; fi
    if [ $SECONDS -ge $deadline ]; then why="stopped after $minutes min"; break; fi
    sleep 5
  done
  printf '{"ev":"run-end","at":%s,"why":"%s"}\n' "$(date +%s%3N)" "$why" >> "$OUT/run.jsonl"
  pkill -TERM -P "$agent" 2>/dev/null; kill -TERM "$agent" 2>/dev/null; sleep 5; pkill -f "claude -p" 2>/dev/null
  sleep 3; kill "$sink" "$rev" 2>/dev/null
  # what the report reads: the transcripts, the timing, the telemetry, the reviewer, and the repo's record and video text
  tar -czf "$HOME/bench-$label.tgz" -C "$HOME" .claude/projects bench-out \
    --exclude='*/node_modules' --exclude='*/renders' --exclude='*.wav' --exclude='*.mp3' --exclude='*.mp4' bakery-site 2>/dev/null
  echo "✓ $label: $why · $(du -h "$HOME/bench-$label.tgz" | cut -f1)"
}

ready() { export PATH="$HOME/.local/bin:$PATH"; cd /tmp && claude -p "Reply with OK" --model claude-haiku-5-5 < /dev/null 2>/dev/null | grep -q OK; }

case "${1:-}" in
  setup) setup ;;
  ready) ready ;;
  run) shift; run "$@" ;;
  *) echo "usage: machine.sh setup | ready | run <label> [minutes] [low|medium|high]"; exit 2 ;;
esac
