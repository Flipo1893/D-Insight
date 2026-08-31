import type { Metadata } from "next";
import Link from "next/link";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { getWebsiteContent } from "@/lib/mongodb/websites";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const content =
    isMongoConfigured && user ? await getWebsiteContent(user.id) : null;

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-xl text-muted">
        Hier verwalten Sie künftig Ihre gerefactorte Website: Inhalte anpassen
        und Ihre Traffic-Zahlen im Blick behalten.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/inhalte"
          className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
        >
          <p className="text-sm text-muted">Website-Inhalte</p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold">
            Inhalte bearbeiten
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            {content
              ? `Zuletzt geändert am ${content.updatedAt.toLocaleDateString("de-DE")}.`
              : "Noch keine eigenen Inhalte gespeichert."}
          </p>
        </Link>

        <Link
          href="/dashboard/traffic"
          className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent"
        >
          <p className="text-sm text-muted">Traffic</p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold">
            Zahlen ansehen
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Besucher, Seitenaufrufe und meistgesehene Seiten.
          </p>
        </Link>
      </div>
    </div>
  );
}
