#!/usr/bin/env bash
# Dedicated VM only. Both conditions use this fixed controller and separate native plugin caches.
set -euo pipefail
B=/opt/rp/codex-bench
node_env() { export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.3 >/dev/null; }
setup() {
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  nvm install 22.23.3; nvm alias default 22.23.3
  npm i -g @openai/codex@0.162.1
  for variant in before after; do
    npm install --prefix "/opt/rp/versions/$variant" "/opt/rp/packages/$variant.tgz"
  done
  export RP_BENCH_PACKAGE=/opt/rp/versions/after/node_modules/reelplanner
  mkdir -p "$HOME/bench/bin" "$HOME/bench-results" "$HOME/bench-repos" "$HOME/.codex-login"
  chmod 700 "$HOME/.codex-login"
  cp "$B/rp-shim.sh" "$HOME/bench/bin/reelplanner"
  cp "$B/rp-shim.sh" "$HOME/bench/bin/reel"
  chmod +x "$HOME/bench/bin/reelplanner" "$HOME/bench/bin/reel"
  export PATH="$HOME/bench/bin:$PATH" REELPLANNER_TTS=kokoro BENCH_TIMING=/dev/null
  reelplanner setup
  reelplanner hyperframes-skills
  cat > "$HOME/.codex-login/config.toml" <<'TOML'
model = "gpt-6.1-sol"
model_reasoning_effort = "high"
cli_auth_credentials_store = "file"
TOML
  git config --global user.name bench
  git config --global user.email bench@example.com
  git config --global init.defaultBranch main
  echo "SETUP_READY $(codex --version) node=$(node --version)"
}
run() {
  local label="$1" variant="$2"
  [[ "$label" =~ ^(before|after)-[12]$ ]] || return 2
  [[ "$variant" == before || "$variant" == after ]] || return 2
  node_env
  local repo="$HOME/bench-repos/$label" out="$HOME/bench-results/$label"
  [ ! -e "$repo" ] && [ ! -e "$out" ] || { echo 'Refusing to overwrite a run'; return 2; }
  mkdir -p "$repo" "$out"
  cp -R "$B/fixture/." "$repo/"
  git -C "$repo" init -q; git -C "$repo" add .; git -C "$repo" commit -qm 'Synthetic benchmark input'
  cp "$B/prompt.txt" "$out/prompt.txt"
  cp /opt/rp/source-manifest.json "$out/source-manifest.json"
  # This machine has only benchmark credentials. Serial runs retain its refreshed VM login;
  # the active Mac auth store is never copied. Auth directories are never collected.
  export CODEX_HOME="$HOME/bench-auth/$label"
  mkdir -p "$CODEX_HOME"; chmod 700 "$CODEX_HOME"
  cp "$HOME/.codex-login/config.toml" "$CODEX_HOME/config.toml"
  cp "$HOME/.codex-login/auth.json" "$CODEX_HOME/auth.json"; chmod 600 "$CODEX_HOME/auth.json"
  export RP_BENCH_PACKAGE="/opt/rp/versions/$variant/node_modules/reelplanner"
  codex plugin marketplace add "$RP_BENCH_PACKAGE" --json > "$out/plugin-marketplace.json"
  codex plugin add reelplanner@reelplanner --json > "$out/plugin-install.json"
  python3 "$B/verify-package.py" "$RP_BENCH_PACKAGE" "$CODEX_HOME" > "$out/selected-guidance.json"
  # Only synthetic global memory exists in this dedicated VM.
  rm -f "$HOME/.reelplanner/you.jsonl"
  export PATH="$HOME/bench/bin:$PATH" REELPLANNER_TTS=kokoro BENCH_TIMING="$out/timing.jsonl"
  printf '{"label":"%s","variant":"%s","model":"gpt-6.1-sol","effort":"high","voice":"local,1.25x"}\n' "$label" "$variant" > "$out/run.json"
  local reviewer
  node "$B/reviewer.mjs" "$repo" "$BENCH_TIMING" "$out/reviewer.jsonl" "$out/done.json" > "$out/reviewer.log" 2>&1 & reviewer=$!
  python3 "$B/phase_monitor.py" "$out" 40 25 codex exec -C "$repo" --approve-for-me -c 'sandbox_mode="workspace-write"' -c 'sandbox_workspace_write.network_access=true' --json -
  kill "$reviewer" 2>/dev/null || true; wait "$reviewer" 2>/dev/null || true
  python3 "$B/finish.py" "$repo" "$out"
  cp "$CODEX_HOME/auth.json" "$HOME/.codex-login/auth.json"; chmod 600 "$HOME/.codex-login/auth.json"
  python3 "$B/stop-server.py" "$repo"
}
case "${1:-}" in
  setup) setup ;;
  login) node_env; CODEX_HOME="$HOME/.codex-login" codex login --device-auth ;;
  ready) node_env; CODEX_HOME="$HOME/.codex-login" codex login status ;;
  run) shift; run "$@" ;;
  *) echo 'usage: codex-machine.sh setup | login | ready | run label before|after' >&2; exit 2 ;;
esac
