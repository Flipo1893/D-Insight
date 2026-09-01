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

## Kundenbereich (`/dashboard`)

Eingeloggte Kund:innen landen im Kundenbereich mit drei Tabs
(`app/dashboard/layout.tsx` + `app/components/DashboardNav.tsx`):

- **Übersicht** — Einstieg mit Links zu den beiden anderen Tabs.
- **Inhalte** (`/dashboard/inhalte`) — Formular für ein paar Beispieltexte
  der eigenen Website (Hero-Überschrift, Hero-Text, Über-uns-Text), über
  MongoDB gespeichert (`lib/mongodb/`, `app/dashboard/inhalte/actions.ts`).
  Genau wie bei Supabase: ohne `MONGODB_URI` bleibt die Seite nutzbar, zeigt
  aber Beispielinhalte und erklärt beim Speichern, dass die Anbindung fehlt.
- **Traffic** (`/dashboard/traffic`) — Besucher-Chart, Kennzahlen-Kacheln und
  meistgesehene Seiten. Läuft aktuell auf Beispieldaten
  (`lib/analytics/mock.ts`); welcher Analytics-Anbieter (Vercel Analytics,
  Plausible, GA4, …) das später liefert, hängt vom Deployment-Ziel ab — die
  UI erwartet nur die `TrafficSummary`-Form aus `lib/analytics/types.ts`,
  das Ersetzen von `getTrafficSummary()` durch einen echten Provider-Call
  ändert an den Komponenten nichts.

MongoDB anbinden:

1. Cluster auf [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   anlegen (Free Tier reicht).
2. Connection String unter *Database → Connect → Drivers* kopieren, in
   `.env.local` als `MONGODB_URI` eintragen (siehe `.env.local.example`).
3. Fertig — der "Inhalte"-Tab speichert dann pro Nutzer:in in der
   `websites`-Collection.

## Wie Kundenwebsites die Inhalte einbinden

Architektur-Entscheidung: Jede Kundenwebsite bleibt ihr eigenes, individuell
gestaltetes Projekt (eigenes Deployment, eigene Domain) — es gibt bewusst
keine gemeinsame Vorlage/Plattform für alle Kunden. Dieses Dashboard ist die
einzige zentrale Stelle, an der Kund:innen ihre Inhalte pflegen; die
jeweilige Kundenwebsite holt sich diese Inhalte über eine kleine
öffentliche, lesende API ab:

```
GET /api/sites/{site-id}/content
```

(`site-id` ist aktuell die Supabase-User-ID der Kund:in — steht auch direkt
im Dashboard unter „Inhalte" zum Kopieren.) Antwort z. B.:

```json
{
  "heroTitle": "Ihre Website. Neu gedacht.",
  "heroSubtitle": "…",
  "aboutText": "…",
  "updatedAt": "2026-09-01T12:00:00.000Z"
}
```

Beim Bau einer neuen Kundenwebsite werden die editierbaren Stellen (z. B.
die Hero-Sektion) so gebaut, dass sie diese Inhalte serverseitig abrufen,
statt festen Text zu enthalten — z. B. in einer Next.js Server Component:

```tsx
async function Hero() {
  const res = await fetch(
    "https://d-insight.de/api/sites/<site-id>/content",
    { next: { revalidate: 60 } }, // ISR: alle 60s neu abrufen
  );
  const content = await res.json();

  return <h1>{content.heroTitle}</h1>;
}
```

Kein Login/API-Key nötig — die Route liefert genau die Inhalte, die ohnehin
öffentlich auf der Kundenwebsite stehen sollen. Sobald reale
Kundenwebsites angebunden werden, ist das der Punkt, an dem eine
sprechendere Site-ID (statt der rohen User-ID) sinnvoll wird.

## Build

```bash
npm run build
npm start
```
