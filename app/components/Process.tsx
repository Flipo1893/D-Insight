import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { steps } from "../lib/content";

/**
 * Layout family: horizontal rail with markers, collapsing to a vertical
 * timeline below 768px. Step labels are the step names themselves, not
 * "Phase 01" style enumeration.
 */
export default function Process() {
  return (
    <section id="prozess" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-xl">
            Von der Analyse bis zum Launch.
          </SectionHeading>
        </Reveal>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* The rail: horizontal on desktop, vertical on mobile. */}
          <span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[5px] md:bottom-auto md:h-px md:w-full"
          />
          {steps.map((step, index) => (
            <Reveal key={step.title} index={index} className="relative">
              <li className="relative pl-8 md:pl-0 md:pt-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 block h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background md:top-0"
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
