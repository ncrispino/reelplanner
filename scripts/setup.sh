#!/usr/bin/env bash
# One-time machine setup for reelplanner: the system tools the video pipeline shells out to, and
# HyperFrames' skills at the version reelplanner pins.
#
#   reelplanner setup                  install what is missing
#   reelplanner setup --dry-run        say what is there and what would be installed
#   reelplanner setup --hosted-voice   skip the local voice (Kokoro, its models, whisper.cpp): narrate with the
#                                      hosted one, and print the two lines that choose it, for ~/.reelplanner/.env
#   reelplanner setup --local-voice    install the local voice even when narration here is hosted
#
# The local voice is installed unless narration here is hosted: REELPLANNER_TTS set to a hosted engine (in the
# shell, the repo's .reelplanner/.env or ~/.reelplanner/.env) or in .reelplanner/config.json, or a HeyGen
# credential. Then it is skipped, and setup says so; everything else is installed either way.
#
# Idempotent: every step checks first and skips what is already there, so running it again is
# cheap. It never runs `npm install` — under npx the node dependencies are already installed, and in
# a checkout that is `npm install`'s job. Nothing is written into this package's own directory.
#
# Anything that needs root (ffmpeg from apt) uses sudo only when it can: as root, with passwordless
# sudo, or from an interactive terminal. Otherwise the step is reported with the command to run
# yourself, and setup exits 1 so an agent calling it knows the machine is not ready.
#
# Steps: node ≥ 18 · ffmpeg · unzip (Linux) · Chrome headless (hyperframes browser ensure) · Kokoro TTS (pip) ·
#        whisper.cpp (brew, or built into HyperFrames' own cache, no root) · HyperFrames' skills
#        · and which narration engine `narrate` will use (local, or hosted: ~/.reelplanner/.env for this machine,
#        or the repo's .reelplanner/), and, when it is local, whether it is fast enough here (one sentence, timed)
set -uo pipefail
# a setting under its old name (REELPLANNING_X, before the rename) is read as REELPLANNER_X when that is unset,
# as the node commands read it (scripts/lib/old-names.mjs)
for k in $(compgen -e | grep '^REELPLANNING_'); do n="REELPLANNER_${k#REELPLANNING_}"; [ -n "${!n+x}" ] || export "$n=${!k}"; done
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
. "$ROOT/scripts/lib/project-dir.sh"   # hf: the pinned HyperFrames CLI
RP="$(node "$ROOT/scripts/lib/env.mjs" rp 2>/dev/null || echo reelplanner)"   # how people run reelplanner (RP_COMMAND)
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1
# where the fixed system places (a system Chrome, Homebrew's whisper-cli) are looked under: / by default; a test
# seam (scripts/test/local-speed.spec.mjs points it at an empty folder: a machine with none of them)
SYS="${REELPLANNER_SYSTEM_ROOT:-}"

DRY=0; VOICE=""
for a in "$@"; do case "$a" in
  -n|--dry-run) DRY=1 ;;
  --hosted-voice|--local-voice)
    [ -n "$VOICE" ] && [ "$VOICE" != "$a" ] && { echo "✗ --hosted-voice and --local-voice: pick one" >&2; exit 2; }
    VOICE="$a" ;;
  -h|--help) sed -n '2,26p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $a (try --dry-run, --hosted-voice or --local-voice)" >&2; exit 2 ;;
esac; done

MISSING=()
have() { command -v "$1" >/dev/null 2>&1; }
ok()   { printf '✓ %s\n' "$*"; }
todo() { printf '· would %s\n' "$*"; }
step() { printf '▶ %s\n' "$*"; }
miss() { printf '✗ %s\n' "$1"; [ $# -gt 1 ] && printf '    %s\n' "${@:2}"; MISSING+=("$1"); }
# run a command, or in --dry-run only say it
run()  { local shown="$*"; shown="${shown/#hf /hyperframes }"   # hf is the pinned HyperFrames CLI
         if [ "$DRY" = 1 ]; then todo "run: $shown"; else step "$shown"; "$@"; fi; }

OS="$(uname -s)"
# How to get root, if at all: "" as root, "sudo" when it will not hang, "none" otherwise.
if [ "$(id -u)" = 0 ]; then SUDO=""
elif have sudo && sudo -n true 2>/dev/null; then SUDO="sudo"
elif have sudo && [ -t 0 ]; then SUDO="sudo"          # it can ask for the password
else SUDO="none"; fi
as_root() { if [ "$SUDO" = none ]; then return 1; fi; run $SUDO "$@"; }
[ "$DRY" = 1 ] && echo "reelplanner setup --dry-run: nothing is changed"

# ---- node
# 22.20, package.json's engines: what the `skills` installer asks for. The commands run on any Node 22 (HyperFrames
# needs 22; scripts/lib/node-check.mjs refuses below it), so 22.0 to 22.19 is said here, not refused.
nv="$(node -p 'const [a, b] = process.versions.node.split(".").map(Number); a > 22 || (a === 22 && b >= 20) ? "ok" : a === 22 ? "old" : "no"')"
if [ "$nv" = ok ]; then ok "node $(node -v)"
elif [ "$nv" = old ]; then ok "node $(node -v): the \`skills\` installer asks for 22.20 or newer; if a step below fails in it, update Node (https://nodejs.org/en/download)"
else miss "node $(node -v) is too old" "reelplanner needs Node 22.20 or newer: https://nodejs.org/en/download (apt's own nodejs is older; use nvm or NodeSource)"; fi

# ---- ffmpeg: renders, and the review bundle's wav → mp3
if have ffmpeg && have ffprobe; then ok "ffmpeg ($(command -v ffmpeg))"
elif [ "$OS" = Darwin ] && have brew; then run brew install ffmpeg || miss "ffmpeg" "brew install ffmpeg failed"
elif have apt-get && [ "$SUDO" != none ]; then
  { as_root apt-get update && as_root apt-get install -y ffmpeg; } || miss "ffmpeg" "apt-get install ffmpeg failed"
elif have apt-get; then miss "ffmpeg: needs root and sudo is not available here" "run: sudo apt-get install -y ffmpeg"
else miss "ffmpeg: no package manager this script knows" "install ffmpeg (with ffprobe) and put it on PATH"; fi
[ "$DRY" = 0 ] && { have ffmpeg || [[ " ${MISSING[*]} " == *" ffmpeg"* ]] || miss "ffmpeg" "installed but still not on PATH"; }

# ---- WebP: the guide's pictures, made with ffmpeg's libwebp or else libwebp's own cwebp (scripts/lib/guide/pictures.mjs).
# Homebrew's ffmpeg is built without libwebp, so on a Mac the guide had no pictures; apt's ffmpeg has it.
if have ffmpeg && ffmpeg -hide_banner -encoders 2>/dev/null | grep -qw libwebp; then ok "WebP (ffmpeg's libwebp)"
elif have cwebp; then ok "WebP (cwebp)"
elif [ "$OS" = Darwin ] && have brew; then run brew install webp || miss "webp" "brew install webp failed (the guide's pictures)"
elif ! have ffmpeg; then :   # ffmpeg is missing (said above); apt's brings libwebp
elif have apt-get && [ "$SUDO" != none ]; then
  { as_root apt-get update && as_root apt-get install -y webp; } || miss "webp" "apt-get install webp failed (the guide's pictures)"
elif have apt-get; then miss "webp: needs root and sudo is not available here" "run: sudo apt-get install -y webp (the guide's pictures)"
else miss "webp: no package manager this script knows" "install cwebp, or an ffmpeg built with libwebp (the guide's pictures)"; fi

# ---- unzip: HyperFrames unpacks its Chrome download with it. Without it (a minimal Debian, a fresh container)
# `hyperframes browser ensure` downloads Chrome and then waits forever, so it comes first.
if [ "$OS" = Linux ] && ! have unzip; then
  if have apt-get && [ "$SUDO" != none ]; then
    { as_root apt-get update && as_root apt-get install -y unzip; } || miss "unzip" "apt-get install unzip failed"
  elif have apt-get; then miss "unzip: needs root and sudo is not available here" "run: sudo apt-get install -y unzip"
  else miss "unzip: no package manager this script knows" "install unzip and put it on PATH (HyperFrames unpacks Chrome with it)"; fi
  [ "$DRY" = 0 ] && { have unzip || [[ " ${MISSING[*]} " == *" unzip"* ]] || miss "unzip" "installed but still not on PATH"; }
fi

# ---- Chrome headless shell: hyperframes check / snapshot / render
# `hyperframes browser path` downloads Chrome (about 260 MB) when it finds none, so a dry run looks where it looks,
# in its order (HyperFrames' findBrowser: the two env variables, its cache and Puppeteer's, then a system Chrome),
# and downloads nothing.
dry_browser() {
  local p
  for p in "${HYPERFRAMES_BROWSER_PATH:-}" "${PRODUCER_HEADLESS_SHELL_PATH:-}"; do [ -n "$p" ] && [ -e "$p" ] && { echo "$p"; return 0; }; done
  p="$(find "$HOME/.cache/puppeteer/chrome-headless-shell" "$HOME/.cache/hyperframes/chrome" -type f \( -name chrome-headless-shell -o -name chrome \) -perm -u+x 2>/dev/null | head -n 1)"
  [ -n "$p" ] && { echo "$p"; return 0; }
  for p in "$SYS/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "$SYS/usr/bin/google-chrome"; do [ -e "$p" ] && { echo "$p"; return 0; }; done
  command -v google-chrome || command -v chromium
}
if [ "$DRY" = 1 ]; then
  if CHROME="$(dry_browser)" && [ -n "$CHROME" ]; then ok "Chrome headless ($CHROME)"
  else todo "download Chrome headless (about 260 MB): hyperframes browser ensure"; fi
elif CHROME="$(hf browser path 2>/dev/null)" && [ -n "$CHROME" ] && [ -e "$CHROME" ]; then ok "Chrome headless ($CHROME)"
elif [ "$OS" = Linux ] && [ "$DRY" = 0 ] && ! have unzip; then miss "Chrome headless: not downloaded, since unzip is missing (above)"
else run hf browser ensure || miss "Chrome headless" "run: $RP hyperframes browser ensure"; fi

# ---- the local voice (Kokoro, its models, whisper.cpp): only what narration here runs on this machine, from the
# settings narrate reads; --hosted-voice skips it, --local-voice installs it anyway (scripts/lib/local-speed.mjs, --plan)
NEED_KOKORO=1 NEED_WHISPER=1 HOSTED_PENDING=0
if PLAN="$(node "$ROOT/scripts/lib/local-speed.mjs" --plan ${VOICE:+"$VOICE"} "$PWD")"; then
  read -r k w p <<<"${PLAN%%$'\n'*}"
  NEED_KOKORO="${k#kokoro=}" NEED_WHISPER="${w#whisper=}" HOSTED_PENDING="${p#pending=}"
  [[ "$PLAN" == *$'\n'* ]] && printf '%s\n' "${PLAN#*$'\n'}"
fi

# ---- Kokoro: local text-to-speech. HyperFrames runs it with python3, or with $HYPERFRAMES_PYTHON.
PY="${HYPERFRAMES_PYTHON:-python3}"
kokoro() { "$PY" -c "import kokoro_onnx, soundfile" >/dev/null 2>&1; }
if [ "$NEED_KOKORO" != 1 ]; then :
elif ! have "$PY"; then miss "Kokoro TTS: $PY not found" "install Python 3.10+, then: pip install kokoro-onnx soundfile"
elif kokoro; then ok "Kokoro TTS (kokoro-onnx in $PY)"
elif [ "$DRY" = 1 ]; then todo "run: $PY -m pip install --user kokoro-onnx soundfile"
else
  if "$PY" -c 'import sys; sys.exit(0 if sys.prefix != sys.base_prefix else 1)'; then pipargs=()   # a venv: no --user
  else pipargs=(--user); fi
  step "$PY -m pip install ${pipargs[*]} kokoro-onnx soundfile"
  "$PY" -m pip install -q "${pipargs[@]}" kokoro-onnx soundfile \
    || { echo "  (retrying with --break-system-packages: this Python is marked externally managed)";
         "$PY" -m pip install -q "${pipargs[@]}" --break-system-packages kokoro-onnx soundfile; }
  kokoro && ok "Kokoro TTS" || miss "Kokoro TTS: pip could not install kokoro-onnx" \
    "run: pip install kokoro-onnx soundfile — or make a venv with them and export HYPERFRAMES_PYTHON=<venv>/bin/python"
fi

# ---- whisper.cpp: word timings for captions. HyperFrames looks on PATH, at $HYPERFRAMES_WHISPER_PATH,
# and in its own build cache — so building there needs no root and no PATH change.
WHISPER_DIR="$HOME/.cache/hyperframes/whisper/whisper.cpp"
whisper() {
  have whisper-cli && { command -v whisper-cli; return 0; }
  [ -n "${HYPERFRAMES_WHISPER_PATH:-}" ] && [ -x "$HYPERFRAMES_WHISPER_PATH" ] && { echo "$HYPERFRAMES_WHISPER_PATH"; return 0; }
  for p in "$WHISPER_DIR/build/bin/whisper-cli" "$WHISPER_DIR/build/whisper-cli" "$SYS/opt/homebrew/bin/whisper-cli"; do [ -x "$p" ] && { echo "$p"; return 0; }; done
  return 1
}
if [ "$NEED_WHISPER" != 1 ]; then :
elif W="$(whisper)"; then ok "whisper.cpp ($W)"
elif [ "$OS" = Darwin ] && have brew; then run brew install whisper-cpp || miss "whisper.cpp" "brew install whisper-cpp failed"
else
  cxx=""; for c in c++ g++ clang++; do have "$c" && { cxx="$c"; break; }; done
  if ! have git || ! have cmake || [ -z "$cxx" ]; then
    if have apt-get && [ "$SUDO" != none ]; then { as_root apt-get update && as_root apt-get install -y git cmake build-essential; } || true; cxx=c++
    elif have apt-get; then miss "whisper.cpp: building it needs git, cmake and a C++ compiler" "run: sudo apt-get install -y git cmake build-essential   (then setup again)"
    else miss "whisper.cpp: building it needs git, cmake and a C++ compiler" "install them, then run setup again (or install whisper-cli yourself and put it on PATH)"; fi
  fi
  if ! [[ " ${MISSING[*]} " == *" whisper.cpp"* ]]; then
    if [ "$DRY" = 1 ]; then todo "build whisper.cpp into $WHISPER_DIR (git clone + cmake; no root)"
    else
      step "building whisper.cpp into $WHISPER_DIR (a few minutes)"
      rm -rf "$WHISPER_DIR"; mkdir -p "$(dirname "$WHISPER_DIR")"
      { git clone -q --depth 1 https://github.com/ggml-org/whisper.cpp "$WHISPER_DIR" \
          && cmake -S "$WHISPER_DIR" -B "$WHISPER_DIR/build" -DCMAKE_BUILD_TYPE=Release >/dev/null \
          && cmake --build "$WHISPER_DIR/build" -j 4 --config Release --target whisper-cli >/dev/null; } \
        && W="$(whisper)" && ok "whisper.cpp ($W)" \
        || miss "whisper.cpp: the build failed" "see https://github.com/ggml-org/whisper.cpp#building, or set HYPERFRAMES_WHISPER_PATH"
    fi
  fi
fi

# ---- HyperFrames' skills (/faceless-explainer, media-use, …) at the pinned tag, for every agent,
# and the Kokoro speed patch on top. See scripts/hyperframes-skills.mjs.
if [ "$DRY" = 1 ]; then node "$ROOT/scripts/hyperframes-skills.mjs" --dry-run
else node "$ROOT/scripts/hyperframes-skills.mjs" || miss "HyperFrames skills" "run: $RP hyperframes-skills"; fi

# ---- narration: which engine `narrate` will use here, and why (.reelplanner/config.json's narration, or
# REELPLANNER_TTS, e.g. in ~/.reelplanner/.env; docs/reference.md, "Narration engines"). A hosted one needs its key in the environment.
# --hosted-voice before its two lines are in ~/.reelplanner/.env: nothing narrates here until they are. The person
# chose this, so it is the next step, not a failure: setup still succeeds.
if [ "$HOSTED_PENDING" = 1 ]; then
  printf '→ narration: next, put the two lines above in ~/.reelplanner/.env, then run %s narration-check to hear a test line\n' "$RP"
elif N="$(node "$ROOT/scripts/lib/narrator.mjs" describe "$PWD" 2>&1)"; then ok "$N"
else printf '✗ %s\n' "$N"; MISSING+=("narration: ${N%%$'\n'*}"); fi

# ---- is local narration fast enough here? One sentence through local Kokoro + whisper, timed (at most 30 s), when
# both are installed and no hosted engine is set; slow (over 20 s a line) says how to switch to the hosted voice.
# Advice, never a failure: local narration always works. See scripts/lib/local-speed.mjs. Not when the local voice
# was skipped (above): there is nothing local to time.
if [ "$NEED_KOKORO" != 1 ] && [ "$NEED_WHISPER" != 1 ]; then :
elif [ "$DRY" = 1 ]; then node "$ROOT/scripts/lib/local-speed.mjs" --dry-run "$PWD"
else node "$ROOT/scripts/lib/local-speed.mjs" "$PWD"; fi

echo
if [ "${#MISSING[@]}" -gt 0 ]; then
  if [ "$DRY" = 1 ]; then echo "✗ after setup, still missing:"; else echo "✗ setup incomplete — still missing:"; fi
  for m in "${MISSING[@]}"; do echo "    $m"; done
  echo "  Fix those (the commands are above) and run setup again; whatever is already there is skipped."
  exit 1
fi
if [ "$DRY" = 1 ]; then echo "✓ dry run done: the steps marked · would run"; exit 0; fi
hf doctor || true
echo "✓ reelplanner is set up"
