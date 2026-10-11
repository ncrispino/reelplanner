#!/usr/bin/env bash
# The demo mp4 as the README's GIF, docs/media/reel-pane.gif: a little faster, one palette for the whole of it.
# WIDTH and FPS (default 1280 and 10) size it: the README's is the highlight (75 s, about 6 MB); the whole demo,
# three minutes, wants WIDTH=1100 FPS=8 to stay near 10 MB, the size of the README's other GIFs.
#
# usage: scripts/demo/reel-pane/gif.sh <demo.mp4> [out.gif]
set -euo pipefail
IN="$1"
OUT="${2:-$(cd "$(dirname "$0")/../../.." && pwd)/docs/media/reel-pane.gif}"
ffmpeg -loglevel error -y -i "$IN" -vf "setpts=PTS/1.25,fps=${FPS:-10},scale=${WIDTH:-1280}:-1:flags=lanczos,split[a][b];\
[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
  -loop 0 "$OUT"
echo "✓ $OUT ($(du -h "$OUT" | cut -f1))"
