"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger position among siblings. Drives --reveal-index in globals.css. */
  index?: number;
  /**
   * Millisecond delay, kept for components written against the older API
   * (ExploreLinks passes it). Converted to a stagger position so both spell
   * the same thing in the stylesheet instead of two competing timings.
   */
  delay?: number;
  style?: CSSProperties;
};

/**
 * Fades and lifts content into view the first time it crosses the viewport.
 * Pairs with the [data-reveal] rules in globals.css, which also carry the
 * reduced-motion fallback. Uses IntersectionObserver rather than a scroll
 * listener so nothing runs per frame.
 *
 * Der Anfangszustand ist unsichtbar, also ist jeder Weg, auf dem die
 * Einblendung ausbleibt, ein verschwundener Seitenabschnitt. Deshalb loest
 * sie aus, sobald die Oberkante ins Bild kommt, und wird sofort gesetzt,
 * wenn es keinen IntersectionObserver gibt.
 */
export default function Reveal({
  children,
  className = "",
  index = 0,
  delay,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => node.classList.add("is-visible");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(node);
        }
      },
      // threshold 0 statt 0.12: ein Abschnitt, der hoeher ist als das
      // Fenster, erreicht 12 Prozent seiner eigenen Hoehe erst weit nachdem
      // er sichtbar wurde — er blendete sich dann mitten im Lesen ein.
      // Der negative untere Rand haelt trotzdem den Moment zurueck, bis das
      // Element wirklich im Bild ist.
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      style={{
        ["--reveal-index" as string]:
          delay !== undefined ? Math.round(delay / 90) : index,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
