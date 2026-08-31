# D-Insight

Sales-Landingpage für D-Insight — Website-Refactoring, Redesign und KI-SEO.
Gebaut mit Next.js (App Router), TypeScript und Tailwind CSS, im Design des
`WebseitenRefactoring_Mockups.pdf`.

## Entwicklung

```bash
npm install
npm run dev
```

Seite läuft dann unter [http://localhost:3000](http://localhost:3000).

## Noch offen

- **Fotos & Screenshots**: Alle Bild-Slots (Team-Fotos, Vorher/Nachher) sind
  als gestrichelte Platzhalter markiert (`app/components/PlaceholderImage.tsx`).
  Sobald echte Bilder vorliegen, in `public/` ablegen und die jeweiligen
  `PlaceholderImage`-Aufrufe durch `next/image` ersetzen.
- **Kontaktformular**: Sendet aktuell an Formspree. Formular unter
  [formspree.io](https://formspree.io) anlegen, ID in `.env.local`
  eintragen (siehe `.env.local.example`).
- **Impressum & Datenschutz**: Enthalten Platzhaltertexte
  (`app/impressum`, `app/datenschutz`) — vor Live-Schaltung mit echten
  Angaben bzw. rechtsgültigem Text ersetzen.

## Build

```bash
npm run build
npm start
```
