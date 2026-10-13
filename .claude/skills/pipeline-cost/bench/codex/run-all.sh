#!/usr/bin/env bash
set -euo pipefail
# Alternate conditions to reduce a simple time-of-day/cache-order bias.
for entry in baseline-1:baseline packet-1:packet baseline-2:baseline packet-2:packet; do
  label=${entry%:*}; variant=${entry#*:}
  bash /opt/rp/codex-bench/codex-machine.sh run "$label" "$variant" 40
  python3 - "$HOME/bench-results/$label/run.json" <<'STATUS'
import json,sys
run=json.load(open(sys.argv[1]))
if not run.get('completed'):
    if run.get('exit_code') in (124,137):
        print('BENCH_CENSORED '+run['label']+' (40-minute limit; preserving incomplete result)')
    else:
        sys.exit('BENCH_STOP '+run['label']+' (non-timeout failure; inspect before spending more)')
STATUS
done
echo BENCH_COMPLETE
