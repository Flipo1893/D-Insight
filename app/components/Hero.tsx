import { primaryCta } from "../lib/content";

const line1 = ["Ihre", "Website."];
const line2 = ["Neu", "gedacht."];

/** Splits a line into per-word spans so the headline assembles itself. */
function Line({ words, offset }: { words: string[]; offset: number }) {
  return (
    <span className="block">
      {words.map((word, index) => (
        <span
          key={word}
          className="word mr-[0.25em] inline-block last:mr-0"
          style={{ ["--word" as string]: offset + index }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-center px-6 pb-20 pt-16 md:pb-28 md:pt-24"
    >
      <div className="hero-visual" aria-hidden>
        <div className="hero-visual__grid" />
        <div className="hero-visual__orb hero-visual__orb--a" />
        <div className="hero-visual__orb hero-visual__orb--b" />
        <div className="hero-visual__beam" />
      </div>

      <div className="grid grid-cols-12">
        <h1 className="col-span-12 text-[clamp(2.75rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter lg:col-span-11">
          <Line words={line1} offset={0} />
          {/* Solid, not a clipped gradient: the per-word animation creates a
              stacking context on each span, which stops background-clip:text
              from painting through. */}
          <span className="block text-muted">
            <Line words={line2} offset={2} />
          </span>
        </h1>

        {/* Offsetting the body copy into the inner columns keeps the block
            asymmetric without resorting to a centered hero. */}
        <div
          className="animate-rise col-span-12 mt-10 md:col-start-2 md:col-span-8 lg:col-start-3 lg:col-span-6"
          style={{ ["--rise-index" as string]: 4 }}
        >
          <span className="mb-6 block h-px w-16 bg-accent animate-rule" />
          <p className="text-lg leading-relaxed text-muted-strong md:text-xl">
            Wir verwandeln veraltete Websites in schnelle, moderne Auftritte.
            Redesign, sauberer Code und Sichtbarkeit in der KI-Suche.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#kontakt"
              className="group relative overflow-hidden rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_8px_30px_-8px_rgba(236,47,18,0.7)] active:translate-y-px"
            >
              <span className="relative z-10">{primaryCta}</span>
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </a>
            <a
              href="#beispiele"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text"
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
