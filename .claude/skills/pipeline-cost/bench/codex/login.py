#!/usr/bin/env python3
import json,os,sys
from pathlib import Path
base=Path(__file__).resolve().parent
try:
    state=json.loads((base/'state.json').read_text())
except (OSError,ValueError):
    sys.exit('Benchmark state is unavailable or being updated. Ask the agent to check setup.')
if state.get('deleted_at') or not Path(state.get('key','')).is_file():
    sys.exit('This benchmark machine has expired and was removed. The agent needs to recreate it before login.')
if not state.get('login_ready_at'):
    sys.exit('The new benchmark machine is still being set up. Wait for the agent’s ready message, then run this helper again.')
args=['ssh','-t','-i',state['key'],'-o','StrictHostKeyChecking=yes','-o',f'UserKnownHostsFile={base}/known_hosts',f"ubuntu@{state['ip']}",'bash /opt/rp/codex-bench/codex-machine.sh login']
os.execvp('ssh',args)
