import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { references } from "../lib/references";

export const metadata: Metadata = {
  title: "Referenzen",
  // Promises only what the entries actually carry. They are published with
  // the measured numbers first and the narrative added later, so a
  // description advertising "Ausgangslage und Vorgehen" was writing a cheque
  // the page could not cash.
  description:
    "Von uns gebaute Websites mit den Werten, die wir daran gemessen haben.",
  alternates: { canonical: "/referenzen" },
  // Nothing to index while the list is empty.
  robots: references.length === 0 ? { index: false, follow: true } : undefined,
};

export default function Referenzen() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
            Referenzen
          </h1>

          {references.length === 0 ? (
            <div className="mt-8 max-w-xl">
              <p className="text-lg leading-relaxed text-muted">
                Die ersten Projekte laufen gerade. Sobald sie live sind, stehen
                sie hier mit Ausgangslage, Vorgehen und messbarem Ergebnis.
              </p>
              <p className="mt-5 leading-relaxed text-muted">
                Wir zeigen lieber nichts als erfundene Fallbeispiele. Wenn Sie
                wissen möchten, wie wir arbeiten, schauen Sie sich diese Seite
                an: Sie ist nach denselben Regeln gebaut, die wir Ihnen
                empfehlen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/#kontakt"
                  className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
                >
                  Angebot anfordern
                </Link>
                <Link
                  href="/#schnellcheck"
                  className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text"
                >
                  Website prüfen lassen
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            /* Two columns need two cards. With one entry the second column
               is an empty half-screen next to the only thing on the page,
               which reads as something failing to load rather than as a
               short list. A single card is capped instead, so it sits at a
               readable width and the whitespace looks chosen. */
            <ul
              className={
                references.length === 1
                  ? "mt-16 max-w-xl"
                  : "mt-16 grid gap-6 sm:grid-cols-2"
              }
            >
              {references.map((reference, index) => (
                <Reveal key={reference.slug} index={index}>
                  <li className="h-full">
                    <Link
                      href={`/referenzen/${reference.slug}`}
                      className="sheen group flex h-full flex-col rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6 transition-colors duration-300 hover:border-border-strong"
                    >
                      <span className="font-mono text-xs uppercase tracking-wider text-muted">
                        {reference.industry} · {reference.year}
                      </span>
                      <span className="mt-3 text-xl font-semibold tracking-tight">
                        {reference.client}
                      </span>
                      <span className="mt-2 leading-relaxed text-muted">
                        {reference.summary}
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
