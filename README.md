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
## Login / Kundenbereich (Supabase)

Login, Registrieren, Logout und `/dashboard` sind vollständig mit
[Supabase Auth](https://supabase.com/docs/guides/auth) verdrahtet
(`lib/supabase/`, `app/login/actions.ts`, `app/registrieren/actions.ts`,
`app/logout/actions.ts`, `proxy.ts`) — es fehlen nur die Zugangsdaten:

1. Projekt auf [supabase.com](https://supabase.com) anlegen.
2. `.env.local.example` nach `.env.local` kopieren und `NEXT_PUBLIC_SUPABASE_URL`
   sowie `NEXT_PUBLIC_SUPABASE_ANON_KEY` aus *Project Settings → API* eintragen
   (`NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen, sobald live).
3. Fertig — Login/Registrieren/Logout und der Session-Status im Header
   funktionieren dann automatisch, keine Code-Änderung nötig.

Ohne gesetzte Keys bleibt die Seite voll funktionsfähig: Login/Registrieren
zeigen eine klare "noch nicht konfiguriert"-Meldung statt zu crashen, und
`/dashboard` erklärt denselben Zustand.

Bei Registrierung verschickt Supabase standardmäßig eine
Bestätigungs-E-Mail mit einem Link auf `/auth/callback` — das ist bereits
als Route Handler eingerichtet (`app/auth/callback/route.ts`).

**Geplant, noch nicht umgesetzt**: Kundenbereich, in dem Kund:innen ihre
gerefactorte Website selbst bearbeiten (Texte etc.) und Traffic-Daten
einsehen können. Diese Inhalte (Website-Texte, Traffic) sollen über
MongoDB laufen, während Supabase nur die User-Verwaltung übernimmt.

## Build

```bash
npm run build
npm start
```
