#!/usr/bin/env bash
# Verification pipeline for a reelplanning video project.
# Uses HyperFrames' own gates (the same ones the faceless-explainer workflow runs):
#   lint  → static composition checks
#   check → lint + headless runtime validation + layout/contrast inspection
#   details → every page a scene opens (check-details: present, offline, bridged, no page error)
#   fresh eyes → every finding a newcomer and a designer made answered (fresh-eyes --check, D-225): one with
#                no answer stops here; no run yet, or scenes changed since they looked, is a △ line
#   snapshot → contact sheet at frame midpoints (visual proof), and plan-map.json's thumbnails set from it
#              (snapshot.sh: plan-map ran in finish-project, before these pictures were taken)
#   render (optional, --render) → MP4 via headless Chrome + ffmpeg
#
# usage: reelplanning verify <project-dir> [--render]
set -euo pipefail
PROJECT="${1:?usage: reelplanning verify <project-dir> [--render]}"
shift || true
RENDER=0
for a in "$@"; do case "$a" in --render) RENDER=1;; esac; done

export HYPERFRAMES_NO_TELEMETRY=1
export HYPERFRAMES_NO_UPDATE_CHECK=1
export HYPERFRAMES_SKIP_SKILLS=1
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
. "$ROOT/scripts/lib/project-dir.sh"; PROJECT_DIR="$(resolve_project "${PROJECT}")"
HF=hf   # the pinned CLI (scripts/lib/project-dir.sh), never `npx hyperframes`

bash "$ROOT/scripts/vendor-gsap.sh" "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo "▶ verify $PROJECT"

# a version built again (`reel rebuild` sets REELPLANNING_REBUILD=1) is built as it was reviewed: a check grown
# stricter since is said, and the pictures are still taken
soft() { if [ "${REELPLANNING_REBUILD:-}" = 1 ]; then "$@" || echo "△ $(basename "${2:-$1}") ${3:-} failed; a rebuild goes on (the version as it was reviewed)"; else "$@"; fi; }
echo "── 1/6 lint"
soft $HF lint
echo "── 2/6 check"
soft $HF check
echo "── 3/6 details"
soft node "$ROOT/scripts/check-details.mjs" .
echo "── 4/6 fresh eyes"
soft node "$ROOT/scripts/fresh-eyes.mjs" . --check
echo "── 5/6 snapshot (frame midpoints, then the plan map's thumbnails from them)"
bash "$ROOT/scripts/snapshot.sh" .
if [ "$RENDER" = 1 ]; then
  echo "── 6/6 render"
  $HF render --skill=faceless-explainer --quality high --output renders/video.mp4
  ffprobe -v error -show_entries format=duration -of default=nw=1 renders/video.mp4
else
  echo "── 6/6 render skipped (pass --render)"
fi
echo "✓ verify complete: $PROJECT"
