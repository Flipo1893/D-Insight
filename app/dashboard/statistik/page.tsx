import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountUp from "../../components/CountUp";
import TrafficChart from "../../components/TrafficChart";
import TopPagesList from "../../components/TopPagesList";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { isAdminEmail } from "@/lib/admin";
import { getSummary } from "@/lib/stats/store";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Statistik",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Statistik() {
  const user = await getCurrentUser();

  /*
   * notFound rather than a "no access" page. Telling a stranger that a
   * console exists here and they are simply not allowed in is an invitation;
   * a 404 says nothing at all. The dashboard layout has already established
   * that the visitor is signed in, so this only separates the two of you
   * from ordinary customers.
   */
  if (!isAdminEmail(user?.email)) {
    notFound();
  }

  const summary = isMongoConfigured ? await getSummary(30) : null;


  if (!summary) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight">Statistik</h2>
        <p className="mt-4 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Die Datenbank ist noch nicht eingerichtet. Sobald{" "}
          <code className="text-muted-strong">MONGODB_URI</code> gesetzt ist,
          werden Seitenaufrufe gezählt und erscheinen hier.
        </p>
      </div>
    );
  }

  const empty = summary.totalViews === 0;

  // The chart component speaks in visitors per day, so the summary is mapped
  // onto that shape rather than giving the chart a second data format.
  const daily = summary.days.map((entry) => ({
    date: new Date(entry.day).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
    }),
    visitors: entry.visitors,
  }));

  // Only figures the data actually supports. Session duration would have to
  // be derived from page views, which is guesswork dressed up as a metric.
  const viewsPerVisitor =
    summary.uniqueVisitors > 0
      ? (summary.totalViews / summary.uniqueVisitors).toFixed(1)
      : "0";

  const tiles = [
    { label: "Besucher, 30 Tage", value: <CountUp value={summary.uniqueVisitors} /> },
    { label: "Seitenaufrufe, 30 Tage", value: <CountUp value={summary.totalViews} /> },
    { label: "Aufrufe pro Besucher", value: viewsPerVisitor },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Statistik</h2>
        <p className="mt-2 max-w-xl text-muted">
          Eigene Zahlen dieser Website, letzte 30 Tage. Ohne Cookies, ohne
          fremde Dienste. Nur für Sie und Dominic sichtbar.
        </p>
      </div>

      {empty ? (
        <p className="rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
          Noch keine Aufrufe erfasst. Sobald die Seite live ist und jemand sie
          besucht, füllt sich diese Ansicht.
        </p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-3">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6"
              >
                <dt className="text-sm text-muted">{tile.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
                  {tile.value}
                </dd>
              </div>
            ))}
          </dl>

          {daily.length > 1 && <TrafficChart daily={daily} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <TopPagesList
              pages={summary.topPaths.map((entry) => ({
                path: entry.path,
                views: entry.views,
              }))}
            />
            <TopPagesList
              title="Woher die Besucher kommen"
              pages={summary.topSources.map((entry) => ({
                path: entry.source,
                views: entry.views,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
