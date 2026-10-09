#!/usr/bin/env python3
"""A real kitty, on a virtual display, running Claude Code with the plugin: /reel plays a video in the pane, stops at
its choices, takes the answers (a digit, and one in the reviewer's own words), and ends on the review to send. The
screen is grabbed as it is (ffmpeg x11grab); marks.json says when each step began, for cut.py's captions and speeds.

usage: kitty.py <out-dir> <launcher> [video-dir]   (DISPLAY names an X display; the launcher starts `claude`)"""
import json, os, subprocess, sys, time

OUT, LAUNCH = sys.argv[1], sys.argv[2]
VIDEO = sys.argv[3] if len(sys.argv) > 3 else "videos/l2-upload-resume"
SOCK = f"unix:{OUT}/kitty.sock"
env = {**os.environ, "LIBGL_ALWAYS_SOFTWARE": "1"}

kitty = subprocess.Popen(
    ["kitty", "-o", "font_size=10.5", "-o", "allow_remote_control=yes", "-o", "confirm_os_window_close=0",
     "-o", "remember_window_size=no", "-o", "initial_window_width=1920", "-o", "initial_window_height=1080",
     "--listen-on", SOCK, "--title", "reel", LAUNCH],
    env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)


def text():
    r = subprocess.run(["kitty", "@", "--to", SOCK, "get-text"], capture_output=True, text=True)
    return r.stdout


def wait_for(s, timeout=240):
    end = time.time() + timeout
    while time.time() < end:
        if s in text():
            return True
        time.sleep(0.3)
    print(f"!! timed out waiting for {s!r}", flush=True)
    return False


def window():
    return subprocess.run(["xdotool", "search", "--name", "reel"], capture_output=True, text=True).stdout.split()[0]


def key(k):
    subprocess.run(["xdotool", "key", "--window", window(), k])


def typed(s):
    subprocess.run(["xdotool", "type", "--window", window(), "--delay", "45", s])


wait_for("auto mode on", 60)
w = window()
subprocess.run(["xdotool", "windowsize", w, "1920", "1080"])
subprocess.run(["xdotool", "windowmove", w, "0", "0"])
time.sleep(1)

grab = subprocess.Popen(
    ["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-framerate", "15", "-video_size", "1920x1080",
     "-i", os.environ.get("DISPLAY", ":99"), "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", f"{OUT}/screen.mp4"],
    stdin=subprocess.PIPE)
t0 = time.time()
marks = []


def mark(caption, speed=1, stop=False):
    marks.append({"t": round(time.time() - t0, 2), "caption": caption, "speed": speed, **({"stop": True} if stop else {})})
    print(f"{time.time() - t0:6.1f}s  {caption}", flush=True)


mark("/reel opens a plan's video in a pane, beside the conversation")
time.sleep(1)
typed(f"/reel {VIDEO}")
time.sleep(0.6)
key("Return")
wait_for("playing")
mark("It plays: the video itself, sharp in kitty or Ghostty, with its sound")
time.sleep(7)
mark("m leaves a comment at this moment; the video waits, then plays on")
key("m")
time.sleep(1.2)
typed("the billed-twice beat lands well")
time.sleep(0.6)
key("Return")
time.sleep(6)
mark("on to the first open choice", speed=5)
wait_for("stopped at choice 1", 120)
mark("At a choice the video stops, and the choice appears under it")
time.sleep(7)
key("1")
mark("1 picks Postgres: its part of the video plays, then on")
time.sleep(9)
mark("on to the next choice", speed=5)
wait_for("stopped at choice 2", 180)
mark("o answers in your own words")
time.sleep(4)
key("o")
time.sleep(1.5)
typed("Server id, and log the client key beside it")
time.sleep(1)
key("Return")
time.sleep(7)
mark("on to the last choice", speed=5)
wait_for("stopped at choice 3", 180)
mark("Choice 3: 1 again")
time.sleep(5)
key("1")
wait_for("Send your review", 30)
time.sleep(1)
mark("The review, ready to send: a approves, c asks for changes")
time.sleep(8)
mark("", stop=True)
grab.communicate(b"q", timeout=30)
json.dump(marks, open(f"{OUT}/marks.json", "w"), indent=1)
kitty.terminate()
print("done", flush=True)
