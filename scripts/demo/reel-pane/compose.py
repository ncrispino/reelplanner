#!/usr/bin/env python3
"""The demo's footage (cut.py --bare) and its captions -> the finished demo, captioned in HyperFrames.

It writes a HyperFrames project in a scratch folder: the footage at the top, as it was recorded, and under it a bar of
its own with one caption per step (so nothing on the screen is covered: the conversation, where Claude works, or the
video full screen): the key pressed in a keycap, what it does, the step's number, a badge when the step plays faster
than real time, and a line along the bar's top that fills as the step plays. Then it renders the project with this
checkout's pinned HyperFrames. Nothing in the repo is changed.

usage: compose.py <footage.mp4> <out.mp4> [--keep <dir>] [--no-render]   (the captions: <footage>.captions.json, from
       cut.py; --keep writes the project there and keeps it, --no-render stops before the render)"""
import html, json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FOOTAGE, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
KEEP = sys.argv[sys.argv.index("--keep") + 1] if "--keep" in sys.argv else None
caps = json.load(open(f"{os.path.splitext(FOOTAGE)[0]}.captions.json"))
total = caps[-1]["end"]
BAR = 150  # the caption bar under the 1920x1080 footage

work = os.path.abspath(KEEP) if KEEP else tempfile.mkdtemp(prefix="reel-compose-")
os.makedirs(f"{work}/assets/fonts", exist_ok=True)
shutil.copy(FOOTAGE, f"{work}/assets/footage.mp4")
shutil.copy(f"{ROOT}/videos/l2-upload-resume/assets/vendor/gsap.min.js", f"{work}/assets/gsap.min.js")
for face in ("inter-latin-wght-normal.woff2", "jetbrains-mono-latin-wght-normal.woff2"):
    shutil.copy(f"{ROOT}/packages/player/fonts/{face}", f"{work}/assets/fonts/{face}")

# a caption that starts with what was pressed ("z: bigger", "1 picks Postgres", "/reel opens…") gets that in a keycap
KEY = re.compile(r"^(/reel|[a-z0-9])(?=:| again:| )[: ]?\s*(.*)$")
steps = [c for c in caps if c["text"].strip()]


def card(i, c):
    m = KEY.match(c["text"])
    key, text = (m.group(1), m.group(2)) if m else (None, c["text"])
    text = text[:1].upper() + text[1:]
    badge = f'<span class="badge">{c["speed"]}× faster</span>' if c["speed"] > 1 else ""
    cap = f'<kbd>{html.escape(key)}</kbd>' if key else ""
    return f'''
      <div id="cap-{i}" class="clip cap" data-start="{c["start"]}" data-duration="{round(c["end"] - c["start"], 3)}" data-track-index="{2 + i % 2}">
        <div class="track"><div class="fill" id="fill-{i}"></div></div>
        <div class="card" id="card-{i}">
          <div class="meta"><span class="step">Step {i + 1:02d} / {len(steps):02d}</span>{badge}</div>
          <div class="line">{cap}<span class="text">{html.escape(text)}</span></div>
        </div>
      </div>'''


cards = "".join(card(i, c) for i, c in enumerate(steps))
tweens = []
for i, c in enumerate(steps):
    d = c["end"] - c["start"]
    tweens.append(f'tl.fromTo("#fill-{i}", {{ scaleX: 0 }}, {{ scaleX: 1, duration: {d:.3f}, ease: "none" }}, {c["start"]});')
    if d >= 1.2:
        tweens.append(f'tl.fromTo("#card-{i}", {{ y: 12, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }}, {c["start"]});')
        tweens.append(f'tl.to("#card-{i}", {{ opacity: 0, duration: 0.25, ease: "power1.in" }}, {c["end"] - 0.25:.3f});')

page = f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height={1080 + BAR}" />
    <title>/reel in Claude Code</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Inter"; src: url("assets/fonts/inter-latin-wght-normal.woff2") format("woff2"); font-weight: 100 900; }}
      @font-face {{ font-family: "JetBrains Mono"; src: url("assets/fonts/jetbrains-mono-latin-wght-normal.woff2") format("woff2"); font-weight: 100 800; }}
      body {{ margin: 0; background: #000; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; }}
      #footage {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }}
      #bar {{ position: absolute; left: 0; right: 0; bottom: 0; height: {BAR}px; background: #141417; border-top: 1px solid #2a2a30; }}
      /* the caption bar under the footage: nothing on the screen is covered */
      .cap {{ position: absolute; left: 0; right: 0; bottom: 0; height: {BAR}px; }}
      .card {{
        position: absolute; left: 56px; right: 56px; top: 0; bottom: 0; display: flex; align-items: center; gap: 40px;
        color: #f4f1ea; font-family: "Inter", sans-serif;
      }}
      .meta {{ flex: none; width: 210px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }}
      .step {{ font-family: "JetBrains Mono", monospace; font-size: 20px; letter-spacing: 0.08em; color: #9a968d; text-transform: uppercase; }}
      .badge {{
        font-family: "JetBrains Mono", monospace; font-size: 19px; font-weight: 600; color: #1a1a1a; background: #e8946f;
        border-radius: 999px; padding: 3px 12px;
      }}
      .line {{ flex: 1; display: flex; align-items: center; gap: 22px; }}
      kbd {{
        flex: none; font-family: "JetBrains Mono", monospace; font-size: 30px; font-weight: 700; color: #f4f1ea;
        background: #2b2b31; border: 1px solid rgba(255, 255, 255, 0.28); border-bottom-width: 4px; border-radius: 10px;
        padding: 4px 14px; line-height: 1.2;
      }}
      .text {{ font-size: 36px; line-height: 1.25; font-weight: 500; letter-spacing: -0.01em; }}
      .track {{ position: absolute; left: 0; right: 0; top: 0; height: 4px; background: rgba(255, 255, 255, 0.06); overflow: hidden; }}
      .fill {{ height: 100%; background: #e8946f; transform-origin: left center; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="{1080 + BAR}" data-fps="15" data-duration="{total}">
      <video id="footage" class="clip" src="assets/footage.mp4" data-start="0" data-duration="{total}" data-track-index="0" muted playsinline></video>
      <div id="bar"></div>
{cards}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join("      " + t for t in tweens).lstrip()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open(f"{work}/index.html", "w").write(page)
hf = ["node", f"{ROOT}/bin/reelplanner.mjs", "hyperframes"]
subprocess.run([*hf, "lint", work], check=True)
if "--no-render" in sys.argv:
    sys.exit(print(work))
subprocess.run([*hf, "render", work, "-o", OUT, "--fps", "15", "--quality", "delivery", "--video-frame-format", "png", "--quiet"],
               check=True)
if not KEEP:
    shutil.rmtree(work, ignore_errors=True)
print(OUT)
