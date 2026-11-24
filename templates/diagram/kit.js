/* The diagram kit's moves. `reelplanner diagram` writes the world's markup into every frame (each actor's area,
   name, cursor, item, destination slot with its lock and its states; the shared area; the arrows of who can deliver
   to whom, with their words) and copies this file to assets/diagram/kit.js. A frame makes
   `var K = DiagramKit(root, tl, G, DUR)` and its scene calls K's moves at the seconds its words are said
   (`@@a spoken phrase@@`, resolved by `reelplanner diagram`).

   Two layouts: "row" (the actors' areas side by side over the shared area, each slot on it) and "ring" (each actor
   with its own slot, the arrows of who can deliver to whom between them). K.start(state) sets where a frame begins,
   K.move(layout, t) carries everything from one to the other.

   Every tween is on a transform, opacity, clip-path or a stroke, and nothing reads the clock or a random number, so
   a frame is the same each time it is sought. Two rules the kit keeps for you: no tween on `visibility` (a rewind
   writes back an inline "visible" that shows through a scene the player has hidden; a faded thing is moved off the
   frame instead), and `immediateRender: false` on a fromTo that is not an element's first appearance. */
(function () {
  "use strict";
  function DiagramKit(root, tl, G, DUR) {
    var K = {}, q = function (s) { return root.querySelector(s); }, qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var A = G.actors.map(function (a) { return a.id; });
    var ROW = A.length === 2 ? [560, 1360] : [360, 960, 1560];
    var RING = A.length === 2 ? [[520, 420], [1400, 420]] : [[960, 215], [380, 700], [1540, 700]];
    function pos(layout, a) {
      var k = A.indexOf(a);
      if (layout === "row") { var x = ROW[k]; return { area: [x - 290, 120], name: [x - 262, 150], cursor: [x - 262, 222], item: [x - 262, 290], slot: [x - 270, 540], ping: [x + 222, 558] }; }
      var c = RING[k]; return { area: [c[0] - 290, c[1] - 150], name: [c[0] - 262, c[1] - 124], cursor: [c[0] - 262, c[1] - 60], item: [c[0] - 20, c[1] - 140], slot: [c[0] - 270, c[1] - 10], ping: [c[0] + 222, c[1] + 8] };
    }
    K.pos = pos; K.actors = A; K.layout = "row";
    function el(part, a) { return q('[data-' + part + '="' + a + '"]'); }
    K.el = el;
    var parts = ["area", "name", "cursor", "item", "slot", "ping"];

    /* where a frame begins: { layout, areas, names, cursors, items: "held" | "none", shared, enclosure, slots,
       locks, arrows, head }. It must be exactly where the scene before it ended: a difference is a jolt at the cut */
    K.start = function (s) {
      K.layout = s.layout || "row";
      A.forEach(function (a) {
        var p = pos(K.layout, a);
        parts.forEach(function (n) { gsap.set(el(n, a), { x: p[n][0], y: p[n][1] }); });
        gsap.set(el("area", a), { opacity: s.areas ? 1 : 0 }); gsap.set(el("area", a).querySelector(".dk-arealab"), { opacity: K.layout === "row" ? 1 : 0 });
        gsap.set(el("name", a), { opacity: s.names ? 1 : 0 });
        gsap.set(el("cursor", a), { opacity: s.cursors && K.layout === "row" ? 1 : 0 });
        gsap.set(el("item", a), { opacity: s.items === "held" ? 1 : 0 }); gsap.set(el("slot", a), { opacity: s.slots ? 1 : 0 });
        gsap.set(q('[data-lock="' + a + '"]'), { opacity: s.locks ? 1 : 0 }); gsap.set(q('[data-locked="' + a + '"]'), { opacity: s.locks ? 1 : 0 });
        gsap.set(qa('[data-state^="' + a + ':"]'), { opacity: 0 }); gsap.set(q('[data-state="' + a + ":" + G.first + '"]'), { opacity: s.slots ? 1 : 0 });
      });
      gsap.set(q(".dk-shared"), { x: 70, y: 470, opacity: s.shared && K.layout === "row" ? 1 : 0 }); gsap.set(q(".dk-enclosure"), { opacity: s.enclosure && K.layout === "row" ? 1 : 0 });
      qa(".dk-arrow").forEach(function (e) { gsap.set(e.querySelector("path.l"), { strokeDasharray: e.dataset.len, strokeDashoffset: s.arrows ? 0 : e.dataset.len }); gsap.set(e.querySelector("polygon"), { opacity: s.arrows ? 1 : 0 }); });
      if (s.head) gsap.set(q('[data-head="' + s.head + '"]'), { opacity: 1 });
      /* no ambient motion of the whole picture: a transform that grows through a scene snaps back at the next cut,
         a jolt every scene. A frame begins exactly where the one before it ended */
    };
    /* carry everything to the other layout */
    K.move = function (layout, t, d) {
      d = d || 1.4; K.layout = layout;
      A.forEach(function (a, k) {
        var p = pos(layout, a);
        parts.forEach(function (n) { tl.to(el(n, a), { x: p[n][0], y: p[n][1], duration: d, ease: "power3.inOut" }, t + k * 0.08); });
        if (layout === "ring") tl.to(el("cursor", a), { opacity: 0, duration: 0.4 }, t);
        tl.to(el("area", a).querySelector(".dk-arealab"), { opacity: layout === "row" ? 1 : 0, duration: 0.3 }, t);
      });
      tl.to([q(".dk-shared"), q(".dk-enclosure")], { opacity: layout === "row" ? 1 : 0, duration: 0.6 }, t + (layout === "row" ? d - 0.4 : 0));
    };
    /* the time a move may start without undoing one still running: K.move(…, K.after(@@phrase@@, bounceStart + 1.3)) */
    K.after = function () { return Math.max.apply(null, arguments); };

    /* a thing arrives: it fades in and rises a little (or pops) */
    K.show = function (sel, t, o) {
      o = o || {}; qa(sel).forEach(function (e, k) {
        var at = t + k * (o.stagger || 0);
        if (o.pop) tl.fromTo(e, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }, at);
        else tl.fromTo(e, { opacity: 0, y: "+=18" }, { opacity: 1, y: "-=18", duration: 0.5, ease: "power2.out", immediateRender: false }, at);
      });
    };
    K.hide = function (sel, t, d) { tl.to(qa(sel), { opacity: 0, duration: d || 0.4 }, t); };
    K.dim = function (sel, t, to) { tl.to(qa(sel), { opacity: to == null ? 0.22 : to, duration: 0.5 }, t); };
    K.pulse = function (sel, t, n) { tl.to(qa(sel), { scale: 1.06, duration: 0.18, repeat: (n || 1) * 2 - 1, yoyo: true, ease: "sine.inOut" }, t); };
    /* exact words revealed line by line */
    K.type = function (sel, t, d) { var e = q(sel); tl.set(e, { opacity: 1 }, t); tl.fromTo(e, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: d || 1.2, ease: "steps(" + Math.max(1, Math.round((e.offsetHeight || 130) / 43)) + ")", immediateRender: false }, t); };

    /* the head of a scene arrives; K.unhead fades the one before and moves it off the frame (the layout check counts
       what is there, and `visibility` is never animated) */
    K.head = function (key, t) { tl.fromTo(q('[data-head="' + key + '"]'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); };
    K.unhead = function (key, t) { var e = q('[data-head="' + key + '"]'); tl.to(e, { opacity: 0, x: 16, duration: 0.25 }, t); tl.set(e, { x: -4000 }, t + 0.26); };

    /* an actor's own pieces: its area and name; a cursor that blinks while it waits */
    K.actor = function (a, t) { K.show('[data-area="' + a + '"]', t); K.show('[data-name="' + a + '"]', t + 0.2); };
    K.cursor = function (a, t) {
      var e = el("cursor", a), cur = e.querySelector("b"); tl.to(e, { opacity: 1, duration: 0.3 }, t);
      tl.fromTo(cur, { opacity: 1 }, { opacity: 0, duration: 0.45, repeat: Math.max(1, Math.floor((DUR - t) / 0.45) - 1), yoyo: true, ease: "steps(1)", immediateRender: false }, t + 0.3);
    };
    /* the item is made: the sheet appears and its lines draw */
    K.write = function (a, t) {
      var d = el("item", a); tl.fromTo(d, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, t);
      tl.fromTo(d.querySelectorAll(".dk-sheet i"), { scaleX: 0 }, { scaleX: 1, duration: 0.18, stagger: 0.12, ease: "power1.out", immediateRender: false }, t + 0.25);
    };
    /* a slot arrives with its first state */
    K.slot = function (a, t) { K.show('[data-slot="' + a + '"]', t); tl.to(q('[data-state="' + a + ":" + G.first + '"]'), { opacity: 1, duration: 0.3 }, t + 0.3); };
    /* the lock snaps shut on a slot (and its words say who it is locked to); opens; closes */
    K.lock = function (a, t) {
      var l = q('[data-lock="' + a + '"]');
      tl.fromTo(l, { opacity: 0, y: -60, scale: 2.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power4.in", immediateRender: false }, t);
      tl.to(q('[data-locked="' + a + '"]'), { opacity: 1, duration: 0.4 }, t + 0.4); tl.to(el("slot", a), { x: "+=6", duration: 0.05, repeat: 3, yoyo: true }, t + 0.35);
    };
    K.unlock = function (a, t) { tl.to(q('[data-lock="' + a + '"] .sh'), { rotation: -38, y: -4, duration: 0.4, ease: "back.out(2)" }, t); };
    K.relock = function (a, t) { tl.to(q('[data-lock="' + a + '"] .sh'), { rotation: 0, y: 0, duration: 0.3 }, t); };
    /* the item drops toward its own slot and the lock stops it. Takes 1.25 s: a K.move must not start before it
       ends (K.after), or the return tween pulls the item back to the old layout */
    K.bounce = function (a, t) {
      var d = el("item", a), f = pos(K.layout, a).slot, h = pos(K.layout, a).item, l = q('[data-lock="' + a + '"]');
      tl.to(d, { x: f[0] + 300, y: f[1] - 50, duration: 0.5, ease: "power2.in" }, t)
        .to(l, { x: 6, duration: 0.05, repeat: 7, yoyo: true, ease: "none" }, t + 0.5).to(l, { x: 0, duration: 0.05 }, t + 0.9)
        .to(d, { x: h[0], y: h[1], duration: 0.7, ease: "back.out(1.4)" }, t + 0.55);
    };
    /* the slot's words change (a state from world.json) */
    K.state = function (a, key, t) { tl.to(qa('[data-state^="' + a + ':"]'), { opacity: 0, duration: 0.25 }, t); tl.to(q('[data-state="' + a + ":" + key + '"]'), { opacity: 1, duration: 0.35 }, t + 0.25); };

    /* who can deliver to whom: an arrow draws; its words; one lit for a moment; each in turn */
    function arrow(f, to) { return q('[data-arrow="' + f + ">" + to + '"]'); }
    K.arrow = function (f, to, t) {
      var e = arrow(f, to); tl.to(e.querySelector("path.l"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, t);
      tl.to(e.querySelector("polygon"), { opacity: 1, duration: 0.2 }, t + 0.8);
      K.pulse('[data-slot="' + to + '"]', t + 0.8, 1);   /* the slot it reaches answers: a thin line alone barely changes the picture */
    };
    K.words = function (f, to, t, out) { var w = q('[data-words="' + f + ">" + to + '"]'); tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t); if (out != null) tl.to(w, { opacity: 0, duration: 0.4 }, out); };
    K.glow = function (f, to, t) { var l = arrow(f, to).querySelector("path.l"); tl.to(l, { strokeWidth: 10, duration: 0.35, ease: "power2.out" }, t).to(l, { strokeWidth: 5, duration: 0.6, ease: "power2.inOut" }, t + 0.6); };
    K.ring = function (t, gap) { gap = gap || 0.9; G.arrows.forEach(function (e, k) { K.glow(e.from, e.to, t + k * gap); }); };
    /* dots run along an arrow from t0 to t1: only while something travels it, never as decoration */
    K.flow = function (t0, t1, only) {
      (only ? [only] : qa(".dk-arrow")).forEach(function (e) {
        var pts = JSON.parse(e.dataset.pts), dots = e.querySelectorAll("circle"), per = 1.8;
        Array.prototype.forEach.call(dots, function (c, k) {
          var start = t0 + k * per / dots.length, n = Math.max(0, Math.floor((t1 - start) / per));
          if (!n) return;
          tl.set(c, { opacity: 0.9 }, start);
          tl.fromTo(c, { attr: { cx: pts[0][0], cy: pts[0][1] } }, { keyframes: pts.slice(1).map(function (p) { return { attr: { cx: p[0], cy: p[1] }, duration: per / (pts.length - 1), ease: "none" }; }), repeat: n - 1, immediateRender: false }, start);
          tl.set(c, { opacity: 0 }, start + n * per);
        });
      });
    };
    /* `f` delivers `to`'s item: a copy runs along f's arrow into to's slot, which pulses on arrival */
    K.carry = function (f, to, t, d) {
      d = d || 2.2; var e = arrow(f, to), pts = JSON.parse(e.dataset.pts), g = q('[data-copy="' + to + '"]'), fp = pos(K.layout, to).slot;
      tl.to(e.querySelector("path.l"), { strokeWidth: 9, duration: 0.3 }, t); K.flow(t, t + d + 1.9, e);
      tl.set(g, { x: pts[0][0] - 29, y: pts[0][1] - 37, opacity: 1, scale: 0.8 }, t);
      tl.to(g, { keyframes: pts.slice(1).map(function (p) { return { x: p[0] - 29, y: p[1] - 37, duration: d * 0.7 / (pts.length - 1), ease: "none" }; }) }, t + 0.1);
      tl.to(g, { x: fp[0] + 466, y: fp[1] + 48, scale: 0.7, duration: d * 0.3, ease: "power2.out" }, t + 0.1 + d * 0.7);   /* at the slot's right end, clear of its name */
      tl.to(e.querySelector("path.l"), { strokeWidth: 5, duration: 0.3 }, t + d);
      K.pulse('[data-slot="' + to + '"]', t + d, 1);
    };
    K.uncarry = function (to, t) { tl.to(q('[data-copy="' + to + '"]'), { opacity: 0, duration: 0.4 }, t); };
    /* the actor's own item goes into its own slot (once it can); and back out */
    K.drop = function (a, t) { var f = pos(K.layout, a).slot; tl.to(el("item", a), { x: f[0] + 466, y: f[1] + 48, scale: 0.7, duration: 0.7, ease: "power2.inOut" }, t); tl.to(el("item", a).querySelector(".dk-itemlab"), { opacity: 0, duration: 0.3 }, t); };
    K.undrop = function (a, t) { var h = pos(K.layout, a).item; tl.to(el("item", a), { x: h[0], y: h[1], scale: 1, duration: 0.6, ease: "power2.inOut" }, t); tl.to(el("item", a).querySelector(".dk-itemlab"), { opacity: 1, duration: 0.3 }, t + 0.5); };

    /* the camera: in on one actor, or back to the whole picture; the world scaled and moved; faded under something */
    K.cam = function (who, t, d, k) {
      var x = 0, y = 0, s = 1; if (who !== "all") { var c = K.layout === "ring" ? RING[A.indexOf(who)] : [ROW[A.indexOf(who)], 420]; s = k || 1.5; x = 960 - c[0] * s; y = 470 - c[1] * s; }
      tl.to(q(".dk-cam"), { x: x, y: y, scale: s, duration: d || 1.1, ease: "power3.inOut" }, t);
    };
    K.zoom = function (t, s, x, y, d) { tl.to(q(".dk-cam"), { scale: s, x: x, y: y, duration: d || 1.2, ease: "power3.inOut" }, t); };
    K.fade = function (t, to, d) { tl.to(q(".dk-cam"), { opacity: to, duration: d || 0.6 }, t); };
    /* a line of the scene's own drawing draws itself (an svg path with opacity 0 in the markup) */
    K.draw = function (sel, t, d) { qa(sel).forEach(function (p) { var L = Math.ceil(p.getTotalLength()); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); tl.set(p, { opacity: 1 }, t); tl.to(p, { strokeDashoffset: 0, duration: d || 1, ease: "power1.inOut" }, t); }); };
    K.undraw = function (sel, t) { tl.to(qa(sel), { opacity: 0, duration: 0.4 }, t); };
    /* lines of work in a .dk-term, one every `gap` seconds: spread them over the time the work takes */
    K.work = function (sel, t, n, gap) {
      var lines = qa(sel + " i"); n = n || lines.length; gap = gap || 0.28;
      lines.slice(0, n).forEach(function (l, k) { tl.fromTo(l, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 0.35 + ((k * 37) % 60) / 100, duration: 0.25, ease: "power1.out", immediateRender: false }, t + k * gap); });
    };
    K.clear = function (sel, t) { tl.to(qa(sel + " i"), { opacity: 0, duration: 0.3 }, t); };
    /* time passing: the .dk-clock bar fills over d seconds, its .now (if it has one) counts the units, and every slot
       pings at each check (every `every` units). The count is the only text the kit writes by script: a number */
    K.clock = function (t, d, every) {
      var c = q(".dk-clock"), fill = c.querySelector(".fill"), now = c.querySelector(".now"), o = { m: 0 }, lim = G.clock.length, unit = G.clock.unit;
      tl.to(fill, { scaleX: 1, duration: d, ease: "none" }, t);
      if (now) tl.to(o, { m: lim, duration: d, ease: "none", onUpdate: function () { now.textContent = unit + " " + Math.round(o.m); } }, t);
      var step = every || 1;
      for (var m = step; m <= lim; m += step) A.forEach(function (a, k) {
        var p = q('[data-ping="' + a + '"]'); tl.fromTo(p, { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 2.4, duration: 0.5, ease: "power1.out", immediateRender: false }, t + d * m / lim + k * 0.04);
      });
    };
    return K;
  }
  window.DiagramKit = DiagramKit;
})();
