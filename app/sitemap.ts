import type { MetadataRoute } from "next";
import { references } from "./lib/references";
import { site } from "./lib/content";

/**
 * Only pages that should actually rank. Shared check reports are noindex
 * and deliberately unguessable, so listing them here would both ask Google
 * to crawl pages we tell it to ignore and publish someone else's findings.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    // Leistungen, Prozess and Über uns are their own pages on this branch,
    // so they belong here. Leaving them out would hide three of the most
    // relevant pages from search entirely.
    ...["leistungen", "prozess", "ueber-uns", "preise"].map((slug) => ({
      url: `${site.url}/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // All four legal pages, not just two. They rank for nothing and carry the
    // lowest priority here, but an offer refers to the AGB by name and the
    // recipient will look for them. A page a client is pointed at should be
    // findable, and half a legal section listed is the kind of gap that only
    // shows up once someone goes looking.
    ...["impressum", "datenschutz", "agb", "nutzungsbedingungen"].map(
      (slug) => ({
        url: `${site.url}/${slug}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }),
    ),
  ];

  const referencePages: MetadataRoute.Sitemap = references.map((reference) => ({
    url: `${site.url}/referenzen/${reference.slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  if (references.length > 0) {
    referencePages.unshift({
      url: `${site.url}/referenzen`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return [...staticPages, ...referencePages];
}
