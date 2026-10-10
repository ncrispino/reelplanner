#!/usr/bin/env python3
"""A run's milestones, to cut it into episodes for phase_times.py --since/--until.

  milestones.py <session.jsonl> [--since ISO] [--until ISO] [--width 110]

One line per milestone, in time order (UTC):
  ASK     the person speaks (a request, an answer, a review pasted in; not a skill's text or a task notification)
  AGENT   a subagent starts (its description, from <session>/subagents/agent-*.meta.json, at its first event)
  SHOWN   the agent gives the person a video to watch: a review page link (http://127.0.0.1:<port>/…, a claude.ai
          artifact) or a line saying a video is ready
  BUILD   a reelplanner build, narration or render command (in the session or a subagent, [named])
  CHECK   a fresh-eyes round, check-terms / check-details, a snapshot or contact sheet
  REVIEW  a review taken in (reel-intake, reel record, inbox done)

An episode runs from the ASK that asked for the plan or the video to the first SHOWN after it; what follows (the
person's review, the revise) is the next episode.
"""
import argparse, glob, json, os, re
from datetime import datetime, timezone

SHOWN = re.compile(r"https?://127\.0\.0\.1:\d+/\S*|claude\.ai/(code/)?artifact/\S+|(video|walkthrough|review page)[^.\n]{0,40}\b(is )?ready", re.I)
CMD = [("BUILD", re.compile(r"reelplanner (build|narrate)|hyperframes render|narrate\.mjs|build\.mjs", re.I)),
       ("CHECK", re.compile(r"fresh-eyes|check-terms|check-details|contact-sheet|snapshot", re.I)),
       ("REVIEW", re.compile(r"reel-intake|reel record|inbox done", re.I))]


def ts(s):
    try: return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception: return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("session"); ap.add_argument("--since"); ap.add_argument("--until")
    ap.add_argument("--width", type=int, default=110)
    a = ap.parse_args()
    lo, hi = (ts(a.since) if a.since else None), (ts(a.until) if a.until else None)
    rows = []

    def add(t, kind, text):
        if t and (not lo or t >= lo) and (not hi or t <= hi):
            rows.append((t, kind, " ".join(str(text).split())[:a.width]))

    with open(a.session, errors="replace") as f:
        for line in f:
            try: d = json.loads(line)
            except Exception: continue
            t = ts(d.get("timestamp", "") or ""); m = d.get("message") or {}; c = m.get("content")
            if d.get("type") == "user":
                if isinstance(c, str):
                    if not c.lstrip().startswith("<") and not c.startswith("Base directory for this skill"): add(t, "ASK", c)
                elif isinstance(c, list) and not any(x.get("type") == "tool_result" for x in c):
                    txt = " ".join(x.get("text", "") for x in c if x.get("type") == "text")
                    if txt.strip() and not txt.lstrip().startswith("<") and not txt.startswith("Base directory for this skill"):
                        add(t, "ASK", txt)
            elif d.get("type") == "assistant" and isinstance(c, list):
                for x in c:
                    if x.get("type") == "text" and SHOWN.search(x.get("text", "")):
                        mt = SHOWN.search(x["text"]); add(t, "SHOWN", x["text"][max(0, mt.start() - 40):])
                    if x.get("type") == "tool_use" and x.get("name") == "Bash":
                        cmd = (x.get("input") or {}).get("command", "")
                        for k, r in CMD:
                            if r.search(cmd): add(t, k, cmd); break
    base = a.session[:-len(".jsonl")]
    for p in glob.glob(os.path.join(base, "subagents", "agent-*.jsonl")):
        desc = ""
        try: desc = json.load(open(p[:-len(".jsonl")] + ".meta.json")).get("description", "")
        except Exception: pass
        first = True
        with open(p, errors="replace") as f:
            for line in f:
                try: d = json.loads(line)
                except Exception: continue
                t = ts(d.get("timestamp", "") or "")
                if not t: continue
                if first: add(t, "AGENT", desc or os.path.basename(p)); first = False
                c = (d.get("message") or {}).get("content")
                for x in c if isinstance(c, list) else []:
                    if x.get("type") == "tool_use" and x.get("name") == "Bash":
                        cmd = (x.get("input") or {}).get("command", "")
                        for k, r in CMD:
                            if r.search(cmd): add(t, k, f"[{desc[:24]}] {cmd}"); break
    rows.sort(key=lambda r: r[0])
    for t, k, txt in rows:
        print(f"{t.astimezone(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}  {k:<6} {txt}")


if __name__ == "__main__":
    main()
