import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CtaBanner from "../../components/CtaBanner";
import type { CheckStatus } from "@/lib/site-check/analyse";
import { loadReport, reportTtlDays } from "@/lib/site-check/store";
import { site } from "../../lib/content";

type Params = { params: Promise<{ id: string }> };

const statusStyles: Record<CheckStatus, { dot: string; label: string }> = {
  gut: { dot: "bg-emerald-400", label: "in Ordnung" },
  teilweise: { dot: "bg-amber-400", label: "verbesserbar" },
  fehlt: { dot: "bg-accent", label: "fehlt" },
};

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const stored = await loadReport(id);
  if (!stored) return { title: "Bericht nicht gefunden" };

  const name = host(stored.report.finalUrl);
  return {
    title: `Schnellcheck: ${name}`,
    description: `${stored.report.score} von 100 Punkten für ${name}, geprüft auf acht Punkte, die über die Auffindbarkeit entscheiden.`,
    // A report holds someone else's address and findings. It is reachable by
    // link on purpose, but it has no business turning up in search results.
    robots: { index: false, follow: false },
  };
}

/**
 * A shared report.
 *
 * The reason this exists: someone runs the check, sees five red dots, and
 * needs to show their boss. Without a link they screenshot it, and our name
 * falls off on the way. With one, the person who decides sees the findings
 * and who found them.
 */
export default async function SharedReport({ params }: Params) {
  const { id } = await params;
  const stored = await loadReport(id);
  if (!stored) notFound();

  const { report, rival } = stored;
  const open = report.items.filter((item) => item.status !== "gut").length;
  const name = host(report.finalUrl);

  const expires = new Date(stored.createdAt);
  expires.setDate(expires.getDate() + reportTtlDays);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Schnellcheck
          </p>
          <h1 className="mt-4 break-words text-4xl font-semibold leading-tight tracking-tighter md:text-5xl">
            {name}
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-border pb-6">
            <p className="text-5xl font-semibold tracking-tight tabular-nums">
              {report.score}
              <span className="text-2xl text-muted"> / 100</span>
            </p>
            <p className="text-muted-strong">
              {open > 0
                ? `${open} ${open === 1 ? "Punkt" : "Punkte"} mit Handlungsbedarf`
                : "Technisch sauber aufgestellt"}
            </p>
            <p className="ml-auto font-mono text-xs text-muted">
              {report.loadMs} ms · {report.htmlKb} KB
            </p>
          </div>

          {rival && (
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-brand border border-border bg-surface p-4">
              <p className="text-sm">
                <span className="font-mono text-xs text-muted">{name}</span>{" "}
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
            </div>
          )}

          <ul className="mt-2">
            {report.items.map((item, index) => {
              const other = rival?.items[index];
              return (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-border py-5"
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
                    <span
                      aria-label={`Vergleichsseite: ${statusStyles[other.status].label}`}
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusStyles[other.status].dot}`}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6">
            <p className="font-medium">Diesen Bericht besprechen?</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Der Check betrachtet nur die Startseite. Wir schauen uns die
              ganze Seite an und sagen Ihnen, was sich zuerst lohnt.
            </p>
            <Link
              href="/#kontakt"
              className="mt-5 inline-block rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
            >
              Angebot anfordern
            </Link>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted">
            Geprüft am{" "}
            {stored.createdAt.toLocaleDateString("de-CH", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            von {site.name}. Dieser Bericht ist über den Link erreichbar und
            wird am{" "}
            {expires.toLocaleDateString("de-CH", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            automatisch gelöscht.{" "}
            <Link
              href="/#schnellcheck"
              className="underline transition-colors hover:text-foreground"
            >
              Eigene Seite prüfen
            </Link>
          </p>
        </div>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
