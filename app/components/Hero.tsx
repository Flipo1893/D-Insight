import { primaryCta } from "../lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-center px-6 pb-20 pt-16 md:pb-28 md:pt-24"
    >
      <div className="grid grid-cols-12">
        <h1
          className="animate-rise col-span-12 text-[clamp(2.75rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter lg:col-span-11"
          style={{ ["--rise-index" as string]: 0 }}
        >
          Ihre Website.
          <br />
          <span className="text-muted">Neu gedacht.</span>
        </h1>

        {/* Offsetting the body copy into the inner columns keeps the block
            asymmetric without resorting to a centered hero. */}
        <div
          className="animate-rise col-span-12 mt-10 md:col-start-2 md:col-span-8 lg:col-start-3 lg:col-span-6"
          style={{ ["--rise-index" as string]: 1 }}
        >
          <span className="mb-6 block h-px w-16 bg-accent animate-rule" />
          <p className="text-lg leading-relaxed text-muted-strong md:text-xl">
            Wir verwandeln veraltete Websites in schnelle, moderne Auftritte.
            Redesign, sauberer Code und Sichtbarkeit in der KI-Suche.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#kontakt"
              className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
            >
              {primaryCta}
            </a>
            <a
              href="#beispiele"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text-text"
            >
              Beispiele ansehen
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
