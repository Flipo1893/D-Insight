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

export const navItems = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#beispiele", label: "Beispiele" },
  { href: "#prozess", label: "Prozess" },
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
    duration: "2 bis 4 Wochen",
  },
  {
    id: "refactoring",
    title: "Technisches Refactoring",
    summary: "Sauberer Code statt gewachsener Altlasten.",
    description:
      "Schnellere Ladezeiten, stabile Struktur und eine Basis, auf der Sie langfristig weiterbauen können. Wir räumen auf, was über die Jahre entstanden ist, ohne die Funktionen zu verlieren.",
    deliverables: ["Code-Audit", "Performance-Budget", "Wartbare Architektur"],
    included: ["Audit der bestehenden Seite mit Fundliste","Performance-Budget mit messbaren Zielwerten","Neuaufbau auf wartbarer Architektur","Dokumentation für spätere Erweiterungen"],
    duration: "2 bis 5 Wochen",
  },
  {
    id: "ki-seo",
    title: "KI-SEO",
    summary: "Gefunden werden, wo heute gesucht wird.",
    description:
      "Inhalte und Struktur so aufbereitet, dass klassische Suchmaschinen und KI-Assistenten wie ChatGPT oder Perplexity Ihr Unternehmen verstehen und zitieren können.",
    deliverables: ["Strukturierte Daten", "Content-Struktur", "Sichtbarkeits-Messung"],
    included: ["Strukturierte Daten für Unternehmen und Leistungen","Seitenhierarchie und interne Verlinkung","Texte, die Fragen tatsächlich beantworten","Weiterleitungskonzept für den Umzug"],
    duration: "1 bis 2 Wochen, parallel",
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
    question: "Wie lange dauert ein Refactoring-Projekt?",
    answer:
      "Je nach Umfang zwischen zwei und sechs Wochen. Nach der Analyse erhalten Sie einen konkreten Zeitplan mit festen Meilensteinen.",
  },
  {
    question: "Muss die Website währenddessen offline sein?",
    answer:
      "Nein. Wir arbeiten in einer separaten Umgebung und stellen erst live, wenn alles geprüft ist. Ihre bestehende Seite bleibt bis zum Umschalten erreichbar.",
  },
  {
    question: "Was bedeutet KI-SEO konkret?",
    answer:
      "Inhalte und Struktur werden so aufbereitet, dass sie sowohl von klassischen Suchmaschinen als auch von KI-Suchassistenten gut verstanden und zitiert werden. Dazu gehören strukturierte Daten, eindeutige Seitenhierarchien und Texte, die eine Frage tatsächlich beantworten.",
  },
  {
    question: "Verlieren wir unsere Google-Rankings beim Relaunch?",
    answer:
      "Nicht, wenn der Umzug sauber gemacht wird. Wir übernehmen bestehende URLs oder richten Weiterleitungen ein und behalten die Sichtbarkeit nach dem Launch im Blick.",
  },
  {
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

/*
 * PLACEHOLDER PRICING. These numbers are invented so the estimator has
 * something to compute with. Dominic and Beg have to confirm or replace
 * every one of them before this goes live, because the page shows them to
 * customers as a range they will hold us to.
 */
export const pricing = {
  base: { min: 800, max: 1400 },
  perPage: { min: 80, max: 150 },
  options: [
    {
      id: "redesign",
      label: "Visuelles Redesign",
      hint: "Neues Erscheinungsbild statt nur Technik",
      min: 600,
      max: 1200,
    },
    {
      id: "seo",
      label: "KI-SEO",
      hint: "Strukturierte Daten und Sichtbarkeit in KI-Suche",
      min: 400,
      max: 900,
    },
    {
      id: "cms",
      label: "Inhalte selbst pflegen",
      hint: "Redaktionsbereich zum eigenständigen Ändern",
      min: 500,
      max: 1000,
    },
    {
      id: "shop",
      label: "Onlineshop",
      hint: "Produkte, Warenkorb und Zahlung",
      min: 1500,
      max: 3500,
    },
    {
      id: "multilang",
      label: "Mehrsprachig",
      hint: "Zweite Sprachversion, zum Beispiel Französisch",
      min: 300,
      max: 700,
    },
  ],
} as const;

/**
 * Booking link, for example a Cal.com or Calendly page. Set
 * NEXT_PUBLIC_BOOKING_URL in .env.local to switch the option on; the contact
 * section hides it entirely while it is empty rather than linking nowhere.
 */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "";
