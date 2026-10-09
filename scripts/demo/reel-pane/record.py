#!/usr/bin/env python3
"""Drive a real Claude Code session in tmux and capture it: frames.jsonl (t, ansi) and marks.json (t, caption)."""
import json, subprocess, sys, threading, time

T = "demo"
OUT = sys.argv[1]
t0 = time.time()
frames = open(f"{OUT}/frames.jsonl", "w")
marks = []
stop = False


def cap(ansi=True):
    args = ["tmux", "capture-pane", "-t", T, "-p"] + (["-e"] if ansi else [])
    return subprocess.run(args, capture_output=True, text=True).stdout


def grab():
    while not stop:
        frames.write(json.dumps({"t": time.time() - t0, "a": cap()}) + "\n")
        time.sleep(0.2)


def keys(*k):
    subprocess.run(["tmux", "send-keys", "-t", T, *k])


def typed(text, cps=18):
    for ch in text:
        keys("-l", ch)
        time.sleep(1 / cps)


def mark(caption):
    marks.append({"t": time.time() - t0, "caption": caption})
    print(f"{time.time() - t0:6.1f}s  {caption}", flush=True)


def wait_for(text, timeout=240):
    end = time.time() + timeout
    while time.time() < end:
        if text in cap(False):
            return True
        time.sleep(0.5)
    print(f"!! timed out waiting for {text!r}", flush=True)
    return False


def wait_idle(timeout=300, quiet=6):
    """The turn is over: the screen has not changed for `quiet` seconds and no spinner line shows 'esc to interrupt'."""
    end = time.time() + timeout
    last, since = None, time.time()
    while time.time() < end:
        s = cap(False)
        if s != last:
            last, since = s, time.time()
        elif time.time() - since > quiet and "esc to interrupt" not in s:
            return True
        time.sleep(0.5)
    print("!! timed out waiting for idle", flush=True)
    return False


th = threading.Thread(target=grab, daemon=True)
th.start()

mark("A plan video is built. Ask Claude Code to open it for review.")
time.sleep(1.5)
typed("Open the explain-first plan's video for review: node bin/reelplanner.mjs review .reelplanner/plans/2026-09-29-explain-first/video --detach --no-open")
time.sleep(0.8)
keys("Enter")
mark("Claude runs `reelplanner review`. The mod notices it.")
wait_for("Review here")
time.sleep(1)
mark("A band above the prompt offers the video right here in Claude Code.")
wait_idle(quiet=4)
time.sleep(2)
mark("ctrl+x tab focuses the band; r opens the reel pane.")
keys("C-x")
time.sleep(0.3)
keys("Tab")
time.sleep(1.2)
keys("r")
wait_for("Choice 1 of 3")
mark("Stop 1 of 3: the question, what the video says there, the options, the recommendation.")
time.sleep(6)
keys("2")
mark("Press 2: pick B, the recommended option. The pane moves to the next stop.")
wait_for("Choice 2 of 3")
time.sleep(5)
keys("1")
mark("Stop 2: press 1 for A.")
wait_for("Choice 3 of 3")
time.sleep(5)
keys("e")
mark("Stop 3: e = 'Explain this more' (the question stays open).")
wait_for("Your review")
time.sleep(2)
mark("The summary: every answer, then Send.")
time.sleep(5)
keys("c")
mark("c: send it, changes needed. The row lands in .reelplanner/inbox/ and Claude picks it up.")
time.sleep(3)
keys("Escape")
wait_idle(timeout=400, quiet=8)
mark("Claude filed the review with reel-intake and acts on it.")
time.sleep(5)
stop = True
th.join()
frames.close()
json.dump(marks, open(f"{OUT}/marks.json", "w"), indent=1)
print("done", flush=True)
