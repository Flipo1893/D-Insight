"use client";

import { useEffect, useState } from "react";

/**
 * How long this page took on the visitor's own device.
 *
 * A number measured in our build says what the page costs in theory. This
 * one is what actually happened on their phone, on their connection, a few
 * seconds ago. For someone deciding whether a supplier can be trusted on
 * speed, their own experience beats any figure we could quote.
 *
 * Largest Contentful Paint rather than load or DOMContentLoaded, because it
 * marks the moment the main content was actually readable, which is the
 * thing the sentence claims.
 *
 * Renders nothing until there is a plausible value. No placeholder, no
 * skeleton: an empty line is better than a wrong number on a page arguing
 * that numbers should be checkable.
 */
export default function LoadTime() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    let value: number | null = null;

    const finish = () => {
      // Under about 50ms means we measured a client-side navigation rather
      // than a real load; over 30s means the tab sat in the background.
      // Neither says anything about the site, so neither is shown.
      if (value === null || value < 50 || value > 30_000) return;
      setSeconds(value / 1000);
    };

    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) value = last.startTime;
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Safari before 16 has no LCP at all; the timeout below picks up the
      // navigation entry instead.
    }

    /** Time to the main content per the navigation entry, when LCP is silent. */
    const fromNavigation = () => {
      const nav = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      return nav?.domContentLoadedEventEnd ?? null;
    };

    // LCP is only final once the visitor stops interacting, so it is read
    // shortly after load rather than waited on indefinitely.
    const timer = setTimeout(() => {
      observer?.disconnect();
      // LCP can stay silent even without throwing: a tab that loads in the
      // background never paints, and some browsers report nothing at all.
      // Falling back only inside the catch missed all of those.
      if (value === null) value = fromNavigation();
      finish();
    }, 2500);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  if (seconds === null) return null;

  return (
    <p className="mt-4 text-sm leading-relaxed text-muted">
      Diese Seite war bei Ihnen nach{" "}
      <span className="font-semibold tabular-nums text-foreground">
        {seconds.toFixed(1).replace(".", ",")} Sekunden
      </span>{" "}
      da, auf Ihrem Gerät gemessen.
    </p>
  );
}
