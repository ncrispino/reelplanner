"""Collect only this trial's session records; never auth or configuration."""
import json,os,sys,shutil
from datetime import datetime
from pathlib import Path
repo,out=map(Path,sys.argv[1:])
run=json.loads((out/'run.json').read_text())
home=Path(os.environ['CODEX_HOME'])
dest=out/'sessions';dest.mkdir(exist_ok=True)
for source in (home/'sessions').glob('**/*.jsonl'):
    with source.open() as stream:
        try:meta=json.loads(stream.readline())
        except ValueError:continue
    try:started=datetime.fromisoformat(meta['timestamp'].replace('Z','+00:00')).timestamp()
    except (ValueError,KeyError):continue
    if started>=run['start']:shutil.copy2(source,dest/source.name)
print(json.dumps({'label':run['label'],'completed':run['completed'],'exit_code':run['exit_code']}),flush=True)
