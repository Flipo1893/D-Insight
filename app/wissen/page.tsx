import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { articles } from "../lib/articles";

export const metadata: Metadata = {
  title: "Wissen",
  description:
    "Artikel zu Website-Relaunch, Ladezeiten und Sichtbarkeit in der KI-Suche. Praxisnah erklärt, ohne Fachjargon.",
  alternates: { canonical: "/wissen" },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function Wissen() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
            Wissen
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Was wir bei Relaunches immer wieder sehen, aufgeschrieben für
            Menschen, die keine Entwickler sind.
          </p>

          <ul className="mt-16 border-t border-border">
            {articles.map((article, index) => (
              <Reveal key={article.slug} index={index}>
                <li className="border-b border-border">
                  <Link
                    href={`/wissen/${article.slug}`}
                    className="group flex flex-col gap-3 py-8 transition-colors md:flex-row md:items-baseline md:gap-10"
                  >
                    <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted md:w-40">
                      {formatDate(article.published)}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent-text md:text-2xl">
                          {article.title}
                        </span>
                        {article.draft ? (
                          <span className="rounded-brand border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">
                            Entwurf
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-2 block max-w-xl leading-relaxed text-muted">
                        {article.excerpt}
                      </span>
                      <span className="mt-3 block font-mono text-xs text-muted">
                        {article.readingMinutes} Minuten
                      </span>
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
