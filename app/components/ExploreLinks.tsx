import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { services } from "../lib/content";

/**
 * Signpost to the detail pages.
 *
 * It used to be three cards numbered 01 to 03 saying things like "Redesign,
 * Refactoring und KI-SEO im Detail" — a table of contents on the best space
 * on the page. It now carries the actual service names and what each one is
 * for, pulled from the same data the Leistungen page renders, so the two can
 * never drift apart and a visitor learns something before clicking.
 */
export default function ExploreLinks() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28 xl:max-w-7xl 2xl:max-w-[1440px]">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Drei Hebel, ein Ergebnis.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Meistens greifen alle drei ineinander. Was Ihre Seite braucht,
            klärt die Analyse.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} index={index} className="h-full">
              <Link
                href="/leistungen"
                className="sheen group flex h-full flex-col rounded-brand border border-border bg-gradient-to-br from-surface via-surface to-[var(--accent-soft)] p-6 transition-colors duration-300 hover:border-border-strong"
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-strong">
                  {service.summary}
                </p>

                <ul className="mt-5 flex flex-col gap-2">
                  {service.included.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span
                        aria-hidden
                        className="mt-2 h-px w-3 shrink-0 bg-accent"
                      />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
                  Im Detail
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal index={3}>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link
              href="/prozess"
              className="group inline-flex items-center gap-2 py-2 text-muted transition-colors hover:text-foreground"
            >
              So läuft ein Projekt ab
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <Link
              href="/wissen"
              className="group inline-flex items-center gap-2 py-2 text-muted transition-colors hover:text-foreground"
            >
              Was wir bei Relaunches sehen
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
