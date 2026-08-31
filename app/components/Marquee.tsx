import { symptoms } from "../lib/content";

/**
 * The one marquee on the page. Carries real content, the symptoms clients
 * describe when they come to us, so it earns the motion rather than being a
 * decorative word strip. Pauses on hover; static under reduced motion.
 */
export default function Marquee() {
  const items = [...symptoms, ...symptoms];

  return (
    <section
      aria-label="Typische Probleme, die wir hören"
      className="marquee relative overflow-hidden border-t border-border bg-surface/40 py-5"
    >
      {/* Fades the ends so items enter and leave instead of being cut off. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />

      <div className="marquee-track">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= symptoms.length}
            className="flex shrink-0 items-center gap-8 whitespace-nowrap px-8 font-mono text-xs uppercase tracking-wider text-muted"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </section>
  );
}
