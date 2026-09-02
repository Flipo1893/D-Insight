"use client";

import { useSyncExternalStore } from "react";

/**
 * Turns the site back into a 2011 business website and back again.
 *
 * The whole thing is one attribute on <html> and a block of token overrides
 * in globals.css. That is the point: a site where nothing hardcodes a colour
 * can be reskinned completely without touching a single component. The visitor
 * gets to see the service rather than read about it.
 *
 * Not persisted. It is a demonstration, and someone returning tomorrow should
 * land on the real site, not on the joke. Kept out of the dashboard for the
 * same reason: a customer's working area is not the place for a gag.
 */

const ERA_EVENT = "d-insight:era";

function subscribe(onChange: () => void) {
  window.addEventListener(ERA_EVENT, onChange);
  return () => window.removeEventListener(ERA_EVENT, onChange);
}

function snapshot(): "2011" | "heute" {
  return document.documentElement.dataset.era === "2011" ? "2011" : "heute";
}

export function setEra(era: "2011" | "heute") {
  const root = document.documentElement;
  if (era === "2011") {
    root.dataset.era = "2011";
  } else {
    delete root.dataset.era;
  }
  window.dispatchEvent(new Event(ERA_EVENT));
}

export default function EraSwitch() {
  const era = useSyncExternalStore(subscribe, snapshot, () => "heute" as const);
  const old = era === "2011";

  return (
    <button
      type="button"
      onClick={() => setEra(old ? "heute" : "2011")}
      aria-pressed={old}
      title={
        old
          ? "Zurück zur heutigen Fassung"
          : "Diese Seite im Stand von 2011 ansehen"
      }
      className="hidden shrink-0 rounded-brand border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:border-border-strong hover:text-foreground lg:inline-block"
    >
      {old ? "2011 → heute" : "Ansicht 2011"}
    </button>
  );
}
