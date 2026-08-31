"use client";

import { useState, type MouseEvent } from "react";
import type { DailyVisitors } from "@/lib/analytics/types";

const WIDTH = 720;
const HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 28, left: 8 };

export default function TrafficChart({ daily }: { daily: DailyVisitors[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const maxVisitors = Math.max(...daily.map((d) => d.visitors));
  const xStep = innerWidth / (daily.length - 1);
  const yFor = (v: number) => innerHeight - (v / maxVisitors) * innerHeight;

  const linePoints = daily.map((d, i) => ({
    x: PADDING.left + i * xStep,
    y: PADDING.top + yFor(d.visitors),
  }));

  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${linePoints[linePoints.length - 1].x} ${
    PADDING.top + innerHeight
  } L ${linePoints[0].x} ${PADDING.top + innerHeight} Z`;

  function handleMove(event: MouseEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (daily.length - 1));
    setHoverIndex(Math.min(Math.max(index, 0), daily.length - 1));
  }

  const hovered = hoverIndex !== null ? daily[hoverIndex] : null;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-muted">
          Besucher — letzte 30 Tage
        </h3>
        <p className="text-sm">
          {hovered ? (
            <>
              <span className="font-semibold">{hovered.visitors}</span>{" "}
              <span className="text-muted">am {hovered.date}</span>
            </>
          ) : (
            <span className="text-muted">Verlauf im Zeitraum</span>
          )}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Besucherverlauf der letzten 30 Tage, aktuell ${daily[daily.length - 1].visitors} Besucher pro Tag`}
      >
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + innerHeight * t}
            y2={PADDING.top + innerHeight * t}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}

        <path
          d={areaPath}
          fill="var(--accent)"
          fillOpacity={0.12}
          stroke="none"
          className="animate-fade-in-delayed"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="animate-draw-line"
        />

        {hoverIndex !== null && (
          <>
            <line
              x1={linePoints[hoverIndex].x}
              x2={linePoints[hoverIndex].x}
              y1={PADDING.top}
              y2={PADDING.top + innerHeight}
              stroke="var(--muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={linePoints[hoverIndex].x}
              cy={linePoints[hoverIndex].y}
              r={5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </>
        )}

        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </svg>

      <div className="flex justify-between text-xs text-muted">
        <span>{daily[0].date}</span>
        <span>{daily[daily.length - 1].date}</span>
      </div>
    </div>
  );
}
