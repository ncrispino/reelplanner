#!/usr/bin/env node
// Choose where ready videos open; optionally authorize only the Codex terminal opener.
//
// reelplanner review-setup --workspace terminal-browser --codex-allow-open
// reelplanner review-setup --workspace browser
// reelplanner review-setup --check
// reelplanner review-setup --codex-disable-open
// Add --dry-run to preview changes without writing anything.
//
// Run setup yourself in your local terminal. --codex-allow-open is explicit consent
// to write one dedicated Codex allow rule; ordinary setup and plugin installation
// never grant it. Restart Codex after changing rules. A managed forbid still wins.
// --check verifies the saved rule with Codex, not the effective permissions of a
// running session, pane access, sound, or playback. The rule covers opening only;
// review server startup and scripted page interaction need their own permission.
import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import { REVIEW_WORKSPACES } from "./lib/presentation.mjs";
import { preferencesFile, ruleFile, ruleDigest, bareWord, openerPrefix, openerRule, openerCommand, readReviewPreferences, findExecutable } from "./lib/review-preferences.mjs";

function write(file, content) {
  if (existsSync(file) && lstatSync(file).isSymbolicLink()) throw new Error(`Refusing to replace symlink: ${file}`);
  mkdirSync(dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, content, { flag: "wx", mode: 0o600 });
  try { renameSync(temp, file); } finally { if (existsSync(temp)) unlinkSync(temp); }
}
function checkRule(file) {
  const codex = findExecutable("codex");
  if (!codex) throw new Error("Codex is not installed; install it before enabling or checking its rule");
  const result = spawnSync(codex, ["execpolicy", "check", "--rules", file, "--", ...openerPrefix(), "http://127.0.0.1:8787/"], { encoding: "utf8", timeout: 10000 });
  // (its exit status decides: in Codex's Linux sandbox every child that ran also reports EPERM)
  if (result.status !== 0) throw new Error("Codex could not check the opener rule; inspect codex execpolicy check --help");
  let checked;
  try { checked = JSON.parse(result.stdout); } catch { throw new Error("Codex returned an unrecognized rule-check result"); }
  if (checked.decision !== "allow") throw new Error("Codex did not allow the opener under the saved rule");
}

try {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    const head = readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1);
    console.log(head.slice(0, head.findIndex((line) => !line.startsWith("//"))).map((line) => line.replace(/^\/\/ ?/, "")).join("\n"));
    process.exit(0);
  }
  let workspace, allow = false, disable = false, dry = false, check = false;
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--workspace": workspace = args[++i]; if (!REVIEW_WORKSPACES.includes(workspace)) throw new Error(`--workspace must be ${REVIEW_WORKSPACES.join(" | ")}`); break;
      case "--codex-allow-open": allow = true; break;
      case "--codex-disable-open": disable = true; break;
      case "--dry-run": dry = true; break;
      case "--check": check = true; break;
      default: throw new Error(`Unknown option: ${args[i]}`);
    }
  }
  if (allow && disable || check && (allow || disable || workspace)) throw new Error("Choose one of enable, disable, or check");
  if (!workspace && !allow && !disable && !check) throw new Error("Choose --workspace, --check, or --codex-disable-open (see --help)");
  const file = preferencesFile(), rules = ruleFile();
  if (!check && !dry && existsSync(file) && lstatSync(file).isSymbolicLink()) throw new Error(`Refusing to replace symlink: ${file}`);
  const preferences = readReviewPreferences();
  if ((allow || disable) && preferences.codexAutoOpen?.rule && preferences.codexAutoOpen.rule !== rules) {
    throw new Error("CODEX_HOME differs from the saved rule location; disable with the original CODEX_HOME first");
  }
  if (workspace) preferences.workspace = workspace;
  if (allow && preferences.workspace !== "terminal-browser") throw new Error("--codex-allow-open requires --workspace terminal-browser");
  if (preferences.workspace === "terminal-browser" && !disable) {
    const cli = findExecutable("terminal-browser");
    if (!cli) throw new Error("terminal-browser is not installed; install it first (on macOS: brew install --cask terminal-browser)");
    const help = spawnSync(cli, ["open", "--help"], { encoding: "utf8", timeout: 5000 });
    // In Codex's Linux sandbox every child reports EPERM and terminal-browser prints nothing: a check run there
    // cannot ask it, which is not the same as an answer without --split (setup itself runs in your own terminal)
    if (check && !help.stdout?.trim()) console.log(`△ terminal-browser's options could not be read here${help.error ? ` (${help.error.code})` : ""}, as inside an agent's sandbox: run --check in your own terminal to confirm its split support`);
    else if (help.status !== 0 || !/--split\b/.test(help.stdout || "")) throw new Error("terminal-browser does not report split support");
    if (check && preferences.terminalBrowser !== cli) throw new Error("terminal-browser moved; rerun review-setup --workspace terminal-browser");
    preferences.terminalBrowser = cli;
  }
  if (check) {
    console.log(`✓ saved workspace: ${preferences.workspace}`);
    if (!preferences.codexAutoOpen) console.log("· automatic Codex opening is not enabled");
    else {
      if (preferences.codexAutoOpen.rule !== rules || !existsSync(rules) || readFileSync(rules, "utf8") !== openerRule()) {
        throw new Error("Opener rule is missing, changed, or points to an older install; rerun review-setup --workspace terminal-browser --codex-allow-open");
      }
      checkRule(rules);
      console.log("✓ this saved Codex rule allows the installed opener");
      if (preferences.workspace !== "terminal-browser") console.log("· terminal opening is inactive for the saved workspace");
    }
    console.log("· restart Codex to load changed rules; managed policy and other rules may still deny access");
    console.log("· this check does not inspect a running session or open a pane");
  } else {
    const previousRule = existsSync(rules) ? readFileSync(rules, "utf8") : null;
    if ((allow || disable) && existsSync(rules) && (lstatSync(rules).isSymbolicLink() ||
        (readFileSync(rules, "utf8") !== openerRule() && ruleDigest(readFileSync(rules, "utf8")) !== preferences.codexAutoOpen?.digest))) {
      throw new Error(`Refusing to replace an unowned or edited rule file: ${rules}`);
    }
    if (allow) {
      if (!isAbsolute(preferences.terminalBrowser)) throw new Error("Expected a pinned terminal-browser executable");
      if (!bareWord(openerPrefix()[0])) throw new Error(`Node's path needs shell quoting (${openerPrefix()[0]}), and Codex applies a rule only to a command whose first word is unquoted; run reelplanner with a Node installed at a plain path`);
      console.log(`${dry ? "· would authorize" : "▶ authorize"} only: ${openerCommand("http://127.0.0.1:8787/")}`);
      console.log(openerRule().trimEnd());
      if (!dry) {
        // Verify before installing. This invokes only Codex's policy parser, no model.
        const temp = `${file}.rule-check.${process.pid}`;
        mkdirSync(dirname(temp), { recursive: true });
        writeFileSync(temp, openerRule(), { flag: "wx", mode: 0o600 });
        try { checkRule(temp); } finally { unlinkSync(temp); }
        write(rules, openerRule());
      }
      preferences.codexAutoOpen = { rule: rules, digest: ruleDigest(openerRule()) };
    }
    if (disable) {
      if (!dry && existsSync(rules)) unlinkSync(rules);
      delete preferences.codexAutoOpen;
      console.log(`${dry ? "· would remove" : "✓ removed"} reelplanner's dedicated opener rule`);
    }
    if (!dry) {
      try { write(file, JSON.stringify(preferences, null, 2) + "\n"); }
      catch (error) {
        // Do not leave a changed permission behind if saving its preference fails.
        if (allow || disable) {
          if (previousRule === null) { if (existsSync(rules)) unlinkSync(rules); }
          else write(rules, previousRule);
        }
        throw error;
      }
    }
    console.log(`${dry ? "· would save" : "✓ saved"} review workspace: ${preferences.workspace}`);
    if (allow || disable) console.log("Restart Codex to load the rule change. Managed restrictions still apply.");
  }
} catch (error) { console.error(`✗ ${error.message}`); process.exitCode = 1; }
