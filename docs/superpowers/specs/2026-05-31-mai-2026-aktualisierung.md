# Mai-2026-Aktualisierung

Ziel: Das n8n-Werkbuch auf den Stand 31.05.2026 bringen, ohne `dist/` manuell zu bearbeiten.

Priorität:

1. Kapitel 01, 02, 03 und 07 zuerst aktualisieren, weil sie Grundbegriffe, Setup und UI-Modell prägen.
2. Projekte 13-25 danach gegen vier Prüffragen lesen: Publish/Unpublish statt altem Aktiv-Modell, AI Agent v3.x, Task Runner bei Code-Nodes, keine deprecated Nodes.
3. `dist/n8n-werkbuch.html` ausschließlich über `node build.js` erneuern.

Fachliche Leitplanken:

- n8n speichert Bearbeitungen automatisch als Draft; produktiv wird eine Version erst durch `Publish`.
- `Unpublish` entfernt die produktive Version; Drafts bleiben bearbeitbar.
- AI Agent ist aktuell als Tool-Agent zu erklären: Chat Model plus mindestens ein Tool. Für reine Textklassifikation ist eine Chain oder ein spezialisierter KI-Node didaktisch sauberer.
- Der alte `HTTP Request Tool`-Node ist legacy; neue Agenten-Tools werden über den normalen `HTTP Request`-Node als Tool gebaut.
- Code-Nodes bleiben erlaubt, müssen aber im Self-hosted-Betrieb mit Task Runnern eingeordnet werden; Produktion bevorzugt externe Task Runner.
- Bekannte deprecated Nodes wie `Function`, `Function Item`, `Cron`, `Interval`, `Read PDF`, `HTTP Request Tool` und `Manual Chat Trigger` nicht neu empfehlen.

Prüfung:

```bash
node build.js
node --check assets/js/book.js
node --check assets/js/chapters.js
```
