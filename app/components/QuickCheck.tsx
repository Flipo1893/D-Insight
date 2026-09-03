"use client";

import { useState, type FormEvent } from "react";
import type { CheckResponse, CheckStatus } from "@/lib/site-check/analyse";
import type { AiVerdict } from "@/lib/site-check/ai/judge";
import { rememberCheckedUrl } from "@/lib/checked-url";
import { measured } from "../lib/content";
import LoadTime from "./LoadTime";
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

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const formatMeasuredDate = (value: string) =>
  new Date(value).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const fieldClass =
  "w-full rounded-brand border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-border-strong focus:border-accent";

/**
 * Lead magnet: run the service we sell on the visitor's own site and show the
 * result. Findings are explained in plain language, because the point is that
 * a business owner understands what is wrong, not that we look clever.
 *
 * The optional second address turns the report into a comparison. "Your
 * competitor has structured data, you do not" argues harder than any sentence
 * we could write ourselves.
 */
export default function QuickCheck() {
  const [url, setUrl] = useState("");
  const [rivalUrl, setRivalUrl] = useState("");
  const [compare, setCompare] = useState(false);
  const [report, setReport] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  /**
   * The assessment arrives on its own, after the numbers. Measuring takes
   * about a second and a language model takes ten to twenty, so asking for
   * both in one request meant staring at a spinner long after the numbers
   * were ready. "idle" means nothing was asked for.
   */
  const [aiState, setAiState] = useState<"idle" | "pending" | "done">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setReport(null);
    setShareUrl(null);
    setCopied(false);
    setAiState("idle");

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, rivalUrl: compare ? rivalUrl : "" }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Die Prüfung hat nicht geklappt.");
      } else {
        const result = data as CheckResponse;
        setReport(result);
        rememberCheckedUrl(result.finalUrl);
        void loadAssessment(result.finalUrl);
      }
    } catch {
      setError("Die Prüfung hat nicht geklappt. Bitte versuchen Sie es erneut.");
    } finally {
      setPending(false);
    }
  }

  /**
   * Deliberately not awaited by the submit handler and deliberately silent
   * on failure. The visitor came for the numbers, which they already have;
   * our model being slow or unreachable is our problem, and an error message
   * about it would only be noise next to a report that is complete.
   */
  async function loadAssessment(finalUrl: string) {
    setAiState("pending");
    try {
      const response = await fetch("/api/check/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      });
      const data = (await response.json()) as { ai?: AiVerdict | null };
      // Attached to whichever report is on screen, and only if the visitor
      // has not started another check in the meantime.
      setReport((current) =>
        current && current.finalUrl === finalUrl
          ? { ...current, ai: data.ai ?? null }
          : current,
      );
    } catch {
      // Left as it was: no assessment, no complaint.
    } finally {
      setAiState("done");
    }
  }

  /**
   * Asks the server to run the check again and keep the result. What gets
   * stored is always the report the server computed, never something posted
   * from here, so a shared link cannot be forged.
   */
  async function handleShare() {
    setSharing(true);
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          rivalUrl: compare ? rivalUrl : "",
          share: true,
        }),
      });
      const data = (await response.json()) as CheckResponse;
      if (response.ok && data.shareId) {
        setShareUrl(new URL(`/check/${data.shareId}`, window.location.origin).toString());
      } else {
        setError(
          "Der Bericht konnte nicht gespeichert werden. Der Check selbst funktioniert trotzdem.",
        );
      }
    } catch {
      setError("Der Bericht konnte nicht gespeichert werden.");
    } finally {
      setSharing(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard access can be refused. The link stays selectable either way.
    }
  }

  // Anything not fully in order is something we could work on, so "teilweise"
  // counts towards the number the handover quotes.
  const open = report
    ? report.items.filter((item) => item.status !== "gut").length
    : 0;

  const rival = report?.rival ?? null;
  // Only worth calling out where the other site is genuinely ahead.
  const behind = rival
    ? report!.items.filter((item, index) => {
        const other = rival.items[index];
        return item.status === "fehlt" && other?.status === "gut";
      })
    : [];

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
                Adresse eintragen, wir prüfen in Sekunden 16 Punkte: acht zur
                Auffindbarkeit und acht zur Barrierefreiheit. Kostenlos, ohne
                Anmeldung.
              </p>

              {/* Our own numbers, next to the tool that judges other people's.
                  Claiming speed without ever naming a figure is the kind of
                  thing this check exists to catch. */}
              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-6">
                {[
                  [`${measured.totalKb} KB`, "diese Seite lädt"],
                  [`${measured.requests}`, "Anfragen gesamt"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                      {value}
                    </dd>
                    <p aria-hidden className="mt-0.5 text-xs text-muted">
                      {label}
                    </p>
                  </div>
                ))}
              </dl>
              <LoadTime />
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">
                Gemessen am {formatMeasuredDate(measured.date)} am fertigen
                Build, mit Kompression. Nachprüfbar mit denselben Werkzeugen,
                die oben Ihre Seite prüfen.
              </p>
            </Reveal>
          </div>

          <Reveal index={1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
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
                  className={fieldClass}
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="shrink-0 rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Wird geprüft" : "Jetzt prüfen"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="compare"
                  type="checkbox"
                  checked={compare}
                  onChange={(event) => setCompare(event.target.checked)}
                  disabled={pending}
                  className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <label htmlFor="compare" className="text-sm text-muted">
                  Mit einer zweiten Seite vergleichen
                </label>
              </div>

              {compare && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="rival-url" className="text-sm text-muted-strong">
                    Adresse der Vergleichsseite
                  </label>
                  <input
                    id="rival-url"
                    name="rivalUrl"
                    type="text"
                    inputMode="url"
                    value={rivalUrl}
                    onChange={(event) => setRivalUrl(event.target.value)}
                    disabled={pending}
                    placeholder="mitbewerber.ch"
                    className={fieldClass}
                  />
                </div>
              )}
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

                {rival && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-brand border border-border bg-surface p-4">
                    <p className="text-sm">
                      <span className="font-mono text-xs text-muted">
                        {host(report.finalUrl)}
                      </span>{" "}
                      <span className="font-semibold tabular-nums">
                        {report.score}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-mono text-xs text-muted">
                        {host(rival.finalUrl)}
                      </span>{" "}
                      <span className="font-semibold tabular-nums">
                        {rival.score}
                      </span>
                    </p>
                    <p className="text-sm text-muted-strong">
                      {report.score > rival.score
                        ? "Sie liegen vorn."
                        : report.score < rival.score
                          ? "Die andere Seite liegt vorn."
                          : "Gleichstand."}
                    </p>
                  </div>
                )}

                {report.rivalError && (
                  <p className="mt-4 text-sm text-accent-text">
                    Vergleichsseite: {report.rivalError}
                  </p>
                )}

                <ul className="mt-2">
                  {report.items.map((item, index) => {
                    const other = rival?.items[index];
                    return (
                      <li
                        key={item.id}
                        className="flex gap-4 border-b border-border py-4"
                      >
                        <span
                          aria-hidden
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusStyles[item.status].dot}`}
                        />
                        <div className="min-w-0 flex-1">
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
                        {other && (
                          <div className="flex shrink-0 items-start gap-2 pt-0.5">
                            <span className="font-mono text-[11px] text-muted">
                              {host(rival!.finalUrl)}
                            </span>
                            <span
                              aria-label={`Vergleichsseite: ${statusStyles[other.status].label}`}
                              className={`mt-1.5 h-2 w-2 rounded-full ${statusStyles[other.status].dot}`}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Accessibility as its own block with its own score, rather
                    than mixed into the visibility findings. The two answer
                    different questions and one of them is becoming a legal
                    requirement, so it deserves its own heading. */}
                <div className="mt-10">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      Barrierefreiheit
                    </h3>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                      {report.a11yScore}
                      <span className="text-base text-muted"> / 100</span>
                    </p>
                  </div>

                  <ul>
                    {report.a11yItems.map((item) => (
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

                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    Farbkontraste, Fokusreihenfolge und Tastaturbedienung
                    lassen sich nur an der dargestellten Seite prüfen, nicht am
                    Quelltext. Sie sind hier bewusst nicht bewertet.
                  </p>
                </div>

                {/* Kept apart from the two blocks above, and labelled as an
                    assessment rather than a measurement. Everything else on
                    this page is reproducible with the same tools; this part
                    is a model's opinion and can be wrong. Mixing the two
                    would make the honest numbers carry the doubt. */}
                {aiState === "pending" && !report.ai && (
                  <p className="mt-10 border-t border-border pt-6 text-sm text-muted">
                    Ein Sprachmodell liest gerade Ihre Texte. Das dauert einen
                    Moment und ändert nichts an den Werten oben.
                  </p>
                )}

                {report.ai && (
                  <div className="mt-10">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-4">
                      <h3 className="text-lg font-semibold tracking-tight">
                        Inhaltliche Einschätzung
                      </h3>
                      <p className="text-2xl font-semibold tracking-tight tabular-nums">
                        {report.ai.score}
                        <span className="text-base text-muted"> / 100</span>
                      </p>
                    </div>

                    <ul>
                      {report.ai.items.map((item) => (
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

                    <p className="mt-4 text-xs leading-relaxed text-muted">
                      Die Punkte oben sind gemessen. Dieser Abschnitt ist die
                      Einschätzung eines Sprachmodells (
                      <span className="font-mono">{report.ai.model}</span>) und
                      beurteilt, ob Ihre Texte verständlich sind, nicht ob sie
                      vorhanden sind. Sprachmodelle irren sich. Widersprechen
                      Sie uns, wenn ein Befund nicht stimmt.
                    </p>
                  </div>
                )}

                {/* The findings are the argument, so the handover names them
                    instead of repeating a generic CTA. The address is carried
                    into the form, so nobody types it twice. */}
                <div className="mt-8 rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
                  <p className="font-medium">
                    {behind.length > 0
                      ? `${behind.length} ${behind.length === 1 ? "Punkt, den" : "Punkte, die"} die Vergleichsseite hat und Ihre nicht.`
                      : open > 0
                        ? `${open} ${open === 1 ? "Punkt" : "Punkte"} mit Handlungsbedarf.`
                        : "Technisch sauber aufgestellt."}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                    {open > 0
                      ? "Der Check betrachtet nur die Startseite. Wir schauen uns die ganze Seite an und sagen Ihnen, was sich zuerst lohnt."
                      : "Der Check betrachtet nur die Startseite. Für Inhalte, Struktur und Ladezeit unter echten Bedingungen schauen wir genauer hin."}
                  </p>
                  <a
                    href="#kontakt"
                    className="mt-5 inline-block rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
                  >
                    Angebot anfordern
                  </a>
                  <p className="mt-3 text-xs text-muted">
                    Ihre Adresse ist im Formular bereits eingetragen.
                  </p>

                  {/* Someone who sees five red dots usually has to show them
                      to whoever decides. Without a link they screenshot it,
                      and our name falls off on the way. */}
                  <div className="mt-6 border-t border-border pt-5">
                    {shareUrl ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm text-muted-strong">
                          Link zum Weitergeben:
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            readOnly
                            value={shareUrl}
                            aria-label="Link zum Bericht"
                            onFocus={(event) => event.currentTarget.select()}
                            className="min-w-0 flex-1 rounded-brand border border-border bg-background px-3 py-2 font-mono text-xs text-muted-strong"
                          />
                          <button
                            type="button"
                            onClick={copyLink}
                            className="shrink-0 rounded-brand border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong"
                          >
                            {copied ? "Kopiert" : "Kopieren"}
                          </button>
                        </div>
                        <p className="text-xs text-muted">
                          Wer den Link hat, sieht den Bericht. Er wird nach 30
                          Tagen automatisch gelöscht.
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleShare}
                        disabled={sharing}
                        className="text-sm font-semibold text-accent-text transition-colors hover:text-foreground disabled:opacity-60"
                      >
                        {sharing
                          ? "Wird gespeichert"
                          : "Bericht teilbar machen"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
