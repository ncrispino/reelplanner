#!/usr/bin/env node
// Build the Excalidraw the sketch page runs on, once per machine, into ~/.reelplanner/vendor/excalidraw-<version>/.
//
//   reelplanner vendor-excalidraw [--force]
//
// The sketch page (packages/sketch/, `reelplanner sketch`) is plain HTML with no bundler, as the player is, and
// Excalidraw ships as ES modules that need React. This bundles Excalidraw, React and React DOM into one browser
// script (excalidraw.js, which sets window.ExcalidrawKit), its stylesheet (excalidraw.css) and its fonts (fonts/),
// so the page works offline and nothing is fetched from a CDN. It writes outside this package (the package folder
// is only ever read: under npx it is a cache). `sketch` runs it on first use; --force builds it again.
//
// Needs the optional dependencies @excalidraw/excalidraw, react, react-dom and esbuild (installed with reelplanner
// unless optional dependencies were left out).
import { existsSync, mkdirSync, writeFileSync, cpSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { pkgDir, machineDir, RP_INSTALL } from "./lib/env.mjs";

const NEEDED = ["@excalidraw/excalidraw", "react", "react-dom", "esbuild"];

// Excalidraw's build has no licence header of its own (React's and DOMPurify's are kept, legalComments "eof"), and its
// fonts come with none beside them: the bundle opens with Excalidraw's licence, and fonts/LICENSES.md says each
// font's (read from the fonts themselves, Excalidraw 0.18).
const EXCALIDRAW_LICENSE = `/*! Excalidraw (https://github.com/excalidraw/excalidraw), MIT License

Copyright (c) 2020 Excalidraw

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */`;
const FONT_LICENSES = `# The fonts in this folder

Copied from the @excalidraw/excalidraw npm package, which ships them without licence files. Each one's licence, as its
own name table (or Excalidraw's source, packages/excalidraw/fonts/) states it:

| Font | Licence |
|---|---|
| Excalifont, Virgil, Xiaolai, Nunito, Lilita One, Assistant, Cascadia | SIL Open Font License 1.1 (https://openfontlicense.org) |
| Comic Shanns | MIT |
| Liberation Sans 1.05 | GPL 2 with the font exception |

They are used to draw on this machine; reelplanner does not distribute them.
`;

/** Where this machine's Excalidraw build is, and whether it is there. */
export function excalidrawVendor() {
  const ex = pkgDir("@excalidraw/excalidraw");
  const version = ex ? JSON.parse(readFileSync(join(ex, "package.json"), "utf8")).version : null;
  const dir = join(machineDir(), "vendor", `excalidraw-${version || "missing"}`);
  return { dir, version, ready: !!version && existsSync(join(dir, "excalidraw.js")) && existsSync(join(dir, "excalidraw.css")) && existsSync(join(dir, "fonts", "LICENSES.md")) };
}

/** Build it (or say what is missing). Returns the folder. */
export async function buildExcalidrawVendor({ force = false, log = console.log } = {}) {
  const missing = NEEDED.filter((n) => !pkgDir(n));
  if (missing.length) throw new Error(`missing ${missing.join(", ")}: reinstall reelplanner with its optional dependencies (${RP_INSTALL})`);
  const v = excalidrawVendor();
  if (v.ready && !force) return v.dir;
  rmSync(v.dir, { recursive: true, force: true });
  mkdirSync(v.dir, { recursive: true });
  const ex = pkgDir("@excalidraw/excalidraw");
  const css = join(ex, "dist", "prod", "index.css");
  // the entry imports by absolute path, so the bundle resolves from this package's own node_modules
  const entry = join(v.dir, "entry.mjs");
  writeFileSync(entry, [
    `import React from ${JSON.stringify(pkgDir("react"))};`,
    `import { createRoot } from ${JSON.stringify(join(pkgDir("react-dom"), "client.js"))};`,
    `import { Excalidraw, exportToBlob, serializeAsJSON, convertToExcalidrawElements, CaptureUpdateAction } from ${JSON.stringify(join(ex, "dist", "prod", "index.js"))};`,
    `window.ExcalidrawKit = { React, createRoot, Excalidraw, exportToBlob, serializeAsJSON, convertToExcalidrawElements, CaptureUpdateAction, version: ${JSON.stringify(v.version)} };`,
  ].join("\n"));
  const esbuild = await import(pathToFileURL(join(pkgDir("esbuild"), "lib", "main.js")).href);
  log(`· bundling Excalidraw ${v.version} with React (a few seconds, once) …`);
  await esbuild.build({ entryPoints: [entry], bundle: true, minify: true, format: "iife", outfile: join(v.dir, "excalidraw.js"),
    define: { "process.env.NODE_ENV": '"production"' }, logLevel: "error", legalComments: "eof", banner: { js: EXCALIDRAW_LICENSE } });
  cpSync(css, join(v.dir, "excalidraw.css"));
  cpSync(join(ex, "dist", "prod", "fonts"), join(v.dir, "fonts"), { recursive: true });
  writeFileSync(join(v.dir, "fonts", "LICENSES.md"), FONT_LICENSES);
  rmSync(entry, { force: true });
  log(`✓ Excalidraw ${v.version} → ${v.dir}`);
  return v.dir;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildExcalidrawVendor({ force: process.argv.includes("--force") }).catch((e) => { console.error(`✗ vendor-excalidraw: ${e.message}`); process.exit(1); });
}
