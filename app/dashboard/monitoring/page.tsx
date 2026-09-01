import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScoreTrend from "../../components/ScoreTrend";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { listSites } from "@/lib/mongodb/sites";
import { describeChange, getTrend } from "@/lib/monitor/store";
import { monitorSecret } from "@/lib/monitor/config";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Monitoring",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const toneClass = {
  ok: "text-muted",
  warn: "text-accent-text",
  down: "text-accent-text",
} as const;

export default async function Monitoring() {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) notFound();

  if (!isMongoConfigured) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight">Monitoring</h2>
        <p className="mt-4 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Ohne <code className="text-muted-strong">MONGODB_URI</code> gibt es
          keine Kundenseiten und nichts zu prüfen.
        </p>
      </div>
    );
  }

  const sites = await listSites();
  const trends = await Promise.all(sites.map((site) => getTrend(site)));

  // Anything that needs attention first, then the rest.
  const ranked = trends
    .map((trend) => ({ trend, change: describeChange(trend.latest, trend.previous) }))
    .sort((a, b) => {
      const weight = (level?: string) =>
        level === "down" ? 0 : level === "warn" ? 1 : 2;
      return weight(a.change?.level) - weight(b.change?.level);
    });

  const needsAttention = ranked.filter(
    (entry) => entry.change?.level === "down" || entry.change?.level === "warn",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Monitoring</h2>
        <p className="mt-2 max-w-xl text-muted">
          Alle Kundenseiten im Überblick. Der geplante Lauf prüft sie
          wöchentlich und schreibt das Ergebnis in den Verlauf.
        </p>
      </div>

      {!monitorSecret && (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          <code className="text-muted-strong">MONITOR_SECRET</code> ist nicht
          gesetzt. Der Endpunkt antwortet deshalb allen mit 404, auch dem
          Zeitplan, und es werden keine Messungen erfasst.
        </p>
      )}

      {sites.length === 0 ? (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Noch keine Kundenseiten angelegt. Sobald unter Kunden eine Adresse
          hinterlegt ist, wird sie mitgeprüft.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted">
            {sites.length} {sites.length === 1 ? "Seite" : "Seiten"},{" "}
            {needsAttention === 0
              ? "nichts Auffälliges."
              : `${needsAttention} mit Handlungsbedarf.`}
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {ranked.map(({ trend, change }) => (
              <Link
                key={trend.userId}
                href={`/dashboard/kunden/${trend.userId}`}
                className="rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-semibold tracking-tight">
                    {trend.siteName || "Ohne Namen"}
                  </p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {trend.latest?.reachable ? trend.latest.score : "–"}
                  </p>
                </div>

                <p className="mt-1 truncate font-mono text-xs text-muted">
                  {trend.siteUrl || "keine Adresse hinterlegt"}
                </p>

                {change && (
                  <p className={`mt-3 text-sm ${toneClass[change.level]}`}>
                    {change.message}
                  </p>
                )}

                <ScoreTrend history={trend.history} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
