#!/usr/bin/env node
// `reelplanning retime-frames` after a revise that renumbers the storyboard. audio_meta.json is keyed
// by `## Frame N`, composition ids are kept stable, and a deleted beat shifts every later frame's
// number while its file keeps its name. The voice line a composition had before is found through the
// old storyboard's `- src:` for that id, not through the number at the front of its file name.
//   - an unchanged frame that moved from 3 to 2 is left byte for byte
//   - an edited frame that moved from 4 to 3 is retimed against its own old line
//   - a new frame (no old counterpart) is skipped
//   - the end-of-timeline marker (beat length less 0.001) goes to the new beat's length, not past it
//   - a helper whose time is not its last argument, `pop(tl, el, at, dy)`, has its time moved and its
//     y-offset left; it is found from its own `at` parameter, and --helpers pop@2 names it outright
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const tmp = mkdtempSync(join(tmpdir(), "rp-retime-")), dir = join(tmp, "video");
mkdirSync(join(dir, "compositions", "frames"), { recursive: true });
const git = (...a) => execFileSync("git", a, { cwd: tmp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const board = (frames) => frames.map(([n, id, len]) => `## Frame ${n} — ${id}\n\n- src: compositions/frames/${id}.html\n- duration: ${len}s\n- voiceover: "line"\n`).join("\n");
// a voice line of four words; `pace` stretches it
const voice = (frame, pace) => ({ frame, duration_s: +(4 * pace).toFixed(3), words: [0, 1, 2, 3].map((i) => ({ word: `w${i}`, start: +(i * pace).toFixed(3), end: +((i + 0.8) * pace).toFixed(3) })) });
// `len` is the beat's length in the storyboard (a hold can make it longer than the line): the marker sits there
const comp = (id, len, def = "const pop = function (tl, el, at, dy) { tl.from(el, { y: dy, opacity: 0, duration: 0.4 }, at); };") => `<div id="${id}"></div>\n<script>\n${def}\nconst tl = gsap.timeline({ paused: true });\ntl.to("#a", { opacity: 1 }, 1.5);\ntl.to("#b", { opacity: 1 }, 2.5);\npop(tl, "#c", 2, 12);\ntl.to({ hold: 0 }, { hold: 1, duration: 0.001 }, ${(len - 0.001).toFixed(3)});\n</script>\n`;
const LEN = { "01-open": 4.4, "02-gone": 4, "03-kept": 5.2, "04-edited": 4.5 };
for (const id of Object.keys(LEN)) writeFileSync(join(dir, "compositions", "frames", `${id}.html`), comp(id, LEN[id]));

// the committed build: four frames, each line at its own pace so a wrong pairing shows
writeFileSync(join(dir, "STORYBOARD.md"), board([[1, "01-open", 4.4], [2, "02-gone", 4], [3, "03-kept", 5.2], [4, "04-edited", 4.5]]));
writeFileSync(join(dir, "audio_meta.json"), JSON.stringify({ voices: [voice(1, 1), voice(2, 0.5), voice(3, 1.2), voice(4, 0.8)] }));
git("init", "-q"); git("-c", "user.email=t@t", "-c", "user.name=t", "add", "-A"); git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "build");

// the revise: frame 2 deleted, 3 and 4 renumbered to 2 and 3, the old frame 4 re-voiced slower, and a new frame 4
rmSync(join(dir, "compositions", "frames", "02-gone.html"));
writeFileSync(join(dir, "compositions", "frames", "05-new.html"), comp("05-new", 4));
// the edited frame's line (3.2 s → 6.4 s) outgrew its 4.5 s hold: the beat is now the line plus a tail
writeFileSync(join(dir, "STORYBOARD.md"), board([[1, "01-open", 4.4], [2, "03-kept", 5.2], [3, "04-edited", 6.8], [4, "05-new", 4]]));
writeFileSync(join(dir, "audio_meta.json"), JSON.stringify({ voices: [voice(1, 1), voice(2, 1.2), voice(3, 1.6), voice(4, 0.9)] }));
const before = Object.fromEntries(["01-open", "03-kept", "04-edited", "05-new"].map((id) => [id, readFileSync(join(dir, "compositions", "frames", `${id}.html`), "utf8")]));

const out = execFileSync("node", [join(ROOT, "scripts", "retime-frames.mjs"), dir], { cwd: tmp, encoding: "utf8" });
const after = (id) => readFileSync(join(dir, "compositions", "frames", `${id}.html`), "utf8");
ok(after("03-kept") === before["03-kept"], "an unchanged frame renumbered from 3 to 2 is left byte for byte (it used to be paired with the deleted frame 2's line)");
ok(after("01-open") === before["01-open"], "a frame whose number did not move is left alone");
const edited = after("04-edited");
ok(/\}, 3\);/.test(edited) && /\}, 5\);/.test(edited), `an edited frame renumbered from 4 to 3 is retimed against its own old line (×2: 1.5 → 3, 2.5 → 5)`);
ok(/duration: 0\.001 \}, 6\.799\);/.test(edited), `its end marker goes to the new beat's length less 0.001 (4.499 → 6.799), not through the words — ${edited.match(/duration: 0\.001 \}, ([\d.]+)/)?.[1]}`);
ok(/pop\(tl, "#c", 4, 12\);/.test(edited), `pop(tl, el, at, dy): its time moves (2 → 4) and its y-offset stays 12, found from its own \`at\` parameter — ${edited.match(/pop\(tl, "#c",[^)]*\)/)?.[0]}`);
ok(after("05-new") === before["05-new"], "a new frame, with no line before, is skipped");
ok(/04-edited\.html \(frame 4 → 3\)/.test(out) && /1 frame\(s\) retimed/.test(out), `the report names the move — ${out.trim().split("\n")[0]}`);

// A helper whose parameters do not say which is the time: without a flag the run stops rather than
// guess (its last argument, 12, is not a time); --helpers pop@2 names its time argument.
const opaque = "const pop = function (tl, el, when, dy) { tl.from(el, { y: dy, opacity: 0, duration: 0.4 }, when); };";
git("checkout", "-q", "--", "."); git("clean", "-qfd");
writeFileSync(join(dir, "compositions", "frames", "04-edited.html"), comp("04-edited", 4.5, opaque));
git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qam", "opaque helper");
writeFileSync(join(dir, "audio_meta.json"), JSON.stringify({ voices: [voice(1, 1), voice(2, 0.5), voice(3, 1.2), voice(4, 1.6)] }));
writeFileSync(join(dir, "STORYBOARD.md"), board([[1, "01-open", 4.4], [2, "02-gone", 4], [3, "03-kept", 5.2], [4, "04-edited", 6.8]]));
let stopped = false; try { execFileSync("node", [join(ROOT, "scripts", "retime-frames.mjs"), dir], { cwd: tmp, encoding: "utf8", stdio: "pipe" }); } catch (e) { stopped = /pop\(… 12\)/.test(String(e.stdout) + String(e.stderr)); }
ok(stopped && /pop\(tl, "#c", 2, 12\);/.test(after("04-edited")), "a helper with no `at` parameter stops the run, and nothing is written");
execFileSync("node", [join(ROOT, "scripts", "retime-frames.mjs"), dir, "--helpers", "pop@2"], { cwd: tmp, encoding: "utf8" });
ok(/pop\(tl, "#c", 4, 12\);/.test(after("04-edited")), `--helpers pop@2 moves its third argument and leaves the last — ${after("04-edited").match(/pop\(tl, "#c",[^)]*\)/)?.[0]}`);

rmSync(tmp, { recursive: true, force: true });
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
process.exit(fails.length ? 1 : 0);
