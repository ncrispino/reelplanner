#!/usr/bin/env node
// A selected Codex conversation, exported read-only to an external private file.
import { exportCodexSession } from "./lib/codex-session.mjs";
import { repoTop } from "./lib/explainer.mjs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const usage = `usage: reelplanner session export [codex:<id>] [--repo <repo>] [--out <external.jsonl>]
  Aliases: --thread <id> selects the thread; --output <path> is the same as --out.
  Reads saved Codex conversation/tool history without resuming the thread.
  Uses CODEX_THREAD_ID when present; otherwise selects the newest main conversation for this repo.
  CODEX_HOME selects the history store. Default output is a private file outside the repo.
  Prints only the export path. Never commit the transcript.`;
if (args.includes("--help") || args.includes("-h")) { console.log(usage); process.exit(0); }
const die = (m) => { console.error(`✗ session export: ${m}`); process.exit(1); };
if (args.shift() !== "export") die(usage);
const opts = {};
while (args.length) {
  const key = args.shift();
  if (key.startsWith("codex:") && key.length > 6) {
    const id = key.slice(6); if (opts.thread && opts.thread !== id) die("conflicting conversation identifiers");
    opts.thread = id; continue;
  }
  if (!["--repo", "--thread", "--output", "--out"].includes(key) || !args[0] || args[0].startsWith("--")) die(usage);
  const name = key === "--out" ? "output" : key.slice(2), value = args.shift();
  if (opts[name] && opts[name] !== value) die(name === "thread" ? "conflicting conversation identifiers" : `conflicting ${name} values`);
  opts[name] = value;
}
const repo = repoTop(resolve(opts.repo || process.cwd())) || die("not inside a git repo; pass --repo <repo>");
try { console.log(exportCodexSession({ repo, session: opts.thread || null, output: opts.output || null }).path); }
catch (e) { die(e.message); }
