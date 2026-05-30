# AGENTS.md — n8n-Werkbuch

## Zweck

Dieses Repository enthält ein deutschsprachiges Online-Lehrbuch für n8n:
vom ersten Workflow bis zu KI-Agenten. Zielgruppe sind Einsteiger:innen ohne
Programmierkenntnisse.

Das Buch nutzt keine echten Screenshots. Die n8n-Oberfläche wird mit HTML/CSS
detailgetreu nachgebaut, damit Abbildungen scharf, konsistent und wartbar bleiben.

## Aktueller Einstieg

- Fertig im Manifest (`status: "ready"`): Kapitel `00-vorwort` bis `24-deployment`.
- Nächster sinnvoller Schritt: `25-skalierung` — Sicherheit, Queue-Mode & Skalierung.
- Danach: Anhänge A–D.

## Projektstruktur

- `index.html`: Startseite.
- `kapitel/*.html`: Quellseiten der Kapitel.
- `assets/css/book.css`: Buchlayout und didaktische Elemente.
- `assets/css/n8n-ui.css`: n8n-UI-Nachbauten.
- `assets/js/chapters.js`: Inhaltsverzeichnis und Kapitelstatus.
- `assets/js/book.js`: Navigation, Suche, Pfeilmarker, Canvas-Anpassungen.
- `build.js`: baut die Einzeldatei.
- `dist/n8n-werkbuch.html`: generiertes Bundle, niemals von Hand bearbeiten.

## Arbeitsregeln

- Sprache im Buch: Deutsch, du-Form, klar, kleinschrittig.
- Kapitel müssen nachbaubar sein: jeder Klick einzeln, keine Sprünge wie
  "konfiguriere den Node".
- Praxis-Kapitel brauchen: `.prereq`, `ol.steps`, "Wenn etwas schiefgeht",
  `callout--pareto` für 80/20-Hinweise und konkrete Testfälle.
- Keine echten Secrets, Tokens, Kundendaten oder personenbezogenen Daten einbauen.
- Für n8n-Abbildungen vorhandene Klassen aus `n8n-ui.css` verwenden. Keine
  ad-hoc-Komponenten erfinden, wenn ein bestehendes Muster reicht.
- `dist/` nur über `node build.js` aktualisieren.

## Neues Kapitel

1. Bestehende Kapitelseite als Vorlage verwenden.
2. `<body data-slug="..." data-base="..">` korrekt setzen.
3. Pflichtstruktur beibehalten: `#app`, `#sidebar`, `#content`, `#bookbar`,
   `article`, `#prevnext`.
4. In `assets/js/chapters.js` den Kapitelstatus auf `ready` setzen.
5. `node build.js` ausführen.
6. Relevante Syntaxprüfungen ausführen.

## Prüfungen

Nach Inhalts-, CSS- oder JS-Änderungen:

```bash
node build.js
node --check assets/js/book.js
node --check assets/js/chapters.js
```

Bei HTML-Kapiteln zusätzlich grob prüfen:

- `<article>...</article>` vorhanden.
- Verweise auf CSS/JS korrekt.
- Canvas-Abbildungen laufen mobil horizontal scrollbar, nicht gestaucht.
- Kein globales `scroll-behavior: smooth`, kein `backdrop-filter`.

## Git

- Aktueller Arbeitsbranch: `claude/n-acht-n-workflows-guide-EWQxg`.
- `main` und Feature-Branch sollen denselben Stand tragen.
- Commit-Messages: Deutsch, knapp, sachlich.
- Keine Pull Requests erstellen, außer ausdrücklich verlangt.
- Push auf `main` nur bei expliziter Freigabe.

Typischer Abschluss:

```bash
node build.js
git add -A
git commit -m "Kurze deutsche Beschreibung"
git push origin claude/n-acht-n-workflows-guide-EWQxg
git branch -f main HEAD
git push origin main
```

## Pflege dieser Datei

Diese Datei bleibt absichtlich schlank. Keine Logbücher, keine Sitzungshistorie,
keine langen Statuslisten einfügen. Nur aktualisieren, wenn sich Einstiegspunkt,
Arbeitsregeln, Build-/Git-Ablauf oder Projektstruktur wirklich ändern.
