"""Trusted local controller: collect private results, then remove only this benchmark's resources."""
import json,subprocess,sys,time
from pathlib import Path
B=Path(__file__).resolve().parent
s=json.loads((B/'state.json').read_text())
ssh=['ssh','-i',s['key'],'-o','StrictHostKeyChecking=yes','-o',f'UserKnownHostsFile={B}/known_hosts','-o','ServerAliveInterval=30',f'ubuntu@{s["ip"]}']
def aws(*args):
    return subprocess.run(['aws','--profile',s['profile'],'--region',s['region'],*args],stdout=subprocess.DEVNULL,check=True)
def cleanup():
    r=subprocess.run(['aws','--profile',s['profile'],'--region',s['region'],'ec2','describe-instances','--instance-ids',s['instance'],'--output','json'],capture_output=True,text=True,check=True)
    instance=json.loads(r.stdout)['Reservations'][0]['Instances'][0]
    tags={t['Key']:t['Value'] for t in instance.get('Tags',[])}
    assert tags.get('Name')==s['key_pair'] and tags.get('reelplanner')=='fresh-install', 'Refusing cleanup: resource ownership differs'
    assert instance.get('KeyName')==s['key_pair']
    assert s['security_group'] in {g['GroupId'] for g in instance.get('SecurityGroups',[])}
    aws('ec2','terminate-instances','--instance-ids',s['instance'])
    aws('ec2','wait','instance-terminated','--instance-ids',s['instance'])
    aws('ec2','delete-security-group','--group-id',s['security_group'])
    aws('ec2','delete-key-pair','--key-name',s['key_pair'])
    Path(s['key']).unlink(missing_ok=True)
    s['deleted_at']=time.time();(B/'state.json').write_text(json.dumps(s,indent=2)+'\n')
def collect():
    # Explicit allowlist. No auth cache, config, login logs, SSH keys or entire home directory.
    command="tar --exclude='*/node_modules' --exclude='*/.git' --exclude='*.wav' --exclude='*.mp3' --exclude='*.mp4' -czf - -C /home/ubuntu bench-results bench-repos"
    with (B/'results-private.tgz').open('wb') as out:
        subprocess.run(ssh+[command],stdout=out,check=True)
    (B/'results-private.tgz').chmod(0o600)
def main():
    if len(sys.argv)>1 and sys.argv[1]=='cleanup': cleanup();return
    try:
        if '--wait-for-login' in sys.argv:
            deadline=time.monotonic()+60*60
            while True:
                r=subprocess.run(ssh+['bash /opt/rp/codex-bench/codex-machine.sh ready'],capture_output=True,text=True,timeout=30)
                if r.returncode==0:
                    print('Separate benchmark login verified; starting authorized trials',flush=True)
                    break
                if time.monotonic()>=deadline:
                    print('Login timeout: no model runs started',flush=True)
                    return
                time.sleep(15)
        with (B/'remote-run.log').open('w') as out:
            r=subprocess.run(ssh+['bash /opt/rp/codex-bench/run-all.sh'],stdin=subprocess.DEVNULL,stdout=out,stderr=subprocess.STDOUT)
        print(f'Benchmark process exited {r.returncode}',flush=True)
        collect()
        print('Private results collected',flush=True)
    finally:
        cleanup()
        print('Benchmark instance, security group and key pair deleted',flush=True)
if __name__=='__main__': main()
