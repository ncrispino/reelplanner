// Subprocess contract checks only. Fake launchers never prove graphics/audio/UI.
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, platform } from "node:os";
import { openReview } from "../lib/presentation.mjs";
import { codexWindows, pickWindow, focusedWindow, parseEnvironment, withWindowTerminal } from "../lib/codex-window.mjs";
import { openedPane, paneOf, shownBrowser, closeCommands } from "../lib/review-pane.mjs";

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
  writeFileSync(join(tmp, "terminal-browser"), `#!${process.execPath}\nif(process.argv.includes('--help')) console.log('--split'); else { console.error('starting\\ncould not work out which ghostty pane you are in'); process.exit(1); }\n`, { mode: 0o755 });
  check("terminal-browser's own last error line says why it could not open", /failed \(1\): could not work out which ghostty pane you are in$/.test((await openReview({ url, workspace: "terminal-browser", env })).reason));

  // Codex 0.164 runs commands in a background server on no terminal: the split goes beside the Codex window.
  const listing = [
    "  101 ??       /home/u/.codex/packages/app-server-daemon/releases/0.164.0/bin/codex app-server --listen unix:// --managed-daemon",
    "  200 ttys013  node /opt/homebrew/bin/codex -m gpt-6.1-sol",
    "  201 ttys013  /opt/homebrew/lib/node_modules/@openai/codex/vendor/bin/codex -m gpt-6.1-sol",
    "  300 pts/4    /usr/local/bin/codex resume 01a1",
    "  400 ttys020  /usr/local/bin/codex exec do-it",
    "  500 ttys021  /usr/bin/less codex",
  ].join("\n");
  const found = codexWindows(listing);
  check("Codex windows: one per terminal (npm's launcher and its program share one), never the background server, exec, or a program merely named after it",
    JSON.stringify(found) === JSON.stringify([{ tty: "/dev/ttys013", pids: [200, 201] }, { tty: "/dev/pts/4", pids: [300] }]));
  const w = (tty, cwd) => ({ tty, cwd });
  check("the window picked is the one whose folder holds the command's most closely",
    pickWindow([w("/dev/a", "/home/u"), w("/dev/b", "/home/u/repo"), w("/dev/c", "/home/u/repo-two")], "/home/u/repo/sub").window?.tty === "/dev/b");
  check("two windows in that folder, or none, pick nothing and say why",
    /2 Codex windows are open in \/home\/u\/repo/.test(pickWindow([w("/dev/a", "/home/u/repo"), w("/dev/b", "/home/u/repo")], "/home/u/repo").reason)
    && /no Codex window is open in \/srv/.test(pickWindow([w("/dev/a", "/home/u")], "/srv").reason));
  // four Codex windows in one repo, tmux in Ghostty on macOS: the opener gave up, and the agent tried to find the pane
  // with computer use instead
  const inTmux = (tty, pane, socket = "/tmp/tmux-1/default") => ({ tty, cwd: "/home/u/repo", env: { TMUX: `${socket},9,0`, TMUX_PANE: pane } });
  const tied = pickWindow([inTmux("/dev/a", "%1"), inTmux("/dev/b", "%2"), inTmux("/dev/c", "%3", "/tmp/tmux-1/other")], "/home/u/repo").tied;
  // what each tmux server's clients show ([pane, its window]); %1 and %2 are in @1, %3 in @2, %9 (a shell) in @1
  const windowOf = { "%1": "@1", "%2": "@1", "%3": "@2", "%9": "@1", "%8": "@3" };
  const showing = (bySocket) => (socket) => ({ panes: bySocket[socket] || [], windows: (bySocket[socket] || []).map((p) => windowOf[p]), windowOf });
  check("of windows tied in one folder, the one in the tmux pane a client is showing is picked, asked of its own tmux server",
    tied?.length === 3 && focusedWindow(tied, showing({ "/tmp/tmux-1/default": ["%2", "%8"] }))?.window.tty === "/dev/b"
    && focusedWindow(tied, showing({ "/tmp/tmux-1/other": ["%3"] }))?.window.tty === "/dev/c"
    && focusedWindow(tied, showing({ "/tmp/tmux-1/other": ["%2"] })) === null);
  check("…else the one in the tmux window a client is showing (a shell, or the last review, beside it), if only one is",
    focusedWindow([inTmux("/dev/a", "%1"), inTmux("/dev/c", "%3")], showing({ "/tmp/tmux-1/default": ["%9"] }))?.window.tty === "/dev/a"
    && focusedWindow(tied, showing({ "/tmp/tmux-1/default": ["%9"] })) === null);
  check("…and none when no client shows one, when two clients show two of them, or outside tmux",
    focusedWindow(tied, showing({ "/tmp/tmux-1/default": ["%8"] })) === null
    && focusedWindow(tied, showing({ "/tmp/tmux-1/default": ["%1", "%2"] })) === null
    && focusedWindow([{ tty: "/dev/a", env: { TERM_PROGRAM: "ghostty" } }, { tty: "/dev/b", env: null }], showing({})) === null);
  check("a window's environment read from ps keeps a value's spaces",
    JSON.stringify(parseEnvironment(" TERM=xterm-ghostty TERM_PROGRAM=ghostty NAME=two words TMUX_PANE=%3")) === JSON.stringify({ TERM: "xterm-ghostty", TERM_PROGRAM: "ghostty", NAME: "two words", TMUX_PANE: "%3" }));
  const swapped = withWindowTerminal({ PATH: "/bin", TERM_PROGRAM: "ghostty", TMUX: "/tmp/tmux-1/default,9,0", TMUX_PANE: "%0", CODEX_THREAD_ID: "t" }, { TERM_PROGRAM: "tmux", TMUX: "/tmp/tmux-1/default,9,0", TMUX_PANE: "%7", HOME: "/elsewhere" });
  check("the window's terminal settings replace the server's, and nothing else of the window's comes along",
    JSON.stringify(swapped) === JSON.stringify({ PATH: "/bin", CODEX_THREAD_ID: "t", TERM_PROGRAM: "tmux", TMUX: "/tmp/tmux-1/default,9,0", TMUX_PANE: "%7" }));

  // On no terminal: a stand-in ps says so; the window's "terminal" is a file here, read as terminal-browser's input.
  writeFileSync(join(tmp, "ps"), `#!/bin/sh\necho "1 ??"\n`, { mode: 0o755 });
  const terminal = join(tmp, "window-terminal");
  writeFileSync(terminal, "");
  writeFileSync(join(tmp, "terminal-browser"), `#!${process.execPath}\nimport {appendFileSync, fstatSync} from 'node:fs';\nif(process.argv.includes('--help')) { console.log('--split'); process.exit(0); }\nappendFileSync(process.env.RP_PRESENTATION_LOG, JSON.stringify({name:'terminal-browser', args:process.argv.slice(2), input:fstatSync(0).ino, TERM_PROGRAM:process.env.TERM_PROGRAM, TMUX:process.env.TMUX ?? null})+'\\n');\n`, { mode: 0o755 });
  const codex = { ...env, CODEX_THREAD_ID: "t", TERM_PROGRAM: "from-the-server", TMUX: "/tmp/tmux-1/default,9,0" };
  const beside = await openReview({ url, workspace: "terminal-browser", env: codex, codexWindow: () => ({ window: { tty: terminal, env: { TERM_PROGRAM: "ghostty" } } }) });
  const call = calls().at(-1);
  check("run by Codex on no terminal, terminal-browser runs on the Codex window's terminal, with its settings, and says so",
    beside.status === "opened" && beside.beside === terminal && JSON.stringify(call.args) === JSON.stringify(["open", "--split", "right", url])
    && call.input === statSync(terminal).ino && call.TERM_PROGRAM === "ghostty" && call.TMUX === null);
  const before2 = calls().length;
  const none = await openReview({ url, workspace: "terminal-browser", env: codex, codexWindow: () => ({ reason: "no Codex window is open in /srv or a folder above it" }) });
  check("with no single Codex window to split beside, nothing opens and the reason says to open the review yourself",
    none.status === "unavailable" && /no Codex window is open in \/srv.*open the review yourself/.test(none.reason) && calls().length === before2);
  const own = await openReview({ url, workspace: "terminal-browser", env: { ...codex, CODEX_THREAD_ID: undefined }, codexWindow: () => { throw new Error("looked for a window"); } });
  check("outside Codex nothing looks for a window", own.status === "opened" && calls().at(-1).input !== statSync(terminal).ino);
  rmSync(join(tmp, "ps"));
  launcher("terminal-browser", "--split");

  // The split an open made, for the review server to close after Send (scripts/lib/review-pane.mjs)
  writeFileSync(join(tmp, "terminal-browser"), `#!${process.execPath}\nif(process.argv.includes('--help')) console.log('--split'); else console.log(JSON.stringify({key:'98170-1',tty:'/dev/ttys010',pid:98170,splitDir:'right'},null,2));\n`, { mode: 0o755 });
  const opened = await openReview({ url, workspace: "terminal-browser", env });
  check("an open reports the split terminal-browser made: its key and terminal only", JSON.stringify(opened.pane) === JSON.stringify({ key: "98170-1", tty: "/dev/ttys010" }));
  check("output that names no split, or a terminal that is not one, reports none",
    openedPane("opened") === null && openedPane(JSON.stringify({ key: "1-1", tty: "/etc/passwd" })) === null && openedPane(JSON.stringify({ key: "a b", tty: "/dev/ttys010" })) === null);
  check("a posted pane keeps its key, terminal and project, and refuses anything else",
    JSON.stringify(paneOf({ key: "1-1", tty: "/dev/pts/3", project: "p", extra: 1 })) === JSON.stringify({ key: "1-1", tty: "/dev/pts/3", project: "p" }) && paneOf({ key: "1-1", tty: "/dev/ttys1/../x" }) === null);
  const shown = JSON.stringify({ browsers: [{ key: "1-1", tty: "/dev/ttys010", tabs: [{ url: "http://127.0.0.1:8788/?project=p" }] }, { key: "1-2", tty: "/dev/ttys011", tabs: [{ url: "https://example.com/" }] }] });
  const shows = (pane, base) => shownBrowser(shown, pane, base)?.key ?? null;
  check("a split is closed only while terminal-browser still shows it, on its terminal, with this server's page",
    shows({ key: "1-1", tty: "/dev/ttys010" }, "http://127.0.0.1:8788/") === "1-1" && shows({ key: "1-1", tty: "/dev/ttys011" }, "http://127.0.0.1:8788/") === null
    && shows({ key: "1-2", tty: "/dev/ttys011" }, "http://127.0.0.1:8788/") === null && shows({ key: "1-1", tty: "/dev/ttys010" }, "http://127.0.0.1:8789/") === null && shownBrowser("not json", { key: "1-1", tty: "/dev/ttys010" }, "http://127.0.0.1:8788/") === null);
  const ghostty = closeCommands({ terminal: "ghostty", pane: "33FFFDDC-E247-444F-8A78-1497D3D61C36" }), tmux = closeCommands({ terminal: "tmux", pane: "%7" });
  check("it closes as you would: Ctrl+Q typed into that split (Ghostty's text action types, input text would paste), then its terminal closes the emptied split",
    ghostty.quit.at(-1) === 'tell application "Ghostty" to perform action "text:\\\\x11" on terminal id "33FFFDDC-E247-444F-8A78-1497D3D61C36"'
    && ghostty.close.at(-1) === 'tell application "Ghostty" to close terminal id "33FFFDDC-E247-444F-8A78-1497D3D61C36"'
    && JSON.stringify(tmux) === JSON.stringify({ quit: ["tmux", "send-keys", "-t", "%7", "C-q"], close: ["tmux", "kill-pane", "-t", "%7"] }));
  check("a terminal it cannot drive, or a split id that is not one, closes nothing",
    closeCommands({ terminal: "kitty", pane: "3" }) === null && closeCommands({ terminal: "ghostty", pane: 'x" to quit' }) === null && closeCommands({ terminal: "tmux", pane: "%7; kill-server" }) === null && closeCommands(null) === null);
  launcher("terminal-browser", "--split");
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
