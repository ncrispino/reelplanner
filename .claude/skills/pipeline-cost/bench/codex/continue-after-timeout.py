"""Continue capped comparisons from an older batch, then resume its collector."""
import json,os,re,signal,subprocess,time
from pathlib import Path
B=Path(__file__).resolve().parent
s=json.loads((B/"state.json").read_text())
ssh=["ssh","-i",s["key"],"-o","StrictHostKeyChecking=yes","-o",f"UserKnownHostsFile={B}/known_hosts","-o","ServerAliveInterval=30",f"ubuntu@{s['ip']}"]
labels=[("baseline-1","baseline"),("packet-1","packet"),("baseline-2","baseline"),("packet-2","packet")]
def remote_run(label,variant):
 command=f"bash /opt/rp/codex-bench/codex-machine.sh run {label} {variant} 40"
 with (B/"continuation-run.log").open("a") as out:
  subprocess.run(ssh+[command],stdout=out,stderr=subprocess.STDOUT,timeout=43*60,check=True)
 return read_run(label)
def read_run(label):
 result=subprocess.run(ssh+[f"cat /home/ubuntu/bench-results/{label}/run.json"],capture_output=True,text=True,timeout=30,check=True)
 return json.loads(result.stdout)
def allowed(run):
 return run.get("completed") or run.get("exit_code") in (124,137)
def resume():
 pid=int((B/"paused-controller.pid").read_text())
 command=subprocess.run(["ps","-p",str(pid),"-o","command="],capture_output=True,text=True).stdout
 assert str(B/"collect-and-cleanup.py")+" --wait-for-login" in command,"Collector process identity changed"
 os.kill(pid,signal.SIGCONT)
 print("Collection controller resumed",flush=True)
def main():
 deadline=time.monotonic()+130*60
 try:
  while time.monotonic()<deadline:
   log=(B/"remote-run.log").read_text()
   if "BENCH_COMPLETE" in log:
    print("Original batch completed all trials",flush=True);return
   stopped=re.search(r"BENCH_STOP incomplete=([a-z0-9-]+)",log)
   if not stopped and "syntax error" in log:
    stopped=re.search(r"RUN_COMPLETE ([a-z0-9-]+) exit=(?:124|137)",log)
   if stopped:
    label=stopped.group(1);run=read_run(label)
    if not allowed(run):
     print("Non-timeout failure; no continuation: "+label,flush=True);return
    index=[x[0] for x in labels].index(label)
    print("Original batch capped "+label+"; continuing remaining comparisons",flush=True)
    for next_label,variant in labels[index+1:]:
     print("Starting "+next_label,flush=True)
     run=remote_run(next_label,variant)
     print("Finished "+next_label+" completed="+str(run.get("completed")),flush=True)
     if not allowed(run):
      print("Non-timeout failure; stopping comparisons",flush=True);break
    return
   time.sleep(15)
  print("Continuation safety deadline reached",flush=True)
 finally:resume()
if __name__=="__main__":main()
