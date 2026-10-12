import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


class LoginHelperTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        shutil.copyfile(Path(__file__).with_name('login.py'), self.root / 'login.py')
        self.key = self.root / 'key'
        self.key.write_text('synthetic key fixture')
        fake = self.root / 'ssh'
        fake.write_text('#!/usr/bin/env python3\nimport json,sys\nfrom pathlib import Path\nPath(__file__).with_name("invoked.json").write_text(json.dumps(sys.argv[1:]))\n')
        fake.chmod(0o700)
        self.state = {'key': str(self.key), 'ip': '192.0.2.10', 'login_ready_at': 1}

    def tearDown(self):
        self.tmp.cleanup()

    def run_helper(self):
        (self.root / 'state.json').write_text(json.dumps(self.state))
        return subprocess.run(['python3', str(self.root / 'login.py')],
                              env={**os.environ, 'PATH': str(self.root) + os.pathsep + os.environ['PATH']},
                              capture_output=True, text=True)

    def test_expired_state_never_contacts_ssh(self):
        self.state['deleted_at'] = 2
        result = self.run_helper()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('expired', result.stderr)
        self.assertFalse((self.root / 'invoked.json').exists())

    def test_missing_key_never_contacts_ssh(self):
        self.key.unlink()
        result = self.run_helper()
        self.assertIn('expired', result.stderr)
        self.assertFalse((self.root / 'invoked.json').exists())

    def test_setup_pending_never_contacts_ssh(self):
        del self.state['login_ready_at']
        result = self.run_helper()
        self.assertIn('still being set up', result.stderr)
        self.assertFalse((self.root / 'invoked.json').exists())

    def test_recreated_machine_uses_current_state(self):
        self.assertEqual(self.run_helper().returncode, 0)
        self.state.update(key=str(self.root / 'new-key'), ip='192.0.2.11')
        Path(self.state['key']).write_text('second synthetic key fixture')
        self.assertEqual(self.run_helper().returncode, 0)
        args = json.loads((self.root / 'invoked.json').read_text())
        self.assertIn(self.state['key'], args)
        self.assertIn('ubuntu@192.0.2.11', args)
        self.assertNotIn(str(self.key), args)


if __name__ == '__main__':
    unittest.main()
