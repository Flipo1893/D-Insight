import measuredJson from "./measured.json";

/**
 * Single source of truth for content that appears both on the page and in
 * structured data. Keeping one copy means the JSON-LD can never drift away
 * from what a visitor actually reads, which is the whole point of GEO.
 */

export const site = {
  name: "D-Insight",
  url: "https://www.d-insight.ch",
  tagline: "Website-Refactoring & KI-SEO",
  email: "info@d-insight.ch",
  replyWindow: "zwei Werktagen",
  /**
   * Kept in parts rather than as one string so the same data can serve the
   * footer, the imprint and the structured data without three of them
   * drifting apart. Impressum and Datenschutz still spell it out by hand;
   * those are the next two to point here.
   */
  address: {
    street: "Bahnhofplatz 1",
    postalCode: "8001",
    city: "Zürich",
    country: "Schweiz",
  },
} as const;

/** One label per intent, reused in the nav, hero, banner and form. */
export const primaryCta = "Angebot anfordern";

export const services = [
  {
    id: "redesign",
    title: "Visuelles Redesign",
    summary: "Ein Auftritt, der zur Marke passt statt zum Baukasten.",
    description:
      "Klare Struktur, lesbare Typografie und eine Nutzerführung, die auf jedem Gerät funktioniert. Wir gestalten nicht um des Effekts willen, sondern damit Besucher finden, wonach sie suchen.",
    deliverables: ["Designkonzept", "Responsive Layouts", "Komponenten-Bibliothek"],
    included: ["Designkonzept mit zwei Entwürfen zur Auswahl","Layouts für Desktop, Tablet und Handy","Wiederverwendbare Komponenten statt Einzelseiten","Bildauswahl und Aufbereitung"],
  },
  {
    id: "refactoring",
    title: "Technisches Refactoring",
    summary: "Sauberer Code statt gewachsener Altlasten.",
    description:
      "Schnellere Ladezeiten, stabile Struktur und eine Basis, auf der Sie langfristig weiterbauen können. Wir räumen auf, was über die Jahre entstanden ist, ohne die Funktionen zu verlieren.",
    deliverables: ["Code-Audit", "Performance-Budget", "Wartbare Architektur"],
    included: ["Audit der bestehenden Seite mit Fundliste","Performance-Budget mit messbaren Zielwerten","Neuaufbau auf wartbarer Architektur","Dokumentation für spätere Erweiterungen"],
  },
  {
    id: "ki-seo",
    title: "KI-SEO",
    summary: "Gefunden werden, wo heute gesucht wird.",
    description:
      "Inhalte und Struktur so aufbereitet, dass klassische Suchmaschinen und KI-Assistenten wie ChatGPT oder Perplexity Ihr Unternehmen verstehen und zitieren können.",
    deliverables: ["Strukturierte Daten", "Content-Struktur", "Sichtbarkeits-Messung"],
    included: ["Strukturierte Daten für Unternehmen und Leistungen","Seitenhierarchie und interne Verlinkung","Texte, die Fragen tatsächlich beantworten","Weiterleitungskonzept für den Umzug"],
  },
] as const;

export const steps = [
  {
    title: "Analyse",
    description:
      "Wir prüfen bestehende Website, Technik und Suchmaschinen-Performance und zeigen Ihnen, was konkret bremst.",
  },
  {
    title: "Konzept",
    description:
      "Struktur und visuelles Konzept entstehen gemeinsam mit Ihnen, bevor eine Zeile Code geschrieben wird.",
  },
  {
    title: "Umsetzung",
    description:
      "Refactoring, Redesign und KI-SEO werden implementiert, auf echten Geräten getestet und dokumentiert.",
  },
  {
    title: "Launch",
    description:
      "Go-live mit Weiterleitungen und Erfolgsmessung, damit Rankings den Umzug überstehen. Betreuung nach Bedarf.",
  },
] as const;

export const team = [
  {
    name: "Dominic Felder",
    role: "Web Developer",
    focus: "Technik und Performance",
    /** Blond, glasses. Rendered only once the file actually exists. */
    photo: "/team/dominic-felder.jpg",
    bio: "Verantwortlich für Code-Architektur und Ladezeit-Optimierung. Sorgt dafür, dass die Seite unter echten Bedingungen schnell bleibt, nicht nur im Testlabor.",
  },
  {
    name: "Beg Sherifi",
    role: "Web Developer",
    focus: "Konzept und Sichtbarkeit",
    /** Dark hair. Rendered only once the file actually exists. */
    photo: "/team/beg-sherifi.jpg",
    bio: "Verantwortlich für visuelle Neugestaltung und technische SEO-Struktur. Übersetzt das, was ein Unternehmen ausmacht, in eine Seite, die gefunden wird.",
  },
] as const;

export const faqs = [
  {
    slug: "dauer",
    question: "Wie lange dauert ein Refactoring-Projekt?",
    answer:
      "Je nach Umfang zwischen zwei und sechs Wochen. Nach der Analyse erhalten Sie einen konkreten Zeitplan mit festen Meilensteinen.",
  },
  {
    slug: "offline",
    question: "Muss die Website währenddessen offline sein?",
    answer:
      "Nein. Wir arbeiten in einer separaten Umgebung und stellen erst live, wenn alles geprüft ist. Ihre bestehende Seite bleibt bis zum Umschalten erreichbar.",
  },
  {
    slug: "ki-seo",
    question: "Was bedeutet KI-SEO konkret?",
    answer:
      "Inhalte und Struktur werden so aufbereitet, dass sie sowohl von klassischen Suchmaschinen als auch von KI-Suchassistenten gut verstanden und zitiert werden. Dazu gehören strukturierte Daten, eindeutige Seitenhierarchien und Texte, die eine Frage tatsächlich beantworten.",
  },
  {
    slug: "rankings",
    question: "Verlieren wir unsere Google-Rankings beim Relaunch?",
    answer:
      "Nicht, wenn der Umzug sauber gemacht wird. Wir übernehmen bestehende URLs oder richten Weiterleitungen ein und behalten die Sichtbarkeit nach dem Launch im Blick.",
  },
  {
    slug: "kosten",
    question: "Was kostet ein Refactoring?",
    answer:
      "Das hängt vom Umfang Ihrer Website ab. Nach der Analyse erhalten Sie ein individuelles, unverbindliches Angebot mit fixem Preis statt einer offenen Stundenrechnung.",
  },
] as const;


/** Qualification options on the contact form. */
export const budgetOptions = [
  "unter 5'000 CHF",
  "5'000 bis 10'000 CHF",
  "10'000 bis 20'000 CHF",
  "über 20'000 CHF",
] as const;

export const timelineOptions = [
  "so bald wie möglich",
  "in 1 bis 3 Monaten",
  "in 3 bis 6 Monaten",
  "noch in Planung",
] as const;


/**
 * Booking link, for example a Cal.com or Calendly page. Set
 * NEXT_PUBLIC_BOOKING_URL in .env.local to switch the option on; the contact
 * section hides it entirely while it is empty rather than linking nowhere.
 */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "";


/**
 * Measured values of this page.
 *
 * Generated by scripts/measure.mjs from the build output, not typed in by
 * hand. Hand-maintained numbers on a page that sells honesty about websites
 * go stale the first time a dependency is added, and nobody notices.
 *
 *   npm run measure        re-measure and update
 *   npm run measure:check  fail if the published numbers drifted
 *
 * No response time on purpose: on localhost that figure is meaningless, and
 * once deployed it belongs to the host rather than to the build.
 */
export const measured = measuredJson;

/**
 * Depth for the three detail pages.
 *
 * They were a heading plus one component each, which is thin for a page of
 * its own and gives an AI assistant almost nothing to quote. Everything
 * here is something we can actually stand behind: no invented figures, no
 * client names, no credentials nobody has.
 */

/** Situations people actually arrive with, in their own words. */
export const situations = [
  {
    title: "Die Seite ist zehn Jahre alt",
    body: "Sie funktioniert noch, aber sie sieht aus wie von damals, bricht auf dem Handy und niemand traut sich mehr, etwas daran zu ändern. Hier lohnt sich meistens ein vollständiger Neuaufbau, weil Flicken teurer wird als ersetzen.",
  },
  {
    title: "Optisch in Ordnung, aber niemand findet sie",
    body: "Das Design stimmt, die Anfragen bleiben aus. Dann liegt es selten am Aussehen, sondern an Struktur, Ladezeit und daran, dass Such- und KI-Systeme nicht verstehen, worum es geht.",
  },
  {
    title: "Jede Textänderung braucht einen Entwickler",
    body: "Öffnungszeiten, Preise, ein neues Projekt: Wenn dafür jedes Mal jemand extern ran muss, bleibt die Seite stehen. Hier geht es weniger um Design als darum, wer die Seite künftig pflegen kann.",
  },
] as const;

/** Scope boundaries. Saying what we do not do is worth more than a list of buzzwords. */
export const boundaries = [
  "Kein Logo- und Markendesign. Wenn Ihre Marke neu entstehen soll, arbeiten wir mit jemandem zusammen, der das kann.",
  "Keine Texterstellung von Grund auf. Wir strukturieren und schärfen, was Sie haben, aber Ihre Inhalte kennen Sie besser.",
  "Keine Fotografie. Gute Bilder machen viel aus, dafür braucht es jemanden mit einer Kamera.",
  "Keine laufende Werbebetreuung. Wir sorgen dafür, dass die Seite gefunden wird, nicht dafür, dass Anzeigen laufen.",
] as const;

/** What each process step needs from the client. */
export const stepDetails = [
  {
    title: "Analyse",
    weDo: "Wir sehen uns die bestehende Seite an: Technik, Ladezeit, Struktur, Sichtbarkeit. Sie bekommen eine Fundliste im Klartext, keine Kennzahlen-Tapete.",
    weNeed: "Zugang zur Seite und, falls vorhanden, zu vorhandenen Statistiken.",
  },
  {
    title: "Konzept",
    weDo: "Struktur und visuelles Konzept entstehen und werden mit Ihnen abgestimmt, bevor eine Zeile Code geschrieben wird.",
    weNeed: "Eine Rückmeldung, welche Richtung passt. Zwei Runden sind normal.",
  },
  {
    title: "Umsetzung",
    weDo: "Refactoring, Redesign und KI-SEO werden implementiert und auf echten Geräten getestet, nicht nur im Browserfenster.",
    weNeed: "Inhalte, Bilder und Logo in der besten Auflösung, die Sie haben.",
  },
  {
    title: "Launch",
    weDo: "Umschalten mit Weiterleitungen, damit die Sichtbarkeit den Umzug übersteht. Danach beobachten wir Fehlerseiten und Rankings.",
    weNeed: "Zugang zur Domain und, falls vorhanden, zur Search Console.",
  },
] as const;

/** How we work. Principles we can be held to, not slogans. */
export const principles = [
  {
    title: "Sie sprechen mit den Leuten, die bauen",
    body: "Kein Projektmanagement dazwischen, keine wechselnden Ansprechpartner. Das begrenzt, wie viele Projekte wir gleichzeitig annehmen, und genau das ist beabsichtigt.",
  },
  {
    title: "Kein Baukasten, aber auch kein Selbstzweck",
    body: "Wir bauen mit Werkzeugen, die es in zehn Jahren noch gibt, und nicht mit dem, was gerade neu ist. Was Sie bekommen, kann auch jemand anderes weiterpflegen.",
  },
  {
    title: "Messbar statt behauptet",
    body: "Ladezeit, Struktur und Sichtbarkeit sind messbar. Wir nennen Zahlen, die Sie selbst nachprüfen können, und diese Seite hält sich an dieselbe Regel.",
  },
  {
    title: "Wir sagen auch ab",
    body: "Wenn ein Neuaufbau nicht das ist, was Ihnen weiterhilft, sagen wir das. Ein Projekt, das nichts bringt, hilft uns langfristig auch nicht.",
  },
] as const;

/**
 * Google Analytics measurement id, for example G-XXXXXXXXXX.
 *
 * Empty means no analytics, no cookies and no consent banner: the banner
 * only appears when there is genuinely something to consent to. Set
 * NEXT_PUBLIC_GA_ID in .env.local to switch it on.
 *
 * Note that this competes with the site's own cookie-free counting, which
 * needs no banner and which most visitors will not decline.
 */
export const analyticsId = process.env.NEXT_PUBLIC_GA_ID ?? "";
