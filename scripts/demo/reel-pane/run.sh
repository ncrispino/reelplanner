#!/usr/bin/env bash
# Record the /reel pane working in a real Claude Code session, as a captioned mp4 (about a minute).
#
#   kitty    the same in a real kitty on a virtual display (Xvfb), its screen grabbed as it is: the sharp picture
#            (kitty.py, then cut.py for the captions). Needs kitty, Xvfb and xdotool.
#            The video's render is made first if the checkout has none (about 8 minutes, once; renders/ is
#            left out of git).
#   review   the agent opens a plan video with `reelplanner review`, the band offers it, the pane answers its
#            three choices and sends, and Claude files the review (record.py)
#
# It clones this checkout into a scratch folder, installs the plugin from that clone into a scratch HOME (so
# neither this repo nor your ~/.claude is touched), starts `claude` in tmux, drives it, and renders the captured
# screens (render.py, with pyte and Pillow). Stretches where nothing new happens are played faster and the
# caption says so; nothing is made up.
#
# usage: scripts/demo/reel-pane/run.sh [kitty|review] [out.mp4]   needs tmux, ffmpeg, python3 with pyte and
#                                                                Pillow, and a `claude` that is signed in
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
HERE="$ROOT/scripts/demo/reel-pane"
FLOW="${1:-kitty}"
OUT="$(realpath -m "${2:-reel-pane-$FLOW.mp4}")"
case "$FLOW" in kitty) COLS=0 ROWS=0;; review) COLS=150 ROWS=44;; *) echo "usage: run.sh [kitty|review] [out.mp4]"; exit 1;; esac
WORK="$(mktemp -d "${TMPDIR:-/tmp}/reel-pane-demo.XXXXXX")"
echo "working in $WORK"

git clone -q "$ROOT" "$WORK/demo"
# uncommitted edits too
cp "$ROOT/skills/plan-to-video/hooks/register.tsx" "$WORK/demo/skills/plan-to-video/hooks/"
cp "$ROOT/skills/plan-to-video/types/index.d.ts" "$WORK/demo/skills/plan-to-video/types/"
cp "$ROOT/scripts/reel-frames.mjs" "$WORK/demo/scripts/"
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

if [ "$FLOW" != review ]; then
  V=videos/l2-upload-resume
  if [ -f "$ROOT/$V/renders/terminal.mp4" ]; then mkdir -p "$WORK/demo/$V/renders" && cp "$ROOT/$V/renders/terminal.mp4" "$WORK/demo/$V/renders/" && touch "$WORK/demo/$V/renders/terminal.mp4"; fi
  (cd "$WORK/demo" && node bin/reelplanner.mjs reel-frames "$V" --render | grep -v '^P ' || true)
fi

if [ "$FLOW" = kitty ]; then
  printf '#!/bin/sh\ncd %s/demo\nexec env -u CLAUDE_CODE_REMOTE -u CLAUDE_CODE_CHILD_SESSION -u TMUX HOME=%s/home claude\n' "$WORK" "$WORK" > "$WORK/launch.sh"
  chmod +x "$WORK/launch.sh"
  Xvfb :97 -screen 0 1920x1080x24 >/dev/null 2>&1 & XVFB=$!
  sleep 2
  mkdir -p "$WORK/run"
  DISPLAY=:97 python3 "$HERE/kitty.py" "$WORK/run" "$WORK/launch.sh" "$WORK/demo"
  kill $XVFB 2>/dev/null || true
  (cd "$WORK/demo" && HOME="$WORK/home" node bin/reelplanner.mjs review --stop >/dev/null 2>&1 || true)
  python3 "$HERE/cut.py" "$WORK/run" "$OUT"
  echo "✓ $OUT"
  exit 0
fi

tmux kill-session -t demo 2>/dev/null || true
(cd "$WORK/demo" && tmux new-session -d -s demo -x $COLS -y $ROWS \
  "env -u CLAUDE_CODE_REMOTE -u CLAUDE_CODE_CHILD_SESSION -u TMUX HOME=$WORK/home TERM=xterm-256color COLORTERM=truecolor claude; sleep 900")
until tmux capture-pane -t demo -p | grep -q "auto mode on\|for shortcuts"; do sleep 1; done
mkdir -p "$WORK/run"
python3 "$HERE/record.py" "$WORK/run"
(cd "$WORK/demo" && HOME="$WORK/home" node bin/reelplanner.mjs review --stop >/dev/null 2>&1 || true)
tmux kill-session -t demo 2>/dev/null || true

# caption 10 is "c: send it…", Claude working on the review, played at 4x
SPEED=10:4 COLS=$COLS ROWS=$ROWS python3 "$HERE/render.py" "$WORK/run" "$WORK/frames"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/frames/list.txt" -vf "fps=25,format=yuv420p" \
  -c:v libx264 -crf 22 -preset medium -movflags +faststart "$OUT"
echo "✓ $OUT"
