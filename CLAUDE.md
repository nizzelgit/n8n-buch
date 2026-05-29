# CLAUDE.md — Projektleitfaden für „Das n8n-Werkbuch“

Diese Datei richtet sich an Claude (und andere Mitwirkende). Sie beschreibt, **was** das
Projekt ist, **wie** es aufgebaut ist und **welche Konventionen** verbindlich gelten. Bitte
vor jeder Änderung lesen.

> ## ⚠️ WICHTIGSTE REGEL: Diese Datei aktuell halten
> **Nach JEDER Änderung — insbesondere nach jedem hinzugefügten oder überarbeiteten Kapitel —
> wird diese `CLAUDE.md` aktualisiert**, bevor committet/gepusht wird. Konkret zu pflegen:
> - **Abschnitt 10 → „Status“**: welche Kapitel `ready` sind, was als Nächstes drankommt.
> - **Abschnitt 11 → „Logbuch“**: ein neuer datierter Eintrag, was in dieser Sitzung passiert ist.
> - Falls sich Konventionen/Technik geändert haben: den jeweiligen Abschnitt anpassen.
>
> Grund: `CLAUDE.md` wird bei einem Session-Neustart automatisch in den Kontext geladen. So kann
> mit frischem Kontext **exakt dort weitergemacht werden, wo wir aufgehört haben.**

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
- **Ausdruckseditor (Expression):** Live-Ergebnis direkt unter einem `.n8n-input.is-expr` über
  `.n8n-expr-result` (mit `.lbl` „Ergebnis“; Fehler = `.is-error`). Größerer Editor: `.n8n-expr` →
  `.n8n-expr__head` + `.n8n-expr__code` + `.n8n-expr__result`. Resolvable-Platzhalter im Code mit
  `.expr-tok` umranden (Variablen `$json`/`$now` darin als `.expr-var`). Autovervollständigung:
  `.n8n-autocomplete` mit `.ac`-Zeilen (`.nm`/`.desc`/`.ty`, aktive Zeile `.is-active`).
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

- Entwickelt wird auf dem vom Harness zugewiesenen Feature-Branch. **Aktuell:**
  `claude/optimistic-shannon-TJ1d8`. (Der Name kann je Session wechseln — dann hier **und** in
  `.github/workflows/pages.yml` anpassen.)
- **`main` und der Feature-Branch werden synchron gehalten** (beide enthalten denselben Stand),
  damit eine frisch gestartete Session den kompletten Stand vorfindet — egal welcher Branch als
  Default ausgecheckt wird. Nach dem Commit also **beide** Branches pushen:
  ```bash
  node build.js
  git add -A && git commit -m "…"
  git push origin claude/optimistic-shannon-TJ1d8
  git branch -f main HEAD && git push origin main
  ```
  Hinweis: In Web-Sessions ist ein Push auf `main` ggf. erst nach ausdrücklicher Freigabe erlaubt.
- Commit-Messages auf Deutsch, beschreibend, im Imperativ/Sachstil.
- `node build.js` (Bundle aktualisieren) **vor** dem Commit, wenn sich Inhalt/CSS/JS geändert hat
  (reine `CLAUDE.md`-Änderungen brauchen keinen Rebuild).
- **Keine** Pull Requests erstellen, außer es wird ausdrücklich verlangt.
- GitHub Pages: `.github/workflows/pages.yml` deployt bei Push auf `main` **oder** den Feature-Branch.

---

## 10. Status (immer aktuell halten!)

**✅ Fertig (`status: "ready"` im Manifest):**
- `00-vorwort` — Vorwort & Lesehinweise
- `00-pareto` — Das 80/20 von n8n (die wichtigen 35 %)
- `01-was-ist-n8n` — Konzept, Begriffe, Vergleich Zapier/Make
- `02-installation` — Cloud / npx / Docker
- `03-oberflaeche` — Oberflächen-Tour (visuell dicht)
- `04-erster-workflow` — **Referenzkapitel für den Detailgrad** (47 Einzelschritte)
- `05-kernkonzepte` — Items, JSON, Datenfluss, Expressions-Einstieg
- `06-expressions` — Ausdruckseditor, Variablen-Werkzeugkasten, Text/Zahlen/Datum, Bedingungen, Fehlertabelle
- `07-trigger` — Trigger-Nodes: Manual/Schedule/Webhook, Aktiv-Schalter, Test- vs. Production-URL
- `08-http` — HTTP-Request-Node: Methoden, Query/Headers/Body, Import cURL, Fehlercodes, POST-Übung
- `09-transform` — Set (Edit Fields), Filter, Code (2 Modi), weitere Transform-Nodes, Mini-Übung
- `10-flow` — IF (2 Ausgänge), Switch, Merge (Append/Combine), Loops (selten nötig!), Verzweigungs-Übung
- `11-fehler` — Retry On Fail, Fehlerausgang (On Error), globaler Error-Workflow (Error Trigger), Stop and Error
- `12-credentials` — Credentials sicher anlegen, vordefiniert vs. generisch (Header Auth), OAuth, Sicherheits-Gewohnheiten

> **Teil 0, 1 und 2 sind damit vollständig (Kap. 00–12).**

**🔜 Als Nächstes (`status: "soon"`), empfohlene Reihenfolge:**
1. `13-projekt-wetter` — **erstes vollständiges Projekt** (Teil 3): Schedule → HTTP → Set → Telegram, end-to-end
2. weitere Projekte `14`–`19` (steigende Komplexität)
3. danach KI 20–21, Betrieb 22–25, Anhänge A–D

**Hinweis zu Projekt-Kapiteln (Teil 3):** Sie sind länger/umfangreicher als die Bausteine. Sie sollten die in
Kap. 4 etablierte Schritt-für-Schritt-Tiefe haben und auf den fertigen Bausteinen (07–12) aufbauen, statt
deren Grundlagen zu wiederholen (stattdessen verlinken/verweisen).

**Beim Ausbau zwingend:** Detailgrad + Didaktik-Bausteine aus Abschnitt 5 einhalten, danach
`node build.js`, dann **diese Datei (Abschnitt 10 + 11) aktualisieren**, dann committen/pushen.

---

## 11. Logbuch (neuester Eintrag oben)

### 2026-05-29 — Stand auf `main` konsolidiert, Doku aufgefrischt
- **`main` trägt den vollständigen Stand:** `HEAD` = `origin/main` = `origin/claude/optimistic-shannon-TJ1d8`
  (identischer Commit; Differenz 0/0). Alle **14 Kapitel (00–12)** liegen auf `main`. Es war nichts gesondert zu
  „mergen", weil `main` nach jedem Commit gespiegelt wird (vgl. §9) — der Merge ist damit faktisch laufend erledigt.
- Eine frisch gestartete Session findet also **egal auf welchem Branch** den kompletten Stand vor.
- Diese CLAUDE.md auf Wunsch aktualisiert (dieser Eintrag); §10-Status und §9-Konventionen sind aktuell.
- Nächster offener Block unverändert: **Teil 3 (Projekte) ab `13-projekt-wetter`**.

### 2026-05-29 — Teil 2 abgeschlossen: Kapitel 11 (Fehler) & 12 (Credentials)
- **Kapitel 11 „Fehlerbehandlung & Error-Workflows"** (`ready`): drei Ebenen — Retry On Fail (Settings-Reiter),
  Fehlerausgang via „On Error → Continue (using error output)" (Canvas mit zweitem roten Ausgang, `$json.error`),
  globaler Error-Workflow (Error Trigger + Workflow-Settings „Error Workflow"), „Stop and Error", Mini-Übung.
- **Kapitel 12 „Credentials & Authentifizierung"** (`ready`): Credential-Konzept (verschlüsselt, getrennt vom
  Workflow), vordefiniert vs. generisch (Header Auth), Anlegen Schritt-für-Schritt, OAuth-Klick-Login,
  Sicherheits-Gewohnheiten, Mini-Übung (Header-Token), Selbsttest.
- `node build.js` → **14 Kapitel** im Bundle. Tag-Balance & Escaping geprüft.
- **Meilenstein: Teil 0+1+2 komplett (Kap. 00–12).** Nächster großer Block: Projekte (Teil 3) ab `13-projekt-wetter`.

### 2026-05-29 — Kapitel 9 (Transform) & 10 (Flow-Logik)
- **Kapitel 9 „Daten transformieren: Set, Code & Filter"** (`ready`): Rangfolge (erst no-code, dann Code),
  Edit Fields/Set (Felder, „Include Other Input Fields"), Filter (Conditions, ein Ausgang), Code (2 Modi:
  All Items vs. Each Item, return-Form), weitere Transform-Nodes (Sort/Limit/Remove Duplicates/Aggregate/
  Split Out), Mini-Übung (Wetter eindampfen), Selbsttest.
- **Kapitel 10 „Flow-Logik: IF, Switch, Merge & Loops"** (`ready`): IF (2 Ausgänge true/false, Canvas-Abb.
  mit zwei `.ep.out`), Switch (Rules/Expression), Merge (Append/Combine, Canvas mit zwei `.ep.in`), Loops
  (Loop Over Items mit Rücklinie — Betonung: dank „pro Item" meist unnötig), IF-Verzweigungs-Übung, Selbsttest.
- Mehrfach-Endpunkte an Nodes per Inline-`style="top:…"` auf `.ep.out`/`.ep.in` gelöst (zwei/mehr Punkte).
- `node build.js` → **12 Kapitel** im Bundle. Tag-Balance, `&gt;`/`&lt;`-Escaping geprüft.
- **Teil 2 fast komplett** — es fehlen nur noch `11-fehler` und `12-credentials`.

### 2026-05-29 — Teil 2 gestartet: Kapitel 7 (Trigger) & 8 (HTTP)
- **Kapitel 7 „Trigger-Nodes: Manual, Schedule, Webhook"** (`ready`): Trigger-Form, Manual als Bau-Werkzeug,
  Schedule (Intervalle/Cron, Zeitzone), Webhook (Test- vs. Production-URL, „Listen for test event",
  `$json.query`/`.body`/`.headers`), der **Aktiv**-Schalter (Topbar-Toggle), Überblickstabelle, Mini-Übung
  (Wetter-Workflow von Manual auf täglich-8-Uhr umstellen + aktivieren), Selbsttest.
- **Kapitel 8 „Der HTTP-Request-Node"** (`ready`): Aufbau eines Requests, Methoden GET/POST/PUT/DELETE,
  Query-Parameter als Name/Wert-Liste, Body (JSON) mit Expressions, Zahl-vs-Text-Falle, Response-Optionen
  (Autodetect, Split Into Items), Auth-Anriss (Verweis Kap. 12), Fehlercode-Tabelle (401/404/429/400/500),
  Import-cURL-Tipp, Mini-Übung (POST an postman-echo.com), Selbsttest.
- `node build.js` → **10 Kapitel** im Bundle. Tag-Balance & `&gt;`-Escaping für beide geprüft.
- Beide Kapitel halten den Referenz-Detailgrad (Kap. 4/6) ein. Weiter: `09-transform` (Outro von Kap. 8 dorthin).
- Pages-Hinweis: Live-Deploy via `github.io` hängt noch an der Repo-Einstellung *Settings → Pages → Source:
  „GitHub Actions"* (vom Nutzer zu setzen). Vorschau zwischenzeitlich über raw.githack.com möglich.

### 2026-05-29 — Kapitel 6 (Expressions) + neue Ausdruckseditor-Komponente
- **Kapitel 6 „Expressions & der Ausdruckseditor"** geschrieben (status `ready`): Fest/Expression-Schalter,
  Aufbau einer Expression, Variablen-Werkzeugkasten (`$json`, `$('Node')`, `$now`, `$today`, `$input`, …),
  Text/Zahlen/Datum (Luxon: `toFormat`, `plus`/`minus`, `toDateTime`), Entscheidungen (Ternary, `||`, `?.`),
  Autovervollständigung + Drag-and-drop, Mini-Übung am Wetter-Workflow aus Kap. 4, Fehlertabelle, Selbsttest.
- **Neue, wiederverwendbare UI-Komponente** in `n8n-ui.css` (in §6 dokumentiert): der Ausdruckseditor —
  `.n8n-expr-result` (Live-Ergebnis), `.n8n-expr` (`__head`/`__code`/`__result`), `.expr-tok`/`.expr-var`
  (Resolvable-Hervorhebung), `.n8n-autocomplete` (Vorschlagsliste).
- `node build.js` → **8 Kapitel** im Bundle. Tag-Balance (div/figure/table/ol/ul) & `&gt;`-Escaping geprüft.
- **Branch umgestellt:** Diese Session läuft auf `claude/optimistic-shannon-TJ1d8`. §9 und der
  Pages-Trigger in `.github/workflows/pages.yml` wurden auf diesen Namen umgestellt (vorher
  `claude/n-acht-n-workflows-guide-EWQxg`). `main` wurde nach Freigabe wieder synchronisiert.
- Weiter: `07-trigger` — das Outro von Kap. 6 führt bereits dorthin.

### 2026-05-29 — main-Branch angelegt, Branches synchron, Pages-Trigger erweitert
- Ursache „keine Commits“ in frischer Session: es gab nur den Feature-Branch, **kein `main`**.
- **`main` angelegt** mit komplettem Stand; ab jetzt werden beide Branches synchron gehalten
  (siehe Abschnitt 9). Frischer Session-Start funktioniert damit von jedem Default-Branch aus.
- `pages.yml` triggert jetzt auf `main` **und** Feature-Branch.

### 2026-05-29 — Mobile-Fidelity, Pfeile, Kapitel 4, Doku
- Verbindungs-**Pfeilspitzen** (n8n-getreu) eingebaut: SVG-Marker `#n8n-arrow`/`#n8n-arrow-active`,
  per CSS `marker-end` + `vector-effect: non-scaling-stroke`. Marker werden injiziert (book.js) bzw.
  liegen statisch in `index.html` und im `build.js`-Template.
- **Kapitel 4 komplett neu** geschrieben, von ~15 auf 47 Einzelschritte (neuer Detailgrad-Standard).
- **Mobile-Performance** gefixt: kein `backdrop-filter`, kein globales `scroll-behavior:smooth`;
  ≤1000px flacher Canvas-Hintergrund + Schatten aus; ≤840px Canvas-Diagramme horizontal scrollbar.
- `CLAUDE.md` angelegt und um Logbuch + „immer aktuell halten“-Regel erweitert.
- Hinweis: Ruckeln zuvor lag nur am In-App-Viewer; in echtem Chrome flüssig.

### 2026-05-29 — Projektstart
- Buch-Gerüst (HTML-Website), `n8n-ui.css`-Komponentenbibliothek, Manifest (`chapters.js`),
  Navigation (`book.js`), Einzeldatei-Bundle (`build.js` → `dist/`).
- Erste 7 Kapitel (Teil 0 + Grundlagen) geschrieben.

> **Vorlage für neuen Logbuch-Eintrag:**
> `### JJJJ-MM-TT — Kurztitel`
> `- Was geändert/hinzugefügt wurde (Kapitel-Slugs nennen).`
> `- Offene Punkte / wo als Nächstes weitermachen.`
