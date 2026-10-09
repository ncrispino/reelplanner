#!/usr/bin/env bash
# Record the /reel pane working in a real Claude Code session, as a captioned mp4 (about a minute).
#
# It clones this checkout into a scratch folder, installs the plugin from that clone into a scratch HOME (so
# neither this repo nor your ~/.claude is touched), starts `claude` in tmux, drives it (record.py: the agent
# opens a plan video with `reelplanner review`, the band offers it, the pane answers its three choices and
# sends), and renders the captured screens (render.py, with pyte and Pillow). The stretch where Claude files
# the review is played at 4x and says so; nothing else is sped up or made up.
#
# usage: scripts/demo/reel-pane/run.sh [out.mp4]      needs tmux, ffmpeg, python3 with pyte and Pillow,
#                                                     and a `claude` that is signed in
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
HERE="$ROOT/scripts/demo/reel-pane"
OUT="$(realpath -m "${1:-reel-pane-demo.mp4}")"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/reel-pane-demo.XXXXXX")"
echo "working in $WORK"

git clone -q "$ROOT" "$WORK/demo"
cp "$ROOT/skills/plan-to-video/hooks/register.tsx" "$WORK/demo/skills/plan-to-video/hooks/"   # uncommitted edits too
[ -d "$ROOT/node_modules" ] && ln -s "$ROOT/node_modules" "$WORK/demo/node_modules"
mkdir -p "$WORK/home"
HOME="$WORK/home" claude plugin marketplace add "$WORK/demo" >/dev/null
HOME="$WORK/home" claude plugin install reelplanner@reelplanner >/dev/null
python3 - "$WORK" <<'PY'
import json, sys
w = sys.argv[1]
json.dump({"hasCompletedOnboarding": True, "theme": "dark",
           "projects": {f"{w}/demo": {"hasTrustDialogAccepted": True, "hasCompletedProjectOnboarding": True}}},
          open(f"{w}/home/.claude.json", "w"))
PY

tmux kill-session -t demo 2>/dev/null || true
(cd "$WORK/demo" && tmux new-session -d -s demo -x 150 -y 44 \
  "env -u CLAUDE_CODE_REMOTE -u CLAUDE_CODE_CHILD_SESSION -u TMUX HOME=$WORK/home TERM=xterm-256color COLORTERM=truecolor claude; sleep 900")
until tmux capture-pane -t demo -p | grep -q "auto mode on\|for shortcuts"; do sleep 1; done
mkdir -p "$WORK/run"
python3 "$HERE/record.py" "$WORK/run"
(cd "$WORK/demo" && HOME="$WORK/home" node bin/reelplanner.mjs review --stop >/dev/null 2>&1 || true)
tmux kill-session -t demo 2>/dev/null || true

# caption 10 is "c: send it…": Claude working on the review, played at 4x
SPEED=10:4 python3 "$HERE/render.py" "$WORK/run" "$WORK/frames"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/frames/list.txt" -vf "fps=25,format=yuv420p" \
  -c:v libx264 -crf 22 -preset medium -movflags +faststart "$OUT"
echo "✓ $OUT"
