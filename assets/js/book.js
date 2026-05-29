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
         '<span class="logo">n8</span>' +
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

  buildSidebar();
  buildBar();
  buildPrevNext();
  buildScrim();
})();
