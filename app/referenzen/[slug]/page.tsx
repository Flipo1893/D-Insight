import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CtaBanner from "../../components/CtaBanner";
import Reveal from "../../components/Reveal";
import SectionHeading from "../../components/SectionHeading";
import { getReference, references } from "../../lib/references";
import { site } from "../../lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return references.map((reference) => ({ slug: reference.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const reference = getReference(slug);
  if (!reference) return {};

  return {
    title: `${reference.client}`,
    description: reference.summary,
    alternates: { canonical: `/referenzen/${reference.slug}` },
  };
}

export default async function ReferenzDetail({ params }: Params) {
  const { slug } = await params;
  const reference = getReference(slug);
  if (!reference) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: reference.client,
    description: reference.summary,
    dateCreated: reference.year,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    ...(reference.url ? { url: reference.url } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <Link
            href="/referenzen"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-1"
            >
              &larr;
            </span>
            Referenzen
          </Link>

          <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted">
            {reference.industry} · {reference.year}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
            {reference.client}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {reference.summary}
          </p>

          {reference.url && (
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 py-2 text-sm font-semibold text-accent-text transition-colors hover:text-foreground"
            >
              {reference.url.replace(/^https?:\/\//, "")}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          )}

          {/* Numbers first: they are the part we can prove. */}
          <Reveal className="mt-14">
            <SectionHeading className="text-2xl md:text-3xl">
              Gemessen.
            </SectionHeading>
            <dl className="mt-8 grid gap-5 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {reference.results.map((result) => (
                <div key={result.label}>
                  <dt className="text-sm text-muted">{result.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                    {result.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
              Erhoben mit demselben Schnellcheck, den Sie auf der Startseite
              für Ihre eigene Seite ausführen können.
            </p>
          </Reveal>

          {reference.situation && (
            <Reveal className="mt-16">
              <SectionHeading className="text-2xl md:text-3xl">
                Ausgangslage.
              </SectionHeading>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted">
                {reference.situation}
              </p>
            </Reveal>
          )}

          {reference.work && reference.work.length > 0 && (
            <Reveal className="mt-16">
              <SectionHeading className="text-2xl md:text-3xl">
                Was wir gemacht haben.
              </SectionHeading>
              <ul className="mt-8 border-t border-border">
                {reference.work.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-b border-border py-5"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-4 shrink-0 bg-accent"
                    />
                    <span className="leading-relaxed text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
