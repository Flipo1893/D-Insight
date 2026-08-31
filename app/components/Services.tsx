import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { services } from "../lib/content";

/**
 * Layout family: sticky headline column on the left, scrolling detail rows on
 * the right. Used once on the page, per the section-layout-repetition rule.
 */
export default function Services() {
  return (
    <section id="leistungen" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionHeading>
                Drei Hebel,
                <br />
                ein Ergebnis.
              </SectionHeading>
              <p className="mt-5 max-w-sm text-muted">
                Meistens greifen alle drei ineinander. Was Ihre Seite braucht,
                klärt die Analyse.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {services.map((service, index) => (
              <Reveal
                key={service.id}
                index={index}
                className="group border-t border-border py-8 first:border-t-0 first:pt-0 md:py-10"
              >
                <div className="flex flex-col gap-5 md:flex-row md:gap-10">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-muted-strong">{service.summary}</p>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-muted leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="rounded-brand border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-200 group-hover:border-border-strong group-hover:text-muted-strong"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
