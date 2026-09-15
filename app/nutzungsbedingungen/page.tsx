import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description:
    "Regeln für die Nutzung dieser Website und des kostenlosen Website-Schnellchecks.",
  alternates: { canonical: "/nutzungsbedingungen" },
  robots: { index: true, follow: true },
};

/**
 * Nutzungsbedingungen, getrennt von den AGB.
 *
 * Die AGB regeln bezahlte Projekte. Diese hier regeln die Website und den
 * kostenlosen Schnellcheck, einen Endpunkt, der unseren Server eine Adresse
 * abrufen lässt, die jemand anderes gewählt hat. Dafür braucht es eine
 * schriftliche Grenze, nicht nur ein Abfragelimit.
 *
 * Ein Kundenkonto gibt es auf dieser Website nicht mehr, deshalb sind die
 * Abschnitte zu Konto, Kundenbereich und Sperrung entfallen.
 */
const sections = [
  {
    title: "1. Geltungsbereich",
    paragraphs: [
      "Diese Bedingungen gelten für die Nutzung dieser Website und der kostenlos angebotenen Werkzeuge, insbesondere des Website-Schnellchecks.",
      "Für kostenpflichtige Projekte gelten unsere Allgemeinen Geschäftsbedingungen.",
    ],
  },
  {
    title: "2. Zulässige Nutzung des Schnellchecks",
    paragraphs: [
      "Der Schnellcheck darf für Websites genutzt werden, die Ihnen gehören oder für deren Prüfung Sie berechtigt sind, sowie für öffentlich erreichbare Seiten zu Vergleichszwecken in üblichem Umfang.",
      "Nicht zulässig sind insbesondere automatisierte Abfragen in grossem Umfang, das Umgehen technischer Begrenzungen, das Prüfen von Adressen in internen Netzen sowie jede Nutzung, die einen Dienst Dritter beeinträchtigt.",
      "Wir begrenzen die Zahl der Abfragen pro Zeitraum und rufen ausschliesslich öffentlich erreichbare Seiten ab.",
    ],
  },
  {
    title: "3. Ergebnisse",
    paragraphs: [
      "Die Ergebnisse des Schnellchecks sind eine automatisierte Einschätzung anhand öffentlich sichtbarer Angaben der geprüften Seite. Teile davon können mithilfe eines Sprachmodells erstellt werden. Sie ersetzen keine vollständige Prüfung und sind keine Zusicherung.",
    ],
  },
  {
    title: "4. Geteilte Berichte",
    paragraphs: [
      "Wer einen Prüfbericht teilbar macht, erzeugt eine Adresse, die für jede Person erreichbar ist, die den Link kennt. Teilen Sie ihn nur mit Personen, die den Bericht sehen dürfen.",
      "Geteilte Berichte werden nach 30 Tagen automatisch gelöscht. Wir können Berichte vorher entfernen, wenn ein begründeter Hinweis auf Missbrauch vorliegt.",
    ],
  },
  {
    title: "5. Verfügbarkeit",
    paragraphs: [
      "Wir bemühen uns um einen zuverlässigen Betrieb, schulden aber keine bestimmte Verfügbarkeit. Die kostenlosen Werkzeuge können wir jederzeit ändern oder einstellen.",
    ],
  },
  {
    title: "6. Haftung",
    paragraphs: [
      "Für die kostenlos angebotenen Werkzeuge und die Inhalte dieser Website haften wir nur für Vorsatz und grobe Fahrlässigkeit, soweit gesetzlich zulässig.",
    ],
  },
  {
    title: "7. Änderungen",
    paragraphs: [
      "Wir können diese Bedingungen ändern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.",
    ],
  },
  {
    title: "8. Anwendbares Recht",
    paragraphs: [
      "Es gilt schweizerisches Recht. Gerichtsstand ist Zürich, soweit nicht zwingende Bestimmungen etwas anderes vorschreiben.",
    ],
  },
];

export default function Nutzungsbedingungen() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Nutzungsbedingungen
          </h1>
          <p className="mt-2 font-mono text-xs text-muted">
            Stand: 15. September 2026
          </p>

          <div className="mt-12 space-y-10 text-muted">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-3" : undefined}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-border pt-6 text-sm leading-relaxed text-muted">
            Fragen an{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
            . Siehe auch{" "}
            <Link
              href="/agb"
              className="underline transition-colors hover:text-foreground"
            >
              AGB
            </Link>{" "}
            und{" "}
            <Link
              href="/datenschutz"
              className="underline transition-colors hover:text-foreground"
            >
              Datenschutz
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
