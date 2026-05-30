# Design: Kapitel 25 - Sicherheit, Queue-Mode & Skalierung

## Ziel

Kapitel 25 schließt Teil 5 des n8n-Werkbuchs ab. Es erklärt, wann ein n8n-Workflow produktionsreif ist: nicht nur, wenn er in der Oberfläche läuft, sondern wenn Zugriffe, Ausfälle, Last und parallele Ausführungen bedacht sind.

Die Zielgruppe bleibt Einsteiger:innen ohne Programmierkenntnisse. Das Kapitel darf technische Begriffe verwenden, muss sie aber konkret, kleinschrittig und prüfbar erklären.

## Zuschnitt

Das Kapitel wird als praxisnahes Betriebs-Kapitel umgesetzt, nicht als vollständiges Serverhandbuch. Es behandelt drei Fragen:

1. Wie sichere ich eine produktive n8n-Instanz grundsätzlich ab?
2. Warum reicht eine einzelne n8n-Instanz bei Last oder langen Jobs oft nicht mehr aus?
3. Was leistet der Queue-Mode mit Main-Prozess, Redis, Worker und Datenbank?

Der empfohlene Aufbau ist:

- Einstieg mit Warnung vor "läuft bei mir" als unzureichendem Produktionskriterium.
- Voraussetzungen mit Testinstanz, Grundwissen zu Credentials, Deployment und Performance.
- 80/20-Hinweis zu den wichtigsten Betriebsentscheidungen.
- Schrittfolge vom einfachen Betrieb zum Queue-Mode-Modell.
- Visualisierung Single-Instance gegen Queue-Mode mit bestehenden n8n-UI-Klassen.
- Fehlersuche: Worker startet nicht, Jobs bleiben liegen, Webhooks reagieren nicht, zu viele parallele Jobs.
- Konkrete Testfälle und Abschluss-Checkliste.

## Nicht-Ziele

- Kein vollständiger Docker-Compose-Produktionsstack.
- Keine echten Secrets, Token, Kundendaten oder personenbezogenen Daten.
- Keine Cloud-Anbieter-spezifische Anleitung.
- Keine tiefe Redis-, Kubernetes- oder Reverse-Proxy-Schulung.

## Dateien

- Neues Kapitel: `kapitel/25-skalierung.html`
- Manifest-Update: `assets/js/chapters.js`, Status von `25-skalierung` auf `ready`
- Generiertes Bundle: `dist/n8n-werkbuch.html` nur über `node build.js`

## Qualitätskriterien

- Das Kapitel nutzt die bestehende Kapitelstruktur mit `#app`, `#sidebar`, `#content`, `#bookbar`, `article` und `#prevnext`.
- Es enthält `.prereq`, `ol.steps`, einen Abschnitt "Wenn etwas schiefgeht", einen `callout--pareto` und konkrete Testfälle.
- Die Abbildungen verwenden vorhandene Klassen aus `assets/css/n8n-ui.css` und bleiben horizontal scrollbar statt mobil gestaucht zu werden.
- Die Sprache ist deutsch, du-Form, präzise und kleinschrittig.
- Nach der Umsetzung laufen:
  - `node build.js`
  - `node --check assets/js/book.js`
  - `node --check assets/js/chapters.js`
