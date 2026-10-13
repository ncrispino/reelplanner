"""Reuse the original deadlines/process-group monitor, adding durable allowlisted checkpoints."""
import importlib.util
import os
import sys
import time
from pathlib import Path
from durable import checkpoint


def main():
    spec = importlib.util.spec_from_file_location('original_phase_monitor', Path(__file__).with_name('phase_monitor_original.py'))
    original = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(original)
    out = Path(sys.argv[1])
    home = Path(os.environ['CODEX_HOME'])
    sleep = time.sleep
    last = 0

    def durable_sleep(seconds):
        nonlocal last
        if time.monotonic() - last >= 15:
            checkpoint(out, home)
            last = time.monotonic()
        sleep(seconds)

    original.time.sleep = durable_sleep
    try:
        original.main()
    finally:
        original.time.sleep = sleep
        checkpoint(out, home)


if __name__ == '__main__':
    main()
