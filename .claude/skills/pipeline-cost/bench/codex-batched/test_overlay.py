import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
import wave
from unittest.mock import patch

from assemble import assemble, replace_once
from assess import assess
from collection import verify_dir, pack, verify_archive
from drain import owned, drain
from durable import checkpoint, complete_jsonl, capture_showings

HERE = Path(__file__).resolve().parent
PROTOCOL = json.loads((HERE / 'protocol.json').read_text())


def trial_files(root, label='before-1'):
    out = root / label
    out.mkdir()
    rows = {'run.json': {'label': label, 'start': 1, 'repo': str(root), 'completed': False, 'exit_code': 124},
            'source-manifest.json': {}, 'selected-guidance.json': {'verified_copies': 1},
            'drain.json': {'label': label, 'drained': True, 'remaining': []}}
    for name, data in rows.items():
        (out / name).write_text(json.dumps(data) + '\n')
    for name in ['codex.jsonl', 'timing.jsonl', 'reviewer.jsonl']:
        (out / name).write_text('{}\n')
    (out / 'codex.jsonl').write_text('{"type":"thread.started","thread_id":"main-trial"}\n')
    home = root / 'isolated-home'
    session = home / 'sessions/2026/rollout.jsonl'
    session.parent.mkdir(parents=True)
    session.write_text('{"type":"session_meta","payload":{"id":"main-trial"},"timestamp":"2026-10-12T00:00:00Z"}\n')
    checkpoint(out, home)
    return out, home


class Checkpoints(unittest.TestCase):
    def test_partial_live_tail_is_omitted_and_completed_records_validated(self):
        self.assertEqual(complete_jsonl(b'{"a":1}\n{"unfinished"'), b'{"a":1}\n')
        with self.assertRaises(ValueError):
            complete_jsonl(b'{invalid}\n')

    def test_checkpoint_only_changed_sessions_never_auth(self):
        with tempfile.TemporaryDirectory() as folder:
            out, home = trial_files(Path(folder))
            (home / 'auth.json').write_text('PRIVATE_DO_NOT_COLLECT')
            self.assertEqual(checkpoint(out, home), 0)
            session = home / 'sessions/2026/rollout.jsonl'
            session.write_text(session.read_text() + '{"type":"event_msg"}\n')
            self.assertEqual(checkpoint(out, home), 1)
            self.assertFalse((out / 'auth.json').exists())
            self.assertIn('event_msg', (out / 'sessions/2026/rollout.jsonl').read_text())

    def test_symlink_session_cannot_export_auth(self):
        with tempfile.TemporaryDirectory() as folder:
            out, home = trial_files(Path(folder))
            secret = home / 'auth.json'
            secret.write_text('{"type":"session_meta"}\n')
            (home / 'sessions/auth-copy.jsonl').symlink_to(secret)
            checkpoint(out, home)
            self.assertFalse((out / 'sessions/auth-copy.jsonl').exists())


class Collections(unittest.TestCase):
    def test_checker_export_cannot_replace_missing_main_author_export(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            out, home = trial_files(root)
            session = home / 'sessions/2026/rollout.jsonl'
            session.write_text(session.read_text().replace('main-trial', 'checker-only'))
            checkpoint(out, home)
            with self.assertRaisesRegex(ValueError, 'main author'):
                verify_dir(root, ['before-1'])

    def test_foreign_drain_and_session_checkpoint_labels_are_refused(self):
        for name in ['drain.json', 'session-checkpoint.json']:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                out, home = trial_files(root)
                record = json.loads((out / name).read_text())
                record['label'] = 'after-2'
                (out / name).write_text(json.dumps(record))
                with self.assertRaises(ValueError):
                    verify_dir(root, ['before-1'])

    def test_progress_export_can_preserve_live_logs_but_cannot_authorize_cleanup(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            out, home = trial_files(root)
            (out / 'drain.json').unlink()
            archive = root / 'progress.tgz'
            pack(root, archive, ['before-1'], progress=True)
            result = verify_archive(archive, ['before-1'], progress=True)
            self.assertTrue(result['progress_only'])
            self.assertFalse(result['cleanup_eligible'])
            with self.assertRaises(ValueError):
                verify_archive(archive, ['before-1'])

    def test_complete_capped_logs_pack_and_verify_without_audio(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            out, home = trial_files(root)
            (out / 'sound.wav').write_bytes(b'not exported')
            archive = root / 'logs.tgz'
            pack(root, archive, ['before-1'])
            self.assertTrue(verify_archive(archive, ['before-1'])['verified'])
            import tarfile
            with tarfile.open(archive) as file:
                self.assertNotIn('before-1/sound.wav', file.getnames())

    def test_missing_exports_truncated_logs_and_live_jobs_refuse_verification(self):
        for failure in ['session', 'truncated', 'jobs']:
            with self.subTest(failure=failure), tempfile.TemporaryDirectory() as folder:
                root = Path(folder)
                out, home = trial_files(root)
                if failure == 'session':
                    (out / 'sessions/2026/rollout.jsonl').unlink()
                elif failure == 'truncated':
                    (out / 'timing.jsonl').write_bytes(b'{"partial"')
                else:
                    (out / 'drain.json').write_text('{"drained":false,"remaining":[9]}')
                with self.assertRaises((ValueError, FileNotFoundError)):
                    verify_dir(root, ['before-1'])

    def test_showing_hash_mutation_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            out, home = trial_files(root)
            video = root / 'video'
            video.mkdir()
            (root / 'plan.md').write_text('original plan')
            (root / 'record.jsonl').write_text('{"event":"synthetic"}\n')
            for name in ['SCRIPT.md', 'STORYBOARD.md', 'index.html', 'plan-map.json', 'caption_groups.json']:
                (video / name).write_text('{}' if name.endswith('.json') else 'fixed source')
            (video / 'sample.png').write_bytes(b'fixed image')
            (video / 'plan-map.json').write_text(json.dumps({'frames': [{'index': 1, 'narration': 'spoken', 'thumb': 'sample.png'}]}))
            (video / 'audio_meta.json').write_text('{"voices":[{"frame":1,"path":"voice.wav","duration_s":0.1}]}')
            with wave.open(str(video / 'voice.wav'), 'wb') as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(24000)
                wav.writeframes(b'\0\0' * 2400)
            (out / 'timing.jsonl').write_text(json.dumps({'ev': 'start', 'id': 'x', 'cmd': 'reelplanner',
                'args': ['review', str(video), '--detach'], 'cwd': str(root)}) + '\n' +
                json.dumps({'ev': 'end', 'id': 'x', 'exit': 0, 'at': 2}) + '\n')
            capture_showings(out)
            self.assertEqual((out / 'showing-1/evidence/plan.md').read_text(), 'original plan')
            meta = json.loads((out / 'showing-1/observation.json').read_text())
            self.assertEqual(meta['voiced_frames'], [1])
            self.assertEqual(meta['frame_samples'], {'1': ['sample.png']})
            (root / 'plan.md').write_text('revised plan')
            (out / 'reviewer.jsonl').write_text('{"ev":"shown","n":1,"shownAt":2}\n')
            self.assertTrue(verify_dir(root, ['before-1'], full=True)['verified'])
            (out / 'showing-1/index.html').write_text('mutated')
            with self.assertRaises(ValueError):
                verify_dir(root, ['before-1'], full=True)


class Ownership(unittest.TestCase):
    def record(self, **more):
        return dict({'pid': 9999, 'start_ticks': '40', 'uid': os.getuid(), 'marker': 'before-1',
                     'cwd': '/tmp/trial/frames', 'command': 'node', 'state': 'S'}, **more)

    def test_marker_uid_and_cwd_all_required(self):
        r = self.record()
        self.assertTrue(owned(r, 'before-1', '/tmp/trial', os.getuid()))
        for key, value in [('marker', 'other'), ('uid', os.getuid() + 1), ('cwd', '/tmp/unrelated')]:
            self.assertFalse(owned({**r, key: value}, 'before-1', '/tmp/trial', os.getuid()))

    def test_changed_pid_identity_never_signaled(self):
        with tempfile.TemporaryDirectory() as folder:
            proc = Path(folder)
            (proc / '9999').mkdir()
            with patch('drain.process_record', side_effect=[self.record(), self.record(start_ticks='41')]), patch('drain.os.kill') as kill:
                with self.assertRaisesRegex(RuntimeError, 'identity changed'):
                    drain('before-1', '/tmp/trial', proc / 'result.json', proc, term_seconds=0)
                kill.assert_not_called()

    def test_unknown_neutral_daemon_never_signaled(self):
        with tempfile.TemporaryDirectory() as folder:
            proc = Path(folder)
            (proc / '9999').mkdir()
            with patch('drain.process_record', return_value=self.record(cwd='/opt/neutral')), patch('drain.os.kill') as kill:
                with self.assertRaisesRegex(RuntimeError, 'outside trial repo'):
                    drain('before-1', '/tmp/trial', proc / 'result.json', proc)
                kill.assert_not_called()


class Pilot(unittest.TestCase):
    def test_duplicate_extra_and_truthy_completion_are_refused(self):
        trials = self.trials()
        self.assertFalse(assess(trials + [trials[0]], PROTOCOL)['qualifies'])
        self.assertFalse(assess(trials + [{**trials[0], 'label': 'extra'}], PROTOCOL)['qualifies'])
        trials[0]['completed'] = 'false'
        self.assertFalse(assess(trials, PROTOCOL)['qualifies'])

    def test_nan_and_infinite_timing_cannot_qualify(self):
        for value in [float('nan'), float('inf')]:
            trials = self.trials()
            trials[1]['first_seconds'] = value
            self.assertFalse(assess(trials, PROTOCOL)['qualifies'])

    def trials(self):
        return [{'label': label, 'completed': True, 'quality': dict.fromkeys(PROTOCOL['quality_gates'], True),
                 'first_seconds': 1000 if label.startswith('before') else 750,
                 'revision_seconds': 500 if label.startswith('before') else 375} for label in PROTOCOL['order']]

    def test_matched_full_quality_speedup_qualifies(self):
        self.assertTrue(assess(self.trials(), PROTOCOL)['qualifies'])

    def test_cap_or_any_missing_quality_gate_disqualifies(self):
        for field, value in [('completed', False), ('quality', {})]:
            trials = self.trials()
            trials[1][field] = value
            self.assertFalse(assess(trials, PROTOCOL)['qualifies'])

    def test_fast_total_cannot_hide_regressed_episode_or_pair(self):
        trials = self.trials()
        for trial in trials:
            if trial['label'].startswith('after'):
                trial.update(first_seconds=300, revision_seconds=550)
        self.assertFalse(assess(trials, PROTOCOL)['qualifies'])
        trials = self.trials()
        trials[2].update(first_seconds=1050, revision_seconds=525)
        self.assertFalse(assess(trials, PROTOCOL)['qualifies'])


class Assembly(unittest.TestCase):
    def test_overlay_reuses_controller_and_gates_capture_before_post_and_done(self):
        with tempfile.TemporaryDirectory() as folder:
            dest = Path(folder) / 'harness'
            assemble(dest)
            self.assertFalse((dest / 'collect-and-cleanup.py').exists())
            self.assertEqual((dest / 'verify-package.py').read_bytes(), (HERE / 'verify-package.py').read_bytes())
            reviewer = (dest / 'reviewer.mjs').read_text()
            self.assertIn('P/P/Q/R four-row', reviewer)
            self.assertIn('counts remain 4/3', reviewer)
            self.assertIn('X/X/Y three-occurrence/two-actor', reviewer)
            contract = (dest / 'fixture/CONTRACT.md').read_text()
            self.assertIn('hypothetical X attempts', contract)
            self.assertNotIn('P/P/Q/R', contract)
            self.assertNotIn('eight visible rows', contract)
            self.assertNotIn('P/P/Q/R', (dest / 'fixture/QUALITY.md').read_text())
            self.assertIn('four occurrences and three actors', (dest / 'CONTRACT.md').read_text())
            self.assertLess(reviewer.index('freezeShowing();'), reviewer.index('const row = reviewRow(dir);'))
            self.assertLess(reviewer.rindex('freezeShowing();'), reviewer.index('writeFileSync(done,'))
            self.assertEqual(subprocess.run(['node', '--check', str(dest / 'reviewer.mjs')], capture_output=True).returncode, 0)
            self.assertEqual(subprocess.run(['bash', '-n', str(dest / 'codex-machine.sh')], capture_output=True).returncode, 0)
            machine = (dest / 'codex-machine.sh').read_text()
            self.assertIn('RP_BENCH_LABEL="$label" RP_BENCH_REPO="$repo"', machine)
            self.assertIn('TMPDIR="$repo/.bench-runtime/tmp"', machine)
            self.assertLess(machine.index('  cd "$repo"'), machine.index('  node "$B/reviewer.mjs"'))
            self.assertIn('"$out" 60 45 codex exec', machine)
            self.assertEqual((PROTOCOL['first_cap_minutes'], PROTOCOL['revision_cap_minutes']), (60, 45))
            self.assertIn('drain.py', machine)
            self.assertIn('verify-dir', machine)
            with self.assertRaises(ValueError):
                assemble(dest)

    def test_changed_upstream_anchor_is_refused(self):
        with self.assertRaises(ValueError):
            replace_once('absent', 'expected', 'new')


if __name__ == '__main__':
    unittest.main()
