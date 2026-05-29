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
    <div class="logo-big">n8</div>
    <h1>Das <b>n8n</b>-Werkbuch</h1>
    <p class="sub">Workflows bauen — vom ersten Klick bis zum KI-Agenten. Jeder Schritt so beschrieben und
      bebildert, dass du ihn parallel am Bildschirm nachbauen kannst.</p>
    <a class="cta" href="#00-vorwort">Buch öffnen →</a>
  </div>
  <div class="cover-toc"><h2>Inhaltsverzeichnis</h2>${tocHtml}</div>
</section>`;

// Sidebar-Markup (statisch, da kein book.js)
let sidebar = `<a class="sb-brand" href="#home"><span class="logo">n8</span>
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
sidebar += `<div class="sb-foot">© ${new Date().getFullYear()} · Lehrbuch-Entwurf · „n8n“ ist eine Marke der n8n GmbH. Unabhängiges Lernprojekt.</div>`;

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
.cover-hero { background: radial-gradient(900px 500px at 80% -10%, #2a2440, #16161f 60%); color:#fff;
  padding: 70px 40px 60px; border-radius:0; }
.cover-hero .logo-big { width:56px;height:56px;border-radius:14px;background:var(--book-accent);
  display:grid;place-items:center;font-weight:800;font-size:26px;letter-spacing:-2px;margin-bottom:24px; }
.cover-hero h1 { font-family:var(--serif); font-size:clamp(32px,5vw,54px); margin:0 0 14px; font-weight:600; }
.cover-hero h1 b { color:var(--book-accent); }
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
