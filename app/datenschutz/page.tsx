import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { analyticsId, site } from "../lib/content";
import { aiCheckEnabled } from "@/lib/site-check/ai/config";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

/**
 * Datenschutzerklärung nach Art. 19 ff. DSG.
 *
 * Beschreibt nur, was auf dieser Website tatsächlich läuft. Google Analytics
 * und die KI-Einschätzung im Schnellcheck sind per Umgebungsvariable
 * schaltbar; ihre Abschnitte erscheinen nur, wenn der Dienst aktiv ist. Eine
 * Erklärung, die einen abgeschalteten Dienst beschreibt, ist ungenau, und
 * eine, die einen eingeschalteten verschweigt, ist unvollständig.
 */

const sectionTitle = "mb-2 text-lg font-semibold text-foreground";

export default function Datenschutz() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-2 font-mono text-xs text-muted">
            Stand: 15. September 2026
          </p>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className={sectionTitle}>Verantwortliche Stelle</h2>
              <p>
                D-Insight, einfache Gesellschaft von Dominic Felder und Beg
                Sherifi
                <br />
                {site.address.street}, {site.address.postalCode}{" "}
                {site.address.city}, {site.address.country}
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted-strong underline transition-colors hover:text-accent-text"
                >
                  {site.email}
                </a>
              </p>
              <p className="mt-3">
                Für alle Fragen zum Datenschutz erreichen Sie uns unter dieser
                Adresse.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Grundsatz</h2>
              <p>
                Wir bearbeiten Personendaten nach dem schweizerischen
                Datenschutzgesetz (DSG) und, soweit anwendbar, nach der
                Datenschutz-Grundverordnung der EU (DSGVO). Wir bearbeiten nur
                Daten, die für den Betrieb dieser Website und für die
                Bearbeitung Ihrer Anfragen nötig sind. Wir verkaufen keine Daten
                und geben sie nicht zu Werbezwecken weiter.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Hosting und Server-Logfiles</h2>
              <p>
                Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133,
                Covina, CA 91723, USA, betrieben. Beim Aufruf erfasst Vercel
                technisch notwendige Daten wie IP-Adresse, Zeitpunkt des
                Zugriffs, aufgerufene Seite und Browsertyp. Diese Daten dienen
                ausschliesslich der Auslieferung und dem sicheren Betrieb der
                Website und werden nicht mit anderen Daten zusammengeführt.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Kontaktformular und E-Mail</h2>
              <p>
                Wenn Sie uns über das Formular oder per E-Mail kontaktieren,
                bearbeiten wir Ihren Namen, Ihre E-Mail-Adresse, optional Ihre
                Website-Adresse sowie Ihre Angaben zum Vorhaben und Ihre
                Nachricht. Wir verwenden diese Angaben ausschliesslich, um Ihre
                Anfrage zu beantworten und gegebenenfalls eine Offerte zu
                erstellen.
              </p>
              <p className="mt-3">
                Das Formular wird über Formspree, Inc., USA, übermittelt. Dabei
                werden die eingegebenen Daten an diesen Anbieter übertragen und
                von dort an uns weitergeleitet.
              </p>
              <p className="mt-3">
                Wir bewahren Anfragen so lange auf, wie es für die Bearbeitung
                nötig ist. Kommt ein Auftrag zustande, gelten die gesetzlichen
                Aufbewahrungsfristen für Geschäftskorrespondenz von bis zu zehn
                Jahren.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Website-Schnellcheck</h2>
              <p>
                Wenn Sie den Schnellcheck nutzen, ruft unser Server die von
                Ihnen eingegebene Adresse einmal auf und wertet die öffentlich
                sichtbaren Angaben dieser Seite aus. Die eingegebene Adresse
                wird nicht dauerhaft gespeichert. Damit das Kontaktformular sie
                übernehmen kann, wird sie bis zum Schliessen des Browser-Tabs
                lokal in Ihrem Gerät vorgehalten.
              </p>
              <p className="mt-3">
                Um Missbrauch zu verhindern, begrenzen wir die Zahl der
                Prüfungen pro Minute. Dazu wird Ihre IP-Adresse kurzzeitig im
                Arbeitsspeicher des Servers gehalten und nicht gespeichert.
              </p>
              <p className="mt-3">
                Wenn Sie einen Bericht teilbar machen, wird das Ergebnis unter
                einer zufällig erzeugten, nicht erratbaren Adresse in einer
                Datenbank von MongoDB, Inc., USA, gespeichert. Wer diesen Link
                besitzt, kann den Bericht ansehen. Er ist von Suchmaschinen
                ausgenommen und wird nach 30 Tagen automatisch gelöscht. Ohne
                Ihr Zutun wird nichts gespeichert.
              </p>
            </section>

            {aiCheckEnabled && (
              <section>
                <h2 className={sectionTitle}>KI-Einschätzung im Schnellcheck</h2>
                <p>
                  Für die Einschätzung, ob eine Website ihr Angebot verständlich
                  darstellt, übermitteln wir einen Auszug der öffentlich
                  sichtbaren Inhalte der geprüften Seite an OpenAI, L.L.C.,
                  USA. Übermittelt werden Titel, Überschriften, Navigation,
                  Textausschnitte und Angaben zu Kontaktwegen der geprüften
                  Seite, keine Angaben über Sie selbst. Nach den Bedingungen
                  von OpenAI für die Programmierschnittstelle werden diese
                  Daten nicht zum Training von Modellen verwendet.
                </p>
              </section>
            )}

            <section>
              <h2 className={sectionTitle}>
                Vercel Web Analytics und Speed Insights
              </h2>
              <p>
                Wir nutzen Vercel Web Analytics und Vercel Speed Insights,
                Dienste der Vercel Inc., USA. Web Analytics erfasst die
                aufgerufene Seite, die verweisende Seite, den ungefähren
                Standort auf Länderebene sowie Angaben zu Gerät,
                Betriebssystem und Browser. Speed Insights misst, wie schnell
                eine Seite bei Ihnen geladen und bedienbar wurde.
              </p>
              <p className="mt-3">
                Es werden keine Cookies gesetzt und keine Kennungen in Ihrem
                Browser gespeichert. Sie werden nicht über mehrere
                Seitenaufrufe hinweg wiedererkannt und nicht
                seitenübergreifend verfolgt, und die IP-Adresse wird nicht
                gespeichert. Wir nutzen die Werte ausschliesslich, um die
                Website zu verbessern.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Cookies</h2>
              <p>
                Für den Betrieb dieser Website sind keine Cookies nötig.
                {analyticsId
                  ? " Cookies setzen wir nur für Google Analytics, und nur nach Ihrer ausdrücklichen Zustimmung."
                  : " Wir setzen keine Cookies."}
              </p>
            </section>

            {analyticsId && (
              <section>
                <h2 className={sectionTitle}>Google Analytics</h2>
                <p>
                  Nur wenn Sie beim ersten Besuch zustimmen, setzen wir Google
                  Analytics ein, einen Dienst der Google Ireland Limited, Gordon
                  House, Barrow Street, Dublin 4, Irland. Dabei werden Cookies
                  gesetzt und Nutzungsdaten verarbeitet, unter anderem gekürzte
                  IP-Adresse, aufgerufene Seiten, Verweildauer, ungefährer
                  Standort sowie Angaben zu Gerät und Browser. Die Daten können
                  in die USA übertragen und dort von Google LLC verarbeitet
                  werden.
                </p>
                <p className="mt-3">
                  Vor Ihrer Zustimmung wird nichts geladen und nichts
                  übertragen. Ablehnen ist genauso einfach wie Zustimmen. Sie
                  können Ihre Entscheidung jederzeit über den Eintrag „Cookies“
                  im Seitenfuss widerrufen. Die IP-Anonymisierung ist
                  aktiviert, Werbefunktionen sind abgeschaltet.
                </p>
              </section>
            )}

            <section>
              <h2 className={sectionTitle}>Schriftarten</h2>
              <p>
                Die Schriften werden zusammen mit der Website ausgeliefert. Beim
                Besuch dieser Seite entsteht keine Verbindung zu Servern von
                Google.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Bekanntgabe ins Ausland</h2>
              <p>
                Die oben genannten Dienstleister haben ihren Sitz in den USA,
                oder Daten können dorthin übermittelt werden. Die USA verfügen
                aus Sicht des Schweizer Datenschutzrechts nicht generell über
                ein angemessenes Schutzniveau. Soweit die Anbieter unter dem
                Swiss-U.S. Data Privacy Framework zertifiziert sind, stützt
                sich die Übermittlung darauf, andernfalls auf die
                Standardvertragsklauseln der jeweiligen Anbieter. Ein Zugriff
                durch US-Behörden lässt sich nicht vollständig ausschliessen.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Ihre Rechte</h2>
              <p>
                Sie haben das Recht, Auskunft über die zu Ihrer Person
                bearbeiteten Daten zu verlangen, sowie deren Berichtigung oder
                Löschung. Sie können einer Bearbeitung widersprechen und
                erteilte Einwilligungen jederzeit widerrufen. Eine formlose
                Nachricht an {site.email} genügt. Wir antworten innert 30
                Tagen.
              </p>
              <p className="mt-3">
                Sie haben zudem das Recht, sich beim Eidgenössischen
                Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) zu
                beschweren, oder, wenn Sie in der EU wohnen, bei der
                Datenschutzbehörde Ihres Wohnsitzstaates.
              </p>
            </section>

            <section>
              <h2 className={sectionTitle}>Änderungen</h2>
              <p>
                Wir passen diese Erklärung an, wenn sich die eingesetzten
                Dienste oder die rechtlichen Vorgaben ändern. Es gilt die
                jeweils auf dieser Seite veröffentlichte Fassung.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
