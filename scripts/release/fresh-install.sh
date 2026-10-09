#!/usr/bin/env bash
# A fresh machine, as a new user meets reelplanner (docs/releasing.md, "Check it from a fresh machine"): a bare
# Ubuntu given what a stock Ubuntu server has and a user with sudo, then the README's Install run as written, as that
# user, and a check of what it left. Run it as root in a new `ubuntu:24.04` container, never on a machine you keep:
# it installs packages and adds a user. .github/workflows/fresh-install.yml runs it.
#
#   bash scripts/release/fresh-install.sh --node 22    Node 22 from nvm (as the README suggests), then the Install
#   bash scripts/release/fresh-install.sh --node apt   Ubuntu's own nodejs, older than reelplanner needs: the CLI
#                                                      must refuse it at once and say how to update
#   --from <spec>   what `npm i -g` installs in the README's place of github:ncrispino/reelplanner, to check a branch
#                   or commit (github:<owner>/<repo>#<ref>); everything else in the README's lines is run as written
#
#   docker run --rm -v "$PWD":/src:ro ubuntu:24.04 bash /src/scripts/release/fresh-install.sh --node 22
set -uo pipefail

NODE=22; FROM=""
while [ $# -gt 0 ]; do case "$1" in
  --node) NODE="$2"; shift 2 ;;
  --from) FROM="$2"; shift 2 ;;
  -h|--help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $1" >&2; exit 2 ;;
esac; done
case "$NODE" in 22|apt) ;; *) echo "✗ --node is 22 or apt, not $NODE" >&2; exit 2 ;; esac
[ "$(id -u)" = 0 ] || { echo "✗ run it as root, in a new container: it installs packages and adds a user" >&2; exit 2; }

HERE="$(cd "$(dirname "$0")/../.." && pwd)"
FAILS=0
ok()   { printf '✓ %s\n' "$*"; }
bad()  { printf '✗ %s\n' "$*"; FAILS=$((FAILS + 1)); }
step() { printf '\n▶ %s\n' "$*"; }

# ---- the machine: what a stock Ubuntu server has, which the container image leaves out (no pip, no compiler)
step "a stock Ubuntu server's tools"
export DEBIAN_FRONTEND=noninteractive
apt-get update -q >/dev/null && apt-get install -y -q sudo curl ca-certificates git python3 xz-utils >/dev/null \
  || { echo "✗ apt-get could not install the base tools"; exit 1; }
id newuser >/dev/null 2>&1 || useradd -m -s /bin/bash newuser
echo "newuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/newuser   # as a cloud image's first user
ok "$(. /etc/os-release; echo "$PRETTY_NAME"), python $(python3 -c 'import platform; print(platform.python_version())'), user newuser with sudo"

# ---- the README's Install: its first ```bash block under "## Install", line by line
INSTALL="$(awk '/^## Install/{f=1; next} f && /^## /{exit} f && /^```bash/{b=1; next} b && /^```/{exit} b' "$HERE/README.md")"
[ -n "$INSTALL" ] || { echo "✗ no \`\`\`bash block under ## Install in README.md"; exit 1; }
if [ -n "$FROM" ]; then INSTALL="$(printf '%s\n' "$INSTALL" | sed "s|github:ncrispino/reelplanner|$FROM|")"; fi
printf '%s\n' "$INSTALL" > /home/newuser/install.sh
chown newuser /home/newuser/install.sh

# as newuser in a new terminal: an interactive shell, so ~/.bashrc runs to its end, where nvm adds itself (Ubuntu's
# .bashrc returns early otherwise); without a terminal, bash says it has no job control, which is noise here
as_user() { sudo -u newuser -H bash -ic "cd ~ && $1" 2> >(grep -v -E 'cannot set terminal process group|no job control in this shell' >&2); }

if [ "$NODE" = apt ]; then
  # ---- Ubuntu's own nodejs: the install goes through (npm only warns), and every command refuses at once
  step "Node from apt"
  apt-get install -y -q nodejs npm >/dev/null 2>&1 || { echo "✗ apt-get could not install nodejs"; exit 1; }
  ok "node $(node -v) from apt"
  src="$(printf '%s\n' "$INSTALL" | awk '/npm i -g/{print $4; exit}')"
  step "sudo npm i -g $src   (apt's npm installs globally as root)"
  sudo npm i -g "$src" >/tmp/npm.log 2>&1 && ok "installed" || { bad "npm i -g failed"; tail -5 /tmp/npm.log; }
  for c in "reelplanner --version" "reel status"; do
    out="$(as_user "$c" 2>&1)"; code=$?
    if [ $code = 1 ] && printf '%s' "$out" | grep -q "needs Node .* or later; this is Node $(node -v | tr -d v)"; then
      ok "$c refuses Node $(node -v), saying how to update"
    else bad "$c on Node $(node -v): exit $code, said: $(printf '%s' "$out" | head -3)"; fi
  done
else
  # ---- Node 22 from nvm, then the README's lines as written
  step "Node 22 from nvm"
  as_user 'curl -fsSo- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash >/dev/null && . ~/.nvm/nvm.sh && nvm install 22 >/dev/null' \
    || { echo "✗ nvm could not install Node 22"; exit 1; }
  ok "node $(as_user 'node -v')"
  while IFS= read -r line; do
    [ -n "${line// }" ] || continue
    # the one line not run as written: `npx skills add` asks which agents to install to, which a person answers in a
    # terminal and this run cannot (no terminal: it cancels); -y answers "every agent", as AGENTS.md's line does.
    # Only the command is looked at, not its comment (which may itself mention -y).
    cmd="${line%%#*}"; note=""; [[ "$line" == *"#"* ]] && note="   #${line#*#}"
    cmd="${cmd%"${cmd##*[![:space:]]}"}"
    if [[ "$cmd" == *"npx skills add"* && " $cmd " != *" -y "* ]]; then line="$cmd -y$note"; fi
    step "$line"
    as_user "$line </dev/null" 2>&1 | tail -40; code=${PIPESTATUS[0]}
    [ "$code" = 0 ] && ok "exit 0" || bad "exit $code: $line"
  done < /home/newuser/install.sh

  step "what it left"
  want="$(as_user 'node -p "require(\"$(npm root -g)/reelplanner/package.json\").version"' 2>/dev/null)"
  have="$(as_user 'reelplanner --version' 2>/dev/null)"
  [ -n "$want" ] && [ "$have" = "$want" ] && ok "reelplanner --version: $have, on the PATH of a new terminal" || bad "reelplanner --version: \"$have\", the package says \"$want\""
  dry="$(as_user 'reelplanner setup --dry-run' 2>&1)"; code=$?
  printf '%s\n' "$dry" | sed 's/^/    /'
  # after a real setup, the dry run finds every tool (a ✓ for each) and nothing missing; its "· would" lines for the
  # steps setup runs every time (the TTS speed patch, the speed check) are not a tool left out
  absent=""
  for t in "node" "ffmpeg" "WebP" "Chrome headless" "Kokoro TTS" "whisper.cpp" "HyperFrames skills"; do
    printf '%s\n' "$dry" | grep -q "^✓ $t" || absent="$absent, $t"
  done
  if [ $code = 0 ] && [ -z "$absent" ] && ! printf '%s\n' "$dry" | grep -q '^✗'; then ok "setup --dry-run: every tool there (node, ffmpeg, WebP, Chrome headless, Kokoro TTS, whisper.cpp, HyperFrames skills)"
  else bad "setup --dry-run: exit $code; not found: ${absent#, }${absent:+ }(above)"; fi
  skill="$(as_user 'ls ~/.agents/skills/plan-to-video/SKILL.md 2>/dev/null')"
  [ -n "$skill" ] && ok "the skill: $skill" || bad "the skill is not in ~/.agents/skills/plan-to-video"
fi

echo
if [ "$FAILS" = 0 ]; then echo "✓ fresh install (node: $NODE): everything as the README says"; else echo "✗ fresh install (node: $NODE): $FAILS failed"; exit 1; fi
