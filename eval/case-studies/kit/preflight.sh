#!/bin/sh
# preflight: what can this session read before the prompt? Run it as the agent's user, in the agent's
# folder, with the agent's HOME: it sees what the agent would see. One line a check; if any line is ✗,
# it exits 1 and the arm does not start. Paste its output first in the arm's SHEET.md.
# Run on your own machine (RUNBOOK.md, "Locally"), it checks the arm's own Claude Code config and reviewer
# memory: CLAUDE_CONFIG_DIR and REELPLANNER_HOME when they are set, as Claude Code and reelplanner read them.
# (From the case-study plan's draft, .reelplanner/plans/2026-09-26-case-study/drafts/preflight.sh.)
bad=0
ok()  { echo "✓ $*"; }
no()  { echo "✗ $*"; bad=1; }
# the folder by where it really is (what find / lists), and HOME either way: it can name the same place through a
# link (macOS's /var/… is /private/var/…), so ~ and ~/.claude are found by both spellings
rhome=$(cd "$HOME" 2>/dev/null && pwd -P || echo "$HOME")
tilde() { echo "$1" | sed -e "s|^$rhome|~|" -e "s|^$HOME|~|"; }
here=$(pwd -P); show=$(tilde "$here")
cc=${CLAUDE_CONFIG_DIR:-$HOME/.claude}; rp=${REELPLANNER_HOME:-$HOME/.reelplanner}
n=$(( $(ls -A | grep -vx '.git' | wc -l) ))
[ "$n" -eq 0 ] && ok "folder $show: empty (git init only)" || no "folder $show: $n file(s) already in it"
up=""; d=$(dirname "$here")
while :; do
  for f in CLAUDE.md AGENTS.md .claude; do [ -e "$d/$f" ] && [ "$d/$f" != "$HOME/.claude" ] && [ "$d/$f" != "$rhome/.claude" ] && up="$up ${d%/}/$f"; done
  [ "$d" = / ] && break; d=$(dirname "$d")
done
[ -z "$up" ] && ok "no CLAUDE.md or AGENTS.md above it" || no "above it:$up"
[ -e "$cc/CLAUDE.md" ] && no "$(tilde "$cc")/CLAUDE.md: notes to every session" || ok "no $(tilde "$cc")/CLAUDE.md"
[ -e "$rp/you.jsonl" ] && no "$(tilde "$rp")/you.jsonl: reviewer memory" || ok "no $(tilde "$rp")/you.jsonl: memory starts empty"
[ -n "$(ls -A "$cc/projects" 2>/dev/null)" ] && no "past sessions in $(tilde "$cc")/projects" || ok "no past sessions"
found=$(find / -maxdepth 5 \( -path /proc -o -path /sys -o -path /dev -o -name node_modules \) -prune -o \( -name .git -o -name .reelplanner -o -name 'plan.html' -o -name baselines \) -print 2>/dev/null | grep -v "^$here/.git\$" | sort)
c=$(printf '%s' "$found" | grep -c .)
[ "$c" -eq 0 ] && ok "no other repos, plans or plan pages on disk" || no "$c other repos or plans on disk: $(printf '%s\n' "$found" | head -2 | tr '\n' ' ')…"
[ $bad -eq 0 ] && echo "✓ preflight: nothing to read but the prompt" || { echo "✗ preflight: stop, and start this arm again"; exit 1; }
