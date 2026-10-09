#!/bin/sh
# smoke: does this machine make a video? Run it after `reelplanner setup`, before a run that takes hours. In a
# scratch folder it makes a project record (`reel init`), one line of speech (Kokoro), its word timings
# (whisper.cpp) and ten seconds of video (a headless Chrome and ffmpeg), one line a step, and exits 1 at the
# first that fails. The first run downloads the voice model (about 330 MB, from github.com) and the
# transcription model (about 470 MB, from huggingface.co); later runs reuse them. A minute or two after that.
#
#   sh smoke.sh                               with `reelplanner` on PATH
#   sh smoke.sh node bin/reelplanner.mjs      from a checkout: the command to run it as
set -u
RP="${*:-reelplanner}"
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1 HYPERFRAMES_SKIP_SKILLS=1
dir=$(mktemp -d "${TMPDIR:-/tmp}/reel-smoke-XXXXXX") || exit 1
log="$dir/log"
trap 'rm -rf "$dir"' EXIT
step() {   # step <what> <command…>: one line, ✓ with its seconds, or ✗ with the end of its output
  what=$1; shift; t0=$(date +%s)
  if "$@" >>"$log" 2>&1; then echo "✓ $what ($(( $(date +%s) - t0 )) s)"
  else echo "✗ $what: failed"; tail -n 15 "$log" | sed 's/^/    /'; echo "✗ smoke: this machine is not ready (reelplanner setup says what is missing)"; exit 1; fi
}
step "reelplanner $($RP --version 2>/dev/null)" $RP --version
step "a project record (reel init)" $RP reel init "$dir/repo" --name smoke --kind greenfield --agent none
step "a composition (hyperframes init)" sh -c "cd '$dir' && $RP hyperframes init smoke --example blank --non-interactive"
step "a line of speech (Kokoro TTS)" $RP hyperframes tts "Bob Dylan, from Hibbing to the Nobel Prize." -o "$dir/smoke/line.wav"
step "its word timings (whisper.cpp)" $RP hyperframes transcribe "$dir/smoke/line.wav" -d "$dir/smoke" --json
step "ten seconds of video (Chrome, ffmpeg)" $RP hyperframes render "$dir/smoke" -q draft -o "$dir/smoke/out.mp4" --quiet
len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$dir/smoke/out.mp4" 2>/dev/null)
case "$len" in 9.9*|10.*) echo "✓ the video plays: $len s" ;; *) echo "✗ the video is ${len:-unreadable} s, not 10"; exit 1 ;; esac
echo "✓ smoke: this machine makes a video"
