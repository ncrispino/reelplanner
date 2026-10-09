#!/usr/bin/env bash
# A fresh machine in the cloud (docs/releasing.md, "Check it from a fresh machine"): one EC2 instance, a real VM where
# the GitHub workflow has a container, to run the fresh-install check on (scripts/release/fresh-install.sh: the
# README's Install as a new user) and time it. It copies the check's log back and deletes all it made: the instance,
# its security group and its key pair. Your AWS credentials, as the AWS CLI finds them (AWS_PROFILE, or --profile).
#
#   bash scripts/release/ec2-fresh.sh --times                  this checkout, packed, on Ubuntu 24.04 (x86_64)
#   bash scripts/release/ec2-fresh.sh --profile mas --from github:ncrispino/reelplanner#main
#
#   --profile <name>   the AWS CLI profile (default: $AWS_PROFILE, else the CLI's own default)
#   --region <name>    default: $AWS_REGION, else the profile's region, else us-east-1 (its default VPC is used)
#   --type <type>      the instance type (default t3.medium, 2 vCPU and 4 GB; t4g.medium with --arch arm64)
#   --arch <arch>      x86_64 (default) or arm64
#   --from <source>    what `npm i -g` installs: `local` (default: this checkout, `npm pack`ed and copied over, so
#                      what you have not pushed is checked too) or an npm spec (github:<owner>/<repo>#<ref>)
#   --node 22|apt      as fresh-install.sh (default 22)
#   --times            as fresh-install.sh: every line of each step, stamped with its seconds
#   --container <img>  run the check in a container of that image on the instance (ubuntu:24.04: the bare image the
#                      GitHub workflow uses, which lacks what a server image has), instead of on the VM itself
#   --keep             leave the instance up afterwards (prints how to reach it and how to delete it)
#
# It costs a few cents (t3.medium is about $0.04 an hour; the check takes 10 to 20 minutes). The instance shuts
# itself down and is terminated after 2 hours whatever happens to this script. Everything it makes is tagged
# reelplanner=fresh-install.
set -uo pipefail

PROFILE="${AWS_PROFILE:-}"; REGION=""; TYPE=""; ARCH=x86_64; FROM=local; NODE=22; TIMES=""; KEEP=0; IMAGE=""
while [ $# -gt 0 ]; do case "$1" in
  --profile) PROFILE="$2"; shift 2 ;;
  --region) REGION="$2"; shift 2 ;;
  --type) TYPE="$2"; shift 2 ;;
  --arch) ARCH="$2"; shift 2 ;;
  --from) FROM="$2"; shift 2 ;;
  --node) NODE="$2"; shift 2 ;;
  --times) TIMES="--times"; shift ;;
  --keep) KEEP=1; shift ;;
  --container) IMAGE="$2"; shift 2 ;;
  -h|--help) sed -n '2,26p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) echo "✗ unknown option: $1 (--help lists them)" >&2; exit 2 ;;
esac; done
case "$ARCH" in x86_64) AMI_ARCH=amd64; TYPE=${TYPE:-t3.medium} ;; arm64) AMI_ARCH=arm64; TYPE=${TYPE:-t4g.medium} ;;
  *) echo "✗ --arch is x86_64 or arm64, not $ARCH" >&2; exit 2 ;; esac
command -v aws >/dev/null || { echo "✗ the AWS CLI (aws) is not on PATH" >&2; exit 2; }

HERE="$(cd "$(dirname "$0")/../.." && pwd)"
P=(); [ -n "$PROFILE" ] && P=(--profile "$PROFILE")
REGION=${REGION:-${AWS_REGION:-${AWS_DEFAULT_REGION:-$(aws "${P[@]}" configure get region 2>/dev/null)}}}; REGION=${REGION:-us-east-1}
aws_() { aws "${P[@]}" --region "$REGION" --output text "$@"; }
TAG="reelplanner-fresh-$(date +%Y%m%d-%H%M%S)-$$"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/rp-ec2-XXXXXX")"
LOGS="${TMPDIR:-/tmp}/reelplanner-ec2"; mkdir -p "$LOGS"; LOG="$LOGS/$TAG.log"
ID=""; SG=""; KEY=""
say() { printf '%s\n' "$*" >&2; }

cleanup() {
  code=$?
  if [ "$KEEP" = 1 ] && [ -n "$ID" ]; then
    say "△ kept: $ID ($IP) · ssh -i $WORK/key ubuntu@$IP"
    say "  delete it: aws ${P[*]} --region $REGION ec2 terminate-instances --instance-ids $ID, then the security group $SG and the key pair $KEY"
    exit "$code"
  fi
  say "▶ deleting what it made"
  if [ -n "$ID" ]; then aws_ ec2 terminate-instances --instance-ids "$ID" >/dev/null && aws_ ec2 wait instance-terminated --instance-ids "$ID"; fi
  [ -n "$SG" ] && { aws_ ec2 delete-security-group --group-id "$SG" >/dev/null || say "△ could not delete security group $SG"; }
  [ -n "$KEY" ] && aws_ ec2 delete-key-pair --key-name "$KEY" >/dev/null
  rm -rf "$WORK"
  say "✓ deleted: ${ID:-no instance}${SG:+, $SG}${KEY:+, key $KEY} · the log: $LOG"
  exit "$code"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

say "▶ $(aws_ sts get-caller-identity --query Arn) · $REGION · $TYPE ($ARCH)"
AMI="$(aws_ ssm get-parameter --name "/aws/service/canonical/ubuntu/server/24.04/stable/current/$AMI_ARCH/hvm/ebs-gp3/ami-id" --query Parameter.Value)" \
  || { say "✗ no Ubuntu 24.04 image found in $REGION"; exit 1; }

# what it installs: a packed copy of this checkout, or the npm spec as given
if [ "$FROM" = local ]; then
  say "▶ npm pack (this checkout, as it is on disk)"
  TGZ="$(cd "$HERE" && npm pack --silent --pack-destination "$WORK" 2>/dev/null | tail -n 1)" || { say "✗ npm pack failed"; exit 1; }
  SPEC="/opt/rp/$TGZ"
else SPEC="$FROM"; fi

KEY="$TAG"
aws_ ec2 create-key-pair --key-name "$KEY" --key-type ed25519 --query KeyMaterial \
  --tag-specifications "ResourceType=key-pair,Tags=[{Key=reelplanner,Value=fresh-install}]" > "$WORK/key" && chmod 600 "$WORK/key" || exit 1
VPC="$(aws_ ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId')"
[ -n "$VPC" ] && [ "$VPC" != None ] || { say "✗ no default VPC in $REGION"; exit 1; }
SG="$(aws_ ec2 create-security-group --group-name "$TAG" --description "reelplanner fresh-install check, deleted after it" --vpc-id "$VPC" \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=reelplanner,Value=fresh-install}]" --query GroupId)" || exit 1
MYIP="$(curl -fsS https://checkip.amazonaws.com | tr -d '[:space:]')"
aws_ ec2 authorize-security-group-ingress --group-id "$SG" --protocol tcp --port 22 --cidr "$MYIP/32" >/dev/null || exit 1

# it shuts itself down (and so is terminated) after 2 hours, whatever happens here
printf '#!/bin/bash\nshutdown -h +120\n' > "$WORK/user-data"
ID="$(aws_ ec2 run-instances --image-id "$AMI" --instance-type "$TYPE" --key-name "$KEY" --security-group-ids "$SG" \
  --instance-initiated-shutdown-behavior terminate --user-data "file://$WORK/user-data" \
  --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=30,VolumeType=gp3,DeleteOnTermination=true}' \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$TAG},{Key=reelplanner,Value=fresh-install}]" \
  --query 'Instances[0].InstanceId')" || { say "✗ run-instances failed"; exit 1; }
say "▶ $ID starting"
aws_ ec2 wait instance-running --instance-ids "$ID" || exit 1
IP="$(aws_ ec2 describe-instances --instance-ids "$ID" --query 'Reservations[0].Instances[0].PublicIpAddress')"
SSH=(ssh -i "$WORK/key" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR -o ConnectTimeout=10 -o ServerAliveInterval=30 "ubuntu@$IP")
for _ in $(seq 1 36); do "${SSH[@]}" true </dev/null 2>/dev/null && break; sleep 5; done
"${SSH[@]}" true </dev/null || { say "✗ no ssh to $IP"; exit 1; }
# the image's own first-boot apt run holds the package lock: wait it out
"${SSH[@]}" 'cloud-init status --wait >/dev/null 2>&1; sudo mkdir -p /opt/rp && sudo chown ubuntu /opt/rp' </dev/null

# the files the check reads (the README's Install, the script) and the package, as they are in this checkout
# (macOS's tar would add its extended attributes, which GNU tar warns about)
NOX=(); tar --no-xattrs -cf /dev/null "$0" 2>/dev/null && NOX=(--no-xattrs)
(cd "$HERE" && COPYFILE_DISABLE=1 tar "${NOX[@]}" -c README.md scripts/release/fresh-install.sh) | "${SSH[@]}" 'tar -x -C /opt/rp'
[ "$FROM" = local ] && scp -q -i "$WORK/key" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR "$WORK/$TGZ" "ubuntu@$IP:/opt/rp/"
"${SSH[@]}" 'chmod -R a+rX /opt/rp' </dev/null

if [ -n "$IMAGE" ]; then
  say "▶ docker, for the check in $IMAGE"
  "${SSH[@]}" 'sudo apt-get update -q >/dev/null 2>&1; sudo apt-get install -y -q docker.io >/dev/null 2>&1 && sudo docker version --format "{{.Server.Version}}" >/dev/null' </dev/null || { say "✗ docker did not install"; exit 1; }
  RUN="sudo docker run --rm -v /opt/rp:/opt/rp:ro $IMAGE bash /opt/rp/scripts/release/fresh-install.sh --node $NODE --from '$SPEC' $TIMES"
else RUN="sudo bash /opt/rp/scripts/release/fresh-install.sh --node $NODE --from '$SPEC' $TIMES"; fi
say "▶ the fresh-install check on $ID${IMAGE:+ in $IMAGE}, installing $SPEC (10 to 20 minutes)"
"${SSH[@]}" "$RUN" </dev/null 2>&1 | tee "$LOG"
exit "${PIPESTATUS[0]}"
