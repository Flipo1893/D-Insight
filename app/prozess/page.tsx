import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Process from "../components/Process";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { stepDetails } from "../lib/content";

export const metadata: Metadata = {
  title: "Prozess",
  description:
    "Von der Analyse bis zum Launch: was in jedem Schritt passiert, was wir dafür von Ihnen brauchen und woran ein Relaunch sonst scheitert.",
  alternates: { canonical: "/prozess" },
};

export default function Prozess() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="Prozess"
          title="Von der Analyse bis zum Launch"
          description="Vier Schritte, keine Überraschungen. Sie wissen jederzeit, woran wir arbeiten und was als Nächstes von Ihnen kommt."
        />

        <Process />

        <section className="border-t border-border bg-surface/30">
          <div className="mx-auto max-w-6xl px-6 py-24 xl:max-w-7xl 2xl:max-w-[1440px]">
            <Reveal>
              <SectionHeading className="max-w-2xl">
                Was in jedem Schritt passiert.
              </SectionHeading>
              <p className="mt-5 max-w-xl text-muted">
                Ein Relaunch scheitert selten an der Technik. Er scheitert
                daran, dass unklar ist, wer wann was liefert. Deshalb steht
                hier beides.
              </p>
            </Reveal>

            <ol className="mt-12 border-t border-border">
              {stepDetails.map((step, index) => (
                <Reveal key={step.title} index={index}>
                  <li className="grid gap-4 border-b border-border py-8 md:grid-cols-[auto_1fr_1fr] md:gap-10">
                    <span
                      aria-hidden
                      className="font-mono text-sm text-muted md:w-8"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {step.weDo}
                      </p>
                    </div>

                    <div className="rounded-brand border border-border bg-background/40 p-5">
                      <p className="font-mono text-xs uppercase tracking-wide text-muted">
                        Was wir von Ihnen brauchen
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                        {step.weNeed}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal index={4}>
              <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
                Die Seite bleibt während der gesamten Arbeit online. Umgestellt
                wird erst, wenn alles geprüft ist, und die alten Adressen
                werden weitergeleitet, damit die Sichtbarkeit den Umzug
                übersteht.
              </p>
            </Reveal>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
