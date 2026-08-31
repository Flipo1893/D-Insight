import type { TrafficSummary } from "@/lib/analytics/types";
import CountUp from "./CountUp";

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")} Min.`;
}

export default function StatTiles({ summary }: { summary: TrafficSummary }) {
  const tiles = [
    { label: "Besucher (30 Tage)", value: <CountUp value={summary.visitors30d} /> },
    { label: "Seitenaufrufe (30 Tage)", value: <CountUp value={summary.pageviews30d} /> },
    { label: "Ø Sitzungsdauer", value: formatSeconds(summary.avgSessionSeconds) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/40"
        >
          <p className="text-sm text-muted">{tile.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}
