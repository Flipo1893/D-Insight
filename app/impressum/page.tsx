import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { site } from "../lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

/**
 * Anbieterkennzeichnung nach Art. 3 Abs. 1 lit. s UWG: Identität und
 * Kontaktadresse inklusive E-Mail. Eine Telefonnummer verlangt das Gesetz
 * nicht, deshalb steht bewusst keine da.
 *
 * D-Insight ist eine einfache Gesellschaft (Art. 530 ff. OR). Sie hat keine
 * eigene Rechtspersönlichkeit und keinen Handelsregistereintrag, deshalb
 * werden die Gesellschafter namentlich genannt.
 */
export default function Impressum() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Impressum
          </h1>

          <div className="mt-10 space-y-8 text-muted">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Anbieter
              </h2>
              <p>
                D-Insight
                <br />
                Einfache Gesellschaft von Dominic Felder und Beg Sherifi
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
                <br />
                {site.address.country}
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
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Rechtsform, Register und Mehrwertsteuer
              </h2>
              <p>
                Rechtsform: Einfache Gesellschaft nach Art. 530 ff. OR
                <br />
                Handelsregister: nicht eingetragen
                <br />
                Mehrwertsteuer: nicht mehrwertsteuerpflichtig
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
        </div>
      </main>
      <Footer />
    </>
  );
}
