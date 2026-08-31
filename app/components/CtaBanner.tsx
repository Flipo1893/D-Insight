import Reveal from "./Reveal";
import { primaryCta } from "../lib/content";

/** Layout family: full-width accent block. The one saturated moment. */
export default function CtaBanner() {
  return (
    <section className="bg-accent">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Bereit für eine neue Website?
          </h2>
          <a
            href="#kontakt"
            className="inline-block shrink-0 rounded-brand bg-white px-6 py-3 text-sm font-semibold whitespace-nowrap text-accent-strong transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {primaryCta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
