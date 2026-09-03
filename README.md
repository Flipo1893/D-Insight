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
- **Inhalte** (`/dashboard/inhalte`) — Formular mit genau den Feldern, die
  ein Admin für diese Kundenwebsite freigegeben hat, über MongoDB
  gespeichert (`lib/mongodb/sites.ts`, `app/dashboard/inhalte/actions.ts`).
  Genau wie bei Supabase: ohne `MONGODB_URI` bleibt die Seite nutzbar, zeigt
  aber Beispielinhalte und erklärt beim Speichern, dass die Anbindung fehlt.
- **Kunden** (`/dashboard/kunden`) — nur für Admins sichtbar (siehe
  `ADMIN_EMAILS`): Liste aller Kund:innen, die sich angemeldet haben, mit
  Projektname, Website-URL und Anzahl editierbarer Felder. Pro Kunde lässt
  sich dort festlegen, welche Felder er oder sie bearbeiten darf (Schlüssel
  = Name in der Content-API, Bezeichnung = was der Kunde sieht, ein- oder
  mehrzeilig). Nicht-Admins bekommen auf diesen Seiten eine 404.
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

Damit ihr selbst den "Kunden"-Tab seht, zusätzlich `ADMIN_EMAILS` in
`.env.local` auf eure E-Mail-Adressen setzen (kommagetrennt, dieselben, mit
denen ihr euch im Portal einloggt).

### Ablauf bei einer neuen Kundenwebsite

1. Kunde registriert sich im Portal (`/registrieren`) und öffnet einmal den
   Kundenbereich — danach taucht er unter `/dashboard/kunden` auf.
2. Ihr öffnet ihn dort, tragt Projektname + Website-URL ein und legt die
   editierbaren Felder fest (z. B. `heroTitle` → "Hero-Überschrift").
3. Ihr baut die Kundenwebsite wie gewohnt als eigenes Projekt und lest die
   freigegebenen Felder über die Content-API aus (siehe unten) — die
   passende URL steht auf der Kundenseite zum Kopieren.
4. Der Kunde schliesst unter `/dashboard/abo` das Monatsabo ab — vorher
   sieht er statt der Tabs nur die Abo-Seite.
5. Der Kunde pflegt seine Texte unter `/dashboard/inhalte`; seine Website
   zieht die Änderung beim nächsten Revalidate automatisch nach.

## Abo / Bezahlschranke (Stripe)

Der Kundenbereich läuft im Monatsabo. Ohne aktives Abo sieht ein Konto
statt der Tabs nur die Abo-Seite; die Website des Kunden läuft
unverändert weiter, denn die Content-API bleibt offen — nur das
Bearbeiten hängt am Abo. Admins (`ADMIN_EMAILS`) sind ausgenommen.

Sind `STRIPE_SECRET_KEY` und `STRIPE_PRICE_ID` nicht gesetzt, gibt es
keine Bezahlschranke und das Dashboard verhält sich wie zuvor.

### Einrichten

1. Produkt und wiederkehrenden Preis (CHF, monatlich) im
   [Stripe-Dashboard](https://dashboard.stripe.com) anlegen, Preis-ID
   (`price_…`) als `STRIPE_PRICE_ID` eintragen.
2. Secret Key aus *Developers → API keys* als `STRIPE_SECRET_KEY`
   eintragen. Server-only, kein `NEXT_PUBLIC_`.
3. Webhook-Endpunkt auf `https://<domain>/api/stripe/webhook` anlegen,
   Ereignisse `checkout.session.completed` und `customer.subscription.*`
   abonnieren, Signaturgeheimnis als `STRIPE_WEBHOOK_SECRET` eintragen.
4. *Settings → Billing → Customer portal* einmal speichern — sonst
   schlägt "Abo verwalten" fehl.

Lokal testen ohne öffentliche Domain:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# gibt ein whsec_… aus -> als STRIPE_WEBHOOK_SECRET in .env.local
```

### Wie der Status in die Datenbank kommt

Stripe ist die Wahrheit, MongoDB nur der Spiegel: der Webhook schreibt
`subscription` auf das Site-Dokument (`lib/mongodb/sites.ts`), alles
andere liest nur. Bei jedem Ereignis wird das Abo frisch von Stripe
geholt statt dem Ereignis geglaubt — Webhooks kommen nicht garantiert in
der Reihenfolge an, in der sie entstanden sind.

Über den Zugang entscheidet ausschliesslich `getAccess()` in
`lib/billing.ts`. Zwei bewusste Entscheidungen darin: eine fehlgeschlagene
Zahlung (`past_due`) sperrt nicht sofort aus, und ist die Datenbank nicht
erreichbar, wird aufgeschlossen statt zugesperrt.

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
