import Reveal from "./Reveal";
import { primaryCta } from "../lib/content";

/** Layout family: full-width accent band. The one saturated moment. */
export default function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#c8250e] via-accent to-[#ee4a2a]">
      {/* Soft light source in the top-left, keeps the band from reading flat. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Bereit für eine neue Website?
          </h2>
          <a
            href="#kontakt"
            className="group inline-flex w-fit shrink-0 self-start items-center gap-2 rounded-brand bg-white px-6 py-3 text-sm font-semibold whitespace-nowrap text-accent-strong shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {primaryCta}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
