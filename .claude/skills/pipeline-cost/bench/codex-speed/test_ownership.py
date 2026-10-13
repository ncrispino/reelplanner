import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import signal
import tempfile
import unittest
from unittest.mock import patch

SOURCE = Path(os.environ.get('RP_BENCH_TEST_SOURCE', Path(__file__).parent))


class ServerOwnershipTests(unittest.TestCase):
    def invoke(self, metadata=True, present=True, same_repo=True,
               command=b'node\0/opt/rp/scripts/review.mjs\0', disappeared=False):
        with tempfile.TemporaryDirectory() as folder:
            repo = Path(folder).resolve()
            target = repo / '.reelplanner/inbox/.server.json'
            if metadata:
                target.parent.mkdir(parents=True)
                target.write_text(json.dumps({'pid': 4242}))
            proc = Path('/proc/4242')
            real_exists, real_resolve, real_read = Path.exists, Path.resolve, Path.read_bytes

            def exists(path):
                return present if path == proc else real_exists(path)

            def resolve(path, *args, **kwargs):
                if path == proc / 'cwd':
                    return repo if same_repo else repo / 'other-repo'
                return real_resolve(path, *args, **kwargs)

            def read_bytes(path):
                return command if path == proc / 'cmdline' else real_read(path)

            with patch.object(Path, 'exists', exists), patch.object(Path, 'resolve', resolve), \
                 patch.object(Path, 'read_bytes', read_bytes), \
                 patch('sys.argv', ['stop-server.py', str(repo)]), patch('os.kill') as kill:
                if disappeared:
                    kill.side_effect = ProcessLookupError
                error = None
                try:
                    runpy.run_path(str(SOURCE / 'stop-server.py'), run_name='__main__')
                except SystemExit as exc:
                    error = exc.code
                return kill.call_args_list, error

    def test_missing_metadata_does_not_signal_any_process(self):
        calls, error = self.invoke(metadata=False)
        self.assertEqual(calls, [])
        self.assertIsNone(error)

    def test_already_exited_process_does_not_signal(self):
        calls, error = self.invoke(present=False)
        self.assertEqual(calls, [])
        self.assertEqual(error, 0)

    def test_other_repo_is_refused_even_with_review_command(self):
        calls, error = self.invoke(same_repo=False)
        self.assertEqual(calls, [])
        self.assertIn('does not match', error)

    def test_other_command_is_refused_even_in_owned_repo(self):
        calls, error = self.invoke(command=b'node\0unrelated-service.mjs\0')
        self.assertEqual(calls, [])
        self.assertIn('does not match', error)

    def test_owned_review_server_gets_one_term_signal(self):
        calls, error = self.invoke()
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0].args, (4242, signal.SIGTERM))
        self.assertIsNone(error)

    def test_process_disappearing_before_signal_is_safe(self):
        calls, error = self.invoke(disappeared=True)
        self.assertEqual(len(calls), 1)
        self.assertIsNone(error)


class PackageSelectionTests(unittest.TestCase):
    def invoke(self, cached):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            package, home = root / 'package', root / 'fresh-codex-home'
            expected = package / 'skills/plan-to-video/SKILL.md'
            expected.parent.mkdir(parents=True)
            expected.write_bytes(b'selected guidance')
            for number, contents in enumerate(cached):
                skill = home / f'plugins/cache/marketplace/plugin/{number}/skills/plan-to-video/SKILL.md'
                skill.parent.mkdir(parents=True)
                skill.write_bytes(contents)
            captured, error = io.StringIO(), None
            with patch('sys.argv', ['verify-package.py', str(package), str(home)]), \
                 contextlib.redirect_stdout(captured):
                try:
                    runpy.run_path(str(SOURCE / 'verify-package.py'), run_name='__main__')
                except SystemExit as exc:
                    error = exc.code
            return captured.getvalue(), error

    def test_correct_selected_guidance_is_verified(self):
        output, error = self.invoke([b'selected guidance'])
        self.assertIsNone(error)
        self.assertEqual(json.loads(output)['verified_copies'], 1)

    def test_missing_plugin_cache_is_refused(self):
        output, error = self.invoke([])
        self.assertEqual(output, '')
        self.assertIn('does not match', error)

    def test_other_version_with_same_plugin_name_is_refused(self):
        output, error = self.invoke([b'other guidance'])
        self.assertEqual(output, '')
        self.assertIn('does not match', error)

    def test_mixed_current_and_stale_caches_are_refused(self):
        output, error = self.invoke([b'selected guidance', b'other guidance'])
        self.assertEqual(output, '')
        self.assertIn('does not match', error)


if __name__ == '__main__':
    unittest.main()
