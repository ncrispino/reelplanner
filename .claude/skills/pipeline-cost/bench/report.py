#!/usr/bin/env python3
"""A bench run, measured: from what the run recorded as it went, not read back from transcripts.

  timing.jsonl    every reelplanner command's start, end and exit code (rp-shim.sh)
  otel.jsonl      Claude Code's telemetry (otel-sink.mjs): each model request with its exact tokens, cost and duration,
                  each tool call with its duration, every session (the main agent, its subagents, fresh eyes' claude -p)
  reviewer.jsonl  when the video was shown, when the review was sent, when the revised video was shown
  run.jsonl       when the run started and why it ended

Episodes (wall time is what a person waits):
  first video   from the request to the first `review <video-dir> --detach` that ended well (the link is given)
  revision      from the review being sent to the next such showing

Phases, from reelplanner's own commands (no guessing from what a tool call looks like):
  plan      before the episode's first video command (anything but `reel init/new-plan/check/stage/…` and `setup`)
  build     from there on, except:
  verify    from a fresh-eyes round's start (`fresh-eyes <dir>` or `--script`, not `--check`/`--prompt`): a round on the
            built video to the next `build` started after it (the agents reading, the answers, the fixes); a read of
            the script (`--script`, before frames exist) to the first command that works on frames
  rework    every `build` after a fresh-eyes round on the built video, and what comes between them: building again
            because of what fresh eyes found (after a script read, the frames are drawn for the first time: build)
Agent minutes: each model request and tool call (its duration, ending at its timestamp), put in the phase its middle
falls in, summed over every session (parallel agents add up). An Agent tool call is left out: its subagent's own
requests are counted. Tokens and cost are summed the same way.

Checks it makes (and prints): every request ran on one model at one effort (the bench sets Opus 5.5 at medium);
every transcript session sent telemetry; nothing measured after the run ended; and a
note of output tokens by telemetry against the transcripts' text/4 (which leaves out thinking).

usage: python3 report.py <run.tgz or extracted dir> [--json out.json]
"""
import json, sys, tarfile, tempfile, os, glob, collections
from datetime import datetime

args = sys.argv[1:]
if not args: print(__doc__); sys.exit(2)
src = args[0]; out_json = args[args.index("--json") + 1] if "--json" in args else None
if os.path.isfile(src):
    d = tempfile.mkdtemp(prefix="bench-"); tarfile.open(src).extractall(d, filter="data"); src = d
O = os.path.join(src, "bench-out")

def jl(p):
    try: return [json.loads(l) for l in open(p) if l.strip()]
    except FileNotFoundError: return []

run = jl(os.path.join(O, "run.jsonl")); rev = jl(os.path.join(O, "reviewer.jsonl")); tim = jl(os.path.join(O, "timing.jsonl"))
start = next((e for e in run if e["ev"] == "run-start"), None); end = next((e for e in run if e["ev"] == "run-end"), None)
if not start: sys.exit("✗ no run-start in run.jsonl")
T0 = start["at"]; TEND = end["at"] if end else None
shown = sorted([e for e in rev if e["ev"] == "shown"], key=lambda e: e["n"]); sent = next((e for e in rev if e["ev"] == "review-sent" and e.get("status") == 200), None)
S1 = shown[0]["shownAt"] if shown else None; S2 = shown[1]["shownAt"] if len(shown) > 1 else None; R = sent["at"] if sent else None

# reelplanner's commands: start, end, exit
cmds, starts = [], {}
for e in tim:
    if e["ev"] == "start": starts[e["id"]] = e
    elif e["ev"] == "end" and e["id"] in starts:
        s = starts.pop(e["id"]); cmds.append(dict(cmd=s["cmd"], args=s["args"], start=s["at"], end=e["at"], exit=e["exit"]))
for s in starts.values(): cmds.append(dict(cmd=s["cmd"], args=s["args"], start=s["at"], end=None, exit=None))
cmds.sort(key=lambda c: c["start"])
def sub(c):
    """(the command's name, whether it is a `reel` one): `reel build`, `reelplanner reel check`, `reelplanner build`"""
    a = c["args"]
    if c["cmd"] == "reel": return (a[0] if a else "", True)
    if a[:1] == ["reel"]: return (a[1] if len(a) > 1 else "", True)
    return (a[0] if a else "", False)
# the commands that make or check the video: the plan phase ends at the first of them (setup and environment checks,
# `reel init/new-plan/check`, reading the inbox are not)
VIDEO = {"build", "narrate", "patch-tts-speed", "frame-packet", "frame-check", "frame-lint", "detail", "snapshot", "hyperframes",
         "check-terms", "check-sources", "verify", "finish-project", "plan-map", "plan-diff", "fresh-eyes", "review", "retime-frames",
         "hold-durations", "transcribe-missing", "guide", "explainer", "storyboard", "contact-sheet"}
def is_video(c):
    name, reel = sub(c)
    if reel: return name == "build"
    return name in VIDEO and not (name == "review" and "--wait" in c["args"])
def is_round(c):
    name, reel = sub(c)
    return not reel and name == "fresh-eyes" and not any(a in ("--check", "--prompt") for a in c["args"])
FRAME_WORK = {"frame-packet", "frame-check", "frame-lint", "build", "narrate", "snapshot", "finish-project"}
def is_frame_work(c):
    name, reel = sub(c)
    return (reel and name == "build") or (not reel and name in FRAME_WORK)
def is_build(c):
    name, reel = sub(c)
    return name == "build"

def phases(a, b):
    """[(phase, from, to)] covering [a, b), by the commands started in it."""
    cs = [c for c in cmds if a <= c["start"] < b]
    first_video = next((c["start"] for c in cs if is_video(c)), b)
    marks = [(a, "plan"), (first_video, "build")]
    first_round = None
    for i, c in enumerate(cs):
        if is_round(c):
            first_round = first_round or c["start"]
            # a frames round (on a built video) runs to the next build: the answers and the fixes they cause; a read
            # of the script (`--script`, before frames exist) to the first command that works on frames
            ends = is_frame_work if "--script" in c["args"] else is_build
            nb = next((x["start"] for x in cs[i + 1:] if ends(x)), b)
            # after a frames round, building again is rework; after a script read, the frames are drawn for the first time
            marks += [(c["start"], "verify"), (nb, "build" if "--script" in c["args"] else "rework")]
    marks.sort(key=lambda m: m[0])
    out = []
    for i, (t, p) in enumerate(marks):
        u = marks[i + 1][0] if i + 1 < len(marks) else b
        if u > t: out.append((p, t, u))
    return out

episodes = []
if S1: episodes.append(("first video", T0, S1))
if R and S2: episodes.append(("revision", R, S2))

# telemetry: model requests and tool calls, from every session
def attrs(r): return {a["key"]: next(iter(a["value"].values()), None) for a in r.get("attributes", [])}
reqs, tools, sessions = [], [], collections.Counter()
for line in jl(os.path.join(O, "otel.jsonl")):
    b = line.get("body")
    if not isinstance(b, dict): continue
    for rl in b.get("resourceLogs", []):
        for sl in rl.get("scopeLogs", []):
            for r in sl.get("logRecords", []):
                a = attrs(r); name = a.get("event.name")
                ts = a.get("event.timestamp")
                if not ts: continue
                t = int(datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp() * 1000)
                sessions[a.get("session.id")] += 1
                if name == "api_request":
                    reqs.append(dict(end=t, dur=float(a.get("duration_ms") or 0), session=a.get("session.id"), src=a.get("query_source"),
                        inp=int(a.get("input_tokens") or 0), out=int(a.get("output_tokens") or 0), cr=int(a.get("cache_read_tokens") or 0),
                        cc=int(a.get("cache_creation_tokens") or 0), cost=float(a.get("cost_usd") or 0), model=a.get("model"), effort=a.get("effort")))
                elif name == "tool_result" and a.get("tool_name") not in ("Agent", "Task"):
                    tools.append(dict(end=t, dur=float(a.get("duration_ms") or 0), session=a.get("session.id"), tool=a.get("tool_name")))

def phase_at(ph, t):
    for p, a, b in ph:
        if a <= t < b: return p
    return None

report = {"run": start.get("label"), "reelplanner": start.get("reelplanner"), "depth": start.get("depth") or None, "ended": end and end.get("why"), "episodes": []}
for ename, a, b in episodes:
    ph = phases(a, b)
    row = {"episode": ename, "wall_min": round((b - a) / 60000, 1), "phases": {}}
    acc = collections.defaultdict(lambda: dict(wall_ms=0, agent_ms=0, calls=0, requests=0, inp=0, out=0, cache_read=0, cache_create=0, cost=0.0))
    for p, x, y in ph: acc[p]["wall_ms"] += y - x
    for q in reqs:
        mid = q["end"] - q["dur"] / 2
        if a <= mid < b:
            k = acc[phase_at(ph, mid) or "other"]; k["agent_ms"] += q["dur"]; k["requests"] += 1
            k["inp"] += q["inp"]; k["out"] += q["out"]; k["cache_read"] += q["cr"]; k["cache_create"] += q["cc"]; k["cost"] += q["cost"]
    for c in tools:
        mid = c["end"] - c["dur"] / 2
        if a <= mid < b: k = acc[phase_at(ph, mid) or "other"]; k["agent_ms"] += c["dur"]; k["calls"] += 1
    for p, k in acc.items():
        row["phases"][p] = dict(wall_min=round(k["wall_ms"] / 60000, 1), agent_min=round(k["agent_ms"] / 60000, 1), tool_calls=k["calls"], requests=k["requests"],
            input_tok=k["inp"], output_tok=k["out"], cache_read_tok=k["cache_read"], cache_create_tok=k["cache_create"], cost_usd=round(k["cost"], 2))
    cs = [c for c in cmds if a <= c["start"] < b]
    builds = [c for c in cs if is_build(c)]
    row["builds"] = dict(n=len(builds), failed=sum(1 for c in builds if c["exit"] not in (0, None)), minutes=round(sum(((c["end"] or b) - c["start"]) for c in builds) / 60000, 1))
    row["fresh_eyes_rounds"] = sum(1 for c in cs if is_round(c))
    row["sessions"] = len({q["session"] for q in reqs if a <= q["end"] <= b})
    report["episodes"].append(row)

# checks: every transcript session sent telemetry; output tokens against the transcripts' estimate; nothing after the end
checks = []
tr = glob.glob(os.path.join(src, ".claude", "projects", "*", "*.jsonl"))
tr_sessions = {os.path.basename(p)[:-6] for p in tr}
missing = sorted(tr_sessions - set(sessions))
checks.append(("every transcript session sent telemetry", not missing, f"{len(tr_sessions)} transcripts, {len(set(sessions) - {None})} sessions in telemetry" + (f"; none from {', '.join(missing[:5])}" if missing else "")))
est = 0
for p in tr + glob.glob(os.path.join(src, ".claude", "projects", "*", "*", "subagents", "*.jsonl")):
    for l in open(p, errors="replace"):
        try: m = json.loads(l).get("message") or {}
        except Exception: continue
        if m.get("role") == "assistant":
            for c in m.get("content") or []:
                if isinstance(c, dict): est += len(c.get("text") or c.get("thinking") or json.dumps(c.get("input") or "")) / 4
tot_out = sum(q["out"] for q in reqs)
ratio = (tot_out / est) if est else None
# a note, not a check: telemetry counts the model's thinking, which transcripts do not keep, so text/4 runs low
notes = [f"output tokens: {tot_out:,} by telemetry, ~{int(est):,} in the transcripts' text/4" + (f" ({ratio:.2f}×: thinking is not in transcripts)" if ratio else "")]
late = [q for q in reqs if TEND and q["end"] > TEND + 60000]
checks.append(("nothing measured after the run ended", not late, f"{len(late)} requests after the end" if late else "none"))
checks.append(("both showings and the review were seen", bool(S1 and R and S2), f"shown {S1 is not None}, review sent {R is not None}, shown again {S2 is not None}"))
mix = collections.Counter((q["model"], q["effort"]) for q in reqs)
checks.append(("one model and one effort for every request", len(mix) == 1, ", ".join(f"{m} at {e}: {n}" for (m, e), n in mix.most_common()) or "no requests"))
report["mix"] = {f"{m}@{e}": n for (m, e), n in mix.items()}
report["checks"] = [dict(name=n, ok=o, detail=d) for n, o, d in checks]

print(f"# {report['run']} · reelplanner {report['reelplanner']}{' · ' + report['depth'] + ' depth' if report['depth'] else ''} · ended: {report['ended']}\n")
for e in report["episodes"]:
    print(f"## {e['episode']}: {e['wall_min']} min wall · {e['builds']['n']} builds ({e['builds']['failed']} failed, {e['builds']['minutes']} min) · {e['fresh_eyes_rounds']} fresh-eyes run(s) · {e['sessions']} session(s)\n")
    print("| Phase | Wall min | Agent min | Requests | Tool calls | In tok (with cache) | Out tok | Cost $ |\n|---|---:|---:|---:|---:|---:|---:|---:|")
    for p in ("plan", "build", "verify", "rework", "other"):
        k = e["phases"].get(p)
        if k: print(f"| {p} | {k['wall_min']} | {k['agent_min']} | {k['requests']} | {k['tool_calls']} | {k['input_tok'] + k['cache_read_tok'] + k['cache_create_tok']:,} | {k['output_tok']:,} | {k['cost_usd']} |")
    print()
print("## Checks\n")
for c in report["checks"]: print(f"- {'✓' if c['ok'] else '✗'} {c['name']}: {c['detail']}")
for n in notes: print(f"- · {n}")
report["notes"] = notes
if out_json: json.dump(report, open(out_json, "w"), indent=2)
