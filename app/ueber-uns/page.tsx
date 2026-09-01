import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import About from "../components/About";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { measured, principles, site } from "../lib/content";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Zwei Entwickler aus der Schweiz, die veraltete Websites neu aufbauen. Wie wir arbeiten, was wir zusagen und was nicht.",
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUns() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Über uns"
          title="Zwei Entwickler, kein Agentur-Apparat"
          description="Sie sprechen mit den Leuten, die auch bauen. Keine Weitergabe an wechselnde Projektteams, keine Zwischenebene."
        />

        <About />

        <section className="border-t border-border bg-surface/30">
          <div className="mx-auto max-w-6xl px-6 py-24 xl:max-w-7xl 2xl:max-w-[1440px]">
            <Reveal>
              <SectionHeading className="max-w-2xl">
                Wie wir arbeiten.
              </SectionHeading>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {principles.map((principle, index) => (
                <Reveal key={principle.title} index={index} className="h-full">
                  <article className="flex h-full flex-col rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 xl:max-w-7xl 2xl:max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <Reveal>
                <SectionHeading>Diese Seite als Beleg.</SectionHeading>
              </Reveal>

              <Reveal index={1}>
                {/* The strongest reference this business currently has is the
                    site the visitor is already on, so it is stated as a
                    measurement rather than as a claim. */}
                <p className="max-w-xl leading-relaxed text-muted">
                  Wir haben noch keine Kundenprojekte zum Vorzeigen. Was wir
                  zeigen können, ist die Seite, auf der Sie gerade sind: nach
                  denselben Regeln gebaut, die wir Ihnen empfehlen.
                </p>

                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8">
                  {[
                    [`${measured.totalKb} KB`, "lädt diese Seite"],
                    [`${measured.requests}`, "Anfragen gesamt"],
                    ["0", "Cookies ohne Ihre Zustimmung"],
                    ["0", "Tracker vor der Einwilligung"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <dt className="sr-only">{label}</dt>
                      <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                        {value}
                      </dd>
                      <p aria-hidden className="mt-0.5 text-xs text-muted">
                        {label}
                      </p>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
                  Die Werte stammen aus dem fertigen Build und werden bei jeder
                  Änderung neu gemessen, nicht von Hand gepflegt. Prüfen Sie
                  sie gerne selbst nach, zum Beispiel mit unserem{" "}
                  <Link
                    href="/#schnellcheck"
                    className="text-muted-strong underline transition-colors hover:text-accent-text"
                  >
                    Schnellcheck
                  </Link>{" "}
                  auf {site.url.replace("https://", "")}.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
