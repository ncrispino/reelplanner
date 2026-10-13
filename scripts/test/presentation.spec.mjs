// Subprocess contract checks only. Fake launchers never prove graphics/audio/UI.
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, platform } from "node:os";
import { openReview } from "../lib/presentation.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-presentation-"));
const log = join(tmp, "calls.jsonl");
const env = { PATH: tmp, RP_PRESENTATION_LOG: log };
let count = 0;
const check = (label, yes) => { assert.ok(yes, label); console.log(`✓ ${label}`); count++; };
const calls = () => existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").map(JSON.parse) : [];
function launcher(name, help, exit = 0) {
  writeFileSync(join(tmp, name), `#!${process.execPath}\nimport {appendFileSync} from 'node:fs';\nconst args=process.argv.slice(2);\nappendFileSync(process.env.RP_PRESENTATION_LOG,JSON.stringify({name:${JSON.stringify(name)},args})+'\\n');\nif(args.includes('--help')) console.log(${JSON.stringify(help)});\nprocess.exit(${exit});\n`, { mode: 0o755 });
}
const url = "http://127.0.0.1:8787/?project=plan&name=hello%20there";
try {
  check("invalid workspace fails without launching anything", (await openReview({ url, workspace: "tmux", env })).status === "error" && !calls().length);
  check("invalid URL fails without launching anything", (await openReview({ url: "file:///tmp/player.html", env })).status === "error" && !calls().length);
  check("a PTY-looking TERM alone never establishes support when the CLI is absent", (await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM: "tmux-256color" } })).status === "unavailable" && !calls().length);
  check("missing terminal-browser is reported", /not installed/.test((await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM_PROGRAM: "ghostty" } })).reason));
  launcher("terminal-browser", "open URL --split right");
  const tb = await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM_PROGRAM: "ghostty" } });
  check("terminal-browser receives the exact URL as one argument in a right split", tb.status === "opened" && JSON.stringify(calls().at(-1).args) === JSON.stringify(["open", "--split", "right", url]));
  const other = await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM_PROGRAM: "future-supported-terminal" } });
  check("terminal-browser decides compatibility for terminals outside a reelplanner allowlist", other.status === "opened" && calls().at(-1).name === "terminal-browser");
  const plain = await openReview({ url, workspace: "terminal-browser", env });
  check("an explicit request still delegates when terminal environment hints are unavailable", plain.status === "opened" && calls().at(-1).name === "terminal-browser");
  launcher("terminal-browser", "old CLI");
  const before = calls().length;
  check("an installed CLI without split support is not launched", (await openReview({ url, workspace: "terminal-browser", env: { ...env, KITTY_WINDOW_ID: "1" } })).status === "unavailable" && calls().length === before + 1);
  launcher("terminal-browser", "--split", 2);
  check("launcher failure is never reported as opened", (await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM_PROGRAM: "ghostty" } })).status === "error");
  launcher("terminal-browser", "--split");
  // Fail only the mutating command after a successful capability check.
  writeFileSync(join(tmp, "terminal-browser"), `#!${process.execPath}\nif(process.argv.includes('--help')) console.log('--split'); else process.exit(7);\n`, { mode: 0o755 });
  check("failed open after a successful feature check remains an error", /failed \(7\)/.test((await openReview({ url, workspace: "terminal-browser", env: { ...env, TERM_PROGRAM: "ghostty" } })).reason));
  const browser = platform() === "darwin" ? "open" : platform() === "win32" ? "cmd" : "xdg-open";
  launcher(browser, "");
  check("default uses the ordinary platform browser", (await openReview({ url, env })).status === "opened" && calls().at(-1).name === browser && calls().at(-1).args.at(-1) === url);
  launcher(browser, "", 1);
  check("browser launcher nonzero exit is visible", (await openReview({ url, env })).status === "error");
  launcher(browser, "");
  launcher("cmux", "browser open-split URL");
  check("cmux needs the invoking workspace, not the foreground window", (await openReview({ url, workspace: "cmux", env })).status === "unavailable");
  const cm = await openReview({ url, workspace: "cmux", env: { ...env, CMUX_WORKSPACE_ID: "owner-workspace", CMUX_SOCKET_PATH: "/tmp/owner.sock" } });
  check("cmux is explicitly bound to the owner workspace and socket", platform() === "darwin" ? cm.status === "opened" && JSON.stringify(calls().at(-1).args) === JSON.stringify(["--socket", "/tmp/owner.sock", "browser", "open-split", url, "--workspace", "owner-workspace"]) : cm.status === "unavailable");
  console.log(`\n${count} presentation checks passed (launcher contracts only)`);
} finally { rmSync(tmp, { recursive: true, force: true }); }
