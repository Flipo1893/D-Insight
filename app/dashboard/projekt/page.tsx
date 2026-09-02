import type { Metadata } from "next";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite } from "@/lib/mongodb/sites";
import { getCurrentUser } from "@/lib/supabase/auth";
import { steps } from "../../lib/content";

export const metadata: Metadata = {
  title: "Projekt",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Where the project stands, for the customer.
 *
 * This exists to replace the recurring "wie weit seid ihr" email, in both
 * directions. The half that actually saves time is the list of things we
 * are waiting for: a project stalls because nobody said out loud whose turn
 * it is, and a customer who can see their own list does not need chasing.
 */
export default async function Projekt() {
  const user = await getCurrentUser();

  if (!isMongoConfigured || !user) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight">Projekt</h2>
        <p className="mt-4 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Sobald die Datenbank eingerichtet ist, sehen Sie hier den Stand Ihres
          Projekts.
        </p>
      </div>
    );
  }

  const site = await getSite(user.id);
  const done = site.phase >= steps.length;
  const started = site.phase >= 0;

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {site.siteName || "Ihr Projekt"}
        </h2>
        <p className="mt-2 text-muted">
          {done
            ? "Ihr Projekt ist abgeschlossen. Melden Sie sich jederzeit, wenn etwas ansteht."
            : started
              ? `Aktueller Schritt: ${steps[site.phase]?.title ?? "läuft"}.`
              : "Ihr Projekt ist angelegt. Wir melden uns, sobald es losgeht."}
        </p>
      </div>

      {site.phaseNote && (
        <p className="rounded-brand border border-accent bg-[var(--accent-soft)] px-5 py-4 leading-relaxed">
          {site.phaseNote}
        </p>
      )}

      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const state =
            done || index < site.phase
              ? "fertig"
              : index === site.phase
                ? "laufend"
                : "offen";

          return (
            <li key={step.title} className="flex gap-5">
              {/* Rail and marker. The line is drawn per item so it stops
                  cleanly after the last step. */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    state === "fertig"
                      ? "border-accent bg-accent"
                      : state === "laufend"
                        ? "border-accent"
                        : "border-border"
                  }`}
                >
                  {state === "fertig" && (
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className={`w-px flex-1 ${
                      state === "fertig" ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <div className="pb-8">
                <p
                  className={`font-semibold tracking-tight ${
                    state === "offen" ? "text-muted" : "text-foreground"
                  }`}
                >
                  {step.title}
                  {state === "laufend" && (
                    <span className="ml-3 font-mono text-xs uppercase tracking-wide text-accent-text">
                      läuft
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
        <h3 className="font-semibold tracking-tight">Von Ihnen offen</h3>
        {site.pending.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nichts. Wir sind am Zug, Sie hören von uns.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Damit es weitergeht, brauchen wir noch:
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {site.pending.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span
                    aria-hidden
                    className="mt-2 h-px w-4 shrink-0 bg-accent"
                  />
                  <span className="text-muted-strong">{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
