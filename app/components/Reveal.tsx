"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger position among siblings. Drives --reveal-index in globals.css. */
  index?: number;
  style?: CSSProperties;
};

/**
 * Fades and lifts content into view the first time it crosses the viewport.
 * Pairs with the [data-reveal] rules in globals.css, which also carry the
 * reduced-motion fallback. Uses IntersectionObserver rather than a scroll
 * listener so nothing runs per frame.
 */
export default function Reveal({
  children,
  className = "",
  index = 0,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      style={{ ["--reveal-index" as string]: index, ...style }}
      className={className}
    >
      {children}
    </div>
  );
}
