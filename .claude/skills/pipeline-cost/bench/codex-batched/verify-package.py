"""Compare the complete selected skill Markdown tree with each native cache copy; never open auth."""
import hashlib
import json
import sys
from pathlib import Path


def markdown_hashes(root):
    root = Path(root)
    if root.is_symlink() or not root.is_dir():
        raise ValueError('Skill root must be a real directory')
    files = {}
    for path in sorted(root.rglob('*')):
        # Reject links before reading bytes, including links to credential/configuration paths.
        if path.is_symlink():
            raise ValueError('Symlink in selected skill tree: ' + str(path.relative_to(root)))
        if path.is_file() and path.suffix == '.md':
            files[str(path.relative_to(root))] = hashlib.sha256(path.read_bytes()).hexdigest()
    if 'SKILL.md' not in files:
        raise ValueError('Skill tree lacks SKILL.md')
    return files


def verify(package, home):
    package, home = Path(package), Path(home)
    expected = markdown_hashes(package / 'skills/plan-to-video')
    cache = home / 'plugins/cache'
    # Discover this skill's own SKILL.md copies only. Other skills and auth/config trees are irrelevant.
    copies = sorted(cache.glob('**/skills/plan-to-video/SKILL.md'))
    if not copies:
        raise ValueError('Native plugin guidance does not match the selected package: no skill copies')
    verified = []
    for skill in copies:
        if not skill.parent.resolve().is_relative_to(cache.resolve()):
            raise ValueError('Native skill cache escapes its cache root')
        actual = markdown_hashes(skill.parent)
        missing = sorted(expected.keys() - actual.keys())
        extra = sorted(actual.keys() - expected.keys())
        changed = sorted(name for name in expected.keys() & actual.keys() if expected[name] != actual[name])
        if missing or extra or changed:
            raise ValueError('Native plugin guidance does not match the selected package: ' +
                             json.dumps({'missing': missing, 'extra': extra, 'changed': changed}))
        verified.append(str(skill.parent.relative_to(cache)))
    return {'package': str(package), 'skill_sha256': expected['SKILL.md'], 'markdown_sha256': expected,
            'verified_copies': len(copies), 'verified_cache_roots': verified}


if __name__ == '__main__':
    try:
        print(json.dumps(verify(*sys.argv[1:])))
    except ValueError as error:
        raise SystemExit(str(error))
