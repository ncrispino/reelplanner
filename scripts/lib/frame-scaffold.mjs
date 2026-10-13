import { readFileSync, existsSync, mkdirSync, writeFileSync, realpathSync } from 'node:fs';
import { join, resolve, relative, dirname, basename, isAbsolute } from 'node:path';
import { ROOT } from './env.mjs';
import { storyboardFrames } from './terms.mjs';
import { parseHtml, elements, decode } from './frame-html.mjs';
export const layouts = ['record-inference', 'trace', 'paired-options', 'actor-groups', 'assignment-table', 'custom'];
const escape = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const read = p => readFileSync(p,'utf8');
const cssUrls = css => [...css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi)].map(m => m[1] ?? m[2] ?? m[3]);
function local(dir, path) {
  if (!path || /^(?:[a-z]+:|\/\/)/i.test(path)) throw Error(`local asset required: ${path}`);
  const p = resolve(dir,path.split(/[?#]/)[0]);
  if (!existsSync(p)) throw Error(`missing local asset: ${path}; initialize or stage the project assets first`);
  const rel = relative(realpathSync(dir), realpathSync(p));
  if (rel.startsWith('..') || isAbsolute(rel)) throw Error(`asset outside video: ${path}`);
  return p;
}
export function scaffold(dir, number, content) {
  dir = resolve(dir);
  const frame = storyboardFrames(read(join(dir,'STORYBOARD.md'))).find(f => f.index === Number(number));
  if (!frame) throw Error(`no frame ${number} in storyboard`);
  const src = frame.meta.src;
  if (!src || !/\.html$/.test(src)) throw Error('frame needs an HTML src in STORYBOARD.md');
  const file = resolve(dir,src), rel = relative(dir,file);
  if (isAbsolute(src) || rel.startsWith('..')) throw Error('frame src must stay inside the video');
  if (existsSync(file)) throw Error(`refusing to overwrite ${src}; edit and frame-check the existing frame`);
  let ancestor = dirname(file); while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  if (relative(realpathSync(dir),realpathSync(ancestor)).startsWith('..')) throw Error('frame src escapes through a symlink');
  if (!content || typeof content !== 'object') throw Error('content must be a JSON object');
  const { layout, header, groups, conclusionHtml } = content;
  if (!layouts.includes(layout)) throw Error(`layout must be ${layouts.join('|')}`);
  if (typeof header !== 'string' || !header.trim() || typeof conclusionHtml !== 'string' || !conclusionHtml.trim() || !Array.isArray(groups) || !groups.length || groups.some(g => !g || typeof g.label !== 'string' || !g.label.trim() || typeof g.html !== 'string' || !g.html.trim())) throw Error('supply header, populated groups[{label, html}], and conclusionHtml');
  if (['record-inference','paired-options'].includes(layout) && groups.length !== 2) throw Error(`${layout} needs exactly two groups`);
  const frameRules = read(join(dir,'frame.md'));
  const faces = [...frameRules.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);
  if (!faces.length) throw Error('frame.md must contain the project’s local @font-face declarations');
  for (const face of faces) {
    const urls = cssUrls(face);
    if (!urls.length) throw Error('each font face needs a local URL');
    for (const path of urls) local(dir,path);
  }
  local(dir,'assets/vendor/gsap.min.js');
  // Preserve authored HTML, while validating ordinary HTML and CSS resource references.
  for (const html of [...groups.map(g=>g.html),conclusionHtml]) {
    for (const node of elements(parseHtml(html))) {
      const attrs = node.attrs;
      const paths = ['src','href','poster','data-composition-src'].flatMap(k => attrs[k] ? [decode(attrs[k])] : []);
      if (attrs.srcset) paths.push(...decode(attrs.srcset).split(',').map(s=>s.trim().split(/\s+/)[0]));
      if (node.tag === 'object' && attrs.data) paths.push(decode(attrs.data));
      const css = `${node.tag === 'style' ? node.raw : ''} ${attrs.style || ''}`;
      paths.push(...cssUrls(css), ...[...css.matchAll(/@import\s+['"]([^'"]+)['"]/gi)].map(m=>m[1]));
      for (const path of paths) if (!path.startsWith('#')) local(dir,path);
    }
  }
  const families = faces.map(f => /font-family\s*:\s*([^;]+)/.exec(f)?.[1]).filter(Boolean);
  if (!families.length) throw Error('local font declarations need font-family');
  const bodyFont = families.find(f=>/Inter/.test(f)) || families[0], displayFont = families.find(f=>/Garamond/.test(f)) || families[0];
  let audio = null; if (existsSync(join(dir,'audio_meta.json'))) audio = JSON.parse(read(join(dir,'audio_meta.json'))).voices?.find(v=>Number(v.frame) === frame.index);
  // hold-durations writes deliberate holds/tails into the storyboard. Keep that slot,
  // but never cut narration that has since grown longer; this helper adds no new tail.
  const declaredDuration = Number(String(frame.meta.duration || '').replace(/\s*s$/,''));
  const durations = [declaredDuration, Number(audio?.duration_s)].filter(n => Number.isFinite(n) && n > 0);
  if (!durations.length) throw Error('frame needs a positive audio duration or storyboard duration');
  const duration = Math.max(...durations);
  const id = basename(src,'.html'), prefix = `f${frame.index}`;
  const region = (n) => `id="${prefix}-${n}" data-rp-region="${n}"`;
  const group = (g,i,tag='section') => `<${tag} ${region(`group-${i+1}`)} class="${prefix}-group"><h2>${escape(g.label)}</h2>${g.html}</${tag}>`;
  let body;
  if (layout === 'trace') body = `<ol ${region('body')} class="${prefix}-body ${prefix}-trace">${groups.map((g,i)=>group(g,i,'li')).join('\n')}</ol>`;
  else if (layout === 'actor-groups') body = `<dl ${region('body')} class="${prefix}-body ${prefix}-actor-groups">${groups.map((g,i)=>`<div ${region(`group-${i+1}`)} class="${prefix}-group"><dt>${escape(g.label)}</dt><dd>${g.html}</dd></div>`).join('\n')}</dl>`;
  else if (layout === 'assignment-table') body = `<table ${region('body')} class="${prefix}-body ${prefix}-assignment-table"><tbody>${groups.map((g,i)=>`<tr ${region(`group-${i+1}`)} class="${prefix}-group"><th scope="row">${escape(g.label)}</th><td>${g.html}</td></tr>`).join('\n')}</tbody></table>`;
  else body = `<div ${region('body')} class="${prefix}-body ${prefix}-${layout}">${groups.map((g,i)=>group(g,i)).join('\n')}</div>`;
  const css = read(join(ROOT,'templates/reelplanner/theme/scaffolds/flow.css')).replaceAll('.P-',`.${prefix}-`).replaceAll('RP_BODY',bodyFont).replaceAll('RP_DISPLAY',displayFont);
  const html = `<template>\n<style>\n${faces.join('\n')}\n${css}\n</style>\n<div id="root" data-composition-id="${escape(id)}" data-width="1920" data-height="1080" data-duration="${duration}" data-band="bottom">\n<main ${region('content')} class="${prefix}-content">\n<h1 ${region('header')} class="${prefix}-header"${frame.meta.decision || frame.meta.quiz ? ' data-question' : ''}>${escape(header)}</h1>\n${body}\n<footer ${region('conclusion')} class="${prefix}-conclusion">${conclusionHtml}</footer>\n</main></div>\n<script src="assets/vendor/gsap.min.js"></script>\n<script>(function(){var tl=gsap.timeline({paused:true});tl.to({}, {duration:0.001}, ${duration}-0.001);window.__timelines=window.__timelines||{};window.__timelines[${JSON.stringify(id)}]=tl;})();</script>\n</template>\n`;
  mkdirSync(dirname(file),{recursive:true}); writeFileSync(file,html,{flag:'wx'});
  return { file, id, duration, regions:['content','header','body',...groups.map((_,i)=>`group-${i+1}`),'conclusion'] };
}
