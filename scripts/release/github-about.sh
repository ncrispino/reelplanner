#!/bin/sh
# Apply the repo page's About box (the description and the topics) from docs/github-topics.txt, with your own
# GitHub CLI login (`gh auth login`; setting topics needs admin rights on the repo, so it is run by its owner).
#
#   sh scripts/release/github-about.sh [<owner/repo>]   default: ncrispino/reelplanner
#   sh scripts/release/github-about.sh --dry-run [<owner/repo>]   print the command, change nothing
#
# The topics replace the repo's current ones (gh repo edit --add-topic adds; --remove-topic drops the rest).
set -eu
DRY=0; [ "${1:-}" = "--dry-run" ] && { DRY=1; shift; }
REPO=${1:-ncrispino/reelplanner}
here=$(cd "$(dirname "$0")/../.." && pwd); f="$here/docs/github-topics.txt"
[ -f "$f" ] || { echo "✗ $f not found" >&2; exit 1; }
desc=$(awk '/^Description/{getline; print; exit}' "$f")
topics=$(sed -n '/^Topics/,$p' "$f" | grep -E '^[a-z0-9][a-z0-9-]*$' | paste -sd, -)
[ -n "$desc" ] && [ -n "$topics" ] || { echo "✗ no description or topics in $f" >&2; exit 1; }
n=$(printf '%s\n' "$topics" | tr ',' '\n' | grep -c .)
[ "$n" -le 20 ] || { echo "✗ $n topics: GitHub takes at most 20" >&2; exit 1; }
if [ "$DRY" = 1 ]; then
  echo "would set on $REPO:"; echo "  description: $desc"; echo "  topics ($n): $topics"; exit 0
fi
command -v gh >/dev/null 2>&1 || { echo "✗ the GitHub CLI (gh) is not installed: https://cli.github.com" >&2; exit 1; }
# the repo's topics not in the list, to remove (so the list is exactly what the repo ends up with)
keep="${TMPDIR:-/tmp}/rp-topics.$$"; printf '%s\n' "$topics" | tr ',' '\n' > "$keep"
drop=$(gh repo view "$REPO" --json repositoryTopics --jq '.repositoryTopics[]?.name' 2>/dev/null | grep -v -x -F -f "$keep" | paste -sd, - || true)
rm -f "$keep"
gh repo edit "$REPO" --description "$desc" --add-topic "$topics" ${drop:+--remove-topic "$drop"}
echo "✓ $REPO: description and $n topics set${drop:+ (removed: $drop)}"
