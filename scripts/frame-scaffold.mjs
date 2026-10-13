#!/usr/bin/env node
// Optional populated native frame; authors edit the generated file thereafter.
// usage: reelplanner frame-scaffold <video-dir> <frame> --content <json>
import { readFileSync } from 'node:fs';
import { shellQuote } from './lib/env.mjs';
import { scaffold } from './lib/frame-scaffold.mjs';
const args = process.argv.slice(2);
try {
  if (args.length !== 4 || !/^\d+$/.test(args[1]) || args[2] !== '--content') throw Error('usage: reelplanner frame-scaffold <video-dir> <frame> --content <json>');
  const result = scaffold(args[0],args[1],JSON.parse(readFileSync(args[3],'utf8')));
  console.log(`✓ ${result.file}\ncomposition ID: ${result.id}; duration: ${result.duration}s\nregions: ${result.regions.join(', ')}\nNext: reelplanner frame-check ${shellQuote(args[0])} ${args[1]} (assemble first; inspect the picture and address overflow)`);
} catch(e) { console.error(`✗ frame-scaffold: ${e.message}`); process.exitCode=1; }
