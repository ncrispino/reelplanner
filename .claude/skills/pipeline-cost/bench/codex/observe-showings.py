"""Capture synthetic video artifacts at each measured showing, without changing a trial."""
import json,time,shutil
from pathlib import Path
root=Path.home()/"bench-results"
deadline=time.monotonic()+3*60*60
while time.monotonic()<deadline:
 for timing in root.glob("*/timing.jsonl"):
  starts={};showings=[]
  for line in timing.read_text().splitlines():
   try:e=json.loads(line)
   except ValueError:continue
   if e.get("ev")=="start":starts[e["id"]]=e
   elif e.get("ev")=="end" and e.get("exit")==0:
    s=starts.get(e["id"],{});a=s.get("args",[])
    if s.get("cmd")=="reelplanner" and a[:1]==["review"] and "--detach" in a:
     target=next((x for x in a[1:] if not x.startswith("--")),None)
     if target:
      source=Path(target)
      if not source.is_absolute():source=Path(s["cwd"])/source
      showings.append((e["at"],source))
  for n,(at,source) in enumerate(showings,1):
   dest=timing.parent/f"showing-{n}"
   if dest.exists():continue
   dest.mkdir()
   meta={"shownAt":at,"observedAt":int(time.time()*1000),"source":str(source)}
   for p in source.rglob("*"):
    if not p.is_file() or p.is_symlink():continue
    rel=p.relative_to(source)
    if any(v in ("node_modules",".git") for v in rel.parts):continue
    if p.suffix.lower() not in (".md",".json",".html",".png",".jpg",".jpeg",".svg",".css",".js"):continue
    q=dest/rel;q.parent.mkdir(parents=True,exist_ok=True)
    try:shutil.copy2(p,q)
    except FileNotFoundError:pass
   (dest/"observation.json").write_text(json.dumps(meta,indent=2)+"\n")
 time.sleep(1)
