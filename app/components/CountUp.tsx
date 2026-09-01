"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
};

/**
 * Counts up to `value` after mount.
 *
 * State starts at the final number, so the server-rendered markup and the
 * first client render agree and the number is correct even if JS never runs.
 * Under reduced motion the effect returns immediately and that final value
 * simply stays. Otherwise the first animation frame writes progress 0, which
 * is where the count begins; nothing calls setState straight from the effect
 * body, which would cause a cascading render.
 */
export default function CountUp({ value, duration = 900 }: CountUpProps) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      start ??= timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display.toLocaleString("de-CH")}</>;
}
