import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import About from "../components/About";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { principles } from "../lib/content";

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

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
