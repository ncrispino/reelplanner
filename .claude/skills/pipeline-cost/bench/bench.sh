#!/usr/bin/env bash
# Bench runs of one version on one fresh EC2 machine: the machine (scripts/release/ec2-fresh.sh --shell, from the version
# under test, so its own package is packed and copied over), machine.sh setup, the person's Claude Code login (by hand,
# once: nothing here handles a credential), then each run in turn, its results copied back, and the machine, its
# security group and key pair deleted whatever happens.
#
#   bash .claude/skills/pipeline-cost/bench/bench.sh --ref local       --runs new-1,new-2   --profile <p> --out <dir>
#   bash .claude/skills/pipeline-cost/bench/bench.sh --ref origin/main --runs main-1,main-2 --profile <p> --out <dir>
#
#   --ref <ref>        what is measured: `local` (this checkout as it is on disk) or a git ref (a worktree of it)
#   --runs <a,b>       the runs' names, run one after another: in their telemetry (bench.run) and results, <out>/<name>.tgz
#   --out <dir>        where the results go; outside the repo (they hold transcripts)
#   --minutes <n>      a run stops after n minutes, revised video shown or not (default 150)
#   --depth <d>        low, medium or high: the request asks for a video of that depth (#34); without it the
#                      request is the baseline's, word for word
#   --type <type>      default c7i.4xlarge, as the baseline
#   --profile <name>   the AWS CLI profile
set -uo pipefail
REF=local; RUNS=""; OUT=""; MINUTES=150; DEPTH=""; TYPE=c7i.4xlarge; PROFILE="${AWS_PROFILE:-}"
while [ $# -gt 0 ]; do case "$1" in
  --ref) REF="$2"; shift 2 ;; --runs) RUNS="$2"; shift 2 ;; --out) OUT="$2"; shift 2 ;;
  --minutes) MINUTES="$2"; shift 2 ;; --depth) DEPTH="$2"; shift 2 ;; --type) TYPE="$2"; shift 2 ;; --profile) PROFILE="$2"; shift 2 ;;
  -h|--help) awk 'NR > 1 && !/^#/ {exit} NR > 1' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $1" >&2; exit 2 ;;
esac; done
[[ "$RUNS" =~ ^[a-z0-9-]+(,[a-z0-9-]+)*$ ]] || { echo "✗ --runs: names of lowercase letters, digits and dashes, comma-separated" >&2; exit 2; }
[ -n "$OUT" ] || { echo "✗ --out <dir> is needed" >&2; exit 2; }
[[ "$DEPTH" =~ ^(|low|medium|high)$ ]] || { echo "✗ --depth: low, medium or high" >&2; exit 2; }
B="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$B/../../../.." && pwd)"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"; LOG="$OUT/bench-${RUNS//,/_}.log"
say() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG" >&2; }
AWS=(aws); [ -n "$PROFILE" ] && AWS+=(--profile "$PROFILE")

# the version under test: this checkout, or a worktree of the ref (its own ec2-fresh.sh packs it)
SRC="$REPO"; WT=""
if [ "$REF" != local ]; then
  WT="$(mktemp -d "${TMPDIR:-/tmp}/rp-bench-wt-XXXXXX")"; rmdir "$WT"
  git -C "$REPO" worktree add -q --detach "$WT" "$REF" || { say "✗ no worktree of $REF"; exit 1; }
  SRC="$WT"
fi

ID=""; IP=""; KEY=""; SG=""; NAME=""; REGION=""
cleanup() {
  code=$?
  if [ -n "$ID" ]; then
    say "▶ deleting $ID (the Claude Code login on it goes with it)"
    "${AWS[@]}" --region "$REGION" ec2 terminate-instances --instance-ids "$ID" >/dev/null
    "${AWS[@]}" --region "$REGION" ec2 wait instance-terminated --instance-ids "$ID"
    [ -n "$SG" ] && "${AWS[@]}" --region "$REGION" ec2 delete-security-group --group-id "$SG" >/dev/null
    [ -n "$NAME" ] && "${AWS[@]}" --region "$REGION" ec2 delete-key-pair --key-name "$NAME" >/dev/null
    say "✓ deleted $ID${SG:+, $SG}${NAME:+, key $NAME}"
  fi
  [ -n "$KEY" ] && rm -rf "$(dirname "$KEY")"
  [ -n "$WT" ] && git -C "$REPO" worktree remove --force "$WT"
  exit "$code"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

say "▶ $RUNS: $REF on a fresh $TYPE"
FRESH="$(bash "$SRC/scripts/release/ec2-fresh.sh" ${PROFILE:+--profile "$PROFILE"} --shell --type "$TYPE" --hours 8 2>&1 | tee -a "$LOG")"
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

COPYFILE_DISABLE=1 tar -C "$B" -cf - otel-sink.mjs rp-shim.sh reviewer.mjs machine.sh | "${SSH[@]}" 'mkdir -p /opt/rp/bench && tar -xf - -C /opt/rp/bench'
say "▶ setup"
"${SSH[@]}" 'bash /opt/rp/bench/machine.sh setup' </dev/null 2>&1 | tee -a "$LOG" | tail -1 >&2

# the login: by the person, in Claude Code itself
say "▶ log in to Claude Code on it, then quit Claude Code (/exit):"
say "    ssh -t -i $KEY -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$IP 'export PATH=\$HOME/.local/bin:\$PATH; claude'"
until "${SSH[@]}" 'bash /opt/rp/bench/machine.sh ready' </dev/null; do sleep 20; done
say "✓ logged in"

IFS=, read -ra LABELS <<<"$RUNS"
for label in "${LABELS[@]}"; do
  say "▶ $label (up to $MINUTES min${DEPTH:+, $DEPTH depth})"
  "${SSH[@]}" "nohup bash /opt/rp/bench/machine.sh run $label $MINUTES $DEPTH > ~/bench-run-$label.log 2>&1 &" </dev/null
  end=$((SECONDS + (MINUTES + 15) * 60))
  until "${SSH[@]}" "grep -q '^✓ $label' ~/bench-run-$label.log" </dev/null 2>/dev/null; do
    [ $SECONDS -ge $end ] && { say "✗ $label: no results after $((MINUTES + 15)) min"; break; }
    sleep 60
  done
  scp -q -i "$KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "ubuntu@$IP:bench-$label.tgz" "$OUT/$label.tgz" \
    && say "✓ $OUT/$label.tgz ($(du -h "$OUT/$label.tgz" | cut -f1)) · $("${SSH[@]}" "tail -1 ~/bench-run-$label.log" </dev/null)" \
    || say "✗ $label: could not copy the results"
done
