// Real scratch server + fake terminal launcher. Never controls the owner's terminal.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, platform } from "node:os";
import { ROOT, FULL } from "../lib/env.mjs";
import { localReviewUrl, openerPrefix, openerRule, preferencesFile, ruleFile } from "../lib/review-preferences.mjs";
import { checkReviewServer } from "../lib/review-health.mjs";

const scratch = realpathSync(mkdtempSync(join(tmpdir(), "rp-review-setup-")));
const bin = join(scratch, "bin"), log = join(scratch, "opened.jsonl");
mkdirSync(bin);
const env = { ...process.env, REELPLANNER_HOME: join(scratch, "machine"), CODEX_HOME: join(scratch, "codex"), PATH: `${bin}:${process.env.PATH}` };
const prefs = preferencesFile(env), rules = ruleFile(env);
const cli = join(ROOT, "bin/reelplanner.mjs");
const run = (args) => spawnSync(process.execPath, [cli, ...args], { cwd: scratch, env, encoding: "utf8", timeout: 20000 });
const runAsync = (args, childEnv = env) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [cli, ...args], { cwd: scratch, env: childEnv });
  let stdout = "", stderr = "";
  const timer = setTimeout(() => { child.kill(); reject(new Error("CLI timeout")); }, 20000);
  child.stdout.on("data", (b) => { stdout += b; }); child.stderr.on("data", (b) => { stderr += b; });
  child.on("error", reject); child.on("close", (status) => { clearTimeout(timer); resolve({ status, stdout, stderr }); });
});
const ok = (r) => assert.equal(r.status, 0, r.stdout + r.stderr);
const opened = () => existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").map(JSON.parse) : [];
let count = 0;
let liveVideo;
async function test(name, fn) { await fn(); count++; console.log(`✓ ${name}`); }
let response = { ok: true, inbox: 0, where: "repo" }, redirect = false;
const server = createServer((req, res) => {
  assert.equal(req.url, "/api/review");
  if (redirect) { res.writeHead(302, { Location: "https://example.com/" }); res.end(); }
  else { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(response)); }
});
try {
  writeFileSync(join(bin, "terminal-browser"), `#!${process.execPath}\nimport {appendFileSync} from 'node:fs';\nconst args=process.argv.slice(2);\nif(args.includes('--help')) console.log('--split'); else appendFileSync(${JSON.stringify(log)},JSON.stringify(args)+'\\n');\n`, { mode: 0o755 });
  // Only the real Codex parser integration below uses the installed CLI; no model.
  writeFileSync(join(bin, "codex"), `#!${process.execPath}\nconsole.log(JSON.stringify({decision:'allow'}));\n`, { mode: 0o755 });
  await test("default/check is read-only and plugin installation grants nothing", () => {
    const help = run(["review-setup", "--help"]); ok(help); assert.match(help.stdout, /codex-allow-open/);
    ok(run(["review-setup", "--check"])); assert.equal(existsSync(prefs), false); assert.equal(existsSync(rules), false);
  });
  await test("dry-run previews an exact prefix without creating either config directory", () => {
    const r = run(["review-setup", "--workspace", "terminal-browser", "--codex-allow-open", "--dry-run"]);
    ok(r); assert.match(r.stdout, /review-open/); assert.equal(existsSync(prefs), false); assert.equal(existsSync(rules), false);
  });
  await test("remembering a workspace alone grants no Codex rule", () => {
    ok(run(["review-setup", "--workspace", "terminal-browser"]));
    assert.equal(JSON.parse(readFileSync(prefs)).workspace, "terminal-browser"); assert.equal(existsSync(rules), false);
  });
  await test("explicit allow is idempotent and preserves unrelated rules", () => {
    mkdirSync(join(env.CODEX_HOME, "rules"), { recursive: true });
    const other = join(env.CODEX_HOME, "rules", "default.rules"); writeFileSync(other, "# user's other rules\n");
    for (let i = 0; i < 2; i++) ok(run(["review-setup", "--workspace", "terminal-browser", "--codex-allow-open"]));
    assert.equal(readFileSync(rules, "utf8"), openerRule()); assert.equal(readFileSync(other, "utf8"), "# user's other rules\n");
    ok(run(["review-setup", "--check"]));
    assert.equal(opened().length, 0);
  });
  await test("a check that cannot read terminal-browser's options (as in Codex's Linux sandbox) says so; setup still refuses", () => {
    const fake = join(bin, "terminal-browser"), kept = readFileSync(fake, "utf8");
    writeFileSync(fake, `#!${process.execPath}\n`, { mode: 0o755 });
    try {
      const check = run(["review-setup", "--check"]); ok(check);
      assert.match(check.stdout, /could not be read here.*run --check in your own terminal/);
      const setup = run(["review-setup", "--workspace", "terminal-browser"]);
      assert.equal(setup.status, 1); assert.match(setup.stderr, /does not report split support/);
    } finally { writeFileSync(fake, kept, { mode: 0o755 }); }
  });
  await test("saved rule checks detect edited rules, and disable refuses to delete edits", () => {
    writeFileSync(rules, openerRule() + "# user edit\n");
    assert.equal(run(["review-setup", "--check"]).status, 1);
    assert.equal(run(["review-setup", "--codex-disable-open"]).status, 1);
    assert.match(readFileSync(rules, "utf8"), /user edit/);
    writeFileSync(rules, openerRule());
  });
  await test("setup refuses unknown options, conflicting modes, and replacing a symlink before changing permissions", () => {
    for (const args of [["--workspace"], ["--yes"], ["--check", "--codex-allow-open"], ["--codex-disable-open", "--codex-allow-open"], ["--workspace", "browser", "--codex-allow-open"]]) {
      assert.equal(run(["review-setup", ...args]).status, 1);
    }
    const contents = readFileSync(prefs, "utf8"), target = join(scratch, "other.json");
    writeFileSync(target, contents); unlinkSync(prefs); symlinkSync(target, prefs);
    assert.equal(run(["review-setup", "--codex-disable-open"]).status, 1);
    assert.equal(readFileSync(rules, "utf8"), openerRule()); assert.equal(readFileSync(target, "utf8"), contents);
    unlinkSync(prefs); writeFileSync(prefs, contents);
  });
  await test("opener rejects external URLs, non-viewer endpoints, credentials, flags, and extra arguments", () => {
    for (const input of ["https://example.com/", "file:///tmp/test", "http://localhost:8787/", "http://127.0.0.1:8787/api/review", "http://127.0.0.1:8787/?project=../secret", "http://127.0.0.1:8787/?project=a&project=b", "http://127.0.0.1:8787/?redirect=x", "http://user@127.0.0.1:8787/", "http://127.0.0.1:8787/#x", "--eval"]) {
      assert.throws(() => localReviewUrl(input));
    }
    assert.equal(run(["review-open", "http://127.0.0.1:8787/", "--workspace", "browser"]).status, 1);
    assert.equal(opened().length, 0);
    assert.equal(localReviewUrl("http://127.0.0.1:8787/?project=release%20v1.2").searchParams.get("project"), "release v1.2");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}/?project=demo`;
  await test("a healthy local review opens exactly its URL in the terminal launcher", async () => {
    ok(await runAsync(["review-open", url]));
    assert.deepEqual(opened(), [["open", "--split", "right", url]]);
  });
  await test("unrecognized servers and redirects never open or fall back", async () => {
    response = { ok: true };
    assert.equal((await runAsync(["review-open", url])).status, 1);
    redirect = true;
    assert.equal((await runAsync(["review-open", url])).status, 1);
    redirect = false; response = { ok: true, inbox: 0, where: "repo" };
    assert.equal(opened().length, 1);
  });
  await test("health failures distinguish denied access, a stopped server, and timeout without retrying", async () => {
    for (const [error, expected] of [
      [new TypeError("fetch failed", { cause: { code: "EPERM" } }), /blocked \(EPERM\).*cannot access localhost/],
      [new TypeError("fetch failed", { cause: { code: "EACCES" } }), /blocked \(EACCES\)/],
      [new TypeError("fetch failed", { cause: { code: "ECONNREFUSED" } }), /connection refused.*No server accepted/],
      [new DOMException("timeout", "TimeoutError"), /timed out.*unverified/],
      [new TypeError("private network details"), /health check failed.*unverified/],
    ]) {
      let calls = 0;
      await assert.rejects(checkReviewServer(url, async (target, options) => {
        calls++;
        assert.equal(target.href, new URL("/api/review", url).href);
        assert.equal(options.redirect, "error");
        throw error;
      }), expected);
      assert.equal(calls, 1);
    }
    assert.equal(opened().length, 1);
  });
  await test("explicit opening survives missing, invalid, and browser-default workspace settings", async () => {
    const before = opened().length;
    const otherHome = join(scratch, "fresh-agent");
    const childEnv = { ...env, REELPLANNER_HOME: otherHome };
    ok(await runAsync(["review-open", url], childEnv));
    assert.equal(existsSync(otherHome), false, "opening must not create settings");
    mkdirSync(otherHome);
    writeFileSync(join(otherHome, "review.json"), "invalid JSON");
    ok(await runAsync(["review-open", url], childEnv));
    ok(run(["review-setup", "--workspace", "browser"]));
    ok(await runAsync(["review-open", url]));
    assert.equal(opened().length, before + 3);
    assert.equal(JSON.parse(readFileSync(prefs)).workspace, "browser");
  });
  await test("missing terminal-browser reports the dependency without opening another browser", async () => {
    const before = opened().length;
    const result = await runAsync(["review-open", url], { ...env, PATH: bin + "/absent" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /terminal-browser.*(not installed|PATH)/);
    assert.equal(opened().length, before);
  });
  await test("review inherits the saved workspace, prints the standalone opener, and honors --no-open and overrides", () => {
    ok(run(["review-setup", "--workspace", "terminal-browser", "--codex-allow-open"]));
    const repo = join(scratch, "project");
    mkdirSync(repo);
    ok(run(["reel", "init", repo, "--name", "Scratch review", "--kind", "greenfield", "--agent", "none"]));
    liveVideo = join(repo, "video"); mkdirSync(liveVideo);
    mkdirSync(join(liveVideo, "compositions")); mkdirSync(join(liveVideo, "assets"));
    writeFileSync(join(liveVideo, "index.html"), '<!doctype html><html><body><div data-composition-id="demo" data-duration="1">Scratch</div></body></html>');
    writeFileSync(join(liveVideo, "plan-map.json"), JSON.stringify({ project: "video", title: "Scratch", frames: [] }));
    const args = ["review", liveVideo, "--detach", "--no-notify"];
    const before = opened().length;
    const start = run([...args, "--no-open"]);
    if (start.status !== 0) console.error(readFileSync(join(repo, ".reelplanner/inbox/server.log"), "utf8"));
    ok(start);
    assert.match(start.stdout, /'review-open' 'http:\/\/127\.0\.0\.1:/);
    // Codex applies the rule only when the program, the first word, is unquoted
    assert.ok(start.stdout.includes(`\n  ${openerPrefix()[0]} '${openerPrefix()[1]}' 'review-open' `), start.stdout);
    assert.equal(opened().length, before);
    ok(run(args)); assert.equal(opened().length, before + 1);
    ok(run([...args, "--no-open"])); assert.equal(opened().length, before + 1);
    const browser = platform() === "darwin" ? "open" : platform() === "win32" ? "cmd" : "xdg-open";
    const browserLog = join(scratch, "browser.json");
    writeFileSync(join(bin, browser), `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(browserLog)},JSON.stringify(process.argv.slice(2)));\n`, { mode: 0o755 });
    const override = run([...args, "--workspace", "browser"]); ok(override);
    assert.equal(existsSync(browserLog), true); assert.equal(opened().length, before + 1);
    assert.doesNotMatch(override.stdout, /run this separately/);
    ok(run(["review", liveVideo, "--stop"])); liveVideo = null;
  });
  await test("disable removes only its dedicated rule and preserves workspace preference", () => {
    ok(run(["review-setup", "--codex-disable-open"]));
    assert.equal(existsSync(rules), false);
    assert.equal(JSON.parse(readFileSync(prefs)).workspace, "terminal-browser");
    assert.equal(JSON.parse(readFileSync(prefs)).codexAutoOpen, undefined);
    assert.equal(existsSync(join(env.CODEX_HOME, "rules", "default.rules")), true);
  });
  if (FULL) await test("installed Codex parses the real rule and excludes other commands and Node evaluation", () => {
    const probe = spawnSync("codex", ["execpolicy", "--help"], { encoding: "utf8" });
    if (probe.error?.code === "ENOENT") { console.log("  · real Codex parser unavailable on this machine"); return; }
    assert.equal(probe.status, 0, probe.stderr);
    writeFileSync(rules, openerRule());
    const prefix = openerPrefix();
    for (const [args, allowed] of [[prefix.concat(url), true], [[...prefix.slice(0, 2), "review", "--detach"], false], [[...prefix.slice(0, 2), "reel", "record"], false], [[prefix[0], "-e", "process.exit()"], false]]) {
      const result = spawnSync("codex", ["execpolicy", "check", "--rules", rules, "--", ...args], { encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(result.stdout).decision === "allow", allowed, JSON.stringify(args));
    }
    const restrictive = join(scratch, "restrictive.rules");
    writeFileSync(restrictive, `prefix_rule(pattern = ${JSON.stringify(prefix)}, decision = "forbidden")\n`);
    const blocked = spawnSync("codex", ["execpolicy", "check", "--rules", rules, "--rules", restrictive, "--", ...prefix, url], { encoding: "utf8" });
    assert.equal(blocked.status, 0, blocked.stderr); assert.equal(JSON.parse(blocked.stdout).decision, "forbidden");
  });
  console.log(`\n${count} review setup checks passed (no real pane or model launched)`);
} finally {
  if (liveVideo) run(["review", liveVideo, "--stop"]);
  server.closeAllConnections(); await new Promise((r) => server.close(r));
  rmSync(scratch, { recursive: true, force: true });
}
