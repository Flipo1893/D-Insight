"use client";

import { useMemo, useState } from "react";
import { pricing } from "../lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const franc = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
  maximumFractionDigits: 0,
});

/**
 * Takes the biggest objection ("what does this even cost") off the table
 * before someone has to write an email to find out. The numbers come from
 * content.ts and are placeholders until the two of them sign off on them.
 */
export default function Estimator() {
  const [pages, setPages] = useState(6);
  const [selected, setSelected] = useState<string[]>(["redesign"]);

  const total = useMemo(() => {
    const chosen = pricing.options.filter((o) => selected.includes(o.id));
    const min =
      pricing.base.min + pages * pricing.perPage.min +
      chosen.reduce((sum, o) => sum + o.min, 0);
    const max =
      pricing.base.max + pages * pricing.perPage.max +
      chosen.reduce((sum, o) => sum + o.max, 0);
    return { min, max };
  }, [pages, selected]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  return (
    <section id="rechner" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-2xl">
            Was kostet das ungefähr?
          </SectionHeading>
          <p className="mt-5 max-w-xl text-muted">
            Stellen Sie zusammen, was Sie brauchen. Sie sehen sofort eine
            Spanne, statt darauf warten zu müssen.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-8">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label
                    htmlFor="pages"
                    className="text-sm font-medium text-muted-strong"
                  >
                    Anzahl Seiten
                  </label>
                  <output
                    htmlFor="pages"
                    className="font-mono text-sm tabular-nums text-foreground"
                  >
                    {pages === 20 ? "20+" : pages}
                  </output>
                </div>
                <input
                  id="pages"
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={pages}
                  onChange={(event) => setPages(Number(event.target.value))}
                  className="mt-4 w-full accent-[var(--accent)]"
                />
                <div className="mt-1 flex justify-between font-mono text-xs text-muted">
                  <span>1</span>
                  <span>20+</span>
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-muted-strong">
                  Was soll dazu?
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {pricing.options.map((option) => {
                    const active = selected.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer gap-3 rounded-brand border p-4 transition-colors duration-200 ${
                          active
                            ? "border-accent bg-[var(--accent-soft)]"
                            : "border-border bg-surface hover:border-border-strong"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggle(option.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                            {option.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="lg:sticky lg:top-28 rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
              <p className="text-sm text-muted">Geschätzte Spanne</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                {franc.format(total.min)}
              </p>
              <p className="text-sm text-muted">bis {franc.format(total.max)}</p>

              <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted">
                Eine Orientierung, kein Angebot. Der genaue Preis hängt vom
                Zustand Ihrer bestehenden Seite ab, den wir in der Analyse
                anschauen.
              </p>

              <a
                href="#kontakt"
                className="mt-6 block rounded-brand bg-accent-strong px-6 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
              >
                Genaues Angebot anfordern
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
