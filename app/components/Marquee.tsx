import { symptoms } from "../lib/content";

/**
 * The one marquee on the page. Carries real content, the symptoms clients
 * describe when they come to us, so it earns the motion rather than being a
 * decorative word strip. Pauses on hover; static under reduced motion.
 *
 * The edge masks are wide and match the page ground exactly, so items fade
 * out instead of being sliced mid-word at the viewport edge.
 */
export default function Marquee() {
  const items = [...symptoms, ...symptoms];

  return (
    <section
      aria-label="Typische Probleme, die wir hören"
      className="marquee relative overflow-hidden border-y border-border py-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background via-background/85 to-transparent sm:w-56"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background via-background/85 to-transparent sm:w-56"
      />

      <div className="marquee-track items-center">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= symptoms.length}
            className="flex shrink-0 items-center whitespace-nowrap text-sm text-muted"
          >
            <span className="px-6">{item}</span>
            <span
              aria-hidden
              className="h-3 w-px shrink-0 bg-border-strong"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
