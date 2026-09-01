import type { CheckItem } from "./analyse";

/**
 * Accessibility findings from the delivered HTML.
 *
 * Scoped honestly. Contrast, focus order and whether a keyboard can reach
 * everything require a rendered page and a real browser; none of that can be
 * judged from markup, so none of it is claimed here. What is left is still
 * the majority of what actually fails in practice: missing alt text,
 * unlabelled inputs, blocked zoom, no language, link text that says nothing.
 *
 * Relevant because accessibility becomes binding for many Swiss providers,
 * and most small business sites fail on exactly these basics.
 */

/** Link and button labels that tell a screen reader nothing. */
const VAGUE_LABELS = [
  "hier",
  "hier klicken",
  "klicken sie hier",
  "mehr",
  "mehr erfahren",
  "weiterlesen",
  "weiter",
  "link",
  "read more",
  "click here",
];

export function analyseAccessibility(html: string): CheckItem[] {
  const items: CheckItem[] = [];

  // 1. Language
  const lang = html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1];
  items.push({
    id: "a11y-lang",
    label: "Sprache ausgezeichnet",
    status: lang ? "gut" : "fehlt",
    detail: lang
      ? `Die Seite ist als "${lang}" ausgezeichnet. Vorleseprogramme wählen damit die richtige Aussprache.`
      : "Im html-Tag fehlt die Sprachangabe. Vorleseprogramme raten dann die Aussprache, was deutschen Text englisch klingen lässt.",
  });

  // 2. Zoom. Blocking it is a common template default and a hard barrier.
  const viewport =
    html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)?.[0] ?? "";
  const blocksZoom =
    /user-scalable\s*=\s*(no|0)/i.test(viewport) ||
    /maximum-scale\s*=\s*(1(\.0)?)\b/i.test(viewport);
  items.push({
    id: "a11y-zoom",
    label: "Vergrössern erlaubt",
    status: !viewport ? "teilweise" : blocksZoom ? "fehlt" : "gut",
    detail: !viewport
      ? "Kein Viewport-Tag gefunden, dadurch ist das Verhalten auf dem Handy unklar."
      : blocksZoom
        ? "Die Seite unterbindet das Zoomen. Wer schlechter sieht, kann den Text nicht vergrössern."
        : "Besucher können die Seite auf dem Handy vergrössern.",
  });

  // 3. Images without alt
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  const withoutAlt = images.filter((tag) => !/\salt\s*=/i.test(tag)).length;
  items.push({
    id: "a11y-alt",
    label: "Bilder mit Alternativtext",
    status:
      images.length === 0 ? "gut" : withoutAlt === 0 ? "gut" : withoutAlt <= 2 ? "teilweise" : "fehlt",
    detail:
      images.length === 0
        ? "Keine img-Elemente im ausgelieferten HTML gefunden."
        : withoutAlt === 0
          ? `Alle ${images.length} Bilder haben ein alt-Attribut.`
          : `${withoutAlt} von ${images.length} Bildern haben keinen Alternativtext. Blinde Nutzer hören dort nur "Grafik".`,
  });

  // 4. Inputs without a label
  const inputs =
    html.match(/<(input|select|textarea)\b[^>]*>/gi)?.filter(
      (tag) => !/type\s*=\s*["'](hidden|submit|button|image)["']/i.test(tag),
    ) ?? [];
  const labelledIds = new Set(
    [...html.matchAll(/<label[^>]+for=["']([^"']+)["']/gi)].map((m) => m[1]),
  );
  const unlabelled = inputs.filter((tag) => {
    if (/aria-label\s*=|aria-labelledby\s*=|title\s*=/i.test(tag)) return false;
    const id = tag.match(/\sid=["']([^"']+)["']/i)?.[1];
    return !id || !labelledIds.has(id);
  }).length;
  items.push({
    id: "a11y-labels",
    label: "Formularfelder beschriftet",
    status:
      inputs.length === 0 ? "gut" : unlabelled === 0 ? "gut" : unlabelled <= 1 ? "teilweise" : "fehlt",
    detail:
      inputs.length === 0
        ? "Keine Formularfelder auf der Startseite."
        : unlabelled === 0
          ? `Alle ${inputs.length} Felder sind beschriftet.`
          : `${unlabelled} von ${inputs.length} Feldern haben keine Beschriftung. Wer die Seite vorlesen lässt, erfährt nicht, was einzutragen ist.`,
  });

  // 5. Heading structure
  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1 = headings.filter((level) => level === 1).length;
  let skipped = false;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) skipped = true;
  }
  items.push({
    id: "a11y-headings",
    label: "Überschriften-Struktur",
    status: h1 === 1 && !skipped ? "gut" : h1 === 0 ? "fehlt" : "teilweise",
    detail:
      h1 === 0
        ? "Keine H1 gefunden. Vorleseprogramme springen normalerweise über Überschriften durch die Seite."
        : h1 > 1
          ? `${h1} H1-Überschriften. Es sollte genau eine geben, die sagt, worum es auf der Seite geht.`
          : skipped
            ? "Eine Überschriftenebene wird übersprungen, zum Beispiel H2 direkt auf H4. Das bricht die Navigation per Überschriften."
            : "Genau eine H1, keine übersprungenen Ebenen.",
  });

  // 6. Link text
  const linkTexts = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase())
    .filter(Boolean);
  const vague = linkTexts.filter((text) => VAGUE_LABELS.includes(text)).length;
  items.push({
    id: "a11y-linktext",
    label: "Aussagekräftige Linktexte",
    status: vague === 0 ? "gut" : vague <= 2 ? "teilweise" : "fehlt",
    detail:
      vague === 0
        ? "Keine nichtssagenden Linktexte gefunden."
        : `${vague} Link${vague === 1 ? "" : "s"} heissen nur "hier klicken", "mehr" oder ähnlich. Wer sich die Links einer Seite auflisten lässt, bekommt damit nichts erklärt.`,
  });

  // 7. Landmarks
  const hasMain = /<main\b|role=["']main["']/i.test(html);
  items.push({
    id: "a11y-main",
    label: "Hauptbereich ausgezeichnet",
    status: hasMain ? "gut" : "fehlt",
    detail: hasMain
      ? "Ein main-Bereich ist ausgezeichnet, Nutzer können die Navigation überspringen."
      : "Kein main-Bereich. Vorleseprogramme können nicht direkt zum Inhalt springen und lesen jedes Mal das Menü mit.",
  });

  // 8. Empty buttons
  const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  const namelessButtons = buttons.filter(([, attrs, inner]) => {
    if (/aria-label\s*=|aria-labelledby\s*=|title\s*=/i.test(attrs)) return false;
    return inner.replace(/<[^>]*>/g, "").trim() === "";
  }).length;
  items.push({
    id: "a11y-buttons",
    label: "Schaltflächen benannt",
    status:
      buttons.length === 0 ? "gut" : namelessButtons === 0 ? "gut" : "fehlt",
    detail:
      buttons.length === 0
        ? "Keine Schaltflächen im ausgelieferten HTML."
        : namelessButtons === 0
          ? `Alle ${buttons.length} Schaltflächen haben einen lesbaren Namen.`
          : `${namelessButtons} Schaltfläche${namelessButtons === 1 ? "" : "n"} ohne Namen, meist reine Icon-Buttons. Vorleseprogramme sagen dort nur "Schaltfläche".`,
  });

  return items;
}

export function accessibilityScore(items: CheckItem[]): number {
  const points = items.reduce(
    (sum, item) =>
      sum + (item.status === "gut" ? 1 : item.status === "teilweise" ? 0.5 : 0),
    0,
  );
  return Math.round((points / items.length) * 100);
}
