import Image from "next/image";
import CompareSlider from "./CompareSlider";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Layout family: full-width interactive comparison.
 *
 * The two screenshots show the same fictional company, "Holzbau Muster",
 * before and after.
 *
 * The caption that said so was removed on request. Nothing on the page now
 * marks these as invented, so a visitor may read them as a client project.
 * Replacing them with real screenshots of a delivered site is the fix;
 * prebuilt.ch is live and would do. Until then this is worth knowing.
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
      </div>
    </section>
  );
}
