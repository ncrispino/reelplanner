"""Drain only exact-marker, same-UID trial jobs; never signal an unverified process."""
import json
import os
import signal
import time
from pathlib import Path


def process_record(pid, proc=Path('/proc')):
    path = proc / str(pid)
    try:
        stat = (path / 'stat').read_text().rsplit(')', 1)[1].split()
        # Fields after comm: state is field 3; starttime is field 22.
        return {'pid': int(pid), 'start_ticks': stat[19], 'uid': path.stat().st_uid,
                'cwd': str((path / 'cwd').resolve()),
                'marker': next((x.split(b'=', 1)[1].decode() for x in (path / 'environ').read_bytes().split(b'\0')
                                if x.startswith(b'RP_BENCH_LABEL=')), None),
                'command': Path((path / 'cmdline').read_bytes().split(b'\0')[0].decode()).name,
                'state': stat[0]}
    except (FileNotFoundError, ProcessLookupError, PermissionError):
        return None


def owned(record, label, repo, uid):
    return bool(record and record['marker'] == label and record['uid'] == uid
                and Path(record['cwd']).resolve().is_relative_to(Path(repo).resolve()))


def drain(label, repo, out, proc=Path('/proc'), term_seconds=10):
    uid, myself = os.getuid(), os.getpid()
    records = []
    # A dedicated serial benchmark supplies this marker; unknown marked jobs outside the repo stop progression.
    for path in proc.iterdir():
        if not path.name.isdigit() or int(path.name) == myself:
            continue
        record = process_record(path.name, proc)
        if record and record['marker'] == label and record['uid'] == uid and record['state'] != 'Z':
            records.append(record)
    refused = [r for r in records if not owned(r, label, repo, uid)]
    if refused:
        raise RuntimeError('Marked jobs outside trial repo: ' + ', '.join(str(r['pid']) for r in refused))
    signaled = []
    for sig, until in [(signal.SIGTERM, time.monotonic() + term_seconds), (signal.SIGKILL, time.monotonic() + 3)]:
        for record in records:
            current = process_record(record['pid'], proc)
            if current and current['state'] != 'Z':
                if current['start_ticks'] != record['start_ticks'] or not owned(current, label, repo, uid):
                    raise RuntimeError('Process identity changed; refusing signal')
                try:
                    os.kill(record['pid'], sig)
                    signaled.append({'pid': record['pid'], 'start_ticks': record['start_ticks'], 'signal': sig.name,
                                     'cwd': record['cwd'], 'command': record['command']})
                except ProcessLookupError:
                    pass
        while time.monotonic() < until:
            alive = [r for r in records if (c := process_record(r['pid'], proc)) and c['state'] != 'Z'
                     and c['start_ticks'] == r['start_ticks']]
            if not alive:
                break
            time.sleep(.2)
    # Rescan catches children created during draining, not just the original snapshot.
    remaining = []
    for path in proc.iterdir():
        if path.name.isdigit() and int(path.name) != myself:
            r = process_record(path.name, proc)
            if r and r['marker'] == label and r['uid'] == uid and r['state'] != 'Z':
                remaining.append(r['pid'])
    result = {'label': label, 'drained': not remaining, 'signaled': signaled, 'remaining': remaining, 'at': time.time()}
    Path(out).write_text(json.dumps(result, indent=2) + '\n')
    if remaining:
        raise RuntimeError('Trial jobs remain; next trial forbidden')
    return result


if __name__ == '__main__':
    import sys
    drain(*sys.argv[1:])
