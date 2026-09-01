import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";
import { isMongoConfigured } from "@/lib/mongodb/config";
import { listSites } from "@/lib/mongodb/sites";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Kunden",
  robots: { index: false, follow: false },
};

export default async function Kunden() {
  const user = await getCurrentUser();
  if (!isAdminEmail(user?.email)) {
    notFound();
  }

  if (!isMongoConfigured) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Kunden</h2>
        <p className="mt-4 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          MongoDB ist noch nicht konfiguriert — sobald{" "}
          <code className="text-foreground">MONGODB_URI</code> gesetzt ist,
          erscheinen hier alle Kundenwebsites.
        </p>
      </div>
    );
  }

  const sites = await listSites();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Kunden</h2>
      <p className="mt-2 max-w-xl text-muted">
        Alle Kund:innen, die sich im Portal angemeldet haben. Pro Kunde legen
        Sie hier fest, welche Felder er oder sie auf der eigenen Website
        bearbeiten darf.
      </p>

      {sites.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          Noch keine Kund:innen — sobald sich jemand registriert und den
          Kundenbereich öffnet, erscheint er hier.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {sites.map((site) => (
            <Link
              key={site.userId}
              href={`/dashboard/kunden/${site.userId}`}
              className="group grid gap-2 py-4 transition-colors hover:bg-surface/60 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-6"
            >
              <div>
                <p className="font-medium">
                  {site.siteName || "Ohne Projektnamen"}
                </p>
                <p className="text-sm text-muted">{site.email || site.userId}</p>
              </div>
              <p className="truncate text-sm text-muted">
                {site.siteUrl || "Keine Website hinterlegt"}
              </p>
              <p className="text-sm text-muted">
                {site.fields.length} Feld{site.fields.length === 1 ? "" : "er"}{" "}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
