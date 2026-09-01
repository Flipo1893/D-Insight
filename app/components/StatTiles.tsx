import type { TrafficSummary } from "@/lib/analytics/types";
import CountUp from "./CountUp";

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")} Min.`;
}

export default function StatTiles({ summary }: { summary: TrafficSummary }) {
  const tiles = [
    {
      label: "Besucher, 30 Tage",
      value: <CountUp value={summary.visitors30d} />,
    },
    {
      label: "Seitenaufrufe, 30 Tage",
      value: <CountUp value={summary.pageviews30d} />,
    },
    {
      label: "Durchschnittliche Sitzungsdauer",
      value: formatSeconds(summary.avgSessionSeconds),
    },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6 transition-colors duration-300 hover:border-border-strong"
        >
          <dt className="text-sm text-muted">{tile.label}</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {tile.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
