#!/usr/bin/env bash
# On the machine terminal-review.sh starts: the terminal review beside a coding agent, as a person would see it.
#
#   machine.sh setup                        the tools: a virtual screen with Ghostty and tmux, Node 22, reelplanner (the
#                                           package in /opt/rp), Codex with reelplanner's plugin, Claude Code with the
#                                           skill and reelplanner's commands allowed (as the README says), terminal-browser;
#                                           a demo repo per agent (~/demo-codex, ~/demo-claude): a built plan video and its
#                                           plan (demo.tar, from the checkout)
#   machine.sh demo                         another demo repo, at DEMO=<dir> (for a second run on the same machine)
#   machine.sh ready codex|claude           exit 0 once that agent is logged in (by the person: nothing here handles a
#                                           credential)
#   machine.sh run codex|claude [--record]  the trial; its results in ~/<agent>-terminal.tgz, its last line ✓ or ✗
#
# The run: the agent in tmux in Ghostty, asked to open the video's review beside it (Codex with the saved opener rule,
# review-setup --codex-allow-open). Approvals it asks for are given (the machine is deleted afterwards) and listed. A
# scripted reviewer (reviewer.mjs) answers the review in that split, asks for a small change and presses Send. Then
# nobody types: the split closes, Send wakes the agent (Codex: a message the review server queues with `codex queue`;
# Claude Code: its background `review --wait` ends), and it takes the review in, rebuilds the video and opens the new
# version beside it. events.txt times each moment from the recording's start, for cutting the video.
set -uo pipefail
D=/opt/rp/terminal-review
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
  step "claude code"
  npm i -g @anthropic-ai/claude-code > /tmp/claude-install.log 2>&1 || { tail -5 /tmp/claude-install.log; return 1; }
  # the skill where Claude Code reads it (linked only there: Codex has its own, the plugin's), and the README's allow rules
  mkdir -p "$HOME/.claude/skills" && ln -sfn "$(npm root -g)/reelplanner/skills/plan-to-video" "$HOME/.claude/skills/plan-to-video"
  printf '{ "permissions": { "allow": ["Bash(reelplanner:*)", "Bash(reel:*)"] } }\n' > "$HOME/.claude/settings.json"
  step "ghostty, terminal-browser"
  sudo snap install ghostty --classic > /tmp/ghostty.log 2>&1 || { tail -3 /tmp/ghostty.log; return 1; }
  curl -fsSL https://terminal-browser.sh/install | bash > /tmp/tb-install.log 2>&1 || { tail -3 /tmp/tb-install.log; return 1; }
  DEMO=$HOME/demo-codex demo && DEMO=$HOME/demo-claude demo || return 1
  step "✓ set up: $(reelplanner --version), $(codex --version), Claude Code $(claude --version 2>/dev/null), $(ghostty --version 2>/dev/null | head -1), terminal-browser $(terminal-browser --version 2>/dev/null)"
}

# a demo repo at DEMO: a built plan video and its plan, committed
demo() {
  step "demo repo $DEMO"
  [ -e "$DEMO" ] && { echo "✗ $DEMO is there already: name another with DEMO=<dir>"; return 1; }
  mkdir -p "$DEMO" && tar -xf "$D/demo.tar" -C "$DEMO" || return 1
  git -C "$DEMO" init -q && git -C "$DEMO" add -A && git -C "$DEMO" -c user.name=trial -c user.email=trial@localhost commit -qm "a built plan video and its plan"
}

ready() {
  case "$1" in
    codex) codex login status 2>&1 | grep -q "Logged in" ;;
    claude) claude auth status --json 2>/dev/null | grep -q '"loggedIn": *true' ;;
    *) return 2 ;;
  esac
}

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

# What differs by agent: its conversation file, how a turn's end shows in it, the line it waits at, and how it asks
# Codex's turns end with a task_complete in its session file; Claude Code's with an end_turn
session() {
  if [ "$AGENT" = codex ]; then ls -t "$HOME"/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null | head -1
  else ls -t "$HOME"/.claude/projects/*/*.jsonl 2>/dev/null | head -1; fi
}
turns() {
  if [ "$AGENT" = codex ]; then cat "$HOME"/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null | grep -c '"type":"task_complete"'
  else cat "$HOME"/.claude/projects/*/*.jsonl 2>/dev/null | grep -c '"stop_reason":"end_turn"'; fi
}
# busy: working, or (Claude Code) its turn ended with background agents still at work, which wake it when they finish
busy() { tmux capture-pane -p -t "$P" | grep -q -E "esc to interrupt|Waiting for [0-9]+ background agent"; }
shot() { import -window root "$OUT/$1.png" 2>/dev/null; }
# a moment, in seconds from the recording's start
mark() { echo "$(( $(date +%s) - REC_START )) $*" >> "$OUT/events.txt"; }
# turn <text>: say it to the agent, then answer what it asks until it finishes the turn
turn() {
  local before; before=$(turns)
  printf '%s' "$1" > /tmp/prompt.txt; tmux load-buffer -b cx /tmp/prompt.txt; tmux paste-buffer -d -p -b cx -t "$P"
  sleep 1.5; tmux send-keys -t "$P" Enter
  # a picker the text opened ($skill in Codex, /command in Claude Code) can take that Enter: again, until it starts
  for _ in 1 2 3; do sleep 5; busy || [ "$(turns)" -gt "$before" ] && break; tmux send-keys -t "$P" Enter; done
  watch "$before" 900
}
# watch <turns before> <seconds>: answer what the agent asks until a turn after those has ended
watch() {
  local before=$1 end=$((SECONDS + $2)) s cmd
  while [ $SECONDS -lt $end ]; do
    s=$(tmux capture-pane -p -t "$P")
    # Codex's approval: its first lines can be off a small screen, its choices and its command are not
    if [ "$AGENT" = codex ] && grep -q "Yes, proceed (y)" <<<"$s" && grep -q "Press enter to confirm" <<<"$s"; then
      cmd=$(grep -m1 '^ *\$ ' <<<"$s" | sed 's/^ *\$ //')
      echo "approved: $cmd" >> "$OUT/approvals.txt"; tmux send-keys -t "$P" y; sleep 4; continue
    fi
    # Claude Code's: "Do you want to …?" over numbered choices, the first one Yes
    if [ "$AGENT" = claude ] && grep -q "❯ 1\. Yes" <<<"$s"; then
      cmd=$(grep -m1 -B4 "Do you want" <<<"$s" | grep -v -E "Do you want|^[ │─╭╰]*$" | head -2 | tr -s ' ' | tr '\n' ' ')
      echo "approved: ${cmd:-$(grep -m1 'Do you want' <<<"$s" | tr -s ' ')}" >> "$OUT/approvals.txt"; tmux send-keys -t "$P" Enter; sleep 4; continue
    fi
    # idle for 10 s: a background agent that just finished can take a moment to start the next turn
    if [ "$(turns)" -gt "$before" ] && ! busy; then sleep 5; busy || { sleep 5; busy || return 0; }; fi
    sleep 2
  done
  return 1
}
check() { if eval "$2"; then echo "✓ $1" | tee -a "$OUT/report.md"; else echo "✗ $1" | tee -a "$OUT/report.md"; FAILED=$((FAILED + 1)); fi; }
shown() { terminal-browser ls --all 2>/dev/null | grep -q 'project=l2-upload-resume'; }
panes() { tmux list-panes -t trial 2>/dev/null | wc -l; }
stop_all() {
  tmux kill-server 2>/dev/null; pkill -x ghostty 2>/dev/null; for p in $(pgrep -f "codex app-server"); do kill "$p"; done
  (cd "$DEMO" && reelplanner review --stop) > /dev/null 2>&1; sleep 1
}

run() {
  AGENT=${1:-}; shift || true
  case "$AGENT" in codex|claude) ;; *) echo "✗ run codex|claude [--record]"; return 2 ;; esac
  local record=0; [ "${1:-}" = --record ] && record=1
  OUT=$HOME/$AGENT-terminal; DEMO=${DEMO:-$HOME/demo-$AGENT}
  rm -rf "$OUT"; mkdir -p "$OUT"; FAILED=0; : > "$OUT/approvals.txt"; : > "$OUT/events.txt"; REC_START=$(date +%s)
  echo "# The terminal review beside $AGENT on Linux, $(date -u +%Y-%m-%dT%H:%MZ)" > "$OUT/report.md"
  echo "$(reelplanner --version) · $( [ "$AGENT" = codex ] && codex --version || echo "Claude Code $(claude --version 2>/dev/null)") · $(ghostty --version 2>/dev/null | head -1) · terminal-browser $(terminal-browser --version 2>/dev/null)" >> "$OUT/report.md"
  screen
  # ec2-fresh's shutdown -h warns every terminal now and then, over the agent's screen: the same deadline, kept quietly
  if [ -f /run/systemd/shutdown/scheduled ]; then
    local at; at=$(sed -n 's/^USEC=//p' /run/systemd/shutdown/scheduled)
    sudo shutdown -c 2>/dev/null
    sudo systemd-run --quiet --unit=trial-poweroff --on-active="$(( at / 1000000 - $(date +%s) ))s" systemctl poweroff
  fi
  stop_all   # an earlier run's agent, window and review server
  if [ "$AGENT" = codex ]; then
    (cd "$DEMO" && reelplanner review-setup --workspace terminal-browser --codex-allow-open > "$OUT/review-setup.txt" 2>&1)
    check "the opener rule is saved and allows the installed opener" "(cd $DEMO && reelplanner review-setup --check) >> $OUT/review-setup.txt 2>&1"
  else
    (cd "$DEMO" && reelplanner review-setup --workspace terminal-browser > "$OUT/review-setup.txt" 2>&1)
  fi
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
    rec=$!; REC_START=$(date +%s)
  fi

  step "$AGENT: open the review"
  tmux send-keys -t "$P" "clear; $AGENT" Enter
  local s ok=1
  for _ in $(seq 1 90); do
    s=$(tmux capture-pane -p -t "$P")
    if [ "$AGENT" = codex ]; then
      grep -q "Trust this folder" <<<"$s" && { tmux send-keys -t "$P" Enter; sleep 3; }
      grep -q "Ask Codex to do anything" <<<"$s" && { ok=0; break; }
    else
      # its input line's footer: "? for shortcuts", or the permission mode it is in ("… (shift+tab to cycle)")
      grep -q -E "\? for shortcuts|shift\+tab to cycle" <<<"$s" && { ok=0; break; }
      # the folder's trust question (its first choice is "No, exit") and an offer to try something new: the second
      # choice, as a person would pick it
      if grep -q -E "Yes, I trust this folder|Not now" <<<"$s"; then tmux send-keys -t "$P" Down; sleep 0.5; tmux send-keys -t "$P" Enter; sleep 3; continue; fi
      # a first run's other screens (the text style, notes): their first choice
      grep -q -E "❯|Press Enter|Enter to confirm" <<<"$s" && { tmux send-keys -t "$P" Enter; sleep 3; }
    fi
    sleep 1
  done
  check "$AGENT started, waiting for a request" "[ $ok = 0 ]"
  [ $ok = 0 ] || { stop_all; echo "✗ $AGENT-terminal: $AGENT did not start"; return 1; }
  mark asked
  turn "$( [ "$AGENT" = codex ] && echo '$' || echo '/')plan-to-video The plan video in videos/l2-upload-resume is already built; its plan, in eval/projects/media-service, is mine to change. Open its review beside me in the terminal, then wait for my review."
  check "$AGENT ended its turn (15 min at most)" "[ $? = 0 ]"
  sleep 3; shot opened; mark opened
  check "the review is open in terminal-browser, in a split beside $AGENT" "shown && [ \$(panes) = 2 ]"
  if [ "$AGENT" = codex ]; then
    check "the opener ran with no approval asked (the saved rule)" "! grep -q 'review-open' $OUT/approvals.txt"
    check "review connected this Codex session, so Send wakes it" "grep -q 'Send wakes this Codex session (codex:' \"\$(session)\""
  else
    check "Claude Code keeps a review waiter running in the background, so Send wakes it" "pgrep -af reelplanner | grep -q -- '--wait'"
  fi

  step "reviewer: answer, comment, ask for changes, Send"
  local reviews=$DEMO/eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume/reviews filed before
  filed=$(ls "$reviews" | grep -c '^plan-.*\.json$'); before=$(turns)
  mark reviewing
  node "$D/reviewer.mjs" > "$OUT/reviewer.txt" 2>&1; local reviewed=$?
  mark sent; cat "$OUT/reviewer.txt"; shot sent
  check "a reviewer answered every question in the split, asked for a change and pressed Send" "[ $reviewed = 0 ]"

  step "nobody types: the split closes, $AGENT wakes, rebuilds and reopens"
  local closed=1; for _ in $(seq 1 30); do shown || { closed=0; break; }; sleep 1; done
  [ $closed = 0 ] && mark closed; sleep 2; shot closed
  check "the split closed after Send (within 30 s), and only it" "[ $closed = 0 ] && [ \$(panes) = 1 ]"
  local wake='A reelplanner item is ready'; [ "$AGENT" = claude ] && wake='<task-notification>'
  local woke=1; for _ in $(seq 1 60); do grep -q "$wake" "$(session)" && { woke=0; break; }; sleep 1; done
  [ $woke = 0 ] && mark woke
  check "Send woke $AGENT with nobody typing (within 60 s)" "[ $woke = 0 ]"
  watch "$before" 2700
  check "$AGENT ended that turn (45 min at most)" "[ $? = 0 ]"
  sleep 3; mark reopened; shot reopened
  check "$AGENT took the review in (reel-intake filed it with the plan)" "[ \$(ls $reviews | grep -c '^plan-.*\\.json\$') -gt $filed ]"
  check "$AGENT opened the new version beside it, in a new split" "shown && [ \$(panes) = 2 ]"
  sleep 20; mark end

  [ -n "$rec" ] && { kill -INT "$rec"; wait "$rec" 2>/dev/null; }
  stop_all
  # what the agent ran, and the first line of what each printed (the conversation file stays here)
  python3 - "$(session)" > "$OUT/commands.txt" <<'PY'
import json, re, sys
def first(text): return (str(text).strip().splitlines() or [""])[0][:200]
for line in open(sys.argv[1]):
    o = json.loads(line); p = o.get("payload") or {}
    # Codex: code mode's exec (tools.exec_command({cmd: "…"})) or a plain shell call ({"cmd": "…"}), and its output
    if p.get("type") in ("custom_tool_call", "function_call"):
        for cmd in re.findall(r'"?cmd"?\s*:\s*"((?:[^"\\]|\\.)*)"', p.get("input") or p.get("arguments") or ""): print("$", json.loads(f'"{cmd}"'))
    elif p.get("type") in ("custom_tool_call_output", "function_call_output"):
        out = p.get("output")
        for text in ([x.get("text", "") for x in out] if isinstance(out, list) else [str(out)]):
            try: v = json.loads(text)
            except ValueError: continue
            if isinstance(v, dict) and "output" in v: print("  ", first(v["output"]), f"(exit {v.get('exit_code')})")
    # Claude Code: a Bash tool call, and its result
    for c in (o.get("message") or {}).get("content") or []:
        if not isinstance(c, dict): continue
        if c.get("type") == "tool_use" and c.get("name") == "Bash": print("$", (c.get("input") or {}).get("command", ""))
        elif c.get("type") == "tool_result":
            r = c.get("content"); print("  ", first(r if isinstance(r, str) else " ".join(x.get("text", "") for x in r or [] if isinstance(x, dict))))
PY
  { echo; echo "Approvals asked:"; sed 's/^/- /' "$OUT/approvals.txt"; } >> "$OUT/report.md"
  tar -czf "$HOME/$AGENT-terminal.tgz" -C "$HOME" "$AGENT-terminal"
  if [ $FAILED = 0 ]; then echo "✓ $AGENT-terminal: every check passed"; else echo "✗ $AGENT-terminal: $FAILED check(s) failed"; fi
}

case "${1:-}" in
  setup) setup ;;
  demo) demo ;;
  ready) ready "${2:-}" ;;
  run) shift; run "$@" ;;
  *) awk 'NR > 1 && !/^#/ {exit} NR > 1' "$0" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac
