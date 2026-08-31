import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function Impressum() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Impressum
          </h1>
          <p className="mt-4 text-sm text-accent-text">
            Platzhalter. Bitte mit den tatsächlichen Angaben nach § 5 TMG
            ersetzen.
          </p>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                [Vorname Nachname] / D-Insight
                <br />
                [Straße und Hausnummer]
                <br />
                [PLZ und Ort]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Kontakt
              </h2>
              <p>
                Telefon: [Telefonnummer]
                <br />
                E-Mail: [E-Mail-Adresse]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                Umsatzsteuergesetz: [USt-IdNr.]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                [Vorname Nachname]
                <br />
                [Straße und Hausnummer]
                <br />
                [PLZ und Ort]
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
