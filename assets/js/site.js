/* VADIMPEX — vadimpex.com
   All page content is real HTML. This file only adds behaviour: the theme
   switch, the mobile menu, and the converging-routes graphic on the home page.
   Nothing here is required to read the site. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- theme */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme");
  var SUN = '<circle cx="12" cy="12" r="4.5"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"></path>';
  var MOON = '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"></path>';

  function isDark() {
    var set = root.getAttribute("data-theme");
    if (set) return set === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paintIcon() {
    if (themeBtn) themeBtn.querySelector("svg").innerHTML = isDark() ? MOON : SUN;
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("vpx-theme", next); } catch (e) {}
      paintIcon();
      renderRoutes();
    });
  }
  paintIcon();

  /* ---------------------------------------------------------- mobile menu */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------- grids: fill last row */
  function padGrid(ul, itemSelector, fillerClass, artFactory) {
    if (!ul) return;
    [].forEach.call(ul.querySelectorAll(".filler,.art"), function (f) { ul.removeChild(f); });
    var count = ul.querySelectorAll(itemSelector).length;
    if (!count) return;
    var cols = getComputedStyle(ul).gridTemplateColumns.split(" ").filter(Boolean).length;
    var missing = (cols - (count % cols)) % cols;
    if (!missing) return;
    if (artFactory) {
      var a = document.createElement("li");
      a.className = "art";
      a.style.gridColumn = "span " + missing;
      a.setAttribute("aria-hidden", "true");
      a.innerHTML = artFactory();
      ul.appendChild(a);
    } else {
      for (var i = 0; i < missing; i++) {
        var f = document.createElement("li");
        f.className = fillerClass + " filler";
        f.setAttribute("aria-hidden", "true");
        ul.appendChild(f);
      }
    }
  }

  function fanArt() {
    var cx = 210, cy = 138, out = "";
    for (var i = 0; i < 46; i++) {
      var a = (-172 + 164 * (i / 45)) * Math.PI / 180, acc = i % 6 === 0;
      out += '<line x1="' + (cx + Math.cos(a) * 300).toFixed(1) +
             '" y1="' + (cy + Math.sin(a) * 300).toFixed(1) +
             '" x2="' + cx + '" y2="' + cy + '" stroke="' + (acc ? "var(--red)" : "var(--fan)") +
             '" stroke-width="' + (acc ? 0.9 : 0.5) + '" opacity="' + (acc ? 0.3 : 0.14) + '"/>';
    }
    return '<svg viewBox="0 0 420 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
           out + '<circle cx="' + cx + '" cy="' + cy + '" r="3.2" fill="var(--red)"/></svg>';
  }

  function padAll() {
    padGrid(document.getElementById("creds"), ".cred:not(.filler)", "cred", null);
    padGrid(document.getElementById("roster"), "li:not(.art)", "", fanArt);
  }

  /* -------------------------------------------------------- routes graphic
     Positions are fractions of the graphic box, so the arc keeps its shape at
     any proportion. Labels come from the page so they can be translated. */
  var DESTS = [
    { x: 0.07,  y: 0.395 }, { x: 0.16,  y: 0.315 }, { x: 0.26,  y: 0.25  },
    { x: 0.36,  y: 0.20  }, { x: 0.46,  y: 0.145 }, { x: 0.57,  y: 0.115 },
    { x: 0.66,  y: 0.135 }, { x: 0.755, y: 0.205 }, { x: 0.845, y: 0.30  }
  ];
  var BADEN = { x: 0.78, y: 0.88 };
  var NS = "http://www.w3.org/2000/svg";
  var retries = 0;

  function mk(n, attrs) {
    var e = document.createElementNS(NS, n);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function renderRoutes() {
    var svg = document.getElementById("routes");
    if (!svg) return;
    var holder = document.querySelector(".heroart");
    var art = holder.getBoundingClientRect();
    // On first paint the box can measure zero; wait a frame rather than give up.
    if (!art.width || !art.height) {
      if (retries++ < 60) requestAnimationFrame(renderRoutes);
      return;
    }
    retries = 0;

    var names = (svg.getAttribute("data-labels") || "").split(",");
    var homeLabel = svg.getAttribute("data-home") || "BADEN, AT";

    var W = 900, H = Math.round(W * art.height / art.width);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.innerHTML = "";

    var cs = getComputedStyle(root);
    var FAN = cs.getPropertyValue("--fan").trim() || "#22282A";
    var ARC = cs.getPropertyValue("--arc").trim() || "#C9B8B0";
    var RED = cs.getPropertyValue("--red").trim() || "#E31F28";
    var SOFT = cs.getPropertyValue("--soft").trim() || "#5F6769";
    var INK = cs.getPropertyValue("--ink").trim() || "#22282A";

    var cx = W * BADEN.x, cy = H * BADEN.y;
    var reach = Math.max(W, H) * 1.9;

    // Sized in real pixels, then converted to viewBox units, so the names stay
    // the size of a caption on a phone and on a wide monitor alike.
    var pxPerUnit = art.width / W;
    var targetPx = Math.max(10, Math.min(13, art.width / 130));
    var type = targetPx / pxPerUnit;
    var dotR = Math.max(1.6, type * 0.26);

    [0.13, 0.24, 0.36, 0.50, 0.65].forEach(function (f, i) {
      var c = mk("circle", { cx: cx, cy: cy, r: W * f, fill: "none", stroke: ARC,
                             "stroke-width": ".9", opacity: ".5", "class": "ray" });
      c.style.animationDelay = (i * 80) + "ms";
      svg.appendChild(c);
    });

    for (var i = 0; i < 80; i++) {
      var ang = (-179 + 174 * (i / 79)) * Math.PI / 180, acc = i % 10 === 0;
      var l = mk("line", { x1: cx + Math.cos(ang) * reach, y1: cy + Math.sin(ang) * reach,
                           x2: cx, y2: cy, stroke: acc ? RED : FAN,
                           "stroke-width": acc ? .8 : .5, opacity: acc ? .26 : .1, "class": "ray" });
      l.style.animationDelay = (i * 6) + "ms";
      svg.appendChild(l);
    }

    // keep labels clear of the copy panel overlapping the lower left
    var card = document.querySelector(".herocard-inner");
    var cardRight = W, cardTop = H;
    if (getComputedStyle(document.querySelector(".herocard")).position === "absolute") {
      var cb = card.getBoundingClientRect();
      cardRight = (cb.right - art.left) * (W / art.width);
      cardTop = (cb.top - art.top) * (H / art.height) - type * 2.2;
    }

    var placed = [];
    DESTS.forEach(function (d, i) {
      var x = W * d.x, y = H * d.y;
      if (x < cardRight && y > cardTop) y = Math.max(type * 2.2, cardTop);

      var ln = mk("line", { x1: x, y1: y, x2: cx, y2: cy, stroke: RED,
                            "stroke-width": 1.1, opacity: .8, "class": "ray" });
      ln.style.animationDelay = (420 + i * 50) + "ms";
      svg.appendChild(ln);
      // dots and names are never animated: nothing that carries meaning should
      // depend on an animation completing
      svg.appendChild(mk("circle", { cx: x, cy: y, r: dotR, fill: RED }));

      var name = (names[i] || "").trim();
      if (!name) return;
      var half = name.length * type * 0.74 / 2;
      var ty = y - type * 1.15;
      var box = { x0: x - half, x1: x + half, y: ty };
      var clash = placed.some(function (p) {
        return box.x1 + type * 0.6 > p.x0 && p.x1 + type * 0.6 > box.x0 &&
               Math.abs(box.y - p.y) < type * 1.8;
      });
      if (clash) return;              // no room: the route still shows, the name steps aside
      placed.push(box);
      var tx = mk("text", { x: x, y: ty, "text-anchor": "middle",
                            "font-family": "IBM Plex Mono, monospace", "font-size": type,
                            "letter-spacing": type * 0.14, fill: SOFT });
      tx.textContent = name;
      svg.appendChild(tx);
    });

    svg.appendChild(mk("circle", { cx: cx, cy: cy, r: type * 1.3, fill: "none",
                                   stroke: RED, "stroke-width": "1.2", opacity: ".55" }));
    svg.appendChild(mk("circle", { cx: cx, cy: cy, r: type * 0.5, fill: RED }));

    // Baden sits right of its node, or flips left when there is no room
    var badenW = homeLabel.length * type * 1.12 * 0.74;
    var toLeft = cx + type * 2 + badenW > W - type;
    var lbl = mk("text", {
      x: toLeft ? cx - type * 1.8 : cx + type * 2,
      y: cy + type * 0.45,
      "text-anchor": toLeft ? "end" : "start",
      "font-family": "IBM Plex Mono, monospace",
      "font-size": type * 1.12, "letter-spacing": type * 0.2, fill: INK
    });
    lbl.textContent = homeLabel;
    svg.appendChild(lbl);
  }

  /* ------------------------------------------------------------ lifecycle */
  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () { padAll(); renderRoutes(); }, 150);
  });
  window.addEventListener("load", function () { padAll(); renderRoutes(); });
  document.addEventListener("visibilitychange", function () {
    // a background tab freezes rAF and can report a zero-sized layout
    if (!document.hidden) renderRoutes();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderRoutes);

  var now = new Date().getFullYear();
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = now;

  // "32 years in the trade" recalculates itself, so it can never go stale the
  // way the old site's hard-coded "27 years" did. The HTML carries the correct
  // number as a fallback for anyone without JavaScript.
  [].forEach.call(document.querySelectorAll("[data-years-since]"), function (el) {
    el.textContent = now - parseInt(el.getAttribute("data-years-since"), 10);
  });

  padAll();
  renderRoutes();
})();
