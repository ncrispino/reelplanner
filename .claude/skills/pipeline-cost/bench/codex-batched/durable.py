"""Allowlisted checkpoints: session JSONL and immutable synthetic showing artifacts only."""
import hashlib
import json
import os
import time
import wave
from pathlib import Path

TEXT = {'.md', '.json', '.html', '.svg', '.css', '.js'}
IMAGES = {'.png', '.jpg', '.jpeg'}


def atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.pending')
    with temp.open('wb') as stream:
        os.fchmod(stream.fileno(), 0o600)
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    temp.replace(path)


def complete_jsonl(data):
    """A live writer may have an incomplete final line; never export that partial record."""
    rows = data.splitlines(keepends=True)
    complete = []
    for i, row in enumerate(rows):
        if not row.endswith(b'\n') and i == len(rows) - 1:
            break
        json.loads(row)
        complete.append(row)
    return b''.join(complete)


def checkpoint(out, home):
    out, home = Path(out), Path(home)
    run = json.loads((out / 'run.json').read_text())
    state_path = out / 'session-checkpoint.json'
    state = json.loads(state_path.read_text()) if state_path.exists() else {'files': {}}
    changed = 0
    # Never traverse anything except this trial's explicit sessions directory.
    session_root = home / 'sessions'
    for source in session_root.glob('**/*.jsonl'):
        if source.is_symlink() or not source.resolve().is_relative_to(session_root.resolve()):
            continue
        stat = source.stat()
        key = str(source.relative_to(session_root))
        signature = [stat.st_size, stat.st_mtime_ns]
        old = state['files'].get(key, {})
        if old.get('signature') == signature:
            continue
        data = complete_jsonl(source.read_bytes())
        if not data:
            continue
        first = json.loads(data.splitlines()[0])
        # The fresh trial home is isolated; verify metadata identifies a real session.
        if first.get('type') != 'session_meta':
            raise ValueError('Unexpected session metadata: ' + key)
        target = out / 'sessions' / key
        atomic(target, data)
        state['files'][key] = {'signature': signature, 'bytes': len(data),
                               'sha256': hashlib.sha256(data).hexdigest()}
        changed += 1
    state.update(label=run['label'], at=time.time(), changed_files=changed)
    atomic(state_path, (json.dumps(state, indent=2) + '\n').encode())
    return changed


def capture_showings(out):
    out = Path(out)
    timing = out / 'timing.jsonl'
    if not timing.exists():
        return
    starts, showings = {}, []
    for line in complete_jsonl(timing.read_bytes()).splitlines():
        event = json.loads(line)
        if event.get('ev') == 'start':
            starts[event['id']] = event
        elif event.get('ev') == 'end' and event.get('exit') == 0:
            start = starts.get(event['id'], {})
            args = start.get('args', [])
            if start.get('cmd') == 'reelplanner' and args[:1] == ['review'] and '--detach' in args:
                target = next((x for x in args[1:] if not x.startswith('--')), None)
                if target:
                    path = Path(target)
                    showings.append((event['at'], path if path.is_absolute() else Path(start['cwd']) / path))
    for number, (shown, source) in enumerate(showings, 1):
        dest = out / f'showing-{number}'
        if (dest / 'observation.json').exists():
            continue
        run = json.loads((out / 'run.json').read_text())
        repo_arg = os.environ.get('RP_BENCH_REPO') or run.get('repo')
        if not repo_arg:
            raise ValueError('Showing capture requires validated trial repo')
        repo, source = Path(repo_arg).resolve(), source.resolve()
        if run.get('repo') and repo != Path(run['repo']).resolve():
            raise ValueError('Trial repo environment differs from run record')
        if not source.is_relative_to(repo):
            raise ValueError('Showing source is outside the trial repo')
        plan = source.parent / 'plan.md'
        if not plan.is_file() or plan.is_symlink() or not plan.resolve().is_relative_to(repo):
            raise ValueError('Showing lacks its owning canonical plan')
        hashes, audio, evidence_hashes, evidence_sources = {}, {}, {}, {}
        evidence = [plan] + [repo / name for name in ['REQUEST.md', 'task.md', 'record.jsonl', 'definitions.md',
                     'choices.md', 'CONTRACT.md', 'QUALITY.md', '.reelplanner/spec.md', '.reelplanner/glossary.md',
                     '.reelplanner/decisions.md', '.reelplanner/decisions.json']]
        evidence.extend((source.parent / 'reviews').glob('*.md'))
        for path in evidence:
            if not path.exists():
                continue
            if path.is_symlink() or not path.resolve().is_relative_to(repo):
                raise ValueError('Evidence path escapes trial repo')
            name = 'plan.md' if path == plan else str(path.relative_to(repo))
            data = path.read_bytes()
            atomic(dest / 'evidence' / name, data)
            evidence_hashes[name] = hashlib.sha256(data).hexdigest()
            evidence_sources[name] = path
        for path in sorted(source.rglob('*')):
            rel = path.relative_to(source)
            if not path.is_file() or path.is_symlink() or any(x in ('.git', 'node_modules') for x in rel.parts):
                continue
            if path.suffix.lower() in {'.wav', '.mp3'}:
                data = path.read_bytes()
                item = {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
                if path.suffix.lower() == '.wav':
                    with wave.open(str(path), 'rb') as wav:
                        item.update(frames=wav.getnframes(), sample_rate=wav.getframerate(), channels=wav.getnchannels(),
                                    sample_width=wav.getsampwidth())
                audio[str(rel)] = item
                continue
            if path.suffix.lower() not in TEXT | IMAGES or path.name in {'auth.json', 'config.json'}:
                continue
            data = path.read_bytes()
            atomic(dest / rel, data)
            hashes[str(rel)] = hashlib.sha256(data).hexdigest()
        required = ['SCRIPT.md', 'STORYBOARD.md', 'index.html', 'plan-map.json', 'caption_groups.json', 'audio_meta.json']
        missing = [name for name in required if name not in hashes]
        if missing or not any(Path(name).suffix.lower() in IMAGES for name in hashes):
            raise ValueError('Incomplete showing capture: ' + ', '.join(missing or ['screenshots']))
        frames = json.loads((source / 'plan-map.json').read_text()).get('frames', [])
        voices = json.loads((source / 'audio_meta.json').read_text()).get('voices', [])
        by_frame = {int(voice['frame']): voice for voice in voices}
        expected_voices = [int(frame['index']) for frame in frames if str(frame.get('narration') or '').strip()]
        missing_narration = [index for index in expected_voices if index not in by_frame or
                             str(by_frame[index].get('path', '')).removeprefix('./') not in audio]
        if not expected_voices or missing_narration or not audio:
            raise ValueError('Showing lacks complete narration provenance')
        samples = {}
        for frame in frames:
            index = int(frame['index'])
            candidates = [str(frame.get('thumb') or '').removeprefix('./')]
            candidates.extend(name for name in hashes if name.startswith(f'.hyperframes/shots/{index:02d}-') and Path(name).suffix.lower() in IMAGES)
            samples[str(index)] = [name for name in candidates if name in hashes and Path(name).suffix.lower() in IMAGES]
        # The reviewer waits for this atomic manifest before POST/done. Reject mutation by an outstanding job.
        for name, expected in hashes.items():
            if hashlib.sha256((source / name).read_bytes()).hexdigest() != expected:
                raise ValueError('Source changed during showing capture: ' + name)
        for name, item in audio.items():
            if hashlib.sha256((source / name).read_bytes()).hexdigest() != item['sha256']:
                raise ValueError('Audio changed during showing capture: ' + name)
        for name, path in evidence_sources.items():
            if hashlib.sha256(path.read_bytes()).hexdigest() != evidence_hashes[name]:
                raise ValueError('Plan/source evidence changed during showing capture: ' + name)
        meta = {'shownAt': shown, 'observedAt': int(time.time() * 1000), 'source': str(source), 'sha256': hashes,
                'evidence_sha256': evidence_hashes, 'audio': audio,
                'voiced_frames': expected_voices, 'missing_narration': missing_narration,
                'frame_samples': samples, 'missing_frame_samples': [index for index, names in samples.items() if not names],
                'audio_collection': 'hashes and WAV headers only; audio files excluded'}
        atomic(dest / 'observation.json', (json.dumps(meta, indent=2) + '\n').encode())


if __name__ == '__main__':
    import sys
    if sys.argv[1] == '--capture':
        capture_showings(sys.argv[2])
    else:
        checkpoint(sys.argv[1], sys.argv[2])
        capture_showings(sys.argv[1])
