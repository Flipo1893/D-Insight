"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
};

export default function CountUp({ value, duration = 900 }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame: number;
    let start: number | null = null;

    frame = requestAnimationFrame(function tick(timestamp) {
      if (reduceMotion) {
        setDisplay(value);
        return;
      }
      if (start === null) {
        start = timestamp;
      }
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display.toLocaleString("de-DE")}</>;
}
