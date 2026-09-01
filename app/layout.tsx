import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import { site } from "./lib/content";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name}: ${site.tagline}`;
const description =
  "Wir verwandeln veraltete Websites in schnelle, moderne Auftritte. Klares Redesign, technisches Refactoring und KI-gestützte Suchmaschinenoptimierung. Ein Projekt, zwei Ansprechpartner.";

export const metadata: Metadata = {
  // Set the real production URL before launch so canonical and OG tags resolve.
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  title: {
    default: title,
    template: `%s: ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: "Dominic Felder" }, { name: "Beg Sherifi" }],
  keywords: [
    "Website-Refactoring",
    "Website-Redesign",
    "KI-SEO",
    "GEO",
    "Generative Engine Optimization",
    "Suchmaschinenoptimierung",
  ],
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    locale: "de_CH",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-brand focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Zum Inhalt springen
        </a>
        <SmoothScroll />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
