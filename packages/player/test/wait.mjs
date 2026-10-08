// What the player specs wait on: the state they wait for, never a fixed time. A loaded machine (the full run, specs
// side by side, often with other work on it) outlasts any fixed wait, and a spec that slept 300 ms and then looked
// failed there for no fault of the player. The player specs share them from here (group and answer-on-frame bind
// them to their own page). `p` is a Playwright page with a <reelplanning-player id="rp"> on it.
//
// until: wait for a state; the check after it says whether it came (a wait that times out returns null and does not
// throw, so a check that fails says what it saw, not "timeout").
export const until = (p, f, a, timeout = 20000) => p.waitForFunction(f, a, { timeout, polling: 50 }).catch(() => null);
// the value of f(a) at the moment it is first truthy (a time read as the video goes on, not a moment later)
export const when = async (p, f, a, timeout = 20000) => { const h = await until(p, f, a, timeout); return h ? h.jsonValue() : null; };
// n frames drawn: what a state change lays out has been laid out
export const frames = (p, n = 2) => p.evaluate((n) => new Promise((r) => { const f = (k) => (k ? requestAnimationFrame(() => f(k - 1)) : r()); f(n); }), n);
// a seek landed: the video's time is where it was sent
export const seeked = (p, t) => until(p, (t) => Math.abs(document.querySelector("#rp").player.currentTime - t) < 0.1, t);
// what waits is this question (or nothing, for null)
export const pendingIs = (p, id) => until(p, (id) => (document.querySelector("#rp").pendingId() || null) === id, id);
// a question is up: it is what waits, and its sheet is on
export const asked = (p, id = null) => until(p, (id) => { const el = document.querySelector("#rp"); return (id ? el.pendingId() === id : !!el.pendingId()) && el.shadowRoot.querySelector(".decision").classList.contains("on"); }, id);
// what the page has drawn for a question is final: the frame looked at again after it was asked (recheckCards; _cardsT
// is 0 once that is done), the page's faces loaded (chips and whys are measured in them), and two frames drawn since
export const settled = async (p) => { await until(p, () => !document.querySelector("#rp")._cardsT && document.fonts.status === "loaded"); await frames(p); };
// the video is playing, its time moving past t0 (read before the play was sent: a pause sent while a play is still on
// its way into the frame's page is overtaken by it, and the video runs on under what comes next)
export const movedOn = (p, t0, by = 0.05) => until(p, ([t0, by]) => { const el = document.querySelector("#rp"); return !el.player.paused && el.player.currentTime > t0 + by; }, [t0, by]);
export const now = (p) => p.evaluate(() => document.querySelector("#rp").player.currentTime);
// the video stopped and still: paused, its time the same over five looks (a play still on its way lands first)
export const still = (p) => until(p, () => { const pl = document.querySelector("#rp").player, w = (window.__rpStill ||= { t: null, n: 0 });
  if (!pl.paused || pl.currentTime !== w.t) { w.t = pl.currentTime; w.n = 0; return false; } return ++w.n >= 5; }).then(() => p.evaluate(() => { delete window.__rpStill; }));
// a hold: this many ms by the page's own clock (a "nothing happens for a while" check, or a timer of the page's own
// that has to run out: the page's clock is what its timers keep, and a starved page's runs behind the test's)
export const pageHold = async (p, ms) => { const t0 = await p.evaluate(() => performance.now()); await until(p, ([t0, ms]) => performance.now() - t0 >= ms, [t0, ms], ms + 60000); };
// an answered question's countdown ("Continues in N s", one a second by the page's own timer) has run out and taken
// the sheet down: true, or false if the count stopped (held, or stuck) for a whole wait. Each step waits for the next
// number, not the whole count at once: a starved page's one-second timer runs late, and ten of them late outran a
// fixed 13 s wait on a loaded machine; a count that goes on is never cut off, and one that stops still fails.
export const countedDown = async (p) => {
  for (let last = -1; ;) {
    const s = await when(p, (last) => { const box = document.querySelector("#rp").shadowRoot.querySelector(".decision");
      if (!box.classList.contains("on")) return { done: true };
      const m = /Continues in (\d+) s/.exec(box.querySelector(".hint")?.textContent || ""); return !!m && +m[1] !== last && { n: +m[1] }; }, last);
    if (!s) return false;
    if (s.done) return true;
    last = s.n;
  }
};
// the layout has come to rest: no transition or finite animation running on the page or in the player (an endless
// one, a pulse, never ends and is not a move), and the boxes of these parts of the player (selectors in its shadow
// root; the guide's frame under it too, when there is one) the same over five looks in a row. A layout that is still
// moving (a size change, the guide taking its room, the small player sliding in) is measured once it has stopped.
export const laidOut = (p, sels = [".stage", ".transport", ".scrub", ".nowline", ".minibar"]) => until(p, (sels) => {
  const el = document.querySelector("#rp"), R = el.shadowRoot, w = (window.__rpLaid ||= { k: null, n: 0 });
  const moving = [...document.getAnimations(), ...R.getAnimations()].some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity);
  const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round).join(); };
  const k = moving ? null : [...sels.map((q) => box(R.querySelector(q))), box(document.querySelector("#rp-guide")?.shadowRoot?.querySelector("iframe"))].join("|");
  if (k === null || k !== w.k) { w.k = k; w.n = 0; return false; }
  return ++w.n >= 5; }, sels).then((h) => p.evaluate(() => { delete window.__rpLaid; }).then(() => h));
// a node-side state (what a server was sent)
export const nodeUntil = async (f, timeout = 20000) => { const end = Date.now() + timeout; while (!f() && Date.now() < end) await new Promise((r) => setTimeout(r, 50)); };
// the player loaded: its video ready, its plan map read (and what was saved for it), and drawn
export const loaded = async (p, timeout = 90000) => {
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap && el._mapTried && el.stage?.dataset.ready; }, null, { timeout });
  await frames(p);
};
// what was just done has been handled: the work a handler queued for right after (a zero-delay timer: the words box
// a mark opens on pointerup) has run, and two frames been drawn since. For a key or a click whose effect is the
// page's own at once, with no state of its own to wait for.
export const flush = (p) => p.evaluate(() => new Promise((r) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(() => r())), 0)));
