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
                D-Insight, Bahnhofplatz 1, 8001 Zürich, Schweiz
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
                Cookies und Einwilligung
              </h2>
              <p>
                Für den Betrieb dieser Website sind keine Cookies nötig. Sie
                können die Seite vollständig nutzen, ohne einer Speicherung
                zuzustimmen.
              </p>
              <p className="mt-3">
                Sofern Google Analytics aktiviert ist, fragen wir Sie beim
                ersten Besuch, ob wir es einsetzen dürfen. Vor Ihrer
                ausdrücklichen Zustimmung wird nichts geladen, es wird kein
                Cookie gesetzt und es werden keine Daten übertragen. Ablehnen
                ist genauso einfach wie Zustimmen, und ohne Auswahl
                geschieht nichts.
              </p>
              <p className="mt-3">
                Ihre Entscheidung können Sie jederzeit über den Eintrag
                „Cookies“ im Seitenfuss ändern. Sie wird ausschliesslich lokal
                in Ihrem Browser gespeichert und nicht an uns übermittelt.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Google Analytics
              </h2>
              <p>
                Wenn Sie zustimmen, setzen wir Google Analytics ein, einen
                Dienst der Google Ireland Limited, Gordon House, Barrow
                Street, Dublin 4, Irland. Dabei werden Cookies gesetzt und
                Nutzungsdaten verarbeitet, unter anderem gekürzte IP-Adresse,
                aufgerufene Seiten, Verweildauer, ungefährer Standort sowie
                Angaben zu Gerät und Browser.
              </p>
              <p className="mt-3">
                Diese Daten können in die USA übertragen und dort von Google
                LLC verarbeitet werden. Die USA gelten datenschutzrechtlich
                nicht als Land mit gleichwertigem Schutzniveau; Google stützt
                die Übermittlung auf das EU-US Data Privacy Framework und auf
                Standardvertragsklauseln. Ein Zugriff durch US-Behörden lässt
                sich nicht vollständig ausschliessen.
              </p>
              <p className="mt-3">
                Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1
                lit. a DSGVO beziehungsweise Art. 31 DSG. Sie können sie
                jederzeit mit Wirkung für die Zukunft widerrufen, über den
                Eintrag „Cookies“ im Seitenfuss. Die IP-Anonymisierung ist
                aktiviert, Werbefunktionen sind abgeschaltet.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Vercel Web Analytics und Speed Insights
              </h2>
              <p>
                Diese Website nutzt Vercel Web Analytics und Vercel Speed
                Insights, zwei Dienste der Vercel Inc., 440 N Barranca Ave
                #4133, Covina, CA 91723, USA. Web Analytics erfasst die
                aufgerufene Seite, die verweisende Seite, ungefähren Standort
                auf Länderebene sowie Angaben zu Gerät, Betriebssystem und
                Browser. Speed Insights misst, wie schnell eine Seite bei
                Ihnen tatsächlich geladen und bedienbar wurde, und erfasst
                dazu die aufgerufene Seite, Gerätetyp und Verbindungsqualität.
              </p>
              <p className="mt-3">
                Es werden keine Cookies gesetzt und keine Kennungen in Ihrem
                Browser gespeichert. Besucherinnen und Besucher werden nicht
                über mehrere Seitenaufrufe hinweg wiedererkannt und nicht
                seitenübergreifend verfolgt; die IP-Adresse wird nicht
                gespeichert. Aus diesem Grund ist für den Einsatz keine
                Einwilligung erforderlich.
              </p>
              <p className="mt-3">
                Die Verarbeitung erfolgt in den USA. Rechtsgrundlage ist unser
                berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO
                beziehungsweise Art. 31 DSG an einer datensparsamen
                Reichweitenmessung. Die USA gelten datenschutzrechtlich nicht
                als Land mit gleichwertigem Schutzniveau; Vercel stützt die
                Übermittlung auf Standardvertragsklauseln. Die Messwerte von
                Speed Insights nutzen wir ausschliesslich, um langsame Seiten
                zu finden und zu beheben.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Website-Schnellcheck
              </h2>
              <p>
                Wenn Sie den Schnellcheck nutzen, ruft unser Server die von
                Ihnen eingegebene Adresse einmal auf und wertet die öffentlich
                sichtbaren Angaben der Seite aus. Die eingegebene Adresse wird
                nicht dauerhaft gespeichert. Für Ihre Bequemlichkeit wird sie
                bis zum Schliessen des Browser-Tabs lokal in Ihrem Gerät
                vorgehalten, damit das Kontaktformular sie übernehmen kann.
              </p>
              <p className="mt-3">
                Wenn Sie einen Bericht teilbar machen, wird das Ergebnis unter
                einer zufällig erzeugten, nicht erratbaren Adresse gespeichert.
                Wer diesen Link besitzt, kann den Bericht ansehen. Er ist von
                Suchmaschinen ausgenommen und wird nach 30 Tagen automatisch
                gelöscht. Ohne Ihr Zutun wird nichts gespeichert.
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
