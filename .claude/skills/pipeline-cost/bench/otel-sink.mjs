#!/usr/bin/env node
// The bench's telemetry receiver: Claude Code exports OTLP (http/json) to http://127.0.0.1:<port>, and this appends
// each request, as received, to one JSON line: { at, path, body }. Claude Code has no file exporter of its own
// (docs: monitoring-usage), and a collector is more than a bench needs.
//
// usage: node otel-sink.mjs <out.jsonl> [port 4318]
import { createServer } from "node:http";
import { appendFileSync } from "node:fs";
const [out, port = "4318"] = process.argv.slice(2);
if (!out) { console.error("usage: node otel-sink.mjs <out.jsonl> [port]"); process.exit(2); }
createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    let parsed = null; try { parsed = JSON.parse(body); } catch { /* kept as text */ }
    appendFileSync(out, JSON.stringify({ at: Date.now(), path: req.url, body: parsed ?? body }) + "\n");
    res.writeHead(200, { "content-type": "application/json" }); res.end("{}");
  });
}).listen(Number(port), "127.0.0.1", () => console.log(`otel-sink on 127.0.0.1:${port} → ${out}`));
