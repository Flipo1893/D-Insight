import Image from "next/image";
import CompareSlider from "./CompareSlider";
import EraDemo from "./EraDemo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Layout family: full-width interactive comparison.
 *
 * The two screenshots show the same fictional company, "Holzbau Muster",
 * before and after. They are a demonstration, not a client project, and the
 * caption says so: passing off an invented case study as real work is the
 * one thing that would cost us a prospect who checks.
 *
 * When the first real project ships, replace the two files in
 * public/beispiel and rewrite the caption. Nothing else here changes.
 */
export default function BeforeAfter() {
  return (
    <section id="beispiele" className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Gleiches Unternehmen, neues Fundament.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Ziehen Sie den Regler, um den Unterschied zu sehen. Inhalte und
            Marke bleiben, Technik und Gestaltung werden ersetzt.
          </p>
        </Reveal>

        <Reveal index={1} className="mt-12">
          <CompareSlider
            before={
              <Image
                src="/beispiel/vorher.jpg"
                alt="Beispielhafte Unternehmensseite im Stand von 2011: blauer Verlaufsbalken, langer Fliesstext, Hinweis auf Internet Explorer"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover object-left-top"
              />
            }
            after={
              <Image
                src="/beispiel/nachher.jpg"
                alt="Dieselbe Seite neu aufgebaut: klare Typografie, deutlicher Handlungsaufruf, ruhige Bildflächen"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover object-left-top"
              />
            }
          />
        </Reveal>

        <Reveal index={2}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Beispieldarstellung an einem erfundenen Betrieb, kein Kundenprojekt.
            Sobald die ersten Seiten live sind, stehen hier echte Screenshots
            mit gemessenen Werten.
          </p>
        </Reveal>

        <Reveal index={3} className="mt-24">
          <SectionHeading className="max-w-2xl">
            Oder legen Sie den Schalter selbst um.
          </SectionHeading>
        </Reveal>

        <Reveal index={4} className="mt-8">
          <EraDemo />
        </Reveal>
      </div>
    </section>
  );
}
