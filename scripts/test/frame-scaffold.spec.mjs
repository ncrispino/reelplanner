import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
import { ROOT, launchOpts } from '../lib/env.mjs';
import { scaffold, layouts } from '../lib/frame-scaffold.mjs';
import { regionAdvice, layoutCheck } from '../lib/frame-layout.mjs';
import { storyboardFrames } from '../lib/terms.mjs';
const dir = mkdtempSync(join(tmpdir(),'rp-scaffold-'));
let browser;
const check = (name, fn) => { fn(); console.log(`✓ ${name}`); };
try {
  cpSync(join(ROOT,'videos/l2-upload-resume/assets'),join(dir,'assets'),{recursive:true});
  const font = '@font-face { font-family:"Inter"; src:url("assets/fonts/Inter-400.woff2"); font-weight:400; }';
  writeFileSync(join(dir,'frame.md'),font);
  const storyboard = "# Storyboard\n\n" + layouts.map((layout,i)=>`## Frame ${i+1} — ${layout}\n- src: compositions/frames/0${i+1}-${layout}.html\n- duration: 4\n- scene: populated explanation\n`).join('\n');
  writeFileSync(join(dir,'STORYBOARD.md'),storyboard);
  const content = layout => ({layout,header:'Count repeated identities',groups:[{label:'Record',html:'<p data-artifact="record">X / X / Y</p>'},{label:'Inference',html:`<div id="f${layouts.indexOf(layout)+1}-evidence" data-option="a" data-call="a1" data-detail="counts" data-gloss="actor"><p>Repeated X retains one actor identity.</p></div>`}],conclusionHtml:'<p>Three occurrences; two actors.</p>'});
  const generated = layouts.map((l,i)=>scaffold(dir,i+1,content(l)));
  check('all five relationships and custom preserve identity, local assets and native marks',()=> {
    for (const [i,r] of generated.entries()) {
      const html = readFileSync(r.file,'utf8');
      assert.equal(r.id,`0${i+1}-${layouts[i]}`); assert.equal(r.duration,4);
      for (const mark of ['data-option="a"','data-call="a1"','data-detail="counts"','data-artifact="record"','data-gloss="actor"']) assert.ok(html.includes(mark));
      assert.ok(html.includes(font)); assert.ok(html.includes('data-band="bottom"')); assert.equal((html.match(/gsap.timeline/g)||[]).length,1);
    }
    assert.match(readFileSync(generated[1].file,'utf8'),/<ol .*data-rp-region="body"/);
    assert.match(readFileSync(generated[3].file,'utf8'),/<dl .*data-rp-region="body"/);
    assert.match(readFileSync(generated[4].file,'utf8'),/<table .*data-rp-region="body"/);
  });
  check('existing frame is never overwritten',()=>assert.throws(()=>scaffold(dir,1,content(layouts[0])),/overwrite/));
  const first = generated[0].file, original = readFileSync(first,'utf8'); rmSync(first);
  writeFileSync(join(dir,'frame.md'),font.replace('Inter-400','missing'));
  check('missing font refuses before writing',()=>{assert.throws(()=>scaffold(dir,1,content(layouts[0])));assert.ok(!existsSync(first));});
  writeFileSync(join(dir,'frame.md'),font);
  const gsapPath = join(dir,'assets/vendor/gsap.min.js'), gsap = readFileSync(gsapPath); rmSync(gsapPath);
  check('missing local GSAP refuses before writing',()=>{assert.throws(()=>scaffold(dir,1,content(layouts[0])),/missing local asset/);assert.ok(!existsSync(first));});
  writeFileSync(gsapPath,gsap);
  check('remote fonts and missing authored assets refuse before writing',()=>{
    writeFileSync(join(dir,'frame.md'),font.replace('assets/fonts/Inter-400.woff2','https://example.com/font.woff2'));
    assert.throws(()=>scaffold(dir,1,content(layouts[0])),/local asset required/);
    writeFileSync(join(dir,'frame.md'),font);
    for (const html of ['<img src="assets/missing.png">','<img src=assets/missing.png>','<div style="background-image:url(assets/missing.png)">record</div>','<img srcset="assets/missing.png 2x">']) {
      const c=content(layouts[0]); c.groups[0].html=html;
      assert.throws(()=>scaffold(dir,1,c),/missing local asset/);assert.ok(!existsSync(first));
    }
  });
  writeFileSync(join(dir,'STORYBOARD.md'),storyboard.replace('- duration: 4','- duration: 4\n- decision: q1'));
  writeFileSync(join(dir,'audio_meta.json'),JSON.stringify({voices:[{frame:1,duration_s:5.75}]}));
  check('audio duration takes precedence',()=>assert.equal(scaffold(dir,1,content(layouts[0])).duration,5.75));
  assert.match(readFileSync(first,'utf8'), /data-question/);
  writeFileSync(first,original);
  check('region advice preserves ambiguous selectors without invented region',()=>{
    const html='<main data-rp-region="body"><p class="same">one</p><p class="same">two</p><p id="unique">three</p></main>';
    assert.deepEqual(regionAdvice(html,{code:'container_overflow',selector:'.same'},1),{});
    assert.deepEqual(regionAdvice(html,{code:'container_overflow',selector:'.other #unique'},1),{});
    assert.equal(regionAdvice(html,{code:'container_overflow',selector:'#unique',sourceFile:'frame.html'},1).region,'body');
    assert.equal(regionAdvice(html,{code:'container_overflow',selector:'main > p:nth-of-type(2)',sourceFile:'frame.html'},1).region,'body');
    assert.deepEqual(regionAdvice(html,{code:'container_overflow',selector:'section > p:nth-of-type(2)'},1),{});
  });
  browser = await chromium.launch(launchOpts());
  const page = await browser.newPage({viewport:{width:1920,height:1080}});
  for (const [i,r] of generated.entries()) {
    const html = readFileSync(r.file,'utf8').replace(/<\/?template>/g,'').replace(/<script[\s\S]*?<\/script>/g,'');
    writeFileSync(join(dir,'mounted.html'),`<style>html,body{margin:0;width:100%;height:100%;--rp-paper:#faf9f5;--rp-ink:#141413}</style>${html}`);
    await page.goto(new URL('file://' + join(dir,'mounted.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    assert.ok(await page.evaluate(()=>document.fonts.check('32px Inter')));
    const before = await page.locator('[data-rp-region="conclusion"]').boundingBox();
    await page.locator('[id$="-evidence"]').evaluate(el=>el.innerHTML += '<p>Hypothetical: opportunities are unknown, so this record cannot establish a rate.</p>'.repeat(3));
    const grown = await page.locator('[data-rp-region="conclusion"]').boundingBox();
    const body = await page.locator('[data-rp-region="body"]').boundingBox();
    if (i === 0) {
      await page.locator('[data-rp-region="conclusion"]').evaluate((el,y)=>{el.style.position='absolute';el.style.top=y+'px';}, before.y);
      const fixed = await page.locator('[data-rp-region="conclusion"]').boundingBox();
      check('fixed-position regression: growing qualifier covers the old conclusion position',()=>assert.ok(fixed.y < body.y+body.height));
      await page.locator('[data-rp-region="conclusion"]').evaluate(el=>el.removeAttribute('style'));
    }
    check(`${layouts[i]}: qualifier moves conclusion, remains above captions without covering body`,()=>{
      assert.ok(grown.y > before.y, JSON.stringify({before,grown,body}));assert.ok(grown.y >= body.y+body.height);assert.ok(grown.y+grown.height <= 900);
    });
    await page.locator('[id$="-evidence"]').evaluate(el=>el.innerHTML += '<p>Retain every qualification about unknown opportunities and repeated identities.</p>'.repeat(25));
    const over = await page.locator('[data-rp-region="conclusion"]').boundingBox();
    check(`${layouts[i]}: overfull evidence remains in normal flow, never clipped or shrunk`,()=>assert.ok(over.y>900));
    // Actual pinned checker sees the populated overfull form, not a synthetic finding.
    writeFileSync(r.file,readFileSync(r.file,'utf8').replace('Repeated X retains one actor identity.','Repeated X retains one actor identity. '+('Opportunities are unknown; retain this qualification. '.repeat(95))));
  }
  await browser.close(); browser=null; rmSync(join(dir,'mounted.html')); 
  const tokens=readFileSync(join(ROOT,'templates/reelplanner/theme/tokens.html'),'utf8');
  writeFileSync(join(dir,'index.html'),`<!doctype html><html><head>${tokens}<style>html,body{margin:0;width:100%;height:100%;}#root{position:relative;width:100%;height:100%;overflow:hidden}</style></head><body><div id="root" data-composition-id="test" data-width="1920" data-height="1080" data-duration="24">${generated.map((r,i)=>`<div id="slot-${i+1}" class="clip" data-composition-id="${r.id}" data-composition-src="compositions/frames/${r.id}.html" data-start="${i*4}" data-duration="4" data-track-index="0"></div>`).join('')}</div><script src="assets/vendor/gsap.min.js"></script><script>window.__timelines=window.__timelines||{};window.__timelines["test"]=gsap.timeline({paused:true}).to({}, {duration:24});</script></body></html>`);
  const findings=layoutCheck(dir,storyboardFrames(storyboard));
  check('pinned browser checked all three moments per populated form',()=>assert.ok(findings.ran,JSON.stringify(findings)));
  for (const [i,layout] of layouts.entries()) check(`${layout}: actual overflow finding has named source and region`,()=>{
    const all=[...findings.byFrame.get(i+1).errors,...findings.byFrame.get(i+1).warnings];
    assert.ok(all.some(x=>x.region && x.sourceFile && x.fitAdvice),JSON.stringify(all).slice(0,1600));
  });
  console.log('✓ frame-scaffold');
} finally { await browser?.close(); rmSync(dir,{recursive:true,force:true}); }
