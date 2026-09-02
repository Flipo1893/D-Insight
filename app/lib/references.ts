/**
 * Case studies.
 *
 * Deliberately empty. Inventing reference projects would be the fastest way
 * to lose a client who checks, so the page states plainly that the first
 * projects are running rather than showing made-up logos and numbers.
 *
 * To add one: fill in the fields below, drop the screenshots into
 * public/referenzen/<slug>/ and the page, the index and the sitemap pick it
 * up on their own.
 */

export type Reference = {
  slug: string;
  client: string;
  industry: string;
  year: string;
  summary: string;
  /** Live address of the finished site. */
  url?: string;
  /**
   * The narrative parts are optional so a reference can go up with the
   * measured facts alone. Publishing a half-written story is worse than
   * publishing numbers and a link.
   */
  situation?: string;
  work?: string[];
  /** Measured afterwards. Only numbers you can actually show a client. */
  results: { label: string; value: string }[];
  beforeImage?: string;
  afterImage?: string;
};

export const references: Reference[] = [
  {
    slug: "prebuilt",
    client: "Prebuilt",
    industry: "Vorgefertigte Bauelemente",
    year: "2026",
    summary:
      "Von uns gebaut und live. Die gemessenen Werte stehen unten, geprüft mit demselben Schnellcheck, den wir auf dieser Seite anbieten.",
    // Real measurements from our own check on 2026-09-02. Re-measure before
    // quoting them anywhere else; a reference with stale numbers is worse
    // than one with none.
    results: [
      { label: "Sichtbarkeit", value: "88 / 100" },
      { label: "Barrierefreiheit", value: "94 / 100" },
      { label: "Antwortzeit", value: "506 ms" },
      { label: "Seitengrösse", value: "169 KB" },
    ],
    url: "https://prebuilt.ch",
  },
];

export function getReference(slug: string): Reference | undefined {
  return references.find((reference) => reference.slug === slug);
}
