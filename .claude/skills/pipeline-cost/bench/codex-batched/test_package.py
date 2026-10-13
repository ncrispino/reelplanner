import importlib.util
from pathlib import Path
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('verify_package', HERE / 'verify-package.py')
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)


class CompleteGuidance(unittest.TestCase):
    def fixture(self, root):
        package, home = root / 'package', root / 'isolated-home'
        source = package / 'skills/plan-to-video'
        cached = home / 'plugins/cache/reelplanner/1/skills/plan-to-video'
        for folder in [source, cached]:
            (folder / 'references').mkdir(parents=True)
            (folder / 'SKILL.md').write_text('identical top-level skill')
            (folder / 'references/authoring.md').write_text('selected authoring guidance')
            (folder / 'references/frame-shell.md').write_text('selected shared frame shell')
        return package, home, cached

    def test_complete_matching_tree_records_every_relative_path(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            result = verifier.verify(package, home)
            self.assertEqual(result['verified_copies'], 1)
            self.assertEqual(set(result['markdown_sha256']), {'SKILL.md', 'references/authoring.md', 'references/frame-shell.md'})

    def test_identical_skill_cannot_hide_stale_reference(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            (cached / 'references/authoring.md').write_text('stale authoring guidance')
            with self.assertRaisesRegex(ValueError, 'changed.*references/authoring.md'):
                verifier.verify(package, home)

    def test_missing_frame_shell_is_refused(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            (cached / 'references/frame-shell.md').unlink()
            with self.assertRaisesRegex(ValueError, 'missing.*references/frame-shell.md'):
                verifier.verify(package, home)

    def test_extra_markdown_reference_is_refused(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            (cached / 'references/stale-extra.md').write_text('extra stale reference')
            with self.assertRaisesRegex(ValueError, 'extra.*references/stale-extra.md'):
                verifier.verify(package, home)

    def test_every_same_named_cache_copy_is_verified(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            stale = home / 'plugins/cache/reelplanner/old/skills/plan-to-video'
            import shutil
            shutil.copytree(cached, stale)
            (stale / 'references/frame-shell.md').write_text('stale shell')
            with self.assertRaisesRegex(ValueError, 'changed.*references/frame-shell.md'):
                verifier.verify(package, home)

    def test_other_skill_and_auth_files_are_not_read(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            (home / 'auth.json').write_text('not a JSON credential fixture; never open')
            other = home / 'plugins/cache/other/1/skills/unrelated'
            other.mkdir(parents=True)
            (other / 'SKILL.md').symlink_to(home / 'auth.json')
            self.assertEqual(verifier.verify(package, home)['verified_copies'], 1)

    def test_symlink_reference_refused_before_reading_target(self):
        with tempfile.TemporaryDirectory() as folder:
            package, home, cached = self.fixture(Path(folder))
            secret = home / 'auth.json'
            secret.write_text('never read this')
            (cached / 'references/frame-shell.md').unlink()
            (cached / 'references/frame-shell.md').symlink_to(secret)
            with self.assertRaisesRegex(ValueError, 'Symlink.*frame-shell.md'):
                verifier.verify(package, home)


if __name__ == '__main__':
    unittest.main()
