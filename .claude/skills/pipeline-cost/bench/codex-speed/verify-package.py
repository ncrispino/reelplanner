"""Verify selected native plugin guidance without opening credential files."""
import hashlib,json,sys
from pathlib import Path
package,home=map(Path,sys.argv[1:])
expected=package/'skills/plan-to-video/SKILL.md'
digest=hashlib.sha256(expected.read_bytes()).hexdigest()
copies=list((home/'plugins/cache').glob('**/skills/plan-to-video/SKILL.md'))
if not copies or any(hashlib.sha256(p.read_bytes()).hexdigest()!=digest for p in copies):
    raise SystemExit('Native plugin guidance does not match the selected package')
print(json.dumps({'package':str(package),'skill_sha256':digest,'verified_copies':len(copies)}))
