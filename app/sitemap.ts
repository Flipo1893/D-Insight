import type { MetadataRoute } from "next";
import { site } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/impressum`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/datenschutz`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
