// A static file server for a checkout: what `python3 -m http.server` did for the player specs and for
// `npm run review`, plus the one thing a fresh clone lacks.
//
// A plan video's (and the system video's) assets/vendor/ is build output — `vendor-gsap` writes it, and
// .reelplanning/.gitignore keeps it out of git — so in a fresh clone every frame of those videos points at
// an assets/vendor/gsap.min.js that is not there, the page throws "gsap is not defined", and a spec that
// loads the video fails. Here a missing …/assets/vendor/gsap.min.js is answered with the one gsap the
// pipeline copies in (vendor-gsap.sh) and bundle-player supplies (scripts/lib/env.mjs vendorFile), so
// nothing is written into the tree to make a video load.
//
// It answers as python's server did where a spec can tell: GET and HEAD, a folder with a trailing slash
// serves its index.html, one without is redirected to it (so a page's relative links resolve), the query
// is ignored, and a path outside the folder served is refused.
//
//   node scripts/lib/static-server.mjs <port> [<dir>]     serve <dir> (default: the working directory) on 127.0.0.1
//   staticServer(port, { dir })                          the same as a child process (scripts/lib/env.mjs), for a spec:
//                                                        await serverUp(port, { child }), and child.kill() at the end
import { createServer } from "node:http";
import { existsSync, statSync, createReadStream } from "node:fs";
import { resolve, join, normalize, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { vendorFile } from "./env.mjs";

export const TYPES = { ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".map": "application/json", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4",
  ".ogg": "audio/ogg", ".mp4": "video/mp4", ".webm": "video/webm", ".vtt": "text/vtt", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".ttf": "font/ttf", ".otf": "font/otf", ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".csv": "text/csv", ".pdf": "application/pdf" };

/**
 * The file a request for `urlPath` gets from a static server over `root`, or null (not found, or outside
 * `root`). A folder gives its index.html; a missing assets/vendor/gsap.min.js gives the package's gsap
 * (vendorFile). `{ redirect }` instead when `urlPath` names a folder without its trailing slash.
 */
export function servedFile(root, urlPath) {
  const base = resolve(root), file = join(base, normalize(urlPath));
  if (file !== base && !file.startsWith(base + sep)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!urlPath.endsWith("/")) return { redirect: `${urlPath}/` };
    const idx = join(file, "index.html");
    return existsSync(idx) ? idx : null;
  }
  return existsSync(file) ? file : vendorFile(file);
}

/** An http.Server serving `dir` as above (not yet listening). */
export function createStaticServer(dir) {
  return createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(501).end(); return; }
    let url, path;
    try { url = new URL(req.url, "http://x"); path = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
    const hit = servedFile(dir, path);
    if (!hit) { res.writeHead(404, { "content-type": "text/plain" }).end("not found"); return; }
    if (hit.redirect) { res.writeHead(301, { location: hit.redirect.split("/").map(encodeURIComponent).join("/") + url.search }).end(); return; }
    // the headers python's server sent (a Last-Modified, and a 304 to a request that has it), and no others: the
    // specs' timings were measured against them (a no-store audio file, say, is fetched again on every seek)
    const st = statSync(hit), modified = new Date(Math.floor(st.mtimeMs / 1000) * 1000);
    const since = Date.parse(req.headers["if-modified-since"] || "");
    if (!req.headers["if-none-match"] && since >= modified.getTime()) { res.writeHead(304).end(); return; }
    res.writeHead(200, { "content-type": TYPES[extname(hit).toLowerCase()] || "application/octet-stream", "content-length": st.size, "last-modified": modified.toUTCString() });
    if (req.method === "HEAD") { res.end(); return; }
    createReadStream(hit).on("error", () => res.destroy()).pipe(res);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [port, dir = "."] = process.argv.slice(2);
  if (!Number(port)) { console.error("usage: node scripts/lib/static-server.mjs <port> [<dir>]"); process.exit(2); }
  const srv = createStaticServer(resolve(dir));
  srv.on("error", (e) => { console.error(`✗ port ${port}: ${e.message}`); process.exit(1); });
  srv.listen(Number(port), "127.0.0.1", () => console.error(`serving ${resolve(dir)} on http://127.0.0.1:${port}/`));
  for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => process.exit(0));
}
