// Pictures for the sketch page ("Picture" on the page, or saying "find a picture of …"): found on Wikimedia Commons,
// or made by an image model. Either way it lands on the canvas as a picture the person placed, and sketch.md says
// where it came from: a found one by its file, licence and author (Commons files are free to reuse under the licence
// they name), a made one by the model and the words it was made from.
//
//   searchCommons(q)     the best few Commons files for the words: a thumbnail to choose by and a 640 px one to place
//   fetchPicture(url)    one of those, as a data URL (Commons hosts only: the page asks the server, which asks Commons)
//   makePicture(prompt)  one picture from an image model through OpenRouter (OPENROUTER_API_KEY); 2-10 s, a few cents
//
// Search needs no key. REELPLANNER_SKETCH_COMMONS_URL points the search elsewhere (a test's stand-in);
// REELPLANNER_SKETCH_IMAGE_MODEL picks the image model.
import { OPENROUTER } from "./sketch-partner.mjs";

export const COMMONS = "https://commons.wikimedia.org/w/api.php";
// chosen by trying it: a clean single-object picture in about 2.5 s for about $0.03 (the larger flash model took 9 s
// for twice that, and looked no better on a whiteboard)
export const IMAGE_MODEL = "google/gemini-3.1-flash-lite-image";
const UA = "reelplanner-sketch (https://github.com/ncrispino/reelplanner)";
const plain = (html) => String(html || "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function getJson(url, { timeoutMs = 15000, ...init } = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: ctl.signal, headers: { "user-agent": UA, ...(init.headers || {}) } });
    const j = await r.json().catch(() => null);
    if (!r.ok) throw new Error(`${r.status} ${j?.error?.message || j?.error?.info || r.statusText}`);
    return j;
  } catch (e) { throw e.name === "AbortError" ? new Error(`no answer in ${timeoutMs / 1000} s`) : e; }
  finally { clearTimeout(timer); }
}

/** → [{ name, thumb, url, mime, license, author, page }], best match first (pictures only: no audio, video or PDF). */
export async function searchCommons(q, { base = process.env.REELPLANNER_SKETCH_COMMONS_URL || COMMONS, limit = 8 } = {}) {
  q = String(q || "").trim(); if (!q) return [];
  const u = new URL(base);
  for (const [k, v] of Object.entries({ action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: `${q} filetype:bitmap|drawing`,
    gsrlimit: String(limit), prop: "imageinfo", iiprop: "url|mime|extmetadata", iiurlwidth: "640", origin: "*" })) u.searchParams.set(k, v);
  const j = await getJson(u);
  return Object.values(j?.query?.pages || {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map((p) => {
    const ii = p.imageinfo?.[0] || {}, m = ii.extmetadata || {};
    return { name: p.title.replace(/^File:/, ""), thumb: ii.thumburl || ii.url, url: ii.thumburl || ii.url, mime: ii.mime,
      license: plain(m.LicenseShortName?.value) || null, author: plain(m.Artist?.value).slice(0, 120) || null, page: ii.descriptionurl || null };
  }).filter((x) => x.url && /^image\//.test(x.mime || ""));
}

/** A Commons picture as a data URL; anything but a Commons host (or the test's stand-in) is refused. */
export async function fetchPicture(url, { base = process.env.REELPLANNER_SKETCH_COMMONS_URL || COMMONS } = {}) {
  const u = new URL(url), ok = /(^|\.)wikimedia\.org$/.test(u.hostname) || u.host === new URL(base).host;
  if (!ok || !/^https?:$/.test(u.protocol)) throw new Error("only pictures from Wikimedia Commons are fetched");
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(u, { signal: ctl.signal, headers: { "user-agent": UA } });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    const mime = (r.headers.get("content-type") || "image/png").split(";")[0], buf = Buffer.from(await r.arrayBuffer());
    if (!/^image\//.test(mime)) throw new Error(`not a picture (${mime})`);
    if (buf.length > 4e6) throw new Error("larger than 4 MB");
    return { dataUrl: `data:${mime};base64,${buf.toString("base64")}`, mime };
  } finally { clearTimeout(timer); }
}

/** One picture from an image model. → { dataUrl, mime, model } */
export async function makePicture(prompt, { key = process.env.OPENROUTER_API_KEY, base = process.env.REELPLANNER_SKETCH_BASE_URL || OPENROUTER,
  model = process.env.REELPLANNER_SKETCH_IMAGE_MODEL || IMAGE_MODEL } = {}) {
  if (!key) throw new Error("making a picture needs OPENROUTER_API_KEY");
  const ask = `A simple picture of: ${String(prompt).trim()}. One subject, centred, on a plain white background. No frame, no border, no whiteboard, no text or letters. Clean flat line-art, so it sits well beside hand-drawn boxes and arrows.`;
  const j = await getJson(`${base.replace(/\/+$/, "")}/chat/completions`, { timeoutMs: 60000, method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}`, "x-title": "reelplanner sketch", "http-referer": "https://github.com/ncrispino/reelplanner" },
    body: JSON.stringify({ model, modalities: ["image", "text"], messages: [{ role: "user", content: ask }] }) });
  const url = j?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url || !url.startsWith("data:image/")) throw new Error(`${model} made no picture`);
  return { dataUrl: url, mime: url.slice(5, url.indexOf(";")), model };
}
