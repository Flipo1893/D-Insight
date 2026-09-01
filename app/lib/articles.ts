/**
 * Knowledge base content.
 *
 * For a studio selling KI-SEO this section is the product working on itself:
 * AI assistants cite articles, not landing pages. Kept as typed data rather
 * than MDX so there is no parser dependency and no build step to learn.
 *
 * These two pieces are DRAFTS written to get the section off the ground.
 * Both of you should read them line by line and put them in your own voice
 * before this goes public; they carry your names.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  published: string;
  readingMinutes: number;
  draft: boolean;
  blocks: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "relaunch-ohne-rankingverlust",
    title: "Relaunch ohne Rankingverlust",
    excerpt:
      "Der häufigste Grund, warum eine neue Website weniger Anfragen bringt als die alte: Beim Umzug geht die Sichtbarkeit verloren. Das lässt sich verhindern.",
    published: "2026-09-01",
    readingMinutes: 4,
    draft: true,
    blocks: [
      {
        type: "p",
        text: "Eine neue Website sieht besser aus, bringt aber plötzlich weniger Anfragen. Das ist kein Zufall und liegt selten am Design. Meistens ist beim Umzug die Verbindung zwischen alten und neuen Adressen abgerissen.",
      },
      { type: "h2", text: "Warum Rankings überhaupt verloren gehen" },
      {
        type: "p",
        text: "Suchmaschinen kennen Ihre Seiten unter ihren bisherigen Adressen. Ändert sich beim Relaunch die Adressstruktur, ohne dass jemand die alten Adressen weiterleitet, laufen Besucher und Suchmaschinen ins Leere. Was über Jahre an Sichtbarkeit aufgebaut wurde, hängt an Adressen, die es nicht mehr gibt.",
      },
      { type: "h2", text: "Was vor dem Umschalten passieren muss" },
      {
        type: "list",
        items: [
          "Alle bestehenden Adressen erfassen, nicht nur die aus dem Menü.",
          "Für jede alte Adresse festlegen, welche neue Seite sie ersetzt.",
          "Dauerhafte Weiterleitungen einrichten, keine temporären.",
          "Seitentitel und Beschreibungen der stärksten Seiten übernehmen statt neu erfinden.",
          "Strukturierte Daten mitnehmen, damit die Firma weiterhin zugeordnet wird.",
        ],
      },
      { type: "h2", text: "Nach dem Launch" },
      {
        type: "p",
        text: "Die ersten zwei bis vier Wochen sind entscheidend. Wer in dieser Zeit Fehlerseiten und Rankings beobachtet, erkennt vergessene Adressen früh genug, um sie ohne bleibenden Schaden nachzutragen. Wer erst nach einem halben Jahr hinschaut, sieht nur noch das Ergebnis.",
      },
      {
        type: "p",
        text: "Ein Relaunch ist also kein reines Gestaltungsprojekt. Der Teil, der über die Anfragen entscheidet, passiert unsichtbar in der Adressstruktur.",
      },
    ],
  },
  {
    slug: "was-ki-suche-anders-macht",
    title: "Was KI-Suche anders macht",
    excerpt:
      "ChatGPT und Perplexity beantworten Fragen, statt Links zu zeigen. Das verändert, welche Inhalte überhaupt noch gefunden werden.",
    published: "2026-09-01",
    readingMinutes: 4,
    draft: true,
    blocks: [
      {
        type: "p",
        text: "Klassische Suche zeigt zehn Links, aus denen jemand auswählt. KI-Assistenten geben eine Antwort und nennen wenige Quellen. Wer dort nicht zitiert wird, kommt schlicht nicht vor. Das ist ein anderer Wettbewerb als um Platz eins bei Google.",
      },
      { type: "h2", text: "Was zitiert wird" },
      {
        type: "p",
        text: "Zitiert werden Inhalte, die eine Frage tatsächlich beantworten, eindeutig zuzuordnen sind und maschinenlesbar beschreiben, wer dahintersteht. Werbetexte ohne Substanz erfüllen keinen dieser Punkte.",
      },
      { type: "h2", text: "Drei Dinge, die konkret helfen" },
      {
        type: "list",
        items: [
          "Strukturierte Daten: Sie sagen einer Maschine ausdrücklich, welches Unternehmen das ist, was es anbietet und wo es tätig ist.",
          "Klare Seitenhierarchie: Eine Hauptüberschrift pro Seite, darunter saubere Zwischenebenen. Was für Menschen lesbar ist, ist auch für Maschinen auswertbar.",
          "Antwortende Texte: Wer eine Frage stellt und sie im nächsten Absatz beantwortet, liefert genau das Format, das ein Assistent übernehmen kann.",
        ],
      },
      { type: "h2", text: "Was sich nicht ändert" },
      {
        type: "p",
        text: "Ladezeit, Mobiltauglichkeit und saubere Technik bleiben Voraussetzung. Eine Seite, die langsam lädt oder auf dem Handy bricht, wird auch von KI-Systemen schlechter verarbeitet. KI-SEO ersetzt die Grundlagen nicht, es baut darauf auf.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
