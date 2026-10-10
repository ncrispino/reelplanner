#!/usr/bin/env bash
# The demo mp4 (run.sh kitty) as the README's GIF, docs/media/reel-pane.gif: a little faster, 10 frames a second,
# 1280 wide (the pane's text still reads), one palette for the whole of it. About 6 MB for two and a half minutes.
#
# usage: scripts/demo/reel-pane/gif.sh <demo.mp4> [out.gif]
set -euo pipefail
IN="$1"
OUT="${2:-$(cd "$(dirname "$0")/../../.." && pwd)/docs/media/reel-pane.gif}"
ffmpeg -loglevel error -y -i "$IN" -vf "setpts=PTS/1.25,fps=10,scale=1280:-1:flags=lanczos,split[a][b];\
[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
  -loop 0 "$OUT"
echo "✓ $OUT ($(du -h "$OUT" | cut -f1))"
