#!/usr/bin/env node
/* =========================================================================
   build.js — bündelt das gesamte Buch in EINE eigenständige HTML-Datei
   (dist/n8n-werkbuch.html). Inlined: beide Stylesheets + alle Kapitel.
   Navigation per Hash-Routing, ganz ohne Server. Doppelklick genügt.
   Aufruf:  node build.js
   ========================================================================= */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

// --- Manifest laden (chapters.js setzt window.BOOK) ----------------------
const sandbox = { window: {} };
new Function("window", read("assets/js/chapters.js"))(sandbox.window);
const BOOK = sandbox.window.BOOK;

// --- CSS einsammeln ------------------------------------------------------
const bookCss = read("assets/css/book.css");
const uiCss = read("assets/css/n8n-ui.css");

// --- Artikel-Inhalt jedes fertigen Kapitels extrahieren ------------------
function extractArticle(slug) {
  const html = read(`kapitel/${slug}.html`);
  const m = html.match(/<article>([\s\S]*?)<\/article>/i);
  return m ? m[1] : `<p>Inhalt fehlt: ${slug}</p>`;
}

const flat = [];
BOOK.parts.forEach((p) => p.chapters.forEach((c) => flat.push(Object.assign({ part: p.part }, c))));

// Kapitel-Sections bauen
let sections = "";
flat.forEach((c) => {
  if (c.status === "ready") {
    sections += `<section class="page" id="${c.slug}" hidden><article>${extractArticle(c.slug)}</article>
      <nav class="pn-wrap" data-slug="${c.slug}"></nav></section>\n`;
  }
});

// Cover-Section
const coverChapters = flat.filter((c) => c.status === "ready");
let tocHtml = "";
BOOK.parts.forEach((p) => {
  tocHtml += `<div class="toc-part"><h3>${p.part}</h3><div class="toc-list">`;
  p.chapters.forEach((c) => {
    const ready = c.status === "ready";
    tocHtml += `<a class="toc-row${ready ? "" : " soon"}" href="${ready ? "#" + c.slug : "javascript:void(0)"}">
      <span class="n">${c.num}</span><span class="ti">${c.title}</span>
      <span class="mins">⏱ ${c.mins} Min</span>
      <span class="pill">${ready ? "lesen" : "bald"}</span></a>`;
  });
  tocHtml += `</div></div>`;
});

const cover = `<section class="page" id="home" hidden>
  <div class="cover-hero">
    <a class="brand-mark" href="https://werkskolleg.de" aria-label="Werkskolleg"><svg class="wek-wordmark" viewBox="0 0 94.22 18.88" fill="currentColor" role="img" aria-label="Werkskolleg"><path d="M5.61,13L2.83,3.2h2.4l1.61,6.16h.06l1.92-6.16h1.94l2.03,6.16h.05l1.6-6.16h2.41l-2.77,9.8h-2.24l-2.02-6.44h-.05l-1.92,6.44h-2.24Z"/><path d="M20.51,13.14c-.8,0-1.49-.16-2.08-.47-.59-.31-1.04-.75-1.36-1.32-.32-.57-.48-1.24-.48-2.01s.16-1.44.47-2c.31-.56.75-.99,1.33-1.29.58-.3,1.26-.45,2.04-.45s1.44.15,2,.44.98.72,1.28,1.26c.29.55.44,1.21.44,1.97v.71h-5.41c.09.47.28.82.58,1.06.3.24.69.36,1.19.36.4,0,.7-.06.93-.19.22-.13.38-.32.48-.6h2.23c-.15.79-.55,1.41-1.19,1.86-.64.45-1.45.67-2.43.67ZM18.76,8.53h3.24c-.07-.4-.24-.7-.5-.9-.26-.2-.62-.3-1.07-.3s-.81.1-1.09.3c-.28.2-.48.5-.58.9Z"/><path d="M26.08,13v-5.08h-1.09v-2.18h2.23v1.45h.51c.19-.52.49-.91.91-1.17.42-.25.89-.38,1.4-.38h.62v1.94h-.71c-.6,0-1.03.17-1.29.5-.26.33-.39.76-.39,1.29v3.63h-2.18Z"/><path d="M31.84,13V2.83h2.23v5.29h.05l2.64-2.38h2.64l-3,2.71,3.22,4.55h-2.59l-2.2-3.19-.75.6v2.59h-2.23Z"/><path d="M43.44,13.14c-1.09,0-1.95-.23-2.57-.69-.63-.46-.96-1.1-1.01-1.92h2.14c.06.32.22.56.47.71.25.15.6.23,1.07.23.73,0,1.09-.19,1.09-.57,0-.15-.05-.28-.16-.37-.11-.09-.29-.16-.54-.21l-1.62-.31c-1.48-.29-2.23-.98-2.23-2.08,0-.71.29-1.28.86-1.7s1.36-.64,2.37-.64,1.8.22,2.38.65c.58.44.9,1.05.94,1.84h-2.14c-.08-.31-.22-.54-.43-.68-.21-.14-.51-.21-.9-.21-.32,0-.57.04-.74.13-.17.09-.26.22-.26.4,0,.13.05.24.16.33.1.09.26.15.47.19l1.67.33c.77.15,1.34.4,1.71.75.36.35.54.81.54,1.4,0,.76-.28,1.35-.84,1.78-.56.43-1.37.64-2.43.64Z"/><path d="M48.16,13V3.2h2.27v3.78h.05l3.97-3.78h2.78l-4.21,3.96,4.28,5.84h-2.69l-3.19-4.43-.99.8v3.63h-2.27Z"/><path d="M61.36,13.14c-.8,0-1.5-.16-2.09-.47-.6-.31-1.06-.75-1.39-1.32-.33-.57-.49-1.24-.49-2s.16-1.43.49-2c.33-.56.79-1,1.39-1.31.6-.31,1.3-.46,2.11-.46s1.5.15,2.09.46c.58.31,1.04.74,1.36,1.31.32.56.48,1.23.48,2.01s-.16,1.43-.48,2-.78,1.01-1.37,1.31-1.29.46-2.09.46ZM61.36,11.21c.56,0,.98-.17,1.28-.5.29-.33.44-.78.44-1.35s-.15-1.01-.44-1.34c-.29-.33-.72-.49-1.28-.49s-1,.16-1.29.49c-.3.33-.45.77-.45,1.34s.15,1.01.45,1.35c.3.33.73.5,1.29.5Z"/><path d="M66.57,13V2.83h2.23v10.16h-2.23Z"/><path d="M70.5,13V2.83h2.23v10.16h-2.23Z"/><path d="M77.92,13.14c-.8,0-1.49-.16-2.08-.47-.59-.31-1.04-.75-1.36-1.32-.32-.57-.48-1.24-.48-2.01s.16-1.44.47-2c.31-.56.75-.99,1.33-1.29.58-.3,1.26-.45,2.04-.45s1.44.15,2,.44.98.72,1.28,1.26c.29.55.44,1.21.44,1.97v.71h-5.41c.09.47.28.82.58,1.06.3.24.69.36,1.19.36.4,0,.7-.06.93-.19.22-.13.38-.32.48-.6h2.23c-.15.79-.55,1.41-1.19,1.86-.64.45-1.45.67-2.43.67ZM76.18,8.53h3.24c-.07-.4-.24-.7-.5-.9-.26-.2-.62-.3-1.07-.3s-.81.1-1.09.3c-.28.2-.48.5-.58.9Z"/><path d="M86.41,16.05c-1.12,0-2.03-.22-2.73-.67s-1.11-1.07-1.24-1.87h2.35c.19.53.7.8,1.54.8.59,0,1.04-.13,1.35-.4.31-.27.47-.65.47-1.14v-.91h-.06c-.23.38-.52.66-.89.85s-.81.28-1.34.28c-.68,0-1.27-.15-1.77-.45-.5-.3-.9-.73-1.17-1.29-.28-.56-.42-1.21-.42-1.96,0-1.13.31-2.03.94-2.7s1.49-1,2.6-1c.61,0,1.14.12,1.58.36.44.24.79.57,1.05,1h.51v-1.21h2.23v2.18h-1.09v4.85c0,1.05-.33,1.86-1,2.43-.67.57-1.63.85-2.88.85ZM86.41,11.06c.52,0,.93-.14,1.22-.42.29-.28.44-.67.44-1.17v-.36c0-.49-.15-.88-.44-1.16-.29-.28-.7-.42-1.22-.42s-.96.16-1.25.47c-.29.31-.44.75-.44,1.31s.15,1,.44,1.3c.29.3.71.45,1.25.45Z"/></svg></a>
    <div class="brand-eyebrow">Schulungsunterlage</div>
    <h1>Das <b>n8n</b>-Werkbuch</h1>
    <p class="sub">Workflows bauen, vom ersten Klick bis zum KI-Agenten. Jeder Schritt so beschrieben und
      bebildert, dass du ihn parallel am Bildschirm nachbauen kannst.</p>
    <a class="cta" href="#00-vorwort">Buch öffnen →</a>
  </div>
  <div class="cover-toc"><h2>Inhaltsverzeichnis</h2>${tocHtml}</div>
</section>`;

// Sidebar-Markup (statisch, da kein book.js)
let sidebar = `<a class="sb-brand" href="#home"><span class="logo"><svg class="wek-symbol" viewBox="0 0 99.21 99.21" fill="currentColor" aria-hidden="true"><path d="M53.36,3.13l-8.9,8.9c-.18.19-.29.44-.29.7v18.56c0,.88,1.06,1.32,1.68.7l8.88-8.88c.18-.18.29-.44.29-.7V3.82c.01-.88-1.05-1.32-1.67-.7Z"/><path d="M53.36,67.24l-8.9,8.9c-.18.18-.29.44-.29.7v18.56c0,.88,1.06,1.32,1.68.7l8.88-8.88c.18-.18.29-.44.29-.7v-18.57c.01-.88-1.05-1.32-1.67-.7Z"/><path d="M96.09,53.36l-8.9-8.9c-.18-.18-.44-.29-.7-.29h-18.56c-.88,0-1.32,1.06-.7,1.68l8.88,8.88c.18.18.44.29.7.29h18.57c.88.01,1.32-1.05.7-1.67Z"/><path d="M31.97,53.36l-8.9-8.9c-.18-.18-.44-.29-.7-.29H3.82c-.88,0-1.32,1.06-.7,1.68l8.88,8.88c.18.18.44.29.7.29h18.57c.88.01,1.32-1.05.7-1.67Z"/><path d="M39.79,64.73h-12.58c-.26,0-.51.1-.7.29l-13.12,13.12c-.62.62-.18,1.68.7,1.68h12.56c.26,0,.51-.1.7-.29l13.14-13.12c.62-.62.18-1.68-.7-1.68Z"/><path d="M32.8,40.49c.62.62,1.68.18,1.68-.7v-12.56c0-.26-.1-.51-.29-.7l-13.12-13.14c-.62-.62-1.68-.18-1.68.7v12.58c0,.26.1.51.29.7l13.12,13.12Z"/><path d="M66.41,58.73c-.62-.62-1.68-.18-1.68.7v12.58c0,.26.1.51.29.7l13.12,13.12c.62.62,1.68.18,1.68-.7v-12.56c0-.26-.1-.51-.29-.7l-13.12-13.14Z"/></svg></span>
  <span><b>${BOOK.title}</b><small>${BOOK.subtitle}</small></span></a>
  <div class="sb-search"><span>🔎</span><input id="sbq" type="text" placeholder="Im Buch suchen…" autocomplete="off"></div>`;
BOOK.parts.forEach((p) => {
  sidebar += `<div class="sb-part">${p.part}</div>`;
  p.chapters.forEach((c) => {
    const ready = c.status === "ready";
    sidebar += `<a class="sb-link${ready ? "" : " is-soon"}" data-title="${c.title.toLowerCase()}"
      href="${ready ? "#" + c.slug : "javascript:void(0)"}" data-slug="${c.slug}">
      <span class="num">${c.num}</span><span>${c.title}</span>
      ${ready ? "" : '<span class="soon">bald</span>'}</a>`;
  });
});
sidebar += `<div class="sb-foot">Schulungsunterlage der Werkskolleg GmbH · werkskolleg.de<br>„n8n“ ist eine Marke der n8n GmbH. Unabhängiges Lernprojekt.</div>`;

// Reihenfolge fertiger Kapitel für prev/next
const readyOrder = flat.filter((c) => c.status === "ready").map((c) => c.slug);

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BOOK.title} — ${BOOK.subtitle}</title>
<style>
${bookCss}
${uiCss}
/* ---- Ergänzungen nur für die Einzeldatei-Version ---- */
.page { animation: fade .2s ease; }
@keyframes fade { from { opacity:0; transform:translateY(4px);} to {opacity:1;transform:none;} }
.cover-hero { background: radial-gradient(900px 500px at 82% -12%, #12489b 0%, #0a1230 46%, #06080f 100%); color:#fff;
  padding: 62px 40px 60px; border-radius:0; }
.cover-hero .brand-mark { display:inline-block; color:#fff; margin:0 0 20px; }
.cover-hero .brand-mark .wek-wordmark { width:200px; height:auto; }
.cover-hero .brand-eyebrow { text-transform:uppercase; letter-spacing:.22em; font-size:11.5px; font-weight:600; color:#8fb4f0; margin:0 0 12px; }
.cover-hero h1 { font-family:var(--display); font-size:clamp(32px,5vw,54px); margin:0 0 14px; font-weight:700; }
.cover-hero h1 b { color:#5aa2ff; }
.cover-hero .sub { font-size:18px; color:#c9ccd8; max-width:620px; line-height:1.55; margin:0 0 26px; }
.cover-hero .cta { background:var(--book-accent); color:#fff; padding:13px 24px; border-radius:10px;
  font-weight:700; text-decoration:none; display:inline-block; }
.cover-toc { max-width:820px; margin:0 auto; padding:46px 30px 80px; }
.cover-toc > h2 { font-family:var(--serif); font-size:28px; margin:0 0 22px; }
.toc-part { margin-bottom:26px; }
.toc-part h3 { font-size:12.5px; text-transform:uppercase; letter-spacing:.08em; color:var(--book-accent); margin:0 0 11px; }
.toc-list { display:grid; gap:8px; }
.toc-row { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid var(--book-line);
  border-radius:11px; padding:12px 15px; text-decoration:none; color:var(--book-ink); }
.toc-row:hover { border-color:var(--book-accent); }
.toc-row.soon { opacity:.6; }
.toc-row .n { font-family:var(--mono); font-size:13px; color:var(--book-accent); min-width:30px; font-weight:600; }
.toc-row .ti { flex:1; font-weight:600; font-size:15px; }
.toc-row .mins { font-size:12px; color:var(--book-faint); }
.toc-row .pill { font-size:10px; background:#eef0f4; color:var(--book-faint); padding:2px 9px; border-radius:20px; }
.toc-row.soon .pill { background:#fff3e8; color:#c47f17; }
#home article { all:unset; }
.pn-wrap { max-width: var(--maxw); margin:0 auto; padding: 0 30px 70px; display:flex; gap:14px; }
</style>
</head>
<body data-base=".">
<svg id="n8n-arrow-defs" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none">
  <defs>
    <marker id="n8n-arrow" markerWidth="8" markerHeight="8" refX="6.2" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0.6 L7,4 L0,7.4 Z" fill="#b3b9c7"></path>
    </marker>
    <marker id="n8n-arrow-active" markerWidth="8" markerHeight="8" refX="6.2" refY="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <path d="M0,0.6 L7,4 L0,7.4 Z" fill="#ea4b71"></path>
    </marker>
  </defs>
</svg>
<div id="app">
  <aside id="sidebar">${sidebar}</aside>
  <div id="content">
    <header id="bookbar"></header>
    ${cover}
    ${sections}
  </div>
</div>
<script>
var READY = ${JSON.stringify(readyOrder)};
var FLAT = ${JSON.stringify(flat.map((c) => ({ slug: c.slug, title: c.title, part: c.part, status: c.status })))};

function show(slug) {
  if (!slug || READY.indexOf(slug) === -1 && slug !== "home") slug = "home";
  document.querySelectorAll(".page").forEach(function (s) { s.hidden = s.id !== slug; });
  document.querySelectorAll(".sb-link").forEach(function (a) {
    a.classList.toggle("is-current", a.getAttribute("data-slug") === slug);
  });
  buildBar(slug);
  buildPN(slug);
  fitCanvasDiagrams(document.getElementById(slug));
  document.getElementById("app").classList.remove("nav-open");
  window.scrollTo(0, 0);
}
function buildBar(slug) {
  var me = FLAT.filter(function (c) { return c.slug === slug; })[0];
  var crumb = me ? '<span class="crumb">' + me.part + ' › <b>' + me.title + '</b></span>'
                 : '<span class="crumb"><b>${BOOK.title}</b></span>';
  document.getElementById("bookbar").innerHTML =
    '<button class="sb-toggle" id="navToggle">☰</button>' + crumb +
    '<span class="right"><a class="barbtn" href="#home">📚 Übersicht</a>' +
    '<button class="barbtn" onclick="window.print()">🖨️ Drucken</button></span>';
  var t = document.getElementById("navToggle");
  if (t) t.onclick = function () { document.getElementById("app").classList.toggle("nav-open"); };
}
function buildPN(slug) {
  var wrap = document.querySelector('#' + CSS.escape(slug) + ' .pn-wrap');
  if (!wrap) return;
  var i = READY.indexOf(slug);
  var prev = READY[i - 1], next = READY[i + 1];
  function info(s) { return FLAT.filter(function (c) { return c.slug === s; })[0]; }
  var h = "";
  h += prev ? '<a class="pn" href="#' + prev + '"><small>← Zurück</small><b>' + info(prev).title + '</b></a>'
            : "<span style='flex:1'></span>";
  h += next ? '<a class="pn pn--next" href="#' + next + '"><small>Weiter →</small><b>' + info(next).title + '</b></a>'
            : "<span style='flex:1'></span>";
  wrap.innerHTML = h;
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
    return String(Math.round(n * 10) / 10).replace(/\\.0$/, "");
  }

  var outs = Array.prototype.map.call(canvas.querySelectorAll(".ep.out"), point);
  var ins = Array.prototype.map.call(canvas.querySelectorAll(".ep.in"), point);
  svg.querySelectorAll("path:not(.no-arrow)").forEach(function (path) {
    var nums = (path.getAttribute("d") || "").match(/-?\\d+(?:\\.\\d+)?/g);
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
window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });

// Suche in der Sidebar
document.getElementById("sbq").addEventListener("input", function () {
  var v = this.value.trim().toLowerCase();
  document.querySelectorAll(".sb-link").forEach(function (a) {
    var t = a.getAttribute("data-title") || "";
    a.style.display = (!v || t.indexOf(v) > -1) ? "" : "none";
  });
});

// Scrim für mobile Navigation
var scrim = document.createElement("div"); scrim.id = "scrim";
scrim.onclick = function () { document.getElementById("app").classList.remove("nav-open"); };
document.getElementById("app").appendChild(scrim);

show(location.hash.slice(1) || "home");
</script>
</body>
</html>`;

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/n8n-werkbuch.html"), html);
const kb = Math.round(Buffer.byteLength(html) / 1024);
console.log(`✓ dist/n8n-werkbuch.html erstellt (${kb} KB, ${readyOrder.length} Kapitel eingebettet)`);
