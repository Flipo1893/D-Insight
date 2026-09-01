import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

export default function Datenschutz() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-4 text-sm text-accent-text">
            Entwurf. Vor dem Livegang prüfen und an die tatsächlich
            eingesetzten Dienste anpassen.
          </p>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Verantwortliche Stelle
              </h2>
              <p>
                D-Insight, [Strasse und Hausnummer], [PLZ und Ort], Schweiz
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted-strong underline transition-colors hover:text-accent-text"
                >
                  {site.email}
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Grundsatz
              </h2>
              <p>
                Wir bearbeiten Personendaten nach dem schweizerischen
                Datenschutzgesetz (DSG). Wir erheben nur Daten, die für den
                Betrieb dieser Website und für die Bearbeitung von Anfragen
                nötig sind, und geben sie nicht zu Werbezwecken weiter.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Kontaktformular
              </h2>
              <p>
                Wenn Sie das Formular nutzen, übermitteln Sie uns Name,
                E-Mail-Adresse, optional Ihre Website-URL und Ihre Nachricht.
                Wir verwenden diese Angaben ausschliesslich, um Ihre Anfrage zu
                beantworten. Der Versand läuft über [Formspree Inc., USA]. Dabei
                werden die eingegebenen Daten an diesen Anbieter übermittelt.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Server-Logfiles
              </h2>
              <p>
                Beim Aufruf der Website erfasst der Hosting-Anbieter technisch
                notwendige Daten wie IP-Adresse, Zeitpunkt des Zugriffs,
                aufgerufene Seite und Browsertyp. Diese Daten dienen dem
                sicheren Betrieb und werden nicht mit anderen Datenquellen
                zusammengeführt. Hosting-Anbieter: [Anbieter und Standort].
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Cookies und Analyse
              </h2>
              <p>
                Diese Website setzt keine Tracking-Cookies und bindet keine
                Analyse- oder Werbedienste ein. Sollte sich das ändern, wird
                diese Erklärung vorher angepasst und, wo nötig, eine
                Einwilligung eingeholt.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Schriftarten
              </h2>
              <p>
                Die Schriften werden beim Build lokal eingebunden und zusammen
                mit der Website ausgeliefert. Es entsteht keine Verbindung zu
                Google-Servern, wenn Sie diese Seite besuchen.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Ihre Rechte
              </h2>
              <p>
                Sie haben das Recht auf Auskunft über die zu Ihrer Person
                bearbeiteten Daten sowie auf Berichtigung oder Löschung. Eine
                formlose Nachricht an die oben genannte Adresse genügt.
              </p>
            </section>
          </div>

          <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
            Hinweis: Dieser Entwurf ersetzt keine Rechtsberatung. Wenn Kundinnen
            und Kunden aus der EU angesprochen werden, kann zusätzlich die DSGVO
            gelten.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
