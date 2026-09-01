import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { articles, getArticle } from "../../lib/articles";
import { site } from "../../lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/wissen/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published,
    },
    // Drafts stay out of the index until they have been through a real edit.
    robots: article.draft ? { index: false, follow: true } : undefined,
  };
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Article schema so the piece can be cited as a source, which is the whole
  // reason this section exists.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published,
    inLanguage: "de-CH",
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/wissen/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-6 py-20 md:py-28">
          <Link
            href="/wissen"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-1"
            >
              &larr;
            </span>
            Wissen
          </Link>

          {article.draft ? (
            <p className="mt-8 rounded-brand border border-border bg-surface px-4 py-3 text-sm text-muted">
              Entwurf. Dieser Text ist noch nicht freigegeben und wird von
              Suchmaschinen nicht indexiert.
            </p>
          ) : null}

          <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tighter md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 font-mono text-xs uppercase tracking-wider text-muted">
            {formatDate(article.published)} · {article.readingMinutes} Minuten
          </p>

          <div className="mt-12 flex flex-col gap-6">
            {article.blocks.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={index}
                    className="mt-6 text-2xl font-semibold tracking-tight"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={index} className="flex flex-col gap-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 h-1 w-4 shrink-0 bg-accent"
                        />
                        <span className="leading-relaxed text-muted-strong">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={index}
                  className="text-lg leading-relaxed text-muted-strong"
                >
                  {block.text}
                </p>
              );
            })}
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="text-muted">
              Klingt das nach Ihrer Situation? Wir schauen uns Ihre Seite an.
            </p>
            <Link
              href="/#kontakt"
              className="mt-5 inline-block rounded-brand bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover active:translate-y-px"
            >
              Angebot anfordern
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
