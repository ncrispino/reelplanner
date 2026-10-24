#!/usr/bin/env bash
# On the machine codex-terminal.sh starts: Codex's terminal review, as a person would see it.
#
#   machine.sh setup            the tools: a virtual screen with Ghostty and tmux, Node 22, reelplanner (the package in
#                               /opt/rp), Codex with reelplanner's plugin, terminal-browser; a demo repo holding a
#                               built plan video and its plan (demo.tar, from the checkout)
#   machine.sh demo             another demo repo, at DEMO=<dir> (for a second run on the same machine)
#   machine.sh ready            exit 0 once Codex is logged in (by the person: nothing here handles a credential)
#   machine.sh run [--record]   the trial; its results in ~/codex-terminal.tgz, its last line ✓ or ✗
#
# The run: the saved opener rule (review-setup --codex-allow-open), then Codex in tmux in Ghostty, asked to open the
# video's review beside it. Approvals it asks for are given for reelplanner's own commands only, and listed. A scripted
# reviewer (reviewer.mjs) answers the review in that split and presses Send; Codex is told, and takes it in (only:
# revising the plan and rebuilding the video are the skill's next steps, not this trial's).
set -uo pipefail
D=/opt/rp/codex-terminal; OUT=$HOME/codex-terminal; DEMO=${DEMO:-$HOME/demo}
export NVM_DIR=$HOME/.nvm; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH=$HOME/.local/bin:$PATH
step() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

setup() {
  step "apt"
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq xvfb x11-utils xdotool imagemagick mesa-utils libgl1-mesa-dri libegl1 \
    dbus-x11 openbox fonts-dejavu-core tmux bubblewrap pulseaudio > /tmp/apt.log 2>&1 || { tail -5 /tmp/apt.log; return 1; }
  step "node"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash > /dev/null 2>&1
  . "$NVM_DIR/nvm.sh"; nvm install 22 > /dev/null 2>&1 && nvm alias default 22 > /dev/null; node -v
  step "reelplanner"
  npm i -g /opt/rp/reelplanner-*.tgz > /tmp/rp-install.log 2>&1 || { tail -5 /tmp/rp-install.log; return 1; }
  reelplanner setup > /tmp/rp-setup.log 2>&1 || { tail -5 /tmp/rp-setup.log; return 1; }
  step "codex"
  npm i -g @openai/codex > /tmp/codex-install.log 2>&1 || { tail -5 /tmp/codex-install.log; return 1; }
  codex plugin marketplace add "$(npm root -g)/reelplanner" > /dev/null && codex plugin add reelplanner@reelplanner > /dev/null || return 1
  # Codex's Linux sandbox (bubblewrap) needs unprivileged user namespaces, which Ubuntu 24.04's AppArmor restricts.
  # This turns that protection off for every program, which is acceptable only because this machine is deleted
  # after the trial; never on a machine anyone keeps (docs/agents.md gives the narrow fix)
  sudo sysctl -qw kernel.apparmor_restrict_unprivileged_userns=0
  step "ghostty, terminal-browser"
  sudo snap install ghostty --classic > /tmp/ghostty.log 2>&1 || { tail -3 /tmp/ghostty.log; return 1; }
  curl -fsSL https://terminal-browser.sh/install | bash > /tmp/tb-install.log 2>&1 || { tail -3 /tmp/tb-install.log; return 1; }
  demo || return 1
  step "✓ set up: $(reelplanner --version), $(codex --version), $(ghostty --version 2>/dev/null | head -1), terminal-browser $(terminal-browser --version 2>/dev/null)"
}

# the demo repo (DEMO, default ~/demo): a built plan video and its plan, committed
demo() {
  step "demo repo"
  [ -e "$DEMO" ] && { echo "✗ $DEMO is there already: name another with DEMO=<dir>"; return 1; }
  mkdir -p "$DEMO" && tar -xf "$D/demo.tar" -C "$DEMO" || return 1
  git -C "$DEMO" init -q && git -C "$DEMO" add -A && git -C "$DEMO" -c user.name=trial -c user.email=trial@localhost commit -qm "a built plan video and its plan"
}

ready() { codex login status 2>&1 | grep -q "Logged in"; }

# the virtual screen: Xvfb, a session bus, a window manager, and (to record the page's sound) a null audio sink
screen() {
  export DISPLAY=:99 LIBGL_ALWAYS_SOFTWARE=1
  pgrep -x Xvfb > /dev/null || { Xvfb :99 -screen 0 1920x1080x24 -nolisten tcp > /tmp/xvfb.log 2>&1 & sleep 2; }
  [ -f /tmp/dbus.env ] || dbus-launch --sh-syntax > /tmp/dbus.env; . /tmp/dbus.env
  pgrep -x openbox > /dev/null || { openbox > /tmp/openbox.log 2>&1 & sleep 1; }
  pulseaudio --check 2>/dev/null || pulseaudio --start --exit-idle-time=-1 > /dev/null 2>&1
  pactl list short sinks 2>/dev/null | grep -q '^[0-9]*\s*trial\s' || pactl load-module module-null-sink sink_name=trial > /dev/null 2>&1
  pactl set-default-sink trial 2>/dev/null; true
}

# Codex's turns end with a task_complete in its session file, and nothing on screen says "esc to interrupt"
turns() { cat "$HOME"/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null | grep -c '"type":"task_complete"'; }
busy() { tmux capture-pane -p -t "$P" | grep -q "esc to interrupt"; }
shot() { import -window root "$OUT/$1.png" 2>/dev/null; }
# turn <text>: say it to Codex, then answer what it asks until it finishes the turn
turn() {
  local before; before=$(turns)
  printf '%s' "$1" > /tmp/prompt.txt; tmux load-buffer -b cx /tmp/prompt.txt; tmux paste-buffer -d -p -b cx -t "$P"
  sleep 1.5; tmux send-keys -t "$P" Enter
  local end=$((SECONDS + 900)) s cmd
  while [ $SECONDS -lt $end ]; do
    s=$(tmux capture-pane -p -t "$P")
    # an approval: its first lines can be off a small screen, its choices and its command are not
    if grep -q "Yes, proceed (y)" <<<"$s" && grep -q "Press enter to confirm" <<<"$s"; then
      cmd=$(grep -m1 '^ *\$ ' <<<"$s" | sed 's/^ *\$ //')
      if [[ "$cmd" == reelplanner\ * || "$cmd" == "$(command -v node) "* ]]; then echo "approved: $cmd" >> "$OUT/approvals.txt"; tmux send-keys -t "$P" y
      else echo "declined: $cmd" >> "$OUT/approvals.txt"; tmux send-keys -t "$P" Escape; fi
      sleep 4; continue
    fi
    if [ "$(turns)" -gt "$before" ] && ! busy; then sleep 2; busy || return 0; fi
    sleep 2
  done
  return 1
}
check() { if eval "$2"; then echo "✓ $1" | tee -a "$OUT/report.md"; else echo "✗ $1" | tee -a "$OUT/report.md"; FAILED=$((FAILED + 1)); fi; }

run() {
  local record=0; [ "${1:-}" = --record ] && record=1
  rm -rf "$OUT"; mkdir -p "$OUT"; FAILED=0; : > "$OUT/approvals.txt"
  echo "# Codex's terminal review on Linux, $(date -u +%Y-%m-%dT%H:%MZ)" > "$OUT/report.md"
  echo "$(reelplanner --version) · $(codex --version) · $(ghostty --version 2>/dev/null | head -1) · terminal-browser $(terminal-browser --version 2>/dev/null)" >> "$OUT/report.md"
  screen
  # ec2-fresh's shutdown -h warns every terminal now and then, over Codex's screen: the same deadline, kept quietly
  if [ -f /run/systemd/shutdown/scheduled ]; then
    local at; at=$(sed -n 's/^USEC=//p' /run/systemd/shutdown/scheduled)
    sudo shutdown -c 2>/dev/null
    sudo systemd-run --quiet --unit=trial-poweroff --on-active="$(( at / 1000000 - $(date +%s) ))s" systemctl poweroff
  fi
  (cd "$DEMO" && reelplanner review --stop) > /dev/null 2>&1   # a server left from an earlier run
  (cd "$DEMO" && reelplanner review-setup --workspace terminal-browser --codex-allow-open > "$OUT/review-setup.txt" 2>&1)
  check "the opener rule is saved and allows the installed opener" "(cd $DEMO && reelplanner review-setup --check) >> $OUT/review-setup.txt 2>&1"
  tmux kill-server 2>/dev/null; pkill -x ghostty 2>/dev/null; sleep 1
  nohup ghostty --title=trial -e tmux new-session -s trial -c "$DEMO" > /tmp/ghostty-run.log 2>&1 &
  for _ in $(seq 1 30); do tmux has-session -t trial 2>/dev/null && break; sleep 1; done
  # the whole screen (Ghostty asks for maximized or fullscreen windows; this window manager does neither), then
  # activated: resized but not, Ghostty here draws a line now and then, and the screen falls behind the pane
  local w; w=$(xdotool search --name '^trial' | tail -1)
  [ -n "$w" ] && xdotool windowmove "$w" 0 0 windowsize "$w" 1920 1080 windowactivate --sync "$w" windowfocus --sync "$w"
  P=$(tmux display -p -t trial '#{pane_id}')
  local rec=""
  if [ $record = 1 ]; then
    # the page's sound too, when the null sink is up (the screen alone otherwise)
    local sound=(); pactl list short sources 2>/dev/null | grep -q 'trial.monitor' && sound=(-f pulse -i trial.monitor -c:a aac)
    ffmpeg -loglevel error -y -f x11grab -framerate 15 -video_size 1920x1080 -i :99 "${sound[@]}" \
      -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p "$OUT/trial.mp4" < /dev/null > /tmp/ffmpeg.log 2>&1 &
    rec=$!
  fi

  step "codex: open the review"
  tmux send-keys -t "$P" "clear; codex" Enter
  for _ in $(seq 1 60); do
    s=$(tmux capture-pane -p -t "$P")
    grep -q "Trust this folder" <<<"$s" && { tmux send-keys -t "$P" Enter; sleep 3; }
    grep -q "Ask Codex to do anything" <<<"$s" && break; sleep 1
  done
  turn "\$plan-to-video The plan video in videos/l2-upload-resume is already built. Open its review beside me in the terminal, then wait for my review."
  check "Codex ended its turn (15 min at most)" "[ $? = 0 ]"
  sleep 3; shot opened
  check "the review is open in terminal-browser beside Codex" "terminal-browser ls --all 2>/dev/null | grep -q '127.0.0.1:[0-9]*/?project=l2-upload-resume'"
  check "the opener ran with no approval asked (the saved rule)" "! grep -q 'review-open' $OUT/approvals.txt"

  step "reviewer: answer, comment, Send"
  local inbox; inbox=$(cd "$DEMO" && reelplanner inbox 2>/dev/null | grep -c 'l2-upload-resume-')
  node "$D/reviewer.mjs" > "$OUT/reviewer.txt" 2>&1; local reviewed=$?
  cat "$OUT/reviewer.txt"; shot sent
  check "a reviewer answered every question in the split and pressed Send" "[ $reviewed = 0 ]"
  check "the review is saved in the inbox" "[ \$(cd $DEMO && reelplanner inbox 2>/dev/null | grep -c 'l2-upload-resume-') -gt $inbox ]"

  step "codex: take it in"
  local reviews=$DEMO/eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume/reviews filed
  filed=$(ls "$reviews" | grep -c '^plan-.*\.json$')
  turn "I sent my review. Take it in and tell me what it says; don't revise the plan or rebuild anything yet."
  check "Codex ended its turn (15 min at most)" "[ $? = 0 ]"
  sleep 2; shot taken
  check "Codex took the review in (reel-intake filed it with the plan)" "[ \$(ls $reviews | grep -c '^plan-.*\\.json\$') -gt $filed ]"

  [ -n "$rec" ] && { kill -INT "$rec"; wait "$rec" 2>/dev/null; }
  # nothing left running: Codex (its window, and the background server that runs its turns), the review server
  tmux kill-server 2>/dev/null; for p in $(pgrep -f "codex app-server"); do kill "$p"; done
  (cd "$DEMO" && reelplanner review --stop) > /dev/null 2>&1
  # what Codex ran, and the first line of what each printed (the session's file stays here: it is the conversation)
  python3 - "$(ls -t "$HOME"/.codex/sessions/*/*/*/rollout-*.jsonl | head -1)" > "$OUT/commands.txt" <<'PY'
import json, re, sys
for line in open(sys.argv[1]):
    o = json.loads(line); p = o.get("payload") or {}
    if p.get("type") in ("custom_tool_call", "function_call"):
        # code mode's exec (tools.exec_command({cmd: "…"})) or a plain shell call ({"cmd": "…"})
        for cmd in re.findall(r'"?cmd"?\s*:\s*"((?:[^"\\]|\\.)*)"', p.get("input") or p.get("arguments") or ""): print("$", json.loads(f'"{cmd}"'))
    elif p.get("type") in ("custom_tool_call_output", "function_call_output"):
        out = p.get("output")
        for text in ([x.get("text", "") for x in out] if isinstance(out, list) else [str(out)]):
            try: v = json.loads(text)
            except ValueError: continue
            if isinstance(v, dict) and "output" in v: print("  ", (v["output"].strip().splitlines() or [""])[0][:200], f"(exit {v.get('exit_code')})")
PY
  { echo; echo "Approvals asked:"; sed 's/^/- /' "$OUT/approvals.txt"; } >> "$OUT/report.md"
  tar -czf "$HOME/codex-terminal.tgz" -C "$HOME" codex-terminal
  if [ $FAILED = 0 ]; then echo "✓ codex-terminal: every check passed"; else echo "✗ codex-terminal: $FAILED check(s) failed"; fi
}

case "${1:-}" in
  setup) setup ;;
  demo) demo ;;
  ready) ready ;;
  run) shift; run "$@" ;;
  *) awk 'NR > 1 && !/^#/ {exit} NR > 1' "$0" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac
