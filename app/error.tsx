"use client";

import { useEffect } from "react";
import { site } from "./lib/content";

/**
 * Error boundary for the whole app. Without this Next shows an unstyled
 * white page in production, which on a dark site looks like a crash even
 * when the problem is small.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Kept so the failure is visible in the browser console and in server
    // logs during development. Swap for a reporting call once one exists.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-1 items-center px-6 py-24">
      <div className="mx-auto w-full max-w-xl">
        <p className="font-mono text-sm uppercase tracking-wider text-accent-text">
          Fehler
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Da ist etwas schiefgelaufen.
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Bitte versuchen Sie es noch einmal. Wenn es weiterhin nicht klappt,
          schreiben Sie uns kurz, dann schauen wir uns das an.
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted">
            Referenz: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={reset}
            className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
          >
            Nochmal versuchen
          </button>
          <a
            href={`mailto:${site.email}`}
            className="text-sm font-semibold text-foreground transition-colors hover:text-accent-text"
          >
            {site.email}
          </a>
        </div>
      </div>
    </main>
  );
}
