#!/usr/bin/env python3
"""A real kitty, on a virtual display, running Claude Code with the plugin, through all of /reel: the video plays
in the pane (bigger with z), a comment at a moment (m), a choice answered with a comment on the answer (1, c), one in
the reviewer's own words (o), the Send card saying what each answer leads to, Send to a waiting session, the
rebuild (one scene's words edited and plan-diff run, as a revise does), the pane noticing the new version, just
the changes played, then the whole video (v). The screen is grabbed as it is (ffmpeg x11grab); marks.json says when
each step began, for cut.py's captions and speeds.

usage: kitty.py <out-dir> <launcher> <demo-repo>   (DISPLAY names an X display; the launcher starts `claude` there)"""
import json, os, subprocess, sys, time

OUT, LAUNCH, REPO = sys.argv[1], sys.argv[2], sys.argv[3]
VIDEO = "videos/l2-upload-resume"
SCENE = f"{REPO}/{VIDEO}/compositions/frames/09-step-3.html"
SOCK = f"unix:{OUT}/kitty.sock"
env = {**os.environ, "LIBGL_ALWAYS_SOFTWARE": "1"}

kitty = subprocess.Popen(
    ["kitty", "-o", "font_size=10.5", "-o", "allow_remote_control=yes", "-o", "confirm_os_window_close=0",
     "-o", "remember_window_size=no", "-o", "initial_window_width=1920", "-o", "initial_window_height=1080",
     "--listen-on", SOCK, "--title", "reel", LAUNCH],
    env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)


def text():
    return subprocess.run(["kitty", "@", "--to", SOCK, "get-text"], capture_output=True, text=True).stdout


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
mark("It plays the video itself: sharp in kitty or Ghostty, with its sound")
time.sleep(5)
mark("z: bigger. The pane widens and the review folds away")
key("z")
time.sleep(6)
key("z")
mark("z again: back")
time.sleep(2.5)
mark("m: a comment at this moment. The video waits, then plays on")
key("m")
time.sleep(1.2)
typed("the billed-twice beat lands well")
time.sleep(0.6)
key("Return")
time.sleep(4)
mark("on to the first open choice", speed=6)
wait_for("stopped at choice 1", 120)
mark("At each open choice the video stops, and the choice appears under it")
time.sleep(6)
key("1")
mark("1 picks Postgres, and its part of the video plays")
time.sleep(2.5)
mark("c: a comment on that answer (filed as the decision's note)")
key("c")
time.sleep(1.2)
typed("if the migration stays one table")
time.sleep(0.6)
key("Return")
time.sleep(4)
mark("on to the next choice", speed=6)
wait_for("stopped at choice 2", 180)
mark("o: an answer in your own words")
time.sleep(3)
key("o")
time.sleep(1.2)
typed("Server id, and log the client key beside it")
time.sleep(0.8)
key("Return")
time.sleep(4)
mark("on to the last choice", speed=6)
wait_for("stopped at choice 3", 180)
mark("1 answers the last choice")
time.sleep(3)
key("1")
wait_for("Send your review", 30)
time.sleep(1)
mark("Send says what each answer leads to: Approve, or Changes needed")
time.sleep(9)
# a session waiting on the review, as the skill keeps one: it claims the row Send writes
waiter = subprocess.Popen(["node", "bin/reelplanner.mjs", "review", "--wait", "--timeout", "600"], cwd=REPO,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(4)
mark("c: Changes needed. A waiting session claims the review")
key("c")
time.sleep(7)
# the revise: one scene's words changed, and plan-diff records what changed, as a rebuild does
mark("Claude revises a scene and rebuilds; the pane notices the new version")
subprocess.run(["sed", "-i", "s/>part 4 missing</>part 4 missing: resend it</", SCENE])
subprocess.run(["node", "bin/reelplanner.mjs", "plan-diff", VIDEO], cwd=REPO, stdout=subprocess.DEVNULL)
wait_for("The new version is ready", 60)
time.sleep(4)
mark("g: watch what changed. First its render for the terminal is made, once", speed=40)
key("g")
wait_for("· playing", 900)
mark("Just the changes: scene 9, the one edited. Answered choices are not stopped at again")
wait_for("· the end", 120)
time.sleep(1)
mark("When the changes end, Send again is there: approve, or ask for more")
time.sleep(6)
mark("v: the whole video instead, playing on from where the changes ended")
key("v")
time.sleep(9)
mark("", stop=True)
grab.communicate(b"q", timeout=30)
json.dump(marks, open(f"{OUT}/marks.json", "w"), indent=1)
waiter.terminate()
kitty.terminate()
print("done", flush=True)
