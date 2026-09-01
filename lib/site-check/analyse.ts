export type CheckStatus = "gut" | "teilweise" | "fehlt";

export type CheckItem = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type CheckReport = {
  url: string;
  finalUrl: string;
  loadMs: number;
  htmlKb: number;
  score: number;
  items: CheckItem[];
};

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 12_000;

/** Cheap tag reads. A full parser is not worth the dependency here. */
function meta(html: string, name: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`,
    "i",
  );
  const tag = html.match(pattern)?.[0];
  if (!tag) return null;
  return tag.match(/content=["']([^"']*)["']/i)?.[1]?.trim() ?? null;
}

function tagText(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return null;
  return match[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countTags(html: string, tag: string): number {
  return html.match(new RegExp(`<${tag}[\\s>]`, "gi"))?.length ?? 0;
}

export async function analyse(url: URL): Promise<CheckReport> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Identify honestly. Sites that block unknown agents should be able
        // to see who is asking.
        "User-Agent": "D-Insight-Schnellcheck/1.0 (+https://www.d-insight.ch)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timer);
  }

  const loadMs = Date.now() - started;

  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  if (reader) {
    // Cap the read so a huge or endless response cannot exhaust memory.
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      chunks.push(value);
      if (total > MAX_BYTES) {
        await reader.cancel();
        break;
      }
    }
  }
  const html = new TextDecoder().decode(
    chunks.length === 1 ? chunks[0] : Buffer.concat(chunks),
  );

  const finalUrl = response.url || url.toString();
  const title = tagText(html, "title");
  const description = meta(html, "description");
  const viewport = meta(html, "viewport");
  const h1Count = countTags(html, "h1");
  const hasJsonLd = /<script[^>]+application\/ld\+json/i.test(html);
  const ogTitle = meta(html, "og:title") ?? meta(html, "og:image");
  const isHttps = finalUrl.startsWith("https://");
  const htmlKb = Math.round(total / 1024);

  const items: CheckItem[] = [
    {
      id: "https",
      label: "Verschlüsselte Verbindung",
      status: isHttps ? "gut" : "fehlt",
      detail: isHttps
        ? "Die Seite wird über HTTPS ausgeliefert."
        : "Ohne HTTPS zeigen Browser eine Warnung an, und Google stuft die Seite ab.",
    },
    {
      id: "speed",
      label: "Antwortzeit",
      status: loadMs < 800 ? "gut" : loadMs < 2000 ? "teilweise" : "fehlt",
      detail:
        loadMs < 800
          ? `Der Server antwortet in ${loadMs} ms.`
          : `Der Server braucht ${loadMs} ms bis zur ersten Antwort. Unter 800 ms wäre das Ziel.`,
    },
    {
      id: "mobile",
      label: "Mobil nutzbar",
      status: viewport ? "gut" : "fehlt",
      detail: viewport
        ? "Ein Viewport-Tag ist gesetzt, die Seite passt sich an kleine Bildschirme an."
        : "Ohne Viewport-Tag wird die Desktop-Ansicht auf dem Handy verkleinert dargestellt.",
    },
    {
      id: "title",
      label: "Seitentitel",
      status: !title ? "fehlt" : title.length < 20 || title.length > 65 ? "teilweise" : "gut",
      detail: !title
        ? "Es wurde kein Titel gefunden. Das ist der Text, der bei Google als Überschrift erscheint."
        : `${title.length} Zeichen. Ideal sind 20 bis 65, damit Google ihn nicht abschneidet.`,
    },
    {
      id: "description",
      label: "Beschreibung für Google",
      status: !description
        ? "fehlt"
        : description.length < 70 || description.length > 165
          ? "teilweise"
          : "gut",
      detail: !description
        ? "Ohne Meta-Description erfindet Google selbst einen Textausschnitt."
        : `${description.length} Zeichen. Ideal sind 70 bis 165.`,
    },
    {
      id: "h1",
      label: "Hauptüberschrift",
      status: h1Count === 1 ? "gut" : h1Count === 0 ? "fehlt" : "teilweise",
      detail:
        h1Count === 1
          ? "Genau eine H1-Überschrift, so soll es sein."
          : h1Count === 0
            ? "Keine H1 gefunden. Such- und KI-Systeme erkennen so schwerer, worum es geht."
            : `${h1Count} H1-Überschriften. Mehrere verwässern das Thema der Seite.`,
    },
    {
      id: "jsonld",
      label: "Strukturierte Daten",
      status: hasJsonLd ? "gut" : "fehlt",
      detail: hasJsonLd
        ? "Strukturierte Daten sind vorhanden. KI-Assistenten können das Unternehmen zuordnen."
        : "Keine strukturierten Daten. ChatGPT, Perplexity und Google AI verstehen dadurch kaum, wer hinter der Seite steht.",
    },
    {
      id: "social",
      label: "Vorschau beim Teilen",
      status: ogTitle ? "gut" : "fehlt",
      detail: ogTitle
        ? "Open-Graph-Angaben sind gesetzt, geteilte Links zeigen eine Vorschau."
        : "Ohne Open-Graph-Tags erscheint beim Teilen in WhatsApp oder LinkedIn nur der nackte Link.",
    },
  ];

  const points = items.reduce(
    (sum, item) =>
      sum + (item.status === "gut" ? 1 : item.status === "teilweise" ? 0.5 : 0),
    0,
  );

  return {
    url: url.toString(),
    finalUrl,
    loadMs,
    htmlKb,
    score: Math.round((points / items.length) * 100),
    items,
  };
}

/** What the API returns: the visitor's report, plus an optional rival. */
export type CheckResponse = CheckReport & {
  rival?: CheckReport | null;
  rivalError?: string | null;
  /** Present when the visitor asked for a shareable link. */
  shareId?: string | null;
};
