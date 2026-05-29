# Das n8n-Werkbuch

Ein praktisches, reich bebildertes Lehrbuch, mit dem man **n8n-Workflows Schritt für Schritt nachbauen**
kann — vom ersten Klick bis zum KI-Agenten. Die Besonderheit: Die gezeigten „Screenshots“ sind
**detailgetreue HTML/CSS-Nachbildungen der echten n8n-Oberfläche** (Stand 2025) und damit gestochen
scharf, konsistent und barrierearm.

> „n8n“ ist eine Marke der n8n GmbH. Dieses Buch ist ein **unabhängiges Lernprojekt** und kein
> offizielles Produkt von n8n.

## Lesen

Öffne einfach **`index.html`** im Browser — kein Server, kein Build-Schritt nötig
(funktioniert auch per `file://`).

```
index.html   ← hier starten: Cover, Lernpfad & Inhaltsverzeichnis
```

Optional mit lokalem Server (z. B. für saubere Pfade):

```bash
python3 -m http.server 8000   # dann http://localhost:8000 öffnen
```

## Aufbau des Projekts

```
n8n-buch/
├── index.html                  # Startseite: Cover, Lernpfad, vollständiges Inhaltsverzeichnis
├── kapitel/                    # die einzelnen Kapitel als HTML-Seiten
│   ├── 00-vorwort.html
│   ├── 00-pareto.html          # Das 80/20 von n8n – die wichtigen 35 %
│   ├── 01-was-ist-n8n.html
│   ├── 02-installation.html
│   ├── 03-oberflaeche.html     # Oberflächen-Tour (visuell sehr dicht)
│   ├── 04-erster-workflow.html # erstes Projekt, klick-für-klick
│   ├── 05-kernkonzepte.html    # Items, JSON, Datenfluss, Expressions
│   ├── 06-expressions.html     # Ausdruckseditor
│   ├── 07-trigger.html         # Trigger-Nodes
│   ├── 08-http.html            # HTTP-Request-Node
│   ├── 09-transform.html       # Daten transformieren
│   ├── 10-flow.html            # IF, Switch, Merge, Loops
│   ├── 11-fehler.html          # Fehlerbehandlung
│   ├── 12-credentials.html     # Credentials & Authentifizierung
│   ├── 13-projekt-wetter.html  # Projekt: Wetter-Report per Telegram
│   ├── 14-projekt-form.html    # Projekt: Formular → Sheets → Slack
│   ├── 15-projekt-news.html    # Projekt: News-Aggregator mit Filter
│   └── 16-projekt-leads.html   # Projekt: Lead-Routing ins CRM
└── assets/
    ├── css/
    │   ├── book.css            # Layout, Typografie, didaktische Elemente
    │   └── n8n-ui.css          # 1:1-Komponentenbibliothek der n8n-Oberfläche
    └── js/
        ├── chapters.js         # das komplette Inhaltsverzeichnis (Manifest)
        └── book.js             # Sidebar, Navigation, Suche, Vor/Zurück
```

## Inhalt

Das vollständige Inhaltsverzeichnis (25+ Kapitel über 6 Teile) lebt in
`assets/js/chapters.js`. Aktueller Ausbaustand:

- **Fertig:** Teil 0, Teil 1, Teil 2 sowie Projekt 1–4.
- **Geplant (markiert „bald“):** weitere Praxis-Projekte, KI-Agenten & RAG,
  Betrieb/Skalierung sowie Anhänge.

## Neue Kapitel hinzufügen

1. HTML-Seite in `kapitel/` anlegen (eine bestehende als Vorlage kopieren — sie
   teilen sich Aufbau, `data-slug` und `data-base`).
2. In `assets/js/chapters.js` den passenden Eintrag von `status: "soon"` auf
   `status: "ready"` setzen.

Die Navigation (Sidebar, Vor/Zurück, Übersicht) aktualisiert sich daraus automatisch.

## Wiederverwendbare UI-Komponenten

`assets/css/n8n-ui.css` enthält u. a.: Editor-Topbar, Aktiv-Schalter, Canvas mit
Punktraster, Nodes (inkl. Trigger-Form, Status-Badges, Werkzeugleiste),
Verbindungslinien (SVG), das Node-Auswahl-Panel und die komplette
Node-Detailansicht (NDV) mit Input/Parameter/Output, Tabellen-, JSON- und
Schema-Ansicht. Damit lassen sich neue Abbildungen schnell zusammensetzen.
