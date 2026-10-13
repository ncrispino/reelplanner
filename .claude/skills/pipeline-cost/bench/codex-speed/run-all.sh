#!/usr/bin/env bash
set -euo pipefail
B=/opt/rp/codex-bench
for label in before-1 after-1 after-2 before-2; do
  bash "$B/codex-machine.sh" run "$label" "${label%-*}"
  python3 - "$HOME/bench-results/$label/run.json" <<'PY'
import json,sys
run=json.load(open(sys.argv[1]))
if not run.get('completed') and run.get('exit_code')!=124:
    raise SystemExit('Stop on non-timeout failure: '+run['label'])
print('TRIAL_COMPLETE '+run['label']+' complete='+str(run['completed']),flush=True)
PY
done
echo SUITE_COMPLETE
