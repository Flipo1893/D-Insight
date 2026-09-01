import type { MonitorRun } from "@/lib/monitor/store";

/**
 * Score over time as a sparkline.
 *
 * Deliberately not the big TrafficChart: this sits inside a card next to
 * other numbers, and a full chart with axes would claim more attention than
 * a trend line deserves. The readable version of the data is the text
 * beside it, so the drawing is aria-hidden rather than pretending to be an
 * image someone can interpret.
 */
export default function ScoreTrend({ history }: { history: MonitorRun[] }) {
  const points = history.filter((run) => run.reachable);
  if (points.length < 2) return null;

  const width = 240;
  const height = 48;
  const values = points.map((run) => run.score);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const span = max - min || 1;
  const step = width / (points.length - 1);

  const path = points
    .map((run, index) => {
      const x = index * step;
      const y = height - ((run.score - min) / span) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const last = points[points.length - 1];
  const lastX = width;
  const lastY = height - ((last.score - min) / span) * height;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className="mt-4 h-12 w-full"
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={3} fill="var(--accent)" />
    </svg>
  );
}
