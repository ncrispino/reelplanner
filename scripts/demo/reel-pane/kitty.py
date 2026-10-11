#!/usr/bin/env python3
"""A real kitty, on a virtual display, running Claude Code with the plugin, through a whole review in /reel: the video
plays in the pane, j and k seek, a choice answered with a comment on the answer, a comment at the moment of the scene
it is about (m), the Send card saying what each answer leads to, then Changes needed. Nothing stands in for Claude:
Send hands the review to Claude in this conversation, which files it, edits the scene and rebuilds the video, as the
plan-to-video skill says; the pane notices the new version and plays just the change. Last, t: full screen, which
switches Claude Code to its classic layout and back, the session picked up across each restart. The screen is
grabbed as it is (ffmpeg x11grab); marks.json says when each step began, for cut.py's speeds and compose.py's
captions.

usage: kitty.py <out-dir> <launcher> <demo-repo> [review|fullscreen]
  review      the review, Send, Claude's revise and the change played (the default)
  fullscreen  t, the video full screen and back; its launcher runs `claude --continue`, so the conversation the
              restart picks up is the review's
  (DISPLAY names an X display; the launcher starts `claude` there)"""
import json, os, re, subprocess, sys, time

OUT, LAUNCH, REPO = sys.argv[1], sys.argv[2], sys.argv[3]
PART = sys.argv[4] if len(sys.argv) > 4 else "review"
VIDEO = "videos/l2-upload-resume"
SOCK = f"unix:{OUT}/kitty.sock"
env = {**os.environ, "LIBGL_ALWAYS_SOFTWARE": "1"}

kitty = subprocess.Popen(
    ["kitty", "-o", "font_size=10.5", "-o", "allow_remote_control=yes", "-o", "confirm_os_window_close=0",
     "-o", "remember_window_size=no", "-o", "initial_window_width=1920", "-o", "initial_window_height=1080",
     "--listen-on", SOCK, "--title", "reel", LAUNCH],
    env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)


def text():
    return subprocess.run(["kitty", "@", "--to", SOCK, "get-text"], capture_output=True, text=True).stdout


def wait_re(pattern, timeout=240):
    end = time.time() + timeout
    while time.time() < end:
        if re.search(pattern, text()):
            return True
        time.sleep(0.3)
    print(f"!! timed out waiting for /{pattern}/", flush=True)
    return False


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


if PART == "review":
    mark("/reel opens a plan's video in a pane, beside the conversation")
    time.sleep(1)
    typed(f"/reel {VIDEO}")
    time.sleep(0.6)
    key("Return")
    wait_for("playing")
    mark("It plays the video itself: sharp in kitty or Ghostty, with its sound")
    time.sleep(5)
    mark("k and j: on and back 5 seconds, as the browser player's arrow keys")
    key("k")
    time.sleep(2.5)
    key("j")
    time.sleep(3)
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
    typed("agreed: one table is enough")
    time.sleep(0.6)
    key("Return")
    time.sleep(3)
    mark("on to the scene that needs a change", speed=6)
    wait_re(r"1:3[2-9] / 3:36 · playing", 180)
    mark("m: a comment at this moment, on what is on the screen")
    key("m")
    time.sleep(1.2)
    typed("the tag should say what the client does next: part 4 missing, resend it")
    time.sleep(0.8)
    key("Return")
    time.sleep(3)
    mark("on to the next choice", speed=6)
    wait_for("stopped at choice 2", 180)
    mark("1 takes the recommended option")
    time.sleep(2)
    key("1")
    time.sleep(3)
    mark("on to the last choice", speed=6)
    wait_for("stopped at choice 3", 180)
    mark("1 answers the last choice")
    time.sleep(2)
    key("1")
    wait_for("Send your review", 60)
    time.sleep(1)
    mark("Send says what each answer leads to: Approve, or Changes needed")
    time.sleep(9)
    mark("c: Changes needed. The review goes to Claude, in this conversation")
    key("c")
    time.sleep(6)
    # Claude's turn: it claims the review, files it, edits the scene and rebuilds the video. However long it takes,
    # it is played in about 25 seconds
    mark("Claude files the review, edits the scene and rebuilds the video", speed=1)
    working = time.time()
    wait_for("The new version is ready", 3600)
    marks[-1]["speed"] = max(1, round((time.time() - working) / 25))
    time.sleep(4)
    mark("The pane saw the new version. g: watch what changed (its render for the terminal is made first)", speed=40)
    key("g")
    wait_for("· playing", 900)
    mark("Just the change: the tag Claude edited, from the comment")
    wait_for("· the end", 180)
    time.sleep(1)
    mark("When the changes end, Send again: approve now, or ask for more")
    time.sleep(6)
else:
    mark("Later, /reel again: z bigger, then t for full screen")
    time.sleep(1)
    typed(f"/reel {VIDEO}")
    time.sleep(0.6)
    key("Return")
    wait_for("playing")
    time.sleep(3)
    key("z")
    time.sleep(1.5)
    key("t")
    # leaving the fullscreen layout, Claude Code may ask why first: Esc skips it, and the restart goes on
    if wait_for("Esc to skip", 20):
        mark("Claude Code asks why you are leaving its fullscreen layout; Esc skips it, and it restarts")
        time.sleep(1.5)
        key("Escape")
    # the pane back, inline across the terminal: its t now goes back beside the chat
    wait_for("t: Beside the chat", 120)
    mark("The video across the whole terminal, where it was, the conversation picked up above it")
    time.sleep(8)
    mark("t again: back to the fullscreen layout, the pane beside the conversation, playing on")
    key("t")
    wait_for("t: Full screen", 120)
    time.sleep(6)
mark("", stop=True)
grab.communicate(b"q", timeout=30)
json.dump(marks, open(f"{OUT}/marks.json", "w"), indent=1)
kitty.terminate()
print("done", flush=True)
