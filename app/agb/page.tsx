import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen für Website-Refactoring, Redesign und KI-SEO.",
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

const sections = [
  {
    title: "1. Vertragspartner und Geltungsbereich",
    paragraphs: [
      `Vertragspartner ist D-Insight, eine einfache Gesellschaft von Dominic Felder und Beg Sherifi, ${address}.`,
      "Diese Bedingungen gelten für alle Verträge zwischen D-Insight und dem Auftraggeber über Website-Refactoring, visuelles Redesign, Suchmaschinenoptimierung und damit verbundene Leistungen.",
      "Abweichende Bedingungen des Auftraggebers gelten nur, wenn wir ihnen schriftlich zustimmen.",
    ],
  },
  {
    title: "2. Angebot und Vertragsschluss",
    paragraphs: [
      "Darstellungen auf dieser Website sind unverbindlich und stellen kein Angebot dar. Ein Vertrag kommt zustande, wenn wir eine Offerte stellen und der Auftraggeber diese schriftlich oder per E-Mail annimmt.",
      "Der Leistungsumfang ergibt sich aus der Offerte. Was dort nicht aufgeführt ist, ist nicht Vertragsbestandteil. Zusätzliche Wünsche erfassen wir als Nachtrag mit eigenem Preis.",
    ],
  },
  {
    title: "3. Mitwirkung des Auftraggebers",
    paragraphs: [
      "Der Auftraggeber stellt die für die Umsetzung nötigen Inhalte, Bilder, Logos und Zugänge rechtzeitig bereit und benennt eine entscheidungsbefugte Ansprechperson.",
      "Verzögert sich die Mitwirkung, verschieben sich vereinbarte Termine entsprechend. Mehraufwand, der dadurch entsteht, wird nach Aufwand verrechnet.",
    ],
  },
  {
    title: "4. Rechte an Inhalten",
    paragraphs: [
      "Der Auftraggeber sichert zu, dass er über die nötigen Rechte an den von ihm gelieferten Inhalten verfügt, insbesondere an Texten, Bildern, Logos und Schriften.",
      "Für Ansprüche Dritter wegen der vom Auftraggeber gelieferten Inhalte haftet der Auftraggeber und stellt uns von solchen Ansprüchen frei.",
    ],
  },
  {
    title: "5. Nutzungsrechte am Ergebnis",
    paragraphs: [
      "Mit vollständiger Bezahlung erhält der Auftraggeber das zeitlich und räumlich unbeschränkte Recht, die erstellte Website zu nutzen, zu ändern und weiterentwickeln zu lassen, auch durch Dritte.",
      "Verwendete Bibliotheken und Schriften Dritter unterliegen deren eigenen Lizenzen. Wir weisen darauf hin, wo solche Lizenzen Einschränkungen enthalten.",
      "Wir dürfen das Projekt als Referenz nennen und abbilden, sofern der Auftraggeber dem nicht widerspricht.",
    ],
  },
  {
    title: "6. Abnahme",
    paragraphs: [
      "Nach Fertigstellung teilen wir die Leistung zur Abnahme mit. Der Auftraggeber prüft sie innert zehn Arbeitstagen und meldet Mängel schriftlich.",
      "Erfolgt innert dieser Frist keine Rückmeldung oder wird die Website produktiv genutzt, gilt die Leistung als abgenommen. Unwesentliche Abweichungen berechtigen nicht zur Verweigerung der Abnahme.",
    ],
  },
  {
    title: "7. Preise und Zahlung",
    paragraphs: [
      "Es gelten die Preise der Offerte in Schweizer Franken. D-Insight ist nicht mehrwertsteuerpflichtig; die Preise sind Endpreise, es wird keine Mehrwertsteuer ausgewiesen.",
      "Bei Projekten stellen wir üblicherweise 50 Prozent bei Auftragserteilung und den Rest nach Abnahme in Rechnung, sofern die Offerte nichts anderes vorsieht.",
      "Rechnungen sind innert 30 Tagen ohne Abzug zahlbar. Nach Ablauf dieser Frist gerät der Auftraggeber ohne weitere Mahnung in Verzug.",
    ],
  },
  {
    title: "8. Gewährleistung",
    paragraphs: [
      "Wir gewährleisten, dass die Leistung bei Abnahme der vereinbarten Beschaffenheit entspricht. Mängel, die innert sechs Monaten nach Abnahme gemeldet werden, beheben wir kostenlos.",
      "Nicht als Mangel gelten Beeinträchtigungen durch Änderungen, die der Auftraggeber oder Dritte vornehmen, durch Ausfälle beim Hosting-Anbieter oder durch Änderungen an Diensten Dritter.",
      "Rankings in Suchmaschinen und Sichtbarkeit in KI-Systemen hängen von Faktoren ab, die ausserhalb unseres Einflusses liegen. Eine bestimmte Position oder Reichweite können wir daher nicht zusichern.",
    ],
  },
  {
    title: "9. Haftung",
    paragraphs: [
      "Wir haften für Schäden aus Vorsatz und grober Fahrlässigkeit. Für leichte Fahrlässigkeit ist die Haftung ausgeschlossen, soweit gesetzlich zulässig.",
      "Die Haftung für entgangenen Gewinn, ausgebliebene Aufträge und mittelbare Schäden ist ausgeschlossen, soweit gesetzlich zulässig. Die Haftung für Personenschäden bleibt unberührt.",
      "Der Auftraggeber ist für Sicherungskopien seiner Daten verantwortlich.",
    ],
  },
  {
    title: "10. Laufzeit und Kündigung",
    paragraphs: [
      "Projektverträge enden mit der Abnahme. Laufende Betreuung kann von beiden Seiten mit einer Frist von einem Monat auf Monatsende gekündigt werden.",
      "Das Recht zur ausserordentlichen Kündigung aus wichtigem Grund bleibt vorbehalten. Bereits erbrachte Leistungen werden abgerechnet.",
    ],
  },
  {
    title: "11. Datenschutz",
    paragraphs: [
      "Wir bearbeiten Personendaten des Auftraggebers nur, soweit dies für die Vertragserfüllung nötig ist. Einzelheiten stehen in der Datenschutzerklärung.",
    ],
  },
  {
    title: "12. Änderungen dieser Bedingungen",
    paragraphs: [
      "Wir können diese Bedingungen für künftige Verträge ändern. Für einen bereits geschlossenen Vertrag gilt die Fassung, die bei Vertragsschluss in Kraft war.",
    ],
  },
  {
    title: "13. Anwendbares Recht und Gerichtsstand",
    paragraphs: [
      "Es gilt schweizerisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Zürich, soweit nicht zwingende Bestimmungen etwas anderes vorschreiben.",
      "Gegenüber Konsumentinnen und Konsumenten bleiben die zwingenden Gerichtsstände nach Art. 32 ZPO sowie die zwingenden Schutzbestimmungen ihres Wohnsitzstaates unberührt.",
    ],
  },
];

export default function AGB() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Allgemeine Geschäftsbedingungen
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
            Fragen zu diesen Bedingungen beantworten wir gerne unter{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
            . Siehe auch{" "}
            <Link
              href="/datenschutz"
              className="underline transition-colors hover:text-foreground"
            >
              Datenschutz
            </Link>{" "}
            und{" "}
            <Link
              href="/nutzungsbedingungen"
              className="underline transition-colors hover:text-foreground"
            >
              Nutzungsbedingungen
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
