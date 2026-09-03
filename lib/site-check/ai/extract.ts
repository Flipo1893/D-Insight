/**
 * Turns a fetched page into the small, plain-text summary the model reads.
 *
 * Raw HTML is the wrong input twice over. A small local model spends its
 * whole context on markup and answers about the markup; and on a paid API
 * every byte of that markup is billed. So the page is reduced to the things
 * the questions are actually about: what it calls itself, what it says at
 * the top, how it is structured, and whether it offers a way to get in
 * touch.
 *
 * Everything here is bounded. A page that returns a megabyte of text must
 * not turn into a megabyte of prompt.
 */

export type PageExtract = {
  title: string;
  description: string;
  headings: string[];
  navLabels: string[];
  bodyStart: string;
  altTexts: string[];
  imageCount: number;
  imagesWithoutAlt: number;
  hasMailto: boolean;
  hasTel: boolean;
  hasForm: boolean;
};

const MAX_HEADINGS = 18;
const MAX_NAV = 14;
const MAX_ALTS = 12;
const MAX_BODY_CHARS = 2200;

/**
 * Collapses whitespace and drops control characters, then caps the length.
 *
 * The control-character strip is not cosmetic: it is what stops a page from
 * smuggling newlines into a single-line field of the prompt and forging what
 * looks like a new instruction to the model.
 */
function clean(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'");
}

function attr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return match ? decodeEntities(match[1]) : null;
}

/**
 * Visible text only. Script and style bodies are stripped first, otherwise a
 * page with an inline framework payload hands the model a wall of JavaScript
 * and nothing else fits.
 */
function visibleText(html: string): string {
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  const body =
    withoutCode.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? withoutCode;

  return decodeEntities(body.replace(/<[^>]*>/g, " "));
}

export function buildExtract(html: string): PageExtract {
  const headings: string[] = [];
  for (const match of html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = clean(decodeEntities(match[2].replace(/<[^>]*>/g, " ")), 120);
    if (text) headings.push(`H${match[1]}: ${text}`);
    if (headings.length >= MAX_HEADINGS) break;
  }

  // Nav labels say what the site thinks its own sections are, which is most
  // of what "is it clear what they offer" comes down to.
  const navLabels: string[] = [];
  const navBlocks = html.match(/<nav[\s\S]*?<\/nav>/gi) ?? [];
  for (const block of navBlocks) {
    for (const link of block.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
      const text = clean(decodeEntities(link[1].replace(/<[^>]*>/g, " ")), 40);
      if (text && !navLabels.includes(text)) navLabels.push(text);
      if (navLabels.length >= MAX_NAV) break;
    }
    if (navLabels.length >= MAX_NAV) break;
  }

  const imageTags = html.match(/<img[^>]*>/gi) ?? [];
  const altTexts: string[] = [];
  let imagesWithoutAlt = 0;
  for (const tag of imageTags) {
    const alt = attr(tag, "alt");
    if (alt === null || alt.trim() === "") {
      // An empty alt is correct for decoration, so it is counted but not
      // judged. Only alt text that exists can be assessed for whether it
      // says anything.
      imagesWithoutAlt += 1;
      continue;
    }
    const text = clean(alt, 120);
    if (text && altTexts.length < MAX_ALTS) altTexts.push(text);
  }

  const title = clean(
    decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    200,
  );

  const description = clean(
    decodeEntities(
      html
        .match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0]
        ?.match(/content=["']([^"']*)["']/i)?.[1] ?? "",
    ),
    300,
  );

  return {
    title,
    description,
    headings,
    navLabels,
    bodyStart: clean(visibleText(html), MAX_BODY_CHARS),
    altTexts,
    imageCount: imageTags.length,
    imagesWithoutAlt,
    hasMailto: /href=["']mailto:/i.test(html),
    hasTel: /href=["']tel:/i.test(html),
    hasForm: /<form[\s>]/i.test(html),
  };
}

/** The extract as the block of text that goes into the prompt. */
export function renderExtract(extract: PageExtract): string {
  const kontaktwege =
    [
      extract.hasMailto ? "E-Mail-Link" : null,
      extract.hasTel ? "Telefon-Link" : null,
      extract.hasForm ? "Formular" : null,
    ]
      .filter(Boolean)
      .join(", ") || "keine";

  return [
    `TITEL: ${extract.title || "(keiner)"}`,
    `META-BESCHREIBUNG: ${extract.description || "(keine)"}`,
    `NAVIGATION: ${extract.navLabels.join(" | ") || "(keine gefunden)"}`,
    "ÜBERSCHRIFTEN:",
    ...(extract.headings.length
      ? extract.headings.map((heading) => `  ${heading}`)
      : ["  (keine)"]),
    `BILDER: ${extract.imageCount} insgesamt, davon ${extract.imagesWithoutAlt} ohne Alternativtext`,
    "ALTERNATIVTEXTE:",
    ...(extract.altTexts.length
      ? extract.altTexts.map((alt) => `  ${alt}`)
      : ["  (keine)"]),
    `KONTAKTWEGE IM QUELLTEXT: ${kontaktwege}`,
    "SEITENTEXT (Anfang):",
    extract.bodyStart || "(kein Text gefunden)",
  ].join("\n");
}
