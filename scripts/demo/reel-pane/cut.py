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
parts, labels = [], []
for i, m in enumerate(marks):
    a, b = m["t"], (marks[i + 1]["t"] if i + 1 < len(marks) else end)
    if b - a < 0.2:
        continue
    sp = m.get("speed", 1)
    cap = m["caption"] + (f"  ({sp}×)" if sp > 1 else "")
    parts.append(
        f"[0:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{sp},"
        f"drawbox=x=0:y=ih-150:w=1105:h=110:color=black@0.82:t=fill,"
        f"drawtext=fontfile={FONT}:text='{esc(cap)}':x=36:y=h-118:fontsize=34:fontcolor=white[v{i}]")
    labels.append(f"[v{i}]")
graph = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,fps=15,format=yuv420p[out]"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"{RUN}/screen.mp4", "-filter_complex", graph, "-map", "[out]",
                "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-movflags", "+faststart", OUT], check=True)
print(OUT)
