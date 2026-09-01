"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reports one page view per navigation.
 *
 * Deliberately thin: no cookie, no identifier kept in the browser, no third
 * party script. The server turns the request into a daily pseudonym and
 * forgets the rest. Failures are swallowed, because a visitor should never
 * see a console error over a counter.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Nothing to learn from our own dashboards, and recording them would
    // pollute the numbers we look at there.
    if (pathname.startsWith("/dashboard")) return;

    const controller = new AbortController();

    // keepalive so the report survives someone clicking straight through.
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {});

    return () => controller.abort();
  }, [pathname]);

  return null;
}
