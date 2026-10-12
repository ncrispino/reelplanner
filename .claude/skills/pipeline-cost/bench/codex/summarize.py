"""Summarize private Codex benchmark evidence; no model-cost estimates or inferred request counts."""
import json,sys,collections,statistics
from pathlib import Path
from datetime import datetime

def rows(p):
 if not p.exists():return []
 out=[]
 for line in p.read_text().splitlines():
  try:out.append(json.loads(line))
  except ValueError:pass
 return out

def timestamp(e):
 try:return datetime.fromisoformat(e["timestamp"].replace("Z","+00:00")).timestamp()*1000
 except (KeyError,ValueError):return None

def usage_between(sessions,start,end):
 total=collections.Counter();auto_review=collections.Counter();exact_ids=set();auto_ids=set();fallback=0;updates=0;auto_sessions=0;auto_fallback=0
 auto_starts={};auto_turns=set();auto_intervals=[];auto_durations=[]
 for path in sessions.glob("*.jsonl"):
  events=rows(path);exact={};before={};after={};changes=set()
  source=(events[0].get("payload",{}).get("source") if events else None)
  guardian=isinstance(source,dict) and source.get("subagent",{}).get("other")=="guardian"
  for e in events:
   t=timestamp(e)
   if t is None or t>end:continue
   p=e.get("payload",{})
   if guardian and e.get("type")=="event_msg":
    if p.get("type")=="task_started":auto_starts[p["turn_id"]]=t
    elif p.get("type")=="task_complete" and start<t<=end and p["turn_id"] not in auto_turns:
     auto_turns.add(p["turn_id"])
     duration=p.get("duration_ms",0)
     began=auto_starts.pop(p["turn_id"],t-duration)
     auto_intervals.append((max(start,began),t));auto_durations.append(min(duration,t-start)/1000)
   if e.get("type")=="token_usage_record" and start<t<=end:
    rid=p.get("response_id");ids=auto_ids if guardian else exact_ids
    if rid and rid not in ids:
     ids.add(rid)
     for k,v in p.get("usage",{}).items():exact[k]=exact.get(k,0)+v
   elif e.get("type")=="event_msg" and p.get("type")=="token_count":
    cumulative=(p.get("info") or {}).get("total_token_usage")
    if cumulative:
     after=cumulative
     if t<=start:before=cumulative
     else:changes.add(json.dumps(cumulative,sort_keys=True))
  if guardian:
   if changes or exact:auto_sessions+=1
   if changes and not exact:auto_fallback+=1
   auto_review.update(exact or {k:max(0,v-before.get(k,0)) for k,v in after.items()})
   continue
  updates+=len(changes)
  if exact:total.update(exact)
  elif changes:
   fallback+=1
   total.update({k:max(0,v-before.get(k,0)) for k,v in after.items()})
 merged=[]
 for a,b in sorted(auto_intervals):
  if merged and a<=merged[-1][1]:merged[-1][1]=max(b,merged[-1][1])
  else:merged.append([a,b])
 timing={"completed_checks":len(auto_turns),"summed_turn_minutes":round(sum(auto_durations)/60,3),"union_turn_minutes":round(sum(b-a for a,b in merged)/60000,3),"median_seconds":statistics.median(auto_durations) if auto_durations else None}
 return {"tokens":dict(total),"model_requests":None if fallback else len(exact_ids),"cumulative_sessions":fallback,"usage_updates":updates,"auto_review_tokens":dict(auto_review),"auto_review_sessions":auto_sessions,"auto_review_requests":None if auto_fallback else len(auto_ids),"auto_review_timing":timing}

def summarize(folder):
 run=json.loads((folder/"run.json").read_text());review=rows(folder/"reviewer.jsonl")
 shown={}
 for e in review:
  if e.get("ev")=="shown":shown.setdefault(e["n"],e["shownAt"])
 sent=next((e["at"] for e in review if e.get("ev")=="review-sent" and e.get("status")==200),None)
 starts={};commands=[]
 for e in rows(folder/"timing.jsonl"):
  if e.get("ev")=="start":starts[e["id"]]=e
  elif e.get("ev")=="end" and e["id"] in starts:
   s=starts.pop(e["id"]);commands.append({**s,"end":e["at"],"exit":e["exit"]})
 episodes=[]
 boundaries=[]
 if 1 in shown:boundaries.append(("first",run["start"]*1000,shown[1]))
 elif run.get("end"):boundaries.append(("first-incomplete",run["start"]*1000,run["end"]*1000))
 if sent:
  if 2 in shown:boundaries.append(("revision",sent,shown[2]))
  elif run.get("end"):boundaries.append(("revision-incomplete",sent,run["end"]*1000))
 for name,start,end in boundaries:
  selected=[c for c in commands if start<=c["at"]<end]
  by_stage=collections.defaultdict(lambda:{"calls":0,"failed":0,"summed_command_seconds":0})
  timeline=[]
  for c in selected:
   a=c["args"];stage=" ".join(a[:2]) if a[:1]==["reel"] else (a[0] if a else c["cmd"])
   stats=by_stage[stage];stats["calls"]+=1;stats["failed"]+=c["exit"]!=0
   stats["summed_command_seconds"]+=max(0,min(c["end"],end)-max(c["at"],start))/1000
   timeline.append({"minute":round((c["at"]-start)/60000,2),"stage":stage,"args":a,"exit":c["exit"]})
  for stats in by_stage.values():stats["summed_command_seconds"]=round(stats["summed_command_seconds"],2)
  episodes.append({"episode":name,"complete":not name.endswith("incomplete"),"capped":name.endswith("incomplete") and run.get("exit_code") in (124,137),"minutes":round((end-start)/60000,2),"usage":usage_between(folder/"sessions",start,end),"commands":dict(by_stage),"timeline":timeline})
 observations=[]
 for obs in sorted(folder.glob("showing-*/observation.json")):
  meta=json.loads(obs.read_text());meta["capture_delay_seconds"]=round((meta["observedAt"]-meta["shownAt"])/1000,2)
  map_file=obs.parent/"plan-map.json"
  if map_file.exists():
   m=json.loads(map_file.read_text());meta.update(frames=len(m.get("frames",[])),decisions=len(m.get("decisions",[])),total_seconds=m.get("totalSeconds"))
  observations.append(meta)
 return {"label":run["label"],"variant":run["variant"],"completed":run.get("completed"),"elapsed_minutes":round((run.get("end",run["start"])-run["start"])/60,2),"episodes":episodes,"observations":observations,"unfinished_commands":len(starts)}

if __name__=="__main__":
 root=Path(sys.argv[1]);print(json.dumps([summarize(p.parent) for p in sorted(root.glob("*/run.json"))],indent=2))
