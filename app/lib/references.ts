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
  /** What the site looked like and why it was a problem. */
  situation: string;
  /** What we changed. */
  work: string[];
  /** Measured afterwards. Only numbers you can actually show a client. */
  results: { label: string; value: string }[];
  beforeImage?: string;
  afterImage?: string;
};

export const references: Reference[] = [];

export function getReference(slug: string): Reference | undefined {
  return references.find((reference) => reference.slug === slug);
}
