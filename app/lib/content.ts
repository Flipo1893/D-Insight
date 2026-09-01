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
} as const;

/**
 * Nav order follows the funnel: what we do, proof, the free tool, then the
 * knowledge base. The quick check used to be buried mid-page with no way to
 * reach it, which wasted the strongest thing on the site.
 */
export const navItems = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#beispiele", label: "Beispiele" },
  { href: "/#schnellcheck", label: "Schnellcheck" },
  { href: "/wissen", label: "Wissen" },
] as const;

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
 * Measured values of this page, so the speed argument rests on something.
 *
 * Taken from the production build (`npm run build && npm run start`) with
 * compression on, which is what a browser actually downloads. Re-measure
 * after any dependency change and update the date; stale numbers on a page
 * that sells honesty about websites would be the worst possible look.
 *
 * Deliberately no response time: on localhost that figure says nothing, and
 * once deployed it belongs to the host, not to the build.
 */
export const measured = {
  date: "2026-09-01",
  htmlKb: 14,
  totalKb: 267,
  requests: 15,
} as const;
