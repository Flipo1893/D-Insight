import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "D-Insight — Website-Refactoring & KI-SEO";
const description =
  "Wir verwandeln veraltete Websites in schnelle, moderne Auftritte — mit klarem Redesign und KI-gestützter Suchmaschinenoptimierung (GEO). Ein Projekt, zwei Ansprechpartner.";

export const metadata: Metadata = {
  // Set the real production URL before launch so canonical/OG tags resolve correctly.
  metadataBase: new URL("https://www.d-insight.de"),
  title: {
    default: title,
    template: "%s — D-Insight",
  },
  description,
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
    type: "website",
    locale: "de_DE",
    siteName: "D-Insight",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
