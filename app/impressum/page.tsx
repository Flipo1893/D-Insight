import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
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
            Entwurf. Die Angaben in eckigen Klammern müssen vor dem Livegang
            ersetzt und von euch geprüft werden.
          </p>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Verantwortlich für diese Website
              </h2>
              <p>
                D-Insight
                <br />
                Dominic Felder und Beg Sherifi
                <br />
                Bahnhofplatz 1
                <br />
                8001 Zürich
                <br />
                Schweiz
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Kontakt
              </h2>
              <p>
                E-Mail:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted-strong underline transition-colors hover:text-accent-text"
                >
                  {site.email}
                </a>
                <br />
                Telefon: [Telefonnummer]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Rechtsform und Register
              </h2>
              <p>
                [Rechtsform, zum Beispiel Einzelunternehmen oder GmbH]
                <br />
                Handelsregister: [UID-Nummer CHE-xxx.xxx.xxx, sofern
                eingetragen]
                <br />
                Mehrwertsteuer: [MWST-Nummer, sofern MWST-pflichtig]
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Haftungsausschluss
              </h2>
              <p>
                Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für
                Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr
                übernommen. Für Inhalte externer Websites, auf die verlinkt
                wird, sind ausschliesslich deren Betreiber verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Urheberrecht
              </h2>
              <p>
                Die Inhalte dieser Website sind urheberrechtlich geschützt. Eine
                Verwendung ausserhalb der Grenzen des Urheberrechtsgesetzes
                bedarf der schriftlichen Zustimmung von D-Insight.
              </p>
            </section>
          </div>

          {/* Not legal advice: this is a starting structure, not a reviewed
              text. The Swiss requirement for an easily findable contact point
              comes from UWG Art. 3 Abs. 1 lit. s for anyone selling online. */}
          <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
            Hinweis: Dieser Entwurf ersetzt keine Rechtsberatung. Die
            Kontaktangaben orientieren sich an Art. 3 Abs. 1 lit. s UWG.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
