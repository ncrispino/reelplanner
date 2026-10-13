// Installation prerequisites run without model credentials. The full run also uses a real Codex CLI when present.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, FULL } from "../lib/env.mjs";

let failed = 0;
const test = async (name, fn) => { try { await fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); } };
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "rp-codex-install-")));
const copy = (f, dir) => { const target = join(dir, f); mkdirSync(dirname(target), { recursive: true }); copyFileSync(join(ROOT, f), target); };
const run = (cmd, args, extra = {}) => spawnSync(cmd, args, { cwd: scratch, encoding: "utf8", timeout: 30000, ...extra });

try {
  const checkout = join(scratch, "checkout");
  for (const f of ["package.json", "package-lock.json", "scripts/lib/env.mjs", "scripts/lib/old-names.mjs", "scripts/lib/setup-check.mjs", "scripts/lib/project-dir.sh", "scripts/setup.sh"]) copy(f, checkout);

  await test("missing HyperFrames and player return useful npm ci errors without recursion", () => {
    const r = run(process.execPath, ["--input-type=module", "-e", `
      const {pkgDir,depFile}=await import(${JSON.stringify(join(checkout, "scripts/lib/env.mjs"))});
      for(const name of ['hyperframes','@hyperframes/player','gsap']) if(pkgDir(name)!==null) throw new Error(name+' unexpectedly installed');
      try { depFile('hyperframes','bin/hyperframes.mjs'); process.exit(2); }
      catch(e) { console.log(e.message); }
    `]);
    assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /hyperframes\/bin\/hyperframes.mjs not found/); assert.match(r.stdout, /run npm ci/);
    assert.doesNotMatch(r.stdout + r.stderr, /RangeError|Maximum call stack/);
  });

  await test("setup --dry-run names all absent npm prerequisites before attempting media setup", () => {
    const r = run("bash", [join(checkout, "scripts/setup.sh"), "--dry-run", "--hosted-voice"], { cwd: checkout });
    assert.equal(r.status, 1, r.stdout + r.stderr);
    for (const name of Object.keys(JSON.parse(readFileSync(join(checkout, "package.json"), "utf8")).dependencies)) assert.ok(r.stderr.includes(name), r.stderr);
    assert.match(r.stderr, /npm ci/); assert.doesNotMatch(r.stdout + r.stderr, /RangeError|Maximum call stack|Chrome headless|Kokoro TTS|whisper.cpp/);
    assert.ok(!existsSync(join(checkout, "node_modules")), "dry run installed dependencies");
  });

  await test("bounded lookup still finds a dependency nested under HyperFrames", () => {
    const hf = join(checkout, "node_modules/hyperframes");
    mkdirSync(join(hf, "node_modules/gsap"), { recursive: true });
    writeFileSync(join(hf, "package.json"), '{"name":"hyperframes"}');
    writeFileSync(join(hf, "node_modules/gsap/package.json"), '{"name":"gsap"}');
    const r = run(process.execPath, ["--input-type=module", "-e", `
      const {pkgDir}=await import(${JSON.stringify(join(checkout, "scripts/lib/env.mjs"))});
      console.log(JSON.stringify([pkgDir('gsap'),pkgDir('@hyperframes/player')]));
    `]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(JSON.parse(r.stdout), [join(hf, "node_modules/gsap"), null]);
  });

  await test("setup names a selected but absent Codex CLI without claiming a model run passed", async () => {
    const { agentDiagnostics } = await import("../lib/setup-check.mjs");
    const result = await agentDiagnostics({ repo: scratch, env: { PATH: "", CODEX_THREAD_ID: "scratch-thread" }, executable: join(scratch, "missing-codex") });
    assert.equal(result.selected.agent, "codex"); assert.equal(result.probe.available, false);
    const shown = result.lines.join("\n");
    assert.match(shown, /coding agent: codex/); assert.match(shown, /model-driven.*not checked/);
    assert.ok(result.probe.limitations.length > 0, shown); assert.doesNotMatch(shown, /^✓ codex/m);
  });

  await test("older Codex diagnostics state limits and retain a manual inbox fallback", async () => {
    const fake = join(scratch, "old-codex");
    writeFileSync(fake, `#!/usr/bin/env node
      const args=process.argv.slice(2);
      if(args.includes('--version')) console.log('codex-cli 0.159.0');
      else if(args[0]==='exec'&&args.includes('--help')) console.log('Usage: codex exec --sandbox workspace-write [PROMPT]');
      else { console.error('unsupported command'); process.exit(2); }
    `); chmodSync(fake, 0o755);
    const { agentDiagnostics } = await import("../lib/setup-check.mjs");
    const result = await agentDiagnostics({ repo: scratch, env: { PATH: process.env.PATH, CODEX_THREAD_ID: "scratch-thread" }, executable: fake });
    assert.equal(result.probe.available, true); assert.equal(result.probe.capabilities.automaticReview, false);
    assert.equal(result.probe.capabilities.queue, false); assert.equal(result.probe.capabilities.plugins, false);
    assert.match(result.lines.join("\n"), /inbox|wait/i); assert.match(result.lines.join("\n"), /update|upgrade/i);
  });

  const cli = process.env.CODEX_INSTALL_CLI || "codex";
  const osHome = join(scratch, "os-home"), codexHome = join(scratch, "codex-home");
  mkdirSync(osHome); mkdirSync(codexHome);
  const env = { ...process.env, HOME: osHome, CODEX_HOME: codexHome, XDG_CONFIG_HOME: join(scratch, "config"), XDG_CACHE_HOME: join(scratch, "cache"), npm_config_cache: join(scratch, "npm-cache") };
  for (const key of ["CODEX_THREAD_ID", "CODEX_SANDBOX", "CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CONFIG_DIR"]) delete env[key];
  const installedCli = run(cli, ["--version"], { env });
  if (FULL && installedCli.status === 0) await test("real Codex discovers and installs the packed root plugin in a clean home", () => {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const packed = run(npm, ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], { cwd: ROOT, env });
    assert.equal(packed.status, 0, packed.stderr);
    const [pack] = JSON.parse(packed.stdout), unpack = run("tar", ["-xzf", join(scratch, pack.filename), "-C", scratch]);
    assert.equal(unpack.status, 0, unpack.stderr);
    const source = join(scratch, "package");
    const codex = (...args) => { const r = run(cli, args, { env }); assert.equal(r.status, 0, r.stderr || r.stdout); return JSON.parse(r.stdout); };
    assert.equal(codex("plugin", "marketplace", "add", source, "--json").marketplaceName, "reelplanner");
    const added = codex("plugin", "add", "reelplanner@reelplanner", "--json");
    const version = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
    assert.equal(added.version, version);
    assert.ok(added.installedPath.startsWith(codexHome + "/"), added.installedPath);
    for (const f of ["plugin.json", "skills/plan-to-video/SKILL.md", "skills/plan-to-video/references/harnesses.md"])
      assert.equal(readFileSync(join(added.installedPath, f), "utf8"), readFileSync(join(source, f), "utf8"), `installed ${f}`);
    const installed = codex("plugin", "list", "--json").installed.find((p) => p.pluginId === "reelplanner@reelplanner");
    assert.ok(installed?.installed && installed.enabled, JSON.stringify(installed));
    assert.equal(installed.version, version);
    assert.ok(existsSync(join(codexHome, "config.toml")), "CLI did not record its isolated installation");
    console.log(`  ${installedCli.stdout.trim()}: marketplace registered, plugin installed/enabled, skill and references verified`);
  });
  else console.log(`· native Codex installation not run (${FULL ? "Codex CLI absent; set CODEX_INSTALL_CLI" : "use --full with Codex CLI installed"}); model runs are separate acceptance checks`);
} finally { rmSync(scratch, { recursive: true, force: true }); }

if (failed) process.exit(1);
