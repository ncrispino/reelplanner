#!/usr/bin/env python3
"""Where a reelplanner run's time and tokens go, read from Claude Code transcripts.

  phase_times.py <session.jsonl> [more.jsonl …] [--since ISO] [--until ISO] [--cap 300] [--json out.json]

Each session's subagents (<session>/subagents/agent-*.jsonl, with their .meta.json descriptions) are read too.
Every stretch of an agent's transcript (one event to the next) goes to a phase:

  plan      writing and checking the plan: plan.md, reel new-plan / check / status / memory, spec, glossary, decisions
  build     turning the plan into a video: storyboard, script, frames, narration, render, guide, stage, plan map
  verify    checking the video before the person sees it: fresh eyes, snapshots and contact sheets, looking at
            pictures, check-terms / check-details, hyperframes check, fact-checks, comprehension tests
  review    the review loop: review server, waiting on and taking in reviews, reel record
  implement building the plan's code, its tests, the code check and the walkthrough's evidence
  other     anything else (research, chat, setup)

Each tool call is classified by what it touches; a call that touches nothing telling takes the agent's description
(e.g. "Fresh eyes: the newcomer" is verify, "Build frame 04" is build), else other. Only a call's command, its
description or its path are read, never the text it writes; pictures count as verify only when they are the video's. A gap counts in
full while the model writes its next message or a tool runs (up to two hours); any other gap (waiting on the person
or on a background agent) counts --cap seconds at most. Two totals per phase:
  agent-min  the sum over agents (what it costs: parallel agents add up)
  wall-min   the union of the stretches over all agents (how long the person waits)
In a session, what touches nothing telling before plan.md is first written counts as plan (research for it).
Answering fresh eyes is verify: from a fresh-eyes command to the next commit, build work counts as verify (rework).
Input tokens: each assistant message once, from its usage (cache reads included). Output tokens are estimated from
what the model wrote (characters / 4): the transcripts' usage holds streaming partials.
"""
import argparse, glob, json, os, re, sys
from collections import defaultdict
from datetime import datetime

PHASES = ["plan", "build", "verify", "review", "implement", "other"]

# by a subagent's description (first match wins)
DESC = [
    ("plan", r"plan against|against (the )?code|check .*\bplan\b|gap map|\bRW:|research"),
    ("verify", r"fresh[- ]?eyes|newcomer|designer|cold read|fact-?check|comprehension|skeptic|verif|review the|audit|"
               r"answer .*findings|findings|look at|check (the )?(frames|video)|contact sheet|snapshot|proofread|critique|qa\b"),
    ("build", r"frame|storyboard|script|narrat|render|beat|scene|re-?cue|redraw|draw|author|rebuild .*video|plan video|"
              r"walkthrough video|system video|explainer|video|guide|caption|legend|chapter|stage"),
    ("implement", r"implement|code check|code-check|tests?\b|fix .*bug|build the site|step \d+ code|walkthrough\b"),
    ("plan", r"\bplan\b|research|\bRW:|gap map|map .*internals|analy[sz]e|survey|design"),
]
# by what a tool call touches (command, path, description); first match wins
CALL = [
    ("review", r"review --wait|review --detach|reelplanner review|/inbox|\binbox\b|reel-intake|reel record|reel stops|annotations\.json"),
    ("verify", r"fresh-eyes|fresh_eyes|check-terms|check-details|contact-sheet|snapshots?/|hyperframes (check|lint|validate|inspect)|"
               r"code-check|reel audit|frame-?lint|frame-check"),
    ("build", r"STORYBOARD|SCRIPT\.md|compositions/|frames/|/video/|walkthrough-video|system-video|narrat|reelplanner build|"
              r"hyperframes (render|preview|snapshot|compose)|plan-map|reel stage|retime|caption|\btts\b|voice|guide/|BRIEF\.md|"
              r"frame\.md|theme/|faceless-explainer|hyperframes"),
    ("plan", r"plan\.md|reel new-plan|reel check|reel status|reel memory|decisions\.(md|json)|spec\.md|glossary\.md|system\.json|"
             r"reel init|plan-to-video"),
    ("implement", r"npm (test|run)|node --test|pytest|walkthrough\.md|git commit"),
]
DESC_RE = [(p, re.compile(r, re.I)) for p, r in DESC]
CALL_RE = [(p, re.compile(r, re.I)) for p, r in CALL]


def ts(s):
    try: return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()
    except Exception: return None


VIDEO_PATH = re.compile(r"video|frames?|snapshot|contact|fresh-eyes|stage|renders?|compositions", re.I)


def call_phase(name, inp):
    """What the call touches: a command and its description, or a path; never the text being written (a Write
    whose content mentions check-terms is not a check)."""
    if name == "Bash": text = (inp.get("command") or "") + " " + (inp.get("description") or "")
    elif "file_path" in inp or "path" in inp: text = str(inp.get("file_path") or inp.get("path") or "")
    else: text = name + " " + " ".join(str(v) for v in inp.values() if isinstance(v, str))[:300]
    if re.search(r"\.(png|jpe?g|webp)\b", text, re.I) or re.search(r"playwright|screenshot", text, re.I):
        # looking at pictures checks the video only when the pictures are the video's
        return "verify" if VIDEO_PATH.search(text) else None
    for p, r in CALL_RE:
        if r.search(text): return p
    return None


def desc_phase(desc):
    for p, r in DESC_RE:
        if r.search(desc or ""): return p
    return None


def kind(d):
    """assistant: the model speaking; result: a tool's answer coming back; other: the person, a notification, metadata."""
    if d.get("type") == "assistant": return "assistant"
    c = (d.get("message") or {}).get("content")
    if d.get("type") == "user" and isinstance(c, list) and any(x.get("type") == "tool_result" for x in c): return "result"
    return "other"


def read_agent(path, desc, since, until, cap):
    """→ {stretches: [(t0, t1, phase)], tokens: {phase: {...}}, calls: {phase: n}, start, end}

    What a call touches decides its phase; the agent's description is the fallback; else other (one call never
    decides the phase of the unrelated calls after it). A gap counts in full while the model writes or a tool runs; any other gap (waiting on the
    person or on a background agent) is capped at `cap`."""
    fallback = desc_phase(desc) if desc else None
    events = []; usage = {}; calls = defaultdict(int)
    cur = fallback or "other"; rework = False; est = defaultdict(int)
    planned = fallback is not None   # a subagent has its task; the session is planning until plan.md is written
    with open(path, errors="replace") as f:
        for line in f:
            try: d = json.loads(line)
            except Exception: continue
            t = ts(d.get("timestamp", "") or "")
            if t is None or (since and t < since) or (until and t > until): continue
            m = d.get("message") or {}
            content = m.get("content") if isinstance(m.get("content"), list) else []
            for c in content:
                if c.get("type") == "tool_use":
                    inp = c.get("input") or {}
                    p = call_phase(c.get("name", ""), inp) or fallback or "other"
                    said = (inp.get("command") or "") if c.get("name") == "Bash" else ""
                    # answering fresh eyes (fixes, rebuilds) is verify's rework, from a round to the next commit
                    if re.search(r"fresh-eyes|fresh_eyes", said): rework = True
                    elif re.search(r"git commit|review --detach", said): rework = False
                    if rework and p in ("build", "other"): p = "verify"
                    if re.search(r"plan\.md", str(inp.get("file_path") or "")) and c.get("name") in ("Write", "Edit"): planned = True
                    if not planned and p == "other": p = "plan"   # research before the plan exists is planning
                    calls[p] += 1; cur = p
                if d.get("type") == "assistant":
                    # what the model wrote, by length (usage holds streaming partials: a long Write shows a few tokens)
                    est[cur] += len(c.get("text") or c.get("thinking") or "") + (len(json.dumps(c.get("input"))) if c.get("type") == "tool_use" else 0)
            if d.get("type") == "assistant" and m.get("id") and m.get("usage"):
                u = m["usage"]; prev = usage.get(m["id"], (cur, {}))[1]
                # a message split over several lines: its last usage is the whole one; keep the larger of each count
                usage[m["id"]] = (cur, {k: max(prev.get(k, 0), u.get(k, 0) or 0) for k in
                                        ("output_tokens", "input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens")})
            events.append((t, cur, kind(d)))
    tokens = defaultdict(lambda: defaultdict(int))
    for ph, n in est.items(): tokens[ph]["out_est"] += n // 4
    for ph, u in usage.values():
        tokens[ph]["out"] += u["output_tokens"]; tokens[ph]["in"] += u["input_tokens"]
        tokens[ph]["cache_read"] += u["cache_read_input_tokens"]; tokens[ph]["cache_write"] += u["cache_creation_input_tokens"]
    events.sort(key=lambda e: e[0])
    stretches = []
    for (t0, p0, k0), (t1, _, k1) in zip(events, events[1:]):
        if t1 <= t0: continue
        # work: the model writing its next message, or a tool running (its result comes back next); anything
        # else (waiting on the person, on a background agent, a resumed session) counts `cap` seconds at most
        work = (k1 == "assistant" or (k0 == "assistant" and k1 == "result")) and t1 - t0 <= 7200
        stretches.append((t0, t1 if work else min(t1, t0 + cap), p0))
    return {"stretches": stretches, "tokens": tokens, "calls": calls,
            "start": events[0][0] if events else None, "end": events[-1][0] if events else None}


def union(intervals):
    total, end = 0.0, None
    for a, b in sorted(intervals):
        if end is None or a > end: total += b - a; end = b
        elif b > end: total += b - end; end = b
    return total


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sessions", nargs="+")
    ap.add_argument("--since"); ap.add_argument("--until")
    ap.add_argument("--cap", type=float, default=60, help="most seconds a gap that is not work counts (default 60)")
    ap.add_argument("--json", help="write the numbers here too")
    ap.add_argument("--agents", action="store_true", help="list each agent's minutes and phase")
    a = ap.parse_args()
    since, until = (ts(a.since) if a.since else None), (ts(a.until) if a.until else None)

    agents = []
    for s in a.sessions:
        agents.append(("main:" + os.path.basename(s)[:8], "", s))
        base = s[:-len(".jsonl")]
        for p in sorted(glob.glob(os.path.join(base, "subagents", "agent-*.jsonl"))):
            desc = ""
            try: desc = json.load(open(p[:-len(".jsonl")] + ".meta.json")).get("description", "")
            except Exception: pass
            agents.append((os.path.basename(p)[6:14], desc, p))

    per_phase_int = defaultdict(list); agent_sec = defaultdict(float)
    tok = defaultdict(lambda: defaultdict(int)); calls = defaultdict(int); rows = []; t_lo, t_hi = None, None
    for name, desc, p in agents:
        r = read_agent(p, desc, since, until, a.cap)
        if not r["stretches"]: continue
        secs = defaultdict(float)
        for t0, t1, ph in r["stretches"]:
            per_phase_int[ph].append((t0, t1)); agent_sec[ph] += t1 - t0; secs[ph] += t1 - t0
        for ph, d in r["tokens"].items():
            for k, v in d.items(): tok[ph][k] += v
        for ph, n in r["calls"].items(): calls[ph] += n
        t_lo = r["start"] if t_lo is None else min(t_lo, r["start"]); t_hi = r["end"] if t_hi is None else max(t_hi, r["end"])
        rows.append({"agent": name, "desc": desc, "min": round(sum(secs.values()) / 60, 1),
                     "phase": max(secs, key=secs.get), "by_phase": {k: round(v / 60, 1) for k, v in secs.items()},
                     "out_tokens": sum(d["out_est"] for d in r["tokens"].values())})

    out = {"agents": len(rows), "span_h": round((t_hi - t_lo) / 3600, 2) if t_lo else 0, "cap_s": a.cap, "phases": {}}
    print(f"{len(rows)} agents · span {out['span_h']} h (first to last event) · gaps capped at {a.cap:.0f} s\n")
    print(f"| phase | agent-min | wall-min | tool calls | output tokens (est.) | input tokens (incl. cache) |")
    print(f"|---|---:|---:|---:|---:|---:|")
    tot_a = sum(agent_sec.values())
    for ph in PHASES:
        if ph not in agent_sec and ph not in tok: continue
        t = tok[ph]; inp = t["in"] + t["cache_read"] + t["cache_write"]
        w = union(per_phase_int[ph])
        out["phases"][ph] = {"agent_min": round(agent_sec[ph] / 60, 1), "wall_min": round(w / 60, 1), "calls": calls[ph],
                             "out_tokens_est": t["out_est"], "out_tokens_usage": t["out"], "in_tokens": inp,
                             "share": round(agent_sec[ph] / tot_a, 3) if tot_a else 0}
        print(f"| {ph} | {agent_sec[ph]/60:.0f} ({100*agent_sec[ph]/tot_a:.0f}%) | {w/60:.0f} | {calls[ph]} | {t['out_est']:,} | {inp:,} |")
    allw = union([iv for v in per_phase_int.values() for iv in v])
    print(f"| all | {tot_a/60:.0f} | {allw/60:.0f} | {sum(calls.values())} | {sum(t['out_est'] for t in tok.values()):,} | "
          f"{sum(t['in'] + t['cache_read'] + t['cache_write'] for t in tok.values()):,} |")
    out["all"] = {"agent_min": round(tot_a / 60, 1), "wall_min": round(allw / 60, 1)}
    if a.agents:
        print("\n| agent | description | min | main phase | output tokens |\n|---|---|---:|---|---:|")
        for r in sorted(rows, key=lambda r: -r["min"]):
            print(f"| {r['agent']} | {r['desc'][:60]} | {r['min']} | {r['phase']} | {r['out_tokens']:,} |")
    out["agent_rows"] = rows
    if a.json: json.dump(out, open(a.json, "w"), indent=1)


if __name__ == "__main__":
    main()
