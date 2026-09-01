"use client";

import { useState, type FormEvent } from "react";
import type { CheckReport, CheckStatus } from "@/lib/site-check/analyse";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const statusStyles: Record<CheckStatus, { dot: string; label: string }> = {
  gut: { dot: "bg-emerald-400", label: "in Ordnung" },
  teilweise: { dot: "bg-amber-400", label: "verbesserbar" },
  fehlt: { dot: "bg-accent", label: "fehlt" },
};

function scoreTone(score: number) {
  if (score >= 80) return "Solide Basis.";
  if (score >= 50) return "Da ist Luft nach oben.";
  return "Hier liegt einiges brach.";
}

/**
 * Lead magnet: run the service we sell on the visitor's own site and show
 * the result. Findings are deliberately explained in plain language, because
 * the point is that a business owner understands what is wrong, not that we
 * look clever.
 */
export default function QuickCheck() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<CheckReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Die Prüfung hat nicht geklappt.");
      } else {
        setReport(data as CheckReport);
      }
    } catch {
      setError("Die Prüfung hat nicht geklappt. Bitte versuchen Sie es erneut.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="schnellcheck" className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading>
                Was sagt Ihre
                <br />
                Website gerade?
              </SectionHeading>
              <p className="mt-5 max-w-sm text-muted">
                Adresse eintragen, wir prüfen in Sekunden acht Punkte, die
                darüber entscheiden, ob Sie gefunden werden. Kostenlos, ohne
                Anmeldung.
              </p>
            </Reveal>
          </div>

          <Reveal index={1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="check-url" className="sr-only">
                Adresse Ihrer Website
              </label>
              <input
                id="check-url"
                name="url"
                type="text"
                inputMode="url"
                required
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={pending}
                placeholder="ihre-website.ch"
                className="w-full rounded-brand border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-border-strong focus:border-accent"
              />
              <button
                type="submit"
                disabled={pending}
                className="shrink-0 rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Wird geprüft" : "Jetzt prüfen"}
              </button>
            </form>

            <p aria-live="polite" className="mt-3 min-h-5 text-sm">
              {error ? <span className="text-accent-text">{error}</span> : null}
            </p>

            {pending && (
              <div className="mt-6 flex flex-col gap-3" aria-hidden>
                {/* Skeleton matching the result rows, so the layout does not
                    jump when the report arrives. */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-brand border border-border bg-surface"
                    style={{ animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
            )}

            {report && (
              <div className="mt-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-5">
                  <p className="text-4xl font-semibold tracking-tight tabular-nums">
                    {report.score}
                    <span className="text-xl text-muted"> / 100</span>
                  </p>
                  <p className="text-muted-strong">{scoreTone(report.score)}</p>
                  <p className="ml-auto font-mono text-xs text-muted">
                    {report.loadMs} ms · {report.htmlKb} KB
                  </p>
                </div>

                <ul className="mt-2">
                  {report.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 border-b border-border py-4"
                    >
                      <span
                        aria-hidden
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusStyles[item.status].dot}`}
                      />
                      <div className="min-w-0">
                        <p className="font-medium">
                          {item.label}
                          <span className="ml-2 text-sm font-normal text-muted">
                            {statusStyles[item.status].label}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-muted">
                  Der Check betrachtet die Startseite. Für ein vollständiges
                  Bild schauen wir uns die ganze Seite an.{" "}
                  <a
                    href="#kontakt"
                    className="font-medium text-accent-text transition-colors hover:text-foreground"
                  >
                    Angebot anfordern
                  </a>
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
