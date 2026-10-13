// Seekable static responses shared by the review server and checkout previews.
import { createReadStream, statSync } from "node:fs";

// A single byte range is enough for browser media seeking. Unknown units,
// malformed syntax and multipart requests fall back to the full representation.
function byteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(String(header || "").trim());
  if (!match || (!match[1] && !match[2])) return null;
  const total = BigInt(size);
  if (!total) return false;
  let start, end;
  if (!match[1]) {
    const suffix = BigInt(match[2]); if (!suffix) return false;
    start = suffix >= total ? 0n : total - suffix; end = total - 1n;
  } else {
    start = BigInt(match[1]); end = match[2] ? BigInt(match[2]) : total - 1n;
    if (start >= total || end < start) return false;
    if (end >= total) end = total - 1n;
  }
  return { start: Number(start), end: Number(end) };
}

export function sendFile(req, res, file, { contentType = "application/octet-stream", headers = {}, body = null, stat = statSync(file) } = {}) {
  const bytes = body == null ? null : Buffer.isBuffer(body) ? body : Buffer.from(body);
  const size = bytes?.length ?? stat.size;
  const modified = Math.floor(stat.mtimeMs / 1000) * 1000;
  // Without a matching strong validator, send the complete current file. These
  // servers use Last-Modified; an ETag in If-Range has no matching validator.
  const ifRange = req.headers["if-range"];
  const range = req.method === "GET" && (!ifRange || Date.parse(ifRange) === modified)
    ? byteRange(req.headers.range, size) : null;
  const common = { "content-type": contentType, "last-modified": new Date(modified).toUTCString(), ...headers,
    "accept-ranges": "bytes" };
  if (range === false) {
    res.writeHead(416, { ...common, "content-range": `bytes */${size}`, "content-length": 0 }); res.end(); return;
  }
  const { start, end } = range || { start: 0, end: size - 1 };
  const length = range ? end - start + 1 : size;
  res.writeHead(range ? 206 : 200, { ...common, "content-length": length,
    ...(range ? { "content-range": `bytes ${start}-${end}/${size}` } : {}) });
  if (req.method === "HEAD" || !length) { res.end(); return; }
  if (bytes) { res.end(bytes.subarray(start, end + 1)); return; }
  const stream = createReadStream(file, { start, end });
  stream.on("error", () => res.destroy()); res.once("close", () => stream.destroy()); stream.pipe(res);
}
