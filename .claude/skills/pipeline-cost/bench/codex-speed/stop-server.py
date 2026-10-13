import json,os,signal,sys
from pathlib import Path
repo=Path(sys.argv[1]).resolve()
path=repo/'.reelplanner/inbox/.server.json'
if path.exists():
    data=json.loads(path.read_text())
    pid=int(data['pid'])
    proc=Path('/proc')/str(pid)
    if not proc.exists():raise SystemExit(0)
    if (proc/'cwd').resolve()!=repo or b'/scripts/review.mjs' not in (proc/'cmdline').read_bytes():
        raise SystemExit('Server process does not match this benchmark repo')
    try:os.kill(pid,signal.SIGTERM)
    except ProcessLookupError:pass
