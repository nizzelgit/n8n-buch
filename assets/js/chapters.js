/* =========================================================================
   chapters.js — Das vollständige Inhaltsverzeichnis des Buchs.
   Wird als reines JS geladen (kein fetch), damit das Buch auch lokal
   per file:// ohne Server funktioniert.
   status: "ready"  -> Kapitel geschrieben
           "soon"   -> geplant, folgt in einer späteren Ausbaustufe
   ========================================================================= */
window.BOOK = {
  title: "Das n8n-Werkbuch",
  subtitle: "Workflows bauen — vom ersten Klick bis zum KI-Agenten",
  parts: [
    {
      part: "Teil 0 · Orientierung",
      chapters: [
        { num: "00", slug: "00-vorwort",        title: "Vorwort & wie du dieses Buch nutzt", status: "ready", mins: 8 },
        { num: "0.1", slug: "00-pareto",         title: "Das 80/20 von n8n — die wichtigen 35 %", status: "ready", mins: 12 }
      ]
    },
    {
      part: "Teil 1 · Grundlagen",
      chapters: [
        { num: "1", slug: "01-was-ist-n8n",     title: "Was ist n8n? Konzept & Einsatzgebiete", status: "ready", mins: 14 },
        { num: "2", slug: "02-installation",    title: "Installation & Setup (Cloud, npx, Docker)", status: "ready", mins: 16 },
        { num: "3", slug: "03-oberflaeche",     title: "Die Oberfläche im Detail", status: "ready", mins: 22 },
        { num: "4", slug: "04-erster-workflow", title: "Dein erster Workflow — Schritt für Schritt", status: "ready", mins: 25 },
        { num: "5", slug: "05-kernkonzepte",    title: "Kernkonzepte: Nodes, Items & Datenfluss", status: "ready", mins: 24 },
        { num: "6", slug: "06-expressions",     title: "Expressions & der Ausdruckseditor", status: "ready", mins: 20 }
      ]
    },
    {
      part: "Teil 2 · Bausteine im Detail",
      chapters: [
        { num: "7",  slug: "07-trigger",        title: "Trigger-Nodes (Manual, Schedule, Webhook)", status: "ready", mins: 18 },
        { num: "8",  slug: "08-http",           title: "Der HTTP-Request-Node: jede API ansprechen", status: "ready", mins: 22 },
        { num: "9",  slug: "09-transform",      title: "Daten transformieren (Set, Code, Filter)", status: "ready", mins: 20 },
        { num: "10", slug: "10-flow",           title: "Flow-Logik: IF, Switch, Merge, Loops", status: "ready", mins: 22 },
        { num: "11", slug: "11-fehler",         title: "Fehlerbehandlung & Error-Workflows", status: "ready", mins: 16 },
        { num: "12", slug: "12-credentials",    title: "Credentials & Authentifizierung", status: "ready", mins: 15 }
      ]
    },
    {
      part: "Teil 3 · Projekte (klein → groß)",
      chapters: [
        { num: "13", slug: "13-projekt-wetter", title: "Projekt 1: Täglicher Report per Telegram", status: "ready", mins: 36 },
        { num: "14", slug: "14-projekt-form",   title: "Projekt 2: Formular → Sheets → Slack", status: "ready", mins: 42 },
        { num: "15", slug: "15-projekt-news",   title: "Projekt 3: News-Aggregator mit Filter", status: "ready", mins: 40 },
        { num: "16", slug: "16-projekt-leads",  title: "Projekt 4: Lead-Routing vom Webhook ins CRM", status: "ready", mins: 45 },
        { num: "17", slug: "17-projekt-ai",     title: "Projekt 5: KI-E-Mail-Assistent (AI Agent)", status: "ready", mins: 50 },
        { num: "18", slug: "18-projekt-pdf",    title: "Projekt 6: PDF-/Rechnungs-Extraktion", status: "ready", mins: 55 },
        { num: "19", slug: "19-grossprojekt",   title: "Großprojekt: Content-Pipeline end-to-end", status: "ready", mins: 70 }
      ]
    },
    {
      part: "Teil 4 · KI & Agenten",
      chapters: [
        { num: "20", slug: "20-ai-agent",       title: "AI-Agent, Chat-Trigger, Memory & Tools", status: "ready", mins: 38 },
        { num: "21", slug: "21-rag",            title: "RAG: Vektorstores & Q&A über eigene Daten", status: "ready", mins: 45 }
      ]
    },
    {
      part: "Teil 5 · Profi & Betrieb",
      chapters: [
        { num: "22", slug: "22-subworkflows",   title: "Sub-Workflows & Modularisierung", status: "ready", mins: 18 },
        { num: "23", slug: "23-performance",    title: "Performance, Batching & Rate-Limits", status: "ready", mins: 18 },
        { num: "24", slug: "24-deployment",     title: "Deployment, Env-Variablen & Git", status: "ready", mins: 22 },
        { num: "25", slug: "25-skalierung",     title: "Sicherheit, Queue-Mode & Skalierung", status: "ready", mins: 24 }
      ]
    },
    {
      part: "Anhang",
      chapters: [
        { num: "A", slug: "A-shortcuts",        title: "Tastenkürzel-Referenz", status: "ready", mins: 7 },
        { num: "B", slug: "B-nodes",            title: "Spickzettel: die wichtigsten Nodes", status: "soon", mins: 6 },
        { num: "C", slug: "C-expressions",      title: "Expression-Cheatsheet", status: "soon", mins: 6 },
        { num: "D", slug: "D-glossar",          title: "Glossar", status: "soon", mins: 4 }
      ]
    }
  ]
};
