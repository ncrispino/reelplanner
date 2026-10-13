import json,sys,time,re
from pathlib import Path
repo,out,code=Path(sys.argv[1]),Path(sys.argv[2]),int(sys.argv[3])
run=json.loads((out/'run.json').read_text());run.update(end=time.time(),exit_code=code,completed=(out/'done.json').is_file())
usage={}; seen=set(); fallback_sessions=0; usage_updates=0
# This is a dedicated VM's fresh benchmark history; archive only records started in this run.
for p in (Path.home()/'.codex/sessions').glob('**/*.jsonl'):
    first=p.open().readline()
    try: meta=json.loads(first)
    except Exception: continue
    t=meta.get('timestamp','')
    from datetime import datetime
    try: started=datetime.fromisoformat(t.replace('Z','+00:00')).timestamp()
    except ValueError: continue
    if started<run['start']:continue
    dest=out/'sessions'/p.name;dest.parent.mkdir(exist_ok=True)
    dest.write_bytes(p.read_bytes())
    exact={}; cumulative={}; updates=set()
    for line in p.open():
        try: d=json.loads(line)
        except ValueError:continue
        v=d.get('payload',{})
        if d.get('type')=='token_usage_record' and v.get('response_id') not in seen:
            seen.add(v.get('response_id'))
            for k,n in v.get('usage',{}).items():exact[k]=exact.get(k,0)+n
        elif d.get('type')=='event_msg' and v.get('type')=='token_count':
            total=(v.get('info') or {}).get('total_token_usage')
            if total: cumulative=total; updates.add(json.dumps(total,sort_keys=True))
    if not exact and cumulative: fallback_sessions+=1
    usage_updates+=len(updates)
    for k,n in (exact or cumulative).items():usage[k]=usage.get(k,0)+n
run['usage']=usage;run['model_requests']=None if fallback_sessions else len(seen)
run['usage_update_count']=usage_updates;run['fallback_cumulative_sessions']=fallback_sessions
run['scene_counts']=[]
for p in repo.glob('.reelplanner/plans/*/video/STORYBOARD.md'):
    run['scene_counts'].append({'video':p.parent.parent.name,'count':len(re.findall(r'^## Frame ',p.read_text(),re.M))})
(out/'run.json').write_text(json.dumps(run,indent=2)+'\n')
print(json.dumps({'label':run['label'],'completed':run['completed'],'seconds':round(run['end']-run['start']),'requests':run['model_requests']}))
