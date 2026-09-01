"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Damped scrolling.
 *
 * Wheel speed is set by the OS, so the only way to give scrolling weight is
 * to take it over and ease it. That is a real trade-off, so it is applied
 * narrowly:
 *
 * - Off under prefers-reduced-motion. Damped scrolling is exactly the kind
 *   of motion people turn that setting on to avoid.
 * - Off on touch devices. Native momentum on a phone is better than anything
 *   we would put in front of it, and overriding it feels broken.
 * - CSS scroll-behavior is disabled while it runs, otherwise the browser's
 *   own smooth scroll and Lenis fight over anchor jumps.
 *
 * Feel is set by `lerp`: lower is heavier. 0.085 is noticeably weighted
 * without the laggy, disconnected feel that comes below about 0.05.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      // Anything inside a scrollable box of its own keeps native scrolling.
      prevent: (node: HTMLElement) =>
        node.closest("[data-lenis-prevent]") !== null,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page links have to go through Lenis, otherwise the jump happens
    // instantly while Lenis is still holding the old position.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      // Nav links are written as /#abschnitt so they also work from /wissen
      // and the legal pages. Only handle them when we are already on the page
      // they point at; otherwise let Next route there normally.
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname !== location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const target = document.querySelector(url.hash);
      if (!target) return;
      const id = url.hash;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      // Keep the address bar in step so the anchor can still be shared.
      history.pushState(null, "", id);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
