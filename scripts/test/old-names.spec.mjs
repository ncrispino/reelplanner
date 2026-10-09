#!/usr/bin/env node
// The names from before reelplanning became reelplanner (D-312), still read, against scratch repos and homes:
//   the command      — `reelplanning` runs `reelplanner` with the same arguments and says the new name on stderr;
//                      `reelplanner` says nothing of it; package.json has both, and `reel`
//   a setting        — REELPLANNING_X is read as REELPLANNER_X when that is unset (the new name wins when both are
//                      set): in the shell (scripts/lib/old-names.mjs) and in a .env file (narrator.mjs loadEnvFile);
//                      a line that says where a setting came from names the old one, "(its old name)": describe's,
//                      setup's about the local voice, narration-check's about a key
//   ~/.reelplanning  — the machine's folder (its .env, your memory) while there is no ~/.reelplanner, and the folder a
//                      line tells you to put a key in; once there is one, that one, and a file the old one holds and
//                      the new one lacks is said once, with the `mv` that moves it
//   .reelplanning/   — a repo's project folder under its old name is found: `reel status` reads it and says once that
//                      `git mv .reelplanning .reelplanner` renames it, and `reel init` finds it set up (no second
//                      folder); once renamed, a command handed a plan's old path (a line a page wrote before the
//                      rename) finds the plan where it moved; `reel renumber` reads a base's log at the old name, on a
//                      branch that renamed it
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, renameSync, existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, VERSION, otherRpPath } from "../lib/env.mjs";
import { adoptOldSettings, newName } from "../lib/old-names.mjs";

const tmp = realpathSync(mkdtempSync(join(tmpdir(), "rp-old-names-")));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
// an environment with no setting of ours in it, under either name: each check adds its own
const bare = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^REELPLANN(ER|ING)_/.test(k)));
const node = (args, env = {}, cwd = tmp) => { const r = spawnSync(process.execPath, args, { cwd, encoding: "utf8", env: { ...bare, ...env } }); return { code: r.status, out: r.stdout, err: r.stderr }; };
// what a module of ours answers, in a fresh process: `code` is the body of an async function given the modules
const ask = (code, env = {}, cwd = tmp) => node(["--input-type=module", "-e", `
  const env = await import(${JSON.stringify(join(ROOT, "scripts/lib/env.mjs"))});
  const narrator = await import(${JSON.stringify(join(ROOT, "scripts/lib/narrator.mjs"))});
  const memory = await import(${JSON.stringify(join(ROOT, "scripts/lib/memory.mjs"))});
  console.log(JSON.stringify(await (async () => { ${code} })()));`], env, cwd);
const answer = (r) => { try { return JSON.parse(r.out.trim().split("\n").at(-1)); } catch { return null; } };
const git = (repo, ...a) => execFileSync("git", ["-C", repo, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

try {
  // ── the command ──
  const old = node([join(ROOT, "bin/reelplanning.mjs"), "--version"]), now = node([join(ROOT, "bin/reelplanner.mjs"), "--version"]);
  ok("`reelplanning --version` runs reelplanner's, and says on stderr that the command is now reelplanner", old.code === 0 && old.out.trim() === VERSION && /the command is now `reelplanner`; `reelplanning` still works/.test(old.err), JSON.stringify(old));
  ok("…`reelplanner --version` says nothing of the old name", now.code === 0 && now.out.trim() === VERSION && !/reelplanning/.test(now.err), JSON.stringify(now));
  const bin = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).bin;
  ok("package.json's commands: reelplanner, reel, and reelplanning (the old name)", bin.reelplanner === "bin/reelplanner.mjs" && bin.reel === "bin/reel.mjs" && bin.reelplanning === "bin/reelplanning.mjs", JSON.stringify(bin));

  // ── a setting ──
  const e = { REELPLANNING_TTS: "openrouter", REELPLANNING_HOME: "/old", REELPLANNER_HOME: "/new", OTHER: "x" };
  const copied = adoptOldSettings(e);
  ok("REELPLANNING_TTS is read as REELPLANNER_TTS; where the new name is set, it wins", e.REELPLANNER_TTS === "openrouter" && e.REELPLANNER_HOME === "/new" && copied.join() === "REELPLANNING_TTS" && newName("OTHER") === "OTHER", JSON.stringify(e));
  const repo1 = join(tmp, "repo1"); mkdirSync(join(repo1, ".git"), { recursive: true });
  const shell = answer(ask(`return narrator.narrationSettings(${JSON.stringify(repo1)}).tts;`, { REELPLANNING_TTS: "openrouter", REELPLANNER_HOME: join(tmp, "nohome") }));
  ok("…in the shell: a command started with REELPLANNING_TTS=openrouter narrates with openrouter", shell === "openrouter", shell);
  mkdirSync(join(repo1, ".reelplanner"), { recursive: true });
  writeFileSync(join(repo1, ".reelplanner", ".env"), "REELPLANNING_TTS=openrouter\n");
  const file = answer(ask(`narrator.loadEnvFile(${JSON.stringify(repo1)}); return { tts: process.env.REELPLANNER_TTS, from: narrator.envSource("REELPLANNER_TTS"), s: narrator.narrationSettings(${JSON.stringify(repo1)}).tts };`, { REELPLANNER_HOME: join(tmp, "nohome") }, repo1));
  ok("…in a .env file: the repo's .reelplanner/.env saying REELPLANNING_TTS sets REELPLANNER_TTS, and says where from", file?.tts === "openrouter" && file?.s === "openrouter" && file?.from === ".reelplanner/.env", JSON.stringify(file));
  const both = answer(ask(`narrator.loadEnvFile(${JSON.stringify(repo1)}); return process.env.REELPLANNER_TTS;`, { REELPLANNER_TTS: "kokoro", REELPLANNER_HOME: join(tmp, "nohome") }, repo1));
  ok("…and the shell's REELPLANNER_TTS still wins over a file's old name", both === "kokoro", both);
  // a line that says where a setting came from names what the person set: its old name, said to be one
  const describe = (env) => node([join(ROOT, "scripts/lib/narrator.mjs"), "describe", repo1], { REELPLANNER_HOME: join(tmp, "nohome"), ...env }, repo1);
  const dFile = describe();
  rmSync(join(repo1, ".reelplanner", ".env"));
  const dShell = describe({ REELPLANNING_TTS: "openrouter" }), dNew = describe({ REELPLANNER_TTS: "openrouter" }), dBoth = describe({ REELPLANNER_TTS: "openrouter", REELPLANNING_TTS: "kokoro" });
  ok("…and where it came from is said under the name it was set under: `narrator.mjs describe` says \"from REELPLANNING_TTS (its old name)\", for the shell's",
    /\(from REELPLANNING_TTS \(its old name\)\)$/m.test(dShell.out) && !/REELPLANNER_TTS/.test(dShell.out), dShell.out);
  ok("…\"from REELPLANNING_TTS (its old name) in .reelplanner/.env\", for a file's", /\(from REELPLANNING_TTS \(its old name\) in \.reelplanner\/\.env\)$/m.test(dFile.out) && !/REELPLANNER_TTS/.test(dFile.out), dFile.out);
  ok("…and the new name as it is, alone or over an old one", /\(from REELPLANNER_TTS\)$/m.test(dNew.out) && /\(from REELPLANNER_TTS\)$/m.test(dBoth.out) && !/old name/.test(dNew.out + dBoth.out), dNew.out + dBoth.out);
  const plan = node([join(ROOT, "scripts/lib/local-speed.mjs"), "--plan", repo1], { REELPLANNER_HOME: join(tmp, "nohome"), REELPLANNING_TTS: "openrouter" }, repo1);
  ok("…setup's line about the local voice: \"from the shell's REELPLANNING_TTS (its old name)\"", plan.out.includes("narration is hosted (openrouter, from the shell's REELPLANNING_TTS (its old name));"), plan.out);
  // narration-check's engine line names a key's variable and where it came from (a server that is not there: nothing is sent)
  writeFileSync(join(repo1, ".reelplanner", "config.json"), JSON.stringify({ narration: { tts: "openai-compatible", base_url: "http://127.0.0.1:9/v1", model: "m", voice: "v", timings: "local", retries: 0 } }));
  const nc = node([join(ROOT, "scripts/narration-check.mjs")], { REELPLANNER_HOME: join(tmp, "nohome"), REELPLANNING_TTS_API_KEY: "sk-old" }, repo1);
  writeFileSync(join(repo1, ".reelplanner", ".env"), "REELPLANNING_TTS_API_KEY=sk-old\n");
  const ncFile = node([join(ROOT, "scripts/narration-check.mjs")], { REELPLANNER_HOME: join(tmp, "nohome") }, repo1);
  rmSync(join(repo1, ".reelplanner", ".env")); rmSync(join(repo1, ".reelplanner", "config.json"));
  ok("…narration-check's engine line: \"key REELPLANNER_TTS_API_KEY from the shell's REELPLANNING_TTS_API_KEY (its old name)\", and from a file's",
    /^engine: openai-compatible m at 127\.0\.0\.1:9 \(key REELPLANNER_TTS_API_KEY from the shell's REELPLANNING_TTS_API_KEY \(its old name\)\),/m.test(nc.out)
      && /^engine: .*\(key REELPLANNER_TTS_API_KEY from \.reelplanner\/\.env's REELPLANNING_TTS_API_KEY \(its old name\)\),/m.test(ncFile.out) && !/sk-old/.test(nc.out + ncFile.out), nc.out + nc.err + ncFile.out + ncFile.err);

  // ── ~/.reelplanning ──
  const home = join(tmp, "home"); mkdirSync(join(home, ".reelplanning"), { recursive: true });
  writeFileSync(join(home, ".reelplanning", ".env"), "REELPLANNER_TTS=openrouter\n");
  const away = join(tmp, "elsewhere"); mkdirSync(away);
  const m1 = answer(ask(`narrator.loadEnvFile(${JSON.stringify(away)}); return { dir: env.machineDir(), mem: memory.homeDir(), envPath: narrator.homeEnvPath(), tts: process.env.REELPLANNER_TTS, from: narrator.envSource("REELPLANNER_TTS") };`, { HOME: home }, away));
  ok("with no ~/.reelplanner, ~/.reelplanning is the machine's folder: its .env is read, your memory is there", m1?.dir === join(home, ".reelplanning") && m1?.mem === m1?.dir && m1?.envPath === join(home, ".reelplanning", ".env") && m1?.tts === "openrouter" && m1?.from === "~/.reelplanning/.env", JSON.stringify(m1));
  // a line that says where a key goes names the folder that is read, so following it does not start a second one
  const hint1 = answer(ask(`return narrator.keyPlaces();`, { HOME: home }, away)), sh1 = node([join(ROOT, "scripts/lib/env.mjs"), "home"], { HOME: home }, away);
  ok("…and a line saying where a key goes names ~/.reelplanning/.env (narrator's, and setup's)", /put it in ~\/\.reelplanning\/\.env /.test(hint1) && sh1.out.trim() === "~/.reelplanning", JSON.stringify({ hint1, sh1 }));
  mkdirSync(join(home, ".reelplanner"));
  const m2r = ask(`return { dir: env.machineDir(), mem: memory.homeDir(), hint: narrator.keyPlaces() };`, { HOME: home }, away), m2 = answer(m2r);
  ok("…once there is a ~/.reelplanner, that one, and the lines name it", m2?.dir === join(home, ".reelplanner") && m2?.mem === m2?.dir && /put it in ~\/\.reelplanner\/\.env /.test(m2?.hint), JSON.stringify(m2));
  const notes = m2r.err.split("\n").filter((l) => l.includes("machine folder's old name"));
  ok("…and the old one's .env, which the new one lacks, is said once, with the mv that moves it", notes.length === 1 && notes[0].includes("`mv ~/.reelplanning/.env ~/.reelplanner/`"), m2r.err);
  writeFileSync(join(home, ".reelplanner", ".env"), "");
  const m2b = ask(`return env.machineDir();`, { HOME: home }, away);
  ok("…and nothing once the new one has its own", answer(m2b) === join(home, ".reelplanner") && !/old name/.test(m2b.err), m2b.err);
  const m3 = answer(ask(`return env.machineDir();`, { HOME: home, REELPLANNING_HOME: join(tmp, "set") }, away));
  ok("…and REELPLANNING_HOME, the old name of REELPLANNER_HOME, still moves it", m3 === join(tmp, "set"), m3);

  // ── .reelplanning/ in a repo ──
  const repo = join(tmp, "legacy"); mkdirSync(repo);
  git(repo, "init", "-q", "-b", "main");
  const init = node([join(ROOT, "scripts/reel.mjs"), "init", repo, "--name", "legacy", "--kind", "greenfield", "--agent", "none"], { REELPLANNER_HOME: join(tmp, "rp-home") });
  ok("reel init makes .reelplanner/", init.code === 0 && existsSync(join(repo, ".reelplanner", "decisions.json")) && !existsSync(join(repo, ".reelplanning")), init.out + init.err);
  renameSync(join(repo, ".reelplanner"), join(repo, ".reelplanning"));
  git(repo, "add", "-A"); git(repo, "commit", "-q", "-m", "a repo set up before the rename");
  const st = node([join(ROOT, "scripts/reel.mjs"), "status", repo], { REELPLANNER_HOME: join(tmp, "rp-home") }, repo);
  const said = (st.err.match(/the project folder's old name/g) || []).length;
  ok("a repo whose record is .reelplanning/: `reel status` reads it, and says once that `git mv .reelplanning .reelplanner` renames it", st.code === 0 && said === 1 && /\.reelplanning: the project folder's old name; it is still read, and `git mv \.reelplanning \.reelplanner` in /.test(st.err) && !/no \.reelplanner\//.test(st.out + st.err), JSON.stringify(st));
  const again = node([join(ROOT, "scripts/reel.mjs"), "init", repo, "--agent", "none"], { REELPLANNER_HOME: join(tmp, "rp-home") });
  ok("…`reel init` there finds it set up, and makes no second folder", again.code !== 0 && /exists already/.test(again.err) && !existsSync(join(repo, ".reelplanner")), JSON.stringify(again));
  writeFileSync(join(tmp, "plan.md"), "# Rename the flag\n\n## Context\n\nThe flag is called --out.\n\n## Steps\n\n### Step 1 — Rename it\n\nCall it --to.\n");
  const np = node([join(ROOT, "scripts/reel.mjs"), "new-plan", repo, "rename-flag", "--plan", join(tmp, "plan.md")], { REELPLANNER_HOME: join(tmp, "rp-home") }, repo);
  const planDir = (np.out.match(/✓ (\S+)/) || [])[1] || "";
  ok("…`reel new-plan` puts the plan in .reelplanning/plans/", np.code === 0 && planDir.includes("/.reelplanning/plans/") && existsSync(join(planDir, "plan.md")), JSON.stringify(np));
  git(repo, "add", "-A"); git(repo, "commit", "-q", "-m", "a plan");
  git(repo, "mv", ".reelplanning", ".reelplanner"); git(repo, "commit", "-q", "-m", "the record's new name");
  const st2 = node([join(ROOT, "scripts/reel.mjs"), "status", repo], { REELPLANNER_HOME: join(tmp, "rp-home") }, repo);
  ok("…after `git mv .reelplanning .reelplanner`, `reel status` says nothing of the old name", st2.code === 0 && !/old name/.test(st2.err), JSON.stringify(st2));
  const chk = node([join(ROOT, "scripts/reel.mjs"), "check", planDir], { REELPLANNER_HOME: join(tmp, "rp-home") }, repo);
  ok("…and a command handed the plan's old path (a line written before the rename) finds it where it moved", !/no \.reelplanner\/|not set up|ENOENT|no such file/i.test(chk.out + chk.err) && /rename-flag: 1 steps/.test(chk.out + chk.err), JSON.stringify(chk));   // (it reads the plan: its own failures are the plan's)

  // ── reel renumber across the rename ──
  const entry = (id, chosen) => ({ id, date: "2026-10-08", plan: "p", step: 1, questionId: `q-${id}`, question: `Q ${id}`, chosen, options: [], status: "active" });
  const rn = join(tmp, "renamed"); mkdirSync(join(rn, ".reelplanning"), { recursive: true });
  git(rn, "init", "-q", "-b", "main");
  writeFileSync(join(rn, ".reelplanning", "decisions.json"), JSON.stringify({ decisions: [entry("D-001", "one")] }, null, 2));
  git(rn, "add", "-A"); git(rn, "commit", "-q", "-m", "base");
  const base = git(rn, "rev-parse", "HEAD");
  git(rn, "mv", ".reelplanning", ".reelplanner");
  writeFileSync(join(rn, ".reelplanner", "decisions.json"), JSON.stringify({ decisions: [entry("D-001", "one"), entry("D-007", "the branch's own")] }, null, 2));
  git(rn, "commit", "-q", "-am", "rename, and an entry");
  const r = node([join(ROOT, "scripts/renumber.mjs"), rn, "--base", base, "--dry-run"], { REELPLANNER_HOME: join(tmp, "rp-home") }, rn);
  ok("`reel renumber` on a branch that renamed the folder reads the base's log at its old name", r.code === 0 && /would take .*'s log \(1 entries, the last D-001\)/.test(r.out) && /D-007 → D-002/.test(r.out), JSON.stringify(r));

  // ── a path in the record under its other name, for a lookup in the history ──
  ok("otherRpPath: .reelplanner/x ↔ .reelplanning/x, inside a path too; a path outside the record is null",
    otherRpPath(".reelplanner/decisions.json") === ".reelplanning/decisions.json" && otherRpPath("a/.reelplanning/plans/x") === "a/.reelplanner/plans/x" && otherRpPath("scripts/x.mjs") === null && otherRpPath(".reelplanners/x") === null);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
if (failed) { console.error(`\n${failed} failed`); process.exit(1); }
