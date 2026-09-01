import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description:
    "Regeln für die Nutzung des Kundenbereichs und der kostenlosen Werkzeuge auf dieser Website.",
  alternates: { canonical: "/nutzungsbedingungen" },
  robots: { index: true, follow: true },
};

/**
 * Terms of use, separate from the AGB.
 *
 * The AGB govern a paid project. These govern the account, the dashboard and
 * the free tools, which is where the risk actually sits: without stated
 * rules there is no basis for suspending an account, and the quick check is
 * an endpoint that makes our server fetch a URL somebody else chose. That
 * needs a written boundary, not only a rate limit.
 */
const sections = [
  {
    title: "1. Was diese Bedingungen regeln",
    paragraphs: [
      "Diese Bedingungen gelten für die Nutzung dieser Website, des Kundenbereichs und der kostenlos angebotenen Werkzeuge, insbesondere des Website-Schnellchecks.",
      "Für kostenpflichtige Projekte gelten zusätzlich unsere Allgemeinen Geschäftsbedingungen. Bei Widersprüchen gehen für den Projektvertrag die AGB vor.",
    ],
  },
  {
    title: "2. Konto",
    paragraphs: [
      "Ein Konto ist für Kundinnen und Kunden bestimmt, deren Website wir betreuen. Die Zugangsdaten sind vertraulich zu behandeln und nicht weiterzugeben.",
      "Wer den Verdacht hat, dass Unbefugte Zugriff haben, meldet uns das unverzüglich. Bis zur Meldung gelten Handlungen über das Konto als vom Kontoinhaber veranlasst.",
      "Angaben im Konto müssen zutreffend sein. Konten auf falschen Namen können wir schliessen.",
    ],
  },
  {
    title: "3. Zulässige Nutzung der Werkzeuge",
    paragraphs: [
      "Der Schnellcheck darf für Websites genutzt werden, die Ihnen gehören oder für deren Prüfung Sie berechtigt sind, sowie für öffentlich erreichbare Seiten zu Vergleichszwecken in üblichem Umfang.",
      "Nicht zulässig ist insbesondere: automatisiertes Abfragen in grossem Umfang, das Umgehen technischer Begrenzungen, das Prüfen von Adressen in fremden internen Netzen, sowie jede Nutzung, die einen Dienst Dritter beeinträchtigt.",
      "Wir begrenzen die Zahl der Abfragen pro Zeitraum und prüfen ausschliesslich öffentlich abrufbare Angaben der aufgerufenen Seite.",
    ],
  },
  {
    title: "4. Geteilte Berichte",
    paragraphs: [
      "Wer einen Prüfbericht teilbar macht, erzeugt eine Adresse, die für jeden erreichbar ist, der den Link kennt. Teilen Sie ihn nur mit Personen, die den Bericht sehen dürfen.",
      "Geteilte Berichte werden nach 30 Tagen automatisch gelöscht. Wir können Berichte vorher entfernen, wenn ein begründeter Hinweis auf Missbrauch vorliegt.",
    ],
  },
  {
    title: "5. Inhalte im Kundenbereich",
    paragraphs: [
      "Für Inhalte, die Sie im Kundenbereich einstellen, bleiben Sie verantwortlich. Sie sichern zu, über die nötigen Rechte zu verfügen und keine rechtswidrigen Inhalte einzustellen.",
      "Wir sichten Inhalte nicht vorab. Erhalten wir Kenntnis von rechtswidrigen Inhalten, entfernen wir sie.",
    ],
  },
  {
    title: "6. Sperrung und Kündigung",
    paragraphs: [
      "Wir können ein Konto sperren oder Leistungen aussetzen, wenn diese Bedingungen erheblich oder wiederholt verletzt werden, wenn der Betrieb oder die Sicherheit unserer Systeme gefährdet ist, oder wenn wir dazu rechtlich verpflichtet sind.",
      "Soweit möglich und zumutbar, weisen wir vorher darauf hin und geben Gelegenheit zur Abhilfe. Bei Gefahr im Verzug sperren wir sofort und informieren danach.",
      "Sie können Ihr Konto jederzeit ohne Angabe von Gründen kündigen. Nach Kündigung löschen wir Ihre im Kundenbereich gespeicherten Inhalte innert 30 Tagen, soweit keine Aufbewahrungspflichten entgegenstehen.",
    ],
  },
  {
    title: "7. Verfügbarkeit",
    paragraphs: [
      "Wir bemühen uns um einen zuverlässigen Betrieb, schulden aber keine bestimmte Verfügbarkeit. Wartungsarbeiten, Störungen bei Vorleistern und Ereignisse ausserhalb unseres Einflussbereichs können zu Unterbrechungen führen.",
      "Die kostenlosen Werkzeuge werden ohne Zusicherung angeboten. Wir können sie ändern oder einstellen.",
    ],
  },
  {
    title: "8. Haftung",
    paragraphs: [
      "Für die kostenlos angebotenen Werkzeuge haften wir nur für Vorsatz und grobe Fahrlässigkeit. Die Ergebnisse des Schnellchecks sind eine automatisierte Einschätzung anhand öffentlich sichtbarer Angaben und ersetzen keine vollständige Prüfung.",
      "Im Übrigen gelten die Haftungsregeln unserer AGB.",
    ],
  },
  {
    title: "9. Änderungen",
    paragraphs: [
      "Wir können diese Bedingungen ändern, wenn dafür ein sachlicher Grund besteht. Über wesentliche Änderungen informieren wir Kontoinhaber mindestens 30 Tage vorher per E-Mail. Wer nicht widerspricht, stimmt zu; bei Widerspruch endet die Nutzung des Kontos zum Zeitpunkt des Inkrafttretens.",
    ],
  },
  {
    title: "10. Anwendbares Recht",
    paragraphs: [
      "Es gilt schweizerisches Recht. Gerichtsstand ist Zürich. Gegenüber Verbrauchern mit Wohnsitz in der EU bleiben die zwingenden Bestimmungen ihres Wohnsitzstaates unberührt.",
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
          <p className="mt-4 text-sm text-accent-text">
            Entwurf. Vor dem Livegang juristisch prüfen lassen und die Angaben
            in eckigen Klammern ersetzen.
          </p>
          <p className="mt-2 font-mono text-xs text-muted">
            Stand: 1. September 2026
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

          <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted">
            Dieser Entwurf ersetzt keine Rechtsberatung. Fragen an{" "}
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
