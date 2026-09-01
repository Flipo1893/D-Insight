"use client";

/**
 * Catches anything thrown while rendering a dashboard page — in practice
 * almost always MongoDB being unreachable (wrong IP allowlist, network
 * blocking port 27017, Atlas down). Without this the customer gets a raw
 * runtime error page.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const looksLikeDatabase = /mongo|ETIMEDOUT|ECONNREFUSED|querySrv/i.test(
    error.message,
  );

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold tracking-tight">
        Da ist gerade etwas schiefgelaufen
      </h2>
      <p className="mt-4 text-muted">
        {looksLikeDatabase
          ? "Die Datenbank ist im Moment nicht erreichbar. Ihre Daten sind nicht verloren — bitte versuchen Sie es in einem Moment erneut."
          : "Diese Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut."}
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Erneut versuchen
      </button>

      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-surface p-4 text-xs text-muted">
          {error.message}
        </pre>
      )}
    </div>
  );
}
