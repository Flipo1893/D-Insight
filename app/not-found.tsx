import type { Metadata } from "next";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { primaryCta } from "./lib/content";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

/**
 * Next ships an English "This page could not be found" by default, which is
 * the wrong language and off-brand. A 404 is also a chance to route someone
 * back into the funnel rather than dead-ending them.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative isolate flex flex-1 items-center px-6 py-24">
        <div className="hero-visual" aria-hidden>
          <div className="hero-visual__grid" />
          <div className="hero-visual__orb hero-visual__orb--a" />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <p className="font-mono text-sm uppercase tracking-wider text-accent-text">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
            Diese Seite gibt es nicht.
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Vielleicht hat sich ein Tippfehler eingeschlichen, oder die Seite
            ist umgezogen. Ironischerweise genau das, was wir bei Relaunches
            verhindern.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/"
              className="rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
            >
              Zur Startseite
            </Link>
            <Link
              href="/#kontakt"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text"
            >
              {primaryCta}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>

          <nav aria-label="Weitere Seiten" className="mt-14 border-t border-border pt-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
              <li>
                <Link href="/#leistungen" className="transition-colors hover:text-foreground">
                  Leistungen
                </Link>
              </li>
              <li>
                <Link href="/#beispiele" className="transition-colors hover:text-foreground">
                  Beispiele
                </Link>
              </li>
              <li>
                <Link href="/#prozess" className="transition-colors hover:text-foreground">
                  Prozess
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Kundenbereich
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
