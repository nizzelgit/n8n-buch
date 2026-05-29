# CLAUDE.md — Projektleitfaden für „Das n8n-Werkbuch“

Diese Datei richtet sich an Claude (und andere Mitwirkende). Sie beschreibt, **was** das
Projekt ist, **wie** es aufgebaut ist und **welche Konventionen** verbindlich gelten. Bitte
vor jeder Änderung lesen.

---

## 1. Worum geht es?

Ein **deutschsprachiges Online-Lehrbuch**, das Schritt für Schritt zeigt, wie man
**n8n-Workflows baut** — vom ersten Klick bis zum KI-Agenten. Zielgruppe sind Einsteiger:innen
ohne Programmierkenntnisse.

**Das Alleinstellungsmerkmal:** Die „Screenshots“ sind **keine Bilder**, sondern
**detailgetreue HTML/CSS-Nachbildungen der echten n8n-Oberfläche** (Stand 2025, Canvas v2 /
Vue-Flow). Dadurch sind sie scharf, konsistent, durchsuchbar und leicht pflegbar.

> „n8n“ ist eine Marke der n8n GmbH. Dieses Buch ist ein **unabhängiges Lernprojekt**, kein
> offizielles Produkt. Diesen Hinweis in Footer/README beibehalten.

---

## 2. Projektstruktur

```
n8n-buch/
├── index.html                  # Startseite: Cover, Lernpfad, vollständiges Inhaltsverzeichnis
├── kapitel/                    # je eine HTML-Seite pro Kapitel
│   ├── 00-vorwort.html
│   ├── 00-pareto.html
│   ├── 01-was-ist-n8n.html
│   ├── 02-installation.html
│   ├── 03-oberflaeche.html
│   ├── 04-erster-workflow.html
│   └── 05-kernkonzepte.html
├── assets/
│   ├── css/
│   │   ├── book.css            # Layout, Typografie, didaktische Bausteine, Responsiv
│   │   └── n8n-ui.css          # 1:1-Komponentenbibliothek der n8n-Oberfläche
│   └── js/
│       ├── chapters.js         # MANIFEST: das komplette Inhaltsverzeichnis (window.BOOK)
│       └── book.js             # Sidebar, Topbar, Vor/Zurück, Suche, Pfeil-Marker-Injektion
├── build.js                    # bündelt alles in EINE Datei: dist/n8n-werkbuch.html
├── dist/n8n-werkbuch.html      # generiertes Einzeldatei-Bundle (NICHT von Hand editieren)
├── README.md
└── CLAUDE.md                   # diese Datei
```

---

## 3. Build & Auslieferung

- **Kein Framework, kein Paketmanager.** Reines HTML/CSS/JS, läuft direkt im Browser (auch `file://`).
- Es gibt zwei Auslieferungsformen:
  1. **Mehrseitig** (`index.html` + `kapitel/*.html`) — die Quelle, hier wird editiert.
  2. **Einzeldatei** (`dist/n8n-werkbuch.html`) — generiert via `node build.js`, ideal zum
     Verschicken/Offline-Lesen.

### Nach JEDER inhaltlichen Änderung:
```bash
node build.js          # erzeugt dist/n8n-werkbuch.html neu
node --check assets/js/book.js     # JS-Syntax prüfen (bei JS-Änderungen)
node --check assets/js/chapters.js
```
`build.js` extrahiert den Inhalt zwischen `<article>…</article>` jeder „ready“-Seite, inlined
beide Stylesheets und baut eine eigene Hash-Navigation. **`dist/` niemals von Hand bearbeiten** —
immer neu generieren.

---

## 4. Neues Kapitel anlegen

1. Eine bestehende Kapitelseite als Vorlage kopieren (Aufbau, `data-slug`, `data-base="..")` ).
2. In `assets/js/chapters.js` den passenden Eintrag von `status: "soon"` auf `status: "ready"`
   setzen (oder neuen Eintrag ergänzen). `slug` muss dem Dateinamen ohne `.html` entsprechen.
3. `node build.js` ausführen.

Sidebar, Übersicht und Vor/Zurück bauen sich automatisch aus dem Manifest.

### Pflicht-Gerüst jeder Kapitelseite
- `<body data-slug="…" data-base="..">`
- Einbindung: `../assets/css/book.css`, `../assets/css/n8n-ui.css`,
  `../assets/js/chapters.js`, `../assets/js/book.js`
- Struktur: `#app > (#sidebar, #content > (#bookbar, article, #prevnext))`
- `article` beginnt mit `.chap-eyebrow`, `h1.chap-title`, `.chap-lede`, `.chap-meta`.

---

## 5. Verbindliche Inhalts- & Didaktik-Konventionen

Diese Punkte sind der Kern dessen, was der Auftraggeber will. **Nicht davon abweichen.**

- **Sprache:** Deutsch, „du“-Form, klar und freundlich. Fachbegriffe beim ersten Auftreten erklären.
- **Maximale Kleinschrittigkeit.** Jede Bedienhandlung als *eigener* Schritt: wohin klicken, was
  greifen, was man danach sieht. **Keine Sprünge** à la „dann konfiguriere den Node“ — stattdessen
  jeden Klick einzeln. Referenz für das Zielniveau ist **`kapitel/04-erster-workflow.html`**.
- **Immer mitliefern:**
  - `ol.steps` für nummerierte Klick-Anleitungen (mit `<h4>`-Titel je Schritt).
  - „Was du jetzt siehst“-Beschreibungen nach kritischen Aktionen.
  - **„Wenn etwas schiefgeht“**-Kästen (`.callout--warn`) an fehleranfälligen Stellen.
  - **`⚡`-markierte 80/20-Hinweise** (`.callout--pareto`) für das wirklich Wichtige.
  - Eine **Voraussetzungs-Box** (`.prereq`) am Kapitelanfang bei Praxis-Kapiteln.
- **Vom Kleinen zum Großen:** erst winzige Beispiele, dann wachsende Projekte.
- **Echte, nachbaubare Beispiele.** Bevorzugt Dienste ohne Anmeldung (z. B. Open-Meteo).
  Niemals echte Secrets/Tokens einbetten — nur Platzhalter.

---

## 6. n8n-UI-Komponenten korrekt verwenden (`n8n-ui.css`)

Beim Erstellen neuer Abbildungen diese Bausteine nutzen (keine neuen Ad-hoc-Styles erfinden):

- **Editor-Rahmen:** `.n8n` → optional `.n8n__chrome`, dann `.n8n-topbar`, `.n8n-tabs`, `.n8n-canvas`.
- **Topbar:** `.n8n-logo`, `.n8n-breadcrumb`, `.n8n-wfname`, `.n8n-toggle` + `.n8n-switch`(`.is-on`).
- **Canvas:** `.n8n-canvas` (Punktraster); Nodes absolut mit `left`/`top` in **px** positionieren.
- **Node:** `.n8n-node` mit `.n8n-node__icon`, `.n8n-node__label`; Modifier:
  `.n8n-node--trigger` (linke Seite abgerundet, **kein** Eingang), `.n8n-node--selected`,
  `.n8n-node--code`, `.n8n-node--ai`. Punkte: `.ep.in` / `.ep.out`. Status: `.badge--ok` / `--err`.
  Items-Zähler: `.items`.
- **Verbindungen:** ein `<svg class="n8n-conns" viewBox="0 0 B H" preserveAspectRatio="none">` mit
  `<path d="M … C …">`. **Pfeilspitzen kommen automatisch** über `marker-end` (in `n8n-ui.css`),
  Marker werden global injiziert (siehe unten). Aktiven Datenfluss = `class="is-active"` (pink).
- **Node-Detailansicht (NDV):** `.ndv` → `.ndv__bar` + `.ndv__cols` (3×) → `.ndv-panel`
  (`.ndv-params` für Mitte), Felder: `.n8n-field`/`.n8n-input`(`.is-expr`)/`.n8n-select`,
  Reiter `.ndv-fxtab` (Fest/Expression), Ausgabe: `.ndv-viewtabs` + `.n8n-table`/`.n8n-json`/`.n8n-schema`.
- **Node-Auswahl-Panel:** `.nodes-panel` mit `.nodes-panel__search` und `.nodes-panel__item`.

### Pfeilspitzen-Marker (wichtig!)
Die SVG-Marker `#n8n-arrow` (grau) und `#n8n-arrow-active` (pink) müssen im Dokument existieren:
- Kapitelseiten: werden von `book.js` (`injectArrowDefs()`) injiziert.
- `index.html` **und** `build.js`-Template: als statisches `<svg id="n8n-arrow-defs">` enthalten.
Wer eine neue eigenständige HTML-Datei mit Verbindungen baut, muss diese defs einbinden.

### Abbildungen einbetten
In `<figure class="figure"><div class="frame"> … </div><figcaption>…</figcaption></figure>`.
Caption beginnt mit `<span class="fig-tag">Abb. X.Y</span>`.

---

## 7. Design-Tokens (nicht hart kodieren, Variablen nutzen)

- n8n-Markenpink: `--n8n-primary: #ea4b71`. Canvas-Hintergrund `--n8n-canvas-bg`, Punkte `--n8n-dot`.
- Buch-Akzent identisch (`--book-accent`). Serifenschrift (Lora) für Überschriften, Inter für Text,
  JetBrains Mono für Code/Expressions.

---

## 8. Responsiv & Performance (gelernte Lektionen)

- **Kein `backdrop-filter`** und **kein globales `scroll-behavior: smooth`** — verursachten ruckeliges
  Scrollen auf Mobilgeräten.
- Auf `≤1000px`: Canvas-Punktraster → flache Fläche, große `box-shadow` aus (Scroll-Performance).
- Auf `≤840px`: Canvas-Diagramme (`.figure .frame:has(.n8n-canvas)`) werden in **Originalgröße
  horizontal scrollbar** statt gestaucht/abgeschnitten. NDV-/Panel-Abbildungen stapeln separat.
- Immer in echtem Chrome testen, nicht nur im In-App-Viewer.

---

## 9. Git-Konventionen

- Entwicklung **ausschließlich** auf dem zugewiesenen Branch
  `claude/n-acht-n-workflows-guide-EWQxg`. Nicht auf andere Branches pushen.
- Commit-Messages auf Deutsch, beschreibend, im Imperativ/Sachstil.
- Nach Änderungen: `node build.js` (Bundle aktualisieren) **vor** dem Commit, damit `dist/` aktuell ist.
- **Keine** Pull Requests erstellen, außer es wird ausdrücklich verlangt.

---

## 10. Aktueller Stand & nächste Schritte

**Fertig:** Vorwort, 80/20, Was ist n8n, Installation, Oberfläche, erster Workflow (Referenz für
Detailgrad), Kernkonzepte.

**Als Nächstes geplant** (im Manifest `status: "soon"`): Expressions vertieft (Kap. 6), alle
Bausteine im Detail (7–12), sechs wachsende Projekte (13–19), KI-Agenten & RAG (20–21),
Betrieb/Skalierung (22–25), Anhänge (A–D).

Beim Ausbau jeweils den Detailgrad und die Didaktik-Bausteine aus Abschnitt 5 einhalten.
