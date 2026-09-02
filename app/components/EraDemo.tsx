"use client";

import { useState } from "react";

/**
 * A miniature website that flips between 2011 and today.
 *
 * The first version put this switch in the header and reskinned the whole
 * site. It made the point at the cost of the site: a visitor who arrived
 * mid-transformation just saw a broken page, and the control had no context
 * next to a login link.
 *
 * Contained in a frame with a sentence above it, the same idea reads as a
 * demonstration. Same content on both sides, same structure, only type,
 * colour and surface change, which is exactly what a relaunch does.
 *
 * The frame is explicitly labelled as an example and carries no browser
 * chrome. Dressing a div up as a screenshot of a real product is the
 * clearest tell there is, and the interactivity is the point anyway.
 */

const nav = ["Home", "Über uns", "Galerie", "Kontakt"];

const services = [
  ["Neubau", "Ein- und Mehrfamilienhäuser"],
  ["Umbau", "Aufstockungen und Anbauten"],
  ["Innenausbau", "Küchen, Böden, Einbauten"],
];

export default function EraDemo() {
  const [old, setOld] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl leading-relaxed text-muted">
          Dieselbe Firma, derselbe Text, dieselbe Struktur. Nur Typografie,
          Farben und Flächen sind von damals. Legen Sie den Schalter um.
        </p>

        {/* Both states are named on the control, so it reads as a switch
            rather than as a button whose effect you have to guess. */}
        <div
          role="group"
          aria-label="Darstellung wählen"
          className="flex shrink-0 rounded-brand border border-border p-1"
        >
          {[
            { label: "2011", value: true },
            { label: "Heute", value: false },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setOld(option.value)}
              aria-pressed={old === option.value}
              className={`rounded-brand px-4 py-1.5 text-sm font-medium transition-colors ${
                old === option.value
                  ? "bg-accent-strong text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        {...(old ? { "data-era": "2011" } : {})}
        aria-label={`Beispielwebsite, Darstellung ${old ? "2011" : "heute"}`}
        className="era-demo mt-6 overflow-hidden rounded-brand border border-border bg-surface"
      >
        {/* Header bar */}
        <div className="era-demo__bar flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Holzbau Muster{old ? " AG" : ""}
            </p>
            {old && (
              <p className="text-sm opacity-80">
                Ihr Partner für Holzbau seit 1998
              </p>
            )}
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {(old ? nav : nav.slice(0, 3)).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-8">
          <div>
            <p
              className={
                old
                  ? "text-xl font-bold"
                  : "text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
              }
            >
              {old
                ? "Herzlich Willkommen auf unserer Homepage!"
                : "Holz, das Generationen überdauert."}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {old
                ? "Wir freuen uns, dass Sie den Weg auf unsere Internetseite gefunden haben. Auf den folgenden Seiten möchten wir Ihnen unser Unternehmen und unsere Dienstleistungen näher vorstellen."
                : "Dachstühle, Anbauten und Innenausbau aus einer Hand. Seit 1998 im Kanton Zürich."}
            </p>

            {old ? (
              <p className="mt-4 text-sm">
                <a href="#beispiele">&gt;&gt; hier klicken für mehr Informationen</a>
              </p>
            ) : (
              <a
                href="#beispiele"
                className="era-demo__cta mt-5 inline-block rounded-brand bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white"
              >
                Projekt besprechen
              </a>
            )}

            {old && (
              <p className="mt-5 border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
                Diese Seite ist optimiert für Internet Explorer, 1024 x 768
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div
              className={`era-demo__art h-32 rounded-brand md:h-40 ${
                old ? "" : "bg-gradient-to-br from-[#cbb49c] to-[#8a6a4a]"
              }`}
            />
            <div className="grid grid-cols-3 gap-3">
              {services.map(([title, detail]) => (
                <div key={title} className={old ? "" : "min-w-0"}>
                  <p className="truncate text-sm font-semibold">{title}</p>
                  {!old && (
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Der Umbau kostet hier einen Klick, weil nichts im Code eine Farbe oder
        eine Schrift fest verdrahtet. Genau so bauen wir auch Ihre Seite.
      </p>
    </div>
  );
}
