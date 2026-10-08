#!/usr/bin/env bash
# The video's pictures: one at each frame's midpoint into snapshots/ (and a contact sheet), then each frame's
# thumbnail in plan-map.json set from them (plan-map --thumbs, lib/thumbs.mjs). verify's step 5.
#
# plan-map.json is written in finish-project, before the pictures are taken, so until this sets them again its
# thumbnails name the last build's pictures (none on a first build), and every one that moved is a missing file.
# snapshots/ is kept out of git (.reelplanning/.gitignore): run this to make a fresh clone's thumbnails again.
#
# The pictures are taken at 2× device scale (a 1920 × 1080 video gives 3840 × 2160 PNGs): the guide shows a scene up
# to 760 CSS px wide, on 2× screens too, and its lightbox shows it whole (lib/guide/pictures.mjs). At 1× the guide had
# to stretch them. HyperFrames' --zoom over the whole stage is that: a raised deviceScaleFactor, the layout unchanged.
# RP_SNAPSHOT_SCALE sets another scale (1 for the old size).
#
# usage: reelplanning snapshot <project-dir>
set -euo pipefail
PROJECT="${1:?usage: reelplanning snapshot <project-dir>}"
export HYPERFRAMES_NO_TELEMETRY=1
export HYPERFRAMES_NO_UPDATE_CHECK=1
export HYPERFRAMES_SKIP_SKILLS=1
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
. "$ROOT/scripts/lib/project-dir.sh"; PROJECT_DIR="$(resolve_project "${PROJECT}")"
HF=hf   # the pinned CLI (scripts/lib/project-dir.sh), never `npx hyperframes`

bash "$ROOT/scripts/vendor-gsap.sh" "$PROJECT_DIR" >/dev/null
cd "$PROJECT_DIR"
# midpoints derived from the assembled timeline so the sheet shows one tile per frame
MIDS=$($HF timeline --json 2>/dev/null | node -e '
  let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    const t=JSON.parse(s);
    const rows=((t.timeline&&t.timeline.tracks)||[]).filter(tr=>tr.kind==="graphics").flatMap(tr=>tr.rows||[])
      .filter(r=>r.src&&/compositions\/frames\//.test(r.src));
    const mids=[...new Set(rows.map(r=>+(r.start+r.duration/2).toFixed(2)))].sort((a,b)=>a-b);
    process.stdout.write(mids.join(","));
  })' 2>/dev/null || true)
# the stage's size, from the root composition (data-width / data-height), for the full-stage 2× shot
read -r W H < <(node -e '
  const s=require("fs").readFileSync("index.html","utf8");
  const w=(s.match(/data-width="(\d+)"/)||[])[1], h=(s.match(/data-height="(\d+)"/)||[])[1];
  process.stdout.write(`${w||""} ${h||""}\n`);' 2>/dev/null) || true
SCALE="${RP_SNAPSHOT_SCALE:-2}"
DENSE=()
if [ -n "${W:-}" ] && [ -n "${H:-}" ] && [ "$SCALE" != "1" ]; then DENSE=(--zoom "0,0,$W,$H" --zoom-scale "$SCALE"); fi
if [ -n "$MIDS" ]; then $HF snapshot --at "$MIDS" ${DENSE[@]+"${DENSE[@]}"}; else $HF snapshot ${DENSE[@]+"${DENSE[@]}"}; fi
if [ -f plan-map.json ]; then node "$ROOT/scripts/plan-map.mjs" . --thumbs; fi
