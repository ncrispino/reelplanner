#!/bin/sh
# preflight: what can this session read before the prompt? Run as the agent's user, in its folder, with
# its HOME. Prints one line a check; exits 1 when anything but the prompt could steer the plan.
bad=0
ok()  { echo "✓ $*"; }
no()  { echo "✗ $*"; bad=1; }
here=$(pwd); show=$(echo "$here" | sed "s|^$HOME|~|")
n=$(ls -A | grep -vx '.git' | wc -l)
[ "$n" -eq 0 ] && ok "folder $show: empty (git init only)" || no "folder $show: $n file(s) already in it"
up=""; d=$(dirname "$here")
while :; do
  for f in CLAUDE.md AGENTS.md .claude; do [ -e "$d/$f" ] && up="$up ${d%/}/$f"; done
  [ "$d" = / ] && break; d=$(dirname "$d")
done
[ -z "$up" ] && ok "no CLAUDE.md or AGENTS.md above it" || no "above it:$up"
[ -e "$HOME/.claude/CLAUDE.md" ] && no "~/.claude/CLAUDE.md: your notes to every session" || ok "no ~/.claude/CLAUDE.md"
[ -e "$HOME/.reelplanning/you.jsonl" ] && no "~/.reelplanning/you.jsonl: reviewer memory" || ok "no ~/.reelplanning/you.jsonl: memory starts empty"
[ -n "$(ls -A "$HOME/.claude/projects" 2>/dev/null)" ] && no "past sessions in ~/.claude/projects" || ok "no past sessions"
found=$(find / -maxdepth 5 \( -path /proc -o -path /sys -o -path /dev -o -name node_modules \) -prune -o \( -name .git -o -name .reelplanning -o -name 'plan.html' -o -name baselines \) -print 2>/dev/null | grep -v "^$here/.git\$" | sort)
c=$(printf '%s' "$found" | grep -c .)
[ "$c" -eq 0 ] && ok "no other repos, plans or plan pages on disk" || no "$c other repos or plans on disk: $(printf '%s\n' "$found" | head -2 | tr '\n' ' ')…"
[ $bad -eq 0 ] && echo "✓ preflight: nothing to read but the prompt" || { echo "✗ preflight: stop, and start this arm again"; exit 1; }
