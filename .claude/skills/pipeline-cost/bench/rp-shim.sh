#!/usr/bin/env bash
# The bench's timing of reelplanner itself: put first on PATH as `reelplanner` and `reel`, it appends a line when a
# command starts and one when it ends (with its exit code) to $BENCH_TIMING, then runs the real command, in the
# foreground (its input and signals are its own). It sits outside reelplanner, so every version is timed the same way.
name="$(basename "$0")"; here="$(cd "$(dirname "$0")" && pwd)"
real="$(PATH="$(printf '%s' "$PATH" | tr ':' '\n' | grep -vxF "$here" | paste -sd: -)" command -v "$name")"
[ -n "$real" ] || { echo "✗ rp-shim: no $name on PATH past $here" >&2; exit 127; }
log="${BENCH_TIMING:-/dev/null}"; id="$$-$RANDOM"
line() { python3 - "$@" >> "$log" <<'PY'
import json, sys, time, os
ev, id_, rest = sys.argv[1], sys.argv[2], sys.argv[3:]
d = {"ev": ev, "id": id_, "at": int(time.time() * 1000)}
if ev == "start": d.update(cmd=rest[0], args=rest[1:], cwd=os.getcwd())
else: d["exit"] = int(rest[0])
print(json.dumps(d))
PY
}
line start "$id" "$name" "$@"
"$real" "$@"; code=$?
line end "$id" "$code"
exit $code
