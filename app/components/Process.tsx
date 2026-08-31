import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { steps } from "../lib/content";

/**
 * Layout family: horizontal rail with markers, collapsing to a vertical
 * timeline below 768px. The rail draws itself as the section scrolls into
 * view via a scroll-driven animation, so no JS and no scroll listener.
 */
export default function Process() {
  return (
    <section id="prozess" className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-xl">
            Von der Analyse bis zum Launch.
          </SectionHeading>
        </Reveal>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          <span
            aria-hidden
            className="scroll-rail absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-border to-transparent md:left-0 md:right-0 md:top-[5px] md:bottom-auto md:h-px md:w-full md:bg-gradient-to-r"
          />
          {steps.map((step, index) => (
            <Reveal key={step.title} index={index} className="scroll-lift">
              <li className="group relative pl-8 md:pl-0 md:pt-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 block h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background transition-transform duration-300 group-hover:scale-150 md:top-0"
                />
                <h3 className="text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
