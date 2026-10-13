#!/usr/bin/env bash
set -uo pipefail
name=$(basename "$0")
id="$$-$RANDOM"
line() { python3 - "$@" >> "$BENCH_TIMING" <<'PY'
import json,sys,time,os
ev,id,*args=sys.argv[1:]
d={'ev':ev,'id':id,'at':int(time.time()*1000)}
if ev=='start':d.update(cmd=args[0],args=args[1:],cwd=os.getcwd())
else:d['exit']=int(args[0])
print(json.dumps(d))
PY
}
line start "$id" "$name" "$@"
if [ "$name" == reel ]; then
  node "$RP_BENCH_PACKAGE/bin/reel.mjs" "$@"
else
  node "$RP_BENCH_PACKAGE/bin/reelplanner.mjs" "$@"
fi
code=$?
line end "$id" "$code"
exit "$code"
