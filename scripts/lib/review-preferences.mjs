// Machine-local presentation preferences. Project files cannot grant Codex permissions.
import { accessSync, constants, existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { delimiter, join, resolve } from "node:path";
import { ROOT, machineDir, shellQuote } from "./env.mjs";
import { REVIEW_WORKSPACES } from "./presentation.mjs";

export const preferencesFile = (env = process.env) => join(machineDir(env), "review.json");
export const ruleFile = (env = process.env) => join(resolve(env.CODEX_HOME || join(homedir(), ".codex")), "rules", "reelplanner-review.rules");
export const ruleHeader = "# Managed by reelplanner review-setup; grants only the local review opener.\n";
export const ruleDigest = (text) => createHash("sha256").update(text).digest("hex");
export const openerPrefix = () => [realpathSync(process.execPath), realpathSync(join(ROOT, "bin/reelplanner.mjs")), "review-open"];
export const openerCommand = (url) => [...openerPrefix(), url].map(shellQuote).join(" ");
export const openerRule = () => `${ruleHeader}prefix_rule(\n    pattern = ${JSON.stringify(openerPrefix())},\n    decision = "allow",\n    justification = "Open an existing local reelplanner review in terminal-browser; no server launch or review writes",\n)\n`;

export function readReviewPreferences(env = process.env) {
  const file = preferencesFile(env);
  if (!existsSync(file)) return { version: 1, workspace: "browser" };
  let value;
  try { value = JSON.parse(readFileSync(file, "utf8")); }
  catch { throw new Error(`Cannot read ${file}; repair its JSON before changing review preferences`); }
  if (!value || value.version !== 1 || !REVIEW_WORKSPACES.includes(value.workspace)) throw new Error(`Invalid review preferences in ${file}`);
  return value;
}

export function findExecutable(name, env = process.env) {
  for (const dir of (env.PATH || "").split(delimiter).filter(Boolean)) {
    const file = resolve(dir, name);
    try { accessSync(file, constants.X_OK); if (statSync(file).isFile()) return realpathSync(file); } catch { /* next PATH entry */ }
  }
  return null;
}

// Deliberately accept only the URL shape emitted by review.mjs, never arbitrary
// localhost endpoints, redirects, files, credentials, or non-loopback addresses.
export function localReviewUrl(input) {
  let url;
  try { url = new URL(input); } catch { throw new Error("Expected a local review URL"); }
  if (!/^http:\/\/127\.0\.0\.1:\d+\//.test(input) || url.hostname !== "127.0.0.1" ||
      url.protocol !== "http:" || !url.port || url.username || url.password || url.hash || url.pathname !== "/" ||
      [...url.searchParams.keys()].some((k) => k !== "project") || url.searchParams.getAll("project").length > 1 ||
      (url.searchParams.has("project") && !/^(?!\.{1,2}$)[\p{L}\p{N}_. -]+$/u.test(url.searchParams.get("project")))) {
    throw new Error("Only http://127.0.0.1:<port>/?project=<video> review URLs are allowed");
  }
  return url;
}
