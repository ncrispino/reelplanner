#!/usr/bin/env python3
"""Drive a real Claude Code session in tmux: /reel plays a video in the pane, stops at a choice, takes the answer,
plays its branch and goes on. Writes frames.jsonl (t, ansi) and marks.json (t, caption, speed) for render.py."""
import json, subprocess, sys, threading, time

T = "demo"
OUT = sys.argv[1]
VIDEO = sys.argv[2] if len(sys.argv) > 2 else "videos/l2-upload-resume"
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
        time.sleep(1 / 12)


def keys(*k):
    subprocess.run(["tmux", "send-keys", "-t", T, *k])


def typed(text, cps=20):
    for ch in text:
        keys("-l", ch)
        time.sleep(1 / cps)


def mark(caption, speed=1):
    marks.append({"t": time.time() - t0, "caption": caption, "speed": speed})
    print(f"{time.time() - t0:6.1f}s  {caption}", flush=True)


def wait_for(text, timeout=240):
    end = time.time() + timeout
    while time.time() < end:
        if text in cap(False):
            return True
        time.sleep(0.25)
    print(f"!! timed out waiting for {text!r}", flush=True)
    return False


th = threading.Thread(target=grab, daemon=True)
th.start()

mark("A plan video is built. /reel opens it in a pane beside the conversation.")
time.sleep(1.5)
typed(f"/reel {VIDEO}")
time.sleep(0.8)
keys("Enter")
wait_for("playing to choice 1")
mark("It plays in the pane: the video's own frames, its captions under them, its sound on this machine.")
time.sleep(14)
mark("(Skipping ahead: the video plays on to its first open choice.)", speed=6)
wait_for("choice 1: answer below", timeout=120)
mark("At 0:58 it stops at the first open choice: the question and its options, under the frame.")
time.sleep(7)
keys("1")
mark("Press 1: Postgres. The branch for that answer plays...")
wait_for("playing to choice 2")
time.sleep(7)
mark("...then the video goes on toward the next choice.", speed=6)
wait_for("choice 2: answer below", timeout=180)
mark("Choice 2. p pauses, r replays, digits answer; Send files the review as the player does.")
time.sleep(6)
stop = True
th.join()
frames.close()
json.dump(marks, open(f"{OUT}/marks.json", "w"), indent=1)
print("done", flush=True)
