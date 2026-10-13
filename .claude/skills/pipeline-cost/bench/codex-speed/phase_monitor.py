"""Separate first-showing and revision deadlines; no AWS or credential access."""
import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path


def events(path):
    if not path.exists():
        return []
    result = []
    for line in path.read_text().splitlines():
        try:
            result.append(json.loads(line))
        except ValueError:
            pass
    return result


def phase_deadline(start, rows, first_seconds, revision_seconds):
    shown = [r['shownAt'] / 1000 for r in rows if r.get('ev') == 'shown' and r.get('n') == 1]
    sent = [r['at'] / 1000 for r in rows if r.get('ev') == 'review-sent' and r.get('status') == 200]
    if sent:
        return 'revision', min(sent) + revision_seconds
    if shown:
        return 'review-handoff', min(shown) + 60
    return 'first', start + first_seconds


def stop_group(process):
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        pass
    try:
        process.wait(timeout=10)
    except subprocess.TimeoutExpired:
        pass
    try:
        os.killpg(process.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    process.wait()


def main():
    output, first, revision, *command = sys.argv[1:]
    out = Path(output)
    run = json.loads((out / 'run.json').read_text())
    start = time.time()
    run.update(start=start, first_cap_minutes=int(first), revision_cap_minutes=int(revision))
    (out / 'run.json').write_text(json.dumps(run, indent=2) + '\n')
    phase, code = 'first', None
    with (out / 'prompt.txt').open('rb') as prompt, (out / 'codex.jsonl').open('wb') as stdout, (out / 'codex.err').open('wb') as stderr:
        process = subprocess.Popen(command, stdin=prompt, stdout=stdout, stderr=stderr, start_new_session=True)
        try:
            while True:
                if (out / 'done.json').exists():
                    code = 0
                    break
                exited = process.poll()
                if exited is not None:
                    if exited == 0:
                        # The reviewer polls independently and may observe the final showing just after exit.
                        until = time.monotonic() + 5
                        while not (out / 'done.json').exists() and time.monotonic() < until:
                            time.sleep(0.2)
                    code = exited if exited else (0 if (out / 'done.json').exists() else 3)
                    break
                phase, deadline = phase_deadline(start, events(out / 'reviewer.jsonl'), int(first) * 60, int(revision) * 60)
                if time.time() >= deadline:
                    code = 124 if phase in ('first', 'revision') else 4
                    break
                time.sleep(0.5)
        finally:
            stop_group(process)
    run.update(end=time.time(), exit_code=code, completed=code == 0 and (out / 'done.json').exists(), stopped_phase=phase)
    (out / 'run.json').write_text(json.dumps(run, indent=2) + '\n')
    print(json.dumps({k: run[k] for k in ('label', 'completed', 'exit_code', 'stopped_phase')}), flush=True)


if __name__ == '__main__':
    main()
