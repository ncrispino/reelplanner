#!/usr/bin/env python3
"""frames.jsonl + marks.json -> PNG frames + concat list -> mp4. Idle stretches are shortened; nothing is invented."""
import json, os, subprocess, sys
import pyte
from PIL import Image, ImageDraw, ImageFont

RUN = sys.argv[1]
OUT = sys.argv[2]
COLS, ROWS = int(os.environ.get("COLS", 150)), int(os.environ.get("ROWS", 44))
W, H = 1920, 1080
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MAX_HOLD = 2.5      # an unchanged screen is shown at most this long
CAPTION_HOLD = 3.2  # ...unless a caption just changed: then long enough to read it

# the cell: as large as fits 1920 wide and the height less the caption bar
ch = min(22, (H - 100) // ROWS)
size = max(10, round(ch * 0.82))
font = ImageFont.truetype(FONT, size)
bold = ImageFont.truetype(BOLD, size)
cw = round(font.getlength("M"))
while cw * COLS > W - 40:
    size -= 1
    font, bold = ImageFont.truetype(FONT, size), ImageFont.truetype(BOLD, size)
    cw = round(font.getlength("M"))
TW, TH = cw * COLS, ch * ROWS
OX, OY = (W - TW) // 2, 12
cap_font = ImageFont.truetype(SANS, 30)
step_font = ImageFont.truetype(SANS_BOLD, 22)

BG, FG = (24, 24, 27), (220, 220, 220)
QUADS = {"▘": 1, "▝": 2, "▀": 3, "▖": 4, "▌": 5, "▞": 6, "▛": 7, "▗": 8, "▚": 9, "▐": 10, "▜": 11, "▄": 12, "▙": 13, "▟": 14, "█": 15}
NAMED = {
    "black": (0, 0, 0), "red": (205, 49, 49), "green": (13, 188, 121), "brown": (229, 229, 16), "yellow": (229, 229, 16),
    "blue": (36, 114, 200), "magenta": (188, 63, 188), "cyan": (17, 168, 205), "white": (229, 229, 229),
    "brightblack": (102, 102, 102), "brightred": (241, 76, 76), "brightgreen": (35, 209, 139), "brightyellow": (245, 245, 67),
    "brightblue": (59, 142, 234), "brightmagenta": (214, 112, 214), "brightcyan": (41, 184, 219), "brightwhite": (255, 255, 255),
}


def color(c, default):
    if c == "default":
        return default
    if c in NAMED:
        return NAMED[c]
    try:
        return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
    except Exception:
        return default


def draw_screen(ansi, caption, step):
    screen = pyte.Screen(COLS, ROWS)
    stream = pyte.Stream(screen)
    stream.feed(ansi.rstrip("\n").replace("\n", "\r\n"))
    img = Image.new("RGB", (W, H), (14, 14, 16))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([OX - 10, OY - 8, OX + TW + 10, OY + TH + 8], radius=10, fill=BG)
    for y in range(ROWS):
        line = screen.buffer[y]
        for x in range(COLS):
            c = line[x]
            fg, bg = color(c.fg, FG), color(c.bg, BG)
            if c.reverse:
                fg, bg = bg, fg
            px, py = OX + x * cw, OY + y * ch
            if bg != BG:
                d.rectangle([px, py, px + cw - 1, py + ch - 1], fill=bg)
            if c.data in QUADS:  # block elements: drawn as the quarters they light, as a terminal does
                m = QUADS[c.data]
                for k in range(4):
                    x0, y0 = px + (k & 1) * (cw // 2), py + (k >> 1) * (ch // 2)
                    w_, h_ = (cw // 2 if not k & 1 else cw - cw // 2), (ch // 2 if not k >> 1 else ch - ch // 2)
                    d.rectangle([x0, y0, x0 + w_ - 1, y0 + h_ - 1], fill=fg if (m >> k) & 1 else bg)
                continue
            if c.data.strip():
                d.text((px, py + 2), {"⏵": "▸", "⏸": "‖"}.get(c.data, c.data), font=bold if c.bold else font, fill=fg)
    # the caption bar
    top = OY + TH + 14
    d.rectangle([0, top, W, H], fill=(14, 14, 16))
    if caption:
        d.text((OX, top + 6), step, font=step_font, fill=(217, 119, 87))
        d.text((OX + 60, top + 2), caption, font=cap_font, fill=(240, 240, 240))
    return img


frames = [json.loads(l) for l in open(f"{RUN}/frames.jsonl")]
marks = json.load(open(f"{RUN}/marks.json"))
os.makedirs(OUT, exist_ok=True)


def caption_at(t):
    cur, n = None, 0
    for i, m in enumerate(marks):
        if m["t"] <= t:
            cur, n = m["caption"], i + 1
    return cur, n


# keep a frame when the screen or the caption changes
kept = []
for f in frames:
    cap, n = caption_at(f["t"])
    key = (f["a"], cap)
    if not kept or kept[-1]["key"] != key:
        kept.append({"t": f["t"], "a": f["a"], "cap": cap, "n": n, "key": key})

# where the agent works on its own, play faster (said in the caption)
SPEED = {int(k): int(v) for k, v in (x.split(":") for x in os.environ.get("SPEED", "").split(",") if x)}
SPEED.update({i + 1: int(m["speed"]) for i, m in enumerate(marks) if m.get("speed", 1) > 1})
fast = []
for k in kept:
    sp = SPEED.get(k["n"], 1)
    if sp > 1:
        k = {**k, "cap": f"{k['cap']}  ({sp}×)"}
        run = [x for x in fast if x["n"] == k["n"]]
        if run and len(run) % sp:
            fast.append({**k, "skip": True})
            continue
    fast.append(k)
kept = [k for k in fast if not k.get("skip")]
for i, k in enumerate(kept):
    if SPEED.get(k["n"], 1) > 1 and i + 1 < len(kept):
        k["t_end"] = k["t"] + (kept[i + 1]["t"] - k["t"]) / SPEED[k["n"]]

lines = []
for i, k in enumerate(kept):
    nxt = kept[i + 1]["t"] if i + 1 < len(kept) else k["t"] + 3
    gap = (k["t_end"] if "t_end" in k else nxt) - k["t"]
    caption_changed = i == 0 or kept[i - 1]["cap"] != k["cap"]
    dur = min(gap, CAPTION_HOLD if caption_changed else MAX_HOLD)
    if i + 1 == len(kept):
        dur = 4
    path = f"{OUT}/f{i:05d}.png"
    draw_screen(k["a"], k["cap"], f"{k['n']:>2}").save(path)
    lines.append(f"file '{path}'\nduration {dur:.3f}\n")
lines.append(f"file '{OUT}/f{len(kept) - 1:05d}.png'\n")
open(f"{OUT}/list.txt", "w").write("".join(lines))
print(len(frames), "captured,", len(kept), "kept, video", round(sum(float(l.split("duration ")[1]) for l in lines if "duration" in l), 1), "s")
