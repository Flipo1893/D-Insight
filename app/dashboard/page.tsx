import type { Metadata } from "next";
import Link from "next/link";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getWebsiteContent } from "@/lib/mongodb/websites";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const cards = [
  {
    href: "/dashboard/inhalte",
    kicker: "Website-Inhalte",
    title: "Inhalte bearbeiten",
  },
  {
    href: "/dashboard/traffic",
    kicker: "Traffic",
    title: "Zahlen ansehen",
    description: "Besucher, Seitenaufrufe und meistgesehene Seiten.",
  },
];

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const content =
    isMongoConfigured && user ? await getWebsiteContent(user.id) : null;

  const contentDescription = content
    ? `Zuletzt geändert am ${content.updatedAt.toLocaleDateString("de-CH")}.`
    : "Noch keine eigenen Inhalte gespeichert.";

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-xl text-muted">
        Hier verwalten Sie Ihre Website: Inhalte anpassen und Ihre
        Besucherzahlen im Blick behalten.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="sheen group rounded-brand border border-border bg-gradient-to-br from-surface to-surface-2/40 p-6 transition-colors duration-300 hover:border-border-strong"
          >
            <p className="text-sm text-muted">{card.kicker}</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight">
              {card.title}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted">
              {card.description ?? contentDescription}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
