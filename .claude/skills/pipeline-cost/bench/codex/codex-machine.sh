#!/usr/bin/env bash
# Runs only on the temporary benchmark VM. Never packs its authentication directory.
set -euo pipefail
B=/opt/rp/codex-bench
export PATH="$HOME/.local/bin:$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
node_env() { export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22 >/dev/null; }
setup() {
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm install 22; nvm alias default 22
  npm i -g /opt/rp/reelplanner-*.tgz @openai/codex@0.162.1
  reelplanner setup
  reelplanner hyperframes-skills
  mkdir -p "$HOME/.codex" "$HOME/bench/bin" "$HOME/bench-results"
  cat > "$HOME/.codex/config.toml" <<'TOML'
model = "gpt-6.1-sol"
model_reasoning_effort = "high"
cli_auth_credentials_store = "file"
TOML
  codex plugin marketplace add "$(npm root -g)/reelplanner" --json
  codex plugin add reelplanner@reelplanner --json
  cp "$B/rp-shim.sh" "$HOME/bench/bin/reelplanner"
  cp "$B/rp-shim.sh" "$HOME/bench/bin/reel"
  chmod +x "$HOME/bench/bin/reelplanner" "$HOME/bench/bin/reel"
  git config --global user.name bench
  git config --global user.email bench@example.com
  git config --global init.defaultBranch main
  echo "SETUP_READY $(codex --version) node=$(node --version)"
}
run() {
  local label="$1" variant="$2" minutes="${3:-40}"
  [[ "$label" =~ ^[a-z0-9-]+$ ]] || return 2
  [[ "$variant" == baseline || "$variant" == packet ]] || return 2
  [[ "$minutes" =~ ^[1-9][0-9]?$ ]] || return 2
  node_env
  # This disposable VM holds only synthetic benchmark memory; reset it between trials.
  rm -f "$HOME/.reelplanner/you.jsonl"
  local repo="$HOME/bench-repos/$label" out="$HOME/bench-results/$label"
  [ ! -e "$repo" ] && [ ! -e "$out" ] || { echo 'Refusing to overwrite a run'; return 2; }
  mkdir -p "$repo" "$out"
  cp -R "$B/fixture/." "$repo/"
  git -C "$repo" init -q
  git -C "$repo" add .
  git -C "$repo" commit -qm 'Synthetic benchmark input'
  cp "$B/prompt.txt" "$out/prompt.txt"
  cp "$B/source-manifest.json" "$out/source-manifest.json"
  if [ "$variant" == packet ]; then
    cp "$B/AUTHORING-PACKET.md" "$repo/"
    cat "$B/packet-instructions.txt" >> "$out/prompt.txt"
  fi
  export PATH="$HOME/bench/bin:$PATH"
  export BENCH_TIMING="$out/timing.jsonl" REELPLANNER_TTS=local
  local reviewer agent
  node "$B/reviewer.mjs" "$repo" "$BENCH_TIMING" "$out/reviewer.jsonl" "$out/done.json" > "$out/reviewer.log" 2>&1 & reviewer=$!
  local start; start=$(date +%s)
  printf '{"label":"%s","variant":"%s","start":%s,"model":"gpt-6.1-sol","effort":"high","voice":"local","timeout_minutes":%s}\n' "$label" "$variant" "$start" "$minutes" > "$out/run.json"
  # A process group lets timeout and cleanup stop only this run and its children.
  setsid timeout --signal=TERM --kill-after=15s "${minutes}m" codex exec -C "$repo" --approve-for-me -c 'sandbox_mode="workspace-write"' -c 'sandbox_workspace_write.network_access=true' --json - < "$out/prompt.txt" > "$out/codex.jsonl" 2> "$out/codex.err" & agent=$!
  while kill -0 "$agent" 2>/dev/null; do
    if [ -f "$out/done.json" ]; then kill -TERM -- "-$agent" 2>/dev/null || true; break; fi
    sleep 2
  done
  local code=0; wait "$agent" || code=$?
  kill -TERM -- "-$agent" 2>/dev/null || true
  kill "$reviewer" 2>/dev/null || true
  wait "$reviewer" 2>/dev/null || true
  # Stop only review servers that declare this scratch repo as their owner.
  python3 "$B/finish.py" "$repo" "$out" "$code"
  local server_pid
  server_pid=$(python3 - "$repo" <<'PY'
import json,sys
from pathlib import Path
p=Path(sys.argv[1])/'.reelplanner/inbox/.server.json'
if p.exists():
 d=json.loads(p.read_text()); print(d.get('pid',''))
PY
)
  [ -z "$server_pid" ] || kill "$server_pid" 2>/dev/null || true
  echo "RUN_COMPLETE $label exit=$code"
}
case "${1:-}" in
  setup) setup ;;
  login) node_env; codex login --device-auth ;;
  ready) node_env; codex login status ;;
  run) shift; run "$@" ;;
  *) echo 'usage: codex-machine.sh setup | ready | run label baseline|packet [minutes]' >&2; exit 2 ;;
esac
