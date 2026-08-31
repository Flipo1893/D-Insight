import type { Metadata } from "next";
import StatTiles from "../../components/StatTiles";
import TrafficChart from "../../components/TrafficChart";
import TopPagesList from "../../components/TopPagesList";
import { getTrafficSummary } from "@/lib/analytics/mock";

export const metadata: Metadata = {
  title: "Traffic",
  robots: { index: false, follow: false },
};

export default async function Traffic() {
  const summary = await getTrafficSummary();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Traffic</h2>
        <p className="mt-2 max-w-xl text-muted">
          Noch Beispieldaten — sobald feststeht, über welchen Anbieter Ihre
          Website deployt wird (z. B. Vercel Analytics, Plausible oder GA4),
          docken wir die echten Zahlen hier an.
        </p>
      </div>

      <StatTiles summary={summary} />
      <TrafficChart daily={summary.daily} />
      <TopPagesList pages={summary.topPages} />
    </div>
  );
}
