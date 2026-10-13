"""Logs first: pack only allowlisted results; verify complete files before external resource cleanup."""
import hashlib
import json
import sys
import tarfile
from pathlib import Path, PurePosixPath
from durable import TEXT, IMAGES

ESSENTIAL = ['run.json', 'timing.jsonl', 'reviewer.jsonl', 'codex.jsonl', 'source-manifest.json',
             'selected-guidance.json', 'session-checkpoint.json', 'drain.json']


def validate_jsonl(data):
    if data and not data.endswith(b'\n'):
        raise ValueError('Truncated JSONL')
    return [json.loads(line) for line in data.splitlines() if line.strip()]


def verify(read, names, labels, full=False, progress=False):
    for label in labels:
        prefix = label + '/'
        for name in ESSENTIAL:
            if progress and name == 'drain.json':
                continue
            data = read(prefix + name)
            if name.endswith('.jsonl'):
                validate_jsonl(data)
            else:
                json.loads(data)
        run = json.loads(read(prefix + 'run.json'))
        drain = json.loads(read(prefix + 'drain.json')) if not progress else {}
        if run['label'] != label or (not progress and (drain.get('label') != label or drain.get('drained') is not True or drain.get('remaining'))):
            raise ValueError('Run ownership/drain mismatch: ' + label)
        checkpoint = json.loads(read(prefix + 'session-checkpoint.json'))
        if checkpoint.get('label') != label or not checkpoint.get('files'):
            raise ValueError('Missing model session exports: ' + label)
        exported_ids = set()
        for name, entry in checkpoint['files'].items():
            data = read(prefix + 'sessions/' + name)
            session_rows = validate_jsonl(data)
            if not session_rows or session_rows[0].get('type') != 'session_meta':
                raise ValueError('Missing session metadata: ' + name)
            metadata = session_rows[0].get('payload', {})
            exported_ids.add(metadata.get('id') or metadata.get('session_id'))
            if hashlib.sha256(data).hexdigest() != entry['sha256']:
                raise ValueError('Session checkpoint hash differs: ' + name)
        cli_rows = validate_jsonl(read(prefix + 'codex.jsonl'))
        main_ids = {row.get('thread_id') for row in cli_rows if row.get('type') == 'thread.started'}
        if not main_ids or None in main_ids or not main_ids.issubset(exported_ids):
            raise ValueError('Missing main author model session export: ' + label)
        rows = validate_jsonl(read(prefix + 'reviewer.jsonl'))
        shown = [r for r in rows if r.get('ev') == 'shown']
        if run.get('completed') and {r.get('n') for r in shown} != {1, 2}:
            raise ValueError('Completed run lacks both showing receipts')
        for row in shown:
            folder = prefix + f"showing-{row['n']}/"
            meta = json.loads(read(folder + 'observation.json'))
            if meta['shownAt'] != row['shownAt']:
                raise ValueError('Showing timestamp differs')
            hashes = meta.get('sha256', {})
            evidence = meta.get('evidence_sha256', {})
            if 'plan.md' not in evidence:
                raise ValueError('Showing lacks immutable owning plan evidence')
            for name, expected in evidence.items():
                if not safe_name(name) or hashlib.sha256(read(folder + 'evidence/' + name)).hexdigest() != expected:
                    raise ValueError('Showing source evidence hash differs: ' + name)
            required = {'SCRIPT.md', 'STORYBOARD.md', 'index.html', 'plan-map.json', 'caption_groups.json'}
            if not required.issubset(hashes) or not any(Path(n).suffix.lower() in IMAGES for n in hashes):
                raise ValueError('Showing metadata lacks required source/sample hashes')
            if not meta.get('audio') or meta.get('missing_narration'):
                raise ValueError('Showing lacks narration provenance/coverage')
            for name, expected in hashes.items():
                if not full and Path(name).suffix.lower() in IMAGES:
                    continue
                if hashlib.sha256(read(folder + name)).hexdigest() != expected:
                    raise ValueError('Showing artifact hash differs: ' + name)
    return {'verified': True, 'labels': labels, 'full_artifacts': full, 'progress_only': progress,
            'cleanup_eligible': full and not progress}


def safe_name(name):
    path = PurePosixPath(name)
    return not path.is_absolute() and '..' not in path.parts


def verify_archive(path, labels, full=False, progress=False):
    with tarfile.open(path, 'r:*') as archive:
        members = {m.name: m for m in archive.getmembers() if m.isfile()}
        if any(not safe_name(m.name) or m.issym() or m.islnk() for m in archive.getmembers()):
            raise ValueError('Unsafe archive member')
        def read(name):
            if name not in members:
                raise ValueError('Missing collection entry: ' + name)
            return archive.extractfile(members[name]).read()
        return verify(read, members, labels, full, progress)


def verify_dir(root, labels, full=False, progress=False):
    root = Path(root).resolve()
    def read(name):
        path = root / name
        if not safe_name(name) or path.is_symlink() or not path.resolve().is_relative_to(root):
            raise ValueError('Unsafe collection path')
        return path.read_bytes()
    return verify(read, [], labels, full, progress)


def pack(root, dest, labels, full=False, progress=False):
    root, dest = Path(root).resolve(), Path(dest)
    verify_dir(root, labels, full, progress)
    temporary = dest.with_name(dest.name + '.pending')
    with tarfile.open(temporary, 'w:gz') as archive:
        for label in labels:
            for path in sorted((root / label).rglob('*')):
                rel = path.relative_to(root)
                if not path.is_file() or path.is_symlink() or any(x in ('node_modules', '.git') for x in rel.parts):
                    continue
                if path.name in {'auth.json', 'config.json'}:
                    continue
                suffix = path.suffix.lower()
                if suffix not in TEXT | {'.jsonl', '.txt', '.log', '.err'} | (IMAGES if full else set()):
                    continue
                archive.add(path, arcname=str(rel), recursive=False)
    verify_archive(temporary, labels, full, progress)
    temporary.chmod(0o600)
    temporary.replace(dest)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['pack', 'verify', 'verify-dir'])
    parser.add_argument('path')
    parser.add_argument('--out')
    parser.add_argument('--labels', nargs='+', required=True)
    parser.add_argument('--full', action='store_true')
    parser.add_argument('--progress', action='store_true', help='Live logs checkpoint only; never permits cleanup')
    args = parser.parse_args()
    if args.action == 'pack':
        if not args.out:
            parser.error('pack needs --out')
        pack(args.path, args.out, args.labels, args.full, args.progress)
        result = verify_archive(args.out, args.labels, args.full, args.progress)
    else:
        result = (verify_archive if args.action == 'verify' else verify_dir)(args.path, args.labels, args.full, args.progress)
    print(json.dumps(result))
