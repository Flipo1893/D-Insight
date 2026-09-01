import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { services } from "../lib/content";

/**
 * Layout family: sticky headline column on the left, detail rows on the
 * right. Each row carries a brand-tinted gradient and a hover sheen so the
 * grid is not three flat text blocks.
 */
export default function Services() {
  return (
    <section id="leistungen" className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
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

          <div className="flex flex-col gap-5">
            {services.map((service, index) => (
              <Reveal key={service.id} index={index} className="scroll-lift">
                <article className="sheen group relative overflow-hidden rounded-brand border border-border bg-gradient-to-br from-surface via-surface to-[var(--accent-soft)] p-6 transition-all duration-300 hover:border-border-strong md:p-8">
                  {/* Accent edge that grows in on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-500 group-hover:scale-y-100"
                  />
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
                    <div className="md:w-2/5">
                      <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-strong">
                        {service.summary}
                      </p>
                    </div>
                    <div className="md:w-3/5">
                      <p className="text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                      {/* Spelling out what is included and how long it takes
                          answers the two questions every first reply asks,
                          and gives search and AI systems something to cite. */}
                      <ul className="mt-5 flex flex-col gap-2">
                        {service.included.map((item) => (
                          <li key={item} className="flex gap-3 text-sm">
                            <span
                              aria-hidden
                              className="mt-2 h-px w-3 shrink-0 bg-accent"
                            />
                            <span className="text-muted">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 border-t border-border pt-4 font-mono text-xs uppercase tracking-wide text-muted">
                        Dauer: {service.duration}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2">
                        {service.deliverables.map((item) => (
                          <li
                            key={item}
                            className="rounded-brand border border-border bg-background/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors duration-300 group-hover:border-border-strong group-hover:text-muted-strong"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
