#!/usr/bin/env node
// Setting a repo up (`reel init`) and its shared stage (`reel stage`), against scratch repos:
//   reel init --agent   — the headless command config.json gets: Claude Code's sandboxed auto mode (the template's),
//                         Codex's `codex exec` in its workspace-write sandbox, or none; an unknown agent is refused
//   reel init (no flag) — picks the agent it runs inside (CLAUDECODE, CODEX_THREAD_ID), else the first of `claude`
//                         and `codex` on PATH, else none, and prints what it picked and why
//   reel init over setup files only — a .reelplanning/ with no decisions.json (.env, config.json, .gitignore, made for
//                         the hosted voice before any plan) is set up over: .env kept, config.json merged (its keys
//                         win; its agent unless --agent names one), .gitignore the template's plus its own lines; a
//                         set-up folder is still refused; `reel status` there says "not set up yet" (and SKILL.md
//                         decides the level by decisions.json too)
//   reel stage          — a component placed outside the 1920×1080 frame, or with a missing number, stops it by name;
//                         a component with no placement is left off the stage, as before
//   --help              — `reel --help`, `reel <command> --help` and `reelplanning <script> --help` print the usage and
//                         run nothing (`reel init --help` once made a folder named --help)
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, RP_INSTALL } from "../lib/env.mjs";
import { detectAgent, CODEX_COMMAND } from "../lib/agents.mjs";
import { splitCommand } from "../lib/notify.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-init-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

// a PATH of fake agents, and an environment with no agent's own variables in it
const bin = (dir, ...names) => { mkdirSync(dir, { recursive: true }); for (const n of names) { writeFileSync(join(dir, n), "#!/bin/sh\nexit 0\n"); chmodSync(join(dir, n), 0o755); } return dir; };
const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(CLAUDE|CODEX)/.test(k)));
const empty = bin(join(tmp, "path-empty")), both = bin(join(tmp, "path-both"), "claude", "codex"), onlyCodex = bin(join(tmp, "path-codex"), "codex");
const init = (name, args, env = {}) => {
  const repo = join(tmp, name); mkdirSync(repo, { recursive: true });
  const r = spawnSync(process.execPath, [join(ROOT, "scripts/reel.mjs"), "init", repo, "--name", name, "--kind", "greenfield", ...args],
    { encoding: "utf8", env: { ...clean, PATH: empty, ...env } });
  let config = null; try { config = JSON.parse(readFileSync(join(repo, ".reelplanning/config.json"), "utf8")); } catch { /* none written */ }
  return { code: r.status, out: `${r.stdout}${r.stderr}`, config, repo };
};
const template = JSON.parse(readFileSync(join(ROOT, "templates/reelplanning/config.json"), "utf8"));

try {
  // --agent, named
  const claude = init("claude", ["--agent", "claude"]);
  ok("init --agent claude: config.json is the template's, D-082's sandboxed auto mode", claude.code === 0 && JSON.stringify(claude.config) === JSON.stringify(template), claude.out);
  ok("init --agent claude: says which agent and why", /✓ agent: claude \(--agent\)/.test(claude.out), claude.out);
  // a plain repo, nothing copied by hand (D-305): the voice, guides and renders a build makes are never staged
  {
    spawnSync("git", ["init", "-q", claude.repo]);
    const made = [".reelplanning/plans/2026-10-04-x/video/assets/voice/01.wav", ".reelplanning/plans/2026-10-04-x/walkthrough-video/assets/voice/01.wav",
      ".reelplanning/plans/2026-10-04-x/video/guide/index.html", ".reelplanning/plans/2026-10-04-x/guide/index.html", ".reelplanning/system-video/assets/voice/01.wav",
      ".reelplanning/system-video/renders/video.mp4", ".reelplanning/plans/2026-10-04-x/video/renders/video.mp4",
      ".reelplanning/plans/2026-10-04-x/demo.mp4", ".reelplanning/explainers/y/take-1.wav"];
    const kept = [".reelplanning/plans/2026-10-04-x/plan.md", ".reelplanning/plans/2026-10-04-x/video/SCRIPT.md", ".reelplanning/plans/2026-10-04-x/guide/step-1.html"];
    for (const f of [...made, ...kept]) { mkdirSync(join(claude.repo, f, ".."), { recursive: true }); writeFileSync(join(claude.repo, f), "x"); }
    const r = spawnSync("git", ["-C", claude.repo, "check-ignore", "--no-index", ...made, ...kept], { encoding: "utf8" });
    const ignored = r.stdout.split("\n").filter(Boolean);
    ok("init: .reelplanning/.gitignore leaves out every video's voice, renders and guide, and keeps the text (D-305)",
      made.every((f) => ignored.includes(f)) && !kept.some((f) => ignored.includes(f)), r.stdout + r.stderr);
  }

  const codex = init("codex", ["--agent", "codex"]);
  const argv = splitCommand(codex.config?.agent?.command);
  ok("init --agent codex: `codex exec` in the workspace-write sandbox, network on, nothing after it but the prompt",
    codex.code === 0 && argv.slice(0, 2).join(" ") === "codex exec" && argv[argv.indexOf("-s") + 1] === "workspace-write"
      && argv[argv.indexOf("-c") + 1] === "sandbox_workspace_write.network_access=true" && codex.config.agent.command === CODEX_COMMAND, codex.out);
  ok("init --agent codex: no flag codex-cli 0.160.0 rejects (-a, --full-auto) and no Claude-only flag", !argv.some((a) => ["-a", "--full-auto", "--approve-for-me", "-p", "--settings"].includes(a)), argv.join(" "));
  ok("init --agent codex: the note says what is not tried yet (the commit) and how to run with the network off",
    /read-only/.test(codex.config.agent["//"]) && codex.config.agent["//"].includes(`(\`${RP_INSTALL}\`)`) && !/npx -y reelplanning/.test(codex.config.agent["//"]), codex.config?.agent?.["//"]);
  ok("init --agent codex: the rest of config.json is the template's", JSON.stringify(codex.config.maintainers) === JSON.stringify(template.maintainers) && codex.config["//maintainers"] === template["//maintainers"]);

  const none = init("none", ["--agent", "none"]);
  ok("init --agent none: no command, so reviews wait in the inbox", none.code === 0 && none.config.agent.command === "" && /inbox/.test(none.out), none.out);

  const bad = init("bad", ["--agent", "cursor"]);
  ok("init --agent cursor: refused, naming the agents it knows, and nothing written", bad.code === 1 && /one of claude, codex, none/.test(bad.out) && bad.config === null, bad.out);

  // ── a .reelplanning/ of setup files only (made for the hosted voice before any plan: .env, config.json): not set
  //    up, so `reel status` says so; `reel init` sets it up over them, keeping .env and merging config.json ──
  {
    const repo = join(tmp, "setup-only"), rp = join(repo, ".reelplanning");
    mkdirSync(rp, { recursive: true });
    const KEYLINE = "OPENROUTER_API_KEY=sk-or-kept-as-it-was\n";
    writeFileSync(join(rp, ".env"), KEYLINE);
    writeFileSync(join(rp, "config.json"), JSON.stringify({ narration: { tts: "openrouter" }, pr: { issue: "required" } }));
    writeFileSync(join(rp, ".gitignore"), ".env\nmy-notes/\n");
    const reelIn = (...a) => { const r = spawnSync(process.execPath, [join(ROOT, "scripts/reel.mjs"), ...a], { cwd: repo, encoding: "utf8", env: { ...clean, PATH: empty } }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
    const st = reelIn("status", repo);
    ok("reel status over setup files only: not set up yet, the first plan runs reel init (no crash on decisions.json)",
      st.code === 0 && /not set up yet \(no decisions\.json, only setup files\): the first plan runs `reel init /.test(st.out) && !/ENOENT|at file:/.test(st.out), st.out);
    const np = reelIn("new-plan", repo, "x", "--plan", join(tmp, "nothing.md"));
    ok("…and a command that needs the record says the same, and writes nothing", np.code === 1 && /not set up yet/.test(np.out) && !readdirSync(rp).includes("plans"), np.out);
    const si = init("setup-only", []);
    const after = (f) => { try { return readFileSync(join(rp, f), "utf8"); } catch { return null; } };
    ok("reel init over setup files only: it proceeds, and says what it kept", si.code === 0 && /✓ set up over the setup files already there \(no decision log yet\): kept \.env/.test(si.out) && /merged your config\.json into the template's \(yours kept: narration, pr\)/.test(si.out), si.out);
    ok("….env kept byte for byte", after(".env") === KEYLINE, after(".env"));
    ok("…config.json: the template's, with your keys winning (narration added, pr.issue yours, the agent the detected one: none here)",
      si.config?.narration?.tts === "openrouter" && si.config.pr.issue === "required" && si.config.maintainers && si.config.agent?.command === "" && si.config["//narration"] === template["//narration"], JSON.stringify(si.config));
    ok("….gitignore: the template's (its .env line too), with your own line kept", after(".gitignore")?.startsWith(readFileSync(join(ROOT, "templates/reelplanning/gitignore"), "utf8")) && after(".gitignore").split("\n").includes("my-notes/") && after(".gitignore").split("\n").includes(".env"), after(".gitignore"));
    ok("…and the decision log is there now", !!after("decisions.json") && !!after("spec.md") && !!after("theme/frame.md"));
    const again = init("setup-only", []);
    ok("reel init over a set-up folder (decisions.json): refused as before, nothing changed", again.code === 1 && /exists already/.test(again.out) && after(".env") === KEYLINE, again.out);
    const st2 = reelIn("status", repo);
    ok("…and reel status reads it", st2.code === 0 && /\| plan \| stage \|/.test(st2.out), st2.out);
    // a config.json that names an agent keeps it, unless --agent names one now
    const repo2 = join(tmp, "setup-agent"); mkdirSync(join(repo2, ".reelplanning"), { recursive: true });
    writeFileSync(join(repo2, ".reelplanning", "config.json"), JSON.stringify({ agent: { command: "my-agent -p" } }));
    const sa = init("setup-agent", []);
    ok("…an agent command in it is kept, and said so", sa.code === 0 && sa.config?.agent?.command === "my-agent -p" && /✓ agent: kept from your config\.json/.test(sa.out), sa.out);
    const repo3 = join(tmp, "setup-agent-flag"); mkdirSync(join(repo3, ".reelplanning"), { recursive: true });
    writeFileSync(join(repo3, ".reelplanning", "config.json"), JSON.stringify({ agent: { command: "my-agent -p" } }));
    const sf = init("setup-agent-flag", ["--agent", "none"]);
    ok("…unless --agent names one now", sf.code === 0 && sf.config?.agent?.command === "", sf.out);
    // the skill decides the same way: the whole pipeline when decisions.json is there, not the folder alone
    const skill = readFileSync(join(ROOT, "skills/plan-to-video/SKILL.md"), "utf8");
    ok("SKILL.md: the level check and its repo set-up step go by .reelplanning/decisions.json, and a folder of setup files is not set up",
      /The default for a plan when\s+the repo is set up \(`\.reelplanning\/decisions\.json` exists\)/.test(skill) && /\*\*Set up the repo\*\* if `\.reelplanning\/decisions\.json` is missing/.test(skill)
        && /only setup files \(`\.env`, `config\.json`/.test(skill) && !/when\s+`\.reelplanning\/` exists or they say so/.test(skill));
    ok("SKILL.md: the first narration's speed check points at ~/.reelplanning/.env", /\*\*Before the first narration on a machine\*\*[\s\S]{0,700}`~\/\.reelplanning\/\.env` themselves/.test(skill));
    const repo4 = join(tmp, "setup-bad"); mkdirSync(join(repo4, ".reelplanning"), { recursive: true });
    writeFileSync(join(repo4, ".reelplanning", "config.json"), "{ not json");
    const sb = init("setup-bad", []);
    ok("…a config.json that is not JSON: refused, naming it, and nothing written", sb.code === 1 && /config\.json is not valid JSON/.test(sb.out) && readdirSync(join(repo4, ".reelplanning")).join() === "config.json", sb.out);
  }

  // detected: the agent it runs in first, then PATH
  const inClaude = init("in-claude", [], { CLAUDECODE: "1", PATH: onlyCodex });
  ok("init inside Claude Code (CLAUDECODE): claude, even with only `codex` on PATH", inClaude.config?.agent?.command === template.agent.command && /agent: claude \(running inside Claude Code\)/.test(inClaude.out), inClaude.out);
  const inCodex = init("in-codex", [], { CODEX_THREAD_ID: "t-1", PATH: both });
  ok("init inside Codex (CODEX_THREAD_ID): codex, even with `claude` on PATH", inCodex.config?.agent?.command === CODEX_COMMAND && /agent: codex \(running inside Codex\)/.test(inCodex.out), inCodex.out);
  const pathBoth = init("path-both", [], { PATH: both });
  ok("init outside any agent, both on PATH: claude, the tested one", pathBoth.config?.agent?.command === template.agent.command && /`claude` is on PATH/.test(pathBoth.out), pathBoth.out);
  const pathCodex = init("path-codex", [], { PATH: onlyCodex });
  ok("init outside any agent, only `codex` on PATH: codex", pathCodex.config?.agent?.command === CODEX_COMMAND && /`codex` is on PATH/.test(pathCodex.out), pathCodex.out);
  const nothing = init("nothing", [], {});
  ok("init with no agent anywhere: none, and says so", nothing.config?.agent?.command === "" && /agent: none \(neither/.test(nothing.out), nothing.out);
  const forced = init("forced", ["--agent", "none"], { CLAUDECODE: "1" });
  ok("init --agent overrides what it detects", forced.config?.agent?.command === "", forced.out);
  ok("detectAgent: Codex's sandboxed shell (CODEX_SANDBOX_NETWORK_DISABLED) counts as inside Codex", detectAgent({ CODEX_SANDBOX_NETWORK_DISABLED: "1", PATH: empty }).agent === "codex");

  // --help prints the usage and runs nothing, in an empty folder that must stay empty
  const helpDir = join(tmp, "help"); mkdirSync(helpDir);
  const run = (file, ...args) => { const r = spawnSync(process.execPath, [join(ROOT, file), ...args], { cwd: helpDir, encoding: "utf8", env: { ...clean, PATH: empty } }); return { code: r.status, out: r.stdout, err: r.stderr }; };
  let h = run("scripts/reel.mjs", "init", "--help");
  ok("reel init --help: init's usage, and no folder made", h.code === 0 && /^  init <repo>/.test(h.out) && !/new-plan/.test(h.out) && readdirSync(helpDir).length === 0, `${h.out}${h.err}${readdirSync(helpDir)}`);
  h = run("scripts/reel.mjs", "--help");
  ok("reel --help: every command, exit 0", h.code === 0 && ["init", "new-plan", "check", "record", "status", "pr-check", "renumber"].every((c) => new RegExp(`^  ${c} `, "m").test(h.out)), h.out + h.err);
  h = run("scripts/reel.mjs");
  ok("reel alone: the usage on stderr, exit 1", h.code === 1 && /^  init <repo>/m.test(h.err), h.out + h.err);
  h = run("scripts/reel.mjs", "help", "status");
  ok("reel help status: status's lines", h.code === 0 && /^  status <repo>/.test(h.out), h.out + h.err);
  h = run("scripts/reel.mjs", "bogus");
  ok("reel bogus: names the command and points at --help", h.code === 1 && /no such command: reel bogus/.test(h.err) && /reel --help/.test(h.err), h.out + h.err);
  h = run("bin/reelplanning.mjs", "review", "--help");
  ok("reelplanning review --help: the comment at the top of review.mjs, no server started", h.code === 0 && /^Open a built video in the review player/.test(h.out), h.out + h.err);
  h = run("bin/reelplanning.mjs", "finish-project", "-h");
  ok("reelplanning finish-project -h: a shell script's comment, without its #", h.code === 0 && h.out.length > 0 && !/^#/m.test(h.out), h.out + h.err);
  ok("--help: nothing written to the folder it ran in", readdirSync(helpDir).length === 0, String(readdirSync(helpDir)));

  // reel stage: a placed component stays inside the frame
  const rp = join(claude.repo, ".reelplanning");
  const sysPath = join(rp, "system.json"), sys = JSON.parse(readFileSync(sysPath, "utf8"));
  writeFileSync(join(tmp, "plan.md"), "# Greeting\n\n### Step 1 — Add the command\n\n## Components touched\n\n- **Greeting command**\n");
  const reel = (...a) => { const r = spawnSync(process.execPath, [join(ROOT, "scripts/reel.mjs"), ...a], { encoding: "utf8", env: clean }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
  const made = reel("new-plan", claude.repo, "greeting", "--plan", join(tmp, "plan.md"));
  const pd = (made.out.match(/✓ (\S+)/) || [])[1];
  const stageWith = (components) => { writeFileSync(sysPath, JSON.stringify({ ...sys, components })); return reel("stage", pd); };
  const cmd = { id: "command", name: "Greeting command", kind: "build" };
  let r = stageWith([{ ...cmd, stage: { x: 1800, y: 430, w: 270, h: 110 } }]);
  ok("reel stage: a component past the frame's right edge stops it, by id", r.code === 1 && /command \(.*\) in system\.json needs numbers for stage x, y, w and h that keep it inside the 1920×1080 frame/.test(r.out), r.out);
  r = stageWith([{ ...cmd, stage: { x: 700, y: 430, w: 270 } }]);
  ok("reel stage: a placement with no h stops it", r.code === 1 && /command/.test(r.out), r.out);
  r = stageWith([{ ...cmd, stage: { x: 700, y: 430, w: 270, h: 110 } }, { id: "later", name: "Later part", kind: "service" }]);
  const html = (() => { try { return readFileSync(join(pd, "video/.hyperframes/stage-snippet.html"), "utf8"); } catch { return ""; } })();
  ok("reel stage: a placed component is drawn; one with no placement is left off, as before", r.code === 0 && /FID-node-command/.test(html) && !/FID-node-later/.test(html), r.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
if (failed) { console.error(`\n${failed} failed`); process.exit(1); }
