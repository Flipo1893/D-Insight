"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { DailyVisitors } from "@/lib/analytics/types";

const WIDTH = 720;
const HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 28, left: 8 };

/**
 * Visitors over time.
 *
 * Reading a value uses pointer events rather than mouse events, so touch and
 * pen work the same as a mouse, and the plot is focusable with arrow-key
 * stepping. A mouse-only chart leaves phone and keyboard users with a
 * picture they cannot read a single number out of.
 */
export default function TrafficChart({ daily }: { daily: DailyVisitors[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const plotRef = useRef<SVGRectElement>(null);

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const maxVisitors = Math.max(...daily.map((d) => d.visitors));
  const xStep = innerWidth / (daily.length - 1);
  const yFor = (v: number) => innerHeight - (v / maxVisitors) * innerHeight;

  const points = daily.map((d, i) => ({
    x: PADDING.left + i * xStep,
    y: PADDING.top + yFor(d.visitors),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    PADDING.top + innerHeight
  } L ${points[0].x} ${PADDING.top + innerHeight} Z`;

  const clamp = (value: number) =>
    Math.min(Math.max(value, 0), daily.length - 1);

  function handlePointer(event: PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    setIndex(clamp(Math.round(ratio * (daily.length - 1))));
  }

  function handleKey(event: KeyboardEvent<SVGRectElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      setIndex((current) => clamp((current ?? 0) + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setIndex(daily.length - 1);
    } else if (event.key === "Escape") {
      setIndex(null);
    }
  }

  const active = index !== null ? daily[index] : null;

  return (
    <div className="rounded-brand border border-border bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-muted">
          Besucher, letzte 30 Tage
        </h3>
        {/* Reading out the hovered value here, rather than in a floating
            tooltip, keeps it available to screen readers too. */}
        <p aria-live="polite" className="text-sm">
          {active ? (
            <>
              <span className="font-semibold tabular-nums">
                {active.visitors}
              </span>{" "}
              <span className="text-muted">am {active.date}</span>
            </>
          ) : (
            <span className="text-muted">
              Verlauf im Zeitraum, Pfeiltasten für Details
            </span>
          )}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-4 w-full touch-none"
        role="img"
        aria-label={`Besucherverlauf der letzten 30 Tage, zuletzt ${
          daily[daily.length - 1].visitors
        } Besucher pro Tag`}
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
          className="chart-area"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="chart-line"
        />

        {index !== null && (
          <>
            <line
              x1={points[index].x}
              x2={points[index].x}
              y1={PADDING.top}
              y2={PADDING.top + innerHeight}
              stroke="var(--muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={points[index].x}
              cy={points[index].y}
              r={5}
              fill="var(--accent)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
          </>
        )}

        <rect
          ref={plotRef}
          x={PADDING.left}
          y={PADDING.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          tabIndex={0}
          role="slider"
          aria-label="Tag im Verlauf wählen"
          aria-valuemin={0}
          aria-valuemax={daily.length - 1}
          aria-valuenow={index ?? 0}
          aria-valuetext={
            active
              ? `${active.date}, ${active.visitors} Besucher`
              : "kein Tag gewählt"
          }
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerLeave={() => setIndex(null)}
          onKeyDown={handleKey}
          onBlur={() => setIndex(null)}
        />
      </svg>

      <div className="flex justify-between text-xs text-muted">
        <span>{daily[0].date}</span>
        <span>{daily[daily.length - 1].date}</span>
      </div>
    </div>
  );
}
