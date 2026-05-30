# Kapitel 25 Skalierung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kapitel 25 "Sicherheit, Queue-Mode & Skalierung" als fertiges Buchkapitel ergänzen.

**Architecture:** Das Buch bleibt statisch: einzelne HTML-Kapitelseite, zentrales Manifest, generiertes Ein-Datei-Bundle. Das neue Kapitel folgt der vorhandenen Struktur aus Kapitel 22 bis 24 und nutzt bestehende CSS-Klassen für Buchlayout und n8n-UI-Nachbildungen.

**Tech Stack:** HTML, CSS-Klassen aus `assets/css/book.css` und `assets/css/n8n-ui.css`, Manifest in `assets/js/chapters.js`, Build mit Node.js über `build.js`.

---

## File Structure

- Create: `kapitel/25-skalierung.html` - vollständige Kapitelseite mit Lerntext, Abbildungen, Schritten, Fehlersuche und Testfällen.
- Modify: `assets/js/chapters.js` - Kapitel 25 von `status: "soon"` auf `status: "ready"` setzen.
- Modify: `dist/n8n-werkbuch.html` - ausschließlich durch `node build.js` regenerieren.

### Task 1: Kapiteldatei ergänzen

**Files:**
- Create: `kapitel/25-skalierung.html`

- [ ] **Step 1: Struktur aus Kapitel 24 prüfen**

Run: `Get-Content -LiteralPath kapitel/24-deployment.html -TotalCount 120`

Expected: Die Datei zeigt die Standardstruktur mit `#app`, `#sidebar`, `#content`, `#bookbar`, `article` und `#prevnext`.

- [ ] **Step 2: Neue HTML-Datei schreiben**

Create `kapitel/25-skalierung.html` with:

```html
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sicherheit, Queue-Mode &amp; Skalierung — Das n8n-Werkbuch</title>
<link rel="stylesheet" href="../assets/css/book.css">
<link rel="stylesheet" href="../assets/css/n8n-ui.css">
</head>
<body data-slug="25-skalierung" data-base="..">
<div id="app">
  <aside id="sidebar"></aside>
  <div id="content">
    <header id="bookbar"></header>
    <article>
      <!-- Kapitelinhalt: Einstieg, Voraussetzungen, Sicherheitsbasis, Queue-Mode, Skalierung, Fehlersuche, Testfälle. -->
      <div id="prevnext"></div>
    </article>
  </div>
</div>
<script src="../assets/js/chapters.js"></script>
<script src="../assets/js/book.js"></script>
</body>
</html>
```

The implementation replaces the comment with complete German teaching content. Required sections: `.prereq`, `callout--pareto`, `ol.steps`, `Wenn etwas schiefgeht`, `Konkrete Testfälle`.

- [ ] **Step 3: HTML-Struktur prüfen**

Run: `Select-String -Path kapitel/25-skalierung.html -Pattern '<article>|</article>|id="prevnext"|class="prereq"|callout--pareto|ol class="steps"|Wenn etwas schiefgeht|Konkrete Testfälle'`

Expected: Every required marker is present.

### Task 2: Manifest aktualisieren

**Files:**
- Modify: `assets/js/chapters.js`

- [ ] **Step 1: Kapitel-25-Eintrag ändern**

Change:

```js
{ num: "25", slug: "25-skalierung",     title: "Sicherheit, Queue-Mode & Skalierung", status: "soon", mins: 20 }
```

to:

```js
{ num: "25", slug: "25-skalierung",     title: "Sicherheit, Queue-Mode & Skalierung", status: "ready", mins: 24 }
```

- [ ] **Step 2: Manifest syntaktisch prüfen**

Run: `node --check assets/js/chapters.js`

Expected: No output and exit code 0.

### Task 3: Bundle bauen und prüfen

**Files:**
- Modify: `dist/n8n-werkbuch.html`

- [ ] **Step 1: Build ausführen**

Run: `node build.js`

Expected: `dist/n8n-werkbuch.html` wird ohne Fehler neu erzeugt.

- [ ] **Step 2: JavaScript prüfen**

Run: `node --check assets/js/book.js`

Expected: No output and exit code 0.

Run: `node --check assets/js/chapters.js`

Expected: No output and exit code 0.

- [ ] **Step 3: Inhalt im Bundle prüfen**

Run: `Select-String -Path dist/n8n-werkbuch.html -Pattern 'Sicherheit, Queue-Mode &amp; Skalierung|Queue-Mode|Konkrete Testfälle'`

Expected: The generated bundle contains the new chapter title and core sections.

### Task 4: Abschluss und Commit

**Files:**
- Commit all intended changes.

- [ ] **Step 1: Arbeitsbaum prüfen**

Run: `git status --short`

Expected: Only the plan file, `kapitel/25-skalierung.html`, `assets/js/chapters.js`, and `dist/n8n-werkbuch.html` are changed.

- [ ] **Step 2: Commit erstellen**

Run:

```bash
git add docs/superpowers/plans/2026-05-31-kapitel-25-skalierung.md kapitel/25-skalierung.html assets/js/chapters.js dist/n8n-werkbuch.html
git commit -m "Kapitel 25 Skalierung ergänzen"
```

Expected: Commit succeeds with a concise German message.

## Self-Review

- Spec coverage: The plan covers the new chapter, manifest update, generated bundle, required chapter sections, visual reuse, and verification commands.
- Placeholder scan: No task contains `TBD`, `TODO`, or unspecified future work.
- Type consistency: File names and slugs consistently use `25-skalierung`.
