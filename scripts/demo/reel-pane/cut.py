#!/usr/bin/env python3
"""screen.mp4 + marks.json (from kitty.py) -> the finished demo: each step's stretch at its speed (said in the
caption when faster than real time), its caption on a bar over the transcript side. Nothing is added to the screen.

usage: cut.py <run-dir> <out.mp4>"""
import json, subprocess, sys

RUN, OUT = sys.argv[1], sys.argv[2]
marks = json.load(open(f"{RUN}/marks.json"))
end = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{RUN}/screen.mp4"],
                           capture_output=True, text=True).stdout)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
esc = lambda s: s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")
import os, tempfile
work = tempfile.mkdtemp(prefix="reel-cut-")
pieces = []
for i, m in enumerate(marks):
    a, b = m["t"], (marks[i + 1]["t"] if i + 1 < len(marks) else end)
    if b - a < 0.2:
        continue
    sp = m.get("speed", 1)
    cap = m["caption"] + (f"  ({sp}\u00d7)" if sp > 1 else "")
    vf = (f"setpts=PTS/{sp},fps=15,"
          f"drawbox=x=0:y=ih-150:w=1105:h=110:color=black@0.82:t=fill,"
          f"drawtext=fontfile={FONT}:text='{esc(cap)}':x=36:y=h-118:fontsize=34:fontcolor=white,format=yuv420p")
    piece = os.path.join(work, f"{i:02d}.mp4")
    # one step at a time: seek, cut, speed, caption (a single graph over every step holds them all in memory)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(a), "-t", str(b - a), "-i", f"{RUN}/screen.mp4",
                    "-vf", vf, "-an", "-c:v", "libx264", "-crf", "22", "-preset", "veryfast", piece], check=True)
    pieces.append(piece)
with open(os.path.join(work, "list.txt"), "w") as f:
    f.writelines(f"file '{p}'\n" for p in pieces)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(work, "list.txt"),
                "-c", "copy", "-movflags", "+faststart", OUT], check=True)
print(OUT)
