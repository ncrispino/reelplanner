#!/usr/bin/env sh
# reelplanner — one-line install. The same two commands the README gives, for a curl | sh habit:
#
#   curl -fsSL https://raw.githubusercontent.com/ncrispino/reelplanner/main/scripts/release/install.sh | sh
#
# 1. The plan-to-video skill, through `npx skills add` (vercel-labs/skills), into every agent it
#    finds on this machine: Claude Code, Codex, Cursor and the rest.
# 2. `reelplanner setup`, which installs what the video pipeline shells out to (ffmpeg, a headless
#    Chrome, Kokoro TTS, whisper.cpp) and HyperFrames' own skills, skipping whatever is there.
#
# There is no checkout and nothing on your PATH: the skill runs its tools as
# `npx -y reelplanner@<version>`, a package npm caches. Until the package is on npm (`npm view
# reelplanner` says 404), this installs it globally from GitHub instead (`npm i -g
# github:ncrispino/reelplanner`, which works once the repo is public), and the agent runs `reelplanner`
# where the skill says `$RP`.
#
# Environment:
#   REELPLANNER_VERSION    the npm version to set up    (default: the one this script pins)
#   REELPLANNER_SOURCE     where to get the skill from  (default ncrispino/reelplanner; a local
#                          checkout path works too, for development)
#   SKILLS_AGENTS          limit the skill to these agents, space-separated (e.g. "claude-code codex")
#   REELPLANNER_GITHUB     where to install the tooling from when npm does not have it
#                          (default github:ncrispino/reelplanner)
# Each is read under its old name too (REELPLANNING_VERSION and so on, before the rename) when the new one is unset.
set -eu

: "${REELPLANNER_VERSION:=${REELPLANNING_VERSION:-}}" "${REELPLANNER_SOURCE:=${REELPLANNING_SOURCE:-}}" "${REELPLANNER_GITHUB:=${REELPLANNING_GITHUB:-}}"
VERSION="${REELPLANNER_VERSION:-0.2.0}"
SOURCE="${REELPLANNER_SOURCE:-ncrispino/reelplanner}"
GITHUB="${REELPLANNER_GITHUB:-github:ncrispino/reelplanner}"

die() { printf '✗ %s\n' "$*" >&2; exit 1; }
command -v node >/dev/null 2>&1 || die "node is required (22.20+): https://nodejs.org/en/download"
command -v npx >/dev/null 2>&1 || die "npx is required (it comes with npm)"
# 22.20, package.json's engines: what `skills` (below) asks for; HyperFrames needs 22. Below 22 nothing here works;
# 22.0 to 22.19 is said, and the install goes on (skills ran on 22.12 when tried, and stopped on 22.0)
nv=$(node -p 'const [a, b] = process.versions.node.split(".").map(Number); a > 22 || (a === 22 && b >= 20) ? "ok" : a === 22 ? "old" : "no"')
[ "$nv" = no ] && die "node 22.20 or newer is required (found $(node -v)): https://nodejs.org/en/download (apt's own nodejs is older; use nvm or NodeSource)"
[ "$nv" = old ] && printf '△ node %s: `skills` asks for 22.20 or newer; if the next step fails, update Node: https://nodejs.org/en/download\n' "$(node -v)"

AGENTS=""
for a in ${SKILLS_AGENTS:-}; do AGENTS="$AGENTS -a $a"; done

printf '▶ the plan-to-video skill, from %s\n' "$SOURCE"
# shellcheck disable=SC2086  # $AGENTS is a list of flags
npx -y skills add "$SOURCE" --skill plan-to-video -g -y $AGENTS </dev/null

# The tooling: from npm when it is published there, else installed globally from GitHub.
if npm view "reelplanner@$VERSION" version >/dev/null 2>&1; then
  RP="npx -y reelplanner@$VERSION"
else
  printf '\n▶ reelplanner@%s is not on npm yet: npm i -g %s\n' "$VERSION" "$GITHUB"
  # its name until October 2026 (D-312): npm will not install over its commands (both have `reel`), and this replaces it
  if npm ls -g reelplanning --depth=0 >/dev/null 2>&1; then
    printf '  reelplanning, its old name, is installed: npm rm -g reelplanning first\n'
    npm rm -g reelplanning </dev/null || die "could not remove reelplanning, its old name (npm's global folder may need sudo: npm rm -g reelplanning)"
  fi
  npm i -g "$GITHUB" </dev/null || die "could not install $GITHUB (a private repo needs access; or npm's global folder needs sudo: npm i -g $GITHUB)"
  RP="reelplanner"
fi

printf '\n▶ %s setup\n' "$RP"
# Under `curl | sh` stdin is this script, which setup must not read. Give it the terminal when there
# is one (so sudo can ask for a password), and nothing otherwise.
# shellcheck disable=SC2086  # $RP is a command and its arguments
if (exec </dev/tty) 2>/dev/null; then $RP setup </dev/tty
else $RP setup </dev/null; fi

printf '\nInstalled. In an agent session in the repo you want to plan for, load the plan-to-video skill:\n'
printf '  Claude Code:  /plan-to-video <plan.md>\n  Codex:        $plan-to-video <plan.md>\n'
[ "$RP" = "reelplanner" ] && printf 'The tooling is the global `reelplanner` (not on npm yet): tell the agent to run it where the skill says $RP.\n'
exit 0
