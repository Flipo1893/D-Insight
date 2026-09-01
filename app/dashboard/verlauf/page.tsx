import type { Metadata } from "next";
import ScoreTrend from "../../components/ScoreTrend";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getSite } from "@/lib/mongodb/sites";
import { describeChange, getTrend } from "@/lib/monitor/store";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Verlauf",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const toneClass = {
  ok: "text-muted-strong",
  warn: "text-accent-text",
  down: "text-accent-text",
} as const;

const formatDate = (value: Date) =>
  new Date(value).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default async function Verlauf() {
  const user = await getCurrentUser();

  if (!isMongoConfigured || !user) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight">Verlauf</h2>
        <p className="mt-4 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Sobald die Datenbank eingerichtet ist, wird Ihre Website regelmässig
          geprüft und die Entwicklung erscheint hier.
        </p>
      </div>
    );
  }

  const site = await getSite(user.id);
  const trend = await getTrend(site);
  const change = describeChange(trend.latest, trend.previous);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Verlauf</h2>
        <p className="mt-2 text-muted">
          Wir prüfen Ihre Website regelmässig auf Erreichbarkeit, Ladezeit,
          Sichtbarkeit und Barrierefreiheit. Hier sehen Sie, wie sich das
          entwickelt.
        </p>
      </div>

      {!trend.latest ? (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Noch keine Messung vorhanden. Die erste erfolgt beim nächsten
          geplanten Lauf.
        </p>
      ) : (
        <>
          <div className="rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{trend.siteUrl}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums">
                  {trend.latest.reachable ? trend.latest.score : "–"}
                  <span className="text-xl text-muted"> / 100</span>
                </p>
              </div>
              <p className="font-mono text-xs text-muted">
                zuletzt {formatDate(trend.latest.at)}
              </p>
            </div>

            {change && (
              <p className={`mt-3 text-sm ${toneClass[change.level]}`}>
                {change.message}
              </p>
            )}

            <ScoreTrend history={trend.history} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Sichtbarkeit", `${trend.latest.score} / 100`],
              ["Barrierefreiheit", `${trend.latest.a11yScore} / 100`],
              [
                "Antwortzeit",
                trend.latest.reachable ? `${trend.latest.loadMs} ms` : "–",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-brand border border-border bg-surface p-5"
              >
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted">
            {trend.history.length}{" "}
            {trend.history.length === 1 ? "Messung" : "Messungen"} gespeichert.
            Ältere als zwei Jahre werden automatisch gelöscht.
          </p>
        </>
      )}
    </div>
  );
}
