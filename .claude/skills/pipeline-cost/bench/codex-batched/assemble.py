"""Build a private runnable harness by reusing the two existing benchmark directories."""
import json
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def replace_once(text, before, after):
    if text.count(before) != 1:
        raise ValueError('Upstream harness changed; review overlay anchor: ' + before[:80])
    return text.replace(before, after, 1)


def assemble(dest):
    dest = Path(dest)
    if dest.exists():
        raise ValueError('Refusing to overwrite private harness')
    shutil.copytree(HERE.parent / 'codex', dest, ignore=shutil.ignore_patterns('__pycache__'))
    for source in (HERE.parent / 'codex-speed').iterdir():
        if source.is_file():
            shutil.copy2(source, dest / source.name)
    shutil.copy2(dest / 'phase_monitor.py', dest / 'phase_monitor_original.py')
    for name in ['phase_monitor.py', 'durable.py', 'drain.py', 'collection.py', 'assess.py',
                 'protocol.json', 'CONTRACT.md', 'QUALITY.md']:
        shutil.copy2(HERE / name, dest / name)
    prompt = (dest / 'prompt.txt').read_text()
    prompt += '\nRead CONTRACT.md before writing. Its fixed outline, visible evidence and full branch/check scope apply equally in both conditions. Keep every named beat and read QUALITY.md for the prespecified quality gates. Use the supplied TMPDIR for operational scratch work so independent-review and detached-tool jobs stay inside this trial; preserve the exact generated independent reviewer prompts. Do not inspect the benchmark reviewer, controller or evaluator files to anticipate feedback; wait for the actual saved review.\n'
    (dest / 'prompt.txt').write_text(prompt)
    contract = (HERE / 'CONTRACT.md').read_text()
    revision_heading = '## Scripted revision (evaluator and harness only)'
    if contract.count(revision_heading) != 1:
        raise ValueError('Contract revision boundary changed')
    (dest / 'fixture/CONTRACT.md').write_text(contract.split(revision_heading)[0])
    quality = (HERE / 'QUALITY.md').read_text()
    rows = quality.splitlines()
    if len([row for row in rows if row.startswith('| revision |')]) != 1:
        raise ValueError('Quality revision gate changed')
    (dest / 'fixture/QUALITY.md').write_text('\n'.join(
        '| revision | Respond to the actual saved review with new visible worked content in the named scenes, stable IDs, unchanged voice/pace, unchanged audio reuse and a marked guide revision. |'
        if row.startswith('| revision |') else row for row in rows) + '\n')
    reviewer = (dest / 'reviewer.mjs').read_text()
    reviewer = replace_once(reviewer, '#!/usr/bin/env node\n', '#!/usr/bin/env node\nimport { spawnSync } from "node:child_process";\nimport { fileURLToPath } from "node:url";\n')
    helper = '''
function freezeShowing() {
  const before = Date.now();
  const script = fileURLToPath(new URL("durable.py", import.meta.url));
  const result = spawnSync("python3", [script, "--capture", resolve(log, "..")], { encoding: "utf8" });
  if (result.status !== 0) throw new Error("Showing capture failed: " + result.stderr);
  say("capture-complete", { seconds: (Date.now() - before) / 1000 });
}
'''
    reviewer = replace_once(reviewer, 'let sent = 0, told = false;', helper + '\nlet sent = 0, told = false;')
    reviewer = replace_once(reviewer, '    say("shown", { n: 1, dir, shownAt: at });',
                            '    say("shown", { n: 1, dir, shownAt: at });\n    freezeShowing();')
    reviewer = replace_once(reviewer, '    writeFileSync(done, JSON.stringify',
                            '    freezeShowing();\n    writeFileSync(done, JSON.stringify')
    start = reviewer.index('const COMMENT = ')
    end = reviewer.index('\n', start)
    comment = ('Add NEW visible worked examples before the honesty and counting questions, without adding scenes or changing IDs. '
               'For honesty, show a clearly labeled hypothetical agent seeing exactly 8 rows then claiming 0; explain why this invented claim is known-false. '
               'Preserve the original hypothetical 30-row control in the guide. For counting, add a NEW exact P/P/Q/R four-row action-target trace: '
               'P attempts the same target twice, Q once and R once, with four occurrences and three actors. Group those SAME four rows into two versus four episodes '
               'and show the occurrence/actor counts remain 4/3. Preserve the original X/X/Y three-occurrence/two-actor control and one/three episode grouping in the guide. '
               'Keep these hypotheticals separate from observed source events and exclude them from observed metrics. '
               'Retain all five recorded answers, stable frame IDs, voice and 1.25x pace; reuse unchanged audio and mark the companion guide revision.')
    (dest / 'reviewer.mjs').write_text(reviewer[:start] + 'const COMMENT = ' + json.dumps(comment) + ';' + reviewer[end:])
    machine = (dest / 'codex-machine.sh').read_text()
    machine = replace_once(machine, '  local reviewer\n',
                           '  chmod 700 "$out"\n  mkdir -p "$repo/.bench-runtime/tmp"\n'
                           '  python3 -c \'import json,sys; from pathlib import Path; p=Path(sys.argv[1]); r=json.loads(p.read_text()); r["repo"]=sys.argv[2]; p.write_text(json.dumps(r,indent=2)+"\\n")\' "$out/run.json" "$repo"\n'
                           '  printf "\\n.bench-runtime/\\n" >> "$repo/.gitignore"\n'
                           '  export RP_BENCH_LABEL="$label" RP_BENCH_REPO="$repo" TMPDIR="$repo/.bench-runtime/tmp"\n'
                           '  cd "$repo"\n  local reviewer\n')
    machine = replace_once(machine, '  python3 "$B/phase_monitor.py" "$out" 40 25 ',
                            '  python3 "$B/phase_monitor.py" "$out" 60 45 ')
    machine = replace_once(machine, '  python3 "$B/stop-server.py" "$repo"\n',
                           '  python3 "$B/stop-server.py" "$repo"\n  unset RP_BENCH_LABEL\n'
                           '  python3 "$B/drain.py" "$label" "$repo" "$out/drain.json"\n'
                           '  python3 "$B/finish.py" "$repo" "$out"\n'
                           '  python3 "$B/collection.py" verify-dir "$HOME/bench-results" --labels "$label"\n')
    (dest / 'codex-machine.sh').write_text(machine)
    (dest / 'finish.py').write_text('from durable import checkpoint, capture_showings\nimport os,sys\ncheckpoint(sys.argv[2], os.environ["CODEX_HOME"])\ncapture_showings(sys.argv[2])\n')
    # Collection/cleanup is owned by the external controller. Never inherit the old finally: cleanup path.
    (dest / 'collect-and-cleanup.py').unlink()
    print(str(dest))


if __name__ == '__main__':
    assemble(sys.argv[1])
