// Where things are (this package, a Chromium, a dependency, the repo a path is in), worked out on the
// machine it runs on rather than written down.
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync, copyFileSync, realpathSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync, spawn } from "node:child_process";

/**
 * This package's root, from this file's own location: the checkout, or the installed package in the
 * npx cache. Use it to read reelplanning's OWN files (templates, the player, package.json) and
 * nothing else — never to resolve a path the caller passed, and never to write to.
 */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * A Chromium for Playwright to drive, or undefined to let Playwright resolve its own.
 * CHROMIUM_PATH wins; then the usual browser stores, newest build first. Returning undefined is a
 * valid answer, not a failure — with `npx playwright install chromium` the default works.
 */
export function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  // Playwright's own store on this OS (where `npx playwright install` puts them), as well as a container's
  const own = process.platform === "darwin" ? join(homedir(), "Library/Caches/ms-playwright")
    : process.platform === "win32" ? join(process.env.LOCALAPPDATA || join(homedir(), "AppData/Local"), "ms-playwright")
    : join(process.env.XDG_CACHE_HOME || join(homedir(), ".cache"), "ms-playwright");
  const stores = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers", own].filter(Boolean);
  // a build's executable, in the layouts Playwright has used: Chromium's own (to 1.48), then Chrome for Testing's, the
  // full browser and the headless shell
  const inside = ["chrome-linux/chrome", "chrome-linux/headless_shell", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe",
    "chrome-linux64/chrome", "chrome-linux-arm64/chrome", ...["arm64", "x64"].map((a) => `chrome-mac-${a}/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`), "chrome-win64/chrome.exe",
    ...["linux64", "linux-arm64", "mac-arm64", "mac-x64"].map((a) => `chrome-headless-shell-${a}/chrome-headless-shell`), "chrome-headless-shell-win64/chrome-headless-shell.exe"];
  for (const store of stores) {
    if (!existsSync(store)) continue;
    // "chromium-1194" sorts after "chromium-1180" numerically, which a plain sort gets wrong; of one build, the full
    // browser ("chromium-1243") before its headless shell ("chromium_headless_shell-1243")
    const num = (d) => parseInt(d.replace(/\D+/g, ""), 10) || 0;
    const builds = readdirSync(store).filter((d) => d.startsWith("chromium")).sort((a, b) => num(b) - num(a) || (a < b ? -1 : a > b ? 1 : 0));
    for (const b of builds) for (const rel of inside) { const p = join(store, b, rel); if (existsSync(p)) return p; }
  }
  return undefined;
}

/**
 * For a child process given a HOME of its own (a spec's scratch home): this machine's Chromium, found from the real
 * one, as CHROMIUM_PATH. Playwright looks for its browsers under HOME, so the child would find none.
 */
export const chromiumEnv = () => { const p = chromiumPath(); return p ? { CHROMIUM_PATH: p } : {}; };

/** Launch options for a headless run in a container: no sandbox, and audio may start itself. */
export const launchOpts = (extra = {}) => ({
  executablePath: chromiumPath(),
  args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
  ...extra,
});

/**
 * The port a spec serves on. Alone, a spec keeps its own fixed port (`fallback`); under the test runner
 * (scripts/test/run.mjs) specs run side by side, so the runner hands each one a free port in
 * RP_TEST_PORT, and a spec that needs a second server takes `offset` 1 (the runner keeps a few ports
 * free above the one it gives).
 */
export const testPort = (fallback, offset = 0) => (Number(process.env.RP_TEST_PORT) || fallback) + offset;

/**
 * Resolves once a spec's own server on `port` answers an HTTP request (any status): a server started as a
 * child process (`staticServer`, below) is up when it answers, not after a fixed wait, which a loaded
 * machine outlasts. Given that `child`, it fails at once, with the child's own words, if the child exits
 * first. Rejects after `timeout` ms.
 */
export async function serverUp(port, { child = null, timeout = 60000, path = "/" } = {}) {
  const until = Date.now() + timeout;
  let said = "";
  child?.stderr?.on("data", (c) => (said = (said + c).slice(-600)));
  for (;;) {
    if (child && child.exitCode != null) throw new Error(`the server for port ${port} exited (${child.exitCode}) before it answered: ${said.trim() || "(it said nothing)"}`);
    try { await fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(5000) }); return; }
    catch (e) { if (Date.now() > until) throw new Error(`no server on port ${port} after ${timeout} ms: ${e.cause?.code || e.cause?.message || e.message}${said ? ` — it said: ${said.trim()}` : ""}`); }
    await new Promise((r) => setTimeout(r, 100));
  }
}

/**
 * The exhaustive run of a spec that has a quicker one (`RP_FULL=1`, or `--full` on its command line):
 * `npm run test:full` sets it; `npm test` runs the quicker one.
 */
export const FULL = process.env.RP_FULL === "1" || process.argv.includes("--full");

/**
 * A spec's scratch copy of a committed tree: every file copied, and every symlink in it replaced by a
 * copy of what it points at. `cpSync` keeps a symlink a symlink (rewritten to the absolute path of its
 * target, and `dereference` does not reach links below the top), so a write "into the copy" through
 * one lands in the committed file: eval/projects/<p>/.reelplanning/plans/<plan>/video and
 * walkthrough-video are links to videos/<slug>, and lifecycle.spec rewrote videos/w1-upload-resume/
 * plan-map.json that way on every run. `filter(src)` as cpSync's: false leaves that path (and all
 * under it) out.
 */
export function scratchCopy(src, dst, filter = () => true) {
  if (!filter(src)) return;
  if (statSync(src).isDirectory()) {   // statSync follows a link: a linked folder is copied, not linked
    mkdirSync(dst, { recursive: true });
    for (const e of readdirSync(src)) scratchCopy(join(src, e), join(dst, e), filter);
  } else copyFileSync(src, dst);
}

/** This package's own version, from its package.json. */
export const VERSION = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;

/**
 * How people run reelplanning, the one place that says: every command a person sees (the review page's
 * after-export lines, `--help`, setup's and the skills check's hints, the Codex note) is written with it.
 * The package is not on npm yet, so it is installed from GitHub (`npm i -g github:ncrispino/reelplanning`,
 * scripts/release/install.sh) and run as `reelplanning`. Once it is published, set ON_NPM to true: the commands then say
 * `npx -y reelplanning@<version>`, and `node scripts/release/sync-version.mjs` (run by `npm version`)
 * carries the change into the player's copy; scripts/test/version.spec.mjs fails until it has.
 * The skill (skills/plan-to-video/SKILL.md) agrees: its `$RP` is `reelplanning` when that is on the PATH.
 */
export const ON_NPM = false;
export const rpCommand = (version = VERSION, onNpm = ON_NPM) => onNpm ? `npx -y reelplanning@${version}` : "reelplanning";
export const RP_COMMAND = rpCommand();
/** The global install that puts `reelplanning` on the PATH, from the same choice. */
export const RP_INSTALL = ON_NPM ? "npm i -g reelplanning" : "npm i -g github:ncrispino/reelplanning";

/**
 * Where an installed dependency lives. Not always ROOT/node_modules: under `npx` the dependencies are
 * hoisted next to this package in the npx cache (…/_npx/<hash>/node_modules/<dep>), and under a
 * global install they are nested inside it. Node's own lookup list from the package root covers
 * every layout; `exports` maps are sidestepped because a file on disk is wanted, not an entry point.
 */
export function pkgDir(name, from = ROOT) {
  const req = createRequire(join(from, "package.json"));
  for (const d of req.resolve.paths(name) || []) if (existsSync(join(d, name, "package.json"))) return join(d, name);
  // a transitive dependency npm did not hoist sits under whichever package pulled it in
  if (from === ROOT) for (const via of ["hyperframes", "@hyperframes/player"]) {
    const dir = via !== name && pkgDir(via, ROOT);
    const hit = dir && pkgDir(name, dir);
    if (hit) return hit;
  }
  return null;
}

/** A file inside an installed dependency, or an error naming what is missing. */
export function depFile(name, rel) {
  const dir = pkgDir(name), p = dir && join(dir, rel);
  if (!p || !existsSync(p)) throw new Error(`${name}/${rel} not found next to reelplanning at ${ROOT} — reinstall reelplanning`);
  return p;
}

/** The gsap every video runs on: `vendor-gsap` copies it into a project's assets/vendor/, bundle-player shares it. */
export const GSAP = ["gsap", "dist/gsap.min.js"];

/**
 * What a static server answers for `file` when it is not on disk: a video's assets/vendor/gsap.min.js is build
 * output (vendor-gsap), git-ignored in a plan's and the system video's folder, so in a fresh clone it is missing
 * and every frame throws "gsap is not defined". Then the package's own gsap, the file vendor-gsap would copy
 * there (as bundle-player supplies it); anything else, null. Nothing is written into the tree.
 */
export function vendorFile(file) {
  if (existsSync(file) || !/[\\/]assets[\\/]vendor[\\/]gsap\.min\.js$/.test(file)) return null;
  try { return depFile(...GSAP); } catch { return null; }
}

/**
 * A static server over `dir` (default: this checkout) on 127.0.0.1:`port`, as a child process
 * (scripts/lib/static-server.mjs): the player specs' server, and `npm run review`'s. It serves as
 * `python3 -m http.server` did, and answers a video's missing assets/vendor/gsap.min.js with the package's
 * gsap (vendorFile), so a plan video loads in a fresh clone. `await serverUp(port, { child })`; `child.kill()`.
 * A relative `dir` is from the working directory (`npm run bundle:check` passes dist/review): resolved here, since
 * the child runs in `dir` and would read it again from there.
 */
export const staticServer = (port, { dir = ROOT } = {}) => { const d = resolve(dir);
  return spawn(process.execPath, [join(ROOT, "scripts/lib/static-server.mjs"), String(port), d], { cwd: d, stdio: ["ignore", "ignore", "pipe"] }); };

/**
 * The pinned HyperFrames CLI's entry script. Run it with `node`, never as `npx hyperframes`: from a
 * user's repo npx finds no local install and resolves (or downloads) the newest release instead of
 * the version reelplanning pins, and `npx --no-install hyperframes` simply fails there.
 */
export const hyperframesBin = () => depFile("hyperframes", "bin/hyperframes.mjs");

/**
 * The root of the repo a path belongs to: the directory holding its `.reelplanning/`, else its git
 * top level, else the working directory. Paths written into committed files are relative to this,
 * never to wherever reelplanning itself is installed.
 */
export function repoRoot(p = process.cwd()) {
  let d = resolve(p);
  for (let i = 0; i < 12; i++) {
    if (basename(d) === ".reelplanning") return dirname(d);
    if (hasRp(d)) return d;
    const up = dirname(d); if (up === d) break; d = up;
  }
  const at = existsSync(p) && statSync(p).isDirectory() ? resolve(p) : dirname(resolve(p));
  try { return execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: at, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return process.cwd(); }
}

/**
 * Whether a `.reelplanning/` folder is set up (`reel init` ran): it holds the decision log, decisions.json. A folder
 * with only setup files in it (.env, config.json, .gitignore: the hosted voice's key, made before any plan) is not:
 * the repo then has no record, a review downloads, and the first plan still runs `reel init`.
 */
export function rpInitialized(rp) { return !!rp && existsSync(join(rp, "decisions.json")); }
/** This machine's own folder, ~/.reelplanning (REELPLANNING_HOME): your memory (you.jsonl) and the machine's .env. */
export function machineDir() { return resolve(process.env.REELPLANNING_HOME || join(homedir(), ".reelplanning")); }
/**
 * Whether `d` holds a repo's `.reelplanning/`. The machine's own ~/.reelplanning is not one (unless `reel init` set up
 * the home folder itself), so a repo under your home with no `.reelplanning/` of its own does not take your home
 * folder for its root, nor its .env for the repo's.
 */
export function hasRp(d) {
  const rp = join(d, ".reelplanning");
  return existsSync(rp) && (real(rp) !== real(machineDir()) || rpInitialized(rp));
}
// compared by where they really are: the working directory is the real path (macOS's /private/var/…), while
// HOME can name it through a link (/var/…)
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };

// The same answers for the shell scripts:
//   node scripts/lib/env.mjs hf-bin | dep <name> <file-in-it> | version | rp   (rp: the command people run, RP_COMMAND)
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [what, a, b] = process.argv.slice(2);
  try {
    if (what === "hf-bin") console.log(hyperframesBin());
    else if (what === "dep" && a && b) console.log(depFile(a, b));
    else if (what === "version") console.log(VERSION);
    else if (what === "rp") console.log(RP_COMMAND);
    else { console.error("usage: node scripts/lib/env.mjs hf-bin | dep <name> <file> | version | rp"); process.exit(2); }
  } catch (e) { console.error(`✗ ${e.message}`); process.exit(1); }
}
