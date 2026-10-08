#!/bin/sh
# Runs when the arm's container starts, as the agent's user, in the agent's folder: git init, the
# preflight, then Claude Code. The preflight's lines stay on screen until you press Enter, so you can
# copy them into SHEET.md first.
cd "$HOME/{{folder}}" || exit 1
# git init, and the built videos' media kept out of the site's history (site.exclude, D-305): in .git, so the
# folder the agent sees stays empty
[ -d .git ] || { git init -q && cat /opt/case-study/site.exclude >> .git/info/exclude; }
sh /opt/case-study/preflight.sh || exit 1
echo
printf 'Copy the lines above into SHEET.md (Preflight), then press Enter to start Claude Code. '
read -r _
exec claude --model "$MODEL"{{claude_args}}
