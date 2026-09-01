import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Services from "../components/Services";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { boundaries, services, site, situations } from "../lib/content";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Visuelles Redesign, technisches Refactoring und KI-SEO: die drei Bausteine, mit denen wir bestehende Websites neu aufstellen, und wofür sie jeweils gedacht sind.",
  alternates: { canonical: "/leistungen" },
};

/**
 * One Service entry per offering, so an assistant asked "who does website
 * refactoring in Switzerland" has something structured to work from. Built
 * from the same array the page renders.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": services.map((service) => ({
    "@type": "Service",
    name: service.title,
    description: service.description,
    areaServed: "CH",
    provider: { "@type": "Organization", name: site.name, url: site.url },
  })),
};

export default function Leistungen() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Leistungen"
          title="Drei Bausteine für eine Website, die wieder trägt"
          description="Redesign, Refactoring und KI-SEO greifen ineinander. Je nach Ausgangslage setzen wir bei einem oder allen drei Bausteinen an."
        />

        <Services />

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 xl:max-w-7xl 2xl:max-w-[1440px]">
            <Reveal>
              <SectionHeading className="max-w-2xl">
                Wofür das gedacht ist.
              </SectionHeading>
              <p className="mt-5 max-w-xl text-muted">
                Drei Ausgangslagen, mit denen Firmen zu uns kommen. Meistens
                erkennt man sich in einer davon wieder.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {situations.map((situation, index) => (
                <Reveal key={situation.title} index={index} className="h-full">
                  <article className="flex h-full flex-col rounded-brand border border-border bg-surface p-6">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {situation.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {situation.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface/30">
          <div className="mx-auto max-w-6xl px-6 py-24 xl:max-w-7xl 2xl:max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <Reveal>
                <SectionHeading>Was wir nicht machen.</SectionHeading>
                <p className="mt-5 max-w-sm text-muted">
                  Kürzer als die Liste dessen, was wir können, und ehrlicher.
                  Wer alles anbietet, kann selten etwas davon richtig.
                </p>
              </Reveal>

              <Reveal index={1}>
                <ul className="border-t border-border">
                  {boundaries.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 border-b border-border py-5"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-px w-4 shrink-0 bg-border-strong"
                      />
                      <span className="leading-relaxed text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
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
