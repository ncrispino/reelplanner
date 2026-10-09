#!/usr/bin/env node
// Tell the person a video is ready: a desktop notification (notify-send, osascript or PowerShell)
// with the video's title, what is waiting ("2 choices to make, 3 min") and the review link, and the
// same text on stdout. `reelplanner review <video-dir>` sends it on its own once the page is up;
// run this yourself after publishing a hosted page, with the artifact's URL.
//
// It always exits 0: a missing notifier is reported, never a failed build.
//
// usage: reelplanner notify <video-dir | plan-map.json> [--url <review-url>] [--title <t>] [--line <text>]
//        reelplanner notify --title <t> --line <text> [--url <u>]
//   REELPLANNER_NOTIFY=0 prints only; REELPLANNER_NOTIFY_CMD="<cmd>" runs `<cmd> <title> <body>` instead
import { notify, waitingLine, readPlanMap } from "./lib/notify.mjs";

const args = process.argv.slice(2);
const valued = new Set(["--url", "--title", "--line"]);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const src = args.find((a, i) => !a.startsWith("--") && !valued.has(args[i - 1]));
if (!src && !flag("title") && !flag("line")) { console.error("usage: reelplanner notify <video-dir | plan-map.json> [--url <u>] [--title <t>] [--line <text>]"); process.exit(0); }

const map = src ? readPlanMap(src) : null;
if (src && !map) console.error(`△ no plan-map.json at ${src}: the line says only what was given`);
const r = await notify({
  title: flag("title") || map?.title || "Video ready to review",
  line: flag("line") || (map ? waitingLine(map) : ""),
  url: flag("url") || "",
});
if (!r.shown) console.error(`△ no desktop notification (${r.error || r.via}); the text above is the notification`);
process.exit(0);
