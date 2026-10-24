#!/usr/bin/env bash
# Codex's terminal review on Linux, as a person sees it, on one fresh EC2 machine (ec2-fresh.sh --shell, with this
# checkout packed): Ghostty on a virtual screen, tmux in it, and Codex in tmux with reelplanner's plugin and the saved
# opener rule (review-setup --codex-allow-open). Codex is asked to open a built plan video's review beside it; a
# scripted reviewer answers that review in the split and presses Send; Codex is told, and takes it in
# (codex-terminal/machine.sh says each check). The person logs Codex in on it by hand, once: nothing here handles a
# credential. The results come back; the machine, its security group and key pair are deleted whatever happens.
#
#   bash scripts/release/codex-terminal.sh --profile <p> --out <dir> [--record]
#
#   --out <dir>        where the results go: outside the repo (they hold Codex's commands and the screen)
#   --record           record the screen, with the page's sound, to trial.mp4
#   --type <type>      default c7i.2xlarge
#   --profile <name>   the AWS CLI profile
#   --keep             leave the machine up afterwards, to look around (prints how to reach and delete it)
#
# It costs well under a dollar of EC2 (setup is about 10 minutes, the trial 5), plus a few Codex turns on the
# login used.
set -uo pipefail
OUT=""; RECORD=""; TYPE=c7i.2xlarge; PROFILE="${AWS_PROFILE:-}"; KEEP=0
while [ $# -gt 0 ]; do case "$1" in
  --out) OUT="$2"; shift 2 ;; --record) RECORD=--record; shift ;; --type) TYPE="$2"; shift 2 ;;
  --profile) PROFILE="$2"; shift 2 ;; --keep) KEEP=1; shift ;;
  -h|--help) awk 'NR > 1 && !/^#/ {exit} NR > 1' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $1 (--help lists them)" >&2; exit 2 ;;
esac; done
[ -n "$OUT" ] || { echo "✗ --out <dir> is needed" >&2; exit 2; }
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"; LOG="$OUT/codex-terminal.log"
say() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG" >&2; }
AWS=(aws); [ -n "$PROFILE" ] && AWS+=(--profile "$PROFILE")

ID=""; IP=""; KEY=""; SG=""; NAME=""; REGION=""
cleanup() {
  code=$?
  if [ -n "$ID" ] && [ $KEEP = 0 ]; then
    say "▶ deleting $ID (the Codex login on it goes with it)"
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
FRESH="$(bash "$REPO/scripts/release/ec2-fresh.sh" ${PROFILE:+--profile "$PROFILE"} --shell --type "$TYPE" --hours 3 2>&1 | tee -a "$LOG")"
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
COPYFILE_DISABLE=1 tar --no-xattrs -C "$REPO/scripts/release/codex-terminal" -cf - machine.sh reviewer.mjs \
  | "${SSH[@]}" 'mkdir -p /opt/rp/codex-terminal && tar -xf - -C /opt/rp/codex-terminal'
scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "$OUT/demo.tar" "ubuntu@$IP:/opt/rp/codex-terminal/demo.tar"
rm -f "$OUT/demo.tar"
say "▶ setup"
"${SSH[@]}" 'bash /opt/rp/codex-terminal/machine.sh setup' < /dev/null 2>&1 | tee -a "$LOG" | tail -1 >&2

say "▶ log in to Codex on it (a device code, in your browser):"
say "    ssh -t -i $KEY -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$IP 'export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; codex login --device-auth'"
until "${SSH[@]}" 'bash /opt/rp/codex-terminal/machine.sh ready' < /dev/null; do sleep 15; done
say "✓ logged in"

say "▶ the trial${RECORD:+, recorded}"
"${SSH[@]}" "bash /opt/rp/codex-terminal/machine.sh run $RECORD" < /dev/null 2>&1 | tee -a "$LOG" >&2
RESULT="$(grep -E '^(✓|✗) codex-terminal' "$LOG" | tail -1)"
scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "ubuntu@$IP:codex-terminal.tgz" "$OUT/" \
  && tar -xzf "$OUT/codex-terminal.tgz" -C "$OUT" && rm "$OUT/codex-terminal.tgz" \
  && say "✓ $OUT/codex-terminal: report.md, commands.txt, screenshots${RECORD:+, trial.mp4}" \
  || say "✗ could not copy the results"
say "${RESULT:-✗ codex-terminal: the trial did not finish}"; [[ "$RESULT" == ✓* ]]
