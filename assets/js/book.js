/* =========================================================================
   book.js — baut Sidebar, Topbar-Breadcrumb, Vor/Zurück-Navigation und
   eine einfache Live-Suche. Erwartet window.BOOK aus chapters.js.

   Jede Kapitelseite setzt:  <body data-slug="01-was-ist-n8n" data-base="../">
   data-base ist der Pfad zum Projekt-Root (".." aus /kapitel/, "." vom Root).
   ========================================================================= */
(function () {
  var BOOK = window.BOOK;
  if (!BOOK) return;

  var body = document.body;
  var base = body.getAttribute("data-base") || ".";
  var slug = body.getAttribute("data-slug") || "";
  var kdir = base + "/kapitel/";

  /* ---------- Pfeilspitzen für Node-Verbindungen (SVG-Marker) ----------
     n8n zeichnet am Ziel jeder Verbindung eine kleine Pfeilspitze. Wir
     definieren die Marker einmal global; alle .n8n-conns-Pfade verweisen
     per CSS (marker-end) darauf. Zwei Farben: grau (ruhend) & pink (aktiv). */
  function injectArrowDefs() {
    if (document.getElementById("n8n-arrow-defs")) return;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("id", "n8n-arrow-defs");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    svg.innerHTML =
      '<defs>' +
      '<marker id="n8n-arrow" markerWidth="8" markerHeight="8" refX="6.2" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">' +
        '<path d="M0,0.6 L7,4 L0,7.4 Z" fill="#b3b9c7"></path></marker>' +
      '<marker id="n8n-arrow-active" markerWidth="8" markerHeight="8" refX="6.2" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">' +
        '<path d="M0,0.6 L7,4 L0,7.4 Z" fill="#ea4b71"></path></marker>' +
      '</defs>';
    document.body.appendChild(svg);
  }

  function fitCanvasDiagrams(root) {
    (root || document).querySelectorAll(".n8n-canvas > svg.n8n-conns[viewBox]").forEach(function (svg) {
      var vb = svg.viewBox && svg.viewBox.baseVal;
      if (!vb || !vb.width || !vb.height) return;

      var canvas = svg.closest(".n8n-canvas");
      var shell = svg.closest(".n8n");
      var frame = svg.closest(".figure .frame");
      if (!frame) {
        snapConnectorPaths(canvas, svg);
        return;
      }
      var canvasWidth = vb.width;
      var canvasHeight = vb.height;

      canvas.querySelectorAll(".n8n-node").forEach(function (node) {
        var left = parseFloat(node.style.left) || node.offsetLeft || 0;
        var top = parseFloat(node.style.top) || node.offsetTop || 0;
        canvasWidth = Math.max(canvasWidth, left + node.offsetWidth + 28);
        canvasHeight = Math.max(canvasHeight, top + node.offsetHeight + 48);
      });

      var w = Math.ceil(canvasWidth) + "px";
      var h = Math.ceil(canvasHeight) + "px";
      svg.style.width = vb.width + "px";
      svg.style.height = vb.height + "px";
      canvas.style.width = w;
      canvas.style.minWidth = w;
      canvas.style.height = h;
      canvas.style.minHeight = h;

      if (shell) {
        shell.style.width = w;
        shell.style.maxWidth = "none";
      }
      frame.classList.add("has-canvas-scroll");

      snapConnectorPaths(canvas, svg);
    });
  }

  function snapConnectorPaths(canvas, svg) {
    function point(el) {
      var er = el.getBoundingClientRect();
      var cr = canvas.getBoundingClientRect();
      return { x: er.left + er.width / 2 - cr.left, y: er.top + er.height / 2 - cr.top };
    }
    function dist(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
    function nearest(p, points) {
      return points.reduce(function (best, candidate) {
        var d = dist(p, candidate);
        return !best || d < best.d ? { d: d, p: candidate } : best;
      }, null);
    }
    function clean(n) {
      return String(Math.round(n * 10) / 10).replace(/\.0$/, "");
    }

    var outs = Array.prototype.map.call(canvas.querySelectorAll(".ep.out"), point);
    var ins = Array.prototype.map.call(canvas.querySelectorAll(".ep.in"), point);
    svg.querySelectorAll("path:not(.no-arrow)").forEach(function (path) {
      var nums = (path.getAttribute("d") || "").match(/-?\d+(?:\.\d+)?/g);
      if (!nums || nums.length !== 8) return;
      nums = nums.map(Number);

      var start = { x: nums[0], y: nums[1] };
      var end = { x: nums[6], y: nums[7] };
      var out = nearest(start, outs);
      var input = nearest(end, ins);
      var changed = false;

      if (out && out.d <= 34) {
        nums[0] = out.p.x;
        nums[1] = out.p.y;
        changed = true;
      }
      if (input && input.d <= 34) {
        nums[6] = input.p.x;
        nums[7] = input.p.y;
        changed = true;
      }
      if (changed) {
        path.setAttribute("d", "M " + clean(nums[0]) + " " + clean(nums[1]) +
          " C " + clean(nums[2]) + " " + clean(nums[3]) +
          ", " + clean(nums[4]) + " " + clean(nums[5]) +
          ", " + clean(nums[6]) + " " + clean(nums[7]));
      }
    });
  }

  // flache Liste aller Kapitel (für prev/next & Suche)
  var flat = [];
  BOOK.parts.forEach(function (p) {
    p.chapters.forEach(function (c) { flat.push(Object.assign({ part: p.part }, c)); });
  });

  /* ---------- Sidebar ---------- */
  function href(c) { return c.status === "ready" ? kdir + c.slug + ".html" : "javascript:void(0)"; }

  function buildSidebar() {
    var el = document.getElementById("sidebar");
    if (!el) return;
    var h = "";
    h += '<a class="sb-brand" href="' + base + '/index.html">' +
         '<span class="logo"><svg class="wek-symbol" viewBox="0 0 99.21 99.21" fill="currentColor" aria-hidden="true"><path d="M53.36,3.13l-8.9,8.9c-.18.19-.29.44-.29.7v18.56c0,.88,1.06,1.32,1.68.7l8.88-8.88c.18-.18.29-.44.29-.7V3.82c.01-.88-1.05-1.32-1.67-.7Z"/><path d="M53.36,67.24l-8.9,8.9c-.18.18-.29.44-.29.7v18.56c0,.88,1.06,1.32,1.68.7l8.88-8.88c.18-.18.29-.44.29-.7v-18.57c.01-.88-1.05-1.32-1.67-.7Z"/><path d="M96.09,53.36l-8.9-8.9c-.18-.18-.44-.29-.7-.29h-18.56c-.88,0-1.32,1.06-.7,1.68l8.88,8.88c.18.18.44.29.7.29h18.57c.88.01,1.32-1.05.7-1.67Z"/><path d="M31.97,53.36l-8.9-8.9c-.18-.18-.44-.29-.7-.29H3.82c-.88,0-1.32,1.06-.7,1.68l8.88,8.88c.18.18.44.29.7.29h18.57c.88.01,1.32-1.05.7-1.67Z"/><path d="M39.79,64.73h-12.58c-.26,0-.51.1-.7.29l-13.12,13.12c-.62.62-.18,1.68.7,1.68h12.56c.26,0,.51-.1.7-.29l13.14-13.12c.62-.62.18-1.68-.7-1.68Z"/><path d="M32.8,40.49c.62.62,1.68.18,1.68-.7v-12.56c0-.26-.1-.51-.29-.7l-13.12-13.14c-.62-.62-1.68-.18-1.68.7v12.58c0,.26.1.51.29.7l13.12,13.12Z"/><path d="M66.41,58.73c-.62-.62-1.68-.18-1.68.7v12.58c0,.26.1.51.29.7l13.12,13.12c.62.62,1.68.18,1.68-.7v-12.56c0-.26-.1-.51-.29-.7l-13.12-13.14Z"/></svg></span>' +
         '<span><b>' + BOOK.title + '</b><small>' + BOOK.subtitle + '</small></span></a>';
    h += '<div class="sb-search"><span>🔎</span><input id="sbq" type="text" placeholder="Im Buch suchen…" autocomplete="off"></div>';

    BOOK.parts.forEach(function (p) {
      h += '<div class="sb-part">' + p.part + "</div>";
      p.chapters.forEach(function (c) {
        var cur = c.slug === slug ? " is-current" : "";
        var soon = c.status !== "ready" ? " is-soon" : "";
        h += '<a class="sb-link' + cur + soon + '" data-title="' + c.title.toLowerCase() +
             '" href="' + href(c) + '">' +
             '<span class="num">' + c.num + "</span>" +
             "<span>" + c.title + "</span>" +
             (c.status !== "ready" ? '<span class="soon">bald</span>' : "") +
             "</a>";
      });
    });
    h += '<div class="sb-foot">© ' + new Date().getFullYear() +
         " · Lehrbuch-Entwurf · n8n ist eine Marke der n8n GmbH. " +
         "Dieses Buch ist ein unabhängiges Lernprojekt.</div>";
    el.innerHTML = h;

    var q = document.getElementById("sbq");
    if (q) q.addEventListener("input", function () {
      var v = this.value.trim().toLowerCase();
      el.querySelectorAll(".sb-link").forEach(function (a) {
        var t = a.getAttribute("data-title") || "";
        a.style.display = (!v || t.indexOf(v) > -1) ? "" : "none";
      });
    });
  }

  /* ---------- Topbar: Breadcrumb + Aktionen ---------- */
  function buildBar() {
    var bar = document.getElementById("bookbar");
    if (!bar) return;
    var me = flat.filter(function (c) { return c.slug === slug; })[0];
    var crumb = me
      ? '<span class="crumb">' + me.part + ' &nbsp;›&nbsp; <b>' + me.title + "</b></span>"
      : '<span class="crumb"><b>' + BOOK.title + "</b></span>";
    bar.innerHTML =
      '<button class="sb-toggle" id="navToggle" aria-label="Navigation">☰</button>' +
      crumb +
      '<span class="right">' +
        '<a class="barbtn" href="' + base + '/index.html">📚 Übersicht</a>' +
        '<button class="barbtn" id="printBtn">🖨️ Drucken</button>' +
        '<button class="barbtn" id="topBtn">↑ Anfang</button>' +
      "</span>";

    var t = document.getElementById("navToggle");
    if (t) t.addEventListener("click", function () { document.getElementById("app").classList.toggle("nav-open"); });
    var pr = document.getElementById("printBtn");
    if (pr) pr.addEventListener("click", function () { window.print(); });
    var tp = document.getElementById("topBtn");
    if (tp) tp.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Vor / Zurück ---------- */
  function buildPrevNext() {
    var el = document.getElementById("prevnext");
    if (!el) return;
    var idx = flat.findIndex(function (c) { return c.slug === slug; });
    if (idx === -1) return;
    var prev = flat[idx - 1], next = flat[idx + 1];
    var html = "";
    if (prev) {
      var pd = prev.status === "ready" ? "" : " pn--disabled";
      html += '<a class="pn' + pd + '" href="' + href(prev) + '"><small>← Zurück</small><b>' + prev.title + "</b></a>";
    } else { html += "<span style='flex:1'></span>"; }
    if (next) {
      var nd = next.status === "ready" ? "" : " pn--disabled";
      html += '<a class="pn pn--next' + nd + '" href="' + href(next) + '"><small>Weiter →</small><b>' + next.title + "</b></a>";
    } else { html += "<span style='flex:1'></span>"; }
    el.innerHTML = html;
  }

  /* ---------- Scrim (mobil) ---------- */
  function buildScrim() {
    var app = document.getElementById("app");
    if (!app || document.getElementById("scrim")) return;
    var s = document.createElement("div");
    s.id = "scrim";
    s.addEventListener("click", function () { app.classList.remove("nav-open"); });
    app.appendChild(s);
  }

  injectArrowDefs();
  fitCanvasDiagrams(document);
  buildSidebar();
  buildBar();
  buildPrevNext();
  buildScrim();
})();
