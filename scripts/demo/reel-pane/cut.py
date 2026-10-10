#!/usr/bin/env python3
"""screen.mp4 + marks.json (from kitty.py) -> the demo's footage: each step's stretch at its speed, one after another.
Nothing is added to the screen.

With --bare, the footage alone and, beside it, <out>.captions.json: each step's caption with its start and end in
the cut and its speed, for compose.py, which lays the captions over the footage in HyperFrames. Without it, the
captions are drawn on a plain bar over the transcript side (ffmpeg drawtext): a quick look, no HyperFrames.

usage: cut.py <run-dir> <out.mp4> [--bare]"""
import json, os, subprocess, sys, tempfile

RUN, OUT = sys.argv[1], sys.argv[2]
BARE = "--bare" in sys.argv[3:]
marks = json.load(open(f"{RUN}/marks.json"))


def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True).stdout)


end = duration(f"{RUN}/screen.mp4")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BAR = 1105  # the caption bar covers the transcript side, short of the pane


def wrap(s):
    """The caption in lines that fit the bar."""
    from PIL import ImageFont
    face = ImageFont.truetype(FONT, 34)
    out = [""]
    for word in s.split():
        line = f"{out[-1]} {word}".strip()
        if face.getlength(line) > BAR - 72 and out[-1]:
            out.append(word)
        else:
            out[-1] = line
    return out


work = tempfile.mkdtemp(prefix="reel-cut-")
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
pieces, captions, at = [], [], 0.0
for i, m in enumerate(marks):
    if m.get("stop"):
        break  # the video ends here; the rest is the recorder winding down
    a, b = m["t"], (marks[i + 1]["t"] if i + 1 < len(marks) else end)
    if b - a < 0.2 or m.get("skip"):
        continue  # a skip mark cuts its stretch: a wait with nothing on the screen changing
    sp = m.get("speed", 1)
    vf = f"setpts=PTS/{sp},fps=15,"
    if not BARE:
        cap = m["caption"] + (f"  ({sp}×)" if sp > 1 else "")
        lines = wrap(cap)
        capfile = os.path.join(work, f"{i:02d}.txt")
        open(capfile, "w").write("\n".join(lines))
        tall = 46 * len(lines) + 64
        vf += (f"drawbox=x=0:y=ih-{tall + 40}:w={BAR}:h={tall}:color=black@0.82:t=fill,"
               f"drawtext=fontfile={FONT}:textfile='{capfile}':x=36:y=h-{tall + 8}:fontsize=34:line_spacing=12:"
               f"fontcolor=white,")
    vf += "format=yuv420p"
    piece = os.path.join(work, f"{i:02d}.mp4")
    # one step at a time: seek, cut, speed, caption (a single graph over every step holds them all in memory)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(a), "-t", str(b - a), "-i", f"{RUN}/screen.mp4",
                    "-vf", vf, "-an", "-c:v", "libx264", "-crf", "18" if BARE else "22", "-preset", "veryfast", piece],
                   check=True)
    pieces.append(piece)
    took = duration(piece)
    captions.append({"start": round(at, 3), "end": round(at + took, 3), "text": m["caption"], "speed": sp})
    at += took
with open(os.path.join(work, "list.txt"), "w") as f:
    f.writelines(f"file '{p}'\n" for p in pieces)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(work, "list.txt"),
                "-c", "copy", "-movflags", "+faststart", OUT], check=True)
if BARE:
    json.dump(captions, open(f"{os.path.splitext(OUT)[0]}.captions.json", "w"), indent=1)
print(OUT)
