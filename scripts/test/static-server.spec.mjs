// The specs' static server (scripts/lib/static-server.mjs) serves a folder as `python3 -m http.server` did, and
// answers a video's missing assets/vendor/gsap.min.js — build output, git-ignored, so absent in a fresh clone —
// with the package's own gsap. In a checkout where the videos were built that path is never taken, so it is
// checked here, on a scratch folder with no vendor copy.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { testPort, serverUp, staticServer, depFile, GSAP } from "../lib/env.mjs";

const dir = mkdtempSync(join(tmpdir(), "rp-static-")), v = join(dir, ".reelplanning/plans/p/video");
mkdirSync(join(v, "assets/vendor"), { recursive: true }); mkdirSync(join(dir, "own/assets/vendor"), { recursive: true });
writeFileSync(join(v, "index.html"), '<!doctype html><script src="assets/vendor/gsap.min.js"></script>');
writeFileSync(join(dir, "own/assets/vendor/gsap.min.js"), "/* its own */");
writeFileSync(join(dir, "secret.txt"), "x");
const port = testPort(8920), srv = staticServer(port, { dir: v.replace(/\/video$/, "") });
const base = `http://127.0.0.1:${port}`;
let failed = 0;
const ok = (c, m, x = "") => { console.log(`${c ? "✓" : "✗"} ${m}${!c && x ? ` — ${x}` : ""}`); if (!c) failed++; };
try {
  await serverUp(port, { child: srv });
  const gsap = readFileSync(depFile(...GSAP), "utf8");
  const g = await fetch(`${base}/video/assets/vendor/gsap.min.js`);
  ok(g.status === 200 && (await g.text()) === gsap && /javascript/.test(g.headers.get("content-type")), "a video's missing assets/vendor/gsap.min.js is the package's gsap", g.status);
  const idx = await fetch(`${base}/video/?project=x`);
  ok(idx.status === 200 && /gsap\.min\.js/.test(await idx.text()) && /text\/html/.test(idx.headers.get("content-type")), "a folder with its slash serves its index.html, the query ignored", idx.status);
  const r = await fetch(`${base}/video?project=x`, { redirect: "manual" });
  ok(r.status === 301 && r.headers.get("location") === "/video/?project=x", "a folder without its slash is redirected to it, the query kept", `${r.status} ${r.headers.get("location")}`);
  ok((await fetch(`${base}/video/assets/vendor/other.js`)).status === 404, "any other missing file is a 404");
  ok((await fetch(`${base}/video/%2e%2e/%2e%2e/%2e%2e/secret.txt`)).status === 404, "a path out of the folder served is refused");
  const lm = (await fetch(`${base}/video/index.html`)).headers.get("last-modified");
  ok((await fetch(`${base}/video/index.html`, { headers: { "if-modified-since": lm } })).status === 304, "a file not changed since the browser's copy is a 304, as python's server answered");
  const p2 = testPort(8920, 1), own = staticServer(p2, { dir });
  try { await serverUp(p2, { child: own }); ok((await (await fetch(`http://127.0.0.1:${p2}/own/assets/vendor/gsap.min.js`)).text()) === "/* its own */", "a video that has its own gsap gets its own"); }
  finally { own.kill(); }
} finally { srv.kill(); rmSync(dir, { recursive: true, force: true }); }
console.log(failed ? `\n${failed} failing` : "\nall passed");
process.exit(failed ? 1 : 0);
