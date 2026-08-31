"use client";

import { useId, useState, type ReactNode } from "react";

type CompareSliderProps = {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
};

/**
 * Drag-to-compare slider.
 *
 * The visible handle is decorative; the actual control is a full-bleed
 * range input at opacity 0. That gives pointer drag, touch drag, keyboard
 * arrows and screen-reader semantics from the platform instead of a
 * hand-rolled pointermove implementation.
 */
export default function CompareSlider({
  before,
  after,
  beforeLabel = "Vorher",
  afterLabel = "Nachher",
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <div className="group relative aspect-[2/1] max-h-[420px] w-full select-none overflow-hidden rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2">
      {/* After state sits underneath and is revealed as the handle moves left. */}
      <div className="absolute inset-0">{after}</div>

      {/* Before state is clipped to the handle position. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {before}
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 rounded-brand bg-background/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-strong backdrop-blur-sm"
      >
        {beforeLabel}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 rounded-brand bg-background/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-strong backdrop-blur-sm"
      >
        {afterLabel}
      </span>

      {/* Divider and grab handle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-accent"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-background text-accent-text shadow-lg transition-transform duration-200 group-hover:scale-110">
          <span className="font-mono text-xs tracking-tighter">&#8596;</span>
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Vergleich zwischen {beforeLabel} und {afterLabel}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${position} Prozent ${beforeLabel}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
