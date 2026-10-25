#!/usr/bin/env bash
# The terminal review beside a coding agent on Linux, as a person sees it, on one fresh EC2 machine (ec2-fresh.sh
# --shell, with this checkout packed): Ghostty on a virtual screen, tmux in it, and the agent in tmux (Codex with
# reelplanner's plugin and the saved opener rule; Claude Code with the skill and reelplanner's commands allowed). The
# agent is asked to open a built plan video's review beside it; a scripted reviewer answers that review in the split,
# asks for a change and presses Send; then nobody types: the split closes, Send wakes the agent, and it takes the
# review in, rebuilds the video and opens the new version (terminal-review/machine.sh says each check). The person
# logs each agent in on it by hand, once: nothing here handles a credential. The results come back; the machine, its
# security group and key pair are deleted whatever happens.
#
#   bash scripts/release/terminal-review.sh --profile <p> --out <dir> [--agents codex,claude] [--record]
#
#   --out <dir>        where the results go: outside the repo (they hold the agent's commands and the screen)
#   --agents <list>    codex, claude, or both (the default), run one after the other
#   --record           record the screen, with the page's sound, to trial.mp4
#   --type <type>      default c7i.2xlarge
#   --profile <name>   the AWS CLI profile
#   --keep             leave the machine up afterwards, to look around (prints how to reach and delete it)
#
# It costs a dollar or two of EC2 (setup is about 15 minutes; each run 10 to 40, most of it the agent rebuilding the
# video), plus the agents' turns on the logins used.
set -uo pipefail
OUT=""; RECORD=""; TYPE=c7i.2xlarge; PROFILE="${AWS_PROFILE:-}"; KEEP=0; AGENTS=codex,claude
while [ $# -gt 0 ]; do case "$1" in
  --out) OUT="$2"; shift 2 ;; --record) RECORD=--record; shift ;; --type) TYPE="$2"; shift 2 ;;
  --profile) PROFILE="$2"; shift 2 ;; --keep) KEEP=1; shift ;; --agents) AGENTS="$2"; shift 2 ;;
  -h|--help) awk 'NR > 1 && !/^#/ {exit} NR > 1' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $1 (--help lists them)" >&2; exit 2 ;;
esac; done
[ -n "$OUT" ] || { echo "✗ --out <dir> is needed" >&2; exit 2; }
IFS=, read -r -a LIST <<<"$AGENTS"
for a in "${LIST[@]}"; do case "$a" in codex|claude) ;; *) echo "✗ --agents takes codex and claude, not $a" >&2; exit 2 ;; esac; done
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"; LOG="$OUT/terminal-review.log"
say() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG" >&2; }
AWS=(aws); [ -n "$PROFILE" ] && AWS+=(--profile "$PROFILE")

ID=""; IP=""; KEY=""; SG=""; NAME=""; REGION=""
cleanup() {
  code=$?
  if [ -n "$ID" ] && [ $KEEP = 0 ]; then
    say "▶ deleting $ID (the logins on it go with it)"
    "${AWS[@]}" --region "$REGION" ec2 terminate-instances --instance-ids "$ID" > /dev/null
    "${AWS[@]}" --region "$REGION" ec2 wait instance-terminated --instance-ids "$ID"
    [ -n "$SG" ] && "${AWS[@]}" --region "$REGION" ec2 delete-security-group --group-id "$SG" > /dev/null
    [ -n "$NAME" ] && "${AWS[@]}" --region "$REGION" ec2 delete-key-pair --key-name "$NAME" > /dev/null
    say "✓ deleted $ID${SG:+, $SG}${NAME:+, key $NAME}"
    rm -rf "$(dirname "$KEY")"
  elif [ -n "$ID" ]; then
    say "△ kept: ssh -i $KEY ubuntu@$IP · delete it: ${AWS[*]} --region $REGION ec2 terminate-instances --instance-ids $ID, then the security group $SG and the key pair $NAME"
  fi
  exit "$code"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

say "▶ a fresh $TYPE with this checkout"
FRESH="$(bash "$REPO/scripts/release/ec2-fresh.sh" ${PROFILE:+--profile "$PROFILE"} --shell --type "$TYPE" --hours 4 2>&1 | tee -a "$LOG")"
# ec2-fresh's kept lines: "△ kept: <id> (<ip>) · ssh -i <key> ubuntu@<ip>" and
# "delete it: aws … --region <r> ec2 terminate-instances …, then the security group <sg> and the key pair <name>"
ID="$(sed -n 's/.*kept: \(i-[0-9a-f]*\) .*/\1/p' <<<"$FRESH" | tail -1)"
IP="$(sed -n 's/.*kept: i-[0-9a-f]* (\([0-9.]*\)).*/\1/p' <<<"$FRESH" | tail -1)"
KEY="$(sed -n 's/.*ssh -i \([^ ]*\) ubuntu@.*/\1/p' <<<"$FRESH" | tail -1)"
REGION="$(sed -n 's/.*--region \([a-z0-9-]*\) ec2 terminate.*/\1/p' <<<"$FRESH" | tail -1)"
SG="$(sed -n 's/.*security group \(sg-[0-9a-f]*\).*/\1/p' <<<"$FRESH" | tail -1)"
NAME="$(sed -n 's/.*key pair \([^ ]*\)$/\1/p' <<<"$FRESH" | tail -1)"
[ -n "$ID" ] && [ -n "$IP" ] && [ -s "$KEY" ] && [ -n "$REGION" ] || { say "✗ no machine: see $LOG"; exit 1; }
SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR -o ServerAliveInterval=30 "ubuntu@$IP")

# the trial's scripts, and the demo repo's content: a built plan video and the plan it was built from, as committed
COPYFILE_DISABLE=1 tar --no-xattrs -C "$REPO" -cf "$OUT/demo.tar" videos/l2-upload-resume eval/projects/media-service/.reelplanning
COPYFILE_DISABLE=1 tar --no-xattrs -C "$REPO/scripts/release/terminal-review" -cf - machine.sh reviewer.mjs \
  | "${SSH[@]}" 'mkdir -p /opt/rp/terminal-review && tar -xf - -C /opt/rp/terminal-review'
scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "$OUT/demo.tar" "ubuntu@$IP:/opt/rp/terminal-review/demo.tar"
rm -f "$OUT/demo.tar"
say "▶ setup"
"${SSH[@]}" 'bash /opt/rp/terminal-review/machine.sh setup' < /dev/null 2>&1 | tee -a "$LOG" | tail -1 >&2

LOGIN=(ssh -t -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "ubuntu@$IP")
for a in "${LIST[@]}"; do
  case "$a" in
    codex) say "▶ log in to Codex on it (a device code, in your browser):"
           say "    ${LOGIN[*]} 'export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; codex login --device-auth'" ;;
    claude) say "▶ log in to Claude Code on it (a link to open, then a code to paste back):"
            say "    ${LOGIN[*]} 'export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; claude auth login'" ;;
  esac
done
for a in "${LIST[@]}"; do
  until "${SSH[@]}" "bash /opt/rp/terminal-review/machine.sh ready $a" < /dev/null; do sleep 15; done
  say "✓ $a logged in"
done

FAILS=0
for a in "${LIST[@]}"; do
  say "▶ $a${RECORD:+, recorded}"
  "${SSH[@]}" "bash /opt/rp/terminal-review/machine.sh run $a $RECORD" < /dev/null 2>&1 | tee -a "$LOG" >&2
  RESULT="$(grep -E "^(✓|✗) $a-terminal" "$LOG" | tail -1)"
  scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "ubuntu@$IP:$a-terminal.tgz" "$OUT/" \
    && tar -xzf "$OUT/$a-terminal.tgz" -C "$OUT" && rm "$OUT/$a-terminal.tgz" \
    && say "✓ $OUT/$a-terminal: report.md, commands.txt, events.txt, screenshots${RECORD:+, trial.mp4}" \
    || say "✗ could not copy $a's results"
  say "${RESULT:-✗ $a-terminal: the trial did not finish}"; [[ "$RESULT" == ✓* ]] || FAILS=$((FAILS + 1))
done
[ $FAILS = 0 ]
