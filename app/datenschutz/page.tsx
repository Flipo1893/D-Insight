import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Datenschutz — D-Insight",
};

export default function Datenschutz() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="break-words text-3xl font-semibold tracking-tight md:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-4 text-sm text-accent">
            Platzhalter — bitte vor Veröffentlichung durch einen
            rechtsgültigen Text (z. B. via Anwalt oder Datenschutz-Generator)
            ersetzen.
          </p>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                1. Verantwortlicher
              </h2>
              <p>
                [Vorname Nachname] / D-Insight
                <br />
                [Straße und Hausnummer], [PLZ und Ort]
                <br />
                E-Mail: [E-Mail-Adresse]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                2. Erhebung und Verarbeitung von Daten
              </h2>
              <p>
                Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die
                von Ihnen angegebenen Daten (Name, E-Mail-Adresse,
                Website-URL, Nachricht) ausschließlich zur Bearbeitung Ihrer
                Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                3. Formular-Dienstleister
              </h2>
              <p>
                Die Übermittlung des Kontaktformulars erfolgt über einen
                externen Dienstleister (Formspree). [Details zum
                Auftragsverarbeiter und Serverstandort ergänzen.]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                4. Ihre Rechte
              </h2>
              <p>
                Sie haben jederzeit das Recht auf Auskunft, Berichtigung,
                Löschung und Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten sowie ein Widerspruchsrecht gegen die
                Verarbeitung.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
