// Tell the person a video is ready: a desktop notification with the link and what is waiting.
//
// It is reelplanner's own, not the agent's, so it works the same under any agent (D-064). Where the
// agent has notifications of its own (a phone push, a message in the session) it sends those too.
//
// Two rules: it always prints the same text to stdout (a headless box, an SSH session and a CI log
// all still see it), and it never throws. A build that passed does not fail because a notification
// daemon is missing.
//
//   REELPLANNER_NOTIFY=0           no desktop notification (stdout only)
//   REELPLANNER_NOTIFY_CMD="…"     run this instead of the OS command, as `<cmd> <title> <body>`
//                                  (a phone push such as ntfy, or a stub in a test)
import { spawn } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { platform as osPlatform } from "node:os";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/**
 * "2 choices to make, 3 min": what a review of this video will ask of the person, from its plan-map.
 * Open questions are choices to make, the agent's calls (a walkthrough) are to accept or flag, quick
 * checks are quiz beats; minutes are what the reviewer actually sits through (branches not taken
 * are skipped), rounded, never under one.
 */
export function waitingLine(map = {}) {
  const parts = [];
  const n = (k) => (Array.isArray(map[k]) ? map[k].length : 0);
  if (n("decisions")) parts.push(plural(n("decisions"), "choice to make", "choices to make"));
  // a stop beat's calls and a grouped beat's are each judged one by one (fewer-better-stops step 1); the
  // list's are only flagged or left (walkthroughs-that-help step 2, D-221)
  const groups = Array.isArray(map.autonomyGroups) ? map.autonomyGroups : [], size = (g) => (g.ids || g.calls || []).length;
  const calls = n("autonomy") + groups.filter((g) => !g.list).reduce((a, g) => a + size(g), 0), listed = groups.filter((g) => g.list).reduce((a, g) => a + size(g), 0);
  if (calls) parts.push(plural(calls, "call to accept or flag", "calls to accept or flag"));
  if (listed) parts.push(plural(listed, "more on a list to flag if you'd change it", "more on a list to flag if you'd change them"));
  if (n("quizzes")) parts.push(plural(n("quizzes"), "quick check", "quick checks"));
  if (!parts.length) parts.push("nothing to decide");
  // what fresh eyes left as it is after its three rounds (videos-that-make-sense step 2), said before you open it
  const left = Array.isArray(map.freshEyes?.left) ? map.freshEyes.left.length : 0;
  if (left) parts.push(`${plural(left, "thing", "things")} fresh eyes left as ${left === 1 ? "it is" : "they are"} (Before you watch says why)`);
  const secs = Number(map.watchedSeconds ?? map.totalSeconds) || 0;
  if (secs > 0) parts.push(`${Math.max(1, Math.round(secs / 60))} min`);
  return parts.join(", ");
}

/** The plan-map of a video dir (or a plan-map.json path), or null. */
export function readPlanMap(p) {
  try {
    const f = existsSync(p) && statSync(p).isDirectory() ? join(p, "plan-map.json") : p;
    return JSON.parse(readFileSync(f, "utf8"));
  } catch { return null; }
}

/**
 * A command string (`claude -p`, `node "/a b/fake.mjs"`) or an argv array, as an argv array.
 * Double and single quotes group; nothing else is interpreted — no shell, no expansion.
 */
export function splitCommand(cmd) {
  if (Array.isArray(cmd)) return cmd.map(String);
  const out = []; let cur = "", q = null, any = false;
  for (const ch of String(cmd || "")) {
    if (q) { if (ch === q) q = null; else cur += ch; }
    else if (ch === '"' || ch === "'") { q = ch; any = true; }
    else if (/\s/.test(ch)) { if (cur || any) out.push(cur); cur = ""; any = false; }
    else cur += ch;
  }
  if (cur || any) out.push(cur);
  return out;
}

/** The OS's own notifier: [exe, args, extra env]. Title and body travel as env, never as script text. */
export function osCommand(plat = osPlatform(), title, body) {
  const env = { RP_NOTIFY_TITLE: title, RP_NOTIFY_BODY: body };
  if (plat === "darwin") return ["osascript", ["-e", 'display notification (system attribute "RP_NOTIFY_BODY") with title (system attribute "RP_NOTIFY_TITLE")'], env];
  if (plat === "win32") return ["powershell", ["-NoProfile", "-NonInteractive", "-Command",
    "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; " +
    "$n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; " +
    "$n.ShowBalloonTip(10000, $env:RP_NOTIFY_TITLE, $env:RP_NOTIFY_BODY, 'Info'); Start-Sleep -Seconds 10; $n.Dispose()"], env];
  return ["notify-send", [title, body], env];
}

/**
 * Print, then show a desktop notification. Resolves (never rejects) once the notifier has exited or
 * `waitMs` has passed: { printed, shown, via, error }. The notifier itself is unref'd, so a slow
 * one holds the calling process for `waitMs` at most.
 */
export function notify({ title, line, url }, { platform = osPlatform(), env = process.env, waitMs = 3000, log = console.log } = {}) {
  title = String(title || "Video ready to review");
  const body = [line, url].filter(Boolean).join("\n");
  try { log(`🔔 ${title}\n   ${[line, url].filter(Boolean).join("\n   ")}`); } catch { /* stdout closed: still try the desktop */ }
  if (env.REELPLANNER_NOTIFY === "0") return Promise.resolve({ printed: true, shown: false, via: "off" });
  let exe, args, extra = {};
  if (env.REELPLANNER_NOTIFY_CMD) { const argv = splitCommand(env.REELPLANNER_NOTIFY_CMD); [exe, args] = [argv[0], [...argv.slice(1), title, body]]; }
  else [exe, args, extra] = osCommand(platform, title, body);
  return new Promise((ok) => {
    let done = false;
    const finish = (r) => { if (!done) { done = true; clearTimeout(t); ok({ printed: true, via: exe, ...r }); } };
    // ref'd on purpose: a caller that awaits this (the CLI) must not exit on an unsettled await
    const t = setTimeout(() => finish({ shown: true, pending: true }), waitMs);
    try {
      const child = spawn(exe, args, { stdio: "ignore", env: { ...env, ...extra }, windowsHide: true, detached: platform !== "win32" });
      child.on("error", (e) => finish({ shown: false, error: e.code === "ENOENT" ? `${exe} not found` : e.message }));
      child.on("exit", (code) => finish(code === 0 ? { shown: true } : { shown: false, error: `${exe} exited ${code}` }));
      child.unref();
    } catch (e) { finish({ shown: false, error: e.message }); }
  });
}
