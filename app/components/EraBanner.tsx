"use client";

import { useSyncExternalStore } from "react";
import { setEra } from "./EraSwitch";

/**
 * Explains the 2011 view while it is on.
 *
 * Without this the switch is just a broken-looking page and the visitor is
 * left wondering whether something went wrong. The line names what they are
 * seeing and offers the way back in the same sentence.
 */
const ERA_EVENT = "d-insight:era";

function subscribe(onChange: () => void) {
  window.addEventListener(ERA_EVENT, onChange);
  return () => window.removeEventListener(ERA_EVENT, onChange);
}

function snapshot() {
  return document.documentElement.dataset.era === "2011";
}

export default function EraBanner() {
  const old = useSyncExternalStore(subscribe, snapshot, () => false);
  if (!old) return null;

  return (
    <div role="status" className="era-note">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm xl:max-w-7xl 2xl:max-w-[1440px]">
        <p>
          Sie sehen diese Seite so, wie sie 2011 ausgesehen hätte. Gleicher
          Inhalt, gleiche Struktur, nur Typografie, Farben und Flächen von
          damals.
        </p>
        <button
          type="button"
          onClick={() => setEra("heute")}
          className="shrink-0 font-semibold underline"
        >
          Zurück zu heute
        </button>
      </div>
    </div>
  );
}
